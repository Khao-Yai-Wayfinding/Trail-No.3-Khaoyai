const fs = require('fs');
const path = require('path');
const stringSimilarity = require('string-similarity');

// === Load JSON data ===
const jsonPath = path.join(__dirname, 'treeDataWithImg.json'); // replace with your JSON file
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const trees = data.nodes; // <-- pull nodes from your JSON

// === Load image filenames ===
const imgFolder = path.join(__dirname, 'TreePic3');
const imageFiles = fs.readdirSync(imgFolder);

// === Normalize helper ===
function normalize(str) {
  return str.toLowerCase().replace(/[\s,_\-().“”"']/g, '');
}

// === Match tree names to images ===
trees.forEach(tree => {
  const target = normalize(tree.name);
  const normalizedFiles = imageFiles.map(f => normalize(path.parse(f).name));

  const matchResult = stringSimilarity.findBestMatch(target, normalizedFiles);

  if (matchResult.bestMatch.rating > 0.4) {
    const matchedFile = imageFiles[matchResult.bestMatchIndex];
    tree.img = `TreePic3/${matchedFile}`;
  } else {
    tree.img = null;
  }
});

// === Save updated data ===
fs.writeFileSync(path.join(__dirname, 'tree_data_with_img.json'), JSON.stringify(data, null, 2), 'utf-8');
console.log('✅ Tree images matched and saved to tree_data_with_img.json');
