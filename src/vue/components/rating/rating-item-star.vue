<template>
  <label :key="item.value" @mousedown="question.onMouseDown()" :class="question.getItemClass(item.itemValue)"
  @mouseover="(e) => question.onItemMouseIn(item)"
  @mouseleave="(e) => question.onItemMouseOut(item)">
    <input type="radio" class="sv-visuallyhidden" :name="question.questionName" :id="question.getInputId(index)"
      :value="item.value" :disabled="question.isInputReadOnly" @click="(e) => question.setValueFromClick(e.target.value)"
      :aria-required="question.ariaRequired" :aria-label="question.ariaLabel" :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage" />
      <sv-svg-icon :class="'sv-star'" :iconName="question.itemStarIcon" :size="'auto'" :title="item.text"></sv-svg-icon>
      <sv-svg-icon :class="'sv-star-2'" :iconName="question.itemStarIconAlt" :size="'auto'" :title="item.text"></sv-svg-icon>
  </label>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { RenderedRatingItem, QuestionRatingModel, Action } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class RatingItemStar extends BaseVue {
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

Vue.component("sv-rating-item-star", RatingItemStar);
export default RatingItemStar;
</script>
