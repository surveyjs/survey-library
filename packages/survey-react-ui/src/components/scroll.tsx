import * as React from "react";
import { Base, settings } from "survey-core";
import { ScrollViewModel } from "survey-core";

interface IScrollComponentProps {
  children: React.ReactNode;
}
export class Scroll extends React.Component<IScrollComponentProps, any> {
  private model: ScrollViewModel;
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
    this.model = new ScrollViewModel();
  }
  componentDidMount() {
    const container = this.rootRef.current;
    if (!container) return;
    this.model.setRootElement(container);
  }
  componentWillUnmount() {
    this.model.unsubscribeRootElement();
    this.model.setRootElement(undefined);
  }

  render(): React.JSX.Element {
    return <div ref={this.rootRef} className="sv-scroll__wrapper">
      <div className="sv-scroll__scroller sv-drag-target-skipped" onScroll={() => this.model.onScrollContainer()}>
        <div className="sv-scroll__container">
          {this.props.children}
        </div>
      </div>
      <div className="sv-scroll__scrollbar" onScroll={() => this.model.onScrollScrollbar()}>
        <div className="sv-scroll__scrollbar-sizer">
        </div>
      </div>
    </div>;
  }
}
