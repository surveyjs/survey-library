<template>
    <div v-html="question.processedHtml"></div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionHtmlModel} from '../question_html'

    @Component
    export default class Html extends Vue {
        @Prop
        question: QuestionHtmlModel
        @Prop
        css: any
    }
    Vue.component("survey-html", Html)
</script>
