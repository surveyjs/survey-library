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
    const renderedHtml = ref(props.locString?.renderedHtml);
    const setupOnChangedCallback = (locString: LocalizableString) => {
      locString.onChanged = () => {
        renderedHtml.value = locString.renderedHtml;
      }
    };
    watch(() => props.locString, (oldValue, newValue) => {
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
