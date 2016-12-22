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
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/Subject'), require('rxjs/observable/PromiseObservable'), require('rxjs/operator/toPromise'), require('rxjs/Observable')) :
        typeof define === 'function' && define.amd ? define(['exports', 'rxjs/Subject', 'rxjs/observable/PromiseObservable', 'rxjs/operator/toPromise', 'rxjs/Observable'], factory) :
            (factory((global.ng = global.ng || {}, global.ng.core = global.ng.core || {}), global.Rx, global.Rx, global.Rx.Observable.prototype, global.Rx));
}(this, function (exports, rxjs_Subject, rxjs_observable_PromiseObservable, rxjs_operator_toPromise, rxjs_Observable) {
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
    function scheduleMicroTask(fn) {
        Zone.current.scheduleMicroTask('scheduleMicrotask', fn);
    }
    // Need to declare a new variable for global here since TypeScript
    // exports the original value of the symbol.
    var global$1 = globalScope;
    var Type = Function;
    function getTypeNameForDebugging(type) {
        if (type['name']) {
            return type['name'];
        }
        return typeof type;
    }
    var Math = global$1.Math;
    var _devMode = true;
    var _modeLocked = false;
    function lockMode() {
        _modeLocked = true;
    }
    /**
     * Disable Angular's development mode, which turns off assertions and other
     * checks within the framework.
     *
     * One important assertion this disables verifies that a change detection pass
     * does not result in additional changes to any bindings (also known as
     * unidirectional data flow).
     */
    function enableProdMode() {
        if (_modeLocked) {
            // Cannot use BaseException as that ends up importing from facade/lang.
            throw 'Cannot enable prod mode after platform setup.';
        }
        _devMode = false;
    }
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
    function isType(obj) {
        return isFunction(obj);
    }
    function isPromise(obj) {
        return obj instanceof global$1.Promise;
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
    // JS has NaN !== NaN
    function looseIdentical(a, b) {
        return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
    }
    // JS considers NaN is the same as NaN for map Key (while NaN !== NaN otherwise)
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
    function getMapKey(value) {
        return value;
    }
    function normalizeBool(obj) {
        return isBlank(obj) ? false : obj;
    }
    function isJsObject(o) {
        return o !== null && (typeof o === "function" || typeof o === "object");
    }
    function print(obj) {
        console.log(obj);
    }
    function warn(obj) {
        console.warn(obj);
    }
    var _symbolIterator = null;
    function getSymbolIterator() {
        if (isBlank(_symbolIterator)) {
            if (isPresent(globalScope.Symbol) && isPresent(Symbol.iterator)) {
                _symbolIterator = Symbol.iterator;
            }
            else {
                // es6-shim specific logic
                var keys = Object.getOwnPropertyNames(Map.prototype);
                for (var i = 0; i < keys.length; ++i) {
                    var key = keys[i];
                    if (key !== 'entries' && key !== 'size' &&
                        Map.prototype[key] === Map.prototype['entries']) {
                        _symbolIterator = key;
                    }
                }
            }
        }
        return _symbolIterator;
    }
    function isPrimitive(obj) {
        return !isJsObject(obj);
    }
    /**
     * A parameter metadata that specifies a dependency.
     *
     * ### Example ([live demo](http://plnkr.co/edit/6uHYJK?p=preview))
     *
     * ```typescript
     * class Engine {}
     *
     * @Injectable()
     * class Car {
     *   engine;
     *   constructor(@Inject("MyEngine") engine:Engine) {
     *     this.engine = engine;
     *   }
     * }
     *
     * var injector = Injector.resolveAndCreate([
     *  provide("MyEngine", {useClass: Engine}),
     *  Car
     * ]);
     *
     * expect(injector.get(Car).engine instanceof Engine).toBe(true);
     * ```
     *
     * When `@Inject()` is not present, {@link Injector} will use the type annotation of the parameter.
     *
     * ### Example
     *
     * ```typescript
     * class Engine {}
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine: Engine) {} //same as constructor(@Inject(Engine) engine:Engine)
     * }
     *
     * var injector = Injector.resolveAndCreate([Engine, Car]);
     * expect(injector.get(Car).engine instanceof Engine).toBe(true);
     * ```
     * @ts2dart_const
     */
    var InjectMetadata = (function () {
        function InjectMetadata(token) {
            this.token = token;
        }
        InjectMetadata.prototype.toString = function () { return "@Inject(" + stringify(this.token) + ")"; };
        return InjectMetadata;
    }());
    /**
     * A parameter metadata that marks a dependency as optional. {@link Injector} provides `null` if
     * the dependency is not found.
     *
     * ### Example ([live demo](http://plnkr.co/edit/AsryOm?p=preview))
     *
     * ```typescript
     * class Engine {}
     *
     * @Injectable()
     * class Car {
     *   engine;
     *   constructor(@Optional() engine:Engine) {
     *     this.engine = engine;
     *   }
     * }
     *
     * var injector = Injector.resolveAndCreate([Car]);
     * expect(injector.get(Car).engine).toBeNull();
     * ```
     * @ts2dart_const
     */
    var OptionalMetadata = (function () {
        function OptionalMetadata() {
        }
        OptionalMetadata.prototype.toString = function () { return "@Optional()"; };
        return OptionalMetadata;
    }());
    /**
     * `DependencyMetadata` is used by the framework to extend DI.
     * This is internal to Angular and should not be used directly.
     * @ts2dart_const
     */
    var DependencyMetadata = (function () {
        function DependencyMetadata() {
        }
        Object.defineProperty(DependencyMetadata.prototype, "token", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        return DependencyMetadata;
    }());
    /**
     * A marker metadata that marks a class as available to {@link Injector} for creation.
     *
     * ### Example ([live demo](http://plnkr.co/edit/Wk4DMQ?p=preview))
     *
     * ```typescript
     * @Injectable()
     * class UsefulService {}
     *
     * @Injectable()
     * class NeedsService {
     *   constructor(public service:UsefulService) {}
     * }
     *
     * var injector = Injector.resolveAndCreate([NeedsService, UsefulService]);
     * expect(injector.get(NeedsService).service instanceof UsefulService).toBe(true);
     * ```
     * {@link Injector} will throw {@link NoAnnotationError} when trying to instantiate a class that
     * does not have `@Injectable` marker, as shown in the example below.
     *
     * ```typescript
     * class UsefulService {}
     *
     * class NeedsService {
     *   constructor(public service:UsefulService) {}
     * }
     *
     * var injector = Injector.resolveAndCreate([NeedsService, UsefulService]);
     * expect(() => injector.get(NeedsService)).toThrowError();
     * ```
     * @ts2dart_const
     */
    var InjectableMetadata = (function () {
        function InjectableMetadata() {
        }
        return InjectableMetadata;
    }());
    /**
     * Specifies that an {@link Injector} should retrieve a dependency only from itself.
     *
     * ### Example ([live demo](http://plnkr.co/edit/NeagAg?p=preview))
     *
     * ```typescript
     * class Dependency {
     * }
     *
     * @Injectable()
     * class NeedsDependency {
     *   dependency;
     *   constructor(@Self() dependency:Dependency) {
     *     this.dependency = dependency;
     *   }
     * }
     *
     * var inj = Injector.resolveAndCreate([Dependency, NeedsDependency]);
     * var nd = inj.get(NeedsDependency);
     *
     * expect(nd.dependency instanceof Dependency).toBe(true);
     *
     * var inj = Injector.resolveAndCreate([Dependency]);
     * var child = inj.resolveAndCreateChild([NeedsDependency]);
     * expect(() => child.get(NeedsDependency)).toThrowError();
     * ```
     * @ts2dart_const
     */
    var SelfMetadata = (function () {
        function SelfMetadata() {
        }
        SelfMetadata.prototype.toString = function () { return "@Self()"; };
        return SelfMetadata;
    }());
    /**
     * Specifies that the dependency resolution should start from the parent injector.
     *
     * ### Example ([live demo](http://plnkr.co/edit/Wchdzb?p=preview))
     *
     * ```typescript
     * class Dependency {
     * }
     *
     * @Injectable()
     * class NeedsDependency {
     *   dependency;
     *   constructor(@SkipSelf() dependency:Dependency) {
     *     this.dependency = dependency;
     *   }
     * }
     *
     * var parent = Injector.resolveAndCreate([Dependency]);
     * var child = parent.resolveAndCreateChild([NeedsDependency]);
     * expect(child.get(NeedsDependency).dependency instanceof Depedency).toBe(true);
     *
     * var inj = Injector.resolveAndCreate([Dependency, NeedsDependency]);
     * expect(() => inj.get(NeedsDependency)).toThrowError();
     * ```
     * @ts2dart_const
     */
    var SkipSelfMetadata = (function () {
        function SkipSelfMetadata() {
        }
        SkipSelfMetadata.prototype.toString = function () { return "@SkipSelf()"; };
        return SkipSelfMetadata;
    }());
    /**
     * Specifies that an injector should retrieve a dependency from any injector until reaching the
     * closest host.
     *
     * In Angular, a component element is automatically declared as a host for all the injectors in
     * its view.
     *
     * ### Example ([live demo](http://plnkr.co/edit/GX79pV?p=preview))
     *
     * In the following example `App` contains `ParentCmp`, which contains `ChildDirective`.
     * So `ParentCmp` is the host of `ChildDirective`.
     *
     * `ChildDirective` depends on two services: `HostService` and `OtherService`.
     * `HostService` is defined at `ParentCmp`, and `OtherService` is defined at `App`.
     *
     *```typescript
     * class OtherService {}
     * class HostService {}
     *
     * @Directive({
     *   selector: 'child-directive'
     * })
     * class ChildDirective {
     *   constructor(@Optional() @Host() os:OtherService, @Optional() @Host() hs:HostService){
     *     console.log("os is null", os);
     *     console.log("hs is NOT null", hs);
     *   }
     * }
     *
     * @Component({
     *   selector: 'parent-cmp',
     *   providers: [HostService],
     *   template: `
     *     Dir: <child-directive></child-directive>
     *   `,
     *   directives: [ChildDirective]
     * })
     * class ParentCmp {
     * }
     *
     * @Component({
     *   selector: 'app',
     *   providers: [OtherService],
     *   template: `
     *     Parent: <parent-cmp></parent-cmp>
     *   `,
     *   directives: [ParentCmp]
     * })
     * class App {
     * }
     *
     * bootstrap(App);
     *```
     * @ts2dart_const
     */
    var HostMetadata = (function () {
        function HostMetadata() {
        }
        HostMetadata.prototype.toString = function () { return "@Host()"; };
        return HostMetadata;
    }());
    /**
     * Allows to refer to references which are not yet defined.
     *
     * For instance, `forwardRef` is used when the `token` which we need to refer to for the purposes of
     * DI is declared,
     * but not yet defined. It is also used when the `token` which we use when creating a query is not
     * yet defined.
     *
     * ### Example
     * {@example core/di/ts/forward_ref/forward_ref.ts region='forward_ref'}
     */
    function forwardRef(forwardRefFn) {
        forwardRefFn.__forward_ref__ = forwardRef;
        forwardRefFn.toString = function () { return stringify(this()); };
        return forwardRefFn;
    }
    /**
     * Lazily retrieves the reference value from a forwardRef.
     *
     * Acts as the identity function when given a non-forward-ref value.
     *
     * ### Example ([live demo](http://plnkr.co/edit/GU72mJrk1fiodChcmiDR?p=preview))
     *
     * ```typescript
     * var ref = forwardRef(() => "refValue");
     * expect(resolveForwardRef(ref)).toEqual("refValue");
     * expect(resolveForwardRef("regularValue")).toEqual("regularValue");
     * ```
     *
     * See: {@link forwardRef}
     */
    function resolveForwardRef(type) {
        if (isFunction(type) && type.hasOwnProperty('__forward_ref__') &&
            type.__forward_ref__ === forwardRef) {
            return type();
        }
        else {
            return type;
        }
    }
    /**
     * Specifies that a constant attribute value should be injected.
     *
     * The directive can inject constant string literals of host element attributes.
     *
     * ### Example
     *
     * Suppose we have an `<input>` element and want to know its `type`.
     *
     * ```html
     * <input type="text">
     * ```
     *
     * A decorator can inject string literal `text` like so:
     *
     * {@example core/ts/metadata/metadata.ts region='attributeMetadata'}
     * @ts2dart_const
     */
    var AttributeMetadata = (function (_super) {
        __extends(AttributeMetadata, _super);
        function AttributeMetadata(attributeName) {
            _super.call(this);
            this.attributeName = attributeName;
        }
        Object.defineProperty(AttributeMetadata.prototype, "token", {
            get: function () {
                // Normally one would default a token to a type of an injected value but here
                // the type of a variable is "string" and we can't use primitive type as a return value
                // so we use instance of Attribute instead. This doesn't matter much in practice as arguments
                // with @Attribute annotation are injected by ElementInjector that doesn't take tokens into
                // account.
                return this;
            },
            enumerable: true,
            configurable: true
        });
        AttributeMetadata.prototype.toString = function () { return "@Attribute(" + stringify(this.attributeName) + ")"; };
        return AttributeMetadata;
    }(DependencyMetadata));
    /**
     * Declares an injectable parameter to be a live list of directives or variable
     * bindings from the content children of a directive.
     *
     * ### Example ([live demo](http://plnkr.co/edit/lY9m8HLy7z06vDoUaSN2?p=preview))
     *
     * Assume that `<tabs>` component would like to get a list its children `<pane>`
     * components as shown in this example:
     *
     * ```html
     * <tabs>
     *   <pane title="Overview">...</pane>
     *   <pane *ngFor="let o of objects" [title]="o.title">{{o.text}}</pane>
     * </tabs>
     * ```
     *
     * The preferred solution is to query for `Pane` directives using this decorator.
     *
     * ```javascript
     * @Component({
     *   selector: 'pane',
     *   inputs: ['title']
     * })
     * class Pane {
     *   title:string;
     * }
     *
     * @Component({
     *  selector: 'tabs',
     *  template: `
     *    <ul>
     *      <li *ngFor="let pane of panes">{{pane.title}}</li>
     *    </ul>
     *    <ng-content></ng-content>
     *  `
     * })
     * class Tabs {
     *   panes: QueryList<Pane>;
     *   constructor(@Query(Pane) panes:QueryList<Pane>) {
      *    this.panes = panes;
      *  }
     * }
     * ```
     *
     * A query can look for variable bindings by passing in a string with desired binding symbol.
     *
     * ### Example ([live demo](http://plnkr.co/edit/sT2j25cH1dURAyBRCKx1?p=preview))
     * ```html
     * <seeker>
     *   <div #findme>...</div>
     * </seeker>
     *
     * @Component({ selector: 'seeker' })
     * class Seeker {
     *   constructor(@Query('findme') elList: QueryList<ElementRef>) {...}
     * }
     * ```
     *
     * In this case the object that is injected depend on the type of the variable
     * binding. It can be an ElementRef, a directive or a component.
     *
     * Passing in a comma separated list of variable bindings will query for all of them.
     *
     * ```html
     * <seeker>
     *   <div #find-me>...</div>
     *   <div #find-me-too>...</div>
     * </seeker>
     *
     *  @Component({
     *   selector: 'seeker'
     * })
     * class Seeker {
     *   constructor(@Query('findMe, findMeToo') elList: QueryList<ElementRef>) {...}
     * }
     * ```
     *
     * Configure whether query looks for direct children or all descendants
     * of the querying element, by using the `descendants` parameter.
     * It is set to `false` by default.
     *
     * ### Example ([live demo](http://plnkr.co/edit/wtGeB977bv7qvA5FTYl9?p=preview))
     * ```html
     * <container #first>
     *   <item>a</item>
     *   <item>b</item>
     *   <container #second>
     *     <item>c</item>
     *   </container>
     * </container>
     * ```
     *
     * When querying for items, the first container will see only `a` and `b` by default,
     * but with `Query(TextDirective, {descendants: true})` it will see `c` too.
     *
     * The queried directives are kept in a depth-first pre-order with respect to their
     * positions in the DOM.
     *
     * Query does not look deep into any subcomponent views.
     *
     * Query is updated as part of the change-detection cycle. Since change detection
     * happens after construction of a directive, QueryList will always be empty when observed in the
     * constructor.
     *
     * The injected object is an unmodifiable live list.
     * See {@link QueryList} for more details.
     * @ts2dart_const
     */
    var QueryMetadata = (function (_super) {
        __extends(QueryMetadata, _super);
        function QueryMetadata(_selector, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.descendants, descendants = _c === void 0 ? false : _c, _d = _b.first, first = _d === void 0 ? false : _d, _e = _b.read, read = _e === void 0 ? null : _e;
            _super.call(this);
            this._selector = _selector;
            this.descendants = descendants;
            this.first = first;
            this.read = read;
        }
        Object.defineProperty(QueryMetadata.prototype, "isViewQuery", {
            /**
             * always `false` to differentiate it with {@link ViewQueryMetadata}.
             */
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryMetadata.prototype, "selector", {
            /**
             * what this is querying for.
             */
            get: function () { return resolveForwardRef(this._selector); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryMetadata.prototype, "isVarBindingQuery", {
            /**
             * whether this is querying for a variable binding or a directive.
             */
            get: function () { return isString(this.selector); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryMetadata.prototype, "varBindings", {
            /**
             * returns a list of variable bindings this is querying for.
             * Only applicable if this is a variable bindings query.
             */
            get: function () { return this.selector.split(','); },
            enumerable: true,
            configurable: true
        });
        QueryMetadata.prototype.toString = function () { return "@Query(" + stringify(this.selector) + ")"; };
        return QueryMetadata;
    }(DependencyMetadata));
    // TODO: add an example after ContentChildren and ViewChildren are in master
    /**
     * Configures a content query.
     *
     * Content queries are set before the `ngAfterContentInit` callback is called.
     *
     * ### Example
     *
     * ```
     * @Directive({
     *   selector: 'someDir'
     * })
     * class SomeDir {
     *   @ContentChildren(ChildDirective) contentChildren: QueryList<ChildDirective>;
     *
     *   ngAfterContentInit() {
     *     // contentChildren is set
     *   }
     * }
     * ```
     * @ts2dart_const
     */
    var ContentChildrenMetadata = (function (_super) {
        __extends(ContentChildrenMetadata, _super);
        function ContentChildrenMetadata(_selector, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.descendants, descendants = _c === void 0 ? false : _c, _d = _b.read, read = _d === void 0 ? null : _d;
            _super.call(this, _selector, { descendants: descendants, read: read });
        }
        return ContentChildrenMetadata;
    }(QueryMetadata));
    // TODO: add an example after ContentChild and ViewChild are in master
    /**
     * Configures a content query.
     *
     * Content queries are set before the `ngAfterContentInit` callback is called.
     *
     * ### Example
     *
     * ```
     * @Directive({
     *   selector: 'someDir'
     * })
     * class SomeDir {
     *   @ContentChild(ChildDirective) contentChild;
     *
     *   ngAfterContentInit() {
     *     // contentChild is set
     *   }
     * }
     * ```
     * @ts2dart_const
     */
    var ContentChildMetadata = (function (_super) {
        __extends(ContentChildMetadata, _super);
        function ContentChildMetadata(_selector, _a) {
            var _b = (_a === void 0 ? {} : _a).read, read = _b === void 0 ? null : _b;
            _super.call(this, _selector, { descendants: true, first: true, read: read });
        }
        return ContentChildMetadata;
    }(QueryMetadata));
    /**
     * Similar to {@link QueryMetadata}, but querying the component view, instead of
     * the content children.
     *
     * ### Example ([live demo](http://plnkr.co/edit/eNsFHDf7YjyM6IzKxM1j?p=preview))
     *
     * ```javascript
     * @Component({
     *   ...,
     *   template: `
     *     <item> a </item>
     *     <item> b </item>
     *     <item> c </item>
     *   `
     * })
     * class MyComponent {
     *   shown: boolean;
     *
     *   constructor(private @ViewQuery(Item) items:QueryList<Item>) {
     *     items.changes.subscribe(() => console.log(items.length));
     *   }
     * }
     * ```
     *
     * Supports the same querying parameters as {@link QueryMetadata}, except
     * `descendants`. This always queries the whole view.
     *
     * As `shown` is flipped between true and false, items will contain zero of one
     * items.
     *
     * Specifies that a {@link QueryList} should be injected.
     *
     * The injected object is an iterable and observable live list.
     * See {@link QueryList} for more details.
     * @ts2dart_const
     */
    var ViewQueryMetadata = (function (_super) {
        __extends(ViewQueryMetadata, _super);
        function ViewQueryMetadata(_selector, _a) {
            var _b = _a === void 0 ? {} : _a, _c = _b.descendants, descendants = _c === void 0 ? false : _c, _d = _b.first, first = _d === void 0 ? false : _d, _e = _b.read, read = _e === void 0 ? null : _e;
            _super.call(this, _selector, { descendants: descendants, first: first, read: read });
        }
        Object.defineProperty(ViewQueryMetadata.prototype, "isViewQuery", {
            /**
             * always `true` to differentiate it with {@link QueryMetadata}.
             */
            get: function () { return true; },
            enumerable: true,
            configurable: true
        });
        ViewQueryMetadata.prototype.toString = function () { return "@ViewQuery(" + stringify(this.selector) + ")"; };
        return ViewQueryMetadata;
    }(QueryMetadata));
    /**
     * Declares a list of child element references.
     *
     * Angular automatically updates the list when the DOM is updated.
     *
     * `ViewChildren` takes an argument to select elements.
     *
     * - If the argument is a type, directives or components with the type will be bound.
     *
     * - If the argument is a string, the string is interpreted as a list of comma-separated selectors.
     * For each selector, an element containing the matching template variable (e.g. `#child`) will be
     * bound.
     *
     * View children are set before the `ngAfterViewInit` callback is called.
     *
     * ### Example
     *
     * With type selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: `
     *     <child-cmp></child-cmp>
     *     <child-cmp></child-cmp>
     *     <child-cmp></child-cmp>
     *   `,
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChildren(ChildCmp) children:QueryList<ChildCmp>;
     *
     *   ngAfterViewInit() {
     *     // children are set
     *     this.children.toArray().forEach((child)=>child.doSomething());
     *   }
     * }
     * ```
     *
     * With string selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: `
     *     <child-cmp #child1></child-cmp>
     *     <child-cmp #child2></child-cmp>
     *     <child-cmp #child3></child-cmp>
     *   `,
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChildren('child1,child2,child3') children:QueryList<ChildCmp>;
     *
     *   ngAfterViewInit() {
     *     // children are set
     *     this.children.toArray().forEach((child)=>child.doSomething());
     *   }
     * }
     * ```
     * @ts2dart_const
     */
    var ViewChildrenMetadata = (function (_super) {
        __extends(ViewChildrenMetadata, _super);
        function ViewChildrenMetadata(_selector, _a) {
            var _b = (_a === void 0 ? {} : _a).read, read = _b === void 0 ? null : _b;
            _super.call(this, _selector, { descendants: true, read: read });
        }
        return ViewChildrenMetadata;
    }(ViewQueryMetadata));
    /**
     *
     * Declares a reference of child element.
     *
     * `ViewChildren` takes an argument to select elements.
     *
     * - If the argument is a type, a directive or a component with the type will be bound.
     *
     If the argument is a string, the string is interpreted as a selector. An element containing the
     matching template variable (e.g. `#child`) will be bound.
     *
     * In either case, `@ViewChild()` assigns the first (looking from above) element if there are
     multiple matches.
     *
     * View child is set before the `ngAfterViewInit` callback is called.
     *
     * ### Example
     *
     * With type selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: '<child-cmp></child-cmp>',
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChild(ChildCmp) child:ChildCmp;
     *
     *   ngAfterViewInit() {
     *     // child is set
     *     this.child.doSomething();
     *   }
     * }
     * ```
     *
     * With string selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: '<child-cmp #child></child-cmp>',
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChild('child') child:ChildCmp;
     *
     *   ngAfterViewInit() {
     *     // child is set
     *     this.child.doSomething();
     *   }
     * }
     * ```
     * @ts2dart_const
     */
    var ViewChildMetadata = (function (_super) {
        __extends(ViewChildMetadata, _super);
        function ViewChildMetadata(_selector, _a) {
            var _b = (_a === void 0 ? {} : _a).read, read = _b === void 0 ? null : _b;
            _super.call(this, _selector, { descendants: true, first: true, read: read });
        }
        return ViewChildMetadata;
    }(ViewQueryMetadata));
    /**
     * Describes the current state of the change detector.
     */
    var ChangeDetectorState;
    (function (ChangeDetectorState) {
        /**
         * `NeverChecked` means that the change detector has not been checked yet, and
         * initialization methods should be called during detection.
         */
        ChangeDetectorState[ChangeDetectorState["NeverChecked"] = 0] = "NeverChecked";
        /**
         * `CheckedBefore` means that the change detector has successfully completed at least
         * one detection previously.
         */
        ChangeDetectorState[ChangeDetectorState["CheckedBefore"] = 1] = "CheckedBefore";
        /**
         * `Errored` means that the change detector encountered an error checking a binding
         * or calling a directive lifecycle method and is now in an inconsistent state. Change
         * detectors in this state will no longer detect changes.
         */
        ChangeDetectorState[ChangeDetectorState["Errored"] = 2] = "Errored";
    })(ChangeDetectorState || (ChangeDetectorState = {}));
    /**
     * Describes within the change detector which strategy will be used the next time change
     * detection is triggered.
     */
    exports.ChangeDetectionStrategy;
    (function (ChangeDetectionStrategy) {
        /**
         * `CheckedOnce` means that after calling detectChanges the mode of the change detector
         * will become `Checked`.
         */
        ChangeDetectionStrategy[ChangeDetectionStrategy["CheckOnce"] = 0] = "CheckOnce";
        /**
         * `Checked` means that the change detector should be skipped until its mode changes to
         * `CheckOnce`.
         */
        ChangeDetectionStrategy[ChangeDetectionStrategy["Checked"] = 1] = "Checked";
        /**
         * `CheckAlways` means that after calling detectChanges the mode of the change detector
         * will remain `CheckAlways`.
         */
        ChangeDetectionStrategy[ChangeDetectionStrategy["CheckAlways"] = 2] = "CheckAlways";
        /**
         * `Detached` means that the change detector sub tree is not a part of the main tree and
         * should be skipped.
         */
        ChangeDetectionStrategy[ChangeDetectionStrategy["Detached"] = 3] = "Detached";
        /**
         * `OnPush` means that the change detector's mode will be set to `CheckOnce` during hydration.
         */
        ChangeDetectionStrategy[ChangeDetectionStrategy["OnPush"] = 4] = "OnPush";
        /**
         * `Default` means that the change detector's mode will be set to `CheckAlways` during hydration.
         */
        ChangeDetectionStrategy[ChangeDetectionStrategy["Default"] = 5] = "Default";
    })(exports.ChangeDetectionStrategy || (exports.ChangeDetectionStrategy = {}));
    /**
     * List of possible {@link ChangeDetectionStrategy} values.
     */
    var CHANGE_DETECTION_STRATEGY_VALUES = [
        exports.ChangeDetectionStrategy.CheckOnce,
        exports.ChangeDetectionStrategy.Checked,
        exports.ChangeDetectionStrategy.CheckAlways,
        exports.ChangeDetectionStrategy.Detached,
        exports.ChangeDetectionStrategy.OnPush,
        exports.ChangeDetectionStrategy.Default
    ];
    function isDefaultChangeDetectionStrategy(changeDetectionStrategy) {
        return isBlank(changeDetectionStrategy) ||
            changeDetectionStrategy === exports.ChangeDetectionStrategy.Default;
    }
    /**
     * Directives allow you to attach behavior to elements in the DOM.
     *
     * {@link DirectiveMetadata}s with an embedded view are called {@link ComponentMetadata}s.
     *
     * A directive consists of a single directive annotation and a controller class. When the
     * directive's `selector` matches
     * elements in the DOM, the following steps occur:
     *
     * 1. For each directive, the `ElementInjector` attempts to resolve the directive's constructor
     * arguments.
     * 2. Angular instantiates directives for each matched element using `ElementInjector` in a
     * depth-first order,
     *    as declared in the HTML.
     *
     * ## Understanding How Injection Works
     *
     * There are three stages of injection resolution.
     * - *Pre-existing Injectors*:
     *   - The terminal {@link Injector} cannot resolve dependencies. It either throws an error or, if
     * the dependency was
     *     specified as `@Optional`, returns `null`.
     *   - The platform injector resolves browser singleton resources, such as: cookies, title,
     * location, and others.
     * - *Component Injectors*: Each component instance has its own {@link Injector}, and they follow
     * the same parent-child hierarchy
     *     as the component instances in the DOM.
     * - *Element Injectors*: Each component instance has a Shadow DOM. Within the Shadow DOM each
     * element has an `ElementInjector`
     *     which follow the same parent-child hierarchy as the DOM elements themselves.
     *
     * When a template is instantiated, it also must instantiate the corresponding directives in a
     * depth-first order. The
     * current `ElementInjector` resolves the constructor dependencies for each directive.
     *
     * Angular then resolves dependencies as follows, according to the order in which they appear in the
     * {@link ViewMetadata}:
     *
     * 1. Dependencies on the current element
     * 2. Dependencies on element injectors and their parents until it encounters a Shadow DOM boundary
     * 3. Dependencies on component injectors and their parents until it encounters the root component
     * 4. Dependencies on pre-existing injectors
     *
     *
     * The `ElementInjector` can inject other directives, element-specific special objects, or it can
     * delegate to the parent
     * injector.
     *
     * To inject other directives, declare the constructor parameter as:
     * - `directive:DirectiveType`: a directive on the current element only
     * - `@Host() directive:DirectiveType`: any directive that matches the type between the current
     * element and the
     *    Shadow DOM root.
     * - `@Query(DirectiveType) query:QueryList<DirectiveType>`: A live collection of direct child
     * directives.
     * - `@QueryDescendants(DirectiveType) query:QueryList<DirectiveType>`: A live collection of any
     * child directives.
     *
     * To inject element-specific special objects, declare the constructor parameter as:
     * - `element: ElementRef` to obtain a reference to logical element in the view.
     * - `viewContainer: ViewContainerRef` to control child template instantiation, for
     * {@link DirectiveMetadata} directives only
     * - `bindingPropagation: BindingPropagation` to control change detection in a more granular way.
     *
     * ### Example
     *
     * The following example demonstrates how dependency injection resolves constructor arguments in
     * practice.
     *
     *
     * Assume this HTML template:
     *
     * ```
     * <div dependency="1">
     *   <div dependency="2">
     *     <div dependency="3" my-directive>
     *       <div dependency="4">
     *         <div dependency="5"></div>
     *       </div>
     *       <div dependency="6"></div>
     *     </div>
     *   </div>
     * </div>
     * ```
     *
     * With the following `dependency` decorator and `SomeService` injectable class.
     *
     * ```
     * @Injectable()
     * class SomeService {
     * }
     *
     * @Directive({
     *   selector: '[dependency]',
     *   inputs: [
     *     'id: dependency'
     *   ]
     * })
     * class Dependency {
     *   id:string;
     * }
     * ```
     *
     * Let's step through the different ways in which `MyDirective` could be declared...
     *
     *
     * ### No injection
     *
     * Here the constructor is declared with no arguments, therefore nothing is injected into
     * `MyDirective`.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor() {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with no dependencies.
     *
     *
     * ### Component-level injection
     *
     * Directives can inject any injectable instance from the closest component injector or any of its
     * parents.
     *
     * Here, the constructor declares a parameter, `someService`, and injects the `SomeService` type
     * from the parent
     * component's injector.
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(someService: SomeService) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a dependency on `SomeService`.
     *
     *
     * ### Injecting a directive from the current element
     *
     * Directives can inject other directives declared on the current element.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(dependency: Dependency) {
     *     expect(dependency.id).toEqual(3);
     *   }
     * }
     * ```
     * This directive would be instantiated with `Dependency` declared at the same element, in this case
     * `dependency="3"`.
     *
     * ### Injecting a directive from any ancestor elements
     *
     * Directives can inject other directives declared on any ancestor element (in the current Shadow
     * DOM), i.e. on the current element, the
     * parent element, or its parents.
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Host() dependency: Dependency) {
     *     expect(dependency.id).toEqual(2);
     *   }
     * }
     * ```
     *
     * `@Host` checks the current element, the parent, as well as its parents recursively. If
     * `dependency="2"` didn't
     * exist on the direct parent, this injection would
     * have returned
     * `dependency="1"`.
     *
     *
     * ### Injecting a live collection of direct child directives
     *
     *
     * A directive can also query for other child directives. Since parent directives are instantiated
     * before child directives, a directive can't simply inject the list of child directives. Instead,
     * the directive injects a {@link QueryList}, which updates its contents as children are added,
     * removed, or moved by a directive that uses a {@link ViewContainerRef} such as a `ngFor`, an
     * `ngIf`, or an `ngSwitch`.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Query(Dependency) dependencies:QueryList<Dependency>) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a {@link QueryList} which contains `Dependency` 4 and
     * `Dependency` 6. Here, `Dependency` 5 would not be included, because it is not a direct child.
     *
     * ### Injecting a live collection of descendant directives
     *
     * By passing the descendant flag to `@Query` above, we can include the children of the child
     * elements.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Query(Dependency, {descendants: true}) dependencies:QueryList<Dependency>) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a Query which would contain `Dependency` 4, 5 and 6.
     *
     * ### Optional injection
     *
     * The normal behavior of directives is to return an error when a specified dependency cannot be
     * resolved. If you
     * would like to inject `null` on unresolved dependency instead, you can annotate that dependency
     * with `@Optional()`.
     * This explicitly permits the author of a template to treat some of the surrounding directives as
     * optional.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Optional() dependency:Dependency) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a `Dependency` directive found on the current element.
     * If none can be
     * found, the injector supplies `null` instead of throwing an error.
     *
     * ### Example
     *
     * Here we use a decorator directive to simply define basic tool-tip behavior.
     *
     * ```
     * @Directive({
     *   selector: '[tooltip]',
     *   inputs: [
     *     'text: tooltip'
     *   ],
     *   host: {
     *     '(mouseenter)': 'onMouseEnter()',
     *     '(mouseleave)': 'onMouseLeave()'
     *   }
     * })
     * class Tooltip{
     *   text:string;
     *   overlay:Overlay; // NOT YET IMPLEMENTED
     *   overlayManager:OverlayManager; // NOT YET IMPLEMENTED
     *
     *   constructor(overlayManager:OverlayManager) {
     *     this.overlay = overlay;
     *   }
     *
     *   onMouseEnter() {
     *     // exact signature to be determined
     *     this.overlay = this.overlayManager.open(text, ...);
     *   }
     *
     *   onMouseLeave() {
     *     this.overlay.close();
     *     this.overlay = null;
     *   }
     * }
     * ```
     * In our HTML template, we can then add this behavior to a `<div>` or any other element with the
     * `tooltip` selector,
     * like so:
     *
     * ```
     * <div tooltip="some text here"></div>
     * ```
     *
     * Directives can also control the instantiation, destruction, and positioning of inline template
     * elements:
     *
     * A directive uses a {@link ViewContainerRef} to instantiate, insert, move, and destroy views at
     * runtime.
     * The {@link ViewContainerRef} is created as a result of `<template>` element, and represents a
     * location in the current view
     * where these actions are performed.
     *
     * Views are always created as children of the current {@link ViewMetadata}, and as siblings of the
     * `<template>` element. Thus a
     * directive in a child view cannot inject the directive that created it.
     *
     * Since directives that create views via ViewContainers are common in Angular, and using the full
     * `<template>` element syntax is wordy, Angular
     * also supports a shorthand notation: `<li *foo="bar">` and `<li template="foo: bar">` are
     * equivalent.
     *
     * Thus,
     *
     * ```
     * <ul>
     *   <li *foo="bar" title="text"></li>
     * </ul>
     * ```
     *
     * Expands in use to:
     *
     * ```
     * <ul>
     *   <template [foo]="bar">
     *     <li title="text"></li>
     *   </template>
     * </ul>
     * ```
     *
     * Notice that although the shorthand places `*foo="bar"` within the `<li>` element, the binding for
     * the directive
     * controller is correctly instantiated on the `<template>` element rather than the `<li>` element.
     *
     * ## Lifecycle hooks
     *
     * When the directive class implements some {@link ../../guide/lifecycle-hooks.html} the callbacks
     * are called by the change detection at defined points in time during the life of the directive.
     *
     * ### Example
     *
     * Let's suppose we want to implement the `unless` behavior, to conditionally include a template.
     *
     * Here is a simple directive that triggers on an `unless` selector:
     *
     * ```
     * @Directive({
     *   selector: '[unless]',
     *   inputs: ['unless']
     * })
     * export class Unless {
     *   viewContainer: ViewContainerRef;
     *   templateRef: TemplateRef;
     *   prevCondition: boolean;
     *
     *   constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef) {
     *     this.viewContainer = viewContainer;
     *     this.templateRef = templateRef;
     *     this.prevCondition = null;
     *   }
     *
     *   set unless(newCondition) {
     *     if (newCondition && (isBlank(this.prevCondition) || !this.prevCondition)) {
     *       this.prevCondition = true;
     *       this.viewContainer.clear();
     *     } else if (!newCondition && (isBlank(this.prevCondition) || this.prevCondition)) {
     *       this.prevCondition = false;
     *       this.viewContainer.create(this.templateRef);
     *     }
     *   }
     * }
     * ```
     *
     * We can then use this `unless` selector in a template:
     * ```
     * <ul>
     *   <li *unless="expr"></li>
     * </ul>
     * ```
     *
     * Once the directive instantiates the child view, the shorthand notation for the template expands
     * and the result is:
     *
     * ```
     * <ul>
     *   <template [unless]="exp">
     *     <li></li>
     *   </template>
     *   <li></li>
     * </ul>
     * ```
     *
     * Note also that although the `<li></li>` template still exists inside the `<template></template>`,
     * the instantiated
     * view occurs on the second `<li></li>` which is a sibling to the `<template>` element.
     * @ts2dart_const
     */
    var DirectiveMetadata = (function (_super) {
        __extends(DirectiveMetadata, _super);
        function DirectiveMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, properties = _b.properties, events = _b.events, host = _b.host, bindings = _b.bindings, providers = _b.providers, exportAs = _b.exportAs, queries = _b.queries;
            _super.call(this);
            this.selector = selector;
            this._inputs = inputs;
            this._properties = properties;
            this._outputs = outputs;
            this._events = events;
            this.host = host;
            this.exportAs = exportAs;
            this.queries = queries;
            this._providers = providers;
            this._bindings = bindings;
        }
        Object.defineProperty(DirectiveMetadata.prototype, "inputs", {
            /**
             * Enumerates the set of data-bound input properties for a directive
             *
             * Angular automatically updates input properties during change detection.
             *
             * The `inputs` property defines a set of `directiveProperty` to `bindingProperty`
             * configuration:
             *
             * - `directiveProperty` specifies the component property where the value is written.
             * - `bindingProperty` specifies the DOM property where the value is read from.
             *
             * When `bindingProperty` is not provided, it is assumed to be equal to `directiveProperty`.
             *
             * ### Example ([live demo](http://plnkr.co/edit/ivhfXY?p=preview))
             *
             * The following example creates a component with two data-bound properties.
             *
             * ```typescript
             * @Component({
             *   selector: 'bank-account',
             *   inputs: ['bankName', 'id: account-id'],
             *   template: `
             *     Bank Name: {{bankName}}
             *     Account Id: {{id}}
             *   `
             * })
             * class BankAccount {
             *   bankName: string;
             *   id: string;
             *
             *   // this property is not bound, and won't be automatically updated by Angular
             *   normalizedBankName: string;
             * }
             *
             * @Component({
             *   selector: 'app',
             *   template: `
             *     <bank-account bank-name="RBC" account-id="4747"></bank-account>
             *   `,
             *   directives: [BankAccount]
             * })
             * class App {}
             *
             * bootstrap(App);
             * ```
             *
             */
            get: function () {
                return isPresent(this._properties) && this._properties.length > 0 ? this._properties :
                    this._inputs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveMetadata.prototype, "properties", {
            get: function () { return this.inputs; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveMetadata.prototype, "outputs", {
            /**
             * Enumerates the set of event-bound output properties.
             *
             * When an output property emits an event, an event handler attached to that event
             * the template is invoked.
             *
             * The `outputs` property defines a set of `directiveProperty` to `bindingProperty`
             * configuration:
             *
             * - `directiveProperty` specifies the component property that emits events.
             * - `bindingProperty` specifies the DOM property the event handler is attached to.
             *
             * ### Example ([live demo](http://plnkr.co/edit/d5CNq7?p=preview))
             *
             * ```typescript
             * @Directive({
             *   selector: 'interval-dir',
             *   outputs: ['everySecond', 'five5Secs: everyFiveSeconds']
             * })
             * class IntervalDir {
             *   everySecond = new EventEmitter();
             *   five5Secs = new EventEmitter();
             *
             *   constructor() {
             *     setInterval(() => this.everySecond.emit("event"), 1000);
             *     setInterval(() => this.five5Secs.emit("event"), 5000);
             *   }
             * }
             *
             * @Component({
             *   selector: 'app',
             *   template: `
             *     <interval-dir (everySecond)="everySecond()" (everyFiveSeconds)="everyFiveSeconds()">
             *     </interval-dir>
             *   `,
             *   directives: [IntervalDir]
             * })
             * class App {
             *   everySecond() { console.log('second'); }
             *   everyFiveSeconds() { console.log('five seconds'); }
             * }
             * bootstrap(App);
             * ```
             *
             */
            get: function () {
                return isPresent(this._events) && this._events.length > 0 ? this._events : this._outputs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveMetadata.prototype, "events", {
            get: function () { return this.outputs; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveMetadata.prototype, "providers", {
            /**
             * Defines the set of injectable objects that are visible to a Directive and its light DOM
             * children.
             *
             * ## Simple Example
             *
             * Here is an example of a class that can be injected:
             *
             * ```
             * class Greeter {
             *    greet(name:string) {
             *      return 'Hello ' + name + '!';
             *    }
             * }
             *
             * @Directive({
             *   selector: 'greet',
             *   bindings: [
             *     Greeter
             *   ]
             * })
             * class HelloWorld {
             *   greeter:Greeter;
             *
             *   constructor(greeter:Greeter) {
             *     this.greeter = greeter;
             *   }
             * }
             * ```
             */
            get: function () {
                return isPresent(this._bindings) && this._bindings.length > 0 ? this._bindings :
                    this._providers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DirectiveMetadata.prototype, "bindings", {
            /** @deprecated */
            get: function () { return this.providers; },
            enumerable: true,
            configurable: true
        });
        return DirectiveMetadata;
    }(InjectableMetadata));
    /**
     * Declare reusable UI building blocks for an application.
     *
     * Each Angular component requires a single `@Component` annotation. The
     * `@Component`
     * annotation specifies when a component is instantiated, and which properties and hostListeners it
     * binds to.
     *
     * When a component is instantiated, Angular
     * - creates a shadow DOM for the component.
     * - loads the selected template into the shadow DOM.
     * - creates all the injectable objects configured with `providers` and `viewProviders`.
     *
     * All template expressions and statements are then evaluated against the component instance.
     *
     * For details on the `@View` annotation, see {@link ViewMetadata}.
     *
     * ## Lifecycle hooks
     *
     * When the component class implements some {@link ../../guide/lifecycle-hooks.html} the callbacks
     * are called by the change detection at defined points in time during the life of the component.
     *
     * ### Example
     *
     * {@example core/ts/metadata/metadata.ts region='component'}
     * @ts2dart_const
     */
    var ComponentMetadata = (function (_super) {
        __extends(ComponentMetadata, _super);
        function ComponentMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, selector = _b.selector, inputs = _b.inputs, outputs = _b.outputs, properties = _b.properties, events = _b.events, host = _b.host, exportAs = _b.exportAs, moduleId = _b.moduleId, bindings = _b.bindings, providers = _b.providers, viewBindings = _b.viewBindings, viewProviders = _b.viewProviders, _c = _b.changeDetection, changeDetection = _c === void 0 ? exports.ChangeDetectionStrategy.Default : _c, queries = _b.queries, templateUrl = _b.templateUrl, template = _b.template, styleUrls = _b.styleUrls, styles = _b.styles, directives = _b.directives, pipes = _b.pipes, encapsulation = _b.encapsulation;
            _super.call(this, {
                selector: selector,
                inputs: inputs,
                outputs: outputs,
                properties: properties,
                events: events,
                host: host,
                exportAs: exportAs,
                bindings: bindings,
                providers: providers,
                queries: queries
            });
            this.changeDetection = changeDetection;
            this._viewProviders = viewProviders;
            this._viewBindings = viewBindings;
            this.templateUrl = templateUrl;
            this.template = template;
            this.styleUrls = styleUrls;
            this.styles = styles;
            this.directives = directives;
            this.pipes = pipes;
            this.encapsulation = encapsulation;
            this.moduleId = moduleId;
        }
        Object.defineProperty(ComponentMetadata.prototype, "viewProviders", {
            /**
             * Defines the set of injectable objects that are visible to its view DOM children.
             *
             * ## Simple Example
             *
             * Here is an example of a class that can be injected:
             *
             * ```
             * class Greeter {
             *    greet(name:string) {
             *      return 'Hello ' + name + '!';
             *    }
             * }
             *
             * @Directive({
             *   selector: 'needs-greeter'
             * })
             * class NeedsGreeter {
             *   greeter:Greeter;
             *
             *   constructor(greeter:Greeter) {
             *     this.greeter = greeter;
             *   }
             * }
             *
             * @Component({
             *   selector: 'greet',
             *   viewProviders: [
             *     Greeter
             *   ],
             *   template: `<needs-greeter></needs-greeter>`,
             *   directives: [NeedsGreeter]
             * })
             * class HelloWorld {
             * }
             *
             * ```
             */
            get: function () {
                return isPresent(this._viewBindings) && this._viewBindings.length > 0 ? this._viewBindings :
                    this._viewProviders;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentMetadata.prototype, "viewBindings", {
            get: function () { return this.viewProviders; },
            enumerable: true,
            configurable: true
        });
        return ComponentMetadata;
    }(DirectiveMetadata));
    /**
     * Declare reusable pipe function.
     *
     * A "pure" pipe is only re-evaluated when either the input or any of the arguments change.
     *
     * When not specified, pipes default to being pure.
     *
     * ### Example
     *
     * {@example core/ts/metadata/metadata.ts region='pipe'}
     * @ts2dart_const
     */
    var PipeMetadata = (function (_super) {
        __extends(PipeMetadata, _super);
        function PipeMetadata(_a) {
            var name = _a.name, pure = _a.pure;
            _super.call(this);
            this.name = name;
            this._pure = pure;
        }
        Object.defineProperty(PipeMetadata.prototype, "pure", {
            get: function () { return isPresent(this._pure) ? this._pure : true; },
            enumerable: true,
            configurable: true
        });
        return PipeMetadata;
    }(InjectableMetadata));
    /**
     * Declares a data-bound input property.
     *
     * Angular automatically updates data-bound properties during change detection.
     *
     * `InputMetadata` takes an optional parameter that specifies the name
     * used when instantiating a component in the template. When not provided,
     * the name of the decorated property is used.
     *
     * ### Example
     *
     * The following example creates a component with two input properties.
     *
     * ```typescript
     * @Component({
     *   selector: 'bank-account',
     *   template: `
     *     Bank Name: {{bankName}}
     *     Account Id: {{id}}
     *   `
     * })
     * class BankAccount {
     *   @Input() bankName: string;
     *   @Input('account-id') id: string;
     *
     *   // this property is not bound, and won't be automatically updated by Angular
     *   normalizedBankName: string;
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `
     *     <bank-account bank-name="RBC" account-id="4747"></bank-account>
     *   `,
     *   directives: [BankAccount]
     * })
     * class App {}
     *
     * bootstrap(App);
     * ```
     * @ts2dart_const
     */
    var InputMetadata = (function () {
        function InputMetadata(
            /**
             * Name used when instantiating a component in the template.
             */
            bindingPropertyName) {
            this.bindingPropertyName = bindingPropertyName;
        }
        return InputMetadata;
    }());
    /**
     * Declares an event-bound output property.
     *
     * When an output property emits an event, an event handler attached to that event
     * the template is invoked.
     *
     * `OutputMetadata` takes an optional parameter that specifies the name
     * used when instantiating a component in the template. When not provided,
     * the name of the decorated property is used.
     *
     * ### Example
     *
     * ```typescript
     * @Directive({
     *   selector: 'interval-dir',
     * })
     * class IntervalDir {
     *   @Output() everySecond = new EventEmitter();
     *   @Output('everyFiveSeconds') five5Secs = new EventEmitter();
     *
     *   constructor() {
     *     setInterval(() => this.everySecond.emit("event"), 1000);
     *     setInterval(() => this.five5Secs.emit("event"), 5000);
     *   }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `
     *     <interval-dir (everySecond)="everySecond()" (everyFiveSeconds)="everyFiveSeconds()">
     *     </interval-dir>
     *   `,
     *   directives: [IntervalDir]
     * })
     * class App {
     *   everySecond() { console.log('second'); }
     *   everyFiveSeconds() { console.log('five seconds'); }
     * }
     * bootstrap(App);
     * ```
     * @ts2dart_const
     */
    var OutputMetadata = (function () {
        function OutputMetadata(bindingPropertyName) {
            this.bindingPropertyName = bindingPropertyName;
        }
        return OutputMetadata;
    }());
    /**
     * Declares a host property binding.
     *
     * Angular automatically checks host property bindings during change detection.
     * If a binding changes, it will update the host element of the directive.
     *
     * `HostBindingMetadata` takes an optional parameter that specifies the property
     * name of the host element that will be updated. When not provided,
     * the class property name is used.
     *
     * ### Example
     *
     * The following example creates a directive that sets the `valid` and `invalid` classes
     * on the DOM element that has ngModel directive on it.
     *
     * ```typescript
     * @Directive({selector: '[ngModel]'})
     * class NgModelStatus {
     *   constructor(public control:NgModel) {}
     *   @HostBinding('class.valid') get valid { return this.control.valid; }
     *   @HostBinding('class.invalid') get invalid { return this.control.invalid; }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `<input [(ngModel)]="prop">`,
     *   directives: [FORM_DIRECTIVES, NgModelStatus]
     * })
     * class App {
     *   prop;
     * }
     *
     * bootstrap(App);
     * ```
     * @ts2dart_const
     */
    var HostBindingMetadata = (function () {
        function HostBindingMetadata(hostPropertyName) {
            this.hostPropertyName = hostPropertyName;
        }
        return HostBindingMetadata;
    }());
    /**
     * Declares a host listener.
     *
     * Angular will invoke the decorated method when the host element emits the specified event.
     *
     * If the decorated method returns `false`, then `preventDefault` is applied on the DOM
     * event.
     *
     * ### Example
     *
     * The following example declares a directive that attaches a click listener to the button and
     * counts clicks.
     *
     * ```typescript
     * @Directive({selector: 'button[counting]'})
     * class CountClicks {
     *   numberOfClicks = 0;
     *
     *   @HostListener('click', ['$event.target'])
     *   onClick(btn) {
     *     console.log("button", btn, "number of clicks:", this.numberOfClicks++);
     *   }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `<button counting>Increment</button>`,
     *   directives: [CountClicks]
     * })
     * class App {}
     *
     * bootstrap(App);
     * ```
     * @ts2dart_const
     */
    var HostListenerMetadata = (function () {
        function HostListenerMetadata(eventName, args) {
            this.eventName = eventName;
            this.args = args;
        }
        return HostListenerMetadata;
    }());
    /**
     * Defines template and style encapsulation options available for Component's {@link View}.
     *
     * See {@link ViewMetadata#encapsulation}.
     */
    exports.ViewEncapsulation;
    (function (ViewEncapsulation) {
        /**
         * Emulate `Native` scoping of styles by adding an attribute containing surrogate id to the Host
         * Element and pre-processing the style rules provided via
         * {@link ViewMetadata#styles} or {@link ViewMetadata#stylesUrls}, and adding the new Host Element
         * attribute to all selectors.
         *
         * This is the default option.
         */
        ViewEncapsulation[ViewEncapsulation["Emulated"] = 0] = "Emulated";
        /**
         * Use the native encapsulation mechanism of the renderer.
         *
         * For the DOM this means using [Shadow DOM](https://w3c.github.io/webcomponents/spec/shadow/) and
         * creating a ShadowRoot for Component's Host Element.
         */
        ViewEncapsulation[ViewEncapsulation["Native"] = 1] = "Native";
        /**
         * Don't provide any template or style encapsulation.
         */
        ViewEncapsulation[ViewEncapsulation["None"] = 2] = "None";
    })(exports.ViewEncapsulation || (exports.ViewEncapsulation = {}));
    var VIEW_ENCAPSULATION_VALUES = [exports.ViewEncapsulation.Emulated, exports.ViewEncapsulation.Native, exports.ViewEncapsulation.None];
    /**
     * Metadata properties available for configuring Views.
     *
     * Each Angular component requires a single `@Component` and at least one `@View` annotation. The
     * `@View` annotation specifies the HTML template to use, and lists the directives that are active
     * within the template.
     *
     * When a component is instantiated, the template is loaded into the component's shadow root, and
     * the expressions and statements in the template are evaluated against the component.
     *
     * For details on the `@Component` annotation, see {@link ComponentMetadata}.
     *
     * ### Example
     *
     * ```
     * @Component({
     *   selector: 'greet',
     *   template: 'Hello {{name}}!',
     *   directives: [GreetUser, Bold]
     * })
     * class Greet {
     *   name: string;
     *
     *   constructor() {
     *     this.name = 'World';
     *   }
     * }
     * ```
     * @ts2dart_const
     */
    var ViewMetadata = (function () {
        function ViewMetadata(_a) {
            var _b = _a === void 0 ? {} : _a, templateUrl = _b.templateUrl, template = _b.template, directives = _b.directives, pipes = _b.pipes, encapsulation = _b.encapsulation, styles = _b.styles, styleUrls = _b.styleUrls;
            this.templateUrl = templateUrl;
            this.template = template;
            this.styleUrls = styleUrls;
            this.styles = styles;
            this.directives = directives;
            this.pipes = pipes;
            this.encapsulation = encapsulation;
        }
        return ViewMetadata;
    }());
    var _nextClassId = 0;
    function extractAnnotation(annotation) {
        if (isFunction(annotation) && annotation.hasOwnProperty('annotation')) {
            // it is a decorator, extract annotation
            annotation = annotation.annotation;
        }
        return annotation;
    }
    function applyParams(fnOrArray, key) {
        if (fnOrArray === Object || fnOrArray === String || fnOrArray === Function ||
            fnOrArray === Number || fnOrArray === Array) {
            throw new Error("Can not use native " + stringify(fnOrArray) + " as constructor");
        }
        if (isFunction(fnOrArray)) {
            return fnOrArray;
        }
        else if (fnOrArray instanceof Array) {
            var annotations = fnOrArray;
            var fn = fnOrArray[fnOrArray.length - 1];
            if (!isFunction(fn)) {
                throw new Error("Last position of Class method array must be Function in key " + key + " was '" + stringify(fn) + "'");
            }
            var annoLength = annotations.length - 1;
            if (annoLength != fn.length) {
                throw new Error("Number of annotations (" + annoLength + ") does not match number of arguments (" + fn.length + ") in the function: " + stringify(fn));
            }
            var paramsAnnotations = [];
            for (var i = 0, ii = annotations.length - 1; i < ii; i++) {
                var paramAnnotations = [];
                paramsAnnotations.push(paramAnnotations);
                var annotation = annotations[i];
                if (annotation instanceof Array) {
                    for (var j = 0; j < annotation.length; j++) {
                        paramAnnotations.push(extractAnnotation(annotation[j]));
                    }
                }
                else if (isFunction(annotation)) {
                    paramAnnotations.push(extractAnnotation(annotation));
                }
                else {
                    paramAnnotations.push(annotation);
                }
            }
            Reflect.defineMetadata('parameters', paramsAnnotations, fn);
            return fn;
        }
        else {
            throw new Error("Only Function or Array is supported in Class definition for key '" + key + "' is '" + stringify(fnOrArray) + "'");
        }
    }
    /**
     * Provides a way for expressing ES6 classes with parameter annotations in ES5.
     *
     * ## Basic Example
     *
     * ```
     * var Greeter = ng.Class({
     *   constructor: function(name) {
     *     this.name = name;
     *   },
     *
     *   greet: function() {
     *     alert('Hello ' + this.name + '!');
     *   }
     * });
     * ```
     *
     * is equivalent to ES6:
     *
     * ```
     * class Greeter {
     *   constructor(name) {
     *     this.name = name;
     *   }
     *
     *   greet() {
     *     alert('Hello ' + this.name + '!');
     *   }
     * }
     * ```
     *
     * or equivalent to ES5:
     *
     * ```
     * var Greeter = function (name) {
     *   this.name = name;
     * }
     *
     * Greeter.prototype.greet = function () {
     *   alert('Hello ' + this.name + '!');
     * }
     * ```
     *
     * ### Example with parameter annotations
     *
     * ```
     * var MyService = ng.Class({
     *   constructor: [String, [new Query(), QueryList], function(name, queryList) {
     *     ...
     *   }]
     * });
     * ```
     *
     * is equivalent to ES6:
     *
     * ```
     * class MyService {
     *   constructor(name: string, @Query() queryList: QueryList) {
     *     ...
     *   }
     * }
     * ```
     *
     * ### Example with inheritance
     *
     * ```
     * var Shape = ng.Class({
     *   constructor: (color) {
     *     this.color = color;
     *   }
     * });
     *
     * var Square = ng.Class({
     *   extends: Shape,
     *   constructor: function(color, size) {
     *     Shape.call(this, color);
     *     this.size = size;
     *   }
     * });
     * ```
     */
    function Class(clsDef) {
        var constructor = applyParams(clsDef.hasOwnProperty('constructor') ? clsDef.constructor : undefined, 'constructor');
        var proto = constructor.prototype;
        if (clsDef.hasOwnProperty('extends')) {
            if (isFunction(clsDef.extends)) {
                constructor.prototype = proto =
                    Object.create(clsDef.extends.prototype);
            }
            else {
                throw new Error("Class definition 'extends' property must be a constructor function was: " + stringify(clsDef.extends));
            }
        }
        for (var key in clsDef) {
            if (key != 'extends' && key != 'prototype' && clsDef.hasOwnProperty(key)) {
                proto[key] = applyParams(clsDef[key], key);
            }
        }
        if (this && this.annotations instanceof Array) {
            Reflect.defineMetadata('annotations', this.annotations, constructor);
        }
        if (!constructor['name']) {
            constructor['overriddenName'] = "class" + _nextClassId++;
        }
        return constructor;
    }
    var Reflect = global$1.Reflect;
    function makeDecorator(annotationCls, chainFn) {
        if (chainFn === void 0) { chainFn = null; }
        function DecoratorFactory(objOrType) {
            var annotationInstance = new annotationCls(objOrType);
            if (this instanceof annotationCls) {
                return annotationInstance;
            }
            else {
                var chainAnnotation = isFunction(this) && this.annotations instanceof Array ? this.annotations : [];
                chainAnnotation.push(annotationInstance);
                var TypeDecorator = function TypeDecorator(cls) {
                    var annotations = Reflect.getOwnMetadata('annotations', cls);
                    annotations = annotations || [];
                    annotations.push(annotationInstance);
                    Reflect.defineMetadata('annotations', annotations, cls);
                    return cls;
                };
                TypeDecorator.annotations = chainAnnotation;
                TypeDecorator.Class = Class;
                if (chainFn)
                    chainFn(TypeDecorator);
                return TypeDecorator;
            }
        }
        DecoratorFactory.prototype = Object.create(annotationCls.prototype);
        DecoratorFactory.annotationCls = annotationCls;
        return DecoratorFactory;
    }
    function makeParamDecorator(annotationCls) {
        function ParamDecoratorFactory() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var annotationInstance = Object.create(annotationCls.prototype);
            annotationCls.apply(annotationInstance, args);
            if (this instanceof annotationCls) {
                return annotationInstance;
            }
            else {
                ParamDecorator.annotation = annotationInstance;
                return ParamDecorator;
            }
            function ParamDecorator(cls, unusedKey, index) {
                var parameters = Reflect.getMetadata('parameters', cls);
                parameters = parameters || [];
                // there might be gaps if some in between parameters do not have annotations.
                // we pad with nulls.
                while (parameters.length <= index) {
                    parameters.push(null);
                }
                parameters[index] = parameters[index] || [];
                var annotationsForParam = parameters[index];
                annotationsForParam.push(annotationInstance);
                Reflect.defineMetadata('parameters', parameters, cls);
                return cls;
            }
        }
        ParamDecoratorFactory.prototype = Object.create(annotationCls.prototype);
        ParamDecoratorFactory.annotationCls = annotationCls;
        return ParamDecoratorFactory;
    }
    function makePropDecorator(annotationCls) {
        function PropDecoratorFactory() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var decoratorInstance = Object.create(annotationCls.prototype);
            annotationCls.apply(decoratorInstance, args);
            if (this instanceof annotationCls) {
                return decoratorInstance;
            }
            else {
                return function PropDecorator(target, name) {
                    var meta = Reflect.getOwnMetadata('propMetadata', target.constructor);
                    meta = meta || {};
                    meta[name] = meta[name] || [];
                    meta[name].unshift(decoratorInstance);
                    Reflect.defineMetadata('propMetadata', meta, target.constructor);
                };
            }
        }
        PropDecoratorFactory.prototype = Object.create(annotationCls.prototype);
        PropDecoratorFactory.annotationCls = annotationCls;
        return PropDecoratorFactory;
    }
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ComponentMetadata.
    /**
     * Declare reusable UI building blocks for an application.
     *
     * Each Angular component requires a single `@Component` annotation. The `@Component`
     * annotation specifies when a component is instantiated, and which properties and hostListeners it
     * binds to.
     *
     * When a component is instantiated, Angular
     * - creates a shadow DOM for the component.
     * - loads the selected template into the shadow DOM.
     * - creates all the injectable objects configured with `providers` and `viewProviders`.
     *
     * All template expressions and statements are then evaluated against the component instance.
     *
     * ## Lifecycle hooks
     *
     * When the component class implements some {@link ../../guide/lifecycle-hooks.html} the callbacks
     * are called by the change detection at defined points in time during the life of the component.
     *
     * ### Example
     *
     * {@example core/ts/metadata/metadata.ts region='component'}
     */
    var Component = makeDecorator(ComponentMetadata, function (fn) { return fn.View = View; });
    // TODO(alexeagle): remove the duplication of this doc. It is copied from DirectiveMetadata.
    /**
     * Directives allow you to attach behavior to elements in the DOM.
     *
     * {@link DirectiveMetadata}s with an embedded view are called {@link ComponentMetadata}s.
     *
     * A directive consists of a single directive annotation and a controller class. When the
     * directive's `selector` matches
     * elements in the DOM, the following steps occur:
     *
     * 1. For each directive, the `ElementInjector` attempts to resolve the directive's constructor
     * arguments.
     * 2. Angular instantiates directives for each matched element using `ElementInjector` in a
     * depth-first order,
     *    as declared in the HTML.
     *
     * ## Understanding How Injection Works
     *
     * There are three stages of injection resolution.
     * - *Pre-existing Injectors*:
     *   - The terminal {@link Injector} cannot resolve dependencies. It either throws an error or, if
     * the dependency was
     *     specified as `@Optional`, returns `null`.
     *   - The platform injector resolves browser singleton resources, such as: cookies, title,
     * location, and others.
     * - *Component Injectors*: Each component instance has its own {@link Injector}, and they follow
     * the same parent-child hierarchy
     *     as the component instances in the DOM.
     * - *Element Injectors*: Each component instance has a Shadow DOM. Within the Shadow DOM each
     * element has an `ElementInjector`
     *     which follow the same parent-child hierarchy as the DOM elements themselves.
     *
     * When a template is instantiated, it also must instantiate the corresponding directives in a
     * depth-first order. The
     * current `ElementInjector` resolves the constructor dependencies for each directive.
     *
     * Angular then resolves dependencies as follows, according to the order in which they appear in the
     * {@link ViewMetadata}:
     *
     * 1. Dependencies on the current element
     * 2. Dependencies on element injectors and their parents until it encounters a Shadow DOM boundary
     * 3. Dependencies on component injectors and their parents until it encounters the root component
     * 4. Dependencies on pre-existing injectors
     *
     *
     * The `ElementInjector` can inject other directives, element-specific special objects, or it can
     * delegate to the parent
     * injector.
     *
     * To inject other directives, declare the constructor parameter as:
     * - `directive:DirectiveType`: a directive on the current element only
     * - `@Host() directive:DirectiveType`: any directive that matches the type between the current
     * element and the
     *    Shadow DOM root.
     * - `@Query(DirectiveType) query:QueryList<DirectiveType>`: A live collection of direct child
     * directives.
     * - `@QueryDescendants(DirectiveType) query:QueryList<DirectiveType>`: A live collection of any
     * child directives.
     *
     * To inject element-specific special objects, declare the constructor parameter as:
     * - `element: ElementRef` to obtain a reference to logical element in the view.
     * - `viewContainer: ViewContainerRef` to control child template instantiation, for
     * {@link DirectiveMetadata} directives only
     * - `bindingPropagation: BindingPropagation` to control change detection in a more granular way.
     *
     * ### Example
     *
     * The following example demonstrates how dependency injection resolves constructor arguments in
     * practice.
     *
     *
     * Assume this HTML template:
     *
     * ```
     * <div dependency="1">
     *   <div dependency="2">
     *     <div dependency="3" my-directive>
     *       <div dependency="4">
     *         <div dependency="5"></div>
     *       </div>
     *       <div dependency="6"></div>
     *     </div>
     *   </div>
     * </div>
     * ```
     *
     * With the following `dependency` decorator and `SomeService` injectable class.
     *
     * ```
     * @Injectable()
     * class SomeService {
     * }
     *
     * @Directive({
     *   selector: '[dependency]',
     *   inputs: [
     *     'id: dependency'
     *   ]
     * })
     * class Dependency {
     *   id:string;
     * }
     * ```
     *
     * Let's step through the different ways in which `MyDirective` could be declared...
     *
     *
     * ### No injection
     *
     * Here the constructor is declared with no arguments, therefore nothing is injected into
     * `MyDirective`.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor() {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with no dependencies.
     *
     *
     * ### Component-level injection
     *
     * Directives can inject any injectable instance from the closest component injector or any of its
     * parents.
     *
     * Here, the constructor declares a parameter, `someService`, and injects the `SomeService` type
     * from the parent
     * component's injector.
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(someService: SomeService) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a dependency on `SomeService`.
     *
     *
     * ### Injecting a directive from the current element
     *
     * Directives can inject other directives declared on the current element.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(dependency: Dependency) {
     *     expect(dependency.id).toEqual(3);
     *   }
     * }
     * ```
     * This directive would be instantiated with `Dependency` declared at the same element, in this case
     * `dependency="3"`.
     *
     * ### Injecting a directive from any ancestor elements
     *
     * Directives can inject other directives declared on any ancestor element (in the current Shadow
     * DOM), i.e. on the current element, the
     * parent element, or its parents.
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Host() dependency: Dependency) {
     *     expect(dependency.id).toEqual(2);
     *   }
     * }
     * ```
     *
     * `@Host` checks the current element, the parent, as well as its parents recursively. If
     * `dependency="2"` didn't
     * exist on the direct parent, this injection would
     * have returned
     * `dependency="1"`.
     *
     *
     * ### Injecting a live collection of direct child directives
     *
     *
     * A directive can also query for other child directives. Since parent directives are instantiated
     * before child directives, a directive can't simply inject the list of child directives. Instead,
     * the directive injects a {@link QueryList}, which updates its contents as children are added,
     * removed, or moved by a directive that uses a {@link ViewContainerRef} such as a `ngFor`, an
     * `ngIf`, or an `ngSwitch`.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Query(Dependency) dependencies:QueryList<Dependency>) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a {@link QueryList} which contains `Dependency` 4 and
     * 6. Here, `Dependency` 5 would not be included, because it is not a direct child.
     *
     * ### Injecting a live collection of descendant directives
     *
     * By passing the descendant flag to `@Query` above, we can include the children of the child
     * elements.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Query(Dependency, {descendants: true}) dependencies:QueryList<Dependency>) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a Query which would contain `Dependency` 4, 5 and 6.
     *
     * ### Optional injection
     *
     * The normal behavior of directives is to return an error when a specified dependency cannot be
     * resolved. If you
     * would like to inject `null` on unresolved dependency instead, you can annotate that dependency
     * with `@Optional()`.
     * This explicitly permits the author of a template to treat some of the surrounding directives as
     * optional.
     *
     * ```
     * @Directive({ selector: '[my-directive]' })
     * class MyDirective {
     *   constructor(@Optional() dependency:Dependency) {
     *   }
     * }
     * ```
     *
     * This directive would be instantiated with a `Dependency` directive found on the current element.
     * If none can be
     * found, the injector supplies `null` instead of throwing an error.
     *
     * ### Example
     *
     * Here we use a decorator directive to simply define basic tool-tip behavior.
     *
     * ```
     * @Directive({
     *   selector: '[tooltip]',
     *   inputs: [
     *     'text: tooltip'
     *   ],
     *   host: {
     *     '(mouseenter)': 'onMouseEnter()',
     *     '(mouseleave)': 'onMouseLeave()'
     *   }
     * })
     * class Tooltip{
     *   text:string;
     *   overlay:Overlay; // NOT YET IMPLEMENTED
     *   overlayManager:OverlayManager; // NOT YET IMPLEMENTED
     *
     *   constructor(overlayManager:OverlayManager) {
     *     this.overlay = overlay;
     *   }
     *
     *   onMouseEnter() {
     *     // exact signature to be determined
     *     this.overlay = this.overlayManager.open(text, ...);
     *   }
     *
     *   onMouseLeave() {
     *     this.overlay.close();
     *     this.overlay = null;
     *   }
     * }
     * ```
     * In our HTML template, we can then add this behavior to a `<div>` or any other element with the
     * `tooltip` selector,
     * like so:
     *
     * ```
     * <div tooltip="some text here"></div>
     * ```
     *
     * Directives can also control the instantiation, destruction, and positioning of inline template
     * elements:
     *
     * A directive uses a {@link ViewContainerRef} to instantiate, insert, move, and destroy views at
     * runtime.
     * The {@link ViewContainerRef} is created as a result of `<template>` element, and represents a
     * location in the current view
     * where these actions are performed.
     *
     * Views are always created as children of the current {@link ViewMetadata}, and as siblings of the
     * `<template>` element. Thus a
     * directive in a child view cannot inject the directive that created it.
     *
     * Since directives that create views via ViewContainers are common in Angular, and using the full
     * `<template>` element syntax is wordy, Angular
     * also supports a shorthand notation: `<li *foo="bar">` and `<li template="foo: bar">` are
     * equivalent.
     *
     * Thus,
     *
     * ```
     * <ul>
     *   <li *foo="bar" title="text"></li>
     * </ul>
     * ```
     *
     * Expands in use to:
     *
     * ```
     * <ul>
     *   <template [foo]="bar">
     *     <li title="text"></li>
     *   </template>
     * </ul>
     * ```
     *
     * Notice that although the shorthand places `*foo="bar"` within the `<li>` element, the binding for
     * the directive
     * controller is correctly instantiated on the `<template>` element rather than the `<li>` element.
     *
     * ## Lifecycle hooks
     *
     * When the directive class implements some {@link ../../guide/lifecycle-hooks.html} the callbacks
     * are called by the change detection at defined points in time during the life of the directive.
     *
     * ### Example
     *
     * Let's suppose we want to implement the `unless` behavior, to conditionally include a template.
     *
     * Here is a simple directive that triggers on an `unless` selector:
     *
     * ```
     * @Directive({
     *   selector: '[unless]',
     *   inputs: ['unless']
     * })
     * export class Unless {
     *   viewContainer: ViewContainerRef;
     *   templateRef: TemplateRef;
     *   prevCondition: boolean;
     *
     *   constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef) {
     *     this.viewContainer = viewContainer;
     *     this.templateRef = templateRef;
     *     this.prevCondition = null;
     *   }
     *
     *   set unless(newCondition) {
     *     if (newCondition && (isBlank(this.prevCondition) || !this.prevCondition)) {
     *       this.prevCondition = true;
     *       this.viewContainer.clear();
     *     } else if (!newCondition && (isBlank(this.prevCondition) || this.prevCondition)) {
     *       this.prevCondition = false;
     *       this.viewContainer.create(this.templateRef);
     *     }
     *   }
     * }
     * ```
     *
     * We can then use this `unless` selector in a template:
     * ```
     * <ul>
     *   <li *unless="expr"></li>
     * </ul>
     * ```
     *
     * Once the directive instantiates the child view, the shorthand notation for the template expands
     * and the result is:
     *
     * ```
     * <ul>
     *   <template [unless]="exp">
     *     <li></li>
     *   </template>
     *   <li></li>
     * </ul>
     * ```
     *
     * Note also that although the `<li></li>` template still exists inside the `<template></template>`,
     * the instantiated
     * view occurs on the second `<li></li>` which is a sibling to the `<template>` element.
     */
    var Directive = makeDecorator(DirectiveMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ViewMetadata.
    /**
     * Metadata properties available for configuring Views.
     *
     * Each Angular component requires a single `@Component` and at least one `@View` annotation. The
     * `@View` annotation specifies the HTML template to use, and lists the directives that are active
     * within the template.
     *
     * When a component is instantiated, the template is loaded into the component's shadow root, and
     * the expressions and statements in the template are evaluated against the component.
     *
     * For details on the `@Component` annotation, see {@link ComponentMetadata}.
     *
     * ### Example
     *
     * ```
     * @Component({
     *   selector: 'greet',
     *   template: 'Hello {{name}}!',
     *   directives: [GreetUser, Bold]
     * })
     * class Greet {
     *   name: string;
     *
     *   constructor() {
     *     this.name = 'World';
     *   }
     * }
     * ```
     */
    var View = makeDecorator(ViewMetadata, function (fn) { return fn.View = View; });
    /**
     * Specifies that a constant attribute value should be injected.
     *
     * The directive can inject constant string literals of host element attributes.
     *
     * ### Example
     *
     * Suppose we have an `<input>` element and want to know its `type`.
     *
     * ```html
     * <input type="text">
     * ```
     *
     * A decorator can inject string literal `text` like so:
     *
     * {@example core/ts/metadata/metadata.ts region='attributeMetadata'}
     */
    var Attribute = makeParamDecorator(AttributeMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from QueryMetadata.
    /**
     * Declares an injectable parameter to be a live list of directives or variable
     * bindings from the content children of a directive.
     *
     * ### Example ([live demo](http://plnkr.co/edit/lY9m8HLy7z06vDoUaSN2?p=preview))
     *
     * Assume that `<tabs>` component would like to get a list its children `<pane>`
     * components as shown in this example:
     *
     * ```html
     * <tabs>
     *   <pane title="Overview">...</pane>
     *   <pane *ngFor="let o of objects" [title]="o.title">{{o.text}}</pane>
     * </tabs>
     * ```
     *
     * The preferred solution is to query for `Pane` directives using this decorator.
     *
     * ```javascript
     * @Component({
     *   selector: 'pane',
     *   inputs: ['title']
     * })
     * class Pane {
     *   title:string;
     * }
     *
     * @Component({
     *  selector: 'tabs',
     *  template: `
     *    <ul>
     *      <li *ngFor="let pane of panes">{{pane.title}}</li>
     *    </ul>
     *    <ng-content></ng-content>
     *  `
     * })
     * class Tabs {
     *   panes: QueryList<Pane>;
     *   constructor(@Query(Pane) panes:QueryList<Pane>) {
     *     this.panes = panes;
     *   }
     * }
     * ```
     *
     * A query can look for variable bindings by passing in a string with desired binding symbol.
     *
     * ### Example ([live demo](http://plnkr.co/edit/sT2j25cH1dURAyBRCKx1?p=preview))
     * ```html
     * <seeker>
     *   <div #findme>...</div>
     * </seeker>
     *
     * @Component({ selector: 'seeker' })
     * class seeker {
     *   constructor(@Query('findme') elList: QueryList<ElementRef>) {...}
     * }
     * ```
     *
     * In this case the object that is injected depend on the type of the variable
     * binding. It can be an ElementRef, a directive or a component.
     *
     * Passing in a comma separated list of variable bindings will query for all of them.
     *
     * ```html
     * <seeker>
     *   <div #findMe>...</div>
     *   <div #findMeToo>...</div>
     * </seeker>
     *
     *  @Component({
     *   selector: 'seeker'
     * })
     * class Seeker {
     *   constructor(@Query('findMe, findMeToo') elList: QueryList<ElementRef>) {...}
     * }
     * ```
     *
     * Configure whether query looks for direct children or all descendants
     * of the querying element, by using the `descendants` parameter.
     * It is set to `false` by default.
     *
     * ### Example ([live demo](http://plnkr.co/edit/wtGeB977bv7qvA5FTYl9?p=preview))
     * ```html
     * <container #first>
     *   <item>a</item>
     *   <item>b</item>
     *   <container #second>
     *     <item>c</item>
     *   </container>
     * </container>
     * ```
     *
     * When querying for items, the first container will see only `a` and `b` by default,
     * but with `Query(TextDirective, {descendants: true})` it will see `c` too.
     *
     * The queried directives are kept in a depth-first pre-order with respect to their
     * positions in the DOM.
     *
     * Query does not look deep into any subcomponent views.
     *
     * Query is updated as part of the change-detection cycle. Since change detection
     * happens after construction of a directive, QueryList will always be empty when observed in the
     * constructor.
     *
     * The injected object is an unmodifiable live list.
     * See {@link QueryList} for more details.
     */
    var Query = makeParamDecorator(QueryMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ContentChildrenMetadata.
    /**
     * Configures a content query.
     *
     * Content queries are set before the `ngAfterContentInit` callback is called.
     *
     * ### Example
     *
     * ```
     * @Directive({
     *   selector: 'someDir'
     * })
     * class SomeDir {
     *   @ContentChildren(ChildDirective) contentChildren: QueryList<ChildDirective>;
     *
     *   ngAfterContentInit() {
     *     // contentChildren is set
     *   }
     * }
     * ```
     */
    var ContentChildren = makePropDecorator(ContentChildrenMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ContentChildMetadata.
    /**
     * Configures a content query.
     *
     * Content queries are set before the `ngAfterContentInit` callback is called.
     *
     * ### Example
     *
     * ```
     * @Directive({
     *   selector: 'someDir'
     * })
     * class SomeDir {
     *   @ContentChild(ChildDirective) contentChild;
     *
     *   ngAfterContentInit() {
     *     // contentChild is set
     *   }
     * }
     * ```
     */
    var ContentChild = makePropDecorator(ContentChildMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ViewChildrenMetadata.
    /**
     * Declares a list of child element references.
     *
     * Angular automatically updates the list when the DOM is updated.
     *
     * `ViewChildren` takes a argument to select elements.
     *
     * - If the argument is a type, directives or components with the type will be bound.
     *
     * - If the argument is a string, the string is interpreted as a list of comma-separated selectors.
     * For each selector, an element containing the matching template variable (e.g. `#child`) will be
     * bound.
     *
     * View children are set before the `ngAfterViewInit` callback is called.
     *
     * ### Example
     *
     * With type selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: `
     *     <child-cmp></child-cmp>
     *     <child-cmp></child-cmp>
     *     <child-cmp></child-cmp>
     *   `,
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChildren(ChildCmp) children:QueryList<ChildCmp>;
     *
     *   ngAfterViewInit() {
     *     // children are set
     *     this.children.toArray().forEach((child)=>child.doSomething());
     *   }
     * }
     * ```
     *
     * With string selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: `
     *     <child-cmp #child1></child-cmp>
     *     <child-cmp #child2></child-cmp>
     *     <child-cmp #child3></child-cmp>
     *   `,
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChildren('child1,child2,child3') children:QueryList<ChildCmp>;
     *
     *   ngAfterViewInit() {
     *     // children are set
     *     this.children.toArray().forEach((child)=>child.doSomething());
     *   }
     * }
     * ```
     *
     * See also: [ViewChildrenMetadata]
     */
    var ViewChildren = makePropDecorator(ViewChildrenMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ViewChildMetadata.
    /**
     * Declares a reference to a child element.
     *
     * `ViewChildren` takes a argument to select elements.
     *
     * - If the argument is a type, a directive or a component with the type will be bound.
     *
     * - If the argument is a string, the string is interpreted as a selector. An element containing the
     * matching template variable (e.g. `#child`) will be bound.
     *
     * In either case, `@ViewChild()` assigns the first (looking from above) element if there are
     * multiple matches.
     *
     * View child is set before the `ngAfterViewInit` callback is called.
     *
     * ### Example
     *
     * With type selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: '<child-cmp></child-cmp>',
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChild(ChildCmp) child:ChildCmp;
     *
     *   ngAfterViewInit() {
     *     // child is set
     *     this.child.doSomething();
     *   }
     * }
     * ```
     *
     * With string selector:
     *
     * ```
     * @Component({
     *   selector: 'child-cmp',
     *   template: '<p>child</p>'
     * })
     * class ChildCmp {
     *   doSomething() {}
     * }
     *
     * @Component({
     *   selector: 'some-cmp',
     *   template: '<child-cmp #child></child-cmp>',
     *   directives: [ChildCmp]
     * })
     * class SomeCmp {
     *   @ViewChild('child') child:ChildCmp;
     *
     *   ngAfterViewInit() {
     *     // child is set
     *     this.child.doSomething();
     *   }
     * }
     * ```
     * See also: [ViewChildMetadata]
     */
    var ViewChild = makePropDecorator(ViewChildMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from ViewQueryMetadata.
    /**
     * Similar to {@link QueryMetadata}, but querying the component view, instead of
     * the content children.
     *
     * ### Example ([live demo](http://plnkr.co/edit/eNsFHDf7YjyM6IzKxM1j?p=preview))
     *
     * ```javascript
     * @Component({
     *   ...,
     *   template: `
     *     <item> a </item>
     *     <item> b </item>
     *     <item> c </item>
     *   `
     * })
     * class MyComponent {
     *   shown: boolean;
     *
     *   constructor(private @Query(Item) items:QueryList<Item>) {
     *     items.changes.subscribe(() => console.log(items.length));
     *   }
     * }
     * ```
     *
     * Supports the same querying parameters as {@link QueryMetadata}, except
     * `descendants`. This always queries the whole view.
     *
     * As `shown` is flipped between true and false, items will contain zero of one
     * items.
     *
     * Specifies that a {@link QueryList} should be injected.
     *
     * The injected object is an iterable and observable live list.
     * See {@link QueryList} for more details.
     */
    var ViewQuery = makeParamDecorator(ViewQueryMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from PipeMetadata.
    /**
     * Declare reusable pipe function.
     *
     * ### Example
     *
     * {@example core/ts/metadata/metadata.ts region='pipe'}
     */
    var Pipe = makeDecorator(PipeMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from InputMetadata.
    /**
     * Declares a data-bound input property.
     *
     * Angular automatically updates data-bound properties during change detection.
     *
     * `InputMetadata` takes an optional parameter that specifies the name
     * used when instantiating a component in the template. When not provided,
     * the name of the decorated property is used.
     *
     * ### Example
     *
     * The following example creates a component with two input properties.
     *
     * ```typescript
     * @Component({
     *   selector: 'bank-account',
     *   template: `
     *     Bank Name: {{bankName}}
     *     Account Id: {{id}}
     *   `
     * })
     * class BankAccount {
     *   @Input() bankName: string;
     *   @Input('account-id') id: string;
     *
     *   // this property is not bound, and won't be automatically updated by Angular
     *   normalizedBankName: string;
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `
     *     <bank-account bank-name="RBC" account-id="4747"></bank-account>
     *   `,
     *   directives: [BankAccount]
     * })
     * class App {}
     *
     * bootstrap(App);
     * ```
     */
    var Input = makePropDecorator(InputMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from OutputMetadata.
    /**
     * Declares an event-bound output property.
     *
     * When an output property emits an event, an event handler attached to that event
     * the template is invoked.
     *
     * `OutputMetadata` takes an optional parameter that specifies the name
     * used when instantiating a component in the template. When not provided,
     * the name of the decorated property is used.
     *
     * ### Example
     *
     * ```typescript
     * @Directive({
     *   selector: 'interval-dir',
     * })
     * class IntervalDir {
     *   @Output() everySecond = new EventEmitter();
     *   @Output('everyFiveSeconds') five5Secs = new EventEmitter();
     *
     *   constructor() {
     *     setInterval(() => this.everySecond.emit("event"), 1000);
     *     setInterval(() => this.five5Secs.emit("event"), 5000);
     *   }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `
     *     <interval-dir (everySecond)="everySecond()" (everyFiveSeconds)="everyFiveSeconds()">
     *     </interval-dir>
     *   `,
     *   directives: [IntervalDir]
     * })
     * class App {
     *   everySecond() { console.log('second'); }
     *   everyFiveSeconds() { console.log('five seconds'); }
     * }
     * bootstrap(App);
     * ```
     */
    var Output = makePropDecorator(OutputMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from HostBindingMetadata.
    /**
     * Declares a host property binding.
     *
     * Angular automatically checks host property bindings during change detection.
     * If a binding changes, it will update the host element of the directive.
     *
     * `HostBindingMetadata` takes an optional parameter that specifies the property
     * name of the host element that will be updated. When not provided,
     * the class property name is used.
     *
     * ### Example
     *
     * The following example creates a directive that sets the `valid` and `invalid` classes
     * on the DOM element that has ngModel directive on it.
     *
     * ```typescript
     * @Directive({selector: '[ngModel]'})
     * class NgModelStatus {
     *   constructor(public control:NgModel) {}
     *   @HostBinding('[class.valid]') get valid { return this.control.valid; }
     *   @HostBinding('[class.invalid]') get invalid { return this.control.invalid; }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `<input [(ngModel)]="prop">`,
     *   directives: [FORM_DIRECTIVES, NgModelStatus]
     * })
     * class App {
     *   prop;
     * }
     *
     * bootstrap(App);
     * ```
     */
    var HostBinding = makePropDecorator(HostBindingMetadata);
    // TODO(alexeagle): remove the duplication of this doc. It is copied from HostListenerMetadata.
    /**
     * Declares a host listener.
     *
     * Angular will invoke the decorated method when the host element emits the specified event.
     *
     * If the decorated method returns `false`, then `preventDefault` is applied on the DOM
     * event.
     *
     * ### Example
     *
     * The following example declares a directive that attaches a click listener to the button and
     * counts clicks.
     *
     * ```typescript
     * @Directive({selector: 'button[counting]'})
     * class CountClicks {
     *   numberOfClicks = 0;
     *
     *   @HostListener('click', ['$event.target'])
     *   onClick(btn) {
     *     console.log("button", btn, "number of clicks:", this.numberOfClicks++);
     *   }
     * }
     *
     * @Component({
     *   selector: 'app',
     *   template: `<button counting>Increment</button>`,
     *   directives: [CountClicks]
     * })
     * class App {}
     *
     * bootstrap(App);
     * ```
     */
    var HostListener = makePropDecorator(HostListenerMetadata);
    /**
     * Factory for creating {@link InjectMetadata}.
     */
    var Inject = makeParamDecorator(InjectMetadata);
    /**
     * Factory for creating {@link OptionalMetadata}.
     */
    var Optional = makeParamDecorator(OptionalMetadata);
    /**
     * Factory for creating {@link InjectableMetadata}.
     */
    var Injectable = makeDecorator(InjectableMetadata);
    /**
     * Factory for creating {@link SelfMetadata}.
     */
    var Self = makeParamDecorator(SelfMetadata);
    /**
     * Factory for creating {@link HostMetadata}.
     */
    var Host = makeParamDecorator(HostMetadata);
    /**
     * Factory for creating {@link SkipSelfMetadata}.
     */
    var SkipSelf = makeParamDecorator(SkipSelfMetadata);
    /**
     * A base class for the WrappedException that can be used to identify
     * a WrappedException from ExceptionHandler without adding circular
     * dependency.
     */
    var BaseWrappedException = (function (_super) {
        __extends(BaseWrappedException, _super);
        function BaseWrappedException(message) {
            _super.call(this, message);
        }
        Object.defineProperty(BaseWrappedException.prototype, "wrapperMessage", {
            get: function () { return ''; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseWrappedException.prototype, "wrapperStack", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseWrappedException.prototype, "originalException", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseWrappedException.prototype, "originalStack", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseWrappedException.prototype, "context", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseWrappedException.prototype, "message", {
            get: function () { return ''; },
            enumerable: true,
            configurable: true
        });
        return BaseWrappedException;
    }(Error));
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
    var MapWrapper = (function () {
        function MapWrapper() {
        }
        MapWrapper.clone = function (m) { return createMapFromMap(m); };
        MapWrapper.createFromStringMap = function (stringMap) {
            var result = new Map$1();
            for (var prop in stringMap) {
                result.set(prop, stringMap[prop]);
            }
            return result;
        };
        MapWrapper.toStringMap = function (m) {
            var r = {};
            m.forEach(function (v, k) { return r[k] = v; });
            return r;
        };
        MapWrapper.createFromPairs = function (pairs) { return createMapFromPairs(pairs); };
        MapWrapper.clearValues = function (m) { _clearValues(m); };
        MapWrapper.iterable = function (m) { return m; };
        MapWrapper.keys = function (m) { return _arrayFromMap(m, false); };
        MapWrapper.values = function (m) { return _arrayFromMap(m, true); };
        return MapWrapper;
    }());
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
    function isListLikeIterable(obj) {
        if (!isJsObject(obj))
            return false;
        return isArray(obj) ||
            (!(obj instanceof Map$1) &&
            getSymbolIterator() in obj); // JS Iterable have a Symbol.iterator prop
    }
    function areIterablesEqual(a, b, comparator) {
        var iterator1 = a[getSymbolIterator()]();
        var iterator2 = b[getSymbolIterator()]();
        while (true) {
            var item1 = iterator1.next();
            var item2 = iterator2.next();
            if (item1.done && item2.done)
                return true;
            if (item1.done || item2.done)
                return false;
            if (!comparator(item1.value, item2.value))
                return false;
        }
    }
    function iterateListLike(obj, fn) {
        if (isArray(obj)) {
            for (var i = 0; i < obj.length; i++) {
                fn(obj[i]);
            }
        }
        else {
            var iterator = obj[getSymbolIterator()]();
            var item;
            while (!((item = iterator.next()).done)) {
                fn(item.value);
            }
        }
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
    var SetWrapper = (function () {
        function SetWrapper() {
        }
        SetWrapper.createFromList = function (lst) { return createSetFromList(lst); };
        SetWrapper.has = function (s, key) { return s.has(key); };
        SetWrapper.delete = function (m, k) { m.delete(k); };
        return SetWrapper;
    }());
    var _ArrayLogger = (function () {
        function _ArrayLogger() {
            this.res = [];
        }
        _ArrayLogger.prototype.log = function (s) { this.res.push(s); };
        _ArrayLogger.prototype.logError = function (s) { this.res.push(s); };
        _ArrayLogger.prototype.logGroup = function (s) { this.res.push(s); };
        _ArrayLogger.prototype.logGroupEnd = function () { };
        ;
        return _ArrayLogger;
    }());
    /**
     * Provides a hook for centralized exception handling.
     *
     * The default implementation of `ExceptionHandler` prints error messages to the `Console`. To
     * intercept error handling,
     * write a custom exception handler that replaces this default as appropriate for your app.
     *
     * ### Example
     *
     * ```javascript
     *
     * class MyExceptionHandler implements ExceptionHandler {
     *   call(error, stackTrace = null, reason = null) {
     *     // do something with the exception
     *   }
     * }
     *
     * bootstrap(MyApp, [provide(ExceptionHandler, {useClass: MyExceptionHandler})])
     *
     * ```
     */
    var ExceptionHandler = (function () {
        function ExceptionHandler(_logger, _rethrowException) {
            if (_rethrowException === void 0) { _rethrowException = true; }
            this._logger = _logger;
            this._rethrowException = _rethrowException;
        }
        ExceptionHandler.exceptionToString = function (exception, stackTrace, reason) {
            if (stackTrace === void 0) { stackTrace = null; }
            if (reason === void 0) { reason = null; }
            var l = new _ArrayLogger();
            var e = new ExceptionHandler(l, false);
            e.call(exception, stackTrace, reason);
            return l.res.join("\n");
        };
        ExceptionHandler.prototype.call = function (exception, stackTrace, reason) {
            if (stackTrace === void 0) { stackTrace = null; }
            if (reason === void 0) { reason = null; }
            var originalException = this._findOriginalException(exception);
            var originalStack = this._findOriginalStack(exception);
            var context = this._findContext(exception);
            this._logger.logGroup("EXCEPTION: " + this._extractMessage(exception));
            if (isPresent(stackTrace) && isBlank(originalStack)) {
                this._logger.logError("STACKTRACE:");
                this._logger.logError(this._longStackTrace(stackTrace));
            }
            if (isPresent(reason)) {
                this._logger.logError("REASON: " + reason);
            }
            if (isPresent(originalException)) {
                this._logger.logError("ORIGINAL EXCEPTION: " + this._extractMessage(originalException));
            }
            if (isPresent(originalStack)) {
                this._logger.logError("ORIGINAL STACKTRACE:");
                this._logger.logError(this._longStackTrace(originalStack));
            }
            if (isPresent(context)) {
                this._logger.logError("ERROR CONTEXT:");
                this._logger.logError(context);
            }
            this._logger.logGroupEnd();
            // We rethrow exceptions, so operations like 'bootstrap' will result in an error
            // when an exception happens. If we do not rethrow, bootstrap will always succeed.
            if (this._rethrowException)
                throw exception;
        };
        /** @internal */
        ExceptionHandler.prototype._extractMessage = function (exception) {
            return exception instanceof BaseWrappedException ? exception.wrapperMessage :
                exception.toString();
        };
        /** @internal */
        ExceptionHandler.prototype._longStackTrace = function (stackTrace) {
            return isListLikeIterable(stackTrace) ? stackTrace.join("\n\n-----async gap-----\n") :
                stackTrace.toString();
        };
        /** @internal */
        ExceptionHandler.prototype._findContext = function (exception) {
            try {
                if (!(exception instanceof BaseWrappedException))
                    return null;
                return isPresent(exception.context) ? exception.context :
                    this._findContext(exception.originalException);
            }
            catch (e) {
                // exception.context can throw an exception. if it happens, we ignore the context.
                return null;
            }
        };
        /** @internal */
        ExceptionHandler.prototype._findOriginalException = function (exception) {
            if (!(exception instanceof BaseWrappedException))
                return null;
            var e = exception.originalException;
            while (e instanceof BaseWrappedException && isPresent(e.originalException)) {
                e = e.originalException;
            }
            return e;
        };
        /** @internal */
        ExceptionHandler.prototype._findOriginalStack = function (exception) {
            if (!(exception instanceof BaseWrappedException))
                return null;
            var e = exception;
            var stack = exception.originalStack;
            while (e instanceof BaseWrappedException && isPresent(e.originalException)) {
                e = e.originalException;
                if (e instanceof BaseWrappedException && isPresent(e.originalException)) {
                    stack = e.originalStack;
                }
            }
            return stack;
        };
        return ExceptionHandler;
    }());
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
    /**
     * Wraps an exception and provides additional context or information.
     */
    var WrappedException = (function (_super) {
        __extends(WrappedException, _super);
        function WrappedException(_wrapperMessage, _originalException, _originalStack, _context) {
            _super.call(this, _wrapperMessage);
            this._wrapperMessage = _wrapperMessage;
            this._originalException = _originalException;
            this._originalStack = _originalStack;
            this._context = _context;
            this._wrapperStack = (new Error(_wrapperMessage)).stack;
        }
        Object.defineProperty(WrappedException.prototype, "wrapperMessage", {
            get: function () { return this._wrapperMessage; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WrappedException.prototype, "wrapperStack", {
            get: function () { return this._wrapperStack; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WrappedException.prototype, "originalException", {
            get: function () { return this._originalException; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WrappedException.prototype, "originalStack", {
            get: function () { return this._originalStack; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WrappedException.prototype, "context", {
            get: function () { return this._context; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WrappedException.prototype, "message", {
            get: function () { return ExceptionHandler.exceptionToString(this); },
            enumerable: true,
            configurable: true
        });
        WrappedException.prototype.toString = function () { return this.message; };
        return WrappedException;
    }(BaseWrappedException));
    function unimplemented() {
        throw new BaseException('unimplemented');
    }
    var _THROW_IF_NOT_FOUND = new Object();
    var THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    var Injector = (function () {
        function Injector() {
        }
        /**
         * Retrieves an instance from the injector based on the provided token.
         * If not found:
         * - Throws {@link NoProviderError} if no `notFoundValue` that is not equal to
         * Injector.THROW_IF_NOT_FOUND is given
         * - Returns the `notFoundValue` otherwise
         *
         * ### Example ([live demo](http://plnkr.co/edit/HeXSHg?p=preview))
         *
         * ```typescript
         * var injector = ReflectiveInjector.resolveAndCreate([
         *   provide("validToken", {useValue: "Value"})
         * ]);
         * expect(injector.get("validToken")).toEqual("Value");
         * expect(() => injector.get("invalidToken")).toThrowError();
         * ```
         *
         * `Injector` returns itself when given `Injector` as a token.
         *
         * ```typescript
         * var injector = ReflectiveInjector.resolveAndCreate([]);
         * expect(injector.get(Injector)).toBe(injector);
         * ```
         */
        Injector.prototype.get = function (token, notFoundValue) { return unimplemented(); };
        return Injector;
    }());
    Injector.THROW_IF_NOT_FOUND = _THROW_IF_NOT_FOUND;
    /**
     * Provides read-only access to reflection data about symbols. Used internally by Angular
     * to power dependency injection and compilation.
     */
    var ReflectorReader = (function () {
        function ReflectorReader() {
        }
        return ReflectorReader;
    }());
    /**
     * Reflective information about a symbol, including annotations, interfaces, and other metadata.
     */
    var ReflectionInfo = (function () {
        function ReflectionInfo(annotations, parameters, factory, interfaces, propMetadata) {
            this.annotations = annotations;
            this.parameters = parameters;
            this.factory = factory;
            this.interfaces = interfaces;
            this.propMetadata = propMetadata;
        }
        return ReflectionInfo;
    }());
    /**
     * Provides access to reflection data about symbols. Used internally by Angular
     * to power dependency injection and compilation.
     */
    var Reflector = (function (_super) {
        __extends(Reflector, _super);
        function Reflector(reflectionCapabilities) {
            _super.call(this);
            /** @internal */
            this._injectableInfo = new Map$1();
            /** @internal */
            this._getters = new Map$1();
            /** @internal */
            this._setters = new Map$1();
            /** @internal */
            this._methods = new Map$1();
            this._usedKeys = null;
            this.reflectionCapabilities = reflectionCapabilities;
        }
        Reflector.prototype.isReflectionEnabled = function () { return this.reflectionCapabilities.isReflectionEnabled(); };
        /**
         * Causes `this` reflector to track keys used to access
         * {@link ReflectionInfo} objects.
         */
        Reflector.prototype.trackUsage = function () { this._usedKeys = new Set(); };
        /**
         * Lists types for which reflection information was not requested since
         * {@link #trackUsage} was called. This list could later be audited as
         * potential dead code.
         */
        Reflector.prototype.listUnusedKeys = function () {
            var _this = this;
            if (this._usedKeys == null) {
                throw new BaseException('Usage tracking is disabled');
            }
            var allTypes = MapWrapper.keys(this._injectableInfo);
            return allTypes.filter(function (key) { return !SetWrapper.has(_this._usedKeys, key); });
        };
        Reflector.prototype.registerFunction = function (func, funcInfo) {
            this._injectableInfo.set(func, funcInfo);
        };
        Reflector.prototype.registerType = function (type, typeInfo) {
            this._injectableInfo.set(type, typeInfo);
        };
        Reflector.prototype.registerGetters = function (getters) { _mergeMaps(this._getters, getters); };
        Reflector.prototype.registerSetters = function (setters) { _mergeMaps(this._setters, setters); };
        Reflector.prototype.registerMethods = function (methods) { _mergeMaps(this._methods, methods); };
        Reflector.prototype.factory = function (type) {
            if (this._containsReflectionInfo(type)) {
                var res = this._getReflectionInfo(type).factory;
                return isPresent(res) ? res : null;
            }
            else {
                return this.reflectionCapabilities.factory(type);
            }
        };
        Reflector.prototype.parameters = function (typeOrFunc) {
            if (this._injectableInfo.has(typeOrFunc)) {
                var res = this._getReflectionInfo(typeOrFunc).parameters;
                return isPresent(res) ? res : [];
            }
            else {
                return this.reflectionCapabilities.parameters(typeOrFunc);
            }
        };
        Reflector.prototype.annotations = function (typeOrFunc) {
            if (this._injectableInfo.has(typeOrFunc)) {
                var res = this._getReflectionInfo(typeOrFunc).annotations;
                return isPresent(res) ? res : [];
            }
            else {
                return this.reflectionCapabilities.annotations(typeOrFunc);
            }
        };
        Reflector.prototype.propMetadata = function (typeOrFunc) {
            if (this._injectableInfo.has(typeOrFunc)) {
                var res = this._getReflectionInfo(typeOrFunc).propMetadata;
                return isPresent(res) ? res : {};
            }
            else {
                return this.reflectionCapabilities.propMetadata(typeOrFunc);
            }
        };
        Reflector.prototype.interfaces = function (type) {
            if (this._injectableInfo.has(type)) {
                var res = this._getReflectionInfo(type).interfaces;
                return isPresent(res) ? res : [];
            }
            else {
                return this.reflectionCapabilities.interfaces(type);
            }
        };
        Reflector.prototype.getter = function (name) {
            if (this._getters.has(name)) {
                return this._getters.get(name);
            }
            else {
                return this.reflectionCapabilities.getter(name);
            }
        };
        Reflector.prototype.setter = function (name) {
            if (this._setters.has(name)) {
                return this._setters.get(name);
            }
            else {
                return this.reflectionCapabilities.setter(name);
            }
        };
        Reflector.prototype.method = function (name) {
            if (this._methods.has(name)) {
                return this._methods.get(name);
            }
            else {
                return this.reflectionCapabilities.method(name);
            }
        };
        /** @internal */
        Reflector.prototype._getReflectionInfo = function (typeOrFunc) {
            if (isPresent(this._usedKeys)) {
                this._usedKeys.add(typeOrFunc);
            }
            return this._injectableInfo.get(typeOrFunc);
        };
        /** @internal */
        Reflector.prototype._containsReflectionInfo = function (typeOrFunc) { return this._injectableInfo.has(typeOrFunc); };
        Reflector.prototype.importUri = function (type) { return this.reflectionCapabilities.importUri(type); };
        return Reflector;
    }(ReflectorReader));
    function _mergeMaps(target, config) {
        StringMapWrapper.forEach(config, function (v, k) { return target.set(k, v); });
    }
    var ReflectionCapabilities = (function () {
        function ReflectionCapabilities(reflect) {
            this._reflect = isPresent(reflect) ? reflect : global$1.Reflect;
        }
        ReflectionCapabilities.prototype.isReflectionEnabled = function () { return true; };
        ReflectionCapabilities.prototype.factory = function (t) {
            switch (t.length) {
                case 0:
                    return function () { return new t(); };
                case 1:
                    return function (a1) { return new t(a1); };
                case 2:
                    return function (a1, a2) { return new t(a1, a2); };
                case 3:
                    return function (a1, a2, a3) { return new t(a1, a2, a3); };
                case 4:
                    return function (a1, a2, a3, a4) { return new t(a1, a2, a3, a4); };
                case 5:
                    return function (a1, a2, a3, a4, a5) { return new t(a1, a2, a3, a4, a5); };
                case 6:
                    return function (a1, a2, a3, a4, a5, a6) { return new t(a1, a2, a3, a4, a5, a6); };
                case 7:
                    return function (a1, a2, a3, a4, a5, a6, a7) { return new t(a1, a2, a3, a4, a5, a6, a7); };
                case 8:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8) { return new t(a1, a2, a3, a4, a5, a6, a7, a8); };
                case 9:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9); };
                case 10:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10); };
                case 11:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11); };
                case 12:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12); };
                case 13:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13); };
                case 14:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14); };
                case 15:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15); };
                case 16:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16); };
                case 17:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17); };
                case 18:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18); };
                case 19:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19); };
                case 20:
                    return function (a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20) { return new t(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20); };
            }
            ;
            throw new Error("Cannot create a factory for '" + stringify(t) + "' because its constructor has more than 20 arguments");
        };
        /** @internal */
        ReflectionCapabilities.prototype._zipTypesAndAnnotations = function (paramTypes, paramAnnotations) {
            var result;
            if (typeof paramTypes === 'undefined') {
                result = new Array(paramAnnotations.length);
            }
            else {
                result = new Array(paramTypes.length);
            }
            for (var i = 0; i < result.length; i++) {
                // TS outputs Object for parameters without types, while Traceur omits
                // the annotations. For now we preserve the Traceur behavior to aid
                // migration, but this can be revisited.
                if (typeof paramTypes === 'undefined') {
                    result[i] = [];
                }
                else if (paramTypes[i] != Object) {
                    result[i] = [paramTypes[i]];
                }
                else {
                    result[i] = [];
                }
                if (isPresent(paramAnnotations) && isPresent(paramAnnotations[i])) {
                    result[i] = result[i].concat(paramAnnotations[i]);
                }
            }
            return result;
        };
        ReflectionCapabilities.prototype.parameters = function (typeOrFunc) {
            // Prefer the direct API.
            if (isPresent(typeOrFunc.parameters)) {
                return typeOrFunc.parameters;
            }
            // API of tsickle for lowering decorators to properties on the class.
            if (isPresent(typeOrFunc.ctorParameters)) {
                var ctorParameters = typeOrFunc.ctorParameters;
                var paramTypes_1 = ctorParameters.map(function (ctorParam) { return ctorParam && ctorParam.type; });
                var paramAnnotations_1 = ctorParameters.map(function (ctorParam) { return ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators); });
                return this._zipTypesAndAnnotations(paramTypes_1, paramAnnotations_1);
            }
            // API for metadata created by invoking the decorators.
            if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
                var paramAnnotations = this._reflect.getMetadata('parameters', typeOrFunc);
                var paramTypes = this._reflect.getMetadata('design:paramtypes', typeOrFunc);
                if (isPresent(paramTypes) || isPresent(paramAnnotations)) {
                    return this._zipTypesAndAnnotations(paramTypes, paramAnnotations);
                }
            }
            // The array has to be filled with `undefined` because holes would be skipped by `some`
            var parameters = new Array(typeOrFunc.length);
            parameters.fill(undefined);
            return parameters;
        };
        ReflectionCapabilities.prototype.annotations = function (typeOrFunc) {
            // Prefer the direct API.
            if (isPresent(typeOrFunc.annotations)) {
                var annotations = typeOrFunc.annotations;
                if (isFunction(annotations) && annotations.annotations) {
                    annotations = annotations.annotations;
                }
                return annotations;
            }
            // API of tsickle for lowering decorators to properties on the class.
            if (isPresent(typeOrFunc.decorators)) {
                return convertTsickleDecoratorIntoMetadata(typeOrFunc.decorators);
            }
            // API for metadata created by invoking the decorators.
            if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
                var annotations = this._reflect.getMetadata('annotations', typeOrFunc);
                if (isPresent(annotations))
                    return annotations;
            }
            return [];
        };
        ReflectionCapabilities.prototype.propMetadata = function (typeOrFunc) {
            // Prefer the direct API.
            if (isPresent(typeOrFunc.propMetadata)) {
                var propMetadata = typeOrFunc.propMetadata;
                if (isFunction(propMetadata) && propMetadata.propMetadata) {
                    propMetadata = propMetadata.propMetadata;
                }
                return propMetadata;
            }
            // API of tsickle for lowering decorators to properties on the class.
            if (isPresent(typeOrFunc.propDecorators)) {
                var propDecorators_1 = typeOrFunc.propDecorators;
                var propMetadata_1 = {};
                Object.keys(propDecorators_1)
                    .forEach(function (prop) {
                        propMetadata_1[prop] = convertTsickleDecoratorIntoMetadata(propDecorators_1[prop]);
                    });
                return propMetadata_1;
            }
            // API for metadata created by invoking the decorators.
            if (isPresent(this._reflect) && isPresent(this._reflect.getMetadata)) {
                var propMetadata = this._reflect.getMetadata('propMetadata', typeOrFunc);
                if (isPresent(propMetadata))
                    return propMetadata;
            }
            return {};
        };
        ReflectionCapabilities.prototype.interfaces = function (type) {
            throw new BaseException("JavaScript does not support interfaces");
        };
        ReflectionCapabilities.prototype.getter = function (name) { return new Function('o', 'return o.' + name + ';'); };
        ReflectionCapabilities.prototype.setter = function (name) {
            return new Function('o', 'v', 'return o.' + name + ' = v;');
        };
        ReflectionCapabilities.prototype.method = function (name) {
            var functionBody = "if (!o." + name + ") throw new Error('\"" + name + "\" is undefined');\n        return o." + name + ".apply(o, args);";
            return new Function('o', 'args', functionBody);
        };
        // There is not a concept of import uri in Js, but this is useful in developing Dart applications.
        ReflectionCapabilities.prototype.importUri = function (type) { return "./" + stringify(type); };
        return ReflectionCapabilities;
    }());
    function convertTsickleDecoratorIntoMetadata(decoratorInvocations) {
        if (!decoratorInvocations) {
            return [];
        }
        return decoratorInvocations.map(function (decoratorInvocation) {
            var decoratorType = decoratorInvocation.type;
            var annotationCls = decoratorType.annotationCls;
            var annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
            var annotation = Object.create(annotationCls.prototype);
            annotationCls.apply(annotation, annotationArgs);
            return annotation;
        });
    }
    /**
     * The {@link Reflector} used internally in Angular to access metadata
     * about symbols.
     */
    var reflector = new Reflector(new ReflectionCapabilities());
    /**
     * A unique object used for retrieving items from the {@link ReflectiveInjector}.
     *
     * Keys have:
     * - a system-wide unique `id`.
     * - a `token`.
     *
     * `Key` is used internally by {@link ReflectiveInjector} because its system-wide unique `id` allows
     * the
     * injector to store created objects in a more efficient way.
     *
     * `Key` should not be created directly. {@link ReflectiveInjector} creates keys automatically when
     * resolving
     * providers.
     */
    var ReflectiveKey = (function () {
        /**
         * Private
         */
        function ReflectiveKey(token, id) {
            this.token = token;
            this.id = id;
            if (isBlank(token)) {
                throw new BaseException('Token must be defined!');
            }
        }
        Object.defineProperty(ReflectiveKey.prototype, "displayName", {
            /**
             * Returns a stringified token.
             */
            get: function () { return stringify(this.token); },
            enumerable: true,
            configurable: true
        });
        /**
         * Retrieves a `Key` for a token.
         */
        ReflectiveKey.get = function (token) {
            return _globalKeyRegistry.get(resolveForwardRef(token));
        };
        Object.defineProperty(ReflectiveKey, "numberOfKeys", {
            /**
             * @returns the number of keys registered in the system.
             */
            get: function () { return _globalKeyRegistry.numberOfKeys; },
            enumerable: true,
            configurable: true
        });
        return ReflectiveKey;
    }());
    /**
     * @internal
     */
    var KeyRegistry = (function () {
        function KeyRegistry() {
            this._allKeys = new Map();
        }
        KeyRegistry.prototype.get = function (token) {
            if (token instanceof ReflectiveKey)
                return token;
            if (this._allKeys.has(token)) {
                return this._allKeys.get(token);
            }
            var newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
            this._allKeys.set(token, newKey);
            return newKey;
        };
        Object.defineProperty(KeyRegistry.prototype, "numberOfKeys", {
            get: function () { return this._allKeys.size; },
            enumerable: true,
            configurable: true
        });
        return KeyRegistry;
    }());
    var _globalKeyRegistry = new KeyRegistry();
    function findFirstClosedCycle(keys) {
        var res = [];
        for (var i = 0; i < keys.length; ++i) {
            if (ListWrapper.contains(res, keys[i])) {
                res.push(keys[i]);
                return res;
            }
            else {
                res.push(keys[i]);
            }
        }
        return res;
    }
    function constructResolvingPath(keys) {
        if (keys.length > 1) {
            var reversed = findFirstClosedCycle(ListWrapper.reversed(keys));
            var tokenStrs = reversed.map(function (k) { return stringify(k.token); });
            return " (" + tokenStrs.join(' -> ') + ")";
        }
        else {
            return "";
        }
    }
    /**
     * Base class for all errors arising from misconfigured providers.
     */
    var AbstractProviderError = (function (_super) {
        __extends(AbstractProviderError, _super);
        function AbstractProviderError(injector, key, constructResolvingMessage) {
            _super.call(this, "DI Exception");
            this.keys = [key];
            this.injectors = [injector];
            this.constructResolvingMessage = constructResolvingMessage;
            this.message = this.constructResolvingMessage(this.keys);
        }
        AbstractProviderError.prototype.addKey = function (injector, key) {
            this.injectors.push(injector);
            this.keys.push(key);
            this.message = this.constructResolvingMessage(this.keys);
        };
        Object.defineProperty(AbstractProviderError.prototype, "context", {
            get: function () { return this.injectors[this.injectors.length - 1].debugContext(); },
            enumerable: true,
            configurable: true
        });
        return AbstractProviderError;
    }(BaseException));
    /**
     * Thrown when trying to retrieve a dependency by `Key` from {@link Injector}, but the
     * {@link Injector} does not have a {@link Provider} for {@link Key}.
     *
     * ### Example ([live demo](http://plnkr.co/edit/vq8D3FRB9aGbnWJqtEPE?p=preview))
     *
     * ```typescript
     * class A {
     *   constructor(b:B) {}
     * }
     *
     * expect(() => Injector.resolveAndCreate([A])).toThrowError();
     * ```
     */
    var NoProviderError = (function (_super) {
        __extends(NoProviderError, _super);
        function NoProviderError(injector, key) {
            _super.call(this, injector, key, function (keys) {
                var first = stringify(ListWrapper.first(keys).token);
                return "No provider for " + first + "!" + constructResolvingPath(keys);
            });
        }
        return NoProviderError;
    }(AbstractProviderError));
    /**
     * Thrown when dependencies form a cycle.
     *
     * ### Example ([live demo](http://plnkr.co/edit/wYQdNos0Tzql3ei1EV9j?p=info))
     *
     * ```typescript
     * var injector = Injector.resolveAndCreate([
     *   provide("one", {useFactory: (two) => "two", deps: [[new Inject("two")]]}),
     *   provide("two", {useFactory: (one) => "one", deps: [[new Inject("one")]]})
     * ]);
     *
     * expect(() => injector.get("one")).toThrowError();
     * ```
     *
     * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
     */
    var CyclicDependencyError = (function (_super) {
        __extends(CyclicDependencyError, _super);
        function CyclicDependencyError(injector, key) {
            _super.call(this, injector, key, function (keys) {
                return "Cannot instantiate cyclic dependency!" + constructResolvingPath(keys);
            });
        }
        return CyclicDependencyError;
    }(AbstractProviderError));
    /**
     * Thrown when a constructing type returns with an Error.
     *
     * The `InstantiationError` class contains the original error plus the dependency graph which caused
     * this object to be instantiated.
     *
     * ### Example ([live demo](http://plnkr.co/edit/7aWYdcqTQsP0eNqEdUAf?p=preview))
     *
     * ```typescript
     * class A {
     *   constructor() {
     *     throw new Error('message');
     *   }
     * }
     *
     * var injector = Injector.resolveAndCreate([A]);

     * try {
     *   injector.get(A);
     * } catch (e) {
     *   expect(e instanceof InstantiationError).toBe(true);
     *   expect(e.originalException.message).toEqual("message");
     *   expect(e.originalStack).toBeDefined();
     * }
     * ```
     */
    var InstantiationError = (function (_super) {
        __extends(InstantiationError, _super);
        function InstantiationError(injector, originalException, originalStack, key) {
            _super.call(this, "DI Exception", originalException, originalStack, null);
            this.keys = [key];
            this.injectors = [injector];
        }
        InstantiationError.prototype.addKey = function (injector, key) {
            this.injectors.push(injector);
            this.keys.push(key);
        };
        Object.defineProperty(InstantiationError.prototype, "wrapperMessage", {
            get: function () {
                var first = stringify(ListWrapper.first(this.keys).token);
                return "Error during instantiation of " + first + "!" + constructResolvingPath(this.keys) + ".";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstantiationError.prototype, "causeKey", {
            get: function () { return this.keys[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InstantiationError.prototype, "context", {
            get: function () { return this.injectors[this.injectors.length - 1].debugContext(); },
            enumerable: true,
            configurable: true
        });
        return InstantiationError;
    }(WrappedException));
    /**
     * Thrown when an object other then {@link Provider} (or `Type`) is passed to {@link Injector}
     * creation.
     *
     * ### Example ([live demo](http://plnkr.co/edit/YatCFbPAMCL0JSSQ4mvH?p=preview))
     *
     * ```typescript
     * expect(() => Injector.resolveAndCreate(["not a type"])).toThrowError();
     * ```
     */
    var InvalidProviderError = (function (_super) {
        __extends(InvalidProviderError, _super);
        function InvalidProviderError(provider) {
            _super.call(this, "Invalid provider - only instances of Provider and Type are allowed, got: " +
                provider.toString());
        }
        return InvalidProviderError;
    }(BaseException));
    /**
     * Thrown when the class has no annotation information.
     *
     * Lack of annotation information prevents the {@link Injector} from determining which dependencies
     * need to be injected into the constructor.
     *
     * ### Example ([live demo](http://plnkr.co/edit/rHnZtlNS7vJOPQ6pcVkm?p=preview))
     *
     * ```typescript
     * class A {
     *   constructor(b) {}
     * }
     *
     * expect(() => Injector.resolveAndCreate([A])).toThrowError();
     * ```
     *
     * This error is also thrown when the class not marked with {@link Injectable} has parameter types.
     *
     * ```typescript
     * class B {}
     *
     * class A {
     *   constructor(b:B) {} // no information about the parameter types of A is available at runtime.
     * }
     *
     * expect(() => Injector.resolveAndCreate([A,B])).toThrowError();
     * ```
     */
    var NoAnnotationError = (function (_super) {
        __extends(NoAnnotationError, _super);
        function NoAnnotationError(typeOrFunc, params) {
            _super.call(this, NoAnnotationError._genMessage(typeOrFunc, params));
        }
        NoAnnotationError._genMessage = function (typeOrFunc, params) {
            var signature = [];
            for (var i = 0, ii = params.length; i < ii; i++) {
                var parameter = params[i];
                if (isBlank(parameter) || parameter.length == 0) {
                    signature.push('?');
                }
                else {
                    signature.push(parameter.map(stringify).join(' '));
                }
            }
            return "Cannot resolve all parameters for '" + stringify(typeOrFunc) + "'(" +
                signature.join(', ') + "). " +
                "Make sure that all the parameters are decorated with Inject or have valid type annotations and that '" +
                stringify(typeOrFunc) + "' is decorated with Injectable.";
        };
        return NoAnnotationError;
    }(BaseException));
    /**
     * Thrown when getting an object by index.
     *
     * ### Example ([live demo](http://plnkr.co/edit/bRs0SX2OTQiJzqvjgl8P?p=preview))
     *
     * ```typescript
     * class A {}
     *
     * var injector = Injector.resolveAndCreate([A]);
     *
     * expect(() => injector.getAt(100)).toThrowError();
     * ```
     */
    var OutOfBoundsError = (function (_super) {
        __extends(OutOfBoundsError, _super);
        function OutOfBoundsError(index) {
            _super.call(this, "Index " + index + " is out-of-bounds.");
        }
        return OutOfBoundsError;
    }(BaseException));
    // TODO: add a working example after alpha38 is released
    /**
     * Thrown when a multi provider and a regular provider are bound to the same token.
     *
     * ### Example
     *
     * ```typescript
     * expect(() => Injector.resolveAndCreate([
     *   new Provider("Strings", {useValue: "string1", multi: true}),
     *   new Provider("Strings", {useValue: "string2", multi: false})
     * ])).toThrowError();
     * ```
     */
    var MixingMultiProvidersWithRegularProvidersError = (function (_super) {
        __extends(MixingMultiProvidersWithRegularProvidersError, _super);
        function MixingMultiProvidersWithRegularProvidersError(provider1, provider2) {
            _super.call(this, "Cannot mix multi providers and regular providers, got: " + provider1.toString() + " " +
                provider2.toString());
        }
        return MixingMultiProvidersWithRegularProvidersError;
    }(BaseException));
    /**
     * Describes how the {@link Injector} should instantiate a given token.
     *
     * See {@link provide}.
     *
     * ### Example ([live demo](http://plnkr.co/edit/GNAyj6K6PfYg2NBzgwZ5?p%3Dpreview&p=preview))
     *
     * ```javascript
     * var injector = Injector.resolveAndCreate([
     *   new Provider("message", { useValue: 'Hello' })
     * ]);
     *
     * expect(injector.get("message")).toEqual('Hello');
     * ```
     * @ts2dart_const
     */
    var Provider = (function () {
        function Provider(token, _a) {
            var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
            this.token = token;
            this.useClass = useClass;
            this.useValue = useValue;
            this.useExisting = useExisting;
            this.useFactory = useFactory;
            this.dependencies = deps;
            this._multi = multi;
        }
        Object.defineProperty(Provider.prototype, "multi", {
            // TODO: Provide a full working example after alpha38 is released.
            /**
             * Creates multiple providers matching the same token (a multi-provider).
             *
             * Multi-providers are used for creating pluggable service, where the system comes
             * with some default providers, and the user can register additional providers.
             * The combination of the default providers and the additional providers will be
             * used to drive the behavior of the system.
             *
             * ### Example
             *
             * ```typescript
             * var injector = Injector.resolveAndCreate([
             *   new Provider("Strings", { useValue: "String1", multi: true}),
             *   new Provider("Strings", { useValue: "String2", multi: true})
             * ]);
             *
             * expect(injector.get("Strings")).toEqual(["String1", "String2"]);
             * ```
             *
             * Multi-providers and regular providers cannot be mixed. The following
             * will throw an exception:
             *
             * ```typescript
             * var injector = Injector.resolveAndCreate([
             *   new Provider("Strings", { useValue: "String1", multi: true }),
             *   new Provider("Strings", { useValue: "String2"})
             * ]);
             * ```
             */
            get: function () { return normalizeBool(this._multi); },
            enumerable: true,
            configurable: true
        });
        return Provider;
    }());
    /**
     * See {@link Provider} instead.
     *
     * @deprecated
     * @ts2dart_const
     */
    var Binding = (function (_super) {
        __extends(Binding, _super);
        function Binding(token, _a) {
            var toClass = _a.toClass, toValue = _a.toValue, toAlias = _a.toAlias, toFactory = _a.toFactory, deps = _a.deps, multi = _a.multi;
            _super.call(this, token, {
                useClass: toClass,
                useValue: toValue,
                useExisting: toAlias,
                useFactory: toFactory,
                deps: deps,
                multi: multi
            });
        }
        Object.defineProperty(Binding.prototype, "toClass", {
            /**
             * @deprecated
             */
            get: function () { return this.useClass; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "toAlias", {
            /**
             * @deprecated
             */
            get: function () { return this.useExisting; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "toFactory", {
            /**
             * @deprecated
             */
            get: function () { return this.useFactory; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "toValue", {
            /**
             * @deprecated
             */
            get: function () { return this.useValue; },
            enumerable: true,
            configurable: true
        });
        return Binding;
    }(Provider));
    /**
     * Creates a {@link Provider}.
     *
     * To construct a {@link Provider}, bind a `token` to either a class, a value, a factory function,
     * or
     * to an existing `token`.
     * See {@link ProviderBuilder} for more details.
     *
     * The `token` is most commonly a class or {@link OpaqueToken-class.html}.
     *
     * @deprecated
     */
    function bind(token) {
        return new ProviderBuilder(token);
    }
    /**
     * Helper class for the {@link bind} function.
     */
    var ProviderBuilder = (function () {
        function ProviderBuilder(token) {
            this.token = token;
        }
        /**
         * Binds a DI token to a class.
         *
         * ### Example ([live demo](http://plnkr.co/edit/ZpBCSYqv6e2ud5KXLdxQ?p=preview))
         *
         * Because `toAlias` and `toClass` are often confused, the example contains
         * both use cases for easy comparison.
         *
         * ```typescript
         * class Vehicle {}
         *
         * class Car extends Vehicle {}
         *
         * var injectorClass = Injector.resolveAndCreate([
         *   Car,
         *   provide(Vehicle, {useClass: Car})
         * ]);
         * var injectorAlias = Injector.resolveAndCreate([
         *   Car,
         *   provide(Vehicle, {useExisting: Car})
         * ]);
         *
         * expect(injectorClass.get(Vehicle)).not.toBe(injectorClass.get(Car));
         * expect(injectorClass.get(Vehicle) instanceof Car).toBe(true);
         *
         * expect(injectorAlias.get(Vehicle)).toBe(injectorAlias.get(Car));
         * expect(injectorAlias.get(Vehicle) instanceof Car).toBe(true);
         * ```
         */
        ProviderBuilder.prototype.toClass = function (type) {
            if (!isType(type)) {
                throw new BaseException("Trying to create a class provider but \"" + stringify(type) + "\" is not a class!");
            }
            return new Provider(this.token, { useClass: type });
        };
        /**
         * Binds a DI token to a value.
         *
         * ### Example ([live demo](http://plnkr.co/edit/G024PFHmDL0cJFgfZK8O?p=preview))
         *
         * ```typescript
         * var injector = Injector.resolveAndCreate([
         *   provide('message', {useValue: 'Hello'})
         * ]);
         *
         * expect(injector.get('message')).toEqual('Hello');
         * ```
         */
        ProviderBuilder.prototype.toValue = function (value) { return new Provider(this.token, { useValue: value }); };
        /**
         * Binds a DI token to an existing token.
         *
         * Angular will return the same instance as if the provided token was used. (This is
         * in contrast to `useClass` where a separate instance of `useClass` will be returned.)
         *
         * ### Example ([live demo](http://plnkr.co/edit/uBaoF2pN5cfc5AfZapNw?p=preview))
         *
         * Because `toAlias` and `toClass` are often confused, the example contains
         * both use cases for easy comparison.
         *
         * ```typescript
         * class Vehicle {}
         *
         * class Car extends Vehicle {}
         *
         * var injectorAlias = Injector.resolveAndCreate([
         *   Car,
         *   provide(Vehicle, {useExisting: Car})
         * ]);
         * var injectorClass = Injector.resolveAndCreate([
         *   Car,
         *   provide(Vehicle, {useClass: Car})
         * ]);
         *
         * expect(injectorAlias.get(Vehicle)).toBe(injectorAlias.get(Car));
         * expect(injectorAlias.get(Vehicle) instanceof Car).toBe(true);
         *
         * expect(injectorClass.get(Vehicle)).not.toBe(injectorClass.get(Car));
         * expect(injectorClass.get(Vehicle) instanceof Car).toBe(true);
         * ```
         */
        ProviderBuilder.prototype.toAlias = function (aliasToken) {
            if (isBlank(aliasToken)) {
                throw new BaseException("Can not alias " + stringify(this.token) + " to a blank value!");
            }
            return new Provider(this.token, { useExisting: aliasToken });
        };
        /**
         * Binds a DI token to a function which computes the value.
         *
         * ### Example ([live demo](http://plnkr.co/edit/OejNIfTT3zb1iBxaIYOb?p=preview))
         *
         * ```typescript
         * var injector = Injector.resolveAndCreate([
         *   provide(Number, {useFactory: () => { return 1+2; }}),
         *   provide(String, {useFactory: (v) => { return "Value: " + v; }, deps: [Number]})
         * ]);
         *
         * expect(injector.get(Number)).toEqual(3);
         * expect(injector.get(String)).toEqual('Value: 3');
         * ```
         */
        ProviderBuilder.prototype.toFactory = function (factory, dependencies) {
            if (!isFunction(factory)) {
                throw new BaseException("Trying to create a factory provider but \"" + stringify(factory) + "\" is not a function!");
            }
            return new Provider(this.token, { useFactory: factory, deps: dependencies });
        };
        return ProviderBuilder;
    }());
    /**
     * Creates a {@link Provider}.
     *
     * See {@link Provider} for more details.
     *
     * <!-- TODO: improve the docs -->
     */
    function provide(token, _a) {
        var useClass = _a.useClass, useValue = _a.useValue, useExisting = _a.useExisting, useFactory = _a.useFactory, deps = _a.deps, multi = _a.multi;
        return new Provider(token, {
            useClass: useClass,
            useValue: useValue,
            useExisting: useExisting,
            useFactory: useFactory,
            deps: deps,
            multi: multi
        });
    }
    function isProviderLiteral(obj) {
        return obj && typeof obj == 'object' && obj.provide;
    }
    function createProvider(obj) {
        return new Provider(obj.provide, obj);
    }
    /**
     * `Dependency` is used by the framework to extend DI.
     * This is internal to Angular and should not be used directly.
     */
    var ReflectiveDependency = (function () {
        function ReflectiveDependency(key, optional, lowerBoundVisibility, upperBoundVisibility, properties) {
            this.key = key;
            this.optional = optional;
            this.lowerBoundVisibility = lowerBoundVisibility;
            this.upperBoundVisibility = upperBoundVisibility;
            this.properties = properties;
        }
        ReflectiveDependency.fromKey = function (key) {
            return new ReflectiveDependency(key, false, null, null, []);
        };
        return ReflectiveDependency;
    }());
    var _EMPTY_LIST = [];
    var ResolvedReflectiveProvider_ = (function () {
        function ResolvedReflectiveProvider_(key, resolvedFactories, multiProvider) {
            this.key = key;
            this.resolvedFactories = resolvedFactories;
            this.multiProvider = multiProvider;
        }
        Object.defineProperty(ResolvedReflectiveProvider_.prototype, "resolvedFactory", {
            get: function () { return this.resolvedFactories[0]; },
            enumerable: true,
            configurable: true
        });
        return ResolvedReflectiveProvider_;
    }());
    /**
     * An internal resolved representation of a factory function created by resolving {@link Provider}.
     */
    var ResolvedReflectiveFactory = (function () {
        function ResolvedReflectiveFactory(
            /**
             * Factory function which can return an instance of an object represented by a key.
             */
            factory,
            /**
             * Arguments (dependencies) to the `factory` function.
             */
            dependencies) {
            this.factory = factory;
            this.dependencies = dependencies;
        }
        return ResolvedReflectiveFactory;
    }());
    /**
     * Resolve a single provider.
     */
    function resolveReflectiveFactory(provider) {
        var factoryFn;
        var resolvedDeps;
        if (isPresent(provider.useClass)) {
            var useClass = resolveForwardRef(provider.useClass);
            factoryFn = reflector.factory(useClass);
            resolvedDeps = _dependenciesFor(useClass);
        }
        else if (isPresent(provider.useExisting)) {
            factoryFn = function (aliasInstance) { return aliasInstance; };
            resolvedDeps = [ReflectiveDependency.fromKey(ReflectiveKey.get(provider.useExisting))];
        }
        else if (isPresent(provider.useFactory)) {
            factoryFn = provider.useFactory;
            resolvedDeps = constructDependencies(provider.useFactory, provider.dependencies);
        }
        else {
            factoryFn = function () { return provider.useValue; };
            resolvedDeps = _EMPTY_LIST;
        }
        return new ResolvedReflectiveFactory(factoryFn, resolvedDeps);
    }
    /**
     * Converts the {@link Provider} into {@link ResolvedProvider}.
     *
     * {@link Injector} internally only uses {@link ResolvedProvider}, {@link Provider} contains
     * convenience provider syntax.
     */
    function resolveReflectiveProvider(provider) {
        return new ResolvedReflectiveProvider_(ReflectiveKey.get(provider.token), [resolveReflectiveFactory(provider)], provider.multi);
    }
    /**
     * Resolve a list of Providers.
     */
    function resolveReflectiveProviders(providers) {
        var normalized = _normalizeProviders(providers, []);
        var resolved = normalized.map(resolveReflectiveProvider);
        return MapWrapper.values(mergeResolvedReflectiveProviders(resolved, new Map()));
    }
    /**
     * Merges a list of ResolvedProviders into a list where
     * each key is contained exactly once and multi providers
     * have been merged.
     */
    function mergeResolvedReflectiveProviders(providers, normalizedProvidersMap) {
        for (var i = 0; i < providers.length; i++) {
            var provider = providers[i];
            var existing = normalizedProvidersMap.get(provider.key.id);
            if (isPresent(existing)) {
                if (provider.multiProvider !== existing.multiProvider) {
                    throw new MixingMultiProvidersWithRegularProvidersError(existing, provider);
                }
                if (provider.multiProvider) {
                    for (var j = 0; j < provider.resolvedFactories.length; j++) {
                        existing.resolvedFactories.push(provider.resolvedFactories[j]);
                    }
                }
                else {
                    normalizedProvidersMap.set(provider.key.id, provider);
                }
            }
            else {
                var resolvedProvider;
                if (provider.multiProvider) {
                    resolvedProvider = new ResolvedReflectiveProvider_(provider.key, ListWrapper.clone(provider.resolvedFactories), provider.multiProvider);
                }
                else {
                    resolvedProvider = provider;
                }
                normalizedProvidersMap.set(provider.key.id, resolvedProvider);
            }
        }
        return normalizedProvidersMap;
    }
    function _normalizeProviders(providers, res) {
        providers.forEach(function (b) {
            if (b instanceof Type) {
                res.push(provide(b, { useClass: b }));
            }
            else if (b instanceof Provider) {
                res.push(b);
            }
            else if (isProviderLiteral(b)) {
                res.push(createProvider(b));
            }
            else if (b instanceof Array) {
                _normalizeProviders(b, res);
            }
            else if (b instanceof ProviderBuilder) {
                throw new InvalidProviderError(b.token);
            }
            else {
                throw new InvalidProviderError(b);
            }
        });
        return res;
    }
    function constructDependencies(typeOrFunc, dependencies) {
        if (isBlank(dependencies)) {
            return _dependenciesFor(typeOrFunc);
        }
        else {
            var params = dependencies.map(function (t) { return [t]; });
            return dependencies.map(function (t) { return _extractToken(typeOrFunc, t, params); });
        }
    }
    function _dependenciesFor(typeOrFunc) {
        var params = reflector.parameters(typeOrFunc);
        if (isBlank(params))
            return [];
        if (params.some(isBlank)) {
            throw new NoAnnotationError(typeOrFunc, params);
        }
        return params.map(function (p) { return _extractToken(typeOrFunc, p, params); });
    }
    function _extractToken(typeOrFunc, metadata /*any[] | any*/, params) {
        var depProps = [];
        var token = null;
        var optional = false;
        if (!isArray(metadata)) {
            if (metadata instanceof InjectMetadata) {
                return _createDependency(metadata.token, optional, null, null, depProps);
            }
            else {
                return _createDependency(metadata, optional, null, null, depProps);
            }
        }
        var lowerBoundVisibility = null;
        var upperBoundVisibility = null;
        for (var i = 0; i < metadata.length; ++i) {
            var paramMetadata = metadata[i];
            if (paramMetadata instanceof Type) {
                token = paramMetadata;
            }
            else if (paramMetadata instanceof InjectMetadata) {
                token = paramMetadata.token;
            }
            else if (paramMetadata instanceof OptionalMetadata) {
                optional = true;
            }
            else if (paramMetadata instanceof SelfMetadata) {
                upperBoundVisibility = paramMetadata;
            }
            else if (paramMetadata instanceof HostMetadata) {
                upperBoundVisibility = paramMetadata;
            }
            else if (paramMetadata instanceof SkipSelfMetadata) {
                lowerBoundVisibility = paramMetadata;
            }
            else if (paramMetadata instanceof DependencyMetadata) {
                if (isPresent(paramMetadata.token)) {
                    token = paramMetadata.token;
                }
                depProps.push(paramMetadata);
            }
        }
        token = resolveForwardRef(token);
        if (isPresent(token)) {
            return _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps);
        }
        else {
            throw new NoAnnotationError(typeOrFunc, params);
        }
    }
    function _createDependency(token, optional, lowerBoundVisibility, upperBoundVisibility, depProps) {
        return new ReflectiveDependency(ReflectiveKey.get(token), optional, lowerBoundVisibility, upperBoundVisibility, depProps);
    }
    // avoid unused import when Type union types are erased
    // Threshold for the dynamic version
    var _MAX_CONSTRUCTION_COUNTER = 10;
    var UNDEFINED = new Object();
    var ReflectiveProtoInjectorInlineStrategy = (function () {
        function ReflectiveProtoInjectorInlineStrategy(protoEI, providers) {
            this.provider0 = null;
            this.provider1 = null;
            this.provider2 = null;
            this.provider3 = null;
            this.provider4 = null;
            this.provider5 = null;
            this.provider6 = null;
            this.provider7 = null;
            this.provider8 = null;
            this.provider9 = null;
            this.keyId0 = null;
            this.keyId1 = null;
            this.keyId2 = null;
            this.keyId3 = null;
            this.keyId4 = null;
            this.keyId5 = null;
            this.keyId6 = null;
            this.keyId7 = null;
            this.keyId8 = null;
            this.keyId9 = null;
            var length = providers.length;
            if (length > 0) {
                this.provider0 = providers[0];
                this.keyId0 = providers[0].key.id;
            }
            if (length > 1) {
                this.provider1 = providers[1];
                this.keyId1 = providers[1].key.id;
            }
            if (length > 2) {
                this.provider2 = providers[2];
                this.keyId2 = providers[2].key.id;
            }
            if (length > 3) {
                this.provider3 = providers[3];
                this.keyId3 = providers[3].key.id;
            }
            if (length > 4) {
                this.provider4 = providers[4];
                this.keyId4 = providers[4].key.id;
            }
            if (length > 5) {
                this.provider5 = providers[5];
                this.keyId5 = providers[5].key.id;
            }
            if (length > 6) {
                this.provider6 = providers[6];
                this.keyId6 = providers[6].key.id;
            }
            if (length > 7) {
                this.provider7 = providers[7];
                this.keyId7 = providers[7].key.id;
            }
            if (length > 8) {
                this.provider8 = providers[8];
                this.keyId8 = providers[8].key.id;
            }
            if (length > 9) {
                this.provider9 = providers[9];
                this.keyId9 = providers[9].key.id;
            }
        }
        ReflectiveProtoInjectorInlineStrategy.prototype.getProviderAtIndex = function (index) {
            if (index == 0)
                return this.provider0;
            if (index == 1)
                return this.provider1;
            if (index == 2)
                return this.provider2;
            if (index == 3)
                return this.provider3;
            if (index == 4)
                return this.provider4;
            if (index == 5)
                return this.provider5;
            if (index == 6)
                return this.provider6;
            if (index == 7)
                return this.provider7;
            if (index == 8)
                return this.provider8;
            if (index == 9)
                return this.provider9;
            throw new OutOfBoundsError(index);
        };
        ReflectiveProtoInjectorInlineStrategy.prototype.createInjectorStrategy = function (injector) {
            return new ReflectiveInjectorInlineStrategy(injector, this);
        };
        return ReflectiveProtoInjectorInlineStrategy;
    }());
    var ReflectiveProtoInjectorDynamicStrategy = (function () {
        function ReflectiveProtoInjectorDynamicStrategy(protoInj, providers) {
            this.providers = providers;
            var len = providers.length;
            this.keyIds = ListWrapper.createFixedSize(len);
            for (var i = 0; i < len; i++) {
                this.keyIds[i] = providers[i].key.id;
            }
        }
        ReflectiveProtoInjectorDynamicStrategy.prototype.getProviderAtIndex = function (index) {
            if (index < 0 || index >= this.providers.length) {
                throw new OutOfBoundsError(index);
            }
            return this.providers[index];
        };
        ReflectiveProtoInjectorDynamicStrategy.prototype.createInjectorStrategy = function (ei) {
            return new ReflectiveInjectorDynamicStrategy(this, ei);
        };
        return ReflectiveProtoInjectorDynamicStrategy;
    }());
    var ReflectiveProtoInjector = (function () {
        function ReflectiveProtoInjector(providers) {
            this.numberOfProviders = providers.length;
            this._strategy = providers.length > _MAX_CONSTRUCTION_COUNTER ?
                new ReflectiveProtoInjectorDynamicStrategy(this, providers) :
                new ReflectiveProtoInjectorInlineStrategy(this, providers);
        }
        ReflectiveProtoInjector.fromResolvedProviders = function (providers) {
            return new ReflectiveProtoInjector(providers);
        };
        ReflectiveProtoInjector.prototype.getProviderAtIndex = function (index) {
            return this._strategy.getProviderAtIndex(index);
        };
        return ReflectiveProtoInjector;
    }());
    var ReflectiveInjectorInlineStrategy = (function () {
        function ReflectiveInjectorInlineStrategy(injector, protoStrategy) {
            this.injector = injector;
            this.protoStrategy = protoStrategy;
            this.obj0 = UNDEFINED;
            this.obj1 = UNDEFINED;
            this.obj2 = UNDEFINED;
            this.obj3 = UNDEFINED;
            this.obj4 = UNDEFINED;
            this.obj5 = UNDEFINED;
            this.obj6 = UNDEFINED;
            this.obj7 = UNDEFINED;
            this.obj8 = UNDEFINED;
            this.obj9 = UNDEFINED;
        }
        ReflectiveInjectorInlineStrategy.prototype.resetConstructionCounter = function () { this.injector._constructionCounter = 0; };
        ReflectiveInjectorInlineStrategy.prototype.instantiateProvider = function (provider) {
            return this.injector._new(provider);
        };
        ReflectiveInjectorInlineStrategy.prototype.getObjByKeyId = function (keyId) {
            var p = this.protoStrategy;
            var inj = this.injector;
            if (p.keyId0 === keyId) {
                if (this.obj0 === UNDEFINED) {
                    this.obj0 = inj._new(p.provider0);
                }
                return this.obj0;
            }
            if (p.keyId1 === keyId) {
                if (this.obj1 === UNDEFINED) {
                    this.obj1 = inj._new(p.provider1);
                }
                return this.obj1;
            }
            if (p.keyId2 === keyId) {
                if (this.obj2 === UNDEFINED) {
                    this.obj2 = inj._new(p.provider2);
                }
                return this.obj2;
            }
            if (p.keyId3 === keyId) {
                if (this.obj3 === UNDEFINED) {
                    this.obj3 = inj._new(p.provider3);
                }
                return this.obj3;
            }
            if (p.keyId4 === keyId) {
                if (this.obj4 === UNDEFINED) {
                    this.obj4 = inj._new(p.provider4);
                }
                return this.obj4;
            }
            if (p.keyId5 === keyId) {
                if (this.obj5 === UNDEFINED) {
                    this.obj5 = inj._new(p.provider5);
                }
                return this.obj5;
            }
            if (p.keyId6 === keyId) {
                if (this.obj6 === UNDEFINED) {
                    this.obj6 = inj._new(p.provider6);
                }
                return this.obj6;
            }
            if (p.keyId7 === keyId) {
                if (this.obj7 === UNDEFINED) {
                    this.obj7 = inj._new(p.provider7);
                }
                return this.obj7;
            }
            if (p.keyId8 === keyId) {
                if (this.obj8 === UNDEFINED) {
                    this.obj8 = inj._new(p.provider8);
                }
                return this.obj8;
            }
            if (p.keyId9 === keyId) {
                if (this.obj9 === UNDEFINED) {
                    this.obj9 = inj._new(p.provider9);
                }
                return this.obj9;
            }
            return UNDEFINED;
        };
        ReflectiveInjectorInlineStrategy.prototype.getObjAtIndex = function (index) {
            if (index == 0)
                return this.obj0;
            if (index == 1)
                return this.obj1;
            if (index == 2)
                return this.obj2;
            if (index == 3)
                return this.obj3;
            if (index == 4)
                return this.obj4;
            if (index == 5)
                return this.obj5;
            if (index == 6)
                return this.obj6;
            if (index == 7)
                return this.obj7;
            if (index == 8)
                return this.obj8;
            if (index == 9)
                return this.obj9;
            throw new OutOfBoundsError(index);
        };
        ReflectiveInjectorInlineStrategy.prototype.getMaxNumberOfObjects = function () { return _MAX_CONSTRUCTION_COUNTER; };
        return ReflectiveInjectorInlineStrategy;
    }());
    var ReflectiveInjectorDynamicStrategy = (function () {
        function ReflectiveInjectorDynamicStrategy(protoStrategy, injector) {
            this.protoStrategy = protoStrategy;
            this.injector = injector;
            this.objs = ListWrapper.createFixedSize(protoStrategy.providers.length);
            ListWrapper.fill(this.objs, UNDEFINED);
        }
        ReflectiveInjectorDynamicStrategy.prototype.resetConstructionCounter = function () { this.injector._constructionCounter = 0; };
        ReflectiveInjectorDynamicStrategy.prototype.instantiateProvider = function (provider) {
            return this.injector._new(provider);
        };
        ReflectiveInjectorDynamicStrategy.prototype.getObjByKeyId = function (keyId) {
            var p = this.protoStrategy;
            for (var i = 0; i < p.keyIds.length; i++) {
                if (p.keyIds[i] === keyId) {
                    if (this.objs[i] === UNDEFINED) {
                        this.objs[i] = this.injector._new(p.providers[i]);
                    }
                    return this.objs[i];
                }
            }
            return UNDEFINED;
        };
        ReflectiveInjectorDynamicStrategy.prototype.getObjAtIndex = function (index) {
            if (index < 0 || index >= this.objs.length) {
                throw new OutOfBoundsError(index);
            }
            return this.objs[index];
        };
        ReflectiveInjectorDynamicStrategy.prototype.getMaxNumberOfObjects = function () { return this.objs.length; };
        return ReflectiveInjectorDynamicStrategy;
    }());
    /**
     * A ReflectiveDependency injection container used for instantiating objects and resolving
     * dependencies.
     *
     * An `Injector` is a replacement for a `new` operator, which can automatically resolve the
     * constructor dependencies.
     *
     * In typical use, application code asks for the dependencies in the constructor and they are
     * resolved by the `Injector`.
     *
     * ### Example ([live demo](http://plnkr.co/edit/jzjec0?p=preview))
     *
     * The following example creates an `Injector` configured to create `Engine` and `Car`.
     *
     * ```typescript
     * @Injectable()
     * class Engine {
     * }
     *
     * @Injectable()
     * class Car {
     *   constructor(public engine:Engine) {}
     * }
     *
     * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
     * var car = injector.get(Car);
     * expect(car instanceof Car).toBe(true);
     * expect(car.engine instanceof Engine).toBe(true);
     * ```
     *
     * Notice, we don't use the `new` operator because we explicitly want to have the `Injector`
     * resolve all of the object's dependencies automatically.
     */
    var ReflectiveInjector = (function () {
        function ReflectiveInjector() {
        }
        /**
         * Turns an array of provider definitions into an array of resolved providers.
         *
         * A resolution is a process of flattening multiple nested arrays and converting individual
         * providers into an array of {@link ResolvedReflectiveProvider}s.
         *
         * ### Example ([live demo](http://plnkr.co/edit/AiXTHi?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, [[Engine]]]);
         *
         * expect(providers.length).toEqual(2);
         *
         * expect(providers[0] instanceof ResolvedReflectiveProvider).toBe(true);
         * expect(providers[0].key.displayName).toBe("Car");
         * expect(providers[0].dependencies.length).toEqual(1);
         * expect(providers[0].factory).toBeDefined();
         *
         * expect(providers[1].key.displayName).toBe("Engine");
         * });
         * ```
         *
         * See {@link ReflectiveInjector#fromResolvedProviders} for more info.
         */
        ReflectiveInjector.resolve = function (providers) {
            return resolveReflectiveProviders(providers);
        };
        /**
         * Resolves an array of providers and creates an injector from those providers.
         *
         * The passed-in providers can be an array of `Type`, {@link Provider},
         * or a recursive array of more providers.
         *
         * ### Example ([live demo](http://plnkr.co/edit/ePOccA?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var injector = ReflectiveInjector.resolveAndCreate([Car, Engine]);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         *
         * This function is slower than the corresponding `fromResolvedProviders`
         * because it needs to resolve the passed-in providers first.
         * See {@link Injector#resolve} and {@link Injector#fromResolvedProviders}.
         */
        ReflectiveInjector.resolveAndCreate = function (providers, parent) {
            if (parent === void 0) { parent = null; }
            var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
            return ReflectiveInjector.fromResolvedProviders(ResolvedReflectiveProviders, parent);
        };
        /**
         * Creates an injector from previously resolved providers.
         *
         * This API is the recommended way to construct injectors in performance-sensitive parts.
         *
         * ### Example ([live demo](http://plnkr.co/edit/KrSMci?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var providers = ReflectiveInjector.resolve([Car, Engine]);
         * var injector = ReflectiveInjector.fromResolvedProviders(providers);
         * expect(injector.get(Car) instanceof Car).toBe(true);
         * ```
         */
        ReflectiveInjector.fromResolvedProviders = function (providers, parent) {
            if (parent === void 0) { parent = null; }
            return new ReflectiveInjector_(ReflectiveProtoInjector.fromResolvedProviders(providers), parent);
        };
        /**
         * @deprecated
         */
        ReflectiveInjector.fromResolvedBindings = function (providers) {
            return ReflectiveInjector.fromResolvedProviders(providers);
        };
        Object.defineProperty(ReflectiveInjector.prototype, "parent", {
            /**
             * Parent of this injector.
             *
             * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
             * -->
             *
             * ### Example ([live demo](http://plnkr.co/edit/eosMGo?p=preview))
             *
             * ```typescript
             * var parent = ReflectiveInjector.resolveAndCreate([]);
             * var child = parent.resolveAndCreateChild([]);
             * expect(child.parent).toBe(parent);
             * ```
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        /**
         * @internal
         */
        ReflectiveInjector.prototype.debugContext = function () { return null; };
        /**
         * Resolves an array of providers and creates a child injector from those providers.
         *
         * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
         * -->
         *
         * The passed-in providers can be an array of `Type`, {@link Provider},
         * or a recursive array of more providers.
         *
         * ### Example ([live demo](http://plnkr.co/edit/opB3T4?p=preview))
         *
         * ```typescript
         * class ParentProvider {}
         * class ChildProvider {}
         *
         * var parent = ReflectiveInjector.resolveAndCreate([ParentProvider]);
         * var child = parent.resolveAndCreateChild([ChildProvider]);
         *
         * expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
         * expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
         * expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
         * ```
         *
         * This function is slower than the corresponding `createChildFromResolved`
         * because it needs to resolve the passed-in providers first.
         * See {@link Injector#resolve} and {@link Injector#createChildFromResolved}.
         */
        ReflectiveInjector.prototype.resolveAndCreateChild = function (providers) {
            return unimplemented();
        };
        /**
         * Creates a child injector from previously resolved providers.
         *
         * <!-- TODO: Add a link to the section of the user guide talking about hierarchical injection.
         * -->
         *
         * This API is the recommended way to construct injectors in performance-sensitive parts.
         *
         * ### Example ([live demo](http://plnkr.co/edit/VhyfjN?p=preview))
         *
         * ```typescript
         * class ParentProvider {}
         * class ChildProvider {}
         *
         * var parentProviders = ReflectiveInjector.resolve([ParentProvider]);
         * var childProviders = ReflectiveInjector.resolve([ChildProvider]);
         *
         * var parent = ReflectiveInjector.fromResolvedProviders(parentProviders);
         * var child = parent.createChildFromResolved(childProviders);
         *
         * expect(child.get(ParentProvider) instanceof ParentProvider).toBe(true);
         * expect(child.get(ChildProvider) instanceof ChildProvider).toBe(true);
         * expect(child.get(ParentProvider)).toBe(parent.get(ParentProvider));
         * ```
         */
        ReflectiveInjector.prototype.createChildFromResolved = function (providers) {
            return unimplemented();
        };
        /**
         * Resolves a provider and instantiates an object in the context of the injector.
         *
         * The created object does not get cached by the injector.
         *
         * ### Example ([live demo](http://plnkr.co/edit/yvVXoB?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var injector = ReflectiveInjector.resolveAndCreate([Engine]);
         *
         * var car = injector.resolveAndInstantiate(Car);
         * expect(car.engine).toBe(injector.get(Engine));
         * expect(car).not.toBe(injector.resolveAndInstantiate(Car));
         * ```
         */
        ReflectiveInjector.prototype.resolveAndInstantiate = function (provider) { return unimplemented(); };
        /**
         * Instantiates an object using a resolved provider in the context of the injector.
         *
         * The created object does not get cached by the injector.
         *
         * ### Example ([live demo](http://plnkr.co/edit/ptCImQ?p=preview))
         *
         * ```typescript
         * @Injectable()
         * class Engine {
         * }
         *
         * @Injectable()
         * class Car {
         *   constructor(public engine:Engine) {}
         * }
         *
         * var injector = ReflectiveInjector.resolveAndCreate([Engine]);
         * var carProvider = ReflectiveInjector.resolve([Car])[0];
         * var car = injector.instantiateResolved(carProvider);
         * expect(car.engine).toBe(injector.get(Engine));
         * expect(car).not.toBe(injector.instantiateResolved(carProvider));
         * ```
         */
        ReflectiveInjector.prototype.instantiateResolved = function (provider) { return unimplemented(); };
        return ReflectiveInjector;
    }());
    var ReflectiveInjector_ = (function () {
        /**
         * Private
         */
        function ReflectiveInjector_(_proto /* ProtoInjector */, _parent, _debugContext) {
            if (_parent === void 0) { _parent = null; }
            if (_debugContext === void 0) { _debugContext = null; }
            this._debugContext = _debugContext;
            /** @internal */
            this._constructionCounter = 0;
            this._proto = _proto;
            this._parent = _parent;
            this._strategy = _proto._strategy.createInjectorStrategy(this);
        }
        /**
         * @internal
         */
        ReflectiveInjector_.prototype.debugContext = function () { return this._debugContext(); };
        ReflectiveInjector_.prototype.get = function (token, notFoundValue) {
            if (notFoundValue === void 0) { notFoundValue = THROW_IF_NOT_FOUND; }
            return this._getByKey(ReflectiveKey.get(token), null, null, notFoundValue);
        };
        ReflectiveInjector_.prototype.getAt = function (index) { return this._strategy.getObjAtIndex(index); };
        Object.defineProperty(ReflectiveInjector_.prototype, "parent", {
            get: function () { return this._parent; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ReflectiveInjector_.prototype, "internalStrategy", {
            /**
             * @internal
             * Internal. Do not use.
             * We return `any` not to export the InjectorStrategy type.
             */
            get: function () { return this._strategy; },
            enumerable: true,
            configurable: true
        });
        ReflectiveInjector_.prototype.resolveAndCreateChild = function (providers) {
            var ResolvedReflectiveProviders = ReflectiveInjector.resolve(providers);
            return this.createChildFromResolved(ResolvedReflectiveProviders);
        };
        ReflectiveInjector_.prototype.createChildFromResolved = function (providers) {
            var proto = new ReflectiveProtoInjector(providers);
            var inj = new ReflectiveInjector_(proto);
            inj._parent = this;
            return inj;
        };
        ReflectiveInjector_.prototype.resolveAndInstantiate = function (provider) {
            return this.instantiateResolved(ReflectiveInjector.resolve([provider])[0]);
        };
        ReflectiveInjector_.prototype.instantiateResolved = function (provider) {
            return this._instantiateProvider(provider);
        };
        /** @internal */
        ReflectiveInjector_.prototype._new = function (provider) {
            if (this._constructionCounter++ > this._strategy.getMaxNumberOfObjects()) {
                throw new CyclicDependencyError(this, provider.key);
            }
            return this._instantiateProvider(provider);
        };
        ReflectiveInjector_.prototype._instantiateProvider = function (provider) {
            if (provider.multiProvider) {
                var res = ListWrapper.createFixedSize(provider.resolvedFactories.length);
                for (var i = 0; i < provider.resolvedFactories.length; ++i) {
                    res[i] = this._instantiate(provider, provider.resolvedFactories[i]);
                }
                return res;
            }
            else {
                return this._instantiate(provider, provider.resolvedFactories[0]);
            }
        };
        ReflectiveInjector_.prototype._instantiate = function (provider, ResolvedReflectiveFactory) {
            var factory = ResolvedReflectiveFactory.factory;
            var deps = ResolvedReflectiveFactory.dependencies;
            var length = deps.length;
            var d0;
            var d1;
            var d2;
            var d3;
            var d4;
            var d5;
            var d6;
            var d7;
            var d8;
            var d9;
            var d10;
            var d11;
            var d12;
            var d13;
            var d14;
            var d15;
            var d16;
            var d17;
            var d18;
            var d19;
            try {
                d0 = length > 0 ? this._getByReflectiveDependency(provider, deps[0]) : null;
                d1 = length > 1 ? this._getByReflectiveDependency(provider, deps[1]) : null;
                d2 = length > 2 ? this._getByReflectiveDependency(provider, deps[2]) : null;
                d3 = length > 3 ? this._getByReflectiveDependency(provider, deps[3]) : null;
                d4 = length > 4 ? this._getByReflectiveDependency(provider, deps[4]) : null;
                d5 = length > 5 ? this._getByReflectiveDependency(provider, deps[5]) : null;
                d6 = length > 6 ? this._getByReflectiveDependency(provider, deps[6]) : null;
                d7 = length > 7 ? this._getByReflectiveDependency(provider, deps[7]) : null;
                d8 = length > 8 ? this._getByReflectiveDependency(provider, deps[8]) : null;
                d9 = length > 9 ? this._getByReflectiveDependency(provider, deps[9]) : null;
                d10 = length > 10 ? this._getByReflectiveDependency(provider, deps[10]) : null;
                d11 = length > 11 ? this._getByReflectiveDependency(provider, deps[11]) : null;
                d12 = length > 12 ? this._getByReflectiveDependency(provider, deps[12]) : null;
                d13 = length > 13 ? this._getByReflectiveDependency(provider, deps[13]) : null;
                d14 = length > 14 ? this._getByReflectiveDependency(provider, deps[14]) : null;
                d15 = length > 15 ? this._getByReflectiveDependency(provider, deps[15]) : null;
                d16 = length > 16 ? this._getByReflectiveDependency(provider, deps[16]) : null;
                d17 = length > 17 ? this._getByReflectiveDependency(provider, deps[17]) : null;
                d18 = length > 18 ? this._getByReflectiveDependency(provider, deps[18]) : null;
                d19 = length > 19 ? this._getByReflectiveDependency(provider, deps[19]) : null;
            }
            catch (e) {
                if (e instanceof AbstractProviderError || e instanceof InstantiationError) {
                    e.addKey(this, provider.key);
                }
                throw e;
            }
            var obj;
            try {
                switch (length) {
                    case 0:
                        obj = factory();
                        break;
                    case 1:
                        obj = factory(d0);
                        break;
                    case 2:
                        obj = factory(d0, d1);
                        break;
                    case 3:
                        obj = factory(d0, d1, d2);
                        break;
                    case 4:
                        obj = factory(d0, d1, d2, d3);
                        break;
                    case 5:
                        obj = factory(d0, d1, d2, d3, d4);
                        break;
                    case 6:
                        obj = factory(d0, d1, d2, d3, d4, d5);
                        break;
                    case 7:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6);
                        break;
                    case 8:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7);
                        break;
                    case 9:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8);
                        break;
                    case 10:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9);
                        break;
                    case 11:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10);
                        break;
                    case 12:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11);
                        break;
                    case 13:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12);
                        break;
                    case 14:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13);
                        break;
                    case 15:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14);
                        break;
                    case 16:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15);
                        break;
                    case 17:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16);
                        break;
                    case 18:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17);
                        break;
                    case 19:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18);
                        break;
                    case 20:
                        obj = factory(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19);
                        break;
                    default:
                        throw new BaseException("Cannot instantiate '" + provider.key.displayName + "' because it has more than 20 dependencies");
                }
            }
            catch (e) {
                throw new InstantiationError(this, e, e.stack, provider.key);
            }
            return obj;
        };
        ReflectiveInjector_.prototype._getByReflectiveDependency = function (provider, dep) {
            return this._getByKey(dep.key, dep.lowerBoundVisibility, dep.upperBoundVisibility, dep.optional ? null : THROW_IF_NOT_FOUND);
        };
        ReflectiveInjector_.prototype._getByKey = function (key, lowerBoundVisibility, upperBoundVisibility, notFoundValue) {
            if (key === INJECTOR_KEY) {
                return this;
            }
            if (upperBoundVisibility instanceof SelfMetadata) {
                return this._getByKeySelf(key, notFoundValue);
            }
            else {
                return this._getByKeyDefault(key, notFoundValue, lowerBoundVisibility);
            }
        };
        /** @internal */
        ReflectiveInjector_.prototype._throwOrNull = function (key, notFoundValue) {
            if (notFoundValue !== THROW_IF_NOT_FOUND) {
                return notFoundValue;
            }
            else {
                throw new NoProviderError(this, key);
            }
        };
        /** @internal */
        ReflectiveInjector_.prototype._getByKeySelf = function (key, notFoundValue) {
            var obj = this._strategy.getObjByKeyId(key.id);
            return (obj !== UNDEFINED) ? obj : this._throwOrNull(key, notFoundValue);
        };
        /** @internal */
        ReflectiveInjector_.prototype._getByKeyDefault = function (key, notFoundValue, lowerBoundVisibility) {
            var inj;
            if (lowerBoundVisibility instanceof SkipSelfMetadata) {
                inj = this._parent;
            }
            else {
                inj = this;
            }
            while (inj instanceof ReflectiveInjector_) {
                var inj_ = inj;
                var obj = inj_._strategy.getObjByKeyId(key.id);
                if (obj !== UNDEFINED)
                    return obj;
                inj = inj_._parent;
            }
            if (inj !== null) {
                return inj.get(key.token, notFoundValue);
            }
            else {
                return this._throwOrNull(key, notFoundValue);
            }
        };
        Object.defineProperty(ReflectiveInjector_.prototype, "displayName", {
            get: function () {
                return "ReflectiveInjector(providers: [" + _mapProviders(this, function (b) { return (" \"" + b.key.displayName + "\" "); }).join(", ") + "])";
            },
            enumerable: true,
            configurable: true
        });
        ReflectiveInjector_.prototype.toString = function () { return this.displayName; };
        return ReflectiveInjector_;
    }());
    var INJECTOR_KEY = ReflectiveKey.get(Injector);
    function _mapProviders(injector, fn) {
        var res = [];
        for (var i = 0; i < injector._proto.numberOfProviders; ++i) {
            res.push(fn(injector._proto.getProviderAtIndex(i)));
        }
        return res;
    }
    /**
     * Creates a token that can be used in a DI Provider.
     *
     * ### Example ([live demo](http://plnkr.co/edit/Ys9ezXpj2Mnoy3Uc8KBp?p=preview))
     *
     * ```typescript
     * var t = new OpaqueToken("value");
     *
     * var injector = Injector.resolveAndCreate([
     *   provide(t, {useValue: "bindingValue"})
     * ]);
     *
     * expect(injector.get(t)).toEqual("bindingValue");
     * ```
     *
     * Using an `OpaqueToken` is preferable to using strings as tokens because of possible collisions
     * caused by multiple providers using the same string as two different tokens.
     *
     * Using an `OpaqueToken` is preferable to using an `Object` as tokens because it provides better
     * error messages.
     * @ts2dart_const
     */
    var OpaqueToken = (function () {
        function OpaqueToken(_desc) {
            this._desc = _desc;
        }
        OpaqueToken.prototype.toString = function () { return "Token " + this._desc; };
        return OpaqueToken;
    }());
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
     * Use by directives and components to emit custom Events.
     *
     * ### Examples
     *
     * In the following example, `Zippy` alternatively emits `open` and `close` events when its
     * title gets clicked:
     *
     * ```
     * @Component({
     *   selector: 'zippy',
     *   template: `
     *   <div class="zippy">
     *     <div (click)="toggle()">Toggle</div>
     *     <div [hidden]="!visible">
     *       <ng-content></ng-content>
     *     </div>
     *  </div>`})
     * export class Zippy {
     *   visible: boolean = true;
     *   @Output() open: EventEmitter<any> = new EventEmitter();
     *   @Output() close: EventEmitter<any> = new EventEmitter();
     *
     *   toggle() {
     *     this.visible = !this.visible;
     *     if (this.visible) {
     *       this.open.emit(null);
     *     } else {
     *       this.close.emit(null);
     *     }
     *   }
     * }
     * ```
     *
     * Use Rx.Observable but provides an adapter to make it work as specified here:
     * https://github.com/jhusain/observable-spec
     *
     * Once a reference implementation of the spec is available, switch to it.
     */
    var EventEmitter = (function (_super) {
        __extends(EventEmitter, _super);
        /**
         * Creates an instance of [EventEmitter], which depending on [isAsync],
         * delivers events synchronously or asynchronously.
         */
        function EventEmitter(isAsync) {
            if (isAsync === void 0) { isAsync = true; }
            _super.call(this);
            this._isAsync = isAsync;
        }
        EventEmitter.prototype.emit = function (value) { _super.prototype.next.call(this, value); };
        /**
         * @deprecated - use .emit(value) instead
         */
        EventEmitter.prototype.next = function (value) { _super.prototype.next.call(this, value); };
        EventEmitter.prototype.subscribe = function (generatorOrNext, error, complete) {
            var schedulerFn;
            var errorFn = function (err) { return null; };
            var completeFn = function () { return null; };
            if (generatorOrNext && typeof generatorOrNext === 'object') {
                schedulerFn = this._isAsync ? function (value) { setTimeout(function () { return generatorOrNext.next(value); }); } :
                    function (value) { generatorOrNext.next(value); };
                if (generatorOrNext.error) {
                    errorFn = this._isAsync ? function (err) { setTimeout(function () { return generatorOrNext.error(err); }); } :
                        function (err) { generatorOrNext.error(err); };
                }
                if (generatorOrNext.complete) {
                    completeFn = this._isAsync ? function () { setTimeout(function () { return generatorOrNext.complete(); }); } :
                        function () { generatorOrNext.complete(); };
                }
            }
            else {
                schedulerFn = this._isAsync ? function (value) { setTimeout(function () { return generatorOrNext(value); }); } :
                    function (value) { generatorOrNext(value); };
                if (error) {
                    errorFn =
                        this._isAsync ? function (err) { setTimeout(function () { return error(err); }); } : function (err) { error(err); };
                }
                if (complete) {
                    completeFn =
                        this._isAsync ? function () { setTimeout(function () { return complete(); }); } : function () { complete(); };
                }
            }
            return _super.prototype.subscribe.call(this, schedulerFn, errorFn, completeFn);
        };
        return EventEmitter;
    }(rxjs_Subject.Subject));
    /**
     * Stores error information; delivered via [NgZone.onError] stream.
     */
    var NgZoneError = (function () {
        function NgZoneError(error, stackTrace) {
            this.error = error;
            this.stackTrace = stackTrace;
        }
        return NgZoneError;
    }());
    var NgZoneImpl = (function () {
        function NgZoneImpl(_a) {
            var _this = this;
            var trace = _a.trace, onEnter = _a.onEnter, onLeave = _a.onLeave, setMicrotask = _a.setMicrotask, setMacrotask = _a.setMacrotask, onError = _a.onError;
            this.onEnter = onEnter;
            this.onLeave = onLeave;
            this.setMicrotask = setMicrotask;
            this.setMacrotask = setMacrotask;
            this.onError = onError;
            if (Zone) {
                this.outer = this.inner = Zone.current;
                if (Zone['wtfZoneSpec']) {
                    this.inner = this.inner.fork(Zone['wtfZoneSpec']);
                }
                if (trace && Zone['longStackTraceZoneSpec']) {
                    this.inner = this.inner.fork(Zone['longStackTraceZoneSpec']);
                }
                this.inner = this.inner.fork({
                    name: 'angular',
                    properties: { 'isAngularZone': true },
                    onInvokeTask: function (delegate, current, target, task, applyThis, applyArgs) {
                        try {
                            _this.onEnter();
                            return delegate.invokeTask(target, task, applyThis, applyArgs);
                        }
                        finally {
                            _this.onLeave();
                        }
                    },
                    onInvoke: function (delegate, current, target, callback, applyThis, applyArgs, source) {
                        try {
                            _this.onEnter();
                            return delegate.invoke(target, callback, applyThis, applyArgs, source);
                        }
                        finally {
                            _this.onLeave();
                        }
                    },
                    onHasTask: function (delegate, current, target, hasTaskState) {
                        delegate.hasTask(target, hasTaskState);
                        if (current == target) {
                            // We are only interested in hasTask events which originate from our zone
                            // (A child hasTask event is not interesting to us)
                            if (hasTaskState.change == 'microTask') {
                                _this.setMicrotask(hasTaskState.microTask);
                            }
                            else if (hasTaskState.change == 'macroTask') {
                                _this.setMacrotask(hasTaskState.macroTask);
                            }
                        }
                    },
                    onHandleError: function (delegate, current, target, error) {
                        delegate.handleError(target, error);
                        _this.onError(new NgZoneError(error, error.stack));
                        return false;
                    }
                });
            }
            else {
                throw new Error('Angular requires Zone.js polyfill.');
            }
        }
        NgZoneImpl.isInAngularZone = function () { return Zone.current.get('isAngularZone') === true; };
        NgZoneImpl.prototype.runInner = function (fn) { return this.inner.run(fn); };
        ;
        NgZoneImpl.prototype.runInnerGuarded = function (fn) { return this.inner.runGuarded(fn); };
        ;
        NgZoneImpl.prototype.runOuter = function (fn) { return this.outer.run(fn); };
        ;
        return NgZoneImpl;
    }());
    /**
     * An injectable service for executing work inside or outside of the Angular zone.
     *
     * The most common use of this service is to optimize performance when starting a work consisting of
     * one or more asynchronous tasks that don't require UI updates or error handling to be handled by
     * Angular. Such tasks can be kicked off via {@link #runOutsideAngular} and if needed, these tasks
     * can reenter the Angular zone via {@link #run}.
     *
     * <!-- TODO: add/fix links to:
     *   - docs explaining zones and the use of zones in Angular and change-detection
     *   - link to runOutsideAngular/run (throughout this file!)
     *   -->
     *
     * ### Example ([live demo](http://plnkr.co/edit/lY9m8HLy7z06vDoUaSN2?p=preview))
     * ```
     * import {Component, View, NgZone} from '@angular/core';
     * import {NgIf} from '@angular/common';
     *
     * @Component({
     *   selector: 'ng-zone-demo'.
     *   template: `
     *     <h2>Demo: NgZone</h2>
     *
     *     <p>Progress: {{progress}}%</p>
     *     <p *ngIf="progress >= 100">Done processing {{label}} of Angular zone!</p>
     *
     *     <button (click)="processWithinAngularZone()">Process within Angular zone</button>
     *     <button (click)="processOutsideOfAngularZone()">Process outside of Angular zone</button>
     *   `,
     *   directives: [NgIf]
     * })
     * export class NgZoneDemo {
     *   progress: number = 0;
     *   label: string;
     *
     *   constructor(private _ngZone: NgZone) {}
     *
     *   // Loop inside the Angular zone
     *   // so the UI DOES refresh after each setTimeout cycle
     *   processWithinAngularZone() {
     *     this.label = 'inside';
     *     this.progress = 0;
     *     this._increaseProgress(() => console.log('Inside Done!'));
     *   }
     *
     *   // Loop outside of the Angular zone
     *   // so the UI DOES NOT refresh after each setTimeout cycle
     *   processOutsideOfAngularZone() {
     *     this.label = 'outside';
     *     this.progress = 0;
     *     this._ngZone.runOutsideAngular(() => {
     *       this._increaseProgress(() => {
     *       // reenter the Angular zone and display done
     *       this._ngZone.run(() => {console.log('Outside Done!') });
     *     }}));
     *   }
     *
     *
     *   _increaseProgress(doneCallback: () => void) {
     *     this.progress += 1;
     *     console.log(`Current progress: ${this.progress}%`);
     *
     *     if (this.progress < 100) {
     *       window.setTimeout(() => this._increaseProgress(doneCallback)), 10)
     *     } else {
     *       doneCallback();
     *     }
     *   }
     * }
     * ```
     */
    var NgZone = (function () {
        /**
         * @param {bool} enableLongStackTrace whether to enable long stack trace. They should only be
         *               enabled in development mode as they significantly impact perf.
         */
        function NgZone(_a) {
            var _this = this;
            var _b = _a.enableLongStackTrace, enableLongStackTrace = _b === void 0 ? false : _b;
            this._hasPendingMicrotasks = false;
            this._hasPendingMacrotasks = false;
            /** @internal */
            this._isStable = true;
            /** @internal */
            this._nesting = 0;
            /** @internal */
            this._onUnstable = new EventEmitter(false);
            /** @internal */
            this._onMicrotaskEmpty = new EventEmitter(false);
            /** @internal */
            this._onStable = new EventEmitter(false);
            /** @internal */
            this._onErrorEvents = new EventEmitter(false);
            this._zoneImpl = new NgZoneImpl({
                trace: enableLongStackTrace,
                onEnter: function () {
                    // console.log('ZONE.enter', this._nesting, this._isStable);
                    _this._nesting++;
                    if (_this._isStable) {
                        _this._isStable = false;
                        _this._onUnstable.emit(null);
                    }
                },
                onLeave: function () {
                    _this._nesting--;
                    // console.log('ZONE.leave', this._nesting, this._isStable);
                    _this._checkStable();
                },
                setMicrotask: function (hasMicrotasks) {
                    _this._hasPendingMicrotasks = hasMicrotasks;
                    _this._checkStable();
                },
                setMacrotask: function (hasMacrotasks) { _this._hasPendingMacrotasks = hasMacrotasks; },
                onError: function (error) { return _this._onErrorEvents.emit(error); }
            });
        }
        NgZone.isInAngularZone = function () { return NgZoneImpl.isInAngularZone(); };
        NgZone.assertInAngularZone = function () {
            if (!NgZoneImpl.isInAngularZone()) {
                throw new BaseException('Expected to be in Angular Zone, but it is not!');
            }
        };
        NgZone.assertNotInAngularZone = function () {
            if (NgZoneImpl.isInAngularZone()) {
                throw new BaseException('Expected to not be in Angular Zone, but it is!');
            }
        };
        NgZone.prototype._checkStable = function () {
            var _this = this;
            if (this._nesting == 0) {
                if (!this._hasPendingMicrotasks && !this._isStable) {
                    try {
                        // console.log('ZONE.microtaskEmpty');
                        this._nesting++;
                        this._onMicrotaskEmpty.emit(null);
                    }
                    finally {
                        this._nesting--;
                        if (!this._hasPendingMicrotasks) {
                            try {
                                // console.log('ZONE.stable', this._nesting, this._isStable);
                                this.runOutsideAngular(function () { return _this._onStable.emit(null); });
                            }
                            finally {
                                this._isStable = true;
                            }
                        }
                    }
                }
            }
        };
        ;
        Object.defineProperty(NgZone.prototype, "onUnstable", {
            /**
             * Notifies when code enters Angular Zone. This gets fired first on VM Turn.
             */
            get: function () { return this._onUnstable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgZone.prototype, "onMicrotaskEmpty", {
            /**
             * Notifies when there is no more microtasks enqueue in the current VM Turn.
             * This is a hint for Angular to do change detection, which may enqueue more microtasks.
             * For this reason this event can fire multiple times per VM Turn.
             */
            get: function () { return this._onMicrotaskEmpty; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgZone.prototype, "onStable", {
            /**
             * Notifies when the last `onMicrotaskEmpty` has run and there are no more microtasks, which
             * implies we are about to relinquish VM turn.
             * This event gets called just once.
             */
            get: function () { return this._onStable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgZone.prototype, "onError", {
            /**
             * Notify that an error has been delivered.
             */
            get: function () { return this._onErrorEvents; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgZone.prototype, "hasPendingMicrotasks", {
            /**
             * Whether there are any outstanding microtasks.
             */
            get: function () { return this._hasPendingMicrotasks; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NgZone.prototype, "hasPendingMacrotasks", {
            /**
             * Whether there are any outstanding microtasks.
             */
            get: function () { return this._hasPendingMacrotasks; },
            enumerable: true,
            configurable: true
        });
        /**
         * Executes the `fn` function synchronously within the Angular zone and returns value returned by
         * the function.
         *
         * Running functions via `run` allows you to reenter Angular zone from a task that was executed
         * outside of the Angular zone (typically started via {@link #runOutsideAngular}).
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * within the Angular zone.
         *
         * If a synchronous error happens it will be rethrown and not reported via `onError`.
         */
        NgZone.prototype.run = function (fn) { return this._zoneImpl.runInner(fn); };
        /**
         * Same as #run, except that synchronous errors are caught and forwarded
         * via `onError` and not rethrown.
         */
        NgZone.prototype.runGuarded = function (fn) { return this._zoneImpl.runInnerGuarded(fn); };
        /**
         * Executes the `fn` function synchronously in Angular's parent zone and returns value returned by
         * the function.
         *
         * Running functions via `runOutsideAngular` allows you to escape Angular's zone and do work that
         * doesn't trigger Angular change-detection or is subject to Angular's error handling.
         *
         * Any future tasks or microtasks scheduled from within this function will continue executing from
         * outside of the Angular zone.
         *
         * Use {@link #run} to reenter the Angular zone and do work that updates the application model.
         */
        NgZone.prototype.runOutsideAngular = function (fn) { return this._zoneImpl.runOuter(fn); };
        return NgZone;
    }());
    /**
     * A DI Token representing a unique string id assigned to the application by Angular and used
     * primarily for prefixing application attributes and CSS styles when
     * {@link ViewEncapsulation#Emulated} is being used.
     *
     * If you need to avoid randomly generated value to be used as an application id, you can provide
     * a custom value via a DI provider <!-- TODO: provider --> configuring the root {@link Injector}
     * using this token.
     */
    var APP_ID = new OpaqueToken('AppId');
    function _appIdRandomProviderFactory() {
        return "" + _randomChar() + _randomChar() + _randomChar();
    }
    /**
     * Providers that will generate a random APP_ID_TOKEN.
     */
    var APP_ID_RANDOM_PROVIDER =
        /*@ts2dart_const*/ /* @ts2dart_Provider */ {
        provide: APP_ID,
        useFactory: _appIdRandomProviderFactory,
        deps: []
    };
    function _randomChar() {
        return StringWrapper.fromCharCode(97 + Math.floor(Math.random() * 25));
    }
    /**
     * A function that will be executed when a platform is initialized.
     */
    var PLATFORM_INITIALIZER =
        /*@ts2dart_const*/ new OpaqueToken("Platform Initializer");
    /**
     * A function that will be executed when an application is initialized.
     */
    var APP_INITIALIZER =
        /*@ts2dart_const*/ new OpaqueToken("Application Initializer");
    /**
     * A token which indicates the root directory of the application
     */
    var PACKAGE_ROOT_URL =
        /*@ts2dart_const*/ new OpaqueToken("Application Packages Root URL");
    var Testability = (function () {
        function Testability(_ngZone) {
            this._ngZone = _ngZone;
            /** @internal */
            this._pendingCount = 0;
            /** @internal */
            this._isZoneStable = true;
            /**
             * Whether any work was done since the last 'whenStable' callback. This is
             * useful to detect if this could have potentially destabilized another
             * component while it is stabilizing.
             * @internal
             */
            this._didWork = false;
            /** @internal */
            this._callbacks = [];
            this._watchAngularEvents();
        }
        /** @internal */
        Testability.prototype._watchAngularEvents = function () {
            var _this = this;
            ObservableWrapper.subscribe(this._ngZone.onUnstable, function (_) {
                _this._didWork = true;
                _this._isZoneStable = false;
            });
            this._ngZone.runOutsideAngular(function () {
                ObservableWrapper.subscribe(_this._ngZone.onStable, function (_) {
                    NgZone.assertNotInAngularZone();
                    scheduleMicroTask(function () {
                        _this._isZoneStable = true;
                        _this._runCallbacksIfReady();
                    });
                });
            });
        };
        Testability.prototype.increasePendingRequestCount = function () {
            this._pendingCount += 1;
            this._didWork = true;
            return this._pendingCount;
        };
        Testability.prototype.decreasePendingRequestCount = function () {
            this._pendingCount -= 1;
            if (this._pendingCount < 0) {
                throw new BaseException('pending async requests below zero');
            }
            this._runCallbacksIfReady();
            return this._pendingCount;
        };
        Testability.prototype.isStable = function () {
            return this._isZoneStable && this._pendingCount == 0 && !this._ngZone.hasPendingMacrotasks;
        };
        /** @internal */
        Testability.prototype._runCallbacksIfReady = function () {
            var _this = this;
            if (this.isStable()) {
                // Schedules the call backs in a new frame so that it is always async.
                scheduleMicroTask(function () {
                    while (_this._callbacks.length !== 0) {
                        (_this._callbacks.pop())(_this._didWork);
                    }
                    _this._didWork = false;
                });
            }
            else {
                // Not Ready
                this._didWork = true;
            }
        };
        Testability.prototype.whenStable = function (callback) {
            this._callbacks.push(callback);
            this._runCallbacksIfReady();
        };
        Testability.prototype.getPendingRequestCount = function () { return this._pendingCount; };
        Testability.prototype.findBindings = function (using, provider, exactMatch) {
            // TODO(juliemr): implement.
            return [];
        };
        Testability.prototype.findProviders = function (using, provider, exactMatch) {
            // TODO(juliemr): implement.
            return [];
        };
        return Testability;
    }());
    Testability.decorators = [
        { type: Injectable },
    ];
    Testability.ctorParameters = [
        { type: NgZone, },
    ];
    var TestabilityRegistry = (function () {
        function TestabilityRegistry() {
            /** @internal */
            this._applications = new Map$1();
            _testabilityGetter.addToWindow(this);
        }
        TestabilityRegistry.prototype.registerApplication = function (token, testability) {
            this._applications.set(token, testability);
        };
        TestabilityRegistry.prototype.getTestability = function (elem) { return this._applications.get(elem); };
        TestabilityRegistry.prototype.getAllTestabilities = function () { return MapWrapper.values(this._applications); };
        TestabilityRegistry.prototype.getAllRootElements = function () { return MapWrapper.keys(this._applications); };
        TestabilityRegistry.prototype.findTestabilityInTree = function (elem, findInAncestors) {
            if (findInAncestors === void 0) { findInAncestors = true; }
            return _testabilityGetter.findTestabilityInTree(this, elem, findInAncestors);
        };
        return TestabilityRegistry;
    }());
    TestabilityRegistry.decorators = [
        { type: Injectable },
    ];
    TestabilityRegistry.ctorParameters = [];
    /* @ts2dart_const */
    var _NoopGetTestability = (function () {
        function _NoopGetTestability() {
        }
        _NoopGetTestability.prototype.addToWindow = function (registry) { };
        _NoopGetTestability.prototype.findTestabilityInTree = function (registry, elem, findInAncestors) {
            return null;
        };
        return _NoopGetTestability;
    }());
    /**
     * Set the {@link GetTestability} implementation used by the Angular testing framework.
     */
    function setTestabilityGetter(getter) {
        _testabilityGetter = getter;
    }
    var _testabilityGetter = new _NoopGetTestability();
    /**
     * A SecurityContext marks a location that has dangerous security implications, e.g. a DOM property
     * like `innerHTML` that could cause Cross Site Scripting (XSS) security bugs when improperly
     * handled.
     *
     * See DomSanitizationService for more details on security in Angular applications.
     */
    var SecurityContext;
    (function (SecurityContext) {
        SecurityContext[SecurityContext["NONE"] = 0] = "NONE";
        SecurityContext[SecurityContext["HTML"] = 1] = "HTML";
        SecurityContext[SecurityContext["STYLE"] = 2] = "STYLE";
        SecurityContext[SecurityContext["SCRIPT"] = 3] = "SCRIPT";
        SecurityContext[SecurityContext["URL"] = 4] = "URL";
        SecurityContext[SecurityContext["RESOURCE_URL"] = 5] = "RESOURCE_URL";
    })(SecurityContext || (SecurityContext = {}));
    /**
     * SanitizationService is used by the views to sanitize potentially dangerous values. This is a
     * private API, use code should only refer to DomSanitizationService.
     */
    var SanitizationService = (function () {
        function SanitizationService() {
        }
        return SanitizationService;
    }());
    var ViewType;
    (function (ViewType) {
        // A view that contains the host element with bound component directive.
        // Contains a COMPONENT view
        ViewType[ViewType["HOST"] = 0] = "HOST";
        // The view of the component
        // Can contain 0 to n EMBEDDED views
        ViewType[ViewType["COMPONENT"] = 1] = "COMPONENT";
        // A view that is embedded into another View via a <template> element
        // inside of a COMPONENT view
        ViewType[ViewType["EMBEDDED"] = 2] = "EMBEDDED";
    })(ViewType || (ViewType = {}));
    /**
     * A wrapper around a native element inside of a View.
     *
     * An `ElementRef` is backed by a render-specific element. In the browser, this is usually a DOM
     * element.
     */
        // Note: We don't expose things like `Injector`, `ViewContainer`, ... here,
        // i.e. users have to ask for what they need. With that, we can build better analysis tools
        // and could do better codegen in the future.
    var ElementRef = (function () {
            function ElementRef(nativeElement) {
                this.nativeElement = nativeElement;
            }
            return ElementRef;
        }());
    var trace;
    var events;
    function detectWTF() {
        var wtf = global$1['wtf'];
        if (wtf) {
            trace = wtf['trace'];
            if (trace) {
                events = trace['events'];
                return true;
            }
        }
        return false;
    }
    function createScope(signature, flags) {
        if (flags === void 0) { flags = null; }
        return events.createScope(signature, flags);
    }
    function leave(scope, returnValue) {
        trace.leaveScope(scope, returnValue);
        return returnValue;
    }
    function startTimeRange(rangeType, action) {
        return trace.beginTimeRange(rangeType, action);
    }
    function endTimeRange(range) {
        trace.endTimeRange(range);
    }
    // Change exports to const once https://github.com/angular/ts2dart/issues/150
    /**
     * True if WTF is enabled.
     */
    var wtfEnabled = detectWTF();
    function noopScope(arg0, arg1) {
        return null;
    }
    /**
     * Create trace scope.
     *
     * Scopes must be strictly nested and are analogous to stack frames, but
     * do not have to follow the stack frames. Instead it is recommended that they follow logical
     * nesting. You may want to use
     * [Event
     * Signatures](http://google.github.io/tracing-framework/instrumenting-code.html#custom-events)
     * as they are defined in WTF.
     *
     * Used to mark scope entry. The return value is used to leave the scope.
     *
     *     var myScope = wtfCreateScope('MyClass#myMethod(ascii someVal)');
     *
     *     someMethod() {
     *        var s = myScope('Foo'); // 'Foo' gets stored in tracing UI
     *        // DO SOME WORK HERE
     *        return wtfLeave(s, 123); // Return value 123
     *     }
     *
     * Note, adding try-finally block around the work to ensure that `wtfLeave` gets called can
     * negatively impact the performance of your application. For this reason we recommend that
     * you don't add them to ensure that `wtfLeave` gets called. In production `wtfLeave` is a noop and
     * so try-finally block has no value. When debugging perf issues, skipping `wtfLeave`, do to
     * exception, will produce incorrect trace, but presence of exception signifies logic error which
     * needs to be fixed before the app should be profiled. Add try-finally only when you expect that
     * an exception is expected during normal execution while profiling.
     *
     */
    var wtfCreateScope = wtfEnabled ? createScope : function (signature, flags) { return noopScope; };
    /**
     * Used to mark end of Scope.
     *
     * - `scope` to end.
     * - `returnValue` (optional) to be passed to the WTF.
     *
     * Returns the `returnValue for easy chaining.
     */
    var wtfLeave = wtfEnabled ? leave : function (s, r) { return r; };
    /**
     * Used to mark Async start. Async are similar to scope but they don't have to be strictly nested.
     * The return value is used in the call to [endAsync]. Async ranges only work if WTF has been
     * enabled.
     *
     *     someMethod() {
     *        var s = wtfStartTimeRange('HTTP:GET', 'some.url');
     *        var future = new Future.delay(5).then((_) {
     *          wtfEndTimeRange(s);
     *        });
     *     }
     */
    var wtfStartTimeRange = wtfEnabled ? startTimeRange : function (rangeType, action) { return null; };
    /**
     * Ends a async time range operation.
     * [range] is the return value from [wtfStartTimeRange] Async ranges only work if WTF has been
     * enabled.
     */
    var wtfEndTimeRange = wtfEnabled ? endTimeRange : function (r) { return null; };
    /**
     * Represents a container where one or more Views can be attached.
     *
     * The container can contain two kinds of Views. Host Views, created by instantiating a
     * {@link Component} via {@link #createComponent}, and Embedded Views, created by instantiating an
     * {@link TemplateRef Embedded Template} via {@link #createEmbeddedView}.
     *
     * The location of the View Container within the containing View is specified by the Anchor
     * `element`. Each View Container can have only one Anchor Element and each Anchor Element can only
     * have a single View Container.
     *
     * Root elements of Views attached to this container become siblings of the Anchor Element in
     * the Rendered View.
     *
     * To access a `ViewContainerRef` of an Element, you can either place a {@link Directive} injected
     * with `ViewContainerRef` on the Element, or you obtain it via a {@link ViewChild} query.
     */
    var ViewContainerRef = (function () {
        function ViewContainerRef() {
        }
        Object.defineProperty(ViewContainerRef.prototype, "element", {
            /**
             * Anchor element that specifies the location of this container in the containing View.
             * <!-- TODO: rename to anchorElement -->
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef.prototype, "injector", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef.prototype, "parentInjector", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef.prototype, "length", {
            /**
             * Returns the number of Views currently attached to this container.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        return ViewContainerRef;
    }());
    var ViewContainerRef_ = (function () {
        function ViewContainerRef_(_element) {
            this._element = _element;
            /** @internal */
            this._createComponentInContainerScope = wtfCreateScope('ViewContainerRef#createComponent()');
            /** @internal */
            this._insertScope = wtfCreateScope('ViewContainerRef#insert()');
            /** @internal */
            this._removeScope = wtfCreateScope('ViewContainerRef#remove()');
            /** @internal */
            this._detachScope = wtfCreateScope('ViewContainerRef#detach()');
        }
        ViewContainerRef_.prototype.get = function (index) { return this._element.nestedViews[index].ref; };
        Object.defineProperty(ViewContainerRef_.prototype, "length", {
            get: function () {
                var views = this._element.nestedViews;
                return isPresent(views) ? views.length : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "element", {
            get: function () { return this._element.elementRef; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "injector", {
            get: function () { return this._element.injector; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewContainerRef_.prototype, "parentInjector", {
            get: function () { return this._element.parentInjector; },
            enumerable: true,
            configurable: true
        });
        // TODO(rado): profile and decide whether bounds checks should be added
        // to the methods below.
        ViewContainerRef_.prototype.createEmbeddedView = function (templateRef, context, index) {
            if (context === void 0) { context = null; }
            if (index === void 0) { index = -1; }
            var viewRef = templateRef.createEmbeddedView(context);
            this.insert(viewRef, index);
            return viewRef;
        };
        ViewContainerRef_.prototype.createComponent = function (componentFactory, index, injector, projectableNodes) {
            if (index === void 0) { index = -1; }
            if (injector === void 0) { injector = null; }
            if (projectableNodes === void 0) { projectableNodes = null; }
            var s = this._createComponentInContainerScope();
            var contextInjector = isPresent(injector) ? injector : this._element.parentInjector;
            var componentRef = componentFactory.create(contextInjector, projectableNodes);
            this.insert(componentRef.hostView, index);
            return wtfLeave(s, componentRef);
        };
        // TODO(i): refactor insert+remove into move
        ViewContainerRef_.prototype.insert = function (viewRef, index) {
            if (index === void 0) { index = -1; }
            var s = this._insertScope();
            if (index == -1)
                index = this.length;
            var viewRef_ = viewRef;
            this._element.attachView(viewRef_.internalView, index);
            return wtfLeave(s, viewRef_);
        };
        ViewContainerRef_.prototype.indexOf = function (viewRef) {
            return ListWrapper.indexOf(this._element.nestedViews, viewRef.internalView);
        };
        // TODO(i): rename to destroy
        ViewContainerRef_.prototype.remove = function (index) {
            if (index === void 0) { index = -1; }
            var s = this._removeScope();
            if (index == -1)
                index = this.length - 1;
            var view = this._element.detachView(index);
            view.destroy();
            // view is intentionally not returned to the client.
            wtfLeave(s);
        };
        // TODO(i): refactor insert+remove into move
        ViewContainerRef_.prototype.detach = function (index) {
            if (index === void 0) { index = -1; }
            var s = this._detachScope();
            if (index == -1)
                index = this.length - 1;
            var view = this._element.detachView(index);
            return wtfLeave(s, view.ref);
        };
        ViewContainerRef_.prototype.clear = function () {
            for (var i = this.length - 1; i >= 0; i--) {
                this.remove(i);
            }
        };
        return ViewContainerRef_;
    }());
    /**
     * An AppElement is created for elements that have a ViewContainerRef,
     * a nested component or a <template> element to keep data around
     * that is needed for later instantiations.
     */
    var AppElement = (function () {
        function AppElement(index, parentIndex, parentView, nativeElement) {
            this.index = index;
            this.parentIndex = parentIndex;
            this.parentView = parentView;
            this.nativeElement = nativeElement;
            this.nestedViews = null;
            this.componentView = null;
        }
        Object.defineProperty(AppElement.prototype, "elementRef", {
            get: function () { return new ElementRef(this.nativeElement); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppElement.prototype, "vcRef", {
            get: function () { return new ViewContainerRef_(this); },
            enumerable: true,
            configurable: true
        });
        AppElement.prototype.initComponent = function (component, componentConstructorViewQueries, view) {
            this.component = component;
            this.componentConstructorViewQueries = componentConstructorViewQueries;
            this.componentView = view;
        };
        Object.defineProperty(AppElement.prototype, "parentInjector", {
            get: function () { return this.parentView.injector(this.parentIndex); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppElement.prototype, "injector", {
            get: function () { return this.parentView.injector(this.index); },
            enumerable: true,
            configurable: true
        });
        AppElement.prototype.mapNestedViews = function (nestedViewClass, callback) {
            var result = [];
            if (isPresent(this.nestedViews)) {
                this.nestedViews.forEach(function (nestedView) {
                    if (nestedView.clazz === nestedViewClass) {
                        result.push(callback(nestedView));
                    }
                });
            }
            return result;
        };
        AppElement.prototype.attachView = function (view, viewIndex) {
            if (view.type === ViewType.COMPONENT) {
                throw new BaseException("Component views can't be moved!");
            }
            var nestedViews = this.nestedViews;
            if (nestedViews == null) {
                nestedViews = [];
                this.nestedViews = nestedViews;
            }
            ListWrapper.insert(nestedViews, viewIndex, view);
            var refRenderNode;
            if (viewIndex > 0) {
                var prevView = nestedViews[viewIndex - 1];
                refRenderNode = prevView.lastRootNode;
            }
            else {
                refRenderNode = this.nativeElement;
            }
            if (isPresent(refRenderNode)) {
                view.renderer.attachViewAfter(refRenderNode, view.flatRootNodes);
            }
            view.addToContentChildren(this);
        };
        AppElement.prototype.detachView = function (viewIndex) {
            var view = ListWrapper.removeAt(this.nestedViews, viewIndex);
            if (view.type === ViewType.COMPONENT) {
                throw new BaseException("Component views can't be moved!");
            }
            view.renderer.detachView(view.flatRootNodes);
            view.removeFromContentChildren(this);
            return view;
        };
        return AppElement;
    }());
    /**
     * An error thrown if application changes model breaking the top-down data flow.
     *
     * This exception is only thrown in dev mode.
     *
     * <!-- TODO: Add a link once the dev mode option is configurable -->
     *
     * ### Example
     *
     * ```typescript
     * @Component({
     *   selector: 'parent',
     *   template: `
     *     <child [prop]="parentProp"></child>
     *   `,
     *   directives: [forwardRef(() => Child)]
     * })
     * class Parent {
     *   parentProp = "init";
     * }
     *
     * @Directive({selector: 'child', inputs: ['prop']})
     * class Child {
     *   constructor(public parent: Parent) {}
     *
     *   set prop(v) {
     *     // this updates the parent property, which is disallowed during change detection
     *     // this will result in ExpressionChangedAfterItHasBeenCheckedException
     *     this.parent.parentProp = "updated";
     *   }
     * }
     * ```
     */
    var ExpressionChangedAfterItHasBeenCheckedException = (function (_super) {
        __extends(ExpressionChangedAfterItHasBeenCheckedException, _super);
        function ExpressionChangedAfterItHasBeenCheckedException(oldValue, currValue, context) {
            _super.call(this, "Expression has changed after it was checked. " +
                ("Previous value: '" + oldValue + "'. Current value: '" + currValue + "'"));
        }
        return ExpressionChangedAfterItHasBeenCheckedException;
    }(BaseException));
    /**
     * Thrown when an exception was raised during view creation, change detection or destruction.
     *
     * This error wraps the original exception to attach additional contextual information that can
     * be useful for debugging.
     */
    var ViewWrappedException = (function (_super) {
        __extends(ViewWrappedException, _super);
        function ViewWrappedException(originalException, originalStack, context) {
            _super.call(this, "Error in " + context.source, originalException, originalStack, context);
        }
        return ViewWrappedException;
    }(WrappedException));
    /**
     * Thrown when a destroyed view is used.
     *
     * This error indicates a bug in the framework.
     *
     * This is an internal Angular error.
     */
    var ViewDestroyedException = (function (_super) {
        __extends(ViewDestroyedException, _super);
        function ViewDestroyedException(details) {
            _super.call(this, "Attempt to use a destroyed view: " + details);
        }
        return ViewDestroyedException;
    }(BaseException));
    /**
     * A repository of different iterable diffing strategies used by NgFor, NgClass, and others.
     * @ts2dart_const
     */
    var IterableDiffers = (function () {
        /*@ts2dart_const*/
        function IterableDiffers(factories) {
            this.factories = factories;
        }
        IterableDiffers.create = function (factories, parent) {
            if (isPresent(parent)) {
                var copied = ListWrapper.clone(parent.factories);
                factories = factories.concat(copied);
                return new IterableDiffers(factories);
            }
            else {
                return new IterableDiffers(factories);
            }
        };
        /**
         * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
         * inherited {@link IterableDiffers} instance with the provided factories and return a new
         * {@link IterableDiffers} instance.
         *
         * The following example shows how to extend an existing list of factories,
         * which will only be applied to the injector for this component and its children.
         * This step is all that's required to make a new {@link IterableDiffer} available.
         *
         * ### Example
         *
         * ```
         * @Component({
         *   viewProviders: [
         *     IterableDiffers.extend([new ImmutableListDiffer()])
         *   ]
         * })
         * ```
         */
        IterableDiffers.extend = function (factories) {
            return new Provider(IterableDiffers, {
                useFactory: function (parent) {
                    if (isBlank(parent)) {
                        // Typically would occur when calling IterableDiffers.extend inside of dependencies passed
                        // to
                        // bootstrap(), which would override default pipes instead of extending them.
                        throw new BaseException('Cannot extend IterableDiffers without a parent injector');
                    }
                    return IterableDiffers.create(factories, parent);
                },
                // Dependency technically isn't optional, but we can provide a better error message this way.
                deps: [[IterableDiffers, new SkipSelfMetadata(), new OptionalMetadata()]]
            });
        };
        IterableDiffers.prototype.find = function (iterable) {
            var factory = this.factories.find(function (f) { return f.supports(iterable); });
            if (isPresent(factory)) {
                return factory;
            }
            else {
                throw new BaseException("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
            }
        };
        return IterableDiffers;
    }());
    /* @ts2dart_const */
    var DefaultIterableDifferFactory = (function () {
        function DefaultIterableDifferFactory() {
        }
        DefaultIterableDifferFactory.prototype.supports = function (obj) { return isListLikeIterable(obj); };
        DefaultIterableDifferFactory.prototype.create = function (cdRef, trackByFn) {
            return new DefaultIterableDiffer(trackByFn);
        };
        return DefaultIterableDifferFactory;
    }());
    var trackByIdentity = function (index, item) { return item; };
    var DefaultIterableDiffer = (function () {
        function DefaultIterableDiffer(_trackByFn) {
            this._trackByFn = _trackByFn;
            this._length = null;
            this._collection = null;
            // Keeps track of the used records at any point in time (during & across `_check()` calls)
            this._linkedRecords = null;
            // Keeps track of the removed records at any point in time during `_check()` calls.
            this._unlinkedRecords = null;
            this._previousItHead = null;
            this._itHead = null;
            this._itTail = null;
            this._additionsHead = null;
            this._additionsTail = null;
            this._movesHead = null;
            this._movesTail = null;
            this._removalsHead = null;
            this._removalsTail = null;
            // Keeps track of records where custom track by is the same, but item identity has changed
            this._identityChangesHead = null;
            this._identityChangesTail = null;
            this._trackByFn = isPresent(this._trackByFn) ? this._trackByFn : trackByIdentity;
        }
        Object.defineProperty(DefaultIterableDiffer.prototype, "collection", {
            get: function () { return this._collection; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultIterableDiffer.prototype, "length", {
            get: function () { return this._length; },
            enumerable: true,
            configurable: true
        });
        DefaultIterableDiffer.prototype.forEachItem = function (fn) {
            var record;
            for (record = this._itHead; record !== null; record = record._next) {
                fn(record);
            }
        };
        DefaultIterableDiffer.prototype.forEachPreviousItem = function (fn) {
            var record;
            for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
                fn(record);
            }
        };
        DefaultIterableDiffer.prototype.forEachAddedItem = function (fn) {
            var record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                fn(record);
            }
        };
        DefaultIterableDiffer.prototype.forEachMovedItem = function (fn) {
            var record;
            for (record = this._movesHead; record !== null; record = record._nextMoved) {
                fn(record);
            }
        };
        DefaultIterableDiffer.prototype.forEachRemovedItem = function (fn) {
            var record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                fn(record);
            }
        };
        DefaultIterableDiffer.prototype.forEachIdentityChange = function (fn) {
            var record;
            for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
                fn(record);
            }
        };
        DefaultIterableDiffer.prototype.diff = function (collection) {
            if (isBlank(collection))
                collection = [];
            if (!isListLikeIterable(collection)) {
                throw new BaseException("Error trying to diff '" + collection + "'");
            }
            if (this.check(collection)) {
                return this;
            }
            else {
                return null;
            }
        };
        DefaultIterableDiffer.prototype.onDestroy = function () { };
        // todo(vicb): optim for UnmodifiableListView (frozen arrays)
        DefaultIterableDiffer.prototype.check = function (collection) {
            var _this = this;
            this._reset();
            var record = this._itHead;
            var mayBeDirty = false;
            var index;
            var item;
            var itemTrackBy;
            if (isArray(collection)) {
                var list = collection;
                this._length = collection.length;
                for (index = 0; index < this._length; index++) {
                    item = list[index];
                    itemTrackBy = this._trackByFn(index, item);
                    if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                        record = this._mismatch(record, item, itemTrackBy, index);
                        mayBeDirty = true;
                    }
                    else {
                        if (mayBeDirty) {
                            // TODO(misko): can we limit this to duplicates only?
                            record = this._verifyReinsertion(record, item, itemTrackBy, index);
                        }
                        if (!looseIdentical(record.item, item))
                            this._addIdentityChange(record, item);
                    }
                    record = record._next;
                }
            }
            else {
                index = 0;
                iterateListLike(collection, function (item) {
                    itemTrackBy = _this._trackByFn(index, item);
                    if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
                        record = _this._mismatch(record, item, itemTrackBy, index);
                        mayBeDirty = true;
                    }
                    else {
                        if (mayBeDirty) {
                            // TODO(misko): can we limit this to duplicates only?
                            record = _this._verifyReinsertion(record, item, itemTrackBy, index);
                        }
                        if (!looseIdentical(record.item, item))
                            _this._addIdentityChange(record, item);
                    }
                    record = record._next;
                    index++;
                });
                this._length = index;
            }
            this._truncate(record);
            this._collection = collection;
            return this.isDirty;
        };
        Object.defineProperty(DefaultIterableDiffer.prototype, "isDirty", {
            /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
             * changes.
             */
            get: function () {
                return this._additionsHead !== null || this._movesHead !== null ||
                    this._removalsHead !== null || this._identityChangesHead !== null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Reset the state of the change objects to show no changes. This means set previousKey to
         * currentKey, and clear all of the queues (additions, moves, removals).
         * Set the previousIndexes of moved and added items to their currentIndexes
         * Reset the list of additions, moves and removals
         *
         * @internal
         */
        DefaultIterableDiffer.prototype._reset = function () {
            if (this.isDirty) {
                var record;
                var nextRecord;
                for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
                    record._nextPrevious = record._next;
                }
                for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                    record.previousIndex = record.currentIndex;
                }
                this._additionsHead = this._additionsTail = null;
                for (record = this._movesHead; record !== null; record = nextRecord) {
                    record.previousIndex = record.currentIndex;
                    nextRecord = record._nextMoved;
                }
                this._movesHead = this._movesTail = null;
                this._removalsHead = this._removalsTail = null;
                this._identityChangesHead = this._identityChangesTail = null;
            }
        };
        /**
         * This is the core function which handles differences between collections.
         *
         * - `record` is the record which we saw at this position last time. If null then it is a new
         *   item.
         * - `item` is the current item in the collection
         * - `index` is the position of the item in the collection
         *
         * @internal
         */
        DefaultIterableDiffer.prototype._mismatch = function (record, item, itemTrackBy, index) {
            // The previous record after which we will append the current one.
            var previousRecord;
            if (record === null) {
                previousRecord = this._itTail;
            }
            else {
                previousRecord = record._prev;
                // Remove the record from the collection since we know it does not match the item.
                this._remove(record);
            }
            // Attempt to see if we have seen the item before.
            record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
            if (record !== null) {
                // We have seen this before, we need to move it forward in the collection.
                // But first we need to check if identity changed, so we can update in view if necessary
                if (!looseIdentical(record.item, item))
                    this._addIdentityChange(record, item);
                this._moveAfter(record, previousRecord, index);
            }
            else {
                // Never seen it, check evicted list.
                record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
                if (record !== null) {
                    // It is an item which we have evicted earlier: reinsert it back into the list.
                    // But first we need to check if identity changed, so we can update in view if necessary
                    if (!looseIdentical(record.item, item))
                        this._addIdentityChange(record, item);
                    this._reinsertAfter(record, previousRecord, index);
                }
                else {
                    // It is a new item: add it.
                    record =
                        this._addAfter(new CollectionChangeRecord(item, itemTrackBy), previousRecord, index);
                }
            }
            return record;
        };
        /**
         * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
         *
         * Use case: `[a, a]` => `[b, a, a]`
         *
         * If we did not have this check then the insertion of `b` would:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) leave `a` at index `1` as is. <-- this is wrong!
         *   3) reinsert `a` at index 2. <-- this is wrong!
         *
         * The correct behavior is:
         *   1) evict first `a`
         *   2) insert `b` at `0` index.
         *   3) reinsert `a` at index 1.
         *   3) move `a` at from `1` to `2`.
         *
         *
         * Double check that we have not evicted a duplicate item. We need to check if the item type may
         * have already been removed:
         * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
         * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
         * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
         * at the end.
         *
         * @internal
         */
        DefaultIterableDiffer.prototype._verifyReinsertion = function (record, item, itemTrackBy, index) {
            var reinsertRecord = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy);
            if (reinsertRecord !== null) {
                record = this._reinsertAfter(reinsertRecord, record._prev, index);
            }
            else if (record.currentIndex != index) {
                record.currentIndex = index;
                this._addToMoves(record, index);
            }
            return record;
        };
        /**
         * Get rid of any excess {@link CollectionChangeRecord}s from the previous collection
         *
         * - `record` The first excess {@link CollectionChangeRecord}.
         *
         * @internal
         */
        DefaultIterableDiffer.prototype._truncate = function (record) {
            // Anything after that needs to be removed;
            while (record !== null) {
                var nextRecord = record._next;
                this._addToRemovals(this._unlink(record));
                record = nextRecord;
            }
            if (this._unlinkedRecords !== null) {
                this._unlinkedRecords.clear();
            }
            if (this._additionsTail !== null) {
                this._additionsTail._nextAdded = null;
            }
            if (this._movesTail !== null) {
                this._movesTail._nextMoved = null;
            }
            if (this._itTail !== null) {
                this._itTail._next = null;
            }
            if (this._removalsTail !== null) {
                this._removalsTail._nextRemoved = null;
            }
            if (this._identityChangesTail !== null) {
                this._identityChangesTail._nextIdentityChange = null;
            }
        };
        /** @internal */
        DefaultIterableDiffer.prototype._reinsertAfter = function (record, prevRecord, index) {
            if (this._unlinkedRecords !== null) {
                this._unlinkedRecords.remove(record);
            }
            var prev = record._prevRemoved;
            var next = record._nextRemoved;
            if (prev === null) {
                this._removalsHead = next;
            }
            else {
                prev._nextRemoved = next;
            }
            if (next === null) {
                this._removalsTail = prev;
            }
            else {
                next._prevRemoved = prev;
            }
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._moveAfter = function (record, prevRecord, index) {
            this._unlink(record);
            this._insertAfter(record, prevRecord, index);
            this._addToMoves(record, index);
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._addAfter = function (record, prevRecord, index) {
            this._insertAfter(record, prevRecord, index);
            if (this._additionsTail === null) {
                // todo(vicb)
                // assert(this._additionsHead === null);
                this._additionsTail = this._additionsHead = record;
            }
            else {
                // todo(vicb)
                // assert(_additionsTail._nextAdded === null);
                // assert(record._nextAdded === null);
                this._additionsTail = this._additionsTail._nextAdded = record;
            }
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._insertAfter = function (record, prevRecord, index) {
            // todo(vicb)
            // assert(record != prevRecord);
            // assert(record._next === null);
            // assert(record._prev === null);
            var next = prevRecord === null ? this._itHead : prevRecord._next;
            // todo(vicb)
            // assert(next != record);
            // assert(prevRecord != record);
            record._next = next;
            record._prev = prevRecord;
            if (next === null) {
                this._itTail = record;
            }
            else {
                next._prev = record;
            }
            if (prevRecord === null) {
                this._itHead = record;
            }
            else {
                prevRecord._next = record;
            }
            if (this._linkedRecords === null) {
                this._linkedRecords = new _DuplicateMap();
            }
            this._linkedRecords.put(record);
            record.currentIndex = index;
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._remove = function (record) {
            return this._addToRemovals(this._unlink(record));
        };
        /** @internal */
        DefaultIterableDiffer.prototype._unlink = function (record) {
            if (this._linkedRecords !== null) {
                this._linkedRecords.remove(record);
            }
            var prev = record._prev;
            var next = record._next;
            // todo(vicb)
            // assert((record._prev = null) === null);
            // assert((record._next = null) === null);
            if (prev === null) {
                this._itHead = next;
            }
            else {
                prev._next = next;
            }
            if (next === null) {
                this._itTail = prev;
            }
            else {
                next._prev = prev;
            }
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._addToMoves = function (record, toIndex) {
            // todo(vicb)
            // assert(record._nextMoved === null);
            if (record.previousIndex === toIndex) {
                return record;
            }
            if (this._movesTail === null) {
                // todo(vicb)
                // assert(_movesHead === null);
                this._movesTail = this._movesHead = record;
            }
            else {
                // todo(vicb)
                // assert(_movesTail._nextMoved === null);
                this._movesTail = this._movesTail._nextMoved = record;
            }
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._addToRemovals = function (record) {
            if (this._unlinkedRecords === null) {
                this._unlinkedRecords = new _DuplicateMap();
            }
            this._unlinkedRecords.put(record);
            record.currentIndex = null;
            record._nextRemoved = null;
            if (this._removalsTail === null) {
                // todo(vicb)
                // assert(_removalsHead === null);
                this._removalsTail = this._removalsHead = record;
                record._prevRemoved = null;
            }
            else {
                // todo(vicb)
                // assert(_removalsTail._nextRemoved === null);
                // assert(record._nextRemoved === null);
                record._prevRemoved = this._removalsTail;
                this._removalsTail = this._removalsTail._nextRemoved = record;
            }
            return record;
        };
        /** @internal */
        DefaultIterableDiffer.prototype._addIdentityChange = function (record, item) {
            record.item = item;
            if (this._identityChangesTail === null) {
                this._identityChangesTail = this._identityChangesHead = record;
            }
            else {
                this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
            }
            return record;
        };
        DefaultIterableDiffer.prototype.toString = function () {
            var list = [];
            this.forEachItem(function (record) { return list.push(record); });
            var previous = [];
            this.forEachPreviousItem(function (record) { return previous.push(record); });
            var additions = [];
            this.forEachAddedItem(function (record) { return additions.push(record); });
            var moves = [];
            this.forEachMovedItem(function (record) { return moves.push(record); });
            var removals = [];
            this.forEachRemovedItem(function (record) { return removals.push(record); });
            var identityChanges = [];
            this.forEachIdentityChange(function (record) { return identityChanges.push(record); });
            return "collection: " + list.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" +
                "additions: " + additions.join(', ') + "\n" + "moves: " + moves.join(', ') + "\n" +
                "removals: " + removals.join(', ') + "\n" + "identityChanges: " +
                identityChanges.join(', ') + "\n";
        };
        return DefaultIterableDiffer;
    }());
    var CollectionChangeRecord = (function () {
        function CollectionChangeRecord(item, trackById) {
            this.item = item;
            this.trackById = trackById;
            this.currentIndex = null;
            this.previousIndex = null;
            /** @internal */
            this._nextPrevious = null;
            /** @internal */
            this._prev = null;
            /** @internal */
            this._next = null;
            /** @internal */
            this._prevDup = null;
            /** @internal */
            this._nextDup = null;
            /** @internal */
            this._prevRemoved = null;
            /** @internal */
            this._nextRemoved = null;
            /** @internal */
            this._nextAdded = null;
            /** @internal */
            this._nextMoved = null;
            /** @internal */
            this._nextIdentityChange = null;
        }
        CollectionChangeRecord.prototype.toString = function () {
            return this.previousIndex === this.currentIndex ?
                stringify(this.item) :
            stringify(this.item) + '[' + stringify(this.previousIndex) + '->' +
            stringify(this.currentIndex) + ']';
        };
        return CollectionChangeRecord;
    }());
    // A linked list of CollectionChangeRecords with the same CollectionChangeRecord.item
    var _DuplicateItemRecordList = (function () {
        function _DuplicateItemRecordList() {
            /** @internal */
            this._head = null;
            /** @internal */
            this._tail = null;
        }
        /**
         * Append the record to the list of duplicates.
         *
         * Note: by design all records in the list of duplicates hold the same value in record.item.
         */
        _DuplicateItemRecordList.prototype.add = function (record) {
            if (this._head === null) {
                this._head = this._tail = record;
                record._nextDup = null;
                record._prevDup = null;
            }
            else {
                // todo(vicb)
                // assert(record.item ==  _head.item ||
                //       record.item is num && record.item.isNaN && _head.item is num && _head.item.isNaN);
                this._tail._nextDup = record;
                record._prevDup = this._tail;
                record._nextDup = null;
                this._tail = record;
            }
        };
        // Returns a CollectionChangeRecord having CollectionChangeRecord.trackById == trackById and
        // CollectionChangeRecord.currentIndex >= afterIndex
        _DuplicateItemRecordList.prototype.get = function (trackById, afterIndex) {
            var record;
            for (record = this._head; record !== null; record = record._nextDup) {
                if ((afterIndex === null || afterIndex < record.currentIndex) &&
                    looseIdentical(record.trackById, trackById)) {
                    return record;
                }
            }
            return null;
        };
        /**
         * Remove one {@link CollectionChangeRecord} from the list of duplicates.
         *
         * Returns whether the list of duplicates is empty.
         */
        _DuplicateItemRecordList.prototype.remove = function (record) {
            // todo(vicb)
            // assert(() {
            //  // verify that the record being removed is in the list.
            //  for (CollectionChangeRecord cursor = _head; cursor != null; cursor = cursor._nextDup) {
            //    if (identical(cursor, record)) return true;
            //  }
            //  return false;
            //});
            var prev = record._prevDup;
            var next = record._nextDup;
            if (prev === null) {
                this._head = next;
            }
            else {
                prev._nextDup = next;
            }
            if (next === null) {
                this._tail = prev;
            }
            else {
                next._prevDup = prev;
            }
            return this._head === null;
        };
        return _DuplicateItemRecordList;
    }());
    var _DuplicateMap = (function () {
        function _DuplicateMap() {
            this.map = new Map();
        }
        _DuplicateMap.prototype.put = function (record) {
            // todo(vicb) handle corner cases
            var key = getMapKey(record.trackById);
            var duplicates = this.map.get(key);
            if (!isPresent(duplicates)) {
                duplicates = new _DuplicateItemRecordList();
                this.map.set(key, duplicates);
            }
            duplicates.add(record);
        };
        /**
         * Retrieve the `value` using key. Because the CollectionChangeRecord value may be one which we
         * have already iterated over, we use the afterIndex to pretend it is not there.
         *
         * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
         * have any more `a`s needs to return the last `a` not the first or second.
         */
        _DuplicateMap.prototype.get = function (trackById, afterIndex) {
            if (afterIndex === void 0) { afterIndex = null; }
            var key = getMapKey(trackById);
            var recordList = this.map.get(key);
            return isBlank(recordList) ? null : recordList.get(trackById, afterIndex);
        };
        /**
         * Removes a {@link CollectionChangeRecord} from the list of duplicates.
         *
         * The list of duplicates also is removed from the map if it gets empty.
         */
        _DuplicateMap.prototype.remove = function (record) {
            var key = getMapKey(record.trackById);
            // todo(vicb)
            // assert(this.map.containsKey(key));
            var recordList = this.map.get(key);
            // Remove the list of duplicates when it gets empty
            if (recordList.remove(record)) {
                this.map.delete(key);
            }
            return record;
        };
        Object.defineProperty(_DuplicateMap.prototype, "isEmpty", {
            get: function () { return this.map.size === 0; },
            enumerable: true,
            configurable: true
        });
        _DuplicateMap.prototype.clear = function () { this.map.clear(); };
        _DuplicateMap.prototype.toString = function () { return '_DuplicateMap(' + stringify(this.map) + ')'; };
        return _DuplicateMap;
    }());
    /**
     * A repository of different Map diffing strategies used by NgClass, NgStyle, and others.
     * @ts2dart_const
     */
    var KeyValueDiffers = (function () {
        /*@ts2dart_const*/
        function KeyValueDiffers(factories) {
            this.factories = factories;
        }
        KeyValueDiffers.create = function (factories, parent) {
            if (isPresent(parent)) {
                var copied = ListWrapper.clone(parent.factories);
                factories = factories.concat(copied);
                return new KeyValueDiffers(factories);
            }
            else {
                return new KeyValueDiffers(factories);
            }
        };
        /**
         * Takes an array of {@link KeyValueDifferFactory} and returns a provider used to extend the
         * inherited {@link KeyValueDiffers} instance with the provided factories and return a new
         * {@link KeyValueDiffers} instance.
         *
         * The following example shows how to extend an existing list of factories,
         * which will only be applied to the injector for this component and its children.
         * This step is all that's required to make a new {@link KeyValueDiffer} available.
         *
         * ### Example
         *
         * ```
         * @Component({
         *   viewProviders: [
         *     KeyValueDiffers.extend([new ImmutableMapDiffer()])
         *   ]
         * })
         * ```
         */
        KeyValueDiffers.extend = function (factories) {
            return new Provider(KeyValueDiffers, {
                useFactory: function (parent) {
                    if (isBlank(parent)) {
                        // Typically would occur when calling KeyValueDiffers.extend inside of dependencies passed
                        // to
                        // bootstrap(), which would override default pipes instead of extending them.
                        throw new BaseException('Cannot extend KeyValueDiffers without a parent injector');
                    }
                    return KeyValueDiffers.create(factories, parent);
                },
                // Dependency technically isn't optional, but we can provide a better error message this way.
                deps: [[KeyValueDiffers, new SkipSelfMetadata(), new OptionalMetadata()]]
            });
        };
        KeyValueDiffers.prototype.find = function (kv) {
            var factory = this.factories.find(function (f) { return f.supports(kv); });
            if (isPresent(factory)) {
                return factory;
            }
            else {
                throw new BaseException("Cannot find a differ supporting object '" + kv + "'");
            }
        };
        return KeyValueDiffers;
    }());
    /* @ts2dart_const */
    var DefaultKeyValueDifferFactory = (function () {
        function DefaultKeyValueDifferFactory() {
        }
        DefaultKeyValueDifferFactory.prototype.supports = function (obj) { return obj instanceof Map || isJsObject(obj); };
        DefaultKeyValueDifferFactory.prototype.create = function (cdRef) { return new DefaultKeyValueDiffer(); };
        return DefaultKeyValueDifferFactory;
    }());
    var DefaultKeyValueDiffer = (function () {
        function DefaultKeyValueDiffer() {
            this._records = new Map();
            this._mapHead = null;
            this._previousMapHead = null;
            this._changesHead = null;
            this._changesTail = null;
            this._additionsHead = null;
            this._additionsTail = null;
            this._removalsHead = null;
            this._removalsTail = null;
        }
        Object.defineProperty(DefaultKeyValueDiffer.prototype, "isDirty", {
            get: function () {
                return this._additionsHead !== null || this._changesHead !== null ||
                    this._removalsHead !== null;
            },
            enumerable: true,
            configurable: true
        });
        DefaultKeyValueDiffer.prototype.forEachItem = function (fn) {
            var record;
            for (record = this._mapHead; record !== null; record = record._next) {
                fn(record);
            }
        };
        DefaultKeyValueDiffer.prototype.forEachPreviousItem = function (fn) {
            var record;
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                fn(record);
            }
        };
        DefaultKeyValueDiffer.prototype.forEachChangedItem = function (fn) {
            var record;
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                fn(record);
            }
        };
        DefaultKeyValueDiffer.prototype.forEachAddedItem = function (fn) {
            var record;
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                fn(record);
            }
        };
        DefaultKeyValueDiffer.prototype.forEachRemovedItem = function (fn) {
            var record;
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                fn(record);
            }
        };
        DefaultKeyValueDiffer.prototype.diff = function (map) {
            if (isBlank(map))
                map = MapWrapper.createFromPairs([]);
            if (!(map instanceof Map || isJsObject(map))) {
                throw new BaseException("Error trying to diff '" + map + "'");
            }
            if (this.check(map)) {
                return this;
            }
            else {
                return null;
            }
        };
        DefaultKeyValueDiffer.prototype.onDestroy = function () { };
        DefaultKeyValueDiffer.prototype.check = function (map) {
            var _this = this;
            this._reset();
            var records = this._records;
            var oldSeqRecord = this._mapHead;
            var lastOldSeqRecord = null;
            var lastNewSeqRecord = null;
            var seqChanged = false;
            this._forEach(map, function (value, key) {
                var newSeqRecord;
                if (oldSeqRecord !== null && key === oldSeqRecord.key) {
                    newSeqRecord = oldSeqRecord;
                    if (!looseIdentical(value, oldSeqRecord.currentValue)) {
                        oldSeqRecord.previousValue = oldSeqRecord.currentValue;
                        oldSeqRecord.currentValue = value;
                        _this._addToChanges(oldSeqRecord);
                    }
                }
                else {
                    seqChanged = true;
                    if (oldSeqRecord !== null) {
                        oldSeqRecord._next = null;
                        _this._removeFromSeq(lastOldSeqRecord, oldSeqRecord);
                        _this._addToRemovals(oldSeqRecord);
                    }
                    if (records.has(key)) {
                        newSeqRecord = records.get(key);
                    }
                    else {
                        newSeqRecord = new KeyValueChangeRecord(key);
                        records.set(key, newSeqRecord);
                        newSeqRecord.currentValue = value;
                        _this._addToAdditions(newSeqRecord);
                    }
                }
                if (seqChanged) {
                    if (_this._isInRemovals(newSeqRecord)) {
                        _this._removeFromRemovals(newSeqRecord);
                    }
                    if (lastNewSeqRecord == null) {
                        _this._mapHead = newSeqRecord;
                    }
                    else {
                        lastNewSeqRecord._next = newSeqRecord;
                    }
                }
                lastOldSeqRecord = oldSeqRecord;
                lastNewSeqRecord = newSeqRecord;
                oldSeqRecord = oldSeqRecord === null ? null : oldSeqRecord._next;
            });
            this._truncate(lastOldSeqRecord, oldSeqRecord);
            return this.isDirty;
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._reset = function () {
            if (this.isDirty) {
                var record;
                // Record the state of the mapping
                for (record = this._previousMapHead = this._mapHead; record !== null; record = record._next) {
                    record._nextPrevious = record._next;
                }
                for (record = this._changesHead; record !== null; record = record._nextChanged) {
                    record.previousValue = record.currentValue;
                }
                for (record = this._additionsHead; record != null; record = record._nextAdded) {
                    record.previousValue = record.currentValue;
                }
                // todo(vicb) once assert is supported
                // assert(() {
                //  var r = _changesHead;
                //  while (r != null) {
                //    var nextRecord = r._nextChanged;
                //    r._nextChanged = null;
                //    r = nextRecord;
                //  }
                //
                //  r = _additionsHead;
                //  while (r != null) {
                //    var nextRecord = r._nextAdded;
                //    r._nextAdded = null;
                //    r = nextRecord;
                //  }
                //
                //  r = _removalsHead;
                //  while (r != null) {
                //    var nextRecord = r._nextRemoved;
                //    r._nextRemoved = null;
                //    r = nextRecord;
                //  }
                //
                //  return true;
                //});
                this._changesHead = this._changesTail = null;
                this._additionsHead = this._additionsTail = null;
                this._removalsHead = this._removalsTail = null;
            }
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._truncate = function (lastRecord, record) {
            while (record !== null) {
                if (lastRecord === null) {
                    this._mapHead = null;
                }
                else {
                    lastRecord._next = null;
                }
                var nextRecord = record._next;
                // todo(vicb) assert
                // assert((() {
                //  record._next = null;
                //  return true;
                //}));
                this._addToRemovals(record);
                lastRecord = record;
                record = nextRecord;
            }
            for (var rec = this._removalsHead; rec !== null; rec = rec._nextRemoved) {
                rec.previousValue = rec.currentValue;
                rec.currentValue = null;
                this._records.delete(rec.key);
            }
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._isInRemovals = function (record) {
            return record === this._removalsHead || record._nextRemoved !== null ||
                record._prevRemoved !== null;
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._addToRemovals = function (record) {
            // todo(vicb) assert
            // assert(record._next == null);
            // assert(record._nextAdded == null);
            // assert(record._nextChanged == null);
            // assert(record._nextRemoved == null);
            // assert(record._prevRemoved == null);
            if (this._removalsHead === null) {
                this._removalsHead = this._removalsTail = record;
            }
            else {
                this._removalsTail._nextRemoved = record;
                record._prevRemoved = this._removalsTail;
                this._removalsTail = record;
            }
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._removeFromSeq = function (prev, record) {
            var next = record._next;
            if (prev === null) {
                this._mapHead = next;
            }
            else {
                prev._next = next;
            }
            // todo(vicb) assert
            // assert((() {
            //  record._next = null;
            //  return true;
            //})());
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._removeFromRemovals = function (record) {
            // todo(vicb) assert
            // assert(record._next == null);
            // assert(record._nextAdded == null);
            // assert(record._nextChanged == null);
            var prev = record._prevRemoved;
            var next = record._nextRemoved;
            if (prev === null) {
                this._removalsHead = next;
            }
            else {
                prev._nextRemoved = next;
            }
            if (next === null) {
                this._removalsTail = prev;
            }
            else {
                next._prevRemoved = prev;
            }
            record._prevRemoved = record._nextRemoved = null;
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._addToAdditions = function (record) {
            // todo(vicb): assert
            // assert(record._next == null);
            // assert(record._nextAdded == null);
            // assert(record._nextChanged == null);
            // assert(record._nextRemoved == null);
            // assert(record._prevRemoved == null);
            if (this._additionsHead === null) {
                this._additionsHead = this._additionsTail = record;
            }
            else {
                this._additionsTail._nextAdded = record;
                this._additionsTail = record;
            }
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._addToChanges = function (record) {
            // todo(vicb) assert
            // assert(record._nextAdded == null);
            // assert(record._nextChanged == null);
            // assert(record._nextRemoved == null);
            // assert(record._prevRemoved == null);
            if (this._changesHead === null) {
                this._changesHead = this._changesTail = record;
            }
            else {
                this._changesTail._nextChanged = record;
                this._changesTail = record;
            }
        };
        DefaultKeyValueDiffer.prototype.toString = function () {
            var items = [];
            var previous = [];
            var changes = [];
            var additions = [];
            var removals = [];
            var record;
            for (record = this._mapHead; record !== null; record = record._next) {
                items.push(stringify(record));
            }
            for (record = this._previousMapHead; record !== null; record = record._nextPrevious) {
                previous.push(stringify(record));
            }
            for (record = this._changesHead; record !== null; record = record._nextChanged) {
                changes.push(stringify(record));
            }
            for (record = this._additionsHead; record !== null; record = record._nextAdded) {
                additions.push(stringify(record));
            }
            for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
                removals.push(stringify(record));
            }
            return "map: " + items.join(', ') + "\n" + "previous: " + previous.join(', ') + "\n" +
                "additions: " + additions.join(', ') + "\n" + "changes: " + changes.join(', ') + "\n" +
                "removals: " + removals.join(', ') + "\n";
        };
        /** @internal */
        DefaultKeyValueDiffer.prototype._forEach = function (obj, fn) {
            if (obj instanceof Map) {
                obj.forEach(fn);
            }
            else {
                StringMapWrapper.forEach(obj, fn);
            }
        };
        return DefaultKeyValueDiffer;
    }());
    var KeyValueChangeRecord = (function () {
        function KeyValueChangeRecord(key) {
            this.key = key;
            this.previousValue = null;
            this.currentValue = null;
            /** @internal */
            this._nextPrevious = null;
            /** @internal */
            this._next = null;
            /** @internal */
            this._nextAdded = null;
            /** @internal */
            this._nextRemoved = null;
            /** @internal */
            this._prevRemoved = null;
            /** @internal */
            this._nextChanged = null;
        }
        KeyValueChangeRecord.prototype.toString = function () {
            return looseIdentical(this.previousValue, this.currentValue) ?
                stringify(this.key) :
                (stringify(this.key) + '[' + stringify(this.previousValue) + '->' +
                stringify(this.currentValue) + ']');
        };
        return KeyValueChangeRecord;
    }());
    var ChangeDetectorRef = (function () {
        function ChangeDetectorRef() {
        }
        return ChangeDetectorRef;
    }());
    var uninitialized = new Object();
    function devModeEqual(a, b) {
        if (isListLikeIterable(a) && isListLikeIterable(b)) {
            return areIterablesEqual(a, b, devModeEqual);
        }
        else if (!isListLikeIterable(a) && !isPrimitive(a) && !isListLikeIterable(b) &&
            !isPrimitive(b)) {
            return true;
        }
        else {
            return looseIdentical(a, b);
        }
    }
    /**
     * Indicates that the result of a {@link PipeMetadata} transformation has changed even though the
     * reference
     * has not changed.
     *
     * The wrapped value will be unwrapped by change detection, and the unwrapped value will be stored.
     *
     * Example:
     *
     * ```
     * if (this._latestValue === this._latestReturnedValue) {
     *    return this._latestReturnedValue;
     *  } else {
     *    this._latestReturnedValue = this._latestValue;
     *    return WrappedValue.wrap(this._latestValue); // this will force update
     *  }
     * ```
     */
    var WrappedValue = (function () {
        function WrappedValue(wrapped) {
            this.wrapped = wrapped;
        }
        WrappedValue.wrap = function (value) { return new WrappedValue(value); };
        return WrappedValue;
    }());
    /**
     * Helper class for unwrapping WrappedValue s
     */
    var ValueUnwrapper = (function () {
        function ValueUnwrapper() {
            this.hasWrappedValue = false;
        }
        ValueUnwrapper.prototype.unwrap = function (value) {
            if (value instanceof WrappedValue) {
                this.hasWrappedValue = true;
                return value.wrapped;
            }
            return value;
        };
        ValueUnwrapper.prototype.reset = function () { this.hasWrappedValue = false; };
        return ValueUnwrapper;
    }());
    /**
     * Represents a basic change from a previous to a new value.
     */
    var SimpleChange = (function () {
        function SimpleChange(previousValue, currentValue) {
            this.previousValue = previousValue;
            this.currentValue = currentValue;
        }
        /**
         * Check whether the new value is the first value assigned.
         */
        SimpleChange.prototype.isFirstChange = function () { return this.previousValue === uninitialized; };
        return SimpleChange;
    }());
    /**
     * Structural diffing for `Object`s and `Map`s.
     */
    var keyValDiff =
        /*@ts2dart_const*/ [new DefaultKeyValueDifferFactory()];
    /**
     * Structural diffing for `Iterable` types such as `Array`s.
     */
    var iterableDiff =
        /*@ts2dart_const*/ [new DefaultIterableDifferFactory()];
    var defaultIterableDiffers = new IterableDiffers(iterableDiff);
    var defaultKeyValueDiffers = new KeyValueDiffers(keyValDiff);
    var RenderComponentType = (function () {
        function RenderComponentType(id, templateUrl, slotCount, encapsulation, styles) {
            this.id = id;
            this.templateUrl = templateUrl;
            this.slotCount = slotCount;
            this.encapsulation = encapsulation;
            this.styles = styles;
        }
        return RenderComponentType;
    }());
    var RenderDebugInfo = (function () {
        function RenderDebugInfo() {
        }
        Object.defineProperty(RenderDebugInfo.prototype, "injector", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "component", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "providerTokens", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "references", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "context", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderDebugInfo.prototype, "source", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return RenderDebugInfo;
    }());
    var Renderer = (function () {
        function Renderer() {
        }
        return Renderer;
    }());
    /**
     * Injectable service that provides a low-level interface for modifying the UI.
     *
     * Use this service to bypass Angular's templating and make custom UI changes that can't be
     * expressed declaratively. For example if you need to set a property or an attribute whose name is
     * not statically known, use {@link #setElementProperty} or {@link #setElementAttribute}
     * respectively.
     *
     * If you are implementing a custom renderer, you must implement this interface.
     *
     * The default Renderer implementation is `DomRenderer`. Also available is `WebWorkerRenderer`.
     */
    var RootRenderer = (function () {
        function RootRenderer() {
        }
        return RootRenderer;
    }());
    var ViewUtils = (function () {
        function ViewUtils(_renderer, _appId, sanitizer) {
            this._renderer = _renderer;
            this._appId = _appId;
            this._nextCompTypeId = 0;
            this.sanitizer = sanitizer;
        }
        /**
         * Used by the generated code
         */
        ViewUtils.prototype.createRenderComponentType = function (templateUrl, slotCount, encapsulation, styles) {
            return new RenderComponentType(this._appId + "-" + this._nextCompTypeId++, templateUrl, slotCount, encapsulation, styles);
        };
        /** @internal */
        ViewUtils.prototype.renderComponent = function (renderComponentType) {
            return this._renderer.renderComponent(renderComponentType);
        };
        return ViewUtils;
    }());
    ViewUtils.decorators = [
        { type: Injectable },
    ];
    ViewUtils.ctorParameters = [
        { type: RootRenderer, },
        { type: undefined, decorators: [{ type: Inject, args: [APP_ID,] },] },
        { type: SanitizationService, },
    ];
    function flattenNestedViewRenderNodes(nodes) {
        return _flattenNestedViewRenderNodes(nodes, []);
    }
    function _flattenNestedViewRenderNodes(nodes, renderNodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node instanceof AppElement) {
                var appEl = node;
                renderNodes.push(appEl.nativeElement);
                if (isPresent(appEl.nestedViews)) {
                    for (var k = 0; k < appEl.nestedViews.length; k++) {
                        _flattenNestedViewRenderNodes(appEl.nestedViews[k].rootNodesOrAppElements, renderNodes);
                    }
                }
            }
            else {
                renderNodes.push(node);
            }
        }
        return renderNodes;
    }
    var EMPTY_ARR = [];
    function ensureSlotCount(projectableNodes, expectedSlotCount) {
        var res;
        if (isBlank(projectableNodes)) {
            res = EMPTY_ARR;
        }
        else if (projectableNodes.length < expectedSlotCount) {
            var givenSlotCount = projectableNodes.length;
            res = ListWrapper.createFixedSize(expectedSlotCount);
            for (var i = 0; i < expectedSlotCount; i++) {
                res[i] = (i < givenSlotCount) ? projectableNodes[i] : EMPTY_ARR;
            }
        }
        else {
            res = projectableNodes;
        }
        return res;
    }
    var MAX_INTERPOLATION_VALUES = 9;
    function interpolate(valueCount, c0, a1, c1, a2, c2, a3, c3, a4, c4, a5, c5, a6, c6, a7, c7, a8, c8, a9, c9) {
        switch (valueCount) {
            case 1:
                return c0 + _toStringWithNull(a1) + c1;
            case 2:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2;
            case 3:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3;
            case 4:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3 + _toStringWithNull(a4) + c4;
            case 5:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5;
            case 6:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                    c6;
            case 7:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                    c6 + _toStringWithNull(a7) + c7;
            case 8:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                    c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8;
            case 9:
                return c0 + _toStringWithNull(a1) + c1 + _toStringWithNull(a2) + c2 + _toStringWithNull(a3) +
                    c3 + _toStringWithNull(a4) + c4 + _toStringWithNull(a5) + c5 + _toStringWithNull(a6) +
                    c6 + _toStringWithNull(a7) + c7 + _toStringWithNull(a8) + c8 + _toStringWithNull(a9) +
                    c9;
            default:
                throw new BaseException("Does not support more than 9 expressions");
        }
    }
    function _toStringWithNull(v) {
        return v != null ? v.toString() : '';
    }
    function checkBinding(throwOnChange, oldValue, newValue) {
        if (throwOnChange) {
            if (!devModeEqual(oldValue, newValue)) {
                throw new ExpressionChangedAfterItHasBeenCheckedException(oldValue, newValue, null);
            }
            return false;
        }
        else {
            return !looseIdentical(oldValue, newValue);
        }
    }
    function castByValue(input, value) {
        return input;
    }
    var EMPTY_ARRAY = [];
    var EMPTY_MAP = {};
    function pureProxy1(fn) {
        var result;
        var v0;
        v0 = uninitialized;
        return function (p0) {
            if (!looseIdentical(v0, p0)) {
                v0 = p0;
                result = fn(p0);
            }
            return result;
        };
    }
    function pureProxy2(fn) {
        var result;
        var v0, v1;
        v0 = v1 = uninitialized;
        return function (p0, p1) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1)) {
                v0 = p0;
                v1 = p1;
                result = fn(p0, p1);
            }
            return result;
        };
    }
    function pureProxy3(fn) {
        var result;
        var v0, v1, v2;
        v0 = v1 = v2 = uninitialized;
        return function (p0, p1, p2) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                result = fn(p0, p1, p2);
            }
            return result;
        };
    }
    function pureProxy4(fn) {
        var result;
        var v0, v1, v2, v3;
        v0 = v1 = v2 = v3 = uninitialized;
        return function (p0, p1, p2, p3) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                result = fn(p0, p1, p2, p3);
            }
            return result;
        };
    }
    function pureProxy5(fn) {
        var result;
        var v0, v1, v2, v3, v4;
        v0 = v1 = v2 = v3 = v4 = uninitialized;
        return function (p0, p1, p2, p3, p4) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3) || !looseIdentical(v4, p4)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                v4 = p4;
                result = fn(p0, p1, p2, p3, p4);
            }
            return result;
        };
    }
    function pureProxy6(fn) {
        var result;
        var v0, v1, v2, v3, v4, v5;
        v0 = v1 = v2 = v3 = v4 = v5 = uninitialized;
        return function (p0, p1, p2, p3, p4, p5) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                v4 = p4;
                v5 = p5;
                result = fn(p0, p1, p2, p3, p4, p5);
            }
            return result;
        };
    }
    function pureProxy7(fn) {
        var result;
        var v0, v1, v2, v3, v4, v5, v6;
        v0 = v1 = v2 = v3 = v4 = v5 = v6 = uninitialized;
        return function (p0, p1, p2, p3, p4, p5, p6) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
                !looseIdentical(v6, p6)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                v4 = p4;
                v5 = p5;
                v6 = p6;
                result = fn(p0, p1, p2, p3, p4, p5, p6);
            }
            return result;
        };
    }
    function pureProxy8(fn) {
        var result;
        var v0, v1, v2, v3, v4, v5, v6, v7;
        v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = uninitialized;
        return function (p0, p1, p2, p3, p4, p5, p6, p7) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
                !looseIdentical(v6, p6) || !looseIdentical(v7, p7)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                v4 = p4;
                v5 = p5;
                v6 = p6;
                v7 = p7;
                result = fn(p0, p1, p2, p3, p4, p5, p6, p7);
            }
            return result;
        };
    }
    function pureProxy9(fn) {
        var result;
        var v0, v1, v2, v3, v4, v5, v6, v7, v8;
        v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = uninitialized;
        return function (p0, p1, p2, p3, p4, p5, p6, p7, p8) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
                !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                v4 = p4;
                v5 = p5;
                v6 = p6;
                v7 = p7;
                v8 = p8;
                result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8);
            }
            return result;
        };
    }
    function pureProxy10(fn) {
        var result;
        var v0, v1, v2, v3, v4, v5, v6, v7, v8, v9;
        v0 = v1 = v2 = v3 = v4 = v5 = v6 = v7 = v8 = v9 = uninitialized;
        return function (p0, p1, p2, p3, p4, p5, p6, p7, p8, p9) {
            if (!looseIdentical(v0, p0) || !looseIdentical(v1, p1) || !looseIdentical(v2, p2) ||
                !looseIdentical(v3, p3) || !looseIdentical(v4, p4) || !looseIdentical(v5, p5) ||
                !looseIdentical(v6, p6) || !looseIdentical(v7, p7) || !looseIdentical(v8, p8) ||
                !looseIdentical(v9, p9)) {
                v0 = p0;
                v1 = p1;
                v2 = p2;
                v3 = p3;
                v4 = p4;
                v5 = p5;
                v6 = p6;
                v7 = p7;
                v8 = p8;
                v9 = p9;
                result = fn(p0, p1, p2, p3, p4, p5, p6, p7, p8, p9);
            }
            return result;
        };
    }
    /**
     * Represents an instance of a Component created via a {@link ComponentFactory}.
     *
     * `ComponentRef` provides access to the Component Instance as well other objects related to this
     * Component Instance and allows you to destroy the Component Instance via the {@link #destroy}
     * method.
     */
    var ComponentRef = (function () {
        function ComponentRef() {
        }
        Object.defineProperty(ComponentRef.prototype, "location", {
            /**
             * Location of the Host Element of this Component Instance.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef.prototype, "injector", {
            /**
             * The injector on which the component instance exists.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef.prototype, "instance", {
            /**
             * The instance of the Component.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ComponentRef.prototype, "hostView", {
            /**
             * The {@link ViewRef} of the Host View of this Component instance.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ComponentRef.prototype, "changeDetectorRef", {
            /**
             * The {@link ChangeDetectorRef} of the Component instance.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef.prototype, "componentType", {
            /**
             * The component type.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return ComponentRef;
    }());
    var ComponentRef_ = (function (_super) {
        __extends(ComponentRef_, _super);
        function ComponentRef_(_hostElement, _componentType) {
            _super.call(this);
            this._hostElement = _hostElement;
            this._componentType = _componentType;
        }
        Object.defineProperty(ComponentRef_.prototype, "location", {
            get: function () { return this._hostElement.elementRef; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef_.prototype, "injector", {
            get: function () { return this._hostElement.injector; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComponentRef_.prototype, "instance", {
            get: function () { return this._hostElement.component; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ComponentRef_.prototype, "hostView", {
            get: function () { return this._hostElement.parentView.ref; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ComponentRef_.prototype, "changeDetectorRef", {
            get: function () { return this._hostElement.parentView.ref; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ComponentRef_.prototype, "componentType", {
            get: function () { return this._componentType; },
            enumerable: true,
            configurable: true
        });
        ComponentRef_.prototype.destroy = function () { this._hostElement.parentView.destroy(); };
        ComponentRef_.prototype.onDestroy = function (callback) { this.hostView.onDestroy(callback); };
        return ComponentRef_;
    }(ComponentRef));
    var EMPTY_CONTEXT = new Object();
    /*@ts2dart_const*/
    var ComponentFactory = (function () {
        function ComponentFactory(selector, _viewFactory, _componentType) {
            this.selector = selector;
            this._viewFactory = _viewFactory;
            this._componentType = _componentType;
        }
        Object.defineProperty(ComponentFactory.prototype, "componentType", {
            get: function () { return this._componentType; },
            enumerable: true,
            configurable: true
        });
        /**
         * Creates a new component.
         */
        ComponentFactory.prototype.create = function (injector, projectableNodes, rootSelectorOrNode) {
            if (projectableNodes === void 0) { projectableNodes = null; }
            if (rootSelectorOrNode === void 0) { rootSelectorOrNode = null; }
            var vu = injector.get(ViewUtils);
            if (isBlank(projectableNodes)) {
                projectableNodes = [];
            }
            // Note: Host views don't need a declarationAppElement!
            var hostView = this._viewFactory(vu, injector, null);
            var hostElement = hostView.create(EMPTY_CONTEXT, projectableNodes, rootSelectorOrNode);
            return new ComponentRef_(hostElement, this._componentType);
        };
        return ComponentFactory;
    }());
    /**
     * Low-level service for loading {@link ComponentFactory}s, which
     * can later be used to create and render a Component instance.
     */
    var ComponentResolver = (function () {
        function ComponentResolver() {
        }
        return ComponentResolver;
    }());
    function _isComponentFactory(type) {
        return type instanceof ComponentFactory;
    }
    var ReflectorComponentResolver = (function (_super) {
        __extends(ReflectorComponentResolver, _super);
        function ReflectorComponentResolver() {
            _super.apply(this, arguments);
        }
        ReflectorComponentResolver.prototype.resolveComponent = function (componentType) {
            var metadatas = reflector.annotations(componentType);
            var componentFactory = metadatas.find(_isComponentFactory);
            if (isBlank(componentFactory)) {
                throw new BaseException("No precompiled component " + stringify(componentType) + " found");
            }
            return PromiseWrapper.resolve(componentFactory);
        };
        ReflectorComponentResolver.prototype.clearCache = function () { };
        return ReflectorComponentResolver;
    }(ComponentResolver));
    ReflectorComponentResolver.decorators = [
        { type: Injectable },
    ];
    // Note: Need to rename warn as in Dart
    // class members and imports can't use the same name.
    var _warnImpl = warn;
    var Console = (function () {
        function Console() {
        }
        Console.prototype.log = function (message) { print(message); };
        // Note: for reporting errors use `DOM.logError()` as it is platform specific
        Console.prototype.warn = function (message) { _warnImpl(message); };
        return Console;
    }());
    Console.decorators = [
        { type: Injectable },
    ];
    /**
     * Create an Angular zone.
     */
    function createNgZone() {
        return new NgZone({ enableLongStackTrace: assertionsEnabled() });
    }
    var _platform;
    var _inPlatformCreate = false;
    /**
     * Creates a platform.
     * Platforms have to be eagerly created via this function.
     */
    function createPlatform(injector) {
        if (_inPlatformCreate) {
            throw new BaseException('Already creating a platform...');
        }
        if (isPresent(_platform) && !_platform.disposed) {
            throw new BaseException("There can be only one platform. Destroy the previous one to create a new one.");
        }
        lockMode();
        _inPlatformCreate = true;
        try {
            _platform = injector.get(PlatformRef);
        }
        finally {
            _inPlatformCreate = false;
        }
        return _platform;
    }
    /**
     * Checks that there currently is a platform
     * which contains the given token as a provider.
     */
    function assertPlatform(requiredToken) {
        var platform = getPlatform();
        if (isBlank(platform)) {
            throw new BaseException('Not platform exists!');
        }
        if (isPresent(platform) && isBlank(platform.injector.get(requiredToken, null))) {
            throw new BaseException('A platform with a different configuration has been created. Please destroy it first.');
        }
        return platform;
    }
    /**
     * Dispose the existing platform.
     */
    function disposePlatform() {
        if (isPresent(_platform) && !_platform.disposed) {
            _platform.dispose();
        }
    }
    /**
     * Returns the current platform.
     */
    function getPlatform() {
        return isPresent(_platform) && !_platform.disposed ? _platform : null;
    }
    /**
     * Shortcut for ApplicationRef.bootstrap.
     * Requires a platform the be created first.
     */
    function coreBootstrap(injector, componentFactory) {
        var appRef = injector.get(ApplicationRef);
        return appRef.bootstrap(componentFactory);
    }
    /**
     * Resolves the componentFactory for the given component,
     * waits for asynchronous initializers and bootstraps the component.
     * Requires a platform the be created first.
     */
    function coreLoadAndBootstrap(injector, componentType) {
        var appRef = injector.get(ApplicationRef);
        return appRef.run(function () {
            var componentResolver = injector.get(ComponentResolver);
            return PromiseWrapper
                .all([componentResolver.resolveComponent(componentType), appRef.waitForAsyncInitializers()])
                .then(function (arr) { return appRef.bootstrap(arr[0]); });
        });
    }
    /**
     * The Angular platform is the entry point for Angular on a web page. Each page
     * has exactly one platform, and services (such as reflection) which are common
     * to every Angular application running on the page are bound in its scope.
     *
     * A page's platform is initialized implicitly when {@link bootstrap}() is called, or
     * explicitly by calling {@link createPlatform}().
     */
    var PlatformRef = (function () {
        function PlatformRef() {
        }
        Object.defineProperty(PlatformRef.prototype, "injector", {
            /**
             * Retrieve the platform {@link Injector}, which is the parent injector for
             * every Angular application on the page and provides singleton providers.
             */
            get: function () { throw unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(PlatformRef.prototype, "disposed", {
            get: function () { throw unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return PlatformRef;
    }());
    var PlatformRef_ = (function (_super) {
        __extends(PlatformRef_, _super);
        function PlatformRef_(_injector) {
            _super.call(this);
            this._injector = _injector;
            /** @internal */
            this._applications = [];
            /** @internal */
            this._disposeListeners = [];
            this._disposed = false;
            if (!_inPlatformCreate) {
                throw new BaseException('Platforms have to be created via `createPlatform`!');
            }
            var inits = _injector.get(PLATFORM_INITIALIZER, null);
            if (isPresent(inits))
                inits.forEach(function (init) { return init(); });
        }
        PlatformRef_.prototype.registerDisposeListener = function (dispose) { this._disposeListeners.push(dispose); };
        Object.defineProperty(PlatformRef_.prototype, "injector", {
            get: function () { return this._injector; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformRef_.prototype, "disposed", {
            get: function () { return this._disposed; },
            enumerable: true,
            configurable: true
        });
        PlatformRef_.prototype.addApplication = function (appRef) { this._applications.push(appRef); };
        PlatformRef_.prototype.dispose = function () {
            ListWrapper.clone(this._applications).forEach(function (app) { return app.dispose(); });
            this._disposeListeners.forEach(function (dispose) { return dispose(); });
            this._disposed = true;
        };
        /** @internal */
        PlatformRef_.prototype._applicationDisposed = function (app) { ListWrapper.remove(this._applications, app); };
        return PlatformRef_;
    }(PlatformRef));
    PlatformRef_.decorators = [
        { type: Injectable },
    ];
    PlatformRef_.ctorParameters = [
        { type: Injector, },
    ];
    /**
     * A reference to an Angular application running on a page.
     *
     * For more about Angular applications, see the documentation for {@link bootstrap}.
     */
    var ApplicationRef = (function () {
        function ApplicationRef() {
        }
        Object.defineProperty(ApplicationRef.prototype, "injector", {
            /**
             * Retrieve the application {@link Injector}.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ApplicationRef.prototype, "zone", {
            /**
             * Retrieve the application {@link NgZone}.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(ApplicationRef.prototype, "componentTypes", {
            /**
             * Get a list of component types registered to this application.
             */
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        return ApplicationRef;
    }());
    var ApplicationRef_ = (function (_super) {
        __extends(ApplicationRef_, _super);
        function ApplicationRef_(_platform, _zone, _injector) {
            var _this = this;
            _super.call(this);
            this._platform = _platform;
            this._zone = _zone;
            this._injector = _injector;
            /** @internal */
            this._bootstrapListeners = [];
            /** @internal */
            this._disposeListeners = [];
            /** @internal */
            this._rootComponents = [];
            /** @internal */
            this._rootComponentTypes = [];
            /** @internal */
            this._changeDetectorRefs = [];
            /** @internal */
            this._runningTick = false;
            /** @internal */
            this._enforceNoNewChanges = false;
            var zone = _injector.get(NgZone);
            this._enforceNoNewChanges = assertionsEnabled();
            zone.run(function () { _this._exceptionHandler = _injector.get(ExceptionHandler); });
            this._asyncInitDonePromise = this.run(function () {
                var inits = _injector.get(APP_INITIALIZER, null);
                var asyncInitResults = [];
                var asyncInitDonePromise;
                if (isPresent(inits)) {
                    for (var i = 0; i < inits.length; i++) {
                        var initResult = inits[i]();
                        if (isPromise(initResult)) {
                            asyncInitResults.push(initResult);
                        }
                    }
                }
                if (asyncInitResults.length > 0) {
                    asyncInitDonePromise =
                        PromiseWrapper.all(asyncInitResults).then(function (_) { return _this._asyncInitDone = true; });
                    _this._asyncInitDone = false;
                }
                else {
                    _this._asyncInitDone = true;
                    asyncInitDonePromise = PromiseWrapper.resolve(true);
                }
                return asyncInitDonePromise;
            });
            ObservableWrapper.subscribe(zone.onError, function (error) {
                _this._exceptionHandler.call(error.error, error.stackTrace);
            });
            ObservableWrapper.subscribe(this._zone.onMicrotaskEmpty, function (_) { _this._zone.run(function () { _this.tick(); }); });
        }
        ApplicationRef_.prototype.registerBootstrapListener = function (listener) {
            this._bootstrapListeners.push(listener);
        };
        ApplicationRef_.prototype.registerDisposeListener = function (dispose) { this._disposeListeners.push(dispose); };
        ApplicationRef_.prototype.registerChangeDetector = function (changeDetector) {
            this._changeDetectorRefs.push(changeDetector);
        };
        ApplicationRef_.prototype.unregisterChangeDetector = function (changeDetector) {
            ListWrapper.remove(this._changeDetectorRefs, changeDetector);
        };
        ApplicationRef_.prototype.waitForAsyncInitializers = function () { return this._asyncInitDonePromise; };
        ApplicationRef_.prototype.run = function (callback) {
            var _this = this;
            var zone = this.injector.get(NgZone);
            var result;
            // Note: Don't use zone.runGuarded as we want to know about
            // the thrown exception!
            // Note: the completer needs to be created outside
            // of `zone.run` as Dart swallows rejected promises
            // via the onError callback of the promise.
            var completer = PromiseWrapper.completer();
            zone.run(function () {
                try {
                    result = callback();
                    if (isPromise(result)) {
                        PromiseWrapper.then(result, function (ref) { completer.resolve(ref); }, function (err, stackTrace) {
                            completer.reject(err, stackTrace);
                            _this._exceptionHandler.call(err, stackTrace);
                        });
                    }
                }
                catch (e) {
                    _this._exceptionHandler.call(e, e.stack);
                    throw e;
                }
            });
            return isPromise(result) ? completer.promise : result;
        };
        ApplicationRef_.prototype.bootstrap = function (componentFactory) {
            var _this = this;
            if (!this._asyncInitDone) {
                throw new BaseException('Cannot bootstrap as there are still asynchronous initializers running. Wait for them using waitForAsyncInitializers().');
            }
            return this.run(function () {
                _this._rootComponentTypes.push(componentFactory.componentType);
                var compRef = componentFactory.create(_this._injector, [], componentFactory.selector);
                compRef.onDestroy(function () { _this._unloadComponent(compRef); });
                var testability = compRef.injector.get(Testability, null);
                if (isPresent(testability)) {
                    compRef.injector.get(TestabilityRegistry)
                        .registerApplication(compRef.location.nativeElement, testability);
                }
                _this._loadComponent(compRef);
                var c = _this._injector.get(Console);
                if (assertionsEnabled()) {
                    c.log("Angular 2 is running in the development mode. Call enableProdMode() to enable the production mode.");
                }
                return compRef;
            });
        };
        /** @internal */
        ApplicationRef_.prototype._loadComponent = function (componentRef) {
            this._changeDetectorRefs.push(componentRef.changeDetectorRef);
            this.tick();
            this._rootComponents.push(componentRef);
            this._bootstrapListeners.forEach(function (listener) { return listener(componentRef); });
        };
        /** @internal */
        ApplicationRef_.prototype._unloadComponent = function (componentRef) {
            if (!ListWrapper.contains(this._rootComponents, componentRef)) {
                return;
            }
            this.unregisterChangeDetector(componentRef.changeDetectorRef);
            ListWrapper.remove(this._rootComponents, componentRef);
        };
        Object.defineProperty(ApplicationRef_.prototype, "injector", {
            get: function () { return this._injector; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ApplicationRef_.prototype, "zone", {
            get: function () { return this._zone; },
            enumerable: true,
            configurable: true
        });
        ApplicationRef_.prototype.tick = function () {
            if (this._runningTick) {
                throw new BaseException("ApplicationRef.tick is called recursively");
            }
            var s = ApplicationRef_._tickScope();
            try {
                this._runningTick = true;
                this._changeDetectorRefs.forEach(function (detector) { return detector.detectChanges(); });
                if (this._enforceNoNewChanges) {
                    this._changeDetectorRefs.forEach(function (detector) { return detector.checkNoChanges(); });
                }
            }
            finally {
                this._runningTick = false;
                wtfLeave(s);
            }
        };
        ApplicationRef_.prototype.dispose = function () {
            // TODO(alxhub): Dispose of the NgZone.
            ListWrapper.clone(this._rootComponents).forEach(function (ref) { return ref.destroy(); });
            this._disposeListeners.forEach(function (dispose) { return dispose(); });
            this._platform._applicationDisposed(this);
        };
        Object.defineProperty(ApplicationRef_.prototype, "componentTypes", {
            get: function () { return this._rootComponentTypes; },
            enumerable: true,
            configurable: true
        });
        return ApplicationRef_;
    }(ApplicationRef));
    /** @internal */
    ApplicationRef_._tickScope = wtfCreateScope('ApplicationRef#tick()');
    ApplicationRef_.decorators = [
        { type: Injectable },
    ];
    ApplicationRef_.ctorParameters = [
        { type: PlatformRef_, },
        { type: NgZone, },
        { type: Injector, },
    ];
    /**
     * @internal
     */
    var PLATFORM_CORE_PROVIDERS =
        /*@ts2dart_const*/ [
        PlatformRef_,
        /*@ts2dart_const*/ (
            /* @ts2dart_Provider */ { provide: PlatformRef, useExisting: PlatformRef_ })
    ];
    /**
     * @internal
     */
    var APPLICATION_CORE_PROVIDERS = [
        /* @ts2dart_Provider */ { provide: NgZone, useFactory: createNgZone, deps: [] },
        ApplicationRef_,
        /* @ts2dart_Provider */ { provide: ApplicationRef, useExisting: ApplicationRef_ }
    ];
    /**
     * An unmodifiable list of items that Angular keeps up to date when the state
     * of the application changes.
     *
     * The type of object that {@link QueryMetadata} and {@link ViewQueryMetadata} provide.
     *
     * Implements an iterable interface, therefore it can be used in both ES6
     * javascript `for (var i of items)` loops as well as in Angular templates with
     * `*ngFor="let i of myList"`.
     *
     * Changes can be observed by subscribing to the changes `Observable`.
     *
     * NOTE: In the future this class will implement an `Observable` interface.
     *
     * ### Example ([live demo](http://plnkr.co/edit/RX8sJnQYl9FWuSCWme5z?p=preview))
     * ```typescript
     * @Component({...})
     * class Container {
     *   constructor(@Query(Item) items: QueryList<Item>) {
     *     items.changes.subscribe(_ => console.log(items.length));
     *   }
     * }
     * ```
     */
    var QueryList = (function () {
        function QueryList() {
            this._dirty = true;
            this._results = [];
            this._emitter = new EventEmitter();
        }
        Object.defineProperty(QueryList.prototype, "changes", {
            get: function () { return this._emitter; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryList.prototype, "length", {
            get: function () { return this._results.length; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryList.prototype, "first", {
            get: function () { return ListWrapper.first(this._results); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QueryList.prototype, "last", {
            get: function () { return ListWrapper.last(this._results); },
            enumerable: true,
            configurable: true
        });
        /**
         * returns a new array with the passed in function applied to each element.
         */
        QueryList.prototype.map = function (fn) { return this._results.map(fn); };
        /**
         * returns a filtered array.
         */
        QueryList.prototype.filter = function (fn) { return this._results.filter(fn); };
        /**
         * returns a reduced value.
         */
        QueryList.prototype.reduce = function (fn, init) { return this._results.reduce(fn, init); };
        /**
         * executes function for each element in a query.
         */
        QueryList.prototype.forEach = function (fn) { this._results.forEach(fn); };
        /**
         * converts QueryList into an array
         */
        QueryList.prototype.toArray = function () { return ListWrapper.clone(this._results); };
        QueryList.prototype[getSymbolIterator()] = function () { return this._results[getSymbolIterator()](); };
        QueryList.prototype.toString = function () { return this._results.toString(); };
        /**
         * @internal
         */
        QueryList.prototype.reset = function (res) {
            this._results = ListWrapper.flatten(res);
            this._dirty = false;
        };
        /** @internal */
        QueryList.prototype.notifyOnChanges = function () { this._emitter.emit(this); };
        /** internal */
        QueryList.prototype.setDirty = function () { this._dirty = true; };
        Object.defineProperty(QueryList.prototype, "dirty", {
            /** internal */
            get: function () { return this._dirty; },
            enumerable: true,
            configurable: true
        });
        return QueryList;
    }());
    /**
     * Use ComponentResolver and ViewContainerRef directly.
     *
     * @deprecated
     */
    var DynamicComponentLoader = (function () {
        function DynamicComponentLoader() {
        }
        return DynamicComponentLoader;
    }());
    var DynamicComponentLoader_ = (function (_super) {
        __extends(DynamicComponentLoader_, _super);
        function DynamicComponentLoader_(_compiler) {
            _super.call(this);
            this._compiler = _compiler;
        }
        DynamicComponentLoader_.prototype.loadAsRoot = function (type, overrideSelectorOrNode, injector, onDispose, projectableNodes) {
            return this._compiler.resolveComponent(type).then(function (componentFactory) {
                var componentRef = componentFactory.create(injector, projectableNodes, isPresent(overrideSelectorOrNode) ? overrideSelectorOrNode : componentFactory.selector);
                if (isPresent(onDispose)) {
                    componentRef.onDestroy(onDispose);
                }
                return componentRef;
            });
        };
        DynamicComponentLoader_.prototype.loadNextToLocation = function (type, location, providers, projectableNodes) {
            if (providers === void 0) { providers = null; }
            if (projectableNodes === void 0) { projectableNodes = null; }
            return this._compiler.resolveComponent(type).then(function (componentFactory) {
                var contextInjector = location.parentInjector;
                var childInjector = isPresent(providers) && providers.length > 0 ?
                    ReflectiveInjector.fromResolvedProviders(providers, contextInjector) :
                    contextInjector;
                return location.createComponent(componentFactory, location.length, childInjector, projectableNodes);
            });
        };
        return DynamicComponentLoader_;
    }(DynamicComponentLoader));
    DynamicComponentLoader_.decorators = [
        { type: Injectable },
    ];
    DynamicComponentLoader_.ctorParameters = [
        { type: ComponentResolver, },
    ];
    var EMPTY_CONTEXT$1 = new Object();
    /**
     * Represents an Embedded Template that can be used to instantiate Embedded Views.
     *
     * You can access a `TemplateRef`, in two ways. Via a directive placed on a `<template>` element (or
     * directive prefixed with `*`) and have the `TemplateRef` for this Embedded View injected into the
     * constructor of the directive using the `TemplateRef` Token. Alternatively you can query for the
     * `TemplateRef` from a Component or a Directive via {@link Query}.
     *
     * To instantiate Embedded Views based on a Template, use
     * {@link ViewContainerRef#createEmbeddedView}, which will create the View and attach it to the
     * View Container.
     */
    var TemplateRef = (function () {
        function TemplateRef() {
        }
        Object.defineProperty(TemplateRef.prototype, "elementRef", {
            /**
             * The location in the View where the Embedded View logically belongs to.
             *
             * The data-binding and injection contexts of Embedded Views created from this `TemplateRef`
             * inherit from the contexts of this location.
             *
             * Typically new Embedded Views are attached to the View Container of this location, but in
             * advanced use-cases, the View can be attached to a different container while keeping the
             * data-binding and injection context from the original location.
             *
             */
            // TODO(i): rename to anchor or location
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        return TemplateRef;
    }());
    var TemplateRef_ = (function (_super) {
        __extends(TemplateRef_, _super);
        function TemplateRef_(_appElement, _viewFactory) {
            _super.call(this);
            this._appElement = _appElement;
            this._viewFactory = _viewFactory;
        }
        TemplateRef_.prototype.createEmbeddedView = function (context) {
            var view = this._viewFactory(this._appElement.parentView.viewUtils, this._appElement.parentInjector, this._appElement);
            if (isBlank(context)) {
                context = EMPTY_CONTEXT$1;
            }
            view.create(context, null, null);
            return view.ref;
        };
        Object.defineProperty(TemplateRef_.prototype, "elementRef", {
            get: function () { return this._appElement.elementRef; },
            enumerable: true,
            configurable: true
        });
        return TemplateRef_;
    }(TemplateRef));
    var ViewRef = (function () {
        function ViewRef() {
        }
        Object.defineProperty(ViewRef.prototype, "destroyed", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        return ViewRef;
    }());
    /**
     * Represents an Angular View.
     *
     * <!-- TODO: move the next two paragraphs to the dev guide -->
     * A View is a fundamental building block of the application UI. It is the smallest grouping of
     * Elements which are created and destroyed together.
     *
     * Properties of elements in a View can change, but the structure (number and order) of elements in
     * a View cannot. Changing the structure of Elements can only be done by inserting, moving or
     * removing nested Views via a {@link ViewContainerRef}. Each View can contain many View Containers.
     * <!-- /TODO -->
     *
     * ### Example
     *
     * Given this template...
     *
     * ```
     * Count: {{items.length}}
     * <ul>
     *   <li *ngFor="let  item of items">{{item}}</li>
     * </ul>
     * ```
     *
     * ... we have two {@link TemplateRef}s:
     *
     * Outer {@link TemplateRef}:
     * ```
     * Count: {{items.length}}
     * <ul>
     *   <template ngFor let-item [ngForOf]="items"></template>
     * </ul>
     * ```
     *
     * Inner {@link TemplateRef}:
     * ```
     *   <li>{{item}}</li>
     * ```
     *
     * Notice that the original template is broken down into two separate {@link TemplateRef}s.
     *
     * The outer/inner {@link TemplateRef}s are then assembled into views like so:
     *
     * ```
     * <!-- ViewRef: outer-0 -->
     * Count: 2
     * <ul>
     *   <template view-container-ref></template>
     *   <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
     *   <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
     * </ul>
     * <!-- /ViewRef: outer-0 -->
     * ```
     */
    var EmbeddedViewRef = (function (_super) {
        __extends(EmbeddedViewRef, _super);
        function EmbeddedViewRef() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(EmbeddedViewRef.prototype, "context", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmbeddedViewRef.prototype, "rootNodes", {
            get: function () { return unimplemented(); },
            enumerable: true,
            configurable: true
        });
        ;
        return EmbeddedViewRef;
    }(ViewRef));
    var ViewRef_ = (function () {
        function ViewRef_(_view) {
            this._view = _view;
            this._view = _view;
        }
        Object.defineProperty(ViewRef_.prototype, "internalView", {
            get: function () { return this._view; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "rootNodes", {
            get: function () { return this._view.flatRootNodes; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "context", {
            get: function () { return this._view.context; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewRef_.prototype, "destroyed", {
            get: function () { return this._view.destroyed; },
            enumerable: true,
            configurable: true
        });
        ViewRef_.prototype.markForCheck = function () { this._view.markPathToRootAsCheckOnce(); };
        ViewRef_.prototype.detach = function () { this._view.cdMode = exports.ChangeDetectionStrategy.Detached; };
        ViewRef_.prototype.detectChanges = function () { this._view.detectChanges(false); };
        ViewRef_.prototype.checkNoChanges = function () { this._view.detectChanges(true); };
        ViewRef_.prototype.reattach = function () {
            this._view.cdMode = exports.ChangeDetectionStrategy.CheckAlways;
            this.markForCheck();
        };
        ViewRef_.prototype.onDestroy = function (callback) { this._view.disposables.push(callback); };
        ViewRef_.prototype.destroy = function () { this._view.destroy(); };
        return ViewRef_;
    }());
    var EventListener = (function () {
        function EventListener(name, callback) {
            this.name = name;
            this.callback = callback;
        }
        ;
        return EventListener;
    }());
    var DebugNode = (function () {
        function DebugNode(nativeNode, parent, _debugInfo) {
            this._debugInfo = _debugInfo;
            this.nativeNode = nativeNode;
            if (isPresent(parent) && parent instanceof DebugElement) {
                parent.addChild(this);
            }
            else {
                this.parent = null;
            }
            this.listeners = [];
        }
        Object.defineProperty(DebugNode.prototype, "injector", {
            get: function () { return isPresent(this._debugInfo) ? this._debugInfo.injector : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "componentInstance", {
            get: function () {
                return isPresent(this._debugInfo) ? this._debugInfo.component : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "context", {
            get: function () { return isPresent(this._debugInfo) ? this._debugInfo.context : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "references", {
            get: function () {
                return isPresent(this._debugInfo) ? this._debugInfo.references : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "providerTokens", {
            get: function () {
                return isPresent(this._debugInfo) ? this._debugInfo.providerTokens : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugNode.prototype, "source", {
            get: function () { return isPresent(this._debugInfo) ? this._debugInfo.source : null; },
            enumerable: true,
            configurable: true
        });
        /**
         * Use injector.get(token) instead.
         *
         * @deprecated
         */
        DebugNode.prototype.inject = function (token) { return this.injector.get(token); };
        return DebugNode;
    }());
    var DebugElement = (function (_super) {
        __extends(DebugElement, _super);
        function DebugElement(nativeNode, parent, _debugInfo) {
            _super.call(this, nativeNode, parent, _debugInfo);
            this.properties = {};
            this.attributes = {};
            this.childNodes = [];
            this.nativeElement = nativeNode;
        }
        DebugElement.prototype.addChild = function (child) {
            if (isPresent(child)) {
                this.childNodes.push(child);
                child.parent = this;
            }
        };
        DebugElement.prototype.removeChild = function (child) {
            var childIndex = this.childNodes.indexOf(child);
            if (childIndex !== -1) {
                child.parent = null;
                this.childNodes.splice(childIndex, 1);
            }
        };
        DebugElement.prototype.insertChildrenAfter = function (child, newChildren) {
            var siblingIndex = this.childNodes.indexOf(child);
            if (siblingIndex !== -1) {
                var previousChildren = this.childNodes.slice(0, siblingIndex + 1);
                var nextChildren = this.childNodes.slice(siblingIndex + 1);
                this.childNodes =
                    ListWrapper.concat(ListWrapper.concat(previousChildren, newChildren), nextChildren);
                for (var i = 0; i < newChildren.length; ++i) {
                    var newChild = newChildren[i];
                    if (isPresent(newChild.parent)) {
                        newChild.parent.removeChild(newChild);
                    }
                    newChild.parent = this;
                }
            }
        };
        DebugElement.prototype.query = function (predicate) {
            var results = this.queryAll(predicate);
            return results.length > 0 ? results[0] : null;
        };
        DebugElement.prototype.queryAll = function (predicate) {
            var matches = [];
            _queryElementChildren(this, predicate, matches);
            return matches;
        };
        DebugElement.prototype.queryAllNodes = function (predicate) {
            var matches = [];
            _queryNodeChildren(this, predicate, matches);
            return matches;
        };
        Object.defineProperty(DebugElement.prototype, "children", {
            get: function () {
                var children = [];
                this.childNodes.forEach(function (node) {
                    if (node instanceof DebugElement) {
                        children.push(node);
                    }
                });
                return children;
            },
            enumerable: true,
            configurable: true
        });
        DebugElement.prototype.triggerEventHandler = function (eventName, eventObj) {
            this.listeners.forEach(function (listener) {
                if (listener.name == eventName) {
                    listener.callback(eventObj);
                }
            });
        };
        return DebugElement;
    }(DebugNode));
    function asNativeElements(debugEls) {
        return debugEls.map(function (el) { return el.nativeElement; });
    }
    function _queryElementChildren(element, predicate, matches) {
        element.childNodes.forEach(function (node) {
            if (node instanceof DebugElement) {
                if (predicate(node)) {
                    matches.push(node);
                }
                _queryElementChildren(node, predicate, matches);
            }
        });
    }
    function _queryNodeChildren(parentNode, predicate, matches) {
        if (parentNode instanceof DebugElement) {
            parentNode.childNodes.forEach(function (node) {
                if (predicate(node)) {
                    matches.push(node);
                }
                if (node instanceof DebugElement) {
                    _queryNodeChildren(node, predicate, matches);
                }
            });
        }
    }
    // Need to keep the nodes in a global Map so that multiple angular apps are supported.
    var _nativeNodeToDebugNode = new Map();
    function getDebugNode(nativeNode) {
        return _nativeNodeToDebugNode.get(nativeNode);
    }
    function indexDebugNode(node) {
        _nativeNodeToDebugNode.set(node.nativeNode, node);
    }
    function removeDebugNodeFromIndex(node) {
        _nativeNodeToDebugNode.delete(node.nativeNode);
    }
    /**
     * A token that can be provided when bootstraping an application to make an array of directives
     * available in every component of the application.
     *
     * ### Example
     *
     * ```typescript
     * import {PLATFORM_DIRECTIVES} from '@angular/core';
     * import {OtherDirective} from './myDirectives';
     *
     * @Component({
     *   selector: 'my-component',
     *   template: `
     *     <!-- can use other directive even though the component does not list it in `directives` -->
     *     <other-directive></other-directive>
     *   `
     * })
     * export class MyComponent {
     *   ...
     * }
     *
     * bootstrap(MyComponent, [provide(PLATFORM_DIRECTIVES, {useValue: [OtherDirective], multi:true})]);
     * ```
     */
    var PLATFORM_DIRECTIVES =
        /*@ts2dart_const*/ new OpaqueToken("Platform Directives");
    /**
     * A token that can be provided when bootstraping an application to make an array of pipes
     * available in every component of the application.
     *
     * ### Example
     *
     * ```typescript
     * import {PLATFORM_PIPES} from '@angular/core';
     * import {OtherPipe} from './myPipe';
     *
     * @Component({
     *   selector: 'my-component',
     *   template: `
     *     {{123 | other-pipe}}
     *   `
     * })
     * export class MyComponent {
     *   ...
     * }
     *
     * bootstrap(MyComponent, [provide(PLATFORM_PIPES, {useValue: [OtherPipe], multi:true})]);
     * ```
     */
    var PLATFORM_PIPES = new OpaqueToken("Platform Pipes");
    function _reflector() {
        return reflector;
    }
    // prevent missing use Dart warning.
    /**
     * A default set of providers which should be included in any Angular platform.
     */
    var PLATFORM_COMMON_PROVIDERS = [
        PLATFORM_CORE_PROVIDERS,
        /*@ts2dart_Provider*/ { provide: Reflector, useFactory: _reflector, deps: [] },
        /*@ts2dart_Provider*/ { provide: ReflectorReader, useExisting: Reflector },
        TestabilityRegistry,
        Console
    ];
    // avoid unused import when Type union types are erased
    /**
     * A default set of providers which should be included in any Angular
     * application, regardless of the platform it runs onto.
     */
    var APPLICATION_COMMON_PROVIDERS =
        /*@ts2dart_const*/ [
        APPLICATION_CORE_PROVIDERS,
        /* @ts2dart_Provider */ { provide: ComponentResolver, useClass: ReflectorComponentResolver },
        APP_ID_RANDOM_PROVIDER,
        ViewUtils,
        /* @ts2dart_Provider */ { provide: IterableDiffers, useValue: defaultIterableDiffers },
        /* @ts2dart_Provider */ { provide: KeyValueDiffers, useValue: defaultKeyValueDiffers },
        /* @ts2dart_Provider */ { provide: DynamicComponentLoader, useClass: DynamicComponentLoader_ }
    ];
    var LifecycleHooks;
    (function (LifecycleHooks) {
        LifecycleHooks[LifecycleHooks["OnInit"] = 0] = "OnInit";
        LifecycleHooks[LifecycleHooks["OnDestroy"] = 1] = "OnDestroy";
        LifecycleHooks[LifecycleHooks["DoCheck"] = 2] = "DoCheck";
        LifecycleHooks[LifecycleHooks["OnChanges"] = 3] = "OnChanges";
        LifecycleHooks[LifecycleHooks["AfterContentInit"] = 4] = "AfterContentInit";
        LifecycleHooks[LifecycleHooks["AfterContentChecked"] = 5] = "AfterContentChecked";
        LifecycleHooks[LifecycleHooks["AfterViewInit"] = 6] = "AfterViewInit";
        LifecycleHooks[LifecycleHooks["AfterViewChecked"] = 7] = "AfterViewChecked";
    })(LifecycleHooks || (LifecycleHooks = {}));
    /**
     * @internal
     */
    var LIFECYCLE_HOOKS_VALUES = [
        LifecycleHooks.OnInit,
        LifecycleHooks.OnDestroy,
        LifecycleHooks.DoCheck,
        LifecycleHooks.OnChanges,
        LifecycleHooks.AfterContentInit,
        LifecycleHooks.AfterContentChecked,
        LifecycleHooks.AfterViewInit,
        LifecycleHooks.AfterViewChecked
    ];
    /* @ts2dart_const */
    var StaticNodeDebugInfo = (function () {
        function StaticNodeDebugInfo(providerTokens, componentToken, refTokens) {
            this.providerTokens = providerTokens;
            this.componentToken = componentToken;
            this.refTokens = refTokens;
        }
        return StaticNodeDebugInfo;
    }());
    var DebugContext = (function () {
        function DebugContext(_view, _nodeIndex, _tplRow, _tplCol) {
            this._view = _view;
            this._nodeIndex = _nodeIndex;
            this._tplRow = _tplRow;
            this._tplCol = _tplCol;
        }
        Object.defineProperty(DebugContext.prototype, "_staticNodeInfo", {
            get: function () {
                return isPresent(this._nodeIndex) ? this._view.staticNodeDebugInfos[this._nodeIndex] : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "context", {
            get: function () { return this._view.context; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "component", {
            get: function () {
                var staticNodeInfo = this._staticNodeInfo;
                if (isPresent(staticNodeInfo) && isPresent(staticNodeInfo.componentToken)) {
                    return this.injector.get(staticNodeInfo.componentToken);
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "componentRenderElement", {
            get: function () {
                var componentView = this._view;
                while (isPresent(componentView.declarationAppElement) &&
                componentView.type !== ViewType.COMPONENT) {
                    componentView = componentView.declarationAppElement.parentView;
                }
                return isPresent(componentView.declarationAppElement) ?
                    componentView.declarationAppElement.nativeElement :
                    null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "injector", {
            get: function () { return this._view.injector(this._nodeIndex); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "renderNode", {
            get: function () {
                if (isPresent(this._nodeIndex) && isPresent(this._view.allNodes)) {
                    return this._view.allNodes[this._nodeIndex];
                }
                else {
                    return null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "providerTokens", {
            get: function () {
                var staticNodeInfo = this._staticNodeInfo;
                return isPresent(staticNodeInfo) ? staticNodeInfo.providerTokens : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "source", {
            get: function () {
                return this._view.componentType.templateUrl + ":" + this._tplRow + ":" + this._tplCol;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugContext.prototype, "references", {
            get: function () {
                var _this = this;
                var varValues = {};
                var staticNodeInfo = this._staticNodeInfo;
                if (isPresent(staticNodeInfo)) {
                    var refs = staticNodeInfo.refTokens;
                    StringMapWrapper.forEach(refs, function (refToken, refName) {
                        var varValue;
                        if (isBlank(refToken)) {
                            varValue = isPresent(_this._view.allNodes) ? _this._view.allNodes[_this._nodeIndex] : null;
                        }
                        else {
                            varValue = _this._view.injectorGet(refToken, _this._nodeIndex, null);
                        }
                        varValues[refName] = varValue;
                    });
                }
                return varValues;
            },
            enumerable: true,
            configurable: true
        });
        return DebugContext;
    }());
    var _UNDEFINED = new Object();
    var ElementInjector = (function (_super) {
        __extends(ElementInjector, _super);
        function ElementInjector(_view, _nodeIndex) {
            _super.call(this);
            this._view = _view;
            this._nodeIndex = _nodeIndex;
        }
        ElementInjector.prototype.get = function (token, notFoundValue) {
            if (notFoundValue === void 0) { notFoundValue = THROW_IF_NOT_FOUND; }
            var result = _UNDEFINED;
            if (result === _UNDEFINED) {
                result = this._view.injectorGet(token, this._nodeIndex, _UNDEFINED);
            }
            if (result === _UNDEFINED) {
                result = this._view.parentInjector.get(token, notFoundValue);
            }
            return result;
        };
        return ElementInjector;
    }(Injector));
    var _scope_check = wtfCreateScope("AppView#check(ascii id)");
    /**
     * Cost of making objects: http://jsperf.com/instantiate-size-of-object
     *
     */
    var AppView = (function () {
        function AppView(clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode) {
            this.clazz = clazz;
            this.componentType = componentType;
            this.type = type;
            this.viewUtils = viewUtils;
            this.parentInjector = parentInjector;
            this.declarationAppElement = declarationAppElement;
            this.cdMode = cdMode;
            this.contentChildren = [];
            this.viewChildren = [];
            this.viewContainerElement = null;
            // The names of the below fields must be kept in sync with codegen_name_util.ts or
            // change detection will fail.
            this.cdState = ChangeDetectorState.NeverChecked;
            this.destroyed = false;
            this.ref = new ViewRef_(this);
            if (type === ViewType.COMPONENT || type === ViewType.HOST) {
                this.renderer = viewUtils.renderComponent(componentType);
            }
            else {
                this.renderer = declarationAppElement.parentView.renderer;
            }
        }
        AppView.prototype.create = function (context, givenProjectableNodes, rootSelectorOrNode) {
            this.context = context;
            var projectableNodes;
            switch (this.type) {
                case ViewType.COMPONENT:
                    projectableNodes = ensureSlotCount(givenProjectableNodes, this.componentType.slotCount);
                    break;
                case ViewType.EMBEDDED:
                    projectableNodes = this.declarationAppElement.parentView.projectableNodes;
                    break;
                case ViewType.HOST:
                    // Note: Don't ensure the slot count for the projectableNodes as we store
                    // them only for the contained component view (which will later check the slot count...)
                    projectableNodes = givenProjectableNodes;
                    break;
            }
            this._hasExternalHostElement = isPresent(rootSelectorOrNode);
            this.projectableNodes = projectableNodes;
            return this.createInternal(rootSelectorOrNode);
        };
        /**
         * Overwritten by implementations.
         * Returns the AppElement for the host element for ViewType.HOST.
         */
        AppView.prototype.createInternal = function (rootSelectorOrNode) { return null; };
        AppView.prototype.init = function (rootNodesOrAppElements, allNodes, disposables, subscriptions) {
            this.rootNodesOrAppElements = rootNodesOrAppElements;
            this.allNodes = allNodes;
            this.disposables = disposables;
            this.subscriptions = subscriptions;
            if (this.type === ViewType.COMPONENT) {
                // Note: the render nodes have been attached to their host element
                // in the ViewFactory already.
                this.declarationAppElement.parentView.viewChildren.push(this);
                this.dirtyParentQueriesInternal();
            }
        };
        AppView.prototype.selectOrCreateHostElement = function (elementName, rootSelectorOrNode, debugInfo) {
            var hostElement;
            if (isPresent(rootSelectorOrNode)) {
                hostElement = this.renderer.selectRootElement(rootSelectorOrNode, debugInfo);
            }
            else {
                hostElement = this.renderer.createElement(null, elementName, debugInfo);
            }
            return hostElement;
        };
        AppView.prototype.injectorGet = function (token, nodeIndex, notFoundResult) {
            return this.injectorGetInternal(token, nodeIndex, notFoundResult);
        };
        /**
         * Overwritten by implementations
         */
        AppView.prototype.injectorGetInternal = function (token, nodeIndex, notFoundResult) {
            return notFoundResult;
        };
        AppView.prototype.injector = function (nodeIndex) {
            if (isPresent(nodeIndex)) {
                return new ElementInjector(this, nodeIndex);
            }
            else {
                return this.parentInjector;
            }
        };
        AppView.prototype.destroy = function () {
            if (this._hasExternalHostElement) {
                this.renderer.detachView(this.flatRootNodes);
            }
            else if (isPresent(this.viewContainerElement)) {
                this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
            }
            this._destroyRecurse();
        };
        AppView.prototype._destroyRecurse = function () {
            if (this.destroyed) {
                return;
            }
            var children = this.contentChildren;
            for (var i = 0; i < children.length; i++) {
                children[i]._destroyRecurse();
            }
            children = this.viewChildren;
            for (var i = 0; i < children.length; i++) {
                children[i]._destroyRecurse();
            }
            this.destroyLocal();
            this.destroyed = true;
        };
        AppView.prototype.destroyLocal = function () {
            var hostElement = this.type === ViewType.COMPONENT ? this.declarationAppElement.nativeElement : null;
            for (var i = 0; i < this.disposables.length; i++) {
                this.disposables[i]();
            }
            for (var i = 0; i < this.subscriptions.length; i++) {
                ObservableWrapper.dispose(this.subscriptions[i]);
            }
            this.destroyInternal();
            if (this._hasExternalHostElement) {
                this.renderer.detachView(this.flatRootNodes);
            }
            else if (isPresent(this.viewContainerElement)) {
                this.viewContainerElement.detachView(this.viewContainerElement.nestedViews.indexOf(this));
            }
            else {
                this.dirtyParentQueriesInternal();
            }
            this.renderer.destroyView(hostElement, this.allNodes);
        };
        /**
         * Overwritten by implementations
         */
        AppView.prototype.destroyInternal = function () { };
        Object.defineProperty(AppView.prototype, "changeDetectorRef", {
            get: function () { return this.ref; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppView.prototype, "parent", {
            get: function () {
                return isPresent(this.declarationAppElement) ? this.declarationAppElement.parentView : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppView.prototype, "flatRootNodes", {
            get: function () { return flattenNestedViewRenderNodes(this.rootNodesOrAppElements); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppView.prototype, "lastRootNode", {
            get: function () {
                var lastNode = this.rootNodesOrAppElements.length > 0 ?
                    this.rootNodesOrAppElements[this.rootNodesOrAppElements.length - 1] :
                    null;
                return _findLastRenderNode(lastNode);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Overwritten by implementations
         */
        AppView.prototype.dirtyParentQueriesInternal = function () { };
        AppView.prototype.detectChanges = function (throwOnChange) {
            var s = _scope_check(this.clazz);
            if (this.cdMode === exports.ChangeDetectionStrategy.Detached ||
                this.cdMode === exports.ChangeDetectionStrategy.Checked ||
                this.cdState === ChangeDetectorState.Errored)
                return;
            if (this.destroyed) {
                this.throwDestroyedError('detectChanges');
            }
            this.detectChangesInternal(throwOnChange);
            if (this.cdMode === exports.ChangeDetectionStrategy.CheckOnce)
                this.cdMode = exports.ChangeDetectionStrategy.Checked;
            this.cdState = ChangeDetectorState.CheckedBefore;
            wtfLeave(s);
        };
        /**
         * Overwritten by implementations
         */
        AppView.prototype.detectChangesInternal = function (throwOnChange) {
            this.detectContentChildrenChanges(throwOnChange);
            this.detectViewChildrenChanges(throwOnChange);
        };
        AppView.prototype.detectContentChildrenChanges = function (throwOnChange) {
            for (var i = 0; i < this.contentChildren.length; ++i) {
                this.contentChildren[i].detectChanges(throwOnChange);
            }
        };
        AppView.prototype.detectViewChildrenChanges = function (throwOnChange) {
            for (var i = 0; i < this.viewChildren.length; ++i) {
                this.viewChildren[i].detectChanges(throwOnChange);
            }
        };
        AppView.prototype.addToContentChildren = function (renderAppElement) {
            renderAppElement.parentView.contentChildren.push(this);
            this.viewContainerElement = renderAppElement;
            this.dirtyParentQueriesInternal();
        };
        AppView.prototype.removeFromContentChildren = function (renderAppElement) {
            ListWrapper.remove(renderAppElement.parentView.contentChildren, this);
            this.dirtyParentQueriesInternal();
            this.viewContainerElement = null;
        };
        AppView.prototype.markAsCheckOnce = function () { this.cdMode = exports.ChangeDetectionStrategy.CheckOnce; };
        AppView.prototype.markPathToRootAsCheckOnce = function () {
            var c = this;
            while (isPresent(c) && c.cdMode !== exports.ChangeDetectionStrategy.Detached) {
                if (c.cdMode === exports.ChangeDetectionStrategy.Checked) {
                    c.cdMode = exports.ChangeDetectionStrategy.CheckOnce;
                }
                var parentEl = c.type === ViewType.COMPONENT ? c.declarationAppElement : c.viewContainerElement;
                c = isPresent(parentEl) ? parentEl.parentView : null;
            }
        };
        AppView.prototype.eventHandler = function (cb) { return cb; };
        AppView.prototype.throwDestroyedError = function (details) { throw new ViewDestroyedException(details); };
        return AppView;
    }());
    var DebugAppView = (function (_super) {
        __extends(DebugAppView, _super);
        function DebugAppView(clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode, staticNodeDebugInfos) {
            _super.call(this, clazz, componentType, type, viewUtils, parentInjector, declarationAppElement, cdMode);
            this.staticNodeDebugInfos = staticNodeDebugInfos;
            this._currentDebugContext = null;
        }
        DebugAppView.prototype.create = function (context, givenProjectableNodes, rootSelectorOrNode) {
            this._resetDebug();
            try {
                return _super.prototype.create.call(this, context, givenProjectableNodes, rootSelectorOrNode);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        };
        DebugAppView.prototype.injectorGet = function (token, nodeIndex, notFoundResult) {
            this._resetDebug();
            try {
                return _super.prototype.injectorGet.call(this, token, nodeIndex, notFoundResult);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        };
        DebugAppView.prototype.destroyLocal = function () {
            this._resetDebug();
            try {
                _super.prototype.destroyLocal.call(this);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        };
        DebugAppView.prototype.detectChanges = function (throwOnChange) {
            this._resetDebug();
            try {
                _super.prototype.detectChanges.call(this, throwOnChange);
            }
            catch (e) {
                this._rethrowWithContext(e, e.stack);
                throw e;
            }
        };
        DebugAppView.prototype._resetDebug = function () { this._currentDebugContext = null; };
        DebugAppView.prototype.debug = function (nodeIndex, rowNum, colNum) {
            return this._currentDebugContext = new DebugContext(this, nodeIndex, rowNum, colNum);
        };
        DebugAppView.prototype._rethrowWithContext = function (e, stack) {
            if (!(e instanceof ViewWrappedException)) {
                if (!(e instanceof ExpressionChangedAfterItHasBeenCheckedException)) {
                    this.cdState = ChangeDetectorState.Errored;
                }
                if (isPresent(this._currentDebugContext)) {
                    throw new ViewWrappedException(e, stack, this._currentDebugContext);
                }
            }
        };
        DebugAppView.prototype.eventHandler = function (cb) {
            var _this = this;
            var superHandler = _super.prototype.eventHandler.call(this, cb);
            return function (event) {
                _this._resetDebug();
                try {
                    return superHandler(event);
                }
                catch (e) {
                    _this._rethrowWithContext(e, e.stack);
                    throw e;
                }
            };
        };
        return DebugAppView;
    }(AppView));
    function _findLastRenderNode(node) {
        var lastNode;
        if (node instanceof AppElement) {
            var appEl = node;
            lastNode = appEl.nativeElement;
            if (isPresent(appEl.nestedViews)) {
                // Note: Views might have no root nodes at all!
                for (var i = appEl.nestedViews.length - 1; i >= 0; i--) {
                    var nestedView = appEl.nestedViews[i];
                    if (nestedView.rootNodesOrAppElements.length > 0) {
                        lastNode = _findLastRenderNode(nestedView.rootNodesOrAppElements[nestedView.rootNodesOrAppElements.length - 1]);
                    }
                }
            }
        }
        else {
            lastNode = node;
        }
        return lastNode;
    }
    /**
     * This is here because DART requires it. It is noop in JS.
     */
    function wtfInit() { }
    var DebugDomRootRenderer = (function () {
        function DebugDomRootRenderer(_delegate) {
            this._delegate = _delegate;
        }
        DebugDomRootRenderer.prototype.renderComponent = function (componentProto) {
            return new DebugDomRenderer(this._delegate.renderComponent(componentProto));
        };
        return DebugDomRootRenderer;
    }());
    var DebugDomRenderer = (function () {
        function DebugDomRenderer(_delegate) {
            this._delegate = _delegate;
        }
        DebugDomRenderer.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
            var nativeEl = this._delegate.selectRootElement(selectorOrNode, debugInfo);
            var debugEl = new DebugElement(nativeEl, null, debugInfo);
            indexDebugNode(debugEl);
            return nativeEl;
        };
        DebugDomRenderer.prototype.createElement = function (parentElement, name, debugInfo) {
            var nativeEl = this._delegate.createElement(parentElement, name, debugInfo);
            var debugEl = new DebugElement(nativeEl, getDebugNode(parentElement), debugInfo);
            debugEl.name = name;
            indexDebugNode(debugEl);
            return nativeEl;
        };
        DebugDomRenderer.prototype.createViewRoot = function (hostElement) { return this._delegate.createViewRoot(hostElement); };
        DebugDomRenderer.prototype.createTemplateAnchor = function (parentElement, debugInfo) {
            var comment = this._delegate.createTemplateAnchor(parentElement, debugInfo);
            var debugEl = new DebugNode(comment, getDebugNode(parentElement), debugInfo);
            indexDebugNode(debugEl);
            return comment;
        };
        DebugDomRenderer.prototype.createText = function (parentElement, value, debugInfo) {
            var text = this._delegate.createText(parentElement, value, debugInfo);
            var debugEl = new DebugNode(text, getDebugNode(parentElement), debugInfo);
            indexDebugNode(debugEl);
            return text;
        };
        DebugDomRenderer.prototype.projectNodes = function (parentElement, nodes) {
            var debugParent = getDebugNode(parentElement);
            if (isPresent(debugParent) && debugParent instanceof DebugElement) {
                var debugElement_1 = debugParent;
                nodes.forEach(function (node) { debugElement_1.addChild(getDebugNode(node)); });
            }
            this._delegate.projectNodes(parentElement, nodes);
        };
        DebugDomRenderer.prototype.attachViewAfter = function (node, viewRootNodes) {
            var debugNode = getDebugNode(node);
            if (isPresent(debugNode)) {
                var debugParent = debugNode.parent;
                if (viewRootNodes.length > 0 && isPresent(debugParent)) {
                    var debugViewRootNodes = [];
                    viewRootNodes.forEach(function (rootNode) { return debugViewRootNodes.push(getDebugNode(rootNode)); });
                    debugParent.insertChildrenAfter(debugNode, debugViewRootNodes);
                }
            }
            this._delegate.attachViewAfter(node, viewRootNodes);
        };
        DebugDomRenderer.prototype.detachView = function (viewRootNodes) {
            viewRootNodes.forEach(function (node) {
                var debugNode = getDebugNode(node);
                if (isPresent(debugNode) && isPresent(debugNode.parent)) {
                    debugNode.parent.removeChild(debugNode);
                }
            });
            this._delegate.detachView(viewRootNodes);
        };
        DebugDomRenderer.prototype.destroyView = function (hostElement, viewAllNodes) {
            viewAllNodes.forEach(function (node) { removeDebugNodeFromIndex(getDebugNode(node)); });
            this._delegate.destroyView(hostElement, viewAllNodes);
        };
        DebugDomRenderer.prototype.listen = function (renderElement, name, callback) {
            var debugEl = getDebugNode(renderElement);
            if (isPresent(debugEl)) {
                debugEl.listeners.push(new EventListener(name, callback));
            }
            return this._delegate.listen(renderElement, name, callback);
        };
        DebugDomRenderer.prototype.listenGlobal = function (target, name, callback) {
            return this._delegate.listenGlobal(target, name, callback);
        };
        DebugDomRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
            var debugEl = getDebugNode(renderElement);
            if (isPresent(debugEl) && debugEl instanceof DebugElement) {
                debugEl.properties[propertyName] = propertyValue;
            }
            this._delegate.setElementProperty(renderElement, propertyName, propertyValue);
        };
        DebugDomRenderer.prototype.setElementAttribute = function (renderElement, attributeName, attributeValue) {
            var debugEl = getDebugNode(renderElement);
            if (isPresent(debugEl) && debugEl instanceof DebugElement) {
                debugEl.attributes[attributeName] = attributeValue;
            }
            this._delegate.setElementAttribute(renderElement, attributeName, attributeValue);
        };
        DebugDomRenderer.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {
            this._delegate.setBindingDebugInfo(renderElement, propertyName, propertyValue);
        };
        DebugDomRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
            this._delegate.setElementClass(renderElement, className, isAdd);
        };
        DebugDomRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
            this._delegate.setElementStyle(renderElement, styleName, styleValue);
        };
        DebugDomRenderer.prototype.invokeElementMethod = function (renderElement, methodName, args) {
            this._delegate.invokeElementMethod(renderElement, methodName, args);
        };
        DebugDomRenderer.prototype.setText = function (renderNode, text) { this._delegate.setText(renderNode, text); };
        return DebugDomRenderer;
    }());
    var __core_private__ = {
        isDefaultChangeDetectionStrategy: isDefaultChangeDetectionStrategy,
        ChangeDetectorState: ChangeDetectorState,
        CHANGE_DETECTION_STRATEGY_VALUES: CHANGE_DETECTION_STRATEGY_VALUES,
        constructDependencies: constructDependencies,
        LifecycleHooks: LifecycleHooks,
        LIFECYCLE_HOOKS_VALUES: LIFECYCLE_HOOKS_VALUES,
        ReflectorReader: ReflectorReader,
        ReflectorComponentResolver: ReflectorComponentResolver,
        AppElement: AppElement,
        AppView: AppView,
        DebugAppView: DebugAppView,
        ViewType: ViewType,
        MAX_INTERPOLATION_VALUES: MAX_INTERPOLATION_VALUES,
        checkBinding: checkBinding,
        flattenNestedViewRenderNodes: flattenNestedViewRenderNodes,
        interpolate: interpolate,
        ViewUtils: ViewUtils,
        VIEW_ENCAPSULATION_VALUES: VIEW_ENCAPSULATION_VALUES,
        DebugContext: DebugContext,
        StaticNodeDebugInfo: StaticNodeDebugInfo,
        devModeEqual: devModeEqual,
        uninitialized: uninitialized,
        ValueUnwrapper: ValueUnwrapper,
        RenderDebugInfo: RenderDebugInfo,
        SecurityContext: SecurityContext,
        SanitizationService: SanitizationService,
        TemplateRef_: TemplateRef_,
        wtfInit: wtfInit,
        ReflectionCapabilities: ReflectionCapabilities,
        makeDecorator: makeDecorator,
        DebugDomRootRenderer: DebugDomRootRenderer,
        createProvider: createProvider,
        isProviderLiteral: isProviderLiteral,
        EMPTY_ARRAY: EMPTY_ARRAY,
        EMPTY_MAP: EMPTY_MAP,
        pureProxy1: pureProxy1,
        pureProxy2: pureProxy2,
        pureProxy3: pureProxy3,
        pureProxy4: pureProxy4,
        pureProxy5: pureProxy5,
        pureProxy6: pureProxy6,
        pureProxy7: pureProxy7,
        pureProxy8: pureProxy8,
        pureProxy9: pureProxy9,
        pureProxy10: pureProxy10,
        castByValue: castByValue,
        Console: Console,
    };
    exports.createPlatform = createPlatform;
    exports.assertPlatform = assertPlatform;
    exports.disposePlatform = disposePlatform;
    exports.getPlatform = getPlatform;
    exports.coreBootstrap = coreBootstrap;
    exports.coreLoadAndBootstrap = coreLoadAndBootstrap;
    exports.createNgZone = createNgZone;
    exports.PlatformRef = PlatformRef;
    exports.ApplicationRef = ApplicationRef;
    exports.APP_ID = APP_ID;
    exports.APP_INITIALIZER = APP_INITIALIZER;
    exports.PACKAGE_ROOT_URL = PACKAGE_ROOT_URL;
    exports.PLATFORM_INITIALIZER = PLATFORM_INITIALIZER;
    exports.DebugElement = DebugElement;
    exports.DebugNode = DebugNode;
    exports.asNativeElements = asNativeElements;
    exports.getDebugNode = getDebugNode;
    exports.wtfCreateScope = wtfCreateScope;
    exports.wtfLeave = wtfLeave;
    exports.wtfStartTimeRange = wtfStartTimeRange;
    exports.wtfEndTimeRange = wtfEndTimeRange;
    exports.Type = Type;
    exports.enableProdMode = enableProdMode;
    exports.EventEmitter = EventEmitter;
    exports.ExceptionHandler = ExceptionHandler;
    exports.WrappedException = WrappedException;
    exports.BaseException = BaseException;
    exports.Component = Component;
    exports.Directive = Directive;
    exports.Attribute = Attribute;
    exports.Query = Query;
    exports.ContentChildren = ContentChildren;
    exports.ContentChild = ContentChild;
    exports.ViewChildren = ViewChildren;
    exports.ViewChild = ViewChild;
    exports.ViewQuery = ViewQuery;
    exports.Pipe = Pipe;
    exports.Input = Input;
    exports.Output = Output;
    exports.HostBinding = HostBinding;
    exports.HostListener = HostListener;
    exports.QueryMetadata = QueryMetadata;
    exports.ContentChildrenMetadata = ContentChildrenMetadata;
    exports.ContentChildMetadata = ContentChildMetadata;
    exports.ViewChildrenMetadata = ViewChildrenMetadata;
    exports.ViewQueryMetadata = ViewQueryMetadata;
    exports.ViewChildMetadata = ViewChildMetadata;
    exports.AttributeMetadata = AttributeMetadata;
    exports.ComponentMetadata = ComponentMetadata;
    exports.DirectiveMetadata = DirectiveMetadata;
    exports.PipeMetadata = PipeMetadata;
    exports.InputMetadata = InputMetadata;
    exports.OutputMetadata = OutputMetadata;
    exports.HostBindingMetadata = HostBindingMetadata;
    exports.HostListenerMetadata = HostListenerMetadata;
    exports.ViewMetadata = ViewMetadata;
    exports.Class = Class;
    exports.InjectMetadata = InjectMetadata;
    exports.OptionalMetadata = OptionalMetadata;
    exports.InjectableMetadata = InjectableMetadata;
    exports.SelfMetadata = SelfMetadata;
    exports.HostMetadata = HostMetadata;
    exports.SkipSelfMetadata = SkipSelfMetadata;
    exports.DependencyMetadata = DependencyMetadata;
    exports.forwardRef = forwardRef;
    exports.resolveForwardRef = resolveForwardRef;
    exports.Injector = Injector;
    exports.ReflectiveInjector = ReflectiveInjector;
    exports.Binding = Binding;
    exports.ProviderBuilder = ProviderBuilder;
    exports.bind = bind;
    exports.Provider = Provider;
    exports.provide = provide;
    exports.ResolvedReflectiveFactory = ResolvedReflectiveFactory;
    exports.ReflectiveDependency = ReflectiveDependency;
    exports.ReflectiveKey = ReflectiveKey;
    exports.NoProviderError = NoProviderError;
    exports.AbstractProviderError = AbstractProviderError;
    exports.CyclicDependencyError = CyclicDependencyError;
    exports.InstantiationError = InstantiationError;
    exports.InvalidProviderError = InvalidProviderError;
    exports.NoAnnotationError = NoAnnotationError;
    exports.OutOfBoundsError = OutOfBoundsError;
    exports.OpaqueToken = OpaqueToken;
    exports.Inject = Inject;
    exports.Optional = Optional;
    exports.Injectable = Injectable;
    exports.Self = Self;
    exports.Host = Host;
    exports.SkipSelf = SkipSelf;
    exports.NgZone = NgZone;
    exports.NgZoneError = NgZoneError;
    exports.RootRenderer = RootRenderer;
    exports.Renderer = Renderer;
    exports.RenderComponentType = RenderComponentType;
    exports.ComponentResolver = ComponentResolver;
    exports.QueryList = QueryList;
    exports.DynamicComponentLoader = DynamicComponentLoader;
    exports.ElementRef = ElementRef;
    exports.TemplateRef = TemplateRef;
    exports.EmbeddedViewRef = EmbeddedViewRef;
    exports.ViewRef = ViewRef;
    exports.ViewContainerRef = ViewContainerRef;
    exports.ComponentRef = ComponentRef;
    exports.ComponentFactory = ComponentFactory;
    exports.ExpressionChangedAfterItHasBeenCheckedException = ExpressionChangedAfterItHasBeenCheckedException;
    exports.Testability = Testability;
    exports.TestabilityRegistry = TestabilityRegistry;
    exports.setTestabilityGetter = setTestabilityGetter;
    exports.ChangeDetectorRef = ChangeDetectorRef;
    exports.WrappedValue = WrappedValue;
    exports.SimpleChange = SimpleChange;
    exports.DefaultIterableDiffer = DefaultIterableDiffer;
    exports.IterableDiffers = IterableDiffers;
    exports.KeyValueDiffers = KeyValueDiffers;
    exports.CollectionChangeRecord = CollectionChangeRecord;
    exports.KeyValueChangeRecord = KeyValueChangeRecord;
    exports.PLATFORM_DIRECTIVES = PLATFORM_DIRECTIVES;
    exports.PLATFORM_PIPES = PLATFORM_PIPES;
    exports.PLATFORM_COMMON_PROVIDERS = PLATFORM_COMMON_PROVIDERS;
    exports.APPLICATION_COMMON_PROVIDERS = APPLICATION_COMMON_PROVIDERS;
    exports.reflector = reflector;
    exports.Reflector = Reflector;
    exports.ReflectionInfo = ReflectionInfo;
    exports.__core_private__ = __core_private__;
}));
