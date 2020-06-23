<template>
    <div>
      <label :class="getLabelClass(item)">
        <input
          type="radio"
          :name="question.name + '_' + question.id"
          :value="item.value"
          :id="question.inputId + '_' + index"
          :role="'radio'"
          v-model="question.renderedValue"
          :disabled="question.isReadOnly || !item.isEnabled"
          v-bind:aria-required="question.isRequired"
          :aria-label="item.locText.renderedHtml"
          :aria-invalid="question.errors.length > 0"
          :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"  
          :class="question.cssClasses.itemControl"
        >
        <span :class="question.cssClasses.materialDecorator">
          <svg :class="question.cssClasses.itemDecorator" viewBox="-12 -12 24 24">
                <circle r="6" cx="0" cy="0">
          </svg>
        </span>
        <span class="check"></span>
        <span v-if="!hideLabel" :class="getControlLabelClass(item)" :title="item.locText.koRenderedHtml">
          <survey-string :locString="item.locText"/>
        </span>
      </label>
      <survey-other-choice
          v-show="question.hasOther && question.renderedValue && question.isOtherSelected"
          v-if="item.value == question.otherItem.value"
          :question="question"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export class RadiogroupItem extends Vue {
  @Prop question: any;
  @Prop item: any;
  @Prop index: any;
  @Prop hideLabel: boolean;
  getLabelClass(item: any) {
    return this.question.getLabelClass(item.value === this.question.value);
  }
  getControlLabelClass(item: any) {
    return this.question.getControlLabelClass(item.value === this.question.value);
  }
}
Vue.component("survey-radiogroup-item", RadiogroupItem);
export default RadiogroupItem;
</script>