<template>
    <fieldset :class="question.cssClasses.root">
        <div v-for="(item, index) in question.visibleChoices" :key="item.value" :class="getItemClass(item)" >
            <label :class="question.cssClasses.label">
                <input type="radio" :name="question.name + '_' + question.id" :value="item.value" :id="question.inputId" v-model="question.value" :disabled="question.isReadOnly" v-bind:aria-label="item.locText.renderedHtml" :class="question.cssClasses.itemControl"/>
                <span :class="question.cssClasses.materialDecorator"></span>
                <span class="check"></span>
                <span :class="question.cssClasses.controlLabel"><survey-string :locString="item.locText"/></span>
                <survey-other-choice v-show="question.hasOther && question.isOtherSelected && index === choicesCount" v-if="index == choicesCount" :question="question"/>
            </label>
        </div>
        <div v-if="question.showClearButton">
            <input type="button" :class="question.cssClasses.clearButton" v-on:click="function() { question.clearValue(); }" :value="question.clearButtonCaption"/>
        </div>
        <legend style="display: none;">{{question.locTitle.renderedHtml}}</legend>
    </fieldset>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRadiogroupModel } from "../question_radiogroup";

@Component
export class Radiogroup extends QuestionVue<QuestionRadiogroupModel> {
  get choicesCount() {
    return this.question.visibleChoices.length - 1;
  }
  getItemClass(item:any) {
    var itemClass =
      this.question.cssClasses.item +
      (this.question.colCount === 0
        ? " sv_q_radiogroup_inline"
        : " sv-q-col-" + this.question.colCount);
    if (item.value === this.question.value) itemClass += " checked";
    return itemClass;
  }
}
Vue.component("survey-radiogroup", Radiogroup);
export default Radiogroup;
</script>
