/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"vendors~App":"vendors~App","App":"App","AlphaDisclaimer":"AlphaDisclaimer","BackgroundAnimation":"BackgroundAnimation","ControlPanel":"ControlPanel","ChannelHeader":"ChannelHeader","ChannelView":"ChannelView","IndexView":"IndexView","LoginView":"LoginView","LogoutView":"LogoutView","SettingsView":"SettingsView","MessageUserProfilePanel":"MessageUserProfilePanel","Channel":"Channel","LoginForm":"LoginForm","DropZone":"DropZone","vendors~ChannelControls~ChannelMessages":"vendors~ChannelControls~ChannelMessages","ChannelControls":"ChannelControls","vendors~ChannelMessages":"vendors~ChannelMessages","ChannelMessages":"ChannelMessages"}[chunkId]||chunkId) + "." + "0fa463417982c64da1ab" + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = this["webpackJsonp"] = this["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendors~main"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/Fonts.scss":
/*!********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js!./src/styles/Fonts.scss ***!
  \********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nvar ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ \"./node_modules/css-loader/dist/runtime/getUrl.js\");\nvar ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(/*! fonts/lato/Lato-Thin.woff2 */ \"./src/fonts/lato/Lato-Thin.woff2\");\nvar ___CSS_LOADER_URL_IMPORT_1___ = __webpack_require__(/*! fonts/lato/Lato-Thin.ttf */ \"./src/fonts/lato/Lato-Thin.ttf\");\nvar ___CSS_LOADER_URL_IMPORT_2___ = __webpack_require__(/*! fonts/lato/Lato-Light.woff2 */ \"./src/fonts/lato/Lato-Light.woff2\");\nvar ___CSS_LOADER_URL_IMPORT_3___ = __webpack_require__(/*! fonts/lato/Lato-Light.ttf */ \"./src/fonts/lato/Lato-Light.ttf\");\nvar ___CSS_LOADER_URL_IMPORT_4___ = __webpack_require__(/*! fonts/robotomono/RobotoMono-Light.woff2 */ \"./src/fonts/robotomono/RobotoMono-Light.woff2\");\nvar ___CSS_LOADER_URL_IMPORT_5___ = __webpack_require__(/*! fonts/robotomono/RobotoMono-Light.ttf */ \"./src/fonts/robotomono/RobotoMono-Light.ttf\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\nvar ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);\nvar ___CSS_LOADER_URL_REPLACEMENT_1___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_1___);\nvar ___CSS_LOADER_URL_REPLACEMENT_2___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_2___);\nvar ___CSS_LOADER_URL_REPLACEMENT_3___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_3___);\nvar ___CSS_LOADER_URL_REPLACEMENT_4___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_4___);\nvar ___CSS_LOADER_URL_REPLACEMENT_5___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_5___);\n// Module\nexports.push([module.i, \"@font-face {\\n  font-family: 'Lato';\\n  src: url(\" + ___CSS_LOADER_URL_REPLACEMENT_0___ + \") format(\\\"woff2\\\"), url(\\\"https://fonts.googleapis.com/css?family=Lato\\\"), url(\" + ___CSS_LOADER_URL_REPLACEMENT_1___ + \") format(\\\"truetype\\\"); }\\n\\n@font-face {\\n  font-family: 'LatoBold';\\n  src: url(\" + ___CSS_LOADER_URL_REPLACEMENT_2___ + \") format(\\\"woff2\\\"), url(\\\"https://fonts.googleapis.com/css?family=Lato\\\"), url(\" + ___CSS_LOADER_URL_REPLACEMENT_3___ + \") format(\\\"truetype\\\"); }\\n\\n@font-face {\\n  font-family: 'Roboto Mono';\\n  src: url(\" + ___CSS_LOADER_URL_REPLACEMENT_4___ + \") format(\\\"woff2\\\"), url(\\\"https://fonts.googleapis.com/css?family=Roboto+Mono\\\"), url(\" + ___CSS_LOADER_URL_REPLACEMENT_5___ + \") format(\\\"truetype\\\"); }\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/styles/Fonts.scss?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/Main.scss":
/*!*******************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js!./src/styles/Main.scss ***!
  \*******************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \"html,\\nbody {\\n  font-family: 'Lato';\\n  font-weight: normal;\\n  background: #222222;\\n  color: white;\\n  height: 100%; }\\n\\nh1 {\\n  color: #e4e4e4;\\n  font-weight: normal;\\n  margin: auto;\\n  font-size: 3em;\\n  text-align: center;\\n  padding: 0.5em; }\\n\\n#root {\\n  width: 100%;\\n  height: 100%; }\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/styles/Main.scss?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/Spinner.scss":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js!./src/styles/Spinner.scss ***!
  \**********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".spinner {\\n  position: relative;\\n  box-sizing: border-box;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center; }\\n  .spinner.spinner-fixed {\\n    position: fixed;\\n    top: 0;\\n    left: 0;\\n    height: 100%;\\n    width: 100%;\\n    z-index: -1; }\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/styles/Spinner.scss?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./src/styles/flaticon.css":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--6-2!./src/styles/flaticon.css ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nvar ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ \"./node_modules/css-loader/dist/runtime/getUrl.js\");\nvar ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(/*! fonts/flaticon/flaticon.eot */ \"./src/fonts/flaticon/flaticon.eot\");\nvar ___CSS_LOADER_URL_IMPORT_1___ = __webpack_require__(/*! fonts/flaticon/flaticon.woff */ \"./src/fonts/flaticon/flaticon.woff\");\nvar ___CSS_LOADER_URL_IMPORT_2___ = __webpack_require__(/*! fonts/flaticon/flaticon.ttf */ \"./src/fonts/flaticon/flaticon.ttf\");\nvar ___CSS_LOADER_URL_IMPORT_3___ = __webpack_require__(/*! fonts/flaticon/flaticon.svg */ \"./src/fonts/flaticon/flaticon.svg\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\nvar ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);\nvar ___CSS_LOADER_URL_REPLACEMENT_1___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___, { hash: \"#iefix\" });\nvar ___CSS_LOADER_URL_REPLACEMENT_2___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_1___);\nvar ___CSS_LOADER_URL_REPLACEMENT_3___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_2___);\nvar ___CSS_LOADER_URL_REPLACEMENT_4___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_3___);\n// Module\nexports.push([module.i, \"@font-face {\\n\\tfont-family: \\\"Flaticon\\\";\\n\\tsrc: url(\" + ___CSS_LOADER_URL_REPLACEMENT_0___ + \");\\n\\tsrc: url(\" + ___CSS_LOADER_URL_REPLACEMENT_1___ + \") format(\\\"embedded-opentype\\\"),\\n\\turl(\" + ___CSS_LOADER_URL_REPLACEMENT_2___ + \") format(\\\"woff\\\"),\\n\\turl(\" + ___CSS_LOADER_URL_REPLACEMENT_3___ + \") format(\\\"truetype\\\"),\\n\\turl(\" + ___CSS_LOADER_URL_REPLACEMENT_4___ + \") format(\\\"svg\\\");\\n\\tfont-weight: normal;\\n\\tfont-style: normal;\\n}\\n[class^=\\\"flaticon-\\\"]:before, [class*=\\\" flaticon-\\\"]:before,\\n[class^=\\\"flaticon-\\\"]:after, [class*=\\\" flaticon-\\\"]:after {\\n\\tfont-family: Flaticon;\\n        /*font-size: 20px;*/\\nfont-style: normal;\\n/*margin-left: 20px;*/\\n}.flaticon-access38:before {\\n\\tcontent: \\\"\\\\e000\\\";\\n}\\n.flaticon-accessory79:before {\\n\\tcontent: \\\"\\\\e001\\\";\\n}\\n.flaticon-agenda34:before {\\n\\tcontent: \\\"\\\\e002\\\";\\n}\\n.flaticon-alarm12:before {\\n\\tcontent: \\\"\\\\e003\\\";\\n}\\n.flaticon-alcohol85:before {\\n\\tcontent: \\\"\\\\e004\\\";\\n}\\n.flaticon-audio99:before {\\n\\tcontent: \\\"\\\\e005\\\";\\n}\\n.flaticon-avatar93:before {\\n\\tcontent: \\\"\\\\e006\\\";\\n}\\n.flaticon-battery-status61:before {\\n\\tcontent: \\\"\\\\e007\\\";\\n}\\n.flaticon-bookmarks10:before {\\n\\tcontent: \\\"\\\\e008\\\";\\n}\\n.flaticon-check-mark16:before {\\n\\tcontent: \\\"\\\\e009\\\";\\n}\\n.flaticon-chemistry44:before {\\n\\tcontent: \\\"\\\\e00a\\\";\\n}\\n.flaticon-christmas14:before {\\n\\tcontent: \\\"\\\\e00b\\\";\\n}\\n.flaticon-cinema13:before {\\n\\tcontent: \\\"\\\\e00c\\\";\\n}\\n.flaticon-clocks27:before {\\n\\tcontent: \\\"\\\\e00d\\\";\\n}\\n.flaticon-clothing293:before {\\n\\tcontent: \\\"\\\\e00e\\\";\\n}\\n.flaticon-clothing294:before {\\n\\tcontent: \\\"\\\\e00f\\\";\\n}\\n.flaticon-computer331:before {\\n\\tcontent: \\\"\\\\e010\\\";\\n}\\n.flaticon-computer71:before {\\n\\tcontent: \\\"\\\\e011\\\";\\n}\\n.flaticon-direction246:before {\\n\\tcontent: \\\"\\\\e012\\\";\\n}\\n.flaticon-directional35:before {\\n\\tcontent: \\\"\\\\e013\\\";\\n}\\n.flaticon-down-arrow83:before {\\n\\tcontent: \\\"\\\\e014\\\";\\n}\\n.flaticon-eyeglasses36:before {\\n\\tcontent: \\\"\\\\e015\\\";\\n}\\n.flaticon-file268:before {\\n\\tcontent: \\\"\\\\e016\\\";\\n}\\n.flaticon-filming19:before {\\n\\tcontent: \\\"\\\\e017\\\";\\n}\\n.flaticon-gear94:before {\\n\\tcontent: \\\"\\\\e018\\\";\\n}\\n.flaticon-graphics-editor79:before {\\n\\tcontent: \\\"\\\\e019\\\";\\n}\\n.flaticon-hanging4:before {\\n\\tcontent: \\\"\\\\e01a\\\";\\n}\\n.flaticon-hot-drink46:before {\\n\\tcontent: \\\"\\\\e01b\\\";\\n}\\n.flaticon-house287:before {\\n\\tcontent: \\\"\\\\e01c\\\";\\n}\\n.flaticon-info45:before {\\n\\tcontent: \\\"\\\\e01d\\\";\\n}\\n.flaticon-jewel29:before {\\n\\tcontent: \\\"\\\\e01e\\\";\\n}\\n.flaticon-label51:before {\\n\\tcontent: \\\"\\\\e01f\\\";\\n}\\n.flaticon-light201:before {\\n\\tcontent: \\\"\\\\e020\\\";\\n}\\n.flaticon-lines18:before {\\n\\tcontent: \\\"\\\\e021\\\";\\n}\\n.flaticon-linked1:before {\\n\\tcontent: \\\"\\\\e022\\\";\\n}\\n.flaticon-loving40:before {\\n\\tcontent: \\\"\\\\e023\\\";\\n}\\n.flaticon-mail22:before {\\n\\tcontent: \\\"\\\\e024\\\";\\n}\\n.flaticon-medals12:before {\\n\\tcontent: \\\"\\\\e025\\\";\\n}\\n.flaticon-message57:before {\\n\\tcontent: \\\"\\\\e026\\\";\\n}\\n.flaticon-microphone140:before {\\n\\tcontent: \\\"\\\\e027\\\";\\n}\\n.flaticon-monarchy53:before {\\n\\tcontent: \\\"\\\\e028\\\";\\n}\\n.flaticon-mouse16:before {\\n\\tcontent: \\\"\\\\e029\\\";\\n}\\n.flaticon-multimedia-option174:before {\\n\\tcontent: \\\"\\\\e02a\\\";\\n}\\n.flaticon-music-player86:before {\\n\\tcontent: \\\"\\\\e02b\\\";\\n}\\n.flaticon-music-player87:before {\\n\\tcontent: \\\"\\\\e02c\\\";\\n}\\n.flaticon-music-player88:before {\\n\\tcontent: \\\"\\\\e02d\\\";\\n}\\n.flaticon-music-player89:before {\\n\\tcontent: \\\"\\\\e02e\\\";\\n}\\n.flaticon-nation8:before {\\n\\tcontent: \\\"\\\\e02f\\\";\\n}\\n.flaticon-office-material37:before {\\n\\tcontent: \\\"\\\\e030\\\";\\n}\\n.flaticon-optical4:before {\\n\\tcontent: \\\"\\\\e031\\\";\\n}\\n.flaticon-orientation65:before {\\n\\tcontent: \\\"\\\\e032\\\";\\n}\\n.flaticon-phone-call37:before {\\n\\tcontent: \\\"\\\\e033\\\";\\n}\\n.flaticon-photograph16:before {\\n\\tcontent: \\\"\\\\e034\\\";\\n}\\n.flaticon-photography113:before {\\n\\tcontent: \\\"\\\\e035\\\";\\n}\\n.flaticon-pin133:before {\\n\\tcontent: \\\"\\\\e036\\\";\\n}\\n.flaticon-printer100:before {\\n\\tcontent: \\\"\\\\e037\\\";\\n}\\n.flaticon-prohibition35:before {\\n\\tcontent: \\\"\\\\e038\\\";\\n}\\n.flaticon-quaver50:before {\\n\\tcontent: \\\"\\\\e039\\\";\\n}\\n.flaticon-rectangle32:before {\\n\\tcontent: \\\"\\\\e03a\\\";\\n}\\n.flaticon-reload22:before {\\n\\tcontent: \\\"\\\\e03b\\\";\\n}\\n.flaticon-road-sign24:before {\\n\\tcontent: \\\"\\\\e03c\\\";\\n}\\n.flaticon-road-sign25:before {\\n\\tcontent: \\\"\\\\e03d\\\";\\n}\\n.flaticon-saving10:before {\\n\\tcontent: \\\"\\\\e03e\\\";\\n}\\n.flaticon-school-material20:before {\\n\\tcontent: \\\"\\\\e03f\\\";\\n}\\n.flaticon-screen11:before {\\n\\tcontent: \\\"\\\\e040\\\";\\n}\\n.flaticon-setup9:before {\\n\\tcontent: \\\"\\\\e041\\\";\\n}\\n.flaticon-sharing7:before {\\n\\tcontent: \\\"\\\\e042\\\";\\n}\\n.flaticon-shelter2:before {\\n\\tcontent: \\\"\\\\e043\\\";\\n}\\n.flaticon-speech-bubble109:before {\\n\\tcontent: \\\"\\\\e044\\\";\\n}\\n.flaticon-speed3:before {\\n\\tcontent: \\\"\\\\e045\\\";\\n}\\n.flaticon-sports-ball43:before {\\n\\tcontent: \\\"\\\\e046\\\";\\n}\\n.flaticon-square51:before {\\n\\tcontent: \\\"\\\\e047\\\";\\n}\\n.flaticon-squares119:before {\\n\\tcontent: \\\"\\\\e048\\\";\\n}\\n.flaticon-stars83:before {\\n\\tcontent: \\\"\\\\e049\\\";\\n}\\n.flaticon-stats123:before {\\n\\tcontent: \\\"\\\\e04a\\\";\\n}\\n.flaticon-storage13:before {\\n\\tcontent: \\\"\\\\e04b\\\";\\n}\\n.flaticon-storage75:before {\\n\\tcontent: \\\"\\\\e04c\\\";\\n}\\n.flaticon-suitcase90:before {\\n\\tcontent: \\\"\\\\e04d\\\";\\n}\\n.flaticon-sunny78:before {\\n\\tcontent: \\\"\\\\e04e\\\";\\n}\\n.flaticon-supermarket72:before {\\n\\tcontent: \\\"\\\\e04f\\\";\\n}\\n.flaticon-telephone287:before {\\n\\tcontent: \\\"\\\\e050\\\";\\n}\\n.flaticon-time103:before {\\n\\tcontent: \\\"\\\\e051\\\";\\n}\\n.flaticon-time104:before {\\n\\tcontent: \\\"\\\\e052\\\";\\n}\\n.flaticon-tool490:before {\\n\\tcontent: \\\"\\\\e053\\\";\\n}\\n.flaticon-tool491:before {\\n\\tcontent: \\\"\\\\e054\\\";\\n}\\n.flaticon-tool492:before {\\n\\tcontent: \\\"\\\\e055\\\";\\n}\\n.flaticon-tool493:before {\\n\\tcontent: \\\"\\\\e056\\\";\\n}\\n.flaticon-tool494:before {\\n\\tcontent: \\\"\\\\e057\\\";\\n}\\n.flaticon-tool495:before {\\n\\tcontent: \\\"\\\\e058\\\";\\n}\\n.flaticon-tool496:before {\\n\\tcontent: \\\"\\\\e059\\\";\\n}\\n.flaticon-tool497:before {\\n\\tcontent: \\\"\\\\e05a\\\";\\n}\\n.flaticon-tool498:before {\\n\\tcontent: \\\"\\\\e05b\\\";\\n}\\n.flaticon-tool499:before {\\n\\tcontent: \\\"\\\\e05c\\\";\\n}\\n.flaticon-tool500:before {\\n\\tcontent: \\\"\\\\e05d\\\";\\n}\\n.flaticon-tv10:before {\\n\\tcontent: \\\"\\\\e05e\\\";\\n}\\n.flaticon-uploading37:before {\\n\\tcontent: \\\"\\\\e05f\\\";\\n}\\n.flaticon-winner61:before {\\n\\tcontent: \\\"\\\\e060\\\";\\n}\\n.flaticon-wireless-connectivity44:before {\\n\\tcontent: \\\"\\\\e061\\\";\\n}\\n.flaticon-wireless-connectivity45:before {\\n\\tcontent: \\\"\\\\e062\\\";\\n}\\n.flaticon-writing144:before {\\n\\tcontent: \\\"\\\\e063\\\";\\n}\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/styles/flaticon.css?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--6-2");

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./src/styles/normalize.css":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--6-2!./src/styles/normalize.css ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \"/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */\\n\\n/* Document\\n   ========================================================================== */\\n\\n/**\\n * 1. Correct the line height in all browsers.\\n * 2. Prevent adjustments of font size after orientation changes in iOS.\\n */\\n\\n html {\\n  line-height: 1.15; /* 1 */\\n  -webkit-text-size-adjust: 100%; /* 2 */\\n}\\n\\n/* Sections\\n   ========================================================================== */\\n\\n/**\\n * Remove the margin in all browsers.\\n */\\n\\nbody {\\n  margin: 0;\\n}\\n\\n/**\\n * Correct the font size and margin on `h1` elements within `section` and\\n * `article` contexts in Chrome, Firefox, and Safari.\\n */\\n\\nh1 {\\n  font-size: 2em;\\n  margin: 0.67em 0;\\n}\\n\\n/* Grouping content\\n   ========================================================================== */\\n\\n/**\\n * 1. Add the correct box sizing in Firefox.\\n * 2. Show the overflow in Edge and IE.\\n */\\n\\nhr {\\n  box-sizing: content-box; /* 1 */\\n  height: 0; /* 1 */\\n  overflow: visible; /* 2 */\\n}\\n\\n/**\\n * 1. Correct the inheritance and scaling of font size in all browsers.\\n * 2. Correct the odd `em` font sizing in all browsers.\\n */\\n\\npre {\\n  font-family: monospace, monospace; /* 1 */\\n  font-size: 1em; /* 2 */\\n}\\n\\n/* Text-level semantics\\n   ========================================================================== */\\n\\n/**\\n * Remove the gray background on active links in IE 10.\\n */\\n\\na {\\n  background-color: transparent;\\n}\\n\\n/**\\n * 1. Remove the bottom border in Chrome 57-\\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\\n */\\n\\nabbr[title] {\\n  border-bottom: none; /* 1 */\\n  text-decoration: underline; /* 2 */\\n  -webkit-text-decoration: underline dotted;\\n          text-decoration: underline dotted; /* 2 */\\n}\\n\\n/**\\n * Add the correct font weight in Chrome, Edge, and Safari.\\n */\\n\\nb,\\nstrong {\\n  font-weight: bolder;\\n}\\n\\n/**\\n * 1. Correct the inheritance and scaling of font size in all browsers.\\n * 2. Correct the odd `em` font sizing in all browsers.\\n */\\n\\ncode,\\nkbd,\\nsamp {\\n  font-family: monospace, monospace; /* 1 */\\n  font-size: 1em; /* 2 */\\n}\\n\\n/**\\n * Add the correct font size in all browsers.\\n */\\n\\nsmall {\\n  font-size: 80%;\\n}\\n\\n/**\\n * Prevent `sub` and `sup` elements from affecting the line height in\\n * all browsers.\\n */\\n\\nsub,\\nsup {\\n  font-size: 75%;\\n  line-height: 0;\\n  position: relative;\\n  vertical-align: baseline;\\n}\\n\\nsub {\\n  bottom: -0.25em;\\n}\\n\\nsup {\\n  top: -0.5em;\\n}\\n\\n/* Embedded content\\n   ========================================================================== */\\n\\n/**\\n * Remove the border on images inside links in IE 10.\\n */\\n\\nimg {\\n  border-style: none;\\n}\\n\\n/* Forms\\n   ========================================================================== */\\n\\n/**\\n * 1. Change the font styles in all browsers.\\n * 2. Remove the margin in Firefox and Safari.\\n */\\n\\nbutton,\\ninput,\\noptgroup,\\nselect,\\ntextarea {\\n  font-family: inherit; /* 1 */\\n  font-size: 100%; /* 1 */\\n  line-height: 1.15; /* 1 */\\n  margin: 0; /* 2 */\\n}\\n\\n/**\\n * Show the overflow in IE.\\n * 1. Show the overflow in Edge.\\n */\\n\\nbutton,\\ninput { /* 1 */\\n  overflow: visible;\\n}\\n\\n/**\\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\\n * 1. Remove the inheritance of text transform in Firefox.\\n */\\n\\nbutton,\\nselect { /* 1 */\\n  text-transform: none;\\n}\\n\\n/**\\n * Correct the inability to style clickable types in iOS and Safari.\\n */\\n\\nbutton,\\n[type=\\\"button\\\"],\\n[type=\\\"reset\\\"],\\n[type=\\\"submit\\\"] {\\n  -webkit-appearance: button;\\n}\\n\\n/**\\n * Remove the inner border and padding in Firefox.\\n */\\n\\nbutton::-moz-focus-inner,\\n[type=\\\"button\\\"]::-moz-focus-inner,\\n[type=\\\"reset\\\"]::-moz-focus-inner,\\n[type=\\\"submit\\\"]::-moz-focus-inner {\\n  border-style: none;\\n  padding: 0;\\n}\\n\\n/**\\n * Restore the focus styles unset by the previous rule.\\n */\\n\\nbutton:-moz-focusring,\\n[type=\\\"button\\\"]:-moz-focusring,\\n[type=\\\"reset\\\"]:-moz-focusring,\\n[type=\\\"submit\\\"]:-moz-focusring {\\n  outline: 1px dotted ButtonText;\\n}\\n\\n/**\\n * Correct the padding in Firefox.\\n */\\n\\nfieldset {\\n  padding: 0.35em 0.75em 0.625em;\\n}\\n\\n/**\\n * 1. Correct the text wrapping in Edge and IE.\\n * 2. Correct the color inheritance from `fieldset` elements in IE.\\n * 3. Remove the padding so developers are not caught out when they zero out\\n *    `fieldset` elements in all browsers.\\n */\\n\\nlegend {\\n  box-sizing: border-box; /* 1 */\\n  color: inherit; /* 2 */\\n  display: table; /* 1 */\\n  max-width: 100%; /* 1 */\\n  padding: 0; /* 3 */\\n  white-space: normal; /* 1 */\\n}\\n\\n/**\\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\\n */\\n\\nprogress {\\n  vertical-align: baseline;\\n}\\n\\n/**\\n * Remove the default vertical scrollbar in IE 10+.\\n */\\n\\ntextarea {\\n  overflow: auto;\\n}\\n\\n/**\\n * 1. Add the correct box sizing in IE 10.\\n * 2. Remove the padding in IE 10.\\n */\\n\\n[type=\\\"checkbox\\\"],\\n[type=\\\"radio\\\"] {\\n  box-sizing: border-box; /* 1 */\\n  padding: 0; /* 2 */\\n}\\n\\n/**\\n * Correct the cursor style of increment and decrement buttons in Chrome.\\n */\\n\\n[type=\\\"number\\\"]::-webkit-inner-spin-button,\\n[type=\\\"number\\\"]::-webkit-outer-spin-button {\\n  height: auto;\\n}\\n\\n/**\\n * 1. Correct the odd appearance in Chrome and Safari.\\n * 2. Correct the outline style in Safari.\\n */\\n\\n[type=\\\"search\\\"] {\\n  -webkit-appearance: textfield; /* 1 */\\n  outline-offset: -2px; /* 2 */\\n}\\n\\n/**\\n * Remove the inner padding in Chrome and Safari on macOS.\\n */\\n\\n[type=\\\"search\\\"]::-webkit-search-decoration {\\n  -webkit-appearance: none;\\n}\\n\\n/**\\n * 1. Correct the inability to style clickable types in iOS and Safari.\\n * 2. Change font properties to `inherit` in Safari.\\n */\\n\\n::-webkit-file-upload-button {\\n  -webkit-appearance: button; /* 1 */\\n  font: inherit; /* 2 */\\n}\\n\\n/* Interactive\\n   ========================================================================== */\\n\\n/*\\n * Add the correct display in Edge, IE 10+, and Firefox.\\n */\\n\\ndetails {\\n  display: block;\\n}\\n\\n/*\\n * Add the correct display in all browsers.\\n */\\n\\nsummary {\\n  display: list-item;\\n}\\n\\n/* Misc\\n   ========================================================================== */\\n\\n/**\\n * Add the correct display in IE 10+.\\n */\\n\\ntemplate {\\n  display: none;\\n}\\n\\n/**\\n * Add the correct display in IE 10.\\n */\\n\\n[hidden] {\\n  display: none;\\n}\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/styles/normalize.css?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--6-2");

