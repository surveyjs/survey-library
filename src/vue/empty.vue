<template>
    <div></div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop, Watch} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionEmptyModel} from '../question_empty'

    @Component
    export class Empty extends Question<QuestionEmptyModel> {
    }
    Vue.component("survey-empty", Empty)
    export default Empty;
</script>