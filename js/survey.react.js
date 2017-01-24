/*!
* surveyjs - Survey JavaScript library v0.10.3
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define("Survey", ["react"], factory);
	else if(typeof exports === 'object')
		exports["Survey"] = factory(require("react"));
	else
		root["Survey"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_38__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.__extends = exports.QuestionFactory = exports.ReactQuestionFactory = exports.SurveyWindow = exports.SurveyQuestionRating = exports.SurveyProgress = exports.SurveyQuestionMatrixDynamicRow = exports.SurveyQuestionMatrixDynamic = exports.SurveyQuestionText = exports.SurveyQuestionRadiogroup = exports.SurveyQuestionMultipleTextItem = exports.SurveyQuestionMultipleText = exports.SurveyQuestionFile = exports.SurveyQuestionHtml = exports.SurveyQuestionMatrixRow = exports.SurveyQuestionMatrix = exports.SurveyQuestionMatrixDropdownRow = exports.SurveyQuestionMatrixDropdown = exports.SurveyQuestionDropdown = exports.SurveyQuestionCheckboxItem = exports.SurveyQuestionCheckbox = exports.SurveyQuestionComment = exports.SurveyQuestionCommentItem = exports.SurveyQuestionElementBase = exports.SurveyElementBase = exports.SurveyQuestionErrors = exports.SurveyQuestion = exports.SurveyRow = exports.SurveyPage = exports.SurveyNavigation = exports.SurveyNavigationBase = exports.Model = exports.ReactSurveyModel = exports.Survey = exports.defaultBootstrapCss = exports.defaultStandardCss = undefined;
	
	var _model = __webpack_require__(1);
	
	Object.keys(_model).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _model[key];
	    }
	  });
	});
	
	var _cssstandard = __webpack_require__(35);
	
	Object.defineProperty(exports, "defaultStandardCss", {
	  enumerable: true,
	  get: function get() {
	    return _cssstandard.defaultStandardCss;
	  }
	});
	
	var _cssbootstrap = __webpack_require__(36);
	
	Object.defineProperty(exports, "defaultBootstrapCss", {
	  enumerable: true,
	  get: function get() {
	    return _cssbootstrap.defaultBootstrapCss;
	  }
	});
	
	var _reactSurvey = __webpack_require__(37);
	
	Object.defineProperty(exports, "Survey", {
	  enumerable: true,
	  get: function get() {
	    return _reactSurvey.Survey;
	  }
	});
	
	var _reactsurveymodel = __webpack_require__(39);
	
	Object.defineProperty(exports, "ReactSurveyModel", {
	  enumerable: true,
	  get: function get() {
	    return _reactsurveymodel.ReactSurveyModel;
	  }
	});
	Object.defineProperty(exports, "Model", {
	  enumerable: true,
	  get: function get() {
	    return _reactsurveymodel.ReactSurveyModel;
	  }
	});
	
	var _reactSurveyNavigationBase = __webpack_require__(46);
	
	Object.defineProperty(exports, "SurveyNavigationBase", {
	  enumerable: true,
	  get: function get() {
	    return _reactSurveyNavigationBase.SurveyNavigationBase;
	  }
	});
	
	var _reactSurveyNavigation = __webpack_require__(45);
	
	Object.defineProperty(exports, "SurveyNavigation", {
	  enumerable: true,
	  get: function get() {
	    return _reactSurveyNavigation.SurveyNavigation;
	  }
	});
	
	var _reactpage = __webpack_require__(40);
	
	Object.defineProperty(exports, "SurveyPage", {
	  enumerable: true,
	  get: function get() {
	    return _reactpage.SurveyPage;
	  }
	});
	Object.defineProperty(exports, "SurveyRow", {
	  enumerable: true,
	  get: function get() {
	    return _reactpage.SurveyRow;
	  }
	});
	
	var _reactquestion = __webpack_require__(41);
	
	Object.defineProperty(exports, "SurveyQuestion", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestion.SurveyQuestion;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionErrors", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestion.SurveyQuestionErrors;
	  }
	});
	
	var _reactquestionelement = __webpack_require__(43);
	
	Object.defineProperty(exports, "SurveyElementBase", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionelement.SurveyElementBase;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionElementBase", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionelement.SurveyQuestionElementBase;
	  }
	});
	
	var _reactquestioncomment = __webpack_require__(42);
	
	Object.defineProperty(exports, "SurveyQuestionCommentItem", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestioncomment.SurveyQuestionCommentItem;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionComment", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestioncomment.SurveyQuestionComment;
	  }
	});
	
	var _reactquestioncheckbox = __webpack_require__(48);
	
	Object.defineProperty(exports, "SurveyQuestionCheckbox", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestioncheckbox.SurveyQuestionCheckbox;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionCheckboxItem", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestioncheckbox.SurveyQuestionCheckboxItem;
	  }
	});
	
	var _reactquestiondropdown = __webpack_require__(49);
	
	Object.defineProperty(exports, "SurveyQuestionDropdown", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestiondropdown.SurveyQuestionDropdown;
	  }
	});
	
	var _reactquestionmatrixdropdown = __webpack_require__(50);
	
	Object.defineProperty(exports, "SurveyQuestionMatrixDropdown", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmatrixdropdown.SurveyQuestionMatrixDropdown;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionMatrixDropdownRow", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmatrixdropdown.SurveyQuestionMatrixDropdownRow;
	  }
	});
	
	var _reactquestionmatrix = __webpack_require__(51);
	
	Object.defineProperty(exports, "SurveyQuestionMatrix", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmatrix.SurveyQuestionMatrix;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionMatrixRow", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmatrix.SurveyQuestionMatrixRow;
	  }
	});
	
	var _reactquestionhtml = __webpack_require__(52);
	
	Object.defineProperty(exports, "SurveyQuestionHtml", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionhtml.SurveyQuestionHtml;
	  }
	});
	
	var _reactquestionfile = __webpack_require__(53);
	
	Object.defineProperty(exports, "SurveyQuestionFile", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionfile.SurveyQuestionFile;
	  }
	});
	
	var _reactquestionmultipletext = __webpack_require__(54);
	
	Object.defineProperty(exports, "SurveyQuestionMultipleText", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmultipletext.SurveyQuestionMultipleText;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionMultipleTextItem", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmultipletext.SurveyQuestionMultipleTextItem;
	  }
	});
	
	var _reactquestionradiogroup = __webpack_require__(55);
	
	Object.defineProperty(exports, "SurveyQuestionRadiogroup", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionradiogroup.SurveyQuestionRadiogroup;
	  }
	});
	
	var _reactquestiontext = __webpack_require__(56);
	
	Object.defineProperty(exports, "SurveyQuestionText", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestiontext.SurveyQuestionText;
	  }
	});
	
	var _reactquestionmatrixdynamic = __webpack_require__(57);
	
	Object.defineProperty(exports, "SurveyQuestionMatrixDynamic", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmatrixdynamic.SurveyQuestionMatrixDynamic;
	  }
	});
	Object.defineProperty(exports, "SurveyQuestionMatrixDynamicRow", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionmatrixdynamic.SurveyQuestionMatrixDynamicRow;
	  }
	});
	
	var _reactSurveyProgress = __webpack_require__(47);
	
	Object.defineProperty(exports, "SurveyProgress", {
	  enumerable: true,
	  get: function get() {
	    return _reactSurveyProgress.SurveyProgress;
	  }
	});
	
	var _reactquestionrating = __webpack_require__(58);
	
	Object.defineProperty(exports, "SurveyQuestionRating", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionrating.SurveyQuestionRating;
	  }
	});
	
	var _reactSurveyWindow = __webpack_require__(59);
	
	Object.defineProperty(exports, "SurveyWindow", {
	  enumerable: true,
	  get: function get() {
	    return _reactSurveyWindow.SurveyWindow;
	  }
	});
	
	var _reactquestionfactory = __webpack_require__(44);
	
	Object.defineProperty(exports, "ReactQuestionFactory", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionfactory.ReactQuestionFactory;
	  }
	});
	Object.defineProperty(exports, "QuestionFactory", {
	  enumerable: true,
	  get: function get() {
	    return _reactquestionfactory.ReactQuestionFactory;
	  }
	});
	
	var _extends = __webpack_require__(3);
	
	Object.defineProperty(exports, "__extends", {
	  enumerable: true,
	  get: function get() {
	    return _extends.__extends;
	  }
	});
	
	__webpack_require__(60);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _validator = __webpack_require__(2);
	
	Object.defineProperty(exports, "AnswerCountValidator", {
	  enumerable: true,
	  get: function get() {
	    return _validator.AnswerCountValidator;
	  }
	});
	Object.defineProperty(exports, "EmailValidator", {
	  enumerable: true,
	  get: function get() {
	    return _validator.EmailValidator;
	  }
	});
	Object.defineProperty(exports, "NumericValidator", {
	  enumerable: true,
	  get: function get() {
	    return _validator.NumericValidator;
	  }
	});
	Object.defineProperty(exports, "RegexValidator", {
	  enumerable: true,
	  get: function get() {
	    return _validator.RegexValidator;
	  }
	});
	Object.defineProperty(exports, "SurveyValidator", {
	  enumerable: true,
	  get: function get() {
	    return _validator.SurveyValidator;
	  }
	});
	Object.defineProperty(exports, "TextValidator", {
	  enumerable: true,
	  get: function get() {
	    return _validator.TextValidator;
	  }
	});
	Object.defineProperty(exports, "ValidatorResult", {
	  enumerable: true,
	  get: function get() {
	    return _validator.ValidatorResult;
	  }
	});
	Object.defineProperty(exports, "ValidatorRunner", {
	  enumerable: true,
	  get: function get() {
	    return _validator.ValidatorRunner;
	  }
	});
	
	var _base = __webpack_require__(4);
	
	Object.defineProperty(exports, "Base", {
	  enumerable: true,
	  get: function get() {
	    return _base.Base;
	  }
	});
	Object.defineProperty(exports, "Event", {
	  enumerable: true,
	  get: function get() {
	    return _base.Event;
	  }
	});
	Object.defineProperty(exports, "ItemValue", {
	  enumerable: true,
	  get: function get() {
	    return _base.ItemValue;
	  }
	});
	Object.defineProperty(exports, "SurveyError", {
	  enumerable: true,
	  get: function get() {
	    return _base.SurveyError;
	  }
	});
	
	var _choicesRestfull = __webpack_require__(8);
	
	Object.defineProperty(exports, "ChoicesRestfull", {
	  enumerable: true,
	  get: function get() {
	    return _choicesRestfull.ChoicesRestfull;
	  }
	});
	
	var _conditions = __webpack_require__(9);
	
	Object.defineProperty(exports, "Condition", {
	  enumerable: true,
	  get: function get() {
	    return _conditions.Condition;
	  }
	});
	Object.defineProperty(exports, "ConditionNode", {
	  enumerable: true,
	  get: function get() {
	    return _conditions.ConditionNode;
	  }
	});
	Object.defineProperty(exports, "ConditionRunner", {
	  enumerable: true,
	  get: function get() {
	    return _conditions.ConditionRunner;
	  }
	});
	
	var _conditionsParser = __webpack_require__(10);
	
	Object.defineProperty(exports, "ConditionsParser", {
	  enumerable: true,
	  get: function get() {
	    return _conditionsParser.ConditionsParser;
	  }
	});
	
	var _conditionProcessValue = __webpack_require__(11);
	
	Object.defineProperty(exports, "ProcessValue", {
	  enumerable: true,
	  get: function get() {
	    return _conditionProcessValue.ProcessValue;
	  }
	});
	
	var _error = __webpack_require__(5);
	
	Object.defineProperty(exports, "CustomError", {
	  enumerable: true,
	  get: function get() {
	    return _error.CustomError;
	  }
	});
	Object.defineProperty(exports, "ExceedSizeError", {
	  enumerable: true,
	  get: function get() {
	    return _error.ExceedSizeError;
	  }
	});
	Object.defineProperty(exports, "RequreNumericError", {
	  enumerable: true,
	  get: function get() {
	    return _error.RequreNumericError;
	  }
	});
	
	var _jsonobject = __webpack_require__(7);
	
	Object.defineProperty(exports, "JsonError", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonError;
	  }
	});
	Object.defineProperty(exports, "JsonIncorrectTypeError", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonIncorrectTypeError;
	  }
	});
	Object.defineProperty(exports, "JsonMetadata", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonMetadata;
	  }
	});
	Object.defineProperty(exports, "JsonMetadataClass", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonMetadataClass;
	  }
	});
	Object.defineProperty(exports, "JsonMissingTypeError", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonMissingTypeError;
	  }
	});
	Object.defineProperty(exports, "JsonMissingTypeErrorBase", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonMissingTypeErrorBase;
	  }
	});
	Object.defineProperty(exports, "JsonObject", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonObject;
	  }
	});
	Object.defineProperty(exports, "JsonObjectProperty", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonObjectProperty;
	  }
	});
	Object.defineProperty(exports, "JsonRequiredPropertyError", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonRequiredPropertyError;
	  }
	});
	Object.defineProperty(exports, "JsonUnknownPropertyError", {
	  enumerable: true,
	  get: function get() {
	    return _jsonobject.JsonUnknownPropertyError;
	  }
	});
	
	var _question_matrixdropdownbase = __webpack_require__(12);
	
	Object.defineProperty(exports, "MatrixDropdownCell", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdropdownbase.MatrixDropdownCell;
	  }
	});
	Object.defineProperty(exports, "MatrixDropdownColumn", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdropdownbase.MatrixDropdownColumn;
	  }
	});
	Object.defineProperty(exports, "MatrixDropdownRowModelBase", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdropdownbase.MatrixDropdownRowModelBase;
	  }
	});
	Object.defineProperty(exports, "QuestionMatrixDropdownModelBase", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdropdownbase.QuestionMatrixDropdownModelBase;
	  }
	});
	
	var _question_matrixdropdown = __webpack_require__(18);
	
	Object.defineProperty(exports, "MatrixDropdownRowModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdropdown.MatrixDropdownRowModel;
	  }
	});
	Object.defineProperty(exports, "QuestionMatrixDropdownModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdropdown.QuestionMatrixDropdownModel;
	  }
	});
	
	var _question_matrixdynamic = __webpack_require__(19);
	
	Object.defineProperty(exports, "MatrixDynamicRowModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdynamic.MatrixDynamicRowModel;
	  }
	});
	Object.defineProperty(exports, "QuestionMatrixDynamicModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrixdynamic.QuestionMatrixDynamicModel;
	  }
	});
	
	var _question_matrix = __webpack_require__(20);
	
	Object.defineProperty(exports, "MatrixRowModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrix.MatrixRowModel;
	  }
	});
	Object.defineProperty(exports, "QuestionMatrixModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_matrix.QuestionMatrixModel;
	  }
	});
	
	var _question_multipletext = __webpack_require__(21);
	
	Object.defineProperty(exports, "MultipleTextItemModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_multipletext.MultipleTextItemModel;
	  }
	});
	Object.defineProperty(exports, "QuestionMultipleTextModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_multipletext.QuestionMultipleTextModel;
	  }
	});
	
	var _page = __webpack_require__(22);
	
	Object.defineProperty(exports, "PageModel", {
	  enumerable: true,
	  get: function get() {
	    return _page.PageModel;
	  }
	});
	Object.defineProperty(exports, "QuestionRowModel", {
	  enumerable: true,
	  get: function get() {
	    return _page.QuestionRowModel;
	  }
	});
	
	var _question = __webpack_require__(13);
	
	Object.defineProperty(exports, "Question", {
	  enumerable: true,
	  get: function get() {
	    return _question.Question;
	  }
	});
	
	var _questionbase = __webpack_require__(14);
	
	Object.defineProperty(exports, "QuestionBase", {
	  enumerable: true,
	  get: function get() {
	    return _questionbase.QuestionBase;
	  }
	});
	
	var _question_baseselect = __webpack_require__(16);
	
	Object.defineProperty(exports, "QuestionCheckboxBase", {
	  enumerable: true,
	  get: function get() {
	    return _question_baseselect.QuestionCheckboxBase;
	  }
	});
	Object.defineProperty(exports, "QuestionSelectBase", {
	  enumerable: true,
	  get: function get() {
	    return _question_baseselect.QuestionSelectBase;
	  }
	});
	
	var _question_checkbox = __webpack_require__(23);
	
	Object.defineProperty(exports, "QuestionCheckboxModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_checkbox.QuestionCheckboxModel;
	  }
	});
	
	var _question_comment = __webpack_require__(24);
	
	Object.defineProperty(exports, "QuestionCommentModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_comment.QuestionCommentModel;
	  }
	});
	
	var _question_dropdown = __webpack_require__(25);
	
	Object.defineProperty(exports, "QuestionDropdownModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_dropdown.QuestionDropdownModel;
	  }
	});
	
	var _questionfactory = __webpack_require__(17);
	
	Object.defineProperty(exports, "QuestionFactory", {
	  enumerable: true,
	  get: function get() {
	    return _questionfactory.QuestionFactory;
	  }
	});
	
	var _question_file = __webpack_require__(26);
	
	Object.defineProperty(exports, "QuestionFileModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_file.QuestionFileModel;
	  }
	});
	
	var _question_html = __webpack_require__(27);
	
	Object.defineProperty(exports, "QuestionHtmlModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_html.QuestionHtmlModel;
	  }
	});
	
	var _question_radiogroup = __webpack_require__(28);
	
	Object.defineProperty(exports, "QuestionRadiogroupModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_radiogroup.QuestionRadiogroupModel;
	  }
	});
	
	var _question_rating = __webpack_require__(29);
	
	Object.defineProperty(exports, "QuestionRatingModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_rating.QuestionRatingModel;
	  }
	});
	
	var _question_text = __webpack_require__(30);
	
	Object.defineProperty(exports, "QuestionTextModel", {
	  enumerable: true,
	  get: function get() {
	    return _question_text.QuestionTextModel;
	  }
	});
	
	var _survey = __webpack_require__(31);
	
	Object.defineProperty(exports, "SurveyModel", {
	  enumerable: true,
	  get: function get() {
	    return _survey.SurveyModel;
	  }
	});
	
	var _trigger = __webpack_require__(33);
	
	Object.defineProperty(exports, "SurveyTrigger", {
	  enumerable: true,
	  get: function get() {
	    return _trigger.SurveyTrigger;
	  }
	});
	Object.defineProperty(exports, "SurveyTriggerComplete", {
	  enumerable: true,
	  get: function get() {
	    return _trigger.SurveyTriggerComplete;
	  }
	});
	Object.defineProperty(exports, "SurveyTriggerSetValue", {
	  enumerable: true,
	  get: function get() {
	    return _trigger.SurveyTriggerSetValue;
	  }
	});
	Object.defineProperty(exports, "SurveyTriggerVisible", {
	  enumerable: true,
	  get: function get() {
	    return _trigger.SurveyTriggerVisible;
	  }
	});
	Object.defineProperty(exports, "Trigger", {
	  enumerable: true,
	  get: function get() {
	    return _trigger.Trigger;
	  }
	});
	
	var _surveyWindow = __webpack_require__(34);
	
	Object.defineProperty(exports, "SurveyWindowModel", {
	  enumerable: true,
	  get: function get() {
	    return _surveyWindow.SurveyWindowModel;
	  }
	});
	
	var _textPreProcessor = __webpack_require__(15);
	
	Object.defineProperty(exports, "TextPreProcessor", {
	  enumerable: true,
	  get: function get() {
	    return _textPreProcessor.TextPreProcessor;
	  }
	});
	
	var _dxSurveyService = __webpack_require__(32);
	
	Object.defineProperty(exports, "dxSurveyService", {
	  enumerable: true,
	  get: function get() {
	    return _dxSurveyService.dxSurveyService;
	  }
	});
	
	var _surveyStrings = __webpack_require__(6);
	
	Object.defineProperty(exports, "surveyLocalization", {
	  enumerable: true,
	  get: function get() {
	    return _surveyStrings.surveyLocalization;
	  }
	});
	Object.defineProperty(exports, "surveyStrings", {
	  enumerable: true,
	  get: function get() {
	    return _surveyStrings.surveyStrings;
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.EmailValidator = exports.RegexValidator = exports.AnswerCountValidator = exports.TextValidator = exports.NumericValidator = exports.ValidatorRunner = exports.SurveyValidator = exports.ValidatorResult = undefined;
	
	var _base = __webpack_require__(4);
	
	var _error = __webpack_require__(5);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _jsonobject = __webpack_require__(7);
	
	var ValidatorResult = exports.ValidatorResult = function () {
	    function ValidatorResult(value, error) {
	        if (error === void 0) {
	            error = null;
	        }
	        this.value = value;
	        this.error = error;
	    }
	    return ValidatorResult;
	}();
	var SurveyValidator = exports.SurveyValidator = function (_super) {
	    __extends(SurveyValidator, _super);
	    function SurveyValidator() {
	        _super.call(this);
	        this.text = "";
	    }
	    SurveyValidator.prototype.getErrorText = function (name) {
	        if (this.text) return this.text;
	        return this.getDefaultErrorText(name);
	    };
	    SurveyValidator.prototype.getDefaultErrorText = function (name) {
	        return "";
	    };
	    SurveyValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        return null;
	    };
	    return SurveyValidator;
	}(_base.Base);
	var ValidatorRunner = exports.ValidatorRunner = function () {
	    function ValidatorRunner() {}
	    ValidatorRunner.prototype.run = function (owner) {
	        for (var i = 0; i < owner.validators.length; i++) {
	            var validatorResult = owner.validators[i].validate(owner.value, owner.getValidatorTitle());
	            if (validatorResult != null) {
	                if (validatorResult.error) return validatorResult.error;
	                if (validatorResult.value) {
	                    owner.value = validatorResult.value;
	                }
	            }
	        }
	        return null;
	    };
	    return ValidatorRunner;
	}();
	var NumericValidator = exports.NumericValidator = function (_super) {
	    __extends(NumericValidator, _super);
	    function NumericValidator(minValue, maxValue) {
	        if (minValue === void 0) {
	            minValue = null;
	        }
	        if (maxValue === void 0) {
	            maxValue = null;
	        }
	        _super.call(this);
	        this.minValue = minValue;
	        this.maxValue = maxValue;
	    }
	    NumericValidator.prototype.getType = function () {
	        return "numericvalidator";
	    };
	    NumericValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (!value || !this.isNumber(value)) {
	            return new ValidatorResult(null, new _error.RequreNumericError());
	        }
	        var result = new ValidatorResult(parseFloat(value));
	        if (this.minValue && this.minValue > result.value) {
	            result.error = new _error.CustomError(this.getErrorText(name));
	            return result;
	        }
	        if (this.maxValue && this.maxValue < result.value) {
	            result.error = new _error.CustomError(this.getErrorText(name));
	            return result;
	        }
	        return typeof value === 'number' ? null : result;
	    };
	    NumericValidator.prototype.getDefaultErrorText = function (name) {
	        var vName = name ? name : "value";
	        if (this.minValue && this.maxValue) {
	            return _surveyStrings.surveyLocalization.getString("numericMinMax")["format"](vName, this.minValue, this.maxValue);
	        } else {
	            if (this.minValue) {
	                return _surveyStrings.surveyLocalization.getString("numericMin")["format"](vName, this.minValue);
	            }
	            return _surveyStrings.surveyLocalization.getString("numericMax")["format"](vName, this.maxValue);
	        }
	    };
	    NumericValidator.prototype.isNumber = function (value) {
	        return !isNaN(parseFloat(value)) && isFinite(value);
	    };
	    return NumericValidator;
	}(SurveyValidator);
	var TextValidator = exports.TextValidator = function (_super) {
	    __extends(TextValidator, _super);
	    function TextValidator(minLength) {
	        if (minLength === void 0) {
	            minLength = 0;
	        }
	        _super.call(this);
	        this.minLength = minLength;
	    }
	    TextValidator.prototype.getType = function () {
	        return "textvalidator";
	    };
	    TextValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (this.minLength <= 0) return;
	        if (value.length < this.minLength) {
	            return new ValidatorResult(null, new _error.CustomError(this.getErrorText(name)));
	        }
	        return null;
	    };
	    TextValidator.prototype.getDefaultErrorText = function (name) {
	        return _surveyStrings.surveyLocalization.getString("textMinLength")["format"](this.minLength);
	    };
	    return TextValidator;
	}(SurveyValidator);
	var AnswerCountValidator = exports.AnswerCountValidator = function (_super) {
	    __extends(AnswerCountValidator, _super);
	    function AnswerCountValidator(minCount, maxCount) {
	        if (minCount === void 0) {
	            minCount = null;
	        }
	        if (maxCount === void 0) {
	            maxCount = null;
	        }
	        _super.call(this);
	        this.minCount = minCount;
	        this.maxCount = maxCount;
	    }
	    AnswerCountValidator.prototype.getType = function () {
	        return "answercountvalidator";
	    };
	    AnswerCountValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (value == null || value.constructor != Array) return null;
	        var count = value.length;
	        if (this.minCount && count < this.minCount) {
	            return new ValidatorResult(null, new _error.CustomError(this.getErrorText(_surveyStrings.surveyLocalization.getString("minSelectError")["format"](this.minCount))));
	        }
	        if (this.maxCount && count > this.maxCount) {
	            return new ValidatorResult(null, new _error.CustomError(this.getErrorText(_surveyStrings.surveyLocalization.getString("maxSelectError")["format"](this.maxCount))));
	        }
	        return null;
	    };
	    AnswerCountValidator.prototype.getDefaultErrorText = function (name) {
	        return name;
	    };
	    return AnswerCountValidator;
	}(SurveyValidator);
	var RegexValidator = exports.RegexValidator = function (_super) {
	    __extends(RegexValidator, _super);
	    function RegexValidator(regex) {
	        if (regex === void 0) {
	            regex = null;
	        }
	        _super.call(this);
	        this.regex = regex;
	    }
	    RegexValidator.prototype.getType = function () {
	        return "regexvalidator";
	    };
	    RegexValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (!this.regex || !value) return null;
	        var re = new RegExp(this.regex);
	        if (re.test(value)) return null;
	        return new ValidatorResult(value, new _error.CustomError(this.getErrorText(name)));
	    };
	    return RegexValidator;
	}(SurveyValidator);
	var EmailValidator = exports.EmailValidator = function (_super) {
	    __extends(EmailValidator, _super);
	    function EmailValidator() {
	        _super.call(this);
	        this.re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	    }
	    EmailValidator.prototype.getType = function () {
	        return "emailvalidator";
	    };
	    EmailValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (!value) return null;
	        if (this.re.test(value)) return null;
	        return new ValidatorResult(value, new _error.CustomError(this.getErrorText(name)));
	    };
	    EmailValidator.prototype.getDefaultErrorText = function (name) {
	        return _surveyStrings.surveyLocalization.getString("invalidEmail");
	    };
	    return EmailValidator;
	}(SurveyValidator);
	_jsonobject.JsonObject.metaData.addClass("surveyvalidator", ["text"]);
	_jsonobject.JsonObject.metaData.addClass("numericvalidator", ["minValue:number", "maxValue:number"], function () {
	    return new NumericValidator();
	}, "surveyvalidator");
	_jsonobject.JsonObject.metaData.addClass("textvalidator", ["minLength:number"], function () {
	    return new TextValidator();
	}, "surveyvalidator");
	_jsonobject.JsonObject.metaData.addClass("answercountvalidator", ["minCount:number", "maxCount:number"], function () {
	    return new AnswerCountValidator();
	}, "surveyvalidator");
	_jsonobject.JsonObject.metaData.addClass("regexvalidator", ["regex"], function () {
	    return new RegexValidator();
	}, "surveyvalidator");
	_jsonobject.JsonObject.metaData.addClass("emailvalidator", [], function () {
	    return new EmailValidator();
	}, "surveyvalidator");
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.__extends = __extends;
	function __extends(d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}
	if (typeof module !== 'undefined' && module.exports) {
	    exports = module.exports = __extends;
	}
	exports.__extends = __extends;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var ItemValue = exports.ItemValue = function () {
	    function ItemValue(value, text) {
	        if (text === void 0) {
	            text = null;
	        }
	        this.text = text;
	        this.value = value;
	    }
	    ItemValue.setData = function (items, values) {
	        items.length = 0;
	        for (var i = 0; i < values.length; i++) {
	            var value = values[i];
	            var item = new ItemValue(null);
	            if (typeof value.value !== 'undefined') {
	                var exception = null;
	                if (typeof value.getType !== 'undefined' && value.getType() == 'itemvalue') {
	                    value.itemValue = value.itemValue;
	                    item.itemText = value.itemText;
	                    exception = ItemValue.itemValueProp;
	                }
	                ItemValue.copyAttributes(value, item, exception);
	            } else {
	                item.value = value;
	            }
	            items.push(item);
	        }
	    };
	    ItemValue.getData = function (items) {
	        var result = new Array();
	        for (var i = 0; i < items.length; i++) {
	            var item = items[i];
	            if (item.hasText) {
	                result.push({ value: item.value, text: item.text });
	            } else {
	                result.push(item.value);
	            }
	        }
	        return result;
	    };
	    ItemValue.getItemByValue = function (items, val) {
	        for (var i = 0; i < items.length; i++) {
	            if (items[i].value == val) return items[i];
	        }
	        return null;
	    };
	    ItemValue.copyAttributes = function (src, dest, exceptons) {
	        for (var key in src) {
	            if (typeof src[key] == 'function') continue;
	            if (exceptons && exceptons.indexOf(key) > -1) continue;
	            dest[key] = src[key];
	        }
	    };
	    ItemValue.prototype.getType = function () {
	        return "itemvalue";
	    };
	    Object.defineProperty(ItemValue.prototype, "value", {
	        get: function get() {
	            return this.itemValue;
	        },
	        set: function set(newValue) {
	            this.itemValue = newValue;
	            if (!this.itemValue) return;
	            var str = this.itemValue.toString();
	            var index = str.indexOf(ItemValue.Separator);
	            if (index > -1) {
	                this.itemValue = str.slice(0, index);
	                this.text = str.slice(index + 1);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ItemValue.prototype, "hasText", {
	        get: function get() {
	            return this.itemText ? true : false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ItemValue.prototype, "text", {
	        get: function get() {
	            if (this.hasText) return this.itemText;
	            if (this.value) return this.value.toString();
	            return null;
	        },
	        set: function set(newText) {
	            this.itemText = newText;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ItemValue.Separator = '|';
	    ItemValue.itemValueProp = ["text", "value", "hasText"];
	    return ItemValue;
	}();
	var Base = exports.Base = function () {
	    function Base() {}
	    Base.prototype.getType = function () {
	        throw new Error('This method is abstract');
	    };
	    return Base;
	}();
	var SurveyError = exports.SurveyError = function () {
	    function SurveyError() {}
	    SurveyError.prototype.getText = function () {
	        throw new Error('This method is abstract');
	    };
	    return SurveyError;
	}();
	var SurveyPageId = exports.SurveyPageId = "sq_page";
	var SurveyElement = exports.SurveyElement = function () {
	    function SurveyElement() {}
	    SurveyElement.ScrollElementToTop = function (elementId) {
	        if (!elementId) return false;
	        var el = document.getElementById(elementId);
	        if (!el || !el.scrollIntoView) return false;
	        var elemTop = el.getBoundingClientRect().top;
	        if (elemTop < 0) el.scrollIntoView();
	        return elemTop < 0;
	    };
	    SurveyElement.FocusElement = function (elementId) {
	        if (!elementId) return false;
	        var el = document.getElementById(elementId);
	        if (el) {
	            el.focus();
	            return true;
	        }
	        return false;
	    };
	    return SurveyElement;
	}();
	var Event = exports.Event = function () {
	    function Event() {}
	    Object.defineProperty(Event.prototype, "isEmpty", {
	        get: function get() {
	            return this.callbacks == null || this.callbacks.length == 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Event.prototype.fire = function (sender, options) {
	        if (this.callbacks == null) return;
	        for (var i = 0; i < this.callbacks.length; i++) {
	            var callResult = this.callbacks[i](sender, options);
	        }
	    };
	    Event.prototype.add = function (func) {
	        if (this.callbacks == null) {
	            this.callbacks = new Array();
	        }
	        this.callbacks.push(func);
	    };
	    Event.prototype.remove = function (func) {
	        if (this.callbacks == null) return;
	        var index = this.callbacks.indexOf(func, 0);
	        if (index != undefined) {
	            this.callbacks.splice(index, 1);
	        }
	    };
	    return Event;
	}();

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.CustomError = exports.ExceedSizeError = exports.RequreNumericError = exports.AnswerRequiredError = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var _base = __webpack_require__(4);
	
	var AnswerRequiredError = exports.AnswerRequiredError = function (_super) {
	    __extends(AnswerRequiredError, _super);
	    function AnswerRequiredError() {
	        _super.call(this);
	    }
	    AnswerRequiredError.prototype.getText = function () {
	        return _surveyStrings.surveyLocalization.getString("requiredError");
	    };
	    return AnswerRequiredError;
	}(_base.SurveyError);
	var RequreNumericError = exports.RequreNumericError = function (_super) {
	    __extends(RequreNumericError, _super);
	    function RequreNumericError() {
	        _super.call(this);
	    }
	    RequreNumericError.prototype.getText = function () {
	        return _surveyStrings.surveyLocalization.getString("numericError");
	    };
	    return RequreNumericError;
	}(_base.SurveyError);
	var ExceedSizeError = exports.ExceedSizeError = function (_super) {
	    __extends(ExceedSizeError, _super);
	    function ExceedSizeError(maxSize) {
	        _super.call(this);
	        this.maxSize = maxSize;
	    }
	    ExceedSizeError.prototype.getText = function () {
	        return _surveyStrings.surveyLocalization.getString("exceedMaxSize")["format"](this.getTextSize());
	    };
	    ExceedSizeError.prototype.getTextSize = function () {
	        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	        var fixed = [0, 0, 2, 3, 3];
	        if (this.maxSize == 0) return '0 Byte';
	        var i = Math.floor(Math.log(this.maxSize) / Math.log(1024));
	        var value = this.maxSize / Math.pow(1024, i);
	        return value.toFixed(fixed[i]) + ' ' + sizes[i];
	    };
	    return ExceedSizeError;
	}(_base.SurveyError);
	var CustomError = exports.CustomError = function (_super) {
	    __extends(CustomError, _super);
	    function CustomError(text) {
	        _super.call(this);
	        this.text = text;
	    }
	    CustomError.prototype.getText = function () {
	        return this.text;
	    };
	    return CustomError;
	}(_base.SurveyError);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var surveyLocalization = exports.surveyLocalization = {
	    currentLocale: "",
	    locales: {},
	    getString: function getString(strName) {
	        var loc = this.currentLocale ? this.locales[this.currentLocale] : surveyStrings;
	        if (!loc || !loc[strName]) loc = surveyStrings;
	        return loc[strName];
	    },
	    getLocales: function getLocales() {
	        var res = [];
	        res.push("");
	        for (var key in this.locales) {
	            res.push(key);
	        }
	        res.sort();
	        return res;
	    }
	};
	var surveyStrings = exports.surveyStrings = {
	    pagePrevText: "Previous",
	    pageNextText: "Next",
	    completeText: "Complete",
	    otherItemText: "Other (describe)",
	    progressText: "Page {0} of {1}",
	    emptySurvey: "There is no any visible page or visible question in the survey.",
	    completingSurvey: "Thank You for Completing the Survey!",
	    loadingSurvey: "Survey is loading from the server...",
	    optionsCaption: "Choose...",
	    requiredError: "Please answer the question.",
	    requiredInAllRowsError: "Please answer questions in all rows.",
	    numericError: "The value should be a numeric.",
	    textMinLength: "Please enter at least {0} symbols.",
	    minRowCountError: "Please fill at least {0} rows.",
	    minSelectError: "Please select at least {0} variants.",
	    maxSelectError: "Please select not more than {0} variants.",
	    numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
	    numericMin: "The '{0}' should be equal or more than {1}",
	    numericMax: "The '{0}' should be equal or less than {1}",
	    invalidEmail: "Please enter a valid e-mail.",
	    urlRequestError: "The request return error '{0}'. {1}",
	    urlGetChoicesError: "The request returns empty data or the 'path' property is incorrect",
	    exceedMaxSize: "The file size should not exceed {0}.",
	    otherRequiredError: "Please enter the others value.",
	    uploadingFile: "Your file is uploading. Please wait several seconds and try again.",
	    addRow: "Add Row",
	    removeRow: "Remove"
	};
	surveyLocalization.locales["en"] = surveyStrings;
	if (!String.prototype["format"]) {
	    String.prototype["format"] = function () {
	        var args = arguments;
	        return this.replace(/{(\d+)}/g, function (match, number) {
	            return typeof args[number] != 'undefined' ? args[number] : match;
	        });
	    };
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var JsonObjectProperty = exports.JsonObjectProperty = function () {
	    function JsonObjectProperty(name) {
	        this.name = name;
	        this.typeValue = null;
	        this.choicesValue = null;
	        this.choicesfunc = null;
	        this.className = null;
	        this.classNamePart = null;
	        this.baseClassName = null;
	        this.defaultValue = null;
	        this.onGetValue = null;
	    }
	    Object.defineProperty(JsonObjectProperty.prototype, "type", {
	        get: function get() {
	            return this.typeValue ? this.typeValue : "string";
	        },
	        set: function set(value) {
	            this.typeValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(JsonObjectProperty.prototype, "hasToUseGetValue", {
	        get: function get() {
	            return this.onGetValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    JsonObjectProperty.prototype.isDefaultValue = function (value) {
	        return this.defaultValue ? this.defaultValue == value : !value;
	    };
	    JsonObjectProperty.prototype.getValue = function (obj) {
	        if (this.onGetValue) return this.onGetValue(obj);
	        return null;
	    };
	    Object.defineProperty(JsonObjectProperty.prototype, "hasToUseSetValue", {
	        get: function get() {
	            return this.onSetValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    JsonObjectProperty.prototype.setValue = function (obj, value, jsonConv) {
	        if (this.onSetValue) {
	            this.onSetValue(obj, value, jsonConv);
	        }
	    };
	    JsonObjectProperty.prototype.getObjType = function (objType) {
	        if (!this.classNamePart) return objType;
	        return objType.replace(this.classNamePart, "");
	    };
	    JsonObjectProperty.prototype.getClassName = function (className) {
	        return this.classNamePart && className.indexOf(this.classNamePart) < 0 ? className + this.classNamePart : className;
	    };
	    Object.defineProperty(JsonObjectProperty.prototype, "choices", {
	        get: function get() {
	            if (this.choicesValue != null) return this.choicesValue;
	            if (this.choicesfunc != null) return this.choicesfunc();
	            return null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    JsonObjectProperty.prototype.setChoices = function (value, valueFunc) {
	        this.choicesValue = value;
	        this.choicesfunc = valueFunc;
	    };
	    return JsonObjectProperty;
	}();
	var JsonMetadataClass = exports.JsonMetadataClass = function () {
	    function JsonMetadataClass(name, properties, creator, parentName) {
	        if (creator === void 0) {
	            creator = null;
	        }
	        if (parentName === void 0) {
	            parentName = null;
	        }
	        this.name = name;
	        this.creator = creator;
	        this.parentName = parentName;
	        this.properties = null;
	        this.requiredProperties = null;
	        this.properties = new Array();
	        for (var i = 0; i < properties.length; i++) {
	            var prop = this.createProperty(properties[i]);
	            if (prop) {
	                this.properties.push(prop);
	            }
	        }
	    }
	    JsonMetadataClass.prototype.find = function (name) {
	        for (var i = 0; i < this.properties.length; i++) {
	            if (this.properties[i].name == name) return this.properties[i];
	        }
	        return null;
	    };
	    JsonMetadataClass.prototype.createProperty = function (propInfo) {
	        var propertyName = typeof propInfo === "string" ? propInfo : propInfo.name;
	        if (!propertyName) return;
	        var propertyType = null;
	        var typeIndex = propertyName.indexOf(JsonMetadataClass.typeSymbol);
	        if (typeIndex > -1) {
	            propertyType = propertyName.substring(typeIndex + 1);
	            propertyName = propertyName.substring(0, typeIndex);
	        }
	        propertyName = this.getPropertyName(propertyName);
	        var prop = new JsonObjectProperty(propertyName);
	        if (propertyType) {
	            prop.type = propertyType;
	        }
	        if ((typeof propInfo === "undefined" ? "undefined" : _typeof(propInfo)) === "object") {
	            if (propInfo.type) {
	                prop.type = propInfo.type;
	            }
	            if (propInfo.default) {
	                prop.defaultValue = propInfo.default;
	            }
	            if (propInfo.isRequired) {
	                this.makePropertyRequired(prop.name);
	            }
	            if (propInfo.choices) {
	                var choicesFunc = typeof propInfo.choices === "function" ? propInfo.choices : null;
	                var choicesValue = typeof propInfo.choices !== "function" ? propInfo.choices : null;
	                prop.setChoices(choicesValue, choicesFunc);
	            }
	            if (propInfo.onGetValue) {
	                prop.onGetValue = propInfo.onGetValue;
	            }
	            if (propInfo.onSetValue) {
	                prop.onSetValue = propInfo.onSetValue;
	            }
	            if (propInfo.className) {
	                prop.className = propInfo.className;
	            }
	            if (propInfo.baseClassName) {
	                prop.baseClassName = propInfo.baseClassName;
	            }
	            if (propInfo.classNamePart) {
	                prop.classNamePart = propInfo.classNamePart;
	            }
	        }
	        return prop;
	    };
	    JsonMetadataClass.prototype.getPropertyName = function (propertyName) {
	        if (propertyName.length == 0 || propertyName[0] != JsonMetadataClass.requiredSymbol) return propertyName;
	        propertyName = propertyName.slice(1);
	        this.makePropertyRequired(propertyName);
	        return propertyName;
	    };
	    JsonMetadataClass.prototype.makePropertyRequired = function (propertyName) {
	        if (!this.requiredProperties) {
	            this.requiredProperties = new Array();
	        }
	        this.requiredProperties.push(propertyName);
	    };
	    JsonMetadataClass.requiredSymbol = '!';
	    JsonMetadataClass.typeSymbol = ':';
	    return JsonMetadataClass;
	}();
	var JsonMetadata = exports.JsonMetadata = function () {
	    function JsonMetadata() {
	        this.classes = {};
	        this.childrenClasses = {};
	        this.classProperties = {};
	        this.classRequiredProperties = {};
	    }
	    JsonMetadata.prototype.addClass = function (name, properties, creator, parentName) {
	        if (creator === void 0) {
	            creator = null;
	        }
	        if (parentName === void 0) {
	            parentName = null;
	        }
	        var metaDataClass = new JsonMetadataClass(name, properties, creator, parentName);
	        this.classes[name] = metaDataClass;
	        if (parentName) {
	            var children = this.childrenClasses[parentName];
	            if (!children) {
	                this.childrenClasses[parentName] = [];
	            }
	            this.childrenClasses[parentName].push(metaDataClass);
	        }
	        return metaDataClass;
	    };
	    JsonMetadata.prototype.overrideClassCreatore = function (name, creator) {
	        var metaDataClass = this.findClass(name);
	        if (metaDataClass) {
	            metaDataClass.creator = creator;
	        }
	    };
	    JsonMetadata.prototype.getProperties = function (name) {
	        var properties = this.classProperties[name];
	        if (!properties) {
	            properties = new Array();
	            this.fillProperties(name, properties);
	            this.classProperties[name] = properties;
	        }
	        return properties;
	    };
	    JsonMetadata.prototype.createClass = function (name) {
	        var metaDataClass = this.findClass(name);
	        if (!metaDataClass) return null;
	        return metaDataClass.creator();
	    };
	    JsonMetadata.prototype.getChildrenClasses = function (name, canBeCreated) {
	        if (canBeCreated === void 0) {
	            canBeCreated = false;
	        }
	        var result = [];
	        this.fillChildrenClasses(name, canBeCreated, result);
	        return result;
	    };
	    JsonMetadata.prototype.getRequiredProperties = function (name) {
	        var properties = this.classRequiredProperties[name];
	        if (!properties) {
	            properties = new Array();
	            this.fillRequiredProperties(name, properties);
	            this.classRequiredProperties[name] = properties;
	        }
	        return properties;
	    };
	    JsonMetadata.prototype.addProperty = function (className, propertyInfo) {
	        var metaDataClass = this.findClass(className);
	        if (!metaDataClass) return;
	        var property = metaDataClass.createProperty(propertyInfo);
	        if (property) {
	            this.addPropertyToClass(metaDataClass, property);
	            this.emptyClassPropertiesHash(metaDataClass);
	        }
	    };
	    JsonMetadata.prototype.removeProperty = function (className, propertyName) {
	        var metaDataClass = this.findClass(className);
	        if (!metaDataClass) return false;
	        var property = metaDataClass.find(propertyName);
	        if (property) {
	            this.removePropertyFromClass(metaDataClass, property);
	            this.emptyClassPropertiesHash(metaDataClass);
	        }
	    };
	    JsonMetadata.prototype.addPropertyToClass = function (metaDataClass, property) {
	        if (metaDataClass.find(property.name) != null) return;
	        metaDataClass.properties.push(property);
	    };
	    JsonMetadata.prototype.removePropertyFromClass = function (metaDataClass, property) {
	        var index = metaDataClass.properties.indexOf(property);
	        if (index < 0) return;
	        metaDataClass.properties.splice(index, 1);
	        if (metaDataClass.requiredProperties) {
	            index = metaDataClass.requiredProperties.indexOf(property.name);
	            if (index >= 0) {
	                metaDataClass.requiredProperties.splice(index, 1);
	            }
	        }
	    };
	    JsonMetadata.prototype.emptyClassPropertiesHash = function (metaDataClass) {
	        this.classProperties[metaDataClass.name] = null;
	        var childClasses = this.getChildrenClasses(metaDataClass.name);
	        for (var i = 0; i < childClasses.length; i++) {
	            this.classProperties[childClasses[i].name] = null;
	        }
	    };
	    JsonMetadata.prototype.fillChildrenClasses = function (name, canBeCreated, result) {
	        var children = this.childrenClasses[name];
	        if (!children) return;
	        for (var i = 0; i < children.length; i++) {
	            if (!canBeCreated || children[i].creator) {
	                result.push(children[i]);
	            }
	            this.fillChildrenClasses(children[i].name, canBeCreated, result);
	        }
	    };
	    JsonMetadata.prototype.findClass = function (name) {
	        return this.classes[name];
	    };
	    JsonMetadata.prototype.fillProperties = function (name, list) {
	        var metaDataClass = this.findClass(name);
	        if (!metaDataClass) return;
	        if (metaDataClass.parentName) {
	            this.fillProperties(metaDataClass.parentName, list);
	        }
	        for (var i = 0; i < metaDataClass.properties.length; i++) {
	            this.addPropertyCore(metaDataClass.properties[i], list, list.length);
	        }
	    };
	    JsonMetadata.prototype.addPropertyCore = function (property, list, endIndex) {
	        var index = -1;
	        for (var i = 0; i < endIndex; i++) {
	            if (list[i].name == property.name) {
	                index = i;
	                break;
	            }
	        }
	        if (index < 0) {
	            list.push(property);
	        } else {
	            list[index] = property;
	        }
	    };
	    JsonMetadata.prototype.fillRequiredProperties = function (name, list) {
	        var metaDataClass = this.findClass(name);
	        if (!metaDataClass) return;
	        if (metaDataClass.requiredProperties) {
	            Array.prototype.push.apply(list, metaDataClass.requiredProperties);
	        }
	        if (metaDataClass.parentName) {
	            this.fillRequiredProperties(metaDataClass.parentName, list);
	        }
	    };
	    return JsonMetadata;
	}();
	var JsonError = exports.JsonError = function () {
	    function JsonError(type, message) {
	        this.type = type;
	        this.message = message;
	        this.description = "";
	        this.at = -1;
	    }
	    JsonError.prototype.getFullDescription = function () {
	        return this.message + (this.description ? "\n" + this.description : "");
	    };
	    return JsonError;
	}();
	var JsonUnknownPropertyError = exports.JsonUnknownPropertyError = function (_super) {
	    __extends(JsonUnknownPropertyError, _super);
	    function JsonUnknownPropertyError(propertyName, className) {
	        _super.call(this, "unknownproperty", "The property '" + propertyName + "' in class '" + className + "' is unknown.");
	        this.propertyName = propertyName;
	        this.className = className;
	        var properties = JsonObject.metaData.getProperties(className);
	        if (properties) {
	            this.description = "The list of available properties are: ";
	            for (var i = 0; i < properties.length; i++) {
	                if (i > 0) this.description += ", ";
	                this.description += properties[i].name;
	            }
	            this.description += '.';
	        }
	    }
	    return JsonUnknownPropertyError;
	}(JsonError);
	var JsonMissingTypeErrorBase = exports.JsonMissingTypeErrorBase = function (_super) {
	    __extends(JsonMissingTypeErrorBase, _super);
	    function JsonMissingTypeErrorBase(baseClassName, type, message) {
	        _super.call(this, type, message);
	        this.baseClassName = baseClassName;
	        this.type = type;
	        this.message = message;
	        this.description = "The following types are available: ";
	        var types = JsonObject.metaData.getChildrenClasses(baseClassName, true);
	        for (var i = 0; i < types.length; i++) {
	            if (i > 0) this.description += ", ";
	            this.description += "'" + types[i].name + "'";
	        }
	        this.description += ".";
	    }
	    return JsonMissingTypeErrorBase;
	}(JsonError);
	var JsonMissingTypeError = exports.JsonMissingTypeError = function (_super) {
	    __extends(JsonMissingTypeError, _super);
	    function JsonMissingTypeError(propertyName, baseClassName) {
	        _super.call(this, baseClassName, "missingtypeproperty", "The property type is missing in the object. Please take a look at property: '" + propertyName + "'.");
	        this.propertyName = propertyName;
	        this.baseClassName = baseClassName;
	    }
	    return JsonMissingTypeError;
	}(JsonMissingTypeErrorBase);
	var JsonIncorrectTypeError = exports.JsonIncorrectTypeError = function (_super) {
	    __extends(JsonIncorrectTypeError, _super);
	    function JsonIncorrectTypeError(propertyName, baseClassName) {
	        _super.call(this, baseClassName, "incorrecttypeproperty", "The property type is incorrect in the object. Please take a look at property: '" + propertyName + "'.");
	        this.propertyName = propertyName;
	        this.baseClassName = baseClassName;
	    }
	    return JsonIncorrectTypeError;
	}(JsonMissingTypeErrorBase);
	var JsonRequiredPropertyError = exports.JsonRequiredPropertyError = function (_super) {
	    __extends(JsonRequiredPropertyError, _super);
	    function JsonRequiredPropertyError(propertyName, className) {
	        _super.call(this, "requiredproperty", "The property '" + propertyName + "' is required in class '" + className + "'.");
	        this.propertyName = propertyName;
	        this.className = className;
	    }
	    return JsonRequiredPropertyError;
	}(JsonError);
	var JsonObject = exports.JsonObject = function () {
	    function JsonObject() {
	        this.errors = new Array();
	    }
	    Object.defineProperty(JsonObject, "metaData", {
	        get: function get() {
	            return JsonObject.metaDataValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    JsonObject.prototype.toJsonObject = function (obj) {
	        return this.toJsonObjectCore(obj, null);
	    };
	    JsonObject.prototype.toObject = function (jsonObj, obj) {
	        if (!jsonObj) return;
	        var properties = null;
	        if (obj.getType) {
	            properties = JsonObject.metaData.getProperties(obj.getType());
	        }
	        if (!properties) return;
	        for (var key in jsonObj) {
	            if (key == JsonObject.typePropertyName) continue;
	            if (key == JsonObject.positionPropertyName) {
	                obj[key] = jsonObj[key];
	                continue;
	            }
	            var property = this.findProperty(properties, key);
	            if (!property) {
	                this.addNewError(new JsonUnknownPropertyError(key.toString(), obj.getType()), jsonObj);
	                continue;
	            }
	            this.valueToObj(jsonObj[key], obj, key, property);
	        }
	    };
	    JsonObject.prototype.toJsonObjectCore = function (obj, property) {
	        if (!obj.getType) return obj;
	        var result = {};
	        if (property != null && !property.className) {
	            result[JsonObject.typePropertyName] = property.getObjType(obj.getType());
	        }
	        var properties = JsonObject.metaData.getProperties(obj.getType());
	        for (var i = 0; i < properties.length; i++) {
	            this.valueToJson(obj, result, properties[i]);
	        }
	        return result;
	    };
	    JsonObject.prototype.valueToJson = function (obj, result, property) {
	        var value = null;
	        if (property.hasToUseGetValue) {
	            value = property.getValue(obj);
	        } else {
	            value = obj[property.name];
	        }
	        if (value === undefined || value === null) return;
	        if (property.isDefaultValue(value)) return;
	        if (this.isValueArray(value)) {
	            var arrValue = [];
	            for (var i = 0; i < value.length; i++) {
	                arrValue.push(this.toJsonObjectCore(value[i], property));
	            }
	            value = arrValue.length > 0 ? arrValue : null;
	        } else {
	            value = this.toJsonObjectCore(value, property);
	        }
	        if (!property.isDefaultValue(value)) {
	            result[property.name] = value;
	        }
	    };
	    JsonObject.prototype.valueToObj = function (value, obj, key, property) {
	        if (value == null) return;
	        if (property != null && property.hasToUseSetValue) {
	            property.setValue(obj, value, this);
	            return;
	        }
	        if (this.isValueArray(value)) {
	            this.valueToArray(value, obj, key, property);
	            return;
	        }
	        var newObj = this.createNewObj(value, property);
	        if (newObj.newObj) {
	            this.toObject(value, newObj.newObj);
	            value = newObj.newObj;
	        }
	        if (!newObj.error) {
	            obj[key] = value;
	        }
	    };
	    JsonObject.prototype.isValueArray = function (value) {
	        return value && value.constructor.toString().indexOf("Array") > -1;
	    };
	    JsonObject.prototype.createNewObj = function (value, property) {
	        var result = { newObj: null, error: null };
	        var className = value[JsonObject.typePropertyName];
	        if (!className && property != null && property.className) {
	            className = property.className;
	        }
	        className = property.getClassName(className);
	        result.newObj = className ? JsonObject.metaData.createClass(className) : null;
	        result.error = this.checkNewObjectOnErrors(result.newObj, value, property, className);
	        return result;
	    };
	    JsonObject.prototype.checkNewObjectOnErrors = function (newObj, value, property, className) {
	        var error = null;
	        if (newObj) {
	            var requiredProperties = JsonObject.metaData.getRequiredProperties(className);
	            if (requiredProperties) {
	                for (var i = 0; i < requiredProperties.length; i++) {
	                    if (!value[requiredProperties[i]]) {
	                        error = new JsonRequiredPropertyError(requiredProperties[i], className);
	                        break;
	                    }
	                }
	            }
	        } else {
	            if (property.baseClassName) {
	                if (!className) {
	                    error = new JsonMissingTypeError(property.name, property.baseClassName);
	                } else {
	                    error = new JsonIncorrectTypeError(property.name, property.baseClassName);
	                }
	            }
	        }
	        if (error) {
	            this.addNewError(error, value);
	        }
	        return error;
	    };
	    JsonObject.prototype.addNewError = function (error, jsonObj) {
	        if (jsonObj && jsonObj[JsonObject.positionPropertyName]) {
	            error.at = jsonObj[JsonObject.positionPropertyName].start;
	        }
	        this.errors.push(error);
	    };
	    JsonObject.prototype.valueToArray = function (value, obj, key, property) {
	        if (!this.isValueArray(obj[key])) {
	            obj[key] = [];
	        }
	        for (var i = 0; i < value.length; i++) {
	            var newValue = this.createNewObj(value[i], property);
	            if (newValue.newObj) {
	                obj[key].push(newValue.newObj);
	                this.toObject(value[i], newValue.newObj);
	            } else {
	                if (!newValue.error) {
	                    obj[key].push(value[i]);
	                }
	            }
	        }
	    };
	    JsonObject.prototype.findProperty = function (properties, key) {
	        if (!properties) return null;
	        for (var i = 0; i < properties.length; i++) {
	            if (properties[i].name == key) return properties[i];
	        }
	        return null;
	    };
	    JsonObject.typePropertyName = "type";
	    JsonObject.positionPropertyName = "pos";
	    JsonObject.metaDataValue = new JsonMetadata();
	    return JsonObject;
	}();
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.ChoicesRestfull = undefined;
	
	var _base = __webpack_require__(4);
	
	var _jsonobject = __webpack_require__(7);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _error = __webpack_require__(5);
	
	var ChoicesRestfull = exports.ChoicesRestfull = function (_super) {
	    __extends(ChoicesRestfull, _super);
	    function ChoicesRestfull() {
	        _super.call(this);
	        this.url = "";
	        this.path = "";
	        this.valueName = "";
	        this.titleName = "";
	        this.error = null;
	    }
	    ChoicesRestfull.prototype.run = function () {
	        if (!this.url || !this.getResultCallback) return;
	        this.error = null;
	        var xhr = new XMLHttpRequest();
	        xhr.open('GET', this.url);
	        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        var self = this;
	        xhr.onload = function () {
	            if (xhr.status == 200) {
	                self.onLoad(JSON.parse(xhr.response));
	            } else {
	                self.onError(xhr.statusText, xhr.responseText);
	            }
	        };
	        xhr.send();
	    };
	    ChoicesRestfull.prototype.getType = function () {
	        return "choicesByUrl";
	    };
	    Object.defineProperty(ChoicesRestfull.prototype, "isEmpty", {
	        get: function get() {
	            return !this.url && !this.path && !this.valueName && !this.titleName;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ChoicesRestfull.prototype.setData = function (json) {
	        this.clear();
	        if (json.url) this.url = json.url;
	        if (json.path) this.path = json.path;
	        if (json.valueName) this.valueName = json.valueName;
	        if (json.titleName) this.titleName = json.titleName;
	    };
	    ChoicesRestfull.prototype.clear = function () {
	        this.url = "";
	        this.path = "";
	        this.valueName = "";
	        this.titleName = "";
	    };
	    ChoicesRestfull.prototype.onLoad = function (result) {
	        var items = [];
	        result = this.getResultAfterPath(result);
	        if (result && result["length"]) {
	            for (var i = 0; i < result.length; i++) {
	                var itemValue = result[i];
	                if (!itemValue) continue;
	                var value = this.getValue(itemValue);
	                var title = this.getTitle(itemValue);
	                items.push(new _base.ItemValue(value, title));
	            }
	        } else {
	            this.error = new _error.CustomError(_surveyStrings.surveyLocalization.getString("urlGetChoicesError"));
	        }
	        this.getResultCallback(items);
	    };
	    ChoicesRestfull.prototype.onError = function (status, response) {
	        this.error = new _error.CustomError(_surveyStrings.surveyLocalization.getString("urlRequestError")["format"](status, response));
	        this.getResultCallback([]);
	    };
	    ChoicesRestfull.prototype.getResultAfterPath = function (result) {
	        if (!result) return result;
	        if (!this.path) return result;
	        var pathes = this.getPathes();
	        for (var i = 0; i < pathes.length; i++) {
	            result = result[pathes[i]];
	            if (!result) return null;
	        }
	        return result;
	    };
	    ChoicesRestfull.prototype.getPathes = function () {
	        var pathes = [];
	        if (this.path.indexOf(';') > -1) {
	            pathes = this.path.split(';');
	        } else {
	            pathes = this.path.split(',');
	        }
	        if (pathes.length == 0) pathes.push(this.path);
	        return pathes;
	    };
	    ChoicesRestfull.prototype.getValue = function (item) {
	        if (this.valueName) return item[this.valueName];
	        var len = Object.keys(item).length;
	        if (len < 1) return null;
	        return item[Object.keys(item)[0]];
	    };
	    ChoicesRestfull.prototype.getTitle = function (item) {
	        if (!this.titleName) return null;
	        return item[this.titleName];
	    };
	    return ChoicesRestfull;
	}(_base.Base);
	_jsonobject.JsonObject.metaData.addClass("choicesByUrl", ["url", "path", "valueName", "titleName"], function () {
	    return new ChoicesRestfull();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.ConditionRunner = exports.ConditionNode = exports.Condition = undefined;
	
	var _conditionsParser = __webpack_require__(10);
	
	var _conditionProcessValue = __webpack_require__(11);
	
	var Condition = exports.Condition = function () {
	    function Condition() {
	        this.opValue = "equal";
	    }
	    Object.defineProperty(Condition, "operators", {
	        get: function get() {
	            if (Condition.operatorsValue != null) return Condition.operatorsValue;
	            Condition.operatorsValue = {
	                empty: function empty(left, right) {
	                    return !left;
	                },
	                notempty: function notempty(left, right) {
	                    return !!left;
	                },
	                equal: function equal(left, right) {
	                    return left == right;
	                },
	                notequal: function notequal(left, right) {
	                    return left != right;
	                },
	                contains: function contains(left, right) {
	                    return left && left["indexOf"] && left.indexOf(right) > -1;
	                },
	                notcontains: function notcontains(left, right) {
	                    return !left || !left["indexOf"] || left.indexOf(right) == -1;
	                },
	                greater: function greater(left, right) {
	                    return left > right;
	                },
	                less: function less(left, right) {
	                    return left < right;
	                },
	                greaterorequal: function greaterorequal(left, right) {
	                    return left >= right;
	                },
	                lessorequal: function lessorequal(left, right) {
	                    return left <= right;
	                }
	            };
	            return Condition.operatorsValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Condition.prototype, "operator", {
	        get: function get() {
	            return this.opValue;
	        },
	        set: function set(value) {
	            if (!value) return;
	            value = value.toLowerCase();
	            if (!Condition.operators[value]) return;
	            this.opValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Condition.prototype.perform = function (left, right) {
	        if (left === void 0) {
	            left = null;
	        }
	        if (right === void 0) {
	            right = null;
	        }
	        if (!left) left = this.left;
	        if (!right) right = this.right;
	        return Condition.operators[this.operator](this.getPureValue(left), this.getPureValue(right));
	    };
	    Condition.prototype.getPureValue = function (val) {
	        if (!val || typeof val != "string") return val;
	        var str = "";
	        if (val.length > 0 && (val[0] == "'" || val[0] == '"')) val = val.substr(1);
	        var len = val.length;
	        if (len > 0 && (val[len - 1] == "'" || val[len - 1] == '"')) val = val.substr(0, len - 1);
	        return val;
	    };
	    Condition.operatorsValue = null;
	    return Condition;
	}();
	var ConditionNode = exports.ConditionNode = function () {
	    function ConditionNode() {
	        this.connectiveValue = "and";
	        this.children = [];
	    }
	    Object.defineProperty(ConditionNode.prototype, "connective", {
	        get: function get() {
	            return this.connectiveValue;
	        },
	        set: function set(value) {
	            if (!value) return;
	            value = value.toLowerCase();
	            if (value == "&" || value == "&&") value = "and";
	            if (value == "|" || value == "||") value = "or";
	            if (value != "and" && value != "or") return;
	            this.connectiveValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ConditionNode.prototype, "isEmpty", {
	        get: function get() {
	            return this.children.length == 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ConditionNode.prototype.clear = function () {
	        this.children = [];
	        this.connective = "and";
	    };
	    return ConditionNode;
	}();
	var ConditionRunner = exports.ConditionRunner = function () {
	    function ConditionRunner(expression) {
	        this.root = new ConditionNode();
	        this.expression = expression;
	        this.processValue = new _conditionProcessValue.ProcessValue();
	    }
	    Object.defineProperty(ConditionRunner.prototype, "expression", {
	        get: function get() {
	            return this.expressionValue;
	        },
	        set: function set(value) {
	            if (this.expression == value) return;
	            this.expressionValue = value;
	            new _conditionsParser.ConditionsParser().parse(this.expressionValue, this.root);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ConditionRunner.prototype.run = function (values) {
	        this.values = values;
	        return this.runNode(this.root);
	    };
	    ConditionRunner.prototype.runNode = function (node) {
	        var onFirstFail = node.connective == "and";
	        for (var i = 0; i < node.children.length; i++) {
	            var res = this.runNodeCondition(node.children[i]);
	            if (!res && onFirstFail) return false;
	            if (res && !onFirstFail) return true;
	        }
	        return onFirstFail;
	    };
	    ConditionRunner.prototype.runNodeCondition = function (value) {
	        if (!value) return false;
	        if (value["children"]) return this.runNode(value);
	        if (value["left"]) return this.runCondition(value);
	        return false;
	    };
	    ConditionRunner.prototype.runCondition = function (condition) {
	        var left = condition.left;
	        var name = this.getValueName(left);
	        if (name) {
	            if (!this.processValue.hasValue(name, this.values)) return false;
	            left = this.processValue.getValue(name, this.values);
	        }
	        var right = condition.right;
	        name = this.getValueName(right);
	        if (name) {
	            if (!this.processValue.hasValue(name, this.values)) return false;
	            right = this.processValue.getValue(name, this.values);
	        }
	        return condition.perform(left, right);
	    };
	    ConditionRunner.prototype.getValueName = function (nodeValue) {
	        if (!nodeValue) return null;
	        if (typeof nodeValue !== 'string') return null;
	        if (nodeValue.length < 3 || nodeValue[0] != '{' || nodeValue[nodeValue.length - 1] != '}') return null;
	        return nodeValue.substr(1, nodeValue.length - 2);
	    };
	    return ConditionRunner;
	}();

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.ConditionsParser = undefined;
	
	var _conditions = __webpack_require__(9);
	
	var ConditionsParser = exports.ConditionsParser = function () {
	    function ConditionsParser() {}
	    ConditionsParser.prototype.parse = function (text, root) {
	        this.text = text;
	        this.root = root;
	        this.root.clear();
	        this.at = 0;
	        this.length = this.text.length;
	        var res = this.parseText();
	        return res;
	    };
	    ConditionsParser.prototype.toString = function (root) {
	        this.root = root;
	        return this.nodeToString(root);
	    };
	    ConditionsParser.prototype.toStringCore = function (value) {
	        if (!value) return "";
	        if (value["children"]) return this.nodeToString(value);
	        if (value["left"]) return this.conditionToString(value);
	        return "";
	    };
	    ConditionsParser.prototype.nodeToString = function (node) {
	        if (node.isEmpty) return "";
	        var res = "";
	        for (var i = 0; i < node.children.length; i++) {
	            var nodeText = this.toStringCore(node.children[i]);
	            if (nodeText) {
	                if (res) res += ' ' + node.connective + ' ';
	                res += nodeText;
	            }
	        }
	        if (node != this.root && node.children.length > 1) {
	            res = '(' + res + ')';
	        }
	        return res;
	    };
	    ConditionsParser.prototype.conditionToString = function (condition) {
	        if (!condition.right || !condition.operator) return "";
	        var left = condition.left;
	        if (left && !this.isNumeric(left)) left = "'" + left + "'";
	        var res = left + ' ' + this.operationToString(condition.operator);
	        if (this.isNoRightOperation(condition.operator)) return res;
	        var right = condition.right;
	        if (right && !this.isNumeric(right)) right = "'" + right + "'";
	        return res + ' ' + right;
	    };
	    ConditionsParser.prototype.operationToString = function (op) {
	        if (op == "equal") return "=";
	        if (op == "notequal") return "!=";
	        if (op == "greater") return ">";
	        if (op == "less") return "<";
	        if (op == "greaterorequal") return ">=";
	        if (op == "lessorequal") return "<=";
	        return op;
	    };
	    ConditionsParser.prototype.isNumeric = function (value) {
	        var val = parseFloat(value);
	        if (isNaN(val)) return false;
	        return isFinite(val);
	    };
	    ConditionsParser.prototype.parseText = function () {
	        this.node = this.root;
	        this.expressionNodes = [];
	        this.expressionNodes.push(this.node);
	        var res = this.readConditions();
	        return res && this.at >= this.length;
	    };
	    ConditionsParser.prototype.readConditions = function () {
	        var res = this.readCondition();
	        if (!res) return res;
	        var connective = this.readConnective();
	        if (connective) {
	            this.addConnective(connective);
	            return this.readConditions();
	        }
	        return true;
	    };
	    ConditionsParser.prototype.readCondition = function () {
	        if (!this.readExpression()) return false;
	        var left = this.readString();
	        if (!left) return false;
	        var op = this.readOperator();
	        if (!op) return false;
	        var c = new _conditions.Condition();
	        c.left = left;
	        c.operator = op;
	        if (!this.isNoRightOperation(op)) {
	            var right = this.readString();
	            if (!right) return false;
	            c.right = right;
	        }
	        this.addCondition(c);
	        return true;
	    };
	    ConditionsParser.prototype.readExpression = function () {
	        this.skip();
	        if (this.at >= this.length || this.ch != '(') return true;
	        this.at++;
	        this.pushExpression();
	        var res = this.readConditions();
	        if (res) {
	            this.skip();
	            res = this.ch == ')';
	            this.at++;
	            this.popExpression();
	        }
	        return res;
	    };
	    Object.defineProperty(ConditionsParser.prototype, "ch", {
	        get: function get() {
	            return this.text.charAt(this.at);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ConditionsParser.prototype.skip = function () {
	        while (this.at < this.length && this.isSpace(this.ch)) {
	            this.at++;
	        }
	    };
	    ConditionsParser.prototype.isSpace = function (c) {
	        return c == ' ' || c == '\n' || c == '\t' || c == '\r';
	    };
	    ConditionsParser.prototype.isQuotes = function (c) {
	        return c == "'" || c == '"';
	    };
	    ConditionsParser.prototype.isOperatorChar = function (c) {
	        return c == '>' || c == '<' || c == '=' || c == '!';
	    };
	    ConditionsParser.prototype.isBrackets = function (c) {
	        return c == '(' || c == ')';
	    };
	    ConditionsParser.prototype.readString = function () {
	        this.skip();
	        if (this.at >= this.length) return null;
	        var start = this.at;
	        var hasQuotes = this.isQuotes(this.ch);
	        if (hasQuotes) this.at++;
	        var isFirstOpCh = this.isOperatorChar(this.ch);
	        while (this.at < this.length) {
	            if (!hasQuotes && this.isSpace(this.ch)) break;
	            if (this.isQuotes(this.ch)) {
	                if (hasQuotes) this.at++;
	                break;
	            }
	            if (!hasQuotes) {
	                if (isFirstOpCh != this.isOperatorChar(this.ch)) break;
	                if (this.isBrackets(this.ch)) break;
	            }
	            this.at++;
	        }
	        if (this.at <= start) return null;
	        var res = this.text.substr(start, this.at - start);
	        if (res) {
	            if (res.length > 1 && this.isQuotes(res[0])) {
	                var len = res.length - 1;
	                if (this.isQuotes(res[res.length - 1])) len--;
	                res = res.substr(1, len);
	            }
	        }
	        return res;
	    };
	    ConditionsParser.prototype.isNoRightOperation = function (op) {
	        return op == "empty" || op == "notempty";
	    };
	    ConditionsParser.prototype.readOperator = function () {
	        var op = this.readString();
	        if (!op) return null;
	        op = op.toLowerCase();
	        if (op == '>') op = "greater";
	        if (op == '<') op = "less";
	        if (op == '>=' || op == '=>') op = "greaterorequal";
	        if (op == '<=' || op == '=<') op = "lessorequal";
	        if (op == '=' || op == '==') op = "equal";
	        if (op == '<>' || op == '!=') op = "notequal";
	        if (op == 'contain') op = "contains";
	        if (op == 'notcontain') op = "notcontains";
	        return op;
	    };
	    ConditionsParser.prototype.readConnective = function () {
	        var con = this.readString();
	        if (!con) return null;
	        con = con.toLowerCase();
	        if (con == "&" || con == "&&") con = "and";
	        if (con == "|" || con == "||") con = "or";
	        if (con != "and" && con != "or") con = null;
	        return con;
	    };
	    ConditionsParser.prototype.pushExpression = function () {
	        var node = new _conditions.ConditionNode();
	        this.expressionNodes.push(node);
	        this.node = node;
	    };
	    ConditionsParser.prototype.popExpression = function () {
	        var node = this.expressionNodes.pop();
	        this.node = this.expressionNodes[this.expressionNodes.length - 1];
	        this.node.children.push(node);
	    };
	    ConditionsParser.prototype.addCondition = function (c) {
	        this.node.children.push(c);
	    };
	    ConditionsParser.prototype.addConnective = function (con) {
	        if (this.node.children.length < 2) {
	            this.node.connective = con;
	        } else {
	            if (this.node.connective != con) {
	                var oldCon = this.node.connective;
	                var oldChildren = this.node.children;
	                this.node.clear();
	                this.node.connective = con;
	                var oldNode = new _conditions.ConditionNode();
	                oldNode.connective = oldCon;
	                oldNode.children = oldChildren;
	                this.node.children.push(oldNode);
	                var newNode = new _conditions.ConditionNode();
	                this.node.children.push(newNode);
	                this.node = newNode;
	            }
	        }
	    };
	    return ConditionsParser;
	}();

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var ProcessValue = exports.ProcessValue = function () {
	    function ProcessValue() {}
	    ProcessValue.prototype.getFirstName = function (text) {
	        if (!text) return text;
	        var res = "";
	        for (var i = 0; i < text.length; i++) {
	            var ch = text[i];
	            if (ch == '.' || ch == '[') break;
	            res += ch;
	        }
	        return res;
	    };
	    ProcessValue.prototype.hasValue = function (text, values) {
	        var res = this.getValueCore(text, values);
	        return res.hasValue;
	    };
	    ProcessValue.prototype.getValue = function (text, values) {
	        var res = this.getValueCore(text, values);
	        return res.value;
	    };
	    ProcessValue.prototype.getValueCore = function (text, values) {
	        var res = { hasValue: false, value: null };
	        var curValue = values;
	        if (!curValue) return res;
	        var isFirst = true;
	        while (text && text.length > 0) {
	            var isArray = !isFirst && text[0] == '[';
	            if (!isArray) {
	                if (!isFirst) text = text.substr(1);
	                var curName = this.getFirstName(text);
	                if (!curName) return res;
	                if (!curValue[curName]) return res;
	                curValue = curValue[curName];
	                text = text.substr(curName.length);
	            } else {
	                if (!Array.isArray(curValue)) return res;
	                var index = 1;
	                var str = "";
	                while (index < text.length && text[index] != ']') {
	                    str += text[index];
	                    index++;
	                }
	                text = index < text.length ? text.substr(index + 1) : "";
	                index = this.getIntValue(str);
	                if (index < 0 || index >= curValue.length) return res;
	                curValue = curValue[index];
	            }
	            isFirst = false;
	        }
	        res.value = curValue;
	        res.hasValue = true;
	        return res;
	    };
	    ProcessValue.prototype.getIntValue = function (str) {
	        if (str == "0" || (str | 0) > 0 && str % 1 == 0) return Number(str);
	        return -1;
	    };
	    return ProcessValue;
	}();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrixDropdownModelBase = exports.MatrixDropdownRowModelBase = exports.MatrixDropdownCell = exports.MatrixDropdownColumn = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _question = __webpack_require__(13);
	
	var _base = __webpack_require__(4);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _question_baseselect = __webpack_require__(16);
	
	var _questionfactory = __webpack_require__(17);
	
	var MatrixDropdownColumn = exports.MatrixDropdownColumn = function (_super) {
	    __extends(MatrixDropdownColumn, _super);
	    function MatrixDropdownColumn(name, title) {
	        if (title === void 0) {
	            title = null;
	        }
	        _super.call(this);
	        this.name = name;
	        this.choicesValue = [];
	        this.isRequired = false;
	        this.hasOther = false;
	        this.minWidth = "";
	        this.cellType = "default";
	        this.colCountValue = -1;
	    }
	    MatrixDropdownColumn.prototype.getType = function () {
	        return "matrixdropdowncolumn";
	    };
	    Object.defineProperty(MatrixDropdownColumn.prototype, "title", {
	        get: function get() {
	            return this.titleValue ? this.titleValue : this.name;
	        },
	        set: function set(value) {
	            this.titleValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MatrixDropdownColumn.prototype, "choices", {
	        get: function get() {
	            return this.choicesValue;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.choicesValue, newValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MatrixDropdownColumn.prototype, "colCount", {
	        get: function get() {
	            return this.colCountValue;
	        },
	        set: function set(value) {
	            if (value < -1 || value > 4) return;
	            this.colCountValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return MatrixDropdownColumn;
	}(_base.Base);
	var MatrixDropdownCell = exports.MatrixDropdownCell = function () {
	    function MatrixDropdownCell(column, row, data) {
	        this.column = column;
	        this.row = row;
	        this.questionValue = data.createQuestion(this.row, this.column);
	        this.questionValue.setData(row);
	    }
	    Object.defineProperty(MatrixDropdownCell.prototype, "question", {
	        get: function get() {
	            return this.questionValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MatrixDropdownCell.prototype, "value", {
	        get: function get() {
	            return this.question.value;
	        },
	        set: function set(value) {
	            this.question.value = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return MatrixDropdownCell;
	}();
	var MatrixDropdownRowModelBase = exports.MatrixDropdownRowModelBase = function () {
	    function MatrixDropdownRowModelBase(data, value) {
	        this.rowValues = {};
	        this.rowComments = {};
	        this.isSettingValue = false;
	        this.cells = [];
	        this.data = data;
	        this.value = value;
	        this.buildCells();
	    }
	    Object.defineProperty(MatrixDropdownRowModelBase.prototype, "rowName", {
	        get: function get() {
	            return null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MatrixDropdownRowModelBase.prototype, "value", {
	        get: function get() {
	            return this.rowValues;
	        },
	        set: function set(value) {
	            this.isSettingValue = true;
	            this.rowValues = {};
	            if (value != null) {
	                for (var key in value) {
	                    this.rowValues[key] = value[key];
	                }
	            }
	            for (var i = 0; i < this.cells.length; i++) {
	                this.cells[i].question.onSurveyValueChanged(this.getValue(this.cells[i].column.name));
	            }
	            this.isSettingValue = false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MatrixDropdownRowModelBase.prototype.getValue = function (name) {
	        return this.rowValues[name];
	    };
	    MatrixDropdownRowModelBase.prototype.setValue = function (name, newValue) {
	        if (this.isSettingValue) return;
	        if (newValue === "") newValue = null;
	        if (newValue != null) {
	            this.rowValues[name] = newValue;
	        } else {
	            delete this.rowValues[name];
	        }
	        this.data.onRowChanged(this, this.value);
	    };
	    MatrixDropdownRowModelBase.prototype.getComment = function (name) {
	        return this.rowComments[name];
	    };
	    MatrixDropdownRowModelBase.prototype.setComment = function (name, newValue) {
	        this.rowComments[name] = newValue;
	    };
	    Object.defineProperty(MatrixDropdownRowModelBase.prototype, "isEmpty", {
	        get: function get() {
	            var val = this.value;
	            if (!val) return true;
	            for (var key in val) {
	                return false;
	            }return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MatrixDropdownRowModelBase.prototype.buildCells = function () {
	        var columns = this.data.columns;
	        for (var i = 0; i < columns.length; i++) {
	            var column = columns[i];
	            this.cells.push(this.createCell(column));
	        }
	    };
	    MatrixDropdownRowModelBase.prototype.createCell = function (column) {
	        return new MatrixDropdownCell(column, this, this.data);
	    };
	    return MatrixDropdownRowModelBase;
	}();
	var QuestionMatrixDropdownModelBase = exports.QuestionMatrixDropdownModelBase = function (_super) {
	    __extends(QuestionMatrixDropdownModelBase, _super);
	    function QuestionMatrixDropdownModelBase(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.columnsValue = [];
	        this.choicesValue = [];
	        this.isRowChanging = false;
	        this.cellTypeValue = "dropdown";
	        this.columnColCountValue = 0;
	        this.columnMinWidth = "";
	        this.horizontalScroll = false;
	    }
	    QuestionMatrixDropdownModelBase.prototype.getType = function () {
	        return "matrixdropdownbase";
	    };
	    Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "columns", {
	        get: function get() {
	            return this.columnsValue;
	        },
	        set: function set(value) {
	            this.columnsValue = value;
	            this.fireCallback(this.columnsChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "cellType", {
	        get: function get() {
	            return this.cellTypeValue;
	        },
	        set: function set(newValue) {
	            if (this.cellType == newValue) return;
	            this.cellTypeValue = newValue;
	            this.fireCallback(this.updateCellsCallbak);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "columnColCount", {
	        get: function get() {
	            return this.columnColCountValue;
	        },
	        set: function set(value) {
	            if (value < 0 || value > 4) return;
	            this.columnColCountValue = value;
	            this.fireCallback(this.updateCellsCallbak);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDropdownModelBase.prototype.getColumnTitle = function (column) {
	        var result = column.title;
	        if (column.isRequired && this.survey) {
	            var requireText = this.survey.requiredText;
	            if (requireText) requireText += " ";
	            result = requireText + result;
	        }
	        return result;
	    };
	    QuestionMatrixDropdownModelBase.prototype.getColumnWidth = function (column) {
	        return column.minWidth ? column.minWidth : this.columnMinWidth;
	    };
	    Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "choices", {
	        get: function get() {
	            return this.choicesValue;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.choicesValue, newValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "optionsCaption", {
	        get: function get() {
	            return this.optionsCaptionValue ? this.optionsCaptionValue : _surveyStrings.surveyLocalization.getString("optionsCaption");
	        },
	        set: function set(newValue) {
	            this.optionsCaptionValue = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDropdownModelBase.prototype.addColumn = function (name, title) {
	        if (title === void 0) {
	            title = null;
	        }
	        var column = new MatrixDropdownColumn(name, title);
	        this.columnsValue.push(column);
	        return column;
	    };
	    Object.defineProperty(QuestionMatrixDropdownModelBase.prototype, "visibleRows", {
	        get: function get() {
	            this.generatedVisibleRows = this.generateRows();
	            return this.generatedVisibleRows;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDropdownModelBase.prototype.generateRows = function () {
	        return null;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createMatrixRow = function (name, text, value) {
	        return null;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createNewValue = function (curValue) {
	        return !curValue ? {} : curValue;
	    };
	    QuestionMatrixDropdownModelBase.prototype.getRowValue = function (row, questionValue, create) {
	        if (create === void 0) {
	            create = false;
	        }
	        var result = questionValue[row.rowName] ? questionValue[row.rowName] : null;
	        if (!result && create) {
	            result = {};
	            questionValue[row.rowName] = result;
	        }
	        return result;
	    };
	    QuestionMatrixDropdownModelBase.prototype.onValueChanged = function () {
	        if (this.isRowChanging || !this.generatedVisibleRows || this.generatedVisibleRows.length == 0) return;
	        this.isRowChanging = true;
	        var val = this.createNewValue(this.value);
	        for (var i = 0; i < this.generatedVisibleRows.length; i++) {
	            var row = this.generatedVisibleRows[i];
	            this.generatedVisibleRows[i].value = this.getRowValue(row, val);
	        }
	        this.isRowChanging = false;
	    };
	    QuestionMatrixDropdownModelBase.prototype.supportGoNextPageAutomatic = function () {
	        var rows = this.generatedVisibleRows;
	        if (!rows) rows = this.visibleRows;
	        if (!rows) return true;
	        for (var i = 0; i < rows.length; i++) {
	            var cells = this.generatedVisibleRows[i].cells;
	            if (!cells) continue;
	            for (var colIndex = 0; colIndex < cells.length; colIndex++) {
	                var question = cells[colIndex].question;
	                if (question && (!question.supportGoNextPageAutomatic() || !question.value)) return false;
	            }
	        }
	        return true;
	    };
	    QuestionMatrixDropdownModelBase.prototype.hasErrors = function (fireCallback) {
	        if (fireCallback === void 0) {
	            fireCallback = true;
	        }
	        var errosInColumns = this.hasErrorInColumns(fireCallback);
	        return _super.prototype.hasErrors.call(this, fireCallback) || errosInColumns;
	    };
	    QuestionMatrixDropdownModelBase.prototype.hasErrorInColumns = function (fireCallback) {
	        if (!this.generatedVisibleRows) return false;
	        var res = false;
	        for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
	            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
	                var cells = this.generatedVisibleRows[i].cells;
	                res = cells && cells[colIndex] && cells[colIndex].question && cells[colIndex].question.hasErrors(fireCallback) || res;
	            }
	        }
	        return res;
	    };
	    QuestionMatrixDropdownModelBase.prototype.getFirstInputElementId = function () {
	        var question = this.getFirstCellQuestion(false);
	        return question ? question.inputId : _super.prototype.getFirstInputElementId.call(this);
	    };
	    QuestionMatrixDropdownModelBase.prototype.getFirstErrorInputElementId = function () {
	        var question = this.getFirstCellQuestion(true);
	        return question ? question.inputId : _super.prototype.getFirstErrorInputElementId.call(this);
	    };
	    QuestionMatrixDropdownModelBase.prototype.getFirstCellQuestion = function (onError) {
	        if (!this.generatedVisibleRows) return null;
	        for (var i = 0; i < this.generatedVisibleRows.length; i++) {
	            var cells = this.generatedVisibleRows[i].cells;
	            for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
	                if (!onError) return cells[colIndex].question;
	                if (cells[colIndex].question.currentErrorCount > 0) return cells[colIndex].question;
	            }
	        }
	        return null;
	    };
	    //IMatrixDropdownData
	    QuestionMatrixDropdownModelBase.prototype.createQuestion = function (row, column) {
	        var question = this.createQuestionCore(row, column);
	        question.name = column.name;
	        question.isRequired = column.isRequired;
	        question.hasOther = column.hasOther;
	        if (column.hasOther) {
	            if (question instanceof _question_baseselect.QuestionSelectBase) {
	                question.storeOthersAsComment = false;
	            }
	        }
	        return question;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createQuestionCore = function (row, column) {
	        var cellType = column.cellType == "default" ? this.cellType : column.cellType;
	        var name = this.getQuestionName(row, column);
	        if (cellType == "checkbox") return this.createCheckbox(name, column);
	        if (cellType == "radiogroup") return this.createRadiogroup(name, column);
	        if (cellType == "text") return this.createText(name, column);
	        if (cellType == "comment") return this.createComment(name, column);
	        return this.createDropdown(name, column);
	    };
	    QuestionMatrixDropdownModelBase.prototype.getQuestionName = function (row, column) {
	        return row.rowName + "_" + column.name;
	    };
	    QuestionMatrixDropdownModelBase.prototype.getColumnChoices = function (column) {
	        return column.choices && column.choices.length > 0 ? column.choices : this.choices;
	    };
	    QuestionMatrixDropdownModelBase.prototype.getColumnOptionsCaption = function (column) {
	        return column.optionsCaption ? column.optionsCaption : this.optionsCaption;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createDropdown = function (name, column) {
	        var q = this.createCellQuestion("dropdown", name);
	        q.choices = this.getColumnChoices(column);
	        q.optionsCaption = this.getColumnOptionsCaption(column);
	        return q;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createCheckbox = function (name, column) {
	        var q = this.createCellQuestion("checkbox", name);
	        q.choices = this.getColumnChoices(column);
	        q.colCount = column.colCount > -1 ? column.colCount : this.columnColCount;
	        return q;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createRadiogroup = function (name, column) {
	        var q = this.createCellQuestion("radiogroup", name);
	        q.choices = this.getColumnChoices(column);
	        q.colCount = column.colCount > -1 ? column.colCount : this.columnColCount;
	        return q;
	    };
	    QuestionMatrixDropdownModelBase.prototype.createText = function (name, column) {
	        return this.createCellQuestion("text", name);
	    };
	    QuestionMatrixDropdownModelBase.prototype.createComment = function (name, column) {
	        return this.createCellQuestion("comment", name);
	    };
	    QuestionMatrixDropdownModelBase.prototype.createCellQuestion = function (questionType, name) {
	        return _questionfactory.QuestionFactory.Instance.createQuestion(questionType, name);
	    };
	    QuestionMatrixDropdownModelBase.prototype.deleteRowValue = function (newValue, row) {
	        delete newValue[row.rowName];
	        return Object.keys(newValue).length == 0 ? null : newValue;
	    };
	    QuestionMatrixDropdownModelBase.prototype.onRowChanged = function (row, newRowValue) {
	        var newValue = this.createNewValue(this.value);
	        var rowValue = this.getRowValue(row, newValue, true);
	        for (var key in rowValue) {
	            delete rowValue[key];
	        }if (newRowValue) {
	            newRowValue = JSON.parse(JSON.stringify(newRowValue));
	            for (var key in newRowValue) {
	                rowValue[key] = newRowValue[key];
	            }
	        }
	        if (Object.keys(rowValue).length == 0) {
	            newValue = this.deleteRowValue(newValue, row);
	        }
	        this.isRowChanging = true;
	        this.setNewValue(newValue);
	        this.isRowChanging = false;
	    };
	    return QuestionMatrixDropdownModelBase;
	}(_question.Question);
	_jsonobject.JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", { name: "title", onGetValue: function onGetValue(obj) {
	        return obj.titleValue;
	    } }, { name: "choices:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.choices);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.choices = value;
	    } }, "optionsCaption", { name: "cellType", default: "default", choices: ["default", "dropdown", "checkbox", "radiogroup", "text", "comment"] }, { name: "colCount", default: -1, choices: [-1, 0, 1, 2, 3, 4] }, "isRequired:boolean", "hasOther:boolean", "minWidth"], function () {
	    return new MatrixDropdownColumn("");
	});
	_jsonobject.JsonObject.metaData.addClass("matrixdropdownbase", [{ name: "columns:matrixdropdowncolumns", className: "matrixdropdowncolumn" }, "horizontalScroll:boolean", { name: "choices:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.choices);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.choices = value;
	    } }, { name: "optionsCaption", onGetValue: function onGetValue(obj) {
	        return obj.optionsCaptionValue;
	    } }, { name: "cellType", default: "dropdown", choices: ["dropdown", "checkbox", "radiogroup", "text", "comment"] }, { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] }, "columnMinWidth"], function () {
	    return new QuestionMatrixDropdownModelBase("");
	}, "question");
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.Question = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionbase = __webpack_require__(14);
	
	var _base = __webpack_require__(4);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _error = __webpack_require__(5);
	
	var _validator = __webpack_require__(2);
	
	var _textPreProcessor = __webpack_require__(15);
	
	var Question = exports.Question = function (_super) {
	    __extends(Question, _super);
	    function Question(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.titleValue = null;
	        this.isRequiredValue = false;
	        this.hasCommentValue = false;
	        this.hasOtherValue = false;
	        this.commentTextValue = "";
	        this.errors = [];
	        this.validators = new Array();
	        this.isValueChangedInSurvey = false;
	    }
	    Object.defineProperty(Question.prototype, "hasTitle", {
	        get: function get() {
	            return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "hasInput", {
	        get: function get() {
	            return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "inputId", {
	        get: function get() {
	            return this.id + "i";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "title", {
	        get: function get() {
	            return this.titleValue ? this.titleValue : this.name;
	        },
	        set: function set(newValue) {
	            this.titleValue = newValue;
	            this.fireCallback(this.titleChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "processedTitle", {
	        get: function get() {
	            return this.survey != null ? this.survey.processText(this.title) : this.title;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "fullTitle", {
	        get: function get() {
	            if (this.survey && this.survey.questionTitleTemplate) {
	                if (!this.textPreProcessor) {
	                    var self = this;
	                    this.textPreProcessor = new _textPreProcessor.TextPreProcessor();
	                    this.textPreProcessor.onHasValue = function (name) {
	                        return self.canProcessedTextValues(name.toLowerCase());
	                    };
	                    this.textPreProcessor.onProcess = function (name) {
	                        return self.getProcessedTextValue(name);
	                    };
	                }
	                return this.textPreProcessor.process(this.survey.questionTitleTemplate);
	            }
	            var requireText = this.requiredText;
	            if (requireText) requireText += " ";
	            var no = this.no;
	            if (no) no += ". ";
	            return no + requireText + this.processedTitle;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Question.prototype.focus = function (onError) {
	        if (onError === void 0) {
	            onError = false;
	        }
	        _base.SurveyElement.ScrollElementToTop(this.id);
	        var id = !onError ? this.getFirstInputElementId() : this.getFirstErrorInputElementId();
	        if (_base.SurveyElement.FocusElement(id)) {
	            this.fireCallback(this.focusCallback);
	        }
	    };
	    Question.prototype.getFirstInputElementId = function () {
	        return this.inputId;
	    };
	    Question.prototype.getFirstErrorInputElementId = function () {
	        return this.getFirstInputElementId();
	    };
	    Question.prototype.canProcessedTextValues = function (name) {
	        return name == "no" || name == "title" || name == "require";
	    };
	    Question.prototype.getProcessedTextValue = function (name) {
	        if (name == "no") return this.no;
	        if (name == "title") return this.processedTitle;
	        if (name == "require") return this.requiredText;
	        return null;
	    };
	    Question.prototype.supportComment = function () {
	        return false;
	    };
	    Question.prototype.supportOther = function () {
	        return false;
	    };
	    Object.defineProperty(Question.prototype, "isRequired", {
	        get: function get() {
	            return this.isRequiredValue;
	        },
	        set: function set(val) {
	            if (this.isRequired == val) return;
	            this.isRequiredValue = val;
	            this.fireCallback(this.titleChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "hasComment", {
	        get: function get() {
	            return this.hasCommentValue;
	        },
	        set: function set(val) {
	            if (!this.supportComment()) return;
	            this.hasCommentValue = val;
	            if (this.hasComment) this.hasOther = false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "commentText", {
	        get: function get() {
	            return this.commentTextValue ? this.commentTextValue : _surveyStrings.surveyLocalization.getString("otherItemText");
	        },
	        set: function set(value) {
	            this.commentTextValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "hasOther", {
	        get: function get() {
	            return this.hasOtherValue;
	        },
	        set: function set(val) {
	            if (!this.supportOther() || this.hasOther == val) return;
	            this.hasOtherValue = val;
	            if (this.hasOther) this.hasComment = false;
	            this.hasOtherChanged();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Question.prototype.hasOtherChanged = function () {};
	    Object.defineProperty(Question.prototype, "no", {
	        get: function get() {
	            if (this.visibleIndex < 0) return "";
	            var startIndex = 1;
	            var isNumeric = true;
	            var str = "";
	            if (this.survey && this.survey.questionStartIndex) {
	                str = this.survey.questionStartIndex;
	                if (parseInt(str)) startIndex = parseInt(str);else if (str.length == 1) isNumeric = false;
	            }
	            if (isNumeric) return (this.visibleIndex + startIndex).toString();
	            return String.fromCharCode(str.charCodeAt(0) + this.visibleIndex);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Question.prototype.onSetData = function () {
	        _super.prototype.onSetData.call(this);
	        this.onSurveyValueChanged(this.value);
	    };
	    Object.defineProperty(Question.prototype, "value", {
	        get: function get() {
	            return this.valueFromData(this.getValueCore());
	        },
	        set: function set(newValue) {
	            this.setNewValue(newValue);
	            this.fireCallback(this.valueChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "comment", {
	        get: function get() {
	            return this.getComment();
	        },
	        set: function set(newValue) {
	            if (this.comment == newValue) return;
	            this.setComment(newValue);
	            this.fireCallback(this.commentChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Question.prototype.getComment = function () {
	        return this.data != null ? this.data.getComment(this.name) : this.questionComment;
	    };
	    Question.prototype.setComment = function (newValue) {
	        this.setNewComment(newValue);
	    };
	    Question.prototype.isEmpty = function () {
	        return this.value == null;
	    };
	    Question.prototype.hasErrors = function (fireCallback) {
	        if (fireCallback === void 0) {
	            fireCallback = true;
	        }
	        this.checkForErrors(fireCallback);
	        return this.errors.length > 0;
	    };
	    Object.defineProperty(Question.prototype, "currentErrorCount", {
	        get: function get() {
	            return this.errors.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Question.prototype, "requiredText", {
	        get: function get() {
	            return this.survey != null && this.isRequired ? this.survey.requiredText : "";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Question.prototype.addError = function (error) {
	        this.errors.push(error);
	        this.fireCallback(this.errorsChangedCallback);
	    };
	    Question.prototype.checkForErrors = function (fireCallback) {
	        var errorLength = this.errors ? this.errors.length : 0;
	        this.errors = [];
	        this.onCheckForErrors(this.errors);
	        if (this.errors.length == 0 && this.value) {
	            var error = this.runValidators();
	            if (error) {
	                this.errors.push(error);
	            }
	        }
	        if (this.survey && this.errors.length == 0) {
	            var error = this.survey.validateQuestion(this.name);
	            if (error) {
	                this.errors.push(error);
	            }
	        }
	        if (fireCallback && (errorLength != this.errors.length || errorLength > 0)) {
	            this.fireCallback(this.errorsChangedCallback);
	        }
	    };
	    Question.prototype.onCheckForErrors = function (errors) {
	        if (this.hasRequiredError()) {
	            this.errors.push(new _error.AnswerRequiredError());
	        }
	    };
	    Question.prototype.hasRequiredError = function () {
	        return this.isRequired && this.isEmpty();
	    };
	    Question.prototype.runValidators = function () {
	        return new _validator.ValidatorRunner().run(this);
	    };
	    Question.prototype.setNewValue = function (newValue) {
	        this.setNewValueInData(newValue);
	        this.onValueChanged();
	    };
	    Question.prototype.setNewValueInData = function (newValue) {
	        if (!this.isValueChangedInSurvey) {
	            newValue = this.valueToData(newValue);
	            this.setValueCore(newValue);
	        }
	    };
	    Question.prototype.getValueCore = function () {
	        return this.data != null ? this.data.getValue(this.name) : this.questionValue;
	    };
	    Question.prototype.setValueCore = function (newValue) {
	        if (this.data != null) {
	            this.data.setValue(this.name, newValue);
	        } else {
	            this.questionValue = newValue;
	        }
	    };
	    Question.prototype.valueFromData = function (val) {
	        return val;
	    };
	    Question.prototype.valueToData = function (val) {
	        return val;
	    };
	    Question.prototype.onValueChanged = function () {};
	    Question.prototype.setNewComment = function (newValue) {
	        if (this.data != null) {
	            this.data.setComment(this.name, newValue);
	        } else this.questionComment = newValue;
	    };
	    //IQuestion
	    Question.prototype.onSurveyValueChanged = function (newValue) {
	        this.isValueChangedInSurvey = true;
	        this.value = this.valueFromData(newValue);
	        this.fireCallback(this.commentChangedCallback);
	        this.isValueChangedInSurvey = false;
	    };
	    //IValidatorOwner
	    Question.prototype.getValidatorTitle = function () {
	        return null;
	    };
	    return Question;
	}(_questionbase.QuestionBase);
	_jsonobject.JsonObject.metaData.addClass("question", [{ name: "title:text", onGetValue: function onGetValue(obj) {
	        return obj.titleValue;
	    } }, { name: "commentText", onGetValue: function onGetValue(obj) {
	        return obj.commentTextValue;
	    } }, "isRequired:boolean", { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }], null, "questionbase");
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.QuestionBase = undefined;
	
	var _base = __webpack_require__(4);
	
	var _jsonobject = __webpack_require__(7);
	
	var _conditions = __webpack_require__(9);
	
	var QuestionBase = exports.QuestionBase = function (_super) {
	    __extends(QuestionBase, _super);
	    function QuestionBase(name) {
	        _super.call(this);
	        this.name = name;
	        this.conditionRunner = null;
	        this.visibleIf = "";
	        this.visibleValue = true;
	        this.startWithNewLine = true;
	        this.visibleIndexValue = -1;
	        this.width = "";
	        this.renderWidthValue = "";
	        this.rightIndentValue = 0;
	        this.indent = 0;
	        this.idValue = QuestionBase.getQuestionId();
	        this.onCreating();
	    }
	    QuestionBase.getQuestionId = function () {
	        return "sq_" + QuestionBase.questionCounter++;
	    };
	    Object.defineProperty(QuestionBase.prototype, "visible", {
	        get: function get() {
	            return this.visibleValue;
	        },
	        set: function set(val) {
	            if (val == this.visible) return;
	            this.visibleValue = val;
	            this.fireCallback(this.visibilityChangedCallback);
	            this.fireCallback(this.rowVisibilityChangedCallback);
	            if (this.survey) {
	                this.survey.questionVisibilityChanged(this, this.visible);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "visibleIndex", {
	        get: function get() {
	            return this.visibleIndexValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionBase.prototype.hasErrors = function (fireCallback) {
	        if (fireCallback === void 0) {
	            fireCallback = true;
	        }
	        return false;
	    };
	    Object.defineProperty(QuestionBase.prototype, "currentErrorCount", {
	        get: function get() {
	            return 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "hasTitle", {
	        get: function get() {
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "hasInput", {
	        get: function get() {
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "hasComment", {
	        get: function get() {
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "id", {
	        get: function get() {
	            return this.idValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "renderWidth", {
	        get: function get() {
	            return this.renderWidthValue;
	        },
	        set: function set(val) {
	            if (val == this.renderWidth) return;
	            this.renderWidthValue = val;
	            this.fireCallback(this.renderWidthChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionBase.prototype, "rightIndent", {
	        get: function get() {
	            return this.rightIndentValue;
	        },
	        set: function set(val) {
	            if (val == this.rightIndent) return;
	            this.rightIndentValue = val;
	            this.fireCallback(this.renderWidthChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionBase.prototype.focus = function (onError) {
	        if (onError === void 0) {
	            onError = false;
	        }
	    };
	    QuestionBase.prototype.setData = function (newValue) {
	        this.data = newValue;
	        this.survey = newValue && newValue["questionAdded"] ? newValue : null;
	        this.onSetData();
	    };
	    QuestionBase.prototype.fireCallback = function (callback) {
	        if (callback) callback();
	    };
	    QuestionBase.prototype.onSetData = function () {};
	    QuestionBase.prototype.onCreating = function () {};
	    QuestionBase.prototype.runCondition = function (values) {
	        if (!this.visibleIf) return;
	        if (!this.conditionRunner) this.conditionRunner = new _conditions.ConditionRunner(this.visibleIf);
	        this.conditionRunner.expression = this.visibleIf;
	        this.visible = this.conditionRunner.run(values);
	    };
	    //IQuestion
	    QuestionBase.prototype.onSurveyValueChanged = function (newValue) {};
	    QuestionBase.prototype.onSurveyLoad = function () {};
	    QuestionBase.prototype.setVisibleIndex = function (value) {
	        if (this.visibleIndexValue == value) return;
	        this.visibleIndexValue = value;
	        this.fireCallback(this.visibleIndexChangedCallback);
	    };
	    QuestionBase.prototype.supportGoNextPageAutomatic = function () {
	        return false;
	    };
	    QuestionBase.questionCounter = 100;
	    return QuestionBase;
	}(_base.Base);
	_jsonobject.JsonObject.metaData.addClass("questionbase", ["!name", { name: "visible:boolean", default: true }, "visibleIf:text", { name: "width" }, { name: "startWithNewLine:boolean", default: true }, { name: "indent:number", default: 0, choices: [0, 1, 2, 3] }]);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var TextPreProcessorItem = exports.TextPreProcessorItem = function () {
	    function TextPreProcessorItem() {}
	    return TextPreProcessorItem;
	}();
	var TextPreProcessor = exports.TextPreProcessor = function () {
	    function TextPreProcessor() {}
	    TextPreProcessor.prototype.process = function (text) {
	        if (!text) return text;
	        if (!this.onProcess) return text;
	        var items = this.getItems(text);
	        for (var i = items.length - 1; i >= 0; i--) {
	            var item = items[i];
	            var name = this.getName(text.substring(item.start + 1, item.end));
	            if (!this.canProcessName(name)) continue;
	            if (this.onHasValue && !this.onHasValue(name)) continue;
	            var value = this.onProcess(name);
	            if (value == null) value = "";
	            text = text.substr(0, item.start) + value + text.substr(item.end + 1);
	        }
	        return text;
	    };
	    TextPreProcessor.prototype.getItems = function (text) {
	        var items = [];
	        var length = text.length;
	        var start = -1;
	        var ch = '';
	        for (var i = 0; i < length; i++) {
	            ch = text[i];
	            if (ch == '{') start = i;
	            if (ch == '}') {
	                if (start > -1) {
	                    var item = new TextPreProcessorItem();
	                    item.start = start;
	                    item.end = i;
	                    items.push(item);
	                }
	                start = -1;
	            }
	        }
	        return items;
	    };
	    TextPreProcessor.prototype.getName = function (name) {
	        if (!name) return;
	        return name.trim();
	    };
	    TextPreProcessor.prototype.canProcessName = function (name) {
	        if (!name) return false;
	        for (var i = 0; i < name.length; i++) {
	            var ch = name[i];
	            //TODO
	            if (ch == ' ' || ch == '-' || ch == '&') return false;
	        }
	        return true;
	    };
	    return TextPreProcessor;
	}();

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionCheckboxBase = exports.QuestionSelectBase = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _question = __webpack_require__(13);
	
	var _base = __webpack_require__(4);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _error = __webpack_require__(5);
	
	var _choicesRestfull = __webpack_require__(8);
	
	var QuestionSelectBase = exports.QuestionSelectBase = function (_super) {
	    __extends(QuestionSelectBase, _super);
	    function QuestionSelectBase(name) {
	        _super.call(this, name);
	        this.visibleChoicesCache = null;
	        this.otherItem = new _base.ItemValue("other", _surveyStrings.surveyLocalization.getString("otherItemText"));
	        this.choicesFromUrl = null;
	        this.cachedValueForUrlRequestion = null;
	        this.choicesValues = new Array();
	        this.otherErrorText = null;
	        this.storeOthersAsComment = true;
	        this.choicesOrderValue = "none";
	        this.isSettingComment = false;
	        this.choicesByUrl = this.createRestfull();
	        var self = this;
	        this.choicesByUrl.getResultCallback = function (items) {
	            self.onLoadChoicesFromUrl(items);
	        };
	    }
	    Object.defineProperty(QuestionSelectBase.prototype, "isOtherSelected", {
	        get: function get() {
	            return this.getStoreOthersAsComment() ? this.getHasOther(this.value) : this.getHasOther(this.cachedValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionSelectBase.prototype.getHasOther = function (val) {
	        return val == this.otherItem.value;
	    };
	    QuestionSelectBase.prototype.createRestfull = function () {
	        return new _choicesRestfull.ChoicesRestfull();
	    };
	    QuestionSelectBase.prototype.getComment = function () {
	        if (this.getStoreOthersAsComment()) return _super.prototype.getComment.call(this);
	        return this.commentValue;
	    };
	    QuestionSelectBase.prototype.setComment = function (newValue) {
	        if (this.getStoreOthersAsComment()) _super.prototype.setComment.call(this, newValue);else {
	            if (!this.isSettingComment && newValue != this.commentValue) {
	                this.isSettingComment = true;
	                this.commentValue = newValue;
	                if (this.isOtherSelected) {
	                    this.setNewValueInData(this.cachedValue);
	                }
	                this.isSettingComment = false;
	            }
	        }
	    };
	    QuestionSelectBase.prototype.setNewValue = function (newValue) {
	        if (newValue) this.cachedValueForUrlRequestion = newValue;
	        _super.prototype.setNewValue.call(this, newValue);
	    };
	    QuestionSelectBase.prototype.valueFromData = function (val) {
	        if (this.getStoreOthersAsComment()) return _super.prototype.valueFromData.call(this, val);
	        this.cachedValue = this.valueFromDataCore(val);
	        return this.cachedValue;
	    };
	    QuestionSelectBase.prototype.valueToData = function (val) {
	        if (this.getStoreOthersAsComment()) return _super.prototype.valueToData.call(this, val);
	        this.cachedValue = val;
	        return this.valueToDataCore(val);
	    };
	    QuestionSelectBase.prototype.valueFromDataCore = function (val) {
	        if (!this.hasUnknownValue(val)) return val;
	        if (val == this.otherItem.value) return val;
	        this.comment = val;
	        return this.otherItem.value;
	    };
	    QuestionSelectBase.prototype.valueToDataCore = function (val) {
	        if (val == this.otherItem.value && this.getComment()) {
	            val = this.getComment();
	        }
	        return val;
	    };
	    QuestionSelectBase.prototype.hasUnknownValue = function (val) {
	        if (!val) return false;
	        var items = this.activeChoices;
	        for (var i = 0; i < items.length; i++) {
	            if (items[i].value == val) return false;
	        }
	        return true;
	    };
	    Object.defineProperty(QuestionSelectBase.prototype, "choices", {
	        get: function get() {
	            return this.choicesValues;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.choicesValues, newValue);
	            this.onVisibleChoicesChanged();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionSelectBase.prototype.hasOtherChanged = function () {
	        this.onVisibleChoicesChanged();
	    };
	    Object.defineProperty(QuestionSelectBase.prototype, "choicesOrder", {
	        get: function get() {
	            return this.choicesOrderValue;
	        },
	        set: function set(newValue) {
	            if (newValue == this.choicesOrderValue) return;
	            this.choicesOrderValue = newValue;
	            this.onVisibleChoicesChanged();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionSelectBase.prototype, "otherText", {
	        get: function get() {
	            return this.otherItem.text;
	        },
	        set: function set(value) {
	            this.otherItem.text = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionSelectBase.prototype, "visibleChoices", {
	        get: function get() {
	            if (!this.hasOther && this.choicesOrder == "none") return this.activeChoices;
	            if (!this.visibleChoicesCache) {
	                this.visibleChoicesCache = this.sortVisibleChoices(this.activeChoices.slice());
	                if (this.hasOther) {
	                    this.visibleChoicesCache.push(this.otherItem);
	                }
	            }
	            return this.visibleChoicesCache;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionSelectBase.prototype, "activeChoices", {
	        get: function get() {
	            return this.choicesFromUrl ? this.choicesFromUrl : this.choices;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionSelectBase.prototype.supportComment = function () {
	        return true;
	    };
	    QuestionSelectBase.prototype.supportOther = function () {
	        return true;
	    };
	    QuestionSelectBase.prototype.onCheckForErrors = function (errors) {
	        _super.prototype.onCheckForErrors.call(this, errors);
	        if (!this.isOtherSelected || this.comment) return;
	        var text = this.otherErrorText;
	        if (!text) {
	            text = _surveyStrings.surveyLocalization.getString("otherRequiredError");
	        }
	        errors.push(new _error.CustomError(text));
	    };
	    QuestionSelectBase.prototype.getStoreOthersAsComment = function () {
	        return this.storeOthersAsComment && (this.survey != null ? this.survey.storeOthersAsComment : true);
	    };
	    QuestionSelectBase.prototype.onSurveyLoad = function () {
	        if (this.choicesByUrl) this.choicesByUrl.run();
	    };
	    QuestionSelectBase.prototype.onLoadChoicesFromUrl = function (array) {
	        var errorCount = this.errors.length;
	        this.errors = [];
	        if (this.choicesByUrl && this.choicesByUrl.error) {
	            this.errors.push(this.choicesByUrl.error);
	        }
	        if (errorCount > 0 || this.errors.length > 0) {
	            this.fireCallback(this.errorsChangedCallback);
	        }
	        var newChoices = null;
	        if (array && array.length > 0) {
	            newChoices = new Array();
	            _base.ItemValue.setData(newChoices, array);
	        }
	        this.choicesFromUrl = newChoices;
	        this.onVisibleChoicesChanged();
	        if (this.cachedValueForUrlRequestion) {
	            this.value = this.cachedValueForUrlRequestion;
	        }
	    };
	    QuestionSelectBase.prototype.onVisibleChoicesChanged = function () {
	        this.visibleChoicesCache = null;
	        this.fireCallback(this.choicesChangedCallback);
	    };
	    QuestionSelectBase.prototype.sortVisibleChoices = function (array) {
	        var order = this.choicesOrder.toLowerCase();
	        if (order == "asc") return this.sortArray(array, 1);
	        if (order == "desc") return this.sortArray(array, -1);
	        if (order == "random") return this.randomizeArray(array);
	        return array;
	    };
	    QuestionSelectBase.prototype.sortArray = function (array, mult) {
	        return array.sort(function (a, b) {
	            if (a.text < b.text) return -1 * mult;
	            if (a.text > b.text) return 1 * mult;
	            return 0;
	        });
	    };
	    QuestionSelectBase.prototype.randomizeArray = function (array) {
	        for (var i = array.length - 1; i > 0; i--) {
	            var j = Math.floor(Math.random() * (i + 1));
	            var temp = array[i];
	            array[i] = array[j];
	            array[j] = temp;
	        }
	        return array;
	    };
	    return QuestionSelectBase;
	}(_question.Question);
	var QuestionCheckboxBase = exports.QuestionCheckboxBase = function (_super) {
	    __extends(QuestionCheckboxBase, _super);
	    function QuestionCheckboxBase(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.colCountValue = 1;
	    }
	    Object.defineProperty(QuestionCheckboxBase.prototype, "colCount", {
	        get: function get() {
	            return this.colCountValue;
	        },
	        set: function set(value) {
	            if (value < 0 || value > 4) return;
	            this.colCountValue = value;
	            this.fireCallback(this.colCountChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return QuestionCheckboxBase;
	}(QuestionSelectBase);
	_jsonobject.JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean", { name: "choices:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.choices);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.choices = value;
	    } }, { name: "choicesOrder", default: "none", choices: ["none", "asc", "desc", "random"] }, { name: "choicesByUrl:restfull", className: "ChoicesRestfull", onGetValue: function onGetValue(obj) {
	        return obj.choicesByUrl.isEmpty ? null : obj.choicesByUrl;
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.choicesByUrl.setData(value);
	    } }, { name: "otherText", default: _surveyStrings.surveyLocalization.getString("otherItemText") }, "otherErrorText", { name: "storeOthersAsComment:boolean", default: true }], null, "question");
	_jsonobject.JsonObject.metaData.addClass("checkboxbase", [{ name: "colCount:number", default: 1, choices: [0, 1, 2, 3, 4] }], null, "selectbase");
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var QuestionFactory = exports.QuestionFactory = function () {
	    function QuestionFactory() {
	        this.creatorHash = {};
	    }
	    QuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
	        this.creatorHash[questionType] = questionCreator;
	    };
	    QuestionFactory.prototype.getAllTypes = function () {
	        var result = new Array();
	        for (var key in this.creatorHash) {
	            result.push(key);
	        }
	        return result.sort();
	    };
	    QuestionFactory.prototype.createQuestion = function (questionType, name) {
	        var creator = this.creatorHash[questionType];
	        if (creator == null) return null;
	        return creator(name);
	    };
	    QuestionFactory.Instance = new QuestionFactory();
	    QuestionFactory.DefaultChoices = ["one", "two|second value", "three|third value"];
	    return QuestionFactory;
	}();

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrixDropdownModel = exports.MatrixDropdownRowModel = undefined;
	
	var _question_matrixdropdownbase = __webpack_require__(12);
	
	var _jsonobject = __webpack_require__(7);
	
	var _base = __webpack_require__(4);
	
	var _questionfactory = __webpack_require__(17);
	
	var MatrixDropdownRowModel = exports.MatrixDropdownRowModel = function (_super) {
	    __extends(MatrixDropdownRowModel, _super);
	    function MatrixDropdownRowModel(name, text, data, value) {
	        _super.call(this, data, value);
	        this.name = name;
	        this.text = text;
	    }
	    Object.defineProperty(MatrixDropdownRowModel.prototype, "rowName", {
	        get: function get() {
	            return this.name;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return MatrixDropdownRowModel;
	}(_question_matrixdropdownbase.MatrixDropdownRowModelBase);
	var QuestionMatrixDropdownModel = exports.QuestionMatrixDropdownModel = function (_super) {
	    __extends(QuestionMatrixDropdownModel, _super);
	    function QuestionMatrixDropdownModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.rowsValue = [];
	    }
	    QuestionMatrixDropdownModel.prototype.getType = function () {
	        return "matrixdropdown";
	    };
	    Object.defineProperty(QuestionMatrixDropdownModel.prototype, "rows", {
	        get: function get() {
	            return this.rowsValue;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.rowsValue, newValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDropdownModel.prototype.generateRows = function () {
	        var result = new Array();
	        if (!this.rows || this.rows.length === 0) return result;
	        var val = this.value;
	        if (!val) val = {};
	        for (var i = 0; i < this.rows.length; i++) {
	            if (!this.rows[i].value) continue;
	            result.push(this.createMatrixRow(this.rows[i].value, this.rows[i].text, val[this.rows[i].value]));
	        }
	        return result;
	    };
	    QuestionMatrixDropdownModel.prototype.createMatrixRow = function (name, text, value) {
	        return new MatrixDropdownRowModel(name, text, this, value);
	    };
	    return QuestionMatrixDropdownModel;
	}(_question_matrixdropdownbase.QuestionMatrixDropdownModelBase);
	_jsonobject.JsonObject.metaData.addClass("matrixdropdown", [{ name: "rows:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.rows);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.rows = value;
	    } }], function () {
	    return new QuestionMatrixDropdownModel("");
	}, "matrixdropdownbase");
	_questionfactory.QuestionFactory.Instance.registerQuestion("matrixdropdown", function (name) {
	    var q = new QuestionMatrixDropdownModel(name);q.choices = [1, 2, 3, 4, 5];q.rows = ["Row 1", "Row 2"];q.addColumn("Column 1");q.addColumn("Column 2");q.addColumn("Column 3");return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrixDynamicModel = exports.MatrixDynamicRowModel = undefined;
	
	var _question_matrixdropdownbase = __webpack_require__(12);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _error = __webpack_require__(5);
	
	var MatrixDynamicRowModel = exports.MatrixDynamicRowModel = function (_super) {
	    __extends(MatrixDynamicRowModel, _super);
	    function MatrixDynamicRowModel(index, data, value) {
	        _super.call(this, data, value);
	        this.index = index;
	    }
	    Object.defineProperty(MatrixDynamicRowModel.prototype, "rowName", {
	        get: function get() {
	            return "row" + this.index;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return MatrixDynamicRowModel;
	}(_question_matrixdropdownbase.MatrixDropdownRowModelBase);
	var QuestionMatrixDynamicModel = exports.QuestionMatrixDynamicModel = function (_super) {
	    __extends(QuestionMatrixDynamicModel, _super);
	    function QuestionMatrixDynamicModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.rowCounter = 0;
	        this.rowCountValue = 2;
	        this.addRowTextValue = null;
	        this.removeRowTextValue = null;
	        this.minRowCount = 0;
	    }
	    QuestionMatrixDynamicModel.prototype.getType = function () {
	        return "matrixdynamic";
	    };
	    Object.defineProperty(QuestionMatrixDynamicModel.prototype, "rowCount", {
	        get: function get() {
	            return this.rowCountValue;
	        },
	        set: function set(val) {
	            if (val < 0 || val > QuestionMatrixDynamicModel.MaxRowCount) return;
	            this.rowCountValue = val;
	            if (this.value && this.value.length > val) {
	                var qVal = this.value;
	                qVal.splice(val);
	                this.value = qVal;
	            }
	            this.fireCallback(this.rowCountChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDynamicModel.prototype.addRow = function () {
	        if (this.generatedVisibleRows) {
	            this.generatedVisibleRows.push(this.createMatrixRow(null));
	        }
	        this.rowCount++;
	    };
	    QuestionMatrixDynamicModel.prototype.removeRow = function (index) {
	        if (index < 0 || index >= this.rowCount) return;
	        if (this.generatedVisibleRows && index < this.generatedVisibleRows.length) {
	            this.generatedVisibleRows.splice(index, 1);
	        }
	        if (this.value) {
	            var val = this.createNewValue(this.value);
	            val.splice(index, 1);
	            val = this.deleteRowValue(val, null);
	            this.value = val;
	        }
	        this.rowCount--;
	    };
	    Object.defineProperty(QuestionMatrixDynamicModel.prototype, "addRowText", {
	        get: function get() {
	            return this.addRowTextValue ? this.addRowTextValue : _surveyStrings.surveyLocalization.getString("addRow");
	        },
	        set: function set(value) {
	            this.addRowTextValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixDynamicModel.prototype, "removeRowText", {
	        get: function get() {
	            return this.removeRowTextValue ? this.removeRowTextValue : _surveyStrings.surveyLocalization.getString("removeRow");
	        },
	        set: function set(value) {
	            this.removeRowTextValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDynamicModel.prototype.supportGoNextPageAutomatic = function () {
	        return false;
	    };
	    Object.defineProperty(QuestionMatrixDynamicModel.prototype, "cachedVisibleRows", {
	        get: function get() {
	            if (this.generatedVisibleRows && this.generatedVisibleRows.length == this.rowCount) return this.generatedVisibleRows;
	            return this.visibleRows;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixDynamicModel.prototype.onCheckForErrors = function (errors) {
	        _super.prototype.onCheckForErrors.call(this, errors);
	        if (this.hasErrorInRows()) {
	            errors.push(new _error.CustomError(_surveyStrings.surveyLocalization.getString("minRowCountError")["format"](this.minRowCount)));
	        }
	    };
	    QuestionMatrixDynamicModel.prototype.hasErrorInRows = function () {
	        if (this.minRowCount <= 0 || !this.generatedVisibleRows) return false;
	        var res = false;
	        var setRowCount = 0;
	        for (var rowIndex = 0; rowIndex < this.generatedVisibleRows.length; rowIndex++) {
	            var row = this.generatedVisibleRows[rowIndex];
	            if (!row.isEmpty) setRowCount++;
	        }
	        return setRowCount < this.minRowCount;
	    };
	    QuestionMatrixDynamicModel.prototype.generateRows = function () {
	        var result = new Array();
	        if (this.rowCount === 0) return result;
	        var val = this.createNewValue(this.value);
	        for (var i = 0; i < this.rowCount; i++) {
	            result.push(this.createMatrixRow(this.getRowValueByIndex(val, i)));
	        }
	        return result;
	    };
	    QuestionMatrixDynamicModel.prototype.createMatrixRow = function (value) {
	        return new MatrixDynamicRowModel(this.rowCounter++, this, value);
	    };
	    QuestionMatrixDynamicModel.prototype.createNewValue = function (curValue) {
	        var result = curValue;
	        if (!result) result = [];
	        var r = [];
	        if (result.length > this.rowCount) result.splice(this.rowCount - 1);
	        for (var i = result.length; i < this.rowCount; i++) {
	            result.push({});
	        }
	        return result;
	    };
	    QuestionMatrixDynamicModel.prototype.deleteRowValue = function (newValue, row) {
	        var isEmpty = true;
	        for (var i = 0; i < newValue.length; i++) {
	            if (Object.keys(newValue[i]).length > 0) {
	                isEmpty = false;
	                break;
	            }
	        }
	        return isEmpty ? null : newValue;
	    };
	    QuestionMatrixDynamicModel.prototype.getRowValueByIndex = function (questionValue, index) {
	        return index >= 0 && index < questionValue.length ? questionValue[index] : null;
	    };
	    QuestionMatrixDynamicModel.prototype.getRowValue = function (row, questionValue, create) {
	        if (create === void 0) {
	            create = false;
	        }
	        return this.getRowValueByIndex(questionValue, this.generatedVisibleRows.indexOf(row));
	    };
	    QuestionMatrixDynamicModel.MaxRowCount = 100;
	    return QuestionMatrixDynamicModel;
	}(_question_matrixdropdownbase.QuestionMatrixDropdownModelBase);
	_jsonobject.JsonObject.metaData.addClass("matrixdynamic", [{ name: "rowCount:number", default: 2 }, { name: "minRowCount:number", default: 0 }, { name: "addRowText", onGetValue: function onGetValue(obj) {
	        return obj.addRowTextValue;
	    } }, { name: "removeRowText", onGetValue: function onGetValue(obj) {
	        return obj.removeRowTextValue;
	    } }], function () {
	    return new QuestionMatrixDynamicModel("");
	}, "matrixdropdownbase");
	_questionfactory.QuestionFactory.Instance.registerQuestion("matrixdynamic", function (name) {
	    var q = new QuestionMatrixDynamicModel(name);q.choices = [1, 2, 3, 4, 5];q.addColumn("Column 1");q.addColumn("Column 2");q.addColumn("Column 3");return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrixModel = exports.MatrixRowModel = undefined;
	
	var _base = __webpack_require__(4);
	
	var _question = __webpack_require__(13);
	
	var _jsonobject = __webpack_require__(7);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _error = __webpack_require__(5);
	
	var _questionfactory = __webpack_require__(17);
	
	var MatrixRowModel = exports.MatrixRowModel = function (_super) {
	    __extends(MatrixRowModel, _super);
	    function MatrixRowModel(name, text, fullName, data, value) {
	        _super.call(this);
	        this.name = name;
	        this.text = text;
	        this.fullName = fullName;
	        this.data = data;
	        this.rowValue = value;
	    }
	    Object.defineProperty(MatrixRowModel.prototype, "value", {
	        get: function get() {
	            return this.rowValue;
	        },
	        set: function set(newValue) {
	            this.rowValue = newValue;
	            if (this.data) this.data.onMatrixRowChanged(this);
	            this.onValueChanged();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MatrixRowModel.prototype.onValueChanged = function () {};
	    return MatrixRowModel;
	}(_base.Base);
	var QuestionMatrixModel = exports.QuestionMatrixModel = function (_super) {
	    __extends(QuestionMatrixModel, _super);
	    function QuestionMatrixModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.columnsValue = [];
	        this.rowsValue = [];
	        this.isRowChanging = false;
	        this.isAllRowRequired = false;
	    }
	    QuestionMatrixModel.prototype.getType = function () {
	        return "matrix";
	    };
	    Object.defineProperty(QuestionMatrixModel.prototype, "hasRows", {
	        get: function get() {
	            return this.rowsValue.length > 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixModel.prototype, "columns", {
	        get: function get() {
	            return this.columnsValue;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.columnsValue, newValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixModel.prototype, "rows", {
	        get: function get() {
	            return this.rowsValue;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.rowsValue, newValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionMatrixModel.prototype, "visibleRows", {
	        get: function get() {
	            var result = new Array();
	            var val = this.value;
	            if (!val) val = {};
	            for (var i = 0; i < this.rows.length; i++) {
	                if (!this.rows[i].value) continue;
	                result.push(this.createMatrixRow(this.rows[i].value, this.rows[i].text, this.name + '_' + this.rows[i].value.toString(), val[this.rows[i].value]));
	            }
	            if (result.length == 0) {
	                result.push(this.createMatrixRow(null, "", this.name, val));
	            }
	            this.generatedVisibleRows = result;
	            return result;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMatrixModel.prototype.supportGoNextPageAutomatic = function () {
	        return this.hasValuesInAllRows();
	    };
	    QuestionMatrixModel.prototype.onCheckForErrors = function (errors) {
	        _super.prototype.onCheckForErrors.call(this, errors);
	        if (this.hasErrorInRows()) {
	            this.errors.push(new _error.CustomError(_surveyStrings.surveyLocalization.getString("requiredInAllRowsError")));
	        }
	    };
	    QuestionMatrixModel.prototype.hasErrorInRows = function () {
	        if (!this.isAllRowRequired) return false;
	        return !this.hasValuesInAllRows();
	    };
	    QuestionMatrixModel.prototype.hasValuesInAllRows = function () {
	        var rows = this.generatedVisibleRows;
	        if (!rows) rows = this.visibleRows;
	        if (!rows) return true;
	        for (var i = 0; i < rows.length; i++) {
	            var val = rows[i].value;
	            if (!val) return false;
	        }
	        return true;
	    };
	    QuestionMatrixModel.prototype.createMatrixRow = function (name, text, fullName, value) {
	        return new MatrixRowModel(name, text, fullName, this, value);
	    };
	    QuestionMatrixModel.prototype.onValueChanged = function () {
	        if (this.isRowChanging || !this.generatedVisibleRows || this.generatedVisibleRows.length == 0) return;
	        this.isRowChanging = true;
	        var val = this.value;
	        if (!val) val = {};
	        if (this.rows.length == 0) {
	            this.generatedVisibleRows[0].value = val;
	        } else {
	            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
	                var row = this.generatedVisibleRows[i];
	                var rowVal = val[row.name] ? val[row.name] : null;
	                this.generatedVisibleRows[i].value = rowVal;
	            }
	        }
	        this.isRowChanging = false;
	    };
	    //IMatrixData
	    QuestionMatrixModel.prototype.onMatrixRowChanged = function (row) {
	        if (this.isRowChanging) return;
	        this.isRowChanging = true;
	        if (!this.hasRows) {
	            this.setNewValue(row.value);
	        } else {
	            var newValue = this.value;
	            if (!newValue) {
	                newValue = {};
	            }
	            newValue[row.name] = row.value;
	            this.setNewValue(newValue);
	        }
	        this.isRowChanging = false;
	    };
	    return QuestionMatrixModel;
	}(_question.Question);
	_jsonobject.JsonObject.metaData.addClass("matrix", [{ name: "columns:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.columns);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.columns = value;
	    } }, { name: "rows:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.rows);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.rows = value;
	    } }, "isAllRowRequired:boolean"], function () {
	    return new QuestionMatrixModel("");
	}, "question");
	_questionfactory.QuestionFactory.Instance.registerQuestion("matrix", function (name) {
	    var q = new QuestionMatrixModel(name);q.rows = ["Row 1", "Row 2"];q.columns = ["Column 1", "Column 2", "Column 3"];return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMultipleTextModel = exports.MultipleTextItemModel = undefined;
	
	var _base = __webpack_require__(4);
	
	var _validator = __webpack_require__(2);
	
	var _question = __webpack_require__(13);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var MultipleTextItemModel = exports.MultipleTextItemModel = function (_super) {
	    __extends(MultipleTextItemModel, _super);
	    function MultipleTextItemModel(name, title) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (title === void 0) {
	            title = null;
	        }
	        _super.call(this);
	        this.name = name;
	        this.validators = new Array();
	        this.title = title;
	    }
	    MultipleTextItemModel.prototype.getType = function () {
	        return "multipletextitem";
	    };
	    MultipleTextItemModel.prototype.setData = function (data) {
	        this.data = data;
	    };
	    Object.defineProperty(MultipleTextItemModel.prototype, "title", {
	        get: function get() {
	            return this.titleValue ? this.titleValue : this.name;
	        },
	        set: function set(newText) {
	            this.titleValue = newText;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MultipleTextItemModel.prototype, "value", {
	        get: function get() {
	            return this.data ? this.data.getMultipleTextValue(this.name) : null;
	        },
	        set: function set(value) {
	            if (this.data != null) {
	                this.data.setMultipleTextValue(this.name, value);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MultipleTextItemModel.prototype.onValueChanged = function (newValue) {};
	    //IValidatorOwner
	    MultipleTextItemModel.prototype.getValidatorTitle = function () {
	        return this.title;
	    };
	    return MultipleTextItemModel;
	}(_base.Base);
	var QuestionMultipleTextModel = exports.QuestionMultipleTextModel = function (_super) {
	    __extends(QuestionMultipleTextModel, _super);
	    function QuestionMultipleTextModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.colCountValue = 1;
	        this.itemSize = 25;
	        this.itemsValues = new Array();
	        this.isMultipleItemValueChanging = false;
	        var self = this;
	        this.items.push = function (value) {
	            value.setData(self);
	            var result = Array.prototype.push.call(this, value);
	            self.fireCallback(self.colCountChangedCallback);
	            return result;
	        };
	    }
	    QuestionMultipleTextModel.prototype.getType = function () {
	        return "multipletext";
	    };
	    Object.defineProperty(QuestionMultipleTextModel.prototype, "items", {
	        get: function get() {
	            return this.itemsValues;
	        },
	        set: function set(value) {
	            this.itemsValues = value;
	            this.fireCallback(this.colCountChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMultipleTextModel.prototype.addItem = function (name, title) {
	        if (title === void 0) {
	            title = null;
	        }
	        var item = this.createTextItem(name, title);
	        this.items.push(item);
	        return item;
	    };
	    //TODO-remove later. Delay removing in case somebody use this function.
	    QuestionMultipleTextModel.prototype.AddItem = function (name, title) {
	        if (title === void 0) {
	            title = null;
	        }
	        return this.addItem(name, title);
	    };
	    QuestionMultipleTextModel.prototype.supportGoNextPageAutomatic = function () {
	        for (var i = 0; i < this.items.length; i++) {
	            if (!this.items[i].value) return false;
	        }
	        return true;
	    };
	    Object.defineProperty(QuestionMultipleTextModel.prototype, "colCount", {
	        get: function get() {
	            return this.colCountValue;
	        },
	        set: function set(value) {
	            if (value < 1 || value > 4) return;
	            this.colCountValue = value;
	            this.fireCallback(this.colCountChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionMultipleTextModel.prototype.getRows = function () {
	        var colCount = this.colCount;
	        var items = this.items;
	        var rows = [];
	        var index = 0;
	        for (var i = 0; i < items.length; i++) {
	            if (index == 0) {
	                rows.push([]);
	            }
	            rows[rows.length - 1].push(items[i]);
	            index++;
	            if (index >= colCount) {
	                index = 0;
	            }
	        }
	        return rows;
	    };
	    QuestionMultipleTextModel.prototype.onValueChanged = function () {
	        _super.prototype.onValueChanged.call(this);
	        this.onItemValueChanged();
	    };
	    QuestionMultipleTextModel.prototype.createTextItem = function (name, title) {
	        return new MultipleTextItemModel(name, title);
	    };
	    QuestionMultipleTextModel.prototype.onItemValueChanged = function () {
	        if (this.isMultipleItemValueChanging) return;
	        for (var i = 0; i < this.items.length; i++) {
	            var itemValue = null;
	            if (this.value && this.items[i].name in this.value) {
	                itemValue = this.value[this.items[i].name];
	            }
	            this.items[i].onValueChanged(itemValue);
	        }
	    };
	    QuestionMultipleTextModel.prototype.runValidators = function () {
	        var error = _super.prototype.runValidators.call(this);
	        if (error != null) return error;
	        for (var i = 0; i < this.items.length; i++) {
	            error = new _validator.ValidatorRunner().run(this.items[i]);
	            if (error != null) return error;
	        }
	        return null;
	    };
	    //IMultipleTextData
	    QuestionMultipleTextModel.prototype.getMultipleTextValue = function (name) {
	        if (!this.value) return null;
	        return this.value[name];
	    };
	    QuestionMultipleTextModel.prototype.setMultipleTextValue = function (name, value) {
	        this.isMultipleItemValueChanging = true;
	        var newValue = this.value;
	        if (!newValue) {
	            newValue = {};
	        }
	        newValue[name] = value;
	        this.setNewValue(newValue);
	        this.isMultipleItemValueChanging = false;
	    };
	    return QuestionMultipleTextModel;
	}(_question.Question);
	_jsonobject.JsonObject.metaData.addClass("multipletextitem", ["name", { name: "title", onGetValue: function onGetValue(obj) {
	        return obj.titleValue;
	    } }, { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }], function () {
	    return new MultipleTextItemModel("");
	});
	_jsonobject.JsonObject.metaData.addClass("multipletext", [{ name: "!items:textitems", className: "multipletextitem" }, { name: "itemSize:number", default: 25 }, { name: "colCount:number", default: 1, choices: [1, 2, 3, 4] }], function () {
	    return new QuestionMultipleTextModel("");
	}, "question");
	_questionfactory.QuestionFactory.Instance.registerQuestion("multipletext", function (name) {
	    var q = new QuestionMultipleTextModel(name);q.addItem("text1");q.addItem("text2");return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.PageModel = exports.QuestionRowModel = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _base = __webpack_require__(4);
	
	var _conditions = __webpack_require__(9);
	
	var _questionfactory = __webpack_require__(17);
	
	var QuestionRowModel = exports.QuestionRowModel = function () {
	    function QuestionRowModel(page, question) {
	        this.page = page;
	        this.question = question;
	        this.visibleValue = false;
	        this.questions = [];
	        var self = this;
	        this.question.rowVisibilityChangedCallback = function () {
	            self.onRowVisibilityChanged();
	        };
	    }
	    Object.defineProperty(QuestionRowModel.prototype, "visible", {
	        get: function get() {
	            return this.visibleValue;
	        },
	        set: function set(val) {
	            if (val == this.visible) return;
	            this.visibleValue = val;
	            this.onVisibleChanged();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionRowModel.prototype.updateVisible = function () {
	        this.visible = this.calcVisible();
	        this.setWidth();
	    };
	    QuestionRowModel.prototype.addQuestion = function (q) {
	        this.questions.push(q);
	        this.updateVisible();
	    };
	    QuestionRowModel.prototype.onVisibleChanged = function () {
	        if (this.visibilityChangedCallback) this.visibilityChangedCallback();
	    };
	    QuestionRowModel.prototype.setWidth = function () {
	        var visCount = this.getVisibleCount();
	        if (visCount == 0) return;
	        var counter = 0;
	        for (var i = 0; i < this.questions.length; i++) {
	            if (this.isQuestionVisible(this.questions[i])) {
	                this.questions[i].renderWidth = this.question.width ? this.question.width : Math.floor(100 / visCount) + '%';
	                this.questions[i].rightIndent = counter < visCount - 1 ? 1 : 0;
	                counter++;
	            }
	        }
	    };
	    QuestionRowModel.prototype.onRowVisibilityChanged = function () {
	        this.page.onRowVisibilityChanged(this);
	    };
	    QuestionRowModel.prototype.getVisibleCount = function () {
	        var res = 0;
	        for (var i = 0; i < this.questions.length; i++) {
	            if (this.isQuestionVisible(this.questions[i])) res++;
	        }
	        return res;
	    };
	    QuestionRowModel.prototype.isQuestionVisible = function (q) {
	        return this.page.isQuestionVisible(q);
	    };
	    QuestionRowModel.prototype.calcVisible = function () {
	        return this.getVisibleCount() > 0;
	    };
	    return QuestionRowModel;
	}();
	var PageModel = exports.PageModel = function (_super) {
	    __extends(PageModel, _super);
	    function PageModel(name) {
	        if (name === void 0) {
	            name = "";
	        }
	        _super.call(this);
	        this.name = name;
	        this.rowValues = null;
	        this.conditionRunner = null;
	        this.questions = new Array();
	        this.data = null;
	        this.visibleIf = "";
	        this.title = "";
	        this.visibleIndex = -1;
	        this.numValue = -1;
	        this.visibleValue = true;
	        this.idValue = PageModel.getPageId();
	        var self = this;
	        this.questions.push = function (value) {
	            if (self.data != null) {
	                value.setData(self.data);
	            }
	            return Array.prototype.push.call(this, value);
	        };
	    }
	    PageModel.getPageId = function () {
	        return "sp_" + PageModel.pageCounter++;
	    };
	    Object.defineProperty(PageModel.prototype, "id", {
	        get: function get() {
	            return this.idValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PageModel.prototype, "rows", {
	        get: function get() {
	            this.rowValues = this.buildRows();
	            return this.rowValues;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PageModel.prototype, "isActive", {
	        get: function get() {
	            return !this.data || this.data.currentPage == this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PageModel.prototype.isQuestionVisible = function (question) {
	        return question.visible || this.isDesignMode;
	    };
	    PageModel.prototype.createRow = function (question) {
	        return new QuestionRowModel(this, question);
	    };
	    Object.defineProperty(PageModel.prototype, "isDesignMode", {
	        get: function get() {
	            return this.data && this.data.isDesignMode;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PageModel.prototype.buildRows = function () {
	        var result = new Array();
	        var lastRowVisibleIndex = -1;
	        var self = this;
	        for (var i = 0; i < this.questions.length; i++) {
	            var q = this.questions[i];
	            result.push(this.createRow(q));
	            if (q.startWithNewLine) {
	                lastRowVisibleIndex = i;
	                result[i].addQuestion(q);
	            } else {
	                if (lastRowVisibleIndex < 0) lastRowVisibleIndex = i;
	                result[lastRowVisibleIndex].addQuestion(q);
	            }
	        }
	        for (var i = 0; i < result.length; i++) {
	            result[i].setWidth();
	        }
	        return result;
	    };
	    PageModel.prototype.onRowVisibilityChanged = function (row) {
	        if (!this.isActive || !this.rowValues) return;
	        var index = this.rowValues.indexOf(row);
	        for (var i = index; i >= 0; i--) {
	            if (this.rowValues[i].questions.indexOf(row.question) > -1) {
	                this.rowValues[i].updateVisible();
	                break;
	            }
	        }
	    };
	    Object.defineProperty(PageModel.prototype, "processedTitle", {
	        get: function get() {
	            return this.data != null ? this.data.processText(this.title) : this.title;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PageModel.prototype, "num", {
	        get: function get() {
	            return this.numValue;
	        },
	        set: function set(value) {
	            if (this.numValue == value) return;
	            this.numValue = value;
	            this.onNumChanged(value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PageModel.prototype, "visible", {
	        get: function get() {
	            return this.visibleValue;
	        },
	        set: function set(value) {
	            if (value === this.visible) return;
	            this.visibleValue = value;
	            if (this.data != null) {
	                this.data.pageVisibilityChanged(this, this.visible);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PageModel.prototype.getType = function () {
	        return "page";
	    };
	    Object.defineProperty(PageModel.prototype, "isVisible", {
	        get: function get() {
	            return this.getIsPageVisible(null);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PageModel.prototype.getIsPageVisible = function (exceptionQuestion) {
	        if (!this.visible) return false;
	        for (var i = 0; i < this.questions.length; i++) {
	            if (this.questions[i] == exceptionQuestion) continue;
	            if (this.questions[i].visible) return true;
	        }
	        return false;
	    };
	    PageModel.prototype.addQuestion = function (question, index) {
	        if (index === void 0) {
	            index = -1;
	        }
	        if (question == null) return;
	        if (index < 0 || index >= this.questions.length) {
	            this.questions.push(question);
	        } else {
	            this.questions.splice(index, 0, question);
	        }
	        if (this.data != null) {
	            question.setData(this.data);
	            this.data.questionAdded(question, index);
	        }
	    };
	    PageModel.prototype.addNewQuestion = function (questionType, name) {
	        var question = _questionfactory.QuestionFactory.Instance.createQuestion(questionType, name);
	        this.addQuestion(question);
	        return question;
	    };
	    PageModel.prototype.removeQuestion = function (question) {
	        var index = this.questions.indexOf(question);
	        if (index < 0) return;
	        this.questions.splice(index, 1);
	        if (this.data != null) this.data.questionRemoved(question);
	    };
	    PageModel.prototype.focusFirstQuestion = function () {
	        for (var i = 0; i < this.questions.length; i++) {
	            var question = this.questions[i];
	            if (!question.visible || !question.hasInput) continue;
	            this.questions[i].focus();
	            break;
	        }
	    };
	    PageModel.prototype.focusFirstErrorQuestion = function () {
	        for (var i = 0; i < this.questions.length; i++) {
	            if (!this.questions[i].visible || this.questions[i].currentErrorCount == 0) continue;
	            this.questions[i].focus(true);
	            break;
	        }
	    };
	    PageModel.prototype.scrollToTop = function () {
	        _base.SurveyElement.ScrollElementToTop(_base.SurveyPageId);
	    };
	    PageModel.prototype.hasErrors = function (fireCallback, focuseOnFirstError) {
	        if (fireCallback === void 0) {
	            fireCallback = true;
	        }
	        if (focuseOnFirstError === void 0) {
	            focuseOnFirstError = false;
	        }
	        var result = false;
	        var firstErrorQuestion = null;
	        for (var i = 0; i < this.questions.length; i++) {
	            if (this.questions[i].visible && this.questions[i].hasErrors(fireCallback)) {
	                if (focuseOnFirstError && firstErrorQuestion == null) {
	                    firstErrorQuestion = this.questions[i];
	                }
	                result = true;
	            }
	        }
	        if (firstErrorQuestion) firstErrorQuestion.focus(true);
	        return result;
	    };
	    PageModel.prototype.addQuestionsToList = function (list, visibleOnly) {
	        if (visibleOnly === void 0) {
	            visibleOnly = false;
	        }
	        if (visibleOnly && !this.visible) return;
	        for (var i = 0; i < this.questions.length; i++) {
	            if (visibleOnly && !this.questions[i].visible) continue;
	            list.push(this.questions[i]);
	        }
	    };
	    PageModel.prototype.runCondition = function (values) {
	        if (!this.visibleIf) return;
	        if (!this.conditionRunner) this.conditionRunner = new _conditions.ConditionRunner(this.visibleIf);
	        this.conditionRunner.expression = this.visibleIf;
	        this.visible = this.conditionRunner.run(values);
	    };
	    PageModel.prototype.onNumChanged = function (value) {};
	    PageModel.pageCounter = 100;
	    return PageModel;
	}(_base.Base);
	_jsonobject.JsonObject.metaData.addClass("page", ["name", { name: "questions", baseClassName: "question" }, { name: "visible:boolean", default: true }, "visibleIf", "title"], function () {
	    return new PageModel();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionCheckboxModel = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _question_baseselect = __webpack_require__(16);
	
	var QuestionCheckboxModel = exports.QuestionCheckboxModel = function (_super) {
	    __extends(QuestionCheckboxModel, _super);
	    function QuestionCheckboxModel(name) {
	        _super.call(this, name);
	        this.name = name;
	    }
	    QuestionCheckboxModel.prototype.getHasOther = function (val) {
	        if (!val || !Array.isArray(val)) return false;
	        return val.indexOf(this.otherItem.value) >= 0;
	    };
	    QuestionCheckboxModel.prototype.valueFromDataCore = function (val) {
	        if (!val || !Array.isArray(val)) return val;
	        for (var i = 0; i < val.length; i++) {
	            if (val[i] == this.otherItem.value) return val;
	            if (this.hasUnknownValue(val[i])) {
	                this.comment = val[i];
	                var newVal = val.slice();
	                newVal[i] = this.otherItem.value;
	                return newVal;
	            }
	        }
	        return val;
	    };
	    QuestionCheckboxModel.prototype.valueToDataCore = function (val) {
	        if (!val || !val.length) return val;
	        for (var i = 0; i < val.length; i++) {
	            if (val[i] == this.otherItem.value) {
	                if (this.getComment()) {
	                    var newVal = val.slice();
	                    newVal[i] = this.getComment();
	                    return newVal;
	                }
	            }
	        }
	        return val;
	    };
	    QuestionCheckboxModel.prototype.getType = function () {
	        return "checkbox";
	    };
	    return QuestionCheckboxModel;
	}(_question_baseselect.QuestionCheckboxBase);
	_jsonobject.JsonObject.metaData.addClass("checkbox", [], function () {
	    return new QuestionCheckboxModel("");
	}, "checkboxbase");
	_questionfactory.QuestionFactory.Instance.registerQuestion("checkbox", function (name) {
	    var q = new QuestionCheckboxModel(name);q.choices = _questionfactory.QuestionFactory.DefaultChoices;return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionCommentModel = undefined;
	
	var _question = __webpack_require__(13);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var QuestionCommentModel = exports.QuestionCommentModel = function (_super) {
	    __extends(QuestionCommentModel, _super);
	    function QuestionCommentModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.rows = 4;
	        this.cols = 50;
	    }
	    QuestionCommentModel.prototype.getType = function () {
	        return "comment";
	    };
	    QuestionCommentModel.prototype.isEmpty = function () {
	        return _super.prototype.isEmpty.call(this) || this.value == "";
	    };
	    return QuestionCommentModel;
	}(_question.Question);
	_jsonobject.JsonObject.metaData.addClass("comment", [{ name: "cols:number", default: 50 }, { name: "rows:number", default: 4 }], function () {
	    return new QuestionCommentModel("");
	}, "question");
	_questionfactory.QuestionFactory.Instance.registerQuestion("comment", function (name) {
	    return new QuestionCommentModel(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionDropdownModel = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _question_baseselect = __webpack_require__(16);
	
	var _surveyStrings = __webpack_require__(6);
	
	var QuestionDropdownModel = exports.QuestionDropdownModel = function (_super) {
	    __extends(QuestionDropdownModel, _super);
	    function QuestionDropdownModel(name) {
	        _super.call(this, name);
	        this.name = name;
	    }
	    Object.defineProperty(QuestionDropdownModel.prototype, "optionsCaption", {
	        get: function get() {
	            return this.optionsCaptionValue ? this.optionsCaptionValue : _surveyStrings.surveyLocalization.getString("optionsCaption");
	        },
	        set: function set(newValue) {
	            this.optionsCaptionValue = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionDropdownModel.prototype.getType = function () {
	        return "dropdown";
	    };
	    QuestionDropdownModel.prototype.supportGoNextPageAutomatic = function () {
	        return true;
	    };
	    return QuestionDropdownModel;
	}(_question_baseselect.QuestionSelectBase);
	_jsonobject.JsonObject.metaData.addClass("dropdown", [{ name: "optionsCaption", onGetValue: function onGetValue(obj) {
	        return obj.optionsCaptionValue;
	    } }], function () {
	    return new QuestionDropdownModel("");
	}, "selectbase");
	_questionfactory.QuestionFactory.Instance.registerQuestion("dropdown", function (name) {
	    var q = new QuestionDropdownModel(name);q.choices = _questionfactory.QuestionFactory.DefaultChoices;return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionFileModel = undefined;
	
	var _question = __webpack_require__(13);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _error = __webpack_require__(5);
	
	var _surveyStrings = __webpack_require__(6);
	
	var QuestionFileModel = exports.QuestionFileModel = function (_super) {
	    __extends(QuestionFileModel, _super);
	    function QuestionFileModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.showPreviewValue = false;
	        this.isUploading = false;
	    }
	    QuestionFileModel.prototype.getType = function () {
	        return "file";
	    };
	    Object.defineProperty(QuestionFileModel.prototype, "showPreview", {
	        get: function get() {
	            return this.showPreviewValue;
	        },
	        set: function set(value) {
	            this.showPreviewValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionFileModel.prototype.loadFile = function (file) {
	        var self = this;
	        if (this.survey && !this.survey.uploadFile(this.name, file, this.storeDataAsText, function (status) {
	            self.isUploading = status == "uploading";
	        })) return;
	        this.setFileValue(file);
	    };
	    QuestionFileModel.prototype.setFileValue = function (file) {
	        if (!FileReader) return;
	        if (!this.showPreview && !this.storeDataAsText) return;
	        if (this.checkFileForErrors(file)) return;
	        var fileReader = new FileReader();
	        var self = this;
	        fileReader.onload = function (e) {
	            if (self.showPreview) {
	                self.previewValue = self.isFileImage(file) ? fileReader.result : null;
	                self.fireCallback(self.previewValueLoadedCallback);
	            }
	            if (self.storeDataAsText) {
	                self.value = fileReader.result;
	            }
	        };
	        fileReader.readAsDataURL(file);
	    };
	    QuestionFileModel.prototype.onCheckForErrors = function (errors) {
	        _super.prototype.onCheckForErrors.call(this, errors);
	        if (this.isUploading) {
	            this.errors.push(new _error.CustomError(_surveyStrings.surveyLocalization.getString("uploadingFile")));
	        }
	    };
	    QuestionFileModel.prototype.checkFileForErrors = function (file) {
	        var errorLength = this.errors ? this.errors.length : 0;
	        this.errors = [];
	        if (this.maxSize > 0 && file.size > this.maxSize) {
	            this.errors.push(new _error.ExceedSizeError(this.maxSize));
	        }
	        if (errorLength != this.errors.length || this.errors.length > 0) {
	            this.fireCallback(this.errorsChangedCallback);
	        }
	        return this.errors.length > 0;
	    };
	    QuestionFileModel.prototype.isFileImage = function (file) {
	        if (!file || !file.type) return;
	        var str = file.type.toLowerCase();
	        return str.indexOf("image") == 0;
	    };
	    return QuestionFileModel;
	}(_question.Question);
	_jsonobject.JsonObject.metaData.addClass("file", ["showPreview:boolean", "imageHeight", "imageWidth", "storeDataAsText:boolean", "maxSize:number"], function () {
	    return new QuestionFileModel("");
	}, "question");
	_questionfactory.QuestionFactory.Instance.registerQuestion("file", function (name) {
	    return new QuestionFileModel(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionHtmlModel = undefined;
	
	var _questionbase = __webpack_require__(14);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var QuestionHtmlModel = exports.QuestionHtmlModel = function (_super) {
	    __extends(QuestionHtmlModel, _super);
	    function QuestionHtmlModel(name) {
	        _super.call(this, name);
	        this.name = name;
	    }
	    QuestionHtmlModel.prototype.getType = function () {
	        return "html";
	    };
	    Object.defineProperty(QuestionHtmlModel.prototype, "html", {
	        get: function get() {
	            return this.htmlValue;
	        },
	        set: function set(value) {
	            this.htmlValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionHtmlModel.prototype, "processedHtml", {
	        get: function get() {
	            return this.survey ? this.survey.processHtml(this.html) : this.html;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return QuestionHtmlModel;
	}(_questionbase.QuestionBase);
	_jsonobject.JsonObject.metaData.addClass("html", ["html:html"], function () {
	    return new QuestionHtmlModel("");
	}, "questionbase");
	_questionfactory.QuestionFactory.Instance.registerQuestion("html", function (name) {
	    return new QuestionHtmlModel(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionRadiogroupModel = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _question_baseselect = __webpack_require__(16);
	
	var QuestionRadiogroupModel = exports.QuestionRadiogroupModel = function (_super) {
	    __extends(QuestionRadiogroupModel, _super);
	    function QuestionRadiogroupModel(name) {
	        _super.call(this, name);
	        this.name = name;
	    }
	    QuestionRadiogroupModel.prototype.getType = function () {
	        return "radiogroup";
	    };
	    QuestionRadiogroupModel.prototype.supportGoNextPageAutomatic = function () {
	        return true;
	    };
	    return QuestionRadiogroupModel;
	}(_question_baseselect.QuestionCheckboxBase);
	_jsonobject.JsonObject.metaData.addClass("radiogroup", [], function () {
	    return new QuestionRadiogroupModel("");
	}, "checkboxbase");
	_questionfactory.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) {
	    var q = new QuestionRadiogroupModel(name);q.choices = _questionfactory.QuestionFactory.DefaultChoices;return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionRatingModel = undefined;
	
	var _base = __webpack_require__(4);
	
	var _question = __webpack_require__(13);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var QuestionRatingModel = exports.QuestionRatingModel = function (_super) {
	    __extends(QuestionRatingModel, _super);
	    function QuestionRatingModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.rates = [];
	        this.mininumRateDescription = null;
	        this.maximumRateDescription = null;
	    }
	    Object.defineProperty(QuestionRatingModel.prototype, "rateValues", {
	        get: function get() {
	            return this.rates;
	        },
	        set: function set(newValue) {
	            _base.ItemValue.setData(this.rates, newValue);
	            this.fireCallback(this.rateValuesChangedCallback);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(QuestionRatingModel.prototype, "visibleRateValues", {
	        get: function get() {
	            if (this.rateValues.length > 0) return this.rateValues;
	            return QuestionRatingModel.defaultRateValues;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionRatingModel.prototype.getType = function () {
	        return "rating";
	    };
	    QuestionRatingModel.prototype.supportComment = function () {
	        return true;
	    };
	    QuestionRatingModel.prototype.supportOther = function () {
	        return true;
	    };
	    QuestionRatingModel.prototype.supportGoNextPageAutomatic = function () {
	        return true;
	    };
	    QuestionRatingModel.defaultRateValues = [];
	    return QuestionRatingModel;
	}(_question.Question);
	_base.ItemValue.setData(QuestionRatingModel.defaultRateValues, [1, 2, 3, 4, 5]);
	_jsonobject.JsonObject.metaData.addClass("rating", ["hasComment:boolean", { name: "rateValues:itemvalues", onGetValue: function onGetValue(obj) {
	        return _base.ItemValue.getData(obj.rateValues);
	    }, onSetValue: function onSetValue(obj, value) {
	        obj.rateValues = value;
	    } }, "mininumRateDescription", "maximumRateDescription"], function () {
	    return new QuestionRatingModel("");
	}, "question");
	_questionfactory.QuestionFactory.Instance.registerQuestion("rating", function (name) {
	    return new QuestionRatingModel(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionTextModel = undefined;
	
	var _questionfactory = __webpack_require__(17);
	
	var _jsonobject = __webpack_require__(7);
	
	var _question = __webpack_require__(13);
	
	var QuestionTextModel = exports.QuestionTextModel = function (_super) {
	    __extends(QuestionTextModel, _super);
	    function QuestionTextModel(name) {
	        _super.call(this, name);
	        this.name = name;
	        this.size = 25;
	        this.inputType = "text";
	    }
	    QuestionTextModel.prototype.getType = function () {
	        return "text";
	    };
	    QuestionTextModel.prototype.isEmpty = function () {
	        return _super.prototype.isEmpty.call(this) || this.value == "";
	    };
	    QuestionTextModel.prototype.supportGoNextPageAutomatic = function () {
	        return true;
	    };
	    QuestionTextModel.prototype.setNewValue = function (newValue) {
	        newValue = this.correctValueType(newValue);
	        _super.prototype.setNewValue.call(this, newValue);
	    };
	    QuestionTextModel.prototype.correctValueType = function (newValue) {
	        if (!newValue) return newValue;
	        if (this.inputType == "number" || this.inputType == "range") {
	            return this.isNumber(newValue) ? parseFloat(newValue) : "";
	        }
	        return newValue;
	    };
	    QuestionTextModel.prototype.isNumber = function (value) {
	        return !isNaN(parseFloat(value)) && isFinite(value);
	    };
	    return QuestionTextModel;
	}(_question.Question);
	_jsonobject.JsonObject.metaData.addClass("text", [{ name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"] }, { name: "size:number", default: 25 }], function () {
	    return new QuestionTextModel("");
	}, "question");
	_questionfactory.QuestionFactory.Instance.registerQuestion("text", function (name) {
	    return new QuestionTextModel(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyModel = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _jsonobject = __webpack_require__(7);
	
	var _base = __webpack_require__(4);
	
	var _page = __webpack_require__(22);
	
	var _textPreProcessor = __webpack_require__(15);
	
	var _conditionProcessValue = __webpack_require__(11);
	
	var _dxSurveyService = __webpack_require__(32);
	
	var _surveyStrings = __webpack_require__(6);
	
	var _error = __webpack_require__(5);
	
	var SurveyModel = exports.SurveyModel = function (_super) {
	    __extends(SurveyModel, _super);
	    function SurveyModel(jsonObj) {
	        if (jsonObj === void 0) {
	            jsonObj = null;
	        }
	        _super.call(this);
	        this.surveyId = null;
	        this.surveyPostId = null;
	        this.clientId = null;
	        this.cookieName = null;
	        this.sendResultOnPageNext = false;
	        this.commentPrefix = "-Comment";
	        this.title = "";
	        this.showNavigationButtons = true;
	        this.showTitle = true;
	        this.showPageTitles = true;
	        this.completedHtml = "";
	        this.requiredText = "*";
	        this.questionStartIndex = "";
	        this.questionTitleTemplate = "";
	        this.showProgressBar = "off";
	        this.storeOthersAsComment = true;
	        this.goNextPageAutomatic = false;
	        this.pages = new Array();
	        this.triggers = new Array();
	        this.clearInvisibleValues = false;
	        this.currentPageValue = null;
	        this.valuesHash = {};
	        this.variablesHash = {};
	        this.showPageNumbersValue = false;
	        this.showQuestionNumbersValue = "on";
	        this.questionTitleLocationValue = "top";
	        this.localeValue = "";
	        this.isCompleted = false;
	        this.isLoading = false;
	        this.processedTextValues = {};
	        this.isValidatingOnServerValue = false;
	        this.modeValue = "edit";
	        this.isDesignModeValue = false;
	        this.onComplete = new _base.Event();
	        this.onCurrentPageChanged = new _base.Event();
	        this.onValueChanged = new _base.Event();
	        this.onVisibleChanged = new _base.Event();
	        this.onPageVisibleChanged = new _base.Event();
	        this.onQuestionAdded = new _base.Event();
	        this.onQuestionRemoved = new _base.Event();
	        this.onValidateQuestion = new _base.Event();
	        this.onProcessHtml = new _base.Event();
	        this.onSendResult = new _base.Event();
	        this.onGetResult = new _base.Event();
	        this.onUploadFile = new _base.Event();
	        this.jsonErrors = null;
	        var self = this;
	        this.textPreProcessor = new _textPreProcessor.TextPreProcessor();
	        this.textPreProcessor.onHasValue = function (name) {
	            return self.hasProcessedTextValue(name);
	        };
	        this.textPreProcessor.onProcess = function (name) {
	            return self.getProcessedTextValue(name);
	        };
	        this.pages.push = function (value) {
	            value.data = self;
	            return Array.prototype.push.call(this, value);
	        };
	        this.triggers.push = function (value) {
	            value.setOwner(self);
	            return Array.prototype.push.call(this, value);
	        };
	        this.updateProcessedTextValues();
	        this.onBeforeCreating();
	        if (jsonObj) {
	            this.setJsonObject(jsonObj);
	            if (this.surveyId) {
	                this.loadSurveyFromService(this.surveyId);
	            }
	        }
	        this.onCreating();
	    }
	    SurveyModel.prototype.getType = function () {
	        return "survey";
	    };
	    Object.defineProperty(SurveyModel.prototype, "locale", {
	        get: function get() {
	            return this.localeValue;
	        },
	        set: function set(value) {
	            this.localeValue = value;
	            _surveyStrings.surveyLocalization.currentLocale = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.getLocString = function (str) {
	        return _surveyStrings.surveyLocalization.getString(str);
	    };
	    Object.defineProperty(SurveyModel.prototype, "emptySurveyText", {
	        get: function get() {
	            return this.getLocString("emptySurvey");
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "pagePrevText", {
	        get: function get() {
	            return this.pagePrevTextValue ? this.pagePrevTextValue : this.getLocString("pagePrevText");
	        },
	        set: function set(newValue) {
	            this.pagePrevTextValue = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "pageNextText", {
	        get: function get() {
	            return this.pageNextTextValue ? this.pageNextTextValue : this.getLocString("pageNextText");
	        },
	        set: function set(newValue) {
	            this.pageNextTextValue = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "completeText", {
	        get: function get() {
	            return this.completeTextValue ? this.completeTextValue : this.getLocString("completeText");
	        },
	        set: function set(newValue) {
	            this.completeTextValue = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "showPageNumbers", {
	        get: function get() {
	            return this.showPageNumbersValue;
	        },
	        set: function set(value) {
	            if (value === this.showPageNumbers) return;
	            this.showPageNumbersValue = value;
	            this.updateVisibleIndexes();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "showQuestionNumbers", {
	        get: function get() {
	            return this.showQuestionNumbersValue;
	        },
	        set: function set(value) {
	            if (value === this.showQuestionNumbers) return;
	            this.showQuestionNumbersValue = value;
	            this.updateVisibleIndexes();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    ;
	    Object.defineProperty(SurveyModel.prototype, "questionTitleLocation", {
	        get: function get() {
	            return this.questionTitleLocationValue;
	        },
	        set: function set(value) {
	            if (value === this.questionTitleLocationValue) return;
	            this.questionTitleLocationValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    ;
	    Object.defineProperty(SurveyModel.prototype, "mode", {
	        get: function get() {
	            return this.modeValue;
	        },
	        set: function set(value) {
	            if (value == this.mode) return;
	            if (value != "edit" && value != "display") return;
	            this.modeValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "data", {
	        get: function get() {
	            var result = {};
	            for (var key in this.valuesHash) {
	                result[key] = this.valuesHash[key];
	            }
	            return result;
	        },
	        set: function set(data) {
	            this.valuesHash = {};
	            if (data) {
	                for (var key in data) {
	                    this.valuesHash[key] = data[key];
	                    this.checkTriggers(key, data[key], false);
	                }
	            }
	            this.notifyAllQuestionsOnValueChanged();
	            this.runConditions();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "comments", {
	        get: function get() {
	            var result = {};
	            for (var key in this.valuesHash) {
	                if (key.indexOf(this.commentPrefix) > 0) {
	                    result[key] = this.valuesHash[key];
	                }
	            }
	            return result;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "visiblePages", {
	        get: function get() {
	            if (this.isDesignMode) return this.pages;
	            var result = new Array();
	            for (var i = 0; i < this.pages.length; i++) {
	                if (this.pages[i].isVisible) {
	                    result.push(this.pages[i]);
	                }
	            }
	            return result;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "isEmpty", {
	        get: function get() {
	            return this.pages.length == 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "PageCount", {
	        get: function get() {
	            return this.pages.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "visiblePageCount", {
	        get: function get() {
	            return this.visiblePages.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "currentPage", {
	        get: function get() {
	            var vPages = this.visiblePages;
	            if (this.currentPageValue != null) {
	                if (vPages.indexOf(this.currentPageValue) < 0) {
	                    this.currentPage = null;
	                }
	            }
	            if (this.currentPageValue == null && vPages.length > 0) {
	                this.currentPage = vPages[0];
	            }
	            return this.currentPageValue;
	        },
	        set: function set(value) {
	            var vPages = this.visiblePages;
	            if (value != null && vPages.indexOf(value) < 0) return;
	            if (value == this.currentPageValue) return;
	            var oldValue = this.currentPageValue;
	            this.currentPageValue = value;
	            this.currentPageChanged(value, oldValue);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "currentPageNo", {
	        get: function get() {
	            return this.visiblePages.indexOf(this.currentPage);
	        },
	        set: function set(value) {
	            var vPages = this.visiblePages;
	            if (value < 0 || value >= this.visiblePages.length) return;
	            this.currentPage = this.visiblePages[value];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.focusFirstQuestion = function () {
	        if (this.currentPageValue) {
	            this.currentPageValue.scrollToTop();
	            this.currentPageValue.focusFirstQuestion();
	        }
	    };
	    Object.defineProperty(SurveyModel.prototype, "state", {
	        get: function get() {
	            if (this.isLoading) return "loading";
	            if (this.isCompleted) return "completed";
	            return this.currentPage ? "running" : "empty";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.clear = function (clearData, gotoFirstPage) {
	        if (clearData === void 0) {
	            clearData = true;
	        }
	        if (gotoFirstPage === void 0) {
	            gotoFirstPage = true;
	        }
	        if (clearData) {
	            this.data = null;
	            this.variablesHash = {};
	        }
	        this.isCompleted = false;
	        if (gotoFirstPage && this.visiblePageCount > 0) {
	            this.currentPage = this.visiblePages[0];
	        }
	    };
	    SurveyModel.prototype.mergeValues = function (src, dest) {
	        if (!dest || !src) return;
	        for (var key in src) {
	            var value = src[key];
	            if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') {
	                if (!dest[key]) dest[key] = {};
	                this.mergeValues(value, dest[key]);
	            } else {
	                dest[key] = value;
	            }
	        }
	    };
	    SurveyModel.prototype.currentPageChanged = function (newValue, oldValue) {
	        this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
	    };
	    SurveyModel.prototype.getProgress = function () {
	        if (this.currentPage == null) return 0;
	        var index = this.visiblePages.indexOf(this.currentPage) + 1;
	        return Math.ceil(index * 100 / this.visiblePageCount);
	    };
	    Object.defineProperty(SurveyModel.prototype, "isEditMode", {
	        get: function get() {
	            return this.mode == "edit";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "isDisplayMode", {
	        get: function get() {
	            return this.mode == "display";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "isDesignMode", {
	        get: function get() {
	            return this.isDesignModeValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.setDesignMode = function (value) {
	        this.isDesignModeValue = value;
	    };
	    Object.defineProperty(SurveyModel.prototype, "hasCookie", {
	        get: function get() {
	            if (!this.cookieName) return false;
	            var cookies = document.cookie;
	            return cookies && cookies.indexOf(this.cookieName + "=true") > -1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.setCookie = function () {
	        if (!this.cookieName) return;
	        document.cookie = this.cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT";
	    };
	    SurveyModel.prototype.deleteCookie = function () {
	        if (!this.cookieName) return;
	        document.cookie = this.cookieName + "=;";
	    };
	    SurveyModel.prototype.nextPage = function () {
	        if (this.isLastPage) return false;
	        if (this.isEditMode && this.isCurrentPageHasErrors) return false;
	        if (this.doServerValidation()) return false;
	        this.doNextPage();
	        return true;
	    };
	    Object.defineProperty(SurveyModel.prototype, "isCurrentPageHasErrors", {
	        get: function get() {
	            if (this.currentPage == null) return true;
	            return this.currentPage.hasErrors(true, true);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.prevPage = function () {
	        if (this.isFirstPage) return false;
	        var vPages = this.visiblePages;
	        var index = vPages.indexOf(this.currentPage);
	        this.currentPage = vPages[index - 1];
	    };
	    SurveyModel.prototype.completeLastPage = function () {
	        if (this.isEditMode && this.isCurrentPageHasErrors) return false;
	        if (this.doServerValidation()) return false;
	        this.doComplete();
	        return true;
	    };
	    Object.defineProperty(SurveyModel.prototype, "isFirstPage", {
	        get: function get() {
	            if (this.currentPage == null) return true;
	            return this.visiblePages.indexOf(this.currentPage) == 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "isLastPage", {
	        get: function get() {
	            if (this.currentPage == null) return true;
	            var vPages = this.visiblePages;
	            return vPages.indexOf(this.currentPage) == vPages.length - 1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.doComplete = function () {
	        if (this.clearInvisibleValues) {
	            this.clearInvisibleQuestionValues();
	        }
	        this.setCookie();
	        this.setCompleted();
	        this.onComplete.fire(this, null);
	        if (this.surveyPostId) {
	            this.sendResult();
	        }
	    };
	    Object.defineProperty(SurveyModel.prototype, "isValidatingOnServer", {
	        get: function get() {
	            return this.isValidatingOnServerValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.setIsValidatingOnServer = function (val) {
	        if (val == this.isValidatingOnServer) return;
	        this.isValidatingOnServerValue = val;
	        this.onIsValidatingOnServerChanged();
	    };
	    SurveyModel.prototype.onIsValidatingOnServerChanged = function () {};
	    SurveyModel.prototype.doServerValidation = function () {
	        if (!this.onServerValidateQuestions) return false;
	        var self = this;
	        var options = { data: {}, errors: {}, survey: this, complete: function complete() {
	                self.completeServerValidation(options);
	            } };
	        for (var i = 0; i < this.currentPage.questions.length; i++) {
	            var question = this.currentPage.questions[i];
	            if (!question.visible) continue;
	            var value = this.getValue(question.name);
	            if (value) options.data[question.name] = value;
	        }
	        this.setIsValidatingOnServer(true);
	        this.onServerValidateQuestions(this, options);
	        return true;
	    };
	    SurveyModel.prototype.completeServerValidation = function (options) {
	        this.setIsValidatingOnServer(false);
	        if (!options && !options.survey) return;
	        var self = options.survey;
	        var hasErrors = false;
	        if (options.errors) {
	            for (var name in options.errors) {
	                var question = self.getQuestionByName(name);
	                if (question && question["errors"]) {
	                    hasErrors = true;
	                    question["addError"](new _error.CustomError(options.errors[name]));
	                }
	            }
	        }
	        if (!hasErrors) {
	            if (self.isLastPage) self.doComplete();else self.doNextPage();
	        }
	    };
	    SurveyModel.prototype.doNextPage = function () {
	        this.checkOnPageTriggers();
	        if (this.sendResultOnPageNext && this.clientId) {
	            this.sendResult(this.surveyPostId, this.clientId, true);
	        }
	        var vPages = this.visiblePages;
	        var index = vPages.indexOf(this.currentPage);
	        this.currentPage = vPages[index + 1];
	    };
	    SurveyModel.prototype.setCompleted = function () {
	        this.isCompleted = true;
	    };
	    Object.defineProperty(SurveyModel.prototype, "processedCompletedHtml", {
	        get: function get() {
	            if (this.completedHtml) {
	                return this.processHtml(this.completedHtml);
	            }
	            return "<h3>" + this.getLocString("completingSurvey") + "</h3>";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "processedLoadingHtml", {
	        get: function get() {
	            return "<h3>" + this.getLocString("loadingSurvey") + "</h3>";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyModel.prototype, "progressText", {
	        get: function get() {
	            if (this.currentPage == null) return "";
	            var vPages = this.visiblePages;
	            var index = vPages.indexOf(this.currentPage) + 1;
	            return this.getLocString("progressText")["format"](index, vPages.length);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyModel.prototype.uploadFile = function (name, file, storeDataAsText, uploadingCallback) {
	        var accept = true;
	        this.onUploadFile.fire(this, { name: name, file: file, accept: accept });
	        if (!accept) return false;
	        if (!storeDataAsText && this.surveyPostId) {
	            this.uploadFileCore(name, file, uploadingCallback);
	        }
	        return true;
	    };
	    SurveyModel.prototype.uploadFileCore = function (name, file, uploadingCallback) {
	        var self = this;
	        if (uploadingCallback) uploadingCallback("uploading");
	        new _dxSurveyService.dxSurveyService().sendFile(this.surveyPostId, file, function (success, response) {
	            if (uploadingCallback) uploadingCallback(success ? "success" : "error");
	            if (success) {
	                self.setValue(name, response);
	            }
	        });
	    };
	    SurveyModel.prototype.getPage = function (index) {
	        return this.pages[index];
	    };
	    SurveyModel.prototype.addPage = function (page) {
	        if (page == null) return;
	        this.pages.push(page);
	        this.updateVisibleIndexes();
	    };
	    SurveyModel.prototype.addNewPage = function (name) {
	        var page = this.createNewPage(name);
	        this.addPage(page);
	        return page;
	    };
	    SurveyModel.prototype.removePage = function (page) {
	        var index = this.pages.indexOf(page);
	        if (index < 0) return;
	        this.pages.splice(index, 1);
	        if (this.currentPageValue == page) {
	            this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
	        }
	        this.updateVisibleIndexes();
	    };
	    SurveyModel.prototype.getQuestionByName = function (name, caseInsensitive) {
	        if (caseInsensitive === void 0) {
	            caseInsensitive = false;
	        }
	        var questions = this.getAllQuestions();
	        if (caseInsensitive) name = name.toLowerCase();
	        for (var i = 0; i < questions.length; i++) {
	            var questionName = questions[i].name;
	            if (caseInsensitive) questionName = questionName.toLowerCase();
	            if (questionName == name) return questions[i];
	        }
	        return null;
	    };
	    SurveyModel.prototype.getQuestionsByNames = function (names, caseInsensitive) {
	        if (caseInsensitive === void 0) {
	            caseInsensitive = false;
	        }
	        var result = [];
	        if (!names) return result;
	        for (var i = 0; i < names.length; i++) {
	            if (!names[i]) continue;
	            var question = this.getQuestionByName(names[i], caseInsensitive);
	            if (question) result.push(question);
	        }
	        return result;
	    };
	    SurveyModel.prototype.getPageByQuestion = function (question) {
	        for (var i = 0; i < this.pages.length; i++) {
	            var page = this.pages[i];
	            if (page.questions.indexOf(question) > -1) return page;
	        }
	        return null;
	    };
	    SurveyModel.prototype.getPageByName = function (name) {
	        for (var i = 0; i < this.pages.length; i++) {
	            if (this.pages[i].name == name) return this.pages[i];
	        }
	        return null;
	    };
	    SurveyModel.prototype.getPagesByNames = function (names) {
	        var result = [];
	        if (!names) return result;
	        for (var i = 0; i < names.length; i++) {
	            if (!names[i]) continue;
	            var page = this.getPageByName(names[i]);
	            if (page) result.push(page);
	        }
	        return result;
	    };
	    SurveyModel.prototype.getAllQuestions = function (visibleOnly) {
	        if (visibleOnly === void 0) {
	            visibleOnly = false;
	        }
	        var result = new Array();
	        for (var i = 0; i < this.pages.length; i++) {
	            this.pages[i].addQuestionsToList(result, visibleOnly);
	        }
	        return result;
	    };
	    SurveyModel.prototype.createNewPage = function (name) {
	        return new _page.PageModel(name);
	    };
	    SurveyModel.prototype.notifyQuestionOnValueChanged = function (name, newValue) {
	        var questions = this.getAllQuestions();
	        var question = null;
	        for (var i = 0; i < questions.length; i++) {
	            if (questions[i].name != name) continue;
	            question = questions[i];
	            this.doSurveyValueChanged(question, newValue);
	        }
	        this.onValueChanged.fire(this, { 'name': name, 'question': question, 'value': newValue });
	    };
	    SurveyModel.prototype.notifyAllQuestionsOnValueChanged = function () {
	        var questions = this.getAllQuestions();
	        for (var i = 0; i < questions.length; i++) {
	            this.doSurveyValueChanged(questions[i], this.getValue(questions[i].name));
	        }
	    };
	    SurveyModel.prototype.doSurveyValueChanged = function (question, newValue) {
	        question.onSurveyValueChanged(newValue);
	    };
	    SurveyModel.prototype.checkOnPageTriggers = function () {
	        var questions = this.getCurrentPageQuestions();
	        for (var i = 0; i < questions.length; i++) {
	            var question = questions[i];
	            var value = this.getValue(question.name);
	            this.checkTriggers(question.name, value, true);
	        }
	    };
	    SurveyModel.prototype.getCurrentPageQuestions = function () {
	        var result = [];
	        var page = this.currentPage;
	        if (!page) return result;
	        for (var i = 0; i < page.questions.length; i++) {
	            var question = page.questions[i];
	            if (!question.visible || !question.name) continue;
	            result.push(question);
	        }
	        return result;
	    };
	    SurveyModel.prototype.checkTriggers = function (name, newValue, isOnNextPage) {
	        for (var i = 0; i < this.triggers.length; i++) {
	            var trigger = this.triggers[i];
	            if (trigger.name == name && trigger.isOnNextPage == isOnNextPage) {
	                trigger.check(newValue);
	            }
	        }
	    };
	    SurveyModel.prototype.doQuestionsOnLoad = function () {
	        var questions = this.getAllQuestions(false);
	        for (var i = 0; i < questions.length; i++) {
	            questions[i].onSurveyLoad();
	        }
	    };
	    SurveyModel.prototype.runConditions = function () {
	        this.runConditionsForList(this.getAllQuestions(false));
	        this.runConditionsForList(this.pages);
	    };
	    SurveyModel.prototype.runConditionsForList = function (list) {
	        for (var i = 0; i < list.length; i++) {
	            list[i].runCondition(this.valuesHash);
	        }
	    };
	    SurveyModel.prototype.sendResult = function (postId, clientId, isPartialCompleted) {
	        if (postId === void 0) {
	            postId = null;
	        }
	        if (clientId === void 0) {
	            clientId = null;
	        }
	        if (isPartialCompleted === void 0) {
	            isPartialCompleted = false;
	        }
	        if (this.isEditMode) return;
	        if (!postId && this.surveyPostId) {
	            postId = this.surveyPostId;
	        }
	        if (!postId) return;
	        if (clientId) {
	            this.clientId = clientId;
	        }
	        var self = this;
	        new _dxSurveyService.dxSurveyService().sendResult(postId, this.data, function (success, response) {
	            self.onSendResult.fire(self, { success: success, response: response });
	        }, this.clientId, isPartialCompleted);
	    };
	    SurveyModel.prototype.getResult = function (resultId, name) {
	        var self = this;
	        new _dxSurveyService.dxSurveyService().getResult(resultId, name, function (success, data, dataList, response) {
	            self.onGetResult.fire(self, { success: success, data: data, dataList: dataList, response: response });
	        });
	    };
	    SurveyModel.prototype.loadSurveyFromService = function (surveyId) {
	        if (surveyId === void 0) {
	            surveyId = null;
	        }
	        if (surveyId) {
	            this.surveyId = surveyId;
	        }
	        var self = this;
	        this.isLoading = true;
	        this.onLoadingSurveyFromService();
	        new _dxSurveyService.dxSurveyService().loadSurvey(this.surveyId, function (success, result, response) {
	            self.isLoading = false;
	            if (success && result) {
	                self.setJsonObject(result);
	                self.notifyAllQuestionsOnValueChanged();
	                self.onLoadSurveyFromService();
	            }
	        });
	    };
	    SurveyModel.prototype.onLoadingSurveyFromService = function () {};
	    SurveyModel.prototype.onLoadSurveyFromService = function () {};
	    SurveyModel.prototype.checkPageVisibility = function (question, oldQuestionVisible) {
	        var page = this.getPageByQuestion(question);
	        if (!page) return;
	        var newValue = page.isVisible;
	        if (newValue != page.getIsPageVisible(question) || oldQuestionVisible) {
	            this.pageVisibilityChanged(page, newValue);
	        }
	    };
	    SurveyModel.prototype.updateVisibleIndexes = function () {
	        this.updatePageVisibleIndexes(this.showPageNumbers);
	        if (this.showQuestionNumbers == "onPage") {
	            var visPages = this.visiblePages;
	            for (var i = 0; i < visPages.length; i++) {
	                this.updateQuestionVisibleIndexes(visPages[i].questions, true);
	            }
	        } else {
	            this.updateQuestionVisibleIndexes(this.getAllQuestions(false), this.showQuestionNumbers == "on");
	        }
	    };
	    SurveyModel.prototype.updatePageVisibleIndexes = function (showIndex) {
	        var index = 0;
	        for (var i = 0; i < this.pages.length; i++) {
	            this.pages[i].visibleIndex = this.pages[i].visible ? index++ : -1;
	            this.pages[i].num = showIndex && this.pages[i].visible ? this.pages[i].visibleIndex + 1 : -1;
	        }
	    };
	    SurveyModel.prototype.updateQuestionVisibleIndexes = function (questions, showIndex) {
	        var index = 0;
	        for (var i = 0; i < questions.length; i++) {
	            questions[i].setVisibleIndex(showIndex && questions[i].visible && questions[i].hasTitle ? index++ : -1);
	        }
	    };
	    SurveyModel.prototype.setJsonObject = function (jsonObj) {
	        if (!jsonObj) return;
	        this.jsonErrors = null;
	        var jsonConverter = new _jsonobject.JsonObject();
	        jsonConverter.toObject(jsonObj, this);
	        if (jsonConverter.errors.length > 0) {
	            this.jsonErrors = jsonConverter.errors;
	        }
	        this.updateProcessedTextValues();
	        if (this.hasCookie) {
	            this.doComplete();
	        }
	        this.doQuestionsOnLoad();
	        this.runConditions();
	        this.updateVisibleIndexes();
	    };
	    SurveyModel.prototype.onBeforeCreating = function () {};
	    SurveyModel.prototype.onCreating = function () {};
	    SurveyModel.prototype.updateProcessedTextValues = function () {
	        this.processedTextValues = {};
	        var self = this;
	        this.processedTextValues["pageno"] = function (name) {
	            return self.currentPage != null ? self.visiblePages.indexOf(self.currentPage) + 1 : 0;
	        };
	        this.processedTextValues["pagecount"] = function (name) {
	            return self.visiblePageCount;
	        };
	        var questions = this.getAllQuestions();
	        for (var i = 0; i < questions.length; i++) {
	            this.addQuestionToProcessedTextValues(questions[i]);
	        }
	    };
	    SurveyModel.prototype.addQuestionToProcessedTextValues = function (question) {
	        this.processedTextValues[question.name.toLowerCase()] = "question";
	    };
	    SurveyModel.prototype.hasProcessedTextValue = function (name) {
	        var firstName = new _conditionProcessValue.ProcessValue().getFirstName(name);
	        return this.processedTextValues[firstName.toLowerCase()];
	    };
	    SurveyModel.prototype.getProcessedTextValue = function (name) {
	        var firstName = new _conditionProcessValue.ProcessValue().getFirstName(name);
	        var val = this.processedTextValues[firstName.toLowerCase()];
	        if (!val) return null;
	        if (val == "variable") {
	            return this.getVariable(name.toLowerCase());
	        }
	        if (val == "question") {
	            var question = this.getQuestionByName(firstName, true);
	            if (!question) return null;
	            name = question.name + name.substr(firstName.length);
	            return new _conditionProcessValue.ProcessValue().getValue(name, this.valuesHash);
	        }
	        if (val == "value") {
	            return new _conditionProcessValue.ProcessValue().getValue(name, this.valuesHash);
	        }
	        return val(name);
	    };
	    SurveyModel.prototype.clearInvisibleQuestionValues = function () {
	        var questions = this.getAllQuestions();
	        for (var i = 0; i < questions.length; i++) {
	            if (questions[i].visible) continue;
	            this.setValue(questions[i].name, null);
	        }
	    };
	    SurveyModel.prototype.getVariable = function (name) {
	        if (!name) return null;
	        return this.variablesHash[name];
	    };
	    SurveyModel.prototype.setVariable = function (name, newValue) {
	        if (!name) return;
	        this.variablesHash[name] = newValue;
	        this.processedTextValues[name.toLowerCase()] = "variable";
	    };
	    //ISurvey data
	    SurveyModel.prototype.getUnbindValue = function (value) {
	        if (value && value instanceof Object) {
	            //do not return the same object instance!!!
	            return JSON.parse(JSON.stringify(value));
	        }
	        return value;
	    };
	    SurveyModel.prototype.getValue = function (name) {
	        if (!name || name.length == 0) return null;
	        var value = this.valuesHash[name];
	        return this.getUnbindValue(value);
	    };
	    SurveyModel.prototype.setValue = function (name, newValue) {
	        if (this.isValueEqual(name, newValue)) return;
	        if (newValue == "" || newValue == null) {
	            delete this.valuesHash[name];
	        } else {
	            newValue = this.getUnbindValue(newValue);
	            this.valuesHash[name] = newValue;
	            this.processedTextValues[name.toLowerCase()] = "value";
	        }
	        this.notifyQuestionOnValueChanged(name, newValue);
	        this.checkTriggers(name, newValue, false);
	        this.runConditions();
	        this.tryGoNextPageAutomatic(name);
	    };
	    SurveyModel.prototype.isValueEqual = function (name, newValue) {
	        if (newValue == "") newValue = null;
	        var oldValue = this.getValue(name);
	        if (newValue === null || oldValue === null) return newValue === oldValue;
	        return this.isTwoValueEquals(newValue, oldValue);
	    };
	    SurveyModel.prototype.isTwoValueEquals = function (x, y) {
	        if (x === y) return true;
	        if (!(x instanceof Object) || !(y instanceof Object)) return false;
	        for (var p in x) {
	            if (!x.hasOwnProperty(p)) continue;
	            if (!y.hasOwnProperty(p)) return false;
	            if (x[p] === y[p]) continue;
	            if (_typeof(x[p]) !== "object") return false;
	            if (!this.isTwoValueEquals(x[p], y[p])) return false;
	        }
	        for (p in y) {
	            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
	        }
	        return true;
	    };
	    SurveyModel.prototype.tryGoNextPageAutomatic = function (name) {
	        if (!this.goNextPageAutomatic || !this.currentPage) return;
	        var question = this.getQuestionByName(name);
	        if (question && !question.supportGoNextPageAutomatic()) return;
	        var questions = this.getCurrentPageQuestions();
	        for (var i = 0; i < questions.length; i++) {
	            if (!this.getValue(questions[i].name)) return;
	        }
	        if (!this.currentPage.hasErrors(true, false)) {
	            if (!this.isLastPage) {
	                this.nextPage();
	            } else {
	                this.doComplete();
	            }
	        }
	    };
	    SurveyModel.prototype.getComment = function (name) {
	        var result = this.data[name + this.commentPrefix];
	        if (result == null) result = "";
	        return result;
	    };
	    SurveyModel.prototype.setComment = function (name, newValue) {
	        name = name + this.commentPrefix;
	        if (newValue == "" || newValue == null) {
	            delete this.valuesHash[name];
	        } else {
	            this.valuesHash[name] = newValue;
	            this.tryGoNextPageAutomatic(name);
	        }
	    };
	    SurveyModel.prototype.questionVisibilityChanged = function (question, newValue) {
	        this.updateVisibleIndexes();
	        this.onVisibleChanged.fire(this, { 'question': question, 'name': question.name, 'visible': newValue });
	        this.checkPageVisibility(question, !newValue);
	    };
	    SurveyModel.prototype.pageVisibilityChanged = function (page, newValue) {
	        this.updateVisibleIndexes();
	        this.onPageVisibleChanged.fire(this, { 'page': page, 'visible': newValue });
	    };
	    SurveyModel.prototype.questionAdded = function (question, index) {
	        this.updateVisibleIndexes();
	        this.addQuestionToProcessedTextValues(question);
	        this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index });
	    };
	    SurveyModel.prototype.questionRemoved = function (question) {
	        this.updateVisibleIndexes();
	        this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
	    };
	    SurveyModel.prototype.validateQuestion = function (name) {
	        if (this.onValidateQuestion.isEmpty) return null;
	        var options = { name: name, value: this.getValue(name), error: null };
	        this.onValidateQuestion.fire(this, options);
	        return options.error ? new _error.CustomError(options.error) : null;
	    };
	    SurveyModel.prototype.processHtml = function (html) {
	        var options = { html: html };
	        this.onProcessHtml.fire(this, options);
	        return this.processText(options.html);
	    };
	    SurveyModel.prototype.processText = function (text) {
	        return this.textPreProcessor.process(text);
	    };
	    //ISurveyTriggerOwner
	    SurveyModel.prototype.getObjects = function (pages, questions) {
	        var result = [];
	        Array.prototype.push.apply(result, this.getPagesByNames(pages));
	        Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
	        return result;
	    };
	    SurveyModel.prototype.setTriggerValue = function (name, value, isVariable) {
	        if (!name) return;
	        if (isVariable) {
	            this.setVariable(name, value);
	        } else {
	            this.setValue(name, value);
	        }
	    };
	    return SurveyModel;
	}(_base.Base);
	_jsonobject.JsonObject.metaData.addClass("survey", [{ name: "locale", choices: function choices() {
	        return _surveyStrings.surveyLocalization.getLocales();
	    } }, "title", "completedHtml:html", { name: "pages", className: "page" }, { name: "questions", baseClassName: "question", onGetValue: function onGetValue(obj) {
	        return null;
	    }, onSetValue: function onSetValue(obj, value, jsonConverter) {
	        var page = obj.addNewPage("");jsonConverter.toObject({ questions: value }, page);
	    } }, { name: "triggers:triggers", baseClassName: "surveytrigger", classNamePart: "trigger" }, "surveyId", "surveyPostId", "cookieName", "sendResultOnPageNext:boolean", { name: "showNavigationButtons:boolean", default: true }, { name: "showTitle:boolean", default: true }, { name: "showPageTitles:boolean", default: true }, "showPageNumbers:boolean", { name: "showQuestionNumbers", default: "on", choices: ["on", "onPage", "off"] }, { name: "questionTitleLocation", default: "top", choices: ["top", "bottom"] }, { name: "showProgressBar", default: "off", choices: ["off", "top", "bottom"] }, { name: "mode", default: "edit", choices: ["edit", "display"] }, { name: "storeOthersAsComment:boolean", default: true }, "goNextPageAutomatic:boolean", "clearInvisibleValues:boolean", { name: "pagePrevText", onGetValue: function onGetValue(obj) {
	        return obj.pagePrevTextValue;
	    } }, { name: "pageNextText", onGetValue: function onGetValue(obj) {
	        return obj.pageNextTextValue;
	    } }, { name: "completeText", onGetValue: function onGetValue(obj) {
	        return obj.completeTextValue;
	    } }, { name: "requiredText", default: "*" }, "questionStartIndex", "questionTitleTemplate"]);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var dxSurveyService = exports.dxSurveyService = function () {
	    //public static serviceUrl: string = "http://localhost:50488/api/Survey";
	    function dxSurveyService() {}
	    dxSurveyService.prototype.loadSurvey = function (surveyId, onLoad) {
	        var xhr = new XMLHttpRequest();
	        xhr.open('GET', dxSurveyService.serviceUrl + '/getSurvey?surveyId=' + surveyId);
	        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        xhr.onload = function () {
	            var result = JSON.parse(xhr.response);
	            onLoad(xhr.status == 200, result, xhr.response);
	        };
	        xhr.send();
	    };
	    dxSurveyService.prototype.sendResult = function (postId, result, onSendResult, clientId, isPartialCompleted) {
	        if (clientId === void 0) {
	            clientId = null;
	        }
	        if (isPartialCompleted === void 0) {
	            isPartialCompleted = false;
	        }
	        var xhr = new XMLHttpRequest();
	        xhr.open('POST', dxSurveyService.serviceUrl + '/post/');
	        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	        var data = { postId: postId, surveyResult: JSON.stringify(result) };
	        if (clientId) data['clientId'] = clientId;
	        if (isPartialCompleted) data['isPartialCompleted'] = true;
	        var dataStringify = JSON.stringify(data);
	        var self = this;
	        xhr.onload = xhr.onerror = function () {
	            if (!onSendResult) return;
	            onSendResult(xhr.status == 200, xhr.response);
	        };
	        xhr.send(dataStringify);
	    };
	    dxSurveyService.prototype.sendFile = function (postId, file, onSendFile) {
	        var xhr = new XMLHttpRequest();
	        xhr.onload = xhr.onerror = function () {
	            if (!onSendFile) return;
	            onSendFile(xhr.status == 200, JSON.parse(xhr.response));
	        };
	        xhr.open("POST", dxSurveyService.serviceUrl + '/upload/', true);
	        var formData = new FormData();
	        formData.append("file", file);
	        formData.append("postId", postId);
	        xhr.send(formData);
	    };
	    dxSurveyService.prototype.getResult = function (resultId, name, onGetResult) {
	        var xhr = new XMLHttpRequest();
	        var data = 'resultId=' + resultId + '&name=' + name;
	        xhr.open('GET', dxSurveyService.serviceUrl + '/getResult?' + data);
	        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        var self = this;
	        xhr.onload = function () {
	            var result = null;
	            var list = null;
	            if (xhr.status == 200) {
	                result = JSON.parse(xhr.response);
	                list = [];
	                for (var key in result.QuestionResult) {
	                    var el = { name: key, value: result.QuestionResult[key] };
	                    list.push(el);
	                }
	            }
	            onGetResult(xhr.status == 200, result, list, xhr.response);
	        };
	        xhr.send();
	    };
	    dxSurveyService.prototype.isCompleted = function (resultId, clientId, onIsCompleted) {
	        var xhr = new XMLHttpRequest();
	        var data = 'resultId=' + resultId + '&clientId=' + clientId;
	        xhr.open('GET', dxSurveyService.serviceUrl + '/isCompleted?' + data);
	        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        var self = this;
	        xhr.onload = function () {
	            var result = null;
	            if (xhr.status == 200) {
	                result = JSON.parse(xhr.response);
	            }
	            onIsCompleted(xhr.status == 200, result, xhr.response);
	        };
	        xhr.send();
	    };
	    dxSurveyService.serviceUrl = "https://dxsurveyapi.azurewebsites.net/api/Survey";
	    return dxSurveyService;
	}();

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyTriggerSetValue = exports.SurveyTriggerComplete = exports.SurveyTriggerVisible = exports.SurveyTrigger = exports.Trigger = undefined;
	
	var _base = __webpack_require__(4);
	
	var _jsonobject = __webpack_require__(7);
	
	var Trigger = exports.Trigger = function (_super) {
	    __extends(Trigger, _super);
	    function Trigger() {
	        _super.call(this);
	        this.opValue = "equal";
	    }
	    Object.defineProperty(Trigger, "operators", {
	        get: function get() {
	            if (Trigger.operatorsValue != null) return Trigger.operatorsValue;
	            Trigger.operatorsValue = {
	                empty: function empty(value, expectedValue) {
	                    return !value;
	                },
	                notempty: function notempty(value, expectedValue) {
	                    return !!value;
	                },
	                equal: function equal(value, expectedValue) {
	                    return value == expectedValue;
	                },
	                notequal: function notequal(value, expectedValue) {
	                    return value != expectedValue;
	                },
	                contains: function contains(value, expectedValue) {
	                    return value && value["indexOf"] && value.indexOf(expectedValue) > -1;
	                },
	                notcontains: function notcontains(value, expectedValue) {
	                    return !value || !value["indexOf"] || value.indexOf(expectedValue) == -1;
	                },
	                greater: function greater(value, expectedValue) {
	                    return value > expectedValue;
	                },
	                less: function less(value, expectedValue) {
	                    return value < expectedValue;
	                },
	                greaterorequal: function greaterorequal(value, expectedValue) {
	                    return value >= expectedValue;
	                },
	                lessorequal: function lessorequal(value, expectedValue) {
	                    return value <= expectedValue;
	                }
	            };
	            return Trigger.operatorsValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Trigger.prototype, "operator", {
	        get: function get() {
	            return this.opValue;
	        },
	        set: function set(value) {
	            if (!value) return;
	            value = value.toLowerCase();
	            if (!Trigger.operators[value]) return;
	            this.opValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Trigger.prototype.check = function (value) {
	        if (Trigger.operators[this.operator](value, this.value)) {
	            this.onSuccess();
	        } else {
	            this.onFailure();
	        }
	    };
	    Trigger.prototype.onSuccess = function () {};
	    Trigger.prototype.onFailure = function () {};
	    Trigger.operatorsValue = null;
	    return Trigger;
	}(_base.Base);
	var SurveyTrigger = exports.SurveyTrigger = function (_super) {
	    __extends(SurveyTrigger, _super);
	    function SurveyTrigger() {
	        _super.call(this);
	        this.owner = null;
	    }
	    SurveyTrigger.prototype.setOwner = function (owner) {
	        this.owner = owner;
	    };
	    Object.defineProperty(SurveyTrigger.prototype, "isOnNextPage", {
	        get: function get() {
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyTrigger;
	}(Trigger);
	var SurveyTriggerVisible = exports.SurveyTriggerVisible = function (_super) {
	    __extends(SurveyTriggerVisible, _super);
	    function SurveyTriggerVisible() {
	        _super.call(this);
	        this.pages = [];
	        this.questions = [];
	    }
	    SurveyTriggerVisible.prototype.getType = function () {
	        return "visibletrigger";
	    };
	    SurveyTriggerVisible.prototype.onSuccess = function () {
	        this.onTrigger(this.onItemSuccess);
	    };
	    SurveyTriggerVisible.prototype.onFailure = function () {
	        this.onTrigger(this.onItemFailure);
	    };
	    SurveyTriggerVisible.prototype.onTrigger = function (func) {
	        if (!this.owner) return;
	        var objects = this.owner.getObjects(this.pages, this.questions);
	        for (var i = 0; i < objects.length; i++) {
	            func(objects[i]);
	        }
	    };
	    SurveyTriggerVisible.prototype.onItemSuccess = function (item) {
	        item.visible = true;
	    };
	    SurveyTriggerVisible.prototype.onItemFailure = function (item) {
	        item.visible = false;
	    };
	    return SurveyTriggerVisible;
	}(SurveyTrigger);
	var SurveyTriggerComplete = exports.SurveyTriggerComplete = function (_super) {
	    __extends(SurveyTriggerComplete, _super);
	    function SurveyTriggerComplete() {
	        _super.call(this);
	    }
	    SurveyTriggerComplete.prototype.getType = function () {
	        return "completetrigger";
	    };
	    Object.defineProperty(SurveyTriggerComplete.prototype, "isOnNextPage", {
	        get: function get() {
	            return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyTriggerComplete.prototype.onSuccess = function () {
	        if (this.owner) this.owner.doComplete();
	    };
	    return SurveyTriggerComplete;
	}(SurveyTrigger);
	var SurveyTriggerSetValue = exports.SurveyTriggerSetValue = function (_super) {
	    __extends(SurveyTriggerSetValue, _super);
	    function SurveyTriggerSetValue() {
	        _super.call(this);
	    }
	    SurveyTriggerSetValue.prototype.getType = function () {
	        return "setvaluetrigger";
	    };
	    SurveyTriggerSetValue.prototype.onSuccess = function () {
	        if (!this.setToName || !this.owner) return;
	        this.owner.setTriggerValue(this.setToName, this.setValue, this.isVariable);
	    };
	    return SurveyTriggerSetValue;
	}(SurveyTrigger);
	_jsonobject.JsonObject.metaData.addClass("trigger", ["operator", "!value"]);
	_jsonobject.JsonObject.metaData.addClass("surveytrigger", ["!name"], null, "trigger");
	_jsonobject.JsonObject.metaData.addClass("visibletrigger", ["pages", "questions"], function () {
	    return new SurveyTriggerVisible();
	}, "surveytrigger");
	_jsonobject.JsonObject.metaData.addClass("completetrigger", [], function () {
	    return new SurveyTriggerComplete();
	}, "surveytrigger");
	_jsonobject.JsonObject.metaData.addClass("setvaluetrigger", ["!setToName", "setValue", "isVariable:boolean"], function () {
	    return new SurveyTriggerSetValue();
	}, "surveytrigger");
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyWindowModel = undefined;
	
	var _base = __webpack_require__(4);
	
	var _survey = __webpack_require__(31);
	
	var SurveyWindowModel = exports.SurveyWindowModel = function (_super) {
	    __extends(SurveyWindowModel, _super);
	    function SurveyWindowModel(jsonObj) {
	        _super.call(this);
	        this.surveyValue = this.createSurvey(jsonObj);
	        this.surveyValue.showTitle = false;
	        this.windowElement = document.createElement("div");
	    }
	    SurveyWindowModel.prototype.getType = function () {
	        return "window";
	    };
	    Object.defineProperty(SurveyWindowModel.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyWindowModel.prototype, "isShowing", {
	        get: function get() {
	            return this.isShowingValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyWindowModel.prototype, "isExpanded", {
	        get: function get() {
	            return this.isExpandedValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyWindowModel.prototype, "title", {
	        get: function get() {
	            return this.titleValue ? this.titleValue : this.survey.title;
	        },
	        set: function set(value) {
	            this.titleValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyWindowModel.prototype.expand = function () {
	        this.expandcollapse(true);
	    };
	    SurveyWindowModel.prototype.collapse = function () {
	        this.expandcollapse(false);
	    };
	    SurveyWindowModel.prototype.createSurvey = function (jsonObj) {
	        return new _survey.SurveyModel(jsonObj);
	    };
	    SurveyWindowModel.prototype.expandcollapse = function (value) {
	        this.isExpandedValue = value;
	    };
	    SurveyWindowModel.surveyElementName = "windowSurveyJS";
	    return SurveyWindowModel;
	}(_base.Base);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 35 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var surveyCss = exports.surveyCss = {
	    currentType: "",
	    getCss: function getCss() {
	        var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
	        if (!loc) loc = defaultStandardCss;
	        return loc;
	    }
	};
	var defaultStandardCss = exports.defaultStandardCss = {
	    root: "sv_main",
	    header: "",
	    body: "sv_body",
	    footer: "sv_nav",
	    navigationButton: "", navigation: { complete: "", prev: "", next: "" },
	    progress: "sv_progress", progressBar: "",
	    pageTitle: "sv_p_title",
	    row: "sv_row",
	    question: { root: "sv_q", title: "sv_q_title", comment: "", indent: 20 },
	    error: { root: "sv_q_erbox", icon: "", item: "" },
	    checkbox: { root: "sv_qcbc", item: "sv_q_checkbox", other: "sv_q_other" },
	    comment: "",
	    dropdown: "",
	    matrix: { root: "sv_q_matrix" },
	    matrixdropdown: { root: "sv_q_matrix" },
	    matrixdynamic: { root: "table", button: "" },
	    multipletext: { root: "", itemTitle: "", itemValue: "" },
	    radiogroup: { root: "sv_qcbc", item: "sv_q_radiogroup", other: "sv_q_other" },
	    rating: { root: "sv_q_rating", item: "sv_q_rating_item" },
	    text: "",
	    window: {
	        root: "sv_window", body: "sv_window_content",
	        header: {
	            root: "sv_window_title", title: "", button: "", buttonExpanded: "", buttonCollapsed: ""
	        }
	    }
	};
	surveyCss["standard"] = defaultStandardCss;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.defaultBootstrapCss = undefined;
	
	var _cssstandard = __webpack_require__(35);
	
	var defaultBootstrapCss = exports.defaultBootstrapCss = {
	    root: "",
	    header: "panel-heading",
	    body: "panel-body",
	    footer: "panel-footer",
	    navigationButton: "", navigation: { complete: "", prev: "", next: "" },
	    progress: "progress center-block", progressBar: "progress-bar",
	    pageTitle: "",
	    row: "",
	    question: { root: "", title: "", comment: "form-control", indent: 20 },
	    error: { root: "alert alert-danger", icon: "glyphicon glyphicon-exclamation-sign", item: "" },
	    checkbox: { root: "form-inline", item: "checkbox", other: "" },
	    comment: "form-control",
	    dropdown: "form-control",
	    matrix: { root: "table" },
	    matrixdropdown: { root: "table" },
	    matrixdynamic: { root: "table", button: "button" },
	    multipletext: { root: "table", itemTitle: "", itemValue: "form-control" },
	    radiogroup: { root: "form-inline", item: "radio", other: "" },
	    rating: { root: "btn-group", item: "btn btn-default" },
	    text: "form-control",
	    window: {
	        root: "modal-content", body: "modal-body",
	        header: {
	            root: "modal-header panel-title", title: "pull-left", button: "glyphicon pull-right",
	            buttonExpanded: "glyphicon pull-right glyphicon-chevron-up", buttonCollapsed: "glyphicon pull-right glyphicon-chevron-down"
	        }
	    }
	};
	_cssstandard.surveyCss["bootstrap"] = defaultBootstrapCss;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.Survey = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactsurveymodel = __webpack_require__(39);
	
	var _reactpage = __webpack_require__(40);
	
	var _reactSurveyNavigation = __webpack_require__(45);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	var _cssstandard = __webpack_require__(35);
	
	var _reactSurveyProgress = __webpack_require__(47);
	
	var _base = __webpack_require__(4);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var Survey = exports.Survey = function (_super) {
	    __extends(Survey, _super);
	    function Survey(props) {
	        _super.call(this, props);
	        this.isCurrentPageChanged = false;
	        this.updateSurvey(props);
	    }
	    Object.defineProperty(Survey, "cssType", {
	        get: function get() {
	            return _cssstandard.surveyCss.currentType;
	        },
	        set: function set(value) {
	            _cssstandard.surveyCss.currentType = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Survey.prototype.componentWillReceiveProps = function (nextProps) {
	        this.updateSurvey(nextProps);
	    };
	    Survey.prototype.componentDidUpdate = function () {
	        if (this.isCurrentPageChanged) {
	            this.isCurrentPageChanged = false;
	            this.survey.focusFirstQuestion();
	        }
	    };
	    Survey.prototype.render = function () {
	        if (this.survey.state == "completed") return this.renderCompleted();
	        if (this.survey.state == "loading") return this.renderLoading();
	        return this.renderSurvey();
	    };
	    Object.defineProperty(Survey.prototype, "css", {
	        get: function get() {
	            return _cssstandard.surveyCss.getCss();
	        },
	        set: function set(value) {
	            this.survey.mergeCss(value, this.css);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Survey.prototype.renderCompleted = function () {
	        var htmlValue = { __html: this.survey.processedCompletedHtml };
	        return React.createElement("div", { dangerouslySetInnerHTML: htmlValue });
	    };
	    Survey.prototype.renderLoading = function () {
	        var htmlValue = { __html: this.survey.processedLoadingHtml };
	        return React.createElement("div", { dangerouslySetInnerHTML: htmlValue });
	    };
	    Survey.prototype.renderSurvey = function () {
	        var title = this.survey.title && this.survey.showTitle ? this.renderTitle() : null;
	        var currentPage = this.survey.currentPage ? this.renderPage() : null;
	        var topProgress = this.survey.showProgressBar == "top" ? this.renderProgress(true) : null;
	        var bottomProgress = this.survey.showProgressBar == "bottom" ? this.renderProgress(false) : null;
	        var buttons = currentPage && this.survey.showNavigationButtons ? this.renderNavigation() : null;
	        if (!currentPage) {
	            currentPage = this.renderEmptySurvey();
	        }
	        return React.createElement("div", { className: this.css.root }, title, React.createElement("div", { id: _base.SurveyPageId, className: this.css.body }, topProgress, currentPage, bottomProgress), buttons);
	    };
	    Survey.prototype.renderTitle = function () {
	        return React.createElement("div", { className: this.css.header }, React.createElement("h3", null, this.survey.title));
	    };
	    Survey.prototype.renderPage = function () {
	        return React.createElement(_reactpage.SurveyPage, { survey: this.survey, page: this.survey.currentPage, css: this.css, creator: this });
	    };
	    Survey.prototype.renderProgress = function (isTop) {
	        return React.createElement(_reactSurveyProgress.SurveyProgress, { survey: this.survey, css: this.css, isTop: isTop });
	    };
	    Survey.prototype.renderNavigation = function () {
	        return React.createElement(_reactSurveyNavigation.SurveyNavigation, { survey: this.survey, css: this.css });
	    };
	    Survey.prototype.renderEmptySurvey = function () {
	        return React.createElement("span", null, this.survey.emptySurveyText);
	    };
	    Survey.prototype.updateSurvey = function (newProps) {
	        if (newProps) {
	            if (newProps.model) {
	                this.survey = newProps.model;
	            } else {
	                if (newProps.json) {
	                    this.survey = new _reactsurveymodel.ReactSurveyModel(newProps.json);
	                }
	            }
	        } else {
	            this.survey = new _reactsurveymodel.ReactSurveyModel();
	        }
	        if (newProps) {
	            if (newProps.clientId) this.survey.clientId = newProps.clientId;
	            if (newProps.data) this.survey.data = newProps.data;
	            if (newProps.css) this.survey.mergeCss(newProps.css, this.css);
	        }
	        //set the first page
	        var dummy = this.survey.currentPage;
	        this.state = { pageIndexChange: 0, isCompleted: false, modelChanged: 0 };
	        this.setSurveyEvents(newProps);
	    };
	    Survey.prototype.setSurveyEvents = function (newProps) {
	        var self = this;
	        this.survey.renderCallback = function () {
	            self.state.modelChanged = self.state.modelChanged + 1;
	            self.setState(self.state);
	        };
	        this.survey.onComplete.add(function (sender) {
	            self.state.isCompleted = true;self.setState(self.state);
	        });
	        this.survey.onCurrentPageChanged.add(function (sender, options) {
	            self.isCurrentPageChanged = true;
	            self.state.pageIndexChange = self.state.pageIndexChange + 1;
	            self.setState(self.state);
	            if (newProps && newProps.onCurrentPageChanged) newProps.onCurrentPageChanged(sender, options);
	        });
	        this.survey.onVisibleChanged.add(function (sender, options) {
	            if (options.question && options.question.react) {
	                var state = options.question.react.state;
	                state.visible = options.question.visible;
	                options.question.react.setState(state);
	            }
	        });
	        this.survey.onValueChanged.add(function (sender, options) {
	            if (options.question && options.question.react) {
	                var state = options.question.react.state;
	                state.value = options.value;
	                options.question.react.setState(state);
	            }
	        });
	        if (!newProps) return;
	        this.survey.onValueChanged.add(function (sender, options) {
	            if (newProps.data) newProps.data[options.name] = options.value;
	            if (newProps.onValueChanged) newProps.onValueChanged(sender, options);
	        });
	        if (newProps.onComplete) {
	            this.survey.onComplete.add(function (sender) {
	                newProps.onComplete(sender);
	            });
	        }
	        this.survey.onPageVisibleChanged.add(function (sender, options) {
	            if (newProps.onPageVisibleChanged) newProps.onPageVisibleChanged(sender, options);
	        });
	        if (newProps.onQuestionAdded) {
	            this.survey.onQuestionAdded.add(function (sender, options) {
	                newProps.onQuestionAdded(sender, options);
	            });
	        }
	        if (newProps.onQuestionRemoved) {
	            this.survey.onQuestionRemoved.add(function (sender, options) {
	                newProps.onQuestionRemoved(sender, options);
	            });
	        }
	        if (newProps.onValidateQuestion) {
	            this.survey.onValidateQuestion.add(function (sender, options) {
	                newProps.onValidateQuestion(sender, options);
	            });
	        }
	        if (newProps.onServerValidateQuestions) {
	            this.survey.onServerValidateQuestions = newProps.onServerValidateQuestions;
	        }
	        if (newProps.onSendResult) {
	            this.survey.onSendResult.add(function (sender, options) {
	                newProps.onSendResult(sender, options);
	            });
	        }
	        if (newProps.onGetResult) {
	            this.survey.onGetResult.add(function (sender, options) {
	                newProps.onGetResult(sender, options);
	            });
	        }
	        if (newProps.onProcessHtml) {
	            this.survey.onProcessHtml.add(function (sender, options) {
	                newProps.onProcessHtml(sender, options);
	            });
	        }
	    };
	    //ISurveyCreator
	    Survey.prototype.createQuestionElement = function (question) {
	        var questionCss = this.css[question.getType()];
	        return _reactquestionfactory.ReactQuestionFactory.Instance.createQuestion(question.getType(), {
	            question: question, css: questionCss, rootCss: this.css, isDisplayMode: this.survey.isDisplayMode, creator: this
	        });
	    };
	    Survey.prototype.renderError = function (key, errorText) {
	        return React.createElement("div", { key: key, className: this.css.error.item }, errorText);
	    };
	    Survey.prototype.questionTitleLocation = function () {
	        return this.survey.questionTitleLocation;
	    };
	    return Survey;
	}(React.Component);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_38__;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.ReactSurveyModel = undefined;
	
	var _survey = __webpack_require__(31);
	
	var ReactSurveyModel = exports.ReactSurveyModel = function (_super) {
	    __extends(ReactSurveyModel, _super);
	    function ReactSurveyModel(jsonObj) {
	        if (jsonObj === void 0) {
	            jsonObj = null;
	        }
	        _super.call(this, jsonObj);
	    }
	    ReactSurveyModel.prototype.render = function () {
	        if (this.renderCallback) {
	            this.renderCallback();
	        }
	    };
	    ReactSurveyModel.prototype.mergeCss = function (src, dest) {
	        this.mergeValues(src, dest);
	    };
	    ReactSurveyModel.prototype.onLoadSurveyFromService = function () {
	        this.render();
	    };
	    ReactSurveyModel.prototype.onLoadingSurveyFromService = function () {
	        this.render();
	    };
	    return ReactSurveyModel;
	}(_survey.SurveyModel);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.SurveyRow = exports.SurveyPage = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestion = __webpack_require__(41);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyPage = exports.SurveyPage = function (_super) {
	    __extends(SurveyPage, _super);
	    function SurveyPage(props) {
	        _super.call(this, props);
	        this.page = props.page;
	        this.survey = props.survey;
	        this.creator = props.creator;
	        this.css = props.css;
	    }
	    SurveyPage.prototype.componentWillReceiveProps = function (nextProps) {
	        this.page = nextProps.page;
	        this.survey = nextProps.survey;
	        this.creator = nextProps.creator;
	        this.css = nextProps.css;
	    };
	    SurveyPage.prototype.render = function () {
	        if (this.page == null || this.survey == null || this.creator == null) return null;
	        var title = this.renderTitle();
	        var rows = [];
	        var questionRows = this.page.rows;
	        for (var i = 0; i < questionRows.length; i++) {
	            rows.push(this.createRow(questionRows[i], i));
	        }
	        return React.createElement("div", null, title, rows);
	    };
	    SurveyPage.prototype.createRow = function (row, index) {
	        var rowName = "row" + (index + 1);
	        return React.createElement(SurveyRow, { key: rowName, row: row, survey: this.survey, creator: this.creator, css: this.css });
	    };
	    SurveyPage.prototype.renderTitle = function () {
	        if (!this.page.title || !this.survey.showPageTitles) return null;
	        var text = this.page.processedTitle;
	        if (this.page.num > 0) {
	            text = this.page.num + ". " + text;
	        }
	        return React.createElement("h4", { className: this.css.pageTitle }, text);
	    };
	    return SurveyPage;
	}(React.Component);
	var SurveyRow = exports.SurveyRow = function (_super) {
	    __extends(SurveyRow, _super);
	    function SurveyRow(props) {
	        _super.call(this, props);
	        this.setProperties(props);
	    }
	    SurveyRow.prototype.componentWillReceiveProps = function (nextProps) {
	        this.setProperties(nextProps);
	    };
	    SurveyRow.prototype.setProperties = function (props) {
	        this.row = props.row;
	        if (this.row) {
	            var self = this;
	            this.row.visibilityChangedCallback = function () {
	                self.setState({ visible: self.row.visible });
	            };
	        }
	        this.survey = props.survey;
	        this.creator = props.creator;
	        this.css = props.css;
	    };
	    SurveyRow.prototype.render = function () {
	        if (this.row == null || this.survey == null || this.creator == null) return null;
	        if (!this.row.visible) return null;
	        var questions = [];
	        for (var i = 0; i < this.row.questions.length; i++) {
	            var question = this.row.questions[i];
	            questions.push(this.createQuestion(question));
	        }
	        return React.createElement("div", { className: this.css.row }, questions);
	    };
	    SurveyRow.prototype.createQuestion = function (question) {
	        return React.createElement(_reactquestion.SurveyQuestion, { key: question.name, question: question, creator: this.creator, css: this.css });
	    };
	    return SurveyRow;
	}(React.Component);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.SurveyQuestionErrors = exports.SurveyQuestion = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _question = __webpack_require__(13);
	
	var _reactquestioncomment = __webpack_require__(42);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestion = exports.SurveyQuestion = function (_super) {
	    __extends(SurveyQuestion, _super);
	    function SurveyQuestion(props) {
	        _super.call(this, props);
	        this.setQuestion(props.question);
	        this.creator = props.creator;
	        this.css = props.css;
	    }
	    SurveyQuestion.prototype.componentWillReceiveProps = function (nextProps) {
	        this.creator = nextProps.creator;
	        this.css = nextProps.css;
	        this.setQuestion(nextProps.question);
	    };
	    SurveyQuestion.prototype.setQuestion = function (question) {
	        this.questionBase = question;
	        this.question = question instanceof _question.Question ? question : null;
	        var value = this.question ? this.question.value : null;
	        this.state = {
	            visible: this.questionBase.visible, value: value, error: 0, renderWidth: 0,
	            visibleIndexValue: -1
	        };
	    };
	    SurveyQuestion.prototype.componentDidMount = function () {
	        if (this.questionBase) {
	            var self = this;
	            this.questionBase["react"] = self;
	            this.questionBase.renderWidthChangedCallback = function () {
	                self.state.renderWidth = self.state.renderWidth + 1;
	                self.setState(self.state);
	            };
	            this.questionBase.visibleIndexChangedCallback = function () {
	                self.state.visibleIndexValue = self.questionBase.visibleIndex;
	                self.setState(self.state);
	            };
	        }
	    };
	    SurveyQuestion.prototype.componentWillUnmount = function () {
	        if (this.questionBase) {
	            this.questionBase["react"] = null;
	            this.questionBase.renderWidthChangedCallback = null;
	            this.questionBase.visibleIndexChangedCallback = null;
	        }
	    };
	    SurveyQuestion.prototype.render = function () {
	        if (!this.questionBase || !this.creator) return null;
	        if (!this.questionBase.visible) return null;
	        var questionRender = this.creator.createQuestionElement(this.questionBase);
	        var title = this.questionBase.hasTitle ? this.renderTitle() : null;
	        var titleTop = this.creator.questionTitleLocation() == "top" ? title : null;
	        var titleBottom = this.creator.questionTitleLocation() == "bottom" ? title : null;
	        var comment = this.question && this.question.hasComment ? this.renderComment() : null;
	        var errors = this.renderErrors();
	        var marginLeft = this.questionBase.indent > 0 ? this.questionBase.indent * this.css.question.indent + "px" : null;
	        var paddingRight = this.questionBase.rightIndent > 0 ? this.questionBase.rightIndent * this.css.question.indent + "px" : null;
	        var rootStyle = { display: 'inline-block', verticalAlign: 'top' };
	        if (this.questionBase.renderWidth) rootStyle["width"] = this.questionBase.renderWidth;
	        if (marginLeft) rootStyle["marginLeft"] = marginLeft;
	        if (paddingRight) rootStyle["paddingRight"] = paddingRight;
	        return React.createElement("div", { id: this.questionBase.id, className: this.css.question.root, style: rootStyle }, titleTop, errors, questionRender, comment, titleBottom);
	    };
	    SurveyQuestion.prototype.renderTitle = function () {
	        var titleText = this.question.fullTitle;
	        return React.createElement("h5", { className: this.css.question.title }, titleText);
	    };
	    SurveyQuestion.prototype.renderComment = function () {
	        return React.createElement("div", null, React.createElement("div", null, this.question.commentText), React.createElement("div", { className: this.css.question.comment }, React.createElement(_reactquestioncomment.SurveyQuestionCommentItem, { question: this.question })));
	    };
	    SurveyQuestion.prototype.renderErrors = function () {
	        return React.createElement(SurveyQuestionErrors, { question: this.question, css: this.css, creator: this.creator });
	    };
	    return SurveyQuestion;
	}(React.Component);
	var SurveyQuestionErrors = exports.SurveyQuestionErrors = function (_super) {
	    __extends(SurveyQuestionErrors, _super);
	    function SurveyQuestionErrors(props) {
	        _super.call(this, props);
	        this.setQuestion(props.question);
	        this.creator = props.creator;
	        this.css = props.css;
	    }
	    SurveyQuestionErrors.prototype.componentWillReceiveProps = function (nextProps) {
	        this.setQuestion(nextProps.question);
	        this.creator = nextProps.creator;
	        this.css = nextProps.css;
	    };
	    SurveyQuestionErrors.prototype.setQuestion = function (question) {
	        this.question = question instanceof _question.Question ? question : null;
	        if (this.question) {
	            var self = this;
	            this.question.errorsChangedCallback = function () {
	                self.state.error = self.state.error + 1;
	                self.setState(self.state);
	            };
	        }
	        this.state = { error: 0 };
	    };
	    SurveyQuestionErrors.prototype.render = function () {
	        if (!this.question || this.question.errors.length == 0) return null;
	        var errors = [];
	        for (var i = 0; i < this.question.errors.length; i++) {
	            var errorText = this.question.errors[i].getText();
	            var key = "error" + i;
	            errors.push(this.creator.renderError(key, errorText));
	        }
	        return React.createElement("div", { className: this.css.error.root }, errors);
	    };
	    return SurveyQuestionErrors;
	}(React.Component);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionCommentItem = exports.SurveyQuestionComment = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionComment = exports.SurveyQuestionComment = function (_super) {
	    __extends(SurveyQuestionComment, _super);
	    function SurveyQuestionComment(props) {
	        _super.call(this, props);
	        this.state = { value: this.question.value || '' };
	        this.handleOnChange = this.handleOnChange.bind(this);
	        this.handleOnBlur = this.handleOnBlur.bind(this);
	    }
	    Object.defineProperty(SurveyQuestionComment.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionComment.prototype.handleOnChange = function (event) {
	        this.setState({ value: event.target.value });
	    };
	    SurveyQuestionComment.prototype.handleOnBlur = function (event) {
	        this.question.value = event.target.value;
	        this.setState({ value: this.question.value || '' });
	    };
	    SurveyQuestionComment.prototype.render = function () {
	        if (!this.question) return null;
	        if (this.isDisplayMode) return React.createElement("div", { id: this.question.inputId, className: this.css }, this.question.value);
	        return React.createElement("textarea", { id: this.question.inputId, className: this.css, type: "text", value: this.state.value, onBlur: this.handleOnBlur, onChange: this.handleOnChange, cols: this.question.cols, rows: this.question.rows });
	    };
	    return SurveyQuestionComment;
	}(_reactquestionelement.SurveyQuestionElementBase);
	var SurveyQuestionCommentItem = exports.SurveyQuestionCommentItem = function (_super) {
	    __extends(SurveyQuestionCommentItem, _super);
	    function SurveyQuestionCommentItem(props) {
	        _super.call(this, props);
	        this.question = props.question;
	        this.comment = this.question.comment;
	        this.state = { value: this.comment };
	        this.handleOnChange = this.handleOnChange.bind(this);
	        this.handleOnBlur = this.handleOnBlur.bind(this);
	    }
	    SurveyQuestionCommentItem.prototype.handleOnChange = function (event) {
	        this.comment = event.target.value;
	        this.setState({ value: this.comment });
	    };
	    SurveyQuestionCommentItem.prototype.handleOnBlur = function (event) {
	        this.question.comment = this.comment;
	    };
	    SurveyQuestionCommentItem.prototype.componentWillReceiveProps = function (nextProps) {
	        this.question = nextProps.question;
	    };
	    SurveyQuestionCommentItem.prototype.render = function () {
	        if (!this.question) return null;
	        if (this.isDisplayMode) return React.createElement("div", { className: this.css.question.comment }, this.comment);
	        return React.createElement("input", { type: "text", className: this.css.question.comment, value: this.state.value, onChange: this.handleOnChange, onBlur: this.handleOnBlur });
	    };
	    return SurveyQuestionCommentItem;
	}(_reactquestionelement.SurveyElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("comment", function (props) {
	    return React.createElement(SurveyQuestionComment, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionElementBase = exports.SurveyElementBase = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestioncomment = __webpack_require__(42);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyElementBase = exports.SurveyElementBase = function (_super) {
	    __extends(SurveyElementBase, _super);
	    function SurveyElementBase(props) {
	        _super.call(this, props);
	        this.css = props.css;
	        this.rootCss = props.rootCss;
	        this.isDisplayMode = props.isDisplayMode || false;
	    }
	    SurveyElementBase.prototype.componentWillReceiveProps = function (nextProps) {
	        this.css = nextProps.css;
	        this.rootCss = nextProps.rootCss;
	        this.isDisplayMode = nextProps.isDisplayMode || false;
	    };
	    return SurveyElementBase;
	}(React.Component);
	var SurveyQuestionElementBase = exports.SurveyQuestionElementBase = function (_super) {
	    __extends(SurveyQuestionElementBase, _super);
	    function SurveyQuestionElementBase(props) {
	        _super.call(this, props);
	        this.questionBase = props.question;
	        this.creator = props.creator;
	    }
	    SurveyQuestionElementBase.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.questionBase = nextProps.question;
	        this.creator = nextProps.creator;
	    };
	    SurveyQuestionElementBase.prototype.renderOther = function (style) {
	        if (style === void 0) {
	            style = null;
	        }
	        return React.createElement("div", { style: style }, React.createElement(_reactquestioncomment.SurveyQuestionCommentItem, { question: this.questionBase, css: this.rootCss, isDisplayMode: this.isDisplayMode }));
	    };
	    return SurveyQuestionElementBase;
	}(SurveyElementBase);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var ReactQuestionFactory = exports.ReactQuestionFactory = function () {
	    function ReactQuestionFactory() {
	        this.creatorHash = {};
	    }
	    ReactQuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
	        this.creatorHash[questionType] = questionCreator;
	    };
	    ReactQuestionFactory.prototype.getAllTypes = function () {
	        var result = new Array();
	        for (var key in this.creatorHash) {
	            result.push(key);
	        }
	        return result.sort();
	    };
	    ReactQuestionFactory.prototype.createQuestion = function (questionType, params) {
	        var creator = this.creatorHash[questionType];
	        if (creator == null) return null;
	        return creator(params);
	    };
	    ReactQuestionFactory.Instance = new ReactQuestionFactory();
	    ReactQuestionFactory.DefaultChoices = ["one", "two|second value", "three|third value"];
	    return ReactQuestionFactory;
	}();

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyNavigation = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactSurveyNavigationBase = __webpack_require__(46);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyNavigation = exports.SurveyNavigation = function (_super) {
	    __extends(SurveyNavigation, _super);
	    function SurveyNavigation(props) {
	        _super.call(this, props);
	        this.handlePrevClick = this.handlePrevClick.bind(this);
	        this.handleNextClick = this.handleNextClick.bind(this);
	        this.handleCompleteClick = this.handleCompleteClick.bind(this);
	    }
	    SurveyNavigation.prototype.handlePrevClick = function (event) {
	        this.survey.prevPage();
	    };
	    SurveyNavigation.prototype.handleNextClick = function (event) {
	        this.survey.nextPage();
	    };
	    SurveyNavigation.prototype.handleCompleteClick = function (event) {
	        this.survey.completeLastPage();
	    };
	    SurveyNavigation.prototype.render = function () {
	        if (!this.survey) return null;
	        var prevButton = !this.survey.isFirstPage ? this.renderButton(this.handlePrevClick, this.survey.pagePrevText, this.css.navigation.prev) : null;
	        var nextButton = !this.survey.isLastPage ? this.renderButton(this.handleNextClick, this.survey.pageNextText, this.css.navigation.next) : null;
	        var completeButton = this.survey.isLastPage ? this.renderButton(this.handleCompleteClick, this.survey.completeText, this.css.navigation.complete) : null;
	        return React.createElement("div", { className: this.css.footer }, prevButton, nextButton, completeButton);
	    };
	    SurveyNavigation.prototype.renderButton = function (click, text, btnClassName) {
	        var style = { marginRight: "5px" };
	        var className = this.css.navigationButton + (btnClassName ? ' ' + btnClassName : "");
	        return React.createElement("input", { className: className, style: style, type: "button", onClick: click, value: text });
	    };
	    return SurveyNavigation;
	}(_reactSurveyNavigationBase.SurveyNavigationBase);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.SurveyNavigationBase = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyNavigationBase = exports.SurveyNavigationBase = function (_super) {
	    __extends(SurveyNavigationBase, _super);
	    function SurveyNavigationBase(props) {
	        _super.call(this, props);
	        this.updateStateFunction = null;
	        this.survey = props.survey;
	        this.css = props.css;
	        this.state = { update: 0 };
	    }
	    SurveyNavigationBase.prototype.componentWillReceiveProps = function (nextProps) {
	        this.survey = nextProps.survey;
	        this.css = nextProps.css;
	    };
	    SurveyNavigationBase.prototype.componentDidMount = function () {
	        if (this.survey) {
	            var self = this;
	            this.updateStateFunction = function () {
	                self.state.update = self.state.update + 1;
	                self.setState(self.state);
	            };
	            this.survey.onPageVisibleChanged.add(this.updateStateFunction);
	        }
	    };
	    SurveyNavigationBase.prototype.componentWillUnmount = function () {
	        if (this.survey && this.updateStateFunction) {
	            this.survey.onPageVisibleChanged.remove(this.updateStateFunction);
	            this.updateStateFunction = null;
	        }
	    };
	    return SurveyNavigationBase;
	}(React.Component);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyProgress = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactSurveyNavigationBase = __webpack_require__(46);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyProgress = exports.SurveyProgress = function (_super) {
	    __extends(SurveyProgress, _super);
	    function SurveyProgress(props) {
	        _super.call(this, props);
	        this.isTop = props.isTop;
	    }
	    SurveyProgress.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.isTop = nextProps.isTop;
	    };
	    Object.defineProperty(SurveyProgress.prototype, "progress", {
	        get: function get() {
	            return this.survey.getProgress();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyProgress.prototype, "progressText", {
	        get: function get() {
	            return this.survey.progressText;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyProgress.prototype.render = function () {
	        var style = this.isTop ? { width: "60%" } : { width: "60%", marginTop: "10px" };
	        var progressStyle = { width: this.progress + "%" };
	        return React.createElement("div", { className: this.css.progress, style: style }, React.createElement("div", { style: progressStyle, className: this.css.progressBar, role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100" }, React.createElement("span", null, this.progressText)));
	    };
	    return SurveyProgress;
	}(_reactSurveyNavigationBase.SurveyNavigationBase);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionCheckboxItem = exports.SurveyQuestionCheckbox = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestioncomment = __webpack_require__(42);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionCheckbox = exports.SurveyQuestionCheckbox = function (_super) {
	    __extends(SurveyQuestionCheckbox, _super);
	    function SurveyQuestionCheckbox(props) {
	        _super.call(this, props);
	        this.state = { choicesChanged: 0 };
	        var self = this;
	        this.question.choicesChangedCallback = function () {
	            self.state.choicesChanged = self.state.choicesChanged + 1;
	            self.setState(self.state);
	        };
	    }
	    Object.defineProperty(SurveyQuestionCheckbox.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionCheckbox.prototype.render = function () {
	        if (!this.question) return null;
	        return React.createElement("form", { className: this.css.root }, this.getItems());
	    };
	    SurveyQuestionCheckbox.prototype.getItems = function () {
	        var items = [];
	        for (var i = 0; i < this.question.visibleChoices.length; i++) {
	            var item = this.question.visibleChoices[i];
	            var key = "item" + i;
	            items.push(this.renderItem(key, item, i == 0));
	        }
	        return items;
	    };
	    Object.defineProperty(SurveyQuestionCheckbox.prototype, "textStyle", {
	        get: function get() {
	            return null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionCheckbox.prototype.renderItem = function (key, item, isFirst) {
	        return React.createElement(SurveyQuestionCheckboxItem, { key: key, question: this.question, css: this.css, rootCss: this.rootCss, isDisplayMode: this.isDisplayMode, item: item, textStyle: this.textStyle, isFirst: isFirst });
	    };
	    return SurveyQuestionCheckbox;
	}(_reactquestionelement.SurveyQuestionElementBase);
	var SurveyQuestionCheckboxItem = exports.SurveyQuestionCheckboxItem = function (_super) {
	    __extends(SurveyQuestionCheckboxItem, _super);
	    function SurveyQuestionCheckboxItem(props) {
	        _super.call(this, props);
	        this.item = props.item;
	        this.question = props.question;
	        this.textStyle = props.textStyle;
	        this.isFirst = props.isFirst;
	        this.handleOnChange = this.handleOnChange.bind(this);
	    }
	    SurveyQuestionCheckboxItem.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.item = nextProps.item;
	        this.textStyle = nextProps.textStyle;
	        this.question = nextProps.question;
	        this.isFirst = nextProps.isFirst;
	    };
	    SurveyQuestionCheckboxItem.prototype.handleOnChange = function (event) {
	        var newValue = this.question.value;
	        if (!newValue) {
	            newValue = [];
	        }
	        var index = newValue.indexOf(this.item.value);
	        if (event.target.checked) {
	            if (index < 0) {
	                newValue.push(this.item.value);
	            }
	        } else {
	            if (index > -1) {
	                newValue.splice(index, 1);
	            }
	        }
	        this.question.value = newValue;
	        this.setState({ value: this.question.value });
	    };
	    SurveyQuestionCheckboxItem.prototype.render = function () {
	        if (!this.item || !this.question) return null;
	        var itemWidth = this.question.colCount > 0 ? 100 / this.question.colCount + "%" : "";
	        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
	        var divStyle = { marginRight: marginRight };
	        if (itemWidth) {
	            divStyle["width"] = itemWidth;
	        }
	        var isChecked = this.question.value && this.question.value.indexOf(this.item.value) > -1 || false;
	        var otherItem = this.item.value === this.question.otherItem.value && isChecked ? this.renderOther() : null;
	        return this.renderCheckbox(isChecked, divStyle, otherItem);
	    };
	    Object.defineProperty(SurveyQuestionCheckboxItem.prototype, "inputStyle", {
	        get: function get() {
	            return { marginRight: "3px" };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionCheckboxItem.prototype.renderCheckbox = function (isChecked, divStyle, otherItem) {
	        var id = this.isFirst ? this.question.inputId : null;
	        return React.createElement("div", { className: this.css.item, style: divStyle }, React.createElement("label", { className: this.css.item }, React.createElement("input", { type: "checkbox", id: id, style: this.inputStyle, disabled: this.isDisplayMode, checked: isChecked, onChange: this.handleOnChange }), React.createElement("span", null, this.item.text)), otherItem);
	    };
	    SurveyQuestionCheckboxItem.prototype.renderOther = function () {
	        return React.createElement("div", { className: this.css.other }, React.createElement(_reactquestioncomment.SurveyQuestionCommentItem, { question: this.question, css: this.rootCss, isDisplayMode: this.isDisplayMode }));
	    };
	    return SurveyQuestionCheckboxItem;
	}(_reactquestionelement.SurveyElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("checkbox", function (props) {
	    return React.createElement(SurveyQuestionCheckbox, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionDropdown = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestioncomment = __webpack_require__(42);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionDropdown = exports.SurveyQuestionDropdown = function (_super) {
	    __extends(SurveyQuestionDropdown, _super);
	    function SurveyQuestionDropdown(props) {
	        _super.call(this, props);
	        this.state = { value: this.question.value, choicesChanged: 0 };
	        var self = this;
	        this.question.choicesChangedCallback = function () {
	            self.state.choicesChanged = self.state.choicesChanged + 1;
	            self.setState(self.state);
	        };
	        this.handleOnChange = this.handleOnChange.bind(this);
	    }
	    Object.defineProperty(SurveyQuestionDropdown.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionDropdown.prototype.handleOnChange = function (event) {
	        this.question.value = event.target.value;
	        this.setState({ value: this.question.value });
	    };
	    SurveyQuestionDropdown.prototype.render = function () {
	        if (!this.question) return null;
	        var comment = this.question.value === this.question.otherItem.value ? this.renderOther() : null;
	        var select = this.renderSelect();
	        return React.createElement("div", null, select, comment);
	    };
	    SurveyQuestionDropdown.prototype.renderSelect = function () {
	        if (this.isDisplayMode) return React.createElement("div", { id: this.question.inputId, className: this.css }, this.question.value);
	        var options = [];
	        for (var i = 0; i < this.question.visibleChoices.length; i++) {
	            var item = this.question.visibleChoices[i];
	            var key = "item" + i;
	            var option = React.createElement("option", { key: key, value: item.value }, item.text);
	            options.push(option);
	        }
	        return React.createElement("select", { id: this.question.inputId, className: this.css, value: this.state.value, onChange: this.handleOnChange }, React.createElement("option", { value: "" }, this.question.optionsCaption), options);
	    };
	    SurveyQuestionDropdown.prototype.renderOther = function () {
	        var style = { marginTop: "3px" };
	        return React.createElement("div", { style: style }, React.createElement(_reactquestioncomment.SurveyQuestionCommentItem, { question: this.question, css: this.rootCss, isDisplayMode: this.isDisplayMode }));
	    };
	    return SurveyQuestionDropdown;
	}(_reactquestionelement.SurveyQuestionElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("dropdown", function (props) {
	    return React.createElement(SurveyQuestionDropdown, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionMatrixDropdownRow = exports.SurveyQuestionMatrixDropdown = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestion = __webpack_require__(41);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionMatrixDropdown = exports.SurveyQuestionMatrixDropdown = function (_super) {
	    __extends(SurveyQuestionMatrixDropdown, _super);
	    function SurveyQuestionMatrixDropdown(props) {
	        _super.call(this, props);
	    }
	    Object.defineProperty(SurveyQuestionMatrixDropdown.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionMatrixDropdown.prototype.render = function () {
	        if (!this.question) return null;
	        var headers = [];
	        for (var i = 0; i < this.question.columns.length; i++) {
	            var column = this.question.columns[i];
	            var key = "column" + i;
	            var minWidth = this.question.getColumnWidth(column);
	            var columnStyle = minWidth ? { minWidth: minWidth } : {};
	            headers.push(React.createElement("th", { key: key, style: columnStyle }, this.question.getColumnTitle(column)));
	        }
	        var rows = [];
	        var visibleRows = this.question.visibleRows;
	        for (var i = 0; i < visibleRows.length; i++) {
	            var row = visibleRows[i];
	            var key = "row" + i;
	            rows.push(React.createElement(SurveyQuestionMatrixDropdownRow, { key: key, row: row, css: this.css, rootCss: this.rootCss, isDisplayMode: this.isDisplayMode, creator: this.creator }));
	        }
	        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll' } : {};
	        return React.createElement("div", { style: divStyle }, React.createElement("table", { className: this.css.root }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null), headers)), React.createElement("tbody", null, rows)));
	    };
	    return SurveyQuestionMatrixDropdown;
	}(_reactquestionelement.SurveyQuestionElementBase);
	var SurveyQuestionMatrixDropdownRow = exports.SurveyQuestionMatrixDropdownRow = function (_super) {
	    __extends(SurveyQuestionMatrixDropdownRow, _super);
	    function SurveyQuestionMatrixDropdownRow(props) {
	        _super.call(this, props);
	        this.setProperties(props);
	    }
	    SurveyQuestionMatrixDropdownRow.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.setProperties(nextProps);
	    };
	    SurveyQuestionMatrixDropdownRow.prototype.setProperties = function (nextProps) {
	        this.row = nextProps.row;
	        this.creator = nextProps.creator;
	    };
	    SurveyQuestionMatrixDropdownRow.prototype.render = function () {
	        if (!this.row) return null;
	        var tds = [];
	        for (var i = 0; i < this.row.cells.length; i++) {
	            var cell = this.row.cells[i];
	            var errors = React.createElement(_reactquestion.SurveyQuestionErrors, { question: cell.question, css: this.rootCss, creator: this.creator });
	            var select = this.renderSelect(cell);
	            tds.push(React.createElement("td", { key: "row" + i }, errors, select));
	        }
	        return React.createElement("tr", null, React.createElement("td", null, this.row.text), tds);
	    };
	    SurveyQuestionMatrixDropdownRow.prototype.renderSelect = function (cell) {
	        return this.creator.createQuestionElement(cell.question);
	    };
	    return SurveyQuestionMatrixDropdownRow;
	}(_reactquestionelement.SurveyElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("matrixdropdown", function (props) {
	    return React.createElement(SurveyQuestionMatrixDropdown, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionMatrixRow = exports.SurveyQuestionMatrix = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionMatrix = exports.SurveyQuestionMatrix = function (_super) {
	    __extends(SurveyQuestionMatrix, _super);
	    function SurveyQuestionMatrix(props) {
	        _super.call(this, props);
	    }
	    Object.defineProperty(SurveyQuestionMatrix.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionMatrix.prototype.render = function () {
	        if (!this.question) return null;
	        var firstTH = this.question.hasRows ? React.createElement("th", null) : null;
	        var headers = [];
	        for (var i = 0; i < this.question.columns.length; i++) {
	            var column = this.question.columns[i];
	            var key = "column" + i;
	            headers.push(React.createElement("th", { key: key }, column.text));
	        }
	        var rows = [];
	        var visibleRows = this.question.visibleRows;
	        for (var i = 0; i < visibleRows.length; i++) {
	            var row = visibleRows[i];
	            var key = "row" + i;
	            rows.push(React.createElement(SurveyQuestionMatrixRow, { key: key, question: this.question, css: this.css, rootCss: this.rootCss, isDisplayMode: this.isDisplayMode, row: row, isFirst: i == 0 }));
	        }
	        return React.createElement("table", { className: this.css.root }, React.createElement("thead", null, React.createElement("tr", null, firstTH, headers)), React.createElement("tbody", null, rows));
	    };
	    return SurveyQuestionMatrix;
	}(_reactquestionelement.SurveyQuestionElementBase);
	var SurveyQuestionMatrixRow = exports.SurveyQuestionMatrixRow = function (_super) {
	    __extends(SurveyQuestionMatrixRow, _super);
	    function SurveyQuestionMatrixRow(props) {
	        _super.call(this, props);
	        this.question = props.question;
	        this.row = props.row;
	        this.isFirst = props.isFirst;
	        this.handleOnChange = this.handleOnChange.bind(this);
	    }
	    SurveyQuestionMatrixRow.prototype.handleOnChange = function (event) {
	        this.row.value = event.target.value;
	        this.setState({ value: this.row.value });
	    };
	    SurveyQuestionMatrixRow.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.question = nextProps.question;
	        this.row = nextProps.row;
	        this.isFirst = nextProps.isFirst;
	    };
	    SurveyQuestionMatrixRow.prototype.render = function () {
	        if (!this.row) return null;
	        var firstTD = this.question.hasRows ? React.createElement("td", null, this.row.text) : null;
	        var tds = [];
	        for (var i = 0; i < this.question.columns.length; i++) {
	            var column = this.question.columns[i];
	            var key = "value" + i;
	            var isChecked = this.row.value == column.value;
	            var inputId = this.isFirst && i == 0 ? this.question.inputId : null;
	            var td = React.createElement("td", { key: key }, React.createElement("input", { id: inputId, type: "radio", name: this.row.fullName, value: column.value, disabled: this.isDisplayMode, checked: isChecked, onChange: this.handleOnChange }));
	            tds.push(td);
	        }
	        return React.createElement("tr", null, firstTD, tds);
	    };
	    return SurveyQuestionMatrixRow;
	}(_reactquestionelement.SurveyElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("matrix", function (props) {
	    return React.createElement(SurveyQuestionMatrix, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionHtml = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionHtml = exports.SurveyQuestionHtml = function (_super) {
	    __extends(SurveyQuestionHtml, _super);
	    function SurveyQuestionHtml(props) {
	        _super.call(this, props);
	    }
	    Object.defineProperty(SurveyQuestionHtml.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionHtml.prototype.render = function () {
	        if (!this.question || !this.question.html) return null;
	        var htmlValue = { __html: this.question.processedHtml };
	        return React.createElement("div", { dangerouslySetInnerHTML: htmlValue });
	    };
	    return SurveyQuestionHtml;
	}(_reactquestionelement.SurveyQuestionElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("html", function (props) {
	    return React.createElement(SurveyQuestionHtml, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionFile = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionFile = exports.SurveyQuestionFile = function (_super) {
	    __extends(SurveyQuestionFile, _super);
	    function SurveyQuestionFile(props) {
	        _super.call(this, props);
	        this.state = { fileLoaded: 0 };
	        this.handleOnChange = this.handleOnChange.bind(this);
	    }
	    Object.defineProperty(SurveyQuestionFile.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionFile.prototype.handleOnChange = function (event) {
	        var src = event.target || event.srcElement;
	        if (!window["FileReader"]) return;
	        if (!src || !src.files || src.files.length < 1) return;
	        this.question.loadFile(src.files[0]);
	        this.setState({ fileLoaded: this.state.fileLoaded + 1 });
	    };
	    SurveyQuestionFile.prototype.render = function () {
	        if (!this.question) return null;
	        var img = this.renderImage();
	        var fileInput = null;
	        if (!this.isDisplayMode) {
	            fileInput = React.createElement("input", { id: this.question.inputId, type: "file", onChange: this.handleOnChange });
	        }
	        return React.createElement("div", null, fileInput, img);
	    };
	    SurveyQuestionFile.prototype.renderImage = function () {
	        if (!this.question.previewValue) return null;
	        return React.createElement("div", null, "  ", React.createElement("img", { src: this.question.previewValue, height: this.question.imageHeight, width: this.question.imageWidth }));
	    };
	    return SurveyQuestionFile;
	}(_reactquestionelement.SurveyQuestionElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("file", function (props) {
	    return React.createElement(SurveyQuestionFile, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionMultipleTextItem = exports.SurveyQuestionMultipleText = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionMultipleText = exports.SurveyQuestionMultipleText = function (_super) {
	    __extends(SurveyQuestionMultipleText, _super);
	    function SurveyQuestionMultipleText(props) {
	        _super.call(this, props);
	    }
	    Object.defineProperty(SurveyQuestionMultipleText.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionMultipleText.prototype.render = function () {
	        if (!this.question) return null;
	        var tableRows = this.question.getRows();
	        var rows = [];
	        for (var i = 0; i < tableRows.length; i++) {
	            rows.push(this.renderRow("item" + i, tableRows[i]));
	        }
	        return React.createElement("table", { className: this.css.root }, React.createElement("tbody", null, rows));
	    };
	    SurveyQuestionMultipleText.prototype.renderRow = function (key, items) {
	        var tds = [];
	        for (var i = 0; i < items.length; i++) {
	            var item = items[i];
	            tds.push(React.createElement("td", { key: "label" + i }, React.createElement("span", { className: this.css.itemTitle }, item.title)));
	            tds.push(React.createElement("td", { key: "value" + i }, this.renderItem(item, i == 0)));
	        }
	        return React.createElement("tr", { key: key }, tds);
	    };
	    SurveyQuestionMultipleText.prototype.renderItem = function (item, isFirst) {
	        var inputId = isFirst ? this.question.inputId : null;
	        return React.createElement(SurveyQuestionMultipleTextItem, { item: item, css: this.css, isDisplayMode: this.isDisplayMode, inputId: inputId });
	    };
	    return SurveyQuestionMultipleText;
	}(_reactquestionelement.SurveyQuestionElementBase);
	var SurveyQuestionMultipleTextItem = exports.SurveyQuestionMultipleTextItem = function (_super) {
	    __extends(SurveyQuestionMultipleTextItem, _super);
	    function SurveyQuestionMultipleTextItem(props) {
	        _super.call(this, props);
	        this.item = props.item;
	        this.inputId = props.inputId;
	        this.state = { value: this.item.value || '' };
	        this.handleOnChange = this.handleOnChange.bind(this);
	        this.handleOnBlur = this.handleOnBlur.bind(this);
	    }
	    SurveyQuestionMultipleTextItem.prototype.handleOnChange = function (event) {
	        this.setState({ value: event.target.value });
	    };
	    SurveyQuestionMultipleTextItem.prototype.handleOnBlur = function (event) {
	        this.item.value = event.target.value;
	        this.setState({ value: this.item.value });
	    };
	    SurveyQuestionMultipleTextItem.prototype.componentWillReceiveProps = function (nextProps) {
	        this.item = nextProps.item;
	        this.css = nextProps.css;
	    };
	    SurveyQuestionMultipleTextItem.prototype.render = function () {
	        if (!this.item) return null;
	        var style = { float: "left" };
	        if (this.isDisplayMode) return React.createElement("div", { id: this.inputId, className: this.css.itemValue, style: style }, this.item.value);
	        return React.createElement("input", { id: this.inputId, className: this.css.itemValue, style: style, type: "text", value: this.state.value, onBlur: this.handleOnBlur, onChange: this.handleOnChange });
	    };
	    Object.defineProperty(SurveyQuestionMultipleTextItem.prototype, "mainClassName", {
	        get: function get() {
	            return "";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyQuestionMultipleTextItem;
	}(_reactquestionelement.SurveyElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("multipletext", function (props) {
	    return React.createElement(SurveyQuestionMultipleText, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionRadiogroup = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestioncomment = __webpack_require__(42);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionRadiogroup = exports.SurveyQuestionRadiogroup = function (_super) {
	    __extends(SurveyQuestionRadiogroup, _super);
	    function SurveyQuestionRadiogroup(props) {
	        _super.call(this, props);
	        this.state = { choicesChanged: 0 };
	        var self = this;
	        this.question.choicesChangedCallback = function () {
	            self.state.choicesChanged = self.state.choicesChanged + 1;
	            self.setState(self.state);
	        };
	        this.handleOnChange = this.handleOnChange.bind(this);
	    }
	    Object.defineProperty(SurveyQuestionRadiogroup.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionRadiogroup.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.handleOnChange = this.handleOnChange.bind(this);
	    };
	    SurveyQuestionRadiogroup.prototype.handleOnChange = function (event) {
	        this.question.value = event.target.value;
	        this.setState({ value: this.question.value });
	    };
	    SurveyQuestionRadiogroup.prototype.render = function () {
	        if (!this.question) return null;
	        return React.createElement("form", { className: this.css.root }, this.getItems());
	    };
	    SurveyQuestionRadiogroup.prototype.getItems = function () {
	        var items = [];
	        for (var i = 0; i < this.question.visibleChoices.length; i++) {
	            var item = this.question.visibleChoices[i];
	            var key = "item" + i;
	            items.push(this.renderItem(key, item, i == 0));
	        }
	        return items;
	    };
	    Object.defineProperty(SurveyQuestionRadiogroup.prototype, "textStyle", {
	        get: function get() {
	            return { marginLeft: "3px" };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionRadiogroup.prototype.renderItem = function (key, item, isFirst) {
	        var itemWidth = this.question.colCount > 0 ? 100 / this.question.colCount + "%" : "";
	        var marginRight = this.question.colCount == 0 ? "5px" : "0px";
	        var divStyle = { marginRight: marginRight };
	        if (itemWidth) {
	            divStyle["width"] = itemWidth;
	        }
	        var isChecked = this.question.value == item.value;
	        var otherItem = isChecked && item.value === this.question.otherItem.value ? this.renderOther() : null;
	        return this.renderRadio(key, item, isChecked, divStyle, otherItem, isFirst);
	    };
	    SurveyQuestionRadiogroup.prototype.renderRadio = function (key, item, isChecked, divStyle, otherItem, isFirst) {
	        var id = isFirst ? this.question.inputId : null;
	        return React.createElement("div", { key: key, className: this.css.item, style: divStyle }, React.createElement("label", { className: this.css.item }, React.createElement("input", { id: id, type: "radio", checked: isChecked, value: item.value, disabled: this.isDisplayMode, onChange: this.handleOnChange }), React.createElement("span", { style: this.textStyle }, item.text)), otherItem);
	    };
	    SurveyQuestionRadiogroup.prototype.renderOther = function () {
	        return React.createElement("div", { className: this.css.other }, React.createElement(_reactquestioncomment.SurveyQuestionCommentItem, { question: this.question, css: this.rootCss, isDisplayMode: this.isDisplayMode }));
	    };
	    return SurveyQuestionRadiogroup;
	}(_reactquestionelement.SurveyQuestionElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("radiogroup", function (props) {
	    return React.createElement(SurveyQuestionRadiogroup, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionText = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionText = exports.SurveyQuestionText = function (_super) {
	    __extends(SurveyQuestionText, _super);
	    function SurveyQuestionText(props) {
	        _super.call(this, props);
	        this.state = { value: this.question.value || '' };
	        this.handleOnChange = this.handleOnChange.bind(this);
	        this.handleOnBlur = this.handleOnBlur.bind(this);
	    }
	    Object.defineProperty(SurveyQuestionText.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionText.prototype.handleOnChange = function (event) {
	        this.setState({ value: event.target.value });
	    };
	    SurveyQuestionText.prototype.handleOnBlur = function (event) {
	        this.question.value = event.target.value;
	        this.setState({ value: this.question.value || '' });
	    };
	    SurveyQuestionText.prototype.render = function () {
	        if (!this.question) return null;
	        if (this.isDisplayMode) return React.createElement("div", { id: this.question.inputId, className: this.css }, this.question.value);
	        return React.createElement("input", { id: this.question.inputId, className: this.css, type: this.question.inputType, value: this.state.value, size: this.question.size, onBlur: this.handleOnBlur, onChange: this.handleOnChange });
	    };
	    return SurveyQuestionText;
	}(_reactquestionelement.SurveyQuestionElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("text", function (props) {
	    return React.createElement(SurveyQuestionText, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionMatrixDynamicRow = exports.SurveyQuestionMatrixDynamic = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestion = __webpack_require__(41);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionMatrixDynamic = exports.SurveyQuestionMatrixDynamic = function (_super) {
	    __extends(SurveyQuestionMatrixDynamic, _super);
	    function SurveyQuestionMatrixDynamic(props) {
	        _super.call(this, props);
	        this.setProperties(props);
	    }
	    Object.defineProperty(SurveyQuestionMatrixDynamic.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionMatrixDynamic.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.setProperties(nextProps);
	    };
	    SurveyQuestionMatrixDynamic.prototype.setProperties = function (nextProps) {
	        var self = this;
	        this.state = { rowCounter: 0 };
	        this.question.rowCountChangedCallback = function () {
	            self.state.rowCounter = self.state.rowCounter + 1;
	            self.setState(self.state);
	        };
	        this.handleOnRowAddClick = this.handleOnRowAddClick.bind(this);
	    };
	    SurveyQuestionMatrixDynamic.prototype.handleOnRowAddClick = function (event) {
	        this.question.addRow();
	    };
	    SurveyQuestionMatrixDynamic.prototype.render = function () {
	        if (!this.question) return null;
	        var headers = [];
	        for (var i = 0; i < this.question.columns.length; i++) {
	            var column = this.question.columns[i];
	            var key = "column" + i;
	            var minWidth = this.question.getColumnWidth(column);
	            var columnStyle = minWidth ? { minWidth: minWidth } : {};
	            headers.push(React.createElement("th", { key: key, style: columnStyle }, this.question.getColumnTitle(column)));
	        }
	        var rows = [];
	        var visibleRows = this.question.visibleRows;
	        for (var i = 0; i < visibleRows.length; i++) {
	            var row = visibleRows[i];
	            var key = "row" + i;
	            rows.push(React.createElement(SurveyQuestionMatrixDynamicRow, { key: key, row: row, question: this.question, index: i, css: this.css, rootCss: this.rootCss, isDisplayMode: this.isDisplayMode, creator: this.creator }));
	        }
	        var divStyle = this.question.horizontalScroll ? { overflowX: 'scroll' } : {};
	        var btnDeleteTD = !this.isDisplayMode ? React.createElement("th", null) : null;
	        return React.createElement("div", null, React.createElement("div", { style: divStyle }, React.createElement("table", { className: this.css.root }, React.createElement("thead", null, React.createElement("tr", null, headers, btnDeleteTD)), React.createElement("tbody", null, rows))), this.renderAddRowButton());
	    };
	    SurveyQuestionMatrixDynamic.prototype.renderAddRowButton = function () {
	        if (this.isDisplayMode) return null;
	        return React.createElement("input", { className: this.css.button, type: "button", onClick: this.handleOnRowAddClick, value: this.question.addRowText });
	    };
	    return SurveyQuestionMatrixDynamic;
	}(_reactquestionelement.SurveyQuestionElementBase);
	var SurveyQuestionMatrixDynamicRow = exports.SurveyQuestionMatrixDynamicRow = function (_super) {
	    __extends(SurveyQuestionMatrixDynamicRow, _super);
	    function SurveyQuestionMatrixDynamicRow(props) {
	        _super.call(this, props);
	        this.setProperties(props);
	    }
	    SurveyQuestionMatrixDynamicRow.prototype.componentWillReceiveProps = function (nextProps) {
	        _super.prototype.componentWillReceiveProps.call(this, nextProps);
	        this.setProperties(nextProps);
	    };
	    SurveyQuestionMatrixDynamicRow.prototype.setProperties = function (nextProps) {
	        this.row = nextProps.row;
	        this.question = nextProps.question;
	        this.index = nextProps.index;
	        this.creator = nextProps.creator;
	        this.handleOnRowRemoveClick = this.handleOnRowRemoveClick.bind(this);
	    };
	    SurveyQuestionMatrixDynamicRow.prototype.handleOnRowRemoveClick = function (event) {
	        this.question.removeRow(this.index);
	    };
	    SurveyQuestionMatrixDynamicRow.prototype.render = function () {
	        if (!this.row) return null;
	        var tds = [];
	        for (var i = 0; i < this.row.cells.length; i++) {
	            var cell = this.row.cells[i];
	            var errors = React.createElement(_reactquestion.SurveyQuestionErrors, { question: cell.question, css: this.rootCss, creator: this.creator });
	            var select = this.renderQuestion(cell);
	            tds.push(React.createElement("td", { key: "row" + i }, errors, select));
	        }
	        if (!this.isDisplayMode) {
	            var removeButton = this.renderButton();
	            tds.push(React.createElement("td", { key: "row" + this.row.cells.length + 1 }, removeButton));
	        }
	        return React.createElement("tr", null, tds);
	    };
	    SurveyQuestionMatrixDynamicRow.prototype.renderQuestion = function (cell) {
	        return this.creator.createQuestionElement(cell.question);
	    };
	    SurveyQuestionMatrixDynamicRow.prototype.renderButton = function () {
	        return React.createElement("input", { className: this.css.button, type: "button", onClick: this.handleOnRowRemoveClick, value: this.question.removeRowText });
	    };
	    return SurveyQuestionMatrixDynamicRow;
	}(_reactquestionelement.SurveyElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("matrixdynamic", function (props) {
	    return React.createElement(SurveyQuestionMatrixDynamic, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyQuestionRating = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactquestionelement = __webpack_require__(43);
	
	var _reactquestioncomment = __webpack_require__(42);
	
	var _reactquestionfactory = __webpack_require__(44);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyQuestionRating = exports.SurveyQuestionRating = function (_super) {
	    __extends(SurveyQuestionRating, _super);
	    function SurveyQuestionRating(props) {
	        _super.call(this, props);
	        this.handleOnChange = this.handleOnChange.bind(this);
	    }
	    Object.defineProperty(SurveyQuestionRating.prototype, "question", {
	        get: function get() {
	            return this.questionBase;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyQuestionRating.prototype.handleOnChange = function (event) {
	        this.question.value = event.target.value;
	        this.setState({ value: this.question.value });
	    };
	    SurveyQuestionRating.prototype.render = function () {
	        if (!this.question) return null;
	        var values = [];
	        for (var i = 0; i < this.question.visibleRateValues.length; i++) {
	            var minText = i == 0 ? this.question.mininumRateDescription + " " : null;
	            var maxText = i == this.question.visibleRateValues.length - 1 ? " " + this.question.maximumRateDescription : null;
	            values.push(this.renderItem("value" + i, this.question.visibleRateValues[i], minText, maxText));
	        }
	        var comment = this.question.hasOther ? this.renderOther() : null;
	        return React.createElement("div", { className: this.css.root }, values, comment);
	    };
	    SurveyQuestionRating.prototype.renderItem = function (key, item, minText, maxText) {
	        var isChecked = this.question.value == item.value;
	        var className = this.css.item;
	        if (isChecked) className += " active";
	        var min = minText ? React.createElement("span", null, minText) : null;
	        var max = maxText ? React.createElement("span", null, maxText) : null;
	        return React.createElement("label", { key: key, className: className }, React.createElement("input", { type: "radio", style: { display: "none" }, name: this.question.name, value: item.value, disabled: this.isDisplayMode, checked: this.question.value == item.value, onChange: this.handleOnChange }), min, React.createElement("span", null, item.text), max);
	    };
	    SurveyQuestionRating.prototype.renderOther = function () {
	        return React.createElement("div", { className: this.css.other }, React.createElement(_reactquestioncomment.SurveyQuestionCommentItem, { question: this.question, css: this.rootCss, isDisplayMode: this.isDisplayMode }));
	    };
	    return SurveyQuestionRating;
	}(_reactquestionelement.SurveyQuestionElementBase);
	_reactquestionfactory.ReactQuestionFactory.Instance.registerQuestion("rating", function (props) {
	    return React.createElement(SurveyQuestionRating, props);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyWindow = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
	var _reactSurvey = __webpack_require__(37);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyWindow = exports.SurveyWindow = function (_super) {
	    __extends(SurveyWindow, _super);
	    function SurveyWindow(props) {
	        _super.call(this, props);
	        this.handleOnExpanded = this.handleOnExpanded.bind(this);
	    }
	    SurveyWindow.prototype.handleOnExpanded = function (event) {
	        this.state.expanded = !this.state.expanded;
	        this.setState(this.state);
	    };
	    SurveyWindow.prototype.render = function () {
	        if (this.state.hidden) return null;
	        var header = this.renderHeader();
	        var body = this.state.expanded ? this.renderBody() : null;
	        var style = { position: "fixed", bottom: "3px", right: "10px" };
	        return React.createElement("div", { className: this.css.window.root, style: style }, header, body);
	    };
	    SurveyWindow.prototype.renderHeader = function () {
	        var styleA = { width: "100%" };
	        var styleTitle = { paddingRight: "10px" };
	        var glyphClassName = this.state.expanded ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
	        glyphClassName = "glyphicon pull-right " + glyphClassName;
	        return React.createElement("div", { className: this.css.window.header.root }, React.createElement("a", { href: "#", onClick: this.handleOnExpanded, style: styleA }, React.createElement("span", { className: this.css.window.header.title, style: styleTitle }, this.title), React.createElement("span", { className: glyphClassName, "aria-hidden": "true" })));
	    };
	    SurveyWindow.prototype.renderBody = function () {
	        return React.createElement("div", { class: this.css.window.body }, this.renderSurvey());
	    };
	    SurveyWindow.prototype.updateSurvey = function (newProps) {
	        _super.prototype.updateSurvey.call(this, newProps);
	        this.title = newProps.title ? newProps.title : this.survey.title;
	        var hasExpanded = newProps["expanded"] ? newProps.expanded : false;
	        this.state = { expanded: hasExpanded, hidden: false };
	        var self = this;
	        this.survey.onComplete.add(function (s) {
	            self.state.hidden = true;
	            self.setState(self.state);
	        });
	    };
	    return SurveyWindow;
	}(_reactSurvey.Survey);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(61);
	
	__webpack_require__(62);
	
	__webpack_require__(63);
	
	__webpack_require__(64);
	
	__webpack_require__(65);
	
	__webpack_require__(66);
	
	__webpack_require__(67);
	
	__webpack_require__(68);
	
	__webpack_require__(69);

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.danishSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var danishSurveyStrings = exports.danishSurveyStrings = {
	    pagePrevText: "Tilbage",
	    pageNextText: "Videre",
	    completeText: "Færdig",
	    progressText: "Side {0} af {1}",
	    emptySurvey: "Der er ingen synlige spørgsmål.",
	    completingSurvey: "Mange tak for din besvarelse!",
	    loadingSurvey: "Spørgeskemaet hentes fra serveren...",
	    otherItemText: "Valgfrit svar...",
	    optionsCaption: "Vælg...",
	    requiredError: "Besvar venligst spørgsmålet.",
	    numericError: "Angiv et tal.",
	    textMinLength: "Angiv mindst {0} tegn.",
	    minSelectError: "Vælg venligst mindst  {0} svarmulighed(er).",
	    maxSelectError: "Vælg venligst færre {0} svarmuligheder(er).",
	    numericMinMax: "'{0}' skal være lig med eller større end {1} og lig med eller mindre end {2}",
	    numericMin: "'{0}' skal være lig med eller større end {1}",
	    numericMax: "'{0}' skal være lig med eller mindre end {1}",
	    invalidEmail: "Angiv venligst en gyldig e-mail adresse.",
	    exceedMaxSize: "Filstørrelsen må ikke overstige {0}.",
	    otherRequiredError: "Angiv en værdi for dit valgfrie svar."
	};
	_surveyStrings.surveyLocalization.locales["da"] = danishSurveyStrings;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.dutchSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var dutchSurveyStrings = exports.dutchSurveyStrings = {
	    pagePrevText: "Vorige",
	    pageNextText: "Volgende",
	    completeText: "Afsluiten",
	    otherItemText: "Andere",
	    progressText: "Pagina {0} van {1}",
	    emptySurvey: "Er is geen zichtbare pagina of vraag in deze vragenlijst",
	    completingSurvey: "Bedankt om deze vragenlijst in te vullen",
	    loadingSurvey: "De vragenlijst is aan het laden...",
	    optionsCaption: "Kies...",
	    requiredError: "Gelieve een antwoord in te vullen",
	    numericError: "Het antwoord moet een getal zijn",
	    textMinLength: "Gelieve minsten {0} karakters in te vullen.",
	    minSelectError: "Gelieve minimum {0} antwoorden te selecteren.",
	    maxSelectError: "Gelieve niet meer dan {0} antwoorden te selecteren.",
	    numericMinMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1} en kleiner of gelijk aan {2}",
	    numericMin: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
	    numericMax: "Uw antwoord '{0}' moet groter of gelijk zijn aan {1}",
	    invalidEmail: "Gelieve een geldig e-mailadres in te vullen.",
	    exceedMaxSize: "De grootte van het bestand mag niet groter zijn dan {0}.",
	    otherRequiredError: "Gelieve het veld 'Andere' in te vullen"
	};
	_surveyStrings.surveyLocalization.locales["nl"] = dutchSurveyStrings;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.finnishSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var finnishSurveyStrings = exports.finnishSurveyStrings = {
	    pagePrevText: "Edellinen",
	    pageNextText: "Seuraava",
	    completeText: "Valmis",
	    otherItemText: "Muu (kuvaile)",
	    progressText: "Sivu {0}/{1}",
	    emptySurvey: "Tässä kyselyssä ei ole yhtäkään näkyvillä olevaa sivua tai kysymystä.",
	    completingSurvey: "Kiitos kyselyyn vastaamisesta!",
	    loadingSurvey: "Kyselyä ladataan palvelimelta...",
	    optionsCaption: "Valitse...",
	    requiredError: "Vastaa kysymykseen, kiitos.",
	    numericError: "Arvon tulee olla numeerinen.",
	    textMinLength: "Ole hyvä ja syötä vähintään {0} merkkiä.",
	    minSelectError: "Ole hyvä ja valitse vähintään {0} vaihtoehtoa.",
	    maxSelectError: "Ole hyvä ja valitse enintään {0} vaihtoehtoa.",
	    numericMinMax: "'{0}' täytyy olla enemmän tai yhtä suuri kuin {1} ja vähemmän tai yhtä suuri kuin {2}",
	    numericMin: "'{0}' täytyy olla enemmän tai yhtä suuri kuin {1}",
	    numericMax: "'{0}' täytyy olla vähemmän tai yhtä suuri kuin {1}",
	    invalidEmail: "Syötä validi sähköpostiosoite.",
	    otherRequiredError: "Ole hyvä ja syötä \"Muu (kuvaile)\""
	};
	_surveyStrings.surveyLocalization.locales["fi"] = finnishSurveyStrings;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.frenchSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var frenchSurveyStrings = exports.frenchSurveyStrings = {
	    pagePrevText: "Pr\xE9c\xE9dent",
	    pageNextText: "Suivant",
	    completeText: "Terminer",
	    otherItemText: "Autre (pr\xE9ciser)",
	    progressText: "Page {0} sur {1}",
	    emptySurvey: "Il n'y a ni page visible ni question visible dans ce questionnaire",
	    completingSurvey: "Merci d'avoir r\xE9pondu au questionnaire!",
	    loadingSurvey: "Le questionnaire est en cours de chargement...",
	    optionsCaption: "Choisissez...",
	    requiredError: "La r\xE9ponse \xE0 cette question est obligatoire.",
	    numericError: "La r\xE9ponse doit \xEAtre un nombre.",
	    textMinLength: "Merci d'entrer au moins {0} symboles.",
	    minSelectError: "Merci de s\xE9lectionner au moins {0}r\xE9ponses.",
	    maxSelectError: "Merci de s\xE9lectionner au plus {0}r\xE9ponses.",
	    numericMinMax: "Votre r\xE9ponse '{0}' doit \xEAtresup\xE9rieure ou \xE9gale \xE0 {1} et inf\xE9rieure ou\xE9gale \xE0 {2}",
	    numericMin: "Votre r\xE9ponse '{0}' doit \xEAtresup\xE9rieure ou \xE9gale \xE0 {1}",
	    numericMax: "Votre r\xE9ponse '{0}' doit \xEAtreinf\xE9rieure ou \xE9gale \xE0 {1}",
	    invalidEmail: "Merci d'entrer une adresse mail valide.",
	    exceedMaxSize: "La taille du fichier ne doit pas exc\xE9der {0}.",
	    otherRequiredError: "Merci de pr\xE9ciser le champ 'Autre'."
	};
	_surveyStrings.surveyLocalization.locales["fr"] = frenchSurveyStrings;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.germanSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var germanSurveyStrings = exports.germanSurveyStrings = {
	    pagePrevText: "Zurück",
	    pageNextText: "Weiter",
	    completeText: "Fertig",
	    progressText: "Seite {0} von {1}",
	    emptySurvey: "Es gibt keine sichtbare Frage.",
	    completingSurvey: "Vielen Dank für das Ausfüllen des Fragebogens!",
	    loadingSurvey: "Der Fragebogen wird vom Server geladen...",
	    otherItemText: "Benutzerdefinierte Antwort...",
	    optionsCaption: "Wählen...",
	    requiredError: "Bitte antworten Sie auf die Frage.",
	    numericError: "Der Wert sollte eine Zahl sein.",
	    textMinLength: "Bitte geben Sie mindestens {0} Symbole.",
	    minSelectError: "Bitte wählen Sie mindestens {0} Varianten.",
	    maxSelectError: "Bitte wählen Sie nicht mehr als {0} Varianten.",
	    numericMinMax: "'{0}' solte gleich oder größer sein als {1} und gleich oder kleiner als {2}",
	    numericMin: "'{0}' solte gleich oder größer sein als {1}",
	    numericMax: "'{0}' solte gleich oder kleiner als {1}",
	    invalidEmail: "Bitte geben Sie eine gültige Email-Adresse ein.",
	    exceedMaxSize: "Die Dateigröße soll nicht mehr als {0}.",
	    otherRequiredError: "Bitte geben Sie einen Wert für Ihre benutzerdefinierte Antwort ein."
	};
	_surveyStrings.surveyLocalization.locales["de"] = germanSurveyStrings;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.greekSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var greekSurveyStrings = exports.greekSurveyStrings = {
	    pagePrevText: "Προηγούμενο",
	    pageNextText: "Επόμενο",
	    completeText: "Ολοκλήρωση",
	    otherItemText: "Άλλο (παρακαλώ διευκρινίστε)",
	    progressText: "Σελίδα {0} από {1}",
	    emptySurvey: "Δεν υπάρχει καμία ορατή σελίδα ή ορατή ερώτηση σε αυτό το ερωτηματολόγιο.",
	    completingSurvey: "Ευχαριστούμε για την συμπλήρωση αυτου του ερωτηματολογίου!",
	    loadingSurvey: "Το ερωτηματολόγιο φορτώνεται απο το διακομιστή...",
	    optionsCaption: "Επιλέξτε...",
	    requiredError: "Παρακαλώ απαντήστε στην ερώτηση.",
	    requiredInAllRowsError: "Παρακαλώ απαντήστε στις ερωτήσεις σε όλες τις γραμμές.",
	    numericError: "Η τιμή πρέπει να είναι αριθμιτική.",
	    textMinLength: "Παρακαλώ συμπληρώστε τουλάχιστον {0} σύμβολα.",
	    minRowCountError: "Παρακαλώ συμπληρώστε τουλάχιστον {0} γραμμές.",
	    minSelectError: "Παρακαλώ επιλέξτε τουλάχιστον {0} παραλλαγές.",
	    maxSelectError: "Παρακαλώ επιλέξτε όχι παραπάνω απο {0} παραλλαγές.",
	    numericMinMax: "Το '{0}' θα πρέπει να είναι ίσο ή μεγαλύτερο απο το {1} και ίσο ή μικρότερο απο το {2}",
	    numericMin: "Το '{0}' πρέπει να είναι μεγαλύτερο ή ισο με το {1}",
	    numericMax: "Το '{0}' πρέπει να είναι μικρότερο ή ίσο απο το {1}",
	    invalidEmail: "Παρακαλώ δώστε μια αποδεκτή διεύθυνση e-mail.",
	    urlRequestError: "Η αίτηση επέστρεψε σφάλμα '{0}'. {1}",
	    urlGetChoicesError: "Η αίτηση επέστρεψε κενά δεδομένα ή η ιδότητα 'μονοπάτι/path' είναι εσφαλέμένη",
	    exceedMaxSize: "Το μέγεθος δεν μπορεί να υπερβένει τα {0}.",
	    otherRequiredError: "Παρακαλώ συμπληρώστε την τιμή για το πεδίο 'άλλο'.",
	    uploadingFile: "Το αρχείο σας ανεβαίνει. Παρακαλώ περιμένετε καποια δευτερόλεπτα και δοκιμάστε ξανά.",
	    addRow: "Προσθήκη γραμμής",
	    removeRow: "Αφαίρεση"
	};
	_surveyStrings.surveyLocalization.locales["gr"] = greekSurveyStrings;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.polishSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var polishSurveyStrings = exports.polishSurveyStrings = {
	    pagePrevText: "Wstecz",
	    pageNextText: "Dalej",
	    completeText: "Gotowe",
	    progressText: "Strona {0} z {1}",
	    emptySurvey: "Nie ma widocznych pytań.",
	    completingSurvey: "Dziękujemy za wypełnienie ankiety!",
	    loadingSurvey: "Trwa wczytywanie ankiety...",
	    otherItemText: "Inna odpowiedź...",
	    optionsCaption: "Wybierz...",
	    requiredError: "Proszę odpowiedzieć na to pytanie.",
	    numericError: "W tym polu można wpisać tylko liczby.",
	    textMinLength: "Proszę wpisać co najmniej {0} znaków.",
	    minSelectError: "Proszę wybrać co najmniej {0} pozycji.",
	    maxSelectError: "Proszę wybrać nie więcej niż {0} pozycji.",
	    numericMinMax: "Odpowiedź '{0}' powinna być większa lub równa {1} oraz mniejsza lub równa {2}",
	    numericMin: "Odpowiedź '{0}' powinna być większa lub równa {1}",
	    numericMax: "Odpowiedź '{0}' powinna być mniejsza lub równa {1}",
	    invalidEmail: "Proszę podać prawidłowy adres email.",
	    exceedMaxSize: "Rozmiar przesłanego pliku nie może przekraczać {0}.",
	    otherRequiredError: "Proszę podać inną odpowiedź."
	};
	_surveyStrings.surveyLocalization.locales["pl"] = polishSurveyStrings;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.russianSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var russianSurveyStrings = exports.russianSurveyStrings = {
	    pagePrevText: "Назад",
	    pageNextText: "Далее",
	    completeText: "Готово",
	    progressText: "Страница {0} из {1}",
	    emptySurvey: "Нет ни одного вопроса.",
	    completingSurvey: "Благодарим Вас за заполнение анкеты!",
	    loadingSurvey: "Загрузка с сервера...",
	    otherItemText: "Другое (пожалуйста, опишите)",
	    optionsCaption: "Выбрать...",
	    requiredError: "Пожалуйста, ответьте на вопрос.",
	    numericError: "Ответ должен быть числом.",
	    textMinLength: "Пожалуйста, введите хотя бы {0} символов.",
	    minSelectError: "Пожалуйста, выберите хотя бы {0} вариантов.",
	    maxSelectError: "Пожалуйста, выберите не более {0} вариантов.",
	    numericMinMax: "'{0}' должно быть равным или больше, чем {1}, и равным или меньше, чем {2}",
	    numericMin: "'{0}' должно быть равным или больше, чем {1}",
	    numericMax: "'{0}' должно быть равным или меньше, чем {1}",
	    invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
	    otherRequiredError: "Пожалуйста, введите данные в поле \"Другое\""
	};
	_surveyStrings.surveyLocalization.locales["ru"] = russianSurveyStrings;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.turkishSurveyStrings = undefined;
	
	var _surveyStrings = __webpack_require__(6);
	
	var turkishSurveyStrings = exports.turkishSurveyStrings = {
	    pagePrevText: "Geri",
	    pageNextText: "İleri",
	    completeText: "Anketi Tamamla",
	    otherItemText: "Diğer (açıklayınız)",
	    progressText: "Sayfa {0} / {1}",
	    emptySurvey: "Ankette görüntülenecek sayfa ya da soru mevcut değil.",
	    completingSurvey: "Anketimizi tamamladığınız için teşekkür ederiz.",
	    loadingSurvey: "Anket sunucudan yükleniyor ...",
	    optionsCaption: "Seçiniz ...",
	    requiredError: "Lütfen soruya cevap veriniz",
	    numericError: "Girilen değer numerik olmalıdır",
	    textMinLength: "En az {0} sembol giriniz.",
	    minRowCountError: "Lütfen en az {0} satırı doldurun.",
	    minSelectError: "Lütfen en az {0} seçeneği seçiniz.",
	    maxSelectError: "Lütfen {0} adetten fazla seçmeyiniz.",
	    numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
	    numericMin: "'{0}' değeri {1} değerine eşit veya büyük olmalıdır",
	    numericMax: "'{0}' değeri {1} değerine eşit ya da küçük olmalıdır.",
	    invalidEmail: "Lütfen geçerli bir eposta adresi giriniz.",
	    urlRequestError: "Talebi şu hatayı döndü '{0}'. {1}",
	    urlGetChoicesError: "Talep herhangi bir veri dönmedi ya da 'path' özelliği hatalı.",
	    exceedMaxSize: "Dosya boyutu {0} değerini geçemez.",
	    otherRequiredError: "Lütfen diğer değerleri giriniz.",
	    uploadingFile: "Dosyanız yükleniyor. LÜtfen birkaç saniye bekleyin ve tekrar deneyin.",
	    addRow: "Satır Ekle",
	    removeRow: "Kaldır"
	};
	_surveyStrings.surveyLocalization.locales["tr"] = turkishSurveyStrings;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAzNjI4OWIzODgzZjc5OTAzNzYyYyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9yZWFjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9jaHVua3MvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVN0cmluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzb25vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nob2ljZXNSZXN0ZnVsbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9uc1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9uUHJvY2Vzc1ZhbHVlLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHRQcmVQcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fbWF0cml4ZHJvcGRvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX21hdHJpeGR5bmFtaWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX21hdHJpeC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwid2VicGFjazovLy8uL3NyYy9wYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbl9jaGVja2JveC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fY29tbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fZHJvcGRvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2ZpbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2h0bWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX3JhdGluZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fdGV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5LnRzIiwid2VicGFjazovLy8uL3NyYy9keFN1cnZleVNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyaWdnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVdpbmRvdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmYXVsdENzcy9jc3NzdGFuZGFyZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmYXVsdENzcy9jc3Nib290c3RyYXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0U3VydmV5LnRzeCIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiUmVhY3RcIixcImNvbW1vbmpzMlwiOlwicmVhY3RcIixcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwifSIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RzdXJ2ZXltb2RlbC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cGFnZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb24udHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25lbGVtZW50LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnkudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb24udHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb25CYXNlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXlQcm9ncmVzcy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25jaGVja2JveC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25kcm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXhkcm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uaHRtbC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25maWxlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbm11bHRpcGxldGV4dC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25yYWRpb2dyb3VwLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbnRleHQudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4ZHluYW1pYy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25yYXRpbmcudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleVdpbmRvdy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJpZXMvY2h1bmtzL2xvY2FsaXphdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2RhbmlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2R1dGNoLnRzIiwid2VicGFjazovLy8uL3NyYy9sb2NhbGl6YXRpb24vZmlubmlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2ZyZW5jaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2dlcm1hbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2dyZWVrLnRzIiwid2VicGFjazovLy8uL3NyYy9sb2NhbGl6YXRpb24vcG9saXNoLnRzIiwid2VicGFjazovLy8uL3NyYy9sb2NhbGl6YXRpb24vcnVzc2lhbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL3R1cmtpc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3JDK0I7Ozs7Ozs7Ozs7Ozs7Ozt5QkFRL0I7Ozs7Ozs7OzswQkFHQTs7Ozs7Ozs7O3lCQUNBOzs7Ozs7Ozs7OEJBQ0E7Ozs7Ozs4QkFDQTs7Ozs7Ozs7O3VDQUNBOzs7Ozs7Ozs7bUNBQ0E7Ozs7Ozs7Ozt1QkFBa0I7Ozs7Ozt1QkFDbEI7Ozs7Ozs7OzsyQkFBc0I7Ozs7OzsyQkFDdEI7Ozs7Ozs7OztrQ0FBeUI7Ozs7OztrQ0FDekI7Ozs7Ozs7OztrQ0FBaUM7Ozs7OztrQ0FDakM7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IiwiZmlsZSI6InN1cnZleS5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiU3VydmV5XCIsIFtcInJlYWN0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN1cnZleVwiXSA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTdXJ2ZXlcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzM4X18pIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDM2Mjg5YjM4ODNmNzk5MDM3NjJjXG4gKiovIiwiLy8gbW9kZWxcclxuZXhwb3J0ICogZnJvbSBcIi4vY2h1bmtzL21vZGVsXCI7XHJcblxyXG4vLyBsb2NhbGl6YXRpb25cclxuaW1wb3J0ICcuL2NodW5rcy9sb2NhbGl6YXRpb24nO1xyXG5cclxuLy8gY3NzIHN0YW5kYXJkXHJcbmV4cG9ydCB7ZGVmYXVsdFN0YW5kYXJkQ3NzfSBmcm9tIFwiLi4vZGVmYXVsdENzcy9jc3NzdGFuZGFyZFwiO1xyXG4vLyBjc3MgYm9vdHN0cmFwXHJcbmV4cG9ydCB7ZGVmYXVsdEJvb3RzdHJhcENzc30gZnJvbSBcIi4uL2RlZmF1bHRDc3MvY3NzYm9vdHN0cmFwXCI7XHJcblxyXG4vLyByZWFjdFxyXG5leHBvcnQge1N1cnZleX0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5XCI7XHJcbmV4cG9ydCB7UmVhY3RTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0c3VydmV5bW9kZWxcIjsgLy8gVE9ETyBuZWVkIHRvIHJlbW92ZSBzb21lZGF5XHJcbmV4cG9ydCB7UmVhY3RTdXJ2ZXlNb2RlbCBhcyBNb2RlbH0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0c3VydmV5bW9kZWxcIjtcclxuZXhwb3J0IHtTdXJ2ZXlOYXZpZ2F0aW9uQmFzZX0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbkJhc2VcIjtcclxuZXhwb3J0IHtTdXJ2ZXlOYXZpZ2F0aW9ufSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uXCI7XHJcbmV4cG9ydCB7U3VydmV5UGFnZSwgU3VydmV5Um93fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RwYWdlXCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb24sIFN1cnZleVF1ZXN0aW9uRXJyb3JzfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvblwiO1xyXG5leHBvcnQge1N1cnZleUVsZW1lbnRCYXNlLCBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtLCBTdXJ2ZXlRdWVzdGlvbkNvbW1lbnR9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudFwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uQ2hlY2tib3gsIFN1cnZleVF1ZXN0aW9uQ2hlY2tib3hJdGVtfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmNoZWNrYm94XCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25Ecm9wZG93bn0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0cXVlc3Rpb25kcm9wZG93blwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd24sIFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd25Sb3d9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4ZHJvcGRvd25cIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbk1hdHJpeCwgU3VydmV5UXVlc3Rpb25NYXRyaXhSb3d9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4XCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25IdG1sfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmh0bWxcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbkZpbGV9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9uZmlsZVwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uTXVsdGlwbGVUZXh0LCBTdXJ2ZXlRdWVzdGlvbk11bHRpcGxlVGV4dEl0ZW19IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9ubXVsdGlwbGV0ZXh0XCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25SYWRpb2dyb3VwfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbnJhZGlvZ3JvdXBcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvblRleHR9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9udGV4dFwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uTWF0cml4RHluYW1pYywgU3VydmV5UXVlc3Rpb25NYXRyaXhEeW5hbWljUm93fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeGR5bmFtaWNcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQcm9ncmVzc30gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5UHJvZ3Jlc3NcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvblJhdGluZ30gZnJvbSBcIi4uL3JlYWN0L3JlYWN0cXVlc3Rpb25yYXRpbmdcIjtcclxuZXhwb3J0IHtTdXJ2ZXlXaW5kb3d9IGZyb20gXCIuLi9yZWFjdC9yZWFjdFN1cnZleVdpbmRvd1wiO1xyXG5leHBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjsgLy8gVE9ETyBuZWVkIHRvIHJlbW92ZSBzb21lZGF5XHJcbmV4cG9ydCB7UmVhY3RRdWVzdGlvbkZhY3RvcnkgYXMgUXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCB7X19leHRlbmRzfSBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xyXG5cclxuLy9VbmNvbW1lbnQgdG8gaW5jbHVkZSB0aGUgXCJkYXRlXCIgcXVlc3Rpb24gdHlwZS5cclxuLy9leHBvcnQge2RlZmF1bHQgYXMgU3VydmV5UXVlc3Rpb25EYXRlfSBmcm9tIFwiLi4vcGx1Z2lucy9yZWFjdC9yZWFjdHF1ZXN0aW9uZGF0ZVwiO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJpZXMvcmVhY3QudHNcbiAqKi8iLCJleHBvcnQge1xyXG4gICAgQW5zd2VyQ291bnRWYWxpZGF0b3IsIEVtYWlsVmFsaWRhdG9yLCBOdW1lcmljVmFsaWRhdG9yLCBSZWdleFZhbGlkYXRvcixcclxuICAgIFN1cnZleVZhbGlkYXRvciwgVGV4dFZhbGlkYXRvciwgVmFsaWRhdG9yUmVzdWx0LCBWYWxpZGF0b3JSdW5uZXJcclxufSBmcm9tIFwiLi4vLi4vdmFsaWRhdG9yXCI7XHJcbmV4cG9ydCB7QmFzZSwgRXZlbnQsIEl0ZW1WYWx1ZSwgU3VydmV5RXJyb3IsIElTdXJ2ZXl9IGZyb20gXCIuLi8uLi9iYXNlXCI7XHJcbmV4cG9ydCB7Q2hvaWNlc1Jlc3RmdWxsfSBmcm9tIFwiLi4vLi4vY2hvaWNlc1Jlc3RmdWxsXCI7XHJcbmV4cG9ydCB7Q29uZGl0aW9uLCBDb25kaXRpb25Ob2RlLCBDb25kaXRpb25SdW5uZXJ9IGZyb20gXCIuLi8uLi9jb25kaXRpb25zXCI7XHJcbmV4cG9ydCB7Q29uZGl0aW9uc1BhcnNlcn0gZnJvbSBcIi4uLy4uL2NvbmRpdGlvbnNQYXJzZXJcIjtcclxuZXhwb3J0IHtQcm9jZXNzVmFsdWV9IGZyb20gXCIuLi8uLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuZXhwb3J0IHtDdXN0b21FcnJvciwgRXhjZWVkU2l6ZUVycm9yLCBSZXF1cmVOdW1lcmljRXJyb3J9IGZyb20gXCIuLi8uLi9lcnJvclwiO1xyXG5leHBvcnQge1xyXG4gICAgSnNvbkVycm9yLCBKc29uSW5jb3JyZWN0VHlwZUVycm9yLCBKc29uTWV0YWRhdGEsIEpzb25NZXRhZGF0YUNsYXNzLFxyXG4gICAgSnNvbk1pc3NpbmdUeXBlRXJyb3IsIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSwgSnNvbk9iamVjdCwgSnNvbk9iamVjdFByb3BlcnR5LFxyXG4gICAgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciwgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yXHJcbn0gZnJvbSBcIi4uLy4uL2pzb25vYmplY3RcIjtcclxuZXhwb3J0IHtcclxuICAgIE1hdHJpeERyb3Bkb3duQ2VsbCwgTWF0cml4RHJvcGRvd25Db2x1bW4sIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLFxyXG4gICAgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZVxyXG59IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuZXhwb3J0IHtNYXRyaXhEcm9wZG93blJvd01vZGVsLCBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93blwiO1xyXG5leHBvcnQge01hdHJpeER5bmFtaWNSb3dNb2RlbCwgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcbmV4cG9ydCB7TWF0cml4Um93TW9kZWwsIFF1ZXN0aW9uTWF0cml4TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhcIjtcclxuZXhwb3J0IHtNdWx0aXBsZVRleHRJdGVtTW9kZWwsIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tdWx0aXBsZXRleHRcIjtcclxuZXhwb3J0IHtQYWdlTW9kZWwsIFF1ZXN0aW9uUm93TW9kZWx9IGZyb20gXCIuLi8uLi9wYWdlXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb259IGZyb20gXCIuLi8uLi9xdWVzdGlvblwiO1xyXG5leHBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5leHBvcnQge1F1ZXN0aW9uQ2hlY2tib3hCYXNlLCBRdWVzdGlvblNlbGVjdEJhc2V9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25DaGVja2JveE1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fY2hlY2tib3hcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkNvbW1lbnRNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2NvbW1lbnRcIjtcclxuZXhwb3J0IHsgUXVlc3Rpb25Ecm9wZG93bk1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fZHJvcGRvd25cIjtcclxuZXhwb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi8uLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkZpbGVNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2ZpbGVcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkh0bWxNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2h0bWxcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX3JhZGlvZ3JvdXBcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJhdGluZ01vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fcmF0aW5nXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25UZXh0TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl90ZXh0XCI7XHJcbmV4cG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi8uLi9zdXJ2ZXlcIjtcclxuZXhwb3J0IHtcclxuICAgIFN1cnZleVRyaWdnZXIsIFN1cnZleVRyaWdnZXJDb21wbGV0ZSwgU3VydmV5VHJpZ2dlclNldFZhbHVlLCBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSxcclxuICAgIFRyaWdnZXJcclxufSBmcm9tIFwiLi4vLi4vdHJpZ2dlclwiO1xyXG5leHBvcnQge1N1cnZleVdpbmRvd01vZGVsfSBmcm9tIFwiLi4vLi4vc3VydmV5V2luZG93XCI7XHJcbmV4cG9ydCB7VGV4dFByZVByb2Nlc3Nvcn0gZnJvbSBcIi4uLy4uL3RleHRQcmVQcm9jZXNzb3JcIjtcclxuXHJcbmV4cG9ydCB7ZHhTdXJ2ZXlTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vZHhTdXJ2ZXlTZXJ2aWNlXCI7XHJcbmV4cG9ydCB7c3VydmV5TG9jYWxpemF0aW9uLCBzdXJ2ZXlTdHJpbmdzfSBmcm9tIFwiLi4vLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuLy9VbmNvbW1lbnQgdG8gaW5jbHVkZSB0aGUgXCJkYXRlXCIgcXVlc3Rpb24gdHlwZS5cclxuLy9leHBvcnQge2RlZmF1bHQgYXMgUXVlc3Rpb25EYXRlTW9kZWx9IGZyb20gXCIuLi8uLi9wbHVnaW5zL3F1ZXN0aW9uX2RhdGVcIjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyaWVzL2NodW5rcy9tb2RlbC50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgU3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvciwgUmVxdXJlTnVtZXJpY0Vycm9yfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gJy4vanNvbm9iamVjdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogYW55LCBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbCkge1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPjtcclxuICAgIHZhbHVlOiBhbnk7XHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICBwdWJsaWMgcnVuKG93bmVyOiBJVmFsaWRhdG9yT3duZXIpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25lci52YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LmVycm9yKSByZXR1cm4gdmFsaWRhdG9yUmVzdWx0LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLnZhbHVlID0gdmFsaWRhdG9yUmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTnVtZXJpY1ZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAoIXZhbHVlIHx8ICF0aGlzLmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFZhbGlkYXRvclJlc3VsdChwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tYXhWYWx1ZSAmJiB0aGlzLm1heFZhbHVlIDwgcmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgPyBudWxsIDogcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHZOYW1lID0gbmFtZSA/IG5hbWUgOiBcInZhbHVlXCI7XHJcbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5NYXhcIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5cIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc051bWJlcih2YWx1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG1pbkxlbmd0aDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0dmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInRleHRNaW5MZW5ndGhcIilbXCJmb3JtYXRcIl0odGhpcy5taW5MZW5ndGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQW5zd2VyQ291bnRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG1pbkNvdW50OiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4Q291bnQ6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlLmNvbnN0cnVjdG9yICE9IEFycmF5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgY291bnQgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKHRoaXMubWluQ291bnQgJiYgY291bnQgPCB0aGlzLm1pbkNvdW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWluU2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5taW5Db3VudCkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1heENvdW50ICYmIGNvdW50ID4gdGhpcy5tYXhDb3VudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1heFNlbGVjdEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWF4Q291bnQpKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVnZXhWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHJlZ2V4OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInJlZ2V4dmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAoIXRoaXMucmVnZXggfHwgIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcmUgPSBuZXcgUmVnRXhwKHRoaXMucmVnZXgpO1xyXG4gICAgICAgIGlmIChyZS50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQodmFsdWUsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBFbWFpbFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBwcml2YXRlIHJlID0gL14oKFtePD4oKVxcW1xcXVxcLiw7Olxcc0BcXFwiXSsoXFwuW148PigpXFxbXFxdXFwuLDs6XFxzQFxcXCJdKykqKXwoXFxcIi4rXFxcIikpQCgoW148PigpW1xcXVxcLiw7Olxcc0BcXFwiXStcXC4pK1tePD4oKVtcXF1cXC4sOzpcXHNAXFxcIl17Mix9KSQvaTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJlbWFpbHZhbGlkYXRvclwiOyB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMucmUudGVzdCh2YWx1ZSkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KHZhbHVlLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiaW52YWxpZEVtYWlsXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5dmFsaWRhdG9yXCIsIFtcInRleHRcIl0pO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibnVtZXJpY3ZhbGlkYXRvclwiLCBbXCJtaW5WYWx1ZTpudW1iZXJcIiwgXCJtYXhWYWx1ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBOdW1lcmljVmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidGV4dHZhbGlkYXRvclwiLCBbXCJtaW5MZW5ndGg6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgVGV4dFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImFuc3dlcmNvdW50dmFsaWRhdG9yXCIsIFtcIm1pbkNvdW50Om51bWJlclwiLCBcIm1heENvdW50Om51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFuc3dlckNvdW50VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmVnZXh2YWxpZGF0b3JcIiwgW1wicmVnZXhcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBSZWdleFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImVtYWlsdmFsaWRhdG9yXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgRW1haWxWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdmFsaWRhdG9yLnRzXG4gKiovIiwiZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfX2V4dGVuZHM7XHJcbn1cclxuXHJcbmV4cG9ydHMuX19leHRlbmRzID0gX19leHRlbmRzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2V4dGVuZHMudHNcbiAqKi8iLCJleHBvcnQgaW50ZXJmYWNlIEhhc2hUYWJsZTxUPiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBUO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleURhdGEge1xyXG4gICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTtcclxuICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleSBleHRlbmRzIElTdXJ2ZXlEYXRhIHtcclxuICAgIGN1cnJlbnRQYWdlOiBJUGFnZTtcclxuICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpO1xyXG4gICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pO1xyXG4gICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvcjtcclxuICAgIHByb2Nlc3NIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZztcclxuICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZztcclxuICAgIGlzRGVzaWduTW9kZTogYm9vbGVhbjtcclxuICAgIHJlcXVpcmVkVGV4dDogc3RyaW5nO1xyXG4gICAgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmc7XHJcbiAgICBxdWVzdGlvblRpdGxlVGVtcGxhdGU6IHN0cmluZztcclxuICAgIHN0b3JlT3RoZXJzQXNDb21tZW50OiBib29sZWFuO1xyXG4gICAgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KTogYm9vbGVhbjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVF1ZXN0aW9uIGV4dGVuZHMgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgaGFzVGl0bGU6IGJvb2xlYW47XHJcbiAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcik7XHJcbiAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KTtcclxuICAgIG9uU3VydmV5TG9hZCgpO1xyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKTogYm9vbGVhbjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWdlIGV4dGVuZHMgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbVZhbHVlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgU2VwYXJhdG9yID0gJ3wnO1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBpdGVtcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgSXRlbVZhbHVlKG51bGwpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZS52YWx1ZSkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLmdldFR5cGUpICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZS5nZXRUeXBlKCkgPT0gJ2l0ZW12YWx1ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5pdGVtVmFsdWUgPSB2YWx1ZS5pdGVtVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pdGVtVGV4dCA9IHZhbHVlLml0ZW1UZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IEl0ZW1WYWx1ZS5pdGVtVmFsdWVQcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgSXRlbVZhbHVlLmNvcHlBdHRyaWJ1dGVzKHZhbHVlLCBpdGVtLCBleGNlcHRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5oYXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IHZhbHVlOiBpdGVtLnZhbHVlLCB0ZXh0OiBpdGVtLnRleHQgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJdGVtQnlWYWx1ZShpdGVtczogQXJyYXk8SXRlbVZhbHVlPiwgdmFsOiBhbnkpOiBJdGVtVmFsdWUge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS52YWx1ZSA9PSB2YWwpIHJldHVybiBpdGVtc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpdGVtVmFsdWVQcm9wID0gWyBcInRleHRcIiwgXCJ2YWx1ZVwiLCBcImhhc1RleHRcIl07XHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb3B5QXR0cmlidXRlcyhzcmM6IGFueSwgZGVzdDogYW55LCBleGNlcHRvbnM6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHNyY1trZXldID09ICdmdW5jdGlvbicpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKGV4Y2VwdG9ucyAmJiBleGNlcHRvbnMuaW5kZXhPZihrZXkpID4gLTEpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGl0ZW1WYWx1ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBpdGVtVGV4dDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGV4dDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaXRlbXZhbHVlXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuaXRlbVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIGlmICghdGhpcy5pdGVtVmFsdWUpIHJldHVybjtcclxuICAgICAgICB2YXIgc3RyOiBzdHJpbmcgPSB0aGlzLml0ZW1WYWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHN0ci5pbmRleE9mKEl0ZW1WYWx1ZS5TZXBhcmF0b3IpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gc3RyLnNsaWNlKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gc3RyLnNsaWNlKGluZGV4ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNUZXh0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pdGVtVGV4dCA/IHRydWUgOiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzVGV4dCkgcmV0dXJuIHRoaXMuaXRlbVRleHQ7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHRleHQobmV3VGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtVGV4dCA9IG5ld1RleHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCYXNlIHtcclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFN1cnZleVBhZ2VJZCA9IFwic3FfcGFnZVwiO1xyXG5leHBvcnQgY2xhc3MgU3VydmV5RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIFNjcm9sbEVsZW1lbnRUb1RvcChlbGVtZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghZWxlbWVudElkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgICAgICBpZiAoIWVsIHx8ICFlbC5zY3JvbGxJbnRvVmlldykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbGVtVG9wID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgIGlmIChlbGVtVG9wIDwgMCkgIGVsLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1Ub3AgPCAwO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBGb2N1c0VsZW1lbnQoZWxlbWVudElkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWVsZW1lbnRJZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgICAgIGVsLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudDxUIGV4dGVuZHMgRnVuY3Rpb24sIE9wdGlvbnM+ICB7XHJcbiAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmNhbGxiYWNrcyA9PSBudWxsIHx8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICBwdWJsaWMgZmlyZShzZW5kZXI6IGFueSwgb3B0aW9uczogT3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxSZXN1bHQgPSB0aGlzLmNhbGxiYWNrc1tpXShzZW5kZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkKGZ1bmM6IFQpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IG5ldyBBcnJheTxUPigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZShmdW5jOiBUKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGZ1bmMsIDApO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9iYXNlLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gJy4vc3VydmV5U3RyaW5ncyc7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbnN3ZXJSZXF1aXJlZEVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicmVxdWlyZWRFcnJvclwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUmVxdXJlTnVtZXJpY0Vycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljRXJyb3JcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEV4Y2VlZFNpemVFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgIHByaXZhdGUgbWF4U2l6ZTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobWF4U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1heFNpemUgPSBtYXhTaXplO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImV4Y2VlZE1heFNpemVcIilbXCJmb3JtYXRcIl0odGhpcy5nZXRUZXh0U2l6ZSgpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VGV4dFNpemUoKSB7XHJcbiAgICAgICAgdmFyIHNpemVzID0gWydCeXRlcycsICdLQicsICdNQicsICdHQicsICdUQiddO1xyXG4gICAgICAgIHZhciBmaXhlZCA9IFswLCAwLCAyLCAzLCAzXTtcclxuICAgICAgICBpZiAodGhpcy5tYXhTaXplID09IDApIHJldHVybiAnMCBCeXRlJztcclxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5sb2codGhpcy5tYXhTaXplKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLm1heFNpemUgLyBNYXRoLnBvdygxMDI0LCBpKTtcclxuICAgICAgICByZXR1cm4gdmFsdWUudG9GaXhlZChmaXhlZFtpXSkgKyAnICcgKyBzaXplc1tpXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lcnJvci50c1xuICoqLyIsImV4cG9ydCB2YXIgc3VydmV5TG9jYWxpemF0aW9uID0ge1xyXG4gICAgY3VycmVudExvY2FsZTogXCJcIixcclxuICAgIGxvY2FsZXM6IHt9LFxyXG4gICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudExvY2FsZSA/IHRoaXMubG9jYWxlc1t0aGlzLmN1cnJlbnRMb2NhbGVdIDogc3VydmV5U3RyaW5ncztcclxuICAgICAgICBpZiAoIWxvYyB8fCAhbG9jW3N0ck5hbWVdKSBsb2MgPSBzdXJ2ZXlTdHJpbmdzO1xyXG4gICAgICAgIHJldHVybiBsb2Nbc3RyTmFtZV07XHJcbiAgICB9LFxyXG4gICAgZ2V0TG9jYWxlczogZnVuY3Rpb24gKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICByZXMucHVzaChcIlwiKTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sb2NhbGVzKSB7XHJcbiAgICAgICAgICAgIHJlcy5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5zb3J0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxufTtcclxuZXhwb3J0IHZhciBzdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlByZXZpb3VzXCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwiTmV4dFwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIkNvbXBsZXRlXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIk90aGVyIChkZXNjcmliZSlcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJQYWdlIHswfSBvZiB7MX1cIixcclxuICAgIGVtcHR5U3VydmV5OiBcIlRoZXJlIGlzIG5vIGFueSB2aXNpYmxlIHBhZ2Ugb3IgdmlzaWJsZSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJUaGFuayBZb3UgZm9yIENvbXBsZXRpbmcgdGhlIFN1cnZleSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiU3VydmV5IGlzIGxvYWRpbmcgZnJvbSB0aGUgc2VydmVyLi4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJDaG9vc2UuLi5cIixcclxuICAgIHJlcXVpcmVkRXJyb3I6IFwiUGxlYXNlIGFuc3dlciB0aGUgcXVlc3Rpb24uXCIsXHJcbiAgICByZXF1aXJlZEluQWxsUm93c0Vycm9yOiBcIlBsZWFzZSBhbnN3ZXIgcXVlc3Rpb25zIGluIGFsbCByb3dzLlwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIlRoZSB2YWx1ZSBzaG91bGQgYmUgYSBudW1lcmljLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgezB9IHN5bWJvbHMuXCIsXHJcbiAgICBtaW5Sb3dDb3VudEVycm9yOiBcIlBsZWFzZSBmaWxsIGF0IGxlYXN0IHswfSByb3dzLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiUGxlYXNlIHNlbGVjdCBhdCBsZWFzdCB7MH0gdmFyaWFudHMuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IG5vdCBtb3JlIHRoYW4gezB9IHZhcmlhbnRzLlwiLFxyXG4gICAgbnVtZXJpY01pbk1heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIG1vcmUgdGhhbiB7MX0gYW5kIGVxdWFsIG9yIGxlc3MgdGhhbiB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbGVzcyB0aGFuIHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcIlBsZWFzZSBlbnRlciBhIHZhbGlkIGUtbWFpbC5cIixcclxuICAgIHVybFJlcXVlc3RFcnJvcjogXCJUaGUgcmVxdWVzdCByZXR1cm4gZXJyb3IgJ3swfScuIHsxfVwiLFxyXG4gICAgdXJsR2V0Q2hvaWNlc0Vycm9yOiBcIlRoZSByZXF1ZXN0IHJldHVybnMgZW1wdHkgZGF0YSBvciB0aGUgJ3BhdGgnIHByb3BlcnR5IGlzIGluY29ycmVjdFwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJUaGUgZmlsZSBzaXplIHNob3VsZCBub3QgZXhjZWVkIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgZW50ZXIgdGhlIG90aGVycyB2YWx1ZS5cIixcclxuICAgIHVwbG9hZGluZ0ZpbGU6IFwiWW91ciBmaWxlIGlzIHVwbG9hZGluZy4gUGxlYXNlIHdhaXQgc2V2ZXJhbCBzZWNvbmRzIGFuZCB0cnkgYWdhaW4uXCIsXHJcbiAgICBhZGRSb3c6IFwiQWRkIFJvd1wiLFxyXG4gICAgcmVtb3ZlUm93OiBcIlJlbW92ZVwiXHJcbn07XHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZW5cIl0gPSBzdXJ2ZXlTdHJpbmdzO1xyXG5cclxuaWYgKCFTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxyXG4gICAgICAgICAgICAgICAgOiBtYXRjaFxyXG4gICAgICAgICAgICAgICAgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N1cnZleVN0cmluZ3MudHNcbiAqKi8iLCJpbXBvcnQge0hhc2hUYWJsZX0gZnJvbSAnLi9iYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgcHJpdmF0ZSB0eXBlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNob2ljZXNmdW5jOiAoKSA9PiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGRlZmF1bHRWYWx1ZTogYW55ID0gbnVsbDtcclxuICAgIHB1YmxpYyBvbkdldFZhbHVlOiAob2JqOiBhbnkpID0+IGFueSA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnR5cGVWYWx1ZSA/IHRoaXMudHlwZVZhbHVlIDogXCJzdHJpbmdcIjsgfVxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50eXBlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNUb1VzZUdldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vbkdldFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5kZWZhdWx0VmFsdWUpID8gKHRoaXMuZGVmYXVsdFZhbHVlID09IHZhbHVlKSA6ICEodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5vbkdldFZhbHVlKSByZXR1cm4gdGhpcy5vbkdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlU2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uU2V0VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXRWYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpIHtcclxuICAgICAgICBpZiAodGhpcy5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25TZXRWYWx1ZShvYmosIHZhbHVlLCBqc29uQ29udik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldE9ialR5cGUob2JqVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNsYXNzTmFtZVBhcnQpIHJldHVybiBvYmpUeXBlO1xyXG4gICAgICAgIHJldHVybiBvYmpUeXBlLnJlcGxhY2UodGhpcy5jbGFzc05hbWVQYXJ0LCBcIlwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5jbGFzc05hbWVQYXJ0ICYmIGNsYXNzTmFtZS5pbmRleE9mKHRoaXMuY2xhc3NOYW1lUGFydCkgPCAwKSA/IGNsYXNzTmFtZSArIHRoaXMuY2xhc3NOYW1lUGFydCA6IGNsYXNzTmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICBpZiAodGhpcy5jaG9pY2VzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNmdW5jICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNmdW5jKCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0Q2hvaWNlcyh2YWx1ZTogQXJyYXk8YW55PiwgdmFsdWVGdW5jOiAoKSA9PiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNob2ljZXNmdW5jID0gdmFsdWVGdW5jO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICBzdGF0aWMgcmVxdWlyZWRTeW1ib2wgPSAnISc7XHJcbiAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgIHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4gPSBudWxsO1xyXG4gICAgcmVxdWlyZWRQcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmc+ID0gbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIHB1YmxpYyBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwdWJsaWMgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5jcmVhdGVQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucHJvcGVydGllc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlUHJvcGVydHkocHJvcEluZm86IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHR5cGVvZiBwcm9wSW5mbyA9PT0gXCJzdHJpbmdcIiA/IHByb3BJbmZvIDogcHJvcEluZm8ubmFtZTtcclxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSBudWxsO1xyXG4gICAgICAgIHZhciB0eXBlSW5kZXggPSBwcm9wZXJ0eU5hbWUuaW5kZXhPZihKc29uTWV0YWRhdGFDbGFzcy50eXBlU3ltYm9sKTtcclxuICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgcHJvcGVydHlUeXBlID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZyh0eXBlSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCB0eXBlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIHZhciBwcm9wID0gbmV3IEpzb25PYmplY3RQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eVR5cGUpIHtcclxuICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHByb3BJbmZvID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wSW5mby50eXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmRlZmF1bHRWYWx1ZSA9IHByb3BJbmZvLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmlzUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZVByb3BlcnR5UmVxdWlyZWQocHJvcC5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uY2hvaWNlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNob2ljZXNGdW5jID0gdHlwZW9mIHByb3BJbmZvLmNob2ljZXMgPT09IFwiZnVuY3Rpb25cIiA/IHByb3BJbmZvLmNob2ljZXMgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNob2ljZXNWYWx1ZSA9IHR5cGVvZiBwcm9wSW5mby5jaG9pY2VzICE9PSBcImZ1bmN0aW9uXCIgPyBwcm9wSW5mby5jaG9pY2VzIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIHByb3Auc2V0Q2hvaWNlcyhjaG9pY2VzVmFsdWUsIGNob2ljZXNGdW5jKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8ub25HZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5vbkdldFZhbHVlID0gcHJvcEluZm8ub25HZXRWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8ub25TZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5vblNldFZhbHVlID0gcHJvcEluZm8ub25TZXRWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmNsYXNzTmFtZSA9IHByb3BJbmZvLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5iYXNlQ2xhc3NOYW1lID0gcHJvcEluZm8uYmFzZUNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uY2xhc3NOYW1lUGFydCkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5jbGFzc05hbWVQYXJ0ID0gcHJvcEluZm8uY2xhc3NOYW1lUGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocHJvcGVydHlOYW1lLmxlbmd0aCA9PSAwIHx8IHByb3BlcnR5TmFtZVswXSAhPSBKc29uTWV0YWRhdGFDbGFzcy5yZXF1aXJlZFN5bWJvbCkgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgdGhpcy5tYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhIHtcclxuICAgIHByaXZhdGUgY2xhc3NlczogSGFzaFRhYmxlPEpzb25NZXRhZGF0YUNsYXNzPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICBwcml2YXRlIGNsYXNzUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4+ID0ge307XHJcbiAgICBwcml2YXRlIGNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8c3RyaW5nPj4gPSB7fTtcclxuICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllcywgY3JlYXRvciwgcGFyZW50TmFtZSk7XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICBpZiAocGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBvdmVycmlkZUNsYXNzQ3JlYXRvcmUobmFtZTogc3RyaW5nLCBjcmVhdG9yOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzKSB7XHJcbiAgICAgICAgICAgIG1ldGFEYXRhQ2xhc3MuY3JlYXRvciA9IGNyZWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlQ2xhc3MobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MuY3JlYXRvcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRQcm9wZXJ0eShjbGFzc05hbWU6IHN0cmluZywgcHJvcGVydHlJbmZvOiBhbnkpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gbWV0YURhdGFDbGFzcy5jcmVhdGVQcm9wZXJ0eShwcm9wZXJ0eUluZm8pO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFByb3BlcnR5VG9DbGFzcyhtZXRhRGF0YUNsYXNzLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDbGFzc1Byb3BlcnRpZXNIYXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVQcm9wZXJ0eShjbGFzc05hbWU6IHN0cmluZywgcHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gbWV0YURhdGFDbGFzcy5maW5kKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJvcGVydHlGcm9tQ2xhc3MobWV0YURhdGFDbGFzcywgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB0aGlzLmVtcHR5Q2xhc3NQcm9wZXJ0aWVzSGFzaChtZXRhRGF0YUNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZFByb3BlcnR5VG9DbGFzcyhtZXRhRGF0YUNsYXNzOiBKc29uTWV0YWRhdGFDbGFzcywgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLmZpbmQocHJvcGVydHkubmFtZSkgIT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlUHJvcGVydHlGcm9tQ2xhc3MobWV0YURhdGFDbGFzczogSnNvbk1ldGFkYXRhQ2xhc3MsIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgIG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpbmRleCA9IG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHkubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBlbXB0eUNsYXNzUHJvcGVydGllc0hhc2gobWV0YURhdGFDbGFzczogSnNvbk1ldGFkYXRhQ2xhc3MpIHtcclxuICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1ttZXRhRGF0YUNsYXNzLm5hbWVdID0gbnVsbDtcclxuICAgICAgICB2YXIgY2hpbGRDbGFzc2VzID0gdGhpcy5nZXRDaGlsZHJlbkNsYXNzZXMobWV0YURhdGFDbGFzcy5uYW1lKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1tjaGlsZENsYXNzZXNbaV0ubmFtZV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiwgcmVzdWx0OiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4pIHtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIWNhbkJlQ3JlYXRlZCB8fCBjaGlsZHJlbltpXS5jcmVhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKGNoaWxkcmVuW2ldLm5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRDbGFzcyhuYW1lOiBzdHJpbmcpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZmlsbFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KSB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eUNvcmUobWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzW2ldLCBsaXN0LCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eUNvcmUocHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiwgZW5kSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kSW5kZXg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09IHByb3BlcnR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKHByb3BlcnR5KVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxpc3RbaW5kZXhdID0gcHJvcGVydHk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGxpc3QsIG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25FcnJvciB7XHJcbiAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgYXQ6IE51bWJlciA9IC0xO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEZ1bGxEZXNjcmlwdGlvbigpIDogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlICsgKHRoaXMuZGVzY3JpcHRpb24gPyBcIlxcblwiICsgdGhpcy5kZXNjcmlwdGlvbiA6IFwiXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uVW5rbm93blByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcInVua25vd25wcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInIGlzIHVua25vd24uXCIpO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHByb3BlcnRpZXMgYXJlOiBcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBwcm9wZXJ0aWVzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSAnLic7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2UgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKHR5cGUsIG1lc3NhZ2UpO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBmb2xsb3dpbmcgdHlwZXMgYXJlIGF2YWlsYWJsZTogXCI7XHJcbiAgICAgICAgdmFyIHR5cGVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoYmFzZUNsYXNzTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiJ1wiICsgdHlwZXNbaV0ubmFtZSArIFwiJ1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLlwiO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcIm1pc3Npbmd0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBtaXNzaW5nIGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbkluY29ycmVjdFR5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcImluY29ycmVjdHR5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIGluY29ycmVjdCBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihcInJlcXVpcmVkcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGlzIHJlcXVpcmVkIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJy5cIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uT2JqZWN0IHtcclxuICAgIHByaXZhdGUgc3RhdGljIHR5cGVQcm9wZXJ0eU5hbWUgPSBcInR5cGVcIjtcclxuICAgIHByaXZhdGUgc3RhdGljIHBvc2l0aW9uUHJvcGVydHlOYW1lID0gXCJwb3NcIjtcclxuICAgIHByaXZhdGUgc3RhdGljIG1ldGFEYXRhVmFsdWUgPSBuZXcgSnNvbk1ldGFkYXRhKCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBtZXRhRGF0YSgpIHsgcmV0dXJuIEpzb25PYmplY3QubWV0YURhdGFWYWx1ZTsgfVxyXG4gICAgcHVibGljIGVycm9ycyA9IG5ldyBBcnJheTxKc29uRXJyb3I+KCk7XHJcbiAgICBwdWJsaWMgdG9Kc29uT2JqZWN0KG9iajogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy50b0pzb25PYmplY3RDb3JlKG9iaiwgbnVsbCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdG9PYmplY3QoanNvbk9iajogYW55LCBvYmo6IGFueSkge1xyXG4gICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcclxuICAgICAgICBpZiAob2JqLmdldFR5cGUpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldID0ganNvbk9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkocHJvcGVydGllcywga2V5KTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihuZXcgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yKGtleS50b1N0cmluZygpLCBvYmouZ2V0VHlwZSgpKSwganNvbk9iaik7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnZhbHVlVG9PYmooanNvbk9ialtrZXldLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB0b0pzb25PYmplY3RDb3JlKG9iajogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICBpZiAoIW9iai5nZXRUeXBlKSByZXR1cm4gb2JqO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiAoIXByb3BlcnR5LmNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgcmVzdWx0W0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eS5nZXRPYmpUeXBlKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlVG9Kc29uKG9iaiwgcmVzdWx0LCBwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvSnNvbihvYmo6IGFueSwgcmVzdWx0OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gcHJvcGVydHkuZ2V0VmFsdWUob2JqKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpIHJldHVybjtcclxuICAgICAgICBpZiAocHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB2YXIgYXJyVmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyVmFsdWUucHVzaCh0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWVbaV0sIHByb3BlcnR5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFsdWUgPSBhcnJWYWx1ZS5sZW5ndGggPiAwID8gYXJyVmFsdWUgOiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtwcm9wZXJ0eS5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvT2JqKHZhbHVlOiBhbnksIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuaGFzVG9Vc2VTZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5zZXRWYWx1ZShvYmosIHZhbHVlLCB0aGlzKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVUb0FycmF5KHZhbHVlLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXdPYmogPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgIGlmIChuZXdPYmoubmV3T2JqKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWUsIG5ld09iai5uZXdPYmopO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IG5ld09iai5uZXdPYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghbmV3T2JqLmVycm9yKSB7XHJcbiAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1ZhbHVlQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5pbmRleE9mKFwiQXJyYXlcIikgPiAtMTsgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVOZXdPYmoodmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHsgbmV3T2JqOiBudWxsLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB2YWx1ZVtKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgIGlmICghY2xhc3NOYW1lICYmIHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuZ2V0Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgcmVzdWx0Lm5ld09iaiA9IChjbGFzc05hbWUpID8gSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhjbGFzc05hbWUpIDogbnVsbDtcclxuICAgICAgICByZXN1bHQuZXJyb3IgPSB0aGlzLmNoZWNrTmV3T2JqZWN0T25FcnJvcnMocmVzdWx0Lm5ld09iaiwgdmFsdWUsIHByb3BlcnR5LCBjbGFzc05hbWUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrTmV3T2JqZWN0T25FcnJvcnMobmV3T2JqOiBhbnksIHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGNsYXNzTmFtZTogc3RyaW5nKTogSnNvbkVycm9yIHtcclxuICAgICAgICB2YXIgZXJyb3IgPSBudWxsO1xyXG4gICAgICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVpcmVkUHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChyZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVxdWlyZWRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZVtyZXF1aXJlZFByb3BlcnRpZXNbaV1dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IocmVxdWlyZWRQcm9wZXJ0aWVzW2ldLCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uTWlzc2luZ1R5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbkluY29ycmVjdFR5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihlcnJvciwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZE5ld0Vycm9yKGVycm9yOiBKc29uRXJyb3IsIGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgIGlmIChqc29uT2JqICYmIGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgICAgZXJyb3IuYXQgPSBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdLnN0YXJ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmFsdWVUb0FycmF5KHZhbHVlOiBBcnJheTxhbnk+LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUFycmF5KG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICBvYmpba2V5XSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlW2ldLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZS5uZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2gobmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWVbaV0sIG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaCh2YWx1ZVtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBrZXk6IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBrZXkpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2pzb25vYmplY3QudHNcbiAqKi8iLCJpbXBvcnQge0Jhc2UsIEl0ZW1WYWx1ZSwgU3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hvaWNlc1Jlc3RmdWxsIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBwdWJsaWMgdXJsOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHBhdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgdmFsdWVOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHRpdGxlTmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBnZXRSZXN1bHRDYWxsYmFjazogKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KSA9PiB2b2lkO1xyXG4gICAgcHVibGljIGVycm9yOiBTdXJ2ZXlFcnJvciA9IG51bGw7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJ1bigpIHtcclxuICAgICAgICBpZiAoIXRoaXMudXJsIHx8ICF0aGlzLmdldFJlc3VsdENhbGxiYWNrKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCB0aGlzLnVybCk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uTG9hZChKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkVycm9yKHhoci5zdGF0dXNUZXh0LCB4aHIucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImNob2ljZXNCeVVybFwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLnVybCAmJiAhdGhpcy5wYXRoICYmICF0aGlzLnZhbHVlTmFtZSAmJiAhdGhpcy50aXRsZU5hbWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0RGF0YShqc29uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgaWYgKGpzb24udXJsKSB0aGlzLnVybCA9IGpzb24udXJsO1xyXG4gICAgICAgIGlmIChqc29uLnBhdGgpIHRoaXMucGF0aCA9IGpzb24ucGF0aDtcclxuICAgICAgICBpZiAoanNvbi52YWx1ZU5hbWUpIHRoaXMudmFsdWVOYW1lID0ganNvbi52YWx1ZU5hbWU7XHJcbiAgICAgICAgaWYgKGpzb24udGl0bGVOYW1lKSB0aGlzLnRpdGxlTmFtZSA9IGpzb24udGl0bGVOYW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMudXJsID0gXCJcIjtcclxuICAgICAgICB0aGlzLnBhdGggPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudmFsdWVOYW1lID0gXCJcIjtcclxuICAgICAgICB0aGlzLnRpdGxlTmFtZSA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5nZXRSZXN1bHRBZnRlclBhdGgocmVzdWx0KTtcclxuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdFtcImxlbmd0aFwiXSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1WYWx1ZSA9IHJlc3VsdFtpXTtcclxuICAgICAgICAgICAgICAgIGlmICghaXRlbVZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGUoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2gobmV3IEl0ZW1WYWx1ZSh2YWx1ZSwgdGl0bGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVybEdldENob2ljZXNFcnJvclwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ2V0UmVzdWx0Q2FsbGJhY2soaXRlbXMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvbkVycm9yKHN0YXR1czogc3RyaW5nLCByZXNwb25zZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lcnJvciA9IG5ldyBDdXN0b21FcnJvcihzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidXJsUmVxdWVzdEVycm9yXCIpW1wiZm9ybWF0XCJdKHN0YXR1cywgcmVzcG9uc2UpKTtcclxuICAgICAgICB0aGlzLmdldFJlc3VsdENhbGxiYWNrKFtdKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UmVzdWx0QWZ0ZXJQYXRoKHJlc3VsdDogYW55KSB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhdGgpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgdmFyIHBhdGhlcyA9IHRoaXMuZ2V0UGF0aGVzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3BhdGhlc1tpXV07XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UGF0aGVzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIHZhciBwYXRoZXMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5wYXRoLmluZGV4T2YoJzsnKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIHBhdGhlcyA9IHRoaXMucGF0aC5zcGxpdCgnOycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhdGhlcyA9IHRoaXMucGF0aC5zcGxpdCgnLCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocGF0aGVzLmxlbmd0aCA9PSAwKSBwYXRoZXMucHVzaCh0aGlzLnBhdGgpO1xyXG4gICAgICAgIHJldHVybiBwYXRoZXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlKGl0ZW06IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWVOYW1lKSByZXR1cm4gaXRlbVt0aGlzLnZhbHVlTmFtZV07XHJcbiAgICAgICAgdmFyIGxlbiA9IE9iamVjdC5rZXlzKGl0ZW0pLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuIDwgMSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1bT2JqZWN0LmtleXMoaXRlbSlbMF1dO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRUaXRsZShpdGVtOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGlmICghdGhpcy50aXRsZU5hbWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBpdGVtW3RoaXMudGl0bGVOYW1lXTtcclxuICAgIH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hvaWNlc0J5VXJsXCIsIFtcInVybFwiLCBcInBhdGhcIiwgXCJ2YWx1ZU5hbWVcIiwgXCJ0aXRsZU5hbWVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBDaG9pY2VzUmVzdGZ1bGwoKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY2hvaWNlc1Jlc3RmdWxsLnRzXG4gKiovIiwiaW1wb3J0IHtIYXNoVGFibGV9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7Q29uZGl0aW9uc1BhcnNlcn0gZnJvbSAnLi9jb25kaXRpb25zUGFyc2VyJztcclxuaW1wb3J0IHtQcm9jZXNzVmFsdWV9IGZyb20gXCIuL2NvbmRpdGlvblByb2Nlc3NWYWx1ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbiB7XHJcbiAgICBzdGF0aWMgb3BlcmF0b3JzVmFsdWU6IEhhc2hUYWJsZTxGdW5jdGlvbj4gPSBudWxsO1xyXG4gICAgc3RhdGljIGdldCBvcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgaWYgKENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZSAhPSBudWxsKSByZXR1cm4gQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZSA9IHtcclxuICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gIWxlZnQ7IH0sXHJcbiAgICAgICAgICAgIG5vdGVtcHR5OiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICEoIWxlZnQpOyB9LFxyXG4gICAgICAgICAgICBlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ID09IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICBub3RlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ICE9IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ICYmIGxlZnRbXCJpbmRleE9mXCJdICYmIGxlZnQuaW5kZXhPZihyaWdodCkgPiAtMTsgfSxcclxuICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gIWxlZnQgfHwgIWxlZnRbXCJpbmRleE9mXCJdIHx8IGxlZnQuaW5kZXhPZihyaWdodCkgPT0gLTE7IH0sXHJcbiAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA+IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICBsZXNzOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPCByaWdodDsgfSxcclxuICAgICAgICAgICAgZ3JlYXRlcm9yZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA+PSByaWdodDsgfSxcclxuICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA8PSByaWdodDsgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb3BWYWx1ZTogc3RyaW5nID0gXCJlcXVhbFwiO1xyXG4gICAgcHVibGljIGxlZnQ6IGFueTtcclxuICAgIHB1YmxpYyByaWdodDogYW55O1xyXG4gICAgcHVibGljIGdldCBvcGVyYXRvcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wZXJhdG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICghQ29uZGl0aW9uLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICB0aGlzLm9wVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBwZXJmb3JtKGxlZnQ6IGFueSA9IG51bGwsIHJpZ2h0OiBhbnkgPSBudWxsKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFsZWZ0KSBsZWZ0ID0gdGhpcy5sZWZ0O1xyXG4gICAgICAgIGlmICghcmlnaHQpIHJpZ2h0ID0gdGhpcy5yaWdodDtcclxuXHJcbiAgICAgICAgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNbdGhpcy5vcGVyYXRvcl0odGhpcy5nZXRQdXJlVmFsdWUobGVmdCksIHRoaXMuZ2V0UHVyZVZhbHVlKHJpZ2h0KSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFB1cmVWYWx1ZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCF2YWwgfHwgKHR5cGVvZiB2YWwgIT0gXCJzdHJpbmdcIikpIHJldHVybiB2YWw7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHZhbC5sZW5ndGggPiAwICYmICh2YWxbMF0gPT0gXCInXCIgfHwgdmFsWzBdID09ICdcIicpKSAgdmFsID0gdmFsLnN1YnN0cigxKTtcclxuICAgICAgICB2YXIgbGVuID0gdmFsLmxlbmd0aDtcclxuICAgICAgICBpZiAobGVuID4gMCAmJiAodmFsW2xlbiAtIDFdID09IFwiJ1wiIHx8IHZhbFtsZW4gLSAxXSA9PSAnXCInKSkgIHZhbCA9IHZhbC5zdWJzdHIoMCwgbGVuIC0gMSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uTm9kZSB7XHJcbiAgICBwcml2YXRlIGNvbm5lY3RpdmVWYWx1ZTogc3RyaW5nID0gXCJhbmRcIjtcclxuICAgIHB1YmxpYyBjaGlsZHJlbjogQXJyYXk8YW55PiA9IFtdO1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbm5lY3RpdmUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY29ubmVjdGl2ZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbm5lY3RpdmUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IFwiJlwiIHx8IHZhbHVlID09IFwiJiZcIikgdmFsdWUgPSBcImFuZFwiO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBcInxcIiB8fCB2YWx1ZSA9PSBcInx8XCIpIHZhbHVlID0gXCJvclwiO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBcImFuZFwiICYmIHZhbHVlICE9IFwib3JcIikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGl2ZVZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKSB7IHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA9PSAwOyB9XHJcbiAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdGl2ZSA9IFwiYW5kXCI7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIENvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBwcml2YXRlIGV4cHJlc3Npb25WYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBwcm9jZXNzVmFsdWU6IFByb2Nlc3NWYWx1ZTtcclxuICAgIHByaXZhdGUgcm9vdDogQ29uZGl0aW9uTm9kZTtcclxuICAgIHByaXZhdGUgdmFsdWVzOiBIYXNoVGFibGU8YW55PjtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihleHByZXNzaW9uOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbiA9IGV4cHJlc3Npb247XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzVmFsdWUgPSBuZXcgUHJvY2Vzc1ZhbHVlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGV4cHJlc3Npb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZXhwcmVzc2lvblZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGV4cHJlc3Npb24odmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmV4cHJlc3Npb24gPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIG5ldyBDb25kaXRpb25zUGFyc2VyKCkucGFyc2UodGhpcy5leHByZXNzaW9uVmFsdWUsIHRoaXMucm9vdCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcnVuKHZhbHVlczogSGFzaFRhYmxlPGFueT4pOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcclxuICAgICAgICByZXR1cm4gdGhpcy5ydW5Ob2RlKHRoaXMucm9vdCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bk5vZGUobm9kZTogQ29uZGl0aW9uTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBvbkZpcnN0RmFpbCA9IG5vZGUuY29ubmVjdGl2ZSA9PSBcImFuZFwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcmVzID0gdGhpcy5ydW5Ob2RlQ29uZGl0aW9uKG5vZGUuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICBpZiAoIXJlcyAmJiBvbkZpcnN0RmFpbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAocmVzICYmICFvbkZpcnN0RmFpbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvbkZpcnN0RmFpbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcnVuTm9kZUNvbmRpdGlvbih2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImNoaWxkcmVuXCJdKSByZXR1cm4gdGhpcy5ydW5Ob2RlKHZhbHVlKTtcclxuICAgICAgICBpZiAodmFsdWVbXCJsZWZ0XCJdKSByZXR1cm4gdGhpcy5ydW5Db25kaXRpb24odmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcnVuQ29uZGl0aW9uKGNvbmRpdGlvbjogQ29uZGl0aW9uKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGxlZnQgPSBjb25kaXRpb24ubGVmdDtcclxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0VmFsdWVOYW1lKGxlZnQpO1xyXG4gICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcm9jZXNzVmFsdWUuaGFzVmFsdWUobmFtZSwgdGhpcy52YWx1ZXMpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGxlZnQgPSB0aGlzLnByb2Nlc3NWYWx1ZS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByaWdodCA9IGNvbmRpdGlvbi5yaWdodDtcclxuICAgICAgICBuYW1lID0gdGhpcy5nZXRWYWx1ZU5hbWUocmlnaHQpO1xyXG4gICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5wcm9jZXNzVmFsdWUuaGFzVmFsdWUobmFtZSwgdGhpcy52YWx1ZXMpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5wcm9jZXNzVmFsdWUuZ2V0VmFsdWUobmFtZSwgdGhpcy52YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29uZGl0aW9uLnBlcmZvcm0obGVmdCwgcmlnaHQpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWYWx1ZU5hbWUobm9kZVZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAoIW5vZGVWYWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBub2RlVmFsdWUgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAobm9kZVZhbHVlLmxlbmd0aCA8IDMgfHwgbm9kZVZhbHVlWzBdICE9ICd7JyB8fCBub2RlVmFsdWVbbm9kZVZhbHVlLmxlbmd0aCAtIDFdICE9ICd9JykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG5vZGVWYWx1ZS5zdWJzdHIoMSwgbm9kZVZhbHVlLmxlbmd0aCAtIDIpO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29uZGl0aW9ucy50c1xuICoqLyIsImltcG9ydCB7Q29uZGl0aW9uLCBDb25kaXRpb25Ob2RlfSBmcm9tIFwiLi9jb25kaXRpb25zXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uc1BhcnNlciB7XHJcbiAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgcm9vdDogQ29uZGl0aW9uTm9kZTtcclxuICAgIHByaXZhdGUgZXhwcmVzc2lvbk5vZGVzOiBBcnJheTxDb25kaXRpb25Ob2RlPjtcclxuICAgIHByaXZhdGUgbm9kZTogQ29uZGl0aW9uTm9kZTtcclxuICAgIHByaXZhdGUgYXQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICBwdWJsaWMgcGFyc2UodGV4dDogc3RyaW5nLCByb290OiBDb25kaXRpb25Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgIHRoaXMucm9vdC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuYXQgPSAwO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy50ZXh0Lmxlbmd0aDtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5wYXJzZVRleHQoKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHRvU3RyaW5nKHJvb3Q6IENvbmRpdGlvbk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZVRvU3RyaW5nKHJvb3QpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB0b1N0cmluZ0NvcmUodmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlW1wiY2hpbGRyZW5cIl0pIHJldHVybiB0aGlzLm5vZGVUb1N0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHZhbHVlW1wibGVmdFwiXSkgcmV0dXJuIHRoaXMuY29uZGl0aW9uVG9TdHJpbmcodmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBub2RlVG9TdHJpbmcobm9kZTogQ29uZGl0aW9uTm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKG5vZGUuaXNFbXB0eSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFyIHJlcyA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlVGV4dCA9IHRoaXMudG9TdHJpbmdDb3JlKG5vZGUuY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICBpZiAobm9kZVRleHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMpIHJlcyArPSAnICcgKyBub2RlLmNvbm5lY3RpdmUgKyAnICc7XHJcbiAgICAgICAgICAgICAgICByZXMgKz0gbm9kZVRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUgIT0gdGhpcy5yb290ICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICByZXMgPSAnKCcgKyByZXMgKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbmRpdGlvblRvU3RyaW5nKGNvbmRpdGlvbjogQ29uZGl0aW9uKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIWNvbmRpdGlvbi5yaWdodCB8fCAhY29uZGl0aW9uLm9wZXJhdG9yKSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgbGVmdCA9IGNvbmRpdGlvbi5sZWZ0O1xyXG4gICAgICAgIGlmIChsZWZ0ICYmICF0aGlzLmlzTnVtZXJpYyhsZWZ0KSkgbGVmdCA9IFwiJ1wiICsgbGVmdCArIFwiJ1wiO1xyXG4gICAgICAgIHZhciByZXMgPSBsZWZ0ICsgJyAnICsgdGhpcy5vcGVyYXRpb25Ub1N0cmluZyhjb25kaXRpb24ub3BlcmF0b3IpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzTm9SaWdodE9wZXJhdGlvbihjb25kaXRpb24ub3BlcmF0b3IpKSByZXR1cm4gcmVzO1xyXG4gICAgICAgIHZhciByaWdodCA9IGNvbmRpdGlvbi5yaWdodDtcclxuICAgICAgICBpZiAocmlnaHQgJiYgIXRoaXMuaXNOdW1lcmljKHJpZ2h0KSkgcmlnaHQgPSBcIidcIiArIHJpZ2h0ICsgXCInXCI7XHJcbiAgICAgICAgcmV0dXJuIHJlcyArICcgJyArIHJpZ2h0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvcGVyYXRpb25Ub1N0cmluZyhvcDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAob3AgPT0gXCJlcXVhbFwiKSByZXR1cm4gXCI9XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwibm90ZXF1YWxcIikgcmV0dXJuIFwiIT1cIjtcclxuICAgICAgICBpZiAob3AgPT0gXCJncmVhdGVyXCIpIHJldHVybiBcIj5cIjtcclxuICAgICAgICBpZiAob3AgPT0gXCJsZXNzXCIpIHJldHVybiBcIjxcIjtcclxuICAgICAgICBpZiAob3AgPT0gXCJncmVhdGVyb3JlcXVhbFwiKSByZXR1cm4gXCI+PVwiO1xyXG4gICAgICAgIGlmIChvcCA9PSBcImxlc3NvcmVxdWFsXCIpIHJldHVybiBcIjw9XCI7XHJcbiAgICAgICAgcmV0dXJuIG9wO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc051bWVyaWModmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciB2YWwgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuICAgICAgICBpZiAoaXNOYU4odmFsKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWwpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXJzZVRleHQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5yb290O1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzID0gW107XHJcbiAgICAgICAgdGhpcy5leHByZXNzaW9uTm9kZXMucHVzaCh0aGlzLm5vZGUpO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcyAmJiB0aGlzLmF0ID49IHRoaXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkQ29uZGl0aW9ucygpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgaWYgKCFyZXMpIHJldHVybiByZXM7XHJcbiAgICAgICAgdmFyIGNvbm5lY3RpdmUgPSB0aGlzLnJlYWRDb25uZWN0aXZlKCk7XHJcbiAgICAgICAgaWYgKGNvbm5lY3RpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDb25uZWN0aXZlKGNvbm5lY3RpdmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZENvbmRpdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMucmVhZEV4cHJlc3Npb24oKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBsZWZ0ID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKCFsZWZ0KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIG9wID0gdGhpcy5yZWFkT3BlcmF0b3IoKTtcclxuICAgICAgICBpZiAoIW9wKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGMgPSBuZXcgQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgYy5sZWZ0ID0gbGVmdDsgYy5vcGVyYXRvciA9IG9wO1xyXG4gICAgICAgIGlmICghdGhpcy5pc05vUmlnaHRPcGVyYXRpb24ob3ApKSB7XHJcbiAgICAgICAgICAgIHZhciByaWdodCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgICAgICBpZiAoIXJpZ2h0KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGMucmlnaHQgPSByaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDb25kaXRpb24oYyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRFeHByZXNzaW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmF0ID49IHRoaXMubGVuZ3RoIHx8IHRoaXMuY2ggIT0gJygnKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgdGhpcy5wdXNoRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICAgICAgcmVzID0gdGhpcy5jaCA9PSAnKSc7XHJcbiAgICAgICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgdGhpcy5wb3BFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldCBjaCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50ZXh0LmNoYXJBdCh0aGlzLmF0KTsgfVxyXG4gICAgcHJpdmF0ZSBza2lwKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmF0IDwgdGhpcy5sZW5ndGggJiYgdGhpcy5pc1NwYWNlKHRoaXMuY2gpKSB0aGlzLmF0Kys7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU3BhY2UoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGMgPT0gJyAnIHx8IGMgPT0gJ1xcbicgfHwgYyA9PSAnXFx0JyB8fCBjID09ICdcXHInO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1F1b3RlcyhjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gYyA9PSBcIidcIiB8fCBjID09ICdcIidcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNPcGVyYXRvckNoYXIoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGMgPT0gJz4nIHx8IGMgPT0gJzwnIHx8IGMgPT0gJz0nIHx8IGMgPT0gJyEnO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc0JyYWNrZXRzKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjID09ICcoJyB8fCBjID09ICcpJztcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZFN0cmluZygpOiBzdHJpbmcge1xyXG4gICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmF0ID49IHRoaXMubGVuZ3RoKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLmF0O1xyXG4gICAgICAgIHZhciBoYXNRdW90ZXMgPSB0aGlzLmlzUXVvdGVzKHRoaXMuY2gpO1xyXG4gICAgICAgIGlmIChoYXNRdW90ZXMpIHRoaXMuYXQrKztcclxuICAgICAgICB2YXIgaXNGaXJzdE9wQ2ggPSB0aGlzLmlzT3BlcmF0b3JDaGFyKHRoaXMuY2gpO1xyXG4gICAgICAgIHdoaWxlICh0aGlzLmF0IDwgdGhpcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKCFoYXNRdW90ZXMgJiYgdGhpcy5pc1NwYWNlKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNRdW90ZXModGhpcy5jaCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChoYXNRdW90ZXMpIHRoaXMuYXQrKztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaGFzUXVvdGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNGaXJzdE9wQ2ggIT0gdGhpcy5pc09wZXJhdG9yQ2hhcih0aGlzLmNoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0JyYWNrZXRzKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmF0IDw9IHN0YXJ0KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy50ZXh0LnN1YnN0cihzdGFydCwgdGhpcy5hdCAtIHN0YXJ0KTtcclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMSAmJiB0aGlzLmlzUXVvdGVzKHJlc1swXSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsZW4gPSByZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUXVvdGVzKHJlc1tyZXMubGVuZ3RoIC0gMV0pKSBsZW4tLTtcclxuICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5zdWJzdHIoMSwgbGVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc05vUmlnaHRPcGVyYXRpb24ob3A6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBvcCA9PSBcImVtcHR5XCIgfHwgb3AgPT0gXCJub3RlbXB0eVwiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkT3BlcmF0b3IoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgb3AgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICBpZiAoIW9wKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBvcCA9IG9wLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKG9wID09ICc+Jykgb3AgPSBcImdyZWF0ZXJcIjtcclxuICAgICAgICBpZiAob3AgPT0gJzwnKSBvcCA9IFwibGVzc1wiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPj0nIHx8IG9wID09ICc9PicpIG9wID0gXCJncmVhdGVyb3JlcXVhbFwiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPD0nIHx8IG9wID09ICc9PCcpIG9wID0gXCJsZXNzb3JlcXVhbFwiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPScgfHwgb3AgPT0gJz09Jykgb3AgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc8PicgfHwgb3AgPT0gJyE9Jykgb3AgPSBcIm5vdGVxdWFsXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICdjb250YWluJykgb3AgPSBcImNvbnRhaW5zXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICdub3Rjb250YWluJykgb3AgPSBcIm5vdGNvbnRhaW5zXCI7XHJcbiAgICAgICAgcmV0dXJuIG9wO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkQ29ubmVjdGl2ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBjb24gPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICBpZiAoIWNvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uID0gY29uLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKGNvbiA9PSBcIiZcIiB8fCBjb24gPT0gXCImJlwiKSBjb24gPSBcImFuZFwiO1xyXG4gICAgICAgIGlmIChjb24gPT0gXCJ8XCIgfHwgY29uID09IFwifHxcIikgY29uID0gXCJvclwiO1xyXG4gICAgICAgIGlmIChjb24gIT0gXCJhbmRcIiAmJiBjb24gIT0gXCJvclwiKSBjb24gPSBudWxsO1xyXG4gICAgICAgIHJldHVybiBjb247XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHB1c2hFeHByZXNzaW9uKCkge1xyXG4gICAgICAgIHZhciBub2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2Rlcy5wdXNoKG5vZGUpO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBvcEV4cHJlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLmV4cHJlc3Npb25Ob2Rlcy5wb3AoKTtcclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmV4cHJlc3Npb25Ob2Rlc1t0aGlzLmV4cHJlc3Npb25Ob2Rlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChub2RlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkQ29uZGl0aW9uKGM6IENvbmRpdGlvbikge1xyXG4gICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKGMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRDb25uZWN0aXZlKGNvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS5jaGlsZHJlbi5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0aXZlID0gY29uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5vZGUuY29ubmVjdGl2ZSAhPSBjb24pIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRDb24gPSB0aGlzLm5vZGUuY29ubmVjdGl2ZTtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRDaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNvbm5lY3RpdmUgPSBjb247XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkTm9kZSA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgICAgICAgICBvbGROb2RlLmNvbm5lY3RpdmUgPSBvbGRDb247XHJcbiAgICAgICAgICAgICAgICBvbGROb2RlLmNoaWxkcmVuID0gb2xkQ2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChvbGROb2RlKTtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdOb2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlID0gbmV3Tm9kZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbmRpdGlvbnNQYXJzZXIudHNcbiAqKi8iLCJpbXBvcnQge0hhc2hUYWJsZX0gZnJvbSAnLi9iYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9jZXNzVmFsdWUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHB1YmxpYyBnZXRGaXJzdE5hbWUodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRleHQpIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIHZhciByZXMgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2ggPSB0ZXh0W2ldO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT0gJy4nIHx8IGNoID09ICdbJykgYnJlYWs7XHJcbiAgICAgICAgICAgIHJlcyArPSBjaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBoYXNWYWx1ZSh0ZXh0OiBzdHJpbmcsIHZhbHVlczogSGFzaFRhYmxlPGFueT4pOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5nZXRWYWx1ZUNvcmUodGV4dCwgdmFsdWVzKTtcclxuICAgICAgICByZXR1cm4gcmVzLmhhc1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhbHVlKHRleHQ6IHN0cmluZywgdmFsdWVzOiBIYXNoVGFibGU8YW55Pik6IGFueSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuZ2V0VmFsdWVDb3JlKHRleHQsIHZhbHVlcyk7XHJcbiAgICAgICAgcmV0dXJuIHJlcy52YWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmFsdWVDb3JlKHRleHQ6IHN0cmluZywgdmFsdWVzOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXMgPSB7IGhhc1ZhbHVlOiBmYWxzZSwgdmFsdWU6IG51bGwgfTtcclxuICAgICAgICB2YXIgY3VyVmFsdWUgPSB2YWx1ZXM7XHJcbiAgICAgICAgaWYgKCFjdXJWYWx1ZSkgcmV0dXJuIHJlcztcclxuICAgICAgICB2YXIgaXNGaXJzdCA9IHRydWU7XHJcbiAgICAgICAgd2hpbGUgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBpc0FycmF5ID0gIWlzRmlyc3QgJiYgdGV4dFswXSA9PSAnWyc7XHJcbiAgICAgICAgICAgIGlmICghaXNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0KSB0ZXh0ID0gdGV4dC5zdWJzdHIoMSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyTmFtZSA9IHRoaXMuZ2V0Rmlyc3ROYW1lKHRleHQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjdXJOYW1lKSByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjdXJWYWx1ZVtjdXJOYW1lXSkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIGN1clZhbHVlID0gY3VyVmFsdWVbY3VyTmFtZV1cclxuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cihjdXJOYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3VyVmFsdWUpKSByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gMTtcclxuICAgICAgICAgICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGluZGV4IDwgdGV4dC5sZW5ndGggJiYgdGV4dFtpbmRleF0gIT0gJ10nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IHRleHRbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gaW5kZXggPCB0ZXh0Lmxlbmd0aCA/IHRleHQuc3Vic3RyKGluZGV4ICsgMSkgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLmdldEludFZhbHVlKHN0cik7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IGN1clZhbHVlLmxlbmd0aCkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIGN1clZhbHVlID0gY3VyVmFsdWVbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlzRmlyc3QgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLnZhbHVlID0gY3VyVmFsdWU7XHJcbiAgICAgICAgcmVzLmhhc1ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRJbnRWYWx1ZShzdHI6IGFueSkge1xyXG4gICAgICAgIGlmIChzdHIgPT0gXCIwXCIgfHwgKChzdHIgfCAwKSA+IDAgJiYgc3RyICUgMSA9PSAwKSlcclxuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihzdHIpO1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbmRpdGlvblByb2Nlc3NWYWx1ZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge0Jhc2UsIEl0ZW1WYWx1ZSwgSVN1cnZleURhdGEsIEhhc2hUYWJsZX0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge1F1ZXN0aW9uU2VsZWN0QmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25fYmFzZXNlbGVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRHJvcGRvd25Nb2RlbH0gZnJvbSBcIi4vcXVlc3Rpb25fZHJvcGRvd25cIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNoZWNrYm94TW9kZWx9IGZyb20gXCIuL3F1ZXN0aW9uX2NoZWNrYm94XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25SYWRpb2dyb3VwTW9kZWx9IGZyb20gXCIuL3F1ZXN0aW9uX3JhZGlvZ3JvdXBcIjtcclxuaW1wb3J0IHtRdWVzdGlvblRleHRNb2RlbH0gZnJvbSBcIi4vcXVlc3Rpb25fdGV4dFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQ29tbWVudE1vZGVsfSBmcm9tIFwiLi9xdWVzdGlvbl9jb21tZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERyb3Bkb3duRGF0YSB7XHJcbiAgICBvblJvd0NoYW5nZWQoY2VsbDogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIG5ld1Jvd1ZhbHVlOiBhbnkpO1xyXG4gICAgY29sdW1uczogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+O1xyXG4gICAgY3JlYXRlUXVlc3Rpb24ocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Db2x1bW4gZXh0ZW5kcyBCYXNlIHtcclxuICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgb3B0aW9uc0NhcHRpb246IHN0cmluZztcclxuICAgIHB1YmxpYyBpc1JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgaGFzT3RoZXI6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBtaW5XaWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBjZWxsVHlwZTogc3RyaW5nID0gXCJkZWZhdWx0XCI7XHJcbiAgICBwcml2YXRlIGNvbENvdW50VmFsdWU6IG51bWJlciA9IC0xO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKSB7IHJldHVybiBcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIgfVxyXG4gICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsdWUgPCAtMSB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY2hvaWNlc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBRdWVzdGlvbjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uLCBwdWJsaWMgcm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IGRhdGEuY3JlYXRlUXVlc3Rpb24odGhpcy5yb3csIHRoaXMuY29sdW1uKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUuc2V0RGF0YShyb3cpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbiB7IHJldHVybiB0aGlzLnF1ZXN0aW9uVmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMucXVlc3Rpb24udmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlIGltcGxlbWVudHMgSVN1cnZleURhdGEge1xyXG4gICAgcHJvdGVjdGVkIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGE7XHJcbiAgICBwcml2YXRlIHJvd1ZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgcm93Q29tbWVudHM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIGlzU2V0dGluZ1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIGNlbGxzOiBBcnJheTxNYXRyaXhEcm9wZG93bkNlbGw+ID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuYnVpbGRDZWxscygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMucm93VmFsdWVzOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzU2V0dGluZ1ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJvd1ZhbHVlcyA9IHt9O1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXNba2V5XSA9IHZhbHVlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucXVlc3Rpb24ub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy5nZXRWYWx1ZSh0aGlzLmNlbGxzW2ldLmNvbHVtbi5uYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNTZXR0aW5nVmFsdWUgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvd1ZhbHVlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHRpbmdWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gXCJcIikgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWVzW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMucm93VmFsdWVzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRhdGEub25Sb3dDaGFuZ2VkKHRoaXMsIHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dDb21tZW50c1tuYW1lXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucm93Q29tbWVudHNbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpIHtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBidWlsZENlbGxzKCkge1xyXG4gICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5kYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSBjb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2godGhpcy5jcmVhdGVDZWxsKGNvbHVtbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25DZWxsKGNvbHVtbiwgdGhpcywgdGhpcy5kYXRhKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlZFZpc2libGVSb3dzOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT47XHJcbiAgICBwcml2YXRlIGNlbGxUeXBlVmFsdWU6IHN0cmluZyA9IFwiZHJvcGRvd25cIjtcclxuICAgIHByaXZhdGUgY29sdW1uQ29sQ291bnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBjb2x1bW5NaW5XaWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBob3Jpem9udGFsU2Nyb2xsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgY29sdW1uc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHB1YmxpYyB1cGRhdGVDZWxsc0NhbGxiYWs6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29sdW1ucygpOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29sdW1ucyh2YWx1ZTogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+KSB7XHJcbiAgICAgICAgdGhpcy5jb2x1bW5zVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjZWxsVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jZWxsVHlwZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNlbGxUeXBlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5jZWxsVHlwZSA9PSBuZXdWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY2VsbFR5cGVWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudXBkYXRlQ2VsbHNDYWxsYmFrKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29sdW1uQ29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sdW1uQ29sQ291bnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjb2x1bW5Db2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmNvbHVtbkNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnVwZGF0ZUNlbGxzQ2FsbGJhayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0Q29sdW1uVGl0bGUoY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNvbHVtbi50aXRsZTtcclxuICAgICAgICBpZiAoY29sdW1uLmlzUmVxdWlyZWQgJiYgdGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVpcmVUZXh0ID0gdGhpcy5zdXJ2ZXkucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAocmVxdWlyZVRleHQpIHJlcXVpcmVUZXh0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXF1aXJlVGV4dCArIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDb2x1bW5XaWR0aChjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY29sdW1uLm1pbldpZHRoID8gY29sdW1uLm1pbldpZHRoIDogdGhpcy5jb2x1bW5NaW5XaWR0aDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBvcHRpb25zQ2FwdGlvbigpIHsgcmV0dXJuICh0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUpID8gdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wdGlvbnNDYXB0aW9uXCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBhZGRDb2x1bW4obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE1hdHJpeERyb3Bkb3duQ29sdW1uIHtcclxuICAgICAgICB2YXIgY29sdW1uID0gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmNvbHVtbnNWYWx1ZS5wdXNoKGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPiB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyA9IHRoaXMuZ2VuZXJhdGVSb3dzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPiB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1ZhbHVlKGN1clZhbHVlOiBhbnkpOiBhbnkgeyByZXR1cm4gIWN1clZhbHVlID8ge30gOiBjdXJWYWx1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIGdldFJvd1ZhbHVlKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIHF1ZXN0aW9uVmFsdWU6IGFueSwgY3JlYXRlOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBxdWVzdGlvblZhbHVlW3Jvdy5yb3dOYW1lXSA/IHF1ZXN0aW9uVmFsdWVbcm93LnJvd05hbWVdIDogbnVsbDtcclxuICAgICAgICBpZiAoIXJlc3VsdCAmJiBjcmVhdGUpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uVmFsdWVbcm93LnJvd05hbWVdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcgfHwgISh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB8fCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV0udmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHtcclxuICAgICAgICB2YXIgcm93cyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgaWYgKCFyb3dzKSByb3dzID0gdGhpcy52aXNpYmxlUm93cztcclxuICAgICAgICBpZiAoIXJvd3MpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICBpZiAoIWNlbGxzKSBjb250aW51ZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGNlbGxzLmxlbmd0aDsgY29sSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uICYmICghcXVlc3Rpb24uc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB8fCAhcXVlc3Rpb24udmFsdWUpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgZXJyb3NJbkNvbHVtbnMgPSB0aGlzLmhhc0Vycm9ySW5Db2x1bW5zKGZpcmVDYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spIHx8IGVycm9zSW5Db2x1bW5zO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNFcnJvckluQ29sdW1ucyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgcmVzID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IGNvbEluZGV4KyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICAgICAgcmVzID0gY2VsbHMgJiYgY2VsbHNbY29sSW5kZXhdICYmIGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbiAmJiBjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb24uaGFzRXJyb3JzKGZpcmVDYWxsYmFjaykgfHwgcmVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0Rmlyc3RDZWxsUXVlc3Rpb24oZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbiA/IHF1ZXN0aW9uLmlucHV0SWQgOiBzdXBlci5nZXRGaXJzdElucHV0RWxlbWVudElkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RFcnJvcklucHV0RWxlbWVudElkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRGaXJzdENlbGxRdWVzdGlvbih0cnVlKTtcclxuICAgICAgICByZXR1cm4gcXVlc3Rpb24gPyBxdWVzdGlvbi5pbnB1dElkIDogc3VwZXIuZ2V0Rmlyc3RFcnJvcklucHV0RWxlbWVudElkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RDZWxsUXVlc3Rpb24ob25FcnJvcjogYm9vbGVhbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgY29sSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvbkVycm9yKSByZXR1cm4gY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbi5jdXJyZW50RXJyb3JDb3VudCA+IDApIHJldHVybiBjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb25cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8vSU1hdHJpeERyb3Bkb3duRGF0YVxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5jcmVhdGVRdWVzdGlvbkNvcmUocm93LCBjb2x1bW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uLm5hbWUgPSBjb2x1bW4ubmFtZTtcclxuICAgICAgICBxdWVzdGlvbi5pc1JlcXVpcmVkID0gY29sdW1uLmlzUmVxdWlyZWQ7XHJcbiAgICAgICAgcXVlc3Rpb24uaGFzT3RoZXIgPSBjb2x1bW4uaGFzT3RoZXI7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5oYXNPdGhlcikge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24gaW5zdGFuY2VvZiBRdWVzdGlvblNlbGVjdEJhc2UpIHtcclxuICAgICAgICAgICAgICAgICg8UXVlc3Rpb25TZWxlY3RCYXNlPnF1ZXN0aW9uKS5zdG9yZU90aGVyc0FzQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVRdWVzdGlvbkNvcmUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICB2YXIgY2VsbFR5cGUgPSBjb2x1bW4uY2VsbFR5cGUgPT0gXCJkZWZhdWx0XCIgPyB0aGlzLmNlbGxUeXBlIDogY29sdW1uLmNlbGxUeXBlO1xyXG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXRRdWVzdGlvbk5hbWUocm93LCBjb2x1bW4pO1xyXG4gICAgICAgIGlmIChjZWxsVHlwZSA9PSBcImNoZWNrYm94XCIpIHJldHVybiB0aGlzLmNyZWF0ZUNoZWNrYm94KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNlbGxUeXBlID09IFwicmFkaW9ncm91cFwiKSByZXR1cm4gdGhpcy5jcmVhdGVSYWRpb2dyb3VwKG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNlbGxUeXBlID09IFwidGV4dFwiKSByZXR1cm4gdGhpcy5jcmVhdGVUZXh0KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNlbGxUeXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gdGhpcy5jcmVhdGVDb21tZW50KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRHJvcGRvd24obmFtZSwgY29sdW1uKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRRdWVzdGlvbk5hbWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7IHJldHVybiByb3cucm93TmFtZSArIFwiX1wiICsgY29sdW1uLm5hbWU7IH1cclxuICAgIHByb3RlY3RlZCBnZXRDb2x1bW5DaG9pY2VzKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBBcnJheTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gY29sdW1uLmNob2ljZXMgJiYgY29sdW1uLmNob2ljZXMubGVuZ3RoID4gMCA/IGNvbHVtbi5jaG9pY2VzIDogdGhpcy5jaG9pY2VzO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldENvbHVtbk9wdGlvbnNDYXB0aW9uKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4ub3B0aW9uc0NhcHRpb24gPyBjb2x1bW4ub3B0aW9uc0NhcHRpb24gOiB0aGlzLm9wdGlvbnNDYXB0aW9uO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZURyb3Bkb3duKG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbCB7XHJcbiAgICAgICAgdmFyIHEgPSA8UXVlc3Rpb25Ecm9wZG93bk1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgbmFtZSk7XHJcbiAgICAgICAgcS5jaG9pY2VzID0gdGhpcy5nZXRDb2x1bW5DaG9pY2VzKGNvbHVtbik7XHJcbiAgICAgICAgcS5vcHRpb25zQ2FwdGlvbiA9IHRoaXMuZ2V0Q29sdW1uT3B0aW9uc0NhcHRpb24oY29sdW1uKTtcclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDaGVja2JveChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkNoZWNrYm94TW9kZWwge1xyXG4gICAgICAgIHZhciBxID0gPFF1ZXN0aW9uQ2hlY2tib3hNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcImNoZWNrYm94XCIsIG5hbWUpO1xyXG4gICAgICAgIHEuY2hvaWNlcyA9IHRoaXMuZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW4pO1xyXG4gICAgICAgIHEuY29sQ291bnQgPSBjb2x1bW4uY29sQ291bnQgPiAtIDEgPyBjb2x1bW4uY29sQ291bnQgOiB0aGlzLmNvbHVtbkNvbENvdW50O1xyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJhZGlvZ3JvdXAobmFtZTogc3RyaW5nLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwge1xyXG4gICAgICAgIHZhciBxID0gPFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCBuYW1lKTtcclxuICAgICAgICBxLmNob2ljZXMgPSB0aGlzLmdldENvbHVtbkNob2ljZXMoY29sdW1uKTtcclxuICAgICAgICBxLmNvbENvdW50ID0gY29sdW1uLmNvbENvdW50ID4gLSAxID8gY29sdW1uLmNvbENvdW50IDogdGhpcy5jb2x1bW5Db2xDb3VudDtcclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0KG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uVGV4dE1vZGVsIHtcclxuICAgICAgICByZXR1cm4gPFF1ZXN0aW9uVGV4dE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwidGV4dFwiLCBuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDb21tZW50KG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uQ29tbWVudE1vZGVsIHtcclxuICAgICAgICByZXR1cm4gPFF1ZXN0aW9uQ29tbWVudE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwiY29tbWVudFwiLCBuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uIHtcclxuICAgICAgICByZXR1cm4gPFF1ZXN0aW9uPlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRlbGV0ZVJvd1ZhbHVlKG5ld1ZhbHVlOiBhbnksIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UpOiBhbnkge1xyXG4gICAgICAgIGRlbGV0ZSBuZXdWYWx1ZVtyb3cucm93TmFtZV07XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5ld1ZhbHVlKS5sZW5ndGggPT0gMCA/IG51bGwgOiBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIG9uUm93Q2hhbmdlZChyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBuZXdSb3dWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICB2YXIgcm93VmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgbmV3VmFsdWUsIHRydWUpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiByb3dWYWx1ZSkgZGVsZXRlIHJvd1ZhbHVlW2tleV07XHJcbiAgICAgICAgaWYgKG5ld1Jvd1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1Jvd1ZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuZXdSb3dWYWx1ZSkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3Um93VmFsdWUpIHJvd1ZhbHVlW2tleV0gPSBuZXdSb3dWYWx1ZVtrZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoT2JqZWN0LmtleXMocm93VmFsdWUpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5kZWxldGVSb3dWYWx1ZShuZXdWYWx1ZSwgcm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInRpdGxlXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgXCJvcHRpb25zQ2FwdGlvblwiLCB7IG5hbWU6IFwiY2VsbFR5cGVcIiwgZGVmYXVsdDogXCJkZWZhdWx0XCIsIGNob2ljZXM6IFtcImRlZmF1bHRcIiwgXCJkcm9wZG93blwiLCBcImNoZWNrYm94XCIsIFwicmFkaW9ncm91cFwiLCBcInRleHRcIiwgXCJjb21tZW50XCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbENvdW50XCIsIGRlZmF1bHQ6IC0xLCBjaG9pY2VzOiBbLTEsIDAsIDEsIDIsIDMsIDRdIH0sIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLCBcIm1pbldpZHRoXCJdLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKFwiXCIpOyB9KTtcclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkcm9wZG93bmJhc2VcIiwgW3sgbmFtZTogXCJjb2x1bW5zOm1hdHJpeGRyb3Bkb3duY29sdW1uc1wiLCBjbGFzc05hbWU6IFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIiB9LFxyXG4gICAgICAgIFwiaG9yaXpvbnRhbFNjcm9sbDpib29sZWFuXCIsXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIHsgbmFtZTogXCJvcHRpb25zQ2FwdGlvblwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5vcHRpb25zQ2FwdGlvblZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNlbGxUeXBlXCIsIGRlZmF1bHQ6IFwiZHJvcGRvd25cIiwgY2hvaWNlczogW1wiZHJvcGRvd25cIiwgXCJjaGVja2JveFwiLCBcInJhZGlvZ3JvdXBcIiwgXCJ0ZXh0XCIsIFwiY29tbWVudFwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb2x1bW5Db2xDb3VudFwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfSwgXCJjb2x1bW5NaW5XaWR0aFwiXSxcclxuICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSAnLi9qc29ub2JqZWN0JztcclxuaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gJy4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvciwgU3VydmV5RWxlbWVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge0Fuc3dlclJlcXVpcmVkRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7U3VydmV5VmFsaWRhdG9yLCBJVmFsaWRhdG9yT3duZXIsIFZhbGlkYXRvclJ1bm5lcn0gZnJvbSBcIi4vdmFsaWRhdG9yXCI7XHJcbmltcG9ydCB7VGV4dFByZVByb2Nlc3Nvcn0gZnJvbSBcIi4vdGV4dFByZVByb2Nlc3NvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb25CYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbkNvbW1lbnQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgaXNSZXF1aXJlZFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBoYXNPdGhlclZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGNvbW1lbnRUZXh0VmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcbiAgICBlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPiA9IFtdO1xyXG4gICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcbiAgICB2YWx1ZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBlcnJvcnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICB0aXRsZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNJbnB1dCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaW5wdXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZCArIFwiaVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCk6IHN0cmluZyB7IHJldHVybiAodGhpcy50aXRsZVZhbHVlKSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy50aXRsZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgIT0gbnVsbCA/IHRoaXMuc3VydmV5LnByb2Nlc3NUZXh0KHRoaXMudGl0bGUpIDogdGhpcy50aXRsZTsgfVxyXG4gICAgcHVibGljIGdldCBmdWxsVGl0bGUoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50ZXh0UHJlUHJvY2Vzc29yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3IgPSBuZXcgVGV4dFByZVByb2Nlc3NvcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmNhblByb2Nlc3NlZFRleHRWYWx1ZXMobmFtZS50b0xvd2VyQ2FzZSgpKTsgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0UHJlUHJvY2Vzc29yLnByb2Nlc3ModGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZVRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlcXVpcmVUZXh0ID0gdGhpcy5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgaWYgKHJlcXVpcmVUZXh0KSByZXF1aXJlVGV4dCArPSBcIiBcIjtcclxuICAgICAgICB2YXIgbm8gPSB0aGlzLm5vO1xyXG4gICAgICAgIGlmIChubykgbm8gKz0gXCIuIFwiO1xyXG4gICAgICAgIHJldHVybiBubyArIHJlcXVpcmVUZXh0ICsgdGhpcy5wcm9jZXNzZWRUaXRsZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBmb2N1cyhvbkVycm9yOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBTdXJ2ZXlFbGVtZW50LlNjcm9sbEVsZW1lbnRUb1RvcCh0aGlzLmlkKTtcclxuICAgICAgICB2YXIgaWQgPSAhb25FcnJvciA/IHRoaXMuZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpIDogdGhpcy5nZXRGaXJzdEVycm9ySW5wdXRFbGVtZW50SWQoKTtcclxuICAgICAgICBpZiAoU3VydmV5RWxlbWVudC5Gb2N1c0VsZW1lbnQoaWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZm9jdXNDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0SW5wdXRFbGVtZW50SWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dElkO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0RXJyb3JJbnB1dEVsZW1lbnRJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpcnN0SW5wdXRFbGVtZW50SWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjYW5Qcm9jZXNzZWRUZXh0VmFsdWVzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBuYW1lID09IFwibm9cIiB8fCBuYW1lID09IFwidGl0bGVcIiB8fCBuYW1lID09IFwicmVxdWlyZVwiO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwibm9cIikgcmV0dXJuIHRoaXMubm87XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJ0aXRsZVwiKSByZXR1cm4gdGhpcy5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInJlcXVpcmVcIikgcmV0dXJuIHRoaXMucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBpc1JlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1JlcXVpcmVkVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaXNSZXF1aXJlZCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodGhpcy5pc1JlcXVpcmVkID09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNSZXF1aXJlZFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudGl0bGVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNDb21tZW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaGFzQ29tbWVudCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzQ29tbWVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0NvbW1lbnQpIHRoaXMuaGFzT3RoZXIgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29tbWVudFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY29tbWVudFRleHRWYWx1ZSA/IHRoaXMuY29tbWVudFRleHRWYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbW1lbnRUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaGFzT3RoZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRPdGhlcigpIHx8IHRoaXMuaGFzT3RoZXIgPT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5oYXNPdGhlclZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB0aGlzLmhhc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmhhc090aGVyQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGhhc090aGVyQ2hhbmdlZCgpIHsgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBubygpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLnZpc2libGVJbmRleCA8IDApIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciBzdGFydEluZGV4ID0gMTtcclxuICAgICAgICB2YXIgaXNOdW1lcmljID0gdHJ1ZTtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkucXVlc3Rpb25TdGFydEluZGV4KSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHRoaXMuc3VydmV5LnF1ZXN0aW9uU3RhcnRJbmRleDtcclxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KHN0cikpIHN0YXJ0SW5kZXggPSBwYXJzZUludChzdHIpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChzdHIubGVuZ3RoID09IDEpIGlzTnVtZXJpYyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOdW1lcmljKSByZXR1cm4gKHRoaXMudmlzaWJsZUluZGV4ICsgc3RhcnRJbmRleCkudG9TdHJpbmcoKTtcclxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdHIuY2hhckNvZGVBdCgwKSArIHRoaXMudmlzaWJsZUluZGV4KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgc3VwZXIub25TZXREYXRhKCk7XHJcbiAgICAgICAgdGhpcy5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUZyb21EYXRhKHRoaXMuZ2V0VmFsdWVDb3JlKCkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52YWx1ZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbW1lbnQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0Q29tbWVudCgpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbW1lbnQgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldENvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29tbWVudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEuZ2V0Q29tbWVudCh0aGlzLm5hbWUpIDogdGhpcy5xdWVzdGlvbkNvbW1lbnQ7IH1cclxuICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JFcnJvcnMoZmlyZUNhbGxiYWNrKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudEVycm9yQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aDsgfVxyXG4gICAgcHVibGljIGdldCByZXF1aXJlZFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5ICE9IG51bGwgJiYgdGhpcy5pc1JlcXVpcmVkID8gdGhpcy5zdXJ2ZXkucmVxdWlyZWRUZXh0IDogXCJcIjsgfVxyXG4gICAgcHVibGljIGFkZEVycm9yKGVycm9yOiBTdXJ2ZXlFcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tGb3JFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gdGhpcy5lcnJvcnMgPyB0aGlzLmVycm9ycy5sZW5ndGggOiAwO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgdGhpcy5vbkNoZWNrRm9yRXJyb3JzKHRoaXMuZXJyb3JzKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDAgJiYgdGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnJ1blZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5zdXJ2ZXkudmFsaWRhdGVRdWVzdGlvbih0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmaXJlQ2FsbGJhY2sgJiYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCBlcnJvckxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1JlcXVpcmVkRXJyb3IoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBBbnN3ZXJSZXF1aXJlZEVycm9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBoYXNSZXF1aXJlZEVycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzUmVxdWlyZWQgJiYgdGhpcy5pc0VtcHR5KCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSdW5uZXIoKS5ydW4odGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBzZXROZXdWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZUluRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlSW5EYXRhKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSkge1xyXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWVUb0RhdGEobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWYWx1ZUNvcmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLmdldFZhbHVlKHRoaXMubmFtZSkgOiB0aGlzLnF1ZXN0aW9uVmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFZhbHVlQ29yZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRWYWx1ZSh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7IHJldHVybiB2YWw7IH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YSh2YWw6IGFueSk6IGFueSB7IHJldHVybiB2YWw7IH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHsgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0Q29tbWVudCh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgdGhpcy5xdWVzdGlvbkNvbW1lbnQgPSBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIC8vSVF1ZXN0aW9uXHJcbiAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZUZyb21EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy9JVmFsaWRhdG9yT3duZXJcclxuICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiBudWxsOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uXCIsIFt7IG5hbWU6IFwidGl0bGU6dGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICB7IG5hbWU6IFwiY29tbWVudFRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tbWVudFRleHRWYWx1ZTsgfSB9LFxyXG4gICAgXCJpc1JlcXVpcmVkOmJvb2xlYW5cIiwgeyBuYW1lOiBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXZhbGlkYXRvclwiLCBjbGFzc05hbWVQYXJ0OiBcInZhbGlkYXRvclwifV0sIG51bGwsIFwicXVlc3Rpb25iYXNlXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uLnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBJUXVlc3Rpb24sIElDb25kaXRpb25SdW5uZXIsIElTdXJ2ZXlEYXRhLCBJU3VydmV5LCBIYXNoVGFibGV9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSAnLi9qc29ub2JqZWN0JztcclxuaW1wb3J0IHtDb25kaXRpb25SdW5uZXJ9IGZyb20gJy4vY29uZGl0aW9ucyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25CYXNlIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBxdWVzdGlvbkNvdW50ZXIgPSAxMDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRRdWVzdGlvbklkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwic3FfXCIgKyBRdWVzdGlvbkJhc2UucXVlc3Rpb25Db3VudGVyKys7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleURhdGE7XHJcbiAgICBwcm90ZWN0ZWQgc3VydmV5OiBJU3VydmV5O1xyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25SdW5uZXI6IENvbmRpdGlvblJ1bm5lciA9IG51bGw7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBpZFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc3RhcnRXaXRoTmV3TGluZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIHZpc2libGVJbmRleFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgIHB1YmxpYyB3aWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgcmVuZGVyV2lkdGhWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgcmlnaHRJbmRlbnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBpbmRlbnQ6IG51bWJlciA9IDA7XHJcbiAgICBmb2N1c0NhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICByb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgdmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmlkVmFsdWUgPSBRdWVzdGlvbkJhc2UuZ2V0UXVlc3Rpb25JZCgpO1xyXG4gICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZCg8SVF1ZXN0aW9uPnRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudmlzaWJsZUluZGV4VmFsdWU7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudEVycm9yQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIDA7IH1cclxuICAgIHB1YmxpYyBnZXQgaGFzVGl0bGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNJbnB1dCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbmRlcldpZHRoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnJlbmRlcldpZHRoVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgcmVuZGVyV2lkdGgodmFsOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMucmVuZGVyV2lkdGgpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJlbmRlcldpZHRoVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJpZ2h0SW5kZW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnJpZ2h0SW5kZW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgcmlnaHRJbmRlbnQodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMucmlnaHRJbmRlbnQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJpZ2h0SW5kZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZm9jdXMob25FcnJvcjogYm9vbGVhbiA9IGZhbHNlKSB7IH1cclxuICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXlEYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSAobmV3VmFsdWUgJiYgbmV3VmFsdWVbXCJxdWVzdGlvbkFkZGVkXCJdKSA/IDxJU3VydmV5Pm5ld1ZhbHVlIDogbnVsbDtcclxuICAgICAgICB0aGlzLm9uU2V0RGF0YSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGZpcmVDYWxsYmFjayhjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7IH1cclxuICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICBwdWJsaWMgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICAvL0lRdWVzdGlvblxyXG4gICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgfVxyXG4gICAgb25TdXJ2ZXlMb2FkKCkge1xyXG4gICAgfVxyXG4gICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uYmFzZVwiLCBbXCIhbmFtZVwiLCB7IG5hbWU6IFwidmlzaWJsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJ2aXNpYmxlSWY6dGV4dFwiLFxyXG4gICAgeyBuYW1lOiBcIndpZHRoXCIgfSwgeyBuYW1lOiBcInN0YXJ0V2l0aE5ld0xpbmU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfSwge25hbWU6IFwiaW5kZW50Om51bWJlclwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgM119XSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25iYXNlLnRzXG4gKiovIiwiZXhwb3J0IGNsYXNzIFRleHRQcmVQcm9jZXNzb3JJdGVtIHtcclxuICAgIHB1YmxpYyBzdGFydDogbnVtYmVyO1xyXG4gICAgcHVibGljIGVuZDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dFByZVByb2Nlc3NvciB7XHJcbiAgICBwdWJsaWMgb25Qcm9jZXNzOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XHJcbiAgICBwdWJsaWMgb25IYXNWYWx1ZTogKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBwdWJsaWMgcHJvY2Vzcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGV4dCkgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9uUHJvY2VzcykgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXRJdGVtcyh0ZXh0KTtcclxuICAgICAgICBmb3IgKHZhciBpID0gaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5hbWUodGV4dC5zdWJzdHJpbmcoaXRlbS5zdGFydCArIDEsIGl0ZW0uZW5kKSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYW5Qcm9jZXNzTmFtZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSGFzVmFsdWUgJiYgIXRoaXMub25IYXNWYWx1ZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMub25Qcm9jZXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIoMCwgaXRlbS5zdGFydCkgKyB2YWx1ZSArIHRleHQuc3Vic3RyKGl0ZW0uZW5kICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRJdGVtcyh0ZXh0OiBzdHJpbmcpOiBBcnJheTxUZXh0UHJlUHJvY2Vzc29ySXRlbT4ge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICB2YXIgc3RhcnQgPSAtMTtcclxuICAgICAgICB2YXIgY2ggPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoID0gdGV4dFtpXTtcclxuICAgICAgICAgICAgaWYgKGNoID09ICd7Jykgc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFRleHRQcmVQcm9jZXNzb3JJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNhblByb2Nlc3NOYW1lKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2ggPSBuYW1lW2ldO1xyXG4gICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgaWYgKGNoID09ICcgJyB8fCBjaCA9PSAnLScgfHwgY2ggPT0gJyYnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdGV4dFByZVByb2Nlc3Nvci50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge0l0ZW1WYWx1ZSwgU3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0IHtDaG9pY2VzUmVzdGZ1bGx9IGZyb20gXCIuL2Nob2ljZXNSZXN0ZnVsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uU2VsZWN0QmFzZSBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHByaXZhdGUgdmlzaWJsZUNob2ljZXNDYWNoZTogQXJyYXk8SXRlbVZhbHVlPiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNvbW1lbnRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIGNhY2hlZFZhbHVlOiBhbnk7XHJcbiAgICBvdGhlckl0ZW06IEl0ZW1WYWx1ZSA9IG5ldyBJdGVtVmFsdWUoXCJvdGhlclwiLCBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSk7XHJcbiAgICBwcml2YXRlIGNob2ljZXNGcm9tVXJsOiBBcnJheTxJdGVtVmFsdWU+ID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2FjaGVkVmFsdWVGb3JVcmxSZXF1ZXN0aW9uOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWVzOiBBcnJheTxJdGVtVmFsdWU+ID0gbmV3IEFycmF5PEl0ZW1WYWx1ZT4oKTtcclxuICAgIHB1YmxpYyBjaG9pY2VzQnlVcmw6IENob2ljZXNSZXN0ZnVsbDtcclxuICAgIHB1YmxpYyBvdGhlckVycm9yVGV4dDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBzdG9yZU90aGVyc0FzQ29tbWVudDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBjaG9pY2VzT3JkZXJWYWx1ZTogc3RyaW5nID0gXCJub25lXCI7XHJcbiAgICBjaG9pY2VzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzQnlVcmwgPSB0aGlzLmNyZWF0ZVJlc3RmdWxsKCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc0J5VXJsLmdldFJlc3VsdENhbGxiYWNrID0gZnVuY3Rpb24gKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KSB7IHNlbGYub25Mb2FkQ2hvaWNlc0Zyb21VcmwoaXRlbXMpIH07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpID8gdGhpcy5nZXRIYXNPdGhlcih0aGlzLnZhbHVlKSA6IHRoaXMuZ2V0SGFzT3RoZXIodGhpcy5jYWNoZWRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SGFzT3RoZXIodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdmFsID09IHRoaXMub3RoZXJJdGVtLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJlc3RmdWxsKCk6IENob2ljZXNSZXN0ZnVsbCB7IHJldHVybiBuZXcgQ2hvaWNlc1Jlc3RmdWxsKCk7IH1cclxuICAgIHByb3RlY3RlZCBnZXRDb21tZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLmdldENvbW1lbnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21tZW50VmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU2V0dGluZ0NvbW1lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKVxyXG4gICAgICAgICAgICBzdXBlci5zZXRDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2V0dGluZ0NvbW1lbnQgJiYgbmV3VmFsdWUgIT0gdGhpcy5jb21tZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZXR0aW5nQ29tbWVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnRWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdGhlclNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZUluRGF0YSh0aGlzLmNhY2hlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZXR0aW5nQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUpIHRoaXMuY2FjaGVkVmFsdWVGb3JVcmxSZXF1ZXN0aW9uID0gbmV3VmFsdWU7ICAgICAgICBcclxuICAgICAgICBzdXBlci5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLnZhbHVlRnJvbURhdGEodmFsKTtcclxuICAgICAgICB0aGlzLmNhY2hlZFZhbHVlID0gdGhpcy52YWx1ZUZyb21EYXRhQ29yZSh2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKSByZXR1cm4gc3VwZXIudmFsdWVUb0RhdGEodmFsKTtcclxuICAgICAgICB0aGlzLmNhY2hlZFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlVG9EYXRhQ29yZSh2YWwpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzVW5rbm93blZhbHVlKHZhbCkpIHJldHVybiB2YWw7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSkgcmV0dXJuIHZhbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSB2YWw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3RoZXJJdGVtLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSAmJiB0aGlzLmdldENvbW1lbnQoKSkge1xyXG4gICAgICAgICAgICB2YWwgPSB0aGlzLmdldENvbW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBoYXNVbmtub3duVmFsdWUodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuYWN0aXZlQ2hvaWNlcztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS52YWx1ZSA9PSB2YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlczsgfVxyXG4gICAgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNob2ljZXNDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgaGFzT3RoZXJDaGFuZ2VkKCkge1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hvaWNlc0NoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIGdldCBjaG9pY2VzT3JkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2hvaWNlc09yZGVyVmFsdWU7IH1cclxuICAgIHNldCBjaG9pY2VzT3JkZXIobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSB0aGlzLmNob2ljZXNPcmRlclZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hvaWNlc0NoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIGdldCBvdGhlclRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3RoZXJJdGVtLnRleHQ7IH1cclxuICAgIHNldCBvdGhlclRleHQodmFsdWU6IHN0cmluZykgeyB0aGlzLm90aGVySXRlbS50ZXh0ID0gdmFsdWU7IH1cclxuICAgIGdldCB2aXNpYmxlQ2hvaWNlcygpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzT3RoZXIgJiYgdGhpcy5jaG9pY2VzT3JkZXIgPT0gXCJub25lXCIpIHJldHVybiB0aGlzLmFjdGl2ZUNob2ljZXM7XHJcbiAgICAgICAgaWYoIXRoaXMudmlzaWJsZUNob2ljZXNDYWNoZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUgPSB0aGlzLnNvcnRWaXNpYmxlQ2hvaWNlcyh0aGlzLmFjdGl2ZUNob2ljZXMuc2xpY2UoKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUucHVzaCh0aGlzLm90aGVySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZUNob2ljZXNDYWNoZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0IGFjdGl2ZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7IHJldHVybiB0aGlzLmNob2ljZXNGcm9tVXJsID8gdGhpcy5jaG9pY2VzRnJvbVVybCA6IHRoaXMuY2hvaWNlczsgfVxyXG4gICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICghdGhpcy5pc090aGVyU2VsZWN0ZWQgfHwgdGhpcy5jb21tZW50KSByZXR1cm47XHJcbiAgICAgICAgdmFyIHRleHQgPSB0aGlzLm90aGVyRXJyb3JUZXh0O1xyXG4gICAgICAgIGlmICghdGV4dCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVyUmVxdWlyZWRFcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHRleHQpKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpIHsgcmV0dXJuIHRoaXMuc3RvcmVPdGhlcnNBc0NvbW1lbnQgJiYgKHRoaXMuc3VydmV5ICE9IG51bGwgPyB0aGlzLnN1cnZleS5zdG9yZU90aGVyc0FzQ29tbWVudCA6IHRydWUpOyB9XHJcbiAgICBvblN1cnZleUxvYWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0J5VXJsKSB0aGlzLmNob2ljZXNCeVVybC5ydW4oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Mb2FkQ2hvaWNlc0Zyb21VcmwoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pIHtcclxuICAgICAgICB2YXIgZXJyb3JDb3VudCA9IHRoaXMuZXJyb3JzLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNCeVVybCAmJiB0aGlzLmNob2ljZXNCeVVybC5lcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHRoaXMuY2hvaWNlc0J5VXJsLmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVycm9yQ291bnQgPiAwIHx8IHRoaXMuZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3Q2hvaWNlcyA9IG51bGw7XHJcbiAgICAgICAgaWYgKGFycmF5ICYmIGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbmV3Q2hvaWNlcyA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKG5ld0Nob2ljZXMsIGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzRnJvbVVybCA9IG5ld0Nob2ljZXM7XHJcbiAgICAgICAgdGhpcy5vblZpc2libGVDaG9pY2VzQ2hhbmdlZCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFZhbHVlRm9yVXJsUmVxdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5jYWNoZWRWYWx1ZUZvclVybFJlcXVlc3Rpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblZpc2libGVDaG9pY2VzQ2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY2hvaWNlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNvcnRWaXNpYmxlQ2hvaWNlcyhhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgIHZhciBvcmRlciA9IHRoaXMuY2hvaWNlc09yZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKG9yZGVyID09IFwiYXNjXCIpIHJldHVybiB0aGlzLnNvcnRBcnJheShhcnJheSwgMSk7XHJcbiAgICAgICAgaWYgKG9yZGVyID09IFwiZGVzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIC0xKTtcclxuICAgICAgICBpZiAob3JkZXIgPT0gXCJyYW5kb21cIikgcmV0dXJuIHRoaXMucmFuZG9taXplQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc29ydEFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+LCBtdWx0OiBudW1iZXIpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICByZXR1cm4gYXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICBpZiAoYS50ZXh0IDwgYi50ZXh0KSByZXR1cm4gLTEgKiBtdWx0O1xyXG4gICAgICAgICAgICBpZiAoYS50ZXh0ID4gYi50ZXh0KSByZXR1cm4gMSAqIG11bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21pemVBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIHZhciBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgIGFycmF5W2pdID0gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveEJhc2UgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNlbGVjdGJhc2VcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLFxyXG4gICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgeyBuYW1lOiBcImNob2ljZXNPcmRlclwiLCBkZWZhdWx0OiBcIm5vbmVcIiwgY2hvaWNlczogW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl0gfSxcclxuICAgIHsgbmFtZTogXCJjaG9pY2VzQnlVcmw6cmVzdGZ1bGxcIiwgY2xhc3NOYW1lOiBcIkNob2ljZXNSZXN0ZnVsbFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5jaG9pY2VzQnlVcmwuaXNFbXB0eSA/IG51bGwgOiBvYmouY2hvaWNlc0J5VXJsOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXNCeVVybC5zZXREYXRhKHZhbHVlKTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcIm90aGVyVGV4dFwiLCBkZWZhdWx0OiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSB9LCBcIm90aGVyRXJyb3JUZXh0XCIsXHJcbiAgICB7IG5hbWU6IFwic3RvcmVPdGhlcnNBc0NvbW1lbnQ6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfV0sIG51bGwsIFwicXVlc3Rpb25cIik7XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hiYXNlXCIsIFt7IG5hbWU6IFwiY29sQ291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDEsIGNob2ljZXM6IFswLCAxLCAyLCAzLCA0XSB9XSwgbnVsbCwgXCJzZWxlY3RiYXNlXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi9xdWVzdGlvbmJhc2UnO1xyXG5pbXBvcnQge0hhc2hUYWJsZX0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBRdWVzdGlvbkZhY3RvcnkgPSBuZXcgUXVlc3Rpb25GYWN0b3J5KCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIERlZmF1bHRDaG9pY2VzID0gW1wib25lXCIsIFwidHdvfHNlY29uZCB2YWx1ZVwiLCBcInRocmVlfHRoaXJkIHZhbHVlXCJdO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9ySGFzaDogSGFzaFRhYmxlPChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uQmFzZT4gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV0gPSBxdWVzdGlvbkNyZWF0b3I7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0QWxsVHlwZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gdGhpcy5jcmVhdG9ySGFzaCkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gY3JlYXRvcihuYW1lKTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSxcclxuICAgIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLFxyXG4gICAgSU1hdHJpeERyb3Bkb3duRGF0YVxyXG59IGZyb20gXCIuL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtJdGVtVmFsdWV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lOyB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgIHByaXZhdGUgcm93c1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25cIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPigpO1xyXG4gICAgICAgIGlmICghdGhpcy5yb3dzIHx8IHRoaXMucm93cy5sZW5ndGggPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93blJvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duUm93TW9kZWwobmFtZSwgdGV4dCwgdGhpcywgdmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25cIiwgW3sgbmFtZTogXCJyb3dzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucm93cyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9fV0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsKFwiXCIpOyB9LCBcIm1hdHJpeGRyb3Bkb3duYmFzZVwiKTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4ZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSxcclxuICAgIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBJTWF0cml4RHJvcGRvd25EYXRhXHJcbn0gZnJvbSBcIi4vcXVlc3Rpb25fbWF0cml4ZHJvcGRvd25iYXNlXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhEeW5hbWljUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5kZXg6IG51bWJlciwgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIFwicm93XCIgKyB0aGlzLmluZGV4OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgIHN0YXRpYyBNYXhSb3dDb3VudCA9IDEwMDtcclxuICAgIHByaXZhdGUgcm93Q291bnRlciA9IDA7XHJcbiAgICBwcml2YXRlIHJvd0NvdW50VmFsdWU6IG51bWJlciA9IDI7XHJcbiAgICBwcml2YXRlIGFkZFJvd1RleHRWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgcmVtb3ZlUm93VGV4dFZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIG1pblJvd0NvdW50ID0gMDtcclxuICAgIHB1YmxpYyByb3dDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4ZHluYW1pY1wiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByb3dDb3VudCgpIHsgcmV0dXJuIHRoaXMucm93Q291bnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCByb3dDb3VudCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWwgPCAwIHx8IHZhbCA+IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsLk1heFJvd0NvdW50KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5yb3dDb3VudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoID4gdmFsKSB7XHJcbiAgICAgICAgICAgIHZhciBxVmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgcVZhbC5zcGxpY2UodmFsKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHFWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucm93Q291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFJvdygpIHtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvd0NvdW50Kys7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlUm93KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucm93Q291bnQpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiBpbmRleCA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhbC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB2YWwgPSB0aGlzLmRlbGV0ZVJvd1ZhbHVlKHZhbCwgbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm93Q291bnQtLTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgYWRkUm93VGV4dCgpIHsgcmV0dXJuIHRoaXMuYWRkUm93VGV4dFZhbHVlID8gdGhpcy5hZGRSb3dUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiYWRkUm93XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGFkZFJvd1RleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkUm93VGV4dFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbW92ZVJvd1RleHQoKSB7IHJldHVybiB0aGlzLnJlbW92ZVJvd1RleHRWYWx1ZSA/IHRoaXMucmVtb3ZlUm93VGV4dFZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInJlbW92ZVJvd1wiKTsgfVxyXG4gICAgcHVibGljIHNldCByZW1vdmVSb3dUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZVJvd1RleHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyAgIHJldHVybiBmYWxzZTsgIH1cclxuICAgIHB1YmxpYyBnZXQgY2FjaGVkVmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+IHtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSB0aGlzLnJvd0NvdW50KSByZXR1cm4gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cztcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUm93cztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9ySW5Sb3dzKCkpIHtcclxuICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5Sb3dDb3VudEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluUm93Q291bnQpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNFcnJvckluUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5taW5Sb3dDb3VudCA8PSAwIHx8ICF0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlcyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBzZXRSb3dDb3VudCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyByb3dJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW3Jvd0luZGV4XTtcclxuICAgICAgICAgICAgaWYgKCFyb3cuaXNFbXB0eSkgc2V0Um93Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNldFJvd0NvdW50IDwgdGhpcy5taW5Sb3dDb3VudDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZW5lcmF0ZVJvd3MoKTogQXJyYXk8TWF0cml4RHluYW1pY1Jvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEeW5hbWljUm93TW9kZWw+KCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93Q291bnQgPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5nZXRSb3dWYWx1ZUJ5SW5kZXgodmFsLCBpKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyh2YWx1ZTogYW55KTogTWF0cml4RHluYW1pY1Jvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeER5bmFtaWNSb3dNb2RlbCh0aGlzLnJvd0NvdW50ZXIgKyssIHRoaXMsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdWYWx1ZShjdXJWYWx1ZTogYW55KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gY3VyVmFsdWU7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciByID0gW107XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiB0aGlzLnJvd0NvdW50KSByZXN1bHQuc3BsaWNlKHRoaXMucm93Q291bnQgLSAxKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gcmVzdWx0Lmxlbmd0aDsgaSA8IHRoaXMucm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZGVsZXRlUm93VmFsdWUobmV3VmFsdWU6IGFueSwgcm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSk6IGFueSB7XHJcbiAgICAgICAgdmFyIGlzRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3VmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG5ld1ZhbHVlW2ldKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNFbXB0eSA/IG51bGwgOiBuZXdWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgcXVlc3Rpb25WYWx1ZS5sZW5ndGggPyBxdWVzdGlvblZhbHVlW2luZGV4XSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Um93VmFsdWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgcXVlc3Rpb25WYWx1ZTogYW55LCBjcmVhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Um93VmFsdWVCeUluZGV4KHF1ZXN0aW9uVmFsdWUsIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MuaW5kZXhPZihyb3cpKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGR5bmFtaWNcIiwgW3sgbmFtZTogXCJyb3dDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMiB9LCB7IG5hbWU6IFwibWluUm93Q291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDAgfSxcclxuICAgICAgICB7IG5hbWU6IFwiYWRkUm93VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5hZGRSb3dUZXh0VmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwicmVtb3ZlUm93VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5yZW1vdmVSb3dUZXh0VmFsdWU7IH0gfV0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWwoXCJcIik7IH0sIFwibWF0cml4ZHJvcGRvd25iYXNlXCIpO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkeW5hbWljXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXhkeW5hbWljLnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBJdGVtVmFsdWV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gJy4vc3VydmV5U3RyaW5ncyc7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERhdGEge1xyXG4gICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhSb3dNb2RlbCBleHRlbmRzIEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBkYXRhOiBJTWF0cml4RGF0YTtcclxuICAgIHByb3RlY3RlZCByb3dWYWx1ZTogYW55OyBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMucm93VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhKSB0aGlzLmRhdGEub25NYXRyaXhSb3dDaGFuZ2VkKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU1hdHJpeERhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgIHByaXZhdGUgaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZWRWaXNpYmxlUm93czogQXJyYXk8TWF0cml4Um93TW9kZWw+O1xyXG4gICAgcHVibGljIGlzQWxsUm93UmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1Jvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93c1ZhbHVlLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcbiAgICBnZXQgY29sdW1ucygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY29sdW1uc1ZhbHVlOyB9XHJcbiAgICBzZXQgY29sdW1ucyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY29sdW1uc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICBzZXQgcm93cyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucm93c1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeFJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhSb3dNb2RlbD4oKTtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB0aGlzLm5hbWUgKyAnXycgKyB0aGlzLnJvd3NbaV0udmFsdWUudG9TdHJpbmcoKSwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyhudWxsLCBcIlwiLCB0aGlzLm5hbWUsIHZhbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gcmVzdWx0O1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRoaXMuaGFzVmFsdWVzSW5BbGxSb3dzKCk7IH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9ySW5Sb3dzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInJlcXVpcmVkSW5BbGxSb3dzRXJyb3JcIikpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhhc0Vycm9ySW5Sb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FsbFJvd1JlcXVpcmVkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmhhc1ZhbHVlc0luQWxsUm93cygpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNWYWx1ZXNJbkFsbFJvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJvd3MgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzO1xyXG4gICAgICAgIGlmICghcm93cykgcm93cyA9IHRoaXMudmlzaWJsZVJvd3M7XHJcbiAgICAgICAgaWYgKCFyb3dzKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHJvd3NbaV0udmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgZnVsbE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeFJvd01vZGVsKG5hbWUsIHRleHQsIGZ1bGxOYW1lLCB0aGlzLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZyB8fCAhKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHx8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5yb3dzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbMF0udmFsdWUgPSB2YWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByb3dWYWwgPSB2YWxbcm93Lm5hbWVdID8gdmFsW3Jvdy5uYW1lXSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLnZhbHVlID0gcm93VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy9JTWF0cml4RGF0YVxyXG4gICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzUm93cykge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKHJvdy52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdWYWx1ZVtyb3cubmFtZV0gPSByb3cudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeFwiLCBbeyBuYW1lOiBcImNvbHVtbnM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jb2x1bW5zKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jb2x1bW5zID0gdmFsdWU7IH19LFxyXG4gICAgeyBuYW1lOiBcInJvd3M6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yb3dzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yb3dzID0gdmFsdWU7IH0gfSxcclxuICAgIFwiaXNBbGxSb3dSZXF1aXJlZDpib29sZWFuXCJdLCAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXgudHNcbiAqKi8iLCJpbXBvcnQge0Jhc2V9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlWYWxpZGF0b3IsIElWYWxpZGF0b3JPd25lciwgVmFsaWRhdG9yUnVubmVyfSBmcm9tIFwiLi92YWxpZGF0b3JcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICBnZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbiAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTXVsdGlwbGVUZXh0SXRlbU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICBwcml2YXRlIGRhdGE6IElNdWx0aXBsZVRleHREYXRhO1xyXG4gICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+ID0gbmV3IEFycmF5PFN1cnZleVZhbGlkYXRvcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0aXRlbVwiO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1RleHQ6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdUZXh0OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgPyB0aGlzLmRhdGEuZ2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lKSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgIH1cclxuICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgaXRlbVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgcHJpdmF0ZSBpdGVtc1ZhbHVlczogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPiA9IG5ldyBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+KCk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dFwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpdGVtcygpOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+IHsgcmV0dXJuIHRoaXMuaXRlbXNWYWx1ZXM7IH1cclxuICAgIHB1YmxpYyBzZXQgaXRlbXModmFsdWU6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4pIHtcclxuICAgICAgICB0aGlzLml0ZW1zVmFsdWVzID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkSXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlVGV4dEl0ZW0obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuICAgIC8vVE9ETy1yZW1vdmUgbGF0ZXIuIERlbGF5IHJlbW92aW5nIGluIGNhc2Ugc29tZWJvZHkgdXNlIHRoaXMgZnVuY3Rpb24uXHJcbiAgICBwcml2YXRlIEFkZEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7IHJldHVybiB0aGlzLmFkZEl0ZW0obmFtZSwgdGl0bGUpOyB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1zW2ldLnZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsdWUgPCAxIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJvd3MoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgdmFyIGNvbENvdW50ID0gdGhpcy5jb2xDb3VudDtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goW10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXS5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IGNvbENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1WYWx1ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0SXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbU1vZGVsKG5hbWUsIHRpdGxlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkl0ZW1WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiAodGhpcy5pdGVtc1tpXS5uYW1lIGluIHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pdGVtc1tpXS5vblZhbHVlQ2hhbmdlZChpdGVtVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBydW5WYWxpZGF0b3JzKCk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8vSU11bHRpcGxlVGV4dERhdGFcclxuICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbbmFtZV07XHJcbiAgICB9XHJcbiAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dGl0ZW1cIiwgW1wibmFtZVwiLCB7IG5hbWU6IFwidGl0bGVcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXZhbGlkYXRvclwiLCBjbGFzc05hbWVQYXJ0OiBcInZhbGlkYXRvclwiIH1dLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbU1vZGVsKFwiXCIpOyB9KTtcclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRcIiwgW3sgbmFtZTogXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIGNsYXNzTmFtZTogXCJtdWx0aXBsZXRleHRpdGVtXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwiaXRlbVNpemU6bnVtYmVyXCIsIGRlZmF1bHQ6IDI1IH0sIHsgbmFtZTogXCJjb2xDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMSwgY2hvaWNlczogWzEsIDIsIDMsIDRdIH1dLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsKG5hbWUpOyBxLmFkZEl0ZW0oXCJ0ZXh0MVwiKTsgcS5hZGRJdGVtKFwidGV4dDJcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tdWx0aXBsZXRleHQudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtCYXNlLCBJUGFnZSwgSUNvbmRpdGlvblJ1bm5lciwgSVN1cnZleSwgSVF1ZXN0aW9uLCBIYXNoVGFibGUsIFN1cnZleUVsZW1lbnQsIFN1cnZleVBhZ2VJZH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q29uZGl0aW9uUnVubmVyfSBmcm9tIFwiLi9jb25kaXRpb25zXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblJvd01vZGVsIHtcclxuICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhZ2U6IFBhZ2VNb2RlbCwgcHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUm93VmlzaWJpbGl0eUNoYW5nZWQoKTsgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IFtdO1xyXG4gICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHVwZGF0ZVZpc2libGUoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jYWxjVmlzaWJsZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0V2lkdGgoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmlzaWJsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaykgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0V2lkdGgoKSB7XHJcbiAgICAgICAgdmFyIHZpc0NvdW50ID0gdGhpcy5nZXRWaXNpYmxlQ291bnQoKTtcclxuICAgICAgICBpZiAodmlzQ291bnQgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1F1ZXN0aW9uVmlzaWJsZSh0aGlzLnF1ZXN0aW9uc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLnJlbmRlcldpZHRoID0gdGhpcy5xdWVzdGlvbi53aWR0aCA/IHRoaXMucXVlc3Rpb24ud2lkdGggOiBNYXRoLmZsb29yKDEwMCAvIHZpc0NvdW50KSArICclJztcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLnJpZ2h0SW5kZW50ID0gY291bnRlciA8IHZpc0NvdW50IC0gMSA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUm93VmlzaWJpbGl0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlLm9uUm93VmlzaWJpbGl0eUNoYW5nZWQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZpc2libGVDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciByZXMgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNRdWVzdGlvblZpc2libGUodGhpcy5xdWVzdGlvbnNbaV0pKSByZXMrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNRdWVzdGlvblZpc2libGUocTogUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2UuaXNRdWVzdGlvblZpc2libGUocSk7IH1cclxuICAgIHByaXZhdGUgY2FsY1Zpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldFZpc2libGVDb3VudCgpID4gMDsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFnZU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElQYWdlLCBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHBhZ2VDb3VudGVyID0gMTAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGFnZUlkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwic3BfXCIgKyBQYWdlTW9kZWwucGFnZUNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlkVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcm93VmFsdWVzOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNvbmRpdGlvblJ1bm5lcjogQ29uZGl0aW9uUnVubmVyID0gbnVsbDtcclxuICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IG5ldyBBcnJheTxRdWVzdGlvbkJhc2U+KCk7XHJcbiAgICBwdWJsaWMgZGF0YTogSVN1cnZleSA9IG51bGw7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgcHJpdmF0ZSBudW1WYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5pZFZhbHVlID0gUGFnZU1vZGVsLmdldFBhZ2VJZCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHJvd3MoKTogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4ge1xyXG4gICAgICAgIHRoaXMucm93VmFsdWVzID0gdGhpcy5idWlsZFJvd3MoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dWYWx1ZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzQWN0aXZlKCkgeyByZXR1cm4gKCF0aGlzLmRhdGEpIHx8IHRoaXMuZGF0YS5jdXJyZW50UGFnZSA9PSB0aGlzOyB9XHJcbiAgICBwdWJsaWMgaXNRdWVzdGlvblZpc2libGUocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IGJvb2xlYW4geyByZXR1cm4gcXVlc3Rpb24udmlzaWJsZSB8fCB0aGlzLmlzRGVzaWduTW9kZTsgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJvdyhxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogUXVlc3Rpb25Sb3dNb2RlbCB7IHJldHVybiBuZXcgUXVlc3Rpb25Sb3dNb2RlbCh0aGlzLCBxdWVzdGlvbik7IH1cclxuICAgIHByaXZhdGUgZ2V0IGlzRGVzaWduTW9kZSgpIHsgcmV0dXJuIHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEuaXNEZXNpZ25Nb2RlOyB9XHJcbiAgICBwcml2YXRlIGJ1aWxkUm93cygpOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxRdWVzdGlvblJvd01vZGVsPigpO1xyXG4gICAgICAgIHZhciBsYXN0Um93VmlzaWJsZUluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHEgPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVSb3cocSkpO1xyXG4gICAgICAgICAgICBpZiAocS5zdGFydFdpdGhOZXdMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0Um93VmlzaWJsZUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtpXS5hZGRRdWVzdGlvbihxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXN0Um93VmlzaWJsZUluZGV4IDwgMCkgbGFzdFJvd1Zpc2libGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbbGFzdFJvd1Zpc2libGVJbmRleF0uYWRkUXVlc3Rpb24ocSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0W2ldLnNldFdpZHRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBvblJvd1Zpc2liaWxpdHlDaGFuZ2VkKHJvdzogUXVlc3Rpb25Sb3dNb2RlbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy5yb3dWYWx1ZXMpIHJldHVybjtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnJvd1ZhbHVlcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4OyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yb3dWYWx1ZXNbaV0ucXVlc3Rpb25zLmluZGV4T2Yocm93LnF1ZXN0aW9uKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1tpXS51cGRhdGVWaXNpYmxlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkVGl0bGUoKSB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5wcm9jZXNzVGV4dCh0aGlzLnRpdGxlKSA6IHRoaXMudGl0bGU7IH1cclxuICAgIHB1YmxpYyBnZXQgbnVtKCkgeyByZXR1cm4gdGhpcy5udW1WYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBudW0odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm51bVZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5udW1WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub25OdW1DaGFuZ2VkKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5wYWdlVmlzaWJpbGl0eUNoYW5nZWQodGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYWdlXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4geyAgcmV0dXJuIHRoaXMuZ2V0SXNQYWdlVmlzaWJsZShudWxsKTsgfVxyXG4gICAgcHVibGljIGdldElzUGFnZVZpc2libGUoZXhjZXB0aW9uUXVlc3Rpb246IElRdWVzdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0gPT0gZXhjZXB0aW9uUXVlc3Rpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSwgaW5kZXg6IG51bWJlciA9IC0xKSB7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDAsIHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLnNldERhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnF1ZXN0aW9uQWRkZWQocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTmV3UXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHRoaXMuZGF0YS5xdWVzdGlvblJlbW92ZWQocXVlc3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzRmlyc3RRdWVzdGlvbigpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUgfHwgIXF1ZXN0aW9uLmhhc0lucHV0KSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzRmlyc3RFcnJvclF1ZXN0aW9uKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlIHx8IHRoaXMucXVlc3Rpb25zW2ldLmN1cnJlbnRFcnJvckNvdW50ID09IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1tpXS5mb2N1cyh0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNjcm9sbFRvVG9wKCkge1xyXG4gICAgICAgIFN1cnZleUVsZW1lbnQuU2Nyb2xsRWxlbWVudFRvVG9wKFN1cnZleVBhZ2VJZCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUsIGZvY3VzZU9uRmlyc3RFcnJvcjogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBmaXJzdEVycm9yUXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUgJiYgdGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKGZpcmVDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChmb2N1c2VPbkZpcnN0RXJyb3IgJiYgZmlyc3RFcnJvclF1ZXN0aW9uID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yUXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpcnN0RXJyb3JRdWVzdGlvbikgZmlyc3RFcnJvclF1ZXN0aW9uLmZvY3VzKHRydWUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkUXVlc3Rpb25zVG9MaXN0KGxpc3Q6IEFycmF5PElRdWVzdGlvbj4sIHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5xdWVzdGlvbnNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pikge1xyXG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlSWYpIHJldHVybjtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZGl0aW9uUnVubmVyKSB0aGlzLmNvbmRpdGlvblJ1bm5lciA9IG5ldyBDb25kaXRpb25SdW5uZXIodGhpcy52aXNpYmxlSWYpO1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uUnVubmVyLmV4cHJlc3Npb24gPSB0aGlzLnZpc2libGVJZjtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0aGlzLmNvbmRpdGlvblJ1bm5lci5ydW4odmFsdWVzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbk51bUNoYW5nZWQodmFsdWU6IG51bWJlcikge1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYWdlXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIgfSwgeyBuYW1lOiBcInZpc2libGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwidmlzaWJsZUlmXCIsIFwidGl0bGVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlTW9kZWwoKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcGFnZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25DaGVja2JveEJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SGFzT3RoZXIodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHZhbC5pbmRleE9mKHRoaXMub3RoZXJJdGVtLnZhbHVlKSA+PSAwO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gdmFsO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNVbmtub3duVmFsdWUodmFsW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHZhbC5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhdmFsLmxlbmd0aCkgcmV0dXJuIHZhbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDb21tZW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gdmFsLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJjaGVja2JveFwiO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaGVja2JveFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ2hlY2tib3hNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9jaGVja2JveC50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICBwdWJsaWMgcm93czogbnVtYmVyID0gNDtcclxuICAgIHB1YmxpYyBjb2xzOiBudW1iZXIgPSA1MDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiY29tbWVudFwiO1xyXG4gICAgfVxyXG4gICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuaXNFbXB0eSgpIHx8IHRoaXMudmFsdWUgPT0gXCJcIjtcclxuICAgIH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tbWVudFwiLCBbeyBuYW1lOiBcImNvbHM6bnVtYmVyXCIsIGRlZmF1bHQ6IDUwIH0sIHsgbmFtZTogXCJyb3dzOm51bWJlclwiLCBkZWZhdWx0OiA0IH1dLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKG5hbWUpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9jb21tZW50LnRzXG4gKiovIiwiaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvblNlbGVjdEJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zQ2FwdGlvblZhbHVlOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCkgeyByZXR1cm4gKHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSkgPyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3B0aW9uc0NhcHRpb25cIik7IH1cclxuICAgIHB1YmxpYyBzZXQgb3B0aW9uc0NhcHRpb24obmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJkcm9wZG93blwiO1xyXG4gICAgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImRyb3Bkb3duXCIsIFt7IG5hbWU6IFwib3B0aW9uc0NhcHRpb25cIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoub3B0aW9uc0NhcHRpb25WYWx1ZTsgfX1dLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbChcIlwiKTsgfSwgXCJzZWxlY3RiYXNlXCIpO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fZHJvcGRvd24udHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge1N1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3IsIEV4Y2VlZFNpemVFcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkZpbGVNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHByaXZhdGUgc2hvd1ByZXZpZXdWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBpc1VwbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgaW1hZ2VIZWlnaHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBpbWFnZVdpZHRoOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuO1xyXG4gICAgcHVibGljIG1heFNpemU6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiZmlsZVwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzaG93UHJldmlldygpIHsgcmV0dXJuIHRoaXMuc2hvd1ByZXZpZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93UHJldmlldyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnNob3dQcmV2aWV3VmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGxvYWRGaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmICF0aGlzLnN1cnZleS51cGxvYWRGaWxlKHRoaXMubmFtZSwgZmlsZSwgdGhpcy5zdG9yZURhdGFBc1RleHQsIGZ1bmN0aW9uIChzdGF0dXM6IHN0cmluZykgeyBzZWxmLmlzVXBsb2FkaW5nID0gc3RhdHVzID09IFwidXBsb2FkaW5nXCI7ICB9KSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2V0RmlsZVZhbHVlKGZpbGUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHByZXZpZXdWYWx1ZTogYW55O1xyXG4gICAgcHJvdGVjdGVkIHNldEZpbGVWYWx1ZShmaWxlOiBGaWxlKSB7XHJcbiAgICAgICAgaWYgKCFGaWxlUmVhZGVyKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLnNob3dQcmV2aWV3ICYmICF0aGlzLnN0b3JlRGF0YUFzVGV4dCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrRmlsZUZvckVycm9ycyhmaWxlKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zaG93UHJldmlldykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wcmV2aWV3VmFsdWUgPSBzZWxmLmlzRmlsZUltYWdlKGZpbGUpID8gZmlsZVJlYWRlci5yZXN1bHQgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5maXJlQ2FsbGJhY2soc2VsZi5wcmV2aWV3VmFsdWVMb2FkZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmVEYXRhQXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gZmlsZVJlYWRlci5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICBzdXBlci5vbkNoZWNrRm9yRXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVwbG9hZGluZ0ZpbGVcIikpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrRmlsZUZvckVycm9ycyhmaWxlOiBGaWxlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gdGhpcy5lcnJvcnMgPyB0aGlzLmVycm9ycy5sZW5ndGggOiAwO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMubWF4U2l6ZSA+IDAgJiYgZmlsZS5zaXplID4gdGhpcy5tYXhTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEV4Y2VlZFNpemVFcnJvcih0aGlzLm1heFNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCB0aGlzLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzRmlsZUltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUgfHwgIWZpbGUudHlwZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzdHIgPSBmaWxlLnR5cGUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gc3RyLmluZGV4T2YoXCJpbWFnZVwiKSA9PSAwO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJmaWxlXCIsIFtcInNob3dQcmV2aWV3OmJvb2xlYW5cIiwgXCJpbWFnZUhlaWdodFwiLCBcImltYWdlV2lkdGhcIiwgXCJzdG9yZURhdGFBc1RleHQ6Ym9vbGVhblwiLCBcIm1heFNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25GaWxlTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZmlsZVwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uRmlsZU1vZGVsKG5hbWUpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9maWxlLnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uYmFzZVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uSHRtbE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25CYXNlIHtcclxuICAgIHByaXZhdGUgaHRtbFZhbHVlOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcImh0bWxcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaHRtbCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5odG1sVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaHRtbCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5odG1sVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkSHRtbCgpIHsgcmV0dXJuIHRoaXMuc3VydmV5ID8gdGhpcy5zdXJ2ZXkucHJvY2Vzc0h0bWwodGhpcy5odG1sKSA6IHRoaXMuaHRtbDsgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJodG1sXCIsIFtcImh0bWw6aHRtbFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uYmFzZVwiKTtcclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJodG1sXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25IdG1sTW9kZWwobmFtZSk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX2h0bWwudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQ2hlY2tib3hCYXNlfSBmcm9tIFwiLi9xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInJhZGlvZ3JvdXBcIjtcclxuICAgIH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmFkaW9ncm91cFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTt9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9yYWRpb2dyb3VwLnRzXG4gKiovIiwiaW1wb3J0IHtJdGVtVmFsdWV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZ01vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgc3RhdGljIGRlZmF1bHRSYXRlVmFsdWVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByYXRlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgIHB1YmxpYyBtaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIG1heGltdW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgcmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgcmF0ZVZhbHVlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucmF0ZXM7IH1cclxuICAgIHNldCByYXRlVmFsdWVzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yYXRlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBnZXQgdmlzaWJsZVJhdGVWYWx1ZXMoKTogSXRlbVZhbHVlW10ge1xyXG4gICAgICAgIGlmICh0aGlzLnJhdGVWYWx1ZXMubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMucmF0ZVZhbHVlcztcclxuICAgICAgICByZXR1cm4gUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwicmF0aW5nXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbn1cclxuSXRlbVZhbHVlLnNldERhdGEoUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcywgWzEsIDIsIDMsIDQsIDVdKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhdGluZ1wiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgeyBuYW1lOiBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yYXRlVmFsdWVzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yYXRlVmFsdWVzID0gdmFsdWU7IH19LFxyXG4gICAgXCJtaW5pbnVtUmF0ZURlc2NyaXB0aW9uXCIsIFwibWF4aW11bVJhdGVEZXNjcmlwdGlvblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmdNb2RlbChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fcmF0aW5nLnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHB1YmxpYyBzaXplOiBudW1iZXIgPSAyNTtcclxuICAgIHB1YmxpYyBpbnB1dFR5cGU6IHN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJ0ZXh0XCI7XHJcbiAgICB9XHJcbiAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7IH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuY29ycmVjdFZhbHVlVHlwZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgc3VwZXIuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNvcnJlY3RWYWx1ZVR5cGUobmV3VmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSkgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0VHlwZSA9PSBcIm51bWJlclwiIHx8IHRoaXMuaW5wdXRUeXBlID09IFwicmFuZ2VcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc051bWJlcihuZXdWYWx1ZSkgPyBwYXJzZUZsb2F0KG5ld1ZhbHVlKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0XCIsIFt7IG5hbWU6IFwiaW5wdXRUeXBlXCIsIGRlZmF1bHQ6IFwidGV4dFwiLCBjaG9pY2VzOiBbXCJjb2xvclwiLCBcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiZW1haWxcIiwgXCJtb250aFwiLCBcIm51bWJlclwiLCBcInBhc3N3b3JkXCIsIFwicmFuZ2VcIiwgXCJ0ZWxcIiwgXCJ0ZXh0XCIsIFwidGltZVwiLCBcInVybFwiLCBcIndlZWtcIl0gfSxcclxuICAgIHsgbmFtZTogXCJzaXplOm51bWJlclwiLCBkZWZhdWx0OiAyNSB9XSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJ0ZXh0XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0TW9kZWwobmFtZSk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX3RleHQudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtCYXNlLCBJU3VydmV5LCBIYXNoVGFibGUsIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciwgSVBhZ2UsIFN1cnZleUVycm9yLCBFdmVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlUcmlnZ2VyT3duZXIsIFN1cnZleVRyaWdnZXJ9IGZyb20gXCIuL3RyaWdnZXJcIjtcclxuaW1wb3J0IHtQYWdlTW9kZWx9IGZyb20gXCIuL3BhZ2VcIjtcclxuaW1wb3J0IHtUZXh0UHJlUHJvY2Vzc29yfSBmcm9tIFwiLi90ZXh0UHJlUHJvY2Vzc29yXCI7XHJcbmltcG9ydCB7UHJvY2Vzc1ZhbHVlfSBmcm9tIFwiLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuaW1wb3J0IHtkeFN1cnZleVNlcnZpY2V9IGZyb20gXCIuL2R4U3VydmV5U2VydmljZVwiO1xyXG5pbXBvcnQge0pzb25FcnJvcn0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5TW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVN1cnZleSwgSVN1cnZleVRyaWdnZXJPd25lciB7XHJcbiAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGNsaWVudElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGNvb2tpZU5hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29tbWVudFByZWZpeDogc3RyaW5nID0gXCItQ29tbWVudFwiO1xyXG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHNob3dOYXZpZ2F0aW9uQnV0dG9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2hvd1RpdGxlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBzaG93UGFnZVRpdGxlczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgY29tcGxldGVkSHRtbDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyByZXF1aXJlZFRleHQ6IHN0cmluZyA9IFwiKlwiO1xyXG4gICAgcHVibGljIHF1ZXN0aW9uU3RhcnRJbmRleDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBxdWVzdGlvblRpdGxlVGVtcGxhdGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgc2hvd1Byb2dyZXNzQmFyOiBzdHJpbmcgPSBcIm9mZlwiO1xyXG4gICAgcHVibGljIHN0b3JlT3RoZXJzQXNDb21tZW50OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBnb05leHRQYWdlQXV0b21hdGljOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgcGFnZXM6IEFycmF5PFBhZ2VNb2RlbD4gPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgcHVibGljIHRyaWdnZXJzOiBBcnJheTxTdXJ2ZXlUcmlnZ2VyPiA9IG5ldyBBcnJheTxTdXJ2ZXlUcmlnZ2VyPigpO1xyXG4gICAgcHVibGljIGNsZWFySW52aXNpYmxlVmFsdWVzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRQYWdlVmFsdWU6IFBhZ2VNb2RlbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHZhbHVlc0hhc2g6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIHZhcmlhYmxlc0hhc2g6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIHBhZ2VQcmV2VGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHBhZ2VOZXh0VGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGNvbXBsZXRlVGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHNob3dQYWdlTnVtYmVyc1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZTogc3RyaW5nID0gXCJvblwiO1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTogc3RyaW5nID0gXCJ0b3BcIjtcclxuICAgIHByaXZhdGUgbG9jYWxlVmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGlzQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBwcm9jZXNzZWRUZXh0VmFsdWVzOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgcHJpdmF0ZSB0ZXh0UHJlUHJvY2Vzc29yOiBUZXh0UHJlUHJvY2Vzc29yO1xyXG4gICAgcHJpdmF0ZSBpc1ZhbGlkYXRpbmdPblNlcnZlclZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIG1vZGVWYWx1ZTogc3RyaW5nID0gXCJlZGl0XCI7XHJcbiAgICBwcml2YXRlIGlzRGVzaWduTW9kZVZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHVibGljIG9uQ29tcGxldGU6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uQ3VycmVudFBhZ2VDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblZpc2libGVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25QYWdlVmlzaWJsZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblF1ZXN0aW9uQWRkZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblF1ZXN0aW9uUmVtb3ZlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uVmFsaWRhdGVRdWVzdGlvbjogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uU2VydmVyVmFsaWRhdGVRdWVzdGlvbnM6IChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueTtcclxuICAgIHB1YmxpYyBvblByb2Nlc3NIdG1sOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25HZXRSZXN1bHQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblVwbG9hZEZpbGU6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBqc29uRXJyb3JzOiBBcnJheTxKc29uRXJyb3I+ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yID0gbmV3IFRleHRQcmVQcm9jZXNzb3IoKTtcclxuICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25IYXNWYWx1ZSA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuaGFzUHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWUpOyB9O1xyXG4gICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdmFsdWUuZGF0YSA9IHNlbGY7XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5zZXRPd25lcihzZWxmKTtcclxuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCk7XHJcbiAgICAgICAgdGhpcy5vbkJlZm9yZUNyZWF0aW5nKCk7XHJcbiAgICAgICAgaWYgKGpzb25PYmopIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRKc29uT2JqZWN0KGpzb25PYmopO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkU3VydmV5RnJvbVNlcnZpY2UodGhpcy5zdXJ2ZXlJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdXJ2ZXlcIjsgfVxyXG4gICAgcHVibGljIGdldCBsb2NhbGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jYWxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbG9jYWxlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmxvY2FsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgc3VydmV5TG9jYWxpemF0aW9uLmN1cnJlbnRMb2NhbGUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRMb2NTdHJpbmcoc3RyOiBzdHJpbmcpIHsgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoc3RyKTsgfVxyXG4gICAgcHVibGljIGdldCBlbXB0eVN1cnZleVRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0TG9jU3RyaW5nKFwiZW1wdHlTdXJ2ZXlcIik7IH1cclxuICAgIHB1YmxpYyBnZXQgcGFnZVByZXZUZXh0KCkgeyByZXR1cm4gKHRoaXMucGFnZVByZXZUZXh0VmFsdWUpID8gdGhpcy5wYWdlUHJldlRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwicGFnZVByZXZUZXh0XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IHBhZ2VQcmV2VGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMucGFnZVByZXZUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBwYWdlTmV4dFRleHQoKSB7IHJldHVybiAodGhpcy5wYWdlTmV4dFRleHRWYWx1ZSkgPyB0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJwYWdlTmV4dFRleHRcIik7IH1cclxuICAgIHB1YmxpYyBzZXQgcGFnZU5leHRUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5wYWdlTmV4dFRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlVGV4dCgpIHsgcmV0dXJuICh0aGlzLmNvbXBsZXRlVGV4dFZhbHVlKSA/IHRoaXMuY29tcGxldGVUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcImNvbXBsZXRlVGV4dFwiKTsgfVxyXG4gICAgcHVibGljIHNldCBjb21wbGV0ZVRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLmNvbXBsZXRlVGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd1BhZ2VOdW1iZXJzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zaG93UGFnZU51bWJlcnNWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93UGFnZU51bWJlcnModmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuc2hvd1BhZ2VOdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zaG93UGFnZU51bWJlcnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd1F1ZXN0aW9uTnVtYmVycygpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzVmFsdWU7IH07XHJcbiAgICBwdWJsaWMgc2V0IHNob3dRdWVzdGlvbk51bWJlcnModmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9O1xyXG4gICAgcHVibGljIGdldCBxdWVzdGlvblRpdGxlTG9jYXRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWU7IH07XHJcbiAgICBwdWJsaWMgc2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgfTtcclxuICAgIHB1YmxpYyBnZXQgbW9kZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5tb2RlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbW9kZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IHRoaXMubW9kZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBcImVkaXRcIiAmJiB2YWx1ZSAhPSBcImRpc3BsYXlcIikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMubW9kZVZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBkYXRhKGRhdGE6IGFueSkge1xyXG4gICAgICAgIHRoaXMudmFsdWVzSGFzaCA9IHt9O1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hba2V5XSA9IGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhrZXksIGRhdGFba2V5XSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5jb21tZW50UHJlZml4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZU1vZGVsPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEZXNpZ25Nb2RlKSByZXR1cm4gdGhpcy5wYWdlcztcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0uaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhZ2VzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgcHVibGljIGdldCBQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdlBhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2UGFnZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjdXJyZW50UGFnZU5vKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGN1cnJlbnRQYWdlTm8odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID49IHRoaXMudmlzaWJsZVBhZ2VzLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnZpc2libGVQYWdlc1t2YWx1ZV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZm9jdXNGaXJzdFF1ZXN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlLnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZS5mb2N1c0ZpcnN0UXVlc3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkaW5nKSByZXR1cm4gXCJsb2FkaW5nXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDb21wbGV0ZWQpIHJldHVybiBcImNvbXBsZXRlZFwiO1xyXG4gICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50UGFnZSkgPyBcInJ1bm5pbmdcIiA6IFwiZW1wdHlcIlxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsZWFyKGNsZWFyRGF0YTogYm9vbGVhbiA9IHRydWUsIGdvdG9GaXJzdFBhZ2U6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKGNsZWFyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc0hhc2ggPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChnb3RvRmlyc3RQYWdlICYmIHRoaXMudmlzaWJsZVBhZ2VDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzWzBdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBtZXJnZVZhbHVlcyhzcmM6IGFueSwgZGVzdDogYW55KSB7XHJcbiAgICAgICAgaWYgKCFkZXN0IHx8ICFzcmMpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkZXN0W2tleV0pIGRlc3Rba2V5XSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZVZhbHVlcyh2YWx1ZSwgZGVzdFtrZXldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlc3Rba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZTogUGFnZU1vZGVsLCBvbGRWYWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZEN1cnJlbnRQYWdlJzogb2xkVmFsdWUsICduZXdDdXJyZW50UGFnZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFByb2dyZXNzKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIDA7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSArIDE7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoaW5kZXggKiAxMDAgLyB0aGlzLnZpc2libGVQYWdlQ291bnQpKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNFZGl0TW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImVkaXRcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc0Rpc3BsYXlNb2RlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tb2RlID09IFwiZGlzcGxheVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRGVzaWduTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNEZXNpZ25Nb2RlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXREZXNpZ25Nb2RlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5pc0Rlc2lnbk1vZGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNDb29raWUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICByZXR1cm4gY29va2llcyAmJiBjb29raWVzLmluZGV4T2YodGhpcy5jb29raWVOYW1lICsgXCI9dHJ1ZVwiKSA+IC0xO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldENvb2tpZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29va2llTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPXRydWU7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAwOjA6MCBHTVRcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkZWxldGVDb29raWUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybjtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj07XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbmV4dFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMYXN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRWRpdE1vZGUgJiYgdGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuZG9TZXJ2ZXJWYWxpZGF0aW9uKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRvTmV4dFBhZ2UoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGdldCBpc0N1cnJlbnRQYWdlSGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyh0cnVlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBwcmV2UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29tcGxldGVMYXN0UGFnZSgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFZGl0TW9kZSAmJiB0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5kb1NlcnZlclZhbGlkYXRpb24oKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0ZpcnN0UGFnZSgpOiBib29sZWFuIHsgXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNMYXN0UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgcmV0dXJuIHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IHZQYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGRvQ29tcGxldGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJJbnZpc2libGVWYWx1ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckludmlzaWJsZVF1ZXN0aW9uVmFsdWVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0Q29va2llKCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcclxuICAgICAgICB0aGlzLm9uQ29tcGxldGUuZmlyZSh0aGlzLCBudWxsKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc1ZhbGlkYXRpbmdPblNlcnZlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNWYWxpZGF0aW5nT25TZXJ2ZXJWYWx1ZTsgfVxyXG4gICAgcHJpdmF0ZSBzZXRJc1ZhbGlkYXRpbmdPblNlcnZlcih2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMuaXNWYWxpZGF0aW5nT25TZXJ2ZXIpIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzVmFsaWRhdGluZ09uU2VydmVyVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5vbklzVmFsaWRhdGluZ09uU2VydmVyQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uSXNWYWxpZGF0aW5nT25TZXJ2ZXJDaGFuZ2VkKCkgeyB9XHJcbiAgICBwcm90ZWN0ZWQgZG9TZXJ2ZXJWYWxpZGF0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5vblNlcnZlclZhbGlkYXRlUXVlc3Rpb25zKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0geyBkYXRhOiB7fSwgZXJyb3JzOiB7fSwgc3VydmV5OiB0aGlzLCBjb21wbGV0ZSA6IGZ1bmN0aW9uICgpIHsgc2VsZi5jb21wbGV0ZVNlcnZlclZhbGlkYXRpb24ob3B0aW9ucyk7IH0gfTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVudFBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuY3VycmVudFBhZ2UucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIG9wdGlvbnMuZGF0YVtxdWVzdGlvbi5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldElzVmFsaWRhdGluZ09uU2VydmVyKHRydWUpO1xyXG4gICAgICAgIHRoaXMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29tcGxldGVTZXJ2ZXJWYWxpZGF0aW9uKG9wdGlvbnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0SXNWYWxpZGF0aW5nT25TZXJ2ZXIoZmFsc2UpO1xyXG4gICAgICAgIGlmICghb3B0aW9ucyAmJiAhb3B0aW9ucy5zdXJ2ZXkpIHJldHVybjtcclxuICAgICAgICB2YXIgc2VsZiA9IG9wdGlvbnMuc3VydmV5O1xyXG4gICAgICAgIHZhciBoYXNFcnJvcnMgPSBmYWxzZTtcclxuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcnMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBvcHRpb25zLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gc2VsZi5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbiAmJiBxdWVzdGlvbltcImVycm9yc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25bXCJhZGRFcnJvclwiXShuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcnNbbmFtZV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWhhc0Vycm9ycykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc0xhc3RQYWdlKSBzZWxmLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgZWxzZSBzZWxmLmRvTmV4dFBhZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZG9OZXh0UGFnZSgpIHtcclxuICAgICAgICB0aGlzLmNoZWNrT25QYWdlVHJpZ2dlcnMoKTtcclxuICAgICAgICBpZiAodGhpcy5zZW5kUmVzdWx0T25QYWdlTmV4dCAmJiB0aGlzLmNsaWVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCh0aGlzLnN1cnZleVBvc3RJZCwgdGhpcy5jbGllbnRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4ICsgMV07XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0Q29tcGxldGVkKCkge1xyXG4gICAgICAgIHRoaXMuaXNDb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBwcm9jZXNzZWRDb21wbGV0ZWRIdG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcGxldGVkSHRtbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzSHRtbCh0aGlzLmNvbXBsZXRlZEh0bWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gXCI8aDM+XCIgKyB0aGlzLmdldExvY1N0cmluZyhcImNvbXBsZXRpbmdTdXJ2ZXlcIikgKyBcIjwvaDM+XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZExvYWRpbmdIdG1sKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiPGgzPlwiICsgdGhpcy5nZXRMb2NTdHJpbmcoXCJsb2FkaW5nU3VydmV5XCIpICsgXCI8L2gzPlwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldExvY1N0cmluZyhcInByb2dyZXNzVGV4dFwiKVtcImZvcm1hdFwiXShpbmRleCwgdlBhZ2VzLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZyk9PmFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBhY2NlcHQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25VcGxvYWRGaWxlLmZpcmUodGhpcywgeyBuYW1lOiBuYW1lLCBmaWxlOiBmaWxlLCBhY2NlcHQ6IGFjY2VwdCB9KTtcclxuICAgICAgICBpZiAoIWFjY2VwdCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICghc3RvcmVEYXRhQXNUZXh0ICYmIHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBsb2FkRmlsZUNvcmUobmFtZSwgZmlsZSwgdXBsb2FkaW5nQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGxvYWRGaWxlQ29yZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHVwbG9hZGluZ0NhbGxiYWNrOiAoc3RhdHVzOiBzdHJpbmcpID0+IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKFwidXBsb2FkaW5nXCIpO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kRmlsZSh0aGlzLnN1cnZleVBvc3RJZCwgZmlsZSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHVwbG9hZGluZ0NhbGxiYWNrKSB1cGxvYWRpbmdDYWxsYmFjayhzdWNjZXNzID8gXCJzdWNjZXNzXCIgOiBcImVycm9yXCIpO1xyXG4gICAgICAgICAgICBpZiAoc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXRWYWx1ZShuYW1lLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFnZXNbaW5kZXhdO1xyXG4gICAgfVxyXG4gICAgYWRkUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoKHBhZ2UpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgIH1cclxuICAgIGFkZE5ld1BhZ2UobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmNyZWF0ZU5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgIHJldHVybiBwYWdlO1xyXG4gICAgfVxyXG4gICAgcmVtb3ZlUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnBhZ2VzLmluZGV4T2YocGFnZSk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucGFnZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IHBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoID4gMCA/IHRoaXMucGFnZXNbMF0gOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UXVlc3Rpb25CeU5hbWUobmFtZTogc3RyaW5nLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbiB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbk5hbWUgPSBxdWVzdGlvbnNbaV0ubmFtZTtcclxuICAgICAgICAgICAgaWYgKGNhc2VJbnNlbnNpdGl2ZSkgcXVlc3Rpb25OYW1lID0gcXVlc3Rpb25OYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmKHF1ZXN0aW9uTmFtZSA9PSBuYW1lKSByZXR1cm4gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRRdWVzdGlvbnNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSwgY2FzZUluc2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2UpOiBJUXVlc3Rpb25bXSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWVzW2ldLCBjYXNlSW5zZW5zaXRpdmUpO1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24pIHJlc3VsdC5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbjogSVF1ZXN0aW9uKTogUGFnZU1vZGVsIHtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKDxRdWVzdGlvbkJhc2U+cXVlc3Rpb24pID4gLTEpIHJldHVybiBwYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQYWdlQnlOYW1lKG5hbWU6IHN0cmluZyk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UGFnZXNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IFBhZ2VNb2RlbFtde1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzW2ldKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldFBhZ2VCeU5hbWUobmFtZXNbaV0pO1xyXG4gICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0QWxsUXVlc3Rpb25zKHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpOiBBcnJheTxJUXVlc3Rpb24+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PElRdWVzdGlvbj4oKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLmFkZFF1ZXN0aW9uc1RvTGlzdChyZXN1bHQsIHZpc2libGVPbmx5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdQYWdlKG5hbWU6IHN0cmluZykgeyByZXR1cm4gbmV3IFBhZ2VNb2RlbChuYW1lKTsgfVxyXG4gICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zW2ldLm5hbWUgIT0gbmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICduYW1lJzogbmFtZSwgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb25zW2ldLCB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBxdWVzdGlvbi5vblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrT25QYWdlVHJpZ2dlcnMoKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0Q3VycmVudFBhZ2VRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUocXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhxdWVzdGlvbi5uYW1lLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpOiBBcnJheTxRdWVzdGlvbkJhc2U+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIGlmICghcGFnZSkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHBhZ2UucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUgfHwgIXF1ZXN0aW9uLm5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrVHJpZ2dlcnMobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBpc09uTmV4dFBhZ2U6IGJvb2xlYW4pIHtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy50cmlnZ2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IHRoaXMudHJpZ2dlcnNbaV07XHJcbiAgICAgICAgICAgIGlmICh0cmlnZ2VyLm5hbWUgPT0gbmFtZSAmJiB0cmlnZ2VyLmlzT25OZXh0UGFnZSA9PSBpc09uTmV4dFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRyaWdnZXIuY2hlY2sobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb1F1ZXN0aW9uc09uTG9hZCgpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoZmFsc2UpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5vblN1cnZleUxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bkNvbmRpdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zRm9yTGlzdCh0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSkpO1xyXG4gICAgICAgIHRoaXMucnVuQ29uZGl0aW9uc0Zvckxpc3QodGhpcy5wYWdlcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bkNvbmRpdGlvbnNGb3JMaXN0KGxpc3Q6IEFycmF5PElDb25kaXRpb25SdW5uZXI+KSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxpc3RbaV0ucnVuQ29uZGl0aW9uKHRoaXMudmFsdWVzSGFzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNlbmRSZXN1bHQocG9zdElkOiBzdHJpbmcgPSBudWxsLCBjbGllbnRJZDogc3RyaW5nID0gbnVsbCwgaXNQYXJ0aWFsQ29tcGxldGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0VkaXRNb2RlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCFwb3N0SWQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgcG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcG9zdElkKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGNsaWVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kUmVzdWx0KHBvc3RJZCwgdGhpcy5kYXRhLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uU2VuZFJlc3VsdC5maXJlKHNlbGYsIHsgc3VjY2Vzczogc3VjY2VzcywgcmVzcG9uc2U6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5nZXRSZXN1bHQocmVzdWx0SWQsIG5hbWUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBhbnlbXSwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uR2V0UmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhOiBkYXRhLCBkYXRhTGlzdDogZGF0YUxpc3QsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBsb2FkU3VydmV5RnJvbVNlcnZpY2Uoc3VydmV5SWQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlJZCA9IHN1cnZleUlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKTtcclxuICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleSh0aGlzLnN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldEpzb25PYmplY3QocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHNlbGYubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja1BhZ2VWaXNpYmlsaXR5KHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG9sZFF1ZXN0aW9uVmlzaWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gcGFnZS5pc1Zpc2libGU7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IHBhZ2UuZ2V0SXNQYWdlVmlzaWJsZShxdWVzdGlvbikgfHwgb2xkUXVlc3Rpb25WaXNpYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2UsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpc2libGVJbmRleGVzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICBpZiAodGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25QYWdlXCIpIHtcclxuICAgICAgICAgICAgdmFyIHZpc1BhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh2aXNQYWdlc1tpXS5xdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSwgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXMoc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggPSB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5udW0gPSBzaG93SW5kZXggJiYgdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggKyAxIDogLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHF1ZXN0aW9uczogSVF1ZXN0aW9uW10sIHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcXVlc3Rpb25zW2ldLnNldFZpc2libGVJbmRleChzaG93SW5kZXggJiYgcXVlc3Rpb25zW2ldLnZpc2libGUgJiYgcXVlc3Rpb25zW2ldLmhhc1RpdGxlID8gKGluZGV4KyspIDogLTEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0SnNvbk9iamVjdChqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgIHZhciBqc29uQ29udmVydGVyID0gbmV3IEpzb25PYmplY3QoKTtcclxuICAgICAgICBqc29uQ29udmVydGVyLnRvT2JqZWN0KGpzb25PYmosIHRoaXMpO1xyXG4gICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVycm9ycyA9IGpzb25Db252ZXJ0ZXIuZXJyb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb29raWUpIHtcclxuICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZG9RdWVzdGlvbnNPbkxvYWQoKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHsgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgIHByaXZhdGUgdXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXMgPSB7fTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW1wicGFnZW5vXCJdID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHNlbGYuY3VycmVudFBhZ2UgIT0gbnVsbCA/IHNlbGYudmlzaWJsZVBhZ2VzLmluZGV4T2Yoc2VsZi5jdXJyZW50UGFnZSkgKyAxIDogMDsgfVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vjb3VudFwiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLnZpc2libGVQYWdlQ291bnQ7IH1cclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW3F1ZXN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKV0gPSBcInF1ZXN0aW9uXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhhc1Byb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgZmlyc3ROYW1lID0gbmV3IFByb2Nlc3NWYWx1ZSgpLmdldEZpcnN0TmFtZShuYW1lKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW2ZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIGZpcnN0TmFtZSA9IG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRGaXJzdE5hbWUobmFtZSk7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tmaXJzdE5hbWUudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh2YWwgPT0gXCJ2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKG5hbWUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWwgPT0gXCJxdWVzdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUoZmlyc3ROYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIG5hbWUgPSBxdWVzdGlvbi5uYW1lICsgbmFtZS5zdWJzdHIoZmlyc3ROYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvY2Vzc1ZhbHVlKCkuZ2V0VmFsdWUobmFtZSwgdGhpcy52YWx1ZXNIYXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbCA9PSBcInZhbHVlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhckludmlzaWJsZVF1ZXN0aW9uVmFsdWVzKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhcmlhYmxlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXNIYXNoW25hbWVdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFZhcmlhYmxlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YXJpYWJsZVwiO1xyXG4gICAgfVxyXG4gICAgLy9JU3VydmV5IGRhdGFcclxuICAgIHByaXZhdGUgZ2V0VW5iaW5kVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIC8vZG8gbm90IHJldHVybiB0aGUgc2FtZSBvYmplY3QgaW5zdGFuY2UhISFcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFVuYmluZFZhbHVlKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzVmFsdWVFcXVhbChuYW1lLCBuZXdWYWx1ZSkpIHJldHVybjtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIiB8fCBuZXdWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmdldFVuYmluZFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YWx1ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhuYW1lLCBuZXdWYWx1ZSwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIHRoaXMudHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNWYWx1ZUVxdWFsKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiKSBuZXdWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy5nZXRWYWx1ZShuYW1lKTtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT09IG51bGwgfHwgb2xkVmFsdWUgPT09IG51bGwpIHJldHVybiBuZXdWYWx1ZSA9PT0gb2xkVmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUd29WYWx1ZUVxdWFscyhuZXdWYWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1R3b1ZhbHVlRXF1YWxzKHg6IGFueSwgeTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHggPT09IHkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEoeSBpbnN0YW5jZW9mIE9iamVjdCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHgpIHtcclxuICAgICAgICAgICAgaWYgKCF4Lmhhc093blByb3BlcnR5KHApKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKCF5Lmhhc093blByb3BlcnR5KHApKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh4W3BdID09PSB5W3BdKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAoeFtwXSkgIT09IFwib2JqZWN0XCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHdvVmFsdWVFcXVhbHMoeFtwXSwgeVtwXSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChwIGluIHkpIHtcclxuICAgICAgICAgICAgaWYgKHkuaGFzT3duUHJvcGVydHkocCkgJiYgIXguaGFzT3duUHJvcGVydHkocCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdvTmV4dFBhZ2VBdXRvbWF0aWMgfHwgIXRoaXMuY3VycmVudFBhZ2UpIHJldHVybjtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWUpO1xyXG4gICAgICAgIGlmIChxdWVzdGlvbiAmJiAhcXVlc3Rpb24uc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lKSkgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFBhZ2UuaGFzRXJyb3JzKHRydWUsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNMYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZGF0YVtuYW1lICsgdGhpcy5jb21tZW50UHJlZml4XTtcclxuICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXg7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlID09IFwiXCIgfHwgbmV3VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgdGhpcy5jaGVja1BhZ2VWaXNpYmlsaXR5KHF1ZXN0aW9uLCAhbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uUGFnZVZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncGFnZSc6IHBhZ2UsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy5hZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5vblF1ZXN0aW9uQWRkZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICdpbmRleCc6IGluZGV4IH0pO1xyXG4gICAgfVxyXG4gICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy5vblF1ZXN0aW9uUmVtb3ZlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSB9KTtcclxuICAgIH1cclxuICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5pc0VtcHR5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgbmFtZTogbmFtZSwgdmFsdWU6IHRoaXMuZ2V0VmFsdWUobmFtZSksIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgdGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uZmlyZSh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucy5lcnJvciA/IG5ldyBDdXN0b21FcnJvcihvcHRpb25zLmVycm9yKSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0geyBodG1sOiBodG1sIH07XHJcbiAgICAgICAgdGhpcy5vblByb2Nlc3NIdG1sLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1RleHQob3B0aW9ucy5odG1sKTtcclxuICAgIH1cclxuICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dFByZVByb2Nlc3Nvci5wcm9jZXNzKHRleHQpO1xyXG4gICAgfVxyXG4gICAgLy9JU3VydmV5VHJpZ2dlck93bmVyXHJcbiAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtde1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UGFnZXNCeU5hbWVzKHBhZ2VzKSk7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFF1ZXN0aW9uc0J5TmFtZXMocXVlc3Rpb25zKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHNldFRyaWdnZXJWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGlzVmFyaWFibGU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICBpZiAoaXNWYXJpYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhcmlhYmxlKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXlcIiwgW3sgbmFtZTogXCJsb2NhbGVcIiwgY2hvaWNlczogKCkgPT4geyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldExvY2FsZXMoKSB9IH0sXHJcbiAgICBcInRpdGxlXCIsIFwiY29tcGxldGVkSHRtbDpodG1sXCIsIHsgbmFtZTogXCJwYWdlc1wiLCBjbGFzc05hbWU6IFwicGFnZVwiIH0sXHJcbiAgICB7IG5hbWU6IFwicXVlc3Rpb25zXCIsIGJhc2VDbGFzc05hbWU6IFwicXVlc3Rpb25cIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gbnVsbDsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iaiwgdmFsdWUsIGpzb25Db252ZXJ0ZXIpIHsgdmFyIHBhZ2UgPSBvYmouYWRkTmV3UGFnZShcIlwiKTsganNvbkNvbnZlcnRlci50b09iamVjdCh7IHF1ZXN0aW9uczogdmFsdWUgfSwgcGFnZSk7IH0gfSxcclxuICAgIHsgbmFtZTogXCJ0cmlnZ2Vyczp0cmlnZ2Vyc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXRyaWdnZXJcIiwgY2xhc3NOYW1lUGFydDogXCJ0cmlnZ2VyXCIgfSxcclxuICAgIFwic3VydmV5SWRcIiwgXCJzdXJ2ZXlQb3N0SWRcIiwgXCJjb29raWVOYW1lXCIsIFwic2VuZFJlc3VsdE9uUGFnZU5leHQ6Ym9vbGVhblwiLFxyXG4gICAgeyBuYW1lOiBcInNob3dOYXZpZ2F0aW9uQnV0dG9uczpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgeyBuYW1lOiBcInNob3dUaXRsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgeyBuYW1lOiBcInNob3dQYWdlVGl0bGVzOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LFxyXG4gICAgXCJzaG93UGFnZU51bWJlcnM6Ym9vbGVhblwiLCB7IG5hbWU6IFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBkZWZhdWx0OiBcIm9uXCIsIGNob2ljZXM6IFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdIH0sXHJcbiAgICB7IG5hbWU6IFwicXVlc3Rpb25UaXRsZUxvY2F0aW9uXCIsIGRlZmF1bHQ6IFwidG9wXCIsIGNob2ljZXM6IFtcInRvcFwiLCBcImJvdHRvbVwiXSB9LFxyXG4gICAgeyBuYW1lOiBcInNob3dQcm9ncmVzc0JhclwiLCBkZWZhdWx0OiBcIm9mZlwiLCBjaG9pY2VzOiBbXCJvZmZcIiwgXCJ0b3BcIiwgXCJib3R0b21cIl0gfSxcclxuICAgIHsgbmFtZTogXCJtb2RlXCIsIGRlZmF1bHQ6IFwiZWRpdFwiLCBjaG9pY2VzOiBbXCJlZGl0XCIsIFwiZGlzcGxheVwiXSB9LFxyXG4gICAgeyBuYW1lOiBcInN0b3JlT3RoZXJzQXNDb21tZW50OmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCBcImdvTmV4dFBhZ2VBdXRvbWF0aWM6Ym9vbGVhblwiLCBcImNsZWFySW52aXNpYmxlVmFsdWVzOmJvb2xlYW5cIixcclxuICAgIHsgbmFtZTogXCJwYWdlUHJldlRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucGFnZVByZXZUZXh0VmFsdWU7IH0gfSxcclxuICAgIHsgbmFtZTogXCJwYWdlTmV4dFRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucGFnZU5leHRUZXh0VmFsdWU7IH0gfSxcclxuICAgIHsgbmFtZTogXCJjb21wbGV0ZVRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tcGxldGVUZXh0VmFsdWU7IH0gfSxcclxuICAgIHsgbmFtZTogXCJyZXF1aXJlZFRleHRcIiwgZGVmYXVsdDogXCIqXCIgfSwgXCJxdWVzdGlvblN0YXJ0SW5kZXhcIiwgXCJxdWVzdGlvblRpdGxlVGVtcGxhdGVcIl0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N1cnZleS50c1xuICoqLyIsImV4cG9ydCBjbGFzcyBkeFN1cnZleVNlcnZpY2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHBzOi8vZHhzdXJ2ZXlhcGkuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1N1cnZleVwiO1xyXG4gICAgLy9wdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cDovL2xvY2FsaG9zdDo1MDQ4OC9hcGkvU3VydmV5XCI7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcsIG9uTG9hZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0U3VydmV5P3N1cnZleUlkPScgKyBzdXJ2ZXlJZCk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBvbkxvYWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZywgcmVzdWx0OiBKU09OLCBvblNlbmRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KT0+IHZvaWQsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9wb3N0LycpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgIHZhciBkYXRhID0geyBwb3N0SWQ6IHBvc3RJZCwgc3VydmV5UmVzdWx0OiBKU09OLnN0cmluZ2lmeShyZXN1bHQpIH07XHJcbiAgICAgICAgaWYgKGNsaWVudElkKSBkYXRhWydjbGllbnRJZCddID0gY2xpZW50SWQ7XHJcbiAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCkgZGF0YVsnaXNQYXJ0aWFsQ29tcGxldGVkJ10gPSB0cnVlO1xyXG4gICAgICAgIHZhciBkYXRhU3RyaW5naWZ5OiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIW9uU2VuZFJlc3VsdCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBvblNlbmRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZChkYXRhU3RyaW5naWZ5KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZW5kRmlsZShwb3N0SWQ6IHN0cmluZywgZmlsZTogRmlsZSwgb25TZW5kRmlsZTogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIW9uU2VuZEZpbGUpIHJldHVybjtcclxuICAgICAgICAgICAgb25TZW5kRmlsZSh4aHIuc3RhdHVzID09IDIwMCwgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvdXBsb2FkLycsIHRydWUpO1xyXG4gICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwicG9zdElkXCIsIHBvc3RJZCk7XHJcbiAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIG9uR2V0UmVzdWx0OiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogQXJyYXk8YW55PiwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJm5hbWU9JyArIG5hbWU7XHJcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9nZXRSZXN1bHQ/JyArIGRhdGEpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlc3VsdC5RdWVzdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHsgbmFtZToga2V5LCB2YWx1ZTogcmVzdWx0LlF1ZXN0aW9uUmVzdWx0W2tleV0gfTtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9uR2V0UmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIGxpc3QsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlzQ29tcGxldGVkKHJlc3VsdElkOiBzdHJpbmcsIGNsaWVudElkOiBzdHJpbmcsIG9uSXNDb21wbGV0ZWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJmNsaWVudElkPScgKyBjbGllbnRJZDtcclxuICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2lzQ29tcGxldGVkPycgKyBkYXRhKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb25Jc0NvbXBsZXRlZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2R4U3VydmV5U2VydmljZS50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgSGFzaFRhYmxlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWdnZXIgZXh0ZW5kcyBCYXNlIHtcclxuICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICBzdGF0aWMgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgICAgICBpZiAoVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZSAhPSBudWxsKSByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhdmFsdWU7IH0sXHJcbiAgICAgICAgICAgIG5vdGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICEoIXZhbHVlKTsgfSxcclxuICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgIT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgJiYgdmFsdWVbXCJpbmRleE9mXCJdICYmIHZhbHVlLmluZGV4T2YoZXhwZWN0ZWRWYWx1ZSkgPiAtMTsgfSxcclxuICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlIHx8ICF2YWx1ZVtcImluZGV4T2ZcIl0gfHwgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgZ3JlYXRlcjogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgIGxlc3M6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPCBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICBsZXNzb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8PSBleHBlY3RlZFZhbHVlOyB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb3BWYWx1ZTogc3RyaW5nID0gXCJlcXVhbFwiO1xyXG4gICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBvcGVyYXRvcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wZXJhdG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICghVHJpZ2dlci5vcGVyYXRvcnNbdmFsdWVdKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hlY2sodmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W107XHJcbiAgICBkb0NvbXBsZXRlKCk7XHJcbiAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXIgZXh0ZW5kcyBUcmlnZ2VyIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgb3duZXI6IElTdXJ2ZXlUcmlnZ2VyT3duZXIgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRPd25lcihvd25lcjogSVN1cnZleVRyaWdnZXJPd25lcikge1xyXG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNPbk5leHRQYWdlKCkgeyByZXR1cm4gZmFsc2U7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXJWaXNpYmxlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICBwdWJsaWMgcGFnZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInZpc2libGV0cmlnZ2VyXCI7IH1cclxuICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtU3VjY2Vzcyk7IH1cclxuICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgIHByaXZhdGUgb25UcmlnZ2VyKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm93bmVyLmdldE9iamVjdHModGhpcy5wYWdlcywgdGhpcy5xdWVzdGlvbnMpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmdW5jKG9iamVjdHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSB0cnVlOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgaXRlbS52aXNpYmxlID0gZmFsc2U7IH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlckNvbXBsZXRlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY29tcGxldGV0cmlnZ2VyXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNPbk5leHRQYWdlKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgaWYgKHRoaXMub3duZXIpIHRoaXMub3duZXIuZG9Db21wbGV0ZSgpOyB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXJTZXRWYWx1ZSBleHRlbmRzIFN1cnZleVRyaWdnZXIge1xyXG4gICAgcHVibGljIHNldFRvTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHNldFZhbHVlOiBhbnk7XHJcbiAgICBwdWJsaWMgaXNWYXJpYWJsZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzZXR2YWx1ZXRyaWdnZXJcIjsgfVxyXG4gICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2V0VG9OYW1lIHx8ICF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vd25lci5zZXRUcmlnZ2VyVmFsdWUodGhpcy5zZXRUb05hbWUsIHRoaXMuc2V0VmFsdWUsIHRoaXMuaXNWYXJpYWJsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0cmlnZ2VyXCIsIFtcIm9wZXJhdG9yXCIsIFwiIXZhbHVlXCJdKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIl0sIG51bGwsIFwidHJpZ2dlclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInZpc2libGV0cmlnZ2VyXCIsIFtcInBhZ2VzXCIsIFwicXVlc3Rpb25zXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlclZpc2libGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tcGxldGV0cmlnZ2VyXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlckNvbXBsZXRlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNldHZhbHVldHJpZ2dlclwiLCBbXCIhc2V0VG9OYW1lXCIsIFwic2V0VmFsdWVcIiwgXCJpc1ZhcmlhYmxlOmJvb2xlYW5cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RyaWdnZXIudHNcbiAqKi8iLCJpbXBvcnQge0Jhc2V9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4vc3VydmV5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5V2luZG93TW9kZWwgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHN1cnZleUVsZW1lbnROYW1lID0gXCJ3aW5kb3dTdXJ2ZXlKU1wiO1xyXG4gICAgc3VydmV5VmFsdWU6IFN1cnZleU1vZGVsO1xyXG4gICAgd2luZG93RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBpc1Nob3dpbmdWYWx1ZTogYm9vbGVhbjtcclxuICAgIGlzRXhwYW5kZWRWYWx1ZTogYm9vbGVhbjtcclxuICAgIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgIHRlbXBsYXRlVmFsdWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB0aGlzLmNyZWF0ZVN1cnZleShqc29uT2JqKTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLnNob3dUaXRsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2luZG93RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKSA6IHN0cmluZyB7IHJldHVybiBcIndpbmRvd1wiIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleU1vZGVsIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNTaG93aW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1Nob3dpbmdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBpc0V4cGFuZGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc0V4cGFuZGVkVmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMuc3VydmV5LnRpdGxlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBleHBhbmQoKSB7XHJcbiAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZSh0cnVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb2xsYXBzZSgpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKGZhbHNlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVTdXJ2ZXkoanNvbk9iajogYW55KTogU3VydmV5TW9kZWwge1xyXG4gICAgICAgIHJldHVybiBuZXcgU3VydmV5TW9kZWwoanNvbk9iailcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBleHBhbmRjb2xsYXBzZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNFeHBhbmRlZFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zdXJ2ZXlXaW5kb3cudHNcbiAqKi8iLCJleHBvcnQgdmFyIHN1cnZleUNzcyA9IHtcclxuICAgIGN1cnJlbnRUeXBlOiBcIlwiLFxyXG4gICAgZ2V0Q3NzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudFR5cGUgPyB0aGlzW3RoaXMuY3VycmVudFR5cGVdIDogZGVmYXVsdFN0YW5kYXJkQ3NzO1xyXG4gICAgICAgIGlmICghbG9jKSBsb2MgPSBkZWZhdWx0U3RhbmRhcmRDc3M7XHJcbiAgICAgICAgcmV0dXJuIGxvYztcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdmFyIGRlZmF1bHRTdGFuZGFyZENzcyA9IHtcclxuICAgIHJvb3Q6IFwic3ZfbWFpblwiLFxyXG4gICAgaGVhZGVyOiBcIlwiLFxyXG4gICAgYm9keTogXCJzdl9ib2R5XCIsXHJcbiAgICBmb290ZXI6IFwic3ZfbmF2XCIsXHJcbiAgICBuYXZpZ2F0aW9uQnV0dG9uOiBcIlwiLCBuYXZpZ2F0aW9uOiB7IGNvbXBsZXRlOiBcIlwiLCBwcmV2OlwiXCIsIG5leHQ6IFwiXCJ9LFxyXG4gICAgcHJvZ3Jlc3M6IFwic3ZfcHJvZ3Jlc3NcIiwgcHJvZ3Jlc3NCYXI6IFwiXCIsXHJcbiAgICBwYWdlVGl0bGU6IFwic3ZfcF90aXRsZVwiLFxyXG4gICAgcm93OiBcInN2X3Jvd1wiLFxyXG4gICAgcXVlc3Rpb246IHsgcm9vdDogXCJzdl9xXCIsIHRpdGxlOiBcInN2X3FfdGl0bGVcIiwgY29tbWVudDogXCJcIiwgaW5kZW50OiAyMCB9LFxyXG4gICAgZXJyb3I6IHsgcm9vdDogXCJzdl9xX2VyYm94XCIsIGljb246IFwiXCIsIGl0ZW06IFwiXCIgfSxcclxuXHJcbiAgICBjaGVja2JveDogeyByb290OiBcInN2X3FjYmNcIiwgaXRlbTogXCJzdl9xX2NoZWNrYm94XCIsIG90aGVyOiBcInN2X3Ffb3RoZXJcIiB9LFxyXG4gICAgY29tbWVudDogXCJcIixcclxuICAgIGRyb3Bkb3duOiBcIlwiLFxyXG4gICAgbWF0cml4OiB7IHJvb3Q6IFwic3ZfcV9tYXRyaXhcIiB9LFxyXG4gICAgbWF0cml4ZHJvcGRvd246IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICBtYXRyaXhkeW5hbWljOiB7IHJvb3Q6IFwidGFibGVcIiwgYnV0dG9uOiBcIlwiIH0sXHJcbiAgICBtdWx0aXBsZXRleHQ6IHsgcm9vdDogXCJcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiXCIgfSxcclxuICAgIHJhZGlvZ3JvdXA6IHsgcm9vdDogXCJzdl9xY2JjXCIsIGl0ZW06IFwic3ZfcV9yYWRpb2dyb3VwXCIsIG90aGVyOiBcInN2X3Ffb3RoZXJcIiB9LFxyXG4gICAgcmF0aW5nOiB7IHJvb3Q6IFwic3ZfcV9yYXRpbmdcIiwgaXRlbTogXCJzdl9xX3JhdGluZ19pdGVtXCIgfSxcclxuICAgIHRleHQ6IFwiXCIsXHJcbiAgICB3aW5kb3c6IHtcclxuICAgICAgICByb290OiBcInN2X3dpbmRvd1wiLCBib2R5OiBcInN2X3dpbmRvd19jb250ZW50XCIsXHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgIHJvb3Q6IFwic3Zfd2luZG93X3RpdGxlXCIsIHRpdGxlOiBcIlwiLCBidXR0b246IFwiXCIsIGJ1dHRvbkV4cGFuZGVkOiBcIlwiLCBidXR0b25Db2xsYXBzZWQ6IFwiXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5zdXJ2ZXlDc3NbXCJzdGFuZGFyZFwiXSA9IGRlZmF1bHRTdGFuZGFyZENzcztcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlDc3N9IGZyb20gXCIuL2Nzc3N0YW5kYXJkXCI7XHJcblxyXG5leHBvcnQgdmFyIGRlZmF1bHRCb290c3RyYXBDc3MgPSB7XHJcbiAgICByb290OiBcIlwiLFxyXG4gICAgaGVhZGVyOiBcInBhbmVsLWhlYWRpbmdcIixcclxuICAgIGJvZHk6IFwicGFuZWwtYm9keVwiLFxyXG4gICAgZm9vdGVyOiBcInBhbmVsLWZvb3RlclwiLFxyXG4gICAgbmF2aWdhdGlvbkJ1dHRvbjogXCJcIiwgbmF2aWdhdGlvbjogeyBjb21wbGV0ZTogXCJcIiwgcHJldjogXCJcIiwgbmV4dDogXCJcIiB9LFxyXG4gICAgcHJvZ3Jlc3M6IFwicHJvZ3Jlc3MgY2VudGVyLWJsb2NrXCIsIHByb2dyZXNzQmFyOiBcInByb2dyZXNzLWJhclwiLFxyXG4gICAgcGFnZVRpdGxlOiBcIlwiLFxyXG4gICAgcm93OiBcIlwiLFxyXG4gICAgcXVlc3Rpb246IHsgcm9vdDogXCJcIiwgdGl0bGU6IFwiXCIsIGNvbW1lbnQ6IFwiZm9ybS1jb250cm9sXCIsIGluZGVudDogMjAgfSxcclxuICAgIGVycm9yOiB7IHJvb3Q6IFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIsIGljb246IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1leGNsYW1hdGlvbi1zaWduXCIsIGl0ZW06IFwiXCIgfSxcclxuXHJcbiAgICBjaGVja2JveDogeyByb290OiBcImZvcm0taW5saW5lXCIsIGl0ZW06IFwiY2hlY2tib3hcIiwgb3RoZXI6IFwiXCIgfSxcclxuICAgIGNvbW1lbnQ6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICBkcm9wZG93bjogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgIG1hdHJpeDogeyByb290OiBcInRhYmxlXCIgfSxcclxuICAgIG1hdHJpeGRyb3Bkb3duOiB7IHJvb3Q6IFwidGFibGVcIiB9LFxyXG4gICAgbWF0cml4ZHluYW1pYzogeyByb290OiBcInRhYmxlXCIsIGJ1dHRvbjogXCJidXR0b25cIiB9LFxyXG4gICAgbXVsdGlwbGV0ZXh0OiB7IHJvb3Q6IFwidGFibGVcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiZm9ybS1jb250cm9sXCIgfSxcclxuICAgIHJhZGlvZ3JvdXA6IHsgcm9vdDogXCJmb3JtLWlubGluZVwiLCBpdGVtOiBcInJhZGlvXCIsIG90aGVyOiBcIlwiIH0sXHJcbiAgICByYXRpbmc6IHsgcm9vdDogXCJidG4tZ3JvdXBcIiwgaXRlbTogXCJidG4gYnRuLWRlZmF1bHRcIiB9LFxyXG4gICAgdGV4dDogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgIHdpbmRvdzoge1xyXG4gICAgICAgIHJvb3Q6IFwibW9kYWwtY29udGVudFwiLCBib2R5OiBcIm1vZGFsLWJvZHlcIixcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgcm9vdDogXCJtb2RhbC1oZWFkZXIgcGFuZWwtdGl0bGVcIiwgdGl0bGU6IFwicHVsbC1sZWZ0XCIsIGJ1dHRvbjogXCJnbHlwaGljb24gcHVsbC1yaWdodFwiLFxyXG4gICAgICAgICAgICBidXR0b25FeHBhbmRlZDogXCJnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi11cFwiLCBidXR0b25Db2xsYXBzZWQ6IFwiZ2x5cGhpY29uIHB1bGwtcmlnaHQgZ2x5cGhpY29uLWNoZXZyb24tZG93blwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5zdXJ2ZXlDc3NbXCJib290c3RyYXBcIl0gPSBkZWZhdWx0Qm9vdHN0cmFwQ3NzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RlZmF1bHRDc3MvY3NzYm9vdHN0cmFwLnRzXG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7UmVhY3RTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4vcmVhY3RzdXJ2ZXltb2RlbFwiO1xyXG5pbXBvcnQge1N1cnZleVBhZ2V9IGZyb20gXCIuL3JlYWN0cGFnZVwiO1xyXG5pbXBvcnQge1N1cnZleU5hdmlnYXRpb259IGZyb20gXCIuL3JlYWN0U3VydmV5TmF2aWdhdGlvblwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlDcmVhdG9yfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7c3VydmV5Q3NzfSBmcm9tIFwiLi4vZGVmYXVsdENzcy9jc3NzdGFuZGFyZFwiO1xyXG5pbXBvcnQge1N1cnZleVByb2dyZXNzfSBmcm9tIFwiLi9yZWFjdFN1cnZleVByb2dyZXNzXCI7XHJcbmltcG9ydCB7U3VydmV5UGFnZUlkfSBmcm9tIFwiLi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4gaW1wbGVtZW50cyBJU3VydmV5Q3JlYXRvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBjc3NUeXBlKCk6IHN0cmluZyB7IHJldHVybiBzdXJ2ZXlDc3MuY3VycmVudFR5cGU7IH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IGNzc1R5cGUodmFsdWU6IHN0cmluZykgeyBzdXJ2ZXlDc3MuY3VycmVudFR5cGUgPSB2YWx1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIHN1cnZleTogUmVhY3RTdXJ2ZXlNb2RlbDtcclxuICAgIHByaXZhdGUgaXNDdXJyZW50UGFnZUNoYW5nZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU3VydmV5KHByb3BzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN1cnZleShuZXh0UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNDdXJyZW50UGFnZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuZm9jdXNGaXJzdFF1ZXN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkuc3RhdGUgPT0gXCJjb21wbGV0ZWRcIikgcmV0dXJuIHRoaXMucmVuZGVyQ29tcGxldGVkKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5LnN0YXRlID09IFwibG9hZGluZ1wiKSByZXR1cm4gdGhpcy5yZW5kZXJMb2FkaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyU3VydmV5KCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNzcygpOiBhbnkgeyByZXR1cm4gc3VydmV5Q3NzLmdldENzcygpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNzcyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkubWVyZ2VDc3ModmFsdWUsIHRoaXMuY3NzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJDb21wbGV0ZWQoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBodG1sVmFsdWUgPSB7IF9faHRtbDogdGhpcy5zdXJ2ZXkucHJvY2Vzc2VkQ29tcGxldGVkSHRtbCB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTG9hZGluZygpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGh0bWxWYWx1ZSA9IHsgX19odG1sOiB0aGlzLnN1cnZleS5wcm9jZXNzZWRMb2FkaW5nSHRtbCB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyU3VydmV5KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnN1cnZleS50aXRsZSAmJiB0aGlzLnN1cnZleS5zaG93VGl0bGUgPyB0aGlzLnJlbmRlclRpdGxlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBjdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlID8gdGhpcy5yZW5kZXJQYWdlKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciB0b3BQcm9ncmVzcyA9IHRoaXMuc3VydmV5LnNob3dQcm9ncmVzc0JhciA9PSBcInRvcFwiID8gdGhpcy5yZW5kZXJQcm9ncmVzcyh0cnVlKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGJvdHRvbVByb2dyZXNzID0gdGhpcy5zdXJ2ZXkuc2hvd1Byb2dyZXNzQmFyID09IFwiYm90dG9tXCIgPyB0aGlzLnJlbmRlclByb2dyZXNzKGZhbHNlKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGJ1dHRvbnMgPSAoY3VycmVudFBhZ2UgJiYgdGhpcy5zdXJ2ZXkuc2hvd05hdmlnYXRpb25CdXR0b25zKSA/IHRoaXMucmVuZGVyTmF2aWdhdGlvbigpIDogbnVsbDtcclxuICAgICAgICBpZiAoIWN1cnJlbnRQYWdlKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQYWdlID0gdGhpcy5yZW5kZXJFbXB0eVN1cnZleSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGV9XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPXtTdXJ2ZXlQYWdlSWR9IGNsYXNzTmFtZT17dGhpcy5jc3MuYm9keX0+XHJcbiAgICAgICAgICAgICAgICAgICAge3RvcFByb2dyZXNzfVxyXG4gICAgICAgICAgICAgICAgICAgIHtjdXJyZW50UGFnZX1cclxuICAgICAgICAgICAgICAgICAgICB7Ym90dG9tUHJvZ3Jlc3N9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtidXR0b25zfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclRpdGxlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmhlYWRlcn0+PGgzPnt0aGlzLnN1cnZleS50aXRsZX08L2gzPjwvZGl2PjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJQYWdlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFN1cnZleVBhZ2Ugc3VydmV5PXt0aGlzLnN1cnZleX0gcGFnZT17dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2V9IGNzcz17dGhpcy5jc3N9IGNyZWF0b3I9e3RoaXN9IC8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclByb2dyZXNzKGlzVG9wOiBib29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5UHJvZ3Jlc3Mgc3VydmV5PXt0aGlzLnN1cnZleX0gY3NzPXt0aGlzLmNzc30gaXNUb3A9e2lzVG9wfSAgLz47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyTmF2aWdhdGlvbigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlOYXZpZ2F0aW9uIHN1cnZleSA9IHt0aGlzLnN1cnZleX0gY3NzPXt0aGlzLmNzc30vPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJFbXB0eVN1cnZleSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8c3Bhbj57dGhpcy5zdXJ2ZXkuZW1wdHlTdXJ2ZXlUZXh0fTwvc3Bhbj4pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTdXJ2ZXkobmV3UHJvcHM6IGFueSkge1xyXG4gICAgICAgIGlmIChuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMubW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3UHJvcHMubW9kZWw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3UHJvcHMuanNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3IFJlYWN0U3VydmV5TW9kZWwobmV3UHJvcHMuanNvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleSA9IG5ldyBSZWFjdFN1cnZleU1vZGVsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcykge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMuY2xpZW50SWQpIHRoaXMuc3VydmV5LmNsaWVudElkID0gbmV3UHJvcHMuY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5kYXRhKSB0aGlzLnN1cnZleS5kYXRhID0gbmV3UHJvcHMuZGF0YTtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmNzcykgdGhpcy5zdXJ2ZXkubWVyZ2VDc3MobmV3UHJvcHMuY3NzLCB0aGlzLmNzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL3NldCB0aGUgZmlyc3QgcGFnZVxyXG4gICAgICAgIHZhciBkdW1teSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0geyBwYWdlSW5kZXhDaGFuZ2U6IDAsIGlzQ29tcGxldGVkOiBmYWxzZSwgbW9kZWxDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdGhpcy5zZXRTdXJ2ZXlFdmVudHMobmV3UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldFN1cnZleUV2ZW50cyhuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlckNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLm1vZGVsQ2hhbmdlZCA9IHNlbGYuc3RhdGUubW9kZWxDaGFuZ2VkICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXIpID0+IHsgc2VsZi5zdGF0ZS5pc0NvbXBsZXRlZCA9IHRydWU7IHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uQ3VycmVudFBhZ2VDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHNlbGYuaXNDdXJyZW50UGFnZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLnBhZ2VJbmRleENoYW5nZSA9IHNlbGYuc3RhdGUucGFnZUluZGV4Q2hhbmdlICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzICYmIG5ld1Byb3BzLm9uQ3VycmVudFBhZ2VDaGFuZ2VkKSBuZXdQcm9wcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZChzZW5kZXIsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uVmlzaWJsZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMucXVlc3Rpb24gJiYgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YXRlID0gb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zdGF0ZTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLnZpc2libGUgPSBvcHRpb25zLnF1ZXN0aW9uLnZpc2libGU7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0LnNldFN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm9uVmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnF1ZXN0aW9uICYmIG9wdGlvbnMucXVlc3Rpb24ucmVhY3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS52YWx1ZSA9IG9wdGlvbnMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0LnNldFN0YXRlKHN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICghbmV3UHJvcHMpIHJldHVybjtcclxuICAgICAgICB0aGlzLnN1cnZleS5vblZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMuZGF0YSkgbmV3UHJvcHMuZGF0YVtvcHRpb25zLm5hbWVdID0gb3B0aW9ucy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLm9uVmFsdWVDaGFuZ2VkKSBuZXdQcm9wcy5vblZhbHVlQ2hhbmdlZChzZW5kZXIsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vbkNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXIpID0+IHsgbmV3UHJvcHMub25Db21wbGV0ZShzZW5kZXIpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25QYWdlVmlzaWJsZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgaWYgKG5ld1Byb3BzLm9uUGFnZVZpc2libGVDaGFuZ2VkKSBuZXdQcm9wcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICBpZiAobmV3UHJvcHMub25RdWVzdGlvbkFkZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUXVlc3Rpb25BZGRlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vblF1ZXN0aW9uQWRkZWQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblF1ZXN0aW9uUmVtb3ZlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblF1ZXN0aW9uUmVtb3ZlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vblF1ZXN0aW9uUmVtb3ZlZChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uVmFsaWRhdGVRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblZhbGlkYXRlUXVlc3Rpb24uYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25WYWxpZGF0ZVF1ZXN0aW9uKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblNlcnZlclZhbGlkYXRlUXVlc3Rpb25zID0gbmV3UHJvcHMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uU2VuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblNlbmRSZXN1bHQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25TZW5kUmVzdWx0KHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25HZXRSZXN1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25HZXRSZXN1bHQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25HZXRSZXN1bHQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblByb2Nlc3NIdG1sKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUHJvY2Vzc0h0bWwuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25Qcm9jZXNzSHRtbChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9JU3VydmV5Q3JlYXRvclxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbkNzcyA9IHRoaXMuY3NzW3F1ZXN0aW9uLmdldFR5cGUoKV07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uLmdldFR5cGUoKSwge1xyXG4gICAgICAgICAgICBxdWVzdGlvbjogcXVlc3Rpb24sIGNzczogcXVlc3Rpb25Dc3MsIHJvb3RDc3M6IHRoaXMuY3NzLCBpc0Rpc3BsYXlNb2RlOiB0aGlzLnN1cnZleS5pc0Rpc3BsYXlNb2RlLCBjcmVhdG9yOiB0aGlzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyRXJyb3Ioa2V5OiBzdHJpbmcsIGVycm9yVGV4dDogc3RyaW5nKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGtleT17a2V5fSBjbGFzc05hbWU9e3RoaXMuY3NzLmVycm9yLml0ZW19PntlcnJvclRleHR9PC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZUxvY2F0aW9uOyB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdFN1cnZleS50c3hcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMzhfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcInJvb3RcIjpcIlJlYWN0XCIsXCJjb21tb25qczJcIjpcInJlYWN0XCIsXCJjb21tb25qc1wiOlwicmVhY3RcIixcImFtZFwiOlwicmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSAzOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhY3RTdXJ2ZXlNb2RlbCBleHRlbmRzIFN1cnZleU1vZGVsIHtcclxuICAgIHJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKGpzb25PYmopO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIG1lcmdlQ3NzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHNyYywgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0c3VydmV5bW9kZWwudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9ufSBmcm9tICcuL3JlYWN0cXVlc3Rpb24nXHJcbmltcG9ydCB7UGFnZU1vZGVsfSBmcm9tIFwiLi4vcGFnZVwiO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcbmltcG9ydCB7SVN1cnZleUNyZWF0b3J9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25cIjtcclxuaW1wb3J0IHtRdWVzdGlvblJvd01vZGVsfSBmcm9tIFwiLi4vcGFnZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcGFnZTogUGFnZU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXk6IFN1cnZleU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gcHJvcHMucGFnZTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucGFnZSA9IG5leHRQcm9wcy5wYWdlO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gbmV4dFByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhZ2UgPT0gbnVsbCB8fCB0aGlzLnN1cnZleSA9PSBudWxsIHx8IHRoaXMuY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnJlbmRlclRpdGxlKCk7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB2YXIgcXVlc3Rpb25Sb3dzID0gdGhpcy5wYWdlLnJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKHRoaXMuY3JlYXRlUm93KHF1ZXN0aW9uUm93c1tpXSwgaSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJvdyhyb3c6IFF1ZXN0aW9uUm93TW9kZWwsIGluZGV4OiBudW1iZXIpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHJvd05hbWUgPSBcInJvd1wiICsgKGluZGV4ICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlSb3cga2V5PXtyb3dOYW1lfSByb3c9e3Jvd30gc3VydmV5PXt0aGlzLnN1cnZleX0gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSBjc3M9e3RoaXMuY3NzfSAvPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhZ2UudGl0bGUgfHwgIXRoaXMuc3VydmV5LnNob3dQYWdlVGl0bGVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGV4dCA9IHRoaXMucGFnZS5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICBpZiAodGhpcy5wYWdlLm51bSA+IDApIHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMucGFnZS5udW0gKyBcIi4gXCIgKyB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxoNCBjbGFzc05hbWU9e3RoaXMuY3NzLnBhZ2VUaXRsZX0+e3RleHR9PC9oND4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5Um93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHJvdzogUXVlc3Rpb25Sb3dNb2RlbDtcclxuICAgIHByaXZhdGUgc3VydmV5OiBTdXJ2ZXlNb2RlbDtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnRpZXMocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcHJvcHMucm93O1xyXG4gICAgICAgIGlmICh0aGlzLnJvdykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucm93LnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2V0U3RhdGUoeyB2aXNpYmxlOiBzZWxmLnJvdy52aXNpYmxlIH0pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnJvdyA9PSBudWxsIHx8IHRoaXMuc3VydmV5ID09IG51bGwgfHwgdGhpcy5jcmVhdG9yID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghdGhpcy5yb3cudmlzaWJsZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3cucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucm93LnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2godGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mucm93fT5cclxuICAgICAgICAgICAgICAgIHtxdWVzdGlvbnN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFN1cnZleVF1ZXN0aW9uIGtleT17cXVlc3Rpb24ubmFtZX0gcXVlc3Rpb249e3F1ZXN0aW9ufSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IGNzcz17dGhpcy5jc3N9IC8+O1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RwYWdlLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gJy4uL3F1ZXN0aW9uYmFzZSc7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gJy4uL3F1ZXN0aW9uJztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtfSBmcm9tICcuL3JlYWN0cXVlc3Rpb25jb21tZW50JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleUNyZWF0b3Ige1xyXG4gICAgY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBKU1guRWxlbWVudDtcclxuICAgIHJlbmRlckVycm9yKGtleTogc3RyaW5nLCBlcnJvclRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50O1xyXG4gICAgcXVlc3Rpb25UaXRsZUxvY2F0aW9uKCk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uQmFzZTogUXVlc3Rpb25CYXNlO1xyXG4gICAgcHJvdGVjdGVkIHF1ZXN0aW9uOiBRdWVzdGlvbjtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24ocHJvcHMucXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24obmV4dFByb3BzLnF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UXVlc3Rpb24ocXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZSA9IHF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbiBpbnN0YW5jZW9mIFF1ZXN0aW9uID8gcXVlc3Rpb24gOiBudWxsO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucXVlc3Rpb24gPyB0aGlzLnF1ZXN0aW9uLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBcclxuICAgICAgICAgICAgdmlzaWJsZTogdGhpcy5xdWVzdGlvbkJhc2UudmlzaWJsZSwgdmFsdWU6IHZhbHVlLCBlcnJvcjogMCwgcmVuZGVyV2lkdGg6IDAsXHJcbiAgICAgICAgICAgIHZpc2libGVJbmRleFZhbHVlOiAtMVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZVtcInJlYWN0XCJdID0gc2VsZjtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLnJlbmRlcldpZHRoID0gc2VsZi5zdGF0ZS5yZW5kZXJXaWR0aCArIDE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdGF0ZS52aXNpYmxlSW5kZXhWYWx1ZSA9IHNlbGYucXVlc3Rpb25CYXNlLnZpc2libGVJbmRleDtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2VbXCJyZWFjdFwiXSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UudmlzaWJsZUluZGV4Q2hhbmdlZENhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbkJhc2UgfHwgIXRoaXMuY3JlYXRvcikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uQmFzZS52aXNpYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcXVlc3Rpb25SZW5kZXIgPSB0aGlzLmNyZWF0b3IuY3JlYXRlUXVlc3Rpb25FbGVtZW50KHRoaXMucXVlc3Rpb25CYXNlKTtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnF1ZXN0aW9uQmFzZS5oYXNUaXRsZSA/IHRoaXMucmVuZGVyVGl0bGUoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlVG9wID0gdGhpcy5jcmVhdG9yLnF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpID09IFwidG9wXCIgPyB0aXRsZSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlQm90dG9tID0gdGhpcy5jcmVhdG9yLnF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpID09IFwiYm90dG9tXCIgPyB0aXRsZSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGNvbW1lbnQgPSAodGhpcy5xdWVzdGlvbiAmJiB0aGlzLnF1ZXN0aW9uLmhhc0NvbW1lbnQpID8gdGhpcy5yZW5kZXJDb21tZW50KCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBlcnJvcnMgPSB0aGlzLnJlbmRlckVycm9ycygpO1xyXG4gICAgICAgIHZhciBtYXJnaW5MZWZ0ID0gKHRoaXMucXVlc3Rpb25CYXNlLmluZGVudCA+IDApID8gdGhpcy5xdWVzdGlvbkJhc2UuaW5kZW50ICogdGhpcy5jc3MucXVlc3Rpb24uaW5kZW50ICsgXCJweFwiIDogbnVsbDtcclxuICAgICAgICB2YXIgcGFkZGluZ1JpZ2h0ID0gKHRoaXMucXVlc3Rpb25CYXNlLnJpZ2h0SW5kZW50ID4gMCkgPyB0aGlzLnF1ZXN0aW9uQmFzZS5yaWdodEluZGVudCAqIHRoaXMuY3NzLnF1ZXN0aW9uLmluZGVudCArIFwicHhcIiA6IG51bGw7XHJcbiAgICAgICAgdmFyIHJvb3RTdHlsZSA9IHsgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHZlcnRpY2FsQWxpZ246ICd0b3AnIH07XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoKSByb290U3R5bGVbXCJ3aWR0aFwiXSA9IHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoO1xyXG4gICAgICAgIGlmIChtYXJnaW5MZWZ0KSByb290U3R5bGVbXCJtYXJnaW5MZWZ0XCJdID0gbWFyZ2luTGVmdDtcclxuICAgICAgICBpZiAocGFkZGluZ1JpZ2h0KSByb290U3R5bGVbXCJwYWRkaW5nUmlnaHRcIl0gPSBwYWRkaW5nUmlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5xdWVzdGlvbkJhc2UuaWR9IGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24ucm9vdH0gc3R5bGU9e3Jvb3RTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGVUb3B9XHJcbiAgICAgICAgICAgICAgICB7ZXJyb3JzfVxyXG4gICAgICAgICAgICAgICAge3F1ZXN0aW9uUmVuZGVyfVxyXG4gICAgICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgICAgICB7dGl0bGVCb3R0b219XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyVGl0bGUoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciB0aXRsZVRleHQgPSB0aGlzLnF1ZXN0aW9uLmZ1bGxUaXRsZTtcclxuICAgICAgICByZXR1cm4gKDxoNSBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLnRpdGxlfT57dGl0bGVUZXh0fTwvaDU+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJDb21tZW50KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Pnt0aGlzLnF1ZXN0aW9uLmNvbW1lbnRUZXh0fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLmNvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgPFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufS8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJFcnJvcnMoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5UXVlc3Rpb25FcnJvcnMgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5jc3N9IGNyZWF0b3I9e3RoaXMuY3JlYXRvcn0gLz5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRXJyb3JzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFF1ZXN0aW9uO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVzdGlvbihwcm9wcy5xdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gcHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXN0aW9uKG5leHRQcm9wcy5xdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRRdWVzdGlvbihxdWVzdGlvbikge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbiBpbnN0YW5jZW9mIFF1ZXN0aW9uID8gcXVlc3Rpb24gOiBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLmVycm9yID0gc2VsZi5zdGF0ZS5lcnJvciArIDE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGVycm9yOiAwIH07XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbiB8fCB0aGlzLnF1ZXN0aW9uLmVycm9ycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi5lcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yVGV4dCA9IHRoaXMucXVlc3Rpb24uZXJyb3JzW2ldLmdldFRleHQoKTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiZXJyb3JcIiArIGk7XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKHRoaXMuY3JlYXRvci5yZW5kZXJFcnJvcihrZXksIGVycm9yVGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5lcnJvci5yb290fT57ZXJyb3JzfTwvZGl2Pik7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlFbGVtZW50QmFzZSwgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNvbW1lbnRNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2NvbW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25Db21tZW50IGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIHx8ICcnIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQmx1ciA9IHRoaXMuaGFuZGxlT25CbHVyLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uQ29tbWVudE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uQ29tbWVudE1vZGVsOyB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25CbHVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfHwgJycgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSlcclxuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3N9Pnt0aGlzLnF1ZXN0aW9uLnZhbHVlfTwvZGl2PilcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dGV4dGFyZWEgaWQ9e3RoaXMucXVlc3Rpb24uaW5wdXRJZH0gY2xhc3NOYW1lPXt0aGlzLmNzc30gdHlwZT1cInRleHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gIG9uQmx1cj17dGhpcy5oYW5kbGVPbkJsdXJ9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSBjb2xzPXt0aGlzLnF1ZXN0aW9uLmNvbHN9IHJvd3M9e3RoaXMucXVlc3Rpb24ucm93c30gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFF1ZXN0aW9uO1xyXG4gICAgcHJpdmF0ZSBjb21tZW50OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMuY29tbWVudCB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkJsdXIgPSB0aGlzLmhhbmRsZU9uQmx1ci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLmNvbW1lbnQgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkJsdXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgPSB0aGlzLmNvbW1lbnQ7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlNb2RlKVxyXG4gICAgICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi5jb21tZW50fT57dGhpcy5jb21tZW50fTwvZGl2Pik7XHJcbiAgICAgICAgcmV0dXJuICg8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLmNvbW1lbnR9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gb25CbHVyPXt0aGlzLmhhbmRsZU9uQmx1cn0gLz4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uQ29tbWVudCwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi4vYmFzZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtJU3VydmV5Q3JlYXRvcn0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvblwiO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25jb21tZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5RWxlbWVudEJhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgaXNEaXNwbGF5TW9kZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gcHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLmlzRGlzcGxheU1vZGUgPSBwcm9wcy5pc0Rpc3BsYXlNb2RlIHx8IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLmlzRGlzcGxheU1vZGUgPSBuZXh0UHJvcHMuaXNEaXNwbGF5TW9kZSB8fCBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2UgZXh0ZW5kcyBTdXJ2ZXlFbGVtZW50QmFzZSB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb25CYXNlOiBRdWVzdGlvbkJhc2U7XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25CYXNlID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gcHJvcHMuY3JlYXRvcjtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UgPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyT3RoZXIoc3R5bGU6IGFueSA9IG51bGwpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT48U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbkJhc2V9IGNzcz17dGhpcy5yb290Q3NzfSBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9Lz48L2Rpdj47XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmVsZW1lbnQudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge0hhc2hUYWJsZX0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFjdFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBSZWFjdFF1ZXN0aW9uRmFjdG9yeSA9IG5ldyBSZWFjdFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBEZWZhdWx0Q2hvaWNlcyA9IFtcIm9uZVwiLCBcInR3b3xzZWNvbmQgdmFsdWVcIiwgXCJ0aHJlZXx0aGlyZCB2YWx1ZVwiXTtcclxuICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBKU1guRWxlbWVudD4gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBKU1guRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXSA9IHF1ZXN0aW9uQ3JlYXRvcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBbGxUeXBlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBwYXJhbXM6IGFueSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gY3JlYXRvcihwYXJhbXMpO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnkudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcbmltcG9ydCB7U3VydmV5TmF2aWdhdGlvbkJhc2V9IGZyb20gXCIuL3JlYWN0U3VydmV5TmF2aWdhdGlvbkJhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlOYXZpZ2F0aW9uIGV4dGVuZHMgU3VydmV5TmF2aWdhdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVByZXZDbGljayA9IHRoaXMuaGFuZGxlUHJldkNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVOZXh0Q2xpY2sgPSB0aGlzLmhhbmRsZU5leHRDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQ29tcGxldGVDbGljayA9IHRoaXMuaGFuZGxlQ29tcGxldGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlUHJldkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucHJldlBhZ2UoKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU5leHRDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm5leHRQYWdlKCk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVDb21wbGV0ZUNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkuY29tcGxldGVMYXN0UGFnZSgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuc3VydmV5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcHJldkJ1dHRvbiA9ICF0aGlzLnN1cnZleS5pc0ZpcnN0UGFnZSA/IHRoaXMucmVuZGVyQnV0dG9uKHRoaXMuaGFuZGxlUHJldkNsaWNrLCB0aGlzLnN1cnZleS5wYWdlUHJldlRleHQsIHRoaXMuY3NzLm5hdmlnYXRpb24ucHJldikgOiBudWxsO1xyXG4gICAgICAgIHZhciBuZXh0QnV0dG9uID0gIXRoaXMuc3VydmV5LmlzTGFzdFBhZ2UgPyB0aGlzLnJlbmRlckJ1dHRvbih0aGlzLmhhbmRsZU5leHRDbGljaywgdGhpcy5zdXJ2ZXkucGFnZU5leHRUZXh0LCB0aGlzLmNzcy5uYXZpZ2F0aW9uLm5leHQpIDogbnVsbDtcclxuICAgICAgICB2YXIgY29tcGxldGVCdXR0b24gPSB0aGlzLnN1cnZleS5pc0xhc3RQYWdlID8gdGhpcy5yZW5kZXJCdXR0b24odGhpcy5oYW5kbGVDb21wbGV0ZUNsaWNrLCB0aGlzLnN1cnZleS5jb21wbGV0ZVRleHQsIHRoaXMuY3NzLm5hdmlnYXRpb24uY29tcGxldGUpIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MuZm9vdGVyfT5cclxuICAgICAgICAgICAgICAgIHtwcmV2QnV0dG9ufVxyXG4gICAgICAgICAgICAgICAge25leHRCdXR0b259XHJcbiAgICAgICAgICAgICAgICB7Y29tcGxldGVCdXR0b259XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckJ1dHRvbihjbGljazogYW55LCB0ZXh0OiBzdHJpbmcsIGJ0bkNsYXNzTmFtZTogc3RyaW5nKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHsgbWFyZ2luUmlnaHQ6IFwiNXB4XCIgfTtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lID0gdGhpcy5jc3MubmF2aWdhdGlvbkJ1dHRvbiArIChidG5DbGFzc05hbWUgPyAnICcgKyBidG5DbGFzc05hbWUgOiBcIlwiKTtcclxuICAgICAgICByZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBzdHlsZT17c3R5bGV9IHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXtjbGlja30gdmFsdWU9e3RleHR9IC8+O1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3N1cnZleVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleU5hdmlnYXRpb25CYXNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcm90ZWN0ZWQgc3VydmV5OiBTdXJ2ZXlNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBwcm9wcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdXBkYXRlOiAwIH07XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXh0UHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlU3RhdGVGdW5jdGlvbjogYW55ID0gbnVsbDtcclxuICAgIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU3RhdGVGdW5jdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc3RhdGUudXBkYXRlID0gc2VsZi5zdGF0ZS51cGRhdGUgKyAxO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblBhZ2VWaXNpYmxlQ2hhbmdlZC5hZGQodGhpcy51cGRhdGVTdGF0ZUZ1bmN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy51cGRhdGVTdGF0ZUZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUGFnZVZpc2libGVDaGFuZ2VkLnJlbW92ZSh0aGlzLnVwZGF0ZVN0YXRlRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlRnVuY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbkJhc2UudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcbmltcG9ydCB7U3VydmV5TmF2aWdhdGlvbkJhc2V9IGZyb20gXCIuL3JlYWN0U3VydmV5TmF2aWdhdGlvbkJhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9ncmVzcyBleHRlbmRzIFN1cnZleU5hdmlnYXRpb25CYXNlIHtcclxuICAgIHByb3RlY3RlZCBpc1RvcDogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pc1RvcCA9IHByb3BzLmlzVG9wO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLmlzVG9wID0gbmV4dFByb3BzLmlzVG9wO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9ncmVzcygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5zdXJ2ZXkuZ2V0UHJvZ3Jlc3MoKTsgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5LnByb2dyZXNzVGV4dDsgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLmlzVG9wID8geyB3aWR0aDogXCI2MCVcIiB9IDogeyB3aWR0aDogXCI2MCVcIiwgbWFyZ2luVG9wOiBcIjEwcHhcIiB9O1xyXG4gICAgICAgIHZhciBwcm9ncmVzc1N0eWxlID0geyB3aWR0aDogdGhpcy5wcm9ncmVzcyArIFwiJVwiIH07XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MucHJvZ3Jlc3N9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3Byb2dyZXNzU3R5bGV9IGNsYXNzTmFtZT17dGhpcy5jc3MucHJvZ3Jlc3NCYXJ9IHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMucHJvZ3Jlc3NUZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXlQcm9ncmVzcy50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2UsIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmNvbW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNoZWNrYm94TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9jaGVja2JveFwiO1xyXG5pbXBvcnQge0l0ZW1WYWx1ZX0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbkNoZWNrYm94IGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGNob2ljZXNDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5jaG9pY2VzQ2hhbmdlZCA9IHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb25DaGVja2JveE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uQ2hlY2tib3hNb2RlbDsgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgIHt0aGlzLmdldEl0ZW1zKCkgfVxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SXRlbXMoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiaXRlbVwiICsgaTtcclxuICAgICAgICAgICAgaXRlbXMucHVzaCh0aGlzLnJlbmRlckl0ZW0oa2V5LCBpdGVtLCBpID09IDApKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCB0ZXh0U3R5bGUoKTogYW55IHsgcmV0dXJuIG51bGw7IH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJJdGVtKGtleTogc3RyaW5nLCBpdGVtOiBhbnksIGlzRmlyc3Q6IGJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlRdWVzdGlvbkNoZWNrYm94SXRlbSBrZXk9e2tleX0gcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5jc3N9IHJvb3RDc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfSBpdGVtPXtpdGVtfSB0ZXh0U3R5bGU9e3RoaXMudGV4dFN0eWxlfSBpc0ZpcnN0PXtpc0ZpcnN0fSAvPjtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25DaGVja2JveEl0ZW0gZXh0ZW5kcyBTdXJ2ZXlFbGVtZW50QmFzZSB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFF1ZXN0aW9uQ2hlY2tib3hNb2RlbDtcclxuICAgIHByb3RlY3RlZCBpdGVtOiBJdGVtVmFsdWU7XHJcbiAgICBwcm90ZWN0ZWQgdGV4dFN0eWxlOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgaXNGaXJzdDogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLml0ZW0gPSBwcm9wcy5pdGVtO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLnRleHRTdHlsZSA9IHByb3BzLnRleHRTdHlsZTtcclxuICAgICAgICB0aGlzLmlzRmlyc3QgPSBwcm9wcy5pc0ZpcnN0O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IG5leHRQcm9wcy5pdGVtO1xyXG4gICAgICAgIHRoaXMudGV4dFN0eWxlID0gbmV4dFByb3BzLnRleHRTdHlsZTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gbmV4dFByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMuaXNGaXJzdCA9IG5leHRQcm9wcy5pc0ZpcnN0O1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnF1ZXN0aW9uLnZhbHVlO1xyXG4gICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGluZGV4ID0gbmV3VmFsdWUuaW5kZXhPZih0aGlzLml0ZW0udmFsdWUpO1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZS5wdXNoKHRoaXMuaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXRlbSB8fCAhdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGl0ZW1XaWR0aCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPiAwID8gKDEwMCAvIHRoaXMucXVlc3Rpb24uY29sQ291bnQpICsgXCIlXCIgOiBcIlwiO1xyXG4gICAgICAgIHZhciBtYXJnaW5SaWdodCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFwiNXB4XCIgOiBcIjBweFwiO1xyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHsgbWFyZ2luUmlnaHQ6IG1hcmdpblJpZ2h0IH07XHJcbiAgICAgICAgaWYgKGl0ZW1XaWR0aCkge1xyXG4gICAgICAgICAgICBkaXZTdHlsZVtcIndpZHRoXCJdID0gaXRlbVdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXNDaGVja2VkID0gKHRoaXMucXVlc3Rpb24udmFsdWUgJiYgdGhpcy5xdWVzdGlvbi52YWx1ZS5pbmRleE9mKHRoaXMuaXRlbS52YWx1ZSkgPiAtMSkgfHwgZmFsc2U7XHJcbiAgICAgICAgdmFyIG90aGVySXRlbSA9ICh0aGlzLml0ZW0udmFsdWUgPT09IHRoaXMucXVlc3Rpb24ub3RoZXJJdGVtLnZhbHVlICYmIGlzQ2hlY2tlZCkgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNoZWNrYm94KGlzQ2hlY2tlZCwgZGl2U3R5bGUsIG90aGVySXRlbSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGlucHV0U3R5bGUoKTogYW55IHsgcmV0dXJuIHsgbWFyZ2luUmlnaHQ6IFwiM3B4XCIgfTsgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckNoZWNrYm94KGlzQ2hlY2tlZDogYm9vbGVhbiwgZGl2U3R5bGU6IGFueSwgb3RoZXJJdGVtOiBKU1guRWxlbWVudCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaWQgPSB0aGlzLmlzRmlyc3QgPyB0aGlzLnF1ZXN0aW9uLmlucHV0SWQgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19IHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPXtpZH0gc3R5bGU9e3RoaXMuaW5wdXRTdHlsZX0gZGlzYWJsZWQ9e3RoaXMuaXNEaXNwbGF5TW9kZX0gY2hlY2tlZD17aXNDaGVja2VkfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3Bhbj57dGhpcy5pdGVtLnRleHR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICB7b3RoZXJJdGVtfVxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck90aGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5vdGhlcn0+PFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gIGlzRGlzcGxheU1vZGU9e3RoaXMuaXNEaXNwbGF5TW9kZX0vPjwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjaGVja2JveFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uQ2hlY2tib3gsIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmNoZWNrYm94LnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRHJvcGRvd25Nb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2Ryb3Bkb3duXCI7XHJcbmltcG9ydCB7U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmNvbW1lbnRcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbkRyb3Bkb3duIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlLCBjaG9pY2VzQ2hhbmdlZDogMCB9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgPSBzZWxmLnN0YXRlLmNob2ljZXNDaGFuZ2VkICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWw7IH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGNvbW1lbnQgPSB0aGlzLnF1ZXN0aW9uLnZhbHVlID09PSB0aGlzLnF1ZXN0aW9uLm90aGVySXRlbS52YWx1ZSA/IHRoaXMucmVuZGVyT3RoZXIoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHNlbGVjdCA9IHRoaXMucmVuZGVyU2VsZWN0KCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAge3NlbGVjdH1cclxuICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyU2VsZWN0KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlNb2RlKSAgcmV0dXJuICg8ZGl2IGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3N9Pnt0aGlzLnF1ZXN0aW9uLnZhbHVlfTwvZGl2Pik7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJpdGVtXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gPG9wdGlvbiBrZXk9e2tleX0gdmFsdWU9e2l0ZW0udmFsdWV9PntpdGVtLnRleHR9PC9vcHRpb24+O1xyXG4gICAgICAgICAgICBvcHRpb25zLnB1c2gob3B0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHNlbGVjdCBpZD17dGhpcy5xdWVzdGlvbi5pbnB1dElkfSBjbGFzc05hbWU9e3RoaXMuY3NzfSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9PlxyXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e3RoaXMucXVlc3Rpb24ub3B0aW9uc0NhcHRpb259PC9vcHRpb24+XHJcbiAgICAgICAgICAgIHtvcHRpb25zfVxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck90aGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IG1hcmdpblRvcDogXCIzcHhcIiB9O1xyXG4gICAgICAgIHJldHVybiA8ZGl2IHN0eWxlPXtzdHlsZX0+PFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9Lz48L2Rpdj47XHJcbiAgICB9XHJcbn1cclxuXHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJkcm9wZG93blwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uRHJvcGRvd24sIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmRyb3Bkb3duLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlFbGVtZW50QmFzZSwgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93blwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlDcmVhdG9yLCBTdXJ2ZXlRdWVzdGlvbkVycm9yc30gZnJvbSBcIi4vcmVhY3RxdWVzdGlvblwiO1xyXG5pbXBvcnQge01hdHJpeERyb3Bkb3duUm93TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93blwiO1xyXG5pbXBvcnQge01hdHJpeERyb3Bkb3duQ2VsbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd24gZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWw7IH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaGVhZGVycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi5jb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnF1ZXN0aW9uLmNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcImNvbHVtblwiICsgaTtcclxuICAgICAgICAgICAgdmFyIG1pbldpZHRoID0gdGhpcy5xdWVzdGlvbi5nZXRDb2x1bW5XaWR0aChjb2x1bW4pO1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uU3R5bGUgPSBtaW5XaWR0aCA/IHsgbWluV2lkdGg6IG1pbldpZHRoIH0gOiB7fTtcclxuICAgICAgICAgICAgaGVhZGVycy5wdXNoKDx0aCBrZXk9e2tleX0gc3R5bGU9e2NvbHVtblN0eWxlfT57dGhpcy5xdWVzdGlvbi5nZXRDb2x1bW5UaXRsZShjb2x1bW4pIH08L3RoPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIHZpc2libGVSb3dzID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlUm93cztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB2aXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwicm93XCIgKyBpO1xyXG4gICAgICAgICAgICByb3dzLnB1c2goPFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd25Sb3cga2V5PXtrZXl9IHJvdz17cm93fSBjc3M9e3RoaXMuY3NzfSByb290Q3NzPXt0aGlzLnJvb3RDc3N9IGlzRGlzcGxheU1vZGU9e3RoaXMuaXNEaXNwbGF5TW9kZX0gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHRoaXMucXVlc3Rpb24uaG9yaXpvbnRhbFNjcm9sbCA/IHsgb3ZlcmZsb3dYOiAnc2Nyb2xsJ30gOiB7fTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2ICBzdHlsZT17ZGl2U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoZWFkZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd25Sb3cgZXh0ZW5kcyBTdXJ2ZXlFbGVtZW50QmFzZSB7XHJcbiAgICBwcml2YXRlIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbDtcclxuICAgIHByb3RlY3RlZCBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnRpZXMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnJvdyA9IG5leHRQcm9wcy5yb3c7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5yb3cpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0ZHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93LmNlbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gdGhpcy5yb3cuY2VsbHNbaV07XHJcbiAgICAgICAgICAgIHZhciBlcnJvcnMgPSA8U3VydmV5UXVlc3Rpb25FcnJvcnMgcXVlc3Rpb249e2NlbGwucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IC8+XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0aGlzLnJlbmRlclNlbGVjdChjZWxsKTtcclxuICAgICAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJyb3dcIiArIGl9PntlcnJvcnN9e3NlbGVjdH08L3RkPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPHRyPjx0ZD57dGhpcy5yb3cudGV4dH08L3RkPnt0ZHN9PC90cj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclNlbGVjdChjZWxsOiBNYXRyaXhEcm9wZG93bkNlbGwpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRvci5jcmVhdGVRdWVzdGlvbkVsZW1lbnQoY2VsbC5xdWVzdGlvbik7XHJcbiAgICB9XHJcbn1cclxuXHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkcm9wZG93blwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd24sIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeGRyb3Bkb3duLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlFbGVtZW50QmFzZSwgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbk1hdHJpeE1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fbWF0cml4XCI7XHJcbmltcG9ydCB7TWF0cml4Um93TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb25NYXRyaXhNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbk1hdHJpeE1vZGVsOyB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGZpcnN0VEggPSB0aGlzLnF1ZXN0aW9uLmhhc1Jvd3MgPyA8dGg+PC90aD4gOiBudWxsO1xyXG4gICAgICAgIHZhciBoZWFkZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMucXVlc3Rpb24uY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiY29sdW1uXCIgKyBpO1xyXG4gICAgICAgICAgICBoZWFkZXJzLnB1c2goPHRoIGtleT17a2V5fT57Y29sdW1uLnRleHR9PC90aD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93cyA9IFtdO1xyXG4gICAgICAgIHZhciB2aXNpYmxlUm93cyA9IHRoaXMucXVlc3Rpb24udmlzaWJsZVJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInJvd1wiICsgaTtcclxuICAgICAgICAgICAgcm93cy5wdXNoKDxTdXJ2ZXlRdWVzdGlvbk1hdHJpeFJvdyBrZXk9e2tleX0gcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5jc3N9IHJvb3RDc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfSByb3c9e3Jvd30gaXNGaXJzdD17aSA9PSAwfSAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2ZpcnN0VEh9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtoZWFkZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIHtyb3dzfVxyXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeFJvdyBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFF1ZXN0aW9uTWF0cml4TW9kZWw7XHJcbiAgICBwcml2YXRlIHJvdzogTWF0cml4Um93TW9kZWw7XHJcbiAgICBwcml2YXRlIGlzRmlyc3Q6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLnJvdyA9IHByb3BzLnJvdztcclxuICAgICAgICB0aGlzLmlzRmlyc3QgPSBwcm9wcy5pc0ZpcnN0O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucm93LnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5yb3cudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5yb3cgPSBuZXh0UHJvcHMucm93O1xyXG4gICAgICAgIHRoaXMuaXNGaXJzdCA9IG5leHRQcm9wcy5pc0ZpcnN0O1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucm93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgZmlyc3RURCA9IHRoaXMucXVlc3Rpb24uaGFzUm93cyA/IDx0ZD57dGhpcy5yb3cudGV4dH08L3RkPiA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi5jb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSB0aGlzLnF1ZXN0aW9uLmNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInZhbHVlXCIgKyBpO1xyXG4gICAgICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5yb3cudmFsdWUgPT0gY29sdW1uLnZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgaW5wdXRJZCA9IHRoaXMuaXNGaXJzdCAmJiBpID09IDAgPyB0aGlzLnF1ZXN0aW9uLmlucHV0SWQgOiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgdGQgPSA8dGQga2V5PXtrZXl9PjxpbnB1dCBpZD17aW5wdXRJZH0gdHlwZT1cInJhZGlvXCIgbmFtZT17dGhpcy5yb3cuZnVsbE5hbWV9IHZhbHVlPXtjb2x1bW4udmFsdWV9IGRpc2FibGVkPXt0aGlzLmlzRGlzcGxheU1vZGV9IGNoZWNrZWQ9e2lzQ2hlY2tlZH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9Lz48L3RkPjtcclxuICAgICAgICAgICAgdGRzLnB1c2godGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDx0cj57Zmlyc3RURH17dGRzfTwvdHI+KTtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uTWF0cml4LCBwcm9wcyk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXgudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25IdG1sTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9odG1sXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25IdG1sIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbkh0bWxNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbkh0bWxNb2RlbDsgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24gfHwgIXRoaXMucXVlc3Rpb24uaHRtbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGh0bWxWYWx1ZSA9IHsgX19odG1sOiB0aGlzLnF1ZXN0aW9uLnByb2Nlc3NlZEh0bWwgfTtcclxuICAgICAgICByZXR1cm4gKDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e2h0bWxWYWx1ZX0gLz4gKTtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImh0bWxcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvbkh0bWwsIHByb3BzKTtcclxufSk7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25odG1sLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmlsZU1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fZmlsZVwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRmlsZSBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBmaWxlTG9hZGVkOiAwIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb25GaWxlTW9kZWwgeyByZXR1cm4gdGhpcy5xdWVzdGlvbkJhc2UgYXMgUXVlc3Rpb25GaWxlTW9kZWw7IH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHNyYyA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50OyBcclxuICAgICAgICBpZiAoIXdpbmRvd1tcIkZpbGVSZWFkZXJcIl0pIHJldHVybjtcclxuICAgICAgICBpZiAoIXNyYyB8fCAhc3JjLmZpbGVzIHx8IHNyYy5maWxlcy5sZW5ndGggPCAxKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5sb2FkRmlsZShzcmMuZmlsZXNbMF0pO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWxlTG9hZGVkOiB0aGlzLnN0YXRlLmZpbGVMb2FkZWQgKyAxIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBpbWcgPSB0aGlzLnJlbmRlckltYWdlKCk7XHJcbiAgICAgICAgdmFyIGZpbGVJbnB1dCA9IG51bGw7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGlzcGxheU1vZGUpIHtcclxuICAgICAgICAgICAgZmlsZUlucHV0ID0gPGlucHV0IGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IHR5cGU9XCJmaWxlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9Lz47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICB7ZmlsZUlucHV0fVxyXG4gICAgICAgICAgICAgICAge2ltZ31cclxuICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICBcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckltYWdlKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24ucHJldmlld1ZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKDxkaXY+ICA8aW1nIHNyYz17dGhpcy5xdWVzdGlvbi5wcmV2aWV3VmFsdWV9IGhlaWdodD17dGhpcy5xdWVzdGlvbi5pbWFnZUhlaWdodH0gd2lkdGg9e3RoaXMucXVlc3Rpb24uaW1hZ2VXaWR0aH0gLz48L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZmlsZVwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uRmlsZSwgcHJvcHMpO1xyXG59KTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmZpbGUudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleUVsZW1lbnRCYXNlLCBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tdWx0aXBsZXRleHRcIjtcclxuaW1wb3J0IHtNdWx0aXBsZVRleHRJdGVtTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tdWx0aXBsZXRleHRcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk11bHRpcGxlVGV4dCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsOyB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhYmxlUm93cyA9IHRoaXMucXVlc3Rpb24uZ2V0Um93cygpO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKHRoaXMucmVuZGVyUm93KFwiaXRlbVwiICsgaSwgdGFibGVSb3dzW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDx0YWJsZSBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUm93KGtleTogc3RyaW5nLCBpdGVtczogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPikge1xyXG4gICAgICAgIHZhciB0ZHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgIHRkcy5wdXNoKDx0ZCBrZXk9e1wibGFiZWxcIiArIGl9PjxzcGFuIGNsYXNzTmFtZT17dGhpcy5jc3MuaXRlbVRpdGxlfT57aXRlbS50aXRsZX08L3NwYW4+PC90ZD4pO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcInZhbHVlXCIgKyBpfT57dGhpcy5yZW5kZXJJdGVtKGl0ZW0sIGkgPT0gMCl9PC90ZD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gPHRyIGtleT17a2V5fT57dGRzfTwvdHI+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckl0ZW0oaXRlbTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsLCBpc0ZpcnN0OiBib29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBpbnB1dElkID0gaXNGaXJzdCA/IHRoaXMucXVlc3Rpb24uaW5wdXRJZCA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlRdWVzdGlvbk11bHRpcGxlVGV4dEl0ZW0gaXRlbT17aXRlbX0gY3NzPXt0aGlzLmNzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfSBpbnB1dElkPXtpbnB1dElkfSAvPjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTXVsdGlwbGVUZXh0SXRlbSBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByaXZhdGUgaXRlbTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBpbnB1dElkOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IHByb3BzLml0ZW07XHJcbiAgICAgICAgdGhpcy5pbnB1dElkID0gcHJvcHMuaW5wdXRJZDtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5pdGVtLnZhbHVlIHx8ICcnIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQmx1ciA9IHRoaXMuaGFuZGxlT25CbHVyLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25CbHVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5pdGVtLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5pdGVtLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXRlbSA9IG5leHRQcm9wcy5pdGVtO1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW0pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHsgZmxvYXQ6IFwibGVmdFwiIH07XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSkgcmV0dXJuICg8ZGl2IGlkPXt0aGlzLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3MuaXRlbVZhbHVlfSBzdHlsZT17c3R5bGV9Pnt0aGlzLml0ZW0udmFsdWV9PC9kaXY+KTtcclxuICAgICAgICByZXR1cm4gKDxpbnB1dCBpZD17dGhpcy5pbnB1dElkfSBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW1WYWx1ZX0gc3R5bGU9e3N0eWxlfSB0eXBlPVwidGV4dFwiIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkJsdXI9e3RoaXMuaGFuZGxlT25CbHVyfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBtYWluQ2xhc3NOYW1lKCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbn1cclxuXHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvbk11bHRpcGxlVGV4dCwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9ubXVsdGlwbGV0ZXh0LnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uUmFkaW9ncm91cE1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fcmFkaW9ncm91cFwiO1xyXG5pbXBvcnQge0l0ZW1WYWx1ZX0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uY29tbWVudFwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uUmFkaW9ncm91cCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBjaG9pY2VzQ2hhbmdlZDogMCB9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgPSBzZWxmLnN0YXRlLmNob2ljZXNDaGFuZ2VkICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsOyB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxmb3JtIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgIHt0aGlzLmdldEl0ZW1zKCkgfVxyXG4gICAgICAgICAgICA8L2Zvcm0+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRJdGVtcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJpdGVtXCIgKyBpO1xyXG4gICAgICAgICAgICBpdGVtcy5wdXNoKHRoaXMucmVuZGVySXRlbShrZXksIGl0ZW0sIGkgPT0gMCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHRleHRTdHlsZSgpOiBhbnkgeyByZXR1cm4geyBtYXJnaW5MZWZ0OiBcIjNweFwiIH07IH1cclxuICAgIHByaXZhdGUgcmVuZGVySXRlbShrZXk6IHN0cmluZywgaXRlbTogSXRlbVZhbHVlLCBpc0ZpcnN0OiBib29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBpdGVtV2lkdGggPSB0aGlzLnF1ZXN0aW9uLmNvbENvdW50ID4gMCA/ICgxMDAgLyB0aGlzLnF1ZXN0aW9uLmNvbENvdW50KSArIFwiJVwiIDogXCJcIjtcclxuICAgICAgICB2YXIgbWFyZ2luUmlnaHQgPSB0aGlzLnF1ZXN0aW9uLmNvbENvdW50ID09IDAgPyBcIjVweFwiIDogXCIwcHhcIjtcclxuICAgICAgICB2YXIgZGl2U3R5bGUgPSB7IG1hcmdpblJpZ2h0OiBtYXJnaW5SaWdodCB9O1xyXG4gICAgICAgIGlmIChpdGVtV2lkdGgpIHtcclxuICAgICAgICAgICAgZGl2U3R5bGVbXCJ3aWR0aFwiXSA9IGl0ZW1XaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGlzQ2hlY2tlZCA9IHRoaXMucXVlc3Rpb24udmFsdWUgPT0gaXRlbS52YWx1ZTtcclxuICAgICAgICB2YXIgb3RoZXJJdGVtID0gKGlzQ2hlY2tlZCAmJiBpdGVtLnZhbHVlID09PSB0aGlzLnF1ZXN0aW9uLm90aGVySXRlbS52YWx1ZSkgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlclJhZGlvKGtleSwgaXRlbSwgaXNDaGVja2VkLCBkaXZTdHlsZSwgb3RoZXJJdGVtLCBpc0ZpcnN0KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJSYWRpbyhrZXk6IHN0cmluZywgaXRlbTogSXRlbVZhbHVlLCBpc0NoZWNrZWQ6IGJvb2xlYW4sIGRpdlN0eWxlOiBhbnksIG90aGVySXRlbTogSlNYLkVsZW1lbnQsIGlzRmlyc3Q6IGJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGlkID0gaXNGaXJzdCA/IHRoaXMucXVlc3Rpb24uaW5wdXRJZCA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGtleT17a2V5fSBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19IHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtfT5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD17aWR9IHR5cGU9XCJyYWRpb1wiICBjaGVja2VkPXtpc0NoZWNrZWR9IHZhbHVlPXtpdGVtLnZhbHVlfSBkaXNhYmxlZD17dGhpcy5pc0Rpc3BsYXlNb2RlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17dGhpcy50ZXh0U3R5bGV9PntpdGVtLnRleHR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICB7b3RoZXJJdGVtfVxyXG4gICAgICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck90aGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5vdGhlcn0+PFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfS8+PC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvblJhZGlvZ3JvdXAsIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbnJhZGlvZ3JvdXAudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25UZXh0TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl90ZXh0XCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uVGV4dCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB8fCAnJyB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkJsdXIgPSB0aGlzLmhhbmRsZU9uQmx1ci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvblRleHRNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvblRleHRNb2RlbDsgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQmx1cihldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIHx8ICcnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGlzcGxheU1vZGUpXHJcbiAgICAgICAgICAgIHJldHVybiAoPGRpdiBpZD17dGhpcy5xdWVzdGlvbi5pbnB1dElkfSBjbGFzc05hbWU9e3RoaXMuY3NzfT57dGhpcy5xdWVzdGlvbi52YWx1ZX08L2Rpdj4pXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGlucHV0IGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3N9IHR5cGU9e3RoaXMucXVlc3Rpb24uaW5wdXRUeXBlfSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gc2l6ZT17dGhpcy5xdWVzdGlvbi5zaXplfSBvbkJsdXI9e3RoaXMuaGFuZGxlT25CbHVyfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uVGV4dCwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9udGV4dC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2UsIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcbmltcG9ydCB7SVN1cnZleUNyZWF0b3IsIFN1cnZleVF1ZXN0aW9uRXJyb3JzfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uXCI7XHJcbmltcG9ydCB7TWF0cml4RHluYW1pY1Jvd01vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fbWF0cml4ZHluYW1pY1wiO1xyXG5pbXBvcnQge01hdHJpeERyb3Bkb3duQ2VsbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHluYW1pYyBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbDsgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMobmV4dFByb3BzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydGllcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnN0YXRlID0geyByb3dDb3VudGVyOiAwIH07XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5yb3dDb3VudENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5yb3dDb3VudGVyID0gc2VsZi5zdGF0ZS5yb3dDb3VudGVyICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25Sb3dBZGRDbGljayA9IHRoaXMuaGFuZGxlT25Sb3dBZGRDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25Sb3dBZGRDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uYWRkUm93KCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24uY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5xdWVzdGlvbi5jb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJjb2x1bW5cIiArIGk7XHJcbiAgICAgICAgICAgIHZhciBtaW5XaWR0aCA9IHRoaXMucXVlc3Rpb24uZ2V0Q29sdW1uV2lkdGgoY29sdW1uKTtcclxuICAgICAgICAgICAgdmFyIGNvbHVtblN0eWxlID0gbWluV2lkdGggPyB7IG1pbldpZHRoOiBtaW5XaWR0aCB9IDoge307XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaCg8dGgga2V5PXtrZXl9IHN0eWxlPXtjb2x1bW5TdHlsZX0+e3RoaXMucXVlc3Rpb24uZ2V0Q29sdW1uVGl0bGUoY29sdW1uKSB9PC90aD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93cyA9IFtdO1xyXG4gICAgICAgIHZhciB2aXNpYmxlUm93cyA9IHRoaXMucXVlc3Rpb24udmlzaWJsZVJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcInJvd1wiICsgaTtcclxuICAgICAgICAgICAgcm93cy5wdXNoKDxTdXJ2ZXlRdWVzdGlvbk1hdHJpeER5bmFtaWNSb3cga2V5PXtrZXl9IHJvdz17cm93fSBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gaW5kZXg9e2l9IGNzcz17dGhpcy5jc3N9IHJvb3RDc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IC8+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRpdlN0eWxlID0gdGhpcy5xdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsID8geyBvdmVyZmxvd1g6ICdzY3JvbGwnIH0gOiB7fTtcclxuICAgICAgICB2YXIgYnRuRGVsZXRlVEQgPSAhdGhpcy5pc0Rpc3BsYXlNb2RlID8gPHRoPjwvdGg+IDogbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiAgc3R5bGU9e2RpdlN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoZWFkZXJzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtidG5EZWxldGVURH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBZGRSb3dCdXR0b24oKSB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQWRkUm93QnV0dG9uKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlNb2RlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17dGhpcy5jc3MuYnV0dG9ufSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVPblJvd0FkZENsaWNrfSB2YWx1ZT17dGhpcy5xdWVzdGlvbi5hZGRSb3dUZXh0fSAvPjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHluYW1pY1JvdyBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByaXZhdGUgcm93OiBNYXRyaXhEeW5hbWljUm93TW9kZWw7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uOiBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbDtcclxuICAgIHByaXZhdGUgaW5kZXg6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHByb3BzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnRpZXMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnJvdyA9IG5leHRQcm9wcy5yb3c7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmluZGV4ID0gbmV4dFByb3BzLmluZGV4O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IG5leHRQcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25Sb3dSZW1vdmVDbGljayA9IHRoaXMuaGFuZGxlT25Sb3dSZW1vdmVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25Sb3dSZW1vdmVDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24ucmVtb3ZlUm93KHRoaXMuaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucm93KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvdy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbCA9IHRoaXMucm93LmNlbGxzW2ldO1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JzID0gPFN1cnZleVF1ZXN0aW9uRXJyb3JzIHF1ZXN0aW9uPXtjZWxsLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSAvPjtcclxuICAgICAgICAgICAgdmFyIHNlbGVjdCA9IHRoaXMucmVuZGVyUXVlc3Rpb24oY2VsbCk7XHJcbiAgICAgICAgICAgIHRkcy5wdXNoKDx0ZCBrZXk9e1wicm93XCIgKyBpfT57ZXJyb3JzfXtzZWxlY3R9PC90ZD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuaXNEaXNwbGF5TW9kZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVtb3ZlQnV0dG9uID0gdGhpcy5yZW5kZXJCdXR0b24oKTtcclxuICAgICAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJyb3dcIiArIHRoaXMucm93LmNlbGxzLmxlbmd0aCArIDF9PntyZW1vdmVCdXR0b259PC90ZD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDx0cj57dGRzfTwvdHI+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJRdWVzdGlvbihjZWxsOiBNYXRyaXhEcm9wZG93bkNlbGwpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRvci5jcmVhdGVRdWVzdGlvbkVsZW1lbnQoY2VsbC5xdWVzdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQnV0dG9uKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17dGhpcy5jc3MuYnV0dG9ufSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5oYW5kbGVPblJvd1JlbW92ZUNsaWNrfSB2YWx1ZT17dGhpcy5xdWVzdGlvbi5yZW1vdmVSb3dUZXh0fSAvPjtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGR5bmFtaWNcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvbk1hdHJpeER5bmFtaWMsIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeGR5bmFtaWMudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmNvbW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvblJhdGluZ01vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fcmF0aW5nXCI7XHJcbmltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi4vYmFzZVwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uUmF0aW5nIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uUmF0aW5nTW9kZWwgeyByZXR1cm4gdGhpcy5xdWVzdGlvbkJhc2UgYXMgUXVlc3Rpb25SYXRpbmdNb2RlbDsgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdmFsdWVzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLnZpc2libGVSYXRlVmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBtaW5UZXh0ID0gaSA9PSAwID8gdGhpcy5xdWVzdGlvbi5taW5pbnVtUmF0ZURlc2NyaXB0aW9uICsgXCIgXCIgOiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgbWF4VGV4dCA9IGkgPT0gdGhpcy5xdWVzdGlvbi52aXNpYmxlUmF0ZVZhbHVlcy5sZW5ndGggLSAxID8gXCIgXCIgKyB0aGlzLnF1ZXN0aW9uLm1heGltdW1SYXRlRGVzY3JpcHRpb24gOiBudWxsO1xyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0aGlzLnJlbmRlckl0ZW0oXCJ2YWx1ZVwiICsgaSwgdGhpcy5xdWVzdGlvbi52aXNpYmxlUmF0ZVZhbHVlc1tpXSwgbWluVGV4dCwgbWF4VGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY29tbWVudCA9IHRoaXMucXVlc3Rpb24uaGFzT3RoZXIgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgIHt2YWx1ZXN9XHJcbiAgICAgICAgICAgICAgICB7Y29tbWVudH1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJJdGVtKGtleTogc3RyaW5nLCBpdGVtOiBJdGVtVmFsdWUsIG1pblRleHQ6IHN0cmluZywgbWF4VGV4dDogc3RyaW5nKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBpc0NoZWNrZWQgPSB0aGlzLnF1ZXN0aW9uLnZhbHVlID09IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMuY3NzLml0ZW07XHJcbiAgICAgICAgaWYgKGlzQ2hlY2tlZCkgY2xhc3NOYW1lICs9IFwiIGFjdGl2ZVwiO1xyXG4gICAgICAgIHZhciBtaW4gPSBtaW5UZXh0ID8gPHNwYW4+e21pblRleHR9PC9zcGFuPiA6IG51bGw7XHJcbiAgICAgICAgdmFyIG1heCA9IG1heFRleHQgPyA8c3Bhbj57bWF4VGV4dH08L3NwYW4+IDogbnVsbDtcclxuICAgICAgICByZXR1cm4gPGxhYmVsIGtleT17a2V5fSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBzdHlsZT17eyBkaXNwbGF5OiBcIm5vbmVcIiB9fSBuYW1lPXt0aGlzLnF1ZXN0aW9uLm5hbWV9IHZhbHVlPXtpdGVtLnZhbHVlfSBkaXNhYmxlZD17dGhpcy5pc0Rpc3BsYXlNb2RlfSBjaGVja2VkPXt0aGlzLnF1ZXN0aW9uLnZhbHVlID09IGl0ZW0udmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSAvPlxyXG4gICAgICAgICAgICB7bWlufVxyXG4gICAgICAgICAgICA8c3Bhbj57aXRlbS50ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAge21heH1cclxuICAgICAgICAgICAgPC9sYWJlbD47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyT3RoZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLm90aGVyfT48U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSAgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9Lz48L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvblJhdGluZywgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9ucmF0aW5nLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXl9IGZyb20gXCIuL3JlYWN0U3VydmV5XCI7XHJcbmltcG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi9zdXJ2ZXlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlXaW5kb3cgZXh0ZW5kcyBTdXJ2ZXkge1xyXG4gICAgcHJpdmF0ZSB0aXRsZTogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uRXhwYW5kZWQgPSB0aGlzLmhhbmRsZU9uRXhwYW5kZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uRXhwYW5kZWQoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmV4cGFuZGVkID0gIXRoaXMuc3RhdGUuZXhwYW5kZWQ7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnN0YXRlKTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaGlkZGVuKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaGVhZGVyID0gdGhpcy5yZW5kZXJIZWFkZXIoKTtcclxuICAgICAgICB2YXIgYm9keSA9IHRoaXMuc3RhdGUuZXhwYW5kZWQgPyB0aGlzLnJlbmRlckJvZHkoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHN0eWxlID0geyBwb3NpdGlvbjogXCJmaXhlZFwiLCBib3R0b206IFwiM3B4XCIsIHJpZ2h0OiBcIjEwcHhcIiB9O1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mud2luZG93LnJvb3R9IHN0eWxlPXtzdHlsZX0+XHJcbiAgICAgICAgICAgIHtoZWFkZXJ9XHJcbiAgICAgICAgICAgIHtib2R5fVxyXG4gICAgICAgICAgICA8L2Rpdj47XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySGVhZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGVBID0geyB3aWR0aDogXCIxMDAlXCIgfTtcclxuICAgICAgICB2YXIgc3R5bGVUaXRsZSA9IHsgcGFkZGluZ1JpZ2h0OiBcIjEwcHhcIiB9O1xyXG4gICAgICAgIHZhciBnbHlwaENsYXNzTmFtZSA9IHRoaXMuc3RhdGUuZXhwYW5kZWQgPyB0aGlzLmNzcy53aW5kb3cuaGVhZGVyLmJ1dHRvbkNvbGxhcHNlZCA6IHRoaXMuY3NzLndpbmRvdy5oZWFkZXIuYnV0dG9uRXhwYW5kZWQ7XHJcbiAgICAgICAgZ2x5cGhDbGFzc05hbWUgPSBcImdseXBoaWNvbiBwdWxsLXJpZ2h0IFwiICsgZ2x5cGhDbGFzc05hbWU7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy53aW5kb3cuaGVhZGVyLnJvb3R9PlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlT25FeHBhbmRlZH0gc3R5bGU9e3N0eWxlQX0+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e3RoaXMuY3NzLndpbmRvdy5oZWFkZXIudGl0bGV9IHN0eWxlPXtzdHlsZVRpdGxlfT57dGhpcy50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2dseXBoQ2xhc3NOYW1lfSBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L2Rpdj47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyQm9keSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3M9e3RoaXMuY3NzLndpbmRvdy5ib2R5fT5cclxuICAgICAgICB7dGhpcy5yZW5kZXJTdXJ2ZXkoKSB9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN1cnZleShuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlU3VydmV5KG5ld1Byb3BzKTtcclxuICAgICAgICB0aGlzLnRpdGxlID0gbmV3UHJvcHMudGl0bGUgPyBuZXdQcm9wcy50aXRsZSA6IHRoaXMuc3VydmV5LnRpdGxlO1xyXG4gICAgICAgIHZhciBoYXNFeHBhbmRlZCA9IG5ld1Byb3BzW1wiZXhwYW5kZWRcIl0gPyBuZXdQcm9wcy5leHBhbmRlZCA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGV4cGFuZGVkOiBoYXNFeHBhbmRlZCwgaGlkZGVuOiBmYWxzZSB9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZChmdW5jdGlvbiAoczogU3VydmV5TW9kZWwpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXlXaW5kb3cudHN4XG4gKiovIiwiaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZGFuaXNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZHV0Y2gnO1xyXG5pbXBvcnQgJy4uLy4uL2xvY2FsaXphdGlvbi9maW5uaXNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZnJlbmNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZ2VybWFuJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZ3JlZWsnO1xyXG5pbXBvcnQgJy4uLy4uL2xvY2FsaXphdGlvbi9wb2xpc2gnO1xyXG5pbXBvcnQgJy4uLy4uL2xvY2FsaXphdGlvbi9ydXNzaWFuJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vdHVya2lzaCc7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cmllcy9jaHVua3MvbG9jYWxpemF0aW9uLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIGRhbmlzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiVGlsYmFnZVwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIlZpZGVyZVwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIkbDpnJkaWdcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJTaWRlIHswfSBhZiB7MX1cIixcclxuICAgIGVtcHR5U3VydmV5OiBcIkRlciBlciBpbmdlbiBzeW5saWdlIHNww7hyZ3Ntw6VsLlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJNYW5nZSB0YWsgZm9yIGRpbiBiZXN2YXJlbHNlIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJTcMO4cmdlc2tlbWFldCBoZW50ZXMgZnJhIHNlcnZlcmVuLi4uXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIlZhbGdmcml0IHN2YXIuLi5cIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcIlbDpmxnLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIkJlc3ZhciB2ZW5saWdzdCBzcMO4cmdzbcOlbGV0LlwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIkFuZ2l2IGV0IHRhbC5cIixcclxuICAgIHRleHRNaW5MZW5ndGg6IFwiQW5naXYgbWluZHN0IHswfSB0ZWduLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiVsOmbGcgdmVubGlnc3QgbWluZHN0ICB7MH0gc3Zhcm11bGlnaGVkKGVyKS5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIlbDpmxnIHZlbmxpZ3N0IGbDpnJyZSB7MH0gc3Zhcm11bGlnaGVkZXIoZXIpLlwiLFxyXG4gICAgbnVtZXJpY01pbk1heDogXCInezB9JyBza2FsIHbDpnJlIGxpZyBtZWQgZWxsZXIgc3TDuHJyZSBlbmQgezF9IG9nIGxpZyBtZWQgZWxsZXIgbWluZHJlIGVuZCB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiJ3swfScgc2thbCB2w6ZyZSBsaWcgbWVkIGVsbGVyIHN0w7hycmUgZW5kIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCInezB9JyBza2FsIHbDpnJlIGxpZyBtZWQgZWxsZXIgbWluZHJlIGVuZCB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJBbmdpdiB2ZW5saWdzdCBlbiBneWxkaWcgZS1tYWlsIGFkcmVzc2UuXCIsXHJcbiAgICBleGNlZWRNYXhTaXplOiBcIkZpbHN0w7hycmVsc2VuIG3DpSBpa2tlIG92ZXJzdGlnZSB7MH0uXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiQW5naXYgZW4gdsOmcmRpIGZvciBkaXQgdmFsZ2ZyaWUgc3Zhci5cIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJkYVwiXSA9IGRhbmlzaFN1cnZleVN0cmluZ3M7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9kYW5pc2gudHNcbiAqKi8iLCIvL0NyZWF0ZWQgb24gYmVoYWxmIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmFuazEzXHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBkdXRjaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiVm9yaWdlXCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwiVm9sZ2VuZGVcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJBZnNsdWl0ZW5cIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwiQW5kZXJlXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiUGFnaW5hIHswfSB2YW4gezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJFciBpcyBnZWVuIHppY2h0YmFyZSBwYWdpbmEgb2YgdnJhYWcgaW4gZGV6ZSB2cmFnZW5saWpzdFwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJCZWRhbmt0IG9tIGRlemUgdnJhZ2VubGlqc3QgaW4gdGUgdnVsbGVuXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcIkRlIHZyYWdlbmxpanN0IGlzIGFhbiBoZXQgbGFkZW4uLi5cIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcIktpZXMuLi5cIixcclxuICAgIHJlcXVpcmVkRXJyb3I6IFwiR2VsaWV2ZSBlZW4gYW50d29vcmQgaW4gdGUgdnVsbGVuXCIsXHJcbiAgICBudW1lcmljRXJyb3I6IFwiSGV0IGFudHdvb3JkIG1vZXQgZWVuIGdldGFsIHppam5cIixcclxuICAgIHRleHRNaW5MZW5ndGg6IFwiR2VsaWV2ZSBtaW5zdGVuIHswfSBrYXJha3RlcnMgaW4gdGUgdnVsbGVuLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiR2VsaWV2ZSBtaW5pbXVtIHswfSBhbnR3b29yZGVuIHRlIHNlbGVjdGVyZW4uXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJHZWxpZXZlIG5pZXQgbWVlciBkYW4gezB9IGFudHdvb3JkZW4gdGUgc2VsZWN0ZXJlbi5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiVXcgYW50d29vcmQgJ3swfScgbW9ldCBncm90ZXIgb2YgZ2VsaWprIHppam4gYWFuIHsxfSBlbiBrbGVpbmVyIG9mIGdlbGlqayBhYW4gezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIlV3IGFudHdvb3JkICd7MH0nIG1vZXQgZ3JvdGVyIG9mIGdlbGlqayB6aWpuIGFhbiB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiVXcgYW50d29vcmQgJ3swfScgbW9ldCBncm90ZXIgb2YgZ2VsaWprIHppam4gYWFuIHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcIkdlbGlldmUgZWVuIGdlbGRpZyBlLW1haWxhZHJlcyBpbiB0ZSB2dWxsZW4uXCIsXHJcbiAgICBleGNlZWRNYXhTaXplOiBcIkRlIGdyb290dGUgdmFuIGhldCBiZXN0YW5kIG1hZyBuaWV0IGdyb3RlciB6aWpuIGRhbiB7MH0uXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiR2VsaWV2ZSBoZXQgdmVsZCAnQW5kZXJlJyBpbiB0ZSB2dWxsZW5cIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJubFwiXSA9IGR1dGNoU3VydmV5U3RyaW5ncztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2R1dGNoLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIGZpbm5pc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIkVkZWxsaW5lblwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIlNldXJhYXZhXCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiVmFsbWlzXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIk11dSAoa3V2YWlsZSlcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJTaXZ1IHswfS97MX1cIixcclxuICAgIGVtcHR5U3VydmV5OiBcIlTDpHNzw6Qga3lzZWx5c3PDpCBlaSBvbGUgeWh0w6Rrw6TDpG4gbsOka3l2aWxsw6Qgb2xldmFhIHNpdnVhIHRhaSBreXN5bXlzdMOkLlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJLaWl0b3Mga3lzZWx5eW4gdmFzdGFhbWlzZXN0YSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiS3lzZWx5w6QgbGFkYXRhYW4gcGFsdmVsaW1lbHRhLi4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJWYWxpdHNlLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIlZhc3RhYSBreXN5bXlrc2Vlbiwga2lpdG9zLlwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIkFydm9uIHR1bGVlIG9sbGEgbnVtZWVyaW5lbi5cIixcclxuICAgIHRleHRNaW5MZW5ndGg6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgdsOkaGludMOkw6RuIHswfSBtZXJra2nDpC5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIk9sZSBoeXbDpCBqYSB2YWxpdHNlIHbDpGhpbnTDpMOkbiB7MH0gdmFpaHRvZWh0b2EuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSBlbmludMOkw6RuIHswfSB2YWlodG9laHRvYS5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfSBqYSB2w6RoZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCInezB9JyB0w6R5dHl5IG9sbGEgZW5lbW3DpG4gdGFpIHlodMOkIHN1dXJpIGt1aW4gezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIid7MH0nIHTDpHl0eXkgb2xsYSB2w6RoZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcIlN5w7Z0w6QgdmFsaWRpIHPDpGhrw7Zwb3N0aW9zb2l0ZS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJPbGUgaHl2w6QgamEgc3nDtnTDpCBcXFwiTXV1IChrdXZhaWxlKVxcXCJcIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJmaVwiXSA9IGZpbm5pc2hTdXJ2ZXlTdHJpbmdzO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2NhbGl6YXRpb24vZmlubmlzaC50c1xuICoqLyIsIi8vQ3JlYXRlZCBvbiBiZWhhbGYgaHR0cHM6Ly9naXRodWIuY29tL0ZyYW5rMTNcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIGZyZW5jaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiUHJcXHUwMGU5Y1xcdTAwZTlkZW50XCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwiU3VpdmFudFwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIlRlcm1pbmVyXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIkF1dHJlIChwclxcdTAwZTljaXNlcilcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJQYWdlIHswfSBzdXIgezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJJbCBuJ3kgYSBuaSBwYWdlIHZpc2libGUgbmkgcXVlc3Rpb24gdmlzaWJsZSBkYW5zIGNlIHF1ZXN0aW9ubmFpcmVcIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiTWVyY2kgZCdhdm9pciByXFx1MDBlOXBvbmR1IGF1IHF1ZXN0aW9ubmFpcmUhXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcIkxlIHF1ZXN0aW9ubmFpcmUgZXN0IGVuIGNvdXJzIGRlIGNoYXJnZW1lbnQuLi5cIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcIkNob2lzaXNzZXouLi5cIixcclxuICAgIHJlcXVpcmVkRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBcXHUwMGUwIGNldHRlIHF1ZXN0aW9uIGVzdCBvYmxpZ2F0b2lyZS5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJMYSByXFx1MDBlOXBvbnNlIGRvaXQgXFx1MDBlYXRyZSB1biBub21icmUuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIk1lcmNpIGQnZW50cmVyIGF1IG1vaW5zIHswfSBzeW1ib2xlcy5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIk1lcmNpIGRlIHNcXHUwMGU5bGVjdGlvbm5lciBhdSBtb2lucyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIk1lcmNpIGRlIHNcXHUwMGU5bGVjdGlvbm5lciBhdSBwbHVzIHswfXJcXHUwMGU5cG9uc2VzLlwiLFxyXG4gICAgbnVtZXJpY01pbk1heDogXCJWb3RyZSByXFx1MDBlOXBvbnNlICd7MH0nIGRvaXQgXFx1MDBlYXRyZXN1cFxcdTAwZTlyaWV1cmUgb3UgXFx1MDBlOWdhbGUgXFx1MDBlMCB7MX0gZXQgaW5mXFx1MDBlOXJpZXVyZSBvdVxcdTAwZTlnYWxlIFxcdTAwZTAgezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIlZvdHJlIHJcXHUwMGU5cG9uc2UgJ3swfScgZG9pdCBcXHUwMGVhdHJlc3VwXFx1MDBlOXJpZXVyZSBvdSBcXHUwMGU5Z2FsZSBcXHUwMGUwIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCJWb3RyZSByXFx1MDBlOXBvbnNlICd7MH0nIGRvaXQgXFx1MDBlYXRyZWluZlxcdTAwZTlyaWV1cmUgb3UgXFx1MDBlOWdhbGUgXFx1MDBlMCB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJNZXJjaSBkJ2VudHJlciB1bmUgYWRyZXNzZSBtYWlsIHZhbGlkZS5cIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwiTGEgdGFpbGxlIGR1IGZpY2hpZXIgbmUgZG9pdCBwYXMgZXhjXFx1MDBlOWRlciB7MH0uXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiTWVyY2kgZGUgcHJcXHUwMGU5Y2lzZXIgbGUgY2hhbXAgJ0F1dHJlJy5cIlxyXG59O1xyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImZyXCJdID0gZnJlbmNoU3VydmV5U3RyaW5ncztcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2NhbGl6YXRpb24vZnJlbmNoLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIGdlcm1hblN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiWnVyw7xja1wiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIldlaXRlclwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIkZlcnRpZ1wiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIlNlaXRlIHswfSB2b24gezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJFcyBnaWJ0IGtlaW5lIHNpY2h0YmFyZSBGcmFnZS5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiVmllbGVuIERhbmsgZsO8ciBkYXMgQXVzZsO8bGxlbiBkZXMgRnJhZ2Vib2dlbnMhXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcIkRlciBGcmFnZWJvZ2VuIHdpcmQgdm9tIFNlcnZlciBnZWxhZGVuLi4uXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIkJlbnV0emVyZGVmaW5pZXJ0ZSBBbnR3b3J0Li4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJXw6RobGVuLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIkJpdHRlIGFudHdvcnRlbiBTaWUgYXVmIGRpZSBGcmFnZS5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJEZXIgV2VydCBzb2xsdGUgZWluZSBaYWhsIHNlaW4uXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIkJpdHRlIGdlYmVuIFNpZSBtaW5kZXN0ZW5zIHswfSBTeW1ib2xlLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiQml0dGUgd8OkaGxlbiBTaWUgbWluZGVzdGVucyB7MH0gVmFyaWFudGVuLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiQml0dGUgd8OkaGxlbiBTaWUgbmljaHQgbWVociBhbHMgezB9IFZhcmlhbnRlbi5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIgZ3LDtsOfZXIgc2VpbiBhbHMgezF9IHVuZCBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIgZ3LDtsOfZXIgc2VpbiBhbHMgezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGtsZWluZXIgYWxzIHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcIkJpdHRlIGdlYmVuIFNpZSBlaW5lIGfDvGx0aWdlIEVtYWlsLUFkcmVzc2UgZWluLlwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJEaWUgRGF0ZWlncsO2w59lIHNvbGwgbmljaHQgbWVociBhbHMgezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkJpdHRlIGdlYmVuIFNpZSBlaW5lbiBXZXJ0IGbDvHIgSWhyZSBiZW51dHplcmRlZmluaWVydGUgQW50d29ydCBlaW4uXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZGVcIl0gPSBnZXJtYW5TdXJ2ZXlTdHJpbmdzO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2NhbGl6YXRpb24vZ2VybWFuLnRzXG4gKiovIiwiLy9DcmVhdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9hZ2Vsb3NwYW5hZ2lvdGFraXNcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIGdyZWVrU3VydmV5U3RyaW5ncyA9IHtcclxuICAgIHBhZ2VQcmV2VGV4dDogXCLOoM+Bzr/Ot86zzr/Pjc68zrXOvc6/XCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwizpXPgM+MzrzOtc69zr9cIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCLOn867zr/Ous67zq7Pgc+Jz4POt1wiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCLOhs67zrvOvyAoz4DOsc+BzrHOus6xzrvPjiDOtM65zrXPhc66z4HOuc69zq/Pg8+EzrUpXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwizqPOtc67zq/OtM6xIHswfSDOsc+Az4wgezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCLOlM61zr0gz4XPgM6sz4HPh861zrkgzrrOsc68zq/OsSDOv8+BzrHPhM6uIM+DzrXOu86vzrTOsSDOriDOv8+BzrHPhM6uIM61z4HPjs+EzrfPg863IM+DzrUgzrHPhc+Ez4wgz4TOvyDOtc+Bz4nPhM63zrzOsc+Ezr/Ou8+MzrPOuc6/LlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCLOlc+Fz4fOsc+BzrnPg8+Ezr/Pjc68zrUgzrPOuc6xIM+EzrfOvSDPg8+FzrzPgM67zq7Pgc+Jz4POtyDOsc+Fz4TOv8+FIM+Ezr/PhSDOtc+Bz4nPhM63zrzOsc+Ezr/Ou86/zrPOr86/z4UhXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcIs6kzr8gzrXPgc+Jz4TOt868zrHPhM6/zrvPjM6zzrnOvyDPhs6/z4HPhM+Ozr3Otc+EzrHOuSDOsc+Azr8gz4TOvyDOtM65zrHOus6/zrzOuc+Dz4TOri4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwizpXPgM65zrvOrc6+z4TOtS4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCLOoM6xz4HOsc66zrHOu8+OIM6xz4DOsc69z4TOrs+Dz4TOtSDPg8+EzrfOvSDOtc+Bz47PhM63z4POty5cIixcclxuICAgIHJlcXVpcmVkSW5BbGxSb3dzRXJyb3I6IFwizqDOsc+BzrHOus6xzrvPjiDOsc+AzrHOvc+Ezq7Pg8+EzrUgz4PPhM65z4IgzrXPgc+Jz4TOrs+DzrXOuc+CIM+DzrUgz4zOu861z4Igz4TOuc+CIM6zz4HOsc68zrzOrc+CLlwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIs6XIM+EzrnOvM6uIM+Az4HOrc+AzrXOuSDOvc6xIM61zq/Ovc6xzrkgzrHPgc65zrjOvM65z4TOuc66zq4uXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIs6gzrHPgc6xzrrOsc67z44gz4PPhc68z4DOu863z4HPjs+Dz4TOtSDPhM6/z4XOu86sz4fOuc+Dz4TOv869IHswfSDPg8+NzrzOss6/zrvOsS5cIixcclxuICAgIG1pblJvd0NvdW50RXJyb3I6IFwizqDOsc+BzrHOus6xzrvPjiDPg8+FzrzPgM67zrfPgc+Oz4PPhM61IM+Ezr/Phc67zqzPh865z4PPhM6/zr0gezB9IM6zz4HOsc68zrzOrc+CLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwizqDOsc+BzrHOus6xzrvPjiDOtc+AzrnOu86tzr7PhM61IM+Ezr/Phc67zqzPh865z4PPhM6/zr0gezB9IM+AzrHPgc6xzrvOu86xzrPOrc+CLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwizqDOsc+BzrHOus6xzrvPjiDOtc+AzrnOu86tzr7PhM61IM+Mz4fOuSDPgM6xz4HOsc+AzqzOvc+JIM6xz4DOvyB7MH0gz4DOsc+BzrHOu867zrHOs86tz4IuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIs6kzr8gJ3swfScgzrjOsSDPgM+Bzq3PgM61zrkgzr3OsSDOtc6vzr3Osc65IM6vz4POvyDOriDOvM61zrPOsc67z43PhM61z4HOvyDOsc+Azr8gz4TOvyB7MX0gzrrOsc65IM6vz4POvyDOriDOvM65zrrPgc+Mz4TOtc+Bzr8gzrHPgM6/IM+Ezr8gezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIs6kzr8gJ3swfScgz4DPgc6tz4DOtc65IM69zrEgzrXOr869zrHOuSDOvM61zrPOsc67z43PhM61z4HOvyDOriDOuc+Dzr8gzrzOtSDPhM6/IHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCLOpM6/ICd7MH0nIM+Az4HOrc+AzrXOuSDOvc6xIM61zq/Ovc6xzrkgzrzOuc66z4HPjM+EzrXPgc6/IM6uIM6vz4POvyDOsc+Azr8gz4TOvyB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCLOoM6xz4HOsc66zrHOu8+OIM60z47Pg8+EzrUgzrzOuc6xIM6xz4DOv860zrXOus+Ezq4gzrTOuc61z43OuM+Fzr3Pg863IGUtbWFpbC5cIixcclxuICAgIHVybFJlcXVlc3RFcnJvcjogXCLOlyDOsc6vz4TOt8+DzrcgzrXPgM6tz4PPhM+BzrXPiM61IM+Dz4bOrM67zrzOsSAnezB9Jy4gezF9XCIsXHJcbiAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwizpcgzrHOr8+EzrfPg863IM61z4DOrc+Dz4TPgc61z4jOtSDOus61zr3OrCDOtM61zrTOv868zq3Ovc6xIM6uIM63IM65zrTPjM+EzrfPhM6xICfOvM6/zr3Ov8+AzqzPhM65L3BhdGgnIM61zq/Ovc6xzrkgzrXPg8+GzrHOu86tzrzOrc69zrdcIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwizqTOvyDOvM6tzrPOtc64zr/PgiDOtM61zr0gzrzPgM6/z4HOtc6vIM69zrEgz4XPgM61z4HOss6tzr3Otc65IM+EzrEgezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gz4PPhc68z4DOu863z4HPjs+Dz4TOtSDPhM63zr0gz4TOuc68zq4gzrPOuc6xIM+Ezr8gz4DOtc60zq/OvyAnzqzOu867zr8nLlwiLFxyXG4gICAgdXBsb2FkaW5nRmlsZTogXCLOpM6/IM6xz4HPh861zq/OvyDPg86xz4IgzrHOvc61zrLOsc6vzr3Otc65LiDOoM6xz4HOsc66zrHOu8+OIM+AzrXPgc65zrzOrc69zrXPhM61IM66zrHPgM6/zrnOsSDOtM61z4XPhM61z4HPjM67zrXPgM+EzrEgzrrOsc65IM60zr/Ous65zrzOrM+Dz4TOtSDOvs6xzr3OrC5cIixcclxuICAgIGFkZFJvdzogXCLOoM+Bzr/Pg864zq7Ous63IM6zz4HOsc68zrzOrs+CXCIsXHJcbiAgICByZW1vdmVSb3c6IFwizpHPhs6xzq/Pgc61z4POt1wiXHJcbn07XHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZ3JcIl0gPSBncmVla1N1cnZleVN0cmluZ3M7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2dyZWVrLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIHBvbGlzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiV3N0ZWN6XCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwiRGFsZWpcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJHb3Rvd2VcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJTdHJvbmEgezB9IHogezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJOaWUgbWEgd2lkb2N6bnljaCBweXRhxYQuXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIkR6acSZa3VqZW15IHphIHd5cGXFgm5pZW5pZSBhbmtpZXR5IVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJUcndhIHdjenl0eXdhbmllIGFua2lldHkuLi5cIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwiSW5uYSBvZHBvd2llZMW6Li4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJXeWJpZXJ6Li4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIlByb3N6xJkgb2Rwb3dpZWR6aWXEhyBuYSB0byBweXRhbmllLlwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIlcgdHltIHBvbHUgbW/FvG5hIHdwaXNhxIcgdHlsa28gbGljemJ5LlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJQcm9zesSZIHdwaXNhxIcgY28gbmFqbW5pZWogezB9IHpuYWvDs3cuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJQcm9zesSZIHd5YnJhxIcgY28gbmFqbW5pZWogezB9IHBvenljamkuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJQcm9zesSZIHd5YnJhxIcgbmllIHdpxJljZWogbmnFvCB7MH0gcG96eWNqaS5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiT2Rwb3dpZWTFuiAnezB9JyBwb3dpbm5hIGJ5xIcgd2nEmWtzemEgbHViIHLDs3duYSB7MX0gb3JheiBtbmllanN6YSBsdWIgcsOzd25hIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCJPZHBvd2llZMW6ICd7MH0nIHBvd2lubmEgYnnEhyB3acSZa3N6YSBsdWIgcsOzd25hIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCJPZHBvd2llZMW6ICd7MH0nIHBvd2lubmEgYnnEhyBtbmllanN6YSBsdWIgcsOzd25hIHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcIlByb3N6xJkgcG9kYcSHIHByYXdpZMWCb3d5IGFkcmVzIGVtYWlsLlwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJSb3ptaWFyIHByemVzxYJhbmVnbyBwbGlrdSBuaWUgbW/FvGUgcHJ6ZWtyYWN6YcSHIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJQcm9zesSZIHBvZGHEhyBpbm7EhSBvZHBvd2llZMW6LlwiXHJcbn07XHJcblxyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcInBsXCJdID0gcG9saXNoU3VydmV5U3RyaW5ncztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL3BvbGlzaC50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBydXNzaWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgIHBhZ2VQcmV2VGV4dDogXCLQndCw0LfQsNC0XCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwi0JTQsNC70LXQtVwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcItCT0L7RgtC+0LLQvlwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcItCh0YLRgNCw0L3QuNGG0LAgezB9INC40LcgezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCLQndC10YIg0L3QuCDQvtC00L3QvtCz0L4g0LLQvtC/0YDQvtGB0LAuXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcItCR0LvQsNCz0L7QtNCw0YDQuNC8INCS0LDRgSDQt9CwINC30LDQv9C+0LvQvdC10L3QuNC1INCw0L3QutC10YLRiyFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwi0JfQsNCz0YDRg9C30LrQsCDRgSDRgdC10YDQstC10YDQsC4uLlwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCLQlNGA0YPQs9C+0LUgKNC/0L7QttCw0LvRg9C50YHRgtCwLCDQvtC/0LjRiNC40YLQtSlcIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcItCS0YvQsdGA0LDRgtGMLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQvtGC0LLQtdGC0YzRgtC1INC90LAg0LLQvtC/0YDQvtGBLlwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcItCe0YLQstC10YIg0LTQvtC70LbQtdC9INCx0YvRgtGMINGH0LjRgdC70L7QvC5cIixcclxuICAgIHRleHRNaW5MZW5ndGg6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INGF0L7RgtGPINCx0YsgezB9INGB0LjQvNCy0L7Qu9C+0LIuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0LLRi9Cx0LXRgNC40YLQtSDRhdC+0YLRjyDQsdGLIHswfSDQstCw0YDQuNCw0L3RgtC+0LIuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0LLRi9Cx0LXRgNC40YLQtSDQvdC1INCx0L7Qu9C10LUgezB9INCy0LDRgNC40LDQvdGC0L7Qsi5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9LCDQuCDRgNCw0LLQvdGL0Lwg0LjQu9C4INC80LXQvdGM0YjQtSwg0YfQtdC8IHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCInezB9JyDQtNC+0LvQttC90L4g0LHRi9GC0Ywg0YDQsNCy0L3Ri9C8INC40LvQuCDQsdC+0LvRjNGI0LUsINGH0LXQvCB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LzQtdC90YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC00LXQudGB0YLQstC40YLQtdC70YzQvdGL0Lkg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YsuXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC00LDQvdC90YvQtSDQsiDQv9C+0LvQtSBcXFwi0JTRgNGD0LPQvtC1XFxcIlwiXHJcbn07XHJcblxyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcInJ1XCJdID0gcnVzc2lhblN1cnZleVN0cmluZ3M7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL3J1c3NpYW4udHNcbiAqKi8iLCJpbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCB2YXIgdHVya2lzaFN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcIkdlcmlcIixcclxuICAgICAgICBwYWdlTmV4dFRleHQ6IFwixLBsZXJpXCIsXHJcbiAgICAgICAgY29tcGxldGVUZXh0OiBcIkFua2V0aSBUYW1hbWxhXCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJEacSfZXIgKGHDp8Sxa2xhecSxbsSxeilcIixcclxuICAgICAgICBwcm9ncmVzc1RleHQ6IFwiU2F5ZmEgezB9IC8gezF9XCIsXHJcbiAgICAgICAgZW1wdHlTdXJ2ZXk6IFwiQW5rZXR0ZSBnw7Zyw7xudMO8bGVuZWNlayBzYXlmYSB5YSBkYSBzb3J1IG1ldmN1dCBkZcSfaWwuXCIsXHJcbiAgICAgICAgY29tcGxldGluZ1N1cnZleTogXCJBbmtldGltaXppIHRhbWFtbGFkxLHEn8SxbsSxeiBpw6dpbiB0ZcWfZWtrw7xyIGVkZXJpei5cIixcclxuICAgICAgICBsb2FkaW5nU3VydmV5OiBcIkFua2V0IHN1bnVjdWRhbiB5w7xrbGVuaXlvciAuLi5cIixcclxuICAgICAgICBvcHRpb25zQ2FwdGlvbjogXCJTZcOnaW5peiAuLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIkzDvHRmZW4gc29ydXlhIGNldmFwIHZlcmluaXpcIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiR2lyaWxlbiBkZcSfZXIgbnVtZXJpayBvbG1hbMSxZMSxclwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiRW4gYXogezB9IHNlbWJvbCBnaXJpbml6LlwiLFxyXG4gICAgICAgIG1pblJvd0NvdW50RXJyb3I6IFwiTMO8dGZlbiBlbiBheiB7MH0gc2F0xLFyxLEgZG9sZHVydW4uXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiTMO8dGZlbiBlbiBheiB7MH0gc2XDp2VuZcSfaSBzZcOnaW5pei5cIixcclxuICAgICAgICBtYXhTZWxlY3RFcnJvcjogXCJMw7x0ZmVuIHswfSBhZGV0dGVuIGZhemxhIHNlw6dtZXlpbml6LlwiLFxyXG4gICAgICAgIG51bWVyaWNNaW5NYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9IGFuZCBlcXVhbCBvciBsZXNzIHRoYW4gezJ9XCIsXHJcbiAgICAgICAgbnVtZXJpY01pbjogXCInezB9JyBkZcSfZXJpIHsxfSBkZcSfZXJpbmUgZcWfaXQgdmV5YSBiw7x5w7xrIG9sbWFsxLFkxLFyXCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyBkZcSfZXJpIHsxfSBkZcSfZXJpbmUgZcWfaXQgeWEgZGEga8O8w6fDvGsgb2xtYWzEsWTEsXIuXCIsXHJcbiAgICAgICAgaW52YWxpZEVtYWlsOiBcIkzDvHRmZW4gZ2XDp2VybGkgYmlyIGVwb3N0YSBhZHJlc2kgZ2lyaW5pei5cIixcclxuICAgICAgICB1cmxSZXF1ZXN0RXJyb3I6IFwiVGFsZWJpIMWfdSBoYXRhecSxIGTDtm5kw7wgJ3swfScuIHsxfVwiLFxyXG4gICAgICAgIHVybEdldENob2ljZXNFcnJvcjogXCJUYWxlcCBoZXJoYW5naSBiaXIgdmVyaSBkw7ZubWVkaSB5YSBkYSAncGF0aCcgw7Z6ZWxsacSfaSBoYXRhbMSxLlwiLFxyXG4gICAgICAgIGV4Y2VlZE1heFNpemU6IFwiRG9zeWEgYm95dXR1IHswfSBkZcSfZXJpbmkgZ2XDp2VtZXouXCIsXHJcbiAgICAgICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkzDvHRmZW4gZGnEn2VyIGRlxJ9lcmxlcmkgZ2lyaW5pei5cIixcclxuICAgICAgICB1cGxvYWRpbmdGaWxlOiBcIkRvc3lhbsSxeiB5w7xrbGVuaXlvci4gTMOcdGZlbiBiaXJrYcOnIHNhbml5ZSBiZWtsZXlpbiB2ZSB0ZWtyYXIgZGVuZXlpbi5cIixcclxuICAgICAgICBhZGRSb3c6IFwiU2F0xLFyIEVrbGVcIixcclxuICAgICAgICByZW1vdmVSb3c6IFwiS2FsZMSxclwiXHJcbn07XHJcblxyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcInRyXCJdID0gdHVya2lzaFN1cnZleVN0cmluZ3M7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL3R1cmtpc2gudHNcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9