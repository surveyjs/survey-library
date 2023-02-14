<template>
  <div :class="question.ratingRootCss">
      <fieldset role="radiogroup">
        <legend role="presentation" class="sv-hidden"></legend>
        <span v-if="question.hasMinLabel"
          :class="question.cssClasses.minText">
          <survey-string :locString="question.locMinRateDescription" />
        </span>
        <sv-rating-item
          v-for="(item, index) in question.renderedRateItems"
          :item="item"
          :index="index"
          :question="question"
        >
        </sv-rating-item>
        <span v-if="question.hasMaxLabel"
              :class="question.cssClasses.maxText"
        >
        <survey-string :locString="question.locMaxRateDescription" />
        </span>
      </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRatingModel } from "survey-core";

@Component
export class Rating extends QuestionVue<QuestionRatingModel> {
  getInputId(index: any) {
    return this.question.getInputId(index)
  }
}
Vue.component("survey-rating", Rating);
export default Rating;
</script>
