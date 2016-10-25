// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { ISurveyCreator } from "./reactquestion";
import { MatrixDropdownCell } from "../question_matrixdropdownbase";
export declare class SurveyQuestionMatrixDropdown extends React.Component<any, any> {
    private question;
    protected css: any;
    protected rootCss: any;
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setProperties(nextProps);
    render(): JSX.Element;
}
export declare class SurveyQuestionMatrixDropdownRow extends React.Component<any, any> {
    private row;
    protected css: any;
    protected rootCss: any;
    protected creator: ISurveyCreator;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    private setProperties(nextProps);
    render(): JSX.Element;
    protected renderSelect(cell: MatrixDropdownCell): JSX.Element;
}
