<template>
  <div v-if="!!popup()" :class="popup().cssClasses.popup">
    <div :class="popup().cssClasses.popupBody">
      <FilterEditorPage :survey="popup().survey" :disposed="popup().isDisposed" :className="popup().cssClasses.editor"></FilterEditorPage>
    </div>
    <div :class="popup().cssClasses.popupFooter">
      <SvComponent :is="'sv-action-bar'" :model="popup().footerToolbar"></SvComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
// "Save as..."'s popup of the Filter Control: the new preset's name and Save.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import type { FilterEditorHolder, FilterSaveAsPopup } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// A plain function, not computed: the holder, which useBase watches, empties a slot before it disposes what it held, so this never returns a disposed popup.
const popup = (): FilterSaveAsPopup => {
  const holder = props.holder;
  return holder ? holder.saveAsPopup : undefined as any;
};
useBase(() => props.holder);
useBase(() => popup()?.footerToolbar);
</script>
