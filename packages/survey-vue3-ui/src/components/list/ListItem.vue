<template>
  <li
    role="option"
    :aria-selected="model.isItemSelected(item)"
    v-show="model.isItemVisible(item)"
    :key="item.id"
    :id="elementId"
    @pointerdown="model.onPointerDown($event, item)"
    v-bind:class="model.getItemClass(item)"
    v-on:click="click"
    v-bind:tabindex="item.disableTabStop ? -1 : 0"
    v-key2click="{ processEsc: false, disableTabStop: item.disableTabStop }"
  >
    <div
      v-if="item.needSeparator"
      v-bind:class="model.cssClasses.itemSeparator"
    ></div>

    <div
      :style="{ paddingInlineStart: model.getItemIndent(item) }"
      v-bind:class="model.cssClasses.itemBody"
      :title="item.locTitle.calculatedText"
      @mouseover="(e) => model.onItemHover(item)"
      @mouseleave="(e) => model.onItemLeave(item)"
    >
      <component :is="item.component || 'sv-list-item-content'" :item="item" :model="model">
      </component>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ListModel, Action, IAction } from "survey-core";
import { computed, onMounted } from "vue";

const props = defineProps<{ model: ListModel; item: Action }>();

const elementId = computed(() => (props.item as IAction).elementId);
const click = (event: any) => {
  props.model.onItemClick(props.item as any);
  event.stopPropagation();
};

useBase(() => props.item);

onMounted(() => {
  setTimeout(() => {
    props.model.onLastItemRended(props.item as any);
  });
});
</script>
