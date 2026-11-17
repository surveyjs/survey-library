<template>
  <div v-if="!!dialog()" :class="dialog().contentCss">
    <FilterEditorPage v-if="!!dialog().form" :key="dialog().form.uniqueId" :survey="dialog().form" :disposed="dialog().isDisposed"
      :className="dialog().formCss"></FilterEditorPage>
    <FilterEditorPage v-if="hasFields()" :survey="dialog().survey" :disposed="dialog().isDisposed"
      :className="dialog().editorCss"></FilterEditorPage>
  </div>
</template>
<script lang="ts" setup>
// New Preset and Edit Preset: the form - the name and the tagbox of Contains, or the text - and the
// dialog's survey - the fields' editors in a frame and the AI description with its Create or Edit; the
// footer is the dialog's own. A form made anew (Edit as Expression, an AI answer) is drawn anew, keyed
// by its survey's uniqueId: element ids restart in every survey. The dialog's survey lives as long as
// the dialog, and its ids keep counting: it needs no key.
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import { type FilterEditorHolder, type FilterPresetDialog } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// Plain functions, not computed: the holder, which useBase watches, empties a slot before it disposes what it held, so this never returns a disposed dialog.
const dialog = (): FilterPresetDialog => {
  const holder = props.holder;
  return holder ? holder.presetDialog : undefined as any;
};
// The page is empty with no field picked and no description (see hasSurveyContent).
const hasFields = (): boolean => dialog().hasSurveyContent;
useBase(() => props.holder);
useBase(() => dialog());
</script>
