import * as React from "react";
import { ISurveyLayoutElement, ISurveyLayoutElementGroup } from "survey-core";
import { ReactElementFactory } from "../element-factory";
import { SurveyElementBase } from "../reactquestion_element";

export class ComponentsContainer extends SurveyElementBase<any, any> {
  renderElement(): React.JSX.Element | null {
    const groups: Array<ISurveyLayoutElementGroup> = this.props.survey.getContainerContentGroups(this.props.container);
    const needRenderWrapper = this.props.needRenderWrapper === false ? false : true;
    if (groups.length == 0) {
      return null;
    }
    const content = groups.map(group => this.renderGroup(group));
    if (!needRenderWrapper) {
      return <>{content}</>;
    }
    return <div className={"sv-components-column" + " sv-components-container-" + this.props.container}>
      {content}
    </div>;
  }
  private renderGroup(group: ISurveyLayoutElementGroup): React.JSX.Element {
    if (!group.css) {
      return this.renderComponent(group.elements[0]);
    }
    return <div className={group.css} key={group.key}>
      {group.elements.map(component => this.renderComponent(component))}
    </div>;
  }
  private renderComponent(component: ISurveyLayoutElement): React.JSX.Element {
    return ReactElementFactory.Instance.createElement(component.component as string, { survey: this.props.survey, model: component.data, container: this.props.container, key: component.id });
  }
}

ReactElementFactory.Instance.registerElement("sv-components-container", (props: any) => {
  return React.createElement(ComponentsContainer, props);
});
