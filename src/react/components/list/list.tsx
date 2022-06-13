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
      filteredText: this.model.filteredText || ""
    };
  }
  get model(): ListModel {
    return this.props.model;
  }
  handleKeydown = (event: any) => {
    this.model.onKeyDown(event);
  };
  getStateElement() {
    return this.model;
  }
  renderElement() {
    const items = this.renderItems();
    return (
      <div className="sv-list__container">
        {this.searchElementContent()}
        <ul
          className="sv-list"
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onKeyDown={this.handleKeydown}
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
    if (!this.model.needFilter) return null;
    else {
      const onChange = (e: any) => {
        if (e.target === document.activeElement) {
          this.model.filteredText = e.target.value;
          this.model.goToItems(e.target);
        }
      };
      return (
        <div className="sv-list__filter">
          <div className={"sv-list__filter-icon"}>
            <SvgIcon
              iconName={"icon-search"}
              size={"auto"}
            >
            </SvgIcon>
          </div>
          <input
            type="text"
            className="sv-list__input"
            placeholder={this.model.filteredTextPlaceholder}
            value={this.state.filteredText}
            onChange={onChange}
          ></input>
        </div>
      );
    }
  }
}

ReactElementFactory.Instance.registerElement("sv-list", (props) => {
  return React.createElement(List, props);
});
