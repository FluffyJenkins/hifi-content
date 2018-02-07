// copyright 2018
// Fluffy Jenkins

(function () {

    var _entityID;
    var VELOCITY_MULTIPLIER = 1.4;
    var VELOCITY_LIMITER_MAX = 11;
    var VELOCITY_LIMITER_MIN = 2;
    var BOUNCE_DELAY = 10;
    var SOUND_URL = Script.resolvePath("Boing.wav");
    var SOUND_VOLUME = 0.03;
    var soundURL = SoundCache.getSound(SOUND_URL);
    var GRAVITY = {x: 0, y: -7, z: 0};
    var injector = null;
    var timeout = 10 * 1000;
    var _timeout = "";
    var positionOffset = -0.75;

    this.preload = function (entityID) {
        _entityID = entityID;
        Entities.editEntity(_entityID, {
            gravity: {x: 0, y: 0, z: 0}
        });
    };

    this.collisionWithEntity = function (myID, otherID, collisionInfo) {
        bounce(collisionInfo);
    };

    this.releaseGrab = function (entityID, args) {
        Entities.editEntity(_entityID, {gravity: GRAVITY, collisionless: false});
        if (_timeout != "") {
            Script.clearTimeout(_timeout);
        }
        _timeout = Script.setTimeout(returnToAvatar, timeout);
    };


    function playSound() {
        if (!injector) {
            var entProps = Entities.getEntityProperties(_entityID, ["position"]);
            injector = Audio.playSound(soundURL, {position: entProps.position, volume: SOUND_VOLUME});
        }
        else {
            injector.stop();
            injector.restart();
        }
    }

    function returnToAvatar() {
        _timeout = "";
        var position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(Quat.cancelOutRollAndPitch(Camera.orientation), {z: positionOffset}));
        Entities.editEntity(_entityID, {
            gravity: {x: 0, y: 0, z: 0},
            velocity: {x: 0, y: 0, z: 0},
            dynamic: false,
            collisionless: true,
            position: position
        });
        Script.setTimeout(function () {
            Entities.editEntity(_entityID, {
                dynamic: true,
                velocity: {x: 0, y: 0, z: 0}
            });
        }, BOUNCE_DELAY);
    }

    function bounce(collisionInfo) {
        if (Vec3.length(Entities.getEntityProperties(_entityID, ["velocity"]).velocity) > VELOCITY_LIMITER_MIN) {
            playSound();
        }
        Script.setTimeout(function () {
            var velocity = Entities.getEntityProperties(_entityID, ["velocity"]).velocity;
            if (Vec3.length(velocity) < VELOCITY_LIMITER_MAX && Vec3.length(velocity) > VELOCITY_LIMITER_MIN) {
                Entities.editEntity(_entityID, {velocity: Vec3.multiply(VELOCITY_MULTIPLIER, velocity)});
            }
        }, BOUNCE_DELAY);
    }
});
