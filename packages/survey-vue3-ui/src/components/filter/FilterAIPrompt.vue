<template>
  <div v-if="!!prompt && !prompt.isDisposed" :class="css.aiPrompt">
    <div :class="css.aiPromptTitle">{{ prompt.promptTitle }}</div>
    <FilterEditorPage :key="prompt.form.uniqueId" :survey="prompt.form" :disposed="prompt.isDisposed"
      :className="toCssClasses(css.editor, css.aiPromptForm)"></FilterEditorPage>
    <div :class="css.aiPromptRequest">
      <SvComponent :is="'sv-action-bar'" :model="prompt.requestToolbar"></SvComponent>
    </div>
    <div v-if="!!prompt.errorText" :class="css.aiPromptError" role="alert">{{ prompt.errorText }}</div>
  </div>
</template>
<script lang="ts" setup>
// The description of a filter, its request button - Create new filter, then Make Changes - and what
// went wrong: Create custom filter's, and the tab of an AI preset in Edit Presets.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import { type FilterAIPrompt, toCssClasses } from "survey-core";
const props = defineProps<{ prompt: FilterAIPrompt; css: any }>();
const getPrompt = (): FilterAIPrompt => !!props.prompt && !props.prompt.isDisposed ? props.prompt : undefined as any;
useBase(() => getPrompt());
useBase(() => getPrompt()?.requestToolbar);
</script>
