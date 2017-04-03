<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{num + page.processedTitle}}</h4>
        <div v-for="row in rows" v-show="row.visible" :class="css.row">
            <div v-for="question in row.questions" :class="css.question.root" style="vertical-align:top" :id="question.id" :style="{display: question.visible ? 'inline-block': 'none', marginLeft: getIndentSize(question, question.indent), paddingRight: getIndentSize(question, question.rightIndent), width: question.renderWidth }">
                <survey-row :row="row" :survey="survey" :css="css"></survey-row>
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
    import {QuestionRowModel} from '../panel'

    @Component
    export default class Page extends Vue {
        @Prop
        survey: SurveyModel
        @Prop
        page: PageModel
        @Prop
        css: Object

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