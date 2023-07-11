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
      :style="element.getRootStyle()"
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
import { BaseVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-row",
  mixins: [BaseVue],
  props: {
    row: { type: Object as PropType<QuestionRowModel>, required: true },
    css: Object,
    survey: Object as PropType<SurveyModel>,
  },
  methods: {
    getModel() { 
      return this.row;
    },
  },
  computed: {
    elements(): Array<any> {
      return this.row.visibleElements;
    }
  },
  mounted() {
    if (this.row) {
      if (!this.row.isNeedRender) {
        var rowContainerDiv = this.$el;
        setTimeout(() => {
          this.row.startLazyRendering(rowContainerDiv as HTMLElement);
        }, 10);
      }
    }
  },
  unmounted() {
    const row = this.row;
    if (row) {
      row.isNeedRender = !this.row.isLazyRendering();
    }
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
