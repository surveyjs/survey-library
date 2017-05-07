import * as React from 'react';
import {HashTable} from "../base";

export class ReactQuestionFactory {
    public static Instance: ReactQuestionFactory = new ReactQuestionFactory();
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
