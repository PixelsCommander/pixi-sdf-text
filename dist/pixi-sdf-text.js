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
	            glData.shader.uniforms.u_fontSize = sdfText.fontSize;
	            glData.shader.uniforms.u_buffer = sdfText.style.buffer;
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

	module.exports = "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform vec3 u_color;\nuniform sampler2D uSampler;\nuniform float u_alpha;\nuniform float u_fontSize;\nuniform float u_buffer;\n\nvoid main(void)\n{\n    float u_buffer = .7;\n    float u_gamma = 1. / u_fontSize * 2.;\n    float u_debug = 0.0;\n    //vec4 u_color = vec4(.2, .3, .4, 1.);\n\n    float dist = texture2D(uSampler, vTextureCoord).r;\n    dist = dist * texture2D(uSampler, vTextureCoord).a;\n    if (u_debug > 0.0) {\n        gl_FragColor = vec4(dist, dist, dist, 1);\n    } else {\n        float alpha = smoothstep(u_buffer - u_gamma, u_buffer + u_gamma, dist);\n\n        vec3 color = u_color * alpha;\n\n        gl_FragColor = vec4(color, alpha);\n    }\n}\n"

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 translationMatrix;\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n}\n"

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFlOTMxNDAwYzJjOTA4OTk1NzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy90ZXh0LmpzIiwid2VicGFjazovLy8uL3NyYy9zZGYuZnJhZyIsIndlYnBhY2s6Ly8vLi9zcmMvc2RmLnZlcnQiXSwibmFtZXMiOlsidmVydFNoYWRlciIsInJlcXVpcmUiLCJmcmFnU2hhZGVyIiwiZ2xDb3JlIiwiUElYSSIsIlNERlJlbmRlcmVyIiwicmVuZGVyZXIiLCJzaGFkZXIiLCJnbCIsIlNoYWRlciIsInNkZlRleHQiLCJ0ZXh0dXJlIiwiX3RleHR1cmUiLCJ2YWxpZCIsImdsRGF0YSIsIl9nbERhdGFzIiwiQ09OVEVYVF9VSUQiLCJiaW5kVmFvIiwidmVydGV4QnVmZmVyIiwiR0xCdWZmZXIiLCJjcmVhdGVWZXJ0ZXhCdWZmZXIiLCJ2ZXJ0aWNlcyIsIlNUUkVBTV9EUkFXIiwidXZCdWZmZXIiLCJ1dnMiLCJpbmRleEJ1ZmZlciIsImNyZWF0ZUluZGV4QnVmZmVyIiwiaW5kaWNlcyIsIlNUQVRJQ19EUkFXIiwidmFvIiwiZGlydHkiLCJpbmRleERpcnR5IiwiVmVydGV4QXJyYXlPYmplY3QiLCJhZGRJbmRleCIsImFkZEF0dHJpYnV0ZSIsImF0dHJpYnV0ZXMiLCJhVmVydGV4UG9zaXRpb24iLCJGTE9BVCIsImFUZXh0dXJlQ29vcmQiLCJ1cGxvYWQiLCJiaW5kU2hhZGVyIiwidW5pZm9ybXMiLCJ1U2FtcGxlciIsImJpbmRUZXh0dXJlIiwic3RhdGUiLCJzZXRCbGVuZE1vZGUiLCJibGVuZE1vZGUiLCJ0cmFuc2xhdGlvbk1hdHJpeCIsIndvcmxkVHJhbnNmb3JtIiwidG9BcnJheSIsInVfYWxwaGEiLCJ3b3JsZEFscGhhIiwidV9jb2xvciIsImNvbG9yIiwidV9mb250U2l6ZSIsImZvbnRTaXplIiwidV9idWZmZXIiLCJzdHlsZSIsImJ1ZmZlciIsImRyYXdBcnJheXMiLCJUUklBTkdMRVMiLCJsZW5ndGgiLCJPYmplY3RSZW5kZXJlciIsIldlYkdMUmVuZGVyZXIiLCJyZWdpc3RlclBsdWdpbiIsInNkZiIsIlRleHQiLCJzaGFkZXJDb2RlIiwiTWVzaCIsIm1lc2giLCJPYnNlcnZhYmxlUG9pbnQiLCJjcmVhdGVJbmRpY2VzRm9yUXVhZHMiLCJ0ZXh0IiwiX3RleHQiLCJfc3R5bGUiLCJwbHVnaW5OYW1lIiwidXBkYXRlVGV4dCIsImNociIsInBlbiIsInNpemUiLCJtZXRyaWMiLCJtZXRyaWNzIiwiY2hhcnMiLCJzY2FsZSIsImZhY3RvciIsIndpZHRoIiwiaGVpZ2h0IiwiaG9yaUJlYXJpbmdYIiwiaG9yaUJlYXJpbmdZIiwiaG9yaUFkdmFuY2UiLCJwb3NYIiwicG9zWSIsInB1c2giLCJ4IiwieSIsInRleFdpZHRoIiwiYmFzZVRleHR1cmUiLCJ0ZXhIZWlnaHQiLCJpIiwiZHJhd0dseXBoIiwiRmxvYXQzMkFycmF5IiwidmFsdWUiLCJoZXhDb2xvciIsInV0aWxzIiwiaGV4MnJnYiJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0Q0E7Ozs7Ozs7Ozs7OztBQUVBLEtBQUlBLGFBQWEsbUJBQUFDLENBQVEsQ0FBUixDQUFqQjtBQUNBLEtBQUlDLGFBQWEsbUJBQUFELENBQVEsQ0FBUixDQUFqQjs7QUFFQSxLQUFJRSxTQUFTQyxLQUFLRCxNQUFsQjs7S0FFYUUsVyxXQUFBQSxXOzs7QUFFVCwwQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUFBLCtIQUNaQSxRQURZOztBQUVsQixlQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUZrQjtBQUdyQjs7OzsyQ0FFaUI7QUFDZCxpQkFBSUMs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LE1BQUwsQ0FBWW5CLFFBQVosSUFBd0IsRUFBL0I7QUFDSCxVOzJCQUVZOEMsSyxFQUFPO0FBQ2hCLGtCQUFLM0IsTUFBTCxDQUFZbkIsUUFBWixHQUF1QjhDLEtBQXZCO0FBQ0Esa0JBQUt6QixVQUFMO0FBQ0g7Ozs2QkFFVztBQUNSLGlCQUFJMEIsV0FBVyxLQUFLNUIsTUFBTCxDQUFZckIsS0FBWixJQUFxQixRQUFwQztBQUNBLGlCQUFJQSxRQUFRakQsS0FBS21HLEtBQUwsQ0FBV0MsT0FBWCxDQUFtQkYsUUFBbkIsQ0FBWjtBQUNBLG9CQUFPakQsS0FBUDtBQUNILFU7MkJBRVNnRCxLLEVBQU87QUFDYixrQkFBSzNCLE1BQUwsQ0FBWXJCLEtBQVosR0FBb0JnRCxLQUFwQjtBQUNBLGtCQUFLekIsVUFBTDtBQUNIOzs7NkJBRVc7QUFDUixvQkFBTyxLQUFLRixNQUFaO0FBQ0gsVTsyQkFFUzJCLEssRUFBTztBQUNiLGtCQUFLM0IsTUFBTCxHQUFjMkIsS0FBZDtBQUNBLGtCQUFLekIsVUFBTDtBQUNIOzs7O0dBckc2QnhFLEtBQUtpRSxJQUFMLENBQVVELEk7O21CQUF2QkYsSTs7Ozs7O0FDTnJCLGlFQUFnRSx1QkFBdUIsNkJBQTZCLHdCQUF3QiwyQkFBMkIseUJBQXlCLHNCQUFzQiwwQkFBMEIsMkNBQTJDLDBCQUEwQiw0Q0FBNEMsMERBQTBELHlEQUF5RCwwQkFBMEIsbURBQW1ELE9BQU8sT0FBTyxpRkFBaUYseUNBQXlDLDhDQUE4QyxPQUFPLEdBQUcsRzs7Ozs7O0FDQWp1QixxRUFBb0UsK0JBQStCLG1DQUFtQyxnQ0FBZ0MsK0JBQStCLHNCQUFzQiwyR0FBMkcsc0NBQXNDLEdBQUcsRyIsImZpbGUiOiJwaXhpLXNkZi10ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYjFlOTMxNDAwYzJjOTA4OTk1NzkiLCJpbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xuXG5sZXQgdmVydFNoYWRlciA9IHJlcXVpcmUoJy4vc2RmLnZlcnQnKTtcbmxldCBmcmFnU2hhZGVyID0gcmVxdWlyZSgnLi9zZGYuZnJhZycpO1xuXG5sZXQgZ2xDb3JlID0gUElYSS5nbENvcmU7XG5cbmV4cG9ydCBjbGFzcyBTREZSZW5kZXJlciBleHRlbmRzIFBJWEkuT2JqZWN0UmVuZGVyZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVuZGVyZXIpIHtcbiAgICAgICAgc3VwZXIocmVuZGVyZXIpO1xuICAgICAgICB0aGlzLnNoYWRlciA9IG51bGw7XG4gICAgfVxuXG4gICAgb25Db250ZXh0Q2hhbmdlKCkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLnJlbmRlcmVyLmdsO1xuICAgICAgICB0aGlzLnNoYWRlciA9IG5ldyBQSVhJLlNoYWRlcihnbCwgdmVydFNoYWRlciwgZnJhZ1NoYWRlcik7XG4gICAgfVxuXG4gICAgcmVuZGVyKHNkZlRleHQpIHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVyO1xuICAgICAgICBjb25zdCBnbCA9IHJlbmRlcmVyLmdsO1xuICAgICAgICBjb25zdCB0ZXh0dXJlID0gc2RmVGV4dC5fdGV4dHVyZTtcblxuICAgICAgICBpZiAoIXRleHR1cmUudmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBnbERhdGEgPSBzZGZUZXh0Ll9nbERhdGFzW3JlbmRlcmVyLkNPTlRFWFRfVUlEXTtcblxuICAgICAgICBpZiAoIWdsRGF0YSkge1xuICAgICAgICAgICAgcmVuZGVyZXIuYmluZFZhbyhudWxsKTtcblxuICAgICAgICAgICAgZ2xEYXRhID0ge1xuICAgICAgICAgICAgICAgIHNoYWRlcjogdGhpcy5zaGFkZXIsXG4gICAgICAgICAgICAgICAgdmVydGV4QnVmZmVyOiBnbENvcmUuR0xCdWZmZXIuY3JlYXRlVmVydGV4QnVmZmVyKGdsLCBzZGZUZXh0LnZlcnRpY2VzLCBnbC5TVFJFQU1fRFJBVyksXG4gICAgICAgICAgICAgICAgdXZCdWZmZXI6IGdsQ29yZS5HTEJ1ZmZlci5jcmVhdGVWZXJ0ZXhCdWZmZXIoZ2wsIHNkZlRleHQudXZzLCBnbC5TVFJFQU1fRFJBVyksXG4gICAgICAgICAgICAgICAgaW5kZXhCdWZmZXI6IGdsQ29yZS5HTEJ1ZmZlci5jcmVhdGVJbmRleEJ1ZmZlcihnbCwgc2RmVGV4dC5pbmRpY2VzLCBnbC5TVEFUSUNfRFJBVyksXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgdGhlIHZhbyBvYmplY3QgdGhhdCB3aWxsIHJlbmRlci4uXG4gICAgICAgICAgICAgICAgdmFvOiBudWxsLFxuICAgICAgICAgICAgICAgIGRpcnR5OiBzZGZUZXh0LmRpcnR5LFxuICAgICAgICAgICAgICAgIGluZGV4RGlydHk6IHNkZlRleHQuaW5kZXhEaXJ0eSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGJ1aWxkIHRoZSB2YW8gb2JqZWN0IHRoYXQgd2lsbCByZW5kZXIuLlxuICAgICAgICAgICAgZ2xEYXRhLnZhbyA9IG5ldyBnbENvcmUuVmVydGV4QXJyYXlPYmplY3QoZ2wpXG4gICAgICAgICAgICAgICAgLmFkZEluZGV4KGdsRGF0YS5pbmRleEJ1ZmZlcilcbiAgICAgICAgICAgICAgICAuYWRkQXR0cmlidXRlKGdsRGF0YS52ZXJ0ZXhCdWZmZXIsIGdsRGF0YS5zaGFkZXIuYXR0cmlidXRlcy5hVmVydGV4UG9zaXRpb24sIGdsLkZMT0FULCBmYWxzZSwgMiAqIDQsIDApXG4gICAgICAgICAgICAgICAgLmFkZEF0dHJpYnV0ZShnbERhdGEudXZCdWZmZXIsIGdsRGF0YS5zaGFkZXIuYXR0cmlidXRlcy5hVGV4dHVyZUNvb3JkLCBnbC5GTE9BVCwgZmFsc2UsIDIgKiA0LCAwKTtcblxuICAgICAgICAgICAgc2RmVGV4dC5fZ2xEYXRhc1tyZW5kZXJlci5DT05URVhUX1VJRF0gPSBnbERhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXJlci5iaW5kVmFvKGdsRGF0YS52YW8pO1xuXG4gICAgICAgIGlmIChzZGZUZXh0LmRpcnR5ICE9PSBnbERhdGEuZGlydHkpIHtcbiAgICAgICAgICAgIGdsRGF0YS5kaXJ0eSA9IHNkZlRleHQuZGlydHk7XG4gICAgICAgICAgICBnbERhdGEudXZCdWZmZXIudXBsb2FkKHNkZlRleHQudXZzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZGZUZXh0LmluZGV4RGlydHkgIT09IGdsRGF0YS5pbmRleERpcnR5KSB7XG4gICAgICAgICAgICBnbERhdGEuaW5kZXhEaXJ0eSA9IHNkZlRleHQuaW5kZXhEaXJ0eTtcbiAgICAgICAgICAgIGdsRGF0YS5pbmRleEJ1ZmZlci51cGxvYWQoc2RmVGV4dC5pbmRpY2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdsRGF0YS52ZXJ0ZXhCdWZmZXIudXBsb2FkKHNkZlRleHQudmVydGljZXMpO1xuXG4gICAgICAgIHJlbmRlcmVyLmJpbmRTaGFkZXIoZ2xEYXRhLnNoYWRlcik7XG5cbiAgICAgICAgZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy51U2FtcGxlciA9IHJlbmRlcmVyLmJpbmRUZXh0dXJlKHRleHR1cmUpO1xuXG4gICAgICAgIHJlbmRlcmVyLnN0YXRlLnNldEJsZW5kTW9kZShzZGZUZXh0LmJsZW5kTW9kZSk7XG5cbiAgICAgICAgZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy50cmFuc2xhdGlvbk1hdHJpeCA9IHNkZlRleHQud29ybGRUcmFuc2Zvcm0udG9BcnJheSh0cnVlKTtcbiAgICAgICAgZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy51X2FscGhhID0gc2RmVGV4dC53b3JsZEFscGhhO1xuICAgICAgICBnbERhdGEuc2hhZGVyLnVuaWZvcm1zLnVfY29sb3IgPSBzZGZUZXh0LmNvbG9yO1xuICAgICAgICBnbERhdGEuc2hhZGVyLnVuaWZvcm1zLnVfZm9udFNpemUgPSBzZGZUZXh0LmZvbnRTaXplO1xuICAgICAgICBnbERhdGEuc2hhZGVyLnVuaWZvcm1zLnVfYnVmZmVyID0gc2RmVGV4dC5zdHlsZS5idWZmZXI7XG4gICAgICAgIC8vZ2xEYXRhLnNoYWRlci51bmlmb3Jtcy50aW50ID0gc2RmVGV4dC50aW50UmdiO1xuXG4gICAgICAgIC8vY29uc3QgZHJhd01vZGUgPSBzZGZUZXh0LmRyYXdNb2RlID09PSBNZXNoLkRSQVdfTU9ERVMuVFJJQU5HTEVfTUVTSCA/IGdsLlRSSUFOR0xFX1NUUklQIDogZ2wuVFJJQU5HTEVTO1xuICAgICAgICAvL2dsRGF0YS52YW8uZHJhdyhkcmF3TW9kZSwgc2RmVGV4dC5pbmRpY2VzLmxlbmd0aCwgMCk7XG5cbiAgICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIHNkZlRleHQudXZzLmxlbmd0aCAvIDIpO1xuICAgIH1cbn1cblxuUElYSS5XZWJHTFJlbmRlcmVyLnJlZ2lzdGVyUGx1Z2luKCdzZGYnLCBTREZSZW5kZXJlcik7XG5cblBJWEkuc2RmID0ge307XG5QSVhJLnNkZi5UZXh0ID0gVGV4dDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsImxldCBNZXNoID0gUElYSS5tZXNoLk1lc2g7XG5sZXQgT2JzZXJ2YWJsZVBvaW50ID0gUElYSS5PYnNlcnZhYmxlUG9pbnQ7XG5sZXQgY3JlYXRlSW5kaWNlc0ZvclF1YWRzID0gUElYSS5jcmVhdGVJbmRpY2VzRm9yUXVhZHM7XG5cbmltcG9ydCAqIGFzIHNoYWRlckNvZGUgZnJvbSAnLi9zZGYuZnJhZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQgZXh0ZW5kcyBQSVhJLm1lc2guTWVzaCB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0ZXh0LCBzdHlsZSA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHN0eWxlLnRleHR1cmUpO1xuXG4gICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLl9zdHlsZSA9IHN0eWxlO1xuICAgICAgICB0aGlzLl90ZXh0dXJlID0gc3R5bGUudGV4dHVyZTtcblxuICAgICAgICB0aGlzLnBsdWdpbk5hbWUgPSAnc2RmJztcblxuICAgICAgICB0aGlzLnVwZGF0ZVRleHQoKTtcbiAgICB9XG5cbiAgICBkcmF3R2x5cGgoY2hyLCB2ZXJ0aWNlcywgdXZzLCBwZW4sIHNpemUpIHtcbiAgICAgICAgY29uc3QgbWV0cmljID0gdGhpcy5fc3R5bGUubWV0cmljcy5jaGFyc1tjaHJdO1xuICAgICAgICBpZiAoIW1ldHJpYykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHNjYWxlID0gc2l6ZSAvIHRoaXMuX3N0eWxlLm1ldHJpY3Muc2l6ZTtcbiAgICAgICAgY29uc3QgZmFjdG9yID0gMTtcbiAgICAgICAgbGV0IHdpZHRoID0gbWV0cmljWzBdO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gbWV0cmljWzFdO1xuICAgICAgICBjb25zdCBob3JpQmVhcmluZ1ggPSBtZXRyaWNbMl07XG4gICAgICAgIGNvbnN0IGhvcmlCZWFyaW5nWSA9IG1ldHJpY1szXTtcbiAgICAgICAgY29uc3QgaG9yaUFkdmFuY2UgPSBtZXRyaWNbNF07XG4gICAgICAgIGNvbnN0IHBvc1ggPSBtZXRyaWNbNV07XG4gICAgICAgIGNvbnN0IHBvc1kgPSBtZXRyaWNbNl07XG5cbiAgICAgICAgaWYgKHdpZHRoID4gMCAmJiBoZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICB3aWR0aCArPSB0aGlzLl9zdHlsZS5tZXRyaWNzLmJ1ZmZlciAqIDI7XG4gICAgICAgICAgICBoZWlnaHQgKz0gdGhpcy5fc3R5bGUubWV0cmljcy5idWZmZXIgKiAyO1xuXG4gICAgICAgICAgICAvLyBBZGQgYSBxdWFkICg9IHR3byB0cmlhbmdsZXMpIHBlciBnbHlwaC5cbiAgICAgICAgICAgIHZlcnRpY2VzLnB1c2goXG4gICAgICAgICAgICAgICAgKGZhY3RvciAqIChwZW4ueCArICgoaG9yaUJlYXJpbmdYIC0gdGhpcy5fc3R5bGUubWV0cmljcy5idWZmZXIpICogc2NhbGUpKSksIChmYWN0b3IgKiAocGVuLnkgLSBob3JpQmVhcmluZ1kgKiBzY2FsZSkpLFxuICAgICAgICAgICAgICAgIChmYWN0b3IgKiAocGVuLnggKyAoKGhvcmlCZWFyaW5nWCAtIHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyICsgd2lkdGgpICogc2NhbGUpKSksIChmYWN0b3IgKiAocGVuLnkgLSBob3JpQmVhcmluZ1kgKiBzY2FsZSkpLFxuICAgICAgICAgICAgICAgIChmYWN0b3IgKiAocGVuLnggKyAoKGhvcmlCZWFyaW5nWCAtIHRoaXMuX3N0eWxlLm1ldHJpY3MuYnVmZmVyKSAqIHNjYWxlKSkpLCAoZmFjdG9yICogKHBlbi55ICsgKGhlaWdodCAtIGhvcmlCZWFyaW5nWSkgKiBzY2FsZSkpLFxuXG4gICAgICAgICAgICAgICAgKGZhY3RvciAqIChwZW4ueCArICgoaG9yaUJlYXJpbmdYIC0gdGhpcy5fc3R5bGUubWV0cmljcy5idWZmZXIgKyB3aWR0aCkgKiBzY2FsZSkpKSwgKGZhY3RvciAqIChwZW4ueSAtIGhvcmlCZWFyaW5nWSAqIHNjYWxlKSksXG4gICAgICAgICAgICAgICAgKGZhY3RvciAqIChwZW4ueCArICgoaG9yaUJlYXJpbmdYIC0gdGhpcy5fc3R5bGUubWV0cmljcy5idWZmZXIpICogc2NhbGUpKSksIChmYWN0b3IgKiAocGVuLnkgKyAoaGVpZ2h0IC0gaG9yaUJlYXJpbmdZKSAqIHNjYWxlKSksXG4gICAgICAgICAgICAgICAgKGZhY3RvciAqIChwZW4ueCArICgoaG9yaUJlYXJpbmdYIC0gdGhpcy5fc3R5bGUubWV0cmljcy5idWZmZXIgKyB3aWR0aCkgKiBzY2FsZSkpKSwgKGZhY3RvciAqIChwZW4ueSArIChoZWlnaHQgLSBob3JpQmVhcmluZ1kpICogc2NhbGUpKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbGV0IHRleFdpZHRoID0gdGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLndpZHRoO1xuICAgICAgICAgICAgbGV0IHRleEhlaWdodCA9IHRoaXMudGV4dHVyZS5iYXNlVGV4dHVyZS5oZWlnaHQ7XG5cbiAgICAgICAgICAgIHV2cy5wdXNoKFxuICAgICAgICAgICAgICAgIHBvc1ggLyB0ZXhXaWR0aCwgcG9zWSAvIHRleEhlaWdodCxcbiAgICAgICAgICAgICAgICAocG9zWCArIHdpZHRoKSAvIHRleFdpZHRoLCBwb3NZIC8gdGV4SGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc1ggLyB0ZXhXaWR0aCwgKHBvc1kgKyBoZWlnaHQpIC8gdGV4SGVpZ2h0LFxuXG4gICAgICAgICAgICAgICAgKHBvc1ggKyB3aWR0aCkgLyB0ZXhXaWR0aCwgcG9zWSAvIHRleEhlaWdodCxcbiAgICAgICAgICAgICAgICBwb3NYIC8gdGV4V2lkdGgsIChwb3NZICsgaGVpZ2h0KSAvIHRleEhlaWdodCxcbiAgICAgICAgICAgICAgICAocG9zWCArIHdpZHRoKSAvIHRleFdpZHRoLCAocG9zWSArIGhlaWdodCkgLyB0ZXhIZWlnaHRcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBwZW4ueCA9IHBlbi54ICsgaG9yaUFkdmFuY2UgKiBzY2FsZTtcbiAgICB9XG5cbiAgICB1cGRhdGVUZXh0KCkge1xuICAgICAgICB2YXIgcGVuID0ge3g6IDAsIHk6IDB9O1xuICAgICAgICB2YXIgdmVydGljZXMgPSBbXTtcbiAgICAgICAgdmFyIGluZGljZXMgPSBbXTtcbiAgICAgICAgdmFyIHV2cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdGV4dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5kcmF3R2x5cGgodGhpcy5fdGV4dFtpXSwgdmVydGljZXMsIHV2cywgcGVuLCB0aGlzLmZvbnRTaXplKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmVydGljZXMgPSBuZXcgRmxvYXQzMkFycmF5KHZlcnRpY2VzKTtcbiAgICAgICAgdGhpcy51dnMgPSBuZXcgRmxvYXQzMkFycmF5KHV2cyk7XG4gICAgfVxuXG4gICAgZ2V0IGZvbnRTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgfVxuXG4gICAgc2V0IGZvbnRTaXplKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3N0eWxlLmZvbnRTaXplID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlVGV4dCgpO1xuICAgIH1cblxuICAgIGdldCBjb2xvcigpIHtcbiAgICAgICAgbGV0IGhleENvbG9yID0gdGhpcy5fc3R5bGUuY29sb3IgfHwgMHgwMDAwMDA7XG4gICAgICAgIGxldCBjb2xvciA9IFBJWEkudXRpbHMuaGV4MnJnYihoZXhDb2xvcik7XG4gICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG5cbiAgICBzZXQgY29sb3IodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc3R5bGUuY29sb3IgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KCk7XG4gICAgfVxuXG4gICAgZ2V0IHN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGU7XG4gICAgfVxuXG4gICAgc2V0IHN0eWxlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3N0eWxlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlVGV4dCgpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdGV4dC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCIjZGVmaW5lIEdMU0xJRlkgMVxcbnZhcnlpbmcgdmVjMiB2VGV4dHVyZUNvb3JkO1xcbnVuaWZvcm0gdmVjMyB1X2NvbG9yO1xcbnVuaWZvcm0gc2FtcGxlcjJEIHVTYW1wbGVyO1xcbnVuaWZvcm0gZmxvYXQgdV9hbHBoYTtcXG51bmlmb3JtIGZsb2F0IHVfZm9udFNpemU7XFxudW5pZm9ybSBmbG9hdCB1X2J1ZmZlcjtcXG5cXG52b2lkIG1haW4odm9pZClcXG57XFxuICAgIGZsb2F0IHVfYnVmZmVyID0gLjc7XFxuICAgIGZsb2F0IHVfZ2FtbWEgPSAxLiAvIHVfZm9udFNpemUgKiAyLjtcXG4gICAgZmxvYXQgdV9kZWJ1ZyA9IDAuMDtcXG4gICAgLy92ZWM0IHVfY29sb3IgPSB2ZWM0KC4yLCAuMywgLjQsIDEuKTtcXG5cXG4gICAgZmxvYXQgZGlzdCA9IHRleHR1cmUyRCh1U2FtcGxlciwgdlRleHR1cmVDb29yZCkucjtcXG4gICAgZGlzdCA9IGRpc3QgKiB0ZXh0dXJlMkQodVNhbXBsZXIsIHZUZXh0dXJlQ29vcmQpLmE7XFxuICAgIGlmICh1X2RlYnVnID4gMC4wKSB7XFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGRpc3QsIGRpc3QsIGRpc3QsIDEpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgICAgZmxvYXQgYWxwaGEgPSBzbW9vdGhzdGVwKHVfYnVmZmVyIC0gdV9nYW1tYSwgdV9idWZmZXIgKyB1X2dhbW1hLCBkaXN0KTtcXG5cXG4gICAgICAgIHZlYzMgY29sb3IgPSB1X2NvbG9yICogYWxwaGE7XFxuXFxuICAgICAgICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBhbHBoYSk7XFxuICAgIH1cXG59XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zZGYuZnJhZ1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiI2RlZmluZSBHTFNMSUZZIDFcXG5hdHRyaWJ1dGUgdmVjMiBhVmVydGV4UG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYVRleHR1cmVDb29yZDtcXG5cXG51bmlmb3JtIG1hdDMgdHJhbnNsYXRpb25NYXRyaXg7XFxudW5pZm9ybSBtYXQzIHByb2plY3Rpb25NYXRyaXg7XFxuXFxudmFyeWluZyB2ZWMyIHZUZXh0dXJlQ29vcmQ7XFxuXFxudm9pZCBtYWluKHZvaWQpXFxue1xcbiAgICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHByb2plY3Rpb25NYXRyaXggKiB0cmFuc2xhdGlvbk1hdHJpeCAqIHZlYzMoYVZlcnRleFBvc2l0aW9uLCAxLjApKS54eSwgMC4wLCAxLjApO1xcblxcbiAgICB2VGV4dHVyZUNvb3JkID0gYVRleHR1cmVDb29yZDtcXG59XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zZGYudmVydFxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9