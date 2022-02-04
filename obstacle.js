class Obstacle {
    constructor(x, y, r) {
        this.position = createVector(x, y);
        this.r = r;
        this.index = obstacles.length + 1;
    }

    show() {
        push();
        stroke(0);
        fill('brown');
        circle(this.position.x, this.position.y, this.r);
        pop();
    }
}