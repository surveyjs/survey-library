import React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";

interface IListItemProps {
  model: ListModel;
  item: any;
}

export class ListItem extends SurveyElementBase<IListItemProps, any> {
  get model(): ListModel {
    return this.props.model;
  }
  get item(): any {
    return this.props.item;
  }
  handleKeydown = (event: any) => {
    this.model.onKeyDown(event);
  };
  getStateElement() {
    return this.item;
  }
  render(): JSX.Element | null {
    if (!this.item) return null;
    const contentWrapStyle = {
      paddingInlineStart: this.model.getItemIndent(this.item)
    };
    const className = this.model.getItemClass(this.item);
    const itemContent = this.item.component || "sv-list-item-content";
    const newElement = ReactElementFactory.Instance.createElement(itemContent, { item: this.item, key: this.item.id, model: this.model });
    const contentWrap =
        <div
          style={contentWrapStyle}
          className={this.model.cssClasses.itemBody}
          title={this.item.locTitle.calculatedText}
          onMouseOver={(event: any) => { this.model.onItemHover(this.item); }}
          onMouseLeave={(event: any) => { this.model.onItemLeave(this.item); }}
        >
          {newElement}
        </div>;
    const separator = this.item.needSeparator ? <div className = {this.model.cssClasses.itemSeparator}/>:null;
    const isVisible = this.model.isItemVisible(this.item);
    const style = {
      display: isVisible ? null : "none"
    };
    return attachKey2click(
      <li
        className={className}
        role="option"
        style={style as any}
        id={this.item.elementId}
        aria-selected={this.model.isItemSelected(this.item)}
        onClick={(event: any) => {
          this.model.onItemClick(this.item);
          event.stopPropagation();
        }}
        onPointerDown={(event: any) => this.model.onPointerDown(event, this.item)}>
        {separator}
        {contentWrap}
      </li>, this.item
    );
  }
  componentDidMount() {
    super.componentDidMount();

    this.model.onLastItemRended(this.item);
  }
}

ReactElementFactory.Instance.registerElement("sv-list-item", (props) => {
  return React.createElement(ListItem, props);
});
