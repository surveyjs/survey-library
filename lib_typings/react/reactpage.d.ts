// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { QuestionRowModel } from "../page";
import { QuestionBase } from "../questionbase";
export declare class SurveyPage extends React.Component<any, any> {
    private page;
    private survey;
    private creator;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    protected createRow(row: QuestionRowModel, index: number): JSX.Element;
    protected renderTitle(): JSX.Element;
}
export declare class SurveyRow extends React.Component<any, any> {
    private row;
    private survey;
    private creator;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setProperties(props);
    render(): JSX.Element;
    protected createQuestion(question: QuestionBase): JSX.Element;
}
