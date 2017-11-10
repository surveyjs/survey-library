<template>
    <div :class="question.cssClasses.text">{{question.displayValue}}</div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionExpressionModel} from '../question_expression'

    @Component
    export default class Expression extends Question<QuestionExpressionModel> {
    }
    Vue.component("survey-expression", Expression)
</script>
