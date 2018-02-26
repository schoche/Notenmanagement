const express=require('express')
const app=express()

const bodyParser=require('body-parser')
const mysql=require("mysql")


app.use(express.static('public'))
app.use(bodyParser.json())

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Notenmanagement"

})

app.get("/test",function(req,res){
    connection.query("select * from test",function(err,results,fields){
        console.log(results)
    })
})

app.get("/api/newest_events",function(req,res){
    let query = "select klassen.klasse,faecher.fach,tests.datum from klassen join faecher join tests on klassen.kid = tests.kid AND faecher.fid = tests.fid order by datum desc"
    connection.query(query,function(err,results,fields){
        if(err){
            console.log(err)
            return
        }
        console.log(results[0])
        console.log(fields)
    })
})


app.listen(3000,function(){
    console.log('server running and listening on port 3000')
})