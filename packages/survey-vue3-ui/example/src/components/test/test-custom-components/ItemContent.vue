<template>
    <div class="sv-ranking-item__text" :style="{display: 'flex', alignItems: 'center', gap: '8px'}">
        <SvComponent :is="'sv-svg-icon'" iconName="icon-next_16x16" size = "16"/>
        <SvComponent :is="'survey-string'" :locString="item.locText" />
    </div>
</template>
<script lang="ts" setup>
import { SvComponent } from 'survey-vue3-ui';
import type { ItemValue } from 'survey-core';
defineProps<{ item: ItemValue, cssClasses: any }>()
</script>