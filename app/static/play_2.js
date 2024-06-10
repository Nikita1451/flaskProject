var width_e = window.innerWidth * window.devicePixelRatio;
var height_e = window.innerHeight * window.devicePixelRatio
var coeff = width_e / 2560;

var config = {
    type: Phaser.CANVAS,
    width: width_e, // Adjust width based on device resolution
    height: height_e,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var items = 0;
var img_iron;
var img_karbon;
var img_iron_none;
var img_karbon_none;
var isDraggingImage1 = false;
var is1Complete = false;
var isDraggingImage2 = false;
var is2Complete = false;
var img_karbon2;
var img_karbon2_none;
var isDraggingImage3;
var is3Complete;
var video;
var flag_of = false;
var put_on = false;

function preload() {
    this.load.image('karbon', '/static/img/schz/karbon.png');
    this.load.image('karbon2', '/static/img/schz/karbon.png');
    this.load.image('iron', '/static/img/schz/iron.png');
    this.load.image("background", '/static/img/schz/fon.png')
    this.load.image("anim4", '/static/img/schz/anim4.png');
    this.load.image("anim5", '/static/img/schz/anim5.png');
    this.load.image("box1", '/static/img/schz/blocks.png');
}

function create() {
    var background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;
    this.add.image(250 * coeff, 100 * coeff, "box1").setScale(1.9 * coeff);
    this.add.image(2560 / 2 * coeff, 100 * coeff, "box1").setScale(1.9 * coeff);
    this.add.image((2560 - 300) * coeff, 100 * coeff, "box1").setScale(1.9 * coeff);
    img_iron = this.add.image(250 * coeff, 150 * coeff, 'iron').setScale(0.167 * coeff).setInteractive();
    img_karbon = this.add.image(2560/2* coeff, 120* coeff, 'karbon').setScale(0.2* coeff).setInteractive();
    img_karbon2 = this.add.image((2560 - 300)* coeff, 120* coeff, "karbon2").setScale(0.2* coeff).setInteractive();
    img_kettle = this.add.image(2560/2* coeff, 800 * coeff, 'anim4').setScale(3 * coeff).setInteractive();
    img_kettle2 = this.add.image(2560/2* coeff, 800 * coeff, 'anim5').setScale(3 * coeff).setInteractive();
    img_kettle2.setVisible(false)

    img_iron.on('pointerdown', function(pointer) {
    if (items == 2){
            isDraggingImage1 = true;
            put_on = true;}
    });

    img_karbon.on('pointerdown', function(pointer) {
    if (items == 1){
            isDraggingImage2 = true;
            put_on = true;}
    });

    img_karbon2.on('pointerdown', function(pointer) {
    if (items == 0){
            isDraggingImage3 = true;}
    });

    this.input.on('pointerup', function(pointer) {
        if (isDraggingImage1 && is1Complete) {
            isDraggingImage1 = false;
            img_iron.x = 2560/2* coeff;
            img_iron.y = 800 * coeff;
            img_iron.setScale(0.2* coeff);
            items++;
        }
        else { isDraggingImage1 = false};
        if (isDraggingImage2 && is2Complete) {
            isDraggingImage2 = false;
            img_karbon.x = 2560/2* coeff;
            img_karbon.y = 800 * coeff;
            img_karbon.setScale(0.2* coeff);
            items++;
        }
        else {isDraggingImage2 = false;};
        if (isDraggingImage3 && is3Complete){
            isDraggingImage3 = false;
            img_karbon2.x = 2560/2* coeff;
            img_karbon2.y =  800 * coeff;
            img_karbon2.setScale(0.2* coeff);
            console.log(items);
            items++;
            console.log(items);

        }
        else {isDraggingImage3 = false;};
    });
}
function update() {
    if (isDraggingImage1) {
        img_iron.x = this.input.activePointer.x;
        img_iron.y = this.input.activePointer.y;
        if (checkOverlap(img_iron, img_kettle) && items == 2) {
            is1Complete = true;
            console.log("Пересечение обнаружено");
        } else {
            is1Complete = false;
        }
    }
    if (isDraggingImage2) {
        img_karbon.x = this.input.activePointer.x;
        img_karbon.y = this.input.activePointer.y;
        if (checkOverlap(img_karbon, img_kettle)  && items == 1) {
            is2Complete = true;
            console.log("Пересечение обнаружено");
        } else {
            is2Complete = false;
        }
    };
    if (isDraggingImage3) {
        img_karbon2.x = this.input.activePointer.x;
        img_karbon2.y = this.input.activePointer.y;
        if (checkOverlap(img_karbon2, img_kettle) && items == 0) {
            is3Complete = true;
            console.log("Пересечение обнаружено");
        } else {
            is3Complete = false;
        }
    }
    if (items == 3) {
        setTimeout(function() {
            img_kettle.setVisible(false);
            img_kettle2.setVisible(true);
        },6000);


    }
    if (items == 3 && flag_of == true){
        setTimeout(function() {
            window.location.replace("http://127.0.0.1:5000/add_score/1");
        }, 12000);
    }
}
function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Geom.Rectangle.Intersection(boundsA, boundsB).width > 0;
}