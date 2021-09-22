<template>
  <div>
    <label :class="question.getLabelClass(item)">
      <input
        v-if="item == question.selectAllItem"
        type="checkbox"
        :name="question.name"
        :value="isAllSelected"
        v-model="isAllSelected"
        :id="question.getItemId(item)"
        :disabled="!question.getItemEnabled(item)"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
        :class="question.cssClasses.itemControl"
      />
      <input
        v-if="item != question.selectAllItem"
        type="checkbox"
        :name="question.name"
        :value="item.value"
        v-model="question.renderedValue"
        :id="question.getItemId(item)"
        :disabled="!question.getItemEnabled(item)"
        v-bind:aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
        :class="question.cssClasses.itemControl"
      />
      <span :class="question.cssClasses.materialDecorator">
        <svg viewBox="0 0 24 24" :class="question.cssClasses.itemDecorator">
          <path :d="question.checkBoxSvgPath" />
        </svg>
        <span class="check"></span>
      </span>
      <span
        v-if="!hideLabel"
        :class="question.cssClasses.controlLabel"
        :title="item.locText.text"
      >
        <survey-string :locString="item.locText" />
      </span>
    </label>
    <survey-other-choice
      v-show="
        question.renderedValue && question.isOtherSelected
      "
      v-if="question.isOtherItem(item)"
      :question="question"
    />
  </div>
</template>

<script lang="ts">
import { ItemValue, Base } from "survey-core";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseVue } from "./base";

@Component
export class CheckboxItem extends BaseVue {
  @Prop() question: any;
  @Prop() item: ItemValue;
  @Prop() index: any;
  @Prop() hideLabel: boolean;
  protected getModel(): Base {
    return this.item;
  }
  get isAllSelected() {
    return this.question.isAllSelected;
  }
  set isAllSelected(val: boolean) {
    this.question.isAllSelected = val;
  }
}
Vue.component("survey-checkbox-item", CheckboxItem);
export default CheckboxItem;
</script>