/***/ }),

/***/ "./package.json":
/*!**********************!*\
  !*** ./package.json ***!
  \**********************/
/*! exports provided: name, version, description, main, scripts, repository, keywords, license, bugs, homepage, browserslist, jest, dependencies, devDependencies, localMaintainers, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"name\\\":\\\"orbit-web\\\",\\\"version\\\":\\\"1.0.0-alpha-15\\\",\\\"description\\\":\\\"Orbit Chat\\\",\\\"main\\\":\\\"src/components/index.js\\\",\\\"scripts\\\":{\\\"build\\\":\\\"webpack --mode=development\\\",\\\"dev\\\":\\\"npm run start\\\",\\\"lint\\\":\\\"eslint src/ test/\\\",\\\"lint:fix\\\":\\\"eslint --fix src/ test/\\\",\\\"start\\\":\\\"webpack-dev-server --mode=development\\\",\\\"test-server\\\":\\\"http-server ./dist -s -p 8088\\\",\\\"test\\\":\\\"npm run lint && jest --runInBand\\\"},\\\"repository\\\":{\\\"type\\\":\\\"git\\\",\\\"url\\\":\\\"git+https://github.com/orbitdb/orbit-web.git\\\"},\\\"keywords\\\":[\\\"orbitdb\\\",\\\"orbit\\\",\\\"orbit-web\\\"],\\\"license\\\":\\\"MIT\\\",\\\"bugs\\\":{\\\"url\\\":\\\"https://github.com/orbitdb/orbit-web/issues\\\"},\\\"homepage\\\":\\\"https://github.com/orbitdb/orbit-web#readme\\\",\\\"browserslist\\\":[\\\"defaults\\\"],\\\"jest\\\":{\\\"preset\\\":\\\"jest-puppeteer\\\"},\\\"dependencies\\\":{\\\"autolinker\\\":\\\"^3.14.1\\\",\\\"classnames\\\":\\\"^2.2.6\\\",\\\"datastore-level\\\":\\\"^1.1.0\\\",\\\"date-fns\\\":\\\"^2.14.0\\\",\\\"domkit\\\":\\\"0.0.3\\\",\\\"emoji-mart\\\":\\\"^2.11.2\\\",\\\"highlight.js\\\":\\\"^9.18.1\\\",\\\"i18next\\\":\\\"^17.3.1\\\",\\\"ipfs\\\":\\\"^0.46.0\\\",\\\"ipfs-repo\\\":\\\"^3.0.3\\\",\\\"level\\\":\\\"^6.0.1\\\",\\\"level-js\\\":\\\"^5.0.2\\\",\\\"lodash.debounce\\\":\\\"^4.0.8\\\",\\\"mobx\\\":\\\"^5.15.4\\\",\\\"mobx-react\\\":\\\"^6.2.2\\\",\\\"orbit_\\\":\\\"^0.2.0-rc1\\\",\\\"pleasejs\\\":\\\"^0.4.2\\\",\\\"prop-types\\\":\\\"^15.6.2\\\",\\\"react\\\":\\\"^16.13.1\\\",\\\"react-dom\\\":\\\"^16.13.1\\\",\\\"react-i18next\\\":\\\"^10.13.2\\\",\\\"react-router-dom\\\":\\\"^5.2.0\\\",\\\"react-transition-group\\\":\\\"^4.4.1\\\"},\\\"devDependencies\\\":{\\\"@babel/core\\\":\\\"^7.10.2\\\",\\\"@babel/plugin-proposal-class-properties\\\":\\\"^7.10.1\\\",\\\"@babel/plugin-proposal-decorators\\\":\\\"^7.10.1\\\",\\\"@babel/plugin-proposal-object-rest-spread\\\":\\\"^7.10.1\\\",\\\"@babel/plugin-syntax-dynamic-import\\\":\\\"^7.8.3\\\",\\\"@babel/plugin-syntax-flow\\\":\\\"^7.10.1\\\",\\\"@babel/plugin-transform-async-to-generator\\\":\\\"^7.10.1\\\",\\\"@babel/plugin-transform-flow-strip-types\\\":\\\"^7.10.1\\\",\\\"@babel/plugin-transform-spread\\\":\\\"^7.10.1\\\",\\\"@babel/polyfill\\\":\\\"^7.10.1\\\",\\\"@babel/preset-env\\\":\\\"^7.10.2\\\",\\\"@babel/preset-react\\\":\\\"^7.10.1\\\",\\\"@babel/register\\\":\\\"^7.10.1\\\",\\\"babel-eslint\\\":\\\"^10.1.0\\\",\\\"babel-loader\\\":\\\"^8.1.0\\\",\\\"babel-runtime\\\":\\\"^6.26.0\\\",\\\"clean-webpack-plugin\\\":\\\"^3.0.0\\\",\\\"css-loader\\\":\\\"^3.6.0\\\",\\\"eslint\\\":\\\"6.4.0\\\",\\\"eslint-config-standard\\\":\\\"14.1.0\\\",\\\"eslint-config-standard-jsx\\\":\\\"8.1.0\\\",\\\"eslint-plugin-import\\\":\\\"~2.18.0\\\",\\\"eslint-plugin-node\\\":\\\"~10.0.0\\\",\\\"eslint-plugin-promise\\\":\\\"~4.2.1\\\",\\\"eslint-plugin-react\\\":\\\"~7.14.2\\\",\\\"eslint-plugin-standard\\\":\\\"~4.0.0\\\",\\\"file-loader\\\":\\\"^4.3.0\\\",\\\"html-webpack-plugin\\\":\\\"^3.2.0\\\",\\\"http-server\\\":\\\"^0.11.1\\\",\\\"ignore-styles\\\":\\\"^5.0.1\\\",\\\"jest\\\":\\\"^24.9.0\\\",\\\"jest-puppeteer\\\":\\\"^4.4.0\\\",\\\"node-sass\\\":\\\"^4.14.1\\\",\\\"postcss-loader\\\":\\\"^3.0.0\\\",\\\"postcss-preset-env\\\":\\\"^6.7.0\\\",\\\"puppeteer\\\":\\\"^1.20.0\\\",\\\"react-hot-loader\\\":\\\"^4.12.21\\\",\\\"sass-loader\\\":\\\"^8.0.2\\\",\\\"style-loader\\\":\\\"^1.2.1\\\",\\\"url-loader\\\":\\\"^2.3.0\\\",\\\"webpack\\\":\\\"^4.43.0\\\",\\\"webpack-babel-env-deps\\\":\\\"^1.6.3\\\",\\\"webpack-cli\\\":\\\"^3.3.11\\\",\\\"webpack-dev-server\\\":\\\"^3.11.0\\\",\\\"worker-loader\\\":\\\"^2.0.0\\\"},\\\"localMaintainers\\\":[\\\"haad <haad@haja.io>\\\",\\\"shamb0t <shams@haja.io>\\\",\\\"hajamark <mark@haja.io>\\\"]}\");\n\n//# sourceURL=webpack:///./package.json?");

/***/ }),

