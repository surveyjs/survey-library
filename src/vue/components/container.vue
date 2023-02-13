<template>
  <div className="sd-components-column">
  <template v-for="(component, index) in components">
    <component 
      :is="component.component"
      :survey="survey"
      :model="component.data"
    ></component>
  </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { SurveyModel } from "survey-core";
import { BaseVue } from "../base";

@Component
export class ComponentsContainer extends BaseVue {
  @Prop() survey: SurveyModel;
  @Prop() container: string;
  components: Array<any>;
  constructor() {
    super();
    this.components = this.survey.getContainerContent(this.container as any);
  }
  @Watch("survey")
  @Watch("container")
  onPropertyChanged(value: string, oldValue: string) {
    this.components = this.survey.getContainerContent(this.container as any);
  }
}

Vue.component("sv-components-container", ComponentsContainer);

export default ComponentsContainer;
</script>
