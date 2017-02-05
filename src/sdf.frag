varying vec2 vTextureCoord;
uniform vec3 u_color;
uniform sampler2D uSampler;
uniform float u_alpha;
uniform float u_fontSize;
uniform float u_buffer;

void main(void)
{
    float u_buffer = .7;
    float u_gamma = 1. / u_fontSize * 2.;
    float u_debug = 0.0;
    //vec4 u_color = vec4(.2, .3, .4, 1.);

    float dist = texture2D(uSampler, vTextureCoord).r;
    dist = dist * texture2D(uSampler, vTextureCoord).a;
    if (u_debug > 0.0) {
        gl_FragColor = vec4(dist, dist, dist, 1);
    } else {
        float alpha = smoothstep(u_buffer - u_gamma, u_buffer + u_gamma, dist);

        vec3 color = u_color * alpha;

        gl_FragColor = vec4(color, alpha);
    }
}
