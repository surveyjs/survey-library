<template>
  <div v-if="!!modal()" :class="modal().cssClasses.modalContent">
    <div v-if="modal().showSearch" :class="modal().cssClasses.modalSection">
      <div :class="modal().searchCss.root">
        <SvComponent :is="'sv-svg-icon'" :className="modal().cssClasses.searchIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
        <input type="text" :class="modal().searchCss.control" :value="modal().searchString" :placeholder="modal().searchPlaceholder"
          :aria-label="filterUIStrings.searchLabel" :disabled="modal().isSearchDisabled" @input="onSearchInput" />
      </div>
    </div>
    <div v-if="modal().creationToolbar.hasVisibleActions" :class="modal().cssClasses.modalSection">
      <SvComponent :is="'sv-action-bar'" :model="modal().creationToolbar"></SvComponent>
    </div>
    <div v-if="modal().presetsToolbar.hasActions" :class="modal().cssClasses.modalSection" role="group" :aria-labelledby="modal().presetsTitleId">
      <div :class="modal().cssClasses.modalSectionHeader">
        <div :class="modal().cssClasses.modalSectionTitle" :id="modal().presetsTitleId">{{ filterUIStrings.presetsTitle }}</div>
        <SvComponent :is="'sv-action-bar'" :model="modal().presetsTitleToolbar"></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="modal().presetsToolbar"></SvComponent>
    </div>
    <FilterEditorPage v-if="!!modal().editor" :survey="modal().editor.survey" :disposed="modal().editor.isDisposed"
      :className="modal().editorCss"></FilterEditorPage>
  </div>
</template>
<script lang="ts" setup>
// The Filters dialog's content: the search box, Add Preset, the presets and the fields; its footer is
// the dialog's own. It watches the holder, so an emptied holder unmounts the content before
// survey-core disposes the dialog's model.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import { type FilterEditorHolder, type FilterModal, filterUIStrings } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// A plain function, not computed: the holder, which useBase watches, empties a slot before it disposes what it held, so this never returns a disposed dialog.
const modal = (): FilterModal => {
  const holder = props.holder;
  return holder ? holder.modal : undefined as any;
};
useBase(() => props.holder);
useBase(() => modal());
useBase(() => modal()?.creationToolbar);
useBase(() => modal()?.presetsToolbar);
useBase(() => modal()?.presetsTitleToolbar);
const onSearchInput = (event: any) => {
  const model = modal();
  model.searchString = event.target.value;
};
</script>
