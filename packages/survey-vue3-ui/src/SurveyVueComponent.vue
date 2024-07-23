<template>
  <component :is="registeredComponent" v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="scope">
      <slot :name v-bind="scope" />
    </template>
  </component>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { VueComponentFactory } from "./component-factory";

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  name: string;
}>();

const registeredComponent = computed(() =>
  VueComponentFactory.Instance.getComponent(props.name)
);
</script>
