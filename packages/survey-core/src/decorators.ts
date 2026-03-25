import { Base, ComputedUpdater } from "./base";

export interface IPropertyDecoratorOptions<T = any> {
  defaultValue?: T;
  defaultSource?: string;
  getDefaultValue?: (objectInstance?: any) => T;
  calcFunc?: (objectInstance?: any) => T;
  returnValue?: T;
  localizable?:
  | { name?: string, onCreate?: (obj: Base, locStr: any) => void, defaultStr?: string | boolean, markdown?: boolean }
  | boolean;
  onSet?: (val: T, objectInstance: any, prevVal?: T) => void;
  onSetting?: (val: T, objectInstance: any, prevVal?: T) => T;
  isLowerCase?: boolean;
}
function getLocalizablePropertyName(propertyName: string): string {
  return "loc" + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
}

export function property(options: IPropertyDecoratorOptions = {}) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function (target: any, key: string): void {
    let processComputedUpdater = (obj: any, val: any) => {
      if (!!val && typeof val === "object" && val.type === ComputedUpdater.ComputedUpdaterType) {
        Base.startCollectDependencies(() => obj[key] = val.updater(), obj, key);
        const result = val.updater();
        const dependencies = Base.finishCollectDependencies();
        val.setDependencies(dependencies);
        if (obj.dependencies[key]) {
          obj.dependencies[key].dispose();
        }
        obj.dependencies[key] = val;
        return result;
      }
      return val;
    };
    if (!options || !options.localizable) {
      Object.defineProperty(target, key, {
        get: function () {
          // const serializationProperty = Serializer.getProperty(target.getType(), key);
          // if(!!serializationProperty && options.defaultValue !== undefined) {
          //   ConsoleWarnings.error("remove defaultValue from @property for class " + target.getType() + " property name is " + key);
          // }
          let defaultVal = null;
          let returnValue = undefined;
          let calcFunc = undefined;
          if (!!options) {
            returnValue = options.returnValue;
            if (options.calcFunc) {
              calcFunc = () => options.calcFunc(this);
            }
            if (typeof options.getDefaultValue === "function") {
              defaultVal = options.getDefaultValue(this);
            }
            if (options.defaultValue !== undefined) {
              defaultVal = options.defaultValue;
            }
          }
          const res = this.getPropertyValue(key, defaultVal, calcFunc);
          return returnValue !== undefined && res === undefined ? returnValue : res;
        },
        set: function (val: any) {
          let newValue = processComputedUpdater(this, val);
          const prevValue = this.getPropertyValue(key);
          if (!!options) {
            if (options.isLowerCase) {
              if (!newValue || typeof newValue !== "string") return;
              newValue = newValue.toLowerCase();
            }
            if (!!options.onSetting) {
              newValue = options.onSetting(newValue, this, prevValue);
            }
          }
          if (newValue !== prevValue) {
            this.setPropertyValue(key, newValue);
            if (!!options && options.onSet) {
              options.onSet(newValue, this, prevValue);
            }
          }
        },
      });
    } else {
      const localizable = typeof options.localizable === "object" ? options.localizable : null;
      const locName = localizable && !!localizable.name ? localizable.name : getLocalizablePropertyName(key);
      const defaultStr = localizable && localizable.defaultStr ? localizable.defaultStr : false;
      const supportsMarkdown = localizable && localizable.markdown === true;
      Object.defineProperty(target, key, {
        get: function () {
          return this.getLocStringText(this[locName]);
        },
        set: function (val: any) {
          val = processComputedUpdater(this, val);
          this.setLocStringText(this[locName], val);
          if (!!options && options.onSet) {
            options.onSet(val, this);
          }
        },
      });
      Object.defineProperty(
        target,
        locName,
        {
          get: function () {
            return this.getOrCreateLocStr(key, supportsMarkdown, defaultStr, (locStr) => {
              if (localizable && typeof localizable.onCreate === "function") {
                localizable.onCreate(this, locStr);
              }
            });
          },
        }
      );
    }
  };
}

export interface IArrayPropertyDecoratorOptions {
  onPush?: any;
  onRemove?: any;
  onSet?: (val: any, target: any) => void;
}

function ensureArray(
  target: any,
  options: IArrayPropertyDecoratorOptions,
  key: string
) {
  target.ensureArray(
    key,
    (item: any, index: number) => {
      const handler = !!options ? options.onPush : null;
      handler && handler(item, index, target);
    },
    (item: any, index: number) => {
      const handler = !!options ? options.onRemove : null;
      handler && handler(item, index, target);
    },
  );
}

export function propertyArray(options?: IArrayPropertyDecoratorOptions) {
  return function (target: any, key: string) {
    Object.defineProperty(target, key, {
      get: function () {
        ensureArray(this, options, key);
        return this.getPropertyValue(key);
      },
      set: function (val: any) {
        ensureArray(this, options, key);
        const arr = this.getPropertyValue(key);
        if (val === arr) {
          return;
        }
        if (arr) {
          arr.splice(0, arr.length, ...(val || []));
        } else {
          this.setPropertyValue(key, val);
        }
        if (!!options && options.onSet) {
          options.onSet(val, this);
        }
      },
    });
  };
}
