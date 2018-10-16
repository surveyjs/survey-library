import * as ko from "knockout";
import { JsonObject } from "../jsonobject";
import { Base } from "../base";
import { ElementFactory } from "../questionfactory";

export class ImplementorBase {
  constructor(public element: Base) {
    element.iteratePropertiesHash((hash, key) => {
      var val = hash[key];
      if (Array.isArray(val)) {
        hash[key] = ko.observableArray(val);
        (<any>val)["onArrayChanged"] = () => hash[key].notifySubscribers();
      } else {
        hash[key] = ko.observable(val);
      }
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
