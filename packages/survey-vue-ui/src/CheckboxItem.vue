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
import { ItemValue, Base } from "survey-core";
import { defineSurveyComponent } from "./base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-checkbox-item",
  props: {
    question: Object,
    item: Object as PropType<ItemValue>,
    index: [String, Number],
    hideLabel: Boolean,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.item; }
    }
  },
  computed: {
    isAllSelected: {
      get () {
        return this.question.isAllSelected || "";
      },
      set (val: boolean) {
        this.question.isAllSelected = val;
      }
    }
  }
});

</script>