/***/ "./src/components/Spinner/MoonLoader.js":
/*!**********************************************!*\
  !*** ./src/components/Spinner/MoonLoader.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var domkit_insertKeyframesRule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! domkit/insertKeyframesRule */ \"./node_modules/domkit/insertKeyframesRule.js\");\n/* harmony import */ var domkit_insertKeyframesRule__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(domkit_insertKeyframesRule__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var domkit_appendVendorPrefix__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! domkit/appendVendorPrefix */ \"./node_modules/domkit/appendVendorPrefix.js\");\n/* harmony import */ var domkit_appendVendorPrefix__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(domkit_appendVendorPrefix__WEBPACK_IMPORTED_MODULE_3__);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal[\"default\"].signature : function (a) {\n  return a;\n};\n\n\n\n\n\nvar keyframes = {\n  '100%': {\n    transform: 'rotate(360deg)'\n  }\n};\nvar animationName = domkit_insertKeyframesRule__WEBPACK_IMPORTED_MODULE_2___default()(keyframes);\n\nfunction getBallStyle(_size) {\n  return {\n    width: _size,\n    height: _size,\n    borderRadius: '100%'\n  };\n}\n\nfunction getAnimationStyle() {\n  return {\n    animation: [animationName, '0.8s', '0s', 'infinite', 'linear'].join(' '),\n    animationFillMode: 'forwards'\n  };\n}\n\nfunction getStyle(size, color, idx) {\n  var _size = parseInt(size);\n\n  var moonSize = _size / 7;\n\n  switch (idx) {\n    case 1:\n      return domkit_appendVendorPrefix__WEBPACK_IMPORTED_MODULE_3___default()(Object.assign(getBallStyle(moonSize), getAnimationStyle(), {\n        backgroundColor: color,\n        opacity: '0.8',\n        position: 'absolute',\n        top: _size / 2 - moonSize / 2\n      }));\n\n    case 2:\n      return domkit_appendVendorPrefix__WEBPACK_IMPORTED_MODULE_3___default()(Object.assign(getBallStyle(_size), {\n        border: moonSize + 'px solid ' + color,\n        opacity: 0.1\n      }));\n\n    default:\n      return domkit_appendVendorPrefix__WEBPACK_IMPORTED_MODULE_3___default()(Object.assign(getAnimationStyle(), {\n        position: 'relative'\n      }));\n  }\n}\n\nfunction MoonLoader(_ref) {\n  var className = _ref.className,\n      color = _ref.color,\n      size = _ref.size;\n  var styles = [0, 1, 2].map(getStyle.bind(null, size, color));\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: className\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    style: styles[0]\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    style: styles[1]\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    style: styles[2]\n  })));\n}\n\nMoonLoader.propTypes = {\n  className: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  color: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  size: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string\n};\nMoonLoader.defaultProps = {\n  color: '#ffffff',\n  size: '60px'\n};\nvar _default = MoonLoader;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(keyframes, \"keyframes\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n  reactHotLoader.register(animationName, \"animationName\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n  reactHotLoader.register(getBallStyle, \"getBallStyle\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n  reactHotLoader.register(getAnimationStyle, \"getAnimationStyle\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n  reactHotLoader.register(getStyle, \"getStyle\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n  reactHotLoader.register(MoonLoader, \"MoonLoader\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/MoonLoader.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/components/Spinner/MoonLoader.js?");

