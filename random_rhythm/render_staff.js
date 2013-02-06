//    render_staff.js: Staff rendering functions 
//    Copyright (C) 2012 Alexandre Wagemakers (alexandre dot wagemakers at gmail dot com)
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

/* RENDER READING EXERCISES */
function render_reading_exercise(meter_type){

	
	set_options();
	/*Form preamble*/
	var preamble_tmp="X:1\nT: Reading Exercise\nM:"; 
	var postamble="\nL:1/16\nK:clef=perc stafflines=1\n%%barsperstaff  4\n";

	if(meter_type==='simple'){	
		// return options from checkboxes and radio buttons
		var options = $('input:checkbox:checked.onebeat').map(function () {return this.value;}).get(); 
		var difficulty=$('input:radio:checked.tdif').map(function () {return this.value;}).get(); 
		difficulty=difficulty.concat($('input:checkbox:checked.tdif').map(function () {return this.value;}).get());
		var meter_in=$('input:radio:checked.meter').map(function () {return this.value;}).get(); 
		meter_in=meter_in[0]; // to avoid some problem after

	}
	else{
		// Compound meters
		var options=$('input:checkbox:checked.cmp_onebeat').map(function () {return this.value;}).get(); 
		var meter_in=$('input:radio:checked.cmeter').map(function () {return this.value;}).get(); 		
		var difficulty=$('input:radio:checked.cdif').map(function () {return this.value;}).get(); 
		difficulty=difficulty.concat($('input:checkbox:checked.cdif').map(function () {return this.value;}).get());
		meter_in=meter_in[0]; // to avoid some problem after
	}

	preamble= preamble_tmp.concat(meter_in, postamble);
	midipreamble= preamble_tmp.concat(meter_in,"\nL:1/16\nK:clef=perc\n[V:v1] |"); 

	if(meter_in==='7/8') // Special function for 7/8
		staff=generate_reading_exercise_78(options, difficulty, (renderParams.width/1280), bars_number);	
	else
		staff=generate_reading_exercise(options, difficulty, meter_in, meter_type, (renderParams.width/1280), bars_number);

	/*Rendering*/
	var render_str=preamble.concat(staff);
	var midistaff=compose_midi_staff(staff,midipreamble,meter_in);
	render_scores(render_str, midistaff); 

}

/* RENDER 8th GROOVES*/
function render_gr8(){
	set_options();
	
	var preamble="X:1\nT: Random groove\nC:Alexandre Wagemakers\nM: 4/4\nL: 1/16\nK: clef=perc\n%%stretchlast 0\n|";
	var midipreamble= "X:1\nM: 4/4\nL:1/16\nK:clef=perc\n[V:v1] |"; 
	var staff=generate_pattern_markov_8(bars_number);
	/*Rendering*/
	var render_str=preamble.concat(staff);
	var midistaff=compose_midi_staff(staff,midipreamble,'4/4');
	render_scores(render_str, midistaff); 
}

/* RENDER Paradidles GROOVES*/
function render_patterns_paradidles(){
	set_options();
	
	var preamble="X:1\nT: Random groove\nC:Alexandre Wagemakers\nM: 4/4\nL: 1/16\nK: clef=perc\n%%stretchlast 0\n|";
	var midipreamble= "X:1\nM: 4/4\nL:1/16\nK:clef=perc\n[V:v1] |"; 
	var staff=generate_pattern_paradidles(bars_number);
	var render_str=preamble.concat(staff); /*Rendering*/
	var midistaff=compose_midi_staff(staff,midipreamble,'4/4');
	render_scores(render_str, midistaff); 
}

/* ACCENT AND STICKING EXERCISE */
function render_accent_exercise(){
	set_options();
	
	var preamble="X:1\nT: Random groove\nC:Alexandre Wagemakers\nM: 4/4\nL: 1/16\nK: clef=perc stafflines=1\n%%stretchlast 0\n|";
	var midipreamble= "X:1\nM: 4/4\nL:1/16\nK:clef=perc\n[V:v1] |";     
	var options = $('input:checkbox:checked.sticking').map(function () {return this.value;}).get(); 
	var staff=generate_accent_exercise(options,bars_number);
	var render_str=preamble.concat(staff); /*Rendering*/
	var midistaff=compose_midi_staff(staff,midipreamble,'4/4');
	render_scores(render_str, midistaff); 
}

/* Coordination EXERCISE */
function render_coordination_exercise(){
	set_options();
	
	var preamble="X:1\nT: Coordination Exercise\nC:Alexandre Wagemakers\nM:4/4\nL: 1/16\n%%score (v1 v2)\n%%stretchlast 0\n%%barsperstaff 1\nK: clef=perc\n";
	var options=$('input:radio:checked.md_form').map(function () {return this.value;}).get(); 		
	options=options.concat($('input:radio:checked.mi_form').map(function () {return this.value;}).get());
	staff=generate_coordination_exercise(options,bars_number);
	var render_str=preamble.concat(staff);
	var midistaff=compose_midi_staff(staff,preamble,'4/4');
	render_scores(render_str, render_str); 
}

