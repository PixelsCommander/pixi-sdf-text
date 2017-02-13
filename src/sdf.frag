varying vec2 vTextureCoord;
uniform vec3 u_color;
uniform sampler2D uSampler;
uniform float u_alpha;
uniform float u_fontSize;
uniform float u_weight;

void main(void)
{
    float smoothing = 1. / u_fontSize * 6.;
    float debug = 0.0;

    vec2 textureCoord = vTextureCoord * 2.;
    float dist = texture2D(uSampler, vTextureCoord).a;

    if (debug > 0.0) {
        gl_FragColor = vec4(dist, dist, dist, 1);
    } else {
        float alpha = smoothstep(u_weight - smoothing, u_weight + smoothing, dist);

        vec3 color = u_color * alpha;

        gl_FragColor = vec4(color, alpha);
    }
}
