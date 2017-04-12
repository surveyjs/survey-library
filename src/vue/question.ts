import Vue from 'vue';
import {Question as QuestionModel} from '../question';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class Question<T extends QuestionModel> extends Vue {
    @Prop
    question: T
    @Prop
    css: any
}
