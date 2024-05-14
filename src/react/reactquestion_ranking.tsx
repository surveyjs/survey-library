import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { QuestionRankingModel, SurveyModel, ItemValue } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";

export class SurveyQuestionRanking extends SurveyQuestionElementBase {
  protected get question(): QuestionRankingModel {
    return this.questionBase as QuestionRankingModel;
  }

  protected renderElement(): JSX.Element {

    if (!this.question.selectToRankEnabled) {
      return (
        <div
          className={this.question.rootClass}
          ref={(root) => (this.setControl(root))}
        >
          {this.getItems()}
        </div>
      );
    } else {
      const unrankedItem = true;
      return (
        <div
          className={this.question.rootClass}
          ref={(root) => (this.setControl(root))}
        >
          <div className={this.question.getContainerClasses("from")} data-ranking="from-container">
            {this.getItems(this.question.unRankingChoices, unrankedItem)}
            {this.question.unRankingChoices.length === 0 ? <div className={this.question.cssClasses.containerPlaceholder}> {this.renderLocString(this.question.locSelectToRankEmptyRankedAreaText)} </div> : null}
          </div>

          <div className={this.question.cssClasses.containersDivider}></div>

          <div className={this.question.getContainerClasses("to")} data-ranking="to-container">
            {this.getItems()}
            {this.question.rankingChoices.length === 0 ? <div className={this.question.cssClasses.containerPlaceholder}> {this.renderLocString(this.question.locSelectToRankEmptyUnrankedAreaText)} </div> : null}
          </div>
        </div>
      );
    }
  }

  protected getItems(choices: any = this.question.rankingChoices, unrankedItem?: boolean): Array<any> {
    const items: Array<JSX.Element> = [];
    for (let i = 0; i < choices.length; i++) {
      const item = choices[i];
      items.push(
        this.renderItem(
          item,
          i,
          (event: PointerEvent) => {
            this.question.handleKeydown.call(this.question, event, item);
          },
          (event: any) => {
            event.persist();
            //event.preventDefault();
            this.question.handlePointerDown.call(
              this.question,
              event,
              item,
              event.currentTarget
            );
          },
          (event: any) => {
            event.persist();
            //event.preventDefault();
            this.question.handlePointerUp.call(
              this.question,
              event,
              item,
              event.currentTarget
            );
          },
          this.question.cssClasses,
          this.question.getItemClass(item),
          this.question,
          unrankedItem
        )
      );
    }
    return items;
  }

  protected renderItem(
    item: ItemValue,
    i: number,
    handleKeydown: (event: any) => void,
    handlePointerDown: (event: PointerEvent) => void,
    handlePointerUp: (event: PointerEvent) => void,
    cssClasses: any,
    itemClass: string,
    question: QuestionRankingModel,
    unrankedItem?: boolean
  ): JSX.Element {
    const key: string = "id-" + item.renderedId;
    const text: JSX.Element = this.renderLocString(item.locText);
    const index = i;
    const indexText: string = this.question.getNumberByIndex(index);
    const tabIndex: number = this.question.getItemTabIndex(item);
    const renderedItem = (
      <SurveyQuestionRankingItem
        key={item.value}
        text={text}
        index={index}
        indexText={indexText}
        itemTabIndex={tabIndex}
        handleKeydown={handleKeydown}
        handlePointerDown={handlePointerDown}
        handlePointerUp={handlePointerUp}
        cssClasses={cssClasses}
        itemClass={itemClass}
        question={question}
        unrankedItem={unrankedItem}
        item={item}
      />
    );
    const survey = this.question.survey as SurveyModel;
    let wrappedItem: JSX.Element | null = null;
    if (!!survey) {
      wrappedItem = ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
    }
    return wrappedItem ?? renderedItem;
  }
}

export class SurveyQuestionRankingItem extends ReactSurveyElement {
  protected get text(): string {
    return this.props.text;
  }
  protected get index(): string {
    return this.props.index;
  }
  protected get indexText(): string {
    return this.props.indexText;
  }
  protected get handleKeydown(): (event: any) => void {
    return this.props.handleKeydown;
  }
  protected get handlePointerDown(): (event: any) => void {
    return this.props.handlePointerDown;
  }
  protected get handlePointerUp(): (event: any) => void {
    return this.props.handlePointerUp;
  }
  protected get cssClasses(): any {
    return this.props.cssClasses;
  }
  protected get itemClass(): string {
    return this.props.itemClass;
  }
  protected get itemTabIndex(): number {
    return this.props.itemTabIndex;
  }
  protected get question(): any {
    return this.props.question;
  }
  protected get unrankedItem(): any {
    return this.props.unrankedItem;
  }
  protected get item(): any {
    return this.props.item;
  }

  protected renderEmptyIcon(): JSX.Element {
    return (
      <svg>
        <use xlinkHref={this.question.dashSvgIcon}></use>
      </svg>
    );
  }

  protected renderElement(): JSX.Element {
    return (
      <div
        tabIndex={this.itemTabIndex}
        className={this.itemClass}
        onKeyDown={this.handleKeydown}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
        data-sv-drop-target-ranking-item={this.index}
      >
        <div tabIndex={-1} style={{ outline: "none" }}>
          <div className={this.cssClasses.itemGhostNode} />
          <div className={this.cssClasses.itemContent}>
            <div className={this.cssClasses.itemIconContainer}>
              <svg
                className={this.question.getIconHoverCss()}
              >
                <use xlinkHref={this.question.dragDropSvgIcon}></use>
              </svg>
              <svg
                className={this.question.getIconFocusCss()}
              >
                <use xlinkHref={this.question.arrowsSvgIcon}></use>
              </svg>
            </div>

            <div className={this.question.getItemIndexClasses(this.item)}>
              {(!this.unrankedItem && this.indexText) ? this.indexText : this.renderEmptyIcon()}
            </div>
            <div className={this.cssClasses.controlLabel}>{this.text}</div>
          </div>
        </div>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("ranking", (props) => {
  return React.createElement(SurveyQuestionRanking, props);
});
