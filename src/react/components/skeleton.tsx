import React from "react";
import { ReactElementFactory } from "../element-factory";

export class Skeleton extends React.Component<any, any> {
  render() {
    return (
      <div className="sv-skeleton-element">
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-skeleton", (props: any) => {
  return React.createElement(Skeleton, props);
});
