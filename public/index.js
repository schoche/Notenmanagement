console.log("index script loaded")

let ausgabe = document.getElementById('newestevents')
ausgabe.innerHTML="<p>das ist ein test</p>"

let httpReq=new XMLHttpRequest()
httpReq.open('GET', '/api/newest_events')
httpReq.onload = function() {
    let responseData = JSON.parse(this.responseText)
    generateDataTable(responseData)
}
httpReq.send()



function generateDataTable(data) {
    let divEl = document.getElementById('newestevents')
    let html = '<table>'
    html += '<tr><th>Klasse</th><th>Fach</th><th>Datum</th></th><th>Bezeichnung</th></tr>'
    for(let word in data) {
        html += '<tr>'
        html += '<td>'+word+'</td>'
        html += '<td>'+data[word]+'</td>'
        html += '</tr>'
    }
    html += '</table>'
    divEl.innerHTML = html
}