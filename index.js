var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    socket.on('sight position', function(msg) {
        io.emit('sight position', msg);
    });
    // console.log('a user connected');
    // socket.on('disconnect', function(){
    //   console.log('user disconnected');
    // });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
