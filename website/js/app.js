// /**
//  * Main Application Logic
//  * Supports: Simple, Compound, Sticking, Coordination
//  */

// const app = {
//     // State
//     play: 0,
//     pageMode: null, // 'simple', 'compound', 'sticking'
//     metronomeInterval: null,
//     audioCtx: null, 
    
//     // Config
//     renderParams: { width: 900 },
//     printerParams: { scale: 1, staffwidth: 900 },
//     midiParams: { qpm: 100, miditrack: "" }, 
//     barsNumber: 10,

//     init: function() {
//         // Detect Page Mode from Body Tag
//         const body = document.body;
//         this.pageMode = body.getAttribute('data-mode');

//         // If no mode (landing page), stop here
//         if (!this.pageMode) return;

//         this.setupSliders();
        
//         // Initial Generation
//         this.generateCurrent();

//         // Handle Window Resize to redraw paper
//         window.addEventListener('resize', () => {
//              this.generateCurrent();
//         });
//     },

//     setupSliders: function() {
//         const sliders = ['bar_nbr', 'mtro_bpm', 'listen_bpm'];
        
//         sliders.forEach(id => {
//             const el = document.getElementById(id);
//             const disp = document.getElementById('disp_' + id);
            
//             if(el) {
//                 el.addEventListener('input', (e) => {
//                     if(disp) disp.textContent = e.target.value;
                    
//                     if(id === 'mtro_bpm' && this.metronomeInterval) {
//                         this.stopMetronome();
//                         this.startMetronome();
//                     }
                    
//                     // If Tempo changes while playing MIDI, restart
//                     if(id === 'listen_bpm' && this.play === 1) {
//                         this.StopMidiClean();
//                         this.playMidi(); 
//                     }
//                 });
//             }
//         });
//     },

//     /* --- UI Toggles for Sticking Page --- */
//     toggleStickingMode: function() {
//         const mode = document.querySelector('input[name="sticking_type"]:checked').value;
//         const panelAccent = document.getElementById('panel-accent');
//         const panelCoord = document.getElementById('panel-coord');

//         if(mode === 'accent') {
//             panelAccent.style.display = 'block';
//             panelCoord.style.display = 'none';
//         } else {
//             panelAccent.style.display = 'none';
//             panelCoord.style.display = 'block';
//         }
//         // Auto regenerate when switching tabs
//         this.generateCurrent();
//     },

//     /* --- Metronome Logic --- */
//     toggleMetronome: function() {
//         const btn = document.getElementById('metro_btn');
//         if(!btn) return;

//         if (this.metronomeInterval) {
//             this.stopMetronome();
//             btn.textContent = "⏱ Metro";
//             btn.classList.remove('contrast');
//             btn.classList.add('secondary');
//         } else {
//             if (!this.audioCtx) {
//                 this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//             }
//             this.startMetronome();
//             btn.textContent = "⏹ Stop";
//             btn.classList.remove('secondary');
//             btn.classList.add('contrast');
//         }
//     },

//     startMetronome: function() {
//         const el = document.getElementById('mtro_bpm');
//         if(!el) return;
//         const bpm = parseInt(el.value);
//         const ms = 60000 / bpm;
//         this.playBeep();
//         this.metronomeInterval = setInterval(() => { this.playBeep(); }, ms);
//     },

//     stopMetronome: function() {
//         clearInterval(this.metronomeInterval);
//         this.metronomeInterval = null;
//     },

//     playBeep: function() {
//         if (!this.audioCtx) return;
//         const osc = this.audioCtx.createOscillator();
//         const gainNode = this.audioCtx.createGain();
//         osc.connect(gainNode);
//         gainNode.connect(this.audioCtx.destination);
//         osc.frequency.value = 1000; 
//         osc.type = 'sine';
//         gainNode.gain.value = 0.5; 
//         osc.start();
//         osc.stop(this.audioCtx.currentTime + 0.1); 
//     },

//     /* --- MIDI Player --- */
//     toggleMidi: function() {
//         const btn = document.getElementById('play_pop');
//         if(!btn) return;

//         if(this.midiParams.miditrack){
//             if(this.play === 0){
//                 this.playMidi();
//                 btn.textContent = "⏹ Stop";
//                 btn.classList.remove('contrast');
//                 btn.classList.add('secondary');
//             } else {
//                 this.StopMidiClean();
//                 btn.textContent = "▶ Listen";
//                 btn.classList.remove('secondary');
//                 btn.classList.add('contrast');
//             }
//         } else {
//             alert("Please generate a rhythm first.");
//         }
//     },

