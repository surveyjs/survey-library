<template>
  <span
    class="sv-string-viewer"
    v-if="locString.hasHtml"
    v-html="locString.renderedHtml"
  ></span>
  <span class="sv-string-viewer" v-else>{{ locString.renderedHtml }}</span>
</template>

<script lang="ts">
import { LocalizableString } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: LocalizableString.defaultRenderer,
  props: {
    locString: LocalizableString
  },
  data: (vm: any) => {
    if (!vm.locString) return;
    vm.locString.onChanged = () => {
      // vm.$forceUpdate();
    };
    vm.locString.onChanged();

    return {
    }
  }
});

// Vue.component(LocalizableString.defaultRenderer, SurveyStringViewer);
// export default SurveyStringViewer;
</script>
