//    rdm_rhythm.js: Generators to produce random scores
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

// Special function for 7/8 meters
function generate_reading_exercise_78(ex_type, difficulty, width_factor, num_bars){

    var i;
    var level;
    var dynmcs;
    var rnum;
    var tmpstr="";
    var staff="";    
    var notes_per_line=0;

	/* Check Exercise level */    
	level=difficulty[0];
	if(difficulty.length>1) dynmcs=1;


	/* First we choose a mixed meter [1 1 1.] or [1. 1 1] in terms of meter unit*/	
	meter_comb =new Array();
	meter_comb[0]=[1, 1, 1.5];
	meter_comb[1]=[1, 1.5, 1];
	meter_comb[2]=[1.5, 1, 1];
	rnum=Math.floor(3*Math.random());
	meter_comb=meter_comb[rnum];
	
	staff="R: Meter combination is:"
	for(i=0;i<3;i++) staff=staff.concat((meter_comb[i]===1 ? ' 8th ' : ' dot-8th'));
	staff=staff.concat('\n');
	
	var meter_in=3;
	
	num_notes=num_bars*3;
	
    /*Ex type 0=4th 1=8th 2=16th 3=triplets ...*/
	/* para silencios */
	ex_type.push(0.0);

    for(i=0; i<num_notes ; i++){

		if(i%meter_in==0 && i!=(num_notes-1) && i!=0)
			staff=staff.concat("| ");

		if(((notes_per_line >  40*width_factor)&& (i%meter_in==0)) ){
			staff=staff.concat("\n ");
			//alert(notes_per_line);
			notes_per_line=0; 
		}

		// TODO Poner la dinamica en una funcion
		if(i%(meter_in*4)==0 && dynmcs){
			tmpstr=set_dynamics();
			staff=staff.concat(tmpstr);
		}
				
				
		rnum=Math.floor(ex_type.length*Math.random());
		if(meter_comb[i%meter_in] === 1)
			ret=print_score_simple(ex_type[rnum], level);
		else
			ret=print_score_compound(ex_type[rnum], level);
		
		staff=staff.concat(ret.str);
		
		//Aproximative note counts
		//notes_per_line = notes_per_line + tmpstr.replace(/[^B]/g, "").length;
		notes_per_line = notes_per_line + ret.num_notes;
			
    }	

    staff=staff.concat("|]\n");
    //tmpstr=preamble.concat(staff);

    return staff;
}



function generate_reading_exercise(ex_type,difficulty, meter_in, meter_type, width_factor, num_bars){

    var i;
    var level;
    var dynmcs;
    var rnum;
    var tmpstr="";
    var staff="";    
    var notes_per_line=0;
	var simple=1;
	var compound=2;

/* Check Exercise level */    
level=difficulty[0];
if(difficulty.length>1) dynmcs=1;


if(meter_type==='simple'){
 	var print_score=print_score_simple; // assign the function that generate the score	
 	meter_in=meter_in.split('/'); // Get the meter metrics. 
	meter_in=meter_in[0]*1.0;
}
else{		 				
	var print_score=print_score_compound;
	meter_in=meter_in.split('/');
	meter_in=meter_in[0]/3.0;
}	



num_notes=num_bars*meter_in;
	
    /*Ex type 0=4th 1=8th 2=16th 3=triplets ...*/
	/* para silencios */
	ex_type.push(0.0);


    for(i=0; i<num_notes ; i++){

		if(i%meter_in==0 && i!=(num_notes-1) && i!=0)
			staff=staff.concat("| ");

		if(((notes_per_line >  40*width_factor)&& (i%meter_in==0)) ){
			staff=staff.concat("\n ");			
			notes_per_line=0; 
		}

		
		if(i%(meter_in*4)==0 && dynmcs){
			tmpstr=set_dynamics();
			staff=staff.concat(tmpstr);
		}
		
			
			rnum=Math.floor(ex_type.length*Math.random());
			if(ex_type[rnum]>=8){ //We have to align the figure to the beat depedending on the meter
				if((i%meter_in)<=(meter_in-2)){
					 // there is room to print two beats
					ret=print_score(ex_type[rnum], level);
					
					i++;
				}
				else{ // we pick another exercise.
					while(ex_type[rnum]>=8){
						rnum=Math.floor(ex_type.length*Math.random());
					}
					ret=print_score(ex_type[rnum], level);
				}
				 
					
			}
			else{
				ret=print_score(ex_type[rnum], level);
			}
				
		
		staff=staff.concat(ret.str);
		
		//Aproximative note counts
		//notes_per_line = notes_per_line + tmpstr.replace(/[^B]/g, "").length;
		notes_per_line = notes_per_line + ret.num_notes;
			
    }	

    staff=staff.concat("|]\n");
    

    return staff;
}

