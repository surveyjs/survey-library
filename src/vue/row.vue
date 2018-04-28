<template>
    <div>
        <survey-element v-if="element.visible" v-for="element in row.elements" :key="element.idValue" :class="questionRootClass" :id="element.id" :style="{ paddingLeft: getIndentSize(element, element.indent), paddingRight: getIndentSize(element, element.rightIndent), width: element.renderWidth }" :element="element" :survey="survey" :css="css" />
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Prop} from 'vue-property-decorator'
    import {SurveyModel} from '../survey'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"
    import {helpers} from './helpers'

    @Component({
        mixins: [helpers]
    })
    export class Row extends Vue {
        @Prop
        row: any
        @Prop
        css: any
        @Prop
        survey: SurveyModel

        get questionRootClass() {
            if(this.survey.questionTitleLocation === "left") {
                return this.css.question.mainRoot + " sv_qstn_left";
            }
            return this.css.question.mainRoot;
        }
    }
    Vue.component("survey-row", Row)
    export default Row;
</script>
