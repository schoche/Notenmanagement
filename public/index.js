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
            html += '<td  onclick="get_klassen_faecher('+responseData[row].kid+')">'+responseData[row].klasse+'</a></td>'
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

function get_klassen_faecher(kid){
    console.log(kid)
      let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_klassen_faecher/'+kid)
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)
            html = '<table class="newest">'
            html += '<tr><th>Test der Klasse: '+responseData[0].klasse+'</th></tr>'
            for(let row in responseData) {
                html += '<tr>'
                html += '<td  onclick="get_klassen_tests('+responseData[row].fid+','+responseData[row].kid+')">'+responseData[row].fach+'</a></td>'
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


function get_klassen_tests(fid,kid){
    console.log(fid)
    console.log(kid)
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_klassentests/'+kid+'/'+fid)
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)
            html = '<table class="newest">'
            html += '<tr><th>Fach</th><th>Bezeichnung</th><th>Datum</th><th>Klasse</th></tr>'
            for(let row in responseData) {
                html += '<tr>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].fach+'</a></td>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].bezeichnung+'</a></td>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].datum+'</a></td>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].klasse+'</a></td>'
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


function eingabe(){
    console.log("input")
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_klassen')
    httpReq.onload = function() {
        let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)

            var html ='<form onsubmit="klassensubmit(this);return false">'
            html +='<select name="klasse" size="10">'
            for(let row in responseData) {
                html +='<option value="'+responseData[row].kid+'">'+responseData[row].klasse+'</option>'
            }
            html+='</select>'
            html+='<input type="submit" value="Speichern">'
            html+='</form>'
            ausgabe.innerHTML=html

        } else {
            console.log("error")
            let errorTxt = 'Error: '+this.status+' ('+this.statusText+')'
            ausgabe.innerHTML=errorTxt
            
        }
    }
    httpReq.send()
}


function klassensubmit(formEl)
{
    let kid = formEl.elements.klasse.value
    console.log(kid)
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_faecher')
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)
            var html ='<form onsubmit="fachsubmit(this ,'+kid+');return false">'
            html +='<select name="fach" size="10">'
            for(let row in responseData) {
                html +='<option value="'+responseData[row].fid+'">'+responseData[row].fach+'</option>'
            }
            html+='</select>'
            html+='<input type="submit" value="Speichern">'
            html+='</form>'
            ausgabe.innerHTML=html
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


function fachsubmit(formEl, kid){
    console.log(kid)
    let fid = formEl.elements.fach.value
    console.log(fid)
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_schueler/'+kid)
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)
            /*html = '<table class="newest">'
            html += '<tr><th>Vorname</th><th>Nachname</th><th>Zusatztext</th><th>Note</th></tr>'
            for(let row in responseData) {
                html += '<tr>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].fach+'</a></td>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].bezeichnung+'</a></td>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].datum+'</a></td>'
                html += '<td  onclick="row('+responseData[row].tid+')">'+responseData[row].klasse+'</a></td>'
                html += '</tr>'
            }
            html += '</table>'

            ausgabe.innerHTML = html
*/
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




function findeschueler(){
    console.log('schueler')
    ausgabe =document.getElementById('newestevents')
    html='<p>Nachname Vorname</p>'
    html+= '<form onsubmit="findschuelerpress(this);return false">'
    html+='<input type="text" name="inputname" placeholder="Name"<br>'
    html+='<input type="submit" value="Suchen">'
    html+='</form>'
    ausgabe.innerHTML=html
}

function findschuelerpress(formEl)
{
    let vn=formEl.elements.inputname.value
    console.log(vn)
    let arr = vn.split(' ')
    let firstname = arr[0]
    let lastname = arr[1]
    console.log(firstname)
    console.log(lastname)


}
