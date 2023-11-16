<template>
    <svg ref="svgIcon" class="sv-svg-icon" role="img"><use></use></svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { createSvg } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class SvgIcon extends BaseVue {
  @Prop()
  size: number;
  @Prop()
  width: number;
  @Prop()
  height: number;
  @Prop() iconName: string;
  svgIconElement: any;
  @Prop()
  title: any;

  constructor() {
    super();
  }
  @Watch("size")
  onSizePropertyChanged() {
    this.onUpdated();
  }
  @Watch("width")
  onWidthPropertyChanged() {
    this.onUpdated();
  }
  @Watch("height")
  onHeightPropertyChanged() {
    this.onUpdated();
  }
  @Watch("iconName")
  onIconNamePropertyChanged() {
    this.onUpdated();
  }

  onUpdated() {
    createSvg(
      this.size,
      this.width,
      this.height,
      this.iconName,
      this.svgIconElement,
      this.title
    );
  }

  onMounted() {
    this.svgIconElement = this.$refs["svgIcon"];
    this.onUpdated();
  }
}

Vue.component("sv-svg-icon", SvgIcon);

export default SvgIcon;
</script>
