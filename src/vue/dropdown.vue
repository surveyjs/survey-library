<template>
    <div :class="question.cssClasses.root">
        <select v-if="!question.isReadOnly" :id="question.inputId" v-model="question.value" :class="question.cssClasses.control">
            <option value=undefined>{{question.optionsCaption}}</option>
            <option v-for="(item, index) in question.visibleChoices" :value="item.value">{{item.text}}</option>
        </select>
        <div v-else :text="question.displayValue" :class="question.cssClasses.control"></div>
        <survey-other-choice v-show="question.hasOther && question.isOtherSelected" :class="question.cssClasses.other" :question="question"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionDropdownModel} from '../question_dropdown'

    @Component
    export default class Dropdown extends Question<QuestionDropdownModel> {}
    Vue.component("survey-dropdown", Dropdown)
</script>
