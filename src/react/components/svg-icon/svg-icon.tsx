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
    let className = "sv-svg-icon";
    if(this.props.className) {
      className += " " + this.props.className;
    }
    return (
      this.props.iconName ?
        <svg className={ className } onClick={this.props.onClick} ref={this.svgIconRef} role="img" aria-label={this.props.title}><use></use></svg>
        : null
    );
  }
  componentDidMount() {
    this.updateSvg();
  }
}

ReactElementFactory.Instance.registerElement("sv-svg-icon", (props) => {
  return React.createElement(SvgIcon, props);
});
