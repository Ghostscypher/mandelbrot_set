const MAX_ITERATIONS = 100;

let UPPER_BOUND = 2;
let LOWER_BOUND = -2;
let pixel_size = 1;
let line_width = 1;
let grid = [];

function setup() {
    // Set the cell size based on the window size
    createCanvas(800, 800);

    // Calculate the pixel size
    pixel_size = width / (UPPER_BOUND - LOWER_BOUND);
    line_width = pixel_size / 2;

    // Fill the grid null values
    for (let x = 0; x < width; x++) {
        grid[x] = [];

        for (let y = 0; y <= height / 2; y++) {
            grid[x][y] = null;
        }
    }

    // Render the mandelbrot set
    mandelbrot();

    // Set the initial bounds
    frameRate(10);
}

let is_paused = false;

function keyPressed() {
    if (key === 'p' || key === 'P') {
        is_paused = !is_paused;

        if (is_paused) {
            noLoop();
        } else {
            loop();
        }
    }

    if (key === 'r' || key === 'R') {
        // Reset the loop
        loop();
    }

}

function renderPixel(x, y, color) {
    // console.log(color);
    let index = (x + y * width) * 4;

    pixels[index + 0] = red(color);
    pixels[index + 1] = green(color);
    pixels[index + 2] = blue(color);
    pixels[index + 3] = 255;
}

function mandelbrot(x, y) {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y <= height / 2; y++) {
            let a = map(x, 0, width, LOWER_BOUND, UPPER_BOUND);
            let b = map(y, 0, height, LOWER_BOUND, UPPER_BOUND);
            let ca = a;
            let cb = b;
            let n = 0;

            while (++n < MAX_ITERATIONS) {
                let aa = a * a - b * b;
                let bb = 2 * a * b;

                a = aa + ca;
                b = bb + cb;

                if (abs(a + b) > 16) {
                    break;
                }
            }

            let bright = map(n, 0, MAX_ITERATIONS, 0, 1);
            let c = color(0, 0, 0);

            /**
             * Color scheme: Bernstein polynomials
             * https://en.wikipedia.org/wiki/Bernstein_polynomial
             * 
             * r(t) = 9 * (1 - t) * t3 * 255
             * g(t) = 15 * (1 -  t)^2 * t^2  *255
             * b(t) = 8.5 * (1 * t)^3  * t * 255
             */
            let c_r = 9 * (1 - bright) * bright * bright * 255;
            let c_g = 15 * (1 - bright) * (1 - bright) * bright * bright * 255;
            let c_b = 8.5 * (1 - bright) * (1 - bright) * (1 - bright) * bright * 255;

            if (n === MAX_ITERATIONS) {
                c = color(0, 0, 0);
            } else {
                c = color(c_r, c_g, c_b);
            }

            grid[x][y] = c;
        }
    }
}

function draw() {

    // Render the pixels
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y <= height; y++) {
            if (!grid[x][y]) continue;

            renderPixel(x, y, grid[x][y]);
            renderPixel(x, height - y, grid[x][y]);
        }
    }

    updatePixels();

    // If upper bound is greater than 2, then reset
    // if (UPPER_BOUND < -2) {
    //     UPPER_BOUND = 2;
    // }

    // // If lower bound is less than -2, then reset
    // if (LOWER_BOUND > -2) {
    //     LOWER_BOUND = -2;
    // }

    // // Update the bounds
    // UPPER_BOUND -= 0.1;
    // LOWER_BOUND += 0.1;

    // Render the mandelbrot set
    // mandelbrot();

    // Pause the loop
    noLoop();
}