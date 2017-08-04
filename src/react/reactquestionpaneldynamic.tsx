import * as React from 'react';
import {ReactSurveyElement, SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionPanelDynamicModel, QuestionPanelDynamicItem} from "../question_paneldynamic";
import {PanelModel} from "../panel";
import {SurveyPanel} from "./reactpage";
import {ISurveyCreator, SurveyQuestionErrors} from "./reactquestion";
import {surveyCss} from "../defaultCss/cssstandard";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionPanelDynamic extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    protected get question(): QuestionPanelDynamicModel { return this.questionBase as QuestionPanelDynamicModel; }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.setProperties(nextProps);
    }
    private setProperties(nextProps: any) {
        var self = this;
        this.state = { panelCounter: 0 };
        this.question.panelCountChangedCallback = function () {
            self.state.panelCounter = self.state.panelCounter + 1;
            self.setState(self.state);
        };
        this.handleOnPanelAddClick = this.handleOnPanelAddClick.bind(this);
    }
    handleOnPanelAddClick(event) {
        this.question.addPanel();
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var cssClasses = this.question.cssClasses;
        var panels = [];
        for (var i = 0; i < this.question.panels.length; i++) {
            var panel = this.question.panels[i];
            panels.push(<SurveyQuestionPanelDynamicItem key={i} panel={panel} question={this.question} index={i} cssClasses={cssClasses} isDisplayMode={this.isDisplayMode} creator={this.creator} />);
        }
        var btnDeleteTD = !this.isDisplayMode ? <th></th> : null;
        return (
            <div>
                {panels}
                {this.renderAddRowButton(cssClasses) }
                <hr/>
            </div>
        );
    }
    protected renderAddRowButton(cssClasses: any): JSX.Element {
        if (this.isDisplayMode || !this.question.canAddPanel) return null;
        return <input className={cssClasses.button} type="button" onClick={this.handleOnPanelAddClick} value={this.question.panelAddText} />;
    }
}

export class SurveyQuestionPanelDynamicItem extends ReactSurveyElement {
    private panel: PanelModel;
    private question: QuestionPanelDynamicModel;
    private index: number;
    protected creator: ISurveyCreator;
    constructor(props: any) {
        super(props);
        this.setProperties(props);
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.setProperties(nextProps);
    }
    private setProperties(nextProps: any) {
        this.panel = nextProps.panel;
        this.question = nextProps.question;
        this.index = nextProps.index;
        this.creator = nextProps.creator;
        this.handleOnPanelRemoveClick = this.handleOnPanelRemoveClick.bind(this);
    }
    handleOnPanelRemoveClick(event) {
        this.question.removePanel(this.index);
    }
    render(): JSX.Element {
        if (!this.panel) return null;
        this.question.survey
        var panel = <SurveyPanel key={this.index} panel={this.panel} css={surveyCss.getCss()} survey={this.question.survey} creator={this.creator} />;
        var removeButton = this.renderButton();
        return (
            <div>
            {panel}
            {removeButton}
            </div>
        );
    }
    protected renderButton(): JSX.Element {
        if(this.isDisplayMode || !this.question.canRemovePanel) return null;        
        return <input className={this.cssClasses.button} type="button" onClick={this.handleOnPanelRemoveClick} value={this.question.panelRemoveText} />;
    }
}

ReactQuestionFactory.Instance.registerQuestion("paneldynamic", (props) => {
    return React.createElement(SurveyQuestionPanelDynamic, props);
});