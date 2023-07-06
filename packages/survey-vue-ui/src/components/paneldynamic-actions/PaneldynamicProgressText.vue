<template>
  <div :class="question.cssClasses.progressText">{{ question.progressText }}</div>
</template>

<script lang="ts">
import { PaneldynamicActionMixin } from "./action";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [PaneldynamicActionMixin],
  name: "sv-paneldynamic-progress-text",
});
</script>
