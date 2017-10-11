<template>
    <div>
        <survey-element v-if="element.visible" v-for="element in row.elements" :key="element.idValue" :class="css.question.mainRoot" :id="element.id" :style="{ paddingLeft: getIndentSize(element, element.indent), paddingRight: getIndentSize(element, element.rightIndent), width: element.renderWidth }" :element="element" :survey="survey" :css="css" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {SurveyModel} from '../survey'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"
    import {Question as QuestionModel} from '../question'
    import {helpers} from './helpers'

    @Component({
        mixins: [helpers]
    })
    export default class Row extends Vue {
        @Prop
        row: any
        @Prop
        css: any
        @Prop
        survey: SurveyModel
    }
    Vue.component("survey-row", Row)
</script>
