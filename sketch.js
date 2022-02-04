const flock = [];
const walls = [];
const obstacles = [];
var totalBoids = 100;
var totalObs = 0;


const mouse = {
    x: null,
    y: null,
    click: false
}

let alignSlider, cohesionSlider, separationSlider, obsRadiSlider;
document.addEventListener("mousedown", function() {
    // flock.push(new Boid(mouseX, mouseY));
    // totalBoids++;
    // obstacles.push(new Obstacle(mouseX, mouseY, 20));
    // totalObs++;
    mouse.click = true;
    console.log(mouseX, mouseY);
});
document.addEventListener('mouseup', function() {
    mouse.click = false;
});

function setup() {
    background('lightBlue');
    // createCanvas(1500, 900);
    createCanvas(900, 600);
    textSize(30);
    textAlign(CENTER);

    alignSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1.2, 0.05);
    obsRadiSlider = createSlider(10, 30, 1, 5);
    for (let i = 0; i < totalBoids; i++) {
        let newBoid = new Boid(random(width), random(height));
        flock.push(newBoid);
    }
    for (let i = 0; i < totalObs; i++) {
        let newObs = new Obstacle(random(width), random(height), floor(random(20, 50)));
        obstacles.push(newObs);
    }
}
let fR;

function draw() {
    background(173, 216, 230); // light blue
    // background('lightgreen')

    if (frameCount % 50 == 0)
        fR = floor(frameRate());
    textSize(30);
    fill('black');
    text(`FrameRate = ${fR}`, 150, 50);
    text(`Birds = ${totalBoids}`, 150, 100);
    text(`Obstacles = ${totalObs}`, 150, 150);
    let boundary = new Rectangle(width / 2, height / 2, width, height);
    let qtBoid = new QuadTree(boundary, 2);
    let qtObs = new QuadTree(boundary, 4);
    for (let i = 0; i < totalBoids; i++) {
        qtBoid.insert(flock[i]);
    }
    for (let i = 0; i < totalObs; i++) {
        qtObs.insert(obstacles[i]);
    }
    // qtBoid.show();

    // mouse handling
    if (mouse.click == true) {
        let ObsRange = new Rectangle(mouseX, mouseY, 100, 100);
        let obsInArea = qtObs.query(ObsRange);
        let check = 1;
        let r = floor(random(10, 40));
        r = obsRadiSlider.value();
        // r = 10;
        for (let ob of obsInArea) {
            check *= (Math.sqrt(((ob.position.x - mouseX) * (ob.position.x - mouseX)) +
                ((ob.position.y - mouseY) * (ob.position.y - mouseY))) > (ob.r + r));
            if (check == 0)
                break;
        }
        if (check) {
            obstacles.push(new Obstacle(floor(mouseX), floor(mouseY), floor(r)));
            totalObs++;
        }
    }


    for (let boid of flock) {
        boid.edges();
        // if (frameCount % 5 == 0)
        boid.flock(qtBoid, qtObs);

        boid.update();
        boid.show();
    }
    for (let obs of obstacles) {
        obs.show();
    }
    for (let w of walls) {
        w.show();
    }
    // console.log(alignSlider.value(), cohesionSlider.value(), separationSlider.value());
}