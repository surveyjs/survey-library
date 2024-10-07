import Page from "./Page.vue";
import HeaderBasic from "./Header.vue";
import Row from "./Row.vue";
import Question from "./Question.vue";
import Panel from "./Panel.vue";
import ElementHeader from "./ElementHeader.vue";
import String from "./String.vue";
import StringViewer from "./StringViewer.vue";
import StringEditor from "./StringEditor.vue";
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
import DropdownSelect from "./DropdownSelect.vue";
import DropdownOptionItem from "./components/dropdown/OptionItem.vue";
import DropdownInput from "./components/dropdown/Dropdown.vue";
import Tagbox from "./Tagbox.vue";
import TagboxInput from "./components/tagbox/Tagbox.vue";
import TagboxFilter from "./components/tagbox/TagboxFilter.vue";
import TagboxItem from "./components/tagbox/TagboxItem.vue";
import Ranking from "./Ranking.vue";
import RankingItem from "./RankingItem.vue";
import RankingItemContent from "./RankingItemContent.vue";
import Rating from "./Rating.vue";
import RatingItem from "./components/rating/RatingItem.vue";
import RatingItemSmiley from "./components/rating/RatingItemSmiley.vue";
import RatingItemStar from "./components/rating/RatingItemStar.vue";
import RatingDropdownItem from "./components/rating/RatingDropdownItem.vue";
import RatingDropdown from "./RatingDropdown.vue";
import BooleanSwitch from "./BooleanSwitch.vue";
import BooleanRadio from "./BooleanRadio.vue";
import BooleanRadioItem from "./BooleanRadioItem.vue";
import BooleanCheckbox from "./BooleanCheckbox.vue";
import MultipleText from "./Multipletext.vue";
import MultipletextItem from "./MultipletextItem.vue";

import Matrix from "./Matrix.vue";
import MatrixRow from "./MatrixRow.vue";
import MatrixCell from "./MatrixCell.vue";
import MatrixDropdown from "./MatrixDropdown.vue";
import MatrixTable from "./MatrixTable.vue";
import MatrixHeaderRequired from "./MatrixHeaderRequired.vue";
import MatrixDropdownCellComp from "./MatrixDropdownCellComp.vue";
import MatrixDynamic from "./MatrixDynamic.vue";
import RemoveButton from "./components/matrix-actions/remove-button/RemoveButton.vue";
import DragDropIcon from "./components/matrix-actions/drag-drop-icon/DragDropIcon.vue";
import DetailButton from "./components/matrix-actions/detail-button/DetailButton.vue";

import PanelDynamic from "./PanelDynamic.vue";
import PanelDynamicProgress from "./PanelDynamicProgress.vue";
import PanelDynamicProgressV2 from "./PanelDynamicProgressV2.vue";
import PaneldynamicAddBtn from "./components/paneldynamic-actions/PaneldynamicAddBtn.vue";
import PaneldynamicNextBtn from "./components/paneldynamic-actions/PaneldynamicNextBtn.vue";
import PaneldynamicPrevBtn from "./components/paneldynamic-actions/PaneldynamicPrevBtn.vue";
import PaneldynamicRemoveBtn from "./components/paneldynamic-actions/PaneldynamicRemoveBtn.vue";
import PaneldynamicProgressText from "./components/paneldynamic-actions/PaneldynamicProgressText.vue";

import Errors from "./Errors.vue";
import QuestionComment from "./QuestionComment.vue";
import TitleElement from "./components/title/TitleElement.vue";
import TitleContent from "./components/title/TitleContent.vue";
import TitleActions from "./components/title/TitleActions.vue";
import BrandInfo from "./components/BrandInfo.vue";
import SvgIcon from "./components/svg-icon/SvgIcon.vue";
import QuestionError from "./components/QuestionError.vue";

import ActionBar from "./components/action-bar/ActionBar.vue";
import Action from "./components/action-bar/Action.vue";
import ActionBarItem from "./components/action-bar/ActionBarItem.vue";
import ActionBarItemDropdown from "./components/action-bar/ActionBarItemDropdown.vue";
import ActionBarSeparator from "./components/action-bar/ActionBarSeparator.vue";

import List from "./components/list/List.vue";
import ListItem from "./components/list/ListItem.vue";
import ListItemContent from "./components/list/ListItemContent.vue";
import ListItemGroup from "./components/list/ListItemGroup.vue";

import Popup from "./components/popup/Popup.vue";
import PopupContainer from "./components/popup/PopupContainer.vue";
import PopupPointer from "./components/popup/PopupPointer.vue";

import Container from "./components/Container.vue";

