const express=require('express')
const app=express()
const path = require("path")

const bodyParser=require('body-parser')
const mysql=require("mysql")


app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Notenmanagement"

})

connection.connect(function(err){
    if(err){
        console.log("SQL Connection error:" + err)
        return
    }
    console.log("connected to DB")
})

app.get('/homepage', function(req, res) {
    console.log("homepage query")
    res.sendFile(path.join(__dirname + '/public/index.html'))
    //res.send("homepage")
});

app.get("/api/newest_events",function(req,res){
    let query = 'select klassen.klasse,faecher.fach,tests.tid,date_format(tests.datum,"%d-%m-%Y") as datum from klassen join faecher join tests ' +
                'on klassen.kid = tests.kid AND faecher.fid = tests.fid'
    connection.query(query,function(err,results,fields){
        if(err){
            console.log("get newest_events ERROR: " + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log("newest_events:\n" + y)

        let len = getNumber(x)
        console.log(len)

        let five = []
        if(len > 5){
            for(let i = len-5; i < len; i++){
                five.push(y[i])
            }
        }else{
            five = y
        }
        res.send(five)
    })
})

app.get("/api/get_test/:tid",function(req,res){
    let query = 'select s.sid, s.firstname, s.lastname, k.kid, k.klasse, e.note, e.kommentar, t.tid, t.bezeichnung, date_format(t.datum,"%d-%m-%Y") as datum, f.fid, f.fach ' + 
                'from schueler as s join ergebnisse as e join tests as t join klassen as k join faecher as f ' +
                'on e.sid = s.sid and e.tid = t.tid and s.kid =  t.kid ' +
                'and k.kid = s.kid and f.fid = t.fid where t.tid = ?'; 

    console.log("tid: " + req.params.tid)
    connection.query(query,req.params.tid,function(err,results,fields){
        if(err){
            console.log("get test ERROR: " + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

        res.send(y)
    })
})

app.get("/api/get_klassen_faecher/:kid",function(req,res){
    let query = 'select distinct * from (select f.fid, f.fach, k.kid, k.klasse from tests as t join faecher as f join klassen as k ' +
                'on t.fid = f.fid and t.kid = k.kid where t.kid = ?) as a'

    console.log("get_klassen_faecher\nkid: " + req.params.kid)
    connection.query(query, req.params.kid, function(err,results,fields){
        if(err){
            console.log("get_klassen_faecher ERROR: " + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

        res.send(y)
    })
})

app.get("/api/get_klassentests/:kid/:fid",function(req,res){
    let query = 'select t.tid, t.bezeichnung, date_format(t.datum,"%d-%m-%Y") as datum, f.fid, f.fach, k.kid, k.klasse ' +
                'from tests as t join faecher as f join klassen as k ' +
                'on t.kid = k.kid and t.fid = f.fid ' +
                'where k.kid = ? and f.fid = ' + req.params.fid
    console.log(query)

    console.log("get_klassentests\nkid/fid: " + req.params.kid + req.params.fid)
    connection.query(query, req.params.kid, function(err,results,fields){
        if(err){
            console.log("get_klassentests ERROR: " + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

        res.send(y)
    })
})

app.get("/api/get_schueler/:kid",function(req,res){
    let query = 'select s.sid, s.firstname, s.lastname, k.kid, k.klasse from schueler as s join klassen as k on s.kid = k.kid where k.kid = ?'
    connection.query(query,req.params.kid,function(err,results,fields){
        if(err){
            console.log("get_klassen ERROR:" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(results)
        console.log(y)
        res.send(y)
    })
})


app.get("/api/get_klassen",function(req,res){
    let query = 'select * from klassen'
    connection.query(query,function(err,results,fields){
        if(err){
            console.log("get_klassen ERROR:" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(results)
        console.log(y)
        res.send(y)
    })
})

app.get("/api/get_faecher",function(req,res){
    let query = 'select * from faecher'
    connection.query(query,function(err,results,fields){
        if(err){
            console.log("get_faecher ERROR" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)
        res.send(y)
    })
})
app.listen(3000,function(){
    console.log('server running and listening on port 3000')
})

function getNumber(x){
    let str = '{"data":' + x + "}"
    let o = JSON.parse(str)
    return o["data"].length       
}