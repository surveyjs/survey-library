import * as React from "react";
import { SurveyElementBase } from "../../reactquestion_element";
import { QuestionFileModel, QuestionFilePage } from "survey-core";
import { SurveyFileItem } from "./file-item";

export class SurveyFilePage extends SurveyElementBase<{ question: QuestionFileModel, page: QuestionFilePage }, {}> {
  protected get question(): QuestionFileModel {
    return this.props.question;
  }

  protected get page(): any {
    return this.props.page;
  }

  protected renderElement(): React.JSX.Element | null {
    const items = this.page.items.map((item: any, index: number) => { return (<SurveyFileItem item={item} question={this.question} key={index}></SurveyFileItem>); });
    return (
      <div className={this.page.css} id={this.page.id} >
        {items}
      </div>
    );
  }
}