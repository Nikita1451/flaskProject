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
var img_corp;
var img_shassi;
var img_corp_none;
var img_shassi_none;
var isDraggingImage1 = false;
var is1Complete = false;
var isDraggingImage2 = false;
var is2Complete = false;
var img_wheel;
var img_wheel_none;
var isDraggingImage3;
var is3Complete;
var video;
var flag_of = false;
var put_on = false;

function preload() {
    this.load.image('corp', '/static/img/ltz/Кузов.png');
    this.load.image('shassi', '/static/img/ltz/шасси.png');
    this.load.image("shassi_none", '/static/img/ltz/шасси_тень.png')
    this.load.image("corp_none", '/static/img/ltz/Кузов_тень.png')
    this.load.image("background", '/static/img/ltz/фон.png')
    this.load.audio("set_us", '/static/img/ltz/sound_set.mp3');
    this.load.image("wheel", '/static/img/ltz/колёсные_пары.png');
    this.load.image("wheel_none", '/static/img/ltz/колёсные_пары_тень.png');
    this.load.image("box1", '/static/img/ltz/box.png');
    this.load.image("box2", '/static/img/ltz/box.png');
    this.load.image("box3", '/static/img/ltz/box.png');
    this.load.video("Run_out", '/static/movie/TPL.mp4');
}

function create() {
    var background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.displayWidth = this.sys.game.config.width;
    background.displayHeight = this.sys.game.config.height;
    var sound = this.sound.add("set_us")
    this.add.image(300* coeff, 200* coeff, "box1").setScale(2.1 * coeff);
    this.add.image(2560 / 2 * coeff, 200* coeff, "box2").setScale(2.1* coeff);
    this.add.image((2560 - 300) * coeff, 200* coeff, "box3").setScale(2.1* coeff);
    img_corp = this.add.image(300* coeff, 100* coeff, 'corp').setScale(0.35* coeff).setInteractive();
    img_corp_none = this.add.image(1200* coeff, 968* coeff, "corp_none").setScale(1 * coeff).setInteractive();
    img_shassi_none = this.add.image(1200* coeff, 968 * coeff, "shassi_none").setScale(1 * coeff).setInteractive();
    img_shassi = this.add.image(2560/2* coeff, 100* coeff, 'shassi').setScale(0.35* coeff).setInteractive();
    img_wheel = this.add.image((2560 - 300)* coeff, 100* coeff, "wheel").setScale(0.35* coeff).setInteractive();
    img_wheel_none = this.add.image(1200* coeff, 968* coeff, 'wheel_none').setScale(1 * coeff).setInteractive();
    video = this.add.video(2560 / 2* coeff, 1440/2* coeff, "Run_out");
    video.setScale(2560 / video.width * coeff, 1440 / video.height * coeff);
    video.setVisible(false);

     video.on('complete', function () {
        console.log("Видео закончилось");
        // Выполнение действий или переходы здесь
        window.location.replace("https://yandex.ru");
    });

    img_corp.on('pointerdown', function(pointer) {
    if (items == 2){
            isDraggingImage1 = true;
            put_on = true;}
    });

    img_shassi.on('pointerdown', function(pointer) {
    if (items == 1){
            isDraggingImage2 = true;
            put_on = true;}
    });

    img_wheel.on('pointerdown', function(pointer) {
    if (items == 0){
            isDraggingImage3 = true;}
    });

    this.input.on('pointerup', function(pointer) {
        if (isDraggingImage1 && is1Complete) {
            isDraggingImage1 = false;
            img_corp.x = 1200* coeff;
            img_corp.y = 968* coeff;
            img_corp.setScale(1* coeff);
            img_corp_none.setVisible(false);
            // Запуск звука
            sound.play();
            items++;
        }
        else { isDraggingImage1 = false};
        if (isDraggingImage2 && is2Complete) {
            isDraggingImage2 = false;
            img_shassi.x = 1200* coeff;
            img_shassi.y = 968* coeff;
            img_shassi.setScale(1* coeff);
            img_shassi_none.setVisible(false);
            sound.play();
            // Запуск звука
            items ++;
        }
        else {isDraggingImage2 = false;};
        if (isDraggingImage3 && is3Complete){
            isDraggingImage3 = false;
            img_wheel.x = 1200* coeff;
            img_wheel.y = 968* coeff;
            img_wheel.setScale(1* coeff);
            img_wheel_none.setVisible(false);
            sound.play();
            // Запуск звука
            items ++;
        }
        else {isDraggingImage3 = false;};
    });
}

function update() {
    if (isDraggingImage1) {
        img_corp.x = this.input.activePointer.x;
        img_corp.y = this.input.activePointer.y;
        if (checkOverlap(img_corp, img_corp_none) && items == 2) {
            img_corp_none.setVisible(false);
            is1Complete = true;
            console.log("Пересечение обнаружено");
        } else {
            is1Complete = false;
            img_corp_none.setVisible(true);
        }
    }
    if (isDraggingImage2) {
        img_shassi.x = this.input.activePointer.x;
        img_shassi.y = this.input.activePointer.y;
        if (checkOverlap(img_shassi, img_shassi_none)  && items == 1) {
            img_shassi_none.setVisible(false);
            is2Complete = true;
            console.log("Пересечение обнаружено");
        } else {
            is2Complete = false;
            img_shassi_none.setVisible(true);
        }
    };
    if (isDraggingImage3) {
        img_wheel.x = this.input.activePointer.x;
        img_wheel.y = this.input.activePointer.y;
        if (checkOverlap(img_wheel, img_wheel_none) && items == 0) {
            img_wheel_none.setVisible(false);
            is3Complete = true;
            console.log("Пересечение обнаружено");
        } else {
            is3Complete = false;
            img_wheel_none.setVisible(true);
        }
    }
    if (items == 3 && flag_of == false){
        video.setVisible(true);
         flag_of = true;
        video.play(true);
        setTimeout(function() {
            video.stop("");
            window.location.replace("http://127.0.0.1:5000/add_score/1");
}, 12000);
    }
}


function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Geom.Rectangle.Intersection(boundsA, boundsB).width > 0;
}