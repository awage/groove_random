var sampleRate;

function AudioPlayer(generator, opts){

    if (!opts) opts = {};
                
    var buffer = new Array();

    while(!generator.finished){
        buffer = buffer.concat(generator.generate(100000));        
    }        
        
    // Assuming sampleRate is a global variable defined elsewhere in midi_player.js
    var dataUri = encodeAudio8bit(buffer, sampleRate);  
    
    // Vanilla JS equivalent of $('#tune_wav')
    var audioElement = document.getElementById('tune_wav');
    
    if(audioElement){
        audioElement.src = dataUri;
    }
    else{
        audioElement = document.createElement('audio');
        audioElement.id = 'tune_wav';
        audioElement.src = dataUri;
        
        // Reset the UI button when the audio naturally finishes playing
        audioElement.addEventListener('ended', function() {
            if(typeof app !== 'undefined' && app.play === 1) {
                // Call the app controller to reset the Play button to its default state
                app.toggleMidi();
            }
        });
        
        document.body.appendChild(audioElement);    
    }
}


    function encodeAudio8bit(data, sampleRate) {
      var n = data.length;
      var integer = 0, i;
      
      // 8-bit mono WAVE header template
      var header = "RIFF<##>WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00<##><##>\x01\x00\x08\x00data<##>";

      // Helper to insert a 32-bit little endian int.
      function insertLong(value) {
        var bytes = "";
        for (i = 0; i < 4; ++i) {
          bytes += String.fromCharCode(value % 256);
          value = Math.floor(value / 256);
        }
        header = header.replace('<##>', bytes);
      }

      // ChunkSize
      insertLong(36 + n);
      
      // SampleRate
      insertLong(sampleRate);

      // ByteRate
      insertLong(sampleRate);

      // Subchunk2Size
      insertLong(n);
      
      // Output sound data
      for (var i = 0; i < n; ++i) {
		  
        var sample = data[i];
        if(sample>127) sample=127; 
        if(sample<-128) sample=-128;
         
        header += String.fromCharCode(sample+128);
      }
      
      return 'data:audio/wav;base64,' + btoa(header);
    }
    
