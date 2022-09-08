<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
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
          ref="inputElement"
          v-bind:class="question.cssClasses.filterStringInput"
          autocomplete="off"
          :id="question.getInputId()"
          :readonly="!model.searchEnabled ? true : null"
          :placeholder="question.readOnlyText"
          @change="inputChange"
          @keyup="inputKeyUp"
          @blur="blur"
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
import { Question, DropdownListModel, Helpers } from "survey-core";
import BaseVue from "src/vue/base";

@Component
export class DropdownComponent extends BaseVue {
  @Prop() question: Question;
  inputElement: any;

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
    this.model?.onClick(event);
  }
  public clear(event: any) {
    this.model?.onClear(event);
  }
  public keyUp(event: any) {
    this.model?.onKeyUp(event);
  }
  public blur(event: any) {
    this.model?.onBlur(event);
  }

  protected onCreated() {
    if (!this.question.dropdownListModel) {
      this.question.dropdownListModel = new DropdownListModel(this.question);
    }
  }

  protected onMounted() {
    this.inputElement = this.$refs["inputElement"];
    this.updateInputDomElement();
  }
  protected onUpdated() {
    this.updateInputDomElement();
  }
  updateInputDomElement() {
    if (!!this.inputElement) {
      const control: any = this.inputElement;
      const newValue = this.model.filterString;
      if (!Helpers.isTwoValueEquals(newValue, control.value)) {
        control.value = this.model.filterString;
      }
    }
  }
}

Vue.component("sv-dropdown", DropdownComponent);
export default DropdownComponent;
</script>
