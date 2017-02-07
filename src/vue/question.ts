import * as Vue from 'vue'
import {Question as QuestionModel} from '../question'

export default class Question<T extends QuestionModel> extends Vue {
    question: T;
    isEditMode: Boolean
    css: Object
}
