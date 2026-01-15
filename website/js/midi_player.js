/* --- GLOBAL WEB AUDIO CONTEXT --- */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
var sampleRate = audioCtx.sampleRate; // 44100 or 48000 depending on system
var currentSource = null; // Track active playback to allow stopping

/* --- AUDIO PLAYER (Web Audio API Version) --- */
function AudioPlayer(generator, opts) {
    // 1. Resume context if suspended (browser policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // 2. Stop any previous playback
    stopActiveAudio();

    // 3. Generate Samples (Render the song)
    // We collect all samples in a temporary array. 
    // Since we don't know the exact length in advance due to MIDI deltas, 
    // we push chunks.
    var rawBuffer = [];
    var chunkSize = 4096;
    
    // Safety break to prevent infinite loops if generator fails
    var maxSamples = sampleRate * 60 * 5; // Max 5 minutes
    var samplesGenerated = 0;

    while (!generator.finished && samplesGenerated < maxSamples) {
        var chunk = generator.generate(chunkSize);
        // "chunk" is a standard Array, we merge it into rawBuffer
        // Note: For very long songs, pushing to array can be slow, 
        // but for rhythm exercises this is perfectly fine and simple.
        for(var i=0; i<chunk.length; i++) {
            rawBuffer.push(chunk[i]);
        }
        samplesGenerated += chunkSize;
    }

    // 4. Create Web Audio Buffer
    var frameCount = rawBuffer.length;
    var audioBuffer = audioCtx.createBuffer(1, frameCount, sampleRate);
    var channelData = audioBuffer.getChannelData(0);

    // 5. Fill Buffer & Convert (Synth outputs -127 to 127, Web Audio needs -1.0 to 1.0)
    for (var i = 0; i < frameCount; i++) {
        // Normalize 8-bit integer range to float
        channelData[i] = rawBuffer[i] / 128.0; 
    }

    // 6. Play
    var source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    
    // Handle "Ended" event to update UI
    source.onended = function() {
        currentSource = null;
        if (typeof app !== 'undefined' && app.play === 1) {
            app.toggleMidi();
        }
    };

    source.start();
    currentSource = source;
}

/**
 * Global function to stop playback instantly.
 * Called by app.js when user clicks "Stop"
 */
function stopActiveAudio() {
    if (currentSource) {
        try {
            currentSource.stop();
            currentSource.disconnect();
        } catch(e) {
            // Ignore errors if already stopped
        }
        currentSource = null;
    }
}

