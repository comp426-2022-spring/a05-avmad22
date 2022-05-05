// functions for coin flip
function coinFlip() {
 
    let num = Math.round(Math.random())%2;
    
    if(num==0) {return "heads"};
    return "tails";
}

function coinFlips(flips) {
    let array = [];
    for (let i = 1; i <= flips; i++) {
        array.push(coinFlip());
    }
    return array;

}

function countFlips(array) {
    let heads =0;
    let tails=0;
    for(let i=0; i < array.length; i++) {
      if(array[i]=="heads") {
        heads++;
      } else {
        tails++;
      }
    }
    return "{ heads: " + heads + ", tails: " + tails + " }"
}

function flipACoin(call) {
    let side = coinFlip();
    let result = "";
    if(side==call) {
      result = "win";
    } else {result="lose";}
    return {call: call, flip: side, result: "win"}
}

// start server // 
// Require minimist module (make sure you install this one via npm).
// Require minimist module
const args = require('minimist')(process.argv.slice(2))

// Define app using express
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));




// require morgan
const morgan = require('morgan')

// require fs
const fs=require('fs')

// get db
const db = require('./src/services/database.js');
// Make Express use its own built-in body parser to handle JSON
app.use(express.json());

// Store help text 
const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)

// If --help, echo help text and exit
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}




// Make Express use its own built-in body parser
var HTTP_PORT = args.port || args.p || process.env.PORT || 5000

var DEBUG = args['debug'] || false
var LOG = args['log']
if(args['log'] == null){
    LOG = true
}

// If --log=false then do not create a log file
if (args.log == 'false') {
    console.log("NOTICE: not creating file access.log")
} else {
// Use morgan for logging to files
    const logdir = './log/';

    if (!fs.existsSync(logdir)){
        fs.mkdirSync(logdir);
    }
// Create a write stream to append to an access.log file
    const accessLog = fs.createWriteStream( logdir+'access.log', { flags: 'a' })
// Set up the access logging middleware
    app.use(morgan('combined', { stream: accessLog }))
}

// Always log to database
app.use((req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        status: res.statusCode,
        referrer: req.headers['referer'],
        useragent: req.headers['user-agent']
    };
    console.log(logdata)
    const stmt = db.prepare('INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referrer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referrer, logdata.useragent)
    //console.log(info)
    next();
})

// Serve static HTML files
app.use(express.static('./public'));

// Add cors dependency
const cors = require('cors')
// Set up cors middleware on all endpoints
app.use(cors())




// app endpoint
app.get("/app/", (req, res) => {
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.writeHead(res.statusCode, {'Content-Type': 'text/plain'})
    res.end(res.statusCode + ' ' + res.statusMessage);
});

// works
app.get('/app/flip/', (req, res) => {
    res.status(200).json({ 'flip': coinFlip()})
}) 
  
app.post('/app/flip/coins/', (req, res, next) => {
    const flips = coinFlips(req.body.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
})


app.get('/app/flips/:number', (req, res, next) => {
    const flips = coinFlips(req.params.number)
    const count = countFlips(flips)
    res.status(200).json({"raw":flips,"summary":count})
});


app.post('/app/flip/call/', (req, res, next) => {
    const game = flipACoin(req.body.guess)
    res.status(200).json(game)
})


app.get('/app/flip/call/:guess(heads|tails)/', (req, res, next) => {
    const game = flipACoin(req.params.guess)
    res.status(200).json(game)
})

if (args.debug || args.d) {
    app.get('/app/log/access/', (req, res, next) => {
        const stmt = logdb.prepare("SELECT * FROM accesslog").all();
	    res.status(200).json(stmt);
    })

    app.get('/app/error/', (req, res, next) => {
        throw new Error('Error test works.')
    })
}

// Default response for any other request
app.use(function(req, res){
    res.json({"message":"Endpoint not found. (404)"});
    res.status(404);
});

// Start server
const server = app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

process.on('SIGTERM', () => {
    server.close(() => {
		console.log('Server stopped.');
	});
});

   

