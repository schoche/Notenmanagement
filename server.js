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
    database: "Notenmanagement",
    multipleStatements: true

})

connection.connect(function(err){
    if(err){
        console.log("SQL Connection error: " + err)
        return
    }
    console.log("connected to database")
})

app.get('/homepage', function(req, res) {
    console.log("homepage query")
    res.sendFile(path.join(__dirname + '/public/index.html'))
});

app.get("/api/newest_events",function(req, res){
    let query = 'select klassen.klasse,faecher.fach,tests.tid,date_format(tests.datum,"%d-%m-%Y") as datum from klassen join faecher join tests ' +
                'on klassen.kid = tests.kid AND faecher.fid = tests.fid'

    connection.query(query,function(err, results, fields){
        if(err){
            console.log("get newest_events ERROR: " + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log("get_newest_events:")
        

        let len = getNumber(x)
        console.log("length: " + len)

        let five = []
        if(len > 5){
            for(let i = len-5; i < len; i++){
                five.push(y[i])
            }
        }else{
            five = y
        }
        console.log(five)
        res.send(five)
    })
})

app.get("/api/get_test/:tid",function(req, res){
    let query = 'select s.sid, s.firstname, s.lastname, k.kid, k.klasse, e.note, e.kommentar, t.tid, t.bezeichnung, date_format(t.datum,"%d-%m-%Y") as datum, f.fid, f.fach, l.lid, l.firstname, l.lastname ' + 
                'from schueler as s join ergebnisse as e join tests as t join klassen as k join faecher as f join lehrer as l ' +
                'on e.sid = s.sid and e.tid = t.tid and s.kid =  t.kid ' +
                'and k.kid = s.kid and f.fid = t.fid and l.lid = t.lid where t.tid = ?'; 

    console.log("get_test tid: " + req.params.tid)
    connection.query(query,req.params.tid,function(err, results, fields){
        if(err){
            console.log("get_test ERROR: " + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

        res.send(y)
    })
})

app.post("/api/post_test", function(req, res){
    let tid = req.body.tid
    console.log(tid)
    if(tid == 0){
        post_test(req, function(tid){
            res.send(tid)
        })
    }else{
        delete_test(tid, function(){
            post_test(req, function(tid){
                res.send(tid)
            })
        })

    }

    
})

function post_test(req, callback){
    
    let kid = req.body.kid
    let lid = req.body.lid
    let fid = req.body.fid
    let bez = req.body.bezeichnung
    let dat = reverseDate(req.body.datum)
    let tid = req.body.tid

    let query = 'insert into tests values (null,' + kid + ',' + lid +',' + fid + ',"' + bez + '","' + dat + '")'
    console.log("post_test:\n" + query)

    connection.query(query, function(err, results, fields){
        if(err){
            console.log("post test ERROR: " + err)
            let n = [{tid : "0"}]
            res.send(JSON.parse(JSON.stringify(n)))
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

        get_tid(kid, lid, fid, bez, dat, function(tid){
            console.log("get_tid: " + JSON.stringify(tid))
            callback(tid)
        })
    })
}

app.post("/api/delete_test", function(req, res){
    tid = req.body.tid
    
    delete_test(tid)

    
})


app.get("/api/get_klassen_faecher/:kid",function(req, res){
    let query = 'select distinct * from (select f.fid, f.fach, k.kid, k.klasse from tests as t join faecher as f join klassen as k ' +
                'on t.fid = f.fid and t.kid = k.kid where t.kid = ?) as a'

    console.log("get_klassen_faecher kid: " + req.params.kid)
    connection.query(query, req.params.kid, function(err, results, fields){
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

app.get("/api/get_klassentests/:kid/:fid",function(req, res){
    let query = 'select t.tid, t.bezeichnung, date_format(t.datum,"%d-%m-%Y") as datum, f.fid, f.fach, k.kid, k.klasse ' +
                'from tests as t join faecher as f join klassen as k ' +
                'on t.kid = k.kid and t.fid = f.fid ' +
                'where k.kid = ? and f.fid = ' + req.params.fid

    console.log("get_klassentests kid/fid: " + req.params.kid + "/" + req.params.fid)
    connection.query(query, req.params.kid, function(err, results, fields){
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

app.get("/api/get_personentests/:fn/:ln",function(req, res){
    
    let fn = req.params.fn
    let ln = req.params.ln
    let test = "nobody found"

    schueler_exists(fn, ln, function(found){
        if(found){
            test = "schueler gefunden"
            console.log(test)

            get_schuelertests(fn, ln, function(result){
                res.send(result)
            })
        }else{
            lehrer_exists(fn, ln, function(found){
                if(found){
                    test = "lehrer gefunden"
                }else{
                    console.log(test)
                    res.send(test)
                    return
                }
                console.log(test)
                get_lehrertests(fn, ln, function(result){
                    res.send(result)
                })
            })
        }
    })

})

app.get("/api/get_schueler/:kid",function(req, res){
    let query = 'select s.sid, s.firstname, s.lastname, k.kid, k.klasse from schueler as s join klassen as k on s.kid = k.kid where k.kid = ?'
    connection.query(query,req.params.kid,function(err, results, fields){
        if(err){
            console.log("get_schueler ERROR:" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(results)
        console.log(y)
        res.send(y)
    })
})


app.get("/api/get_klassen",function(req, res){
    let query = 'select * from klassen'
    connection.query(query,function(err, results, fields){
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

app.get("/api/get_faecher",function(req, res){
    let query = 'select * from faecher'
    connection.query(query,function(err, results, fields){
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

function delete_test(tid, callback){
    
    console.log("delete_test tid: " + tid)
    let query = 'delete from tests where tests.tid = ' + tid +
                '; delete from ergebnisse where ergebnisse.tid = ' + tid
    
    connection.query(query, function(err, results, fields){
        if(err){
            console.log("delete_test ERROR: " + err)
            return
        }

        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log("deleted")
        callback()

        
    })
}

function get_tid(kid, lid, fid, bez, revDat, callback){
    let query = 'select t.tid from tests as t where t.kid = ' + kid + ' and t.lid = ' + lid + ' and t.fid = ' + fid + 
                ' and t.bezeichnung = "' + bez + '" and t.datum = "' + revDat + '"';
    connection.query(query, function(err, results, fields){
        if(err){
            console.log("get_tid ERROR" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)

        callback(y)
    })
}

function get_schuelertests(fn, ln, callback){
    let query = 'select e.note, e.kommentar, t.tid, t.bezeichnung, date_format(t.datum,"%d-%m-%Y") as datum, k.kid, k.klasse, l.lid, l.firstname, l.lastname, f.fid, f.fach, s.sid, s.firstname, s.lastname ' + 
                'from ergebnisse as e join tests as t join klassen as k join lehrer as l join faecher as f join schueler as s ' +
                'on e.sid = s.sid ' +
                'and e.tid = t.tid ' +    
                'and t.kid = k.kid ' +
                'and t.lid = l.lid ' + 
                'and t.fid = f.fid ' +
                'and s.kid = k.kid ' +
                'where s.firstname = "' + fn + '" and s.lastname = "' + ln + '" order by f.fid';
    
    console.log(query)
    connection.query(query,function(err, results, fields){
        if(err){
            console.log("get_schuelertests ERROR" + err)
            return
        }
        let x = JSON.stringify(results)
        
        let y = formfacharray(x)
        console.log("get_schuelertests\n")
        console.log(y)
        
        callback(y)
    })

}

function formfacharray(str){
    let obj = JSON.parse(str)
    let len = getNumber(str)
    if(!len){
        return obj
    }
    let fach = obj[0].fach
    let resObj = []
    resObj.push({"fach":fach, "data": []})
    let ind = 0
    
    for(let i in obj){
        if(obj[i].fach != fach){
            fach = obj[i].fach
            ind++
            resObj.push({"fach":fach, "data": []})
            console.log(fach)
            
        }
        resObj[ind]["data"].push(obj[i])

        
    }
    console.log(resObj)
    return resObj
}

function get_lehrertests(fn, ln, callback){
    let query = 'select t.tid, t.bezeichnung, date_format(t.datum,"%d-%m-%Y") as datum, k.kid, k.klasse, l.lid, l.firstname, l.lastname, f.fid, f.fach ' +
                'from tests as t join klassen as k join lehrer as l join faecher as f ' +
                'on t.kid = k.kid ' +
                'and t.lid = l.lid ' +
                'and t.fid = f.fid ' +
                'where l.firstname = "' + fn + '" and l.lastname = "' + ln + '"';
    
    console.log(query)
    connection.query(query,function(err, results, fields){
        if(err){
            console.log("get_lehrertests ERROR" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log("get_lehrertests\n" + y)
        
        callback(y)
    })
}

function lehrer_exists(fn, ln, callback){
    let query = 'select count(l.lid) as found from lehrer as l where l.firstname = "' + fn + '" and l.lastname = "' + ln + '"';
    let found = 0
    
    console.log("lehrer_exists\n" + query)
    connection.query(query,function(err, results, fields){
        if(err){
            console.log("lehrer_exists ERROR" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)
        
        found = y[0].found
        callback(found)
    })
}

function schueler_exists(fn, ln, callback){
    let query = 'select count(s.sid) as found from schueler as s where s.firstname = "' + fn + '" and s.lastname = "' + ln + '"';
    let found = 0
    
    console.log("schueler_exists\n" + query)
    connection.query(query,function(err, results, fields){
        if(err){
            console.log("schueler_exists ERROR" + err)
            return
        }
        let x = JSON.stringify(results)
        let y = JSON.parse(x)
        console.log(y)

        found = y[0].found
        
        callback(found)
    })
}

function getNumber(x){
    let str = '{"data":' + x + "}"
    let o = JSON.parse(str)
    return o["data"].length       
}

function reverseDate(str){
    let list = str.split("-") 
    return list[2] + '-' + list[1] + '-' + list[0]
}