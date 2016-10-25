// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from "react";
import { ReactSurveyModel } from "./reactsurveymodel";
import { QuestionBase } from "../questionbase";
import { ISurveyCreator } from "./reactquestion";
export declare class Survey extends React.Component<any, any> implements ISurveyCreator {
    static cssType: string;
    protected survey: ReactSurveyModel;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    css: any;
    protected renderCompleted(): JSX.Element;
    protected renderLoading(): JSX.Element;
    protected renderSurvey(): JSX.Element;
    protected renderTitle(): JSX.Element;
    protected renderPage(): JSX.Element;
    protected renderProgress(isTop: boolean): JSX.Element;
    protected renderNavigation(): JSX.Element;
    protected renderEmptySurvey(): JSX.Element;
    protected updateSurvey(newProps: any): void;
    protected setSurveyEvents(newProps: any): void;
    createQuestionElement(question: QuestionBase): JSX.Element;
    renderError(key: string, errorText: string): JSX.Element;
    questionTitleLocation(): string;
}
