<template>
  <div :class="question.ratingRootCss" ref="root">
    <fieldset
      :role="question.a11y_input_ariaRole"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-errormessage="question.a11y_input_ariaErrormessage"
    >
      <legend role="presentation" class="sv-hidden"></legend>
      <span v-if="question.hasMinLabel" :class="question.cssClasses.minText">
        <SvComponent
          :is="'survey-string'"
          :locString="question.locMinRateDescription"
        />
      </span>
      <SvComponent
        v-for="(item, index) in question.renderedRateItems"
        :key="getInputId(index)"
        :is="question.itemComponent"
        :item="item"
        :index="index"
        :question="question"
      />
      <span v-if="question.hasMaxLabel" :class="question.cssClasses.maxText">
        <SvComponent
          :is="'survey-string'"
          :locString="question.locMaxRateDescription"
        />
      </span>
    </fieldset>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionRatingModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionRatingModel }>();
const root = ref(null);
useQuestion<QuestionRatingModel>(props, root);
const getInputId = (index: any): string => {
  return props.question.getInputId(index);
};
</script>
