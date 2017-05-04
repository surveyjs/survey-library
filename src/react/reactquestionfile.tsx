import * as React from 'react';
import {SurveyQuestionElementBase} from "./reactquestionelement";
import {QuestionFileModel} from "../question_file";
import {ReactQuestionFactory} from "./reactquestionfactory";

export class SurveyQuestionFile extends SurveyQuestionElementBase {
    constructor(props: any) {
        super(props);
        this.state = { fileLoaded: 0 };
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    protected get question(): QuestionFileModel { return this.questionBase as QuestionFileModel; }
    handleOnChange(event) {
        var src = event.target || event.srcElement;
        if (!window["FileReader"]) return;
        if (!src || !src.files || src.files.length < 1) return;
        this.question.loadFile(src.files[0]);
        this.setState({ fileLoaded: this.state.fileLoaded + 1 });
    }
    render(): JSX.Element {
        if (!this.question) return null;
        var img = this.renderImage();
        var fileInput = null;
        if (!this.isDisplayMode) {
            fileInput = <input id={this.question.inputId} type="file" onChange={this.handleOnChange}/>;
        }
        return (
            <div>
                {fileInput}
                {img}
            </div>
        );
    }
    protected renderImage(): JSX.Element {
        if (!this.question.previewValue) return null;
        return (<div>  <img src={this.question.previewValue} height={this.question.imageHeight} width={this.question.imageWidth} /></div>);
    }
}

ReactQuestionFactory.Instance.registerQuestion("file", (props) => {
    return React.createElement(SurveyQuestionFile, props);
});
