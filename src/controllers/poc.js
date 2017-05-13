/*eslint-disable*/

import { featureFocus, ratioSuccessAnswered, experience, views, viewsPrd, existingValue, existingValuePrd } from './features'

const fs = require('fs')
const sql = require('mssql')
const stopWordEnglish = require('../stop-word-english').english
const sw = require('stopword')
const _ = require('underscore')
const tree = require('../data/tree.json')
var natural = require('natural')
const chalk = require('chalk')

// Difficulty level
const EASY = 'Easy'
const NORMAL = 'Normal'
const HARD = 'Hard'

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
}

var visitNode = {}

export const getDifficultyLevel = async (question, request) => {
  console.log(chalk.magenta(' ---------------------------------'))
  console.log(chalk.magenta('|      Question No. ' + (question.question_id) + '      |'))
  console.log(chalk.magenta(' ---------------------------------'))

  const questionScope = getScoreQuestionScope(question)
  const featureScore = await getFeatureScore(question, request)
  let finalScore = harmonicMean([questionScope, featureScore])

  return finalScore
}

const getScoreQuestionScope = (q) => {
  let qs = 0

  // title
  console.log('Title: ', q.title)

  console.log(chalk.bgMagenta('Question Scope'))
  const oldString = q.title.split(' ')
  let kwTitle = stem(sw.removeStopwords(arrMulti3(uniqueList(removeSpecialChar(oldString)), stopWordEnglish)))
  qs = calScore(kwTitle, false)
  console.log(chalk.blue(":: Title Score = " + qs))

  // tags
  let tags = stem(uniqueList(removeSpecialChar(q.tags)))
  qs += calScore(tags, false)
  console.log(chalk.blue(":: Tags Score = " + qs))

  // body
  const tempBody = retriveBodyText(q.body)
  const bodyContent = stem(sw.removeStopwords(arrMulti3(uniqueList(tempBody.content), stopWordEnglish)))
  const bodyCode = (sw.removeStopwords(uniqueList(tempBody.code), stopWordEnglish))

  qs += calScore(bodyContent, false) * 0.2
  console.log(chalk.blue(":: bodyContent Score = " + qs))

  qs += calScore(bodyCode, true) * 0.2
  console.log(chalk.blue(":: bodyCode Score = " + qs))

  // Question Scope Score
  const questionScope = calScopeLinearScore(qs)
  console.log(chalk.cyan('Question Scope = ', questionScope))

  return questionScope
}

const getFeatureScore = async (q, request) => {
  console.log(chalk.bgMagenta('Features'))
  const focusScore = await featureFocus(request, q)
  console.log(chalk.blue(':: FocusScore = ', focusScore))

  const ratioSuccessAnsweredScore = await ratioSuccessAnswered(request, q)
  console.log(chalk.blue(':: RatioSuccessAnsweredScore = ', ratioSuccessAnsweredScore))

  let experienceScore = await experience(request, q)
  console.log(chalk.blue(':: ExperienceScore = ', experienceScore))

  let viewsScore = await viewsPrd(request, q)
  console.log(chalk.blue(':: ViewsScore = ', viewsScore))

  let existingValueScore = await existingValuePrd(request, q)
  console.log(chalk.blue(':: ExistingValueScore = ', existingValueScore))

  const summaryFeatureScore = arithmeticMean([
    focusScore,
    ratioSuccessAnsweredScore,
    experienceScore,
    viewsScore,
    existingValueScore
  ])
  console.log(chalk.cyan('SummaryFeatureScore = ', summaryFeatureScore))

  return Promise.resolve(summaryFeatureScore)
}

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  const pm = _index()
  pm.then(obj => {
    res.render('poc', obj)
  })
}

