<template>
  <div v-if="!!dialog()" :class="toCssClasses(css().modalContent, css().presetContent)">
    <div v-if="!!edit() && edit().tabsToolbar.hasActions" :class="css().presetTabs">
      <SvComponent :is="'sv-action-bar'" :model="edit().tabsToolbar"></SvComponent>
    </div>
    <FilterEditorPage v-if="!!dialog().form" :key="dialog().form.uniqueId" :survey="dialog().form" :disposed="dialog().isDisposed"
      :className="toCssClasses(css().editor, css().presetForm)"></FilterEditorPage>
    <div v-if="!!dialog().editor" :class="css().presetFields">
      <FilterEditorPage :key="dialog().editor.survey.uniqueId" :survey="dialog().editor.survey" :disposed="dialog().editor.isDisposed"
        :className="toCssClasses(css().editor, css().modalEditor)"></FilterEditorPage>
    </div>
    <FilterAIPrompt v-if="!!edit() && !!edit().aiPrompt" :key="edit().aiPrompt.form.uniqueId" :prompt="edit().aiPrompt" :css="css()"></FilterAIPrompt>
    <div v-if="!!edit() && edit().actionsToolbar.hasVisibleActions" :class="css().modalSection">
      <div :class="css().modalSectionTitle">{{ filterUIStrings.presetActions }}</div>
      <SvComponent :is="'sv-action-bar'" :model="edit().actionsToolbar"></SvComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
// Add New Preset and Edit Presets: the tabs (Edit Presets only), the form, the fields' editors in a
// frame, the description of an AI preset and the preset's actions (Edit Presets only); the footer is
// the dialog's own. A form or editors made anew (another tab, another set of fields) are drawn anew,
// keyed by their survey's uniqueId: element ids restart in every survey.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import FilterAIPrompt from "./FilterAIPrompt.vue";
import { useBase } from "@/base";
import { type FilterEditorHolder, type FilterPresetDialog, FilterEditPresetsDialog, filterUIStrings, toCssClasses } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// Plain functions, not computed: whether the dialog is disposed is not reactive.
const dialog = (): FilterPresetDialog => {
  const holder = props.holder;
  return !!holder && !!holder.presetDialog && !holder.presetDialog.isDisposed ? holder.presetDialog : undefined as any;
};
const edit = (): FilterEditPresetsDialog => dialog() instanceof FilterEditPresetsDialog ? dialog() as FilterEditPresetsDialog : undefined as any;
const css = (): any => props.holder.cssClasses;
useBase(() => props.holder);
useBase(() => dialog());
useBase(() => edit()?.tabsToolbar);
useBase(() => edit()?.actionsToolbar);
</script>
