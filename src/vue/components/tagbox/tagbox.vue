<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="question.isInputReadOnly || model.searchEnabled ? undefined : 0"
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
      <div :class="question.cssClasses.controlValue">
        <sv-tagbox-item
          v-for="(item, index) in question.selectedItems"
          :item="item"
          :question="question"
          :key="'item' + index"
        ></sv-tagbox-item>
        <input
          type="text"
          autocomplete="off"
          v-if="model.searchEnabled"
          v-bind:class="question.cssClasses.filterStringInput"
          :id="question.getInputId()"
          :value="model.filterString"
          :size="!model.filterString ? 1 : null"
          @change="inputChange"
          @keyup="inputKeyUp"
        />
        <div
          v-if="question.isEmpty() && !model.filterString"
          :class="question.cssClasses.placeholderInput"
        >{{ question.placeholder }}</div>
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
    <sv-popup v-if="!question.isReadOnly" :model="model.popupModel"></sv-popup>
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
      this.question.dropdownListModel = new DropdownMultiSelectListModel(this.question);
    }
  }
}

Vue.component("sv-tagbox", TagboxComponent);
export default TagboxComponent;
</script>
