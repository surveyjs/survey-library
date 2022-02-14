import * as ko from "knockout";
import { RendererFactory } from "survey-core";

const template = require("./boolean-radio-item.html");

export var BooleanRadioItemViewModel: any;

ko.components.register("sv-boolean-radio-item", {
  viewModel: {
    createViewModel: (params: any) => {
      params.handleChange = () =>{
        params.question.value = params.value;
      };
      params.getClass = (css: any, value: any) => {
        let className = undefined;
        if(css.radioItem) {
          className = css.radioItem;
        }
        if(css.radioItemChecked && value === params.question.value) {
          className = (className || "") + css.radioItemChecked;
        }
      };
      return params;
    },
  },
  template: template,
});
