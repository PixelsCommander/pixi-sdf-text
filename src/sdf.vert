attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;
uniform float u_fontInfoSize;

varying vec2 vTextureCoord;

void main(void)
{
    vTextureCoord = aTextureCoord;
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition * u_fontInfoSize, 1.0)).xy, 0.0, 1.0);
}