function set_dynamics(){

    var dynamics=["!ppp!","!pp!", "!p!",  "!f!", "!ff!", "!fff!"];
    var transitions=["!crescendo(!", "!crescendo)!", "!diminuendo(!", "!diminuendo)!" ];
    
	rnum=Math.floor(dynamics.length*Math.random());
	
	return(dynamics[rnum]);


}

function print_score_simple(exnum, level){
	
	var ret={};
	ret.str="";
	ret.num_notes=0;
	
    if(exnum==0){

	    ret.str=" z4 "; 
	    ret.num_notes=1;
    }
    if(exnum==1){

	    ret.str=" B4 ";
	    ret.num_notes=1; 
    }
    if(exnum==2){

	if(level==1){
	   
		ret.str=" B2B2 "; 
		ret.num_notes=2;
	
	}
	if(level==2){
	   
	    var patterns=[" B2z2 "," B2B2 "," z2B2 "]
	    num_pat=Math.floor(patterns.length*Math.random());
	    ret.str=patterns[num_pat]; 
		ret.num_notes=2;
		
	}
	
    }
    if(exnum==3){
	if(level==1){
		ret.str=" BBBB ";  
	}
	if(level==2){
		var patterns=[" BBBB "," zB3 "," z2B2 "," z3B "," BBz2 "," BzBz "," B3B "," z BB z "," z BB2 "," z B z B "," z B2B "," z2BB ", 
		  " zBBB "," B z BB "," B2BB ", " BB z B ", " BB2B ", " BBBz ", " BBB2 "];
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 		 		
		ret.num_notes=ret.str.replace(/[^B]/g, "").length + ret.str.replace(/[^z]/g, "").length;
    }
	}  
    if(exnum==4){

	if(level==1){
		ret.str=" (3:2:3B2B2B2 "; 
		ret.num_notes=3;
	}
	if(level==2){
	    var patterns=[" (3B2B2B2 ", " (3 B2z2B2 "," (3 z2B2B2 "," (3 B2B2z2 ", " (3 z2B2z2 ", " (3 z2z2B2 "];	    
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 	    
		ret.num_notes=3;
		
	}
	
    }
    if(exnum==5){

	if(level==1){
		
		ret.str=" (5BBBBB "; 
		ret.num_notes=5;

	}
	if(level==2){
	    var patterns=[" (5BBBBB ", " (5 BzBBB "," (5 BBzBB "," (5 BBBzB ", " (5 BBBzB ", " (5 BBBBz ", " (5 zBBBB ", " (5 zBzBz ", 
	    " (5 zzBBz ", " (5 zBBzz ", " (5 BzBBz ", " (5 BzBzB ", " (5 zBBBz ", " (5 zzBBB ", " (5 BzzzB "];
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 	     
		ret.num_notes=5;
		
	}
	
    }
    if(exnum==6){

	if(level==1){
		ret.str=" (6BBBBBB "; 
		ret.num_notes=6;
	}
	if(level==2){
	    var patterns=[" (6BBBBBB ", " (6 BzBBBB "," (6 BBzBBB "," (6 BBBzBB "," (6 BBBBzB "," (6 BBBBBz "];
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 		   
		ret.num_notes=6;
	}
	
    }
    if(exnum==7){

	if(level==1){
		ret.str=" (7BBBBBBB "; ret.num_notes=7;
	}
	if(level==2){
	    var patterns=[" (7BBBBBBB "," (7 BzBBBBB "," (7 BBzBBBB "," (7 BBBzBBB ", " (7 BBBBzBB "," (7 BBBBBzB "];	   
		num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 		   
		ret.num_notes=7;	
	}
	
    }
    if(exnum==8){

	if(level==1){
		ret.str=" (3:2:3B4B4B4 "; ret.num_notes=3;
	}
	if(level==2){
	    var patterns=[" (3:2:3z4B4B4 "," (3:2:3B4z4B4 "," (3:2:3B4B4z4 "," (3:2:3z4z4B4 "," (3:2:3B4z4z4 "," (3:2:3B4z4z4 "];
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 	
		ret.str=" (3:2:3B4z4z4 "; ret.num_notes=3;
		
	}
	
    }
    if(exnum==9){

	if(level==1){
		ret.str=" (5:4:5B2B2B2B2B2 "; ret.num_notes=5;
	}
	if(level==2){
	    var patterns=[" (5:4:5B2B2B2B2B2 "];
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 	
	    ret.num_notes=5;
		
	}
	
    }
  if(exnum==10){

	if(level==1){
		ret.str=" (7:4:7B2B2B2B2B2B2B2 "; ret.num_notes=7;
	}
	if(level==2){
	    var patterns=[" (7:4:7B2B2B2B2B2B2B2 "];
	    num_pat=Math.floor(patterns.length*Math.random());
 	    ret.str=patterns[num_pat]; 	
		ret.num_notes=7;
	
	}
	
    }


    return ret;
}

