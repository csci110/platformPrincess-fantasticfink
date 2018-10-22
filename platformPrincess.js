import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("water.png", 500, 0);

class wall extends Sprite {
    constructor() {
        super();
        this.name = "wall";
        this.setImage("wall.png");
        this.x = 0;
        this.y = 175;
        this.accelerateOnBounce = false;
    }
}

class Support extends Sprite {
    constructor(x, y, image) {
        super();
        this.x = x;
        this.y = y;
        this.setImage(image);
    }
}

class Platform extends Support {
    constructor(x, y, image) {
        super(x, y, image);
        this.name = "A platform";
        this.accelerateOnBounce = false;
    }
}

new wall();
let startPlatform = new Platform(0, 400, "start.png");
let finishPlatform = new Platform(game.displayWidth - 48 * 2, 400, "finish.png");

class Slider extends Support {
    constructor(x, y, angle) {
        super(x, y, "slider.png");
        this.name = "A sliding support";
        this.angle = angle;
        this.speed = 48;
    }
}

new Slider(startPlatform.x + 48 * 3, startPlatform.y + 48, 0);
new Slider(finishPlatform.x - 48 * 5, finishPlatform.y + 48, 180);

class Princess extends Sprite {
    constructor() {
        super();
        this.setImage("ann.png");
        this.x = 48;
        this.y = 300;
        this.speed = 0;
        this.speedWhenWalking = 125;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.isFalling = false;
    }

    handleLeftArrowKey() {
        this.angle = 180;
        this.speed = this.speedWhenWalking;
    }

    handleRightArrowKey() {
        this.angle = 0;
        this.speed = this.speedWhenWalking;
    }

    handleSpacebar() {
        if (!this.isFalling) {
            this.y = this.y - 1.25 * this.height; // jump
        }
    }

    handleGameLoop() {

        if (this.angle === 0 && this.speed > 0) {
            this.playAnimation("right");
        }

        if (this.angle === 180 && this.speed > 0) {
            this.playAnimation("left");
        }
        this.x = Math.max(5, this.x);

        this.isFalling = false; // assume she is not falling unless proven otherwise
        // Check directly below princess for supports
        let supports = game.getSpritesOverlapping(this.x, this.y + this.height, this.width, 1, Support);
        // Is there none, or is its *top* above the bottom of the princess?
        if (supports.length === 0 || supports[0].y < this.y + this.height) {
            this.isFalling = true; // she is falling so ...
            this.y = this.y + 4; // simulate gravity
        }
    }

    handleBoundaryContact() {
        game.end("Princess Ann has drowned.\n\nBetter luck next time.");
    }
}

class Door extends Sprite {
    constructor() {
        super();
        this.setImage("door.png");
        this.x = game.displayWidth - 48;
        this.y = finishPlatform.y - 2 * 48;
        this.accelerateOnBounce = false;
    }

    handleCollision(otherSprite) {
        if (otherSprite === ann) {
            game.end("Congratulations!\n\nPrincess Ann can now pursue the" +
                "\nstranger deeper into the castle!");
        }
    }
}

let ann = new Princess();
let exit = new Door();
exit.name = "The Exit Door";

class Spider extends Sprite {
    constructor(x, y) {
        super(x, y);
        this.name = "Spooder";
        this.setImage("spider.png");
        this.x = x;
        this.y = y;
        this.speed = 48;
        this.accelerateOnBounce = false;
        this.defineAnimation("creep", 0, 2);
        this.playAnimation("creep", true);
    }

    handleGameLoop() {
        if (this.y >= ann.y) {
            this.angle = 90;
        }

        if (this.y <= ann.y - 48) {
            this.angle = 270;
        }
    }

    handleCollision(otherSprite) {
        // Spiders only care about collisons with Ann.
        if (otherSprite === ann) {
            // Spiders must hit Ann on top of her head.
            let horizontalOffset = this.x - otherSprite.x;
            let verticalOffset = this.y - otherSprite.y;
            if (Math.abs(horizontalOffset) < this.width / 2 &&
                Math.abs(verticalOffset) < 30) {
                otherSprite.y = otherSprite.y + 1; // knock Ann off platform
            }
        }
        return false;
    }
}
new Spider(200, 225);
new Spider(550, 200);

class Bat extends Sprite {
    constructor(x, y, image) {
        super(x, y, image);
        this.setImage("bat.png");
        this.accelerateOnBounce = false;
        this.name = "A scurry bat";
        this.defineAnimation("flap", 0, 1);
        this.playAnimation("flap", true);
        this.attackSpeed = 300;
        this.speed = this.normalSpeed = 20;
        this.angle = 45 + Math.round(Math.random() * 3) * 90;
        this.angleTimer = 0;
        this.x = this.startX = x;
        this.y = this.startY = y;

    }

    attack() {
        this.speed = this.attackSpeed;
        this.aimFor(ann.x, ann.y);

    }

    handleCollision(otherSprite) {
        // Bats only care about collisons with Ann.
        if (otherSprite === ann) {
            ann.y = ann.y + 1;
            // Spiders must hit Ann on top of her head.
            //let horizontalOffset = this.x - otherSprite.x;
            //let verticalOffset = this.y - otherSprite.y;
            //if (Math.abs(horizontalOffset) < this.width / 2 &&
            //Math.abs(verticalOffset) < 30) {
            //otherSprite.y = otherSprite.y + 1; // knock Ann off platform
        }
        return false;
    }

    handleGameLoop() {
        if (Math.Random < 0.001) {
            this.attack();
        }
        //if bat is not attacking: hover

        /*every 3 seconds, increase the angle property of the bat either 
        by 90 degrees or 180 degrees. Whether it changes by 90 or 180 degrees 
        depends on the flip of a coin: 50% of the time it does one 
        rather than the other.*/

    }

    handleBoundaryContact() {
        if (this.y < 0) {
            this.y = 0;
        }
        
        if (this.y > game.displayHeight){
            //reset the bat's position to its starting position
            this.speed = this.normalSpeed;
            this.angle  = 225;
        }
    }
}

let leftBat = new Bat(200, 100);
let rightBat = new Bat(500, 75);
