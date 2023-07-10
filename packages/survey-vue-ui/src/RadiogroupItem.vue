<template>
  <div role="presentation">
    <label :class="getLabelClass(item)" :aria-label="question.getAriaItemLabel(item)">
      <input
        type="radio"
        :name="question.questionName"
        :value="item.value"
        :id="question.getItemId(item)"
        :aria-describedby="question.ariaDescribedBy"
        v-model="question.renderedValue"
        :disabled="!question.getItemEnabled(item)"
        :class="question.cssClasses.itemControl"
      /><span
        v-if="question.cssClasses.materialDecorator"
        :class="question.cssClasses.materialDecorator"
      >
        <svg
          v-if="question.itemSvgIcon"
          :class="question.cssClasses.itemDecorator"
        >
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg> </span
      ><span
        v-if="!hideLabel"
        :class="getControlLabelClass(item)"
      >
        <survey-string :locString="item.locText" />
      </span> </label
    >
  </div>
</template>

<script lang="ts">
import { ItemValue, Base } from "survey-core";
import { defineSurveyComponent } from "./base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-radiogroup-item",
  props: {
    question: Object,
    item: Object as PropType<ItemValue>,
    index: [String, Number],
    hideLabel: Boolean,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.item; },
      getLabelClass: (item: any) => {
        return vm.question.getLabelClass(item);
      },
      getControlLabelClass: (item: any) => {
        return vm.question.getControlLabelClass(item);
      }
    }
  },
});

</script>
