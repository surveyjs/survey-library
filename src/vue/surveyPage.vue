<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{num + page.processedTitle}}</h4>
        <div v-for="row in rows" v-show="row.visible" :class="css.row">
            <component :is="'survey-' + question.getType()" v-for="question in row.questions" :question="question" :isEditMode="survey.isEditMode" :css="css"/>
        </div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {VueSurveyModel} from './surveyModel'
    import {PageModel} from '../page'

    @Component({
        props: {
            survey: VueSurveyModel,
            page: PageModel,
            css: surveyCss
        }
    })
    export default class SurveyPage extends Vue {
        survey: VueSurveyModel;
        page: PageModel;
        css: Object;
        constructor () {
            super();
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
    }
    Vue.component("survey-page", SurveyPage)
</script>