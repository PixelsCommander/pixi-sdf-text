/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.SDFRenderer = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _text = __webpack_require__(1);
	
	var _text2 = _interopRequireDefault(_text);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var vertShader = __webpack_require__(3);
	var fragShader = __webpack_require__(2);
	
	var glCore = PIXI.glCore;
	
	var SDFRenderer = exports.SDFRenderer = function (_PIXI$ObjectRenderer) {
	    _inherits(SDFRenderer, _PIXI$ObjectRenderer);
	
	    function SDFRenderer(renderer) {
	        _classCallCheck(this, SDFRenderer);
	
	        var _this = _possibleConstructorReturn(this, (SDFRenderer.__proto__ || Object.getPrototypeOf(SDFRenderer)).call(this, renderer));
	
	        _this.shader = null;
	        return _this;
	    }
	
	    _createClass(SDFRenderer, [{
	        key: 'onContextChange',
	        value: function onContextChange() {
	            var gl = this.renderer.gl;
	            this.shader = new PIXI.Shader(gl, vertShader, fragShader);
	        }
	    }, {
	        key: 'render',
	        value: function render(sdfText) {
	            var renderer = this.renderer;
	            var gl = renderer.gl;
	            var texture = sdfText._texture;
	
	            if (!texture.valid) {
	                return;
	            }
	
	            var glData = sdfText._glDatas[renderer.CONTEXT_UID];
	
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
	                    indexDirty: sdfText.indexDirty
	                };
	
	                // build the vao object that will render..
	                glData.vao = new glCore.VertexArrayObject(gl).addIndex(glData.indexBuffer).addAttribute(glData.vertexBuffer, glData.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0).addAttribute(glData.uvBuffer, glData.shader.attributes.aTextureCoord, gl.FLOAT, false, 2 * 4, 0);
	
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
	            glData.shader.uniforms.u_color = sdfText.color;
	            //glData.shader.uniforms.tint = sdfText.tintRgb;
	
	            //const drawMode = sdfText.drawMode === Mesh.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;
	            //glData.vao.draw(drawMode, sdfText.indices.length, 0);
	
	            gl.drawArrays(gl.TRIANGLES, 0, sdfText.uvs.length / 2);
	        }
	    }]);
	
	    return SDFRenderer;
	}(PIXI.ObjectRenderer);
	
	PIXI.WebGLRenderer.registerPlugin('sdf', SDFRenderer);
	
	PIXI.sdf = {};
	PIXI.sdf.Text = _text2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _sdf = __webpack_require__(2);
	
	var shaderCode = _interopRequireWildcard(_sdf);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Mesh = PIXI.mesh.Mesh;
	var ObservablePoint = PIXI.ObservablePoint;
	var createIndicesForQuads = PIXI.createIndicesForQuads;
	
	var Text = function (_PIXI$mesh$Mesh) {
	    _inherits(Text, _PIXI$mesh$Mesh);
	
	    function Text(text) {
	        var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	        _classCallCheck(this, Text);
	
	        var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, style.texture));
	
	        _this._text = text;
	        _this._style = style;
	        _this._texture = style.texture;
	
	        _this.pluginName = 'sdf';
	
	        _this.updateText();
	        return _this;
	    }
	
	    _createClass(Text, [{
	        key: 'drawGlyph',
	        value: function drawGlyph(chr, vertices, uvs, pen, size) {
	            var metric = this._style.metrics.chars[chr];
	            if (!metric) return;
	
	            var scale = size / this._style.metrics.size;
	            var factor = 1;
	            var width = metric[0];
	            var height = metric[1];
	            var horiBearingX = metric[2];
	            var horiBearingY = metric[3];
	            var horiAdvance = metric[4];
	            var posX = metric[5];
	            var posY = metric[6];
	
	            if (width > 0 && height > 0) {
	                width += this._style.metrics.buffer * 2;
	                height += this._style.metrics.buffer * 2;
	
	                // Add a quad (= two triangles) per glyph.
	                vertices.push(factor * (pen.x + (horiBearingX - this._style.metrics.buffer) * scale), factor * (pen.y - horiBearingY * scale), factor * (pen.x + (horiBearingX - this._style.metrics.buffer + width) * scale), factor * (pen.y - horiBearingY * scale), factor * (pen.x + (horiBearingX - this._style.metrics.buffer) * scale), factor * (pen.y + (height - horiBearingY) * scale), factor * (pen.x + (horiBearingX - this._style.metrics.buffer + width) * scale), factor * (pen.y - horiBearingY * scale), factor * (pen.x + (horiBearingX - this._style.metrics.buffer) * scale), factor * (pen.y + (height - horiBearingY) * scale), factor * (pen.x + (horiBearingX - this._style.metrics.buffer + width) * scale), factor * (pen.y + (height - horiBearingY) * scale));
	
	                var texWidth = this.texture.baseTexture.width;
	                var texHeight = this.texture.baseTexture.height;
	
	                uvs.push(posX / texWidth, posY / texHeight, (posX + width) / texWidth, posY / texHeight, posX / texWidth, (posY + height) / texHeight, (posX + width) / texWidth, posY / texHeight, posX / texWidth, (posY + height) / texHeight, (posX + width) / texWidth, (posY + height) / texHeight);
	            }
	
	            pen.x = pen.x + horiAdvance * scale;
	        }
	    }, {
	        key: 'updateText',
	        value: function updateText() {
	            var pen = { x: 0, y: 0 };
	            var vertices = [];
	            var indices = [];
	            var uvs = [];
	
	            for (var i = 0; i < this._text.length; i++) {
	                this.drawGlyph(this._text[i], vertices, uvs, pen, this.fontSize);
	            }
	
	            this.vertices = new Float32Array(vertices);
	            this.uvs = new Float32Array(uvs);
	        }
	    }, {
	        key: 'fontSize',
	        get: function get() {
	            return this._style.fontSize || 12;
	        },
	        set: function set(value) {
	            this._style.fontSize = value;
	            this.updateText();
	        }
	    }, {
	        key: 'color',
	        get: function get() {
	            var hexColor = this._style.color || 0x000000;
	            var color = PIXI.utils.hex2rgb(hexColor);
	            return color;
	        },
	        set: function set(value) {
	            this._style.color = value;
	            this.updateText();
	        }
	    }, {
	        key: 'style',
	        get: function get() {
	            return this._style;
	        },
	        set: function set(value) {
	            this._style = value;
	            this.updateText();
	        }
	    }]);
	
	    return Text;
	}(PIXI.mesh.Mesh);
	
	exports.default = Text;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform vec3 u_color;\nuniform sampler2D uSampler;\nuniform float u_alpha;\n\nvoid main(void)\n{\n    float u_buffer = .7;\n    float u_gamma = 1. / 64.;\n    float u_debug = 0.0;\n    //vec4 u_color = vec4(.2, .3, .4, 1.);\n\n    float dist = texture2D(uSampler, vTextureCoord).r;\n    dist = dist * texture2D(uSampler, vTextureCoord).a;\n    if (u_debug > 0.0) {\n        gl_FragColor = vec4(dist, dist, dist, 1);\n    } else {\n        float alpha = smoothstep(u_buffer - u_gamma, u_buffer + u_gamma, dist);\n\n        vec3 color = u_color * alpha;\n\n        gl_FragColor = vec4(color, alpha);\n    }\n}\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n}\n"

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzI0OGY2MmE2Y2Q4MTdiMmM5NmYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy90ZXh0LmpzIiwid2VicGFjazovLy8uL3NyYy9zZGYuZnJhZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2RmLnZlcnQiXSwibmFtZXMiOlsidmVydFNoYWRlciIsInJlcXVpcmUiLCJmcmFnU2hhZGVyIiwiZ2xDb3JlIiwiUElYSSIsIlNERlJlbmRlcmVyIiwicmVuZGVyZXIiLCJzaGFkZXIiLCJnbCIsIlNoYWRlciIsInNkZlRleHQiLCJ0ZXh0dXJlIiwiX3RleHR1cmUiLCJ2YWxpZCIsImdsRGF0YSIsIl9nbERhdGFzIiwiQ09OVEVYVF9VSUQiLCJiaW5kVmFvIiwidmVydGV4QnVmZmVyIiwiR0xCdWZmZXIiLCJjcmVhdGVWZXJ0ZXhCdWZmZXIiLCJ2ZXJ0aWNlcyIsIlNUUkVBTV9EUkFXIiwidXZCdWZmZXIiLCJ1dnMiLCJpbmRleEJ1ZmZlciIsImNyZWF0ZUluZGV4QnVmZmVyIiwiaW5kaWNlcyIsIlNUQVRJQ19EUkFXIiwidmFvIiwiZGlydHkiLCJpbmRleERpcnR5IiwiVmVydGV4QXJyYXlPYmplY3QiLCJhZGRJbmRleCIsImFkZEF0dHJpYnV0ZSIsImF0dHJpYnV0ZXMiLCJhVmVydGV4UG9zaXRpb24iLCJGTE9BVCIsImFUZXh0dXJlQ29vcmQiLCJ1cGxvYWQiLCJiaW5kU2hhZGVyIiwidW5pZm9ybXMiLCJ1U2FtcGxlciIsImJpbmRUZXh0dXJlIiwic3RhdGUiLCJzZXRCbGVuZE1vZGUiLCJibGVuZE1vZGUiLCJ0cmFuc2xhdGlvbk1hdHJpeCIsIndvcmxkVHJhbnNmb3JtIiwidG9BcnJheSIsInVfYWxwaGEiLCJ3b3JsZEFscGhhIiwidV9jb2xvciIsImNvbG9yIiwiZHJhd0FycmF5cyIsIlRSSUFOR0xFUyIsImxlbmd0aCIsIk9iamVjdFJlbmRlcmVyIiwiV2ViR0xSZW5kZXJlciIsInJlZ2lzdGVyUGx1Z2luIiwic2RmIiwiVGV4dCIsInNoYWRlckNvZGUiLCJNZXNoIiwibWVzaCIsIk9ic2VydmFibGVQb2ludCIsImNyZWF0ZUluZGljZXNGb3JRdWFkcyIsInRleHQiLCJzdHlsZSIsIl90ZXh0IiwiX3N0eWxlIiwicGx1Z2luTmFtZSIsInVwZGF0ZVRleHQiLCJjaHIiLCJwZW4iLCJzaXplIiwibWV0cmljIiwibWV0cmljcyIsImNoYXJzIiwic2NhbGUiLCJmYWN0b3IiLCJ3aWR0aCIsImhlaWdodCIsImhvcmlCZWFyaW5nWCIsImhvcmlCZWFyaW5nWSIsImhvcmlBZHZhbmNlIiwicG9zWCIsInBvc1kiLCJidWZmZXIiLCJwdXNoIiwieCIsInkiLCJ0ZXhXaWR0aCIsImJhc2VUZXh0dXJlIiwidGV4SGVpZ2h0IiwiaSIsImRyYXdHbHlwaCIsImZvbnRTaXplIiwiRmxvYXQzMkFycmF5IiwidmFsdWUiLCJoZXhDb2xvciIsInV0aWxzIiwiaGV4MnJnYiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7Ozs7Ozs7Ozs7OztBQUVBLEtBQUlBLGFBQWEsbUJBQUFDLENBQVEsQ0FBUixDQUFqQjtBQUNBLEtBQUlDLGFBQWEsbUJBQUFELENBQVEsQ0FBUixDQUFqQjs7QUFFQSxLQUFJRSxTQUFTQyxLQUFLRCxNQUFsQjs7S0FFYUUsVyxXQUFBQSxXOzs7QUFFVCwwQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBLCtIQUNaQSxRQURZOztBQUVsQixlQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUZrQjtBQUdyQjs7OzsyQ0FFaUI7QUFDZCxpQkFBSUMsS0FBSyxLQUFLRixRQUFMLENBQWNFLEVB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cUIsUUFBcEM7QUFDQSxpQkFBSUEsUUFBUWpELEtBQUtpRyxLQUFMLENBQVdDLE9BQVgsQ0FBbUJGLFFBQW5CLENBQVo7QUFDQSxvQkFBTy9DLEtBQVA7QUFDSCxVOzJCQUVTOEMsSyxFQUFPO0FBQ2Isa0JBQUs3QixNQUFMLENBQVlqQixLQUFaLEdBQW9COEMsS0FBcEI7QUFDQSxrQkFBSzNCLFVBQUw7QUFDSDs7OzZCQUVXO0FBQ1Isb0JBQU8sS0FBS0YsTUFBWjtBQUNILFU7MkJBRVM2QixLLEVBQU87QUFDYixrQkFBSzdCLE1BQUwsR0FBYzZCLEtBQWQ7QUFDQSxrQkFBSzNCLFVBQUw7QUFDSDs7OztHQXhHNkJwRSxLQUFLNEQsSUFBTCxDQUFVRCxJOzttQkFBdkJGLEk7Ozs7OztBQ05yQixpRUFBZ0UsdUJBQXVCLDZCQUE2Qix3QkFBd0Isc0JBQXNCLDBCQUEwQiwrQkFBK0IsMEJBQTBCLDRDQUE0QywwREFBMEQseURBQXlELDBCQUEwQixtREFBbUQsT0FBTyxPQUFPLGlGQUFpRix5Q0FBeUMsOENBQThDLE9BQU8sR0FBRyxHOzs7Ozs7QUNBanFCLHFFQUFvRSwrQkFBK0IsbUNBQW1DLGdDQUFnQywrQkFBK0Isc0JBQXNCLDJHQUEyRyxzQ0FBc0MsR0FBRyxHIiwiZmlsZSI6InBpeGktc2RmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzI0OGY2MmE2Y2Q4MTdiMmM5NmYiLCJpbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xuXG5sZXQgdmVydFNoYWRlciA9IHJlcXVpcmUoJy4vc2RmLnZlcnQnKTtcbmxldCBmcmFnU2hhZGVyID0gcmVxdWlyZSgnLi9zZGYuZnJhZycpO1xuXG5sZXQgZ2xDb3JlID0gUElYSS5nbENvcmU7XG5cbmV4cG9ydCBjbGFzcyBTREZSZW5kZXJlciBleHRlbmRzIFBJWEkuT2JqZWN0UmVuZGVyZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVuZGVyZXIpIHtcbiAgICAgICAgc3VwZXIocmVuZGVyZXIpO1xuICAgICAgICB0aGlzLnNoYWRlciA9IG51bGw7XG4gICAgfVxuXG4gICAgb25Db250ZXh0Q2hhbmdlKCkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xuICAgICAgICB0aGlzLnNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgdmVydFNoYWRlciwgZnJhZ1NoYWRlcik7XG4gICAgfVxuXG4gICAgcmVuZGVyKHNkZlRleHQpIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyO1xuICAgICAgICBjb25zdCBnbCA9IHJlbmRlcmVyLmdsO1xuICAgICAgICBjb25zdCB0ZXh0dXJlID0gc2RmVGV4dC5fdGV4dHVyZTtcblxuICAgICAgICBpZiAoIXRleHR1cmUudmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBnbERhdGEgPSBzZGZUZXh0Ll9nbERhdGFzW3JlbmRlcmVyLkNPTlRFWFRfVUlEXTtcblxuICAgICAgICBpZiAoIWdsRGF0YSkge1xuICAgICAgICAgICAgcmVuZGVyZXIuYmluZFZhbyhudWxsKTtcblxuICAgICAgICAgICAgZ2xEYXRhID0ge1xuICAgICAgICAgICAgICAgIHNoYWRlcjogdGhpcy5zaGFkZXIsXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyOiBnbENvcmUuR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBzZGZUZXh0LnZlcnRpY2VzLCBnbC5TVFJFQU1fRFJBVyksXG4gICAgICAgICAgICAgICAgdXZCdWZmZXI6IGdsQ29yZS5HTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIHNkZlRleHQudXZzLCBnbC5TVFJFQU1fRFJBVyksXG4gICAgICAgICAgICAgICAgaW5kZXhCdWZmZXI6IGdsQ29yZS5HTEJ1ZmZlci5jcmVhdGVJbmRleEJ1ZmZlcihnbCwgc2RmVGV4dC5pbmRpY2VzLCBnbC5TVEFUSUNfRFJBVyksXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgdGhlIHZhbyBvYmplY3QgdGhhdCB3aWxsIHJlbmRlci4uXG4gICAgICAgICAgICAgICAgdmFvOiBudWxsLFxuICAgICAgICAgICAgICAgIGRpcnR5OiBzZGZUZXh0LmRpcnR5LFxuICAgICAgICAgICAgICAgIGluZGV4RGlydHk6IHNkZlRleHQuaW5kZXhEaXJ0eSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGJ1aWxkIHRoZSB2YW8gb2JqZWN0IHRoYXQgd2lsbCByZW5kZXIuLlxuICAgICAgICAgICAgZ2xEYXRhLnZhbyA9IG5ldyBnbENvcmUuVmVydGV4QXJyYXlPYmplY3QoZ2wpXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KGdsRGF0YS5pbmRleEJ1ZmZlcilcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKGdsRGF0YS52ZXJ0ZXhCdWZmZXIsIGdsRGF0YS5zaGFkZXIuYXR0cmlidXRlcy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgMiAqIDQsIDApXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZShnbERhdGEudXZCdWZmZXIsIGdsRGF0YS5zaGFkZXIuYXR0cmlidXRlcy5hVGV4dHVyZUNvb3JkLCBnbC5GTE9BVCwgZmFsc2UsIDIgKiA0LCAwKTtcblxuICAgICAgICAgICAgc2RmVGV4dC5fZ2xEYXRhc1tyZW5kZXJlci5DT05URVhUX1VJRF0gPSBnbERhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJlci5iaW5kVmFvKGdsRGF0YS52YW8pO1xuXG4gICAgICAgIGlmIChzZGZUZXh0LmRpcnR5ICE9PSBnbERhdGEuZGlydHkpIHtcbiAgICAgICAgICAgIGdsRGF0YS5kaXJ0eSA9IHNkZlRleHQuZGlydHk7XG4gICAgICAgICAgICBnbERhdGEudXZCdWZmZXIudXBsb2FkKHNkZlRleHQudXZzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZGZUZXh0LmluZGV4RGlydHkgIT09IGdsRGF0YS5pbmRleERpcnR5KSB7XG4gICAgICAgICAgICBnbERhdGEuaW5kZXhEaXJ0eSA9IHNkZlRleHQuaW5kZXhEaXJ0eTtcbiAgICAgICAgICAgIGdsRGF0YS5pbmRleEJ1ZmZlci51cGxvYWQoc2RmVGV4dC5pbmRpY2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdsRGF0YS52ZXJ0ZXhCdWZmZXIudXBsb2FkKHNkZlRleHQudmVydGljZXMpO1xuXG4gICAgICAgIHJlbmRlcmVyLmJpbmRTaGFkZXIoZ2xEYXRhLnNoYWRlcik7XG5cbiAgICAgICAgZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy51U2FtcGxlciA9IHJlbmRlcmVyLmJpbmRUZXh0dXJlKHRleHR1cmUpO1xuXG4gICAgICAgIHJlbmRlcmVyLnN0YXRlLnNldEJsZW5kTW9kZShzZGZUZXh0LmJsZW5kTW9kZSk7XG5cbiAgICAgICAgZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy50cmFuc2xhdGlvbk1hdHJpeCA9IHNkZlRleHQud29ybGRUcmFuc2Zvcm0udG9BcnJheSh0cnVlKTtcbiAgICAgICAgZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy51X2FscGhhID0gc2RmVGV4dC53b3JsZEFscGhhO1xuICAgICAgICBnbERhdGEuc2hhZGVyLnVuaWZvcm1zLnVfY29sb3IgPSBzZGZUZXh0LmNvbG9yO1xuICAgICAgICAvL2dsRGF0YS5zaGFkZXIudW5pZm9ybXMudGludCA9IHNkZlRleHQudGludFJnYjtcblxuICAgICAgICAvL2NvbnN0IGRyYXdNb2RlID0gc2RmVGV4dC5kcmF3TW9kZSA9PT0gTWVzaC5EUkFXX01PREVTLlRSSUFOR0xFX01FU0ggPyBnbC5UUklBTkdMRV9TVFJJUCA6IGdsLlRSSUFOR0xFUztcbiAgICAgICAgLy9nbERhdGEudmFvLmRyYXcoZHJhd01vZGUsIHNkZlRleHQuaW5kaWNlcy5sZW5ndGgsIDApO1xuXG4gICAgICAgIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCBzZGZUZXh0LnV2cy5sZW5ndGggLyAyKTtcbiAgICB9XG59XG5cblBJWEkuV2ViR0xSZW5kZXJlci5yZWdpc3RlclBsdWdpbignc2RmJywgU0RGUmVuZGVyZXIpO1xuXG5QSVhJLnNkZiA9IHt9O1xuUElYSS5zZGYuVGV4dCA9IFRleHQ7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJsZXQgTWVzaCA9IFBJWEkubWVzaC5NZXNoO1xubGV0IE9ic2VydmFibGVQb2ludCA9IFBJWEkuT2JzZXJ2YWJsZVBvaW50O1xubGV0IGNyZWF0ZUluZGljZXNGb3JRdWFkcyA9IFBJWEkuY3JlYXRlSW5kaWNlc0ZvclF1YWRzO1xuXG5pbXBvcnQgKiBhcyBzaGFkZXJDb2RlIGZyb20gJy4vc2RmLmZyYWcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IGV4dGVuZHMgUElYSS5tZXNoLk1lc2hcbntcblxuICAgIGNvbnN0cnVjdG9yKHRleHQsIHN0eWxlID0ge30pXG4gICAge1xuICAgICAgICBzdXBlcihzdHlsZS50ZXh0dXJlKTtcblxuICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5fc3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHN0eWxlLnRleHR1cmU7XG5cbiAgICAgICAgdGhpcy5wbHVnaW5OYW1lID0gJ3NkZic7XG5cbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XG4gICAgfVxuXG4gICAgZHJhd0dseXBoKGNociwgdmVydGljZXMsIHV2cywgcGVuLCBzaXplKSB7XG4gICAgICAgIGNvbnN0IG1ldHJpYyA9IHRoaXMuX3N0eWxlLm1ldHJpY3MuY2hhcnNbY2hyXTtcbiAgICAgICAgaWYgKCFtZXRyaWMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBzY2FsZSA9IHNpemUgLyB0aGlzLl9zdHlsZS5tZXRyaWNzLnNpemU7XG4gICAgICAgIGNvbnN0IGZhY3RvciA9IDE7XG4gICAgICAgIGxldCB3aWR0aCA9IG1ldHJpY1swXTtcbiAgICAgICAgbGV0IGhlaWdodCA9IG1ldHJpY1sxXTtcbiAgICAgICAgY29uc3QgaG9yaUJlYXJpbmdYID0gbWV0cmljWzJdO1xuICAgICAgICBjb25zdCBob3JpQmVhcmluZ1kgPSBtZXRyaWNbM107XG4gICAgICAgIGNvbnN0IGhvcmlBZHZhbmNlID0gbWV0cmljWzRdO1xuICAgICAgICBjb25zdCBwb3NYID0gbWV0cmljWzVdO1xuICAgICAgICBjb25zdCBwb3NZID0gbWV0cmljWzZdO1xuXG4gICAgICAgIGlmICh3aWR0aCA+IDAgJiYgaGVpZ2h0ID4gMCkge1xuICAgICAgICAgICAgd2lkdGggKz0gdGhpcy5fc3R5bGUubWV0cmljcy5idWZmZXIgKiAyO1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyICogMjtcblxuICAgICAgICAgICAgLy8gQWRkIGEgcXVhZCAoPSB0d28gdHJpYW5nbGVzKSBwZXIgZ2x5cGguXG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKFxuICAgICAgICAgICAgICAgIChmYWN0b3IgKiAocGVuLnggKyAoKGhvcmlCZWFyaW5nWCAtIHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyKSAqIHNjYWxlKSkpLCAoZmFjdG9yICogKHBlbi55IC0gaG9yaUJlYXJpbmdZICogc2NhbGUpKSxcbiAgICAgICAgICAgICAgICAoZmFjdG9yICogKHBlbi54ICsgKChob3JpQmVhcmluZ1ggLSB0aGlzLl9zdHlsZS5tZXRyaWNzLmJ1ZmZlciArIHdpZHRoKSAqIHNjYWxlKSkpLCAoZmFjdG9yICogKHBlbi55IC0gaG9yaUJlYXJpbmdZICogc2NhbGUpKSxcbiAgICAgICAgICAgICAgICAoZmFjdG9yICogKHBlbi54ICsgKChob3JpQmVhcmluZ1ggLSB0aGlzLl9zdHlsZS5tZXRyaWNzLmJ1ZmZlcikgKiBzY2FsZSkpKSwgKGZhY3RvciAqIChwZW4ueSArIChoZWlnaHQgLSBob3JpQmVhcmluZ1kpICogc2NhbGUpKSxcblxuICAgICAgICAgICAgICAgIChmYWN0b3IgKiAocGVuLnggKyAoKGhvcmlCZWFyaW5nWCAtIHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyICsgd2lkdGgpICogc2NhbGUpKSksIChmYWN0b3IgKiAocGVuLnkgLSBob3JpQmVhcmluZ1kgKiBzY2FsZSkpLFxuICAgICAgICAgICAgICAgIChmYWN0b3IgKiAocGVuLnggKyAoKGhvcmlCZWFyaW5nWCAtIHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyKSAqIHNjYWxlKSkpLCAoZmFjdG9yICogKHBlbi55ICsgKGhlaWdodCAtIGhvcmlCZWFyaW5nWSkgKiBzY2FsZSkpLFxuICAgICAgICAgICAgICAgIChmYWN0b3IgKiAocGVuLnggKyAoKGhvcmlCZWFyaW5nWCAtIHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyICsgd2lkdGgpICogc2NhbGUpKSksIChmYWN0b3IgKiAocGVuLnkgKyAoaGVpZ2h0IC0gaG9yaUJlYXJpbmdZKSAqIHNjYWxlKSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGxldCB0ZXhXaWR0aCA9IHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS53aWR0aDtcbiAgICAgICAgICAgIGxldCB0ZXhIZWlnaHQgPSB0aGlzLnRleHR1cmUuYmFzZVRleHR1cmUuaGVpZ2h0O1xuXG4gICAgICAgICAgICB1dnMucHVzaChcbiAgICAgICAgICAgICAgICBwb3NYIC8gdGV4V2lkdGgsIHBvc1kgLyB0ZXhIZWlnaHQsXG4gICAgICAgICAgICAgICAgKHBvc1ggKyB3aWR0aCkgLyB0ZXhXaWR0aCwgcG9zWSAvIHRleEhlaWdodCxcbiAgICAgICAgICAgICAgICBwb3NYIC8gdGV4V2lkdGgsIChwb3NZICsgaGVpZ2h0KSAvIHRleEhlaWdodCxcblxuICAgICAgICAgICAgICAgIChwb3NYICsgd2lkdGgpIC8gdGV4V2lkdGgsIHBvc1kgLyB0ZXhIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9zWCAvIHRleFdpZHRoLCAocG9zWSArIGhlaWdodCkgLyB0ZXhIZWlnaHQsXG4gICAgICAgICAgICAgICAgKHBvc1ggKyB3aWR0aCkgLyB0ZXhXaWR0aCwgKHBvc1kgKyBoZWlnaHQpIC8gdGV4SGVpZ2h0XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcGVuLnggPSBwZW4ueCArIGhvcmlBZHZhbmNlICogc2NhbGU7XG4gICAgfVxuXG4gICAgdXBkYXRlVGV4dCgpXG4gICAge1xuICAgICAgICB2YXIgcGVuID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICAgICAgICB2YXIgaW5kaWNlcyA9IFtdO1xuICAgICAgICB2YXIgdXZzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdHbHlwaCh0aGlzLl90ZXh0W2ldLCB2ZXJ0aWNlcywgdXZzLCBwZW4sIHRoaXMuZm9udFNpemUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpO1xuICAgICAgICB0aGlzLnV2cyA9IG5ldyBGbG9hdDMyQXJyYXkodXZzKTtcbiAgICB9XG5cbiAgICBnZXQgZm9udFNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgICB9XG5cbiAgICBzZXQgZm9udFNpemUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc3R5bGUuZm9udFNpemUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XG4gICAgfVxuXG4gICAgZ2V0IGNvbG9yKCkge1xuICAgICAgICBsZXQgaGV4Q29sb3IgPSB0aGlzLl9zdHlsZS5jb2xvciB8fCAweDAwMDAwMDtcbiAgICAgICAgbGV0IGNvbG9yID0gUElYSS51dGlscy5oZXgycmdiKGhleENvbG9yKTtcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cblxuICAgIHNldCBjb2xvcih2YWx1ZSkge1xuICAgICAgICB0aGlzLl9zdHlsZS5jb2xvciA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVRleHQoKTtcbiAgICB9XG5cbiAgICBnZXQgc3R5bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHlsZTtcbiAgICB9XG5cbiAgICBzZXQgc3R5bGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc3R5bGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90ZXh0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIiNkZWZpbmUgR0xTTElGWSAxXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxudW5pZm9ybSB2ZWMzIHVfY29sb3I7XFxudW5pZm9ybSBzYW1wbGVyMkQgdVNhbXBsZXI7XFxudW5pZm9ybSBmbG9hdCB1X2FscGhhO1xcblxcbnZvaWQgbWFpbih2b2lkKVxcbntcXG4gICAgZmxvYXQgdV9idWZmZXIgPSAuNztcXG4gICAgZmxvYXQgdV9nYW1tYSA9IDEuIC8gNjQuO1xcbiAgICBmbG9hdCB1X2RlYnVnID0gMC4wO1xcbiAgICAvL3ZlYzQgdV9jb2xvciA9IHZlYzQoLjIsIC4zLCAuNCwgMS4pO1xcblxcbiAgICBmbG9hdCBkaXN0ID0gdGV4dHVyZTJEKHVTYW1wbGVyLCB2VGV4dHVyZUNvb3JkKS5yO1xcbiAgICBkaXN0ID0gZGlzdCAqIHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkuYTtcXG4gICAgaWYgKHVfZGVidWcgPiAwLjApIHtcXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoZGlzdCwgZGlzdCwgZGlzdCwgMSk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgICBmbG9hdCBhbHBoYSA9IHNtb290aHN0ZXAodV9idWZmZXIgLSB1X2dhbW1hLCB1X2J1ZmZlciArIHVfZ2FtbWEsIGRpc3QpO1xcblxcbiAgICAgICAgdmVjMyBjb2xvciA9IHVfY29sb3IgKiBhbHBoYTtcXG5cXG4gICAgICAgIGdsX0ZyYWdDb2xvciA9IHZlYzQoY29sb3IsIGFscGhhKTtcXG4gICAgfVxcbn1cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NkZi5mcmFnXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIjZGVmaW5lIEdMU0xJRlkgMVxcbmF0dHJpYnV0ZSB2ZWMyIGFWZXJ0ZXhQb3NpdGlvbjtcXG5hdHRyaWJ1dGUgdmVjMiBhVGV4dHVyZUNvb3JkO1xcblxcbnVuaWZvcm0gbWF0MyB0cmFuc2xhdGlvbk1hdHJpeDtcXG51bmlmb3JtIG1hdDMgcHJvamVjdGlvbk1hdHJpeDtcXG5cXG52YXJ5aW5nIHZlYzIgdlRleHR1cmVDb29yZDtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGdsX1Bvc2l0aW9uID0gdmVjNCgocHJvamVjdGlvbk1hdHJpeCAqIHRyYW5zbGF0aW9uTWF0cml4ICogdmVjMyhhVmVydGV4UG9zaXRpb24sIDEuMCkpLnh5LCAwLjAsIDEuMCk7XFxuXFxuICAgIHZUZXh0dXJlQ29vcmQgPSBhVGV4dHVyZUNvb3JkO1xcbn1cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NkZi52ZXJ0XG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=