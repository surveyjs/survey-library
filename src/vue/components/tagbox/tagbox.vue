<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="model.noTabIndex ? undefined : 0"
      v-bind:disabled="question.isInputReadOnly"
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
      <div :class="question.cssClasses.controlValue">
        <sv-tagbox-item
          v-for="(item, index) in selectedChoices"
          :item="item"
          :question="question"
          :key="'item' + index"
        ></sv-tagbox-item>
        <sv-tagbox-filter :model="model" :question="question"></sv-tagbox-filter>
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
    <sv-popup v-if="!question.isReadOnly" :model="model.popupModel"></sv-popup>
    <div disabled v-else :id="question.inputId" :class="question.getControlClass()">
      <survey-string
        v-if="question.locReadOnlyText"
        :locString="question.locReadOnlyText"
      />
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
import { Question, DropdownMultiSelectListModel } from "survey-core";
import BaseVue from "../../base";

@Component
export class TagboxComponent extends BaseVue {
  @Prop() question: Question;

  get model() {
    return this.question.dropdownListModel;
  }
  get selectedChoices() {
    return this.question.selectedChoices;
  }
  getModel() {
    return this.model;
  }
  inputChange(event: any) {
    this.model.filterString = event.target.value;
  }

  public click(event: any) {
    this.question.dropdownListModel?.onClick(event);
  }
  public clear(event: any) {
    this.question.dropdownListModel?.onClear(event);
  }
  public chevronPointerDown(event: any) {
    this.question.dropdownListModel?.chevronPointerDown(event);
  }
  public keyhandler(event: any) {
    this.question.dropdownListModel?.keyHandler(event);
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
