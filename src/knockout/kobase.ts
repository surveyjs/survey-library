import * as ko from "knockout";
import { Base } from "survey-core";

export class ImplementorBase {
  private static doIterateProperties(element: Base, hash: any, key: any): any {
    var val = hash[key];
    if (val === "function") return;
    if (Array.isArray(val)) {
      hash[key] = ko.observableArray(val);
      (<any>val)["onArrayChanged"] = () => {
        if (element.isLoadingFromJson || element.isDisposed) return;
        hash[key].notifySubscribers();
      };
    } else {
      hash[key] = ko.observable(val);
    }
  }
  readonly implementedMark = "__surveyImplementedKo";
  constructor(public element: Base) {
    if ((<any>element)[this.implementedMark]) {
      return;
    }
    element.iteratePropertiesHash((hash, key) => {
      ImplementorBase.doIterateProperties(element, hash, key);
    });
    element.createArrayCoreHandler = (hash, key: string): Array<any> => {
      var res = ko.observableArray();
      (<any>res())["onArrayChanged"] = () => {
        if (element.isLoadingFromJson || element.isDisposed) return;
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
    element.setPropertyValueCoreHandler = (hash, key, val) => {
      if(hash[key] !== undefined) {
        // if(hash[key]() === val) {
        //   hash[key].notifySubscribers();
        // }
        hash[key](val);
      } else {
        hash[key] = ko.observable(val);
      }
    };
    (<any>element)[this.implementedMark] = true;
  }
  public dispose(): void {
    this.element.iteratePropertiesHash((hash, key) => {
      hash[key] = ko.unwrap(hash[key]);
      if(Array.isArray(hash[key])) {
        hash[key]["onArrayChanged"] = undefined;
      }
    });
    this.element.createArrayCoreHandler = undefined;
    this.element.getPropertyValueCoreHandler = undefined;
    this.element.setPropertyValueCoreHandler = undefined;
    delete (<any>this.element)[this.implementedMark];
  }
}
