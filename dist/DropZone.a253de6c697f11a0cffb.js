(this["webpackJsonp"] = this["webpackJsonp"] || []).push([["DropZone"],{

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/DropZone.scss":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js!./src/styles/DropZone.scss ***!
  \***********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Imports\nvar ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\nexports = ___CSS_LOADER_API_IMPORT___(false);\n// Module\nexports.push([module.i, \".dropzone {\\n  box-sizing: border-box;\\n  position: absolute;\\n  top: 0;\\n  left: 0;\\n  z-index: 101;\\n  height: 100%;\\n  width: 100%;\\n  display: flex;\\n  flex-direction: column;\\n  justify-content: center;\\n  align-items: center;\\n  padding: 0.5em;\\n  font-weight: bold;\\n  font-size: 4em;\\n  color: #e4e4e4;\\n  background: rgba(0, 0, 0, 0.6);\\n  opacity: 1;\\n  transition: opacity 0.1s ease-in-out;\\n  border: 2px dotted #783c8c;\\n  white-space: nowrap;\\n  overflow: hidden; }\\n  .dropzone .droplabel {\\n    pointer-events: none; }\\n\", \"\"]);\n// Exports\nmodule.exports = exports;\n\n\n//# sourceURL=webpack:///./src/styles/DropZone.scss?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/dist/cjs.js");

/***/ }),

/***/ "./src/components/DropZone.js":
/*!************************************!*\
  !*** ./src/components/DropZone.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ \"./node_modules/prop-types/index.js\");\n/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_DropZone_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/DropZone.scss */ \"./src/styles/DropZone.scss\");\n/* harmony import */ var _styles_DropZone_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_DropZone_scss__WEBPACK_IMPORTED_MODULE_2__);\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal[\"default\"].signature : function (a) {\n  return a;\n};\n\n\n\n\n\nvar DropZone = function DropZone(props) {\n  var onDrop = props.onDrop,\n      onDragLeave = props.onDragLeave,\n      label = props.label;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"dropzone\",\n    onDrop: onDrop,\n    onDragLeave: onDragLeave\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(\"div\", {\n    className: \"droplabel\"\n  }, label));\n};\n\nDropZone.propTypes = {\n  onDrop: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  onDragLeave: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func,\n  label: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.string\n};\nvar _default = DropZone;\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(DropZone, \"DropZone\", \"/Users/skysbird/workspace/orbit-web/src/components/DropZone.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/skysbird/workspace/orbit-web/src/components/DropZone.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/components/DropZone.js?");

/***/ }),

/***/ "./src/styles/DropZone.scss":
/*!**********************************!*\
  !*** ./src/styles/DropZone.scss ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var api = __webpack_require__(/*! ../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n            var content = __webpack_require__(/*! !../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/src??ref--7-2!../../node_modules/sass-loader/dist/cjs.js!./DropZone.scss */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js!./src/styles/DropZone.scss\");\n\n            content = content.__esModule ? content.default : content;\n\n            if (typeof content === 'string') {\n              content = [[module.i, content, '']];\n            }\n\nvar options = {};\n\noptions.insert = \"head\";\noptions.singleton = false;\n\nvar update = api(content, options);\n\n\n\nmodule.exports = content.locals || {};\n\n//# sourceURL=webpack:///./src/styles/DropZone.scss?");

/***/ })

}]);