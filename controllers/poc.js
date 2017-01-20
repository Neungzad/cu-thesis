"use strict";

const fs = require('fs');
const sql = require('mssql');
const stopWordEnglish = require('../stop-word-english').english;
const sw = require('stopword');
const _ = require('underscore');
const tree = require('../data/tree.js');
var natural = require('natural');

// Difficulty level
const EASY = "Easy";
const NORMAL = "Normal";
const HARD = "Hard";

const config = {
  user: 'sa',
  password: '1234',
  server: 'localhost',
  database: 'StackOverflow',
  requestTimeout: 60000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

var visitNode = {};

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  
  const difficuty = [
    // set 1
    NORMAL, NORMAL, EASY, EASY, EASY, HARD, NORMAL, HARD, EASY, NORMAL,  // 10 
    // set 2   
    EASY, NORMAL, NORMAL, NORMAL, EASY, NORMAL, EASY, NORMAL, EASY, // 9 (19)
    // set 3 
    NORMAL, EASY, NORMAL, NORMAL, EASY, EASY, NORMAL, EASY, NORMAL,  // 9 (28)
    // set 4 
    HARD, NORMAL, NORMAL, NORMAL, NORMAL, EASY, NORMAL, EASY, EASY, EASY, // 10 (38)
    // set 5 
    NORMAL, NORMAL, EASY, EASY, NORMAL, EASY, // 6 (44)
    // set 6 
    NORMAL, EASY, EASY, EASY, HARD, NORMAL, NORMAL, EASY, EASY, EASY, // 10 (54)
    // set 7 - แม้ง ๆ  
    NORMAL, EASY, EASY, NORMAL, NORMAL, NORMAL, EASY, EASY, EASY, EASY, // 10 (64)
    // set 8 - แม้ง ๆ  
    NORMAL, EASY, EASY, NORMAL, NORMAL, EASY, NORMAL, EASY, NORMAL, EASY, // 10 (74)
    // set 9 - ส่วนมากเป็นเรื่องที่ทำไม่ได้
    NORMAL, EASY, EASY, EASY, EASY, HARD, EASY, EASY, // 8 (82)
    // set 10 
    NORMAL, EASY, NORMAL, NORMAL, EASY, NORMAL, NORMAL, NORMAL, NORMAL // 9 (91)
  ];

  fs.readFile('./data/questions_final.json', (err, data) => {
    const result = JSON.parse(data);
    const kwTitle = {};
    const tags = {};
    const bodyContent = {};
    const bodyCode = {};
    const bodyFull = {};
    const scope = {};
    const finalScope = {};
    const finalLinearScope = {};

    result.map((q, index) => {
      visitNode = {};

      console.log(" ---------------------------------");
      console.log("|       Question No. " + (index + 1) + "           |");
      console.log(" ---------------------------------");

      // title
      console.log('Title: ',q.Title);
      const oldString = q.Title.split(' ');
      kwTitle[q.Id] = stem(sw.removeStopwords(uniqueList(removeSpecialChar(oldString)), stopWordEnglish));
      scope[q.Id] = calScore(kwTitle[q.Id], false);
      console.log(":: Title Score = " + scope[q.Id]);

      // tags
      tags[q.Id] = stem(uniqueList(removeSpecialChar(extractTags(q.Tags))));
      scope[q.Id] += calScore(tags[q.Id], false);
      console.log(":: Tags Score = " + scope[q.Id]);

      // body 
      const tempBody = retriveBodyText(q.Body);
      bodyContent[q.Id] = stem(sw.removeStopwords(uniqueList(tempBody.content), stopWordEnglish));
      bodyCode[q.Id] = (sw.removeStopwords(uniqueList(tempBody.code), stopWordEnglish));   
      scope[q.Id] += calScore(bodyContent[q.Id], false) * 0.5;
      console.log(":: bodyContent Score = " + scope[q.Id]);
      scope[q.Id] += calScore(bodyCode[q.Id], true) * 0.5;
      console.log(":: bodyCode Score = " + scope[q.Id]);

      // body full
      bodyFull[q.Id] = q.Body;

      // expotiential
      // finalScope[q.Id] = calScopeScore(scope[q.Id]);

      finalLinearScope[q.Id] = calScopeLinearScore(scope[q.Id]);

      console.log(visitNode);
    });

    res.render('poc', {
      title: 'PoC',
      rows: result,
      kwTitle,
      tags,
      bodyContent,
      bodyCode,
      scope,
      //finalScope,
      finalLinearScope,
      difficuty,
      bodyFull,
    });
  });
};

