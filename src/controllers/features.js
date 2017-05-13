export function featureFocus(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT posts.Tags
      FROM [StackOverflow].[dbo].[Posts] as posts
      WHERE posts.PostTypeId = 1` +
      ' AND posts.OwnerUserId = ' + q.owner.user_id

    if (q.owner.user_id === 0) {
      resolve(0.5)
    } else {
      let allTags = []
      request.query(query, function (_err, recordset) {
        // console.log('recordset = ', recordset)

        // create TQui
        recordset.forEach(obj => {
          let qTags = _extractTags(obj.Tags)
          allTags = allTags.concat(qTags)
        })
        // console.log(allTags)

        const length = allTags.length

        // case have single tag
        if (length < 2)
          resolve(0.5)

        const tagCalculated = []
        let entropy = 0

        // find P of each topic
        recordset.forEach(obj => {
          let qTags = _extractTags(obj.Tags)

          qTags.forEach(tag => {
            // check tag calculated
            if (tagCalculated[tag])
              return

            tagCalculated[tag] = true

            let sumCountTag = allTags.filter(t => t === tag).length
            let P = sumCountTag / length
            entropy += P * Math.log2(P)
            // console.log('P = '+ P)
          })
        })

        // console.log('-1 / Math.log(length) = ', -1 / Math.log(length))
        const focusScore = (-1 / Math.log2(length)) * entropy

        // convert if score close 1 is focus on particular question tags
        resolve(1 - focusScore)
      })
    }
  })
}

export function ratioSuccessAnswered(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT ans.Id AnswerId, que.AcceptedAnswerId
      FROM [StackOverflow].[dbo].[Posts] as ans
      LEFT JOIN [StackOverflow].[dbo].[Posts] as que
      ON ans.ParentId = que.Id
      WHERE ans.PostTypeId = 2` +
      ' AND ans.OwnerUserId = ' + q.owner.user_id

    if (q.owner.user_id === 0)
      resolve(0)
    else
      request.query(query, function (_err, recordset) {
        // console.log(recordset)
        const length = recordset.length
        if (length === 0)
          resolve(0)

        const countAcceptAnswer = recordset.filter(obj => obj.AnswerId === obj.AcceptedAnswerId)
        resolve(countAcceptAnswer.length / length)
      })
  })
}

export function experience(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT DATEDIFF(day, CreationDate, '2016-03-06') AS DiffDate
      FROM [StackOverflow].[dbo].[Users]` +
      ' WHERE Id = ' + q.owner.user_id

    if (q.owner.user_id === 0)
      resolve(0)
    else
      request.query(query, function (_err, recordset) {
        if (recordset.length > 0)
          resolve(recordset[0].DiffDate / 2710)
        else
          resolve(0)
      })
  })
}

export function viewsPrd(request, q) {
  return new Promise((resolve) => {
    let normalizeView = (q.view_count / 3037743)
    resolve(1 - normalizeView)
  })
}

// for PoC
export function views(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT Id, ViewCount
      FROM [StackOverflow].[dbo].[Posts]
      WHERE Id = ` + q.question_id

    request.query(query, function (_err, recordset) {
      let normalizeView = (recordset[0].ViewCount / 3037743)
      resolve(1 - normalizeView)
    })
  })
}

export function existingValuePrd(request, q) {
  return new Promise((resolve) => {
    let sumValue = 0

    if (q.answers)
      q.answers.map(answer => {
        sumValue += answer.score
        if (answer.is_accepted)
          sumValue += 2
        else
          sumValue += 1
      })

    // console.log('sumValue = ', sumValue)
    resolve(1 - (Math.min(5, sumValue) / 5))
  })
}

// fot PoC
export function existingValue(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT *
      FROM [StackOverflow].[dbo].[Posts]
      WHERE PostTypeId = 2
      AND ParentId = ` + q.question_id

    request.query(query, function (_err, recordset) {
      // console.log(recordset)

      let sumValue = 0
      recordset.forEach(answer => {
        sumValue += answer.Score
        if (answer.Id === q.AcceptedAnswerId)
          sumValue += 2
        else
          sumValue += 1
      })

      // console.log('sumValue = ',sumValue)
      resolve(1 - (Math.min(5, sumValue) / 5))
    })
  })
}

/* Utility */
const _extractTags = (tags) => {
  var temp = tags.slice(1, -1)
  return temp.split('><')
}
