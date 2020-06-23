<template>
  <div>
    <div :class="getRootClass(question)">
      <label
        v-for="(item, index) in question.visibleRateValues"
        :key="item.value"
        :class="getCss(question, item)"
      >
        <input
          type="radio"
          class="sv-visuallyhidden"
          :name="question.name"
          :id="question.name + index"
          :value="item.value"
          :disabled="question.isReadOnly"
          @change="change"
          v-bind:aria-required="question.isRequired"
          :aria-label="item.locText.text"
          :aria-invalid="question.errors.length > 0"
          :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"  
        />
        <span v-if="index === 0" :class="question.cssClasses.minText">
          <survey-string :locString="question.locMinRateDescription" />
        </span>
        <span :class="question.cssClasses.itemText">
          <survey-string :locString="item.locText" />
        </span>
        <span
          v-if="index === question.visibleRateValues.length-1"
          :class="question.cssClasses.maxText"
        >
          <survey-string :locString="question.locMaxRateDescription" />
        </span>
      </label>
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
import { QuestionRatingModel } from "../question_rating";

@Component
export class Rating extends QuestionVue<QuestionRatingModel> {
  getCss(question: QuestionRatingModel, item: any) {
    let css = question.cssClasses.item;
    if (question.value == item.value) {
      css = css + " " + question.cssClasses.selected;
    }
    return css;
  }
  change(e: any) {
    this.question.value = e.target.value;
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
