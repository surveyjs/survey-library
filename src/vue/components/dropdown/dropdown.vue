<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      tabindex="0"
      v-if="!question.isReadOnly"
      :id="question.inputId"
      v-model="question.renderedValue"
      v-on:click="click"
      v-on:keyup="keyUp"
      :class="question.getControlClass()"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :required="question.isRequired"
    >
      <div :class="question.cssClasses.controlValue">{{ question.readOnlyText }}</div>
      <div
        :class="question.cssClasses.cleanButton"
        v-if="question.showClearButton && question.cssClasses.cleanButtonIconId"
        v-show="!question.isEmpty()"
        v-on:click="clear"
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
import { Question, DropdownListModel } from "survey-core";
import BaseVue from "src/vue/base";
import { attachKey2click } from "../../survey.vue";

@Component
export class DropdownComponent extends BaseVue {
  @Prop() question: Question;

  public click(event: any) {
    this.question.dropdownListModel?.onClick(event);
  }
  public clear(event: any) {
    this.question.onClear(event);
  }
  public keyUp(event: any) {
    attachKey2click(event, { processEsc: false });
  }
  protected onCreated() {
    if (!this.question.dropdownListModel) {
      this.question.dropdownListModel = new DropdownListModel(this.question);
    }
  }
  protected onDestroyed() {
    this.question.dropdownListModel.dispose();
  }
}

Vue.component("sv-dropdown", DropdownComponent);
export default DropdownComponent;
</script>
