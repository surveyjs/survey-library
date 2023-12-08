<template>
  <div :class="model.css" :style="model.style">
    <div class="sv-header__cell-content" :style="model.contentStyle">
      <div v-if="model.showLogo" class="sv-header__logo">
      <div :class="model.survey.logoClassNames">
        <img
          :class="model.survey.css.logoImage"
          :src="model.survey.locLogo.renderedHtml"
          :width="model.survey.renderedLogoWidth"
          :height="model.survey.renderedLogoHeight"
          :alt="model.survey.locTitle.renderedHtml"
          :style="{ 'objectFit': model.survey.logoFit, 'width': model.survey.renderedStyleLogoWidth, 'height': model.survey.renderedStyleLogoHeight }"
        />
      </div>
      </div>
      <div v-if="model.showTitle" class="sv-header__title" :style="{ 'maxWidth': model.textAreaWidth }">
        <survey-element-title :element="model.survey" :css="model.survey.css" />
      </div>
      <div v-if="model.showDescription" class="sv-header__description" :style="{ 'maxWidth': model.textAreaWidth }">
        <div v-if="model.survey.renderedHasDescription" :class="model.survey.css.description">
          <survey-string :locString="model.survey.locDescription" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Base, SurveyModel, Cover, CoverCell } from "survey-core";
import BaseVue from "../../base";

@Component
export class HeaderCellViewModel extends Vue {
  @Prop() model: CoverCell;
  constructor(props: any) {
    super(props);
  }
}

Vue.component("sv-header-cell", HeaderCellViewModel);
export default HeaderCellViewModel;
</script>
