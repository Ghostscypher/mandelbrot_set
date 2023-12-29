// #ifdef GL_ES
precision highp float;
// #endif

// Constants
const int MAX_ITERATIONS = 150;

// Passed in from the vertex shader.
uniform vec2 u_resolution;
uniform vec2  u_mouse;
uniform vec2  u_mouse_new;
uniform float u_time;
uniform vec2 u_bounds;
uniform int u_max_iterations;
uniform vec2 u_constants;
uniform vec2 u_zoom;
uniform vec2 u_center;

// Interpolated from the vertex shader.
varying vec2 vTexCoord;

int returnInt() {
    return 100;
}

// Map that takes a float
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// Map that takes any vec type
vec2 map(vec2 value, float min1, float max1, float min2, float max2) {
    return vec2(
        min2 + (value.x - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.y - min1) * (max2 - min2) / (max1 - min1)
    );
}

vec3 map(vec3 value, float min1, float max1, float min2, float max2) {
    return vec3(
        min2 + (value.x - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.y - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.z - min1) * (max2 - min2) / (max1 - min1)
    );
}

vec4 map(vec4 value, float min1, float max1, float min2, float max2) {
    return vec4(
        min2 + (value.x - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.y - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.z - min1) * (max2 - min2) / (max1 - min1),
        min2 + (value.w - min1) * (max2 - min2) / (max1 - min1)
    );
}

// Mandelbrot set
vec3 mandelbrot(vec2 c) {
    vec2 z = vec2(0.0);
    vec2 z_1 = vec2(0.0);
    float n = 0.0;
    vec3 color = vec3(0.0);
    float temp_time = u_time;

    // Make sure that the value of temp_time is between 0 and 1
    temp_time = cos(temp_time) * 1.0 + 0.005;

    for (int i = 0; i < MAX_ITERATIONS; i++) {
        
        // Mandelbrot formula
        z = vec2(
            // a = a * a - b * b + coord.x
            z.x * z.x - z.y * z.y, 

            // b = 2 * a * b + coord.y
            2.0 * z.x * z.y
        ) + c;
        
        // Calculate the first derivative of z
        // z_1 = vec2(
        //     2.0 * z.x * z_1.x - 2.0 * z.y * z_1.y + 1.0,
        //     2.0 * z.x * z_1.y + 2.0 * z.y * z_1.x
        // );

        // if(length(z_1) < 0.001){
        //     n = 1000.0;
        //     break;
        // }

        // Julia set, x is the real part, y is the imaginary part
        // c.x = sin(temp_time) * 0.5;
        // c.y = cos(temp_time) * 0.5;

        if(u_constants.x != 0.0 && u_constants.y != 0.0){
            c.x = u_constants.x;
            c.y = u_constants.y;
        }
        
        if (length(z) > 4.0) {
            break;
        }

        n += 1.0;
    }

    // Smooth coloring
    float smooth_n = n + 1.0 - log(log(length(z))) / log(2.0);

    // Use bernstein polynomials for smooth coloring
    float t = map(smooth_n, 0.0, float(MAX_ITERATIONS), 0.0, 1.0);

    color.r = 9.0 * (1.0 - t) * t * t * 255.0;
    color.g = 15.0 * (1.0 - t) * (1.0 - t) * t * t * 255.0;
    color.b = 8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t * 255.0;

    // Clamp the values between 0, 1
    color.r = map(color.r, 0.0, 255.0, 0.0, 1.0);
    color.g = map(color.g, 0.0, 255.0, 0.0, 1.0);
    color.b = map(color.b, 0.0, 255.0, 0.0, 1.0);
    
    return color;
}

void main() {
    vec2 uv = vTexCoord;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec3 color = vec3(1.0);
    vec2 pos = vec2(0.0);
    float zoom = 1.0;

    pos = map(uv, 0.0, 1.0, u_bounds.x, u_bounds.y);

    // Simulate a camera zooming into specific parts of the mandelbrot set
    // pos.x /= u_zoom.x;
    // pos.y /= u_zoom.y;

    // Based on the time, zoom in and out
    // float zoom = 1.0 + sin(u_time) * 1.0;
    // pos.x /= 100.0;
    // pos.y /= 100.0;

    // Zoom in towards the interesting parts
    // pos.x /= zoom;
    // pos.y /= zoom;

    // Move the camera around
    // pos.x += sin(u_time) * 0.05;
    // pos.y += cos(u_time) * 0.05;

    // pos.x += u_mouse.x * 0.1;
    // pos.y += u_mouse.y * 0.1;

    // Draw the mandelbrot set
    color = mandelbrot(pos);

    // Will always come last of the fragment shader
    gl_FragColor = vec4(color, 1.0);
}
