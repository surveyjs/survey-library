<template>
  <span
    class="sv-popup__pointer"
    v-bind:style="{
      left: model.pointerTarget.left,
      top: model.pointerTarget.top,
    }"
  ></span>
</template>
<script lang="ts" setup>
import type { PopupDropdownViewModel } from "survey-core";

defineProps<{
  model: PopupDropdownViewModel;
}>();
</script>
