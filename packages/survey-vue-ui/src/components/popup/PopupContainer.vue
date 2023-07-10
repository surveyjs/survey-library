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
      () => {
        model.clickOutside();
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
          v-show="model.showHeader"
          :is="model.popupHeaderTemplate"
          :model="model"
        ></component>
        <div class="sv-popup__body-content">
          <div class="sv-popup__body-header" v-show="!!model.title">{{ model.title }}</div>
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
<script lang="ts">
import { PopupBaseViewModel } from "survey-core";
import { defineSurveyComponent } from "../../base";
import type { PropType } from "vue";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-popup-container",
  props: {
    model: Object as PropType<PopupBaseViewModel>,
  },
  setup() {
    return {
      prevIsVisible: false,
    };
  },
  data(vm: any) {
    return {
      getModel: () => {
        return vm.model;
      },
    };
  },
  methods: {
    clickInside: (event: any) => {
      event.stopPropagation();
    },
  },
  updated() {
    if (!this.prevIsVisible && this.model.isVisible) {
      this.model.updateOnShowing();
    }
    this.prevIsVisible = this.model.isVisible;
  },
});
// replace to showDialog then delete
// export function showModal(
//   componentName: string,
//   data: any,
//   onApply: () => boolean,
//   onCancel?: () => void,
//   cssClass?: string,
//   title?: string,
//   displayMode: "popup" | "overlay" = "popup"
// ): PopupBaseViewModel {
//   const options = createDialogOptions(
//     componentName,
//     data,
//     onApply,
//     onCancel,
//     undefined,
//     undefined,
//     cssClass,
//     title,
//     displayMode
//   );
//   return showDialog(options);
// }
// export function showDialog(dialogOptions: IDialogOptions): PopupBaseViewModel {
//   dialogOptions.onHide = () => {
//     {
//       popup.$destroy();
//       popupViewModel.dispose();
//     }
//   };
//   const popupViewModel: PopupBaseViewModel = createPopupModalViewModel(dialogOptions);
//   const popup = new PopupContainer({
//     el: popupViewModel.container.appendChild(document.createElement("div")),
//     propsData: { model: popupViewModel },
//   });
//   popupViewModel.model.isVisible = true;
//   return popupViewModel;
// }
// settings.showModal = showModal;
// Vue.component("sv-popup-container", PopupContainer);
</script>
