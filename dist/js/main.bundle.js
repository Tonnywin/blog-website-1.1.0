/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_reset_css__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_reset_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_reset_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_slideBanner_css__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__css_slideBanner_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__css_slideBanner_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_contactPop_css__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__css_contactPop_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__css_contactPop_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_aboutMe_css__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_aboutMe_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__css_aboutMe_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__css_myView_css__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__css_myView_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__css_myView_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__css_main_css__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__css_main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__css_main_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__css_morePro_css__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__css_morePro_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__css_morePro_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__index_html__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__index_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__index_html__);
/**
 * Created by 文朝希 on 2017/8/16.
 */








__webpack_require__(23);
__webpack_require__(24);
__webpack_require__(32);
__webpack_require__(33);
// require('./js/morePro.js');



$(document).ready(function(){
    $("html,body").animate({"scrollTop": 0}, 100);
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./reset.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./reset.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* reset */\nhtml,body,h1,h2,h3,h4,h5,h6,div,dl,dt,dd,ul,ol,li,p,blockquote,pre,hr,figure,table,caption,th,td,form,fieldset,legend,input,button,textarea,menu{margin:0;padding:0;}\nheader,footer,section,article,aside,nav,hgroup,address,figure,figcaption,menu,details{display:block;}\ntable{border-collapse:collapse;border-spacing:0;}\ncaption,th{text-align:left;font-weight:normal;}\nhtml,body,fieldset,img,iframe,abbr{border:0;}\ni,cite,em,var,address,dfn{font-style:normal;}\n[hidefocus],summary{outline:0;}\nli{list-style:none;}\nh1,h2,h3,h4,h5,h6,small{font-size:100%;}\nsup,sub{font-size:83%;}\npre,code,kbd,samp{font-family:inherit;}\nq:before,q:after{content:none;}\ntextarea{overflow:auto;resize:none;}\nlabel,summary{cursor:default;}\na,button{cursor:pointer;}\nh1,h2,h3,h4,h5,h6,em,strong,b{font-weight:bold;}\ndel,ins,u,s,a,a:hover{text-decoration:none;}\nbody,textarea,input,button,select,keygen,legend{font:12px/1.14 arial,\\5b8b\\4f53;color:#333;outline:0;}\nbody{background:#fff;}\na,a:hover{color:#333;}\n", ""]);

// exports


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./slideBanner.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./slideBanner.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#mybanner .carousel-indicators{\r\n    bottom:6%;\r\n}\r\n#mybanner .carousel-indicators li{\r\n    border:2px solid rgba(255,255,255,0.8);\r\n    border-radius: 7px;\r\n    margin-left:8px;\r\n}\r\n#mybanner .carousel-indicators .active{\r\n    background:rgba(255,255,255,0.4);\r\n}\r\n#mybanner .carousel-inner .item{\r\n    width:100%;\r\n}\r\n#mybanner .carousel-inner .item img{\r\n    width:100%;\r\n}\r\n#mybanner .carousel-control{\r\n    height:8%;\r\n    width:8%;\r\n    top:42%;\r\n    background:none;\r\n}\r\n#mybanner .carousel-control img{\r\n    width:100%;\r\n}\r\n#mybanner .left{\r\n    left:0;\r\n}\r\n#mybanner .right{\r\n    right:0;\r\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./contactPop.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./contactPop.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "#contact{\r\n    position:absolute;\r\n    z-index:100;\r\n    top:50%;\r\n    width:8%;\r\n    min-width:60px;\r\n}\r\n#contact .contact_pic img{\r\n    display:none;\r\n    width:100%;\r\n    cursor:pointer;\r\n}\r\n#contact .contact_con{\r\n    height:0;\r\n    width:0;\r\n    -webkit-box-shadow: 0 0 8px #000;\r\n            box-shadow: 0 0 8px #000;\r\n    border-radius:8px;\r\n    overflow:hidden;\r\n}\r\n#contact .contact_con .con_box{\r\n    background:rgba(26,26,26,0.6);\r\n    height:100%;\r\n}\r\n#contact .contact_con .con_box .contact_close{\r\n    float:right;\r\n    margin-top:6px;\r\n    cursor:pointer;\r\n}\r\n#contact .contact_con .con_box .content{\r\n    padding-top:20px;\r\n}\r\n#contact .contact_con .con_box .content  p{\r\n    text-align: left;\r\n    padding:30px 0 14px 26px;\r\n}\r\n#contact .contact_con .con_box .content  p span{\r\n    font:normal bold 12px/16px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    border:none;\r\n    background:none;\r\n    color:#fff;\r\n}\r\n#contact .contact_con .con_box .content  img{\r\n    margin-right:6px;\r\n}\r\n#contact .contact_con .con_box .content button{\r\n    display:block;\r\n    height:26px;\r\n    width:80px;\r\n    font:normal bold 12px/12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    margin:0 auto;\r\n    background-color:rgba(255,255,80,0.9);\r\n}\r\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./aboutMe.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./aboutMe.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".contentBox .contentDiv .myIntroduce .container{\r\n    border-radius: 26px;\r\n    padding:30px 30px 20px;\r\n    -webkit-box-shadow: 0 0 20px #000;\r\n            box-shadow: 0 0 20px #000;\r\n    margin-top: 30px;\r\n    margin-bottom: 30px;\r\n}\r\n.myIntroduce .introContent{\r\n    -webkit-box-shadow: 0 0 16px #fff;\r\n            box-shadow: 0 0 16px #fff;\r\n    border-radius:16px;\r\n    padding:28px;\r\n    margin-bottom:20px;\r\n    background:rgba(26,26,26,0.1);\r\n}\r\n.myIntroduce .mediaPlugin{\r\n    -webkit-box-shadow: 0 0 16px #fff;\r\n            box-shadow: 0 0 16px #fff;\r\n    border-radius:16px;\r\n    padding:4px;\r\n    background:rgba(26,26,26,0.1);\r\n}\r\n.myIntroduce .mediaPlugin p{\r\n    height:1px;\r\n    width:80%;\r\n    margin:16px auto;\r\n    background-color:rgba(255,255,255,0.6);\r\n}\r\n.myIntroduce .introduce{\r\n    padding-bottom:26px;\r\n    border-bottom:1px solid rgba(255,255,255,0.6);\r\n}\r\n.myIntroduce .introduce h1{\r\n    font: normal bold 20px/28px STHeiti;\r\n    padding-bottom: 14px;\r\n    color:rgba(255,255,255,0.8);\r\n    text-align: center;\r\n}\r\n.myIntroduce .introduce p{\r\n    border:2px solid rgba(255,255,255,0.5);\r\n    padding:16px;\r\n    border-radius: 10px;\r\n    -webkit-box-shadow: 0 0 16px rgba(255,255,255,0.9);\r\n            box-shadow: 0 0 16px rgba(255,255,255,0.9);\r\n    font:normal normal 16px/20px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:rgba(255,255,255,0.8);\r\n    background-color:rgba(43,85,194,0.2);\r\n}\r\n.myIntroduce .intrests,.myIntroduce .skills{\r\n    margin-top:36px;\r\n    padding-bottom:26px;\r\n    border-bottom:1px solid rgba(255,255,255,0.6);\r\n}\r\n.myIntroduce .intrests h1,.myIntroduce .skills h1{\r\n    text-align: center;\r\n    font: normal bold 20px/28px STHeiti;\r\n    padding-bottom: 12px;\r\n    color:rgba(255,255,255,0.8);\r\n}\r\n.myIntroduce .intrests .intrestSharing,.myIntroduce .skills .skillsSharing{\r\n    margin-top:6px;\r\n}\r\n.myIntroduce .intrests .intrestSharing .intrestImg,.myIntroduce .skills .skillsSharing .skillImg{\r\n    border:2px solid rgba(255,255,255,0.5);\r\n    border-radius:8px;\r\n    -webkit-box-shadow: 0 0 10px rgba(255,255,255,0.9);\r\n            box-shadow: 0 0 10px rgba(255,255,255,0.9);\r\n    padding:8px 0;\r\n    background-color:rgba(43,85,194,0.2);\r\n}\r\n.myIntroduce .intrests .intrestSharing .intrestImg img,.myIntroduce .skills .skillsSharing .skillImg img{\r\n    display:block;\r\n    cursor:pointer;\r\n    width:80%;\r\n    margin:0 auto;\r\n}\r\n.myIntroduce .intrests .intrestSharing p,.myIntroduce .skills .skillsSharing p{\r\n    color:rgba(255,255,255,0.8);\r\n    font:normal bold 16px/22px SimSun;\r\n    text-align: center;\r\n    margin:16px 0;\r\n}\r\n\r\n.myIntroduce .introRemind{\r\n    border-radius:16px;\r\n    -webkit-box-shadow: 0 0 16px #fff;\r\n            box-shadow: 0 0 16px #fff;\r\n    padding:78px 28px;\r\n    margin-top:40px;\r\n    margin-bottom:20px;\r\n    background:rgba(26,26,26,0.1);\r\n}\r\n.myIntroduce .introRemind p{\r\n    font:normal normal 16px/16px SimSun;\r\n    color:rgba(255,255,255,0.8);\r\n    text-align: center;\r\n}\r\n\r\n#introPopup{\r\n    display:none;\r\n    position:fixed;\r\n    width:100%;\r\n    height:100%;\r\n    background:rgba(26,26,26,0.8);\r\n    z-index:1000;\r\n    left:0;\r\n    top:0;\r\n    overflow-y: scroll;\r\n\r\n}\r\n#introPopup .introPupList{\r\n    margin:80px 10% 10% 10%;\r\n}\r\n#introPopup .introPupList .introPopClose{\r\n    cursor:pointer;\r\n}\r\n#introPopup .introPupList .introListCont{\r\n    z-index:1100;\r\n    border:2px solid #fff;\r\n    -webkit-box-shadow: 0 0 16px rgba(0,190,255,0.7);\r\n            box-shadow: 0 0 16px rgba(0,190,255,0.7);\r\n    border-radius:16px;\r\n    font-size:20px;\r\n    color:#fff;\r\n    padding:28px;\r\n    background:#fff;\r\n}\r\n#introPopup .introShareUl{\r\n    width:90%;\r\n    margin:0 auto;\r\n\r\n}\r\n#introPopup .introShareUl li{\r\n    padding:10px 20px;\r\n    border-bottom: 1px solid rgba(0,190,255,0.7);\r\n    -webkit-box-shadow: 0 0 26px rgba(0,190,255,0.7);\r\n            box-shadow: 0 0 26px rgba(0,190,255,0.7);\r\n    margin:26px 0;\r\n    border-radius: 16px;\r\n}\r\n\r\n#introPopup .introShareUl .introBox>a{\r\n    display:block;\r\n    text-decoration: underline;\r\n    margin-bottom:14px;\r\n    font:normal normal 18px/26px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n#introPopup .introShareUl .introBox>p{\r\n    color:#000;\r\n}\r\n#introPopup .introShareUl .introBox>p>span{\r\n    font:normal normal 14px/20px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n#introPopup .introShareUl .introBox>p>i{\r\n    font:normal normal 14px/20px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    margin-right:18px;\r\n}\r\n\r\n\r\n\r\n/*<div class=\"introBox\">*/\r\n/*<a >好莱坞最感</a><span>密码：</span><i>8888</i><span>更新时间：</span><i>2017-07-11 19:14:22</i>*/\r\n/*</div>*/", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./myView.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./myView.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".contentBox .contentDiv .personalView .container{\r\n    border-radius: 26px;\r\n    padding-top:30px;\r\n    padding-bottom:20px;\r\n    -webkit-box-shadow: 0 0 20px #000;\r\n            box-shadow: 0 0 20px #000;\r\n    margin-top: 30px;\r\n    margin-bottom: 30px;\r\n}\r\n.contentBox .contentDiv .personalView .container h1{\r\n    color:#000;\r\n    font:normal bold 24px/28px SimSun;\r\n    margin:40px 10% 20px;\r\n}\r\n.contentBox .contentDiv .personalView .container ul{\r\n    border:2px solid rgba(255,255,255,0.9);\r\n    -webkit-box-shadow: 0 0 14px #fff;\r\n            box-shadow: 0 0 14px #fff;\r\n    border-radius:26px;\r\n    padding:0 8%;\r\n    margin:0 10% 12% 10%;\r\n    background-color:rgba(255,255,255,0.6);\r\n}\r\n.contentBox .contentDiv .personalView .container ul li{\r\n    margin:25px 0;\r\n    height:50px;\r\n\r\n}\r\n.contentBox .contentDiv .personalView .container ul li img{\r\n    margin-right:26px;\r\n    -webkit-box-shadow: 0 0 16px rgba(0,0,0,0.8);\r\n            box-shadow: 0 0 16px rgba(0,0,0,0.8);\r\n}\r\n.contentBox .contentDiv .personalView .container ul li a{\r\n    font:normal bold 16px/18px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n.contentBox .contentDiv .personalView .container ul li a:hover{\r\n    color:#fff;\r\n}\r\n\r\n\r\n@media (max-width:768px){\r\n    .contentBox .contentDiv .personalView .container ul li a{\r\n        display:inline-block;\r\n        width:52%;\r\n        vertical-align: middle;\r\n    }\r\n    .contentBox .contentDiv .personalView .container h1{\r\n        margin:18px 0;\r\n        text-align: center;\r\n    }\r\n}", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(15);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./main.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body{\r\n    -webkit-transition: background-image 1.2s linear;\r\n    transition: background-image 1.2s linear;\r\n    background-attachment: fixed;\r\n}\r\n.myIndexbg{\r\n    background-image: url(" + __webpack_require__(16) + ");\r\n}\r\n.myIntrobg{\r\n    background-image: url(" + __webpack_require__(17) + ");\r\n}\r\n.myViewbg{\r\n    background-image: url(" + __webpack_require__(18) + ");\r\n}\r\n.mymoreProbg{\r\n    background-image: url(" + __webpack_require__(19) + ");\r\n}\r\n\r\ntextarea::-webkit-input-placeholder,input::-webkit-input-placeholder {\r\n    color: rgba(200,200,200,0.9);\r\n}\r\ntextarea:-moz-placeholder,input:-moz-placeholder {\r\n    color: rgba(200,200,200,0.9);\r\n}\r\ntextarea::-moz-placeholder,input::-moz-placeholder {\r\n    color: rgba(200,200,200,0.9);\r\n}\r\ntextarea:-ms-input-placeholder,input:-ms-input-placeholder{\r\n    color: rgba(200,200,200,0.9);\r\n}\r\n\r\n.clearfix{\r\n    *zoom: 1;\r\n}\r\n.clearfix:before, .clearfix:after {\r\n    display: table;\r\n    line-height: 0;\r\n    content: \"\";\r\n}\r\n.clearfix:after {\r\n    clear: both;\r\n}\r\n\r\n.header{\r\n    width:100%;\r\n    background:#262626;\r\n}\r\n.header .navbar{\r\n    margin-bottom:0;\r\n}\r\n.header .navbar .navbar-brand{\r\n    width:94px;\r\n    height:55px;\r\n    padding:0;\r\n    margin-top:5px;\r\n    margin-left:4px;\r\n}\r\n.header .navbar .navbar-brand img{\r\n    display:block;\r\n    width:100%;\r\n}\r\n.header .navbar .navbar-toggle{\r\n    margin-top:18px;\r\n}\r\n.header .navbar .navbar-toggle .icon-bar{\r\n    background:rgba(255,255,255,0.8 );\r\n}\r\n.header .navbar .navbar-collapse{\r\n    padding-right:28px;\r\n    padding-left:28px;\r\n}\r\n.header .navbar .navbar-collapse>ul{\r\n    float:right;\r\n}\r\n.header .navbar .navbar-collapse>ul>li{\r\n    float:left;\r\n    margin-left:50px;\r\n    margin-top:18px;\r\n    height:30px;\r\n    width:90px;\r\n    background-color:#262626;\r\n    border:2px solid rgba(255,255,255,0.8);\r\n    border-radius: 15px;\r\n    text-align: center;\r\n}\r\n.header .navbar .navbar-collapse>ul>li.active{\r\n    background:rgba(255,255,255,0.8);\r\n    border:2px solid #000;\r\n}\r\n.header .navbar .navbar-collapse>ul>li:first-child{\r\n    margin-left:0;\r\n}\r\n.header .navbar .navbar-collapse>ul>li>a{\r\n    display:block;\r\n    color:#fff;\r\n    font:normal bold 12px/26px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    text-align: center;\r\n    text-decoration: none;\r\n}\r\n.header .navbar .navbar-collapse>ul>li.active a{\r\n    color:#000;\r\n}\r\n\r\n\r\n.mymotto{\r\n    padding:0 20px;\r\n    margin-top:30px;\r\n    -webkit-transition: background,height 1s,0.5s,0.5s linear,linear,linear,-webkit-box-shadow;\r\n    transition: background,height 1s,0.5s,0.5s linear,linear,linear,-webkit-box-shadow;\r\n    transition: background,box-shadow,height 1s,0.5s,0.5s linear,linear,linear;\r\n    transition: background,box-shadow,height 1s,0.5s,0.5s linear,linear,linear,-webkit-box-shadow;\r\n}\r\n.mymotto h1{\r\n    display:none;\r\n    font:normal normal 80px/100px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:#000;\r\n    text-align: center;\r\n    border-bottom:2px solid black;\r\n}\r\n.mottoBg{\r\n    -webkit-box-shadow:0 0 20px #000;\r\n            box-shadow:0 0 20px #000;\r\n    border-radius: 16px;\r\n    background:url(" + __webpack_require__(20) + ");\r\n}\r\n.mottoContent{\r\n    padding-top:130px;\r\n    vertical-align: middle;\r\n    font:normal bold 80px/100px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:#000;\r\n    -webkit-transition:font,padding 0.5s,0.5s linear,linear;\r\n    transition:font,padding 0.5s,0.5s linear,linear;\r\n}\r\n\r\n.msgBoard{\r\n    margin-bottom:80px;\r\n}\r\n.msgBoard .container{\r\n    border-radius: 26px;\r\n    margin-top:30px;\r\n    padding-top:30px;\r\n    padding-bottom:80px;\r\n    -webkit-box-shadow: 0 0 16px #fff;\r\n            box-shadow: 0 0 16px #fff;\r\n    -webkit-transition: background 0.5s linear;\r\n    transition: background 0.5s linear;\r\n}\r\n.msgBoard .advice_hd{\r\n    border-bottom:2px solid rgba(255,255,255,0.6);\r\n    padding-bottom:20px;\r\n    width:95%;\r\n    margin:0 auto;\r\n}\r\n.msgBoard .advice_hd img{\r\n    display:block;\r\n    width:133px;\r\n    margin:0 auto;\r\n}\r\n.msgBoard .advice_ths{\r\n    margin-top:36px;\r\n    margin-left:28px;\r\n    color:rgba(238,231,231,0.6);\r\n    font:normal normal 16px/20px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n.msgBoard .addAdvice h3{\r\n    margin:50px 0 24px 28px;\r\n    font:normal bold 22px/24px SimSun;\r\n    color:rgba(255,255,255,0.8);\r\n}\r\n.msgBoard .addAdvice .advicetext{\r\n    padding:0 10%;\r\n    position:relative;\r\n}\r\n.msgBoard .addAdvice .inputBox{\r\n    width:100%;\r\n    padding:20px;\r\n    border:2px solid rgba(255,255,255,0.8);\r\n    border-radius:40px;\r\n}\r\n.msgBoard .addAdvice .inputBox textarea{\r\n    width:100%;\r\n    height:130px;\r\n    background:none;\r\n    text-indent: 36px;\r\n    font:normal normal 16px/30px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:#fff;\r\n    border:none;\r\n    overflow-x: hidden;\r\n\r\n}\r\n.msgBoard .addAdvice .advicetext h6{\r\n    position:absolute;\r\n    bottom:10px;\r\n    right:13%;\r\n    font-family: SimSun;\r\n    color:#000;\r\n}\r\n.msgBoard .addAdvice .advicetext h6 span{\r\n    color:rgba(255,255,255,0.8);\r\n    font-family: SimSun;\r\n}\r\n.msgBoard .addAdvice>.row{\r\n    padding:0 10%;\r\n}\r\n.msgBoard .addAdvice .userName{\r\n    float:right;\r\n    margin-top: 21px;\r\n    height:32px;\r\n    width:120px;\r\n    border:2px solid rgba(255,255,255,0.8);\r\n    background:none;\r\n    border-radius: 14px;\r\n    text-indent:8px;\r\n    font:normal normal 10px/32px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:#fff;\r\n\r\n}\r\n.msgBoard .addAdvice .addAdviceBtn{\r\n    float:right;\r\n    height: 34px;\r\n    width: 120px;\r\n    background-color: rgba(255, 255, 255,0.2);\r\n    border: 2px solid rgba(255,255,255,0.9);\r\n    border-radius: 24px;\r\n    color: rgba(255,255,255,0.9);\r\n    font: normal normal 14px/34px 微软雅黑;\r\n    margin-top: 20px;\r\n    text-align: center;\r\n    cursor: pointer;\r\n}\r\n\r\n.adviceBox{\r\n    position:relative;\r\n    width:100%;\r\n}\r\n.adviceBox h3{\r\n    margin:50px 0 24px 28px;\r\n    font:normal bold 22px/24px SimSun;\r\n    color:rgba(255,255,255,0.8);\r\n}\r\n.adviceBox .scrollLine{\r\n    position:absolute;\r\n    right:4%;\r\n    bottom:20px;\r\n    width:12px;\r\n    height:360px;\r\n    border:2px solid rgba(255,255,255,0.8);\r\n    border-radius:6px;\r\n    z-index:100;\r\n}\r\n.adviceBox .scrollLine  .scrollBtn{\r\n    position:absolute;\r\n    width:16px;\r\n    height:30px;\r\n    border-radius:10px;\r\n    background:#fff;\r\n    cursor:pointer;\r\n    top:0;\r\n    left:-4px;\r\n}\r\n.adviceBox  .adviceList{\r\n    width:80%;\r\n    height:400px;\r\n    overflow: hidden;\r\n    position: relative;\r\n    border:2px solid rgba(255,255,255,0.8);\r\n    border-radius: 40px;\r\n    left:10%;\r\n}\r\n#listBox{\r\n    position:absolute;\r\n    width: 88%;\r\n    margin:0 6%;\r\n\r\n}\r\n#listBox .adviceContent{\r\n    margin-top:20px;\r\n    margin-bottom: 20px;\r\n}\r\n#listBox .adviceContent table{\r\n    display:block;\r\n    padding:26px 16px;\r\n    font:normal normal 14px/20px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    border:2px solid rgba(255,255,255,0.9);\r\n    background-color:rgba(198,250,168,0.2);\r\n    border-radius: 26px;\r\n}\r\n#listBox .adviceContent table td{\r\n    word-wrap:break-word;\r\n    word-break: break-all;\r\n    font:normal normal 16px/16px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    vertical-align: middle;\r\n    color:#fff;\r\n}\r\n#listBox .adviceContent h6{\r\n    float:right;\r\n    margin-top:2px;\r\n    margin-right:14px;\r\n    font-family: SimSun;\r\n}\r\n#listBox .adviceContent h6 span{\r\n    display:inline-block;\r\n    font-size:14px;\r\n    color:rgba(255,255,255,0.8);\r\n    margin-left:16px;\r\n    word-break: break-all;\r\n    word-wrap: break-word;\r\n    font-family: SimSun;\r\n}\r\n\r\n.contentBox .contentDiv{\r\n    display:none;\r\n    height:0;\r\n}\r\n.contentBox .contentDiv.active{\r\n    display:block;\r\n}\r\n\r\n/*index*/\r\n.contentBox .viewPart{\r\n    margin-top:30px;\r\n    -webkit-box-shadow: 0 0 20px #000;\r\n            box-shadow: 0 0 20px #000;\r\n    border-radius:26px;\r\n    padding-top:30px;\r\n    padding-bottom:80px;\r\n    background-color:rgba(26,26,26,0.1);\r\n}\r\n.contentBox .viewPart .dayView .advice_hd{\r\n    border-bottom:2px solid rgba(255,255,255,0.8);\r\n    padding-bottom:20px;\r\n    width:95%;\r\n    margin:0 auto;\r\n}\r\n.contentBox .viewPart .dayView .advice_hd img{\r\n    display:block;\r\n    width:133px;\r\n    margin:0 auto;\r\n}\r\n.contentBox .viewPart .dayView .viewTabs{\r\n    position:relative;\r\n    margin-left:58px;\r\n    margin-top:36px;\r\n}\r\n\r\n.contentBox .viewPart .dayView .viewTabs li{\r\n    position:relative;\r\n    font:normal bold 24px/28px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:rgba(255,255,255,0.4);\r\n    float:left;\r\n    cursor:pointer;\r\n    z-index:10;\r\n}\r\n.contentBox .viewPart .dayView .viewTabs:before{\r\n    content:\"\";\r\n    position:absolute;\r\n    height:18px;\r\n    width:2px;\r\n    background:rgba(255,192,40,0.6);\r\n    left:80px;\r\n    top:5px;\r\n}\r\n.contentBox .viewPart .dayView .viewTabs .active{\r\n    color:#ffc028;\r\n}\r\n.contentBox .viewPart .dayView .viewTabs .techTab{\r\n    margin-right:20px;\r\n}\r\n\r\n.contentBox .viewPart .dayView .viewContents{\r\n    border:2px solid #ffc028;\r\n    border-radius: 16px;\r\n    width:95%;\r\n    margin:0 auto;\r\n    padding:28px 34px;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent{\r\n    display:block;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul{\r\n    margin-top:-50px;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li{\r\n    margin-top:50px;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox{\r\n    padding-bottom:20px;\r\n    border-bottom:2px solid rgba(255,255,255,0.6);\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox>a{\r\n    font:normal bold 22px/34px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:#ffc028;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox p{\r\n    margin:20px 0 30px 0;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox p span{\r\n    margin-right:30px;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox p  a{\r\n    color: #fffc17;\r\n    font-size:14px;\r\n    font-weight: bold;\r\n    text-decoration: underline;\r\n    font-family: \"SimSun\";\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox p a:hover{\r\n    color:rgba(255,187,24,0.6);\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox>span{\r\n    color:rgba(255,255,255,0.8);\r\n    margin-right:5%;\r\n    font-weight: bold;\r\n    font-family: \"SimSun\";\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent ul li .techBox>i{\r\n    margin-left:-5%;\r\n    font-weight: bold;\r\n    color:rgba(255,255,255,0.8);\r\n    font-family: \"SimSun\";\r\n}\r\n.contentBox .viewPart .dayView .viewContents .techContent .techMore{\r\n    height: 34px;\r\n    width: 120px;\r\n    background-color: #ffc028;\r\n    border-radius: 24px;\r\n    color: rgba(255,255,255,0.9);\r\n    font: normal normal 16px/34px 微软雅黑;\r\n    margin:0 auto;\r\n    margin-top:20px;\r\n    text-align: center;\r\n    cursor:pointer;\r\n}\r\n.contentBox .viewPart .dayView .viewContents .videoContent{\r\n    display:none;\r\n}\r\n#videoItems li{\r\n    padding-left:0;\r\n    padding-right:30px;\r\n\r\n}\r\n#videoItems .videoBox{\r\n    padding:10px 24px 10px 10px;\r\n    border:4px solid rgba(255,255,255,0.4);\r\n    margin:12px 0;\r\n    border-radius:20px;\r\n    background:rgba(75,94,155,0.4);\r\n}\r\n#videoItems .videoBox a{\r\n    color: #ffc028;\r\n    font: bold 22px/34px 微软雅黑;\r\n}\r\n#videoItems .videoBox p{\r\n    margin-top:20px;\r\n}\r\n#videoItems .videoBox p span{\r\n    margin-right:5%;\r\n    color: rgba(255,255,255,0.8);\r\n    font-weight: bold;\r\n}\r\n#videoItems .videoBox p i{\r\n    color: rgba(255,255,255,0.8);\r\n    font-weight: bold;\r\n}\r\n#videoItems .videoBox img{\r\n    padding-top:10px;\r\n    cursor:pointer;\r\n}\r\ndiv[id^=\"bringins-block\"]{\r\n    z-index:1000;\r\n}\r\n\r\n\r\n.footer{\r\n    width:100%;\r\n    background:#262626;\r\n}\r\n.footer p span{\r\n    font:normal normal 10px/50px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:rgba(166,166,166,0.6);\r\n}\r\n.footer p a{\r\n    font:normal normal 12px/50px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n    color:rgba(188,188,188,0.6);\r\n}\r\n@media (max-width:768px){\r\n    .header .navbar .navbar-collapse>ul{\r\n        background:blue;\r\n        float:none;\r\n        margin-bottom:20px;\r\n    }\r\n    .header .navbar .navbar-collapse>ul>li{\r\n        float:none;\r\n        border:none;\r\n        border-radius: 0;\r\n        margin-left:0;\r\n        margin-top:0;\r\n        width:100%;\r\n    }\r\n    .header .navbar .navbar-collapse>ul>li>a{\r\n        text-align: center;\r\n    }\r\n    .header .navbar .navbar-collapse>ul>li:hover{\r\n        background-color:rgba(255,255,80,0.9);\r\n    }\r\n    .msgBoard .addAdvice textarea{\r\n        font-size:10px;\r\n    }\r\n    .mymotto h1{\r\n        font-size:40px;\r\n        line-height:40px;\r\n    }\r\n    .mottoContent{\r\n        font-size:35px;\r\n        line-height:40px;\r\n    }\r\n}", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/myIndexbg.jpg";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/myIntrobg.jpg";

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/myViewbg.jpg";

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/mymoreProbg.jpg";

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/mottoBg.png";

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./morePro.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/postcss-loader/lib/index.js??ref--2-2!./morePro.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".contentBox .contentDiv .githubProfile .container{\r\n    border-radius: 26px;\r\n    padding-top:30px;\r\n    padding-bottom:20px;\r\n    -webkit-box-shadow: 0 0 20px #000;\r\n            box-shadow: 0 0 20px #000;\r\n    margin-top: 30px;\r\n    margin-bottom: 30px;\r\n}\r\n.githubProfile .proList .gitpro{\r\n    position:relative;\r\n    border:2px solid rgba(255,255,255,0.9);\r\n    -webkit-box-shadow: 0 0 14px #fff;\r\n            box-shadow: 0 0 14px #fff;\r\n    border-radius:26px;\r\n    padding:4% 8%;\r\n    margin:0 10% 12% 10%;\r\n    background-color:rgba(255,255,255,0.6);\r\n    min-height:162px;\r\n}\r\n.githubProfile .proList .gitpro .text-bold{\r\n    font: bold 16px/18px 微软雅黑;\r\n    color:#0366d6;\r\n}\r\n.githubProfile .proList .gitpro .text-fork{\r\n    margin-top:8px;\r\n    color:#586069;\r\n    font:normal normal 12px/12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n.githubProfile .proList .gitpro .text-explain{\r\n    margin-top:24px;\r\n    min-height:50px;\r\n    color:#586069;\r\n    font:normal normal 12px/12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n\r\n.githubProfile .proList .gitpro .text-fork{\r\n    color:#586069;\r\n    font:normal normal 12px/12px \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n}\r\n.githubProfile .proList .gitpro .text-type{\r\n    position:absolute;\r\n    bottom:6%;\r\n}\r\n.githubProfile .proList .gitpro .text-type span{\r\n    position: relative;\r\n    top: 1px;\r\n    display: inline-block;\r\n    width: 12px;\r\n    height: 12px;\r\n    border-radius: 50%;\r\n    background-color: #000;\r\n}\r\n.cssColor{\r\n    background-color: #563d7c !important;\r\n}\r\n.htmlColor{\r\n    background-color: #e34c26 !important;\r\n}\r\n.jsColor{\r\n    background-color: #f1e05a !important;\r\n}", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports) {

$(function(){
    $("#ab").carousel({
        interval:2000
    });
    $("a.left").click(function(){
        $(".carousel").carousel("prev");
    });
    $("a.right").click(function(){
        $(".carousel").carousel("next");
    });

});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(27);
__webpack_require__(28);
__webpack_require__(29);
__webpack_require__(30);
__webpack_require__(31);

var hdNav = $("#hd_nav");
var conBox = $(".contentBox");
var conDiv = conBox.find(".contentDiv");
var listBox = $("#listBox");
var contact = $("#contact");
var navBrand = $(".navbar-brand").find("a");
var viewTabs = $(".viewTabs");
var myTechNews = $("#myTechNews");
var videoContent = $(".videoContent");
var videoItems = $("#videoItems");
var videoIframe = $("#videoIframe");
var addAdviceBtn = $(".addAdviceBtn");
var adviceInput = $("#adviceInput");
var userName = $(".userName");
var scrollBtn = $(".scrollBtn");
var misBoard = $(".msgBoard").find(".container");
var contactPic = $(".contact_pic").find("img");
var ismottoFresh = false;
var toggleTime = 400;

var hash = window.location.hash.substring(1) || "index";
//初始化
init();

function init() {
    mottoRefresh();
    //根据初始化hash添加相对应的class
    conDiv.each(function () {
        if ($(this).attr("data-hash") === hash) {
            $(this).addClass("active");
            navLiBg();
            bgRefresh();
        }
    });
    //绑定导航条点击事件
    hdNav.find("a").add(navBrand).click(function (ev) {
        if ($(this).attr("data-hash")) {
            hash = $(this).attr("data-hash");
            //改变hash值
            window.location.hash = hash;
        }
        //改变按钮样式
        if ($(this).get(0).nodeName == "A") {
            hdNav.find(".active").removeClass("active");
            $(this).closest("li").addClass("active");
        }
        ev.stopPropagation();
    });


    $(window).on('resize', function () {
        var listHeight = listBox.height();
        conDiv.css("height", "auto").height();
        listBox.get(0).adListBoxHeight = listHeight;
    });

    //绑定hash变化事件
    $(window).on("hashchange", function () {
        hash = window.location.hash.substring(1);
        mottoRefresh();
        navLiBg();
        bgRefresh();
        boxRefresh();
    });
    //每日一览绑定选项卡切换
    viewTabs.children("li").click(function () {
        $(viewTabs.children(".active").attr("data-target")).css("display", "none");
        viewTabs.children(".active").removeClass("active");
        $(this).addClass("active");
        $($(this).attr("data-target")).css("display", "block");
    });
    //根据hash值进行相应内容的刷新
    boxRefresh();
}
function mottoRefresh() {
    //签名板
    if(hash === "index" && !ismottoFresh){
        ismottoFresh = true;
        $(".mottoContent").animatext({
            speed:160
        });
        $(".mymotto").css("height",$(window).height());
        setTimeout(function () {
            $(".mymotto").css("height","auto");
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $(".mottoContent").css({
                    "font-weight":"normal",
                    "font-size":"28px",
                    "padding-top":0
                });
            } else {
                $(".mottoContent").css({
                    "font-weight":"normal",
                    "font-size":"60px",
                    "padding-top":0
                });
            }
            $(".mymotto").addClass("mottoBg");
            $(".mymotto").find("h1").css("display","block");
        },10000);
    }
}
//导航条按钮颜色改变
function navLiBg() {
    hdNav.find("a").each(function () {
        if ($(this).attr("data-hash") == hash) {
            hdNav.find(".active").removeClass("active");
            $(this).closest("li").addClass("active");
        }
    });
}
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    toggleTime = 1200;
} else {
    toggleTime = 500;
}
//背景图片刷新
function bgRefresh() {
    switch (hash) {
        case "index":
            contactPic.hide().filter(".spring").show();
            break;
        case "myIntro":
            contactPic.hide().filter(".summer").show();
            break;
        case "myView":
            contactPic.hide().filter(".winter").show();
            break;
        case "morePro":
            contactPic.hide().filter(".autumn").show();
            break;
        default:
            break;
    }
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        toggleTime = 1;
        switch (hash) {
            case "index":
                $(document.body).css("background-color", "#ffefd1");
                break;
            case "myIntro":
                $(document.body).css("background-color", "#86e0fa");
                break;
            case "myView":
                $(document.body).css("background-color", "#e34c26");
                break;
            case "morePro":
                $(document.body).css("background-color", "#f6c401");
                break;
            default:
                break;
        }
    } else {
        toggleTime = 500;
        switch (hash) {
            case "index":
                $(document.body).attr("class", "myIndexbg");
                break;
            case "myIntro":
                $(document.body).attr("class", "myIntrobg");
                break;
            case "myView":
                $(document.body).attr("class", "myViewbg");
                break;
            case "morePro":
                $(document.body).attr("class", "mymoreProbg");
                break;
            default:
                break;
        }
    }
}
//内容刷新
function boxRefresh() {
    var indexContent = conBox.children(".active");
    conDiv.each(function () {
        if ($(this).attr("data-hash") === hash) {
            var $this = $(this);
            indexContent.stop().animate({"height": 0}, toggleTime,function () {
                conDiv.removeClass("active");
                var oheight = $this.css("height", "auto").height();
                $this.css({"height": 0}).addClass("active").stop().animate({"height": oheight}, toggleTime,function () {
                    $this.css("height", "auto");
                });
            });
        }
    });
}
$(window).on('scroll',function () {
    var showDis = misBoard.offset().top - $(window).scrollTop();
    if(showDis <= 160){
        misBoard.css("background","rgba(26,26,26,0.5)");
    }else if(showDis >= 270){
        misBoard.css("background","none");
    }
});


