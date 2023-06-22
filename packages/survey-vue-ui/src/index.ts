import App from "./App.vue";
import Survey from "./Survey.vue";
import Page from "./Page.vue";

export { App };
export { Survey };
export { Page };

import Header from "./Header.vue";
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
import Ranking from "./Ranking.vue";
import RankingItem from "./RankingItem.vue";

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

export function registerComponents(app: any) {
  app.component("survey-header", Header);
  app.component("survey-page", Page);
  app.component("survey-row", Row);
  app.component("survey-element", Element);
  app.component("survey-panel", Panel);
  app.component("survey-element-header", ElementHeader);
  app.component("survey-string", String);
  app.component("sv-string-viewer", StringViewer);
  app.component("sv-skeleton", Skeleton);
  app.component("survey-text", QuestionText);
  app.component("survey-text-input", QuestionTextInput);
  app.component("survey-checkbox", Checkbox);
  app.component("survey-checkbox-item", CheckboxItem);
  app.component("survey-radiogroup", Radiogroup);
  app.component("survey-radiogroup-item", RadiogroupItem);
  app.component("survey-signaturepad", Signaturepad);
  app.component("survey-html", Html);
  app.component("survey-image", Image);
  app.component("survey-expression", Expression);
  app.component("survey-file", File);
  app.component("survey-imagepicker", ImagePicker);
  app.component("survey-imagepicker-item", ImagePickerItem);
  app.component("survey-comment", Comment);
  app.component("survey-dropdown", Dropdown);
  app.component("sv-dropdown", DropdownInput);
  app.component("survey-tagbox", Tagbox);
  app.component("sv-tagbox", TagboxInput);
  app.component("sv-tagbox-item", TagboxItem);
  app.component("sv-tagbox-filter", TagboxFilter);
  app.component("survey-ranking", Ranking);
  app.component("survey-ranking-item", RankingItem);

  app.component("sv-components-container", Container);
  app.component("sv-progress-pages", Progress);
  app.component("sv-progress-questions", Progress);
  app.component("sv-progress-correctquestions", Progress);
  app.component("sv-progress-requiredquestions", Progress);

  app.component("survey-errors", Errors);
  app.component("survey-question-comment", QuestionComment);
  app.component("survey-element-title", TitleElement);
  app.component("survey-element-title-content", TitleContent);
  app.component("sv-title-actions", TitleActions);
  app.component("sv-brand-info", BrandInfo);
  app.component("sv-svg-icon", SvgIcon);

  app.component("sv-action-bar", ActionBar);
  app.component("sv-action", Action);
  app.component("sv-action-bar-item", ActionBarItem);
  app.component("sv-action-bar-item-dropdown", ActionBarItemDropdown);
  app.component("sv-action-bar-separator", ActionBarSeparator);

  app.component("sv-list", List);
  app.component("sv-list-item", ListItem);

  app.component("sv-popup", Popup);
  app.component("sv-popup-container", PopupContainer);
  app.component("popup-pointer", PopupPointer);
}

export default {
  install(app: any) {
    registerComponents(app);
  },
};
