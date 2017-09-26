import Vue from 'vue';
import {Question as QuestionModel} from '../question';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class Question<T extends QuestionModel> extends Vue {
    @Prop
    question: T
    // css prop need only for panel. When panel will have cssClasses property this prop will need to remove
    @Prop
    css: any
    mounted() {
        if(this.question.survey) {
            this.question.survey.afterRenderQuestion(this.question, this.$el);
        }
    }
}
