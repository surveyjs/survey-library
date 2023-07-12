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
import { ref, defineComponent, type PropType, watch } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: LocalizableString.defaultRenderer,
  props: {
    locString: { type: Object as PropType<LocalizableString>, required: true },
  },
  setup(props) {
    const renderedHtml = ref();
    const setupOnChangedCallback = (locString: LocalizableString) => {
      renderedHtml.value = locString.renderedHtml;
      locString.onChanged = () => {
        renderedHtml.value = locString.renderedHtml;
      }
    };
    watch(() => props.locString, (newValue, oldValue) => {
      oldValue.onChanged = () => {};
      setupOnChangedCallback(newValue);
    });
    setupOnChangedCallback(props.locString);
    return {
      renderedHtml,
    };
  },
});

</script>
