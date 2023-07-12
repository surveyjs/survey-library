<template>
    <label :key="item.value" :class="question.getItemClassByText(item.itemValue, item.text)">
    <input type="radio" class="sv-visuallyhidden" :name="question.name" :id="question.getInputId(index)"
      :value="item.value" :disabled="question.isInputReadOnly"
      @click="(e) => question.setValueFromClick(e.target.value)" :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel" :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy" />
    <span :class="question.cssClasses.itemText">
      <survey-string :locString="item.locText" />
    </span>
  </label>
</template>

<script lang="ts">
import { RenderedRatingItem, QuestionRatingModel } from "survey-core";
import { BaseVue } from "../../base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "sv-rating-item",
  props: {
    item: Object as PropType<RenderedRatingItem>,
    question: Object as PropType<QuestionRatingModel>,
    index: Number,
  },
  methods: {
    getModel() {
      return this.item;
    },
  },
});
</script>