//使用弹窗插件
contact.contactPop({isSorp: true, sorpRange: 30});

//复制提示
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $(".btn").on('touchend',function () {
        $(this).html('复制成功！');
    });
    $(".contact_close").on('touchend',function () {
        $(".btn").html('点我复制');
    });
}else{
    $(".btn").click(function () {
        $(this).html('复制成功！');
    });
    $(".contact_close").click(function () {
        $(".btn").html('点我复制');
    });
}
// //使用复制剪切板插件
new Clipboard('.btn');
//滚动条插件
$(".scrollBtn").scrollLine({scrollBtnHeight: 30, scrollLineHeight: 360});
//建议输入字数检测限制
$("#adviceInput").limitWord({limitLength: 140});


//ajax
//每日一览技术栏内容获取更新
$.getJSON("http://gank.io/api/random/data/前端/6", function (json) {
    if (typeof json === true) {
        myTechNews.html("<li>服务器开小差去啦~</li>");
    } else if (json.error === false) {
        $.each(json.results, function (index) {
            var oLi = $("<li>");
            var oDiv = $("<div class='techBox'></div>");
            if (json.results[index].images) {
                oDiv.html('<a href="' + json.results[index].url + '" target="_blank">' + decodeURI(json.results[index].desc) + '</a> <p> <span><a href="' + json.results[index].images + '" rel="noreferrer" target="_blank">图片(点击查看)</a></span> <span><a href="' + json.results[index].url + '" target="_blank">详细了解>></a></span> </p> <span>' + new Date().toLocaleDateString() + '</span><span>作者 / 来源：</span><i>' + decodeURI(json.results[index].who) + '</i>');
            } else {
                oDiv.html('<a href="' + json.results[index].url + '" target="_blank">' + decodeURI(json.results[index].desc) + '</a> <p><span><a href="' + json.results[index].url + '"  target="_blank">详细了解>></a></span> </p> <span>' + new Date().toLocaleDateString() + '</span><span>作者 / 来源：</span><i>' + decodeURI(json.results[index].who) + '</i>');
            }
            oDiv.appendTo(oLi);
            oLi.appendTo(myTechNews);
        });
    }
    //每日一览技术栏折叠
    $(".techMore").toggleShowMore({
        toggleNum: 2,
        btnName: "想看更多",
        btnToggleName: "收回"
    });

});

