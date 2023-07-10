<template>
  <component :is="locString.renderAs" :locString="locString.renderAsData" />
</template>

<script lang="ts">
import { LocalizableString } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-string",
  props: {
    locString: Object as PropType<LocalizableString>
  },
  data: (vm: any) => {
    return {
    }
  }
});

// export default SurveyString;
</script>