async function _index() {
  /* const difficuty = [
     // set 1
     NORMAL, NORMAL, EASY, EASY, EASY, NORMAL, NORMAL, NORMAL, EASY, NORMAL,  // 10 
     // set 2   
     EASY, NORMAL, NORMAL, NORMAL, EASY, NORMAL, NORMAL, NORMAL, EASY, HARD, // 10 (19)
     // set 3 
     NORMAL, EASY, NORMAL, NORMAL, EASY, NORMAL, NORMAL, EASY, HARD,  // 9 (28)
     // set 4 
     NORMAL, NORMAL, NORMAL, NORMAL, NORMAL, EASY, NORMAL, EASY, EASY, EASY, // 10 (38)
     // set 5 
     NORMAL, HARD, EASY, NORMAL, NORMAL, NORMAL, HARD, HARD, EASY, // 9 (44)
     // set 6 
     NORMAL, EASY, EASY, NORMAL, HARD, NORMAL, HARD, EASY, EASY, HARD, // 10 (54)
     // set 7 - แม้ง ๆ  
     NORMAL, EASY, EASY, NORMAL, NORMAL, HARD, EASY, NORMAL, EASY, NORMAL, // 10 (64)
     // set 8 - แม้ง ๆ  
     NORMAL, EASY, EASY, NORMAL, NORMAL, EASY, HARD, EASY, NORMAL, EASY, // 10 (74)
     // set 9 - ส่วนมากเป็นเรื่องที่ทำไม่ได้
     NORMAL, EASY, EASY, EASY, EASY, NORMAL, EASY, EASY, HARD, // 9 (82)
     // set 10 
     NORMAL, EASY, NORMAL, EASY, EASY, NORMAL, NORMAL, NORMAL, NORMAL, HARD // 10 (91)     
   ]*/

  const difficuty = [
    // set 10 
    NORMAL, EASY, NORMAL, EASY, EASY, NORMAL, NORMAL, NORMAL, NORMAL, HARD // 10 (91)   
  ]


  const request = await connectDB()
  const data = await readQuestion()
  const result = JSON.parse(data)
  const kwTitle = {}
  const tags = {}
  const bodyContent = {}
  const bodyCode = {}
  const bodyFull = {}
  const scope = {}
  const finalLinearScope = {}

  const focusScore = {}
  const ratioSuccessAnsweredScore = {}
  const experienceScore = {}
  const viewsScore = {}
  const existingValueScore = {}
  const summaryFeatureScore = {}

  const finalScore = {}
  let index = 0

  //debug
  const individualScore = {}

  for (let q of result) {
    visitNode = {}
    let tempScore = 0
    index++
    individualScore[q.Id] = {}

    console.log(" ---------------------------------")
    console.log("|       Question No. " + (index) + "           |")
    console.log(" ---------------------------------")

    // title
    console.log('Title: ', q.Title)
    const oldString = q.Title.split(' ')
    kwTitle[q.Id] = stem(sw.removeStopwords(arrMulti3(uniqueList(removeSpecialChar(oldString)), stopWordEnglish)))
    scope[q.Id] = calScore(kwTitle[q.Id], false)
    console.log(":: Title Score = " + scope[q.Id])
    individualScore[q.Id].title = scope[q.Id]

    // tags
    tags[q.Id] = stem(uniqueList(removeSpecialChar(extractTags(q.Tags))))
    tempScore = calScore(tags[q.Id], false)
    scope[q.Id] += tempScore
    console.log(":: Tags Score = " + scope[q.Id])
    individualScore[q.Id].tag = tempScore

    // body 
    const tempBody = retriveBodyText(q.Body)
    bodyContent[q.Id] = stem(sw.removeStopwords(arrMulti3(uniqueList(tempBody.content), stopWordEnglish)))
    bodyCode[q.Id] = (sw.removeStopwords(uniqueList(tempBody.code), stopWordEnglish))

    tempScore = calScore(bodyContent[q.Id], false) * 0.2
    scope[q.Id] += tempScore
    console.log(":: bodyContent Score = " + scope[q.Id])
    individualScore[q.Id].content = tempScore

    tempScore = calScore(bodyCode[q.Id], true) * 0.2
    scope[q.Id] += tempScore
    console.log(":: bodyCode Score = " + scope[q.Id])
    individualScore[q.Id].code = tempScore

    // body full
    bodyFull[q.Id] = q.Body

    // Question Scope Score
    finalLinearScope[q.Id] = calScopeLinearScore(scope[q.Id])

    console.log(visitNode)

    // console.log(':: Features')
    focusScore[q.Id] = await featureFocus(request, q)
    // console.log('focusScore = ', focusScore[q.Id])

    ratioSuccessAnsweredScore[q.Id] = await ratioSuccessAnswered(request, q)
    // console.log('ratioSuccessAnsweredScore = ', ratioSuccessAnsweredScore[q.Id])

    experienceScore[q.Id] = await experience(request, q)
    // console.log('experienceScore = ', experienceScore[q.Id])

    viewsScore[q.Id] = await views(request, q)
    // console.log('viewsScore = ', viewsScore[q.Id])

    existingValueScore[q.Id] = await existingValue(request, q)
    // console.log('existingValueScore = ', existingValueScore[q.Id])

    summaryFeatureScore[q.Id] = arithmeticMean([
      focusScore[q.Id],
      ratioSuccessAnsweredScore[q.Id],
      experienceScore[q.Id],
      viewsScore[q.Id],
      existingValueScore[q.Id]
    ])
    console.log('summaryFeatureScore = ', summaryFeatureScore[q.Id])

    finalScore[q.Id] = harmonicMean([finalLinearScope[q.Id], summaryFeatureScore[q.Id]])
  }

  const objectResponse = {
    title: 'PoC',
    rows: result,
    kwTitle,
    tags,
    bodyContent,
    bodyCode,
    scope,
    finalLinearScope,
    difficuty,
    bodyFull,
    focusScore,
    ratioSuccessAnsweredScore,
    experienceScore,
    viewsScore,
    existingValueScore,
    summaryFeatureScore,
    finalScore,
    individualScore
  }

  return Promise.resolve(objectResponse)
}

