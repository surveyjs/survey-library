<template>
    <div>
        <div v-for="item in question.panels" :class="css.question.mainRoot">
            <component :is="survey-panel" :question="item.panel" :css="css"/>
            <div v-if="!question.isReadOnly">
                <input type="button" v-if="question.canRemovePanel" :class="question.cssClasses.button" :value="question.removePanelText" @click="removePanelClick(item)" />
            </div>
        </div>
        <input type="button" v-if="!question.isReadOnly && question.canAddPanel" :class="question.cssClasses.button" :value="question.addPanelText" @click="addPanelClick"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {Question as QuestionModel} from '../question'
    import {QuestionPanelDynamicModel, QuestionPanelDynamicItem} from '../question_paneldynamic'

    @Component
    export default class PanelDynamic extends Question<QuestionPanelDynamicModel> {
        get panels() {
            return this.question.panels;
        }
        removePanelClick(item) {
            var index = this.question.panels.indexOf(item);
            if (index > -1) {
                this.question.removePanel(index);
            }
        }
        addPanelClick() {
            this.question.addPanel();
        }
    }
    Vue.component("survey-paneldynamic", PanelDynamic)
</script>