function print_score_compound(exnum, level){

	var ret={};
	ret.str="";
	ret.num_notes=0;

    if(exnum==0){

	    ret.str=" z6 "; ret.num_notes=1;
    }
    if(exnum==1){

	    ret.str=" B6 ";  ret.num_notes=1;
    }
    if(exnum==2){

	if(level==1){
	   
		ret.str=" B2B2B2 "; ret.num_notes=3;
	
	}
	if(level==2){
		ret.str=" "; 	    
		for(k=0;k<3;k++){
			if(Math.random()>0.5)
				ret.str=ret.str.concat("B2");
			else
				ret.str=ret.str.concat("z2");
		}	
	    ret.str=ret.str.concat(" ");
	    ret.num_notes=3;
	}
}

 if(exnum==3){

	if(level==1){
	   
		ret.str=" BBBBBB "; ret.num_notes=6;
	
	}
	if(level==2){

	ret.str=" "; 	    
		for(k=0;k<6;k++){
			if(Math.random()>0.5)
				ret.str=ret.str.concat("B");
			else
				ret.str=ret.str.concat("z");
		}	
	    ret.str=ret.str.concat(" ");
	ret.num_notes=6;

	}
}

 if(exnum==4){

	if(level==1){
	   
		ret.str=" (4:6:4BBBB "; ret.num_notes=4;
	
	}
	if(level==2){
	
	ret.str=" (4:6:4"; 	    
		for(k=0;k<4;k++){
			if(Math.random()>0.5)
				ret.str=ret.str.concat("B");
			else
				ret.str=ret.str.concat("z");
		}	
	    ret.str=ret.str.concat(" ");
	    ret.num_notes=4;

	}
	
}

if(exnum==5){

	if(level==1){
	   
		ret.str=" (5:6:5BBBBB "; ret.num_notes=5;
	
	}
	if(level==2){
			ret.str=" (5:6:5"; 	    
		for(k=0;k<5;k++){
			if(Math.random()>0.5)
				ret.str=ret.str.concat("B");
			else
				ret.str=ret.str.concat("z");
		}	
	    ret.str=ret.str.concat(" ");
	   ret.num_notes=5;
	}
	
}

if(exnum==6){

	if(level==1){
	   
		ret.str=" (7:6:7BBBBBBB "; 
		ret.num_notes=7;
	
	}
	if(level==2){
			ret.str=" (7:6:7"; 	    
		for(k=0;k<7;k++){
			if(Math.random()>0.5)
				ret.str=ret.str.concat("B");
			else
				ret.str=ret.str.concat("z");
		}	
	    ret.str=ret.str.concat(" ");
		ret.num_notes=7;
	}
	
}
if(exnum==7){

	if(level==1){
	   
		ret.str=" (8:6:8BBBBBBBB "; ret.num_notes=8;
	
	}
	if(level==2){
		ret.str=" (8:6:"; 	    
		for(k=0;k<8;k++){
			if(Math.random()>0.5)
				ret.str=ret.str.concat("B");
			else
				ret.str=ret.str.concat("z");
		}	
	    ret.str=ret.str.concat(" ");
		ret.num_notes=8;
	}
	
}


	
return ret;

}

