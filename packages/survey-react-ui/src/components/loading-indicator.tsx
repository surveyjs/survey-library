import * as React from "react";
import { SvgIcon } from "./svg-icon/svg-icon";

export class LoadingIndicatorComponent extends React.Component<any, any> {
  render(): React.JSX.Element | null {
    return (<div className="sd-loading-indicator"><SvgIcon iconName="icon-loading" size="auto"></SvgIcon></div>);
  }
}