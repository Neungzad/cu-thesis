const tree = require('./data/tree_src.json');
var natural = require('natural');
const fs = require('fs');
const stemTree = {};

// stem function
const stem = (key) => {
  let word;
  if(tree[key].isCode || key.match(/[\.\-]|(js)$/gi)) {
    return key;
  }

  return natural.PorterStemmer.stem(key);
}

// start
Object.keys(tree).forEach(k => {
  const stemWord = stem(k); 

  const parentKey = tree[k].parent;
  let stemParent = null;
  if (parentKey) {
    stemParent = stem(parentKey); 
  }

  stemTree[stemWord] = Object.assign({}, tree[k], {
    word: stemWord,
    parent: stemParent
  });

});

fs.writeFile('./data/tree.json', JSON.stringify(stemTree)); 
console.log("Tree written completed.");