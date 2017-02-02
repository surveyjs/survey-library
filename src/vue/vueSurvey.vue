<template>
    <div v-if="hasTitle" v-bind:class="css.header"><h3>{{model.processedTitle}}</h3></div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard";
    import {VueSurveyModel} from './vueSurveyModel'

    @Component({
        props: {
            json: Object
        }
    })
    export default class Survey extends Vue {
        json: Object;

        model: VueSurveyModel;
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

</script>