<template>
    <div :class="question.rootCss" ref="root">
        <input name="range-input" ref="rangeInputRef" :class="question.cssClasses.input" type="range" :min="question.min" 
        :max="question.max" :step="question.step" tabIndex="-1" 
        @change="(e)=>{question.handleRangeOnChange(e as InputEvent)}"
        @pointerdown="(e)=>{question.handleRangePointerDown(e as PointerEvent)}"
        @pointerup="(e)=>{question.handleRangePointerUp(e as PointerEvent, root as HTMLElement)}" />
    </div>
</template>

<script lang="ts" setup>
import type { QuestionSliderModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionSliderModel }>();
const root = ref<HTMLElement | null>(null);
useQuestion<QuestionSliderModel>(props, root);
</script>