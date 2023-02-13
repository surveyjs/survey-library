<template>
  <div :class="question.ratingRootCss">
      <fieldset role="radiogroup">
        <legend role="presentation" class="sv-hidden"></legend>
        <span v-if="question.hasMinLabel"
          :class="question.cssClasses.minText">
          <survey-string :locString="question.locMinRateDescription" />
        </span>
        <label
          v-for="(item, index) in question.renderedRateItems"
          :key="item.value"
          :class="question.getItemClass(item.itemValue)"
        >
          <input
            type="radio"
            class="sv-visuallyhidden"
            :name="question.name"
            :id="getInputId(index)"
            :value="item.value"
            :disabled="question.isInputReadOnly"
            @click="(e) => question.setValueFromClick(e.target.value)"
            :aria-required="question.ariaRequired"
            :aria-label="question.ariaLabel"
            :aria-invalid="question.ariaInvalid"
            :aria-describedby="question.ariaDescribedBy"
          />
          <span :class="question.cssClasses.itemText">
            <survey-string :locString="item.locText" />
          </span>
        </label>
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
