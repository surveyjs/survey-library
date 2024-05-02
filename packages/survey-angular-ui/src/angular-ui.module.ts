import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SurveyComponent } from "./survey.component";
import { PopupSurveyComponent } from "./popup.survey.component";
import { PageComponent } from "./page.component";
import { QuestionComponent } from "./question.component";
import { StringViewerComponent } from "./string-viewer.component";
import { PopupPointerComponent } from "./components/popup/popup-pointer.component";
import { PopupComponent } from "./components/popup/popup.component";
import { PopupBaseContainerComponent } from "./components/popup/popup-container.component";
import { QuestionSkeletonComponent } from "./components/skeleton.component";
import { CharacterCounterComponent } from "./components/character-counter/character-counter.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { TagboxFilterComponent } from "./components/tagbox/tagbox-filter.component";
import { TagboxItemComponent } from "./components/tagbox/tagbox-item.component";
import { TagboxComponent } from "./components/tagbox/tagbox.component";
import { DropdownOptionItemComponent } from "./components/renderAs/dropdown-select/dropdown-option-item.component";
import { DropdownSelectComponent } from "./components/renderAs/dropdown-select/dropdown-select.component";
import { TextQuestionComponent } from "./questions/text.component";
import { HtmlQuestionComponent } from "./questions/html.component";
import { RadiogroupComponent } from "./questions/radiogroup.component";
import { RadiogroupItemComponent } from "./questions/radiogroup-item.component";
import { CheckboxComponent } from "./questions/checkbox.component";
import { CheckboxItemComponent } from "./questions/checkbox-item.component";
import { DropdownQuestionComponent } from "./questions/dropdown.component";
import { TagboxQuestionComponent } from "./questions/tagbox.component";
import { RatingQuestionComponent } from "./questions/rating.component";
import { BooleanQuestionComponent } from "./questions/boolean.component";
import { ImagePickerItemComponent } from "./questions/imagepicker-item.component";
import { ImagePickerQuestionComponent } from "./questions/imagepicker.component";

import { ActionBarComponent } from "./components/action-bar/action-bar.component";
import { ActionComponent } from "./components/action-bar/action.component";
import { ActionBarItemComponent } from "./components/action-bar/action-bar-item.component";
import { ActionBarItemDropdownComponent } from "./components/action-bar/action-bar-item-dropdown.component";
import { SelectBaseItemComponent } from "./questions/selectbase-item";
import { SelectBaseComponent } from "./questions/selectbase.component";
import { SurveyCommentComponent } from "./comment.component";
import { SurveyCommentOtherComponent } from "./comment-other.component";
import { ElementHeaderComponent } from "./components/element-header/element-header.component";
import { ElementTitleActionsComponent } from "./components/element-title/title-actions.component";
import { ElementTitleComponent } from "./components/element-title/element-title.component";
import { SurveyHeaderComponent } from "./components/survey-header/survey-header.component";

