<template>
  <div :class="question.cssClasses.rootRadio">
    <fieldset role="presentation" :class="question.cssClasses.radioFieldset">
      <sv-boolean-radio-item
        v-if="question.swapOrder"
        :key="true"
        :question="question"
        :locText="question.locLabelTrue"
        :value="true"
      ></sv-boolean-radio-item>
      <sv-boolean-radio-item
        :key="false"
        :question="question"
        :locText="question.locLabelFalse"
        :value="false"
      ></sv-boolean-radio-item>
      <sv-boolean-radio-item
        v-if="!question.swapOrder"
        :key="true"
        :question="question"
        :locText="question.locLabelTrue"
        :value="true"
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
export class BooleanRadio extends Boolean {

}

Vue.component("sv-boolean-radio", BooleanRadio);

RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "sv-boolean-radio"
);

export default BooleanRadio;
</script>