var N_tab=8;
var M_tab=8;
var trans_tab=[[0, 0, 0, 0, 2./9., 2./9., 4./9. ,1./9.],
	       [0, 0, 0, 4./7., 1./7., 1./7., 1./7., 0 ],
	       [0, 1, 0, 0, 0, 0, 0 , 0],
	       [10./18., 1./18., 1./18., 1./18., 0, 0, 5./18., 0],
	       [2./6., 3./6., 0, 1./6., 0, 0, 0 , 0],
	       [1./4., 2./4., 0, 0, 1./4., 0, 0 , 0],
	       [1./10., 3./10., 0, 3./10., 0, 0, 0, 3./10.],
	       [0, 0, 0, 2./4., 1./4., 0, 1./4., 0]];


function generate_pattern_markov_8(bars_number){




    var sequencia=new Array(NUM_NOTAS);

    var i;
    var NUM_NOTAS=32*2;
    var n_state=N_tab;
    var tmpstr="";
  

    sequencia[0]=generate_initial_state();	

	NUM_NOTAS=bars_number*4;

    for(i=1;i<NUM_NOTAS; i++){

	if(i%4 == 0)
	    sequencia[i]=generate_initial_state();	
	else	
	    sequencia[i]=gen_next_state(sequencia[i-1]);

    }

	NUM_NOTAS=bars_number*4;

    tmpstr=print_partitura_gr8(sequencia, NUM_NOTAS, tmpstr);

	tmpstr=tmpstr.concat("|]\n");

    return tmpstr;

}


/* Generate the next state acording to the transition probability*/

function gen_next_state(prev_state){

    var i,j,next_state;
    var rnum,temp; 

    /*generate rand number in [0,1] */
    rnum=Math.random();

    i=0; 
    temp=trans_tab[prev_state][0]; 

    while(temp<rnum){
	
	temp += trans_tab[prev_state][++i]; 
	
    }

    return i;

}


function generate_initial_state(){

    var i,j,next_state;
    var rnum,temp; 
    var table=[0, 2./20., 0, 12./20., 2./20., 1./20., 1./20., 2./20.];

    /*generate rand number in [0,1] */
    rnum=Math.random();

    i=0; 
    temp=0; 

    while(temp<rnum){
	
	temp += table[i++]; 
	
    }

    return (i-1);

}


