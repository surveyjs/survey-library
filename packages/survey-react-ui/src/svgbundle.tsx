
import React from "react";
import { SvgRegistry } from "survey-core";

export class SvgBundleComponent extends React.Component {
  private containerRef: React.RefObject<SVGSVGElement>;

  constructor(props: any) {
    super(props);
    this.containerRef = React.createRef();
  }
  private onIconsChanged = () => {
    if (!!this.containerRef.current) {
      this.containerRef.current.innerHTML = SvgRegistry.iconsRenderedHtml();
    }
  }
  componentDidMount(): void {
    this.onIconsChanged();
    SvgRegistry.onIconsChanged.add(this.onIconsChanged);
  }
  componentWillUnmount(): void {
    SvgRegistry.onIconsChanged.remove(this.onIconsChanged);
  }
  render(): React.JSX.Element {
    const svgStyle = {
      display: "none"
    };
    return <svg style={svgStyle} id="sv-icon-holder-global-container" ref={this.containerRef}></svg>;
  }
}