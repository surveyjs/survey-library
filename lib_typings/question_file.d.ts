// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Question } from "./question";
import { SurveyError } from "./base";
export declare class QuestionFileModel extends Question {
    name: string;
    private showPreviewValue;
    private isUploading;
    previewValueLoadedCallback: () => void;
    imageHeight: string;
    imageWidth: string;
    storeDataAsText: boolean;
    maxSize: number;
    constructor(name: string);
    getType(): string;
    showPreview: boolean;
    loadFile(file: File): void;
    previewValue: any;
    protected setFileValue(file: File): void;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    private checkFileForErrors(file);
    private isFileImage(file);
}
