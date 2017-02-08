<template>
    <div :class="css.root">
        <div v-if="hasTitle" :class="css.header"><h3>{{model.processedTitle}}</h3></div>
        <template v-if="model.state === 'running'">
            <div data-bind="css: $root.css.body">
                <div data-bind="visible: showProgressBar =='top', template: { name: 'survey-progress', data: $data }"></div>
                <survey-page id="sq-page" :survey="model" :page="model.currentPage" :css="css" />
                <div style="margin-top:10px" data-bind="visible: showProgressBar =='bottom', template: { name: 'survey-progress', data: $data }"></div>
            </div>
            <div v-if="model.isNavigationButtonsShowing" :class="css.footer">
                <input type="button" :value="model.pagePrevText" v-show="!model.isFirstPage" :class="css.cssNavigationPrev" @click="prevPage"/>
                <input type="button" :value="model.pageNextText" v-show="!model.isLastPage" :class="css.cssNavigationNext" @click="nextPage"/>
                <input type="button" :value="model.completeText" v-show="model.isLastPage" :class="css.cssNavigationComplete" @click="completeLastPage"/>
            </div>
        <template>
        <div v-if="model.state === 'completed'" :html="model.processedCompletedHtml"></div>
        <div v-if="model.state === 'loading'" :html="model.processedLoadingHtml"></div>
        <div v-if="model.state === 'empty'" :class="css.body">{{model.emptySurveyText}}</div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {VueSurveyModel} from './surveyModel'

    @Component
    export default class Survey extends Vue {
        @Prop
        json: Object

        model: VueSurveyModel

        constructor () {
            super();
            this.model = new VueSurveyModel(this.json);
            // TODO - remove it to index html or somewhere outside
            //this.model.data = { name: "John Doe", email: "johndoe@nobody.com", car: "Ford",  car2: ["Ford", "Audi"], quality: [1, 3, 2, 2] };
        }
        get hasTitle () {
            return !!this.model.title && this.model.showTitle;
        }
        get css () {
            return surveyCss.getCss();
        }
        prevPage() {
            this.model.prevPage();
        }
        nextPage() {
            this.model.nextPage();
        }
        completeLastPage() {
            this.model.completeLastPage();
        }
    }
    Vue.component("survey", Survey)
</script>