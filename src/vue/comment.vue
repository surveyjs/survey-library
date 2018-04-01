<template>
    <div>
        <textarea type="text" :readonly="question.isReadOnly" v-model="question.value" :id="question.inputId" :maxlength="question.getMaxLength()" :cols="question.cols" v-bind:aria-label="question.locTitle.renderedHtml"
                  :rows="question.rows" :placeholder="question.placeHolder" :class="question.cssClasses ? question.cssClasses.root : 'panel-comment-root'"></textarea>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCommentModel } from "../question_comment";

@Component
export class Comment extends QuestionVue<QuestionCommentModel> {}
Vue.component("survey-comment", Comment);

export default Comment;
</script>
