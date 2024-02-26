<template>
  <div role="presentation" :class="question.getItemClass(item)">
    <label @mousedown="question.onMouseDown()" :class="getLabelClass(item)">
      <input
        type="radio"
        :name="question.questionName"
        :value="item.value"
        :id="question.getItemId(item)"
        :aria-errormessage="question.ariaErrormessage"
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
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseVue } from "./base";

@Component
export class RadiogroupItem extends BaseVue {
  @Prop() question: any;
  @Prop() item: ItemValue;
  @Prop() hideLabel: boolean;
  protected getModel(): Base {
    return this.item;
  }
  getLabelClass(item: any) {
    return this.question.getLabelClass(item);
  }
  getControlLabelClass(item: any) {
    return this.question.getControlLabelClass(item);
  }
}
Vue.component("survey-radiogroup-item", RadiogroupItem);
export default RadiogroupItem;
</script>
