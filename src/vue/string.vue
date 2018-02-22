<template>
    <span style="position: static;">
        <span style="position: static;" v-if="locString.hasHtml" v-html="locString.renderedHtml"></span>
        <span style="position: static;" v-else>{{locString.renderedHtml}}</span>
    </span>
</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Prop} from 'vue-property-decorator'
    import {LocalizableString} from "../localizablestring";

    @Component
    export class SurveyString extends Vue {
        @Prop
        locString: LocalizableString
    }

    Vue.component("survey-string", SurveyString)
    export default SurveyString;
</script>
