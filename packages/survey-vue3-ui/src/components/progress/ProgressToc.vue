<template>
  <div :class="model.containerCss">
    <div v-if="model.isMobile" v-on:click="model.togglePopup" v-key2click>
      <SurveyVueComponent
        :name="'sv-svg-icon'"
        :iconName="model.icon"
        :size="24"
      ></SurveyVueComponent>
      <SurveyVueComponent
        :name="'sv-popup'"
        :model="model.popupModel"
      ></SurveyVueComponent>
    </div>
    <SurveyVueComponent
      :name="'sv-list'"
      v-else
      :model="model.listModel"
    ></SurveyVueComponent>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { type SurveyModel, TOCModel } from "survey-core";

defineProps<{ survey: SurveyModel; model: TOCModel }>();
</script>
