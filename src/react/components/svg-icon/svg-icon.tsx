import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { createSvg } from "survey-core";

export class SvgIcon extends React.Component<any, any> {
  private svgIconRef: any;
  constructor(props: any) {
    super(props);
    this.svgIconRef = React.createRef();
  }

  updateSvg() {
    if(this.props.iconName)
      createSvg(
        this.props.size,
        this.props.width,
        this.props.height,
        this.props.iconName,
        this.svgIconRef.current
      );
  }
  componentDidUpdate() {
    this.updateSvg();
  }
  render() {
    return (
      <span className={this.props.className} onClick={this.props.onClick}>
        {
          this.props.iconName ?
            <svg className={"sv-svg-icon"} ref={this.svgIconRef} role="img"><use></use></svg>
            : null
        }
      </span>
    );
  }
  componentDidMount() {
    this.updateSvg();
  }
}

ReactElementFactory.Instance.registerElement("sv-svg-icon", (props) => {
  return React.createElement(SvgIcon, props);
});
