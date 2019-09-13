export var __assign =
  (<any>Object)["assign"] ||
  function(target: any) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) target[p] = s[p];
    }
    return target;
  };

export function __extends(thisClass: any, baseClass: any) {
  for (var p in baseClass)
    if (baseClass.hasOwnProperty(p)) thisClass[p] = baseClass[p];
  function __() {
    this.constructor = thisClass;
  }
  thisClass.prototype =
    baseClass === null
      ? Object.create(baseClass)
      : ((__.prototype = baseClass.prototype), new (<any>__)());
}

declare var Reflect:any;

export var __decorate = function(
  decorators: any,
  target: any,
  key: any,
  desc: any
) {
  var c = arguments.length,
    r =
      c < 3
        ? target
        : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i]))
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

export var __spreadArrays = function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
};