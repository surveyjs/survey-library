import * as ko from "knockout";
import { SurveyElement } from "../base";
import { Serializer } from "../jsonobject";
import { QuestionFactory } from "../questionfactory";
import { QuestionImplementor } from "./koquestion";
import {
  QuestionPanelDynamicModel,
  QuestionPanelDynamicItem
} from "../question_paneldynamic";
import { Question } from "../question";
import { PanelModel } from "../panel";
import { Panel } from "./kopage";

export class QuestionPanelDynamicImplementor extends QuestionImplementor {
  koRecalc: any;
  koAddPanelClick: any;
  koRemovePanelClick: any;
  koButtonAddCss: any;
  koButtonPrevCss: any;
  koButtonNextCss: any;
  koPrevPanelClick: any;
  koNextPanelClick: any;
  koCanAddPanel: any;
  koCanRemovePanel: any;
  koProgressText: any;
  koProgress: any;
  koPanel: any;
  koIsList: any;
  koIsProgressTop: any;
  koIsProgressBottom: any;
  koIsNextButton: any;
  koIsPrevButton: any;
  koIsRange: any;
  koRangeValue: any;
  koRangeMax: any;
  constructor(question: Question) {
    super(question);
    this.koRecalc = ko.observable(0);
    var self = this;
    this.koAddPanelClick = function() {
      self.addPanel();
    };
    this.koRemovePanelClick = function(data: any) {
      self.removePanel(data);
    };
    this.koPrevPanelClick = function() {
      (<QuestionPanelDynamic>self.question).goToPrevPanel();
    };
    this.koNextPanelClick = function() {
      (<QuestionPanelDynamic>self.question).goToNextPanel();
    };

    this.koCanAddPanel = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).canAddPanel;
    });
    this.koCanRemovePanel = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).canRemovePanel;
    });
    this.koIsPrevButton = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).isPrevButtonShowing;
    });
    this.koIsNextButton = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).isNextButtonShowing;
    });
    this.koIsRange = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).isRangeShowing;
    });
    this.koPanel = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).currentPanel;
    });
    this.koIsList = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).isRenderModeList;
    });
    this.koIsProgressTop = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).isProgressTopShowing;
    });
    this.koIsProgressBottom = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).isProgressBottomShowing;
    });

    this.koRangeValue = ko.observable(
      (<QuestionPanelDynamic>self.question).currentIndex
    );
    this.koRangeValue.subscribe(function(newValue: any) {
      (<QuestionPanelDynamic>self.question).currentIndex = newValue;
    });
    this.koRangeMax = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).panelCount - 1;
    });

    this.koButtonAddCss = ko.pureComputed(function() {
      self.koRecalc();
      return self.buttonAddCss;
    });

    this.koButtonNextCss = ko.pureComputed(function() {
      self.koRecalc();
      return self.buttonNextCss;
    });

    this.koButtonPrevCss = ko.pureComputed(function() {
      self.koRecalc();
      return self.buttonPrevCss;
    });

    this.koProgressText = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).progressText;
    });

    this.koProgress = ko.pureComputed(function() {
      self.koRecalc();
      return self.progress;
    });

    (<any>this.question)["koAddPanelClick"] = this.koAddPanelClick;
    (<any>this.question)["koRemovePanelClick"] = this.koRemovePanelClick;
    (<any>this.question)["koPrevPanelClick"] = this.koPrevPanelClick;
    (<any>this.question)["koNextPanelClick"] = this.koNextPanelClick;
    (<any>this.question)["koCanAddPanel"] = this.koCanAddPanel;
    (<any>this.question)["koCanRemovePanel"] = this.koCanRemovePanel;
    (<any>this.question)["koProgressText"] = this.koProgressText;
    (<any>this.question)["koProgress"] = this.koProgress;
    (<any>this.question)["koPanel"] = this.koPanel;
    (<any>this.question)["koIsList"] = this.koIsList;
    (<any>this.question)["koIsProgressTop"] = this.koIsProgressTop;
    (<any>this.question)["koIsProgressBottom"] = this.koIsProgressBottom;
    (<any>this.question)["koIsPrevButton"] = this.koIsPrevButton;
    (<any>this.question)["koIsNextButton"] = this.koIsNextButton;
    (<any>this.question)["koIsRange"] = this.koIsRange;
    (<any>this.question)["koRangeValue"] = this.koRangeValue;
    (<any>this.question)["koRangeMax"] = this.koRangeMax;
    (<any>this.question)["koButtonAddCss"] = this.koButtonAddCss;
    (<any>this.question)["koButtonNextCss"] = this.koButtonNextCss;
    (<any>this.question)["koButtonPrevCss"] = this.koButtonPrevCss;

    (<any>this.question)["koPanelAfterRender"] = function(el: any, con: any) {
      self.panelAfterRender(el, con);
    };
    (<QuestionPanelDynamic>(
      this.question
    )).panelCountChangedCallback = function() {
      self.onPanelCountChanged();
    };
    (<QuestionPanelDynamic>(
      this.question
    )).renderModeChangedCallback = function() {
      self.onRenderModeChanged();
    };
    (<QuestionPanelDynamic>(
      this.question
    )).currentIndexChangedCallback = function() {
      self.onCurrentIndexChanged();
    };
  }
  protected onPanelCountChanged() {
    this.onCurrentIndexChanged();
  }
  protected onRenderModeChanged() {
    this.onCurrentIndexChanged();
  }
  protected onCurrentIndexChanged() {
    this.koRecalc(this.koRecalc() + 1);
    this.koRangeValue((<QuestionPanelDynamic>this.question).currentIndex);
  }
  protected addPanel() {
    (<QuestionPanelDynamic>this.question).addPanelUI();
  }
  protected removePanel(val: any) {
    var q = <QuestionPanelDynamic>this.question;
    if (!q.isRenderModeList) {
      val = q.currentPanel;
    }
    q.removePanelUI(val);
  }
  private panelAfterRender(elements: any, con: any) {
    if (!this.question || !this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    this.question.survey.afterRenderPanel(con, el);
  }

  protected get buttonAddCss() {
    var question = this.question;
    var btnClasses =
      question.cssClasses.button + " " + question.cssClasses.buttonAdd;

    if (this.question.renderMode === "list") {
      btnClasses += " " + question.cssClasses.buttonAdd + "--list-mode";
    }

    return btnClasses;
  }

  protected get buttonPrevCss() {
    var question = this.question;
    var btnClasses = question.cssClasses.buttonPrev;
    if (!question.isPrevButtonShowing) {
      btnClasses += " " + question.cssClasses.buttonPrev + "--disabled";
    }
    return btnClasses;
  }

  protected get buttonNextCss() {
    var question = this.question;
    var btnClasses = question.cssClasses.buttonNext;
    if (!question.isNextButtonShowing) {
      btnClasses += " " + question.cssClasses.buttonNext + "--disabled";
    }
    return btnClasses;
  }

  protected get progress() {
    var rangeMax = this.question.panelCount - 1;
    return (this.question.currentIndex / rangeMax) * 100 + "%";
  }
}

export class QuestionPanelDynamic extends QuestionPanelDynamicModel {
  constructor(public name: string) {
    super(name);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new QuestionPanelDynamicImplementor(this);
  }
  protected createNewPanelObject(): PanelModel {
    return new Panel();
  }
}

Serializer.overrideClassCreator("paneldynamic", function() {
  return new QuestionPanelDynamic("");
});

QuestionFactory.Instance.registerQuestion("paneldynamic", name => {
  return new QuestionPanelDynamic(name);
});
