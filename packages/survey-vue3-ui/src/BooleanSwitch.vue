<template>
  <div
    :class="question.cssClasses.rootSwitch"
    ref="root"
    role="checkbox"
    :aria-checked="question.booleanValue || false"
    :aria-required="question.a11y_input_ariaRequired"
    :aria-label="question.a11y_input_ariaLabel"
    :aria-labelledby="question.a11y_input_ariaLabelledBy"
    :aria-invalid="question.a11y_input_ariaInvalid"
    :aria-errormessage="question.a11y_input_ariaErrormessage"
    @click="renderedValue = !renderedValue"
  >
    <div
      :class="question.getSwitchButtonCss()"
      tabindex="0"
      v-key2click="{ processEsc: false }"
    >
      <div :class="question.cssClasses.switchThumb">
        <div
          :class="question.cssClasses.switchThumbCircle + ' ' + question.cssClasses.switchThumbLeft"
        ></div>
      </div>
      <div :class="question.cssClasses.switchThumb">
        <div
          :class="question.cssClasses.switchThumbCircle + ' ' + question.cssClasses.switchThumbRight"
        ></div>
      </div>
    </div>
    <div :class="question.cssClasses.switchCaption">
      <div :class="question.cssClasses.switchTitle" :id="question.labelRenderedAriaID">
        <SvComponent :is="'survey-string'" :locString="question.locTitle" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { RendererFactory } from "survey-core";
import { computed, ref } from "vue";
import { useQuestion } from "./base";
import { key2ClickDirective as vKey2click } from "@/directives/key2click";
import type { IBooleanProps } from "./boolean";
defineOptions({ inheritAttrs: false });
const props = defineProps<IBooleanProps>();
const root = ref(null);
useQuestion(props, root);

const renderedValue = computed({
  get() {
    return props.question.booleanValue;
  },
  set(val) {
    // eslint-disable-next-line vue/no-mutating-props
    props.question.booleanValue = val;
  },
});
</script>

<script lang="ts">
RendererFactory.Instance.registerRenderer(
  "boolean",
  "switch",
  "sv-boolean-switch"
);
</script>
