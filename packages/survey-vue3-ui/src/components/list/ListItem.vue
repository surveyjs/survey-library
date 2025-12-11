<template>
  <li
    :role="model.listItemRole"
    :aria-selected="model.getA11yItemAriaSelected(item)"
    :aria-checked="model.getA11yItemAriaChecked(item)"
    v-show="model.isItemVisible(item)"
    :key="item.id"
    :id="elementId"
    ref="elementRef"
    @pointerdown="model.onPointerDown($event, item)"
    @pointerup="click"
    v-bind:class="model.getItemClass(item)"
    v-bind:tabindex="item.disableTabStop ? -1 : 0"
    v-key2click="{ processEsc: false, disableTabStop: item.disableTabStop }"
  >
    <div
      v-if="item.needSeparator"
      v-bind:class="model.cssClasses.itemSeparator"
    ></div>

    <div
      :style="model.getItemStyle(item)"
      v-bind:class="model.cssClasses.itemBody"
      :title="item.getTooltip()"
      @mouseover="(e) => model.onItemHover(item)"
      @mouseleave="(e) => model.onItemLeave(item)"
    >
      <SvComponent
        :is="itemComponent"
        :item="item"
        :model="model"
      ></SvComponent>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { key2ClickDirective as vKey2click } from "@/directives/key2click";
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { ListModel, Action, IAction } from "survey-core";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{ model: ListModel; item: Action }>();
const elementRef = ref<HTMLElement>(null as any);

const elementId = computed(() => (props.item as IAction).elementId);
const click = (event: any) => {
  props.model.onItemClick(props.item as any);
  event.stopPropagation();
};

useBase(() => props.item);

const itemComponent = computed(
  () => props.item.component || props.model.itemComponent
);

onMounted(() => {
  setTimeout(() => {
    props.model.onItemRended(props.item as any, elementRef.value);
  });
});
</script>
