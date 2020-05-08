import * as ko from "knockout";
import { Base } from "../base";

export class ImplementorBase {
  private static doIterateProperties(hash: any, key: any): any {
    var val = hash[key];
    if (val === "function") return;
    if (Array.isArray(val)) {
      hash[key] = ko.observableArray(val);
      (<any>val)["onArrayChanged"] = () => hash[key].notifySubscribers();
    } else {
      hash[key] = ko.observable(val);
    }
  }
  constructor(public element: Base) {
    element.iteratePropertiesHash((hash, key) => {
      ImplementorBase.doIterateProperties(hash, key);
    });
    element.createArrayCoreHandler = (hash, key: string): Array<any> => {
      var res = ko.observableArray();
      (<any>res())["onArrayChanged"] = () => {
        if (element.isLoadingFromJson) return;
        res.notifySubscribers();
      };
      hash[key] = res;

      return res();
    };
    element.getPropertyValueCoreHandler = (hash, key) => {
      if (hash[key] === undefined) {
        hash[key] = ko.observable();
      }
      return typeof hash[key] === "function" ? hash[key]() : hash[key];
    };
    element.setPropertyValueCoreHandler = (hash, key, val) =>
      hash[key] !== undefined
        ? hash[key](val)
        : (hash[key] = ko.observable(val));
  }
  public dispose() {
    this.element.iteratePropertiesHash((hash, key) => {
      delete hash[key];
    });
    this.element.createArrayCoreHandler = undefined;
    this.element.getPropertyValueCoreHandler = undefined;
    this.element.setPropertyValueCoreHandler = undefined;
  }
}
