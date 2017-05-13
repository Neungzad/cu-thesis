import chalk from 'chalk'
// import axios from 'axios'
// import appConfig from '../config/appConfig'
import soQuestions from '../data/api_so_questions.mini.json'
import { getDifficultyLevel, connectDB } from './poc'


/**
 * GET /
 * Home page.
 */
export const index = async (req, res) => {
  try {
    const request = await connectDB()
    const questions = []

    // const response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=activity&tagged=javascript&site=stackoverflow&filter=!)s1i5tEVpAsjaocok1rN`)
    // console.log(response.data)

    for (let question of soQuestions.items) {
      const difficulty = await getDifficultyLevel(question, request)
      console.log(chalk.green('Difficulty = ' + difficulty))
    }     

  } catch (e) {
    console.log(e)
  }

  res.render('home', {
    title: 'Stack Overflow Level',
    questions: soQuestions.items
  })
}

