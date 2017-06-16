<template>
    <div role="alert" v-show="!!question.errors && question.errors.length > 0" :class="question.cssClasses ? question.cssClasses.error.root : 'panel-error-root'">
        <div v-for="error in question.errors">
            <span :class="question.cssClasses ? question.cssClasses.error.icon : 'panel-error-icon'" aria-hidden="true"></span>
            <span :class="question.cssClasses ? question.cssClasses.error.item : 'panel-error-item'">{{error.getText()}}</span>
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
    }
    Vue.component("survey-errors", Errors)
</script>
