import { Base } from "./base";
import { property } from "./decorators";
import { getLocaleString } from "./surveyStrings";
import { SurveyElement } from "./survey-element";
import { surveyCss } from "./defaultCss/defaultCss";
import { settings } from "./settings";
import { Cover } from "./header";
import type { GetProgressTextEvent } from "./survey-events-api";
import type { ILayoutElementModel, IProgressInfo, LayoutElementContainer, ISurveyLayoutElement } from "./base-interfaces";
import type { SurveyModel } from "./survey";

export class SurveyProgressTextModel extends Base implements ILayoutElementModel {
  private readonly key = "progressTextModel";
  public constructor(private survey: SurveyModel) {
    super();
    this.subscribeSurvey();
    this.updateProgressText();
  }

  public createLayoutElements(): Array<ISurveyLayoutElement> {
    return [
      this.createLayoutElement("progress-buttons", "sv-progress-buttons", () => this.survey.progressBar,
        width => this.survey.progressBar.processResponsiveness && this.survey.progressBar.processResponsiveness(width)),
      this.createLayoutElement("progress-questions", "sv-progress-questions", () => this),
      this.createLayoutElement("progress-pages", "sv-progress-pages", () => this),
      this.createLayoutElement("progress-correctquestions", "sv-progress-correctquestions", () => this),
      this.createLayoutElement("progress-requiredquestions", "sv-progress-requiredquestions", () => this)
    ];
  }

  public get progressBarAriaLabel(): string {
    return getLocaleString("progressbar", this.survey.getLocale());
  }
  public get css(): any {
    return this.survey.css;
  }
  public getProgressCssClasses(container: string = ""): string {
    return this.survey.getProgressCssClasses(container);
  }

  public getProgressInfo(): IProgressInfo {
    const pages = this.survey.isDesignMode ? this.survey.pages : this.survey.visiblePages;
    return SurveyElement.getProgressInfoByElements(pages, false);
  }

  public get progressText(): string {
    return this.getPropertyValue("progressText", undefined, () => this.calculateProgressText());
  }

  public get progressValue(): number {
    return this.getPropertyValue("progressValue", undefined, () => this.survey.getProgress());
  }

  public updateProgressText(onValueChanged: boolean = false): void {
    if ((this.survey as any).isShowingPreview) return;
    if (onValueChanged && this.survey.progressBarType == "pages" && this.survey.onGetProgressText.isEmpty) return;
    this.resetPropertyValue("progressText");
    this.resetPropertyValue("progressValue");
  }

  public getProgressText(): string {
    return this.progressText;
  }

  public getProgressValue(): number {
    return this.progressValue;
  }

  public dispose(): void {
    this.survey.onCurrentPageChanged.remove(this.onStateChanged);
    this.survey.onValueChanged.remove(this.onValueChanged);
    this.survey.onPageAdded.remove(this.onStateChanged);
    this.survey.onLocaleChangedEvent.remove(this.onStateChanged);
    this.survey.unRegisterFunctionOnPropertyValueChanged("progressBarType", this.key);
    this.survey.unRegisterFunctionOnPropertyValueChanged("isShowingPreview", this.key);
    this.survey.unRegisterFunctionOnPropertyValueChanged("pages", this.key);
    super.dispose();
  }

  private subscribeSurvey(): void {
    this.survey.onCurrentPageChanged.add(this.onStateChanged);
    this.survey.onValueChanged.add(this.onValueChanged);
    this.survey.onPageAdded.add(this.onStateChanged);
    this.survey.onLocaleChangedEvent.add(this.onStateChanged);
    this.survey.registerFunctionOnPropertyValueChanged("progressBarType", this.onStateChanged, this.key);
    this.survey.registerFunctionOnPropertyValueChanged("isShowingPreview", this.onStateChanged, this.key);
    this.survey.registerFunctionOnPropertyValueChanged("pages", this.onStateChanged, this.key);
  }

  private readonly onStateChanged = (): void => {
    if ((this.survey as any).isLoadingFromJson || !!(this.survey as any).isEndLoadingFromJson) return;
    this.updateProgressText();
  };

  private readonly onValueChanged = (): void => {
    if ((this.survey as any).isLoadingFromJson || !!(this.survey as any).isEndLoadingFromJson) return;
    this.updateProgressText(true);
  };

