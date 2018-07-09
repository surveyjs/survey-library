<template>
    <div class="form-group">
        <input v-if="!question.isReadOnly" type="text" :class="question.cssClasses.other || commentClass" v-model="question.comment" :maxlength="question.getOthersMaxLength()" v-bind:aria-label="question.locTitle.renderedHtml"/>
        <div v-else :class="question.cssClasses.other">{{question.comment}}</div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { surveyCss } from "../defaultCss/cssstandard";
import { Question } from "../question";

@Component
export class OtherChoice extends Vue {
  @Prop question: Question;
  @Prop commentClass: any;
}
Vue.component("survey-other-choice", OtherChoice);
export default OtherChoice;
</script>