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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}), global.ng.core, global.ng.common));
}(this, function (exports, _angular_core, _angular_common) {
    'use strict';
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
    var Date = global$1.Date;
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
    function isString(obj) {
        return typeof obj === "string";
    }
    function isFunction(obj) {
        return typeof obj === "function";
    }
    function isArray(obj) {
        return Array.isArray(obj);
    }
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
    // Can't be all uppercase as our transpiler would think it is a special directive...
    var Json = (function () {
        function Json() {
        }
        Json.parse = function (s) { return global$1.JSON.parse(s); };
        Json.stringify = function (data) {
            // Dart doesn't take 3 arguments
            return global$1.JSON.stringify(data, null, 2);
        };
        return Json;
    }());
    var DateWrapper = (function () {
        function DateWrapper() {
        }
        DateWrapper.create = function (year, month, day, hour, minutes, seconds, milliseconds) {
            if (month === void 0) { month = 1; }
            if (day === void 0) { day = 1; }
            if (hour === void 0) { hour = 0; }
            if (minutes === void 0) { minutes = 0; }
            if (seconds === void 0) { seconds = 0; }
            if (milliseconds === void 0) { milliseconds = 0; }
            return new Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
        };
        DateWrapper.fromISOString = function (str) { return new Date(str); };
        DateWrapper.fromMillis = function (ms) { return new Date(ms); };
        DateWrapper.toMillis = function (date) { return date.getTime(); };
        DateWrapper.now = function () { return new Date(); };
        DateWrapper.toJson = function (date) { return date.toJSON(); };
        return DateWrapper;
    }());
    function setValueOnPath(global, path, value) {
        var parts = path.split('.');
        var obj = global;
        while (parts.length > 1) {
            var name = parts.shift();
            if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
                obj = obj[name];
            }
            else {
                obj = obj[name] = {};
            }
        }
        if (obj === undefined || obj === null) {
            obj = {};
        }
        obj[parts.shift()] = value;
    }
    var wtfInit = _angular_core.__core_private__.wtfInit;
    var DebugDomRootRenderer = _angular_core.__core_private__.DebugDomRootRenderer;
    var SecurityContext = _angular_core.__core_private__.SecurityContext;
    var SanitizationService = _angular_core.__core_private__.SanitizationService;
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * This regular expression matches a subset of URLs that will not cause script
     * execution if used in URL context within a HTML document. Specifically, this
     * regular expression matches if (comment from here on and regex copied from
     * Soy's EscapingConventions):
     * (1) Either a protocol in a whitelist (http, https, mailto or ftp).
     * (2) or no protocol.  A protocol must be followed by a colon. The below
     *     allows that by allowing colons only after one of the characters [/?#].
     *     A colon after a hash (#) must be in the fragment.
     *     Otherwise, a colon after a (?) must be in a query.
     *     Otherwise, a colon after a single solidus (/) must be in a path.
     *     Otherwise, a colon after a double solidus (//) must be in the authority
     *     (before port).
     *
     * The pattern disallows &, used in HTML entity declarations before
     * one of the characters in [/?#]. This disallows HTML entities used in the
     * protocol name, which should never happen, e.g. "h&#116;tp" for "http".
     * It also disallows HTML entities in the first path part of a relative path,
     * e.g. "foo&lt;bar/baz".  Our existing escaping functions should not produce
     * that. More importantly, it disallows masking of a colon,
     * e.g. "javascript&#58;...".
     *
     * This regular expression was taken from the Closure sanitization library.
     */
    var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
    function sanitizeUrl(url) {
        if (String(url).match(SAFE_URL_PATTERN))
            return url;
        return 'unsafe:' + url;
    }
    /**
     * Regular expression for safe style values.
     *
     * Quotes (" and ') are allowed, but a check must be done elsewhere to ensure
     * they're balanced.
     *
     * ',' allows multiple values to be assigned to the same property
     * (e.g. background-attachment or font-family) and hence could allow
     * multiple values to get injected, but that should pose no risk of XSS.
     *
     * The rgb() and rgba() expression checks only for XSS safety, not for CSS
     * validity.
     *
     * This regular expression was taken from the Closure sanitization library.
     */
    var SAFE_STYLE_VALUE = /^([-,."'%_!# a-zA-Z0-9]+|(?:rgb|hsl)a?\([0-9.%, ]+\))$/;
    /**
     * Checks that quotes (" and ') are properly balanced inside a string. Assumes
     * that neither escape (\) nor any other character that could result in
     * breaking out of a string parsing context are allowed;
     * see http://www.w3.org/TR/css3-syntax/#string-token-diagram.
     *
     * This code was taken from the Closure sanitization library.
     */
    function hasBalancedQuotes(value) {
        var outsideSingle = true;
        var outsideDouble = true;
        for (var i = 0; i < value.length; i++) {
            var c = value.charAt(i);
            if (c === '\'' && outsideDouble) {
                outsideSingle = !outsideSingle;
            }
            else if (c === '"' && outsideSingle) {
                outsideDouble = !outsideDouble;
            }
        }
        return outsideSingle && outsideDouble;
    }
    function sanitizeStyle(value) {
        if (String(value).match(SAFE_STYLE_VALUE) && hasBalancedQuotes(value))
            return value;
        return 'unsafe';
    }
    /**
     * DomSanitizationService helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing
     * values to be safe to use in the different DOM contexts.
     *
     * For example, when binding a URL in an `<a [href]="someValue">` hyperlink, `someValue` will be
     * sanitized so that an attacker cannot inject e.g. a `javascript:` URL that would execute code on
     * the website.
     *
     * In specific situations, it might be necessary to disable sanitization, for example if the
     * application genuinely needs to produce a `javascript:` style link with a dynamic value in it.
     * Users can bypass security by constructing a value with one of the `bypassSecurityTrust...`
     * methods, and then binding to that value from the template.
     *
     * These situations should be very rare, and extraordinary care must be taken to avoid creating a
     * Cross Site Scripting (XSS) security bug!
     *
     * When using `bypassSecurityTrust...`, make sure to call the method as early as possible and as
     * close as possible to the source of the value, to make it easy to verify no security bug is
     * created by its use.
     *
     * It is not required (and not recommended) to bypass security if the value is safe, e.g. a URL that
     * does not start with a suspicious protocol, or an HTML snippet that does not contain dangerous
     * code. The sanitizer leaves safe values intact.
     */
    var DomSanitizationService = (function () {
        function DomSanitizationService() {
        }
        return DomSanitizationService;
    }());
    var DomSanitizationServiceImpl = (function (_super) {
        __extends(DomSanitizationServiceImpl, _super);
        function DomSanitizationServiceImpl() {
            _super.apply(this, arguments);
        }
        DomSanitizationServiceImpl.prototype.sanitize = function (ctx, value) {
            if (value == null)
                return null;
            switch (ctx) {
                case SecurityContext.NONE:
                    return value;
                case SecurityContext.HTML:
                    if (value instanceof SafeHtmlImpl)
                        return value.changingThisBreaksApplicationSecurity;
                    this.checkNotSafeValue(value, 'HTML');
                    return this.sanitizeHtml(String(value));
                case SecurityContext.STYLE:
                    if (value instanceof SafeStyleImpl)
                        return value.changingThisBreaksApplicationSecurity;
                    this.checkNotSafeValue(value, 'Style');
                    return sanitizeStyle(value);
                case SecurityContext.SCRIPT:
                    if (value instanceof SafeScriptImpl)
                        return value.changingThisBreaksApplicationSecurity;
                    this.checkNotSafeValue(value, 'Script');
                    throw new Error('unsafe value used in a script context');
                case SecurityContext.URL:
                    if (value instanceof SafeUrlImpl)
                        return value.changingThisBreaksApplicationSecurity;
                    this.checkNotSafeValue(value, 'URL');
                    return sanitizeUrl(String(value));
                case SecurityContext.RESOURCE_URL:
                    if (value instanceof SafeResourceUrlImpl) {
                        return value.changingThisBreaksApplicationSecurity;
                    }
                    this.checkNotSafeValue(value, 'ResourceURL');
                    throw new Error('unsafe value used in a resource URL context');
                default:
                    throw new Error("Unexpected SecurityContext " + ctx);
            }
        };
        DomSanitizationServiceImpl.prototype.checkNotSafeValue = function (value, expectedType) {
            if (value instanceof SafeValueImpl) {
                throw new Error('Required a safe ' + expectedType + ', got a ' + value.getTypeName());
            }
        };
        DomSanitizationServiceImpl.prototype.sanitizeHtml = function (value) {
            // TODO(martinprobst): implement.
            return value;
        };
        DomSanitizationServiceImpl.prototype.bypassSecurityTrustHtml = function (value) { return new SafeHtmlImpl(value); };
        DomSanitizationServiceImpl.prototype.bypassSecurityTrustStyle = function (value) { return new SafeStyleImpl(value); };
        DomSanitizationServiceImpl.prototype.bypassSecurityTrustScript = function (value) { return new SafeScriptImpl(value); };
        DomSanitizationServiceImpl.prototype.bypassSecurityTrustUrl = function (value) { return new SafeUrlImpl(value); };
        DomSanitizationServiceImpl.prototype.bypassSecurityTrustResourceUrl = function (value) {
            return new SafeResourceUrlImpl(value);
        };
        return DomSanitizationServiceImpl;
    }(DomSanitizationService));
    DomSanitizationServiceImpl.decorators = [
        { type: _angular_core.Injectable },
    ];
    var SafeValueImpl = (function () {
        function SafeValueImpl(changingThisBreaksApplicationSecurity) {
            this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
            // empty
        }
        return SafeValueImpl;
    }());
    var SafeHtmlImpl = (function (_super) {
        __extends(SafeHtmlImpl, _super);
        function SafeHtmlImpl() {
            _super.apply(this, arguments);
        }
        SafeHtmlImpl.prototype.getTypeName = function () { return 'HTML'; };
        return SafeHtmlImpl;
    }(SafeValueImpl));
    var SafeStyleImpl = (function (_super) {
        __extends(SafeStyleImpl, _super);
        function SafeStyleImpl() {
            _super.apply(this, arguments);
        }
        SafeStyleImpl.prototype.getTypeName = function () { return 'Style'; };
        return SafeStyleImpl;
    }(SafeValueImpl));
    var SafeScriptImpl = (function (_super) {
        __extends(SafeScriptImpl, _super);
        function SafeScriptImpl() {
            _super.apply(this, arguments);
        }
        SafeScriptImpl.prototype.getTypeName = function () { return 'Script'; };
        return SafeScriptImpl;
    }(SafeValueImpl));
    var SafeUrlImpl = (function (_super) {
        __extends(SafeUrlImpl, _super);
        function SafeUrlImpl() {
            _super.apply(this, arguments);
        }
        SafeUrlImpl.prototype.getTypeName = function () { return 'URL'; };
        return SafeUrlImpl;
    }(SafeValueImpl));
    var SafeResourceUrlImpl = (function (_super) {
        __extends(SafeResourceUrlImpl, _super);
        function SafeResourceUrlImpl() {
            _super.apply(this, arguments);
        }
        SafeResourceUrlImpl.prototype.getTypeName = function () { return 'ResourceURL'; };
        return SafeResourceUrlImpl;
    }(SafeValueImpl));
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
    var _DOM = null;
    function getDOM() {
        return _DOM;
    }
    function setDOM(adapter) {
        _DOM = adapter;
    }
    function setRootDomAdapter(adapter) {
        if (isBlank(_DOM)) {
            _DOM = adapter;
        }
    }
    /* tslint:disable:requireParameterType */
    /**
     * Provides DOM operations in an environment-agnostic way.
     */
    var DomAdapter = (function () {
        function DomAdapter() {
            this.xhrType = null;
        }
        /** @deprecated */
        DomAdapter.prototype.getXHR = function () { return this.xhrType; };
        Object.defineProperty(DomAdapter.prototype, "attrToPropMap", {
            /**
             * Maps attribute names to their corresponding property names for cases
             * where attribute name doesn't match property name.
             */
            get: function () { return this._attrToPropMap; },
            set: function (value) { this._attrToPropMap = value; },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        return DomAdapter;
    }());
    /**
     * Provides DOM operations in any browser environment.
     */
    var GenericBrowserDomAdapter = (function (_super) {
        __extends(GenericBrowserDomAdapter, _super);
        function GenericBrowserDomAdapter() {
            var _this = this;
            _super.call(this);
            this._animationPrefix = null;
            this._transitionEnd = null;
            try {
                var element = this.createElement('div', this.defaultDoc());
                if (isPresent(this.getStyle(element, 'animationName'))) {
                    this._animationPrefix = '';
                }
                else {
                    var domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                    for (var i = 0; i < domPrefixes.length; i++) {
                        if (isPresent(this.getStyle(element, domPrefixes[i] + 'AnimationName'))) {
                            this._animationPrefix = '-' + domPrefixes[i].toLowerCase() + '-';
                            break;
                        }
                    }
                }
                var transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                };
                StringMapWrapper.forEach(transEndEventNames, function (value, key) {
                    if (isPresent(_this.getStyle(element, key))) {
                        _this._transitionEnd = value;
                    }
                });
            }
            catch (e) {
                this._animationPrefix = null;
                this._transitionEnd = null;
            }
        }
        GenericBrowserDomAdapter.prototype.getDistributedNodes = function (el) { return el.getDistributedNodes(); };
        GenericBrowserDomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
            el.href = href == null ? baseUrl : baseUrl + '/../' + href;
        };
        GenericBrowserDomAdapter.prototype.supportsDOMEvents = function () { return true; };
        GenericBrowserDomAdapter.prototype.supportsNativeShadowDOM = function () {
            return isFunction(this.defaultDoc().body.createShadowRoot);
        };
        GenericBrowserDomAdapter.prototype.getAnimationPrefix = function () {
            return isPresent(this._animationPrefix) ? this._animationPrefix : "";
        };
        GenericBrowserDomAdapter.prototype.getTransitionEnd = function () { return isPresent(this._transitionEnd) ? this._transitionEnd : ""; };
        GenericBrowserDomAdapter.prototype.supportsAnimation = function () {
            return isPresent(this._animationPrefix) && isPresent(this._transitionEnd);
        };
        return GenericBrowserDomAdapter;
    }(DomAdapter));
    var _attrToPropMap = {
        'class': 'className',
        'innerHtml': 'innerHTML',
        'readonly': 'readOnly',
        'tabindex': 'tabIndex'
    };
    var DOM_KEY_LOCATION_NUMPAD = 3;
    // Map to convert some key or keyIdentifier values to what will be returned by getEventKey
    var _keyMap = {
        // The following values are here for cross-browser compatibility and to match the W3C standard
        // cf http://www.w3.org/TR/DOM-Level-3-Events-key/
        '\b': 'Backspace',
        '\t': 'Tab',
        '\x7F': 'Delete',
        '\x1B': 'Escape',
        'Del': 'Delete',
        'Esc': 'Escape',
        'Left': 'ArrowLeft',
        'Right': 'ArrowRight',
        'Up': 'ArrowUp',
        'Down': 'ArrowDown',
        'Menu': 'ContextMenu',
        'Scroll': 'ScrollLock',
        'Win': 'OS'
    };
    // There is a bug in Chrome for numeric keypad keys:
    // https://code.google.com/p/chromium/issues/detail?id=155654
    // 1, 2, 3 ... are reported as A, B, C ...
    var _chromeNumKeyPadMap = {
        'A': '1',
        'B': '2',
        'C': '3',
        'D': '4',
        'E': '5',
        'F': '6',
        'G': '7',
        'H': '8',
        'I': '9',
        'J': '*',
        'K': '+',
        'M': '-',
        'N': '.',
        'O': '/',
        '\x60': '0',
        '\x90': 'NumLock'
    };
    /**
     * A `DomAdapter` powered by full browser DOM APIs.
     */
    /* tslint:disable:requireParameterType */
    var BrowserDomAdapter = (function (_super) {
        __extends(BrowserDomAdapter, _super);
        function BrowserDomAdapter() {
            _super.apply(this, arguments);
        }
        BrowserDomAdapter.prototype.parse = function (templateHtml) { throw new Error("parse not implemented"); };
        BrowserDomAdapter.makeCurrent = function () { setRootDomAdapter(new BrowserDomAdapter()); };
        BrowserDomAdapter.prototype.hasProperty = function (element, name) { return name in element; };
        BrowserDomAdapter.prototype.setProperty = function (el, name, value) { el[name] = value; };
        BrowserDomAdapter.prototype.getProperty = function (el, name) { return el[name]; };
        BrowserDomAdapter.prototype.invoke = function (el, methodName, args) {
            el[methodName].apply(el, args);
        };
        // TODO(tbosch): move this into a separate environment class once we have it
        BrowserDomAdapter.prototype.logError = function (error) {
            if (window.console.error) {
                window.console.error(error);
            }
            else {
                window.console.log(error);
            }
        };
        BrowserDomAdapter.prototype.log = function (error) { window.console.log(error); };
        BrowserDomAdapter.prototype.logGroup = function (error) {
            if (window.console.group) {
                window.console.group(error);
                this.logError(error);
            }
            else {
                window.console.log(error);
            }
        };
        BrowserDomAdapter.prototype.logGroupEnd = function () {
            if (window.console.groupEnd) {
                window.console.groupEnd();
            }
        };
        Object.defineProperty(BrowserDomAdapter.prototype, "attrToPropMap", {
            get: function () { return _attrToPropMap; },
            enumerable: true,
            configurable: true
        });
        BrowserDomAdapter.prototype.query = function (selector) { return document.querySelector(selector); };
        BrowserDomAdapter.prototype.querySelector = function (el, selector) { return el.querySelector(selector); };
        BrowserDomAdapter.prototype.querySelectorAll = function (el, selector) { return el.querySelectorAll(selector); };
        BrowserDomAdapter.prototype.on = function (el, evt, listener) { el.addEventListener(evt, listener, false); };
        BrowserDomAdapter.prototype.onAndCancel = function (el, evt, listener) {
            el.addEventListener(evt, listener, false);
            // Needed to follow Dart's subscription semantic, until fix of
            // https://code.google.com/p/dart/issues/detail?id=17406
            return function () { el.removeEventListener(evt, listener, false); };
        };
        BrowserDomAdapter.prototype.dispatchEvent = function (el, evt) { el.dispatchEvent(evt); };
        BrowserDomAdapter.prototype.createMouseEvent = function (eventType) {
            var evt = document.createEvent('MouseEvent');
            evt.initEvent(eventType, true, true);
            return evt;
        };
        BrowserDomAdapter.prototype.createEvent = function (eventType) {
            var evt = document.createEvent('Event');
            evt.initEvent(eventType, true, true);
            return evt;
        };
        BrowserDomAdapter.prototype.preventDefault = function (evt) {
            evt.preventDefault();
            evt.returnValue = false;
        };
        BrowserDomAdapter.prototype.isPrevented = function (evt) {
            return evt.defaultPrevented || isPresent(evt.returnValue) && !evt.returnValue;
        };
        BrowserDomAdapter.prototype.getInnerHTML = function (el) { return el.innerHTML; };
        BrowserDomAdapter.prototype.getOuterHTML = function (el) { return el.outerHTML; };
        BrowserDomAdapter.prototype.nodeName = function (node) { return node.nodeName; };
        BrowserDomAdapter.prototype.nodeValue = function (node) { return node.nodeValue; };
        BrowserDomAdapter.prototype.type = function (node) { return node.type; };
        BrowserDomAdapter.prototype.content = function (node) {
            if (this.hasProperty(node, "content")) {
                return node.content;
            }
            else {
                return node;
            }
        };
        BrowserDomAdapter.prototype.firstChild = function (el) { return el.firstChild; };
        BrowserDomAdapter.prototype.nextSibling = function (el) { return el.nextSibling; };
        BrowserDomAdapter.prototype.parentElement = function (el) { return el.parentNode; };
        BrowserDomAdapter.prototype.childNodes = function (el) { return el.childNodes; };
        BrowserDomAdapter.prototype.childNodesAsList = function (el) {
            var childNodes = el.childNodes;
            var res = ListWrapper.createFixedSize(childNodes.length);
            for (var i = 0; i < childNodes.length; i++) {
                res[i] = childNodes[i];
            }
            return res;
        };
        BrowserDomAdapter.prototype.clearNodes = function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }
        };
        BrowserDomAdapter.prototype.appendChild = function (el, node) { el.appendChild(node); };
        BrowserDomAdapter.prototype.removeChild = function (el, node) { el.removeChild(node); };
        BrowserDomAdapter.prototype.replaceChild = function (el, newChild, oldChild) { el.replaceChild(newChild, oldChild); };
        BrowserDomAdapter.prototype.remove = function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
            return node;
        };
        BrowserDomAdapter.prototype.insertBefore = function (el, node) { el.parentNode.insertBefore(node, el); };
        BrowserDomAdapter.prototype.insertAllBefore = function (el, nodes) { nodes.forEach(function (n) { return el.parentNode.insertBefore(n, el); }); };
        BrowserDomAdapter.prototype.insertAfter = function (el, node) { el.parentNode.insertBefore(node, el.nextSibling); };
        BrowserDomAdapter.prototype.setInnerHTML = function (el, value) { el.innerHTML = value; };
        BrowserDomAdapter.prototype.getText = function (el) { return el.textContent; };
        // TODO(vicb): removed Element type because it does not support StyleElement
        BrowserDomAdapter.prototype.setText = function (el, value) { el.textContent = value; };
        BrowserDomAdapter.prototype.getValue = function (el) { return el.value; };
        BrowserDomAdapter.prototype.setValue = function (el, value) { el.value = value; };
        BrowserDomAdapter.prototype.getChecked = function (el) { return el.checked; };
        BrowserDomAdapter.prototype.setChecked = function (el, value) { el.checked = value; };
        BrowserDomAdapter.prototype.createComment = function (text) { return document.createComment(text); };
        BrowserDomAdapter.prototype.createTemplate = function (html) {
            var t = document.createElement('template');
            t.innerHTML = html;
            return t;
        };
        BrowserDomAdapter.prototype.createElement = function (tagName, doc) {
            if (doc === void 0) { doc = document; }
            return doc.createElement(tagName);
        };
        BrowserDomAdapter.prototype.createElementNS = function (ns, tagName, doc) {
            if (doc === void 0) { doc = document; }
            return doc.createElementNS(ns, tagName);
        };
        BrowserDomAdapter.prototype.createTextNode = function (text, doc) {
            if (doc === void 0) { doc = document; }
            return doc.createTextNode(text);
        };
        BrowserDomAdapter.prototype.createScriptTag = function (attrName, attrValue, doc) {
            if (doc === void 0) { doc = document; }
            var el = doc.createElement('SCRIPT');
            el.setAttribute(attrName, attrValue);
            return el;
        };
        BrowserDomAdapter.prototype.createStyleElement = function (css, doc) {
            if (doc === void 0) { doc = document; }
            var style = doc.createElement('style');
            this.appendChild(style, this.createTextNode(css));
            return style;
        };
        BrowserDomAdapter.prototype.createShadowRoot = function (el) { return el.createShadowRoot(); };
        BrowserDomAdapter.prototype.getShadowRoot = function (el) { return el.shadowRoot; };
        BrowserDomAdapter.prototype.getHost = function (el) { return el.host; };
        BrowserDomAdapter.prototype.clone = function (node) { return node.cloneNode(true); };
        BrowserDomAdapter.prototype.getElementsByClassName = function (element, name) {
            return element.getElementsByClassName(name);
        };
        BrowserDomAdapter.prototype.getElementsByTagName = function (element, name) {
            return element.getElementsByTagName(name);
        };
        BrowserDomAdapter.prototype.classList = function (element) { return Array.prototype.slice.call(element.classList, 0); };
        BrowserDomAdapter.prototype.addClass = function (element, className) { element.classList.add(className); };
        BrowserDomAdapter.prototype.removeClass = function (element, className) { element.classList.remove(className); };
        BrowserDomAdapter.prototype.hasClass = function (element, className) { return element.classList.contains(className); };
        BrowserDomAdapter.prototype.setStyle = function (element, styleName, styleValue) {
            element.style[styleName] = styleValue;
        };
        BrowserDomAdapter.prototype.removeStyle = function (element, stylename) { element.style[stylename] = null; };
        BrowserDomAdapter.prototype.getStyle = function (element, stylename) { return element.style[stylename]; };
        BrowserDomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
            if (styleValue === void 0) { styleValue = null; }
            var value = this.getStyle(element, styleName) || '';
            return styleValue ? value == styleValue : value.length > 0;
        };
        BrowserDomAdapter.prototype.tagName = function (element) { return element.tagName; };
        BrowserDomAdapter.prototype.attributeMap = function (element) {
            var res = new Map();
            var elAttrs = element.attributes;
            for (var i = 0; i < elAttrs.length; i++) {
                var attrib = elAttrs[i];
                res.set(attrib.name, attrib.value);
            }
            return res;
        };
        BrowserDomAdapter.prototype.hasAttribute = function (element, attribute) { return element.hasAttribute(attribute); };
        BrowserDomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) {
            return element.hasAttributeNS(ns, attribute);
        };
        BrowserDomAdapter.prototype.getAttribute = function (element, attribute) { return element.getAttribute(attribute); };
        BrowserDomAdapter.prototype.getAttributeNS = function (element, ns, name) {
            return element.getAttributeNS(ns, name);
        };
        BrowserDomAdapter.prototype.setAttribute = function (element, name, value) { element.setAttribute(name, value); };
        BrowserDomAdapter.prototype.setAttributeNS = function (element, ns, name, value) {
            element.setAttributeNS(ns, name, value);
        };
        BrowserDomAdapter.prototype.removeAttribute = function (element, attribute) { element.removeAttribute(attribute); };
        BrowserDomAdapter.prototype.removeAttributeNS = function (element, ns, name) { element.removeAttributeNS(ns, name); };
        BrowserDomAdapter.prototype.templateAwareRoot = function (el) { return this.isTemplateElement(el) ? this.content(el) : el; };
        BrowserDomAdapter.prototype.createHtmlDocument = function () {
            return document.implementation.createHTMLDocument('fakeTitle');
        };
        BrowserDomAdapter.prototype.defaultDoc = function () { return document; };
        BrowserDomAdapter.prototype.getBoundingClientRect = function (el) {
            try {
                return el.getBoundingClientRect();
            }
            catch (e) {
                return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
            }
        };
        BrowserDomAdapter.prototype.getTitle = function () { return document.title; };
        BrowserDomAdapter.prototype.setTitle = function (newTitle) { document.title = newTitle || ''; };
        BrowserDomAdapter.prototype.elementMatches = function (n, selector) {
            var matches = false;
            if (n instanceof HTMLElement) {
                if (n.matches) {
                    matches = n.matches(selector);
                }
                else if (n.msMatchesSelector) {
                    matches = n.msMatchesSelector(selector);
                }
                else if (n.webkitMatchesSelector) {
                    matches = n.webkitMatchesSelector(selector);
                }
            }
            return matches;
        };
        BrowserDomAdapter.prototype.isTemplateElement = function (el) {
            return el instanceof HTMLElement && el.nodeName == "TEMPLATE";
        };
        BrowserDomAdapter.prototype.isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };
        BrowserDomAdapter.prototype.isCommentNode = function (node) { return node.nodeType === Node.COMMENT_NODE; };
        BrowserDomAdapter.prototype.isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };
        BrowserDomAdapter.prototype.hasShadowRoot = function (node) { return node instanceof HTMLElement && isPresent(node.shadowRoot); };
        BrowserDomAdapter.prototype.isShadowRoot = function (node) { return node instanceof DocumentFragment; };
        BrowserDomAdapter.prototype.importIntoDoc = function (node) {
            var toImport = node;
            if (this.isTemplateElement(node)) {
                toImport = this.content(node);
            }
            return document.importNode(toImport, true);
        };
        BrowserDomAdapter.prototype.adoptNode = function (node) { return document.adoptNode(node); };
        BrowserDomAdapter.prototype.getHref = function (el) { return el.href; };
        BrowserDomAdapter.prototype.getEventKey = function (event) {
            var key = event.key;
            if (isBlank(key)) {
                key = event.keyIdentifier;
                // keyIdentifier is defined in the old draft of DOM Level 3 Events implemented by Chrome and
                // Safari
                // cf
                // http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/events.html#Events-KeyboardEvents-Interfaces
                if (isBlank(key)) {
                    return 'Unidentified';
                }
                if (key.startsWith('U+')) {
                    key = String.fromCharCode(parseInt(key.substring(2), 16));
                    if (event.location === DOM_KEY_LOCATION_NUMPAD && _chromeNumKeyPadMap.hasOwnProperty(key)) {
                        // There is a bug in Chrome for numeric keypad keys:
                        // https://code.google.com/p/chromium/issues/detail?id=155654
                        // 1, 2, 3 ... are reported as A, B, C ...
                        key = _chromeNumKeyPadMap[key];
                    }
                }
            }
            if (_keyMap.hasOwnProperty(key)) {
                key = _keyMap[key];
            }
            return key;
        };
        BrowserDomAdapter.prototype.getGlobalEventTarget = function (target) {
            if (target == "window") {
                return window;
            }
            else if (target == "document") {
                return document;
            }
            else if (target == "body") {
                return document.body;
            }
        };
        BrowserDomAdapter.prototype.getHistory = function () { return window.history; };
        BrowserDomAdapter.prototype.getLocation = function () { return window.location; };
        BrowserDomAdapter.prototype.getBaseHref = function () {
            var href = getBaseElementHref();
            if (isBlank(href)) {
                return null;
            }
            return relativePath(href);
        };
        BrowserDomAdapter.prototype.resetBaseElement = function () { baseElement = null; };
        BrowserDomAdapter.prototype.getUserAgent = function () { return window.navigator.userAgent; };
        BrowserDomAdapter.prototype.setData = function (element, name, value) {
            this.setAttribute(element, 'data-' + name, value);
        };
        BrowserDomAdapter.prototype.getData = function (element, name) { return this.getAttribute(element, 'data-' + name); };
        BrowserDomAdapter.prototype.getComputedStyle = function (element) { return getComputedStyle(element); };
        // TODO(tbosch): move this into a separate environment class once we have it
        BrowserDomAdapter.prototype.setGlobalVar = function (path, value) { setValueOnPath(global$1, path, value); };
        BrowserDomAdapter.prototype.requestAnimationFrame = function (callback) { return window.requestAnimationFrame(callback); };
        BrowserDomAdapter.prototype.cancelAnimationFrame = function (id) { window.cancelAnimationFrame(id); };
        BrowserDomAdapter.prototype.performanceNow = function () {
            // performance.now() is not available in all browsers, see
            // http://caniuse.com/#search=performance.now
            if (isPresent(window.performance) && isPresent(window.performance.now)) {
                return window.performance.now();
            }
            else {
                return DateWrapper.toMillis(DateWrapper.now());
            }
        };
        return BrowserDomAdapter;
    }(GenericBrowserDomAdapter));
    var baseElement = null;
    function getBaseElementHref() {
        if (isBlank(baseElement)) {
            baseElement = document.querySelector('base');
            if (isBlank(baseElement)) {
                return null;
            }
        }
        return baseElement.getAttribute('href');
    }
    // based on urlUtils.js in AngularJS 1
    var urlParsingNode = null;
    function relativePath(url) {
        if (isBlank(urlParsingNode)) {
            urlParsingNode = document.createElement("a");
        }
        urlParsingNode.setAttribute('href', url);
        return (urlParsingNode.pathname.charAt(0) === '/') ? urlParsingNode.pathname :
        '/' + urlParsingNode.pathname;
    }
    var PublicTestability = (function () {
        function PublicTestability(testability) {
            this._testability = testability;
        }
        PublicTestability.prototype.isStable = function () { return this._testability.isStable(); };
        PublicTestability.prototype.whenStable = function (callback) { this._testability.whenStable(callback); };
        PublicTestability.prototype.findBindings = function (using, provider, exactMatch) {
            return this.findProviders(using, provider, exactMatch);
        };
        PublicTestability.prototype.findProviders = function (using, provider, exactMatch) {
            return this._testability.findBindings(using, provider, exactMatch);
        };
        return PublicTestability;
    }());
    var BrowserGetTestability = (function () {
        function BrowserGetTestability() {
        }
        BrowserGetTestability.init = function () { _angular_core.setTestabilityGetter(new BrowserGetTestability()); };
        BrowserGetTestability.prototype.addToWindow = function (registry) {
            global$1.getAngularTestability = function (elem, findInAncestors) {
                if (findInAncestors === void 0) { findInAncestors = true; }
                var testability = registry.findTestabilityInTree(elem, findInAncestors);
                if (testability == null) {
                    throw new Error('Could not find testability for element.');
                }
                return new PublicTestability(testability);
            };
            global$1.getAllAngularTestabilities = function () {
                var testabilities = registry.getAllTestabilities();
                return testabilities.map(function (testability) { return new PublicTestability(testability); });
            };
            global$1.getAllAngularRootElements = function () { return registry.getAllRootElements(); };
            var whenAllStable = function (callback) {
                var testabilities = global$1.getAllAngularTestabilities();
                var count = testabilities.length;
                var didWork = false;
                var decrement = function (didWork_) {
                    didWork = didWork || didWork_;
                    count--;
                    if (count == 0) {
                        callback(didWork);
                    }
                };
                testabilities.forEach(function (testability) { testability.whenStable(decrement); });
            };
            if (!global$1.frameworkStabilizers) {
                global$1.frameworkStabilizers = ListWrapper.createGrowableSize(0);
            }
            global$1.frameworkStabilizers.push(whenAllStable);
        };
        BrowserGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
            if (elem == null) {
                return null;
            }
            var t = registry.getTestability(elem);
            if (isPresent(t)) {
                return t;
            }
            else if (!findInAncestors) {
                return null;
            }
            if (getDOM().isShadowRoot(elem)) {
                return this.findTestabilityInTree(registry, getDOM().getHost(elem), true);
            }
            return this.findTestabilityInTree(registry, getDOM().parentElement(elem), true);
        };
        return BrowserGetTestability;
    }());
    /**
     * A DI Token representing the main rendering context. In a browser this is the DOM Document.
     *
     * Note: Document might not be available in the Application Context when Application and Rendering
     * Contexts are not the same (e.g. when running the application into a Web Worker).
     */
    var DOCUMENT = new _angular_core.OpaqueToken('DocumentToken');
    var BaseException = (function (_super) {
        __extends(BaseException, _super);
        function BaseException(message) {
            if (message === void 0) { message = "--"; }
            _super.call(this, message);
            this.message = message;
            this.stack = (new Error(message)).stack;
        }
        BaseException.prototype.toString = function () { return this.message; };
        return BaseException;
    }(Error));
    var EVENT_MANAGER_PLUGINS =
        /*@ts2dart_const*/ new _angular_core.OpaqueToken("EventManagerPlugins");
    var EventManager = (function () {
        function EventManager(plugins, _zone) {
            var _this = this;
            this._zone = _zone;
            plugins.forEach(function (p) { return p.manager = _this; });
            this._plugins = ListWrapper.reversed(plugins);
        }
        EventManager.prototype.addEventListener = function (element, eventName, handler) {
            var plugin = this._findPluginFor(eventName);
            return plugin.addEventListener(element, eventName, handler);
        };
        EventManager.prototype.addGlobalEventListener = function (target, eventName, handler) {
            var plugin = this._findPluginFor(eventName);
            return plugin.addGlobalEventListener(target, eventName, handler);
        };
        EventManager.prototype.getZone = function () { return this._zone; };
        /** @internal */
        EventManager.prototype._findPluginFor = function (eventName) {
            var plugins = this._plugins;
            for (var i = 0; i < plugins.length; i++) {
                var plugin = plugins[i];
                if (plugin.supports(eventName)) {
                    return plugin;
                }
            }
            throw new BaseException("No event manager plugin found for event " + eventName);
        };
        return EventManager;
    }());
    EventManager.decorators = [
        { type: _angular_core.Injectable },
    ];
    EventManager.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [EVENT_MANAGER_PLUGINS,] },] },
        { type: _angular_core.NgZone, },
    ];
    var EventManagerPlugin = (function () {
        function EventManagerPlugin() {
        }
        // That is equivalent to having supporting $event.target
        EventManagerPlugin.prototype.supports = function (eventName) { return false; };
        EventManagerPlugin.prototype.addEventListener = function (element, eventName, handler) {
            throw "not implemented";
        };
        EventManagerPlugin.prototype.addGlobalEventListener = function (element, eventName, handler) {
            throw "not implemented";
        };
        return EventManagerPlugin;
    }());
    var CssAnimationOptions = (function () {
        function CssAnimationOptions() {
            /** classes to be added to the element */
            this.classesToAdd = [];
            /** classes to be removed from the element */
            this.classesToRemove = [];
            /** classes to be added for the duration of the animation */
            this.animationClasses = [];
        }
        return CssAnimationOptions;
    }());
    var Math$1 = global$1.Math;
    var CAMEL_CASE_REGEXP = /([A-Z])/g;
    function camelCaseToDashCase(input) {
        return StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) { return '-' + m[1].toLowerCase(); });
    }
    var Animation = (function () {
        /**
         * Stores the start time and starts the animation
         * @param element
         * @param data
         * @param browserDetails
         */
        function Animation(element, data, browserDetails) {
            var _this = this;
            this.element = element;
            this.data = data;
            this.browserDetails = browserDetails;
            /** functions to be called upon completion */
            this.callbacks = [];
            /** functions for removing event listeners */
            this.eventClearFunctions = [];
            /** flag used to track whether or not the animation has finished */
            this.completed = false;
            this._stringPrefix = '';
            this.startTime = DateWrapper.toMillis(DateWrapper.now());
            this._stringPrefix = getDOM().getAnimationPrefix();
            this.setup();
            this.wait(function (timestamp) { return _this.start(); });
        }
        Object.defineProperty(Animation.prototype, "totalTime", {
            /** total amount of time that the animation should take including delay */
            get: function () {
                var delay = this.computedDelay != null ? this.computedDelay : 0;
                var duration = this.computedDuration != null ? this.computedDuration : 0;
                return delay + duration;
            },
            enumerable: true,
            configurable: true
        });
        Animation.prototype.wait = function (callback) {
            // Firefox requires 2 frames for some reason
            this.browserDetails.raf(callback, 2);
        };
        /**
         * Sets up the initial styles before the animation is started
         */
        Animation.prototype.setup = function () {
            if (this.data.fromStyles != null)
                this.applyStyles(this.data.fromStyles);
            if (this.data.duration != null)
                this.applyStyles({ 'transitionDuration': this.data.duration.toString() + 'ms' });
            if (this.data.delay != null)
                this.applyStyles({ 'transitionDelay': this.data.delay.toString() + 'ms' });
        };
        /**
         * After the initial setup has occurred, this method adds the animation styles
         */
        Animation.prototype.start = function () {
            this.addClasses(this.data.classesToAdd);
            this.addClasses(this.data.animationClasses);
            this.removeClasses(this.data.classesToRemove);
            if (this.data.toStyles != null)
                this.applyStyles(this.data.toStyles);
            var computedStyles = getDOM().getComputedStyle(this.element);
            this.computedDelay =
                Math$1.max(this.parseDurationString(computedStyles.getPropertyValue(this._stringPrefix + 'transition-delay')), this.parseDurationString(this.element.style.getPropertyValue(this._stringPrefix + 'transition-delay')));
            this.computedDuration = Math$1.max(this.parseDurationString(computedStyles.getPropertyValue(this._stringPrefix + 'transition-duration')), this.parseDurationString(this.element.style.getPropertyValue(this._stringPrefix + 'transition-duration')));
            this.addEvents();
        };
        /**
         * Applies the provided styles to the element
         * @param styles
         */
        Animation.prototype.applyStyles = function (styles) {
            var _this = this;
            StringMapWrapper.forEach(styles, function (value, key) {
                var dashCaseKey = camelCaseToDashCase(key);
                if (isPresent(getDOM().getStyle(_this.element, dashCaseKey))) {
                    getDOM().setStyle(_this.element, dashCaseKey, value.toString());
                }
                else {
                    getDOM().setStyle(_this.element, _this._stringPrefix + dashCaseKey, value.toString());
                }
            });
        };
        /**
         * Adds the provided classes to the element
         * @param classes
         */
        Animation.prototype.addClasses = function (classes) {
            for (var i = 0, len = classes.length; i < len; i++)
                getDOM().addClass(this.element, classes[i]);
        };
        /**
         * Removes the provided classes from the element
         * @param classes
         */
        Animation.prototype.removeClasses = function (classes) {
            for (var i = 0, len = classes.length; i < len; i++)
                getDOM().removeClass(this.element, classes[i]);
        };
        /**
         * Adds events to track when animations have finished
         */
        Animation.prototype.addEvents = function () {
            var _this = this;
            if (this.totalTime > 0) {
                this.eventClearFunctions.push(getDOM().onAndCancel(this.element, getDOM().getTransitionEnd(), function (event) { return _this.handleAnimationEvent(event); }));
            }
            else {
                this.handleAnimationCompleted();
            }
        };
        Animation.prototype.handleAnimationEvent = function (event) {
            var elapsedTime = Math$1.round(event.elapsedTime * 1000);
            if (!this.browserDetails.elapsedTimeIncludesDelay)
                elapsedTime += this.computedDelay;
            event.stopPropagation();
            if (elapsedTime >= this.totalTime)
                this.handleAnimationCompleted();
        };
        /**
         * Runs all animation callbacks and removes temporary classes
         */
        Animation.prototype.handleAnimationCompleted = function () {
            this.removeClasses(this.data.animationClasses);
            this.callbacks.forEach(function (callback) { return callback(); });
            this.callbacks = [];
            this.eventClearFunctions.forEach(function (fn) { return fn(); });
            this.eventClearFunctions = [];
            this.completed = true;
        };
        /**
         * Adds animation callbacks to be called upon completion
         * @param callback
         * @returns {Animation}
         */
        Animation.prototype.onComplete = function (callback) {
            if (this.completed) {
                callback();
            }
            else {
                this.callbacks.push(callback);
            }
            return this;
        };
        /**
         * Converts the duration string to the number of milliseconds
         * @param duration
         * @returns {number}
         */
        Animation.prototype.parseDurationString = function (duration) {
            var maxValue = 0;
            // duration must have at least 2 characters to be valid. (number + type)
            if (duration == null || duration.length < 2) {
                return maxValue;
            }
            else if (duration.substring(duration.length - 2) == 'ms') {
                var value = NumberWrapper.parseInt(this.stripLetters(duration), 10);
                if (value > maxValue)
                    maxValue = value;
            }
            else if (duration.substring(duration.length - 1) == 's') {
                var ms = NumberWrapper.parseFloat(this.stripLetters(duration)) * 1000;
                var value = Math$1.floor(ms);
                if (value > maxValue)
                    maxValue = value;
            }
            return maxValue;
        };
        /**
         * Strips the letters from the duration string
         * @param str
         * @returns {string}
         */
        Animation.prototype.stripLetters = function (str) {
            return StringWrapper.replaceAll(str, RegExpWrapper.create('[^0-9]+$', ''), '');
        };
        return Animation;
    }());
    var CssAnimationBuilder = (function () {
        /**
         * Accepts public properties for CssAnimationBuilder
         */
        function CssAnimationBuilder(browserDetails) {
            this.browserDetails = browserDetails;
            /** @type {CssAnimationOptions} */
            this.data = new CssAnimationOptions();
        }
        /**
         * Adds a temporary class that will be removed at the end of the animation
         * @param className
         */
        CssAnimationBuilder.prototype.addAnimationClass = function (className) {
            this.data.animationClasses.push(className);
            return this;
        };
        /**
         * Adds a class that will remain on the element after the animation has finished
         * @param className
         */
        CssAnimationBuilder.prototype.addClass = function (className) {
            this.data.classesToAdd.push(className);
            return this;
        };
        /**
         * Removes a class from the element
         * @param className
         */
        CssAnimationBuilder.prototype.removeClass = function (className) {
            this.data.classesToRemove.push(className);
            return this;
        };
        /**
         * Sets the animation duration (and overrides any defined through CSS)
         * @param duration
         */
        CssAnimationBuilder.prototype.setDuration = function (duration) {
            this.data.duration = duration;
            return this;
        };
        /**
         * Sets the animation delay (and overrides any defined through CSS)
         * @param delay
         */
        CssAnimationBuilder.prototype.setDelay = function (delay) {
            this.data.delay = delay;
            return this;
        };
        /**
         * Sets styles for both the initial state and the destination state
         * @param from
         * @param to
         */
        CssAnimationBuilder.prototype.setStyles = function (from, to) {
            return this.setFromStyles(from).setToStyles(to);
        };
        /**
         * Sets the initial styles for the animation
         * @param from
         */
        CssAnimationBuilder.prototype.setFromStyles = function (from) {
            this.data.fromStyles = from;
            return this;
        };
        /**
         * Sets the destination styles for the animation
         * @param to
         */
        CssAnimationBuilder.prototype.setToStyles = function (to) {
            this.data.toStyles = to;
            return this;
        };
        /**
         * Starts the animation and returns a promise
         * @param element
         */
        CssAnimationBuilder.prototype.start = function (element) {
            return new Animation(element, this.data, this.browserDetails);
        };
        return CssAnimationBuilder;
    }());
    var BrowserDetails = (function () {
        function BrowserDetails() {
            this.elapsedTimeIncludesDelay = false;
            this.doesElapsedTimeIncludesDelay();
        }
        /**
         * Determines if `event.elapsedTime` includes transition delay in the current browser.  At this
         * time, Chrome and Opera seem to be the only browsers that include this.
         */
        BrowserDetails.prototype.doesElapsedTimeIncludesDelay = function () {
            var _this = this;
            var div = getDOM().createElement('div');
            getDOM().setAttribute(div, 'style', "position: absolute; top: -9999px; left: -9999px; width: 1px;\n      height: 1px; transition: all 1ms linear 1ms;");
            // Firefox requires that we wait for 2 frames for some reason
            this.raf(function (timestamp) {
                getDOM().on(div, 'transitionend', function (event) {
                    var elapsed = Math$1.round(event.elapsedTime * 1000);
                    _this.elapsedTimeIncludesDelay = elapsed == 2;
                    getDOM().remove(div);
                });
                getDOM().setStyle(div, 'width', '2px');
            }, 2);
        };
        BrowserDetails.prototype.raf = function (callback, frames) {
            if (frames === void 0) { frames = 1; }
            var queue = new RafQueue(callback, frames);
            return function () { return queue.cancel(); };
        };
        return BrowserDetails;
    }());
    BrowserDetails.decorators = [
        { type: _angular_core.Injectable },
    ];
    BrowserDetails.ctorParameters = [];
    var RafQueue = (function () {
        function RafQueue(callback, frames) {
            this.callback = callback;
            this.frames = frames;
            this._raf();
        }
        RafQueue.prototype._raf = function () {
            var _this = this;
            this.currentFrameId =
                getDOM().requestAnimationFrame(function (timestamp) { return _this._nextFrame(timestamp); });
        };
        RafQueue.prototype._nextFrame = function (timestamp) {
            this.frames--;
            if (this.frames > 0) {
                this._raf();
            }
            else {
                this.callback(timestamp);
            }
        };
        RafQueue.prototype.cancel = function () {
            getDOM().cancelAnimationFrame(this.currentFrameId);
            this.currentFrameId = null;
        };
        return RafQueue;
    }());
    var AnimationBuilder = (function () {
        /**
         * Used for DI
         * @param browserDetails
         */
        function AnimationBuilder(browserDetails) {
            this.browserDetails = browserDetails;
        }
        /**
         * Creates a new CSS Animation
         * @returns {CssAnimationBuilder}
         */
        AnimationBuilder.prototype.css = function () { return new CssAnimationBuilder(this.browserDetails); };
        return AnimationBuilder;
    }());
    AnimationBuilder.decorators = [
        { type: _angular_core.Injectable },
    ];
    AnimationBuilder.ctorParameters = [
        { type: BrowserDetails, },
    ];
    var SharedStylesHost = (function () {
        function SharedStylesHost() {
            /** @internal */
            this._styles = [];
            /** @internal */
            this._stylesSet = new Set();
        }
        SharedStylesHost.prototype.addStyles = function (styles) {
            var _this = this;
            var additions = [];
            styles.forEach(function (style) {
                if (!SetWrapper.has(_this._stylesSet, style)) {
                    _this._stylesSet.add(style);
                    _this._styles.push(style);
                    additions.push(style);
                }
            });
            this.onStylesAdded(additions);
        };
        SharedStylesHost.prototype.onStylesAdded = function (additions) { };
        SharedStylesHost.prototype.getAllStyles = function () { return this._styles; };
        return SharedStylesHost;
    }());
    SharedStylesHost.decorators = [
        { type: _angular_core.Injectable },
    ];
    SharedStylesHost.ctorParameters = [];
    var DomSharedStylesHost = (function (_super) {
        __extends(DomSharedStylesHost, _super);
        function DomSharedStylesHost(doc) {
            _super.call(this);
            this._hostNodes = new Set();
            this._hostNodes.add(doc.head);
        }
        /** @internal */
        DomSharedStylesHost.prototype._addStylesToHost = function (styles, host) {
            for (var i = 0; i < styles.length; i++) {
                var style = styles[i];
                getDOM().appendChild(host, getDOM().createStyleElement(style));
            }
        };
        DomSharedStylesHost.prototype.addHost = function (hostNode) {
            this._addStylesToHost(this._styles, hostNode);
            this._hostNodes.add(hostNode);
        };
        DomSharedStylesHost.prototype.removeHost = function (hostNode) { SetWrapper.delete(this._hostNodes, hostNode); };
        DomSharedStylesHost.prototype.onStylesAdded = function (additions) {
            var _this = this;
            this._hostNodes.forEach(function (hostNode) { _this._addStylesToHost(additions, hostNode); });
        };
        return DomSharedStylesHost;
    }(SharedStylesHost));
    DomSharedStylesHost.decorators = [
        { type: _angular_core.Injectable },
    ];
    DomSharedStylesHost.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
    ];
    var NAMESPACE_URIS =
        /*@ts2dart_const*/
        { 'xlink': 'http://www.w3.org/1999/xlink', 'svg': 'http://www.w3.org/2000/svg' };
    var TEMPLATE_COMMENT_TEXT = 'template bindings={}';
    var TEMPLATE_BINDINGS_EXP = /^template bindings=(.*)$/g;
    var DomRootRenderer = (function () {
        function DomRootRenderer(document, eventManager, sharedStylesHost, animate) {
            this.document = document;
            this.eventManager = eventManager;
            this.sharedStylesHost = sharedStylesHost;
            this.animate = animate;
            this._registeredComponents = new Map();
        }
        DomRootRenderer.prototype.renderComponent = function (componentProto) {
            var renderer = this._registeredComponents.get(componentProto.id);
            if (isBlank(renderer)) {
                renderer = new DomRenderer(this, componentProto);
                this._registeredComponents.set(componentProto.id, renderer);
            }
            return renderer;
        };
        return DomRootRenderer;
    }());
    var DomRootRenderer_ = (function (_super) {
        __extends(DomRootRenderer_, _super);
        function DomRootRenderer_(_document, _eventManager, sharedStylesHost, animate) {
            _super.call(this, _document, _eventManager, sharedStylesHost, animate);
        }
        return DomRootRenderer_;
    }(DomRootRenderer));
    DomRootRenderer_.decorators = [
        { type: _angular_core.Injectable },
    ];
    DomRootRenderer_.ctorParameters = [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [DOCUMENT,] },] },
        { type: EventManager, },
        { type: DomSharedStylesHost, },
        { type: AnimationBuilder, },
    ];
    var DomRenderer = (function () {
        function DomRenderer(_rootRenderer, componentProto) {
            this._rootRenderer = _rootRenderer;
            this.componentProto = componentProto;
            this._styles = _flattenStyles(componentProto.id, componentProto.styles, []);
            if (componentProto.encapsulation !== _angular_core.ViewEncapsulation.Native) {
                this._rootRenderer.sharedStylesHost.addStyles(this._styles);
            }
            if (this.componentProto.encapsulation === _angular_core.ViewEncapsulation.Emulated) {
                this._contentAttr = _shimContentAttribute(componentProto.id);
                this._hostAttr = _shimHostAttribute(componentProto.id);
            }
            else {
                this._contentAttr = null;
                this._hostAttr = null;
            }
        }
        DomRenderer.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
            var el;
            if (isString(selectorOrNode)) {
                el = getDOM().querySelector(this._rootRenderer.document, selectorOrNode);
                if (isBlank(el)) {
                    throw new BaseException("The selector \"" + selectorOrNode + "\" did not match any elements");
                }
            }
            else {
                el = selectorOrNode;
            }
            getDOM().clearNodes(el);
            return el;
        };
        DomRenderer.prototype.createElement = function (parent, name, debugInfo) {
            var nsAndName = splitNamespace(name);
            var el = isPresent(nsAndName[0]) ?
                getDOM().createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]) :
                getDOM().createElement(nsAndName[1]);
            if (isPresent(this._contentAttr)) {
                getDOM().setAttribute(el, this._contentAttr, '');
            }
            if (isPresent(parent)) {
                getDOM().appendChild(parent, el);
            }
            return el;
        };
        DomRenderer.prototype.createViewRoot = function (hostElement) {
            var nodesParent;
            if (this.componentProto.encapsulation === _angular_core.ViewEncapsulation.Native) {
                nodesParent = getDOM().createShadowRoot(hostElement);
                this._rootRenderer.sharedStylesHost.addHost(nodesParent);
                for (var i = 0; i < this._styles.length; i++) {
                    getDOM().appendChild(nodesParent, getDOM().createStyleElement(this._styles[i]));
                }
            }
            else {
                if (isPresent(this._hostAttr)) {
                    getDOM().setAttribute(hostElement, this._hostAttr, '');
                }
                nodesParent = hostElement;
            }
            return nodesParent;
        };
        DomRenderer.prototype.createTemplateAnchor = function (parentElement, debugInfo) {
            var comment = getDOM().createComment(TEMPLATE_COMMENT_TEXT);
            if (isPresent(parentElement)) {
                getDOM().appendChild(parentElement, comment);
            }
            return comment;
        };
        DomRenderer.prototype.createText = function (parentElement, value, debugInfo) {
            var node = getDOM().createTextNode(value);
            if (isPresent(parentElement)) {
                getDOM().appendChild(parentElement, node);
            }
            return node;
        };
        DomRenderer.prototype.projectNodes = function (parentElement, nodes) {
            if (isBlank(parentElement))
                return;
            appendNodes(parentElement, nodes);
        };
        DomRenderer.prototype.attachViewAfter = function (node, viewRootNodes) {
            moveNodesAfterSibling(node, viewRootNodes);
            for (var i = 0; i < viewRootNodes.length; i++)
                this.animateNodeEnter(viewRootNodes[i]);
        };
        DomRenderer.prototype.detachView = function (viewRootNodes) {
            for (var i = 0; i < viewRootNodes.length; i++) {
                var node = viewRootNodes[i];
                getDOM().remove(node);
                this.animateNodeLeave(node);
            }
        };
        DomRenderer.prototype.destroyView = function (hostElement, viewAllNodes) {
            if (this.componentProto.encapsulation === _angular_core.ViewEncapsulation.Native && isPresent(hostElement)) {
                this._rootRenderer.sharedStylesHost.removeHost(getDOM().getShadowRoot(hostElement));
            }
        };
        DomRenderer.prototype.listen = function (renderElement, name, callback) {
            return this._rootRenderer.eventManager.addEventListener(renderElement, name, decoratePreventDefault(callback));
        };
        DomRenderer.prototype.listenGlobal = function (target, name, callback) {
            return this._rootRenderer.eventManager.addGlobalEventListener(target, name, decoratePreventDefault(callback));
        };
        DomRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
            getDOM().setProperty(renderElement, propertyName, propertyValue);
        };
        DomRenderer.prototype.setElementAttribute = function (renderElement, attributeName, attributeValue) {
            var attrNs;
            var nsAndName = splitNamespace(attributeName);
            if (isPresent(nsAndName[0])) {
                attributeName = nsAndName[0] + ':' + nsAndName[1];
                attrNs = NAMESPACE_URIS[nsAndName[0]];
            }
            if (isPresent(attributeValue)) {
                if (isPresent(attrNs)) {
                    getDOM().setAttributeNS(renderElement, attrNs, attributeName, attributeValue);
                }
                else {
                    getDOM().setAttribute(renderElement, attributeName, attributeValue);
                }
            }
            else {
                if (isPresent(attrNs)) {
                    getDOM().removeAttributeNS(renderElement, attrNs, nsAndName[1]);
                }
                else {
                    getDOM().removeAttribute(renderElement, attributeName);
                }
            }
        };
        DomRenderer.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {
            var dashCasedPropertyName = camelCaseToDashCase(propertyName);
            if (getDOM().isCommentNode(renderElement)) {
                var existingBindings = RegExpWrapper.firstMatch(TEMPLATE_BINDINGS_EXP, StringWrapper.replaceAll(getDOM().getText(renderElement), /\n/g, ''));
                var parsedBindings = Json.parse(existingBindings[1]);
                parsedBindings[dashCasedPropertyName] = propertyValue;
                getDOM().setText(renderElement, StringWrapper.replace(TEMPLATE_COMMENT_TEXT, '{}', Json.stringify(parsedBindings)));
            }
            else {
                this.setElementAttribute(renderElement, propertyName, propertyValue);
            }
        };
        DomRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
            if (isAdd) {
                getDOM().addClass(renderElement, className);
            }
            else {
                getDOM().removeClass(renderElement, className);
            }
        };
        DomRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
            if (isPresent(styleValue)) {
                getDOM().setStyle(renderElement, styleName, stringify(styleValue));
            }
            else {
                getDOM().removeStyle(renderElement, styleName);
            }
        };
        DomRenderer.prototype.invokeElementMethod = function (renderElement, methodName, args) {
            getDOM().invoke(renderElement, methodName, args);
        };
        DomRenderer.prototype.setText = function (renderNode, text) { getDOM().setText(renderNode, text); };
        /**
         * Performs animations if necessary
         * @param node
         */
        DomRenderer.prototype.animateNodeEnter = function (node) {
            if (getDOM().isElementNode(node) && getDOM().hasClass(node, 'ng-animate')) {
                getDOM().addClass(node, 'ng-enter');
                this._rootRenderer.animate.css()
                    .addAnimationClass('ng-enter-active')
                    .start(node)
                    .onComplete(function () { getDOM().removeClass(node, 'ng-enter'); });
            }
        };
        /**
         * If animations are necessary, performs animations then removes the element; otherwise, it just
         * removes the element.
         * @param node
         */
        DomRenderer.prototype.animateNodeLeave = function (node) {
            if (getDOM().isElementNode(node) && getDOM().hasClass(node, 'ng-animate')) {
                getDOM().addClass(node, 'ng-leave');
                this._rootRenderer.animate.css()
                    .addAnimationClass('ng-leave-active')
                    .start(node)
                    .onComplete(function () {
                        getDOM().removeClass(node, 'ng-leave');
                        getDOM().remove(node);
                    });
            }
            else {
                getDOM().remove(node);
            }
        };
        return DomRenderer;
    }());
    function moveNodesAfterSibling(sibling, nodes) {
        var parent = getDOM().parentElement(sibling);
        if (nodes.length > 0 && isPresent(parent)) {
            var nextSibling = getDOM().nextSibling(sibling);
            if (isPresent(nextSibling)) {
                for (var i = 0; i < nodes.length; i++) {
                    getDOM().insertBefore(nextSibling, nodes[i]);
                }
            }
            else {
                for (var i = 0; i < nodes.length; i++) {
                    getDOM().appendChild(parent, nodes[i]);
                }
            }
        }
    }
    function appendNodes(parent, nodes) {
        for (var i = 0; i < nodes.length; i++) {
            getDOM().appendChild(parent, nodes[i]);
        }
    }
    function decoratePreventDefault(eventHandler) {
        return function (event) {
            var allowDefaultBehavior = eventHandler(event);
            if (allowDefaultBehavior === false) {
                // TODO(tbosch): move preventDefault into event plugins...
                getDOM().preventDefault(event);
            }
        };
    }
    var COMPONENT_REGEX = /%COMP%/g;
    var COMPONENT_VARIABLE = '%COMP%';
    var HOST_ATTR = "_nghost-" + COMPONENT_VARIABLE;
    var CONTENT_ATTR = "_ngcontent-" + COMPONENT_VARIABLE;
    function _shimContentAttribute(componentShortId) {
        return StringWrapper.replaceAll(CONTENT_ATTR, COMPONENT_REGEX, componentShortId);
    }
    function _shimHostAttribute(componentShortId) {
        return StringWrapper.replaceAll(HOST_ATTR, COMPONENT_REGEX, componentShortId);
    }
    function _flattenStyles(compId, styles, target) {
        for (var i = 0; i < styles.length; i++) {
            var style = styles[i];
            if (isArray(style)) {
                _flattenStyles(compId, style, target);
            }
            else {
                style = StringWrapper.replaceAll(style, COMPONENT_REGEX, compId);
                target.push(style);
            }
        }
        return target;
    }
    var NS_PREFIX_RE = /^@([^:]+):(.+)/g;
    function splitNamespace(name) {
        if (name[0] != '@') {
            return [null, name];
        }
        var match = RegExpWrapper.firstMatch(NS_PREFIX_RE, name);
        return [match[1], match[2]];
    }
    var modifierKeys = ['alt', 'control', 'meta', 'shift'];
    var modifierKeyGetters = {
        'alt': function (event) { return event.altKey; },
        'control': function (event) { return event.ctrlKey; },
        'meta': function (event) { return event.metaKey; },
        'shift': function (event) { return event.shiftKey; }
    };
    var KeyEventsPlugin = (function (_super) {
        __extends(KeyEventsPlugin, _super);
        function KeyEventsPlugin() {
            _super.call(this);
        }
        KeyEventsPlugin.prototype.supports = function (eventName) {
            return isPresent(KeyEventsPlugin.parseEventName(eventName));
        };
        KeyEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
            var parsedEvent = KeyEventsPlugin.parseEventName(eventName);
            var outsideHandler = KeyEventsPlugin.eventCallback(element, StringMapWrapper.get(parsedEvent, 'fullKey'), handler, this.manager.getZone());
            return this.manager.getZone().runOutsideAngular(function () {
                return getDOM().onAndCancel(element, StringMapWrapper.get(parsedEvent, 'domEventName'), outsideHandler);
            });
        };
        KeyEventsPlugin.parseEventName = function (eventName) {
            var parts = eventName.toLowerCase().split('.');
            var domEventName = parts.shift();
            if ((parts.length === 0) ||
                !(StringWrapper.equals(domEventName, 'keydown') ||
                StringWrapper.equals(domEventName, 'keyup'))) {
                return null;
            }
            var key = KeyEventsPlugin._normalizeKey(parts.pop());
            var fullKey = '';
            modifierKeys.forEach(function (modifierName) {
                if (ListWrapper.contains(parts, modifierName)) {
                    ListWrapper.remove(parts, modifierName);
                    fullKey += modifierName + '.';
                }
            });
            fullKey += key;
            if (parts.length != 0 || key.length === 0) {
                // returning null instead of throwing to let another plugin process the event
                return null;
            }
            var result = StringMapWrapper.create();
            StringMapWrapper.set(result, 'domEventName', domEventName);
            StringMapWrapper.set(result, 'fullKey', fullKey);
            return result;
        };
        KeyEventsPlugin.getEventFullKey = function (event) {
            var fullKey = '';
            var key = getDOM().getEventKey(event);
            key = key.toLowerCase();
            if (StringWrapper.equals(key, ' ')) {
                key = 'space'; // for readability
            }
            else if (StringWrapper.equals(key, '.')) {
                key = 'dot'; // because '.' is used as a separator in event names
            }
            modifierKeys.forEach(function (modifierName) {
                if (modifierName != key) {
                    var modifierGetter = StringMapWrapper.get(modifierKeyGetters, modifierName);
                    if (modifierGetter(event)) {
                        fullKey += modifierName + '.';
                    }
                }
            });
            fullKey += key;
            return fullKey;
        };
        KeyEventsPlugin.eventCallback = function (element, fullKey, handler, zone) {
            return function (event) {
                if (StringWrapper.equals(KeyEventsPlugin.getEventFullKey(event), fullKey)) {
                    zone.runGuarded(function () { return handler(event); });
                }
            };
        };
        /** @internal */
        KeyEventsPlugin._normalizeKey = function (keyName) {
            // TODO: switch to a StringMap if the mapping grows too much
            switch (keyName) {
                case 'esc':
                    return 'escape';
                default:
                    return keyName;
            }
        };
        return KeyEventsPlugin;
    }(EventManagerPlugin));
    KeyEventsPlugin.decorators = [
        { type: _angular_core.Injectable },
    ];
    KeyEventsPlugin.ctorParameters = [];
    var CORE_TOKENS = { 'ApplicationRef': _angular_core.ApplicationRef, 'NgZone': _angular_core.NgZone };
    var INSPECT_GLOBAL_NAME = 'ng.probe';
    var CORE_TOKENS_GLOBAL_NAME = 'ng.coreTokens';
    /**
     * Returns a {@link DebugElement} for the given native DOM element, or
     * null if the given native element does not have an Angular view associated
     * with it.
     */
    function inspectNativeElement(element) {
        return _angular_core.getDebugNode(element);
    }
    function _createConditionalRootRenderer(rootRenderer) {
        if (assertionsEnabled()) {
            return _createRootRenderer(rootRenderer);
        }
        return rootRenderer;
    }
    function _createRootRenderer(rootRenderer) {
        getDOM().setGlobalVar(INSPECT_GLOBAL_NAME, inspectNativeElement);
        getDOM().setGlobalVar(CORE_TOKENS_GLOBAL_NAME, CORE_TOKENS);
        return new DebugDomRootRenderer(rootRenderer);
    }
    /**
     * Providers which support debugging Angular applications (e.g. via `ng.probe`).
     */
    var ELEMENT_PROBE_PROVIDERS = [
        /*@ts2dart_Provider*/ {
            provide: _angular_core.RootRenderer,
            useFactory: _createConditionalRootRenderer,
            deps: [DomRootRenderer]
        }
    ];
    var DomEventsPlugin = (function (_super) {
        __extends(DomEventsPlugin, _super);
        function DomEventsPlugin() {
            _super.apply(this, arguments);
        }
        // This plugin should come last in the list of plugins, because it accepts all
        // events.
        DomEventsPlugin.prototype.supports = function (eventName) { return true; };
        DomEventsPlugin.prototype.addEventListener = function (element, eventName, handler) {
            var zone = this.manager.getZone();
            var outsideHandler = function (event) { return zone.runGuarded(function () { return handler(event); }); };
            return this.manager.getZone().runOutsideAngular(function () { return getDOM().onAndCancel(element, eventName, outsideHandler); });
        };
        DomEventsPlugin.prototype.addGlobalEventListener = function (target, eventName, handler) {
            var element = getDOM().getGlobalEventTarget(target);
            var zone = this.manager.getZone();
            var outsideHandler = function (event) { return zone.runGuarded(function () { return handler(event); }); };
            return this.manager.getZone().runOutsideAngular(function () { return getDOM().onAndCancel(element, eventName, outsideHandler); });
        };
        return DomEventsPlugin;
    }(EventManagerPlugin));
    DomEventsPlugin.decorators = [
        { type: _angular_core.Injectable },
    ];
    var _eventNames = {
        // pan
        'pan': true,
        'panstart': true,
        'panmove': true,
        'panend': true,
        'pancancel': true,
        'panleft': true,
        'panright': true,
        'panup': true,
        'pandown': true,
        // pinch
        'pinch': true,
        'pinchstart': true,
        'pinchmove': true,
        'pinchend': true,
        'pinchcancel': true,
        'pinchin': true,
        'pinchout': true,
        // press
        'press': true,
        'pressup': true,
        // rotate
        'rotate': true,
        'rotatestart': true,
        'rotatemove': true,
        'rotateend': true,
        'rotatecancel': true,
        // swipe
        'swipe': true,
        'swipeleft': true,
        'swiperight': true,
        'swipeup': true,
        'swipedown': true,
        // tap
        'tap': true,
    };
    var HammerGesturesPluginCommon = (function (_super) {
        __extends(HammerGesturesPluginCommon, _super);
        function HammerGesturesPluginCommon() {
            _super.call(this);
        }
        HammerGesturesPluginCommon.prototype.supports = function (eventName) {
            eventName = eventName.toLowerCase();
            return StringMapWrapper.contains(_eventNames, eventName);
        };
        return HammerGesturesPluginCommon;
    }(EventManagerPlugin));
    var HAMMER_GESTURE_CONFIG =
        /*@ts2dart_const*/ new _angular_core.OpaqueToken("HammerGestureConfig");
    var HammerGestureConfig = (function () {
        function HammerGestureConfig() {
            this.events = [];
            this.overrides = {};
        }
        HammerGestureConfig.prototype.buildHammer = function (element) {
            var mc = new Hammer(element);
            mc.get('pinch').set({ enable: true });
            mc.get('rotate').set({ enable: true });
            for (var eventName in this.overrides) {
                mc.get(eventName).set(this.overrides[eventName]);
            }
            return mc;
        };
        return HammerGestureConfig;
    }());
    HammerGestureConfig.decorators = [
        { type: _angular_core.Injectable },
    ];
    var HammerGesturesPlugin = (function (_super) {
        __extends(HammerGesturesPlugin, _super);
        function HammerGesturesPlugin(_config) {
            _super.call(this);
            this._config = _config;
        }
        HammerGesturesPlugin.prototype.supports = function (eventName) {
            if (!_super.prototype.supports.call(this, eventName) && !this.isCustomEvent(eventName))
                return false;
            if (!isPresent(window['Hammer'])) {
                throw new BaseException("Hammer.js is not loaded, can not bind " + eventName + " event");
            }
            return true;
        };
        HammerGesturesPlugin.prototype.addEventListener = function (element, eventName, handler) {
            var _this = this;
            var zone = this.manager.getZone();
            eventName = eventName.toLowerCase();
            return zone.runOutsideAngular(function () {
                // Creating the manager bind events, must be done outside of angular
                var mc = _this._config.buildHammer(element);
                var callback = function (eventObj) { zone.runGuarded(function () { handler(eventObj); }); };
                mc.on(eventName, callback);
                return function () { mc.off(eventName, callback); };
            });
        };
        HammerGesturesPlugin.prototype.isCustomEvent = function (eventName) { return this._config.events.indexOf(eventName) > -1; };
        return HammerGesturesPlugin;
    }(HammerGesturesPluginCommon));
    HammerGesturesPlugin.decorators = [
        { type: _angular_core.Injectable },
    ];
    HammerGesturesPlugin.ctorParameters = [
        { type: HammerGestureConfig, decorators: [{ type: _angular_core.Inject, args: [HAMMER_GESTURE_CONFIG,] },] },
    ];
    /**
     * A service that can be used to get and set the title of a current HTML document.
     *
     * Since an Angular 2 application can't be bootstrapped on the entire HTML document (`<html>` tag)
     * it is not possible to bind to the `text` property of the `HTMLTitleElement` elements
     * (representing the `<title>` tag). Instead, this service can be used to set and get the current
     * title value.
     */
    var Title = (function () {
        function Title() {
        }
        /**
         * Get the title of the current HTML document.
         * @returns {string}
         */
        Title.prototype.getTitle = function () { return getDOM().getTitle(); };
        /**
         * Set the title of the current HTML document.
         * @param newTitle
         */
        Title.prototype.setTitle = function (newTitle) { getDOM().setTitle(newTitle); };
        return Title;
    }());
    /**
     * JS version of browser APIs. This library can only run in the browser.
     */
    var win = typeof window !== 'undefined' && window || {};
    var ChangeDetectionPerfRecord = (function () {
        function ChangeDetectionPerfRecord(msPerTick, numTicks) {
            this.msPerTick = msPerTick;
            this.numTicks = numTicks;
        }
        return ChangeDetectionPerfRecord;
    }());
    /**
     * Entry point for all Angular debug tools. This object corresponds to the `ng`
     * global variable accessible in the dev console.
     */
    var AngularTools = (function () {
        function AngularTools(ref) {
            this.profiler = new AngularProfiler(ref);
        }
        return AngularTools;
    }());
    /**
     * Entry point for all Angular profiling-related debug tools. This object
     * corresponds to the `ng.profiler` in the dev console.
     */
    var AngularProfiler = (function () {
        function AngularProfiler(ref) {
            this.appRef = ref.injector.get(_angular_core.ApplicationRef);
        }
        /**
         * Exercises change detection in a loop and then prints the average amount of
         * time in milliseconds how long a single round of change detection takes for
         * the current state of the UI. It runs a minimum of 5 rounds for a minimum
         * of 500 milliseconds.
         *
         * Optionally, a user may pass a `config` parameter containing a map of
         * options. Supported options are:
         *
         * `record` (boolean) - causes the profiler to record a CPU profile while
         * it exercises the change detector. Example:
         *
         * ```
         * ng.profiler.timeChangeDetection({record: true})
         * ```
         */
        AngularProfiler.prototype.timeChangeDetection = function (config) {
            var record = isPresent(config) && config['record'];
            var profileName = 'Change Detection';
            // Profiler is not available in Android browsers, nor in IE 9 without dev tools opened
            var isProfilerAvailable = isPresent(win.console.profile);
            if (record && isProfilerAvailable) {
                win.console.profile(profileName);
            }
            var start = getDOM().performanceNow();
            var numTicks = 0;
            while (numTicks < 5 || (getDOM().performanceNow() - start) < 500) {
                this.appRef.tick();
                numTicks++;
            }
            var end = getDOM().performanceNow();
            if (record && isProfilerAvailable) {
                // need to cast to <any> because type checker thinks there's no argument
                // while in fact there is:
                //
                // https://developer.mozilla.org/en-US/docs/Web/API/Console/profileEnd
                win.console.profileEnd(profileName);
            }
            var msPerTick = (end - start) / numTicks;
            win.console.log("ran " + numTicks + " change detection cycles");
            win.console.log(NumberWrapper.toFixed(msPerTick, 2) + " ms per check");
            return new ChangeDetectionPerfRecord(msPerTick, numTicks);
        };
        return AngularProfiler;
    }());
    var context = global$1;
    /**
     * Enabled Angular 2 debug tools that are accessible via your browser's
     * developer console.
     *
     * Usage:
     *
     * 1. Open developer console (e.g. in Chrome Ctrl + Shift + j)
     * 1. Type `ng.` (usually the console will show auto-complete suggestion)
     * 1. Try the change detection profiler `ng.profiler.timeChangeDetection()`
     *    then hit Enter.
     */
    function enableDebugTools(ref) {
        context.ng = new AngularTools(ref);
    }
    /**
     * Disables Angular 2 tools.
     */
    function disableDebugTools() {
        delete context.ng;
    }
    /**
     * Predicates for use with {@link DebugElement}'s query functions.
     */
    var By = (function () {
        function By() {
        }
        /**
         * Match all elements.
         *
         * ## Example
         *
         * {@example platform/dom/debug/ts/by/by.ts region='by_all'}
         */
        By.all = function () { return function (debugElement) { return true; }; };
        /**
         * Match elements by the given CSS selector.
         *
         * ## Example
         *
         * {@example platform/dom/debug/ts/by/by.ts region='by_css'}
         */
        By.css = function (selector) {
            return function (debugElement) {
                return isPresent(debugElement.nativeElement) ?
                    getDOM().elementMatches(debugElement.nativeElement, selector) :
                    false;
            };
        };
        /**
         * Match elements that have the given directive present.
         *
         * ## Example
         *
         * {@example platform/dom/debug/ts/by/by.ts region='by_directive'}
         */
        By.directive = function (type) {
            return function (debugElement) { return debugElement.providerTokens.indexOf(type) !== -1; };
        };
        return By;
    }());
    var BROWSER_PLATFORM_MARKER =
        /*@ts2dart_const*/ new _angular_core.OpaqueToken('BrowserPlatformMarker');
    /**
     * A set of providers to initialize the Angular platform in a web browser.
     *
     * Used automatically by `bootstrap`, or can be passed to {@link platform}.
     */
    var BROWSER_PROVIDERS = [
        /*@ts2dart_Provider*/ { provide: BROWSER_PLATFORM_MARKER, useValue: true },
        _angular_core.PLATFORM_COMMON_PROVIDERS,
        /*@ts2dart_Provider*/ { provide: _angular_core.PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true },
    ];
    function _exceptionHandler() {
        // !IS_DART is required because we must rethrow exceptions in JS,
        // but must not rethrow exceptions in Dart
        return new _angular_core.ExceptionHandler(getDOM(), !IS_DART);
    }
    function _document() {
        return getDOM().defaultDoc();
    }
    var BROWSER_SANITIZATION_PROVIDERS = [
        /* @ts2dart_Provider */ { provide: SanitizationService, useExisting: DomSanitizationService },
        /* @ts2dart_Provider */ { provide: DomSanitizationService, useClass: DomSanitizationServiceImpl },
    ];
    /**
     * A set of providers to initialize an Angular application in a web browser.
     *
     * Used automatically by `bootstrap`, or can be passed to {@link PlatformRef.application}.
     */
    var BROWSER_APP_COMMON_PROVIDERS =
        /*@ts2dart_const*/ [
        _angular_core.APPLICATION_COMMON_PROVIDERS,
        _angular_common.FORM_PROVIDERS,
        BROWSER_SANITIZATION_PROVIDERS,
        /* @ts2dart_Provider */ { provide: _angular_core.PLATFORM_PIPES, useValue: _angular_common.COMMON_PIPES, multi: true },
        /* @ts2dart_Provider */ { provide: _angular_core.PLATFORM_DIRECTIVES, useValue: _angular_common.COMMON_DIRECTIVES, multi: true },
        /* @ts2dart_Provider */ { provide: _angular_core.ExceptionHandler, useFactory: _exceptionHandler, deps: [] },
        /* @ts2dart_Provider */ { provide: DOCUMENT, useFactory: _document, deps: [] },
        /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: DomEventsPlugin, multi: true },
        /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true },
        /* @ts2dart_Provider */ { provide: EVENT_MANAGER_PLUGINS, useClass: HammerGesturesPlugin, multi: true },
        /* @ts2dart_Provider */ { provide: HAMMER_GESTURE_CONFIG, useClass: HammerGestureConfig },
        /* @ts2dart_Provider */ { provide: DomRootRenderer, useClass: DomRootRenderer_ },
        /* @ts2dart_Provider */ { provide: _angular_core.RootRenderer, useExisting: DomRootRenderer },
        /* @ts2dart_Provider */ { provide: SharedStylesHost, useExisting: DomSharedStylesHost },
        DomSharedStylesHost,
        _angular_core.Testability,
        BrowserDetails,
        AnimationBuilder,
        EventManager,
        ELEMENT_PROBE_PROVIDERS
    ];
    function initDomAdapter() {
        BrowserDomAdapter.makeCurrent();
        wtfInit();
        BrowserGetTestability.init();
    }
    exports.__platform_browser_private__;
    (function (__platform_browser_private__) {
        __platform_browser_private__.DomAdapter = DomAdapter;
        function getDOM$$() { return getDOM(); }
        __platform_browser_private__.getDOM = getDOM$$;
        function setDOM$$(adapter) { return setDOM(adapter); }
        __platform_browser_private__.setDOM = setDOM$$;
        __platform_browser_private__.setRootDomAdapter = setRootDomAdapter;
        __platform_browser_private__.BrowserDomAdapter = BrowserDomAdapter;
        __platform_browser_private__.AnimationBuilder = AnimationBuilder;
        __platform_browser_private__.CssAnimationBuilder = CssAnimationBuilder;
        __platform_browser_private__.CssAnimationOptions = CssAnimationOptions;
        __platform_browser_private__.Animation = Animation;
        __platform_browser_private__.BrowserDetails = BrowserDetails;
    })(exports.__platform_browser_private__ || (exports.__platform_browser_private__ = {}));
    var BrowserPlatformLocation = (function (_super) {
        __extends(BrowserPlatformLocation, _super);
        function BrowserPlatformLocation() {
            _super.call(this);
            this._init();
        }
        // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
        /** @internal */
        BrowserPlatformLocation.prototype._init = function () {
            this._location = getDOM().getLocation();
            this._history = getDOM().getHistory();
        };
        Object.defineProperty(BrowserPlatformLocation.prototype, "location", {
            /** @internal */
            get: function () { return this._location; },
            enumerable: true,
            configurable: true
        });
        BrowserPlatformLocation.prototype.getBaseHrefFromDOM = function () { return getDOM().getBaseHref(); };
        BrowserPlatformLocation.prototype.onPopState = function (fn) {
            getDOM().getGlobalEventTarget('window').addEventListener('popstate', fn, false);
        };
        BrowserPlatformLocation.prototype.onHashChange = function (fn) {
            getDOM().getGlobalEventTarget('window').addEventListener('hashchange', fn, false);
        };
        Object.defineProperty(BrowserPlatformLocation.prototype, "pathname", {
            get: function () { return this._location.pathname; },
            set: function (newPath) { this._location.pathname = newPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BrowserPlatformLocation.prototype, "search", {
            get: function () { return this._location.search; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BrowserPlatformLocation.prototype, "hash", {
            get: function () { return this._location.hash; },
            enumerable: true,
            configurable: true
        });
        BrowserPlatformLocation.prototype.pushState = function (state, title, url) {
            this._history.pushState(state, title, url);
        };
        BrowserPlatformLocation.prototype.replaceState = function (state, title, url) {
            this._history.replaceState(state, title, url);
        };
        BrowserPlatformLocation.prototype.forward = function () { this._history.forward(); };
        BrowserPlatformLocation.prototype.back = function () { this._history.back(); };
        return BrowserPlatformLocation;
    }(_angular_common.PlatformLocation));
    BrowserPlatformLocation.decorators = [
        { type: _angular_core.Injectable },
    ];
    BrowserPlatformLocation.ctorParameters = [];
    /**
     * An array of providers that should be passed into `application()` when bootstrapping a component
     * when all templates
     * have been precompiled offline.
     */
    var BROWSER_APP_STATIC_PROVIDERS =
        /*@ts2dart_const*/ BROWSER_APP_COMMON_PROVIDERS;
    function browserStaticPlatform() {
        if (isBlank(_angular_core.getPlatform())) {
            _angular_core.createPlatform(_angular_core.ReflectiveInjector.resolveAndCreate(BROWSER_PROVIDERS));
        }
        return _angular_core.assertPlatform(BROWSER_PLATFORM_MARKER);
    }
    /**
     * See {@link bootstrap} for more information.
     */
    function bootstrapStatic(appComponentType, customProviders, initReflector) {
        if (isPresent(initReflector)) {
            initReflector();
        }
        var appProviders = isPresent(customProviders) ? [BROWSER_APP_STATIC_PROVIDERS, customProviders] :
            BROWSER_APP_STATIC_PROVIDERS;
        var appInjector = _angular_core.ReflectiveInjector.resolveAndCreate(appProviders, browserStaticPlatform().injector);
        return _angular_core.coreLoadAndBootstrap(appInjector, appComponentType);
    }
    function browserPlatform() {
        if (isBlank(_angular_core.getPlatform())) {
            _angular_core.createPlatform(_angular_core.ReflectiveInjector.resolveAndCreate(BROWSER_PROVIDERS));
        }
        return _angular_core.assertPlatform(BROWSER_PLATFORM_MARKER);
    }
    exports.browserPlatform = browserPlatform;
    exports.DomEventsPlugin = DomEventsPlugin;
    exports.EventManager = EventManager;
    exports.EVENT_MANAGER_PLUGINS = EVENT_MANAGER_PLUGINS;
    exports.ELEMENT_PROBE_PROVIDERS = ELEMENT_PROBE_PROVIDERS;
    exports.BROWSER_APP_COMMON_PROVIDERS = BROWSER_APP_COMMON_PROVIDERS;
    exports.BROWSER_SANITIZATION_PROVIDERS = BROWSER_SANITIZATION_PROVIDERS;
    exports.BROWSER_PROVIDERS = BROWSER_PROVIDERS;
    exports.By = By;
    exports.Title = Title;
    exports.enableDebugTools = enableDebugTools;
    exports.disableDebugTools = disableDebugTools;
    exports.HAMMER_GESTURE_CONFIG = HAMMER_GESTURE_CONFIG;
    exports.HammerGestureConfig = HammerGestureConfig;
    exports.DOCUMENT = DOCUMENT;
    exports.DomSanitizationService = DomSanitizationService;
    exports.SecurityContext = SecurityContext;
    exports.bootstrapStatic = bootstrapStatic;
    exports.browserStaticPlatform = browserStaticPlatform;
    exports.BROWSER_APP_STATIC_PROVIDERS = BROWSER_APP_STATIC_PROVIDERS;
    exports.BrowserPlatformLocation = BrowserPlatformLocation;
}));
