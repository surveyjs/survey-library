import * as ko from "knockout";
import { SurveyElement } from "../base";
import { JsonObject } from "../jsonobject";
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
  koPanels: any;
  koRecalc: any;
  koAddPanelClick: any;
  koRemovePanelClick: any;
  koPrevPanelClick: any;
  koNextPanelClick: any;
  koCanAddPanel: any;
  koCanRemovePanel: any;
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
    this.koPanels = ko.pureComputed(function() {
      this.koRecalc();
      return (<QuestionPanelDynamic>this.question).panels;
    }, this);

    this.question["koPanels"] = this.koPanels;
    var self = this;
    this.koAddPanelClick = function() {
      self.addPanel();
    };
    this.koRemovePanelClick = function(data) {
      self.removePanel(data);
    };
    this.koPrevPanelClick = function() {
      (<QuestionPanelDynamic>self.question).currentIndex--;
    };
    this.koNextPanelClick = function() {
      (<QuestionPanelDynamic>self.question).currentIndex++;
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
    this.koRangeValue.subscribe(function(newValue) {
      (<QuestionPanelDynamic>self.question).currentIndex = newValue;
    });
    this.koRangeMax = ko.pureComputed(function() {
      self.koRecalc();
      return (<QuestionPanelDynamic>self.question).panelCount - 1;
    });

    this.question["koAddPanelClick"] = this.koAddPanelClick;
    this.question["koRemovePanelClick"] = this.koRemovePanelClick;
    this.question["koPrevPanelClick"] = this.koPrevPanelClick;
    this.question["koNextPanelClick"] = this.koNextPanelClick;
    this.question["koCanAddPanel"] = this.koCanAddPanel;
    this.question["koCanRemovePanel"] = this.koCanRemovePanel;
    this.question["koPanel"] = this.koPanel;
    this.question["koIsList"] = this.koIsList;
    this.question["koIsProgressTop"] = this.koIsProgressTop;
    this.question["koIsProgressBottom"] = this.koIsProgressBottom;
    this.question["koIsPrevButton"] = this.koIsPrevButton;
    this.question["koIsNextButton"] = this.koIsNextButton;
    this.question["koIsRange"] = this.koIsRange;
    this.question["koRangeValue"] = this.koRangeValue;
    this.question["koRangeMax"] = this.koRangeMax;

    this.question["koPanelAfterRender"] = function(el, con) {
      self.panelAfterRender(el, con);
    };
    (<QuestionPanelDynamic>this
      .question).panelCountChangedCallback = function() {
      self.onPanelCountChanged();
    };
    (<QuestionPanelDynamic>this
      .question).renderModeChangedCallback = function() {
      self.onRenderModeChanged();
    };
    (<QuestionPanelDynamic>this
      .question).currentIndexChangedCallback = function() {
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
  private panelAfterRender(elements, con) {
    if (!this.question || !this.question.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    this.question.survey.afterRenderPanel(con, el);
  }
}

export class QuestionPanelDynamic extends QuestionPanelDynamicModel {
  constructor(public name: string) {
    super(name);
    new QuestionPanelDynamicImplementor(this);
  }
  protected createNewPanelObject(): PanelModel {
    return new Panel();
  }
}

JsonObject.metaData.overrideClassCreatore("paneldynamic", function() {
  return new QuestionPanelDynamic("");
});

QuestionFactory.Instance.registerQuestion("paneldynamic", name => {
  return new QuestionPanelDynamic(name);
});
