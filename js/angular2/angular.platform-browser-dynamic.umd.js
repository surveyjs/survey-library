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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/compiler'), require('@angular/platform-browser'), require('@angular/core')) :
        typeof define === 'function' && define.amd ? define(['exports', '@angular/compiler', '@angular/platform-browser', '@angular/core'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.platformBrowserDynamic = global.ng.platformBrowserDynamic || {}), global.ng.compiler, global.ng.platformBrowser, global.ng.core));
}(this, function (exports, _angular_compiler, _angular_platformBrowser, _angular_core) {
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
    // Need to declare a new variable for global here since TypeScript
    // exports the original value of the symbol.
    var global$1 = globalScope;
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
    function isArray(obj) {
        return Array.isArray(obj);
    }
    var Map$1 = global$1.Map;
    var Set = global$1.Set;
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
        var test = new Set([1, 2, 3]);
        if (test.size === 3) {
            return function createSetFromList(lst) { return new Set(lst); };
        }
        else {
            return function createSetAndPopulateFromList(lst) {
                var res = new Set(lst);
                if (res.size !== lst.length) {
                    for (var i = 0; i < lst.length; i++) {
                        res.add(lst[i]);
                    }
                }
                return res;
            };
        }
    })();
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
    /**
     * An implementation of XHR that uses a template cache to avoid doing an actual
     * XHR.
     *
     * The template cache needs to be built and loaded into window.$templateCache
     * via a separate mechanism.
     */
    var CachedXHR = (function (_super) {
        __extends(CachedXHR, _super);
        function CachedXHR() {
            _super.call(this);
            this._cache = global$1.$templateCache;
            if (this._cache == null) {
                throw new BaseException('CachedXHR: Template cache was not found in $templateCache.');
            }
        }
        CachedXHR.prototype.get = function (url) {
            if (this._cache.hasOwnProperty(url)) {
                return PromiseWrapper.resolve(this._cache[url]);
            }
            else {
                return PromiseWrapper.reject('CachedXHR: Did not find cached template for ' + url, null);
            }
        };
        return CachedXHR;
    }(_angular_compiler.XHR));
    var XHRImpl = (function (_super) {
        __extends(XHRImpl, _super);
        function XHRImpl() {
            _super.apply(this, arguments);
        }
        XHRImpl.prototype.get = function (url) {
            var completer = PromiseWrapper.completer();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'text';
            xhr.onload = function () {
                // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                var response = isPresent(xhr.response) ? xhr.response : xhr.responseText;
                // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
                var status = xhr.status === 1223 ? 204 : xhr.status;
                // fix status code when it is 0 (0 status is undocumented).
                // Occurs when accessing file resources or on Android 4.1 stock browser
                // while retrieving files from application cache.
                if (status === 0) {
                    status = response ? 200 : 0;
                }
                if (200 <= status && status <= 300) {
                    completer.resolve(response);
                }
                else {
                    completer.reject("Failed to load " + url, null);
                }
            };
            xhr.onerror = function () { completer.reject("Failed to load " + url, null); };
            xhr.send();
            return completer.promise;
        };
        return XHRImpl;
    }(_angular_compiler.XHR));
    var ReflectionCapabilities = _angular_core.__core_private__.ReflectionCapabilities;
    var CACHED_TEMPLATE_PROVIDER =
        /*@ts2dart_const*/ [{ provide: _angular_compiler.XHR, useClass: CachedXHR }];
    /**
     * An array of providers that should be passed into `application()` when bootstrapping a component.
     */
    var BROWSER_APP_DYNAMIC_PROVIDERS =
        /*@ts2dart_const*/ [
        _angular_platformBrowser.BROWSER_APP_COMMON_PROVIDERS,
        _angular_compiler.COMPILER_PROVIDERS,
        { provide: _angular_compiler.XHR, useClass: XHRImpl },
    ];
    /**
     * Bootstrapping for Angular applications.
     *
     * You instantiate an Angular application by explicitly specifying a component to use
     * as the root component for your application via the `bootstrap()` method.
     *
     * ## Simple Example
     *
     * Assuming this `index.html`:
     *
     * ```html
     * <html>
     *   <!-- load Angular script tags here. -->
     *   <body>
     *     <my-app>loading...</my-app>
     *   </body>
     * </html>
     * ```
     *
     * An application is bootstrapped inside an existing browser DOM, typically `index.html`.
     * Unlike Angular 1, Angular 2 does not compile/process providers in `index.html`. This is
     * mainly for security reasons, as well as architectural changes in Angular 2. This means
     * that `index.html` can safely be processed using server-side technologies such as
     * providers. Bindings can thus use double-curly `{{ syntax }}` without collision from
     * Angular 2 component double-curly `{{ syntax }}`.
     *
     * We can use this script code:
     *
     * {@example core/ts/bootstrap/bootstrap.ts region='bootstrap'}
     *
     * When the app developer invokes `bootstrap()` with the root component `MyApp` as its
     * argument, Angular performs the following tasks:
     *
     *  1. It uses the component's `selector` property to locate the DOM element which needs
     *     to be upgraded into the angular component.
     *  2. It creates a new child injector (from the platform injector). Optionally, you can
     *     also override the injector configuration for an app by invoking `bootstrap` with the
     *     `componentInjectableBindings` argument.
     *  3. It creates a new `Zone` and connects it to the angular application's change detection
     *     domain instance.
     *  4. It creates an emulated or shadow DOM on the selected component's host element and loads the
     *     template into it.
     *  5. It instantiates the specified component.
     *  6. Finally, Angular performs change detection to apply the initial data providers for the
     *     application.
     *
     *
     * ## Bootstrapping Multiple Applications
     *
     * When working within a browser window, there are many singleton resources: cookies, title,
     * location, and others. Angular services that represent these resources must likewise be
     * shared across all Angular applications that occupy the same browser window. For this
     * reason, Angular creates exactly one global platform object which stores all shared
     * services, and each angular application injector has the platform injector as its parent.
     *
     * Each application has its own private injector as well. When there are multiple
     * applications on a page, Angular treats each application injector's services as private
     * to that application.
     *
     * ## API
     *
     * - `appComponentType`: The root component which should act as the application. This is
     *   a reference to a `Type` which is annotated with `@Component(...)`.
     * - `customProviders`: An additional set of providers that can be added to the
     *   app injector to override default injection behavior.
     *
     * Returns a `Promise` of {@link ComponentRef}.
     */
    function bootstrap(appComponentType, customProviders) {
        _angular_core.reflector.reflectionCapabilities = new ReflectionCapabilities();
        var appInjector = _angular_core.ReflectiveInjector.resolveAndCreate([BROWSER_APP_DYNAMIC_PROVIDERS, isPresent(customProviders) ? customProviders : []], _angular_platformBrowser.browserPlatform().injector);
        return _angular_core.coreLoadAndBootstrap(appInjector, appComponentType);
    }
    exports.CACHED_TEMPLATE_PROVIDER = CACHED_TEMPLATE_PROVIDER;
    exports.BROWSER_APP_DYNAMIC_PROVIDERS = BROWSER_APP_DYNAMIC_PROVIDERS;
    exports.bootstrap = bootstrap;
}));
