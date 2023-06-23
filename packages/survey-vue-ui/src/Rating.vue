<template>
    <div :class="question.ratingRootCss">
      <fieldset role="radiogroup">
        <legend role="presentation" class="sv-hidden"></legend>
        <span v-if="question.hasMinLabel"
          :class="question.cssClasses.minText">
          <survey-string :locString="question.locMinRateDescription" />
        </span>
        <component
          v-for="(item, index) in question.renderedRateItems"
            :is="question.itemComponentName"
          :item="item"
          :index="index"
          :question="question"
        ></component>
        <span v-if="question.hasMaxLabel"
              :class="question.cssClasses.maxText"
        >
        <survey-string :locString="question.locMaxRateDescription" />
        </span>
      </fieldset>
  </div>
</template>

<script lang="ts">
import { QuestionRatingModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-rating",
  props: {
    question: QuestionRatingModel,
  },
  data: (vm: any) => {
    return {
      getInputId(index: any):number {
        return this.question.getInputId(index);
      }
    }
  },
});
</script>
