<template>
  <div :class="question.cssClasses.selectWrapper">
    <select
      v-if="!question.isReadOnly"
      :id="question.inputId"
      v-model="question.renderedValue"
      v-on:click="onClick()"
      :autocomplete="question.autoComplete"
      :class="question.getControlClass()"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :required="question.isRequired"
    >
      <option v-if="question.showOptionsCaption" :value="undefined">
        {{ question.optionsCaption }}
      </option>
      <sv-dropdown-option-item
        v-for="item in question.visibleChoices"
        :item="item"
        :key="item.id"
      ></sv-dropdown-option-item>
    </select>
    <div disabled v-else :id="question.inputId" :class="question.getControlClass()">
      {{ question.readOnlyText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question, RendererFactory } from "survey-core";
import BaseVue from "src/vue/base";

@Component
export class DropdownSelectComponent extends BaseVue {
  @Prop() question: Question;

  public onClick() {
    !!this.question.onOpenedCallBack && this.question.onOpenedCallBack();
  }
}
Vue.component("sv-dropdown-select", DropdownSelectComponent);

RendererFactory.Instance.registerRenderer("dropdown", "select", "sv-dropdown-select");

export default DropdownSelectComponent;
</script>
