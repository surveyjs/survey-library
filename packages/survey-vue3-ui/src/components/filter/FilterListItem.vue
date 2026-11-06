<template>
  <div v-if="!!getPopup() && item.data.isAdd" :class="getCss().listItem">
    <span :class="getCss().listItemText">{{ item.title }}</span>
  </div>
  <div v-else-if="!!getPopup()" :class="getCss().listItem">
    <span :class="getCheckCss()" aria-hidden="true">
      <span :class="getCss().listItemCheckDecorator">
        <SvComponent :is="'sv-svg-icon'" :iconName="'icon-check-16x16'" :size="'auto'" :css="getCss().listItemCheckIcon"></SvComponent>
      </span>
    </span>
    <span :class="getCss().listItemText">{{ item.title }}</span>
    <button v-if="item.data.isCustom && !getPopup().isReadOnly" type="button" :class="getCss().listItemRemove"
      :title="filterUIStrings.removeValue" :aria-label="filterUIStrings.removeValue"
      @click.stop="getPopup().removeCustomItem(item)">
      <SvComponent :is="'sv-svg-icon'" :iconName="'icon-delete-16x16'" :size="'auto'"></SvComponent>
    </button>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
// An entry of a checkbox list of the Filter Control: drawn checked by the entry's active flag
// (FilterFieldPopup keeps it), with a remove button for a value the respondent typed. The "Add"
// entry is its text alone.
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { type Action, type FilterFieldPopup, type ListModel, filterUIStrings, toCssClasses } from "survey-core";
const props = defineProps<{ model: ListModel; item: Action }>();
useBase(() => props.item);
// Plain functions, not computed: the question builds its classes on first use, which a computed
// would take for a change of its own dependency.
const getPopup = (): FilterFieldPopup => !!props.item && !!props.item.data ? props.item.data.popup : undefined as any;
const getCss = (): any => getPopup().cssClasses;
// The checkbox question's checkbox: its classes, so it is drawn the way the question draws one. The
// check is always there, transparent while the entry is not checked - as in the question.
const getCheckCss = (): string => toCssClasses(getCss().listItemCheck, !!props.item.active && getCss().listItemCheckChecked,
  getPopup().isReadOnly && getCss().listItemCheckReadOnly);
</script>
