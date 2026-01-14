/**
 * Main Application Logic (Refactored for Multi-page)
 */

const app = {
    // State
    play: 0,
    pageMode: null, // 'simple' or 'compound'
    metronomeInterval: null,
    audioCtx: null, 
    
    // Config
    renderParams: { width: 900 },
    printerParams: { scale: 1, staffwidth: 900 },
    midiParams: { qpm: 100, miditrack: "" }, 
    barsNumber: 10,

    init: function() {
        // Detect Page Mode from Body Tag
        const body = document.body;
        this.pageMode = body.getAttribute('data-mode');

        // If no mode (e.g., landing page), stop here
        if (!this.pageMode) return;

        this.setupSliders();
        // No more accordions setup needed
        
        // Initial Generation
        this.generateCurrent();

        // Handle Window Resize to redraw paper
        window.addEventListener('resize', () => {
             // Debounce could be added here
             this.generateCurrent();
        });
    },

    setupSliders: function() {
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
                    
                    // If Tempo changes while playing MIDI, restart
                    if(id === 'listen_bpm' && this.play === 1) {
                        this.StopMidiClean();
                        this.playMidi(); 
                    }
                });
            }
        });
    },

    /* --- Metronome Logic --- */
    toggleMetronome: function() {
        const btn = document.getElementById('metro_btn');
        if(!btn) return;

        if (this.metronomeInterval) {
            this.stopMetronome();
            btn.textContent = "⏱ Metro";
            btn.classList.remove('contrast');
            btn.classList.add('secondary');
        } else {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            this.startMetronome();
            btn.textContent = "⏹ Stop";
            btn.classList.remove('secondary');
            btn.classList.add('contrast');
        }
    },

    startMetronome: function() {
        const el = document.getElementById('mtro_bpm');
        if(!el) return;
        
        const bpm = parseInt(el.value);
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

    /* --- MIDI Player --- */
    toggleMidi: function() {
        const btn = document.getElementById('play_pop');
        if(!btn) return;

        if(this.midiParams.miditrack){
            if(this.play === 0){
                this.playMidi();
                btn.textContent = "⏹ Stop";
                btn.classList.remove('contrast');
                btn.classList.add('secondary');
            } else {
                this.StopMidiClean();
                btn.textContent = "▶ Listen";
                btn.classList.remove('secondary');
                btn.classList.add('contrast');
            }
        } else {
            alert("Please generate a rhythm first.");
        }
    },

    StopMidiClean: function() {
        if(typeof stopActiveAudio === 'function') {
            stopActiveAudio();
        }
        this.play = 0;
    },

    playMidi: function() {
        try {
            var list_bpm = document.getElementById('listen_bpm').value;
            // midi_player.js globals:
            midiFile = MidiFile(this.midiParams.miditrack, list_bpm);
            synth = Synth(audioCtx.sampleRate); 
            replayer = Replayer(midiFile, synth);
            AudioPlayer(replayer);
            this.play = 1; 
        } catch (e) {
            console.error("MIDI Playback Error:", e);
            this.play = 0; 
        }
    },

    /* --- Generation Logic --- */
    
    generateCurrent: function() {
        // Wrapper to call the specific generation based on Page Mode
        if (this.pageMode === 'simple') {
            this.generate('simple');
        } else if (this.pageMode === 'compound') {
            this.generate('compound');
        }
    },

    generate: function(mode) {
        // 1. Calculate Dynamic Width based on the paper container
        const paperElement = document.getElementById('paper');
        if(!paperElement) return;

        // Approx padding adjustment
        const containerWidth = paperElement.clientWidth - 60; 
        
        this.renderParams.width = containerWidth;
        this.printerParams.staffwidth = containerWidth;
        
        // 2. Get Params
        // Note: 'bar_nbr' might not exist on simple pages if not added, but we added it in HTML
        const barEl = document.getElementById('bar_nbr');
        const tempoEl = document.getElementById('listen_bpm');
        
        const bars = barEl ? parseInt(barEl.value) : 10;
        const tempo = tempoEl ? parseInt(tempoEl.value) : 100;

        this.barsNumber = bars;
        this.midiParams.qpm = tempo;

        let staff = "";
        let midistaff = "";
        let preamble = "X:1\nT: Reading Exercise\nM:";
        let postamble = "\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff 4\n";
        let midiPreambleBase = "X:1\nT:Midi\nM:";

        // --- SIMPLE GENERATION ---
        if (mode === 'simple') {
            const meterIn = document.querySelector('input[name="mter"]:checked').value;
            const options = Array.from(document.querySelectorAll('input.onebeat:checked')).map(cb => cb.value);
            
            let diff = [document.querySelector('input[name="dif"]:checked').value];
            const dyn = document.querySelector('input[type="checkbox"].tdif:checked');
            if(dyn) diff.push(dyn.value);

            preamble += meterIn + postamble;
            
            // Calls external rdm_rhythm.js function
            staff = generate_reading_exercise(options, diff, meterIn, 'simple', (this.renderParams.width/1280), this.barsNumber);
            
            const midiPreamble = midiPreambleBase + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
            midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'simple');

        } 
        // --- COMPOUND GENERATION ---
        else if (mode === 'compound') {
            const meterIn = document.querySelector('input[name="cmeter"]:checked').value;
            const options = Array.from(document.querySelectorAll('input.cmp_onebeat:checked')).map(cb => cb.value);
            
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
