<template>
  <component :is="locString.renderAs" :locString="locString.renderAsData" />
</template>

<script lang="ts">
import { LocalizableString } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-string",
  props: {
    locString: Object as PropType<LocalizableString>,
  },
});
</script>
