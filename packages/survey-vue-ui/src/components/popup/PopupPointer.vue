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
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: "popup-pointer",
  props: {
    model: Object as PropType<PopupDropdownViewModel>,
  },
});
</script>
