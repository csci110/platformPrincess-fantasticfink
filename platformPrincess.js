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
        this.setImage();
    }
}

class Platform extends Support{
    constructor(x, y, image){
        super();
        this.name = "A platform";
        this.accelerateOnBounce = false;
    }
}

new Platform (0, 400, "start.png");
new Platform (game.displayWidth - 48 * 2, 400, "finish.png");