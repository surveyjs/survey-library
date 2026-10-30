<template>
  <div
    v-if="keyboardHintModel.hasItems()"
    :class="keyboardHintModel.cssClasses.keyboardHintContainer"
    aria-hidden="true"
  >
    <span
      v-for="(hint, hintIndex) in keyboardHintModel.items"
      :key="hintIndex"
      :class="keyboardHintModel.cssClasses.keyboardHintItem"
    >
      <span
        v-for="(part, partIndex) in hint.parts"
        :key="partIndex"
        :class="part.className"
      >{{ part.text }}</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";
import { useBase } from "@/base";
import { computed } from "vue";

const props = defineProps<{ question: Question }>();
useBase(() => props.question);
const keyboardHintModel = computed(() => props.question.getKeyboardHintModel());
</script>
