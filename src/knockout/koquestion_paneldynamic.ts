import * as ko from "knockout";
import {
  SurveyElement, Serializer, QuestionFactory,
  QuestionPanelDynamicModel
} from "survey-core";
import { QuestionImplementor } from "./koquestion";

export class QuestionPanelDynamicImplementor extends QuestionImplementor {
  koRecalc: any;
  constructor(question: QuestionPanelDynamic) {
    super(question);
    this.koRecalc = ko.observable(0);
    this.setCallbackFunc("koAddPanelClick", () => {
      this.addPanel();
    });
    this.setCallbackFunc("koRemovePanelClick", (data: any) => {
      this.removePanel(data);
    });
    this.setCallbackFunc("koPrevPanelClick", () => {
      this.question.goToPrevPanel();
    });
    this.setCallbackFunc("koNextPanelClick", () => {
      this.question.goToNextPanel();
    });
    this.setObservaleObj(
      "koCanAddPanel",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.canAddPanel;
      })
    );
    this.setObservaleObj(
      "koCanRemovePanel",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.canRemovePanel;
      })
    );
    this.setObservaleObj(
      "koIsPrevButton",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.isPrevButtonVisible;
      })
    );
    this.setObservaleObj(
      "koIsNextButton",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.isNextButtonVisible;
      })
    );
    this.setObservaleObj(
      "koIsRange",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.isRangeShowing;
      })
    );
    this.setObservaleObj(
      "koPanel",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.currentPanel;
      })
    );
    this.setObservaleObj(
      "koIsList",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.isRenderModeList;
      })
    );
    this.setObservaleObj(
      "koIsProgressTop",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.isProgressTopShowing;
      })
    );
    this.setObservaleObj(
      "koIsProgressBottom",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.isProgressBottomShowing;
      })
    );

    const koRangeValue = ko.observable(this.question.currentIndex);
    koRangeValue.subscribe((newValue: any) => {
      this.question.currentIndex = newValue;
    });
    this.setObservaleObj("koRangeValue", koRangeValue);
    this.setObservaleObj(
      "koRangeMax",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.visiblePanelCount - 1;
      })
    );

    this.setObservaleObj(
      "koAddButtonCss",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.getAddButtonCss();
      })
    );

    this.setObservaleObj(
      "koPrevButtonCss",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.getPrevButtonCss();
      })
    );

    this.setObservaleObj(
      "koNextButtonCss",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.getNextButtonCss();
      })
    );

    this.setObservaleObj(
      "koProgressText",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.progressText;
      })
    );

    this.setObservaleObj(
      "koProgress",
      ko.pureComputed(() => {
        this.koRecalc();
        return this.question.progress;
      })
    );
    this.setCallbackFunc("koPanelAfterRender", (el: any, con: any) => {
      this.panelAfterRender(el, con);
    });
    this.question.panelCountChangedCallback = () => {
      this.onPanelCountChanged();
    };
    this.question.renderModeChangedCallback = () => {
      this.onRenderModeChanged();
    };
    this.question.currentIndexChangedCallback = () => {
      this.onCurrentIndexChanged();
    };
  }
  protected onPanelCountChanged() {
    this.onCurrentIndexChanged();
  }
  protected onRenderModeChanged() {
    this.onCurrentIndexChanged();
  }
  protected onCurrentIndexChanged() {
    if (this.question.isDisposed) return;
    this.koRecalc(this.koRecalc() + 1);
    this.question.koRangeValue(
      this.question.currentIndex
    );
  }
  protected addPanel() {
    this.question.addPanelUI();
  }
  protected removePanel(val: any) {
    if (!this.question.isRenderModeList) {
      val = this.question.currentPanel;
    }
    this.question.removePanelUI(val);
  }
  private panelAfterRender(elements: any, con: any) {
    if (!this.question || !this.question.survey) return;
    const el = SurveyElement.GetFirstNonTextElement(elements);
    this.question.survey.afterRenderPanel(con, el);
  }
  public dispose(): void {
    this.question.panelCountChangedCallback = undefined;
    this.question.renderModeChangedCallback = undefined;
    this.question.currentIndexChangedCallback = undefined;
    super.dispose();
  }
}

export class QuestionPanelDynamic extends QuestionPanelDynamicModel {
  private _implementor: QuestionPanelDynamicImplementor;
  constructor(name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    this._implementor = new QuestionPanelDynamicImplementor(this);
  }
  public dispose(): void {
    this._implementor.dispose();
    this._implementor = undefined;
    super.dispose();
  }
}

Serializer.overrideClassCreator("paneldynamic", function () {
  return new QuestionPanelDynamic("");
});

QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => {
  return new QuestionPanelDynamic(name);
});
