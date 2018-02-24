<template>
    <div>{{text}}</div>
</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Prop} from 'vue-property-decorator'
    import {SurveyModel} from '../survey'

    @Component
    export class TimerPanel extends Vue {
        @Prop
        survey: SurveyModel
        @Prop
        css: any
        get text() {
            return this.survey.timerInfoText;
        }
    }
    Vue.component("survey-timerpanel", TimerPanel)
    export default TimerPanel;
</script>
