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


app.listen(3000,function(){
    console.log('server running and listening on port 3000')
})