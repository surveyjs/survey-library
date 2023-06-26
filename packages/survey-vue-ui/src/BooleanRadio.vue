<template>
  <div :class="question.cssClasses.rootRadio">
    <fieldset role="presentation" :class="question.cssClasses.radioFieldset">
      <sv-boolean-radio-item
        :key="false"
        :question="question"
        :locText="question.locLabelFalse"
        :value="false"
      ></sv-boolean-radio-item>
      <sv-boolean-radio-item
        :key="true"
        :question="question"
        :locText="question.locLabelTrue"
        :value="true"
      ></sv-boolean-radio-item>
    </fieldset>
  </div>
</template>

<script lang="ts">
import { RendererFactory } from "survey-core";
import { QuestionVue } from "./base";
import { BooleanBaseMixin } from "./boolean";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue, BooleanBaseMixin],
  name: "sv-boolean-radio",
});

RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "sv-boolean-radio"
);
</script>