<template>
  <div><sv-popup-container :model="popupViewModel"></sv-popup-container></div>
</template>
<script lang="ts">
import { PopupModel, createPopupViewModel } from "survey-core";
import { reactive, type PropType } from "vue";
import { defineSurveyComponent } from "../../base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-popup",
  props: {
    model: Object as PropType<PopupModel>,
  },
  setup(props: any) {
    return {
      popupViewModel: reactive(
        createPopupViewModel(props.model, undefined as any)
      ),
    };
  },
  mounted() {
    const container = (this.$el as HTMLElement) as HTMLElement;
    this.popupViewModel.setComponentElement(
      container,
      this.getTarget ? this.getTarget(container) : undefined
    );
  },
  destroyed() {
    this.popupViewModel.dispose();
  },
  data(vm: any) {
    return {
      getModel: () => {
        return vm.model;
      },
    };
  },
  watch: {
    model(newValue: PopupModel) {
      this.popupViewModel.dispose();
      this.popupViewModel = reactive(
        createPopupViewModel(newValue, undefined as any)
      );
      this.popupViewModel = this.$el.parentElement;
    },
  },
});
</script>
