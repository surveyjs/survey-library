<template>
    <div :class="question.cssClasses.root">
        <survey-paneldynamicprogress v-if="question.isProgressTopShowing" :question="question" />
        <div v-for="panel in renderedPanels" :key="panel.id">
            <survey-panel :question="panel" :css="css"/>
            <div v-if="!question.isReadOnly">
                <input type="button" v-if="question.canRemovePanel" :class="question.cssClasses.button + ' ' + question.cssClasses.buttonRemove" :value="question.panelRemoveText" @click="removePanelClick(panel)" />
            </div>
            <hr/>
        </div>
        <survey-paneldynamicprogress v-if="question.isProgressBottomShowing" :question="question" />
        <input type="button" v-if="question.isRenderModeList && question.canAddPanel" :class="question.cssClasses.button + ' ' + question.cssClasses.buttonAdd" :value="question.panelAddText" @click="addPanelClick"/>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import {Component, Prop} from 'vue-property-decorator'
    import {default as QuestionVue} from './question'
    import {PanelModel} from '../panel'
    import {QuestionPanelDynamicModel} from '../question_paneldynamic'

    @Component
    export class PanelDynamic extends QuestionVue<QuestionPanelDynamicModel> {
        get renderedPanels() {
            if(this.question.isRenderModeList) return this.question.panels;
            var panels = [];
            if(this.question.currentPanel) {
                panels.push(this.question.currentPanel);
            }
            return panels;
        }
        removePanelClick(panel:any) {
            this.question.removePanelUI(panel);
        }
        addPanelClick() {
            this.question.addPanel();
        }
    }
    Vue.component("survey-paneldynamic", PanelDynamic)
    export default PanelDynamic;
</script>
