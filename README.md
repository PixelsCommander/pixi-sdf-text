pixi-sdf-text
=============

Signed distance fields text implementation for [PixiJS](http://pixijs.com)
-----------------------------------------------------

<a href="https://www.mapbox.com/blog/text-signed-distance-fields/">SDF is the most efficient way to draw text in WebGL</a>.
        It uses <a href="http://pixelscommander.com/polygon/pixi-sdf-text/demo/assets/OpenSans-Regular.png">special kind of raster atlases</a> and GLSL shader to <a href="http://wdobbie.com/pdf/">draw vector scalable text in a very performant way</a> on GPU.</p>

[Demo](http://pixelscommander.com/polygon/pixi-sdf-text/demo/)

Installation
------------

`npm i pixi-sdf-text --save`

Usage
-----

```javascript
var style = {
    fontSize: 24,
    fontWeight: 'bold',
    fill: 0x39FF14,
    align: 'left',
    wordWrapWidth: 400,
    lineHeight: 64,
    fontURL: 'assets/Lato-Regular-64.fnt',
    imageURL: 'assets/lato.png'
};

var sdfText = new PIXI.sdf.Text('Abc', style);
stage.addChild(sdfText);
```

How to generate font descriptors and SDF atlases?
-------------------------------------------------
[Use this manual](https://github.com/Jam3/three-bmfont-text/blob/master/docs/sdf.md)

Bugs
----
Feel free to submit issues to [GitHub tracker](https://github.com/PixelsCommander/pixi-sdf-text/issues)

License
-------
MIT: [http://mit-license.org/](http://mit-license.org/)

Copyright 2017 Denis Radin aka [PixelsCommander](http://pixelscommander.com)