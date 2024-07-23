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
import { VueComponentFactory } from "./component-factory";

export { useBase, useLocString, useQuestion, useComputedArray } from "./base";
export { default as SurveyComponent } from "./SurveyComponent.vue";

SurveyModel.platform = "vue3";
function registerComponents(app: App) {
  app.component("SurveyComponent", SurveyVue);
  app.component("survey", SurveyVue);
  app.component("PopupSurveyComponent", PopupSurvey);
  VueComponentFactory.Instance.registerComponent("sv-svg-bundle", SvgBundle);
  VueComponentFactory.Instance.registerComponent("popup-survey", PopupSurvey);
  VueComponentFactory.Instance.registerComponent("survey-header", HeaderBasic);
  VueComponentFactory.Instance.registerComponent("sv-logo-image", Logo);
  VueComponentFactory.Instance.registerComponent("survey-page", Page);
  VueComponentFactory.Instance.registerComponent("survey-row", Row);
  VueComponentFactory.Instance.registerComponent("survey-question", Question);
  VueComponentFactory.Instance.registerComponent("survey-panel", Panel);
  VueComponentFactory.Instance.registerComponent(
    "survey-element-header",
    ElementHeader
  );
  VueComponentFactory.Instance.registerComponent("survey-string", String);
  VueComponentFactory.Instance.registerComponent(
    "sv-string-viewer",
    StringViewer
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-string-editor",
    StringEditor
  );
  VueComponentFactory.Instance.registerComponent("sv-skeleton", Skeleton);
  VueComponentFactory.Instance.registerComponent("survey-text", QuestionText);
  VueComponentFactory.Instance.registerComponent(
    "survey-text-input",
    QuestionTextInput
  );
  VueComponentFactory.Instance.registerComponent("survey-checkbox", Checkbox);
  VueComponentFactory.Instance.registerComponent(
    "survey-checkbox-item",
    CheckboxItem
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-radiogroup",
    Radiogroup
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-radiogroup-item",
    RadiogroupItem
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-signaturepad",
    Signaturepad
  );
  VueComponentFactory.Instance.registerComponent("survey-html", Html);
  VueComponentFactory.Instance.registerComponent("survey-image", Image);
  VueComponentFactory.Instance.registerComponent(
    "survey-expression",
    Expression
  );
  VueComponentFactory.Instance.registerComponent("survey-file", File);
  VueComponentFactory.Instance.registerComponent(
    "sv-file-choose-btn",
    FileChooseButton
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-file-clean-btn",
    FileCleanButton
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-file-preview",
    FilePreview
  );
  VueComponentFactory.Instance.registerComponent("sv-file-video", FileVideo);
  VueComponentFactory.Instance.registerComponent(
    "survey-imagepicker",
    ImagePicker
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-imagepicker-item",
    ImagePickerItem
  );
  VueComponentFactory.Instance.registerComponent("survey-comment", Comment);
  VueComponentFactory.Instance.registerComponent("survey-dropdown", Dropdown);
  VueComponentFactory.Instance.registerComponent(
    "sv-dropdown-select",
    DropdownSelect
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-dropdown-option-item",
    DropdownOptionItem
  );
  VueComponentFactory.Instance.registerComponent("sv-dropdown", DropdownInput);
  VueComponentFactory.Instance.registerComponent("survey-tagbox", Tagbox);
  VueComponentFactory.Instance.registerComponent("sv-tagbox", TagboxInput);
  VueComponentFactory.Instance.registerComponent("sv-tagbox-item", TagboxItem);
  VueComponentFactory.Instance.registerComponent(
    "sv-tagbox-filter",
    TagboxFilter
  );
  VueComponentFactory.Instance.registerComponent("survey-ranking", Ranking);
  VueComponentFactory.Instance.registerComponent(
    "survey-ranking-item",
    RankingItem
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-ranking-item",
    RankingItemContent
  );
  VueComponentFactory.Instance.registerComponent("survey-rating", Rating);
  VueComponentFactory.Instance.registerComponent("sv-rating-item", RatingItem);
  VueComponentFactory.Instance.registerComponent(
    "sv-rating-item-smiley",
    RatingItemSmiley
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-rating-item-star",
    RatingItemStar
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-rating-dropdown",
    RatingDropdown
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-rating-dropdown-item",
    RatingDropdownItem
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-boolean",
    BooleanSwitch
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-boolean-radio",
    BooleanRadio
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-boolean-radio-item",
    BooleanRadioItem
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-boolean-checkbox",
    BooleanCheckbox
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-multipletext",
    MultipleText
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-multipletext-item",
    MultipletextItem
  );

  VueComponentFactory.Instance.registerComponent("survey-matrix", Matrix);
  VueComponentFactory.Instance.registerComponent(
    "survey-matrix-row",
    MatrixRow
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-matrix-cell",
    MatrixCell
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-matrixdropdown",
    MatrixDropdown
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-matrixtable",
    MatrixTable
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-matrixheaderrequired",
    MatrixHeaderRequired
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-matrixdropdown-cell",
    MatrixDropdownCellComp
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-matrixdynamic",
    MatrixDynamic
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-matrix-remove-button",
    RemoveButton
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-matrix-drag-drop-icon",
    DragDropIcon
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-matrix-detail-button",
    DetailButton
  );

  VueComponentFactory.Instance.registerComponent(
    "survey-paneldynamic",
    PanelDynamic
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-paneldynamicprogress",
    PanelDynamicProgress
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-paneldynamicprogress-v2",
    PanelDynamicProgressV2
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-add-btn",
    PaneldynamicAddBtn
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-next-btn",
    PaneldynamicNextBtn
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-prev-btn",
    PaneldynamicPrevBtn
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-remove-btn",
    PaneldynamicRemoveBtn
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-progress-text",
    PaneldynamicProgressText
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-components-container",
    Container
  );

  VueComponentFactory.Instance.registerComponent(
    "sv-progress-buttons",
    ProgressButtonsComponent
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-navigation-toc",
    ProgressToc
  );
  VueComponentFactory.Instance.registerComponent("sv-progress-pages", Progress);
  VueComponentFactory.Instance.registerComponent(
    "sv-progress-questions",
    Progress
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-progress-correctquestions",
    Progress
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-progress-requiredquestions",
    Progress
  );

  VueComponentFactory.Instance.registerComponent("survey-errors", Errors);
  VueComponentFactory.Instance.registerComponent(
    "survey-question-comment",
    QuestionComment
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-element-title",
    TitleElement
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-element-title-content",
    TitleContent
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-title-actions",
    TitleActions
  );
  VueComponentFactory.Instance.registerComponent("sv-brand-info", BrandInfo);
  VueComponentFactory.Instance.registerComponent(
    "sv-question-error",
    QuestionError
  );
  VueComponentFactory.Instance.registerComponent("sv-svg-icon", SvgIcon);

  VueComponentFactory.Instance.registerComponent("sv-action-bar", ActionBar);
  VueComponentFactory.Instance.registerComponent("sv-action", Action);
  VueComponentFactory.Instance.registerComponent(
    "sv-action-bar-item",
    ActionBarItem
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-action-bar-item-dropdown",
    ActionBarItemDropdown
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-action-bar-separator",
    ActionBarSeparator
  );

  VueComponentFactory.Instance.registerComponent("sv-list", List);
  VueComponentFactory.Instance.registerComponent(
    "sv-list-item-content",
    ListItemContent
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-list-item-group",
    ListItemGroup
  );
  VueComponentFactory.Instance.registerComponent("sv-list-item", ListItem);

  VueComponentFactory.Instance.registerComponent("sv-popup", Popup);
  VueComponentFactory.Instance.registerComponent(
    "sv-popup-container",
    PopupContainer
  );
  VueComponentFactory.Instance.registerComponent("popup-pointer", PopupPointer);

  VueComponentFactory.Instance.registerComponent("sv-notifier", Notifier);
  VueComponentFactory.Instance.registerComponent(
    "survey-other-choice",
    OtherChoice
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-nav-btn",
    SurveyNavigationButton
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-customwidget",
    CustomWidget
  );
  VueComponentFactory.Instance.registerComponent(
    "survey-popup-modal",
    PopupModal
  );

  VueComponentFactory.Instance.registerComponent(
    "sv-character-counter",
    CharacterCounterComponent
  );

  VueComponentFactory.Instance.registerComponent("survey-composite", Composite);
  VueComponentFactory.Instance.registerComponent("survey-custom", Custom);
  VueComponentFactory.Instance.registerComponent("sv-timerpanel", TimerPanel);
  VueComponentFactory.Instance.registerComponent(
    "sv-loading-indicator",
    LoadingIndicator
  );

  VueComponentFactory.Instance.registerComponent("sv-header", Header);
  VueComponentFactory.Instance.registerComponent("sv-header-cell", HeaderCell);
  VueComponentFactory.Instance.registerComponent(
    "sv-header-mobile",
    HeaderMobile
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-template-renderer",
    TemplateRenderer
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-template-renderer",
    TemplateRenderer
  );

  VueComponentFactory.Instance.registerComponent("survey-element", Element);

  VueComponentFactory.Instance.registerComponent(
    "survey-buttongroup",
    ButtonGroup
  );
  VueComponentFactory.Instance.registerComponent(
    "sv-button-group-item",
    ButtonGroupItem
  );

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