/* --- MIDI PARSER --- */
function MidiFile(data, set_bpm) {
    function readChunk(stream) {
        var id = stream.read(4);
        var length = parseInt(stream.read(8),16);
        return { 'id': id, 'length': length, 'data': stream.read(length*2) };
    }
    
    var lastEventTypeByte;
    
    function readEvent(stream) {
        var event = {};
        event.deltaTime = stream.readVarInt();
        var eventTypeByte = parseInt(stream.read(2),16);
        if ((eventTypeByte & 0xf0) == 0xf0) {
            if (eventTypeByte == 0xff) {
                event.type = 'meta';
                var subtypeByte = parseInt(stream.read(2),16);
                var length = stream.readVarInt();
                switch(subtypeByte) {
                    case 0x2f: event.subtype = 'endOfTrack'; return event;
                    case 0x51:
                        event.subtype = 'setTempo';
                        if(!set_bpm) {
                            event.microsecondsPerBeat = ((parseInt(stream.read(2),16) << 16) + (parseInt(stream.read(2),16) << 8) + parseInt(stream.read(2),16));
                        } else {
                            event.microsecondsPerBeat= 60000000/set_bpm;
                        }
                        return event;
                    case 0x58:
                        event.subtype = 'timeSignature';
                        event.numerator = parseInt(stream.read(2),16);
                        event.denominator = Math.pow(2, parseInt(stream.read(2),16));
                        return event;
                    default:
                        event.subtype = 'unknown';
                        event.data = stream.read(length*2);
                        return event;
                }
            } else if (eventTypeByte == 0xf0 || eventTypeByte == 0xf7) {
                event.type = 'sysEx';
                var length = stream.readVarInt();
                event.data = stream.read(length*2);
                return event;
            }
        } else {
            var param1;
            if ((eventTypeByte & 0x80) == 0) {
                param1 = eventTypeByte;
                eventTypeByte = lastEventTypeByte;
            } else {
                param1 = parseInt(stream.read(2),16);
                lastEventTypeByte = eventTypeByte;
            }
            var eventType = eventTypeByte >> 4;
            event.channel = eventTypeByte & 0x0f;
            event.type = 'channel';
            switch (eventType) {
                case 0x08:
                    event.subtype = 'noteOff';
                    event.noteNumber = param1;
                    event.velocity = parseInt(stream.read(2),16);
                    return event;
                case 0x09:
                    event.noteNumber = param1;
                    event.velocity = parseInt(stream.read(2),16);
                    event.subtype = (event.velocity == 0) ? 'noteOff' : 'noteOn';
                    return event;
                case 0x0c:
                    event.subtype = 'programChange';
                    event.programNumber = param1;
                    return event;
                default: return event;
            }
        }
        return event;
    }
    
    var stream = Stream(data);
    var headerChunk = readChunk(stream);
    var headerStream = Stream(headerChunk.data);
    var formatType = parseInt(headerStream.read(4),16);
    var trackCount = parseInt(headerStream.read(4),16);
    var timeDivision = parseInt(headerStream.read(4),16);
    
    var header = { 'formatType': formatType, 'trackCount': trackCount, 'ticksPerBeat': timeDivision };
    var tracks = [];
    for (var i = 0; i < header.trackCount; i++) {
        tracks[i] = [];
        var trackChunk = readChunk(stream);
        var trackStream = Stream(trackChunk.data);
        while (!trackStream.eof()) {
            try {
                var event = readEvent(trackStream);
                if(event) tracks[i].push(event);
            } catch(e) { break; }
        }
    }
    return { 'header': header, 'tracks': tracks };
}

/* --- REPLAYER & SYNTH --- */
function Replayer(midiFile, synth) {
    var trackStates = [];
    var beatsPerMinute = 120;
    var ticksPerBeat = midiFile.header.ticksPerBeat;
    
    for (var i = 0; i < midiFile.tracks.length; i++) {
        trackStates[i] = {
            'nextEventIndex': 0,
            'ticksToNextEvent': (midiFile.tracks[i].length ? midiFile.tracks[i][0].deltaTime : null)
        };
    }
    
    function Channel() {
        var generatorsByNote = {};
        var currentProgram = DrumProgram;
        
        function noteOn(note, velocity) {
            if (generatorsByNote[note] && !generatorsByNote[note].released) {
                generatorsByNote[note].noteOff(); 
            }
            generator = currentProgram.createNote(note, velocity);
            synth.addGenerator(generator);
            generatorsByNote[note] = generator;
        }
        function noteOff(note, velocity) {
            if(generatorsByNote[note]) generatorsByNote[note].noteOff(velocity);
        }
        function setProgram(programNumber) {
            currentProgram = PROGRAMS[programNumber] || DrumProgram;
        }
        return { 'noteOn': noteOn, 'noteOff': noteOff, 'setProgram': setProgram }
    }
    
    var channels = [];
    for (var i = 0; i < 16; i++) channels[i] = Channel();
    
    var nextEventInfo;
    var samplesToNextEvent = 0;
    
    function getNextEvent() {
        var ticksToNextEvent = null;
        var nextEventTrack = null;
        var nextEventIndex = null;
        
        for (var i = 0; i < trackStates.length; i++) {
            if (trackStates[i].ticksToNextEvent != null && (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)) {
                ticksToNextEvent = trackStates[i].ticksToNextEvent;
                nextEventTrack = i;
                nextEventIndex = trackStates[i].nextEventIndex;
            }
        }
        if (nextEventTrack != null) {
            var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
            if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
                trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
            } else {
                trackStates[nextEventTrack].ticksToNextEvent = null;
            }
            trackStates[nextEventTrack].nextEventIndex += 1;
            for (var i = 0; i < trackStates.length; i++) {
                if (trackStates[i].ticksToNextEvent != null) trackStates[i].ticksToNextEvent -= ticksToNextEvent
            }
            nextEventInfo = { 'event': nextEvent };
            var samplesPerTick = synth.sampleRate * (60 / (beatsPerMinute * ticksPerBeat));
            samplesToNextEvent += ticksToNextEvent * samplesPerTick;
        } else {
            nextEventInfo = null;
            samplesToNextEvent = null;
            self.finished = true;
        }
    }
    
    getNextEvent();
    
    function generate(samples) {
        var data = new Array(samples);
        var samplesRemaining = samples;
        var dataOffset = 0;
        
        while (true) {
            if (samplesToNextEvent != null && samplesToNextEvent <= samplesRemaining) {
                var samplesToGenerate = Math.ceil(samplesToNextEvent);
                if (samplesToGenerate > 0) {
                    synth.generateIntoBuffer(samplesToGenerate, data, dataOffset);
                    dataOffset += samplesToGenerate;
                    samplesRemaining -= samplesToGenerate;
                    samplesToNextEvent -= samplesToGenerate;
                }
                handleEvent();
                getNextEvent();
            } else {
                if (samplesRemaining > 0) {
                    synth.generateIntoBuffer(samplesRemaining, data, dataOffset);
                    samplesToNextEvent -= samplesRemaining;
                }
                break;
            }
        }
        return data;
    }
    
    function handleEvent() {
        if(!nextEventInfo) return;
        var event = nextEventInfo.event;
        if (event.type === 'meta' && event.subtype === 'setTempo') {
            beatsPerMinute = 60000000 / event.microsecondsPerBeat;
        } else if (event.type === 'channel') {
            if (event.subtype === 'noteOn') channels[event.channel].noteOn(event.noteNumber, event.velocity);
            else if (event.subtype === 'noteOff') channels[event.channel].noteOff(event.noteNumber, event.velocity);
            else if (event.subtype === 'programChange') channels[event.channel].setProgram(event.programNumber);
        }
    }
    
    var self = { 'generate': generate, 'finished': false }
    return self;
}

