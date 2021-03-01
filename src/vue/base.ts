import Vue from "vue";
import { Base } from "survey-core";
import { Component, Prop, Watch } from "vue-property-decorator";

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
  protected onMounted() {}
  protected onUpdated() {}
  protected onDestroyed() {}
  protected onCreated() {
    var model = this.getModel();
    if (!model) return;
    model.iteratePropertiesHash((hash: any, key: any) => {
      Vue.set(hash, key, hash[key]);
    });
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

export default BaseVue;
