// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { ISurveyCreator } from "./reactquestion";
import { MatrixDropdownCell } from "../question_matrixdropdownbase";
export declare class SurveyQuestionMatrixDynamic extends React.Component<any, any> {
    private question;
    protected css: any;
    protected rootCss: any;
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setProperties(nextProps);
    handleOnRowAddClick(event: any): void;
    render(): JSX.Element;
    protected renderAddRowButton(): JSX.Element;
}
export declare class SurveyQuestionMatrixDynamicRow extends React.Component<any, any> {
    private row;
    private question;
    private index;
    protected css: any;
    protected rootCss: any;
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setProperties(nextProps);
    handleOnRowRemoveClick(event: any): void;
    render(): JSX.Element;
    protected renderQuestion(cell: MatrixDropdownCell): JSX.Element;
    protected renderButton(): JSX.Element;
}
