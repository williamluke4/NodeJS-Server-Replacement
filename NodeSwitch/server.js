'use strict';

var Promise = global.Promise || require('promise');

var express = require('express'),
    exphbs  = require('./index.js'), // "express-handlebars"
    helpers = require('./lib/helpers'),
    socket  = require('socket.io'),
    exec = require('child_process');
    //fs = require('fs'), 

//hack to make handlebar look back on father path
//fs.exists('views/', function(exists){
    //if( !exists ) fs.symlinkSync('../views', 'views', 'dir');
//});

//Done^^
var app = express();

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : helpers,

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'shared/templates/',
        'views/partials/'
    ]
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var port = 3700;

//app.enable('view cache');
// Middleware to expose the app's shared templates to the cliet-side of the app
// for pages which need them.
function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    hbs.getTemplates('shared/templates/', {
        cache      : app.enabled('view cache'),
        precompiled: true
    }).then(function (templates) {
        // RegExp to remove the ".handlebars" extension from the template names.
        var extRegex = new RegExp(hbs.extname + '$');

        // Creates an array of templates which are exposed via
        // `res.locals.templates`.
        templates = Object.keys(templates).map(function (name) {
            return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
            };
        });

        // Exposes the templates during view rendering.
        if (templates.length) {
            res.locals.templates = templates;
        }

        setImmediate(next);
    })
    .catch(next);
}





app.get('/', function (req, res) {
    res.render('home', {
        title: 'Home'
    });
});

app.get('/yell', function (req, res) {
    res.render('yell', {
        title: 'Remote',

        // This `message` will be transformed by our `yell()` helper.
        message: 'hello world'
    });
});

app.get('/exclaim', function (req, res) {
    res.render('yell', {
        title  : 'Exclaim',
        message: 'hello world',

        // This overrides _only_ the default `yell()` helper.
        helpers: {
            yell: function (msg) {
                return (msg + '!!!');
            }
        }
    });
});

app.get('/echo/', function (req, res) {
    res.render('echo', {
        title  : 'Handle',
	});
});

app.use(express.static('public/'));

function sendMessage(message, socket, elementID){
    exec.execFile('../remote',
                ['-m', message],
                function (error, stdout, stderr) {
                    console.log("The message is: " + message);
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if( stdout.indexOf("RECIVED:") > -1 ){
                        var state = stdout.split('RECIVED: ')[1].split('.')[0];
                        console.log("Sending Message Back To Client");
                        socket.emit(
                            "callbackButton", 
                            { 
                                message: "received", 
                                operation: message,
                                state: state,
                                switchID: elementID

                            });
                    }
                    
                    else if(stdout.indexOf("NO REPLY") > -1) {
                        console.log('NO REPLY');
                    
                        socket.emit(
                            "failed", 
                            { 
                                switchID: elementID
                            });
                    
                    }

                    if (error !== null) {
                        console.log('exec error: ' + error);
                    
                        socket.emit(
                            "callbackError", 
                            { 
                                error: error 

                            });
                    
                    }

                    
                });
}






var io = socket.listen(app.listen(port));
io.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {

        sendMessage(data.message, socket, data.switchID);

    });
});
console.log("-----------------------------");
console.log("Sterver Started Port: " + port);
console.log("-----------------------------");