/*
class to parse the .mid file format
(depends on stream.js)
*/
function MidiFile(data, set_bpm) {
	function readChunk(stream) {
		var id = stream.read(4);
		var length = parseInt(stream.read(8),16);
		return {
			'id': id,
			'length': length,
			'data': stream.read(length*2)
		};
	}
	
	var lastEventTypeByte;
	
	function readEvent(stream) {
		var event = {};
		event.deltaTime = stream.readVarInt();
		var eventTypeByte = parseInt(stream.read(2),16);
		if ((eventTypeByte & 0xf0) == 0xf0) {
			/* system / meta event */
			if (eventTypeByte == 0xff) {
				/* meta event */
				event.type = 'meta';
				var subtypeByte = parseInt(stream.read(2),16);
				var length = stream.readVarInt();
				switch(subtypeByte) {
					case 0x00:
						event.subtype = 'sequenceNumber';
						if (length != 2) throw "Expected length for sequenceNumber event is 2, got " + length;
						event.number = parseInt(stream.read(4),16);
						return event;
					case 0x01:
						event.subtype = 'text';
						event.text = stream.read(length*2);
						return event;
					case 0x02:
						event.subtype = 'copyrightNotice';
						event.text = stream.read(length*2);
						return event;
					case 0x03:
						event.subtype = 'trackName';
						event.text = stream.read(length*2);
						return event;
					case 0x04:
						event.subtype = 'instrumentName';
						event.text = stream.read(length*2);
						return event;
					case 0x05:
						event.subtype = 'lyrics';
						event.text = stream.read(length*2);
						return event;
					case 0x06:
						event.subtype = 'marker';
						event.text = stream.read(length*2);
						return event;
					case 0x07:
						event.subtype = 'cuePoint';
						event.text = stream.read(length*2);
						return event;
					case 0x20:
						event.subtype = 'midiChannelPrefix';
						if (length != 1) throw "Expected length for midiChannelPrefix event is 1, got " + length;
						event.channel = parseInt(stream.read(2),16);
						return event;
					case 0x2f:
						event.subtype = 'endOfTrack';
						if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length;
						return event;
					case 0x51:
						event.subtype = 'setTempo';
						if(!set_bpm){
							if (length != 3) throw "Expected length for setTempo event is 3, got " + length;
							event.microsecondsPerBeat = (
								(parseInt(stream.read(2),16) << 16)
								+ (parseInt(stream.read(2),16) << 8)
								+ parseInt(stream.read(2),16)
							)
							return event;
						}
						else{
							
							event.microsecondsPerBeat= 60000000/set_bpm;
							return event;
							
						}
						
					case 0x54:
						event.subtype = 'smpteOffset';
						if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length;
						var hourByte = parseInt(stream.read(2),16);
						event.frameRate = {
							0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
						}[hourByte & 0x60];
						event.hour = hourByte & 0x1f;
						event.min = parseInt(stream.read(2),16);
						event.sec = parseInt(stream.read(2),16);
						event.frame = parseInt(stream.read(2),16);
						event.subframe = parseInt(stream.read(2),16);
						return event;
					case 0x58:
						event.subtype = 'timeSignature';
						if (length != 4) throw "Expected length for timeSignature event is 4, got " + length;
						event.numerator = parseInt(stream.read(2),16);
						event.denominator = Math.pow(2, parseInt(stream.read(2),16));
						event.metronome = parseInt(stream.read(2),16);
						event.thirtyseconds = parseInt(stream.read(2),16);
						return event;
					case 0x59:
						event.subtype = 'keySignature';
						if (length != 2) throw "Expected length for keySignature event is 2, got " + length;
						event.key = stream.readInt8(true);
						event.scale = parseInt(stream.read(2),16);
						return event;
					case 0x7f:
						event.subtype = 'sequencerSpecific';
						event.data = stream.read(length*2);
						return event;
					default:
						// console.log("Unrecognised meta event subtype: " + subtypeByte);
						event.subtype = 'unknown'
						event.data = stream.read(length*2);
						return event;
				}
				event.data = stream.read(length*2);
				return event;
			} else if (eventTypeByte == 0xf0) {
				event.type = 'sysEx';
				var length = stream.readVarInt();
				event.data = stream.read(length*2);
				return event;
			} else if (eventTypeByte == 0xf7) {
				event.type = 'dividedSysEx';
				var length = stream.readVarInt();
				event.data = stream.read(length*2);
				return event;
			} else {
				throw "Unrecognised MIDI event type byte: " + eventTypeByte;
			}
		} else {
			/* channel event */
			var param1;
			if ((eventTypeByte & 0x80) == 0) {
				/* running status - reuse lastEventTypeByte as the event type.
					eventTypeByte is actually the first parameter
				*/
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
					if (event.velocity == 0) {
						event.subtype = 'noteOff';
					} else {
						event.subtype = 'noteOn';
					}
					return event;
				case 0x0a:
					event.subtype = 'noteAftertouch';
					event.noteNumber = param1;
					event.amount = parseInt(stream.read(2),16);
					return event;
				case 0x0b:
					event.subtype = 'controller';
					event.controllerType = param1;
					event.value = parseInt(stream.read(2),16);
					return event;
				case 0x0c:
					event.subtype = 'programChange';
					event.programNumber = param1;
					return event;
				case 0x0d:
					event.subtype = 'channelAftertouch';
					event.amount = param1;
					return event;
				case 0x0e:
					event.subtype = 'pitchBend';
					event.value = param1 + (parseInt(stream.read(2),16) << 7);
					return event;
				default:
					throw "Unrecognised MIDI event type: " + eventType
					/* 
					console.log("Unrecognised MIDI event type: " + eventType);
					stream.readInt8();
					event.subtype = 'unknown';
					return event;
					*/
			}
		}
	}
	
	stream = Stream(data);
	var headerChunk = readChunk(stream);
	if (headerChunk.id != 'MThd' || headerChunk.length != 6) {
		throw "Bad .mid file - header not found";
	}
	var headerStream = Stream(headerChunk.data);
	var formatType = parseInt(headerStream.read(4),16);
	var trackCount = parseInt(headerStream.read(4),16);
	var timeDivision = parseInt(headerStream.read(4),16);
	
	if (timeDivision & 0x8000) {
		throw "Expressing time division in SMTPE frames is not supported yet"
	} else {
		ticksPerBeat = timeDivision;
	}
	
	var header = {
		'formatType': formatType,
		'trackCount': trackCount,
		'ticksPerBeat': ticksPerBeat
	}
	var tracks = [];
	for (var i = 0; i < header.trackCount; i++) {
		tracks[i] = [];
		var trackChunk = readChunk(stream);
		if (trackChunk.id != 'MTrk') {
			throw "Unexpected chunk - expected MTrk, got "+ trackChunk.id;
		}
		var trackStream = Stream(trackChunk.data);
		while (!trackStream.eof()) {
			var event = readEvent(trackStream);
			tracks[i].push(event);
			//console.log(event);
		}
	}
	
	return {
		'header': header,
		'tracks': tracks
	}
}
function Replayer(midiFile, synth) {
	var trackStates = [];
	var beatsPerMinute = 120;
	var ticksPerBeat = midiFile.header.ticksPerBeat;
	var channelCount = 16;
	
	for (var i = 0; i < midiFile.tracks.length; i++) {
		trackStates[i] = {
			'nextEventIndex': 0,
			'ticksToNextEvent': (
				midiFile.tracks[i].length ?
					midiFile.tracks[i][0].deltaTime :
					null
			)
		};
	}
	
	function Channel() {
		
		var generatorsByNote = {};
		var currentProgram = DrumProgram;
		
		function noteOn(note, velocity) {
			if (generatorsByNote[note] && !generatorsByNote[note].released) {
				/* playing same note before releasing the last one. BOO */
				generatorsByNote[note].noteOff(); /* TODO: check whether we ought to be passing a velocity in */
			}
			generator = currentProgram.createNote(note, velocity);
			synth.addGenerator(generator);
			generatorsByNote[note] = generator;
		}
		function noteOff(note, velocity) {
			generatorsByNote[note].noteOff(velocity);
		}
		function setProgram(programNumber) {
			currentProgram = PROGRAMS[programNumber] || DrumProgram;
		}
		
		return {
			'noteOn': noteOn,
			'noteOff': noteOff,
			'setProgram': setProgram
		}
	}
	
	var channels = [];
	for (var i = 0; i < channelCount; i++) {
		channels[i] = Channel();
	}
	
	var nextEventInfo;
	var samplesToNextEvent = 0;
	
	function getNextEvent() {
		var ticksToNextEvent = null;
		var nextEventTrack = null;
		var nextEventIndex = null;
		
		for (var i = 0; i < trackStates.length; i++) {
			if (
				trackStates[i].ticksToNextEvent != null
				&& (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)
			) {
				ticksToNextEvent = trackStates[i].ticksToNextEvent;
				nextEventTrack = i;
				nextEventIndex = trackStates[i].nextEventIndex;
			}
		}
		if (nextEventTrack != null) {
			/* consume event from that track */
			var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
			if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
				trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
			} else {
				trackStates[nextEventTrack].ticksToNextEvent = null;
			}
			trackStates[nextEventTrack].nextEventIndex += 1;
			/* advance timings on all tracks by ticksToNextEvent */
			for (var i = 0; i < trackStates.length; i++) {
				if (trackStates[i].ticksToNextEvent != null) {
					trackStates[i].ticksToNextEvent -= ticksToNextEvent
				}
			}
			nextEventInfo = {
				'ticksToEvent': ticksToNextEvent,
				'event': nextEvent,
				'track': nextEventTrack
			}
			var beatsToNextEvent = ticksToNextEvent / ticksPerBeat;
			var secondsToNextEvent = beatsToNextEvent / (beatsPerMinute / 60);
			samplesToNextEvent += secondsToNextEvent * synth.sampleRate;
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
				/* generate samplesToNextEvent samples, process event and repeat */
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
				/* generate samples to end of buffer */
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
		var event = nextEventInfo.event;
		switch (event.type) {
			case 'meta':
				switch (event.subtype) {
					case 'setTempo':
						beatsPerMinute = 60000000 / event.microsecondsPerBeat
				}
				break;
			case 'channel':
				switch (event.subtype) {
					case 'noteOn':
						channels[event.channel].noteOn(event.noteNumber, event.velocity);
						break;
					case 'noteOff':
						channels[event.channel].noteOff(event.noteNumber, event.velocity);
						break;
					case 'programChange':
						//console.log('program change to ' + event.programNumber);
						channels[event.channel].setProgram(event.programNumber);
						break;
				}
				break;
		}
	}
	
	
	
	var self = {		
		'generate': generate,
		'finished': false
	}
	return self;
}
/* Wrapper for accessing strings through sequential reads */
function Stream(str) {
	var position = 0;
	
	function read(length) {
		var result = str.substr(position, length);
		position += length;
		return result;
	}
	
	/* read a big-endian 32-bit integer */
	function readInt32() {
		var result = (
			(str.charCodeAt(position) << 24)
			+ (str.charCodeAt(position + 1) << 16)
			+ (str.charCodeAt(position + 2) << 8)
			+ str.charCodeAt(position + 3));
		position += 4;
		return result;
	}

	/* read a big-endian 16-bit integer */
	function readInt16() {
		var result = (
			(str.charCodeAt(position) << 8)
			+ str.charCodeAt(position + 1));
		position += 2;
		return result;
	}
	
	/* read an 8-bit integer */
	function readInt8(signed) {
		var result = str.charCodeAt(position);
		if (signed && result > 127) result -= 256;
		position += 1;
		return result;
	}
	
	function eof() {
		return position >= str.length;
	}
	
	/* read a MIDI-style variable-length integer
		(big-endian value in groups of 7 bits,
		with top bit set to signify that another byte follows)
	*/
	function readVarInt() {
		var result = 0;
		while (true) {
			var b = parseInt(read(2),16);
			if (b & 0x80) {
				result += (b & 0x7f);
				result <<= 7;
			} else {
				/* b is the last byte */
				return result + b;
			}
		}
	}
	
	return {
		'eof': eof,
		'read': read,
		'readInt32': readInt32,
		'readInt16': readInt16,
		'readInt8': readInt8,
		'readVarInt': readVarInt
	}
}

