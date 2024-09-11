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

export { useBase, useLocString, useQuestion, useComputedArray } from "./base";
export { ComponentFactory };
export { key2ClickDirective } from "./directives/key2click";
export { default as SvComponent } from "./SvComponent.vue";
export { PopupSurvey as PopupSurveyComponent };
export { SurveyVue as SurveyComponent };

SurveyModel.platform = "vue3";

function registerComponents() {
  ComponentFactory.Instance.registerComponent("sv-svg-bundle", SvgBundle);
  ComponentFactory.Instance.registerComponent("popup-survey", PopupSurvey);
  ComponentFactory.Instance.registerComponent("survey-header", HeaderBasic);
  ComponentFactory.Instance.registerComponent("sv-logo-image", Logo);
  ComponentFactory.Instance.registerComponent("survey-page", Page);
  ComponentFactory.Instance.registerComponent("survey-row", Row);
  ComponentFactory.Instance.registerComponent("survey-question", Question);
  ComponentFactory.Instance.registerComponent("survey-panel", Panel);
  ComponentFactory.Instance.registerComponent(
    "survey-element-header",
    ElementHeader
  );
  ComponentFactory.Instance.registerComponent("survey-string", String);
  ComponentFactory.Instance.registerComponent("sv-string-viewer", StringViewer);
  ComponentFactory.Instance.registerComponent("sv-string-editor", StringEditor);
  ComponentFactory.Instance.registerComponent("sv-skeleton", Skeleton);
  ComponentFactory.Instance.registerComponent("survey-text", QuestionText);
  ComponentFactory.Instance.registerComponent(
    "survey-text-input",
    QuestionTextInput
  );
  ComponentFactory.Instance.registerComponent("survey-checkbox", Checkbox);
  ComponentFactory.Instance.registerComponent(
    "survey-checkbox-item",
    CheckboxItem
  );
  ComponentFactory.Instance.registerComponent("survey-radiogroup", Radiogroup);
  ComponentFactory.Instance.registerComponent(
    "survey-radiogroup-item",
    RadiogroupItem
  );
  ComponentFactory.Instance.registerComponent(
    "survey-signaturepad",
    Signaturepad
  );
  ComponentFactory.Instance.registerComponent("survey-html", Html);
  ComponentFactory.Instance.registerComponent("survey-image", Image);
  ComponentFactory.Instance.registerComponent("survey-expression", Expression);
  ComponentFactory.Instance.registerComponent("survey-file", File);
  ComponentFactory.Instance.registerComponent(
    "sv-file-choose-btn",
    FileChooseButton
  );
  ComponentFactory.Instance.registerComponent(
    "sv-file-clean-btn",
    FileCleanButton
  );
  ComponentFactory.Instance.registerComponent("sv-file-preview", FilePreview);
  ComponentFactory.Instance.registerComponent("sv-file-video", FileVideo);
  ComponentFactory.Instance.registerComponent(
    "survey-imagepicker",
    ImagePicker
  );
  ComponentFactory.Instance.registerComponent(
    "survey-imagepicker-item",
    ImagePickerItem
  );
  ComponentFactory.Instance.registerComponent("survey-comment", Comment);
  ComponentFactory.Instance.registerComponent("survey-dropdown", Dropdown);
  ComponentFactory.Instance.registerComponent(
    "sv-dropdown-select",
    DropdownSelect
  );
  ComponentFactory.Instance.registerComponent(
    "sv-dropdown-option-item",
    DropdownOptionItem
  );
  ComponentFactory.Instance.registerComponent("sv-dropdown", DropdownInput);
  ComponentFactory.Instance.registerComponent("survey-tagbox", Tagbox);
  ComponentFactory.Instance.registerComponent("sv-tagbox", TagboxInput);
  ComponentFactory.Instance.registerComponent("sv-tagbox-item", TagboxItem);
  ComponentFactory.Instance.registerComponent("sv-tagbox-filter", TagboxFilter);
  ComponentFactory.Instance.registerComponent("survey-ranking", Ranking);
  ComponentFactory.Instance.registerComponent(
    "survey-ranking-item",
    RankingItem
  );
  ComponentFactory.Instance.registerComponent(
    "sv-ranking-item",
    RankingItemContent
  );
  ComponentFactory.Instance.registerComponent("survey-rating", Rating);
  ComponentFactory.Instance.registerComponent("sv-rating-item", RatingItem);
  ComponentFactory.Instance.registerComponent(
    "sv-rating-item-smiley",
    RatingItemSmiley
  );
  ComponentFactory.Instance.registerComponent(
    "sv-rating-item-star",
    RatingItemStar
  );
  ComponentFactory.Instance.registerComponent(
    "sv-rating-dropdown",
    RatingDropdown
  );
  ComponentFactory.Instance.registerComponent(
    "sv-rating-dropdown-item",
    RatingDropdownItem
  );
  ComponentFactory.Instance.registerComponent("survey-boolean", BooleanSwitch);
  ComponentFactory.Instance.registerComponent("sv-boolean-radio", BooleanRadio);
  ComponentFactory.Instance.registerComponent(
    "sv-boolean-radio-item",
    BooleanRadioItem
  );
  ComponentFactory.Instance.registerComponent(
    "sv-boolean-checkbox",
    BooleanCheckbox
  );
  ComponentFactory.Instance.registerComponent(
    "survey-multipletext",
    MultipleText
  );
  ComponentFactory.Instance.registerComponent(
    "survey-multipletext-item",
    MultipletextItem
  );

  ComponentFactory.Instance.registerComponent("survey-matrix", Matrix);
  ComponentFactory.Instance.registerComponent("survey-matrix-row", MatrixRow);
  ComponentFactory.Instance.registerComponent("survey-matrix-cell", MatrixCell);
  ComponentFactory.Instance.registerComponent(
    "survey-matrixdropdown",
    MatrixDropdown
  );
  ComponentFactory.Instance.registerComponent(
    "survey-matrixtable",
    MatrixTable
  );
  ComponentFactory.Instance.registerComponent(
    "survey-matrixheaderrequired",
    MatrixHeaderRequired
  );
  ComponentFactory.Instance.registerComponent(
    "survey-matrixdropdown-cell",
    MatrixDropdownCellComp
  );
  ComponentFactory.Instance.registerComponent(
    "survey-matrixdynamic",
    MatrixDynamic
  );
  ComponentFactory.Instance.registerComponent(
    "sv-matrix-remove-button",
    RemoveButton
  );
  ComponentFactory.Instance.registerComponent(
    "sv-matrix-drag-drop-icon",
    DragDropIcon
  );
  ComponentFactory.Instance.registerComponent(
    "sv-matrix-detail-button",
    DetailButton
  );

  ComponentFactory.Instance.registerComponent(
    "survey-paneldynamic",
    PanelDynamic
  );
  ComponentFactory.Instance.registerComponent(
    "survey-paneldynamicprogress",
    PanelDynamicProgress
  );
  ComponentFactory.Instance.registerComponent(
    "survey-paneldynamicprogress-v2",
    PanelDynamicProgressV2
  );
  ComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-add-btn",
    PaneldynamicAddBtn
  );
  ComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-next-btn",
    PaneldynamicNextBtn
  );
  ComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-prev-btn",
    PaneldynamicPrevBtn
  );
  ComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-remove-btn",
    PaneldynamicRemoveBtn
  );
  ComponentFactory.Instance.registerComponent(
    "sv-paneldynamic-progress-text",
    PaneldynamicProgressText
  );
  ComponentFactory.Instance.registerComponent(
    "sv-components-container",
    Container
  );

  ComponentFactory.Instance.registerComponent(
    "sv-progress-buttons",
    ProgressButtonsComponent
  );
  ComponentFactory.Instance.registerComponent("sv-navigation-toc", ProgressToc);
  ComponentFactory.Instance.registerComponent("sv-progress-pages", Progress);
  ComponentFactory.Instance.registerComponent(
    "sv-progress-questions",
    Progress
  );
  ComponentFactory.Instance.registerComponent(
    "sv-progress-correctquestions",
    Progress
  );
  ComponentFactory.Instance.registerComponent(
    "sv-progress-requiredquestions",
    Progress
  );

  ComponentFactory.Instance.registerComponent("survey-errors", Errors);
  ComponentFactory.Instance.registerComponent(
    "survey-question-comment",
    QuestionComment
  );
  ComponentFactory.Instance.registerComponent(
    "survey-element-title",
    TitleElement
  );
  ComponentFactory.Instance.registerComponent(
    "survey-element-title-content",
    TitleContent
  );
  ComponentFactory.Instance.registerComponent("sv-title-actions", TitleActions);
  ComponentFactory.Instance.registerComponent("sv-brand-info", BrandInfo);
  ComponentFactory.Instance.registerComponent(
    "sv-question-error",
    QuestionError
  );
  ComponentFactory.Instance.registerComponent("sv-svg-icon", SvgIcon);

  ComponentFactory.Instance.registerComponent("sv-action-bar", ActionBar);
  ComponentFactory.Instance.registerComponent("sv-action", Action);
  ComponentFactory.Instance.registerComponent(
    "sv-action-bar-item",
    ActionBarItem
  );
  ComponentFactory.Instance.registerComponent(
    "sv-action-bar-item-dropdown",
    ActionBarItemDropdown
  );
  ComponentFactory.Instance.registerComponent(
    "sv-action-bar-separator",
    ActionBarSeparator
  );

  ComponentFactory.Instance.registerComponent("sv-list", List);
  ComponentFactory.Instance.registerComponent(
    "sv-list-item-content",
    ListItemContent
  );
  ComponentFactory.Instance.registerComponent(
    "sv-list-item-group",
    ListItemGroup
  );
  ComponentFactory.Instance.registerComponent("sv-list-item", ListItem);

  ComponentFactory.Instance.registerComponent("sv-popup", Popup);
  ComponentFactory.Instance.registerComponent(
    "sv-popup-container",
    PopupContainer
  );
  ComponentFactory.Instance.registerComponent("popup-pointer", PopupPointer);

  ComponentFactory.Instance.registerComponent("sv-notifier", Notifier);
  ComponentFactory.Instance.registerComponent(
    "survey-other-choice",
    OtherChoice
  );
  ComponentFactory.Instance.registerComponent(
    "sv-nav-btn",
    SurveyNavigationButton
  );
  ComponentFactory.Instance.registerComponent(
    "survey-customwidget",
    CustomWidget
  );
  ComponentFactory.Instance.registerComponent("survey-popup-modal", PopupModal);

  ComponentFactory.Instance.registerComponent(
    "sv-character-counter",
    CharacterCounterComponent
  );

  ComponentFactory.Instance.registerComponent("survey-composite", Composite);
  ComponentFactory.Instance.registerComponent("survey-custom", Custom);
  ComponentFactory.Instance.registerComponent("sv-timerpanel", TimerPanel);
  ComponentFactory.Instance.registerComponent(
    "sv-loading-indicator",
    LoadingIndicator
  );
  ComponentFactory.Instance.registerComponent("sv-header", Header);
  ComponentFactory.Instance.registerComponent("sv-header-cell", HeaderCell);
  ComponentFactory.Instance.registerComponent("sv-header-mobile", HeaderMobile);
  ComponentFactory.Instance.registerComponent(
    "sv-template-renderer",
    TemplateRenderer
  );
  ComponentFactory.Instance.registerComponent(
    "sv-template-renderer",
    TemplateRenderer
  );
  ComponentFactory.Instance.registerComponent(
    "sv-character-counter",
    CharacterCounterComponent
  );
  ComponentFactory.Instance.registerComponent(
    "sv-text-area",
    TextAreaComponent
  );
  ComponentFactory.Instance.registerComponent("survey-element", Element);

  ComponentFactory.Instance.registerComponent(
    "survey-buttongroup",
    ButtonGroup
  );
  ComponentFactory.Instance.registerComponent(
    "sv-button-group-item",
    ButtonGroupItem
  );
  ComponentFactory.Instance.registerComponent("survey", SurveyVue);
}
registerComponents();

export const surveyPlugin = {
  install(app: App) {
    app.component("SurveyComponent", SurveyVue);
    app.component("survey", SurveyVue);
    app.component("PopupSurveyComponent", PopupSurvey);
  },
};
