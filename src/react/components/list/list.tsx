import React from "react";
import { IAction, ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ListItem } from "./list-item";

interface IListProps {
  model: ListModel;
}

export class List extends SurveyElementBase<IListProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      filterString: this.model.filterString || ""
    };
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
  renderElement() {
    const items = this.renderItems();
    return (
      <div className={this.model.cssClasses.root}>
        {this.searchElementContent()}
        {this.emptyContent()}
        <ul
          className={this.model.cssClasses.itemsContainer}
          role="listbox"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onKeyDown={this.handleKeydown}
          onMouseMove={this.handleMouseMove}
        >
          {items}
        </ul>
      </div>
    );
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
        if (e.target === document.activeElement) {
          this.model.filterString = e.target.value;
        }
      };
      const onKeyUp = (e: any) => {
        this.model.goToItems(e);
      };
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
        </div>
      );
    }
  }
  emptyContent() {
    const style = {
      display: this.model.isEmpty ? null : "none",
    };

    return (<div className={this.model.cssClasses.emptyContainer} style={style}>
      <div className={this.model.cssClasses.emptyText} aria-label={this.model.emptyMessage}>{this.model.emptyMessage}</div>
    </div>);
  }
}

ReactElementFactory.Instance.registerElement("sv-list", (props) => {
  return React.createElement(List, props);
});
