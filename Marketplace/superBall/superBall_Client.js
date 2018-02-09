// copyright 2018
// Fluffy Jenkins

var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
var isActive = false;

var appIconActive = Script.resolvePath("iconBlack.svg");
var appIconInactive = Script.resolvePath("iconWhite.svg");

var _entityID;

var MODEL_URL = Script.resolvePath("superBall.fbx");
var GRAVITY = {x: 0, y: -7, z: 0};
var BALL_SIZE = {x: 0.25, y: 0.25, z: 0.25};
var DENSITY = 100;

var SCRIPT_URL = Script.resolvePath("superBall_Entity.js?");

var positionOffset = -0.5;

function activateFunction() {

    var position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(Quat.cancelOutRollAndPitch(Camera.orientation), {z: positionOffset}));
    _entityID = Entities.addEntity({
        type: "Model",
        modelURL: MODEL_URL,
        name: "SuperBall",
        dimensions: BALL_SIZE,
        density: DENSITY,
        dynamic: true,
        position: position,
        script: SCRIPT_URL,
        collisionless: true,
        shapeType: "simple-hull",
        restitution: 1,
        gravity: {x: 0, y: 0, z: 0}
    });
}

function deactivateFunction() {
    Entities.deleteEntity(_entityID);
}


var toggle = function () {
    isActive = !isActive;
    activeButton.editProperties({isActive: isActive});
    if (isActive) {
        activateFunction();
    } else {
        deactivateFunction();
    }
};

var activeButton = tablet.addButton({
    icon: appIconInactive,
    activeIcon: appIconActive,
    text: "SUPERBALL",
    isActive: false,
    sortOrder: 10
});

Script.scriptEnding.connect(function () {
    activeButton.clicked.disconnect(toggle);
    tablet.removeButton(activeButton);
    deactivateFunction();
});

activeButton.clicked.connect(toggle);