function SampleGenerator(note) {
    var self = {'alive': true};
    var t = 0;
    var phase = 0;
    var lastNoise = 0; // Used for simple filtering (Hi-hat)

    self.generate = function(buf, offset, count) {
        for (; count; count--) {
            var result = 0;
            var dt = t / sampleRate; // Time in seconds

            if (note === 36) { 
                // --- KICK (808 Style) ---
                // 1. Pitch Envelope: Sweep from ~150Hz down to ~50Hz rapidly
                var freq = 50 + 100 * Math.exp(-dt * 20);
                phase += (freq / sampleRate) * 2 * Math.PI;
                
                // 2. Amp Envelope: Decays over approx 0.4 seconds
                var amp = Math.exp(-dt * 5); 
                
                // 3. Attack Click: Tiny burst of noise at the start for punch
                var click = (dt < 0.002) ? (Math.random() - 0.5) : 0;
                
                // Mix Sine + Click
                result = (Math.sin(phase) * 0.8 + click * 0.4) * amp * 127;
            } 
            else if (note === 38) { 
                // --- SNARE ---
                // 1. Tonal Body: Sine wave dropping 250Hz -> 180Hz
                var freq = 180 + 70 * Math.exp(-dt * 15);
                phase += (freq / sampleRate) * 2 * Math.PI;
                var tone = Math.sin(phase);
                
                // 2. Noise: White noise for the "snares"
                var noise = Math.random() * 2 - 1;
                
                // 3. Envelopes: Tone decays slower, Noise decays faster
                var toneEnv = Math.exp(-dt * 10);
                var noiseEnv = Math.exp(-dt * 20);
                
                // Mix (More noise than tone)
                result = (tone * 0.3 * toneEnv + noise * 0.5 * noiseEnv) * 127;
            } 
            else if (note === 42) { 
                // --- CLOSED HI-HAT ---
                // 1. Metallic Noise: Simple High-Pass Filter (Current Sample - Last Sample)
                var white = Math.random() * 2 - 1;
                var metal = white - lastNoise; 
                lastNoise = white;
                
                // 2. Envelope: Very short, sharp decay
                var amp = Math.exp(-dt * 70); 
                
                result = metal * 0.6 * amp * 127;
            } 
            else if (note === 76) { 
                // --- STICK / WOODBLOCK ---
                // High pitched pure sine wave (800Hz)
                phase += (800 / sampleRate) * 2 * Math.PI;
                
                // Short decay
                var amp = Math.exp(-dt * 50);
                
                result = Math.sin(phase) * amp * 127;
            }

            // Safety cutoff to prevent infinite processing if envelope math lingers
            if (dt > 0.5) result = 0;

            buf[offset++] += result;
            t++;
        }
    }
    return self;
}


