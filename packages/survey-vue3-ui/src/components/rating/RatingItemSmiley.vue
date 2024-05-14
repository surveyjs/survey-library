<template>
  <label
    :key="item.value"
    @mousedown="question.onMouseDown()"
    :style="question.getItemStyle(item.itemValue, item.highlight)"
    :class="question.getItemClass(item.itemValue, item.highlight)"
    @mouseover="(e) => question.onItemMouseIn(item)"
    @mouseleave="(e) => question.onItemMouseOut(item)"
  >
    <input
      type="radio"
      class="sv-visuallyhidden"
      :name="question.questionName"
      :id="question.getInputId(index)"
      :value="item.value"
      :disabled="question.isInputReadOnly"
      @click="(e) => question.setValueFromClick(((e.target as any).value))"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage"
    />
    <sv-svg-icon
      :iconName="question.getItemSmileyIconName(item.itemValue)"
      :size="'auto'"
      :title="item.text"
    ></sv-svg-icon>
  </label>
</template>

<script lang="ts" setup>
import type { IRatingItemProps } from "./rating";
import { useBase } from "@/base";

const props = defineProps<IRatingItemProps>();

useBase(() => props.item);
</script>
