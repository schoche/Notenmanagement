const express=require('express')

const app=express()

app.use(express.static('public'))


app.listen(3000,function(){
    console.log('server running and listening on port 3000')
})