<template>
  <div class="sv-header--mobile">
    <div v-if="model.survey.hasLogo" class="sv-header__logo">
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
    <div v-if="model.survey.hasTitle" class="sv-header__title" :style="{ 'maxWidth': model.renderedtextAreaWidth }">
      <survey-element-title :element="model.survey" :css="model.survey.css" />
    </div>
    <div v-if="model.survey.renderedHasDescription" class="sv-header__description" :style="{ 'maxWidth': model.renderedtextAreaWidth }">
      <div v-if="model.survey.renderedHasDescription" :class="model.survey.css.description">
        <survey-string :locString="model.survey.locDescription" />
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
export class HeaderMobileViewModel extends Vue {
  @Prop() model: Cover;
  constructor(props: any) {
    super(props);
  }
}

Vue.component("sv-header-mobile", HeaderMobileViewModel);
export default HeaderMobileViewModel;
</script>
