var sight;

Leap.loop(function(frame) {
    var hands = frame.hands;
    if (hands.length != 0) {
        hands[0].fingers.forEach(function(finger, index, arr) {
            if (finger.type == 1) {
                sight.setTransform(hands[0].screenPosition(), finger.direction);
            }
        });
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
        var newX = position[0] - img.width / 2;
        var newY = position[1] - img.height / 2;

        img.style.left = newX + (direction[0] * 1000) + 'px';
        img.style.top = newY + (-direction[1] * 1000) + 'px';
    };
};

sight = new Sight();
