<template>
  <div :class="question.cssClasses.rootRadio" ref="root">
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

<script lang="ts" setup>
import { RendererFactory } from "survey-core";
import { ref } from "vue";
import { useQuestion } from "./base";
import type { IBooleanProps } from "./boolean";
defineOptions({ inheritAttrs: false });
const root = ref(null);
const props = defineProps<IBooleanProps>();
useQuestion(props, root);
</script>

<script lang="ts">
RendererFactory.Instance.registerRenderer(
  "boolean",
  "radio",
  "sv-boolean-radio"
);
</script>
