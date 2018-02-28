console.log("index script loaded")

let ausgabe = document.getElementById('newestevents')
ausgabe.innerHTML="<p>das ist ein test</p>"

let httpReq=new XMLHttpRequest()
httpReq.open('GET', '/api/newest_events')
httpReq.onload = function() {
let responseData = JSON.parse(this.responseText)
generateDataTable(responseData)
console.log(responseData)
}
httpReq.send()

function generateDataTable(data) {
    let divEl = document.getElementById('newestevents')
    console.log(data[0].fach)
    let html = '<table class="newest">'
    html += '<tr><th>Klasse</th><th>Fach</th><th>Datum</th></th></tr>'
    for(let row in data) {
        html += '<tr>'
        html += '<td  onclick="row('+data[row].tid+')">'+data[row].klasse+'</a></td>'
        html += '<td  onclick="row('+data[row].tid+')">'+data[row].fach+'</a></td>'
        html += '<td  onclick="row('+data[row].tid+')">'+data[row].datum+'</a></td>'
        html += '</tr>'
    }
    html += '</table>'
    divEl.innerHTML = html
}

function row(tid){
    console.log(tid)
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_test/'+tid)
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)

            html ='<h1>'+responseData[0].klasse+': '+responseData[0].fach+' vom '+responseData[0].datum+' über '+responseData[0].bezeichnung+'</h2>'
            html += '<table class="newest">'
            html += '<tr><th>Vorname</th><th>Nachname</th><th>Note</th><th>Kommentar</th></tr>'
            for(let row in responseData) {
                html += '<tr>'
                html += '<td>'+responseData[row].firstname+'</td>'
                html += '<td>'+responseData[row].lastname+'</td>'
                html += '<td>'+responseData[row].note+'</td>'
                html += '<td>'+responseData[row].kommentar+'</td>'
                html += '</tr>'
            }
            html += '</table>'


            ausgabe.innerHTML = html




        } else {
            console.log("error")
            let errorTxt = 'Error: '+this.status+' ('+this.statusText+')'
            ausgabe.innerHTML=errorTxt
            
        }
    }
    httpReq.onerror = function(error) {
        console.log('*** onerror ***')
        console.log(error)
    }
    httpReq.send()
}

function findeklasse(){
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_klassen')
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)


            let html = '<table class="newest">'
            html += '<tr><th>Klassen</th></tr>'
            for(let row in responseData) {
            html += '<tr>'
            html += '<td  onclick="get_klassen('+responseData[row].kid+')">'+responseData[row].klasse+'</a></td>'
            html += '</tr>'
    }
    html += '</table>'
    ausgabe.innerHTML=html
        } else {
            console.log("error")
            let errorTxt = 'Error: '+this.status+' ('+this.statusText+')'
            ausgabe.innerHTML=errorTxt 
        }
    }
    httpReq.onerror = function(error) {
        console.log('*** onerror ***')
        console.log(error)
    }
    httpReq.send()
}

function get_klassen(kid){
    console.log(kid)
}


function eingabe(){
    console.log("input")
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_klassen')
    httpReq.onload = function() {
        let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)

/*
            var html ='<form onsubmit="submitpressed(this);return false">'
            html +='<select name="Klasse:" size="10">'
            for(let row in responseData) {
                html +='<option value="'+responseData[row].kid+'">'+responseData[row].klasse+'</option>'
            }
            html+='</select>'
            html+= '<form onsubmit="submit(this);return false">'
            html+='<input type="submit" value="Speichern">'
            html+='</form>'
            ausgabe.innerHTML=html
*/

        } else {
            console.log("error")
            let errorTxt = 'Error: '+this.status+' ('+this.statusText+')'
            ausgabe.innerHTML=errorTxt
            
        }
    }
    httpReq.send()
}

/*
function submit();return false
{
    console.log('jo')
}
*/
function findeschueler(){
    console.log('schueler')
    ausgabe =document.getElementById('newestevents')
    html='<p>Nachname Vorname</p>'
    html+= '<form onsubmit="submitpressed(this);return false">'
    html+='<input type="text" name="inputname" placeholder="Name"<br>'
    html+='<input type="submit" value="Speichern">'
    html+='</form>'
    ausgabe.innerHTML=html
}
/*
function submitpressed(formEl);return false
{
    console.log('fein')
    console.log(formEl.elements.isn.value)
}*/


    

