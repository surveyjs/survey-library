<template>
  <span
    class="sv-string-viewer"
    v-if="locString.hasHtml"
    v-html="renderedHtml"
  ></span>
  <span class="sv-string-viewer" v-else>{{ renderedHtml }}</span>
</template>

<script lang="ts">
import { LocalizableString } from "survey-core";
import { ref, defineComponent, type PropType, watch, onUnmounted } from "vue";
import { useLocString } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: LocalizableString.defaultRenderer,
  props: {
    locString: { type: Object as PropType<LocalizableString>, required: true },
  },
  setup(props) {
    return {
      renderedHtml: useLocString(() => props.locString),
    };
  },
});
</script>
