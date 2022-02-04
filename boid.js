class Boid {
    constructor(x, y) {
        this.index = flock.length + 1;
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 3));
        // this.velocity.setMag(0);
        this.acceleration = createVector();
        this.accFlee = createVector();
        this.maxforce = 0.1;
        this.maxrepulsion = 0.1;
        this.maxSpeed = 1.5;
        this.maxflee = 50;
        // for triangle shaped boids
        this.r = 5;
        this.radians = 0;
        // cover area
        this.area = 30;
        this.obstacleArea = 100;

        // number of frames of avoidance
        this.avoidanceSpan = 10;
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    align(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxforce)
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxforce)
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 30;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxrepulsion)
        }
        return steering;
    }

    flee(ObsInArea) {
        let steering = createVector();
        let pRadii = 50;
        let pAngle = PI / 24;
        let alpha = atan2(this.velocity.y, this.velocity.x);
        let total = 0;
        let mag = 0;
        let x, y, d;
        for (let ob of ObsInArea) {
            for (let theta = -pAngle; theta <= pAngle; theta += pAngle / 10) {
                for (let i = pRadii / 10; i <= pRadii; i += pRadii / 10) {
                    x = ((this.position.x + i * Math.cos(alpha + theta)) - ob.position.x);
                    y = ((this.position.y + i * Math.sin(alpha + theta)) - ob.position.y);

                    d = x * x + y * y - (ob.r) * (ob.r);
                    if (d < 0) {
                        if (theta > 0.02 || theta < -0.02)
                            mag += 1 / (theta * i * this.maxflee);
                        else
                            mag += 1 / (0.03 * i * this.maxflee);
                        total++;
                        break;
                    }

                    // if (this.index == 1 && mag > 0)
                    //     console.log(mag, theta);
                }
            }
        }
        if (total > 0) {
            if (mag > 0)
                steering.sub(sin(alpha), -cos(alpha));
            else {
                steering.sub(-sin(alpha), cos(alpha));
            }
            steering.setMag(mag);
            steering.limit(this.maxflee);
            this.avoidanceSpan = 10;
        }

        return steering;
    }.

    seek(ObsInArea) {
        let steering = createVector();
        let pRadii = 100;
        let pAngle = PI;
        let alpha = atan2(this.velocity.y, this.velocity.x);
        let total = 0;
        let mag = 0;
        let x, y, d;
        let currObs;
        for (let ob of ObsInArea) {
            for (let theta = -pAngle; theta <= pAngle; theta += pAngle / 100) {
                for (let i = pRadii / 10; i <= pRadii; i += pRadii / 10) {
                    x = ((this.position.x + i * Math.cos(alpha + theta)) - ob.position.x);
                    y = ((this.position.y + i * Math.sin(alpha + theta)) - ob.position.y);

                    d = x * x + y * y - (ob.r) * (ob.r);
                    if (d < 0) {
                        if (theta > 0.02 || theta < -0.02)
                            mag += 1 / (theta * i * this.maxflee);
                        else
                            mag += 1 / (0.03 * i * this.maxflee);
                        total++;
                        currObs = ob;
                        break;
                    }

                    // if (this.index == 1 && mag > 0)
                    //     console.log(mag, theta);
                }
            }
        }
        if (total > 0) {
            d = Math.sqrt(((currObs.position.x - this.position.x) * (currObs.position.x - this.position.x)) +
                ((currObs.position.y - this.position.y) * (currObs.position.y - this.position.y))) - (currObs.r + this.r);
            if (d < 0) {
                let i = obstacles.indexOf(currObs);
                obstacles.splice(i, 1);
                this.r += 1;
                totalObs--;
                // console.log(i);
            } else {
                mag *= 20;
                steering.add(currObs.position.x - this.position.x, currObs.position.y - this.position.y);
                steering.setMag(mag);
                steering.limit(this.maxflee);
                this.avoidanceSpan = 10;
            }
        }

        return steering;
    }

    flock(qtBoid, qtObs) {
        // qtBoid.show();
        // qtObs.show();
        if (this.index == 1) {
            stroke(255);
            noFill();
            strokeWeight(1);
            rectMode(CENTER);
            rect(
                this.position.x,
                this.position.y,
                this.area,
                this.area
            );
        }

        let closeArea = new Rectangle(this.position.x, this.position.y, this.area, this.area);
        let boidsInArea = qtBoid.query(closeArea);

        let ObsRange = new Rectangle(this.position.x, this.position.y, this.obstacleArea, this.obstacleArea);
        let obsInArea = qtObs.query(ObsRange);
        // if (this.index == 1)
        //     console.log(boidsInArea.length);
        // qtBoid.query(closeArea);

        let alignment = this.align(boidsInArea);
        let cohesion = this.cohesion(boidsInArea);
        let separation = this.separation(boidsInArea);

        // let avoidance = this.flee(obsInArea);
        let seeking = this.seek(obsInArea);

        // let alignment = this.align(flock);
        // let cohesion = this.cohesion(flock);
        // let separation = this.separation(flock);

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());



        // if (this.avoidanceSpan == 0) {
        this.acceleration = alignment.add(cohesion).add(separation).add(seeking);
        // this.accFlee -= 0.02;
        // } else {
        // this.acceleration.add(avoidance);
        // this.acceleration.add(seeking);
        // this.avoidanceSpan--;
        // }
        // if (this.index == 1)
        //     console.log(this.avoidanceSpan);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        // ellipse(0, 0, 20, 20);
    }

    show() {

        // Triangle Shaped Boid
        push();
        stroke(0);
        noFill();
        translate(this.position.x, this.position.y);
        this.radians = atan2(this.velocity.y, this.velocity.x);
        rotate(this.radians - 0.5);
        fill('black');
        if (this.index == 1)
            fill('red');
        triangle(0, -this.r, -this.r, this.r, 2 * this.r, this.r);
        pop();
        // push();
        // stroke('green');
        // strokeWeight(5);
        // circle(this.position.x, this.position.y, this.r);
        // pop();

        // Point Boids
        // push();
        // stroke(0);
        // strokeWeight(10);
        // point(this.position.x, this.position.y);
        // pop();


        // Perception Region of Boid
        // if (this.index == 1) {
        //     push();
        //     stroke(0);
        //     let alpha = atan2(this.velocity.y, this.velocity.x);
        //     for (let theta = -PI / 24; theta <= PI / 24; theta += PI / 24)
        //         line(this.position.x, this.position.y, this.position.x + 100 * Math.cos(alpha + theta), this.position.y + 100 * Math.sin(alpha + theta));
        //     pop();
        // }
    }
}
// obstacles                                     - Done
// snapshot velo
// quadtree or spiatial subdivision              - QuadTree optimization Done
// interface --> perception radius               - Perception defined for obstacles only
//           \__ max force
//            \_ max speed
// Triangular Boids                              - Done
// Flake - computational beauty of nature