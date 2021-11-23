<template>
  <div :class="question.cssClasses.root">
    <label :class="question.getItemCss()">
      <input
        type="checkbox"
        :name="question.name"
        :value="question.checkedValue"
        v-model="question.checkedValue"
        :class="question.cssClasses.control"
        :id="question.inputId"
        :indeterminate.prop="question.isIndeterminate"
        :disabled="question.isInputReadOnly"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
      /><span :class="question.cssClasses.materialDecorator">
        <svg viewBox="0 0 24 24" :class="question.cssClasses.itemDecorator">
          <rect
            :class="question.cssClasses.uncheckedPath"
            x="5"
            y="10"
            width="14"
            height="4"
          /><polygon
            :class="question.cssClasses.checkedPath"
            points="19,10 14,10 14,5 10,5 10,10 5,10 5,14 10,14 10,19 14,19 14,14 19,14 "
          /><path
            :class="question.cssClasses.indeterminatePath"
            d="M22,0H2C0.9,0,0,0.9,0,2v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V2C24,0.9,23.1,0,22,0z M21,18L6,3h15V18z M3,6l15,15H3V6z"
          />
        </svg><span class="check"></span>
      </span><span
        v-if="question.titleLocation === 'hidden'"
        :class="question.getLabelCss()"
      >
        <survey-string :locString="question.locDisplayLabel" />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Boolean } from "./boolean";
import { RendererFactory } from "survey-core";

@Component
export class BooleanCheckbox extends Boolean {}

Vue.component("sv-boolean-checkbox", BooleanCheckbox);

RendererFactory.Instance.registerRenderer(
  "boolean",
  "checkbox",
  "sv-boolean-checkbox"
);

export default BooleanCheckbox;
</script>
