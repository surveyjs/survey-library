import * as ko from "knockout";
import { ImplementorBase } from "../../kobase";

const template = require("./character-counter.html");

export var CharacterCounterComponent: any;

ko.components.register("sv-character-counter", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      const counter = params.counter;
      const remainingCharacterCounter = params.remainingCharacterCounter;
      new ImplementorBase(counter);
      return { counter: counter, remainingCharacterCounter: remainingCharacterCounter };
    },
  },
  template: template,
});
