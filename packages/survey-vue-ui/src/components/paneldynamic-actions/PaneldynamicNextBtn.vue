<template>
  <div :title="question.panelNextText" @click="nextPanelClick" :class="question.getNextButtonCss()">
    <sv-svg-icon :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
  </div>
</template>

<script lang="ts">
import { PaneldynamicActionMixin } from "./action";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [PaneldynamicActionMixin],
  name: "sv-paneldynamic-next-btn",
  methods: {
    nextPanelClick() {
      this.question.goToNextPanel();
    },
  },
});
</script>
