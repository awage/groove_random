
echo "Concatenating random generators..."
cd random_rhythm
cat ui_functions.js render_staff.js rdm_rhythm.js > ../rdm_rhythm.js

cd ..

echo "Compressing random..."
java -jar yuicompressor-2.4.2.jar  --line-break 7000 -o rdm_rhythm.min.js rdm_rhythm.js

mv rdm_rhythm.min.js website/js

rm rdm_rhythm.js
