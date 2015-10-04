var sight;
var sight2;
var enemies = [];
var vel_hist_deque = new Deque();
var bullet_hole_x = new Deque();
var bullet_hole_y = new Deque();
var bulletTime = Date.now();
var socket = io();
var enemyX = [];
var enemyY = [];

Leap.loop(function(frame) {
    var hands = frame.hands;
    if (hands.length !== 0) {
        hands[0].fingers.forEach(function(finger, index, arr) {
            if (finger.type === 1) {
                sight.setTransform(hands[0].screenPosition(), finger.direction);

                if (vel_hist_deque.length >= 50) {
                    vel_hist_deque.shift();
                }
                vel_hist_deque.push(finger.tipVelocity);
            }
        });
        var max_vel = 0;
        var avg_vel = 0;
        var abs_avg_vel = 0;
        for (var i = 0; i < vel_hist_deque.length; i++) {
            // Calculate average velocity
            var avg = average(vel_hist_deque.get(i));

            // Set max vel of pre-fire history or average value of y component of vel in post-fire history
            if (i < vel_hist_deque.length / 2) {
                if (avg > max_vel) {
                    max_vel = avg;
                }
            } else {
                avg_vel += vel_hist_deque.get(i)[1];
                abs_avg_vel += Math.abs(vel_hist_deque.get(i)[1]);
            }
        }
        avg_vel /= vel_hist_deque.length / 2;

        if (bullet_hole_x.length >= 20) {
            bullet_hole_x.shift();
            bullet_hole_y.shift();
        }
        bullet_hole_x.push(sight.getX());
        bullet_hole_y.push(sight.getY());

        var newTime = Date.now();
        if (newTime - bulletTime > 1000 && max_vel <= 15 && abs_avg_vel > 5000 && avg_vel > 0) {
            bulletTime = newTime;

            var img = document.createElement('img');
            img.src = 'img/bullet_hole.png';
            img.style.position = 'absolute';
            img.style.left = bullet_hole_x.get(0) + "px";
            img.style.top = bullet_hole_y.get(0) + "px";

            img.onload = function() {
                document.body.appendChild(img);
            }

            for (var i = 0; i < enemies.length; i++) {
                if (bullet_hole_x.get(0) + img.width / 2 >= enemies[i].getX() && bullet_hole_x.get(0) + img.width / 2 <= enemies[i].getX() + enemies[i].getWidth() && bullet_hole_y.get(0) + img.height / 2 >= enemies[i].getY() && bullet_hole_y.get(0) + img.height / 2 <= enemies[i].getY() + enemies[i].getHeight()) {
                    document.body.removeChild(enemies[i].getImg());
                    var gif = document.createElement('img');
                    gif.src = 'img/explosion.gif';
                    gif.style.position = 'absolute';
                    gif.style.left = enemies[i].getX();
                    gif.style.top = enemies[i].getY();
                    gif.onload = function() {
                        document.body.appendChild(gif);
                        setTimeout(function() {
                            document.body.removeChild(gif);
                        }, 800);
                    }
                    enemies.splice(i, 1);
                    break;
                }
            }

            console.log("Fired!");
        }
    }

    socket.emit('sight pos', [sight.getX(), sight.getY()]);
    socket.emit('enemies');
}).use('screenPosition', {
    scale: 0.5
});

socket.on('sight pos', function(position) {
    if (position[0] != sight.getX() && position[1] != sight.getY()) {
        sight2.setPosition(position[0], position[1]);
    }
});

socket.on('enemies', function(enX, enY) {
    // Update enemy x and enemy y arrays
    for (var i = 0; i < enX.length; i++) {
        if (enemyX.indexOf(enX[i]) === -1 && enemyY.indexOf(enY[i]) === -1) {
            enemyX.push(enX[i]);
            enemyY.push(enY[i]);
            var enemy = new Enemy();
            enemy.setX(enX[i]);
            enemy.setY(enY[i]);
            enemy.show();
            enemies.push(enemy);
        }
    }
    for (var i = 0; i < enemyX.length; i++) {
        if (enX.indexOf[enemyX[i]] === -1 && enY.includes[enemyY[i]] === -1) {
            for (var k = 0; k < enemies.length; k++) {
                if (enemies[k].getX() === enemyX[j] && enemies[k].getY() === enemyY[j]) {
                    document.body.removeChild(enemies[k]);
                }
            }
            enemyX.splice(i, 1);
            enemyY.splice(i, 1);
        }
    }
});

var Sight = function() {
    var sight = this;
    var x;
    var y;

    var img = document.createElement('img');
    img.src = 'img/gun_sight.png';
    img.style.position = 'absolute';
    img.style.zIndex = "100";

    img.onload = function() {
        sight.setTransform([window.innerWidth / 2, window.innerHeight / 2], 0);
        document.body.appendChild(img);
    }

    sight.setTransform = function(position, direction) {
        x = position[0] - img.width / 2 + (direction[0] * 1000);
        y = position[1] - img.height / 2 + (-direction[1] * 1000);

        img.style.left = x + "px";
        img.style.top = y + "px";
    };

    sight.setPosition = function(newX, newY) {
        x = newX;
        y = newY;
        img.style.left = x + "px";
        img.style.top = y + "px";
    }

    sight.getX = function() {
        return x;
    }

    sight.getY = function() {
        return y;
    }
}

var Enemy = function() {
    var enemy = this;
    var width;
    var height;
    var img;
    var x;
    var y;

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

    enemy.setX = function(newX) {
        x = newX;
    }

    enemy.setY = function(newY) {
        y = newY;
    }
}

function average(arr) {
    var avg = 0;
    for (var j = 0; j < arr.length; j++) {
        avg += arr[j];
    }
    avg /= arr.length;
    return avg;
}

sight = new Sight();
sight2 = new Sight();
document.body.style.backgroundImage = "url('img/background.png')";
document.body.style.backgroundSize = "100%";
