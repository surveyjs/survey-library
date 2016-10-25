// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
export declare class SurveyProgress extends React.Component<any, any> {
    private survey;
    protected isTop: boolean;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    protected progress: number;
    protected progressText: string;
    render(): JSX.Element;
}
