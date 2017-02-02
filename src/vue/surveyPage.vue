<template>
    <div>Page</div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard";
    import {VueSurveyModel} from './surveyModel'

    @Component({
        props: {
            survey: VueSurveyModel
        }
    })
    export default class SurveyPage extends Vue {
        constructor () {
            super();
        }
    }

</script>