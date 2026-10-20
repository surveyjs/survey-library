<template>
  <div
    v-if="question.getKeyboardHints().length"
    class="sd-question__keyboard-hints"
    aria-hidden="true"
  >
    <span
      v-for="(hint, hintIndex) in question.getKeyboardHints()"
      :key="hintIndex"
      class="sd-question__keyboard-hint"
    >
      <template v-for="(key, keyIndex) in hint.keys" :key="keyIndex">
        <span
          v-if="keyIndex > 0"
          class="sd-question__keyboard-hint-or"
        >{{ question.getLocalizationString("keyboardHintOrText") }}</span>
        <span class="sd-item__shortcut-key">{{ key.label }}</span>
      </template>
      <span class="sd-question__keyboard-hint-text">{{ hint.text }}</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";
import { useBase } from "@/base";

const props = defineProps<{ question: Question }>();
useBase(() => props.question);
</script>