function print_partitura_gr8(array, num, str){

    var i,j,nums_sil; 

    for(i=0; i<num ; i ++){

	if(i%4 == 0 && i!=0) str=str.concat("|");
	if(i%16 == 0 && i!=0) str=str.concat("\n");

	switch(array[i]){
	    // hh = g  sn = c  bd = F  foot hh= D 
	case 0: 
	    str=str.concat(" [g2c2]g2 "); 
	    break;
	case 1: 
	    str=str.concat(" g2[g2c2] ");
	    break;
	case 2:
	    str=str.concat(" [g2c2][g2c2] "); //<hh sn>8[ <hh sn>8] 
	    break;
	case 3: 
	    str=str.concat(" [g2F2]g2 ");
	    break;
	case 4: 
	    str=str.concat(" g2[g2F2] ");
	    break;
	case 5: 
	    str=str.concat(" [g2F2][g2F2] ");
	    break;
	case 6:
	    str=str.concat(" [g2c2][g2F2] ");
	    break;
	case 7:
	    str=str.concat(" [g2F2][g2c2] ");
	    break;
	    
	}





    }

    //str=str.concat("\n ");
    return str;


}


function generate_accent_exercise(ex_type, bar_numbers){

    var i;
    var rnum;
    var num_notes=0;
    var tmpstr="";
    var staff="";
    var meter=4;
	var notes_per_line=0;
	var level=1;

	num_notes=bars_number*meter;

    for(i=0; i<num_notes ; i++){

		if(i%meter==0 && i!=(num_notes-1) && i!=0)
			staff=staff.concat("| ");

		if(((notes_per_line >  15)&& (i%meter==0)) ){
			staff=staff.concat("\n ");
			//alert(notes_per_line);
			notes_per_line=0; 
		}
	
		// If there are only two type of exercise, we put less silences
		// we plot notes
		rnum=Math.floor(ex_type.length*Math.random());
		tmpstr=print_accent_score(ex_type[rnum], level);

		if(ex_type[rnum]==='1'){
			if(i%4==1 || i%4==4) // insert space only on first and third time to join beams gracefully
				tmpstr=tmpstr.concat("  "); 
		}
							
		staff=staff.concat(tmpstr);
		
		//Aproximative note counts
		notes_per_line = notes_per_line + tmpstr.replace(/[^B]/g, "").length;
		notes_per_line = notes_per_line + tmpstr.replace(/[^z]/g, "").length;
			
    }	

    staff=staff.concat("|]\n");  
    return staff;
}


function print_accent_score(ex_type, level){
	
	var str=""; 
	
	if(ex_type==='1'){
		
		for(i=0;i<2;i++){
		
			/* accent */
			if(Math.random()<0.2) 
				str=str.concat("!>!"); 
			
			/* Hand */
			if(Math.random()<0.5) 
				str=str.concat("\"_R\""); 
			else
				str=str.concat("\"_L\""); 
			
			str=str.concat("B2"); 
		}
		
		return str;
		
	}
		
	if(ex_type==='2'){
		
		str=" (3 "
		for(i=0;i<3;i++){
			
			
			/* accent */
			if(Math.random()<0.2) 
				str=str.concat("!>!"); 
			
			/* Hand */
			if(Math.random()<0.5) 
				str=str.concat("\"_R\""); 
			else
				str=str.concat("\"_L\""); 
			
			str=str.concat("B2"); 
		}
		str=str.concat(" "); 
		return str;
		
	}
	
	
	if(ex_type==='3'){
		
		str=" ";
		for(i=0;i<4;i++){
			
			
			/* accent */
			if(Math.random()<0.2) 
				str=str.concat("!>!"); 
			
			/* Hand */
			if(Math.random()<0.5) 
				str=str.concat("\"_R\""); 
			else
				str=str.concat("\"_L\""); 
			
			str=str.concat("B"); 
		}
		str=str.concat(" "); 
		return str;
		
	}
	
}


