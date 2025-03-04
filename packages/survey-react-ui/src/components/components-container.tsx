import * as React from "react";
import { ISurveyLayoutElement } from "survey-core";
import { ReactElementFactory } from "../element-factory";

export class ComponentsContainer extends React.Component<any, any> {
  render(): React.JSX.Element | null {
    const components: Array<ISurveyLayoutElement> = this.props.survey.getContainerContent(this.props.container);
    const needRenderWrapper = this.props.needRenderWrapper === false ? false : true;
    if (components.length == 0) {
      return null;
    }
    if (!needRenderWrapper) {
      return <>
        {components.map(component => {
          return ReactElementFactory.Instance.createElement(component.component as string, { survey: this.props.survey, model: component.data, container: this.props.container, key: component.id });
        })}
      </>;
    }
    return <div className={"sv-components-column" + " sv-components-container-" + this.props.container}>
      {components.map(component => {
        return ReactElementFactory.Instance.createElement(component.component as string, { survey: this.props.survey, model: component.data, container: this.props.container, key: component.id });
      })}
    </div>;
  }
}

ReactElementFactory.Instance.registerElement("sv-components-container", (props: any) => {
  return React.createElement(ComponentsContainer, props);
});
