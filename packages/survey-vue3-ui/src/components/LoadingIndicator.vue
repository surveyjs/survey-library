<template>
  <div class="sd-loading-indicator">
    <SvComponent
      :name="'sv-svg-icon'"
      :iconName="'icon-loading'"
      size="'auto'"
    ></SvComponent>
  </div>
</template>
<script setup lang="ts">
import SvComponent from "@/SvComponent.vue";
</script>
