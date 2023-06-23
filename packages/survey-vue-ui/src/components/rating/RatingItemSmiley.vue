<template>
    <label :key="item.value" :style="question.getItemStyle(item.itemValue, item.highlight)" :class="question.getItemClass(item.itemValue, item.highlight)" @mouseover="(e) => question.onItemMouseIn(item)"
    @mouseleave="(e) => question.onItemMouseOut(item)">
    <input type="radio" class="sv-visuallyhidden" :name="question.name" :id="question.getInputId(index)"
      :value="item.value" :disabled="question.isInputReadOnly" @click="(e) => question.setValueFromClick(e.target.value)"
      :aria-required="question.ariaRequired" :aria-label="question.ariaLabel" :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy" />
    <sv-svg-icon :iconName="question.getItemSmileyIconName(item.itemValue)" :size="'auto'"
      :title="item.text"></sv-svg-icon>
  </label>
</template>

<script lang="ts">
import { RenderedRatingItem, QuestionRatingModel } from "survey-core";
import { QuestionVue } from "../../base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "sv-rating-item-smiley",
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
