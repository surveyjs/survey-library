<template>
    <div>
        <span v-if="locString.hasHtml" v-html="locString.renderedHtml"></span>
        <span v-else>{{locString.renderedHtml}}</span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {LocalizableString} from "../localizablestring";

    @Component
    export default class SurveyString extends Vue {
        @Prop
        locString: LocalizableString
    }

    Vue.component("survey-string", SurveyString)
</script>