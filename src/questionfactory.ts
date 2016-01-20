/// <reference path="question.ts" />
/// <reference path="base.ts" />
module Survey {
    export class QuestionFactory {
        public static Instance: QuestionFactory = new QuestionFactory();
        public static DefaultChoices = ["one", "two|second value", { value: 3, text: "third value" }];
        private creatorHash: HashTable<(name: string) => Question> = {};

        public registerQuestion(questionType: string, questionCreator: (name: string) => Question) {
            this.creatorHash[questionType] = questionCreator;
        }
        public getAllTypes(): Array<string> {
            var result = new Array<string>();
            for(var key in this.creatorHash) {
                result.push(key);
            }
            return result.sort();
        }
        public createQuestion(questionType: string, name: string): Question {
            var creator = this.creatorHash[questionType];
            if (creator == null) return null;
            return creator(name);
        }
    }
}