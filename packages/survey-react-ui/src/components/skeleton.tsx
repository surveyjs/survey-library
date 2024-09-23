import React from "react";
import { ReactElementFactory } from "../element-factory";

export class Skeleton extends React.Component<any, any> {
  render(): JSX.Element {
    let skeletonHeight: number = undefined;
    if(!!this.props.element && !!this.props.element.survey) {
      skeletonHeight = this.props.element.survey.skeletonHeight;
    }
    return (
      <div className="sv-skeleton-element" id={this.props.element?.id} style={{ height: skeletonHeight }}>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-skeleton", (props: any) => {
  return React.createElement(Skeleton, props);
});