export const connectDB = () => {
  return new Promise(resolve => {
    const connectionDB = new sql.Connection(config, function (_err) {
      resolve(new sql.Request(connectionDB))
    })
  })
}

const readQuestion = () => {
  return new Promise(resolve => {
    fs.readFile(__dirname + '/../data/prd/set-10.json', (err, data) => {
      // fs.readFile(__dirname + '/../data/questions_2_last_2015.json', (err, data) => {
      resolve(data)
    })
  })
}

const extractTags = (tags) => {
  var temp = tags.slice(1, -1)
  return temp.split('><')
}

const removeSpecialChar = (words) => {
  return words.map(w => {
    return w.toString().replace(/[`~@?:,"“”{}\(\),']|^(\d+)$/gi, '').toLowerCase()
  })
}

const stem = (words) => {
  return words.map(w => {
    let result = w

    if (!result.match(/[\.\-]|(js)$/gi))
      result = natural.PorterStemmer.stem(result)

    return result
  })
}

const removeDigi = (words) => {
  return words.map(w => {
    return w.toString().replace(/^(\d+)$/gi, '').toLowerCase()
  })
}

const uniqueList = (words) => {
  const result = _.without(words, 'javascript')
  return _.uniq(result)
}

const calScore = (words, isCode) => {
  var sum = 0
  words.map(w => {
    // already visited
    if (visitNode[w])
      return 0

    // for debug
    if (tree[w])
      // check first time visited node
      if ((tree[w].isCode && isCode) || !tree[w].isCode)
        // visitNode[tree[w].word] = true
        console.log(tree[w].word + ' | isCode = ' + tree[w].isCode)
      // console.log("WORD = " + tree[w].word)

    sum += tree[w] ? recusiveCal(tree[w], isCode) : 0
  })

  return sum
}

const recusiveCal = (word, isCode) => {
  // check isCode
  if (word.isCode && !isCode)
    return 0

  if (word.parent) {
    // console.log(">> word = " + word.word + " , parent = " + word.parent)

    // if visited not sum value in this node
    let val = word.value
    if (visitNode[word.word])
      val = 0
    else
      visitNode[word.word] = true

    // console.log(chalk.gray('--> ' + word.word + ' = ' + val))

    return val + recusiveCal(tree[word.parent], isCode)
  }

  // console.log(chalk.gray('--> (L) ' + word.word + ' = ' + word.value))  

  // root node is "javascript"
  if (visitNode[word.word])
    return 0
  else
    visitNode[word.word] = true

  return word.value
}

function calScopeLinearScore(score) {
  if (score < 3)
    score = 3

  return score && 1 - (1 / Math.log(score))
}

function retriveBodyText(html) {
  const re = /<code>(.|\n)*?<\/code>/igm
  let code = html.match(re)

  if (code)
    code = code.join(' ').replace(/<(?:.|\n)*?>/gm, '')

  let content = html.replace(re, '')

  // content remove tag
  content = content.replace(/<(?:.|\n)*?>/gm, '')
  // content replace Spectial character to space bar
  content = content.replace(/[`~@?:,"“”{}(),\.']/gi, ' ')
  // spit
  content = removeDigi(content.toLowerCase().split(/\s+/))

  // convert entity to tag
  code = _.unescape(code)

  // console.log('---before--')
  // console.log(code)

  // remove html and php tag and content
  code = _clearOtherLangTag(code)

  // console.log('---after--')
  // console.log(code)

  // remove stop word for programming
  code = removeDigi(code.replace(/([@:`\'\"{}\(\)\[\],'\.<>\/?])/gm, ' ').split(/\s+/))

  return {
    content,
    code
  }
}

const _clearOtherLangTag = (code) => {
  // remove html tag
  let temp = code.replace(/(<(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr)(?:.|\n)*?>(.|\n)*?<\/(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr)>)|<\/(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr)>/gm, ' ')

  // remove php tag
  temp = temp.replace(/<\?php(.|\n)*?\?>/gm, ' ')

  return temp
}

const _getArrayIndex = (arr, start, end) => {
  let result = []
  while (start <= end) {
    result.push(arr[start])
    start++
  }
  return result.join(' ')
}

const arrMulti3 = (arr) => {
  const max = arr.length
  const result = []

  for (let i = 1; i <= 3; i++) {
    let start = 0
    let end
    while (start < max) {
      end = start + (i - 1)
      if (end < max)
        result.push(_getArrayIndex(arr, start, end))

      start++
    }
  }

  return result
}

const arithmeticMean = (dataSet) => {
  const numerator = dataSet.length

  let sum = dataSet.reduce((a, b) => a + b)

  return sum / numerator
}

const harmonicMean = (dataSet) => {
  const numerator = dataSet.length

  var denominator = dataSet.map(function (num) {
    return 1 / num
  }).reduce(function (a, b) {
    return a + b
  })

  return numerator / denominator
}

/*
const words = ["Javascript","Language","Grammar","Whitespace ","Names ","Numbers ","Strings ","Statements ","Expressions ","Literals ","Variables","Keywords and reserved words","Conditional  ","if","else","do while","while do ","loops","Comments","Operation ","++","--","+-","Functions ","Function Objects ","Function Literal ","Invocation ","Arguments ","Return ","Exceptions ","Augmenting Types ","Recursion ","Scope ","Closure ","Callbacks ","Module ","Cascade ","Curry ","Memoization ","Higher-Order Functions","bind","call","Data Structures","Objects ","Object Literals ","Retrieval ","Update ","Reference ","Prototype ","Reflection ","Enumeration ","Delete ","Global Abatement ","Arrays ","Array Literals ","Length ","Delete ","Enumeration ","Confusion ","Methods ","Dimensions ","Regular Expressions","characters ","pattern ","Grouping subexpressions ","Matches  ","groups ","date type ","Word ","string boundaries ","Backtracking ","search  ","lastIndex ","International ","Inheritance ","Pseudoclassical  ","Object Specifiers  ","Prototypal  ","Functional  ","Parts ","Modules","ES6 ","Variables","Error Handling ","Strict mode ","Testing ","Debugging ","Error propagation ","Exceptions ","Selective catching ","Assertions ","Browser","DOM","Document structure ","Trees ","standard ","Finding elements ","Changing the document ","Creating nodes ","Attributes ","Layout ","Styling ","Cascading styles ","Query selectors ","Positioning and animating ","Handling Events","Event handlers ","Events and DOM nodes ","Event objects ","Propagation ","Default actions ","Key events ","Mouse clicks ","Mouse motion ","Scroll events ","Focus events ","Load event ","Script execution timeline ","Setting timers ","Debouncing","Canvas","SVG","Filling and stroking ","Paths ","Curves ","Text ","Images ","Transformation ","Storing and clearing transformations","HTTP","Promises"]

words.map(w => {
  console.log('"'+w.toLowerCase()+'" : {"word":"'+w.toLowerCase()+'","value": 1,"parent":null},')
})
*/

/**
 * GET /
 * Save page.
 */
// exports.saveFile = (req, res) => {
//   var connection1 = new sql.Connection(config, function (err) {
//     const query = `
//       SELECT *
//       FROM [StackOverflow].[dbo].[Posts]
//       WHERE Id IN (22111619)
//     `

//     var request = new sql.Request(connection1)
//     request.query(query, function (err, recordset) {
//       fs.writeFile('./temp.json', JSON.stringify(recordset))
//       console.log("Write Completed.")
//        /*res.render('poc', {
//        title: 'PoC',
//        rows: recordset
//       })*/
//       res.send(JSON.stringify(recordset))
//     })
//   })
// }
