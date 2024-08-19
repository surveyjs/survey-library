<template>
  <textarea
    ref="contentElement"
    :readonly="model.isReadOnlyAttr"
    :disabled="model.isDisabledAttr"
    :value="value"
    :id="model.id"
    :maxlength="model.maxLength"
    :cols="model.cols"
    :rows="model.rows"
    :placeholder="model.placeholder"
    :class="model.className"
    @focus="
      (e) => {
        model.onTextAreaFocus(e);
      }
    "
    @blur="
      (e) => {
        model.onTextAreaBlur(e);
      }
    "
    @change="
      (e) => {
        model.onTextAreaChange(e);
      }
    "
    @input="
      (e) => {
        model.onTextAreaInput(e);
      }
    "
    @keydown="
      (e) => {
        model.onTextAreaKeyDown(e);
      }
    "
    :aria-required="model.ariaRequired"
    :aria-label="model.ariaLabel"
    :aria-labelledby="model.ariaLabelledBy"
    :aria-describedby="model.ariaDescribedBy"
    :aria-invalid="model.ariaInvalid"
    :aria-errormessage="model.ariaErrormessage"
    v-bind:style="{ resize: model.question.resizeStyle }"
  ></textarea>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { TextAreaModel } from "survey-core";
import { BaseVue } from "../base";

@Component
export class TextAreaComponent extends BaseVue {
  @Prop() model: TextAreaModel;
  constructor() {
    super();
  }
  get value() {
    return this.model.getTextValue() || "";
  }
  protected onMounted() {
    this.model.setElement(this.$refs["contentElement"] as HTMLTextAreaElement);
  }
  protected onUpdated() {
    this.model.setElement(this.$refs["contentElement"] as HTMLTextAreaElement);
  }
}

Vue.component("sv-text-area", TextAreaComponent);

export default TextAreaComponent;
</script>
