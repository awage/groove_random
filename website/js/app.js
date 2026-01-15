//    rdm_rhythm.js: Generators to produce random scores
//    Copyright (C) 2026 Alexandre Wagemakers (alexandre dot wagemakers at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

const app = {
    // State
    play: 0,
    pageMode: null, // 'simple', 'compound', 'sticking', 'grooves', 'comping'
    metronomeInterval: null,
    audioCtx: null, 
    
    // Config
    renderParams: { width: 900 },
    printerParams: { scale: 1, staffwidth: 900 },
    midiParams: { qpm: 100, miditrack: "" }, 
    barsNumber: 10,

    init: function() {
        const body = document.body;
        this.pageMode = body.getAttribute('data-mode');

        if (!this.pageMode) return;

        this.setupSliders();
        this.generateCurrent();

        window.addEventListener('resize', () => {
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
                    
                    if(id === 'listen_bpm' && this.play === 1) {
                        this.StopMidiClean();
                        this.playMidi(); 
                    }
                });
            }
        });
    },

    /* --- UI Toggles --- */
    toggleStickingMode: function() {
        const mode = document.querySelector('input[name="sticking_type"]:checked').value;
        document.getElementById('panel-accent').style.display = (mode === 'accent') ? 'block' : 'none';
        document.getElementById('panel-coord').style.display = (mode === 'coord') ? 'block' : 'none';
        this.generateCurrent();
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
        this.metronomeInterval = setInterval(() => { this.playBeep(); }, ms);
    },

    stopMetronome: function() {
        clearInterval(this.metronomeInterval);
        this.metronomeInterval = null;
    },

    playBeep: function() {
        if (!this.audioCtx) return;
        const t = this.audioCtx.currentTime;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        // Sound characteristics (Woodblock pitch)
        osc.frequency.setValueAtTime(800, t); 
        osc.type = 'sine';
        
        // Envelope (The "Shape" of the sound)
        // 1. Start at Silence
        gain.gain.setValueAtTime(0, t);
        // 2. Instant Attack to full volume
        gain.gain.linearRampToValueAtTime(1, t + 0.005);
        // 3. Sharp Exponential Decay (The "Click" effect)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.start(t);
        osc.stop(t + 0.1);
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
        const paperElement = document.getElementById('paper');
        if(!paperElement) return;

        const containerWidth = paperElement.clientWidth - 110; 
        this.renderParams.width = containerWidth;
        this.printerParams.staffwidth = containerWidth;
        
        const barEl = document.getElementById('bar_nbr');
        const tempoEl = document.getElementById('listen_bpm');
        this.barsNumber = barEl ? parseInt(barEl.value) : 10;
        this.midiParams.qpm = tempoEl ? parseInt(tempoEl.value) : 100;

        // Dispatch
        if (this.pageMode === 'simple') this.generateSimple();
        else if (this.pageMode === 'compound') this.generateCompound();
        else if (this.pageMode === 'sticking') this.generateSticking();
        else if (this.pageMode === 'grooves') this.generateGrooves();
        else if (this.pageMode === 'comping') this.generateComping();
    },

    /* 1. SIMPLE */
    generateSimple: function() {
        const meterIn = document.querySelector('input[name="mter"]:checked').value;
        const options = Array.from(document.querySelectorAll('input.onebeat:checked')).map(cb => cb.value);
        
        let diff = [document.querySelector('input[name="dif"]:checked').value];
        const dyn = document.querySelector('input[type="checkbox"].tdif:checked');
        if(dyn) diff.push(dyn.value);

        let preamble = "X:1\nT: Reading Exercise\nM:" + meterIn + "\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff 4\n";
        let staff = generate_reading_exercise(options, diff, meterIn, 'simple', (this.renderParams.width/1280), this.barsNumber);
        
        const midiPreamble = "X:1\nT:Midi\nM:" + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
        let midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'simple');

        this.render(preamble + staff, midistaff);
    },

    /* 2. COMPOUND */
    generateCompound: function() {
        const meterIn = document.querySelector('input[name="cmeter"]:checked').value;
        const options = Array.from(document.querySelectorAll('input.cmp_onebeat:checked')).map(cb => cb.value);
        
        let diff = [document.querySelector('input[name="cdif"]:checked').value];
        const dyn = document.querySelector('input[type="checkbox"].cdif:checked');
        if(dyn) diff.push(dyn.value);

        let preamble = "X:1\nT: Reading Exercise\nM:" + meterIn + "\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff 4\n";
        let staff = "";

        if (meterIn === '7/8') {
            staff = generate_reading_exercise_78(options, diff, (this.renderParams.width/1280), this.barsNumber);
        } else {
            staff = generate_reading_exercise(options, diff, meterIn, 'compound', (this.renderParams.width/1280), this.barsNumber);
        }

        const midiPreamble = "X:1\nT:Midi\nM:" + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
        let midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'compound');

        this.render(preamble + staff, midistaff);
    },

    /* 3. STICKING */
    generateSticking: function() {
        const subMode = document.querySelector('input[name="sticking_type"]:checked').value;

        if (subMode === 'accent') {
            const options = Array.from(document.querySelectorAll('input.sticking_opt:checked')).map(cb => cb.value);
            let staff = generate_accent_exercise(options,  this.barsNumber);
            let preamble = "X:1\nT: Accent Exercise\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            let midistaff = this.composeMidiStaff(staff, "X:1\nM:4/4\nL:1/16\nK:clef=perc\n[V:v1] |", "4/4", 'simple');
            this.render(preamble + staff, midistaff);

        } else {
            const md = document.querySelector('input[name="md"]:checked').value;
            const mi = document.querySelector('input[name="mi"]:checked').value;
            let staff = generate_coordination_exercise(md, mi,  this.barsNumber);
            let preamble = "X:1\nT: Coordination\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            let midiPreamble = "X:1\nT:Midi\nM:4/4\nL:1/16\nK:clef=perc\n";
            this.render(preamble + staff, midiPreamble + staff);
        }
    },

    /* 4. GROOVES */
    generateGrooves: function() {
        const grooveType = document.querySelector('input[name="grvf"]:checked').value;
        let staff = "";
        
        if (grooveType === '1') {
            staff = generate_pattern_markov_8(this.barsNumber);
        } else {
            staff = generate_pattern_paradidles(this.barsNumber);
        }

        let preamble="X:1\nT: Random groove\nM: 4/4\nL: 1/16\nK: clef=perc\n%%stretchlast 0\n|";
        let midiPreamble = "X:1\nT:Midi\nM:4/4\nL:1/16\nK:clef=perc\n";
        let midistaff = this.composeMidiStaff(staff, midiPreamble, "4/4", 'simple');
      
        this.render(preamble + staff,  midistaff);
    },

    /* 5. COMPING */
    generateComping: function() {
        const voices = Array.from(document.querySelectorAll('input.cmping_vc:checked')).map(cb => cb.value);
        const notes = Array.from(document.querySelectorAll('input.cmping_nt:checked')).map(cb => cb.value);
        
        let staff = generate_comping_exercise(voices, notes, 4, (this.renderParams.width/1280), this.barsNumber);
        
        let preamble = "X:1\nT: Jazz Comping\nM:4/4\nL:1/16\nK:clef=perc\n%%stretchlast 0\n";
        let midiPreamble= "X:1\nM: 4/4\nL:1/16\nK:clef=perc\n[V:v1] |"; 
        
        // Add Ride Cymbal Swing Pattern (V3)
        let midistr="";
        for(let i=0; i<this.barsNumber; i++){    
            midistr= midistr.concat("[^F,,4e4] (3:2:3[^F,,2e2]z2^F,,2 [^F,,4e4] (3:2:3[^F,,2e2]z2^F,,2 |");    
        }
        midistr = "[V:v3] | " + midistr + " |]\n ";

        let midistaff = this.composeMidiStaff(staff, midiPreamble, "4/4", 'simple');
        midistaff = midistaff + midistr;
        
        this.render(preamble + staff, midistaff);
    },

    /* --- Render Helper --- */
    render: function(visualAbc, midiAbc) {
        ABCJS.renderAbc('notation', visualAbc, {}, this.printerParams, this.renderParams);
        this.midiParams.miditrack = midiAbc;
        ABCJS.renderMidi('midicontainer', midiAbc, {}, this.midiParams, {});
    },

    /* --- MIDI Composer Helper --- */
    composeMidiStaff: function(staff, preamble, meter, type) {
        let loopMeter = 0;
        if (meter === '7/8') {
            loopMeter = 7;
        } else {
            const parts = meter.split('/');
            loopMeter = parseFloat(parts[0]);
            if (parts[1] !== '4') loopMeter = loopMeter / 3;
        }

        let clickTrack = '';
        const totalBeats = this.barsNumber * loopMeter;

        for (let i = 0; i < totalBeats; i++) {
            if (i % loopMeter === 0 && i !== (totalBeats - 1) && i !== 0) clickTrack += "|";
            if (type === 'simple') clickTrack += "e4";
            else if (meter === '7/8') clickTrack += "e2";
            else clickTrack += "e6";
        }

        let cleanStaff = staff.replace(/\n/g, '');
        cleanStaff = cleanStaff.replace(/B/g, 'D,,');  
        cleanStaff = cleanStaff.replace(/c/g, 'D,,');  
        cleanStaff = cleanStaff.replace(/F/g, 'C,,');  
        cleanStaff = cleanStaff.replace(/g/g, '^F,,'); 

        return preamble + cleanStaff + "\n[V:v2] |" + clickTrack + "|]\n";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
