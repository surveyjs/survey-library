<template>
  <span
    class="sv-string-editor"
    contenteditable="true"
    v-if="locString.hasHtml"
    v-html="locString.renderedHtml"
    @blur="onInput"
    @click="onClick"
  ></span>
  <span
    class="sv-string-editor"
    contenteditable="true"
    v-else
    @blur="onInput"
    @click="onClick"
    >{{ locString.renderedHtml }}</span
  >
</template>

<script lang="ts" setup>
import type { LocalizableString } from "survey-core";

const props = defineProps<{
  locString: LocalizableString;
}>();

const onInput = (event: any) => {
  const locString = props.locString;
  locString.text = event.target.innerText;
};
const onClick = (event: any) => {
  event.preventDefault();
  event.stopPropagation();
};
</script>