//     StopMidiClean: function() {
//         if(typeof stopActiveAudio === 'function') {
//             stopActiveAudio();
//         }
//         this.play = 0;
//     },

//     playMidi: function() {
//         try {
//             var list_bpm = document.getElementById('listen_bpm').value;
//             midiFile = MidiFile(this.midiParams.miditrack, list_bpm);
//             synth = Synth(audioCtx.sampleRate); 
//             replayer = Replayer(midiFile, synth);
//             AudioPlayer(replayer);
//             this.play = 1; 
//         } catch (e) {
//             console.error("MIDI Playback Error:", e);
//             this.play = 0; 
//         }
//     },

//     /* --- Generation Logic --- */
    
//     generateCurrent: function() {
//         const paperElement = document.getElementById('paper');
//         if(!paperElement) return;

//         // Dynamic Width
//         const containerWidth = paperElement.clientWidth - 120; 
//         this.renderParams.width = containerWidth;
//         this.printerParams.staffwidth = containerWidth;
        
//         // Global Params
//         const barEl = document.getElementById('bar_nbr');
//         const tempoEl = document.getElementById('listen_bpm');
//         this.barsNumber = barEl ? parseInt(barEl.value) : 10;
//         this.midiParams.qpm = tempoEl ? parseInt(tempoEl.value) : 100;

//         // Dispatch based on mode
//         if (this.pageMode === 'simple') this.generateSimple();
//         else if (this.pageMode === 'compound') this.generateCompound();
//         else if (this.pageMode === 'sticking') this.generateSticking();
//     },

//     generateSimple: function() {
//         const meterIn = document.querySelector('input[name="mter"]:checked').value;
//         const options = Array.from(document.querySelectorAll('input.onebeat:checked')).map(cb => cb.value);
        
//         let diff = [document.querySelector('input[name="dif"]:checked').value];
//         const dyn = document.querySelector('input[type="checkbox"].tdif:checked');
//         if(dyn) diff.push(dyn.value);

//         let preamble = "X:1\nT: Reading Exercise\nM:" + meterIn + "\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff 4\n";
//         let staff = generate_reading_exercise(options, diff, meterIn, 'simple', (this.renderParams.width/1280), this.barsNumber);
        
//         const midiPreamble = "X:1\nT:Midi\nM:" + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
//         let midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'simple');

//         this.render(preamble + staff, midistaff);
//     },

//     generateCompound: function() {
//         const meterIn = document.querySelector('input[name="cmeter"]:checked').value;
//         const options = Array.from(document.querySelectorAll('input.cmp_onebeat:checked')).map(cb => cb.value);
        
//         let diff = [document.querySelector('input[name="cdif"]:checked').value];
//         const dyn = document.querySelector('input[type="checkbox"].cdif:checked');
//         if(dyn) diff.push(dyn.value);

//         let preamble = "X:1\nT: Reading Exercise\nM:" + meterIn + "\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff 4\n";
//         let staff = "";

//         if (meterIn === '7/8') {
//             staff = generate_reading_exercise_78(options, diff, (this.renderParams.width/1280), this.barsNumber);
//         } else {
//             staff = generate_reading_exercise(options, diff, meterIn, 'compound', (this.renderParams.width/1280), this.barsNumber);
//         }

//         const midiPreamble = "X:1\nT:Midi\nM:" + meterIn + "\nL:1/16\nK:clef=perc\n[V:v1] |";
//         let midistaff = this.composeMidiStaff(staff, midiPreamble, meterIn, 'compound');

//         this.render(preamble + staff, midistaff);
//     },

//     generateSticking: function() {
//         const subMode = document.querySelector('input[name="sticking_type"]:checked').value;

//         if (subMode === 'accent') {
//             // ACCENT MODE
//             const options = Array.from(document.querySelectorAll('input.sticking_opt:checked')).map(cb => cb.value);
//             // Assuming generate_accent_exercise exists in rdm_rhythm.js based on old HTML
//             // Adapting parameters to match standard ABCJS needs
            
//             // Note: If generate_accent_exercise renders internally, we need to capture it or
//             // ensure it returns a string. Assuming it returns string like others:
//             let staff = generate_accent_exercise(options,  this.barsNumber);
            
//             let preamble = "X:1\nT: Accent Exercise\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
//             let midistaff = this.composeMidiStaff(staff, "X:1\nM:4/4\nL:1/16\nK:clef=perc\n[V:v1] |", "4/4", 'simple');
            