//每日一览休闲栏内容获取更新
$.getJSON("http://gank.io/api/random/data/休息视频/2", function (json) {
    if (json.error === true) {
        videoItems.html("<li>服务器开小差去啦~</li>");
    } else if (json.error === false) {
        $.each(json.results, function (index) {
            var oLi = $("<li class='col-md-6 col-sm-12'></li>");
            var oDiv = $("<div class='videoBox'></div>");
            var oRow = $("<div class='row'></div>");
            var oTitle = $("<div class='col-sm-9 col-xs-12'></div>");
            var oCont = $("<div class='col-sm-3 col-xs-12'></div>");
            var oImg = $("<img src='./images/play.png' alt='播放'>");
            oImg.attr("link-target", json.results[index].url);
            oTitle.html('<a href="javascript:;">' + decodeURI(json.results[index].desc) + '</a> <p><span>' + new Date().toLocaleDateString() + '</span><span>作者 / 来源：</span><i>' + decodeURI(json.results[index].who) + '</i></p>');
            oTitle.appendTo(oRow);
            oImg.appendTo(oCont);
            oCont.appendTo(oRow);

            oRow.appendTo(oDiv);
            oDiv.appendTo(oLi);
            oLi.appendTo(videoItems);
        });
        videoContent.find("img").click(function () {
            var $This = $(this);
            videoIframe.html('<iframe src="' + $This.attr("link-target") + '" height="100%" width="100%" allowfullscreen="true"></iframe>');
            videoIframe.bringins({
                "position": "center",
                "color": "black",
                "closeButton": "white",
                "width": "100%"
            });
        });
    }
});

