import * as React from 'react';
import {Survey} from "./reactSurvey";
import {SurveyModel} from "../survey";

export class SurveyWindow extends Survey {
    private title: string;
    constructor(props: any) {
        super(props);
        this.handleOnExpanded = this.handleOnExpanded.bind(this);
    }
    handleOnExpanded(event) {
        this.state.expanded = !this.state.expanded;
        this.setState(this.state);
    }
    render(): JSX.Element {
        if (this.state.hidden) return null;
        var header = this.renderHeader();
        var body = this.state.expanded ? this.renderBody() : null;
        var style = { position: "fixed", bottom: "3px", right: "10px" };
        return <div className={this.css.window.root} style={style}>
            {header}
            {body}
            </div>;
        
    }
    protected renderHeader(): JSX.Element {
        var styleA = { width: "100%" };
        var styleTitle = { paddingRight: "10px" };
        var glyphClassName = this.state.expanded ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
        glyphClassName = "glyphicon pull-right " + glyphClassName;
        return <div className={this.css.window.header.root}>
            <a href="#" onClick={this.handleOnExpanded} style={styleA}>
                <span className={this.css.window.header.title} style={styleTitle}>{this.title}</span>
                <span className={glyphClassName} aria-hidden="true"></span>
            </a>
        </div>;
    }
    protected renderBody(): JSX.Element {
        return <div className={this.css.window.body}>
        {this.renderSurvey() }
            </div>
    }
    protected updateSurvey(newProps: any) {
        super.updateSurvey(newProps);
        this.title = newProps.title ? newProps.title : this.survey.title;
        var hasExpanded = newProps["expanded"] ? newProps.expanded : false;
        this.state = { expanded: hasExpanded, hidden: false };
        var self = this;
        this.survey.onComplete.add(function (s: SurveyModel) {
            self.state.hidden = true;
            self.setState(self.state);
        });
    }
}