<template>
  <div :title="question.panelPrevText" @click="prevPanelClick" :class="question.getPrevButtonCss()">
    <sv-svg-icon :iconName="question.cssClasses.progressBtnIcon" :size="'auto'"></sv-svg-icon>
  </div>
</template>

<script lang="ts">
import { PaneldynamicActionMixin } from "./action";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [PaneldynamicActionMixin],
  name: "sv-paneldynamic-prev-btn",
  data: (vm: any) => {
    return {
      prevPanelClick() {
        vm.question.goToPrevPanel();
      },
    };
  },
});
</script>
