<template>
  <div v-if="!!dialog()" :class="dialog().contentCss">
    <div v-if="!!edit() && edit().tabsToolbar.hasActions" :class="css().presetTabs">
      <SvComponent :is="'sv-action-bar'" :model="edit().tabsToolbar"></SvComponent>
    </div>
    <FilterEditorPage v-if="!!dialog().form" :key="dialog().form.uniqueId" :survey="dialog().form" :disposed="dialog().isDisposed"
      :className="dialog().formCss"></FilterEditorPage>
    <FilterEditorPage v-if="hasFields()" :survey="dialog().survey" :disposed="dialog().isDisposed"
      :className="dialog().editorCss"></FilterEditorPage>
    <div v-if="!!edit() && edit().actionsToolbar.hasVisibleActions" :class="css().modalSection" role="group" :aria-labelledby="edit().actionsTitleId">
      <div :class="css().modalSectionTitle" :id="edit().actionsTitleId">{{ filterUIStrings.presetActions }}</div>
      <SvComponent :is="'sv-action-bar'" :model="edit().actionsToolbar"></SvComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
// Add New Preset and Edit Presets: the tabs (Edit Presets only), the form, the dialog's survey - the
// fields' editors in a frame and, for an AI preset's tab, the description and Make Changes - and the
// preset's actions (Edit Presets only); the footer is the dialog's own. A form made anew (another tab)
// is drawn anew, keyed by its survey's uniqueId: element ids restart in every survey. The dialog's
// survey lives as long as the dialog, and its ids keep counting: it needs no key.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import { type FilterEditorHolder, type FilterPresetDialog, FilterEditPresetsDialog, filterUIStrings } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// Plain functions, not computed: the holder, which useBase watches, empties a slot before it disposes what it held, so this never returns a disposed dialog.
const dialog = (): FilterPresetDialog => {
  const holder = props.holder;
  return holder ? holder.presetDialog : undefined as any;
};
const edit = (): FilterEditPresetsDialog => dialog() instanceof FilterEditPresetsDialog ? dialog() as FilterEditPresetsDialog : undefined as any;
const css = (): any => dialog().cssClasses;
// The page is empty with no field picked and no description (see hasSurveyContent).
const hasFields = (): boolean => dialog().hasSurveyContent;
useBase(() => props.holder);
useBase(() => dialog());
useBase(() => edit()?.tabsToolbar);
useBase(() => edit()?.actionsToolbar);
</script>
