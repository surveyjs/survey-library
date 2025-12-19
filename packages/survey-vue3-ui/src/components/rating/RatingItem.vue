<template>
  <label
    :key="item.value"
    @mousedown="question.onMouseDown()"
    :class="item.className"
  >
    <input
      type="radio"
      class="sv-visuallyhidden"
      :name="question.questionName"
      :id="question.getInputId(index)"
      :value="item.value"
      :disabled="question.isDisabledAttr"
      :readonly="question.isReadOnlyAttr"
      @click="(e) => question.setValueFromClick((e.target as any).value)"
      :aria-label="question.ariaLabel"
    />
    <span :class="question.cssClasses.itemText" :data-text="item.text">
      <SvComponent :is="'survey-string'" :locString="item.locText" />
    </span>
  </label>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { IRatingItemProps } from "./rating";
import { useBase } from "@/base";

const props = defineProps<IRatingItemProps>();

useBase(() => props.item);
</script>
