<template>
  <button
    type="button"
    v-if="question.canAddPanel"
    :class="question.getAddButtonCss()"
    @click="addPanelClick"
    >
    <span :class="question.cssClasses.buttonAddText">
      {{ question.panelAddText }}
    </span>
  </button>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionPanelDynamicModel } from "survey-core";

@Component
export class PanelDynamicAdd extends Vue {
  @Prop() question: QuestionPanelDynamicModel;
  addPanelClick() {
    this.question.addPanelUI();
  }
}
Vue.component("survey-paneldynamicadd", PanelDynamicAdd);
export default PanelDynamicAdd;
</script>
