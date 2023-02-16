import React from "react";
import { ISurveyAddon } from "survey-core";
import { ReactElementFactory } from "../element-factory";

export class ComponentsContainer extends React.Component<any, any> {
  render(): JSX.Element | null {
    const components: Array<ISurveyAddon> = this.props.survey.getContainerContent(this.props.container);
    if(components.length == 0) {
      return null;
    }
    return <div className="sv-components-column">
      {components.map(component => {
        return ReactElementFactory.Instance.createElement(component.component, { survey: this.props.survey, model: component.data, key: component.id });
      })}
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-components-container", (props: any) => {
  return React.createElement(ComponentsContainer, props);
});
