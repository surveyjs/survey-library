<template>
  <span
    class="sv-popup__pointer"
    v-bind:style="{
      left: model.pointerTarget.left,
      top: model.pointerTarget.top,
    }"
  ></span>
</template>
<script lang="ts">
import { PopupDropdownViewModel } from 'survey-core';
import { defineComponent } from 'vue';

export default defineComponent({
  name: "popup-pointer",
  props: {
    model: PopupDropdownViewModel,
  },
});
</script>
