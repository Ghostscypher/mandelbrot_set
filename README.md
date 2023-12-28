# Mandelbrot Set

## Introduction

The Mandelbrot set is the set of complex numbers `c` for which the function `f(z) = z^2 + c` does not diverge when iterated from `z = 0`, i.e., for which the sequence `f(0)`, `f(f(0))` etc., remains bounded in absolute value. Its definition is credited to Adrien Douady who named it in tribute to the mathematician Benoit Mandelbrot, a pioneer of fractal geometry. Mandelbrot set images may be created by sampling the complex numbers and testing, for each sample point `c0` whether the sequence `c0`, `f(c0)` etc., remains bounded. ([Wikipedia](https://en.wikipedia.org/wiki/Mandelbrot_set))

## Installation

To run the simulation, simply clone the repository and open the `index.html` file in your browser. Alternatively, you can visit the [GitHub Pages](https://ghostscypher.github.io/madelbrot_set/src/index.html) for this repository.

## Implementation

The current implementation only renders the pattern once. The color scheme used is Bernstein's color scheme. The color scheme is as follows:

```javascript
let t = map(n, 0, MAX_ITERATIONS, 0, 1);

/**
 * Color scheme: Bernstein polynomials
 * https://en.wikipedia.org/wiki/Bernstein_polynomial
 * 
 * r(t) = 9 * (1 - t) * t3 * 255
 * g(t) = 15 * (1 -  t)^2 * t^2  *255
 * b(t) = 8.5 * (1 * t)^3  * t * 255
 */
let c_r = 9 * (1 - t) * t * t * 255;
let c_g = 15 * (1 - t) * (1 - t) * t * t * 255;
let c_b = 8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255;
```

### Pseudocode

```pseudocode
for each pixel (Px, Py) on the screen do
    x0 := scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
    y0 := scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
    x := 0.0
    y := 0.0
    iteration := 0
    max_iteration := 1000
    while (x×x + y×y ≤ 2×2 AND iteration < max_iteration) do
        xtemp := x×x - y×y + x0
        y := 2×x×y + y0
        x := xtemp
        iteration := iteration + 1
 
    color := palette[iteration]
    plot(Px, Py, color)
```

## Future Work

I plan to add the following features to this project:
For now I need to first figure out a way to optimize the generation of the Mandelbrot set. I am thinking of using a shader to do this. Either openGL or WebGL. I will. Another thing to consider is getting repeated patterns and using cached versions of the patterns to speed up the generation process. This should hopefully speed up the generation process, and allow a somewhat infinite zoom emulation. Note it's not actually infinite, but it's good enough for most purposes. This is because we quickly reach the limits of the floating point precision of the computer.

- [ ] Add zoom functionality
- [ ] Add color palette selection
- [ ] Add color palette generation
- [ ] Add color palette animation


## Demo

<img src="https://raw.githubusercontent.com/ghostscypher/mandelbrot_set/output/demo.gif" alt="Mandelbrot Set">

## References

1. [Mandelbrot Set - Wikipedia](https://en.wikipedia.org/wiki/Mandelbrot_set)
2. [P5 JS](https://p5js.org/)
3. [P5 JS Reference](https://p5js.org/reference/)
4. [P5 JS Examples](https://p5js.org/examples/)
5. [P5 JS Web Editor](https://editor.p5js.org/)
6. [Coding train - P5 JS Tutorials](https://www.youtube.com/user/shiffman/playlists?view=50&sort=dd&shelf_id=14)
7. [The Nature of Code](https://natureofcode.com/)
8. [The Coding Train](https://thecodingtrain.com/)
9. [The Coding Train - Mandelbrot Set](https://www.youtube.com/watch?v=6z7GQewK-Ks)