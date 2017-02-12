export function featureFocus(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT posts.Tags
      FROM [StackOverflow].[dbo].[Posts] as posts
      WHERE posts.PostTypeId = 1` +
      ' AND posts.OwnerUserId = ' + q.OwnerUserId 

    if (q.OwnerUserId === 0){
      resolve([q.Tags]);
    }else{
      let allTags = [];
      request.query(query, function(err, recordset) {
        //console.log('recordset = ', recordset);
        
        // create TQui
        recordset.forEach(obj => {
          let qTags = _extractTags(obj.Tags);
          allTags = allTags.concat(qTags);
        })
        //console.log(allTags);

        const length = allTags.length;
        let sumP = 0;

        // find P of each topic 
        recordset.forEach(obj => {
          let qTags = _extractTags(obj.Tags);
          let sumCountTag = 0;
          qTags.forEach(tag => {
            sumCountTag += allTags.filter(t => t === tag).length;
            //console.log('sumCountTag = ', sumCountTag);
          })

          let P = sumCountTag / length;
          sumP += P * Math.log(P);
          //console.log('sumP = ', sumP);
        })

        //console.log('-1 / Math.log(length) = ', -1 / Math.log(length));
        const focusScore = (-1 / Math.log(length)) * sumP;
        resolve(focusScore);
      });	
    }   
  });
};

export function ratioSuccessAnswered(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT ans.Id AnswerId, que.AcceptedAnswerId
      FROM [StackOverflow].[dbo].[Posts] as ans
      LEFT JOIN [StackOverflow].[dbo].[Posts] as que
      ON ans.ParentId = que.Id
      WHERE ans.PostTypeId = 2` +
      ' AND ans.OwnerUserId = ' + q.OwnerUserId 
  
    if (q.OwnerUserId === 0){
      resolve(0);
    }else{
      request.query(query, function(err, recordset) {
        console.log(recordset);
        const length = recordset.length;
        if( length === 0 ) 
          resolve(0);
          
        const countAcceptAnswer = recordset.filter(obj => obj.AnswerId === obj.AcceptedAnswerId)
        resolve(countAcceptAnswer.length / length);
      });	
    }   
  });
}


function featureTemplate(request, q) {
  return new Promise((resolve) => {
    const query = `
      SELECT ans.Id AnswerId, que.AcceptedAnswerId
      FROM [StackOverflow].[dbo].[Posts] as ans
      LEFT JOIN [StackOverflow].[dbo].[Posts] as que
      ON ans.ParentId = que.Id
      WHERE ans.PostTypeId = 2` +
      ' AND ans.OwnerUserId = ' + q.OwnerUserId 
    
    console.log(query);

    if (q.OwnerUserId === 0){
      resolve(0);
    }else{
      request.query(query, function(err, recordset) {
        resolve(recordset);
      });	
    }   
  });
}



/* Utility */
const _extractTags = (tags) => {
  var temp = tags.slice(1, -1);
  return temp.split('><');
}

