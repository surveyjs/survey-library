<template>
  <svg ref="svgIcon" class="sv-svg-icon"><use></use></svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { createSvg } from "survey-core";

@Component
export class SvgIcon extends Vue {
  @Prop size: any;
  @Prop width: number;
  @Prop height: number;
  @Prop iconName: string;

  constructor() {
    super();
  }

  mounted() {
    let svgIconElement: any = this.$refs["svgIcon"];
    createSvg(
      this.size,
      this.width,
      this.height,
      this.iconName,
      svgIconElement
    );
  }
}

Vue.component("sv-svg-icon", SvgIcon);

export default SvgIcon;
</script>
