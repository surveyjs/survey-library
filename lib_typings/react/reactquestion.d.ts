// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { QuestionBase } from '../questionbase';
import { Question } from '../question';
export interface ISurveyCreator {
    createQuestionElement(question: QuestionBase): JSX.Element;
    renderError(key: string, errorText: string): JSX.Element;
    questionTitleLocation(): string;
}
export declare class SurveyQuestion extends React.Component<any, any> {
    private questionBase;
    protected question: Question;
    private creator;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setQuestion(question);
    render(): JSX.Element;
    protected renderTitle(): JSX.Element;
    protected renderComment(): JSX.Element;
    protected renderErrors(): JSX.Element;
}
export declare class SurveyQuestionErrors extends React.Component<any, any> {
    protected question: Question;
    private creator;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setQuestion(question);
    render(): JSX.Element;
}
