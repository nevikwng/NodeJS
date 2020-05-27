const http = require('http')

const server =  http.createServer((message,res)=>{

    res.writeHead(200,{

        'Content-Type': 'text/html'
    })
    res.end(`<h1>httssasdssssasdassssp:</h1>${message.url}${message.rawHeaders}${res.statusCode}`)
})

server.listen(80);
