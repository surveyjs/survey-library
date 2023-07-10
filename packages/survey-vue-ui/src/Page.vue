<template>
  <div :class="page.cssRoot">
    <survey-element-title :element="page" :css="css"/>
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <template v-for="(row, index) in rows">
      <survey-row  
      v-if="row.visible"
      :key="page.id + '_' + index"
      :row="row" 
      :survey="survey" 
      :css="css">
      </survey-row>
    </template>
  </div>
</template>

<script lang="ts">
import { SurveyModel } from "survey-core";
import { PageModel } from "survey-core";
import { Base } from "survey-core";
import { defineSurveyComponent } from "./base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-page",
  props: {
    survey: Object as PropType<SurveyModel>,
    page: Object as PropType<PageModel>,
    css: Object
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.page; }
    }
  },
  computed: {
    showDescription() {
      return this.page._showDescription;
    },
    num() {
      return this.page.num > 0 ? this.page.num + ". " : "";
    },
    rows(): Array<any> {
      return this.page.rows;
    },
  },
  mounted() {
    if (this.survey) {
      this.survey.afterRenderPage(this.$el as HTMLElement);
    }
  },
  updated() {
    this.survey.afterRenderPage(this.$el as HTMLElement);
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>