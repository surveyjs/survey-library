import type { Base } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref, isRef } from "vue";

function makeReactive(surveyElement: Base) {
  surveyElement.iteratePropertiesHash((propertiesHash: any, name: any) => {
    // (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
    propertiesHash[name] = ref(propertiesHash[name]);
  });
  surveyElement.getPropertyValueCoreHandler = (
    propertiesHash: any,
    name: string
  ) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!propertiesHash.hasOwnProperty(name)) {
      // (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
      propertiesHash[name] = ref(propertiesHash[name]);
    }
    return unref(propertiesHash[name]);
  };
  surveyElement.setPropertyValueCoreHandler = (
    propertiesHash: any,
    name: string,
    val: any
  ) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!isRef(propertiesHash[name])) {
      propertiesHash[name] = ref(propertiesHash[name]);
    } else propertiesHash[name].value = val;
  };
}
// by convention, composable function names start with "use"

export function defineSurveyComponent(componentDefinition: ComponentOptions) {
  const mounted = componentDefinition.mounted;
  componentDefinition.mounted = function () {
    if (typeof this.getModel === "function") {
      makeReactive(this.getModel());
    }
    if (mounted) {
      mounted.call(this);
    }
  };
  return defineComponent(componentDefinition);
}
