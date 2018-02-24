<template>
    <div :class="question.cssClasses.text">{{question.displayValue}}</div>
</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Prop} from 'vue-property-decorator'
    import {default as QuestionVue} from './question'
    import {QuestionExpressionModel} from '../question_expression'

    @Component
    export class Expression extends QuestionVue<QuestionExpressionModel> {
    }
    Vue.component("survey-expression", Expression)
    export default Expression;
</script>
