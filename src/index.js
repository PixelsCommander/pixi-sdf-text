import Text from './text';

let vertShader = require('./sdf.vert');
let fragShader = require('./sdf.frag');

let glCore = PIXI.glCore;

export class SDFRenderer extends PIXI.ObjectRenderer {

    constructor(renderer) {
        super(renderer);
        this.shader = null;
    }

    onContextChange() {
        var gl = this.renderer.gl;
        this.shader = new PIXI.Shader(gl, vertShader, fragShader);
    }

    render(sdfText) {
        const renderer = this.renderer;
        const gl = renderer.gl;
        const texture = sdfText._texture;
        const font = sdfText._font;

        if (!texture || !texture.valid || !font) {
            return;
        }

        if (sdfText.styleID !== sdfText.style.styleID) {
            sdfText.updateText();
        }

        let glData = sdfText._glDatas[renderer.CONTEXT_UID];

        if (!glData) {
            renderer.bindVao(null);

            glData = {
                shader: this.shader,
                vertexBuffer: glCore.GLBuffer.createVertexBuffer(gl, sdfText.vertices, gl.STREAM_DRAW),
                uvBuffer: glCore.GLBuffer.createVertexBuffer(gl, sdfText.uvs, gl.STREAM_DRAW),
                indexBuffer: glCore.GLBuffer.createIndexBuffer(gl, sdfText.indices, gl.STATIC_DRAW),
                // build the vao object that will render..
                vao: null,
                dirty: sdfText.dirty,
                indexDirty: sdfText.indexDirty,
            };

            // build the vao object that will render..
            glData.vao = new glCore.VertexArrayObject(gl)
                .addIndex(glData.indexBuffer)
                .addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0)
                .addAttribute(glData.uvBuffer, glData.shader.attributes.aTextureCoord, gl.FLOAT, false, 2 * 4, 0);

            sdfText._glDatas[renderer.CONTEXT_UID] = glData;
        }

        renderer.bindVao(glData.vao);

        if (sdfText.dirty !== glData.dirty) {
            glData.dirty = sdfText.dirty;
            glData.uvBuffer.upload(sdfText.uvs);
        }

        if (sdfText.indexDirty !== glData.indexDirty) {
            glData.indexDirty = sdfText.indexDirty;
            glData.indexBuffer.upload(sdfText.indices);
        }

        glData.vertexBuffer.upload(sdfText.vertices);

        renderer.bindShader(glData.shader);

        glData.shader.uniforms.uSampler = renderer.bindTexture(texture);

        renderer.state.setBlendMode(sdfText.blendMode);

        glData.shader.uniforms.translationMatrix = sdfText.worldTransform.toArray(true);
        glData.shader.uniforms.u_alpha = sdfText.worldAlpha;
        glData.shader.uniforms.u_color = sdfText.style.fill;
        glData.shader.uniforms.u_fontSize = sdfText.style.fontSize;
        glData.shader.uniforms.u_fontInfoSize = sdfText.style.fontSize / font.info.size;
        glData.shader.uniforms.u_weight = sdfText.style.weight;
        //glData.shader.uniforms.tint = sdfText.tintRgb;

        const drawMode = sdfText.drawMode = gl.TRIANGLES;
        glData.vao.draw(drawMode, sdfText.indices.length, 0);
    }
}

PIXI.WebGLRenderer.registerPlugin('sdf', SDFRenderer);

PIXI.sdf = {};
PIXI.sdf.Text = Text;