/***/ }),

/***/ "./src/components/Spinner/index.js":
/*!*****************************************!*\
  !*** ./src/components/Spinner/index.js ***!
  \*****************************************/
/*! exports provided: default, BigSpinner */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BigSpinner\", function() { return BigSpinner; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _MoonLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MoonLoader */ \"./src/components/Spinner/MoonLoader.js\");\n/* harmony import */ var _styles_Spinner_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../styles/Spinner.scss */ \"./src/styles/Spinner.scss\");\n/* harmony import */ var _styles_Spinner_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_Spinner_scss__WEBPACK_IMPORTED_MODULE_3__);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nfunction _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }\n\nfunction _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }\n\nfunction _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal[\"default\"].signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\nfunction Spinner(_ref) {\n  var className = _ref.className,\n      theme = _ref.theme,\n      loading = _ref.loading,\n      rest = _objectWithoutProperties(_ref, [\"className\", \"theme\", \"loading\"]);\n\n  if (!loading) return null;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: className,\n    style: theme\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_MoonLoader__WEBPACK_IMPORTED_MODULE_2__[\"default\"], _extends({\n    className: \"spinnerIcon\"\n  }, rest)));\n}\n\nSpinner.defaultProps = {\n  className: 'spinner',\n  color: 'rgba(255, 255, 255, 0.7)',\n  loading: true,\n  size: '16px'\n};\nSpinner.propTypes = {\n  className: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  theme: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object,\n  loading: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.bool,\n  color: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string,\n  size: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string\n};\nvar _default = Spinner;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\nvar BigSpinner = function BigSpinner() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Spinner, {\n    className: \"spinner spinner-fixed\",\n    size: \"64px\"\n  });\n};\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(Spinner, \"Spinner\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/index.js\");\n  reactHotLoader.register(BigSpinner, \"BigSpinner\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/index.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/skysbird/workspace/orbit-web/src/components/Spinner/index.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/components/Spinner/index.js?");