//页面加载，建议列表加载
$.ajax({
    url:"advicePhp/data.php",
    method:"GET",
    dataType:"json",
    success:function (json) {
        $.each(json, function (index, value) {
            var oDiv = $("<div class='adviceContent clearfix'></div>");
            oDiv.html('<table><tr><td>' + decodeURI(value.comment) + '</td></tr></table><h6><span>By：' + decodeURI(value.user) + '</span><span>' + value.addtime + '</span></h6>');
            oDiv.prependTo(listBox);
        });
    },
    complete:function () {
        //检测是否需要出现滚动条并作相应调整
        scrollShow(400);
    }
});


//添加建议---点击方式
addAdviceBtn.click(function () {
    inputAdvice();
});
//添加建议 --- 回车方式
adviceInput.keyup(function (ev) {
    if (ev.keyCode === 13) {
        ev.preventDefault();
        inputAdvice();
    }
});


function inputAdvice() {
    var user = userName.val() || "路人";
    var txt = adviceInput.val();
    var txtLength;
    user = user.replace(/(^\s*)|(\s*$)/g, "");
    txt = txt.replace(/(^\s*)|(\s*$)/g, "");
    txtLength = txt.length;
    userLength = user.length;
    if (txtLength > 10) {
        if (userLength < 20) {
            var isAdviced = getCookie('isAdviced');
            if (isAdviced != null && isAdviced != "") {
                alert("您今天已经提交了一次建议，改日再来吧~");
                adviceInput.val("");
            } else {
                $.ajax({
                    method: "POST",
                    dataType: "json",
                    url: "advicePhp/comment.php",
                    data: "user=" + user + "&txt=" + txt,
                    success: function (json) {
                        //添加建议到列表
                        var oDiv = $("<div class='adviceContent clearfix'></div>");
                        oDiv.html('<table><tr><td>' + decodeURI(json.txt) + '</td></tr></table><h6><span>By：' + decodeURI(json.user) + '</span><span>' + getNowFormatDate() + '</span></h6>');
                        oDiv.prependTo(listBox);
                        //提交成功后，清空输入内容,设置cookie
                        adviceInput.val("");
                        userName.val("");
                        setCookie('isAdviced', "yes", 1);
                        //添加建议到列表后对滚动条进行相应调整
                        scrollShow(400);
                        scrollBtn.scrollLine("resetDrag");
                        //提醒用户提交成功
                        adviceInput.attr("placeholder", "提示：您的留言已经提交成功啦！");
                    },
                    error: function () {
                        alert("提交失败，拜托再提交一遍啦~");
                    }
                });
            }
        } else {
            userName.val("");
            alert("请输入长度小于20的名称！")
        }
    } else {
        adviceInput.val("");
        alert("请输入超过10个字数的有效内容~");
    }
}

