<template>
    <div>
        <div v-for="panel in question.panels" :class="css.question.mainRoot">
            <survey-panel :question="panel" :css="css"/>
            <div v-if="!question.isReadOnly">
                <input type="button" v-if="question.canRemovePanel" :class="question.cssClasses.button" :value="question.panelRemoveText" @click="removePanelClick(panel)" />
            </div>
            <hr/>
        </div>
        <input type="button" v-if="!question.isReadOnly && question.canAddPanel" :class="question.cssClasses.button" :value="question.panelAddText" @click="addPanelClick"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {Question as QuestionModel} from '../question'
    import {PanelModel} from '../panel'
    import {QuestionPanelDynamicModel} from '../question_paneldynamic'

    @Component
    export default class PanelDynamic extends Question<QuestionPanelDynamicModel> {
        removePanelClick(panel) {
            this.question.removePanel(panel);
        }
        addPanelClick() {
            this.question.addPanel();
        }
    }
    Vue.component("survey-paneldynamic", PanelDynamic)
</script>
