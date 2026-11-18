<template>
  <div v-if="!!getPopup() && item.data.isAdd" :class="getCss().listItem">
    <span :class="getCss().listItemText">{{ item.title }}</span>
  </div>
  <div v-else-if="!!getPopup()" :class="getCss().listItem">
    <span :class="getPopup().getItemCheckCss(item)" aria-hidden="true">
      <span :class="getCss().listItemCheckDecorator">
        <SvComponent :is="'sv-svg-icon'" :iconName="'icon-check-16x16'" :size="'auto'" :css="getCss().listItemCheckIcon"></SvComponent>
      </span>
    </span>
    <span :class="getCss().listItemText">{{ item.title }}</span>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
// An entry of a checkbox list of the Filter Control: drawn checked by the entry's active flag
// (FilterFieldPopup keeps it). A value the respondent typed has no remove button: a button inside
// a list option is nested interactive content, and unchecking the value is how it goes. The "Add"
// entry is its text alone.
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { type Action, type FilterFieldPopup, type ListModel } from "survey-core";
const props = defineProps<{ model: ListModel; item: Action }>();
useBase(() => props.item);
// Plain functions, not computed: the question builds its classes on first use, which a computed
// would take for a change of its own dependency.
const getPopup = (): FilterFieldPopup => !!props.item && !!props.item.data ? props.item.data.popup : undefined as any;
const getCss = (): any => getPopup().cssClasses;
</script>
