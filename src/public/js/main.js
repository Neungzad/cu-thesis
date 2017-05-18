/*eslint-disable*/

$(document).ready(function () {
  $('#fromdate').datepicker({
    dateFormat: 'yy-mm-dd'
  })
  $('#todate').datepicker({
    dateFormat: 'yy-mm-dd'
  })

  // hide advanced search
  // $('.advance-search').hide();

  $('#advanced-search-btn').click(function(){
    $('.advance-search').toggle("slow");
  })
})
