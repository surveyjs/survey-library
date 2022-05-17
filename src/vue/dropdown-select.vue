<template>
  <div :class="question.renderCssRoot">
    <div :class="question.cssClasses.selectWrapper">
      <div
        tabindex="0"
        v-if="!question.isReadOnly"
        :id="question.inputId"
        v-model="question.renderedValue"
        v-on:click="click"
        :class="question.getControlClass()"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
        :required="question.isRequired"
      >{{ question.readOnlyText }}</div>
      <sv-popup v-if="!question.isReadOnly" :model="question.popupModel"></sv-popup>
      <div disabled v-else :id="question.inputId" :class="question.getControlClass()">{{ question.readOnlyText }}</div>
    </div>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Dropdown from "./dropdown.vue";
import { RendererFactory } from "survey-core";
import { PopupUtils } from "src/utils/popup";

@Component
export class DropdownSelect extends Dropdown {
  public click(event: any) {
    PopupUtils.updatePopupWidthBeforeShow(this.question.popupModel, event);
  }
}

Vue.component("sv-dropdown-select", DropdownSelect);

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");

export default DropdownSelect;
</script>
