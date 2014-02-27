echo "Concatenating ABCjs..."
cd abcjs
cat parse/abc_common.js parse/abc_parse.js parse/abc_parse_directive.js parse/abc_parse_header.js parse/abc_parse_key_voice.js parse/abc_tokenizer.js > tmp/parse.js
cat write/abc_glyphs.js write/abc_graphelements.js write/abc_layout.js write/abc_write.js write/sprintf.js > tmp/write.js
cat api/abc_tunebook.js data/abc_tune.js midi/abc_midiwriter.js tmp/parse.js tmp/write.js > tmp/abcjs-no-raphael.js
cat raphael.js tmp/abcjs-no-raphael.js > tmp/abcjs_all.js
cp tmp/abcjs_all.js ..

echo "Concatenating audio_player..."
cd ../audio
cat audio.js midifile.js replayer.js stream.js synth.js > ../audio_player.js

echo "Concatenating plugins..."
cd ../jquery_plugins
cat jquery.metronome.js jquery.scrollnav.js jquery.slider.min.js > ../jquery_plugs.js

echo "Concatenating random generators..."
cd ../random_rhythm
cat ui_functions.js render_staff.js rdm_rhythm.js > ../rdm_rhythm.js

cd ..

echo "Compressing basic..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o abcjs_basic.min.js abcjs_all.js
echo "Compressing plugins..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o jq_plugins.min.js jquery_plugs.js
echo "Compressing audio..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o audio.min.js audio_player.js
echo "Compressing random..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o rdm_rhythm.min.js rdm_rhythm.js

mv abcjs_basic.min.js website/js
mv jq_plugins.min.js website/js
mv audio.min.js website/js
mv rdm_rhythm.min.js website/js

rm abcjs_all.js jquery_plugs.js audio_player.js rdm_rhythm.js
