<template>
    <div style="position: fixed; bottom: 3px; right: 10px;" :class="css.window.root">
        <div :class="css.window.header.root">
            <a href="#" @click="doExpand" style="width:100%">
                <span style="padding-right:10px" :class="css.window.header.title">{{survey.title}}</span>
                <span aria-hidden="true" :class="survey.expandedCss"></span>
            </a>
        </div>
        <div v-show="survey.expanded" :class="css.window.body">
            <div id="windowSurveyJS"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {SurveyModel} from '../survey'

    @Component
    export default class Window extends Vue {
        @Prop
        survey: SurveyModel
        @Prop
        css: any
    }
    Vue.component("survey-window", Window)
</script>