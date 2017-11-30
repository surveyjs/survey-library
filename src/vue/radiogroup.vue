<template>
    <fieldset :class="question.cssClasses.root">
        <div v-for="(item, index) in question.visibleChoices" :class="itemClass" :style="{'display': 'inline-block', 'width': colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="question.cssClasses.label">
                <input type="radio" :name="question.name" :value="item.value" :id="question.inputId + '_' + item.value" v-model="question.value" :disabled="question.isReadOnly" v-bind:aria-label="question.locTitle.renderedHtml" :class="question.cssClasses.itemControl"/>
                <span class="circle"></span>
                <span class="check"></span>
                <span :class="question.cssClasses.controlLabel"><survey-string :locString="item.locText"/></span>
                <survey-other-choice v-show="question.hasOther && question.isOtherSelected && index === choicesCount" :class="question.cssClasses.other" :question="question"/>
            </label>
        </div>
        <legend style="display: none;">{{question.locTitle.renderedHtml}}</legend>
    </fieldset>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionRadiogroupModel} from '../question_radiogroup'

    @Component
    export default class Radiogroup extends Question<QuestionRadiogroupModel> {
        // TODO may be need to move to the model
        get colWidth() {
            var colCount = this.question.colCount;
            return colCount > 0 ? (100 / colCount) + '%' : "";
        }
        get choicesCount() {
            return this.question.visibleChoices.length - 1;
        }
        get itemClass() {
            return this.question.cssClasses.item + (this.question.colCount === 0 ? " sv_q_radiogroup_inline": "");
        }
    }
    Vue.component("survey-radiogroup", Radiogroup)
</script>
