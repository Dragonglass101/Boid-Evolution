"use strict"
let fR = 0;
let healthReduce = 0.2;
let generation = 1;
let showPerception = false;
const flock = [];
const obstacles = [];
const food = [];
const poison = [];
var totalBoids = 500;
var totalObs = 0;
var totalFood = 500;


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
    showPerception = true;
});
document.addEventListener('mouseup', function() {
    mouse.click = false;
    showPerception = false;
});

function setup() {
    background('lightBlue');
    createCanvas(2500, 1500);
    // createCanvas(900, 600);
    textSize(30);
    textAlign(CENTER);

    alignSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1.2, 0.05);
    obsRadiSlider = createSlider(10, 30, 1, 5);

    flock.push(new Boid(random(width), random(height), [200, 10, 700]));
    flock.push(new Boid(random(width), random(height), [20, 300, 500]));
    for (let i = 2; i < totalBoids; i++) {
        let newBoid = new Boid(random(width), random(height), [floor(random(20, 70)), floor(random(20, 70)), floor(random(600, 1000))]);
        flock.push(newBoid);
    }
    for (let i = 0; i < totalObs; i++) {
        let newObs = new Obstacle(random(width), random(height), floor(random(20, 50)));
        obstacles.push(newObs);
    }
    for (let i = 0; i < totalFood; i++) {
        let newFood = new Food(random(width), random(height));
        if (newFood.nutritionValue > 0)
            food.push(newFood);
        else
            poison.push(newFood);
    }
}

function draw() {
    background(173, 216, 230); // light blue
    // background('lightgreen')

    if (frameCount % 50 == 0) {
        fR = floor(frameRate());
    }
    if (frameCount % 1000 == 0 && totalBoids != 0) {
        generation++;
    }

    fill('blue');
    textSize(50);
    if (showPerception)
        text("longer Green rod means more affinity towards food, longer Red rod means more affinity towards poison", width / 2, 50);
    fill('black');
    textSize(25);
    text(`FrameRate = ${fR}`, 100, 80);
    text(`Birds = ${flock.length}`, 100, 110);
    text(`Obstacles = ${obstacles.length}`, 100, 140);
    text(`Food = ${food.length + poison.length}`, 100, 170);
    textSize(30);
    fill('purple');
    text(`Generation = ${generation}`, 120, 220);
    // text(`GenTime = ${flock[0].genTime}`, 100, 230);
    // text(`health = ${floor(flock[0].health)}`, 150, 200);

    if (food.length + poison.length < 500 && totalBoids != 0) {
        for (let i = 0; i < 50; i++) {
            let newFood = new Food(random(width), random(height));
            if (newFood.nutritionValue > 0)
                food.push(newFood);
            else
                poison.push(newFood);
        }
    }

    let boundary = new Rectangle(width / 2, height / 2, width, height);
    let qtBoid = new QuadTree(boundary, 2);
    let qtObs = new QuadTree(boundary, 4);
    let qtFood = new QuadTree(boundary, 4);
    let qtPoison = new QuadTree(boundary, 4);

    // mouse handling
    if (mouse.click == true) {
        // GENERATE OBSTACLES
        // let Range = new Rectangle(mouseX, mouseY, 100, 100);
        // let obsInArea = qtObs.query(Range);
        // let check = 1;
        // let r = floor(random(10, 40));
        // r = obsRadiSlider.value();
        // // r = 10;
        // for (let ob of obsInArea) {
        //     check *= (Math.sqrt(((ob.position.x - mouseX) * (ob.position.x - mouseX)) +
        //         ((ob.position.y - mouseY) * (ob.position.y - mouseY))) > (ob.r + r));
        //     if (check == 0)
        //         break;
        // }
        // if (check) {
        //     obstacles.push(new Obstacle(floor(mouseX), floor(mouseY), floor(r)));
        //     totalObs++;
        // }
        //_______________________________________________________________________________

        // GENERATE FOOD
        // for (let i = 0; i < 50; i++) {
        //     let newFood = new Food(random(width), random(height));
        //     if (newFood.nutritionValue > 0)
        //         food.push(newFood);
        //     else
        //         poison.push(newFood);
        // }
        // poison.splice(0, poison.length);
    }


    for (let f of food) {
        qtFood.insert(f);
        f.show();
    }
    for (let p of poison) {
        qtPoison.insert(p);
        p.show();
    }
    for (let obs of obstacles) {
        qtObs.insert(obs);
        obs.show();
    }
    let t1, t2;
    for (let boid of flock) {
        qtBoid.insert(boid);
        boid.edges();

        // t1 = millis();
        // boid.flock(qtBoid, qtObs);
        // t2 = millis();
        // if (frameCount % 100 == 0)
        //     console.log("flock " + (t2 - t1));

        boid.eat(qtFood, true);

        if (flock.length != 1) {
            boid.decreaseHealth();
            boid.eat(qtPoison, false);
        }
        boid.genChild();


        boid.update();
        boid.show();
    }
    // console.log(alignSlider.value(), cohesionSlider.value(), separationSlider.value());
}