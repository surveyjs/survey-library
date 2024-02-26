<template>
  <div :class="question.renderCssRoot">
    <div :class="question.cssClasses.selectWrapper">
      <select
        v-if="!question.isReadOnly"
        :id="question.inputId"
        v-model="question.renderedValue"
        @click="click"
        @keyup="keyUp"
        :autocomplete="question.autocomplete"
        :class="question.getControlClass()"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-errormessage="question.ariaErrormessage"
        :required="question.isRequired"
      >
        <option v-if="question.allowClear" :value="undefined">{{ question.placeholder }}</option>
        <sv-dropdown-option-item
          v-for="item in question.visibleChoices"
          :item="item"
          :key="item.id"
        ></sv-dropdown-option-item>
      </select>
      <div disabled v-else :id="question.inputId" :class="question.getControlClass()">{{ question.readOnlyText }}</div>
      <div
        :class="question.cssClasses.chevronButton"
        v-if="question.cssClasses.chevronButtonIconId"
      >
        <sv-svg-icon
          :class="question.cssClasses.chevronButtonSvg"
          :iconName="question.cssClasses.chevronButtonIconId"
          size="auto"
        >
        </sv-svg-icon>
      </div>
    </div>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionDropdownModel, RendererFactory } from "survey-core";

@Component
export class DropdownSelect extends QuestionVue<QuestionDropdownModel> {
  public click(event: any) {
    this.question.onClick(event);
  }
  public keyUp(event: any) {
    this.question.onKeyUp(event);
  }
}

Vue.component("sv-dropdown-select", DropdownSelect);
RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");

export default DropdownSelect;
</script>
