<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      v-model="question.renderedValue"
      v-bind:disabled="question.isInputReadOnly"
      :tabindex="question.isInputReadOnly || model.searchEnabled ? undefined : 0"
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
      <div :class="question.cssClasses.controlValue">
        <input
          type="text"
          v-bind:class="question.cssClasses.filterStringInput"
          :id="question.getInputId()"
          :readonly="!model.searchEnabled ? true : null"
          :placeholder="question.readOnlyText"
          @change="inputChange"
          @keyup="inputKeyUp"
        />
      </div>
      <div
        :class="question.cssClasses.cleanButton"
        v-if="question.allowClear && question.cssClasses.cleanButtonIconId"
        v-show="!question.isEmpty()"
        @click="clear"
      >
        <sv-svg-icon
          :class="question.cssClasses.cleanButtonSvg"
          :iconName="question.cssClasses.cleanButtonIconId"
          :title="question.cleanButtonCaption"
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

@Component
export class DropdownComponent extends BaseVue {
  @Prop() question: Question;

  get model() {
    return this.question.dropdownListModel;
  }
  getModel() {
    return this.model;
  }

  inputChange(event: any) {
    this.model.filterString = event.target.value;
  }
  inputKeyUp(event: any) {
    this.model.filterString = event.target.value;
    this.model.inputKeyUpHandler(event);
  }

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
      this.question.dropdownListModel = new DropdownListModel(this.question);
    }
  }
}

Vue.component("sv-dropdown", DropdownComponent);
export default DropdownComponent;
</script>
