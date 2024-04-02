<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      v-bind:disabled="question.isInputReadOnly"
      :tabindex="model.noTabIndex ? undefined : 0"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage"
      :aria-expanded="question.ariaExpanded"
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :required="question.isRequired"
    >
      <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
        <span>{{ model.hintStringPrefix }}</span>
      </div>

      <div :class="question.cssClasses.controlValue">
        <survey-string
          v-if="showSelectedItemLocText"
          :locString="selectedItemLocText"
        />
        <div v-if="model.showHintString" :class="question.cssClasses.hintSuffix">
        <span style="visibility: hidden">{{ model.inputStringRendered }}</span>
        <span>{{ model.hintStringSuffix }}</span>
        </div>
    <component
      v-if="question.showInputFieldComponent"
      :is="question.inputFieldComponentName"
      :item="model.getSelectedAction()"
      :question="question"
    >
    </component>
    <input
      type="text"
      ref="inputElement"
      v-bind:class="question.cssClasses.filterStringInput"
      v-bind:disabled="question.isInputReadOnly"
      autocomplete="off"
      :inputmode="model.inputMode"
      :role="model.filterStringEnabled ? question.ariaRole : null"
      :id="question.getInputId()"
      :tabindex="model.noTabIndex ? undefined : -1"
      :readonly="model.filterReadOnly ? true : null"
      :aria-expanded="question.ariaExpanded"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :placeholder="model.placeholderRendered"
      @input="inputChange"
      @blur="blur"
    @focus="focus"
        />
      </div>
      <div
        :class="question.cssClasses.cleanButton"
        v-if="question.allowClear && question.cssClasses.cleanButtonIconId"
        v-show="question.showClearButton"
        @click="clear"
        aria-hidden="true"
      >
        <sv-svg-icon
          :class="question.cssClasses.cleanButtonSvg"
          :iconName="question.cssClasses.cleanButtonIconId"
          :title="question.clearCaption"
          size="auto"
        >
        </sv-svg-icon>
      </div>
    </div>
    <sv-popup
      v-if="!question.isReadOnly"
      :model="question.dropdownListModel.popupModel"
    ></sv-popup>
    <div disabled v-else :id="question.inputId" :class="question.getControlClass()">
      <survey-string
        v-if="selectedItemLocText"
        :locString="selectedItemLocText"
      />
      <div>{{ question.readOnlyText }}</div>
    </div>
    <div
      :class="question.cssClasses.chevronButton"
          v-on:pointerdown="chevronPointerDown"
      v-if="question.cssClasses.chevronButtonIconId"
      aria-hidden="true"
    >
      <sv-svg-icon
        :class="question.cssClasses.chevronButtonSvg"
        :iconName="question.cssClasses.chevronButtonIconId"
        size="auto"
      >
      </sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question, DropdownListModel, Helpers } from "survey-core";
import BaseVue from "../../base";

@Component
export class DropdownComponent extends BaseVue {
  @Prop() question: Question;
  inputElement: any;

  get model() {
    return this.question.dropdownListModel;
  }
  getModel() {
    if (!this.question.dropdownListModel) {
      this.question.dropdownListModel = new DropdownListModel(this.question);
    }
    return this.model;
  }

  inputChange(event: any) {
    this.model.inputStringRendered = event.target.value;
  }

  public get showSelectedItemLocText() {
    return this.question.showSelectedItemLocText;
  }

  public get selectedItemLocText() {
    return this.question.selectedItemLocText;
  }

  public click(event: any) {
    this.model?.onClick(event);
  }
  public chevronPointerDown(event: any) {
    this.model?.chevronPointerDown(event);
  }
  public clear(event: any) {
    this.model?.onClear(event);
  }
  public keyhandler(event: any) {
    this.model?.keyHandler(event);
  }
  public blur(event: any) {
    this.model?.onBlur(event);
    this.updateInputDomElement();
  }
  public focus(event: any) {
    this.model?.onFocus(event);
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
      const newValue = this.model.inputStringRendered;
      if (!Helpers.isTwoValueEquals(newValue, control.value, false, true, false)) {
        control.value = this.model.inputStringRendered;
      }
    }
  }
}

Vue.component("sv-dropdown", DropdownComponent);
export default DropdownComponent;
</script>
