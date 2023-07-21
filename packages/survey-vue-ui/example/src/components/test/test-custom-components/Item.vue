<template>
    <div class="my-list-item" style="display:flex;" :title="item.hint">
        <span>
            <sv-svg-icon :iconName="item.iconName" :size="item.iconSize"></sv-svg-icon>
        </span>
        <span :class="item.getActionBarItemTitleCss()">{{ item.title }}</span>
    </div>
</template>
<script lang="ts" setup>
defineProps<{ item: any }>()
</script>