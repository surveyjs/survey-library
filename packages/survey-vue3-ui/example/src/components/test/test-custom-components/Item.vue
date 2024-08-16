<template>
    <div class="my-list-item" style="display:flex;" :title="item.hint">
        <span>
            <SvComponent :name="'sv-svg-icon'" :iconName="item.iconName" :size="item.iconSize"></SvComponent>
        </span>
        <span :class="item.getActionBarItemTitleCss()">{{ item.title }}</span>
    </div>
</template>
<script lang="ts" setup>
import { SvComponent } from 'survey-vue3-ui';
defineProps<{ item: any }>()
</script>