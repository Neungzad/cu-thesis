import axios from 'axios'
import appConfig from '../config/appConfig'
import so_questions from '../data/api_so_questions.mini.json';

/**
 * GET /
 * Home page.
 */
export const index = async (req, res) => {
  try {
    // const response = await axios.get(`${appConfig.API_URL}/2.2/questions?order=desc&sort=activity&tagged=javascript&site=stackoverflow&filter=!)s1i5tEVpAsjaocok1rN`)
    // console.log(response.data);

    console.log(so_questions)
  } catch (e) {
    console.log(e);
  }

  res.render('home', {
    title: 'Stack Overflow Level',
    questions: so_questions.items
  });
};

