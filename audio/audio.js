var sampleRate;

function AudioPlayer(generator, opts){

	if (!opts) opts = {};
				
		var buffer=new Array();
	
		
		while(!generator.finished){
			buffer = buffer.concat(generator.generate(100000));		
		}		
		
	var dataUri = encodeAudio8bit(buffer,sampleRate);  
	/* Check if tune_wav exists*/  
    if($('#tune_wav').length > 0){
		$('#tune_wav').attr({ src: dataUri});
	}
	else{
   
		var $audioPlayer = $('<audio>').attr({ src: dataUri , id:'tune_wav', onended:'stop_midi();'});
		$('body').append($audioPlayer);    
		
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
    
