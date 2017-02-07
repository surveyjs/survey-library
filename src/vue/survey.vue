<template>
    <div>
        <div v-if="hasTitle" :class="css.header"><h3>{{model.processedTitle}}</h3></div>
        <survey-page :survey="model" :page="model.currentPage" :css="css" />
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
        }
        get hasTitle () {
            return !!this.model.title && this.model.showTitle;
        }
        get css () {
            return surveyCss.getCss();
        }
    }
    Vue.component("survey", Survey)
</script>