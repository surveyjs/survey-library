<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle"><survey-string :locString="page.locTitle"/></h4>
        <div v-for="row in rows" v-show="row.visible" :class="css.row">
            <survey-row :row="row" :survey="survey" :css="css"></survey-row>
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
    import {helpers} from './helpers'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"

    @Component({
        mixins: [helpers]
    })
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
    }
    Vue.component("survey-page", Page)
</script>