import { DynamicHeadComponent } from "./components/element-title/dynamic-head.component";
import { ListComponent } from "./components/list/list.component";
import { ListItemComponent } from "./components/list/list-item.component";
import { RatingItemComponent } from "./components/rating/rating-item.component";
import { RatingItemStarComponent } from "./components/rating/rating-item-star.component";
import { RatingItemSmileyComponent } from "./components/rating/rating-item-smiley.component";
import { RowComponent } from "./row.component";
import { RatingDropdownItemComponent } from "./components/renderAs/rating-dropdown/rating-dropdown-item.component";
import { RatingDropdownComponent } from "./components/renderAs/rating-dropdown/rating-dropdown.component";
import { BooleanCheckboxComponent } from "./components/renderAs/boolean-checkbox/boolean-checkbox.component";
import { BooleanRadioComponent } from "./components/renderAs/boolean-radio/boolean-radio.component";
import { BooleanRadioItemComponent } from "./components/renderAs/boolean-radio/boolean-radio-item.component";
import { ProgressDefaultComponent } from "./components/progress/default/progress.component";
import { ProgressButtonsComponent } from "./components/progress/buttons/progress.component";
import { ProgressTocComponent } from "./components/progress/toc/progress.component";
import { PanelComponent } from "./panel.component";
import { PopupService } from "./components/popup/popup.service";
import { SurveyNavigationButton } from "./components/survey-actions/survey-nav-btn.component";
import { MatrixQuestionComponent } from "./questions/matrix.component";
import { SvgIconComponent } from "./components/svg-icon/svg-icon.component";
import { FileQuestionComponent, } from "./questions/file.component";
import { VisibleDirective } from "./utils/ng-show.directive";
import { Key2ClickDirective } from "./utils/ng-key2click.directive";
import { SafeUrlPipe, SafeResourceUrlPipe } from "./utils/safe-url.pipe";
import { SafeHtmlPipe } from "./utils/safe-html.pipe";
import { CommentQuestionComponent } from "./questions/comment.component";
import { SignaturePadQuestionComponent } from "./questions/signature.component";
import { MultipleTextComponent } from "./questions/multipletext.component";
import { ErrorsComponent } from "./errors.component";
import { MultipleTextItemComponent } from "./questions/multipletextitem.component";
import { DynamicComponentDirective } from "./utils/dynamic.directive";
import { RankingQuestionComponent } from "./questions/ranking.component";
import { RankingItemComponent } from "./questions/ranking-item.component";
import { SurveyStringComponent } from "./survey-string.component";
import { StringEditorComponent } from "./string-editor.component";
import { PanelDynamicAddBtn } from "./components/paneldynamic-actions/paneldynamic-add-btn.component";
import { PanelDynamicNextBtn } from "./components/paneldynamic-actions/paneldynamic-next-btn.component";
import { PanelDynamicPrevBtn } from "./components/paneldynamic-actions/paneldynamic-prev-btn.component";
import { PanelDynamicProgressText } from "./components/paneldynamic-actions/paneldynamic-progress-text.component";
import { PanelDynamicQuestionComponent } from "./questions/paneldynamic.component";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";
import { ElementComponent } from "./element.component";
import { CustomWidgetComponent } from "./questions/customwidget.component";
import { MatrixCellComponent } from "./questions/matrixcell.component";
import { MatrixDropdownCellComponent } from "./questions/matrixdropdowncell.component";
import { MatrixTableComponent } from "./questions/matrixtable.component";
import { MatrixDropdownComponent } from "./questions/matrixdropdown.component";
import { MatrixDynamicComponent } from "./questions/matrixdynamic.component";
import { MatrixDynamicRemoveButtonComponent } from "./components/matrix-actions/remove-button/remove-button.component";
import { MatrixDynamicDragDropIconComponent } from "./components/matrix-actions/drag-drop-icon/drag-drop-icon";
import { MatrixDetailButtonComponent } from "./components/matrix-actions/detail-button/detail-button.component";
import { MatrixRequiredHeader } from "./questions/matrixrequiredheader.component";
import { ExpressionComponent } from "./questions/expression.component";
import { ImageQuestionComponent } from "./questions/image.component";
import { BrandInfoComponent } from "./components/brand-info/brand-info.component";
import { QuestionErrorComponent } from "./components/question-error/question-error.component";
import { CustomQuestionComponent } from "./questions/custom.component";
import { CompositeQuestionComponent } from "./questions/composite.component";
import { SurveyContentComponent } from "./survey-content.component";
import { TemplateRendererComponent } from "./template-renderer.component";
import { ModalComponent } from "./components/popup/modal-container.component";
import { ButtonGroupQuestionComponent } from "./questions/button-group/button-group.component";
import { ButtonGroupItemComponent } from "./questions/button-group/button-group-item.component";
import { MatrixRowComponent } from "./questions/matrix-row.component";
import { LogoImageComponent } from "./components/survey-header/logo-image.component";
import { SkeletonComponent } from "./components/skeleton/skeleton.component";
import { PaneldynamicRemoveButtonComponent } from "./components/paneldynamic-actions/paneldynamic-remove-btn.component";
import { TimerPanelComponent } from "./components/timer-panel/timer-panel.component";
import { NotifierComponent } from "./components/notifier/notifier.component";
import { ComponentsContainerComponent } from "./components-container.component";
import { MultipleTextRowComponent } from "./questions/multipletextrow.component";
import { LoadingIndicatorComponent } from "./angular-ui";
import { HeaderComponent } from "./components/header/header.component";
import { HeaderCellComponent } from "./components/header/header-cell.component";
import { HeaderMobileComponent } from "./components/header/header-mobile.component";
import { ChooseFileBtn } from "./components/file/choose-file.component";
import { FilePreviewComponent } from "./components/file/file-preview.component";
import { SvgBundleComponent } from "./svgbundle.component";