import Progress from "./components/progress/Progress.vue";
import ProgressButtonsComponent from "./components/progress/ProgressButtons.vue";
import ProgressToc from "./components/progress/ProgressToc.vue";
import SurveyVue from "./Survey.vue";
import Notifier from "./Notifier.vue";
import OtherChoice from "./QuestionOther.vue";
import SurveyNavigationButton from "./components/survey-actions/SurveyNavigationButton.vue";
import PopupSurvey from "./PopupSurvey.vue";
import CustomWidget from "./CustomWidget.vue";
import PopupModal from "./components/popup/PopupModal.vue";
import TextAreaComponent from "./components/TextArea.vue";
import CharacterCounterComponent from "./components/CharacterCounter.vue";
import Composite from "./Composite.vue";
import Custom from "./Custom.vue";
import TimerPanel from "./TimerPanel.vue";
import LoadingIndicator from "./components/LoadingIndicator.vue";

import Header from "./components/header/Header.vue";
import HeaderCell from "./components/header/HeaderCell.vue";
import HeaderMobile from "./components/header/HeaderMobile.vue";

import Element from "./Element.vue";

import TemplateRenderer from "./TemplateRenderer.vue";

import { SurveyModel } from "survey-core";
import type { App } from "vue";
import FileCleanButton from "./FileCleanButton.vue";
import FileVideo from "./FileVideo.vue";
import FileChooseButton from "./components/file/FileChooseButton.vue";
import FilePreview from "./components/file/FilePreview.vue";
import ButtonGroup from "./buttongroup/ButtonGroup.vue";
import ButtonGroupItem from "./buttongroup/ButtonGroupItem.vue";
import Logo from "./Logo.vue";
import SvgBundle from "./SvgBundle.vue";
import { ComponentFactory } from "./component-factory";
import { key2ClickDirective } from "./directives/key2click";
import FilePage from "./components/file/FilePage.vue";
import FileItem from "./components/file/FileItem.vue";

export { useBase, useLocString, useQuestion, useComputedArray } from "./base";
export { ComponentFactory };
export { key2ClickDirective } from "./directives/key2click";
export { default as SvComponent } from "./SvComponent.vue";
export { PopupSurvey as PopupSurveyComponent };
export { SurveyVue as SurveyComponent };

SurveyModel.platform = "vue3";

function registerComponentWithFunction(
  registerFunc: (name: string, component: any) => void,
  name: string,
  component: any
) {
  registerFunc(name, component);
}

