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

import {
  SurveyModel,
  doKey2ClickBlur,
  doKey2ClickDown,
  doKey2ClickUp,
  type IAttachKey2clickOptions,
} from "survey-core";
import type { App } from "vue";
import FileCleanButton from "./FileCleanButton.vue";
import FileVideo from "./FileVideo.vue";
import FileChooseButton from "./components/file/FileChooseButton.vue";
import FilePreview from "./components/file/FilePreview.vue";
import ButtonGroup from "./buttongroup/ButtonGroup.vue";
import ButtonGroupItem from "./buttongroup/ButtonGroupItem.vue";
import Logo from "./Logo.vue";
import SvgBundle from "./SvgBundle.vue";

export { useBase, useLocString, useQuestion, useComputedArray } from "./base";

SurveyModel.platform = "vue3";

function registerComponents(app: App) {
  app.component("SurveyComponent", SurveyVue);
  app.component("sv-svg-bundle", SvgBundle);
  app.component("PopupSurveyComponent", PopupSurvey);
  app.component("survey", SurveyVue);
  app.component("popup-survey", PopupSurvey);

  app.component("survey-header", HeaderBasic);
  app.component("sv-logo-image", Logo);
  app.component("survey-page", Page);
  app.component("survey-row", Row);
  app.component("survey-question", Question);
  app.component("survey-panel", Panel);
  app.component("survey-element-header", ElementHeader);
  app.component("survey-string", String);
  app.component("sv-string-viewer", StringViewer);
  app.component("sv-string-editor", StringEditor);
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
  app.component("sv-file-choose-btn", FileChooseButton);
  app.component("sv-file-clean-btn", FileCleanButton);
  app.component("sv-file-preview", FilePreview);
  app.component("sv-file-video", FileVideo);
  app.component("survey-imagepicker", ImagePicker);
  app.component("survey-imagepicker-item", ImagePickerItem);
  app.component("survey-comment", Comment);
  app.component("survey-dropdown", Dropdown);
  app.component("sv-dropdown-select", DropdownSelect);
  app.component("sv-dropdown-option-item", DropdownOptionItem);
  app.component("sv-dropdown", DropdownInput);
  app.component("survey-tagbox", Tagbox);
  app.component("sv-tagbox", TagboxInput);
  app.component("sv-tagbox-item", TagboxItem);
  app.component("sv-tagbox-filter", TagboxFilter);
  app.component("survey-ranking", Ranking);
  app.component("survey-ranking-item", RankingItem);
  app.component("survey-rating", Rating);
  app.component("sv-rating-item", RatingItem);
  app.component("sv-rating-item-smiley", RatingItemSmiley);
  app.component("sv-rating-item-star", RatingItemStar);
  app.component("sv-rating-dropdown", RatingDropdown);
  app.component("sv-rating-dropdown-item", RatingDropdownItem);
  app.component("survey-boolean", BooleanSwitch);
  app.component("sv-boolean-radio", BooleanRadio);
  app.component("sv-boolean-radio-item", BooleanRadioItem);
  app.component("sv-boolean-checkbox", BooleanCheckbox);
  app.component("survey-multipletext", MultipleText);
  app.component("survey-multipletext-item", MultipletextItem);

  app.component("survey-matrix", Matrix);
  app.component("survey-matrix-row", MatrixRow);
  app.component("survey-matrix-cell", MatrixCell);
  app.component("survey-matrixdropdown", MatrixDropdown);
  app.component("survey-matrixtable", MatrixTable);
  app.component("survey-matrixheaderrequired", MatrixHeaderRequired);
  app.component("survey-matrixdropdown-cell", MatrixDropdownCellComp);
  app.component("survey-matrixdynamic", MatrixDynamic);
  app.component("sv-matrix-remove-button", RemoveButton);
  app.component("sv-matrix-drag-drop-icon", DragDropIcon);
  app.component("sv-matrix-detail-button", DetailButton);

  app.component("survey-paneldynamic", PanelDynamic);
  app.component("survey-paneldynamicprogress", PanelDynamicProgress);
  app.component("survey-paneldynamicprogress-v2", PanelDynamicProgressV2);
  app.component("sv-paneldynamic-add-btn", PaneldynamicAddBtn);
  app.component("sv-paneldynamic-next-btn", PaneldynamicNextBtn);
  app.component("sv-paneldynamic-prev-btn", PaneldynamicPrevBtn);
  app.component("sv-paneldynamic-remove-btn", PaneldynamicRemoveBtn);
  app.component("sv-paneldynamic-progress-text", PaneldynamicProgressText);

  app.component("sv-components-container", Container);

  app.component("sv-progress-buttons", ProgressButtonsComponent);
  app.component("sv-navigation-toc", ProgressToc);
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
  app.component("sv-question-error", QuestionError);
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

  app.component("sv-notifier", Notifier);
  app.component("survey-other-choice", OtherChoice);
  app.component("sv-nav-btn", SurveyNavigationButton);
  app.component("survey-customwidget", CustomWidget);
  app.component("survey-popup-modal", PopupModal);

  app.component("sv-character-counter", CharacterCounterComponent);

  app.component("survey-composite", Composite);
  app.component("survey-custom", Custom);
  app.component("sv-timerpanel", TimerPanel);
  app.component("sv-loading-indicator", LoadingIndicator);

  app.component("sv-header", Header);
  app.component("sv-header-cell", HeaderCell);
  app.component("sv-header-mobile", HeaderMobile);

  app.component("sv-template-renderer", TemplateRenderer);

  app.component("survey-element", Element);

  app.component("survey-buttongroup", ButtonGroup);
  app.component("sv-button-group-item", ButtonGroupItem);

  app.directive("key2click", {
    // When the bound element is inserted into the DOM...
    mounted: function (el: HTMLElement, binding: any) {
      const options: IAttachKey2clickOptions = { ...binding.value } || {
        processEsc: true,
      };
      if (options.disableTabStop) {
        el.tabIndex = -1;
        return;
      }
      if (!options.disableTabStop) el.tabIndex = 0;
      el.addEventListener("keyup", (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        doKey2ClickUp(evt, options);
        return false;
      });
      el.addEventListener("keydown", (evt: any) => {
        doKey2ClickDown(evt, options);
      });
      el.addEventListener("blur", (evt: any) => {
        doKey2ClickBlur(evt);
      });
    },
  });
}

export const surveyPlugin = {
  install(app: any) {
    registerComponents(app);
  },
};
