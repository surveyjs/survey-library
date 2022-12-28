<template>
  <component :is="locString.renderAs" :locString="locString.renderAsData" />
</template>

<script lang="ts">
import { LocalizableString } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-string",
  props: {
    locString: LocalizableString
  },
  data: (vm: any) => {
    return {
    }
  }
});

// export default SurveyString;
</script>
