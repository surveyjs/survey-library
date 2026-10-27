<template>
    <div class="my-list-loading" data-state="loading">Custom loading</div>
</template>
<script lang="ts" setup>
import { useBase } from 'survey-vue3-ui';
import type { ListModel } from 'survey-core';
const props = defineProps<{ model: ListModel }>();
useBase(() => props.model);
</script>
