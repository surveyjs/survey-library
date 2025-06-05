<template>
  <textarea
    :ref="(el)=>getRef(el as HTMLTextAreaElement)"
    :readonly="model.isReadOnlyAttr"
    :disabled="model.isDisabledAttr"
    :value="value"
    :id="model.id"
    :maxlength="model.maxLength"
    :cols="model.cols"
    :rows="model.rows"
    :placeholder="model.placeholder"
    :class="model.className"
    @blur="
      (e) => {
        model.onTextAreaBlur(e);
      }
    "
    @focus="
      (e) => {
        model.onTextAreaFocus(e);
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

<script lang="ts" setup>
import type { TextAreaModel } from "survey-core";
import { computed, onMounted, onUpdated, onUnmounted, ref } from "vue";

const props = defineProps<{ model: TextAreaModel, getRef?: (element: HTMLElement) => void }>();
const contentElement = ref<HTMLTextAreaElement>(
  null as any as HTMLTextAreaElement
);
const getRef = function (element: HTMLTextAreaElement) {
  contentElement.value = element;
  if (props.getRef) props.getRef(element);
};
const value = computed(() => props.model.getTextValue() || "");

onMounted(() => {
  props.model.setElement(contentElement.value);
});
onUpdated(() => {
  props.model.setElement(contentElement.value);
});
onUnmounted(() => {
  props.model.resetElement();
});
</script>
