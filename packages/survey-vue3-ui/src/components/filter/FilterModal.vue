<template>
  <div v-if="!!modal()" :class="modal().cssClasses.modalContent">
    <div :class="modal().cssClasses.modalSection">
      <div :class="modal().searchCss.root">
        <SvComponent :is="'sv-svg-icon'" :className="modal().cssClasses.searchIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
        <input type="text" autocomplete="off" :class="modal().searchCss.control" :value="modal().filterText" :placeholder="modal().searchPlaceholder"
          :aria-label="modal().searchPlaceholder" @input="onSearchInput" />
        <SvComponent v-if="modal().showSearchClear" :is="'sv-action-bar-item'" :item="modal().searchClearAction"></SvComponent>
      </div>
    </div>
    <div v-if="modal().presetsToolbar.hasVisibleActions" :class="modal().cssClasses.modalSection" role="group" :aria-labelledby="modal().presetsTitleId">
      <div :class="modal().cssClasses.modalSectionHeader">
        <div :class="modal().cssClasses.modalSectionTitle" :id="modal().presetsTitleId">{{ modal().presetsTitle }}</div>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="modal().presetsToolbar"></SvComponent>
    </div>
    <div v-if="modal().showExpression" :class="[modal().cssClasses.modalSection, modal().cssClasses.modalExpression]">
      <div :class="modal().cssClasses.modalSectionTitle">{{ modal().expressionTitle }}</div>
      <div :class="modal().cssClasses.modalExpressionText">{{ modal().presetExpression }}</div>
      <SvComponent :is="'sv-action-bar'" :model="modal().expressionToolbar"></SvComponent>
    </div>
    <div v-if="modal().isNothingFound" :class="modal().cssClasses.modalNothingFound">
      <SvComponent :is="'sv-svg-icon'" :className="modal().cssClasses.modalNothingFoundIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
      <div>{{ modal().nothingFoundText }}</div>
    </div>
    <FilterEditorPage v-if="!!modal().editor" :survey="modal().editor.survey" :disposed="modal().editor.isDisposed"
      :className="modal().editorCss"></FilterEditorPage>
  </div>
</template>
<script lang="ts" setup>
// The Filters dialog's content: Search in Filters, the presets with Add New and Edit Selected, the text
// of a preset that does not decompose with Edit..., "nothing found" and the fields; its footer is the
// dialog's own. It watches the holder, so an emptied holder unmounts the content before survey-core
// disposes the dialog's model.
import SvComponent from "@/SvComponent.vue";
import FilterEditorPage from "./FilterEditorPage.vue";
import { useBase } from "@/base";
import { type FilterEditorHolder, type FilterModal } from "survey-core";
const props = defineProps<{ holder: FilterEditorHolder }>();
// A plain function, not computed: the holder, which useBase watches, empties a slot before it disposes what it held, so this never returns a disposed dialog.
const modal = (): FilterModal => {
  const holder = props.holder;
  return holder ? holder.modal : undefined as any;
};
useBase(() => props.holder);
useBase(() => modal());
useBase(() => modal()?.presetsToolbar);
useBase(() => modal()?.expressionToolbar);
const onSearchInput = (event: any) => {
  const model = modal();
  model.filterText = event.target.value;
};
</script>
