<template>
  <div role="presentation">
    <label @mousedown="question.onMouseDown()" :class="getLabelClass(item)" :aria-label="question.getAriaItemLabel(item)">
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
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-radiogroup-item",
  props: {
    question: { type: Object, required: true },
    item: Object as PropType<ItemValue>,
    index: [String, Number],
    hideLabel: Boolean,
  },
  mixins: [BaseVue],
  methods: {
    getModel() { return this.item; },
    getLabelClass(item: any) {
      return this.question.getLabelClass(item);
    },
    getControlLabelClass(item: any) {
      return this.question.getControlLabelClass(item);
    },
  },
});
</script>
