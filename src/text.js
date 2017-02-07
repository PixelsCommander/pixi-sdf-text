let Mesh = PIXI.mesh.Mesh;
let loadFont = require('load-bmfont');
let createLayout = require('layout-bmfont-text');
let createIndices = require('quad-indices');
let vertices = require('./lib/vertices');

import * as shaderCode from './sdf.frag';

export default class Text extends PIXI.mesh.Mesh {

    constructor(text, style = {}) {
        
        super(style.texture);

        this._text = text;
        this._style = style;
        this.pluginName = 'sdf';

        loadFont(this._style.fontURL, (err, font) => {

            this._font = font;
            PIXI.loader.add(this._style.imageURL, this._style.imageURL).load((loader, resources) => {
                this._texture = resources[this._style.imageURL].texture;
                this.updateText();
            });
        });
    }

    updateText() {

        let opt = {
            text: this._text,
            font: this._font,
            ...this._style
        };

        if (!opt.font) {
            throw new TypeError('must specify a { font } in options');
        }

        this.layout = createLayout(opt);

        // get vec2 texcoords
        let flipY = opt.flipY !== false;

        // the desired BMFont data
        let font = opt.font;

        // determine texture size from font file
        let texWidth = font.common.scaleW;
        let texHeight = font.common.scaleH;

        // get visible glyphs
        let glyphs = this.layout.glyphs.filter(function (glyph) {
            let bitmap = glyph.data;
            return bitmap.width * bitmap.height > 0;
        })

        // provide visible glyphs for convenience
        this.visibleGlyphs = glyphs;

        // get common vertex data
        let positions = vertices.positions(glyphs);
        let uvs = vertices.uvs(glyphs, texWidth, texHeight, false);

        this.indices = createIndices({
            clockwise: true,
            type: 'uint16',
            count: glyphs.length
        });

        this.vertices = new Float32Array(positions);
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