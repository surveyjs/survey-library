<template>
  <div :class="row.getRowCss()">
    <div v-for="element in elements" :style="element.rootStyle">
    <survey-element
      v-if="!element.isPanel" 
      :key="element.id"
      :element="element"
      :survey="survey"
      :css="css"
      :row="row"
      :style="{
          paddingLeft: element.paddingLeft,
          paddingRight: element.paddingRight,
        }"
    >
    </survey-element>
    <survey-panel
      v-if="element.isPanel"
      :key="element.id"
      :question="element"
      :css="css">
    </survey-panel>

    </div>
  </div>
</template>

<script lang="ts">
import { SurveyModel } from "survey-core";
import { QuestionRowModel } from "survey-core";
import { Base } from "survey-core";
import { defineSurveyComponent } from "./base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-row",
  props: {
    row: Object as PropType<QuestionRowModel>,
    css: Object,
    survey: Object as PropType<SurveyModel>,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.row; }
    }
  },
  computed: {
    elements(): Array<any> {
      return this.row.visibleElements;
    }
  },
  mounted() {
    if (!!this.row) {
      if (!this.row.isNeedRender) {
        var rowContainerDiv = this.$el;
        setTimeout(() => {
          this.row.startLazyRendering(rowContainerDiv as HTMLElement);
        }, 10);
      }
    }
  },
  unmounted() {
    if (!!this.row) {
      this.row.isNeedRender = !this.row.isLazyRendering();
    }
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
