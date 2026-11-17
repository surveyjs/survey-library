<template>
  <div :class="model.rootCss">
    <div :class="model.cssClasses.toolbar">
      <div v-if="model.showMonthTitles" :class="model.cssClasses.monthTitles">
        <div v-for="(month, index) in model.months" :key="index" :class="model.cssClasses.monthTitle">{{ month.title }}</div>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="model.topToolbar"></SvComponent>
    </div>
    <div v-if="model.isDayZoom" :class="model.cssClasses.months">
      <div v-for="(month, index) in model.months" :key="index" :class="model.cssClasses.monthView">
        <div :class="model.cssClasses.weekDays">
          <div v-for="(name, nameIndex) in model.weekDays" :key="nameIndex" :class="model.cssClasses.weekDay">{{ name }}</div>
        </div>
        <div :class="model.cssClasses.days" @mouseleave="model.hoverItem(undefined)">
          <div v-for="(item, itemIndex) in month.days" :key="itemIndex" :class="item.css"
            @click="model.selectItem(item)" @mouseenter="model.hoverItem(item)">{{ item.text }}</div>
        </div>
      </div>
    </div>
    <div v-else :class="model.cssClasses.grid" @mouseleave="model.hoverItem(undefined)">
      <div v-for="(item, itemIndex) in model.items" :key="itemIndex" :class="item.css"
        @click="model.selectItem(item)" @mouseenter="model.hoverItem(item)">{{ item.text }}</div>
    </div>
    <div v-if="model.footerVisible" :class="model.cssClasses.footer">
      <SvComponent :is="'sv-action-bar'" :model="model.footerToolbar"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CalendarModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import { useBase } from "../../base";

const props = defineProps<{ model: CalendarModel }>();
useBase(() => props.model);
</script>
