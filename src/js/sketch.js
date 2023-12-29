const MAX_ITERATIONS = 100;
const CANVAS_SIZE = 800;
const SEQUENCE_STEPS = 500;

let UPPER_BOUND = 2;
let LOWER_BOUND = -2;

let x = 0;
let y = 0;

let my_shader = null;
let my_texture = null;
let current_target = null;

let center_x = 0;
let center_y = 0;
let zoom_x = 1;
let zoom_y = 1;

// Credit to: Felix Vorreiter for the following targets
// @see https://github.com/felixvor/mandelbrot/blob/master/sketch.js
let targets = {
    reset: [0, 0],
    julia_islands: [-1.4177481, 0.000140785],
    elefant_valley: [0.250745, 0.00003468],
    seahorse: [-0.743517833, -0.127094578],
    starfish: [-0.374004139, 0.659792175],
    tree: [-1.940157343, 0.000001],
    sun: [-0.776592847, -0.136640848],
    stormclouds: [-1.746780894, 0.004784543],
    santa: [-1.4177481933, 0.0001407843],
    rabbit: [-0.123, 0.745],
    julia_1: [-0.4, 0.6],
    julia_2: [0.285, 0.01],
    julia_3: [0.45, 0.1428],
    julia_4: [-0.70176, -0.3842],
    julia_5: [-0.835, -0.2321],
    julia_6: [0.35, 0.35],
    julia_7: [0.4, 0.4],
    julia_8: [0, 0.8],
    julia_9: [-0.7269, 0.1889],
};

let font = null;
let target_keys = Object.keys(targets);
let target_index = 0;
let sequence_1 = [];
let sequence_2 = [];

function preload() {
    my_shader = loadShader(
        './shaders/mandel.vert',
        './shaders/mandel.frag'
    );

    font = loadFont('./fonts/helvetica.ttf');
}

function setup() {
    createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
    pixelDensity(1);
    noStroke();

    // Set the font
    textFont(font);

    // Set the initial bounds and variables
    current_target = targets.reset;

    // Remove reset from the targets
    delete targets.reset;

    // Reset target index and keys
    target_index = 0;
    target_keys = Object.keys(targets);

    // Set the target
    my_texture = createGraphics(width, height, WEBGL);
    my_texture.pixelDensity(1);
    my_texture.noStroke();

    // Frame rate
    // frameRate(10);
}

function convergeTo(n, from, max_iterations = 100) {
    let sequence = [from];

    // Given a number n, and a starting number from, return the sequence
    // of numbers that converge to n slowly.
    let iterations = max_iterations;

    // Difference between the two numbers
    let difference = Math.abs(n - from);

    // If the difference is less than 0.0000000000000001, return the sequence
    if (difference < 0.0000000000000001) {
        return sequence;
    }

    // If the difference is greater than 0.0000000000000001, return the sequence
    let step = difference / iterations;

    // If difference is negative, make the step negative
    if (n < from) {
        step = -step;
    }

    // If the difference is greater than 0.0000000000000001, return the sequence
    let current = from;

    // If the difference is greater than 0.0000000000000001, return the sequence

    while (
        (n < from && current > n) ||
        (n > from && current < n)
    ) {
        current += step;
        sequence.push(current);
    }

    // If the last sequence number is not equal to n, add n to the sequence
    if (sequence[sequence.length - 1] != n) {
        sequence.pop();
        sequence.push(n);
    }

    return sequence;
}

function nextTarget() {
    target_index++;

    if (target_index >= target_keys.length) {
        // target_index = 0;
        sequence_1 = sequence_1.concat(convergeTo(0.1, current_target[0], 100));
        sequence_2 = sequence_2.concat(convergeTo(0.1, current_target[1], 100));
        return;
    }

    previous_target = current_target;
    current_target = targets[target_keys[target_index]];

    // Get sequence of numbers that converge to the target
    sequence_1 = sequence_1.concat(convergeTo(current_target[0], x || 0.1, SEQUENCE_STEPS));
    sequence_2 = sequence_2.concat(convergeTo(current_target[1], y || 0.1, SEQUENCE_STEPS));

    x = current_target[0];
    y = current_target[1];
}

function keyPressed() {

    if (key == 'n' || key == 'N') {
        target_keys.forEach(element => {
            nextTarget();
        });
    }

    // Add pause functionality
    if (key == 'p' || key == 'P') {
        // Check if the loop is running
        if (isLooping()) {
            // Pause the loop
            noLoop();
            return;
        }

        // Resume the loop
        loop();
    }
}

function mouseMoved() {
    if (mouseX > width || mouseY > height) {
        return;
    }

    if (mouseX < 0 || mouseY < 0) {
        return;
    }
}

function mouseWheel(event) {
    // Zoom in or out
    let zoom = event.delta > 0 ? 0.1 : -0.1;

    // Set the bounds
    UPPER_BOUND += zoom;
    LOWER_BOUND -= zoom;
}

function drawGrid() {
    // Draw X, Y axis as a series of connected vertices

    // Draw the X axis
    beginShape();
    fill(255);
    rect(-width, 0, width * 2, 1);

    // Draw the Y axis
    fill(255);
    rect(0, -height, 1, height * 2);
    endShape();
}

function drawMouseCoordinates() {
    if (!font) {
        return;
    }

    // Scale the x, y coordinates to the width and height of the canvas
    let x = map(mouseX, 0, width, LOWER_BOUND, UPPER_BOUND);
    let y = map(mouseY, 0, height, LOWER_BOUND, UPPER_BOUND);

    // Draw mouse coordinates
    fill(255);
    strokeWeight(1);
    textSize(12);
    text(
        `x: ${x} y: ${y}`,
        mouseX + 20 - width / 2,
        mouseY - height / 2
    );
}

let offset = 0;

function draw() {
    // Set the shader to the active shader
    my_texture.shader(my_shader);

    // Pass in the uniform values to the shader
    my_shader.setUniform('u_resolution', [width, height]);
    my_shader.setUniform('u_max_iterations', MAX_ITERATIONS);
    my_shader.setUniform('u_bounds', [LOWER_BOUND, UPPER_BOUND]);
    my_shader.setUniform('u_color', [1.0, 1.0, 0.0]); // send red as a uniform
    my_shader.setUniform('u_time', frameCount * 0.01); // send time to the shader
    my_shader.setUniform('u_constants', [x, y]);
    my_shader.setUniform('u_center', [center_x, center_y]);
    my_shader.setUniform('u_zoom', [zoom_x, zoom_y]);

    // Send the mouse coordinates to the shader
    my_shader.setUniform('u_mouse', [
        map(mouseX, 0, width, 0, 1),
        map(mouseY, 0, height, 0, 1),
    ]);

    // Draw a rectangle that covers the whole screen.
    // The shader will be called for each pixel in the rectangle.
    my_texture.rect(0, 0, width, height);

    // Draw the shader texture to the screen
    texture(my_texture);
    box(width, height, 0);

    // Draw a vertex line
    // drawGrid();

    // Draw mouse coordinates
    // drawMouseCoordinates();

    // If framecount > 100,000,000,000, reset the framecount
    // Which will prevent the number from getting too large
    if (frameCount > 100000000000) {
        frameCount = 0;
    }

    // Calculate new x and y values
    if (sequence_1.length != 0 || sequence_2.length != 0) {
        if (offset >= sequence_1.length || offset >= sequence_2.length) {
            offset = 0;
        }

        x = sequence_1[offset];
        y = sequence_2[offset];

        offset++;
    }

}