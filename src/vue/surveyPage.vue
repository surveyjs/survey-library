<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{pageNum + page.processedTitle}}</h4>
        <template v-for="row in page.rows">
            <div v-show="row.visible" :class="css.row">
                <component :is="question.getType()" v-for="question in row.questions" :question="question" :css="css"/>
            </div>
        </template>
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
        get pageNum () {
            return this.page.num > 0 ? this.page.num + ". " : "";
        }
    }
    Vue.component("SurveyPage", SurveyPage)
</script>