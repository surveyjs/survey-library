import * as React from 'react';
import {ItemValue} from "../base";
import {QuestionBase} from '../questionbase';
import {ISurveyCreator} from "./reactquestion";
import {SurveyQuestionCommentItem} from "./reactquestioncomment";

export class SurveyElementBase extends React.Component<any, any> {
    protected css: any;
    protected rootCss: any;
    protected isDisplayMode: boolean;
    constructor(props: any) {
        super(props);
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.isDisplayMode = props.isDisplayMode || false;
    }
    componentWillReceiveProps(nextProps: any) {
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.isDisplayMode = nextProps.isDisplayMode || false;
    }
}

export class SurveyQuestionElementBase extends SurveyElementBase {
    protected questionBase: QuestionBase;
    protected creator: ISurveyCreator;
    constructor(props: any) {
        super(props);
        this.questionBase = props.question;
        this.creator = props.creator;
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.questionBase = nextProps.question;
        this.creator = nextProps.creator;
    }
}
