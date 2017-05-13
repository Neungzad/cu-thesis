import chalk from 'chalk'
import _ from 'underscore'
// import axios from 'axios'
// import appConfig from '../config/appConfig'
import resQuestions from '../data/api_so_questions.mini.json'
import { getDifficultyLevel, connectDB } from './poc'

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
    const response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=${sort}&pagesize=3&tagged=javascript&site=stackoverflow&filter=!)s1i5tEVpAsjaocok1rN`)
    const resQuestions = response.data.items
    */

    for (let question of resQuestions.items) {
      let q = question
      q.title = decodeHtmlEntity(_.unescape(q.title))
      q.difScore = await getDifficultyLevel(question, request)
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
