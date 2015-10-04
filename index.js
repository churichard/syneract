var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/'));
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    socket.on('sight pos', function(pos) {
        io.emit('sight pos', pos);
    });

    socket.on('enemies', function() {
        // Add enemies
        var enemy = new Enemy();
        io.emit('enemies', [enemy.getX(), enemy.getY()]);
    });
    // console.log('a user connected');
    // socket.on('disconnect', function(){
    //   console.log('user disconnected');
    // });
});

// io.on('connection', function(socket) {

// });

http.listen(3000, function() {
    console.log('listening on *:3000');
});

var Enemy = function() {
    var enemy = this;
    var width;
    var height;
    var x;
    var y;
    var img;

    enemy.show = function() {
        img = document.createElement('img');
        if (Math.random() < 0.5) {
            img.src = 'img/zombie.png';
        } else {
            img.src = 'img/zombie2.png';
        }
        img.style.position = 'absolute';

        x = (window.innerWidth - img.width) * Math.random();
        y = (window.innerHeight - img.height) * Math.random();

        img.style.left = x + "px";
        img.style.top = y + "px";

        img.onload = function() {
            document.body.appendChild(img);
            width = img.width;
            height = img.height;
        }
    }

    enemy.getImg = function() {
        return img;
    }

    enemy.getWidth = function() {
        return width;
    }

    enemy.getHeight = function() {
        return height;
    }

    enemy.getX = function() {
        return x;
    }

    enemy.getY = function() {
        return y;
    }
}
