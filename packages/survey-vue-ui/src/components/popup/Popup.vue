<template>
  <div>
    <Teleport :to="popupViewModel.container">
      <sv-popup-container :model="popupViewModel"></sv-popup-container>
    </Teleport>
  </div>
</template>
<script lang="ts">
import { PopupModel, createPopupViewModel, PopupBaseViewModel } from "survey-core";
import { reactive, ref, watch } from "vue";
import { defineSurveyComponent } from "../../base";

function initializePopupViewModel(model: PopupModel): PopupBaseViewModel {
  const res = createPopupViewModel(model);
  res.initializePopupContainer();
  return res;
}

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "sv-popup",
  props: {
    model: PopupModel,
  },
  setup(props: any) {
    return {
      popupViewModel: reactive(initializePopupViewModel(props.model)),
    };
  },
  mounted() {
    this.popupViewModel.targetElement = this.$el.parentElement;
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
      this.popupViewModel = reactive(initializePopupViewModel(newValue));
      this.popupViewModel = this.$el.parentElement;
    },
  },
});
</script>