/* Rhythm Scale Exercise*/
function render_scales_exercise(){

	set_options();
	
	var preamble="X:1\nT: Accent Exercise\nC:Alexandre Wagemakers\nM:4/4\nL: 1/32\n%%stretchlast 0\nK: clef=perc stafflines=1\n";
	var midipreamble= "X:1\nM: 4/4\nL:1/32\nK:clef=perc\n[V:v1] |"; 
	var scale_type=$('input:radio:checked.sc1').map(function () {return this.value;}).get(); 		
	var stroke_type=$('input:radio:checked.st1').map(function () {return this.value;}).get(); 		
	staff=generate_scale_exercise(scale_type, stroke_type, bars_number);
	var render_str=preamble.concat(staff);
	bars_number=8;
	var midistaff=compose_midi_staff(staff,midipreamble,'4/4');
	render_scores(render_str, midistaff); 

}

/* Comping Exercise*/
function render_comping_exercise(){

	set_options();
	
	var preamble="X:1\nT: Comping Exercise\nR:Swing feel\nC:Alexandre Wagemakers\n M:4/4\nL:1/16\nK:clef=perc\n%%stems=up\n%%barsperstaff  4\n|:";
	var midipreamble= "X:1\nM: 4/4\nL:1/16\nK:clef=perc\n[V:v1] |"; 
	var voice_type=$('input:checkbox:checked.cmping_vc').map(function () {return this.value;}).get(); 		
	var ex_type=$('input:checkbox:checked.cmping_nt').map(function () {return this.value;}).get(); 			
	var staff=generate_comping_exercise(voice_type, ex_type, 4,  (renderParams.width/1280),bars_number);
	var render_str=preamble.concat(staff,":|\n");

	/* CUSTOM MIDI FOR THIS EXERCISE */
	midiParams={qpm:midi_tempo};
	midistr="";
	meter_in=4; 
	for(i=0;i<(bars_number+1); i++){	
		// Swing pattern
		midistr= midistr.concat("[^F,,4e4] (3:2:3[^F,,2e2]z2^F,,2 [^F,,4e4] (3:2:3[^F,,2e2]z2^F,,2 |");	
	}
	midistaff = staff.replace(/\n/g, '');
	midistaff = midistaff.replace(/F/g, 'C,,');
	midistaff = midistaff.replace(/c/g, 'D,,');
	midistr=midipreamble.concat(midistaff,"\n[V:v2]\n| ", midistr, " |]\n ");
	
	render_scores(render_str, midistr); 

}



function render_scores(abcstring, midistring){
	midiParams.qpm=midi_tempo;
	ABCJS.renderMidi('midicontainer', midistring, {}, midiParams, {});
	ABCJS.renderAbc('notation', abcstring, {}, printerParams, renderParams);
	//$('#maincontent').center();	
	$('#midicontainer').hide();
	$("#myModal").modal('hide');
}


/* Transpose the instrument so the sounds correspond to the staff*/
function compose_midi_staff(staff, preamble, meter){
	
	if(meter==='7/8') meter=7;
	else{ 
		meter=meter.split('/'); // Get the meter metrics. 
		if(meter[1]==='4'){	
			meter=meter[0]*1.0; 
			var meter_type='simple';
		}
		else 
			meter=meter[0]/3;
	}
	
	var midistr='';
	for(i=0;i<(bars_number*meter); i++){	
		if(i%meter==0 && i!=(bars_number-1) && i!=0) midistr= midistr.concat("|");	
		if(meter_type==='simple')
			midistr= midistr.concat("e4");		
		else if(meter===7) // We set the metronome as 8th notes for the 7/8 meter
			midistr= midistr.concat("e2");		
		else  // dot quarter notes in compound patterns
			midistr= midistr.concat("e6");		
	}
	
	// hh = g , sn = c , bd = F  , foot hh= D 
	// For midi transposing: snare=D,,   Bass drum=C,,   closed HH=^F,,
	midistaff = staff.replace(/\n/g, '');
	midistaff = midistaff.replace(/B/g, 'D,,');
	midistaff = midistaff.replace(/c/g, 'D,,');
	midistaff = midistaff.replace(/F/g, 'C,,');
	midistaff = midistaff.replace(/g/g, '^F,,');
	midistaff=preamble.concat(midistaff,"\n[V:v2] |",midistr,"|]\n");
	//alert(midistaff);
	return midistaff;	
}


