let Mesh = PIXI.mesh.Mesh;
let ObservablePoint = PIXI.ObservablePoint;
let createIndicesForQuads = PIXI.createIndicesForQuads;

import * as shaderCode from './sdf.frag';

export default class Text extends PIXI.mesh.Mesh {

    constructor(text, style = {}) {
        super(style.texture);

        this._text = text;
        this._style = style;
        this._texture = style.texture;

        this.pluginName = 'sdf';

        this.updateText();
    }

    drawGlyph(chr, vertices, uvs, pen, size) {
        const metric = this._style.metrics.chars[chr];
        if (!metric) return;

        const scale = size / this._style.metrics.size;
        const factor = 1;
        let width = metric[0];
        let height = metric[1];
        const horiBearingX = metric[2];
        const horiBearingY = metric[3];
        const horiAdvance = metric[4];
        const posX = metric[5];
        const posY = metric[6];

        if (width > 0 && height > 0) {
            width += this._style.metrics.buffer * 2;
            height += this._style.metrics.buffer * 2;

            // Add a quad (= two triangles) per glyph.
            vertices.push(
                (factor * (pen.x + ((horiBearingX - this._style.metrics.buffer) * scale))), (factor * (pen.y - horiBearingY * scale)),
                (factor * (pen.x + ((horiBearingX - this._style.metrics.buffer + width) * scale))), (factor * (pen.y - horiBearingY * scale)),
                (factor * (pen.x + ((horiBearingX - this._style.metrics.buffer) * scale))), (factor * (pen.y + (height - horiBearingY) * scale)),

                (factor * (pen.x + ((horiBearingX - this._style.metrics.buffer + width) * scale))), (factor * (pen.y - horiBearingY * scale)),
                (factor * (pen.x + ((horiBearingX - this._style.metrics.buffer) * scale))), (factor * (pen.y + (height - horiBearingY) * scale)),
                (factor * (pen.x + ((horiBearingX - this._style.metrics.buffer + width) * scale))), (factor * (pen.y + (height - horiBearingY) * scale))
            );

            let texWidth = this.texture.baseTexture.width;
            let texHeight = this.texture.baseTexture.height;

            uvs.push(
                posX / texWidth, posY / texHeight,
                (posX + width) / texWidth, posY / texHeight,
                posX / texWidth, (posY + height) / texHeight,

                (posX + width) / texWidth, posY / texHeight,
                posX / texWidth, (posY + height) / texHeight,
                (posX + width) / texWidth, (posY + height) / texHeight
            );
        }

        pen.x = pen.x + horiAdvance * scale;
    }

    updateText() {
        var pen = {x: 0, y: 0};
        var vertices = [];
        var indices = [];
        var uvs = [];

        for (var i = 0; i < this._text.length; i++) {
            this.drawGlyph(this._text[i], vertices, uvs, pen, this.fontSize);
        }

        this.vertices = new Float32Array(vertices);
        this.uvs = new Float32Array(uvs);
    }

    get fontSize() {
        return this._style.fontSize || 12;
    }

    set fontSize(value) {
        this._style.fontSize = value;
        this.updateText();
    }

    get color() {
        let hexColor = this._style.color || 0x000000;
        let color = PIXI.utils.hex2rgb(hexColor);
        return color;
    }

    set color(value) {
        this._style.color = value;
        this.updateText();
    }

    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
        this.updateText();
    }
}