@NgModule({
  declarations: [
    VisibleDirective, Key2ClickDirective, PanelDynamicAddBtn, PanelDynamicNextBtn, PanelDynamicPrevBtn, PanelDynamicProgressText, ElementComponent, TemplateRendererComponent,
    SurveyComponent, SurveyContentComponent, PopupSurveyComponent, PageComponent, PanelComponent, QuestionComponent, StringViewerComponent, SurveyStringComponent, StringEditorComponent,
    QuestionSkeletonComponent, TextQuestionComponent, RadiogroupComponent, RadiogroupItemComponent, CheckboxComponent, CheckboxItemComponent,
    DropdownComponent, DropdownQuestionComponent, DropdownSelectComponent, DropdownOptionItemComponent,
    PopupComponent, PopupBaseContainerComponent, PopupPointerComponent,
    CharacterCounterComponent, ListComponent, ListItemComponent, RatingItemComponent, RatingItemStarComponent, RatingItemSmileyComponent,
    TagboxFilterComponent, TagboxComponent, TagboxQuestionComponent, TagboxItemComponent,
    ActionBarComponent, ActionComponent, ActionBarItemComponent, ActionBarItemDropdownComponent, HtmlQuestionComponent,
    SelectBaseItemComponent, SelectBaseComponent, SurveyCommentComponent, SurveyCommentOtherComponent, ElementHeaderComponent, ElementTitleActionsComponent, ElementTitleComponent, DynamicHeadComponent, RowComponent,
    RatingQuestionComponent, RatingDropdownItemComponent, RatingDropdownComponent, BooleanQuestionComponent, BooleanCheckboxComponent, BooleanRadioComponent, BooleanRadioItemComponent, ImagePickerItemComponent, ImagePickerQuestionComponent, ImageQuestionComponent,
    SurveyHeaderComponent, ProgressDefaultComponent, ProgressButtonsComponent, ProgressTocComponent, SurveyNavigationButton, MatrixQuestionComponent, SvgIconComponent, FileQuestionComponent, SafeUrlPipe, SafeHtmlPipe, CommentQuestionComponent, SignaturePadQuestionComponent, ErrorsComponent,
    MultipleTextComponent, MultipleTextItemComponent, DynamicComponentDirective, RankingQuestionComponent, RankingItemComponent, PanelDynamicQuestionComponent, EmbeddedViewContentComponent, CustomWidgetComponent,
    MatrixCellComponent, MatrixDropdownCellComponent, MatrixTableComponent, MatrixDropdownComponent,
    MatrixDynamicComponent, MatrixDetailButtonComponent, MatrixDynamicRemoveButtonComponent, MatrixDynamicDragDropIconComponent, MatrixRequiredHeader, ExpressionComponent, SafeResourceUrlPipe, BrandInfoComponent, QuestionErrorComponent,
    CustomQuestionComponent, CompositeQuestionComponent, ButtonGroupItemComponent, ButtonGroupQuestionComponent, MatrixRowComponent, ModalComponent, LogoImageComponent, SkeletonComponent, TimerPanelComponent, PaneldynamicRemoveButtonComponent,
    NotifierComponent, ComponentsContainerComponent, MultipleTextRowComponent, LoadingIndicatorComponent, HeaderComponent, HeaderCellComponent, HeaderMobileComponent, ChooseFileBtn, FilePreviewComponent, SvgBundleComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    VisibleDirective, Key2ClickDirective, PanelDynamicAddBtn, PanelDynamicNextBtn, PanelDynamicPrevBtn, PanelDynamicProgressText, ElementComponent, TemplateRendererComponent,
    SurveyComponent, SurveyContentComponent, PopupSurveyComponent, PageComponent, PanelComponent, QuestionComponent, StringViewerComponent, SurveyStringComponent, StringEditorComponent,
    QuestionSkeletonComponent, TextQuestionComponent, RadiogroupComponent, RadiogroupItemComponent, CheckboxComponent, CheckboxItemComponent,
    CharacterCounterComponent,
    DropdownComponent, DropdownQuestionComponent, DropdownSelectComponent, DropdownOptionItemComponent,
    PopupComponent, PopupBaseContainerComponent, PopupPointerComponent,
    CharacterCounterComponent, ListComponent, ListItemComponent, RatingItemComponent, RatingItemStarComponent, RatingItemSmileyComponent,
    TagboxFilterComponent, TagboxComponent, TagboxQuestionComponent, TagboxItemComponent,
    ActionBarComponent, ActionComponent, ActionBarItemComponent, ActionBarItemDropdownComponent, HtmlQuestionComponent,
    SelectBaseItemComponent, SelectBaseComponent, SurveyCommentComponent, SurveyCommentOtherComponent, ElementHeaderComponent, ElementTitleComponent, DynamicHeadComponent, RowComponent,
    RatingQuestionComponent, RatingDropdownItemComponent, RatingDropdownComponent, BooleanQuestionComponent, BooleanCheckboxComponent, BooleanRadioComponent, BooleanRadioItemComponent, ImagePickerItemComponent, ImagePickerQuestionComponent, ImageQuestionComponent,
    SurveyHeaderComponent, ProgressDefaultComponent, ProgressButtonsComponent, SurveyNavigationButton, MatrixQuestionComponent, SvgIconComponent, FileQuestionComponent, SafeUrlPipe, SafeHtmlPipe, CommentQuestionComponent, SignaturePadQuestionComponent, ErrorsComponent,
    MultipleTextComponent, MultipleTextItemComponent, DynamicComponentDirective, RankingQuestionComponent, RankingItemComponent, PanelDynamicQuestionComponent, EmbeddedViewContentComponent, CustomWidgetComponent,
    MatrixCellComponent, MatrixDropdownCellComponent, MatrixTableComponent, MatrixDropdownComponent,
    MatrixDynamicComponent, MatrixDetailButtonComponent, MatrixDynamicRemoveButtonComponent, MatrixDynamicDragDropIconComponent, MatrixRequiredHeader, ExpressionComponent, SafeResourceUrlPipe,
    CustomQuestionComponent, CompositeQuestionComponent, ButtonGroupQuestionComponent, ModalComponent, LogoImageComponent, SkeletonComponent, TimerPanelComponent, PaneldynamicRemoveButtonComponent,
    NotifierComponent, ComponentsContainerComponent, MultipleTextRowComponent, LoadingIndicatorComponent, HeaderComponent, HeaderCellComponent, HeaderMobileComponent, FilePreviewComponent, SvgBundleComponent
  ],
  providers: [PopupService],
})
export class SurveyModule { }
