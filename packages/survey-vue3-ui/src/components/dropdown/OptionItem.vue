<template>
  <option :value="item.value" :disabled="!item.isEnabled">
    {{ text }}
  </option>
</template>
<script lang="ts" setup>
import type { ItemValue } from "survey-core";
import { useBase, useLocString } from "../../base";

const props = defineProps<{ item: ItemValue }>();
const text = useLocString(() => props.item.locText);
useBase(() => props.item);
</script>
