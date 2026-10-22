import * as React from "react";
import { ActionContainer, Base, RecordsSortDialogModel } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

interface IRecordsSortDialogProps {
  model: RecordsSortDialogModel;
}

// The content of the "Sort by" dialog: one action bar per row (field, direction, remove).
export class SurveyRecordsSortDialog extends SurveyElementBase<IRecordsSortDialogProps, any> {
  get model(): RecordsSortDialogModel {
    return this.props.model;
  }
  protected getStateElement(): Base {
    return this.model;
  }
  protected renderElement(): React.JSX.Element | null {
    return <div className={this.model.rootCss}>
      {this.model.rows.map((row: ActionContainer) =>
        <React.Fragment key={row.uniqueId}>{ReactElementFactory.Instance.createElement("sv-action-bar", { model: row })}</React.Fragment>
      )}
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-records-sort-dialog", (props) => {
  return React.createElement(SurveyRecordsSortDialog, (props as any) as IRecordsSortDialogProps);
});
