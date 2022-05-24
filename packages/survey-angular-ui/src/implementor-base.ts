import { Observable, Subject, BehaviorSubject } from "rxjs";
import { Base } from "survey-core";

export class ImplementorBase {
  private static doIterateProperties(element: Base, hash: any, key: any): any {
    var val = hash[key];
    if (val instanceof BehaviorSubject) return;
    if (Array.isArray(val)) {
      hash[key] = new BehaviorSubject<any>(val); // ko.observableArray(val);
      (<any>val)["onArrayChanged"] = () => {
        if (element.isLoadingFromJson || element.isDisposed) return;
        // hash[key].notifySubscribers();
      };
    } else {
      hash[key] = new BehaviorSubject<any>(val);
    }
  }
  readonly implementedMark = "__surveyImplementedNg";
  constructor(public element: Base) {
    if ((<any>element)[this.implementedMark]) {
      return;
    }
    element.iteratePropertiesHash((hash: any, key: string) => {
      ImplementorBase.doIterateProperties(element, hash, key);
    });
    element.createArrayCoreHandler = (hash: any, key: string): Array<any> => {
      var res = new BehaviorSubject<any>([]); // ko.observableArray();
      (res.value)["onArrayChanged"] = () => {
        if (element.isLoadingFromJson || element.isDisposed) return;
        // res.notifySubscribers();
      };
      hash[key] = res;

      return res.value;
    };
    element.getPropertyValueCoreHandler = (hash: any, key: string) => {
      if (hash[key] === undefined) {
        hash[key] = new BehaviorSubject<any>(undefined);
      }
      return hash[key] instanceof BehaviorSubject ? hash[key].value : hash[key];
    };
    element.setPropertyValueCoreHandler = (hash: any, key: string, val: any) => {
      if(hash[key] !== undefined) {
        if(hash[key].value === val) {
          // hash[key].notifySubscribers();
        }
        hash[key].next(val);
      } else {
        hash[key] = new BehaviorSubject<any>(val);
      }
    };
    (<any>element)[this.implementedMark] = true;
  }
  public dispose(): void {
    if ((<any>this.element)[this.implementedMark] !== true) {
      return;
    }
    this.element.iteratePropertiesHash((hash: any, key: string) => {
      hash[key] = hash[key].value || hash[key];
    });
    this.element.createArrayCoreHandler = <any>undefined;
    this.element.getPropertyValueCoreHandler = <any>undefined;
    this.element.setPropertyValueCoreHandler = <any>undefined;
    delete (<any>this.element)[this.implementedMark];
  }
}
