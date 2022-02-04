class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(point) {
        return (
            point.position.x >= this.x - this.w &&
            point.position.x < this.x + this.w &&
            point.position.y >= this.y - this.h &&
            point.position.y < this.y + this.h
        );
    }

    intersects(range) {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.divided = false;
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;
        let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        this.upperRight = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
        this.upperLeft = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        this.bottomRight = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        this.bottomLeft = new QuadTree(sw, this.capacity);
        this.divided = true;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.divided) {
                this.subdivide();
            }
            if (this.upperRight.insert(point)) {
                return true;
            } else if (this.upperLeft.insert(point)) {
                return true;
            } else if (this.bottomRight.insert(point)) {
                return true;
            } else if (this.bottomLeft.insert(point)) {
                return true;
            }
        }
    }

    query(range, found) {
        if (!found) {
            found = [];
        }
        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p);
                }
            }
            if (this.divided) {
                this.upperLeft.query(range, found);
                this.upperRight.query(range, found);
                this.bottomLeft.query(range, found);
                this.bottomRight.query(range, found);
            }
        }
        return found;
    }

    show() {
        stroke(255);
        noFill();
        strokeWeight(1);
        rectMode(CENTER);
        rect(
            this.boundary.x,
            this.boundary.y,
            this.boundary.w * 2,
            this.boundary.h * 2
        );
        for (let p of this.points) {
            strokeWeight(2);
            point(p.position.x, p.position.y);
        }

        if (this.divided) {
            this.upperRight.show();
            this.upperLeft.show();
            this.bottomRight.show();
            this.bottomLeft.show();
        }
    }
}