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
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: LocalizableString.editableRenderer,
  props: {
    locString: { type: Object as PropType<LocalizableString>, required: true },
  },
  methods: {
    onInput(event: any) {
      const locString = this.locString;
      locString.text = event.target.innerText;
    },
    onClick(event: any) {
      event.preventDefault();
      event.stopPropagation();
    },
  },
});

// Vue.component(LocalizableString.editableRenderer, SurveyStringEditor);
// export default SurveyStringEditor;
</script>
