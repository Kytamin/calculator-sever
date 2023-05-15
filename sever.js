const http = require('http');
const fs = require('fs');
const qs = require('qs')
const server = http.createServer( (req, res)=> {
    if (req.method === 'GET') {
        fs.readFile('./views/calculator.html',  (err, data)=> {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        req.on('end', () => {
            const value = qs.parse(data);
            fs.readFile('./views/display.html', 'utf8',  (err, dataHTML)=> {

                if (err) {
                    console.log(err.message);
                }

                let result= eval(value.input1+value.algorithm+value.input2)
                dataHTML = dataHTML.replace('{input1}', value.input1);
                dataHTML  = dataHTML.replace('{algorithm}', value.algorithm);
                dataHTML  = dataHTML.replace('{input2}', value.input2);
                dataHTML  = dataHTML.replace('{result}',`${result}`)
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(dataHTML);
                return res.end();
            });
        })
        req.on('error', () => {
            console.log('error')
        })
    }
});

server.listen(8080,'localhost', ()=> {
    console.log('server running')
});
