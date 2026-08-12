<template>
  <div :class="data.remainingCharacterCounter">
    {{ data.counter?.remainingCharacterCounter }}
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { CharacterCounter, ICharacterCounterAction } from "survey-core";
import { computed } from "vue";
const props = defineProps<{
  item?: ICharacterCounterAction,
  counter?: CharacterCounter;
  remainingCharacterCounter?: string;
}>();
const data = computed(() => {
  if(props.item) {
    return props.item.data;
  } else {
    return {
      counter: props.counter,
      remainingCharacterCounter: props.remainingCharacterCounter
    }
  }
})
useBase(() => data.value.counter as CharacterCounter);
</script>
