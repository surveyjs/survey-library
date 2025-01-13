<template>
    <div class="my-list-item" style="display:flex;" :title="item.hint">
        <span>
            <SvComponent :is="'sv-svg-icon'" :iconName="item.iconName" :size="item.iconSize"></SvComponent>
        </span>
        <span :class="item.getActionBarItemTitleCss()">{{ item.title }}</span>
    </div>
</template>
<script lang="ts" setup>
import { SvComponent } from 'survey-vue3-ui';
const props = defineProps<{ item: any }>();
// eslint-disable-next-line vue/no-mutating-props
props.item.iconName = "icon-defaultfile";
// eslint-disable-next-line vue/no-mutating-props
props.item.hint = props.item.title + " - Description";
</script>