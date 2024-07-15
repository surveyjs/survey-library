import * as React from "react";
import * as ReactDOM from "react-dom";
// import jQuery from "jquery";

import { Survey, PopupSurvey } from "./ui-model";
import { SurveyModel } from "survey-core";

const jQuery = window["jQuery"] || window["$"];

export function renderSurvey(model: SurveyModel, element: HTMLElement, props: any = {}) {
  const survey = React.createElement(Survey, { model, ...props });
  ReactDOM.render(survey, element);
}

export function renderPopupSurvey(model: SurveyModel, element: HTMLElement, props: any = {}) {
  const survey = React.createElement(PopupSurvey, { model, ...props });
  ReactDOM.render(survey, element);
}

function doPopupSurvey(props: any): void {
  return this.each(function () {
    renderPopupSurvey(props.model, this, props);
  });
}

if (!!jQuery) {
  jQuery["fn"].extend({
    Survey: function (props: any) {
      return this.each(function () {
        renderSurvey(props.model, this, props);
      } as any);
    },
    PopupSurvey: doPopupSurvey,
    SurveyWindow: doPopupSurvey
  });
}

SurveyModel.platform = "ui";

export const preact: any = React;

export * from "./react-ui-model";
export * from "./core-export";

export { SurveyModel as Model } from "survey-core";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-ui");