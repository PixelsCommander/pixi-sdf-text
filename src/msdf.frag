#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

varying vec2 vTextureCoord; // vUv
uniform vec3 u_color; // color
uniform sampler2D uSampler; // map
uniform float u_alpha; // opacity
uniform float u_fontSize;
uniform float u_weight;
uniform vec3 u_bgColor;


float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main(void) {

    vec4 _sample = texture2D(uSampler, vTextureCoord);
    float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
    float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

    vec3 color = u_color * alpha;
    gl_FragColor = vec4(color, alpha) * u_alpha;
}