/***/ }),

/***/ "./src/fonts/flaticon/flaticon.eot":
/*!*****************************************!*\
  !*** ./src/fonts/flaticon/flaticon.eot ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/flaticon.5b9ab89830240d5160fe.eot\";\n\n//# sourceURL=webpack:///./src/fonts/flaticon/flaticon.eot?");

/***/ }),

/***/ "./src/fonts/flaticon/flaticon.svg":
/*!*****************************************!*\
  !*** ./src/fonts/flaticon/flaticon.svg ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"images/flaticon.3617de7799412be93c09.svg\";\n\n//# sourceURL=webpack:///./src/fonts/flaticon/flaticon.svg?");

/***/ }),

/***/ "./src/fonts/flaticon/flaticon.ttf":
/*!*****************************************!*\
  !*** ./src/fonts/flaticon/flaticon.ttf ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/flaticon.2a755d345821a02a2809.ttf\";\n\n//# sourceURL=webpack:///./src/fonts/flaticon/flaticon.ttf?");

/***/ }),

/***/ "./src/fonts/flaticon/flaticon.woff":
/*!******************************************!*\
  !*** ./src/fonts/flaticon/flaticon.woff ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/flaticon.267024f74d2fffcb67c7.woff\";\n\n//# sourceURL=webpack:///./src/fonts/flaticon/flaticon.woff?");

/***/ }),

