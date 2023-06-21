import Header from "./Header.vue";
import Page from "./Page.vue";
import Row from "./Row.vue";
import Element from "./Element.vue";
import Panel from "./Panel.vue";
import ElementHeader from "./ElementHeader.vue";
import String from "./String.vue";
import StringViewer from "./StringViewer.vue";
import Skeleton from "./components/Skeleton.vue";
import QuestionText from "./Text.vue";
import QuestionTextInput from "./TextInput.vue";
import Checkbox from "./Checkbox.vue";
import CheckboxItem from "./CheckboxItem.vue";
import Radiogroup from "./Radiogroup.vue";
import RadiogroupItem from "./RadiogroupItem.vue";
import Signaturepad from "./Signaturepad.vue";
import Html from "./Html.vue";
import Image from "./Image.vue";
import Expression from "./Expression.vue";
import File from "./File.vue";
import ImagePicker from "./Imagepicker.vue";
import ImagePickerItem from "./ImagepickerItem.vue";
import Comment from "./Comment.vue";
import Dropdown from "./Dropdown.vue";
import DropdownInput from "./components/dropdown/Dropdown.vue";
import Tagbox from "./Tagbox.vue";
import TagboxInput from "./components/tagbox/Tagbox.vue";
import TagboxFilter from "./components/tagbox/TagboxFilter.vue";
import TagboxItem from "./components/tagbox/TagboxItem.vue";

import Errors from "./Errors.vue";
import QuestionComment from "./QuestionComment.vue";
import TitleElement from "./components/title/TitleElement.vue";
import TitleContent from "./components/title/TitleContent.vue";
import TitleActions from "./components/title/TitleActions.vue";
import BrandInfo from "./components/BrandInfo.vue";
import SvgIcon from "./components/svg-icon/SvgIcon.vue";

import ActionBar from "./components/action-bar/ActionBar.vue";
import Action from "./components/action-bar/Action.vue";
import ActionBarItem from "./components/action-bar/ActionBarItem.vue";
import ActionBarItemDropdown from "./components/action-bar/ActionBarItemDropdown.vue";
import ActionBarSeparator from "./components/action-bar/ActionBarSeparator.vue";

import List from "./components/list/List.vue";
import ListItem from "./components/list/ListItem.vue";

import Popup from "./components/popup/Popup.vue";
import PopupContainer from "./components/popup/PopupContainer.vue";
import PopupPointer from "./components/popup/PopupPointer.vue";

import Container from "./components/Container.vue";

import Progress from "./components/progress/Progress.vue";

export function registerComponents(vue: any) {
  vue.component("survey-header", Header);
  vue.component("survey-page", Page);
  vue.component("survey-row", Row);
  vue.component("survey-element", Element);
  vue.component("survey-panel", Panel);
  vue.component("survey-element-header", ElementHeader);
  vue.component("survey-string", String);
  vue.component("sv-string-viewer", StringViewer);
  vue.component("sv-skeleton", Skeleton);
  vue.component("survey-text", QuestionText);
  vue.component("survey-text-input", QuestionTextInput);
  vue.component("survey-checkbox", Checkbox);
  vue.component("survey-checkbox-item", CheckboxItem);
  vue.component("survey-radiogroup", Radiogroup);
  vue.component("survey-radiogroup-item", RadiogroupItem);
  vue.component("survey-signaturepad", Signaturepad);
  vue.component("survey-html", Html);
  vue.component("survey-image", Image);
  vue.component("survey-expression", Expression);
  vue.component("survey-file", File);
  vue.component("survey-imagepicker", ImagePicker);
  vue.component("survey-imagepicker-item", ImagePickerItem);
  vue.component("survey-comment", Comment);
  vue.component("survey-dropdown", Dropdown);
  vue.component("sv-dropdown", DropdownInput);
  vue.component("survey-tagbox", Tagbox);
  vue.component("sv-tagbox", TagboxInput);
  vue.component("sv-tagbox-item", TagboxItem);
  vue.component("sv-tagbox-filter", TagboxFilter);

  vue.component("sv-components-container", Container);
  vue.component("sv-progress-pages", Progress);
  vue.component("sv-progress-questions", Progress);
  vue.component("sv-progress-correctquestions", Progress);
  vue.component("sv-progress-requiredquestions", Progress);

  vue.component("survey-errors", Errors);
  vue.component("survey-question-comment", QuestionComment);
  vue.component("survey-element-title", TitleElement);
  vue.component("survey-element-title-content", TitleContent);
  vue.component("sv-title-actions", TitleActions);
  vue.component("sv-brand-info", BrandInfo);
  vue.component("sv-svg-icon", SvgIcon);

  vue.component("sv-action-bar", ActionBar);
  vue.component("sv-action", Action);
  vue.component("sv-action-bar-item", ActionBarItem);
  vue.component("sv-action-bar-item-dropdown", ActionBarItemDropdown);
  vue.component("sv-action-bar-separator", ActionBarSeparator);

  vue.component("sv-list", List);
  vue.component("sv-list-item", ListItem);

  vue.component("sv-popup", Popup);
  vue.component("sv-popup-container", PopupContainer);
  vue.component("popup-pointer", PopupPointer);
}
