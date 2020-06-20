(this["webpackJsonp"] = this["webpackJsonp"] || []).push([["IndexView"],{

/***/ "./node_modules/react-hot-loader/dist/react-hot-loader.production.min.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/react-hot-loader/dist/react-hot-loader.production.min.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("function _interopDefault(e){return e&&\"object\"==typeof e&&\"default\"in e?e.default:e}Object.defineProperty(exports,\"__esModule\",{value:!0});var React=_interopDefault(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));function AppContainer(e){return AppContainer.warnAboutHMRDisabled&&(AppContainer.warnAboutHMRDisabled=!0,console.error(\"React-Hot-Loader: misconfiguration detected, using production version in non-production environment.\"),console.error(\"React-Hot-Loader: Hot Module Replacement is not enabled.\")),React.Children.only(e.children)}AppContainer.warnAboutHMRDisabled=!1;var hot=function e(){return e.shouldWrapWithAppContainer?function(e){return function(n){return React.createElement(AppContainer,null,React.createElement(e,n))}}:function(e){return e}};hot.shouldWrapWithAppContainer=!1;var areComponentsEqual=function(e,n){return e===n},setConfig=function(){},cold=function(e){return e},configureComponent=function(){};exports.AppContainer=AppContainer,exports.hot=hot,exports.areComponentsEqual=areComponentsEqual,exports.setConfig=setConfig,exports.cold=cold,exports.configureComponent=configureComponent;\n\n\n//# sourceURL=webpack:///./node_modules/react-hot-loader/dist/react-hot-loader.production.min.js?");

/***/ }),

/***/ "./node_modules/react-hot-loader/index.js":
/*!************************************************!*\
  !*** ./node_modules/react-hot-loader/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nif (false) {} else if (false) {} else if (typeof window === 'undefined') {\n  // this is just server environment\n  module.exports = __webpack_require__(/*! ./dist/react-hot-loader.production.min.js */ \"./node_modules/react-hot-loader/dist/react-hot-loader.production.min.js\");\n} else if (true) {\n  module.exports = __webpack_require__(/*! ./dist/react-hot-loader.production.min.js */ \"./node_modules/react-hot-loader/dist/react-hot-loader.production.min.js\");\n  module.exports.AppContainer.warnAboutHMRDisabled = true;\n  module.exports.hot.shouldWrapWithAppContainer = true;\n} else { var jsFeaturesPresent, evalError, evalAllowed; }\n\n\n//# sourceURL=webpack:///./node_modules/react-hot-loader/index.js?");

/***/ }),

/***/ "./src/views/IndexView.js":
/*!********************************!*\
  !*** ./src/views/IndexView.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_hot_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-hot-loader */ \"./node_modules/react-hot-loader/index.js\");\n/* harmony import */ var react_hot_loader__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_hot_loader__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router-dom/esm/react-router-dom.js\");\n/* harmony import */ var _context_RootContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../context/RootContext */ \"./src/context/RootContext.js\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/dist/mobxreact.esm.js\");\n\n\n(function () {\n  var enterModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.enterModule : undefined;\n  enterModule && enterModule(module);\n})();\n\nvar __signature__ = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal[\"default\"].signature : function (a) {\n  return a;\n};\n\n\n\n\n\n\n\nfunction IndexView() {\n  var _React$useContext = react__WEBPACK_IMPORTED_MODULE_0___default.a.useContext(_context_RootContext__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n      networkStore = _React$useContext.networkStore,\n      uiStore = _React$useContext.uiStore;\n\n  react__WEBPACK_IMPORTED_MODULE_0___default.a.useEffect(function () {\n    uiStore.setTitle('Orbit');\n  }, []);\n  return Object(mobx_react__WEBPACK_IMPORTED_MODULE_4__[\"useObserver\"])(function () {\n    return networkStore.channelNames.length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Redirect\"], {\n      to: \"/channel/\".concat(networkStore.channelNames[0])\n    }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__[\"Redirect\"], {\n      to: \"/channel/\".concat(networkStore.defaultChannels[0])\n    });\n  });\n}\n\n__signature__(IndexView, \"useContext{{ networkStore, uiStore }}\\nuseEffect{}\\nuseObserver{}\", function () {\n  return [mobx_react__WEBPACK_IMPORTED_MODULE_4__[\"useObserver\"]];\n});\n\nvar _default = Object(react_hot_loader__WEBPACK_IMPORTED_MODULE_1__[\"hot\"])(module)(IndexView);\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (_default);\n;\n\n(function () {\n  var reactHotLoader = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.default : undefined;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(IndexView, \"IndexView\", \"/Users/skysbird/workspace/orbit-web/src/views/IndexView.js\");\n  reactHotLoader.register(_default, \"default\", \"/Users/skysbird/workspace/orbit-web/src/views/IndexView.js\");\n})();\n\n;\n\n(function () {\n  var leaveModule = typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal.leaveModule : undefined;\n  leaveModule && leaveModule(module);\n})();\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/views/IndexView.js?");

/***/ })

}]);