const extractTags = (tags) => {
  var temp = tags.slice(1, -1);
  return temp.split('><');
}

const removeSpecialChar = (words) => {
  return words.map(w => {
    return w.toString().replace(/[`~@?;:,"“”{}\(\);,']|^(\d+)$/gi, '').toLowerCase();
  })
}

const stem = (words) => {
  return words.map(w => {
    let result = w;

    if (!result.match(/[\.\-]|(js)$/gi))
      result = natural.PorterStemmer.stem(result);

    return result;
  })
}

const removeDigi = (words) => {
  return words.map(w => {
    return w.toString().replace(/^(\d+)$/gi, '').toLowerCase();
  })
}

const uniqueList = (words) => {
  const result = _.without(words, 'javascript')
  return _.uniq(result);
}

const calScore = (words, isCode) => {
  var sum = 0;
  words.map(w => {
    // already visited
    if (visitNode[w])
      return 0;

    // for debug
    if (tree[w]) {
      // check first time visited node 
      if ((tree[w].isCode && isCode) || !tree[w].isCode) {
        visitNode[tree[w].word] = true;
        //console.log(tree[w].word+" | isCode = "+tree[w].isCode);
      }

      console.log("WORD = " + tree[w].word);
    }

    sum += tree[w] ? recusiveCal(tree[w], isCode) : 0;
  });

  return sum;
}

const recusiveCal = (word, isCode) => {
  // check isCode
  if (word.isCode && !isCode)
    return 0;

  if (word.parent) {
    console.log(">> word = " + word.word + " , parent = " + word.parent);
    return word.value + recusiveCal(tree[word.parent], isCode);
  }

  return word.value;
}

// function calScopeScore(score) {
//   return 1 - ( 1 / Math.pow(2.71828, score) );
// }

function calScopeLinearScore(score) {
  return 1 - (1 / Math.log(score));
}

function retriveBodyText(html) {
  //const html = "<p>I'm having problems getting some setup code executed when my extension is installed. I'm using chrome.runtime.onInstalled as suggested by Chrome Developers' page, but it is not firing. It seems that the issue is related with the use of Require.JS. This is my code:</p>\n\n<pre><code>requirejs.config({...});// i'll not reproduce the whole config here for brevity\n\n// Define the Global Object that will hold the extension functionality\nvar EXT = EXT || {};\n\n// Start the main app logic.\n\nrequirejs(['chrome.storage', 'chrome.settings', 'chrome.tabs'],\nfunction (chromeStorage, chromeSettings, chromeTabs) {\n    'use strict';\n\n    var getLocalRepos;\n\n    /**\n     * Executes the callback with an array of repositories as the parameter.\n     * @param {function} callback\n     */\n    getLocalRepos = function (callback) {\n        'use strict';\n\n        chromeStorage.get('localRepos', callback);\n    };\n\n    // Take care of the extension lifecycle.\n    chrome.runtime.onInstalled.addListener(function (details) {\n        \"use strict\";\n\n        // Create dummy data to populate the local storage for testing purposes.\n        var dummyData = [\n            {\n                name: 'repo1',\n                description: 'description1',\n                username: 'reydel',\n                age: 'theAge'\n            },\n            {\n                name: 'repo2',\n                description: 'description2',\n                username: 'reydel',\n                age: 'theAge'\n            }\n        ];\n\n        switch (details.reason) {\n            case 'install':\n                chromeStorage.set({ localRepos: dummyData }, function () {\n                    // Do nothing\n                });\n                break;\n        }\n    });\n\n    // Bind all functions to an object in the Global Space to make them accessible from the outside scripts\n    // referencing the BackgroundPage object\n    window.EXT.getLocalRepos = getLocalRepos;\n});\n</code></pre>\n\n<p>I have used the code inside the listener's callback in the console and it works, it's just that the event is not being triggered.</p>\n\n<p>Any ideas on how to solve this? Someone have done it before?</p>\n";
  //html = html.replace(/\\(?:n|r)/gi, ' ');
  //const re = /(?:<pre>|<\/pre>)/gi;
  const re = /(?:<pre\s?(?:.)*?>|<\/pre\s?(?:.)*?>)/gi;
  const paragraphs = html.split(re);

  let content = "",
    code = "";

  //console.log(paragraphs);    
  paragraphs.map(w => {
    if (w.substring(0, 6) === "<code>")
      code += "" + w;
    else
      content += "" + w;
  });

  // content remove tag 
  content = content.replace(/<(?:.|\n)*?>/gm, '');
  // content replace Spectial character to space bar
  content = content.replace(/[`~@?;:,"“”{}();,\.']/gi, ' ');
  // spit 
  content = removeDigi(content.toLowerCase().split(/\s+/));
 
  // convert entity to tag
  code = _.unescape(code);
  // remove stop word for programming
  // console.log(code);
  code = removeDigi(code.replace(/([@:`\'\"{}\(\)\[\];,'\.<>\/?])/gm, ' ').split(/\s+/));

  return { 
    content,
    code
  }
}

const _getArrayIndex = (arr, start, end) => {
  let result = [];
  while (start <= end) {
    result.push(arr[start]);
    start++;
  }
  return result.join(' ');
}

const arrMulti3 = (arr) => {
  const max = arr.length;
  const result = [];

  for (let i = 1; i <= 3; i++) {
    let start = 0;
    let end;
    while (start < max) {
      end = start + (i - 1);
      if (end < max) {
        result.push(_getArrayIndex(arr, start, end));
      }
      start++;
    }
  }

  return result;
}

/*
    const words = ["Javascript","Language","Grammar","Whitespace ","Names ","Numbers ","Strings ","Statements ","Expressions ","Literals ","Variables","Keywords and reserved words","Conditional  ","if","else","do while","while do ","loops","Comments","Operation ","++","--","+-","Functions ","Function Objects ","Function Literal ","Invocation ","Arguments ","Return ","Exceptions ","Augmenting Types ","Recursion ","Scope ","Closure ","Callbacks ","Module ","Cascade ","Curry ","Memoization ","Higher-Order Functions","bind","call","Data Structures","Objects ","Object Literals ","Retrieval ","Update ","Reference ","Prototype ","Reflection ","Enumeration ","Delete ","Global Abatement ","Arrays ","Array Literals ","Length ","Delete ","Enumeration ","Confusion ","Methods ","Dimensions ","Regular Expressions","characters ","pattern ","Grouping subexpressions ","Matches  ","groups ","date type ","Word ","string boundaries ","Backtracking ","search  ","lastIndex ","International ","Inheritance ","Pseudoclassical  ","Object Specifiers  ","Prototypal  ","Functional  ","Parts ","Modules","ES6 ","Variables","Error Handling ","Strict mode ","Testing ","Debugging ","Error propagation ","Exceptions ","Selective catching ","Assertions ","Browser","DOM","Document structure ","Trees ","standard ","Finding elements ","Changing the document ","Creating nodes ","Attributes ","Layout ","Styling ","Cascading styles ","Query selectors ","Positioning and animating ","Handling Events","Event handlers ","Events and DOM nodes ","Event objects ","Propagation ","Default actions ","Key events ","Mouse clicks ","Mouse motion ","Scroll events ","Focus events ","Load event ","Script execution timeline ","Setting timers ","Debouncing","Canvas","SVG","Filling and stroking ","Paths ","Curves ","Text ","Images ","Transformation ","Storing and clearing transformations","HTTP","Promises"];

    words.map(w => {
      console.log('"'+w.toLowerCase()+'" : {"word":"'+w.toLowerCase()+'","value": 1,"parent":null},');
    })*/

/* Save to database */
// exports.index = (req, res) => {
// 	var connection1 = new sql.Connection(config, function(err) {	
//     const query = `
//       select top 10 * 
//       from Posts
//       where Tags like \'%javascript%\'
//       and YEAR(CreationDate) > 2013
//       ORDER BY Score DESC
//     `;

//     var request = new sql.Request(connection1);
//     request.query(query, function(err, recordset) {
//       fs.writeFile('./data/questions_10_high_score.json', JSON.stringify(recordset)); 
//       console.log("Write Completed.");
// 			res.render('poc', {
// 			  title: 'PoC',
// 			  rows: recordset
// 			});
// 		});	
//   });
// };