//             this.render(preamble + staff, midistaff);

//         } else {
//             // COORDINATION MODE
//             const md = document.querySelector('input[name="md"]:checked').value;
//             const mi = document.querySelector('input[name="mi"]:checked').value;
            
//             // Assuming generate_coordination_exercise returns ABC string
//             let staff = generate_coordination_exercise(md, mi, this.barsNumber);
            
//             let preamble = "X:1\nT: Coordination\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            
//             // Special MIDI handling for Coordination (2 voices usually)
//             // If the generator returns V:1 and V:2 in the staff string, we just prepend header
//             let midiPreamble = "X:1\nT:Midi\nM:4/4\nL:1/16\nK:clef=perc\n";
            
//             // For coordination, we don't usually need the metronome track overlay 
//             // because it's polyphonic enough, but let's see. 
//             // Simplest way: Pass the staff directly if it contains voice data.
//             this.render(preamble + staff, midiPreamble + staff);
//         }
//     },

//     /* --- Helper: Render to Screen --- */
//     render: function(visualAbc, midiAbc) {
//         ABCJS.renderAbc('notation', visualAbc, {}, this.printerParams, this.renderParams);
//         this.midiParams.miditrack = midiAbc;
//         ABCJS.renderMidi('midicontainer', midiAbc, {}, this.midiParams, {});
//     },

//     /* --- Helper: Compose MIDI (Add Metronome Track) --- */
//     composeMidiStaff: function(staff, preamble, meter, type) {
//         // Calculate beat structure for the metronome click (V2)
//         let loopMeter = 0;
//         if (meter === '7/8') {
//             loopMeter = 7;
//         } else {
//             const parts = meter.split('/');
//             loopMeter = parseFloat(parts[0]);
//             if (parts[1] !== '4') loopMeter = loopMeter / 3;
//         }

//         let clickTrack = '';
//         const totalBeats = this.barsNumber * loopMeter;

//         for (let i = 0; i < totalBeats; i++) {
//             if (i % loopMeter === 0 && i !== (totalBeats - 1) && i !== 0) clickTrack += "|";
//             if (type === 'simple') clickTrack += "e4";
//             else if (meter === '7/8') clickTrack += "e2";
//             else clickTrack += "e6";
//         }

//         // Clean up staff for MIDI (map notes to drum sounds if needed)
//         // Adjust mappings based on your preferred sounds
//         let cleanStaff = staff.replace(/\n/g, '');
//         // Example mappings found in previous code:
//         cleanStaff = cleanStaff.replace(/B/g, 'D,,'); // Kick?
//         cleanStaff = cleanStaff.replace(/c/g, 'D,,');
//         cleanStaff = cleanStaff.replace(/F/g, 'C,,');
//         cleanStaff = cleanStaff.replace(/g/g, '^F,,'); // Hihat?

//         return preamble + cleanStaff + "\n[V:v2] |" + clickTrack + "|]\n";
//     }
// };

// document.addEventListener('DOMContentLoaded', () => {
//     app.init();
// });


/**
 * Main Application Logic (Vanilla JS)
 * Handles: Simple, Compound, Sticking, Patterns
 */