  private calculateProgressText(): string {
    if (!this.survey.isDesignMode && this.survey.currentPage == null) return "";
    const options: GetProgressTextEvent = {
      questionCount: 0,
      answeredQuestionCount: 0,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
      text: "",
    };
    const type = this.survey.progressBarType.toLowerCase();
    if (type === "questions" || type === "requiredquestions" || type === "correctquestions" || !this.survey.onGetProgressText.isEmpty) {
      const info = this.getProgressInfo();
      options.questionCount = info.questionCount;
      options.answeredQuestionCount = info.answeredQuestionCount;
      options.requiredQuestionCount = info.requiredQuestionCount;
      options.requiredAnsweredQuestionCount = info.requiredAnsweredQuestionCount;
    }

    options.text = this.getProgressTextCore(options);
    this.survey.onGetProgressText.fire(this.survey, options);
    return options.text;
  }

  private getProgressTextCore(info: IProgressInfo): string {
    const type = this.survey.progressBarType.toLowerCase();
    if (type === "questions") {
      return (this.survey as any).getLocalizationFormatString("questionsProgressText", info.answeredQuestionCount, info.questionCount);
    }
    if (type === "requiredquestions") {
      return (this.survey as any).getLocalizationFormatString("questionsProgressText", info.requiredAnsweredQuestionCount, info.requiredQuestionCount);
    }
    if (type === "correctquestions") {
      const correctAnswersCount = this.survey.getCorrectedAnswerCount();
      return (this.survey as any).getLocalizationFormatString("questionsProgressText", correctAnswersCount, info.questionCount);
    }
    const visiblePages = this.survey.isDesignMode ? this.survey.pages : this.survey.visiblePages;
    const index = visiblePages.indexOf(this.survey.currentPage) + 1;
    return (this.survey as any).getLocalizationFormatString("progressText", index, visiblePages.length);
  }

  private createLayoutElement(id: string, component: string, getData: () => any, processResponsiveness?: (width: number) => void): ISurveyLayoutElement {
    const layoutElement: ISurveyLayoutElement = {
      id,
      component,
      getData,
      processResponsiveness,
      isInContainer: (container: LayoutElementContainer) => this.isProgressBarInContainer(layoutElement, container)
    };
    return layoutElement;
  }

  private getProgressBarComponentName(): string {
    let actualProgressBarType = this.survey.progressBarType;
    if (!settings.legacyProgressBarView && surveyCss.currentType === "default") {
      if (isStrCiEqual(actualProgressBarType, "pages")) {
        actualProgressBarType = "buttons";
      }
    }
    return "progress-" + actualProgressBarType;
  }

  private isProgressBarInContainer(layoutElement: ISurveyLayoutElement, container: LayoutElementContainer): boolean {
    if (this.survey.state !== "running" || !isStrCiEqual(layoutElement.id, this.getProgressBarComponentName())) return false;
    if (this.survey.questionsOnPageMode == "singlePage" && this.survey.progressBarType != "questions") return false;

    const headerLayoutElement = this.survey.findLayoutElement("advanced-header");
    const advHeader = headerLayoutElement && headerLayoutElement.data as Cover;
    let isBelowHeader = !advHeader || advHeader.hasBackground;
    if (isStrCiEqual(this.survey.progressBarLocation, "aboveHeader")) {
      isBelowHeader = false;
    }
    if (isStrCiEqual(this.survey.progressBarLocation, "belowHeader")) {
      isBelowHeader = true;
    }

    if (this.survey.showTOC && !(advHeader && advHeader.hasBackground) && !this.survey.isStartPageActive) {
      if (container === "center" && this.survey.isShowProgressBarOnTop) {
        if (!isBelowHeader) {
          layoutElement.index = -150;
        } else {
          delete layoutElement.index;
        }
        return true;
      }
      if (container === "contentBottom" && this.survey.isShowProgressBarOnBottom) {
        layoutElement.index = 150;
        return true;
      }
      return false;
    }

    if (container === "header" && !isBelowHeader) {
      layoutElement.index = -150;
      return this.survey.isShowProgressBarOnTop && !this.survey.isStartPageActive;
    }
    if (container === "center" && isBelowHeader) {
      if (!!layoutElement.index) {
        delete layoutElement.index;
      }
      return this.survey.isShowProgressBarOnTop && !this.survey.isStartPageActive;
    }
    if (container === "footer") {
      return this.survey.isShowProgressBarOnBottom && !this.survey.isStartPageActive;
    }
    return false;
  }
}

function isStrCiEqual(a: string, b: string) {
  if (!a) return false;
  if (!b) return false;
  return a.toUpperCase() === b.toUpperCase();
}