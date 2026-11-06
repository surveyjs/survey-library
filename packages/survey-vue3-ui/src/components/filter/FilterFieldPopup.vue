<template>
  <div v-if="!!popup()" :class="popup().cssClasses.popup">
    <div v-if="!!popup().list && popup().showSearch" :class="popup().cssClasses.popupSearch">
      <SvComponent :is="'sv-svg-icon'" :className="popup().cssClasses.popupSearchIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
      <input type="text" :class="popup().cssClasses.popupSearchInput" :value="popup().list.filterString || ''"
        :placeholder="popup().list.filterStringPlaceholder" :aria-label="popup().list.filterStringPlaceholder"
        @input="onSearchInput" @keydown="(e) => popup().onSearchKeyDown(e)" />
    </div>
    <div :class="popup().cssClasses.popupHeader">
      <div :class="popup().cssClasses.popupTitle">{{ popup().title }}</div>
      <SvComponent :is="'sv-action-bar'" :model="popup().headerToolbar"></SvComponent>
    </div>
    <div :class="popup().cssClasses.popupBody">
      <SvComponent v-if="!!popup().list" :is="'sv-list'" :model="popup().list"></SvComponent>
      <FilterEditorPage v-else-if="!!popup().editor" :survey="popup().editor.survey" :disposed="popup().editor.isDisposed"
        :className="popup().cssClasses.editor"></FilterEditorPage>
    </div>
    <div v-if="popup().footerToolbar.hasActions" :class="popup().cssClasses.popupFooter">
      <SvComponent :is="'sv-action-bar'" :model="popup().footerToolbar"></SvComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
// A badge's popup of the Filter Control: the search box (a long list, or one a value can be typed
// into), the title row with its link, the list or the operator and value, and Apply.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import type { FilterEditorHolder, FilterFieldPopup } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// A plain function, not computed: whether the popup is disposed is not reactive.
const popup = (): FilterFieldPopup => {
  const holder = props.holder;
  return !!holder && !!holder.fieldPopup && !holder.fieldPopup.isDisposed ? holder.fieldPopup : undefined as any;
};
useBase(() => props.holder);
useBase(() => popup()?.headerToolbar);
useBase(() => popup()?.footerToolbar);
useBase(() => popup()?.list as any);
const onSearchInput = (event: any) => {
  const list = popup().list;
  list.filterString = event.target.value;
};
</script>
