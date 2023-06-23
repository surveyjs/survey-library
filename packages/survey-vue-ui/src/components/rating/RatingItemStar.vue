<template>
  <label :key="item.value" :class="question.getItemClass(item.itemValue)" 
  @mouseover="(e) => question.onItemMouseIn(item)" 
  @mouseleave="(e) => question.onItemMouseOut(item)">
    <input type="radio" class="sv-visuallyhidden" :name="question.name" :id="question.getInputId(index)"
      :value="item.value" :disabled="question.isInputReadOnly" @click="(e) => question.setValueFromClick(e.target.value)"
      :aria-required="question.ariaRequired" :aria-label="question.ariaLabel" :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy" />
      <sv-svg-icon :class="'sv-star'" :iconName="question.itemStarIcon" :size="'auto'" :title="item.text"></sv-svg-icon>
      <sv-svg-icon :class="'sv-star-2'" :iconName="question.itemStarIconAlt" :size="'auto'" :title="item.text"></sv-svg-icon>
  </label>
</template>

<script lang="ts">
import { RenderedRatingItem, QuestionRatingModel } from "survey-core";
import { QuestionVue } from "../../base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "sv-rating-item-star",
  props: {
    item: RenderedRatingItem,
    question: QuestionRatingModel,
    index: Number,
  },
  data: (vm: any) => {
    return {
      getModel: () => {
        return vm.item;
      },
    };
  },
});
</script>