/***/ "./src/fonts/lato/Lato-Light.ttf":
/*!***************************************!*\
  !*** ./src/fonts/lato/Lato-Light.ttf ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/Lato-Light.c8aec28487a8897701ec.ttf\";\n\n//# sourceURL=webpack:///./src/fonts/lato/Lato-Light.ttf?");

/***/ }),

/***/ "./src/fonts/lato/Lato-Light.woff2":
/*!*****************************************!*\
  !*** ./src/fonts/lato/Lato-Light.woff2 ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/Lato-Light.adf6d5b55a2fe034953b.woff2\";\n\n//# sourceURL=webpack:///./src/fonts/lato/Lato-Light.woff2?");

/***/ }),

/***/ "./src/fonts/lato/Lato-Thin.ttf":
/*!**************************************!*\
  !*** ./src/fonts/lato/Lato-Thin.ttf ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/Lato-Thin.3bb12767045b23fb72bd.ttf\";\n\n//# sourceURL=webpack:///./src/fonts/lato/Lato-Thin.ttf?");

/***/ }),

/***/ "./src/fonts/lato/Lato-Thin.woff2":
/*!****************************************!*\
  !*** ./src/fonts/lato/Lato-Thin.woff2 ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/Lato-Thin.7f4082a83b5889076d26.woff2\";\n\n//# sourceURL=webpack:///./src/fonts/lato/Lato-Thin.woff2?");

/***/ }),

