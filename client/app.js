$(document).ready(function() {
  $('#fetchDomain').click(function(e) {
    var domainString = $('input[name="companies"]').val()
    resetList()
    $.getJSON('http://localhost:8080/domains/'+domainString, function(data) {
      var domains = []
      $('.listHeader').text(data.length + ' Results')
      $.each(data.data, function(index,value) {
        domains.push("<li>" + value.name + ": " + value.domain + "</li>")
      })
      $('.list').append(domains)
    })
  })
  $('#fetchLookup').click(function(e) {
    e.preventDefault()
    resetList()
    $.getJSON('http://localhost:8080/lookups', function(data) {
      $('.listHeader').text(data.length + ' Result Sets')
      var domains = []
      $.each(data.data, function(index,value) {
        domains.push("<li class='itemHeader'>Result Set " + (index+1) + "</li>")
        $.each(value.result, function(i,v) {
          domains.push("<li>" + v.name + ": " + v.domain + "</li>")
        })
      })
      $('.list').append(domains)
    })
  })
  function resetList() {
    $('.listHeader').text('')
    $('.list').html('')
  }
})