function scrollShow(limitHeight) {
    if (listBox.height() < limitHeight) {
        $(".scrollLine").css("display", "none");
    } else {
        $(".scrollLine").css("display", "block");
        listBox.get(0).adListBoxHeight = listBox.height();
    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

;(function($,window,document,undefined) {
    return $.fn.animatext = function(options) {
      var animaText, settings;
      settings = $.extend({
        mode: "chars",
        initDelay: 1000,
        speed: 200,
        timeToRelaunch: 2000,
        infinite: false,
        onBegin: function() {},
        onSuccess: function() {}
      }, options);
      animaText = function(element) {
        var animatedElements, animatedElementsBuffer, animatedWords, animationInProgress, checkInView, cutText, doAnimation, j, paragraphs, randomIndex, randomIterations, ref, relaunchAnimation, scale;
        settings.onBegin();
        animatedElements = [];
        animationInProgress = false;
          paragraphs = "";
          cutText = element.html().split("<br>");
          $(cutText).each(function(i, item) {
            var cutParagraphs, words;
            words = "";
            cutParagraphs = item.split(" ");
            $(cutParagraphs).each(function(i, item) {
              var chars, cutWord;
                chars = "";
                cutWord = item.split("");
                $(cutWord).each(function(i, item) {
                  return chars += '<span class="char' + (i + 1) + '" aria-hidden="true" style="visibility:hidden; display:inline-block">' + item + '</span>';
                });
                return words += '<span class="word' + (i + 1) + '" aria-hidden="true" aria-label="' + item + '" style="display:inline-block">' + chars + '</span> ';
            });
            return paragraphs += '<span class="paragraph' + (i + 1) + '" aria-hidden="true" aria-label="' + item + '" style="display:inline-block">' + words + '</span><br>';
          });
          element.attr('aria-label', element.text());
          element.html(paragraphs);
          animatedWords = element.find("span[class^='word']");

            $(animatedWords).each(function(i, item) {
              var thisChars;
              thisChars = $(item).find("span[class^='char']");
              return $(thisChars).each(function(i, item) {
                return animatedElements.push(item);
              });
            });
        relaunchAnimation = function(element) {
            element.find("span").css('visibility', 'hidden');
            element.find("span").removeClass('animated');
            element.find("span").removeClass(settings.effect);
            return doAnimation();
        };
        doAnimation = function() {
          var animation, indexInterval;
          animationInProgress = true;
          indexInterval = 0;
          return animation = setInterval(function() {
            if (indexInterval >= animatedElements.length) {
              clearInterval(animation);
              settings.onSuccess();
              if (settings.infinite) {
                setTimeout(function() {
                  animationInProgress = false;
                  return relaunchAnimation(element);
                }, settings.timeToRelaunch);
              }
            }
            $(animatedElements[indexInterval]).css('visibility', 'visible');
            if (settings.effect) {
              $(animatedElements[indexInterval]).addClass('animated ' + settings.effect);
            }
            return indexInterval += 1;
          }, settings.speed);
        };
        return $(document).ready(function() {
          return setTimeout(function() {
                  doAnimation();
          }, settings.initDelay);
        });
      };
      if (this.length > 0) {
          return $(this).each(function(i, item) {
            return animaText($(item));
          });
      }
    };
  })(window.jQuery,window,document);


/***/ }),
/* 26 */
/***/ (function(module, exports) {

;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;
        this.$pic = this.$elem.find(".contact_pic");
        this.$con = this.$elem.find(".contact_con");
        this.$close = this.$elem.find(".contact_close");
        this.isMove = false;

        this.defaults = {
            isSorp:false,
            sorpRange:null
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            this.$con.css("display","none");
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                self.dragPhone(self.$elem);
                self.$pic.on("touchend.pop",function () {
                    self.popup();

                });
                self.$close.on('touchend.pop',function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    self.closePop();
                });
            } else {
                self.dragPC(self.$elem);
                self.$pic.on("click.pop",function () {
                    self.popup();

                });
                self.$close.on("click.pop",function () {
                    self.closePop();
                });
            }
        },
        closePop:function () {
            var self = this;
            self.$pic.css("display","block").animate({
                "width":100+'%',
                "height":100+'%'
            });
            self.$con.animate({
                width:0,
                height:0
            },function () {
                self.$con.css("display","none")
            });

            return false;
        },
        popup:function () {
            var self = this;
            if(!self.isMove){
                self.$pic.animate({
                    width:0,
                    height:0
                },function () {
                    self.$pic.css("display","none")
                });
                self.$con.css("display","block").animate({
                    width:220,
                    height:240
                });
            }else{
                self.isMove = false;
            }

            return false;
        },
        dragPhone:function (ele) {
            var disX,disY,moveX,moveY,L,T;
            var self = this;

            ele.get(0).addEventListener('touchstart',function(ev){
                ev.preventDefault();//阻止触摸时页面的滚动，缩放

                disX = ev.touches[0].clientX - ele.get(0).offsetLeft;
                disY = ev.touches[0].clientY - ele.get(0).offsetTop;

            });
            ele.get(0).addEventListener('touchmove',function(ev){
                L = ev.touches[0].clientX - disX ;
                T = ev.touches[0].clientY - disY ;

                if(self.opts.isSorp){
                    if(L<self.opts.sorpRange){
                        L = 0;
                    }else if(L>($(window).width()-ele.width()-self.opts.sorpRange)){
                        L = $(window).width()-ele.width();
                    }
                    if(T<self.opts.sorpRange+$(window).scrollTop()){
                        T = $(window).scrollTop();
                    }else if(disY>($(window).height()-ele.height()+$(window).scrollTop()-self.opts.sorpRange)){
                        T = $(window).height()-ele.height()+$(window).scrollTop();
                    }
                }
                moveX = L + 'px';
                moveY = T + 'px';
                //console.log(moveX);
                this.style.left = moveX;
                this.style.top = moveY;
                self.isMove = true;
            });
        },
        dragPC:function (ele) {
            var self = this;
            ele.on("mousedown",function (ev) {
                var offsetLeft = ev.pageX - ele.offset().left;
                var offsetTop = ev.pageY - ele.offset().top;
                $(document).on("mousemove.drag",function (ev) {
                    var disX = ev.pageX - offsetLeft;
                    var disY = ev.pageY - offsetTop;

                    self.isMove = true;

                    if(self.opts.isSorp){
                        if(disX<self.opts.sorpRange){
                            disX = 0;
                        }else if(disX>($(window).width()-ele.width()-self.opts.sorpRange)){
                            disX = $(window).width()-ele.width();
                        }
                        if(disY<self.opts.sorpRange+$(window).scrollTop()){
                            disY = $(window).scrollTop();
                        }else if(disY>($(window).height()-ele.height()+$(window).scrollTop()-self.opts.sorpRange)){
                            disY = $(window).height()-ele.height()+$(window).scrollTop();
                        }
                    }
                    ele.css({
                        "left":disX,
                        "top":disY
                    });
                });
                $(document).on("mouseup.drag",function () {
                    $(document).off(".drag");
                });
                return false;
            });
        }
    };
    $.fn.contactPop = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document,undefined);

/***/ }),
/* 27 */
/***/ (function(module, exports) {

;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;


        this.defaults = {
            isSorp:false,
            sorpRange:null
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                self.dragPhone();
            } else {
                self.dragPC();
            }

        },
        dragPhone:function () {
            var disX,disY,moveX,moveY,L,T,starX,starY,starXEnd,starYEnd;

            this.$elem.addEventListener('touchstart',function(ev){
                ev.preventDefault();//阻止触摸时页面的滚动，缩放

                disX = ev.touches[0].clientX - this.offsetLeft;
                disY = ev.touches[0].clientY - this.offsetTop;
                //手指按下时的坐标
                starX = ev.touches[0].clientX;
                starY = ev.touches[0].clientY;
                //console.log(disX);
            });
            this.$elem.addEventListener('touchmove',function(ev){
                L = ev.touches[0].clientX - disX ;
                T = ev.touches[0].clientY - disY ;
                //移动时 当前位置与起始位置之间的差值
                starXEnd = ev.touches[0].clientX - starX;
                starYEnd = ev.touches[0].clientY - starY;
                //console.log(L);
                if(L<0){//限制拖拽的X范围，不能拖出屏幕
                    L = 0;
                }else if(L > document.documentElement.clientWidth - this.offsetWidth){
                    L=document.documentElement.clientWidth - this.offsetWidth;
                }

                if(T<0){//限制拖拽的Y范围，不能拖出屏幕
                    T=0;
                }else if(T>document.documentElement.clientHeight - this.offsetHeight){
                    T = document.documentElement.clientHeight - this.offsetHeight;
                }
                moveX = L + 'px';
                moveY = T + 'px';
                //console.log(moveX);
                this.style.left = moveX;
                this.style.top = moveY;
            });
            window.addEventListener('touchend',function(e){
                //alert(parseInt(moveX))
                //判断滑动方向

            });
        },
        dragPC:function () {
            var self = this;
            this.$elem.on("mousedown",function (ev) {
                var offsetLeft = ev.pageX - self.$elem.offset().left;
                var offsetTop = ev.pageY - self.$elem.offset().top;
                $(document).on("mousemove.drag",function (ev) {
                    var disX = ev.pageX - offsetLeft;
                    var disY = ev.pageY - offsetTop;
                    if(self.opts.isSorp){
                        if(disX<self.opts.sorpRange){
                            disX = 0;
                        }else if(disX>($(window).width()-self.$elem.width()-self.opts.sorpRange)){
                            disX = $(window).width()-self.$elem.width();
                        }
                        if(disY<self.opts.sorpRange+$(window).scrollTop()){
                            disY = $(window).scrollTop();
                        }else if(disY>($(window).height()-self.$elem.height()+$(window).scrollTop()-self.opts.sorpRange)){
                            disY = $(window).height()-self.$elem.height()+$(window).scrollTop();
                        }
                    }
                    self.$elem.css({
                        "left":disX,
                        "top":disY
                    });
                });
                $(document).on("mouseup.drag",function () {
                    $(document).off(".drag");
                });
                return false;
            });
        }
    };
    $.fn.drag = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document);

/***/ }),
/* 28 */
/***/ (function(module, exports) {

;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;
        this.$target = $(this.$elem.attr("data-target"));
        this.$targetParent = this.$target.closest(".adviceList");

        this.iScale = 0;
        this.listBoxHeight = this.$target.height();
        this.boxLimitHeight = this.$targetParent.height();
        this.$target.get(0).adListBoxHeight = this.listBoxHeight;

        this.defaults = {
            scrollBtnHeight:null,
            scrollLineHeight:null
        };
        this.opts = $.extend({},this.defaults,options);
    };

    Plugin.prototype = {
        initial:function () {
            var self = this;
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                self.dragPhone();
            }else{
                self.dragPC();
            }
        },
        dragPhone:function () {
            var maxTop,disY,moveY,T;
            var self = this;

            this.$elem.get(0).addEventListener('touchstart',function(ev){
                ev.preventDefault();//阻止触摸时页面的滚动，缩放
                disY = ev.touches[0].clientY - self.$elem.get(0).offsetTop;
                maxTop = self.opts.scrollLineHeight - self.opts.scrollBtnHeight;

            });
            this.$elem.get(0).addEventListener('touchmove',function(ev){
                T = ev.touches[0].clientY - disY ;
                if(T<0){
                    T = 0;
                }else if(T > maxTop){
                    T = maxTop;
                }
                moveY = T + 'px';
                this.style.top = moveY;
                self.iScale = T/maxTop;
                self.adListMove();
            });
        },
        dragPC:function () {
            var self = this;
            this.$elem.on('mousedown',function (ev) {
                var offsetY = ev.pageY - self.$elem.position().top;
                var maxTop = self.opts.scrollLineHeight - self.opts.scrollBtnHeight;
                $(document).on('mousemove.adScroll',function (ev) {
                    var disY = ev.pageY - offsetY;
                    if(disY<0){
                        disY = 0;
                    }else if(disY > maxTop){
                        disY = maxTop;
                    }
                    self.$elem.css("top",disY);
                    self.iScale = disY/maxTop;
                    self.adListMove();
                });
                $(document).on('mouseup.adScroll',function () {
                    $(document).off(".adScroll");
                });
                return false;
            });
        },
        resetDrag:function () {
            this.$elem.css("top",0);
            this.iScale = 0;
            this.adListMove();
        },
        adListMove:function () {
            this.$target.css("top",(this.boxLimitHeight-this.$target.get(0).adListBoxHeight)*this.iScale);
        }
    };
    $.fn.scrollLine = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            if(plugin[options]){
                return plugin[options].call(plugin);
            }else if(typeof options === "object"||!options){
                plugin.initial();
            }
        });
    }
})(window.jQuery,window,document);

