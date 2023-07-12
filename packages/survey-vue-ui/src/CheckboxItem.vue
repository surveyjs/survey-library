<template>
  <div role="presentation">
    <label :class="question.getLabelClass(item)" :aria-label="question.getAriaItemLabel(item)">
      <input v-if="item == question.selectAllItem" role="option" type="checkbox" :name="question.name"
        :value="isAllSelected" v-model="isAllSelected" :id="question.getItemId(item)"
        :disabled="!question.getItemEnabled(item)" :aria-describedby="question.ariaDescribedBy"
        :class="question.cssClasses.itemControl" /><input v-if="item != question.selectAllItem" role="option"
        type="checkbox" :name="question.name" :value="item.value" v-model="question.renderedValue"
        :id="question.getItemId(item)" :disabled="!question.getItemEnabled(item)"
        :aria-describedby="question.ariaDescribedBy" :class="question.cssClasses.itemControl" /><span
        v-if="question.cssClasses.materialDecorator" :class="question.cssClasses.materialDecorator">
        <svg v-if="question.itemSvgIcon" :class="question.cssClasses.itemDecorator">
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg>
      </span><span v-if="!hideLabel" :class="question.cssClasses.controlLabel">
        <survey-string :locString="item.locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { ItemValue } from "survey-core";
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "survey-checkbox-item",
  props: {
    question: { type: Object, required: true },
    item: { type: Object as PropType<ItemValue>, required: true },
    index: [String, Number],
    hideLabel: Boolean,
  },
  methods: {
    getModel() {
      return this.item;
    },
  },
  computed: {
    isAllSelected: {
      get() {
        return this.question.isAllSelected || "";
      },
      set(val: boolean) {
        const question = this.question;
        question.isAllSelected = val;
      },
    },
  },
});
</script>
