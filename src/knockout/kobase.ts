import * as ko from "knockout";
import { Base } from "../base";

export class ImplementorBase {
  private static doIterateProperties(hash: any, key: any): any {
    var val = hash[key];
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
    element.getPropertyValueCoreHandler = (hash, key) => {
      if (hash[key] === undefined) {
        hash[key] = ko.observable();
      }
      return ko.unwrap(hash[key]);
    };
    element.setPropertyValueCoreHandler = (hash, key, val) =>
      hash[key] !== undefined
        ? hash[key](val)
        : (hash[key] = ko.observable(val));
  }
}
