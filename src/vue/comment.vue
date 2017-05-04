<template>
    <div>
        <textarea v-if="!question.isReadOnly" type="text" v-model="question.value" :id="question.inputId" :cols="question.cols"
                  :rows="question.rows" :placeholder="question.placeHolder" :class="css.comment.root"></textarea>
        <div v-else :text="question.value" :class="css.comment.root"></div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionCommentModel} from '../question_comment'

    @Component
    export default class Comment extends Question<QuestionCommentModel> {}
    Vue.component("survey-comment", Comment)
</script>
