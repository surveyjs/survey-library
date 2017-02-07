// model
export * from "./chunks/model";

// localization
import './chunks/localization';

// helpers
import './chunks/helpers';

// css standard
export {defaultStandardCss} from "../defaultCss/cssstandard";
// css bootstrap
export {defaultBootstrapCss} from "../defaultCss/cssbootstrap";

export {default as Survey} from "../vue/survey.vue";
export {default as Page} from "../vue/page.vue";
export {default as Radiogroup} from "../vue/radiogroup.vue";
export {default as OtherChoice} from '../vue/otherChoice.vue';
export {default as Rating} from "../vue/rating.vue";