const app = {
    // State
    play: 0,
    pageMode: null, // 'simple', 'compound', 'sticking', 'patterns'
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

        // If no mode (landing page), stop here
        if (!this.pageMode) return;

        this.setupSliders();
        
        // Initial Generation
        this.generateCurrent();

        // Handle Window Resize to redraw paper
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
                    
                    // If Tempo changes while playing MIDI, restart
                    if(id === 'listen_bpm' && this.play === 1) {
                        this.StopMidiClean();
                        this.playMidi(); 
                    }
                });
            }
        });
    },

    /* --- UI Toggles for Specific Pages --- */
    toggleStickingMode: function() {
        const mode = document.querySelector('input[name="sticking_type"]:checked').value;
        document.getElementById('panel-accent').style.display = (mode === 'accent') ? 'block' : 'none';
        document.getElementById('panel-coord').style.display = (mode === 'coord') ? 'block' : 'none';
        this.generateCurrent();
    },

    togglePatternMode: function() {
        const mode = document.querySelector('input[name="pattern_type"]:checked').value;
        document.getElementById('panel-groove').style.display = (mode === 'groove') ? 'block' : 'none';
        document.getElementById('panel-comping').style.display = (mode === 'comping') ? 'block' : 'none';
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

        // Dynamic Width
        const containerWidth = paperElement.clientWidth - 60; 
        this.renderParams.width = containerWidth;
        this.printerParams.staffwidth = containerWidth;
        
        // Global Params
        const barEl = document.getElementById('bar_nbr');
        const tempoEl = document.getElementById('listen_bpm');
        this.barsNumber = barEl ? parseInt(barEl.value) : 10;
        this.midiParams.qpm = tempoEl ? parseInt(tempoEl.value) : 100;

        // Dispatch based on Page Mode
        if (this.pageMode === 'simple') this.generateSimple();
        else if (this.pageMode === 'compound') this.generateCompound();
        else if (this.pageMode === 'sticking') this.generateSticking();
        else if (this.pageMode === 'patterns') this.generatePatterns();
    },

    /* 1. SIMPLE MODE */
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

    /* 2. COMPOUND MODE */
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

    /* 3. STICKING MODE */
    generateSticking: function() {
        const subMode = document.querySelector('input[name="sticking_type"]:checked').value;

        if (subMode === 'accent') {
            const options = Array.from(document.querySelectorAll('input.sticking_opt:checked')).map(cb => cb.value);
            // Assuming generate_accent_exercise exists
            let staff = generate_accent_exercise(options,  this.barsNumber);
            let preamble = "X:1\nT: Accent Exercise\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            let midistaff = this.composeMidiStaff(staff, "X:1\nM:4/4\nL:1/16\nK:clef=perc\n[V:v1] |", "4/4", 'simple');
            this.render(preamble + staff, midistaff);

        } else {
            const md = document.querySelector('input[name="md"]:checked').value;
            const mi = document.querySelector('input[name="mi"]:checked').value;
            // Assuming generate_coordination_exercise exists
            let staff = generate_coordination_exercise(md, mi,  this.barsNumber);
            let preamble = "X:1\nT: Coordination\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            let midiPreamble = "X:1\nT:Midi\nM:4/4\nL:1/16\nK:clef=perc\n";
            this.render(preamble + staff, midiPreamble + staff);
        }
    },

    /* 4. PATTERNS MODE */
    generatePatterns: function() {
        const subMode = document.querySelector('input[name="pattern_type"]:checked').value;

        if (subMode === 'groove') {
            const grooveType = document.querySelector('input[name="grvf"]:checked').value;
            let staff = "";
            
            if (grooveType === '1') {
                staff=generate_pattern_markov_8(this.barsNumber);
            } else {
                staff = generate_pattern_paradidles(this.barsNumber);
            }

            // let preamble = "X:1\nT: Groove Pattern\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            // Grooves usually have multiple voices (Hat, Snare, Kick) in the ABC string already
            // So we can often just use the same string for MIDI
            // let midiPreamble = "X:1\nT:Midi\nM:4/4\nL:1/16\nK:clef=perc\n";
            let preamble="X:1\nT: Random groove\nM: 4/4\nL: 1/16\nK: clef=perc\n%%stretchlast 0\n|";
            let midiPreamble= "X:1\nM: 4/4\nL:1/16\nK:clef=perc\n[V:v1] |"; 
            
            this.render(preamble + staff, midiPreamble + staff);

        } else {
            // Comping
            const voices = Array.from(document.querySelectorAll('input.cmping_vc:checked')).map(cb => cb.value);
            const notes = Array.from(document.querySelectorAll('input.cmping_nt:checked')).map(cb => cb.value);
            
            let staff = generate_comping_exercise(voices, notes,  (this.renderParams.width/1280), this.barsNumber);
            
            let preamble = "X:1\nT: Jazz Comping\nM:4/4\nL:1/16\nK:clef=perc stafflines=1\n";
            let midiPreamble = "X:1\nT:Midi\nM:4/4\nL:1/16\nK:clef=perc\n";
            
            this.render(preamble + staff, midiPreamble + staff);
        }
    },

    /* --- Helper: Render to Screen --- */
    render: function(visualAbc, midiAbc) {
        ABCJS.renderAbc('notation', visualAbc, {}, this.printerParams, this.renderParams);
        this.midiParams.miditrack = midiAbc;
        ABCJS.renderMidi('midicontainer', midiAbc, {}, this.midiParams, {});
    },

    /* --- Helper: Compose MIDI (Add Metronome Track) --- */
    composeMidiStaff: function(staff, preamble, meter, type) {
        // Calculate beat structure for the metronome click (V2)
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

        // Clean up staff for MIDI (map notes to drum sounds)
        // Adjust these replacements based on what your rdm_rhythm.js produces
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
