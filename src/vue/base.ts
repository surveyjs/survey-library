import Vue from "vue";
import { Base, IAttachKey2clickOptions, doKey2ClickBlur, doKey2ClickDown, doKey2ClickUp } from "survey-core";
import { Component } from "vue-property-decorator";

@Component
export class BaseVue extends Vue {
  protected getModel(): Base {
    return null;
  }
  private setIsRendering(val: boolean) {
    var model = this.getModel();
    if (!!model) {
      (<any>model).isRendering = val;
    }
  }
  private getIsRendering(): boolean {
    var model = this.getModel();
    return !!model && !!(<any>model).isRendering;
  }
  protected onMounted() { }
  protected onUpdated() { }
  protected onDestroyed() { }
  protected onCreated() {
    var model = this.getModel();
    if (!model) return;
    model.iteratePropertiesHash((propertiesHash: any, name: any) => {
      (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
    });
    model.getPropertyValueCoreHandler = (propertiesHash: any, name: string) => {
      if (!propertiesHash.hasOwnProperty(name)) {
        (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
      }
      return propertiesHash[name];
    };
    model.setPropertyValueCoreHandler = (
      propertiesHash: any,
      name: string,
      val: any
    ) => {
      if (!propertiesHash.hasOwnProperty(name) || !this.getIsRendering())
        Vue.set(propertiesHash, name, val);
      else propertiesHash[name] = val;
    };
  }
  created() {
    this.onCreated();
  }
  beforeMount() {
    this.setIsRendering(true);
  }
  beforeUpdate() {
    this.setIsRendering(true);
  }
  mounted() {
    this.setIsRendering(false);
    this.onMounted();
  }
  updated() {
    this.setIsRendering(false);
    this.onUpdated();
  }
  destroyed() {
    this.onDestroyed();
  }
}

Vue.directive("key2click", {
  // When the bound element is inserted into the DOM...
  inserted: function (el, binding) {
    const options: IAttachKey2clickOptions = { ...binding.value } || { processEsc: true };
    if(!options.disableTabStop) el.tabIndex = 0;
    el.addEventListener("keyup", (evt: any) => {
      evt.preventDefault();
      evt.stopPropagation();
      doKey2ClickUp(evt, options);
      return false;
    });
    el.addEventListener("keydown", (evt: any) => {
      doKey2ClickDown(evt, options);
    }
    );
    el.addEventListener("blur", (evt: any) => {
      doKey2ClickBlur(evt);
    });
  }
});

export default BaseVue;
