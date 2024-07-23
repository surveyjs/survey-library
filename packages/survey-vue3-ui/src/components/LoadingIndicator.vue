<template>
  <div class="sd-loading-indicator">
    <SurveyVueComponent
      :name="'sv-svg-icon'"
      :iconName="'icon-loading'"
      size="'auto'"
    ></SurveyVueComponent>
  </div>
</template>
<script setup lang="ts">
import SurveyVueComponent from "@/SurveyVueComponent.vue";
</script>
