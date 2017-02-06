<template>
    <div>
    Question
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {Question} from '../question'

    @Component({
        props: {
            question: Question,
            isEditMode: Boolean,
            css: surveyCss
        }
    })
    export default class SurveyQuestion<T extends Question> extends Vue {
        question: T;
        isEditMode: Boolean
        css: Object
        constructor () {
            super();
        }
    }
</script>