/***/ "./src/fonts/robotomono/RobotoMono-Light.ttf":
/*!***************************************************!*\
  !*** ./src/fonts/robotomono/RobotoMono-Light.ttf ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/RobotoMono-Light.9b4c4c06ac376ebef3ae.ttf\";\n\n//# sourceURL=webpack:///./src/fonts/robotomono/RobotoMono-Light.ttf?");

/***/ }),

/***/ "./src/fonts/robotomono/RobotoMono-Light.woff2":
/*!*****************************************************!*\
  !*** ./src/fonts/robotomono/RobotoMono-Light.woff2 ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"fonts/RobotoMono-Light.e87be289f8cead6d0386.woff2\";\n\n//# sourceURL=webpack:///./src/fonts/robotomono/RobotoMono-Light.woff2?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"./node_modules/react-dom/index.js\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../package.json */ \"./package.json\");\nvar _package_json__WEBPACK_IMPORTED_MODULE_2___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../package.json */ \"./package.json\", 1);\n/* harmony import */ var _utils_https__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/https */ \"./src/utils/https.js\");\n/* harmony import */ var _components_Spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/Spinner */ \"./src/components/Spinner/index.js\");\n/* harmony import */ var _styles_normalize_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./styles/normalize.css */ \"./src/styles/normalize.css\");\n/* harmony import */ var _styles_normalize_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_normalize_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _styles_Fonts_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles/Fonts.scss */ \"./src/styles/Fonts.scss\");\n/* harmony import */ var _styles_Fonts_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_Fonts_scss__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _styles_Main_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./styles/Main.scss */ \"./src/styles/Main.scss\");\n/* harmony import */ var _styles_Main_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_Main_scss__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _styles_flaticon_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./styles/flaticon.css */ \"./src/styles/flaticon.css\");\n/* harmony import */ var _styles_flaticon_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_styles_flaticon_css__WEBPACK_IMPORTED_MODULE_8__);\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal[\"default\"].signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n\n\n\n //redirectToHttps(!(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === 'orbit.chat.ipns.localhost'))\n\nvar App = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.lazy(function () {\n  return Promise.all(/*! import() | App */[__webpack_require__.e(\"vendors~App\"), __webpack_require__.e(\"App\")]).then(__webpack_require__.bind(null, /*! ./views/App */ \"./src/views/App.js\"));\n});\nObject(react_dom__WEBPACK_IMPORTED_MODULE_1__[\"render\"])( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Suspense, {\n  fallback: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_Spinner__WEBPACK_IMPORTED_MODULE_4__[\"BigSpinner\"], null)\n}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(App, null)), document.getElementById('root'));\nconsole.info(\"Version \".concat(_package_json__WEBPACK_IMPORTED_MODULE_2__[\"version\"], \" running in \").concat(\"development\", \" mode\"));\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(App, \"App\", \"/Users/skysbird/workspace/orbit-web/src/index.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/styles/Fonts.scss":
