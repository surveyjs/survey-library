<template>
  <div v-if="components.length > 0" class="sv-components-column">
    <template v-for="component in components">
      <component
        :is="component.component"
        :key="component.index"
        :survey="survey"
        :container="container"
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
  get components(): Array<any> {
    return this.survey.getContainerContent(this.container as any);
  }
}

Vue.component("sv-components-container", ComponentsContainer);

export default ComponentsContainer;
</script>
