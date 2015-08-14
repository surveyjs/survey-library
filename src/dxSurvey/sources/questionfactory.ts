/// <reference path="question.ts" />
/// <reference path="base.ts" />
module dxSurvey {
    export class QuestionFactory {
        public static Instance: QuestionFactory = new QuestionFactory();
        private creatorHash: HashTable<(name: string) => Question> = {};

        public registerQuestion(questionType: string, questionCreator: (name: string) => Question) {
            this.creatorHash[questionType] = questionCreator;
        }
        public createQuestion(questionType: string, name: string): Question {
            var creator = this.creatorHash[questionType];
            if (creator == null) return null;
            return creator(name);
        }
    }
}