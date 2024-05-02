<template>
  <div
    tabindex="-1"
    class="sv-popup"
    v-bind:class="model.styleClass"
    v-show="model.isVisible"
    v-on:keydown="
      (event) => {
        model.onKeyDown(event);
      }
    "
    v-on:click="
      (event) => {
        model.clickOutside(event);
      }
    "
  >
    <div
      class="sv-popup__container"
      v-bind:style="{
        left: model.left,
        top: model.top,
        height: model.height,
        width: model.width,
        minWidth: model.minWidth,
      }"
      v-on:click="clickInside"
    >
      <div class="sv-popup__shadow">
        <component
          v-if="model.showHeader"
          :is="model.popupHeaderTemplate"
          :model="model"
        ></component>
        <div class="sv-popup__body-content">
          <div class="sv-popup__body-header" v-if="!!model.title">
            {{ model.title }}
          </div>
          <div class="sv-popup__scrolling-content">
            <div class="sv-popup__content">
              <component
                :is="model.contentComponentName"
                v-bind="model.contentComponentData"
              ></component>
            </div>
          </div>
          <div v-if="model.showFooter" class="sv-popup__body-footer">
            <sv-action-bar :model="model.footerToolbar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBase } from "@/base";
import type { PopupBaseViewModel } from "survey-core";
import { onMounted, onUpdated } from "vue";

const props = defineProps<{ model: PopupBaseViewModel }>();
const clickInside = (event: any) => {
  event.stopPropagation();
};

useBase(() => props.model);

onUpdated(() => {
  const model = props.model;
  if (model.isVisible && !model.isPositionSet) {
    props.model.updateOnShowing();
  }
});
onMounted(() => {
  if (props.model.isVisible) {
    props.model.updateOnShowing();
  }
});
</script>
