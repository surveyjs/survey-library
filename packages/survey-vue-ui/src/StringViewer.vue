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
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: LocalizableString.defaultRenderer,
  props: {
    locString: Object as PropType<LocalizableString>,
  },
  data: (vm: any) => {
    if (vm.locString) {
      vm.locString.onChanged = () => {
        vm.renderedHtml = vm.locString.renderedHtml;
      };
      vm.locString.onChanged();
    }
    return {
      renderedHtml: vm.locString.renderedHtml,
    };
  },
});

</script>
