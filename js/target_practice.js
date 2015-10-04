var canvasX = 400;
var canvasY = 600;
var vel_hist_deque = new Deque();
var bullet_hole_x = new Deque();
var bullet_hole_y = new Deque();
var sight;
var time = Date.now();
var numBulletHoles = 0;

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
            }
        }
        avg_vel /= vel_hist_deque.length / 2;

        if (bullet_hole_x.length >= 5) {
            bullet_hole_x.shift();
            bullet_hole_y.shift();
        }
        bullet_hole_x.push(sight.getX());
        bullet_hole_y.push(sight.getY());

        var newTime = Date.now();
        if (newTime - time > 500 && max_vel <= 30 && avg_vel > 100) {
            time = newTime;

            var img = document.createElement('img');
            img.src = 'img/bullet_hole.png';
            img.style.position = 'absolute';
            img.style.left = bullet_hole_x.get(0);
            img.style.top = bullet_hole_y.get(0);

            console.log(bullet_hole_x.get(0) + " " + bullet_hole_y.get(0));

            img.onload = function() {
                document.body.appendChild(img);
            }

            console.log("Fired!");
        }
    }
}).use('screenPosition', {
    scale: 0.5
});

var Sight = function() {
    var sight = this;
    var img = document.createElement('img');
    img.src = 'img/gun_sight.png';
    img.style.position = 'absolute';

    img.onload = function() {
        sight.setTransform([window.innerWidth / 2, window.innerHeight / 2], 0);
        document.body.appendChild(img);
    }

    sight.setTransform = function(position, direction) {
        var newX = position[0] - img.width / 2 + (direction[0] * 1000) + 'px';
        var newY = position[1] - img.height / 2 + (-direction[1] * 1000) + 'px';

        img.style.left = newX;
        img.style.top = newY;
    };

    sight.getX = function() {
        return img.style.left;
    }

    sight.getY = function() {
        return img.style.top;
    }
};

function average(arr) {
    var avg = 0;
    for (var j = 0; j < arr.length; j++) {
        avg += arr[j];
    }
    avg /= arr.length;
    return avg;
}

sight = new Sight();
