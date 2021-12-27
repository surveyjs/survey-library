<template>
  <div :class="getRootClass(question)">
      <fieldset role="radiogroup">
        <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
        <span v-if="question.hasMinLabel"
          :class="question.cssClasses.minText">
          <survey-string :locString="question.locMinRateDescription" />
        </span>
        <label
          v-for="(item, index) in question.renderedRateItems"
          :key="item.value"
          :class="item.itemClass"
        >
          <input
            type="radio"
            class="sv-visuallyhidden"
            :name="question.name"
            :id="question.inputId + '_' + index"
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
      <survey-other-choice
        v-if="question.hasOther"
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
  getRootClass(question: QuestionRatingModel) {
    const classes = question.cssClasses;
    if (question.isReadOnly) return classes.root + " " + classes.disabled;
    return classes.root;
  }
}
Vue.component("survey-rating", Rating);
export default Rating;
</script>
