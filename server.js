const express=require('express')
const app=express()

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
        console.log(err)
        return
    }
    console.log("connected to DB")
})

app.get('/', function(req, res) {
    console.log("homepage query")
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get("/api/newest_events",function(req,res){
    let query = 'select klassen.klasse,faecher.fach,date_format(tests.datum,"%d-%m-%Y") as datum from klassen join faecher join tests on klassen.kid = tests.kid AND faecher.fid = tests.fid'
    connection.query(query,function(err,results,fields){
        if(err){
            console.log(err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

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

app.get("/api/get_klassen",function(req,res){
    let query = 'select klasse from klassen'
    connection.query(query,function(err,results,fields){
        if(err){
            console.log(err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)
        res.send(y)
    })
})

app.get("/api/get_faecher",function(req,res){
    let query = 'select fach from faecher'
    connection.query(query,function(err,results,fields){
        if(err){
            console.log(err)
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