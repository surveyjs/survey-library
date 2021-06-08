<template>
  <div>
    <div :class="getRootClass(question)">
      <fieldset role="radiogroup">
        <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
        <label
          v-for="(item, index) in question.visibleRateValues"
          :key="item.value"
          :class="getCss(question, item)"
        >
          <input
            type="radio"
            class="sv-visuallyhidden"
            :name="question.name"
            :id="question.inputId + '_' + index"
            :value="item.value"
            :disabled="question.isInputReadOnly"
            @click="(e) => question.setValueFromClick(e.target.value)"
            v-bind:aria-required="question.isRequired"
            :aria-label="item.locText.text"
            :aria-invalid="question.errors.length > 0"
            :aria-describedby="
              question.errors.length > 0 ? question.id + '_errors' : null
            "
          />
          <span v-if="index === 0" :class="question.cssClasses.minText">
            <survey-string :locString="question.locMinRateDescription" />
          </span>
          <span :class="question.cssClasses.itemText">
            <survey-string :locString="item.locText" />
          </span>
          <span
            v-if="index === question.visibleRateValues.length - 1"
            :class="question.cssClasses.maxText"
          >
            <survey-string :locString="question.locMaxRateDescription" />
          </span>
        </label>
      </fieldset>
    </div>
    <survey-other-choice
      v-show="question.hasOther"
      :class="question.cssClasses.other"
      :question="question"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRatingModel } from "survey-core";

@Component
export class Rating extends QuestionVue<QuestionRatingModel> {
  getCss(question: QuestionRatingModel, item: any) {
    let css = question.cssClasses.item;
    var disabled = this.question.cssClasses.itemDisabled;
    if (question.value == item.value) {
      css = css + " " + question.cssClasses.selected;
    }
    if (this.question.isReadOnly) {
      css = css + " " + disabled;
    }
    return css;
  }
  getRootClass(question: QuestionRatingModel) {
    const classes = question.cssClasses;
    if (question.isReadOnly) return classes.root + " " + classes.disabled;
    return classes.root;
  }
}
Vue.component("survey-rating", Rating);
export default Rating;
</script>
