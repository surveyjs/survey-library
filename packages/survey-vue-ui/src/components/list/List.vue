<template>
  <div v-bind:class="model.cssClasses.root" ref="listContainerElement">
    <div v-bind:class="model.cssClasses.filter" v-if="model.showFilter">
      <div v-bind:class="model.cssClasses.filterIcon">
        <sv-svg-icon :iconName="'icon-search'" :size="'auto'"> </sv-svg-icon>
      </div>
      <input
        type="text"
        v-bind:class="model.cssClasses.filterInput"
        :aria-label="model.filterStringPlaceholder"
        :placeholder="model.filterStringPlaceholder"
        :value="model.filterString"
        @change="change"
        @keyup="keyup"
      />
      <button
        v-if="model.showSearchClearButton && !!model.filterString"
        v-on:click="
          (event) => {
            model.onClickSearchClearButton(event);
          }
        "
        v-bind:class="model.cssClasses.searchClearButtonIcon"
      >
        <sv-svg-icon
          :iconName="'icon-searchclear'"
          :size="'auto'"
        ></sv-svg-icon>
      </button>
    </div>
    <div v-bind:class="model.cssClasses.emptyContainer" v-show="model.isEmpty">
      <div
        v-bind:class="model.cssClasses.emptyText"
        :aria-label="model.emptyMessage"
      >
        {{ model.emptyMessage }}
      </div>
    </div>
    <ul
      v-if="model.renderElements"
      v-bind:class="model.getListClass()"
      v-show="!model.isEmpty"
      role="listbox"
      :id="model.elementId"
      @mousedown="
        (event) => {
          event.preventDefault();
        }
      "
      @mousemove="mouseMove"
      v-on:keydown="
        (event) => {
          model.onKeyDown(event);
        }
      "
    >
      <sv-list-item
        v-for="item in model.renderedActions"
        :item="item"
        :model="model"
        :key="item.id"
      >
      </sv-list-item>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ListModel } from "survey-core";
import { onMounted, ref } from "vue";

const props = defineProps<{ model: ListModel }>();
const listContainerElement = ref<HTMLElement>(null as any);

const change = (event: any) => {
  const model = props.model;
  model.filterString = event.target.value;
};
const keyup = (event: any) => {
  const model = props.model;
  model.filterString = event.target.value;
  props.model.goToItems(event);
};
const mouseMove = (event: any) => {
  props.model.onMouseMove(event);
};

useBase(() => props.model);

onMounted(() => {
  props.model.initListContainerHtmlElement(listContainerElement.value);
});
</script>
