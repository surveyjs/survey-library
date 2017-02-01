import Vue from 'vue';
import Component from 'vue-class-component';

import {surveyCss} from "../defaultCss/cssstandard";
import {QuestionBase} from "../questionbase";
import {SurveyPageId} from "../base";

import {VueSurveyModel} from "./vueSurveyModel";
/*
import {SurveyPage} from "./reactpage";
import {SurveyNavigation} from "./reactSurveyNavigation";
import {ISurveyCreator} from "./reactquestion";
import {ReactQuestionFactory} from "./reactquestionfactory";
import {SurveyProgress} from "./reactSurveyProgress";
*/

@Component({
    props: {
        json: Object
    },
    template: '<div>{{model.questions[0].name}}</div>'
})
export class Survey extends Vue {
    model: VueSurveyModel;

    constructor () {
        super();
        this.model = new VueSurveyModel(this.json);
    }
}

// @Component({
//     // сюда можно помещать все опции компонента
//     template: '<button @click="onClick">Click!</button>'
// })
// export class Survey extends Vue {
//     // computed
//     static get computedMsg () {
//         return 'computed ';
//     }
//
//     constructor () {
//         super();
//     }
//
//     // Данные инициализации могут быть объявлены как свойства инстанса
//     private message: string = 'Hello!';
//     // Методы компонента могут быть объявлены как методы инстанса
//     onClick (): void {
//         window.alert(this.message)
//     }
//
//     public renderError(): string {
//         return "survey error";
//     }
// }