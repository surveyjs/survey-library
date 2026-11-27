<template>
  <div :class="model.rootCss" ref="root">
    <div v-if="model.isMonthList" :class="model.cssClasses.listHeader">
      <div :class="model.cssClasses.weekDays">
        <div v-for="(name, nameIndex) in model.weekDays" :key="nameIndex" :class="model.cssClasses.weekDay">{{ name }}</div>
      </div>
    </div>
    <div v-if="model.showTopToolbar" :class="model.cssClasses.toolbar">
      <div v-if="model.showMonthTitles" :class="model.cssClasses.monthTitles">
        <div v-for="(month, index) in model.months" :key="index" :class="model.cssClasses.monthTitle">{{ month.title }}</div>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="model.topToolbar"></SvComponent>
    </div>
    <div v-if="model.isDayZoom" :class="model.cssClasses.months">
      <div v-for="month in model.months" :key="model.getMonthKey(month)" :class="model.cssClasses.monthView" :data-month="model.getMonthKey(month)">
        <div v-if="model.isMonthList" :class="model.cssClasses.monthTitle">{{ month.title }}</div>
        <div v-if="model.showMonthWeekDays" :class="model.cssClasses.weekDays">
          <div v-for="(name, nameIndex) in model.weekDays" :key="nameIndex" :class="model.cssClasses.weekDay">{{ name }}</div>
        </div>
        <div :class="model.cssClasses.table" @mouseleave="model.hoverItem(undefined)">
          <div v-for="(item, itemIndex) in month.days" :key="itemIndex" :class="model.cssClasses.dayCell">
            <CalendarItemCell :item="item" :calendar="model" />
          </div>
        </div>
      </div>
    </div>
    <div v-else :class="model.cssClasses.table" @mouseleave="model.hoverItem(undefined)">
      <CalendarItemCell v-for="(item, itemIndex) in model.items" :key="itemIndex" :item="item" :calendar="model" />
    </div>
    <div v-if="model.footerVisible" :class="model.cssClasses.footer">
      <SvComponent :is="'sv-action-bar'" :model="model.footerToolbar"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CalendarViewModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import CalendarItemCell from "./CalendarItem.vue";
import { useBase } from "../../base";
import { onMounted, onUnmounted, onUpdated, ref } from "vue";

const props = defineProps<{ model: CalendarViewModel }>();
const root = ref<HTMLElement>();
useBase(() => props.model);

const attachMonthList = (): void => props.model.attachMonthList(root.value as HTMLElement);
onMounted(attachMonthList);
onUpdated(attachMonthList);
onUnmounted(() => props.model.detachMonthList());
</script>
