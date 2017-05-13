<template>
    <div style="position: fixed; bottom: 3px; right: 10px;" :class="css.window.root">
        <div :class="css.window.header.root">
            <a href="#" @click="doExpand" style="width:100%">
                <span style="padding-right:10px" :class="css.window.header.title"><survey-string :locString="survey.locTitle"/></span>
                <span aria-hidden="true" :class="expandedCss"></span>
            </a>
        </div>
        <div v-show="expanded" :class="css.window.body">
            <survey :survey="survey">
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {SurveyModel} from '../survey'

    @Component
    export default class Window extends Vue {
        @Prop
        survey: SurveyModel

        get css () {
            return surveyCss.getCss();
        }

        expanded = false;
        get expandedCss() {
            return this.expanded ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
        }

        doExpand() {
            this.expanded = !this.expanded;
        }
    }
    Vue.component("survey-window", Window)
</script>
