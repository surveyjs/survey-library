<template>
  <div :class="question.cssClasses.root">
    <fieldset role="presentation">
      <sv-boolean-radio-item
        :key="false"
        :question="question"
        :item="{value: false, locText: this.question.locLabelFalse}"
      ></sv-boolean-radio-item>
      <sv-boolean-radio-item
        :key="true"
        :question="question"
        :item="{value: true, locText: this.question.locLabelTrue, question: this.question}"
      ></sv-boolean-radio-item>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Boolean } from "./boolean";
import { RendererFactory } from "survey-core";

@Component
export class BooleanRadio extends Boolean {}

Vue.component("sv-boolean-radio", BooleanRadio);

RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "sv-boolean-radio"
);

export default BooleanRadio;
</script>
