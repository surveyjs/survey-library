<template>
  <div :class="question.cssClasses.rootCheckbox">
    <div :class="question.getCheckboxItemCss()">
      <label :class="question.cssClasses.checkboxLabel">
        <input
          type="checkbox"
          :name="question.name"
          :value="question.checkedValue"
          v-model="question.checkedValue"
          :class="question.cssClasses.controlCheckbox"
          :id="question.inputId"
          :indeterminate.prop="question.isIndeterminate"
          :disabled="question.isInputReadOnly"
          :aria-required="question.ariaRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-describedby="question.ariaDescribedBy"
        /><span :class="question.cssClasses.checkboxMaterialDecorator"><svg v-if="question.svgIcon" :class="question.cssClasses.checkboxItemDecorator">
            <use
              :xlink:href="question.svgIcon"
            ></use>
          </svg><span class="check"></span></span><span
          v-if="question.titleLocation === 'hidden'"
          :class="question.cssClasses.checkboxControlLabel"
        >
          <survey-string :locString="question.locDisplayLabel" />
        </span>
      </label>
    </div>
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
