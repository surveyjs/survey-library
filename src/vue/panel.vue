<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{question.processedTitle}}</h4>
        <div :style="{margin: getIndentSize(question, question.innerIndent)}">
            <div v-for="row in rows" v-show="row.visible" :class="css.row">
                <div v-for="question in row.elements" :class="css.question.root" style="vertical-align:top" :id="question.id" :style="{display: question.visible ? 'inline-block': 'none', marginLeft: getIndentSize(question, question.indent), paddingRight: getIndentSize(question, question.rightIndent), width: question.renderWidth }">
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
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"
    import {Question as QuestionModel} from '../question'

    @Component
    export default class Panel extends Vue {
        @Prop
        question: PanelModel
        @Prop
        isEditMode: Boolean
        @Prop
        css: any

        get rows () {
            return this.question.rows;
        }
        get hasTitle() {
            return this.question.title.length > 0
        }
        get survey () {
            return this.question.data;
        }

        getWidgetComponentName(question: QuestionModel) {
            if(question.customWidget) {
                return question.customWidget.name;
            }
            return 'survey-' + question.getType();
        }

        getIndentSize(question: QuestionModel, indent: number): string {
            if (indent < 1) return "";
            if (!question["data"]) return "";
            var css = question["data"]["css"];
            if (!css) return "";
            return indent * css.question.indent + "px";
        }
    }
    Vue.component("survey-panel", Panel)
</script>