<template>
    <div class="sv-ranking-item__text" :style="{display: 'flex', alignItems: 'center', gap: '8px'}">
        <sv-svg-icon iconName="icon-next_16x16" size = "16"></sv-svg-icon>
        <survey-string :locString="text" />
    </div>
</template>
<script lang="ts" setup>
defineProps<{ text: any, cssClasses: any }>()
</script>