function generate_coordination_exercise(options, bar_numbers){

    
var meter=4;
var tmpstr='';

meter=4; 
level=1;
bar_numbers=1;
// MANO DERECHA
manodcha="[V:v1]"

manodcha=manodcha.concat(print_coordination_score(options[0], level),"||\n ");
manodcha = manodcha.replace(/c/g, 'd');
// MANO IZQUIERDA
manoizq="[V:v2]"
manoizq=manoizq.concat(print_coordination_score(options[1], level),"||\n ");
manoizq = manoizq.replace(/c/g, 'F');

	tmpstr=tmpstr.concat(manodcha,manoizq);
	
    return tmpstr;
}


function print_coordination_score(ex_type, level){
	
	var str=""; 
	
	if(ex_type==0){
		str="c4c4c4c4";		
	}
	if(ex_type==1){
		str="c2c2c2c2 c2c2c2c2";
	}
	if(ex_type==2){
		str="(3c2c2c2 (3c2c2c2 (3c2c2c2 (3c2c2c2";
	}
	if(ex_type==3){
		str="cccc cccc cccc cccc";
	}
	if(ex_type==4){
		str="(5ccccc (5ccccc (5ccccc (5ccccc";
	}
	if(ex_type==5){
		str="(6cccccc (6cccccc (6cccccc (6cccccc";
	}
	if(ex_type==6){
		str="(7ccccccc (7ccccccc (7ccccccc (7ccccccc";
	}
	if(ex_type==7){
		str="(3:2:3c4c4c4 (3:2:3c4c4c4";
	}
	if(ex_type==8){
		str="(5:4:5c2c2c2c2c2 (5:4:5c2c2c2c2c2";
	}
	str=str.concat(" "); 

	return str;
	
	
}


function generate_scale_exercise(scale_type, stroke_type, bars_number){

    
var meter=4;

meter=4; 
level=1;
bar_numbers=1;

subdiv=8;

if(scale_type=='1'){
	//base note 8th
	note_length=4; 
		mult_note=1;
}
if(scale_type=='2'){
	//base note 4th
	note_length=8; 
	mult_note=2;
}	
if(scale_type=='3'){
	//base note 2th
	note_length=16; 
	mult_note=4;
}	

if(stroke_type=='1'){
nota="B";
}


if(stroke_type=='2'){
nota=["B","B","F","F"];
}

if(stroke_type=='3'){
nota=["B","F","B","B","F","B","F","F"];
}



var line="";
var groups=["","","", "(3:2:3", "", "(5:4:5", "(6:4:6", "(7:4:7", ""]; 
var pat="";
ind=0;
for(i=2; i<=8 ; i++){
	if(i==4 || i==8)
		note_length=note_length/2; 
		
	ind=0;
	j=1;
	do{
		/*Form basic pattern*/
		pat=groups[i]; 
		
		for(k=1; k<=i; k++){			
			pat=pat.concat(nota[(ind%nota.length)],note_length.toString()); 
			ind++;		
		}	

		line=line.concat(pat," "); 
		
		if(((ind%nota.length)!=0) && (j==(Math.round(meter/mult_note)))){
			j=0; //Añadimos una vuelta.
			line=line.concat("|"); 
		}
					
		j++;
	}while(j<=(meter/mult_note))
	line=line.concat("|\n"); 

}
	
    return line;    
}



function generate_comping_exercise(voice_type, ex_type, meter_in, width_factor, num_bars){

    var i;
    var level;
    var rnum;
    var tmpstr="";
    var staff="";    
    var notes_per_line=0;
	var instr; 
	
	level=1;
	
	num_notes=num_bars*meter_in;
	
    /*Ex type 0=4th 1=8th 2=16th 3=triplets ...*/
	/* para silencios */
	tmp_type=['0','1']; 
	
	ex_type=ex_type.concat(tmp_type);
	

    for(i=0; i<num_notes ; i++){

		if(i%meter_in==0 && i!=(num_notes-1) && i!=0)
			staff=staff.concat("| ");

		if(((notes_per_line >  30*width_factor)&& (i%meter_in==0)) ){
			staff=staff.concat("\n ");
			//alert(notes_per_line);
			notes_per_line=0; 
		}

		rnum=Math.floor(ex_type.length*Math.random());
		ret=print_score_comping(ex_type[rnum], level, voice_type);
		
		staff=staff.concat(ret.str);
		
		//Aproximative note counts
	
		notes_per_line = notes_per_line + ret.num_notes;
			
    }	

    
    return staff;
}



