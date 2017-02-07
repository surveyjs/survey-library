<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {Question as QuestionModel} from '../question'

    @Component({
        props: {
            question: QuestionModel,
            isEditMode: Boolean,
            css: surveyCss
        }
    })
    export default class Question<T extends QuestionModel> extends Vue {
        question: T;
        isEditMode: Boolean
        css: Object
        constructor () {
            super();
        }
    }
</script>