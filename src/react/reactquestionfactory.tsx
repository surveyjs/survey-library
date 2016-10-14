import {HashTable} from "../base";

export default class ReactQuestionFactory {
    public static Instance: ReactQuestionFactory = new ReactQuestionFactory();
    public static DefaultChoices = ["one", "two|second value", "three|third value"];
    private creatorHash: HashTable<(name: string) => JSX.Element> = {};

    public registerQuestion(questionType: string, questionCreator: (name: string) => JSX.Element) {
        this.creatorHash[questionType] = questionCreator;
    }
    public getAllTypes(): Array<string> {
        var result = new Array<string>();
        for(var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    }
    public createQuestion(questionType: string, params: any): JSX.Element {
        var creator = this.creatorHash[questionType];
        if (creator == null) return null;
        return creator(params);
    }
}