<template>
    <svg ref="svgIcon" class="sv-svg-icon" role="img" :aria-label="title"><use></use></svg>
</template>

<script lang="ts">
import { createSvg } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-svg-icon",
  props: {
    size: Number,
    width: Number,
    height: Number,
    iconName: String,
    svgIconElement: Object,
    title: String,
  },
  data: (vm: any) => {
    return {
      svgIconElement: undefined,
      onUpdated() {
        createSvg(
          vm.size,
          vm.width,
          vm.height,
          vm.iconName,
          vm.svgIconElement,
          vm.title
        );
      }

    }
  },
  mounted() {
    this.svgIconElement = this.$refs["svgIcon"];
    this.onUpdated();
  }
});

</script>
