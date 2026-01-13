/**
 * Main Application Logic (Vanilla JS)
 */

const app = {
    // State matching legacy variables
    play: 0,
    activeMode: 'simple', // Tracks which generator logic to use
    metronomeInterval: null,
    audioCtx: null, // For JS Metronome
    
    // Config
    renderParams: { width: 900 },
    printerParams: { scale: 1, staffwidth: 900 },
    midiParams: { qpm: 100, miditrack: "" }, 
    barsNumber: 10,

    init: function() {
        this.setupSliders();
        this.setupAccordions();
        
        // Initial Generation
        this.generate('simple');
    },

    setupAccordions: function() {
        // Enforce "Accordion" behavior (only one open at a time)
        const dets = document.querySelectorAll('details');
        
        dets.forEach(targetDetail => {
            targetDetail.addEventListener("click", (e) => {
                const id = targetDetail.id;

                // Close others
                dets.forEach(detail => {
                    if (detail !== targetDetail) {
                        detail.removeAttribute("open");
                    }
                });
                
                // Update State for generator
                if (id === 'det-simple') this.activeMode = 'simple';
                else if (id === 'det-compound') this.activeMode = 'compound';
            });
        });
    },

    setupSliders: function() {
        // Removed pg_wdth and mdi_tmpo from list
        const sliders = ['bar_nbr', 'mtro_bpm', 'listen_bpm'];
        
        sliders.forEach(id => {
            const el = document.getElementById(id);
            const disp = document.getElementById('disp_' + id);
            
            if(el) {
                el.addEventListener('input', (e) => {
                    if(disp) disp.textContent = e.target.value;
                    
                    if(id === 'mtro_bpm' && this.metronomeInterval) {
                        this.stopMetronome();
                        this.startMetronome();
                    }
                    
                    // Legacy behavior: if slider moves while playing, restart midi
                    if(id === 'listen_bpm' && this.play === 1) {
                        this.StopSound('tune_wav');
                        this.play = 0;
                        this.playMidi(); 
                    }
                });
            }
        });
    },

    /* --- Metronome Logic (Vanilla JS Audio API) --- */
    toggleMetronome: function() {
        const btn = document.getElementById('metro_btn');
        if (this.metronomeInterval) {
            this.stopMetronome();
            btn.textContent = "⏱ Metronome";
            btn.classList.remove('contrast');
            btn.classList.add('secondary');
        } else {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            this.startMetronome();
            btn.textContent = "⏹ Stop Metronome";
            btn.classList.remove('secondary');
            btn.classList.add('contrast');
        }
    },

    startMetronome: function() {
        const bpm = parseInt(document.getElementById('mtro_bpm').value);
        const ms = 60000 / bpm;

        this.playBeep();
        this.metronomeInterval = setInterval(() => {
            this.playBeep();
        }, ms);
    },

    stopMetronome: function() {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
    },

    playBeep: function() {
        if (!this.audioCtx) return;
        
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.frequency.value = 1000; 
        osc.type = 'sine';
        gainNode.gain.value = 0.5; 

        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.1); 
    },

    /* --- MIDI Player (Legacy API Adaptation) --- */
    
    PlaySound: function(soundObjId) {
        var sound = document.getElementById(soundObjId);
        if (sound){
            sound.play();       
        }
    },

    StopSound: function(soundObjId) {
        var sound = document.getElementById(soundObjId);
        if (sound){
            sound.pause();
            sound.currentTime = 0;
        }
    },

    toggleMidi: function() {
        const btn = document.getElementById('play_pop');
        if(this.midiParams.miditrack){
            if(this.play === 0){
                this.playMidi();
                btn.textContent = "⏹ Stop MIDI";
                btn.classList.remove('contrast');
                btn.classList.add('secondary');
            } else {
                this.StopSound('tune_wav');
                this.play = 0;
                btn.textContent = "▶ Play MIDI";
                btn.classList.remove('secondary');
                btn.classList.add('contrast');
            }
        } else {
            alert("Please generate a rhythm first.");
        }
    },

    playMidi: function() {
        try {
            var list_bpm = document.getElementById('listen_bpm').value;
            // Legacy calls
            midiFile = MidiFile(this.midiParams.miditrack, list_bpm);     
            synth = Synth(22100);
            replayer = Replayer(midiFile, synth);
            AudioPlayer(replayer);
            
            this.PlaySound('tune_wav');             
            this.play = 1; 
        } catch (e) {
            console.error("Legacy MIDI Error:", e);
        }
    },

    /* --- Generation Logic --- */
    
    generateCurrent: function() {
        const simpleOpen = document.getElementById('det-simple').hasAttribute('open');
        const compoundOpen = document.getElementById('det-compound').hasAttribute('open');

        if (simpleOpen) {
            this.generate('simple');
        } else if (compoundOpen) {
            this.generate('compound');
        } else {
            this.generate(this.activeMode);
        }
    },

    generate: function(mode) {
        // 1. Calculate Dynamic Width
        const paperElement = document.getElementById('paper');
        // Get the width of the container, subtract padding (approx 40px)
        const containerWidth = paperElement.clientWidth - 190;
        
        this.renderParams.width = containerWidth;
        this.printerParams.staffwidth = containerWidth;
        
        // 2. Get Params
        const bars = parseInt(document.getElementById('bar_nbr').value);
        // Use the main playback slider for generation tempo as well
        const tempo = parseInt(document.getElementById('listen_bpm').value);

        this.barsNumber = bars;
        this.midiParams.qpm = tempo;

        let staff = "";
        let midistaff = "";
        let preamble = "X:1\nT: Reading Exercise\nM:";
        let postamble = "\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff 4\n";
        let midiPreambleBase = "X:1\nT:Midi\nM:";

        if (mode === 'simple') {
            const meterIn = document.querySelector('input[name="mter"]:checked').value;
            const options = Array.from(document.querySelectorAll('#det-simple input.onebeat:checked')).map(cb => cb.value);
            
            let diff = [document.querySelector('input[name="dif"]:checked').value];
            const dyn = document.querySelector('input[type="checkbox"].tdif:checked');
            if(dyn) diff.push(dyn.value);

            preamble += meterIn + postamble;
            staff = generate_reading_exercise(options, diff, meterIn, 'simple', (this.renderParams.width/1280), this.barsNumber);
            
            const midiPreamble = midiPreambleBase + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
            midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'simple');

        } else if (mode === 'compound') {
            const meterIn = document.querySelector('input[name="cmeter"]:checked').value;
            const options = Array.from(document.querySelectorAll('#det-compound input.cmp_onebeat:checked')).map(cb => cb.value);
            
            let diff = [document.querySelector('input[name="cdif"]:checked').value];
            const dyn = document.querySelector('input[type="checkbox"].cdif:checked');
            if(dyn) diff.push(dyn.value);

            if (meterIn === '7/8') {
                preamble += meterIn + postamble;
                staff = generate_reading_exercise_78(options, diff, (this.renderParams.width/1280), this.barsNumber);
            } else {
                preamble += meterIn + postamble;
                staff = generate_reading_exercise(options, diff, meterIn, 'compound', (this.renderParams.width/1280), this.barsNumber);
            }

            const midiPreamble = midiPreambleBase + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
            midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'compound');
        }

        // Render Visuals
        const finalAbc = preamble + staff;
        ABCJS.renderAbc('notation', finalAbc, {}, this.printerParams, this.renderParams);

        // Store MIDI string
        this.midiParams.miditrack = midistaff;

        // Render Audio/MIDI hidden container
        ABCJS.renderMidi('midicontainer', midistaff, {}, this.midiParams, {});
    },

    composeMidiStaff: function(staff, preamble, meter, type) {
        let loopMeter = 0;
        if (meter === '7/8') {
            loopMeter = 7;
        } else {
            const parts = meter.split('/');
            loopMeter = parseFloat(parts[0]);
            if (parts[1] !== '4') loopMeter = loopMeter / 3;
        }

        let midistr = '';
        const totalBeats = this.barsNumber * loopMeter;

        for (let i = 0; i < totalBeats; i++) {
            if (i % loopMeter === 0 && i !== (totalBeats - 1) && i !== 0) midistr += "|";
            if (type === 'simple') midistr += "e4";
            else if (meter === '7/8') midistr += "e2";
            else midistr += "e6";
        }

        let result = staff.replace(/\n/g, '');
        result = result.replace(/B/g, 'D,,');
        result = result.replace(/c/g, 'D,,');
        result = result.replace(/F/g, 'C,,');
        result = result.replace(/g/g, '^F,,');

        return preamble + result + "\n[V:v2] |" + midistr + "|]\n";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
