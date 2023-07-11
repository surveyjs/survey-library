<template>
    <svg ref="svgIconElement" class="sv-svg-icon" role="img" :aria-label="title"><use></use></svg>
</template>

<script lang="ts">
import { createSvg } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, onUpdated, onMounted } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-svg-icon",
  props: {
    size: { type: [String, Number] },
    width: Number,
    height: Number,
    iconName: String,
    title: String,
  },
  setup(props) {
    const svgIconElement = ref();
    const updateCallback = () => {
      createSvg(
        props.size,
        props.width,
        props.height,
        props.iconName,
        svgIconElement.value,
        props.title
      );
    };
    onUpdated(() => {
      updateCallback();
    });
    onMounted(() => {
      updateCallback();
    });
    return {
      svgIconElement: svgIconElement,
    };
  },
});

</script>
