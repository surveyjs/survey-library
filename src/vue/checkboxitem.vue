<template>
  <div>
    <label :class="question.cssClasses.label">
      <input
        v-if="item == question.selectAllItem"
        type="checkbox"
        :name="question.name"
        :value="isAllSelected"
        v-model="isAllSelected"
        :id="question.inputId + '_' + index"
        :disabled="question.isReadOnly"
        v-bind:aria-required="question.isRequired"
        :aria-label="item.locText.renderedHtml"
        :class="question.cssClasses.itemControl"
      />
      <input
        v-if="item != question.selectAllItem"
        type="checkbox"
        :name="question.name"
        :value="item.value"
        v-model="question.renderedValue"
        :id="question.inputId + '_' + index"
        :disabled="question.isReadOnly || !item.isEnabled"
        v-bind:aria-required="question.isRequired"
        :aria-label="item.locText.renderedHtml"
        :class="question.cssClasses.itemControl"
      />
      <span :class="question.cssClasses.materialDecorator">
        <span class="check"></span>
      </span>
      <span :class="question.cssClasses.controlLabel">
        <survey-string :locString="item.locText" />
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
export class CheckboxItem extends Vue {
  @Prop question: any;
  @Prop item: any;
  @Prop index: any;
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