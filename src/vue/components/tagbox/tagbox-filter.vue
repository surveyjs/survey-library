<template>
  <input
    type="text"
    autocomplete="off"
    v-model="model.inputStringRendered"
    v-bind:class="question.cssClasses.filterStringInput"
    v-bind:placeholder="model.filterStringPlaceholder"
    v-bind:disabled="question.isInputReadOnly"
    :inputmode="model.inputMode"
    :role="model.filterStringEnabled ? question.ariaRole : null"
    :aria-label="question.placeholder"
    :id="question.getInputId()"
    :readonly="!model.searchEnabled ? true : null"
    :size="!model.inputStringRendered ? 1 : null"
    @change="inputChange"
    @keydown="inputKeyHandler"
    @blur="blur"
    @focus="focus"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";
import BaseVue from "../../base";

@Component
export class TagboxFilterComponent extends BaseVue {
  @Prop() model: DropdownMultiSelectListModel;
  @Prop() question: QuestionTagboxModel;

  getModel() {
    return this.model;
  }

  inputChange(event: any) {
    this.model.inputStringRendered = event.target.value;
  }
  inputKeyHandler(event: any) {
    //this.model.filterString = event.target.value;
    this.model.inputKeyHandler(event);
  }
  public blur(event: any) {
    this.model.onBlur(event);
  }
  public focus(event: any) {
    this.model.onFocus(event);
  }
}

Vue.component("sv-tagbox-filter", TagboxFilterComponent);
export default TagboxFilterComponent;
</script>
