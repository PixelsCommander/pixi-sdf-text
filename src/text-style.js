const defaultStyle = {
    align: 'left',
    /*breakWords: false,
     dropShadow: false,
     dropShadowAngle: Math.PI / 6,
     dropShadowBlur: 0,
     dropShadowColor: '#000000',
     dropShadowDistance: 5,*/
    fill: 0xffffff,
    //fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
    fontSize: 26,
    fontWeight: 'normal',
    //letterSpacing: 0,
    lineHeight: 0,
    //stroke: 'black',
    //strokeThickness: 0,
    wordWrap: false,
    wordWrapWidth: 100,
};

export default class TextStyle {

    constructor(style) {
        this.styleID = 0;
        Object.assign(this, defaultStyle, style);
    }

    get align() {
        return this._align;
    }

    set align(value) {
        this._align = value;
        this.styleID++;
    }

    get weight() {
        return this._weight;
    }

    get fontWeight() {
        return this._weight < 0.4 ? 'bold' : 'normal';
    }

    set fontWeight(value) {
        this._weight = value === 'bold' ? 0.3 : 0.7;
        this.styleID++;
    }

    get fontSize() {
        return this._fontSize;
    }

    set fontSize(value) {
        this._fontSize = value;
        this.styleID++;
    }

    get fill() {
        return this._fill;
    }

    set fill(value) {
        const outputColor = PIXI.utils.hex2rgb(value);
        if (this._fill !== outputColor) {
            this._fill = outputColor;
            this.styleID++;
        }
    }

    getFlatCopy() {
        return {
            align: this.align,
            fontSize: this.fontSize,
            fill: this.fill,
            fontWeight: this.fontWeight,
            width: this.wordWrapWidth,
            wordWrapWidth: this.wordWrapWidth,
            lineHeight: this.lineHeight
        };
    }
}