class Food {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.r = 10;
        // this.nutritionValue = random(-10, 10);
        if (random(0, 1) < 0.7) {
            this.nutritionValue = 10;
            this.foodType = "food"
        } else {
            this.nutritionValue = -10;
            this.foodType = "poison";
        }
    }

    intersect(bx, by, br) {
        return (Math.sqrt(((this.position.x - bx) * (this.position.x - bx)) +
            ((this.position.y - by) * (this.position.y - by))) - (this.r + br));
    }

    live() {
        if (frameCount % 1000 == 0) {
            if (this.foodType == "food") {
                let i = food.indexOf(this);
                food.splice(i, 1);
            }
            if (this.foodType == "poison") {
                let i = poison.indexOf(this);
                poison.splice(i, 1);
            }
        }
    }

    show() {
        let gr = color(0, 255, 0);
        let rd = color(255, 0, 0);
        let netCol = lerpColor(rd, gr, (this.nutritionValue + 10) / 20);
        push();
        stroke(0);
        fill(netCol);
        circle(this.position.x, this.position.y, this.r);
        pop();
    }
}