/***/ }),
/* 29 */
/***/ (function(module, exports) {

;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;

        this.defaults = {
            limitLength:140
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            this.$elem.keyup(function(){
                var len = $(this).val().length;
                if(len > self.opts.limitLength -1){
                    $(this).val($(this).val().substring(0,self.opts.limitLength));
                    len = $(this).val().length;
                }
                var num = self.opts.limitLength - len;
                $("#word").text(num);
            });
        }
    };
    $.fn.limitWord = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document);

/***/ }),
/* 30 */
/***/ (function(module, exports) {

;(function ($,window,document,undefined) {
    var Plugin = function (elem,options) {
        this.$elem = elem;
        this.$target = $(this.$elem.attr("data-target"));
        this.defaults = {
            toggleNum:4,
            btnName:null,
            btnToggleName:null
        };
        this.opts = $.extend({},this.defaults,options);
    };
    Plugin.prototype = {
        initial:function () {
            var self = this;
            if(this.$target.children("li").length <= self.opts.toggleNum){
                self.$elem.hide();
            }else{
                self.$elem.show();
                self.toggleInit();
                self.$elem.click(function () {
                    self.toggleSlideTo();
                    if(self.$elem.html() === self.opts.btnName){
                        self.$elem.html(self.opts.btnToggleName);
                    }else{
                        self.$elem.html(self.opts.btnName);
                    }
                });
            }
        },
        toggleSlideTo:function () {
            var self = this;
            this.$target.children("li").each(function () {
                if($(this).index()>self.opts.toggleNum-1){
                    $(this).slideToggle();
                }
            });
        },
        toggleInit:function () {
            var self = this;
            this.$target.children("li").each(function () {
                if($(this).index()>self.opts.toggleNum-1){
                    $(this).hide();
                }
            });
        }
    };
    $.fn.toggleShowMore = function (options) {
        var plugin = new Plugin(this,options);
        return this.each(function () {
            plugin.initial();
        });
    }
})(window.jQuery,window,document,undefined);

/***/ }),
/* 31 */
/***/ (function(module, exports) {

function remove_from_list(i){active_list[i]=""}count=0,running=0;var active_list=[100];$(document).ready(function(){$(".bringins-content").hide()}),function(i){i.fn.bringins=function(n){var t={position:"right",width:"50%",margin:50,color:"rgba(0,0,0,.7)",closeButton:"rgb(102,102,102)",zIndex:""};if(n=i.extend(t,n),0==running){for(running=1,current_obj=this,current=i(this).attr("id"),z=0;z<=count;z++)active_list[z]==current&&(i(this).hide(),i(this).detach().appendTo("body"),remove_from_list(z),i("#bringins-block-"+z).remove(),i("#bringinsclose"+z).remove());count++,active_list[count]=current,n.width.indexOf("%")>=0?(temp=n.width.replace("%","")/100,bringins_width=temp*innerWidth,bringins_margin=innerWidth-bringins_width):(bringins_width=n.width,bringins_margin=innerWidth-bringins_width),"left"==n.position&&i(this).css({left:"-50px",position:"absolute"}),"right"==n.position&&(temp_var=bringins_margin+.05*innerWidth,i(this).css({left:temp_var,position:"absolute"})),"center"==n.position&&(mm_center_temp=(innerWidth-bringins_width)/2,mm_center_temp2=innerWidth-mm_center_temp-50,mm_center_temp3=(innerWidth-bringins_width)/2+.05*innerWidth,i(this).css({left:mm_center_temp,top:"50px",position:"absolute"})),i("body").append("<div id='bringins-block-"+count+"'><svg id='bringins-svg-"+count+"' class='bringins-svg'><path id='bringins-svgpath-"+count+"' class='bringins-svgpath' d='M0 0 L0 1 L3 1 L3 0 Z' /></svg><svg id='bringins-block-close-svg-"+count+"' width=25 height=25 ><path id='bringins-block-close-"+count+"' d='M0 0 L25 25 Z M25 0 L0 25 Z' /></svg></div>"),i("body").append("<div id='bringinsclose"+count+"'><script>$('#bringins-block-close-svg-"+count+"').click(function(){$('#bringins-block-"+count+"').fadeOut(500, function(){$("+current+").hide();$("+current+").detach().appendTo('body');remove_from_list("+count+");$('#bringins-block-"+count+"').remove();$('#bringinsclose"+count+"').remove();});});</script><style>#"+current+"::-webkit-scrollbar{display:none;}</style></div>"),i("#bringins-block-"+count).css({position:"fixed",top:"0%"}),""!=n.zIndex&&i("#bringins-block-"+count).css({"z-index":n.zIndex}),i("#bringins-block-close-"+count).css({fill:"white",stroke:n.closeButton,"stroke-width":5}),i(this).detach().appendTo("#bringins-block-"+count),this_width=bringins_width-2*n.margin,this_height=innerHeight-2*n.margin-50,n.margin>25?this_top=n.margin:this_top=25,i(this).css({margin:n.margin,width:this_width,height:this_height,"margin-top":this_top,transition:"1s","-o-transition":"1s","-moz-transition":"1s","-webkit-transition":"1s","overflow-y":"scroll"}),i("#bringins-svg-"+count).css({position:"absolute",width:bringins_width,height:innerHeight,transition:"1s","-o-transition":"1s","-moz-transition":"1s","-webkit-transition":"1s"}),"center"==n.position&&i("#bringins-svgpath-"+count).css({width:bringins_width,height:innerHeight,transition:"1s","-o-transition":"1s","-moz-transition":"1s","-webkit-transition":"1s"}),"left"==n.position&&i("#bringins-svg-"+count).css({transform:"rotate(180deg)"}),mm_temp=innerWidth-50,"right"==n.position&&(i("#bringins-svg-"+count).css({top:"50%",left:bringins_margin}),i("#bringins-block-close-svg-"+count).css({position:"absolute",left:mm_temp,top:"25px"})),"left"==n.position&&(i("#bringins-svg-"+count).css({top:"-50%",left:0}),i("#bringins-block-close-svg-"+count).css({position:"absolute",left:25,top:"25px"})),"center"==n.position&&(i("#bringins-svg-"+count).css({top:"50%",left:"50%"}),i("#bringins-block-close-svg-"+count).css({position:"absolute",left:mm_center_temp2,top:"25px"})),i("#bringins-svgpath-"+count).css({transition:"1s","-o-transition":"1s","-moz-transition":"1s","-webkit-transition":"1s",fill:n.color}),temp_temp=bringins_width/3,setTimeout(function(){"center"==n.position?(i("#bringins-svgpath-"+count).css({transform:"scale("+temp_temp+",3)"}),i("#bringins-svg-"+count).css({left:mm_center_temp})):(i("#bringins-svgpath-"+count).css({transform:"scale(1,"+innerHeight+")"}),i("#bringins-svg-"+count).css({top:"0%"}))},1),setTimeout(function(){i("#bringins-svgpath-"+count).css({transform:"scale("+bringins_width+","+innerHeight+")"}),i(current_obj).fadeIn(1),"right"==n.position&&i(current_obj).css({left:bringins_margin}),"left"==n.position&&i(current_obj).css({left:0}),"center"==n.position&&(i("#bringins-svg-"+count).css({top:"0%"}),i(current_obj).css({top:"25px"}))},1e3),setTimeout(function(){running=0},2e3)}}}(jQuery);

/***/ }),
/* 32 */
/***/ (function(module, exports) {

var introPopClose = $(".introPopClose");
var introPopup = $("#introPopup");
var introListCont = $(".introListCont");
var intrestImg = $(".intrestImg").find("img");
var skillImg = $(".skillImg").find("img");
var introShareUl = introPopup.find(".introShareUl");

intrestImg.add(skillImg).click(function () {
    var address = 'advicePhp/'+$(this).attr("data-target")+'.php';
    getIntroJson(address);
    introPopup.slideToggle();
});

introPopClose.add(introPopup).click(function () {
    introPopup.slideToggle();
    return false;
});
introListCont.on('click',function (ev) {
  ev.stopPropagation();
});

function getIntroJson(address) {
    $.getJSON(address,function (json) {
        introShareUl.html("");
        $.each(json, function(index, value) {
            var oLi = $("<li>");
            var oDiv = $("<div class='introBox'></div>");
            oDiv.html('<a href="'+json[index].sourceLink+'" target="_blank">'+decodeURI(json[index].sourceName)+'</a><p><span>密码：</span><i>'+json[index].sourcePassword+'</i><span class="hidden-xs">更新时间：</span><i class="hidden-xs">'+json[index].addtime+'</i></p>');
            oDiv.appendTo(oLi);
            oLi.appendTo(introShareUl);
        });
    });
}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

var zhihuUl = $(".zhihuTopics");
var blogUl = $(".blogs");
$.getJSON('advicePhp/otherblog.php',function (json) {
    $.each(json, function(index, value) {
        var oLi = $("<li>");
        oLi.html('<img src="'+json[index].imagesrc+'" alt="blog"><a href="'+json[index].url+'" target="_blank" rel="nofollow">'+decodeURI(json[index].blogname)+'</a>');
        oLi.appendTo(blogUl);
    });
});
$.getJSON('advicePhp/zhihutopic.php',function (json) {
    $.each(json, function(index, value) {
        var oLi = $("<li>");
        oLi.html('<img src="'+json[index].imagesrc+'" alt="zhihu"><a href="'+json[index].url+'" target="_blank" rel="nofollow">'+decodeURI(json[index].topicname)+'</a>');
        oLi.appendTo(zhihuUl);
    });
});


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<!DOCTYPE html>\r<html lang=\"en\">\r<head>\r    <meta charset=\"UTF-8\">\r    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r    <meta name=\"baidu-site-verification\" content=\"hLQKDe6U4y\" />\r    <meta name=\"Keywords\" content=\"个人博客,文朝希,tonnywin,前端博客,朝希空间\" />\r    <meta name=\"Description\" content=\"Tonnywin的个人网站，记录点滴，分享一切~\" />\r    <title>文朝希 · Tonnywin</title>\r    <link rel=\"shortcut icon\" href=\"/favicon.ico\" />\r    <link rel=\"stylesheet\" href=\"https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css\"\r          integrity=\"sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u\" crossorigin=\"anonymous\">\r    <link href='http://cdn.webfont.youziku.com/webfonts/nomal/105201/46647/596c656bf629da05c0298698.css' rel='stylesheet' type='text/css' />\r    <link href='http://cdn.webfont.youziku.com/webfonts/nomal/105201/46647/596cc1ddf629da05c02986f5.css' rel='stylesheet' type='text/css' />\r</head>\r<body>\r<div class=\"header\">\r    <div class=\"container\">\r        <div class=\"row\">\r            <div class=\"navbar\">\r                <div class=\"navbar-header\">\r                    <button class=\"navbar-toggle\" type=\"button\" data-toggle=\"collapse\" data-target=\"#hd_nav\">\r                        <span class=\"icon-bar\"></span>\r                        <span class=\"icon-bar\"></span>\r                        <span class=\"icon-bar\"></span>\r                    </button>\r                    <div class=\"navbar-brand\">\r                        <a href=\"javascript:;\" data-hash=\"index\" title=\"首页\"><img src="+JSON.stringify(__webpack_require__(35))+"\r                                                                                 alt=\"朝希空间\" title=\"朝希空间\"></a>\r                    </div>\r                </div>\r                <div class=\"collapse navbar-collapse\" id=\"hd_nav\">\r                    <ul>\r                        <li><a href=\"javascript:;\" data-hash=\"myIntro\">关于我</a></li>\r                        <li><a href=\"javascript:;\" data-hash=\"morePro\">github仓库</a></li>\r                        <li><a href=\"javascript:;\" data-hash=\"myView\">视野</a></li>\r                        <li><a href=\"http://blog.toonywin.club/\">个人博客</a></li>\r                    </ul>\r                </div>\r            </div>\r        </div>\r    </div>\r</div>\r<div class=\"contentBox\">\r    <div data-hash=\"index\" class=\"contentDiv\">\r        <div class=\"container\">\r            <div class=\"row\">\r                <div class=\"mymotto\">\r                    <h1 class=\"mottoTitle\" style=\"font-family:'stfajcgangbixsbf495727019af1';\">寄语</h1>\r                    <p class=\"mottoContent\" style=\"font-family:'stfajcgangbixsbf5fe903d19af1';\">每个人都有属于自己的一片森林，迷失的人迷失了，相逢的人会再相逢。--《挪威的森林》</p>\r                </div>\r            </div>\r        </div>\r        <!--[if !IE]><!-->\r        <div class=\"container viewPart\">\r            <div class=\"row\">\r                <div class=\"dayView\">\r                    <div class=\"advice_hd\"><img src="+JSON.stringify(__webpack_require__(36))+" alt=\"每日一览\"></div>\r                    <ul class=\"viewTabs clearfix\">\r                        <li class=\"techTab active\" data-target=\".techContent\">技术栏</li>\r                        <li class=\"videoTab\" data-target=\".videoContent\">休闲栏</li>\r                    </ul>\r                    <div class=\"viewContents\">\r                        <div class=\"techContent\">\r                            <ul id=\"myTechNews\"></ul>\r                            <div class=\"techMore\" data-target=\"#myTechNews\">想看更多</div>\r                        </div>\r                        <div class=\"videoContent\">\r                            <ul id=\"videoItems\" class=\"clearfix\"></ul>\r                            <div class=\"bringins-content\" id=\"videoIframe\">\r                                <iframe src=\"\" height=\"100%\" width=\"100%\"></iframe>\r                            </div>\r                        </div>\r                    </div>\r                </div>\r            </div>\r        </div>\r        <!--<![endif]-->\r    </div>\r    <div data-hash=\"myIntro\" class=\"contentDiv\">\r        <div class=\"myIntroduce\">\r            <div class=\"container\">\r                <div class=\"row\">\r                    <div class=\"col-md-8 col-sm-7 col-xs-12\">\r                        <div class=\"introContent\">\r                            <div class=\"row\">\r                                <div class=\"col-xs-12\">\r                                    <div class=\"introduce\">\r                                        <h1>主人简介</h1>\r                                        <p>\r                                            94年生，毕业于陕西科技大学。理工男，为人放荡不羁，崇尚自由，追求美与艺术，有一定的完美主义倾向。22岁前懵懂无知，遂一事无成。22岁后有所求，立志苦拼，虽仍落魄，却不因此而轻言放弃，而轻生自卑，而不思进取。\r                                            宁欺白须公,莫欺少年穷，终须有日龙穿凤，唔信一世裤穿窿。在此共勉~</p>\r                                    </div>\r                                </div>\r                                <div class=\"col-xs-12\">\r                                    <div class=\"intrests\">\r                                        <h1>兴趣爱好</h1>\r                                        <div class=\"intrestSharing\">\r                                            <div class=\"row\">\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"intrestImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(37))+" alt=\"动漫\" data-target=\"comic\">\r                                                    </div>\r                                                    <p>动漫</p>\r                                                </div>\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"intrestImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(38))+" alt=\"电影\" data-target=\"movie\">\r                                                    </div>\r                                                    <p>电影</p>\r                                                </div>\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"intrestImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(39))+" alt=\"阅读\" data-target=\"readpdf\">\r                                                    </div>\r                                                    <p>阅读</p>\r                                                </div>\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"intrestImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(40))+" alt=\"编程\"\r                                                             data-target=\"frontendpdf\">\r                                                    </div>\r                                                    <p>编程</p>\r                                                </div>\r                                            </div>\r                                        </div>\r                                    </div>\r                                </div>\r                                <div class=\"col-xs-12\">\r                                    <div class=\"skills\">\r                                        <h1>GET技能</h1>\r                                        <div class=\"skillsSharing\">\r                                            <div class=\"row\">\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"skillImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(41))+" alt=\"PS\" data-target=\"ps\">\r                                                    </div>\r                                                    <p>PS</p>\r                                                </div>\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"skillImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(42))+" alt=\"PPT\" data-target=\"ppt\">\r                                                    </div>\r                                                    <p>PPT</p>\r                                                </div>\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"skillImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(43))+" alt=\"理财\"\r                                                             data-target=\"finacing\">\r                                                    </div>\r                                                    <p>理财</p>\r                                                </div>\r                                                <div class=\"col-md-3 col-sm-6 col-xs-6\">\r                                                    <div class=\"skillImg\">\r                                                        <img src="+JSON.stringify(__webpack_require__(44))+" alt=\"生活\" data-target=\"life\">\r                                                    </div>\r                                                    <p>生活</p>\r                                                </div>\r                                            </div>\r                                        </div>\r                                    </div>\r                                </div>\r                            </div>\r                        </div>\r                        <div class=\"introRemind\">\r                            <p>PS:点击兴趣爱好以及GET技能里的图片有不定期更新的福利哦~~~</p>\r                        </div>\r                    </div>\r                    <div class=\"col-md-4 col-sm-5 col-xs-12\">\r                        <div class=\"mediaPlugin\">\r                            <iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=100% height=450\r                                    src=\"http://music.163.com/outchain/player?type=0&id=783581784&auto=0&height=530\"></iframe>\r                            <p class=\"line\"></p>\r                            <iframe style=\"padding:9px;\" width=\"100%\" height=\"550\" class=\"share_self\" frameborder=\"0\"\r                                    scrolling=\"no\"\r                                    src=\"http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=550&fansRow=2&ptype=1&speed=0&skin=7&isTitle=1&noborder=0&isWeibo=1&isFans=0&uid=3015100957&verifier=655ac839&colors=cd8f5a,fff,666666,666666,cd8f5a&dpc=1\"></iframe>\r                        </div>\r                    </div>\r                </div>\r            </div>\r        </div>\r        <div id=\"introPopup\">\r            <div class=\"introPupList\">\r                <svg class=\"introPopClose\" width=\"25\" height=\"25\" style=\"position: absolute; right: 10%; top: 25px;\">\r                    <path d=\"M0 0 L25 25 Z M25 0 L0 25 Z\" style=\"fill: white; stroke: white; stroke-width: 5px;\"></path>\r                </svg>\r                <div class=\"introListCont\">\r                    <ul class=\"introShareUl\"></ul>\r                </div>\r            </div>\r        </div>\r    </div>\r    <div data-hash=\"morePro\" class=\"contentDiv\">\r        <div class=\"githubProfile\">\r            <div class=\"container\">\r                <div class=\"row\">\r                    <ul class=\"proList row\"></ul>\r                </div>\r            </div>\r        </div>\r    </div>\r    <div data-hash=\"myView\" class=\"contentDiv\">\r        <div class=\"personalView\">\r            <div class=\"container\">\r                <div class=\"row\">\r                    <div class=\"read col-md-6 col-sm-12 col-xs-12\">\r                        <h1>阅读</h1>\r                        <ul>\r                            <li><img src="+JSON.stringify(__webpack_require__(45))+" alt=\"\"><a target=\"_blank\"\r                                                                          href=\"http://www.wufazhuce.com/\" rel=\"nofollow\">one一个</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(46))+" alt=\"\"><a target=\"_blank\"\r                                                                           href=\"http://www.bilibili.com/video/av2395437\" rel=\"nofollow\">纪录片-书店里的影像诗</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(47))+" alt=\"\"><a href=\"http://www.book618.com/\" rel=\"nofollow\">悦书坊</a></li>\r                        </ul>\r                    </div>\r                    <div class=\"design col-md-6 col-sm-12 col-xs-12\">\r                        <h1>设计</h1>\r                        <ul>\r                            <li><img src="+JSON.stringify(__webpack_require__(48))+" alt=\"\"><a target=\"_blank\"\r                                                                            href=\"http://hao.uisdc.com/\" rel=\"nofollow\">设计师都会私藏的网址</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(49))+" alt=\"\"><a target=\"_blank\"\r                                                                               href=\"https://www.awwwards.com/\" rel=\"nofollow\">展示最前沿的Web设计</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(50))+" alt=\"\"><a target=\"_blank\"\r                                                                               href=\"https://dribbble.com/\" rel=\"nofollow\">设计师与灵感的聚集地</a>\r                            </li>\r                        </ul>\r                    </div>\r                    <div class=\"copywriting col-md-6 col-sm-12 col-xs-12\">\r                        <h1>文案策划</h1>\r                        <ul>\r                            <li><img src="+JSON.stringify(__webpack_require__(51))+" alt=\"\"><a target=\"_blank\"\r                                                                            href=\"http://www.adquan.com/\">广告门</a></li>\r                            <li><img src="+JSON.stringify(__webpack_require__(52))+" alt=\"\"><a target=\"_blank\" href=\"http://www.topys.cn/\" rel=\"nofollow\">全球顶尖创意分享平台</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(53))+" alt=\"\"><a target=\"_blank\"\r                                                                               href=\"http://www.pitchina.com.cn/\" rel=\"nofollow\">大创意\r                                有创意</a></li>\r                        </ul>\r                    </div>\r                    <div class=\"business col-md-6 col-sm-12 col-xs-12\">\r                        <h1>商业</h1>\r                        <ul>\r                            <li><img src="+JSON.stringify(__webpack_require__(54))+" alt=\"\"><a target=\"_blank\" href=\"http://21cbr.com/\" rel=\"nofollow\">21世纪商业评论</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(55))+" alt=\"\"><a target=\"_blank\"\r                                                                               href=\"http://mckinseychina.com/\" rel=\"nofollow\">麦肯锡中国</a>\r                            </li>\r                            <li><img src="+JSON.stringify(__webpack_require__(56))+" alt=\"\"><a target=\"_blank\"\r                                                                             href=\"http://wiki.mbalib.com/wiki/\" rel=\"nofollow\">智库百科</a>\r                            </li>\r                        </ul>\r                    </div>\r                    <div class=\"otherblog col-md-6 col-sm-12 col-xs-12\">\r                        <h1>博客</h1>\r                        <ul class=\"blogs\"></ul>\r                    </div>\r                    <div class=\"zhihu col-md-6 col-sm-12 col-xs-12\">\r                        <h1>知乎</h1>\r                        <ul class=\"zhihuTopics\"></ul>\r                    </div>\r                </div>\r            </div>\r        </div>\r    </div>\r</div>\r<div class=\"msgBoard\">\r    <div class=\"container\">\r        <div class=\"row\">\r            <div class=\"advice_hd\"><img src="+JSON.stringify(__webpack_require__(57))+" alt=\"留言板\"></div>\r            <p class=\"advice_ths\">在这里可以留下你宝贵的感言，疑惑或建议，也可以直接和我交流联系~</p>\r            <div class=\"addAdvice\">\r                <h3>添加留言</h3>\r                <div class=\"advicetext\">\r                    <div class=\"inputBox\">\r                        <textarea name=\"advices\" autofocus id=\"adviceInput\" cols=\"30\" rows=\"10\"\r                                  placeholder=\"提示：输入完+回车即可添加您的宝贵建议\"></textarea>\r                    </div>\r                    <h6>最多输入<span>140</span>个字，还可输入<span id=\"word\">140</span>个</h6>\r                </div>\r                <div class=\"row\">\r                    <div class=\"col-md-10 col-sm-8 col-xs-6\">\r                        <input type=\"text\" class=\"userName\" placeholder=\"您的名称（可不写）\"/>\r                    </div>\r                    <div class=\"col-md-2 col-sm-4 col-xs-6\">\r                        <div class=\"addAdviceBtn\">添加</div>\r                    </div>\r                </div>\r            </div>\r            <div class=\"adviceBox\">\r                <h3>留言列表</h3>\r                <div class=\"scrollLine\">\r                    <div class=\"scrollBtn\" data-target=\"#listBox\"></div>\r                </div>\r                <div class=\"adviceList\">\r                    <div id=\"listBox\"></div>\r                </div>\r            </div>\r        </div>\r    </div>\r</div>\r<div id=\"contact\">\r    <div class=\"contact_pic\">\r        <img src="+JSON.stringify(__webpack_require__(58))+" alt=\"contact me?\" class=\"spring\">\r        <img src="+JSON.stringify(__webpack_require__(59))+" alt=\"contact me?\" class=\"summer\">\r        <img src="+JSON.stringify(__webpack_require__(60))+" alt=\"contact me?\" class=\"autumn\">\r        <img src="+JSON.stringify(__webpack_require__(61))+" alt=\"contact me?\" class=\"winter\">\r    </div>\r    <div class=\"contact_con\">\r        <div class=\"con_box\">\r            <div class=\"contact_close\">\r                <svg width=\"25\" height=\"25\">\r                    <path d=\"M0 0 L16 16 Z M16 0 L0 16 Z\"\r                          style=\"fill: white; stroke: rgba(255, 255, 255,0.8); stroke-width: 5px;\"></path>\r                </svg>\r            </div>\r            <div class=\"content\">\r                <div class=\"phone\">\r                    <p>\r                        <img src="+JSON.stringify(__webpack_require__(62))+" alt=\"\"><span>13638430047</span></p>\r                    <button class=\"btn hidden-xs\" data-clipboard-text=\"13638430047\">点我复制 </button>\r                </div>\r                <div class=\"mail\">\r                    <p><img src="+JSON.stringify(__webpack_require__(63))+" alt=\"\"><span>13638430047@163.com</span></p>\r                    <button class=\"btn hidden-xs\" data-clipboard-text=\"13638430047@163.com\">点我复制</button>\r                </div>\r            </div>\r        </div>\r    </div>\r</div>\r<div class=\"footer\">\r    <div class=\"container\">\r        <div class=\"row\">\r            <p class=\"col-md-10 col-sm-8 col-xs-12\">\r                <span>© 2017 Design by Tonnywin(文朝希)</span>\r            </p>\r            <p class=\"col-md-2 col-sm-4 col-xs-12\">\r                <a target=\"_blank\" href=\"http://www.miitbeian.gov.cn/publish/query/indexFirst.action\">湘ICP备17012529号</a>\r            </p>\r        </div>\r    </div>\r</div>\r<script\r        src=\"https://code.jquery.com/jquery-3.2.1.js\"\r        integrity=\"sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=\"\r        crossorigin=\"anonymous\"></script>\r<script src=\"https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js\"\r        integrity=\"sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa\"\r        crossorigin=\"anonymous\"></script>\r<script src=\"https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js\"></script>\r\r<script src=\"js/main.bundle.js\"></script>\r<script type=\"text/javascript\">\r    function foo(json) {\r        var proList = $(\".proList\");\r        for(var i=0;i<json.data.length;i++){\r            var oLi = $(\"<li class='col-md-6 col-sm-12 col-xs-12'></li>\");\r            var oDiv = $(\"<div class='gitpro'></div>\");\r            var dotBg;\r            switch (json.data[i].language){\r                case \"HTML\":dotBg = \"htmlColor\";break;\r                case \"CSS\":dotBg = \"cssColor\";break;\r                case \"JavaScript\":dotBg = \"jsColor\";break;\r                default:break;\r            }\r            if(json.data[i].fork){\r                oDiv.html('<a href=\"'+json.data[i].html_url+'\" class=\"text-bold\">'+json.data[i].name+'</a><p class=\"text-fork\">非原创，引自他人作品</p><p class=\"text-explain\">'+json.data[i].description+'</p><p class=\"text-type\"><span class=\"text-dot '+dotBg+'\"></span>&nbsp;'+json.data[i].language+' </p>');\r            }else{\r                oDiv.html('<a href=\"'+json.data[i].html_url+'\" class=\"text-bold\">'+json.data[i].name+'</a><p class=\"text-explain\">'+json.data[i].description+'</p><p class=\"text-type\"><span class=\"text-dot '+dotBg+'\" ></span>&nbsp;'+json.data[i].language+' </p>');\r            }\r            oDiv.appendTo(oLi);\r            oLi.appendTo(proList);\r        }\r    }\r</script>\r<script src=\"https://api.github.com/users/Tonnywin/repos?callback=foo\"></script>\r</body>\r</html>\r\r<!--//github仓库api-->\r<!--https://developer.github.com/v3/repos/#list-user-repositories-->\r<!--我自己举例-->\r<!--https://api.github.com/users/Tonnywin/repos?callback=foo-->\r"

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/logo.png";

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAyBAMAAABMoj8pAAAAElBMVEVMaXH/wSv9wjP9wjX/wCj/wClo5hchAAAABHRSTlMA/vTuO6vThgAAAVVJREFUSMftllGOgyAQhmnFd0w8gA97gN3EA4x2+t403ftfZQUpjAxQJH3oJv6JJpKZz2EYBoQ4dOj/CIENSXTKeooHLrYD8Zu4kdcljZIIqFlARzJh5QJbWUj8kTtuWOolaxWELBWG2keyWchi05a7WE3npSpY7a/RPcgOiApWqgBE/RwhXDT4KBYsj6J+xayby/1deNalgiXOsWKS5iPHQozUIRmYnXVj5ktYLIcxVstGDKHXH3tZG7ObY8lXLFvdVgOZv92IQEamPCtREyb/HhINvrS+9Ov6Rha8kTU7s1OPU6efTr/Vbtby/8GZ1df9kwUBCytZkrFY3RexzrjuSNBbwFuPQa2W7W27chCuBtb2CX7W6uTHWGOG9WWC2rIifXXyk4Asanb+kGKV3AFs25K0g3G/poj1sI2Gsk786jCWtIl23nTqpOHP8yT/Pu6nhz5Df0ha4m55EDvAAAAAAElFTkSuQmCC"

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/comic.jpg";

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/movie.jpg";

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/readpdf.jpg";

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/frontendpdf.jpg";

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/ps.jpg";

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/ppt.jpg";

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/finacing.jpg";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/life.jpg";

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewOne.jpg";

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewRead.jpg";

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewYueshu.jpg";

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewUisdc.jpg";

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewAwwwards.jpg";

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewdribbble.jpg";

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewGuang.jpg";

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewTopys.jpg";

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewPitchina.jpg";

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/view21cbr.jpg";

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewMckinsey.jpg";

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "images/viewMbalib.jpg";

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIUAAAAyBAMAAACAOwXCAAAAMFBMVEVMaXH////////////////////////////////////////////////////////////6w4mEAAAAEHRSTlMAj0NWEyZ8aQo5hV8wHXJMRzjhfwAAAsRJREFUSMftls9rE0EUxzdpQn7UmHxjmrS7JjW9FRSNHjx4MIE91JNZjYqKkgUpPSZQiChCCt56STz0nODFi9Bc1GMKCh49KIIgNCKKN/UvcGZnJjv7q0IRT3mBye6b2c+b/c57L1GUmc3s31m8ETyXHgJQP9MRpbo0UdlwrDuqVsl4u0PtlYsxog9jxRqxIE1gybEuBBIgzZZlnYgU835gX4W/MAxvKGJhLOi6vqY8Hmq6XslT1yc4bCwxKmiQ1XrXzWgyyegGDYtRdjJatq/V1vwkFYwojguG4WScoD7Tuiy2lw9ihJETjLgu2xo7JIuxYWYDGdGLyjwGguFnEb2G13eUAxghjJPYnTLS5yRj+sXULdxVu6YkkYfRM9CbMvZkOc7wUzHIp859OX/GCFV/xk8fRsbNoFrirZVefcZIrEjWdTI2df0y9p2MKCNfIlm5sw4tSNMti9GwUjTG92ZbmyKOhcmxmCKJfTStCUa+S3h1F2PbEi7SGZPqU8dBmk4Z5H4PrlxXUuc7nYdWxBfrP5QgTWuglGtWvXkT3vHAbpCmBmdoyEdoVTjb01BmLAVpKhiLJn7jmWsyAY1Gs8bTQ94/ElNFz1aZpw96ujeRMaByieT8GNgN5xfLj/jE3tlzF2OO+N751y1jlBljTno7XoXlPGVcwSBuepPIj5HEF6HoiAetcEaTnEHRy4AnashOInE5KghGH9lDMtoaZVxFk55j9XAMc5kxWvNk1b6HkaMdD1k6TgIZyHJGH989LxNmzYBp2g5ikNykjBt4BLwfqlWf/iEY3n3wGk2hyBgPyCb67l6YQInmIwpkuMB/55J4KvJ0wgQ8gkXGoCUVcxeMs17YZFrylHikDGVcJ/dd8mJuQW55C531JWb3WKSXvSQ+5rfx7T652/nqLtwndp2fEg1y6lm1+8xJsvbN7H/YzP6v/QFpmcC4CgJxzgAAAABJRU5ErkJggg=="

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAZlBMVEVMaXH//1X+/lH//0/+/lD//z/+/k7+/k/+/lD+/k///1///0/+/k3+/lD+/lD+/k/+/k/+/k/+/k/+/lD+/lD+/lD+/k/+/k/+/lD+/k/+/lD+/k/+/lH//0z+/lD+/lD//07//1CHW8LfAAAAIXRSTlMADDgQiwRUcI/zCGAk+0z3g9PXaL/Ls7erw7tkWBTfm0TtNZOYAAAAgklEQVQYGWXBBwKCMBAEwIUELqHau+L+/5MeECXBGSgn+GNJwcqDSpB4eo4EsY4zQeTO2bbCIufkmiFieqpjhoSj2iPVtCRvWLFUDpMCQbWj2kAVB0GQeyoLFBdSEJQcncozlSAQRgRB6bkQBPmLPw5fmW05c4g0Q0/S10iZd90ZAB9icBD3S1K2DQAAAABJRU5ErkJggg=="

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAPBAMAAADjSHnWAAAAKlBMVEX07gD//1DEvwD38hP+/Ujy7QD59SLZ1ADk3gDJwwDNyQ3r5QDRywD080FoZpgqAAAAZUlEQVQI12NgE4QDMQYGhkQ4LwHIY3OEctwYQMAQyjMA85ghksIMDAhJEQMoDyzpzAADJkhSYEmEFANriUhpAJxTpHVLqRTG26kEBJoNEJkYJTDQAauNUIICjVAGBo5JMJ7SbAYAH08SkUMbsm0AAAAASUVORK5CYII="

/***/ })
/******/ ]);