/*!*******************************!*\
  !*** ./src/styles/Fonts.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/src??ref--7-2!../../node_modules/sass-loader/dist/cjs.js!./Fonts.scss */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/Fonts.scss\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/styles/Fonts.scss?");

/***/ }),

/***/ "./src/styles/Main.scss":
/*!******************************!*\
  !*** ./src/styles/Main.scss ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/src??ref--7-2!../../node_modules/sass-loader/dist/cjs.js!./Main.scss */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/Main.scss\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/styles/Main.scss?");

/***/ }),

/***/ "./src/styles/Spinner.scss":
/*!*********************************!*\
  !*** ./src/styles/Spinner.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/src??ref--7-2!../../node_modules/sass-loader/dist/cjs.js!./Spinner.scss */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/Spinner.scss\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/styles/Spinner.scss?");

/***/ }),

/***/ "./src/styles/flaticon.css":
/*!*********************************!*\
  !*** ./src/styles/flaticon.css ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/src??ref--6-2!./flaticon.css */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./src/styles/flaticon.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/styles/flaticon.css?");

/***/ }),

/***/ "./src/styles/normalize.css":
/*!**********************************!*\
  !*** ./src/styles/normalize.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/src??ref--6-2!./normalize.css */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./src/styles/normalize.css\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/styles/normalize.css?");

/***/ }),

/***/ "./src/utils/https.js":
/*!****************************!*\
  !*** ./src/utils/https.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return redirectToHttps; });\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal[\"default\"].signature : function (a) {\n  return a;\n};\n\nfunction redirectToHttps() {\n  var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;\n\n  if (enabled && window.location.href.match('http:')) {\n    window.location.href = window.location.href.replace('http', 'https');\n  }\n}\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(redirectToHttps, \"redirectToHttps\", \"/Users/skysbird/workspace/orbit-web/src/utils/https.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/utils/https.js?");

/***/ }),

/***/ 0:
/*!********************************************!*\
  !*** multi @babel/polyfill ./src/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! @babel/polyfill */\"./node_modules/@babel/polyfill/lib/index.js\");\nmodule.exports = __webpack_require__(/*! ./src/index.js */\"./src/index.js\");\n\n\n//# sourceURL=webpack:///multi_@babel/polyfill_./src/index.js?");

/***/ })

/******/ });