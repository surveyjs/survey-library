import React from "react";
import { Question } from "../../../question";
import { ReactElementFactory } from "../../element-factory";

import { TitleContent } from "../title-content/title-content";

export class DefaultTitle extends React.Component<any, any> {
  private isNeedFocus = false;

  protected get cssClasses() {
    return this.props.cssClasses;
  }
  protected get element(): Question {
    return this.props.element;
  }

  render() {
    var expandCollapse = null;
    if (this.element.isCollapsed || this.element.isExpanded) {
      var iconCss = this.cssClasses.icon;
      if (!this.element.isCollapsed)
        iconCss += " " + this.cssClasses.iconExpanded;
      var changeExpanded = (event: any) => {
        let question = this.element;

        if (!question.isExpanded && !question.isCollapsed) return;

        question.toggleState();
        this.isNeedFocus = question.isCollapsed;
      };
      var pressExpand = (event: any) => {
        if (event.keyCode == 13) changeExpanded(event);
      };
      var ariaExpanded = this.element.isExpanded;
      var ariaControls = this.element.isExpanded
        ? this.element.contentId
        : null;
      expandCollapse = (
        <span
          className={iconCss}
          tabIndex={0}
          onKeyUp={pressExpand}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
        />
      );
    }
    return (
      <>
        <TitleContent element={this.element}></TitleContent>
        {expandCollapse}
      </>
    );
  }

  componentDidMount() {
    this.doAfterRender();
  }

  private doAfterRender() {
    if (this.isNeedFocus) {
      this.element.clickTitleFunction();
      this.isNeedFocus = false;
    }
  }
}

ReactElementFactory.Instance.registerElement("sv-default-title", (props) => {
  return React.createElement(DefaultTitle, props);
});
