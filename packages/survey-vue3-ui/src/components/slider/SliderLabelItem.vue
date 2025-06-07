<template>
    <div :class="question.getLabelCss(item.locText)"
    :style="{ left: question.getPercent(item.value) + '%' }" @pointerup="(e)=>{question.handleLabelPointerUp(e, item.value )}">
        <div :class="question.cssClasses.labelTick"></div>
        <div :class="question.cssClasses.labelText">
            <SvComponent
            :is="'survey-string'"
            :locString="item.locText"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ISliderItemProps } from "./slider";
import { useBase } from "@/base";

const props = defineProps<ISliderItemProps>();

useBase(() => props.item);
</script>
