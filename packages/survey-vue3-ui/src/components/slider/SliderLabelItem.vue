<template>
    <div :class="question.getLabelCss(item.locText)"
    :style="{ left: question.getPercent(item.value) + '%' }" @pointerup="(e)=>{question.handleLabelPointerUp(e, item.value )}">
        <div :class="question.cssClasses.labelTick"></div>
        <div :class="question.cssClasses.labelTextContainer">
            <div :class="question.cssClasses.labelText" v-if="!item.showValue">
                <SvComponent
                :is="'survey-string'"
                :locString="item.locText"
                />
            </div>
            <div :class="question.cssClasses.labelText" v-if="item.showValue">
                {{item.value}}
            </div>
            <div :class="question.cssClasses.labelTextSecondaryMode" v-if="item.showValue">
                <SvComponent
                :is="'survey-string'"
                :locString="item.locText"
                />
            </div>
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
