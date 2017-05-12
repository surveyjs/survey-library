<template>
    <form :class="css.radiogroup.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{'display': 'inline-block', 'width': colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px', 'margin-left': '0px'}">
            <label :class="css.radiogroup.label">
                <input type="radio" :name="question.name" :value="item.value" :id="question.inputId + '_' + item.value" v-model="question.value" :disabled="question.isReadOnly" />
                <span class="circle"></span>
                <span class="check"></span>
                <survey-string :locString="item.locText"/>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther && question.isOtherSelected" :class="css.radiogroup.other" :question="question" :css="css"/>
    </form>
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
    }
    Vue.component("survey-radiogroup", Radiogroup)
</script>
