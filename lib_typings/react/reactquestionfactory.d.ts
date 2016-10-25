// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

export declare class ReactQuestionFactory {
    static Instance: ReactQuestionFactory;
    static DefaultChoices: string[];
    private creatorHash;
    registerQuestion(questionType: string, questionCreator: (name: string) => JSX.Element): void;
    getAllTypes(): Array<string>;
    createQuestion(questionType: string, params: any): JSX.Element;
}
