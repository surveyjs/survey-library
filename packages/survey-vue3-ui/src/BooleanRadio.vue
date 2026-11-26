<template>
  <div :class="question.cssClasses.rootRadio" ref="root" @keydown="(e) => question.onKeyDownCore(e)">
    <fieldset
      role="radiogroup"
      :class="question.cssClasses.radioFieldset"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-errormessage="question.a11y_input_ariaErrormessage"
    >
      <SvComponent
        :is="'sv-boolean-radio-item'"
        v-if="question.swapOrder"
        :key="'true'"
        :question="question"
        :locText="question.locLabelTrue"
        :value="question.getValueTrue()"
      ></SvComponent>
      <SvComponent
        :is="'sv-boolean-radio-item'"
        :key="'false'"
        :question="question"
        :locText="question.locLabelFalse"
        :value="question.getValueFalse()"
      ></SvComponent>
      <SvComponent
        :is="'sv-boolean-radio-item'"
        v-if="!question.swapOrder"
        :key="'true'"
        :question="question"
        :locText="question.locLabelTrue"
        :value="question.getValueTrue()"
      ></SvComponent>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
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