function DrumGenerator(child, attackAmplitude, sustainAmplitude, attackTimeS, decayTimeS, releaseTimeS) {
	var self = {'alive': true}
	var attackTime = sampleRate * attackTimeS;
	var decayTime = sampleRate * (attackTimeS + decayTimeS);
	var decayRate = (attackAmplitude - sustainAmplitude) / (decayTime - attackTime);
	var releaseTime = null; /* not known yet */
	var endTime = null; /* not known yet */
	var releaseRate = sustainAmplitude / (sampleRate * releaseTimeS);
	var t = 0;
	
	self.noteOff = function() {
		if (self.released) return;
		releaseTime = t;
		self.released = true;
		endTime = releaseTime + sampleRate * releaseTimeS;
	}
	
	self.generate = function(buf, offset, count) {
		if (!self.alive) return;
		var input = new Array(count);
		for (var i = 0; i < count; i++) {
			input[i] = 0;
		}
		child.generate(input, 0, count);
		
		childOffset = 0;
		
		while(count) {
			if (releaseTime != null) {
				if (t < endTime) {
					/* release */
					while(count && t < endTime) {
						var ampl = sustainAmplitude - releaseRate * (t - releaseTime);
						buf[offset++] += input[childOffset++] * ampl;						
						t++;
						count--;
					}
				} else {
					/* dead */
					self.alive = false;
					return;
				}
			}  else {
				/* sustain */
				while(count) {
					buf[offset++] += input[childOffset++] * sustainAmplitude;					
					t++;
					count--;
					// A VER COMO SE PUEDE CORTAR ESTO DE FORMA MAS ELEGANTE
					//if(childOffset>5000){ self.alive = false; return;}
				}
			}
		}
	}
	
	return self;
}




