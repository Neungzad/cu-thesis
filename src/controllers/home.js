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
  const pagesize = 100
  const showPerPage = 5
  let page = 1
  const questions = []
  let sort = 'activity'

  console.log(chalk.yellow(`req.query.tab = ${req.query.tab}`))
  console.log(chalk.yellow(`req.query.filter = ${req.query.filter}`))

  try {
    const request = await connectDB()
    let response

    // Sort by tab
    if (req.query.tab)
      sort = req.query.tab

    // filter easy, normal or hard
    if (req.query.filter) {
      let isLoopQuery = true

      while (isLoopQuery) {
        // console.log(chalk.red('Query page = ', page))
        // response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=${sort}&page=${page}&pagesize=${pagesize}&tagged=javascript&site=stackoverflow&filter=!4*Zo7ZBUu1hHnaNDR`)
        // const resQuestions = response.data.items

        // no data
        if (!resQuestions.length) {
          isLoopQuery = false
          break
        }

        // check each question from api
        for (let question of resQuestions.items) {
          let q = await insertAttrQuestion(question, request)
          console.log(chalk.red('q ' + q.question_id + ' = ' + q.difLv))

          // match level
          if (req.query.filter.toLowerCase() === q.difLv)
            // not duplicate
            if (_.findIndex(questions, {question_id: q.question_id}) === -1) {
              questions.push(q)
              if (questions.length === showPerPage) {
                isLoopQuery = false
                break
              }
            }

          console.log(chalk.green(`Difficulty Score = ${q.difScore}`))
        }

        console.log(chalk.red('end while with page :', page))
        page = page + 1
      }
    } else {
      // no filter show question
      // response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=${sort}&page=${page}&pagesize=${pagesize}&tagged=javascript&site=stackoverflow&filter=!4*Zo7ZBUu1hHnaNDR`)
      // const resQuestions = response.data.items

      for (let question of resQuestions.items) {
        let q = await insertAttrQuestion(question, request)
        questions.push(q)

        if (questions.length === showPerPage)
          break

        console.log(chalk.green(`Difficulty Score = ${q.difScore}`))
      }
    }

    console.log(chalk.yellow(`quota_remaining = ${response.data.quota_remaining}`))
  } catch (e) {
    console.log(e)
  }

  res.render('home', {
    title: 'Stack Overflow Level',
    tab: sort,
    filter: req.query.filter,
    questions: questions,
    form: {}
  })
}

/**
 * GET /
 * Search page.
*/

export const search = async (req, res) => {
  let query = '/2.2/search/advanced?site=stackoverflow'

  console.log(dateToTimestamp(req.query.fromdate))

  res.render('search', {
    title: 'Stack Overflow Level',
    query: query,
    form: {
      q: req.query.q,
      order: req.query.order[0],
      title: req.query.title,
      user: req.query.user,
      fromdate: req.query.fromdate,
      todate: req.query.todate,
      tagged: req.query.tagged,
      nottagged: req.query.nottagged,
      body: req.query.body,
      views: req.query.views,
      accepted: req.query.accepted,
      answers: req.query.answers
    }
  })
}

const dateToTimestamp = (date) => {
  return new Date(date).getTime() / 1000
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
    return 'hard'
  else if (score > 0.4)
    return 'normal'
  else
    return 'easy'
}

const insertAttrQuestion = async (q, request) => {
  let result = q
  result.title = decodeHtmlEntity(_.unescape(q.title))
  result.body_markdown = formatBodyMarkdown(q.body_markdown)
  result.difScore = await getDifficultyLevel(q, request)
  result.difLv = convetDiffLv(q.difScore)
  result.timeAgo = ta.ago(new Date(q.last_activity_date * 1000))

  return Promise.resolve(result)
}