function Synth(sample_rte) {
    var generators = [];
    sampleRate = sample_rte; // Ensure global var is synced
    
    function addGenerator(generator) { generators.push(generator); }
    
    function generateIntoBuffer(samplesToGenerate, buffer, offset) {
        for (var i = offset; i < offset + samplesToGenerate; i++) buffer[i] = 0;
        for (var i = generators.length - 1; i >= 0; i--) {
            generators[i].generate(buffer, offset, samplesToGenerate);
            if (!generators[i].alive) generators.splice(i, 1);
        }
    }
    return { 'sampleRate': sampleRate, 'addGenerator': addGenerator, 'generateIntoBuffer': generateIntoBuffer }
}

/* --- SYNTHESIS GENERATORS --- */
function SampleGenerator(note) {
    var self = {'alive': true};
    var t = 0;
    var phase = 0;
    var lastNoise = 0; 

    self.generate = function(buf, offset, count) {
        for (; count; count--) {
            var result = 0;
            var dt = t / sampleRate; 

            if (note === 36) { 
                // KICK: Sweep + Click
                var freq = 50 + 100 * Math.exp(-dt * 20);
                phase += (freq / sampleRate) * 2 * Math.PI;
                var amp = Math.exp(-dt * 5); 
                var click = (dt < 0.002) ? (Math.random() - 0.5) : 0;
                result = (Math.sin(phase) * 0.8 + click * 0.4) * amp * 127;
            } 
            else if (note === 38) { 
                // SNARE: Tone + Noise
                var freq = 180 + 70 * Math.exp(-dt * 15);
                phase += (freq / sampleRate) * 2 * Math.PI;
                var tone = Math.sin(phase);
                var noise = Math.random() * 2 - 1;
                var toneEnv = Math.exp(-dt * 10);
                var noiseEnv = Math.exp(-dt * 20);
                result = (tone * 0.3 * toneEnv + noise * 0.5 * noiseEnv) * 127;
            } 
            else if (note === 42) { 
                // HI-HAT: Filtered Noise
                var white = Math.random() * 2 - 1;
                var metal = white - lastNoise; 
                lastNoise = white;
                var amp = Math.exp(-dt * 70); 
                result = metal * 0.6 * amp * 127;
            } 
            else if (note === 76) { 
                // WOODBLOCK
                phase += (800 / sampleRate) * 2 * Math.PI;
                var amp = Math.exp(-dt * 50);
                result = Math.sin(phase) * amp * 50;
            }
            
            if(dt > 0.6) result = 0; // Cutoff
            buf[offset++] += result;
            t++;
        }
    }
    return self;
}

