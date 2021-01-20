export class ObjectWrapper {
  constructor(target: any, exclude = ["action"]) {
    Object.getOwnPropertyNames(target).forEach((propertyName) => {
      if (exclude.indexOf(propertyName) === -1) {
        Object.defineProperty(this, propertyName, {
          get: () => {
            const propertyValue = target[propertyName];
            if (typeof propertyValue === "function") {
              return propertyValue();
            } else {
              return propertyValue;
            }
          },
        });
      }
    });
    exclude.forEach((propertyName) => {
      (<any>this)[propertyName] = target[propertyName];
    });
  }
}
