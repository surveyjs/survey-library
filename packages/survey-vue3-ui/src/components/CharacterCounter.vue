<template>
  <div :class="remainingCharacterCounter">
    {{ counter.remainingCharacterCounter }}
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { CharacterCounter } from "survey-core";

const props = defineProps<{
  counter: CharacterCounter;
  remainingCharacterCounter?: String;
}>();
useBase(() => props.counter);
</script>