function DrumGenerator(child, sustainAmplitude, decayTimeS) {
    var self = {'alive': true};
    var decayTime = sampleRate * decayTimeS;
    var t = 0;
    self.noteOff = function() { self.alive = false; };
    self.generate = function(buf, offset, count) {
        if (!self.alive) return;
        var input = new Array(count);
        for(var i=0; i<count; i++) input[i] = 0;
        child.generate(input, 0, count);
        var childOffset = 0;
        while(count) {
            if (t < decayTime) {
                var ampl = sustainAmplitude * (1 - (t / decayTime));
                buf[offset++] += input[childOffset++] * ampl;
                t++;
            } else {
                self.alive = false;
                buf[offset++] += 0;
            }
            count--;
        }
    }
    return self;
}

function SineGenerator(freq) {
    var self = {'alive': true};
    var period = sampleRate / freq;
    var t = 0;
    self.generate = function(buf, offset, count) {
        for (; count; count--) {
            var val = Math.sin(t * 2 * Math.PI / period);
            buf[offset++] += val * 127; 
            t++;
        }
    }
    return self;
}

function ADSRGenerator(child, attackAmp, sustainAmp, attackTimeS, decayTimeS, releaseTimeS) {
    var self = {'alive': true, 'released': false};
    var attackTime = sampleRate * attackTimeS;
    var decayTime = sampleRate * (attackTimeS + decayTimeS);
    var releaseTime = 0;
    var endTime = 0;
    var t = 0;

    self.noteOff = function() {
        if (self.released) return;
        releaseTime = t;
        self.released = true;
        endTime = releaseTime + (sampleRate * releaseTimeS);
    }

    self.generate = function(buf, offset, count) {
        if (!self.alive) return;
        var input = new Array(count);
        for(var i=0; i<count; i++) input[i] = 0;
        child.generate(input, 0, count);
        var childOffset = 0;
        while(count) {
            var amp = 0;
            if (t < attackTime) {
                amp = attackAmp * (t / attackTime);
            } else if (t < decayTime) {
                amp = attackAmp - (attackAmp - sustainAmp) * ((t - attackTime) / (decayTime - attackTime));
            } else if (!self.released) {
                amp = sustainAmp;
            } else if (t < endTime) {
                amp = sustainAmp * (1 - ((t - releaseTime) / (endTime - releaseTime)));
            } else {
                self.alive = false;
            }
            buf[offset++] += input[childOffset++] * amp;
            t++;
            count--;
        }
    }
    return self;
}

function midiToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

/* --- PROGRAMS --- */
DrumProgram = {
    'createNote': function(note, velocity) {
        var duration = 0.3; 
        var vol = velocity / 128;
        if (note === 36) duration = 0.5;
        else if (note === 42) duration = 0.08;
        else if (note === 38) duration = 0.2;
        return DrumGenerator(SampleGenerator(note), vol, duration);
    }
}

StringProgram = {
    'createNote': function(note, velocity) {
        var frequency = midiToFrequency(note);
        return ADSRGenerator(SineGenerator(frequency), 0.5, 0.2, 0.05, 0.1, 0.1);
    }
}

PROGRAMS = {
    41: StringProgram, 42: StringProgram, 43: StringProgram, 44: StringProgram,
    45: StringProgram, 46: StringProgram, 47: StringProgram, 49: StringProgram, 50: StringProgram
};

/* --- UTILS --- */
function Stream(str) {
    var position = 0;
    function read(length) {
        var result = str.substr(position, length);
        position += length;
        return result;
    }
    function readVarInt() {
        var result = 0;
        while (true) {
            var b = parseInt(read(2),16);
            if (b & 0x80) { result += (b & 0x7f); result <<= 7; } 
            else { return result + b; }
        }
    }
    return { 'read': read, 'readVarInt': readVarInt, 'eof': function(){ return position >= str.length; } }
}
