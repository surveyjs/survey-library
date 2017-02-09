<template>
    <div :class="css.root">
        <div v-if="hasTitle" :class="css.header"><h3>{{survey.processedTitle}}</h3></div>
        <template v-if="survey.state === 'running'">
            <div :class="css.body">
                <survey-progress v-if="survey.showProgressBar =='top'" :survey="survey" :css="css"/>
                <survey-page id="sq-page" :survey="survey" :page="survey.currentPage" :css="css" />
                <survey-progress style="margin-top:10px" v-if="survey.showProgressBar =='bottom'" :survey="survey" :css="css"/>
            </div>
            <div v-if="survey.isNavigationButtonsShowing" :class="css.footer">
                <input type="button" :value="survey.pagePrevText" v-show="!survey.isFirstPage" :class="css.cssNavigationPrev" @click="prevPage"/>
                <input type="button" :value="survey.pageNextText" v-show="!survey.isLastPage" :class="css.cssNavigationNext" @click="nextPage"/>
                <input type="button" :value="survey.completeText" v-show="survey.isLastPage" :class="css.cssNavigationComplete" @click="completeLastPage"/>
            </div>
        <template>
        <div v-if="survey.state === 'completed'" v-html="survey.processedCompletedHtml"></div>
        <div v-if="survey.state === 'loading'" v-html="survey.processedLoadingHtml"></div>
        <div v-if="survey.state === 'empty'" :class="css.body">{{survey.emptySurveyText}}</div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {SurveyModel} from '../survey'

    @Component
    export default class Survey extends Vue {
        @Prop
        survey: SurveyModel

        constructor () {
            super();
        }
        get hasTitle () {
            return !!this.survey.title && this.survey.showTitle;
        }
        get css () {
            return surveyCss.getCss();
        }
        prevPage() {
            this.survey.prevPage();
        }
        nextPage() {
            this.survey.nextPage();
        }
        completeLastPage() {
            this.survey.completeLastPage();
        }
    }
    Vue.component("survey", Survey)
</script>