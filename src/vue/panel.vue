<template>
    <div :style="rootStyle">
        <h4 v-show="hasTitle" :class="css.panel.title"><survey-string :locString="question.locTitle"/></h4>
        <div :class="css.panel.container" :style="{ paddingLeft: getIndentSize(question, question.innerIndent) }">
            <div v-for="row in rows" v-show="row.visible" :class="css.row">
                <survey-row :row="row" :survey="survey" :css="css"></survey-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"
    import {Question as QuestionModel} from '../question'
    import {ISurvey} from '../base'
    import {helpers} from './helpers'

    @Component({
        mixins: [helpers]
    })
    export default class Panel extends Vue {
        @Prop
        question: PanelModel
        @Prop
        isEditMode: Boolean
        @Prop
        css: any

        get rootStyle () {
            var result = {
                verticalAlign: 'top',
                display: this.question.isVisible ? 'inline-block': 'none'
            };
            if(this.question.renderWidth) {
                result['width'] = this.question.renderWidth;
            }
            return result;
        }
        get rows () {
            return this.question.rows;
        }
        get hasTitle() {
            return this.question.title.length > 0
        }
        get survey () {
            return this.question.survey;
        }
    }
    Vue.component("survey-panel", Panel)
</script>
