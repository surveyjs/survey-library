<template>
  <div :class="model.containerCss">
    <div v-if="model.isMobile" v-on:click="model.togglePopup" v-key2click>
      <SvComponent
        :is="'sv-svg-icon'"
        :iconName="model.icon"
        :size="24"
      ></SvComponent>
      <SvComponent :is="'sv-popup'" :model="model.popupModel"></SvComponent>
    </div>
    <SvComponent :is="'sv-list'" v-else :model="model.listModel"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import { key2ClickDirective as vKey2click } from "@/directives/key2click";
import SvComponent from "@/SvComponent.vue";
import { type SurveyModel, TOCModel } from "survey-core";

defineProps<{ survey: SurveyModel; model: TOCModel }>();
</script>
