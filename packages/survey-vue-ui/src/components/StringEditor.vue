<template>
  <span class="sv-string-editor" contenteditable="true"
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

<script lang="ts">
import { LocalizableString } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: LocalizableString.editableRenderer,
  props: {
    locString: LocalizableString,
  },
  data: (vm: any) => {
    return {
      onInput: (event: any) => {
        this.locString.text = event.target.innerText;
      },
      onClick: (event: any) => {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  }
});

// Vue.component(LocalizableString.editableRenderer, SurveyStringEditor);
// export default SurveyStringEditor;
</script>
