import * as React from "react";
import { SurveyElementErrors } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { ReactElementFactory } from "./element-factory";

import { SurveyPanelBase } from "./panel-base";
import { PanelModel, doKey2ClickUp } from "survey-core";
import { ReactSurveyModel } from "./reactsurveymodel";
import { SurveyActionBar } from "./components/action-bar/action-bar";
import { SurveyPanel } from "./panel";
import { SurveyModel } from "../survey";

export class SurveyPanelFooter extends SurveyElementBase<any, any> {
  constructor(props: any) {
    super(props);
  }

  public get panel(): PanelModel {
    return this.props.panel;
  }

  public get survey(): SurveyModel {
    return this.props.panel.survey;
  }

  public renderElement(): JSX.Element {
    if (!this.panel.hasEditButton || !this.survey) return;
    return (
      <div className={this.panel.cssClasses.panel.footer}>
        <input
          className={this.survey.cssNavigationEdit}
          type="button"
          onClick={()=>{ this.panel.cancelPreview(); }}
          value={this.survey.editText}
        />
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-panel-footer", (props) => {
  return React.createElement(SurveyPanelFooter, props);
});
