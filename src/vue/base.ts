import Vue from "vue";
import { Base, IAttachKey2clickOptions, doKey2ClickUp } from "survey-core";
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

export function attachKey2click(evt: KeyboardEvent, options: IAttachKey2clickOptions = { processEsc: true }): void {
  evt.preventDefault();
  evt.stopPropagation();
  doKey2ClickUp(evt, options);
}

export default BaseVue;
