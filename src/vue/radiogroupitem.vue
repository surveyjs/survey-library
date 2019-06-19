<template>
    <div>
      <label :class="question.cssClasses.label">
        <input
          type="radio"
          :name="question.name + '_' + question.id"
          :value="item.value"
          :id="question.inputId + '_' + index"
          v-model="question.renderedValue"
          :disabled="question.isReadOnly || !item.isEnabled"
          v-bind:aria-label="item.locText.renderedHtml"
          :class="question.cssClasses.itemControl"
        >
        <span :class="question.cssClasses.materialDecorator"></span>
        <span class="check"></span>
        <span :class="question.cssClasses.controlLabel">
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
}
Vue.component("survey-radiogroup-item", RadiogroupItem);
export default RadiogroupItem;
</script>