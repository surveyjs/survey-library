<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      tabindex="0"
      v-if="!question.isReadOnly"
      :id="question.inputId"
      v-model="question.renderedValue"
      v-bind:disabled="question.isInputReadOnly"
      @click="click"
      @keyup="keyUp"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :required="question.isRequired"
    >
      <div :class="question.cssClasses.controlValue">{{ question.readOnlyText }}</div>
      <div
        :class="question.cssClasses.cleanButton"
        v-if="question.allowClear && question.cssClasses.cleanButtonIconId"
        v-show="!question.isEmpty()"
        @click="clear"
      >
        <sv-svg-icon
          :class="question.cssClasses.cleanButtonSvg"
          :iconName="question.cssClasses.cleanButtonIconId"
          size="auto"
        >
        </sv-svg-icon>
      </div>
    </div>
    <sv-popup
      v-if="!question.isReadOnly"
      :model="question.dropdownListModel.popupModel"
    ></sv-popup>
    <div disabled v-else :id="question.inputId" :class="question.getControlClass()">{{ question.readOnlyText }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question, DropdownMultiSelectListModel } from "survey-core";
import BaseVue from "src/vue/base";

@Component
export class TagboxComponent extends BaseVue {
  @Prop() question: Question;

  public click(event: any) {
    this.question.dropdownListModel?.onClick(event);
  }
  public clear(event: any) {
    this.question.dropdownListModel?.onClear(event);
  }
  public keyUp(event: any) {
    this.question.dropdownListModel?.onKeyUp(event);
  }
  public blur(event: any) {
    this.question.dropdownListModel?.onBlur(event);
  }
  protected onCreated() {
    if (!this.question.dropdownListModel) {
      this.question.dropdownListModel = new DropdownMultiSelectListModel(this.question);
    }
  }
}

Vue.component("sv-tagbox", TagboxComponent);
export default TagboxComponent;
</script>