function registerComponents(
  registerFunc: (name: string, component: any) => void
) {
  const registerComponent = registerComponentWithFunction.bind(
    undefined,
    registerFunc
  );
  registerComponent("sv-svg-bundle", SvgBundle);
  registerComponent("popup-survey", PopupSurvey);
  registerComponent("survey-header", HeaderBasic);
  registerComponent("sv-logo-image", Logo);
  registerComponent("survey-page", Page);
  registerComponent("survey-row", Row);
  registerComponent("survey-question", Question);
  registerComponent("survey-panel", Panel);
  registerComponent("survey-element-header", ElementHeader);
  registerComponent("survey-string", String);
  registerComponent("sv-string-viewer", StringViewer);
  registerComponent("sv-string-editor", StringEditor);
  registerComponent("sv-skeleton", Skeleton);
  registerComponent("survey-text", QuestionText);
  registerComponent("survey-text-input", QuestionTextInput);
  registerComponent("survey-checkbox", Checkbox);
  registerComponent("survey-checkbox-item", CheckboxItem);
  registerComponent("survey-radiogroup", Radiogroup);
  registerComponent("survey-radiogroup-item", RadiogroupItem);
  registerComponent("survey-signaturepad", Signaturepad);
  registerComponent("survey-html", Html);
  registerComponent("survey-image", Image);
  registerComponent("survey-expression", Expression);
  registerComponent("survey-file", File);
  registerComponent("sv-file-choose-btn", FileChooseButton);
  registerComponent("sv-file-clean-btn", FileCleanButton);
  registerComponent("sv-file-preview", FilePreview);
  registerComponent("sv-file-page", FilePage);
  registerComponent("sv-file-item", FileItem);
  registerComponent("sv-file-video", FileVideo);
  registerComponent("survey-imagepicker", ImagePicker);
  registerComponent("survey-imagepicker-item", ImagePickerItem);
  registerComponent("survey-comment", Comment);
  registerComponent("survey-dropdown", Dropdown);
  registerComponent("sv-dropdown-select", DropdownSelect);
  registerComponent("sv-dropdown-option-item", DropdownOptionItem);
  registerComponent("sv-dropdown", DropdownInput);
  registerComponent("survey-tagbox", Tagbox);
  registerComponent("sv-tagbox", TagboxInput);
  registerComponent("sv-tagbox-item", TagboxItem);
  registerComponent("sv-tagbox-filter", TagboxFilter);
  registerComponent("survey-ranking", Ranking);
  registerComponent("survey-ranking-item", RankingItem);
  registerComponent("sv-ranking-item", RankingItemContent);
  registerComponent("survey-rating", Rating);
  registerComponent("sv-rating-item", RatingItem);
  registerComponent("sv-rating-item-smiley", RatingItemSmiley);
  registerComponent("sv-rating-item-star", RatingItemStar);
  registerComponent("sv-rating-dropdown", RatingDropdown);
  registerComponent("sv-rating-dropdown-item", RatingDropdownItem);
  registerComponent("survey-boolean", BooleanSwitch);
  registerComponent("sv-boolean-radio", BooleanRadio);
  registerComponent("sv-boolean-radio-item", BooleanRadioItem);
  registerComponent("sv-boolean-checkbox", BooleanCheckbox);
  registerComponent("survey-multipletext", MultipleText);
  registerComponent("survey-multipletext-item", MultipletextItem);

  registerComponent("survey-matrix", Matrix);
  registerComponent("survey-matrix-row", MatrixRow);
  registerComponent("survey-matrix-cell", MatrixCell);
  registerComponent("survey-matrixdropdown", MatrixDropdown);
  registerComponent("survey-matrixtable", MatrixTable);
  registerComponent("survey-matrixheaderrequired", MatrixHeaderRequired);
  registerComponent("survey-matrixdropdown-cell", MatrixDropdownCellComp);
  registerComponent("survey-matrixdynamic", MatrixDynamic);
  registerComponent("sv-matrix-remove-button", RemoveButton);
  registerComponent("sv-matrix-drag-drop-icon", DragDropIcon);
  registerComponent("sv-matrix-detail-button", DetailButton);

  registerComponent("survey-paneldynamic", PanelDynamic);
  registerComponent("survey-paneldynamicprogress", PanelDynamicProgress);
  registerComponent("survey-paneldynamicprogress-v2", PanelDynamicProgressV2);
  registerComponent("sv-paneldynamic-add-btn", PaneldynamicAddBtn);
  registerComponent("sv-paneldynamic-next-btn", PaneldynamicNextBtn);
  registerComponent("sv-paneldynamic-prev-btn", PaneldynamicPrevBtn);
  registerComponent("sv-paneldynamic-remove-btn", PaneldynamicRemoveBtn);
  registerComponent("sv-paneldynamic-progress-text", PaneldynamicProgressText);
  registerComponent("sv-components-container", Container);

  registerComponent("sv-progress-buttons", ProgressButtonsComponent);
  registerComponent("sv-navigation-toc", ProgressToc);
  registerComponent("sv-progress-pages", Progress);
  registerComponent("sv-progress-questions", Progress);
  registerComponent("sv-progress-correctquestions", Progress);
  registerComponent("sv-progress-requiredquestions", Progress);

  registerComponent("survey-errors", Errors);
  registerComponent("survey-question-comment", QuestionComment);
  registerComponent("survey-element-title", TitleElement);
  registerComponent("survey-element-title-content", TitleContent);
  registerComponent("sv-title-actions", TitleActions);
  registerComponent("sv-brand-info", BrandInfo);
  registerComponent("sv-question-error", QuestionError);
  registerComponent("sv-svg-icon", SvgIcon);

  registerComponent("sv-action-bar", ActionBar);
  registerComponent("sv-action", Action);
  registerComponent("sv-action-bar-item", ActionBarItem);
  registerComponent("sv-action-bar-item-dropdown", ActionBarItemDropdown);
  registerComponent("sv-action-bar-separator", ActionBarSeparator);

  registerComponent("sv-list", List);
  registerComponent("sv-list-item-content", ListItemContent);
  registerComponent("sv-list-item-group", ListItemGroup);
  registerComponent("sv-list-item", ListItem);

  registerComponent("sv-popup", Popup);
  registerComponent("sv-popup-container", PopupContainer);
  registerComponent("popup-pointer", PopupPointer);

  registerComponent("sv-notifier", Notifier);
  registerComponent("survey-other-choice", OtherChoice);
  registerComponent("sv-nav-btn", SurveyNavigationButton);
  registerComponent("survey-customwidget", CustomWidget);
  registerComponent("survey-popup-modal", PopupModal);

  registerComponent("survey-composite", Composite);
  registerComponent("survey-custom", Custom);
  registerComponent("sv-timerpanel", TimerPanel);
  registerComponent("sv-loading-indicator", LoadingIndicator);
  registerComponent("sv-header", Header);
  registerComponent("sv-header-cell", HeaderCell);
  registerComponent("sv-header-mobile", HeaderMobile);
  registerComponent("sv-template-renderer", TemplateRenderer);
  registerComponent("sv-character-counter", CharacterCounterComponent);
  registerComponent("sv-text-area", TextAreaComponent);
  registerComponent("survey-element", Element);

  registerComponent("survey-buttongroup", ButtonGroup);
  registerComponent("sv-button-group-item", ButtonGroupItem);
  registerComponent("survey", SurveyVue);
}

registerComponents((name, component) =>
  ComponentFactory.Instance.registerComponent(name, component)
);

export const surveyPlugin = {
  install(app: App) {
    app.component("SurveyComponent", SurveyVue);
    app.component("PopupSurveyComponent", PopupSurvey);
    app.directive("key2click", key2ClickDirective);
    registerComponents((name, component) => {
      app.component(name, component);
      ComponentFactory.Instance.registerComponent(name, name);
    });
  },
};
