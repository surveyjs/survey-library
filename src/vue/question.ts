import * as Vue from 'vue'
import {Question as QuestionModel} from '../question'
import {Prop} from 'vue-property-decorator'

export default class Question<T extends QuestionModel> extends Vue {
    @Prop
    question: T
    @Prop
    isEditMode: Boolean
    @Prop
    css: Object
}
