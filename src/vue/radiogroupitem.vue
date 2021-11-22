<template>
  <div 
    role="radio" 
    :aria-checked="question.renderedValue === item.value ? 'true': 'false'"
    :aria-required="question.ariaRequired"
    :aria-invalid="question.ariaInvalid"
    :aria-describedby="question.ariaDescribedBy"
  >
    <label :class="getLabelClass(item)" :aria-label="item.locText.renderedHtml">
      <input
        type="radio"
        aria-hidden="true"
        :name="question.name + '_' + question.id"
        :value="item.value"
        :id="question.inputId + '_' + index"
        v-model="question.renderedValue"
        :disabled="question.isInputReadOnly || !item.isEnabled"
        :class="question.cssClasses.itemControl"
      /><span v-if="question.cssClasses.materialDecorator" :class="question.cssClasses.materialDecorator">
        <svg v-if="question.hasItemSvgIcon" :class="question.cssClasses.itemDecorator" viewBox="-12 -12 24 24">
          <circle r="6" cx="0" cy="0" />
        </svg>
      </span><span
        v-if="!hideLabel"
        :class="getControlLabelClass(item) || undefined"
        :title="item.locText.renderedHtml"
      >
        <survey-string :locString="item.locText" />
      </span>
    </label><survey-other-choice
      v-show="
        question.hasOther && question.renderedValue && question.isOtherSelected
      "
      v-if="item.value == question.otherItem.value"
      :question="question"
    /></div>
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
  @Prop() index: any;
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
