<template>
  <label
    :key="item.value"
    @mousedown="question.onMouseDown()"
    :style="question.getItemStyle(item.itemValue, item.highlight)"
    :class="question.getItemClass(item.itemValue, item.highlight)"
    @mouseover="(e) => question.onItemMouseIn(item)"
    @mouseleave="(e) => question.onItemMouseOut(item)"
    :title="item.text"
  >
    <input
      type="radio"
      class="sv-visuallyhidden"
      :name="question.questionName"
      :id="question.getInputId(index)"
      :value="item.value"
      :disabled="question.isDisabledAttr"
      :readonly="question.isReadOnlyAttr"
      @click="(e) => question.setValueFromClick(((e.target as any).value))"
      :aria-label="question.ariaLabel"
    />
    <SvComponent
      :is="'sv-svg-icon'"
      :iconName="question.getItemSmileyIconName(item.itemValue)"
      :size="'auto'"
    ></SvComponent>
  </label>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { IRatingItemProps } from "./rating";
import { useBase } from "@/base";

const props = defineProps<IRatingItemProps>();

useBase(() => props.item);
</script>
