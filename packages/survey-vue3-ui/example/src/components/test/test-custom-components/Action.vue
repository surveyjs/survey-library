<template>
<span class="my-custom-action-class" @click="item.action">{{ item.title }}</span>
</template>
<script lang="ts" setup>
import type { Action } from 'survey-core';
defineProps<{ item: Action }>();
</script>