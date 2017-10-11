<template>
    <form :class="question.cssClasses.root">
        <label :class="question.cssClasses.item">
            <input type="checkbox" :name="question.name" :value="question.checkedValue" v-model="question.checkedValue" :id="question.inputId"  :indeterminate.prop="question.isIndeterminate" :disabled="question.isReadOnly" v-bind:aria-label="question.locTitle.renderedHtml"/>
            <span class="checkbox-material"><span class="check"></span></span>
            <survey-string :locString="question.locDisplayLabel"/>
        </label>
    </form>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop, Watch} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionBooleanModel} from '../question_boolean'

    @Component
    export default class Boolean extends Question<QuestionBooleanModel> {
    }
    Vue.component("survey-boolean", Boolean)
</script>