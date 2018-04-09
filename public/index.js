console.log("index script loaded")

let ausgabe = document.getElementById('newestevents')

login()

document.getElementById('login').innerHTML='<p>Eingelogt als: Martin Schachl</p>'


let sidebar=document.getElementById('sidebar')

html='<ul>'
html+='<li><a href="index.html">Home</a></li>'
html+='<li><a onclick="eingabe()">Noten eintragen</a></li>'
html+='<li><a onclick="findeklasse()">Klassen</a></li>'
html+='<li><a onclick="findeschueler()">Schüler</a></li>'
html+='</ul>'

sidebar.innerHTML=html


function login(){
    html='<p>melden sie sich bitte an:</p>'
    html+= '<form onsubmit="conformlogin(this);return false">'
    html+='<input type="text" name="inputname" placeholder="Username"<br>'
    html+='<input type="password" name="inputpw" placeholder="Passwort"<br>'
    html+='<input type="submit" value="anmelden">'
    html+='</form>'
    ausgabe.innerHTML=html
}


function conformlogin(formEl){
    let Username=formEl.elements.inputname.value
    console.log(Username)
    let pw=formEl.elements.inputpw.value
    console.log(sha1(pw))
    let arr = Username.split(' ')
    let firstname = arr[0]
    let lastname = arr[1]
    console.log(firstname)
    console.log(lastname)
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_login/'+firstname+'/'+lastname+'/'+pw)
    httpReq.onload = function() {
    let ausgabe = document.getElementById('newestevents')
        if(this.status==200) {
            let responseData = JSON.parse(this.responseText)
            console.log(responseData)
/*
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
*/

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


function home(){
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/newest_events')
    httpReq.onload = function() {
    let responseData = JSON.parse(this.responseText)
    generateDataTable(responseData)
    console.log(responseData)
    }
    httpReq.send()
}


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
            let i = []
            for(let j in responseData){
                i.push(responseData[j].sid)
            }
            console.log(i)
            html = '<form id="inputnotes" onsubmit="notessubmit(this,'+kid+','+fid+');return false">'
            html += '<h1>Test Eintragen</h1>'
            html += '<table>'
            html += '<tr><th>Test Beschreibung</th><th>Datum</th></tr>'
            html += '<tr><td>'
            html+='<input type="text" name="bez" placeholder="Beschreibung"<br>'
            html += '</td>'
            html += '<td>'
            html+='<input type="date" name="date" placeholder="Datum"<br>'
            html += '</td></tr>'
            html += '<table>'
            html += '<tr><th>Vorname</th><th>Nachname</th><th>Zusatztext</th><th>Note</th></tr>'

            for(let row in responseData) {
                html += '<tr>'
                html += '<td>'+responseData[row].firstname+'</td>'
                html += '<td>'+responseData[row].lastname+'</td>'
                html += '<td>'
                html+='<input type="text" name="info" placeholder="zst. Information"<br>'
                html += '</td>'
                html += '<td>'
                html+='<input type="number" name="'+responseData[row].sid+'_note" placeholder="0"<br>'
                html += '</td>'
                html += '</tr>'
            }
            html += '</table>'
            html+='<input type="submit" value="Speichern">'
            html+='</form>'
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

function notessubmit(formEl, kid, fid){
    console.log(kid,fid)
    let elements = formEl.elements
    let datum
    let beschreibung
    let list=[]

    for (var i = 0, element; element = elements[i++];) {
        if (element.value == "")
            list.push("null")
        else{
            if(i==1)
                beschreibung=element.value
            if(i==2)
                datum=new Date(element.value)
            if(i>2){
                list.push(element.value)
            }
        }
    }
    i=0
    console.log(beschreibung)
    console.log(datum)
    console.log(list)
    var text = '{ "kid" : "'+kid+'", "fid" : "'+fid+'", "date" : "'+datum+'","beschreibung":"'+beschreibung+'","lehrer":"crazy","tid":"0","schueler":['
    while(i<list.length-2){
        text+='{"'+list[i]+'":"'+list[++i]+'"},'
        i++
    }
    var text = text.substr(0, text.length-1);
    text+=']}'
    console.log(text)
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:3000/api/post_test";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json.email + ", " + json.password);
            }
        };
    xhr.send(text);
    }
    




function findeschueler(){
    console.log('schueler')
    ausgabe =document.getElementById('newestevents')
    html='<p>Vorname Nachname</p>'
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
    let httpReq=new XMLHttpRequest()
    httpReq.open('GET', '/api/get_personentests/'+firstname+'/'+lastname)
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


console.log(sha1("hallo"))
function sha1(msg)
{
  function rotl(n,s) { return n<<s|n>>>32-s; };
  function tohex(i) { for(var h="", s=28;;s-=4) { h+=(i>>>s&0xf).toString(16); if(!s) return h; } };
  var H0=0x67452301, H1=0xEFCDAB89, H2=0x98BADCFE, H3=0x10325476, H4=0xC3D2E1F0, M=0x0ffffffff; 
  var i, t, W=new Array(80), ml=msg.length, wa=new Array();
  msg += String.fromCharCode(0x80);
  while(msg.length%4) msg+=String.fromCharCode(0);
  for(i=0;i<msg.length;i+=4) wa.push(msg.charCodeAt(i)<<24|msg.charCodeAt(i+1)<<16|msg.charCodeAt(i+2)<<8|msg.charCodeAt(i+3));
  while(wa.length%16!=14) wa.push(0);
  wa.push(ml>>>29),wa.push((ml<<3)&M);
  for( var bo=0;bo<wa.length;bo+=16 ) {
    for(i=0;i<16;i++) W[i]=wa[bo+i];
    for(i=16;i<=79;i++) W[i]=rotl(W[i-3]^W[i-8]^W[i-14]^W[i-16],1);
    var A=H0, B=H1, C=H2, D=H3, E=H4;
    for(i=0 ;i<=19;i++) t=(rotl(A,5)+(B&C|~B&D)+E+W[i]+0x5A827999)&M, E=D, D=C, C=rotl(B,30), B=A, A=t;
    for(i=20;i<=39;i++) t=(rotl(A,5)+(B^C^D)+E+W[i]+0x6ED9EBA1)&M, E=D, D=C, C=rotl(B,30), B=A, A=t;
    for(i=40;i<=59;i++) t=(rotl(A,5)+(B&C|B&D|C&D)+E+W[i]+0x8F1BBCDC)&M, E=D, D=C, C=rotl(B,30), B=A, A=t;
    for(i=60;i<=79;i++) t=(rotl(A,5)+(B^C^D)+E+W[i]+0xCA62C1D6)&M, E=D, D=C, C=rotl(B,30), B=A, A=t;
    H0=H0+A&M;H1=H1+B&M;H2=H2+C&M;H3=H3+D&M;H4=H4+E&M;
  }
  return tohex(H0)+tohex(H1)+tohex(H2)+tohex(H3)+tohex(H4);
}