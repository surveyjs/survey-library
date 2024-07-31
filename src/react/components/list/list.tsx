import React from "react";
import { IAction, ListModel, settings } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ListItem } from "./list-item";

interface IListProps {
  model: ListModel;
}

export class List extends SurveyElementBase<IListProps, any> {
  private listContainerRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      filterString: this.model.filterString || ""
    };
    this.listContainerRef = React.createRef();
  }
  get model(): ListModel {
    return this.props.model;
  }
  handleKeydown = (event: any) => {
    this.model.onKeyDown(event);
  };
  handleMouseMove = (event: any) => {
    this.model.onMouseMove(event);
  };
  getStateElement() {
    return this.model;
  }
  componentDidMount(): void {
    super.componentDidMount();
    if(!!this.listContainerRef && !!this.listContainerRef.current) {
      this.model.initListContainerHtmlElement(this.listContainerRef.current);
    }
  }
  public componentDidUpdate(prevProps: any, prevState: any): void {
    super.componentDidUpdate(prevProps, prevState);
    if (this.model !== prevProps.model) {
      if(this.model && !!this.listContainerRef?.current) {
        this.model.initListContainerHtmlElement(this.listContainerRef.current);
      }
      if(prevProps.model) {
        prevProps.model.initListContainerHtmlElement(undefined as any);
      }
    }
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    if(!!this.model) {
      this.model.initListContainerHtmlElement(undefined as any);
    }
  }
  renderElement() {
    return (
      <div className={this.model.cssClasses.root} ref={this.listContainerRef}>
        {this.searchElementContent()}
        {this.emptyContent()}
        {this.renderList()}
      </div>
    );
  }
  renderList() {
    if(!this.model.renderElements) return null;

    const items = this.renderItems();
    const ulStyle = { display: this.model.isEmpty ? "none" : null };

    return (
      <ul
        className={this.model.getListClass()}
        style={ulStyle as any}
        role="listbox"
        id={this.model.elementId}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        onKeyDown={this.handleKeydown}
        onMouseMove={this.handleMouseMove}
      >
        {items}
      </ul>);
  }
  renderItems() {
    if (!this.model) {
      return null;
    }
    const items = this.model.renderedActions;
    if (!items) {
      return null;
    }
    return items.map((item: IAction, itemIndex: number) => {
      return (
        <ListItem model={this.model} item={item} key={"item" + itemIndex}></ListItem>
      );
    });
  }

  searchElementContent() {
    if (!this.model.showFilter) return null;
    else {
      const onChange = (e: any) => {
        const { root } = settings.environment;
        if (e.target === root.activeElement) {
          this.model.filterString = e.target.value;
        }
      };
      const onKeyUp = (e: any) => {
        this.model.goToItems(e);
      };
      const clearButton = this.model.showSearchClearButton && !!this.model.filterString ?
        <button className={this.model.cssClasses.searchClearButtonIcon} onClick={(event) => { this.model.onClickSearchClearButton(event); }}>
          <SvgIcon
            iconName={"icon-searchclear"}
            size={"auto"}
          >
          </SvgIcon>
        </button> : null;

      return (
        <div className={this.model.cssClasses.filter}>
          <div className={this.model.cssClasses.filterIcon}>
            <SvgIcon
              iconName={"icon-search"}
              size={"auto"}
            >
            </SvgIcon>
          </div>
          <input
            type="text"
            className={this.model.cssClasses.filterInput}
            aria-label={this.model.filterStringPlaceholder}
            placeholder={this.model.filterStringPlaceholder}
            value={this.state.filterString}
            onKeyUp={onKeyUp}
            onChange={onChange}
          ></input>
          {clearButton}
        </div>
      );
    }
  }
  emptyContent() {
    const style = { display: this.model.isEmpty ? null : "none" };

    return (<div className={this.model.cssClasses.emptyContainer} style={style as any}>
      <div className={this.model.cssClasses.emptyText} aria-label={this.model.emptyMessage}>{this.model.emptyMessage}</div>
    </div>);
  }
}

ReactElementFactory.Instance.registerElement("sv-list", (props) => {
  return React.createElement(List, props);
});
