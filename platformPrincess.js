import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("water.png", 500);

class wall extends Sprite {
    constructor(){
        super();
        this.name = "wall";
        this.setImage("wall.png");
        this.x = 0;
        this.y = 175;
        this.accelerateOnBounce = false;
    }
}
