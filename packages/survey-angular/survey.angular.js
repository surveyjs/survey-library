(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Survey", [], factory);
	else if(typeof exports === 'object')
		exports["Survey"] = factory();
	else
		root["Survey"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 38);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["b"] = __extends;
/* unused harmony export __decorate */
var __assign = Object["assign"] || function (target) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                target[p] = s[p];
    }
    return target;
};
function __extends(thisClass, baseClass) {
    for (var p in baseClass)
        if (baseClass.hasOwnProperty(p))
            thisClass[p] = baseClass[p];
    function __() { this.constructor = thisClass; }
    thisClass.prototype = baseClass === null ? Object.create(baseClass) : (__.prototype = baseClass.prototype, new __());
}
;
var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.unstable_renderSubtreeIntoContainer = exports.PureComponent = exports.Component = exports.unmountComponentAtNode = exports.findDOMNode = exports.isValidElement = exports.cloneElement = exports.createElement = exports.createFactory = exports.createClass = exports.render = exports.Children = exports.PropTypes = exports.DOM = exports.version = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _proptypes = __webpack_require__(18);

var _proptypes2 = _interopRequireDefault(_proptypes);

var _preact = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var version = '15.1.0'; // trick libraries to think we are react

var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(' ');

var REACT_ELEMENT_TYPE = typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element') || 0xeac7;

var COMPONENT_WRAPPER_KEY = typeof Symbol !== 'undefined' ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper';

// don't autobind these methods since they already have guaranteed context.
var AUTOBIND_BLACKLIST = {
	constructor: 1,
	render: 1,
	shouldComponentUpdate: 1,
	componentWillReceiveProps: 1,
	componentWillUpdate: 1,
	componentDidUpdate: 1,
	componentWillMount: 1,
	componentDidMount: 1,
	componentWillUnmount: 1,
	componentDidUnmount: 1
};

var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vert|word|writing|x)[A-Z]/;

var BYPASS_HOOK = {};

/*global process*/
var DEV = typeof process === 'undefined' || !process.env || process.env.NODE_ENV !== 'production';

// a component that renders nothing. Used to replace components for unmountComponentAtNode.
function EmptyComponent() {
	return null;
}

// make react think we're react.
var VNode = (0, _preact.h)('a', null).constructor;
VNode.prototype.$$typeof = REACT_ELEMENT_TYPE;
VNode.prototype.preactCompatUpgraded = false;
VNode.prototype.preactCompatNormalized = false;

Object.defineProperty(VNode.prototype, 'type', {
	get: function get() {
		return this.nodeName;
	},
	set: function set(v) {
		this.nodeName = v;
	},

	configurable: true
});

Object.defineProperty(VNode.prototype, 'props', {
	get: function get() {
		return this.attributes;
	},
	set: function set(v) {
		this.attributes = v;
	},

	configurable: true
});

var oldEventHook = _preact.options.event;
_preact.options.event = function (e) {
	if (oldEventHook) e = oldEventHook(e);
	e.persist = Object;
	e.nativeEvent = e;
	return e;
};

var oldVnodeHook = _preact.options.vnode;
_preact.options.vnode = function (vnode) {
	if (!vnode.preactCompatUpgraded) {
		vnode.preactCompatUpgraded = true;

		var tag = vnode.nodeName,
		    attrs = vnode.attributes;

		if (!attrs) attrs = vnode.attributes = {};

		if (typeof tag === 'function') {
			if (tag[COMPONENT_WRAPPER_KEY] === true || tag.prototype && 'isReactComponent' in tag.prototype) {
				if (vnode.children && !vnode.children.length) vnode.children = undefined;
				if (vnode.children) attrs.children = vnode.children;

				if (!vnode.preactCompatNormalized) {
					normalizeVNode(vnode);
				}
				handleComponentVNode(vnode);
			}
		} else {
			if (vnode.children && !vnode.children.length) vnode.children = undefined;
			if (vnode.children) attrs.children = vnode.children;

			if (attrs.defaultValue) {
				if (!attrs.value && attrs.value !== 0) {
					attrs.value = attrs.defaultValue;
				}
				delete attrs.defaultValue;
			}

			handleElementVNode(vnode, attrs);
		}
	}

	if (oldVnodeHook) oldVnodeHook(vnode);
};

function handleComponentVNode(vnode) {
	var tag = vnode.nodeName,
	    a = vnode.attributes;

	vnode.attributes = {};
	if (tag.defaultProps) extend(vnode.attributes, tag.defaultProps);
	if (a) extend(vnode.attributes, a);
}

function handleElementVNode(vnode, a) {
	var shouldSanitize = void 0,
	    attrs = void 0,
	    i = void 0;
	if (a) {
		for (i in a) {
			if (shouldSanitize = CAMEL_PROPS.test(i)) break;
		}if (shouldSanitize) {
			attrs = vnode.attributes = {};
			for (i in a) {
				if (a.hasOwnProperty(i)) {
					attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
				}
			}
		}
	}
}

// proxy render() since React returns a Component reference.
function render(vnode, parent, callback) {
	var prev = parent && parent._preactCompatRendered;

	// ignore impossible previous renders
	if (prev && prev.parentNode !== parent) prev = null;

	// default to first Element child
	if (!prev) prev = parent.children[0];

	// remove unaffected siblings
	for (var i = parent.childNodes.length; i--;) {
		if (parent.childNodes[i] !== prev) {
			parent.removeChild(parent.childNodes[i]);
		}
	}

	var out = (0, _preact.render)(vnode, parent, prev);
	if (parent) parent._preactCompatRendered = out;
	if (typeof callback === 'function') callback();
	return out && out._component || out.base;
}

var ContextProvider = function () {
	function ContextProvider() {
		_classCallCheck(this, ContextProvider);
	}

	_createClass(ContextProvider, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return this.props.context;
		}
	}, {
		key: 'render',
		value: function render(props) {
			return props.children[0];
		}
	}]);

	return ContextProvider;
}();

function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
	var wrap = (0, _preact.h)(ContextProvider, { context: parentComponent.context }, vnode);
	var c = render(wrap, container);
	if (callback) callback(c);
	return c;
}

function unmountComponentAtNode(container) {
	var existing = container._preactCompatRendered;
	if (existing && existing.parentNode === container) {
		(0, _preact.render)((0, _preact.h)(EmptyComponent), container, existing);
		return true;
	}
	return false;
}

var ARR = [];

// This API is completely unnecessary for Preact, so it's basically passthrough.
var Children = {
	map: function map(children, fn, ctx) {
		if (children == null) return null;
		children = Children.toArray(children);
		if (ctx && ctx !== children) fn = fn.bind(ctx);
		return children.map(fn);
	},
	forEach: function forEach(children, fn, ctx) {
		if (children == null) return null;
		children = Children.toArray(children);
		if (ctx && ctx !== children) fn = fn.bind(ctx);
		children.forEach(fn);
	},
	count: function count(children) {
		return children && children.length || 0;
	},
	only: function only(children) {
		children = Children.toArray(children);
		if (children.length !== 1) throw new Error('Children.only() expects only one child.');
		return children[0];
	},
	toArray: function toArray(children) {
		return Array.isArray && Array.isArray(children) ? children : ARR.concat(children);
	}
};

/** Track current render() component for ref assignment */
var currentComponent = void 0;

function createFactory(type) {
	return createElement.bind(null, type);
}

var DOM = {};
for (var i = ELEMENTS.length; i--;) {
	DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
}

function upgradeToVNodes(arr, offset) {
	for (var _i = offset || 0; _i < arr.length; _i++) {
		var obj = arr[_i];
		if (Array.isArray(obj)) {
			upgradeToVNodes(obj);
		} else if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !isValidElement(obj) && (obj.props && obj.type || obj.attributes && obj.nodeName || obj.children)) {
			arr[_i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
		}
	}
}

function isStatelessComponent(c) {
	return typeof c === 'function' && !(c.prototype && c.prototype.render);
}

// wraps stateless functional components in a PropTypes validator
function wrapStatelessComponent(WrappedComponent) {
	return createClass({
		displayName: WrappedComponent.displayName || WrappedComponent.name,
		render: function render() {
			return WrappedComponent(this.props, this.context);
		}
	});
}

function statelessComponentHook(Ctor) {
	var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];
	if (Wrapped) return Wrapped === true ? Ctor : Wrapped;

	Wrapped = wrapStatelessComponent(Ctor);

	Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, { configurable: true, value: true });
	Wrapped.displayName = Ctor.displayName;
	Wrapped.propTypes = Ctor.propTypes;
	Wrapped.defaultProps = Ctor.defaultProps;

	Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, { configurable: true, value: Wrapped });

	return Wrapped;
}

function createElement() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	upgradeToVNodes(args, 2);
	return normalizeVNode(_preact.h.apply(undefined, args));
}

function normalizeVNode(vnode) {
	vnode.preactCompatNormalized = true;

	applyClassName(vnode);

	if (isStatelessComponent(vnode.nodeName)) {
		vnode.nodeName = statelessComponentHook(vnode.nodeName);
	}

	var ref = vnode.attributes.ref,
	    type = ref && (typeof ref === 'undefined' ? 'undefined' : _typeof(ref));
	if (currentComponent && (type === 'string' || type === 'number')) {
		vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
	}

	applyEventNormalization(vnode);

	return vnode;
}

function cloneElement(element, props) {
	if (!isValidElement(element)) return element;
	var elementProps = element.attributes || element.props;
	var node = (0, _preact.h)(element.nodeName || element.type, elementProps, element.children || elementProps && elementProps.children);

	for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
		children[_key2 - 2] = arguments[_key2];
	}

	return normalizeVNode(_preact.cloneElement.apply(undefined, [node, props].concat(children)));
}

function isValidElement(element) {
	return element && (element instanceof VNode || element.$$typeof === REACT_ELEMENT_TYPE);
}

function createStringRefProxy(name, component) {
	return component._refProxies[name] || (component._refProxies[name] = function (resolved) {
		if (component && component.refs) {
			component.refs[name] = resolved;
			if (resolved === null) {
				delete component._refProxies[name];
				component = null;
			}
		}
	});
}

function applyEventNormalization(_ref) {
	var nodeName = _ref.nodeName,
	    attributes = _ref.attributes;

	if (!attributes || typeof nodeName !== 'string') return;
	var props = {};
	for (var _i2 in attributes) {
		props[_i2.toLowerCase()] = _i2;
	}
	if (props.ondoubleclick) {
		attributes.ondblclick = attributes[props.ondoubleclick];
		delete attributes[props.ondoubleclick];
	}
	// for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:
	if (props.onchange && (nodeName === 'textarea' || nodeName.toLowerCase() === 'input' && !/^fil|che|rad/i.test(attributes.type))) {
		var normalized = props.oninput || 'oninput';
		if (!attributes[normalized]) {
			attributes[normalized] = multihook([attributes[normalized], attributes[props.onchange]]);
			delete attributes[props.onchange];
		}
	}
}

function applyClassName(_ref2) {
	var attributes = _ref2.attributes;

	if (!attributes) return;
	var cl = attributes.className || attributes.class;
	if (cl) attributes.className = cl;
}

function extend(base, props) {
	for (var key in props) {
		if (props.hasOwnProperty(key)) {
			base[key] = props[key];
		}
	}
	return base;
}

function shallowDiffers(a, b) {
	for (var _i3 in a) {
		if (!(_i3 in b)) return true;
	}for (var _i4 in b) {
		if (a[_i4] !== b[_i4]) return true;
	}return false;
}

function findDOMNode(component) {
	return component && component.base || component;
}

function F() {}

function createClass(obj) {
	function cl(props, context) {
		bindAll(this);
		Component.call(this, props, context, BYPASS_HOOK);
		newComponentHook.call(this, props, context);
	}

	obj = extend({ constructor: cl }, obj);

	// We need to apply mixins here so that getDefaultProps is correctly mixed
	if (obj.mixins) {
		applyMixins(obj, collateMixins(obj.mixins));
	}
	if (obj.statics) {
		extend(cl, obj.statics);
	}
	if (obj.propTypes) {
		cl.propTypes = obj.propTypes;
	}
	if (obj.defaultProps) {
		cl.defaultProps = obj.defaultProps;
	}
	if (obj.getDefaultProps) {
		cl.defaultProps = obj.getDefaultProps();
	}

	F.prototype = Component.prototype;
	cl.prototype = extend(new F(), obj);

	cl.displayName = obj.displayName || 'Component';

	return cl;
}

// Flatten an Array of mixins to a map of method name to mixin implementations
function collateMixins(mixins) {
	var keyed = {};
	for (var _i5 = 0; _i5 < mixins.length; _i5++) {
		var mixin = mixins[_i5];
		for (var key in mixin) {
			if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
				(keyed[key] || (keyed[key] = [])).push(mixin[key]);
			}
		}
	}
	return keyed;
}

// apply a mapping of Arrays of mixin methods to a component prototype
function applyMixins(proto, mixins) {
	for (var key in mixins) {
		if (mixins.hasOwnProperty(key)) {
			proto[key] = multihook(mixins[key].concat(proto[key] || ARR), key === 'getDefaultProps' || key === 'getInitialState' || key === 'getChildContext');
		}
	}
}

function bindAll(ctx) {
	for (var _i6 in ctx) {
		var v = ctx[_i6];
		if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(_i6)) {
			(ctx[_i6] = v.bind(ctx)).__bound = true;
		}
	}
}

function callMethod(ctx, m, args) {
	if (typeof m === 'string') {
		m = ctx.constructor.prototype[m];
	}
	if (typeof m === 'function') {
		return m.apply(ctx, args);
	}
}

function multihook(hooks, skipDuplicates) {
	return function () {
		var ret = void 0;
		for (var _i7 = 0; _i7 < hooks.length; _i7++) {
			var r = callMethod(this, hooks[_i7], arguments);

			if (skipDuplicates && r != null) {
				if (!ret) ret = {};
				for (var key in r) {
					if (r.hasOwnProperty(key)) {
						ret[key] = r[key];
					}
				}
			} else if (typeof r !== 'undefined') ret = r;
		}
		return ret;
	};
}

function newComponentHook(props, context) {
	propsHook.call(this, props, context);
	this.componentWillReceiveProps = multihook([propsHook, this.componentWillReceiveProps || 'componentWillReceiveProps']);
	this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
}

function propsHook(props, context) {
	if (!props) return;

	// React annoyingly special-cases single children, and some react components are ridiculously strict about this.
	var c = props.children;
	if (c && Array.isArray(c) && c.length === 1) {
		props.children = c[0];

		// but its totally still going to be an Array.
		if (props.children && _typeof(props.children) === 'object') {
			props.children.length = 1;
			props.children[0] = props.children;
		}
	}

	// add proptype checking
	if (DEV) {
		var ctor = typeof this === 'function' ? this : this.constructor,
		    propTypes = this.propTypes || ctor.propTypes;
		if (propTypes) {
			for (var prop in propTypes) {
				if (propTypes.hasOwnProperty(prop) && typeof propTypes[prop] === 'function') {
					var displayName = this.displayName || ctor.name;
					var err = propTypes[prop](props, prop, displayName, 'prop');
					if (err) console.error(new Error(err.message || err));
				}
			}
		}
	}
}

function beforeRender(props) {
	currentComponent = this;
}

function afterRender() {
	if (currentComponent === this) {
		currentComponent = null;
	}
}

function Component(props, context, opts) {
	_preact.Component.call(this, props, context);
	this.state = this.getInitialState ? this.getInitialState() : {};
	this.refs = {};
	this._refProxies = {};
	if (opts !== BYPASS_HOOK) {
		newComponentHook.call(this, props, context);
	}
}
extend(Component.prototype = new _preact.Component(), {
	constructor: Component,

	isReactComponent: {},

	replaceState: function replaceState(state, callback) {
		this.setState(state, callback);
		for (var _i8 in this.state) {
			if (!(_i8 in state)) {
				delete this.state[_i8];
			}
		}
	},
	getDOMNode: function getDOMNode() {
		return this.base;
	},
	isMounted: function isMounted() {
		return !!this.base;
	}
});

function PureComponent(props, context) {
	Component.call(this, props, context);
}
F.prototype = Component.prototype;
PureComponent.prototype = new F();
PureComponent.prototype.shouldComponentUpdate = function (props, state) {
	return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
};

exports.version = version;
exports.DOM = DOM;
exports.PropTypes = _proptypes2.default;
exports.Children = Children;
exports.render = render;
exports.createClass = createClass;
exports.createFactory = createFactory;
exports.createElement = createElement;
exports.cloneElement = cloneElement;
exports.isValidElement = isValidElement;
exports.findDOMNode = findDOMNode;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.Component = Component;
exports.PureComponent = PureComponent;
exports.unstable_renderSubtreeIntoContainer = renderSubtreeIntoContainer;
exports.default = {
	version: version,
	DOM: DOM,
	PropTypes: _proptypes2.default,
	Children: Children,
	render: render,
	createClass: createClass,
	createFactory: createFactory,
	createElement: createElement,
	cloneElement: cloneElement,
	isValidElement: isValidElement,
	findDOMNode: findDOMNode,
	unmountComponentAtNode: unmountComponentAtNode,
	Component: Component,
	PureComponent: PureComponent,
	unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(17)))

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Base; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SurveyError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPageId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SurveyElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Event; });
/**
 * The base class for SurveyJS objects.
 */
var Base = (function () {
    function Base() {
    }
    Base.isValueEmpty = function (value) {
        if (Array.isArray(value) && value.length === 0)
            return true;
        return !value && value !== 0 && value !== false;
    };
    Base.prototype.getType = function () {
        throw new Error('This method is abstract');
    };
    Base.prototype.isTwoValueEquals = function (x, y) {
        if (x === y)
            return true;
        if (!(x instanceof Object) || !(y instanceof Object))
            return false;
        for (var p in x) {
            if (!x.hasOwnProperty(p))
                continue;
            if (!y.hasOwnProperty(p))
                return false;
            if (x[p] === y[p])
                continue;
            if (typeof (x[p]) !== "object")
                return false;
            if (!this.isTwoValueEquals(x[p], y[p]))
                return false;
        }
        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
                return false;
        }
        return true;
    };
    return Base;
}());

var SurveyError = (function () {
    function SurveyError() {
    }
    SurveyError.prototype.getText = function () {
        throw new Error('This method is abstract');
    };
    return SurveyError;
}());

var SurveyPageId;
SurveyPageId = "sq_page";
var SurveyElement = (function () {
    function SurveyElement() {
    }
    SurveyElement.ScrollElementToTop = function (elementId) {
        if (!elementId)
            return false;
        var el = document.getElementById(elementId);
        if (!el || !el.scrollIntoView)
            return false;
        var elemTop = el.getBoundingClientRect().top;
        if (elemTop < 0)
            el.scrollIntoView();
        return elemTop < 0;
    };
    SurveyElement.GetFirstNonTextElement = function (elements) {
        if (!elements || !elements.length)
            return;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].nodeName != "#text" && elements[i].nodeName != "#comment")
                return elements[i];
        }
        return null;
    };
    SurveyElement.FocusElement = function (elementId) {
        if (!elementId)
            return false;
        var el = document.getElementById(elementId);
        if (el) {
            el.focus();
            return true;
        }
        return false;
    };
    return SurveyElement;
}());

var Event = (function () {
    function Event() {
    }
    Object.defineProperty(Event.prototype, "isEmpty", {
        get: function () { return this.callbacks == null || this.callbacks.length == 0; },
        enumerable: true,
        configurable: true
    });
    Event.prototype.fire = function (sender, options) {
        if (this.callbacks == null)
            return;
        for (var i = 0; i < this.callbacks.length; i++) {
            var callResult = this.callbacks[i](sender, options);
        }
    };
    Event.prototype.add = function (func) {
        if (this.callbacks == null) {
            this.callbacks = new Array();
        }
        this.callbacks.push(func);
    };
    Event.prototype.remove = function (func) {
        if (this.callbacks == null)
            return;
        var index = this.callbacks.indexOf(func, 0);
        if (index != undefined) {
            this.callbacks.splice(index, 1);
        }
    };
    return Event;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* unused harmony export JsonObjectProperty */
/* unused harmony export JsonMetadataClass */
/* unused harmony export JsonMetadata */
/* unused harmony export JsonError */
/* unused harmony export JsonUnknownPropertyError */
/* unused harmony export JsonMissingTypeErrorBase */
/* unused harmony export JsonMissingTypeError */
/* unused harmony export JsonIncorrectTypeError */
/* unused harmony export JsonRequiredPropertyError */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return JsonObject; });

var JsonObjectProperty = (function () {
    function JsonObjectProperty(name) {
        this.name = name;
        this.typeValue = null;
        this.choicesValue = null;
        this.choicesfunc = null;
        this.className = null;
        this.alternativeName = null;
        this.classNamePart = null;
        this.baseClassName = null;
        this.defaultValue = null;
        this.readOnly = false;
        this.visible = true;
        this.isLocalizable = false;
        this.serializationProperty = null;
        this.onGetValue = null;
    }
    Object.defineProperty(JsonObjectProperty.prototype, "type", {
        get: function () { return this.typeValue ? this.typeValue : "string"; },
        set: function (value) { this.typeValue = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JsonObjectProperty.prototype, "hasToUseGetValue", {
        get: function () { return this.onGetValue || this.serializationProperty; },
        enumerable: true,
        configurable: true
    });
    JsonObjectProperty.prototype.isDefaultValue = function (value) {
        return (this.defaultValue) ? (this.defaultValue == value) : !(value);
    };
    JsonObjectProperty.prototype.getValue = function (obj) {
        if (this.onGetValue)
            return this.onGetValue(obj);
        if (this.serializationProperty)
            return obj[this.serializationProperty].getJson();
        return obj[this.name];
    };
    JsonObjectProperty.prototype.getPropertyValue = function (obj) {
        if (this.isLocalizable)
            return obj[this.serializationProperty].text;
        return this.getValue(obj);
    };
    Object.defineProperty(JsonObjectProperty.prototype, "hasToUseSetValue", {
        get: function () { return this.onSetValue || this.serializationProperty; },
        enumerable: true,
        configurable: true
    });
    JsonObjectProperty.prototype.setValue = function (obj, value, jsonConv) {
        if (this.onSetValue) {
            this.onSetValue(obj, value, jsonConv);
        }
        else {
            if (this.serializationProperty)
                obj[this.serializationProperty].setJson(value);
            else
                obj[this.name] = value;
        }
    };
    JsonObjectProperty.prototype.getObjType = function (objType) {
        if (!this.classNamePart)
            return objType;
        return objType.replace(this.classNamePart, "");
    };
    JsonObjectProperty.prototype.getClassName = function (className) {
        return (this.classNamePart && className.indexOf(this.classNamePart) < 0) ? className + this.classNamePart : className;
    };
    Object.defineProperty(JsonObjectProperty.prototype, "choices", {
        get: function () {
            if (this.choicesValue != null)
                return this.choicesValue;
            if (this.choicesfunc != null)
                return this.choicesfunc();
            return null;
        },
        enumerable: true,
        configurable: true
    });
    JsonObjectProperty.prototype.setChoices = function (value, valueFunc) {
        this.choicesValue = value;
        this.choicesfunc = valueFunc;
    };
    return JsonObjectProperty;
}());

var JsonMetadataClass = (function () {
    function JsonMetadataClass(name, properties, creator, parentName) {
        if (creator === void 0) { creator = null; }
        if (parentName === void 0) { parentName = null; }
        this.name = name;
        this.creator = creator;
        this.parentName = parentName;
        this.properties = null;
        this.requiredProperties = null;
        this.properties = new Array();
        for (var i = 0; i < properties.length; i++) {
            var prop = this.createProperty(properties[i]);
            if (prop) {
                this.properties.push(prop);
            }
        }
    }
    JsonMetadataClass.prototype.find = function (name) {
        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == name)
                return this.properties[i];
        }
        return null;
    };
    JsonMetadataClass.prototype.createProperty = function (propInfo) {
        var propertyName = typeof propInfo === "string" ? propInfo : propInfo.name;
        if (!propertyName)
            return;
        var propertyType = null;
        var typeIndex = propertyName.indexOf(JsonMetadataClass.typeSymbol);
        if (typeIndex > -1) {
            propertyType = propertyName.substring(typeIndex + 1);
            propertyName = propertyName.substring(0, typeIndex);
        }
        propertyName = this.getPropertyName(propertyName);
        var prop = new JsonObjectProperty(propertyName);
        if (propertyType) {
            prop.type = propertyType;
        }
        if (typeof propInfo === "object") {
            if (propInfo.type) {
                prop.type = propInfo.type;
            }
            if (propInfo.default) {
                prop.defaultValue = propInfo.default;
            }
            if (propInfo.visible === false) {
                prop.visible = false;
            }
            if (propInfo.isRequired) {
                this.makePropertyRequired(prop.name);
            }
            if (propInfo.choices) {
                var choicesFunc = typeof propInfo.choices === "function" ? propInfo.choices : null;
                var choicesValue = typeof propInfo.choices !== "function" ? propInfo.choices : null;
                prop.setChoices(choicesValue, choicesFunc);
            }
            if (propInfo.onGetValue) {
                prop.onGetValue = propInfo.onGetValue;
            }
            if (propInfo.onSetValue) {
                prop.onSetValue = propInfo.onSetValue;
            }
            if (propInfo.serializationProperty) {
                prop.serializationProperty = propInfo.serializationProperty;
                var s;
                if (prop.serializationProperty && prop.serializationProperty.indexOf("loc") == 0) {
                    prop.isLocalizable = true;
                }
            }
            if (propInfo.isLocalizable) {
                prop.isLocalizable = propInfo.isLocalizable;
            }
            if (propInfo.className) {
                prop.className = propInfo.className;
            }
            if (propInfo.baseClassName) {
                prop.baseClassName = propInfo.baseClassName;
            }
            if (propInfo.classNamePart) {
                prop.classNamePart = propInfo.classNamePart;
            }
            if (propInfo.alternativeName) {
                prop.alternativeName = propInfo.alternativeName;
            }
        }
        return prop;
    };
    JsonMetadataClass.prototype.getPropertyName = function (propertyName) {
        if (propertyName.length == 0 || propertyName[0] != JsonMetadataClass.requiredSymbol)
            return propertyName;
        propertyName = propertyName.slice(1);
        this.makePropertyRequired(propertyName);
        return propertyName;
    };
    JsonMetadataClass.prototype.makePropertyRequired = function (propertyName) {
        if (!this.requiredProperties) {
            this.requiredProperties = new Array();
        }
        this.requiredProperties.push(propertyName);
    };
    return JsonMetadataClass;
}());

JsonMetadataClass.requiredSymbol = '!';
JsonMetadataClass.typeSymbol = ':';
var JsonMetadata = (function () {
    function JsonMetadata() {
        this.classes = {};
        this.childrenClasses = {};
        this.classProperties = {};
        this.classRequiredProperties = {};
    }
    JsonMetadata.prototype.addClass = function (name, properties, creator, parentName) {
        if (creator === void 0) { creator = null; }
        if (parentName === void 0) { parentName = null; }
        var metaDataClass = new JsonMetadataClass(name, properties, creator, parentName);
        this.classes[name] = metaDataClass;
        if (parentName) {
            var children = this.childrenClasses[parentName];
            if (!children) {
                this.childrenClasses[parentName] = [];
            }
            this.childrenClasses[parentName].push(metaDataClass);
        }
        return metaDataClass;
    };
    JsonMetadata.prototype.overrideClassCreatore = function (name, creator) {
        var metaDataClass = this.findClass(name);
        if (metaDataClass) {
            metaDataClass.creator = creator;
        }
    };
    JsonMetadata.prototype.getProperties = function (className) {
        var properties = this.classProperties[className];
        if (!properties) {
            properties = new Array();
            this.fillProperties(className, properties);
            this.classProperties[className] = properties;
        }
        return properties;
    };
    JsonMetadata.prototype.findProperty = function (className, propertyName) {
        var properties = this.getProperties(className);
        for (var i = 0; i < properties.length; i++) {
            if (properties[i].name == propertyName)
                return properties[i];
        }
        return null;
    };
    JsonMetadata.prototype.createClass = function (name) {
        var metaDataClass = this.findClass(name);
        if (!metaDataClass)
            return null;
        return metaDataClass.creator();
    };
    JsonMetadata.prototype.getChildrenClasses = function (name, canBeCreated) {
        if (canBeCreated === void 0) { canBeCreated = false; }
        var result = [];
        this.fillChildrenClasses(name, canBeCreated, result);
        return result;
    };
    JsonMetadata.prototype.getRequiredProperties = function (name) {
        var properties = this.classRequiredProperties[name];
        if (!properties) {
            properties = new Array();
            this.fillRequiredProperties(name, properties);
            this.classRequiredProperties[name] = properties;
        }
        return properties;
    };
    JsonMetadata.prototype.addProperty = function (className, propertyInfo) {
        var metaDataClass = this.findClass(className);
        if (!metaDataClass)
            return;
        var property = metaDataClass.createProperty(propertyInfo);
        if (property) {
            this.addPropertyToClass(metaDataClass, property);
            this.emptyClassPropertiesHash(metaDataClass);
        }
    };
    JsonMetadata.prototype.removeProperty = function (className, propertyName) {
        var metaDataClass = this.findClass(className);
        if (!metaDataClass)
            return false;
        var property = metaDataClass.find(propertyName);
        if (property) {
            this.removePropertyFromClass(metaDataClass, property);
            this.emptyClassPropertiesHash(metaDataClass);
        }
    };
    JsonMetadata.prototype.addPropertyToClass = function (metaDataClass, property) {
        if (metaDataClass.find(property.name) != null)
            return;
        metaDataClass.properties.push(property);
    };
    JsonMetadata.prototype.removePropertyFromClass = function (metaDataClass, property) {
        var index = metaDataClass.properties.indexOf(property);
        if (index < 0)
            return;
        metaDataClass.properties.splice(index, 1);
        if (metaDataClass.requiredProperties) {
            index = metaDataClass.requiredProperties.indexOf(property.name);
            if (index >= 0) {
                metaDataClass.requiredProperties.splice(index, 1);
            }
        }
    };
    JsonMetadata.prototype.emptyClassPropertiesHash = function (metaDataClass) {
        this.classProperties[metaDataClass.name] = null;
        var childClasses = this.getChildrenClasses(metaDataClass.name);
        for (var i = 0; i < childClasses.length; i++) {
            this.classProperties[childClasses[i].name] = null;
        }
    };
    JsonMetadata.prototype.fillChildrenClasses = function (name, canBeCreated, result) {
        var children = this.childrenClasses[name];
        if (!children)
            return;
        for (var i = 0; i < children.length; i++) {
            if (!canBeCreated || children[i].creator) {
                result.push(children[i]);
            }
            this.fillChildrenClasses(children[i].name, canBeCreated, result);
        }
    };
    JsonMetadata.prototype.findClass = function (name) {
        return this.classes[name];
    };
    JsonMetadata.prototype.fillProperties = function (name, list) {
        var metaDataClass = this.findClass(name);
        if (!metaDataClass)
            return;
        if (metaDataClass.parentName) {
            this.fillProperties(metaDataClass.parentName, list);
        }
        for (var i = 0; i < metaDataClass.properties.length; i++) {
            this.addPropertyCore(metaDataClass.properties[i], list, list.length);
        }
    };
    JsonMetadata.prototype.addPropertyCore = function (property, list, endIndex) {
        var index = -1;
        for (var i = 0; i < endIndex; i++) {
            if (list[i].name == property.name) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            list.push(property);
        }
        else {
            list[index] = property;
        }
    };
    JsonMetadata.prototype.fillRequiredProperties = function (name, list) {
        var metaDataClass = this.findClass(name);
        if (!metaDataClass)
            return;
        if (metaDataClass.requiredProperties) {
            Array.prototype.push.apply(list, metaDataClass.requiredProperties);
        }
        if (metaDataClass.parentName) {
            this.fillRequiredProperties(metaDataClass.parentName, list);
        }
    };
    return JsonMetadata;
}());

var JsonError = (function () {
    function JsonError(type, message) {
        this.type = type;
        this.message = message;
        this.description = "";
        this.at = -1;
    }
    JsonError.prototype.getFullDescription = function () {
        return this.message + (this.description ? "\n" + this.description : "");
    };
    return JsonError;
}());

var JsonUnknownPropertyError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](JsonUnknownPropertyError, _super);
    function JsonUnknownPropertyError(propertyName, className) {
        var _this = _super.call(this, "unknownproperty", "The property '" + propertyName + "' in class '" + className + "' is unknown.") || this;
        _this.propertyName = propertyName;
        _this.className = className;
        var properties = JsonObject.metaData.getProperties(className);
        if (properties) {
            _this.description = "The list of available properties are: ";
            for (var i = 0; i < properties.length; i++) {
                if (i > 0)
                    _this.description += ", ";
                _this.description += properties[i].name;
            }
            _this.description += '.';
        }
        return _this;
    }
    return JsonUnknownPropertyError;
}(JsonError));

var JsonMissingTypeErrorBase = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](JsonMissingTypeErrorBase, _super);
    function JsonMissingTypeErrorBase(baseClassName, type, message) {
        var _this = _super.call(this, type, message) || this;
        _this.baseClassName = baseClassName;
        _this.type = type;
        _this.message = message;
        _this.description = "The following types are available: ";
        var types = JsonObject.metaData.getChildrenClasses(baseClassName, true);
        for (var i = 0; i < types.length; i++) {
            if (i > 0)
                _this.description += ", ";
            _this.description += "'" + types[i].name + "'";
        }
        _this.description += ".";
        return _this;
    }
    return JsonMissingTypeErrorBase;
}(JsonError));

var JsonMissingTypeError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](JsonMissingTypeError, _super);
    function JsonMissingTypeError(propertyName, baseClassName) {
        var _this = _super.call(this, baseClassName, "missingtypeproperty", "The property type is missing in the object. Please take a look at property: '" + propertyName + "'.") || this;
        _this.propertyName = propertyName;
        _this.baseClassName = baseClassName;
        return _this;
    }
    return JsonMissingTypeError;
}(JsonMissingTypeErrorBase));

var JsonIncorrectTypeError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](JsonIncorrectTypeError, _super);
    function JsonIncorrectTypeError(propertyName, baseClassName) {
        var _this = _super.call(this, baseClassName, "incorrecttypeproperty", "The property type is incorrect in the object. Please take a look at property: '" + propertyName + "'.") || this;
        _this.propertyName = propertyName;
        _this.baseClassName = baseClassName;
        return _this;
    }
    return JsonIncorrectTypeError;
}(JsonMissingTypeErrorBase));

var JsonRequiredPropertyError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](JsonRequiredPropertyError, _super);
    function JsonRequiredPropertyError(propertyName, className) {
        var _this = _super.call(this, "requiredproperty", "The property '" + propertyName + "' is required in class '" + className + "'.") || this;
        _this.propertyName = propertyName;
        _this.className = className;
        return _this;
    }
    return JsonRequiredPropertyError;
}(JsonError));

var JsonObject = (function () {
    function JsonObject() {
        this.errors = new Array();
    }
    Object.defineProperty(JsonObject, "metaData", {
        get: function () { return JsonObject.metaDataValue; },
        enumerable: true,
        configurable: true
    });
    JsonObject.prototype.toJsonObject = function (obj) {
        return this.toJsonObjectCore(obj, null);
    };
    JsonObject.prototype.toObject = function (jsonObj, obj) {
        if (!jsonObj)
            return;
        var properties = null;
        if (obj.getType) {
            properties = JsonObject.metaData.getProperties(obj.getType());
        }
        if (!properties)
            return;
        for (var key in jsonObj) {
            if (key == JsonObject.typePropertyName)
                continue;
            if (key == JsonObject.positionPropertyName) {
                obj[key] = jsonObj[key];
                continue;
            }
            var property = this.findProperty(properties, key);
            if (!property) {
                this.addNewError(new JsonUnknownPropertyError(key.toString(), obj.getType()), jsonObj);
                continue;
            }
            this.valueToObj(jsonObj[key], obj, key, property);
        }
    };
    JsonObject.prototype.toJsonObjectCore = function (obj, property) {
        if (!obj.getType)
            return obj;
        var result = {};
        if (property != null && (!property.className)) {
            result[JsonObject.typePropertyName] = property.getObjType(obj.getType());
        }
        var properties = JsonObject.metaData.getProperties(obj.getType());
        for (var i = 0; i < properties.length; i++) {
            this.valueToJson(obj, result, properties[i]);
        }
        return result;
    };
    JsonObject.prototype.valueToJson = function (obj, result, property) {
        var value = property.getValue(obj);
        if (value === undefined || value === null)
            return;
        if (property.isDefaultValue(value))
            return;
        if (this.isValueArray(value)) {
            var arrValue = [];
            for (var i = 0; i < value.length; i++) {
                arrValue.push(this.toJsonObjectCore(value[i], property));
            }
            value = arrValue.length > 0 ? arrValue : null;
        }
        else {
            value = this.toJsonObjectCore(value, property);
        }
        if (!property.isDefaultValue(value)) {
            result[property.name] = value;
        }
    };
    JsonObject.prototype.valueToObj = function (value, obj, key, property) {
        if (value == null)
            return;
        if (property != null && property.hasToUseSetValue) {
            property.setValue(obj, value, this);
            return;
        }
        if (this.isValueArray(value)) {
            this.valueToArray(value, obj, property.name, property);
            return;
        }
        var newObj = this.createNewObj(value, property);
        if (newObj.newObj) {
            this.toObject(value, newObj.newObj);
            value = newObj.newObj;
        }
        if (!newObj.error) {
            obj[property.name] = value;
        }
    };
    JsonObject.prototype.isValueArray = function (value) { return value && Array.isArray(value); };
    JsonObject.prototype.createNewObj = function (value, property) {
        var result = { newObj: null, error: null };
        var className = value[JsonObject.typePropertyName];
        if (!className && property != null && property.className) {
            className = property.className;
        }
        className = property.getClassName(className);
        result.newObj = (className) ? JsonObject.metaData.createClass(className) : null;
        result.error = this.checkNewObjectOnErrors(result.newObj, value, property, className);
        return result;
    };
    JsonObject.prototype.checkNewObjectOnErrors = function (newObj, value, property, className) {
        var error = null;
        if (newObj) {
            var requiredProperties = JsonObject.metaData.getRequiredProperties(className);
            if (requiredProperties) {
                for (var i = 0; i < requiredProperties.length; i++) {
                    if (!value[requiredProperties[i]]) {
                        error = new JsonRequiredPropertyError(requiredProperties[i], className);
                        break;
                    }
                }
            }
        }
        else {
            if (property.baseClassName) {
                if (!className) {
                    error = new JsonMissingTypeError(property.name, property.baseClassName);
                }
                else {
                    error = new JsonIncorrectTypeError(property.name, property.baseClassName);
                }
            }
        }
        if (error) {
            this.addNewError(error, value);
        }
        return error;
    };
    JsonObject.prototype.addNewError = function (error, jsonObj) {
        if (jsonObj && jsonObj[JsonObject.positionPropertyName]) {
            error.at = jsonObj[JsonObject.positionPropertyName].start;
        }
        this.errors.push(error);
    };
    JsonObject.prototype.valueToArray = function (value, obj, key, property) {
        if (obj[key] && value.length > 0)
            obj[key].splice(0, obj[key].length);
        for (var i = 0; i < value.length; i++) {
            var newValue = this.createNewObj(value[i], property);
            if (newValue.newObj) {
                obj[key].push(newValue.newObj);
                this.toObject(value[i], newValue.newObj);
            }
            else {
                if (!newValue.error) {
                    obj[key].push(value[i]);
                }
            }
        }
    };
    JsonObject.prototype.findProperty = function (properties, key) {
        if (!properties)
            return null;
        for (var i = 0; i < properties.length; i++) {
            var prop = properties[i];
            if (prop.name == key || prop.alternativeName == key)
                return prop;
        }
        return null;
    };
    return JsonObject;
}());

JsonObject.typePropertyName = "type";
JsonObject.positionPropertyName = "pos";
JsonObject.metaDataValue = new JsonMetadata();


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyElementBase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyQuestionElementBase; });


var SurveyElementBase = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyElementBase, _super);
    function SurveyElementBase(props) {
        var _this = _super.call(this, props) || this;
        _this.css = props.css;
        _this.rootCss = props.rootCss;
        _this.isDisplayMode = props.isDisplayMode || false;
        return _this;
    }
    SurveyElementBase.renderLocString = function (locStr, style) {
        if (style === void 0) { style = null; }
        if (locStr.hasHtml) {
            var htmlValue = { __html: locStr.renderedHtml };
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("span", { style: style, dangerouslySetInnerHTML: htmlValue });
        }
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("span", { style: style }, locStr.renderedHtml);
    };
    SurveyElementBase.prototype.componentWillReceiveProps = function (nextProps) {
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.isDisplayMode = nextProps.isDisplayMode || false;
    };
    SurveyElementBase.prototype.renderLocString = function (locStr, style) {
        if (style === void 0) { style = null; }
        return SurveyElementBase.renderLocString(locStr, style);
    };
    return SurveyElementBase;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));

var SurveyQuestionElementBase = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyQuestionElementBase, _super);
    function SurveyQuestionElementBase(props) {
        var _this = _super.call(this, props) || this;
        _this.questionBase = props.question;
        _this.creator = props.creator;
        return _this;
    }
    SurveyQuestionElementBase.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        this.questionBase = nextProps.question;
        this.creator = nextProps.creator;
    };
    SurveyQuestionElementBase.prototype.shouldComponentUpdate = function () {
        return !this.questionBase.customWidget
            || !!this.questionBase.customWidgetData.isNeedRender
            || !!this.questionBase.customWidget.widgetJson.render;
    };
    return SurveyQuestionElementBase;
}(SurveyElementBase));



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return surveyLocalization; });
/* unused harmony export surveyStrings */
var surveyLocalization = {
    currentLocale: "",
    locales: {},
    getString: function (strName) {
        var loc = this.currentLocale ? this.locales[this.currentLocale] : surveyStrings;
        if (!loc || !loc[strName])
            loc = surveyStrings;
        return loc[strName];
    },
    getLocales: function () {
        var res = [];
        res.push("");
        for (var key in this.locales) {
            res.push(key);
        }
        res.sort();
        return res;
    }
};
var surveyStrings = {
    pagePrevText: "Previous",
    pageNextText: "Next",
    completeText: "Complete",
    otherItemText: "Other (describe)",
    progressText: "Page {0} of {1}",
    emptySurvey: "There is no visible page or question in the survey.",
    completingSurvey: "Thank you for completing the survey!",
    loadingSurvey: "Survey is loading...",
    optionsCaption: "Choose...",
    requiredError: "Please answer the question.",
    requiredInAllRowsError: "Please answer questions in all rows.",
    numericError: "The value should be numeric.",
    textMinLength: "Please enter at least {0} symbols.",
    textMaxLength: "Please enter less than {0} symbols.",
    textMinMaxLength: "Please enter more than {0} and less than {1} symbols.",
    minRowCountError: "Please fill in at least {0} rows.",
    minSelectError: "Please select at least {0} variants.",
    maxSelectError: "Please select no more than {0} variants.",
    numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
    numericMin: "The '{0}' should be equal or more than {1}",
    numericMax: "The '{0}' should be equal or less than {1}",
    invalidEmail: "Please enter a valid e-mail address.",
    urlRequestError: "The request returned error '{0}'. {1}",
    urlGetChoicesError: "The request returned empty data or the 'path' property is incorrect",
    exceedMaxSize: "The file size should not exceed {0}.",
    otherRequiredError: "Please enter the other value.",
    uploadingFile: "Your file is uploading. Please wait several seconds and try again.",
    addRow: "Add row",
    removeRow: "Remove",
    choices_firstItem: "first item",
    choices_secondItem: "second item",
    choices_thirdItem: "third item",
    matrix_column: "Column",
    matrix_row: "Row"
};
surveyLocalization.locales["en"] = surveyStrings;
if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match;
        });
    };
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__react_reactSurvey__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__react_reactSurveyWindow__ = __webpack_require__(31);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyNG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyWindowNG; });





var SurveyNG = (function () {
    function SurveyNG() {
    }
    SurveyNG.render = function (elementId, props) {
        var element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
        __WEBPACK_IMPORTED_MODULE_2_react_dom__["render"](__WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__react_reactSurvey__["a" /* Survey */], __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __assign */]({}, props)), element);
    };
    return SurveyNG;
}());

var SurveyWindowNG = (function () {
    function SurveyWindowNG() {
    }
    SurveyWindowNG.render = function (elementId, props) {
        var element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
        __WEBPACK_IMPORTED_MODULE_2_react_dom__["render"](__WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__react_reactSurveyWindow__["a" /* SurveyWindow */], __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __assign */]({}, props)), element);
    };
    return SurveyWindowNG;
}());



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__conditionsParser__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__conditionProcessValue__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Condition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ConditionNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConditionRunner; });


var Condition = (function () {
    function Condition() {
        this.opValue = "equal";
        this.left = null;
        this.right = null;
    }
    Object.defineProperty(Condition, "operators", {
        get: function () {
            if (Condition.operatorsValue != null)
                return Condition.operatorsValue;
            Condition.operatorsValue = {
                empty: function (left, right) {
                    if (left == null)
                        return true;
                    return !left;
                },
                notempty: function (left, right) {
                    if (left == null)
                        return false;
                    return !(!left);
                },
                equal: function (left, right) {
                    if (left == null && right != null || left != null && right == null)
                        return false;
                    if (left == null && right == null)
                        return true;
                    return left == right;
                },
                notequal: function (left, right) {
                    if (left == null && right != null || left != null && right == null)
                        return true;
                    if (left == null && right == null)
                        return false;
                    return left != right;
                },
                contains: function (left, right) { return (left != null) && left["indexOf"] && left.indexOf(right) > -1; },
                notcontains: function (left, right) { return (left == null) || !left["indexOf"] || left.indexOf(right) == -1; },
                greater: function (left, right) {
                    if (left == null)
                        return false;
                    if (right == null)
                        return true;
                    return left > right;
                },
                less: function (left, right) {
                    if (right == null)
                        return false;
                    if (left == null)
                        return true;
                    return left < right;
                },
                greaterorequal: function (left, right) {
                    if (left == null && right != null)
                        return false;
                    if (right == null)
                        return true;
                    return left >= right;
                },
                lessorequal: function (left, right) {
                    if (left != null && right == null)
                        return false;
                    if (left == null)
                        return true;
                    return left <= right;
                }
            };
            return Condition.operatorsValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Condition.prototype, "operator", {
        get: function () { return this.opValue; },
        set: function (value) {
            if (!value)
                return;
            value = value.toLowerCase();
            if (!Condition.operators[value])
                return;
            this.opValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Condition.prototype.perform = function (left, right) {
        if (left === void 0) { left = null; }
        if (right === void 0) { right = null; }
        if (!left)
            left = this.left;
        if (!right)
            right = this.right;
        return this.performExplicit(left, right);
    };
    Condition.prototype.performExplicit = function (left, right) {
        return Condition.operators[this.operator](this.getPureValue(left), this.getPureValue(right));
    };
    Condition.prototype.getPureValue = function (val) {
        if (val === undefined)
            return null;
        if (!val || (typeof val != "string"))
            return val;
        var str = "";
        if (val.length > 0 && (val[0] == "'" || val[0] == '"'))
            val = val.substr(1);
        var len = val.length;
        if (len > 0 && (val[len - 1] == "'" || val[len - 1] == '"'))
            val = val.substr(0, len - 1);
        return val;
    };
    return Condition;
}());

Condition.operatorsValue = null;
var ConditionNode = (function () {
    function ConditionNode() {
        this.connectiveValue = "and";
        this.children = [];
    }
    Object.defineProperty(ConditionNode.prototype, "connective", {
        get: function () { return this.connectiveValue; },
        set: function (value) {
            if (!value)
                return;
            value = value.toLowerCase();
            if (value == "&" || value == "&&")
                value = "and";
            if (value == "|" || value == "||")
                value = "or";
            if (value != "and" && value != "or")
                return;
            this.connectiveValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionNode.prototype, "isEmpty", {
        get: function () { return this.children.length == 0; },
        enumerable: true,
        configurable: true
    });
    ConditionNode.prototype.clear = function () {
        this.children = [];
        this.connective = "and";
    };
    return ConditionNode;
}());

var ConditionRunner = (function () {
    function ConditionRunner(expression) {
        this.root = new ConditionNode();
        this.expression = expression;
        this.processValue = new __WEBPACK_IMPORTED_MODULE_1__conditionProcessValue__["a" /* ProcessValue */]();
    }
    Object.defineProperty(ConditionRunner.prototype, "expression", {
        get: function () { return this.expressionValue; },
        set: function (value) {
            if (this.expression == value)
                return;
            this.expressionValue = value;
            new __WEBPACK_IMPORTED_MODULE_0__conditionsParser__["a" /* ConditionsParser */]().parse(this.expressionValue, this.root);
        },
        enumerable: true,
        configurable: true
    });
    ConditionRunner.prototype.run = function (values) {
        this.values = values;
        return this.runNode(this.root);
    };
    ConditionRunner.prototype.runNode = function (node) {
        var onFirstFail = node.connective == "and";
        for (var i = 0; i < node.children.length; i++) {
            var res = this.runNodeCondition(node.children[i]);
            if (!res && onFirstFail)
                return false;
            if (res && !onFirstFail)
                return true;
        }
        return onFirstFail;
    };
    ConditionRunner.prototype.runNodeCondition = function (value) {
        if (value["children"])
            return this.runNode(value);
        if (value["left"])
            return this.runCondition(value);
        return false;
    };
    ConditionRunner.prototype.runCondition = function (condition) {
        var left = condition.left;
        var name = this.getValueName(left);
        if (name) {
            left = this.getValueByName(name);
        }
        var right = condition.right;
        name = this.getValueName(right);
        if (name) {
            right = this.getValueByName(name);
        }
        return condition.performExplicit(left, right);
    };
    ConditionRunner.prototype.getValueByName = function (name) {
        if (!this.processValue.hasValue(name, this.values))
            return null;
        return this.processValue.getValue(name, this.values);
    };
    ConditionRunner.prototype.getValueName = function (nodeValue) {
        if (!nodeValue)
            return null;
        if (typeof nodeValue !== 'string')
            return null;
        if (nodeValue.length < 3 || nodeValue[0] != '{' || nodeValue[nodeValue.length - 1] != '}')
            return null;
        return nodeValue.substr(1, nodeValue.length - 2);
    };
    return ConditionRunner;
}());



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__surveyStrings__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AnswerRequiredError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return RequreNumericError; });
/* unused harmony export ExceedSizeError */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomError; });



var AnswerRequiredError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](AnswerRequiredError, _super);
    function AnswerRequiredError() {
        return _super.call(this) || this;
    }
    AnswerRequiredError.prototype.getText = function () {
        return __WEBPACK_IMPORTED_MODULE_1__surveyStrings__["a" /* surveyLocalization */].getString("requiredError");
    };
    return AnswerRequiredError;
}(__WEBPACK_IMPORTED_MODULE_2__base__["e" /* SurveyError */]));

var RequreNumericError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](RequreNumericError, _super);
    function RequreNumericError() {
        return _super.call(this) || this;
    }
    RequreNumericError.prototype.getText = function () {
        return __WEBPACK_IMPORTED_MODULE_1__surveyStrings__["a" /* surveyLocalization */].getString("numericError");
    };
    return RequreNumericError;
}(__WEBPACK_IMPORTED_MODULE_2__base__["e" /* SurveyError */]));

var ExceedSizeError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](ExceedSizeError, _super);
    function ExceedSizeError(maxSize) {
        var _this = _super.call(this) || this;
        _this.maxSize = maxSize;
        return _this;
    }
    ExceedSizeError.prototype.getText = function () {
        return __WEBPACK_IMPORTED_MODULE_1__surveyStrings__["a" /* surveyLocalization */].getString("exceedMaxSize")["format"](this.getTextSize());
    };
    ExceedSizeError.prototype.getTextSize = function () {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        var fixed = [0, 0, 2, 3, 3];
        if (this.maxSize == 0)
            return '0 Byte';
        var i = Math.floor(Math.log(this.maxSize) / Math.log(1024));
        var value = this.maxSize / Math.pow(1024, i);
        return value.toFixed(fixed[i]) + ' ' + sizes[i];
    };
    return ExceedSizeError;
}(__WEBPACK_IMPORTED_MODULE_2__base__["e" /* SurveyError */]));

var CustomError = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](CustomError, _super);
    function CustomError(text) {
        var _this = _super.call(this) || this;
        _this.text = text;
        return _this;
    }
    CustomError.prototype.getText = function () {
        return this.text;
    };
    return CustomError;
}(__WEBPACK_IMPORTED_MODULE_2__base__["e" /* SurveyError */]));



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocalizableString; });
/**
 * The class represents the string that supports multi-languages and markdown.
 * It uses in all objects where support for multi-languages and markdown is required.
 */
var LocalizableString = (function () {
    function LocalizableString(owner, useMarkdown) {
        if (useMarkdown === void 0) { useMarkdown = false; }
        this.owner = owner;
        this.useMarkdown = useMarkdown;
        this.values = {};
        this.htmlValues = {};
        this.onGetTextCallback = null;
        this.onCreating();
    }
    Object.defineProperty(LocalizableString.prototype, "locale", {
        get: function () { return this.owner ? this.owner.getLocale() : ""; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizableString.prototype, "text", {
        get: function () {
            var res = this.pureText;
            if (this.onGetTextCallback)
                res = this.onGetTextCallback(res);
            return res;
        },
        set: function (value) {
            this.setLocaleText(this.locale, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizableString.prototype, "pureText", {
        get: function () {
            var loc = this.locale;
            if (!loc)
                loc = LocalizableString.defaultLocale;
            var res = this.values[loc];
            if (!res && loc !== LocalizableString.defaultLocale) {
                res = this.values[LocalizableString.defaultLocale];
            }
            if (!res)
                res = "";
            return res;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizableString.prototype, "hasHtml", {
        get: function () {
            return this.hasHtmlValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizableString.prototype, "html", {
        get: function () {
            if (!this.hasHtml)
                return "";
            return this.getHtmlValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizableString.prototype, "textOrHtml", {
        get: function () {
            return this.hasHtml ? this.getHtmlValue() : this.text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LocalizableString.prototype, "renderedHtml", {
        get: function () {
            var res = this.textOrHtml;
            return this.onRenderedHtmlCallback ? this.onRenderedHtmlCallback(res) : res;
        },
        enumerable: true,
        configurable: true
    });
    LocalizableString.prototype.getLocaleText = function (loc) {
        if (!loc)
            loc = LocalizableString.defaultLocale;
        var res = this.values[loc];
        return res ? res : "";
    };
    LocalizableString.prototype.setLocaleText = function (loc, value) {
        if (value == this.getLocaleText(loc))
            return;
        if (!loc)
            loc = LocalizableString.defaultLocale;
        delete this.htmlValues[loc];
        if (!value) {
            if (this.values[loc])
                delete this.values[loc];
        }
        else {
            if (typeof value === 'string') {
                if (loc != LocalizableString.defaultLocale && value == this.getLocaleText(LocalizableString.defaultLocale)) {
                    this.setLocaleText(loc, null);
                }
                else {
                    this.values[loc] = value;
                    if (loc == LocalizableString.defaultLocale) {
                        this.deleteValuesEqualsToDefault(value);
                    }
                }
            }
        }
        this.onChanged();
    };
    LocalizableString.prototype.getJson = function () {
        var keys = Object.keys(this.values);
        if (keys.length == 0)
            return null;
        if (keys.length == 1 && keys[0] == LocalizableString.defaultLocale)
            return this.values[keys[0]];
        return this.values;
    };
    LocalizableString.prototype.setJson = function (value) {
        this.values = {};
        this.htmlValues = {};
        if (!value)
            return;
        if (typeof value === 'string') {
            this.setLocaleText(null, value);
        }
        else {
            for (var key in value) {
                this.setLocaleText(key, value[key]);
            }
        }
        this.onChanged();
    };
    LocalizableString.prototype.onChanged = function () { };
    LocalizableString.prototype.onCreating = function () { };
    LocalizableString.prototype.hasHtmlValue = function () {
        if (!this.owner || !this.useMarkdown)
            return false;
        var text = this.text;
        if (!text)
            return false;
        var loc = this.locale;
        if (!loc)
            loc = LocalizableString.defaultLocale;
        if (!(loc in this.htmlValues)) {
            this.htmlValues[loc] = this.owner.getMarkdownHtml(text);
        }
        return this.htmlValues[loc] ? true : false;
    };
    LocalizableString.prototype.getHtmlValue = function () {
        var loc = this.locale;
        if (!loc)
            loc = LocalizableString.defaultLocale;
        return this.htmlValues[loc];
    };
    LocalizableString.prototype.deleteValuesEqualsToDefault = function (defaultValue) {
        var keys = Object.keys(this.values);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == LocalizableString.defaultLocale)
                continue;
            if (this.values[keys[i]] == defaultValue)
                delete this.values[keys[i]];
        }
    };
    return LocalizableString;
}());

LocalizableString.defaultLocale = "default";


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProcessValue; });
var ProcessValue = (function () {
    function ProcessValue() {
    }
    ProcessValue.prototype.getFirstName = function (text) {
        if (!text)
            return text;
        var res = "";
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch == '.' || ch == '[')
                break;
            res += ch;
        }
        return res;
    };
    ProcessValue.prototype.hasValue = function (text, values) {
        var res = this.getValueCore(text, values);
        return res.hasValue;
    };
    ProcessValue.prototype.getValue = function (text, values) {
        var res = this.getValueCore(text, values);
        return res.value;
    };
    ProcessValue.prototype.getValueCore = function (text, values) {
        var res = { hasValue: false, value: null };
        var curValue = values;
        if (!curValue)
            return res;
        var isFirst = true;
        while (text && text.length > 0) {
            var isArray = !isFirst && text[0] == '[';
            if (!isArray) {
                if (!isFirst)
                    text = text.substr(1);
                var curName = this.getFirstName(text);
                if (!curName)
                    return res;
                if (!curValue[curName])
                    return res;
                curValue = curValue[curName];
                text = text.substr(curName.length);
            }
            else {
                if (!Array.isArray(curValue))
                    return res;
                var index = 1;
                var str = "";
                while (index < text.length && text[index] != ']') {
                    str += text[index];
                    index++;
                }
                text = index < text.length ? text.substr(index + 1) : "";
                index = this.getIntValue(str);
                if (index < 0 || index >= curValue.length)
                    return res;
                curValue = curValue[index];
            }
            isFirst = false;
        }
        res.value = curValue;
        res.hasValue = true;
        return res;
    };
    ProcessValue.prototype.getIntValue = function (str) {
        if (str == "0" || ((str | 0) > 0 && str % 1 == 0))
            return Number(str);
        return -1;
    };
    return ProcessValue;
}());



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactsurveymodel__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reactpage__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__reactSurveyNavigation__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__reactquestionfactory__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__defaultCss_cssstandard__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__reactSurveyProgress__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__reactquestionelement__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Survey; });










var Survey = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](Survey, _super);
    function Survey(props) {
        var _this = _super.call(this, props) || this;
        _this.isCurrentPageChanged = false;
        _this.updateSurvey(props);
        return _this;
    }
    Object.defineProperty(Survey, "cssType", {
        get: function () { return __WEBPACK_IMPORTED_MODULE_6__defaultCss_cssstandard__["a" /* surveyCss */].currentType; },
        set: function (value) { __WEBPACK_IMPORTED_MODULE_6__defaultCss_cssstandard__["a" /* surveyCss */].currentType = value; },
        enumerable: true,
        configurable: true
    });
    Survey.prototype.componentWillReceiveProps = function (nextProps) {
        this.updateSurvey(nextProps);
    };
    Survey.prototype.componentDidUpdate = function () {
        if (this.isCurrentPageChanged) {
            this.isCurrentPageChanged = false;
            if (this.survey.focusFirstQuestionAutomatic) {
                this.survey.focusFirstQuestion();
            }
        }
    };
    Survey.prototype.componentDidMount = function () {
        var el = this.refs["root"];
        if (el && this.survey)
            this.survey.doAfterRenderSurvey(el);
    };
    Survey.prototype.render = function () {
        if (this.survey.state == "completed")
            return this.renderCompleted();
        if (this.survey.state == "loading")
            return this.renderLoading();
        return this.renderSurvey();
    };
    Object.defineProperty(Survey.prototype, "css", {
        get: function () { return __WEBPACK_IMPORTED_MODULE_6__defaultCss_cssstandard__["a" /* surveyCss */].getCss(); },
        set: function (value) {
            this.survey.mergeCss(value, this.css);
        },
        enumerable: true,
        configurable: true
    });
    Survey.prototype.renderCompleted = function () {
        if (!this.survey.showCompletedPage)
            return null;
        var htmlValue = { __html: this.survey.processedCompletedHtml };
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { dangerouslySetInnerHTML: htmlValue }));
    };
    Survey.prototype.renderLoading = function () {
        var htmlValue = { __html: this.survey.processedLoadingHtml };
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { dangerouslySetInnerHTML: htmlValue }));
    };
    Survey.prototype.renderSurvey = function () {
        var title = this.survey.title && this.survey.showTitle ? this.renderTitle() : null;
        var currentPage = this.survey.currentPage ? this.renderPage() : null;
        var topProgress = this.survey.showProgressBar == "top" ? this.renderProgress(true) : null;
        var bottomProgress = this.survey.showProgressBar == "bottom" ? this.renderProgress(false) : null;
        var buttons = (currentPage && this.survey.showNavigationButtons) ? this.renderNavigation() : null;
        if (!currentPage) {
            currentPage = this.renderEmptySurvey();
        }
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: "root", className: this.css.root },
            title,
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { id: __WEBPACK_IMPORTED_MODULE_8__base__["a" /* SurveyPageId */], className: this.css.body },
                topProgress,
                currentPage,
                bottomProgress),
            buttons));
    };
    Survey.prototype.renderTitle = function () {
        var title = __WEBPACK_IMPORTED_MODULE_9__reactquestionelement__["a" /* SurveyElementBase */].renderLocString(this.survey.locTitle);
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.header },
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("h3", null, title));
    };
    Survey.prototype.renderPage = function () {
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__reactpage__["a" /* SurveyPage */], { survey: this.survey, page: this.survey.currentPage, css: this.css, creator: this });
    };
    Survey.prototype.renderProgress = function (isTop) {
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7__reactSurveyProgress__["a" /* SurveyProgress */], { survey: this.survey, css: this.css, isTop: isTop });
    };
    Survey.prototype.renderNavigation = function () {
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__reactSurveyNavigation__["a" /* SurveyNavigation */], { survey: this.survey, css: this.css });
    };
    Survey.prototype.renderEmptySurvey = function () {
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("span", null, this.survey.emptySurveyText));
    };
    Survey.prototype.updateSurvey = function (newProps) {
        if (newProps) {
            if (newProps.model) {
                this.survey = newProps.model;
            }
            else {
                if (newProps.json) {
                    this.survey = new __WEBPACK_IMPORTED_MODULE_2__reactsurveymodel__["a" /* ReactSurveyModel */](newProps.json);
                }
            }
        }
        else {
            this.survey = new __WEBPACK_IMPORTED_MODULE_2__reactsurveymodel__["a" /* ReactSurveyModel */]();
        }
        if (newProps) {
            if (newProps.clientId)
                this.survey.clientId = newProps.clientId;
            if (newProps.data)
                this.survey.data = newProps.data;
            if (newProps.css)
                this.survey.mergeCss(newProps.css, this.css);
        }
        //set the first page
        var dummy = this.survey.currentPage;
        this.state = { pageIndexChange: 0, isCompleted: false, modelChanged: 0 };
        this.setSurveyEvents(newProps);
    };
    Survey.prototype.setSurveyEvents = function (newProps) {
        var self = this;
        this.survey.renderCallback = function () {
            self.state.modelChanged = self.state.modelChanged + 1;
            self.setState(self.state);
        };
        this.survey.onComplete.add(function (sender) { self.state.isCompleted = true; self.setState(self.state); });
        this.survey.onPartialSend.add(function (sender) { self.setState(self.state); });
        this.survey.onCurrentPageChanged.add(function (sender, options) {
            self.isCurrentPageChanged = true;
            self.state.pageIndexChange = self.state.pageIndexChange + 1;
            self.setState(self.state);
            if (newProps && newProps.onCurrentPageChanged)
                newProps.onCurrentPageChanged(sender, options);
        });
        this.survey.onVisibleChanged.add(function (sender, options) {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.visible = options.question.visible;
                options.question.react.setState(state);
            }
        });
        this.survey.onValueChanged.add(function (sender, options) {
            if (options.question && options.question.react) {
                var state = options.question.react.state;
                state.value = options.value;
                options.question.react.setState(state);
            }
        });
        if (!newProps)
            return;
        this.survey.onValueChanged.add(function (sender, options) {
            if (newProps.data)
                newProps.data[options.name] = options.value;
            if (newProps.onValueChanged)
                newProps.onValueChanged(sender, options);
        });
        if (newProps.onComplete) {
            this.survey.onComplete.add(function (sender) { newProps.onComplete(sender); });
        }
        if (newProps.onPartialSend) {
            this.survey.onPartialSend.add(function (sender) { newProps.onPartialSend(sender); });
        }
        this.survey.onPageVisibleChanged.add(function (sender, options) { if (newProps.onPageVisibleChanged)
            newProps.onPageVisibleChanged(sender, options); });
        if (newProps.onServerValidateQuestions) {
            this.survey.onServerValidateQuestions = newProps.onServerValidateQuestions;
        }
        if (newProps.onQuestionAdded) {
            this.survey.onQuestionAdded.add(function (sender, options) { newProps.onQuestionAdded(sender, options); });
        }
        if (newProps.onQuestionRemoved) {
            this.survey.onQuestionRemoved.add(function (sender, options) { newProps.onQuestionRemoved(sender, options); });
        }
        if (newProps.onValidateQuestion) {
            this.survey.onValidateQuestion.add(function (sender, options) { newProps.onValidateQuestion(sender, options); });
        }
        if (newProps.onSendResult) {
            this.survey.onSendResult.add(function (sender, options) { newProps.onSendResult(sender, options); });
        }
        if (newProps.onGetResult) {
            this.survey.onGetResult.add(function (sender, options) { newProps.onGetResult(sender, options); });
        }
        if (newProps.onProcessHtml) {
            this.survey.onProcessHtml.add(function (sender, options) { newProps.onProcessHtml(sender, options); });
        }
        if (newProps.onAfterRenderSurvey) {
            this.survey.onAfterRenderSurvey.add(function (sender, options) { newProps.onAfterRenderSurvey(sender, options); });
        }
        if (newProps.onAfterRenderPage) {
            this.survey.onAfterRenderPage.add(function (sender, options) { newProps.onAfterRenderPage(sender, options); });
        }
        if (newProps.onAfterRenderQuestion) {
            this.survey.onAfterRenderQuestion.add(function (sender, options) { newProps.onAfterRenderQuestion(sender, options); });
        }
        if (newProps.onTextMarkdown) {
            this.survey.onTextMarkdown.add(function (sender, options) { newProps.onTextMarkdown(sender, options); });
        }
    };
    //ISurveyCreator
    Survey.prototype.createQuestionElement = function (question) {
        var questionCss = this.css[question.getType()];
        return __WEBPACK_IMPORTED_MODULE_5__reactquestionfactory__["a" /* ReactQuestionFactory */].Instance.createQuestion(question.getType(), {
            question: question, css: questionCss, rootCss: this.css, isDisplayMode: question.isReadOnly, creator: this
        });
    };
    Survey.prototype.renderError = function (key, errorText) {
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { key: key, className: this.css.error.item }, errorText);
    };
    Survey.prototype.questionTitleLocation = function () { return this.survey.questionTitleLocation; };
    return Survey;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyNavigationBase; });


var SurveyNavigationBase = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyNavigationBase, _super);
    function SurveyNavigationBase(props) {
        var _this = _super.call(this, props) || this;
        _this.updateStateFunction = null;
        _this.survey = props.survey;
        _this.css = props.css;
        _this.state = { update: 0 };
        return _this;
    }
    SurveyNavigationBase.prototype.componentWillReceiveProps = function (nextProps) {
        this.survey = nextProps.survey;
        this.css = nextProps.css;
    };
    SurveyNavigationBase.prototype.componentDidMount = function () {
        if (this.survey) {
            var self = this;
            this.updateStateFunction = function () {
                self.state.update = self.state.update + 1;
                self.setState(self.state);
            };
            this.survey.onPageVisibleChanged.add(this.updateStateFunction);
        }
    };
    SurveyNavigationBase.prototype.componentWillUnmount = function () {
        if (this.survey && this.updateStateFunction) {
            this.survey.onPageVisibleChanged.remove(this.updateStateFunction);
            this.updateStateFunction = null;
        }
    };
    return SurveyNavigationBase;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReactQuestionFactory; });
var ReactQuestionFactory = (function () {
    function ReactQuestionFactory() {
        this.creatorHash = {};
    }
    ReactQuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
        this.creatorHash[questionType] = questionCreator;
    };
    ReactQuestionFactory.prototype.getAllTypes = function () {
        var result = new Array();
        for (var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    };
    ReactQuestionFactory.prototype.createQuestion = function (questionType, params) {
        var creator = this.creatorHash[questionType];
        if (creator == null)
            return null;
        return creator(params);
    };
    return ReactQuestionFactory;
}());

ReactQuestionFactory.Instance = new ReactQuestionFactory();


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TextPreProcessorItem */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextPreProcessor; });
var TextPreProcessorItem = (function () {
    function TextPreProcessorItem() {
    }
    return TextPreProcessorItem;
}());

var TextPreProcessor = (function () {
    function TextPreProcessor() {
    }
    TextPreProcessor.prototype.process = function (text) {
        if (!text)
            return text;
        if (!this.onProcess)
            return text;
        var items = this.getItems(text);
        for (var i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            var name = this.getName(text.substring(item.start + 1, item.end));
            if (!this.canProcessName(name))
                continue;
            if (this.onHasValue && !this.onHasValue(name))
                continue;
            var value = this.onProcess(name);
            if (value == null)
                value = "";
            text = text.substr(0, item.start) + value + text.substr(item.end + 1);
        }
        return text;
    };
    TextPreProcessor.prototype.getItems = function (text) {
        var items = [];
        var length = text.length;
        var start = -1;
        var ch = '';
        for (var i = 0; i < length; i++) {
            ch = text[i];
            if (ch == '{')
                start = i;
            if (ch == '}') {
                if (start > -1) {
                    var item = new TextPreProcessorItem();
                    item.start = start;
                    item.end = i;
                    items.push(item);
                }
                start = -1;
            }
        }
        return items;
    };
    TextPreProcessor.prototype.getName = function (name) {
        if (!name)
            return;
        return name.trim();
    };
    TextPreProcessor.prototype.canProcessName = function (name) {
        if (!name)
            return false;
        for (var i = 0; i < name.length; i++) {
            var ch = name[i];
            //TODO
            if (ch == ' ' || ch == '-' || ch == '&')
                return false;
        }
        return true;
    };
    return TextPreProcessor;
}());



/***/ }),
/* 15 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: E:\\SGE\\surveyjs\\node_modules\\ts-loader\\index.js??ref--0!E:\\SGE\\surveyjs\\src\\entries\\react.ts Duplicate export 'defaultBootstrapCss' (12:9)\nYou may need an appropriate loader to handle this file type.\n| export { defaultBootstrapCss } from \"../defaultCss/cssbootstrap\";\r\n| // css Forndation\r\n| export { defaultBootstrapCss } from \"../defaultCss/cssbootstrap\";\r\n| // css bootstrap + material\r\n| export { defaultBootstrapMaterialCss } from \"../defaultCss/cssbootstrapmaterial\";\r");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

!function(global, factory) {
     true ? factory(exports) : 'function' == typeof define && define.amd ? define([ 'exports' ], factory) : factory(global.preact = global.preact || {});
}(this, function(exports) {
    function VNode(nodeName, attributes, children) {
        this.nodeName = nodeName;
        this.attributes = attributes;
        this.children = children;
        this.key = attributes && attributes.key;
    }
    function h(nodeName, attributes) {
        var children, lastSimple, child, simple, i;
        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);
        if (attributes && attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) if ((child = stack.pop()) instanceof Array) for (i = child.length; i--; ) stack.push(child[i]); else if (null != child && child !== !0 && child !== !1) {
            if ('number' == typeof child) child = String(child);
            simple = 'string' == typeof child;
            if (simple && lastSimple) children[children.length - 1] += child; else {
                (children || (children = [])).push(child);
                lastSimple = simple;
            }
        }
        var p = new VNode(nodeName, attributes || void 0, children || EMPTY_CHILDREN);
        if (options.vnode) options.vnode(p);
        return p;
    }
    function extend(obj, props) {
        if (props) for (var i in props) obj[i] = props[i];
        return obj;
    }
    function clone(obj) {
        return extend({}, obj);
    }
    function delve(obj, key) {
        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) obj = obj[p[i]];
        return obj;
    }
    function isFunction(obj) {
        return 'function' == typeof obj;
    }
    function isString(obj) {
        return 'string' == typeof obj;
    }
    function hashToClassName(c) {
        var str = '';
        for (var prop in c) if (c[prop]) {
            if (str) str += ' ';
            str += prop;
        }
        return str;
    }
    function cloneElement(vnode, props) {
        return h(vnode.nodeName, extend(clone(vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }
    function createLinkedState(component, key, eventPath) {
        var path = key.split('.');
        return function(e) {
            var t = e && e.target || this, state = {}, obj = state, v = isString(eventPath) ? delve(e, eventPath) : t.nodeName ? t.type.match(/^che|rad/) ? t.checked : t.value : e, i = 0;
            for (;i < path.length - 1; i++) obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
            obj[path[i]] = v;
            component.setState(state);
        };
    }
    function enqueueRender(component) {
        if (!component._dirty && (component._dirty = !0) && 1 == items.push(component)) (options.debounceRendering || defer)(rerender);
    }
    function rerender() {
        var p, list = items;
        items = [];
        while (p = list.pop()) if (p._dirty) renderComponent(p);
    }
    function isFunctionalComponent(vnode) {
        var nodeName = vnode && vnode.nodeName;
        return nodeName && isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
    }
    function buildFunctionalComponent(vnode, context) {
        return vnode.nodeName(getNodeProps(vnode), context || EMPTY);
    }
    function isSameNodeType(node, vnode) {
        if (isString(vnode)) return node instanceof Text;
        if (isString(vnode.nodeName)) return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
        if (isFunction(vnode.nodeName)) return (node._componentConstructor ? node._componentConstructor === vnode.nodeName : !0) || isFunctionalComponent(vnode); else ;
    }
    function isNamedNode(node, nodeName) {
        return node.normalizedNodeName === nodeName || toLowerCase(node.nodeName) === toLowerCase(nodeName);
    }
    function getNodeProps(vnode) {
        var props = clone(vnode.attributes);
        props.children = vnode.children;
        var defaultProps = vnode.nodeName.defaultProps;
        if (defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];
        return props;
    }
    function removeNode(node) {
        var p = node.parentNode;
        if (p) p.removeChild(node);
    }
    function setAccessor(node, name, old, value, isSvg) {
        if ('className' === name) name = 'class';
        if ('class' === name && value && 'object' == typeof value) value = hashToClassName(value);
        if ('key' === name) ; else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {
            if (!value || isString(value) || isString(old)) node.style.cssText = value || '';
            if (value && 'object' == typeof value) {
                if (!isString(old)) for (var i in old) if (!(i in value)) node.style[i] = '';
                for (var i in value) node.style[i] = 'number' == typeof value[i] && !NON_DIMENSION_PROPS[i] ? value[i] + 'px' : value[i];
            }
        } else if ('dangerouslySetInnerHTML' === name) {
            if (value) node.innerHTML = value.__html || '';
        } else if ('o' == name[0] && 'n' == name[1]) {
            var l = node._listeners || (node._listeners = {});
            name = toLowerCase(name.substring(2));
            if (value) {
                if (!l[name]) node.addEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            } else if (l[name]) node.removeEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            l[name] = value;
        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {
            setProperty(node, name, null == value ? '' : value);
            if (null == value || value === !1) node.removeAttribute(name);
        } else {
            var ns = isSvg && name.match(/^xlink\:?(.+)/);
            if (null == value || value === !1) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1])); else node.removeAttribute(name); else if ('object' != typeof value && !isFunction(value)) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1]), value); else node.setAttribute(name, value);
        }
    }
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }
    function eventProxy(e) {
        return this._listeners[e.type](options.event && options.event(e) || e);
    }
    function collectNode(node) {
        removeNode(node);
        if (node instanceof Element) {
            node._component = node._componentConstructor = null;
            var _name = node.normalizedNodeName || toLowerCase(node.nodeName);
            (nodes[_name] || (nodes[_name] = [])).push(node);
        }
    }
    function createNode(nodeName, isSvg) {
        var name = toLowerCase(nodeName), node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
        node.normalizedNodeName = name;
        return node;
    }
    function flushMounts() {
        var c;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }
    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        if (!diffLevel++) {
            isSvgMode = parent && 'undefined' != typeof parent.ownerSVGElement;
            hydrating = dom && !(ATTR_KEY in dom);
        }
        var ret = idiff(dom, vnode, context, mountAll);
        if (parent && ret.parentNode !== parent) parent.appendChild(ret);
        if (!--diffLevel) {
            hydrating = !1;
            if (!componentRoot) flushMounts();
        }
        return ret;
    }
    function idiff(dom, vnode, context, mountAll) {
        var ref = vnode && vnode.attributes && vnode.attributes.ref;
        while (isFunctionalComponent(vnode)) vnode = buildFunctionalComponent(vnode, context);
        if (null == vnode) vnode = '';
        if (isString(vnode)) {
            if (dom && dom instanceof Text && dom.parentNode) {
                if (dom.nodeValue != vnode) dom.nodeValue = vnode;
            } else {
                if (dom) recollectNodeTree(dom);
                dom = document.createTextNode(vnode);
            }
            return dom;
        }
        if (isFunction(vnode.nodeName)) return buildComponentFromVNode(dom, vnode, context, mountAll);
        var out = dom, nodeName = String(vnode.nodeName), prevSvgMode = isSvgMode, vchildren = vnode.children;
        isSvgMode = 'svg' === nodeName ? !0 : 'foreignObject' === nodeName ? !1 : isSvgMode;
        if (!dom) out = createNode(nodeName, isSvgMode); else if (!isNamedNode(dom, nodeName)) {
            out = createNode(nodeName, isSvgMode);
            while (dom.firstChild) out.appendChild(dom.firstChild);
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
            recollectNodeTree(dom);
        }
        var fc = out.firstChild, props = out[ATTR_KEY];
        if (!props) {
            out[ATTR_KEY] = props = {};
            for (var a = out.attributes, i = a.length; i--; ) props[a[i].name] = a[i].value;
        }
        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && fc && fc instanceof Text && !fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];
        } else if (vchildren && vchildren.length || fc) innerDiffNode(out, vchildren, context, mountAll, !!props.dangerouslySetInnerHTML);
        diffAttributes(out, vnode.attributes, props);
        if (ref) (props.ref = ref)(out);
        isSvgMode = prevSvgMode;
        return out;
    }
    function innerDiffNode(dom, vchildren, context, mountAll, absorb) {
        var j, c, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren && vchildren.length;
        if (len) for (var i = 0; i < len; i++) {
            var _child = originalChildren[i], props = _child[ATTR_KEY], key = vlen ? (c = _child._component) ? c.__key : props ? props.key : null : null;
            if (null != key) {
                keyedLen++;
                keyed[key] = _child;
            } else if (hydrating || absorb || props || _child instanceof Text) children[childrenLen++] = _child;
        }
        if (vlen) for (var i = 0; i < vlen; i++) {
            vchild = vchildren[i];
            child = null;
            var key = vchild.key;
            if (null != key) {
                if (keyedLen && key in keyed) {
                    child = keyed[key];
                    keyed[key] = void 0;
                    keyedLen--;
                }
            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) {
                c = children[j];
                if (c && isSameNodeType(c, vchild)) {
                    child = c;
                    children[j] = void 0;
                    if (j === childrenLen - 1) childrenLen--;
                    if (j === min) min++;
                    break;
                }
            }
            child = idiff(child, vchild, context, mountAll);
            if (child && child !== dom) if (i >= len) dom.appendChild(child); else if (child !== originalChildren[i]) {
                if (child === originalChildren[i + 1]) removeNode(originalChildren[i]);
                dom.insertBefore(child, originalChildren[i] || null);
            }
        }
        if (keyedLen) for (var i in keyed) if (keyed[i]) recollectNodeTree(keyed[i]);
        while (min <= childrenLen) {
            child = children[childrenLen--];
            if (child) recollectNodeTree(child);
        }
    }
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        if (component) unmountComponent(component, !unmountOnly); else {
            if (node[ATTR_KEY] && node[ATTR_KEY].ref) node[ATTR_KEY].ref(null);
            if (!unmountOnly) collectNode(node);
            var c;
            while (c = node.lastChild) recollectNodeTree(c, unmountOnly);
        }
    }
    function diffAttributes(dom, attrs, old) {
        var name;
        for (name in old) if (!(attrs && name in attrs) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);
        if (attrs) for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    }
    function collectComponent(component) {
        var name = component.constructor.name, list = components[name];
        if (list) list.push(component); else components[name] = [ component ];
    }
    function createComponent(Ctor, props, context) {
        var inst = new Ctor(props, context), list = components[Ctor.name];
        Component.call(inst, props, context);
        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {
            inst.nextBase = list[i].nextBase;
            list.splice(i, 1);
            break;
        }
        return inst;
    }
    function setComponentProps(component, props, opts, context, mountAll) {
        if (!component._disable) {
            component._disable = !0;
            if (component.__ref = props.ref) delete props.ref;
            if (component.__key = props.key) delete props.key;
            if (!component.base || mountAll) {
                if (component.componentWillMount) component.componentWillMount();
            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);
            if (context && context !== component.context) {
                if (!component.prevContext) component.prevContext = component.context;
                component.context = context;
            }
            if (!component.prevProps) component.prevProps = component.props;
            component.props = props;
            component._disable = !1;
            if (0 !== opts) if (1 === opts || options.syncComponentUpdates !== !1 || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);
            if (component.__ref) component.__ref(component);
        }
    }
    function renderComponent(component, opts, mountAll, isChild) {
        if (!component._disable) {
            var skip, rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.prevProps || props, previousState = component.prevState || state, previousContext = component.prevContext || context, isUpdate = component.base, nextBase = component.nextBase, initialBase = isUpdate || nextBase, initialChildComponent = component._component;
            if (isUpdate) {
                component.props = previousProps;
                component.state = previousState;
                component.context = previousContext;
                if (2 !== opts && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === !1) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);
                component.props = props;
                component.state = state;
                component.context = context;
            }
            component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
            component._dirty = !1;
            if (!skip) {
                if (component.render) rendered = component.render(props, state, context);
                if (component.getChildContext) context = extend(clone(context), component.getChildContext());
                while (isFunctionalComponent(rendered)) rendered = buildFunctionalComponent(rendered, context);
                var toUnmount, base, childComponent = rendered && rendered.nodeName;
                if (isFunction(childComponent)) {
                    var childProps = getNodeProps(rendered);
                    inst = initialChildComponent;
                    if (inst && inst.constructor === childComponent && childProps.key == inst.__key) setComponentProps(inst, childProps, 1, context); else {
                        toUnmount = inst;
                        inst = createComponent(childComponent, childProps, context);
                        inst.nextBase = inst.nextBase || nextBase;
                        inst._parentComponent = component;
                        component._component = inst;
                        setComponentProps(inst, childProps, 0, context);
                        renderComponent(inst, 1, mountAll, !0);
                    }
                    base = inst.base;
                } else {
                    cbase = initialBase;
                    toUnmount = initialChildComponent;
                    if (toUnmount) cbase = component._component = null;
                    if (initialBase || 1 === opts) {
                        if (cbase) cbase._component = null;
                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);
                    }
                }
                if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                    var baseParent = initialBase.parentNode;
                    if (baseParent && base !== baseParent) {
                        baseParent.replaceChild(base, initialBase);
                        if (!toUnmount) {
                            initialBase._component = null;
                            recollectNodeTree(initialBase);
                        }
                    }
                }
                if (toUnmount) unmountComponent(toUnmount, base !== initialBase);
                component.base = base;
                if (base && !isChild) {
                    var componentRef = component, t = component;
                    while (t = t._parentComponent) (componentRef = t).base = base;
                    base._component = componentRef;
                    base._componentConstructor = componentRef.constructor;
                }
            }
            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {
                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);
                if (options.afterUpdate) options.afterUpdate(component);
            }
            var fn, cb = component._renderCallbacks;
            if (cb) while (fn = cb.pop()) fn.call(component);
            if (!diffLevel && !isChild) flushMounts();
        }
    }
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);
        while (c && !isOwner && (c = c._parentComponent)) isOwner = c.constructor === vnode.nodeName;
        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, 3, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent, !0);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.nextBase) {
                c.nextBase = dom;
                oldDom = null;
            }
            setComponentProps(c, props, 1, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom);
            }
        }
        return dom;
    }
    function unmountComponent(component, remove) {
        if (options.beforeUnmount) options.beforeUnmount(component);
        var base = component.base;
        component._disable = !0;
        if (component.componentWillUnmount) component.componentWillUnmount();
        component.base = null;
        var inner = component._component;
        if (inner) unmountComponent(inner, remove); else if (base) {
            if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null);
            component.nextBase = base;
            if (remove) {
                removeNode(base);
                collectComponent(component);
            }
            var c;
            while (c = base.lastChild) recollectNodeTree(c, !remove);
        }
        if (component.__ref) component.__ref(null);
        if (component.componentDidUnmount) component.componentDidUnmount();
    }
    function Component(props, context) {
        this._dirty = !0;
        this.context = context;
        this.props = props;
        if (!this.state) this.state = {};
    }
    function render(vnode, parent, merge) {
        return diff(merge, vnode, {}, !1, parent);
    }
    var options = {};
    var stack = [];
    var EMPTY_CHILDREN = [];
    var lcCache = {};
    var toLowerCase = function(s) {
        return lcCache[s] || (lcCache[s] = s.toLowerCase());
    };
    var resolved = 'undefined' != typeof Promise && Promise.resolve();
    var defer = resolved ? function(f) {
        resolved.then(f);
    } : setTimeout;
    var EMPTY = {};
    var ATTR_KEY = 'undefined' != typeof Symbol ? Symbol.for('preactattr') : '__preactattr_';
    var NON_DIMENSION_PROPS = {
        boxFlex: 1,
        boxFlexGroup: 1,
        columnCount: 1,
        fillOpacity: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        fontWeight: 1,
        lineClamp: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        strokeOpacity: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1
    };
    var NON_BUBBLING_EVENTS = {
        blur: 1,
        error: 1,
        focus: 1,
        load: 1,
        resize: 1,
        scroll: 1
    };
    var items = [];
    var nodes = {};
    var mounts = [];
    var diffLevel = 0;
    var isSvgMode = !1;
    var hydrating = !1;
    var components = {};
    extend(Component.prototype, {
        linkState: function(key, eventPath) {
            var c = this._linkedStates || (this._linkedStates = {});
            return c[key + eventPath] || (c[key + eventPath] = createLinkedState(this, key, eventPath));
        },
        setState: function(state, callback) {
            var s = this.state;
            if (!this.prevState) this.prevState = clone(s);
            extend(s, isFunction(state) ? state(s, this.props) : state);
            if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
            enqueueRender(this);
        },
        forceUpdate: function() {
            renderComponent(this, 2);
        },
        render: function() {}
    });
    exports.h = h;
    exports.cloneElement = cloneElement;
    exports.Component = Component;
    exports.render = render;
    exports.rerender = rerender;
    exports.options = options;
});
//# sourceMappingURL=preact.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.PropTypes = mod.exports;
  }
})(this, function (exports, module) {

  'use strict';

  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

  var ReactElement = {};

  ReactElement.isValidElement = function (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  var ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };

  var emptyFunction = {
    thatReturns: function thatReturns(what) {
      return function () {
        return what;
      };
    }
  };

  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  var ANONYMOUS = '<<anonymous>>';

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  function createChainableTypeChecker(validate) {
    function checkType(isRequired, props, propName, componentName, location, propFullName) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;
      if (props[propName] == null) {
        var locationName = ReactPropTypeLocationNames[location];
        if (isRequired) {
          return new Error('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        var locationName = ReactPropTypeLocationNames[location];

        var preciseType = getPreciseType(propValue);

        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturns(null));
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var locationName = ReactPropTypeLocationNames[location];
        var propType = getPropType(propValue);
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']');
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!ReactElement.isValidElement(props[propName])) {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var locationName = ReactPropTypeLocationNames[location];
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      return createChainableTypeChecker(function () {
        return new Error('Invalid argument supplied to oneOf, expected an instance of array.');
      });
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (propValue === expectedValues[i]) {
          return null;
        }
      }

      var locationName = ReactPropTypeLocationNames[location];
      var valuesString = JSON.stringify(expectedValues);
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      return createChainableTypeChecker(function () {
        return new Error('Invalid argument supplied to oneOfType, expected an instance of array.');
      });
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName) == null) {
          return null;
        }
      }

      var locationName = ReactPropTypeLocationNames[location];
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || ReactElement.isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    if (propType === 'symbol') {
      return true;
    }

    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  function getPreciseType(propValue) {
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  module.exports = ReactPropTypes;
});

//# sourceMappingURL=index.js.map

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__conditions__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConditionsParser; });

var ConditionsParser = (function () {
    function ConditionsParser() {
    }
    ConditionsParser.prototype.parse = function (text, root) {
        this.text = text;
        this.root = root;
        this.root.clear();
        this.at = 0;
        this.length = this.text.length;
        var res = this.parseText();
        return res;
    };
    ConditionsParser.prototype.toString = function (root) {
        this.root = root;
        return this.nodeToString(root);
    };
    ConditionsParser.prototype.toStringCore = function (value) {
        if (!value)
            return "";
        if (value["children"])
            return this.nodeToString(value);
        if (value["left"])
            return this.conditionToString(value);
        return "";
    };
    ConditionsParser.prototype.nodeToString = function (node) {
        if (node.isEmpty)
            return "";
        var res = "";
        for (var i = 0; i < node.children.length; i++) {
            var nodeText = this.toStringCore(node.children[i]);
            if (nodeText) {
                if (res)
                    res += ' ' + node.connective + ' ';
                res += nodeText;
            }
        }
        if (node != this.root && node.children.length > 1) {
            res = '(' + res + ')';
        }
        return res;
    };
    ConditionsParser.prototype.conditionToString = function (condition) {
        if (!condition.right || !condition.operator)
            return "";
        var left = condition.left;
        if (left && !this.isNumeric(left))
            left = "'" + left + "'";
        var res = left + ' ' + this.operationToString(condition.operator);
        if (this.isNoRightOperation(condition.operator))
            return res;
        var right = condition.right;
        if (right && !this.isNumeric(right))
            right = "'" + right + "'";
        return res + ' ' + right;
    };
    ConditionsParser.prototype.operationToString = function (op) {
        if (op == "equal")
            return "=";
        if (op == "notequal")
            return "!=";
        if (op == "greater")
            return ">";
        if (op == "less")
            return "<";
        if (op == "greaterorequal")
            return ">=";
        if (op == "lessorequal")
            return "<=";
        return op;
    };
    ConditionsParser.prototype.isNumeric = function (value) {
        var val = parseFloat(value);
        if (isNaN(val))
            return false;
        return isFinite(val);
    };
    ConditionsParser.prototype.parseText = function () {
        this.node = this.root;
        this.expressionNodes = [];
        this.expressionNodes.push(this.node);
        var res = this.readConditions();
        return res && this.at >= this.length;
    };
    ConditionsParser.prototype.readConditions = function () {
        var res = this.readCondition();
        if (!res)
            return res;
        var connective = this.readConnective();
        if (connective) {
            this.addConnective(connective);
            return this.readConditions();
        }
        return true;
    };
    ConditionsParser.prototype.readCondition = function () {
        var expRes = this.readExpression();
        if (expRes < 0)
            return false;
        if (expRes == 1)
            return true;
        var left = this.readString();
        if (!left)
            return false;
        var op = this.readOperator();
        if (!op)
            return false;
        var c = new __WEBPACK_IMPORTED_MODULE_0__conditions__["b" /* Condition */]();
        c.left = left;
        c.operator = op;
        if (!this.isNoRightOperation(op)) {
            var right = this.readString();
            if (!right)
                return false;
            c.right = right;
        }
        this.addCondition(c);
        return true;
    };
    ConditionsParser.prototype.readExpression = function () {
        this.skip();
        if (this.at >= this.length || this.ch != '(')
            return 0;
        this.at++;
        this.pushExpression();
        var res = this.readConditions();
        if (res) {
            this.skip();
            res = this.ch == ')';
            this.at++;
            this.popExpression();
            return 1;
        }
        return -1;
    };
    Object.defineProperty(ConditionsParser.prototype, "ch", {
        get: function () { return this.text.charAt(this.at); },
        enumerable: true,
        configurable: true
    });
    ConditionsParser.prototype.skip = function () {
        while (this.at < this.length && this.isSpace(this.ch))
            this.at++;
    };
    ConditionsParser.prototype.isSpace = function (c) {
        return c == ' ' || c == '\n' || c == '\t' || c == '\r';
    };
    ConditionsParser.prototype.isQuotes = function (c) {
        return c == "'" || c == '"';
    };
    ConditionsParser.prototype.isOperatorChar = function (c) {
        return c == '>' || c == '<' || c == '=' || c == '!';
    };
    ConditionsParser.prototype.isBrackets = function (c) {
        return c == '(' || c == ')';
    };
    ConditionsParser.prototype.readString = function () {
        this.skip();
        if (this.at >= this.length)
            return null;
        var start = this.at;
        var hasQuotes = this.isQuotes(this.ch);
        if (hasQuotes)
            this.at++;
        var isFirstOpCh = this.isOperatorChar(this.ch);
        while (this.at < this.length) {
            if (!hasQuotes && this.isSpace(this.ch))
                break;
            if (this.isQuotes(this.ch)) {
                if (hasQuotes)
                    this.at++;
                break;
            }
            if (!hasQuotes) {
                if (isFirstOpCh != this.isOperatorChar(this.ch))
                    break;
                if (this.isBrackets(this.ch))
                    break;
            }
            this.at++;
        }
        if (this.at <= start)
            return null;
        var res = this.text.substr(start, this.at - start);
        if (res) {
            if (res.length > 1 && this.isQuotes(res[0])) {
                var len = res.length - 1;
                if (this.isQuotes(res[res.length - 1]))
                    len--;
                res = res.substr(1, len);
            }
        }
        return res;
    };
    ConditionsParser.prototype.isNoRightOperation = function (op) {
        return op == "empty" || op == "notempty";
    };
    ConditionsParser.prototype.readOperator = function () {
        var op = this.readString();
        if (!op)
            return null;
        op = op.toLowerCase();
        if (op == '>')
            op = "greater";
        if (op == '<')
            op = "less";
        if (op == '>=' || op == '=>')
            op = "greaterorequal";
        if (op == '<=' || op == '=<')
            op = "lessorequal";
        if (op == '=' || op == '==')
            op = "equal";
        if (op == '<>' || op == '!=')
            op = "notequal";
        if (op == 'contain')
            op = "contains";
        if (op == 'notcontain')
            op = "notcontains";
        return op;
    };
    ConditionsParser.prototype.readConnective = function () {
        var con = this.readString();
        if (!con)
            return null;
        con = con.toLowerCase();
        if (con == "&" || con == "&&")
            con = "and";
        if (con == "|" || con == "||")
            con = "or";
        if (con != "and" && con != "or")
            con = null;
        return con;
    };
    ConditionsParser.prototype.pushExpression = function () {
        var node = new __WEBPACK_IMPORTED_MODULE_0__conditions__["c" /* ConditionNode */]();
        this.expressionNodes.push(node);
        this.node = node;
    };
    ConditionsParser.prototype.popExpression = function () {
        var node = this.expressionNodes.pop();
        this.node = this.expressionNodes[this.expressionNodes.length - 1];
        this.node.children.push(node);
    };
    ConditionsParser.prototype.addCondition = function (c) {
        this.node.children.push(c);
    };
    ConditionsParser.prototype.addConnective = function (con) {
        if (this.node.children.length < 2) {
            this.node.connective = con;
        }
        else {
            if (this.node.connective != con) {
                var oldCon = this.node.connective;
                var oldChildren = this.node.children;
                this.node.clear();
                this.node.connective = con;
                var oldNode = new __WEBPACK_IMPORTED_MODULE_0__conditions__["c" /* ConditionNode */]();
                oldNode.connective = oldCon;
                oldNode.children = oldChildren;
                this.node.children.push(oldNode);
                var newNode = new __WEBPACK_IMPORTED_MODULE_0__conditions__["c" /* ConditionNode */]();
                this.node.children.push(newNode);
                this.node = newNode;
            }
        }
    };
    return ConditionsParser;
}());



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return surveyCss; });
/* unused harmony export defaultStandardCss */
var surveyCss = {
    currentType: "",
    getCss: function () {
        var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
        if (!loc)
            loc = defaultStandardCss;
        return loc;
    },
};
var defaultStandardCss = {
    root: "sv_main",
    header: "",
    body: "sv_body",
    footer: "sv_nav",
    navigationButton: "", navigation: { complete: "sv_complete_btn", prev: "sv_prev_btn", next: "sv_next_btn" },
    progress: "sv_progress", progressBar: "",
    pageTitle: "sv_p_title",
    row: "sv_row",
    question: { root: "sv_q", title: "sv_q_title", comment: "", indent: 20 },
    error: { root: "sv_q_erbox", icon: "", item: "" },
    checkbox: { root: "sv_qcbc", item: "sv_q_checkbox", other: "sv_q_other" },
    comment: "",
    dropdown: { root: "", control: "" },
    matrix: { root: "sv_q_matrix" },
    matrixdropdown: { root: "sv_q_matrix" },
    matrixdynamic: { root: "table", button: "" },
    multipletext: { root: "", itemTitle: "", itemValue: "" },
    radiogroup: { root: "sv_qcbc", item: "sv_q_radiogroup", label: "", other: "sv_q_other" },
    rating: { root: "sv_q_rating", item: "sv_q_rating_item" },
    text: "",
    window: {
        root: "sv_window", body: "sv_window_content",
        header: {
            root: "sv_window_title", title: "", button: "", buttonExpanded: "", buttonCollapsed: ""
        }
    }
};
surveyCss["standard"] = defaultStandardCss;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dxSurveyService; });
/**
 * The class contains methods to work with www.dxsurvey.com service.
 */
var dxSurveyService = (function () {
    //public static serviceUrl: string = "http://localhost:50488/api/Survey";
    function dxSurveyService() {
    }
    dxSurveyService.prototype.loadSurvey = function (surveyId, onLoad) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', dxSurveyService.serviceUrl + '/getSurvey?surveyId=' + surveyId);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var result = JSON.parse(xhr.response);
            onLoad(xhr.status == 200, result, xhr.response);
        };
        xhr.send();
    };
    dxSurveyService.prototype.sendResult = function (postId, result, onSendResult, clientId, isPartialCompleted) {
        if (clientId === void 0) { clientId = null; }
        if (isPartialCompleted === void 0) { isPartialCompleted = false; }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', dxSurveyService.serviceUrl + '/post/');
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        var data = { postId: postId, surveyResult: JSON.stringify(result) };
        if (clientId)
            data['clientId'] = clientId;
        if (isPartialCompleted)
            data['isPartialCompleted'] = true;
        var dataStringify = JSON.stringify(data);
        var self = this;
        xhr.onload = xhr.onerror = function () {
            if (!onSendResult)
                return;
            onSendResult(xhr.status == 200, xhr.response);
        };
        xhr.send(dataStringify);
    };
    dxSurveyService.prototype.sendFile = function (postId, file, onSendFile) {
        var xhr = new XMLHttpRequest();
        xhr.onload = xhr.onerror = function () {
            if (!onSendFile)
                return;
            onSendFile(xhr.status == 200, JSON.parse(xhr.response));
        };
        xhr.open("POST", dxSurveyService.serviceUrl + '/upload/', true);
        var formData = new FormData();
        formData.append("file", file);
        formData.append("postId", postId);
        xhr.send(formData);
    };
    dxSurveyService.prototype.getResult = function (resultId, name, onGetResult) {
        var xhr = new XMLHttpRequest();
        var data = 'resultId=' + resultId + '&name=' + name;
        xhr.open('GET', dxSurveyService.serviceUrl + '/getResult?' + data);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var self = this;
        xhr.onload = function () {
            var result = null;
            var list = null;
            if (xhr.status == 200) {
                result = JSON.parse(xhr.response);
                list = [];
                for (var key in result.QuestionResult) {
                    var el = { name: key, value: result.QuestionResult[key] };
                    list.push(el);
                }
            }
            onGetResult(xhr.status == 200, result, list, xhr.response);
        };
        xhr.send();
    };
    dxSurveyService.prototype.isCompleted = function (resultId, clientId, onIsCompleted) {
        var xhr = new XMLHttpRequest();
        var data = 'resultId=' + resultId + '&clientId=' + clientId;
        xhr.open('GET', dxSurveyService.serviceUrl + '/isCompleted?' + data);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var self = this;
        xhr.onload = function () {
            var result = null;
            if (xhr.status == 200) {
                result = JSON.parse(xhr.response);
            }
            onIsCompleted(xhr.status == 200, result, xhr.response);
        };
        xhr.send();
    };
    return dxSurveyService;
}());

dxSurveyService.serviceUrl = "https://dxsurveyapi.azurewebsites.net/api/Survey";


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jsonobject__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__panel__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PageModel; });




/**
 * The page object. It has elements collection, that contains questions and panels.
 */
var PageModel = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](PageModel, _super);
    function PageModel(name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.numValue = -1;
        _this.navigationButtonsVisibilityValue = "inherit";
        return _this;
    }
    PageModel.prototype.getType = function () { return "page"; };
    Object.defineProperty(PageModel.prototype, "num", {
        get: function () { return this.numValue; },
        set: function (value) {
            if (this.numValue == value)
                return;
            this.numValue = value;
            this.onNumChanged(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PageModel.prototype, "navigationButtonsVisibility", {
        get: function () { return this.navigationButtonsVisibilityValue; },
        set: function (newValue) {
            this.navigationButtonsVisibilityValue = newValue.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    PageModel.prototype.getRendredTitle = function (str) {
        str = _super.prototype.getRendredTitle.call(this, str);
        if (this.num > 0) {
            str = this.num + ". " + str;
        }
        return str;
    };
    PageModel.prototype.focusFirstQuestion = function () {
        for (var i = 0; i < this.questions.length; i++) {
            var question = this.questions[i];
            if (!question.visible || !question.hasInput)
                continue;
            this.questions[i].focus();
            break;
        }
    };
    PageModel.prototype.focusFirstErrorQuestion = function () {
        for (var i = 0; i < this.questions.length; i++) {
            if (!this.questions[i].visible || this.questions[i].currentErrorCount == 0)
                continue;
            this.questions[i].focus(true);
            break;
        }
    };
    PageModel.prototype.scrollToTop = function () {
        __WEBPACK_IMPORTED_MODULE_2__base__["d" /* SurveyElement */].ScrollElementToTop(__WEBPACK_IMPORTED_MODULE_2__base__["a" /* SurveyPageId */]);
    };
    PageModel.prototype.onNumChanged = function (value) {
    };
    PageModel.prototype.onVisibleChanged = function () {
        _super.prototype.onVisibleChanged.call(this);
        if (this.data != null) {
            this.data.pageVisibilityChanged(this, this.visible);
        }
    };
    return PageModel;
}(__WEBPACK_IMPORTED_MODULE_3__panel__["a" /* PanelModelBase */]));

__WEBPACK_IMPORTED_MODULE_1__jsonobject__["a" /* JsonObject */].metaData.addClass("page", [{ name: "navigationButtonsVisibility", default: "inherit", choices: ["inherit", "show", "hide"] }], function () { return new PageModel(); }, "panel");


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jsonobject__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__conditions__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__questionfactory__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__localizablestring__ = __webpack_require__(9);
/* unused harmony export QuestionRowModel */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PanelModelBase; });
/* unused harmony export PanelModel */






var QuestionRowModel = (function () {
    function QuestionRowModel(panel) {
        this.panel = panel;
        this.elements = [];
        this.visibleValue = panel.data && panel.data.isDesignMode;
    }
    Object.defineProperty(QuestionRowModel.prototype, "questions", {
        //TODO remove after updating react and vue
        get: function () { return this.elements; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionRowModel.prototype, "visible", {
        get: function () { return this.visibleValue; },
        set: function (val) {
            if (val == this.visible)
                return;
            this.visibleValue = val;
            this.onVisibleChanged();
        },
        enumerable: true,
        configurable: true
    });
    QuestionRowModel.prototype.updateVisible = function () {
        this.visible = this.calcVisible();
        this.setWidth();
    };
    QuestionRowModel.prototype.addElement = function (q) {
        this.elements.push(q);
        this.updateVisible();
    };
    QuestionRowModel.prototype.onVisibleChanged = function () {
        if (this.visibilityChangedCallback)
            this.visibilityChangedCallback();
    };
    QuestionRowModel.prototype.setWidth = function () {
        var visCount = this.getVisibleCount();
        if (visCount == 0)
            return;
        var counter = 0;
        for (var i = 0; i < this.elements.length; i++)
            if (this.elements[i].isVisible) {
                var q = this.elements[i];
                q.renderWidth = q.width ? q.width : Math.floor(100 / visCount) + '%';
                q.rightIndent = counter < visCount - 1 ? 1 : 0;
                counter++;
            }
    };
    QuestionRowModel.prototype.getVisibleCount = function () {
        var res = 0;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].isVisible)
                res++;
        }
        return res;
    };
    QuestionRowModel.prototype.calcVisible = function () { return this.getVisibleCount() > 0; };
    return QuestionRowModel;
}());

/**
 * A base class for a Panel and Page objects.
 */
var PanelModelBase = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](PanelModelBase, _super);
    function PanelModelBase(name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.dataValue = null;
        _this.rowValues = null;
        _this.conditionRunner = null;
        _this.elementsValue = new Array();
        _this.isQuestionsReady = false;
        _this.questionsValue = new Array();
        _this.parent = null;
        _this.visibleIf = "";
        _this.visibleIndex = -1;
        _this.visibleValue = true;
        _this.idValue = PanelModelBase.getPanelId();
        _this.locTitleValue = new __WEBPACK_IMPORTED_MODULE_5__localizablestring__["a" /* LocalizableString */](_this, true);
        var self = _this;
        _this.locTitleValue.onRenderedHtmlCallback = function (text) { return self.getRendredTitle(text); };
        _this.elementsValue.push = function (value) { return self.doOnPushElement(this, value); };
        _this.elementsValue.splice = function (start, deleteCount) {
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            return self.doSpliceElements.apply(self, [this, start, deleteCount].concat(items));
        };
        return _this;
    }
    PanelModelBase.getPanelId = function () {
        return "sp_" + PanelModelBase.panelCounter++;
    };
    Object.defineProperty(PanelModelBase.prototype, "data", {
        get: function () { return this.dataValue; },
        set: function (value) {
            if (this.dataValue === value)
                return;
            this.dataValue = value;
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].setData(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModelBase.prototype, "title", {
        get: function () { return this.locTitle.text; },
        set: function (newValue) {
            this.locTitle.text = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModelBase.prototype, "locTitle", {
        get: function () { return this.locTitleValue; },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.getLocale = function () { return this.data ? this.data.getLocale() : ""; };
    PanelModelBase.prototype.getMarkdownHtml = function (text) { return this.data ? this.data.getMarkdownHtml(text) : null; };
    Object.defineProperty(PanelModelBase.prototype, "id", {
        get: function () { return this.idValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModelBase.prototype, "isPanel", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModelBase.prototype, "questions", {
        get: function () {
            if (!this.isQuestionsReady) {
                this.questionsValue = [];
                for (var i = 0; i < this.elements.length; i++) {
                    var el = this.elements[i];
                    if (el.isPanel) {
                        var qs = el.questions;
                        for (var j = 0; j < qs.length; j++) {
                            this.questionsValue.push(qs[j]);
                        }
                    }
                    else {
                        this.questionsValue.push(el);
                    }
                }
                this.isQuestionsReady = true;
            }
            return this.questionsValue;
        },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.markQuestionListDirty = function () {
        this.isQuestionsReady = false;
        if (this.parent)
            this.parent.markQuestionListDirty();
    };
    Object.defineProperty(PanelModelBase.prototype, "elements", {
        get: function () { return this.elementsValue; },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.containsElement = function (element) {
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            if (el == element)
                return true;
            if (el.isPanel) {
                if (el.containsElement(element))
                    return true;
            }
        }
        return false;
    };
    PanelModelBase.prototype.hasErrors = function (fireCallback, focuseOnFirstError) {
        if (fireCallback === void 0) { fireCallback = true; }
        if (focuseOnFirstError === void 0) { focuseOnFirstError = false; }
        var result = false;
        var firstErrorQuestion = null;
        var visibleQuestions = [];
        this.addQuestionsToList(visibleQuestions, true);
        for (var i = 0; i < visibleQuestions.length; i++) {
            var question = visibleQuestions[i];
            if (question.isReadOnly)
                continue;
            if (question.hasErrors(fireCallback)) {
                if (focuseOnFirstError && firstErrorQuestion == null) {
                    firstErrorQuestion = question;
                }
                result = true;
            }
        }
        if (firstErrorQuestion)
            firstErrorQuestion.focus(true);
        return result;
    };
    PanelModelBase.prototype.addQuestionsToList = function (list, visibleOnly) {
        if (visibleOnly === void 0) { visibleOnly = false; }
        if (visibleOnly && !this.visible)
            return;
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            if (visibleOnly && !el.visible)
                continue;
            if (el.isPanel) {
                el.addQuestionsToList(list, visibleOnly);
            }
            else {
                list.push(el);
            }
        }
    };
    Object.defineProperty(PanelModelBase.prototype, "rows", {
        get: function () {
            if (!this.rowValues) {
                this.rowValues = this.buildRows();
            }
            return this.rowValues;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModelBase.prototype, "isActive", {
        get: function () { return (!this.data) || this.data.currentPage == this.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModelBase.prototype, "root", {
        get: function () {
            var res = this;
            while (res.parent)
                res = res.parent;
            return res;
        },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.createRow = function () { return new QuestionRowModel(this); };
    PanelModelBase.prototype.onSurveyLoad = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].onSurveyLoad();
        }
        if (this.rowsChangedCallback)
            this.rowsChangedCallback();
    };
    Object.defineProperty(PanelModelBase.prototype, "isLoadingFromJson", {
        get: function () { return this.data && this.data.isLoadingFromJson; },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.onRowsChanged = function () {
        this.rowValues = null;
        if (this.rowsChangedCallback && !this.isLoadingFromJson)
            this.rowsChangedCallback();
    };
    Object.defineProperty(PanelModelBase.prototype, "isDesignMode", {
        get: function () { return this.data && this.data.isDesignMode; },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.doOnPushElement = function (list, value) {
        var result = Array.prototype.push.call(list, value);
        this.markQuestionListDirty();
        this.onAddElement(value, list.length);
        this.onRowsChanged();
        return result;
    };
    PanelModelBase.prototype.doSpliceElements = function (list, start, deleteCount) {
        var items = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            items[_i - 3] = arguments[_i];
        }
        if (!start)
            start = 0;
        if (!deleteCount)
            deleteCount = 0;
        var deletedQuestions = [];
        for (var i = 0; i < deleteCount; i++) {
            if (i + start >= list.length)
                continue;
            deletedQuestions.push(list[i + start]);
        }
        var result = (_a = Array.prototype.splice).call.apply(_a, [list, start, deleteCount].concat(items));
        this.markQuestionListDirty();
        if (!items)
            items = [];
        for (var i = 0; i < deletedQuestions.length; i++) {
            this.onRemoveElement(deletedQuestions[i]);
        }
        for (var i = 0; i < items.length; i++) {
            this.onAddElement(items[i], start + i);
        }
        this.onRowsChanged();
        return result;
        var _a;
    };
    PanelModelBase.prototype.onAddElement = function (element, index) {
        if (element.isPanel) {
            var p = element;
            p.data = this.data;
            p.parent = this;
            if (this.data) {
                this.data.panelAdded(p, index, this, this.root);
            }
        }
        else {
            if (this.data) {
                var q = element;
                q.setData(this.data);
                this.data.questionAdded(q, index, this, this.root);
            }
        }
        var self = this;
        element.rowVisibilityChangedCallback = function () { self.onElementVisibilityChanged(element); };
        element.startWithNewLineChangedCallback = function () { self.onElementStartWithNewLineChanged(element); };
    };
    PanelModelBase.prototype.onRemoveElement = function (element) {
        if (!element.isPanel) {
            if (this.data)
                this.data.questionRemoved(element);
        }
        else {
            if (this.data)
                this.data.panelRemoved(element);
        }
    };
    PanelModelBase.prototype.onElementVisibilityChanged = function (element) {
        if (this.rowValues) {
            this.updateRowsVisibility(element);
        }
        if (this.parent) {
            this.parent.onElementVisibilityChanged(this);
        }
    };
    PanelModelBase.prototype.onElementStartWithNewLineChanged = function (element) {
        this.onRowsChanged();
    };
    PanelModelBase.prototype.updateRowsVisibility = function (element) {
        for (var i = 0; i < this.rowValues.length; i++) {
            var row = this.rowValues[i];
            if (row.elements.indexOf(element) > -1) {
                row.updateVisible();
                break;
            }
        }
    };
    PanelModelBase.prototype.buildRows = function () {
        var result = new Array();
        var lastRowVisibleIndex = -1;
        var self = this;
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            var isNewRow = i == 0 || el.startWithNewLine;
            var row = isNewRow ? this.createRow() : result[result.length - 1];
            if (isNewRow)
                result.push(row);
            row.addElement(el);
        }
        for (var i = 0; i < result.length; i++) {
            result[i].updateVisible();
        }
        return result;
    };
    Object.defineProperty(PanelModelBase.prototype, "processedTitle", {
        get: function () {
            return this.getRendredTitle(this.locTitle.textOrHtml);
        },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.getRendredTitle = function (str) {
        if (!str && this.isPanel && this.isDesignMode)
            return "[" + this.name + "]";
        return this.data != null ? this.data.processText(str) : str;
    };
    Object.defineProperty(PanelModelBase.prototype, "visible", {
        get: function () { return this.visibleValue; },
        set: function (value) {
            if (value === this.visible)
                return;
            this.visibleValue = value;
            this.onVisibleChanged();
        },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.onVisibleChanged = function () {
    };
    Object.defineProperty(PanelModelBase.prototype, "isVisible", {
        get: function () { return (this.data && this.data.isDesignMode) || this.getIsPageVisible(null); },
        enumerable: true,
        configurable: true
    });
    PanelModelBase.prototype.getIsPageVisible = function (exceptionQuestion) {
        if (!this.visible)
            return false;
        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i] == exceptionQuestion)
                continue;
            if (this.questions[i].visible)
                return true;
        }
        return false;
    };
    PanelModelBase.prototype.addElement = function (element, index) {
        if (index === void 0) { index = -1; }
        if (element == null)
            return;
        if (index < 0 || index >= this.elements.length) {
            this.elements.push(element);
        }
        else {
            this.elements.splice(index, 0, element);
        }
    };
    PanelModelBase.prototype.addQuestion = function (question, index) {
        if (index === void 0) { index = -1; }
        this.addElement(question, index);
    };
    PanelModelBase.prototype.addPanel = function (panel, index) {
        if (index === void 0) { index = -1; }
        this.addElement(panel, index);
    };
    PanelModelBase.prototype.addNewQuestion = function (questionType, name) {
        var question = __WEBPACK_IMPORTED_MODULE_4__questionfactory__["a" /* QuestionFactory */].Instance.createQuestion(questionType, name);
        this.addQuestion(question);
        return question;
    };
    PanelModelBase.prototype.addNewPanel = function (name) {
        var panel = this.createNewPanel(name);
        this.addPanel(panel);
        return panel;
    };
    PanelModelBase.prototype.createNewPanel = function (name) {
        return new PanelModel(name);
    };
    PanelModelBase.prototype.removeElement = function (element) {
        var index = this.elements.indexOf(element);
        if (index < 0) {
            for (var i = 0; i < this.elements.length; i++) {
                var el = this.elements[i];
                if (el.isPanel && el.removeElement(element))
                    return true;
            }
            return false;
        }
        this.elements.splice(index, 1);
        return true;
    };
    PanelModelBase.prototype.removeQuestion = function (question) {
        this.removeElement(question);
    };
    PanelModelBase.prototype.runCondition = function (values) {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].runCondition(values);
        }
        if (!this.visibleIf)
            return;
        if (!this.conditionRunner)
            this.conditionRunner = new __WEBPACK_IMPORTED_MODULE_3__conditions__["a" /* ConditionRunner */](this.visibleIf);
        this.conditionRunner.expression = this.visibleIf;
        this.visible = this.conditionRunner.run(values);
    };
    PanelModelBase.prototype.onLocaleChanged = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].onLocaleChanged();
        }
        this.locTitle.onChanged();
    };
    return PanelModelBase;
}(__WEBPACK_IMPORTED_MODULE_2__base__["c" /* Base */]));

PanelModelBase.panelCounter = 100;
/**
 * A container element, similar to the Page objects. However, unlike the Page, Panel can't be a root.
 * It may contain questions and other panels.
 */
var PanelModel = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](PanelModel, _super);
    function PanelModel(name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.innerIndentValue = 0;
        _this.startWithNewLineValue = true;
        return _this;
    }
    PanelModel.prototype.getType = function () { return "panel"; };
    PanelModel.prototype.setData = function (newValue) {
        this.data = newValue;
    };
    Object.defineProperty(PanelModel.prototype, "isPanel", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModel.prototype, "innerIndent", {
        get: function () { return this.innerIndentValue; },
        set: function (val) {
            if (val == this.innerIndentValue)
                return;
            this.innerIndentValue = val;
            if (this.renderWidthChangedCallback)
                this.renderWidthChangedCallback();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModel.prototype, "renderWidth", {
        get: function () { return this.renderWidthValue; },
        set: function (val) {
            if (val == this.renderWidth)
                return;
            this.renderWidthValue = val;
            if (this.renderWidthChangedCallback)
                this.renderWidthChangedCallback();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModel.prototype, "startWithNewLine", {
        get: function () { return this.startWithNewLineValue; },
        set: function (value) {
            if (this.startWithNewLine == value)
                return;
            this.startWithNewLineValue = value;
            if (this.startWithNewLineChangedCallback)
                this.startWithNewLineChangedCallback();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PanelModel.prototype, "rightIndent", {
        get: function () { return this.rightIndentValue; },
        set: function (val) {
            if (val == this.rightIndent)
                return;
            this.rightIndentValue = val;
            if (this.renderWidthChangedCallback)
                this.renderWidthChangedCallback();
        },
        enumerable: true,
        configurable: true
    });
    PanelModel.prototype.onVisibleChanged = function () {
        if (this.rowVisibilityChangedCallback)
            this.rowVisibilityChangedCallback();
    };
    return PanelModel;
}(PanelModelBase));

__WEBPACK_IMPORTED_MODULE_1__jsonobject__["a" /* JsonObject */].metaData.addClass("panel", ["name", { name: "elements", alternativeName: "questions", baseClassName: "question", visible: false },
    { name: "startWithNewLine:boolean", default: true }, { name: "visible:boolean", default: true }, "visibleIf:expression",
    { name: "title:text", serializationProperty: "locTitle" }, { name: "innerIndent:number", default: 0, choices: [0, 1, 2, 3] }], function () { return new PanelModel(); });


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jsonobject__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__questionbase__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__surveyStrings__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__error__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__validator__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__textPreProcessor__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__localizablestring__ = __webpack_require__(9);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Question; });









/**
 * Extends question base class with title, value, errors and other functionality
 */
var Question = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](Question, _super);
    function Question(name) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.isRequiredValue = false;
        _this.hasCommentValue = false;
        _this.hasOtherValue = false;
        _this.readOnlyValue = false;
        _this.errors = [];
        _this.validators = new Array();
        _this.isvalueChangedCallbackFiring = false;
        _this.isValueChangedInSurvey = false;
        _this.locTitleValue = new __WEBPACK_IMPORTED_MODULE_8__localizablestring__["a" /* LocalizableString */](_this, true);
        var self = _this;
        _this.locTitleValue.onRenderedHtmlCallback = function (text) { return self.fullTitle; };
        _this.locCommentTextValue = new __WEBPACK_IMPORTED_MODULE_8__localizablestring__["a" /* LocalizableString */](_this, true);
        return _this;
    }
    Object.defineProperty(Question.prototype, "hasTitle", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "hasInput", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "inputId", {
        get: function () { return this.id + "i"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "title", {
        get: function () {
            var res = this.locTitle.text;
            return res ? res : this.name;
        },
        set: function (newValue) {
            this.locTitle.text = newValue;
            this.fireCallback(this.titleChangedCallback);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "locTitle", {
        get: function () { return this.locTitleValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "locCommentText", {
        get: function () { return this.locCommentTextValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "locTitleHtml", {
        get: function () {
            var res = this.locTitle.textOrHtml;
            return res ? res : this.name;
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.onLocaleChanged = function () {
        _super.prototype.onLocaleChanged.call(this);
        this.locTitle.onChanged();
        this.locCommentText.onChanged();
    };
    Object.defineProperty(Question.prototype, "processedTitle", {
        get: function () { return this.survey != null ? this.survey.processText(this.locTitleHtml) : this.locTitleHtml; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "fullTitle", {
        get: function () {
            if (this.survey && this.survey.getQuestionTitleTemplate()) {
                if (!this.textPreProcessor) {
                    var self = this;
                    this.textPreProcessor = new __WEBPACK_IMPORTED_MODULE_7__textPreProcessor__["a" /* TextPreProcessor */]();
                    this.textPreProcessor.onHasValue = function (name) { return self.canProcessedTextValues(name.toLowerCase()); };
                    this.textPreProcessor.onProcess = function (name) { return self.getProcessedTextValue(name); };
                }
                return this.textPreProcessor.process(this.survey.getQuestionTitleTemplate());
            }
            var requireText = this.requiredText;
            if (requireText)
                requireText += " ";
            var no = this.no;
            if (no)
                no += ". ";
            return no + requireText + this.processedTitle;
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.focus = function (onError) {
        if (onError === void 0) { onError = false; }
        __WEBPACK_IMPORTED_MODULE_3__base__["d" /* SurveyElement */].ScrollElementToTop(this.id);
        var id = !onError ? this.getFirstInputElementId() : this.getFirstErrorInputElementId();
        if (__WEBPACK_IMPORTED_MODULE_3__base__["d" /* SurveyElement */].FocusElement(id)) {
            this.fireCallback(this.focusCallback);
        }
    };
    Question.prototype.getFirstInputElementId = function () {
        return this.inputId;
    };
    Question.prototype.getFirstErrorInputElementId = function () {
        return this.getFirstInputElementId();
    };
    Question.prototype.canProcessedTextValues = function (name) {
        return name == "no" || name == "title" || name == "require";
    };
    Question.prototype.getProcessedTextValue = function (name) {
        if (name == "no")
            return this.no;
        if (name == "title")
            return this.processedTitle;
        if (name == "require")
            return this.requiredText;
        return null;
    };
    Question.prototype.supportComment = function () { return false; };
    Question.prototype.supportOther = function () { return false; };
    Object.defineProperty(Question.prototype, "isRequired", {
        get: function () { return this.isRequiredValue; },
        set: function (val) {
            if (this.isRequired == val)
                return;
            this.isRequiredValue = val;
            this.fireCallback(this.titleChangedCallback);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "hasComment", {
        get: function () { return this.hasCommentValue; },
        set: function (val) {
            if (!this.supportComment())
                return;
            this.hasCommentValue = val;
            if (this.hasComment)
                this.hasOther = false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "commentText", {
        get: function () {
            var res = this.locCommentText.text;
            return res ? res : __WEBPACK_IMPORTED_MODULE_4__surveyStrings__["a" /* surveyLocalization */].getString("otherItemText");
        },
        set: function (value) {
            this.locCommentText.text = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "hasOther", {
        get: function () { return this.hasOtherValue; },
        set: function (val) {
            if (!this.supportOther() || this.hasOther == val)
                return;
            this.hasOtherValue = val;
            if (this.hasOther)
                this.hasComment = false;
            this.hasOtherChanged();
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.hasOtherChanged = function () { };
    Object.defineProperty(Question.prototype, "isReadOnly", {
        get: function () { return this.readOnly || (this.survey != null && this.survey.isDisplayMode); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "readOnly", {
        get: function () { return this.readOnlyValue; },
        set: function (value) {
            if (this.readOnly == value)
                return;
            this.readOnlyValue = value;
            this.onReadOnlyChanged();
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.onReadOnlyChanged = function () {
        this.fireCallback(this.readOnlyChangedCallback);
    };
    Object.defineProperty(Question.prototype, "no", {
        get: function () {
            if (this.visibleIndex < 0)
                return "";
            var startIndex = 1;
            var isNumeric = true;
            var str = "";
            if (this.survey && this.survey.questionStartIndex) {
                str = this.survey.questionStartIndex;
                if (parseInt(str))
                    startIndex = parseInt(str);
                else if (str.length == 1)
                    isNumeric = false;
            }
            if (isNumeric)
                return (this.visibleIndex + startIndex).toString();
            return String.fromCharCode(str.charCodeAt(0) + this.visibleIndex);
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.onSetData = function () {
        _super.prototype.onSetData.call(this);
        this.onSurveyValueChanged(this.value);
    };
    Object.defineProperty(Question.prototype, "value", {
        get: function () {
            return this.valueFromData(this.getValueCore());
        },
        set: function (newValue) {
            this.setNewValue(newValue);
            if (this.isvalueChangedCallbackFiring)
                return;
            this.isvalueChangedCallbackFiring = true;
            this.fireCallback(this.valueChangedCallback);
            this.isvalueChangedCallbackFiring = false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "comment", {
        get: function () { return this.getComment(); },
        set: function (newValue) {
            if (this.comment == newValue)
                return;
            this.setComment(newValue);
            this.fireCallback(this.commentChangedCallback);
        },
        enumerable: true,
        configurable: true
    });
    Question.prototype.getComment = function () { return this.data != null ? this.data.getComment(this.name) : this.questionComment; };
    Question.prototype.setComment = function (newValue) {
        this.setNewComment(newValue);
    };
    Question.prototype.isEmpty = function () { return __WEBPACK_IMPORTED_MODULE_3__base__["c" /* Base */].isValueEmpty(this.value); };
    Question.prototype.hasErrors = function (fireCallback) {
        if (fireCallback === void 0) { fireCallback = true; }
        this.checkForErrors(fireCallback);
        return this.errors.length > 0;
    };
    Object.defineProperty(Question.prototype, "currentErrorCount", {
        get: function () { return this.errors.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Question.prototype, "requiredText", {
        get: function () { return this.survey != null && this.isRequired ? this.survey.requiredText : ""; },
        enumerable: true,
        configurable: true
    });
    Question.prototype.addError = function (error) {
        this.errors.push(error);
        this.fireCallback(this.errorsChangedCallback);
    };
    Question.prototype.checkForErrors = function (fireCallback) {
        var errorLength = this.errors ? this.errors.length : 0;
        this.errors = [];
        this.onCheckForErrors(this.errors);
        if (this.errors.length == 0 && this.value) {
            var error = this.runValidators();
            if (error) {
                this.errors.push(error);
            }
        }
        if (this.survey && this.errors.length == 0) {
            var error = this.survey.validateQuestion(this.name);
            if (error) {
                this.errors.push(error);
            }
        }
        if (fireCallback && (errorLength != this.errors.length || errorLength > 0)) {
            this.fireCallback(this.errorsChangedCallback);
        }
    };
    Question.prototype.onCheckForErrors = function (errors) {
        if (this.hasRequiredError()) {
            this.errors.push(new __WEBPACK_IMPORTED_MODULE_5__error__["b" /* AnswerRequiredError */]());
        }
    };
    Question.prototype.hasRequiredError = function () {
        return this.isRequired && this.isEmpty();
    };
    Question.prototype.runValidators = function () {
        return new __WEBPACK_IMPORTED_MODULE_6__validator__["a" /* ValidatorRunner */]().run(this);
    };
    Question.prototype.setNewValue = function (newValue) {
        this.setNewValueInData(newValue);
        this.onValueChanged();
    };
    Question.prototype.setNewValueInData = function (newValue) {
        if (!this.isValueChangedInSurvey) {
            newValue = this.valueToData(newValue);
            this.setValueCore(newValue);
        }
    };
    Question.prototype.getValueCore = function () {
        return this.data != null ? this.data.getValue(this.name) : this.questionValue;
    };
    Question.prototype.setValueCore = function (newValue) {
        if (this.data != null) {
            this.data.setValue(this.name, newValue);
        }
        else {
            this.questionValue = newValue;
        }
    };
    Question.prototype.valueFromData = function (val) { return val; };
    Question.prototype.valueToData = function (val) { return val; };
    Question.prototype.onValueChanged = function () { };
    Question.prototype.setNewComment = function (newValue) {
        if (this.data != null) {
            this.data.setComment(this.name, newValue);
        }
        else
            this.questionComment = newValue;
    };
    //IQuestion
    Question.prototype.onSurveyValueChanged = function (newValue) {
        this.isValueChangedInSurvey = true;
        this.value = this.valueFromData(newValue);
        this.fireCallback(this.commentChangedCallback);
        this.isValueChangedInSurvey = false;
    };
    //IValidatorOwner
    Question.prototype.getValidatorTitle = function () { return null; };
    return Question;
}(__WEBPACK_IMPORTED_MODULE_2__questionbase__["a" /* QuestionBase */]));

__WEBPACK_IMPORTED_MODULE_1__jsonobject__["a" /* JsonObject */].metaData.addClass("question", [{ name: "title:text", serializationProperty: "locTitle" },
    { name: "commentText", serializationProperty: "locCommentText" },
    "isRequired:boolean", "readOnly:boolean", { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }], null, "questionbase");


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(2);
/* unused harmony export QuestionCustomWidget */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomWidgetCollection; });

var QuestionCustomWidget = (function () {
    function QuestionCustomWidget(name, widgetJson) {
        this.name = name;
        this.widgetJson = widgetJson;
        this.htmlTemplate = widgetJson.htmlTemplate ? widgetJson.htmlTemplate : "";
    }
    QuestionCustomWidget.prototype.afterRender = function (question, el) {
        if (this.widgetJson.afterRender)
            this.widgetJson.afterRender(question, el);
    };
    QuestionCustomWidget.prototype.willUnmount = function (question, el) {
        if (this.widgetJson.willUnmount)
            this.widgetJson.willUnmount(question, el);
    };
    QuestionCustomWidget.prototype.isFit = function (question) {
        if (this.widgetJson.isFit)
            return this.widgetJson.isFit(question);
        return false;
    };
    return QuestionCustomWidget;
}());

var CustomWidgetCollection = (function () {
    function CustomWidgetCollection() {
        this.widgetsValues = [];
        this.onCustomWidgetAdded = new __WEBPACK_IMPORTED_MODULE_0__base__["b" /* Event */]();
    }
    Object.defineProperty(CustomWidgetCollection.prototype, "widgets", {
        get: function () { return this.widgetsValues; },
        enumerable: true,
        configurable: true
    });
    CustomWidgetCollection.prototype.addCustomWidget = function (widgetJson) {
        var name = widgetJson.name;
        if (!name) {
            name = "widget_" + this.widgets.length + 1;
        }
        var customWidget = new QuestionCustomWidget(name, widgetJson);
        this.widgetsValues.push(customWidget);
        this.onCustomWidgetAdded.fire(customWidget, null);
    };
    CustomWidgetCollection.prototype.clear = function () { this.widgetsValues = []; };
    CustomWidgetCollection.prototype.getCustomWidget = function (question) {
        for (var i = 0; i < this.widgetsValues.length; i++) {
            if (this.widgetsValues[i].isFit(question))
                return this.widgetsValues[i];
        }
        return null;
    };
    return CustomWidgetCollection;
}());

CustomWidgetCollection.Instance = new CustomWidgetCollection();


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__jsonobject__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__conditions__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionBase; });




/**
 * A base class for all questions. QuestionBase doesn't have information about title, values, errors and so on.
 * Those properties are defined in the Question class.
 */
var QuestionBase = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](QuestionBase, _super);
    function QuestionBase(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.data = null;
        _this.surveyValue = null;
        _this.conditionRunner = null;
        _this.customWidgetData = { isNeedRender: true };
        _this.visibleIf = "";
        _this.visibleValue = true;
        _this.startWithNewLineValue = true;
        _this.visibleIndexValue = -1;
        _this.width = "";
        _this.renderWidthValue = "";
        _this.rightIndentValue = 0;
        _this.indentValue = 0;
        _this.localeChanged = new __WEBPACK_IMPORTED_MODULE_1__base__["b" /* Event */]();
        _this.idValue = QuestionBase.getQuestionId();
        _this.onCreating();
        return _this;
    }
    QuestionBase.getQuestionId = function () {
        return "sq_" + QuestionBase.questionCounter++;
    };
    Object.defineProperty(QuestionBase.prototype, "isPanel", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "visible", {
        get: function () { return this.visibleValue; },
        set: function (val) {
            if (val == this.visible)
                return;
            this.visibleValue = val;
            this.fireCallback(this.visibilityChangedCallback);
            this.fireCallback(this.rowVisibilityChangedCallback);
            if (this.survey) {
                this.survey.questionVisibilityChanged(this, this.visible);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "isVisible", {
        get: function () { return this.visible || (this.survey && this.survey.isDesignMode); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "isReadOnly", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "visibleIndex", {
        get: function () { return this.visibleIndexValue; },
        enumerable: true,
        configurable: true
    });
    QuestionBase.prototype.hasErrors = function (fireCallback) {
        if (fireCallback === void 0) { fireCallback = true; }
        return false;
    };
    Object.defineProperty(QuestionBase.prototype, "currentErrorCount", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "hasTitle", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "hasInput", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "hasComment", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "id", {
        get: function () { return this.idValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "startWithNewLine", {
        get: function () { return this.startWithNewLineValue; },
        set: function (value) {
            if (this.startWithNewLine == value)
                return;
            this.startWithNewLineValue = value;
            if (this.startWithNewLineChangedCallback)
                this.startWithNewLineChangedCallback();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "renderWidth", {
        get: function () { return this.renderWidthValue; },
        set: function (val) {
            if (val == this.renderWidth)
                return;
            this.renderWidthValue = val;
            this.fireCallback(this.renderWidthChangedCallback);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "indent", {
        get: function () { return this.indentValue; },
        set: function (val) {
            if (val == this.indent)
                return;
            this.indentValue = val;
            this.fireCallback(this.renderWidthChangedCallback);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionBase.prototype, "rightIndent", {
        get: function () { return this.rightIndentValue; },
        set: function (val) {
            if (val == this.rightIndent)
                return;
            this.rightIndentValue = val;
            this.fireCallback(this.renderWidthChangedCallback);
        },
        enumerable: true,
        configurable: true
    });
    QuestionBase.prototype.focus = function (onError) {
        if (onError === void 0) { onError = false; }
    };
    QuestionBase.prototype.setData = function (newValue) {
        this.data = newValue;
        if (newValue && newValue["questionAdded"]) {
            this.surveyValue = newValue;
        }
        this.onSetData();
    };
    Object.defineProperty(QuestionBase.prototype, "survey", {
        get: function () { return this.surveyValue; },
        enumerable: true,
        configurable: true
    });
    QuestionBase.prototype.fireCallback = function (callback) {
        if (callback)
            callback();
    };
    QuestionBase.prototype.onSetData = function () { };
    QuestionBase.prototype.onCreating = function () { };
    QuestionBase.prototype.runCondition = function (values) {
        if (!this.visibleIf)
            return;
        if (!this.conditionRunner)
            this.conditionRunner = new __WEBPACK_IMPORTED_MODULE_3__conditions__["a" /* ConditionRunner */](this.visibleIf);
        this.conditionRunner.expression = this.visibleIf;
        this.visible = this.conditionRunner.run(values);
    };
    //IQuestion
    QuestionBase.prototype.onSurveyValueChanged = function (newValue) {
    };
    QuestionBase.prototype.onSurveyLoad = function () {
    };
    QuestionBase.prototype.setVisibleIndex = function (value) {
        if (this.visibleIndexValue == value)
            return;
        this.visibleIndexValue = value;
        this.fireCallback(this.visibleIndexChangedCallback);
    };
    QuestionBase.prototype.supportGoNextPageAutomatic = function () { return false; };
    QuestionBase.prototype.clearUnusedValues = function () { };
    QuestionBase.prototype.onLocaleChanged = function () {
        this.localeChanged.fire(this, this.getLocale());
    };
    QuestionBase.prototype.onReadOnlyChanged = function () {
    };
    //ILocalizableOwner
    QuestionBase.prototype.getLocale = function () { return this.data ? this.data.getLocale() : ""; };
    QuestionBase.prototype.getMarkdownHtml = function (text) { return this.data ? this.data.getMarkdownHtml(text) : null; };
    return QuestionBase;
}(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* Base */]));

QuestionBase.questionCounter = 100;
__WEBPACK_IMPORTED_MODULE_2__jsonobject__["a" /* JsonObject */].metaData.addClass("questionbase", ["!name", { name: "visible:boolean", default: true }, "visibleIf:expression",
    { name: "width" }, { name: "startWithNewLine:boolean", default: true }, { name: "indent:number", default: 0, choices: [0, 1, 2, 3] }]);


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__surveyStrings__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QuestionFactory; });
/* unused harmony export ElementFactory */

//TODO replace completely with ElementFactory
var QuestionFactory = (function () {
    function QuestionFactory() {
        this.creatorHash = {};
    }
    Object.defineProperty(QuestionFactory, "DefaultChoices", {
        get: function () {
            return ["1|" + __WEBPACK_IMPORTED_MODULE_0__surveyStrings__["a" /* surveyLocalization */].getString("choices_firstItem"), "2|" + __WEBPACK_IMPORTED_MODULE_0__surveyStrings__["a" /* surveyLocalization */].getString("choices_secondItem"), "3|" + __WEBPACK_IMPORTED_MODULE_0__surveyStrings__["a" /* surveyLocalization */].getString("choices_thirdItem")];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionFactory, "DefaultColums", {
        get: function () {
            var colName = __WEBPACK_IMPORTED_MODULE_0__surveyStrings__["a" /* surveyLocalization */].getString("matrix_column") + " ";
            return [colName + "1", colName + "2", colName + "3"];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuestionFactory, "DefaultRows", {
        get: function () {
            var rowName = __WEBPACK_IMPORTED_MODULE_0__surveyStrings__["a" /* surveyLocalization */].getString("matrix_row") + " ";
            return [rowName + "1", rowName + "2"];
        },
        enumerable: true,
        configurable: true
    });
    QuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
        this.creatorHash[questionType] = questionCreator;
    };
    QuestionFactory.prototype.clear = function () {
        this.creatorHash = {};
    };
    QuestionFactory.prototype.getAllTypes = function () {
        var result = new Array();
        for (var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    };
    QuestionFactory.prototype.createQuestion = function (questionType, name) {
        var creator = this.creatorHash[questionType];
        if (creator == null)
            return null;
        return creator(name);
    };
    return QuestionFactory;
}());

QuestionFactory.Instance = new QuestionFactory();
var ElementFactory = (function () {
    function ElementFactory() {
        this.creatorHash = {};
    }
    ElementFactory.prototype.registerElement = function (elementType, elementCreator) {
        this.creatorHash[elementType] = elementCreator;
    };
    ElementFactory.prototype.clear = function () {
        this.creatorHash = {};
    };
    ElementFactory.prototype.getAllTypes = function () {
        var result = QuestionFactory.Instance.getAllTypes();
        for (var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    };
    ElementFactory.prototype.createElement = function (elementType, name) {
        var creator = this.creatorHash[elementType];
        if (creator == null)
            return QuestionFactory.Instance.createQuestion(elementType, name);
        return creator(name);
    };
    return ElementFactory;
}());

ElementFactory.Instance = new ElementFactory();


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactquestionelement__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyCustomWidget; });



var SurveyCustomWidget = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyCustomWidget, _super);
    function SurveyCustomWidget(props) {
        var _this = _super.call(this, props) || this;
        _this.localeChangedHandler = function (sender) { return sender.customWidgetData.isNeedRender = true; };
        return _this;
    }
    SurveyCustomWidget.prototype._afterRender = function () {
        var el = this.refs['root'];
        if (this.questionBase.customWidget) {
            el = this.refs['widget'];
            if (!!el) {
                this.questionBase.customWidget.afterRender(this.questionBase, el);
                this.questionBase.customWidgetData.isNeedRender = false;
            }
        }
    };
    SurveyCustomWidget.prototype.componentDidMount = function () {
        if (this.questionBase) {
            this._afterRender();
            this.questionBase.localeChanged.add(this.localeChangedHandler);
        }
    };
    SurveyCustomWidget.prototype.componentDidUpdate = function () {
        if (this.questionBase) {
            this._afterRender();
        }
    };
    SurveyCustomWidget.prototype.componentWillUnmount = function () {
        var el = this.refs['root'];
        if (this.questionBase.customWidget) {
            el = this.refs['widget'];
            if (!!el) {
                this.questionBase.customWidget.willUnmount(this.questionBase, el);
            }
        }
        this.questionBase.localeChanged.remove(this.localeChangedHandler);
    };
    SurveyCustomWidget.prototype.render = function () {
        if (!this.questionBase || !this.creator) {
            return null;
        }
        if (!this.questionBase.visible) {
            return null;
        }
        var customWidget = this.questionBase.customWidget;
        if (customWidget.widgetJson.isDefaultRender) {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: 'widget' }, this.creator.createQuestionElement(this.questionBase));
        }
        var widget = null;
        if (customWidget.widgetJson.render) {
            widget = customWidget.widgetJson.render(this.questionBase);
        }
        else {
            if (customWidget.htmlTemplate) {
                var htmlValue = { __html: customWidget.htmlTemplate };
                return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: 'widget', dangerouslySetInnerHTML: htmlValue });
            }
        }
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: 'widget' }, widget);
    };
    return SurveyCustomWidget;
}(__WEBPACK_IMPORTED_MODULE_2__reactquestionelement__["b" /* SurveyQuestionElementBase */]));



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactSurveyNavigationBase__ = __webpack_require__(12);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyNavigation; });



var SurveyNavigation = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyNavigation, _super);
    function SurveyNavigation(props) {
        var _this = _super.call(this, props) || this;
        _this.handlePrevClick = _this.handlePrevClick.bind(_this);
        _this.handleNextClick = _this.handleNextClick.bind(_this);
        _this.handleCompleteClick = _this.handleCompleteClick.bind(_this);
        return _this;
    }
    SurveyNavigation.prototype.handlePrevClick = function (event) {
        this.survey.prevPage();
    };
    SurveyNavigation.prototype.handleNextClick = function (event) {
        this.survey.nextPage();
    };
    SurveyNavigation.prototype.handleCompleteClick = function (event) {
        this.survey.completeLastPage();
    };
    SurveyNavigation.prototype.render = function () {
        if (!this.survey || !this.survey.isNavigationButtonsShowing)
            return null;
        var prevButton = !this.survey.isFirstPage ? this.renderButton(this.handlePrevClick, this.survey.pagePrevText, this.css.navigation.prev) : null;
        var nextButton = !this.survey.isLastPage ? this.renderButton(this.handleNextClick, this.survey.pageNextText, this.css.navigation.next) : null;
        var completeButton = this.survey.isLastPage && this.survey.isEditMode ? this.renderButton(this.handleCompleteClick, this.survey.completeText, this.css.navigation.complete) : null;
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.footer },
            prevButton,
            nextButton,
            completeButton));
    };
    SurveyNavigation.prototype.renderButton = function (click, text, btnClassName) {
        var style = { marginRight: "5px" };
        var className = this.css.navigationButton + (btnClassName ? ' ' + btnClassName : "");
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("input", { className: className, style: style, type: "button", onClick: click, value: text });
    };
    return SurveyNavigation;
}(__WEBPACK_IMPORTED_MODULE_2__reactSurveyNavigationBase__["a" /* SurveyNavigationBase */]));



/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactSurveyNavigationBase__ = __webpack_require__(12);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyProgress; });



var SurveyProgress = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyProgress, _super);
    function SurveyProgress(props) {
        var _this = _super.call(this, props) || this;
        _this.isTop = props.isTop;
        return _this;
    }
    SurveyProgress.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        this.isTop = nextProps.isTop;
    };
    Object.defineProperty(SurveyProgress.prototype, "progress", {
        get: function () { return this.survey.getProgress(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyProgress.prototype, "progressText", {
        get: function () { return this.survey.progressText; },
        enumerable: true,
        configurable: true
    });
    SurveyProgress.prototype.render = function () {
        var style = this.isTop ? { width: "60%" } : { width: "60%", marginTop: "10px" };
        var progressStyle = { width: this.progress + "%" };
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.progress, style: style },
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { style: progressStyle, className: this.css.progressBar, role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100" },
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("span", null, this.progressText))));
    };
    return SurveyProgress;
}(__WEBPACK_IMPORTED_MODULE_2__reactSurveyNavigationBase__["a" /* SurveyNavigationBase */]));



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactSurvey__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reactquestionelement__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyWindow; });




var SurveyWindow = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyWindow, _super);
    function SurveyWindow(props) {
        var _this = _super.call(this, props) || this;
        _this.handleOnExpanded = _this.handleOnExpanded.bind(_this);
        return _this;
    }
    SurveyWindow.prototype.handleOnExpanded = function (event) {
        this.state.expanded = !this.state.expanded;
        this.setState(this.state);
    };
    SurveyWindow.prototype.render = function () {
        if (this.state.hidden)
            return null;
        var header = this.renderHeader();
        var body = this.state.expanded ? this.renderBody() : null;
        var style = { position: "fixed", bottom: "3px", right: "10px" };
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.window.root, style: style },
            header,
            body);
    };
    SurveyWindow.prototype.renderHeader = function () {
        var styleA = { width: "100%" };
        var styleTitle = { paddingRight: "10px" };
        var glyphClassName = this.state.expanded ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
        glyphClassName = "glyphicon pull-right " + glyphClassName;
        var title = __WEBPACK_IMPORTED_MODULE_3__reactquestionelement__["a" /* SurveyElementBase */].renderLocString(this.survey.locTitle);
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.window.header.root },
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("a", { href: "#", onClick: this.handleOnExpanded, style: styleA },
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("span", { className: this.css.window.header.title, style: styleTitle }, title),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("span", { className: glyphClassName, "aria-hidden": "true" })));
    };
    SurveyWindow.prototype.renderBody = function () {
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.window.body }, this.renderSurvey());
    };
    SurveyWindow.prototype.updateSurvey = function (newProps) {
        _super.prototype.updateSurvey.call(this, newProps);
        var hasExpanded = newProps["expanded"] ? newProps.expanded : false;
        this.state = { expanded: hasExpanded, hidden: false };
        var self = this;
        this.survey.onComplete.add(function (s) {
            self.state.hidden = true;
            self.setState(self.state);
        });
    };
    return SurveyWindow;
}(__WEBPACK_IMPORTED_MODULE_2__reactSurvey__["a" /* Survey */]));



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactquestion__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reactquestionelement__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPage; });
/* unused harmony export SurveyPanel */
/* unused harmony export SurveyRow */




var SurveyPage = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyPage, _super);
    function SurveyPage(props) {
        var _this = _super.call(this, props) || this;
        _this.page = props.page;
        _this.survey = props.survey;
        _this.creator = props.creator;
        _this.css = props.css;
        return _this;
    }
    SurveyPage.prototype.componentWillReceiveProps = function (nextProps) {
        this.page = nextProps.page;
        this.survey = nextProps.survey;
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    };
    SurveyPage.prototype.componentDidMount = function () {
        var el = this.refs["root"];
        if (el && this.survey)
            this.survey.afterRenderPage(el);
    };
    SurveyPage.prototype.render = function () {
        if (this.page == null || this.survey == null || this.creator == null)
            return null;
        var title = this.renderTitle();
        var rows = [];
        var questionRows = this.page.rows;
        for (var i = 0; i < questionRows.length; i++) {
            rows.push(this.createRow(questionRows[i], i));
        }
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: "root" },
            title,
            rows));
    };
    SurveyPage.prototype.createRow = function (row, index) {
        var rowName = "row" + (index + 1);
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](SurveyRow, { key: rowName, row: row, survey: this.survey, creator: this.creator, css: this.css });
    };
    SurveyPage.prototype.renderTitle = function () {
        if (!this.page.title || !this.survey.showPageTitles)
            return null;
        var text = __WEBPACK_IMPORTED_MODULE_3__reactquestionelement__["a" /* SurveyElementBase */].renderLocString(this.page.locTitle);
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("h4", { className: this.css.pageTitle }, text));
    };
    return SurveyPage;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));

var SurveyPanel = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyPanel, _super);
    function SurveyPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.panel = props.panel;
        _this.survey = props.survey;
        _this.creator = props.creator;
        _this.css = props.css;
        return _this;
    }
    SurveyPanel.prototype.componentWillReceiveProps = function (nextProps) {
        this.panel = nextProps.panel;
        this.survey = nextProps.survey;
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    };
    SurveyPanel.prototype.componentDidMount = function () {
        var el = this.refs["root"];
        if (el && this.survey)
            this.survey.afterRenderPage(el);
    };
    SurveyPanel.prototype.render = function () {
        if (this.panel == null || this.survey == null || this.creator == null)
            return null;
        var title = this.renderTitle();
        var rows = [];
        var questionRows = this.panel.rows;
        for (var i = 0; i < questionRows.length; i++) {
            rows.push(this.createRow(questionRows[i], i));
        }
        var style = { "marginLeft": this.panel.innerIndent * this.css.question.indent + 'px' };
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: "root" },
            title,
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { style: style }, rows)));
    };
    SurveyPanel.prototype.createRow = function (row, index) {
        var rowName = "row" + (index + 1);
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](SurveyRow, { key: rowName, row: row, survey: this.survey, creator: this.creator, css: this.css });
    };
    SurveyPanel.prototype.renderTitle = function () {
        if (!this.panel.title)
            return null;
        var text = __WEBPACK_IMPORTED_MODULE_3__reactquestionelement__["a" /* SurveyElementBase */].renderLocString(this.panel.locTitle);
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("h4", { className: this.css.pageTitle }, text));
    };
    return SurveyPanel;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));

var SurveyRow = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyRow, _super);
    function SurveyRow(props) {
        var _this = _super.call(this, props) || this;
        _this.setProperties(props);
        return _this;
    }
    SurveyRow.prototype.componentWillReceiveProps = function (nextProps) {
        this.setProperties(nextProps);
    };
    SurveyRow.prototype.setProperties = function (props) {
        this.row = props.row;
        if (this.row) {
            var self = this;
            this.row.visibilityChangedCallback = function () { self.setState({ visible: self.row.visible }); };
        }
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    };
    SurveyRow.prototype.render = function () {
        if (this.row == null || this.survey == null || this.creator == null)
            return null;
        var questions = null;
        if (this.row.visible) {
            questions = [];
            for (var i = 0; i < this.row.elements.length; i++) {
                var question = this.row.elements[i];
                questions.push(this.createQuestion(question));
            }
        }
        var style = this.row.visible ? {} : { display: "none" };
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.row, style: style }, questions));
    };
    SurveyRow.prototype.createQuestion = function (question) {
        if (question.isPanel) {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](SurveyPanel, { key: question.name, panel: question, creator: this.creator, survey: this.survey, css: this.css });
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__reactquestion__["a" /* SurveyQuestion */], { key: question.name, question: question, creator: this.creator, css: this.css });
        }
    };
    return SurveyRow;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__question__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reactquestioncomment__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__reactquestionelement__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__custom_widget__ = __webpack_require__(28);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestion; });
/* unused harmony export SurveyQuestionErrors */






var SurveyQuestion = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyQuestion, _super);
    function SurveyQuestion(props) {
        var _this = _super.call(this, props) || this;
        _this.setQuestion(props.question);
        _this.creator = props.creator;
        _this.css = props.css;
        return _this;
    }
    SurveyQuestion.prototype.componentWillReceiveProps = function (nextProps) {
        this.creator = nextProps.creator;
        this.css = nextProps.css;
        this.setQuestion(nextProps.question);
    };
    SurveyQuestion.prototype.setQuestion = function (question) {
        this.questionBase = question;
        this.question = question instanceof __WEBPACK_IMPORTED_MODULE_2__question__["a" /* Question */] ? question : null;
        var value = this.question ? this.question.value : null;
        this.state = {
            visible: this.questionBase.visible, value: value, error: 0, renderWidth: 0,
            visibleIndexValue: -1, isReadOnly: this.questionBase.isReadOnly
        };
    };
    SurveyQuestion.prototype.componentDidMount = function () {
        if (this.questionBase) {
            var self = this;
            this.questionBase["react"] = self;
            this.questionBase.renderWidthChangedCallback = function () {
                self.state.renderWidth = self.state.renderWidth + 1;
                self.setState(self.state);
            };
            this.questionBase.visibleIndexChangedCallback = function () {
                self.state.visibleIndexValue = self.questionBase.visibleIndex;
                self.setState(self.state);
            };
            this.questionBase.readOnlyChangedCallback = function () {
                self.state.isReadOnly = self.questionBase.isReadOnly;
                self.setState(self.state);
            };
            var el = this.refs["root"];
            if (el && this.questionBase.survey)
                this.questionBase.survey.afterRenderQuestion(this.questionBase, el);
        }
    };
    SurveyQuestion.prototype.componentWillUnmount = function () {
        var el = this.refs["root"];
        if (this.questionBase) {
            this.questionBase["react"] = null;
            this.questionBase.renderWidthChangedCallback = null;
            this.questionBase.visibleIndexChangedCallback = null;
            this.questionBase.readOnlyChangedCallback = null;
        }
    };
    SurveyQuestion.prototype.render = function () {
        if (!this.questionBase || !this.creator)
            return null;
        if (!this.questionBase.visible)
            return null;
        var questionRender = this.renderQuestion();
        var title = this.questionBase.hasTitle ? this.renderTitle() : null;
        var titleTop = this.creator.questionTitleLocation() == "top" ? title : null;
        var titleBottom = this.creator.questionTitleLocation() == "bottom" ? title : null;
        var comment = (this.question && this.question.hasComment) ? this.renderComment() : null;
        var errors = this.renderErrors();
        var paddingLeft = (this.questionBase.indent > 0) ? this.questionBase.indent * this.css.question.indent + "px" : null;
        var paddingRight = (this.questionBase.rightIndent > 0) ? this.questionBase.rightIndent * this.css.question.indent + "px" : null;
        var rootStyle = { display: 'inline-block', verticalAlign: 'top' };
        if (this.questionBase.renderWidth)
            rootStyle["width"] = this.questionBase.renderWidth;
        if (paddingLeft)
            rootStyle["paddingLeft"] = paddingLeft;
        if (paddingRight)
            rootStyle["paddingRight"] = paddingRight;
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { ref: "root", id: this.questionBase.id, className: this.css.question.root, style: rootStyle },
            titleTop,
            errors,
            questionRender,
            comment,
            titleBottom));
    };
    SurveyQuestion.prototype.renderQuestion = function () {
        var customWidget = this.questionBase.customWidget;
        if (!customWidget) {
            return this.creator.createQuestionElement(this.questionBase);
        }
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5__custom_widget__["a" /* SurveyCustomWidget */], { creator: this.creator, question: this.questionBase });
    };
    SurveyQuestion.prototype.renderTitle = function () {
        var titleText = __WEBPACK_IMPORTED_MODULE_4__reactquestionelement__["a" /* SurveyElementBase */].renderLocString(this.question.locTitle);
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("h5", { className: this.css.question.title }, titleText));
    };
    SurveyQuestion.prototype.renderComment = function () {
        var commentText = __WEBPACK_IMPORTED_MODULE_4__reactquestionelement__["a" /* SurveyElementBase */].renderLocString(this.question.locCommentText);
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", null,
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", null, commentText),
            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3__reactquestioncomment__["a" /* SurveyQuestionCommentItem */], { question: this.question, css: this.css })));
    };
    SurveyQuestion.prototype.renderErrors = function () {
        return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](SurveyQuestionErrors, { question: this.question, css: this.css, creator: this.creator });
    };
    return SurveyQuestion;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));

var SurveyQuestionErrors = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyQuestionErrors, _super);
    function SurveyQuestionErrors(props) {
        var _this = _super.call(this, props) || this;
        _this.setQuestion(props.question);
        _this.creator = props.creator;
        _this.css = props.css;
        return _this;
    }
    SurveyQuestionErrors.prototype.componentWillReceiveProps = function (nextProps) {
        this.setQuestion(nextProps.question);
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    };
    SurveyQuestionErrors.prototype.setQuestion = function (question) {
        this.question = question instanceof __WEBPACK_IMPORTED_MODULE_2__question__["a" /* Question */] ? question : null;
        if (this.question) {
            var self = this;
            this.question.errorsChangedCallback = function () {
                self.state.error = self.state.error + 1;
                self.setState(self.state);
            };
        }
        this.state = { error: 0 };
    };
    SurveyQuestionErrors.prototype.render = function () {
        if (!this.question || this.question.errors.length == 0)
            return null;
        var errors = [];
        for (var i = 0; i < this.question.errors.length; i++) {
            var errorText = this.question.errors[i].getText();
            var key = "error" + i;
            errors.push(this.creator.renderError(key, errorText));
        }
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.error.root }, errors));
    };
    return SurveyQuestionErrors;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]));



/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reactquestionelement__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__reactquestionfactory__ = __webpack_require__(13);
/* unused harmony export SurveyQuestionComment */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionCommentItem; });




var SurveyQuestionComment = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyQuestionComment, _super);
    function SurveyQuestionComment(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { value: _this.question.value || '' };
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        _this.handleOnBlur = _this.handleOnBlur.bind(_this);
        return _this;
    }
    Object.defineProperty(SurveyQuestionComment.prototype, "question", {
        get: function () { return this.questionBase; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionComment.prototype.componentWillReceiveProps = function (nextProps) {
        _super.prototype.componentWillReceiveProps.call(this, nextProps);
        this.state = { value: this.question.value || '' };
    };
    SurveyQuestionComment.prototype.handleOnChange = function (event) {
        this.setState({ value: event.target.value });
    };
    SurveyQuestionComment.prototype.handleOnBlur = function (event) {
        this.question.value = event.target.value;
        this.setState({ value: this.question.value || '' });
    };
    SurveyQuestionComment.prototype.render = function () {
        if (!this.question)
            return null;
        if (this.isDisplayMode)
            return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { id: this.question.inputId, className: this.css }, this.question.value));
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("textarea", { id: this.question.inputId, className: this.css, type: "text", value: this.state.value, placeholder: this.question.placeHolder, onBlur: this.handleOnBlur, onChange: this.handleOnChange, cols: this.question.cols, rows: this.question.rows }));
    };
    return SurveyQuestionComment;
}(__WEBPACK_IMPORTED_MODULE_2__reactquestionelement__["b" /* SurveyQuestionElementBase */]));

var SurveyQuestionCommentItem = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyQuestionCommentItem, _super);
    function SurveyQuestionCommentItem(props) {
        var _this = _super.call(this, props) || this;
        _this.question = props.question;
        _this.comment = _this.question.comment;
        _this.state = { value: _this.comment };
        _this.handleOnChange = _this.handleOnChange.bind(_this);
        _this.handleOnBlur = _this.handleOnBlur.bind(_this);
        return _this;
    }
    SurveyQuestionCommentItem.prototype.handleOnChange = function (event) {
        this.comment = event.target.value;
        this.setState({ value: this.comment });
    };
    SurveyQuestionCommentItem.prototype.handleOnBlur = function (event) {
        this.question.comment = this.comment;
    };
    SurveyQuestionCommentItem.prototype.componentWillReceiveProps = function (nextProps) {
        this.question = nextProps.question;
    };
    SurveyQuestionCommentItem.prototype.render = function () {
        if (!this.question)
            return null;
        if (this.isDisplayMode)
            return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("div", { className: this.css.question.comment }, this.comment));
        return (__WEBPACK_IMPORTED_MODULE_1_react__["createElement"]("input", { type: "text", className: this.css.question.comment, value: this.state.value, onChange: this.handleOnChange, onBlur: this.handleOnBlur }));
    };
    return SurveyQuestionCommentItem;
}(__WEBPACK_IMPORTED_MODULE_2__reactquestionelement__["a" /* SurveyElementBase */]));

__WEBPACK_IMPORTED_MODULE_3__reactquestionfactory__["a" /* ReactQuestionFactory */].Instance.registerQuestion("comment", function (props) {
    return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](SurveyQuestionComment, props);
});


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__survey__ = __webpack_require__(36);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReactSurveyModel; });


var ReactSurveyModel = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](ReactSurveyModel, _super);
    function ReactSurveyModel(jsonObj) {
        if (jsonObj === void 0) { jsonObj = null; }
        return _super.call(this, jsonObj) || this;
    }
    ReactSurveyModel.prototype.render = function () {
        if (this.renderCallback) {
            this.renderCallback();
        }
    };
    ReactSurveyModel.prototype.mergeCss = function (src, dest) {
        this.mergeValues(src, dest);
    };
    ReactSurveyModel.prototype.doAfterRenderSurvey = function (el) {
        this.afterRenderSurvey(el);
    };
    ReactSurveyModel.prototype.onLoadSurveyFromService = function () {
        this.render();
    };
    ReactSurveyModel.prototype.onLoadingSurveyFromService = function () {
        this.render();
    };
    return ReactSurveyModel;
}(__WEBPACK_IMPORTED_MODULE_1__survey__["a" /* SurveyModel */]));



/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__jsonobject__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__page__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__textPreProcessor__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__conditionProcessValue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dxSurveyService__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__surveyStrings__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__error__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__questionCustomWidgets__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__localizablestring__ = __webpack_require__(9);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyModel; });











/**
 * Survey object contains information about the survey. Pages, Questions, flow logic and etc.
 */
var SurveyModel = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyModel, _super);
    function SurveyModel(jsonObj) {
        if (jsonObj === void 0) { jsonObj = null; }
        var _this = _super.call(this) || this;
        _this.surveyId = null;
        _this.surveyPostId = null;
        _this.clientId = null;
        /**
         * If the property is not empty, before starting to run the survey, the library checkes if the cookie with this name exists. If it is true, the survey goes to complete mode and an user sees the 'Thank you' page. On completing the survey the cookie with this name is created.
         */
        _this.cookieName = null;
        _this.sendResultOnPageNext = false;
        /**
         * You may show comments input for the most of questions. The entered text in the comment input will be saved as 'question name' + 'commentPrefix'.
         */
        _this.commentPrefix = "-Comment";
        /**
         * On showing the next or previous page, a first input is focused, if the property set to true.
         */
        _this.focusFirstQuestionAutomatic = true;
        /**
         * Set it to false to hide 'Prev', 'Next' and 'Complete' buttons. It makes sense if you are going to create a custom navigation or have just one page or on setting goNextPageAutomatic property.
         * @see goNextPageAutomatic
         */
        _this.showNavigationButtons = true;
        /**
         * Set it to false hide survey title.
         */
        _this.showTitle = true;
        /**
         * Set it to false to hide page titles.
         */
        _this.showPageTitles = true;
        /**
         * On finishing the survey the 'Thank you', page on complete, is shown. Set the property to false, to hide the 'Thank you' page.
         */
        _this.showCompletedPage = true;
        /**
         * A char/string that will be rendered in the title required questions.
         */
        _this.requiredText = "*";
        /**
         * By default the first question index is 1. You may start it from 100 or from 'A', by setting 100 or 'A' to this property.
         */
        _this.questionStartIndex = "";
        _this.showProgressBarValue = "off";
        _this.storeOthersAsComment = true;
        _this.goNextPageAutomatic = false;
        _this.pages = new Array();
        _this.triggers = new Array();
        _this.clearInvisibleValues = false;
        _this.currentPageValue = null;
        _this.valuesHash = {};
        _this.variablesHash = {};
        _this.showPageNumbersValue = false;
        _this.showQuestionNumbersValue = "on";
        _this.questionTitleLocationValue = "top";
        _this.localeValue = "";
        _this.isCompleted = false;
        _this.isLoading = false;
        _this.processedTextValues = {};
        _this.isValidatingOnServerValue = false;
        _this.modeValue = "edit";
        _this.isDesignModeValue = false;
        _this.onComplete = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onPartialSend = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onCurrentPageChanged = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onValueChanged = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onVisibleChanged = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onPageVisibleChanged = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onQuestionAdded = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onQuestionRemoved = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onPanelAdded = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onPanelRemoved = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onValidateQuestion = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onProcessHtml = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onTextMarkdown = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onSendResult = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onGetResult = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onUploadFile = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onAfterRenderSurvey = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onAfterRenderPage = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onAfterRenderQuestion = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onAfterRenderPanel = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.onMatrixRowAdded = new __WEBPACK_IMPORTED_MODULE_2__base__["b" /* Event */]();
        _this.jsonErrors = null;
        _this.isLoadingFromJsonValue = false;
        var self = _this;
        _this.locTitleValue = new __WEBPACK_IMPORTED_MODULE_10__localizablestring__["a" /* LocalizableString */](_this, true);
        _this.locTitleValue.onRenderedHtmlCallback = function (text) { return self.processedTitle; };
        _this.locCompletedHtmlValue = new __WEBPACK_IMPORTED_MODULE_10__localizablestring__["a" /* LocalizableString */](_this);
        _this.locPagePrevTextValue = new __WEBPACK_IMPORTED_MODULE_10__localizablestring__["a" /* LocalizableString */](_this);
        _this.locPageNextTextValue = new __WEBPACK_IMPORTED_MODULE_10__localizablestring__["a" /* LocalizableString */](_this);
        _this.locCompleteTextValue = new __WEBPACK_IMPORTED_MODULE_10__localizablestring__["a" /* LocalizableString */](_this);
        _this.locQuestionTitleTemplateValue = new __WEBPACK_IMPORTED_MODULE_10__localizablestring__["a" /* LocalizableString */](_this, true);
        _this.textPreProcessor = new __WEBPACK_IMPORTED_MODULE_4__textPreProcessor__["a" /* TextPreProcessor */]();
        _this.textPreProcessor.onHasValue = function (name) { return self.hasProcessedTextValue(name); };
        _this.textPreProcessor.onProcess = function (name) { return self.getProcessedTextValue(name); };
        _this.pages.push = function (value) {
            value.data = self;
            return Array.prototype.push.call(this, value);
        };
        _this.triggers.push = function (value) {
            value.setOwner(self);
            return Array.prototype.push.call(this, value);
        };
        _this.updateProcessedTextValues();
        _this.onBeforeCreating();
        if (jsonObj) {
            _this.setJsonObject(jsonObj);
            if (_this.surveyId) {
                _this.loadSurveyFromService(_this.surveyId);
            }
        }
        _this.onCreating();
        return _this;
    }
    SurveyModel.prototype.getType = function () { return "survey"; };
    Object.defineProperty(SurveyModel.prototype, "locale", {
        get: function () { return this.localeValue; },
        set: function (value) {
            this.localeValue = value;
            __WEBPACK_IMPORTED_MODULE_7__surveyStrings__["a" /* surveyLocalization */].currentLocale = value;
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].onLocaleChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    //ILocalizableOwner
    SurveyModel.prototype.getLocale = function () { return this.locale; };
    SurveyModel.prototype.getMarkdownHtml = function (text) {
        var options = { text: text, html: null };
        this.onTextMarkdown.fire(this, options);
        return options.html;
    };
    SurveyModel.prototype.getLocString = function (str) { return __WEBPACK_IMPORTED_MODULE_7__surveyStrings__["a" /* surveyLocalization */].getString(str); };
    Object.defineProperty(SurveyModel.prototype, "emptySurveyText", {
        get: function () { return this.getLocString("emptySurvey"); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "title", {
        get: function () { return this.locTitle.text; },
        set: function (value) { this.locTitle.text = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "locTitle", {
        get: function () { return this.locTitleValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "completedHtml", {
        get: function () { return this.locCompletedHtml.text; },
        set: function (value) { this.locCompletedHtml.text = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "locCompletedHtml", {
        get: function () { return this.locCompletedHtmlValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "pagePrevText", {
        get: function () { return this.locPagePrevText.text ? this.locPagePrevText.text : this.getLocString("pagePrevText"); },
        set: function (newValue) { this.locPagePrevText.text = newValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "locPagePrevText", {
        get: function () { return this.locPagePrevTextValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "pageNextText", {
        get: function () { return this.locPageNextText.text ? this.locPageNextText.text : this.getLocString("pageNextText"); },
        set: function (newValue) { this.locPageNextText.text = newValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "locPageNextText", {
        get: function () { return this.locPageNextTextValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "completeText", {
        get: function () { return this.locCompleteText.text ? this.locCompleteText.text : this.getLocString("completeText"); },
        set: function (newValue) { this.locCompleteText.text = newValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "locCompleteText", {
        get: function () { return this.locCompleteTextValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "questionTitleTemplate", {
        get: function () { return this.locQuestionTitleTemplate.text; },
        set: function (value) { this.locQuestionTitleTemplate.text = value; },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.getQuestionTitleTemplate = function () { return this.locQuestionTitleTemplate.textOrHtml; };
    Object.defineProperty(SurveyModel.prototype, "locQuestionTitleTemplate", {
        get: function () { return this.locQuestionTitleTemplateValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "showPageNumbers", {
        get: function () { return this.showPageNumbersValue; },
        set: function (value) {
            if (value === this.showPageNumbers)
                return;
            this.showPageNumbersValue = value;
            this.updateVisibleIndexes();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "showQuestionNumbers", {
        get: function () { return this.showQuestionNumbersValue; },
        set: function (value) {
            value = value.toLowerCase();
            value = (value === "onpage") ? "onPage" : value;
            if (value === this.showQuestionNumbers)
                return;
            this.showQuestionNumbersValue = value;
            this.updateVisibleIndexes();
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(SurveyModel.prototype, "showProgressBar", {
        get: function () { return this.showProgressBarValue; },
        set: function (newValue) {
            this.showProgressBarValue = newValue.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "processedTitle", {
        get: function () { return this.processText(this.locTitle.textOrHtml); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "questionTitleLocation", {
        get: function () { return this.questionTitleLocationValue; },
        set: function (value) {
            value = value.toLowerCase();
            if (value === this.questionTitleLocationValue)
                return;
            this.questionTitleLocationValue = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(SurveyModel.prototype, "mode", {
        get: function () { return this.modeValue; },
        set: function (value) {
            value = value.toLowerCase();
            if (value == this.mode)
                return;
            if (value != "edit" && value != "display")
                return;
            this.modeValue = value;
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                questions[i].onReadOnlyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "data", {
        get: function () {
            var result = {};
            for (var key in this.valuesHash) {
                result[key] = this.valuesHash[key];
            }
            return result;
        },
        set: function (data) {
            this.valuesHash = {};
            if (data) {
                for (var key in data) {
                    this._setDataValue(data, key);
                    this.checkTriggers(key, data[key], false);
                    if (!this.processedTextValues[key.toLowerCase()]) {
                        this.processedTextValues[key.toLowerCase()] = "value";
                    }
                }
            }
            this.notifyAllQuestionsOnValueChanged();
            this.runConditions();
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype._setDataValue = function (data, key) {
        this.valuesHash[key] = data[key];
    };
    Object.defineProperty(SurveyModel.prototype, "comments", {
        get: function () {
            var result = {};
            for (var key in this.valuesHash) {
                if (key.indexOf(this.commentPrefix) > 0) {
                    result[key] = this.valuesHash[key];
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "visiblePages", {
        get: function () {
            if (this.isDesignMode)
                return this.pages;
            var result = new Array();
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].isVisible) {
                    result.push(this.pages[i]);
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "isEmpty", {
        get: function () { return this.pages.length == 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "PageCount", {
        /**
         * depricated, misspelling, use pageCount property
         */
        get: function () { return this.pageCount; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "pageCount", {
        get: function () {
            return this.pages.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "visiblePageCount", {
        get: function () {
            return this.visiblePages.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "currentPage", {
        get: function () {
            var vPages = this.visiblePages;
            if (this.currentPageValue != null) {
                if (vPages.indexOf(this.currentPageValue) < 0) {
                    this.currentPage = null;
                }
            }
            if (this.currentPageValue == null && vPages.length > 0) {
                this.currentPage = vPages[0];
            }
            return this.currentPageValue;
        },
        set: function (value) {
            var vPages = this.visiblePages;
            if (value != null && vPages.indexOf(value) < 0)
                return;
            if (value == this.currentPageValue)
                return;
            var oldValue = this.currentPageValue;
            this.currentPageValue = value;
            this.updateCustomWidgets(value);
            this.currentPageChanged(value, oldValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "currentPageNo", {
        get: function () {
            return this.visiblePages.indexOf(this.currentPage);
        },
        set: function (value) {
            var vPages = this.visiblePages;
            if (value < 0 || value >= this.visiblePages.length)
                return;
            this.currentPage = this.visiblePages[value];
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.focusFirstQuestion = function () {
        if (this.currentPageValue) {
            this.currentPageValue.scrollToTop();
            this.currentPageValue.focusFirstQuestion();
        }
    };
    Object.defineProperty(SurveyModel.prototype, "state", {
        get: function () {
            if (this.isLoading)
                return "loading";
            if (this.isCompleted)
                return "completed";
            return (this.currentPage) ? "running" : "empty";
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.clear = function (clearData, gotoFirstPage) {
        if (clearData === void 0) { clearData = true; }
        if (gotoFirstPage === void 0) { gotoFirstPage = true; }
        if (clearData) {
            this.data = null;
            this.variablesHash = {};
        }
        this.isCompleted = false;
        if (gotoFirstPage && this.visiblePageCount > 0) {
            this.currentPage = this.visiblePages[0];
        }
    };
    SurveyModel.prototype.mergeValues = function (src, dest) {
        if (!dest || !src)
            return;
        for (var key in src) {
            var value = src[key];
            if (value && typeof value === 'object') {
                if (!dest[key])
                    dest[key] = {};
                this.mergeValues(value, dest[key]);
            }
            else {
                dest[key] = value;
            }
        }
    };
    SurveyModel.prototype.updateCustomWidgets = function (page) {
        if (!page)
            return;
        for (var i = 0; i < page.questions.length; i++) {
            page.questions[i].customWidget = __WEBPACK_IMPORTED_MODULE_9__questionCustomWidgets__["a" /* CustomWidgetCollection */].Instance.getCustomWidget(page.questions[i]);
        }
    };
    SurveyModel.prototype.currentPageChanged = function (newValue, oldValue) {
        this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
    };
    SurveyModel.prototype.getProgress = function () {
        if (this.currentPage == null)
            return 0;
        var index = this.visiblePages.indexOf(this.currentPage) + 1;
        return Math.ceil((index * 100 / this.visiblePageCount));
    };
    Object.defineProperty(SurveyModel.prototype, "isNavigationButtonsShowing", {
        get: function () {
            if (this.isDesignMode)
                return false;
            var page = this.currentPage;
            if (!page)
                return false;
            return page.navigationButtonsVisibility == "show" ||
                (page.navigationButtonsVisibility != "hide" && this.showNavigationButtons);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "isEditMode", {
        get: function () { return this.mode == "edit"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "isDisplayMode", {
        get: function () { return this.mode == "display"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "isDesignMode", {
        get: function () { return this.isDesignModeValue; },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.setDesignMode = function (value) {
        this.isDesignModeValue = value;
    };
    Object.defineProperty(SurveyModel.prototype, "hasCookie", {
        get: function () {
            if (!this.cookieName)
                return false;
            var cookies = document.cookie;
            return cookies && cookies.indexOf(this.cookieName + "=true") > -1;
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.setCookie = function () {
        if (!this.cookieName)
            return;
        document.cookie = this.cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT";
    };
    SurveyModel.prototype.deleteCookie = function () {
        if (!this.cookieName)
            return;
        document.cookie = this.cookieName + "=;";
    };
    SurveyModel.prototype.nextPage = function () {
        if (this.isLastPage)
            return false;
        if (this.isEditMode && this.isCurrentPageHasErrors)
            return false;
        if (this.doServerValidation())
            return false;
        this.doNextPage();
        return true;
    };
    Object.defineProperty(SurveyModel.prototype, "isCurrentPageHasErrors", {
        get: function () {
            if (this.currentPage == null)
                return true;
            return this.currentPage.hasErrors(true, true);
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.prevPage = function () {
        if (this.isFirstPage)
            return false;
        var vPages = this.visiblePages;
        var index = vPages.indexOf(this.currentPage);
        this.currentPage = vPages[index - 1];
    };
    SurveyModel.prototype.completeLastPage = function () {
        if (this.isEditMode && this.isCurrentPageHasErrors)
            return false;
        if (this.doServerValidation())
            return false;
        this.doComplete();
        return true;
    };
    Object.defineProperty(SurveyModel.prototype, "isFirstPage", {
        get: function () {
            if (this.currentPage == null)
                return true;
            return this.visiblePages.indexOf(this.currentPage) == 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "isLastPage", {
        get: function () {
            if (this.currentPage == null)
                return true;
            var vPages = this.visiblePages;
            return vPages.indexOf(this.currentPage) == vPages.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.doComplete = function () {
        var previousCookie = this.hasCookie;
        this.clearUnusedValues();
        this.setCookie();
        this.setCompleted();
        this.onComplete.fire(this, null);
        if (!previousCookie && this.surveyPostId) {
            this.sendResult();
        }
    };
    Object.defineProperty(SurveyModel.prototype, "isValidatingOnServer", {
        get: function () { return this.isValidatingOnServerValue; },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.setIsValidatingOnServer = function (val) {
        if (val == this.isValidatingOnServer)
            return;
        this.isValidatingOnServerValue = val;
        this.onIsValidatingOnServerChanged();
    };
    SurveyModel.prototype.onIsValidatingOnServerChanged = function () { };
    SurveyModel.prototype.doServerValidation = function () {
        if (!this.onServerValidateQuestions)
            return false;
        var self = this;
        var options = { data: {}, errors: {}, survey: this, complete: function () { self.completeServerValidation(options); } };
        for (var i = 0; i < this.currentPage.questions.length; i++) {
            var question = this.currentPage.questions[i];
            if (!question.visible)
                continue;
            var value = this.getValue(question.name);
            if (!__WEBPACK_IMPORTED_MODULE_2__base__["c" /* Base */].isValueEmpty(value))
                options.data[question.name] = value;
        }
        this.setIsValidatingOnServer(true);
        this.onServerValidateQuestions(this, options);
        return true;
    };
    SurveyModel.prototype.completeServerValidation = function (options) {
        this.setIsValidatingOnServer(false);
        if (!options && !options.survey)
            return;
        var self = options.survey;
        var hasErrors = false;
        if (options.errors) {
            for (var name in options.errors) {
                var question = self.getQuestionByName(name);
                if (question && question["errors"]) {
                    hasErrors = true;
                    question["addError"](new __WEBPACK_IMPORTED_MODULE_8__error__["a" /* CustomError */](options.errors[name]));
                }
            }
        }
        if (!hasErrors) {
            if (self.isLastPage)
                self.doComplete();
            else
                self.doNextPage();
        }
    };
    SurveyModel.prototype.doNextPage = function () {
        this.checkOnPageTriggers();
        if (this.sendResultOnPageNext) {
            this.sendResult(this.surveyPostId, this.clientId, true);
        }
        var vPages = this.visiblePages;
        var index = vPages.indexOf(this.currentPage);
        this.currentPage = vPages[index + 1];
    };
    SurveyModel.prototype.setCompleted = function () {
        this.isCompleted = true;
    };
    Object.defineProperty(SurveyModel.prototype, "processedCompletedHtml", {
        get: function () {
            if (this.completedHtml) {
                return this.processHtml(this.completedHtml);
            }
            return "<h3>" + this.getLocString("completingSurvey") + "</h3>";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "processedLoadingHtml", {
        get: function () {
            return "<h3>" + this.getLocString("loadingSurvey") + "</h3>";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyModel.prototype, "progressText", {
        get: function () {
            if (this.currentPage == null)
                return "";
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage) + 1;
            return this.getLocString("progressText")["format"](index, vPages.length);
        },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.afterRenderSurvey = function (htmlElement) {
        this.onAfterRenderSurvey.fire(this, { survey: this, htmlElement: htmlElement });
    };
    SurveyModel.prototype.afterRenderPage = function (htmlElement) {
        if (this.onAfterRenderPage.isEmpty)
            return;
        this.onAfterRenderPage.fire(this, { page: this.currentPage, htmlElement: htmlElement });
    };
    SurveyModel.prototype.afterRenderQuestion = function (question, htmlElement) {
        this.onAfterRenderQuestion.fire(this, { question: question, htmlElement: htmlElement });
    };
    SurveyModel.prototype.afterRenderPanel = function (panel, htmlElement) {
        this.onAfterRenderPanel.fire(this, { panel: panel, htmlElement: htmlElement });
    };
    SurveyModel.prototype.matrixRowAdded = function (question) {
        this.onMatrixRowAdded.fire(this, { question: question });
    };
    SurveyModel.prototype.uploadFile = function (name, file, storeDataAsText, uploadingCallback) {
        var accept = true;
        this.onUploadFile.fire(this, { name: name, file: file, accept: accept });
        if (!accept)
            return false;
        if (!storeDataAsText && this.surveyPostId) {
            this.uploadFileCore(name, file, uploadingCallback);
        }
        return true;
    };
    SurveyModel.prototype.uploadFileCore = function (name, file, uploadingCallback) {
        var self = this;
        if (uploadingCallback)
            uploadingCallback("uploading");
        new __WEBPACK_IMPORTED_MODULE_6__dxSurveyService__["a" /* dxSurveyService */]().sendFile(this.surveyPostId, file, function (success, response) {
            if (uploadingCallback)
                uploadingCallback(success ? "success" : "error");
            if (success) {
                self.setValue(name, response);
            }
        });
    };
    SurveyModel.prototype.getPage = function (index) {
        return this.pages[index];
    };
    SurveyModel.prototype.addPage = function (page) {
        if (page == null)
            return;
        this.pages.push(page);
        this.updateVisibleIndexes();
    };
    SurveyModel.prototype.addNewPage = function (name) {
        var page = this.createNewPage(name);
        this.addPage(page);
        return page;
    };
    SurveyModel.prototype.removePage = function (page) {
        var index = this.pages.indexOf(page);
        if (index < 0)
            return;
        this.pages.splice(index, 1);
        if (this.currentPageValue == page) {
            this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
        }
        this.updateVisibleIndexes();
    };
    SurveyModel.prototype.getQuestionByName = function (name, caseInsensitive) {
        if (caseInsensitive === void 0) { caseInsensitive = false; }
        var questions = this.getAllQuestions();
        if (caseInsensitive)
            name = name.toLowerCase();
        for (var i = 0; i < questions.length; i++) {
            var questionName = questions[i].name;
            if (caseInsensitive)
                questionName = questionName.toLowerCase();
            if (questionName == name)
                return questions[i];
        }
        return null;
    };
    SurveyModel.prototype.getQuestionsByNames = function (names, caseInsensitive) {
        if (caseInsensitive === void 0) { caseInsensitive = false; }
        var result = [];
        if (!names)
            return result;
        for (var i = 0; i < names.length; i++) {
            if (!names[i])
                continue;
            var question = this.getQuestionByName(names[i], caseInsensitive);
            if (question)
                result.push(question);
        }
        return result;
    };
    SurveyModel.prototype.getPageByElement = function (element) {
        for (var i = 0; i < this.pages.length; i++) {
            var page = this.pages[i];
            if (page.containsElement(element))
                return page;
        }
        return null;
    };
    SurveyModel.prototype.getPageByQuestion = function (question) {
        return this.getPageByElement(question);
    };
    SurveyModel.prototype.getPageByName = function (name) {
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].name == name)
                return this.pages[i];
        }
        return null;
    };
    SurveyModel.prototype.getPagesByNames = function (names) {
        var result = [];
        if (!names)
            return result;
        for (var i = 0; i < names.length; i++) {
            if (!names[i])
                continue;
            var page = this.getPageByName(names[i]);
            if (page)
                result.push(page);
        }
        return result;
    };
    SurveyModel.prototype.getAllQuestions = function (visibleOnly) {
        if (visibleOnly === void 0) { visibleOnly = false; }
        var result = new Array();
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].addQuestionsToList(result, visibleOnly);
        }
        return result;
    };
    SurveyModel.prototype.createNewPage = function (name) { return new __WEBPACK_IMPORTED_MODULE_3__page__["a" /* PageModel */](name); };
    SurveyModel.prototype.notifyQuestionOnValueChanged = function (name, newValue) {
        var questions = this.getAllQuestions();
        var question = null;
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].name != name)
                continue;
            question = questions[i];
            this.doSurveyValueChanged(question, newValue);
        }
        this.onValueChanged.fire(this, { 'name': name, 'question': question, 'value': newValue });
    };
    SurveyModel.prototype.notifyAllQuestionsOnValueChanged = function () {
        var questions = this.getAllQuestions();
        for (var i = 0; i < questions.length; i++) {
            this.doSurveyValueChanged(questions[i], this.getValue(questions[i].name));
        }
    };
    SurveyModel.prototype.doSurveyValueChanged = function (question, newValue) {
        question.onSurveyValueChanged(newValue);
    };
    SurveyModel.prototype.checkOnPageTriggers = function () {
        var questions = this.getCurrentPageQuestions();
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            var value = this.getValue(question.name);
            this.checkTriggers(question.name, value, true);
        }
    };
    SurveyModel.prototype.getCurrentPageQuestions = function () {
        var result = [];
        var page = this.currentPage;
        if (!page)
            return result;
        for (var i = 0; i < page.questions.length; i++) {
            var question = page.questions[i];
            if (!question.visible || !question.name)
                continue;
            result.push(question);
        }
        return result;
    };
    SurveyModel.prototype.checkTriggers = function (name, newValue, isOnNextPage) {
        for (var i = 0; i < this.triggers.length; i++) {
            var trigger = this.triggers[i];
            if (trigger.name == name && trigger.isOnNextPage == isOnNextPage) {
                trigger.check(newValue);
            }
        }
    };
    SurveyModel.prototype.doElementsOnLoad = function () {
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].onSurveyLoad();
        }
    };
    SurveyModel.prototype.runConditions = function () {
        var pages = this.pages;
        for (var i = 0; i < pages.length; i++) {
            pages[i].runCondition(this.valuesHash);
        }
    };
    SurveyModel.prototype.sendResult = function (postId, clientId, isPartialCompleted) {
        if (postId === void 0) { postId = null; }
        if (clientId === void 0) { clientId = null; }
        if (isPartialCompleted === void 0) { isPartialCompleted = false; }
        if (!this.isEditMode)
            return;
        if (isPartialCompleted && this.onPartialSend) {
            this.onPartialSend.fire(this, null);
        }
        if (!postId && this.surveyPostId) {
            postId = this.surveyPostId;
        }
        if (!postId)
            return;
        if (clientId) {
            this.clientId = clientId;
        }
        if (isPartialCompleted && !this.clientId)
            return;
        var self = this;
        new __WEBPACK_IMPORTED_MODULE_6__dxSurveyService__["a" /* dxSurveyService */]().sendResult(postId, this.data, function (success, response) {
            self.onSendResult.fire(self, { success: success, response: response });
        }, this.clientId, isPartialCompleted);
    };
    SurveyModel.prototype.getResult = function (resultId, name) {
        var self = this;
        new __WEBPACK_IMPORTED_MODULE_6__dxSurveyService__["a" /* dxSurveyService */]().getResult(resultId, name, function (success, data, dataList, response) {
            self.onGetResult.fire(self, { success: success, data: data, dataList: dataList, response: response });
        });
    };
    SurveyModel.prototype.loadSurveyFromService = function (surveyId) {
        if (surveyId === void 0) { surveyId = null; }
        if (surveyId) {
            this.surveyId = surveyId;
        }
        var self = this;
        this.isLoading = true;
        this.onLoadingSurveyFromService();
        new __WEBPACK_IMPORTED_MODULE_6__dxSurveyService__["a" /* dxSurveyService */]().loadSurvey(this.surveyId, function (success, result, response) {
            self.isLoading = false;
            if (success && result) {
                self.setJsonObject(result);
                self.notifyAllQuestionsOnValueChanged();
                self.onLoadSurveyFromService();
            }
        });
    };
    SurveyModel.prototype.onLoadingSurveyFromService = function () {
    };
    SurveyModel.prototype.onLoadSurveyFromService = function () {
    };
    SurveyModel.prototype.checkPageVisibility = function (question, oldQuestionVisible) {
        var page = this.getPageByQuestion(question);
        if (!page)
            return;
        var newValue = page.isVisible;
        if (newValue != page.getIsPageVisible(question) || oldQuestionVisible) {
            this.pageVisibilityChanged(page, newValue);
        }
    };
    SurveyModel.prototype.updateVisibleIndexes = function () {
        this.updatePageVisibleIndexes(this.showPageNumbers);
        if (this.showQuestionNumbers == "onPage") {
            var visPages = this.visiblePages;
            for (var i = 0; i < visPages.length; i++) {
                this.updateQuestionVisibleIndexes(visPages[i].questions, true);
            }
        }
        else {
            this.updateQuestionVisibleIndexes(this.getAllQuestions(false), this.showQuestionNumbers == "on");
        }
    };
    SurveyModel.prototype.updatePageVisibleIndexes = function (showIndex) {
        var index = 0;
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].visibleIndex = this.pages[i].visible ? (index++) : -1;
            this.pages[i].num = showIndex && this.pages[i].visible ? this.pages[i].visibleIndex + 1 : -1;
        }
    };
    SurveyModel.prototype.updateQuestionVisibleIndexes = function (questions, showIndex) {
        var index = 0;
        for (var i = 0; i < questions.length; i++) {
            questions[i].setVisibleIndex(showIndex && questions[i].visible && questions[i].hasTitle ? (index++) : -1);
        }
    };
    Object.defineProperty(SurveyModel.prototype, "isLoadingFromJson", {
        get: function () { return this.isLoadingFromJsonValue; },
        enumerable: true,
        configurable: true
    });
    SurveyModel.prototype.setJsonObject = function (jsonObj) {
        if (!jsonObj)
            return;
        this.jsonErrors = null;
        this.isLoadingFromJsonValue = true;
        var jsonConverter = new __WEBPACK_IMPORTED_MODULE_1__jsonobject__["a" /* JsonObject */]();
        jsonConverter.toObject(jsonObj, this);
        if (jsonConverter.errors.length > 0) {
            this.jsonErrors = jsonConverter.errors;
        }
        this.runConditions();
        this.updateVisibleIndexes();
        this.updateProcessedTextValues();
        this.isLoadingFromJsonValue = false;
        if (this.hasCookie) {
            this.doComplete();
        }
        this.doElementsOnLoad();
    };
    SurveyModel.prototype.onBeforeCreating = function () { };
    SurveyModel.prototype.onCreating = function () { };
    SurveyModel.prototype.updateProcessedTextValues = function () {
        this.processedTextValues = {};
        var self = this;
        this.processedTextValues["pageno"] = function (name) { return self.currentPage != null ? self.visiblePages.indexOf(self.currentPage) + 1 : 0; };
        this.processedTextValues["pagecount"] = function (name) { return self.visiblePageCount; };
        var questions = this.getAllQuestions();
        for (var i = 0; i < questions.length; i++) {
            this.addQuestionToProcessedTextValues(questions[i]);
        }
    };
    SurveyModel.prototype.addQuestionToProcessedTextValues = function (question) {
        this.processedTextValues[question.name.toLowerCase()] = "question";
    };
    SurveyModel.prototype.hasProcessedTextValue = function (name) {
        var firstName = new __WEBPACK_IMPORTED_MODULE_5__conditionProcessValue__["a" /* ProcessValue */]().getFirstName(name);
        return this.processedTextValues[firstName.toLowerCase()];
    };
    SurveyModel.prototype.getProcessedTextValue = function (name) {
        var firstName = new __WEBPACK_IMPORTED_MODULE_5__conditionProcessValue__["a" /* ProcessValue */]().getFirstName(name);
        var val = this.processedTextValues[firstName.toLowerCase()];
        if (!val)
            return null;
        if (val == "variable") {
            return this.getVariable(name.toLowerCase());
        }
        if (val == "question") {
            var question = this.getQuestionByName(firstName, true);
            if (!question)
                return null;
            name = question.name + name.substr(firstName.length);
            return new __WEBPACK_IMPORTED_MODULE_5__conditionProcessValue__["a" /* ProcessValue */]().getValue(name, this.valuesHash);
        }
        if (val == "value") {
            return new __WEBPACK_IMPORTED_MODULE_5__conditionProcessValue__["a" /* ProcessValue */]().getValue(name, this.valuesHash);
        }
        return val(name);
    };
    SurveyModel.prototype.clearUnusedValues = function () {
        var questions = this.getAllQuestions();
        for (var i = 0; i < questions.length; i++) {
            questions[i].clearUnusedValues();
        }
        if (this.clearInvisibleValues) {
            this.clearInvisibleQuestionValues();
        }
    };
    SurveyModel.prototype.clearInvisibleQuestionValues = function () {
        var questions = this.getAllQuestions();
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].visible)
                continue;
            this.clearValue(questions[i].name);
        }
    };
    SurveyModel.prototype.getVariable = function (name) {
        if (!name)
            return null;
        return this.variablesHash[name];
    };
    SurveyModel.prototype.setVariable = function (name, newValue) {
        if (!name)
            return;
        this.variablesHash[name] = newValue;
        this.processedTextValues[name.toLowerCase()] = "variable";
    };
    //ISurvey data
    SurveyModel.prototype.getUnbindValue = function (value) {
        if (value && value instanceof Object) {
            //do not return the same object instance!!!
            return JSON.parse(JSON.stringify(value));
        }
        return value;
    };
    SurveyModel.prototype.getValue = function (name) {
        if (!name || name.length == 0)
            return null;
        var value = this.valuesHash[name];
        return this.getUnbindValue(value);
    };
    SurveyModel.prototype.setValue = function (name, newValue) {
        if (this.isValueEqual(name, newValue))
            return;
        if (newValue === "" || newValue === null) {
            delete this.valuesHash[name];
        }
        else {
            newValue = this.getUnbindValue(newValue);
            this.valuesHash[name] = newValue;
            this.processedTextValues[name.toLowerCase()] = "value";
        }
        this.notifyQuestionOnValueChanged(name, newValue);
        this.checkTriggers(name, newValue, false);
        this.runConditions();
        this.tryGoNextPageAutomatic(name);
    };
    SurveyModel.prototype.isValueEqual = function (name, newValue) {
        if (newValue == "")
            newValue = null;
        var oldValue = this.getValue(name);
        if (newValue === null || oldValue === null)
            return newValue === oldValue;
        return this.isTwoValueEquals(newValue, oldValue);
    };
    SurveyModel.prototype.tryGoNextPageAutomatic = function (name) {
        if (!this.goNextPageAutomatic || !this.currentPage)
            return;
        var question = this.getQuestionByName(name);
        if (question && (!question.visible || !question.supportGoNextPageAutomatic()))
            return;
        var questions = this.getCurrentPageQuestions();
        for (var i = 0; i < questions.length; i++) {
            var value = this.getValue(questions[i].name);
            if (questions[i].hasInput && __WEBPACK_IMPORTED_MODULE_2__base__["c" /* Base */].isValueEmpty(value))
                return;
        }
        if (!this.currentPage.hasErrors(true, false)) {
            if (!this.isLastPage) {
                this.nextPage();
            }
            else {
                this.doComplete();
            }
        }
    };
    SurveyModel.prototype.getComment = function (name) {
        var result = this.data[name + this.commentPrefix];
        if (result == null)
            result = "";
        return result;
    };
    SurveyModel.prototype.setComment = function (name, newValue) {
        var commentName = name + this.commentPrefix;
        if (newValue === "" || newValue === null) {
            delete this.valuesHash[commentName];
        }
        else {
            this.valuesHash[commentName] = newValue;
            this.tryGoNextPageAutomatic(name);
        }
        var question = this.getQuestionByName(name);
        if (question) {
            this.onValueChanged.fire(this, { 'name': commentName, 'question': question, 'value': newValue });
        }
    };
    /**
     * Remove the value from the survey result.
     * @param {string} name The name of the value. Typically it is a question name
     */
    SurveyModel.prototype.clearValue = function (name) {
        this.setValue(name, null);
        this.setComment(name, null);
    };
    SurveyModel.prototype.questionVisibilityChanged = function (question, newValue) {
        this.updateVisibleIndexes();
        this.onVisibleChanged.fire(this, { 'question': question, 'name': question.name, 'visible': newValue });
        this.checkPageVisibility(question, !newValue);
    };
    SurveyModel.prototype.pageVisibilityChanged = function (page, newValue) {
        this.updateVisibleIndexes();
        this.onPageVisibleChanged.fire(this, { 'page': page, 'visible': newValue });
    };
    SurveyModel.prototype.questionAdded = function (question, index, parentPanel, rootPanel) {
        this.updateVisibleIndexes();
        this.addQuestionToProcessedTextValues(question);
        this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index, 'parentPanel': parentPanel, 'rootPanel': rootPanel });
    };
    SurveyModel.prototype.questionRemoved = function (question) {
        this.updateVisibleIndexes();
        this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
    };
    SurveyModel.prototype.panelAdded = function (panel, index, parentPanel, rootPanel) {
        this.updateVisibleIndexes();
        this.onPanelAdded.fire(this, { 'panel': panel, 'name': panel.name, 'index': index, 'parentPanel': parentPanel, 'rootPanel': rootPanel });
    };
    SurveyModel.prototype.panelRemoved = function (panel) {
        this.updateVisibleIndexes();
        this.onPanelRemoved.fire(this, { 'panel': panel, 'name': panel.name });
    };
    SurveyModel.prototype.validateQuestion = function (name) {
        if (this.onValidateQuestion.isEmpty)
            return null;
        var options = { name: name, value: this.getValue(name), error: null };
        this.onValidateQuestion.fire(this, options);
        return options.error ? new __WEBPACK_IMPORTED_MODULE_8__error__["a" /* CustomError */](options.error) : null;
    };
    SurveyModel.prototype.processHtml = function (html) {
        var options = { html: html };
        this.onProcessHtml.fire(this, options);
        return this.processText(options.html);
    };
    SurveyModel.prototype.processText = function (text) {
        return this.textPreProcessor.process(text);
    };
    //ISurveyTriggerOwner
    SurveyModel.prototype.getObjects = function (pages, questions) {
        var result = [];
        Array.prototype.push.apply(result, this.getPagesByNames(pages));
        Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
        return result;
    };
    SurveyModel.prototype.setTriggerValue = function (name, value, isVariable) {
        if (!name)
            return;
        if (isVariable) {
            this.setVariable(name, value);
        }
        else {
            this.setValue(name, value);
        }
    };
    return SurveyModel;
}(__WEBPACK_IMPORTED_MODULE_2__base__["c" /* Base */]));

//Make localizable: completedHtml, pagePrevText, pageNextText, completeText
__WEBPACK_IMPORTED_MODULE_1__jsonobject__["a" /* JsonObject */].metaData.addClass("survey", [{ name: "locale", choices: function () { return __WEBPACK_IMPORTED_MODULE_7__surveyStrings__["a" /* surveyLocalization */].getLocales(); } },
    { name: "title", serializationProperty: "locTitle" }, { name: "focusFirstQuestionAutomatic:boolean", default: true },
    { name: "completedHtml:html", serializationProperty: "locCompletedHtml" }, { name: "pages", className: "page", visible: false },
    { name: "questions", baseClassName: "question", visible: false, onGetValue: function (obj) { return null; }, onSetValue: function (obj, value, jsonConverter) { var page = obj.addNewPage(""); jsonConverter.toObject({ questions: value }, page); } },
    { name: "triggers:triggers", baseClassName: "surveytrigger", classNamePart: "trigger" },
    "surveyId", "surveyPostId", "cookieName", "sendResultOnPageNext:boolean",
    { name: "showNavigationButtons:boolean", default: true }, { name: "showTitle:boolean", default: true },
    { name: "showPageTitles:boolean", default: true }, { name: "showCompletedPage:boolean", default: true },
    "showPageNumbers:boolean", { name: "showQuestionNumbers", default: "on", choices: ["on", "onPage", "off"] },
    { name: "questionTitleLocation", default: "top", choices: ["top", "bottom"] },
    { name: "showProgressBar", default: "off", choices: ["off", "top", "bottom"] },
    { name: "mode", default: "edit", choices: ["edit", "display"] },
    { name: "storeOthersAsComment:boolean", default: true }, "goNextPageAutomatic:boolean", "clearInvisibleValues:boolean",
    { name: "pagePrevText", serializationProperty: "locPagePrevText" },
    { name: "pageNextText", serializationProperty: "locPageNextText" },
    { name: "completeText", serializationProperty: "locCompleteText" },
    { name: "requiredText", default: "*" }, "questionStartIndex", { name: "questionTitleTemplate", serializationProperty: "locQuestionTitleTemplate" }]);


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__error__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__surveyStrings__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__jsonobject__ = __webpack_require__(3);
/* unused harmony export ValidatorResult */
/* unused harmony export SurveyValidator */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValidatorRunner; });
/* unused harmony export NumericValidator */
/* unused harmony export TextValidator */
/* unused harmony export AnswerCountValidator */
/* unused harmony export RegexValidator */
/* unused harmony export EmailValidator */





var ValidatorResult = (function () {
    function ValidatorResult(value, error) {
        if (error === void 0) { error = null; }
        this.value = value;
        this.error = error;
    }
    return ValidatorResult;
}());

/**
 * Base SurveyJS validator class.
 */
var SurveyValidator = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](SurveyValidator, _super);
    function SurveyValidator() {
        var _this = _super.call(this) || this;
        _this.text = "";
        return _this;
    }
    SurveyValidator.prototype.getErrorText = function (name) {
        if (this.text)
            return this.text;
        return this.getDefaultErrorText(name);
    };
    SurveyValidator.prototype.getDefaultErrorText = function (name) {
        return "";
    };
    SurveyValidator.prototype.validate = function (value, name) {
        if (name === void 0) { name = null; }
        return null;
    };
    return SurveyValidator;
}(__WEBPACK_IMPORTED_MODULE_1__base__["c" /* Base */]));

var ValidatorRunner = (function () {
    function ValidatorRunner() {
    }
    ValidatorRunner.prototype.run = function (owner) {
        for (var i = 0; i < owner.validators.length; i++) {
            var validatorResult = owner.validators[i].validate(owner.value, owner.getValidatorTitle());
            if (validatorResult != null) {
                if (validatorResult.error)
                    return validatorResult.error;
                if (validatorResult.value) {
                    owner.value = validatorResult.value;
                }
            }
        }
        return null;
    };
    return ValidatorRunner;
}());

/**
 * Validate numeric values.
 */
var NumericValidator = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](NumericValidator, _super);
    function NumericValidator(minValue, maxValue) {
        if (minValue === void 0) { minValue = null; }
        if (maxValue === void 0) { maxValue = null; }
        var _this = _super.call(this) || this;
        _this.minValue = minValue;
        _this.maxValue = maxValue;
        return _this;
    }
    NumericValidator.prototype.getType = function () { return "numericvalidator"; };
    NumericValidator.prototype.validate = function (value, name) {
        if (name === void 0) { name = null; }
        if (!value || !this.isNumber(value)) {
            return new ValidatorResult(null, new __WEBPACK_IMPORTED_MODULE_2__error__["c" /* RequreNumericError */]());
        }
        var result = new ValidatorResult(parseFloat(value));
        if (this.minValue && this.minValue > result.value) {
            result.error = new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(name));
            return result;
        }
        if (this.maxValue && this.maxValue < result.value) {
            result.error = new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(name));
            return result;
        }
        return (typeof value === 'number') ? null : result;
    };
    NumericValidator.prototype.getDefaultErrorText = function (name) {
        var vName = name ? name : "value";
        if (this.minValue && this.maxValue) {
            return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("numericMinMax")["format"](vName, this.minValue, this.maxValue);
        }
        else {
            if (this.minValue) {
                return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("numericMin")["format"](vName, this.minValue);
            }
            return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("numericMax")["format"](vName, this.maxValue);
        }
    };
    NumericValidator.prototype.isNumber = function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };
    return NumericValidator;
}(SurveyValidator));

/**
 * Validate text values
 */
var TextValidator = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](TextValidator, _super);
    function TextValidator(minLength, maxLength) {
        if (minLength === void 0) { minLength = 0; }
        if (maxLength === void 0) { maxLength = 0; }
        var _this = _super.call(this) || this;
        _this.minLength = minLength;
        _this.maxLength = maxLength;
        return _this;
    }
    TextValidator.prototype.getType = function () { return "textvalidator"; };
    TextValidator.prototype.validate = function (value, name) {
        if (name === void 0) { name = null; }
        if (this.minLength > 0 && value.length < this.minLength) {
            return new ValidatorResult(null, new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(name)));
        }
        if (this.maxLength > 0 && value.length > this.maxLength) {
            return new ValidatorResult(null, new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(name)));
        }
        return null;
    };
    TextValidator.prototype.getDefaultErrorText = function (name) {
        if (this.minLength > 0 && this.maxLength > 0)
            return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("textMinMaxLength")["format"](this.minLength, this.maxLength);
        if (this.minLength > 0)
            return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("textMinLength")["format"](this.minLength);
        return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("textMaxLength")["format"](this.maxLength);
    };
    return TextValidator;
}(SurveyValidator));

var AnswerCountValidator = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](AnswerCountValidator, _super);
    function AnswerCountValidator(minCount, maxCount) {
        if (minCount === void 0) { minCount = null; }
        if (maxCount === void 0) { maxCount = null; }
        var _this = _super.call(this) || this;
        _this.minCount = minCount;
        _this.maxCount = maxCount;
        return _this;
    }
    AnswerCountValidator.prototype.getType = function () { return "answercountvalidator"; };
    AnswerCountValidator.prototype.validate = function (value, name) {
        if (name === void 0) { name = null; }
        if (value == null || value.constructor != Array)
            return null;
        var count = value.length;
        if (this.minCount && count < this.minCount) {
            return new ValidatorResult(null, new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(__WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("minSelectError")["format"](this.minCount))));
        }
        if (this.maxCount && count > this.maxCount) {
            return new ValidatorResult(null, new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(__WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("maxSelectError")["format"](this.maxCount))));
        }
        return null;
    };
    AnswerCountValidator.prototype.getDefaultErrorText = function (name) {
        return name;
    };
    return AnswerCountValidator;
}(SurveyValidator));

/**
 * Use it to validate the text by regular expressions.
 */
var RegexValidator = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](RegexValidator, _super);
    function RegexValidator(regex) {
        if (regex === void 0) { regex = null; }
        var _this = _super.call(this) || this;
        _this.regex = regex;
        return _this;
    }
    RegexValidator.prototype.getType = function () { return "regexvalidator"; };
    RegexValidator.prototype.validate = function (value, name) {
        if (name === void 0) { name = null; }
        if (!this.regex || !value)
            return null;
        var re = new RegExp(this.regex);
        if (re.test(value))
            return null;
        return new ValidatorResult(value, new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(name)));
    };
    return RegexValidator;
}(SurveyValidator));

/**
 * Validate e-mail address in the text input
 */
var EmailValidator = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */](EmailValidator, _super);
    function EmailValidator() {
        var _this = _super.call(this) || this;
        _this.re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return _this;
    }
    EmailValidator.prototype.getType = function () { return "emailvalidator"; };
    EmailValidator.prototype.validate = function (value, name) {
        if (name === void 0) { name = null; }
        if (!value)
            return null;
        if (this.re.test(value))
            return null;
        return new ValidatorResult(value, new __WEBPACK_IMPORTED_MODULE_2__error__["a" /* CustomError */](this.getErrorText(name)));
    };
    EmailValidator.prototype.getDefaultErrorText = function (name) {
        return __WEBPACK_IMPORTED_MODULE_3__surveyStrings__["a" /* surveyLocalization */].getString("invalidEmail");
    };
    return EmailValidator;
}(SurveyValidator));

__WEBPACK_IMPORTED_MODULE_4__jsonobject__["a" /* JsonObject */].metaData.addClass("surveyvalidator", ["text"]);
__WEBPACK_IMPORTED_MODULE_4__jsonobject__["a" /* JsonObject */].metaData.addClass("numericvalidator", ["minValue:number", "maxValue:number"], function () { return new NumericValidator(); }, "surveyvalidator");
__WEBPACK_IMPORTED_MODULE_4__jsonobject__["a" /* JsonObject */].metaData.addClass("textvalidator", ["minLength:number", "maxLength:number"], function () { return new TextValidator(); }, "surveyvalidator");
__WEBPACK_IMPORTED_MODULE_4__jsonobject__["a" /* JsonObject */].metaData.addClass("answercountvalidator", ["minCount:number", "maxCount:number"], function () { return new AnswerCountValidator(); }, "surveyvalidator");
__WEBPACK_IMPORTED_MODULE_4__jsonobject__["a" /* JsonObject */].metaData.addClass("regexvalidator", ["regex"], function () { return new RegexValidator(); }, "surveyvalidator");
__WEBPACK_IMPORTED_MODULE_4__jsonobject__["a" /* JsonObject */].metaData.addClass("emailvalidator", [], function () { return new EmailValidator(); }, "surveyvalidator");


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__react__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__react__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__react__) if(["SurveyNG","SurveyWindowNG","default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__react__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_SurveyNG__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyNG", function() { return __WEBPACK_IMPORTED_MODULE_1__angular_SurveyNG__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyWindowNG", function() { return __WEBPACK_IMPORTED_MODULE_1__angular_SurveyNG__["b"]; });





/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3OGMwY2I0MmU5NTc0ZmI4Y2YxNSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9jaHVua3MvaGVscGVycy50cyIsIndlYnBhY2s6Ly8vLi9+L3ByZWFjdC1jb21wYXQvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9qc29ub2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uZWxlbWVudC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVN0cmluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FuZ3VsYXIvU3VydmV5TkcudHN4Iiwid2VicGFjazovLy8uL3NyYy9jb25kaXRpb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9lcnJvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemFibGVzdHJpbmcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbmRpdGlvblByb2Nlc3NWYWx1ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXkudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb25CYXNlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnkudHN4Iiwid2VicGFjazovLy8uL3NyYy90ZXh0UHJlUHJvY2Vzc29yLnRzIiwid2VicGFjazovLy8uL34vcHJlYWN0L2Rpc3QvcHJlYWN0LmpzIiwid2VicGFjazovLy8uL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL34vcHJvcHR5cGVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9jb25kaXRpb25zUGFyc2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkLnRzIiwid2VicGFjazovLy8uL3NyYy9keFN1cnZleVNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhbmVsLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25DdXN0b21XaWRnZXRzLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvY3VzdG9tLXdpZGdldC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0U3VydmV5UHJvZ3Jlc3MudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleVdpbmRvdy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cGFnZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb24udHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0c3VydmV5bW9kZWwudHN4Iiwid2VicGFjazovLy8uL3NyYy9zdXJ2ZXkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9hbmd1bGFyLnRzIl0sIm5hbWVzIjpbInZlcnNpb24iLCJFTEVNRU5UUyIsInNwbGl0IiwiUkVBQ1RfRUxFTUVOVF9UWVBFIiwiU3ltYm9sIiwiZm9yIiwiQ09NUE9ORU5UX1dSQVBQRVJfS0VZIiwiQVVUT0JJTkRfQkxBQ0tMSVNUIiwiY29uc3RydWN0b3IiLCJyZW5kZXIiLCJzaG91bGRDb21wb25lbnRVcGRhdGUiLCJjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIiwiY29tcG9uZW50V2lsbFVwZGF0ZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsImNvbXBvbmVudFdpbGxNb3VudCIsImNvbXBvbmVudERpZE1vdW50IiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJjb21wb25lbnREaWRVbm1vdW50IiwiQ0FNRUxfUFJPUFMiLCJCWVBBU1NfSE9PSyIsIkRFViIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIkVtcHR5Q29tcG9uZW50IiwiVk5vZGUiLCJwcm90b3R5cGUiLCIkJHR5cGVvZiIsInByZWFjdENvbXBhdFVwZ3JhZGVkIiwicHJlYWN0Q29tcGF0Tm9ybWFsaXplZCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0Iiwibm9kZU5hbWUiLCJzZXQiLCJ2IiwiY29uZmlndXJhYmxlIiwiYXR0cmlidXRlcyIsIm9sZEV2ZW50SG9vayIsImV2ZW50IiwiZSIsInBlcnNpc3QiLCJuYXRpdmVFdmVudCIsIm9sZFZub2RlSG9vayIsInZub2RlIiwidGFnIiwiYXR0cnMiLCJjaGlsZHJlbiIsImxlbmd0aCIsInVuZGVmaW5lZCIsIm5vcm1hbGl6ZVZOb2RlIiwiaGFuZGxlQ29tcG9uZW50Vk5vZGUiLCJkZWZhdWx0VmFsdWUiLCJ2YWx1ZSIsImhhbmRsZUVsZW1lbnRWTm9kZSIsImEiLCJkZWZhdWx0UHJvcHMiLCJleHRlbmQiLCJzaG91bGRTYW5pdGl6ZSIsImkiLCJ0ZXN0IiwiaGFzT3duUHJvcGVydHkiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJwYXJlbnQiLCJjYWxsYmFjayIsInByZXYiLCJfcHJlYWN0Q29tcGF0UmVuZGVyZWQiLCJwYXJlbnROb2RlIiwiY2hpbGROb2RlcyIsInJlbW92ZUNoaWxkIiwib3V0IiwiX2NvbXBvbmVudCIsImJhc2UiLCJDb250ZXh0UHJvdmlkZXIiLCJwcm9wcyIsImNvbnRleHQiLCJyZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lciIsInBhcmVudENvbXBvbmVudCIsImNvbnRhaW5lciIsIndyYXAiLCJjIiwidW5tb3VudENvbXBvbmVudEF0Tm9kZSIsImV4aXN0aW5nIiwiQVJSIiwiQ2hpbGRyZW4iLCJtYXAiLCJmbiIsImN0eCIsInRvQXJyYXkiLCJiaW5kIiwiZm9yRWFjaCIsImNvdW50Iiwib25seSIsIkVycm9yIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uY2F0IiwiY3VycmVudENvbXBvbmVudCIsImNyZWF0ZUZhY3RvcnkiLCJ0eXBlIiwiY3JlYXRlRWxlbWVudCIsIkRPTSIsInVwZ3JhZGVUb1ZOb2RlcyIsImFyciIsIm9mZnNldCIsIm9iaiIsImlzVmFsaWRFbGVtZW50IiwiaXNTdGF0ZWxlc3NDb21wb25lbnQiLCJ3cmFwU3RhdGVsZXNzQ29tcG9uZW50IiwiV3JhcHBlZENvbXBvbmVudCIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJuYW1lIiwic3RhdGVsZXNzQ29tcG9uZW50SG9vayIsIkN0b3IiLCJXcmFwcGVkIiwicHJvcFR5cGVzIiwiYXJncyIsImFwcGx5Q2xhc3NOYW1lIiwicmVmIiwiY3JlYXRlU3RyaW5nUmVmUHJveHkiLCJhcHBseUV2ZW50Tm9ybWFsaXphdGlvbiIsImNsb25lRWxlbWVudCIsImVsZW1lbnQiLCJlbGVtZW50UHJvcHMiLCJub2RlIiwiY29tcG9uZW50IiwiX3JlZlByb3hpZXMiLCJyZWZzIiwicmVzb2x2ZWQiLCJvbmRvdWJsZWNsaWNrIiwib25kYmxjbGljayIsIm9uY2hhbmdlIiwibm9ybWFsaXplZCIsIm9uaW5wdXQiLCJtdWx0aWhvb2siLCJjbCIsImNsYXNzTmFtZSIsImNsYXNzIiwia2V5Iiwic2hhbGxvd0RpZmZlcnMiLCJiIiwiZmluZERPTU5vZGUiLCJGIiwiYmluZEFsbCIsIkNvbXBvbmVudCIsImNhbGwiLCJuZXdDb21wb25lbnRIb29rIiwibWl4aW5zIiwiYXBwbHlNaXhpbnMiLCJjb2xsYXRlTWl4aW5zIiwic3RhdGljcyIsImdldERlZmF1bHRQcm9wcyIsImtleWVkIiwibWl4aW4iLCJwdXNoIiwicHJvdG8iLCJfX2JvdW5kIiwiY2FsbE1ldGhvZCIsIm0iLCJhcHBseSIsImhvb2tzIiwic2tpcER1cGxpY2F0ZXMiLCJyZXQiLCJyIiwiYXJndW1lbnRzIiwicHJvcHNIb29rIiwiYmVmb3JlUmVuZGVyIiwiYWZ0ZXJSZW5kZXIiLCJjdG9yIiwicHJvcCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsIm1lc3NhZ2UiLCJvcHRzIiwic3RhdGUiLCJnZXRJbml0aWFsU3RhdGUiLCJpc1JlYWN0Q29tcG9uZW50IiwicmVwbGFjZVN0YXRlIiwic2V0U3RhdGUiLCJnZXRET01Ob2RlIiwiaXNNb3VudGVkIiwiUHVyZUNvbXBvbmVudCIsIlByb3BUeXBlcyIsInVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O0FDaEVPLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxVQUFVLE1BQU07SUFDdEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxD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TUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ1MsZ0NBQVcsR0FBckIsVUFBc0IsR0FBUSxFQUFFLE1BQVcsRUFBRSxRQUE0QjtRQUNyRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNsQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0QsQ0FBQztZQUNELEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2xELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLENBQUM7SUFDTCxDQUFDO0lBQ1MsK0JB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O0FBQ0E7QUFDQSxpRUFBaUU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrQzs7Ozs7O0FDcmVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7QUN2THRDO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsc0JBQXNCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQiwyQkFBMkI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxP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QUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFDcEssK0RBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQzNILCtEQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsY0FBYyxNQUFNLENBQUMsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN6SzVGO0FBQ3FCO0FBQ00iLCJmaWxlIjoiLi9wYWNrYWdlcy9zdXJ2ZXktYW5ndWxhci9zdXJ2ZXkuYW5ndWxhci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiU3VydmV5XCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN1cnZleVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTdXJ2ZXlcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMzgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDc4YzBjYjQyZTk1NzRmYjhjZjE1IiwiZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdFtcImFzc2lnblwiXSB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdGFyZ2V0W3BdID0gc1twXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKHRoaXNDbGFzcywgYmFzZUNsYXNzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGJhc2VDbGFzcykgaWYgKGJhc2VDbGFzcy5oYXNPd25Qcm9wZXJ0eShwKSkgdGhpc0NsYXNzW3BdID0gYmFzZUNsYXNzW3BdO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSB0aGlzQ2xhc3M7IH1cclxuICAgIHRoaXNDbGFzcy5wcm90b3R5cGUgPSBiYXNlQ2xhc3MgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGJhc2VDbGFzcykgOiAoX18ucHJvdG90eXBlID0gYmFzZUNsYXNzLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59O1xyXG5cclxuZGVjbGFyZSB2YXIgUmVmbGVjdDtcclxuXHJcbmV4cG9ydCB2YXIgX19kZWNvcmF0ZSA9IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VudHJpZXMvY2h1bmtzL2hlbHBlcnMudHMiLCJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3B0eXBlcyc7XG5pbXBvcnQgeyByZW5kZXIgYXMgcHJlYWN0UmVuZGVyLCBjbG9uZUVsZW1lbnQgYXMgcHJlYWN0Q2xvbmVFbGVtZW50LCBoLCBDb21wb25lbnQgYXMgUHJlYWN0Q29tcG9uZW50LCBvcHRpb25zIH0gZnJvbSAncHJlYWN0JztcblxuY29uc3QgdmVyc2lvbiA9ICcxNS4xLjAnOyAvLyB0cmljayBsaWJyYXJpZXMgdG8gdGhpbmsgd2UgYXJlIHJlYWN0XG5cbmNvbnN0IEVMRU1FTlRTID0gJ2EgYWJiciBhZGRyZXNzIGFyZWEgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJhc2UgYmRpIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJyIGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjaXRlIGNvZGUgY29sIGNvbGdyb3VwIGRhdGEgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpYWxvZyBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9vdGVyIGZvcm0gaDEgaDIgaDMgaDQgaDUgaDYgaGVhZCBoZWFkZXIgaGdyb3VwIGhyIGh0bWwgaSBpZnJhbWUgaW1nIGlucHV0IGlucyBrYmQga2V5Z2VuIGxhYmVsIGxlZ2VuZCBsaSBsaW5rIG1haW4gbWFwIG1hcmsgbWVudSBtZW51aXRlbSBtZXRhIG1ldGVyIG5hdiBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHBhcmFtIHBpY3R1cmUgcHJlIHByb2dyZXNzIHEgcnAgcnQgcnVieSBzIHNhbXAgc2NyaXB0IHNlY3Rpb24gc2VsZWN0IHNtYWxsIHNvdXJjZSBzcGFuIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0cmFjayB1IHVsIHZhciB2aWRlbyB3YnIgY2lyY2xlIGNsaXBQYXRoIGRlZnMgZWxsaXBzZSBnIGltYWdlIGxpbmUgbGluZWFyR3JhZGllbnQgbWFzayBwYXRoIHBhdHRlcm4gcG9seWdvbiBwb2x5bGluZSByYWRpYWxHcmFkaWVudCByZWN0IHN0b3Agc3ZnIHRleHQgdHNwYW4nLnNwbGl0KCcgJyk7XG5cbmNvbnN0IFJFQUNUX0VMRU1FTlRfVFlQRSA9ICh0eXBlb2YgU3ltYm9sIT09J3VuZGVmaW5lZCcgJiYgU3ltYm9sLmZvciAmJiBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykpIHx8IDB4ZWFjNztcblxuY29uc3QgQ09NUE9ORU5UX1dSQVBQRVJfS0VZID0gdHlwZW9mIFN5bWJvbCE9PSd1bmRlZmluZWQnID8gU3ltYm9sLmZvcignX19wcmVhY3RDb21wYXRXcmFwcGVyJykgOiAnX19wcmVhY3RDb21wYXRXcmFwcGVyJztcblxuLy8gZG9uJ3QgYXV0b2JpbmQgdGhlc2UgbWV0aG9kcyBzaW5jZSB0aGV5IGFscmVhZHkgaGF2ZSBndWFyYW50ZWVkIGNvbnRleHQuXG5jb25zdCBBVVRPQklORF9CTEFDS0xJU1QgPSB7XG5cdGNvbnN0cnVjdG9yOiAxLFxuXHRyZW5kZXI6IDEsXG5cdHNob3VsZENvbXBvbmVudFVwZGF0ZTogMSxcblx0Y29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogMSxcblx0Y29tcG9uZW50V2lsbFVwZGF0ZTogMSxcblx0Y29tcG9uZW50RGlkVXBkYXRlOiAxLFxuXHRjb21wb25lbnRXaWxsTW91bnQ6IDEsXG5cdGNvbXBvbmVudERpZE1vdW50OiAxLFxuXHRjb21wb25lbnRXaWxsVW5tb3VudDogMSxcblx0Y29tcG9uZW50RGlkVW5tb3VudDogMVxufTtcblxuXG5jb25zdCBDQU1FTF9QUk9QUyA9IC9eKD86YWNjZW50fGFsaWdubWVudHxhcmFiaWN8YmFzZWxpbmV8Y2FwfGNsaXB8Y29sb3J8ZmlsbHxmbG9vZHxmb250fGdseXBofGhvcml6fG1hcmtlcnxvdmVybGluZXxwYWludHxzdG9wfHN0cmlrZXRocm91Z2h8c3Ryb2tlfHRleHR8dW5kZXJsaW5lfHVuaWNvZGV8dW5pdHN8dnx2ZXJ0fHdvcmR8d3JpdGluZ3x4KVtBLVpdLztcblxuXG5jb25zdCBCWVBBU1NfSE9PSyA9IHt9O1xuXG4vKmdsb2JhbCBwcm9jZXNzKi9cbmNvbnN0IERFViA9IHR5cGVvZiBwcm9jZXNzPT09J3VuZGVmaW5lZCcgfHwgIXByb2Nlc3MuZW52IHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WIT09J3Byb2R1Y3Rpb24nO1xuXG4vLyBhIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgbm90aGluZy4gVXNlZCB0byByZXBsYWNlIGNvbXBvbmVudHMgZm9yIHVubW91bnRDb21wb25lbnRBdE5vZGUuXG5mdW5jdGlvbiBFbXB0eUNvbXBvbmVudCgpIHsgcmV0dXJuIG51bGw7IH1cblxuXG5cbi8vIG1ha2UgcmVhY3QgdGhpbmsgd2UncmUgcmVhY3QuXG5sZXQgVk5vZGUgPSBoKCdhJywgbnVsbCkuY29uc3RydWN0b3I7XG5WTm9kZS5wcm90b3R5cGUuJCR0eXBlb2YgPSBSRUFDVF9FTEVNRU5UX1RZUEU7XG5WTm9kZS5wcm90b3R5cGUucHJlYWN0Q29tcGF0VXBncmFkZWQgPSBmYWxzZTtcblZOb2RlLnByb3RvdHlwZS5wcmVhY3RDb21wYXROb3JtYWxpemVkID0gZmFsc2U7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShWTm9kZS5wcm90b3R5cGUsICd0eXBlJywge1xuXHRnZXQoKSB7IHJldHVybiB0aGlzLm5vZGVOYW1lOyB9LFxuXHRzZXQodikgeyB0aGlzLm5vZGVOYW1lID0gdjsgfSxcblx0Y29uZmlndXJhYmxlOnRydWVcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVk5vZGUucHJvdG90eXBlLCAncHJvcHMnLCB7XG5cdGdldCgpIHsgcmV0dXJuIHRoaXMuYXR0cmlidXRlczsgfSxcblx0c2V0KHYpIHsgdGhpcy5hdHRyaWJ1dGVzID0gdjsgfSxcblx0Y29uZmlndXJhYmxlOnRydWVcbn0pO1xuXG5cblxubGV0IG9sZEV2ZW50SG9vayA9IG9wdGlvbnMuZXZlbnQ7XG5vcHRpb25zLmV2ZW50ID0gZSA9PiB7XG5cdGlmIChvbGRFdmVudEhvb2spIGUgPSBvbGRFdmVudEhvb2soZSk7XG5cdGUucGVyc2lzdCA9IE9iamVjdDtcblx0ZS5uYXRpdmVFdmVudCA9IGU7XG5cdHJldHVybiBlO1xufTtcblxuXG5sZXQgb2xkVm5vZGVIb29rID0gb3B0aW9ucy52bm9kZTtcbm9wdGlvbnMudm5vZGUgPSB2bm9kZSA9PiB7XG5cdGlmICghdm5vZGUucHJlYWN0Q29tcGF0VXBncmFkZWQpIHtcblx0XHR2bm9kZS5wcmVhY3RDb21wYXRVcGdyYWRlZCA9IHRydWU7XG5cblx0XHRsZXQgdGFnID0gdm5vZGUubm9kZU5hbWUsXG5cdFx0XHRhdHRycyA9IHZub2RlLmF0dHJpYnV0ZXM7XG5cblx0XHRpZiAoIWF0dHJzKSBhdHRycyA9IHZub2RlLmF0dHJpYnV0ZXMgPSB7fTtcblxuXHRcdGlmICh0eXBlb2YgdGFnPT09J2Z1bmN0aW9uJykge1xuXHRcdFx0aWYgKHRhZ1tDT01QT05FTlRfV1JBUFBFUl9LRVldPT09dHJ1ZSB8fCAodGFnLnByb3RvdHlwZSAmJiAnaXNSZWFjdENvbXBvbmVudCcgaW4gdGFnLnByb3RvdHlwZSkpIHtcblx0XHRcdFx0aWYgKHZub2RlLmNoaWxkcmVuICYmICF2bm9kZS5jaGlsZHJlbi5sZW5ndGgpIHZub2RlLmNoaWxkcmVuID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRpZiAodm5vZGUuY2hpbGRyZW4pIGF0dHJzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG5cblx0XHRcdFx0aWYgKCF2bm9kZS5wcmVhY3RDb21wYXROb3JtYWxpemVkKSB7XG5cdFx0XHRcdFx0bm9ybWFsaXplVk5vZGUodm5vZGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGhhbmRsZUNvbXBvbmVudFZOb2RlKHZub2RlKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAodm5vZGUuY2hpbGRyZW4gJiYgIXZub2RlLmNoaWxkcmVuLmxlbmd0aCkgdm5vZGUuY2hpbGRyZW4gPSB1bmRlZmluZWQ7XG5cdFx0XHRpZiAodm5vZGUuY2hpbGRyZW4pIGF0dHJzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG5cblx0XHRcdGlmIChhdHRycy5kZWZhdWx0VmFsdWUpIHtcblx0XHRcdFx0aWYgKCFhdHRycy52YWx1ZSAmJiBhdHRycy52YWx1ZSE9PTApIHtcblx0XHRcdFx0XHRhdHRycy52YWx1ZSA9IGF0dHJzLmRlZmF1bHRWYWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWxldGUgYXR0cnMuZGVmYXVsdFZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHRoYW5kbGVFbGVtZW50Vk5vZGUodm5vZGUsIGF0dHJzKTtcblx0XHR9XG5cdH1cblxuXHRpZiAob2xkVm5vZGVIb29rKSBvbGRWbm9kZUhvb2sodm5vZGUpO1xufTtcblxuZnVuY3Rpb24gaGFuZGxlQ29tcG9uZW50Vk5vZGUodm5vZGUpIHtcblx0bGV0IHRhZyA9IHZub2RlLm5vZGVOYW1lLFxuXHRcdGEgPSB2bm9kZS5hdHRyaWJ1dGVzO1xuXG5cdHZub2RlLmF0dHJpYnV0ZXMgPSB7fTtcblx0aWYgKHRhZy5kZWZhdWx0UHJvcHMpIGV4dGVuZCh2bm9kZS5hdHRyaWJ1dGVzLCB0YWcuZGVmYXVsdFByb3BzKTtcblx0aWYgKGEpIGV4dGVuZCh2bm9kZS5hdHRyaWJ1dGVzLCBhKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlRWxlbWVudFZOb2RlKHZub2RlLCBhKSB7XG5cdGxldCBzaG91bGRTYW5pdGl6ZSwgYXR0cnMsIGk7XG5cdGlmIChhKSB7XG5cdFx0Zm9yIChpIGluIGEpIGlmICgoc2hvdWxkU2FuaXRpemUgPSBDQU1FTF9QUk9QUy50ZXN0KGkpKSkgYnJlYWs7XG5cdFx0aWYgKHNob3VsZFNhbml0aXplKSB7XG5cdFx0XHRhdHRycyA9IHZub2RlLmF0dHJpYnV0ZXMgPSB7fTtcblx0XHRcdGZvciAoaSBpbiBhKSB7XG5cdFx0XHRcdGlmIChhLmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHRcdFx0YXR0cnNbIENBTUVMX1BST1BTLnRlc3QoaSkgPyBpLnJlcGxhY2UoLyhbQS1aMC05XSkvLCAnLSQxJykudG9Mb3dlckNhc2UoKSA6IGkgXSA9IGFbaV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIHByb3h5IHJlbmRlcigpIHNpbmNlIFJlYWN0IHJldHVybnMgYSBDb21wb25lbnQgcmVmZXJlbmNlLlxuZnVuY3Rpb24gcmVuZGVyKHZub2RlLCBwYXJlbnQsIGNhbGxiYWNrKSB7XG5cdGxldCBwcmV2ID0gcGFyZW50ICYmIHBhcmVudC5fcHJlYWN0Q29tcGF0UmVuZGVyZWQ7XG5cblx0Ly8gaWdub3JlIGltcG9zc2libGUgcHJldmlvdXMgcmVuZGVyc1xuXHRpZiAocHJldiAmJiBwcmV2LnBhcmVudE5vZGUhPT1wYXJlbnQpIHByZXYgPSBudWxsO1xuXG5cdC8vIGRlZmF1bHQgdG8gZmlyc3QgRWxlbWVudCBjaGlsZFxuXHRpZiAoIXByZXYpIHByZXYgPSBwYXJlbnQuY2hpbGRyZW5bMF07XG5cblx0Ly8gcmVtb3ZlIHVuYWZmZWN0ZWQgc2libGluZ3Ncblx0Zm9yIChsZXQgaT1wYXJlbnQuY2hpbGROb2Rlcy5sZW5ndGg7IGktLTsgKSB7XG5cdFx0aWYgKHBhcmVudC5jaGlsZE5vZGVzW2ldIT09cHJldikge1xuXHRcdFx0cGFyZW50LnJlbW92ZUNoaWxkKHBhcmVudC5jaGlsZE5vZGVzW2ldKTtcblx0XHR9XG5cdH1cblxuXHRsZXQgb3V0ID0gcHJlYWN0UmVuZGVyKHZub2RlLCBwYXJlbnQsIHByZXYpO1xuXHRpZiAocGFyZW50KSBwYXJlbnQuX3ByZWFjdENvbXBhdFJlbmRlcmVkID0gb3V0O1xuXHRpZiAodHlwZW9mIGNhbGxiYWNrPT09J2Z1bmN0aW9uJykgY2FsbGJhY2soKTtcblx0cmV0dXJuIG91dCAmJiBvdXQuX2NvbXBvbmVudCB8fCBvdXQuYmFzZTtcbn1cblxuXG5jbGFzcyBDb250ZXh0UHJvdmlkZXIge1xuXHRnZXRDaGlsZENvbnRleHQoKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuY29udGV4dDtcblx0fVxuXHRyZW5kZXIocHJvcHMpIHtcblx0XHRyZXR1cm4gcHJvcHMuY2hpbGRyZW5bMF07XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyU3VidHJlZUludG9Db250YWluZXIocGFyZW50Q29tcG9uZW50LCB2bm9kZSwgY29udGFpbmVyLCBjYWxsYmFjaykge1xuXHRsZXQgd3JhcCA9IGgoQ29udGV4dFByb3ZpZGVyLCB7IGNvbnRleHQ6IHBhcmVudENvbXBvbmVudC5jb250ZXh0IH0sIHZub2RlKTtcblx0bGV0IGMgPSByZW5kZXIod3JhcCwgY29udGFpbmVyKTtcblx0aWYgKGNhbGxiYWNrKSBjYWxsYmFjayhjKTtcblx0cmV0dXJuIGM7XG59XG5cblxuZnVuY3Rpb24gdW5tb3VudENvbXBvbmVudEF0Tm9kZShjb250YWluZXIpIHtcblx0bGV0IGV4aXN0aW5nID0gY29udGFpbmVyLl9wcmVhY3RDb21wYXRSZW5kZXJlZDtcblx0aWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nLnBhcmVudE5vZGU9PT1jb250YWluZXIpIHtcblx0XHRwcmVhY3RSZW5kZXIoaChFbXB0eUNvbXBvbmVudCksIGNvbnRhaW5lciwgZXhpc3RpbmcpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuXG5cbmNvbnN0IEFSUiA9IFtdO1xuXG4vLyBUaGlzIEFQSSBpcyBjb21wbGV0ZWx5IHVubmVjZXNzYXJ5IGZvciBQcmVhY3QsIHNvIGl0J3MgYmFzaWNhbGx5IHBhc3N0aHJvdWdoLlxubGV0IENoaWxkcmVuID0ge1xuXHRtYXAoY2hpbGRyZW4sIGZuLCBjdHgpIHtcblx0XHRpZiAoY2hpbGRyZW4gPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cdFx0Y2hpbGRyZW4gPSBDaGlsZHJlbi50b0FycmF5KGNoaWxkcmVuKTtcblx0XHRpZiAoY3R4ICYmIGN0eCE9PWNoaWxkcmVuKSBmbiA9IGZuLmJpbmQoY3R4KTtcblx0XHRyZXR1cm4gY2hpbGRyZW4ubWFwKGZuKTtcblx0fSxcblx0Zm9yRWFjaChjaGlsZHJlbiwgZm4sIGN0eCkge1xuXHRcdGlmIChjaGlsZHJlbiA9PSBudWxsKSByZXR1cm4gbnVsbDtcblx0XHRjaGlsZHJlbiA9IENoaWxkcmVuLnRvQXJyYXkoY2hpbGRyZW4pO1xuXHRcdGlmIChjdHggJiYgY3R4IT09Y2hpbGRyZW4pIGZuID0gZm4uYmluZChjdHgpO1xuXHRcdGNoaWxkcmVuLmZvckVhY2goZm4pO1xuXHR9LFxuXHRjb3VudChjaGlsZHJlbikge1xuXHRcdHJldHVybiBjaGlsZHJlbiAmJiBjaGlsZHJlbi5sZW5ndGggfHwgMDtcblx0fSxcblx0b25seShjaGlsZHJlbikge1xuXHRcdGNoaWxkcmVuID0gQ2hpbGRyZW4udG9BcnJheShjaGlsZHJlbik7XG5cdFx0aWYgKGNoaWxkcmVuLmxlbmd0aCE9PTEpIHRocm93IG5ldyBFcnJvcignQ2hpbGRyZW4ub25seSgpIGV4cGVjdHMgb25seSBvbmUgY2hpbGQuJyk7XG5cdFx0cmV0dXJuIGNoaWxkcmVuWzBdO1xuXHR9LFxuXHR0b0FycmF5KGNoaWxkcmVuKSB7XG5cdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkgJiYgQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IEFSUi5jb25jYXQoY2hpbGRyZW4pO1xuXHR9XG59O1xuXG5cbi8qKiBUcmFjayBjdXJyZW50IHJlbmRlcigpIGNvbXBvbmVudCBmb3IgcmVmIGFzc2lnbm1lbnQgKi9cbmxldCBjdXJyZW50Q29tcG9uZW50O1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUZhY3RvcnkodHlwZSkge1xuXHRyZXR1cm4gY3JlYXRlRWxlbWVudC5iaW5kKG51bGwsIHR5cGUpO1xufVxuXG5cbmxldCBET00gPSB7fTtcbmZvciAobGV0IGk9RUxFTUVOVFMubGVuZ3RoOyBpLS07ICkge1xuXHRET01bRUxFTUVOVFNbaV1dID0gY3JlYXRlRmFjdG9yeShFTEVNRU5UU1tpXSk7XG59XG5cbmZ1bmN0aW9uIHVwZ3JhZGVUb1ZOb2RlcyhhcnIsIG9mZnNldCkge1xuXHRmb3IgKGxldCBpPW9mZnNldCB8fCAwOyBpPGFyci5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBvYmogPSBhcnJbaV07XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuXHRcdFx0dXBncmFkZVRvVk5vZGVzKG9iaik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG9iaiAmJiB0eXBlb2Ygb2JqPT09J29iamVjdCcgJiYgIWlzVmFsaWRFbGVtZW50KG9iaikgJiYgKChvYmoucHJvcHMgJiYgb2JqLnR5cGUpIHx8IChvYmouYXR0cmlidXRlcyAmJiBvYmoubm9kZU5hbWUpIHx8IG9iai5jaGlsZHJlbikpIHtcblx0XHRcdGFycltpXSA9IGNyZWF0ZUVsZW1lbnQob2JqLnR5cGUgfHwgb2JqLm5vZGVOYW1lLCBvYmoucHJvcHMgfHwgb2JqLmF0dHJpYnV0ZXMsIG9iai5jaGlsZHJlbik7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGlzU3RhdGVsZXNzQ29tcG9uZW50KGMpIHtcblx0cmV0dXJuIHR5cGVvZiBjPT09J2Z1bmN0aW9uJyAmJiAhKGMucHJvdG90eXBlICYmIGMucHJvdG90eXBlLnJlbmRlcik7XG59XG5cblxuLy8gd3JhcHMgc3RhdGVsZXNzIGZ1bmN0aW9uYWwgY29tcG9uZW50cyBpbiBhIFByb3BUeXBlcyB2YWxpZGF0b3JcbmZ1bmN0aW9uIHdyYXBTdGF0ZWxlc3NDb21wb25lbnQoV3JhcHBlZENvbXBvbmVudCkge1xuXHRyZXR1cm4gY3JlYXRlQ2xhc3Moe1xuXHRcdGRpc3BsYXlOYW1lOiBXcmFwcGVkQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IFdyYXBwZWRDb21wb25lbnQubmFtZSxcblx0XHRyZW5kZXIoKSB7XG5cdFx0XHRyZXR1cm4gV3JhcHBlZENvbXBvbmVudCh0aGlzLnByb3BzLCB0aGlzLmNvbnRleHQpO1xuXHRcdH1cblx0fSk7XG59XG5cblxuZnVuY3Rpb24gc3RhdGVsZXNzQ29tcG9uZW50SG9vayhDdG9yKSB7XG5cdGxldCBXcmFwcGVkID0gQ3RvcltDT01QT05FTlRfV1JBUFBFUl9LRVldO1xuXHRpZiAoV3JhcHBlZCkgcmV0dXJuIFdyYXBwZWQ9PT10cnVlID8gQ3RvciA6IFdyYXBwZWQ7XG5cblx0V3JhcHBlZCA9IHdyYXBTdGF0ZWxlc3NDb21wb25lbnQoQ3Rvcik7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFdyYXBwZWQsIENPTVBPTkVOVF9XUkFQUEVSX0tFWSwgeyBjb25maWd1cmFibGU6dHJ1ZSwgdmFsdWU6dHJ1ZSB9KTtcblx0V3JhcHBlZC5kaXNwbGF5TmFtZSA9IEN0b3IuZGlzcGxheU5hbWU7XG5cdFdyYXBwZWQucHJvcFR5cGVzID0gQ3Rvci5wcm9wVHlwZXM7XG5cdFdyYXBwZWQuZGVmYXVsdFByb3BzID0gQ3Rvci5kZWZhdWx0UHJvcHM7XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KEN0b3IsIENPTVBPTkVOVF9XUkFQUEVSX0tFWSwgeyBjb25maWd1cmFibGU6dHJ1ZSwgdmFsdWU6V3JhcHBlZCB9KTtcblxuXHRyZXR1cm4gV3JhcHBlZDtcbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KC4uLmFyZ3MpIHtcblx0dXBncmFkZVRvVk5vZGVzKGFyZ3MsIDIpO1xuXHRyZXR1cm4gbm9ybWFsaXplVk5vZGUoaCguLi5hcmdzKSk7XG59XG5cblxuZnVuY3Rpb24gbm9ybWFsaXplVk5vZGUodm5vZGUpIHtcblx0dm5vZGUucHJlYWN0Q29tcGF0Tm9ybWFsaXplZCA9IHRydWU7XG5cblx0YXBwbHlDbGFzc05hbWUodm5vZGUpO1xuXG5cdGlmIChpc1N0YXRlbGVzc0NvbXBvbmVudCh2bm9kZS5ub2RlTmFtZSkpIHtcblx0XHR2bm9kZS5ub2RlTmFtZSA9IHN0YXRlbGVzc0NvbXBvbmVudEhvb2sodm5vZGUubm9kZU5hbWUpO1xuXHR9XG5cblx0bGV0IHJlZiA9IHZub2RlLmF0dHJpYnV0ZXMucmVmLFxuXHRcdHR5cGUgPSByZWYgJiYgdHlwZW9mIHJlZjtcblx0aWYgKGN1cnJlbnRDb21wb25lbnQgJiYgKHR5cGU9PT0nc3RyaW5nJyB8fCB0eXBlPT09J251bWJlcicpKSB7XG5cdFx0dm5vZGUuYXR0cmlidXRlcy5yZWYgPSBjcmVhdGVTdHJpbmdSZWZQcm94eShyZWYsIGN1cnJlbnRDb21wb25lbnQpO1xuXHR9XG5cblx0YXBwbHlFdmVudE5vcm1hbGl6YXRpb24odm5vZGUpO1xuXG5cdHJldHVybiB2bm9kZTtcbn1cblxuXG5mdW5jdGlvbiBjbG9uZUVsZW1lbnQoZWxlbWVudCwgcHJvcHMsIC4uLmNoaWxkcmVuKSB7XG5cdGlmICghaXNWYWxpZEVsZW1lbnQoZWxlbWVudCkpIHJldHVybiBlbGVtZW50O1xuXHRsZXQgZWxlbWVudFByb3BzID0gZWxlbWVudC5hdHRyaWJ1dGVzIHx8IGVsZW1lbnQucHJvcHM7XG5cdGxldCBub2RlID0gaChcblx0XHRlbGVtZW50Lm5vZGVOYW1lIHx8IGVsZW1lbnQudHlwZSxcblx0XHRlbGVtZW50UHJvcHMsXG5cdFx0ZWxlbWVudC5jaGlsZHJlbiB8fCBlbGVtZW50UHJvcHMgJiYgZWxlbWVudFByb3BzLmNoaWxkcmVuXG5cdCk7XG5cdHJldHVybiBub3JtYWxpemVWTm9kZShwcmVhY3RDbG9uZUVsZW1lbnQobm9kZSwgcHJvcHMsIC4uLmNoaWxkcmVuKSk7XG59XG5cblxuZnVuY3Rpb24gaXNWYWxpZEVsZW1lbnQoZWxlbWVudCkge1xuXHRyZXR1cm4gZWxlbWVudCAmJiAoKGVsZW1lbnQgaW5zdGFuY2VvZiBWTm9kZSkgfHwgZWxlbWVudC4kJHR5cGVvZj09PVJFQUNUX0VMRU1FTlRfVFlQRSk7XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlU3RyaW5nUmVmUHJveHkobmFtZSwgY29tcG9uZW50KSB7XG5cdHJldHVybiBjb21wb25lbnQuX3JlZlByb3hpZXNbbmFtZV0gfHwgKGNvbXBvbmVudC5fcmVmUHJveGllc1tuYW1lXSA9IHJlc29sdmVkID0+IHtcblx0XHRpZiAoY29tcG9uZW50ICYmIGNvbXBvbmVudC5yZWZzKSB7XG5cdFx0XHRjb21wb25lbnQucmVmc1tuYW1lXSA9IHJlc29sdmVkO1xuXHRcdFx0aWYgKHJlc29sdmVkPT09bnVsbCkge1xuXHRcdFx0XHRkZWxldGUgY29tcG9uZW50Ll9yZWZQcm94aWVzW25hbWVdO1xuXHRcdFx0XHRjb21wb25lbnQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG59XG5cblxuZnVuY3Rpb24gYXBwbHlFdmVudE5vcm1hbGl6YXRpb24oeyBub2RlTmFtZSwgYXR0cmlidXRlcyB9KSB7XG5cdGlmICghYXR0cmlidXRlcyB8fCB0eXBlb2Ygbm9kZU5hbWUhPT0nc3RyaW5nJykgcmV0dXJuO1xuXHRsZXQgcHJvcHMgPSB7fTtcblx0Zm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0cHJvcHNbaS50b0xvd2VyQ2FzZSgpXSA9IGk7XG5cdH1cblx0aWYgKHByb3BzLm9uZG91YmxlY2xpY2spIHtcblx0XHRhdHRyaWJ1dGVzLm9uZGJsY2xpY2sgPSBhdHRyaWJ1dGVzW3Byb3BzLm9uZG91YmxlY2xpY2tdO1xuXHRcdGRlbGV0ZSBhdHRyaWJ1dGVzW3Byb3BzLm9uZG91YmxlY2xpY2tdO1xuXHR9XG5cdC8vIGZvciAqdGV4dHVhbCBpbnB1dHMqIChpbmNsIHRleHRhcmVhKSwgbm9ybWFsaXplIGBvbkNoYW5nZWAgLT4gYG9uSW5wdXRgOlxuXHRpZiAocHJvcHMub25jaGFuZ2UgJiYgKG5vZGVOYW1lPT09J3RleHRhcmVhJyB8fCAobm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PSdpbnB1dCcgJiYgIS9eZmlsfGNoZXxyYWQvaS50ZXN0KGF0dHJpYnV0ZXMudHlwZSkpKSkge1xuXHRcdGxldCBub3JtYWxpemVkID0gcHJvcHMub25pbnB1dCB8fCAnb25pbnB1dCc7XG5cdFx0aWYgKCFhdHRyaWJ1dGVzW25vcm1hbGl6ZWRdKSB7XG5cdFx0XHRhdHRyaWJ1dGVzW25vcm1hbGl6ZWRdID0gbXVsdGlob29rKFthdHRyaWJ1dGVzW25vcm1hbGl6ZWRdLCBhdHRyaWJ1dGVzW3Byb3BzLm9uY2hhbmdlXV0pO1xuXHRcdFx0ZGVsZXRlIGF0dHJpYnV0ZXNbcHJvcHMub25jaGFuZ2VdO1xuXHRcdH1cblx0fVxufVxuXG5cbmZ1bmN0aW9uIGFwcGx5Q2xhc3NOYW1lKHsgYXR0cmlidXRlcyB9KSB7XG5cdGlmICghYXR0cmlidXRlcykgcmV0dXJuO1xuXHRsZXQgY2wgPSBhdHRyaWJ1dGVzLmNsYXNzTmFtZSB8fCBhdHRyaWJ1dGVzLmNsYXNzO1xuXHRpZiAoY2wpIGF0dHJpYnV0ZXMuY2xhc3NOYW1lID0gY2w7XG59XG5cblxuZnVuY3Rpb24gZXh0ZW5kKGJhc2UsIHByb3BzKSB7XG5cdGZvciAobGV0IGtleSBpbiBwcm9wcykge1xuXHRcdGlmIChwcm9wcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRiYXNlW2tleV0gPSBwcm9wc1trZXldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gYmFzZTtcbn1cblxuXG5mdW5jdGlvbiBzaGFsbG93RGlmZmVycyhhLCBiKSB7XG5cdGZvciAobGV0IGkgaW4gYSkgaWYgKCEoaSBpbiBiKSkgcmV0dXJuIHRydWU7XG5cdGZvciAobGV0IGkgaW4gYikgaWYgKGFbaV0hPT1iW2ldKSByZXR1cm4gdHJ1ZTtcblx0cmV0dXJuIGZhbHNlO1xufVxuXG5cbmZ1bmN0aW9uIGZpbmRET01Ob2RlKGNvbXBvbmVudCkge1xuXHRyZXR1cm4gY29tcG9uZW50ICYmIGNvbXBvbmVudC5iYXNlIHx8IGNvbXBvbmVudDtcbn1cblxuXG5mdW5jdGlvbiBGKCl7fVxuXG5mdW5jdGlvbiBjcmVhdGVDbGFzcyhvYmopIHtcblx0ZnVuY3Rpb24gY2wocHJvcHMsIGNvbnRleHQpIHtcblx0XHRiaW5kQWxsKHRoaXMpO1xuXHRcdENvbXBvbmVudC5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0LCBCWVBBU1NfSE9PSyk7XG5cdFx0bmV3Q29tcG9uZW50SG9vay5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcblx0fVxuXG5cdG9iaiA9IGV4dGVuZCh7IGNvbnN0cnVjdG9yOiBjbCB9LCBvYmopO1xuXG5cdC8vIFdlIG5lZWQgdG8gYXBwbHkgbWl4aW5zIGhlcmUgc28gdGhhdCBnZXREZWZhdWx0UHJvcHMgaXMgY29ycmVjdGx5IG1peGVkXG5cdGlmIChvYmoubWl4aW5zKSB7XG5cdFx0YXBwbHlNaXhpbnMob2JqLCBjb2xsYXRlTWl4aW5zKG9iai5taXhpbnMpKTtcblx0fVxuXHRpZiAob2JqLnN0YXRpY3MpIHtcblx0XHRleHRlbmQoY2wsIG9iai5zdGF0aWNzKTtcblx0fVxuXHRpZiAob2JqLnByb3BUeXBlcykge1xuXHRcdGNsLnByb3BUeXBlcyA9IG9iai5wcm9wVHlwZXM7XG5cdH1cblx0aWYgKG9iai5kZWZhdWx0UHJvcHMpIHtcblx0XHRjbC5kZWZhdWx0UHJvcHMgPSBvYmouZGVmYXVsdFByb3BzO1xuXHR9XG5cdGlmIChvYmouZ2V0RGVmYXVsdFByb3BzKSB7XG5cdFx0Y2wuZGVmYXVsdFByb3BzID0gb2JqLmdldERlZmF1bHRQcm9wcygpO1xuXHR9XG5cblx0Ri5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuXHRjbC5wcm90b3R5cGUgPSBleHRlbmQobmV3IEYoKSwgb2JqKTtcblxuXHRjbC5kaXNwbGF5TmFtZSA9IG9iai5kaXNwbGF5TmFtZSB8fCAnQ29tcG9uZW50JztcblxuXHRyZXR1cm4gY2w7XG59XG5cblxuLy8gRmxhdHRlbiBhbiBBcnJheSBvZiBtaXhpbnMgdG8gYSBtYXAgb2YgbWV0aG9kIG5hbWUgdG8gbWl4aW4gaW1wbGVtZW50YXRpb25zXG5mdW5jdGlvbiBjb2xsYXRlTWl4aW5zKG1peGlucykge1xuXHRsZXQga2V5ZWQgPSB7fTtcblx0Zm9yIChsZXQgaT0wOyBpPG1peGlucy5sZW5ndGg7IGkrKykge1xuXHRcdGxldCBtaXhpbiA9IG1peGluc1tpXTtcblx0XHRmb3IgKGxldCBrZXkgaW4gbWl4aW4pIHtcblx0XHRcdGlmIChtaXhpbi5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHR5cGVvZiBtaXhpbltrZXldPT09J2Z1bmN0aW9uJykge1xuXHRcdFx0XHQoa2V5ZWRba2V5XSB8fCAoa2V5ZWRba2V5XT1bXSkpLnB1c2gobWl4aW5ba2V5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBrZXllZDtcbn1cblxuXG4vLyBhcHBseSBhIG1hcHBpbmcgb2YgQXJyYXlzIG9mIG1peGluIG1ldGhvZHMgdG8gYSBjb21wb25lbnQgcHJvdG90eXBlXG5mdW5jdGlvbiBhcHBseU1peGlucyhwcm90bywgbWl4aW5zKSB7XG5cdGZvciAobGV0IGtleSBpbiBtaXhpbnMpIGlmIChtaXhpbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdHByb3RvW2tleV0gPSBtdWx0aWhvb2soXG5cdFx0XHRtaXhpbnNba2V5XS5jb25jYXQocHJvdG9ba2V5XSB8fCBBUlIpLFxuXHRcdFx0a2V5PT09J2dldERlZmF1bHRQcm9wcycgfHwga2V5PT09J2dldEluaXRpYWxTdGF0ZScgfHwga2V5PT09J2dldENoaWxkQ29udGV4dCdcblx0XHQpO1xuXHR9XG59XG5cblxuZnVuY3Rpb24gYmluZEFsbChjdHgpIHtcblx0Zm9yIChsZXQgaSBpbiBjdHgpIHtcblx0XHRsZXQgdiA9IGN0eFtpXTtcblx0XHRpZiAodHlwZW9mIHY9PT0nZnVuY3Rpb24nICYmICF2Ll9fYm91bmQgJiYgIUFVVE9CSU5EX0JMQUNLTElTVC5oYXNPd25Qcm9wZXJ0eShpKSkge1xuXHRcdFx0KGN0eFtpXSA9IHYuYmluZChjdHgpKS5fX2JvdW5kID0gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cblxuXG5mdW5jdGlvbiBjYWxsTWV0aG9kKGN0eCwgbSwgYXJncykge1xuXHRpZiAodHlwZW9mIG09PT0nc3RyaW5nJykge1xuXHRcdG0gPSBjdHguY29uc3RydWN0b3IucHJvdG90eXBlW21dO1xuXHR9XG5cdGlmICh0eXBlb2YgbT09PSdmdW5jdGlvbicpIHtcblx0XHRyZXR1cm4gbS5hcHBseShjdHgsIGFyZ3MpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIG11bHRpaG9vayhob29rcywgc2tpcER1cGxpY2F0ZXMpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGxldCByZXQ7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPGhvb2tzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgciA9IGNhbGxNZXRob2QodGhpcywgaG9va3NbaV0sIGFyZ3VtZW50cyk7XG5cblx0XHRcdGlmIChza2lwRHVwbGljYXRlcyAmJiByIT1udWxsKSB7XG5cdFx0XHRcdGlmICghcmV0KSByZXQgPSB7fTtcblx0XHRcdFx0Zm9yIChsZXQga2V5IGluIHIpIGlmIChyLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRyZXRba2V5XSA9IHJba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIHIhPT0ndW5kZWZpbmVkJykgcmV0ID0gcjtcblx0XHR9XG5cdFx0cmV0dXJuIHJldDtcblx0fTtcbn1cblxuXG5mdW5jdGlvbiBuZXdDb21wb25lbnRIb29rKHByb3BzLCBjb250ZXh0KSB7XG5cdHByb3BzSG9vay5jYWxsKHRoaXMsIHByb3BzLCBjb250ZXh0KTtcblx0dGhpcy5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzID0gbXVsdGlob29rKFtwcm9wc0hvb2ssIHRoaXMuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyB8fCAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyddKTtcblx0dGhpcy5yZW5kZXIgPSBtdWx0aWhvb2soW3Byb3BzSG9vaywgYmVmb3JlUmVuZGVyLCB0aGlzLnJlbmRlciB8fCAncmVuZGVyJywgYWZ0ZXJSZW5kZXJdKTtcbn1cblxuXG5mdW5jdGlvbiBwcm9wc0hvb2socHJvcHMsIGNvbnRleHQpIHtcblx0aWYgKCFwcm9wcykgcmV0dXJuO1xuXG5cdC8vIFJlYWN0IGFubm95aW5nbHkgc3BlY2lhbC1jYXNlcyBzaW5nbGUgY2hpbGRyZW4sIGFuZCBzb21lIHJlYWN0IGNvbXBvbmVudHMgYXJlIHJpZGljdWxvdXNseSBzdHJpY3QgYWJvdXQgdGhpcy5cblx0bGV0IGMgPSBwcm9wcy5jaGlsZHJlbjtcblx0aWYgKGMgJiYgQXJyYXkuaXNBcnJheShjKSAmJiBjLmxlbmd0aD09PTEpIHtcblx0XHRwcm9wcy5jaGlsZHJlbiA9IGNbMF07XG5cblx0XHQvLyBidXQgaXRzIHRvdGFsbHkgc3RpbGwgZ29pbmcgdG8gYmUgYW4gQXJyYXkuXG5cdFx0aWYgKHByb3BzLmNoaWxkcmVuICYmIHR5cGVvZiBwcm9wcy5jaGlsZHJlbj09PSdvYmplY3QnKSB7XG5cdFx0XHRwcm9wcy5jaGlsZHJlbi5sZW5ndGggPSAxO1xuXHRcdFx0cHJvcHMuY2hpbGRyZW5bMF0gPSBwcm9wcy5jaGlsZHJlbjtcblx0XHR9XG5cdH1cblxuXHQvLyBhZGQgcHJvcHR5cGUgY2hlY2tpbmdcblx0aWYgKERFVikge1xuXHRcdGxldCBjdG9yID0gdHlwZW9mIHRoaXM9PT0nZnVuY3Rpb24nID8gdGhpcyA6IHRoaXMuY29uc3RydWN0b3IsXG5cdFx0XHRwcm9wVHlwZXMgPSB0aGlzLnByb3BUeXBlcyB8fCBjdG9yLnByb3BUeXBlcztcblx0XHRpZiAocHJvcFR5cGVzKSB7XG5cdFx0XHRmb3IgKGxldCBwcm9wIGluIHByb3BUeXBlcykge1xuXHRcdFx0XHRpZiAocHJvcFR5cGVzLmhhc093blByb3BlcnR5KHByb3ApICYmIHR5cGVvZiBwcm9wVHlwZXNbcHJvcF09PT0nZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0Y29uc3QgZGlzcGxheU5hbWUgPSB0aGlzLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZTtcblx0XHRcdFx0XHRsZXQgZXJyID0gcHJvcFR5cGVzW3Byb3BdKHByb3BzLCBwcm9wLCBkaXNwbGF5TmFtZSwgJ3Byb3AnKTtcblx0XHRcdFx0XHRpZiAoZXJyKSBjb25zb2xlLmVycm9yKG5ldyBFcnJvcihlcnIubWVzc2FnZSB8fCBlcnIpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5cbmZ1bmN0aW9uIGJlZm9yZVJlbmRlcihwcm9wcykge1xuXHRjdXJyZW50Q29tcG9uZW50ID0gdGhpcztcbn1cblxuZnVuY3Rpb24gYWZ0ZXJSZW5kZXIoKSB7XG5cdGlmIChjdXJyZW50Q29tcG9uZW50PT09dGhpcykge1xuXHRcdGN1cnJlbnRDb21wb25lbnQgPSBudWxsO1xuXHR9XG59XG5cblxuXG5mdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIG9wdHMpIHtcblx0UHJlYWN0Q29tcG9uZW50LmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuXHR0aGlzLnN0YXRlID0gdGhpcy5nZXRJbml0aWFsU3RhdGUgPyB0aGlzLmdldEluaXRpYWxTdGF0ZSgpIDoge307XG5cdHRoaXMucmVmcyA9IHt9O1xuXHR0aGlzLl9yZWZQcm94aWVzID0ge307XG5cdGlmIChvcHRzIT09QllQQVNTX0hPT0spIHtcblx0XHRuZXdDb21wb25lbnRIb29rLmNhbGwodGhpcywgcHJvcHMsIGNvbnRleHQpO1xuXHR9XG59XG5leHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBQcmVhY3RDb21wb25lbnQoKSwge1xuXHRjb25zdHJ1Y3RvcjogQ29tcG9uZW50LFxuXG5cdGlzUmVhY3RDb21wb25lbnQ6IHt9LFxuXG5cdHJlcGxhY2VTdGF0ZShzdGF0ZSwgY2FsbGJhY2spIHtcblx0XHR0aGlzLnNldFN0YXRlKHN0YXRlLCBjYWxsYmFjayk7XG5cdFx0Zm9yIChsZXQgaSBpbiB0aGlzLnN0YXRlKSB7XG5cdFx0XHRpZiAoIShpIGluIHN0YXRlKSkge1xuXHRcdFx0XHRkZWxldGUgdGhpcy5zdGF0ZVtpXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Z2V0RE9NTm9kZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5iYXNlO1xuXHR9LFxuXG5cdGlzTW91bnRlZCgpIHtcblx0XHRyZXR1cm4gISF0aGlzLmJhc2U7XG5cdH1cbn0pO1xuXG5cblxuZnVuY3Rpb24gUHVyZUNvbXBvbmVudChwcm9wcywgY29udGV4dCkge1xuXHRDb21wb25lbnQuY2FsbCh0aGlzLCBwcm9wcywgY29udGV4dCk7XG59XG5GLnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG5QdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBGKCk7XG5QdXJlQ29tcG9uZW50LnByb3RvdHlwZS5zaG91bGRDb21wb25lbnRVcGRhdGUgPSBmdW5jdGlvbihwcm9wcywgc3RhdGUpIHtcblx0cmV0dXJuIHNoYWxsb3dEaWZmZXJzKHRoaXMucHJvcHMsIHByb3BzKSB8fCBzaGFsbG93RGlmZmVycyh0aGlzLnN0YXRlLCBzdGF0ZSk7XG59O1xuXG5cblxuZXhwb3J0IHtcblx0dmVyc2lvbixcblx0RE9NLFxuXHRQcm9wVHlwZXMsXG5cdENoaWxkcmVuLFxuXHRyZW5kZXIsXG5cdGNyZWF0ZUNsYXNzLFxuXHRjcmVhdGVGYWN0b3J5LFxuXHRjcmVhdGVFbGVtZW50LFxuXHRjbG9uZUVsZW1lbnQsXG5cdGlzVmFsaWRFbGVtZW50LFxuXHRmaW5kRE9NTm9kZSxcblx0dW5tb3VudENvbXBvbmVudEF0Tm9kZSxcblx0Q29tcG9uZW50LFxuXHRQdXJlQ29tcG9uZW50LFxuXHRyZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lciBhcyB1bnN0YWJsZV9yZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lclxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuXHR2ZXJzaW9uLFxuXHRET00sXG5cdFByb3BUeXBlcyxcblx0Q2hpbGRyZW4sXG5cdHJlbmRlcixcblx0Y3JlYXRlQ2xhc3MsXG5cdGNyZWF0ZUZhY3RvcnksXG5cdGNyZWF0ZUVsZW1lbnQsXG5cdGNsb25lRWxlbWVudCxcblx0aXNWYWxpZEVsZW1lbnQsXG5cdGZpbmRET01Ob2RlLFxuXHR1bm1vdW50Q29tcG9uZW50QXROb2RlLFxuXHRDb21wb25lbnQsXG5cdFB1cmVDb21wb25lbnQsXG5cdHVuc3RhYmxlX3JlbmRlclN1YnRyZWVJbnRvQ29udGFpbmVyOiByZW5kZXJTdWJ0cmVlSW50b0NvbnRhaW5lclxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcHJlYWN0LWNvbXBhdC9zcmMvaW5kZXguanMiLCJleHBvcnQgaW50ZXJmYWNlIEhhc2hUYWJsZTxUPiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBUO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleURhdGEge1xyXG4gICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTtcclxuICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleSBleHRlbmRzIElTdXJ2ZXlEYXRhIHtcclxuICAgIGN1cnJlbnRQYWdlOiBJUGFnZTtcclxuICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIsIHBhcmVudFBhbmVsOiBhbnksIHJvb3RQYW5lbDogYW55KTtcclxuICAgIHBhbmVsQWRkZWQocGFuZWw6IElFbGVtZW50LCBpbmRleDogbnVtYmVyLCBwYXJlbnRQYW5lbDogYW55LCByb290UGFuZWw6IGFueSk7XHJcbiAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbik7XHJcbiAgICBwYW5lbFJlbW92ZWQocGFuZWw6IElFbGVtZW50KTtcclxuICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3I7XHJcbiAgICBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBwcm9jZXNzVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBpc0Rpc3BsYXlNb2RlOiBib29sZWFuO1xyXG4gICAgaXNEZXNpZ25Nb2RlOiBib29sZWFuO1xyXG4gICAgaXNMb2FkaW5nRnJvbUpzb246IGJvb2xlYW47XHJcbiAgICByZXF1aXJlZFRleHQ6IHN0cmluZztcclxuICAgIHF1ZXN0aW9uU3RhcnRJbmRleDogc3RyaW5nO1xyXG4gICAgZ2V0UXVlc3Rpb25UaXRsZVRlbXBsYXRlKCk6IHN0cmluZztcclxuICAgIHN0b3JlT3RoZXJzQXNDb21tZW50OiBib29sZWFuO1xyXG4gICAgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KTogYm9vbGVhbjtcclxuICAgIGFmdGVyUmVuZGVyUXVlc3Rpb24ocXVlc3Rpb246IElRdWVzdGlvbiwgaHRtbEVsZW1lbnQpO1xyXG4gICAgYWZ0ZXJSZW5kZXJQYW5lbChwYW5lbDogSUVsZW1lbnQsIGh0bWxFbGVtZW50KTtcclxuICAgIG1hdHJpeFJvd0FkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pik7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJRWxlbWVudCAgZXh0ZW5kcyBJQ29uZGl0aW9uUnVubmVye1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgIGlzVmlzaWJsZTogYm9vbGVhbjtcclxuICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXlEYXRhKTtcclxuICAgIHJvd1Zpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBzdGFydFdpdGhOZXdMaW5lQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcmVuZGVyV2lkdGg6IHN0cmluZztcclxuICAgIHdpZHRoOiBzdHJpbmc7XHJcbiAgICByaWdodEluZGVudDogbnVtYmVyO1xyXG4gICAgc3RhcnRXaXRoTmV3TGluZTogYm9vbGVhbjtcclxuICAgIGlzUGFuZWw6IGJvb2xlYW47XHJcbiAgICBvblN1cnZleUxvYWQoKTtcclxuICAgIG9uTG9jYWxlQ2hhbmdlZCgpO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElRdWVzdGlvbiBleHRlbmRzIElFbGVtZW50IHtcclxuICAgIGhhc1RpdGxlOiBib29sZWFuO1xyXG4gICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpO1xyXG4gICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSk7XHJcbiAgICBvblJlYWRPbmx5Q2hhbmdlZCgpO1xyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKTogYm9vbGVhbjtcclxuICAgIGNsZWFyVW51c2VkVmFsdWVzKCk7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJUGFuZWwgZXh0ZW5kcyBJRWxlbWVudCB7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJUGFnZSBleHRlbmRzIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgIG9uU3VydmV5TG9hZCgpO1xyXG59XHJcbi8qKlxyXG4gKiBUaGUgYmFzZSBjbGFzcyBmb3IgU3VydmV5SlMgb2JqZWN0cy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYXNlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgaXNWYWx1ZUVtcHR5KHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gIXZhbHVlICYmIHZhbHVlICE9PSAwICYmIHZhbHVlICE9PSBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGlzVHdvVmFsdWVFcXVhbHMoeDogYW55LCB5OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoeCA9PT0geSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkgfHwgISh5IGluc3RhbmNlb2YgT2JqZWN0KSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4geCkge1xyXG4gICAgICAgICAgICBpZiAoIXguaGFzT3duUHJvcGVydHkocCkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoIXkuaGFzT3duUHJvcGVydHkocCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHhbcF0gPT09IHlbcF0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh4W3BdKSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNUd29WYWx1ZUVxdWFscyh4W3BdLCB5W3BdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHAgaW4geSkge1xyXG4gICAgICAgICAgICBpZiAoeS5oYXNPd25Qcm9wZXJ0eShwKSAmJiAheC5oYXNPd25Qcm9wZXJ0eShwKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5RXJyb3Ige1xyXG4gICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgU3VydmV5UGFnZUlkOiBzdHJpbmc7XHJcblN1cnZleVBhZ2VJZCA9IFwic3FfcGFnZVwiO1xyXG5leHBvcnQgY2xhc3MgU3VydmV5RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIFNjcm9sbEVsZW1lbnRUb1RvcChlbGVtZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghZWxlbWVudElkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgICAgICBpZiAoIWVsIHx8ICFlbC5zY3JvbGxJbnRvVmlldykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbGVtVG9wID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgIGlmIChlbGVtVG9wIDwgMCkgIGVsLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1Ub3AgPCAwO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBHZXRGaXJzdE5vblRleHRFbGVtZW50KGVsZW1lbnRzOiBhbnkpIHtcclxuICAgICAgICBpZiAoIWVsZW1lbnRzIHx8ICFlbGVtZW50cy5sZW5ndGgpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50c1tpXS5ub2RlTmFtZSAhPSBcIiN0ZXh0XCIgJiYgZWxlbWVudHNbaV0ubm9kZU5hbWUgIT0gXCIjY29tbWVudFwiKSByZXR1cm4gZWxlbWVudHNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBGb2N1c0VsZW1lbnQoZWxlbWVudElkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWVsZW1lbnRJZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgICAgIGVsLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudDxUIGV4dGVuZHMgRnVuY3Rpb24sIE9wdGlvbnM+ICB7XHJcbiAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmNhbGxiYWNrcyA9PSBudWxsIHx8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICBwdWJsaWMgZmlyZShzZW5kZXI6IGFueSwgb3B0aW9uczogT3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxSZXN1bHQgPSB0aGlzLmNhbGxiYWNrc1tpXShzZW5kZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkKGZ1bmM6IFQpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IG5ldyBBcnJheTxUPigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZShmdW5jOiBUKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGZ1bmMsIDApO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Jhc2UudHMiLCJpbXBvcnQge0hhc2hUYWJsZX0gZnJvbSAnLi9iYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgcHJpdmF0ZSB0eXBlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNob2ljZXNmdW5jOiAoKSA9PiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgYWx0ZXJuYXRpdmVOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGNsYXNzTmFtZVBhcnQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XHJcbiAgICBwdWJsaWMgcmVhZE9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyB2aXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBpc0xvY2FsaXphYmxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc2VyaWFsaXphdGlvblByb3BlcnR5OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbDtcclxuICAgIHB1YmxpYyBvblNldFZhbHVlOiAob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSA9PiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnR5cGVWYWx1ZSA/IHRoaXMudHlwZVZhbHVlIDogXCJzdHJpbmdcIjsgfVxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50eXBlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNUb1VzZUdldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vbkdldFZhbHVlIHx8IHRoaXMuc2VyaWFsaXphdGlvblByb3BlcnR5OyB9XHJcbiAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5kZWZhdWx0VmFsdWUpID8gKHRoaXMuZGVmYXVsdFZhbHVlID09IHZhbHVlKSA6ICEodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5vbkdldFZhbHVlKSByZXR1cm4gdGhpcy5vbkdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgaWYodGhpcy5zZXJpYWxpemF0aW9uUHJvcGVydHkpIHJldHVybiBvYmpbdGhpcy5zZXJpYWxpemF0aW9uUHJvcGVydHldLmdldEpzb24oKTtcclxuICAgICAgICByZXR1cm4gb2JqW3RoaXMubmFtZV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UHJvcGVydHlWYWx1ZShvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYodGhpcy5pc0xvY2FsaXphYmxlKSByZXR1cm4gb2JqW3RoaXMuc2VyaWFsaXphdGlvblByb3BlcnR5XS50ZXh0O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFZhbHVlKG9iaik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlU2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uU2V0VmFsdWUgfHwgdGhpcy5zZXJpYWxpemF0aW9uUHJvcGVydHk7IH1cclxuICAgIHB1YmxpYyBzZXRWYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpIHtcclxuICAgICAgICBpZiAodGhpcy5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25TZXRWYWx1ZShvYmosIHZhbHVlLCBqc29uQ29udik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5zZXJpYWxpemF0aW9uUHJvcGVydHkpXHJcbiAgICAgICAgICAgICAgICBvYmpbdGhpcy5zZXJpYWxpemF0aW9uUHJvcGVydHldLnNldEpzb24odmFsdWUpO1xyXG4gICAgICAgICAgICBlbHNlIG9ialt0aGlzLm5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldE9ialR5cGUob2JqVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNsYXNzTmFtZVBhcnQpIHJldHVybiBvYmpUeXBlO1xyXG4gICAgICAgIHJldHVybiBvYmpUeXBlLnJlcGxhY2UodGhpcy5jbGFzc05hbWVQYXJ0LCBcIlwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5jbGFzc05hbWVQYXJ0ICYmIGNsYXNzTmFtZS5pbmRleE9mKHRoaXMuY2xhc3NOYW1lUGFydCkgPCAwKSA/IGNsYXNzTmFtZSArIHRoaXMuY2xhc3NOYW1lUGFydCA6IGNsYXNzTmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICBpZiAodGhpcy5jaG9pY2VzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNmdW5jICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNmdW5jKCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0Q2hvaWNlcyh2YWx1ZTogQXJyYXk8YW55PiwgdmFsdWVGdW5jOiAoKSA9PiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNob2ljZXNmdW5jID0gdmFsdWVGdW5jO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICBzdGF0aWMgcmVxdWlyZWRTeW1ib2wgPSAnISc7XHJcbiAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgIHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4gPSBudWxsO1xyXG4gICAgcmVxdWlyZWRQcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmc+ID0gbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIHB1YmxpYyBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwdWJsaWMgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5jcmVhdGVQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucHJvcGVydGllc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlUHJvcGVydHkocHJvcEluZm86IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHR5cGVvZiBwcm9wSW5mbyA9PT0gXCJzdHJpbmdcIiA/IHByb3BJbmZvIDogcHJvcEluZm8ubmFtZTtcclxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSBudWxsO1xyXG4gICAgICAgIHZhciB0eXBlSW5kZXggPSBwcm9wZXJ0eU5hbWUuaW5kZXhPZihKc29uTWV0YWRhdGFDbGFzcy50eXBlU3ltYm9sKTtcclxuICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgcHJvcGVydHlUeXBlID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZyh0eXBlSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCB0eXBlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIHZhciBwcm9wID0gbmV3IEpzb25PYmplY3RQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eVR5cGUpIHtcclxuICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHByb3BJbmZvID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wSW5mby50eXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmRlZmF1bHRWYWx1ZSA9IHByb3BJbmZvLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocHJvcEluZm8udmlzaWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHByb3AudmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5pc1JlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3AubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmNob2ljZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaG9pY2VzRnVuYyA9IHR5cGVvZiBwcm9wSW5mby5jaG9pY2VzID09PSBcImZ1bmN0aW9uXCIgPyBwcm9wSW5mby5jaG9pY2VzIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciBjaG9pY2VzVmFsdWUgPSB0eXBlb2YgcHJvcEluZm8uY2hvaWNlcyAhPT0gXCJmdW5jdGlvblwiID8gcHJvcEluZm8uY2hvaWNlcyA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBwcm9wLnNldENob2ljZXMoY2hvaWNlc1ZhbHVlLCBjaG9pY2VzRnVuYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLm9uR2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3Aub25HZXRWYWx1ZSA9IHByb3BJbmZvLm9uR2V0VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLm9uU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3Aub25TZXRWYWx1ZSA9IHByb3BJbmZvLm9uU2V0VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocHJvcEluZm8uc2VyaWFsaXphdGlvblByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLnNlcmlhbGl6YXRpb25Qcm9wZXJ0eSA9IHByb3BJbmZvLnNlcmlhbGl6YXRpb25Qcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIHZhciBzOiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICBpZihwcm9wLnNlcmlhbGl6YXRpb25Qcm9wZXJ0eSAmJiBwcm9wLnNlcmlhbGl6YXRpb25Qcm9wZXJ0eS5pbmRleE9mKFwibG9jXCIpID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmlzTG9jYWxpemFibGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHByb3BJbmZvLmlzTG9jYWxpemFibGUpIHtcclxuICAgICAgICAgICAgICAgIHByb3AuaXNMb2NhbGl6YWJsZSA9IHByb3BJbmZvLmlzTG9jYWxpemFibGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5jbGFzc05hbWUgPSBwcm9wSW5mby5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmJhc2VDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3AuYmFzZUNsYXNzTmFtZSA9IHByb3BJbmZvLmJhc2VDbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmNsYXNzTmFtZVBhcnQpIHtcclxuICAgICAgICAgICAgICAgIHByb3AuY2xhc3NOYW1lUGFydCA9IHByb3BJbmZvLmNsYXNzTmFtZVBhcnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYocHJvcEluZm8uYWx0ZXJuYXRpdmVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmFsdGVybmF0aXZlTmFtZSA9IHByb3BJbmZvLmFsdGVybmF0aXZlTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocHJvcGVydHlOYW1lLmxlbmd0aCA9PSAwIHx8IHByb3BlcnR5TmFtZVswXSAhPSBKc29uTWV0YWRhdGFDbGFzcy5yZXF1aXJlZFN5bWJvbCkgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgdGhpcy5tYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhIHtcclxuICAgIHByaXZhdGUgY2xhc3NlczogSGFzaFRhYmxlPEpzb25NZXRhZGF0YUNsYXNzPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICBwcml2YXRlIGNsYXNzUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4+ID0ge307XHJcbiAgICBwcml2YXRlIGNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8c3RyaW5nPj4gPSB7fTtcclxuICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllcywgY3JlYXRvciwgcGFyZW50TmFtZSk7XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICBpZiAocGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBvdmVycmlkZUNsYXNzQ3JlYXRvcmUobmFtZTogc3RyaW5nLCBjcmVhdG9yOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzKSB7XHJcbiAgICAgICAgICAgIG1ldGFEYXRhQ2xhc3MuY3JlYXRvciA9IGNyZWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFByb3BlcnRpZXMoY2xhc3NOYW1lOiBzdHJpbmcpOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+IHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NQcm9wZXJ0aWVzW2NsYXNzTmFtZV07XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKGNsYXNzTmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW2NsYXNzTmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBmaW5kUHJvcGVydHkoY2xhc3NOYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nKSA6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmdldFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgaWYocHJvcGVydGllc1tpXS5uYW1lID09IHByb3BlcnR5TmFtZSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZUNsYXNzKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzLmNyZWF0b3IoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkUHJvcGVydHkoY2xhc3NOYW1lOiBzdHJpbmcsIHByb3BlcnR5SW5mbzogYW55KSB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IG1ldGFEYXRhQ2xhc3MuY3JlYXRlUHJvcGVydHkocHJvcGVydHlJbmZvKTtcclxuICAgICAgICBpZiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eVRvQ2xhc3MobWV0YURhdGFDbGFzcywgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB0aGlzLmVtcHR5Q2xhc3NQcm9wZXJ0aWVzSGFzaChtZXRhRGF0YUNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlUHJvcGVydHkoY2xhc3NOYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IG1ldGFEYXRhQ2xhc3MuZmluZChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVByb3BlcnR5RnJvbUNsYXNzKG1ldGFEYXRhQ2xhc3MsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgdGhpcy5lbXB0eUNsYXNzUHJvcGVydGllc0hhc2gobWV0YURhdGFDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eVRvQ2xhc3MobWV0YURhdGFDbGFzczogSnNvbk1ldGFkYXRhQ2xhc3MsIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5maW5kKHByb3BlcnR5Lm5hbWUpICE9IG51bGwpIHJldHVybjtcclxuICAgICAgICBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbW92ZVByb3BlcnR5RnJvbUNsYXNzKG1ldGFEYXRhQ2xhc3M6IEpzb25NZXRhZGF0YUNsYXNzLCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHkpO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgaW5kZXggPSBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5Lm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgbWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZW1wdHlDbGFzc1Byb3BlcnRpZXNIYXNoKG1ldGFEYXRhQ2xhc3M6IEpzb25NZXRhZGF0YUNsYXNzKSB7XHJcbiAgICAgICAgdGhpcy5jbGFzc1Byb3BlcnRpZXNbbWV0YURhdGFDbGFzcy5uYW1lXSA9IG51bGw7XHJcbiAgICAgICAgdmFyIGNoaWxkQ2xhc3NlcyA9IHRoaXMuZ2V0Q2hpbGRyZW5DbGFzc2VzKG1ldGFEYXRhQ2xhc3MubmFtZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZENsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc1Byb3BlcnRpZXNbY2hpbGRDbGFzc2VzW2ldLm5hbWVdID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4sIHJlc3VsdDogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+KSB7XHJcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbkNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFjYW5CZUNyZWF0ZWQgfHwgY2hpbGRyZW5baV0uY3JlYXRvcikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhjaGlsZHJlbltpXS5uYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZpbmRDbGFzcyhuYW1lOiBzdHJpbmcpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZmlsbFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KSB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eUNvcmUobWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzW2ldLCBsaXN0LCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eUNvcmUocHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiwgZW5kSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kSW5kZXg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09IHByb3BlcnR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKHByb3BlcnR5KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpc3RbaW5kZXhdID0gcHJvcGVydHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGxpc3QsIG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25FcnJvciB7XHJcbiAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgYXQ6IE51bWJlciA9IC0xO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEZ1bGxEZXNjcmlwdGlvbigpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlICsgKHRoaXMuZGVzY3JpcHRpb24gPyBcIlxcblwiICsgdGhpcy5kZXNjcmlwdGlvbiA6IFwiXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uVW5rbm93blByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcInVua25vd25wcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInIGlzIHVua25vd24uXCIpO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHByb3BlcnRpZXMgYXJlOiBcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBwcm9wZXJ0aWVzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSAnLic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2UgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHR5cGUsIG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBmb2xsb3dpbmcgdHlwZXMgYXJlIGF2YWlsYWJsZTogXCI7XHJcbiAgICAgICAgdmFyIHR5cGVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoYmFzZUNsYXNzTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiJ1wiICsgdHlwZXNbaV0ubmFtZSArIFwiJ1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLlwiO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcIm1pc3Npbmd0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBtaXNzaW5nIGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbkluY29ycmVjdFR5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcImluY29ycmVjdHR5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIGluY29ycmVjdCBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcInJlcXVpcmVkcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGlzIHJlcXVpcmVkIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJy5cIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uT2JqZWN0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHR5cGVQcm9wZXJ0eU5hbWUgPSBcInR5cGVcIjtcclxuICAgIHByaXZhdGUgc3RhdGljIHBvc2l0aW9uUHJvcGVydHlOYW1lID0gXCJwb3NcIjtcclxuICAgIHByaXZhdGUgc3RhdGljIG1ldGFEYXRhVmFsdWUgPSBuZXcgSnNvbk1ldGFkYXRhKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBtZXRhRGF0YSgpIHsgcmV0dXJuIEpzb25PYmplY3QubWV0YURhdGFWYWx1ZTsgfVxyXG4gICAgcHVibGljIGVycm9ycyA9IG5ldyBBcnJheTxKc29uRXJyb3I+KCk7XHJcbiAgICBwdWJsaWMgdG9Kc29uT2JqZWN0KG9iajogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0pzb25PYmplY3RDb3JlKG9iaiwgbnVsbCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdG9PYmplY3QoanNvbk9iajogYW55LCBvYmo6IGFueSkge1xyXG4gICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcclxuICAgICAgICBpZiAob2JqLmdldFR5cGUpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldID0ganNvbk9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkocHJvcGVydGllcywga2V5KTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihuZXcgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yKGtleS50b1N0cmluZygpLCBvYmouZ2V0VHlwZSgpKSwganNvbk9iaik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlVG9PYmooanNvbk9ialtrZXldLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB0b0pzb25PYmplY3RDb3JlKG9iajogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICBpZiAoIW9iai5nZXRUeXBlKSByZXR1cm4gb2JqO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiAoIXByb3BlcnR5LmNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgcmVzdWx0W0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eS5nZXRPYmpUeXBlKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlVG9Kc29uKG9iaiwgcmVzdWx0LCBwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvSnNvbihvYmo6IGFueSwgcmVzdWx0OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBwcm9wZXJ0eS5nZXRWYWx1ZShvYmopO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGFyclZhbHVlID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFyclZhbHVlLnB1c2godGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlW2ldLCBwcm9wZXJ0eSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlID0gYXJyVmFsdWUubGVuZ3RoID4gMCA/IGFyclZhbHVlIDogbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXN1bHRbcHJvcGVydHkubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb09iaih2YWx1ZTogYW55LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgcHJvcGVydHkuc2V0VmFsdWUob2JqLCB2YWx1ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlVG9BcnJheSh2YWx1ZSwgb2JqLCBwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld09iaiA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKG5ld09iai5uZXdPYmopIHtcclxuICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZSwgbmV3T2JqLm5ld09iaik7XHJcbiAgICAgICAgICAgIHZhbHVlID0gbmV3T2JqLm5ld09iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFuZXdPYmouZXJyb3IpIHtcclxuICAgICAgICAgICAgb2JqW3Byb3BlcnR5Lm5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1ZhbHVlQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gdmFsdWUgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSk7IH1cclxuICAgIHByaXZhdGUgY3JlYXRlTmV3T2JqKHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7IG5ld09iajogbnVsbCwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWVbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXTtcclxuICAgICAgICBpZiAoIWNsYXNzTmFtZSAmJiBwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5LmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5jbGFzc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmdldENsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgIHJlc3VsdC5uZXdPYmogPSAoY2xhc3NOYW1lKSA/IEpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoY2xhc3NOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgcmVzdWx0LmVycm9yID0gdGhpcy5jaGVja05ld09iamVjdE9uRXJyb3JzKHJlc3VsdC5uZXdPYmosIHZhbHVlLCBwcm9wZXJ0eSwgY2xhc3NOYW1lKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja05ld09iamVjdE9uRXJyb3JzKG5ld09iajogYW55LCB2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBjbGFzc05hbWU6IHN0cmluZyk6IEpzb25FcnJvciB7XHJcbiAgICAgICAgdmFyIGVycm9yID0gbnVsbDtcclxuICAgICAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1aXJlZFByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAocmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcXVpcmVkUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVbcmVxdWlyZWRQcm9wZXJ0aWVzW2ldXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yKHJlcXVpcmVkUHJvcGVydGllc1tpXSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmJhc2VDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbk1pc3NpbmdUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25JbmNvcnJlY3RUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IoZXJyb3IsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGROZXdFcnJvcihlcnJvcjogSnNvbkVycm9yLCBqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBpZiAoanNvbk9iaiAmJiBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmF0ID0ganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXS5zdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHZhbHVlVG9BcnJheSh2YWx1ZTogQXJyYXk8YW55Piwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgaWYob2JqW2tleV0gJiYgdmFsdWUubGVuZ3RoID4gMCkgb2JqW2tleV0uc3BsaWNlKDAsIG9ialtrZXldLmxlbmd0aCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZVtpXSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlW2ldLCBuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2godmFsdWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHkocHJvcGVydGllczogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Piwga2V5OiBhbnkpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gcHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgaWYgKHByb3AubmFtZSA9PSBrZXkgfHwgcHJvcC5hbHRlcm5hdGl2ZU5hbWUgPT0ga2V5KSByZXR1cm4gcHJvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzb25vYmplY3QudHMiLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi4vaXRlbXZhbHVlXCI7XHJcbmltcG9ydCB7TG9jYWxpemFibGVTdHJpbmd9IGZyb20gXCIuLi9sb2NhbGl6YWJsZXN0cmluZ1wiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtJU3VydmV5Q3JlYXRvcn0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvblwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleUVsZW1lbnRCYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHJlbmRlckxvY1N0cmluZyhsb2NTdHI6IExvY2FsaXphYmxlU3RyaW5nLCBzdHlsZTogYW55ID0gbnVsbCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAobG9jU3RyLmhhc0h0bWwpIHtcclxuICAgICAgICAgICAgbGV0IGh0bWxWYWx1ZSA9IHsgX19odG1sOiBsb2NTdHIucmVuZGVyZWRIdG1sIH07XHJcbiAgICAgICAgICAgIHJldHVybiA8c3BhbiBzdHlsZT17c3R5bGV9IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtodG1sVmFsdWV9IC8+O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPHNwYW4gc3R5bGU9e3N0eWxlfT57bG9jU3RyLnJlbmRlcmVkSHRtbH08L3NwYW4+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgcHJvdGVjdGVkIHJvb3RDc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCBpc0Rpc3BsYXlNb2RlOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBwcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuaXNEaXNwbGF5TW9kZSA9IHByb3BzLmlzRGlzcGxheU1vZGUgfHwgZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMucm9vdENzcyA9IG5leHRQcm9wcy5yb290Q3NzO1xyXG4gICAgICAgIHRoaXMuaXNEaXNwbGF5TW9kZSA9IG5leHRQcm9wcy5pc0Rpc3BsYXlNb2RlIHx8IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckxvY1N0cmluZyhsb2NTdHI6IExvY2FsaXphYmxlU3RyaW5nLCBzdHlsZTogYW55ID0gbnVsbCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gU3VydmV5RWxlbWVudEJhc2UucmVuZGVyTG9jU3RyaW5nKGxvY1N0ciwgc3R5bGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbkJhc2U6IFF1ZXN0aW9uQmFzZTtcclxuICAgIHByb3RlY3RlZCBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UgPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZSA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzaG91bGRDb21wb25lbnRVcGRhdGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnF1ZXN0aW9uQmFzZS5jdXN0b21XaWRnZXRcclxuICAgICAgICAgICAgfHwgISF0aGlzLnF1ZXN0aW9uQmFzZS5jdXN0b21XaWRnZXREYXRhLmlzTmVlZFJlbmRlclxyXG4gICAgICAgICAgICB8fCAhIXRoaXMucXVlc3Rpb25CYXNlLmN1c3RvbVdpZGdldC53aWRnZXRKc29uLnJlbmRlcjtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmVsZW1lbnQudHN4IiwiZXhwb3J0IHZhciBzdXJ2ZXlMb2NhbGl6YXRpb24gPSB7XHJcbiAgICBjdXJyZW50TG9jYWxlOiBcIlwiLFxyXG4gICAgbG9jYWxlczoge30sXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgbG9jID0gdGhpcy5jdXJyZW50TG9jYWxlID8gdGhpcy5sb2NhbGVzW3RoaXMuY3VycmVudExvY2FsZV0gOiBzdXJ2ZXlTdHJpbmdzO1xyXG4gICAgICAgIGlmICghbG9jIHx8ICFsb2Nbc3RyTmFtZV0pIGxvYyA9IHN1cnZleVN0cmluZ3M7XHJcbiAgICAgICAgcmV0dXJuIGxvY1tzdHJOYW1lXTtcclxuICAgIH0sXHJcbiAgICBnZXRMb2NhbGVzOiBmdW5jdGlvbiAoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIHJlcy5wdXNoKFwiXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxvY2FsZXMpIHtcclxuICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLnNvcnQoKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgdmFyIHN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiUHJldmlvdXNcIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJOZXh0XCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiQ29tcGxldGVcIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwiT3RoZXIgKGRlc2NyaWJlKVwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2UgezB9IG9mIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiVGhlcmUgaXMgbm8gdmlzaWJsZSBwYWdlIG9yIHF1ZXN0aW9uIGluIHRoZSBzdXJ2ZXkuXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIlRoYW5rIHlvdSBmb3IgY29tcGxldGluZyB0aGUgc3VydmV5IVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJTdXJ2ZXkgaXMgbG9hZGluZy4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiQ2hvb3NlLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIlBsZWFzZSBhbnN3ZXIgdGhlIHF1ZXN0aW9uLlwiLFxyXG4gICAgcmVxdWlyZWRJbkFsbFJvd3NFcnJvcjogXCJQbGVhc2UgYW5zd2VyIHF1ZXN0aW9ucyBpbiBhbGwgcm93cy5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJUaGUgdmFsdWUgc2hvdWxkIGJlIG51bWVyaWMuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIlBsZWFzZSBlbnRlciBhdCBsZWFzdCB7MH0gc3ltYm9scy5cIixcclxuICAgIHRleHRNYXhMZW5ndGg6IFwiUGxlYXNlIGVudGVyIGxlc3MgdGhhbiB7MH0gc3ltYm9scy5cIixcclxuICAgIHRleHRNaW5NYXhMZW5ndGg6IFwiUGxlYXNlIGVudGVyIG1vcmUgdGhhbiB7MH0gYW5kIGxlc3MgdGhhbiB7MX0gc3ltYm9scy5cIixcclxuICAgIG1pblJvd0NvdW50RXJyb3I6IFwiUGxlYXNlIGZpbGwgaW4gYXQgbGVhc3QgezB9IHJvd3MuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IGF0IGxlYXN0IHswfSB2YXJpYW50cy5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIlBsZWFzZSBzZWxlY3Qgbm8gbW9yZSB0aGFuIHswfSB2YXJpYW50cy5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9IGFuZCBlcXVhbCBvciBsZXNzIHRoYW4gezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIGxlc3MgdGhhbiB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlLW1haWwgYWRkcmVzcy5cIixcclxuICAgIHVybFJlcXVlc3RFcnJvcjogXCJUaGUgcmVxdWVzdCByZXR1cm5lZCBlcnJvciAnezB9Jy4gezF9XCIsXHJcbiAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwiVGhlIHJlcXVlc3QgcmV0dXJuZWQgZW1wdHkgZGF0YSBvciB0aGUgJ3BhdGgnIHByb3BlcnR5IGlzIGluY29ycmVjdFwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJUaGUgZmlsZSBzaXplIHNob3VsZCBub3QgZXhjZWVkIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgZW50ZXIgdGhlIG90aGVyIHZhbHVlLlwiLFxyXG4gICAgdXBsb2FkaW5nRmlsZTogXCJZb3VyIGZpbGUgaXMgdXBsb2FkaW5nLiBQbGVhc2Ugd2FpdCBzZXZlcmFsIHNlY29uZHMgYW5kIHRyeSBhZ2Fpbi5cIixcclxuICAgIGFkZFJvdzogXCJBZGQgcm93XCIsXHJcbiAgICByZW1vdmVSb3c6IFwiUmVtb3ZlXCIsXHJcbiAgICBjaG9pY2VzX2ZpcnN0SXRlbTogXCJmaXJzdCBpdGVtXCIsXHJcbiAgICBjaG9pY2VzX3NlY29uZEl0ZW06IFwic2Vjb25kIGl0ZW1cIixcclxuICAgIGNob2ljZXNfdGhpcmRJdGVtOiBcInRoaXJkIGl0ZW1cIixcclxuICAgIG1hdHJpeF9jb2x1bW46IFwiQ29sdW1uXCIsXHJcbiAgICBtYXRyaXhfcm93OiBcIlJvd1wiXHJcbn07XHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZW5cIl0gPSBzdXJ2ZXlTdHJpbmdzO1xyXG5cclxuaWYgKCFTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxyXG4gICAgICAgICAgICAgICAgOiBtYXRjaFxyXG4gICAgICAgICAgICAgICAgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3VydmV5U3RyaW5ncy50cyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHtTdXJ2ZXl9IGZyb20gXCIuLi9yZWFjdC9yZWFjdFN1cnZleVwiO1xyXG5pbXBvcnQge1N1cnZleVdpbmRvd30gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5V2luZG93XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5Tkcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZW5kZXIoZWxlbWVudElkOiBzdHJpbmcgfCBFbGVtZW50LCBwcm9wcykge1xyXG4gICAgICAgIHZhciBlbGVtZW50OiBFbGVtZW50ID0gdHlwZW9mIGVsZW1lbnRJZCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpIDogZWxlbWVudElkO1xyXG4gICAgICAgIFJlYWN0RE9NLnJlbmRlcig8U3VydmV5IHsuLi5wcm9wc30gLz4sIGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5V2luZG93Tkcge1xyXG4gICAgcHVibGljIHN0YXRpYyByZW5kZXIoZWxlbWVudElkOiBzdHJpbmcgfCBFbGVtZW50LCBwcm9wcykge1xyXG4gICAgICAgIHZhciBlbGVtZW50OiBFbGVtZW50ID0gdHlwZW9mIGVsZW1lbnRJZCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpIDogZWxlbWVudElkO1xyXG4gICAgICAgIFJlYWN0RE9NLnJlbmRlcig8U3VydmV5V2luZG93IHsuLi5wcm9wc30gLz4sIGVsZW1lbnQpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hbmd1bGFyL1N1cnZleU5HLnRzeCIsImltcG9ydCB7SGFzaFRhYmxlfSBmcm9tICcuL2Jhc2UnO1xyXG5pbXBvcnQge0NvbmRpdGlvbnNQYXJzZXJ9IGZyb20gJy4vY29uZGl0aW9uc1BhcnNlcic7XHJcbmltcG9ydCB7UHJvY2Vzc1ZhbHVlfSBmcm9tIFwiLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25kaXRpb24ge1xyXG4gICAgc3RhdGljIG9wZXJhdG9yc1ZhbHVlOiBIYXNoVGFibGU8RnVuY3Rpb24+ID0gbnVsbDtcclxuICAgIHN0YXRpYyBnZXQgb3BlcmF0b3JzKCkge1xyXG4gICAgICAgIGlmIChDb25kaXRpb24ub3BlcmF0b3JzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgXHJcbiAgICAgICAgICAgICAgICBpZihsZWZ0ID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFsZWZ0OyB9LFxyXG4gICAgICAgICAgICBub3RlbXB0eTogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IFxyXG4gICAgICAgICAgICAgICAgaWYobGVmdCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISghbGVmdCk7IFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IFxyXG4gICAgICAgICAgICAgICAgaWYobGVmdCA9PSBudWxsICYmIHJpZ2h0ICE9IG51bGwgfHwgbGVmdCAhPSBudWxsICYmIHJpZ2h0ID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmKGxlZnQgPT0gbnVsbCAmJiByaWdodCA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0ID09IHJpZ2h0OyBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyBcclxuICAgICAgICAgICAgICAgIGlmKGxlZnQgPT0gbnVsbCAmJiByaWdodCAhPSBudWxsIHx8IGxlZnQgIT0gbnVsbCAmJiByaWdodCA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKGxlZnQgPT0gbnVsbCAmJiByaWdodCA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCAhPSByaWdodDsgXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIChsZWZ0ICE9IG51bGwpICYmIGxlZnRbXCJpbmRleE9mXCJdICYmIGxlZnQuaW5kZXhPZihyaWdodCkgPiAtMTsgfSxcclxuICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gKGxlZnQgPT0gbnVsbCkgfHwgIWxlZnRbXCJpbmRleE9mXCJdIHx8IGxlZnQuaW5kZXhPZihyaWdodCkgPT0gLTE7IH0sXHJcbiAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyBcclxuICAgICAgICAgICAgICAgIGlmKGxlZnQgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYocmlnaHQgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA+IHJpZ2h0OyBcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IFxyXG4gICAgICAgICAgICAgICAgaWYocmlnaHQgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYobGVmdCA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0IDwgcmlnaHQ7IFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IFxyXG4gICAgICAgICAgICAgICAgaWYobGVmdCA9PSBudWxsICYmIHJpZ2h0ICE9IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmKHJpZ2h0ID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7IFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsZXNzb3JlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IFxyXG4gICAgICAgICAgICAgICAgaWYobGVmdCAhPSBudWxsICYmIHJpZ2h0ID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmKGxlZnQgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdCA8PSByaWdodDsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9wVmFsdWU6IHN0cmluZyA9IFwiZXF1YWxcIjtcclxuICAgIHB1YmxpYyBsZWZ0OiBhbnkgPSBudWxsO1xyXG4gICAgcHVibGljIHJpZ2h0OiBhbnkgPSBudWxsO1xyXG4gICAgcHVibGljIGdldCBvcGVyYXRvcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wZXJhdG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICghQ29uZGl0aW9uLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICB0aGlzLm9wVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBwZXJmb3JtKGxlZnQ6IGFueSA9IG51bGwsIHJpZ2h0OiBhbnkgPSBudWxsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFsZWZ0KSBsZWZ0ID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgIGlmICghcmlnaHQpIHJpZ2h0ID0gdGhpcy5yaWdodDtcclxuICAgICAgICByZXR1cm4gdGhpcy5wZXJmb3JtRXhwbGljaXQobGVmdCwgcmlnaHQpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHBlcmZvcm1FeHBsaWNpdChsZWZ0OiBhbnksIHJpZ2h0OiBhbnkpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNbdGhpcy5vcGVyYXRvcl0odGhpcy5nZXRQdXJlVmFsdWUobGVmdCksIHRoaXMuZ2V0UHVyZVZhbHVlKHJpZ2h0KSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFB1cmVWYWx1ZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYodmFsID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghdmFsIHx8ICh0eXBlb2YgdmFsICE9IFwic3RyaW5nXCIpKSByZXR1cm4gdmFsO1xyXG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCAmJiAodmFsWzBdID09IFwiJ1wiIHx8IHZhbFswXSA9PSAnXCInKSkgIHZhbCA9IHZhbC5zdWJzdHIoMSk7XHJcbiAgICAgICAgdmFyIGxlbiA9IHZhbC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbiA+IDAgJiYgKHZhbFtsZW4gLSAxXSA9PSBcIidcIiB8fCB2YWxbbGVuIC0gMV0gPT0gJ1wiJykpICB2YWwgPSB2YWwuc3Vic3RyKDAsIGxlbiAtIDEpO1xyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbk5vZGUge1xyXG4gICAgcHJpdmF0ZSBjb25uZWN0aXZlVmFsdWU6IHN0cmluZyA9IFwiYW5kXCI7XHJcbiAgICBwdWJsaWMgY2hpbGRyZW46IEFycmF5PGFueT4gPSBbXTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0aXZlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbm5lY3RpdmVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjb25uZWN0aXZlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBcIiZcIiB8fCB2YWx1ZSA9PSBcIiYmXCIpIHZhbHVlID0gXCJhbmRcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT0gXCJ8XCIgfHwgdmFsdWUgPT0gXCJ8fFwiKSB2YWx1ZSA9IFwib3JcIjtcclxuICAgICAgICBpZiAodmFsdWUgIT0gXCJhbmRcIiAmJiB2YWx1ZSAhPSBcIm9yXCIpIHJldHVybjtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpdmVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0VtcHR5KCkgeyByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMDsgfVxyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpdmUgPSBcImFuZFwiO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBDb25kaXRpb25SdW5uZXIge1xyXG4gICAgcHJpdmF0ZSBleHByZXNzaW9uVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcHJvY2Vzc1ZhbHVlOiBQcm9jZXNzVmFsdWU7XHJcbiAgICBwcml2YXRlIHJvb3Q6IENvbmRpdGlvbk5vZGU7XHJcbiAgICBwcml2YXRlIHZhbHVlczogSGFzaFRhYmxlPGFueT47XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc1ZhbHVlID0gbmV3IFByb2Nlc3NWYWx1ZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBleHByZXNzaW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmV4cHJlc3Npb25WYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBleHByZXNzaW9uKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5leHByZXNzaW9uVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBuZXcgQ29uZGl0aW9uc1BhcnNlcigpLnBhcnNlKHRoaXMuZXhwcmVzc2lvblZhbHVlLCB0aGlzLnJvb3QpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJ1bih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuTm9kZSh0aGlzLnJvb3QpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Ob2RlKG5vZGU6IENvbmRpdGlvbk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgb25GaXJzdEZhaWwgPSBub2RlLmNvbm5lY3RpdmUgPT0gXCJhbmRcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucnVuTm9kZUNvbmRpdGlvbihub2RlLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgaWYgKCFyZXMgJiYgb25GaXJzdEZhaWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHJlcyAmJiAhb25GaXJzdEZhaWwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb25GaXJzdEZhaWw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bk5vZGVDb25kaXRpb24odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImNoaWxkcmVuXCJdKSByZXR1cm4gdGhpcy5ydW5Ob2RlKHZhbHVlKTtcclxuICAgICAgICBpZiAodmFsdWVbXCJsZWZ0XCJdKSByZXR1cm4gdGhpcy5ydW5Db25kaXRpb24odmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcnVuQ29uZGl0aW9uKGNvbmRpdGlvbjogQ29uZGl0aW9uKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGxlZnQgPSBjb25kaXRpb24ubGVmdDtcclxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0VmFsdWVOYW1lKGxlZnQpO1xyXG4gICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGxlZnQgPSB0aGlzLmdldFZhbHVlQnlOYW1lKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmlnaHQgPSBjb25kaXRpb24ucmlnaHQ7XHJcbiAgICAgICAgbmFtZSA9IHRoaXMuZ2V0VmFsdWVOYW1lKHJpZ2h0KTtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICByaWdodCA9IHRoaXMuZ2V0VmFsdWVCeU5hbWUobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25kaXRpb24ucGVyZm9ybUV4cGxpY2l0KGxlZnQsIHJpZ2h0KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmFsdWVCeU5hbWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnByb2Nlc3NWYWx1ZS5oYXNWYWx1ZShuYW1lLCB0aGlzLnZhbHVlcykpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NWYWx1ZS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlTmFtZShub2RlVmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICghbm9kZVZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodHlwZW9mIG5vZGVWYWx1ZSAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmIChub2RlVmFsdWUubGVuZ3RoIDwgMyB8fCBub2RlVmFsdWVbMF0gIT0gJ3snIHx8IG5vZGVWYWx1ZVtub2RlVmFsdWUubGVuZ3RoIC0gMV0gIT0gJ30nKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbm9kZVZhbHVlLnN1YnN0cigxLCBub2RlVmFsdWUubGVuZ3RoIC0gMik7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbmRpdGlvbnMudHMiLCJpbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSAnLi9zdXJ2ZXlTdHJpbmdzJztcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFuc3dlclJlcXVpcmVkRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpICB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBSZXF1cmVOdW1lcmljRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNFcnJvclwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRXhjZWVkU2l6ZUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgcHJpdmF0ZSBtYXhTaXplOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihtYXhTaXplOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWF4U2l6ZSA9IG1heFNpemU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiZXhjZWVkTWF4U2l6ZVwiKVtcImZvcm1hdFwiXSh0aGlzLmdldFRleHRTaXplKCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRUZXh0U2l6ZSgpIHtcclxuICAgICAgICB2YXIgc2l6ZXMgPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJ107XHJcbiAgICAgICAgdmFyIGZpeGVkID0gWzAsIDAsIDIsIDMsIDNdO1xyXG4gICAgICAgIGlmICh0aGlzLm1heFNpemUgPT0gMCkgcmV0dXJuICcwIEJ5dGUnO1xyXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyh0aGlzLm1heFNpemUpIC8gTWF0aC5sb2coMTAyNCkpO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMubWF4U2l6ZSAvIE1hdGgucG93KDEwMjQsIGkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKGZpeGVkW2ldKSArICcgJyArIHNpemVzW2ldO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXJyb3IudHMiLCJleHBvcnQgaW50ZXJmYWNlIElMb2NhbGl6YWJsZU93bmVyIHtcclxuICAgIGdldExvY2FsZSgpOiBzdHJpbmc7XHJcbiAgICBnZXRNYXJrZG93bkh0bWwodGV4dDogc3RyaW5nKTogc3RyaW5nO1xyXG59XHJcbi8qKlxyXG4gKiBUaGUgY2xhc3MgcmVwcmVzZW50cyB0aGUgc3RyaW5nIHRoYXQgc3VwcG9ydHMgbXVsdGktbGFuZ3VhZ2VzIGFuZCBtYXJrZG93bi5cclxuICogSXQgdXNlcyBpbiBhbGwgb2JqZWN0cyB3aGVyZSBzdXBwb3J0IGZvciBtdWx0aS1sYW5ndWFnZXMgYW5kIG1hcmtkb3duIGlzIHJlcXVpcmVkLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIExvY2FsaXphYmxlU3RyaW5nIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgIGRlZmF1bHRMb2NhbGU6IHN0cmluZyA9IFwiZGVmYXVsdFwiO1xyXG4gICAgcHJpdmF0ZSB2YWx1ZXMgPSB7fTtcclxuICAgIHByaXZhdGUgaHRtbFZhbHVlcyA9IHt9O1xyXG4gICAgcHVibGljIG9uUmVuZGVyZWRIdG1sQ2FsbGJhY2s6IChodG1sOiBzdHJpbmcpID0+IHN0cmluZztcclxuICAgIHB1YmxpYyBvbkdldFRleHRDYWxsYmFjazogKHN0cjogc3RyaW5nKSA9PiBzdHJpbmcgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IgKHB1YmxpYyBvd25lcjogSUxvY2FsaXphYmxlT3duZXIsIHB1YmxpYyB1c2VNYXJrZG93bjogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGxvY2FsZSgpIHtyZXR1cm4gdGhpcy5vd25lciA/IHRoaXMub3duZXIuZ2V0TG9jYWxlKCkgOiBcIlwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHRleHQoKSA6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucHVyZVRleHQ7XHJcbiAgICAgICAgaWYodGhpcy5vbkdldFRleHRDYWxsYmFjaykgcmVzID0gdGhpcy5vbkdldFRleHRDYWxsYmFjayhyZXMpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHB1cmVUZXh0KCkge1xyXG4gICAgICAgIHZhciBsb2MgPSB0aGlzLmxvY2FsZTtcclxuICAgICAgICBpZighbG9jKSBsb2MgPSBMb2NhbGl6YWJsZVN0cmluZy5kZWZhdWx0TG9jYWxlO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnZhbHVlc1tsb2NdO1xyXG4gICAgICAgIGlmKCFyZXMgJiYgbG9jICE9PSBMb2NhbGl6YWJsZVN0cmluZy5kZWZhdWx0TG9jYWxlKSB7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMudmFsdWVzW0xvY2FsaXphYmxlU3RyaW5nLmRlZmF1bHRMb2NhbGVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZighcmVzKSByZXMgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0h0bWwoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzSHRtbFZhbHVlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGh0bWwoKSB7XHJcbiAgICAgICAgaWYoIXRoaXMuaGFzSHRtbCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SHRtbFZhbHVlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRleHRPckh0bWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzSHRtbCA/IHRoaXMuZ2V0SHRtbFZhbHVlKCkgOiB0aGlzLnRleHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbmRlcmVkSHRtbCgpIHtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy50ZXh0T3JIdG1sO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uUmVuZGVyZWRIdG1sQ2FsbGJhY2sgPyB0aGlzLm9uUmVuZGVyZWRIdG1sQ2FsbGJhY2socmVzKSA6IHJlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRMb2NhbGVUZXh0KHRoaXMubG9jYWxlLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TG9jYWxlVGV4dChsb2M6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYoIWxvYykgbG9jID0gTG9jYWxpemFibGVTdHJpbmcuZGVmYXVsdExvY2FsZTtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy52YWx1ZXNbbG9jXTtcclxuICAgICAgICByZXR1cm4gcmVzID8gcmVzIDogXCJcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRMb2NhbGVUZXh0KGxvYzogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYodmFsdWUgPT0gdGhpcy5nZXRMb2NhbGVUZXh0KGxvYykpIHJldHVybjtcclxuICAgICAgICBpZighbG9jKSBsb2MgPSBMb2NhbGl6YWJsZVN0cmluZy5kZWZhdWx0TG9jYWxlO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmh0bWxWYWx1ZXNbbG9jXTtcclxuICAgICAgICBpZighdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYodGhpcy52YWx1ZXNbbG9jXSkgZGVsZXRlIHRoaXMudmFsdWVzW2xvY107XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGlmKGxvYyAhPSBMb2NhbGl6YWJsZVN0cmluZy5kZWZhdWx0TG9jYWxlICYmIHZhbHVlID09IHRoaXMuZ2V0TG9jYWxlVGV4dChMb2NhbGl6YWJsZVN0cmluZy5kZWZhdWx0TG9jYWxlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxlVGV4dChsb2MsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tsb2NdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYobG9jID09IExvY2FsaXphYmxlU3RyaW5nLmRlZmF1bHRMb2NhbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVWYWx1ZXNFcXVhbHNUb0RlZmF1bHQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEpzb24oKTogYW55IHtcclxuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMudmFsdWVzKTtcclxuICAgICAgICBpZihrZXlzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZihrZXlzLmxlbmd0aCA9PSAxICYmIGtleXNbMF0gPT0gTG9jYWxpemFibGVTdHJpbmcuZGVmYXVsdExvY2FsZSkgcmV0dXJuIHRoaXMudmFsdWVzW2tleXNbMF1dO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRKc29uKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnZhbHVlcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuaHRtbFZhbHVlcyA9IHt9O1xyXG4gICAgICAgIGlmKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxlVGV4dChudWxsLCB2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxlVGV4dChrZXksIHZhbHVlW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub25DaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb25DaGFuZ2VkKCkge31cclxuICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkge31cclxuICAgIHByaXZhdGUgaGFzSHRtbFZhbHVlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmKCF0aGlzLm93bmVyIHx8ICF0aGlzLnVzZU1hcmtkb3duKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICAgICAgaWYoIXRleHQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgbG9jID0gdGhpcy5sb2NhbGU7XHJcbiAgICAgICAgaWYoIWxvYykgbG9jID0gTG9jYWxpemFibGVTdHJpbmcuZGVmYXVsdExvY2FsZTtcclxuICAgICAgICBpZighKGxvYyBpbiB0aGlzLmh0bWxWYWx1ZXMpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbFZhbHVlc1tsb2NdID0gdGhpcy5vd25lci5nZXRNYXJrZG93bkh0bWwodGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0bWxWYWx1ZXNbbG9jXSA/IHRydWUgOiBmYWxzZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0SHRtbFZhbHVlKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBsb2MgPSB0aGlzLmxvY2FsZTtcclxuICAgICAgICBpZighbG9jKSBsb2MgPSBMb2NhbGl6YWJsZVN0cmluZy5kZWZhdWx0TG9jYWxlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmh0bWxWYWx1ZXNbbG9jXTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlbGV0ZVZhbHVlc0VxdWFsc1RvRGVmYXVsdChkZWZhdWx0VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGhpcy52YWx1ZXMpO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICBpZihrZXlzW2ldID09IExvY2FsaXphYmxlU3RyaW5nLmRlZmF1bHRMb2NhbGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZih0aGlzLnZhbHVlc1trZXlzW2ldXSA9PSBkZWZhdWx0VmFsdWUpIGRlbGV0ZSB0aGlzLnZhbHVlc1trZXlzW2ldXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xvY2FsaXphYmxlc3RyaW5nLnRzIiwiaW1wb3J0IHtIYXNoVGFibGV9IGZyb20gJy4vYmFzZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvY2Vzc1ZhbHVlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBwdWJsaWMgZ2V0Rmlyc3ROYW1lKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm4gdGV4dDtcclxuICAgICAgICB2YXIgcmVzID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoID0gdGV4dFtpXTtcclxuICAgICAgICAgICAgaWYgKGNoID09ICcuJyB8fCBjaCA9PSAnWycpIGJyZWFrO1xyXG4gICAgICAgICAgICByZXMgKz0gY2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGFzVmFsdWUodGV4dDogc3RyaW5nLCB2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuZ2V0VmFsdWVDb3JlKHRleHQsIHZhbHVlcyk7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5oYXNWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRWYWx1ZSh0ZXh0OiBzdHJpbmcsIHZhbHVlczogSGFzaFRhYmxlPGFueT4pOiBhbnkge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmdldFZhbHVlQ29yZSh0ZXh0LCB2YWx1ZXMpO1xyXG4gICAgICAgIHJldHVybiByZXMudmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlQ29yZSh0ZXh0OiBzdHJpbmcsIHZhbHVlczogYW55KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzID0geyBoYXNWYWx1ZTogZmFsc2UsIHZhbHVlOiBudWxsIH07XHJcbiAgICAgICAgdmFyIGN1clZhbHVlID0gdmFsdWVzO1xyXG4gICAgICAgIGlmICghY3VyVmFsdWUpIHJldHVybiByZXM7XHJcbiAgICAgICAgdmFyIGlzRmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIHdoaWxlICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaXNBcnJheSA9ICFpc0ZpcnN0ICYmIHRleHRbMF0gPT0gJ1snO1xyXG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdCkgdGV4dCA9IHRleHQuc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1ck5hbWUgPSB0aGlzLmdldEZpcnN0TmFtZSh0ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmICghY3VyTmFtZSkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIGlmICghY3VyVmFsdWVbY3VyTmFtZV0pIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICBjdXJWYWx1ZSA9IGN1clZhbHVlW2N1ck5hbWVdXHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIoY3VyTmFtZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGN1clZhbHVlKSkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA8IHRleHQubGVuZ3RoICYmIHRleHRbaW5kZXhdICE9ICddJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSB0ZXh0W2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IGluZGV4IDwgdGV4dC5sZW5ndGggPyB0ZXh0LnN1YnN0cihpbmRleCArIDEpIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gdGhpcy5nZXRJbnRWYWx1ZShzdHIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBjdXJWYWx1ZS5sZW5ndGgpIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICBjdXJWYWx1ZSA9IGN1clZhbHVlW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy52YWx1ZSA9IGN1clZhbHVlO1xyXG4gICAgICAgIHJlcy5oYXNWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0SW50VmFsdWUoc3RyOiBhbnkpIHtcclxuICAgICAgICBpZiAoc3RyID09IFwiMFwiIHx8ICgoc3RyIHwgMCkgPiAwICYmIHN0ciAlIDEgPT0gMCkpXHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoc3RyKTtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbmRpdGlvblByb2Nlc3NWYWx1ZS50cyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtSZWFjdFN1cnZleU1vZGVsfSBmcm9tIFwiLi9yZWFjdHN1cnZleW1vZGVsXCI7XHJcbmltcG9ydCB7U3VydmV5UGFnZX0gZnJvbSBcIi4vcmVhY3RwYWdlXCI7XHJcbmltcG9ydCB7U3VydmV5TmF2aWdhdGlvbn0gZnJvbSBcIi4vcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7SVN1cnZleUNyZWF0b3J9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25cIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtzdXJ2ZXlDc3N9IGZyb20gXCIuLi9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkXCI7XHJcbmltcG9ydCB7U3VydmV5UHJvZ3Jlc3N9IGZyb20gXCIuL3JlYWN0U3VydmV5UHJvZ3Jlc3NcIjtcclxuaW1wb3J0IHtTdXJ2ZXlQYWdlSWR9IGZyb20gXCIuLi9iYXNlXCI7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiBpbXBsZW1lbnRzIElTdXJ2ZXlDcmVhdG9yIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGNzc1R5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHN1cnZleUNzcy5jdXJyZW50VHlwZTsgfVxyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgY3NzVHlwZSh2YWx1ZTogc3RyaW5nKSB7IHN1cnZleUNzcy5jdXJyZW50VHlwZSA9IHZhbHVlOyB9XHJcbiAgICBwcm90ZWN0ZWQgc3VydmV5OiBSZWFjdFN1cnZleU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBpc0N1cnJlbnRQYWdlQ2hhbmdlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTdXJ2ZXkocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3VydmV5KG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5pc0N1cnJlbnRQYWdlQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkuZm9jdXNGaXJzdFF1ZXN0aW9uQXV0b21hdGljKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5mb2N1c0ZpcnN0UXVlc3Rpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHZhciBlbCA9IHRoaXMucmVmc1tcInJvb3RcIl07XHJcbiAgICAgICAgaWYgKGVsICYmIHRoaXMuc3VydmV5KSB0aGlzLnN1cnZleS5kb0FmdGVyUmVuZGVyU3VydmV5KGVsKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5LnN0YXRlID09IFwiY29tcGxldGVkXCIpIHJldHVybiB0aGlzLnJlbmRlckNvbXBsZXRlZCgpO1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleS5zdGF0ZSA9PSBcImxvYWRpbmdcIikgcmV0dXJuIHRoaXMucmVuZGVyTG9hZGluZygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclN1cnZleSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjc3MoKTogYW55IHsgcmV0dXJuIHN1cnZleUNzcy5nZXRDc3MoKTsgfVxyXG4gICAgcHVibGljIHNldCBjc3ModmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm1lcmdlQ3NzKHZhbHVlLCB0aGlzLmNzcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQ29tcGxldGVkKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZighdGhpcy5zdXJ2ZXkuc2hvd0NvbXBsZXRlZFBhZ2UpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBodG1sVmFsdWUgPSB7IF9faHRtbDogdGhpcy5zdXJ2ZXkucHJvY2Vzc2VkQ29tcGxldGVkSHRtbCB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTG9hZGluZygpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGh0bWxWYWx1ZSA9IHsgX19odG1sOiB0aGlzLnN1cnZleS5wcm9jZXNzZWRMb2FkaW5nSHRtbCB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyU3VydmV5KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnN1cnZleS50aXRsZSAmJiB0aGlzLnN1cnZleS5zaG93VGl0bGUgPyB0aGlzLnJlbmRlclRpdGxlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBjdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlID8gdGhpcy5yZW5kZXJQYWdlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciB0b3BQcm9ncmVzcyA9IHRoaXMuc3VydmV5LnNob3dQcm9ncmVzc0JhciA9PSBcInRvcFwiID8gdGhpcy5yZW5kZXJQcm9ncmVzcyh0cnVlKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGJvdHRvbVByb2dyZXNzID0gdGhpcy5zdXJ2ZXkuc2hvd1Byb2dyZXNzQmFyID09IFwiYm90dG9tXCIgPyB0aGlzLnJlbmRlclByb2dyZXNzKGZhbHNlKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSAoY3VycmVudFBhZ2UgJiYgdGhpcy5zdXJ2ZXkuc2hvd05hdmlnYXRpb25CdXR0b25zKSA/IHRoaXMucmVuZGVyTmF2aWdhdGlvbigpIDogbnVsbDtcclxuICAgICAgICBpZiAoIWN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlID0gdGhpcy5yZW5kZXJFbXB0eVN1cnZleSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IHJlZj1cInJvb3RcIiBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD17U3VydmV5UGFnZUlkfSBjbGFzc05hbWU9e3RoaXMuY3NzLmJvZHl9PlxyXG4gICAgICAgICAgICAgICAgICAgIHt0b3BQcm9ncmVzc31cclxuICAgICAgICAgICAgICAgICAgICB7Y3VycmVudFBhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAge2JvdHRvbVByb2dyZXNzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7YnV0dG9uc31cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gU3VydmV5RWxlbWVudEJhc2UucmVuZGVyTG9jU3RyaW5nKHRoaXMuc3VydmV5LmxvY1RpdGxlKTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmhlYWRlcn0+PGgzPnt0aXRsZX08L2gzPjwvZGl2PjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJQYWdlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFN1cnZleVBhZ2Ugc3VydmV5PXt0aGlzLnN1cnZleX0gcGFnZT17dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2V9IGNzcz17dGhpcy5jc3N9IGNyZWF0b3I9e3RoaXN9IC8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb2dyZXNzKGlzVG9wOiBib29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5UHJvZ3Jlc3Mgc3VydmV5PXt0aGlzLnN1cnZleX0gY3NzPXt0aGlzLmNzc30gaXNUb3A9e2lzVG9wfSAgLz47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTmF2aWdhdGlvbigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlOYXZpZ2F0aW9uIHN1cnZleSA9IHt0aGlzLnN1cnZleX0gY3NzPXt0aGlzLmNzc30vPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJFbXB0eVN1cnZleSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8c3Bhbj57dGhpcy5zdXJ2ZXkuZW1wdHlTdXJ2ZXlUZXh0fTwvc3Bhbj4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTdXJ2ZXkobmV3UHJvcHM6IGFueSkge1xyXG4gICAgICAgIGlmIChuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMubW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3UHJvcHMubW9kZWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3UHJvcHMuanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3IFJlYWN0U3VydmV5TW9kZWwobmV3UHJvcHMuanNvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleSA9IG5ldyBSZWFjdFN1cnZleU1vZGVsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMuY2xpZW50SWQpIHRoaXMuc3VydmV5LmNsaWVudElkID0gbmV3UHJvcHMuY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5kYXRhKSB0aGlzLnN1cnZleS5kYXRhID0gbmV3UHJvcHMuZGF0YTtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmNzcykgdGhpcy5zdXJ2ZXkubWVyZ2VDc3MobmV3UHJvcHMuY3NzLCB0aGlzLmNzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3NldCB0aGUgZmlyc3QgcGFnZVxyXG4gICAgICAgIHZhciBkdW1teSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0geyBwYWdlSW5kZXhDaGFuZ2U6IDAsIGlzQ29tcGxldGVkOiBmYWxzZSwgbW9kZWxDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdGhpcy5zZXRTdXJ2ZXlFdmVudHMobmV3UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldFN1cnZleUV2ZW50cyhuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlckNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLm1vZGVsQ2hhbmdlZCA9IHNlbGYuc3RhdGUubW9kZWxDaGFuZ2VkICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXIpID0+IHsgc2VsZi5zdGF0ZS5pc0NvbXBsZXRlZCA9IHRydWU7IHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uUGFydGlhbFNlbmQuYWRkKChzZW5kZXIpID0+IHsgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTsgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25DdXJyZW50UGFnZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5pc0N1cnJlbnRQYWdlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUucGFnZUluZGV4Q2hhbmdlID0gc2VsZi5zdGF0ZS5wYWdlSW5kZXhDaGFuZ2UgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMgJiYgbmV3UHJvcHMub25DdXJyZW50UGFnZUNoYW5nZWQpIG5ld1Byb3BzLm9uQ3VycmVudFBhZ2VDaGFuZ2VkKHNlbmRlciwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25WaXNpYmxlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5xdWVzdGlvbiAmJiBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0LnN0YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUudmlzaWJsZSA9IG9wdGlvbnMucXVlc3Rpb24udmlzaWJsZTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc2V0U3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25WYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucXVlc3Rpb24gJiYgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnZhbHVlID0gb3B0aW9ucy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc2V0U3RhdGUoc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCFuZXdQcm9wcykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uVmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5kYXRhKSBuZXdQcm9wcy5kYXRhW29wdGlvbnMubmFtZV0gPSBvcHRpb25zLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMub25WYWx1ZUNoYW5nZWQpIG5ld1Byb3BzLm9uVmFsdWVDaGFuZ2VkKHNlbmRlciwgb3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcikgPT4geyBuZXdQcm9wcy5vbkNvbXBsZXRlKHNlbmRlcik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25QYXJ0aWFsU2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblBhcnRpYWxTZW5kLmFkZCgoc2VuZGVyKSA9PiB7IG5ld1Byb3BzLm9uUGFydGlhbFNlbmQoc2VuZGVyKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uUGFnZVZpc2libGVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IGlmIChuZXdQcm9wcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZCkgbmV3UHJvcHMub25QYWdlVmlzaWJsZUNoYW5nZWQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uU2VydmVyVmFsaWRhdGVRdWVzdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucyA9IG5ld1Byb3BzLm9uU2VydmVyVmFsaWRhdGVRdWVzdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblF1ZXN0aW9uQWRkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25RdWVzdGlvbkFkZGVkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uUXVlc3Rpb25BZGRlZChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uUXVlc3Rpb25SZW1vdmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uUXVlc3Rpb25SZW1vdmVkKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25WYWxpZGF0ZVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uVmFsaWRhdGVRdWVzdGlvbi5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vblZhbGlkYXRlUXVlc3Rpb24oc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblNlbmRSZXN1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25TZW5kUmVzdWx0LmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uU2VuZFJlc3VsdChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uR2V0UmVzdWx0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uR2V0UmVzdWx0LmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uR2V0UmVzdWx0KHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25Qcm9jZXNzSHRtbCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblByb2Nlc3NIdG1sLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uUHJvY2Vzc0h0bWwoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vbkFmdGVyUmVuZGVyU3VydmV5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQWZ0ZXJSZW5kZXJTdXJ2ZXkuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25BZnRlclJlbmRlclN1cnZleShzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uQWZ0ZXJSZW5kZXJQYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQWZ0ZXJSZW5kZXJQYWdlLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uQWZ0ZXJSZW5kZXJQYWdlKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25BZnRlclJlbmRlclF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQWZ0ZXJSZW5kZXJRdWVzdGlvbi5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vbkFmdGVyUmVuZGVyUXVlc3Rpb24oc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKG5ld1Byb3BzLm9uVGV4dE1hcmtkb3duKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uVGV4dE1hcmtkb3duLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7IG5ld1Byb3BzLm9uVGV4dE1hcmtkb3duKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL0lTdXJ2ZXlDcmVhdG9yXHJcbiAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uQ3NzID0gdGhpcy5jc3NbcXVlc3Rpb24uZ2V0VHlwZSgpXTtcclxuICAgICAgICByZXR1cm4gUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb24uZ2V0VHlwZSgpLCB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uOiBxdWVzdGlvbiwgY3NzOiBxdWVzdGlvbkNzcywgcm9vdENzczogdGhpcy5jc3MsIGlzRGlzcGxheU1vZGU6IHF1ZXN0aW9uLmlzUmVhZE9ubHksIGNyZWF0b3I6IHRoaXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW5kZXJFcnJvcihrZXk6IHN0cmluZywgZXJyb3JUZXh0OiBzdHJpbmcpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYga2V5PXtrZXl9IGNsYXNzTmFtZT17dGhpcy5jc3MuZXJyb3IuaXRlbX0+e2Vycm9yVGV4dH08L2Rpdj47XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25UaXRsZUxvY2F0aW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnN1cnZleS5xdWVzdGlvblRpdGxlTG9jYXRpb247IH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXkudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5TmF2aWdhdGlvbkJhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBzdXJ2ZXk6IFN1cnZleU1vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB1cGRhdGU6IDAgfTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IG5leHRQcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTdGF0ZUZ1bmN0aW9uOiBhbnkgPSBudWxsO1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5KSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZUZ1bmN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdGF0ZS51cGRhdGUgPSBzZWxmLnN0YXRlLnVwZGF0ZSArIDE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUGFnZVZpc2libGVDaGFuZ2VkLmFkZCh0aGlzLnVwZGF0ZVN0YXRlRnVuY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSAmJiB0aGlzLnVwZGF0ZVN0YXRlRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25QYWdlVmlzaWJsZUNoYW5nZWQucmVtb3ZlKHRoaXMudXBkYXRlU3RhdGVGdW5jdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGVGdW5jdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb25CYXNlLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtIYXNoVGFibGV9IGZyb20gXCIuLi9iYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhY3RRdWVzdGlvbkZhY3Rvcnkge1xyXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogUmVhY3RRdWVzdGlvbkZhY3RvcnkgPSBuZXcgUmVhY3RRdWVzdGlvbkZhY3RvcnkoKTtcclxuICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBKU1guRWxlbWVudD4gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBKU1guRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXSA9IHF1ZXN0aW9uQ3JlYXRvcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBbGxUeXBlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBwYXJhbXM6IGFueSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gY3JlYXRvcihwYXJhbXMpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uZmFjdG9yeS50c3giLCJleHBvcnQgY2xhc3MgVGV4dFByZVByb2Nlc3Nvckl0ZW0ge1xyXG4gICAgcHVibGljIHN0YXJ0OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgZW5kOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUZXh0UHJlUHJvY2Vzc29yIHtcclxuICAgIHB1YmxpYyBvblByb2Nlc3M6IChuYW1lOiBzdHJpbmcpID0+IGFueTtcclxuICAgIHB1YmxpYyBvbkhhc1ZhbHVlOiAobmFtZTogc3RyaW5nKSA9PiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHB1YmxpYyBwcm9jZXNzKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm4gdGV4dDtcclxuICAgICAgICBpZiAoIXRoaXMub25Qcm9jZXNzKSByZXR1cm4gdGV4dDtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmdldEl0ZW1zKHRleHQpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBpdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0TmFtZSh0ZXh0LnN1YnN0cmluZyhpdGVtLnN0YXJ0ICsgMSwgaXRlbS5lbmQpKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNhblByb2Nlc3NOYW1lKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25IYXNWYWx1ZSAmJiAhdGhpcy5vbkhhc1ZhbHVlKG5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5vblByb2Nlc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB2YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cigwLCBpdGVtLnN0YXJ0KSArIHZhbHVlICsgdGV4dC5zdWJzdHIoaXRlbS5lbmQgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEl0ZW1zKHRleHQ6IHN0cmluZyk6IEFycmF5PFRleHRQcmVQcm9jZXNzb3JJdGVtPiB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRleHQubGVuZ3RoO1xyXG4gICAgICAgIHZhciBzdGFydCA9IC0xO1xyXG4gICAgICAgIHZhciBjaCA9ICcnO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2ggPSB0ZXh0W2ldO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT0gJ3snKSBzdGFydCA9IGk7XHJcbiAgICAgICAgICAgIGlmIChjaCA9PSAnfScpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGFydCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgVGV4dFByZVByb2Nlc3Nvckl0ZW0oKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnN0YXJ0ID0gc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5lbmQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0TmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIHJldHVybiBuYW1lLnRyaW0oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2FuUHJvY2Vzc05hbWUobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaCA9IG5hbWVbaV07XHJcbiAgICAgICAgICAgIC8vVE9ET1xyXG4gICAgICAgICAgICBpZiAoY2ggPT0gJyAnIHx8IGNoID09ICctJyB8fCBjaCA9PSAnJicpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RleHRQcmVQcm9jZXNzb3IudHMiLCIhZnVuY3Rpb24oZ2xvYmFsLCBmYWN0b3J5KSB7XG4gICAgJ29iamVjdCcgPT0gdHlwZW9mIGV4cG9ydHMgJiYgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIG1vZHVsZSA/IGZhY3RvcnkoZXhwb3J0cykgOiAnZnVuY3Rpb24nID09IHR5cGVvZiBkZWZpbmUgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbICdleHBvcnRzJyBdLCBmYWN0b3J5KSA6IGZhY3RvcnkoZ2xvYmFsLnByZWFjdCA9IGdsb2JhbC5wcmVhY3QgfHwge30pO1xufSh0aGlzLCBmdW5jdGlvbihleHBvcnRzKSB7XG4gICAgZnVuY3Rpb24gVk5vZGUobm9kZU5hbWUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSB7XG4gICAgICAgIHRoaXMubm9kZU5hbWUgPSBub2RlTmFtZTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLmtleSA9IGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5rZXk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGgobm9kZU5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuLCBsYXN0U2ltcGxlLCBjaGlsZCwgc2ltcGxlLCBpO1xuICAgICAgICBmb3IgKGkgPSBhcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHN0YWNrLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHN0YWNrLnB1c2goYXR0cmlidXRlcy5jaGlsZHJlbik7XG4gICAgICAgICAgICBkZWxldGUgYXR0cmlidXRlcy5jaGlsZHJlbjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSBpZiAoKGNoaWxkID0gc3RhY2sucG9wKCkpIGluc3RhbmNlb2YgQXJyYXkpIGZvciAoaSA9IGNoaWxkLmxlbmd0aDsgaS0tOyApIHN0YWNrLnB1c2goY2hpbGRbaV0pOyBlbHNlIGlmIChudWxsICE9IGNoaWxkICYmIGNoaWxkICE9PSAhMCAmJiBjaGlsZCAhPT0gITEpIHtcbiAgICAgICAgICAgIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgY2hpbGQpIGNoaWxkID0gU3RyaW5nKGNoaWxkKTtcbiAgICAgICAgICAgIHNpbXBsZSA9ICdzdHJpbmcnID09IHR5cGVvZiBjaGlsZDtcbiAgICAgICAgICAgIGlmIChzaW1wbGUgJiYgbGFzdFNpbXBsZSkgY2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoIC0gMV0gKz0gY2hpbGQ7IGVsc2Uge1xuICAgICAgICAgICAgICAgIChjaGlsZHJlbiB8fCAoY2hpbGRyZW4gPSBbXSkpLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgIGxhc3RTaW1wbGUgPSBzaW1wbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHAgPSBuZXcgVk5vZGUobm9kZU5hbWUsIGF0dHJpYnV0ZXMgfHwgdm9pZCAwLCBjaGlsZHJlbiB8fCBFTVBUWV9DSElMRFJFTik7XG4gICAgICAgIGlmIChvcHRpb25zLnZub2RlKSBvcHRpb25zLnZub2RlKHApO1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgZnVuY3Rpb24gZXh0ZW5kKG9iaiwgcHJvcHMpIHtcbiAgICAgICAgaWYgKHByb3BzKSBmb3IgKHZhciBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xvbmUob2JqKSB7XG4gICAgICAgIHJldHVybiBleHRlbmQoe30sIG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlbHZlKG9iaiwga2V5KSB7XG4gICAgICAgIGZvciAodmFyIHAgPSBrZXkuc3BsaXQoJy4nKSwgaSA9IDA7IGkgPCBwLmxlbmd0aCAmJiBvYmo7IGkrKykgb2JqID0gb2JqW3BbaV1dO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgICAgICByZXR1cm4gJ2Z1bmN0aW9uJyA9PSB0eXBlb2Ygb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICAgICAgcmV0dXJuICdzdHJpbmcnID09IHR5cGVvZiBvYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhc2hUb0NsYXNzTmFtZShjKSB7XG4gICAgICAgIHZhciBzdHIgPSAnJztcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBjKSBpZiAoY1twcm9wXSkge1xuICAgICAgICAgICAgaWYgKHN0cikgc3RyICs9ICcgJztcbiAgICAgICAgICAgIHN0ciArPSBwcm9wO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb25lRWxlbWVudCh2bm9kZSwgcHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIGgodm5vZGUubm9kZU5hbWUsIGV4dGVuZChjbG9uZSh2bm9kZS5hdHRyaWJ1dGVzKSwgcHJvcHMpLCBhcmd1bWVudHMubGVuZ3RoID4gMiA/IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHZub2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlTGlua2VkU3RhdGUoY29tcG9uZW50LCBrZXksIGV2ZW50UGF0aCkge1xuICAgICAgICB2YXIgcGF0aCA9IGtleS5zcGxpdCgnLicpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIHQgPSBlICYmIGUudGFyZ2V0IHx8IHRoaXMsIHN0YXRlID0ge30sIG9iaiA9IHN0YXRlLCB2ID0gaXNTdHJpbmcoZXZlbnRQYXRoKSA/IGRlbHZlKGUsIGV2ZW50UGF0aCkgOiB0Lm5vZGVOYW1lID8gdC50eXBlLm1hdGNoKC9eY2hlfHJhZC8pID8gdC5jaGVja2VkIDogdC52YWx1ZSA6IGUsIGkgPSAwO1xuICAgICAgICAgICAgZm9yICg7aSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSBvYmogPSBvYmpbcGF0aFtpXV0gfHwgKG9ialtwYXRoW2ldXSA9ICFpICYmIGNvbXBvbmVudC5zdGF0ZVtwYXRoW2ldXSB8fCB7fSk7XG4gICAgICAgICAgICBvYmpbcGF0aFtpXV0gPSB2O1xuICAgICAgICAgICAgY29tcG9uZW50LnNldFN0YXRlKHN0YXRlKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKCFjb21wb25lbnQuX2RpcnR5ICYmIChjb21wb25lbnQuX2RpcnR5ID0gITApICYmIDEgPT0gaXRlbXMucHVzaChjb21wb25lbnQpKSAob3B0aW9ucy5kZWJvdW5jZVJlbmRlcmluZyB8fCBkZWZlcikocmVyZW5kZXIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXJlbmRlcigpIHtcbiAgICAgICAgdmFyIHAsIGxpc3QgPSBpdGVtcztcbiAgICAgICAgaXRlbXMgPSBbXTtcbiAgICAgICAgd2hpbGUgKHAgPSBsaXN0LnBvcCgpKSBpZiAocC5fZGlydHkpIHJlbmRlckNvbXBvbmVudChwKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbmFsQ29tcG9uZW50KHZub2RlKSB7XG4gICAgICAgIHZhciBub2RlTmFtZSA9IHZub2RlICYmIHZub2RlLm5vZGVOYW1lO1xuICAgICAgICByZXR1cm4gbm9kZU5hbWUgJiYgaXNGdW5jdGlvbihub2RlTmFtZSkgJiYgIShub2RlTmFtZS5wcm90b3R5cGUgJiYgbm9kZU5hbWUucHJvdG90eXBlLnJlbmRlcik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGJ1aWxkRnVuY3Rpb25hbENvbXBvbmVudCh2bm9kZSwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gdm5vZGUubm9kZU5hbWUoZ2V0Tm9kZVByb3BzKHZub2RlKSwgY29udGV4dCB8fCBFTVBUWSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzU2FtZU5vZGVUeXBlKG5vZGUsIHZub2RlKSB7XG4gICAgICAgIGlmIChpc1N0cmluZyh2bm9kZSkpIHJldHVybiBub2RlIGluc3RhbmNlb2YgVGV4dDtcbiAgICAgICAgaWYgKGlzU3RyaW5nKHZub2RlLm5vZGVOYW1lKSkgcmV0dXJuICFub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciAmJiBpc05hbWVkTm9kZShub2RlLCB2bm9kZS5ub2RlTmFtZSk7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHZub2RlLm5vZGVOYW1lKSkgcmV0dXJuIChub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA/IG5vZGUuX2NvbXBvbmVudENvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZSA6ICEwKSB8fCBpc0Z1bmN0aW9uYWxDb21wb25lbnQodm5vZGUpOyBlbHNlIDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNOYW1lZE5vZGUobm9kZSwgbm9kZU5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUubm9ybWFsaXplZE5vZGVOYW1lID09PSBub2RlTmFtZSB8fCB0b0xvd2VyQ2FzZShub2RlLm5vZGVOYW1lKSA9PT0gdG9Mb3dlckNhc2Uobm9kZU5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXROb2RlUHJvcHModm5vZGUpIHtcbiAgICAgICAgdmFyIHByb3BzID0gY2xvbmUodm5vZGUuYXR0cmlidXRlcyk7XG4gICAgICAgIHByb3BzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG4gICAgICAgIHZhciBkZWZhdWx0UHJvcHMgPSB2bm9kZS5ub2RlTmFtZS5kZWZhdWx0UHJvcHM7XG4gICAgICAgIGlmIChkZWZhdWx0UHJvcHMpIGZvciAodmFyIGkgaW4gZGVmYXVsdFByb3BzKSBpZiAodm9pZCAwID09PSBwcm9wc1tpXSkgcHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTm9kZShub2RlKSB7XG4gICAgICAgIHZhciBwID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgICBpZiAocCkgcC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0QWNjZXNzb3Iobm9kZSwgbmFtZSwgb2xkLCB2YWx1ZSwgaXNTdmcpIHtcbiAgICAgICAgaWYgKCdjbGFzc05hbWUnID09PSBuYW1lKSBuYW1lID0gJ2NsYXNzJztcbiAgICAgICAgaWYgKCdjbGFzcycgPT09IG5hbWUgJiYgdmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB2YWx1ZSA9IGhhc2hUb0NsYXNzTmFtZSh2YWx1ZSk7XG4gICAgICAgIGlmICgna2V5JyA9PT0gbmFtZSkgOyBlbHNlIGlmICgnY2xhc3MnID09PSBuYW1lICYmICFpc1N2Zykgbm9kZS5jbGFzc05hbWUgPSB2YWx1ZSB8fCAnJzsgZWxzZSBpZiAoJ3N0eWxlJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSB8fCBpc1N0cmluZyh2YWx1ZSkgfHwgaXNTdHJpbmcob2xkKSkgbm9kZS5zdHlsZS5jc3NUZXh0ID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1N0cmluZyhvbGQpKSBmb3IgKHZhciBpIGluIG9sZCkgaWYgKCEoaSBpbiB2YWx1ZSkpIG5vZGUuc3R5bGVbaV0gPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIHZhbHVlKSBub2RlLnN0eWxlW2ldID0gJ251bWJlcicgPT0gdHlwZW9mIHZhbHVlW2ldICYmICFOT05fRElNRU5TSU9OX1BST1BTW2ldID8gdmFsdWVbaV0gKyAncHgnIDogdmFsdWVbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoJ2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MJyA9PT0gbmFtZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcbiAgICAgICAgfSBlbHNlIGlmICgnbycgPT0gbmFtZVswXSAmJiAnbicgPT0gbmFtZVsxXSkge1xuICAgICAgICAgICAgdmFyIGwgPSBub2RlLl9saXN0ZW5lcnMgfHwgKG5vZGUuX2xpc3RlbmVycyA9IHt9KTtcbiAgICAgICAgICAgIG5hbWUgPSB0b0xvd2VyQ2FzZShuYW1lLnN1YnN0cmluZygyKSk7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWxbbmFtZV0pIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBldmVudFByb3h5LCAhIU5PTl9CVUJCTElOR19FVkVOVFNbbmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsW25hbWVdKSBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgISFOT05fQlVCQkxJTkdfRVZFTlRTW25hbWVdKTtcbiAgICAgICAgICAgIGxbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgnbGlzdCcgIT09IG5hbWUgJiYgJ3R5cGUnICE9PSBuYW1lICYmICFpc1N2ZyAmJiBuYW1lIGluIG5vZGUpIHtcbiAgICAgICAgICAgIHNldFByb3BlcnR5KG5vZGUsIG5hbWUsIG51bGwgPT0gdmFsdWUgPyAnJyA6IHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChudWxsID09IHZhbHVlIHx8IHZhbHVlID09PSAhMSkgbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbnMgPSBpc1N2ZyAmJiBuYW1lLm1hdGNoKC9eeGxpbmtcXDo/KC4rKS8pO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdmFsdWUgfHwgdmFsdWUgPT09ICExKSBpZiAobnMpIG5vZGUucmVtb3ZlQXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCB0b0xvd2VyQ2FzZShuc1sxXSkpOyBlbHNlIG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpOyBlbHNlIGlmICgnb2JqZWN0JyAhPSB0eXBlb2YgdmFsdWUgJiYgIWlzRnVuY3Rpb24odmFsdWUpKSBpZiAobnMpIG5vZGUuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCB0b0xvd2VyQ2FzZShuc1sxXSksIHZhbHVlKTsgZWxzZSBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG5vZGVbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG4gICAgZnVuY3Rpb24gZXZlbnRQcm94eShlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnNbZS50eXBlXShvcHRpb25zLmV2ZW50ICYmIG9wdGlvbnMuZXZlbnQoZSkgfHwgZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3ROb2RlKG5vZGUpIHtcbiAgICAgICAgcmVtb3ZlTm9kZShub2RlKTtcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICAgICAgICBub2RlLl9jb21wb25lbnQgPSBub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciA9IG51bGw7XG4gICAgICAgICAgICB2YXIgX25hbWUgPSBub2RlLm5vcm1hbGl6ZWROb2RlTmFtZSB8fCB0b0xvd2VyQ2FzZShub2RlLm5vZGVOYW1lKTtcbiAgICAgICAgICAgIChub2Rlc1tfbmFtZV0gfHwgKG5vZGVzW19uYW1lXSA9IFtdKSkucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBjcmVhdGVOb2RlKG5vZGVOYW1lLCBpc1N2Zykge1xuICAgICAgICB2YXIgbmFtZSA9IHRvTG93ZXJDYXNlKG5vZGVOYW1lKSwgbm9kZSA9IG5vZGVzW25hbWVdICYmIG5vZGVzW25hbWVdLnBvcCgpIHx8IChpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKSk7XG4gICAgICAgIG5vZGUubm9ybWFsaXplZE5vZGVOYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoTW91bnRzKCkge1xuICAgICAgICB2YXIgYztcbiAgICAgICAgd2hpbGUgKGMgPSBtb3VudHMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcbiAgICAgICAgICAgIGlmIChjLmNvbXBvbmVudERpZE1vdW50KSBjLmNvbXBvbmVudERpZE1vdW50KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgcGFyZW50LCBjb21wb25lbnRSb290KSB7XG4gICAgICAgIGlmICghZGlmZkxldmVsKyspIHtcbiAgICAgICAgICAgIGlzU3ZnTW9kZSA9IHBhcmVudCAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgcGFyZW50Lm93bmVyU1ZHRWxlbWVudDtcbiAgICAgICAgICAgIGh5ZHJhdGluZyA9IGRvbSAmJiAhKEFUVFJfS0VZIGluIGRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJldCA9IGlkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKTtcbiAgICAgICAgaWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSAhPT0gcGFyZW50KSBwYXJlbnQuYXBwZW5kQ2hpbGQocmV0KTtcbiAgICAgICAgaWYgKCEtLWRpZmZMZXZlbCkge1xuICAgICAgICAgICAgaHlkcmF0aW5nID0gITE7XG4gICAgICAgICAgICBpZiAoIWNvbXBvbmVudFJvb3QpIGZsdXNoTW91bnRzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpIHtcbiAgICAgICAgdmFyIHJlZiA9IHZub2RlICYmIHZub2RlLmF0dHJpYnV0ZXMgJiYgdm5vZGUuYXR0cmlidXRlcy5yZWY7XG4gICAgICAgIHdoaWxlIChpc0Z1bmN0aW9uYWxDb21wb25lbnQodm5vZGUpKSB2bm9kZSA9IGJ1aWxkRnVuY3Rpb25hbENvbXBvbmVudCh2bm9kZSwgY29udGV4dCk7XG4gICAgICAgIGlmIChudWxsID09IHZub2RlKSB2bm9kZSA9ICcnO1xuICAgICAgICBpZiAoaXNTdHJpbmcodm5vZGUpKSB7XG4gICAgICAgICAgICBpZiAoZG9tICYmIGRvbSBpbnN0YW5jZW9mIFRleHQgJiYgZG9tLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tLm5vZGVWYWx1ZSAhPSB2bm9kZSkgZG9tLm5vZGVWYWx1ZSA9IHZub2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9tKSByZWNvbGxlY3ROb2RlVHJlZShkb20pO1xuICAgICAgICAgICAgICAgIGRvbSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkb207XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odm5vZGUubm9kZU5hbWUpKSByZXR1cm4gYnVpbGRDb21wb25lbnRGcm9tVk5vZGUoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICB2YXIgb3V0ID0gZG9tLCBub2RlTmFtZSA9IFN0cmluZyh2bm9kZS5ub2RlTmFtZSksIHByZXZTdmdNb2RlID0gaXNTdmdNb2RlLCB2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcbiAgICAgICAgaXNTdmdNb2RlID0gJ3N2ZycgPT09IG5vZGVOYW1lID8gITAgOiAnZm9yZWlnbk9iamVjdCcgPT09IG5vZGVOYW1lID8gITEgOiBpc1N2Z01vZGU7XG4gICAgICAgIGlmICghZG9tKSBvdXQgPSBjcmVhdGVOb2RlKG5vZGVOYW1lLCBpc1N2Z01vZGUpOyBlbHNlIGlmICghaXNOYW1lZE5vZGUoZG9tLCBub2RlTmFtZSkpIHtcbiAgICAgICAgICAgIG91dCA9IGNyZWF0ZU5vZGUobm9kZU5hbWUsIGlzU3ZnTW9kZSk7XG4gICAgICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIG91dC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG4gICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShkb20pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmYyA9IG91dC5maXJzdENoaWxkLCBwcm9wcyA9IG91dFtBVFRSX0tFWV07XG4gICAgICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgICAgIG91dFtBVFRSX0tFWV0gPSBwcm9wcyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgYSA9IG91dC5hdHRyaWJ1dGVzLCBpID0gYS5sZW5ndGg7IGktLTsgKSBwcm9wc1thW2ldLm5hbWVdID0gYVtpXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWh5ZHJhdGluZyAmJiB2Y2hpbGRyZW4gJiYgMSA9PT0gdmNoaWxkcmVuLmxlbmd0aCAmJiAnc3RyaW5nJyA9PSB0eXBlb2YgdmNoaWxkcmVuWzBdICYmIGZjICYmIGZjIGluc3RhbmNlb2YgVGV4dCAmJiAhZmMubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgIGlmIChmYy5ub2RlVmFsdWUgIT0gdmNoaWxkcmVuWzBdKSBmYy5ub2RlVmFsdWUgPSB2Y2hpbGRyZW5bMF07XG4gICAgICAgIH0gZWxzZSBpZiAodmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGggfHwgZmMpIGlubmVyRGlmZk5vZGUob3V0LCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCAhIXByb3BzLmRhbmdlcm91c2x5U2V0SW5uZXJIVE1MKTtcbiAgICAgICAgZGlmZkF0dHJpYnV0ZXMob3V0LCB2bm9kZS5hdHRyaWJ1dGVzLCBwcm9wcyk7XG4gICAgICAgIGlmIChyZWYpIChwcm9wcy5yZWYgPSByZWYpKG91dCk7XG4gICAgICAgIGlzU3ZnTW9kZSA9IHByZXZTdmdNb2RlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBpbm5lckRpZmZOb2RlKGRvbSwgdmNoaWxkcmVuLCBjb250ZXh0LCBtb3VudEFsbCwgYWJzb3JiKSB7XG4gICAgICAgIHZhciBqLCBjLCB2Y2hpbGQsIGNoaWxkLCBvcmlnaW5hbENoaWxkcmVuID0gZG9tLmNoaWxkTm9kZXMsIGNoaWxkcmVuID0gW10sIGtleWVkID0ge30sIGtleWVkTGVuID0gMCwgbWluID0gMCwgbGVuID0gb3JpZ2luYWxDaGlsZHJlbi5sZW5ndGgsIGNoaWxkcmVuTGVuID0gMCwgdmxlbiA9IHZjaGlsZHJlbiAmJiB2Y2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICBpZiAobGVuKSBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgX2NoaWxkID0gb3JpZ2luYWxDaGlsZHJlbltpXSwgcHJvcHMgPSBfY2hpbGRbQVRUUl9LRVldLCBrZXkgPSB2bGVuID8gKGMgPSBfY2hpbGQuX2NvbXBvbmVudCkgPyBjLl9fa2V5IDogcHJvcHMgPyBwcm9wcy5rZXkgOiBudWxsIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xuICAgICAgICAgICAgICAgIGtleWVkTGVuKys7XG4gICAgICAgICAgICAgICAga2V5ZWRba2V5XSA9IF9jaGlsZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaHlkcmF0aW5nIHx8IGFic29yYiB8fCBwcm9wcyB8fCBfY2hpbGQgaW5zdGFuY2VvZiBUZXh0KSBjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IF9jaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmxlbikgZm9yICh2YXIgaSA9IDA7IGkgPCB2bGVuOyBpKyspIHtcbiAgICAgICAgICAgIHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGNoaWxkID0gbnVsbDtcbiAgICAgICAgICAgIHZhciBrZXkgPSB2Y2hpbGQua2V5O1xuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleWVkTGVuICYmIGtleSBpbiBrZXllZCkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGtleWVkW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGtleWVkW2tleV0gPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgICAgIGtleWVkTGVuLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghY2hpbGQgJiYgbWluIDwgY2hpbGRyZW5MZW4pIGZvciAoaiA9IG1pbjsgaiA8IGNoaWxkcmVuTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjID0gY2hpbGRyZW5bal07XG4gICAgICAgICAgICAgICAgaWYgKGMgJiYgaXNTYW1lTm9kZVR5cGUoYywgdmNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGM7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuW2pdID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gY2hpbGRyZW5MZW4gLSAxKSBjaGlsZHJlbkxlbi0tO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA9PT0gbWluKSBtaW4rKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2hpbGQgPSBpZGlmZihjaGlsZCwgdmNoaWxkLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQgIT09IGRvbSkgaWYgKGkgPj0gbGVuKSBkb20uYXBwZW5kQ2hpbGQoY2hpbGQpOyBlbHNlIGlmIChjaGlsZCAhPT0gb3JpZ2luYWxDaGlsZHJlbltpXSkge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZCA9PT0gb3JpZ2luYWxDaGlsZHJlbltpICsgMV0pIHJlbW92ZU5vZGUob3JpZ2luYWxDaGlsZHJlbltpXSk7XG4gICAgICAgICAgICAgICAgZG9tLmluc2VydEJlZm9yZShjaGlsZCwgb3JpZ2luYWxDaGlsZHJlbltpXSB8fCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ZWRMZW4pIGZvciAodmFyIGkgaW4ga2V5ZWQpIGlmIChrZXllZFtpXSkgcmVjb2xsZWN0Tm9kZVRyZWUoa2V5ZWRbaV0pO1xuICAgICAgICB3aGlsZSAobWluIDw9IGNoaWxkcmVuTGVuKSB7XG4gICAgICAgICAgICBjaGlsZCA9IGNoaWxkcmVuW2NoaWxkcmVuTGVuLS1dO1xuICAgICAgICAgICAgaWYgKGNoaWxkKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVjb2xsZWN0Tm9kZVRyZWUobm9kZSwgdW5tb3VudE9ubHkpIHtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IG5vZGUuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkgdW5tb3VudENvbXBvbmVudChjb21wb25lbnQsICF1bm1vdW50T25seSk7IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGVbQVRUUl9LRVldICYmIG5vZGVbQVRUUl9LRVldLnJlZikgbm9kZVtBVFRSX0tFWV0ucmVmKG51bGwpO1xuICAgICAgICAgICAgaWYgKCF1bm1vdW50T25seSkgY29sbGVjdE5vZGUobm9kZSk7XG4gICAgICAgICAgICB2YXIgYztcbiAgICAgICAgICAgIHdoaWxlIChjID0gbm9kZS5sYXN0Q2hpbGQpIHJlY29sbGVjdE5vZGVUcmVlKGMsIHVubW91bnRPbmx5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBkaWZmQXR0cmlidXRlcyhkb20sIGF0dHJzLCBvbGQpIHtcbiAgICAgICAgdmFyIG5hbWU7XG4gICAgICAgIGZvciAobmFtZSBpbiBvbGQpIGlmICghKGF0dHJzICYmIG5hbWUgaW4gYXR0cnMpICYmIG51bGwgIT0gb2xkW25hbWVdKSBzZXRBY2Nlc3Nvcihkb20sIG5hbWUsIG9sZFtuYW1lXSwgb2xkW25hbWVdID0gdm9pZCAwLCBpc1N2Z01vZGUpO1xuICAgICAgICBpZiAoYXR0cnMpIGZvciAobmFtZSBpbiBhdHRycykgaWYgKCEoJ2NoaWxkcmVuJyA9PT0gbmFtZSB8fCAnaW5uZXJIVE1MJyA9PT0gbmFtZSB8fCBuYW1lIGluIG9sZCAmJiBhdHRyc1tuYW1lXSA9PT0gKCd2YWx1ZScgPT09IG5hbWUgfHwgJ2NoZWNrZWQnID09PSBuYW1lID8gZG9tW25hbWVdIDogb2xkW25hbWVdKSkpIHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSBhdHRyc1tuYW1lXSwgaXNTdmdNb2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZSwgbGlzdCA9IGNvbXBvbmVudHNbbmFtZV07XG4gICAgICAgIGlmIChsaXN0KSBsaXN0LnB1c2goY29tcG9uZW50KTsgZWxzZSBjb21wb25lbnRzW25hbWVdID0gWyBjb21wb25lbnQgXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KEN0b3IsIHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHZhciBpbnN0ID0gbmV3IEN0b3IocHJvcHMsIGNvbnRleHQpLCBsaXN0ID0gY29tcG9uZW50c1tDdG9yLm5hbWVdO1xuICAgICAgICBDb21wb25lbnQuY2FsbChpbnN0LCBwcm9wcywgY29udGV4dCk7XG4gICAgICAgIGlmIChsaXN0KSBmb3IgKHZhciBpID0gbGlzdC5sZW5ndGg7IGktLTsgKSBpZiAobGlzdFtpXS5jb25zdHJ1Y3RvciA9PT0gQ3Rvcikge1xuICAgICAgICAgICAgaW5zdC5uZXh0QmFzZSA9IGxpc3RbaV0ubmV4dEJhc2U7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRDb21wb25lbnRQcm9wcyhjb21wb25lbnQsIHByb3BzLCBvcHRzLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fZGlzYWJsZSkge1xuICAgICAgICAgICAgY29tcG9uZW50Ll9kaXNhYmxlID0gITA7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fcmVmID0gcHJvcHMucmVmKSBkZWxldGUgcHJvcHMucmVmO1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5fX2tleSA9IHByb3BzLmtleSkgZGVsZXRlIHByb3BzLmtleTtcbiAgICAgICAgICAgIGlmICghY29tcG9uZW50LmJhc2UgfHwgbW91bnRBbGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb21wb25lbnQuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcykgY29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dCAhPT0gY29tcG9uZW50LmNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBvbmVudC5wcmV2Q29udGV4dCkgY29tcG9uZW50LnByZXZDb250ZXh0ID0gY29tcG9uZW50LmNvbnRleHQ7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb21wb25lbnQucHJldlByb3BzKSBjb21wb25lbnQucHJldlByb3BzID0gY29tcG9uZW50LnByb3BzO1xuICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICBjb21wb25lbnQuX2Rpc2FibGUgPSAhMTtcbiAgICAgICAgICAgIGlmICgwICE9PSBvcHRzKSBpZiAoMSA9PT0gb3B0cyB8fCBvcHRpb25zLnN5bmNDb21wb25lbnRVcGRhdGVzICE9PSAhMSB8fCAhY29tcG9uZW50LmJhc2UpIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIDEsIG1vdW50QWxsKTsgZWxzZSBlbnF1ZXVlUmVuZGVyKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50Ll9fcmVmKSBjb21wb25lbnQuX19yZWYoY29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiByZW5kZXJDb21wb25lbnQoY29tcG9uZW50LCBvcHRzLCBtb3VudEFsbCwgaXNDaGlsZCkge1xuICAgICAgICBpZiAoIWNvbXBvbmVudC5fZGlzYWJsZSkge1xuICAgICAgICAgICAgdmFyIHNraXAsIHJlbmRlcmVkLCBpbnN0LCBjYmFzZSwgcHJvcHMgPSBjb21wb25lbnQucHJvcHMsIHN0YXRlID0gY29tcG9uZW50LnN0YXRlLCBjb250ZXh0ID0gY29tcG9uZW50LmNvbnRleHQsIHByZXZpb3VzUHJvcHMgPSBjb21wb25lbnQucHJldlByb3BzIHx8IHByb3BzLCBwcmV2aW91c1N0YXRlID0gY29tcG9uZW50LnByZXZTdGF0ZSB8fCBzdGF0ZSwgcHJldmlvdXNDb250ZXh0ID0gY29tcG9uZW50LnByZXZDb250ZXh0IHx8IGNvbnRleHQsIGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsIG5leHRCYXNlID0gY29tcG9uZW50Lm5leHRCYXNlLCBpbml0aWFsQmFzZSA9IGlzVXBkYXRlIHx8IG5leHRCYXNlLCBpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChpc1VwZGF0ZSkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcbiAgICAgICAgICAgICAgICBpZiAoMiAhPT0gb3B0cyAmJiBjb21wb25lbnQuc2hvdWxkQ29tcG9uZW50VXBkYXRlICYmIGNvbXBvbmVudC5zaG91bGRDb21wb25lbnRVcGRhdGUocHJvcHMsIHN0YXRlLCBjb250ZXh0KSA9PT0gITEpIHNraXAgPSAhMDsgZWxzZSBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVcGRhdGUpIGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKHByb3BzLCBzdGF0ZSwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29tcG9uZW50LnByZXZQcm9wcyA9IGNvbXBvbmVudC5wcmV2U3RhdGUgPSBjb21wb25lbnQucHJldkNvbnRleHQgPSBjb21wb25lbnQubmV4dEJhc2UgPSBudWxsO1xuICAgICAgICAgICAgY29tcG9uZW50Ll9kaXJ0eSA9ICExO1xuICAgICAgICAgICAgaWYgKCFza2lwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5yZW5kZXIpIHJlbmRlcmVkID0gY29tcG9uZW50LnJlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KSBjb250ZXh0ID0gZXh0ZW5kKGNsb25lKGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpc0Z1bmN0aW9uYWxDb21wb25lbnQocmVuZGVyZWQpKSByZW5kZXJlZCA9IGJ1aWxkRnVuY3Rpb25hbENvbXBvbmVudChyZW5kZXJlZCwgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgdmFyIHRvVW5tb3VudCwgYmFzZSwgY2hpbGRDb21wb25lbnQgPSByZW5kZXJlZCAmJiByZW5kZXJlZC5ub2RlTmFtZTtcbiAgICAgICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihjaGlsZENvbXBvbmVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkUHJvcHMgPSBnZXROb2RlUHJvcHMocmVuZGVyZWQpO1xuICAgICAgICAgICAgICAgICAgICBpbnN0ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5zdCAmJiBpbnN0LmNvbnN0cnVjdG9yID09PSBjaGlsZENvbXBvbmVudCAmJiBjaGlsZFByb3BzLmtleSA9PSBpbnN0Ll9fa2V5KSBzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCAxLCBjb250ZXh0KTsgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbnN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdCA9IGNyZWF0ZUNvbXBvbmVudChjaGlsZENvbXBvbmVudCwgY2hpbGRQcm9wcywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0Lm5leHRCYXNlID0gaW5zdC5uZXh0QmFzZSB8fCBuZXh0QmFzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3QuX3BhcmVudENvbXBvbmVudCA9IGNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5fY29tcG9uZW50ID0gaW5zdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGluc3QsIGNoaWxkUHJvcHMsIDAsIGNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KGluc3QsIDEsIG1vdW50QWxsLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IGluc3QuYmFzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYmFzZSA9IGluaXRpYWxCYXNlO1xuICAgICAgICAgICAgICAgICAgICB0b1VubW91bnQgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIGNiYXNlID0gY29tcG9uZW50Ll9jb21wb25lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbEJhc2UgfHwgMSA9PT0gb3B0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNiYXNlKSBjYmFzZS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2UgPSBkaWZmKGNiYXNlLCByZW5kZXJlZCwgY29udGV4dCwgbW91bnRBbGwgfHwgIWlzVXBkYXRlLCBpbml0aWFsQmFzZSAmJiBpbml0aWFsQmFzZS5wYXJlbnROb2RlLCAhMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluaXRpYWxCYXNlICYmIGJhc2UgIT09IGluaXRpYWxCYXNlICYmIGluc3QgIT09IGluaXRpYWxDaGlsZENvbXBvbmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFzZVBhcmVudCA9IGluaXRpYWxCYXNlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXNlUGFyZW50ICYmIGJhc2UgIT09IGJhc2VQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VQYXJlbnQucmVwbGFjZUNoaWxkKGJhc2UsIGluaXRpYWxCYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9Vbm1vdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEJhc2UuX2NvbXBvbmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjb2xsZWN0Tm9kZVRyZWUoaW5pdGlhbEJhc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0b1VubW91bnQpIHVubW91bnRDb21wb25lbnQodG9Vbm1vdW50LCBiYXNlICE9PSBpbml0aWFsQmFzZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgICAgIGlmIChiYXNlICYmICFpc0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21wb25lbnRSZWYgPSBjb21wb25lbnQsIHQgPSBjb21wb25lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0ID0gdC5fcGFyZW50Q29tcG9uZW50KSAoY29tcG9uZW50UmVmID0gdCkuYmFzZSA9IGJhc2U7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcbiAgICAgICAgICAgICAgICAgICAgYmFzZS5fY29tcG9uZW50Q29uc3RydWN0b3IgPSBjb21wb25lbnRSZWYuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc1VwZGF0ZSB8fCBtb3VudEFsbCkgbW91bnRzLnVuc2hpZnQoY29tcG9uZW50KTsgZWxzZSBpZiAoIXNraXApIHtcbiAgICAgICAgICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkgY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBwcmV2aW91c0NvbnRleHQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFmdGVyVXBkYXRlKSBvcHRpb25zLmFmdGVyVXBkYXRlKGNvbXBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZm4sIGNiID0gY29tcG9uZW50Ll9yZW5kZXJDYWxsYmFja3M7XG4gICAgICAgICAgICBpZiAoY2IpIHdoaWxlIChmbiA9IGNiLnBvcCgpKSBmbi5jYWxsKGNvbXBvbmVudCk7XG4gICAgICAgICAgICBpZiAoIWRpZmZMZXZlbCAmJiAhaXNDaGlsZCkgZmx1c2hNb3VudHMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuICAgICAgICB2YXIgYyA9IGRvbSAmJiBkb20uX2NvbXBvbmVudCwgb3JpZ2luYWxDb21wb25lbnQgPSBjLCBvbGREb20gPSBkb20sIGlzRGlyZWN0T3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3IgPT09IHZub2RlLm5vZGVOYW1lLCBpc093bmVyID0gaXNEaXJlY3RPd25lciwgcHJvcHMgPSBnZXROb2RlUHJvcHModm5vZGUpO1xuICAgICAgICB3aGlsZSAoYyAmJiAhaXNPd25lciAmJiAoYyA9IGMuX3BhcmVudENvbXBvbmVudCkpIGlzT3duZXIgPSBjLmNvbnN0cnVjdG9yID09PSB2bm9kZS5ub2RlTmFtZTtcbiAgICAgICAgaWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCAzLCBjb250ZXh0LCBtb3VudEFsbCk7XG4gICAgICAgICAgICBkb20gPSBjLmJhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxDb21wb25lbnQgJiYgIWlzRGlyZWN0T3duZXIpIHtcbiAgICAgICAgICAgICAgICB1bm1vdW50Q29tcG9uZW50KG9yaWdpbmFsQ29tcG9uZW50LCAhMCk7XG4gICAgICAgICAgICAgICAgZG9tID0gb2xkRG9tID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSBjcmVhdGVDb21wb25lbnQodm5vZGUubm9kZU5hbWUsIHByb3BzLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGlmIChkb20gJiYgIWMubmV4dEJhc2UpIHtcbiAgICAgICAgICAgICAgICBjLm5leHRCYXNlID0gZG9tO1xuICAgICAgICAgICAgICAgIG9sZERvbSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgMSwgY29udGV4dCwgbW91bnRBbGwpO1xuICAgICAgICAgICAgZG9tID0gYy5iYXNlO1xuICAgICAgICAgICAgaWYgKG9sZERvbSAmJiBkb20gIT09IG9sZERvbSkge1xuICAgICAgICAgICAgICAgIG9sZERvbS5fY29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZWNvbGxlY3ROb2RlVHJlZShvbGREb20pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb207XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50LCByZW1vdmUpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYmVmb3JlVW5tb3VudCkgb3B0aW9ucy5iZWZvcmVVbm1vdW50KGNvbXBvbmVudCk7XG4gICAgICAgIHZhciBiYXNlID0gY29tcG9uZW50LmJhc2U7XG4gICAgICAgIGNvbXBvbmVudC5fZGlzYWJsZSA9ICEwO1xuICAgICAgICBpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcbiAgICAgICAgY29tcG9uZW50LmJhc2UgPSBudWxsO1xuICAgICAgICB2YXIgaW5uZXIgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcbiAgICAgICAgaWYgKGlubmVyKSB1bm1vdW50Q29tcG9uZW50KGlubmVyLCByZW1vdmUpOyBlbHNlIGlmIChiYXNlKSB7XG4gICAgICAgICAgICBpZiAoYmFzZVtBVFRSX0tFWV0gJiYgYmFzZVtBVFRSX0tFWV0ucmVmKSBiYXNlW0FUVFJfS0VZXS5yZWYobnVsbCk7XG4gICAgICAgICAgICBjb21wb25lbnQubmV4dEJhc2UgPSBiYXNlO1xuICAgICAgICAgICAgaWYgKHJlbW92ZSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoYmFzZSk7XG4gICAgICAgICAgICAgICAgY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGM7XG4gICAgICAgICAgICB3aGlsZSAoYyA9IGJhc2UubGFzdENoaWxkKSByZWNvbGxlY3ROb2RlVHJlZShjLCAhcmVtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Ll9fcmVmKSBjb21wb25lbnQuX19yZWYobnVsbCk7XG4gICAgICAgIGlmIChjb21wb25lbnQuY29tcG9uZW50RGlkVW5tb3VudCkgY29tcG9uZW50LmNvbXBvbmVudERpZFVubW91bnQoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gITA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlKSB0aGlzLnN0YXRlID0ge307XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuICAgICAgICByZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCAhMSwgcGFyZW50KTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgRU1QVFlfQ0hJTERSRU4gPSBbXTtcbiAgICB2YXIgbGNDYWNoZSA9IHt9O1xuICAgIHZhciB0b0xvd2VyQ2FzZSA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgcmV0dXJuIGxjQ2FjaGVbc10gfHwgKGxjQ2FjaGVbc10gPSBzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH07XG4gICAgdmFyIHJlc29sdmVkID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgdmFyIGRlZmVyID0gcmVzb2x2ZWQgPyBmdW5jdGlvbihmKSB7XG4gICAgICAgIHJlc29sdmVkLnRoZW4oZik7XG4gICAgfSA6IHNldFRpbWVvdXQ7XG4gICAgdmFyIEVNUFRZID0ge307XG4gICAgdmFyIEFUVFJfS0VZID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIFN5bWJvbCA/IFN5bWJvbC5mb3IoJ3ByZWFjdGF0dHInKSA6ICdfX3ByZWFjdGF0dHJfJztcbiAgICB2YXIgTk9OX0RJTUVOU0lPTl9QUk9QUyA9IHtcbiAgICAgICAgYm94RmxleDogMSxcbiAgICAgICAgYm94RmxleEdyb3VwOiAxLFxuICAgICAgICBjb2x1bW5Db3VudDogMSxcbiAgICAgICAgZmlsbE9wYWNpdHk6IDEsXG4gICAgICAgIGZsZXg6IDEsXG4gICAgICAgIGZsZXhHcm93OiAxLFxuICAgICAgICBmbGV4UG9zaXRpdmU6IDEsXG4gICAgICAgIGZsZXhTaHJpbms6IDEsXG4gICAgICAgIGZsZXhOZWdhdGl2ZTogMSxcbiAgICAgICAgZm9udFdlaWdodDogMSxcbiAgICAgICAgbGluZUNsYW1wOiAxLFxuICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgb3JwaGFuczogMSxcbiAgICAgICAgc3Ryb2tlT3BhY2l0eTogMSxcbiAgICAgICAgd2lkb3dzOiAxLFxuICAgICAgICB6SW5kZXg6IDEsXG4gICAgICAgIHpvb206IDFcbiAgICB9O1xuICAgIHZhciBOT05fQlVCQkxJTkdfRVZFTlRTID0ge1xuICAgICAgICBibHVyOiAxLFxuICAgICAgICBlcnJvcjogMSxcbiAgICAgICAgZm9jdXM6IDEsXG4gICAgICAgIGxvYWQ6IDEsXG4gICAgICAgIHJlc2l6ZTogMSxcbiAgICAgICAgc2Nyb2xsOiAxXG4gICAgfTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICB2YXIgbm9kZXMgPSB7fTtcbiAgICB2YXIgbW91bnRzID0gW107XG4gICAgdmFyIGRpZmZMZXZlbCA9IDA7XG4gICAgdmFyIGlzU3ZnTW9kZSA9ICExO1xuICAgIHZhciBoeWRyYXRpbmcgPSAhMTtcbiAgICB2YXIgY29tcG9uZW50cyA9IHt9O1xuICAgIGV4dGVuZChDb21wb25lbnQucHJvdG90eXBlLCB7XG4gICAgICAgIGxpbmtTdGF0ZTogZnVuY3Rpb24oa2V5LCBldmVudFBhdGgpIHtcbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5fbGlua2VkU3RhdGVzIHx8ICh0aGlzLl9saW5rZWRTdGF0ZXMgPSB7fSk7XG4gICAgICAgICAgICByZXR1cm4gY1trZXkgKyBldmVudFBhdGhdIHx8IChjW2tleSArIGV2ZW50UGF0aF0gPSBjcmVhdGVMaW5rZWRTdGF0ZSh0aGlzLCBrZXksIGV2ZW50UGF0aCkpO1xuICAgICAgICB9LFxuICAgICAgICBzZXRTdGF0ZTogZnVuY3Rpb24oc3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRoaXMuc3RhdGU7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHJldlN0YXRlKSB0aGlzLnByZXZTdGF0ZSA9IGNsb25lKHMpO1xuICAgICAgICAgICAgZXh0ZW5kKHMsIGlzRnVuY3Rpb24oc3RhdGUpID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spICh0aGlzLl9yZW5kZXJDYWxsYmFja3MgPSB0aGlzLl9yZW5kZXJDYWxsYmFja3MgfHwgW10pLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgICAgZW5xdWV1ZVJlbmRlcih0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgZm9yY2VVcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVuZGVyQ29tcG9uZW50KHRoaXMsIDIpO1xuICAgICAgICB9LFxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge31cbiAgICB9KTtcbiAgICBleHBvcnRzLmggPSBoO1xuICAgIGV4cG9ydHMuY2xvbmVFbGVtZW50ID0gY2xvbmVFbGVtZW50O1xuICAgIGV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuICAgIGV4cG9ydHMucmVuZGVyID0gcmVuZGVyO1xuICAgIGV4cG9ydHMucmVyZW5kZXIgPSByZXJlbmRlcjtcbiAgICBleHBvcnRzLm9wdGlvbnMgPSBvcHRpb25zO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wcmVhY3QuanMubWFwXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3ByZWFjdC9kaXN0L3ByZWFjdC5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9wcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ1Byb3BUeXBlcycsIFsnZXhwb3J0cycsICdtb2R1bGUnXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZmFjdG9yeShleHBvcnRzLCBtb2R1bGUpO1xuICB9IGVsc2Uge1xuICAgIHZhciBtb2QgPSB7XG4gICAgICBleHBvcnRzOiB7fVxuICAgIH07XG4gICAgZmFjdG9yeShtb2QuZXhwb3J0cywgbW9kKTtcbiAgICBnbG9iYWwuUHJvcFR5cGVzID0gbW9kLmV4cG9ydHM7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzLCBtb2R1bGUpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sWydmb3InXSAmJiBTeW1ib2xbJ2ZvciddKCdyZWFjdC5lbGVtZW50JykgfHwgMHhlYWM3O1xuXG4gIHZhciBSZWFjdEVsZW1lbnQgPSB7fTtcblxuICBSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmIG9iamVjdCAhPT0gbnVsbCAmJiBvYmplY3QuJCR0eXBlb2YgPT09IFJFQUNUX0VMRU1FTlRfVFlQRTtcbiAgfTtcblxuICB2YXIgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMgPSB7XG4gICAgcHJvcDogJ3Byb3AnLFxuICAgIGNvbnRleHQ6ICdjb250ZXh0JyxcbiAgICBjaGlsZENvbnRleHQ6ICdjaGlsZCBjb250ZXh0J1xuICB9O1xuXG4gIHZhciBlbXB0eUZ1bmN0aW9uID0ge1xuICAgIHRoYXRSZXR1cm5zOiBmdW5jdGlvbiB0aGF0UmV0dXJucyh3aGF0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2hhdDtcbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIHZhciBJVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbiAgdmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InO1xuICBmdW5jdGlvbiBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IG1heWJlSXRlcmFibGUgJiYgKElURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW0lURVJBVE9SX1NZTUJPTF0gfHwgbWF5YmVJdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgdmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxuICB2YXIgUmVhY3RQcm9wVHlwZXMgPSB7XG4gICAgYXJyYXk6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdhcnJheScpLFxuICAgIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gICAgZnVuYzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2Z1bmN0aW9uJyksXG4gICAgbnVtYmVyOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignbnVtYmVyJyksXG4gICAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gICAgc3RyaW5nOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3RyaW5nJyksXG4gICAgc3ltYm9sOiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignc3ltYm9sJyksXG5cbiAgICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gICAgYXJyYXlPZjogY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyLFxuICAgIGVsZW1lbnQ6IGNyZWF0ZUVsZW1lbnRUeXBlQ2hlY2tlcigpLFxuICAgIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gICAgbm9kZTogY3JlYXRlTm9kZUNoZWNrZXIoKSxcbiAgICBvYmplY3RPZjogY3JlYXRlT2JqZWN0T2ZUeXBlQ2hlY2tlcixcbiAgICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICAgIG9uZU9mVHlwZTogY3JlYXRlVW5pb25UeXBlQ2hlY2tlcixcbiAgICBzaGFwZTogY3JlYXRlU2hhcGVUeXBlQ2hlY2tlclxuICB9O1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKSB7XG4gICAgZnVuY3Rpb24gY2hlY2tUeXBlKGlzUmVxdWlyZWQsIHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudE5hbWUgfHwgQU5PTllNT1VTO1xuICAgICAgcHJvcEZ1bGxOYW1lID0gcHJvcEZ1bGxOYW1lIHx8IHByb3BOYW1lO1xuICAgICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICAgIGlmIChpc1JlcXVpcmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignUmVxdWlyZWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCB3YXMgbm90IHNwZWNpZmllZCBpbiAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgICBjaGFpbmVkQ2hlY2tUeXBlLmlzUmVxdWlyZWQgPSBjaGVja1R5cGUuYmluZChudWxsLCB0cnVlKTtcblxuICAgIHJldHVybiBjaGFpbmVkQ2hlY2tUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoZXhwZWN0ZWRUeXBlKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgIGlmIChwcm9wVHlwZSAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG5cbiAgICAgICAgdmFyIHByZWNpc2VUeXBlID0gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKTtcblxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByZWNpc2VUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkICcpICsgKCdgJyArIGV4cGVjdGVkVHlwZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQW55VHlwZUNoZWNrZXIoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMobnVsbCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBhcnJheS4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZXJyb3IgPSB0eXBlQ2hlY2tlcihwcm9wVmFsdWUsIGksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnWycgKyBpICsgJ10nKTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCkge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCFSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agc3VwcGxpZWQgdG8gJyArICgnYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGEgc2luZ2xlIFJlYWN0RWxlbWVudC4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIoZXhwZWN0ZWRDbGFzcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgaWYgKCEocHJvcHNbcHJvcE5hbWVdIGluc3RhbmNlb2YgZXhwZWN0ZWRDbGFzcykpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgICAgdmFyIGFjdHVhbENsYXNzTmFtZSA9IGdldENsYXNzTmFtZShwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIGFjdHVhbENsYXNzTmFtZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCAnKSArICgnaW5zdGFuY2Ugb2YgYCcgKyBleHBlY3RlZENsYXNzTmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlRW51bVR5cGVDaGVja2VyKGV4cGVjdGVkVmFsdWVzKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGV4cGVjdGVkVmFsdWVzKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZiwgZXhwZWN0ZWQgYW4gaW5zdGFuY2Ugb2YgYXJyYXkuJyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4cGVjdGVkVmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUgPT09IGV4cGVjdGVkVmFsdWVzW2ldKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZU9iamVjdE9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICB2YXIgcHJvcFR5cGUgPSBnZXRQcm9wVHlwZShwcm9wVmFsdWUpO1xuICAgICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdHlwZSAnICsgKCdgJyArIHByb3BUeXBlICsgJ2Agc3VwcGxpZWQgdG8gYCcgKyBjb21wb25lbnROYW1lICsgJ2AsIGV4cGVjdGVkIGFuIG9iamVjdC4nKSk7XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICAgIGlmIChwcm9wVmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHZhciBlcnJvciA9IHR5cGVDaGVja2VyKHByb3BWYWx1ZSwga2V5LCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJy4nICsga2V5KTtcbiAgICAgICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVVbmlvblR5cGVDaGVja2VyKGFycmF5T2ZUeXBlQ2hlY2tlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlPZlR5cGVDaGVja2VycykpIHtcbiAgICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnQgc3VwcGxpZWQgdG8gb25lT2ZUeXBlLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheU9mVHlwZUNoZWNrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGVja2VyID0gYXJyYXlPZlR5cGVDaGVja2Vyc1tpXTtcbiAgICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBzdXBwbGllZCB0byAnICsgKCdgJyArIGNvbXBvbmVudE5hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICAgIGlmICghaXNOb2RlKHByb3BzW3Byb3BOYW1lXSkpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICBpZiAocHJvcFR5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbk5hbWUgPSBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl07XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlIGAnICsgcHJvcFR5cGUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYG9iamVjdGAuJykpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIHNoYXBlVHlwZXMpIHtcbiAgICAgICAgdmFyIGNoZWNrZXIgPSBzaGFwZVR5cGVzW2tleV07XG4gICAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXkpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNOb2RlKHByb3BWYWx1ZSkge1xuICAgIHN3aXRjaCAodHlwZW9mIHByb3BWYWx1ZSkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gIXByb3BWYWx1ZTtcbiAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgICByZXR1cm4gcHJvcFZhbHVlLmV2ZXJ5KGlzTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BWYWx1ZSA9PT0gbnVsbCB8fCBSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKHByb3BWYWx1ZSk7XG4gICAgICAgIGlmIChpdGVyYXRvckZuKSB7XG4gICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgICAgaWYgKGl0ZXJhdG9yRm4gIT09IHByb3BWYWx1ZS5lbnRyaWVzKSB7XG4gICAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICAgIGlmICghaXNOb2RlKHN0ZXAudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpIHtcbiAgICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBwcm9wVmFsdWUgaW5zdGFuY2VvZiBTeW1ib2wpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByb3BUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IHR5cGVvZiBwcm9wVmFsdWU7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgcmV0dXJuICdhcnJheSc7XG4gICAgfVxuICAgIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIHJldHVybiAnb2JqZWN0JztcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKHByb3BUeXBlLCBwcm9wVmFsdWUpKSB7XG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgfVxuICAgIHJldHVybiBwcm9wVHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFByZWNpc2VUeXBlKHByb3BWYWx1ZSkge1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgcmV0dXJuICdkYXRlJztcbiAgICAgIH0gZWxzZSBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHJldHVybiAncmVnZXhwJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHByb3BUeXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q2xhc3NOYW1lKHByb3BWYWx1ZSkge1xuICAgIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgcmV0dXJuIEFOT05ZTU9VUztcbiAgICB9XG4gICAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlcztcbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXBcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcHJvcHR5cGVzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQge0NvbmRpdGlvbiwgQ29uZGl0aW9uTm9kZX0gZnJvbSBcIi4vY29uZGl0aW9uc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbnNQYXJzZXIge1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJvb3Q6IENvbmRpdGlvbk5vZGU7XHJcbiAgICBwcml2YXRlIGV4cHJlc3Npb25Ob2RlczogQXJyYXk8Q29uZGl0aW9uTm9kZT47XHJcbiAgICBwcml2YXRlIG5vZGU6IENvbmRpdGlvbk5vZGU7XHJcbiAgICBwcml2YXRlIGF0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIHBhcnNlKHRleHQ6IHN0cmluZywgcm9vdDogQ29uZGl0aW9uTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcclxuICAgICAgICB0aGlzLnJvb3QuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmF0ID0gMDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMudGV4dC5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucGFyc2VUZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyB0b1N0cmluZyhyb290OiBDb25kaXRpb25Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVUb1N0cmluZyhyb290KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9TdHJpbmdDb3JlKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImNoaWxkcmVuXCJdKSByZXR1cm4gdGhpcy5ub2RlVG9TdHJpbmcodmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImxlZnRcIl0pIHJldHVybiB0aGlzLmNvbmRpdGlvblRvU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbm9kZVRvU3RyaW5nKG5vZGU6IENvbmRpdGlvbk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChub2RlLmlzRW1wdHkpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciByZXMgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZVRleHQgPSB0aGlzLnRvU3RyaW5nQ29yZShub2RlLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgaWYgKG5vZGVUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzKSByZXMgKz0gJyAnICsgbm9kZS5jb25uZWN0aXZlICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgcmVzICs9IG5vZGVUZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlICE9IHRoaXMucm9vdCAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgcmVzID0gJygnICsgcmVzICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25Ub1N0cmluZyhjb25kaXRpb246IENvbmRpdGlvbik6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFjb25kaXRpb24ucmlnaHQgfHwgIWNvbmRpdGlvbi5vcGVyYXRvcikgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFyIGxlZnQgPSBjb25kaXRpb24ubGVmdDtcclxuICAgICAgICBpZiAobGVmdCAmJiAhdGhpcy5pc051bWVyaWMobGVmdCkpIGxlZnQgPSBcIidcIiArIGxlZnQgKyBcIidcIjtcclxuICAgICAgICB2YXIgcmVzID0gbGVmdCArICcgJyArIHRoaXMub3BlcmF0aW9uVG9TdHJpbmcoY29uZGl0aW9uLm9wZXJhdG9yKTtcclxuICAgICAgICBpZiAodGhpcy5pc05vUmlnaHRPcGVyYXRpb24oY29uZGl0aW9uLm9wZXJhdG9yKSkgcmV0dXJuIHJlcztcclxuICAgICAgICB2YXIgcmlnaHQgPSBjb25kaXRpb24ucmlnaHQ7XHJcbiAgICAgICAgaWYgKHJpZ2h0ICYmICF0aGlzLmlzTnVtZXJpYyhyaWdodCkpIHJpZ2h0ID0gXCInXCIgKyByaWdodCArIFwiJ1wiO1xyXG4gICAgICAgIHJldHVybiByZXMgKyAnICcgKyByaWdodDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb3BlcmF0aW9uVG9TdHJpbmcob3A6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKG9wID09IFwiZXF1YWxcIikgcmV0dXJuIFwiPVwiO1xyXG4gICAgICAgIGlmIChvcCA9PSBcIm5vdGVxdWFsXCIpIHJldHVybiBcIiE9XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwiZ3JlYXRlclwiKSByZXR1cm4gXCI+XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwibGVzc1wiKSByZXR1cm4gXCI8XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwiZ3JlYXRlcm9yZXF1YWxcIikgcmV0dXJuIFwiPj1cIjtcclxuICAgICAgICBpZiAob3AgPT0gXCJsZXNzb3JlcXVhbFwiKSByZXR1cm4gXCI8PVwiO1xyXG4gICAgICAgIHJldHVybiBvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNOdW1lcmljKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgdmFsID0gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VUZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMucm9vdDtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzLnB1c2godGhpcy5ub2RlKTtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIHJldHVybiByZXMgJiYgdGhpcy5hdCA+PSB0aGlzLmxlbmd0aDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZENvbmRpdGlvbnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbigpO1xyXG4gICAgICAgIGlmICghcmVzKSByZXR1cm4gcmVzO1xyXG4gICAgICAgIHZhciBjb25uZWN0aXZlID0gdGhpcy5yZWFkQ29ubmVjdGl2ZSgpO1xyXG4gICAgICAgIGlmIChjb25uZWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29ubmVjdGl2ZShjb25uZWN0aXZlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRDb25kaXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGV4cFJlcyA9IHRoaXMucmVhZEV4cHJlc3Npb24oKTtcclxuICAgICAgICBpZiAoZXhwUmVzIDwgMCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKGV4cFJlcyA9PSAxKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB2YXIgbGVmdCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgIGlmICghbGVmdCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBvcCA9IHRoaXMucmVhZE9wZXJhdG9yKCk7XHJcbiAgICAgICAgaWYgKCFvcCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBjID0gbmV3IENvbmRpdGlvbigpO1xyXG4gICAgICAgIGMubGVmdCA9IGxlZnQ7IGMub3BlcmF0b3IgPSBvcDtcclxuICAgICAgICBpZiAoIXRoaXMuaXNOb1JpZ2h0T3BlcmF0aW9uKG9wKSkge1xyXG4gICAgICAgICAgICB2YXIgcmlnaHQgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKCFyaWdodCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBjLnJpZ2h0ID0gcmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ29uZGl0aW9uKGMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkRXhwcmVzc2lvbigpOiBudW1iZXIge1xyXG4gICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmF0ID49IHRoaXMubGVuZ3RoIHx8IHRoaXMuY2ggIT0gJygnKSByZXR1cm4gMDtcclxuICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgdGhpcy5wdXNoRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5jaCA9PSA8c3RyaW5nPicpJztcclxuICAgICAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICB0aGlzLnBvcEV4cHJlc3Npb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0IGNoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRleHQuY2hhckF0KHRoaXMuYXQpOyB9XHJcbiAgICBwcml2YXRlIHNraXAoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuYXQgPCB0aGlzLmxlbmd0aCAmJiB0aGlzLmlzU3BhY2UodGhpcy5jaCkpIHRoaXMuYXQrKztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNTcGFjZShjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gYyA9PSAnICcgfHwgYyA9PSAnXFxuJyB8fCBjID09ICdcXHQnIHx8IGMgPT0gJ1xccic7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzUXVvdGVzKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjID09IFwiJ1wiIHx8IGMgPT0gJ1wiJ1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc09wZXJhdG9yQ2hhcihjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gYyA9PSAnPicgfHwgYyA9PSAnPCcgfHwgYyA9PSAnPScgfHwgYyA9PSAnISc7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzQnJhY2tldHMoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGMgPT0gJygnIHx8IGMgPT0gJyknO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYXQgPj0gdGhpcy5sZW5ndGgpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBzdGFydCA9IHRoaXMuYXQ7XHJcbiAgICAgICAgdmFyIGhhc1F1b3RlcyA9IHRoaXMuaXNRdW90ZXModGhpcy5jaCk7XHJcbiAgICAgICAgaWYgKGhhc1F1b3RlcykgdGhpcy5hdCsrO1xyXG4gICAgICAgIHZhciBpc0ZpcnN0T3BDaCA9IHRoaXMuaXNPcGVyYXRvckNoYXIodGhpcy5jaCk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuYXQgPCB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAoIWhhc1F1b3RlcyAmJiB0aGlzLmlzU3BhY2UodGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1F1b3Rlcyh0aGlzLmNoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhhc1F1b3RlcykgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFoYXNRdW90ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0ZpcnN0T3BDaCAhPSB0aGlzLmlzT3BlcmF0b3JDaGFyKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQnJhY2tldHModGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYXQgPD0gc3RhcnQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnRleHQuc3Vic3RyKHN0YXJ0LCB0aGlzLmF0IC0gc3RhcnQpO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAxICYmIHRoaXMuaXNRdW90ZXMocmVzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IHJlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNRdW90ZXMocmVzW3Jlcy5sZW5ndGggLSAxXSkpIGxlbi0tO1xyXG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLnN1YnN0cigxLCBsZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTm9SaWdodE9wZXJhdGlvbihvcDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wID09IFwiZW1wdHlcIiB8fCBvcCA9PSBcIm5vdGVtcHR5XCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRPcGVyYXRvcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBvcCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgIGlmICghb3ApIHJldHVybiBudWxsO1xyXG4gICAgICAgIG9wID0gb3AudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAob3AgPT0gJz4nKSBvcCA9IFwiZ3JlYXRlclwiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPCcpIG9wID0gXCJsZXNzXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc+PScgfHwgb3AgPT0gJz0+Jykgb3AgPSBcImdyZWF0ZXJvcmVxdWFsXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc8PScgfHwgb3AgPT0gJz08Jykgb3AgPSBcImxlc3NvcmVxdWFsXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc9JyB8fCBvcCA9PSAnPT0nKSBvcCA9IFwiZXF1YWxcIjtcclxuICAgICAgICBpZiAob3AgPT0gJzw+JyB8fCBvcCA9PSAnIT0nKSBvcCA9IFwibm90ZXF1YWxcIjtcclxuICAgICAgICBpZiAob3AgPT0gJ2NvbnRhaW4nKSBvcCA9IFwiY29udGFpbnNcIjtcclxuICAgICAgICBpZiAob3AgPT0gJ25vdGNvbnRhaW4nKSBvcCA9IFwibm90Y29udGFpbnNcIjtcclxuICAgICAgICByZXR1cm4gb3A7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRDb25uZWN0aXZlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGNvbiA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgIGlmICghY29uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb24gPSBjb24udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAoY29uID09IFwiJlwiIHx8IGNvbiA9PSBcIiYmXCIpIGNvbiA9IFwiYW5kXCI7XHJcbiAgICAgICAgaWYgKGNvbiA9PSBcInxcIiB8fCBjb24gPT0gXCJ8fFwiKSBjb24gPSBcIm9yXCI7XHJcbiAgICAgICAgaWYgKGNvbiAhPSBcImFuZFwiICYmIGNvbiAhPSBcIm9yXCIpIGNvbiA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNvbjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcHVzaEV4cHJlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcG9wRXhwcmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZXhwcmVzc2lvbk5vZGVzLnBvcCgpO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuZXhwcmVzc2lvbk5vZGVzW3RoaXMuZXhwcmVzc2lvbk5vZGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRDb25kaXRpb24oYzogQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2goYyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZENvbm5lY3RpdmUoY29uOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmNvbm5lY3RpdmUgPSBjb247XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5jb25uZWN0aXZlICE9IGNvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZENvbiA9IHRoaXMubm9kZS5jb25uZWN0aXZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZENoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdGl2ZSA9IGNvbjtcclxuICAgICAgICAgICAgICAgIHZhciBvbGROb2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgICAgIG9sZE5vZGUuY29ubmVjdGl2ZSA9IG9sZENvbjtcclxuICAgICAgICAgICAgICAgIG9sZE5vZGUuY2hpbGRyZW4gPSBvbGRDaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG9sZE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUgPSBuZXdOb2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb25kaXRpb25zUGFyc2VyLnRzIiwiZXhwb3J0IHZhciBzdXJ2ZXlDc3MgPSB7XHJcbiAgICBjdXJyZW50VHlwZTogXCJcIixcclxuICAgIGdldENzczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsb2MgPSB0aGlzLmN1cnJlbnRUeXBlID8gdGhpc1t0aGlzLmN1cnJlbnRUeXBlXSA6IGRlZmF1bHRTdGFuZGFyZENzcztcclxuICAgICAgICBpZiAoIWxvYykgbG9jID0gZGVmYXVsdFN0YW5kYXJkQ3NzO1xyXG4gICAgICAgIHJldHVybiBsb2M7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IHZhciBkZWZhdWx0U3RhbmRhcmRDc3MgPSB7XHJcbiAgICByb290OiBcInN2X21haW5cIixcclxuICAgIGhlYWRlcjogXCJcIixcclxuICAgIGJvZHk6IFwic3ZfYm9keVwiLFxyXG4gICAgZm9vdGVyOiBcInN2X25hdlwiLFxyXG4gICAgbmF2aWdhdGlvbkJ1dHRvbjogXCJcIiwgbmF2aWdhdGlvbjogeyBjb21wbGV0ZTogXCJzdl9jb21wbGV0ZV9idG5cIiwgcHJldjpcInN2X3ByZXZfYnRuXCIsIG5leHQ6IFwic3ZfbmV4dF9idG5cIn0sXHJcbiAgICBwcm9ncmVzczogXCJzdl9wcm9ncmVzc1wiLCBwcm9ncmVzc0JhcjogXCJcIixcclxuICAgIHBhZ2VUaXRsZTogXCJzdl9wX3RpdGxlXCIsXHJcbiAgICByb3c6IFwic3Zfcm93XCIsXHJcbiAgICBxdWVzdGlvbjogeyByb290OiBcInN2X3FcIiwgdGl0bGU6IFwic3ZfcV90aXRsZVwiLCBjb21tZW50OiBcIlwiLCBpbmRlbnQ6IDIwIH0sXHJcbiAgICBlcnJvcjogeyByb290OiBcInN2X3FfZXJib3hcIiwgaWNvbjogXCJcIiwgaXRlbTogXCJcIiB9LFxyXG5cclxuICAgIGNoZWNrYm94OiB7IHJvb3Q6IFwic3ZfcWNiY1wiLCBpdGVtOiBcInN2X3FfY2hlY2tib3hcIiwgb3RoZXI6IFwic3ZfcV9vdGhlclwiIH0sXHJcbiAgICBjb21tZW50OiBcIlwiLFxyXG4gICAgZHJvcGRvd246IHsgcm9vdDogXCJcIiwgY29udHJvbDogXCJcIiB9LFxyXG4gICAgbWF0cml4OiB7IHJvb3Q6IFwic3ZfcV9tYXRyaXhcIiB9LFxyXG4gICAgbWF0cml4ZHJvcGRvd246IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICBtYXRyaXhkeW5hbWljOiB7IHJvb3Q6IFwidGFibGVcIiwgYnV0dG9uOiBcIlwiIH0sXHJcbiAgICBtdWx0aXBsZXRleHQ6IHsgcm9vdDogXCJcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiXCIgfSxcclxuICAgIHJhZGlvZ3JvdXA6IHsgcm9vdDogXCJzdl9xY2JjXCIsIGl0ZW06IFwic3ZfcV9yYWRpb2dyb3VwXCIsIGxhYmVsOiBcIlwiLCBvdGhlcjogXCJzdl9xX290aGVyXCIgfSxcclxuICAgIHJhdGluZzogeyByb290OiBcInN2X3FfcmF0aW5nXCIsIGl0ZW06IFwic3ZfcV9yYXRpbmdfaXRlbVwiIH0sXHJcbiAgICB0ZXh0OiBcIlwiLFxyXG4gICAgd2luZG93OiB7XHJcbiAgICAgICAgcm9vdDogXCJzdl93aW5kb3dcIiwgYm9keTogXCJzdl93aW5kb3dfY29udGVudFwiLFxyXG4gICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICByb290OiBcInN2X3dpbmRvd190aXRsZVwiLCB0aXRsZTogXCJcIiwgYnV0dG9uOiBcIlwiLCBidXR0b25FeHBhbmRlZDogXCJcIiwgYnV0dG9uQ29sbGFwc2VkOiBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuc3VydmV5Q3NzW1wic3RhbmRhcmRcIl0gPSBkZWZhdWx0U3RhbmRhcmRDc3M7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkLnRzIiwiLyoqXHJcbiAqIFRoZSBjbGFzcyBjb250YWlucyBtZXRob2RzIHRvIHdvcmsgd2l0aCB3d3cuZHhzdXJ2ZXkuY29tIHNlcnZpY2UuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgZHhTdXJ2ZXlTZXJ2aWNlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwczovL2R4c3VydmV5YXBpLmF6dXJld2Vic2l0ZXMubmV0L2FwaS9TdXJ2ZXlcIjtcclxuICAgIC8vcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6NTA0ODgvYXBpL1N1cnZleVwiO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbG9hZFN1cnZleShzdXJ2ZXlJZDogc3RyaW5nLCBvbkxvYWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFN1cnZleT9zdXJ2ZXlJZD0nICsgc3VydmV5SWQpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgb25Mb2FkKHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNlbmRSZXN1bHQocG9zdElkOiBzdHJpbmcsIHJlc3VsdDogSlNPTiwgb25TZW5kUmVzdWx0OiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSk9PiB2b2lkLCBjbGllbnRJZDogc3RyaW5nID0gbnVsbCwgaXNQYXJ0aWFsQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvcG9zdC8nKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTtcclxuICAgICAgICB2YXIgZGF0YSA9IHsgcG9zdElkOiBwb3N0SWQsIHN1cnZleVJlc3VsdDogSlNPTi5zdHJpbmdpZnkocmVzdWx0KSB9O1xyXG4gICAgICAgIGlmIChjbGllbnRJZCkgZGF0YVsnY2xpZW50SWQnXSA9IGNsaWVudElkO1xyXG4gICAgICAgIGlmIChpc1BhcnRpYWxDb21wbGV0ZWQpIGRhdGFbJ2lzUGFydGlhbENvbXBsZXRlZCddID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZGF0YVN0cmluZ2lmeTogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFvblNlbmRSZXN1bHQpIHJldHVybjtcclxuICAgICAgICAgICAgb25TZW5kUmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoZGF0YVN0cmluZ2lmeSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VuZEZpbGUocG9zdElkOiBzdHJpbmcsIGZpbGU6IEZpbGUsIG9uU2VuZEZpbGU6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFvblNlbmRGaWxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIG9uU2VuZEZpbGUoeGhyLnN0YXR1cyA9PSAyMDAsIEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIub3BlbihcIlBPU1RcIiwgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL3VwbG9hZC8nLCB0cnVlKTtcclxuICAgICAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJmaWxlXCIsIGZpbGUpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInBvc3RJZFwiLCBwb3N0SWQpO1xyXG4gICAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBvbkdldFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIGRhdGE6IGFueSwgZGF0YUxpc3Q6IEFycmF5PGFueT4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZuYW1lPScgKyBuYW1lO1xyXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0UmVzdWx0PycgKyBkYXRhKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXN1bHQuUXVlc3Rpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSB7IG5hbWU6IGtleSwgdmFsdWU6IHJlc3VsdC5RdWVzdGlvblJlc3VsdFtrZXldIH07XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvbkdldFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCBsaXN0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpc0NvbXBsZXRlZChyZXN1bHRJZDogc3RyaW5nLCBjbGllbnRJZDogc3RyaW5nLCBvbklzQ29tcGxldGVkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZjbGllbnRJZD0nICsgY2xpZW50SWQ7XHJcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9pc0NvbXBsZXRlZD8nICsgZGF0YSk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9uSXNDb21wbGV0ZWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2R4U3VydmV5U2VydmljZS50cyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge0Jhc2UsIElQYWdlLCBJQ29uZGl0aW9uUnVubmVyLCBJU3VydmV5LCBJRWxlbWVudCwgSVF1ZXN0aW9uLCBIYXNoVGFibGUsIFN1cnZleUVsZW1lbnQsIFN1cnZleVBhZ2VJZH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q29uZGl0aW9uUnVubmVyfSBmcm9tIFwiLi9jb25kaXRpb25zXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtQYW5lbE1vZGVsLCBQYW5lbE1vZGVsQmFzZSwgUXVlc3Rpb25Sb3dNb2RlbH0gZnJvbSBcIi4vcGFuZWxcIjtcclxuLyoqXHJcbiAqIFRoZSBwYWdlIG9iamVjdC4gSXQgaGFzIGVsZW1lbnRzIGNvbGxlY3Rpb24sIHRoYXQgY29udGFpbnMgcXVlc3Rpb25zIGFuZCBwYW5lbHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGFnZU1vZGVsIGV4dGVuZHMgUGFuZWxNb2RlbEJhc2UgaW1wbGVtZW50cyBJUGFnZSB7XHJcbiAgICBwcml2YXRlIG51bVZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgbmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5VmFsdWU6IHN0cmluZyA9IFwiaW5oZXJpdFwiO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZyA9IFwiXCIpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInBhZ2VcIjsgfVxyXG4gICAgcHVibGljIGdldCBudW0oKSB7IHJldHVybiB0aGlzLm51bVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IG51bSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubnVtVmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLm51bVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vbk51bUNoYW5nZWQodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBuYXZpZ2F0aW9uQnV0dG9uc1Zpc2liaWxpdHkoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5uYXZpZ2F0aW9uQnV0dG9uc1Zpc2liaWxpdHlWYWx1ZSA9IG5ld1ZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UmVuZHJlZFRpdGxlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBzdHIgPSBzdXBlci5nZXRSZW5kcmVkVGl0bGUoc3RyKTtcclxuICAgICAgICBpZih0aGlzLm51bSA+IDApIHtcclxuICAgICAgICAgICAgc3RyID0gdGhpcy5udW0gICsgXCIuIFwiICsgc3RyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzRmlyc3RRdWVzdGlvbigpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUgfHwgIXF1ZXN0aW9uLmhhc0lucHV0KSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzRmlyc3RFcnJvclF1ZXN0aW9uKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlIHx8IHRoaXMucXVlc3Rpb25zW2ldLmN1cnJlbnRFcnJvckNvdW50ID09IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1tpXS5mb2N1cyh0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNjcm9sbFRvVG9wKCkge1xyXG4gICAgICAgIFN1cnZleUVsZW1lbnQuU2Nyb2xsRWxlbWVudFRvVG9wKFN1cnZleVBhZ2VJZCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25OdW1DaGFuZ2VkKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZpc2libGVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHN1cGVyLm9uVmlzaWJsZUNoYW5nZWQoKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnBhZ2VWaXNpYmlsaXR5Q2hhbmdlZCh0aGlzLCB0aGlzLnZpc2libGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYWdlXCIsIFt7IG5hbWU6IFwibmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5XCIsIGRlZmF1bHQ6IFwiaW5oZXJpdFwiLCBjaG9pY2VzOiBbXCJpbmhlcml0XCIsIFwic2hvd1wiLCBcImhpZGVcIl0gfV0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnZU1vZGVsKCk7IH0sIFwicGFuZWxcIik7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlLnRzIiwiaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7QmFzZSwgSVBhZ2UsIElDb25kaXRpb25SdW5uZXIsIElTdXJ2ZXksIElTdXJ2ZXlEYXRhLCBJRWxlbWVudCwgSVF1ZXN0aW9uLCBIYXNoVGFibGUsIFN1cnZleUVsZW1lbnQsIFN1cnZleVBhZ2VJZH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q29uZGl0aW9uUnVubmVyfSBmcm9tIFwiLi9jb25kaXRpb25zXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtJTG9jYWxpemFibGVPd25lciwgTG9jYWxpemFibGVTdHJpbmd9IGZyb20gXCIuL2xvY2FsaXphYmxlc3RyaW5nXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25Sb3dNb2RlbCB7XHJcbiAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbjtcclxuICAgIHZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFuZWw6IFBhbmVsTW9kZWxCYXNlKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSBwYW5lbC5kYXRhICYmIHBhbmVsLmRhdGEuaXNEZXNpZ25Nb2RlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGVsZW1lbnRzOiBBcnJheTxJRWxlbWVudD4gPSBbXTtcclxuICAgIC8vVE9ETyByZW1vdmUgYWZ0ZXIgdXBkYXRpbmcgcmVhY3QgYW5kIHZ1ZVxyXG4gICAgcHVibGljIGdldCBxdWVzdGlvbnMoKTogQXJyYXk8SUVsZW1lbnQ+IHsgcmV0dXJuIHRoaXMuZWxlbWVudHM7fVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHVwZGF0ZVZpc2libGUoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jYWxjVmlzaWJsZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0V2lkdGgoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRFbGVtZW50KHE6IElFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50cy5wdXNoKHEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmlzaWJsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaykgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFdpZHRoKCkge1xyXG4gICAgICAgIHZhciB2aXNDb3VudCA9IHRoaXMuZ2V0VmlzaWJsZUNvdW50KCk7XHJcbiAgICAgICAgaWYgKHZpc0NvdW50ID09IDApIHJldHVybjtcclxuICAgICAgICB2YXIgY291bnRlciA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50c1tpXS5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIHEucmVuZGVyV2lkdGggPSBxLndpZHRoID8gcS53aWR0aCA6IE1hdGguZmxvb3IoMTAwIC8gdmlzQ291bnQpICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgcS5yaWdodEluZGVudCA9IGNvdW50ZXIgPCB2aXNDb3VudCAtIDEgPyAxIDogMDtcclxuICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWaXNpYmxlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgcmVzID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudHNbaV0uaXNWaXNpYmxlKSByZXMrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2FsY1Zpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldFZpc2libGVDb3VudCgpID4gMDsgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBiYXNlIGNsYXNzIGZvciBhIFBhbmVsIGFuZCBQYWdlIG9iamVjdHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGFuZWxNb2RlbEJhc2UgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSUNvbmRpdGlvblJ1bm5lciwgSUxvY2FsaXphYmxlT3duZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFuZWxDb3VudGVyID0gMTAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGFuZWxJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInNwX1wiICsgUGFuZWxNb2RlbEJhc2UucGFuZWxDb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkYXRhVmFsdWU6IElTdXJ2ZXkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBpZFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJvd1ZhbHVlczogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4gPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25SdW5uZXI6IENvbmRpdGlvblJ1bm5lciA9IG51bGw7XHJcbiAgICBwcml2YXRlIGVsZW1lbnRzVmFsdWU6IEFycmF5PElFbGVtZW50PiA9IG5ldyBBcnJheTxJRWxlbWVudD4oKTtcclxuICAgIHByaXZhdGUgaXNRdWVzdGlvbnNSZWFkeTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbnNWYWx1ZTogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IG5ldyBBcnJheTxRdWVzdGlvbkJhc2U+KCk7XHJcbiAgICBwdWJsaWMgcGFyZW50OiBQYW5lbE1vZGVsQmFzZSA9IG51bGw7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcm93c0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgbG9jVGl0bGVWYWx1ZTogTG9jYWxpemFibGVTdHJpbmc7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmlkVmFsdWUgPSBQYW5lbE1vZGVsQmFzZS5nZXRQYW5lbElkKCk7XHJcbiAgICAgICAgdGhpcy5sb2NUaXRsZVZhbHVlID0gbmV3IExvY2FsaXphYmxlU3RyaW5nKHRoaXMsIHRydWUpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmxvY1RpdGxlVmFsdWUub25SZW5kZXJlZEh0bWxDYWxsYmFjayA9IGZ1bmN0aW9uKHRleHQpIHsgcmV0dXJuIHNlbGYuZ2V0UmVuZHJlZFRpdGxlKHRleHQpOyB9O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHNWYWx1ZS5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKTogbnVtYmVyIHsgcmV0dXJuIHNlbGYuZG9PblB1c2hFbGVtZW50KHRoaXMsIHZhbHVlKTsgfTtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzVmFsdWUuc3BsaWNlID0gZnVuY3Rpb24gKHN0YXJ0PzogbnVtYmVyLCBkZWxldGVDb3VudD86IG51bWJlciwgLi4uaXRlbXM6IFF1ZXN0aW9uQmFzZVtdKTogUXVlc3Rpb25CYXNlW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5kb1NwbGljZUVsZW1lbnRzKHRoaXMsIHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogSVN1cnZleSB7IHJldHVybiB0aGlzLmRhdGFWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBkYXRhKHZhbHVlOiBJU3VydmV5KSB7XHJcbiAgICAgICAgaWYodGhpcy5kYXRhVmFsdWUgPT09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5kYXRhVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50c1tpXS5zZXREYXRhKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvY1RpdGxlLnRleHQ7IH1cclxuICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubG9jVGl0bGUudGV4dCA9IG5ld1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBsb2NUaXRsZSgpOiBMb2NhbGl6YWJsZVN0cmluZyB7IHJldHVybiB0aGlzLmxvY1RpdGxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXRMb2NhbGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGF0YSA/ICg8SUxvY2FsaXphYmxlT3duZXI+PGFueT50aGlzLmRhdGEpLmdldExvY2FsZSgpIDogXCJcIjsgfVxyXG4gICAgcHVibGljIGdldE1hcmtkb3duSHRtbCh0ZXh0OiBzdHJpbmcpICB7IHJldHVybiB0aGlzLmRhdGEgPyAoPElMb2NhbGl6YWJsZU93bmVyPjxhbnk+dGhpcy5kYXRhKS5nZXRNYXJrZG93bkh0bWwodGV4dCkgOiBudWxsOyB9XHJcblxyXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzUGFuZWwoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBxdWVzdGlvbnMoKTogQXJyYXk8UXVlc3Rpb25CYXNlPiB7XHJcbiAgICAgICAgaWYoIXRoaXMuaXNRdWVzdGlvbnNSZWFkeSkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1ZhbHVlID0gW107XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmKGVsLmlzUGFuZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcXMgPSAoPFBhbmVsTW9kZWw+ZWwpLnF1ZXN0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgcXMubGVuZ3RoOyBqICsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zVmFsdWUucHVzaChxc1tqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1ZhbHVlLnB1c2goPFF1ZXN0aW9uQmFzZT5lbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1F1ZXN0aW9uc1JlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9uc1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBtYXJrUXVlc3Rpb25MaXN0RGlydHkoKSB7XHJcbiAgICAgICAgdGhpcy5pc1F1ZXN0aW9uc1JlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgaWYodGhpcy5wYXJlbnQpIHRoaXMucGFyZW50Lm1hcmtRdWVzdGlvbkxpc3REaXJ0eSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBlbGVtZW50cygpOiBBcnJheTxJRWxlbWVudD4geyByZXR1cm4gdGhpcy5lbGVtZW50c1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgY29udGFpbnNFbGVtZW50KGVsZW1lbnQ6IElFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlbDogYW55ID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYoZWwgPT0gZWxlbWVudCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIGlmKGVsLmlzUGFuZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmKCg8UGFuZWxNb2RlbEJhc2U+ZWwpLmNvbnRhaW5zRWxlbWVudChlbGVtZW50KSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlLCBmb2N1c2VPbkZpcnN0RXJyb3I6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgZmlyc3RFcnJvclF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICB2YXIgdmlzaWJsZVF1ZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYWRkUXVlc3Rpb25zVG9MaXN0KHZpc2libGVRdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzaWJsZVF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB2aXNpYmxlUXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZihxdWVzdGlvbi5pc1JlYWRPbmx5KSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9jdXNlT25GaXJzdEVycm9yICYmIGZpcnN0RXJyb3JRdWVzdGlvbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvclF1ZXN0aW9uID0gcXVlc3Rpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmaXJzdEVycm9yUXVlc3Rpb24pIGZpcnN0RXJyb3JRdWVzdGlvbi5mb2N1cyh0cnVlKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFF1ZXN0aW9uc1RvTGlzdChsaXN0OiBBcnJheTxJUXVlc3Rpb24+LCB2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5lbGVtZW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICFlbC52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYoZWwuaXNQYW5lbCkge1xyXG4gICAgICAgICAgICAgICAgKDxQYW5lbE1vZGVsPmVsKS5hZGRRdWVzdGlvbnNUb0xpc3QobGlzdCwgdmlzaWJsZU9ubHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKDxJUXVlc3Rpb24+ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByb3dzKCk6IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+IHtcclxuICAgICAgICBpZighdGhpcy5yb3dWYWx1ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXMgPSB0aGlzLmJ1aWxkUm93cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dWYWx1ZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzQWN0aXZlKCkgeyByZXR1cm4gKCF0aGlzLmRhdGEpIHx8IHRoaXMuZGF0YS5jdXJyZW50UGFnZSA9PSB0aGlzLnJvb3Q7IH1cclxuICAgIHByb3RlY3RlZCBnZXQgcm9vdCgpOiBQYW5lbE1vZGVsQmFzZSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IDxQYW5lbE1vZGVsQmFzZT50aGlzO1xyXG4gICAgICAgIHdoaWxlKHJlcy5wYXJlbnQpIHJlcyA9IHJlcy5wYXJlbnQ7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVSb3coKTogUXVlc3Rpb25Sb3dNb2RlbCB7IHJldHVybiBuZXcgUXVlc3Rpb25Sb3dNb2RlbCh0aGlzKTsgfVxyXG4gICAgcHVibGljIG9uU3VydmV5TG9hZCgpIHtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50c1tpXS5vblN1cnZleUxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGhpcy5yb3dzQ2hhbmdlZENhbGxiYWNrKSB0aGlzLnJvd3NDaGFuZ2VkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgaXNMb2FkaW5nRnJvbUpzb24oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmlzTG9hZGluZ0Zyb21Kc29uOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25Sb3dzQ2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLnJvd1ZhbHVlcyA9IG51bGw7XHJcbiAgICAgICAgaWYodGhpcy5yb3dzQ2hhbmdlZENhbGxiYWNrICYmICF0aGlzLmlzTG9hZGluZ0Zyb21Kc29uKSB0aGlzLnJvd3NDaGFuZ2VkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0IGlzRGVzaWduTW9kZSgpIHsgcmV0dXJuIHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEuaXNEZXNpZ25Nb2RlOyB9XHJcbiAgICBwcml2YXRlIGRvT25QdXNoRWxlbWVudChsaXN0OiBBcnJheTxJRWxlbWVudD4sIHZhbHVlOiBJRWxlbWVudCkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKGxpc3QsIHZhbHVlKTtcclxuICAgICAgICB0aGlzLm1hcmtRdWVzdGlvbkxpc3REaXJ0eSgpO1xyXG4gICAgICAgIHRoaXMub25BZGRFbGVtZW50KHZhbHVlLCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5vblJvd3NDaGFuZ2VkKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9TcGxpY2VFbGVtZW50cyhsaXN0OiBBcnJheTxJRWxlbWVudD4sIHN0YXJ0PzogbnVtYmVyLCBkZWxldGVDb3VudD86IG51bWJlciwgLi4uaXRlbXM6IElFbGVtZW50W10pIHtcclxuICAgICAgICBpZighc3RhcnQpIHN0YXJ0ID0gMDtcclxuICAgICAgICBpZighZGVsZXRlQ291bnQpIGRlbGV0ZUNvdW50ID0gMDtcclxuICAgICAgICB2YXIgZGVsZXRlZFF1ZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkZWxldGVDb3VudDsgaSArKykge1xyXG4gICAgICAgICAgICBpZihpICsgc3RhcnQgPj0gbGlzdC5sZW5ndGgpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBkZWxldGVkUXVlc3Rpb25zLnB1c2gobGlzdFtpICsgc3RhcnRdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbChsaXN0LCBzdGFydCwgZGVsZXRlQ291bnQsIC4uLiBpdGVtcyk7XHJcbiAgICAgICAgdGhpcy5tYXJrUXVlc3Rpb25MaXN0RGlydHkoKTtcclxuICAgICAgICBpZighaXRlbXMpIGl0ZW1zID0gW107XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRlbGV0ZWRRdWVzdGlvbnMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZW1vdmVFbGVtZW50KGRlbGV0ZWRRdWVzdGlvbnNbaV0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdGhpcy5vbkFkZEVsZW1lbnQoaXRlbXNbaV0sIHN0YXJ0ICsgaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub25Sb3dzQ2hhbmdlZCgpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uQWRkRWxlbWVudChlbGVtZW50OiBJRWxlbWVudCwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmKGVsZW1lbnQuaXNQYW5lbCkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IDxQYW5lbE1vZGVsPmVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHAuZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICAgICAgcC5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZih0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYW5lbEFkZGVkKHAsIGluZGV4LCB0aGlzLCB0aGlzLnJvb3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcSA9IDxRdWVzdGlvbkJhc2U+ZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIHEuc2V0RGF0YSh0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnF1ZXN0aW9uQWRkZWQocSwgaW5kZXgsIHRoaXMsIHRoaXMucm9vdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGVsZW1lbnQucm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkVsZW1lbnRWaXNpYmlsaXR5Q2hhbmdlZChlbGVtZW50KTsgfVxyXG4gICAgICAgIGVsZW1lbnQuc3RhcnRXaXRoTmV3TGluZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkVsZW1lbnRTdGFydFdpdGhOZXdMaW5lQ2hhbmdlZChlbGVtZW50KTsgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblJlbW92ZUVsZW1lbnQoZWxlbWVudDogSUVsZW1lbnQpIHtcclxuICAgICAgICBpZighZWxlbWVudC5pc1BhbmVsKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZGF0YSkgdGhpcy5kYXRhLnF1ZXN0aW9uUmVtb3ZlZCg8UXVlc3Rpb25CYXNlPmVsZW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuZGF0YSkgdGhpcy5kYXRhLnBhbmVsUmVtb3ZlZChlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uRWxlbWVudFZpc2liaWxpdHlDaGFuZ2VkKGVsZW1lbnQ6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLnJvd1ZhbHVlcykge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJvd3NWaXNpYmlsaXR5KGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudC5vbkVsZW1lbnRWaXNpYmlsaXR5Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uRWxlbWVudFN0YXJ0V2l0aE5ld0xpbmVDaGFuZ2VkKGVsZW1lbnQ6IGFueSkge1xyXG4gICAgICAgIHRoaXMub25Sb3dzQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3dzVmlzaWJpbGl0eShlbGVtZW50OiBhbnkpICB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd1ZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5yb3dWYWx1ZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChyb3cuZWxlbWVudHMuaW5kZXhPZihlbGVtZW50KSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByb3cudXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGJ1aWxkUm93cygpOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxRdWVzdGlvblJvd01vZGVsPigpO1xyXG4gICAgICAgIHZhciBsYXN0Um93VmlzaWJsZUluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzLmVsZW1lbnRzW2ldO1xyXG4gICAgICAgICAgICB2YXIgaXNOZXdSb3cgPSBpID09IDAgfHwgZWwuc3RhcnRXaXRoTmV3TGluZTtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IGlzTmV3Um93ID8gdGhpcy5jcmVhdGVSb3coKSA6IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGlmKGlzTmV3Um93KSByZXN1bHQucHVzaChyb3cpO1xyXG4gICAgICAgICAgICByb3cuYWRkRWxlbWVudChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXS51cGRhdGVWaXNpYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJlbmRyZWRUaXRsZSh0aGlzLmxvY1RpdGxlLnRleHRPckh0bWwpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFJlbmRyZWRUaXRsZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYoIXN0ciAmJiB0aGlzLmlzUGFuZWwgJiYgdGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiBcIltcIiArIHRoaXMubmFtZSArIFwiXVwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5wcm9jZXNzVGV4dChzdHIpIDogc3RyO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZpc2libGVDaGFuZ2VkKCkge1xyXG5cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4geyAgcmV0dXJuICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmlzRGVzaWduTW9kZSkgfHwgdGhpcy5nZXRJc1BhZ2VWaXNpYmxlKG51bGwpOyB9XHJcbiAgICBwdWJsaWMgZ2V0SXNQYWdlVmlzaWJsZShleGNlcHRpb25RdWVzdGlvbjogSVF1ZXN0aW9uKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXSA9PSBleGNlcHRpb25RdWVzdGlvbikgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZEVsZW1lbnQoZWxlbWVudDogSUVsZW1lbnQsIGluZGV4OiBudW1iZXIgPSAtMSkge1xyXG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuZWxlbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMucHVzaChlbGVtZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzLnNwbGljZShpbmRleCwgMCwgZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UsIGluZGV4OiBudW1iZXIgPSAtMSkge1xyXG4gICAgICAgIHRoaXMuYWRkRWxlbWVudChxdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFBhbmVsKHBhbmVsOiBQYW5lbE1vZGVsLCBpbmRleDogbnVtYmVyID0gLTEpIHtcclxuICAgICAgICB0aGlzLmFkZEVsZW1lbnQocGFuZWwsIGluZGV4KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGROZXdRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICByZXR1cm4gcXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTmV3UGFuZWwobmFtZTogc3RyaW5nKTogUGFuZWxNb2RlbCB7XHJcbiAgICAgICAgdmFyIHBhbmVsID0gdGhpcy5jcmVhdGVOZXdQYW5lbChuYW1lKTtcclxuICAgICAgICB0aGlzLmFkZFBhbmVsKHBhbmVsKTtcclxuICAgICAgICByZXR1cm4gcGFuZWw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3UGFuZWwobmFtZTogc3RyaW5nKTogUGFuZWxNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQYW5lbE1vZGVsKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZUVsZW1lbnQoZWxlbWVudDogSUVsZW1lbnQpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmVsZW1lbnRzLmluZGV4T2YoZWxlbWVudCk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50cy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbCA9IHRoaXMuZWxlbWVudHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZihlbC5pc1BhbmVsICYmICg8UGFuZWxNb2RlbEJhc2U+KDxhbnk+ZWwpKS5yZW1vdmVFbGVtZW50KGVsZW1lbnQpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pikge1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2ldLnJ1bkNvbmRpdGlvbih2YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb25Mb2NhbGVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmVsZW1lbnRzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2ldLm9uTG9jYWxlQ2hhbmdlZCgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubG9jVGl0bGUub25DaGFuZ2VkKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNvbnRhaW5lciBlbGVtZW50LCBzaW1pbGFyIHRvIHRoZSBQYWdlIG9iamVjdHMuIEhvd2V2ZXIsIHVubGlrZSB0aGUgUGFnZSwgUGFuZWwgY2FuJ3QgYmUgYSByb290LiBcclxuICogSXQgbWF5IGNvbnRhaW4gcXVlc3Rpb25zIGFuZCBvdGhlciBwYW5lbHMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGFuZWxNb2RlbCBleHRlbmRzIFBhbmVsTW9kZWxCYXNlIGltcGxlbWVudHMgSUVsZW1lbnQge1xyXG4gICAgcHJpdmF0ZSByZW5kZXJXaWR0aFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJpZ2h0SW5kZW50VmFsdWU6IG51bWJlcjtcclxuICAgIHB1YmxpYyB3aWR0aDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBpbm5lckluZGVudFZhbHVlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGFydFdpdGhOZXdMaW5lVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICByb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgc3RhcnRXaXRoTmV3TGluZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYW5lbFwiOyB9XHJcbiAgICBwdWJsaWMgc2V0RGF0YShuZXdWYWx1ZTogSVN1cnZleURhdGEpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSA8SVN1cnZleT5uZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNQYW5lbCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaW5uZXJJbmRlbnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuaW5uZXJJbmRlbnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBpbm5lckluZGVudCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWwgPT0gdGhpcy5pbm5lckluZGVudFZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pbm5lckluZGVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spIHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcmVuZGVyV2lkdGgoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucmVuZGVyV2lkdGhWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCByZW5kZXJXaWR0aCh2YWw6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh2YWwgPT0gdGhpcy5yZW5kZXJXaWR0aCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucmVuZGVyV2lkdGhWYWx1ZSA9IHZhbDtcclxuICAgICAgICBpZih0aGlzLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrKSB0aGlzLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHN0YXJ0V2l0aE5ld0xpbmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN0YXJ0V2l0aE5ld0xpbmVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzdGFydFdpdGhOZXdMaW5lKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYodGhpcy5zdGFydFdpdGhOZXdMaW5lID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zdGFydFdpdGhOZXdMaW5lVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpZih0aGlzLnN0YXJ0V2l0aE5ld0xpbmVDaGFuZ2VkQ2FsbGJhY2spIHRoaXMuc3RhcnRXaXRoTmV3TGluZUNoYW5nZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByaWdodEluZGVudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5yaWdodEluZGVudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHJpZ2h0SW5kZW50KHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnJpZ2h0SW5kZW50KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5yaWdodEluZGVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spIHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZpc2libGVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGlmKHRoaXMucm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaykgdGhpcy5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYW5lbFwiLCBbXCJuYW1lXCIsICB7IG5hbWU6IFwiZWxlbWVudHNcIiwgYWx0ZXJuYXRpdmVOYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIsIHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICB7IG5hbWU6IFwic3RhcnRXaXRoTmV3TGluZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWV9LCB7IG5hbWU6IFwidmlzaWJsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJ2aXNpYmxlSWY6ZXhwcmVzc2lvblwiLCBcclxuICAgIHsgbmFtZTogXCJ0aXRsZTp0ZXh0XCIsIHNlcmlhbGl6YXRpb25Qcm9wZXJ0eTogXCJsb2NUaXRsZVwiIH0sIHtuYW1lOiBcImlubmVySW5kZW50Om51bWJlclwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgM119XSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFBhbmVsTW9kZWwoKTsgfSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYW5lbC50cyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSAnLi9qc29ub2JqZWN0JztcclxuaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gJy4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtCYXNlLCBTdXJ2ZXlFcnJvciwgU3VydmV5RWxlbWVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge0Fuc3dlclJlcXVpcmVkRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7U3VydmV5VmFsaWRhdG9yLCBJVmFsaWRhdG9yT3duZXIsIFZhbGlkYXRvclJ1bm5lcn0gZnJvbSBcIi4vdmFsaWRhdG9yXCI7XHJcbmltcG9ydCB7VGV4dFByZVByb2Nlc3Nvcn0gZnJvbSBcIi4vdGV4dFByZVByb2Nlc3NvclwiO1xyXG5pbXBvcnQge0lMb2NhbGl6YWJsZU93bmVyLCBMb2NhbGl6YWJsZVN0cmluZ30gZnJvbSBcIi4vbG9jYWxpemFibGVzdHJpbmdcIjtcclxuXHJcbi8qKlxyXG4gKiBFeHRlbmRzIHF1ZXN0aW9uIGJhc2UgY2xhc3Mgd2l0aCB0aXRsZSwgdmFsdWUsIGVycm9ycyBhbmQgb3RoZXIgZnVuY3Rpb25hbGl0eVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb25CYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgIHByaXZhdGUgbG9jVGl0bGVWYWx1ZTogTG9jYWxpemFibGVTdHJpbmc7XHJcbiAgICBwcml2YXRlIGxvY0NvbW1lbnRUZXh0VmFsdWU6IExvY2FsaXphYmxlU3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBhbnk7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uQ29tbWVudDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBpc1JlcXVpcmVkVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaGFzQ29tbWVudFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGhhc090aGVyVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgcmVhZE9ubHlWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSB0ZXh0UHJlUHJvY2Vzc29yOiBUZXh0UHJlUHJvY2Vzc29yO1xyXG4gICAgZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4gPSBbXTtcclxuICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG4gICAgdmFsdWVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb21tZW50Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgZXJyb3JzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgdGl0bGVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIHRoaXMubG9jVGl0bGVWYWx1ZSA9IG5ldyBMb2NhbGl6YWJsZVN0cmluZyh0aGlzLCB0cnVlKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5sb2NUaXRsZVZhbHVlLm9uUmVuZGVyZWRIdG1sQ2FsbGJhY2sgPSBmdW5jdGlvbih0ZXh0KSB7IHJldHVybiBzZWxmLmZ1bGxUaXRsZTsgfTtcclxuICAgICAgICB0aGlzLmxvY0NvbW1lbnRUZXh0VmFsdWUgPSBuZXcgTG9jYWxpemFibGVTdHJpbmcodGhpcywgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNJbnB1dCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaW5wdXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZCArIFwiaVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMubG9jVGl0bGUudGV4dDtcclxuICAgICAgICByZXR1cm4gcmVzID8gcmVzIDogdGhpcy5uYW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5sb2NUaXRsZS50ZXh0ID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy50aXRsZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGxvY1RpdGxlKCk6IExvY2FsaXphYmxlU3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jVGl0bGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBsb2NDb21tZW50VGV4dCgpOiBMb2NhbGl6YWJsZVN0cmluZyB7IHJldHVybiB0aGlzLmxvY0NvbW1lbnRUZXh0VmFsdWU7IH1cclxuICAgIHByaXZhdGUgZ2V0IGxvY1RpdGxlSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmxvY1RpdGxlLnRleHRPckh0bWw7XHJcbiAgICAgICAgcmV0dXJuIHJlcz8gcmVzOiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgb25Mb2NhbGVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHN1cGVyLm9uTG9jYWxlQ2hhbmdlZCgpO1xyXG4gICAgICAgIHRoaXMubG9jVGl0bGUub25DaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5sb2NDb21tZW50VGV4dC5vbkNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkVGl0bGUoKSB7IHJldHVybiB0aGlzLnN1cnZleSAhPSBudWxsID8gdGhpcy5zdXJ2ZXkucHJvY2Vzc1RleHQodGhpcy5sb2NUaXRsZUh0bWwpIDogdGhpcy5sb2NUaXRsZUh0bWw7IH1cclxuICAgIHB1YmxpYyBnZXQgZnVsbFRpdGxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LmdldFF1ZXN0aW9uVGl0bGVUZW1wbGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50ZXh0UHJlUHJvY2Vzc29yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3IgPSBuZXcgVGV4dFByZVByb2Nlc3NvcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmNhblByb2Nlc3NlZFRleHRWYWx1ZXMobmFtZS50b0xvd2VyQ2FzZSgpKTsgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0UHJlUHJvY2Vzc29yLnByb2Nlc3ModGhpcy5zdXJ2ZXkuZ2V0UXVlc3Rpb25UaXRsZVRlbXBsYXRlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVxdWlyZVRleHQgPSB0aGlzLnJlcXVpcmVkVGV4dDtcclxuICAgICAgICBpZiAocmVxdWlyZVRleHQpIHJlcXVpcmVUZXh0ICs9IFwiIFwiO1xyXG4gICAgICAgIHZhciBubyA9IHRoaXMubm87XHJcbiAgICAgICAgaWYgKG5vKSBubyArPSBcIi4gXCI7XHJcbiAgICAgICAgcmV0dXJuIG5vICsgcmVxdWlyZVRleHQgKyB0aGlzLnByb2Nlc3NlZFRpdGxlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzKG9uRXJyb3I6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIFN1cnZleUVsZW1lbnQuU2Nyb2xsRWxlbWVudFRvVG9wKHRoaXMuaWQpO1xyXG4gICAgICAgIHZhciBpZCA9ICFvbkVycm9yID8gdGhpcy5nZXRGaXJzdElucHV0RWxlbWVudElkKCkgOiB0aGlzLmdldEZpcnN0RXJyb3JJbnB1dEVsZW1lbnRJZCgpO1xyXG4gICAgICAgIGlmIChTdXJ2ZXlFbGVtZW50LkZvY3VzRWxlbWVudChpZCkpIHtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5mb2N1c0NhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0SWQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RFcnJvcklucHV0RWxlbWVudElkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNhblByb2Nlc3NlZFRleHRWYWx1ZXMobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWUgPT0gXCJub1wiIHx8IG5hbWUgPT0gXCJ0aXRsZVwiIHx8IG5hbWUgPT0gXCJyZXF1aXJlXCI7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJub1wiKSByZXR1cm4gdGhpcy5ubztcclxuICAgICAgICBpZiAobmFtZSA9PSBcInRpdGxlXCIpIHJldHVybiB0aGlzLnByb2Nlc3NlZFRpdGxlO1xyXG4gICAgICAgIGlmIChuYW1lID09IFwicmVxdWlyZVwiKSByZXR1cm4gdGhpcy5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzUmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzUmVxdWlyZWRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBpc1JlcXVpcmVkKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUmVxdWlyZWQgPT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1JlcXVpcmVkVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy50aXRsZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0NvbW1lbnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBoYXNDb21tZW50KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghdGhpcy5zdXBwb3J0Q29tbWVudCgpKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5oYXNDb21tZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29tbWVudCkgdGhpcy5oYXNPdGhlciA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb21tZW50VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmxvY0NvbW1lbnRUZXh0LnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHJlcyA/IHJlcyA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBjb21tZW50VGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5sb2NDb21tZW50VGV4dC50ZXh0ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc090aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNPdGhlclZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGhhc090aGVyKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghdGhpcy5zdXBwb3J0T3RoZXIoKSB8fCB0aGlzLmhhc090aGVyID09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzT3RoZXJWYWx1ZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikgdGhpcy5oYXNDb21tZW50ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5oYXNPdGhlckNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBoYXNPdGhlckNoYW5nZWQoKSB7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNSZWFkT25seSgpIHsgcmV0dXJuIHRoaXMucmVhZE9ubHkgfHwgKHRoaXMuc3VydmV5ICE9IG51bGwgJiYgdGhpcy5zdXJ2ZXkuaXNEaXNwbGF5TW9kZSk7fVxyXG4gICAgcHVibGljIGdldCByZWFkT25seSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucmVhZE9ubHlWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCByZWFkT25seSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmKHRoaXMucmVhZE9ubHkgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJlYWRPbmx5VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm9uUmVhZE9ubHlDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBvblJlYWRPbmx5Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJlYWRPbmx5Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgbm8oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXggPCAwKSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgc3RhcnRJbmRleCA9IDE7XHJcbiAgICAgICAgdmFyIGlzTnVtZXJpYyA9IHRydWU7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LnF1ZXN0aW9uU3RhcnRJbmRleCkge1xyXG4gICAgICAgICAgICBzdHIgPSB0aGlzLnN1cnZleS5xdWVzdGlvblN0YXJ0SW5kZXg7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZUludChzdHIpKSBzdGFydEluZGV4ID0gcGFyc2VJbnQoc3RyKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoc3RyLmxlbmd0aCA9PSAxKSBpc051bWVyaWMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYykgcmV0dXJuICh0aGlzLnZpc2libGVJbmRleCArIHN0YXJ0SW5kZXgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoc3RyLmNoYXJDb2RlQXQoMCkgKyB0aGlzLnZpc2libGVJbmRleCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkge1xyXG4gICAgICAgIHN1cGVyLm9uU2V0RGF0YSgpO1xyXG4gICAgICAgIHRoaXMub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVGcm9tRGF0YSh0aGlzLmdldFZhbHVlQ29yZSgpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXN2YWx1ZUNoYW5nZWRDYWxsYmFja0ZpcmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXN2YWx1ZUNoYW5nZWRDYWxsYmFja0ZpcmluZykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXN2YWx1ZUNoYW5nZWRDYWxsYmFja0ZpcmluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52YWx1ZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5pc3ZhbHVlQ2hhbmdlZENhbGxiYWNrRmlyaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbW1lbnQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0Q29tbWVudCgpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbW1lbnQgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldENvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29tbWVudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEuZ2V0Q29tbWVudCh0aGlzLm5hbWUpIDogdGhpcy5xdWVzdGlvbkNvbW1lbnQ7IH1cclxuICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiBCYXNlLmlzVmFsdWVFbXB0eSh0aGlzLnZhbHVlKTsgfVxyXG4gICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5jaGVja0ZvckVycm9ycyhmaXJlQ2FsbGJhY2spO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjdXJyZW50RXJyb3JDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlcXVpcmVkVGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgIT0gbnVsbCAmJiB0aGlzLmlzUmVxdWlyZWQgPyB0aGlzLnN1cnZleS5yZXF1aXJlZFRleHQgOiBcIlwiOyB9XHJcbiAgICBwdWJsaWMgYWRkRXJyb3IoZXJyb3I6IFN1cnZleUVycm9yKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja0ZvckVycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgZXJyb3JMZW5ndGggPSB0aGlzLmVycm9ycyA/IHRoaXMuZXJyb3JzLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICB0aGlzLm9uQ2hlY2tGb3JFcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCAmJiB0aGlzLnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSAmJiB0aGlzLmVycm9ycy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnN1cnZleS52YWxpZGF0ZVF1ZXN0aW9uKHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpcmVDYWxsYmFjayAmJiAoZXJyb3JMZW5ndGggIT0gdGhpcy5lcnJvcnMubGVuZ3RoIHx8IGVycm9yTGVuZ3RoID4gMCkpIHtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzUmVxdWlyZWRFcnJvcigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEFuc3dlclJlcXVpcmVkRXJyb3IoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGhhc1JlcXVpcmVkRXJyb3IoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZCAmJiB0aGlzLmlzRW1wdHkoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBydW5WYWxpZGF0b3JzKCk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldE5ld1ZhbHVlSW5EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0TmV3VmFsdWVJbkRhdGEobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5KSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy52YWx1ZVRvRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlQ29yZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEuZ2V0VmFsdWUodGhpcy5uYW1lKSA6IHRoaXMucXVlc3Rpb25WYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0VmFsdWVDb3JlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldFZhbHVlKHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhKHZhbDogYW55KTogYW55IHsgcmV0dXJuIHZhbDsgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhKHZhbDogYW55KTogYW55IHsgcmV0dXJuIHZhbDsgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkgeyB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0TmV3Q29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRDb21tZW50KHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB0aGlzLnF1ZXN0aW9uQ29tbWVudCA9IG5ld1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgLy9JUXVlc3Rpb25cclxuICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlRnJvbURhdGEobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29tbWVudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvL0lWYWxpZGF0b3JPd25lclxyXG4gICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIG51bGw7IH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicXVlc3Rpb25cIiwgW3sgbmFtZTogXCJ0aXRsZTp0ZXh0XCIsIHNlcmlhbGl6YXRpb25Qcm9wZXJ0eTogXCJsb2NUaXRsZVwiIH0sXHJcbiAgICB7IG5hbWU6IFwiY29tbWVudFRleHRcIiwgc2VyaWFsaXphdGlvblByb3BlcnR5OiBcImxvY0NvbW1lbnRUZXh0XCIgfSxcclxuICAgIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwicmVhZE9ubHk6Ym9vbGVhblwiLCB7IG5hbWU6IFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dmFsaWRhdG9yXCIsIGNsYXNzTmFtZVBhcnQ6IFwidmFsaWRhdG9yXCJ9XSwgbnVsbCwgXCJxdWVzdGlvbmJhc2VcIik7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9xdWVzdGlvbi50cyIsImltcG9ydCB7QmFzZSwgSVF1ZXN0aW9uLCBFdmVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ3VzdG9tV2lkZ2V0IHtcclxuICAgIHB1YmxpYyBodG1sVGVtcGxhdGU6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyB3aWRnZXRKc29uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmh0bWxUZW1wbGF0ZSA9IHdpZGdldEpzb24uaHRtbFRlbXBsYXRlID8gd2lkZ2V0SnNvbi5odG1sVGVtcGxhdGUgOiBcIlwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFmdGVyUmVuZGVyKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGVsOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy53aWRnZXRKc29uLmFmdGVyUmVuZGVyKSB0aGlzLndpZGdldEpzb24uYWZ0ZXJSZW5kZXIocXVlc3Rpb24sIGVsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB3aWxsVW5tb3VudChxdWVzdGlvbjogSVF1ZXN0aW9uLCBlbDogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMud2lkZ2V0SnNvbi53aWxsVW5tb3VudCkgdGhpcy53aWRnZXRKc29uLndpbGxVbm1vdW50KHF1ZXN0aW9uLCBlbCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaXNGaXQocXVlc3Rpb246IElRdWVzdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLndpZGdldEpzb24uaXNGaXQpIHJldHVybiB0aGlzLndpZGdldEpzb24uaXNGaXQocXVlc3Rpb24pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbVdpZGdldENvbGxlY3Rpb24ge1xyXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogQ3VzdG9tV2lkZ2V0Q29sbGVjdGlvbiA9IG5ldyBDdXN0b21XaWRnZXRDb2xsZWN0aW9uKCk7XHJcbiAgICBwcml2YXRlIHdpZGdldHNWYWx1ZXM6IEFycmF5PFF1ZXN0aW9uQ3VzdG9tV2lkZ2V0PiA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBvbkN1c3RvbVdpZGdldEFkZGVkOiBFdmVudDwoY3VzdG9tV2lkZ2V0OiBRdWVzdGlvbkN1c3RvbVdpZGdldCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChjdXN0b21XaWRnZXQ6IFF1ZXN0aW9uQ3VzdG9tV2lkZ2V0KSA9PiBhbnksIGFueT4oKTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHdpZGdldHMoKTogQXJyYXk8UXVlc3Rpb25DdXN0b21XaWRnZXQ+IHsgcmV0dXJuIHRoaXMud2lkZ2V0c1ZhbHVlczsgfVxyXG4gICAgcHVibGljIGFkZEN1c3RvbVdpZGdldCh3aWRnZXRKc29uOiBhbnkpIHtcclxuICAgICAgICB2YXIgbmFtZSA9IHdpZGdldEpzb24ubmFtZTtcclxuICAgICAgICBpZiAoIW5hbWUpIHtcclxuICAgICAgICAgICAgbmFtZSA9IFwid2lkZ2V0X1wiICsgdGhpcy53aWRnZXRzLmxlbmd0aCArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjdXN0b21XaWRnZXQgPSBuZXcgUXVlc3Rpb25DdXN0b21XaWRnZXQobmFtZSwgd2lkZ2V0SnNvbik7XHJcbiAgICAgICAgdGhpcy53aWRnZXRzVmFsdWVzLnB1c2goY3VzdG9tV2lkZ2V0KTtcclxuICAgICAgICB0aGlzLm9uQ3VzdG9tV2lkZ2V0QWRkZWQuZmlyZShjdXN0b21XaWRnZXQsIG51bGwpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsZWFyKCkgeyB0aGlzLndpZGdldHNWYWx1ZXMgPSBbXTsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRDdXN0b21XaWRnZXQocXVlc3Rpb246IElRdWVzdGlvbik6IFF1ZXN0aW9uQ3VzdG9tV2lkZ2V0IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMud2lkZ2V0c1ZhbHVlcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMud2lkZ2V0c1ZhbHVlc1tpXS5pc0ZpdChxdWVzdGlvbikpIHJldHVybiB0aGlzLndpZGdldHNWYWx1ZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9xdWVzdGlvbkN1c3RvbVdpZGdldHMudHMiLCJpbXBvcnQge0Jhc2UsIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciwgSVN1cnZleURhdGEsIElTdXJ2ZXksIEhhc2hUYWJsZSwgRXZlbnR9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7UXVlc3Rpb25DdXN0b21XaWRnZXR9IGZyb20gJy4vcXVlc3Rpb25DdXN0b21XaWRnZXRzJztcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tICcuL2pzb25vYmplY3QnO1xyXG5pbXBvcnQge0NvbmRpdGlvblJ1bm5lcn0gZnJvbSAnLi9jb25kaXRpb25zJztcclxuaW1wb3J0IHtJTG9jYWxpemFibGVPd25lcn0gZnJvbSBcIi4vbG9jYWxpemFibGVzdHJpbmdcIjtcclxuXHJcbi8qKlxyXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGFsbCBxdWVzdGlvbnMuIFF1ZXN0aW9uQmFzZSBkb2Vzbid0IGhhdmUgaW5mb3JtYXRpb24gYWJvdXQgdGl0bGUsIHZhbHVlcywgZXJyb3JzIGFuZCBzbyBvbi5cclxuICogVGhvc2UgcHJvcGVydGllcyBhcmUgZGVmaW5lZCBpbiB0aGUgUXVlc3Rpb24gY2xhc3MuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25CYXNlIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciwgSUxvY2FsaXphYmxlT3duZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcXVlc3Rpb25Db3VudGVyID0gMTAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UXVlc3Rpb25JZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInNxX1wiICsgUXVlc3Rpb25CYXNlLnF1ZXN0aW9uQ291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRhdGE6IElTdXJ2ZXlEYXRhID0gbnVsbDtcclxuICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IElTdXJ2ZXkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25SdW5uZXI6IENvbmRpdGlvblJ1bm5lciA9IG51bGw7XHJcbiAgICBwdWJsaWMgY3VzdG9tV2lkZ2V0OiBRdWVzdGlvbkN1c3RvbVdpZGdldDtcclxuICAgIHB1YmxpYyBjdXN0b21XaWRnZXREYXRhID0geyBpc05lZWRSZW5kZXI6IHRydWUgfTtcclxuICAgIHB1YmxpYyB2aXNpYmxlSWY6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGlkVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgc3RhcnRXaXRoTmV3TGluZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgdmlzaWJsZUluZGV4VmFsdWU6IG51bWJlciA9IC0xO1xyXG4gICAgcHVibGljIHdpZHRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSByZW5kZXJXaWR0aFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSByaWdodEluZGVudFZhbHVlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBpbmRlbnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBsb2NhbGVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBRdWVzdGlvbkJhc2UpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBRdWVzdGlvbkJhc2UpID0+IGFueSwgYW55PigpO1xyXG4gICAgZm9jdXNDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHN0YXJ0V2l0aE5ld0xpbmVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgdmlzaWJsZUluZGV4Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcmVhZE9ubHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5pZFZhbHVlID0gUXVlc3Rpb25CYXNlLmdldFF1ZXN0aW9uSWQoKTtcclxuICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNQYW5lbCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCB2aXNpYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWwgPT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJvd1Zpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKDxJUXVlc3Rpb24+dGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZSB8fCAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkuaXNEZXNpZ25Nb2RlKTsgfVxyXG4gICAgcHVibGljIGdldCBpc1JlYWRPbmx5KCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudmlzaWJsZUluZGV4VmFsdWU7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudEVycm9yQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIDA7IH1cclxuICAgIHB1YmxpYyBnZXQgaGFzVGl0bGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNJbnB1dCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHN0YXJ0V2l0aE5ld0xpbmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN0YXJ0V2l0aE5ld0xpbmVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzdGFydFdpdGhOZXdMaW5lKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYodGhpcy5zdGFydFdpdGhOZXdMaW5lID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zdGFydFdpdGhOZXdMaW5lVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpZih0aGlzLnN0YXJ0V2l0aE5ld0xpbmVDaGFuZ2VkQ2FsbGJhY2spIHRoaXMuc3RhcnRXaXRoTmV3TGluZUNoYW5nZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByZW5kZXJXaWR0aCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5yZW5kZXJXaWR0aFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHJlbmRlcldpZHRoKHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnJlbmRlcldpZHRoKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5yZW5kZXJXaWR0aFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpbmRlbnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuaW5kZW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaW5kZW50KHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLmluZGVudCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaW5kZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJpZ2h0SW5kZW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnJpZ2h0SW5kZW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgcmlnaHRJbmRlbnQodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMucmlnaHRJbmRlbnQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJpZ2h0SW5kZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZm9jdXMob25FcnJvcjogYm9vbGVhbiA9IGZhbHNlKSB7IH1cclxuICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXlEYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgaWYobmV3VmFsdWUgJiYgbmV3VmFsdWVbXCJxdWVzdGlvbkFkZGVkXCJdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSA8SVN1cnZleT5uZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vblNldERhdGEoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IElTdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIGZpcmVDYWxsYmFjayhjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7IH1cclxuICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICBwdWJsaWMgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICAvL0lRdWVzdGlvblxyXG4gICAgcHVibGljIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgIH1cclxuICAgIHB1YmxpYyBvblN1cnZleUxvYWQoKSB7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGNsZWFyVW51c2VkVmFsdWVzKCkge31cclxuICAgIHB1YmxpYyBvbkxvY2FsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5sb2NhbGVDaGFuZ2VkLmZpcmUodGhpcywgdGhpcy5nZXRMb2NhbGUoKSk7XHJcbiAgICB9XHJcbiAgICBvblJlYWRPbmx5Q2hhbmdlZCgpIHtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIC8vSUxvY2FsaXphYmxlT3duZXJcclxuICAgIHB1YmxpYyBnZXRMb2NhbGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGF0YSA/ICg8SUxvY2FsaXphYmxlT3duZXI+PGFueT50aGlzLmRhdGEpLmdldExvY2FsZSgpIDogXCJcIjsgfVxyXG4gICAgcHVibGljIGdldE1hcmtkb3duSHRtbCh0ZXh0OiBzdHJpbmcpICB7IHJldHVybiB0aGlzLmRhdGEgPyAoPElMb2NhbGl6YWJsZU93bmVyPjxhbnk+dGhpcy5kYXRhKS5nZXRNYXJrZG93bkh0bWwodGV4dCkgOiBudWxsOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uYmFzZVwiLCBbXCIhbmFtZVwiLCB7IG5hbWU6IFwidmlzaWJsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJ2aXNpYmxlSWY6ZXhwcmVzc2lvblwiLFxyXG4gICAgeyBuYW1lOiBcIndpZHRoXCIgfSwgeyBuYW1lOiBcInN0YXJ0V2l0aE5ld0xpbmU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfSwge25hbWU6IFwiaW5kZW50Om51bWJlclwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgM119XSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9xdWVzdGlvbmJhc2UudHMiLCJpbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi9xdWVzdGlvbmJhc2UnO1xyXG5pbXBvcnQge0lFbGVtZW50LCBIYXNoVGFibGV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbi8vVE9ETyByZXBsYWNlIGNvbXBsZXRlbHkgd2l0aCBFbGVtZW50RmFjdG9yeVxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25GYWN0b3J5IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2U6IFF1ZXN0aW9uRmFjdG9yeSA9IG5ldyBRdWVzdGlvbkZhY3RvcnkoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERlZmF1bHRDaG9pY2VzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICByZXR1cm4gW1wiMXxcIiArIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJjaG9pY2VzX2ZpcnN0SXRlbVwiKSwgXCIyfFwiICsgc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImNob2ljZXNfc2Vjb25kSXRlbVwiKSwgXCIzfFwiICsgc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImNob2ljZXNfdGhpcmRJdGVtXCIpXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IERlZmF1bHRDb2x1bXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHZhciBjb2xOYW1lID0gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1hdHJpeF9jb2x1bW5cIikgKyBcIiBcIjtcclxuICAgICAgICByZXR1cm4gW2NvbE5hbWUgKyBcIjFcIiwgY29sTmFtZSArIFwiMlwiLCBjb2xOYW1lICsgXCIzXCJdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgRGVmYXVsdFJvd3MoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHZhciByb3dOYW1lID0gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1hdHJpeF9yb3dcIikgKyBcIiBcIjtcclxuICAgICAgICByZXR1cm4gW3Jvd05hbWUgKyBcIjFcIiwgcm93TmFtZSArIFwiMlwiXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2U+ID0ge307XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uQ3JlYXRvcjogKG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdID0gcXVlc3Rpb25DcmVhdG9yO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRvckhhc2ggPSB7fTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBbGxUeXBlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdO1xyXG4gICAgICAgIGlmIChjcmVhdG9yID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBjcmVhdG9yKG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRWxlbWVudEZhY3Rvcnkge1xyXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogRWxlbWVudEZhY3RvcnkgPSBuZXcgRWxlbWVudEZhY3RvcnkoKTtcclxuICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBJRWxlbWVudD4gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJFbGVtZW50KGVsZW1lbnRUeXBlOiBzdHJpbmcsIGVsZW1lbnRDcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBJRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRvckhhc2hbZWxlbWVudFR5cGVdID0gZWxlbWVudENyZWF0b3I7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9ySGFzaCA9IHt9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEFsbFR5cGVzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuZ2V0QWxsVHlwZXMoKTtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZUVsZW1lbnQoZWxlbWVudFR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogSUVsZW1lbnQge1xyXG4gICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtlbGVtZW50VHlwZV07XHJcbiAgICAgICAgaWYgKGNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihlbGVtZW50VHlwZSwgbmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50cyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tICcuL3JlYWN0cXVlc3Rpb25lbGVtZW50JztcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlDdXN0b21XaWRnZXQgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBsb2NhbGVDaGFuZ2VkSGFuZGxlciA9IChzZW5kZXIpID0+IHNlbmRlci5jdXN0b21XaWRnZXREYXRhLmlzTmVlZFJlbmRlciA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9hZnRlclJlbmRlcigpIHtcclxuICAgICAgICBsZXQgZWwgPSB0aGlzLnJlZnNbJ3Jvb3QnXTtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UuY3VzdG9tV2lkZ2V0KSB7XHJcbiAgICAgICAgICAgIGVsID0gdGhpcy5yZWZzWyd3aWRnZXQnXTtcclxuICAgICAgICAgICAgaWYgKCEhZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLmN1c3RvbVdpZGdldC5hZnRlclJlbmRlcih0aGlzLnF1ZXN0aW9uQmFzZSwgZWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UuY3VzdG9tV2lkZ2V0RGF0YS5pc05lZWRSZW5kZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hZnRlclJlbmRlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZS5sb2NhbGVDaGFuZ2VkLmFkZCh0aGlzLmxvY2FsZUNoYW5nZWRIYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRVcGRhdGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FmdGVyUmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgbGV0IGVsID0gdGhpcy5yZWZzWydyb290J107XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25CYXNlLmN1c3RvbVdpZGdldCkge1xyXG4gICAgICAgICAgICBlbCA9IHRoaXMucmVmc1snd2lkZ2V0J107XHJcbiAgICAgICAgICAgIGlmICghIWVsKSB7IHRoaXMucXVlc3Rpb25CYXNlLmN1c3RvbVdpZGdldC53aWxsVW5tb3VudCh0aGlzLnF1ZXN0aW9uQmFzZSwgZWwpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLmxvY2FsZUNoYW5nZWQucmVtb3ZlKHRoaXMubG9jYWxlQ2hhbmdlZEhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYXNlIHx8ICF0aGlzLmNyZWF0b3IpIHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25CYXNlLnZpc2libGUpIHsgcmV0dXJuIG51bGw7IH1cclxuXHJcbiAgICAgICAgbGV0IGN1c3RvbVdpZGdldCA9IHRoaXMucXVlc3Rpb25CYXNlLmN1c3RvbVdpZGdldDtcclxuXHJcbiAgICAgICAgaWYgKGN1c3RvbVdpZGdldC53aWRnZXRKc29uLmlzRGVmYXVsdFJlbmRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gPGRpdiByZWY9J3dpZGdldCc+e3RoaXMuY3JlYXRvci5jcmVhdGVRdWVzdGlvbkVsZW1lbnQodGhpcy5xdWVzdGlvbkJhc2UpfTwvZGl2PjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3aWRnZXQgPSBudWxsO1xyXG4gICAgICAgIGlmIChjdXN0b21XaWRnZXQud2lkZ2V0SnNvbi5yZW5kZXIpIHtcclxuICAgICAgICAgICAgd2lkZ2V0ID0gY3VzdG9tV2lkZ2V0LndpZGdldEpzb24ucmVuZGVyKHRoaXMucXVlc3Rpb25CYXNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY3VzdG9tV2lkZ2V0Lmh0bWxUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0bWxWYWx1ZSA9IHsgX19odG1sOiBjdXN0b21XaWRnZXQuaHRtbFRlbXBsYXRlIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiByZWY9J3dpZGdldCcgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e2h0bWxWYWx1ZX0+PC9kaXY+O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8ZGl2IHJlZj0nd2lkZ2V0Jz57d2lkZ2V0fTwvZGl2PjtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVhY3QvY3VzdG9tLXdpZGdldC50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi9zdXJ2ZXlcIjtcclxuaW1wb3J0IHtTdXJ2ZXlOYXZpZ2F0aW9uQmFzZX0gZnJvbSBcIi4vcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleU5hdmlnYXRpb24gZXh0ZW5kcyBTdXJ2ZXlOYXZpZ2F0aW9uQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlUHJldkNsaWNrID0gdGhpcy5oYW5kbGVQcmV2Q2xpY2suYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU5leHRDbGljayA9IHRoaXMuaGFuZGxlTmV4dENsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVDb21wbGV0ZUNsaWNrID0gdGhpcy5oYW5kbGVDb21wbGV0ZUNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVQcmV2Q2xpY2soZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN1cnZleS5wcmV2UGFnZSgpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlTmV4dENsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkubmV4dFBhZ2UoKTtcclxuICAgIH1cclxuICAgIGhhbmRsZUNvbXBsZXRlQ2xpY2soZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN1cnZleS5jb21wbGV0ZUxhc3RQYWdlKCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5zdXJ2ZXkgfHwgIXRoaXMuc3VydmV5LmlzTmF2aWdhdGlvbkJ1dHRvbnNTaG93aW5nKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcHJldkJ1dHRvbiA9ICF0aGlzLnN1cnZleS5pc0ZpcnN0UGFnZSA/IHRoaXMucmVuZGVyQnV0dG9uKHRoaXMuaGFuZGxlUHJldkNsaWNrLCB0aGlzLnN1cnZleS5wYWdlUHJldlRleHQsIHRoaXMuY3NzLm5hdmlnYXRpb24ucHJldikgOiBudWxsO1xyXG4gICAgICAgIHZhciBuZXh0QnV0dG9uID0gIXRoaXMuc3VydmV5LmlzTGFzdFBhZ2UgPyB0aGlzLnJlbmRlckJ1dHRvbih0aGlzLmhhbmRsZU5leHRDbGljaywgdGhpcy5zdXJ2ZXkucGFnZU5leHRUZXh0LCB0aGlzLmNzcy5uYXZpZ2F0aW9uLm5leHQpIDogbnVsbDtcclxuICAgICAgICB2YXIgY29tcGxldGVCdXR0b24gPSB0aGlzLnN1cnZleS5pc0xhc3RQYWdlICYmIHRoaXMuc3VydmV5LmlzRWRpdE1vZGUgPyB0aGlzLnJlbmRlckJ1dHRvbih0aGlzLmhhbmRsZUNvbXBsZXRlQ2xpY2ssIHRoaXMuc3VydmV5LmNvbXBsZXRlVGV4dCwgdGhpcy5jc3MubmF2aWdhdGlvbi5jb21wbGV0ZSkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5mb290ZXJ9PlxyXG4gICAgICAgICAgICAgICAge3ByZXZCdXR0b259XHJcbiAgICAgICAgICAgICAgICB7bmV4dEJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIHtjb21wbGV0ZUJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQnV0dG9uKGNsaWNrOiBhbnksIHRleHQ6IHN0cmluZywgYnRuQ2xhc3NOYW1lOiBzdHJpbmcpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0geyBtYXJnaW5SaWdodDogXCI1cHhcIiB9O1xyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLmNzcy5uYXZpZ2F0aW9uQnV0dG9uICsgKGJ0bkNsYXNzTmFtZSA/ICcgJyArIGJ0bkNsYXNzTmFtZSA6IFwiXCIpO1xyXG4gICAgICAgIHJldHVybiA8aW5wdXQgY2xhc3NOYW1lPXtjbGFzc05hbWV9IHN0eWxlPXtzdHlsZX0gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e2NsaWNrfSB2YWx1ZT17dGV4dH0gLz47XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbi50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi9zdXJ2ZXlcIjtcclxuaW1wb3J0IHtTdXJ2ZXlOYXZpZ2F0aW9uQmFzZX0gZnJvbSBcIi4vcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uQmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVByb2dyZXNzIGV4dGVuZHMgU3VydmV5TmF2aWdhdGlvbkJhc2Uge1xyXG4gICAgcHJvdGVjdGVkIGlzVG9wOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmlzVG9wID0gcHJvcHMuaXNUb3A7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaXNUb3AgPSBuZXh0UHJvcHMuaXNUb3A7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2dyZXNzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLnN1cnZleS5nZXRQcm9ncmVzcygpOyB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHByb2dyZXNzVGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdXJ2ZXkucHJvZ3Jlc3NUZXh0OyB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHRoaXMuaXNUb3AgPyB7IHdpZHRoOiBcIjYwJVwiIH0gOiB7IHdpZHRoOiBcIjYwJVwiLCBtYXJnaW5Ub3A6IFwiMTBweFwiIH07XHJcbiAgICAgICAgdmFyIHByb2dyZXNzU3R5bGUgPSB7IHdpZHRoOiB0aGlzLnByb2dyZXNzICsgXCIlXCIgfTtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5wcm9ncmVzc30gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17cHJvZ3Jlc3NTdHlsZX0gY2xhc3NOYW1lPXt0aGlzLmNzcy5wcm9ncmVzc0Jhcn0gcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCI+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj57dGhpcy5wcm9ncmVzc1RleHR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5UHJvZ3Jlc3MudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleX0gZnJvbSBcIi4vcmVhY3RTdXJ2ZXlcIjtcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3N1cnZleVwiO1xyXG5pbXBvcnQge1N1cnZleUVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVdpbmRvdyBleHRlbmRzIFN1cnZleSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25FeHBhbmRlZCA9IHRoaXMuaGFuZGxlT25FeHBhbmRlZC5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25FeHBhbmRlZChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuZXhwYW5kZWQgPSAhdGhpcy5zdGF0ZS5leHBhbmRlZDtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc3RhdGUpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5oaWRkZW4pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBoZWFkZXIgPSB0aGlzLnJlbmRlckhlYWRlcigpO1xyXG4gICAgICAgIHZhciBib2R5ID0gdGhpcy5zdGF0ZS5leHBhbmRlZCA/IHRoaXMucmVuZGVyQm9keSgpIDogbnVsbDtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IHBvc2l0aW9uOiBcImZpeGVkXCIsIGJvdHRvbTogXCIzcHhcIiwgcmlnaHQ6IFwiMTBweFwiIH07XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy53aW5kb3cucm9vdH0gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgICAgICAge2hlYWRlcn1cclxuICAgICAgICAgICAge2JvZHl9XHJcbiAgICAgICAgICAgIDwvZGl2PjtcclxuXHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySGVhZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGVBID0geyB3aWR0aDogXCIxMDAlXCIgfTtcclxuICAgICAgICB2YXIgc3R5bGVUaXRsZSA9IHsgcGFkZGluZ1JpZ2h0OiBcIjEwcHhcIiB9O1xyXG4gICAgICAgIHZhciBnbHlwaENsYXNzTmFtZSA9IHRoaXMuc3RhdGUuZXhwYW5kZWQgPyB0aGlzLmNzcy53aW5kb3cuaGVhZGVyLmJ1dHRvbkNvbGxhcHNlZCA6IHRoaXMuY3NzLndpbmRvdy5oZWFkZXIuYnV0dG9uRXhwYW5kZWQ7XHJcbiAgICAgICAgZ2x5cGhDbGFzc05hbWUgPSBcImdseXBoaWNvbiBwdWxsLXJpZ2h0IFwiICsgZ2x5cGhDbGFzc05hbWU7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gU3VydmV5RWxlbWVudEJhc2UucmVuZGVyTG9jU3RyaW5nKHRoaXMuc3VydmV5LmxvY1RpdGxlKTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLndpbmRvdy5oZWFkZXIucm9vdH0+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17dGhpcy5oYW5kbGVPbkV4cGFuZGVkfSBzdHlsZT17c3R5bGVBfT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17dGhpcy5jc3Mud2luZG93LmhlYWRlci50aXRsZX0gc3R5bGU9e3N0eWxlVGl0bGV9Pnt0aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2dseXBoQ2xhc3NOYW1lfSBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQm9keSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy53aW5kb3cuYm9keX0+XHJcbiAgICAgICAge3RoaXMucmVuZGVyU3VydmV5KCkgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTdXJ2ZXkobmV3UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZVN1cnZleShuZXdQcm9wcyk7XHJcbiAgICAgICAgdmFyIGhhc0V4cGFuZGVkID0gbmV3UHJvcHNbXCJleHBhbmRlZFwiXSA/IG5ld1Byb3BzLmV4cGFuZGVkIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZXhwYW5kZWQ6IGhhc0V4cGFuZGVkLCBoaWRkZW46IGZhbHNlIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKGZ1bmN0aW9uIChzOiBTdXJ2ZXlNb2RlbCkge1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLmhpZGRlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5V2luZG93LnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbn0gZnJvbSAnLi9yZWFjdHF1ZXN0aW9uJ1xyXG5pbXBvcnQge1BhZ2VNb2RlbH0gZnJvbSBcIi4uL3BhZ2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3N1cnZleVwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlDcmVhdG9yfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25Sb3dNb2RlbCwgUGFuZWxNb2RlbH0gZnJvbSBcIi4uL3BhbmVsXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UGFnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBwYWdlOiBQYWdlTW9kZWw7XHJcbiAgICBwcml2YXRlIHN1cnZleTogU3VydmV5TW9kZWw7XHJcbiAgICBwcml2YXRlIGNyZWF0b3I6IElTdXJ2ZXlDcmVhdG9yO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnBhZ2UgPSBwcm9wcy5wYWdlO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gbmV4dFByb3BzLnBhZ2U7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXh0UHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHZhciBlbCA9IHRoaXMucmVmc1tcInJvb3RcIl07XHJcbiAgICAgICAgaWYgKGVsICYmIHRoaXMuc3VydmV5KSB0aGlzLnN1cnZleS5hZnRlclJlbmRlclBhZ2UoZWwpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5wYWdlID09IG51bGwgfHwgdGhpcy5zdXJ2ZXkgPT0gbnVsbCB8fCB0aGlzLmNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5yZW5kZXJUaXRsZSgpO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uUm93cyA9IHRoaXMucGFnZS5yb3dzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25Sb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJvd3MucHVzaCh0aGlzLmNyZWF0ZVJvdyhxdWVzdGlvblJvd3NbaV0sIGkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiByZWY9XCJyb290XCI+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGV9XHJcbiAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUm93KHJvdzogUXVlc3Rpb25Sb3dNb2RlbCwgaW5kZXg6IG51bWJlcik6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgcm93TmFtZSA9IFwicm93XCIgKyAoaW5kZXggKyAxKTtcclxuICAgICAgICByZXR1cm4gPFN1cnZleVJvdyBrZXk9e3Jvd05hbWV9IHJvdz17cm93fSBzdXJ2ZXk9e3RoaXMuc3VydmV5fSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IGNzcz17dGhpcy5jc3N9IC8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclRpdGxlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucGFnZS50aXRsZSB8fCAhdGhpcy5zdXJ2ZXkuc2hvd1BhZ2VUaXRsZXMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0ZXh0ID0gU3VydmV5RWxlbWVudEJhc2UucmVuZGVyTG9jU3RyaW5nKHRoaXMucGFnZS5sb2NUaXRsZSk7XHJcbiAgICAgICAgcmV0dXJuICg8aDQgY2xhc3NOYW1lPXt0aGlzLmNzcy5wYWdlVGl0bGV9Pnt0ZXh0fTwvaDQ+KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHBhbmVsOiBQYW5lbE1vZGVsO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXk6IFN1cnZleU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wYW5lbCA9IHByb3BzLnBhbmVsO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5wYW5lbCA9IG5leHRQcm9wcy5wYW5lbDtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IG5leHRQcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5yZWZzW1wicm9vdFwiXTtcclxuICAgICAgICBpZiAoZWwgJiYgdGhpcy5zdXJ2ZXkpIHRoaXMuc3VydmV5LmFmdGVyUmVuZGVyUGFnZShlbCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhbmVsID09IG51bGwgfHwgdGhpcy5zdXJ2ZXkgPT0gbnVsbCB8fCB0aGlzLmNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5yZW5kZXJUaXRsZSgpO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uUm93cyA9IHRoaXMucGFuZWwucm93cztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9uUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByb3dzLnB1c2godGhpcy5jcmVhdGVSb3cocXVlc3Rpb25Sb3dzW2ldLCBpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHlsZSA9IHsgXCJtYXJnaW5MZWZ0XCI6IHRoaXMucGFuZWwuaW5uZXJJbmRlbnQgKiB0aGlzLmNzcy5xdWVzdGlvbi5pbmRlbnQgKyAncHgnIH07XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiByZWY9XCJyb290XCI+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGV9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVSb3cocm93OiBRdWVzdGlvblJvd01vZGVsLCBpbmRleDogbnVtYmVyKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciByb3dOYW1lID0gXCJyb3dcIiArIChpbmRleCArIDEpO1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5Um93IGtleT17cm93TmFtZX0gcm93PXtyb3d9IHN1cnZleT17dGhpcy5zdXJ2ZXl9IGNyZWF0b3I9e3RoaXMuY3JlYXRvcn0gY3NzPXt0aGlzLmNzc30gLz47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyVGl0bGUoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5wYW5lbC50aXRsZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRleHQgPSBTdXJ2ZXlFbGVtZW50QmFzZS5yZW5kZXJMb2NTdHJpbmcodGhpcy5wYW5lbC5sb2NUaXRsZSk7XHJcbiAgICAgICAgcmV0dXJuICg8aDQgY2xhc3NOYW1lPXt0aGlzLmNzcy5wYWdlVGl0bGV9Pnt0ZXh0fTwvaDQ+KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVJvdyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSByb3c6IFF1ZXN0aW9uUm93TW9kZWw7XHJcbiAgICBwcml2YXRlIHN1cnZleTogU3VydmV5TW9kZWw7XHJcbiAgICBwcml2YXRlIGNyZWF0b3I6IElTdXJ2ZXlDcmVhdG9yO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhuZXh0UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQcm9wZXJ0aWVzKHByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnJvdyA9IHByb3BzLnJvdztcclxuICAgICAgICBpZiAodGhpcy5yb3cpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnJvdy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNldFN0YXRlKHsgdmlzaWJsZTogc2VsZi5yb3cudmlzaWJsZSB9KTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5yb3cgPT0gbnVsbCB8fCB0aGlzLnN1cnZleSA9PSBudWxsIHx8IHRoaXMuY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5yb3cudmlzaWJsZSkge1xyXG4gICAgICAgICAgICBxdWVzdGlvbnMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvdy5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHF1ZXN0aW9uID0gdGhpcy5yb3cuZWxlbWVudHNbaV0gYXMgUXVlc3Rpb25CYXNlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2godGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzdHlsZSA9IHRoaXMucm93LnZpc2libGUgPyAge30gOiB7IGRpc3BsYXk6IFwibm9uZVwiIH07XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnJvd30gc3R5bGU9e3N0eWxlfT5cclxuICAgICAgICAgICAgICAgIHtxdWVzdGlvbnN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAocXVlc3Rpb24uaXNQYW5lbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gPFN1cnZleVBhbmVsIGtleT17cXVlc3Rpb24ubmFtZX0gcGFuZWw9e3F1ZXN0aW9ufSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IHN1cnZleT17dGhpcy5zdXJ2ZXl9IGNzcz17dGhpcy5jc3N9IC8+O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiA8U3VydmV5UXVlc3Rpb24ga2V5PXtxdWVzdGlvbi5uYW1lfSBxdWVzdGlvbj17cXVlc3Rpb259IGNyZWF0b3I9e3RoaXMuY3JlYXRvcn0gY3NzPXt0aGlzLmNzc30gLz47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFjdC9yZWFjdHBhZ2UudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSAnLi4vcXVlc3Rpb24nO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gJy4vcmVhY3RxdWVzdGlvbmNvbW1lbnQnO1xyXG5pbXBvcnQge1N1cnZleUVsZW1lbnRCYXNlfSBmcm9tICcuL3JlYWN0cXVlc3Rpb25lbGVtZW50JztcclxuaW1wb3J0IHtTdXJ2ZXlDdXN0b21XaWRnZXR9IGZyb20gJy4vY3VzdG9tLXdpZGdldCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXlDcmVhdG9yIHtcclxuICAgIGNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogSlNYLkVsZW1lbnQ7XHJcbiAgICByZW5kZXJFcnJvcihrZXk6IHN0cmluZywgZXJyb3JUZXh0OiBzdHJpbmcpOiBKU1guRWxlbWVudDtcclxuICAgIHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbkJhc2U6IFF1ZXN0aW9uQmFzZTtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbjogUXVlc3Rpb247XHJcbiAgICBwcml2YXRlIGNyZWF0b3I6IElTdXJ2ZXlDcmVhdG9yO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXN0aW9uKHByb3BzLnF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnNldFF1ZXN0aW9uKG5leHRQcm9wcy5xdWVzdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFF1ZXN0aW9uKHF1ZXN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UgPSBxdWVzdGlvbjtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcXVlc3Rpb24gaW5zdGFuY2VvZiBRdWVzdGlvbiA/IHF1ZXN0aW9uIDogbnVsbDtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnF1ZXN0aW9uID8gdGhpcy5xdWVzdGlvbi52YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdmlzaWJsZTogdGhpcy5xdWVzdGlvbkJhc2UudmlzaWJsZSwgdmFsdWU6IHZhbHVlLCBlcnJvcjogMCwgcmVuZGVyV2lkdGg6IDAsXHJcbiAgICAgICAgICAgIHZpc2libGVJbmRleFZhbHVlOiAtMSwgaXNSZWFkT25seSA6IHRoaXMucXVlc3Rpb25CYXNlLmlzUmVhZE9ubHlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2VbXCJyZWFjdFwiXSA9IHNlbGY7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdGF0ZS5yZW5kZXJXaWR0aCA9IHNlbGYuc3RhdGUucmVuZGVyV2lkdGggKyAxO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZS52aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3RhdGUudmlzaWJsZUluZGV4VmFsdWUgPSBzZWxmLnF1ZXN0aW9uQmFzZS52aXNpYmxlSW5kZXg7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnJlYWRPbmx5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLmlzUmVhZE9ubHkgPSBzZWxmLnF1ZXN0aW9uQmFzZS5pc1JlYWRPbmx5O1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZWwgPSB0aGlzLnJlZnNbXCJyb290XCJdO1xyXG4gICAgICAgICAgICBpZiAoZWwgJiYgdGhpcy5xdWVzdGlvbkJhc2Uuc3VydmV5KSB0aGlzLnF1ZXN0aW9uQmFzZS5zdXJ2ZXkuYWZ0ZXJSZW5kZXJRdWVzdGlvbih0aGlzLnF1ZXN0aW9uQmFzZSwgZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xyXG4gICAgICAgIHZhciBlbCA9IHRoaXMucmVmc1tcInJvb3RcIl07XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlW1wicmVhY3RcIl0gPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZS5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnJlYWRPbmx5Q2hhbmdlZENhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbkJhc2UgfHwgIXRoaXMuY3JlYXRvcikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uQmFzZS52aXNpYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcXVlc3Rpb25SZW5kZXIgPSB0aGlzLnJlbmRlclF1ZXN0aW9uKCk7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5xdWVzdGlvbkJhc2UuaGFzVGl0bGUgPyB0aGlzLnJlbmRlclRpdGxlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciB0aXRsZVRvcCA9IHRoaXMuY3JlYXRvci5xdWVzdGlvblRpdGxlTG9jYXRpb24oKSA9PSBcInRvcFwiID8gdGl0bGUgOiBudWxsO1xyXG4gICAgICAgIHZhciB0aXRsZUJvdHRvbSA9IHRoaXMuY3JlYXRvci5xdWVzdGlvblRpdGxlTG9jYXRpb24oKSA9PSBcImJvdHRvbVwiID8gdGl0bGUgOiBudWxsO1xyXG4gICAgICAgIHZhciBjb21tZW50ID0gKHRoaXMucXVlc3Rpb24gJiYgdGhpcy5xdWVzdGlvbi5oYXNDb21tZW50KSA/IHRoaXMucmVuZGVyQ29tbWVudCgpIDogbnVsbDtcclxuICAgICAgICB2YXIgZXJyb3JzID0gdGhpcy5yZW5kZXJFcnJvcnMoKTtcclxuICAgICAgICB2YXIgcGFkZGluZ0xlZnQgPSAodGhpcy5xdWVzdGlvbkJhc2UuaW5kZW50ID4gMCkgPyB0aGlzLnF1ZXN0aW9uQmFzZS5pbmRlbnQgKiB0aGlzLmNzcy5xdWVzdGlvbi5pbmRlbnQgKyBcInB4XCIgOiBudWxsO1xyXG4gICAgICAgIHZhciBwYWRkaW5nUmlnaHQgPSAodGhpcy5xdWVzdGlvbkJhc2UucmlnaHRJbmRlbnQgPiAwKSA/IHRoaXMucXVlc3Rpb25CYXNlLnJpZ2h0SW5kZW50ICogdGhpcy5jc3MucXVlc3Rpb24uaW5kZW50ICsgXCJweFwiIDogbnVsbDtcclxuICAgICAgICB2YXIgcm9vdFN0eWxlID0geyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdmVydGljYWxBbGlnbjogJ3RvcCcgfTtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UucmVuZGVyV2lkdGgpIHJvb3RTdHlsZVtcIndpZHRoXCJdID0gdGhpcy5xdWVzdGlvbkJhc2UucmVuZGVyV2lkdGg7XHJcbiAgICAgICAgaWYgKHBhZGRpbmdMZWZ0KSByb290U3R5bGVbXCJwYWRkaW5nTGVmdFwiXSA9IHBhZGRpbmdMZWZ0O1xyXG4gICAgICAgIGlmIChwYWRkaW5nUmlnaHQpIHJvb3RTdHlsZVtcInBhZGRpbmdSaWdodFwiXSA9IHBhZGRpbmdSaWdodDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IHJlZj1cInJvb3RcIiBpZD17dGhpcy5xdWVzdGlvbkJhc2UuaWR9IGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24ucm9vdH0gc3R5bGU9e3Jvb3RTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGVUb3B9XHJcbiAgICAgICAgICAgICAgICB7ZXJyb3JzfVxyXG4gICAgICAgICAgICAgICAge3F1ZXN0aW9uUmVuZGVyfVxyXG4gICAgICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgICAgICB7dGl0bGVCb3R0b219XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUXVlc3Rpb24oKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBjdXN0b21XaWRnZXQgPSB0aGlzLnF1ZXN0aW9uQmFzZS5jdXN0b21XaWRnZXQ7XHJcbiAgICAgICAgaWYgKCFjdXN0b21XaWRnZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRvci5jcmVhdGVRdWVzdGlvbkVsZW1lbnQodGhpcy5xdWVzdGlvbkJhc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPFN1cnZleUN1c3RvbVdpZGdldCBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9uQmFzZX0+PC9TdXJ2ZXlDdXN0b21XaWRnZXQ+XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyVGl0bGUoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciB0aXRsZVRleHQgPSBTdXJ2ZXlFbGVtZW50QmFzZS5yZW5kZXJMb2NTdHJpbmcodGhpcy5xdWVzdGlvbi5sb2NUaXRsZSk7XHJcbiAgICAgICAgcmV0dXJuICg8aDUgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi50aXRsZX0+e3RpdGxlVGV4dH08L2g1Pik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQ29tbWVudCgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnRUZXh0ID0gU3VydmV5RWxlbWVudEJhc2UucmVuZGVyTG9jU3RyaW5nKHRoaXMucXVlc3Rpb24ubG9jQ29tbWVudFRleHQpO1xyXG4gICAgICAgIHJldHVybiAoPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXY+e2NvbW1lbnRUZXh0fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMuY3NzfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckVycm9ycygpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlRdWVzdGlvbkVycm9ycyBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gY3NzPXt0aGlzLmNzc30gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSAvPlxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25FcnJvcnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBxdWVzdGlvbjogUXVlc3Rpb247XHJcbiAgICBwcml2YXRlIGNyZWF0b3I6IElTdXJ2ZXlDcmVhdG9yO1xyXG4gICAgcHJvdGVjdGVkIGNzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFF1ZXN0aW9uKHByb3BzLnF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24obmV4dFByb3BzLnF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFF1ZXN0aW9uKHF1ZXN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHF1ZXN0aW9uIGluc3RhbmNlb2YgUXVlc3Rpb24gPyBxdWVzdGlvbiA6IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uLmVycm9yc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3RhdGUuZXJyb3IgPSBzZWxmLnN0YXRlLmVycm9yICsgMTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZXJyb3I6IDAgfTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uIHx8IHRoaXMucXVlc3Rpb24uZXJyb3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgZXJyb3JzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JUZXh0ID0gdGhpcy5xdWVzdGlvbi5lcnJvcnNbaV0uZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJlcnJvclwiICsgaTtcclxuICAgICAgICAgICAgZXJyb3JzLnB1c2godGhpcy5jcmVhdG9yLnJlbmRlckVycm9yKGtleSwgZXJyb3JUZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmVycm9yLnJvb3R9PntlcnJvcnN9PC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbi50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2UsIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25Db21tZW50TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9jb21tZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uQ29tbWVudCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB8fCAnJyB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkJsdXIgPSB0aGlzLmhhbmRsZU9uQmx1ci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbkNvbW1lbnRNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbkNvbW1lbnRNb2RlbDsgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB8fCAnJyB9O1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQmx1cihldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIHx8ICcnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGlzcGxheU1vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiAoPGRpdiBpZD17dGhpcy5xdWVzdGlvbi5pbnB1dElkfSBjbGFzc05hbWU9e3RoaXMuY3NzfT57dGhpcy5xdWVzdGlvbi52YWx1ZX08L2Rpdj4pXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRleHRhcmVhIGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3N9IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IHBsYWNlaG9sZGVyPXt0aGlzLnF1ZXN0aW9uLnBsYWNlSG9sZGVyfSBvbkJsdXI9e3RoaXMuaGFuZGxlT25CbHVyfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gY29scz17dGhpcy5xdWVzdGlvbi5jb2xzfSByb3dzPXt0aGlzLnF1ZXN0aW9uLnJvd3N9IC8+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gZXh0ZW5kcyBTdXJ2ZXlFbGVtZW50QmFzZSB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBRdWVzdGlvbjtcclxuICAgIHByaXZhdGUgY29tbWVudDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jb21tZW50ID0gdGhpcy5xdWVzdGlvbi5jb21tZW50O1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLmNvbW1lbnQgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25CbHVyID0gdGhpcy5oYW5kbGVPbkJsdXIuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5jb21tZW50ID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5jb21tZW50IH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25CbHVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5jb21tZW50ID0gdGhpcy5jb21tZW50O1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSlcclxuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24uY29tbWVudH0+e3RoaXMuY29tbWVudH08L2Rpdj4pO1xyXG4gICAgICAgIHJldHVybiAoPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi5jb21tZW50fSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9IG9uQmx1cj17dGhpcy5oYW5kbGVPbkJsdXJ9IC8+KTtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNvbW1lbnRcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvbkNvbW1lbnQsIHByb3BzKTtcclxufSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudC50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi9zdXJ2ZXlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFjdFN1cnZleU1vZGVsIGV4dGVuZHMgU3VydmV5TW9kZWwge1xyXG4gICAgcmVuZGVyQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoanNvbk9iaik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlbmRlckNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbWVyZ2VDc3Moc3JjOiBhbnksIGRlc3Q6IGFueSkge1xyXG4gICAgICAgIHRoaXMubWVyZ2VWYWx1ZXMoc3JjLCBkZXN0KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkb0FmdGVyUmVuZGVyU3VydmV5KGVsKSB7XHJcbiAgICAgICAgdGhpcy5hZnRlclJlbmRlclN1cnZleShlbCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9yZWFjdC9yZWFjdHN1cnZleW1vZGVsLnRzeCIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge0Jhc2UsIElTdXJ2ZXksIEhhc2hUYWJsZSwgSVF1ZXN0aW9uLCBJRWxlbWVudCwgSUNvbmRpdGlvblJ1bm5lciwgSVBhZ2UsIFN1cnZleUVycm9yLCBFdmVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlUcmlnZ2VyT3duZXIsIFN1cnZleVRyaWdnZXJ9IGZyb20gXCIuL3RyaWdnZXJcIjtcclxuaW1wb3J0IHtQYWdlTW9kZWx9IGZyb20gXCIuL3BhZ2VcIjtcclxuaW1wb3J0IHtUZXh0UHJlUHJvY2Vzc29yfSBmcm9tIFwiLi90ZXh0UHJlUHJvY2Vzc29yXCI7XHJcbmltcG9ydCB7UHJvY2Vzc1ZhbHVlfSBmcm9tIFwiLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuaW1wb3J0IHtkeFN1cnZleVNlcnZpY2V9IGZyb20gXCIuL2R4U3VydmV5U2VydmljZVwiO1xyXG5pbXBvcnQge0pzb25FcnJvcn0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7Q3VzdG9tV2lkZ2V0Q29sbGVjdGlvbn0gZnJvbSAnLi9xdWVzdGlvbkN1c3RvbVdpZGdldHMnO1xyXG5pbXBvcnQge0lMb2NhbGl6YWJsZU93bmVyLCBMb2NhbGl6YWJsZVN0cmluZ30gZnJvbSBcIi4vbG9jYWxpemFibGVzdHJpbmdcIjtcclxuXHJcbi8qKlxyXG4gKiBTdXJ2ZXkgb2JqZWN0IGNvbnRhaW5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzdXJ2ZXkuIFBhZ2VzLCBRdWVzdGlvbnMsIGZsb3cgbG9naWMgYW5kIGV0Yy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlNb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJU3VydmV5LCBJU3VydmV5VHJpZ2dlck93bmVyLCBJTG9jYWxpemFibGVPd25lciB7XHJcbiAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGNsaWVudElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBJZiB0aGUgcHJvcGVydHkgaXMgbm90IGVtcHR5LCBiZWZvcmUgc3RhcnRpbmcgdG8gcnVuIHRoZSBzdXJ2ZXksIHRoZSBsaWJyYXJ5IGNoZWNrZXMgaWYgdGhlIGNvb2tpZSB3aXRoIHRoaXMgbmFtZSBleGlzdHMuIElmIGl0IGlzIHRydWUsIHRoZSBzdXJ2ZXkgZ29lcyB0byBjb21wbGV0ZSBtb2RlIGFuZCBhbiB1c2VyIHNlZXMgdGhlICdUaGFuayB5b3UnIHBhZ2UuIE9uIGNvbXBsZXRpbmcgdGhlIHN1cnZleSB0aGUgY29va2llIHdpdGggdGhpcyBuYW1lIGlzIGNyZWF0ZWQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb29raWVOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIHNlbmRSZXN1bHRPblBhZ2VOZXh0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIFlvdSBtYXkgc2hvdyBjb21tZW50cyBpbnB1dCBmb3IgdGhlIG1vc3Qgb2YgcXVlc3Rpb25zLiBUaGUgZW50ZXJlZCB0ZXh0IGluIHRoZSBjb21tZW50IGlucHV0IHdpbGwgYmUgc2F2ZWQgYXMgJ3F1ZXN0aW9uIG5hbWUnICsgJ2NvbW1lbnRQcmVmaXgnLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29tbWVudFByZWZpeDogc3RyaW5nID0gXCItQ29tbWVudFwiO1xyXG4gICAgLyoqXHJcbiAgICAgKiBPbiBzaG93aW5nIHRoZSBuZXh0IG9yIHByZXZpb3VzIHBhZ2UsIGEgZmlyc3QgaW5wdXQgaXMgZm9jdXNlZCwgaWYgdGhlIHByb3BlcnR5IHNldCB0byB0cnVlLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZm9jdXNGaXJzdFF1ZXN0aW9uQXV0b21hdGljOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8qKlxyXG4gICAgICogU2V0IGl0IHRvIGZhbHNlIHRvIGhpZGUgJ1ByZXYnLCAnTmV4dCcgYW5kICdDb21wbGV0ZScgYnV0dG9ucy4gSXQgbWFrZXMgc2Vuc2UgaWYgeW91IGFyZSBnb2luZyB0byBjcmVhdGUgYSBjdXN0b20gbmF2aWdhdGlvbiBvciBoYXZlIGp1c3Qgb25lIHBhZ2Ugb3Igb24gc2V0dGluZyBnb05leHRQYWdlQXV0b21hdGljIHByb3BlcnR5LlxyXG4gICAgICogQHNlZSBnb05leHRQYWdlQXV0b21hdGljXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93TmF2aWdhdGlvbkJ1dHRvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgaXQgdG8gZmFsc2UgaGlkZSBzdXJ2ZXkgdGl0bGUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzaG93VGl0bGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgaXQgdG8gZmFsc2UgdG8gaGlkZSBwYWdlIHRpdGxlcy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8qKlxyXG4gICAgICogT24gZmluaXNoaW5nIHRoZSBzdXJ2ZXkgdGhlICdUaGFuayB5b3UnLCBwYWdlIG9uIGNvbXBsZXRlLCBpcyBzaG93bi4gU2V0IHRoZSBwcm9wZXJ0eSB0byBmYWxzZSwgdG8gaGlkZSB0aGUgJ1RoYW5rIHlvdScgcGFnZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNob3dDb21wbGV0ZWRQYWdlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIC8qKlxyXG4gICAgICogQSBjaGFyL3N0cmluZyB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgaW4gdGhlIHRpdGxlIHJlcXVpcmVkIHF1ZXN0aW9ucy5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlcXVpcmVkVGV4dDogc3RyaW5nID0gXCIqXCI7XHJcbiAgICAvKipcclxuICAgICAqIEJ5IGRlZmF1bHQgdGhlIGZpcnN0IHF1ZXN0aW9uIGluZGV4IGlzIDEuIFlvdSBtYXkgc3RhcnQgaXQgZnJvbSAxMDAgb3IgZnJvbSAnQScsIGJ5IHNldHRpbmcgMTAwIG9yICdBJyB0byB0aGlzIHByb3BlcnR5LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBzaG93UHJvZ3Jlc3NCYXJWYWx1ZTogc3RyaW5nID0gXCJvZmZcIjtcclxuICAgIHB1YmxpYyBzdG9yZU90aGVyc0FzQ29tbWVudDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZ29OZXh0UGFnZUF1dG9tYXRpYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBhZ2VzOiBBcnJheTxQYWdlTW9kZWw+ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgIHB1YmxpYyB0cmlnZ2VyczogQXJyYXk8U3VydmV5VHJpZ2dlcj4gPSBuZXcgQXJyYXk8U3VydmV5VHJpZ2dlcj4oKTtcclxuICAgIHB1YmxpYyBjbGVhckludmlzaWJsZVZhbHVlczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHByaXZhdGUgbG9jVGl0bGVWYWx1ZSA6IExvY2FsaXphYmxlU3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBsb2NDb21wbGV0ZWRIdG1sVmFsdWUgOiBMb2NhbGl6YWJsZVN0cmluZztcclxuICAgIHByaXZhdGUgbG9jUGFnZVByZXZUZXh0VmFsdWUgOiBMb2NhbGl6YWJsZVN0cmluZztcclxuICAgIHByaXZhdGUgbG9jUGFnZU5leHRUZXh0VmFsdWUgOiBMb2NhbGl6YWJsZVN0cmluZztcclxuICAgIHByaXZhdGUgbG9jQ29tcGxldGVUZXh0VmFsdWUgOiBMb2NhbGl6YWJsZVN0cmluZztcclxuICAgIHByaXZhdGUgbG9jUXVlc3Rpb25UaXRsZVRlbXBsYXRlVmFsdWU6IExvY2FsaXphYmxlU3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudFBhZ2VWYWx1ZTogUGFnZU1vZGVsID0gbnVsbDtcclxuICAgIHByaXZhdGUgdmFsdWVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgdmFyaWFibGVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgcGFnZVByZXZUZXh0VmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcGFnZU5leHRUZXh0VmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgY29tcGxldGVUZXh0VmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgc2hvd1BhZ2VOdW1iZXJzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOiBzdHJpbmcgPSBcIm9uXCI7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlOiBzdHJpbmcgPSBcInRvcFwiO1xyXG4gICAgcHJpdmF0ZSBsb2NhbGVWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgaXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHByb2Nlc3NlZFRleHRWYWx1ZXM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcbiAgICBwcml2YXRlIGlzVmFsaWRhdGluZ09uU2VydmVyVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbW9kZVZhbHVlOiBzdHJpbmcgPSBcImVkaXRcIjtcclxuICAgIHByaXZhdGUgaXNEZXNpZ25Nb2RlVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgb25Db21wbGV0ZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25QYXJ0aWFsU2VuZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25DdXJyZW50UGFnZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uVmlzaWJsZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblBhZ2VWaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uUXVlc3Rpb25BZGRlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uUXVlc3Rpb25SZW1vdmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25QYW5lbEFkZGVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25QYW5lbFJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblZhbGlkYXRlUXVlc3Rpb246IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblNlcnZlclZhbGlkYXRlUXVlc3Rpb25zOiAoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnk7XHJcbiAgICBwdWJsaWMgb25Qcm9jZXNzSHRtbDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uVGV4dE1hcmtkb3duOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25HZXRSZXN1bHQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblVwbG9hZEZpbGU6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvbkFmdGVyUmVuZGVyU3VydmV5OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25BZnRlclJlbmRlclBhZ2U6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvbkFmdGVyUmVuZGVyUXVlc3Rpb246IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvbkFmdGVyUmVuZGVyUGFuZWw6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvbk1hdHJpeFJvd0FkZGVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMganNvbkVycm9yczogQXJyYXk8SnNvbkVycm9yPiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMubG9jVGl0bGVWYWx1ZSA9IG5ldyBMb2NhbGl6YWJsZVN0cmluZyh0aGlzLCB0cnVlKTtcclxuICAgICAgICB0aGlzLmxvY1RpdGxlVmFsdWUub25SZW5kZXJlZEh0bWxDYWxsYmFjayA9IGZ1bmN0aW9uKHRleHQpIHsgcmV0dXJuIHNlbGYucHJvY2Vzc2VkVGl0bGU7IH07XHJcbiAgICAgICAgdGhpcy5sb2NDb21wbGV0ZWRIdG1sVmFsdWUgPSBuZXcgTG9jYWxpemFibGVTdHJpbmcodGhpcyk7XHJcbiAgICAgICAgdGhpcy5sb2NQYWdlUHJldlRleHRWYWx1ZSA9IG5ldyBMb2NhbGl6YWJsZVN0cmluZyh0aGlzKTtcclxuICAgICAgICB0aGlzLmxvY1BhZ2VOZXh0VGV4dFZhbHVlID0gbmV3IExvY2FsaXphYmxlU3RyaW5nKHRoaXMpO1xyXG4gICAgICAgIHRoaXMubG9jQ29tcGxldGVUZXh0VmFsdWUgPSBuZXcgTG9jYWxpemFibGVTdHJpbmcodGhpcyk7XHJcbiAgICAgICAgdGhpcy5sb2NRdWVzdGlvblRpdGxlVGVtcGxhdGVWYWx1ZSA9IG5ldyBMb2NhbGl6YWJsZVN0cmluZyh0aGlzLCB0cnVlKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yID0gbmV3IFRleHRQcmVQcm9jZXNzb3IoKTtcclxuICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25IYXNWYWx1ZSA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuaGFzUHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWUpOyB9O1xyXG4gICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdmFsdWUuZGF0YSA9IHNlbGY7XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5zZXRPd25lcihzZWxmKTtcclxuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5vbkJlZm9yZUNyZWF0aW5nKCk7XHJcbiAgICAgICAgaWYgKGpzb25PYmopIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRKc29uT2JqZWN0KGpzb25PYmopO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3VydmV5RnJvbVNlcnZpY2UodGhpcy5zdXJ2ZXlJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdXJ2ZXlcIjsgfVxyXG4gICAgcHVibGljIGdldCBsb2NhbGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jYWxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbG9jYWxlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmxvY2FsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgc3VydmV5TG9jYWxpemF0aW9uLmN1cnJlbnRMb2NhbGUgPSB2YWx1ZTtcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5vbkxvY2FsZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL0lMb2NhbGl6YWJsZU93bmVyXHJcbiAgICBwdWJsaWMgZ2V0TG9jYWxlKCkgeyByZXR1cm4gdGhpcy5sb2NhbGU7IH1cclxuICAgIHB1YmxpYyBnZXRNYXJrZG93bkh0bWwodGV4dDogc3RyaW5nKSAge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0ge3RleHQ6IHRleHQsIGh0bWw6IG51bGx9XHJcbiAgICAgICAgdGhpcy5vblRleHRNYXJrZG93bi5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zLmh0bWw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TG9jU3RyaW5nKHN0cjogc3RyaW5nKSB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKHN0cik7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGVtcHR5U3VydmV5VGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJlbXB0eVN1cnZleVwiKTsgfVxyXG4gICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NUaXRsZS50ZXh0OyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5sb2NUaXRsZS50ZXh0ID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgbG9jVGl0bGUoKTogTG9jYWxpemFibGVTdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NUaXRsZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlZEh0bWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jQ29tcGxldGVkSHRtbC50ZXh0O31cclxuICAgIHB1YmxpYyBzZXQgY29tcGxldGVkSHRtbCh2YWx1ZTogc3RyaW5nKSB7IHRoaXMubG9jQ29tcGxldGVkSHRtbC50ZXh0ID0gdmFsdWU7fVxyXG4gICAgcHVibGljIGdldCBsb2NDb21wbGV0ZWRIdG1sKCk6IExvY2FsaXphYmxlU3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jQ29tcGxldGVkSHRtbFZhbHVlO31cclxuICAgIHB1YmxpYyBnZXQgcGFnZVByZXZUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvY1BhZ2VQcmV2VGV4dC50ZXh0ID8gdGhpcy5sb2NQYWdlUHJldlRleHQudGV4dCA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwicGFnZVByZXZUZXh0XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IHBhZ2VQcmV2VGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMubG9jUGFnZVByZXZUZXh0LnRleHQgPSBuZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBsb2NQYWdlUHJldlRleHQoKTogTG9jYWxpemFibGVTdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NQYWdlUHJldlRleHRWYWx1ZTt9XHJcbiAgICBwdWJsaWMgZ2V0IHBhZ2VOZXh0VGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NQYWdlTmV4dFRleHQudGV4dCA/IHRoaXMubG9jUGFnZU5leHRUZXh0LnRleHQgOiB0aGlzLmdldExvY1N0cmluZyhcInBhZ2VOZXh0VGV4dFwiKTsgfVxyXG4gICAgcHVibGljIHNldCBwYWdlTmV4dFRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLmxvY1BhZ2VOZXh0VGV4dC50ZXh0ID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgbG9jUGFnZU5leHRUZXh0KCk6IExvY2FsaXphYmxlU3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jUGFnZU5leHRUZXh0VmFsdWU7fVxyXG4gICAgcHVibGljIGdldCBjb21wbGV0ZVRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jQ29tcGxldGVUZXh0LnRleHQgPyB0aGlzLmxvY0NvbXBsZXRlVGV4dC50ZXh0IDogdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0ZVRleHRcIik7IH1cclxuICAgIHB1YmxpYyBzZXQgY29tcGxldGVUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5sb2NDb21wbGV0ZVRleHQudGV4dCA9IG5ld1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGxvY0NvbXBsZXRlVGV4dCgpOiBMb2NhbGl6YWJsZVN0cmluZyB7IHJldHVybiB0aGlzLmxvY0NvbXBsZXRlVGV4dFZhbHVlO31cclxuICAgIHB1YmxpYyBnZXQgcXVlc3Rpb25UaXRsZVRlbXBsYXRlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvY1F1ZXN0aW9uVGl0bGVUZW1wbGF0ZS50ZXh0O31cclxuICAgIHB1YmxpYyBzZXQgcXVlc3Rpb25UaXRsZVRlbXBsYXRlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5sb2NRdWVzdGlvblRpdGxlVGVtcGxhdGUudGV4dCA9IHZhbHVlO31cclxuICAgIHB1YmxpYyBnZXRRdWVzdGlvblRpdGxlVGVtcGxhdGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jUXVlc3Rpb25UaXRsZVRlbXBsYXRlLnRleHRPckh0bWw7IH1cclxuICAgIHB1YmxpYyBnZXQgbG9jUXVlc3Rpb25UaXRsZVRlbXBsYXRlKCk6IExvY2FsaXphYmxlU3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jUXVlc3Rpb25UaXRsZVRlbXBsYXRlVmFsdWU7IH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNob3dQYWdlTnVtYmVycygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd1BhZ2VOdW1iZXJzKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnNob3dQYWdlTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dRdWVzdGlvbk51bWJlcnMoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOyB9O1xyXG4gICAgcHVibGljIHNldCBzaG93UXVlc3Rpb25OdW1iZXJzKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgdmFsdWUgPSAodmFsdWUgPT09IFwib25wYWdlXCIpID8gXCJvblBhZ2VcIiA6IHZhbHVlO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9O1xyXG4gICAgcHVibGljIGdldCBzaG93UHJvZ3Jlc3NCYXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc2hvd1Byb2dyZXNzQmFyVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd1Byb2dyZXNzQmFyKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5zaG93UHJvZ3Jlc3NCYXJWYWx1ZSA9IG5ld1ZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5wcm9jZXNzVGV4dCh0aGlzLmxvY1RpdGxlLnRleHRPckh0bWwpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTsgfTtcclxuICAgIHB1YmxpYyBzZXQgcXVlc3Rpb25UaXRsZUxvY2F0aW9uKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgfTtcclxuICAgIHB1YmxpYyBnZXQgbW9kZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5tb2RlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbW9kZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSB0aGlzLm1vZGUpIHJldHVybjtcclxuICAgICAgICBpZiAodmFsdWUgIT0gXCJlZGl0XCIgJiYgdmFsdWUgIT0gXCJkaXNwbGF5XCIpIHJldHVybjtcclxuICAgICAgICB0aGlzLm1vZGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5vblJlYWRPbmx5Q2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgX3NldERhdGFWYWx1ZShkYXRhOiBhbnksIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXNIYXNoW2tleV0gPSBkYXRhW2tleV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGRhdGEoZGF0YTogYW55KSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXNIYXNoID0ge307XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGFWYWx1ZShkYXRhLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKGtleSwgZGF0YVtrZXldLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1trZXkudG9Mb3dlckNhc2UoKV0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNba2V5LnRvTG93ZXJDYXNlKCldID0gXCJ2YWx1ZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5jb21tZW50UHJlZml4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZU1vZGVsPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEZXNpZ25Nb2RlKSByZXR1cm4gdGhpcy5wYWdlcztcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0uaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhZ2VzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBkZXByaWNhdGVkLCBtaXNzcGVsbGluZywgdXNlIHBhZ2VDb3VudCBwcm9wZXJ0eVxyXG4gICAgICovXHJcbiAgICBnZXQgUGFnZUNvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnBhZ2VDb3VudDsgfVxyXG4gICAgcHVibGljIGdldCBwYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdlBhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2UGFnZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUN1c3RvbVdpZGdldHModmFsdWUpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRQYWdlTm8oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2VObyh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPj0gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzW3ZhbHVlXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBmb2N1c0ZpcnN0UXVlc3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlLmZvY3VzRmlyc3RRdWVzdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcpIHJldHVybiBcImxvYWRpbmdcIjtcclxuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlZCkgcmV0dXJuIFwiY29tcGxldGVkXCI7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnRQYWdlKSA/IFwicnVubmluZ1wiIDogXCJlbXB0eVwiXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xlYXIoY2xlYXJEYXRhOiBib29sZWFuID0gdHJ1ZSwgZ290b0ZpcnN0UGFnZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoY2xlYXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzSGFzaCA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGdvdG9GaXJzdFBhZ2UgJiYgdGhpcy52aXNpYmxlUGFnZUNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy52aXNpYmxlUGFnZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG1lcmdlVmFsdWVzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICBpZiAoIWRlc3QgfHwgIXNyYykgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRlc3Rba2V5XSkgZGVzdFtrZXldID0ge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHZhbHVlLCBkZXN0W2tleV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVzdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlQ3VzdG9tV2lkZ2V0cyhwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICBpZiAoIXBhZ2UpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHBhZ2UucXVlc3Rpb25zW2ldLmN1c3RvbVdpZGdldCA9IEN1c3RvbVdpZGdldENvbGxlY3Rpb24uSW5zdGFuY2UuZ2V0Q3VzdG9tV2lkZ2V0KHBhZ2UucXVlc3Rpb25zW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICB0aGlzLm9uQ3VycmVudFBhZ2VDaGFuZ2VkLmZpcmUodGhpcywgeyAnb2xkQ3VycmVudFBhZ2UnOiBvbGRWYWx1ZSwgJ25ld0N1cnJlbnRQYWdlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gMDtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChpbmRleCAqIDEwMCAvIHRoaXMudmlzaWJsZVBhZ2VDb3VudCkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc05hdmlnYXRpb25CdXR0b25zU2hvd2luZygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2UubmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5ID09IFwic2hvd1wiIHx8XHJcbiAgICAgICAgICAgIChwYWdlLm5hdmlnYXRpb25CdXR0b25zVmlzaWJpbGl0eSAhPSBcImhpZGVcIiAmJiB0aGlzLnNob3dOYXZpZ2F0aW9uQnV0dG9ucyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRWRpdE1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT0gXCJlZGl0XCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwbGF5TW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImRpc3BsYXlcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc0Rlc2lnbk1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRGVzaWduTW9kZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0RGVzaWduTW9kZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNEZXNpZ25Nb2RlVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQ29va2llKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgcmV0dXJuIGNvb2tpZXMgJiYgY29va2llcy5pbmRleE9mKHRoaXMuY29va2llTmFtZSArIFwiPXRydWVcIikgPiAtMTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRDb29raWUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybjtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj10cnVlOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMDowOjAgR01UXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZGVsZXRlQ29va2llKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5jb29raWVOYW1lICsgXCI9O1wiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIG5leHRQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTGFzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5pc0VkaXRNb2RlICYmIHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmRvU2VydmVyVmFsaWRhdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kb05leHRQYWdlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNDdXJyZW50UGFnZUhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnModHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcHJldlBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNGaXJzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNvbXBsZXRlTGFzdFBhZ2UoKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRWRpdE1vZGUgJiYgdGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuZG9TZXJ2ZXJWYWxpZGF0aW9uKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNMYXN0UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgcmV0dXJuIHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IHZQYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGRvQ29tcGxldGUoKSB7XHJcbiAgICAgICAgbGV0IHByZXZpb3VzQ29va2llID0gdGhpcy5oYXNDb29raWU7XHJcbiAgICAgICAgdGhpcy5jbGVhclVudXNlZFZhbHVlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0Q29va2llKCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcclxuICAgICAgICB0aGlzLm9uQ29tcGxldGUuZmlyZSh0aGlzLCBudWxsKTtcclxuICAgICAgICBpZiAoIXByZXZpb3VzQ29va2llICYmIHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNWYWxpZGF0aW5nT25TZXJ2ZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzVmFsaWRhdGluZ09uU2VydmVyVmFsdWU7IH1cclxuICAgIHByaXZhdGUgc2V0SXNWYWxpZGF0aW5nT25TZXJ2ZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLmlzVmFsaWRhdGluZ09uU2VydmVyKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkYXRpbmdPblNlcnZlclZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMub25Jc1ZhbGlkYXRpbmdPblNlcnZlckNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbklzVmFsaWRhdGluZ09uU2VydmVyQ2hhbmdlZCgpIHsgfVxyXG4gICAgcHJvdGVjdGVkIGRvU2VydmVyVmFsaWRhdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgZGF0YToge30sIGVycm9yczoge30sIHN1cnZleTogdGhpcywgY29tcGxldGUgOiBmdW5jdGlvbiAoKSB7IHNlbGYuY29tcGxldGVTZXJ2ZXJWYWxpZGF0aW9uKG9wdGlvbnMpOyB9IH07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRQYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmN1cnJlbnRQYWdlLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbi52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFCYXNlLmlzVmFsdWVFbXB0eSh2YWx1ZSkpIG9wdGlvbnMuZGF0YVtxdWVzdGlvbi5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldElzVmFsaWRhdGluZ09uU2VydmVyKHRydWUpO1xyXG4gICAgICAgIHRoaXMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29tcGxldGVTZXJ2ZXJWYWxpZGF0aW9uKG9wdGlvbnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0SXNWYWxpZGF0aW5nT25TZXJ2ZXIoZmFsc2UpO1xyXG4gICAgICAgIGlmICghb3B0aW9ucyAmJiAhb3B0aW9ucy5zdXJ2ZXkpIHJldHVybjtcclxuICAgICAgICB2YXIgc2VsZiA9IG9wdGlvbnMuc3VydmV5O1xyXG4gICAgICAgIHZhciBoYXNFcnJvcnMgPSBmYWxzZTtcclxuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcnMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBvcHRpb25zLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gc2VsZi5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbiAmJiBxdWVzdGlvbltcImVycm9yc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25bXCJhZGRFcnJvclwiXShuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcnNbbmFtZV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWhhc0Vycm9ycykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc0xhc3RQYWdlKSBzZWxmLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgZWxzZSBzZWxmLmRvTmV4dFBhZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZG9OZXh0UGFnZSgpIHtcclxuICAgICAgICB0aGlzLmNoZWNrT25QYWdlVHJpZ2dlcnMoKTtcclxuICAgICAgICBpZiAodGhpcy5zZW5kUmVzdWx0T25QYWdlTmV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRSZXN1bHQodGhpcy5zdXJ2ZXlQb3N0SWQsIHRoaXMuY2xpZW50SWQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCArIDFdO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldENvbXBsZXRlZCgpIHtcclxuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkQ29tcGxldGVkSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZEh0bWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0bWwodGhpcy5jb21wbGV0ZWRIdG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiPGgzPlwiICsgdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0aW5nU3VydmV5XCIpICsgXCI8L2gzPlwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBwcm9jZXNzZWRMb2FkaW5nSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIjxoMz5cIiArIHRoaXMuZ2V0TG9jU3RyaW5nKFwibG9hZGluZ1N1cnZleVwiKSArIFwiPC9oMz5cIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvZ3Jlc3NUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJwcm9ncmVzc1RleHRcIilbXCJmb3JtYXRcIl0oaW5kZXgsIHZQYWdlcy5sZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGFmdGVyUmVuZGVyU3VydmV5KGh0bWxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5vbkFmdGVyUmVuZGVyU3VydmV5LmZpcmUodGhpcywgeyBzdXJ2ZXk6IHRoaXMsIGh0bWxFbGVtZW50OiBodG1sRWxlbWVudCB9KTtcclxuICAgIH1cclxuICAgIGFmdGVyUmVuZGVyUGFnZShodG1sRWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uQWZ0ZXJSZW5kZXJQYWdlLmlzRW1wdHkpIHJldHVybjtcclxuICAgICAgICB0aGlzLm9uQWZ0ZXJSZW5kZXJQYWdlLmZpcmUodGhpcywgeyBwYWdlOiB0aGlzLmN1cnJlbnRQYWdlLCBodG1sRWxlbWVudDogaHRtbEVsZW1lbnQgfSk7XHJcbiAgICB9XHJcbiAgICBhZnRlclJlbmRlclF1ZXN0aW9uKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGh0bWxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5vbkFmdGVyUmVuZGVyUXVlc3Rpb24uZmlyZSh0aGlzLCB7IHF1ZXN0aW9uOiBxdWVzdGlvbiwgaHRtbEVsZW1lbnQ6IGh0bWxFbGVtZW50IH0pO1xyXG4gICAgfVxyXG4gICAgYWZ0ZXJSZW5kZXJQYW5lbChwYW5lbDogSUVsZW1lbnQsIGh0bWxFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5vbkFmdGVyUmVuZGVyUGFuZWwuZmlyZSh0aGlzLCB7IHBhbmVsOiBwYW5lbCwgaHRtbEVsZW1lbnQ6IGh0bWxFbGVtZW50IH0pO1xyXG4gICAgfVxyXG4gICAgbWF0cml4Um93QWRkZWQocXVlc3Rpb246IElRdWVzdGlvbikge1xyXG4gICAgICAgIHRoaXMub25NYXRyaXhSb3dBZGRlZC5maXJlKHRoaXMsIHtxdWVzdGlvbjogcXVlc3Rpb259KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1cGxvYWRGaWxlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKT0+YW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGFjY2VwdCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vblVwbG9hZEZpbGUuZmlyZSh0aGlzLCB7IG5hbWU6IG5hbWUsIGZpbGU6IGZpbGUsIGFjY2VwdDogYWNjZXB0IH0pO1xyXG4gICAgICAgIGlmICghYWNjZXB0KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFzdG9yZURhdGFBc1RleHQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlQ29yZShuYW1lLCBmaWxlLCB1cGxvYWRpbmdDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwbG9hZEZpbGVDb3JlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICh1cGxvYWRpbmdDYWxsYmFjaykgdXBsb2FkaW5nQ2FsbGJhY2soXCJ1cGxvYWRpbmdcIik7XHJcbiAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLnNlbmRGaWxlKHRoaXMuc3VydmV5UG9zdElkLCBmaWxlLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKHN1Y2Nlc3MgPyBcInN1Y2Nlc3NcIiA6IFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFZhbHVlKG5hbWUsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0UGFnZShpbmRleDogbnVtYmVyKTogUGFnZU1vZGVsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tpbmRleF07XHJcbiAgICB9XHJcbiAgICBhZGRQYWdlKHBhZ2U6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIGlmIChwYWdlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2gocGFnZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgfVxyXG4gICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3JlYXRlTmV3UGFnZShuYW1lKTtcclxuICAgICAgICB0aGlzLmFkZFBhZ2UocGFnZSk7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcbiAgICByZW1vdmVQYWdlKHBhZ2U6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5wYWdlcy5sZW5ndGggPiAwID8gdGhpcy5wYWdlc1swXSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRRdWVzdGlvbkJ5TmFtZShuYW1lOiBzdHJpbmcsIGNhc2VJbnNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogSVF1ZXN0aW9uIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTmFtZSA9IHF1ZXN0aW9uc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBxdWVzdGlvbk5hbWUgPSBxdWVzdGlvbk5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYocXVlc3Rpb25OYW1lID09IG5hbWUpIHJldHVybiBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFF1ZXN0aW9uc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbltdIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgaWYgKCFuYW1lcykgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZXNbaV0sIGNhc2VJbnNlbnNpdGl2ZSk7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbikgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFBhZ2VCeUVsZW1lbnQoZWxlbWVudDogSUVsZW1lbnQpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICAgICAgaWYocGFnZS5jb250YWluc0VsZW1lbnQoZWxlbWVudCkpIHJldHVybiBwYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbjogSVF1ZXN0aW9uKTogUGFnZU1vZGVsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQYWdlQnlFbGVtZW50KHF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQYWdlQnlOYW1lKG5hbWU6IHN0cmluZyk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UGFnZXNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IFBhZ2VNb2RlbFtde1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzW2ldKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldFBhZ2VCeU5hbWUobmFtZXNbaV0pO1xyXG4gICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0QWxsUXVlc3Rpb25zKHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpOiBBcnJheTxJUXVlc3Rpb24+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PElRdWVzdGlvbj4oKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLmFkZFF1ZXN0aW9uc1RvTGlzdChyZXN1bHQsIHZpc2libGVPbmx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdQYWdlKG5hbWU6IHN0cmluZykgeyByZXR1cm4gbmV3IFBhZ2VNb2RlbChuYW1lKTsgfVxyXG4gICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0ubmFtZSAhPSBuYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgcXVlc3Rpb24gPSBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIHRoaXMuZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb24sIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBuYW1lLCAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ3ZhbHVlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbnNbaV0sIHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tPblBhZ2VUcmlnZ2VycygpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKHF1ZXN0aW9uLm5hbWUsIHZhbHVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk6IEFycmF5PFF1ZXN0aW9uQmFzZT4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcGFnZS5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmICghcXVlc3Rpb24udmlzaWJsZSB8fCAhcXVlc3Rpb24ubmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tUcmlnZ2VycyhuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIGlzT25OZXh0UGFnZTogYm9vbGVhbikge1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnRyaWdnZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gdGhpcy50cmlnZ2Vyc1tpXTtcclxuICAgICAgICAgICAgaWYgKHRyaWdnZXIubmFtZSA9PSBuYW1lICYmIHRyaWdnZXIuaXNPbk5leHRQYWdlID09IGlzT25OZXh0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlci5jaGVjayhuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvRWxlbWVudHNPbkxvYWQoKSB7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNbaV0ub25TdXJ2ZXlMb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Db25kaXRpb25zKCkge1xyXG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMucGFnZXM7XHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICBwYWdlc1tpXS5ydW5Db25kaXRpb24odGhpcy52YWx1ZXNIYXNoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZyA9IG51bGwsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0VkaXRNb2RlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCAmJiB0aGlzLm9uUGFydGlhbFNlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5vblBhcnRpYWxTZW5kLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXBvc3RJZCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICBwb3N0SWQgPSB0aGlzLnN1cnZleVBvc3RJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwb3N0SWQpIHJldHVybjtcclxuICAgICAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkICYmICF0aGlzLmNsaWVudElkKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kUmVzdWx0KHBvc3RJZCwgdGhpcy5kYXRhLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uU2VuZFJlc3VsdC5maXJlKHNlbGYsIHsgc3VjY2Vzczogc3VjY2VzcywgcmVzcG9uc2U6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5nZXRSZXN1bHQocmVzdWx0SWQsIG5hbWUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBhbnlbXSwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uR2V0UmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhOiBkYXRhLCBkYXRhTGlzdDogZGF0YUxpc3QsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBsb2FkU3VydmV5RnJvbVNlcnZpY2Uoc3VydmV5SWQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlJZCA9IHN1cnZleUlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKTtcclxuICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleSh0aGlzLnN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldEpzb25PYmplY3QocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHNlbGYubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja1BhZ2VWaXNpYmlsaXR5KHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG9sZFF1ZXN0aW9uVmlzaWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gcGFnZS5pc1Zpc2libGU7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IHBhZ2UuZ2V0SXNQYWdlVmlzaWJsZShxdWVzdGlvbikgfHwgb2xkUXVlc3Rpb25WaXNpYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2UsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpc2libGVJbmRleGVzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICBpZiAodGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25QYWdlXCIpIHtcclxuICAgICAgICAgICAgdmFyIHZpc1BhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh2aXNQYWdlc1tpXS5xdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSwgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXMoc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggPSB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5udW0gPSBzaG93SW5kZXggJiYgdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggKyAxIDogLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHF1ZXN0aW9uczogSVF1ZXN0aW9uW10sIHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcXVlc3Rpb25zW2ldLnNldFZpc2libGVJbmRleChzaG93SW5kZXggJiYgcXVlc3Rpb25zW2ldLnZpc2libGUgJiYgcXVlc3Rpb25zW2ldLmhhc1RpdGxlID8gKGluZGV4KyspIDogLTEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNMb2FkaW5nRnJvbUpzb25WYWx1ZSA9IGZhbHNlO1xyXG4gICAgcHVibGljIGdldCBpc0xvYWRpbmdGcm9tSnNvbigpIHsgcmV0dXJuIHRoaXMuaXNMb2FkaW5nRnJvbUpzb25WYWx1ZTsgfVxyXG4gICAgcHJpdmF0ZSBzZXRKc29uT2JqZWN0KGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuanNvbkVycm9ycyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmdGcm9tSnNvblZhbHVlID0gdHJ1ZTtcclxuICAgICAgICB2YXIganNvbkNvbnZlcnRlciA9IG5ldyBKc29uT2JqZWN0KCk7XHJcbiAgICAgICAganNvbkNvbnZlcnRlci50b09iamVjdChqc29uT2JqLCB0aGlzKTtcclxuICAgICAgICBpZiAoanNvbkNvbnZlcnRlci5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBqc29uQ29udmVydGVyLmVycm9ycztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpO1xyXG4gICAgICAgIHRoaXMuaXNMb2FkaW5nRnJvbUpzb25WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Nvb2tpZSkge1xyXG4gICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kb0VsZW1lbnRzT25Mb2FkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHsgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgIHByaXZhdGUgdXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXMgPSB7fTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW1wicGFnZW5vXCJdID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHNlbGYuY3VycmVudFBhZ2UgIT0gbnVsbCA/IHNlbGYudmlzaWJsZVBhZ2VzLmluZGV4T2Yoc2VsZi5jdXJyZW50UGFnZSkgKyAxIDogMDsgfVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vjb3VudFwiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLnZpc2libGVQYWdlQ291bnQ7IH1cclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW3F1ZXN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKV0gPSBcInF1ZXN0aW9uXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhhc1Byb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgZmlyc3ROYW1lID0gbmV3IFByb2Nlc3NWYWx1ZSgpLmdldEZpcnN0TmFtZShuYW1lKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW2ZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIGZpcnN0TmFtZSA9IG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRGaXJzdE5hbWUobmFtZSk7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tmaXJzdE5hbWUudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh2YWwgPT0gXCJ2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKG5hbWUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWwgPT0gXCJxdWVzdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUoZmlyc3ROYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIG5hbWUgPSBxdWVzdGlvbi5uYW1lICsgbmFtZS5zdWJzdHIoZmlyc3ROYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvY2Vzc1ZhbHVlKCkuZ2V0VmFsdWUobmFtZSwgdGhpcy52YWx1ZXNIYXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbCA9PSBcInZhbHVlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhclVudXNlZFZhbHVlcygpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5jbGVhclVudXNlZFZhbHVlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jbGVhckludmlzaWJsZVZhbHVlcykge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFySW52aXNpYmxlUXVlc3Rpb25WYWx1ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNsZWFySW52aXNpYmxlUXVlc3Rpb25WYWx1ZXMoKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyVmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRWYXJpYWJsZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRWYXJpYWJsZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IFwidmFyaWFibGVcIjtcclxuICAgIH1cclxuICAgIC8vSVN1cnZleSBkYXRhXHJcbiAgICBwcm90ZWN0ZWQgZ2V0VW5iaW5kVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIC8vZG8gbm90IHJldHVybiB0aGUgc2FtZSBvYmplY3QgaW5zdGFuY2UhISFcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFuYW1lIHx8IG5hbWUubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRVbmJpbmRWYWx1ZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUVxdWFsKG5hbWUsIG5ld1ZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gXCJcIiB8fCBuZXdWYWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5nZXRVbmJpbmRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbbmFtZS50b0xvd2VyQ2FzZSgpXSA9IFwidmFsdWVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMobmFtZSwgbmV3VmFsdWUsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzVmFsdWVFcXVhbChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIikgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUobmFtZSk7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBudWxsIHx8IG9sZFZhbHVlID09PSBudWxsKSByZXR1cm4gbmV3VmFsdWUgPT09IG9sZFZhbHVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzVHdvVmFsdWVFcXVhbHMobmV3VmFsdWUsIG9sZFZhbHVlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB0cnlHb05leHRQYWdlQXV0b21hdGljKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy5nb05leHRQYWdlQXV0b21hdGljIHx8ICF0aGlzLmN1cnJlbnRQYWdlKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICBpZiAocXVlc3Rpb24gJiYgKCFxdWVzdGlvbi52aXNpYmxlIHx8ICFxdWVzdGlvbi5zdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSlcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5oYXNJbnB1dCAmJiBCYXNlLmlzVmFsdWVFbXB0eSh2YWx1ZSkpIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyh0cnVlLCBmYWxzZSkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9Db21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5kYXRhW25hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXhdO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGNvbW1lbnROYW1lID0gbmFtZSArIHRoaXMuY29tbWVudFByZWZpeDtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT09IFwiXCIgfHwgbmV3VmFsdWUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVzSGFzaFtjb21tZW50TmFtZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW2NvbW1lbnROYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZSk7XHJcbiAgICAgICAgaWYocXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBjb21tZW50TmFtZSwgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIHRoZSB2YWx1ZSBmcm9tIHRoZSBzdXJ2ZXkgcmVzdWx0LlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHZhbHVlLiBUeXBpY2FsbHkgaXQgaXMgYSBxdWVzdGlvbiBuYW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclZhbHVlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUobmFtZSwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb21tZW50KG5hbWUsIG51bGwpO1xyXG4gICAgfVxyXG4gICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgdGhpcy5jaGVja1BhZ2VWaXNpYmlsaXR5KHF1ZXN0aW9uLCAhbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uUGFnZVZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncGFnZSc6IHBhZ2UsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIsIHBhcmVudFBhbmVsOiBhbnksIHJvb3RQYW5lbDogYW55KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1Byb2Nlc3NlZFRleHRWYWx1ZXMocXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMub25RdWVzdGlvbkFkZGVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAnaW5kZXgnOiBpbmRleCwgJ3BhcmVudFBhbmVsJzogcGFyZW50UGFuZWwsICdyb290UGFuZWwnOiByb290UGFuZWwgfSk7XHJcbiAgICB9XHJcbiAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uUXVlc3Rpb25SZW1vdmVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lIH0pO1xyXG4gICAgfVxyXG4gICAgcGFuZWxBZGRlZChwYW5lbDogSUVsZW1lbnQsIGluZGV4OiBudW1iZXIsIHBhcmVudFBhbmVsOiBhbnksIHJvb3RQYW5lbDogYW55KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMub25QYW5lbEFkZGVkLmZpcmUodGhpcywgeyAncGFuZWwnOiBwYW5lbCwgJ25hbWUnOiBwYW5lbC5uYW1lLCAnaW5kZXgnOiBpbmRleCwgJ3BhcmVudFBhbmVsJzogcGFyZW50UGFuZWwsICdyb290UGFuZWwnOiByb290UGFuZWwgfSk7XHJcbiAgICB9XHJcbiAgICBwYW5lbFJlbW92ZWQocGFuZWw6IElFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMub25QYW5lbFJlbW92ZWQuZmlyZSh0aGlzLCB7ICdwYW5lbCc6IHBhbmVsLCAnbmFtZSc6IHBhbmVsLm5hbWUgfSk7XHJcbiAgICB9XHJcbiAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICBpZiAodGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uaXNFbXB0eSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG5hbWU6IG5hbWUsIHZhbHVlOiB0aGlzLmdldFZhbHVlKG5hbWUpLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgIHRoaXMub25WYWxpZGF0ZVF1ZXN0aW9uLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZXJyb3IgPyBuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcikgOiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvY2Vzc0h0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgaHRtbDogaHRtbCB9O1xyXG4gICAgICAgIHRoaXMub25Qcm9jZXNzSHRtbC5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NUZXh0KG9wdGlvbnMuaHRtbCk7XHJcbiAgICB9XHJcbiAgICBwcm9jZXNzVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHRQcmVQcm9jZXNzb3IucHJvY2Vzcyh0ZXh0KTtcclxuICAgIH1cclxuICAgIC8vSVN1cnZleVRyaWdnZXJPd25lclxyXG4gICAgZ2V0T2JqZWN0cyhwYWdlczogc3RyaW5nW10sIHF1ZXN0aW9uczogc3RyaW5nW10pOiBhbnlbXXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFBhZ2VzQnlOYW1lcyhwYWdlcykpO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgdGhpcy5nZXRRdWVzdGlvbnNCeU5hbWVzKHF1ZXN0aW9ucykpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGlzVmFyaWFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYXJpYWJsZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vL01ha2UgbG9jYWxpemFibGU6IGNvbXBsZXRlZEh0bWwsIHBhZ2VQcmV2VGV4dCwgcGFnZU5leHRUZXh0LCBjb21wbGV0ZVRleHRcclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXlcIiwgW3sgbmFtZTogXCJsb2NhbGVcIiwgY2hvaWNlczogKCkgPT4geyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldExvY2FsZXMoKSB9IH0sXHJcbiAgICB7bmFtZTogXCJ0aXRsZVwiLCBzZXJpYWxpemF0aW9uUHJvcGVydHk6IFwibG9jVGl0bGVcIn0sIHsgbmFtZTogXCJmb2N1c0ZpcnN0UXVlc3Rpb25BdXRvbWF0aWM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfSxcclxuICAgIHtuYW1lOiBcImNvbXBsZXRlZEh0bWw6aHRtbFwiLCBzZXJpYWxpemF0aW9uUHJvcGVydHk6IFwibG9jQ29tcGxldGVkSHRtbFwifSwgeyBuYW1lOiBcInBhZ2VzXCIsIGNsYXNzTmFtZTogXCJwYWdlXCIsIHZpc2libGU6IGZhbHNlIH0sXHJcbiAgICB7IG5hbWU6IFwicXVlc3Rpb25zXCIsIGJhc2VDbGFzc05hbWU6IFwicXVlc3Rpb25cIiwgdmlzaWJsZTogZmFsc2UsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG51bGw7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmosIHZhbHVlLCBqc29uQ29udmVydGVyKSB7IHZhciBwYWdlID0gb2JqLmFkZE5ld1BhZ2UoXCJcIik7IGpzb25Db252ZXJ0ZXIudG9PYmplY3QoeyBxdWVzdGlvbnM6IHZhbHVlIH0sIHBhZ2UpOyB9IH0sXHJcbiAgICB7IG5hbWU6IFwidHJpZ2dlcnM6dHJpZ2dlcnNcIiwgYmFzZUNsYXNzTmFtZTogXCJzdXJ2ZXl0cmlnZ2VyXCIsIGNsYXNzTmFtZVBhcnQ6IFwidHJpZ2dlclwiIH0sXHJcbiAgICBcInN1cnZleUlkXCIsIFwic3VydmV5UG9zdElkXCIsIFwiY29va2llTmFtZVwiLCBcInNlbmRSZXN1bHRPblBhZ2VOZXh0OmJvb2xlYW5cIixcclxuICAgIHsgbmFtZTogXCJzaG93TmF2aWdhdGlvbkJ1dHRvbnM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIHsgbmFtZTogXCJzaG93VGl0bGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sXHJcbiAgICB7IG5hbWU6IFwic2hvd1BhZ2VUaXRsZXM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIHsgbmFtZTogXCJzaG93Q29tcGxldGVkUGFnZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSxcclxuICAgIFwic2hvd1BhZ2VOdW1iZXJzOmJvb2xlYW5cIiwgeyBuYW1lOiBcInNob3dRdWVzdGlvbk51bWJlcnNcIiwgZGVmYXVsdDogXCJvblwiLCBjaG9pY2VzOiBbXCJvblwiLCBcIm9uUGFnZVwiLCBcIm9mZlwiXSB9LFxyXG4gICAgeyBuYW1lOiBcInF1ZXN0aW9uVGl0bGVMb2NhdGlvblwiLCBkZWZhdWx0OiBcInRvcFwiLCBjaG9pY2VzOiBbXCJ0b3BcIiwgXCJib3R0b21cIl0gfSxcclxuICAgIHsgbmFtZTogXCJzaG93UHJvZ3Jlc3NCYXJcIiwgZGVmYXVsdDogXCJvZmZcIiwgY2hvaWNlczogW1wib2ZmXCIsIFwidG9wXCIsIFwiYm90dG9tXCJdIH0sXHJcbiAgICB7IG5hbWU6IFwibW9kZVwiLCBkZWZhdWx0OiBcImVkaXRcIiwgY2hvaWNlczogW1wiZWRpdFwiLCBcImRpc3BsYXlcIl0gfSxcclxuICAgIHsgbmFtZTogXCJzdG9yZU90aGVyc0FzQ29tbWVudDpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJnb05leHRQYWdlQXV0b21hdGljOmJvb2xlYW5cIiwgXCJjbGVhckludmlzaWJsZVZhbHVlczpib29sZWFuXCIsXHJcbiAgICB7IG5hbWU6IFwicGFnZVByZXZUZXh0XCIsIHNlcmlhbGl6YXRpb25Qcm9wZXJ0eTogXCJsb2NQYWdlUHJldlRleHRcIn0sXHJcbiAgICB7IG5hbWU6IFwicGFnZU5leHRUZXh0XCIsIHNlcmlhbGl6YXRpb25Qcm9wZXJ0eTogXCJsb2NQYWdlTmV4dFRleHRcIn0sXHJcbiAgICB7IG5hbWU6IFwiY29tcGxldGVUZXh0XCIsIHNlcmlhbGl6YXRpb25Qcm9wZXJ0eTogXCJsb2NDb21wbGV0ZVRleHRcIn0sXHJcbiAgICB7IG5hbWU6IFwicmVxdWlyZWRUZXh0XCIsIGRlZmF1bHQ6IFwiKlwiIH0sIFwicXVlc3Rpb25TdGFydEluZGV4XCIsIHtuYW1lOiBcInF1ZXN0aW9uVGl0bGVUZW1wbGF0ZVwiLCBzZXJpYWxpemF0aW9uUHJvcGVydHk6IFwibG9jUXVlc3Rpb25UaXRsZVRlbXBsYXRlXCJ9XSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXkudHMiLCJpbXBvcnQge0Jhc2UsIFN1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3IsIFJlcXVyZU51bWVyaWNFcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tICcuL2pzb25vYmplY3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IGFueSwgcHVibGljIGVycm9yOiBTdXJ2ZXlFcnJvciA9IG51bGwpIHtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQmFzZSBTdXJ2ZXlKUyB2YWxpZGF0b3IgY2xhc3MuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPjtcclxuICAgIHZhbHVlOiBhbnk7XHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICBwdWJsaWMgcnVuKG93bmVyOiBJVmFsaWRhdG9yT3duZXIpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25lci52YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LmVycm9yKSByZXR1cm4gdmFsaWRhdG9yUmVzdWx0LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLnZhbHVlID0gdmFsaWRhdG9yUmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBWYWxpZGF0ZSBudW1lcmljIHZhbHVlcy4gXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTnVtZXJpY1ZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAoIXZhbHVlIHx8ICF0aGlzLmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFZhbGlkYXRvclJlc3VsdChwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tYXhWYWx1ZSAmJiB0aGlzLm1heFZhbHVlIDwgcmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgPyBudWxsIDogcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHZOYW1lID0gbmFtZSA/IG5hbWUgOiBcInZhbHVlXCI7XHJcbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5NYXhcIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5cIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc051bWJlcih2YWx1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogVmFsaWRhdGUgdGV4dCB2YWx1ZXNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXh0VmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5MZW5ndGg6IG51bWJlciA9IDAsIHB1YmxpYyBtYXhMZW5ndGg6IG51bWJlciA9IDApIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dHZhbGlkYXRvclwiOyB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgaWYgKHRoaXMubWluTGVuZ3RoID4gMCAmJiB2YWx1ZS5sZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWF4TGVuZ3RoID4gMCAmJiB2YWx1ZS5sZW5ndGggPiB0aGlzLm1heExlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPiAwICYmIHRoaXMubWF4TGVuZ3RoID4gMClcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ0ZXh0TWluTWF4TGVuZ3RoXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluTGVuZ3RoLCB0aGlzLm1heExlbmd0aCk7XHJcbiAgICAgICAgaWYgKHRoaXMubWluTGVuZ3RoID4gMCkgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ0ZXh0TWluTGVuZ3RoXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluTGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInRleHRNYXhMZW5ndGhcIilbXCJmb3JtYXRcIl0odGhpcy5tYXhMZW5ndGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQW5zd2VyQ291bnRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG1pbkNvdW50OiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4Q291bnQ6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlLmNvbnN0cnVjdG9yICE9IEFycmF5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgY291bnQgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHRoaXMubWluQ291bnQgJiYgY291bnQgPCB0aGlzLm1pbkNvdW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWluU2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5taW5Db3VudCkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1heENvdW50ICYmIGNvdW50ID4gdGhpcy5tYXhDb3VudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1heFNlbGVjdEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWF4Q291bnQpKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBVc2UgaXQgdG8gdmFsaWRhdGUgdGhlIHRleHQgYnkgcmVndWxhciBleHByZXNzaW9ucy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZWdleFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVnZXg6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicmVnZXh2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICghdGhpcy5yZWdleCB8fCAhdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAodGhpcy5yZWdleCk7XHJcbiAgICAgICAgaWYgKHJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdCh2YWx1ZSwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFZhbGlkYXRlIGUtbWFpbCBhZGRyZXNzIGluIHRoZSB0ZXh0IGlucHV0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRW1haWxWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgcHJpdmF0ZSByZSA9IC9eKChbXjw+KClcXFtcXF1cXC4sOzpcXHNAXFxcIl0rKFxcLltePD4oKVxcW1xcXVxcLiw7Olxcc0BcXFwiXSspKil8KFxcXCIuK1xcXCIpKUAoKFtePD4oKVtcXF1cXC4sOzpcXHNAXFxcIl0rXFwuKStbXjw+KClbXFxdXFwuLDs6XFxzQFxcXCJdezIsfSkkL2k7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiZW1haWx2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdCh2YWx1ZSwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImludmFsaWRFbWFpbFwiKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXZhbGlkYXRvclwiLCBbXCJ0ZXh0XCJdKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm51bWVyaWN2YWxpZGF0b3JcIiwgW1wibWluVmFsdWU6bnVtYmVyXCIsIFwibWF4VmFsdWU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTnVtZXJpY1ZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHR2YWxpZGF0b3JcIiwgW1wibWluTGVuZ3RoOm51bWJlclwiLCBcIm1heExlbmd0aDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBUZXh0VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIiwgW1wibWluQ291bnQ6bnVtYmVyXCIsIFwibWF4Q291bnQ6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQW5zd2VyQ291bnRWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyZWdleHZhbGlkYXRvclwiLCBbXCJyZWdleFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFJlZ2V4VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZW1haWx2YWxpZGF0b3JcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBFbWFpbFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3ZhbGlkYXRvci50cyIsImV4cG9ydCAqIGZyb20gXCIuL3JlYWN0XCI7XHJcbmV4cG9ydCB7U3VydmV5Tkd9IGZyb20gXCIuLi9hbmd1bGFyL1N1cnZleU5HXCI7XHJcbmV4cG9ydCB7U3VydmV5V2luZG93Tkd9IGZyb20gXCIuLi9hbmd1bGFyL1N1cnZleU5HXCI7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lbnRyaWVzL2FuZ3VsYXIudHMiXSwic291cmNlUm9vdCI6IiJ9