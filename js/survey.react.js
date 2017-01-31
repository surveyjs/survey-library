/*!
* surveyjs - Survey JavaScript library v0.10.4
* (c) Devsoft Baltic O� - http://surveyjs.io/
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
	    function TextValidator(minLength, maxLength) {
	        if (minLength === void 0) {
	            minLength = 0;
	        }
	        if (maxLength === void 0) {
	            maxLength = 0;
	        }
	        _super.call(this);
	        this.minLength = minLength;
	        this.maxLength = maxLength;
	    }
	    TextValidator.prototype.getType = function () {
	        return "textvalidator";
	    };
	    TextValidator.prototype.validate = function (value, name) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (this.minLength > 0 && value.length < this.minLength) {
	            return new ValidatorResult(null, new _error.CustomError(this.getErrorText(name)));
	        }
	        if (this.maxLength > 0 && value.length > this.maxLength) {
	            return new ValidatorResult(null, new _error.CustomError(this.getErrorText(name)));
	        }
	        return null;
	    };
	    TextValidator.prototype.getDefaultErrorText = function (name) {
	        if (this.minLength > 0 && this.maxLength > 0) return _surveyStrings.surveyLocalization.getString("textMinMaxLength")["format"](this.minLength, this.maxLength);
	        if (this.minLength > 0) return _surveyStrings.surveyLocalization.getString("textMinLength")["format"](this.minLength);
	        return _surveyStrings.surveyLocalization.getString("textMaxLength")["format"](this.maxLength);
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
	_jsonobject.JsonObject.metaData.addClass("textvalidator", ["minLength:number", "maxLength:number"], function () {
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
	    emptySurvey: "There is no visible page or question in the survey.",
	    completingSurvey: "Thank you for completing the survey!",
	    loadingSurvey: "Survey is loading...",
	    optionsCaption: "Choose...",
	    requiredError: "Please answer the question.",
	    requiredInAllRowsError: "Please answer questions in all rows.",
	    numericError: "The value should be numeric.",
	    textMinLength: "Please enter at least {0} symbols.",
	    textMaxLength: "Please enter less than {0} symbols.",
	    textMinMaxLength: "Please enter more than {0} and less than {1} symbols.",
	    minRowCountError: "Please fill in at least {0} rows.",
	    minSelectError: "Please select at least {0} variants.",
	    maxSelectError: "Please select no more than {0} variants.",
	    numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
	    numericMin: "The '{0}' should be equal or more than {1}",
	    numericMax: "The '{0}' should be equal or less than {1}",
	    invalidEmail: "Please enter a valid e-mail address.",
	    urlRequestError: "The request returned error '{0}'. {1}",
	    urlGetChoicesError: "The request returned empty data or the 'path' property is incorrect",
	    exceedMaxSize: "The file size should not exceed {0}.",
	    otherRequiredError: "Please enter the other value.",
	    uploadingFile: "Your file is uploading. Please wait several seconds and try again.",
	    addRow: "Add row",
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
	        this.idValue = MatrixDropdownRowModelBase.getId();
	        this.buildCells();
	    }
	    MatrixDropdownRowModelBase.getId = function () {
	        return "srow_" + MatrixDropdownRowModelBase.idCounter++;
	    };
	    Object.defineProperty(MatrixDropdownRowModelBase.prototype, "id", {
	        get: function get() {
	            return this.idValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	    MatrixDropdownRowModelBase.idCounter = 1;
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
	    QuestionMatrixDropdownModelBase.prototype.onBeforeValueChanged = function (val) {};
	    QuestionMatrixDropdownModelBase.prototype.onValueChanged = function () {
	        if (this.isRowChanging) return;
	        this.onBeforeValueChanged(this.value);
	        if (!this.generatedVisibleRows || this.generatedVisibleRows.length == 0) return;
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
	    QuestionMatrixDynamicModel.prototype.onBeforeValueChanged = function (val) {
	        var newRowCount = val && Array.isArray(val) ? val.length : 0;
	        if (newRowCount <= this.rowCount) return;
	        this.rowCountValue = newRowCount;
	        if (this.generatedVisibleRows) {
	            this.generatedVisibleRows = this.visibleRows;
	        }
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
	_jsonobject.JsonObject.metaData.addClass("multipletextitem", ["name", "placeHolder", { name: "title", onGetValue: function onGetValue(obj) {
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
	        this.navigationButtonsVisibility = "inherit";
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
	_jsonobject.JsonObject.metaData.addClass("page", ["name", { name: "navigationButtonsVisibility", default: "inherit", choices: ["iherit", "show", "hide"] }, { name: "questions", baseClassName: "question" }, { name: "visible:boolean", default: true }, "visibleIf", "title"], function () {
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
	_jsonobject.JsonObject.metaData.addClass("comment", [{ name: "cols:number", default: 50 }, { name: "rows:number", default: 4 }, "placeHolder"], function () {
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
	_jsonobject.JsonObject.metaData.addClass("text", [{ name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"] }, { name: "size:number", default: 25 }, "placeHolder"], function () {
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
	        this.focusFirstQuestionAutomatic = true;
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
	        this.onPartialSend = new _base.Event();
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
	    Object.defineProperty(SurveyModel.prototype, "processedTitle", {
	        get: function get() {
	            return this.processText(this.title);
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	    Object.defineProperty(SurveyModel.prototype, "isNavigationButtonsShowing", {
	        get: function get() {
	            if (this.isDesignMode) return false;
	            var page = this.currentPage;
	            if (!page) return false;
	            return page.navigationButtonsVisibility == "show" || page.navigationButtonsVisibility != "hide" && this.showNavigationButtons;
	        },
	        enumerable: true,
	        configurable: true
	    });
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
	        if (this.sendResultOnPageNext) {
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
	        if (!this.isEditMode) return;
	        if (isPartialCompleted && this.onPartialSend) {
	            this.onPartialSend.fire(this, null);
	        }
	        if (!this.surveyPostId && postId) {
	            this.surveyPostId = postId;
	        }
	        if (!this.surveyPostId) return;
	        if (clientId) {
	            this.clientId = clientId;
	        }
	        if (isPartialCompleted && !this.clientId) return;
	        var self = this;
	        new _dxSurveyService.dxSurveyService().sendResult(this.surveyPostId, this.data, function (success, response) {
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
	            if (questions[i].hasInput && !this.getValue(questions[i].name)) return;
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
	    } }, "title", { name: "focusFirstQuestionAutomatic:boolean", default: true }, "completedHtml:html", { name: "pages", className: "page" }, { name: "questions", baseClassName: "question", onGetValue: function onGetValue(obj) {
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
	            if (this.survey.focusFirstQuestionAutomatic) {
	                this.survey.focusFirstQuestion();
	            }
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
	        return React.createElement("div", { className: this.css.header }, React.createElement("h3", null, this.survey.processedTitle));
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
	        this.survey.onPartialSend.add(function (sender) {
	            self.setState(self.state);
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
	        if (newProps.onPartialSend) {
	            this.survey.onPartialSend.add(function (sender) {
	                newProps.onPartialSend(sender);
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
	        return React.createElement("textarea", { id: this.question.inputId, className: this.css, type: "text", value: this.state.value, placeholder: this.question.placeHolder, onBlur: this.handleOnBlur, onChange: this.handleOnChange, cols: this.question.cols, rows: this.question.rows });
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

	/* WEBPACK VAR INJECTION */(function(__extends) {'use strict';
	
	exports.__esModule = true;
	exports.SurveyQuestionElementBase = exports.SurveyElementBase = undefined;
	
	var _react = __webpack_require__(38);
	
	var React = _interopRequireWildcard(_react);
	
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
	        if (!this.survey || !this.survey.isNavigationButtonsShowing) return null;
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
	            rows.push(React.createElement(SurveyQuestionMatrixDropdownRow, { key: row.id, row: row, css: this.css, rootCss: this.rootCss, isDisplayMode: this.isDisplayMode, creator: this.creator }));
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
	        return React.createElement("input", { id: this.inputId, className: this.css.itemValue, style: style, type: "text", value: this.state.value, placeholder: this.item.placeHolder, onBlur: this.handleOnBlur, onChange: this.handleOnChange });
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
	        return React.createElement("input", { id: this.question.inputId, className: this.css, type: this.question.inputType, value: this.state.value, size: this.question.size, placeholder: this.question.placeHolder, onBlur: this.handleOnBlur, onChange: this.handleOnChange });
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
	            rows.push(React.createElement(SurveyQuestionMatrixDynamicRow, { key: row.id, row: row, question: this.question, index: i, css: this.css, rootCss: this.rootCss, isDisplayMode: this.isDisplayMode, creator: this.creator }));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxZTdiNDYxZjMwZDcyMzYzYWYzNiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9yZWFjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9jaHVua3MvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVN0cmluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzb25vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nob2ljZXNSZXN0ZnVsbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9uc1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9uUHJvY2Vzc1ZhbHVlLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHRQcmVQcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fbWF0cml4ZHJvcGRvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX21hdHJpeGR5bmFtaWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX21hdHJpeC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwid2VicGFjazovLy8uL3NyYy9wYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbl9jaGVja2JveC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fY29tbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fZHJvcGRvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2ZpbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2h0bWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX3JhdGluZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fdGV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5LnRzIiwid2VicGFjazovLy8uL3NyYy9keFN1cnZleVNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyaWdnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVdpbmRvdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmYXVsdENzcy9jc3NzdGFuZGFyZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmYXVsdENzcy9jc3Nib290c3RyYXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0U3VydmV5LnRzeCIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiUmVhY3RcIixcImNvbW1vbmpzMlwiOlwicmVhY3RcIixcImNvbW1vbmpzXCI6XCJyZWFjdFwiLFwiYW1kXCI6XCJyZWFjdFwifSIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RzdXJ2ZXltb2RlbC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cGFnZS50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb24udHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25lbGVtZW50LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnkudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb24udHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb25CYXNlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RTdXJ2ZXlQcm9ncmVzcy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25jaGVja2JveC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25kcm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXhkcm9wZG93bi50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXgudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uaHRtbC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25maWxlLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbm11bHRpcGxldGV4dC50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25yYWRpb2dyb3VwLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbnRleHQudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4ZHluYW1pYy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25yYXRpbmcudHN4Iiwid2VicGFjazovLy8uL3NyYy9yZWFjdC9yZWFjdFN1cnZleVdpbmRvdy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudHJpZXMvY2h1bmtzL2xvY2FsaXphdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2RhbmlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2R1dGNoLnRzIiwid2VicGFjazovLy8uL3NyYy9sb2NhbGl6YXRpb24vZmlubmlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2ZyZW5jaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2dlcm1hbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2dyZWVrLnRzIiwid2VicGFjazovLy8uL3NyYy9sb2NhbGl6YXRpb24vcG9saXNoLnRzIiwid2VicGFjazovLy8uL3NyYy9sb2NhbGl6YXRpb24vcnVzc2lhbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL3R1cmtpc2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7OztBQ3JDK0I7Ozs7Ozs7Ozs7Ozs7Ozt5QkFRL0I7Ozs7Ozs7OzswQkFHQTs7Ozs7Ozs7O3lCQUNBOzs7Ozs7Ozs7OEJBQ0E7Ozs7Ozs4QkFDQTs7Ozs7Ozs7O3VDQUNBOzs7Ozs7Ozs7bUNBQ0E7Ozs7Ozs7Ozt1QkFBa0I7Ozs7Ozt1QkFDbEI7Ozs7Ozs7OzsyQkFBc0I7Ozs7OzsyQkFDdEI7Ozs7Ozs7OztrQ0FBeUI7Ozs7OztrQ0FDekI7Ozs7Ozs7OztrQ0FBaUM7Ozs7OztrQ0FDakM7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QjtBQUNYLG1CQUFRO0FBQ1IsbUJBQVM7QUFDVCxtQkFBa0I7QUFDakIsb0JBQXVCO0FBQ3hCLG1CQUFtQjtBQUNwQixrQkFBeUQ7QUFDcEQsdUJBQW1EO0FBQ3RELG9CQUFrQztBQUNqQyxxQkFBZTtBQUNoQixvQkFBK0I7QUFDaEMsbUJBQW1DO0FBQ2xDLG9CQUE2QjtBQUMxQix1QkFBcUM7QUFDdkMscUJBQXNDO0FBQ3RDLHFCQUF3QztBQUN6QyxvQkFBeUU7QUFDNUUsaUJBQXVEO0FBQ3ZELGlCQUF5RDtBQUN2RCxtQkFBNkM7QUFDMUMsc0JBQXFDO0FBQ2xDLHlCQUFpRTtBQUN0RSxvQkFBc0M7QUFDakMseUJBQW1DO0FBQ3hDLG9CQUF5RTtBQUNoRixhQUFjO0FBQ1gsZ0JBQ2Y7QUEzQmdDO0FBNkJoQixtQ0FBUSxRQUFNLFFBQXdCLHFCIiwiZmlsZSI6InN1cnZleS5yZWFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiU3VydmV5XCIsIFtcInJlYWN0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN1cnZleVwiXSA9IGZhY3RvcnkocmVxdWlyZShcInJlYWN0XCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTdXJ2ZXlcIl0gPSBmYWN0b3J5KHJvb3RbXCJSZWFjdFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzM4X18pIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDFlN2I0NjFmMzBkNzIzNjNhZjM2XG4gKiovIiwiLy8gbW9kZWxcclxuZXhwb3J0ICogZnJvbSBcIi4vY2h1bmtzL21vZGVsXCI7XHJcblxyXG4vLyBsb2NhbGl6YXRpb25cclxuaW1wb3J0ICcuL2NodW5rcy9sb2NhbGl6YXRpb24nO1xyXG5cclxuLy8gY3NzIHN0YW5kYXJkXHJcbmV4cG9ydCB7ZGVmYXVsdFN0YW5kYXJkQ3NzfSBmcm9tIFwiLi4vZGVmYXVsdENzcy9jc3NzdGFuZGFyZFwiO1xyXG4vLyBjc3MgYm9vdHN0cmFwXHJcbmV4cG9ydCB7ZGVmYXVsdEJvb3RzdHJhcENzc30gZnJvbSBcIi4uL2RlZmF1bHRDc3MvY3NzYm9vdHN0cmFwXCI7XHJcblxyXG4vLyByZWFjdFxyXG5leHBvcnQge1N1cnZleX0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5XCI7XHJcbmV4cG9ydCB7UmVhY3RTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0c3VydmV5bW9kZWxcIjsgLy8gVE9ETyBuZWVkIHRvIHJlbW92ZSBzb21lZGF5XHJcbmV4cG9ydCB7UmVhY3RTdXJ2ZXlNb2RlbCBhcyBNb2RlbH0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0c3VydmV5bW9kZWxcIjtcclxuZXhwb3J0IHtTdXJ2ZXlOYXZpZ2F0aW9uQmFzZX0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbkJhc2VcIjtcclxuZXhwb3J0IHtTdXJ2ZXlOYXZpZ2F0aW9ufSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RTdXJ2ZXlOYXZpZ2F0aW9uXCI7XHJcbmV4cG9ydCB7U3VydmV5UGFnZSwgU3VydmV5Um93fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RwYWdlXCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb24sIFN1cnZleVF1ZXN0aW9uRXJyb3JzfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvblwiO1xyXG5leHBvcnQge1N1cnZleUVsZW1lbnRCYXNlLCBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtLCBTdXJ2ZXlRdWVzdGlvbkNvbW1lbnR9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudFwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uQ2hlY2tib3gsIFN1cnZleVF1ZXN0aW9uQ2hlY2tib3hJdGVtfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmNoZWNrYm94XCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25Ecm9wZG93bn0gZnJvbSBcIi4uL3JlYWN0L3JlYWN0cXVlc3Rpb25kcm9wZG93blwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd24sIFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd25Sb3d9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4ZHJvcGRvd25cIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbk1hdHJpeCwgU3VydmV5UXVlc3Rpb25NYXRyaXhSb3d9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4XCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25IdG1sfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmh0bWxcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbkZpbGV9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9uZmlsZVwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uTXVsdGlwbGVUZXh0LCBTdXJ2ZXlRdWVzdGlvbk11bHRpcGxlVGV4dEl0ZW19IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9ubXVsdGlwbGV0ZXh0XCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25SYWRpb2dyb3VwfSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbnJhZGlvZ3JvdXBcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvblRleHR9IGZyb20gXCIuLi9yZWFjdC9yZWFjdHF1ZXN0aW9udGV4dFwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uTWF0cml4RHluYW1pYywgU3VydmV5UXVlc3Rpb25NYXRyaXhEeW5hbWljUm93fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeGR5bmFtaWNcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQcm9ncmVzc30gZnJvbSBcIi4uL3JlYWN0L3JlYWN0U3VydmV5UHJvZ3Jlc3NcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvblJhdGluZ30gZnJvbSBcIi4uL3JlYWN0L3JlYWN0cXVlc3Rpb25yYXRpbmdcIjtcclxuZXhwb3J0IHtTdXJ2ZXlXaW5kb3d9IGZyb20gXCIuLi9yZWFjdC9yZWFjdFN1cnZleVdpbmRvd1wiO1xyXG5leHBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjsgLy8gVE9ETyBuZWVkIHRvIHJlbW92ZSBzb21lZGF5XHJcbmV4cG9ydCB7UmVhY3RRdWVzdGlvbkZhY3RvcnkgYXMgUXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCB7X19leHRlbmRzfSBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xyXG5cclxuLy9VbmNvbW1lbnQgdG8gaW5jbHVkZSB0aGUgXCJkYXRlXCIgcXVlc3Rpb24gdHlwZS5cclxuLy9leHBvcnQge2RlZmF1bHQgYXMgU3VydmV5UXVlc3Rpb25EYXRlfSBmcm9tIFwiLi4vcGx1Z2lucy9yZWFjdC9yZWFjdHF1ZXN0aW9uZGF0ZVwiO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJpZXMvcmVhY3QudHNcbiAqKi8iLCJleHBvcnQge1xyXG4gICAgQW5zd2VyQ291bnRWYWxpZGF0b3IsIEVtYWlsVmFsaWRhdG9yLCBOdW1lcmljVmFsaWRhdG9yLCBSZWdleFZhbGlkYXRvcixcclxuICAgIFN1cnZleVZhbGlkYXRvciwgVGV4dFZhbGlkYXRvciwgVmFsaWRhdG9yUmVzdWx0LCBWYWxpZGF0b3JSdW5uZXJcclxufSBmcm9tIFwiLi4vLi4vdmFsaWRhdG9yXCI7XHJcbmV4cG9ydCB7QmFzZSwgRXZlbnQsIEl0ZW1WYWx1ZSwgU3VydmV5RXJyb3IsIElTdXJ2ZXl9IGZyb20gXCIuLi8uLi9iYXNlXCI7XHJcbmV4cG9ydCB7Q2hvaWNlc1Jlc3RmdWxsfSBmcm9tIFwiLi4vLi4vY2hvaWNlc1Jlc3RmdWxsXCI7XHJcbmV4cG9ydCB7Q29uZGl0aW9uLCBDb25kaXRpb25Ob2RlLCBDb25kaXRpb25SdW5uZXJ9IGZyb20gXCIuLi8uLi9jb25kaXRpb25zXCI7XHJcbmV4cG9ydCB7Q29uZGl0aW9uc1BhcnNlcn0gZnJvbSBcIi4uLy4uL2NvbmRpdGlvbnNQYXJzZXJcIjtcclxuZXhwb3J0IHtQcm9jZXNzVmFsdWV9IGZyb20gXCIuLi8uLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuZXhwb3J0IHtDdXN0b21FcnJvciwgRXhjZWVkU2l6ZUVycm9yLCBSZXF1cmVOdW1lcmljRXJyb3J9IGZyb20gXCIuLi8uLi9lcnJvclwiO1xyXG5leHBvcnQge1xyXG4gICAgSnNvbkVycm9yLCBKc29uSW5jb3JyZWN0VHlwZUVycm9yLCBKc29uTWV0YWRhdGEsIEpzb25NZXRhZGF0YUNsYXNzLFxyXG4gICAgSnNvbk1pc3NpbmdUeXBlRXJyb3IsIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSwgSnNvbk9iamVjdCwgSnNvbk9iamVjdFByb3BlcnR5LFxyXG4gICAgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciwgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yXHJcbn0gZnJvbSBcIi4uLy4uL2pzb25vYmplY3RcIjtcclxuZXhwb3J0IHtcclxuICAgIE1hdHJpeERyb3Bkb3duQ2VsbCwgTWF0cml4RHJvcGRvd25Db2x1bW4sIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLFxyXG4gICAgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZVxyXG59IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuZXhwb3J0IHtNYXRyaXhEcm9wZG93blJvd01vZGVsLCBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93blwiO1xyXG5leHBvcnQge01hdHJpeER5bmFtaWNSb3dNb2RlbCwgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcbmV4cG9ydCB7TWF0cml4Um93TW9kZWwsIFF1ZXN0aW9uTWF0cml4TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tYXRyaXhcIjtcclxuZXhwb3J0IHtNdWx0aXBsZVRleHRJdGVtTW9kZWwsIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9tdWx0aXBsZXRleHRcIjtcclxuZXhwb3J0IHtQYWdlTW9kZWwsIFF1ZXN0aW9uUm93TW9kZWx9IGZyb20gXCIuLi8uLi9wYWdlXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb259IGZyb20gXCIuLi8uLi9xdWVzdGlvblwiO1xyXG5leHBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5leHBvcnQge1F1ZXN0aW9uQ2hlY2tib3hCYXNlLCBRdWVzdGlvblNlbGVjdEJhc2V9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25DaGVja2JveE1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fY2hlY2tib3hcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkNvbW1lbnRNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2NvbW1lbnRcIjtcclxuZXhwb3J0IHsgUXVlc3Rpb25Ecm9wZG93bk1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fZHJvcGRvd25cIjtcclxuZXhwb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi8uLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkZpbGVNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2ZpbGVcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkh0bWxNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2h0bWxcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX3JhZGlvZ3JvdXBcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJhdGluZ01vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fcmF0aW5nXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25UZXh0TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl90ZXh0XCI7XHJcbmV4cG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi8uLi9zdXJ2ZXlcIjtcclxuZXhwb3J0IHtcclxuICAgIFN1cnZleVRyaWdnZXIsIFN1cnZleVRyaWdnZXJDb21wbGV0ZSwgU3VydmV5VHJpZ2dlclNldFZhbHVlLCBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSxcclxuICAgIFRyaWdnZXJcclxufSBmcm9tIFwiLi4vLi4vdHJpZ2dlclwiO1xyXG5leHBvcnQge1N1cnZleVdpbmRvd01vZGVsfSBmcm9tIFwiLi4vLi4vc3VydmV5V2luZG93XCI7XHJcbmV4cG9ydCB7VGV4dFByZVByb2Nlc3Nvcn0gZnJvbSBcIi4uLy4uL3RleHRQcmVQcm9jZXNzb3JcIjtcclxuXHJcbmV4cG9ydCB7ZHhTdXJ2ZXlTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vZHhTdXJ2ZXlTZXJ2aWNlXCI7XHJcbmV4cG9ydCB7c3VydmV5TG9jYWxpemF0aW9uLCBzdXJ2ZXlTdHJpbmdzfSBmcm9tIFwiLi4vLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuLy9VbmNvbW1lbnQgdG8gaW5jbHVkZSB0aGUgXCJkYXRlXCIgcXVlc3Rpb24gdHlwZS5cclxuLy9leHBvcnQge2RlZmF1bHQgYXMgUXVlc3Rpb25EYXRlTW9kZWx9IGZyb20gXCIuLi8uLi9wbHVnaW5zL3F1ZXN0aW9uX2RhdGVcIjtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRyaWVzL2NodW5rcy9tb2RlbC50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgU3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvciwgUmVxdXJlTnVtZXJpY0Vycm9yfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gJy4vanNvbm9iamVjdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogYW55LCBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbCkge1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPjtcclxuICAgIHZhbHVlOiBhbnk7XHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICBwdWJsaWMgcnVuKG93bmVyOiBJVmFsaWRhdG9yT3duZXIpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25lci52YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LmVycm9yKSByZXR1cm4gdmFsaWRhdG9yUmVzdWx0LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyLnZhbHVlID0gdmFsaWRhdG9yUmVzdWx0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTnVtZXJpY1ZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAoIXZhbHVlIHx8ICF0aGlzLmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFZhbGlkYXRvclJlc3VsdChwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICByZXN1bHQuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQobmFtZSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tYXhWYWx1ZSAmJiB0aGlzLm1heFZhbHVlIDwgcmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgPyBudWxsIDogcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHZOYW1lID0gbmFtZSA/IG5hbWUgOiBcInZhbHVlXCI7XHJcbiAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5NYXhcIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNaW5cIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWluVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc051bWJlcih2YWx1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG1pbkxlbmd0aDogbnVtYmVyID0gMCwgcHVibGljIG1heExlbmd0aDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0dmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPiAwICYmIHZhbHVlLmxlbmd0aCA8IHRoaXMubWluTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5tYXhMZW5ndGggPiAwICYmIHZhbHVlLmxlbmd0aCA+IHRoaXMubWF4TGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLm1pbkxlbmd0aCA+IDAgJiYgdGhpcy5tYXhMZW5ndGggPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInRleHRNaW5NYXhMZW5ndGhcIilbXCJmb3JtYXRcIl0odGhpcy5taW5MZW5ndGgsIHRoaXMubWF4TGVuZ3RoKTtcclxuICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPiAwKSByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInRleHRNaW5MZW5ndGhcIilbXCJmb3JtYXRcIl0odGhpcy5taW5MZW5ndGgpO1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidGV4dE1heExlbmd0aFwiKVtcImZvcm1hdFwiXSh0aGlzLm1heExlbmd0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBbnN3ZXJDb3VudFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluQ291bnQ6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhDb3VudDogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiOyB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUuY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBjb3VudCA9IHZhbHVlLmxlbmd0aDtcclxuICAgICAgICBpZiAodGhpcy5taW5Db3VudCAmJiBjb3VudCA8IHRoaXMubWluQ291bnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5TZWxlY3RFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1pbkNvdW50KSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWF4Q291bnQgJiYgY291bnQgPiB0aGlzLm1heENvdW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWF4U2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5tYXhDb3VudCkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdleFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVnZXg6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicmVnZXh2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICghdGhpcy5yZWdleCB8fCAhdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAodGhpcy5yZWdleCk7XHJcbiAgICAgICAgaWYgKHJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdCh2YWx1ZSwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgIHByaXZhdGUgcmUgPSAvXigoW148PigpXFxbXFxdXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClcXFtcXF1cXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChbXjw+KClbXFxdXFwuLDs6XFxzQFxcXCJdK1xcLikrW148PigpW1xcXVxcLiw7Olxcc0BcXFwiXXsyLH0pJC9pO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImVtYWlsdmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5yZS50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQodmFsdWUsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJpbnZhbGlkRW1haWxcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgW1widGV4dFwiXSk7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJudW1lcmljdmFsaWRhdG9yXCIsIFtcIm1pblZhbHVlOm51bWJlclwiLCBcIm1heFZhbHVlOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE51bWVyaWNWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0dmFsaWRhdG9yXCIsIFtcIm1pbkxlbmd0aDpudW1iZXJcIiwgXCJtYXhMZW5ndGg6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgVGV4dFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImFuc3dlcmNvdW50dmFsaWRhdG9yXCIsIFtcIm1pbkNvdW50Om51bWJlclwiLCBcIm1heENvdW50Om51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFuc3dlckNvdW50VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmVnZXh2YWxpZGF0b3JcIiwgW1wicmVnZXhcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBSZWdleFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImVtYWlsdmFsaWRhdG9yXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgRW1haWxWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdmFsaWRhdG9yLnRzXG4gKiovIiwiZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyAoZCwgYikge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfX2V4dGVuZHM7XHJcbn1cclxuXHJcbmV4cG9ydHMuX19leHRlbmRzID0gX19leHRlbmRzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2V4dGVuZHMudHNcbiAqKi8iLCJleHBvcnQgaW50ZXJmYWNlIEhhc2hUYWJsZTxUPiB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBUO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleURhdGEge1xyXG4gICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTtcclxuICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleSBleHRlbmRzIElTdXJ2ZXlEYXRhIHtcclxuICAgIGN1cnJlbnRQYWdlOiBJUGFnZTtcclxuICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpO1xyXG4gICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pO1xyXG4gICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvcjtcclxuICAgIHByb2Nlc3NIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZztcclxuICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZztcclxuICAgIGlzRGVzaWduTW9kZTogYm9vbGVhbjtcclxuICAgIHJlcXVpcmVkVGV4dDogc3RyaW5nO1xyXG4gICAgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmc7XHJcbiAgICBxdWVzdGlvblRpdGxlVGVtcGxhdGU6IHN0cmluZztcclxuICAgIHN0b3JlT3RoZXJzQXNDb21tZW50OiBib29sZWFuO1xyXG4gICAgdXBsb2FkRmlsZShuYW1lOiBzdHJpbmcsIGZpbGU6IEZpbGUsIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbiwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KTogYm9vbGVhbjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVF1ZXN0aW9uIGV4dGVuZHMgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgaGFzVGl0bGU6IGJvb2xlYW47XHJcbiAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcik7XHJcbiAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KTtcclxuICAgIG9uU3VydmV5TG9hZCgpO1xyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKTogYm9vbGVhbjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElQYWdlIGV4dGVuZHMgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICB2aXNpYmxlOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSXRlbVZhbHVlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgU2VwYXJhdG9yID0gJ3wnO1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBpdGVtcy5sZW5ndGggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgSXRlbVZhbHVlKG51bGwpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZS52YWx1ZSkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXhjZXB0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLmdldFR5cGUpICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZS5nZXRUeXBlKCkgPT0gJ2l0ZW12YWx1ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5pdGVtVmFsdWUgPSB2YWx1ZS5pdGVtVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5pdGVtVGV4dCA9IHZhbHVlLml0ZW1UZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGV4Y2VwdGlvbiA9IEl0ZW1WYWx1ZS5pdGVtVmFsdWVQcm9wO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgSXRlbVZhbHVlLmNvcHlBdHRyaWJ1dGVzKHZhbHVlLCBpdGVtLCBleGNlcHRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5oYXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IHZhbHVlOiBpdGVtLnZhbHVlLCB0ZXh0OiBpdGVtLnRleHQgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRJdGVtQnlWYWx1ZShpdGVtczogQXJyYXk8SXRlbVZhbHVlPiwgdmFsOiBhbnkpOiBJdGVtVmFsdWUge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS52YWx1ZSA9PSB2YWwpIHJldHVybiBpdGVtc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpdGVtVmFsdWVQcm9wID0gWyBcInRleHRcIiwgXCJ2YWx1ZVwiLCBcImhhc1RleHRcIl07XHJcbiAgICBwcml2YXRlIHN0YXRpYyBjb3B5QXR0cmlidXRlcyhzcmM6IGFueSwgZGVzdDogYW55LCBleGNlcHRvbnM6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XHJcbiAgICAgICAgICAgIGlmICgodHlwZW9mIHNyY1trZXldID09ICdmdW5jdGlvbicpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKGV4Y2VwdG9ucyAmJiBleGNlcHRvbnMuaW5kZXhPZihrZXkpID4gLTEpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBkZXN0W2tleV0gPSBzcmNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGl0ZW1WYWx1ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBpdGVtVGV4dDogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGV4dDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaXRlbXZhbHVlXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuaXRlbVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIGlmICghdGhpcy5pdGVtVmFsdWUpIHJldHVybjtcclxuICAgICAgICB2YXIgc3RyOiBzdHJpbmcgPSB0aGlzLml0ZW1WYWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHN0ci5pbmRleE9mKEl0ZW1WYWx1ZS5TZXBhcmF0b3IpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gc3RyLnNsaWNlKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gc3RyLnNsaWNlKGluZGV4ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNUZXh0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pdGVtVGV4dCA/IHRydWUgOiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzVGV4dCkgcmV0dXJuIHRoaXMuaXRlbVRleHQ7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHJldHVybiB0aGlzLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHRleHQobmV3VGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtVGV4dCA9IG5ld1RleHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBCYXNlIHtcclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFN1cnZleVBhZ2VJZCA9IFwic3FfcGFnZVwiO1xyXG5leHBvcnQgY2xhc3MgU3VydmV5RWxlbWVudCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIFNjcm9sbEVsZW1lbnRUb1RvcChlbGVtZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghZWxlbWVudElkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgICAgICBpZiAoIWVsIHx8ICFlbC5zY3JvbGxJbnRvVmlldykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbGVtVG9wID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xyXG4gICAgICAgIGlmIChlbGVtVG9wIDwgMCkgIGVsLnNjcm9sbEludG9WaWV3KCk7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1Ub3AgPCAwO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBGb2N1c0VsZW1lbnQoZWxlbWVudElkOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWVsZW1lbnRJZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICAgICAgaWYgKGVsKSB7XHJcbiAgICAgICAgICAgIGVsLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFdmVudDxUIGV4dGVuZHMgRnVuY3Rpb24sIE9wdGlvbnM+ICB7XHJcbiAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmNhbGxiYWNrcyA9PSBudWxsIHx8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICBwdWJsaWMgZmlyZShzZW5kZXI6IGFueSwgb3B0aW9uczogT3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxSZXN1bHQgPSB0aGlzLmNhbGxiYWNrc1tpXShzZW5kZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkKGZ1bmM6IFQpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IG5ldyBBcnJheTxUPigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZShmdW5jOiBUKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNhbGxiYWNrcy5pbmRleE9mKGZ1bmMsIDApO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9iYXNlLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gJy4vc3VydmV5U3RyaW5ncyc7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbnN3ZXJSZXF1aXJlZEVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSAge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicmVxdWlyZWRFcnJvclwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUmVxdXJlTnVtZXJpY0Vycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljRXJyb3JcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEV4Y2VlZFNpemVFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgIHByaXZhdGUgbWF4U2l6ZTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobWF4U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1heFNpemUgPSBtYXhTaXplO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImV4Y2VlZE1heFNpemVcIilbXCJmb3JtYXRcIl0odGhpcy5nZXRUZXh0U2l6ZSgpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VGV4dFNpemUoKSB7XHJcbiAgICAgICAgdmFyIHNpemVzID0gWydCeXRlcycsICdLQicsICdNQicsICdHQicsICdUQiddO1xyXG4gICAgICAgIHZhciBmaXhlZCA9IFswLCAwLCAyLCAzLCAzXTtcclxuICAgICAgICBpZiAodGhpcy5tYXhTaXplID09IDApIHJldHVybiAnMCBCeXRlJztcclxuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5sb2codGhpcy5tYXhTaXplKSAvIE1hdGgubG9nKDEwMjQpKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLm1heFNpemUgLyBNYXRoLnBvdygxMDI0LCBpKTtcclxuICAgICAgICByZXR1cm4gdmFsdWUudG9GaXhlZChmaXhlZFtpXSkgKyAnICcgKyBzaXplc1tpXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lcnJvci50c1xuICoqLyIsImV4cG9ydCB2YXIgc3VydmV5TG9jYWxpemF0aW9uID0ge1xyXG4gICAgY3VycmVudExvY2FsZTogXCJcIixcclxuICAgIGxvY2FsZXM6IHt9LFxyXG4gICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudExvY2FsZSA/IHRoaXMubG9jYWxlc1t0aGlzLmN1cnJlbnRMb2NhbGVdIDogc3VydmV5U3RyaW5ncztcclxuICAgICAgICBpZiAoIWxvYyB8fCAhbG9jW3N0ck5hbWVdKSBsb2MgPSBzdXJ2ZXlTdHJpbmdzO1xyXG4gICAgICAgIHJldHVybiBsb2Nbc3RyTmFtZV07XHJcbiAgICB9LFxyXG4gICAgZ2V0TG9jYWxlczogZnVuY3Rpb24gKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgICByZXMucHVzaChcIlwiKTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sb2NhbGVzKSB7XHJcbiAgICAgICAgICAgIHJlcy5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5zb3J0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxufTtcclxuZXhwb3J0IHZhciBzdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlByZXZpb3VzXCIsXHJcbiAgICBwYWdlTmV4dFRleHQ6IFwiTmV4dFwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIkNvbXBsZXRlXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIk90aGVyIChkZXNjcmliZSlcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJQYWdlIHswfSBvZiB7MX1cIixcclxuICAgIGVtcHR5U3VydmV5OiBcIlRoZXJlIGlzIG5vIHZpc2libGUgcGFnZSBvciBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJUaGFuayB5b3UgZm9yIGNvbXBsZXRpbmcgdGhlIHN1cnZleSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiU3VydmV5IGlzIGxvYWRpbmcuLi5cIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcIkNob29zZS4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgYW5zd2VyIHRoZSBxdWVzdGlvbi5cIixcclxuICAgIHJlcXVpcmVkSW5BbGxSb3dzRXJyb3I6IFwiUGxlYXNlIGFuc3dlciBxdWVzdGlvbnMgaW4gYWxsIHJvd3MuXCIsXHJcbiAgICBudW1lcmljRXJyb3I6IFwiVGhlIHZhbHVlIHNob3VsZCBiZSBudW1lcmljLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgezB9IHN5bWJvbHMuXCIsXHJcbiAgICB0ZXh0TWF4TGVuZ3RoOiBcIlBsZWFzZSBlbnRlciBsZXNzIHRoYW4gezB9IHN5bWJvbHMuXCIsXHJcbiAgICB0ZXh0TWluTWF4TGVuZ3RoOiBcIlBsZWFzZSBlbnRlciBtb3JlIHRoYW4gezB9IGFuZCBsZXNzIHRoYW4gezF9IHN5bWJvbHMuXCIsXHJcbiAgICBtaW5Sb3dDb3VudEVycm9yOiBcIlBsZWFzZSBmaWxsIGluIGF0IGxlYXN0IHswfSByb3dzLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiUGxlYXNlIHNlbGVjdCBhdCBsZWFzdCB7MH0gdmFyaWFudHMuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IG5vIG1vcmUgdGhhbiB7MH0gdmFyaWFudHMuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfSBhbmQgZXF1YWwgb3IgbGVzcyB0aGFuIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIG1vcmUgdGhhbiB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBsZXNzIHRoYW4gezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwiUGxlYXNlIGVudGVyIGEgdmFsaWQgZS1tYWlsIGFkZHJlc3MuXCIsXHJcbiAgICB1cmxSZXF1ZXN0RXJyb3I6IFwiVGhlIHJlcXVlc3QgcmV0dXJuZWQgZXJyb3IgJ3swfScuIHsxfVwiLFxyXG4gICAgdXJsR2V0Q2hvaWNlc0Vycm9yOiBcIlRoZSByZXF1ZXN0IHJldHVybmVkIGVtcHR5IGRhdGEgb3IgdGhlICdwYXRoJyBwcm9wZXJ0eSBpcyBpbmNvcnJlY3RcIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwiVGhlIGZpbGUgc2l6ZSBzaG91bGQgbm90IGV4Y2VlZCB7MH0uXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiUGxlYXNlIGVudGVyIHRoZSBvdGhlciB2YWx1ZS5cIixcclxuICAgIHVwbG9hZGluZ0ZpbGU6IFwiWW91ciBmaWxlIGlzIHVwbG9hZGluZy4gUGxlYXNlIHdhaXQgc2V2ZXJhbCBzZWNvbmRzIGFuZCB0cnkgYWdhaW4uXCIsXHJcbiAgICBhZGRSb3c6IFwiQWRkIHJvd1wiLFxyXG4gICAgcmVtb3ZlUm93OiBcIlJlbW92ZVwiXHJcbn07XHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZW5cIl0gPSBzdXJ2ZXlTdHJpbmdzO1xyXG5cclxuaWYgKCFTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXVxyXG4gICAgICAgICAgICAgICAgOiBtYXRjaFxyXG4gICAgICAgICAgICAgICAgO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N1cnZleVN0cmluZ3MudHNcbiAqKi8iLCJpbXBvcnQge0hhc2hUYWJsZX0gZnJvbSAnLi9iYXNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgcHJpdmF0ZSB0eXBlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogQXJyYXk8YW55PiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNob2ljZXNmdW5jOiAoKSA9PiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGRlZmF1bHRWYWx1ZTogYW55ID0gbnVsbDtcclxuICAgIHB1YmxpYyBvbkdldFZhbHVlOiAob2JqOiBhbnkpID0+IGFueSA9IG51bGw7XHJcbiAgICBwdWJsaWMgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnR5cGVWYWx1ZSA/IHRoaXMudHlwZVZhbHVlIDogXCJzdHJpbmdcIjsgfVxyXG4gICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50eXBlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNUb1VzZUdldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vbkdldFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5kZWZhdWx0VmFsdWUpID8gKHRoaXMuZGVmYXVsdFZhbHVlID09IHZhbHVlKSA6ICEodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5vbkdldFZhbHVlKSByZXR1cm4gdGhpcy5vbkdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlU2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uU2V0VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXRWYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpIHtcclxuICAgICAgICBpZiAodGhpcy5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25TZXRWYWx1ZShvYmosIHZhbHVlLCBqc29uQ29udik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldE9ialR5cGUob2JqVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNsYXNzTmFtZVBhcnQpIHJldHVybiBvYmpUeXBlO1xyXG4gICAgICAgIHJldHVybiBvYmpUeXBlLnJlcGxhY2UodGhpcy5jbGFzc05hbWVQYXJ0LCBcIlwiKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5jbGFzc05hbWVQYXJ0ICYmIGNsYXNzTmFtZS5pbmRleE9mKHRoaXMuY2xhc3NOYW1lUGFydCkgPCAwKSA/IGNsYXNzTmFtZSArIHRoaXMuY2xhc3NOYW1lUGFydCA6IGNsYXNzTmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICBpZiAodGhpcy5jaG9pY2VzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNmdW5jICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNmdW5jKCk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0Q2hvaWNlcyh2YWx1ZTogQXJyYXk8YW55PiwgdmFsdWVGdW5jOiAoKSA9PiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmNob2ljZXNmdW5jID0gdmFsdWVGdW5jO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICBzdGF0aWMgcmVxdWlyZWRTeW1ib2wgPSAnISc7XHJcbiAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgIHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4gPSBudWxsO1xyXG4gICAgcmVxdWlyZWRQcm9wZXJ0aWVzOiBBcnJheTxzdHJpbmc+ID0gbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIHB1YmxpYyBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwdWJsaWMgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5jcmVhdGVQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHByb3ApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvcGVydGllcy5wdXNoKHByb3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucHJvcGVydGllc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlUHJvcGVydHkocHJvcEluZm86IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHR5cGVvZiBwcm9wSW5mbyA9PT0gXCJzdHJpbmdcIiA/IHByb3BJbmZvIDogcHJvcEluZm8ubmFtZTtcclxuICAgICAgICBpZiAoIXByb3BlcnR5TmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSBudWxsO1xyXG4gICAgICAgIHZhciB0eXBlSW5kZXggPSBwcm9wZXJ0eU5hbWUuaW5kZXhPZihKc29uTWV0YWRhdGFDbGFzcy50eXBlU3ltYm9sKTtcclxuICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgcHJvcGVydHlUeXBlID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZyh0eXBlSW5kZXggKyAxKTtcclxuICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCB0eXBlSW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIHZhciBwcm9wID0gbmV3IEpzb25PYmplY3RQcm9wZXJ0eShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eVR5cGUpIHtcclxuICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHByb3BJbmZvID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wSW5mby50eXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5kZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmRlZmF1bHRWYWx1ZSA9IHByb3BJbmZvLmRlZmF1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmlzUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFrZVByb3BlcnR5UmVxdWlyZWQocHJvcC5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uY2hvaWNlcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNob2ljZXNGdW5jID0gdHlwZW9mIHByb3BJbmZvLmNob2ljZXMgPT09IFwiZnVuY3Rpb25cIiA/IHByb3BJbmZvLmNob2ljZXMgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNob2ljZXNWYWx1ZSA9IHR5cGVvZiBwcm9wSW5mby5jaG9pY2VzICE9PSBcImZ1bmN0aW9uXCIgPyBwcm9wSW5mby5jaG9pY2VzIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIHByb3Auc2V0Q2hvaWNlcyhjaG9pY2VzVmFsdWUsIGNob2ljZXNGdW5jKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8ub25HZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5vbkdldFZhbHVlID0gcHJvcEluZm8ub25HZXRWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8ub25TZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5vblNldFZhbHVlID0gcHJvcEluZm8ub25TZXRWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmNsYXNzTmFtZSA9IHByb3BJbmZvLmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5iYXNlQ2xhc3NOYW1lID0gcHJvcEluZm8uYmFzZUNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uY2xhc3NOYW1lUGFydCkge1xyXG4gICAgICAgICAgICAgICAgcHJvcC5jbGFzc05hbWVQYXJ0ID0gcHJvcEluZm8uY2xhc3NOYW1lUGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAocHJvcGVydHlOYW1lLmxlbmd0aCA9PSAwIHx8IHByb3BlcnR5TmFtZVswXSAhPSBKc29uTWV0YWRhdGFDbGFzcy5yZXF1aXJlZFN5bWJvbCkgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgdGhpcy5tYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3BlcnR5TmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhIHtcclxuICAgIHByaXZhdGUgY2xhc3NlczogSGFzaFRhYmxlPEpzb25NZXRhZGF0YUNsYXNzPiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICBwcml2YXRlIGNsYXNzUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4+ID0ge307XHJcbiAgICBwcml2YXRlIGNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8c3RyaW5nPj4gPSB7fTtcclxuICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IEFycmF5PGFueT4sIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllcywgY3JlYXRvciwgcGFyZW50TmFtZSk7XHJcbiAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICBpZiAocGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBvdmVycmlkZUNsYXNzQ3JlYXRvcmUobmFtZTogc3RyaW5nLCBjcmVhdG9yOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzKSB7XHJcbiAgICAgICAgICAgIG1ldGFEYXRhQ2xhc3MuY3JlYXRvciA9IGNyZWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlQ2xhc3MobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MuY3JlYXRvcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRQcm9wZXJ0eShjbGFzc05hbWU6IHN0cmluZywgcHJvcGVydHlJbmZvOiBhbnkpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gbWV0YURhdGFDbGFzcy5jcmVhdGVQcm9wZXJ0eShwcm9wZXJ0eUluZm8pO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFByb3BlcnR5VG9DbGFzcyhtZXRhRGF0YUNsYXNzLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDbGFzc1Byb3BlcnRpZXNIYXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVQcm9wZXJ0eShjbGFzc05hbWU6IHN0cmluZywgcHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gbWV0YURhdGFDbGFzcy5maW5kKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlUHJvcGVydHlGcm9tQ2xhc3MobWV0YURhdGFDbGFzcywgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB0aGlzLmVtcHR5Q2xhc3NQcm9wZXJ0aWVzSGFzaChtZXRhRGF0YUNsYXNzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZFByb3BlcnR5VG9DbGFzcyhtZXRhRGF0YUNsYXNzOiBKc29uTWV0YWRhdGFDbGFzcywgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLmZpbmQocHJvcGVydHkubmFtZSkgIT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlUHJvcGVydHlGcm9tQ2xhc3MobWV0YURhdGFDbGFzczogSnNvbk1ldGFkYXRhQ2xhc3MsIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgIG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpbmRleCA9IG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzLmluZGV4T2YocHJvcGVydHkubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBlbXB0eUNsYXNzUHJvcGVydGllc0hhc2gobWV0YURhdGFDbGFzczogSnNvbk1ldGFkYXRhQ2xhc3MpIHtcclxuICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1ttZXRhRGF0YUNsYXNzLm5hbWVdID0gbnVsbDtcclxuICAgICAgICB2YXIgY2hpbGRDbGFzc2VzID0gdGhpcy5nZXRDaGlsZHJlbkNsYXNzZXMobWV0YURhdGFDbGFzcy5uYW1lKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1tjaGlsZENsYXNzZXNbaV0ubmFtZV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiwgcmVzdWx0OiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4pIHtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIWNhbkJlQ3JlYXRlZCB8fCBjaGlsZHJlbltpXS5jcmVhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKGNoaWxkcmVuW2ldLm5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZmluZENsYXNzKG5hbWU6IHN0cmluZyk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW25hbWVdO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWxsUHJvcGVydGllcyhuYW1lOiBzdHJpbmcsIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4pIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFByb3BlcnR5Q29yZShtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXNbaV0sIGxpc3QsIGxpc3QubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZFByb3BlcnR5Q29yZShwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBlbmRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmRJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT0gcHJvcGVydHkubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2gocHJvcGVydHkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlzdFtpbmRleF0gPSBwcm9wZXJ0eTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxzdHJpbmc+KSB7XHJcbiAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobGlzdCwgbWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbkVycm9yIHtcclxuICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBhdDogTnVtYmVyID0gLTE7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0RnVsbERlc2NyaXB0aW9uKCkgOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UgKyAodGhpcy5kZXNjcmlwdGlvbiA/IFwiXFxuXCIgKyB0aGlzLmRlc2NyaXB0aW9uIDogXCJcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25Vbmtub3duUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKFwidW5rbm93bnByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicgaXMgdW5rbm93bi5cIik7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgbGlzdCBvZiBhdmFpbGFibGUgcHJvcGVydGllcyBhcmU6IFwiO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IHByb3BlcnRpZXNbaV0ubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9ICcuJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIodHlwZSwgbWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGZvbGxvd2luZyB0eXBlcyBhcmUgYXZhaWxhYmxlOiBcIjtcclxuICAgICAgICB2YXIgdHlwZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhiYXNlQ2xhc3NOYW1lLCB0cnVlKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCInXCIgKyB0eXBlc1tpXS5uYW1lICsgXCInXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIuXCI7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25NaXNzaW5nVHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwibWlzc2luZ3R5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIG1pc3NpbmcgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uSW5jb3JyZWN0VHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwiaW5jb3JyZWN0dHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgaW5jb3JyZWN0IGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKFwicmVxdWlyZWRwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaXMgcmVxdWlyZWQgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInLlwiKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEpzb25PYmplY3Qge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdHlwZVByb3BlcnR5TmFtZSA9IFwidHlwZVwiO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcG9zaXRpb25Qcm9wZXJ0eU5hbWUgPSBcInBvc1wiO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWV0YURhdGFWYWx1ZSA9IG5ldyBKc29uTWV0YWRhdGEoKTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IG1ldGFEYXRhKCkgeyByZXR1cm4gSnNvbk9iamVjdC5tZXRhRGF0YVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZXJyb3JzID0gbmV3IEFycmF5PEpzb25FcnJvcj4oKTtcclxuICAgIHB1YmxpYyB0b0pzb25PYmplY3Qob2JqOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRvSnNvbk9iamVjdENvcmUob2JqLCBudWxsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB0b09iamVjdChqc29uT2JqOiBhbnksIG9iajogYW55KSB7XHJcbiAgICAgICAgaWYgKCFqc29uT2JqKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBudWxsO1xyXG4gICAgICAgIGlmIChvYmouZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBqc29uT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBrZXkpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKG5ldyBKc29uVW5rbm93blByb3BlcnR5RXJyb3Ioa2V5LnRvU3RyaW5nKCksIG9iai5nZXRUeXBlKCkpLCBqc29uT2JqKTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVUb09iaihqc29uT2JqW2tleV0sIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHRvSnNvbk9iamVjdENvcmUob2JqOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgIGlmICghb2JqLmdldFR5cGUpIHJldHVybiBvYmo7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmICghcHJvcGVydHkuY2xhc3NOYW1lKSkge1xyXG4gICAgICAgICAgICByZXN1bHRbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5LmdldE9ialR5cGUob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVUb0pzb24ob2JqLCByZXN1bHQsIHByb3BlcnRpZXNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9Kc29uKG9iajogYW55LCByZXN1bHQ6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBwcm9wZXJ0eS5nZXRWYWx1ZShvYmopO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhciBhcnJWYWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJWYWx1ZS5wdXNoKHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZVtpXSwgcHJvcGVydHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YWx1ZSA9IGFyclZhbHVlLmxlbmd0aCA+IDAgPyBhcnJWYWx1ZSA6IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgcmVzdWx0W3Byb3BlcnR5Lm5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9PYmoodmFsdWU6IGFueSwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5oYXNUb1VzZVNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5LnNldFZhbHVlKG9iaiwgdmFsdWUsIHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZVRvQXJyYXkodmFsdWUsIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld09iaiA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgaWYgKG5ld09iai5uZXdPYmopIHtcclxuICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZSwgbmV3T2JqLm5ld09iaik7XHJcbiAgICAgICAgICAgIHZhbHVlID0gbmV3T2JqLm5ld09iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFuZXdPYmouZXJyb3IpIHtcclxuICAgICAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzVmFsdWVBcnJheSh2YWx1ZTogYW55KTogYm9vbGVhbiB7IHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLmluZGV4T2YoXCJBcnJheVwiKSA+IC0xOyB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZU5ld09iaih2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0geyBuZXdPYmo6IG51bGwsIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHZhbHVlW0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV07XHJcbiAgICAgICAgaWYgKCFjbGFzc05hbWUgJiYgcHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuY2xhc3NOYW1lO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5nZXRDbGFzc05hbWUoY2xhc3NOYW1lKTtcclxuICAgICAgICByZXN1bHQubmV3T2JqID0gKGNsYXNzTmFtZSkgPyBKc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKGNsYXNzTmFtZSkgOiBudWxsO1xyXG4gICAgICAgIHJlc3VsdC5lcnJvciA9IHRoaXMuY2hlY2tOZXdPYmplY3RPbkVycm9ycyhyZXN1bHQubmV3T2JqLCB2YWx1ZSwgcHJvcGVydHksIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tOZXdPYmplY3RPbkVycm9ycyhuZXdPYmo6IGFueSwgdmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBKc29uRXJyb3Ige1xyXG4gICAgICAgIHZhciBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgaWYgKG5ld09iaikge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWlyZWRQcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRSZXF1aXJlZFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXF1aXJlZFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlW3JlcXVpcmVkUHJvcGVydGllc1tpXV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvcihyZXF1aXJlZFByb3BlcnRpZXNbaV0sIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25NaXNzaW5nVHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uSW5jb3JyZWN0VHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKGVycm9yLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkTmV3RXJyb3IoZXJyb3I6IEpzb25FcnJvciwganNvbk9iajogYW55KSB7XHJcbiAgICAgICAgaWYgKGpzb25PYmogJiYganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgICBlcnJvci5hdCA9IGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0uc3RhcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB2YWx1ZVRvQXJyYXkodmFsdWU6IEFycmF5PGFueT4sIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1ZhbHVlQXJyYXkob2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgIG9ialtrZXldID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWVbaV0sIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLm5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaChuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZVtpXSwgbmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKHZhbHVlW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZmluZFByb3BlcnR5KHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGtleTogYW55KTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IGtleSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvanNvbm9iamVjdC50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgSXRlbVZhbHVlLCBTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaG9pY2VzUmVzdGZ1bGwgZXh0ZW5kcyBCYXNlIHtcclxuICAgIHB1YmxpYyB1cmw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgcGF0aDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyB2YWx1ZU5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgdGl0bGVOYW1lOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIGdldFJlc3VsdENhbGxiYWNrOiAoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcnVuKCkge1xyXG4gICAgICAgIGlmICghdGhpcy51cmwgfHwgIXRoaXMuZ2V0UmVzdWx0Q2FsbGJhY2spIHJldHVybjtcclxuICAgICAgICB0aGlzLmVycm9yID0gbnVsbDtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHRoaXMudXJsKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uRXJyb3IoeGhyLnN0YXR1c1RleHQsIHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY2hvaWNlc0J5VXJsXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMudXJsICYmICF0aGlzLnBhdGggJiYgIXRoaXMudmFsdWVOYW1lICYmICF0aGlzLnRpdGxlTmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXREYXRhKGpzb246IGFueSkge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICBpZiAoanNvbi51cmwpIHRoaXMudXJsID0ganNvbi51cmw7XHJcbiAgICAgICAgaWYgKGpzb24ucGF0aCkgdGhpcy5wYXRoID0ganNvbi5wYXRoO1xyXG4gICAgICAgIGlmIChqc29uLnZhbHVlTmFtZSkgdGhpcy52YWx1ZU5hbWUgPSBqc29uLnZhbHVlTmFtZTtcclxuICAgICAgICBpZiAoanNvbi50aXRsZU5hbWUpIHRoaXMudGl0bGVOYW1lID0ganNvbi50aXRsZU5hbWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy51cmwgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMucGF0aCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy52YWx1ZU5hbWUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudGl0bGVOYW1lID0gXCJcIjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkxvYWQocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICByZXN1bHQgPSB0aGlzLmdldFJlc3VsdEFmdGVyUGF0aChyZXN1bHQpO1xyXG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0W1wibGVuZ3RoXCJdKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVZhbHVlID0gcmVzdWx0W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtVmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShpdGVtVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpdGxlID0gdGhpcy5nZXRUaXRsZShpdGVtVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChuZXcgSXRlbVZhbHVlKHZhbHVlLCB0aXRsZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvciA9IG5ldyBDdXN0b21FcnJvcihzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidXJsR2V0Q2hvaWNlc0Vycm9yXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXRSZXN1bHRDYWxsYmFjayhpdGVtcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uRXJyb3Ioc3RhdHVzOiBzdHJpbmcsIHJlc3BvbnNlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cmxSZXF1ZXN0RXJyb3JcIilbXCJmb3JtYXRcIl0oc3RhdHVzLCByZXNwb25zZSkpO1xyXG4gICAgICAgIHRoaXMuZ2V0UmVzdWx0Q2FsbGJhY2soW10pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRSZXN1bHRBZnRlclBhdGgocmVzdWx0OiBhbnkpIHtcclxuICAgICAgICBpZiAoIXJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICBpZiAoIXRoaXMucGF0aCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB2YXIgcGF0aGVzID0gdGhpcy5nZXRQYXRoZXMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHRbcGF0aGVzW2ldXTtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRQYXRoZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHBhdGhlcyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLnBhdGguaW5kZXhPZignOycpID4gLTEpIHtcclxuICAgICAgICAgICAgcGF0aGVzID0gdGhpcy5wYXRoLnNwbGl0KCc7Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcGF0aGVzID0gdGhpcy5wYXRoLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXRoZXMubGVuZ3RoID09IDApIHBhdGhlcy5wdXNoKHRoaXMucGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGhlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmFsdWUoaXRlbTogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZU5hbWUpIHJldHVybiBpdGVtW3RoaXMudmFsdWVOYW1lXTtcclxuICAgICAgICB2YXIgbGVuID0gT2JqZWN0LmtleXMoaXRlbSkubGVuZ3RoO1xyXG4gICAgICAgIGlmIChsZW4gPCAxKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gaXRlbVtPYmplY3Qua2V5cyhpdGVtKVswXV07XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFRpdGxlKGl0ZW06IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRpdGxlTmFtZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1bdGhpcy50aXRsZU5hbWVdO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaG9pY2VzQnlVcmxcIiwgW1widXJsXCIsIFwicGF0aFwiLCBcInZhbHVlTmFtZVwiLCBcInRpdGxlTmFtZVwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IENob2ljZXNSZXN0ZnVsbCgpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jaG9pY2VzUmVzdGZ1bGwudHNcbiAqKi8iLCJpbXBvcnQge0hhc2hUYWJsZX0gZnJvbSAnLi9iYXNlJztcclxuaW1wb3J0IHtDb25kaXRpb25zUGFyc2VyfSBmcm9tICcuL2NvbmRpdGlvbnNQYXJzZXInO1xyXG5pbXBvcnQge1Byb2Nlc3NWYWx1ZX0gZnJvbSBcIi4vY29uZGl0aW9uUHJvY2Vzc1ZhbHVlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uIHtcclxuICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICBzdGF0aWMgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgICAgICBpZiAoQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWU7XHJcbiAgICAgICAgQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAhbGVmdDsgfSxcclxuICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gISghbGVmdCk7IH0sXHJcbiAgICAgICAgICAgIGVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPT0gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgIG5vdGVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgIT0gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgJiYgbGVmdFtcImluZGV4T2ZcIl0gJiYgbGVmdC5pbmRleE9mKHJpZ2h0KSA+IC0xOyB9LFxyXG4gICAgICAgICAgICBub3Rjb250YWluczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAhbGVmdCB8fCAhbGVmdFtcImluZGV4T2ZcIl0gfHwgbGVmdC5pbmRleE9mKHJpZ2h0KSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgZ3JlYXRlcjogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ID4gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgIGxlc3M6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA8IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0ID49IHJpZ2h0OyB9LFxyXG4gICAgICAgICAgICBsZXNzb3JlcXVhbDogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0IDw9IHJpZ2h0OyB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQ29uZGl0aW9uLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICBwdWJsaWMgbGVmdDogYW55O1xyXG4gICAgcHVibGljIHJpZ2h0OiBhbnk7XHJcbiAgICBwdWJsaWMgZ2V0IG9wZXJhdG9yKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm9wVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKCFDb25kaXRpb24ub3BlcmF0b3JzW3ZhbHVlXSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMub3BWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHBlcmZvcm0obGVmdDogYW55ID0gbnVsbCwgcmlnaHQ6IGFueSA9IG51bGwpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWxlZnQpIGxlZnQgPSB0aGlzLmxlZnQ7XHJcbiAgICAgICAgaWYgKCFyaWdodCkgcmlnaHQgPSB0aGlzLnJpZ2h0O1xyXG5cclxuICAgICAgICByZXR1cm4gQ29uZGl0aW9uLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh0aGlzLmdldFB1cmVWYWx1ZShsZWZ0KSwgdGhpcy5nZXRQdXJlVmFsdWUocmlnaHQpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHVyZVZhbHVlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAodHlwZW9mIHZhbCAhPSBcInN0cmluZ1wiKSkgcmV0dXJuIHZhbDtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDAgJiYgKHZhbFswXSA9PSBcIidcIiB8fCB2YWxbMF0gPT0gJ1wiJykpICB2YWwgPSB2YWwuc3Vic3RyKDEpO1xyXG4gICAgICAgIHZhciBsZW4gPSB2YWwubGVuZ3RoO1xyXG4gICAgICAgIGlmIChsZW4gPiAwICYmICh2YWxbbGVuIC0gMV0gPT0gXCInXCIgfHwgdmFsW2xlbiAtIDFdID09ICdcIicpKSAgdmFsID0gdmFsLnN1YnN0cigwLCBsZW4gLSAxKTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBDb25kaXRpb25Ob2RlIHtcclxuICAgIHByaXZhdGUgY29ubmVjdGl2ZVZhbHVlOiBzdHJpbmcgPSBcImFuZFwiO1xyXG4gICAgcHVibGljIGNoaWxkcmVuOiBBcnJheTxhbnk+ID0gW107XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7IH1cclxuICAgIHB1YmxpYyBnZXQgY29ubmVjdGl2ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jb25uZWN0aXZlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29ubmVjdGl2ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAodmFsdWUgPT0gXCImXCIgfHwgdmFsdWUgPT0gXCImJlwiKSB2YWx1ZSA9IFwiYW5kXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IFwifFwiIHx8IHZhbHVlID09IFwifHxcIikgdmFsdWUgPSBcIm9yXCI7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9IFwiYW5kXCIgJiYgdmFsdWUgIT0gXCJvclwiKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aXZlVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpIHsgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDA7IH1cclxuICAgIHB1YmxpYyBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICAgICAgdGhpcy5jb25uZWN0aXZlID0gXCJhbmRcIjtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uUnVubmVyIHtcclxuICAgIHByaXZhdGUgZXhwcmVzc2lvblZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHByb2Nlc3NWYWx1ZTogUHJvY2Vzc1ZhbHVlO1xyXG4gICAgcHJpdmF0ZSByb290OiBDb25kaXRpb25Ob2RlO1xyXG4gICAgcHJpdmF0ZSB2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+O1xyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGV4cHJlc3Npb246IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucm9vdCA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgdGhpcy5leHByZXNzaW9uID0gZXhwcmVzc2lvbjtcclxuICAgICAgICB0aGlzLnByb2Nlc3NWYWx1ZSA9IG5ldyBQcm9jZXNzVmFsdWUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZXhwcmVzc2lvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5leHByZXNzaW9uVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgZXhwcmVzc2lvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZXhwcmVzc2lvbiA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvblZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgbmV3IENvbmRpdGlvbnNQYXJzZXIoKS5wYXJzZSh0aGlzLmV4cHJlc3Npb25WYWx1ZSwgdGhpcy5yb290KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBydW4odmFsdWVzOiBIYXNoVGFibGU8YW55Pik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bk5vZGUodGhpcy5yb290KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcnVuTm9kZShub2RlOiBDb25kaXRpb25Ob2RlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIG9uRmlyc3RGYWlsID0gbm9kZS5jb25uZWN0aXZlID09IFwiYW5kXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLnJ1bk5vZGVDb25kaXRpb24obm9kZS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzICYmIG9uRmlyc3RGYWlsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChyZXMgJiYgIW9uRmlyc3RGYWlsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9uRmlyc3RGYWlsO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Ob2RlQ29uZGl0aW9uKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHZhbHVlW1wiY2hpbGRyZW5cIl0pIHJldHVybiB0aGlzLnJ1bk5vZGUodmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImxlZnRcIl0pIHJldHVybiB0aGlzLnJ1bkNvbmRpdGlvbih2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Db25kaXRpb24oY29uZGl0aW9uOiBDb25kaXRpb24pOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgbGVmdCA9IGNvbmRpdGlvbi5sZWZ0O1xyXG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXRWYWx1ZU5hbWUobGVmdCk7XHJcbiAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnByb2Nlc3NWYWx1ZS5oYXNWYWx1ZShuYW1lLCB0aGlzLnZhbHVlcykpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgbGVmdCA9IHRoaXMucHJvY2Vzc1ZhbHVlLmdldFZhbHVlKG5hbWUsIHRoaXMudmFsdWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJpZ2h0ID0gY29uZGl0aW9uLnJpZ2h0O1xyXG4gICAgICAgIG5hbWUgPSB0aGlzLmdldFZhbHVlTmFtZShyaWdodCk7XHJcbiAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnByb2Nlc3NWYWx1ZS5oYXNWYWx1ZShuYW1lLCB0aGlzLnZhbHVlcykpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmlnaHQgPSB0aGlzLnByb2Nlc3NWYWx1ZS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25kaXRpb24ucGVyZm9ybShsZWZ0LCByaWdodCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlTmFtZShub2RlVmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICghbm9kZVZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodHlwZW9mIG5vZGVWYWx1ZSAhPT0gJ3N0cmluZycpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmIChub2RlVmFsdWUubGVuZ3RoIDwgMyB8fCBub2RlVmFsdWVbMF0gIT0gJ3snIHx8IG5vZGVWYWx1ZVtub2RlVmFsdWUubGVuZ3RoIC0gMV0gIT0gJ30nKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbm9kZVZhbHVlLnN1YnN0cigxLCBub2RlVmFsdWUubGVuZ3RoIC0gMik7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb25kaXRpb25zLnRzXG4gKiovIiwiaW1wb3J0IHtDb25kaXRpb24sIENvbmRpdGlvbk5vZGV9IGZyb20gXCIuL2NvbmRpdGlvbnNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25kaXRpb25zUGFyc2VyIHtcclxuICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByb290OiBDb25kaXRpb25Ob2RlO1xyXG4gICAgcHJpdmF0ZSBleHByZXNzaW9uTm9kZXM6IEFycmF5PENvbmRpdGlvbk5vZGU+O1xyXG4gICAgcHJpdmF0ZSBub2RlOiBDb25kaXRpb25Ob2RlO1xyXG4gICAgcHJpdmF0ZSBhdDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBsZW5ndGg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBwYXJzZSh0ZXh0OiBzdHJpbmcsIHJvb3Q6IENvbmRpdGlvbk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMucm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgdGhpcy5yb290LmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5hdCA9IDA7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLnRleHQubGVuZ3RoO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnBhcnNlVGV4dCgpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdG9TdHJpbmcocm9vdDogQ29uZGl0aW9uTm9kZSk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlVG9TdHJpbmcocm9vdCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRvU3RyaW5nQ29yZSh2YWx1ZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gXCJcIjtcclxuICAgICAgICBpZiAodmFsdWVbXCJjaGlsZHJlblwiXSkgcmV0dXJuIHRoaXMubm9kZVRvU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICBpZiAodmFsdWVbXCJsZWZ0XCJdKSByZXR1cm4gdGhpcy5jb25kaXRpb25Ub1N0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG5vZGVUb1N0cmluZyhub2RlOiBDb25kaXRpb25Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAobm9kZS5pc0VtcHR5KSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgcmVzID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vZGVUZXh0ID0gdGhpcy50b1N0cmluZ0NvcmUobm9kZS5jaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgIGlmIChub2RlVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcykgcmVzICs9ICcgJyArIG5vZGUuY29ubmVjdGl2ZSArICcgJztcclxuICAgICAgICAgICAgICAgIHJlcyArPSBub2RlVGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZSAhPSB0aGlzLnJvb3QgJiYgbm9kZS5jaGlsZHJlbi5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHJlcyA9ICcoJyArIHJlcyArICcpJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29uZGl0aW9uVG9TdHJpbmcoY29uZGl0aW9uOiBDb25kaXRpb24pOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghY29uZGl0aW9uLnJpZ2h0IHx8ICFjb25kaXRpb24ub3BlcmF0b3IpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciBsZWZ0ID0gY29uZGl0aW9uLmxlZnQ7XHJcbiAgICAgICAgaWYgKGxlZnQgJiYgIXRoaXMuaXNOdW1lcmljKGxlZnQpKSBsZWZ0ID0gXCInXCIgKyBsZWZ0ICsgXCInXCI7XHJcbiAgICAgICAgdmFyIHJlcyA9IGxlZnQgKyAnICcgKyB0aGlzLm9wZXJhdGlvblRvU3RyaW5nKGNvbmRpdGlvbi5vcGVyYXRvcik7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNOb1JpZ2h0T3BlcmF0aW9uKGNvbmRpdGlvbi5vcGVyYXRvcikpIHJldHVybiByZXM7XHJcbiAgICAgICAgdmFyIHJpZ2h0ID0gY29uZGl0aW9uLnJpZ2h0O1xyXG4gICAgICAgIGlmIChyaWdodCAmJiAhdGhpcy5pc051bWVyaWMocmlnaHQpKSByaWdodCA9IFwiJ1wiICsgcmlnaHQgKyBcIidcIjtcclxuICAgICAgICByZXR1cm4gcmVzICsgJyAnICsgcmlnaHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9wZXJhdGlvblRvU3RyaW5nKG9wOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChvcCA9PSBcImVxdWFsXCIpIHJldHVybiBcIj1cIjtcclxuICAgICAgICBpZiAob3AgPT0gXCJub3RlcXVhbFwiKSByZXR1cm4gXCIhPVwiO1xyXG4gICAgICAgIGlmIChvcCA9PSBcImdyZWF0ZXJcIikgcmV0dXJuIFwiPlwiO1xyXG4gICAgICAgIGlmIChvcCA9PSBcImxlc3NcIikgcmV0dXJuIFwiPFwiO1xyXG4gICAgICAgIGlmIChvcCA9PSBcImdyZWF0ZXJvcmVxdWFsXCIpIHJldHVybiBcIj49XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwibGVzc29yZXF1YWxcIikgcmV0dXJuIFwiPD1cIjtcclxuICAgICAgICByZXR1cm4gb3A7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTnVtZXJpYyh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgIGlmIChpc05hTih2YWwpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlVGV4dCgpOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLnJvb3Q7XHJcbiAgICAgICAgdGhpcy5leHByZXNzaW9uTm9kZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2Rlcy5wdXNoKHRoaXMubm9kZSk7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICByZXR1cm4gcmVzICYmIHRoaXMuYXQgPj0gdGhpcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRDb25kaXRpb25zKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnJlYWRDb25kaXRpb24oKTtcclxuICAgICAgICBpZiAoIXJlcykgcmV0dXJuIHJlcztcclxuICAgICAgICB2YXIgY29ubmVjdGl2ZSA9IHRoaXMucmVhZENvbm5lY3RpdmUoKTtcclxuICAgICAgICBpZiAoY29ubmVjdGl2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbm5lY3RpdmUoY29ubmVjdGl2ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRDb25kaXRpb25zKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkQ29uZGl0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5yZWFkRXhwcmVzc2lvbigpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGxlZnQgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICBpZiAoIWxlZnQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgb3AgPSB0aGlzLnJlYWRPcGVyYXRvcigpO1xyXG4gICAgICAgIGlmICghb3ApIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgYyA9IG5ldyBDb25kaXRpb24oKTtcclxuICAgICAgICBjLmxlZnQgPSBsZWZ0OyBjLm9wZXJhdG9yID0gb3A7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTm9SaWdodE9wZXJhdGlvbihvcCkpIHtcclxuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGlmICghcmlnaHQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgYy5yaWdodCA9IHJpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmFkZENvbmRpdGlvbihjKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZEV4cHJlc3Npb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYXQgPj0gdGhpcy5sZW5ndGggfHwgdGhpcy5jaCAhPSAnKCcpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICB0aGlzLnB1c2hFeHByZXNzaW9uKCk7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2tpcCgpO1xyXG4gICAgICAgICAgICByZXMgPSB0aGlzLmNoID09ICcpJztcclxuICAgICAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICB0aGlzLnBvcEV4cHJlc3Npb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0IGNoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRleHQuY2hhckF0KHRoaXMuYXQpOyB9XHJcbiAgICBwcml2YXRlIHNraXAoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuYXQgPCB0aGlzLmxlbmd0aCAmJiB0aGlzLmlzU3BhY2UodGhpcy5jaCkpIHRoaXMuYXQrKztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNTcGFjZShjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gYyA9PSAnICcgfHwgYyA9PSAnXFxuJyB8fCBjID09ICdcXHQnIHx8IGMgPT0gJ1xccic7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzUXVvdGVzKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjID09IFwiJ1wiIHx8IGMgPT0gJ1wiJ1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc09wZXJhdG9yQ2hhcihjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gYyA9PSAnPicgfHwgYyA9PSAnPCcgfHwgYyA9PSAnPScgfHwgYyA9PSAnISc7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzQnJhY2tldHMoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGMgPT0gJygnIHx8IGMgPT0gJyknO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkU3RyaW5nKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYXQgPj0gdGhpcy5sZW5ndGgpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBzdGFydCA9IHRoaXMuYXQ7XHJcbiAgICAgICAgdmFyIGhhc1F1b3RlcyA9IHRoaXMuaXNRdW90ZXModGhpcy5jaCk7XHJcbiAgICAgICAgaWYgKGhhc1F1b3RlcykgdGhpcy5hdCsrO1xyXG4gICAgICAgIHZhciBpc0ZpcnN0T3BDaCA9IHRoaXMuaXNPcGVyYXRvckNoYXIodGhpcy5jaCk7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuYXQgPCB0aGlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpZiAoIWhhc1F1b3RlcyAmJiB0aGlzLmlzU3BhY2UodGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1F1b3Rlcyh0aGlzLmNoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhhc1F1b3RlcykgdGhpcy5hdCsrO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFoYXNRdW90ZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0ZpcnN0T3BDaCAhPSB0aGlzLmlzT3BlcmF0b3JDaGFyKHRoaXMuY2gpKSBicmVhaztcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQnJhY2tldHModGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYXQgPD0gc3RhcnQpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLnRleHQuc3Vic3RyKHN0YXJ0LCB0aGlzLmF0IC0gc3RhcnQpO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAxICYmIHRoaXMuaXNRdW90ZXMocmVzWzBdKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlbiA9IHJlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNRdW90ZXMocmVzW3Jlcy5sZW5ndGggLSAxXSkpIGxlbi0tO1xyXG4gICAgICAgICAgICAgICAgcmVzID0gcmVzLnN1YnN0cigxLCBsZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTm9SaWdodE9wZXJhdGlvbihvcDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG9wID09IFwiZW1wdHlcIiB8fCBvcCA9PSBcIm5vdGVtcHR5XCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRPcGVyYXRvcigpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBvcCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgIGlmICghb3ApIHJldHVybiBudWxsO1xyXG4gICAgICAgIG9wID0gb3AudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAob3AgPT0gJz4nKSBvcCA9IFwiZ3JlYXRlclwiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPCcpIG9wID0gXCJsZXNzXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc+PScgfHwgb3AgPT0gJz0+Jykgb3AgPSBcImdyZWF0ZXJvcmVxdWFsXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc8PScgfHwgb3AgPT0gJz08Jykgb3AgPSBcImxlc3NvcmVxdWFsXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc9JyB8fCBvcCA9PSAnPT0nKSBvcCA9IFwiZXF1YWxcIjtcclxuICAgICAgICBpZiAob3AgPT0gJzw+JyB8fCBvcCA9PSAnIT0nKSBvcCA9IFwibm90ZXF1YWxcIjtcclxuICAgICAgICBpZiAob3AgPT0gJ2NvbnRhaW4nKSBvcCA9IFwiY29udGFpbnNcIjtcclxuICAgICAgICBpZiAob3AgPT0gJ25vdGNvbnRhaW4nKSBvcCA9IFwibm90Y29udGFpbnNcIjtcclxuICAgICAgICByZXR1cm4gb3A7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRDb25uZWN0aXZlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGNvbiA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgIGlmICghY29uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb24gPSBjb24udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAoY29uID09IFwiJlwiIHx8IGNvbiA9PSBcIiYmXCIpIGNvbiA9IFwiYW5kXCI7XHJcbiAgICAgICAgaWYgKGNvbiA9PSBcInxcIiB8fCBjb24gPT0gXCJ8fFwiKSBjb24gPSBcIm9yXCI7XHJcbiAgICAgICAgaWYgKGNvbiAhPSBcImFuZFwiICYmIGNvbiAhPSBcIm9yXCIpIGNvbiA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNvbjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcHVzaEV4cHJlc3Npb24oKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzLnB1c2gobm9kZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcG9wRXhwcmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZXhwcmVzc2lvbk5vZGVzLnBvcCgpO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMuZXhwcmVzc2lvbk5vZGVzW3RoaXMuZXhwcmVzc2lvbk5vZGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRDb25kaXRpb24oYzogQ29uZGl0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2goYyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZENvbm5lY3RpdmUoY29uOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmNvbm5lY3RpdmUgPSBjb247XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5jb25uZWN0aXZlICE9IGNvbikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZENvbiA9IHRoaXMubm9kZS5jb25uZWN0aXZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZENoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdGl2ZSA9IGNvbjtcclxuICAgICAgICAgICAgICAgIHZhciBvbGROb2RlID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICAgICAgICAgIG9sZE5vZGUuY29ubmVjdGl2ZSA9IG9sZENvbjtcclxuICAgICAgICAgICAgICAgIG9sZE5vZGUuY2hpbGRyZW4gPSBvbGRDaGlsZHJlbjtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jaGlsZHJlbi5wdXNoKG9sZE5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gobmV3Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUgPSBuZXdOb2RlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29uZGl0aW9uc1BhcnNlci50c1xuICoqLyIsImltcG9ydCB7SGFzaFRhYmxlfSBmcm9tICcuL2Jhc2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2Nlc3NWYWx1ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgcHVibGljIGdldEZpcnN0TmFtZSh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGV4dCkgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgdmFyIHJlcyA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjaCA9IHRleHRbaV07XHJcbiAgICAgICAgICAgIGlmIChjaCA9PSAnLicgfHwgY2ggPT0gJ1snKSBicmVhaztcclxuICAgICAgICAgICAgcmVzICs9IGNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGhhc1ZhbHVlKHRleHQ6IHN0cmluZywgdmFsdWVzOiBIYXNoVGFibGU8YW55Pik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmdldFZhbHVlQ29yZSh0ZXh0LCB2YWx1ZXMpO1xyXG4gICAgICAgIHJldHVybiByZXMuaGFzVmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VmFsdWUodGV4dDogc3RyaW5nLCB2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5nZXRWYWx1ZUNvcmUodGV4dCwgdmFsdWVzKTtcclxuICAgICAgICByZXR1cm4gcmVzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWYWx1ZUNvcmUodGV4dDogc3RyaW5nLCB2YWx1ZXM6IGFueSk6IGFueSB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHsgaGFzVmFsdWU6IGZhbHNlLCB2YWx1ZTogbnVsbCB9O1xyXG4gICAgICAgIHZhciBjdXJWYWx1ZSA9IHZhbHVlcztcclxuICAgICAgICBpZiAoIWN1clZhbHVlKSByZXR1cm4gcmVzO1xyXG4gICAgICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcclxuICAgICAgICB3aGlsZSAodGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGlzQXJyYXkgPSAhaXNGaXJzdCAmJiB0ZXh0WzBdID09ICdbJztcclxuICAgICAgICAgICAgaWYgKCFpc0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzRmlyc3QpIHRleHQgPSB0ZXh0LnN1YnN0cigxKTtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJOYW1lID0gdGhpcy5nZXRGaXJzdE5hbWUodGV4dCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWN1ck5hbWUpIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWN1clZhbHVlW2N1ck5hbWVdKSByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgY3VyVmFsdWUgPSBjdXJWYWx1ZVtjdXJOYW1lXVxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKGN1ck5hbWUubGVuZ3RoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjdXJWYWx1ZSkpIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAxO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPCB0ZXh0Lmxlbmd0aCAmJiB0ZXh0W2luZGV4XSAhPSAnXScpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gdGV4dFtpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRleHQgPSBpbmRleCA8IHRleHQubGVuZ3RoID8gdGV4dC5zdWJzdHIoaW5kZXggKyAxKSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHRoaXMuZ2V0SW50VmFsdWUoc3RyKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gY3VyVmFsdWUubGVuZ3RoKSByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgY3VyVmFsdWUgPSBjdXJWYWx1ZVtpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXNGaXJzdCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXMudmFsdWUgPSBjdXJWYWx1ZTtcclxuICAgICAgICByZXMuaGFzVmFsdWUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEludFZhbHVlKHN0cjogYW55KSB7XHJcbiAgICAgICAgaWYgKHN0ciA9PSBcIjBcIiB8fCAoKHN0ciB8IDApID4gMCAmJiBzdHIgJSAxID09IDApKVxyXG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKHN0cik7XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvY29uZGl0aW9uUHJvY2Vzc1ZhbHVlLnRzXG4gKiovIiwiaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7QmFzZSwgSXRlbVZhbHVlLCBJU3VydmV5RGF0YSwgSGFzaFRhYmxlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25TZWxlY3RCYXNlfSBmcm9tIFwiLi9xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25Ecm9wZG93bk1vZGVsfSBmcm9tIFwiLi9xdWVzdGlvbl9kcm9wZG93blwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQ2hlY2tib3hNb2RlbH0gZnJvbSBcIi4vcXVlc3Rpb25fY2hlY2tib3hcIjtcclxuaW1wb3J0IHtRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbH0gZnJvbSBcIi4vcXVlc3Rpb25fcmFkaW9ncm91cFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uVGV4dE1vZGVsfSBmcm9tIFwiLi9xdWVzdGlvbl90ZXh0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25Db21tZW50TW9kZWx9IGZyb20gXCIuL3F1ZXN0aW9uX2NvbW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgIG9uUm93Q2hhbmdlZChjZWxsOiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgbmV3Um93VmFsdWU6IGFueSk7XHJcbiAgICBjb2x1bW5zOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj47XHJcbiAgICBjcmVhdGVRdWVzdGlvbihyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb247XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNvbHVtbiBleHRlbmRzIEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBvcHRpb25zQ2FwdGlvbjogc3RyaW5nO1xyXG4gICAgcHVibGljIGlzUmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBoYXNPdGhlcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG1pbldpZHRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIGNlbGxUeXBlOiBzdHJpbmcgPSBcImRlZmF1bHRcIjtcclxuICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpIHsgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIiB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IC0xIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duQ2VsbCB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uVmFsdWU6IFF1ZXN0aW9uO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHB1YmxpYyByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhKSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gZGF0YS5jcmVhdGVRdWVzdGlvbih0aGlzLnJvdywgdGhpcy5jb2x1bW4pO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZS5zZXREYXRhKHJvdyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25WYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5xdWVzdGlvbi52YWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UgaW1wbGVtZW50cyBJU3VydmV5RGF0YSB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50ZXI6IG51bWJlciA9IDE7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gXCJzcm93X1wiICsgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UuaWRDb3VudGVyKys7IH1cclxuICAgIHByb3RlY3RlZCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhO1xyXG4gICAgcHJpdmF0ZSByb3dWYWx1ZXM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIHJvd0NvbW1lbnRzOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBpc1NldHRpbmdWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBpZFZhbHVlOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIGNlbGxzOiBBcnJheTxNYXRyaXhEcm9wZG93bkNlbGw+ID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuaWRWYWx1ZSA9IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLmdldElkKCk7XHJcbiAgICAgICAgdGhpcy5idWlsZENlbGxzKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlkKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmlkVmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIG51bGw7IH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlczsgfVxyXG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5pc1NldHRpbmdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yb3dWYWx1ZXMgPSB7fTtcclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucm93VmFsdWVzW2tleV0gPSB2YWx1ZVtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzW2ldLnF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMuZ2V0VmFsdWUodGhpcy5jZWxsc1tpXS5jb2x1bW4ubmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzU2V0dGluZ1ZhbHVlID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dWYWx1ZXNbbmFtZV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXR0aW5nVmFsdWUpIHJldHVybjtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT09IFwiXCIpIG5ld1ZhbHVlID0gbnVsbDtcclxuICAgICAgICBpZiAobmV3VmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1tuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnJvd1ZhbHVlc1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kYXRhLm9uUm93Q2hhbmdlZCh0aGlzLCB0aGlzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93Q29tbWVudHNbbmFtZV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnJvd0NvbW1lbnRzW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB2YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYnVpbGRDZWxscygpIHtcclxuICAgICAgICB2YXIgY29sdW1ucyA9IHRoaXMuZGF0YS5jb2x1bW5zO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdGhpcy5jZWxscy5wdXNoKHRoaXMuY3JlYXRlQ2VsbChjb2x1bW4pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlQ2VsbChjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogTWF0cml4RHJvcGRvd25DZWxsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ2VsbChjb2x1bW4sIHRoaXMsIHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlIGV4dGVuZHMgUXVlc3Rpb24gaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4gPSBbXTtcclxuICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zQ2FwdGlvblZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBnZW5lcmF0ZWRWaXNpYmxlUm93czogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+O1xyXG4gICAgcHJpdmF0ZSBjZWxsVHlwZVZhbHVlOiBzdHJpbmcgPSBcImRyb3Bkb3duXCI7XHJcbiAgICBwcml2YXRlIGNvbHVtbkNvbENvdW50VmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgY29sdW1uTWluV2lkdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgaG9yaXpvbnRhbFNjcm9sbDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgdXBkYXRlQ2VsbHNDYWxsYmFrOiAoKSA9PiB2b2lkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25iYXNlXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbHVtbnMoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+IHsgcmV0dXJuIHRoaXMuY29sdW1uc1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbHVtbnModmFsdWU6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPikge1xyXG4gICAgICAgIHRoaXMuY29sdW1uc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2x1bW5zQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY2VsbFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2VsbFR5cGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjZWxsVHlwZShuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2VsbFR5cGUgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLmNlbGxUeXBlVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnVwZGF0ZUNlbGxzQ2FsbGJhayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbHVtbkNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbHVtbkNvbENvdW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29sdW1uQ29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jb2x1bW5Db2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy51cGRhdGVDZWxsc0NhbGxiYWspO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENvbHVtblRpdGxlKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBjb2x1bW4udGl0bGU7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5pc1JlcXVpcmVkICYmIHRoaXMuc3VydmV5KSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1aXJlVGV4dCA9IHRoaXMuc3VydmV5LnJlcXVpcmVkVGV4dDtcclxuICAgICAgICAgICAgaWYgKHJlcXVpcmVUZXh0KSByZXF1aXJlVGV4dCArPSBcIiBcIjtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcmVxdWlyZVRleHQgKyByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0Q29sdW1uV2lkdGgoY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5taW5XaWR0aCA/IGNvbHVtbi5taW5XaWR0aCA6IHRoaXMuY29sdW1uTWluV2lkdGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgb3B0aW9uc0NhcHRpb24oKSB7IHJldHVybiAodGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlKSA/IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvcHRpb25zQ2FwdGlvblwiKTsgfVxyXG4gICAgcHVibGljIHNldCBvcHRpb25zQ2FwdGlvbihuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgYWRkQ29sdW1uKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyA9IG51bGwpOiBNYXRyaXhEcm9wZG93bkNvbHVtbiB7XHJcbiAgICAgICAgdmFyIGNvbHVtbiA9IG5ldyBNYXRyaXhEcm9wZG93bkNvbHVtbihuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5jb2x1bW5zVmFsdWUucHVzaChjb2x1bW4pO1xyXG4gICAgICAgIHJldHVybiBjb2x1bW47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4ge1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgPSB0aGlzLmdlbmVyYXRlUm93cygpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT4geyByZXR1cm4gbnVsbDsgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdWYWx1ZShjdXJWYWx1ZTogYW55KTogYW55IHsgcmV0dXJuICFjdXJWYWx1ZSA/IHt9IDogY3VyVmFsdWU7IH1cclxuICAgIHByb3RlY3RlZCBnZXRSb3dWYWx1ZShyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBxdWVzdGlvblZhbHVlOiBhbnksIGNyZWF0ZTogYm9vbGVhbiA9IGZhbHNlKTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gcXVlc3Rpb25WYWx1ZVtyb3cucm93TmFtZV0gPyBxdWVzdGlvblZhbHVlW3Jvdy5yb3dOYW1lXSA6IG51bGw7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQgJiYgY3JlYXRlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBxdWVzdGlvblZhbHVlW3Jvdy5yb3dOYW1lXSA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkJlZm9yZVZhbHVlQ2hhbmdlZCh2YWw6IGFueSkge1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICB0aGlzLm9uQmVmb3JlVmFsdWVDaGFuZ2VkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGlmKCEodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgfHwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLnZhbHVlID0gdGhpcy5nZXRSb3dWYWx1ZShyb3csIHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7XHJcbiAgICAgICAgdmFyIHJvd3MgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzO1xyXG4gICAgICAgIGlmICghcm93cykgcm93cyA9IHRoaXMudmlzaWJsZVJvd3M7XHJcbiAgICAgICAgaWYgKCFyb3dzKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS5jZWxscztcclxuICAgICAgICAgICAgaWYgKCFjZWxscykgY29udGludWU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCBjZWxscy5sZW5ndGg7IGNvbEluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbjtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbiAmJiAoIXF1ZXN0aW9uLnN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgfHwgIXF1ZXN0aW9uLnZhbHVlKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGVycm9zSW5Db2x1bW5zID0gdGhpcy5oYXNFcnJvckluQ29sdW1ucyhmaXJlQ2FsbGJhY2spO1xyXG4gICAgICAgIHJldHVybiBzdXBlci5oYXNFcnJvcnMoZmlyZUNhbGxiYWNrKSB8fCBlcnJvc0luQ29sdW1ucztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaGFzRXJyb3JJbkNvbHVtbnMoZmlyZUNhbGxiYWNrOiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlcyA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCB0aGlzLmNvbHVtbnMubGVuZ3RoOyBjb2xJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNlbGxzID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS5jZWxscztcclxuICAgICAgICAgICAgICAgIHJlcyA9IGNlbGxzICYmIGNlbGxzW2NvbEluZGV4XSAmJiBjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb24gJiYgY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spIHx8IHJlcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0SW5wdXRFbGVtZW50SWQoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldEZpcnN0Q2VsbFF1ZXN0aW9uKGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gcXVlc3Rpb24gPyBxdWVzdGlvbi5pbnB1dElkIDogc3VwZXIuZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0RXJyb3JJbnB1dEVsZW1lbnRJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0Rmlyc3RDZWxsUXVlc3Rpb24odHJ1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXN0aW9uID8gcXVlc3Rpb24uaW5wdXRJZCA6IHN1cGVyLmdldEZpcnN0RXJyb3JJbnB1dEVsZW1lbnRJZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0Q2VsbFF1ZXN0aW9uKG9uRXJyb3I6IGJvb2xlYW4pOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNlbGxzID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS5jZWxscztcclxuICAgICAgICAgICAgZm9yICh2YXIgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IGNvbEluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghb25FcnJvcikgcmV0dXJuIGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbjtcclxuICAgICAgICAgICAgICAgIGlmIChjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb24uY3VycmVudEVycm9yQ291bnQgPiAwKSByZXR1cm4gY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICAvL0lNYXRyaXhEcm9wZG93bkRhdGFcclxuICAgIHB1YmxpYyBjcmVhdGVRdWVzdGlvbihyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb24ge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuY3JlYXRlUXVlc3Rpb25Db3JlKHJvdywgY29sdW1uKTtcclxuICAgICAgICBxdWVzdGlvbi5uYW1lID0gY29sdW1uLm5hbWU7XHJcbiAgICAgICAgcXVlc3Rpb24uaXNSZXF1aXJlZCA9IGNvbHVtbi5pc1JlcXVpcmVkO1xyXG4gICAgICAgIHF1ZXN0aW9uLmhhc090aGVyID0gY29sdW1uLmhhc090aGVyO1xyXG4gICAgICAgIGlmIChjb2x1bW4uaGFzT3RoZXIpIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uIGluc3RhbmNlb2YgUXVlc3Rpb25TZWxlY3RCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAoPFF1ZXN0aW9uU2VsZWN0QmFzZT5xdWVzdGlvbikuc3RvcmVPdGhlcnNBc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUXVlc3Rpb25Db3JlKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgdmFyIGNlbGxUeXBlID0gY29sdW1uLmNlbGxUeXBlID09IFwiZGVmYXVsdFwiID8gdGhpcy5jZWxsVHlwZSA6IGNvbHVtbi5jZWxsVHlwZTtcclxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0UXVlc3Rpb25OYW1lKHJvdywgY29sdW1uKTtcclxuICAgICAgICBpZiAoY2VsbFR5cGUgPT0gXCJjaGVja2JveFwiKSByZXR1cm4gdGhpcy5jcmVhdGVDaGVja2JveChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgIGlmIChjZWxsVHlwZSA9PSBcInJhZGlvZ3JvdXBcIikgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaW9ncm91cChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgIGlmIChjZWxsVHlwZSA9PSBcInRleHRcIikgcmV0dXJuIHRoaXMuY3JlYXRlVGV4dChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgIGlmIChjZWxsVHlwZSA9PSBcImNvbW1lbnRcIikgcmV0dXJuIHRoaXMuY3JlYXRlQ29tbWVudChuYW1lLCBjb2x1bW4pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZURyb3Bkb3duKG5hbWUsIGNvbHVtbik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UXVlc3Rpb25OYW1lKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcgeyByZXR1cm4gcm93LnJvd05hbWUgKyBcIl9cIiArIGNvbHVtbi5uYW1lOyB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5jaG9pY2VzICYmIGNvbHVtbi5jaG9pY2VzLmxlbmd0aCA+IDAgPyBjb2x1bW4uY2hvaWNlcyA6IHRoaXMuY2hvaWNlcztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRDb2x1bW5PcHRpb25zQ2FwdGlvbihjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY29sdW1uLm9wdGlvbnNDYXB0aW9uID8gY29sdW1uLm9wdGlvbnNDYXB0aW9uIDogdGhpcy5vcHRpb25zQ2FwdGlvbjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVEcm9wZG93bihuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkRyb3Bkb3duTW9kZWwge1xyXG4gICAgICAgIHZhciBxID0gPFF1ZXN0aW9uRHJvcGRvd25Nb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcImRyb3Bkb3duXCIsIG5hbWUpO1xyXG4gICAgICAgIHEuY2hvaWNlcyA9IHRoaXMuZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW4pO1xyXG4gICAgICAgIHEub3B0aW9uc0NhcHRpb24gPSB0aGlzLmdldENvbHVtbk9wdGlvbnNDYXB0aW9uKGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlQ2hlY2tib3gobmFtZTogc3RyaW5nLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb25DaGVja2JveE1vZGVsIHtcclxuICAgICAgICB2YXIgcSA9IDxRdWVzdGlvbkNoZWNrYm94TW9kZWw+dGhpcy5jcmVhdGVDZWxsUXVlc3Rpb24oXCJjaGVja2JveFwiLCBuYW1lKTtcclxuICAgICAgICBxLmNob2ljZXMgPSB0aGlzLmdldENvbHVtbkNob2ljZXMoY29sdW1uKTtcclxuICAgICAgICBxLmNvbENvdW50ID0gY29sdW1uLmNvbENvdW50ID4gLSAxID8gY29sdW1uLmNvbENvdW50IDogdGhpcy5jb2x1bW5Db2xDb3VudDtcclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVSYWRpb2dyb3VwKG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIHtcclxuICAgICAgICB2YXIgcSA9IDxRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgbmFtZSk7XHJcbiAgICAgICAgcS5jaG9pY2VzID0gdGhpcy5nZXRDb2x1bW5DaG9pY2VzKGNvbHVtbik7XHJcbiAgICAgICAgcS5jb2xDb3VudCA9IGNvbHVtbi5jb2xDb3VudCA+IC0gMSA/IGNvbHVtbi5jb2xDb3VudCA6IHRoaXMuY29sdW1uQ29sQ291bnQ7XHJcbiAgICAgICAgcmV0dXJuIHE7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvblRleHRNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIDxRdWVzdGlvblRleHRNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcInRleHRcIiwgbmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlQ29tbWVudChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkNvbW1lbnRNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIDxRdWVzdGlvbkNvbW1lbnRNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcImNvbW1lbnRcIiwgbmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlQ2VsbFF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIDxRdWVzdGlvbj5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBkZWxldGVSb3dWYWx1ZShuZXdWYWx1ZTogYW55LCByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlKTogYW55IHtcclxuICAgICAgICBkZWxldGUgbmV3VmFsdWVbcm93LnJvd05hbWVdO1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhuZXdWYWx1ZSkubGVuZ3RoID09IDAgPyBudWxsIDogbmV3VmFsdWU7XHJcbiAgICB9XHJcbiAgICBvblJvd0NoYW5nZWQocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgbmV3Um93VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgdmFyIHJvd1ZhbHVlID0gdGhpcy5nZXRSb3dWYWx1ZShyb3csIG5ld1ZhbHVlLCB0cnVlKTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcm93VmFsdWUpIGRlbGV0ZSByb3dWYWx1ZVtrZXldO1xyXG4gICAgICAgIGlmIChuZXdSb3dWYWx1ZSkge1xyXG4gICAgICAgICAgICBuZXdSb3dWYWx1ZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobmV3Um93VmFsdWUpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG5ld1Jvd1ZhbHVlKSByb3dWYWx1ZVtrZXldID0gbmV3Um93VmFsdWVba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJvd1ZhbHVlKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuZGVsZXRlUm93VmFsdWUobmV3VmFsdWUsIHJvdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiLCBbXCJuYW1lXCIsIHsgbmFtZTogXCJ0aXRsZVwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIFwib3B0aW9uc0NhcHRpb25cIiwgeyBuYW1lOiBcImNlbGxUeXBlXCIsIGRlZmF1bHQ6IFwiZGVmYXVsdFwiLCBjaG9pY2VzOiBbXCJkZWZhdWx0XCIsIFwiZHJvcGRvd25cIiwgXCJjaGVja2JveFwiLCBcInJhZGlvZ3JvdXBcIiwgXCJ0ZXh0XCIsIFwiY29tbWVudFwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb2xDb3VudFwiLCBkZWZhdWx0OiAtMSwgY2hvaWNlczogWy0xLCAwLCAxLCAyLCAzLCA0XSB9LCBcImlzUmVxdWlyZWQ6Ym9vbGVhblwiLCBcImhhc090aGVyOmJvb2xlYW5cIiwgXCJtaW5XaWR0aFwiXSxcclxuICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNYXRyaXhEcm9wZG93bkNvbHVtbihcIlwiKTsgfSk7XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25iYXNlXCIsIFt7IG5hbWU6IFwiY29sdW1uczptYXRyaXhkcm9wZG93bmNvbHVtbnNcIiwgY2xhc3NOYW1lOiBcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIgfSxcclxuICAgICAgICBcImhvcml6b250YWxTY3JvbGw6Ym9vbGVhblwiLFxyXG4gICAgICAgIHsgbmFtZTogXCJjaG9pY2VzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmouY2hvaWNlcyA9IHZhbHVlOyB9fSxcclxuICAgICAgICB7IG5hbWU6IFwib3B0aW9uc0NhcHRpb25cIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoub3B0aW9uc0NhcHRpb25WYWx1ZTsgfSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjZWxsVHlwZVwiLCBkZWZhdWx0OiBcImRyb3Bkb3duXCIsIGNob2ljZXM6IFtcImRyb3Bkb3duXCIsIFwiY2hlY2tib3hcIiwgXCJyYWRpb2dyb3VwXCIsIFwidGV4dFwiLCBcImNvbW1lbnRcIl0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY29sdW1uQ29sQ291bnRcIiwgZGVmYXVsdDogMCwgY2hvaWNlczogWzAsIDEsIDIsIDMsIDRdIH0sIFwiY29sdW1uTWluV2lkdGhcIl0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZShcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gJy4vanNvbm9iamVjdCc7XHJcbmltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tICcuL3F1ZXN0aW9uYmFzZSc7XHJcbmltcG9ydCB7U3VydmV5RXJyb3IsIFN1cnZleUVsZW1lbnR9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuaW1wb3J0IHtBbnN3ZXJSZXF1aXJlZEVycm9yfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5pbXBvcnQge1N1cnZleVZhbGlkYXRvciwgSVZhbGlkYXRvck93bmVyLCBWYWxpZGF0b3JSdW5uZXJ9IGZyb20gXCIuL3ZhbGlkYXRvclwiO1xyXG5pbXBvcnQge1RleHRQcmVQcm9jZXNzb3J9IGZyb20gXCIuL3RleHRQcmVQcm9jZXNzb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbiBleHRlbmRzIFF1ZXN0aW9uQmFzZSBpbXBsZW1lbnRzIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uVmFsdWU6IGFueTtcclxuICAgIHByaXZhdGUgcXVlc3Rpb25Db21tZW50OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIGlzUmVxdWlyZWRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBoYXNDb21tZW50VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaGFzT3RoZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBjb21tZW50VGV4dFZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSB0ZXh0UHJlUHJvY2Vzc29yOiBUZXh0UHJlUHJvY2Vzc29yO1xyXG4gICAgZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4gPSBbXTtcclxuICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG4gICAgdmFsdWVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb21tZW50Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgZXJyb3JzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgdGl0bGVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNUaXRsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaGFzSW5wdXQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlucHV0SWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWQgKyBcImlcIjsgfVxyXG4gICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gKHRoaXMudGl0bGVWYWx1ZSkgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMudGl0bGVWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudGl0bGVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBwcm9jZXNzZWRUaXRsZSgpIHsgcmV0dXJuIHRoaXMuc3VydmV5ICE9IG51bGwgPyB0aGlzLnN1cnZleS5wcm9jZXNzVGV4dCh0aGlzLnRpdGxlKSA6IHRoaXMudGl0bGU7IH1cclxuICAgIHB1YmxpYyBnZXQgZnVsbFRpdGxlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LnF1ZXN0aW9uVGl0bGVUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGV4dFByZVByb2Nlc3Nvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yID0gbmV3IFRleHRQcmVQcm9jZXNzb3IoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vbkhhc1ZhbHVlID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5jYW5Qcm9jZXNzZWRUZXh0VmFsdWVzKG5hbWUudG9Mb3dlckNhc2UoKSk7IH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25Qcm9jZXNzID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5nZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZSk7IH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dFByZVByb2Nlc3Nvci5wcm9jZXNzKHRoaXMuc3VydmV5LnF1ZXN0aW9uVGl0bGVUZW1wbGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXF1aXJlVGV4dCA9IHRoaXMucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgIGlmIChyZXF1aXJlVGV4dCkgcmVxdWlyZVRleHQgKz0gXCIgXCI7XHJcbiAgICAgICAgdmFyIG5vID0gdGhpcy5ubztcclxuICAgICAgICBpZiAobm8pIG5vICs9IFwiLiBcIjtcclxuICAgICAgICByZXR1cm4gbm8gKyByZXF1aXJlVGV4dCArIHRoaXMucHJvY2Vzc2VkVGl0bGU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZm9jdXMob25FcnJvcjogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgU3VydmV5RWxlbWVudC5TY3JvbGxFbGVtZW50VG9Ub3AodGhpcy5pZCk7XHJcbiAgICAgICAgdmFyIGlkID0gIW9uRXJyb3IgPyB0aGlzLmdldEZpcnN0SW5wdXRFbGVtZW50SWQoKSA6IHRoaXMuZ2V0Rmlyc3RFcnJvcklucHV0RWxlbWVudElkKCk7XHJcbiAgICAgICAgaWYgKFN1cnZleUVsZW1lbnQuRm9jdXNFbGVtZW50KGlkKSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmZvY3VzQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRGaXJzdElucHV0RWxlbWVudElkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRJZDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRGaXJzdEVycm9ySW5wdXRFbGVtZW50SWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRGaXJzdElucHV0RWxlbWVudElkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY2FuUHJvY2Vzc2VkVGV4dFZhbHVlcyhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gbmFtZSA9PSBcIm5vXCIgfHwgbmFtZSA9PSBcInRpdGxlXCIgfHwgbmFtZSA9PSBcInJlcXVpcmVcIjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBpZiAobmFtZSA9PSBcIm5vXCIpIHJldHVybiB0aGlzLm5vO1xyXG4gICAgICAgIGlmIChuYW1lID09IFwidGl0bGVcIikgcmV0dXJuIHRoaXMucHJvY2Vzc2VkVGl0bGU7XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJyZXF1aXJlXCIpIHJldHVybiB0aGlzLnJlcXVpcmVkVGV4dDtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNSZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGlzUmVxdWlyZWQodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSZXF1aXJlZCA9PSB2YWwpIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzUmVxdWlyZWRWYWx1ZSA9IHZhbDtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnRpdGxlQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQ29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQ29tbWVudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGhhc0NvbW1lbnQodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRDb21tZW50KCkpIHJldHVybjtcclxuICAgICAgICB0aGlzLmhhc0NvbW1lbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb21tZW50KSB0aGlzLmhhc090aGVyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbW1lbnRUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgPyB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKTsgfVxyXG4gICAgcHVibGljIHNldCBjb21tZW50VGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jb21tZW50VGV4dFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc090aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNPdGhlclZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGhhc090aGVyKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghdGhpcy5zdXBwb3J0T3RoZXIoKSB8fCB0aGlzLmhhc090aGVyID09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzT3RoZXJWYWx1ZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikgdGhpcy5oYXNDb21tZW50ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5oYXNPdGhlckNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBoYXNPdGhlckNoYW5nZWQoKSB7IH1cclxuICAgIHByb3RlY3RlZCBnZXQgbm8oKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXggPCAwKSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgc3RhcnRJbmRleCA9IDE7XHJcbiAgICAgICAgdmFyIGlzTnVtZXJpYyA9IHRydWU7XHJcbiAgICAgICAgdmFyIHN0ciA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuc3VydmV5LnF1ZXN0aW9uU3RhcnRJbmRleCkge1xyXG4gICAgICAgICAgICBzdHIgPSB0aGlzLnN1cnZleS5xdWVzdGlvblN0YXJ0SW5kZXg7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZUludChzdHIpKSBzdGFydEluZGV4ID0gcGFyc2VJbnQoc3RyKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoc3RyLmxlbmd0aCA9PSAxKSBpc051bWVyaWMgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtZXJpYykgcmV0dXJuICh0aGlzLnZpc2libGVJbmRleCArIHN0YXJ0SW5kZXgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoc3RyLmNoYXJDb2RlQXQoMCkgKyB0aGlzLnZpc2libGVJbmRleCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkge1xyXG4gICAgICAgIHN1cGVyLm9uU2V0RGF0YSgpO1xyXG4gICAgICAgIHRoaXMub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVGcm9tRGF0YSh0aGlzLmdldFZhbHVlQ29yZSgpKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudmFsdWVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldENvbW1lbnQoKTsgfVxyXG4gICAgcHVibGljIHNldCBjb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5jb21tZW50ID09IG5ld1ZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zZXRDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldENvbW1lbnQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLmdldENvbW1lbnQodGhpcy5uYW1lKSA6IHRoaXMucXVlc3Rpb25Db21tZW50OyB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0Q29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52YWx1ZSA9PSBudWxsOyB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLmNoZWNrRm9yRXJyb3JzKGZpcmVDYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRFcnJvckNvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGg7IH1cclxuICAgIHB1YmxpYyBnZXQgcmVxdWlyZWRUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnN1cnZleSAhPSBudWxsICYmIHRoaXMuaXNSZXF1aXJlZCA/IHRoaXMuc3VydmV5LnJlcXVpcmVkVGV4dCA6IFwiXCI7IH1cclxuICAgIHB1YmxpYyBhZGRFcnJvcihlcnJvcjogU3VydmV5RXJyb3IpIHtcclxuICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrRm9yRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBlcnJvckxlbmd0aCA9IHRoaXMuZXJyb3JzID8gdGhpcy5lcnJvcnMubGVuZ3RoIDogMDtcclxuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgIHRoaXMub25DaGVja0ZvckVycm9ycyh0aGlzLmVycm9ycyk7XHJcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwICYmIHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuc3VydmV5LnZhbGlkYXRlUXVlc3Rpb24odGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmlyZUNhbGxiYWNrICYmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgZXJyb3JMZW5ndGggPiAwKSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNSZXF1aXJlZEVycm9yKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgaGFzUmVxdWlyZWRFcnJvcigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc1JlcXVpcmVkICYmIHRoaXMuaXNFbXB0eSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgc2V0TmV3VmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0TmV3VmFsdWVJbkRhdGEobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzZXROZXdWYWx1ZUluRGF0YShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkpIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLnZhbHVlVG9EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZUNvcmUobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmFsdWVDb3JlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLm5hbWUpIDogdGhpcy5xdWVzdGlvblZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRWYWx1ZUNvcmUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0VmFsdWUodGhpcy5uYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGEodmFsOiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsOyB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGEodmFsOiBhbnkpOiBhbnkgeyByZXR1cm4gdmFsOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7IH1cclxuICAgIHByb3RlY3RlZCBzZXROZXdDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldENvbW1lbnQodGhpcy5uYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHRoaXMucXVlc3Rpb25Db21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICB9XHJcbiAgICAvL0lRdWVzdGlvblxyXG4gICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWVGcm9tRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb21tZW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gbnVsbDsgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJxdWVzdGlvblwiLCBbeyBuYW1lOiBcInRpdGxlOnRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcImNvbW1lbnRUZXh0XCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLmNvbW1lbnRUZXh0VmFsdWU7IH0gfSxcclxuICAgIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIHsgbmFtZTogXCJ2YWxpZGF0b3JzOnZhbGlkYXRvcnNcIiwgYmFzZUNsYXNzTmFtZTogXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgY2xhc3NOYW1lUGFydDogXCJ2YWxpZGF0b3JcIn1dLCBudWxsLCBcInF1ZXN0aW9uYmFzZVwiKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbi50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgSVF1ZXN0aW9uLCBJQ29uZGl0aW9uUnVubmVyLCBJU3VydmV5RGF0YSwgSVN1cnZleSwgSGFzaFRhYmxlfSBmcm9tICcuL2Jhc2UnO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gJy4vanNvbm9iamVjdCc7XHJcbmltcG9ydCB7Q29uZGl0aW9uUnVubmVyfSBmcm9tICcuL2NvbmRpdGlvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQmFzZSBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJUXVlc3Rpb24sIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcXVlc3Rpb25Db3VudGVyID0gMTAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UXVlc3Rpb25JZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInNxX1wiICsgUXVlc3Rpb25CYXNlLnF1ZXN0aW9uQ291bnRlcisrO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRhdGE6IElTdXJ2ZXlEYXRhO1xyXG4gICAgcHJvdGVjdGVkIHN1cnZleTogSVN1cnZleTtcclxuICAgIHByaXZhdGUgY29uZGl0aW9uUnVubmVyOiBDb25kaXRpb25SdW5uZXIgPSBudWxsO1xyXG4gICAgcHVibGljIHZpc2libGVJZjogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgaWRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHN0YXJ0V2l0aE5ld0xpbmU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSB2aXNpYmxlSW5kZXhWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICBwdWJsaWMgd2lkdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIHJlbmRlcldpZHRoVmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIHJpZ2h0SW5kZW50VmFsdWU6IG51bWJlciA9IDA7XHJcbiAgICBwdWJsaWMgaW5kZW50OiBudW1iZXIgPSAwO1xyXG4gICAgZm9jdXNDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICB2aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5pZFZhbHVlID0gUXVlc3Rpb25CYXNlLmdldFF1ZXN0aW9uSWQoKTtcclxuICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbDtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucm93VmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQoPElRdWVzdGlvbj50aGlzLCB0aGlzLnZpc2libGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmlzaWJsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnZpc2libGVJbmRleFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRFcnJvckNvdW50KCk6IG51bWJlciB7IHJldHVybiAwOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXQgaGFzSW5wdXQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWRWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCByZW5kZXJXaWR0aCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5yZW5kZXJXaWR0aFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHJlbmRlcldpZHRoKHZhbDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnJlbmRlcldpZHRoKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5yZW5kZXJXaWR0aFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByaWdodEluZGVudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5yaWdodEluZGVudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHJpZ2h0SW5kZW50KHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnJpZ2h0SW5kZW50KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5yaWdodEluZGVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzKG9uRXJyb3I6IGJvb2xlYW4gPSBmYWxzZSkgeyB9XHJcbiAgICBzZXREYXRhKG5ld1ZhbHVlOiBJU3VydmV5RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gKG5ld1ZhbHVlICYmIG5ld1ZhbHVlW1wicXVlc3Rpb25BZGRlZFwiXSkgPyA8SVN1cnZleT5uZXdWYWx1ZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5vblNldERhdGEoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBmaXJlQ2FsbGJhY2soY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkgeyB9XHJcbiAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgcHVibGljIHJ1bkNvbmRpdGlvbih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnZpc2libGVJZikgcmV0dXJuO1xyXG4gICAgICAgIGlmICghdGhpcy5jb25kaXRpb25SdW5uZXIpIHRoaXMuY29uZGl0aW9uUnVubmVyID0gbmV3IENvbmRpdGlvblJ1bm5lcih0aGlzLnZpc2libGVJZik7XHJcbiAgICAgICAgdGhpcy5jb25kaXRpb25SdW5uZXIuZXhwcmVzc2lvbiA9IHRoaXMudmlzaWJsZUlmO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHRoaXMuY29uZGl0aW9uUnVubmVyLnJ1bih2YWx1ZXMpO1xyXG4gICAgfVxyXG4gICAgLy9JUXVlc3Rpb25cclxuICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgIH1cclxuICAgIG9uU3VydmV5TG9hZCgpIHtcclxuICAgIH1cclxuICAgIHNldFZpc2libGVJbmRleCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnZpc2libGVJbmRleFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiBmYWxzZTsgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJxdWVzdGlvbmJhc2VcIiwgW1wiIW5hbWVcIiwgeyBuYW1lOiBcInZpc2libGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwidmlzaWJsZUlmOnRleHRcIixcclxuICAgIHsgbmFtZTogXCJ3aWR0aFwiIH0sIHsgbmFtZTogXCJzdGFydFdpdGhOZXdMaW5lOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZX0sIHtuYW1lOiBcImluZGVudDpudW1iZXJcIiwgZGVmYXVsdDogMCwgY2hvaWNlczogWzAsIDEsIDIsIDNdfV0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uYmFzZS50c1xuICoqLyIsImV4cG9ydCBjbGFzcyBUZXh0UHJlUHJvY2Vzc29ySXRlbSB7XHJcbiAgICBwdWJsaWMgc3RhcnQ6IG51bWJlcjtcclxuICAgIHB1YmxpYyBlbmQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRleHRQcmVQcm9jZXNzb3Ige1xyXG4gICAgcHVibGljIG9uUHJvY2VzczogKG5hbWU6IHN0cmluZykgPT4gYW55O1xyXG4gICAgcHVibGljIG9uSGFzVmFsdWU6IChuYW1lOiBzdHJpbmcpID0+IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgcHVibGljIHByb2Nlc3ModGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXRleHQpIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIGlmICghdGhpcy5vblByb2Nlc3MpIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuZ2V0SXRlbXModGV4dCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXROYW1lKHRleHQuc3Vic3RyaW5nKGl0ZW0uc3RhcnQgKyAxLCBpdGVtLmVuZCkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FuUHJvY2Vzc05hbWUobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbkhhc1ZhbHVlICYmICF0aGlzLm9uSGFzVmFsdWUobmFtZSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLm9uUHJvY2VzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwpIHZhbHVlID0gXCJcIjtcclxuICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyKDAsIGl0ZW0uc3RhcnQpICsgdmFsdWUgKyB0ZXh0LnN1YnN0cihpdGVtLmVuZCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0SXRlbXModGV4dDogc3RyaW5nKTogQXJyYXk8VGV4dFByZVByb2Nlc3Nvckl0ZW0+IHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGV4dC5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gLTE7XHJcbiAgICAgICAgdmFyIGNoID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjaCA9IHRleHRbaV07XHJcbiAgICAgICAgICAgIGlmIChjaCA9PSAneycpIHN0YXJ0ID0gaTtcclxuICAgICAgICAgICAgaWYgKGNoID09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBUZXh0UHJlUHJvY2Vzc29ySXRlbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc3RhcnQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmVuZCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXROYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgcmV0dXJuIG5hbWUudHJpbSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjYW5Qcm9jZXNzTmFtZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoID0gbmFtZVtpXTtcclxuICAgICAgICAgICAgLy9UT0RPXHJcbiAgICAgICAgICAgIGlmIChjaCA9PSAnICcgfHwgY2ggPT0gJy0nIHx8IGNoID09ICcmJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RleHRQcmVQcm9jZXNzb3IudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtJdGVtVmFsdWUsIFN1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7Q2hvaWNlc1Jlc3RmdWxsfSBmcm9tIFwiLi9jaG9pY2VzUmVzdGZ1bGxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblNlbGVjdEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICBwcml2YXRlIHZpc2libGVDaG9pY2VzQ2FjaGU6IEFycmF5PEl0ZW1WYWx1ZT4gPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjb21tZW50VmFsdWU6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBjYWNoZWRWYWx1ZTogYW55O1xyXG4gICAgb3RoZXJJdGVtOiBJdGVtVmFsdWUgPSBuZXcgSXRlbVZhbHVlKFwib3RoZXJcIiwgc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIikpO1xyXG4gICAgcHJpdmF0ZSBjaG9pY2VzRnJvbVVybDogQXJyYXk8SXRlbVZhbHVlPiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNhY2hlZFZhbHVlRm9yVXJsUmVxdWVzdGlvbjogYW55ID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlczogQXJyYXk8SXRlbVZhbHVlPiA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICBwdWJsaWMgY2hvaWNlc0J5VXJsOiBDaG9pY2VzUmVzdGZ1bGw7XHJcbiAgICBwdWJsaWMgb3RoZXJFcnJvclRleHQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgY2hvaWNlc09yZGVyVmFsdWU6IHN0cmluZyA9IFwibm9uZVwiO1xyXG4gICAgY2hvaWNlc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc0J5VXJsID0gdGhpcy5jcmVhdGVSZXN0ZnVsbCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmNob2ljZXNCeVVybC5nZXRSZXN1bHRDYWxsYmFjayA9IGZ1bmN0aW9uIChpdGVtczogQXJyYXk8SXRlbVZhbHVlPikgeyBzZWxmLm9uTG9hZENob2ljZXNGcm9tVXJsKGl0ZW1zKSB9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSA/IHRoaXMuZ2V0SGFzT3RoZXIodGhpcy52YWx1ZSkgOiB0aGlzLmdldEhhc090aGVyKHRoaXMuY2FjaGVkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEhhc090aGVyKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVSZXN0ZnVsbCgpOiBDaG9pY2VzUmVzdGZ1bGwgeyByZXR1cm4gbmV3IENob2ljZXNSZXN0ZnVsbCgpOyB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29tbWVudCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpIHJldHVybiBzdXBlci5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tbWVudFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1NldHRpbmdDb21tZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgc2V0Q29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSlcclxuICAgICAgICAgICAgc3VwZXIuc2V0Q29tbWVudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1NldHRpbmdDb21tZW50ICYmIG5ld1ZhbHVlICE9IHRoaXMuY29tbWVudFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2V0dGluZ0NvbW1lbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3RoZXJTZWxlY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWVJbkRhdGEodGhpcy5jYWNoZWRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU2V0dGluZ0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzZXROZXdWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB0aGlzLmNhY2hlZFZhbHVlRm9yVXJsUmVxdWVzdGlvbiA9IG5ld1ZhbHVlOyAgICAgICAgXHJcbiAgICAgICAgc3VwZXIuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGEodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGlmICh0aGlzLmdldFN0b3JlT3RoZXJzQXNDb21tZW50KCkpIHJldHVybiBzdXBlci52YWx1ZUZyb21EYXRhKHZhbCk7XHJcbiAgICAgICAgdGhpcy5jYWNoZWRWYWx1ZSA9IHRoaXMudmFsdWVGcm9tRGF0YUNvcmUodmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRWYWx1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLnZhbHVlVG9EYXRhKHZhbCk7XHJcbiAgICAgICAgdGhpcy5jYWNoZWRWYWx1ZSA9IHZhbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVRvRGF0YUNvcmUodmFsKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZUZyb21EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc1Vua25vd25WYWx1ZSh2YWwpKSByZXR1cm4gdmFsO1xyXG4gICAgICAgIGlmICh2YWwgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWUpIHJldHVybiB2YWw7XHJcbiAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YUNvcmUodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGlmICh2YWwgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWUgJiYgdGhpcy5nZXRDb21tZW50KCkpIHtcclxuICAgICAgICAgICAgdmFsID0gdGhpcy5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgaGFzVW5rbm93blZhbHVlKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmFjdGl2ZUNob2ljZXM7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNbaV0udmFsdWUgPT0gdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZXM7IH1cclxuICAgIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5vblZpc2libGVDaG9pY2VzQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGhhc090aGVyQ2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNob2ljZXNDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgY2hvaWNlc09yZGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNob2ljZXNPcmRlclZhbHVlOyB9XHJcbiAgICBzZXQgY2hvaWNlc09yZGVyKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT0gdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc09yZGVyVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNob2ljZXNDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgb3RoZXJUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm90aGVySXRlbS50ZXh0OyB9XHJcbiAgICBzZXQgb3RoZXJUZXh0KHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vdGhlckl0ZW0udGV4dCA9IHZhbHVlOyB9XHJcbiAgICBnZXQgdmlzaWJsZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc090aGVyICYmIHRoaXMuY2hvaWNlc09yZGVyID09IFwibm9uZVwiKSByZXR1cm4gdGhpcy5hY3RpdmVDaG9pY2VzO1xyXG4gICAgICAgIGlmKCF0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUpIHtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlQ2hvaWNlc0NhY2hlID0gdGhpcy5zb3J0VmlzaWJsZUNob2ljZXModGhpcy5hY3RpdmVDaG9pY2VzLnNsaWNlKCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aXNpYmxlQ2hvaWNlc0NhY2hlLnB1c2godGhpcy5vdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldCBhY3RpdmVDaG9pY2VzKCk6IEFycmF5PEl0ZW1WYWx1ZT4geyByZXR1cm4gdGhpcy5jaG9pY2VzRnJvbVVybCA/IHRoaXMuY2hvaWNlc0Zyb21VcmwgOiB0aGlzLmNob2ljZXM7IH1cclxuICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICBpZiAoIXRoaXMuaXNPdGhlclNlbGVjdGVkIHx8IHRoaXMuY29tbWVudCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciB0ZXh0ID0gdGhpcy5vdGhlckVycm9yVGV4dDtcclxuICAgICAgICBpZiAoIXRleHQpIHtcclxuICAgICAgICAgICAgdGV4dCA9IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlclJlcXVpcmVkRXJyb3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVycm9ycy5wdXNoKG5ldyBDdXN0b21FcnJvcih0ZXh0KSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSB7IHJldHVybiB0aGlzLnN0b3JlT3RoZXJzQXNDb21tZW50ICYmICh0aGlzLnN1cnZleSAhPSBudWxsID8gdGhpcy5zdXJ2ZXkuc3RvcmVPdGhlcnNBc0NvbW1lbnQgOiB0cnVlKTsgfVxyXG4gICAgb25TdXJ2ZXlMb2FkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNCeVVybCkgdGhpcy5jaG9pY2VzQnlVcmwucnVuKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uTG9hZENob2ljZXNGcm9tVXJsKGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KSB7XHJcbiAgICAgICAgdmFyIGVycm9yQ291bnQgPSB0aGlzLmVycm9ycy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5jaG9pY2VzQnlVcmwgJiYgdGhpcy5jaG9pY2VzQnlVcmwuZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh0aGlzLmNob2ljZXNCeVVybC5lcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlcnJvckNvdW50ID4gMCB8fCB0aGlzLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld0Nob2ljZXMgPSBudWxsO1xyXG4gICAgICAgIGlmIChhcnJheSAmJiBhcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIG5ld0Nob2ljZXMgPSBuZXcgQXJyYXk8SXRlbVZhbHVlPigpO1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YShuZXdDaG9pY2VzLCBhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2hvaWNlc0Zyb21VcmwgPSBuZXdDaG9pY2VzO1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hvaWNlc0NoYW5nZWQoKTtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZWRWYWx1ZUZvclVybFJlcXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuY2FjaGVkVmFsdWVGb3JVcmxSZXF1ZXN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgb25WaXNpYmxlQ2hvaWNlc0NoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlQ2hvaWNlc0NhY2hlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzb3J0VmlzaWJsZUNob2ljZXMoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICB2YXIgb3JkZXIgPSB0aGlzLmNob2ljZXNPcmRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChvcmRlciA9PSBcImFzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIDEpO1xyXG4gICAgICAgIGlmIChvcmRlciA9PSBcImRlc2NcIikgcmV0dXJuIHRoaXMuc29ydEFycmF5KGFycmF5LCAtMSk7XHJcbiAgICAgICAgaWYgKG9yZGVyID09IFwicmFuZG9tXCIpIHJldHVybiB0aGlzLnJhbmRvbWl6ZUFycmF5KGFycmF5KTtcclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNvcnRBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPiwgbXVsdDogbnVtYmVyKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgaWYgKGEudGV4dCA8IGIudGV4dCkgcmV0dXJuIC0xICogbXVsdDtcclxuICAgICAgICAgICAgaWYgKGEudGV4dCA+IGIudGV4dCkgcmV0dXJuIDEgKiBtdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmFuZG9taXplQXJyYXkoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICBmb3IgKHZhciBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgICAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gICAgICAgICAgICBhcnJheVtqXSA9IHRlbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgIHByaXZhdGUgY29sQ291bnRWYWx1ZTogbnVtYmVyID0gMTtcclxuICAgIGNvbENvdW50Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzZWxlY3RiYXNlXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcImhhc090aGVyOmJvb2xlYW5cIixcclxuICAgIHsgbmFtZTogXCJjaG9pY2VzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmouY2hvaWNlcyA9IHZhbHVlOyB9fSxcclxuICAgIHsgbmFtZTogXCJjaG9pY2VzT3JkZXJcIiwgZGVmYXVsdDogXCJub25lXCIsIGNob2ljZXM6IFtcIm5vbmVcIiwgXCJhc2NcIiwgXCJkZXNjXCIsIFwicmFuZG9tXCJdIH0sXHJcbiAgICB7IG5hbWU6IFwiY2hvaWNlc0J5VXJsOnJlc3RmdWxsXCIsIGNsYXNzTmFtZTogXCJDaG9pY2VzUmVzdGZ1bGxcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY2hvaWNlc0J5VXJsLmlzRW1wdHkgPyBudWxsIDogb2JqLmNob2ljZXNCeVVybDsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzQnlVcmwuc2V0RGF0YSh2YWx1ZSk7IH0gfSxcclxuICAgIHsgbmFtZTogXCJvdGhlclRleHRcIiwgZGVmYXVsdDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVySXRlbVRleHRcIikgfSwgXCJvdGhlckVycm9yVGV4dFwiLFxyXG4gICAgeyBuYW1lOiBcInN0b3JlT3RoZXJzQXNDb21tZW50OmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZX1dLCBudWxsLCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94YmFzZVwiLCBbeyBuYW1lOiBcImNvbENvdW50Om51bWJlclwiLCBkZWZhdWx0OiAxLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfV0sIG51bGwsIFwic2VsZWN0YmFzZVwiKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9iYXNlc2VsZWN0LnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gJy4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtIYXNoVGFibGV9IGZyb20gXCIuL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkZhY3Rvcnkge1xyXG4gICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogUXVlc3Rpb25GYWN0b3J5ID0gbmV3IFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBEZWZhdWx0Q2hvaWNlcyA9IFtcIm9uZVwiLCBcInR3b3xzZWNvbmQgdmFsdWVcIiwgXCJ0aHJlZXx0aGlyZCB2YWx1ZVwiXTtcclxuICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2U+ID0ge307XHJcblxyXG4gICAgcHVibGljIHJlZ2lzdGVyUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uQ3JlYXRvcjogKG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdID0gcXVlc3Rpb25DcmVhdG9yO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEFsbFR5cGVzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMuY3JlYXRvckhhc2gpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgdmFyIGNyZWF0b3IgPSB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV07XHJcbiAgICAgICAgaWYgKGNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbmZhY3RvcnkudHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UsXHJcbiAgICBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSxcclxuICAgIElNYXRyaXhEcm9wZG93bkRhdGFcclxufSBmcm9tIFwiLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93blJvd01vZGVsIGV4dGVuZHMgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZTsgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlIGltcGxlbWVudHMgSU1hdHJpeERyb3Bkb3duRGF0YSB7XHJcbiAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIm1hdHJpeGRyb3Bkb3duXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCByb3dzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZW5lcmF0ZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbD4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbD4oKTtcclxuICAgICAgICBpZiAoIXRoaXMucm93cyB8fCB0aGlzLnJvd3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucm93c1tpXS52YWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMucm93c1tpXS52YWx1ZSwgdGhpcy5yb3dzW2ldLnRleHQsIHZhbFt0aGlzLnJvd3NbaV0udmFsdWVdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhEcm9wZG93blJvd01vZGVsKG5hbWUsIHRleHQsIHRoaXMsIHZhbHVlKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duXCIsIFt7IG5hbWU6IFwicm93czppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLnJvd3MgPSB2YWx1ZTsgfX1dLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbChcIlwiKTsgfSwgXCJtYXRyaXhkcm9wZG93bmJhc2VcIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fbWF0cml4ZHJvcGRvd24udHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UsXHJcbiAgICBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgSU1hdHJpeERyb3Bkb3duRGF0YVxyXG59IGZyb20gXCIuL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge1N1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4RHluYW1pY1Jvd01vZGVsIGV4dGVuZHMgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIsIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihkYXRhLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJvd05hbWUoKSB7IHJldHVybiBcInJvd1wiICsgdGhpcy5pbmRleDsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlIGltcGxlbWVudHMgSU1hdHJpeERyb3Bkb3duRGF0YSB7XHJcbiAgICBzdGF0aWMgTWF4Um93Q291bnQgPSAxMDA7XHJcbiAgICBwcml2YXRlIHJvd0NvdW50ZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSByb3dDb3VudFZhbHVlOiBudW1iZXIgPSAyO1xyXG4gICAgcHJpdmF0ZSBhZGRSb3dUZXh0VmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwcml2YXRlIHJlbW92ZVJvd1RleHRWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBtaW5Sb3dDb3VudCA9IDA7XHJcbiAgICBwdWJsaWMgcm93Q291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIm1hdHJpeGR5bmFtaWNcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcm93Q291bnQoKSB7IHJldHVybiB0aGlzLnJvd0NvdW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgcm93Q291bnQodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsIDwgMCB8fCB2YWwgPiBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbC5NYXhSb3dDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucm93Q291bnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA+IHZhbCkge1xyXG4gICAgICAgICAgICB2YXIgcVZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIHFWYWwuc3BsaWNlKHZhbCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBxVmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJvd0NvdW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRSb3coKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KG51bGwpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb3dDb3VudCsrO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZVJvdyhpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnJvd0NvdW50KSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgJiYgaW5kZXggPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB2YWwuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgdmFsID0gdGhpcy5kZWxldGVSb3dWYWx1ZSh2YWwsIG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvd0NvdW50LS07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGFkZFJvd1RleHQoKSB7IHJldHVybiB0aGlzLmFkZFJvd1RleHRWYWx1ZSA/IHRoaXMuYWRkUm93VGV4dFZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcImFkZFJvd1wiKTsgfVxyXG4gICAgcHVibGljIHNldCBhZGRSb3dUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmFkZFJvd1RleHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByZW1vdmVSb3dUZXh0KCkgeyByZXR1cm4gdGhpcy5yZW1vdmVSb3dUZXh0VmFsdWUgPyB0aGlzLnJlbW92ZVJvd1RleHRWYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZW1vdmVSb3dcIik7IH1cclxuICAgIHB1YmxpYyBzZXQgcmVtb3ZlUm93VGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVSb3dUZXh0VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgICByZXR1cm4gZmFsc2U7ICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNhY2hlZFZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgJiYgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gdGhpcy5yb3dDb3VudCkgcmV0dXJuIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVJvd3M7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNFcnJvckluUm93cygpKSB7XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBDdXN0b21FcnJvcihzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWluUm93Q291bnRFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1pblJvd0NvdW50KSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgaGFzRXJyb3JJblJvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMubWluUm93Q291bnQgPD0gMCB8fCAhdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciByZXMgPSBmYWxzZTtcclxuICAgICAgICB2YXIgc2V0Um93Q291bnQgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIHJvd0luZGV4ID0gMDsgcm93SW5kZXggPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgcm93SW5kZXgrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tyb3dJbmRleF07XHJcbiAgICAgICAgICAgIGlmICghcm93LmlzRW1wdHkpIHNldFJvd0NvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZXRSb3dDb3VudCA8IHRoaXMubWluUm93Q291bnQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVSb3dzKCk6IEFycmF5PE1hdHJpeER5bmFtaWNSb3dNb2RlbD4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4RHluYW1pY1Jvd01vZGVsPigpO1xyXG4gICAgICAgIGlmICh0aGlzLnJvd0NvdW50ID09PSAwKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzLmNyZWF0ZU5ld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlTWF0cml4Um93KHRoaXMuZ2V0Um93VmFsdWVCeUluZGV4KHZhbCwgaSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3codmFsdWU6IGFueSk6IE1hdHJpeER5bmFtaWNSb3dNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhEeW5hbWljUm93TW9kZWwodGhpcy5yb3dDb3VudGVyICsrLCB0aGlzLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVWYWx1ZUNoYW5nZWQodmFsOiBhbnkpIHtcclxuICAgICAgICB2YXIgbmV3Um93Q291bnQgPSB2YWwgJiYgQXJyYXkuaXNBcnJheSh2YWwpID8gdmFsLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgaWYgKG5ld1Jvd0NvdW50IDw9IHRoaXMucm93Q291bnQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJvd0NvdW50VmFsdWUgPSBuZXdSb3dDb3VudDtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gdGhpcy52aXNpYmxlUm93cztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3VmFsdWUoY3VyVmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGN1clZhbHVlO1xyXG4gICAgICAgIGlmICghcmVzdWx0KSByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgciA9IFtdO1xyXG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID4gdGhpcy5yb3dDb3VudCkgcmVzdWx0LnNwbGljZSh0aGlzLnJvd0NvdW50IC0gMSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHJlc3VsdC5sZW5ndGg7IGkgPCB0aGlzLnJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRlbGV0ZVJvd1ZhbHVlKG5ld1ZhbHVlOiBhbnksIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UpOiBhbnkge1xyXG4gICAgICAgIHZhciBpc0VtcHR5ID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld1ZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhuZXdWYWx1ZVtpXSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzRW1wdHkgPyBudWxsIDogbmV3VmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRSb3dWYWx1ZUJ5SW5kZXgocXVlc3Rpb25WYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKTogYW55IHtcclxuICAgICAgICByZXR1cm4gaW5kZXggPj0gMCAmJiBpbmRleCA8IHF1ZXN0aW9uVmFsdWUubGVuZ3RoID8gcXVlc3Rpb25WYWx1ZVtpbmRleF0gOiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFJvd1ZhbHVlKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIHF1ZXN0aW9uVmFsdWU6IGFueSwgY3JlYXRlOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlLCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmluZGV4T2Yocm93KSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkeW5hbWljXCIsIFt7IG5hbWU6IFwicm93Q291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDIgfSwgeyBuYW1lOiBcIm1pblJvd0NvdW50Om51bWJlclwiLCBkZWZhdWx0OiAwIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImFkZFJvd1RleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouYWRkUm93VGV4dFZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcInJlbW92ZVJvd1RleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucmVtb3ZlUm93VGV4dFZhbHVlOyB9IH1dLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsKFwiXCIpOyB9LCBcIm1hdHJpeGRyb3Bkb3duYmFzZVwiKTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4ZHluYW1pY1wiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fbWF0cml4ZHluYW1pYy50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgSXRlbVZhbHVlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1N1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tICcuL3N1cnZleVN0cmluZ3MnO1xyXG5pbXBvcnQge0N1c3RvbUVycm9yfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYXRyaXhEYXRhIHtcclxuICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvd01vZGVsKTtcclxufVxyXG5leHBvcnQgY2xhc3MgTWF0cml4Um93TW9kZWwgZXh0ZW5kcyBCYXNlIHtcclxuICAgIHByaXZhdGUgZGF0YTogSU1hdHJpeERhdGE7XHJcbiAgICBwcm90ZWN0ZWQgcm93VmFsdWU6IGFueTsgXHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgcHVibGljIGZ1bGxOYW1lOiBzdHJpbmcsIGRhdGE6IElNYXRyaXhEYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMucm93VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnJvd1ZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSkgdGhpcy5kYXRhLm9uTWF0cml4Um93Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEYXRhIHtcclxuICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByb3dzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgZ2VuZXJhdGVkVmlzaWJsZVJvd3M6IEFycmF5PE1hdHJpeFJvd01vZGVsPjtcclxuICAgIHB1YmxpYyBpc0FsbFJvd1JlcXVpcmVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIm1hdHJpeFwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNSb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvd3NWYWx1ZS5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbHVtbnMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNvbHVtbnNWYWx1ZTsgfVxyXG4gICAgc2V0IGNvbHVtbnMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNvbHVtbnNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlUm93cygpOiBBcnJheTxNYXRyaXhSb3dNb2RlbD4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4Um93TW9kZWw+KCk7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdGhpcy5uYW1lICsgJ18nICsgdGhpcy5yb3dzW2ldLnZhbHVlLnRvU3RyaW5nKCksIHZhbFt0aGlzLnJvd3NbaV0udmFsdWVdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCwgXCJcIiwgdGhpcy5uYW1lLCB2YWwpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyA9IHJlc3VsdDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0aGlzLmhhc1ZhbHVlc0luQWxsUm93cygpOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNFcnJvckluUm93cygpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZXF1aXJlZEluQWxsUm93c0Vycm9yXCIpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNFcnJvckluUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBbGxSb3dSZXF1aXJlZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5oYXNWYWx1ZXNJbkFsbFJvd3MoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaGFzVmFsdWVzSW5BbGxSb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByb3dzID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cztcclxuICAgICAgICBpZiAoIXJvd3MpIHJvd3MgPSB0aGlzLnZpc2libGVSb3dzO1xyXG4gICAgICAgIGlmICghcm93cykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSByb3dzW2ldLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIGZ1bGxOYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhSb3dNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhSb3dNb2RlbChuYW1lLCB0ZXh0LCBmdWxsTmFtZSwgdGhpcywgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcgfHwgISh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB8fCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgaWYgKHRoaXMucm93cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzWzBdLnZhbHVlID0gdmFsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93VmFsID0gdmFsW3Jvdy5uYW1lXSA/IHZhbFtyb3cubmFtZV0gOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS52YWx1ZSA9IHJvd1ZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vSU1hdHJpeERhdGFcclxuICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvd01vZGVsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShyb3cudmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbmV3VmFsdWVbcm93Lm5hbWVdID0gcm93LnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhcIiwgW3sgbmFtZTogXCJjb2x1bW5zOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY29sdW1ucyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmouY29sdW1ucyA9IHZhbHVlOyB9fSxcclxuICAgIHsgbmFtZTogXCJyb3dzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucm93cyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9IH0sXHJcbiAgICBcImlzQWxsUm93UmVxdWlyZWQ6Ym9vbGVhblwiXSwgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXhNb2RlbChuYW1lKTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5jb2x1bW5zID0gW1wiQ29sdW1uIDFcIiwgXCJDb2x1bW4gMlwiLCBcIkNvbHVtbiAzXCJdOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fbWF0cml4LnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7U3VydmV5VmFsaWRhdG9yLCBJVmFsaWRhdG9yT3duZXIsIFZhbGlkYXRvclJ1bm5lcn0gZnJvbSBcIi4vdmFsaWRhdG9yXCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgc2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJVmFsaWRhdG9yT3duZXIge1xyXG4gICAgcHJpdmF0ZSBkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YTtcclxuICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHBsYWNlSG9sZGVyOiBzdHJpbmc7XHJcbiAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+ID0gbmV3IEFycmF5PFN1cnZleVZhbGlkYXRvcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0aXRlbVwiO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1RleHQ6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdUZXh0OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgPyB0aGlzLmRhdGEuZ2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lKSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgIH1cclxuICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgaXRlbVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgcHJpdmF0ZSBpdGVtc1ZhbHVlczogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPiA9IG5ldyBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+KCk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dFwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpdGVtcygpOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+IHsgcmV0dXJuIHRoaXMuaXRlbXNWYWx1ZXM7IH1cclxuICAgIHB1YmxpYyBzZXQgaXRlbXModmFsdWU6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4pIHtcclxuICAgICAgICB0aGlzLml0ZW1zVmFsdWVzID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkSXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlVGV4dEl0ZW0obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuICAgIC8vVE9ETy1yZW1vdmUgbGF0ZXIuIERlbGF5IHJlbW92aW5nIGluIGNhc2Ugc29tZWJvZHkgdXNlIHRoaXMgZnVuY3Rpb24uXHJcbiAgICBwcml2YXRlIEFkZEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7IHJldHVybiB0aGlzLmFkZEl0ZW0obmFtZSwgdGl0bGUpOyB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1zW2ldLnZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsdWUgPCAxIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJvd3MoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgdmFyIGNvbENvdW50ID0gdGhpcy5jb2xDb3VudDtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goW10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXS5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IGNvbENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1WYWx1ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0SXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbU1vZGVsKG5hbWUsIHRpdGxlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkl0ZW1WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiAodGhpcy5pdGVtc1tpXS5uYW1lIGluIHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pdGVtc1tpXS5vblZhbHVlQ2hhbmdlZChpdGVtVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBydW5WYWxpZGF0b3JzKCk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8vSU11bHRpcGxlVGV4dERhdGFcclxuICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbbmFtZV07XHJcbiAgICB9XHJcbiAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dGl0ZW1cIiwgW1wibmFtZVwiLCBcInBsYWNlSG9sZGVyXCIsIHsgbmFtZTogXCJ0aXRsZVwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICB7IG5hbWU6IFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dmFsaWRhdG9yXCIsIGNsYXNzTmFtZVBhcnQ6IFwidmFsaWRhdG9yXCIgfV0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtTW9kZWwoXCJcIik7IH0pO1xyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dFwiLCBbeyBuYW1lOiBcIiFpdGVtczp0ZXh0aXRlbXNcIiwgY2xhc3NOYW1lOiBcIm11bHRpcGxldGV4dGl0ZW1cIiB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJpdGVtU2l6ZTpudW1iZXJcIiwgZGVmYXVsdDogMjUgfSwgeyBuYW1lOiBcImNvbENvdW50Om51bWJlclwiLCBkZWZhdWx0OiAxLCBjaG9pY2VzOiBbMSwgMiwgMywgNF0gfV0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibXVsdGlwbGV0ZXh0XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwobmFtZSk7IHEuYWRkSXRlbShcInRleHQxXCIpOyBxLmFkZEl0ZW0oXCJ0ZXh0MlwiKTsgcmV0dXJuIHE7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX211bHRpcGxldGV4dC50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge0Jhc2UsIElQYWdlLCBJQ29uZGl0aW9uUnVubmVyLCBJU3VydmV5LCBJUXVlc3Rpb24sIEhhc2hUYWJsZSwgU3VydmV5RWxlbWVudCwgU3VydmV5UGFnZUlkfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi9xdWVzdGlvbmJhc2VcIjtcclxuaW1wb3J0IHtDb25kaXRpb25SdW5uZXJ9IGZyb20gXCIuL2NvbmRpdGlvbnNcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUm93TW9kZWwge1xyXG4gICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFnZTogUGFnZU1vZGVsLCBwdWJsaWMgcXVlc3Rpb246IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnJvd1Zpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Sb3dWaXNpYmlsaXR5Q2hhbmdlZCgpOyB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25zOiBBcnJheTxRdWVzdGlvbkJhc2U+ID0gW107XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCB2aXNpYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWwgPT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgdXBkYXRlVmlzaWJsZSgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0aGlzLmNhbGNWaXNpYmxlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRXaWR0aCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFF1ZXN0aW9uKHE6IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2gocSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WaXNpYmxlQ2hhbmdlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKSB0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRXaWR0aCgpIHtcclxuICAgICAgICB2YXIgdmlzQ291bnQgPSB0aGlzLmdldFZpc2libGVDb3VudCgpO1xyXG4gICAgICAgIGlmICh2aXNDb3VudCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUXVlc3Rpb25WaXNpYmxlKHRoaXMucXVlc3Rpb25zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0ucmVuZGVyV2lkdGggPSB0aGlzLnF1ZXN0aW9uLndpZHRoID8gdGhpcy5xdWVzdGlvbi53aWR0aCA6IE1hdGguZmxvb3IoMTAwIC8gdmlzQ291bnQpICsgJyUnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0ucmlnaHRJbmRlbnQgPSBjb3VudGVyIDwgdmlzQ291bnQgLSAxID8gMSA6IDA7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Sb3dWaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLnBhZ2Uub25Sb3dWaXNpYmlsaXR5Q2hhbmdlZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmlzaWJsZUNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHJlcyA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1F1ZXN0aW9uVmlzaWJsZSh0aGlzLnF1ZXN0aW9uc1tpXSkpIHJlcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1F1ZXN0aW9uVmlzaWJsZShxOiBRdWVzdGlvbkJhc2UpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZS5pc1F1ZXN0aW9uVmlzaWJsZShxKTsgfVxyXG4gICAgcHJpdmF0ZSBjYWxjVmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuZ2V0VmlzaWJsZUNvdW50KCkgPiAwOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYWdlTW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVBhZ2UsIElDb25kaXRpb25SdW5uZXIge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcGFnZUNvdW50ZXIgPSAxMDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRQYWdlSWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJzcF9cIiArIFBhZ2VNb2RlbC5wYWdlQ291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaWRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSByb3dWYWx1ZXM6IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+ID0gbnVsbDtcclxuICAgIHByaXZhdGUgY29uZGl0aW9uUnVubmVyOiBDb25kaXRpb25SdW5uZXIgPSBudWxsO1xyXG4gICAgcXVlc3Rpb25zOiBBcnJheTxRdWVzdGlvbkJhc2U+ID0gbmV3IEFycmF5PFF1ZXN0aW9uQmFzZT4oKTtcclxuICAgIHB1YmxpYyBkYXRhOiBJU3VydmV5ID0gbnVsbDtcclxuICAgIHB1YmxpYyB2aXNpYmxlSWY6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgbmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5OiBzdHJpbmcgPSBcImluaGVyaXRcIjtcclxuXHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIHByaXZhdGUgbnVtVmFsdWU6IG51bWJlciA9IC0xO1xyXG4gICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZyA9IFwiXCIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuaWRWYWx1ZSA9IFBhZ2VNb2RlbC5nZXRQYWdlSWQoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNldERhdGEoc2VsZi5kYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWRWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCByb3dzKCk6IEFycmF5PFF1ZXN0aW9uUm93TW9kZWw+IHtcclxuICAgICAgICB0aGlzLnJvd1ZhbHVlcyA9IHRoaXMuYnVpbGRSb3dzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93VmFsdWVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0FjdGl2ZSgpIHsgcmV0dXJuICghdGhpcy5kYXRhKSB8fCB0aGlzLmRhdGEuY3VycmVudFBhZ2UgPT0gdGhpczsgfVxyXG4gICAgcHVibGljIGlzUXVlc3Rpb25WaXNpYmxlKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBib29sZWFuIHsgcmV0dXJuIHF1ZXN0aW9uLnZpc2libGUgfHwgdGhpcy5pc0Rlc2lnbk1vZGU7IH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVSb3cocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IFF1ZXN0aW9uUm93TW9kZWwgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUm93TW9kZWwodGhpcywgcXVlc3Rpb24pOyB9XHJcbiAgICBwcml2YXRlIGdldCBpc0Rlc2lnbk1vZGUoKSB7IHJldHVybiB0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmlzRGVzaWduTW9kZTsgfVxyXG4gICAgcHJpdmF0ZSBidWlsZFJvd3MoKTogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4oKTtcclxuICAgICAgICB2YXIgbGFzdFJvd1Zpc2libGVJbmRleCA9IC0xO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxID0gdGhpcy5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY3JlYXRlUm93KHEpKTtcclxuICAgICAgICAgICAgaWYgKHEuc3RhcnRXaXRoTmV3TGluZSkge1xyXG4gICAgICAgICAgICAgICAgbGFzdFJvd1Zpc2libGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0uYWRkUXVlc3Rpb24ocSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdFJvd1Zpc2libGVJbmRleCA8IDApIGxhc3RSb3dWaXNpYmxlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2xhc3RSb3dWaXNpYmxlSW5kZXhdLmFkZFF1ZXN0aW9uKHEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpXS5zZXRXaWR0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgb25Sb3dWaXNpYmlsaXR5Q2hhbmdlZChyb3c6IFF1ZXN0aW9uUm93TW9kZWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmUgfHwgIXRoaXMucm93VmFsdWVzKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5yb3dWYWx1ZXMuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBpbmRleDsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucm93VmFsdWVzW2ldLnF1ZXN0aW9ucy5pbmRleE9mKHJvdy5xdWVzdGlvbikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXNbaV0udXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEucHJvY2Vzc1RleHQodGhpcy50aXRsZSkgOiB0aGlzLnRpdGxlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IG51bSgpIHsgcmV0dXJuIHRoaXMubnVtVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbnVtKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5udW1WYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMubnVtVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm9uTnVtQ2hhbmdlZCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEucGFnZVZpc2liaWxpdHlDaGFuZ2VkKHRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicGFnZVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHsgIHJldHVybiB0aGlzLmdldElzUGFnZVZpc2libGUobnVsbCk7IH1cclxuICAgIHB1YmxpYyBnZXRJc1BhZ2VWaXNpYmxlKGV4Y2VwdGlvblF1ZXN0aW9uOiBJUXVlc3Rpb24pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldID09IGV4Y2VwdGlvblF1ZXN0aW9uKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UsIGluZGV4OiBudW1iZXIgPSAtMSkge1xyXG4gICAgICAgIGlmIChxdWVzdGlvbiA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnF1ZXN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAwLCBxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5zZXREYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5xdWVzdGlvbkFkZGVkKHF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZE5ld1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgICAgIHRoaXMuYWRkUXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW1vdmVRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB0aGlzLmRhdGEucXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBmb2N1c0ZpcnN0UXVlc3Rpb24oKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbi52aXNpYmxlIHx8ICFxdWVzdGlvbi5oYXNJbnB1dCkgY29udGludWU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBmb2N1c0ZpcnN0RXJyb3JRdWVzdGlvbigpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSB8fCB0aGlzLnF1ZXN0aW9uc1tpXS5jdXJyZW50RXJyb3JDb3VudCA9PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0uZm9jdXModHJ1ZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzY3JvbGxUb1RvcCgpIHtcclxuICAgICAgICBTdXJ2ZXlFbGVtZW50LlNjcm9sbEVsZW1lbnRUb1RvcChTdXJ2ZXlQYWdlSWQpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGhhc0Vycm9ycyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4gPSB0cnVlLCBmb2N1c2VPbkZpcnN0RXJyb3I6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgZmlyc3RFcnJvclF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHRoaXMucXVlc3Rpb25zW2ldLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9jdXNlT25GaXJzdEVycm9yICYmIGZpcnN0RXJyb3JRdWVzdGlvbiA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RFcnJvclF1ZXN0aW9uID0gdGhpcy5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmaXJzdEVycm9yUXVlc3Rpb24pIGZpcnN0RXJyb3JRdWVzdGlvbi5mb2N1cyh0cnVlKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFF1ZXN0aW9uc1RvTGlzdChsaXN0OiBBcnJheTxJUXVlc3Rpb24+LCB2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMucXVlc3Rpb25zW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25OdW1DaGFuZ2VkKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicGFnZVwiLCBbXCJuYW1lXCIsIHsgbmFtZTogXCJuYXZpZ2F0aW9uQnV0dG9uc1Zpc2liaWxpdHlcIiwgZGVmYXVsdDogXCJpbmhlcml0XCIsIGNob2ljZXM6IFtcImloZXJpdFwiLCBcInNob3dcIiwgXCJoaWRlXCJdfSwgeyBuYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIgfSwgeyBuYW1lOiBcInZpc2libGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwidmlzaWJsZUlmXCIsIFwidGl0bGVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlTW9kZWwoKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcGFnZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25DaGVja2JveEJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SGFzT3RoZXIodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHZhbC5pbmRleE9mKHRoaXMub3RoZXJJdGVtLnZhbHVlKSA+PSAwO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gdmFsO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNVbmtub3duVmFsdWUodmFsW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHZhbC5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhdmFsLmxlbmd0aCkgcmV0dXJuIHZhbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDb21tZW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gdmFsLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJjaGVja2JveFwiO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaGVja2JveFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ2hlY2tib3hNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9jaGVja2JveC50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICBwdWJsaWMgcm93czogbnVtYmVyID0gNDtcclxuICAgIHB1YmxpYyBjb2xzOiBudW1iZXIgPSA1MDtcclxuICAgIHB1YmxpYyBwbGFjZUhvbGRlcjogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJjb21tZW50XCI7XHJcbiAgICB9XHJcbiAgICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5pc0VtcHR5KCkgfHwgdGhpcy52YWx1ZSA9PSBcIlwiO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21tZW50XCIsIFt7IG5hbWU6IFwiY29sczpudW1iZXJcIiwgZGVmYXVsdDogNTAgfSwgeyBuYW1lOiBcInJvd3M6bnVtYmVyXCIsIGRlZmF1bHQ6IDQgfSwgXCJwbGFjZUhvbGRlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNvbW1lbnRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnRNb2RlbChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fY29tbWVudC50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25TZWxlY3RCYXNlfSBmcm9tIFwiLi9xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25Ecm9wZG93bk1vZGVsIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgIHByaXZhdGUgb3B0aW9uc0NhcHRpb25WYWx1ZTogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBvcHRpb25zQ2FwdGlvbigpIHsgcmV0dXJuICh0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUpID8gdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wdGlvbnNDYXB0aW9uXCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiZHJvcGRvd25cIjtcclxuICAgIH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJkcm9wZG93blwiLCBbeyBuYW1lOiBcIm9wdGlvbnNDYXB0aW9uXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLm9wdGlvbnNDYXB0aW9uVmFsdWU7IH19XSxcclxuICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwoXCJcIik7IH0sIFwic2VsZWN0YmFzZVwiKTtcclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX2Ryb3Bkb3duLnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge0N1c3RvbUVycm9yLCBFeGNlZWRTaXplRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25GaWxlTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICBwcml2YXRlIHNob3dQcmV2aWV3VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaXNVcGxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByZXZpZXdWYWx1ZUxvYWRlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcHVibGljIGltYWdlSGVpZ2h0OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaW1hZ2VXaWR0aDogc3RyaW5nO1xyXG4gICAgcHVibGljIHN0b3JlRGF0YUFzVGV4dDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBtYXhTaXplOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcImZpbGVcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd1ByZXZpZXcoKSB7IHJldHVybiB0aGlzLnNob3dQcmV2aWV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd1ByZXZpZXcodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5zaG93UHJldmlld1ZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBsb2FkRmlsZShmaWxlOiBGaWxlKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSAmJiAhdGhpcy5zdXJ2ZXkudXBsb2FkRmlsZSh0aGlzLm5hbWUsIGZpbGUsIHRoaXMuc3RvcmVEYXRhQXNUZXh0LCBmdW5jdGlvbiAoc3RhdHVzOiBzdHJpbmcpIHsgc2VsZi5pc1VwbG9hZGluZyA9IHN0YXR1cyA9PSBcInVwbG9hZGluZ1wiOyAgfSkpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldEZpbGVWYWx1ZShmaWxlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBwcmV2aWV3VmFsdWU6IGFueTtcclxuICAgIHByb3RlY3RlZCBzZXRGaWxlVmFsdWUoZmlsZTogRmlsZSkge1xyXG4gICAgICAgIGlmICghRmlsZVJlYWRlcikgcmV0dXJuO1xyXG4gICAgICAgIGlmICghdGhpcy5zaG93UHJldmlldyAmJiAhdGhpcy5zdG9yZURhdGFBc1RleHQpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5jaGVja0ZpbGVGb3JFcnJvcnMoZmlsZSkpIHJldHVybjtcclxuICAgICAgICB2YXIgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuc2hvd1ByZXZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucHJldmlld1ZhbHVlID0gc2VsZi5pc0ZpbGVJbWFnZShmaWxlKSA/IGZpbGVSZWFkZXIucmVzdWx0IDogbnVsbDtcclxuICAgICAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYucHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxmLnN0b3JlRGF0YUFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi52YWx1ZSA9IGZpbGVSZWFkZXIucmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzVXBsb2FkaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cGxvYWRpbmdGaWxlXCIpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja0ZpbGVGb3JFcnJvcnMoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBlcnJvckxlbmd0aCA9IHRoaXMuZXJyb3JzID8gdGhpcy5lcnJvcnMubGVuZ3RoIDogMDtcclxuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLm1heFNpemUgPiAwICYmIGZpbGUuc2l6ZSA+IHRoaXMubWF4U2l6ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBFeGNlZWRTaXplRXJyb3IodGhpcy5tYXhTaXplKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlcnJvckxlbmd0aCAhPSB0aGlzLmVycm9ycy5sZW5ndGggfHwgdGhpcy5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmVycm9yc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc0ZpbGVJbWFnZShmaWxlOiBGaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlIHx8ICFmaWxlLnR5cGUpIHJldHVybjtcclxuICAgICAgICB2YXIgc3RyID0gZmlsZS50eXBlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgcmV0dXJuIHN0ci5pbmRleE9mKFwiaW1hZ2VcIikgPT0gMDtcclxuICAgIH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZmlsZVwiLCBbXCJzaG93UHJldmlldzpib29sZWFuXCIsIFwiaW1hZ2VIZWlnaHRcIiwgXCJpbWFnZVdpZHRoXCIsIFwic3RvcmVEYXRhQXNUZXh0OmJvb2xlYW5cIiwgXCJtYXhTaXplOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRmlsZU1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImZpbGVcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGVNb2RlbChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fZmlsZS50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi9xdWVzdGlvbmJhc2VcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkh0bWxNb2RlbCBleHRlbmRzIFF1ZXN0aW9uQmFzZSB7XHJcbiAgICBwcml2YXRlIGh0bWxWYWx1ZTogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJodG1sXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGh0bWwoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaHRtbFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGh0bWwodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaHRtbFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZEh0bWwoKSB7IHJldHVybiB0aGlzLnN1cnZleSA/IHRoaXMuc3VydmV5LnByb2Nlc3NIdG1sKHRoaXMuaHRtbCkgOiB0aGlzLmh0bWw7IH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiaHRtbFwiLCBbXCJodG1sOmh0bWxcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWxNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvbmJhc2VcIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKG5hbWUpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9odG1sLnRzXG4gKiovIiwiaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNoZWNrYm94QmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25fYmFzZXNlbGVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRydWU7IH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7fSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fcmFkaW9ncm91cC50c1xuICoqLyIsImltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25SYXRpbmdNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHN0YXRpYyBkZWZhdWx0UmF0ZVZhbHVlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgIHByaXZhdGUgcmF0ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwdWJsaWMgbWluaW51bVJhdGVEZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBtYXhpbXVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgIHJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHJhdGVWYWx1ZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJhdGVzOyB9XHJcbiAgICBzZXQgcmF0ZVZhbHVlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucmF0ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZpc2libGVSYXRlVmFsdWVzKCk6IEl0ZW1WYWx1ZVtdIHtcclxuICAgICAgICBpZiAodGhpcy5yYXRlVmFsdWVzLmxlbmd0aCA+IDApIHJldHVybiB0aGlzLnJhdGVWYWx1ZXM7XHJcbiAgICAgICAgcmV0dXJuIFF1ZXN0aW9uUmF0aW5nTW9kZWwuZGVmYXVsdFJhdGVWYWx1ZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInJhdGluZ1wiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG59XHJcbkl0ZW1WYWx1ZS5zZXREYXRhKFF1ZXN0aW9uUmF0aW5nTW9kZWwuZGVmYXVsdFJhdGVWYWx1ZXMsIFsxLCAyLCAzLCA0LCA1XSk7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyYXRpbmdcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIHsgbmFtZTogXCJyYXRlVmFsdWVzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucmF0ZVZhbHVlcyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucmF0ZVZhbHVlcyA9IHZhbHVlOyB9fSxcclxuICAgIFwibWluaW51bVJhdGVEZXNjcmlwdGlvblwiLCBcIm1heGltdW1SYXRlRGVzY3JpcHRpb25cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhdGluZ1wiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nTW9kZWwobmFtZSk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX3JhdGluZy50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25UZXh0TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICBwdWJsaWMgaW5wdXRUeXBlOiBzdHJpbmcgPSBcInRleHRcIjtcclxuICAgIHB1YmxpYyBwbGFjZUhvbGRlcjogc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJ0ZXh0XCI7XHJcbiAgICB9XHJcbiAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7IH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuY29ycmVjdFZhbHVlVHlwZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgc3VwZXIuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNvcnJlY3RWYWx1ZVR5cGUobmV3VmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSkgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0VHlwZSA9PSBcIm51bWJlclwiIHx8IHRoaXMuaW5wdXRUeXBlID09IFwicmFuZ2VcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc051bWJlcihuZXdWYWx1ZSkgPyBwYXJzZUZsb2F0KG5ld1ZhbHVlKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0XCIsIFt7IG5hbWU6IFwiaW5wdXRUeXBlXCIsIGRlZmF1bHQ6IFwidGV4dFwiLCBjaG9pY2VzOiBbXCJjb2xvclwiLCBcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiZW1haWxcIiwgXCJtb250aFwiLCBcIm51bWJlclwiLCBcInBhc3N3b3JkXCIsIFwicmFuZ2VcIiwgXCJ0ZWxcIiwgXCJ0ZXh0XCIsIFwidGltZVwiLCBcInVybFwiLCBcIndlZWtcIl0gfSxcclxuICAgIHsgbmFtZTogXCJzaXplOm51bWJlclwiLCBkZWZhdWx0OiAyNSB9LCBcInBsYWNlSG9sZGVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInRleHRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fdGV4dC50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge0Jhc2UsIElTdXJ2ZXksIEhhc2hUYWJsZSwgSVF1ZXN0aW9uLCBJQ29uZGl0aW9uUnVubmVyLCBJUGFnZSwgU3VydmV5RXJyb3IsIEV2ZW50fSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7SVN1cnZleVRyaWdnZXJPd25lciwgU3VydmV5VHJpZ2dlcn0gZnJvbSBcIi4vdHJpZ2dlclwiO1xyXG5pbXBvcnQge1BhZ2VNb2RlbH0gZnJvbSBcIi4vcGFnZVwiO1xyXG5pbXBvcnQge1RleHRQcmVQcm9jZXNzb3J9IGZyb20gXCIuL3RleHRQcmVQcm9jZXNzb3JcIjtcclxuaW1wb3J0IHtQcm9jZXNzVmFsdWV9IGZyb20gXCIuL2NvbmRpdGlvblByb2Nlc3NWYWx1ZVwiO1xyXG5pbXBvcnQge2R4U3VydmV5U2VydmljZX0gZnJvbSBcIi4vZHhTdXJ2ZXlTZXJ2aWNlXCI7XHJcbmltcG9ydCB7SnNvbkVycm9yfSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi9xdWVzdGlvbmJhc2VcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlNb2RlbCBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJU3VydmV5LCBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBzdXJ2ZXlQb3N0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgY2xpZW50SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgY29va2llTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBzZW5kUmVzdWx0T25QYWdlTmV4dDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBjb21tZW50UHJlZml4OiBzdHJpbmcgPSBcIi1Db21tZW50XCI7XHJcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgZm9jdXNGaXJzdFF1ZXN0aW9uQXV0b21hdGljOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBzaG93TmF2aWdhdGlvbkJ1dHRvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHNob3dUaXRsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2hvd1BhZ2VUaXRsZXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGNvbXBsZXRlZEh0bWw6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgcmVxdWlyZWRUZXh0OiBzdHJpbmcgPSBcIipcIjtcclxuICAgIHB1YmxpYyBxdWVzdGlvblN0YXJ0SW5kZXg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25UaXRsZVRlbXBsYXRlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHNob3dQcm9ncmVzc0Jhcjogc3RyaW5nID0gXCJvZmZcIjtcclxuICAgIHB1YmxpYyBzdG9yZU90aGVyc0FzQ29tbWVudDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgZ29OZXh0UGFnZUF1dG9tYXRpYzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIHBhZ2VzOiBBcnJheTxQYWdlTW9kZWw+ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgIHB1YmxpYyB0cmlnZ2VyczogQXJyYXk8U3VydmV5VHJpZ2dlcj4gPSBuZXcgQXJyYXk8U3VydmV5VHJpZ2dlcj4oKTtcclxuICAgIHB1YmxpYyBjbGVhckludmlzaWJsZVZhbHVlczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50UGFnZVZhbHVlOiBQYWdlTW9kZWwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSB2YWx1ZXNIYXNoOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgcHJpdmF0ZSB2YXJpYWJsZXNIYXNoOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgcHJpdmF0ZSBwYWdlUHJldlRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBwYWdlTmV4dFRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBjb21wbGV0ZVRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzaG93UGFnZU51bWJlcnNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBzaG93UXVlc3Rpb25OdW1iZXJzVmFsdWU6IHN0cmluZyA9IFwib25cIjtcclxuICAgIHByaXZhdGUgcXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWU6IHN0cmluZyA9IFwidG9wXCI7XHJcbiAgICBwcml2YXRlIGxvY2FsZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBpc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgcHJvY2Vzc2VkVGV4dFZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgdGV4dFByZVByb2Nlc3NvcjogVGV4dFByZVByb2Nlc3NvcjtcclxuICAgIHByaXZhdGUgaXNWYWxpZGF0aW5nT25TZXJ2ZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBtb2RlVmFsdWU6IHN0cmluZyA9IFwiZWRpdFwiO1xyXG4gICAgcHJpdmF0ZSBpc0Rlc2lnbk1vZGVWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblBhcnRpYWxTZW5kOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvbkN1cnJlbnRQYWdlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uVmFsdWVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uUGFnZVZpc2libGVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25RdWVzdGlvbkFkZGVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25RdWVzdGlvblJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblZhbGlkYXRlUXVlc3Rpb246IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblNlcnZlclZhbGlkYXRlUXVlc3Rpb25zOiAoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnk7XHJcbiAgICBwdWJsaWMgb25Qcm9jZXNzSHRtbDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uU2VuZFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uR2V0UmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25VcGxvYWRGaWxlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMganNvbkVycm9yczogQXJyYXk8SnNvbkVycm9yPiA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3NvciA9IG5ldyBUZXh0UHJlUHJvY2Vzc29yKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmhhc1Byb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3Iub25Qcm9jZXNzID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5nZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZSk7IH07XHJcbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhbHVlLmRhdGEgPSBzZWxmO1xyXG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgdmFsdWUuc2V0T3duZXIoc2VsZik7XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpO1xyXG4gICAgICAgIHRoaXMub25CZWZvcmVDcmVhdGluZygpO1xyXG4gICAgICAgIGlmIChqc29uT2JqKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SnNvbk9iamVjdChqc29uT2JqKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZFN1cnZleUZyb21TZXJ2aWNlKHRoaXMuc3VydmV5SWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3VydmV5XCI7IH1cclxuICAgIHB1YmxpYyBnZXQgbG9jYWxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmxvY2FsZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGxvY2FsZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5sb2NhbGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHN1cnZleUxvY2FsaXphdGlvbi5jdXJyZW50TG9jYWxlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TG9jU3RyaW5nKHN0cjogc3RyaW5nKSB7IHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKHN0cik7IH1cclxuICAgIHB1YmxpYyBnZXQgZW1wdHlTdXJ2ZXlUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmdldExvY1N0cmluZyhcImVtcHR5U3VydmV5XCIpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHBhZ2VQcmV2VGV4dCgpIHsgcmV0dXJuICh0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlKSA/IHRoaXMucGFnZVByZXZUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcInBhZ2VQcmV2VGV4dFwiKTsgfVxyXG4gICAgcHVibGljIHNldCBwYWdlUHJldlRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgcGFnZU5leHRUZXh0KCkgeyByZXR1cm4gKHRoaXMucGFnZU5leHRUZXh0VmFsdWUpID8gdGhpcy5wYWdlTmV4dFRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwicGFnZU5leHRUZXh0XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IHBhZ2VOZXh0VGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMucGFnZU5leHRUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBjb21wbGV0ZVRleHQoKSB7IHJldHVybiAodGhpcy5jb21wbGV0ZVRleHRWYWx1ZSkgPyB0aGlzLmNvbXBsZXRlVGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0ZVRleHRcIik7IH1cclxuICAgIHB1YmxpYyBzZXQgY29tcGxldGVUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5jb21wbGV0ZVRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dQYWdlTnVtYmVycygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd1BhZ2VOdW1iZXJzKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnNob3dQYWdlTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dRdWVzdGlvbk51bWJlcnMoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOyB9O1xyXG4gICAgcHVibGljIHNldCBzaG93UXVlc3Rpb25OdW1iZXJzKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgfTtcclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkVGl0bGUoKSB7IHJldHVybiB0aGlzLnByb2Nlc3NUZXh0KHRoaXMudGl0bGUpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZTsgfTtcclxuICAgIHB1YmxpYyBzZXQgcXVlc3Rpb25UaXRsZUxvY2F0aW9uKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMucXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlID0gdmFsdWU7XHJcbiAgICB9O1xyXG4gICAgcHVibGljIGdldCBtb2RlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm1vZGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBtb2RlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5tb2RlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlICE9IFwiZWRpdFwiICYmIHZhbHVlICE9IFwiZGlzcGxheVwiKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5tb2RlVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGRhdGEoZGF0YTogYW55KSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXNIYXNoID0ge307XHJcbiAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtrZXldID0gZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKGtleSwgZGF0YVtrZXldLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb21tZW50cygpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkuaW5kZXhPZih0aGlzLmNvbW1lbnRQcmVmaXgpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0aGlzLnZhbHVlc0hhc2hba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgZ2V0IHZpc2libGVQYWdlcygpOiBBcnJheTxQYWdlTW9kZWw+IHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiB0aGlzLnBhZ2VzO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMucGFnZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICBwdWJsaWMgZ2V0IFBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmlzaWJsZVBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc2libGVQYWdlcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRQYWdlKCk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZVZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gbnVsbCAmJiB2UGFnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBjdXJyZW50UGFnZSh2YWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZQYWdlcy5pbmRleE9mKHZhbHVlKSA8IDApIHJldHVybjtcclxuICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5jdXJyZW50UGFnZVZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2VDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGN1cnJlbnRQYWdlTm8oKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2VObyh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPj0gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzW3ZhbHVlXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBmb2N1c0ZpcnN0UXVlc3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUuc2Nyb2xsVG9Ub3AoKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlLmZvY3VzRmlyc3RRdWVzdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5pc0xvYWRpbmcpIHJldHVybiBcImxvYWRpbmdcIjtcclxuICAgICAgICBpZiAodGhpcy5pc0NvbXBsZXRlZCkgcmV0dXJuIFwiY29tcGxldGVkXCI7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmN1cnJlbnRQYWdlKSA/IFwicnVubmluZ1wiIDogXCJlbXB0eVwiXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xlYXIoY2xlYXJEYXRhOiBib29sZWFuID0gdHJ1ZSwgZ290b0ZpcnN0UGFnZTogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBpZiAoY2xlYXJEYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzSGFzaCA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKGdvdG9GaXJzdFBhZ2UgJiYgdGhpcy52aXNpYmxlUGFnZUNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy52aXNpYmxlUGFnZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG1lcmdlVmFsdWVzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICBpZiAoIWRlc3QgfHwgIXNyYykgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRlc3Rba2V5XSkgZGVzdFtrZXldID0ge307XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHZhbHVlLCBkZXN0W2tleV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVzdFtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICB0aGlzLm9uQ3VycmVudFBhZ2VDaGFuZ2VkLmZpcmUodGhpcywgeyAnb2xkQ3VycmVudFBhZ2UnOiBvbGRWYWx1ZSwgJ25ld0N1cnJlbnRQYWdlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gMDtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICByZXR1cm4gTWF0aC5jZWlsKChpbmRleCAqIDEwMCAvIHRoaXMudmlzaWJsZVBhZ2VDb3VudCkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc05hdmlnYXRpb25CdXR0b25zU2hvd2luZygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2UubmF2aWdhdGlvbkJ1dHRvbnNWaXNpYmlsaXR5ID09IFwic2hvd1wiIHx8XHJcbiAgICAgICAgICAgIChwYWdlLm5hdmlnYXRpb25CdXR0b25zVmlzaWJpbGl0eSAhPSBcImhpZGVcIiAmJiB0aGlzLnNob3dOYXZpZ2F0aW9uQnV0dG9ucyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRWRpdE1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT0gXCJlZGl0XCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNEaXNwbGF5TW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImRpc3BsYXlcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc0Rlc2lnbk1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRGVzaWduTW9kZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0RGVzaWduTW9kZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNEZXNpZ25Nb2RlVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQ29va2llKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGNvb2tpZXMgPSBkb2N1bWVudC5jb29raWU7XHJcbiAgICAgICAgcmV0dXJuIGNvb2tpZXMgJiYgY29va2llcy5pbmRleE9mKHRoaXMuY29va2llTmFtZSArIFwiPXRydWVcIikgPiAtMTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRDb29raWUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybjtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj10cnVlOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMDowOjAgR01UXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZGVsZXRlQ29va2llKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb29raWVOYW1lKSByZXR1cm47XHJcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5jb29raWVOYW1lICsgXCI9O1wiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIG5leHRQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTGFzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5pc0VkaXRNb2RlICYmIHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmRvU2VydmVyVmFsaWRhdGlvbigpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kb05leHRQYWdlKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNDdXJyZW50UGFnZUhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnModHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcHJldlBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNGaXJzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNvbXBsZXRlTGFzdFBhZ2UoKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRWRpdE1vZGUgJiYgdGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuZG9TZXJ2ZXJWYWxpZGF0aW9uKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7IFxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzTGFzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIHJldHVybiB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSB2UGFnZXMubGVuZ3RoIC0gMTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkb0NvbXBsZXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNsZWFySW52aXNpYmxlVmFsdWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJJbnZpc2libGVRdWVzdGlvblZhbHVlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldENvb2tpZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0Q29tcGxldGVkKCk7XHJcbiAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5UG9zdElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNWYWxpZGF0aW5nT25TZXJ2ZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzVmFsaWRhdGluZ09uU2VydmVyVmFsdWU7IH1cclxuICAgIHByaXZhdGUgc2V0SXNWYWxpZGF0aW5nT25TZXJ2ZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLmlzVmFsaWRhdGluZ09uU2VydmVyKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1ZhbGlkYXRpbmdPblNlcnZlclZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMub25Jc1ZhbGlkYXRpbmdPblNlcnZlckNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbklzVmFsaWRhdGluZ09uU2VydmVyQ2hhbmdlZCgpIHsgfVxyXG4gICAgcHJvdGVjdGVkIGRvU2VydmVyVmFsaWRhdGlvbigpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgZGF0YToge30sIGVycm9yczoge30sIHN1cnZleTogdGhpcywgY29tcGxldGUgOiBmdW5jdGlvbiAoKSB7IHNlbGYuY29tcGxldGVTZXJ2ZXJWYWxpZGF0aW9uKG9wdGlvbnMpOyB9IH07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRQYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmN1cnJlbnRQYWdlLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbi52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSBvcHRpb25zLmRhdGFbcXVlc3Rpb24ubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRJc1ZhbGlkYXRpbmdPblNlcnZlcih0cnVlKTtcclxuICAgICAgICB0aGlzLm9uU2VydmVyVmFsaWRhdGVRdWVzdGlvbnModGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbXBsZXRlU2VydmVyVmFsaWRhdGlvbihvcHRpb25zOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldElzVmFsaWRhdGluZ09uU2VydmVyKGZhbHNlKTtcclxuICAgICAgICBpZiAoIW9wdGlvbnMgJiYgIW9wdGlvbnMuc3VydmV5KSByZXR1cm47XHJcbiAgICAgICAgdmFyIHNlbGYgPSBvcHRpb25zLnN1cnZleTtcclxuICAgICAgICB2YXIgaGFzRXJyb3JzID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gb3B0aW9ucy5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHNlbGYuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb24gJiYgcXVlc3Rpb25bXCJlcnJvcnNcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBoYXNFcnJvcnMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uW1wiYWRkRXJyb3JcIl0obmV3IEN1c3RvbUVycm9yKG9wdGlvbnMuZXJyb3JzW25hbWVdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFoYXNFcnJvcnMpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNMYXN0UGFnZSkgc2VsZi5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIGVsc2Ugc2VsZi5kb05leHRQYWdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRvTmV4dFBhZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja09uUGFnZVRyaWdnZXJzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VuZFJlc3VsdE9uUGFnZU5leHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KHRoaXMuc3VydmV5UG9zdElkLCB0aGlzLmNsaWVudElkLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbaW5kZXggKyAxXTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzZXRDb21wbGV0ZWQoKSB7XHJcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZENvbXBsZXRlZEh0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wbGV0ZWRIdG1sKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NIdG1sKHRoaXMuY29tcGxldGVkSHRtbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIjxoMz5cIiArIHRoaXMuZ2V0TG9jU3RyaW5nKFwiY29tcGxldGluZ1N1cnZleVwiKSArIFwiPC9oMz5cIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkTG9hZGluZ0h0bWwoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCI8aDM+XCIgKyB0aGlzLmdldExvY1N0cmluZyhcImxvYWRpbmdTdXJ2ZXlcIikgKyBcIjwvaDM+XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2dyZXNzVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSArIDE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TG9jU3RyaW5nKFwicHJvZ3Jlc3NUZXh0XCIpW1wiZm9ybWF0XCJdKGluZGV4LCB2UGFnZXMubGVuZ3RoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyB1cGxvYWRGaWxlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKT0+YW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGFjY2VwdCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vblVwbG9hZEZpbGUuZmlyZSh0aGlzLCB7IG5hbWU6IG5hbWUsIGZpbGU6IGZpbGUsIGFjY2VwdDogYWNjZXB0IH0pO1xyXG4gICAgICAgIGlmICghYWNjZXB0KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFzdG9yZURhdGFBc1RleHQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGxvYWRGaWxlQ29yZShuYW1lLCBmaWxlLCB1cGxvYWRpbmdDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwbG9hZEZpbGVDb3JlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgdXBsb2FkaW5nQ2FsbGJhY2s6IChzdGF0dXM6IHN0cmluZykgPT4gYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICh1cGxvYWRpbmdDYWxsYmFjaykgdXBsb2FkaW5nQ2FsbGJhY2soXCJ1cGxvYWRpbmdcIik7XHJcbiAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLnNlbmRGaWxlKHRoaXMuc3VydmV5UG9zdElkLCBmaWxlLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodXBsb2FkaW5nQ2FsbGJhY2spIHVwbG9hZGluZ0NhbGxiYWNrKHN1Y2Nlc3MgPyBcInN1Y2Nlc3NcIiA6IFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIGlmIChzdWNjZXNzKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFZhbHVlKG5hbWUsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZ2V0UGFnZShpbmRleDogbnVtYmVyKTogUGFnZU1vZGVsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tpbmRleF07XHJcbiAgICB9XHJcbiAgICBhZGRQYWdlKHBhZ2U6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIGlmIChwYWdlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB0aGlzLnBhZ2VzLnB1c2gocGFnZSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgfVxyXG4gICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3JlYXRlTmV3UGFnZShuYW1lKTtcclxuICAgICAgICB0aGlzLmFkZFBhZ2UocGFnZSk7XHJcbiAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICB9XHJcbiAgICByZW1vdmVQYWdlKHBhZ2U6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5wYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5wYWdlcy5sZW5ndGggPiAwID8gdGhpcy5wYWdlc1swXSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRRdWVzdGlvbkJ5TmFtZShuYW1lOiBzdHJpbmcsIGNhc2VJbnNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogSVF1ZXN0aW9uIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uTmFtZSA9IHF1ZXN0aW9uc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoY2FzZUluc2Vuc2l0aXZlKSBxdWVzdGlvbk5hbWUgPSBxdWVzdGlvbk5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYocXVlc3Rpb25OYW1lID09IG5hbWUpIHJldHVybiBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFF1ZXN0aW9uc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdLCBjYXNlSW5zZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZSk6IElRdWVzdGlvbltdIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgaWYgKCFuYW1lcykgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZXNbaV0sIGNhc2VJbnNlbnNpdGl2ZSk7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbikgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uOiBJUXVlc3Rpb24pOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5wYWdlc1tpXTtcclxuICAgICAgICAgICAgaWYgKHBhZ2UucXVlc3Rpb25zLmluZGV4T2YoPFF1ZXN0aW9uQmFzZT5xdWVzdGlvbikgPiAtMSkgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFBhZ2VCeU5hbWUobmFtZTogc3RyaW5nKTogUGFnZU1vZGVsIHtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQYWdlc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdKTogUGFnZU1vZGVsW117XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgIGlmIChwYWdlKSByZXN1bHQucHVzaChwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBbGxRdWVzdGlvbnModmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PElRdWVzdGlvbj4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8SVF1ZXN0aW9uPigpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNbaV0uYWRkUXVlc3Rpb25zVG9MaXN0KHJlc3VsdCwgdmlzaWJsZU9ubHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1BhZ2UobmFtZTogc3RyaW5nKSB7IHJldHVybiBuZXcgUGFnZU1vZGVsKG5hbWUpOyB9XHJcbiAgICBwcml2YXRlIG5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0ubmFtZSAhPSBuYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgcXVlc3Rpb24gPSBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIHRoaXMuZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb24sIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBuYW1lLCAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ3ZhbHVlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbnNbaV0sIHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZG9TdXJ2ZXlWYWx1ZUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tPblBhZ2VUcmlnZ2VycygpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRDdXJyZW50UGFnZVF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5nZXRWYWx1ZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKHF1ZXN0aW9uLm5hbWUsIHZhbHVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk6IEFycmF5PFF1ZXN0aW9uQmFzZT4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcGFnZS5xdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmICghcXVlc3Rpb24udmlzaWJsZSB8fCAhcXVlc3Rpb24ubmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tUcmlnZ2VycyhuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIGlzT25OZXh0UGFnZTogYm9vbGVhbikge1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnRyaWdnZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gdGhpcy50cmlnZ2Vyc1tpXTtcclxuICAgICAgICAgICAgaWYgKHRyaWdnZXIubmFtZSA9PSBuYW1lICYmIHRyaWdnZXIuaXNPbk5leHRQYWdlID09IGlzT25OZXh0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdHJpZ2dlci5jaGVjayhuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvUXVlc3Rpb25zT25Mb2FkKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5TG9hZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcnVuQ29uZGl0aW9ucygpIHtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnNGb3JMaXN0KHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSk7XHJcbiAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zRm9yTGlzdCh0aGlzLnBhZ2VzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcnVuQ29uZGl0aW9uc0Zvckxpc3QobGlzdDogQXJyYXk8SUNvbmRpdGlvblJ1bm5lcj4pIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGlzdFtpXS5ydW5Db25kaXRpb24odGhpcy52YWx1ZXNIYXNoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZyA9IG51bGwsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0VkaXRNb2RlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCAmJiB0aGlzLm9uUGFydGlhbFNlbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5vblBhcnRpYWxTZW5kLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5zdXJ2ZXlQb3N0SWQgJiYgcG9zdElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5UG9zdElkID0gcG9zdElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuc3VydmV5UG9zdElkKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGNsaWVudElkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCAmJiAhdGhpcy5jbGllbnRJZCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZFJlc3VsdCh0aGlzLnN1cnZleVBvc3RJZCwgdGhpcy5kYXRhLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uU2VuZFJlc3VsdC5maXJlKHNlbGYsIHsgc3VjY2Vzczogc3VjY2VzcywgcmVzcG9uc2U6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5nZXRSZXN1bHQocmVzdWx0SWQsIG5hbWUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBhbnlbXSwgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uR2V0UmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhOiBkYXRhLCBkYXRhTGlzdDogZGF0YUxpc3QsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBsb2FkU3VydmV5RnJvbVNlcnZpY2Uoc3VydmV5SWQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlJZCA9IHN1cnZleUlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKTtcclxuICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleSh0aGlzLnN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgc2VsZi5pc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldEpzb25PYmplY3QocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIHNlbGYubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZGluZ1N1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja1BhZ2VWaXNpYmlsaXR5KHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG9sZFF1ZXN0aW9uVmlzaWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKCFwYWdlKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gcGFnZS5pc1Zpc2libGU7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IHBhZ2UuZ2V0SXNQYWdlVmlzaWJsZShxdWVzdGlvbikgfHwgb2xkUXVlc3Rpb25WaXNpYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2UsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVZpc2libGVJbmRleGVzKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICBpZiAodGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25QYWdlXCIpIHtcclxuICAgICAgICAgICAgdmFyIHZpc1BhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh2aXNQYWdlc1tpXS5xdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSwgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXMoc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggPSB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5udW0gPSBzaG93SW5kZXggJiYgdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggKyAxIDogLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHF1ZXN0aW9uczogSVF1ZXN0aW9uW10sIHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcXVlc3Rpb25zW2ldLnNldFZpc2libGVJbmRleChzaG93SW5kZXggJiYgcXVlc3Rpb25zW2ldLnZpc2libGUgJiYgcXVlc3Rpb25zW2ldLmhhc1RpdGxlID8gKGluZGV4KyspIDogLTEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0SnNvbk9iamVjdChqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgIHZhciBqc29uQ29udmVydGVyID0gbmV3IEpzb25PYmplY3QoKTtcclxuICAgICAgICBqc29uQ29udmVydGVyLnRvT2JqZWN0KGpzb25PYmosIHRoaXMpO1xyXG4gICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVycm9ycyA9IGpzb25Db252ZXJ0ZXIuZXJyb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb29raWUpIHtcclxuICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZG9RdWVzdGlvbnNPbkxvYWQoKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHsgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgIHByaXZhdGUgdXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXMgPSB7fTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW1wicGFnZW5vXCJdID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHNlbGYuY3VycmVudFBhZ2UgIT0gbnVsbCA/IHNlbGYudmlzaWJsZVBhZ2VzLmluZGV4T2Yoc2VsZi5jdXJyZW50UGFnZSkgKyAxIDogMDsgfVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tcInBhZ2Vjb3VudFwiXSA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBzZWxmLnZpc2libGVQYWdlQ291bnQ7IH1cclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW3F1ZXN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKV0gPSBcInF1ZXN0aW9uXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhhc1Byb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgZmlyc3ROYW1lID0gbmV3IFByb2Nlc3NWYWx1ZSgpLmdldEZpcnN0TmFtZShuYW1lKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW2ZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgdmFyIGZpcnN0TmFtZSA9IG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRGaXJzdE5hbWUobmFtZSk7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tmaXJzdE5hbWUudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh2YWwgPT0gXCJ2YXJpYWJsZVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhcmlhYmxlKG5hbWUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWwgPT0gXCJxdWVzdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUoZmlyc3ROYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIG5hbWUgPSBxdWVzdGlvbi5uYW1lICsgbmFtZS5zdWJzdHIoZmlyc3ROYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvY2Vzc1ZhbHVlKCkuZ2V0VmFsdWUobmFtZSwgdGhpcy52YWx1ZXNIYXNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbCA9PSBcInZhbHVlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhckludmlzaWJsZVF1ZXN0aW9uVmFsdWVzKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS52aXNpYmxlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFZhcmlhYmxlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXNIYXNoW25hbWVdO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFZhcmlhYmxlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YXJpYWJsZVwiO1xyXG4gICAgfVxyXG4gICAgLy9JU3VydmV5IGRhdGFcclxuICAgIHByaXZhdGUgZ2V0VW5iaW5kVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIC8vZG8gbm90IHJldHVybiB0aGUgc2FtZSBvYmplY3QgaW5zdGFuY2UhISFcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBpZiAoIW5hbWUgfHwgbmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFVuYmluZFZhbHVlKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzVmFsdWVFcXVhbChuYW1lLCBuZXdWYWx1ZSkpIHJldHVybjtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT0gXCJcIiB8fCBuZXdWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmdldFVuYmluZFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlc1tuYW1lLnRvTG93ZXJDYXNlKCldID0gXCJ2YWx1ZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhuYW1lLCBuZXdWYWx1ZSwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIHRoaXMudHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNWYWx1ZUVxdWFsKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiKSBuZXdWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy5nZXRWYWx1ZShuYW1lKTtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPT09IG51bGwgfHwgb2xkVmFsdWUgPT09IG51bGwpIHJldHVybiBuZXdWYWx1ZSA9PT0gb2xkVmFsdWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNUd29WYWx1ZUVxdWFscyhuZXdWYWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1R3b1ZhbHVlRXF1YWxzKHg6IGFueSwgeTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHggPT09IHkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICghKHggaW5zdGFuY2VvZiBPYmplY3QpIHx8ICEoeSBpbnN0YW5jZW9mIE9iamVjdCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHgpIHtcclxuICAgICAgICAgICAgaWYgKCF4Lmhhc093blByb3BlcnR5KHApKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKCF5Lmhhc093blByb3BlcnR5KHApKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh4W3BdID09PSB5W3BdKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAoeFtwXSkgIT09IFwib2JqZWN0XCIpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVHdvVmFsdWVFcXVhbHMoeFtwXSwgeVtwXSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChwIGluIHkpIHtcclxuICAgICAgICAgICAgaWYgKHkuaGFzT3duUHJvcGVydHkocCkgJiYgIXguaGFzT3duUHJvcGVydHkocCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmdvTmV4dFBhZ2VBdXRvbWF0aWMgfHwgIXRoaXMuY3VycmVudFBhZ2UpIHJldHVybjtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWUpO1xyXG4gICAgICAgIGlmIChxdWVzdGlvbiAmJiAhcXVlc3Rpb24uc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5oYXNJbnB1dCAmJiAhdGhpcy5nZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSkpIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyh0cnVlLCBmYWxzZSkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzTGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dFBhZ2UoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9Db21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmRhdGFbbmFtZSArIHRoaXMuY29tbWVudFByZWZpeF07XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIG5hbWUgPSBuYW1lICsgdGhpcy5jb21tZW50UHJlZml4O1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy50cnlHb05leHRQYWdlQXV0b21hdGljKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIHRoaXMuY2hlY2tQYWdlVmlzaWJpbGl0eShxdWVzdGlvbiwgIW5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ3BhZ2UnOiBwYWdlLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcXVlc3Rpb25BZGRlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1Byb2Nlc3NlZFRleHRWYWx1ZXMocXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMub25RdWVzdGlvbkFkZGVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAnaW5kZXgnOiBpbmRleCB9KTtcclxuICAgIH1cclxuICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHRoaXMub25RdWVzdGlvblJlbW92ZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUgfSk7XHJcbiAgICB9XHJcbiAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICBpZiAodGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uaXNFbXB0eSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG5hbWU6IG5hbWUsIHZhbHVlOiB0aGlzLmdldFZhbHVlKG5hbWUpLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgIHRoaXMub25WYWxpZGF0ZVF1ZXN0aW9uLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuZXJyb3IgPyBuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcikgOiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvY2Vzc0h0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgaHRtbDogaHRtbCB9O1xyXG4gICAgICAgIHRoaXMub25Qcm9jZXNzSHRtbC5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NUZXh0KG9wdGlvbnMuaHRtbCk7XHJcbiAgICB9XHJcbiAgICBwcm9jZXNzVGV4dCh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRleHRQcmVQcm9jZXNzb3IucHJvY2Vzcyh0ZXh0KTtcclxuICAgIH1cclxuICAgIC8vSVN1cnZleVRyaWdnZXJPd25lclxyXG4gICAgZ2V0T2JqZWN0cyhwYWdlczogc3RyaW5nW10sIHF1ZXN0aW9uczogc3RyaW5nW10pOiBhbnlbXXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFBhZ2VzQnlOYW1lcyhwYWdlcykpO1xyXG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgdGhpcy5nZXRRdWVzdGlvbnNCeU5hbWVzKHF1ZXN0aW9ucykpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGlzVmFyaWFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYXJpYWJsZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5XCIsIFt7IG5hbWU6IFwibG9jYWxlXCIsIGNob2ljZXM6ICgpID0+IHsgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRMb2NhbGVzKCkgfSB9LFxyXG4gICAgXCJ0aXRsZVwiLCB7IG5hbWU6IFwiZm9jdXNGaXJzdFF1ZXN0aW9uQXV0b21hdGljOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZX0sIFwiY29tcGxldGVkSHRtbDpodG1sXCIsIHsgbmFtZTogXCJwYWdlc1wiLCBjbGFzc05hbWU6IFwicGFnZVwiIH0sXHJcbiAgICB7IG5hbWU6IFwicXVlc3Rpb25zXCIsIGJhc2VDbGFzc05hbWU6IFwicXVlc3Rpb25cIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gbnVsbDsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iaiwgdmFsdWUsIGpzb25Db252ZXJ0ZXIpIHsgdmFyIHBhZ2UgPSBvYmouYWRkTmV3UGFnZShcIlwiKTsganNvbkNvbnZlcnRlci50b09iamVjdCh7IHF1ZXN0aW9uczogdmFsdWUgfSwgcGFnZSk7IH0gfSxcclxuICAgIHsgbmFtZTogXCJ0cmlnZ2Vyczp0cmlnZ2Vyc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXRyaWdnZXJcIiwgY2xhc3NOYW1lUGFydDogXCJ0cmlnZ2VyXCIgfSxcclxuICAgIFwic3VydmV5SWRcIiwgXCJzdXJ2ZXlQb3N0SWRcIiwgXCJjb29raWVOYW1lXCIsIFwic2VuZFJlc3VsdE9uUGFnZU5leHQ6Ym9vbGVhblwiLFxyXG4gICAgeyBuYW1lOiBcInNob3dOYXZpZ2F0aW9uQnV0dG9uczpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgeyBuYW1lOiBcInNob3dUaXRsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgeyBuYW1lOiBcInNob3dQYWdlVGl0bGVzOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LFxyXG4gICAgXCJzaG93UGFnZU51bWJlcnM6Ym9vbGVhblwiLCB7IG5hbWU6IFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBkZWZhdWx0OiBcIm9uXCIsIGNob2ljZXM6IFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdIH0sXHJcbiAgICB7IG5hbWU6IFwicXVlc3Rpb25UaXRsZUxvY2F0aW9uXCIsIGRlZmF1bHQ6IFwidG9wXCIsIGNob2ljZXM6IFtcInRvcFwiLCBcImJvdHRvbVwiXSB9LFxyXG4gICAgeyBuYW1lOiBcInNob3dQcm9ncmVzc0JhclwiLCBkZWZhdWx0OiBcIm9mZlwiLCBjaG9pY2VzOiBbXCJvZmZcIiwgXCJ0b3BcIiwgXCJib3R0b21cIl0gfSxcclxuICAgIHsgbmFtZTogXCJtb2RlXCIsIGRlZmF1bHQ6IFwiZWRpdFwiLCBjaG9pY2VzOiBbXCJlZGl0XCIsIFwiZGlzcGxheVwiXSB9LFxyXG4gICAgeyBuYW1lOiBcInN0b3JlT3RoZXJzQXNDb21tZW50OmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCBcImdvTmV4dFBhZ2VBdXRvbWF0aWM6Ym9vbGVhblwiLCBcImNsZWFySW52aXNpYmxlVmFsdWVzOmJvb2xlYW5cIixcclxuICAgIHsgbmFtZTogXCJwYWdlUHJldlRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucGFnZVByZXZUZXh0VmFsdWU7IH0gfSxcclxuICAgIHsgbmFtZTogXCJwYWdlTmV4dFRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucGFnZU5leHRUZXh0VmFsdWU7IH0gfSxcclxuICAgIHsgbmFtZTogXCJjb21wbGV0ZVRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tcGxldGVUZXh0VmFsdWU7IH0gfSxcclxuICAgIHsgbmFtZTogXCJyZXF1aXJlZFRleHRcIiwgZGVmYXVsdDogXCIqXCIgfSwgXCJxdWVzdGlvblN0YXJ0SW5kZXhcIiwgXCJxdWVzdGlvblRpdGxlVGVtcGxhdGVcIl0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N1cnZleS50c1xuICoqLyIsImV4cG9ydCBjbGFzcyBkeFN1cnZleVNlcnZpY2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHBzOi8vZHhzdXJ2ZXlhcGkuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1N1cnZleVwiO1xyXG4gICAgLy9wdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cDovL2xvY2FsaG9zdDo1MDQ4OC9hcGkvU3VydmV5XCI7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcsIG9uTG9hZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0U3VydmV5P3N1cnZleUlkPScgKyBzdXJ2ZXlJZCk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBvbkxvYWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZywgcmVzdWx0OiBKU09OLCBvblNlbmRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KT0+IHZvaWQsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9wb3N0LycpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgIHZhciBkYXRhID0geyBwb3N0SWQ6IHBvc3RJZCwgc3VydmV5UmVzdWx0OiBKU09OLnN0cmluZ2lmeShyZXN1bHQpIH07XHJcbiAgICAgICAgaWYgKGNsaWVudElkKSBkYXRhWydjbGllbnRJZCddID0gY2xpZW50SWQ7XHJcbiAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCkgZGF0YVsnaXNQYXJ0aWFsQ29tcGxldGVkJ10gPSB0cnVlO1xyXG4gICAgICAgIHZhciBkYXRhU3RyaW5naWZ5OiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIW9uU2VuZFJlc3VsdCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBvblNlbmRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZChkYXRhU3RyaW5naWZ5KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZW5kRmlsZShwb3N0SWQ6IHN0cmluZywgZmlsZTogRmlsZSwgb25TZW5kRmlsZTogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IHhoci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIW9uU2VuZEZpbGUpIHJldHVybjtcclxuICAgICAgICAgICAgb25TZW5kRmlsZSh4aHIuc3RhdHVzID09IDIwMCwgSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5vcGVuKFwiUE9TVFwiLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvdXBsb2FkLycsIHRydWUpO1xyXG4gICAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImZpbGVcIiwgZmlsZSk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwicG9zdElkXCIsIHBvc3RJZCk7XHJcbiAgICAgICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIG9uR2V0UmVzdWx0OiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogQXJyYXk8YW55PiwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJm5hbWU9JyArIG5hbWU7XHJcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9nZXRSZXN1bHQ/JyArIGRhdGEpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHJlc3VsdC5RdWVzdGlvblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHsgbmFtZToga2V5LCB2YWx1ZTogcmVzdWx0LlF1ZXN0aW9uUmVzdWx0W2tleV0gfTtcclxuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9uR2V0UmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIGxpc3QsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlzQ29tcGxldGVkKHJlc3VsdElkOiBzdHJpbmcsIGNsaWVudElkOiBzdHJpbmcsIG9uSXNDb21wbGV0ZWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJmNsaWVudElkPScgKyBjbGllbnRJZDtcclxuICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2lzQ29tcGxldGVkPycgKyBkYXRhKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb25Jc0NvbXBsZXRlZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2R4U3VydmV5U2VydmljZS50c1xuICoqLyIsImltcG9ydCB7QmFzZSwgSGFzaFRhYmxlfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRyaWdnZXIgZXh0ZW5kcyBCYXNlIHtcclxuICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICBzdGF0aWMgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgICAgICBpZiAoVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZSAhPSBudWxsKSByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhdmFsdWU7IH0sXHJcbiAgICAgICAgICAgIG5vdGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICEoIXZhbHVlKTsgfSxcclxuICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgIT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgJiYgdmFsdWVbXCJpbmRleE9mXCJdICYmIHZhbHVlLmluZGV4T2YoZXhwZWN0ZWRWYWx1ZSkgPiAtMTsgfSxcclxuICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlIHx8ICF2YWx1ZVtcImluZGV4T2ZcIl0gfHwgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgZ3JlYXRlcjogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgIGxlc3M6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPCBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICBsZXNzb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8PSBleHBlY3RlZFZhbHVlOyB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb3BWYWx1ZTogc3RyaW5nID0gXCJlcXVhbFwiO1xyXG4gICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBvcGVyYXRvcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wZXJhdG9yKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICghVHJpZ2dlci5vcGVyYXRvcnNbdmFsdWVdKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hlY2sodmFsdWU6IGFueSkge1xyXG4gICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W107XHJcbiAgICBkb0NvbXBsZXRlKCk7XHJcbiAgICBzZXRUcmlnZ2VyVmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55LCBpc1ZhcmlhYmxlOiBib29sZWFuKTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXIgZXh0ZW5kcyBUcmlnZ2VyIHtcclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICBwcm90ZWN0ZWQgb3duZXI6IElTdXJ2ZXlUcmlnZ2VyT3duZXIgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRPd25lcihvd25lcjogSVN1cnZleVRyaWdnZXJPd25lcikge1xyXG4gICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNPbk5leHRQYWdlKCkgeyByZXR1cm4gZmFsc2U7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXJWaXNpYmxlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICBwdWJsaWMgcGFnZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInZpc2libGV0cmlnZ2VyXCI7IH1cclxuICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtU3VjY2Vzcyk7IH1cclxuICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgIHByaXZhdGUgb25UcmlnZ2VyKGZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm93bmVyLmdldE9iamVjdHModGhpcy5wYWdlcywgdGhpcy5xdWVzdGlvbnMpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmdW5jKG9iamVjdHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSB0cnVlOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgaXRlbS52aXNpYmxlID0gZmFsc2U7IH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlckNvbXBsZXRlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiY29tcGxldGV0cmlnZ2VyXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNPbk5leHRQYWdlKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgaWYgKHRoaXMub3duZXIpIHRoaXMub3duZXIuZG9Db21wbGV0ZSgpOyB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXJTZXRWYWx1ZSBleHRlbmRzIFN1cnZleVRyaWdnZXIge1xyXG4gICAgcHVibGljIHNldFRvTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHNldFZhbHVlOiBhbnk7XHJcbiAgICBwdWJsaWMgaXNWYXJpYWJsZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzZXR2YWx1ZXRyaWdnZXJcIjsgfVxyXG4gICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2V0VG9OYW1lIHx8ICF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vd25lci5zZXRUcmlnZ2VyVmFsdWUodGhpcy5zZXRUb05hbWUsIHRoaXMuc2V0VmFsdWUsIHRoaXMuaXNWYXJpYWJsZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0cmlnZ2VyXCIsIFtcIm9wZXJhdG9yXCIsIFwiIXZhbHVlXCJdKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIl0sIG51bGwsIFwidHJpZ2dlclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInZpc2libGV0cmlnZ2VyXCIsIFtcInBhZ2VzXCIsIFwicXVlc3Rpb25zXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlclZpc2libGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tcGxldGV0cmlnZ2VyXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlckNvbXBsZXRlKCk7IH0sIFwic3VydmV5dHJpZ2dlclwiKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNldHZhbHVldHJpZ2dlclwiLCBbXCIhc2V0VG9OYW1lXCIsIFwic2V0VmFsdWVcIiwgXCJpc1ZhcmlhYmxlOmJvb2xlYW5cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3RyaWdnZXIudHNcbiAqKi8iLCJpbXBvcnQge0Jhc2V9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4vc3VydmV5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5V2luZG93TW9kZWwgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHN1cnZleUVsZW1lbnROYW1lID0gXCJ3aW5kb3dTdXJ2ZXlKU1wiO1xyXG4gICAgc3VydmV5VmFsdWU6IFN1cnZleU1vZGVsO1xyXG4gICAgd2luZG93RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBpc1Nob3dpbmdWYWx1ZTogYm9vbGVhbjtcclxuICAgIGlzRXhwYW5kZWRWYWx1ZTogYm9vbGVhbjtcclxuICAgIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgIHRlbXBsYXRlVmFsdWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB0aGlzLmNyZWF0ZVN1cnZleShqc29uT2JqKTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLnNob3dUaXRsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2luZG93RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKSA6IHN0cmluZyB7IHJldHVybiBcIndpbmRvd1wiIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleU1vZGVsIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNTaG93aW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1Nob3dpbmdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBpc0V4cGFuZGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc0V4cGFuZGVkVmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMuc3VydmV5LnRpdGxlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBleHBhbmQoKSB7XHJcbiAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZSh0cnVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb2xsYXBzZSgpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKGZhbHNlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVTdXJ2ZXkoanNvbk9iajogYW55KTogU3VydmV5TW9kZWwge1xyXG4gICAgICAgIHJldHVybiBuZXcgU3VydmV5TW9kZWwoanNvbk9iailcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBleHBhbmRjb2xsYXBzZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaXNFeHBhbmRlZFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9zdXJ2ZXlXaW5kb3cudHNcbiAqKi8iLCJleHBvcnQgdmFyIHN1cnZleUNzcyA9IHtcclxuICAgIGN1cnJlbnRUeXBlOiBcIlwiLFxyXG4gICAgZ2V0Q3NzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudFR5cGUgPyB0aGlzW3RoaXMuY3VycmVudFR5cGVdIDogZGVmYXVsdFN0YW5kYXJkQ3NzO1xyXG4gICAgICAgIGlmICghbG9jKSBsb2MgPSBkZWZhdWx0U3RhbmRhcmRDc3M7XHJcbiAgICAgICAgcmV0dXJuIGxvYztcclxuICAgIH0sXHJcbn07XHJcblxyXG5leHBvcnQgdmFyIGRlZmF1bHRTdGFuZGFyZENzcyA9IHtcclxuICAgIHJvb3Q6IFwic3ZfbWFpblwiLFxyXG4gICAgaGVhZGVyOiBcIlwiLFxyXG4gICAgYm9keTogXCJzdl9ib2R5XCIsXHJcbiAgICBmb290ZXI6IFwic3ZfbmF2XCIsXHJcbiAgICBuYXZpZ2F0aW9uQnV0dG9uOiBcIlwiLCBuYXZpZ2F0aW9uOiB7IGNvbXBsZXRlOiBcIlwiLCBwcmV2OlwiXCIsIG5leHQ6IFwiXCJ9LFxyXG4gICAgcHJvZ3Jlc3M6IFwic3ZfcHJvZ3Jlc3NcIiwgcHJvZ3Jlc3NCYXI6IFwiXCIsXHJcbiAgICBwYWdlVGl0bGU6IFwic3ZfcF90aXRsZVwiLFxyXG4gICAgcm93OiBcInN2X3Jvd1wiLFxyXG4gICAgcXVlc3Rpb246IHsgcm9vdDogXCJzdl9xXCIsIHRpdGxlOiBcInN2X3FfdGl0bGVcIiwgY29tbWVudDogXCJcIiwgaW5kZW50OiAyMCB9LFxyXG4gICAgZXJyb3I6IHsgcm9vdDogXCJzdl9xX2VyYm94XCIsIGljb246IFwiXCIsIGl0ZW06IFwiXCIgfSxcclxuXHJcbiAgICBjaGVja2JveDogeyByb290OiBcInN2X3FjYmNcIiwgaXRlbTogXCJzdl9xX2NoZWNrYm94XCIsIG90aGVyOiBcInN2X3Ffb3RoZXJcIiB9LFxyXG4gICAgY29tbWVudDogXCJcIixcclxuICAgIGRyb3Bkb3duOiBcIlwiLFxyXG4gICAgbWF0cml4OiB7IHJvb3Q6IFwic3ZfcV9tYXRyaXhcIiB9LFxyXG4gICAgbWF0cml4ZHJvcGRvd246IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICBtYXRyaXhkeW5hbWljOiB7IHJvb3Q6IFwidGFibGVcIiwgYnV0dG9uOiBcIlwiIH0sXHJcbiAgICBtdWx0aXBsZXRleHQ6IHsgcm9vdDogXCJcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiXCIgfSxcclxuICAgIHJhZGlvZ3JvdXA6IHsgcm9vdDogXCJzdl9xY2JjXCIsIGl0ZW06IFwic3ZfcV9yYWRpb2dyb3VwXCIsIG90aGVyOiBcInN2X3Ffb3RoZXJcIiB9LFxyXG4gICAgcmF0aW5nOiB7IHJvb3Q6IFwic3ZfcV9yYXRpbmdcIiwgaXRlbTogXCJzdl9xX3JhdGluZ19pdGVtXCIgfSxcclxuICAgIHRleHQ6IFwiXCIsXHJcbiAgICB3aW5kb3c6IHtcclxuICAgICAgICByb290OiBcInN2X3dpbmRvd1wiLCBib2R5OiBcInN2X3dpbmRvd19jb250ZW50XCIsXHJcbiAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgIHJvb3Q6IFwic3Zfd2luZG93X3RpdGxlXCIsIHRpdGxlOiBcIlwiLCBidXR0b246IFwiXCIsIGJ1dHRvbkV4cGFuZGVkOiBcIlwiLCBidXR0b25Db2xsYXBzZWQ6IFwiXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5zdXJ2ZXlDc3NbXCJzdGFuZGFyZFwiXSA9IGRlZmF1bHRTdGFuZGFyZENzcztcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlDc3N9IGZyb20gXCIuL2Nzc3N0YW5kYXJkXCI7XHJcblxyXG5leHBvcnQgdmFyIGRlZmF1bHRCb290c3RyYXBDc3MgPSB7XHJcbiAgICByb290OiBcIlwiLFxyXG4gICAgaGVhZGVyOiBcInBhbmVsLWhlYWRpbmdcIixcclxuICAgIGJvZHk6IFwicGFuZWwtYm9keVwiLFxyXG4gICAgZm9vdGVyOiBcInBhbmVsLWZvb3RlclwiLFxyXG4gICAgbmF2aWdhdGlvbkJ1dHRvbjogXCJcIiwgbmF2aWdhdGlvbjogeyBjb21wbGV0ZTogXCJcIiwgcHJldjogXCJcIiwgbmV4dDogXCJcIiB9LFxyXG4gICAgcHJvZ3Jlc3M6IFwicHJvZ3Jlc3MgY2VudGVyLWJsb2NrXCIsIHByb2dyZXNzQmFyOiBcInByb2dyZXNzLWJhclwiLFxyXG4gICAgcGFnZVRpdGxlOiBcIlwiLFxyXG4gICAgcm93OiBcIlwiLFxyXG4gICAgcXVlc3Rpb246IHsgcm9vdDogXCJcIiwgdGl0bGU6IFwiXCIsIGNvbW1lbnQ6IFwiZm9ybS1jb250cm9sXCIsIGluZGVudDogMjAgfSxcclxuICAgIGVycm9yOiB7IHJvb3Q6IFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIsIGljb246IFwiZ2x5cGhpY29uIGdseXBoaWNvbi1leGNsYW1hdGlvbi1zaWduXCIsIGl0ZW06IFwiXCIgfSxcclxuXHJcbiAgICBjaGVja2JveDogeyByb290OiBcImZvcm0taW5saW5lXCIsIGl0ZW06IFwiY2hlY2tib3hcIiwgb3RoZXI6IFwiXCIgfSxcclxuICAgIGNvbW1lbnQ6IFwiZm9ybS1jb250cm9sXCIsXHJcbiAgICBkcm9wZG93bjogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgIG1hdHJpeDogeyByb290OiBcInRhYmxlXCIgfSxcclxuICAgIG1hdHJpeGRyb3Bkb3duOiB7IHJvb3Q6IFwidGFibGVcIiB9LFxyXG4gICAgbWF0cml4ZHluYW1pYzogeyByb290OiBcInRhYmxlXCIsIGJ1dHRvbjogXCJidXR0b25cIiB9LFxyXG4gICAgbXVsdGlwbGV0ZXh0OiB7IHJvb3Q6IFwidGFibGVcIiwgaXRlbVRpdGxlOiBcIlwiLCBpdGVtVmFsdWU6IFwiZm9ybS1jb250cm9sXCIgfSxcclxuICAgIHJhZGlvZ3JvdXA6IHsgcm9vdDogXCJmb3JtLWlubGluZVwiLCBpdGVtOiBcInJhZGlvXCIsIG90aGVyOiBcIlwiIH0sXHJcbiAgICByYXRpbmc6IHsgcm9vdDogXCJidG4tZ3JvdXBcIiwgaXRlbTogXCJidG4gYnRuLWRlZmF1bHRcIiB9LFxyXG4gICAgdGV4dDogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgIHdpbmRvdzoge1xyXG4gICAgICAgIHJvb3Q6IFwibW9kYWwtY29udGVudFwiLCBib2R5OiBcIm1vZGFsLWJvZHlcIixcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgcm9vdDogXCJtb2RhbC1oZWFkZXIgcGFuZWwtdGl0bGVcIiwgdGl0bGU6IFwicHVsbC1sZWZ0XCIsIGJ1dHRvbjogXCJnbHlwaGljb24gcHVsbC1yaWdodFwiLFxyXG4gICAgICAgICAgICBidXR0b25FeHBhbmRlZDogXCJnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi11cFwiLCBidXR0b25Db2xsYXBzZWQ6IFwiZ2x5cGhpY29uIHB1bGwtcmlnaHQgZ2x5cGhpY29uLWNoZXZyb24tZG93blwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5zdXJ2ZXlDc3NbXCJib290c3RyYXBcIl0gPSBkZWZhdWx0Qm9vdHN0cmFwQ3NzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RlZmF1bHRDc3MvY3NzYm9vdHN0cmFwLnRzXG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7UmVhY3RTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4vcmVhY3RzdXJ2ZXltb2RlbFwiO1xyXG5pbXBvcnQge1N1cnZleVBhZ2V9IGZyb20gXCIuL3JlYWN0cGFnZVwiO1xyXG5pbXBvcnQge1N1cnZleU5hdmlnYXRpb259IGZyb20gXCIuL3JlYWN0U3VydmV5TmF2aWdhdGlvblwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlDcmVhdG9yfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7c3VydmV5Q3NzfSBmcm9tIFwiLi4vZGVmYXVsdENzcy9jc3NzdGFuZGFyZFwiO1xyXG5pbXBvcnQge1N1cnZleVByb2dyZXNzfSBmcm9tIFwiLi9yZWFjdFN1cnZleVByb2dyZXNzXCI7XHJcbmltcG9ydCB7U3VydmV5UGFnZUlkfSBmcm9tIFwiLi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4gaW1wbGVtZW50cyBJU3VydmV5Q3JlYXRvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBjc3NUeXBlKCk6IHN0cmluZyB7IHJldHVybiBzdXJ2ZXlDc3MuY3VycmVudFR5cGU7IH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IGNzc1R5cGUodmFsdWU6IHN0cmluZykgeyBzdXJ2ZXlDc3MuY3VycmVudFR5cGUgPSB2YWx1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIHN1cnZleTogUmVhY3RTdXJ2ZXlNb2RlbDtcclxuICAgIHByaXZhdGUgaXNDdXJyZW50UGFnZUNoYW5nZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU3VydmV5KHByb3BzKTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN1cnZleShuZXh0UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNDdXJyZW50UGFnZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5LmZvY3VzRmlyc3RRdWVzdGlvbkF1dG9tYXRpYykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuZm9jdXNGaXJzdFF1ZXN0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleS5zdGF0ZSA9PSBcImNvbXBsZXRlZFwiKSByZXR1cm4gdGhpcy5yZW5kZXJDb21wbGV0ZWQoKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkuc3RhdGUgPT0gXCJsb2FkaW5nXCIpIHJldHVybiB0aGlzLnJlbmRlckxvYWRpbmcoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJTdXJ2ZXkoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY3NzKCk6IGFueSB7IHJldHVybiBzdXJ2ZXlDc3MuZ2V0Q3NzKCk7IH1cclxuICAgIHB1YmxpYyBzZXQgY3NzKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN1cnZleS5tZXJnZUNzcyh2YWx1ZSwgdGhpcy5jc3MpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckNvbXBsZXRlZCgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGh0bWxWYWx1ZSA9IHsgX19odG1sOiB0aGlzLnN1cnZleS5wcm9jZXNzZWRDb21wbGV0ZWRIdG1sIH07XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtodG1sVmFsdWV9IC8+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJMb2FkaW5nKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaHRtbFZhbHVlID0geyBfX2h0bWw6IHRoaXMuc3VydmV5LnByb2Nlc3NlZExvYWRpbmdIdG1sIH07XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXtodG1sVmFsdWV9IC8+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJTdXJ2ZXkoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciB0aXRsZSA9IHRoaXMuc3VydmV5LnRpdGxlICYmIHRoaXMuc3VydmV5LnNob3dUaXRsZSA/IHRoaXMucmVuZGVyVGl0bGUoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRQYWdlID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPyB0aGlzLnJlbmRlclBhZ2UoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRvcFByb2dyZXNzID0gdGhpcy5zdXJ2ZXkuc2hvd1Byb2dyZXNzQmFyID09IFwidG9wXCIgPyB0aGlzLnJlbmRlclByb2dyZXNzKHRydWUpIDogbnVsbDtcclxuICAgICAgICB2YXIgYm90dG9tUHJvZ3Jlc3MgPSB0aGlzLnN1cnZleS5zaG93UHJvZ3Jlc3NCYXIgPT0gXCJib3R0b21cIiA/IHRoaXMucmVuZGVyUHJvZ3Jlc3MoZmFsc2UpIDogbnVsbDtcclxuICAgICAgICB2YXIgYnV0dG9ucyA9IChjdXJyZW50UGFnZSAmJiB0aGlzLnN1cnZleS5zaG93TmF2aWdhdGlvbkJ1dHRvbnMpID8gdGhpcy5yZW5kZXJOYXZpZ2F0aW9uKCkgOiBudWxsO1xyXG4gICAgICAgIGlmICghY3VycmVudFBhZ2UpIHtcclxuICAgICAgICAgICAgY3VycmVudFBhZ2UgPSB0aGlzLnJlbmRlckVtcHR5U3VydmV5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgIHt0aXRsZX1cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9e1N1cnZleVBhZ2VJZH0gY2xhc3NOYW1lPXt0aGlzLmNzcy5ib2R5fT5cclxuICAgICAgICAgICAgICAgICAgICB7dG9wUHJvZ3Jlc3N9XHJcbiAgICAgICAgICAgICAgICAgICAge2N1cnJlbnRQYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgIHtib3R0b21Qcm9ncmVzc31cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge2J1dHRvbnN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyVGl0bGUoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3MuaGVhZGVyfT48aDM+e3RoaXMuc3VydmV5LnByb2Nlc3NlZFRpdGxlfTwvaDM+PC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclBhZ2UoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5UGFnZSBzdXJ2ZXk9e3RoaXMuc3VydmV5fSBwYWdlPXt0aGlzLnN1cnZleS5jdXJyZW50UGFnZX0gY3NzPXt0aGlzLmNzc30gY3JlYXRvcj17dGhpc30gLz47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUHJvZ3Jlc3MoaXNUb3A6IGJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlQcm9ncmVzcyBzdXJ2ZXk9e3RoaXMuc3VydmV5fSBjc3M9e3RoaXMuY3NzfSBpc1RvcD17aXNUb3B9ICAvPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJOYXZpZ2F0aW9uKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFN1cnZleU5hdmlnYXRpb24gc3VydmV5ID0ge3RoaXMuc3VydmV5fSBjc3M9e3RoaXMuY3NzfS8+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckVtcHR5U3VydmV5KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxzcGFuPnt0aGlzLnN1cnZleS5lbXB0eVN1cnZleVRleHR9PC9zcGFuPik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVN1cnZleShuZXdQcm9wczogYW55KSB7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5tb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXdQcm9wcy5tb2RlbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdQcm9wcy5qc29uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXcgUmVhY3RTdXJ2ZXlNb2RlbChuZXdQcm9wcy5qc29uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5ID0gbmV3IFJlYWN0U3VydmV5TW9kZWwoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5jbGllbnRJZCkgdGhpcy5zdXJ2ZXkuY2xpZW50SWQgPSBuZXdQcm9wcy5jbGllbnRJZDtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmRhdGEpIHRoaXMuc3VydmV5LmRhdGEgPSBuZXdQcm9wcy5kYXRhO1xyXG4gICAgICAgICAgICBpZiAobmV3UHJvcHMuY3NzKSB0aGlzLnN1cnZleS5tZXJnZUNzcyhuZXdQcm9wcy5jc3MsIHRoaXMuY3NzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc2V0IHRoZSBmaXJzdCBwYWdlXHJcbiAgICAgICAgdmFyIGR1bW15ID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHBhZ2VJbmRleENoYW5nZTogMCwgaXNDb21wbGV0ZWQ6IGZhbHNlLCBtb2RlbENoYW5nZWQ6IDAgfTtcclxuICAgICAgICB0aGlzLnNldFN1cnZleUV2ZW50cyhuZXdQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0U3VydmV5RXZlbnRzKG5ld1Byb3BzOiBhbnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUubW9kZWxDaGFuZ2VkID0gc2VsZi5zdGF0ZS5tb2RlbENoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcikgPT4geyBzZWxmLnN0YXRlLmlzQ29tcGxldGVkID0gdHJ1ZTsgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTsgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25QYXJ0aWFsU2VuZC5hZGQoKHNlbmRlcikgPT4geyBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleS5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBzZWxmLmlzQ3VycmVudFBhZ2VDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5wYWdlSW5kZXhDaGFuZ2UgPSBzZWxmLnN0YXRlLnBhZ2VJbmRleENoYW5nZSArIDE7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcyAmJiBuZXdQcm9wcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZCkgbmV3UHJvcHMub25DdXJyZW50UGFnZUNoYW5nZWQoc2VuZGVyLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleS5vblZpc2libGVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnF1ZXN0aW9uICYmIG9wdGlvbnMucXVlc3Rpb24ucmVhY3QpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IG9wdGlvbnMucXVlc3Rpb24ucmVhY3Quc3RhdGU7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS52aXNpYmxlID0gb3B0aW9ucy5xdWVzdGlvbi52aXNpYmxlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zZXRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleS5vblZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5xdWVzdGlvbiAmJiBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdGUgPSBvcHRpb25zLnF1ZXN0aW9uLnJlYWN0LnN0YXRlO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUudmFsdWUgPSBvcHRpb25zLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5xdWVzdGlvbi5yZWFjdC5zZXRTdGF0ZShzdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoIW5ld1Byb3BzKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25WYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgaWYgKG5ld1Byb3BzLmRhdGEpIG5ld1Byb3BzLmRhdGFbb3B0aW9ucy5uYW1lXSA9IG9wdGlvbnMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChuZXdQcm9wcy5vblZhbHVlQ2hhbmdlZCkgbmV3UHJvcHMub25WYWx1ZUNoYW5nZWQoc2VuZGVyLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAobmV3UHJvcHMub25Db21wbGV0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyKSA9PiB7IG5ld1Byb3BzLm9uQ29tcGxldGUoc2VuZGVyKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblBhcnRpYWxTZW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUGFydGlhbFNlbmQuYWRkKChzZW5kZXIpID0+IHsgbmV3UHJvcHMub25QYXJ0aWFsU2VuZChzZW5kZXIpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25QYWdlVmlzaWJsZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgaWYgKG5ld1Byb3BzLm9uUGFnZVZpc2libGVDaGFuZ2VkKSBuZXdQcm9wcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICBpZiAobmV3UHJvcHMub25RdWVzdGlvbkFkZGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUXVlc3Rpb25BZGRlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vblF1ZXN0aW9uQWRkZWQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblF1ZXN0aW9uUmVtb3ZlZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblF1ZXN0aW9uUmVtb3ZlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4geyBuZXdQcm9wcy5vblF1ZXN0aW9uUmVtb3ZlZChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uVmFsaWRhdGVRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblZhbGlkYXRlUXVlc3Rpb24uYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25WYWxpZGF0ZVF1ZXN0aW9uKHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblNlcnZlclZhbGlkYXRlUXVlc3Rpb25zID0gbmV3UHJvcHMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLm9uU2VuZFJlc3VsdCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblNlbmRSZXN1bHQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25TZW5kUmVzdWx0KHNlbmRlciwgb3B0aW9ucyk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmV3UHJvcHMub25HZXRSZXN1bHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25HZXRSZXN1bHQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25HZXRSZXN1bHQoc2VuZGVyLCBvcHRpb25zKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChuZXdQcm9wcy5vblByb2Nlc3NIdG1sKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uUHJvY2Vzc0h0bWwuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHsgbmV3UHJvcHMub25Qcm9jZXNzSHRtbChzZW5kZXIsIG9wdGlvbnMpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9JU3VydmV5Q3JlYXRvclxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uRWxlbWVudChxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbkNzcyA9IHRoaXMuY3NzW3F1ZXN0aW9uLmdldFR5cGUoKV07XHJcbiAgICAgICAgcmV0dXJuIFJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uLmdldFR5cGUoKSwge1xyXG4gICAgICAgICAgICBxdWVzdGlvbjogcXVlc3Rpb24sIGNzczogcXVlc3Rpb25Dc3MsIHJvb3RDc3M6IHRoaXMuY3NzLCBpc0Rpc3BsYXlNb2RlOiB0aGlzLnN1cnZleS5pc0Rpc3BsYXlNb2RlLCBjcmVhdG9yOiB0aGlzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyRXJyb3Ioa2V5OiBzdHJpbmcsIGVycm9yVGV4dDogc3RyaW5nKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGtleT17a2V5fSBjbGFzc05hbWU9e3RoaXMuY3NzLmVycm9yLml0ZW19PntlcnJvclRleHR9PC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZUxvY2F0aW9uOyB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdFN1cnZleS50c3hcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMzhfXztcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIGV4dGVybmFsIHtcInJvb3RcIjpcIlJlYWN0XCIsXCJjb21tb25qczJcIjpcInJlYWN0XCIsXCJjb21tb25qc1wiOlwicmVhY3RcIixcImFtZFwiOlwicmVhY3RcIn1cbiAqKiBtb2R1bGUgaWQgPSAzOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVhY3RTdXJ2ZXlNb2RlbCBleHRlbmRzIFN1cnZleU1vZGVsIHtcclxuICAgIHJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKGpzb25PYmopO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIG1lcmdlQ3NzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcclxuICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHNyYywgZGVzdCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0c3VydmV5bW9kZWwudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9ufSBmcm9tICcuL3JlYWN0cXVlc3Rpb24nXHJcbmltcG9ydCB7UGFnZU1vZGVsfSBmcm9tIFwiLi4vcGFnZVwiO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcbmltcG9ydCB7SVN1cnZleUNyZWF0b3J9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25cIjtcclxuaW1wb3J0IHtRdWVzdGlvblJvd01vZGVsfSBmcm9tIFwiLi4vcGFnZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVBhZ2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByaXZhdGUgcGFnZTogUGFnZU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXk6IFN1cnZleU1vZGVsO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5wYWdlID0gcHJvcHMucGFnZTtcclxuICAgICAgICB0aGlzLnN1cnZleSA9IHByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBwcm9wcy5jcmVhdG9yO1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucGFnZSA9IG5leHRQcm9wcy5wYWdlO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gbmV4dFByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnBhZ2UgPT0gbnVsbCB8fCB0aGlzLnN1cnZleSA9PSBudWxsIHx8IHRoaXMuY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnJlbmRlclRpdGxlKCk7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICB2YXIgcXVlc3Rpb25Sb3dzID0gdGhpcy5wYWdlLnJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcm93cy5wdXNoKHRoaXMuY3JlYXRlUm93KHF1ZXN0aW9uUm93c1tpXSwgaSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge3RpdGxlfVxyXG4gICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJvdyhyb3c6IFF1ZXN0aW9uUm93TW9kZWwsIGluZGV4OiBudW1iZXIpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHJvd05hbWUgPSBcInJvd1wiICsgKGluZGV4ICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIDxTdXJ2ZXlSb3cga2V5PXtyb3dOYW1lfSByb3c9e3Jvd30gc3VydmV5PXt0aGlzLnN1cnZleX0gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSBjc3M9e3RoaXMuY3NzfSAvPjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJUaXRsZSgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhZ2UudGl0bGUgfHwgIXRoaXMuc3VydmV5LnNob3dQYWdlVGl0bGVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGV4dCA9IHRoaXMucGFnZS5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICBpZiAodGhpcy5wYWdlLm51bSA+IDApIHtcclxuICAgICAgICAgICAgdGV4dCA9IHRoaXMucGFnZS5udW0gKyBcIi4gXCIgKyB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxoNCBjbGFzc05hbWU9e3RoaXMuY3NzLnBhZ2VUaXRsZX0+e3RleHR9PC9oND4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5Um93IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHJvdzogUXVlc3Rpb25Sb3dNb2RlbDtcclxuICAgIHByaXZhdGUgc3VydmV5OiBTdXJ2ZXlNb2RlbDtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKG5leHRQcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnRpZXMocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93ID0gcHJvcHMucm93O1xyXG4gICAgICAgIGlmICh0aGlzLnJvdykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucm93LnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2V0U3RhdGUoeyB2aXNpYmxlOiBzZWxmLnJvdy52aXNpYmxlIH0pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnJvdyA9PSBudWxsIHx8IHRoaXMuc3VydmV5ID09IG51bGwgfHwgdGhpcy5jcmVhdG9yID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICghdGhpcy5yb3cudmlzaWJsZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3cucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucm93LnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgcXVlc3Rpb25zLnB1c2godGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mucm93fT5cclxuICAgICAgICAgICAgICAgIHtxdWVzdGlvbnN9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gPFN1cnZleVF1ZXN0aW9uIGtleT17cXVlc3Rpb24ubmFtZX0gcXVlc3Rpb249e3F1ZXN0aW9ufSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IGNzcz17dGhpcy5jc3N9IC8+O1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RwYWdlLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gJy4uL3F1ZXN0aW9uYmFzZSc7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gJy4uL3F1ZXN0aW9uJztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtfSBmcm9tICcuL3JlYWN0cXVlc3Rpb25jb21tZW50JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleUNyZWF0b3Ige1xyXG4gICAgY3JlYXRlUXVlc3Rpb25FbGVtZW50KHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpOiBKU1guRWxlbWVudDtcclxuICAgIHJlbmRlckVycm9yKGtleTogc3RyaW5nLCBlcnJvclRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50O1xyXG4gICAgcXVlc3Rpb25UaXRsZUxvY2F0aW9uKCk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uQmFzZTogUXVlc3Rpb25CYXNlO1xyXG4gICAgcHJvdGVjdGVkIHF1ZXN0aW9uOiBRdWVzdGlvbjtcclxuICAgIHByaXZhdGUgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24ocHJvcHMucXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuY3JlYXRvciA9IHByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuc2V0UXVlc3Rpb24obmV4dFByb3BzLnF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UXVlc3Rpb24ocXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZSA9IHF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbiBpbnN0YW5jZW9mIFF1ZXN0aW9uID8gcXVlc3Rpb24gOiBudWxsO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucXVlc3Rpb24gPyB0aGlzLnF1ZXN0aW9uLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBcclxuICAgICAgICAgICAgdmlzaWJsZTogdGhpcy5xdWVzdGlvbkJhc2UudmlzaWJsZSwgdmFsdWU6IHZhbHVlLCBlcnJvcjogMCwgcmVuZGVyV2lkdGg6IDAsXHJcbiAgICAgICAgICAgIHZpc2libGVJbmRleFZhbHVlOiAtMVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZVtcInJlYWN0XCJdID0gc2VsZjtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UucmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLnJlbmRlcldpZHRoID0gc2VsZi5zdGF0ZS5yZW5kZXJXaWR0aCArIDE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zdGF0ZS52aXNpYmxlSW5kZXhWYWx1ZSA9IHNlbGYucXVlc3Rpb25CYXNlLnZpc2libGVJbmRleDtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5xdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2VbXCJyZWFjdFwiXSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoQ2hhbmdlZENhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UudmlzaWJsZUluZGV4Q2hhbmdlZENhbGxiYWNrID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbkJhc2UgfHwgIXRoaXMuY3JlYXRvcikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uQmFzZS52aXNpYmxlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgcXVlc3Rpb25SZW5kZXIgPSB0aGlzLmNyZWF0b3IuY3JlYXRlUXVlc3Rpb25FbGVtZW50KHRoaXMucXVlc3Rpb25CYXNlKTtcclxuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLnF1ZXN0aW9uQmFzZS5oYXNUaXRsZSA/IHRoaXMucmVuZGVyVGl0bGUoKSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlVG9wID0gdGhpcy5jcmVhdG9yLnF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpID09IFwidG9wXCIgPyB0aXRsZSA6IG51bGw7XHJcbiAgICAgICAgdmFyIHRpdGxlQm90dG9tID0gdGhpcy5jcmVhdG9yLnF1ZXN0aW9uVGl0bGVMb2NhdGlvbigpID09IFwiYm90dG9tXCIgPyB0aXRsZSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGNvbW1lbnQgPSAodGhpcy5xdWVzdGlvbiAmJiB0aGlzLnF1ZXN0aW9uLmhhc0NvbW1lbnQpID8gdGhpcy5yZW5kZXJDb21tZW50KCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBlcnJvcnMgPSB0aGlzLnJlbmRlckVycm9ycygpO1xyXG4gICAgICAgIHZhciBtYXJnaW5MZWZ0ID0gKHRoaXMucXVlc3Rpb25CYXNlLmluZGVudCA+IDApID8gdGhpcy5xdWVzdGlvbkJhc2UuaW5kZW50ICogdGhpcy5jc3MucXVlc3Rpb24uaW5kZW50ICsgXCJweFwiIDogbnVsbDtcclxuICAgICAgICB2YXIgcGFkZGluZ1JpZ2h0ID0gKHRoaXMucXVlc3Rpb25CYXNlLnJpZ2h0SW5kZW50ID4gMCkgPyB0aGlzLnF1ZXN0aW9uQmFzZS5yaWdodEluZGVudCAqIHRoaXMuY3NzLnF1ZXN0aW9uLmluZGVudCArIFwicHhcIiA6IG51bGw7XHJcbiAgICAgICAgdmFyIHJvb3RTdHlsZSA9IHsgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHZlcnRpY2FsQWxpZ246ICd0b3AnIH07XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoKSByb290U3R5bGVbXCJ3aWR0aFwiXSA9IHRoaXMucXVlc3Rpb25CYXNlLnJlbmRlcldpZHRoO1xyXG4gICAgICAgIGlmIChtYXJnaW5MZWZ0KSByb290U3R5bGVbXCJtYXJnaW5MZWZ0XCJdID0gbWFyZ2luTGVmdDtcclxuICAgICAgICBpZiAocGFkZGluZ1JpZ2h0KSByb290U3R5bGVbXCJwYWRkaW5nUmlnaHRcIl0gPSBwYWRkaW5nUmlnaHQ7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5xdWVzdGlvbkJhc2UuaWR9IGNsYXNzTmFtZT17dGhpcy5jc3MucXVlc3Rpb24ucm9vdH0gc3R5bGU9e3Jvb3RTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICB7dGl0bGVUb3B9XHJcbiAgICAgICAgICAgICAgICB7ZXJyb3JzfVxyXG4gICAgICAgICAgICAgICAge3F1ZXN0aW9uUmVuZGVyfVxyXG4gICAgICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgICAgICB7dGl0bGVCb3R0b219XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyVGl0bGUoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHZhciB0aXRsZVRleHQgPSB0aGlzLnF1ZXN0aW9uLmZ1bGxUaXRsZTtcclxuICAgICAgICByZXR1cm4gKDxoNSBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLnRpdGxlfT57dGl0bGVUZXh0fTwvaDU+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJDb21tZW50KCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2Pnt0aGlzLnF1ZXN0aW9uLmNvbW1lbnRUZXh0fTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLmNvbW1lbnR9PlxyXG4gICAgICAgICAgICAgICAgPFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufS8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJFcnJvcnMoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5UXVlc3Rpb25FcnJvcnMgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5jc3N9IGNyZWF0b3I9e3RoaXMuY3JlYXRvcn0gLz5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRXJyb3JzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb246IFF1ZXN0aW9uO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9yOiBJU3VydmV5Q3JlYXRvcjtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zZXRRdWVzdGlvbihwcm9wcy5xdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gcHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmNzcyA9IHByb3BzLmNzcztcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldFF1ZXN0aW9uKG5leHRQcm9wcy5xdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRRdWVzdGlvbihxdWVzdGlvbikge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBxdWVzdGlvbiBpbnN0YW5jZW9mIFF1ZXN0aW9uID8gcXVlc3Rpb24gOiBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLmVycm9yID0gc2VsZi5zdGF0ZS5lcnJvciArIDE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGVycm9yOiAwIH07XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbiB8fCB0aGlzLnF1ZXN0aW9uLmVycm9ycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGVycm9ycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi5lcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yVGV4dCA9IHRoaXMucXVlc3Rpb24uZXJyb3JzW2ldLmdldFRleHQoKTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiZXJyb3JcIiArIGk7XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKHRoaXMuY3JlYXRvci5yZW5kZXJFcnJvcihrZXksIGVycm9yVGV4dCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5lcnJvci5yb290fT57ZXJyb3JzfTwvZGl2Pik7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlFbGVtZW50QmFzZSwgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNvbW1lbnRNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2NvbW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25Db21tZW50IGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIHx8ICcnIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQmx1ciA9IHRoaXMuaGFuZGxlT25CbHVyLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uQ29tbWVudE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uQ29tbWVudE1vZGVsOyB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25CbHVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfHwgJycgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSlcclxuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3N9Pnt0aGlzLnF1ZXN0aW9uLnZhbHVlfTwvZGl2PilcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8dGV4dGFyZWEgaWQ9e3RoaXMucXVlc3Rpb24uaW5wdXRJZH0gY2xhc3NOYW1lPXt0aGlzLmNzc30gdHlwZT1cInRleHRcIiB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0gcGxhY2Vob2xkZXI9e3RoaXMucXVlc3Rpb24ucGxhY2VIb2xkZXJ9IG9uQmx1cj17dGhpcy5oYW5kbGVPbkJsdXJ9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSBjb2xzPXt0aGlzLnF1ZXN0aW9uLmNvbHN9IHJvd3M9e3RoaXMucXVlc3Rpb24ucm93c30gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb246IFF1ZXN0aW9uO1xyXG4gICAgcHJpdmF0ZSBjb21tZW50OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBwcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgdmFsdWU6IHRoaXMuY29tbWVudCB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25DaGFuZ2UgPSB0aGlzLmhhbmRsZU9uQ2hhbmdlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkJsdXIgPSB0aGlzLmhhbmRsZU9uQmx1ci5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLmNvbW1lbnQgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkJsdXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNvbW1lbnQgPSB0aGlzLmNvbW1lbnQ7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlNb2RlKVxyXG4gICAgICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5xdWVzdGlvbi5jb21tZW50fT57dGhpcy5jb21tZW50fTwvZGl2Pik7XHJcbiAgICAgICAgcmV0dXJuICg8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9e3RoaXMuY3NzLnF1ZXN0aW9uLmNvbW1lbnR9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gb25CbHVyPXt0aGlzLmhhbmRsZU9uQmx1cn0gLz4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uQ29tbWVudCwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uY29tbWVudC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi4vYmFzZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtJU3VydmV5Q3JlYXRvcn0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvblwiO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25jb21tZW50XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5RWxlbWVudEJhc2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHByb3RlY3RlZCBjc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCByb290Q3NzOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgaXNEaXNwbGF5TW9kZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5jc3MgPSBwcm9wcy5jc3M7XHJcbiAgICAgICAgdGhpcy5yb290Q3NzID0gcHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLmlzRGlzcGxheU1vZGUgPSBwcm9wcy5pc0Rpc3BsYXlNb2RlIHx8IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuY3NzID0gbmV4dFByb3BzLmNzcztcclxuICAgICAgICB0aGlzLnJvb3RDc3MgPSBuZXh0UHJvcHMucm9vdENzcztcclxuICAgICAgICB0aGlzLmlzRGlzcGxheU1vZGUgPSBuZXh0UHJvcHMuaXNEaXNwbGF5TW9kZSB8fCBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2UgZXh0ZW5kcyBTdXJ2ZXlFbGVtZW50QmFzZSB7XHJcbiAgICBwcm90ZWN0ZWQgcXVlc3Rpb25CYXNlOiBRdWVzdGlvbkJhc2U7XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25CYXNlID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gcHJvcHMuY3JlYXRvcjtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UgPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5jcmVhdG9yID0gbmV4dFByb3BzLmNyZWF0b3I7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmVsZW1lbnQudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge0hhc2hUYWJsZX0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSZWFjdFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBSZWFjdFF1ZXN0aW9uRmFjdG9yeSA9IG5ldyBSZWFjdFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBEZWZhdWx0Q2hvaWNlcyA9IFtcIm9uZVwiLCBcInR3b3xzZWNvbmQgdmFsdWVcIiwgXCJ0aHJlZXx0aGlyZCB2YWx1ZVwiXTtcclxuICAgIHByaXZhdGUgY3JlYXRvckhhc2g6IEhhc2hUYWJsZTwobmFtZTogc3RyaW5nKSA9PiBKU1guRWxlbWVudD4gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBKU1guRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXSA9IHF1ZXN0aW9uQ3JlYXRvcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRBbGxUeXBlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBwYXJhbXM6IGFueSk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gY3JlYXRvcihwYXJhbXMpO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmZhY3RvcnkudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcbmltcG9ydCB7U3VydmV5TmF2aWdhdGlvbkJhc2V9IGZyb20gXCIuL3JlYWN0U3VydmV5TmF2aWdhdGlvbkJhc2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlOYXZpZ2F0aW9uIGV4dGVuZHMgU3VydmV5TmF2aWdhdGlvbkJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZVByZXZDbGljayA9IHRoaXMuaGFuZGxlUHJldkNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVOZXh0Q2xpY2sgPSB0aGlzLmhhbmRsZU5leHRDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQ29tcGxldGVDbGljayA9IHRoaXMuaGFuZGxlQ29tcGxldGVDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlUHJldkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucHJldlBhZ2UoKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU5leHRDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5Lm5leHRQYWdlKCk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVDb21wbGV0ZUNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkuY29tcGxldGVMYXN0UGFnZSgpO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuc3VydmV5IHx8ICF0aGlzLnN1cnZleS5pc05hdmlnYXRpb25CdXR0b25zU2hvd2luZykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHByZXZCdXR0b24gPSAhdGhpcy5zdXJ2ZXkuaXNGaXJzdFBhZ2UgPyB0aGlzLnJlbmRlckJ1dHRvbih0aGlzLmhhbmRsZVByZXZDbGljaywgdGhpcy5zdXJ2ZXkucGFnZVByZXZUZXh0LCB0aGlzLmNzcy5uYXZpZ2F0aW9uLnByZXYpIDogbnVsbDtcclxuICAgICAgICB2YXIgbmV4dEJ1dHRvbiA9ICF0aGlzLnN1cnZleS5pc0xhc3RQYWdlID8gdGhpcy5yZW5kZXJCdXR0b24odGhpcy5oYW5kbGVOZXh0Q2xpY2ssIHRoaXMuc3VydmV5LnBhZ2VOZXh0VGV4dCwgdGhpcy5jc3MubmF2aWdhdGlvbi5uZXh0KSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGNvbXBsZXRlQnV0dG9uID0gdGhpcy5zdXJ2ZXkuaXNMYXN0UGFnZSA/IHRoaXMucmVuZGVyQnV0dG9uKHRoaXMuaGFuZGxlQ29tcGxldGVDbGljaywgdGhpcy5zdXJ2ZXkuY29tcGxldGVUZXh0LCB0aGlzLmNzcy5uYXZpZ2F0aW9uLmNvbXBsZXRlKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLmZvb3Rlcn0+XHJcbiAgICAgICAgICAgICAgICB7cHJldkJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIHtuZXh0QnV0dG9ufVxyXG4gICAgICAgICAgICAgICAge2NvbXBsZXRlQnV0dG9ufVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJCdXR0b24oY2xpY2s6IGFueSwgdGV4dDogc3RyaW5nLCBidG5DbGFzc05hbWU6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgc3R5bGUgPSB7IG1hcmdpblJpZ2h0OiBcIjVweFwiIH07XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHRoaXMuY3NzLm5hdmlnYXRpb25CdXR0b24gKyAoYnRuQ2xhc3NOYW1lID8gJyAnICsgYnRuQ2xhc3NOYW1lIDogXCJcIik7XHJcbiAgICAgICAgcmV0dXJuIDxpbnB1dCBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3N0eWxlfSB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17Y2xpY2t9IHZhbHVlPXt0ZXh0fSAvPjtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5TmF2aWdhdGlvbi50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5TW9kZWx9IGZyb20gXCIuLi9zdXJ2ZXlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlOYXZpZ2F0aW9uQmFzZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcHJvdGVjdGVkIHN1cnZleTogU3VydmV5TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgY3NzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gcHJvcHMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuY3NzID0gcHJvcHMuY3NzO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHVwZGF0ZTogMCB9O1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gbmV4dFByb3BzLnN1cnZleTtcclxuICAgICAgICB0aGlzLmNzcyA9IG5leHRQcm9wcy5jc3M7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVN0YXRlRnVuY3Rpb246IGFueSA9IG51bGw7XHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVN0YXRlRnVuY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXRlLnVwZGF0ZSA9IHNlbGYuc3RhdGUudXBkYXRlICsgMTtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkub25QYWdlVmlzaWJsZUNoYW5nZWQuYWRkKHRoaXMudXBkYXRlU3RhdGVGdW5jdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmIHRoaXMudXBkYXRlU3RhdGVGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vblBhZ2VWaXNpYmxlQ2hhbmdlZC5yZW1vdmUodGhpcy51cGRhdGVTdGF0ZUZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTdGF0ZUZ1bmN0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdFN1cnZleU5hdmlnYXRpb25CYXNlLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3N1cnZleVwiO1xyXG5pbXBvcnQge1N1cnZleU5hdmlnYXRpb25CYXNlfSBmcm9tIFwiLi9yZWFjdFN1cnZleU5hdmlnYXRpb25CYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvZ3Jlc3MgZXh0ZW5kcyBTdXJ2ZXlOYXZpZ2F0aW9uQmFzZSB7XHJcbiAgICBwcm90ZWN0ZWQgaXNUb3A6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuaXNUb3AgPSBwcm9wcy5pc1RvcDtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pc1RvcCA9IG5leHRQcm9wcy5pc1RvcDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgcHJvZ3Jlc3MoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuc3VydmV5LmdldFByb2dyZXNzKCk7IH1cclxuICAgIHByb3RlY3RlZCBnZXQgcHJvZ3Jlc3NUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnN1cnZleS5wcm9ncmVzc1RleHQ7IH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5pc1RvcCA/IHsgd2lkdGg6IFwiNjAlXCIgfSA6IHsgd2lkdGg6IFwiNjAlXCIsIG1hcmdpblRvcDogXCIxMHB4XCIgfTtcclxuICAgICAgICB2YXIgcHJvZ3Jlc3NTdHlsZSA9IHsgd2lkdGg6IHRoaXMucHJvZ3Jlc3MgKyBcIiVcIiB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLnByb2dyZXNzfSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXtwcm9ncmVzc1N0eWxlfSBjbGFzc05hbWU9e3RoaXMuY3NzLnByb2dyZXNzQmFyfSByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPnt0aGlzLnByb2dyZXNzVGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5UHJvZ3Jlc3MudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleUVsZW1lbnRCYXNlLCBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25jb21tZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25DaGVja2JveE1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fY2hlY2tib3hcIjtcclxuaW1wb3J0IHtJdGVtVmFsdWV9IGZyb20gXCIuLi9iYXNlXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25DaGVja2JveCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBjaG9pY2VzQ2hhbmdlZDogMCB9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNob2ljZXNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgPSBzZWxmLnN0YXRlLmNob2ljZXNDaGFuZ2VkICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uQ2hlY2tib3hNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbkNoZWNrYm94TW9kZWw7IH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Zm9ybSBjbGFzc05hbWU9e3RoaXMuY3NzLnJvb3R9PlxyXG4gICAgICAgICAgICB7dGhpcy5nZXRJdGVtcygpIH1cclxuICAgICAgICAgICAgICAgIDwvZm9ybT4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcIml0ZW1cIiArIGk7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5yZW5kZXJJdGVtKGtleSwgaXRlbSwgaSA9PSAwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgdGV4dFN0eWxlKCk6IGFueSB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySXRlbShrZXk6IHN0cmluZywgaXRlbTogYW55LCBpc0ZpcnN0OiBib29sZWFuKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8U3VydmV5UXVlc3Rpb25DaGVja2JveEl0ZW0ga2V5PXtrZXl9IHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMuY3NzfSByb290Q3NzPXt0aGlzLnJvb3RDc3N9IGlzRGlzcGxheU1vZGU9e3RoaXMuaXNEaXNwbGF5TW9kZX0gaXRlbT17aXRlbX0gdGV4dFN0eWxlPXt0aGlzLnRleHRTdHlsZX0gaXNGaXJzdD17aXNGaXJzdH0gLz47XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uQ2hlY2tib3hJdGVtIGV4dGVuZHMgU3VydmV5RWxlbWVudEJhc2Uge1xyXG4gICAgcHJvdGVjdGVkIHF1ZXN0aW9uOiBRdWVzdGlvbkNoZWNrYm94TW9kZWw7XHJcbiAgICBwcm90ZWN0ZWQgaXRlbTogSXRlbVZhbHVlO1xyXG4gICAgcHJvdGVjdGVkIHRleHRTdHlsZTogYW55O1xyXG4gICAgcHJvdGVjdGVkIGlzRmlyc3Q6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gcHJvcHMuaXRlbTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gcHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy50ZXh0U3R5bGUgPSBwcm9wcy50ZXh0U3R5bGU7XHJcbiAgICAgICAgdGhpcy5pc0ZpcnN0ID0gcHJvcHMuaXNGaXJzdDtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLml0ZW0gPSBuZXh0UHJvcHMuaXRlbTtcclxuICAgICAgICB0aGlzLnRleHRTdHlsZSA9IG5leHRQcm9wcy50ZXh0U3R5bGU7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLmlzRmlyc3QgPSBuZXh0UHJvcHMuaXNGaXJzdDtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5xdWVzdGlvbi52YWx1ZTtcclxuICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBpbmRleCA9IG5ld1ZhbHVlLmluZGV4T2YodGhpcy5pdGVtLnZhbHVlKTtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNoZWNrZWQpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUucHVzaCh0aGlzLml0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW0gfHwgIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBpdGVtV2lkdGggPSB0aGlzLnF1ZXN0aW9uLmNvbENvdW50ID4gMCA/ICgxMDAgLyB0aGlzLnF1ZXN0aW9uLmNvbENvdW50KSArIFwiJVwiIDogXCJcIjtcclxuICAgICAgICB2YXIgbWFyZ2luUmlnaHQgPSB0aGlzLnF1ZXN0aW9uLmNvbENvdW50ID09IDAgPyBcIjVweFwiIDogXCIwcHhcIjtcclxuICAgICAgICB2YXIgZGl2U3R5bGUgPSB7IG1hcmdpblJpZ2h0OiBtYXJnaW5SaWdodCB9O1xyXG4gICAgICAgIGlmIChpdGVtV2lkdGgpIHtcclxuICAgICAgICAgICAgZGl2U3R5bGVbXCJ3aWR0aFwiXSA9IGl0ZW1XaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGlzQ2hlY2tlZCA9ICh0aGlzLnF1ZXN0aW9uLnZhbHVlICYmIHRoaXMucXVlc3Rpb24udmFsdWUuaW5kZXhPZih0aGlzLml0ZW0udmFsdWUpID4gLTEpIHx8IGZhbHNlO1xyXG4gICAgICAgIHZhciBvdGhlckl0ZW0gPSAodGhpcy5pdGVtLnZhbHVlID09PSB0aGlzLnF1ZXN0aW9uLm90aGVySXRlbS52YWx1ZSAmJiBpc0NoZWNrZWQpID8gdGhpcy5yZW5kZXJPdGhlcigpIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDaGVja2JveChpc0NoZWNrZWQsIGRpdlN0eWxlLCBvdGhlckl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBpbnB1dFN0eWxlKCk6IGFueSB7IHJldHVybiB7IG1hcmdpblJpZ2h0OiBcIjNweFwiIH07IH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJDaGVja2JveChpc0NoZWNrZWQ6IGJvb2xlYW4sIGRpdlN0eWxlOiBhbnksIG90aGVySXRlbTogSlNYLkVsZW1lbnQpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGlkID0gdGhpcy5pc0ZpcnN0ID8gdGhpcy5xdWVzdGlvbi5pbnB1dElkIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtfSBzdHlsZT17ZGl2U3R5bGV9PlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtfT5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD17aWR9IHN0eWxlPXt0aGlzLmlucHV0U3R5bGV9IGRpc2FibGVkPXt0aGlzLmlzRGlzcGxheU1vZGV9IGNoZWNrZWQ9e2lzQ2hlY2tlZH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlT25DaGFuZ2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4+e3RoaXMuaXRlbS50ZXh0fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAge290aGVySXRlbX1cclxuICAgICAgICAgICAgPC9kaXY+KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJPdGhlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mub3RoZXJ9PjxTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtICBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gY3NzPXt0aGlzLnJvb3RDc3N9ICBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9Lz48L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvbkNoZWNrYm94LCBwcm9wcyk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25jaGVja2JveC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkRyb3Bkb3duTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9kcm9wZG93blwiO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25jb21tZW50XCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25Ecm9wZG93biBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyB2YWx1ZTogdGhpcy5xdWVzdGlvbi52YWx1ZSwgY2hvaWNlc0NoYW5nZWQ6IDAgfTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5jaG9pY2VzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLnN0YXRlLmNob2ljZXNDaGFuZ2VkID0gc2VsZi5zdGF0ZS5jaG9pY2VzQ2hhbmdlZCArIDE7XHJcbiAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoc2VsZi5zdGF0ZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbkRyb3Bkb3duTW9kZWwgeyByZXR1cm4gdGhpcy5xdWVzdGlvbkJhc2UgYXMgUXVlc3Rpb25Ecm9wZG93bk1vZGVsOyB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBjb21tZW50ID0gdGhpcy5xdWVzdGlvbi52YWx1ZSA9PT0gdGhpcy5xdWVzdGlvbi5vdGhlckl0ZW0udmFsdWUgPyB0aGlzLnJlbmRlck90aGVyKCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBzZWxlY3QgPSB0aGlzLnJlbmRlclNlbGVjdCgpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIHtzZWxlY3R9XHJcbiAgICAgICAgICAgIHtjb21tZW50fVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclNlbGVjdCgpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSkgIHJldHVybiAoPGRpdiBpZD17dGhpcy5xdWVzdGlvbi5pbnB1dElkfSBjbGFzc05hbWU9e3RoaXMuY3NzfT57dGhpcy5xdWVzdGlvbi52YWx1ZX08L2Rpdj4pO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLnZpc2libGVDaG9pY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwiaXRlbVwiICsgaTtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbiA9IDxvcHRpb24ga2V5PXtrZXl9IHZhbHVlPXtpdGVtLnZhbHVlfT57aXRlbS50ZXh0fTwvb3B0aW9uPjtcclxuICAgICAgICAgICAgb3B0aW9ucy5wdXNoKG9wdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxzZWxlY3QgaWQ9e3RoaXMucXVlc3Rpb24uaW5wdXRJZH0gY2xhc3NOYW1lPXt0aGlzLmNzc30gdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfT5cclxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPnt0aGlzLnF1ZXN0aW9uLm9wdGlvbnNDYXB0aW9ufTwvb3B0aW9uPlxyXG4gICAgICAgICAgICB7b3B0aW9uc31cclxuICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJPdGhlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0geyBtYXJnaW5Ub3A6IFwiM3B4XCIgfTtcclxuICAgICAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9PjxTdXJ2ZXlRdWVzdGlvbkNvbW1lbnRJdGVtIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfS8+PC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKHByb3BzKSA9PiB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChTdXJ2ZXlRdWVzdGlvbkRyb3Bkb3duLCBwcm9wcyk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25kcm9wZG93bi50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2UsIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fbWF0cml4ZHJvcGRvd25cIjtcclxuaW1wb3J0IHtJU3VydmV5Q3JlYXRvciwgU3VydmV5UXVlc3Rpb25FcnJvcnN9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25cIjtcclxuaW1wb3J0IHtNYXRyaXhEcm9wZG93blJvd01vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fbWF0cml4ZHJvcGRvd25cIjtcclxuaW1wb3J0IHtNYXRyaXhEcm9wZG93bkNlbGx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeERyb3Bkb3duIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwgeyByZXR1cm4gdGhpcy5xdWVzdGlvbkJhc2UgYXMgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsOyB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24uY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5xdWVzdGlvbi5jb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJjb2x1bW5cIiArIGk7XHJcbiAgICAgICAgICAgIHZhciBtaW5XaWR0aCA9IHRoaXMucXVlc3Rpb24uZ2V0Q29sdW1uV2lkdGgoY29sdW1uKTtcclxuICAgICAgICAgICAgdmFyIGNvbHVtblN0eWxlID0gbWluV2lkdGggPyB7IG1pbldpZHRoOiBtaW5XaWR0aCB9IDoge307XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaCg8dGgga2V5PXtrZXl9IHN0eWxlPXtjb2x1bW5TdHlsZX0+e3RoaXMucXVlc3Rpb24uZ2V0Q29sdW1uVGl0bGUoY29sdW1uKSB9PC90aD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93cyA9IFtdO1xyXG4gICAgICAgIHZhciB2aXNpYmxlUm93cyA9IHRoaXMucXVlc3Rpb24udmlzaWJsZVJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHJvd3MucHVzaCg8U3VydmV5UXVlc3Rpb25NYXRyaXhEcm9wZG93blJvdyBrZXk9e3Jvdy5pZH0gcm93PXtyb3d9IGNzcz17dGhpcy5jc3N9IHJvb3RDc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfSBjcmVhdG9yPXt0aGlzLmNyZWF0b3J9IC8+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGRpdlN0eWxlID0gdGhpcy5xdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsID8geyBvdmVyZmxvd1g6ICdzY3JvbGwnfSA6IHt9O1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgIHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtyb3dzfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25NYXRyaXhEcm9wZG93blJvdyBleHRlbmRzIFN1cnZleUVsZW1lbnRCYXNlIHtcclxuICAgIHByaXZhdGUgcm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsO1xyXG4gICAgcHJvdGVjdGVkIGNyZWF0b3I6IElTdXJ2ZXlDcmVhdG9yO1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMobmV4dFByb3BzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydGllcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93ID0gbmV4dFByb3BzLnJvdztcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvdykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3cuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLnJvdy5jZWxsc1tpXTtcclxuICAgICAgICAgICAgdmFyIGVycm9ycyA9IDxTdXJ2ZXlRdWVzdGlvbkVycm9ycyBxdWVzdGlvbj17Y2VsbC5xdWVzdGlvbn0gY3NzPXt0aGlzLnJvb3RDc3N9IGNyZWF0b3I9e3RoaXMuY3JlYXRvcn0gLz5cclxuICAgICAgICAgICAgdmFyIHNlbGVjdCA9IHRoaXMucmVuZGVyU2VsZWN0KGNlbGwpO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcInJvd1wiICsgaX0+e2Vycm9yc317c2VsZWN0fTwvdGQ+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICg8dHI+PHRkPnt0aGlzLnJvdy50ZXh0fTwvdGQ+e3Rkc308L3RyPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyU2VsZWN0KGNlbGw6IE1hdHJpeERyb3Bkb3duQ2VsbCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdG9yLmNyZWF0ZVF1ZXN0aW9uRWxlbWVudChjZWxsLnF1ZXN0aW9uKTtcclxuICAgIH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeGRyb3Bkb3duXCIsIChwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VydmV5UXVlc3Rpb25NYXRyaXhEcm9wZG93biwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9ubWF0cml4ZHJvcGRvd24udHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleUVsZW1lbnRCYXNlLCBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uTWF0cml4TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhcIjtcclxuaW1wb3J0IHtNYXRyaXhSb3dNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX21hdHJpeFwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4IGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbk1hdHJpeE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uTWF0cml4TW9kZWw7IH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgZmlyc3RUSCA9IHRoaXMucXVlc3Rpb24uaGFzUm93cyA/IDx0aD48L3RoPiA6IG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24uY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5xdWVzdGlvbi5jb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJjb2x1bW5cIiArIGk7XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaCg8dGgga2V5PXtrZXl9Pntjb2x1bW4udGV4dH08L3RoPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIHZpc2libGVSb3dzID0gdGhpcy5xdWVzdGlvbi52aXNpYmxlUm93cztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB2aXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwicm93XCIgKyBpO1xyXG4gICAgICAgICAgICByb3dzLnB1c2goPFN1cnZleVF1ZXN0aW9uTWF0cml4Um93IGtleT17a2V5fSBxdWVzdGlvbj17dGhpcy5xdWVzdGlvbn0gY3NzPXt0aGlzLmNzc30gcm9vdENzcz17dGhpcy5yb290Q3NzfSBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9IHJvdz17cm93fSBpc0ZpcnN0PXtpID09IDB9IC8+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7Zmlyc3RUSH1cclxuICAgICAgICAgICAgICAgICAgICAgICAge2hlYWRlcnN9XHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4Um93IGV4dGVuZHMgU3VydmV5RWxlbWVudEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogUXVlc3Rpb25NYXRyaXhNb2RlbDtcclxuICAgIHByaXZhdGUgcm93OiBNYXRyaXhSb3dNb2RlbDtcclxuICAgIHByaXZhdGUgaXNGaXJzdDogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHByb3BzLnF1ZXN0aW9uO1xyXG4gICAgICAgIHRoaXMucm93ID0gcHJvcHMucm93O1xyXG4gICAgICAgIHRoaXMuaXNGaXJzdCA9IHByb3BzLmlzRmlyc3Q7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5yb3cudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLnJvdy52YWx1ZSB9KTtcclxuICAgIH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IG5leHRQcm9wcy5xdWVzdGlvbjtcclxuICAgICAgICB0aGlzLnJvdyA9IG5leHRQcm9wcy5yb3c7XHJcbiAgICAgICAgdGhpcy5pc0ZpcnN0ID0gbmV4dFByb3BzLmlzRmlyc3Q7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5yb3cpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBmaXJzdFREID0gdGhpcy5xdWVzdGlvbi5oYXNSb3dzID8gPHRkPnt0aGlzLnJvdy50ZXh0fTwvdGQ+IDogbnVsbDtcclxuICAgICAgICB2YXIgdGRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9uLmNvbHVtbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IHRoaXMucXVlc3Rpb24uY29sdW1uc1tpXTtcclxuICAgICAgICAgICAgdmFyIGtleSA9IFwidmFsdWVcIiArIGk7XHJcbiAgICAgICAgICAgIHZhciBpc0NoZWNrZWQgPSB0aGlzLnJvdy52YWx1ZSA9PSBjb2x1bW4udmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBpbnB1dElkID0gdGhpcy5pc0ZpcnN0ICYmIGkgPT0gMCA/IHRoaXMucXVlc3Rpb24uaW5wdXRJZCA6IG51bGw7XHJcbiAgICAgICAgICAgIHZhciB0ZCA9IDx0ZCBrZXk9e2tleX0+PGlucHV0IGlkPXtpbnB1dElkfSB0eXBlPVwicmFkaW9cIiBuYW1lPXt0aGlzLnJvdy5mdWxsTmFtZX0gdmFsdWU9e2NvbHVtbi52YWx1ZX0gZGlzYWJsZWQ9e3RoaXMuaXNEaXNwbGF5TW9kZX0gY2hlY2tlZD17aXNDaGVja2VkfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0vPjwvdGQ+O1xyXG4gICAgICAgICAgICB0ZHMucHVzaCh0ZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPHRyPntmaXJzdFREfXt0ZHN9PC90cj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VydmV5UXVlc3Rpb25NYXRyaXgsIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbm1hdHJpeC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkh0bWxNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2h0bWxcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbkh0bWwgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uSHRtbE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uSHRtbE1vZGVsOyB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbiB8fCAhdGhpcy5xdWVzdGlvbi5odG1sKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgaHRtbFZhbHVlID0geyBfX2h0bWw6IHRoaXMucXVlc3Rpb24ucHJvY2Vzc2VkSHRtbCB9O1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17aHRtbFZhbHVlfSAvPiApO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uSHRtbCwgcHJvcHMpO1xyXG59KTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbmh0bWwudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GaWxlTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9maWxlXCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25GaWxlIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGZpbGVMb2FkZWQ6IDAgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbkZpbGVNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbkZpbGVNb2RlbDsgfVxyXG4gICAgaGFuZGxlT25DaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICB2YXIgc3JjID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7IFxyXG4gICAgICAgIGlmICghd2luZG93W1wiRmlsZVJlYWRlclwiXSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICghc3JjIHx8ICFzcmMuZmlsZXMgfHwgc3JjLmZpbGVzLmxlbmd0aCA8IDEpIHJldHVybjtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmxvYWRGaWxlKHNyYy5maWxlc1swXSk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZpbGVMb2FkZWQ6IHRoaXMuc3RhdGUuZmlsZUxvYWRlZCArIDEgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGltZyA9IHRoaXMucmVuZGVySW1hZ2UoKTtcclxuICAgICAgICB2YXIgZmlsZUlucHV0ID0gbnVsbDtcclxuICAgICAgICBpZiAoIXRoaXMuaXNEaXNwbGF5TW9kZSkge1xyXG4gICAgICAgICAgICBmaWxlSW5wdXQgPSA8aW5wdXQgaWQ9e3RoaXMucXVlc3Rpb24uaW5wdXRJZH0gdHlwZT1cImZpbGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0vPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIHtmaWxlSW5wdXR9XHJcbiAgICAgICAgICAgICAgICB7aW1nfVxyXG4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgIFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySW1hZ2UoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbi5wcmV2aWV3VmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiAoPGRpdj4gIDxpbWcgc3JjPXt0aGlzLnF1ZXN0aW9uLnByZXZpZXdWYWx1ZX0gaGVpZ2h0PXt0aGlzLnF1ZXN0aW9uLmltYWdlSGVpZ2h0fSB3aWR0aD17dGhpcy5xdWVzdGlvbi5pbWFnZVdpZHRofSAvPjwvZGl2Pik7XHJcbiAgICB9XHJcbn1cclxuXHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJmaWxlXCIsIChwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VydmV5UXVlc3Rpb25GaWxlLCBwcm9wcyk7XHJcbn0pO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9uZmlsZS50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2UsIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX211bHRpcGxldGV4dFwiO1xyXG5pbXBvcnQge011bHRpcGxlVGV4dEl0ZW1Nb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX211bHRpcGxldGV4dFwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTXVsdGlwbGVUZXh0IGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWw7IH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGFibGVSb3dzID0gdGhpcy5xdWVzdGlvbi5nZXRSb3dzKCk7XHJcbiAgICAgICAgdmFyIHJvd3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByb3dzLnB1c2godGhpcy5yZW5kZXJSb3coXCJpdGVtXCIgKyBpLCB0YWJsZVJvd3NbaV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICB7cm93c31cclxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW5kZXJSb3coa2V5OiBzdHJpbmcsIGl0ZW1zOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+KSB7XHJcbiAgICAgICAgdmFyIHRkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgdGRzLnB1c2goPHRkIGtleT17XCJsYWJlbFwiICsgaX0+PHNwYW4gY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtVGl0bGV9PntpdGVtLnRpdGxlfTwvc3Bhbj48L3RkPik7XHJcbiAgICAgICAgICAgIHRkcy5wdXNoKDx0ZCBrZXk9e1widmFsdWVcIiArIGl9Pnt0aGlzLnJlbmRlckl0ZW0oaXRlbSwgaSA9PSAwKX08L3RkPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8dHIga2V5PXtrZXl9Pnt0ZHN9PC90cj47XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySXRlbShpdGVtOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwsIGlzRmlyc3Q6IGJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGlucHV0SWQgPSBpc0ZpcnN0ID8gdGhpcy5xdWVzdGlvbi5pbnB1dElkIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gPFN1cnZleVF1ZXN0aW9uTXVsdGlwbGVUZXh0SXRlbSBpdGVtPXtpdGVtfSBjc3M9e3RoaXMuY3NzfSBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9IGlucHV0SWQ9e2lucHV0SWR9IC8+O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25NdWx0aXBsZVRleHRJdGVtIGV4dGVuZHMgU3VydmV5RWxlbWVudEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBpdGVtOiBNdWx0aXBsZVRleHRJdGVtTW9kZWw7XHJcbiAgICBwcml2YXRlIGlucHV0SWQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gcHJvcHMuaXRlbTtcclxuICAgICAgICB0aGlzLmlucHV0SWQgPSBwcm9wcy5pbnB1dElkO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLml0ZW0udmFsdWUgfHwgJycgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25CbHVyID0gdGhpcy5oYW5kbGVPbkJsdXIuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiBldmVudC50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkJsdXIoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLml0ZW0udmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZhbHVlOiB0aGlzLml0ZW0udmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5pdGVtID0gbmV4dFByb3BzLml0ZW07XHJcbiAgICAgICAgdGhpcy5jc3MgPSBuZXh0UHJvcHMuY3NzO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICBpZiAoIXRoaXMuaXRlbSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHN0eWxlID0geyBmbG9hdDogXCJsZWZ0XCIgfTtcclxuICAgICAgICBpZiAodGhpcy5pc0Rpc3BsYXlNb2RlKSByZXR1cm4gKDxkaXYgaWQ9e3RoaXMuaW5wdXRJZH0gY2xhc3NOYW1lPXt0aGlzLmNzcy5pdGVtVmFsdWV9IHN0eWxlPXtzdHlsZX0+e3RoaXMuaXRlbS52YWx1ZX08L2Rpdj4pO1xyXG4gICAgICAgIHJldHVybiAoPGlucHV0IGlkPXt0aGlzLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3MuaXRlbVZhbHVlfSBzdHlsZT17c3R5bGV9IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9IHBsYWNlaG9sZGVyPXt0aGlzLml0ZW0ucGxhY2VIb2xkZXJ9IG9uQmx1cj17dGhpcy5oYW5kbGVPbkJsdXJ9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSAvPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IG1haW5DbGFzc05hbWUoKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxufVxyXG5cclxuUmVhY3RRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uTXVsdGlwbGVUZXh0LCBwcm9wcyk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tdWx0aXBsZXRleHQudHN4XG4gKiovIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25SYWRpb2dyb3VwTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9yYWRpb2dyb3VwXCI7XHJcbmltcG9ydCB7SXRlbVZhbHVlfSBmcm9tIFwiLi4vYmFzZVwiO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25jb21tZW50XCI7XHJcbmltcG9ydCB7UmVhY3RRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25SYWRpb2dyb3VwIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGNob2ljZXNDaGFuZ2VkOiAwIH07XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5jaG9pY2VzQ2hhbmdlZCA9IHNlbGYuc3RhdGUuY2hvaWNlc0NoYW5nZWQgKyAxO1xyXG4gICAgICAgICAgICBzZWxmLnNldFN0YXRlKHNlbGYuc3RhdGUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwgeyByZXR1cm4gdGhpcy5xdWVzdGlvbkJhc2UgYXMgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWw7IH1cclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGZvcm0gY2xhc3NOYW1lPXt0aGlzLmNzcy5yb290fT5cclxuICAgICAgICAgICAge3RoaXMuZ2V0SXRlbXMoKSB9XHJcbiAgICAgICAgICAgIDwvZm9ybT4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi52aXNpYmxlQ2hvaWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMucXVlc3Rpb24udmlzaWJsZUNob2ljZXNbaV07XHJcbiAgICAgICAgICAgIHZhciBrZXkgPSBcIml0ZW1cIiArIGk7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5yZW5kZXJJdGVtKGtleSwgaXRlbSwgaSA9PSAwKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgdGV4dFN0eWxlKCk6IGFueSB7IHJldHVybiB7IG1hcmdpbkxlZnQ6IFwiM3B4XCIgfTsgfVxyXG4gICAgcHJpdmF0ZSByZW5kZXJJdGVtKGtleTogc3RyaW5nLCBpdGVtOiBJdGVtVmFsdWUsIGlzRmlyc3Q6IGJvb2xlYW4pOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIGl0ZW1XaWR0aCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPiAwID8gKDEwMCAvIHRoaXMucXVlc3Rpb24uY29sQ291bnQpICsgXCIlXCIgOiBcIlwiO1xyXG4gICAgICAgIHZhciBtYXJnaW5SaWdodCA9IHRoaXMucXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFwiNXB4XCIgOiBcIjBweFwiO1xyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHsgbWFyZ2luUmlnaHQ6IG1hcmdpblJpZ2h0IH07XHJcbiAgICAgICAgaWYgKGl0ZW1XaWR0aCkge1xyXG4gICAgICAgICAgICBkaXZTdHlsZVtcIndpZHRoXCJdID0gaXRlbVdpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5xdWVzdGlvbi52YWx1ZSA9PSBpdGVtLnZhbHVlO1xyXG4gICAgICAgIHZhciBvdGhlckl0ZW0gPSAoaXNDaGVja2VkICYmIGl0ZW0udmFsdWUgPT09IHRoaXMucXVlc3Rpb24ub3RoZXJJdGVtLnZhbHVlKSA/IHRoaXMucmVuZGVyT3RoZXIoKSA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUmFkaW8oa2V5LCBpdGVtLCBpc0NoZWNrZWQsIGRpdlN0eWxlLCBvdGhlckl0ZW0sIGlzRmlyc3QpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclJhZGlvKGtleTogc3RyaW5nLCBpdGVtOiBJdGVtVmFsdWUsIGlzQ2hlY2tlZDogYm9vbGVhbiwgZGl2U3R5bGU6IGFueSwgb3RoZXJJdGVtOiBKU1guRWxlbWVudCwgaXNGaXJzdDogYm9vbGVhbik6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaWQgPSBpc0ZpcnN0ID8gdGhpcy5xdWVzdGlvbi5pbnB1dElkIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gKDxkaXYga2V5PXtrZXl9IGNsYXNzTmFtZT17dGhpcy5jc3MuaXRlbX0gc3R5bGU9e2RpdlN0eWxlfT5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9e3RoaXMuY3NzLml0ZW19PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPXtpZH0gdHlwZT1cInJhZGlvXCIgIGNoZWNrZWQ9e2lzQ2hlY2tlZH0gdmFsdWU9e2l0ZW0udmFsdWV9IGRpc2FibGVkPXt0aGlzLmlzRGlzcGxheU1vZGV9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZU9uQ2hhbmdlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt0aGlzLnRleHRTdHlsZX0+e2l0ZW0udGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIHtvdGhlckl0ZW19XHJcbiAgICAgICAgICAgIDwvZGl2Pik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyT3RoZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiAoPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLm90aGVyfT48U3VydmV5UXVlc3Rpb25Db21tZW50SXRlbSAgcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGNzcz17dGhpcy5yb290Q3NzfSBpc0Rpc3BsYXlNb2RlPXt0aGlzLmlzRGlzcGxheU1vZGV9Lz48L2Rpdj4pO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uUmFkaW9ncm91cCwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9ucmFkaW9ncm91cC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmVsZW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvblRleHRNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX3RleHRcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25UZXh0IGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FbGVtZW50QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnF1ZXN0aW9uLnZhbHVlIHx8ICcnIH07XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkNoYW5nZSA9IHRoaXMuaGFuZGxlT25DaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQmx1ciA9IHRoaXMuaGFuZGxlT25CbHVyLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHF1ZXN0aW9uKCk6IFF1ZXN0aW9uVGV4dE1vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uVGV4dE1vZGVsOyB9XHJcbiAgICBoYW5kbGVPbkNoYW5nZShldmVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25CbHVyKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfHwgJycgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSlcclxuICAgICAgICAgICAgcmV0dXJuICg8ZGl2IGlkPXt0aGlzLnF1ZXN0aW9uLmlucHV0SWR9IGNsYXNzTmFtZT17dGhpcy5jc3N9Pnt0aGlzLnF1ZXN0aW9uLnZhbHVlfTwvZGl2PilcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9e3RoaXMucXVlc3Rpb24uaW5wdXRJZH0gY2xhc3NOYW1lPXt0aGlzLmNzc30gdHlwZT17dGhpcy5xdWVzdGlvbi5pbnB1dFR5cGV9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfSBzaXplPXt0aGlzLnF1ZXN0aW9uLnNpemV9IHBsYWNlaG9sZGVyPXt0aGlzLnF1ZXN0aW9uLnBsYWNlSG9sZGVyfSBvbkJsdXI9e3RoaXMuaGFuZGxlT25CbHVyfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAocHJvcHMpID0+IHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFN1cnZleVF1ZXN0aW9uVGV4dCwgcHJvcHMpO1xyXG59KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9yZWFjdC9yZWFjdHF1ZXN0aW9udGV4dC50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5RWxlbWVudEJhc2UsIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2V9IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25lbGVtZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcbmltcG9ydCB7SVN1cnZleUNyZWF0b3IsIFN1cnZleVF1ZXN0aW9uRXJyb3JzfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uXCI7XHJcbmltcG9ydCB7TWF0cml4RHluYW1pY1Jvd01vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fbWF0cml4ZHluYW1pY1wiO1xyXG5pbXBvcnQge01hdHJpeERyb3Bkb3duQ2VsbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5pbXBvcnQge1JlYWN0UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHluYW1pYyBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMocHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCB7IHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZSBhcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbDsgfVxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKTtcclxuICAgICAgICB0aGlzLnNldFByb3BlcnRpZXMobmV4dFByb3BzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydGllcyhuZXh0UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnN0YXRlID0geyByb3dDb3VudGVyOiAwIH07XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5yb3dDb3VudENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2VsZi5zdGF0ZS5yb3dDb3VudGVyID0gc2VsZi5zdGF0ZS5yb3dDb3VudGVyICsgMTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlT25Sb3dBZGRDbGljayA9IHRoaXMuaGFuZGxlT25Sb3dBZGRDbGljay5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgaGFuZGxlT25Sb3dBZGRDbGljayhldmVudCkge1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24uYWRkUm93KCk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlcnMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb24uY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5xdWVzdGlvbi5jb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB2YXIga2V5ID0gXCJjb2x1bW5cIiArIGk7XHJcbiAgICAgICAgICAgIHZhciBtaW5XaWR0aCA9IHRoaXMucXVlc3Rpb24uZ2V0Q29sdW1uV2lkdGgoY29sdW1uKTtcclxuICAgICAgICAgICAgdmFyIGNvbHVtblN0eWxlID0gbWluV2lkdGggPyB7IG1pbldpZHRoOiBtaW5XaWR0aCB9IDoge307XHJcbiAgICAgICAgICAgIGhlYWRlcnMucHVzaCg8dGgga2V5PXtrZXl9IHN0eWxlPXtjb2x1bW5TdHlsZX0+e3RoaXMucXVlc3Rpb24uZ2V0Q29sdW1uVGl0bGUoY29sdW1uKSB9PC90aD4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcm93cyA9IFtdO1xyXG4gICAgICAgIHZhciB2aXNpYmxlUm93cyA9IHRoaXMucXVlc3Rpb24udmlzaWJsZVJvd3M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcm93ID0gdmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHJvd3MucHVzaCg8U3VydmV5UXVlc3Rpb25NYXRyaXhEeW5hbWljUm93IGtleT17cm93LmlkfSByb3c9e3Jvd30gcXVlc3Rpb249e3RoaXMucXVlc3Rpb259IGluZGV4PXtpfSBjc3M9e3RoaXMuY3NzfSByb290Q3NzPXt0aGlzLnJvb3RDc3N9IGlzRGlzcGxheU1vZGU9e3RoaXMuaXNEaXNwbGF5TW9kZX0gY3JlYXRvcj17dGhpcy5jcmVhdG9yfSAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkaXZTdHlsZSA9IHRoaXMucXVlc3Rpb24uaG9yaXpvbnRhbFNjcm9sbCA/IHsgb3ZlcmZsb3dYOiAnc2Nyb2xsJyB9IDoge307XHJcbiAgICAgICAgdmFyIGJ0bkRlbGV0ZVREID0gIXRoaXMuaXNEaXNwbGF5TW9kZSA/IDx0aD48L3RoPiA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgIHN0eWxlPXtkaXZTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aGVhZGVyc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7YnRuRGVsZXRlVER9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3Jvd3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAge3RoaXMucmVuZGVyQWRkUm93QnV0dG9uKCkgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckFkZFJvd0J1dHRvbigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEaXNwbGF5TW9kZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIDxpbnB1dCBjbGFzc05hbWU9e3RoaXMuY3NzLmJ1dHRvbn0gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlT25Sb3dBZGRDbGlja30gdmFsdWU9e3RoaXMucXVlc3Rpb24uYWRkUm93VGV4dH0gLz47XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeER5bmFtaWNSb3cgZXh0ZW5kcyBTdXJ2ZXlFbGVtZW50QmFzZSB7XHJcbiAgICBwcml2YXRlIHJvdzogTWF0cml4RHluYW1pY1Jvd01vZGVsO1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbjogUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWw7XHJcbiAgICBwcml2YXRlIGluZGV4OiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRvcjogSVN1cnZleUNyZWF0b3I7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhwcm9wcyk7XHJcbiAgICB9XHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIuY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpO1xyXG4gICAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhuZXh0UHJvcHMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQcm9wZXJ0aWVzKG5leHRQcm9wczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5yb3cgPSBuZXh0UHJvcHMucm93O1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBuZXh0UHJvcHMucXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IG5leHRQcm9wcy5pbmRleDtcclxuICAgICAgICB0aGlzLmNyZWF0b3IgPSBuZXh0UHJvcHMuY3JlYXRvcjtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uUm93UmVtb3ZlQ2xpY2sgPSB0aGlzLmhhbmRsZU9uUm93UmVtb3ZlQ2xpY2suYmluZCh0aGlzKTtcclxuICAgIH1cclxuICAgIGhhbmRsZU9uUm93UmVtb3ZlQ2xpY2soZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnJlbW92ZVJvdyh0aGlzLmluZGV4KTtcclxuICAgIH1cclxuICAgIHJlbmRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJvdykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3cuY2VsbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLnJvdy5jZWxsc1tpXTtcclxuICAgICAgICAgICAgdmFyIGVycm9ycyA9IDxTdXJ2ZXlRdWVzdGlvbkVycm9ycyBxdWVzdGlvbj17Y2VsbC5xdWVzdGlvbn0gY3NzPXt0aGlzLnJvb3RDc3N9IGNyZWF0b3I9e3RoaXMuY3JlYXRvcn0gLz47XHJcbiAgICAgICAgICAgIHZhciBzZWxlY3QgPSB0aGlzLnJlbmRlclF1ZXN0aW9uKGNlbGwpO1xyXG4gICAgICAgICAgICB0ZHMucHVzaCg8dGQga2V5PXtcInJvd1wiICsgaX0+e2Vycm9yc317c2VsZWN0fTwvdGQ+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGlzcGxheU1vZGUpIHtcclxuICAgICAgICAgICAgdmFyIHJlbW92ZUJ1dHRvbiA9IHRoaXMucmVuZGVyQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHRkcy5wdXNoKDx0ZCBrZXk9e1wicm93XCIgKyB0aGlzLnJvdy5jZWxscy5sZW5ndGggKyAxfT57cmVtb3ZlQnV0dG9ufTwvdGQ+KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICg8dHI+e3Rkc308L3RyPik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUXVlc3Rpb24oY2VsbDogTWF0cml4RHJvcGRvd25DZWxsKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0b3IuY3JlYXRlUXVlc3Rpb25FbGVtZW50KGNlbGwucXVlc3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckJ1dHRvbigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgcmV0dXJuIDxpbnB1dCBjbGFzc05hbWU9e3RoaXMuY3NzLmJ1dHRvbn0gdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlT25Sb3dSZW1vdmVDbGlja30gdmFsdWU9e3RoaXMucXVlc3Rpb24ucmVtb3ZlUm93VGV4dH0gLz47XHJcbiAgICB9XHJcbn1cclxuXHJcblJlYWN0UXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkeW5hbWljXCIsIChwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VydmV5UXVlc3Rpb25NYXRyaXhEeW5hbWljLCBwcm9wcyk7XHJcbn0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0cXVlc3Rpb25tYXRyaXhkeW5hbWljLnRzeFxuICoqLyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVsZW1lbnRCYXNlfSBmcm9tIFwiLi9yZWFjdHF1ZXN0aW9uZWxlbWVudFwiO1xyXG5pbXBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW19IGZyb20gXCIuL3JlYWN0cXVlc3Rpb25jb21tZW50XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25SYXRpbmdNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX3JhdGluZ1wiO1xyXG5pbXBvcnQge0l0ZW1WYWx1ZX0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuaW1wb3J0IHtSZWFjdFF1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcmVhY3RxdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvblJhdGluZyBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWxlbWVudEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLmhhbmRsZU9uQ2hhbmdlID0gdGhpcy5oYW5kbGVPbkNoYW5nZS5iaW5kKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBxdWVzdGlvbigpOiBRdWVzdGlvblJhdGluZ01vZGVsIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25CYXNlIGFzIFF1ZXN0aW9uUmF0aW5nTW9kZWw7IH1cclxuICAgIGhhbmRsZU9uQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmFsdWU6IHRoaXMucXVlc3Rpb24udmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWVzdGlvbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbi52aXNpYmxlUmF0ZVZhbHVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbWluVGV4dCA9IGkgPT0gMCA/IHRoaXMucXVlc3Rpb24ubWluaW51bVJhdGVEZXNjcmlwdGlvbiArIFwiIFwiIDogbnVsbDtcclxuICAgICAgICAgICAgdmFyIG1heFRleHQgPSBpID09IHRoaXMucXVlc3Rpb24udmlzaWJsZVJhdGVWYWx1ZXMubGVuZ3RoIC0gMSA/IFwiIFwiICsgdGhpcy5xdWVzdGlvbi5tYXhpbXVtUmF0ZURlc2NyaXB0aW9uIDogbnVsbDtcclxuICAgICAgICAgICAgdmFsdWVzLnB1c2godGhpcy5yZW5kZXJJdGVtKFwidmFsdWVcIiArIGksIHRoaXMucXVlc3Rpb24udmlzaWJsZVJhdGVWYWx1ZXNbaV0sIG1pblRleHQsIG1heFRleHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNvbW1lbnQgPSB0aGlzLnF1ZXN0aW9uLmhhc090aGVyID8gdGhpcy5yZW5kZXJPdGhlcigpIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mucm9vdH0+XHJcbiAgICAgICAgICAgICAgICB7dmFsdWVzfVxyXG4gICAgICAgICAgICAgICAge2NvbW1lbnR9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVySXRlbShrZXk6IHN0cmluZywgaXRlbTogSXRlbVZhbHVlLCBtaW5UZXh0OiBzdHJpbmcsIG1heFRleHQ6IHN0cmluZyk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICB2YXIgaXNDaGVja2VkID0gdGhpcy5xdWVzdGlvbi52YWx1ZSA9PSBpdGVtLnZhbHVlO1xyXG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLmNzcy5pdGVtO1xyXG4gICAgICAgIGlmIChpc0NoZWNrZWQpIGNsYXNzTmFtZSArPSBcIiBhY3RpdmVcIjtcclxuICAgICAgICB2YXIgbWluID0gbWluVGV4dCA/IDxzcGFuPnttaW5UZXh0fTwvc3Bhbj4gOiBudWxsO1xyXG4gICAgICAgIHZhciBtYXggPSBtYXhUZXh0ID8gPHNwYW4+e21heFRleHR9PC9zcGFuPiA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIDxsYWJlbCBrZXk9e2tleX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgc3R5bGU9e3sgZGlzcGxheTogXCJub25lXCIgfX0gbmFtZT17dGhpcy5xdWVzdGlvbi5uYW1lfSB2YWx1ZT17aXRlbS52YWx1ZX0gZGlzYWJsZWQ9e3RoaXMuaXNEaXNwbGF5TW9kZX0gY2hlY2tlZD17dGhpcy5xdWVzdGlvbi52YWx1ZSA9PSBpdGVtLnZhbHVlfSBvbkNoYW5nZT17dGhpcy5oYW5kbGVPbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAge21pbn1cclxuICAgICAgICAgICAgPHNwYW4+e2l0ZW0udGV4dH08L3NwYW4+XHJcbiAgICAgICAgICAgIHttYXh9XHJcbiAgICAgICAgICAgIDwvbGFiZWw+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlck90aGVyKCk6IEpTWC5FbGVtZW50IHtcclxuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPXt0aGlzLmNzcy5vdGhlcn0+PFN1cnZleVF1ZXN0aW9uQ29tbWVudEl0ZW0gIHF1ZXN0aW9uPXt0aGlzLnF1ZXN0aW9ufSBjc3M9e3RoaXMucm9vdENzc30gaXNEaXNwbGF5TW9kZT17dGhpcy5pc0Rpc3BsYXlNb2RlfS8+PC9kaXY+KTtcclxuICAgIH1cclxufVxyXG5SZWFjdFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChwcm9wcykgPT4ge1xyXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3VydmV5UXVlc3Rpb25SYXRpbmcsIHByb3BzKTtcclxufSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcmVhY3QvcmVhY3RxdWVzdGlvbnJhdGluZy50c3hcbiAqKi8iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7U3VydmV5fSBmcm9tIFwiLi9yZWFjdFN1cnZleVwiO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi4vc3VydmV5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5V2luZG93IGV4dGVuZHMgU3VydmV5IHtcclxuICAgIHByaXZhdGUgdGl0bGU6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVPbkV4cGFuZGVkID0gdGhpcy5oYW5kbGVPbkV4cGFuZGVkLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBoYW5kbGVPbkV4cGFuZGVkKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5leHBhbmRlZCA9ICF0aGlzLnN0YXRlLmV4cGFuZGVkO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zdGF0ZSk7XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmhpZGRlbikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGhlYWRlciA9IHRoaXMucmVuZGVySGVhZGVyKCk7XHJcbiAgICAgICAgdmFyIGJvZHkgPSB0aGlzLnN0YXRlLmV4cGFuZGVkID8gdGhpcy5yZW5kZXJCb2R5KCkgOiBudWxsO1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHsgcG9zaXRpb246IFwiZml4ZWRcIiwgYm90dG9tOiBcIjNweFwiLCByaWdodDogXCIxMHB4XCIgfTtcclxuICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9e3RoaXMuY3NzLndpbmRvdy5yb290fSBzdHlsZT17c3R5bGV9PlxyXG4gICAgICAgICAgICB7aGVhZGVyfVxyXG4gICAgICAgICAgICB7Ym9keX1cclxuICAgICAgICAgICAgPC9kaXY+O1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckhlYWRlcigpOiBKU1guRWxlbWVudCB7XHJcbiAgICAgICAgdmFyIHN0eWxlQSA9IHsgd2lkdGg6IFwiMTAwJVwiIH07XHJcbiAgICAgICAgdmFyIHN0eWxlVGl0bGUgPSB7IHBhZGRpbmdSaWdodDogXCIxMHB4XCIgfTtcclxuICAgICAgICB2YXIgZ2x5cGhDbGFzc05hbWUgPSB0aGlzLnN0YXRlLmV4cGFuZGVkID8gdGhpcy5jc3Mud2luZG93LmhlYWRlci5idXR0b25Db2xsYXBzZWQgOiB0aGlzLmNzcy53aW5kb3cuaGVhZGVyLmJ1dHRvbkV4cGFuZGVkO1xyXG4gICAgICAgIGdseXBoQ2xhc3NOYW1lID0gXCJnbHlwaGljb24gcHVsbC1yaWdodCBcIiArIGdseXBoQ2xhc3NOYW1lO1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17dGhpcy5jc3Mud2luZG93LmhlYWRlci5yb290fT5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZU9uRXhwYW5kZWR9IHN0eWxlPXtzdHlsZUF9PlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXt0aGlzLmNzcy53aW5kb3cuaGVhZGVyLnRpdGxlfSBzdHlsZT17c3R5bGVUaXRsZX0+e3RoaXMudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtnbHlwaENsYXNzTmFtZX0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlckJvZHkoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzPXt0aGlzLmNzcy53aW5kb3cuYm9keX0+XHJcbiAgICAgICAge3RoaXMucmVuZGVyU3VydmV5KCkgfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTdXJ2ZXkobmV3UHJvcHM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZVN1cnZleShuZXdQcm9wcyk7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IG5ld1Byb3BzLnRpdGxlID8gbmV3UHJvcHMudGl0bGUgOiB0aGlzLnN1cnZleS50aXRsZTtcclxuICAgICAgICB2YXIgaGFzRXhwYW5kZWQgPSBuZXdQcm9wc1tcImV4cGFuZGVkXCJdID8gbmV3UHJvcHMuZXhwYW5kZWQgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBleHBhbmRlZDogaGFzRXhwYW5kZWQsIGhpZGRlbjogZmFsc2UgfTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKHM6IFN1cnZleU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHNlbGYuc3RhdGUuaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShzZWxmLnN0YXRlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3JlYWN0L3JlYWN0U3VydmV5V2luZG93LnRzeFxuICoqLyIsImltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2RhbmlzaCc7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2R1dGNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZmlubmlzaCc7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2ZyZW5jaCc7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2dlcm1hbic7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2dyZWVrJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vcG9saXNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vcnVzc2lhbic7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL3R1cmtpc2gnO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJpZXMvY2h1bmtzL2xvY2FsaXphdGlvbi50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBkYW5pc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlRpbGJhZ2VcIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJWaWRlcmVcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJGw6ZyZGlnXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiU2lkZSB7MH0gYWYgezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJEZXIgZXIgaW5nZW4gc3lubGlnZSBzcMO4cmdzbcOlbC5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiTWFuZ2UgdGFrIGZvciBkaW4gYmVzdmFyZWxzZSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiU3DDuHJnZXNrZW1hZXQgaGVudGVzIGZyYSBzZXJ2ZXJlbi4uLlwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJWYWxnZnJpdCBzdmFyLi4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJWw6ZsZy4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJCZXN2YXIgdmVubGlnc3Qgc3DDuHJnc23DpWxldC5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJBbmdpdiBldCB0YWwuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIkFuZ2l2IG1pbmRzdCB7MH0gdGVnbi5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIlbDpmxnIHZlbmxpZ3N0IG1pbmRzdCAgezB9IHN2YXJtdWxpZ2hlZChlcikuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJWw6ZsZyB2ZW5saWdzdCBmw6ZycmUgezB9IHN2YXJtdWxpZ2hlZGVyKGVyKS5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScgc2thbCB2w6ZyZSBsaWcgbWVkIGVsbGVyIHN0w7hycmUgZW5kIHsxfSBvZyBsaWcgbWVkIGVsbGVyIG1pbmRyZSBlbmQgezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIid7MH0nIHNrYWwgdsOmcmUgbGlnIG1lZCBlbGxlciBzdMO4cnJlIGVuZCB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiJ3swfScgc2thbCB2w6ZyZSBsaWcgbWVkIGVsbGVyIG1pbmRyZSBlbmQgezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwiQW5naXYgdmVubGlnc3QgZW4gZ3lsZGlnIGUtbWFpbCBhZHJlc3NlLlwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJGaWxzdMO4cnJlbHNlbiBtw6UgaWtrZSBvdmVyc3RpZ2UgezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkFuZ2l2IGVuIHbDpnJkaSBmb3IgZGl0IHZhbGdmcmllIHN2YXIuXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZGFcIl0gPSBkYW5pc2hTdXJ2ZXlTdHJpbmdzO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2NhbGl6YXRpb24vZGFuaXNoLnRzXG4gKiovIiwiLy9DcmVhdGVkIG9uIGJlaGFsZiBodHRwczovL2dpdGh1Yi5jb20vRnJhbmsxM1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCB2YXIgZHV0Y2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlZvcmlnZVwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIlZvbGdlbmRlXCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiQWZzbHVpdGVuXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIkFuZGVyZVwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2luYSB7MH0gdmFuIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiRXIgaXMgZ2VlbiB6aWNodGJhcmUgcGFnaW5hIG9mIHZyYWFnIGluIGRlemUgdnJhZ2VubGlqc3RcIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiQmVkYW5rdCBvbSBkZXplIHZyYWdlbmxpanN0IGluIHRlIHZ1bGxlblwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJEZSB2cmFnZW5saWpzdCBpcyBhYW4gaGV0IGxhZGVuLi4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJLaWVzLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIkdlbGlldmUgZWVuIGFudHdvb3JkIGluIHRlIHZ1bGxlblwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIkhldCBhbnR3b29yZCBtb2V0IGVlbiBnZXRhbCB6aWpuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIkdlbGlldmUgbWluc3RlbiB7MH0ga2FyYWt0ZXJzIGluIHRlIHZ1bGxlbi5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIkdlbGlldmUgbWluaW11bSB7MH0gYW50d29vcmRlbiB0ZSBzZWxlY3RlcmVuLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiR2VsaWV2ZSBuaWV0IG1lZXIgZGFuIHswfSBhbnR3b29yZGVuIHRlIHNlbGVjdGVyZW4uXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIlV3IGFudHdvb3JkICd7MH0nIG1vZXQgZ3JvdGVyIG9mIGdlbGlqayB6aWpuIGFhbiB7MX0gZW4ga2xlaW5lciBvZiBnZWxpamsgYWFuIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCJVdyBhbnR3b29yZCAnezB9JyBtb2V0IGdyb3RlciBvZiBnZWxpamsgemlqbiBhYW4gezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIlV3IGFudHdvb3JkICd7MH0nIG1vZXQgZ3JvdGVyIG9mIGdlbGlqayB6aWpuIGFhbiB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJHZWxpZXZlIGVlbiBnZWxkaWcgZS1tYWlsYWRyZXMgaW4gdGUgdnVsbGVuLlwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJEZSBncm9vdHRlIHZhbiBoZXQgYmVzdGFuZCBtYWcgbmlldCBncm90ZXIgemlqbiBkYW4gezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkdlbGlldmUgaGV0IHZlbGQgJ0FuZGVyZScgaW4gdGUgdnVsbGVuXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wibmxcIl0gPSBkdXRjaFN1cnZleVN0cmluZ3M7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9kdXRjaC50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBmaW5uaXNoU3VydmV5U3RyaW5ncyA9IHtcclxuICAgIHBhZ2VQcmV2VGV4dDogXCJFZGVsbGluZW5cIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJTZXVyYWF2YVwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIlZhbG1pc1wiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJNdXUgKGt1dmFpbGUpXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiU2l2dSB7MH0vezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJUw6Rzc8OkIGt5c2VseXNzw6QgZWkgb2xlIHlodMOka8Okw6RuIG7DpGt5dmlsbMOkIG9sZXZhYSBzaXZ1YSB0YWkga3lzeW15c3TDpC5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiS2lpdG9zIGt5c2VseXluIHZhc3RhYW1pc2VzdGEhXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcIkt5c2VsecOkIGxhZGF0YWFuIHBhbHZlbGltZWx0YS4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiVmFsaXRzZS4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJWYXN0YWEga3lzeW15a3NlZW4sIGtpaXRvcy5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJBcnZvbiB0dWxlZSBvbGxhIG51bWVlcmluZW4uXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIk9sZSBoeXbDpCBqYSBzecO2dMOkIHbDpGhpbnTDpMOkbiB7MH0gbWVya2tpw6QuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSB2w6RoaW50w6TDpG4gezB9IHZhaWh0b2VodG9hLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiT2xlIGh5dsOkIGphIHZhbGl0c2UgZW5pbnTDpMOkbiB7MH0gdmFpaHRvZWh0b2EuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIid7MH0nIHTDpHl0eXkgb2xsYSBlbmVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7MX0gamEgdsOkaGVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCInezB9JyB0w6R5dHl5IG9sbGEgdsOkaGVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJTecO2dMOkIHZhbGlkaSBzw6Roa8O2cG9zdGlvc29pdGUuXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgXFxcIk11dSAoa3V2YWlsZSlcXFwiXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZmlcIl0gPSBmaW5uaXNoU3VydmV5U3RyaW5ncztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2Zpbm5pc2gudHNcbiAqKi8iLCIvL0NyZWF0ZWQgb24gYmVoYWxmIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmFuazEzXHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBmcmVuY2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlByXFx1MDBlOWNcXHUwMGU5ZGVudFwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIlN1aXZhbnRcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJUZXJtaW5lclwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJBdXRyZSAocHJcXHUwMGU5Y2lzZXIpXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiUGFnZSB7MH0gc3VyIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiSWwgbid5IGEgbmkgcGFnZSB2aXNpYmxlIG5pIHF1ZXN0aW9uIHZpc2libGUgZGFucyBjZSBxdWVzdGlvbm5haXJlXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIk1lcmNpIGQnYXZvaXIgclxcdTAwZTlwb25kdSBhdSBxdWVzdGlvbm5haXJlIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJMZSBxdWVzdGlvbm5haXJlIGVzdCBlbiBjb3VycyBkZSBjaGFyZ2VtZW50Li4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJDaG9pc2lzc2V6Li4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIkxhIHJcXHUwMGU5cG9uc2UgXFx1MDBlMCBjZXR0ZSBxdWVzdGlvbiBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICBudW1lcmljRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBkb2l0IFxcdTAwZWF0cmUgdW4gbm9tYnJlLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJNZXJjaSBkJ2VudHJlciBhdSBtb2lucyB7MH0gc3ltYm9sZXMuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgbW9pbnMgezB9clxcdTAwZTlwb25zZXMuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgcGx1cyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiVm90cmUgclxcdTAwZTlwb25zZSAnezB9JyBkb2l0IFxcdTAwZWF0cmVzdXBcXHUwMGU5cmlldXJlIG91IFxcdTAwZTlnYWxlIFxcdTAwZTAgezF9IGV0IGluZlxcdTAwZTlyaWV1cmUgb3VcXHUwMGU5Z2FsZSBcXHUwMGUwIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCJWb3RyZSByXFx1MDBlOXBvbnNlICd7MH0nIGRvaXQgXFx1MDBlYXRyZXN1cFxcdTAwZTlyaWV1cmUgb3UgXFx1MDBlOWdhbGUgXFx1MDBlMCB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiVm90cmUgclxcdTAwZTlwb25zZSAnezB9JyBkb2l0IFxcdTAwZWF0cmVpbmZcXHUwMGU5cmlldXJlIG91IFxcdTAwZTlnYWxlIFxcdTAwZTAgezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwiTWVyY2kgZCdlbnRyZXIgdW5lIGFkcmVzc2UgbWFpbCB2YWxpZGUuXCIsXHJcbiAgICBleGNlZWRNYXhTaXplOiBcIkxhIHRhaWxsZSBkdSBmaWNoaWVyIG5lIGRvaXQgcGFzIGV4Y1xcdTAwZTlkZXIgezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIk1lcmNpIGRlIHByXFx1MDBlOWNpc2VyIGxlIGNoYW1wICdBdXRyZScuXCJcclxufTtcclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJmclwiXSA9IGZyZW5jaFN1cnZleVN0cmluZ3M7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2ZyZW5jaC50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBnZXJtYW5TdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlp1csO8Y2tcIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJXZWl0ZXJcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJGZXJ0aWdcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJTZWl0ZSB7MH0gdm9uIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiRXMgZ2lidCBrZWluZSBzaWNodGJhcmUgRnJhZ2UuXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIlZpZWxlbiBEYW5rIGbDvHIgZGFzIEF1c2bDvGxsZW4gZGVzIEZyYWdlYm9nZW5zIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJEZXIgRnJhZ2Vib2dlbiB3aXJkIHZvbSBTZXJ2ZXIgZ2VsYWRlbi4uLlwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJCZW51dHplcmRlZmluaWVydGUgQW50d29ydC4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiV8OkaGxlbi4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBhbnR3b3J0ZW4gU2llIGF1ZiBkaWUgRnJhZ2UuXCIsXHJcbiAgICBudW1lcmljRXJyb3I6IFwiRGVyIFdlcnQgc29sbHRlIGVpbmUgWmFobCBzZWluLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJCaXR0ZSBnZWJlbiBTaWUgbWluZGVzdGVucyB7MH0gU3ltYm9sZS5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG1pbmRlc3RlbnMgezB9IFZhcmlhbnRlbi5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG5pY2h0IG1laHIgYWxzIHswfSBWYXJpYW50ZW4uXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGdyw7bDn2VyIHNlaW4gYWxzIHsxfSB1bmQgZ2xlaWNoIG9kZXIga2xlaW5lciBhbHMgezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGdyw7bDn2VyIHNlaW4gYWxzIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZSBnw7xsdGlnZSBFbWFpbC1BZHJlc3NlIGVpbi5cIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwiRGllIERhdGVpZ3LDtsOfZSBzb2xsIG5pY2h0IG1laHIgYWxzIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZW4gV2VydCBmw7xyIElocmUgYmVudXR6ZXJkZWZpbmllcnRlIEFudHdvcnQgZWluLlwiXHJcbn07XHJcblxyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImRlXCJdID0gZ2VybWFuU3VydmV5U3RyaW5ncztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2dlcm1hbi50c1xuICoqLyIsIi8vQ3JlYXRlZCBieSBodHRwczovL2dpdGh1Yi5jb20vYWdlbG9zcGFuYWdpb3Rha2lzXHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBncmVla1N1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwizqDPgc6/zrfOs86/z43OvM61zr3Ov1wiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIs6Vz4DPjM68zrXOvc6/XCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwizp/Ou86/zrrOu86uz4HPic+DzrdcIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwizobOu867zr8gKM+AzrHPgc6xzrrOsc67z44gzrTOuc61z4XOus+BzrnOvc6vz4PPhM61KVwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIs6jzrXOu86vzrTOsSB7MH0gzrHPgM+MIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwizpTOtc69IM+Fz4DOrM+Bz4fOtc65IM66zrHOvM6vzrEgzr/Pgc6xz4TOriDPg861zrvOr860zrEgzq4gzr/Pgc6xz4TOriDOtc+Bz47PhM63z4POtyDPg861IM6xz4XPhM+MIM+Ezr8gzrXPgc+Jz4TOt868zrHPhM6/zrvPjM6zzrnOvy5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwizpXPhc+HzrHPgc65z4PPhM6/z43OvM61IM6zzrnOsSDPhM63zr0gz4PPhc68z4DOu86uz4HPic+DzrcgzrHPhc+Ezr/PhSDPhM6/z4UgzrXPgc+Jz4TOt868zrHPhM6/zrvOv86zzq/Ov8+FIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCLOpM6/IM61z4HPic+EzrfOvM6xz4TOv867z4zOs865zr8gz4bOv8+Bz4TPjs69zrXPhM6xzrkgzrHPgM6/IM+Ezr8gzrTOuc6xzrrOv868zrnPg8+Ezq4uLi5cIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcIs6Vz4DOuc67zq3Ovs+EzrUuLi5cIixcclxuICAgIHJlcXVpcmVkRXJyb3I6IFwizqDOsc+BzrHOus6xzrvPjiDOsc+AzrHOvc+Ezq7Pg8+EzrUgz4PPhM63zr0gzrXPgc+Oz4TOt8+DzrcuXCIsXHJcbiAgICByZXF1aXJlZEluQWxsUm93c0Vycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gzrHPgM6xzr3PhM6uz4PPhM61IM+Dz4TOuc+CIM61z4HPic+Ezq7Pg861zrnPgiDPg861IM+MzrvOtc+CIM+EzrnPgiDOs8+BzrHOvM68zq3Pgi5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCLOlyDPhM65zrzOriDPgM+Bzq3PgM61zrkgzr3OsSDOtc6vzr3Osc65IM6xz4HOuc64zrzOuc+EzrnOus6uLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCLOoM6xz4HOsc66zrHOu8+OIM+Dz4XOvM+AzrvOt8+Bz47Pg8+EzrUgz4TOv8+FzrvOrM+HzrnPg8+Ezr/OvSB7MH0gz4PPjc68zrLOv867zrEuXCIsXHJcbiAgICBtaW5Sb3dDb3VudEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gz4PPhc68z4DOu863z4HPjs+Dz4TOtSDPhM6/z4XOu86sz4fOuc+Dz4TOv869IHswfSDOs8+BzrHOvM68zq3Pgi5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gzrXPgM65zrvOrc6+z4TOtSDPhM6/z4XOu86sz4fOuc+Dz4TOv869IHswfSDPgM6xz4HOsc67zrvOsc6zzq3Pgi5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gzrXPgM65zrvOrc6+z4TOtSDPjM+Hzrkgz4DOsc+BzrHPgM6szr3PiSDOsc+Azr8gezB9IM+AzrHPgc6xzrvOu86xzrPOrc+CLlwiLFxyXG4gICAgbnVtZXJpY01pbk1heDogXCLOpM6/ICd7MH0nIM64zrEgz4DPgc6tz4DOtc65IM69zrEgzrXOr869zrHOuSDOr8+Dzr8gzq4gzrzOtc6zzrHOu8+Nz4TOtc+Bzr8gzrHPgM6/IM+Ezr8gezF9IM66zrHOuSDOr8+Dzr8gzq4gzrzOuc66z4HPjM+EzrXPgc6/IM6xz4DOvyDPhM6/IHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCLOpM6/ICd7MH0nIM+Az4HOrc+AzrXOuSDOvc6xIM61zq/Ovc6xzrkgzrzOtc6zzrHOu8+Nz4TOtc+Bzr8gzq4gzrnPg86/IM68zrUgz4TOvyB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwizqTOvyAnezB9JyDPgM+Bzq3PgM61zrkgzr3OsSDOtc6vzr3Osc65IM68zrnOus+Bz4zPhM61z4HOvyDOriDOr8+Dzr8gzrHPgM6/IM+Ezr8gezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwizqDOsc+BzrHOus6xzrvPjiDOtM+Oz4PPhM61IM68zrnOsSDOsc+Azr/OtM61zrrPhM6uIM60zrnOtc+NzrjPhc69z4POtyBlLW1haWwuXCIsXHJcbiAgICB1cmxSZXF1ZXN0RXJyb3I6IFwizpcgzrHOr8+EzrfPg863IM61z4DOrc+Dz4TPgc61z4jOtSDPg8+GzqzOu868zrEgJ3swfScuIHsxfVwiLFxyXG4gICAgdXJsR2V0Q2hvaWNlc0Vycm9yOiBcIs6XIM6xzq/PhM63z4POtyDOtc+Azq3Pg8+Ez4HOtc+IzrUgzrrOtc69zqwgzrTOtc60zr/OvM6tzr3OsSDOriDOtyDOuc60z4zPhM63z4TOsSAnzrzOv869zr/PgM6sz4TOuS9wYXRoJyDOtc6vzr3Osc65IM61z4PPhs6xzrvOrc68zq3Ovc63XCIsXHJcbiAgICBleGNlZWRNYXhTaXplOiBcIs6kzr8gzrzOrc6zzrXOuM6/z4IgzrTOtc69IM68z4DOv8+BzrXOryDOvc6xIM+Fz4DOtc+BzrLOrc69zrXOuSDPhM6xIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCLOoM6xz4HOsc66zrHOu8+OIM+Dz4XOvM+AzrvOt8+Bz47Pg8+EzrUgz4TOt869IM+EzrnOvM6uIM6zzrnOsSDPhM6/IM+AzrXOtM6vzr8gJ86szrvOu86/Jy5cIixcclxuICAgIHVwbG9hZGluZ0ZpbGU6IFwizqTOvyDOsc+Bz4fOtc6vzr8gz4POsc+CIM6xzr3Otc6yzrHOr869zrXOuS4gzqDOsc+BzrHOus6xzrvPjiDPgM61z4HOuc68zq3Ovc61z4TOtSDOus6xz4DOv865zrEgzrTOtc+Fz4TOtc+Bz4zOu861z4DPhM6xIM66zrHOuSDOtM6/zrrOuc68zqzPg8+EzrUgzr7Osc69zqwuXCIsXHJcbiAgICBhZGRSb3c6IFwizqDPgc6/z4POuM6uzrrOtyDOs8+BzrHOvM68zq7PglwiLFxyXG4gICAgcmVtb3ZlUm93OiBcIs6Rz4bOsc6vz4HOtc+DzrdcIlxyXG59O1xyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImdyXCJdID0gZ3JlZWtTdXJ2ZXlTdHJpbmdzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9ncmVlay50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBwb2xpc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIldzdGVjelwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIkRhbGVqXCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiR290b3dlXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiU3Ryb25hIHswfSB6IHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiTmllIG1hIHdpZG9jem55Y2ggcHl0YcWELlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJEemnEmWt1amVteSB6YSB3eXBlxYJuaWVuaWUgYW5raWV0eSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiVHJ3YSB3Y3p5dHl3YW5pZSBhbmtpZXR5Li4uXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIklubmEgb2Rwb3dpZWTFui4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiV3liaWVyei4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJQcm9zesSZIG9kcG93aWVkemllxIcgbmEgdG8gcHl0YW5pZS5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJXIHR5bSBwb2x1IG1vxbxuYSB3cGlzYcSHIHR5bGtvIGxpY3pieS5cIixcclxuICAgIHRleHRNaW5MZW5ndGg6IFwiUHJvc3rEmSB3cGlzYcSHIGNvIG5ham1uaWVqIHswfSB6bmFrw7N3LlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiUHJvc3rEmSB3eWJyYcSHIGNvIG5ham1uaWVqIHswfSBwb3p5Y2ppLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiUHJvc3rEmSB3eWJyYcSHIG5pZSB3acSZY2VqIG5pxbwgezB9IHBvenljamkuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIk9kcG93aWVkxbogJ3swfScgcG93aW5uYSBiecSHIHdpxJlrc3phIGx1YiByw7N3bmEgezF9IG9yYXogbW5pZWpzemEgbHViIHLDs3duYSB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiT2Rwb3dpZWTFuiAnezB9JyBwb3dpbm5hIGJ5xIcgd2nEmWtzemEgbHViIHLDs3duYSB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiT2Rwb3dpZWTFuiAnezB9JyBwb3dpbm5hIGJ5xIcgbW5pZWpzemEgbHViIHLDs3duYSB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJQcm9zesSZIHBvZGHEhyBwcmF3aWTFgm93eSBhZHJlcyBlbWFpbC5cIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwiUm96bWlhciBwcnplc8WCYW5lZ28gcGxpa3UgbmllIG1vxbxlIHByemVrcmFjemHEhyB7MH0uXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiUHJvc3rEmSBwb2RhxIcgaW5uxIUgb2Rwb3dpZWTFui5cIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJwbFwiXSA9IHBvbGlzaFN1cnZleVN0cmluZ3M7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9wb2xpc2gudHNcbiAqKi8iLCJpbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCB2YXIgcnVzc2lhblN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwi0J3QsNC30LDQtFwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcItCU0LDQu9C10LVcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCLQk9C+0YLQvtCy0L5cIixcclxuICAgIHByb2dyZXNzVGV4dDogXCLQodGC0YDQsNC90LjRhtCwIHswfSDQuNC3IHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwi0J3QtdGCINC90Lgg0L7QtNC90L7Qs9C+INCy0L7Qv9GA0L7RgdCwLlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCLQkdC70LDQs9C+0LTQsNGA0LjQvCDQktCw0YEg0LfQsCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsNC90LrQtdGC0YshXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcItCX0LDQs9GA0YPQt9C60LAg0YEg0YHQtdGA0LLQtdGA0LAuLi5cIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwi0JTRgNGD0LPQvtC1ICjQv9C+0LbQsNC70YPQudGB0YLQsCwg0L7Qv9C40YjQuNGC0LUpXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCLQktGL0LHRgNCw0YLRjC4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7RgtCy0LXRgtGM0YLQtSDQvdCwINCy0L7Qv9GA0L7RgS5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCLQntGC0LLQtdGCINC00L7Qu9C20LXQvSDQsdGL0YLRjCDRh9C40YHQu9C+0LwuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDRhdC+0YLRjyDQsdGLIHswfSDRgdC40LzQstC+0LvQvtCyLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0YXQvtGC0Y8g0LHRiyB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0L3QtSDQsdC+0LvQtdC1IHswfSDQstCw0YDQuNCw0L3RgtC+0LIuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIid7MH0nINC00L7Qu9C20L3QviDQsdGL0YLRjCDRgNCw0LLQvdGL0Lwg0LjQu9C4INCx0L7Qu9GM0YjQtSwg0YfQtdC8IHsxfSwg0Lgg0YDQsNCy0L3Ri9C8INC40LvQuCDQvNC10L3RjNGI0LUsINGH0LXQvCB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIid7MH0nINC00L7Qu9C20L3QviDQsdGL0YLRjCDRgNCw0LLQvdGL0Lwg0LjQu9C4INC80LXQvdGM0YjQtSwg0YfQtdC8IHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLLlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNCw0L3QvdGL0LUg0LIg0L/QvtC70LUgXFxcItCU0YDRg9Cz0L7QtVxcXCJcIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJydVwiXSA9IHJ1c3NpYW5TdXJ2ZXlTdHJpbmdzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9ydXNzaWFuLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIHR1cmtpc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VQcmV2VGV4dDogXCJHZXJpXCIsXHJcbiAgICAgICAgcGFnZU5leHRUZXh0OiBcIsSwbGVyaVwiLFxyXG4gICAgICAgIGNvbXBsZXRlVGV4dDogXCJBbmtldGkgVGFtYW1sYVwiLFxyXG4gICAgICAgIG90aGVySXRlbVRleHQ6IFwiRGnEn2VyIChhw6fEsWtsYXnEsW7EsXopXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlNheWZhIHswfSAvIHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcIkFua2V0dGUgZ8O2csO8bnTDvGxlbmVjZWsgc2F5ZmEgeWEgZGEgc29ydSBtZXZjdXQgZGXEn2lsLlwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiQW5rZXRpbWl6aSB0YW1hbWxhZMSxxJ/EsW7EsXogacOnaW4gdGXFn2Vra8O8ciBlZGVyaXouXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJBbmtldCBzdW51Y3VkYW4gecO8a2xlbml5b3IgLi4uXCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiU2XDp2luaXogLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCJMw7x0ZmVuIHNvcnV5YSBjZXZhcCB2ZXJpbml6XCIsXHJcbiAgICAgICAgbnVtZXJpY0Vycm9yOiBcIkdpcmlsZW4gZGXEn2VyIG51bWVyaWsgb2xtYWzEsWTEsXJcIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIkVuIGF6IHswfSBzZW1ib2wgZ2lyaW5pei5cIixcclxuICAgICAgICBtaW5Sb3dDb3VudEVycm9yOiBcIkzDvHRmZW4gZW4gYXogezB9IHNhdMSxcsSxIGRvbGR1cnVuLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcIkzDvHRmZW4gZW4gYXogezB9IHNlw6dlbmXEn2kgc2XDp2luaXouXCIsXHJcbiAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiTMO8dGZlbiB7MH0gYWRldHRlbiBmYXpsYSBzZcOnbWV5aW5pei5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfSBhbmQgZXF1YWwgb3IgbGVzcyB0aGFuIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgZGXEn2VyaSB7MX0gZGXEn2VyaW5lIGXFn2l0IHZleWEgYsO8ecO8ayBvbG1hbMSxZMSxclwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiJ3swfScgZGXEn2VyaSB7MX0gZGXEn2VyaW5lIGXFn2l0IHlhIGRhIGvDvMOnw7xrIG9sbWFsxLFkxLFyLlwiLFxyXG4gICAgICAgIGludmFsaWRFbWFpbDogXCJMw7x0ZmVuIGdlw6dlcmxpIGJpciBlcG9zdGEgYWRyZXNpIGdpcmluaXouXCIsXHJcbiAgICAgICAgdXJsUmVxdWVzdEVycm9yOiBcIlRhbGViaSDFn3UgaGF0YXnEsSBkw7ZuZMO8ICd7MH0nLiB7MX1cIixcclxuICAgICAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwiVGFsZXAgaGVyaGFuZ2kgYmlyIHZlcmkgZMO2bm1lZGkgeWEgZGEgJ3BhdGgnIMO2emVsbGnEn2kgaGF0YWzEsS5cIixcclxuICAgICAgICBleGNlZWRNYXhTaXplOiBcIkRvc3lhIGJveXV0dSB7MH0gZGXEn2VyaW5pIGdlw6dlbWV6LlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJMw7x0ZmVuIGRpxJ9lciBkZcSfZXJsZXJpIGdpcmluaXouXCIsXHJcbiAgICAgICAgdXBsb2FkaW5nRmlsZTogXCJEb3N5YW7EsXogecO8a2xlbml5b3IuIEzDnHRmZW4gYmlya2HDpyBzYW5peWUgYmVrbGV5aW4gdmUgdGVrcmFyIGRlbmV5aW4uXCIsXHJcbiAgICAgICAgYWRkUm93OiBcIlNhdMSxciBFa2xlXCIsXHJcbiAgICAgICAgcmVtb3ZlUm93OiBcIkthbGTEsXJcIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJ0clwiXSA9IHR1cmtpc2hTdXJ2ZXlTdHJpbmdzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi90dXJraXNoLnRzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==