function print_score_comping(exnum, level, voice_type){
	
	var ret={};
	ret.str=" ";
	ret.num_notes=0;

if(level==1){
	
	if(voice_type.length > 1){
		
		if( Math.random()<0.5)
			vt="c"; // snare
		else
			vt="F"; // bass drum
	}
	else
		vt="c";
		
	
    if(exnum=='0'){
	    ret.str=" z4 "; 
	    ret.num_notes=1;
    }
    if(exnum=='1'){
	    ret.str=ret.str.concat(vt,"4 ");
	    ret.num_notes=1; 
    }
    if(exnum=='2'){
		
	    num_elem=2;
	    num_pat=Math.floor(num_elem*Math.random());
	    switch(num_pat){	    
	    case 0:   
		//ret.str=ret.str.concat(vt,"2",vt,"2 ");
		ret.str=ret.str.concat("(3",vt,"2z2",vt,"2 ");
		ret.num_notes=2;
		break; 
	    case 1:   
		//ret.str=ret.str.concat("z2",vt,"2 ");
		ret.str=ret.str.concat("(3z2z2",vt,"2 ");
		ret.num_notes=2;
		break; 
	    }
	
    }
    if(exnum=='3'){
   
	    num_elem=3;
	    num_pat=Math.ceil(num_elem*Math.random());
        
	    switch(num_pat){
	
	    case 1: 
		ret.str=ret.str.concat(" (3 z2",vt,"2",vt,"2 ");
		ret.num_notes=3;
		break;
	    case 2:  
		ret.str=ret.str.concat(" (3",vt,"2",vt,"2z2 ");
		ret.num_notes=3;
		break;
	    case 3:  
		ret.str=ret.str.concat(" (3 z2",vt,"2z2 ");
		ret.num_notes=3;
		break;
	

	    }

    }   
    
}
    
    return ret;
    
}



function generate_pattern_paradidles(bars_number){

    var i;
    
    var rnum;
    var tmpstr="";
    var staff="";    
    var notes_per_line=0;
	
	var meter_in=4;
	
	var width_factor=0.9;

    for(i=0; i<bars_number ; i++){

				

		str=print_partitura_paradidle();
		
		staff=staff.concat(str);
				
    }	
    
    return staff;

}


function print_partitura_paradidle(){

    var i,k; 
	// hh = g  sn = c  bd = F  foot hh= D 
	var paradidles=[' gcgg ', ' !>!cgcc ', ' gcgc' , ' !>!cgcg ' , ' gcgg ' , ' !>!cgcc ', ' gccg ', ' !>!cggc ']; 
	var bass_drum=[' F4 ', ' F2F2 ', ' F3F ', ' z2FF' ]
	
	var str_v1='';
	var str_v2='';	
	//[g2F2]
	
	for(i=0;i<2;i++){
		/* Choose a even number first, between 0 and 7. */
		rnum_even=Math.floor(Math.random()*7/2)*2;
		
		/* Choose a odd number, between 0 and 7. */
		rnum_odd=Math.floor(Math.random()*7/2)*2 +1;
				
		var str_tmp=paradidles[rnum_even]; 
		str_v2='';
		for(k=1;k<5;k++){
			if(str_tmp.substring(k,k+1)=='g'){
				str_v2=str_v2.concat(Math.random()>0.2? '[Fg]': 'g');
			}
			else
				str_v2=str_v2.concat('c');
		}						
		str_v1=str_v1.concat(str_v2, paradidles[rnum_odd]);	
	}
	
	var str='';	
    str=str.concat(str_v1,'|\n ');
    return str;
}
