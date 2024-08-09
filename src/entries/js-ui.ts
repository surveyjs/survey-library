import * as React from "react";
import * as ReactDOM from "react-dom";

export { Component, createElement, RefObject, createRef } from "preact/compat";

// import jQuery from "jquery";

// eslint-disable-next-line surveyjs/no-imports-from-entries
import { Survey, PopupSurvey } from "../../packages/survey-react-ui/entries/react-ui-model";

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

SurveyModel.platform = "js-ui";
SurveyModel.prototype["render"] = function (element: any = null) {
  if (this.renderCallback) {
    this.renderCallback();
  } else {
    renderSurvey(this, element);
  }
};

export const preact: any = React;

export * from "../../packages/survey-react-ui/entries/react-ui-model";
export * from "./core-export";

export { SurveyModel as Model } from "survey-core";

import { checkLibraryVersion } from "survey-core";

checkLibraryVersion(`${process.env.VERSION}`, "survey-js-ui");