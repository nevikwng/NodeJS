const http = require('http');
const fs = require('fs');
const server =  http.createServer((message,res)=>{

    fs.writeFile(__dirname+'/01.json',
    JSON.stringify(message.aborted),

    (err)=>{
       err?console.log(err):res.end('ok')
    })
    



})

server.listen(80);
