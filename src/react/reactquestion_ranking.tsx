import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase,
} from "./reactquestion_element";
import { QuestionRankingModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyModel } from "./reactsurveymodel";
import { ItemValue } from "../itemvalue";

export class SurveyQuestionRanking extends SurveyQuestionElementBase {
  protected get question(): QuestionRankingModel {
    return this.questionBase as QuestionRankingModel;
  }

  protected renderElement(): JSX.Element {
    return (
      <div
        className={this.question.rootClass}
        ref={(root) => (this.control = root)}
      >
        {this.getItems()}
      </div>
    );
  }

  protected getItems(): Array<any> {
    const items = [];
    const rankingChoices = this.question.rankingChoices;
    for (let i = 0; i < rankingChoices.length; i++) {
      const item = rankingChoices[i];
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
          this.question.cssClasses,
          this.question.getItemClass(item),
          this.question
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
    cssClasses: any,
    itemClass: string,
    question: QuestionRankingModel
  ): JSX.Element {
    const key: string = item.value + "-" + i + "-item";
    const text: JSX.Element = this.renderLocString(item.locText);
    const index = i;
    const indexText: string = this.question.getNumberByIndex(i);
    const renderedItem = (
      <SurveyQuestionRankingItem
        key={key}
        text={text}
        index={index}
        indexText={indexText}
        handleKeydown={handleKeydown}
        handlePointerDown={handlePointerDown}
        cssClasses={cssClasses}
        itemClass={itemClass}
        question={question}
      />
    );
    const survey = this.question.survey as ReactSurveyModel;
    let wrappedItem = null;
    if (!!survey) {
      wrappedItem = survey.wrapItemValue(renderedItem, this.question, item);
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
  protected get cssClasses(): any {
    return this.props.cssClasses;
  }
  protected get itemClass(): string {
    return this.props.itemClass;
  }
  protected get question(): any {
    return this.props.question;
  }

  protected renderElement(): JSX.Element {
    return (
      <div
        tabIndex={0}
        className={this.itemClass}
        onKeyDown={this.handleKeydown}
        onPointerDown={this.handlePointerDown}
        data-sv-drop-target-ranking-item={this.index}
      >
        <div tabIndex={-1} style={{ outline: "none" }}>
          <div className={this.cssClasses.itemGhostNode} />
          <div className={this.cssClasses.itemContent}>
            <div className={this.cssClasses.itemIconContainer}>
              <svg
                width="10"
                height="16"
                viewBox="0 0 10 16"
                className={this.question.getIconHoverCss()}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 2C6 0.9 6.9 0 8 0C9.1 0 10 0.9 10 2C10 3.1 9.1 4 8 4C6.9 4 6 3.1 6 2ZM2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" />
              </svg>
              <svg
                width="10"
                height="24"
                viewBox="0 0 10 24"
                className={this.question.getIconFocusCss()}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 5L5 0L0 5H4V9H6V5H10Z" />
                <path d="M6 19V15H4V19H0L5 24L10 19H6Z" />
              </svg>
            </div>

            <div className={this.cssClasses.itemIndex}>{this.indexText}</div>
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
