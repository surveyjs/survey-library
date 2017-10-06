<template>
    <div>
        <input v-if="!question.isReadOnly" :class="question.cssClasses.root" :type="question.inputType" :size="question.size" :id="question.inputId" :placeholder="question.placeHolder" :value="question.value" @change="change" v-bind:aria-label="question.locTitle.renderedHtml"/>
        <div v-else :class="question.cssClasses.text">{{question.value}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionTextModel} from '../question_text'

    @Component
    export default class Text extends Question<QuestionTextModel> {
        change(event) {
            this.question.value = event.target.value;
        }
    }
    Vue.component("survey-text", Text)
</script>
