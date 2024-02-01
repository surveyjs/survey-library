import * as React from "react";
import { createTOCListModel, getTocRootCss, TOCModel } from "survey-core";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";
import { ReactElementFactory } from "./element-factory";
import { List } from "./components/list/list";
import { Popup } from "./components/popup/popup";
import { SvgIcon } from "./components/svg-icon/svg-icon";

export class SurveyProgressToc extends SurveyNavigationBase {
  render(): JSX.Element {
    const tocModel = this.props.model;
    let content: JSX.Element;
    if (tocModel.isMobile) {
      content = <div onClick={tocModel.togglePopup}>
        <SvgIcon iconName={tocModel.icon} size={24} />
        <Popup model={tocModel.popupModel} />
      </div>;
    } else {
      content = <List model={tocModel.listModel} />;
    }
    return (
      <div className={tocModel.containerCss}>
        {content}
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-navigation-toc", (props) => {
  return React.createElement(SurveyProgressToc, props);
});
