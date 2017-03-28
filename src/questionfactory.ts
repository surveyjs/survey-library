import {QuestionBase} from './questionbase';
import {IElement, HashTable} from "./base";


//TODO replace completely with ElementFactory
export class QuestionFactory {
    public static Instance: QuestionFactory = new QuestionFactory();
    public static DefaultChoices = ["1|first item", "2|second item", "3|third item"];
    private creatorHash: HashTable<(name: string) => QuestionBase> = {};

    public registerQuestion(questionType: string, questionCreator: (name: string) => QuestionBase) {
        this.creatorHash[questionType] = questionCreator;
    }
    public clear() {
        this.creatorHash = {};
    }
    public getAllTypes(): Array<string> {
        var result = new Array<string>();
        for(var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    }
    public createQuestion(questionType: string, name: string): QuestionBase {
        var creator = this.creatorHash[questionType];
        if (creator == null) return null;
        return creator(name);
    }
}

export class ElementFactory {
    public static Instance: ElementFactory = new ElementFactory();
    private creatorHash: HashTable<(name: string) => IElement> = {};

    public registerElement(elementType: string, elementCreator: (name: string) => IElement) {
        this.creatorHash[elementType] = elementCreator;
    }
    public clear() {
        this.creatorHash = {};
    }
    public getAllTypes(): Array<string> {
        var result = QuestionFactory.Instance.getAllTypes();
        for(var key in this.creatorHash) {
            result.push(key);
        }
        return result.sort();
    }
    public createElement(elementType: string, name: string): IElement {
        var creator = this.creatorHash[elementType];
        if (creator == null) return QuestionFactory.Instance.createQuestion(elementType, name);
        return creator(name);
    }
}