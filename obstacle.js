class Obstacle {
    constructor(x, y, r) {
        this.position = createVector(x, y);
        this.r = r;
        this.index = obstacles.length + 1;
    }

    intersect(bx, by, br) {
        return (Math.sqrt(((this.position.x - bx) * (this.position.x - bx)) +
            ((this.position.y - by) * (this.position.y - by))) < (this.r + br));
    }

    show() {
        push();
        stroke(0);
        fill('purple');
        circle(this.position.x, this.position.y, this.r);
        pop();
    }
}