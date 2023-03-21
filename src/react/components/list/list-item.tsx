import React from "react";
import { ListModel } from "survey-core";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { attachKey2click } from "../../reactSurvey";
import { SvgIcon } from "../svg-icon/svg-icon";

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
    const content: Array<JSX.Element> = [];
    if (!this.item.component) {
      const text = this.renderLocString(this.item.locTitle, undefined, "locString");
      if(this.item.iconName) {
        const icon = <SvgIcon
          key={1}
          className={this.model.cssClasses.itemIcon}
          iconName={this.item.iconName}
          size={24}
          aria-label={this.item.title}
        ></SvgIcon>;
        content.push(icon);
        content.push(<span key={2}>{text}</span>);
      } else {
        content.push(text);
      }
    } else {
      const newElement = ReactElementFactory.Instance.createElement(this.item.component, { item: this.item, key: this.item.id });
      if(!!newElement) {
        content.push(newElement);
      }
    }

    const contentWrap =
        <div
          style={contentWrapStyle}
          className={this.model.cssClasses.itemBody}
        >
          {content}
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
        id={this.model.elementId}
        aria-selected={this.model.isItemSelected(this.item)}
        onClick={(event: any) => {
          this.model.onItemClick(this.item);
          event.stopPropagation();
        }}
        onPointerDown={(event: any) => this.model.onPointerDown(event, this.item)}>
        {separator}
        {contentWrap}
      </li>
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