DrumProgram = {
	'attackAmplitude': 0.2,
	'sustainAmplitude': 1,
	'attackTime': 0.02,
	'decayTime': 0.3,
	'releaseTime': 0.02,
	'createNote': function(note, velocity) {
		
		return DrumGenerator(
			SampleGenerator(note),
			this.attackAmplitude * (velocity / 128), this.sustainAmplitude * (velocity / 128),
			this.attackTime, this.decayTime, this.releaseTime
		);
	}
}




StringProgram = {
	'createNote': function(note, velocity) {
		var frequency = midiToFrequency(note);
		return ADSRGenerator(
			SineGenerator(frequency),
			0.5 * (velocity / 128), 0.2 * (velocity / 128),
			0.4, 0.8, 0.4
		);
	}
}

PROGRAMS = {
	41: StringProgram,
	42: StringProgram,
	43: StringProgram,
	44: StringProgram,
	45: StringProgram,
	46: StringProgram,
	47: StringProgram,
	49: StringProgram,
	50: StringProgram
};

function Synth(sample_rte) {
	
	var generators = [];
	
	sampleRate=sample_rte; 
	
	function addGenerator(generator) {
		generators.push(generator);
	}
	
	function generate(samples) {
		var data = new Array(samples);
		generateIntoBuffer(samples, data, 0);
		return data;
	}
	
	function generateIntoBuffer(samplesToGenerate, buffer, offset) {
		for (var i = offset; i < offset + samplesToGenerate; i++) {
			buffer[i] = 0;
		}
		for (var i = generators.length - 1; i >= 0; i--) {
			generators[i].generate(buffer, offset, samplesToGenerate);
			if (!generators[i].alive) generators.splice(i, 1);
		}
	}
	
	return {
		'sampleRate': sampleRate,
		'addGenerator': addGenerator,
		'generate': generate,
		'generateIntoBuffer': generateIntoBuffer
	}
}
