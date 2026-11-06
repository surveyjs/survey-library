<template>
  <div v-if="!!dialog()" :class="toCssClasses(css().modalContent, css().aiContent)">
    <FilterEditorPage v-if="!!dialog().editor" :key="dialog().editor.survey.uniqueId" :survey="dialog().editor.survey"
      :disposed="dialog().editor.isDisposed" :className="toCssClasses(css().editor, css().modalEditor)"></FilterEditorPage>
    <FilterAIPrompt :prompt="dialog().aiPrompt" :css="css()"></FilterAIPrompt>
  </div>
</template>
<script lang="ts" setup>
// Create custom filter: the model's filter as the fields' editors, over the description and its
// button; the footer is the dialog's own. It watches the holder, as the other dialogs do, and the
// dialog: its editors are made anew for every answer.
import FilterEditorPage from "./FilterEditorPage.vue";
import FilterAIPrompt from "./FilterAIPrompt.vue";
import { useBase } from "@/base";
import { type FilterAIDialog, type FilterEditorHolder, toCssClasses } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// A plain function, not computed: whether the dialog is disposed is not reactive.
const dialog = (): FilterAIDialog => {
  const holder = props.holder;
  return !!holder && !!holder.aiDialog && !holder.aiDialog.isDisposed ? holder.aiDialog : undefined as any;
};
const css = (): any => props.holder.cssClasses;
useBase(() => props.holder);
useBase(() => dialog());
</script>
