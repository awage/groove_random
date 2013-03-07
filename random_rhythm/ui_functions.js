//    ui_functions.js: Functions needed for the user interface to plot the music sheet
//    Copyright (C) 2013 Alexandre Wagemakers (alexandre dot wagemakers at gmail dot com)
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

var renderParams = {width:900}; 
var printerParams = {scale:1, staffwidth:900};
var midiParams={qpm:100};
var play=0;
var midi_tempo=100;
var bars_number=10;


/* Function for centering divs easily */
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
    return this;
}



$(function() {
	
	/*Init sliders*/
	$("#pg_wdth").slider({ from: 100, to: 1400, step: 10, round: 1, format: { format: '##', locale: 'de' }, dimension: 'px', skin: "round" });
	$("#bar_nbr").slider({ from: 1, to: 100, step: 1, round: 1, format: { format: '##', locale: 'de' }, dimension: '', skin: "round" });
	$("#mdi_tmpo").slider({ from: 10, to: 300, step: 1, round: 1, format: { format: '##', locale: 'de' }, dimension: 'bpm', skin: "round" });
	$("#mtro_bpm").slider({ from: 10, to: 300, step: 1, round: 1, format: { format: '##', locale: 'de' }, dimension: 'bpm', skin: "round", callback: function(value){ if($.metronome.ticking===true){$.metronome.stop(); $.metronome.tempo=value/60; $.metronome.start();} }});
	$("#listen_bpm").slider({ from: 10, to: 300, step: 1, round: 1, format: { format: '##', locale: 'de' }, dimension: 'bpm', skin: "round", callback: function(value){ if(play==1){StopSound('tune_wav'); play=0; play_midi(); } }});
	
	
	/* Toggle player */
	$('#play_pop').click(function(e) {     
		if(midiParams.miditrack){
			if(play==0){
				var list_bpm=$('#listen_bpm').slider('value');
				midiFile = MidiFile(midiParams.miditrack,list_bpm);		
				synth = Synth(22100);
				replayer = Replayer(midiFile, synth);
				AudioPlayer(replayer);
				PlaySound('tune_wav');				
				play=1; 
				//$('#play_pop i').attr("class","icon-white icon-stop");	
				
				$('#play_pop').html('<i class="icon-white icon-stop"></i>Stop');
					
				return false;
			}
			if(play==1){
				StopSound('tune_wav');
				play=0;
				//$('#play_pop i').attr("class","icon-white icon-play");	
				$('#play_pop').html('<i class="icon-white icon-play"></i>Play');
				return false;
			}
		}
	});

	/* Set the metronome event*/
	$(document).bind('tick', function(){		
		PlaySound('tickwav');
	});
	
	
	
});
	
function PlaySound(soundObj) {
	var sound = document.getElementById(soundObj);
	if (sound){
		//$(soundObj).attr({onended:'stop_midi();'});
		sound.play();		
		
	}
}

function StopSound(soundObj) {
	var sound = document.getElementById(soundObj);
	if (sound){
		sound.pause();
		sound.currentTime = 0;
	}
}
	
function toggle_metronome(){
	if($.metronome.ticking === true){
		$.metronome.stop(); 
		$("#metro_btn").text('Start');
	}
	else{
		$.metronome.start($('#mtro_bpm').slider('value')/60); 
		$("#metro_btn").text('Stop');
	}
}	

function play_midi(){
	if(play==0){
			
			var list_bpm=$('#listen_bpm').slider('value');
			midiFile = MidiFile(midiParams.miditrack,list_bpm);		
			synth = Synth(22100);
			replayer = Replayer(midiFile, synth);
			AudioPlayer(replayer);
			PlaySound('tune_wav');
			play=1; 
			$('#play_pop').html('<i class="icon-white icon-stop"></i>Stop');
			return false;
	}
}

function stop_midi(){
	play=0;
	StopSound('tune_wav');
	$('#play_pop').html('<i class="icon-white icon-play"></i>Play');
	
}

	

/* PRINTING OPTIONS*/

function printDiv(divName) {
	var printContents = document.getElementById(divName).innerHTML;
	var mywindow = window.open('', 'Random Rhythm', 'height=1400,width=700');
	mywindow.document.write('<html><head><title>Random Rhythm</title>');
	mywindow.document.write('</head><body >');
	mywindow.document.write(printContents);
	mywindow.document.write('</body></html>');
	mywindow.print();
	mywindow.close();
	return false;
}


function print_midi(divName) {
	// Generate the audio and midi files
	var list_bpm=$('#listen_bpm').slider('value');
	
	midiFile = MidiFile(midiParams.miditrack,list_bpm);		
	synth = Synth(11025);
	replayer = Replayer(midiFile, synth);
	AudioPlayer(replayer);
	var wavdat=$('#tune_wav').attr('src');	 
	var a = document.createElement('a');
	a.setAttribute('href',wavdat);
	a.innerHTML = 'Click right button and select "save link as" to download the wav file';	
	var mywindow = window.open('', 'Midi', 'height=400,width=700');
	mywindow.document.write('<html><head><title>Random Rhythm</title>');
	mywindow.document.write('</head><body >');
	mywindow.document.write($('#midicontainer').html());
	mywindow.document.write('<br>');
	mywindow.document.getElementsByTagName('body')[0].appendChild(a);
	mywindow.document.write('</body></html>');
	return false;
}



/* SET RENDERING OPTIONS */
function set_options(){
	max_size=alertSize();	
	midi_tempo=($('#mdi_tmpo').slider('value'))*1.0;
	bars_number=($('#bar_nbr').slider('value'))*1.0;
	pg_width=($('#pg_wdth').slider('value'))*1.0;
	if(pg_width<max_size){
	    renderParams.width=pg_width*1.0; 
	    printerParams.staffwidth=pg_width*1.0;
	}
	else{
		// Set max width to 80% of the window
		renderParams.width=max_size*0.9; 
		printerParams.staffwidth=max_size*0.9;
	}
}

/* Get screen size for rendering */
function alertSize() {
  /* TODO IMPLEMENT WITH JQUERY*/
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return myWidth;
}



