import React from "react";
import { ReactElementFactory } from "../element-factory";

export class Skeleton extends React.Component<any, any> {
  render(): React.JSX.Element {
    return (
      <div className="sv-skeleton-element" id={this.props.element?.id} style={{ height: this.props.element?.skeletonHeight }}>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-skeleton", (props: any) => {
  return React.createElement(Skeleton, props);
});
