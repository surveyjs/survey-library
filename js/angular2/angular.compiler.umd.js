/**
 * @license AngularJS v2.0.0-rc.1
 * (c) 2010-2016 Google, Inc. https://angular.io/
 * License: MIT
 */
var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.compiler = global.ng.compiler || {}), global.ng.core, global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx));
}(this, function (exports, _angular_core, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable) {
    'use strict';
    var ElementSchemaRegistry = (function () {
        function ElementSchemaRegistry() {
        }
        return ElementSchemaRegistry;
    }());
    var globalScope;
    if (typeof window === 'undefined') {
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
            // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
            globalScope = self;
        }
        else {
            globalScope = global;
        }
    }
    else {
        globalScope = window;
    }
    var IS_DART = false;
    // Need to declare a new variable for global here since TypeScript
    // exports the original value of the symbol.
    var global$1 = globalScope;
    var Type = Function;
    var _devMode = true;
    function assertionsEnabled() {
        return _devMode;
    }
    // TODO: remove calls to assert in production environment
    // Note: Can't just export this and import in in other files
    // as `assert` is a reserved keyword in Dart
    global$1.assert = function assert(condition) {
        // TODO: to be fixed properly via #2830, noop for now
    };
    function isPresent(obj) {
        return obj !== undefined && obj !== null;
    }
    function isBlank(obj) {
        return obj === undefined || obj === null;
    }
    function isBoolean(obj) {
        return typeof obj === "boolean";
    }
    function isNumber(obj) {
        return typeof obj === "number";
    }
    function isString(obj) {
        return typeof obj === "string";
    }
    function isStringMap(obj) {
        return typeof obj === 'object' && obj !== null;
    }
    var STRING_MAP_PROTO = Object.getPrototypeOf({});
    function isStrictStringMap(obj) {
        return isStringMap(obj) && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
    }
    function isArray(obj) {
        return Array.isArray(obj);
    }
    function noop() { }
    function stringify(token) {
        if (typeof token === 'string') {
            return token;
        }
        if (token === undefined || token === null) {
            return '' + token;
        }
        if (token.name) {
            return token.name;
        }
        if (token.overriddenName) {
            return token.overriddenName;
        }
        var res = token.toString();
        var newLineIndex = res.indexOf("\n");
        return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
    }
    // serialize / deserialize enum exist only for consistency with dart API
    // enums in typescript don't need to be serialized
    function serializeEnum(val) {
        return val;
    }
    function resolveEnumToken(enumValue, val) {
        return enumValue[val];
    }
    var StringWrapper = (function () {
        function StringWrapper() {
        }
        StringWrapper.fromCharCode = function (code) { return String.fromCharCode(code); };
        StringWrapper.charCodeAt = function (s, index) { return s.charCodeAt(index); };
        StringWrapper.split = function (s, regExp) { return s.split(regExp); };
        StringWrapper.equals = function (s, s2) { return s === s2; };
        StringWrapper.stripLeft = function (s, charVal) {
            if (s && s.length) {
                var pos = 0;
                for (var i = 0; i < s.length; i++) {
                    if (s[i] != charVal)
                        break;
                    pos++;
                }
                s = s.substring(pos);
            }
            return s;
        };
        StringWrapper.stripRight = function (s, charVal) {
            if (s && s.length) {
                var pos = s.length;
                for (var i = s.length - 1; i >= 0; i--) {
                    if (s[i] != charVal)
                        break;
                    pos--;
                }
                s = s.substring(0, pos);
            }
            return s;
        };
        StringWrapper.replace = function (s, from, replace) {
            return s.replace(from, replace);
        };
        StringWrapper.replaceAll = function (s, from, replace) {
            return s.replace(from, replace);
        };
        StringWrapper.slice = function (s, from, to) {
            if (from === void 0) { from = 0; }
            if (to === void 0) { to = null; }
            return s.slice(from, to === null ? undefined : to);
        };
        StringWrapper.replaceAllMapped = function (s, from, cb) {
            return s.replace(from, function () {
                var matches = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    matches[_i - 0] = arguments[_i];
                }
                // Remove offset & string from the result array
                matches.splice(-2, 2);
                // The callback receives match, p1, ..., pn
                return cb(matches);
            });
        };
        StringWrapper.contains = function (s, substr) { return s.indexOf(substr) != -1; };
        StringWrapper.compare = function (a, b) {
            if (a < b) {
                return -1;
            }
            else if (a > b) {
                return 1;
            }
            else {
                return 0;
            }
        };
        return StringWrapper;
    }());
    var StringJoiner = (function () {
        function StringJoiner(parts) {
            if (parts === void 0) { parts = []; }
            this.parts = parts;
        }
        StringJoiner.prototype.add = function (part) { this.parts.push(part); };
        StringJoiner.prototype.toString = function () { return this.parts.join(""); };
        return StringJoiner;
    }());
    var NumberParseError = (function (_super) {
        __extends(NumberParseError, _super);
        function NumberParseError(message) {
            _super.call(this);
            this.message = message;
        }
        NumberParseError.prototype.toString = function () { return this.message; };
        return NumberParseError;
    }(Error));
    var NumberWrapper = (function () {
        function NumberWrapper() {
        }
        NumberWrapper.toFixed = function (n, fractionDigits) { return n.toFixed(fractionDigits); };
        NumberWrapper.equal = function (a, b) { return a === b; };
        NumberWrapper.parseIntAutoRadix = function (text) {
            var result = parseInt(text);
            if (isNaN(result)) {
                throw new NumberParseError("Invalid integer literal when parsing " + text);
            }
            return result;
        };
        NumberWrapper.parseInt = function (text, radix) {
            if (radix == 10) {
                if (/^(\-|\+)?[0-9]+$/.test(text)) {
                    return parseInt(text, radix);
                }
            }
            else if (radix == 16) {
                if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
                    return parseInt(text, radix);
                }
            }
            else {
                var result = parseInt(text, radix);
                if (!isNaN(result)) {
                    return result;
                }
            }
            throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " +
                radix);
        };
        // TODO: NaN is a valid literal but is returned by parseFloat to indicate an error.
        NumberWrapper.parseFloat = function (text) { return parseFloat(text); };
        Object.defineProperty(NumberWrapper, "NaN", {
            get: function () { return NaN; },
            enumerable: true,
            configurable: true
        });
        NumberWrapper.isNaN = function (value) { return isNaN(value); };
        NumberWrapper.isInteger = function (value) { return Number.isInteger(value); };
        return NumberWrapper;
    }());
    var RegExpWrapper = (function () {
        function RegExpWrapper() {
        }
        RegExpWrapper.create = function (regExpStr, flags) {
            if (flags === void 0) { flags = ''; }
            flags = flags.replace(/g/g, '');
            return new global$1.RegExp(regExpStr, flags + 'g');
        };
        RegExpWrapper.firstMatch = function (regExp, input) {
            // Reset multimatch regex state
            regExp.lastIndex = 0;
            return regExp.exec(input);
        };
        RegExpWrapper.test = function (regExp, input) {
            regExp.lastIndex = 0;
            return regExp.test(input);
        };
        RegExpWrapper.matcher = function (regExp, input) {
            // Reset regex state for the case
            // someone did not loop over all matches
            // last time.
            regExp.lastIndex = 0;
            return { re: regExp, input: input };
        };
        RegExpWrapper.replaceAll = function (regExp, input, replace) {
            var c = regExp.exec(input);
            var res = '';
            regExp.lastIndex = 0;
            var prev = 0;
            while (c) {
                res += input.substring(prev, c.index);
                res += replace(c);
                prev = c.index + c[0].length;
                regExp.lastIndex = prev;
                c = regExp.exec(input);
            }
            res += input.substring(prev);
            return res;
        };
        return RegExpWrapper;
    }());
    var RegExpMatcherWrapper = (function () {
        function RegExpMatcherWrapper() {
        }
        RegExpMatcherWrapper.next = function (matcher) {
            return matcher.re.exec(matcher.input);
        };
        return RegExpMatcherWrapper;
    }());
    var FunctionWrapper = (function () {
        function FunctionWrapper() {
        }
        FunctionWrapper.apply = function (fn, posArgs) { return fn.apply(null, posArgs); };
        return FunctionWrapper;
    }());
    function normalizeBlank(obj) {
        return isBlank(obj) ? null : obj;
    }
    function normalizeBool(obj) {
        return isBlank(obj) ? false : obj;
    }
    function isJsObject(o) {
        return o !== null && (typeof o === "function" || typeof o === "object");
    }
    function evalExpression(sourceUrl, expr, declarations, vars) {
        var fnBody = declarations + "\nreturn " + expr + "\n//# sourceURL=" + sourceUrl;
        var fnArgNames = [];
        var fnArgValues = [];
        for (var argName in vars) {
            fnArgNames.push(argName);
            fnArgValues.push(vars[argName]);
        }
        return new (Function.bind.apply(Function, [void 0].concat(fnArgNames.concat(fnBody))))().apply(void 0, fnArgValues);
    }
    function isPrimitive(obj) {
        return !isJsObject(obj);
    }
    /**
     * A segment of text within the template.
     */
    var TextAst = (function () {
        function TextAst(value, ngContentIndex, sourceSpan) {
            this.value = value;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        TextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
        return TextAst;
    }());
    /**
     * A bound expression within the text of a template.
     */
    var BoundTextAst = (function () {
        function BoundTextAst(value, ngContentIndex, sourceSpan) {
            this.value = value;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        BoundTextAst.prototype.visit = function (visitor, context) {
            return visitor.visitBoundText(this, context);
        };
        return BoundTextAst;
    }());
    /**
     * A plain attribute on an element.
     */
    var AttrAst = (function () {
        function AttrAst(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        AttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
        return AttrAst;
    }());
    /**
     * A binding for an element property (e.g. `[property]="expression"`).
     */
    var BoundElementPropertyAst = (function () {
        function BoundElementPropertyAst(name, type, securityContext, value, unit, sourceSpan) {
            this.name = name;
            this.type = type;
            this.securityContext = securityContext;
            this.value = value;
            this.unit = unit;
            this.sourceSpan = sourceSpan;
        }
        BoundElementPropertyAst.prototype.visit = function (visitor, context) {
            return visitor.visitElementProperty(this, context);
        };
        return BoundElementPropertyAst;
    }());
    /**
     * A binding for an element event (e.g. `(event)="handler()"`).
     */
    var BoundEventAst = (function () {
        function BoundEventAst(name, target, handler, sourceSpan) {
            this.name = name;
            this.target = target;
            this.handler = handler;
            this.sourceSpan = sourceSpan;
        }
        BoundEventAst.prototype.visit = function (visitor, context) {
            return visitor.visitEvent(this, context);
        };
        Object.defineProperty(BoundEventAst.prototype, "fullName", {
            get: function () {
                if (isPresent(this.target)) {
                    return this.target + ":" + this.name;
                }
                else {
                    return this.name;
                }
            },
            enumerable: true,
            configurable: true
        });
        return BoundEventAst;
    }());
    /**
     * A reference declaration on an element (e.g. `let someName="expression"`).
     */
    var ReferenceAst = (function () {
        function ReferenceAst(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        ReferenceAst.prototype.visit = function (visitor, context) {
            return visitor.visitReference(this, context);
        };
        return ReferenceAst;
    }());
    /**
     * A variable declaration on a <template> (e.g. `var-someName="someLocalName"`).
     */
    var VariableAst = (function () {
        function VariableAst(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        VariableAst.prototype.visit = function (visitor, context) {
            return visitor.visitVariable(this, context);
        };
        return VariableAst;
    }());
    /**
     * An element declaration in a template.
     */
    var ElementAst = (function () {
        function ElementAst(name, attrs, inputs, outputs, references, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
            this.name = name;
            this.attrs = attrs;
            this.inputs = inputs;
            this.outputs = outputs;
            this.references = references;
            this.directives = directives;
            this.providers = providers;
            this.hasViewContainer = hasViewContainer;
            this.children = children;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        ElementAst.prototype.visit = function (visitor, context) {
            return visitor.visitElement(this, context);
        };
        return ElementAst;
    }());
    /**
     * A `<template>` element included in an Angular template.
     */
    var EmbeddedTemplateAst = (function () {
        function EmbeddedTemplateAst(attrs, outputs, references, variables, directives, providers, hasViewContainer, children, ngContentIndex, sourceSpan) {
            this.attrs = attrs;
            this.outputs = outputs;
            this.references = references;
            this.variables = variables;
            this.directives = directives;
            this.providers = providers;
            this.hasViewContainer = hasViewContainer;
            this.children = children;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        EmbeddedTemplateAst.prototype.visit = function (visitor, context) {
            return visitor.visitEmbeddedTemplate(this, context);
        };
        return EmbeddedTemplateAst;
    }());
    /**
     * A directive property with a bound value (e.g. `*ngIf="condition").
     */
    var BoundDirectivePropertyAst = (function () {
        function BoundDirectivePropertyAst(directiveName, templateName, value, sourceSpan) {
            this.directiveName = directiveName;
            this.templateName = templateName;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        BoundDirectivePropertyAst.prototype.visit = function (visitor, context) {
            return visitor.visitDirectiveProperty(this, context);
        };
        return BoundDirectivePropertyAst;
    }());
    /**
     * A directive declared on an element.
     */
    var DirectiveAst = (function () {
        function DirectiveAst(directive, inputs, hostProperties, hostEvents, sourceSpan) {
            this.directive = directive;
            this.inputs = inputs;
            this.hostProperties = hostProperties;
            this.hostEvents = hostEvents;
            this.sourceSpan = sourceSpan;
        }
        DirectiveAst.prototype.visit = function (visitor, context) {
            return visitor.visitDirective(this, context);
        };
        return DirectiveAst;
    }());
    /**
     * A provider declared on an element
     */
    var ProviderAst = (function () {
        function ProviderAst(token, multiProvider, eager, providers, providerType, sourceSpan) {
            this.token = token;
            this.multiProvider = multiProvider;
            this.eager = eager;
            this.providers = providers;
            this.providerType = providerType;
            this.sourceSpan = sourceSpan;
        }
        ProviderAst.prototype.visit = function (visitor, context) {
            // No visit method in the visitor for now...
            return null;
        };
        return ProviderAst;
    }());
    exports.ProviderAstType;
    (function (ProviderAstType) {
        ProviderAstType[ProviderAstType["PublicService"] = 0] = "PublicService";
        ProviderAstType[ProviderAstType["PrivateService"] = 1] = "PrivateService";
        ProviderAstType[ProviderAstType["Component"] = 2] = "Component";
        ProviderAstType[ProviderAstType["Directive"] = 3] = "Directive";
        ProviderAstType[ProviderAstType["Builtin"] = 4] = "Builtin";
    })(exports.ProviderAstType || (exports.ProviderAstType = {}));
    /**
     * Position where content is to be projected (instance of `<ng-content>` in a template).
     */
    var NgContentAst = (function () {
        function NgContentAst(index, ngContentIndex, sourceSpan) {
            this.index = index;
            this.ngContentIndex = ngContentIndex;
            this.sourceSpan = sourceSpan;
        }
        NgContentAst.prototype.visit = function (visitor, context) {
            return visitor.visitNgContent(this, context);
        };
        return NgContentAst;
    }());
    /**
     * Enumeration of types of property bindings.
     */
    exports.PropertyBindingType;
    (function (PropertyBindingType) {
        /**
         * A normal binding to a property (e.g. `[property]="expression"`).
         */
        PropertyBindingType[PropertyBindingType["Property"] = 0] = "Property";
        /**
         * A binding to an element attribute (e.g. `[attr.name]="expression"`).
         */
        PropertyBindingType[PropertyBindingType["Attribute"] = 1] = "Attribute";
        /**
         * A binding to a CSS class (e.g. `[class.name]="condition"`).
         */
        PropertyBindingType[PropertyBindingType["Class"] = 2] = "Class";
        /**
         * A binding to a style rule (e.g. `[style.rule]="expression"`).
         */
        PropertyBindingType[PropertyBindingType["Style"] = 3] = "Style";
    })(exports.PropertyBindingType || (exports.PropertyBindingType = {}));
    /**
     * Visit every node in a list of {@link TemplateAst}s with the given {@link TemplateAstVisitor}.
     */
    function templateVisitAll(visitor, asts, context) {
        if (context === void 0) { context = null; }
        var result = [];
        asts.forEach(function (ast) {
            var astResult = ast.visit(visitor, context);
            if (isPresent(astResult)) {
                result.push(astResult);
            }
        });
        return result;
    }
    var isDefaultChangeDetectionStrategy = _angular_core.__core_private__.isDefaultChangeDetectionStrategy;
    var ChangeDetectorState = _angular_core.__core_private__.ChangeDetectorState;
    var CHANGE_DETECTION_STRATEGY_VALUES = _angular_core.__core_private__.CHANGE_DETECTION_STRATEGY_VALUES;
    var LifecycleHooks = _angular_core.__core_private__.LifecycleHooks;
    var LIFECYCLE_HOOKS_VALUES = _angular_core.__core_private__.LIFECYCLE_HOOKS_VALUES;
    var ReflectorReader = _angular_core.__core_private__.ReflectorReader;
    var AppElement = _angular_core.__core_private__.AppElement;
    var AppView = _angular_core.__core_private__.AppView;
    var DebugAppView = _angular_core.__core_private__.DebugAppView;
    var ViewType = _angular_core.__core_private__.ViewType;
    var MAX_INTERPOLATION_VALUES = _angular_core.__core_private__.MAX_INTERPOLATION_VALUES;
    var checkBinding = _angular_core.__core_private__.checkBinding;
    var flattenNestedViewRenderNodes = _angular_core.__core_private__.flattenNestedViewRenderNodes;
    var interpolate = _angular_core.__core_private__.interpolate;
    var ViewUtils = _angular_core.__core_private__.ViewUtils;
    var VIEW_ENCAPSULATION_VALUES = _angular_core.__core_private__.VIEW_ENCAPSULATION_VALUES;
    var DebugContext = _angular_core.__core_private__.DebugContext;
    var StaticNodeDebugInfo = _angular_core.__core_private__.StaticNodeDebugInfo;
    var devModeEqual = _angular_core.__core_private__.devModeEqual;
    var uninitialized = _angular_core.__core_private__.uninitialized;
    var ValueUnwrapper = _angular_core.__core_private__.ValueUnwrapper;
    var TemplateRef_ = _angular_core.__core_private__.TemplateRef_;
    var SecurityContext = _angular_core.__core_private__.SecurityContext;
    var createProvider = _angular_core.__core_private__.createProvider;
    var isProviderLiteral = _angular_core.__core_private__.isProviderLiteral;
    var EMPTY_ARRAY = _angular_core.__core_private__.EMPTY_ARRAY;
    var EMPTY_MAP = _angular_core.__core_private__.EMPTY_MAP;
    var pureProxy1 = _angular_core.__core_private__.pureProxy1;
    var pureProxy2 = _angular_core.__core_private__.pureProxy2;
    var pureProxy3 = _angular_core.__core_private__.pureProxy3;
    var pureProxy4 = _angular_core.__core_private__.pureProxy4;
    var pureProxy5 = _angular_core.__core_private__.pureProxy5;
    var pureProxy6 = _angular_core.__core_private__.pureProxy6;
    var pureProxy7 = _angular_core.__core_private__.pureProxy7;
    var pureProxy8 = _angular_core.__core_private__.pureProxy8;
    var pureProxy9 = _angular_core.__core_private__.pureProxy9;
    var pureProxy10 = _angular_core.__core_private__.pureProxy10;
    var castByValue = _angular_core.__core_private__.castByValue;
    var Console = _angular_core.__core_private__.Console;
    var Map$1 = global$1.Map;
    var Set$1 = global$1.Set;
    // Safari and Internet Explorer do not support the iterable parameter to the
    // Map constructor.  We work around that by manually adding the items.
    var createMapFromPairs = (function () {
        try {
            if (new Map$1([[1, 2]]).size === 1) {
                return function createMapFromPairs(pairs) { return new Map$1(pairs); };
            }
        }
        catch (e) {
        }
        return function createMapAndPopulateFromPairs(pairs) {
            var map = new Map$1();
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                map.set(pair[0], pair[1]);
            }
            return map;
        };
    })();
    var createMapFromMap = (function () {
        try {
            if (new Map$1(new Map$1())) {
                return function createMapFromMap(m) { return new Map$1(m); };
            }
        }
        catch (e) {
        }
        return function createMapAndPopulateFromMap(m) {
            var map = new Map$1();
            m.forEach(function (v, k) { map.set(k, v); });
            return map;
        };
    })();
    var _clearValues = (function () {
        if ((new Map$1()).keys().next) {
            return function _clearValues(m) {
                var keyIterator = m.keys();
                var k;
                while (!((k = keyIterator.next()).done)) {
                    m.set(k.value, null);
                }
            };
        }
        else {
            return function _clearValuesWithForeEach(m) {
                m.forEach(function (v, k) { m.set(k, null); });
            };
        }
    })();
    // Safari doesn't implement MapIterator.next(), which is used is Traceur's polyfill of Array.from
    // TODO(mlaval): remove the work around once we have a working polyfill of Array.from
    var _arrayFromMap = (function () {
        try {
            if ((new Map$1()).values().next) {
                return function createArrayFromMap(m, getValues) {
                    return getValues ? Array.from(m.values()) : Array.from(m.keys());
                };
            }
        }
        catch (e) {
        }
        return function createArrayFromMapWithForeach(m, getValues) {
            var res = ListWrapper.createFixedSize(m.size), i = 0;
            m.forEach(function (v, k) {
                res[i] = getValues ? v : k;
                i++;
            });
            return res;
        };
    })();
    /**
     * Wraps Javascript Objects
     */
    var StringMapWrapper = (function () {
        function StringMapWrapper() {
        }
        StringMapWrapper.create = function () {
            // Note: We are not using Object.create(null) here due to
            // performance!
            // http://jsperf.com/ng2-object-create-null
            return {};
        };
        StringMapWrapper.contains = function (map, key) {
            return map.hasOwnProperty(key);
        };
        StringMapWrapper.get = function (map, key) {
            return map.hasOwnProperty(key) ? map[key] : undefined;
        };
        StringMapWrapper.set = function (map, key, value) { map[key] = value; };
        StringMapWrapper.keys = function (map) { return Object.keys(map); };
        StringMapWrapper.values = function (map) {
            return Object.keys(map).reduce(function (r, a) {
                r.push(map[a]);
                return r;
            }, []);
        };
        StringMapWrapper.isEmpty = function (map) {
            for (var prop in map) {
                return false;
            }
            return true;
        };
        StringMapWrapper.delete = function (map, key) { delete map[key]; };
        StringMapWrapper.forEach = function (map, callback) {
            for (var prop in map) {
                if (map.hasOwnProperty(prop)) {
                    callback(map[prop], prop);
                }
            }
        };
        StringMapWrapper.merge = function (m1, m2) {
            var m = {};
            for (var attr in m1) {
                if (m1.hasOwnProperty(attr)) {
                    m[attr] = m1[attr];
                }
            }
            for (var attr in m2) {
                if (m2.hasOwnProperty(attr)) {
                    m[attr] = m2[attr];
                }
            }
            return m;
        };
        StringMapWrapper.equals = function (m1, m2) {
            var k1 = Object.keys(m1);
            var k2 = Object.keys(m2);
            if (k1.length != k2.length) {
                return false;
            }
            var key;
            for (var i = 0; i < k1.length; i++) {
                key = k1[i];
                if (m1[key] !== m2[key]) {
                    return false;
                }
            }
            return true;
        };
        return StringMapWrapper;
    }());
    var ListWrapper = (function () {
        function ListWrapper() {
        }
        // JS has no way to express a statically fixed size list, but dart does so we
        // keep both methods.
        ListWrapper.createFixedSize = function (size) { return new Array(size); };
        ListWrapper.createGrowableSize = function (size) { return new Array(size); };
        ListWrapper.clone = function (array) { return array.slice(0); };
        ListWrapper.forEachWithIndex = function (array, fn) {
            for (var i = 0; i < array.length; i++) {
                fn(array[i], i);
            }
        };
        ListWrapper.first = function (array) {
            if (!array)
                return null;
            return array[0];
        };
        ListWrapper.last = function (array) {
            if (!array || array.length == 0)
                return null;
            return array[array.length - 1];
        };
        ListWrapper.indexOf = function (array, value, startIndex) {
            if (startIndex === void 0) { startIndex = 0; }
            return array.indexOf(value, startIndex);
        };
        ListWrapper.contains = function (list, el) { return list.indexOf(el) !== -1; };
        ListWrapper.reversed = function (array) {
            var a = ListWrapper.clone(array);
            return a.reverse();
        };
        ListWrapper.concat = function (a, b) { return a.concat(b); };
        ListWrapper.insert = function (list, index, value) { list.splice(index, 0, value); };
        ListWrapper.removeAt = function (list, index) {
            var res = list[index];
            list.splice(index, 1);
            return res;
        };
        ListWrapper.removeAll = function (list, items) {
            for (var i = 0; i < items.length; ++i) {
                var index = list.indexOf(items[i]);
                list.splice(index, 1);
            }
        };
        ListWrapper.remove = function (list, el) {
            var index = list.indexOf(el);
            if (index > -1) {
                list.splice(index, 1);
                return true;
            }
            return false;
        };
        ListWrapper.clear = function (list) { list.length = 0; };
        ListWrapper.isEmpty = function (list) { return list.length == 0; };
        ListWrapper.fill = function (list, value, start, end) {
            if (start === void 0) { start = 0; }
            if (end === void 0) { end = null; }
            list.fill(value, start, end === null ? list.length : end);
        };
        ListWrapper.equals = function (a, b) {
            if (a.length != b.length)
                return false;
            for (var i = 0; i < a.length; ++i) {
                if (a[i] !== b[i])
                    return false;
            }
            return true;
        };
        ListWrapper.slice = function (l, from, to) {
            if (from === void 0) { from = 0; }
            if (to === void 0) { to = null; }
            return l.slice(from, to === null ? undefined : to);
        };
        ListWrapper.splice = function (l, from, length) { return l.splice(from, length); };
        ListWrapper.sort = function (l, compareFn) {
            if (isPresent(compareFn)) {
                l.sort(compareFn);
            }
            else {
                l.sort();
            }
        };
        ListWrapper.toString = function (l) { return l.toString(); };
        ListWrapper.toJSON = function (l) { return JSON.stringify(l); };
        ListWrapper.maximum = function (list, predicate) {
            if (list.length == 0) {
                return null;
            }
            var solution = null;
            var maxValue = -Infinity;
            for (var index = 0; index < list.length; index++) {
                var candidate = list[index];
                if (isBlank(candidate)) {
                    continue;
                }
                var candidateValue = predicate(candidate);
                if (candidateValue > maxValue) {
                    solution = candidate;
                    maxValue = candidateValue;
                }
            }
            return solution;
        };
        ListWrapper.flatten = function (list) {
            var target = [];
            _flattenArray(list, target);
            return target;
        };
        ListWrapper.addAll = function (list, source) {
            for (var i = 0; i < source.length; i++) {
                list.push(source[i]);
            }
        };
        return ListWrapper;
    }());
    function _flattenArray(source, target) {
        if (isPresent(source)) {
            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                if (isArray(item)) {
                    _flattenArray(item, target);
                }
                else {
                    target.push(item);
                }
            }
        }
        return target;
    }
    // Safari and Internet Explorer do not support the iterable parameter to the
    // Set constructor.  We work around that by manually adding the items.
    var createSetFromList = (function () {
        var test = new Set$1([1, 2, 3]);
        if (test.size === 3) {
            return function createSetFromList(lst) { return new Set$1(lst); };
        }
        else {
            return function createSetAndPopulateFromList(lst) {
                var res = new Set$1(lst);
                if (res.size !== lst.length) {
                    for (var i = 0; i < lst.length; i++) {
                        res.add(lst[i]);
                    }
                }
                return res;
            };
        }
    })();
    var SetWrapper = (function () {
        function SetWrapper() {
        }
        SetWrapper.createFromList = function (lst) { return createSetFromList(lst); };
        SetWrapper.has = function (s, key) { return s.has(key); };
        SetWrapper.delete = function (m, k) { m.delete(k); };
        return SetWrapper;
    }());
    var BaseException$1 = (function (_super) {
        __extends(BaseException$1, _super);
        function BaseException$1(message) {
            if (message === void 0) { message = "--"; }
            _super.call(this, message);
            this.message = message;
            this.stack = (new Error(message)).stack;
        }
        BaseException$1.prototype.toString = function () { return this.message; };
        return BaseException$1;
    }(Error));
    function unimplemented() {
        throw new BaseException$1('unimplemented');
    }
    var AST = (function () {
        function AST() {
        }
        AST.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return null;
        };
        AST.prototype.toString = function () { return "AST"; };
        return AST;
    }());
    /**
     * Represents a quoted expression of the form:
     *
     * quote = prefix `:` uninterpretedExpression
     * prefix = identifier
     * uninterpretedExpression = arbitrary string
     *
     * A quoted expression is meant to be pre-processed by an AST transformer that
     * converts it into another AST that no longer contains quoted expressions.
     * It is meant to allow third-party developers to extend Angular template
     * expression language. The `uninterpretedExpression` part of the quote is
     * therefore not interpreted by the Angular's own expression parser.
     */
    var Quote = (function (_super) {
        __extends(Quote, _super);
        function Quote(prefix, uninterpretedExpression, location) {
            _super.call(this);
            this.prefix = prefix;
            this.uninterpretedExpression = uninterpretedExpression;
            this.location = location;
        }
        Quote.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitQuote(this, context);
        };
        Quote.prototype.toString = function () { return "Quote"; };
        return Quote;
    }(AST));
    var EmptyExpr = (function (_super) {
        __extends(EmptyExpr, _super);
        function EmptyExpr() {
            _super.apply(this, arguments);
        }
        EmptyExpr.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            // do nothing
        };
        return EmptyExpr;
    }(AST));
    var ImplicitReceiver = (function (_super) {
        __extends(ImplicitReceiver, _super);
        function ImplicitReceiver() {
            _super.apply(this, arguments);
        }
        ImplicitReceiver.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitImplicitReceiver(this, context);
        };
        return ImplicitReceiver;
    }(AST));
    /**
     * Multiple expressions separated by a semicolon.
     */
    var Chain = (function (_super) {
        __extends(Chain, _super);
        function Chain(expressions) {
            _super.call(this);
            this.expressions = expressions;
        }
        Chain.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitChain(this, context);
        };
        return Chain;
    }(AST));
    var Conditional = (function (_super) {
        __extends(Conditional, _super);
        function Conditional(condition, trueExp, falseExp) {
            _super.call(this);
            this.condition = condition;
            this.trueExp = trueExp;
            this.falseExp = falseExp;
        }
        Conditional.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitConditional(this, context);
        };
        return Conditional;
    }(AST));
    var PropertyRead = (function (_super) {
        __extends(PropertyRead, _super);
        function PropertyRead(receiver, name) {
            _super.call(this);
            this.receiver = receiver;
            this.name = name;
        }
        PropertyRead.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitPropertyRead(this, context);
        };
        return PropertyRead;
    }(AST));
    var PropertyWrite = (function (_super) {
        __extends(PropertyWrite, _super);
        function PropertyWrite(receiver, name, value) {
            _super.call(this);
            this.receiver = receiver;
            this.name = name;
            this.value = value;
        }
        PropertyWrite.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitPropertyWrite(this, context);
        };
        return PropertyWrite;
    }(AST));
    var SafePropertyRead = (function (_super) {
        __extends(SafePropertyRead, _super);
        function SafePropertyRead(receiver, name) {
            _super.call(this);
            this.receiver = receiver;
            this.name = name;
        }
        SafePropertyRead.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitSafePropertyRead(this, context);
        };
        return SafePropertyRead;
    }(AST));
    var KeyedRead = (function (_super) {
        __extends(KeyedRead, _super);
        function KeyedRead(obj, key) {
            _super.call(this);
            this.obj = obj;
            this.key = key;
        }
        KeyedRead.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitKeyedRead(this, context);
        };
        return KeyedRead;
    }(AST));
    var KeyedWrite = (function (_super) {
        __extends(KeyedWrite, _super);
        function KeyedWrite(obj, key, value) {
            _super.call(this);
            this.obj = obj;
            this.key = key;
            this.value = value;
        }
        KeyedWrite.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitKeyedWrite(this, context);
        };
        return KeyedWrite;
    }(AST));
    var BindingPipe = (function (_super) {
        __extends(BindingPipe, _super);
        function BindingPipe(exp, name, args) {
            _super.call(this);
            this.exp = exp;
            this.name = name;
            this.args = args;
        }
        BindingPipe.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitPipe(this, context);
        };
        return BindingPipe;
    }(AST));
    var LiteralPrimitive = (function (_super) {
        __extends(LiteralPrimitive, _super);
        function LiteralPrimitive(value) {
            _super.call(this);
            this.value = value;
        }
        LiteralPrimitive.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitLiteralPrimitive(this, context);
        };
        return LiteralPrimitive;
    }(AST));
    var LiteralArray = (function (_super) {
        __extends(LiteralArray, _super);
        function LiteralArray(expressions) {
            _super.call(this);
            this.expressions = expressions;
        }
        LiteralArray.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitLiteralArray(this, context);
        };
        return LiteralArray;
    }(AST));
    var LiteralMap = (function (_super) {
        __extends(LiteralMap, _super);
        function LiteralMap(keys, values) {
            _super.call(this);
            this.keys = keys;
            this.values = values;
        }
        LiteralMap.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitLiteralMap(this, context);
        };
        return LiteralMap;
    }(AST));
    var Interpolation = (function (_super) {
        __extends(Interpolation, _super);
        function Interpolation(strings, expressions) {
            _super.call(this);
            this.strings = strings;
            this.expressions = expressions;
        }
        Interpolation.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitInterpolation(this, context);
        };
        return Interpolation;
    }(AST));
    var Binary = (function (_super) {
        __extends(Binary, _super);
        function Binary(operation, left, right) {
            _super.call(this);
            this.operation = operation;
            this.left = left;
            this.right = right;
        }
        Binary.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitBinary(this, context);
        };
        return Binary;
    }(AST));
    var PrefixNot = (function (_super) {
        __extends(PrefixNot, _super);
        function PrefixNot(expression) {
            _super.call(this);
            this.expression = expression;
        }
        PrefixNot.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitPrefixNot(this, context);
        };
        return PrefixNot;
    }(AST));
    var MethodCall = (function (_super) {
        __extends(MethodCall, _super);
        function MethodCall(receiver, name, args) {
            _super.call(this);
            this.receiver = receiver;
            this.name = name;
            this.args = args;
        }
        MethodCall.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitMethodCall(this, context);
        };
        return MethodCall;
    }(AST));
    var SafeMethodCall = (function (_super) {
        __extends(SafeMethodCall, _super);
        function SafeMethodCall(receiver, name, args) {
            _super.call(this);
            this.receiver = receiver;
            this.name = name;
            this.args = args;
        }
        SafeMethodCall.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitSafeMethodCall(this, context);
        };
        return SafeMethodCall;
    }(AST));
    var FunctionCall = (function (_super) {
        __extends(FunctionCall, _super);
        function FunctionCall(target, args) {
            _super.call(this);
            this.target = target;
            this.args = args;
        }
        FunctionCall.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return visitor.visitFunctionCall(this, context);
        };
        return FunctionCall;
    }(AST));
    var ASTWithSource = (function (_super) {
        __extends(ASTWithSource, _super);
        function ASTWithSource(ast, source, location) {
            _super.call(this);
            this.ast = ast;
            this.source = source;
            this.location = location;
        }
        ASTWithSource.prototype.visit = function (visitor, context) {
            if (context === void 0) { context = null; }
            return this.ast.visit(visitor, context);
        };
        ASTWithSource.prototype.toString = function () { return this.source + " in " + this.location; };
        return ASTWithSource;
    }(AST));
    var TemplateBinding = (function () {
        function TemplateBinding(key, keyIsVar, name, expression) {
            this.key = key;
            this.keyIsVar = keyIsVar;
            this.name = name;
            this.expression = expression;
        }
        return TemplateBinding;
    }());
    var RecursiveAstVisitor = (function () {
        function RecursiveAstVisitor() {
        }
        RecursiveAstVisitor.prototype.visitBinary = function (ast, context) {
            ast.left.visit(this);
            ast.right.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitChain = function (ast, context) { return this.visitAll(ast.expressions, context); };
        RecursiveAstVisitor.prototype.visitConditional = function (ast, context) {
            ast.condition.visit(this);
            ast.trueExp.visit(this);
            ast.falseExp.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitPipe = function (ast, context) {
            ast.exp.visit(this);
            this.visitAll(ast.args, context);
            return null;
        };
        RecursiveAstVisitor.prototype.visitFunctionCall = function (ast, context) {
            ast.target.visit(this);
            this.visitAll(ast.args, context);
            return null;
        };
        RecursiveAstVisitor.prototype.visitImplicitReceiver = function (ast, context) { return null; };
        RecursiveAstVisitor.prototype.visitInterpolation = function (ast, context) {
            return this.visitAll(ast.expressions, context);
        };
        RecursiveAstVisitor.prototype.visitKeyedRead = function (ast, context) {
            ast.obj.visit(this);
            ast.key.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitKeyedWrite = function (ast, context) {
            ast.obj.visit(this);
            ast.key.visit(this);
            ast.value.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitLiteralArray = function (ast, context) {
            return this.visitAll(ast.expressions, context);
        };
        RecursiveAstVisitor.prototype.visitLiteralMap = function (ast, context) { return this.visitAll(ast.values, context); };
        RecursiveAstVisitor.prototype.visitLiteralPrimitive = function (ast, context) { return null; };
        RecursiveAstVisitor.prototype.visitMethodCall = function (ast, context) {
            ast.receiver.visit(this);
            return this.visitAll(ast.args, context);
        };
        RecursiveAstVisitor.prototype.visitPrefixNot = function (ast, context) {
            ast.expression.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitPropertyRead = function (ast, context) {
            ast.receiver.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitPropertyWrite = function (ast, context) {
            ast.receiver.visit(this);
            ast.value.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitSafePropertyRead = function (ast, context) {
            ast.receiver.visit(this);
            return null;
        };
        RecursiveAstVisitor.prototype.visitSafeMethodCall = function (ast, context) {
            ast.receiver.visit(this);
            return this.visitAll(ast.args, context);
        };
        RecursiveAstVisitor.prototype.visitAll = function (asts, context) {
            var _this = this;
            asts.forEach(function (ast) { return ast.visit(_this, context); });
            return null;
        };
        RecursiveAstVisitor.prototype.visitQuote = function (ast, context) { return null; };
        return RecursiveAstVisitor;
    }());
    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["Character"] = 0] = "Character";
        TokenType[TokenType["Identifier"] = 1] = "Identifier";
        TokenType[TokenType["Keyword"] = 2] = "Keyword";
        TokenType[TokenType["String"] = 3] = "String";
        TokenType[TokenType["Operator"] = 4] = "Operator";
        TokenType[TokenType["Number"] = 5] = "Number";
    })(TokenType || (TokenType = {}));
    var Lexer = (function () {
        function Lexer() {
        }
        Lexer.prototype.tokenize = function (text) {
            var scanner = new _Scanner(text);
            var tokens = [];
            var token = scanner.scanToken();
            while (token != null) {
                tokens.push(token);
                token = scanner.scanToken();
            }
            return tokens;
        };
        return Lexer;
    }());
    Lexer.decorators = [
        { type: _angular_core.Injectable },
    ];
    var Token = (function () {
        function Token(index, type, numValue, strValue) {
            this.index = index;
            this.type = type;
            this.numValue = numValue;
            this.strValue = strValue;
        }
        Token.prototype.isCharacter = function (code) {
            return (this.type == TokenType.Character && this.numValue == code);
        };
        Token.prototype.isNumber = function () { return (this.type == TokenType.Number); };
        Token.prototype.isString = function () { return (this.type == TokenType.String); };
        Token.prototype.isOperator = function (operater) {
            return (this.type == TokenType.Operator && this.strValue == operater);
        };
        Token.prototype.isIdentifier = function () { return (this.type == TokenType.Identifier); };
        Token.prototype.isKeyword = function () { return (this.type == TokenType.Keyword); };
        Token.prototype.isKeywordDeprecatedVar = function () {
            return (this.type == TokenType.Keyword && this.strValue == "var");
        };
        Token.prototype.isKeywordLet = function () { return (this.type == TokenType.Keyword && this.strValue == "let"); };
        Token.prototype.isKeywordNull = function () { return (this.type == TokenType.Keyword && this.strValue == "null"); };
        Token.prototype.isKeywordUndefined = function () {
            return (this.type == TokenType.Keyword && this.strValue == "undefined");
        };
        Token.prototype.isKeywordTrue = function () { return (this.type == TokenType.Keyword && this.strValue == "true"); };
        Token.prototype.isKeywordFalse = function () { return (this.type == TokenType.Keyword && this.strValue == "false"); };
        Token.prototype.toNumber = function () {
            // -1 instead of NULL ok?
            return (this.type == TokenType.Number) ? this.numValue : -1;
        };
        Token.prototype.toString = function () {
            switch (this.type) {
                case TokenType.Character:
                case TokenType.Identifier:
                case TokenType.Keyword:
                case TokenType.Operator:
                case TokenType.String:
                    return this.strValue;
                case TokenType.Number:
                    return this.numValue.toString();
                default:
                    return null;
            }
        };
        return Token;
    }());
    function newCharacterToken(index, code) {
        return new Token(index, TokenType.Character, code, StringWrapper.fromCharCode(code));
    }
    function newIdentifierToken(index, text) {
        return new Token(index, TokenType.Identifier, 0, text);
    }
    function newKeywordToken(index, text) {
        return new Token(index, TokenType.Keyword, 0, text);
    }
    function newOperatorToken(index, text) {
        return new Token(index, TokenType.Operator, 0, text);
    }
    function newStringToken(index, text) {
        return new Token(index, TokenType.String, 0, text);
    }
    function newNumberToken(index, n) {
        return new Token(index, TokenType.Number, n, "");
    }
    var EOF = new Token(-1, TokenType.Character, 0, "");
    var $EOF = 0;
    var $TAB = 9;
    var $LF = 10;
    var $VTAB = 11;
    var $FF = 12;
    var $CR = 13;
    var $SPACE = 32;
    var $BANG = 33;
    var $DQ = 34;
    var $HASH = 35;
    var $$ = 36;
    var $PERCENT = 37;
    var $AMPERSAND = 38;
    var $SQ = 39;
    var $LPAREN = 40;
    var $RPAREN = 41;
    var $STAR = 42;
    var $PLUS = 43;
    var $COMMA = 44;
    var $MINUS = 45;
    var $PERIOD = 46;
    var $SLASH = 47;
    var $COLON = 58;
    var $SEMICOLON = 59;
    var $LT = 60;
    var $EQ = 61;
    var $GT = 62;
    var $QUESTION = 63;
    var $0 = 48;
    var $9 = 57;
    var $A = 65;
    var $E = 69;
    var $Z = 90;
    var $LBRACKET = 91;
    var $BACKSLASH = 92;
    var $RBRACKET = 93;
    var $CARET = 94;
    var $_ = 95;
    var $BT = 96;
    var $a = 97;
    var $e = 101;
    var $f = 102;
    var $n = 110;
    var $r = 114;
    var $t = 116;
    var $u = 117;
    var $v = 118;
    var $z = 122;
    var $LBRACE = 123;
    var $BAR = 124;
    var $RBRACE = 125;
    var $NBSP = 160;
    var ScannerError = (function (_super) {
        __extends(ScannerError, _super);
        function ScannerError(message) {
            _super.call(this);
            this.message = message;
        }
        ScannerError.prototype.toString = function () { return this.message; };
        return ScannerError;
    }(BaseException$1));
    var _Scanner = (function () {
        function _Scanner(input) {
            this.input = input;
            this.peek = 0;
            this.index = -1;
            this.length = input.length;
            this.advance();
        }
        _Scanner.prototype.advance = function () {
            this.peek =
                ++this.index >= this.length ? $EOF : StringWrapper.charCodeAt(this.input, this.index);
        };
        _Scanner.prototype.scanToken = function () {
            var input = this.input, length = this.length, peek = this.peek, index = this.index;
            // Skip whitespace.
            while (peek <= $SPACE) {
                if (++index >= length) {
                    peek = $EOF;
                    break;
                }
                else {
                    peek = StringWrapper.charCodeAt(input, index);
                }
            }
            this.peek = peek;
            this.index = index;
            if (index >= length) {
                return null;
            }
            // Handle identifiers and numbers.
            if (isIdentifierStart(peek))
                return this.scanIdentifier();
            if (isDigit(peek))
                return this.scanNumber(index);
            var start = index;
            switch (peek) {
                case $PERIOD:
                    this.advance();
                    return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, $PERIOD);
                case $LPAREN:
                case $RPAREN:
                case $LBRACE:
                case $RBRACE:
                case $LBRACKET:
                case $RBRACKET:
                case $COMMA:
                case $COLON:
                case $SEMICOLON:
                    return this.scanCharacter(start, peek);
                case $SQ:
                case $DQ:
                    return this.scanString();
                case $HASH:
                case $PLUS:
                case $MINUS:
                case $STAR:
                case $SLASH:
                case $PERCENT:
                case $CARET:
                    return this.scanOperator(start, StringWrapper.fromCharCode(peek));
                case $QUESTION:
                    return this.scanComplexOperator(start, '?', $PERIOD, '.');
                case $LT:
                case $GT:
                    return this.scanComplexOperator(start, StringWrapper.fromCharCode(peek), $EQ, '=');
                case $BANG:
                case $EQ:
                    return this.scanComplexOperator(start, StringWrapper.fromCharCode(peek), $EQ, '=', $EQ, '=');
                case $AMPERSAND:
                    return this.scanComplexOperator(start, '&', $AMPERSAND, '&');
                case $BAR:
                    return this.scanComplexOperator(start, '|', $BAR, '|');
                case $NBSP:
                    while (isWhitespace(this.peek))
                        this.advance();
                    return this.scanToken();
            }
            this.error("Unexpected character [" + StringWrapper.fromCharCode(peek) + "]", 0);
            return null;
        };
        _Scanner.prototype.scanCharacter = function (start, code) {
            this.advance();
            return newCharacterToken(start, code);
        };
        _Scanner.prototype.scanOperator = function (start, str) {
            this.advance();
            return newOperatorToken(start, str);
        };
        /**
         * Tokenize a 2/3 char long operator
         *
         * @param start start index in the expression
         * @param one first symbol (always part of the operator)
         * @param twoCode code point for the second symbol
         * @param two second symbol (part of the operator when the second code point matches)
         * @param threeCode code point for the third symbol
         * @param three third symbol (part of the operator when provided and matches source expression)
         * @returns {Token}
         */
        _Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
            this.advance();
            var str = one;
            if (this.peek == twoCode) {
                this.advance();
                str += two;
            }
            if (isPresent(threeCode) && this.peek == threeCode) {
                this.advance();
                str += three;
            }
            return newOperatorToken(start, str);
        };
        _Scanner.prototype.scanIdentifier = function () {
            var start = this.index;
            this.advance();
            while (isIdentifierPart(this.peek))
                this.advance();
            var str = this.input.substring(start, this.index);
            if (SetWrapper.has(KEYWORDS, str)) {
                return newKeywordToken(start, str);
            }
            else {
                return newIdentifierToken(start, str);
            }
        };
        _Scanner.prototype.scanNumber = function (start) {
            var simple = (this.index === start);
            this.advance(); // Skip initial digit.
            while (true) {
                if (isDigit(this.peek)) {
                }
                else if (this.peek == $PERIOD) {
                    simple = false;
                }
                else if (isExponentStart(this.peek)) {
                    this.advance();
                    if (isExponentSign(this.peek))
                        this.advance();
                    if (!isDigit(this.peek))
                        this.error('Invalid exponent', -1);
                    simple = false;
                }
                else {
                    break;
                }
                this.advance();
            }
            var str = this.input.substring(start, this.index);
            // TODO
            var value = simple ? NumberWrapper.parseIntAutoRadix(str) : NumberWrapper.parseFloat(str);
            return newNumberToken(start, value);
        };
        _Scanner.prototype.scanString = function () {
            var start = this.index;
            var quote = this.peek;
            this.advance(); // Skip initial quote.
            var buffer;
            var marker = this.index;
            var input = this.input;
            while (this.peek != quote) {
                if (this.peek == $BACKSLASH) {
                    if (buffer == null)
                        buffer = new StringJoiner();
                    buffer.add(input.substring(marker, this.index));
                    this.advance();
                    var unescapedCode;
                    if (this.peek == $u) {
                        // 4 character hex code for unicode character.
                        var hex = input.substring(this.index + 1, this.index + 5);
                        try {
                            unescapedCode = NumberWrapper.parseInt(hex, 16);
                        }
                        catch (e) {
                            this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                        }
                        for (var i = 0; i < 5; i++) {
                            this.advance();
                        }
                    }
                    else {
                        unescapedCode = unescape(this.peek);
                        this.advance();
                    }
                    buffer.add(StringWrapper.fromCharCode(unescapedCode));
                    marker = this.index;
                }
                else if (this.peek == $EOF) {
                    this.error('Unterminated quote', 0);
                }
                else {
                    this.advance();
                }
            }
            var last = input.substring(marker, this.index);
            this.advance(); // Skip terminating quote.
            // Compute the unescaped string value.
            var unescaped = last;
            if (buffer != null) {
                buffer.add(last);
                unescaped = buffer.toString();
            }
            return newStringToken(start, unescaped);
        };
        _Scanner.prototype.error = function (message, offset) {
            var position = this.index + offset;
            throw new ScannerError("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
        };
        return _Scanner;
    }());
    function isWhitespace(code) {
        return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
    }
    function isIdentifierStart(code) {
        return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == $$);
    }
    function isIdentifier(input) {
        if (input.length == 0)
            return false;
        var scanner = new _Scanner(input);
        if (!isIdentifierStart(scanner.peek))
            return false;
        scanner.advance();
        while (scanner.peek !== $EOF) {
            if (!isIdentifierPart(scanner.peek))
                return false;
            scanner.advance();
        }
        return true;
    }
    function isIdentifierPart(code) {
        return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) ||
            (code == $_) || (code == $$);
    }
    function isDigit(code) {
        return $0 <= code && code <= $9;
    }
    function isExponentStart(code) {
        return code == $e || code == $E;
    }
    function isExponentSign(code) {
        return code == $MINUS || code == $PLUS;
    }
    function isQuote(code) {
        return code === $SQ || code === $DQ || code === $BT;
    }
    function unescape(code) {
        switch (code) {
            case $n:
                return $LF;
            case $f:
                return $FF;
            case $r:
                return $CR;
            case $t:
                return $TAB;
            case $v:
                return $VTAB;
            default:
                return code;
        }
    }
    var OPERATORS = SetWrapper.createFromList([
        '+',
        '-',
        '*',
        '/',
        '%',
        '^',
        '=',
        '==',
        '!=',
        '===',
        '!==',
        '<',
        '>',
        '<=',
        '>=',
        '&&',
        '||',
        '&',
        '|',
        '!',
        '?',
        '#',
        '?.'
    ]);
    var KEYWORDS = SetWrapper.createFromList(['var', 'let', 'null', 'undefined', 'true', 'false', 'if', 'else']);
    var _implicitReceiver = new ImplicitReceiver();
    // TODO(tbosch): Cannot make this const/final right now because of the transpiler...
    var INTERPOLATION_REGEXP = /\{\{([\s\S]*?)\}\}/g;
    var ParseException = (function (_super) {
        __extends(ParseException, _super);
        function ParseException(message, input, errLocation, ctxLocation) {
            _super.call(this, "Parser Error: " + message + " " + errLocation + " [" + input + "] in " + ctxLocation);
        }
        return ParseException;
    }(BaseException$1));
    var SplitInterpolation = (function () {
        function SplitInterpolation(strings, expressions) {
            this.strings = strings;
            this.expressions = expressions;
        }
        return SplitInterpolation;
    }());
    var TemplateBindingParseResult = (function () {
        function TemplateBindingParseResult(templateBindings, warnings) {
            this.templateBindings = templateBindings;
            this.warnings = warnings;
        }
        return TemplateBindingParseResult;
    }());
    var Parser = (function () {
        function Parser(/** @internal */ _lexer) {
            this._lexer = _lexer;
        }
        Parser.prototype.parseAction = function (input, location) {
            this._checkNoInterpolation(input, location);
            var tokens = this._lexer.tokenize(this._stripComments(input));
            var ast = new _ParseAST(input, location, tokens, true).parseChain();
            return new ASTWithSource(ast, input, location);
        };
        Parser.prototype.parseBinding = function (input, location) {
            var ast = this._parseBindingAst(input, location);
            return new ASTWithSource(ast, input, location);
        };
        Parser.prototype.parseSimpleBinding = function (input, location) {
            var ast = this._parseBindingAst(input, location);
            if (!SimpleExpressionChecker.check(ast)) {
                throw new ParseException('Host binding expression can only contain field access and constants', input, location);
            }
            return new ASTWithSource(ast, input, location);
        };
        Parser.prototype._parseBindingAst = function (input, location) {
            // Quotes expressions use 3rd-party expression language. We don't want to use
            // our lexer or parser for that, so we check for that ahead of time.
            var quote = this._parseQuote(input, location);
            if (isPresent(quote)) {
                return quote;
            }
            this._checkNoInterpolation(input, location);
            var tokens = this._lexer.tokenize(this._stripComments(input));
            return new _ParseAST(input, location, tokens, false).parseChain();
        };
        Parser.prototype._parseQuote = function (input, location) {
            if (isBlank(input))
                return null;
            var prefixSeparatorIndex = input.indexOf(':');
            if (prefixSeparatorIndex == -1)
                return null;
            var prefix = input.substring(0, prefixSeparatorIndex).trim();
            if (!isIdentifier(prefix))
                return null;
            var uninterpretedExpression = input.substring(prefixSeparatorIndex + 1);
            return new Quote(prefix, uninterpretedExpression, location);
        };
        Parser.prototype.parseTemplateBindings = function (input, location) {
            var tokens = this._lexer.tokenize(input);
            return new _ParseAST(input, location, tokens, false).parseTemplateBindings();
        };
        Parser.prototype.parseInterpolation = function (input, location) {
            var split = this.splitInterpolation(input, location);
            if (split == null)
                return null;
            var expressions = [];
            for (var i = 0; i < split.expressions.length; ++i) {
                var tokens = this._lexer.tokenize(this._stripComments(split.expressions[i]));
                var ast = new _ParseAST(input, location, tokens, false).parseChain();
                expressions.push(ast);
            }
            return new ASTWithSource(new Interpolation(split.strings, expressions), input, location);
        };
        Parser.prototype.splitInterpolation = function (input, location) {
            var parts = StringWrapper.split(input, INTERPOLATION_REGEXP);
            if (parts.length <= 1) {
                return null;
            }
            var strings = [];
            var expressions = [];
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (i % 2 === 0) {
                    // fixed string
                    strings.push(part);
                }
                else if (part.trim().length > 0) {
                    expressions.push(part);
                }
                else {
                    throw new ParseException('Blank expressions are not allowed in interpolated strings', input, "at column " + this._findInterpolationErrorColumn(parts, i) + " in", location);
                }
            }
            return new SplitInterpolation(strings, expressions);
        };
        Parser.prototype.wrapLiteralPrimitive = function (input, location) {
            return new ASTWithSource(new LiteralPrimitive(input), input, location);
        };
        Parser.prototype._stripComments = function (input) {
            var i = this._commentStart(input);
            return isPresent(i) ? input.substring(0, i).trim() : input;
        };
        Parser.prototype._commentStart = function (input) {
            var outerQuote = null;
            for (var i = 0; i < input.length - 1; i++) {
                var char = StringWrapper.charCodeAt(input, i);
                var nextChar = StringWrapper.charCodeAt(input, i + 1);
                if (char === $SLASH && nextChar == $SLASH && isBlank(outerQuote))
                    return i;
                if (outerQuote === char) {
                    outerQuote = null;
                }
                else if (isBlank(outerQuote) && isQuote(char)) {
                    outerQuote = char;
                }
            }
            return null;
        };
        Parser.prototype._checkNoInterpolation = function (input, location) {
            var parts = StringWrapper.split(input, INTERPOLATION_REGEXP);
            if (parts.length > 1) {
                throw new ParseException('Got interpolation ({{}}) where expression was expected', input, "at column " + this._findInterpolationErrorColumn(parts, 1) + " in", location);
            }
        };
        Parser.prototype._findInterpolationErrorColumn = function (parts, partInErrIdx) {
            var errLocation = '';
            for (var j = 0; j < partInErrIdx; j++) {
                errLocation += j % 2 === 0 ? parts[j] : "{{" + parts[j] + "}}";
            }
            return errLocation.length;
        };
        return Parser;
    }());
    Parser.decorators = [
        { type: _angular_core.Injectable },
    ];
    Parser.ctorParameters = [
        { type: Lexer, },
    ];
    var _ParseAST = (function () {
        function _ParseAST(input, location, tokens, parseAction) {
            this.input = input;
            this.location = location;
            this.tokens = tokens;
            this.parseAction = parseAction;
            this.index = 0;
        }
        _ParseAST.prototype.peek = function (offset) {
            var i = this.index + offset;
            return i < this.tokens.length ? this.tokens[i] : EOF;
        };
        Object.defineProperty(_ParseAST.prototype, "next", {
            get: function () { return this.peek(0); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(_ParseAST.prototype, "inputIndex", {
            get: function () {
                return (this.index < this.tokens.length) ? this.next.index : this.input.length;
            },
            enumerable: true,
            configurable: true
        });
        _ParseAST.prototype.advance = function () { this.index++; };
        _ParseAST.prototype.optionalCharacter = function (code) {
            if (this.next.isCharacter(code)) {
                this.advance();
                return true;
            }
            else {
                return false;
            }
        };
        _ParseAST.prototype.peekKeywordLet = function () { return this.next.isKeywordLet(); };
        _ParseAST.prototype.peekDeprecatedKeywordVar = function () { return this.next.isKeywordDeprecatedVar(); };
        _ParseAST.prototype.peekDeprecatedOperatorHash = function () { return this.next.isOperator('#'); };
        _ParseAST.prototype.expectCharacter = function (code) {
            if (this.optionalCharacter(code))
                return;
            this.error("Missing expected " + StringWrapper.fromCharCode(code));
        };
        _ParseAST.prototype.optionalOperator = function (op) {
            if (this.next.isOperator(op)) {
                this.advance();
                return true;
            }
            else {
                return false;
            }
        };
        _ParseAST.prototype.expectOperator = function (operator) {
            if (this.optionalOperator(operator))
                return;
            this.error("Missing expected operator " + operator);
        };
        _ParseAST.prototype.expectIdentifierOrKeyword = function () {
            var n = this.next;
            if (!n.isIdentifier() && !n.isKeyword()) {
                this.error("Unexpected token " + n + ", expected identifier or keyword");
            }
            this.advance();
            return n.toString();
        };
        _ParseAST.prototype.expectIdentifierOrKeywordOrString = function () {
            var n = this.next;
            if (!n.isIdentifier() && !n.isKeyword() && !n.isString()) {
                this.error("Unexpected token " + n + ", expected identifier, keyword, or string");
            }
            this.advance();
            return n.toString();
        };
        _ParseAST.prototype.parseChain = function () {
            var exprs = [];
            while (this.index < this.tokens.length) {
                var expr = this.parsePipe();
                exprs.push(expr);
                if (this.optionalCharacter($SEMICOLON)) {
                    if (!this.parseAction) {
                        this.error("Binding expression cannot contain chained expression");
                    }
                    while (this.optionalCharacter($SEMICOLON)) {
                    } // read all semicolons
                }
                else if (this.index < this.tokens.length) {
                    this.error("Unexpected token '" + this.next + "'");
                }
            }
            if (exprs.length == 0)
                return new EmptyExpr();
            if (exprs.length == 1)
                return exprs[0];
            return new Chain(exprs);
        };
        _ParseAST.prototype.parsePipe = function () {
            var result = this.parseExpression();
            if (this.optionalOperator("|")) {
                if (this.parseAction) {
                    this.error("Cannot have a pipe in an action expression");
                }
                do {
                    var name = this.expectIdentifierOrKeyword();
                    var args = [];
                    while (this.optionalCharacter($COLON)) {
                        args.push(this.parseExpression());
                    }
                    result = new BindingPipe(result, name, args);
                } while (this.optionalOperator("|"));
            }
            return result;
        };
        _ParseAST.prototype.parseExpression = function () { return this.parseConditional(); };
        _ParseAST.prototype.parseConditional = function () {
            var start = this.inputIndex;
            var result = this.parseLogicalOr();
            if (this.optionalOperator('?')) {
                var yes = this.parsePipe();
                if (!this.optionalCharacter($COLON)) {
                    var end = this.inputIndex;
                    var expression = this.input.substring(start, end);
                    this.error("Conditional expression " + expression + " requires all 3 expressions");
                }
                var no = this.parsePipe();
                return new Conditional(result, yes, no);
            }
            else {
                return result;
            }
        };
        _ParseAST.prototype.parseLogicalOr = function () {
            // '||'
            var result = this.parseLogicalAnd();
            while (this.optionalOperator('||')) {
                result = new Binary('||', result, this.parseLogicalAnd());
            }
            return result;
        };
        _ParseAST.prototype.parseLogicalAnd = function () {
            // '&&'
            var result = this.parseEquality();
            while (this.optionalOperator('&&')) {
                result = new Binary('&&', result, this.parseEquality());
            }
            return result;
        };
        _ParseAST.prototype.parseEquality = function () {
            // '==','!=','===','!=='
            var result = this.parseRelational();
            while (true) {
                if (this.optionalOperator('==')) {
                    result = new Binary('==', result, this.parseRelational());
                }
                else if (this.optionalOperator('===')) {
                    result = new Binary('===', result, this.parseRelational());
                }
                else if (this.optionalOperator('!=')) {
                    result = new Binary('!=', result, this.parseRelational());
                }
                else if (this.optionalOperator('!==')) {
                    result = new Binary('!==', result, this.parseRelational());
                }
                else {
                    return result;
                }
            }
        };
        _ParseAST.prototype.parseRelational = function () {
            // '<', '>', '<=', '>='
            var result = this.parseAdditive();
            while (true) {
                if (this.optionalOperator('<')) {
                    result = new Binary('<', result, this.parseAdditive());
                }
                else if (this.optionalOperator('>')) {
                    result = new Binary('>', result, this.parseAdditive());
                }
                else if (this.optionalOperator('<=')) {
                    result = new Binary('<=', result, this.parseAdditive());
                }
                else if (this.optionalOperator('>=')) {
                    result = new Binary('>=', result, this.parseAdditive());
                }
                else {
                    return result;
                }
            }
        };
        _ParseAST.prototype.parseAdditive = function () {
            // '+', '-'
            var result = this.parseMultiplicative();
            while (true) {
                if (this.optionalOperator('+')) {
                    result = new Binary('+', result, this.parseMultiplicative());
                }
                else if (this.optionalOperator('-')) {
                    result = new Binary('-', result, this.parseMultiplicative());
                }
                else {
                    return result;
                }
            }
        };
        _ParseAST.prototype.parseMultiplicative = function () {
            // '*', '%', '/'
            var result = this.parsePrefix();
            while (true) {
                if (this.optionalOperator('*')) {
                    result = new Binary('*', result, this.parsePrefix());
                }
                else if (this.optionalOperator('%')) {
                    result = new Binary('%', result, this.parsePrefix());
                }
                else if (this.optionalOperator('/')) {
                    result = new Binary('/', result, this.parsePrefix());
                }
                else {
                    return result;
                }
            }
        };
        _ParseAST.prototype.parsePrefix = function () {
            if (this.optionalOperator('+')) {
                return this.parsePrefix();
            }
            else if (this.optionalOperator('-')) {
                return new Binary('-', new LiteralPrimitive(0), this.parsePrefix());
            }
            else if (this.optionalOperator('!')) {
                return new PrefixNot(this.parsePrefix());
            }
            else {
                return this.parseCallChain();
            }
        };
        _ParseAST.prototype.parseCallChain = function () {
            var result = this.parsePrimary();
            while (true) {
                if (this.optionalCharacter($PERIOD)) {
                    result = this.parseAccessMemberOrMethodCall(result, false);
                }
                else if (this.optionalOperator('?.')) {
                    result = this.parseAccessMemberOrMethodCall(result, true);
                }
                else if (this.optionalCharacter($LBRACKET)) {
                    var key = this.parsePipe();
                    this.expectCharacter($RBRACKET);
                    if (this.optionalOperator("=")) {
                        var value = this.parseConditional();
                        result = new KeyedWrite(result, key, value);
                    }
                    else {
                        result = new KeyedRead(result, key);
                    }
                }
                else if (this.optionalCharacter($LPAREN)) {
                    var args = this.parseCallArguments();
                    this.expectCharacter($RPAREN);
                    result = new FunctionCall(result, args);
                }
                else {
                    return result;
                }
            }
        };
        _ParseAST.prototype.parsePrimary = function () {
            if (this.optionalCharacter($LPAREN)) {
                var result = this.parsePipe();
                this.expectCharacter($RPAREN);
                return result;
            }
            else if (this.next.isKeywordNull() || this.next.isKeywordUndefined()) {
                this.advance();
                return new LiteralPrimitive(null);
            }
            else if (this.next.isKeywordTrue()) {
                this.advance();
                return new LiteralPrimitive(true);
            }
            else if (this.next.isKeywordFalse()) {
                this.advance();
                return new LiteralPrimitive(false);
            }
            else if (this.optionalCharacter($LBRACKET)) {
                var elements = this.parseExpressionList($RBRACKET);
                this.expectCharacter($RBRACKET);
                return new LiteralArray(elements);
            }
            else if (this.next.isCharacter($LBRACE)) {
                return this.parseLiteralMap();
            }
            else if (this.next.isIdentifier()) {
                return this.parseAccessMemberOrMethodCall(_implicitReceiver, false);
            }
            else if (this.next.isNumber()) {
                var value = this.next.toNumber();
                this.advance();
                return new LiteralPrimitive(value);
            }
            else if (this.next.isString()) {
                var literalValue = this.next.toString();
                this.advance();
                return new LiteralPrimitive(literalValue);
            }
            else if (this.index >= this.tokens.length) {
                this.error("Unexpected end of expression: " + this.input);
            }
            else {
                this.error("Unexpected token " + this.next);
            }
            // error() throws, so we don't reach here.
            throw new BaseException$1("Fell through all cases in parsePrimary");
        };
        _ParseAST.prototype.parseExpressionList = function (terminator) {
            var result = [];
            if (!this.next.isCharacter(terminator)) {
                do {
                    result.push(this.parsePipe());
                } while (this.optionalCharacter($COMMA));
            }
            return result;
        };
        _ParseAST.prototype.parseLiteralMap = function () {
            var keys = [];
            var values = [];
            this.expectCharacter($LBRACE);
            if (!this.optionalCharacter($RBRACE)) {
                do {
                    var key = this.expectIdentifierOrKeywordOrString();
                    keys.push(key);
                    this.expectCharacter($COLON);
                    values.push(this.parsePipe());
                } while (this.optionalCharacter($COMMA));
                this.expectCharacter($RBRACE);
            }
            return new LiteralMap(keys, values);
        };
        _ParseAST.prototype.parseAccessMemberOrMethodCall = function (receiver, isSafe) {
            if (isSafe === void 0) { isSafe = false; }
            var id = this.expectIdentifierOrKeyword();
            if (this.optionalCharacter($LPAREN)) {
                var args = this.parseCallArguments();
                this.expectCharacter($RPAREN);
                return isSafe ? new SafeMethodCall(receiver, id, args) : new MethodCall(receiver, id, args);
            }
            else {
                if (isSafe) {
                    if (this.optionalOperator("=")) {
                        this.error("The '?.' operator cannot be used in the assignment");
                    }
                    else {
                        return new SafePropertyRead(receiver, id);
                    }
                }
                else {
                    if (this.optionalOperator("=")) {
                        if (!this.parseAction) {
                            this.error("Bindings cannot contain assignments");
                        }
                        var value = this.parseConditional();
                        return new PropertyWrite(receiver, id, value);
                    }
                    else {
                        return new PropertyRead(receiver, id);
                    }
                }
            }
            return null;
        };
        _ParseAST.prototype.parseCallArguments = function () {
            if (this.next.isCharacter($RPAREN))
                return [];
            var positionals = [];
            do {
                positionals.push(this.parsePipe());
            } while (this.optionalCharacter($COMMA));
            return positionals;
        };
        _ParseAST.prototype.parseBlockContent = function () {
            if (!this.parseAction) {
                this.error("Binding expression cannot contain chained expression");
            }
            var exprs = [];
            while (this.index < this.tokens.length && !this.next.isCharacter($RBRACE)) {
                var expr = this.parseExpression();
                exprs.push(expr);
                if (this.optionalCharacter($SEMICOLON)) {
                    while (this.optionalCharacter($SEMICOLON)) {
                    } // read all semicolons
                }
            }
            if (exprs.length == 0)
                return new EmptyExpr();
            if (exprs.length == 1)
                return exprs[0];
            return new Chain(exprs);
        };
        /**
         * An identifier, a keyword, a string with an optional `-` inbetween.
         */
        _ParseAST.prototype.expectTemplateBindingKey = function () {
            var result = '';
            var operatorFound = false;
            do {
                result += this.expectIdentifierOrKeywordOrString();
                operatorFound = this.optionalOperator('-');
                if (operatorFound) {
                    result += '-';
                }
            } while (operatorFound);
            return result.toString();
        };
        _ParseAST.prototype.parseTemplateBindings = function () {
            var bindings = [];
            var prefix = null;
            var warnings = [];
            while (this.index < this.tokens.length) {
                var keyIsVar = this.peekKeywordLet();
                if (!keyIsVar && this.peekDeprecatedKeywordVar()) {
                    keyIsVar = true;
                    warnings.push("\"var\" inside of expressions is deprecated. Use \"let\" instead!");
                }
                if (!keyIsVar && this.peekDeprecatedOperatorHash()) {
                    keyIsVar = true;
                    warnings.push("\"#\" inside of expressions is deprecated. Use \"let\" instead!");
                }
                if (keyIsVar) {
                    this.advance();
                }
                var key = this.expectTemplateBindingKey();
                if (!keyIsVar) {
                    if (prefix == null) {
                        prefix = key;
                    }
                    else {
                        key = prefix + key[0].toUpperCase() + key.substring(1);
                    }
                }
                this.optionalCharacter($COLON);
                var name = null;
                var expression = null;
                if (keyIsVar) {
                    if (this.optionalOperator("=")) {
                        name = this.expectTemplateBindingKey();
                    }
                    else {
                        name = '\$implicit';
                    }
                }
                else if (this.next !== EOF && !this.peekKeywordLet() && !this.peekDeprecatedKeywordVar() &&
                    !this.peekDeprecatedOperatorHash()) {
                    var start = this.inputIndex;
                    var ast = this.parsePipe();
                    var source = this.input.substring(start, this.inputIndex);
                    expression = new ASTWithSource(ast, source, this.location);
                }
                bindings.push(new TemplateBinding(key, keyIsVar, name, expression));
                if (!this.optionalCharacter($SEMICOLON)) {
                    this.optionalCharacter($COMMA);
                }
            }
            return new TemplateBindingParseResult(bindings, warnings);
        };
        _ParseAST.prototype.error = function (message, index) {
            if (index === void 0) { index = null; }
            if (isBlank(index))
                index = this.index;
            var location = (index < this.tokens.length) ? "at column " + (this.tokens[index].index + 1) + " in" :
                "at the end of the expression";
            throw new ParseException(message, this.input, location, this.location);
        };
        return _ParseAST;
    }());
    var SimpleExpressionChecker = (function () {
        function SimpleExpressionChecker() {
            this.simple = true;
        }
        SimpleExpressionChecker.check = function (ast) {
            var s = new SimpleExpressionChecker();
            ast.visit(s);
            return s.simple;
        };
        SimpleExpressionChecker.prototype.visitImplicitReceiver = function (ast, context) { };
        SimpleExpressionChecker.prototype.visitInterpolation = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitLiteralPrimitive = function (ast, context) { };
        SimpleExpressionChecker.prototype.visitPropertyRead = function (ast, context) { };
        SimpleExpressionChecker.prototype.visitPropertyWrite = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitSafePropertyRead = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitMethodCall = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitSafeMethodCall = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitFunctionCall = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitLiteralArray = function (ast, context) { this.visitAll(ast.expressions); };
        SimpleExpressionChecker.prototype.visitLiteralMap = function (ast, context) { this.visitAll(ast.values); };
        SimpleExpressionChecker.prototype.visitBinary = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitPrefixNot = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitConditional = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitPipe = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitKeyedRead = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitKeyedWrite = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitAll = function (asts) {
            var res = ListWrapper.createFixedSize(asts.length);
            for (var i = 0; i < asts.length; ++i) {
                res[i] = asts[i].visit(this);
            }
            return res;
        };
        SimpleExpressionChecker.prototype.visitChain = function (ast, context) { this.simple = false; };
        SimpleExpressionChecker.prototype.visitQuote = function (ast, context) { this.simple = false; };
        return SimpleExpressionChecker;
    }());
    var HtmlTextAst = (function () {
        function HtmlTextAst(value, sourceSpan) {
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        HtmlTextAst.prototype.visit = function (visitor, context) { return visitor.visitText(this, context); };
        return HtmlTextAst;
    }());
    var HtmlExpansionAst = (function () {
        function HtmlExpansionAst(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
            this.switchValue = switchValue;
            this.type = type;
            this.cases = cases;
            this.sourceSpan = sourceSpan;
            this.switchValueSourceSpan = switchValueSourceSpan;
        }
        HtmlExpansionAst.prototype.visit = function (visitor, context) {
            return visitor.visitExpansion(this, context);
        };
        return HtmlExpansionAst;
    }());
    var HtmlExpansionCaseAst = (function () {
        function HtmlExpansionCaseAst(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
            this.value = value;
            this.expression = expression;
            this.sourceSpan = sourceSpan;
            this.valueSourceSpan = valueSourceSpan;
            this.expSourceSpan = expSourceSpan;
        }
        HtmlExpansionCaseAst.prototype.visit = function (visitor, context) {
            return visitor.visitExpansionCase(this, context);
        };
        return HtmlExpansionCaseAst;
    }());
    var HtmlAttrAst = (function () {
        function HtmlAttrAst(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        HtmlAttrAst.prototype.visit = function (visitor, context) { return visitor.visitAttr(this, context); };
        return HtmlAttrAst;
    }());
    var HtmlElementAst = (function () {
        function HtmlElementAst(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
            this.name = name;
            this.attrs = attrs;
            this.children = children;
            this.sourceSpan = sourceSpan;
            this.startSourceSpan = startSourceSpan;
            this.endSourceSpan = endSourceSpan;
        }
        HtmlElementAst.prototype.visit = function (visitor, context) { return visitor.visitElement(this, context); };
        return HtmlElementAst;
    }());
    var HtmlCommentAst = (function () {
        function HtmlCommentAst(value, sourceSpan) {
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        HtmlCommentAst.prototype.visit = function (visitor, context) { return visitor.visitComment(this, context); };
        return HtmlCommentAst;
    }());
    function htmlVisitAll(visitor, asts, context) {
        if (context === void 0) { context = null; }
        var result = [];
        asts.forEach(function (ast) {
            var astResult = ast.visit(visitor, context);
            if (isPresent(astResult)) {
                result.push(astResult);
            }
        });
        return result;
    }
    var ParseLocation = (function () {
        function ParseLocation(file, offset, line, col) {
            this.file = file;
            this.offset = offset;
            this.line = line;
            this.col = col;
        }
        ParseLocation.prototype.toString = function () { return this.file.url + "@" + this.line + ":" + this.col; };
        return ParseLocation;
    }());
    var ParseSourceFile = (function () {
        function ParseSourceFile(content, url) {
            this.content = content;
            this.url = url;
        }
        return ParseSourceFile;
    }());
    var ParseSourceSpan = (function () {
        function ParseSourceSpan(start, end) {
            this.start = start;
            this.end = end;
        }
        ParseSourceSpan.prototype.toString = function () {
            return this.start.file.content.substring(this.start.offset, this.end.offset);
        };
        return ParseSourceSpan;
    }());
    var ParseErrorLevel;
    (function (ParseErrorLevel) {
        ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
        ParseErrorLevel[ParseErrorLevel["FATAL"] = 1] = "FATAL";
    })(ParseErrorLevel || (ParseErrorLevel = {}));
    var ParseError = (function () {
        function ParseError(span, msg, level) {
            if (level === void 0) { level = ParseErrorLevel.FATAL; }
            this.span = span;
            this.msg = msg;
            this.level = level;
        }
        ParseError.prototype.toString = function () {
            var source = this.span.start.file.content;
            var ctxStart = this.span.start.offset;
            if (ctxStart > source.length - 1) {
                ctxStart = source.length - 1;
            }
            var ctxEnd = ctxStart;
            var ctxLen = 0;
            var ctxLines = 0;
            while (ctxLen < 100 && ctxStart > 0) {
                ctxStart--;
                ctxLen++;
                if (source[ctxStart] == "\n") {
                    if (++ctxLines == 3) {
                        break;
                    }
                }
            }
            ctxLen = 0;
            ctxLines = 0;
            while (ctxLen < 100 && ctxEnd < source.length - 1) {
                ctxEnd++;
                ctxLen++;
                if (source[ctxEnd] == "\n") {
                    if (++ctxLines == 3) {
                        break;
                    }
                }
            }
            var context = source.substring(ctxStart, this.span.start.offset) + '[ERROR ->]' +
                source.substring(this.span.start.offset, ctxEnd + 1);
            return this.msg + " (\"" + context + "\"): " + this.span.start;
        };
        return ParseError;
    }());
    // see http://www.w3.org/TR/html51/syntax.html#named-character-references
    // see https://html.spec.whatwg.org/multipage/entities.json
    // This list is not exhaustive to keep the compiler footprint low.
    // The `&#123;` / `&#x1ab;` syntax should be used when the named character reference does not exist.
    var NAMED_ENTITIES = {
        'Aacute': '\u00C1',
        'aacute': '\u00E1',
        'Acirc': '\u00C2',
        'acirc': '\u00E2',
        'acute': '\u00B4',
        'AElig': '\u00C6',
        'aelig': '\u00E6',
        'Agrave': '\u00C0',
        'agrave': '\u00E0',
        'alefsym': '\u2135',
        'Alpha': '\u0391',
        'alpha': '\u03B1',
        'amp': '&',
        'and': '\u2227',
        'ang': '\u2220',
        'apos': '\u0027',
        'Aring': '\u00C5',
        'aring': '\u00E5',
        'asymp': '\u2248',
        'Atilde': '\u00C3',
        'atilde': '\u00E3',
        'Auml': '\u00C4',
        'auml': '\u00E4',
        'bdquo': '\u201E',
        'Beta': '\u0392',
        'beta': '\u03B2',
        'brvbar': '\u00A6',
        'bull': '\u2022',
        'cap': '\u2229',
        'Ccedil': '\u00C7',
        'ccedil': '\u00E7',
        'cedil': '\u00B8',
        'cent': '\u00A2',
        'Chi': '\u03A7',
        'chi': '\u03C7',
        'circ': '\u02C6',
        'clubs': '\u2663',
        'cong': '\u2245',
        'copy': '\u00A9',
        'crarr': '\u21B5',
        'cup': '\u222A',
        'curren': '\u00A4',
        'dagger': '\u2020',
        'Dagger': '\u2021',
        'darr': '\u2193',
        'dArr': '\u21D3',
        'deg': '\u00B0',
        'Delta': '\u0394',
        'delta': '\u03B4',
        'diams': '\u2666',
        'divide': '\u00F7',
        'Eacute': '\u00C9',
        'eacute': '\u00E9',
        'Ecirc': '\u00CA',
        'ecirc': '\u00EA',
        'Egrave': '\u00C8',
        'egrave': '\u00E8',
        'empty': '\u2205',
        'emsp': '\u2003',
        'ensp': '\u2002',
        'Epsilon': '\u0395',
        'epsilon': '\u03B5',
        'equiv': '\u2261',
        'Eta': '\u0397',
        'eta': '\u03B7',
        'ETH': '\u00D0',
        'eth': '\u00F0',
        'Euml': '\u00CB',
        'euml': '\u00EB',
        'euro': '\u20AC',
        'exist': '\u2203',
        'fnof': '\u0192',
        'forall': '\u2200',
        'frac12': '\u00BD',
        'frac14': '\u00BC',
        'frac34': '\u00BE',
        'frasl': '\u2044',
        'Gamma': '\u0393',
        'gamma': '\u03B3',
        'ge': '\u2265',
        'gt': '>',
        'harr': '\u2194',
        'hArr': '\u21D4',
        'hearts': '\u2665',
        'hellip': '\u2026',
        'Iacute': '\u00CD',
        'iacute': '\u00ED',
        'Icirc': '\u00CE',
        'icirc': '\u00EE',
        'iexcl': '\u00A1',
        'Igrave': '\u00CC',
        'igrave': '\u00EC',
        'image': '\u2111',
        'infin': '\u221E',
        'int': '\u222B',
        'Iota': '\u0399',
        'iota': '\u03B9',
        'iquest': '\u00BF',
        'isin': '\u2208',
        'Iuml': '\u00CF',
        'iuml': '\u00EF',
        'Kappa': '\u039A',
        'kappa': '\u03BA',
        'Lambda': '\u039B',
        'lambda': '\u03BB',
        'lang': '\u27E8',
        'laquo': '\u00AB',
        'larr': '\u2190',
        'lArr': '\u21D0',
        'lceil': '\u2308',
        'ldquo': '\u201C',
        'le': '\u2264',
        'lfloor': '\u230A',
        'lowast': '\u2217',
        'loz': '\u25CA',
        'lrm': '\u200E',
        'lsaquo': '\u2039',
        'lsquo': '\u2018',
        'lt': '<',
        'macr': '\u00AF',
        'mdash': '\u2014',
        'micro': '\u00B5',
        'middot': '\u00B7',
        'minus': '\u2212',
        'Mu': '\u039C',
        'mu': '\u03BC',
        'nabla': '\u2207',
        'nbsp': '\u00A0',
        'ndash': '\u2013',
        'ne': '\u2260',
        'ni': '\u220B',
        'not': '\u00AC',
        'notin': '\u2209',
        'nsub': '\u2284',
        'Ntilde': '\u00D1',
        'ntilde': '\u00F1',
        'Nu': '\u039D',
        'nu': '\u03BD',
        'Oacute': '\u00D3',
        'oacute': '\u00F3',
        'Ocirc': '\u00D4',
        'ocirc': '\u00F4',
        'OElig': '\u0152',
        'oelig': '\u0153',
        'Ograve': '\u00D2',
        'ograve': '\u00F2',
        'oline': '\u203E',
        'Omega': '\u03A9',
        'omega': '\u03C9',
        'Omicron': '\u039F',
        'omicron': '\u03BF',
        'oplus': '\u2295',
        'or': '\u2228',
        'ordf': '\u00AA',
        'ordm': '\u00BA',
        'Oslash': '\u00D8',
        'oslash': '\u00F8',
        'Otilde': '\u00D5',
        'otilde': '\u00F5',
        'otimes': '\u2297',
        'Ouml': '\u00D6',
        'ouml': '\u00F6',
        'para': '\u00B6',
        'permil': '\u2030',
        'perp': '\u22A5',
        'Phi': '\u03A6',
        'phi': '\u03C6',
        'Pi': '\u03A0',
        'pi': '\u03C0',
        'piv': '\u03D6',
        'plusmn': '\u00B1',
        'pound': '\u00A3',
        'prime': '\u2032',
        'Prime': '\u2033',
        'prod': '\u220F',
        'prop': '\u221D',
        'Psi': '\u03A8',
        'psi': '\u03C8',
        'quot': '\u0022',
        'radic': '\u221A',
        'rang': '\u27E9',
        'raquo': '\u00BB',
        'rarr': '\u2192',
        'rArr': '\u21D2',
        'rceil': '\u2309',
        'rdquo': '\u201D',
        'real': '\u211C',
        'reg': '\u00AE',
        'rfloor': '\u230B',
        'Rho': '\u03A1',
        'rho': '\u03C1',
        'rlm': '\u200F',
        'rsaquo': '\u203A',
        'rsquo': '\u2019',
        'sbquo': '\u201A',
        'Scaron': '\u0160',
        'scaron': '\u0161',
        'sdot': '\u22C5',
        'sect': '\u00A7',
        'shy': '\u00AD',
        'Sigma': '\u03A3',
        'sigma': '\u03C3',
        'sigmaf': '\u03C2',
        'sim': '\u223C',
        'spades': '\u2660',
        'sub': '\u2282',
        'sube': '\u2286',
        'sum': '\u2211',
        'sup': '\u2283',
        'sup1': '\u00B9',
        'sup2': '\u00B2',
        'sup3': '\u00B3',
        'supe': '\u2287',
        'szlig': '\u00DF',
        'Tau': '\u03A4',
        'tau': '\u03C4',
        'there4': '\u2234',
        'Theta': '\u0398',
        'theta': '\u03B8',
        'thetasym': '\u03D1',
        'thinsp': '\u2009',
        'THORN': '\u00DE',
        'thorn': '\u00FE',
        'tilde': '\u02DC',
        'times': '\u00D7',
        'trade': '\u2122',
        'Uacute': '\u00DA',
        'uacute': '\u00FA',
        'uarr': '\u2191',
        'uArr': '\u21D1',
        'Ucirc': '\u00DB',
        'ucirc': '\u00FB',
        'Ugrave': '\u00D9',
        'ugrave': '\u00F9',
        'uml': '\u00A8',
        'upsih': '\u03D2',
        'Upsilon': '\u03A5',
        'upsilon': '\u03C5',
        'Uuml': '\u00DC',
        'uuml': '\u00FC',
        'weierp': '\u2118',
        'Xi': '\u039E',
        'xi': '\u03BE',
        'Yacute': '\u00DD',
        'yacute': '\u00FD',
        'yen': '\u00A5',
        'yuml': '\u00FF',
        'Yuml': '\u0178',
        'Zeta': '\u0396',
        'zeta': '\u03B6',
        'zwj': '\u200D',
        'zwnj': '\u200C',
    };
    var HtmlTagContentType;
    (function (HtmlTagContentType) {
        HtmlTagContentType[HtmlTagContentType["RAW_TEXT"] = 0] = "RAW_TEXT";
        HtmlTagContentType[HtmlTagContentType["ESCAPABLE_RAW_TEXT"] = 1] = "ESCAPABLE_RAW_TEXT";
        HtmlTagContentType[HtmlTagContentType["PARSABLE_DATA"] = 2] = "PARSABLE_DATA";
    })(HtmlTagContentType || (HtmlTagContentType = {}));
    var HtmlTagDefinition = (function () {
        function HtmlTagDefinition(_a) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, closedByChildren = _b.closedByChildren, requiredParents = _b.requiredParents, implicitNamespacePrefix = _b.implicitNamespacePrefix, contentType = _b.contentType, closedByParent = _b.closedByParent, isVoid = _b.isVoid, ignoreFirstLf = _b.ignoreFirstLf;
            this.closedByChildren = {};
            this.closedByParent = false;
            if (isPresent(closedByChildren) && closedByChildren.length > 0) {
                closedByChildren.forEach(function (tagName) { return _this.closedByChildren[tagName] = true; });
            }
            this.isVoid = normalizeBool(isVoid);
            this.closedByParent = normalizeBool(closedByParent) || this.isVoid;
            if (isPresent(requiredParents) && requiredParents.length > 0) {
                this.requiredParents = {};
                this.parentToAdd = requiredParents[0];
                requiredParents.forEach(function (tagName) { return _this.requiredParents[tagName] = true; });
            }
            this.implicitNamespacePrefix = implicitNamespacePrefix;
            this.contentType = isPresent(contentType) ? contentType : HtmlTagContentType.PARSABLE_DATA;
            this.ignoreFirstLf = normalizeBool(ignoreFirstLf);
        }
        HtmlTagDefinition.prototype.requireExtraParent = function (currentParent) {
            if (isBlank(this.requiredParents)) {
                return false;
            }
            if (isBlank(currentParent)) {
                return true;
            }
            var lcParent = currentParent.toLowerCase();
            return this.requiredParents[lcParent] != true && lcParent != 'template';
        };
        HtmlTagDefinition.prototype.isClosedByChild = function (name) {
            return this.isVoid || normalizeBool(this.closedByChildren[name.toLowerCase()]);
        };
        return HtmlTagDefinition;
    }());
    // see http://www.w3.org/TR/html51/syntax.html#optional-tags
    // This implementation does not fully conform to the HTML5 spec.
    var TAG_DEFINITIONS = {
        'base': new HtmlTagDefinition({ isVoid: true }),
        'meta': new HtmlTagDefinition({ isVoid: true }),
        'area': new HtmlTagDefinition({ isVoid: true }),
        'embed': new HtmlTagDefinition({ isVoid: true }),
        'link': new HtmlTagDefinition({ isVoid: true }),
        'img': new HtmlTagDefinition({ isVoid: true }),
        'input': new HtmlTagDefinition({ isVoid: true }),
        'param': new HtmlTagDefinition({ isVoid: true }),
        'hr': new HtmlTagDefinition({ isVoid: true }),
        'br': new HtmlTagDefinition({ isVoid: true }),
        'source': new HtmlTagDefinition({ isVoid: true }),
        'track': new HtmlTagDefinition({ isVoid: true }),
        'wbr': new HtmlTagDefinition({ isVoid: true }),
        'p': new HtmlTagDefinition({
            closedByChildren: [
                'address',
                'article',
                'aside',
                'blockquote',
                'div',
                'dl',
                'fieldset',
                'footer',
                'form',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'header',
                'hgroup',
                'hr',
                'main',
                'nav',
                'ol',
                'p',
                'pre',
                'section',
                'table',
                'ul'
            ],
            closedByParent: true
        }),
        'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
        'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
        'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
        'tr': new HtmlTagDefinition({
            closedByChildren: ['tr'],
            requiredParents: ['tbody', 'tfoot', 'thead'],
            closedByParent: true
        }),
        'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
        'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
        'col': new HtmlTagDefinition({ requiredParents: ['colgroup'], isVoid: true }),
        'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
        'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
        'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
        'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
        'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
        'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
        'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
        'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
        'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
        'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
        'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
        'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
        'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
        'style': new HtmlTagDefinition({ contentType: HtmlTagContentType.RAW_TEXT }),
        'script': new HtmlTagDefinition({ contentType: HtmlTagContentType.RAW_TEXT }),
        'title': new HtmlTagDefinition({ contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT }),
        'textarea': new HtmlTagDefinition({ contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
    };
    var DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
    function getHtmlTagDefinition(tagName) {
        var result = TAG_DEFINITIONS[tagName.toLowerCase()];
        return isPresent(result) ? result : DEFAULT_TAG_DEFINITION;
    }
    var NS_PREFIX_RE = /^@([^:]+):(.+)/g;
    function splitNsName(elementName) {
        if (elementName[0] != '@') {
            return [null, elementName];
        }
        var match = RegExpWrapper.firstMatch(NS_PREFIX_RE, elementName);
        return [match[1], match[2]];
    }
    function getNsPrefix(elementName) {
        return splitNsName(elementName)[0];
    }
    function mergeNsAndName(prefix, localName) {
        return isPresent(prefix) ? "@" + prefix + ":" + localName : localName;
    }
    var HtmlTokenType;
    (function (HtmlTokenType) {
        HtmlTokenType[HtmlTokenType["TAG_OPEN_START"] = 0] = "TAG_OPEN_START";
        HtmlTokenType[HtmlTokenType["TAG_OPEN_END"] = 1] = "TAG_OPEN_END";
        HtmlTokenType[HtmlTokenType["TAG_OPEN_END_VOID"] = 2] = "TAG_OPEN_END_VOID";
        HtmlTokenType[HtmlTokenType["TAG_CLOSE"] = 3] = "TAG_CLOSE";
        HtmlTokenType[HtmlTokenType["TEXT"] = 4] = "TEXT";
        HtmlTokenType[HtmlTokenType["ESCAPABLE_RAW_TEXT"] = 5] = "ESCAPABLE_RAW_TEXT";
        HtmlTokenType[HtmlTokenType["RAW_TEXT"] = 6] = "RAW_TEXT";
        HtmlTokenType[HtmlTokenType["COMMENT_START"] = 7] = "COMMENT_START";
        HtmlTokenType[HtmlTokenType["COMMENT_END"] = 8] = "COMMENT_END";
        HtmlTokenType[HtmlTokenType["CDATA_START"] = 9] = "CDATA_START";
        HtmlTokenType[HtmlTokenType["CDATA_END"] = 10] = "CDATA_END";
        HtmlTokenType[HtmlTokenType["ATTR_NAME"] = 11] = "ATTR_NAME";
        HtmlTokenType[HtmlTokenType["ATTR_VALUE"] = 12] = "ATTR_VALUE";
        HtmlTokenType[HtmlTokenType["DOC_TYPE"] = 13] = "DOC_TYPE";
        HtmlTokenType[HtmlTokenType["EXPANSION_FORM_START"] = 14] = "EXPANSION_FORM_START";
        HtmlTokenType[HtmlTokenType["EXPANSION_CASE_VALUE"] = 15] = "EXPANSION_CASE_VALUE";
        HtmlTokenType[HtmlTokenType["EXPANSION_CASE_EXP_START"] = 16] = "EXPANSION_CASE_EXP_START";
        HtmlTokenType[HtmlTokenType["EXPANSION_CASE_EXP_END"] = 17] = "EXPANSION_CASE_EXP_END";
        HtmlTokenType[HtmlTokenType["EXPANSION_FORM_END"] = 18] = "EXPANSION_FORM_END";
        HtmlTokenType[HtmlTokenType["EOF"] = 19] = "EOF";
    })(HtmlTokenType || (HtmlTokenType = {}));
    var HtmlToken = (function () {
        function HtmlToken(type, parts, sourceSpan) {
            this.type = type;
            this.parts = parts;
            this.sourceSpan = sourceSpan;
        }
        return HtmlToken;
    }());
    var HtmlTokenError = (function (_super) {
        __extends(HtmlTokenError, _super);
        function HtmlTokenError(errorMsg, tokenType, span) {
            _super.call(this, span, errorMsg);
            this.tokenType = tokenType;
        }
        return HtmlTokenError;
    }(ParseError));
    var HtmlTokenizeResult = (function () {
        function HtmlTokenizeResult(tokens, errors) {
            this.tokens = tokens;
            this.errors = errors;
        }
        return HtmlTokenizeResult;
    }());
    function tokenizeHtml(sourceContent, sourceUrl, tokenizeExpansionForms) {
        if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
        return new _HtmlTokenizer(new ParseSourceFile(sourceContent, sourceUrl), tokenizeExpansionForms)
            .tokenize();
    }
    var $EOF$1 = 0;
    var $TAB$1 = 9;
    var $LF$1 = 10;
    var $CR$1 = 13;
    var $SPACE$1 = 32;
    var $BANG$1 = 33;
    var $DQ$1 = 34;
    var $HASH$1 = 35;
    var $AMPERSAND$1 = 38;
    var $SQ$1 = 39;
    var $MINUS$1 = 45;
    var $SLASH$1 = 47;
    var $0$1 = 48;
    var $SEMICOLON$1 = 59;
    var $9$1 = 57;
    var $COLON$1 = 58;
    var $LT$1 = 60;
    var $EQ$1 = 61;
    var $GT$1 = 62;
    var $LBRACKET$1 = 91;
    var $RBRACKET$1 = 93;
    var $LBRACE$1 = 123;
    var $RBRACE$1 = 125;
    var $COMMA$1 = 44;
    var $A$1 = 65;
    var $F = 70;
    var $X = 88;
    var $Z$1 = 90;
    var $a$1 = 97;
    var $f$1 = 102;
    var $z$1 = 122;
    var $x = 120;
    var $NBSP$1 = 160;
    var CR_OR_CRLF_REGEXP = /\r\n?/g;
    function unexpectedCharacterErrorMsg(charCode) {
        var char = charCode === $EOF$1 ? 'EOF' : StringWrapper.fromCharCode(charCode);
        return "Unexpected character \"" + char + "\"";
    }
    function unknownEntityErrorMsg(entitySrc) {
        return "Unknown entity \"" + entitySrc + "\" - use the \"&#<decimal>;\" or  \"&#x<hex>;\" syntax";
    }
    var ControlFlowError = (function () {
        function ControlFlowError(error) {
            this.error = error;
        }
        return ControlFlowError;
    }());
    // See http://www.w3.org/TR/html51/syntax.html#writing
    var _HtmlTokenizer = (function () {
        function _HtmlTokenizer(file, tokenizeExpansionForms) {
            this.file = file;
            this.tokenizeExpansionForms = tokenizeExpansionForms;
            // Note: this is always lowercase!
            this.peek = -1;
            this.nextPeek = -1;
            this.index = -1;
            this.line = 0;
            this.column = -1;
            this.expansionCaseStack = [];
            this.tokens = [];
            this.errors = [];
            this.input = file.content;
            this.length = file.content.length;
            this._advance();
        }
        _HtmlTokenizer.prototype._processCarriageReturns = function (content) {
            // http://www.w3.org/TR/html5/syntax.html#preprocessing-the-input-stream
            // In order to keep the original position in the source, we can not
            // pre-process it.
            // Instead CRs are processed right before instantiating the tokens.
            return StringWrapper.replaceAll(content, CR_OR_CRLF_REGEXP, '\n');
        };
        _HtmlTokenizer.prototype.tokenize = function () {
            while (this.peek !== $EOF$1) {
                var start = this._getLocation();
                try {
                    if (this._attemptCharCode($LT$1)) {
                        if (this._attemptCharCode($BANG$1)) {
                            if (this._attemptCharCode($LBRACKET$1)) {
                                this._consumeCdata(start);
                            }
                            else if (this._attemptCharCode($MINUS$1)) {
                                this._consumeComment(start);
                            }
                            else {
                                this._consumeDocType(start);
                            }
                        }
                        else if (this._attemptCharCode($SLASH$1)) {
                            this._consumeTagClose(start);
                        }
                        else {
                            this._consumeTagOpen(start);
                        }
                    }
                    else if (isSpecialFormStart(this.peek, this.nextPeek) && this.tokenizeExpansionForms) {
                        this._consumeExpansionFormStart();
                    }
                    else if (this.peek === $EQ$1 && this.tokenizeExpansionForms) {
                        this._consumeExpansionCaseStart();
                    }
                    else if (this.peek === $RBRACE$1 && this.isInExpansionCase() &&
                        this.tokenizeExpansionForms) {
                        this._consumeExpansionCaseEnd();
                    }
                    else if (this.peek === $RBRACE$1 && this.isInExpansionForm() &&
                        this.tokenizeExpansionForms) {
                        this._consumeExpansionFormEnd();
                    }
                    else {
                        this._consumeText();
                    }
                }
                catch (e) {
                    if (e instanceof ControlFlowError) {
                        this.errors.push(e.error);
                    }
                    else {
                        throw e;
                    }
                }
            }
            this._beginToken(HtmlTokenType.EOF);
            this._endToken([]);
            return new HtmlTokenizeResult(mergeTextTokens(this.tokens), this.errors);
        };
        _HtmlTokenizer.prototype._getLocation = function () {
            return new ParseLocation(this.file, this.index, this.line, this.column);
        };
        _HtmlTokenizer.prototype._getSpan = function (start, end) {
            if (isBlank(start)) {
                start = this._getLocation();
            }
            if (isBlank(end)) {
                end = this._getLocation();
            }
            return new ParseSourceSpan(start, end);
        };
        _HtmlTokenizer.prototype._beginToken = function (type, start) {
            if (start === void 0) { start = null; }
            if (isBlank(start)) {
                start = this._getLocation();
            }
            this.currentTokenStart = start;
            this.currentTokenType = type;
        };
        _HtmlTokenizer.prototype._endToken = function (parts, end) {
            if (end === void 0) { end = null; }
            if (isBlank(end)) {
                end = this._getLocation();
            }
            var token = new HtmlToken(this.currentTokenType, parts, new ParseSourceSpan(this.currentTokenStart, end));
            this.tokens.push(token);
            this.currentTokenStart = null;
            this.currentTokenType = null;
            return token;
        };
        _HtmlTokenizer.prototype._createError = function (msg, span) {
            var error = new HtmlTokenError(msg, this.currentTokenType, span);
            this.currentTokenStart = null;
            this.currentTokenType = null;
            return new ControlFlowError(error);
        };
        _HtmlTokenizer.prototype._advance = function () {
            if (this.index >= this.length) {
                throw this._createError(unexpectedCharacterErrorMsg($EOF$1), this._getSpan());
            }
            if (this.peek === $LF$1) {
                this.line++;
                this.column = 0;
            }
            else if (this.peek !== $LF$1 && this.peek !== $CR$1) {
                this.column++;
            }
            this.index++;
            this.peek = this.index >= this.length ? $EOF$1 : StringWrapper.charCodeAt(this.input, this.index);
            this.nextPeek =
                this.index + 1 >= this.length ? $EOF$1 : StringWrapper.charCodeAt(this.input, this.index + 1);
        };
        _HtmlTokenizer.prototype._attemptCharCode = function (charCode) {
            if (this.peek === charCode) {
                this._advance();
                return true;
            }
            return false;
        };
        _HtmlTokenizer.prototype._attemptCharCodeCaseInsensitive = function (charCode) {
            if (compareCharCodeCaseInsensitive(this.peek, charCode)) {
                this._advance();
                return true;
            }
            return false;
        };
        _HtmlTokenizer.prototype._requireCharCode = function (charCode) {
            var location = this._getLocation();
            if (!this._attemptCharCode(charCode)) {
                throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan(location, location));
            }
        };
        _HtmlTokenizer.prototype._attemptStr = function (chars) {
            for (var i = 0; i < chars.length; i++) {
                if (!this._attemptCharCode(StringWrapper.charCodeAt(chars, i))) {
                    return false;
                }
            }
            return true;
        };
        _HtmlTokenizer.prototype._attemptStrCaseInsensitive = function (chars) {
            for (var i = 0; i < chars.length; i++) {
                if (!this._attemptCharCodeCaseInsensitive(StringWrapper.charCodeAt(chars, i))) {
                    return false;
                }
            }
            return true;
        };
        _HtmlTokenizer.prototype._requireStr = function (chars) {
            var location = this._getLocation();
            if (!this._attemptStr(chars)) {
                throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan(location));
            }
        };
        _HtmlTokenizer.prototype._attemptCharCodeUntilFn = function (predicate) {
            while (!predicate(this.peek)) {
                this._advance();
            }
        };
        _HtmlTokenizer.prototype._requireCharCodeUntilFn = function (predicate, len) {
            var start = this._getLocation();
            this._attemptCharCodeUntilFn(predicate);
            if (this.index - start.offset < len) {
                throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan(start, start));
            }
        };
        _HtmlTokenizer.prototype._attemptUntilChar = function (char) {
            while (this.peek !== char) {
                this._advance();
            }
        };
        _HtmlTokenizer.prototype._readChar = function (decodeEntities) {
            if (decodeEntities && this.peek === $AMPERSAND$1) {
                return this._decodeEntity();
            }
            else {
                var index = this.index;
                this._advance();
                return this.input[index];
            }
        };
        _HtmlTokenizer.prototype._decodeEntity = function () {
            var start = this._getLocation();
            this._advance();
            if (this._attemptCharCode($HASH$1)) {
                var isHex = this._attemptCharCode($x) || this._attemptCharCode($X);
                var numberStart = this._getLocation().offset;
                this._attemptCharCodeUntilFn(isDigitEntityEnd);
                if (this.peek != $SEMICOLON$1) {
                    throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan());
                }
                this._advance();
                var strNum = this.input.substring(numberStart, this.index - 1);
                try {
                    var charCode = NumberWrapper.parseInt(strNum, isHex ? 16 : 10);
                    return StringWrapper.fromCharCode(charCode);
                }
                catch (e) {
                    var entity = this.input.substring(start.offset + 1, this.index - 1);
                    throw this._createError(unknownEntityErrorMsg(entity), this._getSpan(start));
                }
            }
            else {
                var startPosition = this._savePosition();
                this._attemptCharCodeUntilFn(isNamedEntityEnd);
                if (this.peek != $SEMICOLON$1) {
                    this._restorePosition(startPosition);
                    return '&';
                }
                this._advance();
                var name_1 = this.input.substring(start.offset + 1, this.index - 1);
                var char = NAMED_ENTITIES[name_1];
                if (isBlank(char)) {
                    throw this._createError(unknownEntityErrorMsg(name_1), this._getSpan(start));
                }
                return char;
            }
        };
        _HtmlTokenizer.prototype._consumeRawText = function (decodeEntities, firstCharOfEnd, attemptEndRest) {
            var tagCloseStart;
            var textStart = this._getLocation();
            this._beginToken(decodeEntities ? HtmlTokenType.ESCAPABLE_RAW_TEXT : HtmlTokenType.RAW_TEXT, textStart);
            var parts = [];
            while (true) {
                tagCloseStart = this._getLocation();
                if (this._attemptCharCode(firstCharOfEnd) && attemptEndRest()) {
                    break;
                }
                if (this.index > tagCloseStart.offset) {
                    parts.push(this.input.substring(tagCloseStart.offset, this.index));
                }
                while (this.peek !== firstCharOfEnd) {
                    parts.push(this._readChar(decodeEntities));
                }
            }
            return this._endToken([this._processCarriageReturns(parts.join(''))], tagCloseStart);
        };
        _HtmlTokenizer.prototype._consumeComment = function (start) {
            var _this = this;
            this._beginToken(HtmlTokenType.COMMENT_START, start);
            this._requireCharCode($MINUS$1);
            this._endToken([]);
            var textToken = this._consumeRawText(false, $MINUS$1, function () { return _this._attemptStr('->'); });
            this._beginToken(HtmlTokenType.COMMENT_END, textToken.sourceSpan.end);
            this._endToken([]);
        };
        _HtmlTokenizer.prototype._consumeCdata = function (start) {
            var _this = this;
            this._beginToken(HtmlTokenType.CDATA_START, start);
            this._requireStr('CDATA[');
            this._endToken([]);
            var textToken = this._consumeRawText(false, $RBRACKET$1, function () { return _this._attemptStr(']>'); });
            this._beginToken(HtmlTokenType.CDATA_END, textToken.sourceSpan.end);
            this._endToken([]);
        };
        _HtmlTokenizer.prototype._consumeDocType = function (start) {
            this._beginToken(HtmlTokenType.DOC_TYPE, start);
            this._attemptUntilChar($GT$1);
            this._advance();
            this._endToken([this.input.substring(start.offset + 2, this.index - 1)]);
        };
        _HtmlTokenizer.prototype._consumePrefixAndName = function () {
            var nameOrPrefixStart = this.index;
            var prefix = null;
            while (this.peek !== $COLON$1 && !isPrefixEnd(this.peek)) {
                this._advance();
            }
            var nameStart;
            if (this.peek === $COLON$1) {
                this._advance();
                prefix = this.input.substring(nameOrPrefixStart, this.index - 1);
                nameStart = this.index;
            }
            else {
                nameStart = nameOrPrefixStart;
            }
            this._requireCharCodeUntilFn(isNameEnd, this.index === nameStart ? 1 : 0);
            var name = this.input.substring(nameStart, this.index);
            return [prefix, name];
        };
        _HtmlTokenizer.prototype._consumeTagOpen = function (start) {
            var savedPos = this._savePosition();
            var lowercaseTagName;
            try {
                if (!isAsciiLetter(this.peek)) {
                    throw this._createError(unexpectedCharacterErrorMsg(this.peek), this._getSpan());
                }
                var nameStart = this.index;
                this._consumeTagOpenStart(start);
                lowercaseTagName = this.input.substring(nameStart, this.index).toLowerCase();
                this._attemptCharCodeUntilFn(isNotWhitespace);
                while (this.peek !== $SLASH$1 && this.peek !== $GT$1) {
                    this._consumeAttributeName();
                    this._attemptCharCodeUntilFn(isNotWhitespace);
                    if (this._attemptCharCode($EQ$1)) {
                        this._attemptCharCodeUntilFn(isNotWhitespace);
                        this._consumeAttributeValue();
                    }
                    this._attemptCharCodeUntilFn(isNotWhitespace);
                }
                this._consumeTagOpenEnd();
            }
            catch (e) {
                if (e instanceof ControlFlowError) {
                    // When the start tag is invalid, assume we want a "<"
                    this._restorePosition(savedPos);
                    // Back to back text tokens are merged at the end
                    this._beginToken(HtmlTokenType.TEXT, start);
                    this._endToken(['<']);
                    return;
                }
                throw e;
            }
            var contentTokenType = getHtmlTagDefinition(lowercaseTagName).contentType;
            if (contentTokenType === HtmlTagContentType.RAW_TEXT) {
                this._consumeRawTextWithTagClose(lowercaseTagName, false);
            }
            else if (contentTokenType === HtmlTagContentType.ESCAPABLE_RAW_TEXT) {
                this._consumeRawTextWithTagClose(lowercaseTagName, true);
            }
        };
        _HtmlTokenizer.prototype._consumeRawTextWithTagClose = function (lowercaseTagName, decodeEntities) {
            var _this = this;
            var textToken = this._consumeRawText(decodeEntities, $LT$1, function () {
                if (!_this._attemptCharCode($SLASH$1))
                    return false;
                _this._attemptCharCodeUntilFn(isNotWhitespace);
                if (!_this._attemptStrCaseInsensitive(lowercaseTagName))
                    return false;
                _this._attemptCharCodeUntilFn(isNotWhitespace);
                if (!_this._attemptCharCode($GT$1))
                    return false;
                return true;
            });
            this._beginToken(HtmlTokenType.TAG_CLOSE, textToken.sourceSpan.end);
            this._endToken([null, lowercaseTagName]);
        };
        _HtmlTokenizer.prototype._consumeTagOpenStart = function (start) {
            this._beginToken(HtmlTokenType.TAG_OPEN_START, start);
            var parts = this._consumePrefixAndName();
            this._endToken(parts);
        };
        _HtmlTokenizer.prototype._consumeAttributeName = function () {
            this._beginToken(HtmlTokenType.ATTR_NAME);
            var prefixAndName = this._consumePrefixAndName();
            this._endToken(prefixAndName);
        };
        _HtmlTokenizer.prototype._consumeAttributeValue = function () {
            this._beginToken(HtmlTokenType.ATTR_VALUE);
            var value;
            if (this.peek === $SQ$1 || this.peek === $DQ$1) {
                var quoteChar = this.peek;
                this._advance();
                var parts = [];
                while (this.peek !== quoteChar) {
                    parts.push(this._readChar(true));
                }
                value = parts.join('');
                this._advance();
            }
            else {
                var valueStart = this.index;
                this._requireCharCodeUntilFn(isNameEnd, 1);
                value = this.input.substring(valueStart, this.index);
            }
            this._endToken([this._processCarriageReturns(value)]);
        };
        _HtmlTokenizer.prototype._consumeTagOpenEnd = function () {
            var tokenType = this._attemptCharCode($SLASH$1) ? HtmlTokenType.TAG_OPEN_END_VOID :
                HtmlTokenType.TAG_OPEN_END;
            this._beginToken(tokenType);
            this._requireCharCode($GT$1);
            this._endToken([]);
        };
        _HtmlTokenizer.prototype._consumeTagClose = function (start) {
            this._beginToken(HtmlTokenType.TAG_CLOSE, start);
            this._attemptCharCodeUntilFn(isNotWhitespace);
            var prefixAndName;
            prefixAndName = this._consumePrefixAndName();
            this._attemptCharCodeUntilFn(isNotWhitespace);
            this._requireCharCode($GT$1);
            this._endToken(prefixAndName);
        };
        _HtmlTokenizer.prototype._consumeExpansionFormStart = function () {
            this._beginToken(HtmlTokenType.EXPANSION_FORM_START, this._getLocation());
            this._requireCharCode($LBRACE$1);
            this._endToken([]);
            this._beginToken(HtmlTokenType.RAW_TEXT, this._getLocation());
            var condition = this._readUntil($COMMA$1);
            this._endToken([condition], this._getLocation());
            this._requireCharCode($COMMA$1);
            this._attemptCharCodeUntilFn(isNotWhitespace);
            this._beginToken(HtmlTokenType.RAW_TEXT, this._getLocation());
            var type = this._readUntil($COMMA$1);
            this._endToken([type], this._getLocation());
            this._requireCharCode($COMMA$1);
            this._attemptCharCodeUntilFn(isNotWhitespace);
            this.expansionCaseStack.push(HtmlTokenType.EXPANSION_FORM_START);
        };
        _HtmlTokenizer.prototype._consumeExpansionCaseStart = function () {
            this._requireCharCode($EQ$1);
            this._beginToken(HtmlTokenType.EXPANSION_CASE_VALUE, this._getLocation());
            var value = this._readUntil($LBRACE$1).trim();
            this._endToken([value], this._getLocation());
            this._attemptCharCodeUntilFn(isNotWhitespace);
            this._beginToken(HtmlTokenType.EXPANSION_CASE_EXP_START, this._getLocation());
            this._requireCharCode($LBRACE$1);
            this._endToken([], this._getLocation());
            this._attemptCharCodeUntilFn(isNotWhitespace);
            this.expansionCaseStack.push(HtmlTokenType.EXPANSION_CASE_EXP_START);
        };
        _HtmlTokenizer.prototype._consumeExpansionCaseEnd = function () {
            this._beginToken(HtmlTokenType.EXPANSION_CASE_EXP_END, this._getLocation());
            this._requireCharCode($RBRACE$1);
            this._endToken([], this._getLocation());
            this._attemptCharCodeUntilFn(isNotWhitespace);
            this.expansionCaseStack.pop();
        };
        _HtmlTokenizer.prototype._consumeExpansionFormEnd = function () {
            this._beginToken(HtmlTokenType.EXPANSION_FORM_END, this._getLocation());
            this._requireCharCode($RBRACE$1);
            this._endToken([]);
            this.expansionCaseStack.pop();
        };
        _HtmlTokenizer.prototype._consumeText = function () {
            var start = this._getLocation();
            this._beginToken(HtmlTokenType.TEXT, start);
            var parts = [];
            var interpolation = false;
            if (this.peek === $LBRACE$1 && this.nextPeek === $LBRACE$1) {
                parts.push(this._readChar(true));
                parts.push(this._readChar(true));
                interpolation = true;
            }
            else {
                parts.push(this._readChar(true));
            }
            while (!this.isTextEnd(interpolation)) {
                if (this.peek === $LBRACE$1 && this.nextPeek === $LBRACE$1) {
                    parts.push(this._readChar(true));
                    parts.push(this._readChar(true));
                    interpolation = true;
                }
                else if (this.peek === $RBRACE$1 && this.nextPeek === $RBRACE$1 && interpolation) {
                    parts.push(this._readChar(true));
                    parts.push(this._readChar(true));
                    interpolation = false;
                }
                else {
                    parts.push(this._readChar(true));
                }
            }
            this._endToken([this._processCarriageReturns(parts.join(''))]);
        };
        _HtmlTokenizer.prototype.isTextEnd = function (interpolation) {
            if (this.peek === $LT$1 || this.peek === $EOF$1)
                return true;
            if (this.tokenizeExpansionForms) {
                if (isSpecialFormStart(this.peek, this.nextPeek))
                    return true;
                if (this.peek === $RBRACE$1 && !interpolation &&
                    (this.isInExpansionCase() || this.isInExpansionForm()))
                    return true;
            }
            return false;
        };
        _HtmlTokenizer.prototype._savePosition = function () {
            return [this.peek, this.index, this.column, this.line, this.tokens.length];
        };
        _HtmlTokenizer.prototype._readUntil = function (char) {
            var start = this.index;
            this._attemptUntilChar(char);
            return this.input.substring(start, this.index);
        };
        _HtmlTokenizer.prototype._restorePosition = function (position) {
            this.peek = position[0];
            this.index = position[1];
            this.column = position[2];
            this.line = position[3];
            var nbTokens = position[4];
            if (nbTokens < this.tokens.length) {
                // remove any extra tokens
                this.tokens = ListWrapper.slice(this.tokens, 0, nbTokens);
            }
        };
        _HtmlTokenizer.prototype.isInExpansionCase = function () {
            return this.expansionCaseStack.length > 0 &&
                this.expansionCaseStack[this.expansionCaseStack.length - 1] ===
                HtmlTokenType.EXPANSION_CASE_EXP_START;
        };
        _HtmlTokenizer.prototype.isInExpansionForm = function () {
            return this.expansionCaseStack.length > 0 &&
                this.expansionCaseStack[this.expansionCaseStack.length - 1] ===
                HtmlTokenType.EXPANSION_FORM_START;
        };
        return _HtmlTokenizer;
    }());
    function isNotWhitespace(code) {
        return !isWhitespace$1(code) || code === $EOF$1;
    }
    function isWhitespace$1(code) {
        return (code >= $TAB$1 && code <= $SPACE$1) || (code === $NBSP$1);
    }
    function isNameEnd(code) {
        return isWhitespace$1(code) || code === $GT$1 || code === $SLASH$1 || code === $SQ$1 || code === $DQ$1 ||
            code === $EQ$1;
    }
    function isPrefixEnd(code) {
        return (code < $a$1 || $z$1 < code) && (code < $A$1 || $Z$1 < code) && (code < $0$1 || code > $9$1);
    }
    function isDigitEntityEnd(code) {
        return code == $SEMICOLON$1 || code == $EOF$1 || !isAsciiHexDigit(code);
    }
    function isNamedEntityEnd(code) {
        return code == $SEMICOLON$1 || code == $EOF$1 || !isAsciiLetter(code);
    }
    function isSpecialFormStart(peek, nextPeek) {
        return peek === $LBRACE$1 && nextPeek != $LBRACE$1;
    }
    function isAsciiLetter(code) {
        return code >= $a$1 && code <= $z$1 || code >= $A$1 && code <= $Z$1;
    }
    function isAsciiHexDigit(code) {
        return code >= $a$1 && code <= $f$1 || code >= $A$1 && code <= $F || code >= $0$1 && code <= $9$1;
    }
    function compareCharCodeCaseInsensitive(code1, code2) {
        return toUpperCaseCharCode(code1) == toUpperCaseCharCode(code2);
    }
    function toUpperCaseCharCode(code) {
        return code >= $a$1 && code <= $z$1 ? code - $a$1 + $A$1 : code;
    }
    function mergeTextTokens(srcTokens) {
        var dstTokens = [];
        var lastDstToken;
        for (var i = 0; i < srcTokens.length; i++) {
            var token = srcTokens[i];
            if (isPresent(lastDstToken) && lastDstToken.type == HtmlTokenType.TEXT &&
                token.type == HtmlTokenType.TEXT) {
                lastDstToken.parts[0] += token.parts[0];
                lastDstToken.sourceSpan.end = token.sourceSpan.end;
            }
            else {
                lastDstToken = token;
                dstTokens.push(lastDstToken);
            }
        }
        return dstTokens;
    }
    var HtmlTreeError = (function (_super) {
        __extends(HtmlTreeError, _super);
        function HtmlTreeError(elementName, span, msg) {
            _super.call(this, span, msg);
            this.elementName = elementName;
        }
        HtmlTreeError.create = function (elementName, span, msg) {
            return new HtmlTreeError(elementName, span, msg);
        };
        return HtmlTreeError;
    }(ParseError));
    var HtmlParseTreeResult = (function () {
        function HtmlParseTreeResult(rootNodes, errors) {
            this.rootNodes = rootNodes;
            this.errors = errors;
        }
        return HtmlParseTreeResult;
    }());
    var HtmlParser = (function () {
        function HtmlParser() {
        }
        HtmlParser.prototype.parse = function (sourceContent, sourceUrl, parseExpansionForms) {
            if (parseExpansionForms === void 0) { parseExpansionForms = false; }
            var tokensAndErrors = tokenizeHtml(sourceContent, sourceUrl, parseExpansionForms);
            var treeAndErrors = new TreeBuilder(tokensAndErrors.tokens).build();
            return new HtmlParseTreeResult(treeAndErrors.rootNodes, tokensAndErrors.errors
                .concat(treeAndErrors.errors));
        };
        return HtmlParser;
    }());
    HtmlParser.decorators = [
        { type: _angular_core.Injectable },
    ];
    var TreeBuilder = (function () {
        function TreeBuilder(tokens) {
            this.tokens = tokens;
            this.index = -1;
            this.rootNodes = [];
            this.errors = [];
            this.elementStack = [];
            this._advance();
        }
        TreeBuilder.prototype.build = function () {
            while (this.peek.type !== HtmlTokenType.EOF) {
                if (this.peek.type === HtmlTokenType.TAG_OPEN_START) {
                    this._consumeStartTag(this._advance());
                }
                else if (this.peek.type === HtmlTokenType.TAG_CLOSE) {
                    this._consumeEndTag(this._advance());
                }
                else if (this.peek.type === HtmlTokenType.CDATA_START) {
                    this._closeVoidElement();
                    this._consumeCdata(this._advance());
                }
                else if (this.peek.type === HtmlTokenType.COMMENT_START) {
                    this._closeVoidElement();
                    this._consumeComment(this._advance());
                }
                else if (this.peek.type === HtmlTokenType.TEXT ||
                    this.peek.type === HtmlTokenType.RAW_TEXT ||
                    this.peek.type === HtmlTokenType.ESCAPABLE_RAW_TEXT) {
                    this._closeVoidElement();
                    this._consumeText(this._advance());
                }
                else if (this.peek.type === HtmlTokenType.EXPANSION_FORM_START) {
                    this._consumeExpansion(this._advance());
                }
                else {
                    // Skip all other tokens...
                    this._advance();
                }
            }
            return new HtmlParseTreeResult(this.rootNodes, this.errors);
        };
        TreeBuilder.prototype._advance = function () {
            var prev = this.peek;
            if (this.index < this.tokens.length - 1) {
                // Note: there is always an EOF token at the end
                this.index++;
            }
            this.peek = this.tokens[this.index];
            return prev;
        };
        TreeBuilder.prototype._advanceIf = function (type) {
            if (this.peek.type === type) {
                return this._advance();
            }
            return null;
        };
        TreeBuilder.prototype._consumeCdata = function (startToken) {
            this._consumeText(this._advance());
            this._advanceIf(HtmlTokenType.CDATA_END);
        };
        TreeBuilder.prototype._consumeComment = function (token) {
            var text = this._advanceIf(HtmlTokenType.RAW_TEXT);
            this._advanceIf(HtmlTokenType.COMMENT_END);
            var value = isPresent(text) ? text.parts[0].trim() : null;
            this._addToParent(new HtmlCommentAst(value, token.sourceSpan));
        };
        TreeBuilder.prototype._consumeExpansion = function (token) {
            var switchValue = this._advance();
            var type = this._advance();
            var cases = [];
            // read =
            while (this.peek.type === HtmlTokenType.EXPANSION_CASE_VALUE) {
                var expCase = this._parseExpansionCase();
                if (isBlank(expCase))
                    return; // error
                cases.push(expCase);
            }
            // read the final }
            if (this.peek.type !== HtmlTokenType.EXPANSION_FORM_END) {
                this.errors.push(HtmlTreeError.create(null, this.peek.sourceSpan, "Invalid expansion form. Missing '}'."));
                return;
            }
            this._advance();
            var mainSourceSpan = new ParseSourceSpan(token.sourceSpan.start, this.peek.sourceSpan.end);
            this._addToParent(new HtmlExpansionAst(switchValue.parts[0], type.parts[0], cases, mainSourceSpan, switchValue.sourceSpan));
        };
        TreeBuilder.prototype._parseExpansionCase = function () {
            var value = this._advance();
            // read {
            if (this.peek.type !== HtmlTokenType.EXPANSION_CASE_EXP_START) {
                this.errors.push(HtmlTreeError.create(null, this.peek.sourceSpan, "Invalid expansion form. Missing '{'.,"));
                return null;
            }
            // read until }
            var start = this._advance();
            var exp = this._collectExpansionExpTokens(start);
            if (isBlank(exp))
                return null;
            var end = this._advance();
            exp.push(new HtmlToken(HtmlTokenType.EOF, [], end.sourceSpan));
            // parse everything in between { and }
            var parsedExp = new TreeBuilder(exp).build();
            if (parsedExp.errors.length > 0) {
                this.errors = this.errors.concat(parsedExp.errors);
                return null;
            }
            var sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
            var expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
            return new HtmlExpansionCaseAst(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
        };
        TreeBuilder.prototype._collectExpansionExpTokens = function (start) {
            var exp = [];
            var expansionFormStack = [HtmlTokenType.EXPANSION_CASE_EXP_START];
            while (true) {
                if (this.peek.type === HtmlTokenType.EXPANSION_FORM_START ||
                    this.peek.type === HtmlTokenType.EXPANSION_CASE_EXP_START) {
                    expansionFormStack.push(this.peek.type);
                }
                if (this.peek.type === HtmlTokenType.EXPANSION_CASE_EXP_END) {
                    if (lastOnStack(expansionFormStack, HtmlTokenType.EXPANSION_CASE_EXP_START)) {
                        expansionFormStack.pop();
                        if (expansionFormStack.length == 0)
                            return exp;
                    }
                    else {
                        this.errors.push(HtmlTreeError.create(null, start.sourceSpan, "Invalid expansion form. Missing '}'."));
                        return null;
                    }
                }
                if (this.peek.type === HtmlTokenType.EXPANSION_FORM_END) {
                    if (lastOnStack(expansionFormStack, HtmlTokenType.EXPANSION_FORM_START)) {
                        expansionFormStack.pop();
                    }
                    else {
                        this.errors.push(HtmlTreeError.create(null, start.sourceSpan, "Invalid expansion form. Missing '}'."));
                        return null;
                    }
                }
                if (this.peek.type === HtmlTokenType.EOF) {
                    this.errors.push(HtmlTreeError.create(null, start.sourceSpan, "Invalid expansion form. Missing '}'."));
                    return null;
                }
                exp.push(this._advance());
            }
        };
        TreeBuilder.prototype._consumeText = function (token) {
            var text = token.parts[0];
            if (text.length > 0 && text[0] == '\n') {
                var parent_1 = this._getParentElement();
                if (isPresent(parent_1) && parent_1.children.length == 0 &&
                    getHtmlTagDefinition(parent_1.name).ignoreFirstLf) {
                    text = text.substring(1);
                }
            }
            if (text.length > 0) {
                this._addToParent(new HtmlTextAst(text, token.sourceSpan));
            }
        };
        TreeBuilder.prototype._closeVoidElement = function () {
            if (this.elementStack.length > 0) {
                var el = ListWrapper.last(this.elementStack);
                if (getHtmlTagDefinition(el.name).isVoid) {
                    this.elementStack.pop();
                }
            }
        };
        TreeBuilder.prototype._consumeStartTag = function (startTagToken) {
            var prefix = startTagToken.parts[0];
            var name = startTagToken.parts[1];
            var attrs = [];
            while (this.peek.type === HtmlTokenType.ATTR_NAME) {
                attrs.push(this._consumeAttr(this._advance()));
            }
            var fullName = getElementFullName(prefix, name, this._getParentElement());
            var selfClosing = false;
            // Note: There could have been a tokenizer error
            // so that we don't get a token for the end tag...
            if (this.peek.type === HtmlTokenType.TAG_OPEN_END_VOID) {
                this._advance();
                selfClosing = true;
                if (getNsPrefix(fullName) == null && !getHtmlTagDefinition(fullName).isVoid) {
                    this.errors.push(HtmlTreeError.create(fullName, startTagToken.sourceSpan, "Only void and foreign elements can be self closed \"" + startTagToken.parts[1] + "\""));
                }
            }
            else if (this.peek.type === HtmlTokenType.TAG_OPEN_END) {
                this._advance();
                selfClosing = false;
            }
            var end = this.peek.sourceSpan.start;
            var span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
            var el = new HtmlElementAst(fullName, attrs, [], span, span, null);
            this._pushElement(el);
            if (selfClosing) {
                this._popElement(fullName);
                el.endSourceSpan = span;
            }
        };
        TreeBuilder.prototype._pushElement = function (el) {
            if (this.elementStack.length > 0) {
                var parentEl = ListWrapper.last(this.elementStack);
                if (getHtmlTagDefinition(parentEl.name).isClosedByChild(el.name)) {
                    this.elementStack.pop();
                }
            }
            var tagDef = getHtmlTagDefinition(el.name);
            var parentEl = this._getParentElement();
            if (tagDef.requireExtraParent(isPresent(parentEl) ? parentEl.name : null)) {
                var newParent = new HtmlElementAst(tagDef.parentToAdd, [], [el], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
                this._addToParent(newParent);
                this.elementStack.push(newParent);
                this.elementStack.push(el);
            }
            else {
                this._addToParent(el);
                this.elementStack.push(el);
            }
        };
        TreeBuilder.prototype._consumeEndTag = function (endTagToken) {
            var fullName = getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
            this._getParentElement().endSourceSpan = endTagToken.sourceSpan;
            if (getHtmlTagDefinition(fullName).isVoid) {
                this.errors.push(HtmlTreeError.create(fullName, endTagToken.sourceSpan, "Void elements do not have end tags \"" + endTagToken.parts[1] + "\""));
            }
            else if (!this._popElement(fullName)) {
                this.errors.push(HtmlTreeError.create(fullName, endTagToken.sourceSpan, "Unexpected closing tag \"" + endTagToken.parts[1] + "\""));
            }
        };
        TreeBuilder.prototype._popElement = function (fullName) {
            for (var stackIndex = this.elementStack.length - 1; stackIndex >= 0; stackIndex--) {
                var el = this.elementStack[stackIndex];
                if (el.name == fullName) {
                    ListWrapper.splice(this.elementStack, stackIndex, this.elementStack.length - stackIndex);
                    return true;
                }
                if (!getHtmlTagDefinition(el.name).closedByParent) {
                    return false;
                }
            }
            return false;
        };
        TreeBuilder.prototype._consumeAttr = function (attrName) {
            var fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
            var end = attrName.sourceSpan.end;
            var value = '';
            if (this.peek.type === HtmlTokenType.ATTR_VALUE) {
                var valueToken = this._advance();
                value = valueToken.parts[0];
                end = valueToken.sourceSpan.end;
            }
            return new HtmlAttrAst(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end));
        };
        TreeBuilder.prototype._getParentElement = function () {
            return this.elementStack.length > 0 ? ListWrapper.last(this.elementStack) : null;
        };
        TreeBuilder.prototype._addToParent = function (node) {
            var parent = this._getParentElement();
            if (isPresent(parent)) {
                parent.children.push(node);
            }
            else {
                this.rootNodes.push(node);
            }
        };
        return TreeBuilder;
    }());
    function getElementFullName(prefix, localName, parentElement) {
        if (isBlank(prefix)) {
            prefix = getHtmlTagDefinition(localName).implicitNamespacePrefix;
            if (isBlank(prefix) && isPresent(parentElement)) {
                prefix = getNsPrefix(parentElement.name);
            }
        }
        return mergeNsAndName(prefix, localName);
    }
    function lastOnStack(stack, element) {
        return stack.length > 0 && stack[stack.length - 1] === element;
    }
    var _EMPTY_ATTR_VALUE = '';
    // TODO: Can't use `const` here as
    // in Dart this is not transpiled into `final` yet...
    var _SELECTOR_REGEXP = RegExpWrapper.create('(\\:not\\()|' +
        '([-\\w]+)|' +
        '(?:\\.([-\\w]+))|' +
        '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' +
        '(\\))|' +
        '(\\s*,\\s*)'); // ","
    /**
     * A css selector contains an element name,
     * css classes and attribute/value pairs with the purpose
     * of selecting subsets out of them.
     */
    var CssSelector = (function () {
        function CssSelector() {
            this.element = null;
            this.classNames = [];
            this.attrs = [];
            this.notSelectors = [];
        }
        CssSelector.parse = function (selector) {
            var results = [];
            var _addResult = function (res, cssSel) {
                if (cssSel.notSelectors.length > 0 && isBlank(cssSel.element) &&
                    ListWrapper.isEmpty(cssSel.classNames) && ListWrapper.isEmpty(cssSel.attrs)) {
                    cssSel.element = "*";
                }
                res.push(cssSel);
            };
            var cssSelector = new CssSelector();
            var matcher = RegExpWrapper.matcher(_SELECTOR_REGEXP, selector);
            var match;
            var current = cssSelector;
            var inNot = false;
            while (isPresent(match = RegExpMatcherWrapper.next(matcher))) {
                if (isPresent(match[1])) {
                    if (inNot) {
                        throw new BaseException$1('Nesting :not is not allowed in a selector');
                    }
                    inNot = true;
                    current = new CssSelector();
                    cssSelector.notSelectors.push(current);
                }
                if (isPresent(match[2])) {
                    current.setElement(match[2]);
                }
                if (isPresent(match[3])) {
                    current.addClassName(match[3]);
                }
                if (isPresent(match[4])) {
                    current.addAttribute(match[4], match[5]);
                }
                if (isPresent(match[6])) {
                    inNot = false;
                    current = cssSelector;
                }
                if (isPresent(match[7])) {
                    if (inNot) {
                        throw new BaseException$1('Multiple selectors in :not are not supported');
                    }
                    _addResult(results, cssSelector);
                    cssSelector = current = new CssSelector();
                }
            }
            _addResult(results, cssSelector);
            return results;
        };
        CssSelector.prototype.isElementSelector = function () {
            return isPresent(this.element) && ListWrapper.isEmpty(this.classNames) &&
                ListWrapper.isEmpty(this.attrs) && this.notSelectors.length === 0;
        };
        CssSelector.prototype.setElement = function (element) {
            if (element === void 0) { element = null; }
            this.element = element;
        };
        /** Gets a template string for an element that matches the selector. */
        CssSelector.prototype.getMatchingElementTemplate = function () {
            var tagName = isPresent(this.element) ? this.element : 'div';
            var classAttr = this.classNames.length > 0 ? " class=\"" + this.classNames.join(' ') + "\"" : '';
            var attrs = '';
            for (var i = 0; i < this.attrs.length; i += 2) {
                var attrName = this.attrs[i];
                var attrValue = this.attrs[i + 1] !== '' ? "=\"" + this.attrs[i + 1] + "\"" : '';
                attrs += " " + attrName + attrValue;
            }
            return "<" + tagName + classAttr + attrs + "></" + tagName + ">";
        };
        CssSelector.prototype.addAttribute = function (name, value) {
            if (value === void 0) { value = _EMPTY_ATTR_VALUE; }
            this.attrs.push(name);
            if (isPresent(value)) {
                value = value.toLowerCase();
            }
            else {
                value = _EMPTY_ATTR_VALUE;
            }
            this.attrs.push(value);
        };
        CssSelector.prototype.addClassName = function (name) { this.classNames.push(name.toLowerCase()); };
        CssSelector.prototype.toString = function () {
            var res = '';
            if (isPresent(this.element)) {
                res += this.element;
            }
            if (isPresent(this.classNames)) {
                for (var i = 0; i < this.classNames.length; i++) {
                    res += '.' + this.classNames[i];
                }
            }
            if (isPresent(this.attrs)) {
                for (var i = 0; i < this.attrs.length;) {
                    var attrName = this.attrs[i++];
                    var attrValue = this.attrs[i++];
                    res += '[' + attrName;
                    if (attrValue.length > 0) {
                        res += '=' + attrValue;
                    }
                    res += ']';
                }
            }
            this.notSelectors.forEach(function (notSelector) { return res += ":not(" + notSelector + ")"; });
            return res;
        };
        return CssSelector;
    }());
    /**
     * Reads a list of CssSelectors and allows to calculate which ones
     * are contained in a given CssSelector.
     */
    var SelectorMatcher = (function () {
        function SelectorMatcher() {
            this._elementMap = new Map$1();
            this._elementPartialMap = new Map$1();
            this._classMap = new Map$1();
            this._classPartialMap = new Map$1();
            this._attrValueMap = new Map$1();
            this._attrValuePartialMap = new Map$1();
            this._listContexts = [];
        }
        SelectorMatcher.createNotMatcher = function (notSelectors) {
            var notMatcher = new SelectorMatcher();
            notMatcher.addSelectables(notSelectors, null);
            return notMatcher;
        };
        SelectorMatcher.prototype.addSelectables = function (cssSelectors, callbackCtxt) {
            var listContext = null;
            if (cssSelectors.length > 1) {
                listContext = new SelectorListContext(cssSelectors);
                this._listContexts.push(listContext);
            }
            for (var i = 0; i < cssSelectors.length; i++) {
                this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
            }
        };
        /**
         * Add an object that can be found later on by calling `match`.
         * @param cssSelector A css selector
         * @param callbackCtxt An opaque object that will be given to the callback of the `match` function
         */
        SelectorMatcher.prototype._addSelectable = function (cssSelector, callbackCtxt, listContext) {
            var matcher = this;
            var element = cssSelector.element;
            var classNames = cssSelector.classNames;
            var attrs = cssSelector.attrs;
            var selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
            if (isPresent(element)) {
                var isTerminal = attrs.length === 0 && classNames.length === 0;
                if (isTerminal) {
                    this._addTerminal(matcher._elementMap, element, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._elementPartialMap, element);
                }
            }
            if (isPresent(classNames)) {
                for (var index = 0; index < classNames.length; index++) {
                    var isTerminal = attrs.length === 0 && index === classNames.length - 1;
                    var className = classNames[index];
                    if (isTerminal) {
                        this._addTerminal(matcher._classMap, className, selectable);
                    }
                    else {
                        matcher = this._addPartial(matcher._classPartialMap, className);
                    }
                }
            }
            if (isPresent(attrs)) {
                for (var index = 0; index < attrs.length;) {
                    var isTerminal = index === attrs.length - 2;
                    var attrName = attrs[index++];
                    var attrValue = attrs[index++];
                    if (isTerminal) {
                        var terminalMap = matcher._attrValueMap;
                        var terminalValuesMap = terminalMap.get(attrName);
                        if (isBlank(terminalValuesMap)) {
                            terminalValuesMap = new Map$1();
                            terminalMap.set(attrName, terminalValuesMap);
                        }
                        this._addTerminal(terminalValuesMap, attrValue, selectable);
                    }
                    else {
                        var parttialMap = matcher._attrValuePartialMap;
                        var partialValuesMap = parttialMap.get(attrName);
                        if (isBlank(partialValuesMap)) {
                            partialValuesMap = new Map$1();
                            parttialMap.set(attrName, partialValuesMap);
                        }
                        matcher = this._addPartial(partialValuesMap, attrValue);
                    }
                }
            }
        };
        SelectorMatcher.prototype._addTerminal = function (map, name, selectable) {
            var terminalList = map.get(name);
            if (isBlank(terminalList)) {
                terminalList = [];
                map.set(name, terminalList);
            }
            terminalList.push(selectable);
        };
        SelectorMatcher.prototype._addPartial = function (map, name) {
            var matcher = map.get(name);
            if (isBlank(matcher)) {
                matcher = new SelectorMatcher();
                map.set(name, matcher);
            }
            return matcher;
        };
        /**
         * Find the objects that have been added via `addSelectable`
         * whose css selector is contained in the given css selector.
         * @param cssSelector A css selector
         * @param matchedCallback This callback will be called with the object handed into `addSelectable`
         * @return boolean true if a match was found
         */
        SelectorMatcher.prototype.match = function (cssSelector, matchedCallback) {
            var result = false;
            var element = cssSelector.element;
            var classNames = cssSelector.classNames;
            var attrs = cssSelector.attrs;
            for (var i = 0; i < this._listContexts.length; i++) {
                this._listContexts[i].alreadyMatched = false;
            }
            result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
            result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
                result;
            if (isPresent(classNames)) {
                for (var index = 0; index < classNames.length; index++) {
                    var className = classNames[index];
                    result =
                        this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                    result =
                        this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
                }
            }
            if (isPresent(attrs)) {
                for (var index = 0; index < attrs.length;) {
                    var attrName = attrs[index++];
                    var attrValue = attrs[index++];
                    var terminalValuesMap = this._attrValueMap.get(attrName);
                    if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                        result = this._matchTerminal(terminalValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) ||
                            result;
                    }
                    result = this._matchTerminal(terminalValuesMap, attrValue, cssSelector, matchedCallback) ||
                        result;
                    var partialValuesMap = this._attrValuePartialMap.get(attrName);
                    if (!StringWrapper.equals(attrValue, _EMPTY_ATTR_VALUE)) {
                        result = this._matchPartial(partialValuesMap, _EMPTY_ATTR_VALUE, cssSelector, matchedCallback) ||
                            result;
                    }
                    result =
                        this._matchPartial(partialValuesMap, attrValue, cssSelector, matchedCallback) || result;
                }
            }
            return result;
        };
        /** @internal */
        SelectorMatcher.prototype._matchTerminal = function (map, name, cssSelector, matchedCallback) {
            if (isBlank(map) || isBlank(name)) {
                return false;
            }
            var selectables = map.get(name);
            var starSelectables = map.get("*");
            if (isPresent(starSelectables)) {
                selectables = selectables.concat(starSelectables);
            }
            if (isBlank(selectables)) {
                return false;
            }
            var selectable;
            var result = false;
            for (var index = 0; index < selectables.length; index++) {
                selectable = selectables[index];
                result = selectable.finalize(cssSelector, matchedCallback) || result;
            }
            return result;
        };
        /** @internal */
        SelectorMatcher.prototype._matchPartial = function (map, name, cssSelector, matchedCallback /*: (c: CssSelector, a: any) => void*/) {
            if (isBlank(map) || isBlank(name)) {
                return false;
            }
            var nestedSelector = map.get(name);
            if (isBlank(nestedSelector)) {
                return false;
            }
            // TODO(perf): get rid of recursion and measure again
            // TODO(perf): don't pass the whole selector into the recursion,
            // but only the not processed parts
            return nestedSelector.match(cssSelector, matchedCallback);
        };
        return SelectorMatcher;
    }());
    var SelectorListContext = (function () {
        function SelectorListContext(selectors) {
            this.selectors = selectors;
            this.alreadyMatched = false;
        }
        return SelectorListContext;
    }());
    // Store context to pass back selector and context when a selector is matched
    var SelectorContext = (function () {
        function SelectorContext(selector, cbContext, listContext) {
            this.selector = selector;
            this.cbContext = cbContext;
            this.listContext = listContext;
            this.notSelectors = selector.notSelectors;
        }
        SelectorContext.prototype.finalize = function (cssSelector, callback) {
            var result = true;
            if (this.notSelectors.length > 0 &&
                (isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
                var notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
                result = !notMatcher.match(cssSelector, null);
            }
            if (result && isPresent(callback) &&
                (isBlank(this.listContext) || !this.listContext.alreadyMatched)) {
                if (isPresent(this.listContext)) {
                    this.listContext.alreadyMatched = true;
                }
                callback(this.selector, this.cbContext);
            }
            return result;
        };
        return SelectorContext;
    }());
    var NG_CONTENT_SELECT_ATTR = 'select';
    var NG_CONTENT_ELEMENT = 'ng-content';
    var LINK_ELEMENT = 'link';
    var LINK_STYLE_REL_ATTR = 'rel';
    var LINK_STYLE_HREF_ATTR = 'href';
    var LINK_STYLE_REL_VALUE = 'stylesheet';
    var STYLE_ELEMENT = 'style';
    var SCRIPT_ELEMENT = 'script';
    var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
    var NG_PROJECT_AS = 'ngProjectAs';
    function preparseElement(ast) {
        var selectAttr = null;
        var hrefAttr = null;
        var relAttr = null;
        var nonBindable = false;
        var projectAs = null;
        ast.attrs.forEach(function (attr) {
            var lcAttrName = attr.name.toLowerCase();
            if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
                selectAttr = attr.value;
            }
            else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
                hrefAttr = attr.value;
            }
            else if (lcAttrName == LINK_STYLE_REL_ATTR) {
                relAttr = attr.value;
            }
            else if (attr.name == NG_NON_BINDABLE_ATTR) {
                nonBindable = true;
            }
            else if (attr.name == NG_PROJECT_AS) {
                if (attr.value.length > 0) {
                    projectAs = attr.value;
                }
            }
        });
        selectAttr = normalizeNgContentSelect(selectAttr);
        var nodeName = ast.name.toLowerCase();
        var type = PreparsedElementType.OTHER;
        if (splitNsName(nodeName)[1] == NG_CONTENT_ELEMENT) {
            type = PreparsedElementType.NG_CONTENT;
        }
        else if (nodeName == STYLE_ELEMENT) {
            type = PreparsedElementType.STYLE;
        }
        else if (nodeName == SCRIPT_ELEMENT) {
            type = PreparsedElementType.SCRIPT;
        }
        else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
            type = PreparsedElementType.STYLESHEET;
        }
        return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
    }
    var PreparsedElementType;
    (function (PreparsedElementType) {
        PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
        PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
        PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
        PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
        PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
    })(PreparsedElementType || (PreparsedElementType = {}));
    var PreparsedElement = (function () {
        function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
            this.type = type;
            this.selectAttr = selectAttr;
            this.hrefAttr = hrefAttr;
            this.nonBindable = nonBindable;
            this.projectAs = projectAs;
        }
        return PreparsedElement;
    }());
    function normalizeNgContentSelect(selectAttr) {
        if (isBlank(selectAttr) || selectAttr.length === 0) {
            return '*';
        }
        return selectAttr;
    }
    var StyleWithImports = (function () {
        function StyleWithImports(style, styleUrls) {
            this.style = style;
            this.styleUrls = styleUrls;
        }
        return StyleWithImports;
    }());
    function isStyleUrlResolvable(url) {
        if (isBlank(url) || url.length === 0 || url[0] == '/')
            return false;
        var schemeMatch = RegExpWrapper.firstMatch(_urlWithSchemaRe, url);
        return isBlank(schemeMatch) || schemeMatch[1] == 'package' || schemeMatch[1] == 'asset';
    }
    /**
     * Rewrites stylesheets by resolving and removing the @import urls that
     * are either relative or don't have a `package:` scheme
     */
    function extractStyleUrls(resolver, baseUrl, cssText) {
        var foundUrls = [];
        var modifiedCssText = StringWrapper.replaceAllMapped(cssText, _cssImportRe, function (m) {
            var url = isPresent(m[1]) ? m[1] : m[2];
            if (!isStyleUrlResolvable(url)) {
                // Do not attempt to resolve non-package absolute URLs with URI scheme
                return m[0];
            }
            foundUrls.push(resolver.resolve(baseUrl, url));
            return '';
        });
        return new StyleWithImports(modifiedCssText, foundUrls);
    }
    var _cssImportRe = /@import\s+(?:url\()?\s*(?:(?:['"]([^'"]*))|([^;\)\s]*))[^;]*;?/g;
    // TODO: can't use /^[^:/?#.]+:/g due to clang-format bug:
    //       https://github.com/angular/angular/issues/4596
    var _urlWithSchemaRe = /^([a-zA-Z\-\+\.]+):/g;
    var MODULE_SUFFIX = IS_DART ? '.dart' : '';
    var CAMEL_CASE_REGEXP = /([A-Z])/g;
    function camelCaseToDashCase(input) {
        return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) { return '-' + m[1].toLowerCase(); });
    }
    function splitAtColon(input, defaultValues) {
        var parts = StringWrapper.split(input.trim(), /\s*:\s*/g);
        if (parts.length > 1) {
            return parts;
        }
        else {
            return defaultValues;
        }
    }
    function sanitizeIdentifier(name) {
        return StringWrapper.replaceAll(name, /\W/g, '_');
    }
    function visitValue(value, visitor, context) {
        if (isArray(value)) {
            return visitor.visitArray(value, context);
        }
        else if (isStrictStringMap(value)) {
            return visitor.visitStringMap(value, context);
        }
        else if (isBlank(value) || isPrimitive(value)) {
            return visitor.visitPrimitive(value, context);
        }
        else {
            return visitor.visitOther(value, context);
        }
    }
    var ValueTransformer = (function () {
        function ValueTransformer() {
        }
        ValueTransformer.prototype.visitArray = function (arr, context) {
            var _this = this;
            return arr.map(function (value) { return visitValue(value, _this, context); });
        };
        ValueTransformer.prototype.visitStringMap = function (map, context) {
            var _this = this;
            var result = {};
            StringMapWrapper.forEach(map, function (value, key) { result[key] = visitValue(value, _this, context); });
            return result;
        };
        ValueTransformer.prototype.visitPrimitive = function (value, context) { return value; };
        ValueTransformer.prototype.visitOther = function (value, context) { return value; };
        return ValueTransformer;
    }());
    function assetUrl(pkg, path, type) {
        if (path === void 0) { path = null; }
        if (type === void 0) { type = 'src'; }
        if (IS_DART) {
            if (path == null) {
                return "asset:angular2/" + pkg + "/" + pkg + ".dart";
            }
            else {
                return "asset:angular2/lib/" + pkg + "/src/" + path + ".dart";
            }
        }
        else {
            if (path == null) {
                return "asset:@angular/lib/" + pkg + "/index";
            }
            else {
                return "asset:@angular/lib/" + pkg + "/src/" + path;
            }
        }
    }
    var _ASSET_SCHEME = 'asset:';
    function createOfflineCompileUrlResolver() {
        return new UrlResolver(_ASSET_SCHEME);
    }
    /**
     * A default provider for {@link PACKAGE_ROOT_URL} that maps to '/'.
     */
    var DEFAULT_PACKAGE_URL_PROVIDER = {
        provide: _angular_core.PACKAGE_ROOT_URL,
        useValue: "/"
    };
    var UrlResolver = (function () {
        function UrlResolver(_packagePrefix) {
            if (_packagePrefix === void 0) { _packagePrefix = null; }
            this._packagePrefix = _packagePrefix;
        }
        /**
         * Resolves the `url` given the `baseUrl`:
         * - when the `url` is null, the `baseUrl` is returned,
         * - if `url` is relative ('path/to/here', './path/to/here'), the resolved url is a combination of
         * `baseUrl` and `url`,
         * - if `url` is absolute (it has a scheme: 'http://', 'https://' or start with '/'), the `url` is
         * returned as is (ignoring the `baseUrl`)
         *
         * @param {string} baseUrl
         * @param {string} url
         * @returns {string} the resolved URL
         */
        UrlResolver.prototype.resolve = function (baseUrl, url) {
            var resolvedUrl = url;
            if (isPresent(baseUrl) && baseUrl.length > 0) {
                resolvedUrl = _resolveUrl(baseUrl, resolvedUrl);
            }
            var resolvedParts = _split(resolvedUrl);
            var prefix = this._packagePrefix;
            if (isPresent(prefix) && isPresent(resolvedParts) &&
                resolvedParts[_ComponentIndex.Scheme] == "package") {
                var path = resolvedParts[_ComponentIndex.Path];
                if (this._packagePrefix === _ASSET_SCHEME) {
                    var pathSegements = path.split(/\//);
                    resolvedUrl = "asset:" + pathSegements[0] + "/lib/" + pathSegements.slice(1).join('/');
                }
                else {
                    prefix = StringWrapper.stripRight(prefix, '/');
                    path = StringWrapper.stripLeft(path, '/');
                    return prefix + "/" + path;
                }
            }
            return resolvedUrl;
        };
        return UrlResolver;
    }());
    UrlResolver.decorators = [
        { type: _angular_core.Injectable },
    ];
    UrlResolver.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [_angular_core.PACKAGE_ROOT_URL,] },] },
    ];
    /**
     * Extract the scheme of a URL.
     */
    function getUrlScheme(url) {
        var match = _split(url);
        return (match && match[_ComponentIndex.Scheme]) || "";
    }
    // The code below is adapted from Traceur:
    // https://github.com/google/traceur-compiler/blob/9511c1dafa972bf0de1202a8a863bad02f0f95a8/src/runtime/url.js
    /**
     * Builds a URI string from already-encoded parts.
     *
     * No encoding is performed.  Any component may be omitted as either null or
     * undefined.
     *
     * @param {?string=} opt_scheme The scheme such as 'http'.
     * @param {?string=} opt_userInfo The user name before the '@'.
     * @param {?string=} opt_domain The domain such as 'www.google.com', already
     *     URI-encoded.
     * @param {(string|null)=} opt_port The port number.
     * @param {?string=} opt_path The path, already URI-encoded.  If it is not
     *     empty, it must begin with a slash.
     * @param {?string=} opt_queryData The URI-encoded query data.
     * @param {?string=} opt_fragment The URI-encoded fragment identifier.
     * @return {string} The fully combined URI.
     */
    function _buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
        var out = [];
        if (isPresent(opt_scheme)) {
            out.push(opt_scheme + ':');
        }
        if (isPresent(opt_domain)) {
            out.push('//');
            if (isPresent(opt_userInfo)) {
                out.push(opt_userInfo + '@');
            }
            out.push(opt_domain);
            if (isPresent(opt_port)) {
                out.push(':' + opt_port);
            }
        }
        if (isPresent(opt_path)) {
            out.push(opt_path);
        }
        if (isPresent(opt_queryData)) {
            out.push('?' + opt_queryData);
        }
        if (isPresent(opt_fragment)) {
            out.push('#' + opt_fragment);
        }
        return out.join('');
    }
    /**
     * A regular expression for breaking a URI into its component parts.
     *
     * {@link http://www.gbiv.com/protocols/uri/rfc/rfc3986.html#RFC2234} says
     * As the "first-match-wins" algorithm is identical to the "greedy"
     * disambiguation method used by POSIX regular expressions, it is natural and
     * commonplace to use a regular expression for parsing the potential five
     * components of a URI reference.
     *
     * The following line is the regular expression for breaking-down a
     * well-formed URI reference into its components.
     *
     * <pre>
     * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
     *  12            3  4          5       6  7        8 9
     * </pre>
     *
     * The numbers in the second line above are only to assist readability; they
     * indicate the reference points for each subexpression (i.e., each paired
     * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
     * For example, matching the above expression to
     * <pre>
     *     http://www.ics.uci.edu/pub/ietf/uri/#Related
     * </pre>
     * results in the following subexpression matches:
     * <pre>
     *    $1 = http:
     *    $2 = http
     *    $3 = //www.ics.uci.edu
     *    $4 = www.ics.uci.edu
     *    $5 = /pub/ietf/uri/
     *    $6 = <undefined>
     *    $7 = <undefined>
     *    $8 = #Related
     *    $9 = Related
     * </pre>
     * where <undefined> indicates that the component is not present, as is the
     * case for the query component in the above example. Therefore, we can
     * determine the value of the five components as
     * <pre>
     *    scheme    = $2
     *    authority = $4
     *    path      = $5
     *    query     = $7
     *    fragment  = $9
     * </pre>
     *
     * The regular expression has been modified slightly to expose the
     * userInfo, domain, and port separately from the authority.
     * The modified version yields
     * <pre>
     *    $1 = http              scheme
     *    $2 = <undefined>       userInfo -\
     *    $3 = www.ics.uci.edu   domain     | authority
     *    $4 = <undefined>       port     -/
     *    $5 = /pub/ietf/uri/    path
     *    $6 = <undefined>       query without ?
     *    $7 = Related           fragment without #
     * </pre>
     * @type {!RegExp}
     * @internal
     */
    var _splitRe = RegExpWrapper.create('^' +
        '(?:' +
        '([^:/?#.]+)' +
        // used by other URL parts such as :,
        // ?, /, #, and .
        ':)?' +
        '(?://' +
        '(?:([^/?#]*)@)?' +
        '([\\w\\d\\-\\u0100-\\uffff.%]*)' +
        // digits, dashes, dots, percent
        // escapes, and unicode characters.
        '(?::([0-9]+))?' +
        ')?' +
        '([^?#]+)?' +
        '(?:\\?([^#]*))?' +
        '(?:#(.*))?' +
        '$');
    /**
     * The index of each URI component in the return value of goog.uri.utils.split.
     * @enum {number}
     */
    var _ComponentIndex;
    (function (_ComponentIndex) {
        _ComponentIndex[_ComponentIndex["Scheme"] = 1] = "Scheme";
        _ComponentIndex[_ComponentIndex["UserInfo"] = 2] = "UserInfo";
        _ComponentIndex[_ComponentIndex["Domain"] = 3] = "Domain";
        _ComponentIndex[_ComponentIndex["Port"] = 4] = "Port";
        _ComponentIndex[_ComponentIndex["Path"] = 5] = "Path";
        _ComponentIndex[_ComponentIndex["QueryData"] = 6] = "QueryData";
        _ComponentIndex[_ComponentIndex["Fragment"] = 7] = "Fragment";
    })(_ComponentIndex || (_ComponentIndex = {}));
    /**
     * Splits a URI into its component parts.
     *
     * Each component can be accessed via the component indices; for example:
     * <pre>
     * goog.uri.utils.split(someStr)[goog.uri.utils.CompontentIndex.QUERY_DATA];
     * </pre>
     *
     * @param {string} uri The URI string to examine.
     * @return {!Array.<string|undefined>} Each component still URI-encoded.
     *     Each component that is present will contain the encoded value, whereas
     *     components that are not present will be undefined or empty, depending
     *     on the browser's regular expression implementation.  Never null, since
     *     arbitrary strings may still look like path names.
     */
    function _split(uri) {
        return RegExpWrapper.firstMatch(_splitRe, uri);
    }
    /**
     * Removes dot segments in given path component, as described in
     * RFC 3986, section 5.2.4.
     *
     * @param {string} path A non-empty path component.
     * @return {string} Path component with removed dot segments.
     */
    function _removeDotSegments(path) {
        if (path == '/')
            return '/';
        var leadingSlash = path[0] == '/' ? '/' : '';
        var trailingSlash = path[path.length - 1] === '/' ? '/' : '';
        var segments = path.split('/');
        var out = [];
        var up = 0;
        for (var pos = 0; pos < segments.length; pos++) {
            var segment = segments[pos];
            switch (segment) {
                case '':
                case '.':
                    break;
                case '..':
                    if (out.length > 0) {
                        out.pop();
                    }
                    else {
                        up++;
                    }
                    break;
                default:
                    out.push(segment);
            }
        }
        if (leadingSlash == '') {
            while (up-- > 0) {
                out.unshift('..');
            }
            if (out.length === 0)
                out.push('.');
        }
        return leadingSlash + out.join('/') + trailingSlash;
    }
    /**
     * Takes an array of the parts from split and canonicalizes the path part
     * and then joins all the parts.
     * @param {Array.<string?>} parts
     * @return {string}
     */
    function _joinAndCanonicalizePath(parts) {
        var path = parts[_ComponentIndex.Path];
        path = isBlank(path) ? '' : _removeDotSegments(path);
        parts[_ComponentIndex.Path] = path;
        return _buildFromEncodedParts(parts[_ComponentIndex.Scheme], parts[_ComponentIndex.UserInfo], parts[_ComponentIndex.Domain], parts[_ComponentIndex.Port], path, parts[_ComponentIndex.QueryData], parts[_ComponentIndex.Fragment]);
    }
    /**
     * Resolves a URL.
     * @param {string} base The URL acting as the base URL.
     * @param {string} to The URL to resolve.
     * @return {string}
     */
    function _resolveUrl(base, url) {
        var parts = _split(encodeURI(url));
        var baseParts = _split(base);
        if (isPresent(parts[_ComponentIndex.Scheme])) {
            return _joinAndCanonicalizePath(parts);
        }
        else {
            parts[_ComponentIndex.Scheme] = baseParts[_ComponentIndex.Scheme];
        }
        for (var i = _ComponentIndex.Scheme; i <= _ComponentIndex.Port; i++) {
            if (isBlank(parts[i])) {
                parts[i] = baseParts[i];
            }
        }
        if (parts[_ComponentIndex.Path][0] == '/') {
            return _joinAndCanonicalizePath(parts);
        }
        var path = baseParts[_ComponentIndex.Path];
        if (isBlank(path))
            path = '/';
        var index = path.lastIndexOf('/');
        path = path.substring(0, index + 1) + parts[_ComponentIndex.Path];
        parts[_ComponentIndex.Path] = path;
        return _joinAndCanonicalizePath(parts);
    }
    // group 1: "property" from "[property]"
    // group 2: "event" from "(event)"
    var HOST_REG_EXP = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\)))$/g;
    var CompileMetadataWithIdentifier = (function () {
        function CompileMetadataWithIdentifier() {
        }
        Object.defineProperty(CompileMetadataWithIdentifier.prototype, "identifier", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return CompileMetadataWithIdentifier;
    }());
    var CompileMetadataWithType = (function (_super) {
        __extends(CompileMetadataWithType, _super);
        function CompileMetadataWithType() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(CompileMetadataWithType.prototype, "type", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileMetadataWithType.prototype, "identifier", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return CompileMetadataWithType;
    }(CompileMetadataWithIdentifier));
    function metadataFromJson(data) {
        return _COMPILE_METADATA_FROM_JSON[data['class']](data);
    }
    var CompileIdentifierMetadata = (function () {
        function CompileIdentifierMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, runtime = _b.runtime, name = _b.name, moduleUrl = _b.moduleUrl, prefix = _b.prefix, value = _b.value;
            this.runtime = runtime;
            this.name = name;
            this.prefix = prefix;
            this.moduleUrl = moduleUrl;
            this.value = value;
        }
        CompileIdentifierMetadata.fromJson = function (data) {
            var value = isArray(data['value']) ? _arrayFromJson(data['value'], metadataFromJson) :
                _objFromJson(data['value'], metadataFromJson);
            return new CompileIdentifierMetadata({ name: data['name'], prefix: data['prefix'], moduleUrl: data['moduleUrl'], value: value });
        };
        CompileIdentifierMetadata.prototype.toJson = function () {
            var value = isArray(this.value) ? _arrayToJson(this.value) : _objToJson(this.value);
            return {
                // Note: Runtime type can't be serialized...
                'class': 'Identifier',
                'name': this.name,
                'moduleUrl': this.moduleUrl,
                'prefix': this.prefix,
                'value': value
            };
        };
        Object.defineProperty(CompileIdentifierMetadata.prototype, "identifier", {
            get: function () { return this; },
            enumerable: true,
            configurable: true
        });
        return CompileIdentifierMetadata;
    }());
    var CompileDiDependencyMetadata = (function () {
        function CompileDiDependencyMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, isAttribute = _b.isAttribute, isSelf = _b.isSelf, isHost = _b.isHost, isSkipSelf = _b.isSkipSelf, isOptional = _b.isOptional, isValue = _b.isValue, query = _b.query, viewQuery = _b.viewQuery, token = _b.token, value = _b.value;
            this.isAttribute = normalizeBool(isAttribute);
            this.isSelf = normalizeBool(isSelf);
            this.isHost = normalizeBool(isHost);
            this.isSkipSelf = normalizeBool(isSkipSelf);
            this.isOptional = normalizeBool(isOptional);
            this.isValue = normalizeBool(isValue);
            this.query = query;
            this.viewQuery = viewQuery;
            this.token = token;
            this.value = value;
        }
        CompileDiDependencyMetadata.fromJson = function (data) {
            return new CompileDiDependencyMetadata({
                token: _objFromJson(data['token'], CompileTokenMetadata.fromJson),
                query: _objFromJson(data['query'], CompileQueryMetadata.fromJson),
                viewQuery: _objFromJson(data['viewQuery'], CompileQueryMetadata.fromJson),
                value: data['value'],
                isAttribute: data['isAttribute'],
                isSelf: data['isSelf'],
                isHost: data['isHost'],
                isSkipSelf: data['isSkipSelf'],
                isOptional: data['isOptional'],
                isValue: data['isValue']
            });
        };
        CompileDiDependencyMetadata.prototype.toJson = function () {
            return {
                'token': _objToJson(this.token),
                'query': _objToJson(this.query),
                'viewQuery': _objToJson(this.viewQuery),
                'value': this.value,
                'isAttribute': this.isAttribute,
                'isSelf': this.isSelf,
                'isHost': this.isHost,
                'isSkipSelf': this.isSkipSelf,
                'isOptional': this.isOptional,
                'isValue': this.isValue
            };
        };
        return CompileDiDependencyMetadata;
    }());
    var CompileProviderMetadata = (function () {
        function CompileProviderMetadata(_a) {
            var token = _a.token, useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
            this.token = token;
            this.useClass = useClass;
            this.useValue = useValue;
            this.useExisting = useExisting;
            this.useFactory = useFactory;
            this.deps = normalizeBlank(deps);
            this.multi = normalizeBool(multi);
        }
        CompileProviderMetadata.fromJson = function (data) {
            return new CompileProviderMetadata({
                token: _objFromJson(data['token'], CompileTokenMetadata.fromJson),
                useClass: _objFromJson(data['useClass'], CompileTypeMetadata.fromJson),
                useExisting: _objFromJson(data['useExisting'], CompileTokenMetadata.fromJson),
                useValue: _objFromJson(data['useValue'], CompileIdentifierMetadata.fromJson),
                useFactory: _objFromJson(data['useFactory'], CompileFactoryMetadata.fromJson),
                multi: data['multi'],
                deps: _arrayFromJson(data['deps'], CompileDiDependencyMetadata.fromJson)
            });
        };
        CompileProviderMetadata.prototype.toJson = function () {
            return {
                // Note: Runtime type can't be serialized...
                'class': 'Provider',
                'token': _objToJson(this.token),
                'useClass': _objToJson(this.useClass),
                'useExisting': _objToJson(this.useExisting),
                'useValue': _objToJson(this.useValue),
                'useFactory': _objToJson(this.useFactory),
                'multi': this.multi,
                'deps': _arrayToJson(this.deps)
            };
        };
        return CompileProviderMetadata;
    }());
    var CompileFactoryMetadata = (function () {
        function CompileFactoryMetadata(_a) {
            var runtime = _a.runtime, name = _a.name, moduleUrl = _a.moduleUrl, prefix = _a.prefix, diDeps = _a.diDeps, value = _a.value;
            this.runtime = runtime;
            this.name = name;
            this.prefix = prefix;
            this.moduleUrl = moduleUrl;
            this.diDeps = _normalizeArray(diDeps);
            this.value = value;
        }
        Object.defineProperty(CompileFactoryMetadata.prototype, "identifier", {
            get: function () { return this; },
            enumerable: true,
            configurable: true
        });
        CompileFactoryMetadata.fromJson = function (data) {
            return new CompileFactoryMetadata({
                name: data['name'],
                prefix: data['prefix'],
                moduleUrl: data['moduleUrl'],
                value: data['value'],
                diDeps: _arrayFromJson(data['diDeps'], CompileDiDependencyMetadata.fromJson)
            });
        };
        CompileFactoryMetadata.prototype.toJson = function () {
            return {
                'class': 'Factory',
                'name': this.name,
                'prefix': this.prefix,
                'moduleUrl': this.moduleUrl,
                'value': this.value,
                'diDeps': _arrayToJson(this.diDeps)
            };
        };
        return CompileFactoryMetadata;
    }());
    var CompileTokenMetadata = (function () {
        function CompileTokenMetadata(_a) {
            var value = _a.value, identifier = _a.identifier, identifierIsInstance = _a.identifierIsInstance;
            this.value = value;
            this.identifier = identifier;
            this.identifierIsInstance = normalizeBool(identifierIsInstance);
        }
        CompileTokenMetadata.fromJson = function (data) {
            return new CompileTokenMetadata({
                value: data['value'],
                identifier: _objFromJson(data['identifier'], CompileIdentifierMetadata.fromJson),
                identifierIsInstance: data['identifierIsInstance']
            });
        };
        CompileTokenMetadata.prototype.toJson = function () {
            return {
                'value': this.value,
                'identifier': _objToJson(this.identifier),
                'identifierIsInstance': this.identifierIsInstance
            };
        };
        Object.defineProperty(CompileTokenMetadata.prototype, "runtimeCacheKey", {
            get: function () {
                if (isPresent(this.identifier)) {
                    return this.identifier.runtime;
                }
                else {
                    return this.value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTokenMetadata.prototype, "assetCacheKey", {
            get: function () {
                if (isPresent(this.identifier)) {
                    return isPresent(this.identifier.moduleUrl) &&
                    isPresent(getUrlScheme(this.identifier.moduleUrl)) ?
                    this.identifier.name + "|" + this.identifier.moduleUrl + "|" + this.identifierIsInstance :
                        null;
                }
                else {
                    return this.value;
                }
            },
            enumerable: true,
            configurable: true
        });
        CompileTokenMetadata.prototype.equalsTo = function (token2) {
            var rk = this.runtimeCacheKey;
            var ak = this.assetCacheKey;
            return (isPresent(rk) && rk == token2.runtimeCacheKey) ||
                (isPresent(ak) && ak == token2.assetCacheKey);
        };
        Object.defineProperty(CompileTokenMetadata.prototype, "name", {
            get: function () {
                return isPresent(this.value) ? sanitizeIdentifier(this.value) : this.identifier.name;
            },
            enumerable: true,
            configurable: true
        });
        return CompileTokenMetadata;
    }());
    var CompileTokenMap = (function () {
        function CompileTokenMap() {
            this._valueMap = new Map();
            this._values = [];
        }
        CompileTokenMap.prototype.add = function (token, value) {
            var existing = this.get(token);
            if (isPresent(existing)) {
                throw new BaseException$1("Can only add to a TokenMap! Token: " + token.name);
            }
            this._values.push(value);
            var rk = token.runtimeCacheKey;
            if (isPresent(rk)) {
                this._valueMap.set(rk, value);
            }
            var ak = token.assetCacheKey;
            if (isPresent(ak)) {
                this._valueMap.set(ak, value);
            }
        };
        CompileTokenMap.prototype.get = function (token) {
            var rk = token.runtimeCacheKey;
            var ak = token.assetCacheKey;
            var result;
            if (isPresent(rk)) {
                result = this._valueMap.get(rk);
            }
            if (isBlank(result) && isPresent(ak)) {
                result = this._valueMap.get(ak);
            }
            return result;
        };
        CompileTokenMap.prototype.values = function () { return this._values; };
        Object.defineProperty(CompileTokenMap.prototype, "size", {
            get: function () { return this._values.length; },
            enumerable: true,
            configurable: true
        });
        return CompileTokenMap;
    }());
    /**
     * Metadata regarding compilation of a type.
     */
    var CompileTypeMetadata = (function () {
        function CompileTypeMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, runtime = _b.runtime, name = _b.name, moduleUrl = _b.moduleUrl, prefix = _b.prefix, isHost = _b.isHost, value = _b.value, diDeps = _b.diDeps;
            this.runtime = runtime;
            this.name = name;
            this.moduleUrl = moduleUrl;
            this.prefix = prefix;
            this.isHost = normalizeBool(isHost);
            this.value = value;
            this.diDeps = _normalizeArray(diDeps);
        }
        CompileTypeMetadata.fromJson = function (data) {
            return new CompileTypeMetadata({
                name: data['name'],
                moduleUrl: data['moduleUrl'],
                prefix: data['prefix'],
                isHost: data['isHost'],
                value: data['value'],
                diDeps: _arrayFromJson(data['diDeps'], CompileDiDependencyMetadata.fromJson)
            });
        };
        Object.defineProperty(CompileTypeMetadata.prototype, "identifier", {
            get: function () { return this; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTypeMetadata.prototype, "type", {
            get: function () { return this; },
            enumerable: true,
            configurable: true
        });
        CompileTypeMetadata.prototype.toJson = function () {
            return {
                // Note: Runtime type can't be serialized...
                'class': 'Type',
                'name': this.name,
                'moduleUrl': this.moduleUrl,
                'prefix': this.prefix,
                'isHost': this.isHost,
                'value': this.value,
                'diDeps': _arrayToJson(this.diDeps)
            };
        };
        return CompileTypeMetadata;
    }());
    var CompileQueryMetadata = (function () {
        function CompileQueryMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, selectors = _b.selectors, descendants = _b.descendants, first = _b.first, propertyName = _b.propertyName, read = _b.read;
            this.selectors = selectors;
            this.descendants = normalizeBool(descendants);
            this.first = normalizeBool(first);
            this.propertyName = propertyName;
            this.read = read;
        }
        CompileQueryMetadata.fromJson = function (data) {
            return new CompileQueryMetadata({
                selectors: _arrayFromJson(data['selectors'], CompileTokenMetadata.fromJson),
                descendants: data['descendants'],
                first: data['first'],
                propertyName: data['propertyName'],
                read: _objFromJson(data['read'], CompileTokenMetadata.fromJson)
            });
        };
        CompileQueryMetadata.prototype.toJson = function () {
            return {
                'selectors': _arrayToJson(this.selectors),
                'descendants': this.descendants,
                'first': this.first,
                'propertyName': this.propertyName,
                'read': _objToJson(this.read)
            };
        };
        return CompileQueryMetadata;
    }());
    /**
     * Metadata regarding compilation of a template.
     */
    var CompileTemplateMetadata = (function () {
        function CompileTemplateMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, encapsulation = _b.encapsulation, template = _b.template, templateUrl = _b.templateUrl, styles = _b.styles, styleUrls = _b.styleUrls, ngContentSelectors = _b.ngContentSelectors;
            this.encapsulation = isPresent(encapsulation) ? encapsulation : _angular_core.ViewEncapsulation.Emulated;
            this.template = template;
            this.templateUrl = templateUrl;
            this.styles = isPresent(styles) ? styles : [];
            this.styleUrls = isPresent(styleUrls) ? styleUrls : [];
            this.ngContentSelectors = isPresent(ngContentSelectors) ? ngContentSelectors : [];
        }
        CompileTemplateMetadata.fromJson = function (data) {
            return new CompileTemplateMetadata({
                encapsulation: isPresent(data['encapsulation']) ?
                    VIEW_ENCAPSULATION_VALUES[data['encapsulation']] :
                    data['encapsulation'],
                template: data['template'],
                templateUrl: data['templateUrl'],
                styles: data['styles'],
                styleUrls: data['styleUrls'],
                ngContentSelectors: data['ngContentSelectors']
            });
        };
        CompileTemplateMetadata.prototype.toJson = function () {
            return {
                'encapsulation': isPresent(this.encapsulation) ? serializeEnum(this.encapsulation) : this.encapsulation,
                'template': this.template,
                'templateUrl': this.templateUrl,
                'styles': this.styles,
                'styleUrls': this.styleUrls,
                'ngContentSelectors': this.ngContentSelectors
            };
        };
        return CompileTemplateMetadata;
    }());
    /**
     * Metadata regarding compilation of a directive.
     */
    var CompileDirectiveMetadata = (function () {
        function CompileDirectiveMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, type = _b.type, isComponent = _b.isComponent, selector = _b.selector, exportAs = _b.exportAs, changeDetection = _b.changeDetection, inputs = _b.inputs, outputs = _b.outputs, hostListeners = _b.hostListeners, hostProperties = _b.hostProperties, hostAttributes = _b.hostAttributes, lifecycleHooks = _b.lifecycleHooks, providers = _b.providers, viewProviders = _b.viewProviders, queries = _b.queries, viewQueries = _b.viewQueries, template = _b.template;
            this.type = type;
            this.isComponent = isComponent;
            this.selector = selector;
            this.exportAs = exportAs;
            this.changeDetection = changeDetection;
            this.inputs = inputs;
            this.outputs = outputs;
            this.hostListeners = hostListeners;
            this.hostProperties = hostProperties;
            this.hostAttributes = hostAttributes;
            this.lifecycleHooks = _normalizeArray(lifecycleHooks);
            this.providers = _normalizeArray(providers);
            this.viewProviders = _normalizeArray(viewProviders);
            this.queries = _normalizeArray(queries);
            this.viewQueries = _normalizeArray(viewQueries);
            this.template = template;
        }
        CompileDirectiveMetadata.create = function (_a) {
            var _b = _a === void 0 ? {} : _a, type = _b.type, isComponent = _b.isComponent, selector = _b.selector, exportAs = _b.exportAs, changeDetection = _b.changeDetection, inputs = _b.inputs, outputs = _b.outputs, host = _b.host, lifecycleHooks = _b.lifecycleHooks, providers = _b.providers, viewProviders = _b.viewProviders, queries = _b.queries, viewQueries = _b.viewQueries, template = _b.template;
            var hostListeners = {};
            var hostProperties = {};
            var hostAttributes = {};
            if (isPresent(host)) {
                StringMapWrapper.forEach(host, function (value, key) {
                    var matches = RegExpWrapper.firstMatch(HOST_REG_EXP, key);
                    if (isBlank(matches)) {
                        hostAttributes[key] = value;
                    }
                    else if (isPresent(matches[1])) {
                        hostProperties[matches[1]] = value;
                    }
                    else if (isPresent(matches[2])) {
                        hostListeners[matches[2]] = value;
                    }
                });
            }
            var inputsMap = {};
            if (isPresent(inputs)) {
                inputs.forEach(function (bindConfig) {
                    // canonical syntax: `dirProp: elProp`
                    // if there is no `:`, use dirProp = elProp
                    var parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                    inputsMap[parts[0]] = parts[1];
                });
            }
            var outputsMap = {};
            if (isPresent(outputs)) {
                outputs.forEach(function (bindConfig) {
                    // canonical syntax: `dirProp: elProp`
                    // if there is no `:`, use dirProp = elProp
                    var parts = splitAtColon(bindConfig, [bindConfig, bindConfig]);
                    outputsMap[parts[0]] = parts[1];
                });
            }
            return new CompileDirectiveMetadata({
                type: type,
                isComponent: normalizeBool(isComponent),
                selector: selector,
                exportAs: exportAs,
                changeDetection: changeDetection,
                inputs: inputsMap,
                outputs: outputsMap,
                hostListeners: hostListeners,
                hostProperties: hostProperties,
                hostAttributes: hostAttributes,
                lifecycleHooks: isPresent(lifecycleHooks) ? lifecycleHooks : [],
                providers: providers,
                viewProviders: viewProviders,
                queries: queries,
                viewQueries: viewQueries,
                template: template
            });
        };
        Object.defineProperty(CompileDirectiveMetadata.prototype, "identifier", {
            get: function () { return this.type; },
            enumerable: true,
            configurable: true
        });
        CompileDirectiveMetadata.fromJson = function (data) {
            return new CompileDirectiveMetadata({
                isComponent: data['isComponent'],
                selector: data['selector'],
                exportAs: data['exportAs'],
                type: isPresent(data['type']) ? CompileTypeMetadata.fromJson(data['type']) : data['type'],
                changeDetection: isPresent(data['changeDetection']) ?
                    CHANGE_DETECTION_STRATEGY_VALUES[data['changeDetection']] :
                    data['changeDetection'],
                inputs: data['inputs'],
                outputs: data['outputs'],
                hostListeners: data['hostListeners'],
                hostProperties: data['hostProperties'],
                hostAttributes: data['hostAttributes'],
                lifecycleHooks: data['lifecycleHooks'].map(function (hookValue) { return LIFECYCLE_HOOKS_VALUES[hookValue]; }),
                template: isPresent(data['template']) ? CompileTemplateMetadata.fromJson(data['template']) :
                    data['template'],
                providers: _arrayFromJson(data['providers'], metadataFromJson),
                viewProviders: _arrayFromJson(data['viewProviders'], metadataFromJson),
                queries: _arrayFromJson(data['queries'], CompileQueryMetadata.fromJson),
                viewQueries: _arrayFromJson(data['viewQueries'], CompileQueryMetadata.fromJson)
            });
        };
        CompileDirectiveMetadata.prototype.toJson = function () {
            return {
                'class': 'Directive',
                'isComponent': this.isComponent,
                'selector': this.selector,
                'exportAs': this.exportAs,
                'type': isPresent(this.type) ? this.type.toJson() : this.type,
                'changeDetection': isPresent(this.changeDetection) ? serializeEnum(this.changeDetection) :
                    this.changeDetection,
                'inputs': this.inputs,
                'outputs': this.outputs,
                'hostListeners': this.hostListeners,
                'hostProperties': this.hostProperties,
                'hostAttributes': this.hostAttributes,
                'lifecycleHooks': this.lifecycleHooks.map(function (hook) { return serializeEnum(hook); }),
                'template': isPresent(this.template) ? this.template.toJson() : this.template,
                'providers': _arrayToJson(this.providers),
                'viewProviders': _arrayToJson(this.viewProviders),
                'queries': _arrayToJson(this.queries),
                'viewQueries': _arrayToJson(this.viewQueries)
            };
        };
        return CompileDirectiveMetadata;
    }());
    /**
     * Construct {@link CompileDirectiveMetadata} from {@link ComponentTypeMetadata} and a selector.
     */
    function createHostComponentMeta(componentType, componentSelector) {
        var template = CssSelector.parse(componentSelector)[0].getMatchingElementTemplate();
        return CompileDirectiveMetadata.create({
            type: new CompileTypeMetadata({
                runtime: Object,
                name: componentType.name + "_Host",
                moduleUrl: componentType.moduleUrl,
                isHost: true
            }),
            template: new CompileTemplateMetadata({ template: template, templateUrl: '', styles: [], styleUrls: [], ngContentSelectors: [] }),
            changeDetection: _angular_core.ChangeDetectionStrategy.Default,
            inputs: [],
            outputs: [],
            host: {},
            lifecycleHooks: [],
            isComponent: true,
            selector: '*',
            providers: [],
            viewProviders: [],
            queries: [],
            viewQueries: []
        });
    }
    var CompilePipeMetadata = (function () {
        function CompilePipeMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, type = _b.type, name = _b.name, pure = _b.pure, lifecycleHooks = _b.lifecycleHooks;
            this.type = type;
            this.name = name;
            this.pure = normalizeBool(pure);
            this.lifecycleHooks = _normalizeArray(lifecycleHooks);
        }
        Object.defineProperty(CompilePipeMetadata.prototype, "identifier", {
            get: function () { return this.type; },
            enumerable: true,
            configurable: true
        });
        CompilePipeMetadata.fromJson = function (data) {
            return new CompilePipeMetadata({
                type: isPresent(data['type']) ? CompileTypeMetadata.fromJson(data['type']) : data['type'],
                name: data['name'],
                pure: data['pure']
            });
        };
        CompilePipeMetadata.prototype.toJson = function () {
            return {
                'class': 'Pipe',
                'type': isPresent(this.type) ? this.type.toJson() : null,
                'name': this.name,
                'pure': this.pure
            };
        };
        return CompilePipeMetadata;
    }());
    var _COMPILE_METADATA_FROM_JSON = {
        'Directive': CompileDirectiveMetadata.fromJson,
        'Pipe': CompilePipeMetadata.fromJson,
        'Type': CompileTypeMetadata.fromJson,
        'Provider': CompileProviderMetadata.fromJson,
        'Identifier': CompileIdentifierMetadata.fromJson,
        'Factory': CompileFactoryMetadata.fromJson
    };
    function _arrayFromJson(obj, fn) {
        return isBlank(obj) ? null : obj.map(function (o) { return _objFromJson(o, fn); });
    }
    function _arrayToJson(obj) {
        return isBlank(obj) ? null : obj.map(_objToJson);
    }
    function _objFromJson(obj, fn) {
        if (isArray(obj))
            return _arrayFromJson(obj, fn);
        if (isString(obj) || isBlank(obj) || isBoolean(obj) || isNumber(obj))
            return obj;
        return fn(obj);
    }
    function _objToJson(obj) {
        if (isArray(obj))
            return _arrayToJson(obj);
        if (isString(obj) || isBlank(obj) || isBoolean(obj) || isNumber(obj))
            return obj;
        return obj.toJson();
    }
    function _normalizeArray(obj) {
        return isPresent(obj) ? obj : [];
    }
    var APP_VIEW_MODULE_URL = assetUrl('core', 'linker/view');
    var VIEW_UTILS_MODULE_URL = assetUrl('core', 'linker/view_utils');
    var CD_MODULE_URL = assetUrl('core', 'change_detection/change_detection');
    // Reassign the imports to different variables so we can
    // define static variables with the name of the import.
    // (only needed for Dart).
    var impViewUtils = ViewUtils;
    var impAppView = AppView;
    var impDebugAppView = DebugAppView;
    var impDebugContext = DebugContext;
    var impAppElement = AppElement;
    var impElementRef = _angular_core.ElementRef;
    var impViewContainerRef = _angular_core.ViewContainerRef;
    var impChangeDetectorRef = _angular_core.ChangeDetectorRef;
    var impRenderComponentType = _angular_core.RenderComponentType;
    var impQueryList = _angular_core.QueryList;
    var impTemplateRef = _angular_core.TemplateRef;
    var impTemplateRef_ = TemplateRef_;
    var impValueUnwrapper = ValueUnwrapper;
    var impInjector = _angular_core.Injector;
    var impViewEncapsulation = _angular_core.ViewEncapsulation;
    var impViewType = ViewType;
    var impChangeDetectionStrategy = _angular_core.ChangeDetectionStrategy;
    var impStaticNodeDebugInfo = StaticNodeDebugInfo;
    var impRenderer = _angular_core.Renderer;
    var impSimpleChange = _angular_core.SimpleChange;
    var impUninitialized = uninitialized;
    var impChangeDetectorState = ChangeDetectorState;
    var impFlattenNestedViewRenderNodes = flattenNestedViewRenderNodes;
    var impDevModeEqual = devModeEqual;
    var impInterpolate = interpolate;
    var impCheckBinding = checkBinding;
    var impCastByValue = castByValue;
    var impEMPTY_ARRAY = EMPTY_ARRAY;
    var impEMPTY_MAP = EMPTY_MAP;
    var Identifiers = (function () {
        function Identifiers() {
        }
        return Identifiers;
    }());
    Identifiers.ViewUtils = new CompileIdentifierMetadata({ name: 'ViewUtils', moduleUrl: assetUrl('core', 'linker/view_utils'), runtime: impViewUtils });
    Identifiers.AppView = new CompileIdentifierMetadata({ name: 'AppView', moduleUrl: APP_VIEW_MODULE_URL, runtime: impAppView });
    Identifiers.DebugAppView = new CompileIdentifierMetadata({ name: 'DebugAppView', moduleUrl: APP_VIEW_MODULE_URL, runtime: impDebugAppView });
    Identifiers.AppElement = new CompileIdentifierMetadata({ name: 'AppElement', moduleUrl: assetUrl('core', 'linker/element'), runtime: impAppElement });
    Identifiers.ElementRef = new CompileIdentifierMetadata({
        name: 'ElementRef',
        moduleUrl: assetUrl('core', 'linker/element_ref'),
        runtime: impElementRef
    });
    Identifiers.ViewContainerRef = new CompileIdentifierMetadata({
        name: 'ViewContainerRef',
        moduleUrl: assetUrl('core', 'linker/view_container_ref'),
        runtime: impViewContainerRef
    });
    Identifiers.ChangeDetectorRef = new CompileIdentifierMetadata({
        name: 'ChangeDetectorRef',
        moduleUrl: assetUrl('core', 'change_detection/change_detector_ref'),
        runtime: impChangeDetectorRef
    });
    Identifiers.RenderComponentType = new CompileIdentifierMetadata({
        name: 'RenderComponentType',
        moduleUrl: assetUrl('core', 'render/api'),
        runtime: impRenderComponentType
    });
    Identifiers.QueryList = new CompileIdentifierMetadata({ name: 'QueryList', moduleUrl: assetUrl('core', 'linker/query_list'), runtime: impQueryList });
    Identifiers.TemplateRef = new CompileIdentifierMetadata({
        name: 'TemplateRef',
        moduleUrl: assetUrl('core', 'linker/template_ref'),
        runtime: impTemplateRef
    });
    Identifiers.TemplateRef_ = new CompileIdentifierMetadata({
        name: 'TemplateRef_',
        moduleUrl: assetUrl('core', 'linker/template_ref'),
        runtime: impTemplateRef_
    });
    Identifiers.ValueUnwrapper = new CompileIdentifierMetadata({ name: 'ValueUnwrapper', moduleUrl: CD_MODULE_URL, runtime: impValueUnwrapper });
    Identifiers.Injector = new CompileIdentifierMetadata({ name: 'Injector', moduleUrl: assetUrl('core', 'di/injector'), runtime: impInjector });
    Identifiers.ViewEncapsulation = new CompileIdentifierMetadata({
        name: 'ViewEncapsulation',
        moduleUrl: assetUrl('core', 'metadata/view'),
        runtime: impViewEncapsulation
    });
    Identifiers.ViewType = new CompileIdentifierMetadata({ name: 'ViewType', moduleUrl: assetUrl('core', 'linker/view_type'), runtime: impViewType });
    Identifiers.ChangeDetectionStrategy = new CompileIdentifierMetadata({
        name: 'ChangeDetectionStrategy',
        moduleUrl: CD_MODULE_URL,
        runtime: impChangeDetectionStrategy
    });
    Identifiers.StaticNodeDebugInfo = new CompileIdentifierMetadata({
        name: 'StaticNodeDebugInfo',
        moduleUrl: assetUrl('core', 'linker/debug_context'),
        runtime: impStaticNodeDebugInfo
    });
    Identifiers.DebugContext = new CompileIdentifierMetadata({
        name: 'DebugContext',
        moduleUrl: assetUrl('core', 'linker/debug_context'),
        runtime: impDebugContext
    });
    Identifiers.Renderer = new CompileIdentifierMetadata({ name: 'Renderer', moduleUrl: assetUrl('core', 'render/api'), runtime: impRenderer });
    Identifiers.SimpleChange = new CompileIdentifierMetadata({ name: 'SimpleChange', moduleUrl: CD_MODULE_URL, runtime: impSimpleChange });
    Identifiers.uninitialized = new CompileIdentifierMetadata({ name: 'uninitialized', moduleUrl: CD_MODULE_URL, runtime: impUninitialized });
    Identifiers.ChangeDetectorState = new CompileIdentifierMetadata({ name: 'ChangeDetectorState', moduleUrl: CD_MODULE_URL, runtime: impChangeDetectorState });
    Identifiers.checkBinding = new CompileIdentifierMetadata({ name: 'checkBinding', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: impCheckBinding });
    Identifiers.flattenNestedViewRenderNodes = new CompileIdentifierMetadata({
        name: 'flattenNestedViewRenderNodes',
        moduleUrl: VIEW_UTILS_MODULE_URL,
        runtime: impFlattenNestedViewRenderNodes
    });
    Identifiers.devModeEqual = new CompileIdentifierMetadata({ name: 'devModeEqual', moduleUrl: CD_MODULE_URL, runtime: impDevModeEqual });
    Identifiers.interpolate = new CompileIdentifierMetadata({ name: 'interpolate', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: impInterpolate });
    Identifiers.castByValue = new CompileIdentifierMetadata({ name: 'castByValue', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: impCastByValue });
    Identifiers.EMPTY_ARRAY = new CompileIdentifierMetadata({ name: 'EMPTY_ARRAY', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: impEMPTY_ARRAY });
    Identifiers.EMPTY_MAP = new CompileIdentifierMetadata({ name: 'EMPTY_MAP', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: impEMPTY_MAP });
    Identifiers.pureProxies = [
        null,
        new CompileIdentifierMetadata({ name: 'pureProxy1', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy1 }),
        new CompileIdentifierMetadata({ name: 'pureProxy2', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy2 }),
        new CompileIdentifierMetadata({ name: 'pureProxy3', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy3 }),
        new CompileIdentifierMetadata({ name: 'pureProxy4', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy4 }),
        new CompileIdentifierMetadata({ name: 'pureProxy5', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy5 }),
        new CompileIdentifierMetadata({ name: 'pureProxy6', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy6 }),
        new CompileIdentifierMetadata({ name: 'pureProxy7', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy7 }),
        new CompileIdentifierMetadata({ name: 'pureProxy8', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy8 }),
        new CompileIdentifierMetadata({ name: 'pureProxy9', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy9 }),
        new CompileIdentifierMetadata({ name: 'pureProxy10', moduleUrl: VIEW_UTILS_MODULE_URL, runtime: pureProxy10 }),
    ];
    Identifiers.SecurityContext = new CompileIdentifierMetadata({
        name: 'SecurityContext',
        moduleUrl: assetUrl('core', 'security'),
        runtime: SecurityContext,
    });
    function identifierToken(identifier) {
        return new CompileTokenMetadata({ identifier: identifier });
    }
    var ProviderError = (function (_super) {
        __extends(ProviderError, _super);
        function ProviderError(message, span) {
            _super.call(this, span, message);
        }
        return ProviderError;
    }(ParseError));
    var ProviderViewContext = (function () {
        function ProviderViewContext(component, sourceSpan) {
            var _this = this;
            this.component = component;
            this.sourceSpan = sourceSpan;
            this.errors = [];
            this.viewQueries = _getViewQueries(component);
            this.viewProviders = new CompileTokenMap();
            _normalizeProviders(component.viewProviders, sourceSpan, this.errors)
                .forEach(function (provider) {
                    if (isBlank(_this.viewProviders.get(provider.token))) {
                        _this.viewProviders.add(provider.token, true);
                    }
                });
        }
        return ProviderViewContext;
    }());
    var ProviderElementContext = (function () {
        function ProviderElementContext(_viewContext, _parent, _isViewRoot, _directiveAsts, attrs, refs, _sourceSpan) {
            var _this = this;
            this._viewContext = _viewContext;
            this._parent = _parent;
            this._isViewRoot = _isViewRoot;
            this._directiveAsts = _directiveAsts;
            this._sourceSpan = _sourceSpan;
            this._transformedProviders = new CompileTokenMap();
            this._seenProviders = new CompileTokenMap();
            this._hasViewContainer = false;
            this._attrs = {};
            attrs.forEach(function (attrAst) { return _this._attrs[attrAst.name] = attrAst.value; });
            var directivesMeta = _directiveAsts.map(function (directiveAst) { return directiveAst.directive; });
            this._allProviders =
                _resolveProvidersFromDirectives(directivesMeta, _sourceSpan, _viewContext.errors);
            this._contentQueries = _getContentQueries(directivesMeta);
            var queriedTokens = new CompileTokenMap();
            this._allProviders.values().forEach(function (provider) { _this._addQueryReadsTo(provider.token, queriedTokens); });
            refs.forEach(function (refAst) {
                _this._addQueryReadsTo(new CompileTokenMetadata({ value: refAst.name }), queriedTokens);
            });
            if (isPresent(queriedTokens.get(identifierToken(Identifiers.ViewContainerRef)))) {
                this._hasViewContainer = true;
            }
            // create the providers that we know are eager first
            this._allProviders.values().forEach(function (provider) {
                var eager = provider.eager || isPresent(queriedTokens.get(provider.token));
                if (eager) {
                    _this._getOrCreateLocalProvider(provider.providerType, provider.token, true);
                }
            });
        }
        ProviderElementContext.prototype.afterElement = function () {
            var _this = this;
            // collect lazy providers
            this._allProviders.values().forEach(function (provider) {
                _this._getOrCreateLocalProvider(provider.providerType, provider.token, false);
            });
        };
        Object.defineProperty(ProviderElementContext.prototype, "transformProviders", {
            get: function () { return this._transformedProviders.values(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProviderElementContext.prototype, "transformedDirectiveAsts", {
            get: function () {
                var sortedProviderTypes = this._transformedProviders.values().map(function (provider) { return provider.token.identifier; });
                var sortedDirectives = ListWrapper.clone(this._directiveAsts);
                ListWrapper.sort(sortedDirectives, function (dir1, dir2) { return sortedProviderTypes.indexOf(dir1.directive.type) -
                    sortedProviderTypes.indexOf(dir2.directive.type); });
                return sortedDirectives;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProviderElementContext.prototype, "transformedHasViewContainer", {
            get: function () { return this._hasViewContainer; },
            enumerable: true,
            configurable: true
        });
        ProviderElementContext.prototype._addQueryReadsTo = function (token, queryReadTokens) {
            this._getQueriesFor(token).forEach(function (query) {
                var queryReadToken = isPresent(query.read) ? query.read : token;
                if (isBlank(queryReadTokens.get(queryReadToken))) {
                    queryReadTokens.add(queryReadToken, true);
                }
            });
        };
        ProviderElementContext.prototype._getQueriesFor = function (token) {
            var result = [];
            var currentEl = this;
            var distance = 0;
            var queries;
            while (currentEl !== null) {
                queries = currentEl._contentQueries.get(token);
                if (isPresent(queries)) {
                    ListWrapper.addAll(result, queries.filter(function (query) { return query.descendants || distance <= 1; }));
                }
                if (currentEl._directiveAsts.length > 0) {
                    distance++;
                }
                currentEl = currentEl._parent;
            }
            queries = this._viewContext.viewQueries.get(token);
            if (isPresent(queries)) {
                ListWrapper.addAll(result, queries);
            }
            return result;
        };
        ProviderElementContext.prototype._getOrCreateLocalProvider = function (requestingProviderType, token, eager) {
            var _this = this;
            var resolvedProvider = this._allProviders.get(token);
            if (isBlank(resolvedProvider) ||
                ((requestingProviderType === exports.ProviderAstType.Directive ||
                requestingProviderType === exports.ProviderAstType.PublicService) &&
                resolvedProvider.providerType === exports.ProviderAstType.PrivateService) ||
                ((requestingProviderType === exports.ProviderAstType.PrivateService ||
                requestingProviderType === exports.ProviderAstType.PublicService) &&
                resolvedProvider.providerType === exports.ProviderAstType.Builtin)) {
                return null;
            }
            var transformedProviderAst = this._transformedProviders.get(token);
            if (isPresent(transformedProviderAst)) {
                return transformedProviderAst;
            }
            if (isPresent(this._seenProviders.get(token))) {
                this._viewContext.errors.push(new ProviderError("Cannot instantiate cyclic dependency! " + token.name, this._sourceSpan));
                return null;
            }
            this._seenProviders.add(token, true);
            var transformedProviders = resolvedProvider.providers.map(function (provider) {
                var transformedUseValue = provider.useValue;
                var transformedUseExisting = provider.useExisting;
                var transformedDeps;
                if (isPresent(provider.useExisting)) {
                    var existingDiDep = _this._getDependency(resolvedProvider.providerType, new CompileDiDependencyMetadata({ token: provider.useExisting }), eager);
                    if (isPresent(existingDiDep.token)) {
                        transformedUseExisting = existingDiDep.token;
                    }
                    else {
                        transformedUseExisting = null;
                        transformedUseValue = existingDiDep.value;
                    }
                }
                else if (isPresent(provider.useFactory)) {
                    var deps = isPresent(provider.deps) ? provider.deps : provider.useFactory.diDeps;
                    transformedDeps =
                        deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
                }
                else if (isPresent(provider.useClass)) {
                    var deps = isPresent(provider.deps) ? provider.deps : provider.useClass.diDeps;
                    transformedDeps =
                        deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep, eager); });
                }
                return _transformProvider(provider, {
                    useExisting: transformedUseExisting,
                    useValue: transformedUseValue,
                    deps: transformedDeps
                });
            });
            transformedProviderAst =
                _transformProviderAst(resolvedProvider, { eager: eager, providers: transformedProviders });
            this._transformedProviders.add(token, transformedProviderAst);
            return transformedProviderAst;
        };
        ProviderElementContext.prototype._getLocalDependency = function (requestingProviderType, dep, eager) {
            if (eager === void 0) { eager = null; }
            if (dep.isAttribute) {
                var attrValue = this._attrs[dep.token.value];
                return new CompileDiDependencyMetadata({ isValue: true, value: normalizeBlank(attrValue) });
            }
            if (isPresent(dep.query) || isPresent(dep.viewQuery)) {
                return dep;
            }
            if (isPresent(dep.token)) {
                // access builtints
                if ((requestingProviderType === exports.ProviderAstType.Directive ||
                    requestingProviderType === exports.ProviderAstType.Component)) {
                    if (dep.token.equalsTo(identifierToken(Identifiers.Renderer)) ||
                        dep.token.equalsTo(identifierToken(Identifiers.ElementRef)) ||
                        dep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef)) ||
                        dep.token.equalsTo(identifierToken(Identifiers.TemplateRef))) {
                        return dep;
                    }
                    if (dep.token.equalsTo(identifierToken(Identifiers.ViewContainerRef))) {
                        this._hasViewContainer = true;
                    }
                }
                // access the injector
                if (dep.token.equalsTo(identifierToken(Identifiers.Injector))) {
                    return dep;
                }
                // access providers
                if (isPresent(this._getOrCreateLocalProvider(requestingProviderType, dep.token, eager))) {
                    return dep;
                }
            }
            return null;
        };
        ProviderElementContext.prototype._getDependency = function (requestingProviderType, dep, eager) {
            if (eager === void 0) { eager = null; }
            var currElement = this;
            var currEager = eager;
            var result = null;
            if (!dep.isSkipSelf) {
                result = this._getLocalDependency(requestingProviderType, dep, eager);
            }
            if (dep.isSelf) {
                if (isBlank(result) && dep.isOptional) {
                    result = new CompileDiDependencyMetadata({ isValue: true, value: null });
                }
            }
            else {
                // check parent elements
                while (isBlank(result) && isPresent(currElement._parent)) {
                    var prevElement = currElement;
                    currElement = currElement._parent;
                    if (prevElement._isViewRoot) {
                        currEager = false;
                    }
                    result = currElement._getLocalDependency(exports.ProviderAstType.PublicService, dep, currEager);
                }
                // check @Host restriction
                if (isBlank(result)) {
                    if (!dep.isHost || this._viewContext.component.type.isHost ||
                        identifierToken(this._viewContext.component.type).equalsTo(dep.token) ||
                        isPresent(this._viewContext.viewProviders.get(dep.token))) {
                        result = dep;
                    }
                    else {
                        result = dep.isOptional ?
                            result = new CompileDiDependencyMetadata({ isValue: true, value: null }) :
                            null;
                    }
                }
            }
            if (isBlank(result)) {
                this._viewContext.errors.push(new ProviderError("No provider for " + dep.token.name, this._sourceSpan));
            }
            return result;
        };
        return ProviderElementContext;
    }());
    function _transformProvider(provider, _a) {
        var useExisting = _a.useExisting, useValue = _a.useValue, deps = _a.deps;
        return new CompileProviderMetadata({
            token: provider.token,
            useClass: provider.useClass,
            useExisting: useExisting,
            useFactory: provider.useFactory,
            useValue: useValue,
            deps: deps,
            multi: provider.multi
        });
    }
    function _transformProviderAst(provider, _a) {
        var eager = _a.eager, providers = _a.providers;
        return new ProviderAst(provider.token, provider.multiProvider, provider.eager || eager, providers, provider.providerType, provider.sourceSpan);
    }
    function _normalizeProviders(providers, sourceSpan, targetErrors, targetProviders) {
        if (targetProviders === void 0) { targetProviders = null; }
        if (isBlank(targetProviders)) {
            targetProviders = [];
        }
        if (isPresent(providers)) {
            providers.forEach(function (provider) {
                if (isArray(provider)) {
                    _normalizeProviders(provider, sourceSpan, targetErrors, targetProviders);
                }
                else {
                    var normalizeProvider;
                    if (provider instanceof CompileProviderMetadata) {
                        normalizeProvider = provider;
                    }
                    else if (provider instanceof CompileTypeMetadata) {
                        normalizeProvider = new CompileProviderMetadata({ token: new CompileTokenMetadata({ identifier: provider }), useClass: provider });
                    }
                    else {
                        targetErrors.push(new ProviderError("Unknown provider type " + provider, sourceSpan));
                    }
                    if (isPresent(normalizeProvider)) {
                        targetProviders.push(normalizeProvider);
                    }
                }
            });
        }
        return targetProviders;
    }
    function _resolveProvidersFromDirectives(directives, sourceSpan, targetErrors) {
        var providersByToken = new CompileTokenMap();
        directives.forEach(function (directive) {
            var dirProvider = new CompileProviderMetadata({ token: new CompileTokenMetadata({ identifier: directive.type }), useClass: directive.type });
            _resolveProviders([dirProvider], directive.isComponent ? exports.ProviderAstType.Component : exports.ProviderAstType.Directive, true, sourceSpan, targetErrors, providersByToken);
        });
        // Note: directives need to be able to overwrite providers of a component!
        var directivesWithComponentFirst = directives.filter(function (dir) { return dir.isComponent; }).concat(directives.filter(function (dir) { return !dir.isComponent; }));
        directivesWithComponentFirst.forEach(function (directive) {
            _resolveProviders(_normalizeProviders(directive.providers, sourceSpan, targetErrors), exports.ProviderAstType.PublicService, false, sourceSpan, targetErrors, providersByToken);
            _resolveProviders(_normalizeProviders(directive.viewProviders, sourceSpan, targetErrors), exports.ProviderAstType.PrivateService, false, sourceSpan, targetErrors, providersByToken);
        });
        return providersByToken;
    }
    function _resolveProviders(providers, providerType, eager, sourceSpan, targetErrors, targetProvidersByToken) {
        providers.forEach(function (provider) {
            var resolvedProvider = targetProvidersByToken.get(provider.token);
            if (isPresent(resolvedProvider) && resolvedProvider.multiProvider !== provider.multi) {
                targetErrors.push(new ProviderError("Mixing multi and non multi provider is not possible for token " + resolvedProvider.token.name, sourceSpan));
            }
            if (isBlank(resolvedProvider)) {
                resolvedProvider = new ProviderAst(provider.token, provider.multi, eager, [provider], providerType, sourceSpan);
                targetProvidersByToken.add(provider.token, resolvedProvider);
            }
            else {
                if (!provider.multi) {
                    ListWrapper.clear(resolvedProvider.providers);
                }
                resolvedProvider.providers.push(provider);
            }
        });
    }
    function _getViewQueries(component) {
        var viewQueries = new CompileTokenMap();
        if (isPresent(component.viewQueries)) {
            component.viewQueries.forEach(function (query) { return _addQueryToTokenMap(viewQueries, query); });
        }
        component.type.diDeps.forEach(function (dep) {
            if (isPresent(dep.viewQuery)) {
                _addQueryToTokenMap(viewQueries, dep.viewQuery);
            }
        });
        return viewQueries;
    }
    function _getContentQueries(directives) {
        var contentQueries = new CompileTokenMap();
        directives.forEach(function (directive) {
            if (isPresent(directive.queries)) {
                directive.queries.forEach(function (query) { return _addQueryToTokenMap(contentQueries, query); });
            }
            directive.type.diDeps.forEach(function (dep) {
                if (isPresent(dep.query)) {
                    _addQueryToTokenMap(contentQueries, dep.query);
                }
            });
        });
        return contentQueries;
    }
    function _addQueryToTokenMap(map, query) {
        query.selectors.forEach(function (token) {
            var entry = map.get(token);
            if (isBlank(entry)) {
                entry = [];
                map.add(token, entry);
            }
            entry.push(query);
        });
    }
    // Group 1 = "bind-"
    // Group 2 = "var-"
    // Group 3 = "let-"
    // Group 4 = "ref-/#"
    // Group 5 = "on-"
    // Group 6 = "bindon-"
    // Group 7 = the identifier after "bind-", "var-/#", or "on-"
    // Group 8 = identifier inside [()]
    // Group 9 = identifier inside []
    // Group 10 = identifier inside ()
    var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(var-)|(let-)|(ref-|#)|(on-)|(bindon-))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/g;
    var TEMPLATE_ELEMENT = 'template';
    var TEMPLATE_ATTR = 'template';
    var TEMPLATE_ATTR_PREFIX = '*';
    var CLASS_ATTR = 'class';
    var PROPERTY_PARTS_SEPARATOR = '.';
    var ATTRIBUTE_PREFIX = 'attr';
    var CLASS_PREFIX = 'class';
    var STYLE_PREFIX = 'style';
    var TEXT_CSS_SELECTOR = CssSelector.parse('*')[0];
    /**
     * Provides an array of {@link TemplateAstVisitor}s which will be used to transform
     * parsed templates before compilation is invoked, allowing custom expression syntax
     * and other advanced transformations.
     *
     * This is currently an internal-only feature and not meant for general use.
     */
    var TEMPLATE_TRANSFORMS = new _angular_core.OpaqueToken('TemplateTransforms');
    var TemplateParseError = (function (_super) {
        __extends(TemplateParseError, _super);
        function TemplateParseError(message, span, level) {
            _super.call(this, span, message, level);
        }
        return TemplateParseError;
    }(ParseError));
    var TemplateParseResult = (function () {
        function TemplateParseResult(templateAst, errors) {
            this.templateAst = templateAst;
            this.errors = errors;
        }
        return TemplateParseResult;
    }());
    var TemplateParser = (function () {
        function TemplateParser(_exprParser, _schemaRegistry, _htmlParser, _console, transforms) {
            this._exprParser = _exprParser;
            this._schemaRegistry = _schemaRegistry;
            this._htmlParser = _htmlParser;
            this._console = _console;
            this.transforms = transforms;
        }
        TemplateParser.prototype.parse = function (component, template, directives, pipes, templateUrl) {
            var result = this.tryParse(component, template, directives, pipes, templateUrl);
            var warnings = result.errors.filter(function (error) { return error.level === ParseErrorLevel.WARNING; });
            var errors = result.errors.filter(function (error) { return error.level === ParseErrorLevel.FATAL; });
            if (warnings.length > 0) {
                this._console.warn("Template parse warnings:\n" + warnings.join('\n'));
            }
            if (errors.length > 0) {
                var errorString = errors.join('\n');
                throw new BaseException$1("Template parse errors:\n" + errorString);
            }
            return result.templateAst;
        };
        TemplateParser.prototype.tryParse = function (component, template, directives, pipes, templateUrl) {
            var htmlAstWithErrors = this._htmlParser.parse(template, templateUrl);
            var errors = htmlAstWithErrors.errors;
            var result;
            if (htmlAstWithErrors.rootNodes.length > 0) {
                var uniqDirectives = removeDuplicates(directives);
                var uniqPipes = removeDuplicates(pipes);
                var providerViewContext = new ProviderViewContext(component, htmlAstWithErrors.rootNodes[0].sourceSpan);
                var parseVisitor = new TemplateParseVisitor(providerViewContext, uniqDirectives, uniqPipes, this._exprParser, this._schemaRegistry);
                result = htmlVisitAll(parseVisitor, htmlAstWithErrors.rootNodes, EMPTY_ELEMENT_CONTEXT);
                errors = errors.concat(parseVisitor.errors).concat(providerViewContext.errors);
            }
            else {
                result = [];
            }
            if (errors.length > 0) {
                return new TemplateParseResult(result, errors);
            }
            if (isPresent(this.transforms)) {
                this.transforms.forEach(function (transform) { result = templateVisitAll(transform, result); });
            }
            return new TemplateParseResult(result, errors);
        };
        return TemplateParser;
    }());
    TemplateParser.decorators = [
        { type: _angular_core.Injectable },
    ];
    TemplateParser.ctorParameters = [
        { type: Parser, },
        { type: ElementSchemaRegistry, },
        { type: HtmlParser, },
        { type: Console, },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [TEMPLATE_TRANSFORMS,] },] },
    ];
    var TemplateParseVisitor = (function () {
        function TemplateParseVisitor(providerViewContext, directives, pipes, _exprParser, _schemaRegistry) {
            var _this = this;
            this.providerViewContext = providerViewContext;
            this._exprParser = _exprParser;
            this._schemaRegistry = _schemaRegistry;
            this.errors = [];
            this.directivesIndex = new Map();
            this.ngContentCount = 0;
            this.selectorMatcher = new SelectorMatcher();
            ListWrapper.forEachWithIndex(directives, function (directive, index) {
                var selector = CssSelector.parse(directive.selector);
                _this.selectorMatcher.addSelectables(selector, directive);
                _this.directivesIndex.set(directive, index);
            });
            this.pipesByName = new Map();
            pipes.forEach(function (pipe) { return _this.pipesByName.set(pipe.name, pipe); });
        }
        TemplateParseVisitor.prototype._reportError = function (message, sourceSpan, level) {
            if (level === void 0) { level = ParseErrorLevel.FATAL; }
            this.errors.push(new TemplateParseError(message, sourceSpan, level));
        };
        TemplateParseVisitor.prototype._parseInterpolation = function (value, sourceSpan) {
            var sourceInfo = sourceSpan.start.toString();
            try {
                var ast = this._exprParser.parseInterpolation(value, sourceInfo);
                this._checkPipes(ast, sourceSpan);
                if (isPresent(ast) &&
                    ast.ast.expressions.length > MAX_INTERPOLATION_VALUES) {
                    throw new BaseException$1("Only support at most " + MAX_INTERPOLATION_VALUES + " interpolation values!");
                }
                return ast;
            }
            catch (e) {
                this._reportError("" + e, sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
        };
        TemplateParseVisitor.prototype._parseAction = function (value, sourceSpan) {
            var sourceInfo = sourceSpan.start.toString();
            try {
                var ast = this._exprParser.parseAction(value, sourceInfo);
                this._checkPipes(ast, sourceSpan);
                return ast;
            }
            catch (e) {
                this._reportError("" + e, sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
        };
        TemplateParseVisitor.prototype._parseBinding = function (value, sourceSpan) {
            var sourceInfo = sourceSpan.start.toString();
            try {
                var ast = this._exprParser.parseBinding(value, sourceInfo);
                this._checkPipes(ast, sourceSpan);
                return ast;
            }
            catch (e) {
                this._reportError("" + e, sourceSpan);
                return this._exprParser.wrapLiteralPrimitive('ERROR', sourceInfo);
            }
        };
        TemplateParseVisitor.prototype._parseTemplateBindings = function (value, sourceSpan) {
            var _this = this;
            var sourceInfo = sourceSpan.start.toString();
            try {
                var bindingsResult = this._exprParser.parseTemplateBindings(value, sourceInfo);
                bindingsResult.templateBindings.forEach(function (binding) {
                    if (isPresent(binding.expression)) {
                        _this._checkPipes(binding.expression, sourceSpan);
                    }
                });
                bindingsResult.warnings.forEach(function (warning) { _this._reportError(warning, sourceSpan, ParseErrorLevel.WARNING); });
                return bindingsResult.templateBindings;
            }
            catch (e) {
                this._reportError("" + e, sourceSpan);
                return [];
            }
        };
        TemplateParseVisitor.prototype._checkPipes = function (ast, sourceSpan) {
            var _this = this;
            if (isPresent(ast)) {
                var collector = new PipeCollector();
                ast.visit(collector);
                collector.pipes.forEach(function (pipeName) {
                    if (!_this.pipesByName.has(pipeName)) {
                        _this._reportError("The pipe '" + pipeName + "' could not be found", sourceSpan);
                    }
                });
            }
        };
        TemplateParseVisitor.prototype.visitExpansion = function (ast, context) { return null; };
        TemplateParseVisitor.prototype.visitExpansionCase = function (ast, context) { return null; };
        TemplateParseVisitor.prototype.visitText = function (ast, parent) {
            var ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR);
            var expr = this._parseInterpolation(ast.value, ast.sourceSpan);
            if (isPresent(expr)) {
                return new BoundTextAst(expr, ngContentIndex, ast.sourceSpan);
            }
            else {
                return new TextAst(ast.value, ngContentIndex, ast.sourceSpan);
            }
        };
        TemplateParseVisitor.prototype.visitAttr = function (ast, contex) {
            return new AttrAst(ast.name, ast.value, ast.sourceSpan);
        };
        TemplateParseVisitor.prototype.visitComment = function (ast, context) { return null; };
        TemplateParseVisitor.prototype.visitElement = function (element, parent) {
            var _this = this;
            var nodeName = element.name;
            var preparsedElement = preparseElement(element);
            if (preparsedElement.type === PreparsedElementType.SCRIPT ||
                preparsedElement.type === PreparsedElementType.STYLE) {
                // Skipping <script> for security reasons
                // Skipping <style> as we already processed them
                // in the StyleCompiler
                return null;
            }
            if (preparsedElement.type === PreparsedElementType.STYLESHEET &&
                isStyleUrlResolvable(preparsedElement.hrefAttr)) {
                // Skipping stylesheets with either relative urls or package scheme as we already processed
                // them in the StyleCompiler
                return null;
            }
            var matchableAttrs = [];
            var elementOrDirectiveProps = [];
            var elementOrDirectiveRefs = [];
            var elementVars = [];
            var events = [];
            var templateElementOrDirectiveProps = [];
            var templateMatchableAttrs = [];
            var templateElementVars = [];
            var hasInlineTemplates = false;
            var attrs = [];
            var lcElName = splitNsName(nodeName.toLowerCase())[1];
            var isTemplateElement = lcElName == TEMPLATE_ELEMENT;
            element.attrs.forEach(function (attr) {
                var hasBinding = _this._parseAttr(isTemplateElement, attr, matchableAttrs, elementOrDirectiveProps, events, elementOrDirectiveRefs, elementVars);
                var hasTemplateBinding = _this._parseInlineTemplateBinding(attr, templateMatchableAttrs, templateElementOrDirectiveProps, templateElementVars);
                if (!hasBinding && !hasTemplateBinding) {
                    // don't include the bindings as attributes as well in the AST
                    attrs.push(_this.visitAttr(attr, null));
                    matchableAttrs.push([attr.name, attr.value]);
                }
                if (hasTemplateBinding) {
                    hasInlineTemplates = true;
                }
            });
            var elementCssSelector = createElementCssSelector(nodeName, matchableAttrs);
            var directiveMetas = this._parseDirectives(this.selectorMatcher, elementCssSelector);
            var references = [];
            var directiveAsts = this._createDirectiveAsts(isTemplateElement, element.name, directiveMetas, elementOrDirectiveProps, elementOrDirectiveRefs, element.sourceSpan, references);
            var elementProps = this._createElementPropertyAsts(element.name, elementOrDirectiveProps, directiveAsts);
            var isViewRoot = parent.isTemplateElement || hasInlineTemplates;
            var providerContext = new ProviderElementContext(this.providerViewContext, parent.providerContext, isViewRoot, directiveAsts, attrs, references, element.sourceSpan);
            var children = htmlVisitAll(preparsedElement.nonBindable ? NON_BINDABLE_VISITOR : this, element.children, ElementContext.create(isTemplateElement, directiveAsts, isTemplateElement ? parent.providerContext : providerContext));
            providerContext.afterElement();
            // Override the actual selector when the `ngProjectAs` attribute is provided
            var projectionSelector = isPresent(preparsedElement.projectAs) ?
                CssSelector.parse(preparsedElement.projectAs)[0] :
                elementCssSelector;
            var ngContentIndex = parent.findNgContentIndex(projectionSelector);
            var parsedElement;
            if (preparsedElement.type === PreparsedElementType.NG_CONTENT) {
                if (isPresent(element.children) && element.children.length > 0) {
                    this._reportError("<ng-content> element cannot have content. <ng-content> must be immediately followed by </ng-content>", element.sourceSpan);
                }
                parsedElement = new NgContentAst(this.ngContentCount++, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
            }
            else if (isTemplateElement) {
                this._assertAllEventsPublishedByDirectives(directiveAsts, events);
                this._assertNoComponentsNorElementBindingsOnTemplate(directiveAsts, elementProps, element.sourceSpan);
                parsedElement = new EmbeddedTemplateAst(attrs, events, references, elementVars, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, children, hasInlineTemplates ? null : ngContentIndex, element.sourceSpan);
            }
            else {
                this._assertOnlyOneComponent(directiveAsts, element.sourceSpan);
                var ngContentIndex_1 = hasInlineTemplates ? null : parent.findNgContentIndex(projectionSelector);
                parsedElement = new ElementAst(nodeName, attrs, elementProps, events, references, providerContext.transformedDirectiveAsts, providerContext.transformProviders, providerContext.transformedHasViewContainer, children, hasInlineTemplates ? null : ngContentIndex_1, element.sourceSpan);
            }
            if (hasInlineTemplates) {
                var templateCssSelector = createElementCssSelector(TEMPLATE_ELEMENT, templateMatchableAttrs);
                var templateDirectiveMetas = this._parseDirectives(this.selectorMatcher, templateCssSelector);
                var templateDirectiveAsts = this._createDirectiveAsts(true, element.name, templateDirectiveMetas, templateElementOrDirectiveProps, [], element.sourceSpan, []);
                var templateElementProps = this._createElementPropertyAsts(element.name, templateElementOrDirectiveProps, templateDirectiveAsts);
                this._assertNoComponentsNorElementBindingsOnTemplate(templateDirectiveAsts, templateElementProps, element.sourceSpan);
                var templateProviderContext = new ProviderElementContext(this.providerViewContext, parent.providerContext, parent.isTemplateElement, templateDirectiveAsts, [], [], element.sourceSpan);
                templateProviderContext.afterElement();
                parsedElement = new EmbeddedTemplateAst([], [], [], templateElementVars, templateProviderContext.transformedDirectiveAsts, templateProviderContext.transformProviders, templateProviderContext.transformedHasViewContainer, [parsedElement], ngContentIndex, element.sourceSpan);
            }
            return parsedElement;
        };
        TemplateParseVisitor.prototype._parseInlineTemplateBinding = function (attr, targetMatchableAttrs, targetProps, targetVars) {
            var templateBindingsSource = null;
            if (attr.name == TEMPLATE_ATTR) {
                templateBindingsSource = attr.value;
            }
            else if (attr.name.startsWith(TEMPLATE_ATTR_PREFIX)) {
                var key = attr.name.substring(TEMPLATE_ATTR_PREFIX.length); // remove the star
                templateBindingsSource = (attr.value.length == 0) ? key : key + ' ' + attr.value;
            }
            if (isPresent(templateBindingsSource)) {
                var bindings = this._parseTemplateBindings(templateBindingsSource, attr.sourceSpan);
                for (var i = 0; i < bindings.length; i++) {
                    var binding = bindings[i];
                    if (binding.keyIsVar) {
                        targetVars.push(new VariableAst(binding.key, binding.name, attr.sourceSpan));
                    }
                    else if (isPresent(binding.expression)) {
                        this._parsePropertyAst(binding.key, binding.expression, attr.sourceSpan, targetMatchableAttrs, targetProps);
                    }
                    else {
                        targetMatchableAttrs.push([binding.key, '']);
                        this._parseLiteralAttr(binding.key, null, attr.sourceSpan, targetProps);
                    }
                }
                return true;
            }
            return false;
        };
        TemplateParseVisitor.prototype._parseAttr = function (isTemplateElement, attr, targetMatchableAttrs, targetProps, targetEvents, targetRefs, targetVars) {
            var attrName = this._normalizeAttributeName(attr.name);
            var attrValue = attr.value;
            var bindParts = RegExpWrapper.firstMatch(BIND_NAME_REGEXP, attrName);
            var hasBinding = false;
            if (isPresent(bindParts)) {
                hasBinding = true;
                if (isPresent(bindParts[1])) {
                    this._parseProperty(bindParts[7], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
                }
                else if (isPresent(bindParts[2])) {
                    var identifier = bindParts[7];
                    if (isTemplateElement) {
                        this._reportError("\"var-\" on <template> elements is deprecated. Use \"let-\" instead!", attr.sourceSpan, ParseErrorLevel.WARNING);
                        this._parseVariable(identifier, attrValue, attr.sourceSpan, targetVars);
                    }
                    else {
                        this._reportError("\"var-\" on non <template> elements is deprecated. Use \"ref-\" instead!", attr.sourceSpan, ParseErrorLevel.WARNING);
                        this._parseReference(identifier, attrValue, attr.sourceSpan, targetRefs);
                    }
                }
                else if (isPresent(bindParts[3])) {
                    if (isTemplateElement) {
                        var identifier = bindParts[7];
                        this._parseVariable(identifier, attrValue, attr.sourceSpan, targetVars);
                    }
                    else {
                        this._reportError("\"let-\" is only supported on template elements.", attr.sourceSpan);
                    }
                }
                else if (isPresent(bindParts[4])) {
                    var identifier = bindParts[7];
                    this._parseReference(identifier, attrValue, attr.sourceSpan, targetRefs);
                }
                else if (isPresent(bindParts[5])) {
                    this._parseEvent(bindParts[7], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
                }
                else if (isPresent(bindParts[6])) {
                    this._parseProperty(bindParts[7], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
                    this._parseAssignmentEvent(bindParts[7], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
                }
                else if (isPresent(bindParts[8])) {
                    this._parseProperty(bindParts[8], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
                    this._parseAssignmentEvent(bindParts[8], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
                }
                else if (isPresent(bindParts[9])) {
                    this._parseProperty(bindParts[9], attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
                }
                else if (isPresent(bindParts[10])) {
                    this._parseEvent(bindParts[10], attrValue, attr.sourceSpan, targetMatchableAttrs, targetEvents);
                }
            }
            else {
                hasBinding = this._parsePropertyInterpolation(attrName, attrValue, attr.sourceSpan, targetMatchableAttrs, targetProps);
            }
            if (!hasBinding) {
                this._parseLiteralAttr(attrName, attrValue, attr.sourceSpan, targetProps);
            }
            return hasBinding;
        };
        TemplateParseVisitor.prototype._normalizeAttributeName = function (attrName) {
            return attrName.toLowerCase().startsWith('data-') ? attrName.substring(5) : attrName;
        };
        TemplateParseVisitor.prototype._parseVariable = function (identifier, value, sourceSpan, targetVars) {
            if (identifier.indexOf('-') > -1) {
                this._reportError("\"-\" is not allowed in variable names", sourceSpan);
            }
            targetVars.push(new VariableAst(identifier, value, sourceSpan));
        };
        TemplateParseVisitor.prototype._parseReference = function (identifier, value, sourceSpan, targetRefs) {
            if (identifier.indexOf('-') > -1) {
                this._reportError("\"-\" is not allowed in reference names", sourceSpan);
            }
            targetRefs.push(new ElementOrDirectiveRef(identifier, value, sourceSpan));
        };
        TemplateParseVisitor.prototype._parseProperty = function (name, expression, sourceSpan, targetMatchableAttrs, targetProps) {
            this._parsePropertyAst(name, this._parseBinding(expression, sourceSpan), sourceSpan, targetMatchableAttrs, targetProps);
        };
        TemplateParseVisitor.prototype._parsePropertyInterpolation = function (name, value, sourceSpan, targetMatchableAttrs, targetProps) {
            var expr = this._parseInterpolation(value, sourceSpan);
            if (isPresent(expr)) {
                this._parsePropertyAst(name, expr, sourceSpan, targetMatchableAttrs, targetProps);
                return true;
            }
            return false;
        };
        TemplateParseVisitor.prototype._parsePropertyAst = function (name, ast, sourceSpan, targetMatchableAttrs, targetProps) {
            targetMatchableAttrs.push([name, ast.source]);
            targetProps.push(new BoundElementOrDirectiveProperty(name, ast, false, sourceSpan));
        };
        TemplateParseVisitor.prototype._parseAssignmentEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
            this._parseEvent(name + "Change", expression + "=$event", sourceSpan, targetMatchableAttrs, targetEvents);
        };
        TemplateParseVisitor.prototype._parseEvent = function (name, expression, sourceSpan, targetMatchableAttrs, targetEvents) {
            // long format: 'target: eventName'
            var parts = splitAtColon(name, [null, name]);
            var target = parts[0];
            var eventName = parts[1];
            var ast = this._parseAction(expression, sourceSpan);
            targetMatchableAttrs.push([name, ast.source]);
            targetEvents.push(new BoundEventAst(eventName, target, ast, sourceSpan));
            // Don't detect directives for event names for now,
            // so don't add the event name to the matchableAttrs
        };
        TemplateParseVisitor.prototype._parseLiteralAttr = function (name, value, sourceSpan, targetProps) {
            targetProps.push(new BoundElementOrDirectiveProperty(name, this._exprParser.wrapLiteralPrimitive(value, ''), true, sourceSpan));
        };
        TemplateParseVisitor.prototype._parseDirectives = function (selectorMatcher, elementCssSelector) {
            var _this = this;
            // Need to sort the directives so that we get consistent results throughout,
            // as selectorMatcher uses Maps inside.
            // Also dedupe directives as they might match more than one time!
            var directives = ListWrapper.createFixedSize(this.directivesIndex.size);
            selectorMatcher.match(elementCssSelector, function (selector, directive) {
                directives[_this.directivesIndex.get(directive)] = directive;
            });
            return directives.filter(function (dir) { return isPresent(dir); });
        };
        TemplateParseVisitor.prototype._createDirectiveAsts = function (isTemplateElement, elementName, directives, props, elementOrDirectiveRefs, sourceSpan, targetReferences) {
            var _this = this;
            var matchedReferences = new Set();
            var component = null;
            var directiveAsts = directives.map(function (directive) {
                if (directive.isComponent) {
                    component = directive;
                }
                var hostProperties = [];
                var hostEvents = [];
                var directiveProperties = [];
                _this._createDirectiveHostPropertyAsts(elementName, directive.hostProperties, sourceSpan, hostProperties);
                _this._createDirectiveHostEventAsts(directive.hostListeners, sourceSpan, hostEvents);
                _this._createDirectivePropertyAsts(directive.inputs, props, directiveProperties);
                elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                    if ((elOrDirRef.value.length === 0 && directive.isComponent) ||
                        (directive.exportAs == elOrDirRef.value)) {
                        targetReferences.push(new ReferenceAst(elOrDirRef.name, identifierToken(directive.type), elOrDirRef.sourceSpan));
                        matchedReferences.add(elOrDirRef.name);
                    }
                });
                return new DirectiveAst(directive, directiveProperties, hostProperties, hostEvents, sourceSpan);
            });
            elementOrDirectiveRefs.forEach(function (elOrDirRef) {
                if (elOrDirRef.value.length > 0) {
                    if (!SetWrapper.has(matchedReferences, elOrDirRef.name)) {
                        _this._reportError("There is no directive with \"exportAs\" set to \"" + elOrDirRef.value + "\"", elOrDirRef.sourceSpan);
                    }
                    ;
                }
                else if (isBlank(component)) {
                    var refToken = null;
                    if (isTemplateElement) {
                        refToken = identifierToken(Identifiers.TemplateRef);
                    }
                    targetReferences.push(new ReferenceAst(elOrDirRef.name, refToken, elOrDirRef.sourceSpan));
                }
            }); // fix syntax highlighting issue: `
            return directiveAsts;
        };
        TemplateParseVisitor.prototype._createDirectiveHostPropertyAsts = function (elementName, hostProps, sourceSpan, targetPropertyAsts) {
            var _this = this;
            if (isPresent(hostProps)) {
                StringMapWrapper.forEach(hostProps, function (expression, propName) {
                    var exprAst = _this._parseBinding(expression, sourceSpan);
                    targetPropertyAsts.push(_this._createElementPropertyAst(elementName, propName, exprAst, sourceSpan));
                });
            }
        };
        TemplateParseVisitor.prototype._createDirectiveHostEventAsts = function (hostListeners, sourceSpan, targetEventAsts) {
            var _this = this;
            if (isPresent(hostListeners)) {
                StringMapWrapper.forEach(hostListeners, function (expression, propName) {
                    _this._parseEvent(propName, expression, sourceSpan, [], targetEventAsts);
                });
            }
        };
        TemplateParseVisitor.prototype._createDirectivePropertyAsts = function (directiveProperties, boundProps, targetBoundDirectiveProps) {
            if (isPresent(directiveProperties)) {
                var boundPropsByName = new Map();
                boundProps.forEach(function (boundProp) {
                    var prevValue = boundPropsByName.get(boundProp.name);
                    if (isBlank(prevValue) || prevValue.isLiteral) {
                        // give [a]="b" a higher precedence than a="b" on the same element
                        boundPropsByName.set(boundProp.name, boundProp);
                    }
                });
                StringMapWrapper.forEach(directiveProperties, function (elProp, dirProp) {
                    var boundProp = boundPropsByName.get(elProp);
                    // Bindings are optional, so this binding only needs to be set up if an expression is given.
                    if (isPresent(boundProp)) {
                        targetBoundDirectiveProps.push(new BoundDirectivePropertyAst(dirProp, boundProp.name, boundProp.expression, boundProp.sourceSpan));
                    }
                });
            }
        };
        TemplateParseVisitor.prototype._createElementPropertyAsts = function (elementName, props, directives) {
            var _this = this;
            var boundElementProps = [];
            var boundDirectivePropsIndex = new Map();
            directives.forEach(function (directive) {
                directive.inputs.forEach(function (prop) {
                    boundDirectivePropsIndex.set(prop.templateName, prop);
                });
            });
            props.forEach(function (prop) {
                if (!prop.isLiteral && isBlank(boundDirectivePropsIndex.get(prop.name))) {
                    boundElementProps.push(_this._createElementPropertyAst(elementName, prop.name, prop.expression, prop.sourceSpan));
                }
            });
            return boundElementProps;
        };
        TemplateParseVisitor.prototype._createElementPropertyAst = function (elementName, name, ast, sourceSpan) {
            var unit = null;
            var bindingType;
            var boundPropertyName;
            var parts = name.split(PROPERTY_PARTS_SEPARATOR);
            var securityContext;
            if (parts.length === 1) {
                boundPropertyName = this._schemaRegistry.getMappedPropName(parts[0]);
                securityContext = this._schemaRegistry.securityContext(elementName, boundPropertyName);
                bindingType = exports.PropertyBindingType.Property;
                if (!this._schemaRegistry.hasProperty(elementName, boundPropertyName)) {
                    this._reportError("Can't bind to '" + boundPropertyName + "' since it isn't a known native property", sourceSpan);
                }
            }
            else {
                if (parts[0] == ATTRIBUTE_PREFIX) {
                    boundPropertyName = parts[1];
                    if (boundPropertyName.toLowerCase().startsWith('on')) {
                        this._reportError(("Binding to event attribute '" + boundPropertyName + "' is disallowed ") +
                            ("for security reasons, please use (" + boundPropertyName.slice(2) + ")=..."), sourceSpan);
                    }
                    // NB: For security purposes, use the mapped property name, not the attribute name.
                    securityContext = this._schemaRegistry.securityContext(elementName, this._schemaRegistry.getMappedPropName(boundPropertyName));
                    var nsSeparatorIdx = boundPropertyName.indexOf(':');
                    if (nsSeparatorIdx > -1) {
                        var ns = boundPropertyName.substring(0, nsSeparatorIdx);
                        var name_2 = boundPropertyName.substring(nsSeparatorIdx + 1);
                        boundPropertyName = mergeNsAndName(ns, name_2);
                    }
                    bindingType = exports.PropertyBindingType.Attribute;
                }
                else if (parts[0] == CLASS_PREFIX) {
                    boundPropertyName = parts[1];
                    bindingType = exports.PropertyBindingType.Class;
                    securityContext = SecurityContext.NONE;
                }
                else if (parts[0] == STYLE_PREFIX) {
                    unit = parts.length > 2 ? parts[2] : null;
                    boundPropertyName = parts[1];
                    bindingType = exports.PropertyBindingType.Style;
                    securityContext = SecurityContext.STYLE;
                }
                else {
                    this._reportError("Invalid property name '" + name + "'", sourceSpan);
                    bindingType = null;
                    securityContext = null;
                }
            }
            return new BoundElementPropertyAst(boundPropertyName, bindingType, securityContext, ast, unit, sourceSpan);
        };
        TemplateParseVisitor.prototype._findComponentDirectiveNames = function (directives) {
            var componentTypeNames = [];
            directives.forEach(function (directive) {
                var typeName = directive.directive.type.name;
                if (directive.directive.isComponent) {
                    componentTypeNames.push(typeName);
                }
            });
            return componentTypeNames;
        };
        TemplateParseVisitor.prototype._assertOnlyOneComponent = function (directives, sourceSpan) {
            var componentTypeNames = this._findComponentDirectiveNames(directives);
            if (componentTypeNames.length > 1) {
                this._reportError("More than one component: " + componentTypeNames.join(','), sourceSpan);
            }
        };
        TemplateParseVisitor.prototype._assertNoComponentsNorElementBindingsOnTemplate = function (directives, elementProps, sourceSpan) {
            var _this = this;
            var componentTypeNames = this._findComponentDirectiveNames(directives);
            if (componentTypeNames.length > 0) {
                this._reportError("Components on an embedded template: " + componentTypeNames.join(','), sourceSpan);
            }
            elementProps.forEach(function (prop) {
                _this._reportError("Property binding " + prop.name + " not used by any directive on an embedded template", sourceSpan);
            });
        };
        TemplateParseVisitor.prototype._assertAllEventsPublishedByDirectives = function (directives, events) {
            var _this = this;
            var allDirectiveEvents = new Set();
            directives.forEach(function (directive) {
                StringMapWrapper.forEach(directive.directive.outputs, function (eventName, _) { allDirectiveEvents.add(eventName); });
            });
            events.forEach(function (event) {
                if (isPresent(event.target) || !SetWrapper.has(allDirectiveEvents, event.name)) {
                    _this._reportError("Event binding " + event.fullName + " not emitted by any directive on an embedded template", event.sourceSpan);
                }
            });
        };
        return TemplateParseVisitor;
    }());
    var NonBindableVisitor = (function () {
        function NonBindableVisitor() {
        }
        NonBindableVisitor.prototype.visitElement = function (ast, parent) {
            var preparsedElement = preparseElement(ast);
            if (preparsedElement.type === PreparsedElementType.SCRIPT ||
                preparsedElement.type === PreparsedElementType.STYLE ||
                preparsedElement.type === PreparsedElementType.STYLESHEET) {
                // Skipping <script> for security reasons
                // Skipping <style> and stylesheets as we already processed them
                // in the StyleCompiler
                return null;
            }
            var attrNameAndValues = ast.attrs.map(function (attrAst) { return [attrAst.name, attrAst.value]; });
            var selector = createElementCssSelector(ast.name, attrNameAndValues);
            var ngContentIndex = parent.findNgContentIndex(selector);
            var children = htmlVisitAll(this, ast.children, EMPTY_ELEMENT_CONTEXT);
            return new ElementAst(ast.name, htmlVisitAll(this, ast.attrs), [], [], [], [], [], false, children, ngContentIndex, ast.sourceSpan);
        };
        NonBindableVisitor.prototype.visitComment = function (ast, context) { return null; };
        NonBindableVisitor.prototype.visitAttr = function (ast, context) {
            return new AttrAst(ast.name, ast.value, ast.sourceSpan);
        };
        NonBindableVisitor.prototype.visitText = function (ast, parent) {
            var ngContentIndex = parent.findNgContentIndex(TEXT_CSS_SELECTOR);
            return new TextAst(ast.value, ngContentIndex, ast.sourceSpan);
        };
        NonBindableVisitor.prototype.visitExpansion = function (ast, context) { return ast; };
        NonBindableVisitor.prototype.visitExpansionCase = function (ast, context) { return ast; };
        return NonBindableVisitor;
    }());
    var BoundElementOrDirectiveProperty = (function () {
        function BoundElementOrDirectiveProperty(name, expression, isLiteral, sourceSpan) {
            this.name = name;
            this.expression = expression;
            this.isLiteral = isLiteral;
            this.sourceSpan = sourceSpan;
        }
        return BoundElementOrDirectiveProperty;
    }());
    var ElementOrDirectiveRef = (function () {
        function ElementOrDirectiveRef(name, value, sourceSpan) {
            this.name = name;
            this.value = value;
            this.sourceSpan = sourceSpan;
        }
        return ElementOrDirectiveRef;
    }());
    function splitClasses(classAttrValue) {
        return StringWrapper.split(classAttrValue.trim(), /\s+/g);
    }
    var ElementContext = (function () {
        function ElementContext(isTemplateElement, _ngContentIndexMatcher, _wildcardNgContentIndex, providerContext) {
            this.isTemplateElement = isTemplateElement;
            this._ngContentIndexMatcher = _ngContentIndexMatcher;
            this._wildcardNgContentIndex = _wildcardNgContentIndex;
            this.providerContext = providerContext;
        }
        ElementContext.create = function (isTemplateElement, directives, providerContext) {
            var matcher = new SelectorMatcher();
            var wildcardNgContentIndex = null;
            var component = directives.find(function (directive) { return directive.directive.isComponent; });
            if (isPresent(component)) {
                var ngContentSelectors = component.directive.template.ngContentSelectors;
                for (var i = 0; i < ngContentSelectors.length; i++) {
                    var selector = ngContentSelectors[i];
                    if (StringWrapper.equals(selector, '*')) {
                        wildcardNgContentIndex = i;
                    }
                    else {
                        matcher.addSelectables(CssSelector.parse(ngContentSelectors[i]), i);
                    }
                }
            }
            return new ElementContext(isTemplateElement, matcher, wildcardNgContentIndex, providerContext);
        };
        ElementContext.prototype.findNgContentIndex = function (selector) {
            var ngContentIndices = [];
            this._ngContentIndexMatcher.match(selector, function (selector, ngContentIndex) { ngContentIndices.push(ngContentIndex); });
            ListWrapper.sort(ngContentIndices);
            if (isPresent(this._wildcardNgContentIndex)) {
                ngContentIndices.push(this._wildcardNgContentIndex);
            }
            return ngContentIndices.length > 0 ? ngContentIndices[0] : null;
        };
        return ElementContext;
    }());
    function createElementCssSelector(elementName, matchableAttrs) {
        var cssSelector = new CssSelector();
        var elNameNoNs = splitNsName(elementName)[1];
        cssSelector.setElement(elNameNoNs);
        for (var i = 0; i < matchableAttrs.length; i++) {
            var attrName = matchableAttrs[i][0];
            var attrNameNoNs = splitNsName(attrName)[1];
            var attrValue = matchableAttrs[i][1];
            cssSelector.addAttribute(attrNameNoNs, attrValue);
            if (attrName.toLowerCase() == CLASS_ATTR) {
                var classes = splitClasses(attrValue);
                classes.forEach(function (className) { return cssSelector.addClassName(className); });
            }
        }
        return cssSelector;
    }
    var EMPTY_ELEMENT_CONTEXT = new ElementContext(true, new SelectorMatcher(), null, null);
    var NON_BINDABLE_VISITOR = new NonBindableVisitor();
    var PipeCollector = (function (_super) {
        __extends(PipeCollector, _super);
        function PipeCollector() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.apply(this, args);
            this.pipes = new Set();
        }
        PipeCollector.prototype.visitPipe = function (ast, context) {
            this.pipes.add(ast.name);
            ast.exp.visit(this);
            this.visitAll(ast.args, context);
            return null;
        };
        return PipeCollector;
    }(RecursiveAstVisitor));
    function removeDuplicates(items) {
        var res = [];
        items.forEach(function (item) {
            var hasMatch = res.filter(function (r) { return r.type.name == item.type.name && r.type.moduleUrl == item.type.moduleUrl &&
                    r.type.runtime == item.type.runtime; })
                    .length > 0;
            if (!hasMatch) {
                res.push(item);
            }
        });
        return res;
    }
    var CompilerConfig = (function () {
        function CompilerConfig(genDebugInfo, logBindingUpdate, useJit, renderTypes) {
            if (renderTypes === void 0) { renderTypes = null; }
            this.genDebugInfo = genDebugInfo;
            this.logBindingUpdate = logBindingUpdate;
            this.useJit = useJit;
            if (isBlank(renderTypes)) {
                renderTypes = new DefaultRenderTypes();
            }
            this.renderTypes = renderTypes;
        }
        return CompilerConfig;
    }());
    /**
     * Types used for the renderer.
     * Can be replaced to specialize the generated output to a specific renderer
     * to help tree shaking.
     */
    var RenderTypes = (function () {
        function RenderTypes() {
        }
        Object.defineProperty(RenderTypes.prototype, "renderer", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTypes.prototype, "renderText", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTypes.prototype, "renderElement", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTypes.prototype, "renderComment", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTypes.prototype, "renderNode", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTypes.prototype, "renderEvent", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return RenderTypes;
    }());
    var DefaultRenderTypes = (function () {
        function DefaultRenderTypes() {
            this.renderer = Identifiers.Renderer;
            this.renderText = null;
            this.renderElement = null;
            this.renderComment = null;
            this.renderNode = null;
            this.renderEvent = null;
        }
        return DefaultRenderTypes;
    }());
    //// Types
    var TypeModifier;
    (function (TypeModifier) {
        TypeModifier[TypeModifier["Const"] = 0] = "Const";
    })(TypeModifier || (TypeModifier = {}));
    var Type$1 = (function () {
        function Type$1(modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            this.modifiers = modifiers;
            if (isBlank(modifiers)) {
                this.modifiers = [];
            }
        }
        Type$1.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
        return Type$1;
    }());
    var BuiltinTypeName;
    (function (BuiltinTypeName) {
        BuiltinTypeName[BuiltinTypeName["Dynamic"] = 0] = "Dynamic";
        BuiltinTypeName[BuiltinTypeName["Bool"] = 1] = "Bool";
        BuiltinTypeName[BuiltinTypeName["String"] = 2] = "String";
        BuiltinTypeName[BuiltinTypeName["Int"] = 3] = "Int";
        BuiltinTypeName[BuiltinTypeName["Number"] = 4] = "Number";
        BuiltinTypeName[BuiltinTypeName["Function"] = 5] = "Function";
    })(BuiltinTypeName || (BuiltinTypeName = {}));
    var BuiltinType = (function (_super) {
        __extends(BuiltinType, _super);
        function BuiltinType(name, modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.name = name;
        }
        BuiltinType.prototype.visitType = function (visitor, context) {
            return visitor.visitBuiltintType(this, context);
        };
        return BuiltinType;
    }(Type$1));
    var ExternalType = (function (_super) {
        __extends(ExternalType, _super);
        function ExternalType(value, typeParams, modifiers) {
            if (typeParams === void 0) { typeParams = null; }
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.value = value;
            this.typeParams = typeParams;
        }
        ExternalType.prototype.visitType = function (visitor, context) {
            return visitor.visitExternalType(this, context);
        };
        return ExternalType;
    }(Type$1));
    var ArrayType = (function (_super) {
        __extends(ArrayType, _super);
        function ArrayType(of, modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.of = of;
        }
        ArrayType.prototype.visitType = function (visitor, context) {
            return visitor.visitArrayType(this, context);
        };
        return ArrayType;
    }(Type$1));
    var MapType = (function (_super) {
        __extends(MapType, _super);
        function MapType(valueType, modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.valueType = valueType;
        }
        MapType.prototype.visitType = function (visitor, context) { return visitor.visitMapType(this, context); };
        return MapType;
    }(Type$1));
    var DYNAMIC_TYPE = new BuiltinType(BuiltinTypeName.Dynamic);
    var BOOL_TYPE = new BuiltinType(BuiltinTypeName.Bool);
    var INT_TYPE = new BuiltinType(BuiltinTypeName.Int);
    var NUMBER_TYPE = new BuiltinType(BuiltinTypeName.Number);
    var STRING_TYPE = new BuiltinType(BuiltinTypeName.String);
    var FUNCTION_TYPE = new BuiltinType(BuiltinTypeName.Function);
    ///// Expressions
    var BinaryOperator;
    (function (BinaryOperator) {
        BinaryOperator[BinaryOperator["Equals"] = 0] = "Equals";
        BinaryOperator[BinaryOperator["NotEquals"] = 1] = "NotEquals";
        BinaryOperator[BinaryOperator["Identical"] = 2] = "Identical";
        BinaryOperator[BinaryOperator["NotIdentical"] = 3] = "NotIdentical";
        BinaryOperator[BinaryOperator["Minus"] = 4] = "Minus";
        BinaryOperator[BinaryOperator["Plus"] = 5] = "Plus";
        BinaryOperator[BinaryOperator["Divide"] = 6] = "Divide";
        BinaryOperator[BinaryOperator["Multiply"] = 7] = "Multiply";
        BinaryOperator[BinaryOperator["Modulo"] = 8] = "Modulo";
        BinaryOperator[BinaryOperator["And"] = 9] = "And";
        BinaryOperator[BinaryOperator["Or"] = 10] = "Or";
        BinaryOperator[BinaryOperator["Lower"] = 11] = "Lower";
        BinaryOperator[BinaryOperator["LowerEquals"] = 12] = "LowerEquals";
        BinaryOperator[BinaryOperator["Bigger"] = 13] = "Bigger";
        BinaryOperator[BinaryOperator["BiggerEquals"] = 14] = "BiggerEquals";
    })(BinaryOperator || (BinaryOperator = {}));
    var Expression = (function () {
        function Expression(type) {
            this.type = type;
        }
        Expression.prototype.prop = function (name) { return new ReadPropExpr(this, name); };
        Expression.prototype.key = function (index, type) {
            if (type === void 0) { type = null; }
            return new ReadKeyExpr(this, index, type);
        };
        Expression.prototype.callMethod = function (name, params) {
            return new InvokeMethodExpr(this, name, params);
        };
        Expression.prototype.callFn = function (params) { return new InvokeFunctionExpr(this, params); };
        Expression.prototype.instantiate = function (params, type) {
            if (type === void 0) { type = null; }
            return new InstantiateExpr(this, params, type);
        };
        Expression.prototype.conditional = function (trueCase, falseCase) {
            if (falseCase === void 0) { falseCase = null; }
            return new ConditionalExpr(this, trueCase, falseCase);
        };
        Expression.prototype.equals = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Equals, this, rhs);
        };
        Expression.prototype.notEquals = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.NotEquals, this, rhs);
        };
        Expression.prototype.identical = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Identical, this, rhs);
        };
        Expression.prototype.notIdentical = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.NotIdentical, this, rhs);
        };
        Expression.prototype.minus = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Minus, this, rhs);
        };
        Expression.prototype.plus = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Plus, this, rhs);
        };
        Expression.prototype.divide = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Divide, this, rhs);
        };
        Expression.prototype.multiply = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Multiply, this, rhs);
        };
        Expression.prototype.modulo = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Modulo, this, rhs);
        };
        Expression.prototype.and = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.And, this, rhs);
        };
        Expression.prototype.or = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Or, this, rhs);
        };
        Expression.prototype.lower = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Lower, this, rhs);
        };
        Expression.prototype.lowerEquals = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.LowerEquals, this, rhs);
        };
        Expression.prototype.bigger = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.Bigger, this, rhs);
        };
        Expression.prototype.biggerEquals = function (rhs) {
            return new BinaryOperatorExpr(BinaryOperator.BiggerEquals, this, rhs);
        };
        Expression.prototype.isBlank = function () {
            // Note: We use equals by purpose here to compare to null and undefined in JS.
            return this.equals(NULL_EXPR);
        };
        Expression.prototype.cast = function (type) { return new CastExpr(this, type); };
        Expression.prototype.toStmt = function () { return new ExpressionStatement(this); };
        return Expression;
    }());
    var BuiltinVar;
    (function (BuiltinVar) {
        BuiltinVar[BuiltinVar["This"] = 0] = "This";
        BuiltinVar[BuiltinVar["Super"] = 1] = "Super";
        BuiltinVar[BuiltinVar["CatchError"] = 2] = "CatchError";
        BuiltinVar[BuiltinVar["CatchStack"] = 3] = "CatchStack";
    })(BuiltinVar || (BuiltinVar = {}));
    var ReadVarExpr = (function (_super) {
        __extends(ReadVarExpr, _super);
        function ReadVarExpr(name, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            if (isString(name)) {
                this.name = name;
                this.builtin = null;
            }
            else {
                this.name = null;
                this.builtin = name;
            }
        }
        ReadVarExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitReadVarExpr(this, context);
        };
        ReadVarExpr.prototype.set = function (value) { return new WriteVarExpr(this.name, value); };
        return ReadVarExpr;
    }(Expression));
    var WriteVarExpr = (function (_super) {
        __extends(WriteVarExpr, _super);
        function WriteVarExpr(name, value, type) {
            if (type === void 0) { type = null; }
            _super.call(this, isPresent(type) ? type : value.type);
            this.name = name;
            this.value = value;
        }
        WriteVarExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWriteVarExpr(this, context);
        };
        WriteVarExpr.prototype.toDeclStmt = function (type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = null; }
            return new DeclareVarStmt(this.name, this.value, type, modifiers);
        };
        return WriteVarExpr;
    }(Expression));
    var WriteKeyExpr = (function (_super) {
        __extends(WriteKeyExpr, _super);
        function WriteKeyExpr(receiver, index, value, type) {
            if (type === void 0) { type = null; }
            _super.call(this, isPresent(type) ? type : value.type);
            this.receiver = receiver;
            this.index = index;
            this.value = value;
        }
        WriteKeyExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWriteKeyExpr(this, context);
        };
        return WriteKeyExpr;
    }(Expression));
    var WritePropExpr = (function (_super) {
        __extends(WritePropExpr, _super);
        function WritePropExpr(receiver, name, value, type) {
            if (type === void 0) { type = null; }
            _super.call(this, isPresent(type) ? type : value.type);
            this.receiver = receiver;
            this.name = name;
            this.value = value;
        }
        WritePropExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitWritePropExpr(this, context);
        };
        return WritePropExpr;
    }(Expression));
    var BuiltinMethod;
    (function (BuiltinMethod) {
        BuiltinMethod[BuiltinMethod["ConcatArray"] = 0] = "ConcatArray";
        BuiltinMethod[BuiltinMethod["SubscribeObservable"] = 1] = "SubscribeObservable";
        BuiltinMethod[BuiltinMethod["bind"] = 2] = "bind";
    })(BuiltinMethod || (BuiltinMethod = {}));
    var InvokeMethodExpr = (function (_super) {
        __extends(InvokeMethodExpr, _super);
        function InvokeMethodExpr(receiver, method, args, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.receiver = receiver;
            this.args = args;
            if (isString(method)) {
                this.name = method;
                this.builtin = null;
            }
            else {
                this.name = null;
                this.builtin = method;
            }
        }
        InvokeMethodExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitInvokeMethodExpr(this, context);
        };
        return InvokeMethodExpr;
    }(Expression));
    var InvokeFunctionExpr = (function (_super) {
        __extends(InvokeFunctionExpr, _super);
        function InvokeFunctionExpr(fn, args, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.fn = fn;
            this.args = args;
        }
        InvokeFunctionExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitInvokeFunctionExpr(this, context);
        };
        return InvokeFunctionExpr;
    }(Expression));
    var InstantiateExpr = (function (_super) {
        __extends(InstantiateExpr, _super);
        function InstantiateExpr(classExpr, args, type) {
            _super.call(this, type);
            this.classExpr = classExpr;
            this.args = args;
        }
        InstantiateExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitInstantiateExpr(this, context);
        };
        return InstantiateExpr;
    }(Expression));
    var LiteralExpr = (function (_super) {
        __extends(LiteralExpr, _super);
        function LiteralExpr(value, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.value = value;
        }
        LiteralExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLiteralExpr(this, context);
        };
        return LiteralExpr;
    }(Expression));
    var ExternalExpr = (function (_super) {
        __extends(ExternalExpr, _super);
        function ExternalExpr(value, type, typeParams) {
            if (type === void 0) { type = null; }
            if (typeParams === void 0) { typeParams = null; }
            _super.call(this, type);
            this.value = value;
            this.typeParams = typeParams;
        }
        ExternalExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitExternalExpr(this, context);
        };
        return ExternalExpr;
    }(Expression));
    var ConditionalExpr = (function (_super) {
        __extends(ConditionalExpr, _super);
        function ConditionalExpr(condition, trueCase, falseCase, type) {
            if (falseCase === void 0) { falseCase = null; }
            if (type === void 0) { type = null; }
            _super.call(this, isPresent(type) ? type : trueCase.type);
            this.condition = condition;
            this.falseCase = falseCase;
            this.trueCase = trueCase;
        }
        ConditionalExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitConditionalExpr(this, context);
        };
        return ConditionalExpr;
    }(Expression));
    var NotExpr = (function (_super) {
        __extends(NotExpr, _super);
        function NotExpr(condition) {
            _super.call(this, BOOL_TYPE);
            this.condition = condition;
        }
        NotExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitNotExpr(this, context);
        };
        return NotExpr;
    }(Expression));
    var CastExpr = (function (_super) {
        __extends(CastExpr, _super);
        function CastExpr(value, type) {
            _super.call(this, type);
            this.value = value;
        }
        CastExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitCastExpr(this, context);
        };
        return CastExpr;
    }(Expression));
    var FnParam = (function () {
        function FnParam(name, type) {
            if (type === void 0) { type = null; }
            this.name = name;
            this.type = type;
        }
        return FnParam;
    }());
    var FunctionExpr = (function (_super) {
        __extends(FunctionExpr, _super);
        function FunctionExpr(params, statements, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.params = params;
            this.statements = statements;
        }
        FunctionExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitFunctionExpr(this, context);
        };
        FunctionExpr.prototype.toDeclStmt = function (name, modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            return new DeclareFunctionStmt(name, this.params, this.statements, this.type, modifiers);
        };
        return FunctionExpr;
    }(Expression));
    var BinaryOperatorExpr = (function (_super) {
        __extends(BinaryOperatorExpr, _super);
        function BinaryOperatorExpr(operator, lhs, rhs, type) {
            if (type === void 0) { type = null; }
            _super.call(this, isPresent(type) ? type : lhs.type);
            this.operator = operator;
            this.rhs = rhs;
            this.lhs = lhs;
        }
        BinaryOperatorExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitBinaryOperatorExpr(this, context);
        };
        return BinaryOperatorExpr;
    }(Expression));
    var ReadPropExpr = (function (_super) {
        __extends(ReadPropExpr, _super);
        function ReadPropExpr(receiver, name, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.receiver = receiver;
            this.name = name;
        }
        ReadPropExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitReadPropExpr(this, context);
        };
        ReadPropExpr.prototype.set = function (value) {
            return new WritePropExpr(this.receiver, this.name, value);
        };
        return ReadPropExpr;
    }(Expression));
    var ReadKeyExpr = (function (_super) {
        __extends(ReadKeyExpr, _super);
        function ReadKeyExpr(receiver, index, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.receiver = receiver;
            this.index = index;
        }
        ReadKeyExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitReadKeyExpr(this, context);
        };
        ReadKeyExpr.prototype.set = function (value) {
            return new WriteKeyExpr(this.receiver, this.index, value);
        };
        return ReadKeyExpr;
    }(Expression));
    var LiteralArrayExpr = (function (_super) {
        __extends(LiteralArrayExpr, _super);
        function LiteralArrayExpr(entries, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.entries = entries;
        }
        LiteralArrayExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLiteralArrayExpr(this, context);
        };
        return LiteralArrayExpr;
    }(Expression));
    var LiteralMapExpr = (function (_super) {
        __extends(LiteralMapExpr, _super);
        function LiteralMapExpr(entries, type) {
            if (type === void 0) { type = null; }
            _super.call(this, type);
            this.entries = entries;
            this.valueType = null;
            if (isPresent(type)) {
                this.valueType = type.valueType;
            }
        }
        LiteralMapExpr.prototype.visitExpression = function (visitor, context) {
            return visitor.visitLiteralMapExpr(this, context);
        };
        return LiteralMapExpr;
    }(Expression));
    var THIS_EXPR = new ReadVarExpr(BuiltinVar.This);
    var SUPER_EXPR = new ReadVarExpr(BuiltinVar.Super);
    var CATCH_ERROR_VAR = new ReadVarExpr(BuiltinVar.CatchError);
    var CATCH_STACK_VAR = new ReadVarExpr(BuiltinVar.CatchStack);
    var NULL_EXPR = new LiteralExpr(null, null);
    //// Statements
    var StmtModifier;
    (function (StmtModifier) {
        StmtModifier[StmtModifier["Final"] = 0] = "Final";
        StmtModifier[StmtModifier["Private"] = 1] = "Private";
    })(StmtModifier || (StmtModifier = {}));
    var Statement = (function () {
        function Statement(modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            this.modifiers = modifiers;
            if (isBlank(modifiers)) {
                this.modifiers = [];
            }
        }
        Statement.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
        return Statement;
    }());
    var DeclareVarStmt = (function (_super) {
        __extends(DeclareVarStmt, _super);
        function DeclareVarStmt(name, value, type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.name = name;
            this.value = value;
            this.type = isPresent(type) ? type : value.type;
        }
        DeclareVarStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitDeclareVarStmt(this, context);
        };
        return DeclareVarStmt;
    }(Statement));
    var DeclareFunctionStmt = (function (_super) {
        __extends(DeclareFunctionStmt, _super);
        function DeclareFunctionStmt(name, params, statements, type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.name = name;
            this.params = params;
            this.statements = statements;
            this.type = type;
        }
        DeclareFunctionStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitDeclareFunctionStmt(this, context);
        };
        return DeclareFunctionStmt;
    }(Statement));
    var ExpressionStatement = (function (_super) {
        __extends(ExpressionStatement, _super);
        function ExpressionStatement(expr) {
            _super.call(this);
            this.expr = expr;
        }
        ExpressionStatement.prototype.visitStatement = function (visitor, context) {
            return visitor.visitExpressionStmt(this, context);
        };
        return ExpressionStatement;
    }(Statement));
    var ReturnStatement = (function (_super) {
        __extends(ReturnStatement, _super);
        function ReturnStatement(value) {
            _super.call(this);
            this.value = value;
        }
        ReturnStatement.prototype.visitStatement = function (visitor, context) {
            return visitor.visitReturnStmt(this, context);
        };
        return ReturnStatement;
    }(Statement));
    var AbstractClassPart = (function () {
        function AbstractClassPart(type, modifiers) {
            if (type === void 0) { type = null; }
            this.type = type;
            this.modifiers = modifiers;
            if (isBlank(modifiers)) {
                this.modifiers = [];
            }
        }
        AbstractClassPart.prototype.hasModifier = function (modifier) { return this.modifiers.indexOf(modifier) !== -1; };
        return AbstractClassPart;
    }());
    var ClassField = (function (_super) {
        __extends(ClassField, _super);
        function ClassField(name, type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, type, modifiers);
            this.name = name;
        }
        return ClassField;
    }(AbstractClassPart));
    var ClassMethod = (function (_super) {
        __extends(ClassMethod, _super);
        function ClassMethod(name, params, body, type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, type, modifiers);
            this.name = name;
            this.params = params;
            this.body = body;
        }
        return ClassMethod;
    }(AbstractClassPart));
    var ClassGetter = (function (_super) {
        __extends(ClassGetter, _super);
        function ClassGetter(name, body, type, modifiers) {
            if (type === void 0) { type = null; }
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, type, modifiers);
            this.name = name;
            this.body = body;
        }
        return ClassGetter;
    }(AbstractClassPart));
    var ClassStmt = (function (_super) {
        __extends(ClassStmt, _super);
        function ClassStmt(name, parent, fields, getters, constructorMethod, methods, modifiers) {
            if (modifiers === void 0) { modifiers = null; }
            _super.call(this, modifiers);
            this.name = name;
            this.parent = parent;
            this.fields = fields;
            this.getters = getters;
            this.constructorMethod = constructorMethod;
            this.methods = methods;
        }
        ClassStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitDeclareClassStmt(this, context);
        };
        return ClassStmt;
    }(Statement));
    var IfStmt = (function (_super) {
        __extends(IfStmt, _super);
        function IfStmt(condition, trueCase, falseCase) {
            if (falseCase === void 0) { falseCase = []; }
            _super.call(this);
            this.condition = condition;
            this.trueCase = trueCase;
            this.falseCase = falseCase;
        }
        IfStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitIfStmt(this, context);
        };
        return IfStmt;
    }(Statement));
    var TryCatchStmt = (function (_super) {
        __extends(TryCatchStmt, _super);
        function TryCatchStmt(bodyStmts, catchStmts) {
            _super.call(this);
            this.bodyStmts = bodyStmts;
            this.catchStmts = catchStmts;
        }
        TryCatchStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitTryCatchStmt(this, context);
        };
        return TryCatchStmt;
    }(Statement));
    var ThrowStmt = (function (_super) {
        __extends(ThrowStmt, _super);
        function ThrowStmt(error) {
            _super.call(this);
            this.error = error;
        }
        ThrowStmt.prototype.visitStatement = function (visitor, context) {
            return visitor.visitThrowStmt(this, context);
        };
        return ThrowStmt;
    }(Statement));
    var ExpressionTransformer = (function () {
        function ExpressionTransformer() {
        }
        ExpressionTransformer.prototype.visitReadVarExpr = function (ast, context) { return ast; };
        ExpressionTransformer.prototype.visitWriteVarExpr = function (expr, context) {
            return new WriteVarExpr(expr.name, expr.value.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitWriteKeyExpr = function (expr, context) {
            return new WriteKeyExpr(expr.receiver.visitExpression(this, context), expr.index.visitExpression(this, context), expr.value.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitWritePropExpr = function (expr, context) {
            return new WritePropExpr(expr.receiver.visitExpression(this, context), expr.name, expr.value.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitInvokeMethodExpr = function (ast, context) {
            var method = isPresent(ast.builtin) ? ast.builtin : ast.name;
            return new InvokeMethodExpr(ast.receiver.visitExpression(this, context), method, this.visitAllExpressions(ast.args, context), ast.type);
        };
        ExpressionTransformer.prototype.visitInvokeFunctionExpr = function (ast, context) {
            return new InvokeFunctionExpr(ast.fn.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type);
        };
        ExpressionTransformer.prototype.visitInstantiateExpr = function (ast, context) {
            return new InstantiateExpr(ast.classExpr.visitExpression(this, context), this.visitAllExpressions(ast.args, context), ast.type);
        };
        ExpressionTransformer.prototype.visitLiteralExpr = function (ast, context) { return ast; };
        ExpressionTransformer.prototype.visitExternalExpr = function (ast, context) { return ast; };
        ExpressionTransformer.prototype.visitConditionalExpr = function (ast, context) {
            return new ConditionalExpr(ast.condition.visitExpression(this, context), ast.trueCase.visitExpression(this, context), ast.falseCase.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitNotExpr = function (ast, context) {
            return new NotExpr(ast.condition.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitCastExpr = function (ast, context) {
            return new CastExpr(ast.value.visitExpression(this, context), context);
        };
        ExpressionTransformer.prototype.visitFunctionExpr = function (ast, context) {
            // Don't descend into nested functions
            return ast;
        };
        ExpressionTransformer.prototype.visitBinaryOperatorExpr = function (ast, context) {
            return new BinaryOperatorExpr(ast.operator, ast.lhs.visitExpression(this, context), ast.rhs.visitExpression(this, context), ast.type);
        };
        ExpressionTransformer.prototype.visitReadPropExpr = function (ast, context) {
            return new ReadPropExpr(ast.receiver.visitExpression(this, context), ast.name, ast.type);
        };
        ExpressionTransformer.prototype.visitReadKeyExpr = function (ast, context) {
            return new ReadKeyExpr(ast.receiver.visitExpression(this, context), ast.index.visitExpression(this, context), ast.type);
        };
        ExpressionTransformer.prototype.visitLiteralArrayExpr = function (ast, context) {
            return new LiteralArrayExpr(this.visitAllExpressions(ast.entries, context));
        };
        ExpressionTransformer.prototype.visitLiteralMapExpr = function (ast, context) {
            var _this = this;
            return new LiteralMapExpr(ast.entries.map(function (entry) { return [entry[0], entry[1].visitExpression(_this, context)]; }));
        };
        ExpressionTransformer.prototype.visitAllExpressions = function (exprs, context) {
            var _this = this;
            return exprs.map(function (expr) { return expr.visitExpression(_this, context); });
        };
        ExpressionTransformer.prototype.visitDeclareVarStmt = function (stmt, context) {
            return new DeclareVarStmt(stmt.name, stmt.value.visitExpression(this, context), stmt.type, stmt.modifiers);
        };
        ExpressionTransformer.prototype.visitDeclareFunctionStmt = function (stmt, context) {
            // Don't descend into nested functions
            return stmt;
        };
        ExpressionTransformer.prototype.visitExpressionStmt = function (stmt, context) {
            return new ExpressionStatement(stmt.expr.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitReturnStmt = function (stmt, context) {
            return new ReturnStatement(stmt.value.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitDeclareClassStmt = function (stmt, context) {
            // Don't descend into nested functions
            return stmt;
        };
        ExpressionTransformer.prototype.visitIfStmt = function (stmt, context) {
            return new IfStmt(stmt.condition.visitExpression(this, context), this.visitAllStatements(stmt.trueCase, context), this.visitAllStatements(stmt.falseCase, context));
        };
        ExpressionTransformer.prototype.visitTryCatchStmt = function (stmt, context) {
            return new TryCatchStmt(this.visitAllStatements(stmt.bodyStmts, context), this.visitAllStatements(stmt.catchStmts, context));
        };
        ExpressionTransformer.prototype.visitThrowStmt = function (stmt, context) {
            return new ThrowStmt(stmt.error.visitExpression(this, context));
        };
        ExpressionTransformer.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
        ExpressionTransformer.prototype.visitAllStatements = function (stmts, context) {
            var _this = this;
            return stmts.map(function (stmt) { return stmt.visitStatement(_this, context); });
        };
        return ExpressionTransformer;
    }());
    var RecursiveExpressionVisitor = (function () {
        function RecursiveExpressionVisitor() {
        }
        RecursiveExpressionVisitor.prototype.visitReadVarExpr = function (ast, context) { return ast; };
        RecursiveExpressionVisitor.prototype.visitWriteVarExpr = function (expr, context) {
            expr.value.visitExpression(this, context);
            return expr;
        };
        RecursiveExpressionVisitor.prototype.visitWriteKeyExpr = function (expr, context) {
            expr.receiver.visitExpression(this, context);
            expr.index.visitExpression(this, context);
            expr.value.visitExpression(this, context);
            return expr;
        };
        RecursiveExpressionVisitor.prototype.visitWritePropExpr = function (expr, context) {
            expr.receiver.visitExpression(this, context);
            expr.value.visitExpression(this, context);
            return expr;
        };
        RecursiveExpressionVisitor.prototype.visitInvokeMethodExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            this.visitAllExpressions(ast.args, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitInvokeFunctionExpr = function (ast, context) {
            ast.fn.visitExpression(this, context);
            this.visitAllExpressions(ast.args, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitInstantiateExpr = function (ast, context) {
            ast.classExpr.visitExpression(this, context);
            this.visitAllExpressions(ast.args, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitLiteralExpr = function (ast, context) { return ast; };
        RecursiveExpressionVisitor.prototype.visitExternalExpr = function (ast, context) { return ast; };
        RecursiveExpressionVisitor.prototype.visitConditionalExpr = function (ast, context) {
            ast.condition.visitExpression(this, context);
            ast.trueCase.visitExpression(this, context);
            ast.falseCase.visitExpression(this, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitNotExpr = function (ast, context) {
            ast.condition.visitExpression(this, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitCastExpr = function (ast, context) {
            ast.value.visitExpression(this, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitFunctionExpr = function (ast, context) { return ast; };
        RecursiveExpressionVisitor.prototype.visitBinaryOperatorExpr = function (ast, context) {
            ast.lhs.visitExpression(this, context);
            ast.rhs.visitExpression(this, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitReadPropExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitReadKeyExpr = function (ast, context) {
            ast.receiver.visitExpression(this, context);
            ast.index.visitExpression(this, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitLiteralArrayExpr = function (ast, context) {
            this.visitAllExpressions(ast.entries, context);
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitLiteralMapExpr = function (ast, context) {
            var _this = this;
            ast.entries.forEach(function (entry) { return entry[1].visitExpression(_this, context); });
            return ast;
        };
        RecursiveExpressionVisitor.prototype.visitAllExpressions = function (exprs, context) {
            var _this = this;
            exprs.forEach(function (expr) { return expr.visitExpression(_this, context); });
        };
        RecursiveExpressionVisitor.prototype.visitDeclareVarStmt = function (stmt, context) {
            stmt.value.visitExpression(this, context);
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitDeclareFunctionStmt = function (stmt, context) {
            // Don't descend into nested functions
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitExpressionStmt = function (stmt, context) {
            stmt.expr.visitExpression(this, context);
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitReturnStmt = function (stmt, context) {
            stmt.value.visitExpression(this, context);
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitDeclareClassStmt = function (stmt, context) {
            // Don't descend into nested functions
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitIfStmt = function (stmt, context) {
            stmt.condition.visitExpression(this, context);
            this.visitAllStatements(stmt.trueCase, context);
            this.visitAllStatements(stmt.falseCase, context);
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitTryCatchStmt = function (stmt, context) {
            this.visitAllStatements(stmt.bodyStmts, context);
            this.visitAllStatements(stmt.catchStmts, context);
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitThrowStmt = function (stmt, context) {
            stmt.error.visitExpression(this, context);
            return stmt;
        };
        RecursiveExpressionVisitor.prototype.visitCommentStmt = function (stmt, context) { return stmt; };
        RecursiveExpressionVisitor.prototype.visitAllStatements = function (stmts, context) {
            var _this = this;
            stmts.forEach(function (stmt) { return stmt.visitStatement(_this, context); });
        };
        return RecursiveExpressionVisitor;
    }());
    function replaceVarInExpression(varName, newValue, expression) {
        var transformer = new _ReplaceVariableTransformer(varName, newValue);
        return expression.visitExpression(transformer, null);
    }
    var _ReplaceVariableTransformer = (function (_super) {
        __extends(_ReplaceVariableTransformer, _super);
        function _ReplaceVariableTransformer(_varName, _newValue) {
            _super.call(this);
            this._varName = _varName;
            this._newValue = _newValue;
        }
        _ReplaceVariableTransformer.prototype.visitReadVarExpr = function (ast, context) {
            return ast.name == this._varName ? this._newValue : ast;
        };
        return _ReplaceVariableTransformer;
    }(ExpressionTransformer));
    function findReadVarNames(stmts) {
        var finder = new _VariableFinder();
        finder.visitAllStatements(stmts, null);
        return finder.varNames;
    }
    var _VariableFinder = (function (_super) {
        __extends(_VariableFinder, _super);
        function _VariableFinder() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.apply(this, args);
            this.varNames = new Set();
        }
        _VariableFinder.prototype.visitReadVarExpr = function (ast, context) {
            this.varNames.add(ast.name);
            return null;
        };
        return _VariableFinder;
    }(RecursiveExpressionVisitor));
    function variable(name, type) {
        if (type === void 0) { type = null; }
        return new ReadVarExpr(name, type);
    }
    function importExpr(id, typeParams) {
        if (typeParams === void 0) { typeParams = null; }
        return new ExternalExpr(id, null, typeParams);
    }
    function importType(id, typeParams, typeModifiers) {
        if (typeParams === void 0) { typeParams = null; }
        if (typeModifiers === void 0) { typeModifiers = null; }
        return isPresent(id) ? new ExternalType(id, typeParams, typeModifiers) : null;
    }
    function literal(value, type) {
        if (type === void 0) { type = null; }
        return new LiteralExpr(value, type);
    }
    function literalArr(values, type) {
        if (type === void 0) { type = null; }
        return new LiteralArrayExpr(values, type);
    }
    function literalMap(values, type) {
        if (type === void 0) { type = null; }
        return new LiteralMapExpr(values, type);
    }
    function not(expr) {
        return new NotExpr(expr);
    }
    function fn(params, body, type) {
        if (type === void 0) { type = null; }
        return new FunctionExpr(params, body, type);
    }
    var _COMPONENT_FACTORY_IDENTIFIER = new CompileIdentifierMetadata({
        name: 'ComponentFactory',
        runtime: _angular_core.ComponentFactory,
        moduleUrl: assetUrl('core', 'linker/component_factory')
    });
    var SourceModule = (function () {
        function SourceModule(moduleUrl, source) {
            this.moduleUrl = moduleUrl;
            this.source = source;
        }
        return SourceModule;
    }());
    var StyleSheetSourceWithImports = (function () {
        function StyleSheetSourceWithImports(source, importedUrls) {
            this.source = source;
            this.importedUrls = importedUrls;
        }
        return StyleSheetSourceWithImports;
    }());
    var NormalizedComponentWithViewDirectives = (function () {
        function NormalizedComponentWithViewDirectives(component, directives, pipes) {
            this.component = component;
            this.directives = directives;
            this.pipes = pipes;
        }
        return NormalizedComponentWithViewDirectives;
    }());
    var OfflineCompiler = (function () {
        function OfflineCompiler(_directiveNormalizer, _templateParser, _styleCompiler, _viewCompiler, _outputEmitter, _xhr) {
            this._directiveNormalizer = _directiveNormalizer;
            this._templateParser = _templateParser;
            this._styleCompiler = _styleCompiler;
            this._viewCompiler = _viewCompiler;
            this._outputEmitter = _outputEmitter;
            this._xhr = _xhr;
        }
        OfflineCompiler.prototype.normalizeDirectiveMetadata = function (directive) {
            return this._directiveNormalizer.normalizeDirective(directive);
        };
        OfflineCompiler.prototype.compileTemplates = function (components) {
            var _this = this;
            if (components.length === 0) {
                throw new BaseException$1('No components given');
            }
            var statements = [];
            var exportedVars = [];
            var moduleUrl = _templateModuleUrl(components[0].component);
            components.forEach(function (componentWithDirs) {
                var compMeta = componentWithDirs.component;
                _assertComponent(compMeta);
                var compViewFactoryVar = _this._compileComponent(compMeta, componentWithDirs.directives, componentWithDirs.pipes, statements);
                exportedVars.push(compViewFactoryVar);
                var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
                var hostViewFactoryVar = _this._compileComponent(hostMeta, [compMeta], [], statements);
                var compFactoryVar = compMeta.type.name + "NgFactory";
                statements.push(variable(compFactoryVar)
                    .set(importExpr(_COMPONENT_FACTORY_IDENTIFIER, [importType(compMeta.type)])
                        .instantiate([
                            literal(compMeta.selector),
                            variable(hostViewFactoryVar),
                            importExpr(compMeta.type)
                        ], importType(_COMPONENT_FACTORY_IDENTIFIER, [importType(compMeta.type)], [TypeModifier.Const])))
                    .toDeclStmt(null, [StmtModifier.Final]));
                exportedVars.push(compFactoryVar);
            });
            return this._codegenSourceModule(moduleUrl, statements, exportedVars);
        };
        OfflineCompiler.prototype.loadAndCompileStylesheet = function (stylesheetUrl, shim, suffix) {
            var _this = this;
            return this._xhr.get(stylesheetUrl)
                .then(function (cssText) {
                    var compileResult = _this._styleCompiler.compileStylesheet(stylesheetUrl, cssText, shim);
                    var importedUrls = [];
                    compileResult.dependencies.forEach(function (dep) {
                        importedUrls.push(dep.moduleUrl);
                        dep.valuePlaceholder.moduleUrl = _stylesModuleUrl(dep.moduleUrl, dep.isShimmed, suffix);
                    });
                    return new StyleSheetSourceWithImports(_this._codgenStyles(stylesheetUrl, shim, suffix, compileResult), importedUrls);
                });
        };
        OfflineCompiler.prototype._compileComponent = function (compMeta, directives, pipes, targetStatements) {
            var styleResult = this._styleCompiler.compileComponent(compMeta);
            var parsedTemplate = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, compMeta.type.name);
            var viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, variable(styleResult.stylesVar), pipes);
            ListWrapper.addAll(targetStatements, _resolveStyleStatements(compMeta.type.moduleUrl, styleResult));
            ListWrapper.addAll(targetStatements, _resolveViewStatements(viewResult));
            return viewResult.viewFactoryVar;
        };
        OfflineCompiler.prototype._codgenStyles = function (inputUrl, shim, suffix, stylesCompileResult) {
            return this._codegenSourceModule(_stylesModuleUrl(inputUrl, shim, suffix), stylesCompileResult.statements, [stylesCompileResult.stylesVar]);
        };
        OfflineCompiler.prototype._codegenSourceModule = function (moduleUrl, statements, exportedVars) {
            return new SourceModule(moduleUrl, this._outputEmitter.emitStatements(moduleUrl, statements, exportedVars));
        };
        return OfflineCompiler;
    }());
    function _resolveViewStatements(compileResult) {
        compileResult.dependencies.forEach(function (dep) { dep.factoryPlaceholder.moduleUrl = _templateModuleUrl(dep.comp); });
        return compileResult.statements;
    }
    function _resolveStyleStatements(containingModuleUrl, compileResult) {
        var containingSuffix = _splitSuffix(containingModuleUrl)[1];
        compileResult.dependencies.forEach(function (dep) {
            dep.valuePlaceholder.moduleUrl =
                _stylesModuleUrl(dep.moduleUrl, dep.isShimmed, containingSuffix);
        });
        return compileResult.statements;
    }
    function _templateModuleUrl(comp) {
        var urlWithSuffix = _splitSuffix(comp.type.moduleUrl);
        return urlWithSuffix[0] + ".ngfactory" + urlWithSuffix[1];
    }
    function _stylesModuleUrl(stylesheetUrl, shim, suffix) {
        return shim ? stylesheetUrl + ".shim" + suffix : "" + stylesheetUrl + suffix;
    }
    function _assertComponent(meta) {
        if (!meta.isComponent) {
            throw new BaseException$1("Could not compile '" + meta.type.name + "' because it is not a component.");
        }
    }
    function _splitSuffix(path) {
        var lastDot = path.lastIndexOf('.');
        if (lastDot !== -1) {
            return [path.substring(0, lastDot), path.substring(lastDot)];
        }
        else {
            return [path, ''];
        }
    }
    var PromiseCompleter = (function () {
        function PromiseCompleter() {
            var _this = this;
            this.promise = new Promise(function (res, rej) {
                _this.resolve = res;
                _this.reject = rej;
            });
        }
        return PromiseCompleter;
    }());
    var PromiseWrapper = (function () {
        function PromiseWrapper() {
        }
        PromiseWrapper.resolve = function (obj) { return Promise.resolve(obj); };
        PromiseWrapper.reject = function (obj, _) { return Promise.reject(obj); };
        // Note: We can't rename this method into `catch`, as this is not a valid
        // method name in Dart.
        PromiseWrapper.catchError = function (promise, onError) {
            return promise.catch(onError);
        };
        PromiseWrapper.all = function (promises) {
            if (promises.length == 0)
                return Promise.resolve([]);
            return Promise.all(promises);
        };
        PromiseWrapper.then = function (promise, success, rejection) {
            return promise.then(success, rejection);
        };
        PromiseWrapper.wrap = function (computation) {
            return new Promise(function (res, rej) {
                try {
                    res(computation());
                }
                catch (e) {
                    rej(e);
                }
            });
        };
        PromiseWrapper.scheduleMicrotask = function (computation) {
            PromiseWrapper.then(PromiseWrapper.resolve(null), computation, function (_) { });
        };
        PromiseWrapper.isPromise = function (obj) { return obj instanceof Promise; };
        PromiseWrapper.completer = function () { return new PromiseCompleter(); };
        return PromiseWrapper;
    }());
    var ObservableWrapper = (function () {
        function ObservableWrapper() {
        }
        // TODO(vsavkin): when we use rxnext, try inferring the generic type from the first arg
        ObservableWrapper.subscribe = function (emitter, onNext, onError, onComplete) {
            if (onComplete === void 0) { onComplete = function () { }; }
            onError = (typeof onError === "function") && onError || noop;
            onComplete = (typeof onComplete === "function") && onComplete || noop;
            return emitter.subscribe({ next: onNext, error: onError, complete: onComplete });
        };
        ObservableWrapper.isObservable = function (obs) { return !!obs.subscribe; };
        /**
         * Returns whether `obs` has any subscribers listening to events.
         */
        ObservableWrapper.hasSubscribers = function (obs) { return obs.observers.length > 0; };
        ObservableWrapper.dispose = function (subscription) { subscription.unsubscribe(); };
        /**
         * @deprecated - use callEmit() instead
         */
        ObservableWrapper.callNext = function (emitter, value) { emitter.next(value); };
        ObservableWrapper.callEmit = function (emitter, value) { emitter.emit(value); };
        ObservableWrapper.callError = function (emitter, error) { emitter.error(error); };
        ObservableWrapper.callComplete = function (emitter) { emitter.complete(); };
        ObservableWrapper.fromPromise = function (promise) {
            return rxjs_observable_PromiseObservable.PromiseObservable.create(promise);
        };
        ObservableWrapper.toPromise = function (obj) { return rxjs_operator_toPromise.toPromise.call(obj); };
        return ObservableWrapper;
    }());
    /**
     * This file is a port of shadowCSS from webcomponents.js to TypeScript.
     *
     * Please make sure to keep to edits in sync with the source file.
     *
     * Source:
     * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
     *
     * The original file level comment is reproduced below
     */
    /*
     This is a limited shim for ShadowDOM css styling.
     https://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/shadow/index.html#styles

     The intention here is to support only the styling features which can be
     relatively simply implemented. The goal is to allow users to avoid the
     most obvious pitfalls and do so without compromising performance significantly.
     For ShadowDOM styling that's not covered here, a set of best practices
     can be provided that should allow users to accomplish more complex styling.

     The following is a list of specific ShadowDOM styling features and a brief
     discussion of the approach used to shim.

     Shimmed features:

     * :host, :host-context: ShadowDOM allows styling of the shadowRoot's host
     element using the :host rule. To shim this feature, the :host styles are
     reformatted and prefixed with a given scope name and promoted to a
     document level stylesheet.
     For example, given a scope name of .foo, a rule like this:

     :host {
     background: red;
     }
     }

     becomes:

     .foo {
     background: red;
     }

     * encapsultion: Styles defined within ShadowDOM, apply only to
     dom inside the ShadowDOM. Polymer uses one of two techniques to implement
     this feature.

     By default, rules are prefixed with the host element tag name
     as a descendant selector. This ensures styling does not leak out of the 'top'
     of the element's ShadowDOM. For example,

     div {
     font-weight: bold;
     }

     becomes:

     x-foo div {
     font-weight: bold;
     }

     becomes:


     Alternatively, if WebComponents.ShadowCSS.strictStyling is set to true then
     selectors are scoped by adding an attribute selector suffix to each
     simple selector that contains the host element tag name. Each element
     in the element's ShadowDOM template is also given the scope attribute.
     Thus, these rules match only elements that have the scope attribute.
     For example, given a scope name of x-foo, a rule like this:

     div {
     font-weight: bold;
     }

     becomes:

     div[x-foo] {
     font-weight: bold;
     }

     Note that elements that are dynamically added to a scope must have the scope
     selector added to them manually.

     * upper/lower bound encapsulation: Styles which are defined outside a
     shadowRoot should not cross the ShadowDOM boundary and should not apply
     inside a shadowRoot.

     This styling behavior is not emulated. Some possible ways to do this that
     were rejected due to complexity and/or performance concerns include: (1) reset
     every possible property for every possible selector for a given scope name;
     (2) re-implement css in javascript.

     As an alternative, users should make sure to use selectors
     specific to the scope in which they are working.

     * ::distributed: This behavior is not emulated. It's often not necessary
     to style the contents of a specific insertion point and instead, descendants
     of the host element can be styled selectively. Users can also create an
     extra node around an insertion point and style that node's contents
     via descendent selectors. For example, with a shadowRoot like this:

     <style>
     ::content(div) {
     background: red;
     }
     </style>
     <content></content>

     could become:

     <style>
     / *@polyfill .content-container div * /
     ::content(div) {
     background: red;
     }
     </style>
     <div class="content-container">
     <content></content>
     </div>

     Note the use of @polyfill in the comment above a ShadowDOM specific style
     declaration. This is a directive to the styling shim to use the selector
     in comments in lieu of the next selector when running under polyfill.
     */
    var ShadowCss = (function () {
        function ShadowCss() {
            this.strictStyling = true;
        }
        /*
         * Shim some cssText with the given selector. Returns cssText that can
         * be included in the document via WebComponents.ShadowCSS.addCssToDocument(css).
         *
         * When strictStyling is true:
         * - selector is the attribute added to all elements inside the host,
         * - hostSelector is the attribute added to the host itself.
         */
        ShadowCss.prototype.shimCssText = function (cssText, selector, hostSelector) {
            if (hostSelector === void 0) { hostSelector = ''; }
            cssText = stripComments(cssText);
            cssText = this._insertDirectives(cssText);
            return this._scopeCssText(cssText, selector, hostSelector);
        };
        ShadowCss.prototype._insertDirectives = function (cssText) {
            cssText = this._insertPolyfillDirectivesInCssText(cssText);
            return this._insertPolyfillRulesInCssText(cssText);
        };
        /*
         * Process styles to convert native ShadowDOM rules that will trip
         * up the css parser; we rely on decorating the stylesheet with inert rules.
         *
         * For example, we convert this rule:
         *
         * polyfill-next-selector { content: ':host menu-item'; }
         * ::content menu-item {
         *
         * to this:
         *
         * scopeName menu-item {
         *
         **/
        ShadowCss.prototype._insertPolyfillDirectivesInCssText = function (cssText) {
            // Difference with webcomponents.js: does not handle comments
            return StringWrapper.replaceAllMapped(cssText, _cssContentNextSelectorRe, function (m) { return m[1] + '{'; });
        };
        /*
         * Process styles to add rules which will only apply under the polyfill
         *
         * For example, we convert this rule:
         *
         * polyfill-rule {
         *   content: ':host menu-item';
         * ...
         * }
         *
         * to this:
         *
         * scopeName menu-item {...}
         *
         **/
        ShadowCss.prototype._insertPolyfillRulesInCssText = function (cssText) {
            // Difference with webcomponents.js: does not handle comments
            return StringWrapper.replaceAllMapped(cssText, _cssContentRuleRe, function (m) {
                var rule = m[0];
                rule = StringWrapper.replace(rule, m[1], '');
                rule = StringWrapper.replace(rule, m[2], '');
                return m[3] + rule;
            });
        };
        /* Ensure styles are scoped. Pseudo-scoping takes a rule like:
         *
         *  .foo {... }
         *
         *  and converts this to
         *
         *  scopeName .foo { ... }
         */
        ShadowCss.prototype._scopeCssText = function (cssText, scopeSelector, hostSelector) {
            var unscoped = this._extractUnscopedRulesFromCssText(cssText);
            cssText = this._insertPolyfillHostInCssText(cssText);
            cssText = this._convertColonHost(cssText);
            cssText = this._convertColonHostContext(cssText);
            cssText = this._convertShadowDOMSelectors(cssText);
            if (isPresent(scopeSelector)) {
                cssText = this._scopeSelectors(cssText, scopeSelector, hostSelector);
            }
            cssText = cssText + '\n' + unscoped;
            return cssText.trim();
        };
        /*
         * Process styles to add rules which will only apply under the polyfill
         * and do not process via CSSOM. (CSSOM is destructive to rules on rare
         * occasions, e.g. -webkit-calc on Safari.)
         * For example, we convert this rule:
         *
         * @polyfill-unscoped-rule {
         *   content: 'menu-item';
         * ... }
         *
         * to this:
         *
         * menu-item {...}
         *
         **/
        ShadowCss.prototype._extractUnscopedRulesFromCssText = function (cssText) {
            // Difference with webcomponents.js: does not handle comments
            var r = '', m;
            var matcher = RegExpWrapper.matcher(_cssContentUnscopedRuleRe, cssText);
            while (isPresent(m = RegExpMatcherWrapper.next(matcher))) {
                var rule = m[0];
                rule = StringWrapper.replace(rule, m[2], '');
                rule = StringWrapper.replace(rule, m[1], m[3]);
                r += rule + '\n\n';
            }
            return r;
        };
        /*
         * convert a rule like :host(.foo) > .bar { }
         *
         * to
         *
         * scopeName.foo > .bar
         */
        ShadowCss.prototype._convertColonHost = function (cssText) {
            return this._convertColonRule(cssText, _cssColonHostRe, this._colonHostPartReplacer);
        };
        /*
         * convert a rule like :host-context(.foo) > .bar { }
         *
         * to
         *
         * scopeName.foo > .bar, .foo scopeName > .bar { }
         *
         * and
         *
         * :host-context(.foo:host) .bar { ... }
         *
         * to
         *
         * scopeName.foo .bar { ... }
         */
        ShadowCss.prototype._convertColonHostContext = function (cssText) {
            return this._convertColonRule(cssText, _cssColonHostContextRe, this._colonHostContextPartReplacer);
        };
        ShadowCss.prototype._convertColonRule = function (cssText, regExp, partReplacer) {
            // p1 = :host, p2 = contents of (), p3 rest of rule
            return StringWrapper.replaceAllMapped(cssText, regExp, function (m) {
                if (isPresent(m[2])) {
                    var parts = m[2].split(','), r = [];
                    for (var i = 0; i < parts.length; i++) {
                        var p = parts[i];
                        if (isBlank(p))
                            break;
                        p = p.trim();
                        r.push(partReplacer(_polyfillHostNoCombinator, p, m[3]));
                    }
                    return r.join(',');
                }
                else {
                    return _polyfillHostNoCombinator + m[3];
                }
            });
        };
        ShadowCss.prototype._colonHostContextPartReplacer = function (host, part, suffix) {
            if (StringWrapper.contains(part, _polyfillHost)) {
                return this._colonHostPartReplacer(host, part, suffix);
            }
            else {
                return host + part + suffix + ', ' + part + ' ' + host + suffix;
            }
        };
        ShadowCss.prototype._colonHostPartReplacer = function (host, part, suffix) {
            return host + StringWrapper.replace(part, _polyfillHost, '') + suffix;
        };
        /*
         * Convert combinators like ::shadow and pseudo-elements like ::content
         * by replacing with space.
         */
        ShadowCss.prototype._convertShadowDOMSelectors = function (cssText) {
            for (var i = 0; i < _shadowDOMSelectorsRe.length; i++) {
                cssText = StringWrapper.replaceAll(cssText, _shadowDOMSelectorsRe[i], ' ');
            }
            return cssText;
        };
        // change a selector like 'div' to 'name div'
        ShadowCss.prototype._scopeSelectors = function (cssText, scopeSelector, hostSelector) {
            var _this = this;
            return processRules(cssText, function (rule) {
                var selector = rule.selector;
                var content = rule.content;
                if (rule.selector[0] != '@' || rule.selector.startsWith('@page')) {
                    selector =
                        _this._scopeSelector(rule.selector, scopeSelector, hostSelector, _this.strictStyling);
                }
                else if (rule.selector.startsWith('@media')) {
                    content = _this._scopeSelectors(rule.content, scopeSelector, hostSelector);
                }
                return new CssRule(selector, content);
            });
        };
        ShadowCss.prototype._scopeSelector = function (selector, scopeSelector, hostSelector, strict) {
            var r = [], parts = selector.split(',');
            for (var i = 0; i < parts.length; i++) {
                var p = parts[i].trim();
                var deepParts = StringWrapper.split(p, _shadowDeepSelectors);
                var shallowPart = deepParts[0];
                if (this._selectorNeedsScoping(shallowPart, scopeSelector)) {
                    deepParts[0] = strict && !StringWrapper.contains(shallowPart, _polyfillHostNoCombinator) ?
                        this._applyStrictSelectorScope(shallowPart, scopeSelector) :
                        this._applySelectorScope(shallowPart, scopeSelector, hostSelector);
                }
                // replace /deep/ with a space for child selectors
                r.push(deepParts.join(' '));
            }
            return r.join(', ');
        };
        ShadowCss.prototype._selectorNeedsScoping = function (selector, scopeSelector) {
            var re = this._makeScopeMatcher(scopeSelector);
            return !isPresent(RegExpWrapper.firstMatch(re, selector));
        };
        ShadowCss.prototype._makeScopeMatcher = function (scopeSelector) {
            var lre = /\[/g;
            var rre = /\]/g;
            scopeSelector = StringWrapper.replaceAll(scopeSelector, lre, '\\[');
            scopeSelector = StringWrapper.replaceAll(scopeSelector, rre, '\\]');
            return RegExpWrapper.create('^(' + scopeSelector + ')' + _selectorReSuffix, 'm');
        };
        ShadowCss.prototype._applySelectorScope = function (selector, scopeSelector, hostSelector) {
            // Difference from webcomponentsjs: scopeSelector could not be an array
            return this._applySimpleSelectorScope(selector, scopeSelector, hostSelector);
        };
        // scope via name and [is=name]
        ShadowCss.prototype._applySimpleSelectorScope = function (selector, scopeSelector, hostSelector) {
            if (isPresent(RegExpWrapper.firstMatch(_polyfillHostRe, selector))) {
                var replaceBy = this.strictStyling ? "[" + hostSelector + "]" : scopeSelector;
                selector = StringWrapper.replace(selector, _polyfillHostNoCombinator, replaceBy);
                return StringWrapper.replaceAll(selector, _polyfillHostRe, replaceBy + ' ');
            }
            else {
                return scopeSelector + ' ' + selector;
            }
        };
        // return a selector with [name] suffix on each simple selector
        // e.g. .foo.bar > .zot becomes .foo[name].bar[name] > .zot[name]  /** @internal */
        ShadowCss.prototype._applyStrictSelectorScope = function (selector, scopeSelector) {
            var isRe = /\[is=([^\]]*)\]/g;
            scopeSelector = StringWrapper.replaceAllMapped(scopeSelector, isRe, function (m) { return m[1]; });
            var splits = [' ', '>', '+', '~'], scoped = selector, attrName = '[' + scopeSelector + ']';
            for (var i = 0; i < splits.length; i++) {
                var sep = splits[i];
                var parts = scoped.split(sep);
                scoped = parts.map(function (p) {
                    // remove :host since it should be unnecessary
                    var t = StringWrapper.replaceAll(p.trim(), _polyfillHostRe, '');
                    if (t.length > 0 && !ListWrapper.contains(splits, t) &&
                        !StringWrapper.contains(t, attrName)) {
                        var re = /([^:]*)(:*)(.*)/g;
                        var m = RegExpWrapper.firstMatch(re, t);
                        if (isPresent(m)) {
                            p = m[1] + attrName + m[2] + m[3];
                        }
                    }
                    return p;
                })
                    .join(sep);
            }
            return scoped;
        };
        ShadowCss.prototype._insertPolyfillHostInCssText = function (selector) {
            selector = StringWrapper.replaceAll(selector, _colonHostContextRe, _polyfillHostContext);
            selector = StringWrapper.replaceAll(selector, _colonHostRe, _polyfillHost);
            return selector;
        };
        return ShadowCss;
    }());
    var _cssContentNextSelectorRe = /polyfill-next-selector[^}]*content:[\s]*?['"](.*?)['"][;\s]*}([^{]*?){/gim;
    var _cssContentRuleRe = /(polyfill-rule)[^}]*(content:[\s]*['"](.*?)['"])[;\s]*[^}]*}/gim;
    var _cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content:[\s]*['"](.*?)['"])[;\s]*[^}]*}/gim;
    var _polyfillHost = '-shadowcsshost';
    // note: :host-context pre-processed to -shadowcsshostcontext.
    var _polyfillHostContext = '-shadowcsscontext';
    var _parenSuffix = ')(?:\\((' +
        '(?:\\([^)(]*\\)|[^)(]*)+?' +
        ')\\))?([^,{]*)';
    var _cssColonHostRe = RegExpWrapper.create('(' + _polyfillHost + _parenSuffix, 'im');
    var _cssColonHostContextRe = RegExpWrapper.create('(' + _polyfillHostContext + _parenSuffix, 'im');
    var _polyfillHostNoCombinator = _polyfillHost + '-no-combinator';
    var _shadowDOMSelectorsRe = [
        /::shadow/g,
        /::content/g,
        // Deprecated selectors
        // TODO(vicb): see https://github.com/angular/clang-format/issues/16
        // clang-format off
        /\/shadow-deep\//g,
        /\/shadow\//g,
    ];
    var _shadowDeepSelectors = /(?:>>>)|(?:\/deep\/)/g;
    var _selectorReSuffix = '([>\\s~+\[.,{:][\\s\\S]*)?$';
    var _polyfillHostRe = RegExpWrapper.create(_polyfillHost, 'im');
    var _colonHostRe = /:host/gim;
    var _colonHostContextRe = /:host-context/gim;
    var _commentRe = /\/\*[\s\S]*?\*\//g;
    function stripComments(input) {
        return StringWrapper.replaceAllMapped(input, _commentRe, function (_) { return ''; });
    }
    var _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g;
    var _curlyRe = /([{}])/g;
    var OPEN_CURLY = '{';
    var CLOSE_CURLY = '}';
    var BLOCK_PLACEHOLDER = '%BLOCK%';
    var CssRule = (function () {
        function CssRule(selector, content) {
            this.selector = selector;
            this.content = content;
        }
        return CssRule;
    }());
    function processRules(input, ruleCallback) {
        var inputWithEscapedBlocks = escapeBlocks(input);
        var nextBlockIndex = 0;
        return StringWrapper.replaceAllMapped(inputWithEscapedBlocks.escapedString, _ruleRe, function (m) {
            var selector = m[2];
            var content = '';
            var suffix = m[4];
            var contentPrefix = '';
            if (isPresent(m[4]) && m[4].startsWith('{' + BLOCK_PLACEHOLDER)) {
                content = inputWithEscapedBlocks.blocks[nextBlockIndex++];
                suffix = m[4].substring(BLOCK_PLACEHOLDER.length + 1);
                contentPrefix = '{';
            }
            var rule = ruleCallback(new CssRule(selector, content));
            return "" + m[1] + rule.selector + m[3] + contentPrefix + rule.content + suffix;
        });
    }
    var StringWithEscapedBlocks = (function () {
        function StringWithEscapedBlocks(escapedString, blocks) {
            this.escapedString = escapedString;
            this.blocks = blocks;
        }
        return StringWithEscapedBlocks;
    }());
    function escapeBlocks(input) {
        var inputParts = StringWrapper.split(input, _curlyRe);
        var resultParts = [];
        var escapedBlocks = [];
        var bracketCount = 0;
        var currentBlockParts = [];
        for (var partIndex = 0; partIndex < inputParts.length; partIndex++) {
            var part = inputParts[partIndex];
            if (part == CLOSE_CURLY) {
                bracketCount--;
            }
            if (bracketCount > 0) {
                currentBlockParts.push(part);
            }
            else {
                if (currentBlockParts.length > 0) {
                    escapedBlocks.push(currentBlockParts.join(''));
                    resultParts.push(BLOCK_PLACEHOLDER);
                    currentBlockParts = [];
                }
                resultParts.push(part);
            }
            if (part == OPEN_CURLY) {
                bracketCount++;
            }
        }
        if (currentBlockParts.length > 0) {
            escapedBlocks.push(currentBlockParts.join(''));
            resultParts.push(BLOCK_PLACEHOLDER);
        }
        return new StringWithEscapedBlocks(resultParts.join(''), escapedBlocks);
    }
    var COMPONENT_VARIABLE = '%COMP%';
    var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
    var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
    var StylesCompileDependency = (function () {
        function StylesCompileDependency(moduleUrl, isShimmed, valuePlaceholder) {
            this.moduleUrl = moduleUrl;
            this.isShimmed = isShimmed;
            this.valuePlaceholder = valuePlaceholder;
        }
        return StylesCompileDependency;
    }());
    var StylesCompileResult = (function () {
        function StylesCompileResult(statements, stylesVar, dependencies) {
            this.statements = statements;
            this.stylesVar = stylesVar;
            this.dependencies = dependencies;
        }
        return StylesCompileResult;
    }());
    var StyleCompiler = (function () {
        function StyleCompiler(_urlResolver) {
            this._urlResolver = _urlResolver;
            this._shadowCss = new ShadowCss();
        }
        StyleCompiler.prototype.compileComponent = function (comp) {
            var shim = comp.template.encapsulation === _angular_core.ViewEncapsulation.Emulated;
            return this._compileStyles(getStylesVarName(comp), comp.template.styles, comp.template.styleUrls, shim);
        };
        StyleCompiler.prototype.compileStylesheet = function (stylesheetUrl, cssText, isShimmed) {
            var styleWithImports = extractStyleUrls(this._urlResolver, stylesheetUrl, cssText);
            return this._compileStyles(getStylesVarName(null), [styleWithImports.style], styleWithImports.styleUrls, isShimmed);
        };
        StyleCompiler.prototype._compileStyles = function (stylesVar, plainStyles, absUrls, shim) {
            var _this = this;
            var styleExpressions = plainStyles.map(function (plainStyle) { return literal(_this._shimIfNeeded(plainStyle, shim)); });
            var dependencies = [];
            for (var i = 0; i < absUrls.length; i++) {
                var identifier = new CompileIdentifierMetadata({ name: getStylesVarName(null) });
                dependencies.push(new StylesCompileDependency(absUrls[i], shim, identifier));
                styleExpressions.push(new ExternalExpr(identifier));
            }
            // styles variable contains plain strings and arrays of other styles arrays (recursive),
            // so we set its type to dynamic.
            var stmt = variable(stylesVar)
                .set(literalArr(styleExpressions, new ArrayType(DYNAMIC_TYPE, [TypeModifier.Const])))
                .toDeclStmt(null, [StmtModifier.Final]);
            return new StylesCompileResult([stmt], stylesVar, dependencies);
        };
        StyleCompiler.prototype._shimIfNeeded = function (style, shim) {
            return shim ? this._shadowCss.shimCssText(style, CONTENT_ATTR, HOST_ATTR) : style;
        };
        return StyleCompiler;
    }());
    StyleCompiler.decorators = [
        { type: _angular_core.Injectable },
    ];
    StyleCompiler.ctorParameters = [
        { type: UrlResolver, },
    ];
    function getStylesVarName(component) {
        var result = "styles";
        if (isPresent(component)) {
            result += "_" + component.type.name;
        }
        return result;
    }
    function _enumExpression(classIdentifier, value) {
        if (isBlank(value))
            return NULL_EXPR;
        var name = resolveEnumToken(classIdentifier.runtime, value);
        return importExpr(new CompileIdentifierMetadata({
            name: classIdentifier.name + "." + name,
            moduleUrl: classIdentifier.moduleUrl,
            runtime: value
        }));
    }
    var ViewTypeEnum = (function () {
        function ViewTypeEnum() {
        }
        ViewTypeEnum.fromValue = function (value) {
            return _enumExpression(Identifiers.ViewType, value);
        };
        return ViewTypeEnum;
    }());
    ViewTypeEnum.HOST = ViewTypeEnum.fromValue(ViewType.HOST);
    ViewTypeEnum.COMPONENT = ViewTypeEnum.fromValue(ViewType.COMPONENT);
    ViewTypeEnum.EMBEDDED = ViewTypeEnum.fromValue(ViewType.EMBEDDED);
    var ViewEncapsulationEnum = (function () {
        function ViewEncapsulationEnum() {
        }
        ViewEncapsulationEnum.fromValue = function (value) {
            return _enumExpression(Identifiers.ViewEncapsulation, value);
        };
        return ViewEncapsulationEnum;
    }());
    ViewEncapsulationEnum.Emulated = ViewEncapsulationEnum.fromValue(_angular_core.ViewEncapsulation.Emulated);
    ViewEncapsulationEnum.Native = ViewEncapsulationEnum.fromValue(_angular_core.ViewEncapsulation.Native);
    ViewEncapsulationEnum.None = ViewEncapsulationEnum.fromValue(_angular_core.ViewEncapsulation.None);
    var ChangeDetectorStateEnum = (function () {
        function ChangeDetectorStateEnum() {
        }
        ChangeDetectorStateEnum.fromValue = function (value) {
            return _enumExpression(Identifiers.ChangeDetectorState, value);
        };
        return ChangeDetectorStateEnum;
    }());
    ChangeDetectorStateEnum.NeverChecked = ChangeDetectorStateEnum.fromValue(ChangeDetectorState.NeverChecked);
    ChangeDetectorStateEnum.CheckedBefore = ChangeDetectorStateEnum.fromValue(ChangeDetectorState.CheckedBefore);
    ChangeDetectorStateEnum.Errored = ChangeDetectorStateEnum.fromValue(ChangeDetectorState.Errored);
    var ChangeDetectionStrategyEnum = (function () {
        function ChangeDetectionStrategyEnum() {
        }
        ChangeDetectionStrategyEnum.fromValue = function (value) {
            return _enumExpression(Identifiers.ChangeDetectionStrategy, value);
        };
        return ChangeDetectionStrategyEnum;
    }());
    ChangeDetectionStrategyEnum.CheckOnce = ChangeDetectionStrategyEnum.fromValue(_angular_core.ChangeDetectionStrategy.CheckOnce);
    ChangeDetectionStrategyEnum.Checked = ChangeDetectionStrategyEnum.fromValue(_angular_core.ChangeDetectionStrategy.Checked);
    ChangeDetectionStrategyEnum.CheckAlways = ChangeDetectionStrategyEnum.fromValue(_angular_core.ChangeDetectionStrategy.CheckAlways);
    ChangeDetectionStrategyEnum.Detached = ChangeDetectionStrategyEnum.fromValue(_angular_core.ChangeDetectionStrategy.Detached);
    ChangeDetectionStrategyEnum.OnPush = ChangeDetectionStrategyEnum.fromValue(_angular_core.ChangeDetectionStrategy.OnPush);
    ChangeDetectionStrategyEnum.Default = ChangeDetectionStrategyEnum.fromValue(_angular_core.ChangeDetectionStrategy.Default);
    var ViewConstructorVars = (function () {
        function ViewConstructorVars() {
        }
        return ViewConstructorVars;
    }());
    ViewConstructorVars.viewUtils = variable('viewUtils');
    ViewConstructorVars.parentInjector = variable('parentInjector');
    ViewConstructorVars.declarationEl = variable('declarationEl');
    var ViewProperties = (function () {
        function ViewProperties() {
        }
        return ViewProperties;
    }());
    ViewProperties.renderer = THIS_EXPR.prop('renderer');
    ViewProperties.projectableNodes = THIS_EXPR.prop('projectableNodes');
    ViewProperties.viewUtils = THIS_EXPR.prop('viewUtils');
    var EventHandlerVars = (function () {
        function EventHandlerVars() {
        }
        return EventHandlerVars;
    }());
    EventHandlerVars.event = variable('$event');
    var InjectMethodVars = (function () {
        function InjectMethodVars() {
        }
        return InjectMethodVars;
    }());
    InjectMethodVars.token = variable('token');
    InjectMethodVars.requestNodeIndex = variable('requestNodeIndex');
    InjectMethodVars.notFoundResult = variable('notFoundResult');
    var DetectChangesVars = (function () {
        function DetectChangesVars() {
        }
        return DetectChangesVars;
    }());
    DetectChangesVars.throwOnChange = variable("throwOnChange");
    DetectChangesVars.changes = variable("changes");
    DetectChangesVars.changed = variable("changed");
    DetectChangesVars.valUnwrapper = variable("valUnwrapper");
    function getPropertyInView(property, callingView, definedView) {
        if (callingView === definedView) {
            return property;
        }
        else {
            var viewProp = THIS_EXPR;
            var currView = callingView;
            while (currView !== definedView && isPresent(currView.declarationElement.view)) {
                currView = currView.declarationElement.view;
                viewProp = viewProp.prop('parent');
            }
            if (currView !== definedView) {
                throw new BaseException$1("Internal error: Could not calculate a property in a parent view: " + property);
            }
            if (property instanceof ReadPropExpr) {
                var readPropExpr_1 = property;
                // Note: Don't cast for members of the AppView base class...
                if (definedView.fields.some(function (field) { return field.name == readPropExpr_1.name; }) ||
                    definedView.getters.some(function (field) { return field.name == readPropExpr_1.name; })) {
                    viewProp = viewProp.cast(definedView.classType);
                }
            }
            return replaceVarInExpression(THIS_EXPR.name, viewProp, property);
        }
    }
    function injectFromViewParentInjector(token, optional) {
        var args = [createDiTokenExpression(token)];
        if (optional) {
            args.push(NULL_EXPR);
        }
        return THIS_EXPR.prop('parentInjector').callMethod('get', args);
    }
    function getViewFactoryName(component, embeddedTemplateIndex) {
        return "viewFactory_" + component.type.name + embeddedTemplateIndex;
    }
    function createDiTokenExpression(token) {
        if (isPresent(token.value)) {
            return literal(token.value);
        }
        else if (token.identifierIsInstance) {
            return importExpr(token.identifier)
                .instantiate([], importType(token.identifier, [], [TypeModifier.Const]));
        }
        else {
            return importExpr(token.identifier);
        }
    }
    function createFlatArray(expressions) {
        var lastNonArrayExpressions = [];
        var result = literalArr([]);
        for (var i = 0; i < expressions.length; i++) {
            var expr = expressions[i];
            if (expr.type instanceof ArrayType) {
                if (lastNonArrayExpressions.length > 0) {
                    result =
                        result.callMethod(BuiltinMethod.ConcatArray, [literalArr(lastNonArrayExpressions)]);
                    lastNonArrayExpressions = [];
                }
                result = result.callMethod(BuiltinMethod.ConcatArray, [expr]);
            }
            else {
                lastNonArrayExpressions.push(expr);
            }
        }
        if (lastNonArrayExpressions.length > 0) {
            result =
                result.callMethod(BuiltinMethod.ConcatArray, [literalArr(lastNonArrayExpressions)]);
        }
        return result;
    }
    function createPureProxy(fn, argCount, pureProxyProp, view) {
        view.fields.push(new ClassField(pureProxyProp.name, null));
        var pureProxyId = argCount < Identifiers.pureProxies.length ? Identifiers.pureProxies[argCount] : null;
        if (isBlank(pureProxyId)) {
            throw new BaseException$1("Unsupported number of argument for pure functions: " + argCount);
        }
        view.createMethod.addStmt(THIS_EXPR.prop(pureProxyProp.name).set(importExpr(pureProxyId).callFn([fn])).toStmt());
    }
    var ViewQueryValues = (function () {
        function ViewQueryValues(view, values) {
            this.view = view;
            this.values = values;
        }
        return ViewQueryValues;
    }());
    var CompileQuery = (function () {
        function CompileQuery(meta, queryList, ownerDirectiveExpression, view) {
            this.meta = meta;
            this.queryList = queryList;
            this.ownerDirectiveExpression = ownerDirectiveExpression;
            this.view = view;
            this._values = new ViewQueryValues(view, []);
        }
        CompileQuery.prototype.addValue = function (value, view) {
            var currentView = view;
            var elPath = [];
            while (isPresent(currentView) && currentView !== this.view) {
                var parentEl = currentView.declarationElement;
                elPath.unshift(parentEl);
                currentView = parentEl.view;
            }
            var queryListForDirtyExpr = getPropertyInView(this.queryList, view, this.view);
            var viewValues = this._values;
            elPath.forEach(function (el) {
                var last = viewValues.values.length > 0 ? viewValues.values[viewValues.values.length - 1] : null;
                if (last instanceof ViewQueryValues && last.view === el.embeddedView) {
                    viewValues = last;
                }
                else {
                    var newViewValues = new ViewQueryValues(el.embeddedView, []);
                    viewValues.values.push(newViewValues);
                    viewValues = newViewValues;
                }
            });
            viewValues.values.push(value);
            if (elPath.length > 0) {
                view.dirtyParentQueriesMethod.addStmt(queryListForDirtyExpr.callMethod('setDirty', []).toStmt());
            }
        };
        CompileQuery.prototype.afterChildren = function (targetMethod) {
            var values = createQueryValues(this._values);
            var updateStmts = [this.queryList.callMethod('reset', [literalArr(values)]).toStmt()];
            if (isPresent(this.ownerDirectiveExpression)) {
                var valueExpr = this.meta.first ? this.queryList.prop('first') : this.queryList;
                updateStmts.push(this.ownerDirectiveExpression.prop(this.meta.propertyName).set(valueExpr).toStmt());
            }
            if (!this.meta.first) {
                updateStmts.push(this.queryList.callMethod('notifyOnChanges', []).toStmt());
            }
            targetMethod.addStmt(new IfStmt(this.queryList.prop('dirty'), updateStmts));
        };
        return CompileQuery;
    }());
    function createQueryValues(viewValues) {
        return ListWrapper.flatten(viewValues.values.map(function (entry) {
            if (entry instanceof ViewQueryValues) {
                return mapNestedViews(entry.view.declarationElement.appElement, entry.view, createQueryValues(entry));
            }
            else {
                return entry;
            }
        }));
    }
    function mapNestedViews(declarationAppElement, view, expressions) {
        var adjustedExpressions = expressions.map(function (expr) {
            return replaceVarInExpression(THIS_EXPR.name, variable('nestedView'), expr);
        });
        return declarationAppElement.callMethod('mapNestedViews', [
            variable(view.className),
            fn([new FnParam('nestedView', view.classType)], [new ReturnStatement(literalArr(adjustedExpressions))])
        ]);
    }
    function createQueryList(query, directiveInstance, propertyName, compileView) {
        compileView.fields.push(new ClassField(propertyName, importType(Identifiers.QueryList)));
        var expr = THIS_EXPR.prop(propertyName);
        compileView.createMethod.addStmt(THIS_EXPR.prop(propertyName)
            .set(importExpr(Identifiers.QueryList).instantiate([]))
            .toStmt());
        return expr;
    }
    function addQueryToTokenMap(map, query) {
        query.meta.selectors.forEach(function (selector) {
            var entry = map.get(selector);
            if (isBlank(entry)) {
                entry = [];
                map.add(selector, entry);
            }
            entry.push(query);
        });
    }
    var _DebugState = (function () {
        function _DebugState(nodeIndex, sourceAst) {
            this.nodeIndex = nodeIndex;
            this.sourceAst = sourceAst;
        }
        return _DebugState;
    }());
    var NULL_DEBUG_STATE = new _DebugState(null, null);
    var CompileMethod = (function () {
        function CompileMethod(_view) {
            this._view = _view;
            this._newState = NULL_DEBUG_STATE;
            this._currState = NULL_DEBUG_STATE;
            this._bodyStatements = [];
            this._debugEnabled = this._view.genConfig.genDebugInfo;
        }
        CompileMethod.prototype._updateDebugContextIfNeeded = function () {
            if (this._newState.nodeIndex !== this._currState.nodeIndex ||
                this._newState.sourceAst !== this._currState.sourceAst) {
                var expr = this._updateDebugContext(this._newState);
                if (isPresent(expr)) {
                    this._bodyStatements.push(expr.toStmt());
                }
            }
        };
        CompileMethod.prototype._updateDebugContext = function (newState) {
            this._currState = this._newState = newState;
            if (this._debugEnabled) {
                var sourceLocation = isPresent(newState.sourceAst) ? newState.sourceAst.sourceSpan.start : null;
                return THIS_EXPR.callMethod('debug', [
                    literal(newState.nodeIndex),
                    isPresent(sourceLocation) ? literal(sourceLocation.line) : NULL_EXPR,
                    isPresent(sourceLocation) ? literal(sourceLocation.col) : NULL_EXPR
                ]);
            }
            else {
                return null;
            }
        };
        CompileMethod.prototype.resetDebugInfoExpr = function (nodeIndex, templateAst) {
            var res = this._updateDebugContext(new _DebugState(nodeIndex, templateAst));
            return isPresent(res) ? res : NULL_EXPR;
        };
        CompileMethod.prototype.resetDebugInfo = function (nodeIndex, templateAst) {
            this._newState = new _DebugState(nodeIndex, templateAst);
        };
        CompileMethod.prototype.addStmt = function (stmt) {
            this._updateDebugContextIfNeeded();
            this._bodyStatements.push(stmt);
        };
        CompileMethod.prototype.addStmts = function (stmts) {
            this._updateDebugContextIfNeeded();
            ListWrapper.addAll(this._bodyStatements, stmts);
        };
        CompileMethod.prototype.finish = function () { return this._bodyStatements; };
        CompileMethod.prototype.isEmpty = function () { return this._bodyStatements.length === 0; };
        return CompileMethod;
    }());
    var CompileNode = (function () {
        function CompileNode(parent, view, nodeIndex, renderNode, sourceAst) {
            this.parent = parent;
            this.view = view;
            this.nodeIndex = nodeIndex;
            this.renderNode = renderNode;
            this.sourceAst = sourceAst;
        }
        CompileNode.prototype.isNull = function () { return isBlank(this.renderNode); };
        CompileNode.prototype.isRootElement = function () { return this.view != this.parent.view; };
        return CompileNode;
    }());
    var CompileElement = (function (_super) {
        __extends(CompileElement, _super);
        function CompileElement(parent, view, nodeIndex, renderNode, sourceAst, component, _directives, _resolvedProvidersArray, hasViewContainer, hasEmbeddedView, references) {
            var _this = this;
            _super.call(this, parent, view, nodeIndex, renderNode, sourceAst);
            this.component = component;
            this._directives = _directives;
            this._resolvedProvidersArray = _resolvedProvidersArray;
            this.hasViewContainer = hasViewContainer;
            this.hasEmbeddedView = hasEmbeddedView;
            this._compViewExpr = null;
            this._instances = new CompileTokenMap();
            this._queryCount = 0;
            this._queries = new CompileTokenMap();
            this._componentConstructorViewQueryLists = [];
            this.contentNodesByNgContentIndex = null;
            this.referenceTokens = {};
            references.forEach(function (ref) { return _this.referenceTokens[ref.name] = ref.value; });
            this.elementRef = importExpr(Identifiers.ElementRef).instantiate([this.renderNode]);
            this._instances.add(identifierToken(Identifiers.ElementRef), this.elementRef);
            this.injector = THIS_EXPR.callMethod('injector', [literal(this.nodeIndex)]);
            this._instances.add(identifierToken(Identifiers.Injector), this.injector);
            this._instances.add(identifierToken(Identifiers.Renderer), THIS_EXPR.prop('renderer'));
            if (this.hasViewContainer || this.hasEmbeddedView || isPresent(this.component)) {
                this._createAppElement();
            }
        }
        CompileElement.createNull = function () {
            return new CompileElement(null, null, null, null, null, null, [], [], false, false, []);
        };
        CompileElement.prototype._createAppElement = function () {
            var fieldName = "_appEl_" + this.nodeIndex;
            var parentNodeIndex = this.isRootElement() ? null : this.parent.nodeIndex;
            // private is fine here as no child view will reference an AppElement
            this.view.fields.push(new ClassField(fieldName, importType(Identifiers.AppElement), [StmtModifier.Private]));
            var statement = THIS_EXPR.prop(fieldName)
                .set(importExpr(Identifiers.AppElement)
                    .instantiate([
                        literal(this.nodeIndex),
                        literal(parentNodeIndex),
                        THIS_EXPR,
                        this.renderNode
                    ]))
                .toStmt();
            this.view.createMethod.addStmt(statement);
            this.appElement = THIS_EXPR.prop(fieldName);
            this._instances.add(identifierToken(Identifiers.AppElement), this.appElement);
        };
        CompileElement.prototype.setComponentView = function (compViewExpr) {
            this._compViewExpr = compViewExpr;
            this.contentNodesByNgContentIndex =
                ListWrapper.createFixedSize(this.component.template.ngContentSelectors.length);
            for (var i = 0; i < this.contentNodesByNgContentIndex.length; i++) {
                this.contentNodesByNgContentIndex[i] = [];
            }
        };
        CompileElement.prototype.setEmbeddedView = function (embeddedView) {
            this.embeddedView = embeddedView;
            if (isPresent(embeddedView)) {
                var createTemplateRefExpr = importExpr(Identifiers.TemplateRef_)
                    .instantiate([this.appElement, this.embeddedView.viewFactory]);
                var provider = new CompileProviderMetadata({ token: identifierToken(Identifiers.TemplateRef), useValue: createTemplateRefExpr });
                // Add TemplateRef as first provider as it does not have deps on other providers
                this._resolvedProvidersArray.unshift(new ProviderAst(provider.token, false, true, [provider], exports.ProviderAstType.Builtin, this.sourceAst.sourceSpan));
            }
        };
        CompileElement.prototype.beforeChildren = function () {
            var _this = this;
            if (this.hasViewContainer) {
                this._instances.add(identifierToken(Identifiers.ViewContainerRef), this.appElement.prop('vcRef'));
            }
            this._resolvedProviders = new CompileTokenMap();
            this._resolvedProvidersArray.forEach(function (provider) { return _this._resolvedProviders.add(provider.token, provider); });
            // create all the provider instances, some in the view constructor,
            // some as getters. We rely on the fact that they are already sorted topologically.
            this._resolvedProviders.values().forEach(function (resolvedProvider) {
                var providerValueExpressions = resolvedProvider.providers.map(function (provider) {
                    if (isPresent(provider.useExisting)) {
                        return _this._getDependency(resolvedProvider.providerType, new CompileDiDependencyMetadata({ token: provider.useExisting }));
                    }
                    else if (isPresent(provider.useFactory)) {
                        var deps = isPresent(provider.deps) ? provider.deps : provider.useFactory.diDeps;
                        var depsExpr = deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep); });
                        return importExpr(provider.useFactory).callFn(depsExpr);
                    }
                    else if (isPresent(provider.useClass)) {
                        var deps = isPresent(provider.deps) ? provider.deps : provider.useClass.diDeps;
                        var depsExpr = deps.map(function (dep) { return _this._getDependency(resolvedProvider.providerType, dep); });
                        return importExpr(provider.useClass)
                            .instantiate(depsExpr, importType(provider.useClass));
                    }
                    else {
                        return _convertValueToOutputAst(provider.useValue);
                    }
                });
                var propName = "_" + resolvedProvider.token.name + "_" + _this.nodeIndex + "_" + _this._instances.size;
                var instance = createProviderProperty(propName, resolvedProvider, providerValueExpressions, resolvedProvider.multiProvider, resolvedProvider.eager, _this);
                _this._instances.add(resolvedProvider.token, instance);
            });
            this.directiveInstances =
                this._directives.map(function (directive) { return _this._instances.get(identifierToken(directive.type)); });
            for (var i = 0; i < this.directiveInstances.length; i++) {
                var directiveInstance = this.directiveInstances[i];
                var directive = this._directives[i];
                directive.queries.forEach(function (queryMeta) { _this._addQuery(queryMeta, directiveInstance); });
            }
            var queriesWithReads = [];
            this._resolvedProviders.values().forEach(function (resolvedProvider) {
                var queriesForProvider = _this._getQueriesFor(resolvedProvider.token);
                ListWrapper.addAll(queriesWithReads, queriesForProvider.map(function (query) { return new _QueryWithRead(query, resolvedProvider.token); }));
            });
            StringMapWrapper.forEach(this.referenceTokens, function (_, varName) {
                var token = _this.referenceTokens[varName];
                var varValue;
                if (isPresent(token)) {
                    varValue = _this._instances.get(token);
                }
                else {
                    varValue = _this.renderNode;
                }
                _this.view.locals.set(varName, varValue);
                var varToken = new CompileTokenMetadata({ value: varName });
                ListWrapper.addAll(queriesWithReads, _this._getQueriesFor(varToken)
                    .map(function (query) { return new _QueryWithRead(query, varToken); }));
            });
            queriesWithReads.forEach(function (queryWithRead) {
                var value;
                if (isPresent(queryWithRead.read.identifier)) {
                    // query for an identifier
                    value = _this._instances.get(queryWithRead.read);
                }
                else {
                    // query for a reference
                    var token = _this.referenceTokens[queryWithRead.read.value];
                    if (isPresent(token)) {
                        value = _this._instances.get(token);
                    }
                    else {
                        value = _this.elementRef;
                    }
                }
                if (isPresent(value)) {
                    queryWithRead.query.addValue(value, _this.view);
                }
            });
            if (isPresent(this.component)) {
                var componentConstructorViewQueryList = isPresent(this.component) ? literalArr(this._componentConstructorViewQueryLists) :
                    NULL_EXPR;
                var compExpr = isPresent(this.getComponent()) ? this.getComponent() : NULL_EXPR;
                this.view.createMethod.addStmt(this.appElement.callMethod('initComponent', [compExpr, componentConstructorViewQueryList, this._compViewExpr])
                    .toStmt());
            }
        };
        CompileElement.prototype.afterChildren = function (childNodeCount) {
            var _this = this;
            this._resolvedProviders.values().forEach(function (resolvedProvider) {
                // Note: afterChildren is called after recursing into children.
                // This is good so that an injector match in an element that is closer to a requesting element
                // matches first.
                var providerExpr = _this._instances.get(resolvedProvider.token);
                // Note: view providers are only visible on the injector of that element.
                // This is not fully correct as the rules during codegen don't allow a directive
                // to get hold of a view provdier on the same element. We still do this semantic
                // as it simplifies our model to having only one runtime injector per element.
                var providerChildNodeCount = resolvedProvider.providerType === exports.ProviderAstType.PrivateService ? 0 : childNodeCount;
                _this.view.injectorGetMethod.addStmt(createInjectInternalCondition(_this.nodeIndex, providerChildNodeCount, resolvedProvider, providerExpr));
            });
            this._queries.values().forEach(function (queries) { return queries.forEach(function (query) { return query.afterChildren(_this.view.updateContentQueriesMethod); }); });
        };
        CompileElement.prototype.addContentNode = function (ngContentIndex, nodeExpr) {
            this.contentNodesByNgContentIndex[ngContentIndex].push(nodeExpr);
        };
        CompileElement.prototype.getComponent = function () {
            return isPresent(this.component) ? this._instances.get(identifierToken(this.component.type)) :
                null;
        };
        CompileElement.prototype.getProviderTokens = function () {
            return this._resolvedProviders.values().map(function (resolvedProvider) { return createDiTokenExpression(resolvedProvider.token); });
        };
        CompileElement.prototype._getQueriesFor = function (token) {
            var result = [];
            var currentEl = this;
            var distance = 0;
            var queries;
            while (!currentEl.isNull()) {
                queries = currentEl._queries.get(token);
                if (isPresent(queries)) {
                    ListWrapper.addAll(result, queries.filter(function (query) { return query.meta.descendants || distance <= 1; }));
                }
                if (currentEl._directives.length > 0) {
                    distance++;
                }
                currentEl = currentEl.parent;
            }
            queries = this.view.componentView.viewQueries.get(token);
            if (isPresent(queries)) {
                ListWrapper.addAll(result, queries);
            }
            return result;
        };
        CompileElement.prototype._addQuery = function (queryMeta, directiveInstance) {
            var propName = "_query_" + queryMeta.selectors[0].name + "_" + this.nodeIndex + "_" + this._queryCount++;
            var queryList = createQueryList(queryMeta, directiveInstance, propName, this.view);
            var query = new CompileQuery(queryMeta, queryList, directiveInstance, this.view);
            addQueryToTokenMap(this._queries, query);
            return query;
        };
        CompileElement.prototype._getLocalDependency = function (requestingProviderType, dep) {
            var result = null;
            // constructor content query
            if (isBlank(result) && isPresent(dep.query)) {
                result = this._addQuery(dep.query, null).queryList;
            }
            // constructor view query
            if (isBlank(result) && isPresent(dep.viewQuery)) {
                result = createQueryList(dep.viewQuery, null, "_viewQuery_" + dep.viewQuery.selectors[0].name + "_" + this.nodeIndex + "_" + this._componentConstructorViewQueryLists.length, this.view);
                this._componentConstructorViewQueryLists.push(result);
            }
            if (isPresent(dep.token)) {
                // access builtins with special visibility
                if (isBlank(result)) {
                    if (dep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef))) {
                        if (requestingProviderType === exports.ProviderAstType.Component) {
                            return this._compViewExpr.prop('ref');
                        }
                        else {
                            return getPropertyInView(THIS_EXPR.prop('ref'), this.view, this.view.componentView);
                        }
                    }
                }
                // access regular providers on the element
                if (isBlank(result)) {
                    result = this._instances.get(dep.token);
                }
            }
            return result;
        };
        CompileElement.prototype._getDependency = function (requestingProviderType, dep) {
            var currElement = this;
            var result = null;
            if (dep.isValue) {
                result = literal(dep.value);
            }
            if (isBlank(result) && !dep.isSkipSelf) {
                result = this._getLocalDependency(requestingProviderType, dep);
            }
            // check parent elements
            while (isBlank(result) && !currElement.parent.isNull()) {
                currElement = currElement.parent;
                result = currElement._getLocalDependency(exports.ProviderAstType.PublicService, new CompileDiDependencyMetadata({ token: dep.token }));
            }
            if (isBlank(result)) {
                result = injectFromViewParentInjector(dep.token, dep.isOptional);
            }
            if (isBlank(result)) {
                result = NULL_EXPR;
            }
            return getPropertyInView(result, this.view, currElement.view);
        };
        return CompileElement;
    }(CompileNode));
    function createInjectInternalCondition(nodeIndex, childNodeCount, provider, providerExpr) {
        var indexCondition;
        if (childNodeCount > 0) {
            indexCondition = literal(nodeIndex)
                .lowerEquals(InjectMethodVars.requestNodeIndex)
                .and(InjectMethodVars.requestNodeIndex.lowerEquals(literal(nodeIndex + childNodeCount)));
        }
        else {
            indexCondition = literal(nodeIndex).identical(InjectMethodVars.requestNodeIndex);
        }
        return new IfStmt(InjectMethodVars.token.identical(createDiTokenExpression(provider.token)).and(indexCondition), [new ReturnStatement(providerExpr)]);
    }
    function createProviderProperty(propName, provider, providerValueExpressions, isMulti, isEager, compileElement) {
        var view = compileElement.view;
        var resolvedProviderValueExpr;
        var type;
        if (isMulti) {
            resolvedProviderValueExpr = literalArr(providerValueExpressions);
            type = new ArrayType(DYNAMIC_TYPE);
        }
        else {
            resolvedProviderValueExpr = providerValueExpressions[0];
            type = providerValueExpressions[0].type;
        }
        if (isBlank(type)) {
            type = DYNAMIC_TYPE;
        }
        if (isEager) {
            view.fields.push(new ClassField(propName, type));
            view.createMethod.addStmt(THIS_EXPR.prop(propName).set(resolvedProviderValueExpr).toStmt());
        }
        else {
            var internalField = "_" + propName;
            view.fields.push(new ClassField(internalField, type));
            var getter = new CompileMethod(view);
            getter.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
            // Note: Equals is important for JS so that it also checks the undefined case!
            getter.addStmt(new IfStmt(THIS_EXPR.prop(internalField).isBlank(), [THIS_EXPR.prop(internalField).set(resolvedProviderValueExpr).toStmt()]));
            getter.addStmt(new ReturnStatement(THIS_EXPR.prop(internalField)));
            view.getters.push(new ClassGetter(propName, getter.finish(), type));
        }
        return THIS_EXPR.prop(propName);
    }
    var _QueryWithRead = (function () {
        function _QueryWithRead(query, match) {
            this.query = query;
            this.read = isPresent(query.meta.read) ? query.meta.read : match;
        }
        return _QueryWithRead;
    }());
    function _convertValueToOutputAst(value) {
        return visitValue(value, new _ValueOutputAstTransformer(), null);
    }
    var _ValueOutputAstTransformer = (function (_super) {
        __extends(_ValueOutputAstTransformer, _super);
        function _ValueOutputAstTransformer() {
            _super.apply(this, arguments);
        }
        _ValueOutputAstTransformer.prototype.visitArray = function (arr, context) {
            var _this = this;
            return literalArr(arr.map(function (value) { return visitValue(value, _this, context); }));
        };
        _ValueOutputAstTransformer.prototype.visitStringMap = function (map, context) {
            var _this = this;
            var entries = [];
            StringMapWrapper.forEach(map, function (value, key) { entries.push([key, visitValue(value, _this, context)]); });
            return literalMap(entries);
        };
        _ValueOutputAstTransformer.prototype.visitPrimitive = function (value, context) { return literal(value); };
        _ValueOutputAstTransformer.prototype.visitOther = function (value, context) {
            if (value instanceof CompileIdentifierMetadata) {
                return importExpr(value);
            }
            else if (value instanceof Expression) {
                return value;
            }
            else {
                throw new _angular_core.BaseException("Illegal state: Don't now how to compile value " + value);
            }
        };
        return _ValueOutputAstTransformer;
    }(ValueTransformer));
    var _PurePipeProxy = (function () {
        function _PurePipeProxy(view, instance, argCount) {
            this.view = view;
            this.instance = instance;
            this.argCount = argCount;
        }
        return _PurePipeProxy;
    }());
    var CompilePipe = (function () {
        function CompilePipe(view, meta) {
            this.view = view;
            this.meta = meta;
            this._purePipeProxies = [];
            this.instance = THIS_EXPR.prop("_pipe_" + meta.name + "_" + view.pipeCount++);
        }
        CompilePipe.call = function (view, name, args) {
            var compView = view.componentView;
            var meta = _findPipeMeta(compView, name);
            var pipe;
            if (meta.pure) {
                // pure pipes live on the component view
                pipe = compView.purePipes.get(name);
                if (isBlank(pipe)) {
                    pipe = new CompilePipe(compView, meta);
                    compView.purePipes.set(name, pipe);
                    compView.pipes.push(pipe);
                }
            }
            else {
                // Non pure pipes live on the view that called it
                pipe = new CompilePipe(view, meta);
                view.pipes.push(pipe);
            }
            return pipe._call(view, args);
        };
        Object.defineProperty(CompilePipe.prototype, "pure", {
            get: function () { return this.meta.pure; },
            enumerable: true,
            configurable: true
        });
        CompilePipe.prototype.create = function () {
            var _this = this;
            var deps = this.meta.type.diDeps.map(function (diDep) {
                if (diDep.token.equalsTo(identifierToken(Identifiers.ChangeDetectorRef))) {
                    return getPropertyInView(THIS_EXPR.prop('ref'), _this.view, _this.view.componentView);
                }
                return injectFromViewParentInjector(diDep.token, false);
            });
            this.view.fields.push(new ClassField(this.instance.name, importType(this.meta.type)));
            this.view.createMethod.resetDebugInfo(null, null);
            this.view.createMethod.addStmt(THIS_EXPR.prop(this.instance.name)
                .set(importExpr(this.meta.type).instantiate(deps))
                .toStmt());
            this._purePipeProxies.forEach(function (purePipeProxy) {
                var pipeInstanceSeenFromPureProxy = getPropertyInView(_this.instance, purePipeProxy.view, _this.view);
                createPureProxy(pipeInstanceSeenFromPureProxy.prop('transform')
                    .callMethod(BuiltinMethod.bind, [pipeInstanceSeenFromPureProxy]), purePipeProxy.argCount, purePipeProxy.instance, purePipeProxy.view);
            });
        };
        CompilePipe.prototype._call = function (callingView, args) {
            if (this.meta.pure) {
                // PurePipeProxies live on the view that called them.
                var purePipeProxy = new _PurePipeProxy(callingView, THIS_EXPR.prop(this.instance.name + "_" + this._purePipeProxies.length), args.length);
                this._purePipeProxies.push(purePipeProxy);
                return importExpr(Identifiers.castByValue)
                    .callFn([
                        purePipeProxy.instance,
                        getPropertyInView(this.instance.prop('transform'), callingView, this.view)
                    ])
                    .callFn(args);
            }
            else {
                return getPropertyInView(this.instance, callingView, this.view).callMethod('transform', args);
            }
        };
        return CompilePipe;
    }());
    function _findPipeMeta(view, name) {
        var pipeMeta = null;
        for (var i = view.pipeMetas.length - 1; i >= 0; i--) {
            var localPipeMeta = view.pipeMetas[i];
            if (localPipeMeta.name == name) {
                pipeMeta = localPipeMeta;
                break;
            }
        }
        if (isBlank(pipeMeta)) {
            throw new BaseException$1("Illegal state: Could not find pipe " + name + " although the parser should have detected this error!");
        }
        return pipeMeta;
    }
    var CompileView = (function () {
        function CompileView(component, genConfig, pipeMetas, styles, viewIndex, declarationElement, templateVariableBindings) {
            var _this = this;
            this.component = component;
            this.genConfig = genConfig;
            this.pipeMetas = pipeMetas;
            this.styles = styles;
            this.viewIndex = viewIndex;
            this.declarationElement = declarationElement;
            this.templateVariableBindings = templateVariableBindings;
            this.nodes = [];
            // root nodes or AppElements for ViewContainers
            this.rootNodesOrAppElements = [];
            this.bindings = [];
            this.classStatements = [];
            this.eventHandlerMethods = [];
            this.fields = [];
            this.getters = [];
            this.disposables = [];
            this.subscriptions = [];
            this.purePipes = new Map();
            this.pipes = [];
            this.locals = new Map();
            this.literalArrayCount = 0;
            this.literalMapCount = 0;
            this.pipeCount = 0;
            this.createMethod = new CompileMethod(this);
            this.injectorGetMethod = new CompileMethod(this);
            this.updateContentQueriesMethod = new CompileMethod(this);
            this.dirtyParentQueriesMethod = new CompileMethod(this);
            this.updateViewQueriesMethod = new CompileMethod(this);
            this.detectChangesInInputsMethod = new CompileMethod(this);
            this.detectChangesRenderPropertiesMethod = new CompileMethod(this);
            this.afterContentLifecycleCallbacksMethod = new CompileMethod(this);
            this.afterViewLifecycleCallbacksMethod = new CompileMethod(this);
            this.destroyMethod = new CompileMethod(this);
            this.viewType = getViewType(component, viewIndex);
            this.className = "_View_" + component.type.name + viewIndex;
            this.classType = importType(new CompileIdentifierMetadata({ name: this.className }));
            this.viewFactory = variable(getViewFactoryName(component, viewIndex));
            if (this.viewType === ViewType.COMPONENT || this.viewType === ViewType.HOST) {
                this.componentView = this;
            }
            else {
                this.componentView = this.declarationElement.view.componentView;
            }
            this.componentContext =
                getPropertyInView(THIS_EXPR.prop('context'), this, this.componentView);
            var viewQueries = new CompileTokenMap();
            if (this.viewType === ViewType.COMPONENT) {
                var directiveInstance = THIS_EXPR.prop('context');
                ListWrapper.forEachWithIndex(this.component.viewQueries, function (queryMeta, queryIndex) {
                    var propName = "_viewQuery_" + queryMeta.selectors[0].name + "_" + queryIndex;
                    var queryList = createQueryList(queryMeta, directiveInstance, propName, _this);
                    var query = new CompileQuery(queryMeta, queryList, directiveInstance, _this);
                    addQueryToTokenMap(viewQueries, query);
                });
                var constructorViewQueryCount = 0;
                this.component.type.diDeps.forEach(function (dep) {
                    if (isPresent(dep.viewQuery)) {
                        var queryList = THIS_EXPR.prop('declarationAppElement')
                            .prop('componentConstructorViewQueries')
                            .key(literal(constructorViewQueryCount++));
                        var query = new CompileQuery(dep.viewQuery, queryList, null, _this);
                        addQueryToTokenMap(viewQueries, query);
                    }
                });
            }
            this.viewQueries = viewQueries;
            templateVariableBindings.forEach(function (entry) { _this.locals.set(entry[1], THIS_EXPR.prop('context').prop(entry[0])); });
            if (!this.declarationElement.isNull()) {
                this.declarationElement.setEmbeddedView(this);
            }
        }
        CompileView.prototype.callPipe = function (name, input, args) {
            return CompilePipe.call(this, name, [input].concat(args));
        };
        CompileView.prototype.getLocal = function (name) {
            if (name == EventHandlerVars.event.name) {
                return EventHandlerVars.event;
            }
            var currView = this;
            var result = currView.locals.get(name);
            while (isBlank(result) && isPresent(currView.declarationElement.view)) {
                currView = currView.declarationElement.view;
                result = currView.locals.get(name);
            }
            if (isPresent(result)) {
                return getPropertyInView(result, this, currView);
            }
            else {
                return null;
            }
        };
        CompileView.prototype.createLiteralArray = function (values) {
            if (values.length === 0) {
                return importExpr(Identifiers.EMPTY_ARRAY);
            }
            var proxyExpr = THIS_EXPR.prop("_arr_" + this.literalArrayCount++);
            var proxyParams = [];
            var proxyReturnEntries = [];
            for (var i = 0; i < values.length; i++) {
                var paramName = "p" + i;
                proxyParams.push(new FnParam(paramName));
                proxyReturnEntries.push(variable(paramName));
            }
            createPureProxy(fn(proxyParams, [new ReturnStatement(literalArr(proxyReturnEntries))]), values.length, proxyExpr, this);
            return proxyExpr.callFn(values);
        };
        CompileView.prototype.createLiteralMap = function (entries) {
            if (entries.length === 0) {
                return importExpr(Identifiers.EMPTY_MAP);
            }
            var proxyExpr = THIS_EXPR.prop("_map_" + this.literalMapCount++);
            var proxyParams = [];
            var proxyReturnEntries = [];
            var values = [];
            for (var i = 0; i < entries.length; i++) {
                var paramName = "p" + i;
                proxyParams.push(new FnParam(paramName));
                proxyReturnEntries.push([entries[i][0], variable(paramName)]);
                values.push(entries[i][1]);
            }
            createPureProxy(fn(proxyParams, [new ReturnStatement(literalMap(proxyReturnEntries))]), entries.length, proxyExpr, this);
            return proxyExpr.callFn(values);
        };
        CompileView.prototype.afterNodes = function () {
            var _this = this;
            this.pipes.forEach(function (pipe) { return pipe.create(); });
            this.viewQueries.values().forEach(function (queries) { return queries.forEach(function (query) { return query.afterChildren(_this.updateViewQueriesMethod); }); });
        };
        return CompileView;
    }());
    function getViewType(component, embeddedTemplateIndex) {
        if (embeddedTemplateIndex > 0) {
            return ViewType.EMBEDDED;
        }
        else if (component.type.isHost) {
            return ViewType.HOST;
        }
        else {
            return ViewType.COMPONENT;
        }
    }
    var IMPLICIT_TEMPLATE_VAR = '\$implicit';
    var CLASS_ATTR$1 = 'class';
    var STYLE_ATTR = 'style';
    var parentRenderNodeVar = variable('parentRenderNode');
    var rootSelectorVar = variable('rootSelector');
    var ViewCompileDependency = (function () {
        function ViewCompileDependency(comp, factoryPlaceholder) {
            this.comp = comp;
            this.factoryPlaceholder = factoryPlaceholder;
        }
        return ViewCompileDependency;
    }());
    function buildView(view, template, targetDependencies) {
        var builderVisitor = new ViewBuilderVisitor(view, targetDependencies);
        templateVisitAll(builderVisitor, template, view.declarationElement.isNull() ?
            view.declarationElement :
            view.declarationElement.parent);
        return builderVisitor.nestedViewCount;
    }
    function finishView(view, targetStatements) {
        view.afterNodes();
        createViewTopLevelStmts(view, targetStatements);
        view.nodes.forEach(function (node) {
            if (node instanceof CompileElement && node.hasEmbeddedView) {
                finishView(node.embeddedView, targetStatements);
            }
        });
    }
    var ViewBuilderVisitor = (function () {
        function ViewBuilderVisitor(view, targetDependencies) {
            this.view = view;
            this.targetDependencies = targetDependencies;
            this.nestedViewCount = 0;
        }
        ViewBuilderVisitor.prototype._isRootNode = function (parent) { return parent.view !== this.view; };
        ViewBuilderVisitor.prototype._addRootNodeAndProject = function (node, ngContentIndex, parent) {
            var vcAppEl = (node instanceof CompileElement && node.hasViewContainer) ? node.appElement : null;
            if (this._isRootNode(parent)) {
                // store appElement as root node only for ViewContainers
                if (this.view.viewType !== ViewType.COMPONENT) {
                    this.view.rootNodesOrAppElements.push(isPresent(vcAppEl) ? vcAppEl : node.renderNode);
                }
            }
            else if (isPresent(parent.component) && isPresent(ngContentIndex)) {
                parent.addContentNode(ngContentIndex, isPresent(vcAppEl) ? vcAppEl : node.renderNode);
            }
        };
        ViewBuilderVisitor.prototype._getParentRenderNode = function (parent) {
            if (this._isRootNode(parent)) {
                if (this.view.viewType === ViewType.COMPONENT) {
                    return parentRenderNodeVar;
                }
                else {
                    // root node of an embedded/host view
                    return NULL_EXPR;
                }
            }
            else {
                return isPresent(parent.component) &&
                parent.component.template.encapsulation !== _angular_core.ViewEncapsulation.Native ?
                    NULL_EXPR :
                    parent.renderNode;
            }
        };
        ViewBuilderVisitor.prototype.visitBoundText = function (ast, parent) {
            return this._visitText(ast, '', ast.ngContentIndex, parent);
        };
        ViewBuilderVisitor.prototype.visitText = function (ast, parent) {
            return this._visitText(ast, ast.value, ast.ngContentIndex, parent);
        };
        ViewBuilderVisitor.prototype._visitText = function (ast, value, ngContentIndex, parent) {
            var fieldName = "_text_" + this.view.nodes.length;
            this.view.fields.push(new ClassField(fieldName, importType(this.view.genConfig.renderTypes.renderText)));
            var renderNode = THIS_EXPR.prop(fieldName);
            var compileNode = new CompileNode(parent, this.view, this.view.nodes.length, renderNode, ast);
            var createRenderNode = THIS_EXPR.prop(fieldName)
                .set(ViewProperties.renderer.callMethod('createText', [
                    this._getParentRenderNode(parent),
                    literal(value),
                    this.view.createMethod.resetDebugInfoExpr(this.view.nodes.length, ast)
                ]))
                .toStmt();
            this.view.nodes.push(compileNode);
            this.view.createMethod.addStmt(createRenderNode);
            this._addRootNodeAndProject(compileNode, ngContentIndex, parent);
            return renderNode;
        };
        ViewBuilderVisitor.prototype.visitNgContent = function (ast, parent) {
            // the projected nodes originate from a different view, so we don't
            // have debug information for them...
            this.view.createMethod.resetDebugInfo(null, ast);
            var parentRenderNode = this._getParentRenderNode(parent);
            var nodesExpression = ViewProperties.projectableNodes.key(literal(ast.index), new ArrayType(importType(this.view.genConfig.renderTypes.renderNode)));
            if (parentRenderNode !== NULL_EXPR) {
                this.view.createMethod.addStmt(ViewProperties.renderer.callMethod('projectNodes', [
                    parentRenderNode,
                    importExpr(Identifiers.flattenNestedViewRenderNodes)
                        .callFn([nodesExpression])
                ])
                    .toStmt());
            }
            else if (this._isRootNode(parent)) {
                if (this.view.viewType !== ViewType.COMPONENT) {
                    // store root nodes only for embedded/host views
                    this.view.rootNodesOrAppElements.push(nodesExpression);
                }
            }
            else {
                if (isPresent(parent.component) && isPresent(ast.ngContentIndex)) {
                    parent.addContentNode(ast.ngContentIndex, nodesExpression);
                }
            }
            return null;
        };
        ViewBuilderVisitor.prototype.visitElement = function (ast, parent) {
            var nodeIndex = this.view.nodes.length;
            var createRenderNodeExpr;
            var debugContextExpr = this.view.createMethod.resetDebugInfoExpr(nodeIndex, ast);
            if (nodeIndex === 0 && this.view.viewType === ViewType.HOST) {
                createRenderNodeExpr = THIS_EXPR.callMethod('selectOrCreateHostElement', [literal(ast.name), rootSelectorVar, debugContextExpr]);
            }
            else {
                createRenderNodeExpr = ViewProperties.renderer.callMethod('createElement', [this._getParentRenderNode(parent), literal(ast.name), debugContextExpr]);
            }
            var fieldName = "_el_" + nodeIndex;
            this.view.fields.push(new ClassField(fieldName, importType(this.view.genConfig.renderTypes.renderElement)));
            this.view.createMethod.addStmt(THIS_EXPR.prop(fieldName).set(createRenderNodeExpr).toStmt());
            var renderNode = THIS_EXPR.prop(fieldName);
            var directives = ast.directives.map(function (directiveAst) { return directiveAst.directive; });
            var component = directives.find(function (directive) { return directive.isComponent; });
            var htmlAttrs = _readHtmlAttrs(ast.attrs);
            var attrNameAndValues = _mergeHtmlAndDirectiveAttrs(htmlAttrs, directives);
            for (var i = 0; i < attrNameAndValues.length; i++) {
                var attrName = attrNameAndValues[i][0];
                var attrValue = attrNameAndValues[i][1];
                this.view.createMethod.addStmt(ViewProperties.renderer.callMethod('setElementAttribute', [renderNode, literal(attrName), literal(attrValue)])
                    .toStmt());
            }
            var compileElement = new CompileElement(parent, this.view, nodeIndex, renderNode, ast, component, directives, ast.providers, ast.hasViewContainer, false, ast.references);
            this.view.nodes.push(compileElement);
            var compViewExpr = null;
            if (isPresent(component)) {
                var nestedComponentIdentifier = new CompileIdentifierMetadata({ name: getViewFactoryName(component, 0) });
                this.targetDependencies.push(new ViewCompileDependency(component, nestedComponentIdentifier));
                compViewExpr = variable("compView_" + nodeIndex); // fix highlighting: `
                compileElement.setComponentView(compViewExpr);
                this.view.createMethod.addStmt(compViewExpr.set(importExpr(nestedComponentIdentifier)
                    .callFn([
                        ViewProperties.viewUtils,
                        compileElement.injector,
                        compileElement.appElement
                    ]))
                    .toDeclStmt());
            }
            compileElement.beforeChildren();
            this._addRootNodeAndProject(compileElement, ast.ngContentIndex, parent);
            templateVisitAll(this, ast.children, compileElement);
            compileElement.afterChildren(this.view.nodes.length - nodeIndex - 1);
            if (isPresent(compViewExpr)) {
                var codeGenContentNodes;
                if (this.view.component.type.isHost) {
                    codeGenContentNodes = ViewProperties.projectableNodes;
                }
                else {
                    codeGenContentNodes = literalArr(compileElement.contentNodesByNgContentIndex.map(function (nodes) { return createFlatArray(nodes); }));
                }
                this.view.createMethod.addStmt(compViewExpr.callMethod('create', [compileElement.getComponent(), codeGenContentNodes, NULL_EXPR])
                    .toStmt());
            }
            return null;
        };
        ViewBuilderVisitor.prototype.visitEmbeddedTemplate = function (ast, parent) {
            var nodeIndex = this.view.nodes.length;
            var fieldName = "_anchor_" + nodeIndex;
            this.view.fields.push(new ClassField(fieldName, importType(this.view.genConfig.renderTypes.renderComment)));
            this.view.createMethod.addStmt(THIS_EXPR.prop(fieldName)
                .set(ViewProperties.renderer.callMethod('createTemplateAnchor', [
                    this._getParentRenderNode(parent),
                    this.view.createMethod.resetDebugInfoExpr(nodeIndex, ast)
                ]))
                .toStmt());
            var renderNode = THIS_EXPR.prop(fieldName);
            var templateVariableBindings = ast.variables.map(function (varAst) { return [varAst.value.length > 0 ? varAst.value : IMPLICIT_TEMPLATE_VAR, varAst.name]; });
            var directives = ast.directives.map(function (directiveAst) { return directiveAst.directive; });
            var compileElement = new CompileElement(parent, this.view, nodeIndex, renderNode, ast, null, directives, ast.providers, ast.hasViewContainer, true, ast.references);
            this.view.nodes.push(compileElement);
            this.nestedViewCount++;
            var embeddedView = new CompileView(this.view.component, this.view.genConfig, this.view.pipeMetas, NULL_EXPR, this.view.viewIndex + this.nestedViewCount, compileElement, templateVariableBindings);
            this.nestedViewCount += buildView(embeddedView, ast.children, this.targetDependencies);
            compileElement.beforeChildren();
            this._addRootNodeAndProject(compileElement, ast.ngContentIndex, parent);
            compileElement.afterChildren(0);
            return null;
        };
        ViewBuilderVisitor.prototype.visitAttr = function (ast, ctx) { return null; };
        ViewBuilderVisitor.prototype.visitDirective = function (ast, ctx) { return null; };
        ViewBuilderVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
            return null;
        };
        ViewBuilderVisitor.prototype.visitReference = function (ast, ctx) { return null; };
        ViewBuilderVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
        ViewBuilderVisitor.prototype.visitDirectiveProperty = function (ast, context) { return null; };
        ViewBuilderVisitor.prototype.visitElementProperty = function (ast, context) { return null; };
        return ViewBuilderVisitor;
    }());
    function _mergeHtmlAndDirectiveAttrs(declaredHtmlAttrs, directives) {
        var result = {};
        StringMapWrapper.forEach(declaredHtmlAttrs, function (value, key) { result[key] = value; });
        directives.forEach(function (directiveMeta) {
            StringMapWrapper.forEach(directiveMeta.hostAttributes, function (value, name) {
                var prevValue = result[name];
                result[name] = isPresent(prevValue) ? mergeAttributeValue(name, prevValue, value) : value;
            });
        });
        return mapToKeyValueArray(result);
    }
    function _readHtmlAttrs(attrs) {
        var htmlAttrs = {};
        attrs.forEach(function (ast) { htmlAttrs[ast.name] = ast.value; });
        return htmlAttrs;
    }
    function mergeAttributeValue(attrName, attrValue1, attrValue2) {
        if (attrName == CLASS_ATTR$1 || attrName == STYLE_ATTR) {
            return attrValue1 + " " + attrValue2;
        }
        else {
            return attrValue2;
        }
    }
    function mapToKeyValueArray(data) {
        var entryArray = [];
        StringMapWrapper.forEach(data, function (value, name) { entryArray.push([name, value]); });
        // We need to sort to get a defined output order
        // for tests and for caching generated artifacts...
        ListWrapper.sort(entryArray, function (entry1, entry2) { return StringWrapper.compare(entry1[0], entry2[0]); });
        var keyValueArray = [];
        entryArray.forEach(function (entry) { keyValueArray.push([entry[0], entry[1]]); });
        return keyValueArray;
    }
    function createViewTopLevelStmts(view, targetStatements) {
        var nodeDebugInfosVar = NULL_EXPR;
        if (view.genConfig.genDebugInfo) {
            nodeDebugInfosVar = variable("nodeDebugInfos_" + view.component.type.name + view.viewIndex); // fix highlighting: `
            targetStatements.push(nodeDebugInfosVar
                .set(literalArr(view.nodes.map(createStaticNodeDebugInfo), new ArrayType(new ExternalType(Identifiers.StaticNodeDebugInfo), [TypeModifier.Const])))
                .toDeclStmt(null, [StmtModifier.Final]));
        }
        var renderCompTypeVar = variable("renderType_" + view.component.type.name); // fix highlighting: `
        if (view.viewIndex === 0) {
            targetStatements.push(renderCompTypeVar.set(NULL_EXPR)
                .toDeclStmt(importType(Identifiers.RenderComponentType)));
        }
        var viewClass = createViewClass(view, renderCompTypeVar, nodeDebugInfosVar);
        targetStatements.push(viewClass);
        targetStatements.push(createViewFactory(view, viewClass, renderCompTypeVar));
    }
    function createStaticNodeDebugInfo(node) {
        var compileElement = node instanceof CompileElement ? node : null;
        var providerTokens = [];
        var componentToken = NULL_EXPR;
        var varTokenEntries = [];
        if (isPresent(compileElement)) {
            providerTokens = compileElement.getProviderTokens();
            if (isPresent(compileElement.component)) {
                componentToken = createDiTokenExpression(identifierToken(compileElement.component.type));
            }
            StringMapWrapper.forEach(compileElement.referenceTokens, function (token, varName) {
                varTokenEntries.push([varName, isPresent(token) ? createDiTokenExpression(token) : NULL_EXPR]);
            });
        }
        return importExpr(Identifiers.StaticNodeDebugInfo)
            .instantiate([
                literalArr(providerTokens, new ArrayType(DYNAMIC_TYPE, [TypeModifier.Const])),
                componentToken,
                literalMap(varTokenEntries, new MapType(DYNAMIC_TYPE, [TypeModifier.Const]))
            ], importType(Identifiers.StaticNodeDebugInfo, null, [TypeModifier.Const]));
    }
    function createViewClass(view, renderCompTypeVar, nodeDebugInfosVar) {
        var viewConstructorArgs = [
            new FnParam(ViewConstructorVars.viewUtils.name, importType(Identifiers.ViewUtils)),
            new FnParam(ViewConstructorVars.parentInjector.name, importType(Identifiers.Injector)),
            new FnParam(ViewConstructorVars.declarationEl.name, importType(Identifiers.AppElement))
        ];
        var superConstructorArgs = [
            variable(view.className),
            renderCompTypeVar,
            ViewTypeEnum.fromValue(view.viewType),
            ViewConstructorVars.viewUtils,
            ViewConstructorVars.parentInjector,
            ViewConstructorVars.declarationEl,
            ChangeDetectionStrategyEnum.fromValue(getChangeDetectionMode(view))
        ];
        if (view.genConfig.genDebugInfo) {
            superConstructorArgs.push(nodeDebugInfosVar);
        }
        var viewConstructor = new ClassMethod(null, viewConstructorArgs, [SUPER_EXPR.callFn(superConstructorArgs).toStmt()]);
        var viewMethods = [
            new ClassMethod('createInternal', [new FnParam(rootSelectorVar.name, STRING_TYPE)], generateCreateMethod(view), importType(Identifiers.AppElement)),
            new ClassMethod('injectorGetInternal', [
                new FnParam(InjectMethodVars.token.name, DYNAMIC_TYPE),
                // Note: Can't use o.INT_TYPE here as the method in AppView uses number
                new FnParam(InjectMethodVars.requestNodeIndex.name, NUMBER_TYPE),
                new FnParam(InjectMethodVars.notFoundResult.name, DYNAMIC_TYPE)
            ], addReturnValuefNotEmpty(view.injectorGetMethod.finish(), InjectMethodVars.notFoundResult), DYNAMIC_TYPE),
            new ClassMethod('detectChangesInternal', [new FnParam(DetectChangesVars.throwOnChange.name, BOOL_TYPE)], generateDetectChangesMethod(view)),
            new ClassMethod('dirtyParentQueriesInternal', [], view.dirtyParentQueriesMethod.finish()),
            new ClassMethod('destroyInternal', [], view.destroyMethod.finish())
        ].concat(view.eventHandlerMethods);
        var superClass = view.genConfig.genDebugInfo ? Identifiers.DebugAppView : Identifiers.AppView;
        var viewClass = new ClassStmt(view.className, importExpr(superClass, [getContextType(view)]), view.fields, view.getters, viewConstructor, viewMethods.filter(function (method) { return method.body.length > 0; }));
        return viewClass;
    }
    function createViewFactory(view, viewClass, renderCompTypeVar) {
        var viewFactoryArgs = [
            new FnParam(ViewConstructorVars.viewUtils.name, importType(Identifiers.ViewUtils)),
            new FnParam(ViewConstructorVars.parentInjector.name, importType(Identifiers.Injector)),
            new FnParam(ViewConstructorVars.declarationEl.name, importType(Identifiers.AppElement))
        ];
        var initRenderCompTypeStmts = [];
        var templateUrlInfo;
        if (view.component.template.templateUrl == view.component.type.moduleUrl) {
            templateUrlInfo =
                view.component.type.moduleUrl + " class " + view.component.type.name + " - inline template";
        }
        else {
            templateUrlInfo = view.component.template.templateUrl;
        }
        if (view.viewIndex === 0) {
            initRenderCompTypeStmts = [
                new IfStmt(renderCompTypeVar.identical(NULL_EXPR), [
                    renderCompTypeVar.set(ViewConstructorVars
                        .viewUtils.callMethod('createRenderComponentType', [
                            literal(templateUrlInfo),
                            literal(view.component
                                .template.ngContentSelectors.length),
                            ViewEncapsulationEnum
                                .fromValue(view.component.template.encapsulation),
                            view.styles
                        ]))
                        .toStmt()
                ])
            ];
        }
        return fn(viewFactoryArgs, initRenderCompTypeStmts.concat([
            new ReturnStatement(variable(viewClass.name)
                .instantiate(viewClass.constructorMethod.params.map(function (param) { return variable(param.name); })))
        ]), importType(Identifiers.AppView, [getContextType(view)]))
            .toDeclStmt(view.viewFactory.name, [StmtModifier.Final]);
    }
    function generateCreateMethod(view) {
        var parentRenderNodeExpr = NULL_EXPR;
        var parentRenderNodeStmts = [];
        if (view.viewType === ViewType.COMPONENT) {
            parentRenderNodeExpr = ViewProperties.renderer.callMethod('createViewRoot', [THIS_EXPR.prop('declarationAppElement').prop('nativeElement')]);
            parentRenderNodeStmts = [
                parentRenderNodeVar.set(parentRenderNodeExpr)
                    .toDeclStmt(importType(view.genConfig.renderTypes.renderNode), [StmtModifier.Final])
            ];
        }
        var resultExpr;
        if (view.viewType === ViewType.HOST) {
            resultExpr = view.nodes[0].appElement;
        }
        else {
            resultExpr = NULL_EXPR;
        }
        return parentRenderNodeStmts.concat(view.createMethod.finish())
            .concat([
                THIS_EXPR.callMethod('init', [
                    createFlatArray(view.rootNodesOrAppElements),
                    literalArr(view.nodes.map(function (node) { return node.renderNode; })),
                    literalArr(view.disposables),
                    literalArr(view.subscriptions)
                ])
                    .toStmt(),
                new ReturnStatement(resultExpr)
            ]);
    }
    function generateDetectChangesMethod(view) {
        var stmts = [];
        if (view.detectChangesInInputsMethod.isEmpty() && view.updateContentQueriesMethod.isEmpty() &&
            view.afterContentLifecycleCallbacksMethod.isEmpty() &&
            view.detectChangesRenderPropertiesMethod.isEmpty() &&
            view.updateViewQueriesMethod.isEmpty() && view.afterViewLifecycleCallbacksMethod.isEmpty()) {
            return stmts;
        }
        ListWrapper.addAll(stmts, view.detectChangesInInputsMethod.finish());
        stmts.push(THIS_EXPR.callMethod('detectContentChildrenChanges', [DetectChangesVars.throwOnChange])
            .toStmt());
        var afterContentStmts = view.updateContentQueriesMethod.finish().concat(view.afterContentLifecycleCallbacksMethod.finish());
        if (afterContentStmts.length > 0) {
            stmts.push(new IfStmt(not(DetectChangesVars.throwOnChange), afterContentStmts));
        }
        ListWrapper.addAll(stmts, view.detectChangesRenderPropertiesMethod.finish());
        stmts.push(THIS_EXPR.callMethod('detectViewChildrenChanges', [DetectChangesVars.throwOnChange])
            .toStmt());
        var afterViewStmts = view.updateViewQueriesMethod.finish().concat(view.afterViewLifecycleCallbacksMethod.finish());
        if (afterViewStmts.length > 0) {
            stmts.push(new IfStmt(not(DetectChangesVars.throwOnChange), afterViewStmts));
        }
        var varStmts = [];
        var readVars = findReadVarNames(stmts);
        if (SetWrapper.has(readVars, DetectChangesVars.changed.name)) {
            varStmts.push(DetectChangesVars.changed.set(literal(true)).toDeclStmt(BOOL_TYPE));
        }
        if (SetWrapper.has(readVars, DetectChangesVars.changes.name)) {
            varStmts.push(DetectChangesVars.changes.set(NULL_EXPR)
                .toDeclStmt(new MapType(importType(Identifiers.SimpleChange))));
        }
        if (SetWrapper.has(readVars, DetectChangesVars.valUnwrapper.name)) {
            varStmts.push(DetectChangesVars.valUnwrapper.set(importExpr(Identifiers.ValueUnwrapper).instantiate([]))
                .toDeclStmt(null, [StmtModifier.Final]));
        }
        return varStmts.concat(stmts);
    }
    function addReturnValuefNotEmpty(statements, value) {
        if (statements.length > 0) {
            return statements.concat([new ReturnStatement(value)]);
        }
        else {
            return statements;
        }
    }
    function getContextType(view) {
        if (view.viewType === ViewType.COMPONENT) {
            return importType(view.component.type);
        }
        return DYNAMIC_TYPE;
    }
    function getChangeDetectionMode(view) {
        var mode;
        if (view.viewType === ViewType.COMPONENT) {
            mode = isDefaultChangeDetectionStrategy(view.component.changeDetection) ?
                _angular_core.ChangeDetectionStrategy.CheckAlways :
                _angular_core.ChangeDetectionStrategy.CheckOnce;
        }
        else {
            mode = _angular_core.ChangeDetectionStrategy.CheckAlways;
        }
        return mode;
    }
    var IMPLICIT_RECEIVER = variable('#implicit');
    var ExpressionWithWrappedValueInfo = (function () {
        function ExpressionWithWrappedValueInfo(expression, needsValueUnwrapper) {
            this.expression = expression;
            this.needsValueUnwrapper = needsValueUnwrapper;
        }
        return ExpressionWithWrappedValueInfo;
    }());
    function convertCdExpressionToIr(nameResolver, implicitReceiver, expression, valueUnwrapper) {
        var visitor = new _AstToIrVisitor(nameResolver, implicitReceiver, valueUnwrapper);
        var irAst = expression.visit(visitor, _Mode.Expression);
        return new ExpressionWithWrappedValueInfo(irAst, visitor.needsValueUnwrapper);
    }
    function convertCdStatementToIr(nameResolver, implicitReceiver, stmt) {
        var visitor = new _AstToIrVisitor(nameResolver, implicitReceiver, null);
        var statements = [];
        flattenStatements(stmt.visit(visitor, _Mode.Statement), statements);
        return statements;
    }
    var _Mode;
    (function (_Mode) {
        _Mode[_Mode["Statement"] = 0] = "Statement";
        _Mode[_Mode["Expression"] = 1] = "Expression";
    })(_Mode || (_Mode = {}));
    function ensureStatementMode(mode, ast) {
        if (mode !== _Mode.Statement) {
            throw new BaseException$1("Expected a statement, but saw " + ast);
        }
    }
    function ensureExpressionMode(mode, ast) {
        if (mode !== _Mode.Expression) {
            throw new BaseException$1("Expected an expression, but saw " + ast);
        }
    }
    function convertToStatementIfNeeded(mode, expr) {
        if (mode === _Mode.Statement) {
            return expr.toStmt();
        }
        else {
            return expr;
        }
    }
    var _AstToIrVisitor = (function () {
        function _AstToIrVisitor(_nameResolver, _implicitReceiver, _valueUnwrapper) {
            this._nameResolver = _nameResolver;
            this._implicitReceiver = _implicitReceiver;
            this._valueUnwrapper = _valueUnwrapper;
            this.needsValueUnwrapper = false;
        }
        _AstToIrVisitor.prototype.visitBinary = function (ast, mode) {
            var op;
            switch (ast.operation) {
                case '+':
                    op = BinaryOperator.Plus;
                    break;
                case '-':
                    op = BinaryOperator.Minus;
                    break;
                case '*':
                    op = BinaryOperator.Multiply;
                    break;
                case '/':
                    op = BinaryOperator.Divide;
                    break;
                case '%':
                    op = BinaryOperator.Modulo;
                    break;
                case '&&':
                    op = BinaryOperator.And;
                    break;
                case '||':
                    op = BinaryOperator.Or;
                    break;
                case '==':
                    op = BinaryOperator.Equals;
                    break;
                case '!=':
                    op = BinaryOperator.NotEquals;
                    break;
                case '===':
                    op = BinaryOperator.Identical;
                    break;
                case '!==':
                    op = BinaryOperator.NotIdentical;
                    break;
                case '<':
                    op = BinaryOperator.Lower;
                    break;
                case '>':
                    op = BinaryOperator.Bigger;
                    break;
                case '<=':
                    op = BinaryOperator.LowerEquals;
                    break;
                case '>=':
                    op = BinaryOperator.BiggerEquals;
                    break;
                default:
                    throw new BaseException$1("Unsupported operation " + ast.operation);
            }
            return convertToStatementIfNeeded(mode, new BinaryOperatorExpr(op, ast.left.visit(this, _Mode.Expression), ast.right.visit(this, _Mode.Expression)));
        };
        _AstToIrVisitor.prototype.visitChain = function (ast, mode) {
            ensureStatementMode(mode, ast);
            return this.visitAll(ast.expressions, mode);
        };
        _AstToIrVisitor.prototype.visitConditional = function (ast, mode) {
            var value = ast.condition.visit(this, _Mode.Expression);
            return convertToStatementIfNeeded(mode, value.conditional(ast.trueExp.visit(this, _Mode.Expression), ast.falseExp.visit(this, _Mode.Expression)));
        };
        _AstToIrVisitor.prototype.visitPipe = function (ast, mode) {
            var input = ast.exp.visit(this, _Mode.Expression);
            var args = this.visitAll(ast.args, _Mode.Expression);
            var value = this._nameResolver.callPipe(ast.name, input, args);
            this.needsValueUnwrapper = true;
            return convertToStatementIfNeeded(mode, this._valueUnwrapper.callMethod('unwrap', [value]));
        };
        _AstToIrVisitor.prototype.visitFunctionCall = function (ast, mode) {
            return convertToStatementIfNeeded(mode, ast.target.visit(this, _Mode.Expression)
                .callFn(this.visitAll(ast.args, _Mode.Expression)));
        };
        _AstToIrVisitor.prototype.visitImplicitReceiver = function (ast, mode) {
            ensureExpressionMode(mode, ast);
            return IMPLICIT_RECEIVER;
        };
        _AstToIrVisitor.prototype.visitInterpolation = function (ast, mode) {
            ensureExpressionMode(mode, ast);
            var args = [literal(ast.expressions.length)];
            for (var i = 0; i < ast.strings.length - 1; i++) {
                args.push(literal(ast.strings[i]));
                args.push(ast.expressions[i].visit(this, _Mode.Expression));
            }
            args.push(literal(ast.strings[ast.strings.length - 1]));
            return importExpr(Identifiers.interpolate).callFn(args);
        };
        _AstToIrVisitor.prototype.visitKeyedRead = function (ast, mode) {
            return convertToStatementIfNeeded(mode, ast.obj.visit(this, _Mode.Expression).key(ast.key.visit(this, _Mode.Expression)));
        };
        _AstToIrVisitor.prototype.visitKeyedWrite = function (ast, mode) {
            var obj = ast.obj.visit(this, _Mode.Expression);
            var key = ast.key.visit(this, _Mode.Expression);
            var value = ast.value.visit(this, _Mode.Expression);
            return convertToStatementIfNeeded(mode, obj.key(key).set(value));
        };
        _AstToIrVisitor.prototype.visitLiteralArray = function (ast, mode) {
            return convertToStatementIfNeeded(mode, this._nameResolver.createLiteralArray(this.visitAll(ast.expressions, mode)));
        };
        _AstToIrVisitor.prototype.visitLiteralMap = function (ast, mode) {
            var parts = [];
            for (var i = 0; i < ast.keys.length; i++) {
                parts.push([ast.keys[i], ast.values[i].visit(this, _Mode.Expression)]);
            }
            return convertToStatementIfNeeded(mode, this._nameResolver.createLiteralMap(parts));
        };
        _AstToIrVisitor.prototype.visitLiteralPrimitive = function (ast, mode) {
            return convertToStatementIfNeeded(mode, literal(ast.value));
        };
        _AstToIrVisitor.prototype.visitMethodCall = function (ast, mode) {
            var args = this.visitAll(ast.args, _Mode.Expression);
            var result = null;
            var receiver = ast.receiver.visit(this, _Mode.Expression);
            if (receiver === IMPLICIT_RECEIVER) {
                var varExpr = this._nameResolver.getLocal(ast.name);
                if (isPresent(varExpr)) {
                    result = varExpr.callFn(args);
                }
                else {
                    receiver = this._implicitReceiver;
                }
            }
            if (isBlank(result)) {
                result = receiver.callMethod(ast.name, args);
            }
            return convertToStatementIfNeeded(mode, result);
        };
        _AstToIrVisitor.prototype.visitPrefixNot = function (ast, mode) {
            return convertToStatementIfNeeded(mode, not(ast.expression.visit(this, _Mode.Expression)));
        };
        _AstToIrVisitor.prototype.visitPropertyRead = function (ast, mode) {
            var result = null;
            var receiver = ast.receiver.visit(this, _Mode.Expression);
            if (receiver === IMPLICIT_RECEIVER) {
                result = this._nameResolver.getLocal(ast.name);
                if (isBlank(result)) {
                    receiver = this._implicitReceiver;
                }
            }
            if (isBlank(result)) {
                result = receiver.prop(ast.name);
            }
            return convertToStatementIfNeeded(mode, result);
        };
        _AstToIrVisitor.prototype.visitPropertyWrite = function (ast, mode) {
            var receiver = ast.receiver.visit(this, _Mode.Expression);
            if (receiver === IMPLICIT_RECEIVER) {
                var varExpr = this._nameResolver.getLocal(ast.name);
                if (isPresent(varExpr)) {
                    throw new BaseException$1('Cannot assign to a reference or variable!');
                }
                receiver = this._implicitReceiver;
            }
            return convertToStatementIfNeeded(mode, receiver.prop(ast.name).set(ast.value.visit(this, _Mode.Expression)));
        };
        _AstToIrVisitor.prototype.visitSafePropertyRead = function (ast, mode) {
            var receiver = ast.receiver.visit(this, _Mode.Expression);
            return convertToStatementIfNeeded(mode, receiver.isBlank().conditional(NULL_EXPR, receiver.prop(ast.name)));
        };
        _AstToIrVisitor.prototype.visitSafeMethodCall = function (ast, mode) {
            var receiver = ast.receiver.visit(this, _Mode.Expression);
            var args = this.visitAll(ast.args, _Mode.Expression);
            return convertToStatementIfNeeded(mode, receiver.isBlank().conditional(NULL_EXPR, receiver.callMethod(ast.name, args)));
        };
        _AstToIrVisitor.prototype.visitAll = function (asts, mode) {
            var _this = this;
            return asts.map(function (ast) { return ast.visit(_this, mode); });
        };
        _AstToIrVisitor.prototype.visitQuote = function (ast, mode) {
            throw new BaseException$1('Quotes are not supported for evaluation!');
        };
        return _AstToIrVisitor;
    }());
    function flattenStatements(arg, output) {
        if (isArray(arg)) {
            arg.forEach(function (entry) { return flattenStatements(entry, output); });
        }
        else {
            output.push(arg);
        }
    }
    var CompileBinding = (function () {
        function CompileBinding(node, sourceAst) {
            this.node = node;
            this.sourceAst = sourceAst;
        }
        return CompileBinding;
    }());
    function createBindFieldExpr(exprIndex) {
        return THIS_EXPR.prop("_expr_" + exprIndex);
    }
    function createCurrValueExpr(exprIndex) {
        return variable("currVal_" + exprIndex); // fix syntax highlighting: `
    }
    function bind(view, currValExpr, fieldExpr, parsedExpression, context, actions, method) {
        var checkExpression = convertCdExpressionToIr(view, context, parsedExpression, DetectChangesVars.valUnwrapper);
        if (isBlank(checkExpression.expression)) {
            // e.g. an empty expression was given
            return;
        }
        // private is fine here as no child view will reference the cached value...
        view.fields.push(new ClassField(fieldExpr.name, null, [StmtModifier.Private]));
        view.createMethod.addStmt(THIS_EXPR.prop(fieldExpr.name).set(importExpr(Identifiers.uninitialized)).toStmt());
        if (checkExpression.needsValueUnwrapper) {
            var initValueUnwrapperStmt = DetectChangesVars.valUnwrapper.callMethod('reset', []).toStmt();
            method.addStmt(initValueUnwrapperStmt);
        }
        method.addStmt(currValExpr.set(checkExpression.expression).toDeclStmt(null, [StmtModifier.Final]));
        var condition = importExpr(Identifiers.checkBinding)
            .callFn([DetectChangesVars.throwOnChange, fieldExpr, currValExpr]);
        if (checkExpression.needsValueUnwrapper) {
            condition = DetectChangesVars.valUnwrapper.prop('hasWrappedValue').or(condition);
        }
        method.addStmt(new IfStmt(condition, actions.concat([THIS_EXPR.prop(fieldExpr.name).set(currValExpr).toStmt()])));
    }
    function bindRenderText(boundText, compileNode, view) {
        var bindingIndex = view.bindings.length;
        view.bindings.push(new CompileBinding(compileNode, boundText));
        var currValExpr = createCurrValueExpr(bindingIndex);
        var valueField = createBindFieldExpr(bindingIndex);
        view.detectChangesRenderPropertiesMethod.resetDebugInfo(compileNode.nodeIndex, boundText);
        bind(view, currValExpr, valueField, boundText.value, view.componentContext, [
            THIS_EXPR.prop('renderer')
                .callMethod('setText', [compileNode.renderNode, currValExpr])
                .toStmt()
        ], view.detectChangesRenderPropertiesMethod);
    }
    function bindAndWriteToRenderer(boundProps, context, compileElement) {
        var view = compileElement.view;
        var renderNode = compileElement.renderNode;
        boundProps.forEach(function (boundProp) {
            var bindingIndex = view.bindings.length;
            view.bindings.push(new CompileBinding(compileElement, boundProp));
            view.detectChangesRenderPropertiesMethod.resetDebugInfo(compileElement.nodeIndex, boundProp);
            var fieldExpr = createBindFieldExpr(bindingIndex);
            var currValExpr = createCurrValueExpr(bindingIndex);
            var renderMethod;
            var renderValue = sanitizedValue(boundProp, currValExpr);
            var updateStmts = [];
            switch (boundProp.type) {
                case exports.PropertyBindingType.Property:
                    renderMethod = 'setElementProperty';
                    if (view.genConfig.logBindingUpdate) {
                        updateStmts.push(logBindingUpdateStmt(renderNode, boundProp.name, currValExpr));
                    }
                    break;
                case exports.PropertyBindingType.Attribute:
                    renderMethod = 'setElementAttribute';
                    renderValue =
                        renderValue.isBlank().conditional(NULL_EXPR, renderValue.callMethod('toString', []));
                    break;
                case exports.PropertyBindingType.Class:
                    renderMethod = 'setElementClass';
                    break;
                case exports.PropertyBindingType.Style:
                    renderMethod = 'setElementStyle';
                    var strValue = renderValue.callMethod('toString', []);
                    if (isPresent(boundProp.unit)) {
                        strValue = strValue.plus(literal(boundProp.unit));
                    }
                    renderValue = renderValue.isBlank().conditional(NULL_EXPR, strValue);
                    break;
            }
            updateStmts.push(THIS_EXPR.prop('renderer')
                .callMethod(renderMethod, [renderNode, literal(boundProp.name), renderValue])
                .toStmt());
            bind(view, currValExpr, fieldExpr, boundProp.value, context, updateStmts, view.detectChangesRenderPropertiesMethod);
        });
    }
    function sanitizedValue(boundProp, renderValue) {
        var enumValue;
        switch (boundProp.securityContext) {
            case SecurityContext.NONE:
                return renderValue; // No sanitization needed.
            case SecurityContext.HTML:
                enumValue = 'HTML';
                break;
            case SecurityContext.STYLE:
                enumValue = 'STYLE';
                break;
            case SecurityContext.SCRIPT:
                enumValue = 'SCRIPT';
                break;
            case SecurityContext.URL:
                enumValue = 'URL';
                break;
            case SecurityContext.RESOURCE_URL:
                enumValue = 'RESOURCE_URL';
                break;
            default:
                throw new Error("internal error, unexpected SecurityContext " + boundProp.securityContext + ".");
        }
        var ctx = ViewProperties.viewUtils.prop('sanitizer');
        var args = [importExpr(Identifiers.SecurityContext).prop(enumValue), renderValue];
        return ctx.callMethod('sanitize', args);
    }
    function bindRenderInputs(boundProps, compileElement) {
        bindAndWriteToRenderer(boundProps, compileElement.view.componentContext, compileElement);
    }
    function bindDirectiveHostProps(directiveAst, directiveInstance, compileElement) {
        bindAndWriteToRenderer(directiveAst.hostProperties, directiveInstance, compileElement);
    }
    function bindDirectiveInputs(directiveAst, directiveInstance, compileElement) {
        if (directiveAst.inputs.length === 0) {
            return;
        }
        var view = compileElement.view;
        var detectChangesInInputsMethod = view.detectChangesInInputsMethod;
        detectChangesInInputsMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        var lifecycleHooks = directiveAst.directive.lifecycleHooks;
        var calcChangesMap = lifecycleHooks.indexOf(LifecycleHooks.OnChanges) !== -1;
        var isOnPushComp = directiveAst.directive.isComponent &&
            !isDefaultChangeDetectionStrategy(directiveAst.directive.changeDetection);
        if (calcChangesMap) {
            detectChangesInInputsMethod.addStmt(DetectChangesVars.changes.set(NULL_EXPR).toStmt());
        }
        if (isOnPushComp) {
            detectChangesInInputsMethod.addStmt(DetectChangesVars.changed.set(literal(false)).toStmt());
        }
        directiveAst.inputs.forEach(function (input) {
            var bindingIndex = view.bindings.length;
            view.bindings.push(new CompileBinding(compileElement, input));
            detectChangesInInputsMethod.resetDebugInfo(compileElement.nodeIndex, input);
            var fieldExpr = createBindFieldExpr(bindingIndex);
            var currValExpr = createCurrValueExpr(bindingIndex);
            var statements = [directiveInstance.prop(input.directiveName).set(currValExpr).toStmt()];
            if (calcChangesMap) {
                statements.push(new IfStmt(DetectChangesVars.changes.identical(NULL_EXPR), [
                    DetectChangesVars.changes.set(literalMap([], new MapType(importType(Identifiers.SimpleChange))))
                        .toStmt()
                ]));
                statements.push(DetectChangesVars.changes.key(literal(input.directiveName))
                    .set(importExpr(Identifiers.SimpleChange).instantiate([fieldExpr, currValExpr]))
                    .toStmt());
            }
            if (isOnPushComp) {
                statements.push(DetectChangesVars.changed.set(literal(true)).toStmt());
            }
            if (view.genConfig.logBindingUpdate) {
                statements.push(logBindingUpdateStmt(compileElement.renderNode, input.directiveName, currValExpr));
            }
            bind(view, currValExpr, fieldExpr, input.value, view.componentContext, statements, detectChangesInInputsMethod);
        });
        if (isOnPushComp) {
            detectChangesInInputsMethod.addStmt(new IfStmt(DetectChangesVars.changed, [
                compileElement.appElement.prop('componentView')
                    .callMethod('markAsCheckOnce', [])
                    .toStmt()
            ]));
        }
    }
    function logBindingUpdateStmt(renderNode, propName, value) {
        return THIS_EXPR.prop('renderer')
            .callMethod('setBindingDebugInfo', [
                renderNode,
                literal("ng-reflect-" + camelCaseToDashCase(propName)),
                value.isBlank().conditional(NULL_EXPR, value.callMethod('toString', []))
            ])
            .toStmt();
    }
    var CompileEventListener = (function () {
        function CompileEventListener(compileElement, eventTarget, eventName, listenerIndex) {
            this.compileElement = compileElement;
            this.eventTarget = eventTarget;
            this.eventName = eventName;
            this._hasComponentHostListener = false;
            this._actionResultExprs = [];
            this._method = new CompileMethod(compileElement.view);
            this._methodName =
                "_handle_" + santitizeEventName(eventName) + "_" + compileElement.nodeIndex + "_" + listenerIndex;
            this._eventParam =
                new FnParam(EventHandlerVars.event.name, importType(this.compileElement.view.genConfig.renderTypes.renderEvent));
        }
        CompileEventListener.getOrCreate = function (compileElement, eventTarget, eventName, targetEventListeners) {
            var listener = targetEventListeners.find(function (listener) { return listener.eventTarget == eventTarget &&
                listener.eventName == eventName; });
            if (isBlank(listener)) {
                listener = new CompileEventListener(compileElement, eventTarget, eventName, targetEventListeners.length);
                targetEventListeners.push(listener);
            }
            return listener;
        };
        CompileEventListener.prototype.addAction = function (hostEvent, directive, directiveInstance) {
            if (isPresent(directive) && directive.isComponent) {
                this._hasComponentHostListener = true;
            }
            this._method.resetDebugInfo(this.compileElement.nodeIndex, hostEvent);
            var context = isPresent(directiveInstance) ? directiveInstance :
                this.compileElement.view.componentContext;
            var actionStmts = convertCdStatementToIr(this.compileElement.view, context, hostEvent.handler);
            var lastIndex = actionStmts.length - 1;
            if (lastIndex >= 0) {
                var lastStatement = actionStmts[lastIndex];
                var returnExpr = convertStmtIntoExpression(lastStatement);
                var preventDefaultVar = variable("pd_" + this._actionResultExprs.length);
                this._actionResultExprs.push(preventDefaultVar);
                if (isPresent(returnExpr)) {
                    // Note: We need to cast the result of the method call to dynamic,
                    // as it might be a void method!
                    actionStmts[lastIndex] =
                        preventDefaultVar.set(returnExpr.cast(DYNAMIC_TYPE).notIdentical(literal(false)))
                            .toDeclStmt(null, [StmtModifier.Final]);
                }
            }
            this._method.addStmts(actionStmts);
        };
        CompileEventListener.prototype.finishMethod = function () {
            var markPathToRootStart = this._hasComponentHostListener ?
                this.compileElement.appElement.prop('componentView') :
                THIS_EXPR;
            var resultExpr = literal(true);
            this._actionResultExprs.forEach(function (expr) { resultExpr = resultExpr.and(expr); });
            var stmts = [markPathToRootStart.callMethod('markPathToRootAsCheckOnce', []).toStmt()]
                .concat(this._method.finish())
                .concat([new ReturnStatement(resultExpr)]);
            // private is fine here as no child view will reference the event handler...
            this.compileElement.view.eventHandlerMethods.push(new ClassMethod(this._methodName, [this._eventParam], stmts, BOOL_TYPE, [StmtModifier.Private]));
        };
        CompileEventListener.prototype.listenToRenderer = function () {
            var listenExpr;
            var eventListener = THIS_EXPR.callMethod('eventHandler', [THIS_EXPR.prop(this._methodName).callMethod(BuiltinMethod.bind, [THIS_EXPR])]);
            if (isPresent(this.eventTarget)) {
                listenExpr = ViewProperties.renderer.callMethod('listenGlobal', [literal(this.eventTarget), literal(this.eventName), eventListener]);
            }
            else {
                listenExpr = ViewProperties.renderer.callMethod('listen', [this.compileElement.renderNode, literal(this.eventName), eventListener]);
            }
            var disposable = variable("disposable_" + this.compileElement.view.disposables.length);
            this.compileElement.view.disposables.push(disposable);
            // private is fine here as no child view will reference the event handler...
            this.compileElement.view.createMethod.addStmt(disposable.set(listenExpr).toDeclStmt(FUNCTION_TYPE, [StmtModifier.Private]));
        };
        CompileEventListener.prototype.listenToDirective = function (directiveInstance, observablePropName) {
            var subscription = variable("subscription_" + this.compileElement.view.subscriptions.length);
            this.compileElement.view.subscriptions.push(subscription);
            var eventListener = THIS_EXPR.callMethod('eventHandler', [THIS_EXPR.prop(this._methodName).callMethod(BuiltinMethod.bind, [THIS_EXPR])]);
            this.compileElement.view.createMethod.addStmt(subscription.set(directiveInstance.prop(observablePropName)
                .callMethod(BuiltinMethod.SubscribeObservable, [eventListener]))
                .toDeclStmt(null, [StmtModifier.Final]));
        };
        return CompileEventListener;
    }());
    function collectEventListeners(hostEvents, dirs, compileElement) {
        var eventListeners = [];
        hostEvents.forEach(function (hostEvent) {
            compileElement.view.bindings.push(new CompileBinding(compileElement, hostEvent));
            var listener = CompileEventListener.getOrCreate(compileElement, hostEvent.target, hostEvent.name, eventListeners);
            listener.addAction(hostEvent, null, null);
        });
        ListWrapper.forEachWithIndex(dirs, function (directiveAst, i) {
            var directiveInstance = compileElement.directiveInstances[i];
            directiveAst.hostEvents.forEach(function (hostEvent) {
                compileElement.view.bindings.push(new CompileBinding(compileElement, hostEvent));
                var listener = CompileEventListener.getOrCreate(compileElement, hostEvent.target, hostEvent.name, eventListeners);
                listener.addAction(hostEvent, directiveAst.directive, directiveInstance);
            });
        });
        eventListeners.forEach(function (listener) { return listener.finishMethod(); });
        return eventListeners;
    }
    function bindDirectiveOutputs(directiveAst, directiveInstance, eventListeners) {
        StringMapWrapper.forEach(directiveAst.directive.outputs, function (eventName, observablePropName) {
            eventListeners.filter(function (listener) { return listener.eventName == eventName; })
                .forEach(function (listener) { listener.listenToDirective(directiveInstance, observablePropName); });
        });
    }
    function bindRenderOutputs(eventListeners) {
        eventListeners.forEach(function (listener) { return listener.listenToRenderer(); });
    }
    function convertStmtIntoExpression(stmt) {
        if (stmt instanceof ExpressionStatement) {
            return stmt.expr;
        }
        else if (stmt instanceof ReturnStatement) {
            return stmt.value;
        }
        return null;
    }
    function santitizeEventName(name) {
        return StringWrapper.replaceAll(name, /[^a-zA-Z_]/g, '_');
    }
    var STATE_IS_NEVER_CHECKED = THIS_EXPR.prop('cdState').identical(ChangeDetectorStateEnum.NeverChecked);
    var NOT_THROW_ON_CHANGES = not(DetectChangesVars.throwOnChange);
    function bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement) {
        var view = compileElement.view;
        var detectChangesInInputsMethod = view.detectChangesInInputsMethod;
        var lifecycleHooks = directiveAst.directive.lifecycleHooks;
        if (lifecycleHooks.indexOf(LifecycleHooks.OnChanges) !== -1 && directiveAst.inputs.length > 0) {
            detectChangesInInputsMethod.addStmt(new IfStmt(DetectChangesVars.changes.notIdentical(NULL_EXPR), [directiveInstance.callMethod('ngOnChanges', [DetectChangesVars.changes]).toStmt()]));
        }
        if (lifecycleHooks.indexOf(LifecycleHooks.OnInit) !== -1) {
            detectChangesInInputsMethod.addStmt(new IfStmt(STATE_IS_NEVER_CHECKED.and(NOT_THROW_ON_CHANGES), [directiveInstance.callMethod('ngOnInit', []).toStmt()]));
        }
        if (lifecycleHooks.indexOf(LifecycleHooks.DoCheck) !== -1) {
            detectChangesInInputsMethod.addStmt(new IfStmt(NOT_THROW_ON_CHANGES, [directiveInstance.callMethod('ngDoCheck', []).toStmt()]));
        }
    }
    function bindDirectiveAfterContentLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
        var view = compileElement.view;
        var lifecycleHooks = directiveMeta.lifecycleHooks;
        var afterContentLifecycleCallbacksMethod = view.afterContentLifecycleCallbacksMethod;
        afterContentLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        if (lifecycleHooks.indexOf(LifecycleHooks.AfterContentInit) !== -1) {
            afterContentLifecycleCallbacksMethod.addStmt(new IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterContentInit', []).toStmt()]));
        }
        if (lifecycleHooks.indexOf(LifecycleHooks.AfterContentChecked) !== -1) {
            afterContentLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterContentChecked', []).toStmt());
        }
    }
    function bindDirectiveAfterViewLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
        var view = compileElement.view;
        var lifecycleHooks = directiveMeta.lifecycleHooks;
        var afterViewLifecycleCallbacksMethod = view.afterViewLifecycleCallbacksMethod;
        afterViewLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        if (lifecycleHooks.indexOf(LifecycleHooks.AfterViewInit) !== -1) {
            afterViewLifecycleCallbacksMethod.addStmt(new IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterViewInit', []).toStmt()]));
        }
        if (lifecycleHooks.indexOf(LifecycleHooks.AfterViewChecked) !== -1) {
            afterViewLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterViewChecked', []).toStmt());
        }
    }
    function bindDirectiveDestroyLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
        var onDestroyMethod = compileElement.view.destroyMethod;
        onDestroyMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
        if (directiveMeta.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1) {
            onDestroyMethod.addStmt(directiveInstance.callMethod('ngOnDestroy', []).toStmt());
        }
    }
    function bindPipeDestroyLifecycleCallbacks(pipeMeta, pipeInstance, view) {
        var onDestroyMethod = view.destroyMethod;
        if (pipeMeta.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1) {
            onDestroyMethod.addStmt(pipeInstance.callMethod('ngOnDestroy', []).toStmt());
        }
    }
    function bindView(view, parsedTemplate) {
        var visitor = new ViewBinderVisitor(view);
        templateVisitAll(visitor, parsedTemplate);
        view.pipes.forEach(function (pipe) { bindPipeDestroyLifecycleCallbacks(pipe.meta, pipe.instance, pipe.view); });
    }
    var ViewBinderVisitor = (function () {
        function ViewBinderVisitor(view) {
            this.view = view;
            this._nodeIndex = 0;
        }
        ViewBinderVisitor.prototype.visitBoundText = function (ast, parent) {
            var node = this.view.nodes[this._nodeIndex++];
            bindRenderText(ast, node, this.view);
            return null;
        };
        ViewBinderVisitor.prototype.visitText = function (ast, parent) {
            this._nodeIndex++;
            return null;
        };
        ViewBinderVisitor.prototype.visitNgContent = function (ast, parent) { return null; };
        ViewBinderVisitor.prototype.visitElement = function (ast, parent) {
            var compileElement = this.view.nodes[this._nodeIndex++];
            var eventListeners = collectEventListeners(ast.outputs, ast.directives, compileElement);
            bindRenderInputs(ast.inputs, compileElement);
            bindRenderOutputs(eventListeners);
            ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
                var directiveInstance = compileElement.directiveInstances[index];
                bindDirectiveInputs(directiveAst, directiveInstance, compileElement);
                bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement);
                bindDirectiveHostProps(directiveAst, directiveInstance, compileElement);
                bindDirectiveOutputs(directiveAst, directiveInstance, eventListeners);
            });
            templateVisitAll(this, ast.children, compileElement);
            // afterContent and afterView lifecycles need to be called bottom up
            // so that children are notified before parents
            ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
                var directiveInstance = compileElement.directiveInstances[index];
                bindDirectiveAfterContentLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
                bindDirectiveAfterViewLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
                bindDirectiveDestroyLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            });
            return null;
        };
        ViewBinderVisitor.prototype.visitEmbeddedTemplate = function (ast, parent) {
            var compileElement = this.view.nodes[this._nodeIndex++];
            var eventListeners = collectEventListeners(ast.outputs, ast.directives, compileElement);
            ListWrapper.forEachWithIndex(ast.directives, function (directiveAst, index) {
                var directiveInstance = compileElement.directiveInstances[index];
                bindDirectiveInputs(directiveAst, directiveInstance, compileElement);
                bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement);
                bindDirectiveOutputs(directiveAst, directiveInstance, eventListeners);
                bindDirectiveAfterContentLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
                bindDirectiveAfterViewLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
                bindDirectiveDestroyLifecycleCallbacks(directiveAst.directive, directiveInstance, compileElement);
            });
            bindView(compileElement.embeddedView, ast.children);
            return null;
        };
        ViewBinderVisitor.prototype.visitAttr = function (ast, ctx) { return null; };
        ViewBinderVisitor.prototype.visitDirective = function (ast, ctx) { return null; };
        ViewBinderVisitor.prototype.visitEvent = function (ast, eventTargetAndNames) {
            return null;
        };
        ViewBinderVisitor.prototype.visitReference = function (ast, ctx) { return null; };
        ViewBinderVisitor.prototype.visitVariable = function (ast, ctx) { return null; };
        ViewBinderVisitor.prototype.visitDirectiveProperty = function (ast, context) { return null; };
        ViewBinderVisitor.prototype.visitElementProperty = function (ast, context) { return null; };
        return ViewBinderVisitor;
    }());
    var ViewCompileResult = (function () {
        function ViewCompileResult(statements, viewFactoryVar, dependencies) {
            this.statements = statements;
            this.viewFactoryVar = viewFactoryVar;
            this.dependencies = dependencies;
        }
        return ViewCompileResult;
    }());
    var ViewCompiler = (function () {
        function ViewCompiler(_genConfig) {
            this._genConfig = _genConfig;
        }
        ViewCompiler.prototype.compileComponent = function (component, template, styles, pipes) {
            var statements = [];
            var dependencies = [];
            var view = new CompileView(component, this._genConfig, pipes, styles, 0, CompileElement.createNull(), []);
            buildView(view, template, dependencies);
            // Need to separate binding from creation to be able to refer to
            // variables that have been declared after usage.
            bindView(view, template);
            finishView(view, statements);
            return new ViewCompileResult(statements, view.viewFactory.name, dependencies);
        };
        return ViewCompiler;
    }());
    ViewCompiler.decorators = [
        { type: _angular_core.Injectable },
    ];
    ViewCompiler.ctorParameters = [
        { type: CompilerConfig, },
    ];
    // TODO: vsavkin rename it into TemplateLoader
    /**
     * An interface for retrieving documents by URL that the compiler uses
     * to load templates.
     */
    var XHR = (function () {
        function XHR() {
        }
        XHR.prototype.get = function (url) { return null; };
        return XHR;
    }());
    var DirectiveNormalizer = (function () {
        function DirectiveNormalizer(_xhr, _urlResolver, _htmlParser) {
            this._xhr = _xhr;
            this._urlResolver = _urlResolver;
            this._htmlParser = _htmlParser;
        }
        DirectiveNormalizer.prototype.normalizeDirective = function (directive) {
            if (!directive.isComponent) {
                // For non components there is nothing to be normalized yet.
                return PromiseWrapper.resolve(directive);
            }
            return this.normalizeTemplate(directive.type, directive.template)
                .then(function (normalizedTemplate) { return new CompileDirectiveMetadata({
                    type: directive.type,
                    isComponent: directive.isComponent,
                    selector: directive.selector,
                    exportAs: directive.exportAs,
                    changeDetection: directive.changeDetection,
                    inputs: directive.inputs,
                    outputs: directive.outputs,
                    hostListeners: directive.hostListeners,
                    hostProperties: directive.hostProperties,
                    hostAttributes: directive.hostAttributes,
                    lifecycleHooks: directive.lifecycleHooks,
                    providers: directive.providers,
                    viewProviders: directive.viewProviders,
                    queries: directive.queries,
                    viewQueries: directive.viewQueries,
                    template: normalizedTemplate
                }); });
        };
        DirectiveNormalizer.prototype.normalizeTemplate = function (directiveType, template) {
            var _this = this;
            if (isPresent(template.template)) {
                return PromiseWrapper.resolve(this.normalizeLoadedTemplate(directiveType, template, template.template, directiveType.moduleUrl));
            }
            else if (isPresent(template.templateUrl)) {
                var sourceAbsUrl = this._urlResolver.resolve(directiveType.moduleUrl, template.templateUrl);
                return this._xhr.get(sourceAbsUrl)
                    .then(function (templateContent) { return _this.normalizeLoadedTemplate(directiveType, template, templateContent, sourceAbsUrl); });
            }
            else {
                throw new BaseException$1("No template specified for component " + directiveType.name);
            }
        };
        DirectiveNormalizer.prototype.normalizeLoadedTemplate = function (directiveType, templateMeta, template, templateAbsUrl) {
            var _this = this;
            var rootNodesAndErrors = this._htmlParser.parse(template, directiveType.name);
            if (rootNodesAndErrors.errors.length > 0) {
                var errorString = rootNodesAndErrors.errors.join('\n');
                throw new BaseException$1("Template parse errors:\n" + errorString);
            }
            var visitor = new TemplatePreparseVisitor();
            htmlVisitAll(visitor, rootNodesAndErrors.rootNodes);
            var allStyles = templateMeta.styles.concat(visitor.styles);
            var allStyleAbsUrls = visitor.styleUrls.filter(isStyleUrlResolvable)
                .map(function (url) { return _this._urlResolver.resolve(templateAbsUrl, url); })
                .concat(templateMeta.styleUrls.filter(isStyleUrlResolvable)
                    .map(function (url) { return _this._urlResolver.resolve(directiveType.moduleUrl, url); }));
            var allResolvedStyles = allStyles.map(function (style) {
                var styleWithImports = extractStyleUrls(_this._urlResolver, templateAbsUrl, style);
                styleWithImports.styleUrls.forEach(function (styleUrl) { return allStyleAbsUrls.push(styleUrl); });
                return styleWithImports.style;
            });
            var encapsulation = templateMeta.encapsulation;
            if (encapsulation === _angular_core.ViewEncapsulation.Emulated && allResolvedStyles.length === 0 &&
                allStyleAbsUrls.length === 0) {
                encapsulation = _angular_core.ViewEncapsulation.None;
            }
            return new CompileTemplateMetadata({
                encapsulation: encapsulation,
                template: template,
                templateUrl: templateAbsUrl,
                styles: allResolvedStyles,
                styleUrls: allStyleAbsUrls,
                ngContentSelectors: visitor.ngContentSelectors
            });
        };
        return DirectiveNormalizer;
    }());
    DirectiveNormalizer.decorators = [
        { type: _angular_core.Injectable },
    ];
    DirectiveNormalizer.ctorParameters = [
        { type: XHR, },
        { type: UrlResolver, },
        { type: HtmlParser, },
    ];
    var TemplatePreparseVisitor = (function () {
        function TemplatePreparseVisitor() {
            this.ngContentSelectors = [];
            this.styles = [];
            this.styleUrls = [];
            this.ngNonBindableStackCount = 0;
        }
        TemplatePreparseVisitor.prototype.visitElement = function (ast, context) {
            var preparsedElement = preparseElement(ast);
            switch (preparsedElement.type) {
                case PreparsedElementType.NG_CONTENT:
                    if (this.ngNonBindableStackCount === 0) {
                        this.ngContentSelectors.push(preparsedElement.selectAttr);
                    }
                    break;
                case PreparsedElementType.STYLE:
                    var textContent = '';
                    ast.children.forEach(function (child) {
                        if (child instanceof HtmlTextAst) {
                            textContent += child.value;
                        }
                    });
                    this.styles.push(textContent);
                    break;
                case PreparsedElementType.STYLESHEET:
                    this.styleUrls.push(preparsedElement.hrefAttr);
                    break;
                default:
                    // DDC reports this as error. See:
                    // https://github.com/dart-lang/dev_compiler/issues/428
                    break;
            }
            if (preparsedElement.nonBindable) {
                this.ngNonBindableStackCount++;
            }
            htmlVisitAll(this, ast.children);
            if (preparsedElement.nonBindable) {
                this.ngNonBindableStackCount--;
            }
            return null;
        };
        TemplatePreparseVisitor.prototype.visitComment = function (ast, context) { return null; };
        TemplatePreparseVisitor.prototype.visitAttr = function (ast, context) { return null; };
        TemplatePreparseVisitor.prototype.visitText = function (ast, context) { return null; };
        TemplatePreparseVisitor.prototype.visitExpansion = function (ast, context) { return null; };
        TemplatePreparseVisitor.prototype.visitExpansionCase = function (ast, context) { return null; };
        return TemplatePreparseVisitor;
    }());
    function _isDirectiveMetadata(type) {
        return type instanceof _angular_core.DirectiveMetadata;
    }
    var DirectiveResolver = (function () {
        function DirectiveResolver(_reflector) {
            if (isPresent(_reflector)) {
                this._reflector = _reflector;
            }
            else {
                this._reflector = _angular_core.reflector;
            }
        }
        /**
         * Return {@link DirectiveMetadata} for a given `Type`.
         */
        DirectiveResolver.prototype.resolve = function (type) {
            var typeMetadata = this._reflector.annotations(_angular_core.resolveForwardRef(type));
            if (isPresent(typeMetadata)) {
                var metadata = typeMetadata.find(_isDirectiveMetadata);
                if (isPresent(metadata)) {
                    var propertyMetadata = this._reflector.propMetadata(type);
                    return this._mergeWithPropertyMetadata(metadata, propertyMetadata, type);
                }
            }
            throw new BaseException$1("No Directive annotation found on " + stringify(type));
        };
        DirectiveResolver.prototype._mergeWithPropertyMetadata = function (dm, propertyMetadata, directiveType) {
            var inputs = [];
            var outputs = [];
            var host = {};
            var queries = {};
            StringMapWrapper.forEach(propertyMetadata, function (metadata, propName) {
                metadata.forEach(function (a) {
                    if (a instanceof _angular_core.InputMetadata) {
                        if (isPresent(a.bindingPropertyName)) {
                            inputs.push(propName + ": " + a.bindingPropertyName);
                        }
                        else {
                            inputs.push(propName);
                        }
                    }
                    if (a instanceof _angular_core.OutputMetadata) {
                        if (isPresent(a.bindingPropertyName)) {
                            outputs.push(propName + ": " + a.bindingPropertyName);
                        }
                        else {
                            outputs.push(propName);
                        }
                    }
                    if (a instanceof _angular_core.HostBindingMetadata) {
                        if (isPresent(a.hostPropertyName)) {
                            host[("[" + a.hostPropertyName + "]")] = propName;
                        }
                        else {
                            host[("[" + propName + "]")] = propName;
                        }
                    }
                    if (a instanceof _angular_core.HostListenerMetadata) {
                        var args = isPresent(a.args) ? a.args.join(', ') : '';
                        host[("(" + a.eventName + ")")] = propName + "(" + args + ")";
                    }
                    if (a instanceof _angular_core.ContentChildrenMetadata) {
                        queries[propName] = a;
                    }
                    if (a instanceof _angular_core.ViewChildrenMetadata) {
                        queries[propName] = a;
                    }
                    if (a instanceof _angular_core.ContentChildMetadata) {
                        queries[propName] = a;
                    }
                    if (a instanceof _angular_core.ViewChildMetadata) {
                        queries[propName] = a;
                    }
                });
            });
            return this._merge(dm, inputs, outputs, host, queries, directiveType);
        };
        DirectiveResolver.prototype._merge = function (dm, inputs, outputs, host, queries, directiveType) {
            var mergedInputs = isPresent(dm.inputs) ? ListWrapper.concat(dm.inputs, inputs) : inputs;
            var mergedOutputs;
            if (isPresent(dm.outputs)) {
                dm.outputs.forEach(function (propName) {
                    if (ListWrapper.contains(outputs, propName)) {
                        throw new BaseException$1("Output event '" + propName + "' defined multiple times in '" + stringify(directiveType) + "'");
                    }
                });
                mergedOutputs = ListWrapper.concat(dm.outputs, outputs);
            }
            else {
                mergedOutputs = outputs;
            }
            var mergedHost = isPresent(dm.host) ? StringMapWrapper.merge(dm.host, host) : host;
            var mergedQueries = isPresent(dm.queries) ? StringMapWrapper.merge(dm.queries, queries) : queries;
            if (dm instanceof _angular_core.ComponentMetadata) {
                return new _angular_core.ComponentMetadata({
                    selector: dm.selector,
                    inputs: mergedInputs,
                    outputs: mergedOutputs,
                    host: mergedHost,
                    exportAs: dm.exportAs,
                    moduleId: dm.moduleId,
                    queries: mergedQueries,
                    changeDetection: dm.changeDetection,
                    providers: dm.providers,
                    viewProviders: dm.viewProviders
                });
            }
            else {
                return new _angular_core.DirectiveMetadata({
                    selector: dm.selector,
                    inputs: mergedInputs,
                    outputs: mergedOutputs,
                    host: mergedHost,
                    exportAs: dm.exportAs,
                    queries: mergedQueries,
                    providers: dm.providers
                });
            }
        };
        return DirectiveResolver;
    }());
    DirectiveResolver.decorators = [
        { type: _angular_core.Injectable },
    ];
    DirectiveResolver.ctorParameters = [
        { type: ReflectorReader, },
    ];
    var CODEGEN_DIRECTIVE_RESOLVER = new DirectiveResolver(_angular_core.reflector);
    function _isPipeMetadata(type) {
        return type instanceof _angular_core.PipeMetadata;
    }
    var PipeResolver = (function () {
        function PipeResolver(_reflector) {
            if (isPresent(_reflector)) {
                this._reflector = _reflector;
            }
            else {
                this._reflector = _angular_core.reflector;
            }
        }
        /**
         * Return {@link PipeMetadata} for a given `Type`.
         */
        PipeResolver.prototype.resolve = function (type) {
            var metas = this._reflector.annotations(_angular_core.resolveForwardRef(type));
            if (isPresent(metas)) {
                var annotation = metas.find(_isPipeMetadata);
                if (isPresent(annotation)) {
                    return annotation;
                }
            }
            throw new BaseException$1("No Pipe decorator found on " + stringify(type));
        };
        return PipeResolver;
    }());
    PipeResolver.decorators = [
        { type: _angular_core.Injectable },
    ];
    PipeResolver.ctorParameters = [
        { type: ReflectorReader, },
    ];
    var CODEGEN_PIPE_RESOLVER = new PipeResolver(_angular_core.reflector);
    var ViewResolver = (function () {
        function ViewResolver(_reflector) {
            /** @internal */
            this._cache = new Map$1();
            if (isPresent(_reflector)) {
                this._reflector = _reflector;
            }
            else {
                this._reflector = _angular_core.reflector;
            }
        }
        ViewResolver.prototype.resolve = function (component) {
            var view = this._cache.get(component);
            if (isBlank(view)) {
                view = this._resolve(component);
                this._cache.set(component, view);
            }
            return view;
        };
        /** @internal */
        ViewResolver.prototype._resolve = function (component) {
            var compMeta;
            var viewMeta;
            this._reflector.annotations(component).forEach(function (m) {
                if (m instanceof _angular_core.ViewMetadata) {
                    viewMeta = m;
                }
                if (m instanceof _angular_core.ComponentMetadata) {
                    compMeta = m;
                }
            });
            if (isPresent(compMeta)) {
                if (isBlank(compMeta.template) && isBlank(compMeta.templateUrl) && isBlank(viewMeta)) {
                    throw new BaseException$1("Component '" + stringify(component) + "' must have either 'template' or 'templateUrl' set.");
                }
                else if (isPresent(compMeta.template) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("template", component);
                }
                else if (isPresent(compMeta.templateUrl) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("templateUrl", component);
                }
                else if (isPresent(compMeta.directives) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("directives", component);
                }
                else if (isPresent(compMeta.pipes) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("pipes", component);
                }
                else if (isPresent(compMeta.encapsulation) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("encapsulation", component);
                }
                else if (isPresent(compMeta.styles) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("styles", component);
                }
                else if (isPresent(compMeta.styleUrls) && isPresent(viewMeta)) {
                    this._throwMixingViewAndComponent("styleUrls", component);
                }
                else if (isPresent(viewMeta)) {
                    return viewMeta;
                }
                else {
                    return new _angular_core.ViewMetadata({
                        templateUrl: compMeta.templateUrl,
                        template: compMeta.template,
                        directives: compMeta.directives,
                        pipes: compMeta.pipes,
                        encapsulation: compMeta.encapsulation,
                        styles: compMeta.styles,
                        styleUrls: compMeta.styleUrls
                    });
                }
            }
            else {
                if (isBlank(viewMeta)) {
                    throw new BaseException$1("Could not compile '" + stringify(component) + "' because it is not a component.");
                }
                else {
                    return viewMeta;
                }
            }
            return null;
        };
        /** @internal */
        ViewResolver.prototype._throwMixingViewAndComponent = function (propertyName, component) {
            throw new BaseException$1("Component '" + stringify(component) + "' cannot have both '" + propertyName + "' and '@View' set at the same time\"");
        };
        return ViewResolver;
    }());
    ViewResolver.decorators = [
        { type: _angular_core.Injectable },
    ];
    ViewResolver.ctorParameters = [
        { type: ReflectorReader, },
    ];
    function hasLifecycleHook(lcInterface, token) {
        if (!(token instanceof Type))
            return false;
        var proto = token.prototype;
        switch (lcInterface) {
            case LifecycleHooks.AfterContentInit:
                return !!proto.ngAfterContentInit;
            case LifecycleHooks.AfterContentChecked:
                return !!proto.ngAfterContentChecked;
            case LifecycleHooks.AfterViewInit:
                return !!proto.ngAfterViewInit;
            case LifecycleHooks.AfterViewChecked:
                return !!proto.ngAfterViewChecked;
            case LifecycleHooks.OnChanges:
                return !!proto.ngOnChanges;
            case LifecycleHooks.DoCheck:
                return !!proto.ngDoCheck;
            case LifecycleHooks.OnDestroy:
                return !!proto.ngOnDestroy;
            case LifecycleHooks.OnInit:
                return !!proto.ngOnInit;
            default:
                return false;
        }
    }
    function assertArrayOfStrings(identifier, value) {
        if (!assertionsEnabled() || isBlank(value)) {
            return;
        }
        if (!isArray(value)) {
            throw new BaseException$1("Expected '" + identifier + "' to be an array of strings.");
        }
        for (var i = 0; i < value.length; i += 1) {
            if (!isString(value[i])) {
                throw new BaseException$1("Expected '" + identifier + "' to be an array of strings.");
            }
        }
    }
    var CompileMetadataResolver = (function () {
        function CompileMetadataResolver(_directiveResolver, _pipeResolver, _viewResolver, _platformDirectives, _platformPipes, _reflector) {
            this._directiveResolver = _directiveResolver;
            this._pipeResolver = _pipeResolver;
            this._viewResolver = _viewResolver;
            this._platformDirectives = _platformDirectives;
            this._platformPipes = _platformPipes;
            this._directiveCache = new Map();
            this._pipeCache = new Map();
            this._anonymousTypes = new Map();
            this._anonymousTypeIndex = 0;
            if (isPresent(_reflector)) {
                this._reflector = _reflector;
            }
            else {
                this._reflector = _angular_core.reflector;
            }
        }
        CompileMetadataResolver.prototype.sanitizeTokenName = function (token) {
            var identifier = stringify(token);
            if (identifier.indexOf('(') >= 0) {
                // case: anonymous functions!
                var found = this._anonymousTypes.get(token);
                if (isBlank(found)) {
                    this._anonymousTypes.set(token, this._anonymousTypeIndex++);
                    found = this._anonymousTypes.get(token);
                }
                identifier = "anonymous_token_" + found + "_";
            }
            return sanitizeIdentifier(identifier);
        };
        CompileMetadataResolver.prototype.getDirectiveMetadata = function (directiveType) {
            var meta = this._directiveCache.get(directiveType);
            if (isBlank(meta)) {
                var dirMeta = this._directiveResolver.resolve(directiveType);
                var templateMeta = null;
                var changeDetectionStrategy = null;
                var viewProviders = [];
                var moduleUrl = staticTypeModuleUrl(directiveType);
                if (dirMeta instanceof _angular_core.ComponentMetadata) {
                    assertArrayOfStrings('styles', dirMeta.styles);
                    var cmpMeta = dirMeta;
                    var viewMeta = this._viewResolver.resolve(directiveType);
                    assertArrayOfStrings('styles', viewMeta.styles);
                    templateMeta = new CompileTemplateMetadata({
                        encapsulation: viewMeta.encapsulation,
                        template: viewMeta.template,
                        templateUrl: viewMeta.templateUrl,
                        styles: viewMeta.styles,
                        styleUrls: viewMeta.styleUrls
                    });
                    changeDetectionStrategy = cmpMeta.changeDetection;
                    if (isPresent(dirMeta.viewProviders)) {
                        viewProviders = this.getProvidersMetadata(dirMeta.viewProviders);
                    }
                    moduleUrl = componentModuleUrl(this._reflector, directiveType, cmpMeta);
                }
                var providers = [];
                if (isPresent(dirMeta.providers)) {
                    providers = this.getProvidersMetadata(dirMeta.providers);
                }
                var queries = [];
                var viewQueries = [];
                if (isPresent(dirMeta.queries)) {
                    queries = this.getQueriesMetadata(dirMeta.queries, false);
                    viewQueries = this.getQueriesMetadata(dirMeta.queries, true);
                }
                meta = CompileDirectiveMetadata.create({
                    selector: dirMeta.selector,
                    exportAs: dirMeta.exportAs,
                    isComponent: isPresent(templateMeta),
                    type: this.getTypeMetadata(directiveType, moduleUrl),
                    template: templateMeta,
                    changeDetection: changeDetectionStrategy,
                    inputs: dirMeta.inputs,
                    outputs: dirMeta.outputs,
                    host: dirMeta.host,
                    lifecycleHooks: LIFECYCLE_HOOKS_VALUES.filter(function (hook) { return hasLifecycleHook(hook, directiveType); }),
                    providers: providers,
                    viewProviders: viewProviders,
                    queries: queries,
                    viewQueries: viewQueries
                });
                this._directiveCache.set(directiveType, meta);
            }
            return meta;
        };
        /**
         * @param someType a symbol which may or may not be a directive type
         * @returns {cpl.CompileDirectiveMetadata} if possible, otherwise null.
         */
        CompileMetadataResolver.prototype.maybeGetDirectiveMetadata = function (someType) {
            try {
                return this.getDirectiveMetadata(someType);
            }
            catch (e) {
                if (e.message.indexOf('No Directive annotation') !== -1) {
                    return null;
                }
                throw e;
            }
        };
        CompileMetadataResolver.prototype.getTypeMetadata = function (type, moduleUrl) {
            return new CompileTypeMetadata({
                name: this.sanitizeTokenName(type),
                moduleUrl: moduleUrl,
                runtime: type,
                diDeps: this.getDependenciesMetadata(type, null)
            });
        };
        CompileMetadataResolver.prototype.getFactoryMetadata = function (factory, moduleUrl) {
            return new CompileFactoryMetadata({
                name: this.sanitizeTokenName(factory),
                moduleUrl: moduleUrl,
                runtime: factory,
                diDeps: this.getDependenciesMetadata(factory, null)
            });
        };
        CompileMetadataResolver.prototype.getPipeMetadata = function (pipeType) {
            var meta = this._pipeCache.get(pipeType);
            if (isBlank(meta)) {
                var pipeMeta = this._pipeResolver.resolve(pipeType);
                meta = new CompilePipeMetadata({
                    type: this.getTypeMetadata(pipeType, staticTypeModuleUrl(pipeType)),
                    name: pipeMeta.name,
                    pure: pipeMeta.pure,
                    lifecycleHooks: LIFECYCLE_HOOKS_VALUES.filter(function (hook) { return hasLifecycleHook(hook, pipeType); }),
                });
                this._pipeCache.set(pipeType, meta);
            }
            return meta;
        };
        CompileMetadataResolver.prototype.getViewDirectivesMetadata = function (component) {
            var _this = this;
            var view = this._viewResolver.resolve(component);
            var directives = flattenDirectives(view, this._platformDirectives);
            for (var i = 0; i < directives.length; i++) {
                if (!isValidType(directives[i])) {
                    throw new BaseException$1("Unexpected directive value '" + stringify(directives[i]) + "' on the View of component '" + stringify(component) + "'");
                }
            }
            return directives.map(function (type) { return _this.getDirectiveMetadata(type); });
        };
        CompileMetadataResolver.prototype.getViewPipesMetadata = function (component) {
            var _this = this;
            var view = this._viewResolver.resolve(component);
            var pipes = flattenPipes(view, this._platformPipes);
            for (var i = 0; i < pipes.length; i++) {
                if (!isValidType(pipes[i])) {
                    throw new BaseException$1("Unexpected piped value '" + stringify(pipes[i]) + "' on the View of component '" + stringify(component) + "'");
                }
            }
            return pipes.map(function (type) { return _this.getPipeMetadata(type); });
        };
        CompileMetadataResolver.prototype.getDependenciesMetadata = function (typeOrFunc, dependencies) {
            var _this = this;
            var params = isPresent(dependencies) ? dependencies : this._reflector.parameters(typeOrFunc);
            if (isBlank(params)) {
                params = [];
            }
            return params.map(function (param) {
                if (isBlank(param)) {
                    return null;
                }
                var isAttribute = false;
                var isHost = false;
                var isSelf = false;
                var isSkipSelf = false;
                var isOptional = false;
                var query = null;
                var viewQuery = null;
                var token = null;
                if (isArray(param)) {
                    param
                        .forEach(function (paramEntry) {
                            if (paramEntry instanceof _angular_core.HostMetadata) {
                                isHost = true;
                            }
                            else if (paramEntry instanceof _angular_core.SelfMetadata) {
                                isSelf = true;
                            }
                            else if (paramEntry instanceof _angular_core.SkipSelfMetadata) {
                                isSkipSelf = true;
                            }
                            else if (paramEntry instanceof _angular_core.OptionalMetadata) {
                                isOptional = true;
                            }
                            else if (paramEntry instanceof _angular_core.AttributeMetadata) {
                                isAttribute = true;
                                token = paramEntry.attributeName;
                            }
                            else if (paramEntry instanceof _angular_core.QueryMetadata) {
                                if (paramEntry.isViewQuery) {
                                    viewQuery = paramEntry;
                                }
                                else {
                                    query = paramEntry;
                                }
                            }
                            else if (paramEntry instanceof _angular_core.InjectMetadata) {
                                token = paramEntry.token;
                            }
                            else if (isValidType(paramEntry) && isBlank(token)) {
                                token = paramEntry;
                            }
                        });
                }
                else {
                    token = param;
                }
                if (isBlank(token)) {
                    return null;
                }
                return new CompileDiDependencyMetadata({
                    isAttribute: isAttribute,
                    isHost: isHost,
                    isSelf: isSelf,
                    isSkipSelf: isSkipSelf,
                    isOptional: isOptional,
                    query: isPresent(query) ? _this.getQueryMetadata(query, null) : null,
                    viewQuery: isPresent(viewQuery) ? _this.getQueryMetadata(viewQuery, null) : null,
                    token: _this.getTokenMetadata(token)
                });
            });
        };
        CompileMetadataResolver.prototype.getTokenMetadata = function (token) {
            token = _angular_core.resolveForwardRef(token);
            var compileToken;
            if (isString(token)) {
                compileToken = new CompileTokenMetadata({ value: token });
            }
            else {
                compileToken = new CompileTokenMetadata({
                    identifier: new CompileIdentifierMetadata({
                        runtime: token,
                        name: this.sanitizeTokenName(token),
                        moduleUrl: staticTypeModuleUrl(token)
                    })
                });
            }
            return compileToken;
        };
        CompileMetadataResolver.prototype.getProvidersMetadata = function (providers) {
            var _this = this;
            return providers.map(function (provider) {
                provider = _angular_core.resolveForwardRef(provider);
                if (isArray(provider)) {
                    return _this.getProvidersMetadata(provider);
                }
                else if (provider instanceof _angular_core.Provider) {
                    return _this.getProviderMetadata(provider);
                }
                else if (isProviderLiteral(provider)) {
                    return _this.getProviderMetadata(createProvider(provider));
                }
                else {
                    return _this.getTypeMetadata(provider, staticTypeModuleUrl(provider));
                }
            });
        };
        CompileMetadataResolver.prototype.getProviderMetadata = function (provider) {
            var compileDeps;
            if (isPresent(provider.useClass)) {
                compileDeps = this.getDependenciesMetadata(provider.useClass, provider.dependencies);
            }
            else if (isPresent(provider.useFactory)) {
                compileDeps = this.getDependenciesMetadata(provider.useFactory, provider.dependencies);
            }
            return new CompileProviderMetadata({
                token: this.getTokenMetadata(provider.token),
                useClass: isPresent(provider.useClass) ?
                    this.getTypeMetadata(provider.useClass, staticTypeModuleUrl(provider.useClass)) :
                    null,
                useValue: convertToCompileValue(provider.useValue),
                useFactory: isPresent(provider.useFactory) ?
                    this.getFactoryMetadata(provider.useFactory, staticTypeModuleUrl(provider.useFactory)) :
                    null,
                useExisting: isPresent(provider.useExisting) ? this.getTokenMetadata(provider.useExisting) :
                    null,
                deps: compileDeps,
                multi: provider.multi
            });
        };
        CompileMetadataResolver.prototype.getQueriesMetadata = function (queries, isViewQuery) {
            var _this = this;
            var compileQueries = [];
            StringMapWrapper.forEach(queries, function (query, propertyName) {
                if (query.isViewQuery === isViewQuery) {
                    compileQueries.push(_this.getQueryMetadata(query, propertyName));
                }
            });
            return compileQueries;
        };
        CompileMetadataResolver.prototype.getQueryMetadata = function (q, propertyName) {
            var _this = this;
            var selectors;
            if (q.isVarBindingQuery) {
                selectors = q.varBindings.map(function (varName) { return _this.getTokenMetadata(varName); });
            }
            else {
                selectors = [this.getTokenMetadata(q.selector)];
            }
            return new CompileQueryMetadata({
                selectors: selectors,
                first: q.first,
                descendants: q.descendants,
                propertyName: propertyName,
                read: isPresent(q.read) ? this.getTokenMetadata(q.read) : null
            });
        };
        return CompileMetadataResolver;
    }());
    CompileMetadataResolver.decorators = [
        { type: _angular_core.Injectable },
    ];
    CompileMetadataResolver.ctorParameters = [
        { type: DirectiveResolver, },
        { type: PipeResolver, },
        { type: ViewResolver, },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.PLATFORM_DIRECTIVES,] },] },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_core.PLATFORM_PIPES,] },] },
        { type: ReflectorReader, },
    ];
    function flattenDirectives(view, platformDirectives) {
        var directives = [];
        if (isPresent(platformDirectives)) {
            flattenArray(platformDirectives, directives);
        }
        if (isPresent(view.directives)) {
            flattenArray(view.directives, directives);
        }
        return directives;
    }
    function flattenPipes(view, platformPipes) {
        var pipes = [];
        if (isPresent(platformPipes)) {
            flattenArray(platformPipes, pipes);
        }
        if (isPresent(view.pipes)) {
            flattenArray(view.pipes, pipes);
        }
        return pipes;
    }
    function flattenArray(tree, out) {
        for (var i = 0; i < tree.length; i++) {
            var item = _angular_core.resolveForwardRef(tree[i]);
            if (isArray(item)) {
                flattenArray(item, out);
            }
            else {
                out.push(item);
            }
        }
    }
    function isStaticType(value) {
        return isStringMap(value) && isPresent(value['name']) && isPresent(value['filePath']);
    }
    function isValidType(value) {
        return isStaticType(value) || (value instanceof Type);
    }
    function staticTypeModuleUrl(value) {
        return isStaticType(value) ? value['filePath'] : null;
    }
    function componentModuleUrl(reflector, type, cmpMetadata) {
        if (isStaticType(type)) {
            return staticTypeModuleUrl(type);
        }
        if (isPresent(cmpMetadata.moduleId)) {
            var moduleId = cmpMetadata.moduleId;
            var scheme = getUrlScheme(moduleId);
            return isPresent(scheme) && scheme.length > 0 ? moduleId :
            "package:" + moduleId + MODULE_SUFFIX;
        }
        return reflector.importUri(type);
    }
    // Only fill CompileIdentifierMetadata.runtime if needed...
    function convertToCompileValue(value) {
        return visitValue(value, new _CompileValueConverter(), null);
    }
    var _CompileValueConverter = (function (_super) {
        __extends(_CompileValueConverter, _super);
        function _CompileValueConverter() {
            _super.apply(this, arguments);
        }
        _CompileValueConverter.prototype.visitOther = function (value, context) {
            if (isStaticType(value)) {
                return new CompileIdentifierMetadata({ name: value['name'], moduleUrl: staticTypeModuleUrl(value) });
            }
            else {
                return new CompileIdentifierMetadata({ runtime: value });
            }
        };
        return _CompileValueConverter;
    }(ValueTransformer));
    var _SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
    var CATCH_ERROR_VAR$1 = variable('error');
    var CATCH_STACK_VAR$1 = variable('stack');
    var _EmittedLine = (function () {
        function _EmittedLine(indent) {
            this.indent = indent;
            this.parts = [];
        }
        return _EmittedLine;
    }());
    var EmitterVisitorContext = (function () {
        function EmitterVisitorContext(_exportedVars, _indent) {
            this._exportedVars = _exportedVars;
            this._indent = _indent;
            this._classes = [];
            this._lines = [new _EmittedLine(_indent)];
        }
        EmitterVisitorContext.createRoot = function (exportedVars) {
            return new EmitterVisitorContext(exportedVars, 0);
        };
        Object.defineProperty(EmitterVisitorContext.prototype, "_currentLine", {
            get: function () { return this._lines[this._lines.length - 1]; },
            enumerable: true,
            configurable: true
        });
        EmitterVisitorContext.prototype.isExportedVar = function (varName) { return this._exportedVars.indexOf(varName) !== -1; };
        EmitterVisitorContext.prototype.println = function (lastPart) {
            if (lastPart === void 0) { lastPart = ''; }
            this.print(lastPart, true);
        };
        EmitterVisitorContext.prototype.lineIsEmpty = function () { return this._currentLine.parts.length === 0; };
        EmitterVisitorContext.prototype.print = function (part, newLine) {
            if (newLine === void 0) { newLine = false; }
            if (part.length > 0) {
                this._currentLine.parts.push(part);
            }
            if (newLine) {
                this._lines.push(new _EmittedLine(this._indent));
            }
        };
        EmitterVisitorContext.prototype.removeEmptyLastLine = function () {
            if (this.lineIsEmpty()) {
                this._lines.pop();
            }
        };
        EmitterVisitorContext.prototype.incIndent = function () {
            this._indent++;
            this._currentLine.indent = this._indent;
        };
        EmitterVisitorContext.prototype.decIndent = function () {
            this._indent--;
            this._currentLine.indent = this._indent;
        };
        EmitterVisitorContext.prototype.pushClass = function (clazz) { this._classes.push(clazz); };
        EmitterVisitorContext.prototype.popClass = function () { return this._classes.pop(); };
        Object.defineProperty(EmitterVisitorContext.prototype, "currentClass", {
            get: function () {
                return this._classes.length > 0 ? this._classes[this._classes.length - 1] : null;
            },
            enumerable: true,
            configurable: true
        });
        EmitterVisitorContext.prototype.toSource = function () {
            var lines = this._lines;
            if (lines[lines.length - 1].parts.length === 0) {
                lines = lines.slice(0, lines.length - 1);
            }
            return lines.map(function (line) {
                if (line.parts.length > 0) {
                    return _createIndent(line.indent) + line.parts.join('');
                }
                else {
                    return '';
                }
            })
                .join('\n');
        };
        return EmitterVisitorContext;
    }());
    var AbstractEmitterVisitor = (function () {
        function AbstractEmitterVisitor(_escapeDollarInStrings) {
            this._escapeDollarInStrings = _escapeDollarInStrings;
        }
        AbstractEmitterVisitor.prototype.visitExpressionStmt = function (stmt, ctx) {
            stmt.expr.visitExpression(this, ctx);
            ctx.println(';');
            return null;
        };
        AbstractEmitterVisitor.prototype.visitReturnStmt = function (stmt, ctx) {
            ctx.print("return ");
            stmt.value.visitExpression(this, ctx);
            ctx.println(';');
            return null;
        };
        AbstractEmitterVisitor.prototype.visitIfStmt = function (stmt, ctx) {
            ctx.print("if (");
            stmt.condition.visitExpression(this, ctx);
            ctx.print(") {");
            var hasElseCase = isPresent(stmt.falseCase) && stmt.falseCase.length > 0;
            if (stmt.trueCase.length <= 1 && !hasElseCase) {
                ctx.print(" ");
                this.visitAllStatements(stmt.trueCase, ctx);
                ctx.removeEmptyLastLine();
                ctx.print(" ");
            }
            else {
                ctx.println();
                ctx.incIndent();
                this.visitAllStatements(stmt.trueCase, ctx);
                ctx.decIndent();
                if (hasElseCase) {
                    ctx.println("} else {");
                    ctx.incIndent();
                    this.visitAllStatements(stmt.falseCase, ctx);
                    ctx.decIndent();
                }
            }
            ctx.println("}");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitThrowStmt = function (stmt, ctx) {
            ctx.print("throw ");
            stmt.error.visitExpression(this, ctx);
            ctx.println(";");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitCommentStmt = function (stmt, ctx) {
            var lines = stmt.comment.split('\n');
            lines.forEach(function (line) { ctx.println("// " + line); });
            return null;
        };
        AbstractEmitterVisitor.prototype.visitWriteVarExpr = function (expr, ctx) {
            var lineWasEmpty = ctx.lineIsEmpty();
            if (!lineWasEmpty) {
                ctx.print('(');
            }
            ctx.print(expr.name + " = ");
            expr.value.visitExpression(this, ctx);
            if (!lineWasEmpty) {
                ctx.print(')');
            }
            return null;
        };
        AbstractEmitterVisitor.prototype.visitWriteKeyExpr = function (expr, ctx) {
            var lineWasEmpty = ctx.lineIsEmpty();
            if (!lineWasEmpty) {
                ctx.print('(');
            }
            expr.receiver.visitExpression(this, ctx);
            ctx.print("[");
            expr.index.visitExpression(this, ctx);
            ctx.print("] = ");
            expr.value.visitExpression(this, ctx);
            if (!lineWasEmpty) {
                ctx.print(')');
            }
            return null;
        };
        AbstractEmitterVisitor.prototype.visitWritePropExpr = function (expr, ctx) {
            var lineWasEmpty = ctx.lineIsEmpty();
            if (!lineWasEmpty) {
                ctx.print('(');
            }
            expr.receiver.visitExpression(this, ctx);
            ctx.print("." + expr.name + " = ");
            expr.value.visitExpression(this, ctx);
            if (!lineWasEmpty) {
                ctx.print(')');
            }
            return null;
        };
        AbstractEmitterVisitor.prototype.visitInvokeMethodExpr = function (expr, ctx) {
            expr.receiver.visitExpression(this, ctx);
            var name = expr.name;
            if (isPresent(expr.builtin)) {
                name = this.getBuiltinMethodName(expr.builtin);
                if (isBlank(name)) {
                    // some builtins just mean to skip the call.
                    // e.g. `bind` in Dart.
                    return null;
                }
            }
            ctx.print("." + name + "(");
            this.visitAllExpressions(expr.args, ctx, ",");
            ctx.print(")");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
            expr.fn.visitExpression(this, ctx);
            ctx.print("(");
            this.visitAllExpressions(expr.args, ctx, ',');
            ctx.print(")");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
            var varName = ast.name;
            if (isPresent(ast.builtin)) {
                switch (ast.builtin) {
                    case BuiltinVar.Super:
                        varName = 'super';
                        break;
                    case BuiltinVar.This:
                        varName = 'this';
                        break;
                    case BuiltinVar.CatchError:
                        varName = CATCH_ERROR_VAR$1.name;
                        break;
                    case BuiltinVar.CatchStack:
                        varName = CATCH_STACK_VAR$1.name;
                        break;
                    default:
                        throw new BaseException$1("Unknown builtin variable " + ast.builtin);
                }
            }
            ctx.print(varName);
            return null;
        };
        AbstractEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
            ctx.print("new ");
            ast.classExpr.visitExpression(this, ctx);
            ctx.print("(");
            this.visitAllExpressions(ast.args, ctx, ',');
            ctx.print(")");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitLiteralExpr = function (ast, ctx) {
            var value = ast.value;
            if (isString(value)) {
                ctx.print(escapeSingleQuoteString(value, this._escapeDollarInStrings));
            }
            else if (isBlank(value)) {
                ctx.print('null');
            }
            else {
                ctx.print("" + value);
            }
            return null;
        };
        AbstractEmitterVisitor.prototype.visitConditionalExpr = function (ast, ctx) {
            ctx.print("(");
            ast.condition.visitExpression(this, ctx);
            ctx.print('? ');
            ast.trueCase.visitExpression(this, ctx);
            ctx.print(': ');
            ast.falseCase.visitExpression(this, ctx);
            ctx.print(")");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitNotExpr = function (ast, ctx) {
            ctx.print('!');
            ast.condition.visitExpression(this, ctx);
            return null;
        };
        AbstractEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
            var opStr;
            switch (ast.operator) {
                case BinaryOperator.Equals:
                    opStr = '==';
                    break;
                case BinaryOperator.Identical:
                    opStr = '===';
                    break;
                case BinaryOperator.NotEquals:
                    opStr = '!=';
                    break;
                case BinaryOperator.NotIdentical:
                    opStr = '!==';
                    break;
                case BinaryOperator.And:
                    opStr = '&&';
                    break;
                case BinaryOperator.Or:
                    opStr = '||';
                    break;
                case BinaryOperator.Plus:
                    opStr = '+';
                    break;
                case BinaryOperator.Minus:
                    opStr = '-';
                    break;
                case BinaryOperator.Divide:
                    opStr = '/';
                    break;
                case BinaryOperator.Multiply:
                    opStr = '*';
                    break;
                case BinaryOperator.Modulo:
                    opStr = '%';
                    break;
                case BinaryOperator.Lower:
                    opStr = '<';
                    break;
                case BinaryOperator.LowerEquals:
                    opStr = '<=';
                    break;
                case BinaryOperator.Bigger:
                    opStr = '>';
                    break;
                case BinaryOperator.BiggerEquals:
                    opStr = '>=';
                    break;
                default:
                    throw new BaseException$1("Unknown operator " + ast.operator);
            }
            ctx.print("(");
            ast.lhs.visitExpression(this, ctx);
            ctx.print(" " + opStr + " ");
            ast.rhs.visitExpression(this, ctx);
            ctx.print(")");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitReadPropExpr = function (ast, ctx) {
            ast.receiver.visitExpression(this, ctx);
            ctx.print(".");
            ctx.print(ast.name);
            return null;
        };
        AbstractEmitterVisitor.prototype.visitReadKeyExpr = function (ast, ctx) {
            ast.receiver.visitExpression(this, ctx);
            ctx.print("[");
            ast.index.visitExpression(this, ctx);
            ctx.print("]");
            return null;
        };
        AbstractEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
            var useNewLine = ast.entries.length > 1;
            ctx.print("[", useNewLine);
            ctx.incIndent();
            this.visitAllExpressions(ast.entries, ctx, ',', useNewLine);
            ctx.decIndent();
            ctx.print("]", useNewLine);
            return null;
        };
        AbstractEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
            var _this = this;
            var useNewLine = ast.entries.length > 1;
            ctx.print("{", useNewLine);
            ctx.incIndent();
            this.visitAllObjects(function (entry) {
                ctx.print(escapeSingleQuoteString(entry[0], _this._escapeDollarInStrings) + ": ");
                entry[1].visitExpression(_this, ctx);
            }, ast.entries, ctx, ',', useNewLine);
            ctx.decIndent();
            ctx.print("}", useNewLine);
            return null;
        };
        AbstractEmitterVisitor.prototype.visitAllExpressions = function (expressions, ctx, separator, newLine) {
            var _this = this;
            if (newLine === void 0) { newLine = false; }
            this.visitAllObjects(function (expr) { return expr.visitExpression(_this, ctx); }, expressions, ctx, separator, newLine);
        };
        AbstractEmitterVisitor.prototype.visitAllObjects = function (handler, expressions, ctx, separator, newLine) {
            if (newLine === void 0) { newLine = false; }
            for (var i = 0; i < expressions.length; i++) {
                if (i > 0) {
                    ctx.print(separator, newLine);
                }
                handler(expressions[i]);
            }
            if (newLine) {
                ctx.println();
            }
        };
        AbstractEmitterVisitor.prototype.visitAllStatements = function (statements, ctx) {
            var _this = this;
            statements.forEach(function (stmt) { return stmt.visitStatement(_this, ctx); });
        };
        return AbstractEmitterVisitor;
    }());
    function escapeSingleQuoteString(input, escapeDollar) {
        if (isBlank(input)) {
            return null;
        }
        var body = StringWrapper.replaceAllMapped(input, _SINGLE_QUOTE_ESCAPE_STRING_RE, function (match) {
            if (match[0] == '$') {
                return escapeDollar ? '\\$' : '$';
            }
            else if (match[0] == '\n') {
                return '\\n';
            }
            else if (match[0] == '\r') {
                return '\\r';
            }
            else {
                return "\\" + match[0];
            }
        });
        return "'" + body + "'";
    }
    function _createIndent(count) {
        var res = '';
        for (var i = 0; i < count; i++) {
            res += '  ';
        }
        return res;
    }
    var AbstractJsEmitterVisitor = (function (_super) {
        __extends(AbstractJsEmitterVisitor, _super);
        function AbstractJsEmitterVisitor() {
            _super.call(this, false);
        }
        AbstractJsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
            var _this = this;
            ctx.pushClass(stmt);
            this._visitClassConstructor(stmt, ctx);
            if (isPresent(stmt.parent)) {
                ctx.print(stmt.name + ".prototype = Object.create(");
                stmt.parent.visitExpression(this, ctx);
                ctx.println(".prototype);");
            }
            stmt.getters.forEach(function (getter) { return _this._visitClassGetter(stmt, getter, ctx); });
            stmt.methods.forEach(function (method) { return _this._visitClassMethod(stmt, method, ctx); });
            ctx.popClass();
            return null;
        };
        AbstractJsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
            ctx.print("function " + stmt.name + "(");
            if (isPresent(stmt.constructorMethod)) {
                this._visitParams(stmt.constructorMethod.params, ctx);
            }
            ctx.println(") {");
            ctx.incIndent();
            if (isPresent(stmt.constructorMethod)) {
                if (stmt.constructorMethod.body.length > 0) {
                    ctx.println("var self = this;");
                    this.visitAllStatements(stmt.constructorMethod.body, ctx);
                }
            }
            ctx.decIndent();
            ctx.println("}");
        };
        AbstractJsEmitterVisitor.prototype._visitClassGetter = function (stmt, getter, ctx) {
            ctx.println("Object.defineProperty(" + stmt.name + ".prototype, '" + getter.name + "', { get: function() {");
            ctx.incIndent();
            if (getter.body.length > 0) {
                ctx.println("var self = this;");
                this.visitAllStatements(getter.body, ctx);
            }
            ctx.decIndent();
            ctx.println("}});");
        };
        AbstractJsEmitterVisitor.prototype._visitClassMethod = function (stmt, method, ctx) {
            ctx.print(stmt.name + ".prototype." + method.name + " = function(");
            this._visitParams(method.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            if (method.body.length > 0) {
                ctx.println("var self = this;");
                this.visitAllStatements(method.body, ctx);
            }
            ctx.decIndent();
            ctx.println("};");
        };
        AbstractJsEmitterVisitor.prototype.visitReadVarExpr = function (ast, ctx) {
            if (ast.builtin === BuiltinVar.This) {
                ctx.print('self');
            }
            else if (ast.builtin === BuiltinVar.Super) {
                throw new BaseException$1("'super' needs to be handled at a parent ast node, not at the variable level!");
            }
            else {
                _super.prototype.visitReadVarExpr.call(this, ast, ctx);
            }
            return null;
        };
        AbstractJsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
            ctx.print("var " + stmt.name + " = ");
            stmt.value.visitExpression(this, ctx);
            ctx.println(";");
            return null;
        };
        AbstractJsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
            ast.value.visitExpression(this, ctx);
            return null;
        };
        AbstractJsEmitterVisitor.prototype.visitInvokeFunctionExpr = function (expr, ctx) {
            var fnExpr = expr.fn;
            if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
                ctx.currentClass.parent.visitExpression(this, ctx);
                ctx.print(".call(this");
                if (expr.args.length > 0) {
                    ctx.print(", ");
                    this.visitAllExpressions(expr.args, ctx, ',');
                }
                ctx.print(")");
            }
            else {
                _super.prototype.visitInvokeFunctionExpr.call(this, expr, ctx);
            }
            return null;
        };
        AbstractJsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
            ctx.print("function(");
            this._visitParams(ast.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            this.visitAllStatements(ast.statements, ctx);
            ctx.decIndent();
            ctx.print("}");
            return null;
        };
        AbstractJsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
            ctx.print("function " + stmt.name + "(");
            this._visitParams(stmt.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            this.visitAllStatements(stmt.statements, ctx);
            ctx.decIndent();
            ctx.println("}");
            return null;
        };
        AbstractJsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
            ctx.println("try {");
            ctx.incIndent();
            this.visitAllStatements(stmt.bodyStmts, ctx);
            ctx.decIndent();
            ctx.println("} catch (" + CATCH_ERROR_VAR$1.name + ") {");
            ctx.incIndent();
            var catchStmts = [
                CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack'))
                    .toDeclStmt(null, [StmtModifier.Final])
            ].concat(stmt.catchStmts);
            this.visitAllStatements(catchStmts, ctx);
            ctx.decIndent();
            ctx.println("}");
            return null;
        };
        AbstractJsEmitterVisitor.prototype._visitParams = function (params, ctx) {
            this.visitAllObjects(function (param) { return ctx.print(param.name); }, params, ctx, ',');
        };
        AbstractJsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
            var name;
            switch (method) {
                case BuiltinMethod.ConcatArray:
                    name = 'concat';
                    break;
                case BuiltinMethod.SubscribeObservable:
                    name = 'subscribe';
                    break;
                case BuiltinMethod.bind:
                    name = 'bind';
                    break;
                default:
                    throw new BaseException$1("Unknown builtin method: " + method);
            }
            return name;
        };
        return AbstractJsEmitterVisitor;
    }(AbstractEmitterVisitor));
    function jitStatements(sourceUrl, statements, resultVar) {
        var converter = new JitEmitterVisitor();
        var ctx = EmitterVisitorContext.createRoot([resultVar]);
        converter.visitAllStatements(statements, ctx);
        return evalExpression(sourceUrl, resultVar, ctx.toSource(), converter.getArgs());
    }
    var JitEmitterVisitor = (function (_super) {
        __extends(JitEmitterVisitor, _super);
        function JitEmitterVisitor() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.apply(this, args);
            this._evalArgNames = [];
            this._evalArgValues = [];
        }
        JitEmitterVisitor.prototype.getArgs = function () {
            var result = {};
            for (var i = 0; i < this._evalArgNames.length; i++) {
                result[this._evalArgNames[i]] = this._evalArgValues[i];
            }
            return result;
        };
        JitEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
            var value = ast.value.runtime;
            var id = this._evalArgValues.indexOf(value);
            if (id === -1) {
                id = this._evalArgValues.length;
                this._evalArgValues.push(value);
                var name = isPresent(ast.value.name) ? sanitizeIdentifier(ast.value.name) : 'val';
                this._evalArgNames.push(sanitizeIdentifier("jit_" + name + id));
            }
            ctx.print(this._evalArgNames[id]);
            return null;
        };
        return JitEmitterVisitor;
    }(AbstractJsEmitterVisitor));
    var _debugModuleUrl = 'asset://debug/lib';
    function debugOutputAstAsDart(ast) {
        var converter = new _DartEmitterVisitor(_debugModuleUrl);
        var ctx = EmitterVisitorContext.createRoot([]);
        var asts;
        if (isArray(ast)) {
            asts = ast;
        }
        else {
            asts = [ast];
        }
        asts.forEach(function (ast) {
            if (ast instanceof Statement) {
                ast.visitStatement(converter, ctx);
            }
            else if (ast instanceof Expression) {
                ast.visitExpression(converter, ctx);
            }
            else if (ast instanceof Type$1) {
                ast.visitType(converter, ctx);
            }
            else {
                throw new BaseException$1("Don't know how to print debug info for " + ast);
            }
        });
        return ctx.toSource();
    }
    var _DartEmitterVisitor = (function (_super) {
        __extends(_DartEmitterVisitor, _super);
        function _DartEmitterVisitor(_moduleUrl) {
            _super.call(this, true);
            this._moduleUrl = _moduleUrl;
            this.importsWithPrefixes = new Map();
        }
        _DartEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
            this._visitIdentifier(ast.value, ast.typeParams, ctx);
            return null;
        };
        _DartEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
            if (stmt.hasModifier(StmtModifier.Final)) {
                if (isConstType(stmt.type)) {
                    ctx.print("const ");
                }
                else {
                    ctx.print("final ");
                }
            }
            else if (isBlank(stmt.type)) {
                ctx.print("var ");
            }
            if (isPresent(stmt.type)) {
                stmt.type.visitType(this, ctx);
                ctx.print(" ");
            }
            ctx.print(stmt.name + " = ");
            stmt.value.visitExpression(this, ctx);
            ctx.println(";");
            return null;
        };
        _DartEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
            ctx.print("(");
            ast.value.visitExpression(this, ctx);
            ctx.print(" as ");
            ast.type.visitType(this, ctx);
            ctx.print(")");
            return null;
        };
        _DartEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
            var _this = this;
            ctx.pushClass(stmt);
            ctx.print("class " + stmt.name);
            if (isPresent(stmt.parent)) {
                ctx.print(" extends ");
                stmt.parent.visitExpression(this, ctx);
            }
            ctx.println(" {");
            ctx.incIndent();
            stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
            if (isPresent(stmt.constructorMethod)) {
                this._visitClassConstructor(stmt, ctx);
            }
            stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
            stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
            ctx.decIndent();
            ctx.println("}");
            ctx.popClass();
            return null;
        };
        _DartEmitterVisitor.prototype._visitClassField = function (field, ctx) {
            if (field.hasModifier(StmtModifier.Final)) {
                ctx.print("final ");
            }
            else if (isBlank(field.type)) {
                ctx.print("var ");
            }
            if (isPresent(field.type)) {
                field.type.visitType(this, ctx);
                ctx.print(" ");
            }
            ctx.println(field.name + ";");
        };
        _DartEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
            if (isPresent(getter.type)) {
                getter.type.visitType(this, ctx);
                ctx.print(" ");
            }
            ctx.println("get " + getter.name + " {");
            ctx.incIndent();
            this.visitAllStatements(getter.body, ctx);
            ctx.decIndent();
            ctx.println("}");
        };
        _DartEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
            ctx.print(stmt.name + "(");
            this._visitParams(stmt.constructorMethod.params, ctx);
            ctx.print(")");
            var ctorStmts = stmt.constructorMethod.body;
            var superCtorExpr = ctorStmts.length > 0 ? getSuperConstructorCallExpr(ctorStmts[0]) : null;
            if (isPresent(superCtorExpr)) {
                ctx.print(": ");
                superCtorExpr.visitExpression(this, ctx);
                ctorStmts = ctorStmts.slice(1);
            }
            ctx.println(" {");
            ctx.incIndent();
            this.visitAllStatements(ctorStmts, ctx);
            ctx.decIndent();
            ctx.println("}");
        };
        _DartEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
            if (isPresent(method.type)) {
                method.type.visitType(this, ctx);
            }
            else {
                ctx.print("void");
            }
            ctx.print(" " + method.name + "(");
            this._visitParams(method.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            this.visitAllStatements(method.body, ctx);
            ctx.decIndent();
            ctx.println("}");
        };
        _DartEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
            ctx.print("(");
            this._visitParams(ast.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            this.visitAllStatements(ast.statements, ctx);
            ctx.decIndent();
            ctx.print("}");
            return null;
        };
        _DartEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
            if (isPresent(stmt.type)) {
                stmt.type.visitType(this, ctx);
            }
            else {
                ctx.print("void");
            }
            ctx.print(" " + stmt.name + "(");
            this._visitParams(stmt.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            this.visitAllStatements(stmt.statements, ctx);
            ctx.decIndent();
            ctx.println("}");
            return null;
        };
        _DartEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
            var name;
            switch (method) {
                case BuiltinMethod.ConcatArray:
                    name = '.addAll';
                    break;
                case BuiltinMethod.SubscribeObservable:
                    name = 'listen';
                    break;
                case BuiltinMethod.bind:
                    name = null;
                    break;
                default:
                    throw new BaseException$1("Unknown builtin method: " + method);
            }
            return name;
        };
        _DartEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
            ctx.println("try {");
            ctx.incIndent();
            this.visitAllStatements(stmt.bodyStmts, ctx);
            ctx.decIndent();
            ctx.println("} catch (" + CATCH_ERROR_VAR$1.name + ", " + CATCH_STACK_VAR$1.name + ") {");
            ctx.incIndent();
            this.visitAllStatements(stmt.catchStmts, ctx);
            ctx.decIndent();
            ctx.println("}");
            return null;
        };
        _DartEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
            switch (ast.operator) {
                case BinaryOperator.Identical:
                    ctx.print("identical(");
                    ast.lhs.visitExpression(this, ctx);
                    ctx.print(", ");
                    ast.rhs.visitExpression(this, ctx);
                    ctx.print(")");
                    break;
                case BinaryOperator.NotIdentical:
                    ctx.print("!identical(");
                    ast.lhs.visitExpression(this, ctx);
                    ctx.print(", ");
                    ast.rhs.visitExpression(this, ctx);
                    ctx.print(")");
                    break;
                default:
                    _super.prototype.visitBinaryOperatorExpr.call(this, ast, ctx);
            }
            return null;
        };
        _DartEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
            if (isConstType(ast.type)) {
                ctx.print("const ");
            }
            return _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
        };
        _DartEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
            if (isConstType(ast.type)) {
                ctx.print("const ");
            }
            if (isPresent(ast.valueType)) {
                ctx.print("<String, ");
                ast.valueType.visitType(this, ctx);
                ctx.print(">");
            }
            return _super.prototype.visitLiteralMapExpr.call(this, ast, ctx);
        };
        _DartEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
            ctx.print(isConstType(ast.type) ? "const" : "new");
            ctx.print(' ');
            ast.classExpr.visitExpression(this, ctx);
            ctx.print("(");
            this.visitAllExpressions(ast.args, ctx, ",");
            ctx.print(")");
            return null;
        };
        _DartEmitterVisitor.prototype.visitBuiltintType = function (type, ctx) {
            var typeStr;
            switch (type.name) {
                case BuiltinTypeName.Bool:
                    typeStr = 'bool';
                    break;
                case BuiltinTypeName.Dynamic:
                    typeStr = 'dynamic';
                    break;
                case BuiltinTypeName.Function:
                    typeStr = 'Function';
                    break;
                case BuiltinTypeName.Number:
                    typeStr = 'num';
                    break;
                case BuiltinTypeName.Int:
                    typeStr = 'int';
                    break;
                case BuiltinTypeName.String:
                    typeStr = 'String';
                    break;
                default:
                    throw new BaseException$1("Unsupported builtin type " + type.name);
            }
            ctx.print(typeStr);
            return null;
        };
        _DartEmitterVisitor.prototype.visitExternalType = function (ast, ctx) {
            this._visitIdentifier(ast.value, ast.typeParams, ctx);
            return null;
        };
        _DartEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
            ctx.print("List<");
            if (isPresent(type.of)) {
                type.of.visitType(this, ctx);
            }
            else {
                ctx.print("dynamic");
            }
            ctx.print(">");
            return null;
        };
        _DartEmitterVisitor.prototype.visitMapType = function (type, ctx) {
            ctx.print("Map<String, ");
            if (isPresent(type.valueType)) {
                type.valueType.visitType(this, ctx);
            }
            else {
                ctx.print("dynamic");
            }
            ctx.print(">");
            return null;
        };
        _DartEmitterVisitor.prototype._visitParams = function (params, ctx) {
            var _this = this;
            this.visitAllObjects(function (param) {
                if (isPresent(param.type)) {
                    param.type.visitType(_this, ctx);
                    ctx.print(' ');
                }
                ctx.print(param.name);
            }, params, ctx, ',');
        };
        _DartEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
            var _this = this;
            if (isBlank(value.name)) {
                throw new BaseException$1("Internal error: unknown identifier " + value);
            }
            if (isPresent(value.moduleUrl) && value.moduleUrl != this._moduleUrl) {
                var prefix = this.importsWithPrefixes.get(value.moduleUrl);
                if (isBlank(prefix)) {
                    prefix = "import" + this.importsWithPrefixes.size;
                    this.importsWithPrefixes.set(value.moduleUrl, prefix);
                }
                ctx.print(prefix + ".");
            }
            ctx.print(value.name);
            if (isPresent(typeParams) && typeParams.length > 0) {
                ctx.print("<");
                this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, typeParams, ctx, ',');
                ctx.print(">");
            }
        };
        return _DartEmitterVisitor;
    }(AbstractEmitterVisitor));
    function getSuperConstructorCallExpr(stmt) {
        if (stmt instanceof ExpressionStatement) {
            var expr = stmt.expr;
            if (expr instanceof InvokeFunctionExpr) {
                var fn = expr.fn;
                if (fn instanceof ReadVarExpr) {
                    if (fn.builtin === BuiltinVar.Super) {
                        return expr;
                    }
                }
            }
        }
        return null;
    }
    function isConstType(type) {
        return isPresent(type) && type.hasModifier(TypeModifier.Const);
    }
    var _debugModuleUrl$1 = 'asset://debug/lib';
    function debugOutputAstAsTypeScript(ast) {
        var converter = new _TsEmitterVisitor(_debugModuleUrl$1);
        var ctx = EmitterVisitorContext.createRoot([]);
        var asts;
        if (isArray(ast)) {
            asts = ast;
        }
        else {
            asts = [ast];
        }
        asts.forEach(function (ast) {
            if (ast instanceof Statement) {
                ast.visitStatement(converter, ctx);
            }
            else if (ast instanceof Expression) {
                ast.visitExpression(converter, ctx);
            }
            else if (ast instanceof Type$1) {
                ast.visitType(converter, ctx);
            }
            else {
                throw new BaseException$1("Don't know how to print debug info for " + ast);
            }
        });
        return ctx.toSource();
    }
    var _TsEmitterVisitor = (function (_super) {
        __extends(_TsEmitterVisitor, _super);
        function _TsEmitterVisitor(_moduleUrl) {
            _super.call(this, false);
            this._moduleUrl = _moduleUrl;
            this.importsWithPrefixes = new Map();
        }
        _TsEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
            this._visitIdentifier(ast.value, ast.typeParams, ctx);
            return null;
        };
        _TsEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
            if (ctx.isExportedVar(stmt.name)) {
                ctx.print("export ");
            }
            if (stmt.hasModifier(StmtModifier.Final)) {
                ctx.print("const");
            }
            else {
                ctx.print("var");
            }
            ctx.print(" " + stmt.name);
            if (isPresent(stmt.type)) {
                ctx.print(":");
                stmt.type.visitType(this, ctx);
            }
            ctx.print(" = ");
            stmt.value.visitExpression(this, ctx);
            ctx.println(";");
            return null;
        };
        _TsEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
            ctx.print("(<");
            ast.type.visitType(this, ctx);
            ctx.print(">");
            ast.value.visitExpression(this, ctx);
            ctx.print(")");
            return null;
        };
        _TsEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
            var _this = this;
            ctx.pushClass(stmt);
            if (ctx.isExportedVar(stmt.name)) {
                ctx.print("export ");
            }
            ctx.print("class " + stmt.name);
            if (isPresent(stmt.parent)) {
                ctx.print(" extends ");
                stmt.parent.visitExpression(this, ctx);
            }
            ctx.println(" {");
            ctx.incIndent();
            stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
            if (isPresent(stmt.constructorMethod)) {
                this._visitClassConstructor(stmt, ctx);
            }
            stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
            stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
            ctx.decIndent();
            ctx.println("}");
            ctx.popClass();
            return null;
        };
        _TsEmitterVisitor.prototype._visitClassField = function (field, ctx) {
            if (field.hasModifier(StmtModifier.Private)) {
                ctx.print("private ");
            }
            ctx.print(field.name);
            if (isPresent(field.type)) {
                ctx.print(":");
                field.type.visitType(this, ctx);
            }
            else {
                ctx.print(": any");
            }
            ctx.println(";");
        };
        _TsEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
            if (getter.hasModifier(StmtModifier.Private)) {
                ctx.print("private ");
            }
            ctx.print("get " + getter.name + "()");
            if (isPresent(getter.type)) {
                ctx.print(":");
                getter.type.visitType(this, ctx);
            }
            ctx.println(" {");
            ctx.incIndent();
            this.visitAllStatements(getter.body, ctx);
            ctx.decIndent();
            ctx.println("}");
        };
        _TsEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
            ctx.print("constructor(");
            this._visitParams(stmt.constructorMethod.params, ctx);
            ctx.println(") {");
            ctx.incIndent();
            this.visitAllStatements(stmt.constructorMethod.body, ctx);
            ctx.decIndent();
            ctx.println("}");
        };
        _TsEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
            if (method.hasModifier(StmtModifier.Private)) {
                ctx.print("private ");
            }
            ctx.print(method.name + "(");
            this._visitParams(method.params, ctx);
            ctx.print("):");
            if (isPresent(method.type)) {
                method.type.visitType(this, ctx);
            }
            else {
                ctx.print("void");
            }
            ctx.println(" {");
            ctx.incIndent();
            this.visitAllStatements(method.body, ctx);
            ctx.decIndent();
            ctx.println("}");
        };
        _TsEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
            ctx.print("(");
            this._visitParams(ast.params, ctx);
            ctx.print("):");
            if (isPresent(ast.type)) {
                ast.type.visitType(this, ctx);
            }
            else {
                ctx.print("void");
            }
            ctx.println(" => {");
            ctx.incIndent();
            this.visitAllStatements(ast.statements, ctx);
            ctx.decIndent();
            ctx.print("}");
            return null;
        };
        _TsEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
            if (ctx.isExportedVar(stmt.name)) {
                ctx.print("export ");
            }
            ctx.print("function " + stmt.name + "(");
            this._visitParams(stmt.params, ctx);
            ctx.print("):");
            if (isPresent(stmt.type)) {
                stmt.type.visitType(this, ctx);
            }
            else {
                ctx.print("void");
            }
            ctx.println(" {");
            ctx.incIndent();
            this.visitAllStatements(stmt.statements, ctx);
            ctx.decIndent();
            ctx.println("}");
            return null;
        };
        _TsEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
            ctx.println("try {");
            ctx.incIndent();
            this.visitAllStatements(stmt.bodyStmts, ctx);
            ctx.decIndent();
            ctx.println("} catch (" + CATCH_ERROR_VAR$1.name + ") {");
            ctx.incIndent();
            var catchStmts = [
                CATCH_STACK_VAR$1.set(CATCH_ERROR_VAR$1.prop('stack'))
                    .toDeclStmt(null, [StmtModifier.Final])
            ].concat(stmt.catchStmts);
            this.visitAllStatements(catchStmts, ctx);
            ctx.decIndent();
            ctx.println("}");
            return null;
        };
        _TsEmitterVisitor.prototype.visitBuiltintType = function (type, ctx) {
            var typeStr;
            switch (type.name) {
                case BuiltinTypeName.Bool:
                    typeStr = 'boolean';
                    break;
                case BuiltinTypeName.Dynamic:
                    typeStr = 'any';
                    break;
                case BuiltinTypeName.Function:
                    typeStr = 'Function';
                    break;
                case BuiltinTypeName.Number:
                    typeStr = 'number';
                    break;
                case BuiltinTypeName.Int:
                    typeStr = 'number';
                    break;
                case BuiltinTypeName.String:
                    typeStr = 'string';
                    break;
                default:
                    throw new BaseException$1("Unsupported builtin type " + type.name);
            }
            ctx.print(typeStr);
            return null;
        };
        _TsEmitterVisitor.prototype.visitExternalType = function (ast, ctx) {
            this._visitIdentifier(ast.value, ast.typeParams, ctx);
            return null;
        };
        _TsEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
            if (isPresent(type.of)) {
                type.of.visitType(this, ctx);
            }
            else {
                ctx.print("any");
            }
            ctx.print("[]");
            return null;
        };
        _TsEmitterVisitor.prototype.visitMapType = function (type, ctx) {
            ctx.print("{[key: string]:");
            if (isPresent(type.valueType)) {
                type.valueType.visitType(this, ctx);
            }
            else {
                ctx.print("any");
            }
            ctx.print("}");
            return null;
        };
        _TsEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
            var name;
            switch (method) {
                case BuiltinMethod.ConcatArray:
                    name = 'concat';
                    break;
                case BuiltinMethod.SubscribeObservable:
                    name = 'subscribe';
                    break;
                case BuiltinMethod.bind:
                    name = 'bind';
                    break;
                default:
                    throw new BaseException$1("Unknown builtin method: " + method);
            }
            return name;
        };
        _TsEmitterVisitor.prototype._visitParams = function (params, ctx) {
            var _this = this;
            this.visitAllObjects(function (param) {
                ctx.print(param.name);
                if (isPresent(param.type)) {
                    ctx.print(":");
                    param.type.visitType(_this, ctx);
                }
            }, params, ctx, ',');
        };
        _TsEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
            var _this = this;
            if (isBlank(value.name)) {
                throw new BaseException$1("Internal error: unknown identifier " + value);
            }
            if (isPresent(value.moduleUrl) && value.moduleUrl != this._moduleUrl) {
                var prefix = this.importsWithPrefixes.get(value.moduleUrl);
                if (isBlank(prefix)) {
                    prefix = "import" + this.importsWithPrefixes.size;
                    this.importsWithPrefixes.set(value.moduleUrl, prefix);
                }
                ctx.print(prefix + ".");
            }
            ctx.print(value.name);
            if (isPresent(typeParams) && typeParams.length > 0) {
                ctx.print("<");
                this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, typeParams, ctx, ',');
                ctx.print(">");
            }
        };
        return _TsEmitterVisitor;
    }(AbstractEmitterVisitor));
    function interpretStatements(statements, resultVar, instanceFactory) {
        var stmtsWithReturn = statements.concat([new ReturnStatement(variable(resultVar))]);
        var ctx = new _ExecutionContext(null, null, null, null, new Map(), new Map(), new Map(), new Map(), instanceFactory);
        var visitor = new StatementInterpreter();
        var result = visitor.visitAllStatements(stmtsWithReturn, ctx);
        return isPresent(result) ? result.value : null;
    }
    var DynamicInstance = (function () {
        function DynamicInstance() {
        }
        Object.defineProperty(DynamicInstance.prototype, "props", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicInstance.prototype, "getters", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicInstance.prototype, "methods", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicInstance.prototype, "clazz", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return DynamicInstance;
    }());
    function isDynamicInstance(instance) {
        if (IS_DART) {
            return instance instanceof DynamicInstance;
        }
        else {
            return isPresent(instance) && isPresent(instance.props) && isPresent(instance.getters) &&
                isPresent(instance.methods);
        }
    }
    function _executeFunctionStatements(varNames, varValues, statements, ctx, visitor) {
        var childCtx = ctx.createChildWihtLocalVars();
        for (var i = 0; i < varNames.length; i++) {
            childCtx.vars.set(varNames[i], varValues[i]);
        }
        var result = visitor.visitAllStatements(statements, childCtx);
        return isPresent(result) ? result.value : null;
    }
    var _ExecutionContext = (function () {
        function _ExecutionContext(parent, superClass, superInstance, className, vars, props, getters, methods, instanceFactory) {
            this.parent = parent;
            this.superClass = superClass;
            this.superInstance = superInstance;
            this.className = className;
            this.vars = vars;
            this.props = props;
            this.getters = getters;
            this.methods = methods;
            this.instanceFactory = instanceFactory;
        }
        _ExecutionContext.prototype.createChildWihtLocalVars = function () {
            return new _ExecutionContext(this, this.superClass, this.superInstance, this.className, new Map(), this.props, this.getters, this.methods, this.instanceFactory);
        };
        return _ExecutionContext;
    }());
    var ReturnValue = (function () {
        function ReturnValue(value) {
            this.value = value;
        }
        return ReturnValue;
    }());
    var _DynamicClass = (function () {
        function _DynamicClass(_classStmt, _ctx, _visitor) {
            this._classStmt = _classStmt;
            this._ctx = _ctx;
            this._visitor = _visitor;
        }
        _DynamicClass.prototype.instantiate = function (args) {
            var _this = this;
            var props = new Map();
            var getters = new Map();
            var methods = new Map();
            var superClass = this._classStmt.parent.visitExpression(this._visitor, this._ctx);
            var instanceCtx = new _ExecutionContext(this._ctx, superClass, null, this._classStmt.name, this._ctx.vars, props, getters, methods, this._ctx.instanceFactory);
            this._classStmt.fields.forEach(function (field) { props.set(field.name, null); });
            this._classStmt.getters.forEach(function (getter) {
                getters.set(getter.name, function () { return _executeFunctionStatements([], [], getter.body, instanceCtx, _this._visitor); });
            });
            this._classStmt.methods.forEach(function (method) {
                var paramNames = method.params.map(function (param) { return param.name; });
                methods.set(method.name, _declareFn(paramNames, method.body, instanceCtx, _this._visitor));
            });
            var ctorParamNames = this._classStmt.constructorMethod.params.map(function (param) { return param.name; });
            _executeFunctionStatements(ctorParamNames, args, this._classStmt.constructorMethod.body, instanceCtx, this._visitor);
            return instanceCtx.superInstance;
        };
        _DynamicClass.prototype.debugAst = function () { return this._visitor.debugAst(this._classStmt); };
        return _DynamicClass;
    }());
    var StatementInterpreter = (function () {
        function StatementInterpreter() {
        }
        StatementInterpreter.prototype.debugAst = function (ast) {
            return IS_DART ? debugOutputAstAsDart(ast) : debugOutputAstAsTypeScript(ast);
        };
        StatementInterpreter.prototype.visitDeclareVarStmt = function (stmt, ctx) {
            ctx.vars.set(stmt.name, stmt.value.visitExpression(this, ctx));
            return null;
        };
        StatementInterpreter.prototype.visitWriteVarExpr = function (expr, ctx) {
            var value = expr.value.visitExpression(this, ctx);
            var currCtx = ctx;
            while (currCtx != null) {
                if (currCtx.vars.has(expr.name)) {
                    currCtx.vars.set(expr.name, value);
                    return value;
                }
                currCtx = currCtx.parent;
            }
            throw new BaseException$1("Not declared variable " + expr.name);
        };
        StatementInterpreter.prototype.visitReadVarExpr = function (ast, ctx) {
            var varName = ast.name;
            if (isPresent(ast.builtin)) {
                switch (ast.builtin) {
                    case BuiltinVar.Super:
                    case BuiltinVar.This:
                        return ctx.superInstance;
                    case BuiltinVar.CatchError:
                        varName = CATCH_ERROR_VAR$2;
                        break;
                    case BuiltinVar.CatchStack:
                        varName = CATCH_STACK_VAR$2;
                        break;
                    default:
                        throw new BaseException$1("Unknown builtin variable " + ast.builtin);
                }
            }
            var currCtx = ctx;
            while (currCtx != null) {
                if (currCtx.vars.has(varName)) {
                    return currCtx.vars.get(varName);
                }
                currCtx = currCtx.parent;
            }
            throw new BaseException$1("Not declared variable " + varName);
        };
        StatementInterpreter.prototype.visitWriteKeyExpr = function (expr, ctx) {
            var receiver = expr.receiver.visitExpression(this, ctx);
            var index = expr.index.visitExpression(this, ctx);
            var value = expr.value.visitExpression(this, ctx);
            receiver[index] = value;
            return value;
        };
        StatementInterpreter.prototype.visitWritePropExpr = function (expr, ctx) {
            var receiver = expr.receiver.visitExpression(this, ctx);
            var value = expr.value.visitExpression(this, ctx);
            if (isDynamicInstance(receiver)) {
                var di = receiver;
                if (di.props.has(expr.name)) {
                    di.props.set(expr.name, value);
                }
                else {
                    _angular_core.reflector.setter(expr.name)(receiver, value);
                }
            }
            else {
                _angular_core.reflector.setter(expr.name)(receiver, value);
            }
            return value;
        };
        StatementInterpreter.prototype.visitInvokeMethodExpr = function (expr, ctx) {
            var receiver = expr.receiver.visitExpression(this, ctx);
            var args = this.visitAllExpressions(expr.args, ctx);
            var result;
            if (isPresent(expr.builtin)) {
                switch (expr.builtin) {
                    case BuiltinMethod.ConcatArray:
                        result = ListWrapper.concat(receiver, args[0]);
                        break;
                    case BuiltinMethod.SubscribeObservable:
                        result = ObservableWrapper.subscribe(receiver, args[0]);
                        break;
                    case BuiltinMethod.bind:
                        if (IS_DART) {
                            result = receiver;
                        }
                        else {
                            result = receiver.bind(args[0]);
                        }
                        break;
                    default:
                        throw new BaseException$1("Unknown builtin method " + expr.builtin);
                }
            }
            else if (isDynamicInstance(receiver)) {
                var di = receiver;
                if (di.methods.has(expr.name)) {
                    result = FunctionWrapper.apply(di.methods.get(expr.name), args);
                }
                else {
                    result = _angular_core.reflector.method(expr.name)(receiver, args);
                }
            }
            else {
                result = _angular_core.reflector.method(expr.name)(receiver, args);
            }
            return result;
        };
        StatementInterpreter.prototype.visitInvokeFunctionExpr = function (stmt, ctx) {
            var args = this.visitAllExpressions(stmt.args, ctx);
            var fnExpr = stmt.fn;
            if (fnExpr instanceof ReadVarExpr && fnExpr.builtin === BuiltinVar.Super) {
                ctx.superInstance = ctx.instanceFactory.createInstance(ctx.superClass, ctx.className, args, ctx.props, ctx.getters, ctx.methods);
                ctx.parent.superInstance = ctx.superInstance;
                return null;
            }
            else {
                var fn = stmt.fn.visitExpression(this, ctx);
                return FunctionWrapper.apply(fn, args);
            }
        };
        StatementInterpreter.prototype.visitReturnStmt = function (stmt, ctx) {
            return new ReturnValue(stmt.value.visitExpression(this, ctx));
        };
        StatementInterpreter.prototype.visitDeclareClassStmt = function (stmt, ctx) {
            var clazz = new _DynamicClass(stmt, ctx, this);
            ctx.vars.set(stmt.name, clazz);
            return null;
        };
        StatementInterpreter.prototype.visitExpressionStmt = function (stmt, ctx) {
            return stmt.expr.visitExpression(this, ctx);
        };
        StatementInterpreter.prototype.visitIfStmt = function (stmt, ctx) {
            var condition = stmt.condition.visitExpression(this, ctx);
            if (condition) {
                return this.visitAllStatements(stmt.trueCase, ctx);
            }
            else if (isPresent(stmt.falseCase)) {
                return this.visitAllStatements(stmt.falseCase, ctx);
            }
            return null;
        };
        StatementInterpreter.prototype.visitTryCatchStmt = function (stmt, ctx) {
            try {
                return this.visitAllStatements(stmt.bodyStmts, ctx);
            }
            catch (e) {
                var childCtx = ctx.createChildWihtLocalVars();
                childCtx.vars.set(CATCH_ERROR_VAR$2, e);
                childCtx.vars.set(CATCH_STACK_VAR$2, e.stack);
                return this.visitAllStatements(stmt.catchStmts, childCtx);
            }
        };
        StatementInterpreter.prototype.visitThrowStmt = function (stmt, ctx) {
            throw stmt.error.visitExpression(this, ctx);
        };
        StatementInterpreter.prototype.visitCommentStmt = function (stmt, context) { return null; };
        StatementInterpreter.prototype.visitInstantiateExpr = function (ast, ctx) {
            var args = this.visitAllExpressions(ast.args, ctx);
            var clazz = ast.classExpr.visitExpression(this, ctx);
            if (clazz instanceof _DynamicClass) {
                return clazz.instantiate(args);
            }
            else {
                return FunctionWrapper.apply(_angular_core.reflector.factory(clazz), args);
            }
        };
        StatementInterpreter.prototype.visitLiteralExpr = function (ast, ctx) { return ast.value; };
        StatementInterpreter.prototype.visitExternalExpr = function (ast, ctx) { return ast.value.runtime; };
        StatementInterpreter.prototype.visitConditionalExpr = function (ast, ctx) {
            if (ast.condition.visitExpression(this, ctx)) {
                return ast.trueCase.visitExpression(this, ctx);
            }
            else if (isPresent(ast.falseCase)) {
                return ast.falseCase.visitExpression(this, ctx);
            }
            return null;
        };
        StatementInterpreter.prototype.visitNotExpr = function (ast, ctx) {
            return !ast.condition.visitExpression(this, ctx);
        };
        StatementInterpreter.prototype.visitCastExpr = function (ast, ctx) {
            return ast.value.visitExpression(this, ctx);
        };
        StatementInterpreter.prototype.visitFunctionExpr = function (ast, ctx) {
            var paramNames = ast.params.map(function (param) { return param.name; });
            return _declareFn(paramNames, ast.statements, ctx, this);
        };
        StatementInterpreter.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
            var paramNames = stmt.params.map(function (param) { return param.name; });
            ctx.vars.set(stmt.name, _declareFn(paramNames, stmt.statements, ctx, this));
            return null;
        };
        StatementInterpreter.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
            var _this = this;
            var lhs = function () { return ast.lhs.visitExpression(_this, ctx); };
            var rhs = function () { return ast.rhs.visitExpression(_this, ctx); };
            switch (ast.operator) {
                case BinaryOperator.Equals:
                    return lhs() == rhs();
                case BinaryOperator.Identical:
                    return lhs() === rhs();
                case BinaryOperator.NotEquals:
                    return lhs() != rhs();
                case BinaryOperator.NotIdentical:
                    return lhs() !== rhs();
                case BinaryOperator.And:
                    return lhs() && rhs();
                case BinaryOperator.Or:
                    return lhs() || rhs();
                case BinaryOperator.Plus:
                    return lhs() + rhs();
                case BinaryOperator.Minus:
                    return lhs() - rhs();
                case BinaryOperator.Divide:
                    return lhs() / rhs();
                case BinaryOperator.Multiply:
                    return lhs() * rhs();
                case BinaryOperator.Modulo:
                    return lhs() % rhs();
                case BinaryOperator.Lower:
                    return lhs() < rhs();
                case BinaryOperator.LowerEquals:
                    return lhs() <= rhs();
                case BinaryOperator.Bigger:
                    return lhs() > rhs();
                case BinaryOperator.BiggerEquals:
                    return lhs() >= rhs();
                default:
                    throw new BaseException$1("Unknown operator " + ast.operator);
            }
        };
        StatementInterpreter.prototype.visitReadPropExpr = function (ast, ctx) {
            var result;
            var receiver = ast.receiver.visitExpression(this, ctx);
            if (isDynamicInstance(receiver)) {
                var di = receiver;
                if (di.props.has(ast.name)) {
                    result = di.props.get(ast.name);
                }
                else if (di.getters.has(ast.name)) {
                    result = di.getters.get(ast.name)();
                }
                else if (di.methods.has(ast.name)) {
                    result = di.methods.get(ast.name);
                }
                else {
                    result = _angular_core.reflector.getter(ast.name)(receiver);
                }
            }
            else {
                result = _angular_core.reflector.getter(ast.name)(receiver);
            }
            return result;
        };
        StatementInterpreter.prototype.visitReadKeyExpr = function (ast, ctx) {
            var receiver = ast.receiver.visitExpression(this, ctx);
            var prop = ast.index.visitExpression(this, ctx);
            return receiver[prop];
        };
        StatementInterpreter.prototype.visitLiteralArrayExpr = function (ast, ctx) {
            return this.visitAllExpressions(ast.entries, ctx);
        };
        StatementInterpreter.prototype.visitLiteralMapExpr = function (ast, ctx) {
            var _this = this;
            var result = {};
            ast.entries.forEach(function (entry) { return result[entry[0]] =
                entry[1].visitExpression(_this, ctx); });
            return result;
        };
        StatementInterpreter.prototype.visitAllExpressions = function (expressions, ctx) {
            var _this = this;
            return expressions.map(function (expr) { return expr.visitExpression(_this, ctx); });
        };
        StatementInterpreter.prototype.visitAllStatements = function (statements, ctx) {
            for (var i = 0; i < statements.length; i++) {
                var stmt = statements[i];
                var val = stmt.visitStatement(this, ctx);
                if (val instanceof ReturnValue) {
                    return val;
                }
            }
            return null;
        };
        return StatementInterpreter;
    }());
    function _declareFn(varNames, statements, ctx, visitor) {
        switch (varNames.length) {
            case 0:
                return function () { return _executeFunctionStatements(varNames, [], statements, ctx, visitor); };
            case 1:
                return function (d0) { return _executeFunctionStatements(varNames, [d0], statements, ctx, visitor); };
            case 2:
                return function (d0, d1) { return _executeFunctionStatements(varNames, [d0, d1], statements, ctx, visitor); };
            case 3:
                return function (d0, d1, d2) { return _executeFunctionStatements(varNames, [d0, d1, d2], statements, ctx, visitor); };
            case 4:
                return function (d0, d1, d2, d3) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3], statements, ctx, visitor); };
            case 5:
                return function (d0, d1, d2, d3, d4) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3, d4], statements, ctx, visitor); };
            case 6:
                return function (d0, d1, d2, d3, d4, d5) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3, d4, d5], statements, ctx, visitor); };
            case 7:
                return function (d0, d1, d2, d3, d4, d5, d6) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3, d4, d5, d6], statements, ctx, visitor); };
            case 8:
                return function (d0, d1, d2, d3, d4, d5, d6, d7) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3, d4, d5, d6, d7], statements, ctx, visitor); };
            case 9:
                return function (d0, d1, d2, d3, d4, d5, d6, d7, d8) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3, d4, d5, d6, d7, d8], statements, ctx, visitor); };
            case 10:
                return function (d0, d1, d2, d3, d4, d5, d6, d7, d8, d9) { return _executeFunctionStatements(varNames, [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9], statements, ctx, visitor); };
            default:
                throw new BaseException$1('Declaring functions with more than 10 arguments is not supported right now');
        }
    }
    var CATCH_ERROR_VAR$2 = 'error';
    var CATCH_STACK_VAR$2 = 'stack';
    var InterpretiveAppViewInstanceFactory = (function () {
        function InterpretiveAppViewInstanceFactory() {
        }
        InterpretiveAppViewInstanceFactory.prototype.createInstance = function (superClass, clazz, args, props, getters, methods) {
            if (superClass === AppView) {
                // We are always using DebugAppView as parent.
                // However, in prod mode we generate a constructor call that does
                // not have the argument for the debugNodeInfos.
                args = args.concat([null]);
                return new _InterpretiveAppView(args, props, getters, methods);
            }
            else if (superClass === DebugAppView) {
                return new _InterpretiveAppView(args, props, getters, methods);
            }
            throw new BaseException$1("Can't instantiate class " + superClass + " in interpretative mode");
        };
        return InterpretiveAppViewInstanceFactory;
    }());
    var _InterpretiveAppView = (function (_super) {
        __extends(_InterpretiveAppView, _super);
        function _InterpretiveAppView(args, props, getters, methods) {
            _super.call(this, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            this.props = props;
            this.getters = getters;
            this.methods = methods;
        }
        _InterpretiveAppView.prototype.createInternal = function (rootSelector) {
            var m = this.methods.get('createInternal');
            if (isPresent(m)) {
                return m(rootSelector);
            }
            else {
                return _super.prototype.createInternal.call(this, rootSelector);
            }
        };
        _InterpretiveAppView.prototype.injectorGetInternal = function (token, nodeIndex, notFoundResult) {
            var m = this.methods.get('injectorGetInternal');
            if (isPresent(m)) {
                return m(token, nodeIndex, notFoundResult);
            }
            else {
                return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
            }
        };
        _InterpretiveAppView.prototype.destroyInternal = function () {
            var m = this.methods.get('destroyInternal');
            if (isPresent(m)) {
                return m();
            }
            else {
                return _super.prototype.destroyInternal.call(this);
            }
        };
        _InterpretiveAppView.prototype.dirtyParentQueriesInternal = function () {
            var m = this.methods.get('dirtyParentQueriesInternal');
            if (isPresent(m)) {
                return m();
            }
            else {
                return _super.prototype.dirtyParentQueriesInternal.call(this);
            }
        };
        _InterpretiveAppView.prototype.detectChangesInternal = function (throwOnChange) {
            var m = this.methods.get('detectChangesInternal');
            if (isPresent(m)) {
                return m(throwOnChange);
            }
            else {
                return _super.prototype.detectChangesInternal.call(this, throwOnChange);
            }
        };
        return _InterpretiveAppView;
    }(DebugAppView));
    var RuntimeCompiler = (function () {
        function RuntimeCompiler(_metadataResolver, _templateNormalizer, _templateParser, _styleCompiler, _viewCompiler, _xhr, _genConfig) {
            this._metadataResolver = _metadataResolver;
            this._templateNormalizer = _templateNormalizer;
            this._templateParser = _templateParser;
            this._styleCompiler = _styleCompiler;
            this._viewCompiler = _viewCompiler;
            this._xhr = _xhr;
            this._genConfig = _genConfig;
            this._styleCache = new Map();
            this._hostCacheKeys = new Map();
            this._compiledTemplateCache = new Map();
            this._compiledTemplateDone = new Map();
        }
        RuntimeCompiler.prototype.resolveComponent = function (componentType) {
            var compMeta = this._metadataResolver.getDirectiveMetadata(componentType);
            var hostCacheKey = this._hostCacheKeys.get(componentType);
            if (isBlank(hostCacheKey)) {
                hostCacheKey = new Object();
                this._hostCacheKeys.set(componentType, hostCacheKey);
                assertComponent(compMeta);
                var hostMeta = createHostComponentMeta(compMeta.type, compMeta.selector);
                this._loadAndCompileComponent(hostCacheKey, hostMeta, [compMeta], [], []);
            }
            return this._compiledTemplateDone.get(hostCacheKey)
                .then(function (compiledTemplate) { return new _angular_core.ComponentFactory(compMeta.selector, compiledTemplate.viewFactory, componentType); });
        };
        RuntimeCompiler.prototype.clearCache = function () {
            this._styleCache.clear();
            this._compiledTemplateCache.clear();
            this._compiledTemplateDone.clear();
            this._hostCacheKeys.clear();
        };
        RuntimeCompiler.prototype._loadAndCompileComponent = function (cacheKey, compMeta, viewDirectives, pipes, compilingComponentsPath) {
            var _this = this;
            var compiledTemplate = this._compiledTemplateCache.get(cacheKey);
            var done = this._compiledTemplateDone.get(cacheKey);
            if (isBlank(compiledTemplate)) {
                compiledTemplate = new CompiledTemplate();
                this._compiledTemplateCache.set(cacheKey, compiledTemplate);
                done =
                    PromiseWrapper.all([this._compileComponentStyles(compMeta)].concat(viewDirectives.map(function (dirMeta) { return _this._templateNormalizer.normalizeDirective(dirMeta); })))
                        .then(function (stylesAndNormalizedViewDirMetas) {
                            var normalizedViewDirMetas = stylesAndNormalizedViewDirMetas.slice(1);
                            var styles = stylesAndNormalizedViewDirMetas[0];
                            var parsedTemplate = _this._templateParser.parse(compMeta, compMeta.template.template, normalizedViewDirMetas, pipes, compMeta.type.name);
                            var childPromises = [];
                            compiledTemplate.init(_this._compileComponent(compMeta, parsedTemplate, styles, pipes, compilingComponentsPath, childPromises));
                            return PromiseWrapper.all(childPromises).then(function (_) { return compiledTemplate; });
                        });
                this._compiledTemplateDone.set(cacheKey, done);
            }
            return compiledTemplate;
        };
        RuntimeCompiler.prototype._compileComponent = function (compMeta, parsedTemplate, styles, pipes, compilingComponentsPath, childPromises) {
            var _this = this;
            var compileResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, new ExternalExpr(new CompileIdentifierMetadata({ runtime: styles })), pipes);
            compileResult.dependencies.forEach(function (dep) {
                var childCompilingComponentsPath = ListWrapper.clone(compilingComponentsPath);
                var childCacheKey = dep.comp.type.runtime;
                var childViewDirectives = _this._metadataResolver.getViewDirectivesMetadata(dep.comp.type.runtime);
                var childViewPipes = _this._metadataResolver.getViewPipesMetadata(dep.comp.type.runtime);
                var childIsRecursive = ListWrapper.contains(childCompilingComponentsPath, childCacheKey);
                childCompilingComponentsPath.push(childCacheKey);
                var childComp = _this._loadAndCompileComponent(dep.comp.type.runtime, dep.comp, childViewDirectives, childViewPipes, childCompilingComponentsPath);
                dep.factoryPlaceholder.runtime = childComp.proxyViewFactory;
                dep.factoryPlaceholder.name = "viewFactory_" + dep.comp.type.name;
                if (!childIsRecursive) {
                    // Only wait for a child if it is not a cycle
                    childPromises.push(_this._compiledTemplateDone.get(childCacheKey));
                }
            });
            var factory;
            if (IS_DART || !this._genConfig.useJit) {
                factory = interpretStatements(compileResult.statements, compileResult.viewFactoryVar, new InterpretiveAppViewInstanceFactory());
            }
            else {
                factory = jitStatements(compMeta.type.name + ".template.js", compileResult.statements, compileResult.viewFactoryVar);
            }
            return factory;
        };
        RuntimeCompiler.prototype._compileComponentStyles = function (compMeta) {
            var compileResult = this._styleCompiler.compileComponent(compMeta);
            return this._resolveStylesCompileResult(compMeta.type.name, compileResult);
        };
        RuntimeCompiler.prototype._resolveStylesCompileResult = function (sourceUrl, result) {
            var _this = this;
            var promises = result.dependencies.map(function (dep) { return _this._loadStylesheetDep(dep); });
            return PromiseWrapper.all(promises)
                .then(function (cssTexts) {
                    var nestedCompileResultPromises = [];
                    for (var i = 0; i < result.dependencies.length; i++) {
                        var dep = result.dependencies[i];
                        var cssText = cssTexts[i];
                        var nestedCompileResult = _this._styleCompiler.compileStylesheet(dep.moduleUrl, cssText, dep.isShimmed);
                        nestedCompileResultPromises.push(_this._resolveStylesCompileResult(dep.moduleUrl, nestedCompileResult));
                    }
                    return PromiseWrapper.all(nestedCompileResultPromises);
                })
                .then(function (nestedStylesArr) {
                    for (var i = 0; i < result.dependencies.length; i++) {
                        var dep = result.dependencies[i];
                        dep.valuePlaceholder.runtime = nestedStylesArr[i];
                        dep.valuePlaceholder.name = "importedStyles" + i;
                    }
                    if (IS_DART || !_this._genConfig.useJit) {
                        return interpretStatements(result.statements, result.stylesVar, new InterpretiveAppViewInstanceFactory());
                    }
                    else {
                        return jitStatements(sourceUrl + ".css.js", result.statements, result.stylesVar);
                    }
                });
        };
        RuntimeCompiler.prototype._loadStylesheetDep = function (dep) {
            var cacheKey = "" + dep.moduleUrl + (dep.isShimmed ? '.shim' : '');
            var cssTextPromise = this._styleCache.get(cacheKey);
            if (isBlank(cssTextPromise)) {
                cssTextPromise = this._xhr.get(dep.moduleUrl);
                this._styleCache.set(cacheKey, cssTextPromise);
            }
            return cssTextPromise;
        };
        return RuntimeCompiler;
    }());
    RuntimeCompiler.decorators = [
        { type: _angular_core.Injectable },
    ];
    RuntimeCompiler.ctorParameters = [
        { type: CompileMetadataResolver, },
        { type: DirectiveNormalizer, },
        { type: TemplateParser, },
        { type: StyleCompiler, },
        { type: ViewCompiler, },
        { type: XHR, },
        { type: CompilerConfig, },
    ];
    var CompiledTemplate = (function () {
        function CompiledTemplate() {
            var _this = this;
            this.viewFactory = null;
            this.proxyViewFactory = function (viewUtils, childInjector, contextEl) { return _this.viewFactory(viewUtils, childInjector, contextEl); };
        }
        CompiledTemplate.prototype.init = function (viewFactory) { this.viewFactory = viewFactory; };
        return CompiledTemplate;
    }());
    function assertComponent(meta) {
        if (!meta.isComponent) {
            throw new BaseException$1("Could not compile '" + meta.type.name + "' because it is not a component.");
        }
    }
    var BOOLEAN = 'boolean';
    var NUMBER = 'number';
    var STRING = 'string';
    var OBJECT = 'object';
    /**
     * This array represents the DOM schema. It encodes inheritance, properties, and events.
     *
     * ## Overview
     *
     * Each line represents one kind of element. The `element_inheritance` and properties are joined
     * using `element_inheritance|preperties` syntax.
     *
     * ## Element Inheritance
     *
     * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
     * Here the individual elements are separated by `,` (commas). Every element in the list
     * has identical properties.
     *
     * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
     * specified then `""` (blank) element is assumed.
     *
     * NOTE: The blank element inherits from root `*` element, the super element of all elements.
     *
     * NOTE an element prefix such as `@svg:` has no special meaning to the schema.
     *
     * ## Properties
     *
     * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
     * by a special character designating its type:
     *
     * - (no prefix): property is a string.
     * - `*`: property represents an event.
     * - `!`: property is a boolean.
     * - `#`: property is a number.
     * - `%`: property is an object.
     *
     * ## Query
     *
     * The class creates an internal squas representaino which allows to easily answer the query of
     * if a given property exist on a given element.
     *
     * NOTE: We don't yet support querying for types or events.
     * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder.
     */
    var SCHEMA =
        /*@ts2dart_const*/ ([
        '*|%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop',
        '^*|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*autocomplete,*autocompleteerror,*beforecopy,*beforecut,*beforepaste,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*copy,*cuechange,*cut,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*message,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*paste,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*search,*seeked,*seeking,*select,*selectstart,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerText,!spellcheck,%style,#tabIndex,title,!translate',
        'media|!autoplay,!controls,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,#playbackRate,preload,src,#volume',
        '@svg:^*|*abort,*autocomplete,*autocompleteerror,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
        '@svg:graphics^@svg:|',
        '@svg:animation^@svg:|*begin,*end,*repeat',
        '@svg:geometry^@svg:|',
        '@svg:componentTransferFunction^@svg:|',
        '@svg:gradient^@svg:|',
        '@svg:textContent^@svg:graphics|',
        '@svg:textPositioning^@svg:textContent|',
        'a|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,rel,rev,search,shape,target,text,type,username',
        'area|alt,coords,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,search,shape,target,username',
        'audio^media|',
        'br|clear',
        'base|href,target',
        'body|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
        'button|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
        'canvas|#height,#width',
        'content|select',
        'dl|!compact',
        'datalist|',
        'details|!open',
        'dialog|!open,returnValue',
        'dir|!compact',
        'div|align',
        'embed|align,height,name,src,type,width',
        'fieldset|!disabled,name',
        'font|color,face,size',
        'form|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
        'frame|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
        'frameset|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
        'hr|align,color,!noShade,size,width',
        'head|',
        'h1,h2,h3,h4,h5,h6|align',
        'html|version',
        'iframe|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,%sandbox,scrolling,src,srcdoc,width',
        'img|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,sizes,src,srcset,useMap,#vspace,#width',
        'input|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
        'keygen|!autofocus,challenge,!disabled,keytype,name',
        'li|type,#value',
        'label|htmlFor',
        'legend|align',
        'link|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,rel,%relList,rev,%sizes,target,type',
        'map|name',
        'marquee|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
        'menu|!compact',
        'meta|content,httpEquiv,name,scheme',
        'meter|#high,#low,#max,#min,#optimum,#value',
        'ins,del|cite,dateTime',
        'ol|!compact,!reversed,#start,type',
        'object|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
        'optgroup|!disabled,label',
        'option|!defaultSelected,!disabled,label,!selected,text,value',
        'output|defaultValue,%htmlFor,name,value',
        'p|align',
        'param|name,type,value,valueType',
        'picture|',
        'pre|#width',
        'progress|#max,#value',
        'q,blockquote,cite|',
        'script|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
        'select|!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
        'shadow|',
        'source|media,sizes,src,srcset,type',
        'span|',
        'style|!disabled,media,type',
        'caption|align',
        'th,td|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
        'col,colgroup|align,ch,chOff,#span,vAlign,width',
        'table|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
        'tr|align,bgColor,ch,chOff,vAlign',
        'tfoot,thead,tbody|align,ch,chOff,vAlign',
        'template|',
        'textarea|autocapitalize,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
        'title|text',
        'track|!default,kind,label,src,srclang',
        'ul|!compact,type',
        'unknown|',
        'video^media|#height,poster,#width',
        '@svg:a^@svg:graphics|',
        '@svg:animate^@svg:animation|',
        '@svg:animateMotion^@svg:animation|',
        '@svg:animateTransform^@svg:animation|',
        '@svg:circle^@svg:geometry|',
        '@svg:clipPath^@svg:graphics|',
        '@svg:cursor^@svg:|',
        '@svg:defs^@svg:graphics|',
        '@svg:desc^@svg:|',
        '@svg:discard^@svg:|',
        '@svg:ellipse^@svg:geometry|',
        '@svg:feBlend^@svg:|',
        '@svg:feColorMatrix^@svg:|',
        '@svg:feComponentTransfer^@svg:|',
        '@svg:feComposite^@svg:|',
        '@svg:feConvolveMatrix^@svg:|',
        '@svg:feDiffuseLighting^@svg:|',
        '@svg:feDisplacementMap^@svg:|',
        '@svg:feDistantLight^@svg:|',
        '@svg:feDropShadow^@svg:|',
        '@svg:feFlood^@svg:|',
        '@svg:feFuncA^@svg:componentTransferFunction|',
        '@svg:feFuncB^@svg:componentTransferFunction|',
        '@svg:feFuncG^@svg:componentTransferFunction|',
        '@svg:feFuncR^@svg:componentTransferFunction|',
        '@svg:feGaussianBlur^@svg:|',
        '@svg:feImage^@svg:|',
        '@svg:feMerge^@svg:|',
        '@svg:feMergeNode^@svg:|',
        '@svg:feMorphology^@svg:|',
        '@svg:feOffset^@svg:|',
        '@svg:fePointLight^@svg:|',
        '@svg:feSpecularLighting^@svg:|',
        '@svg:feSpotLight^@svg:|',
        '@svg:feTile^@svg:|',
        '@svg:feTurbulence^@svg:|',
        '@svg:filter^@svg:|',
        '@svg:foreignObject^@svg:graphics|',
        '@svg:g^@svg:graphics|',
        '@svg:image^@svg:graphics|',
        '@svg:line^@svg:geometry|',
        '@svg:linearGradient^@svg:gradient|',
        '@svg:mpath^@svg:|',
        '@svg:marker^@svg:|',
        '@svg:mask^@svg:|',
        '@svg:metadata^@svg:|',
        '@svg:path^@svg:geometry|',
        '@svg:pattern^@svg:|',
        '@svg:polygon^@svg:geometry|',
        '@svg:polyline^@svg:geometry|',
        '@svg:radialGradient^@svg:gradient|',
        '@svg:rect^@svg:geometry|',
        '@svg:svg^@svg:graphics|#currentScale,#zoomAndPan',
        '@svg:script^@svg:|type',
        '@svg:set^@svg:animation|',
        '@svg:stop^@svg:|',
        '@svg:style^@svg:|!disabled,media,title,type',
        '@svg:switch^@svg:graphics|',
        '@svg:symbol^@svg:|',
        '@svg:tspan^@svg:textPositioning|',
        '@svg:text^@svg:textPositioning|',
        '@svg:textPath^@svg:textContent|',
        '@svg:title^@svg:|',
        '@svg:use^@svg:graphics|',
        '@svg:view^@svg:|#zoomAndPan'
    ]);
    var attrToPropMap = {
        'class': 'className',
        'innerHtml': 'innerHTML',
        'readonly': 'readOnly',
        'tabindex': 'tabIndex'
    };
    var DomElementSchemaRegistry = (function (_super) {
        __extends(DomElementSchemaRegistry, _super);
        function DomElementSchemaRegistry() {
            var _this = this;
            _super.call(this);
            this.schema = {};
            SCHEMA.forEach(function (encodedType) {
                var parts = encodedType.split('|');
                var properties = parts[1].split(',');
                var typeParts = (parts[0] + '^').split('^');
                var typeName = typeParts[0];
                var type = {};
                typeName.split(',').forEach(function (tag) { return _this.schema[tag] = type; });
                var superType = _this.schema[typeParts[1]];
                if (isPresent(superType)) {
                    StringMapWrapper.forEach(superType, function (v, k) { return type[k] = v; });
                }
                properties.forEach(function (property) {
                    if (property == '') {
                    }
                    else if (property.startsWith('*')) {
                    }
                    else if (property.startsWith('!')) {
                        type[property.substring(1)] = BOOLEAN;
                    }
                    else if (property.startsWith('#')) {
                        type[property.substring(1)] = NUMBER;
                    }
                    else if (property.startsWith('%')) {
                        type[property.substring(1)] = OBJECT;
                    }
                    else {
                        type[property] = STRING;
                    }
                });
            });
        }
        DomElementSchemaRegistry.prototype.hasProperty = function (tagName, propName) {
            if (tagName.indexOf('-') !== -1) {
                // can't tell now as we don't know which properties a custom element will get
                // once it is instantiated
                return true;
            }
            else {
                var elementProperties = this.schema[tagName.toLowerCase()];
                if (!isPresent(elementProperties)) {
                    elementProperties = this.schema['unknown'];
                }
                return isPresent(elementProperties[propName]);
            }
        };
        /**
         * securityContext returns the security context for the given property on the given DOM tag.
         *
         * Tag and property name are statically known and cannot change at runtime, i.e. it is not
         * possible to bind a value into a changing attribute or tag name.
         *
         * The filtering is white list based. All attributes in the schema above are assumed to have the
         * 'NONE' security context, i.e. that they are safe inert string values. Only specific well known
         * attack vectors are assigned their appropriate context.
         */
        DomElementSchemaRegistry.prototype.securityContext = function (tagName, propName) {
            // TODO(martinprobst): Fill in missing properties.
            if (propName === 'style')
                return SecurityContext.STYLE;
            if (tagName === 'a' && propName === 'href')
                return SecurityContext.URL;
            if (propName === 'innerHTML')
                return SecurityContext.HTML;
            return SecurityContext.NONE;
        };
        DomElementSchemaRegistry.prototype.getMappedPropName = function (propName) {
            var mappedPropName = StringMapWrapper.get(attrToPropMap, propName);
            return isPresent(mappedPropName) ? mappedPropName : propName;
        };
        return DomElementSchemaRegistry;
    }(ElementSchemaRegistry));
    DomElementSchemaRegistry.decorators = [
        { type: _angular_core.Injectable },
    ];
    DomElementSchemaRegistry.ctorParameters = [];
    function _createCompilerConfig() {
        return new CompilerConfig(assertionsEnabled(), false, true);
    }
    /**
     * A set of providers that provide `RuntimeCompiler` and its dependencies to use for
     * template compilation.
     */
    var COMPILER_PROVIDERS =
        /*@ts2dart_const*/ [
        Lexer,
        Parser,
        HtmlParser,
        TemplateParser,
        DirectiveNormalizer,
        CompileMetadataResolver,
        DEFAULT_PACKAGE_URL_PROVIDER,
        StyleCompiler,
        ViewCompiler,
        /*@ts2dart_Provider*/ { provide: CompilerConfig, useFactory: _createCompilerConfig, deps: [] },
        RuntimeCompiler,
        /*@ts2dart_Provider*/ { provide: _angular_core.ComponentResolver, useExisting: RuntimeCompiler },
        DomElementSchemaRegistry,
        /*@ts2dart_Provider*/ { provide: ElementSchemaRegistry, useExisting: DomElementSchemaRegistry },
        UrlResolver,
        ViewResolver,
        DirectiveResolver,
        PipeResolver
    ];
    // asset:<package-name>/<realm>/<path-to-module>
    var _ASSET_URL_RE = /asset:([^\/]+)\/([^\/]+)\/(.+)/g;
    /**
     * Interface that defines how import statements should be generated.
     */
    var ImportGenerator = (function () {
        function ImportGenerator() {
        }
        ImportGenerator.parseAssetUrl = function (url) { return AssetUrl.parse(url); };
        return ImportGenerator;
    }());
    var AssetUrl = (function () {
        function AssetUrl(packageName, firstLevelDir, modulePath) {
            this.packageName = packageName;
            this.firstLevelDir = firstLevelDir;
            this.modulePath = modulePath;
        }
        AssetUrl.parse = function (url, allowNonMatching) {
            if (allowNonMatching === void 0) { allowNonMatching = true; }
            var match = RegExpWrapper.firstMatch(_ASSET_URL_RE, url);
            if (isPresent(match)) {
                return new AssetUrl(match[1], match[2], match[3]);
            }
            if (allowNonMatching) {
                return null;
            }
            throw new BaseException$1("Url " + url + " is not a valid asset: url");
        };
        return AssetUrl;
    }());
    exports.__compiler_private__;
    (function (__compiler_private__) {
        __compiler_private__.SelectorMatcher = SelectorMatcher;
        __compiler_private__.CssSelector = CssSelector;
        __compiler_private__.AssetUrl = AssetUrl;
        __compiler_private__.ImportGenerator = ImportGenerator;
    })(exports.__compiler_private__ || (exports.__compiler_private__ = {}));
    exports.ElementSchemaRegistry = ElementSchemaRegistry;
    exports.COMPILER_PROVIDERS = COMPILER_PROVIDERS;
    exports.TEMPLATE_TRANSFORMS = TEMPLATE_TRANSFORMS;
    exports.CompilerConfig = CompilerConfig;
    exports.RenderTypes = RenderTypes;
    exports.UrlResolver = UrlResolver;
    exports.DEFAULT_PACKAGE_URL_PROVIDER = DEFAULT_PACKAGE_URL_PROVIDER;
    exports.createOfflineCompileUrlResolver = createOfflineCompileUrlResolver;
    exports.XHR = XHR;
    exports.ViewResolver = ViewResolver;
    exports.DirectiveResolver = DirectiveResolver;
    exports.PipeResolver = PipeResolver;
    exports.SourceModule = SourceModule;
    exports.NormalizedComponentWithViewDirectives = NormalizedComponentWithViewDirectives;
    exports.OfflineCompiler = OfflineCompiler;
    exports.CompileMetadataWithIdentifier = CompileMetadataWithIdentifier;
    exports.CompileMetadataWithType = CompileMetadataWithType;
    exports.CompileIdentifierMetadata = CompileIdentifierMetadata;
    exports.CompileDiDependencyMetadata = CompileDiDependencyMetadata;
    exports.CompileProviderMetadata = CompileProviderMetadata;
    exports.CompileFactoryMetadata = CompileFactoryMetadata;
    exports.CompileTokenMetadata = CompileTokenMetadata;
    exports.CompileTypeMetadata = CompileTypeMetadata;
    exports.CompileQueryMetadata = CompileQueryMetadata;
    exports.CompileTemplateMetadata = CompileTemplateMetadata;
    exports.CompileDirectiveMetadata = CompileDirectiveMetadata;
    exports.CompilePipeMetadata = CompilePipeMetadata;
    exports.TextAst = TextAst;
    exports.BoundTextAst = BoundTextAst;
    exports.AttrAst = AttrAst;
    exports.BoundElementPropertyAst = BoundElementPropertyAst;
    exports.BoundEventAst = BoundEventAst;
    exports.ReferenceAst = ReferenceAst;
    exports.VariableAst = VariableAst;
    exports.ElementAst = ElementAst;
    exports.EmbeddedTemplateAst = EmbeddedTemplateAst;
    exports.BoundDirectivePropertyAst = BoundDirectivePropertyAst;
    exports.DirectiveAst = DirectiveAst;
    exports.ProviderAst = ProviderAst;
    exports.NgContentAst = NgContentAst;
    exports.templateVisitAll = templateVisitAll;
}));
