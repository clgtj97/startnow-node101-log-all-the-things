const express = require('express');
const fs = require('fs');
const app = express();

const date = new Date();
app.use((req, res, next) => {
   
    var log = req.headers['user-agent'].replace(',', '') + "," + date.toISOString() + "," + req.method + "," + req.url + ",HTTP/" + req.httpVersion + "," + res.statusCode + '\n';
    
    console.log(log);

    fs.appendFile('./log.csv', log, err => {

        if (err) {
            throw err;
        } next();

    });

});

app.get('/', (req, res) => {
    

    if (req) {
        res.send('ok').status(200);
    } else { console.log(err); }
});

app.get('/logs', (req, res) => {
    

    fs.readFile('./log.csv', 'utf8', (err, data) => {
        if (err) throw err
        ;
        console.log(data);

        var output = data.split('\n');
        //output.shift();
        //output.pop();
        var jsonOutput = [];

        output.forEach(line => {

            var contents = line.split(',');
                var jsonLine = {
                    'Agent': contents[0],
                    'Time': contents[1],
                    'Method': contents[2],
                    'Resource': contents[3],
                    'Version': contents[4],
                    'Status': contents[5],
                };

            if (contents[0] !== "") {
                jsonOutput.push(jsonLine);
            }

        });
        res.json(jsonOutput);
    });
});

module.exports = app;
