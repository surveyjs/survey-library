<template>
    <div role="alert" v-show="!!question.errors && question.errors.length > 0" :class="css.error.root">
        <div v-for="error in question.errors">
            <span :class="css.error.icon" aria-hidden="true"></span>
            <span :class="css.error.item">{{error.getText()}}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {Question as QuestionModel} from '../question'

    @Component
    export default class Errors extends Vue {
        @Prop
        question: QuestionModel
        @Prop
        css: any
    }
    Vue.component("survey-errors", Errors)
</script>
