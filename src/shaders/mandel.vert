precision highp float;

// Attributes
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Will be passed to fragment shader
varying vec2 vTexCoord;


void main() {
    vTexCoord = aTexCoord;

    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

    // Will always come last of the vertex shader
    gl_Position = positionVec4;
}
