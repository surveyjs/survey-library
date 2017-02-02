<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{pageNum + page.processedTitle}}</h4>
        <template v-for="row in page.rows">
            <div v-show="row.visible" :class="css.row">
                <SurveyQuestion v-for="question in row.questions" :question="question" />
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
    import {default as SurveyQuestion} from './surveyQuestion.vue'

    @Component({
        props: {
            survey: VueSurveyModel,
            page: PageModel,
            css: surveyCss
        },
        components: {
            SurveyQuestion
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
</script>