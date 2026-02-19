<template>
  <span
    class="sv-string-editor"
    contenteditable="true"
    v-if="model.hasHtml"
    v-html="model.renderedHtml"
    @blur="onInput"
    @click="onClick"
  ></span>
  <span
    class="sv-string-editor"
    contenteditable="true"
    v-else
    @blur="onInput"
    @click="onClick"
    >{{ model.renderedHtml }}</span
  >
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";

const props = defineProps<{
  model: LocalizableString;
}>();

const onInput = (event: any) => {
  const locString = props.model;
  locString.text = event.target.innerText;
};
const onClick = (event: any) => {
  event.preventDefault();
  event.stopPropagation();
};
</script>
