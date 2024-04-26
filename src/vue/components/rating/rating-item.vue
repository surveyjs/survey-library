<template>
  <label :key="item.value" @mousedown="question.onMouseDown()" :class="question.getItemClassByText(item.itemValue, item.text)">
    <input type="radio" class="sv-visuallyhidden" :name="question.questionName" :id="question.getInputId(index)"
      :value="item.value" :disabled="question.isInputReadOnly"
      @click="(e) => question.setValueFromClick(e.target.value)" :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel" :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage" />
    <span :class="question.cssClasses.itemText">
      <survey-string :locString="item.locText" />
    </span>
  </label>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { RenderedRatingItem, QuestionRatingModel, Action } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class RatingItem extends BaseVue {
  @Prop() item: RenderedRatingItem;
  @Prop() question: QuestionRatingModel;
  @Prop() index: number;
  constructor() {
    super();
  }
  getModel() {
    return this.item;
  }
}

Vue.component("sv-rating-item", RatingItem);
export default RatingItem;
</script>
