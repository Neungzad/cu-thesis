import chalk from 'chalk'
import _ from 'underscore'
import axios from 'axios'
import appConfig from '../config/appConfig'
// import resQuestions from '../data/api_so_questions.mini.json'
import { getDifficultyLevel, connectDB } from './poc'
var ta = require('../lib/timeAgo.js')()

/**
 * GET /
 * Home page.
 */
export const index = async (req, res) => {
  const pagesize = 100
  const showPerPage = req.query.filter === 'hard' ? 15 : 30
  let page = 1
  const questions = []
  let sort = req.query.tab ? req.query.tab : 'activity'

  console.log(chalk.yellow(`req.query.tab = ${req.query.tab}`))
  console.log(chalk.yellow(`req.query.filter = ${req.query.filter}`))

  try {
    const request = await connectDB()
    let response

    // filter easy, normal or hard
    if (req.query.filter) {
      let isLoopQuery = true

      while (isLoopQuery) {
        console.log(chalk.red('Query page = ', page))
        response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=${sort}&page=${page}&pagesize=${pagesize}&tagged=javascript&site=stackoverflow&filter=!4*Zo7ZBUu1hHnaNDR`)
        const resQuestions = response.data.items

        // check each question from api
        let i = 1
        for (let question of resQuestions) {
          let q = await insertAttrQuestion(question, request)
          console.log(chalk.red('q [' + i + '] ' + q.question_id + ' = ' + q.difLv))

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

          i++
          console.log(chalk.green(`Difficulty Score = ${q.difScore}`))
        }

        // no more question
        // loop 5 round if not found a question to exit loop
        if (!response.data.has_more || page === 5)
          isLoopQuery = false

        console.log(chalk.bgRed.white('has_more = ', response.data.has_more))
        console.log(chalk.red('end while with page :', page))
        console.log(chalk.cyan('questions.length :', questions.length))

        page = page + 1
      }
    } else {
      // no filter show question
      response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=${sort}&page=${page}&pagesize=${pagesize}&tagged=javascript&site=stackoverflow&filter=!4*Zo7ZBUu1hHnaNDR`)
      const resQuestions = response.data.items

      for (let question of resQuestions) {
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
    form: {
      tagged: 'javascript;'
    }
  })
}

/**
 * GET /
 * Search page.
*/

export const search = async (req, res) => {
  logObject(req.query)

  const pagesize = 100
  const showPerPage = req.query.filter === 'hard' ? 15 : 30
  let page = 1
  const questions = []
  const sort = req.query.sort ? req.query.sort : 'relevance'
  let paramsConfig
  let query
  const params = {
    sort: sort,
    q: req.query.q,
    filter: req.query.filter,
    order: req.query.order,
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

  try {
    let paramsApi = setParamUri(params, true)
    console.log(chalk.green('paramsApi = ', paramsApi))

    paramsConfig = setParamUri(params)
    console.log(chalk.cyan('paramsConfig = ', paramsConfig))

    const request = await connectDB()
    let response

    // filter easy, normal or hard
    if (req.query.filter) {
      let isLoopQuery = true

      while (isLoopQuery) {
        console.log(chalk.red('Query page = ', page))

        query = `${appConfig.API_URL}/2.2/search/advanced?sort=${sort}&page=${page}&pagesize=${pagesize}${paramsApi}&site=stackoverflow&filter=!4)sstRuR)-52kZhwJ`
        response = await axios.get(query)
        const resQuestions = response.data.items

        // check each question from api
        let i = 1
        for (let question of resQuestions) {
          let q = await insertAttrQuestion(question, request)
          console.log(chalk.red('q [' + i + '] ' + q.question_id + ' = ' + q.difLv))

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

          i++
          console.log(chalk.green(`Difficulty Score = ${q.difScore}`))
        }

        // no more question
        // loop 5 round if not found a question to exit loop
        if (!response.data.has_more || page === 5)
          isLoopQuery = false

        console.log(chalk.bgRed.white('has_more = ', response.data.has_more))
        console.log(chalk.red('end while with page :', page))
        console.log(chalk.cyan('questions.length :', questions.length))

        page = page + 1
      }
    } else {
      // no filter difficulty level
      query = `${appConfig.API_URL}/2.2/search/advanced?sort=${sort}&page=${page}&pagesize=${pagesize}${paramsApi}&site=stackoverflow&filter=!4)sstRuR)-52kZhwJ`
      response = await axios.get(query)

      const resQuestions = response.data.items

      for (let question of resQuestions) {
        let q = await insertAttrQuestion(question, request)
        questions.push(q)

        if (questions.length === showPerPage)
          break

        console.log(chalk.green(`Difficulty Score = ${q.difScore}`))
      }
    }

    console.log(chalk.yellow(`quota_remaining = ${response.data.quota_remaining}`))
  } catch (e) {
    console.log(chalk.red(e))
  }

  res.render('search', {
    title: 'Stack Overflow Level',
    paramsConfig: paramsConfig,
    form: params,
    questions: questions,
    noResult: questions.length === 0,
    query: query
  })
}

const nFormatter = (num, digits) => {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/

  for (let i = 0; i < si.length; i++)
    if (num >= si[i].value)
      return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol

  return num.toFixed(digits).replace(rx, '$1')
}

const logObject = (object) => {
  return Object.keys(object).map(key => console.log(chalk.yellow(`${key} = ${object[key]}`)))
}

const setParamUri = (params, useAPI = false) => {
  return Object.keys(params).map(key => {
    let val = params[key]

    // skip
    if (key === 'sort')
      return ''

    if (useAPI) {
      if (key === 'filter')
        return ''

      // date format
      if (/fromdate|todate/g.test(key))
        val = dateToTimestamp(params[key])
    }

    return params[key] ? `&${key}=${val}` : ''
  }).reduce((result, param) => {
    return result + param
  }, '')
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
  result.view_count = nFormatter(q.view_count, 1)
  result.answer_count = nFormatter(q.answer_count, 1)
  result.score = nFormatter(q.score, 1)

  return Promise.resolve(result)
}
