(function () {

    var debug = false;

    function debugPrint(msg){
        if(debug){
            print(msg);
        }
    }

    var collisionTimeout = false;
    var _entityID;
    var SCRIPT_INTERVAL;
    var GRAVITY = {x: 0, y: -7, z: 0};

    this.collisionWithEntity = function (myID, otherID, collisionInfo) {
        debugPrint("PINGFSADFSFDSFASD");
        debugPrint(JSON.stringify(collisionInfo));
        bounce(collisionInfo);
    };

    function addParts(vec) {
        var v;
        v = Math.abs(vec.x) + Math.abs(vec.y) + Math.abs(vec.z);
        return v;
    }

    var lastBouncePosition = {x:0,y:0,z:0};

    function bounce(collisionInfo) {
        debugPrint("Pass0");
        if ((addParts(collisionInfo.velocityChange)) > 1) {
            var entProps = Entities.getEntityProperties(_entityID, ["position", "velocity"]);
            debugPrint("dist "+JSON.stringify(Vec3.distance(lastBouncePosition, entProps.position)));
            if (!collisionTimeout && Vec3.distance(lastBouncePosition, entProps.position) > 0.1) {
                var vel = {x: 0, y: 0, z: 0};
                debugPrint("Pass1");

                entProps.velocity = Vec3.sum(entProps.velocity, collisionInfo.velocityChange);
                //debugPrint((Math.abs(entProps.velocity.x) + Math.abs(entProps.velocity.y) + Math.abs(entProps.velocity.z)));
                if ((Math.abs(entProps.velocity.x) + Math.abs(entProps.velocity.y) + Math.abs(entProps.velocity.z)) > 0.1) {
                    debugPrint("Pass2");
                    var dir = Vec3.normalize(Vec3.subtract(collisionInfo.contactPoint, entProps.position));
                    debugPrint("dir " + JSON.stringify(dir));
                    if (Vec3.length(dir) < 0.1) {
                        dir = {x: 0, y: -1, z: 0};
                    }
                    var pickRay = {
                        origin: entProps.position,
                        direction: dir
                    };
                    var intersection = Entities.findRayIntersection(pickRay, true, [], [_entityID]);
                    if (intersection.intersects) {
                        debugPrint("Pass3");
                        debugPrint("Distance " + intersection.distance);
                        debugPrint("Intersection! " + JSON.stringify(intersection));
                        debugPrint("Ping! " + JSON.stringify(entProps.velocity));
                        var reflect = Vec3.reflect(pickRay.direction, intersection.surfaceNormal);
                        vel = Vec3.multiply(-1.1, Vec3.multiplyVbyV(reflect, entProps.velocity));
                        Vec3.debugPrint("reflect", reflect);
                        debugPrint("Ping2! " + JSON.stringify(vel));

                        Entities.editEntity(_entityID, {velocity: vel});

                        lastBouncePosition = entProps.position;

                        //rezSlaveAndSwitch(vel);
                        /*
                        var allProps = Entities.getEntityProperties(_entityID);
                        allProps.velocity = vel;
                        Entities.addEntity(allProps, true);
                        Entities.deleteEntity(_entityID);*/
                        collisionTimeout = true;
                        Script.setTimeout(function () {
                            collisionTimeout = false;
                            //Entities.editEntity(_entityID, {gravity: GRAVITY});
                        }, 300);
                    }
                }
            }

        }

        function update(delta) {
            if (!collisionTimeout) {
                var vel = {x: 0, y: 0, z: 0};

                var entProps = Entities.getEntityProperties(_entityID, ["position", "velocity"]);
                //debugPrint((Math.abs(entProps.velocity.x) + Math.abs(entProps.velocity.y) + Math.abs(entProps.velocity.z)));
                if ((Math.abs(entProps.velocity.x) + Math.abs(entProps.velocity.y) + Math.abs(entProps.velocity.z)) > 0.1) {
                    var dir = Vec3.normalize(entProps.velocity);
                    if (Vec3.length(dir) < 0.1) {
                        dir = {x: 0, y: -1, z: 0};
                    }
                    var pickRay = {
                        origin: entProps.position,
                        direction:
                        dir
                    };
                    var intersection = Entities.findRayIntersection(pickRay, true, [], [_entityID]);
                    if (intersection.intersects && intersection.distance < 0.5) {
                        debugPrint("Distance " + intersection.distance);
                        debugPrint("Intersection! " + JSON.stringify(intersection));
                        debugPrint("Ping! " + JSON.stringify(entProps.velocity));
                        var reflect = Vec3.reflect(pickRay.direction, intersection.surfaceNormal);
                        vel = Vec3.multiply(1.1, Vec3.multiplyVbyV(reflect, entProps.velocity));
                        Vec3.debugPrint("reflect", reflect);
                        debugPrint("Ping2! " + JSON.stringify(vel));

                        Entities.editEntity(_entityID, {velocity: vel});

                        //rezSlaveAndSwitch(vel);
                        /*
                        var allProps = Entities.getEntityProperties(_entityID);
                        allProps.velocity = vel;
                        Entities.addEntity(allProps, true);
                        Entities.deleteEntity(_entityID);*/
                        collisionTimeout = true;
                        Script.setTimeout(function () {
                            collisionTimeout = false;
                            //Entities.editEntity(_entityID, {gravity: GRAVITY});
                        }, 100);
                    }
                }
            }
        }
    }

    this.unload = function (entityID) {
        Script.clearInterval(SCRIPT_INTERVAL);
    }

    this.preload = function (entityID) {
        this.entityID = entityID;
        _entityID = entityID;
        Entities.editEntity(this.entityID, {
            name: "FloofTest",
            dimensions: {x: 0.5, y: 0.5, z: 0.5},
            density: 100,
            dynamic: true,
            collisionless: false,
            restitution: 1000,
            gravity: GRAVITY,
            lifetime: 360
        });
        //SCRIPT_INTERVAL = Script.setInterval(update, 10);
        //rezSlaveAndSwitch({});
    }


})

//file:///D:\High Fidelity\superBall_Entity.js


