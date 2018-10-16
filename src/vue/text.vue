<template>
    <div>
        <input v-if="!question.isReadOnly" :class="question.cssClasses.root" :type="question.inputType" :maxlength="question.getMaxLength()" :size="question.size" :id="question.inputId" :placeholder="question.placeHolder" :value="question.value" @change="change" v-bind:aria-label="question.locTitle.renderedHtml"/>
        <input v-else disabled :class="question.cssClasses.root" :type="question.inputType" :size="question.size" :id="question.inputId" :placeholder="question.placeHolder" :value="question.value" v-bind:aria-label="question.locTitle.renderedHtml"/>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionTextModel } from "../question_text";

@Component
export class Text extends QuestionVue<QuestionTextModel> {
  change(event: any) {
    this.question.value = event.target.value;
  }
}
Vue.component("survey-text", Text);
export default Text;
</script>
