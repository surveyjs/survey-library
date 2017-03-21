<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{num + page.processedTitle}}</h4>
        <div v-for="row in rows" v-show="row.visible" :class="css.row">
            <div v-for="question in row.questions" :class="css.question.root" style="vertical-align:top" :id="question.id" :style="{display: question.visible ? 'inline-block': 'none', marginLeft: getIndentSize(question, question.indent), paddingRight: getIndentSize(question, question.rightIndent), width: question.renderWidth }">
                <h5 v-if="question.hasTitle" :class="css.question.title" v-show="survey.questionTitleLocation === 'top'">{{question.fullTitle}}</h5>
                <survey-errors :question="question" :css="css"/>
                <component :is="getWidgetComponentName(question)" :question="question" :isEditMode="survey.isEditMode" :css="css"/>
                <div v-show="question.hasComment">
                    <div>{{question.commentText}}</div>
                    <survey-comment :question="question" :isEditMode="survey.isEditMode" :css="css"/>
                </div>
                <h5 v-if="question.hasTitle" v-show="survey.questionTitleLocation === 'bottom'" :class="css.question.title">{{question.fullTitle}}</h5>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {SurveyModel} from '../survey'
    import {Question as QuestionModel} from '../question'
    import {PageModel} from '../page'
    import {QuestionRowModel} from '../page'

    @Component
    export default class Page extends Vue {
        @Prop
        survey: SurveyModel
        @Prop
        page: PageModel
        @Prop
        css: Object

        getWidgetComponentName(question: QuestionModel) {
            if(question.customWidget) {
                return question.customWidget.name;
            }
            return 'survey-' + question.getType();
        }
        get hasTitle () {
            return !!this.page.title && this.survey.showPageTitles;
        }
        get num () {
            return this.page.num > 0 ? this.page.num + ". " : "";
        }
        get rows () {
            return this.page.rows;
        }
        getIndentSize(question: QuestionModel, indent: number): string {
            if (indent < 1) return "";
            if (!question["data"]) return "";
            var css = question["data"]["css"];
            if (!css) return "";
            return indent * css.question.indent + "px";
        }
    }
    Vue.component("survey-page", Page)
</script>