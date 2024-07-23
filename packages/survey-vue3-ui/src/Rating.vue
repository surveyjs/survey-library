<template>
  <div :class="question.ratingRootCss" ref="root">
    <fieldset role="radiogroup">
      <legend role="presentation" class="sv-hidden"></legend>
      <span v-if="question.hasMinLabel" :class="question.cssClasses.minText">
        <SurveyVueComponent
          :name="'survey-string'"
          :locString="question.locMinRateDescription"
        />
      </span>
      <SurveyVueComponent
        v-for="(item, index) in question.renderedRateItems"
        :key="getInputId(index)"
        :name="question.itemComponent"
        :item="item"
        :index="index"
        :question="question"
      />
      <span v-if="question.hasMaxLabel" :class="question.cssClasses.maxText">
        <SurveyVueComponent
          :name="'survey-string'"
          :locString="question.locMaxRateDescription"
        />
      </span>
    </fieldset>
  </div>
</template>
<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
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
