import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { createSvg } from "../../../utils/utils";

export class SvgIcon extends React.Component<any, any> {
  private svgIconRef: any;
  constructor(props: any) {
    super(props);
    this.svgIconRef = React.createRef();
  }

  render() {
    return (
      <svg className={this.props.cssClasses} ref={this.svgIconRef}>
        <use></use>
      </svg>
    );
  }
  componentDidMount() {
    createSvg(
      this.props.size,
      this.props.width,
      this.props.height,
      this.props.iconName,
      this.svgIconRef.current
    );
  }
}

ReactElementFactory.Instance.registerElement("sv-svg-icon", (props) => {
  return React.createElement(SvgIcon, props);
});
