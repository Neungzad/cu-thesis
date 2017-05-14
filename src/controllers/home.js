import chalk from 'chalk'
import _ from 'underscore'
// import axios from 'axios'
// import appConfig from '../config/appConfig'
import resQuestions from '../data/api_so_questions.mini.json'
import { getDifficultyLevel, connectDB } from './poc'
var ta = require('../lib/timeAgo.js')()

/**
 * GET /
 * Home page.
 */
export const index = async (req, res) => {
  const questions = []
  let sort = 'activity'

  console.log(chalk.yellow(`req.query.tab = ${req.query.tab}`))

  try {
    const request = await connectDB()

    // Sort by tab
    if (req.query.tab)
      sort = req.query.tab

    /*
    const response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=${sort}&pagesize=3&tagged=javascript&site=stackoverflow&filter=!4*Zo7ZBUu1hHnaNDR`)
    const resQuestions = response.data.items
    */

    for (let question of resQuestions.items) {
      let q = question
      q.title = decodeHtmlEntity(_.unescape(q.title))
      q.body_markdown = formatBodyMarkdown(q.body_markdown)
      q.difScore = await getDifficultyLevel(question, request)
      q.difLv = convetDiffLv(q.difScore)
      q.timeAgo = ta.ago(new Date(q.last_activity_date * 1000))
      questions.push(q)

      console.log(chalk.green(`Difficulty Score = ${q.difScore}`))
    }
  } catch (e) {
    console.log(e)
  }

  res.render('home', {
    title: 'Stack Overflow Level',
    tab: sort,
    questions: questions
  })
}

const decodeHtmlEntity = function (str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec)
  })
}

const formatBodyMarkdown = (body) => {
  let string = decodeHtmlEntity(_.unescape(body))

  if (string.length <= 200)
    return string

  return string.substr(0, 200) + '...'
}

const convetDiffLv = (score) => {
  if (score > 0.6)
    return 'HARD'
  else if (score > 0.4)
    return 'NORMAL'
  else
    return 'EASY'
}
