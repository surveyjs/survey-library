/*!
* surveyjs - Survey JavaScript library v0.10.4
* (c) Devsoft Baltic O� - http://surveyjs.io/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define("Survey", ["knockout"], factory);
	else if(typeof exports === 'object')
		exports["Survey"] = factory(require("knockout"));
	else
		root["Survey"] = factory(root["ko"]);
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
	exports.__extends = exports.SurveyTemplateText = exports.SurveyWindow = exports.QuestionText = exports.QuestionRating = exports.QuestionRadiogroup = exports.QuestionMultipleText = exports.QuestionMultipleTextImplementor = exports.MultipleTextItem = exports.QuestionMatrixDynamic = exports.QuestionMatrixDynamicImplementor = exports.QuestionMatrixDropdown = exports.QuestionMatrix = exports.MatrixRow = exports.QuestionHtml = exports.QuestionFile = exports.QuestionDropdown = exports.QuestionComment = exports.QuestionCheckbox = exports.QuestionCheckboxBaseImplementor = exports.QuestionSelectBaseImplementor = exports.QuestionImplementor = exports.QuestionImplementorBase = exports.Page = exports.QuestionRow = exports.Model = exports.Survey = exports.defaultBootstrapCss = exports.defaultStandardCss = undefined;
	
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
	
	var _kosurvey = __webpack_require__(37);
	
	Object.defineProperty(exports, "Survey", {
	  enumerable: true,
	  get: function get() {
	    return _kosurvey.Survey;
	  }
	});
	Object.defineProperty(exports, "Model", {
	  enumerable: true,
	  get: function get() {
	    return _kosurvey.Survey;
	  }
	});
	
	var _kopage = __webpack_require__(39);
	
	Object.defineProperty(exports, "QuestionRow", {
	  enumerable: true,
	  get: function get() {
	    return _kopage.QuestionRow;
	  }
	});
	Object.defineProperty(exports, "Page", {
	  enumerable: true,
	  get: function get() {
	    return _kopage.Page;
	  }
	});
	
	var _koquestionbase = __webpack_require__(41);
	
	Object.defineProperty(exports, "QuestionImplementorBase", {
	  enumerable: true,
	  get: function get() {
	    return _koquestionbase.QuestionImplementorBase;
	  }
	});
	
	var _koquestion = __webpack_require__(42);
	
	Object.defineProperty(exports, "QuestionImplementor", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion.QuestionImplementor;
	  }
	});
	
	var _koquestion_baseselect = __webpack_require__(43);
	
	Object.defineProperty(exports, "QuestionSelectBaseImplementor", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_baseselect.QuestionSelectBaseImplementor;
	  }
	});
	Object.defineProperty(exports, "QuestionCheckboxBaseImplementor", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_baseselect.QuestionCheckboxBaseImplementor;
	  }
	});
	
	var _koquestion_checkbox = __webpack_require__(44);
	
	Object.defineProperty(exports, "QuestionCheckbox", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_checkbox.QuestionCheckbox;
	  }
	});
	
	var _koquestion_comment = __webpack_require__(45);
	
	Object.defineProperty(exports, "QuestionComment", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_comment.QuestionComment;
	  }
	});
	
	var _koquestion_dropdown = __webpack_require__(46);
	
	Object.defineProperty(exports, "QuestionDropdown", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_dropdown.QuestionDropdown;
	  }
	});
	
	var _koquestion_file = __webpack_require__(47);
	
	Object.defineProperty(exports, "QuestionFile", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_file.QuestionFile;
	  }
	});
	
	var _koquestion_html = __webpack_require__(48);
	
	Object.defineProperty(exports, "QuestionHtml", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_html.QuestionHtml;
	  }
	});
	
	var _koquestion_matrix = __webpack_require__(49);
	
	Object.defineProperty(exports, "MatrixRow", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_matrix.MatrixRow;
	  }
	});
	Object.defineProperty(exports, "QuestionMatrix", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_matrix.QuestionMatrix;
	  }
	});
	
	var _koquestion_matrixdropdown = __webpack_require__(50);
	
	Object.defineProperty(exports, "QuestionMatrixDropdown", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_matrixdropdown.QuestionMatrixDropdown;
	  }
	});
	
	var _koquestion_matrixdynamic = __webpack_require__(51);
	
	Object.defineProperty(exports, "QuestionMatrixDynamicImplementor", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_matrixdynamic.QuestionMatrixDynamicImplementor;
	  }
	});
	Object.defineProperty(exports, "QuestionMatrixDynamic", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_matrixdynamic.QuestionMatrixDynamic;
	  }
	});
	
	var _koquestion_multipletext = __webpack_require__(52);
	
	Object.defineProperty(exports, "MultipleTextItem", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_multipletext.MultipleTextItem;
	  }
	});
	Object.defineProperty(exports, "QuestionMultipleTextImplementor", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_multipletext.QuestionMultipleTextImplementor;
	  }
	});
	Object.defineProperty(exports, "QuestionMultipleText", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_multipletext.QuestionMultipleText;
	  }
	});
	
	var _koquestion_radiogroup = __webpack_require__(53);
	
	Object.defineProperty(exports, "QuestionRadiogroup", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_radiogroup.QuestionRadiogroup;
	  }
	});
	
	var _koquestion_rating = __webpack_require__(54);
	
	Object.defineProperty(exports, "QuestionRating", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_rating.QuestionRating;
	  }
	});
	
	var _koquestion_text = __webpack_require__(55);
	
	Object.defineProperty(exports, "QuestionText", {
	  enumerable: true,
	  get: function get() {
	    return _koquestion_text.QuestionText;
	  }
	});
	
	var _koSurveyWindow = __webpack_require__(56);
	
	Object.defineProperty(exports, "SurveyWindow", {
	  enumerable: true,
	  get: function get() {
	    return _koSurveyWindow.SurveyWindow;
	  }
	});
	
	var _templateText = __webpack_require__(58);
	
	Object.defineProperty(exports, "SurveyTemplateText", {
	  enumerable: true,
	  get: function get() {
	    return _templateText.SurveyTemplateText;
	  }
	});
	
	var _extends = __webpack_require__(3);
	
	Object.defineProperty(exports, "__extends", {
	  enumerable: true,
	  get: function get() {
	    return _extends.__extends;
	  }
	});
	
	__webpack_require__(59);

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
	    emptySurvey: "There is no visible page or question in the survey.",
	    completingSurvey: "Thank you for completing the survey!",
	    loadingSurvey: "Survey is loading...",
	    optionsCaption: "Choose...",
	    requiredError: "Please answer the question.",
	    requiredInAllRowsError: "Please answer questions in all rows.",
	    numericError: "The value should be numeric.",
	    textMinLength: "Please enter at least {0} symbols.",
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
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _survey = __webpack_require__(31);
	
	var _base = __webpack_require__(4);
	
	var _kopage = __webpack_require__(39);
	
	var _cssstandard = __webpack_require__(35);
	
	var _templateKo = __webpack_require__(40);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var Survey = exports.Survey = function (_super) {
	    __extends(Survey, _super);
	    function Survey(jsonObj, renderedElement, css) {
	        if (jsonObj === void 0) {
	            jsonObj = null;
	        }
	        if (renderedElement === void 0) {
	            renderedElement = null;
	        }
	        if (css === void 0) {
	            css = null;
	        }
	        _super.call(this, jsonObj);
	        this.onRendered = new _base.Event();
	        this.isFirstRender = true;
	        if (css) {
	            this.css = css;
	        }
	        if (renderedElement) {
	            this.renderedElement = renderedElement;
	        }
	        if (typeof ko === 'undefined') throw new Error('knockoutjs library is not loaded.');
	        this.render(renderedElement);
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
	    Object.defineProperty(Survey.prototype, "cssNavigationComplete", {
	        get: function get() {
	            return this.getNavigationCss(this.css.navigationButton, this.css.navigation.complete);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Survey.prototype, "cssNavigationPrev", {
	        get: function get() {
	            return this.getNavigationCss(this.css.navigationButton, this.css.navigation.prev);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Survey.prototype, "cssNavigationNext", {
	        get: function get() {
	            return this.getNavigationCss(this.css.navigationButton, this.css.navigation.next);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Survey.prototype.getNavigationCss = function (main, btn) {
	        var res = "";
	        if (main) res = main;
	        if (btn) res += ' ' + btn;
	        return res;
	    };
	    Object.defineProperty(Survey.prototype, "css", {
	        get: function get() {
	            return _cssstandard.surveyCss.getCss();
	        },
	        set: function set(value) {
	            this.mergeValues(value, this.css);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Survey.prototype.render = function (element) {
	        if (element === void 0) {
	            element = null;
	        }
	        var self = this;
	        if (element && typeof element == "string") {
	            element = document.getElementById(element);
	        }
	        if (element) {
	            this.renderedElement = element;
	        }
	        element = this.renderedElement;
	        if (!element) return;
	        element.innerHTML = this.getTemplate();
	        self.applyBinding();
	        self.onRendered.fire(self, {});
	    };
	    Survey.prototype.loadSurveyFromService = function (surveyId, renderedElement) {
	        if (surveyId === void 0) {
	            surveyId = null;
	        }
	        if (renderedElement === void 0) {
	            renderedElement = null;
	        }
	        if (renderedElement) {
	            this.renderedElement = renderedElement;
	        }
	        _super.prototype.loadSurveyFromService.call(this, surveyId);
	    };
	    Survey.prototype.setCompleted = function () {
	        _super.prototype.setCompleted.call(this);
	        this.updateKoCurrentPage();
	    };
	    Survey.prototype.createNewPage = function (name) {
	        return new _kopage.Page(name);
	    };
	    Survey.prototype.getTemplate = function () {
	        return _templateKo.koTemplate.html;
	    };
	    Survey.prototype.onBeforeCreating = function () {
	        var self = this;
	        this.dummyObservable = ko.observable(0);
	        this.koCurrentPage = ko.computed(function () {
	            self.dummyObservable();return self.currentPage;
	        });
	        this.koIsFirstPage = ko.computed(function () {
	            self.dummyObservable();return self.isFirstPage;
	        });
	        this.koIsLastPage = ko.computed(function () {
	            self.dummyObservable();return self.isLastPage;
	        });
	        this.koProgressText = ko.computed(function () {
	            self.dummyObservable();return self.progressText;
	        });
	        this.koProgress = ko.computed(function () {
	            self.dummyObservable();return self.getProgress();
	        });
	        this.koState = ko.computed(function () {
	            self.dummyObservable();return self.state;
	        });
	    };
	    Survey.prototype.currentPageChanged = function (newValue, oldValue) {
	        this.updateKoCurrentPage();
	        _super.prototype.currentPageChanged.call(this, newValue, oldValue);
	        if (!this.isDesignMode && this.focusFirstQuestionAutomatic) this.focusFirstQuestion();
	    };
	    Survey.prototype.pageVisibilityChanged = function (page, newValue) {
	        _super.prototype.pageVisibilityChanged.call(this, page, newValue);
	        this.updateKoCurrentPage();
	    };
	    Survey.prototype.onLoadSurveyFromService = function () {
	        this.render();
	    };
	    Survey.prototype.onLoadingSurveyFromService = function () {
	        this.render();
	    };
	    Survey.prototype.applyBinding = function () {
	        if (!this.renderedElement) return;
	        this.updateKoCurrentPage();
	        ko.cleanNode(this.renderedElement);
	        if (!this.isFirstRender) {
	            this.updateCurrentPageQuestions();
	        }
	        this.isFirstRender = false;
	        ko.applyBindings(this, this.renderedElement);
	    };
	    Survey.prototype.updateKoCurrentPage = function () {
	        this.dummyObservable(this.dummyObservable() + 1);
	    };
	    Survey.prototype.updateCurrentPageQuestions = function () {
	        var questions = this.currentPage ? this.currentPage.questions : [];
	        for (var i = 0; i < questions.length; i++) {
	            var q = questions[i];
	            if (q.visible) q["updateQuestion"]();
	        }
	    };
	    return Survey;
	}(_survey.SurveyModel);
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
	exports.Page = exports.QuestionRow = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _page = __webpack_require__(22);
	
	var _jsonobject = __webpack_require__(7);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionRow = exports.QuestionRow = function (_super) {
	    __extends(QuestionRow, _super);
	    function QuestionRow(page, question) {
	        _super.call(this, page, question);
	        this.page = page;
	        this.question = question;
	        this.koVisible = ko.observable(this.visible);
	    }
	    QuestionRow.prototype.onVisibleChanged = function () {
	        this.koVisible(this.visible);
	    };
	    QuestionRow.prototype.koAfterRender = function (el, con) {
	        for (var i = 0; i < el.length; i++) {
	            var tEl = el[i];
	            var nName = tEl.nodeName;
	            if (nName == "#text") tEl.data = "";
	        }
	    };
	    return QuestionRow;
	}(_page.QuestionRowModel);
	var Page = exports.Page = function (_super) {
	    __extends(Page, _super);
	    function Page(name) {
	        if (name === void 0) {
	            name = "";
	        }
	        _super.call(this, name);
	        this.koNo = ko.observable("");
	        this.onCreating();
	    }
	    Page.prototype.createRow = function (question) {
	        return new QuestionRow(this, question);
	    };
	    Page.prototype.onCreating = function () {};
	    Page.prototype.onNumChanged = function (value) {
	        this.koNo(value > 0 ? value + ". " : "");
	    };
	    return Page;
	}(_page.PageModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("page", function () {
	    return new Page();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var koTemplate = exports.koTemplate = { html: "" };
	koTemplate.html = '<script type="text/html" id="survey-comment">    <!-- ko if: $root.isEditMode -->    <input data-bind="value:$data.question.koComment, visible:$data.visible, css: $root.css.question.comment" />    <!-- /ko -->    <!-- ko if: $root.isDisplayMode -->    <div data-bind="text:$data.question.koComment, visible:$data.visible, css: $root.css.question.comment"></div>    <!-- /ko --></script><div data-bind="css: $root.css.root">    <div data-bind="visible: (title.length > 0) && showTitle && koState() != \'completed\', css: $root.css.header">        <h3 data-bind="text:processedTitle"></h3>    </div>    <!-- ko if: koState() == "running" -->    <div data-bind="css: $root.css.body">        <div data-bind="visible: showProgressBar ==\'top\', template: { name: \'survey-progress\', data: $data }"></div>        <div id="sq_page" data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div>        <div style="margin-top:10px" data-bind="visible: showProgressBar ==\'bottom\', template: { name: \'survey-progress\', data: $data }"></div>    </div>    <div data-bind="visible: showNavigationButtons && !isDesignMode, css: $root.css.footer">        <input type="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage(), css: $root.cssNavigationPrev" />        <input type="button" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage(), css: $root.cssNavigationNext" />        <input type="button" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage(), css: $root.cssNavigationComplete" />    </div>    <!-- /ko -->    <!-- ko if: koState() == "completed" -->    <div data-bind="html: processedCompletedHtml"></div>    <!-- /ko -->    <!-- ko if: koState() == "loading" -->    <div data-bind="html: processedLoadingHtml"></div>    <!-- /ko -->    <!-- ko if: koState() == "empty" -->    <div data-bind="text:emptySurveyText, css: $root.css.body"></div>    <!-- /ko --></div><script type="text/html" id="survey-page">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + processedTitle, css: $root.css.pageTitle"></h4>    <!-- ko foreach: { data: rows, as: \'row\'} -->    <div data-bind="visible: row.koVisible, css: $root.css.row">        <!-- ko foreach: { data: row.questions, as: \'question\' , afterRender: row.koAfterRender } -->            <!-- ko template: { name: \'survey-question\', data: question } --><!-- /ko -->        <!-- /ko -->    </div>    <!-- /ko --></script><script type="text/html" id="survey-progress">    <div style="width:60%;" data-bind="css: $root.css.progress">        <div data-bind="css: $root.css.progressBar, style:{width: koProgress() + \'%\'}"             role="progressbar" aria-valuemin="0"             aria-valuemax="100">            <span data-bind="text:koProgressText"></span>        </div>    </div></script><script type="text/html" id="survey-question-checkbox">    <form data-bind="css: $root.css.checkbox.root">        <!-- ko foreach: { data: question.koVisibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}, css: $root.css.checkbox.item">            <label data-bind="css: $root.css.checkbox.item">                <input type="checkbox" data-bind="attr: {name: question.name, value: item.value, id: ($index() == 0) ? question.inputId : \'\'}, checked: question.koValue, enable: $root.isEditMode" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }, css: $root.css.checkbox.other"></div>            </div>        </div>        <!-- /ko -->    </form></script><script type="text/html" id="survey-question-comment">    <!-- ko if: $root.isEditMode -->    <textarea type="text" data-bind="attr: {cols: question.cols, rows: question.rows, id: question.inputId}, value:question.koValue, css: $root.css.comment"></textarea>    <!-- /ko -->    <!-- ko if: $root.isDisplayMode -->    <div data-bind="text:question.koValue, css: $root.css.text"></div>    <!-- /ko --></script><script type="text/html" id="survey-question-dropdown">    <!-- ko if: $root.isEditMode -->    <select data-bind="attr: {id: question.inputId}, options: question.koVisibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: question.optionsCaption, css: $root.css.dropdown"></select>    <!-- /ko -->    <!-- ko if: $root.isDisplayMode -->    <div data-bind="text:question.koValue, css: $root.css.dropdown"></div>    <!-- /ko -->    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-errors">    <div role="alert" data-bind="visible: koErrors().length > 0, foreach: { data: koErrors, as: \'error\'}, css: $root.css.error.root">        <div>            <span aria-hidden="true" data-bind="css: $root.css.error.icon"></span>            <span data-bind="text:error.getText(), css: $root.css.error.item"></span>        </div>    </div></script><script type="text/html" id="survey-question-file">    <!-- ko if: $root.isEditMode -->    <input type="file" data-bind="attr: {id: question.inputId}, event: {change: dochange}">    <!-- /ko -->    <div>        <img data-bind="attr: { src: question.koData, height: question.imageHeight, width: question.imageWidth }, visible: question.koHasValue">    </div></script><script type="text/html" id="survey-question-html">    <div data-bind="html: question.processedHtml"></div></script><script type="text/html" id="survey-question-matrix">    <table data-bind="css: $root.css.matrix.root">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value, id: ($index() == 0) && ($parentContext.$index() == 0) ? question.inputId : \'\'}, checked: row.koValue, enable: $root.isEditMode" "/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-matrixdropdown">    <div data-bind="style: {overflowX: question.horizontalScroll? \'scroll\': \'\'}">        <table data-bind="css: $root.css.matrixdropdown.root">            <thead>                <tr>                    <th></th>                    <!-- ko foreach: question.columns -->                    <th data-bind="text: question.getColumnTitle($data), style: { minWidth: question.getColumnWidth($data) }"></th>                    <!-- /ko -->                </tr>            </thead>            <tbody>                <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->                <tr>                    <td data-bind="text:row.text"></td>                    <!-- ko foreach: row.cells-->                    <td>                        <!-- ko template: { name: \'survey-question-errors\', data: $data.question } -->                        <!-- /ko -->                        <!-- ko template: { name: \'survey-question-\' + $data.question.getType(), data: $data.question, as: \'question\' } -->                        <!-- /ko -->                    </td>                    <!-- /ko -->                </tr>                <!-- /ko -->            </tbody>        </table>    </div></script><script type="text/html" id="survey-question-matrixdynamic">    <div data-bind="style: {overflowX: question.horizontalScroll? \'scroll\': \'\'}">        <table data-bind="css: $root.css.matrixdynamic.root">            <thead>                <tr>                    <!-- ko foreach: question.columns -->                    <th data-bind="text: question.getColumnTitle($data), style: { minWidth: question.getColumnWidth($data) }"></th>                    <!-- /ko -->                    <!-- ko if: $root.isEditMode -->                    <th></th>                    <!-- /ko -->                </tr>            </thead>            <tbody>                <!-- ko foreach: { data: question.koRows, as: \'row\' } -->                <tr>                    <!-- ko foreach: row.cells-->                    <td>                        <!-- ko template: { name: \'survey-question-errors\', data: $data.question } -->                        <!-- /ko -->                        <!-- ko template: { name: \'survey-question-\' + $data.question.getType(), data: $data.question, as: \'question\' } -->                        <!-- /ko -->                    </td>                    <!-- /ko -->                    <!-- ko if: $root.isEditMode -->                    <td><input type="button" data-bind="click:question.koRemoveRowClick, css: $root.css.matrixdynamic.button, value: question.removeRowText" /></td>                    <!-- /ko -->                </tr>                <!-- /ko -->            </tbody>        </table>    </div>    <!-- ko if: $root.isEditMode -->    <input type="button" data-bind="click:question.koAddRowClick, css: $root.css.matrixdynamic.button, value: question.addRowText" />    <!-- /ko --></script><script type="text/html" id="survey-question-multipletext">    <table data-bind="css: $root.css.multipletext.root, foreach: { data:  question.koRows, as: \'row\' }">        <tr data-bind="foreach: { data: row, as: \'item\' }">            <td data-bind="text: item.title, css: $root.css.multipletext.itemTitle"></td>            <td>                <!-- ko if: $root.isEditMode -->                <input type="text" style="float:left" data-bind="attr: {size: question.itemSize, id: ($index() == 0) ? question.inputId : \'\'}, value: item.koValue, css: $root.css.multipletext.itemValue" />                <!-- /ko -->                <!-- ko if: $root.isDisplayMode -->                <div style="float:left" data-bind="attr: {size: question.itemSize}, text: item.koValue, css: $root.css.multipletext.itemValue"></div>                <!-- /ko -->            </td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <form data-bind="css: $root.css.radiogroup.root">        <!-- ko foreach: { data: question.koVisibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div  data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}, css: $root.css.radiogroup.item">            <label data-bind="css: $root.css.radiogroup.item">                <input type="radio" data-bind="attr: {name: question.name, value: item.value, id: ($index() == 0) ? question.inputId : \'\'}, checked: question.koValue, enable: $root.isEditMode" />                <span data-bind="text: item.text"></span>            </label>            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">                <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible}}, css: $root.css.radiogroup.other"></div>            </div>        </div>        <!-- /ko -->    </form></script><script type="text/html" id="survey-question-rating">    <div data-bind="css: $root.css.rating.root">        <!-- ko foreach: question.koVisibleRateValues -->        <label data-bind="css: question.koGetCss($data)">            <input type="radio" style="display: none;"                    data-bind="attr: {name: question.name, id: question.name + $index(), value: $data.value}, event: { change: question.koChange}, enable: $root.isEditMode" />            <span data-bind="visible: $index() == 0, text: question.mininumRateDescription"></span>            <span data-bind="text: $data.text"></span>            <span data-bind="visible: $index() == (question.koVisibleRateValues().length-1), text: question.maximumRateDescription"></span>        </label>        <!-- /ko -->    </div>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question } }"></div>    </div></script><script type="text/html" id="survey-question-text">    <!-- ko if: $root.isEditMode -->    <input data-bind="attr: {type: question.inputType, size: question.size, id: question.inputId}, value:question.koValue, css: $root.css.text"/>    <!-- /ko -->    <!-- ko if: $root.isDisplayMode -->    <div data-bind="text:question.koValue, css: $root.css.text"></div>    <!-- /ko --></script><script type="text/html" id="survey-question">    <div style="vertical-align:top" data-bind="css: $root.css.question.root, style: {display: question.koVisible() ? \'inline-block\': \'none\', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth }, attr: {id: id}">        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'top\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-errors\', data: question } -->        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question, afterRender: question.koQuestionAfterRender } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            <div data-bind="text:question.commentText"></div>            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'bottom\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->    </div></script>';

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.QuestionImplementorBase = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionImplementorBase = exports.QuestionImplementorBase = function () {
	    function QuestionImplementorBase(question) {
	        this.question = question;
	        var self = this;
	        question.visibilityChangedCallback = function () {
	            self.onVisibilityChanged();
	        };
	        question.renderWidthChangedCallback = function () {
	            self.onRenderWidthChanged();
	        };
	        this.koVisible = ko.observable(this.question.visible);
	        this.koRenderWidth = ko.observable(this.question.renderWidth);
	        this.koErrors = ko.observableArray();
	        this.koMarginLeft = ko.pureComputed(function () {
	            self.koRenderWidth();return self.getIndentSize(self.question.indent);
	        });
	        this.koPaddingRight = ko.observable(self.getIndentSize(self.question.rightIndent));
	        this.question["koVisible"] = this.koVisible;
	        this.question["koRenderWidth"] = this.koRenderWidth;
	        this.question["koErrors"] = this.koErrors;
	        this.question["koMarginLeft"] = this.koMarginLeft;
	        this.question["koPaddingRight"] = this.koPaddingRight;
	        this.question["updateQuestion"] = function () {
	            self.updateQuestion();
	        };
	    }
	    QuestionImplementorBase.prototype.updateQuestion = function () {};
	    QuestionImplementorBase.prototype.onVisibilityChanged = function () {
	        this.koVisible(this.question.visible);
	    };
	    QuestionImplementorBase.prototype.onRenderWidthChanged = function () {
	        this.koRenderWidth(this.question.renderWidth);
	        this.koPaddingRight(this.getIndentSize(this.question.rightIndent));
	    };
	    QuestionImplementorBase.prototype.getIndentSize = function (indent) {
	        if (indent < 1) return "";
	        if (!this.question["data"]) return "";
	        var css = this.question["data"]["css"];
	        if (!css) return "";
	        return indent * css.question.indent + "px";
	    };
	    return QuestionImplementorBase;
	}();

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionImplementor = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _koquestionbase = __webpack_require__(41);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionImplementor = exports.QuestionImplementor = function (_super) {
	    __extends(QuestionImplementor, _super);
	    function QuestionImplementor(question) {
	        _super.call(this, question);
	        this.question = question;
	        this.isUpdating = false;
	        var self = this;
	        question.valueChangedCallback = function () {
	            self.onValueChanged();
	        };
	        question.commentChangedCallback = function () {
	            self.onCommentChanged();
	        };
	        question.errorsChangedCallback = function () {
	            self.onErrorsChanged();
	        };
	        question.titleChangedCallback = function () {
	            self.onVisibleIndexChanged();
	        };
	        question.visibleIndexChangedCallback = function () {
	            self.onVisibleIndexChanged();
	        };
	        this.koDummy = ko.observable(0);
	        this.koValue = this.createkoValue();
	        this.koComment = ko.observable(this.question.comment);
	        this.koTitle = ko.pureComputed(function () {
	            self.koDummy();return self.question.fullTitle;
	        });
	        this.koErrors(this.question.errors);
	        this.koValue.subscribe(function (newValue) {
	            self.updateValue(newValue);
	        });
	        this.koComment.subscribe(function (newValue) {
	            self.updateComment(newValue);
	        });
	        this.question["koValue"] = this.koValue;
	        this.question["koComment"] = this.koComment;
	        this.question["koTitle"] = this.koTitle;
	        this.question["koQuestionAfterRender"] = this.koQuestionAfterRender;
	    }
	    QuestionImplementor.prototype.updateQuestion = function () {
	        this.koDummy(this.koDummy() + 1);
	    };
	    QuestionImplementor.prototype.onValueChanged = function () {
	        if (this.isUpdating) return;
	        this.setkoValue(this.question.value);
	    };
	    QuestionImplementor.prototype.onCommentChanged = function () {
	        if (this.isUpdating) return;
	        this.koComment(this.question.comment);
	    };
	    QuestionImplementor.prototype.onVisibilityChanged = function () {
	        this.koVisible(this.question.visible);
	    };
	    QuestionImplementor.prototype.onVisibleIndexChanged = function () {
	        this.koDummy(this.koDummy() + 1);
	    };
	    QuestionImplementor.prototype.onErrorsChanged = function () {
	        this.koErrors(this.question.errors);
	    };
	    QuestionImplementor.prototype.createkoValue = function () {
	        return ko.observable(this.question.value);
	    };
	    QuestionImplementor.prototype.setkoValue = function (newValue) {
	        this.koValue(newValue);
	    };
	    QuestionImplementor.prototype.updateValue = function (newValue) {
	        this.isUpdating = true;
	        this.question.value = newValue;
	        this.isUpdating = false;
	    };
	    QuestionImplementor.prototype.updateComment = function (newValue) {
	        this.isUpdating = true;
	        this.question.comment = newValue;
	        this.isUpdating = false;
	    };
	    QuestionImplementor.prototype.getNo = function () {
	        return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
	    };
	    QuestionImplementor.prototype.koQuestionAfterRender = function (el, con) {
	        var tEl = el[0];
	        if (tEl.nodeName == "#text") tEl.data = "";
	        tEl = el[el.length - 1];
	        if (tEl.nodeName == "#text") tEl.data = "";
	    };
	    return QuestionImplementor;
	}(_koquestionbase.QuestionImplementorBase);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionCheckboxBaseImplementor = exports.QuestionSelectBaseImplementor = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _koquestion = __webpack_require__(42);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionSelectBaseImplementor = exports.QuestionSelectBaseImplementor = function (_super) {
	    __extends(QuestionSelectBaseImplementor, _super);
	    function QuestionSelectBaseImplementor(question) {
	        _super.call(this, question);
	        var self = this;
	        this.koOtherVisible = ko.computed(function () {
	            self.koValue();return self.isOtherSelected;
	        });
	        this.koVisibleChoices = ko.observableArray(self.question.visibleChoices);
	        question.choicesChangedCallback = function () {
	            self.koVisibleChoices(self.question.visibleChoices);
	        };
	        this.question["koOtherVisible"] = this.koOtherVisible;
	        this.question["koVisibleChoices"] = this.koVisibleChoices;
	    }
	    Object.defineProperty(QuestionSelectBaseImplementor.prototype, "isOtherSelected", {
	        get: function get() {
	            return this.question.isOtherSelected;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return QuestionSelectBaseImplementor;
	}(_koquestion.QuestionImplementor);
	var QuestionCheckboxBaseImplementor = exports.QuestionCheckboxBaseImplementor = function (_super) {
	    __extends(QuestionCheckboxBaseImplementor, _super);
	    function QuestionCheckboxBaseImplementor(question) {
	        _super.call(this, question);
	        this.koWidth = ko.observable(this.colWidth);
	        this.question["koWidth"] = this.koWidth;
	        this.question["koAfterRender"] = this.koAfterRender;
	        var self = this;
	        this.question.colCountChangedCallback = function () {
	            self.onColCountChanged();
	        };
	    }
	    QuestionCheckboxBaseImplementor.prototype.onColCountChanged = function () {
	        this.question["koWidth"] = ko.observable(this.colWidth);
	    };
	    Object.defineProperty(QuestionCheckboxBaseImplementor.prototype, "colWidth", {
	        get: function get() {
	            var colCount = this.question.colCount;
	            return colCount > 0 ? 100 / colCount + '%' : "";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    QuestionCheckboxBaseImplementor.prototype.koAfterRender = function (el, con) {
	        var tEl = el[0];
	        if (tEl.nodeName == "#text") tEl.data = "";
	        tEl = el[el.length - 1];
	        if (tEl.nodeName == "#text") tEl.data = "";
	    };
	    return QuestionCheckboxBaseImplementor;
	}(QuestionSelectBaseImplementor);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionCheckbox = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _koquestion_baseselect = __webpack_require__(43);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _question_checkbox = __webpack_require__(23);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionCheckboxImplementor = function (_super) {
	    __extends(QuestionCheckboxImplementor, _super);
	    function QuestionCheckboxImplementor(question) {
	        _super.call(this, question);
	    }
	    QuestionCheckboxImplementor.prototype.createkoValue = function () {
	        return this.question.value ? ko.observableArray(this.question.value) : ko.observableArray();
	    };
	    QuestionCheckboxImplementor.prototype.setkoValue = function (newValue) {
	        if (newValue) {
	            this.koValue([].concat(newValue));
	        } else {
	            this.koValue([]);
	        }
	    };
	    return QuestionCheckboxImplementor;
	}(_koquestion_baseselect.QuestionCheckboxBaseImplementor);
	var QuestionCheckbox = exports.QuestionCheckbox = function (_super) {
	    __extends(QuestionCheckbox, _super);
	    function QuestionCheckbox(name) {
	        _super.call(this, name);
	        this.name = name;
	        new QuestionCheckboxImplementor(this);
	    }
	    return QuestionCheckbox;
	}(_question_checkbox.QuestionCheckboxModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("checkbox", function () {
	    return new QuestionCheckbox("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("checkbox", function (name) {
	    var q = new QuestionCheckbox(name);q.choices = _questionfactory.QuestionFactory.DefaultChoices;return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionComment = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _question_comment = __webpack_require__(24);
	
	var _koquestion = __webpack_require__(42);
	
	var QuestionComment = exports.QuestionComment = function (_super) {
	    __extends(QuestionComment, _super);
	    function QuestionComment(name) {
	        _super.call(this, name);
	        this.name = name;
	        new _koquestion.QuestionImplementor(this);
	    }
	    return QuestionComment;
	}(_question_comment.QuestionCommentModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("comment", function () {
	    return new QuestionComment("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("comment", function (name) {
	    return new QuestionComment(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionDropdown = undefined;
	
	var _question_dropdown = __webpack_require__(25);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _koquestion_baseselect = __webpack_require__(43);
	
	var QuestionDropdown = exports.QuestionDropdown = function (_super) {
	    __extends(QuestionDropdown, _super);
	    function QuestionDropdown(name) {
	        _super.call(this, name);
	        this.name = name;
	        new _koquestion_baseselect.QuestionSelectBaseImplementor(this);
	    }
	    return QuestionDropdown;
	}(_question_dropdown.QuestionDropdownModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("dropdown", function () {
	    return new QuestionDropdown("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("dropdown", function (name) {
	    var q = new QuestionDropdown(name);q.choices = _questionfactory.QuestionFactory.DefaultChoices;return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionFile = exports.QuestionFileImplementor = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _question_file = __webpack_require__(26);
	
	var _koquestion = __webpack_require__(42);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionFileImplementor = exports.QuestionFileImplementor = function (_super) {
	    __extends(QuestionFileImplementor, _super);
	    function QuestionFileImplementor(question) {
	        _super.call(this, question);
	        var self = this;
	        this.koDataUpdater = ko.observable(0);
	        this.koData = ko.computed(function () {
	            self.koDataUpdater();return self.question.previewValue;
	        });
	        this.koHasValue = ko.observable(false);
	        this.question["koData"] = this.koData;
	        this.question["koHasValue"] = this.koHasValue;
	        this.question.previewValueLoadedCallback = function () {
	            self.onLoadPreview();
	        };
	        this.question["dochange"] = function (data, event) {
	            var src = event.target || event.srcElement;self.onChange(src);
	        };
	    }
	    QuestionFileImplementor.prototype.onChange = function (src) {
	        if (!window["FileReader"]) return;
	        if (!src || !src.files || src.files.length < 1) return;
	        this.question.loadFile(src.files[0]);
	    };
	    QuestionFileImplementor.prototype.onLoadPreview = function () {
	        this.koDataUpdater(this.koDataUpdater() + 1);
	        this.koHasValue(true);
	    };
	    return QuestionFileImplementor;
	}(_koquestion.QuestionImplementor);
	var QuestionFile = exports.QuestionFile = function (_super) {
	    __extends(QuestionFile, _super);
	    function QuestionFile(name) {
	        _super.call(this, name);
	        this.name = name;
	        new QuestionFileImplementor(this);
	    }
	    return QuestionFile;
	}(_question_file.QuestionFileModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("file", function () {
	    return new QuestionFile("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("file", function (name) {
	    return new QuestionFile(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionHtml = undefined;
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _koquestionbase = __webpack_require__(41);
	
	var _question_html = __webpack_require__(27);
	
	var QuestionHtml = exports.QuestionHtml = function (_super) {
	    __extends(QuestionHtml, _super);
	    function QuestionHtml(name) {
	        _super.call(this, name);
	        this.name = name;
	        new _koquestionbase.QuestionImplementorBase(this);
	    }
	    return QuestionHtml;
	}(_question_html.QuestionHtmlModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("html", function () {
	    return new QuestionHtml("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("html", function (name) {
	    return new QuestionHtml(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrix = exports.MatrixRow = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _question_matrix = __webpack_require__(20);
	
	var _koquestion = __webpack_require__(42);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var MatrixRow = exports.MatrixRow = function (_super) {
	    __extends(MatrixRow, _super);
	    function MatrixRow(name, text, fullName, data, value) {
	        _super.call(this, name, text, fullName, data, value);
	        this.name = name;
	        this.text = text;
	        this.fullName = fullName;
	        this.isValueUpdating = false;
	        this.koValue = ko.observable(this.value);
	        var self = this;
	        this.koValue.subscribe(function (newValue) {
	            if (self.isValueUpdating) true;
	            self.value = newValue;
	        });
	    }
	    MatrixRow.prototype.onValueChanged = function () {
	        this.isValueUpdating = true;
	        this.koValue(this.value);
	        this.isValueUpdating = false;
	    };
	    return MatrixRow;
	}(_question_matrix.MatrixRowModel);
	var QuestionMatrix = exports.QuestionMatrix = function (_super) {
	    __extends(QuestionMatrix, _super);
	    function QuestionMatrix(name) {
	        _super.call(this, name);
	        this.name = name;
	        new _koquestion.QuestionImplementor(this);
	    }
	    QuestionMatrix.prototype.createMatrixRow = function (name, text, fullName, value) {
	        return new MatrixRow(name, text, fullName, this, value);
	    };
	    return QuestionMatrix;
	}(_question_matrix.QuestionMatrixModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("matrix", function () {
	    return new QuestionMatrix("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("matrix", function (name) {
	    var q = new QuestionMatrix(name);q.rows = ["Row 1", "Row 2"];q.columns = ["Column 1", "Column 2", "Column 3"];return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrixDropdown = undefined;
	
	var _question_matrixdropdown = __webpack_require__(18);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _koquestion = __webpack_require__(42);
	
	var QuestionMatrixDropdown = exports.QuestionMatrixDropdown = function (_super) {
	    __extends(QuestionMatrixDropdown, _super);
	    function QuestionMatrixDropdown(name) {
	        _super.call(this, name);
	        this.name = name;
	        new _koquestion.QuestionImplementor(this);
	    }
	    return QuestionMatrixDropdown;
	}(_question_matrixdropdown.QuestionMatrixDropdownModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("matrixdropdown", function () {
	    return new QuestionMatrixDropdown("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("matrixdropdown", function (name) {
	    var q = new QuestionMatrixDropdown(name);q.choices = [1, 2, 3, 4, 5];q.rows = ["Row 1", "Row 2"];q.addColumn("Column 1");q.addColumn("Column 2");q.addColumn("Column 3");return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMatrixDynamic = exports.QuestionMatrixDynamicImplementor = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _koquestion = __webpack_require__(42);
	
	var _question_matrixdynamic = __webpack_require__(19);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionMatrixDynamicImplementor = exports.QuestionMatrixDynamicImplementor = function (_super) {
	    __extends(QuestionMatrixDynamicImplementor, _super);
	    function QuestionMatrixDynamicImplementor(question) {
	        _super.call(this, question);
	        this.koRecalc = ko.observable(0);
	        this.koRows = ko.pureComputed(function () {
	            this.koRecalc();
	            return this.question.cachedVisibleRows;
	        }, this);
	        this.koOverflowX = ko.pureComputed(function () {
	            return this.question.horizontalScroll ? "scroll" : "none";
	        }, this);
	        this.question["koRows"] = this.koRows;
	        var self = this;
	        this.koAddRowClick = function () {
	            self.addRow();
	        };
	        this.koRemoveRowClick = function (data) {
	            self.removeRow(data);
	        };
	        this.question["koAddRowClick"] = this.koAddRowClick;
	        this.question["koRemoveRowClick"] = this.koRemoveRowClick;
	        this.question["koOverflowX"] = this.koOverflowX;
	        this.question.rowCountChangedCallback = function () {
	            self.onRowCountChanged();
	        };
	        this.question.columnsChangedCallback = function () {
	            self.onColumnChanged();
	        };
	        this.question.updateCellsCallbak = function () {
	            self.onUpdateCells();
	        };
	    }
	    QuestionMatrixDynamicImplementor.prototype.onUpdateCells = function () {
	        //Genereate rows again.
	        var rows = this.question["generatedVisibleRows"];
	        var columns = this.question.columns;
	        if (rows && rows.length > 0 && columns && columns.length > 0) this.onColumnChanged();
	    };
	    QuestionMatrixDynamicImplementor.prototype.onColumnChanged = function () {
	        var rows = this.question.visibleRows;
	        this.onRowCountChanged();
	    };
	    QuestionMatrixDynamicImplementor.prototype.onRowCountChanged = function () {
	        this.koRecalc(this.koRecalc() + 1);
	    };
	    QuestionMatrixDynamicImplementor.prototype.addRow = function () {
	        this.question.addRow();
	    };
	    QuestionMatrixDynamicImplementor.prototype.removeRow = function (row) {
	        var rows = this.question.cachedVisibleRows;
	        var index = rows.indexOf(row);
	        if (index > -1) {
	            this.question.removeRow(index);
	        }
	    };
	    return QuestionMatrixDynamicImplementor;
	}(_koquestion.QuestionImplementor);
	var QuestionMatrixDynamic = exports.QuestionMatrixDynamic = function (_super) {
	    __extends(QuestionMatrixDynamic, _super);
	    function QuestionMatrixDynamic(name) {
	        _super.call(this, name);
	        this.name = name;
	        new QuestionMatrixDynamicImplementor(this);
	    }
	    return QuestionMatrixDynamic;
	}(_question_matrixdynamic.QuestionMatrixDynamicModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("matrixdynamic", function () {
	    return new QuestionMatrixDynamic("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("matrixdynamic", function (name) {
	    var q = new QuestionMatrixDynamic(name);q.choices = [1, 2, 3, 4, 5];q.rowCount = 2;q.addColumn("Column 1");q.addColumn("Column 2");q.addColumn("Column 3");return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionMultipleText = exports.QuestionMultipleTextImplementor = exports.MultipleTextItem = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _question_multipletext = __webpack_require__(21);
	
	var _koquestion = __webpack_require__(42);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var MultipleTextItem = exports.MultipleTextItem = function (_super) {
	    __extends(MultipleTextItem, _super);
	    function MultipleTextItem(name, title) {
	        if (name === void 0) {
	            name = null;
	        }
	        if (title === void 0) {
	            title = null;
	        }
	        _super.call(this, name, title);
	        this.name = name;
	        this.isKOValueUpdating = false;
	        this.koValue = ko.observable(this.value);
	        var self = this;
	        this.koValue.subscribe(function (newValue) {
	            if (!self.isKOValueUpdating) {
	                self.value = newValue;
	            }
	        });
	    }
	    MultipleTextItem.prototype.onValueChanged = function (newValue) {
	        this.isKOValueUpdating = true;
	        this.koValue(newValue);
	        this.isKOValueUpdating = false;
	    };
	    return MultipleTextItem;
	}(_question_multipletext.MultipleTextItemModel);
	var QuestionMultipleTextImplementor = exports.QuestionMultipleTextImplementor = function (_super) {
	    __extends(QuestionMultipleTextImplementor, _super);
	    function QuestionMultipleTextImplementor(question) {
	        _super.call(this, question);
	        this.koRows = ko.observableArray(this.question.getRows());
	        this.question["koRows"] = this.koRows;
	        this.onColCountChanged();
	        var self = this;
	        this.question.colCountChangedCallback = function () {
	            self.onColCountChanged();
	        };
	    }
	    QuestionMultipleTextImplementor.prototype.onColCountChanged = function () {
	        this.koRows(this.question.getRows());
	    };
	    return QuestionMultipleTextImplementor;
	}(_koquestion.QuestionImplementor);
	var QuestionMultipleText = exports.QuestionMultipleText = function (_super) {
	    __extends(QuestionMultipleText, _super);
	    function QuestionMultipleText(name) {
	        _super.call(this, name);
	        this.name = name;
	        new QuestionMultipleTextImplementor(this);
	    }
	    QuestionMultipleText.prototype.createTextItem = function (name, title) {
	        return new MultipleTextItem(name, title);
	    };
	    return QuestionMultipleText;
	}(_question_multipletext.QuestionMultipleTextModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("multipletextitem", function () {
	    return new MultipleTextItem("");
	});
	_jsonobject.JsonObject.metaData.overrideClassCreatore("multipletext", function () {
	    return new QuestionMultipleText("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("multipletext", function (name) {
	    var q = new QuestionMultipleText(name);q.addItem("text1");q.addItem("text2");return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionRadiogroup = undefined;
	
	var _question_radiogroup = __webpack_require__(28);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _koquestion_baseselect = __webpack_require__(43);
	
	var QuestionRadiogroup = exports.QuestionRadiogroup = function (_super) {
	    __extends(QuestionRadiogroup, _super);
	    function QuestionRadiogroup(name) {
	        _super.call(this, name);
	        this.name = name;
	        new _koquestion_baseselect.QuestionCheckboxBaseImplementor(this);
	    }
	    return QuestionRadiogroup;
	}(_question_radiogroup.QuestionRadiogroupModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("radiogroup", function () {
	    return new QuestionRadiogroup("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) {
	    var q = new QuestionRadiogroup(name);q.choices = _questionfactory.QuestionFactory.DefaultChoices;return q;
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionRating = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _koquestion = __webpack_require__(42);
	
	var _question_rating = __webpack_require__(29);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var QuestionRatingImplementor = function (_super) {
	    __extends(QuestionRatingImplementor, _super);
	    function QuestionRatingImplementor(question) {
	        _super.call(this, question);
	        this.koVisibleRateValues = ko.observableArray(this.getValues());
	        this.question["koVisibleRateValues"] = this.koVisibleRateValues;
	        var self = this;
	        this.koChange = function (val) {
	            self.koValue(val.itemValue);
	        };
	        this.question["koChange"] = this.koChange;
	        this.question.rateValuesChangedCallback = function () {
	            self.onRateValuesChanged();
	        };
	        this.question["koGetCss"] = function (val) {
	            var css = self.question.itemCss;
	            return self.question["koValue"]() == val.value ? css + " active" : css;
	        };
	    }
	    QuestionRatingImplementor.prototype.onRateValuesChanged = function () {
	        this.koVisibleRateValues(this.getValues());
	    };
	    QuestionRatingImplementor.prototype.getValues = function () {
	        return this.question.visibleRateValues;
	    };
	    return QuestionRatingImplementor;
	}(_koquestion.QuestionImplementor);
	var QuestionRating = exports.QuestionRating = function (_super) {
	    __extends(QuestionRating, _super);
	    function QuestionRating(name) {
	        _super.call(this, name);
	        this.name = name;
	        new QuestionRatingImplementor(this);
	    }
	    QuestionRating.prototype.onSetData = function () {
	        this.itemCss = this.data["css"].rating.item;
	    };
	    return QuestionRating;
	}(_question_rating.QuestionRatingModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("rating", function () {
	    return new QuestionRating("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("rating", function (name) {
	    return new QuestionRating(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.QuestionText = exports.QuestionTextImplementor = undefined;
	
	var _question_text = __webpack_require__(30);
	
	var _jsonobject = __webpack_require__(7);
	
	var _questionfactory = __webpack_require__(17);
	
	var _koquestion = __webpack_require__(42);
	
	var QuestionTextImplementor = exports.QuestionTextImplementor = function (_super) {
	    __extends(QuestionTextImplementor, _super);
	    function QuestionTextImplementor(question) {
	        _super.call(this, question);
	        this.question = question;
	    }
	    QuestionTextImplementor.prototype.updateValue = function (newValue) {
	        _super.prototype.updateValue.call(this, newValue);
	        if (newValue !== this.question.value) {
	            this.koValue(this.question.value);
	        }
	    };
	    return QuestionTextImplementor;
	}(_koquestion.QuestionImplementor);
	var QuestionText = exports.QuestionText = function (_super) {
	    __extends(QuestionText, _super);
	    function QuestionText(name) {
	        _super.call(this, name);
	        this.name = name;
	        new QuestionTextImplementor(this);
	    }
	    return QuestionText;
	}(_question_text.QuestionTextModel);
	_jsonobject.JsonObject.metaData.overrideClassCreatore("text", function () {
	    return new QuestionText("");
	});
	_questionfactory.QuestionFactory.Instance.registerQuestion("text", function (name) {
	    return new QuestionText(name);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__extends) {"use strict";
	
	exports.__esModule = true;
	exports.SurveyWindow = undefined;
	
	var _knockout = __webpack_require__(38);
	
	var ko = _interopRequireWildcard(_knockout);
	
	var _surveyWindow = __webpack_require__(34);
	
	var _kosurvey = __webpack_require__(37);
	
	var _templateWindowKo = __webpack_require__(57);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyWindow = exports.SurveyWindow = function (_super) {
	    __extends(SurveyWindow, _super);
	    function SurveyWindow(jsonObj) {
	        _super.call(this, jsonObj);
	        this.koExpanded = ko.observable(false);
	        this.koExpandedCss = ko.observable(this.getButtonCss());
	        var self = this;
	        this.doExpand = function () {
	            self.changeExpanded();
	        };
	        this.survey.onComplete.add(function (sender) {
	            self.onComplete();self.koExpandedCss(self.getButtonCss());
	        });
	    }
	    SurveyWindow.prototype.createSurvey = function (jsonObj) {
	        return new _kosurvey.Survey(jsonObj);
	    };
	    SurveyWindow.prototype.expandcollapse = function (value) {
	        _super.prototype.expandcollapse.call(this, value);
	        this.koExpanded(this.isExpandedValue);
	    };
	    Object.defineProperty(SurveyWindow.prototype, "template", {
	        get: function get() {
	            return this.templateValue ? this.templateValue : this.getDefaultTemplate();
	        },
	        set: function set(value) {
	            this.templateValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyWindow.prototype.show = function () {
	        this.windowElement.innerHTML = this.template;
	        ko.cleanNode(this.windowElement);
	        ko.applyBindings(this, this.windowElement);
	        document.body.appendChild(this.windowElement);
	        this.survey.render(SurveyWindow.surveyElementName);
	        this.isShowingValue = true;
	    };
	    SurveyWindow.prototype.getDefaultTemplate = function () {
	        return _templateWindowKo.koTemplate.html;
	    };
	    SurveyWindow.prototype.hide = function () {
	        document.body.removeChild(this.windowElement);
	        this.windowElement.innerHTML = "";
	        this.isShowingValue = false;
	    };
	    Object.defineProperty(SurveyWindow.prototype, "css", {
	        get: function get() {
	            return this.survey["css"];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyWindow.prototype.changeExpanded = function () {
	        this.expandcollapse(!this.isExpanded);
	    };
	    SurveyWindow.prototype.onComplete = function () {
	        this.hide();
	    };
	    SurveyWindow.prototype.getButtonCss = function () {
	        return this.koExpanded() ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
	    };
	    return SurveyWindow;
	}(_surveyWindow.SurveyWindowModel);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 57 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var koTemplate = exports.koTemplate = { html: "" };
	koTemplate.html = '<div style="position: fixed; bottom: 3px; right: 10px;" data-bind="css: $root.css.window.root">    <div data-bind="css: $root.css.window.header.root">        <a href="#" data-bind="click:doExpand" style="width:100%">            <span style="padding-right:10px" data-bind="text:title, css: $root.css.window.header.title"></span>            <span aria-hidden="true" data-bind="css: koExpandedCss"></span>        </a>    </div>    <div data-bind="visible:koExpanded, css: $root.css.window.body">        <div id="windowSurveyJS"></div>    </div></div>';

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyTemplateText = undefined;
	
	var _templateKo = __webpack_require__(40);
	
	var SurveyTemplateText = exports.SurveyTemplateText = function () {
	    function SurveyTemplateText() {}
	    SurveyTemplateText.prototype.replaceText = function (replaceText, id, questionType) {
	        if (questionType === void 0) {
	            questionType = null;
	        }
	        id = this.getId(id, questionType);
	        var pos = this.text.indexOf(id);
	        if (pos < 0) return;
	        pos = this.text.indexOf('>', pos);
	        if (pos < 0) return;
	        var startPos = pos + 1;
	        var endString = "</script>";
	        pos = this.text.indexOf(endString, startPos);
	        if (pos < 0) return;
	        this.text = this.text.substr(0, startPos) + replaceText + this.text.substr(pos);
	    };
	    SurveyTemplateText.prototype.getId = function (id, questionType) {
	        var result = 'id="survey-' + id;
	        if (questionType) {
	            result += "-" + questionType;
	        }
	        return result + '"';
	    };
	    Object.defineProperty(SurveyTemplateText.prototype, "text", {
	        get: function get() {
	            return _templateKo.koTemplate.html;
	        },
	        set: function set(value) {
	            _templateKo.koTemplate.html = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyTemplateText;
	}();

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(60);
	
	__webpack_require__(61);
	
	__webpack_require__(62);
	
	__webpack_require__(63);
	
	__webpack_require__(64);
	
	__webpack_require__(65);
	
	__webpack_require__(66);
	
	__webpack_require__(67);
	
	__webpack_require__(68);

/***/ },
/* 60 */
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
/* 61 */
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
/* 62 */
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
/* 63 */
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
/* 64 */
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
/* 65 */
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
/* 66 */
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
/* 67 */
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
/* 68 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA1Zjk4Yzg4MTM1NjQ2MjY2MGE0YyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9rby50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9jaHVua3MvbW9kZWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZhbGlkYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZXh0ZW5kcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFzZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZXJyb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVN0cmluZ3MudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzb25vYmplY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Nob2ljZXNSZXN0ZnVsbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9uc1BhcnNlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29uZGl0aW9uUHJvY2Vzc1ZhbHVlLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbmJhc2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RleHRQcmVQcm9jZXNzb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fbWF0cml4ZHJvcGRvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX21hdHJpeGR5bmFtaWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX21hdHJpeC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwid2VicGFjazovLy8uL3NyYy9wYWdlLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbl9jaGVja2JveC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fY29tbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fZHJvcGRvd24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2ZpbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX2h0bWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uX3JhdGluZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25fdGV4dC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5LnRzIiwid2VicGFjazovLy8uL3NyYy9keFN1cnZleVNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RyaWdnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleVdpbmRvdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmYXVsdENzcy9jc3NzdGFuZGFyZC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVmYXVsdENzcy9jc3Nib290c3RyYXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvc3VydmV5LnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJyb290XCI6XCJrb1wiLFwiY29tbW9uanMyXCI6XCJrbm9ja291dFwiLFwiY29tbW9uanNcIjpcImtub2Nrb3V0XCIsXCJhbWRcIjpcImtub2Nrb3V0XCJ9Iiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3BhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L3RlbXBsYXRlLmtvLmh0bWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25iYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fY2hlY2tib3gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fY29tbWVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9kcm9wZG93bi50cyIsIndlYnBhY2s6Ly8vLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9maWxlLnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX2h0bWwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4LnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX21hdHJpeGR5bmFtaWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fcmF0aW5nLnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX3RleHQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tub2Nrb3V0L2tvU3VydmV5V2luZG93LnRzIiwid2VicGFjazovLy8uL3NyYy9rbm9ja291dC90ZW1wbGF0ZS53aW5kb3cua28uaHRtbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMva25vY2tvdXQvdGVtcGxhdGVUZXh0LnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRyaWVzL2NodW5rcy9sb2NhbGl6YXRpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2FsaXphdGlvbi9kYW5pc2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2FsaXphdGlvbi9kdXRjaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL2Zpbm5pc2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2FsaXphdGlvbi9mcmVuY2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2FsaXphdGlvbi9nZXJtYW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2FsaXphdGlvbi9ncmVlay50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL3BvbGlzaC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbG9jYWxpemF0aW9uL3J1c3NpYW4udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xvY2FsaXphdGlvbi90dXJraXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNyQytCOzs7Ozs7Ozs7Ozs7Ozs7eUJBUS9COzs7Ozs7Ozs7MEJBR0E7Ozs7Ozs7OztzQkFDQTs7Ozs7O3NCQUNBOzs7Ozs7Ozs7b0JBQW1COzs7Ozs7b0JBQ25COzs7Ozs7Ozs7NEJBQ0E7Ozs7Ozs7Ozt3QkFDQTs7Ozs7Ozs7O21DQUNBOzs7Ozs7bUNBQ0E7Ozs7Ozs7OztpQ0FDQTs7Ozs7Ozs7O2dDQUNBOzs7Ozs7Ozs7aUNBQ0E7Ozs7Ozs7Ozs2QkFDQTs7Ozs7Ozs7OzZCQUNBOzs7Ozs7Ozs7K0JBQWlCOzs7Ozs7K0JBQ2pCOzs7Ozs7Ozs7dUNBQ0E7Ozs7Ozs7OztzQ0FDb0M7Ozs7OztzQ0FHcEM7Ozs7Ozs7OztxQ0FDb0I7Ozs7OztxQ0FBaUM7Ozs7OztxQ0FHckQ7Ozs7Ozs7OzttQ0FDQTs7Ozs7Ozs7OytCQUNBOzs7Ozs7Ozs7NkJBQ0E7Ozs7Ozs7Ozs0QkFDQTs7Ozs7Ozs7OzBCQUVBOzs7Ozs7Ozs7cUJBR21FOzs7O0FBcENuRSx5Qjs7Ozs7Ozs7Ozs7Ozs7O3VCQ053Qjs7Ozs7O3VCQUFnQjs7Ozs7O3VCQUFrQjs7Ozs7O3VCQUFnQjs7Ozs7O3VCQUN2RDs7Ozs7O3VCQUFlOzs7Ozs7dUJBQWlCOzs7Ozs7dUJBRW5EOzs7Ozs7Ozs7a0JBQVk7Ozs7OztrQkFBTzs7Ozs7O2tCQUFXOzs7Ozs7a0JBQzlCOzs7Ozs7Ozs7NkJBQ0E7Ozs7Ozs7Ozt3QkFBaUI7Ozs7Ozt3QkFBZTs7Ozs7O3dCQUNoQzs7Ozs7Ozs7OzhCQUNBOzs7Ozs7Ozs7bUNBQ0E7Ozs7Ozs7OzttQkFBbUI7Ozs7OzttQkFBaUI7Ozs7OzttQkFDcEM7Ozs7Ozs7Ozt3QkFDYTs7Ozs7O3dCQUF3Qjs7Ozs7O3dCQUFjOzs7Ozs7d0JBQW1COzs7Ozs7d0JBQzlDOzs7Ozs7d0JBQTBCOzs7Ozs7d0JBQVk7Ozs7Ozt3QkFBb0I7Ozs7Ozt3QkFDckQ7Ozs7Ozt3QkFFN0I7Ozs7Ozs7Ozt5Q0FDc0I7Ozs7Ozt5Q0FBc0I7Ozs7Ozt5Q0FBNEI7Ozs7Ozt5Q0FHeEU7Ozs7Ozs7OztxQ0FBOEI7Ozs7OztxQ0FDOUI7Ozs7Ozs7OztvQ0FBNkI7Ozs7OztvQ0FDN0I7Ozs7Ozs7Ozs2QkFBc0I7Ozs7Ozs2QkFDdEI7Ozs7Ozs7OzttQ0FBNkI7Ozs7OzttQ0FDN0I7Ozs7Ozs7OztrQkFBaUI7Ozs7OztrQkFDakI7Ozs7Ozs7OztzQkFDQTs7Ozs7Ozs7OzBCQUNBOzs7Ozs7Ozs7aUNBQTRCOzs7Ozs7aUNBQzVCOzs7Ozs7Ozs7K0JBQ0E7Ozs7Ozs7Ozs4QkFDQTs7Ozs7Ozs7OytCQUNBOzs7Ozs7Ozs7NkJBQ0E7Ozs7Ozs7OzsyQkFDQTs7Ozs7Ozs7OzJCQUNBOzs7Ozs7Ozs7aUNBQ0E7Ozs7Ozs7Ozs2QkFDQTs7Ozs7Ozs7OzJCQUNBOzs7Ozs7Ozs7b0JBQ0E7Ozs7Ozs7OztxQkFDaUI7Ozs7OztxQkFBdUI7Ozs7OztxQkFBdUI7Ozs7OztxQkFBc0I7Ozs7OztxQkFHckY7Ozs7Ozs7OzswQkFDQTs7Ozs7Ozs7OzhCQUVBOzs7Ozs7Ozs7NkJBQ0E7Ozs7Ozs7OzsyQkFBMEI7Ozs7OzsyQkFHaUQ7Ozs7Ozs7Ozs7Ozs7QUNoRG5DOztBQUNlOztBQUNMOztBQUdsRDs7O0FBQ0ksOEJBQTZCLE9BQWtDO0FBQWhDLDRCQUFnQztBQUFoQyxxQkFBZ0M7O0FBQTVDLGNBQUssUUFBSztBQUFTLGNBQUssUUFDM0M7QUFBQztBQUNMLFlBQUM7QUFFRDs7QUFBcUMsZ0NBQUk7QUFFckM7QUFDSSxxQkFBUTtBQUZMLGNBQUksT0FHWDtBQUFDO0FBQ1MsK0JBQVksZUFBdEIsVUFBbUM7QUFDNUIsYUFBSyxLQUFNLE1BQU8sT0FBSyxLQUFNO0FBQzFCLGdCQUFLLEtBQW9CLG9CQUNuQztBQUFDO0FBQ1MsK0JBQW1CLHNCQUE3QixVQUEwQztBQUNoQyxnQkFDVjtBQUFDO0FBQ00sK0JBQVEsV0FBZixVQUEwQixPQUFxQjtBQUFuQiwyQkFBbUI7QUFBbkIsb0JBQW1COztBQUNyQyxnQkFDVjtBQUFDO0FBQ0wsWUFBQztBQU1EOztBQUFBLGdDQWFBLENBQUM7QUFaVSwrQkFBRyxNQUFWLFVBQWlDO0FBQ3pCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUSxNQUFXLFdBQU8sUUFBSyxLQUFHO0FBQy9DLGlCQUFtQixrQkFBUSxNQUFXLFdBQUcsR0FBUyxTQUFNLE1BQU0sT0FBTyxNQUFzQjtBQUN4RixpQkFBZ0IsbUJBQVMsTUFBRTtBQUN2QixxQkFBZ0IsZ0JBQU8sT0FBTyxPQUFnQixnQkFBTztBQUNyRCxxQkFBZ0IsZ0JBQU8sT0FBRTtBQUNuQiwyQkFBTSxRQUFrQixnQkFDakM7QUFDSjtBQUNKO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ0wsWUFBQztBQUVEOztBQUFzQyxpQ0FBZTtBQUNqRCwrQkFBMEMsVUFBZ0M7QUFBOUQsK0JBQThCO0FBQTlCLHdCQUE4Qjs7QUFBRSwrQkFBOEI7QUFBOUIsd0JBQThCOztBQUN0RSxxQkFBUTtBQURPLGNBQVEsV0FBZTtBQUFTLGNBQVEsV0FFM0Q7QUFBQztBQUNNLGdDQUFPLFVBQWQ7QUFBaUMsZ0JBQXFCO0FBQUM7QUFDaEQsZ0NBQVEsV0FBZixVQUEwQixPQUFxQjtBQUFuQiwyQkFBbUI7QUFBbkIsb0JBQW1COztBQUN4QyxhQUFDLENBQU0sU0FBSSxDQUFLLEtBQVMsU0FBUSxRQUFFO0FBQzVCLG9CQUFDLElBQW1CLGdCQUFLLE1BQ25DO0FBQUM7QUFDRCxhQUFVLFNBQUcsSUFBbUIsZ0JBQVcsV0FBUztBQUNqRCxhQUFLLEtBQVMsWUFBUSxLQUFTLFdBQVMsT0FBTyxPQUFFO0FBQzFDLG9CQUFNLFFBQWtCLHVCQUFLLEtBQWEsYUFBUTtBQUNsRCxvQkFDVjtBQUFDO0FBQ0UsYUFBSyxLQUFTLFlBQVEsS0FBUyxXQUFTLE9BQU8sT0FBRTtBQUMxQyxvQkFBTSxRQUFrQix1QkFBSyxLQUFhLGFBQVE7QUFDbEQsb0JBQ1Y7QUFBQztBQUNLLGdCQUFFLE9BQVksVUFBYyxRQUEzQixHQUFrQyxPQUM3QztBQUFDO0FBQ1MsZ0NBQW1CLHNCQUE3QixVQUEwQztBQUN0QyxhQUFTLFFBQU8sT0FBTyxPQUFXO0FBQy9CLGFBQUssS0FBUyxZQUFRLEtBQVUsVUFBRTtBQUMzQixvQkFBbUIsa0NBQVUsVUFBaUIsaUJBQVUsVUFBTSxPQUFNLEtBQVMsVUFBTSxLQUM3RjtBQUFNLGdCQUFFO0FBQ0QsaUJBQUssS0FBVSxVQUFFO0FBQ1Ysd0JBQW1CLGtDQUFVLFVBQWMsY0FBVSxVQUFNLE9BQU0sS0FDM0U7QUFBQztBQUNLLG9CQUFtQixrQ0FBVSxVQUFjLGNBQVUsVUFBTSxPQUFNLEtBQzNFO0FBQ0o7QUFBQztBQUNPLGdDQUFRLFdBQWhCLFVBQXNCO0FBQ1osZ0JBQUMsQ0FBTSxNQUFXLFdBQVEsV0FBWSxTQUNoRDtBQUFDO0FBQ0wsWUFBQztBQUFBLEdBRUQ7O0FBQW1DLDhCQUFlO0FBQzlDLDRCQUF3QztBQUE1QixnQ0FBNEI7QUFBNUIseUJBQTRCOztBQUNwQyxxQkFBUTtBQURPLGNBQVMsWUFFNUI7QUFBQztBQUNNLDZCQUFPLFVBQWQ7QUFBaUMsZ0JBQWtCO0FBQUM7QUFDN0MsNkJBQVEsV0FBZixVQUEwQixPQUFxQjtBQUFuQiwyQkFBbUI7QUFBbkIsb0JBQW1COztBQUN4QyxhQUFLLEtBQVUsYUFBTSxHQUFRO0FBQzdCLGFBQU0sTUFBTyxTQUFPLEtBQVcsV0FBRTtBQUMxQixvQkFBQyxJQUFtQixnQkFBSyxNQUFpQix1QkFBSyxLQUFhLGFBQ3RFO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ1MsNkJBQW1CLHNCQUE3QixVQUEwQztBQUNoQyxnQkFBbUIsa0NBQVUsVUFBaUIsaUJBQVUsVUFBSyxLQUN2RTtBQUFDO0FBQ0wsWUFBQztBQUFBLEdBRUQ7O0FBQTBDLHFDQUFlO0FBQ3JELG1DQUEwQyxVQUFnQztBQUE5RCwrQkFBOEI7QUFBOUIsd0JBQThCOztBQUFFLCtCQUE4QjtBQUE5Qix3QkFBOEI7O0FBQ3RFLHFCQUFRO0FBRE8sY0FBUSxXQUFlO0FBQVMsY0FBUSxXQUUzRDtBQUFDO0FBQ00sb0NBQU8sVUFBZDtBQUFpQyxnQkFBeUI7QUFBQztBQUNwRCxvQ0FBUSxXQUFmLFVBQTBCLE9BQXFCO0FBQW5CLDJCQUFtQjtBQUFuQixvQkFBbUI7O0FBQ3hDLGFBQU0sU0FBUSxRQUFTLE1BQVksZUFBVSxPQUFPLE9BQU07QUFDN0QsYUFBUyxRQUFRLE1BQVE7QUFDdEIsYUFBSyxLQUFTLFlBQVMsUUFBTyxLQUFVLFVBQUU7QUFDbkMsb0JBQUMsSUFBbUIsZ0JBQUssTUFBaUIsdUJBQUssS0FBYSxhQUFtQixrQ0FBVSxVQUFrQixrQkFBVSxVQUFLLEtBQ3BJO0FBQUM7QUFDRSxhQUFLLEtBQVMsWUFBUyxRQUFPLEtBQVUsVUFBRTtBQUNuQyxvQkFBQyxJQUFtQixnQkFBSyxNQUFpQix1QkFBSyxLQUFhLGFBQW1CLGtDQUFVLFVBQWtCLGtCQUFVLFVBQUssS0FDcEk7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDUyxvQ0FBbUIsc0JBQTdCLFVBQTBDO0FBQ2hDLGdCQUNWO0FBQUM7QUFDTCxZQUFDO0FBQUEsR0FFRDs7QUFBb0MsK0JBQWU7QUFDL0MsNkJBQXVDO0FBQTNCLDRCQUEyQjtBQUEzQixxQkFBMkI7O0FBQ25DLHFCQUFRO0FBRE8sY0FBSyxRQUV4QjtBQUFDO0FBQ00sOEJBQU8sVUFBZDtBQUFpQyxnQkFBbUI7QUFBQztBQUM5Qyw4QkFBUSxXQUFmLFVBQTBCLE9BQXFCO0FBQW5CLDJCQUFtQjtBQUFuQixvQkFBbUI7O0FBQ3hDLGFBQUMsQ0FBSyxLQUFNLFNBQUksQ0FBTyxPQUFPLE9BQU07QUFDdkMsYUFBTSxLQUFHLElBQVUsT0FBSyxLQUFRO0FBQzdCLGFBQUcsR0FBSyxLQUFRLFFBQU8sT0FBTTtBQUMxQixnQkFBQyxJQUFtQixnQkFBTSxPQUFpQix1QkFBSyxLQUFhLGFBQ3ZFO0FBQUM7QUFDTCxZQUFDO0FBQUEsR0FDRDs7QUFBb0MsK0JBQWU7QUFFL0M7QUFDSSxxQkFBUTtBQUZKLGNBQUUsS0FHVjtBQUFDO0FBQ00sOEJBQU8sVUFBZDtBQUFpQyxnQkFBbUI7QUFBQztBQUM5Qyw4QkFBUSxXQUFmLFVBQTBCLE9BQXFCO0FBQW5CLDJCQUFtQjtBQUFuQixvQkFBbUI7O0FBQ3hDLGFBQUMsQ0FBTyxPQUFPLE9BQU07QUFDckIsYUFBSyxLQUFHLEdBQUssS0FBUSxRQUFPLE9BQU07QUFDL0IsZ0JBQUMsSUFBbUIsZ0JBQU0sT0FBaUIsdUJBQUssS0FBYSxhQUN2RTtBQUFDO0FBQ1MsOEJBQW1CLHNCQUE3QixVQUEwQztBQUNoQyxnQkFBbUIsa0NBQVUsVUFDdkM7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQVMsU0FBa0IsbUJBQUUsQ0FBVTtBQUNoRCx3QkFBUyxTQUFTLFNBQW1CLG9CQUFFLENBQWtCLG1CQUFvQixvQkFBRTtBQUFvQixZQUFDLElBQXdCO0FBQUMsSUFBcUI7QUFDbEosd0JBQVMsU0FBUyxTQUFnQixpQkFBRSxDQUFvQixxQkFBRTtBQUFvQixZQUFDLElBQXFCO0FBQUMsSUFBcUI7QUFDMUgsd0JBQVMsU0FBUyxTQUF1Qix3QkFBRSxDQUFrQixtQkFBb0Isb0JBQUU7QUFBb0IsWUFBQyxJQUE0QjtBQUFDLElBQXFCO0FBQzFKLHdCQUFTLFNBQVMsU0FBaUIsa0JBQUUsQ0FBUyxVQUFFO0FBQW9CLFlBQUMsSUFBc0I7QUFBQyxJQUFxQjtBQUNqSCx3QkFBUyxTQUFTLFNBQWlCLGtCQUFJLElBQUU7QUFBb0IsWUFBQyxJQUFzQjtBQUFDLElBQXFCLG1COzs7Ozs7Ozs7OztvQkN6SnhGLEdBQUc7QUFDdkIsVUFBQyxJQUFLLEtBQU07QUFBSSxhQUFFLEVBQWUsZUFBSSxJQUFFLEVBQUcsS0FBSSxFQUFJO01BQ3REO0FBQW9CLGNBQVksY0FBTTtBQUFDO0FBQ3RDLE9BQVUsWUFBSSxNQUFTLE9BQVMsT0FBTyxPQUFNLE1BQUcsR0FBVSxZQUFJLEVBQVUsV0FBRSxJQUMvRTtBQUFDO0FBRUUsS0FBQyxPQUFhLFdBQWdCLGVBQVUsT0FBUyxTQUFFO0FBQzNDLGVBQVMsT0FBUSxVQUM1QjtBQUFDO0FBRU0sU0FBVSxZQUFhLFU7Ozs7Ozs7Ozs7O0FDZ0YxQix3QkFBc0IsT0FBcUI7QUFBbkIsMkJBQW1CO0FBQW5CLG9CQUFtQjs7QUFDbkMsY0FBSyxPQUFRO0FBQ2IsY0FBTSxRQUNkO0FBQUM7QUFsRGEsZUFBTyxVQUFyQixVQUE2QyxPQUFvQjtBQUN4RCxlQUFPLFNBQUs7QUFDYixjQUFDLElBQUssSUFBSSxHQUFHLElBQVMsT0FBTyxRQUFLLEtBQUc7QUFDckMsaUJBQVMsUUFBUyxPQUFJO0FBQ3RCLGlCQUFRLE9BQUcsSUFBYSxVQUFPO0FBQzVCLGlCQUFRLE9BQU0sTUFBTyxVQUFpQixhQUFFO0FBQ3ZDLHFCQUFhLFlBQVE7QUFDbEIscUJBQVEsT0FBTSxNQUFTLFlBQWdCLGVBQVMsTUFBVSxhQUFnQixhQUFFO0FBQ3RFLDJCQUFVLFlBQVEsTUFBVztBQUM5QiwwQkFBUyxXQUFRLE1BQVU7QUFDdEIsaUNBQVksVUFDekI7QUFBQztBQUNRLDJCQUFlLGVBQU0sT0FBTSxNQUN4QztBQUFNLG9CQUFFO0FBQ0Esc0JBQU0sUUFDZDtBQUFDO0FBQ0ksbUJBQUssS0FDZDtBQUNKO0FBQUM7QUFDYSxlQUFPLFVBQXJCLFVBQTZDO0FBQ3pDLGFBQVUsU0FBRyxJQUFZO0FBQ3JCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUSxNQUFPLFFBQUssS0FBRztBQUNwQyxpQkFBUSxPQUFRLE1BQUk7QUFDakIsaUJBQUssS0FBUyxTQUFFO0FBQ1Qsd0JBQUssS0FBQyxFQUFPLE9BQU0sS0FBTSxPQUFNLE1BQU0sS0FDL0M7QUFBTSxvQkFBRTtBQUNFLHdCQUFLLEtBQUssS0FDcEI7QUFDSjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNhLGVBQWMsaUJBQTVCLFVBQW9ELE9BQVU7QUFDdEQsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFRLE1BQU8sUUFBTSxLQUFHO0FBQ2xDLGlCQUFNLE1BQUcsR0FBTSxTQUFRLEtBQU8sT0FBTSxNQUMzQztBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUVjLGVBQWMsaUJBQTdCLFVBQXNDLEtBQVcsTUFBMEI7QUFDbkUsY0FBQyxJQUFPLE9BQVEsS0FBRTtBQUNkLGlCQUFDLE9BQVUsSUFBSyxRQUFnQixZQUFVO0FBQzNDLGlCQUFVLGFBQWEsVUFBUSxRQUFLLE9BQUcsQ0FBRyxHQUFVO0FBQ25ELGtCQUFLLE9BQU0sSUFDbkI7QUFDSjtBQUFDO0FBT00seUJBQU8sVUFBZDtBQUFpQyxnQkFBYztBQUFDO0FBQ2hELDJCQUFXLHFCQUFLO2NBQWhCO0FBQWdDLG9CQUFLLEtBQVk7QUFBQztjQUNsRCxhQUE4QjtBQUN0QixrQkFBVSxZQUFZO0FBQ3ZCLGlCQUFDLENBQUssS0FBVyxXQUFRO0FBQzVCLGlCQUFPLE1BQWUsS0FBVSxVQUFZO0FBQzVDLGlCQUFTLFFBQU0sSUFBUSxRQUFVLFVBQVk7QUFDMUMsaUJBQU0sUUFBRyxDQUFHLEdBQUU7QUFDVCxzQkFBVSxZQUFNLElBQU0sTUFBRSxHQUFTO0FBQ2pDLHNCQUFLLE9BQU0sSUFBTSxNQUFNLFFBQy9CO0FBQ0o7QUFBQzs7dUJBVmlEOztBQVdsRCwyQkFBVyxxQkFBTztjQUFsQjtBQUFzQyxvQkFBSyxLQUFTLFdBQU8sT0FBVTtBQUFDOzt1QkFBQTs7QUFDdEUsMkJBQVcscUJBQUk7Y0FBZjtBQUNPLGlCQUFLLEtBQVMsU0FBTyxPQUFLLEtBQVU7QUFDcEMsaUJBQUssS0FBTyxPQUFPLE9BQUssS0FBTSxNQUFZO0FBQ3ZDLG9CQUNWO0FBQUM7Y0FDRCxhQUErQjtBQUN2QixrQkFBUyxXQUNqQjtBQUFDOzt1QkFIQTs7QUFyRWEsZUFBUyxZQUFPO0FBc0NmLGVBQWEsZ0JBQUcsQ0FBUSxRQUFTLFNBQWE7QUFtQ2pFLFlBQUM7QUFFRDs7QUFBQSxxQkFJQSxDQUFDO0FBSFUsb0JBQU8sVUFBZDtBQUNJLGVBQU0sSUFBUyxNQUNuQjtBQUFDO0FBQ0wsWUFBQztBQUNEOztBQUFBLDRCQUlBLENBQUM7QUFIVSwyQkFBTyxVQUFkO0FBQ0ksZUFBTSxJQUFTLE1BQ25CO0FBQUM7QUFDTCxZQUFDO0FBRUQ7QUFBTyxLQUFrQixzQ0FDekI7O0FBQUEsOEJBa0JBLENBQUM7QUFqQmlCLG1CQUFrQixxQkFBaEMsVUFBa0Q7QUFDM0MsYUFBQyxDQUFXLFdBQU8sT0FBTztBQUM3QixhQUFNLEtBQVcsU0FBZSxlQUFZO0FBQ3pDLGFBQUMsQ0FBRyxNQUFJLENBQUcsR0FBZ0IsZ0JBQU8sT0FBTztBQUM1QyxhQUFXLFVBQUssR0FBd0Isd0JBQUs7QUFDMUMsYUFBUSxVQUFLLEdBQUksR0FBa0I7QUFDaEMsZ0JBQVEsVUFDbEI7QUFBQztBQUNhLG1CQUFZLGVBQTFCLFVBQTRDO0FBQ3JDLGFBQUMsQ0FBVyxXQUFPLE9BQU87QUFDN0IsYUFBTSxLQUFXLFNBQWUsZUFBWTtBQUN6QyxhQUFJLElBQUU7QUFDSCxnQkFBUztBQUNMLG9CQUNWO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ0wsWUFBQztBQUVEOztBQUFBLHNCQXVCQSxDQUFDO0FBckJHLDJCQUFXLGlCQUFPO2NBQWxCO0FBQXNDLG9CQUFLLEtBQVUsYUFBUSxRQUFRLEtBQVUsVUFBTyxVQUFPO0FBQUM7O3VCQUFBOztBQUN2RixxQkFBSSxPQUFYLFVBQXVCLFFBQWtCO0FBQ2xDLGFBQUssS0FBVSxhQUFTLE1BQVE7QUFDL0IsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQVUsVUFBTyxRQUFNLEtBQUc7QUFDOUMsaUJBQWMsYUFBTyxLQUFVLFVBQUcsR0FBTyxRQUU3QztBQUNKO0FBQUM7QUFDTSxxQkFBRyxNQUFWLFVBQWtCO0FBQ1gsYUFBSyxLQUFVLGFBQVMsTUFBRTtBQUNyQixrQkFBVSxZQUFHLElBQ3JCO0FBQUM7QUFDRyxjQUFVLFVBQUssS0FDdkI7QUFBQztBQUNNLHFCQUFNLFNBQWIsVUFBcUI7QUFDZCxhQUFLLEtBQVUsYUFBUyxNQUFRO0FBQ25DLGFBQVMsUUFBTyxLQUFVLFVBQVEsUUFBSyxNQUFLO0FBQ3pDLGFBQU0sU0FBYyxXQUFFO0FBQ2pCLGtCQUFVLFVBQU8sT0FBTSxPQUMvQjtBQUNKO0FBQUM7QUFDTCxZQUFDO0FBQUEsSzs7Ozs7Ozs7Ozs7QUM1S2lEOztBQUdsRDs7O0FBQXlDLG9DQUFXO0FBQ2hEO0FBQ0kscUJBQ0o7QUFBQztBQUNNLG1DQUFPLFVBQWQ7QUFDVSxnQkFBbUIsa0NBQVUsVUFDdkM7QUFBQztBQUNMLFlBQUM7QUFDRDs7QUFBd0MsbUNBQVc7QUFDL0M7QUFDSSxxQkFDSjtBQUFDO0FBQ00sa0NBQU8sVUFBZDtBQUNVLGdCQUFtQixrQ0FBVSxVQUN2QztBQUFDO0FBQ0wsWUFBQztBQUNEOztBQUFxQyxnQ0FBVztBQUU1Qyw4QkFBMkI7QUFDdkIscUJBQVE7QUFDSixjQUFRLFVBQ2hCO0FBQUM7QUFDTSwrQkFBTyxVQUFkO0FBQ1UsZ0JBQW1CLGtDQUFVLFVBQWlCLGlCQUFVLFVBQUssS0FDdkU7QUFBQztBQUNPLCtCQUFXLGNBQW5CO0FBQ0ksYUFBUyxRQUFHLENBQVEsU0FBTSxNQUFNLE1BQU0sTUFBUTtBQUM5QyxhQUFTLFFBQUcsQ0FBRSxHQUFHLEdBQUcsR0FBRyxHQUFLO0FBQ3pCLGFBQUssS0FBUSxXQUFNLEdBQU8sT0FBVTtBQUN2QyxhQUFLLElBQU8sS0FBTSxNQUFLLEtBQUksSUFBSyxLQUFTLFdBQU8sS0FBSSxJQUFRO0FBQzVELGFBQVMsUUFBTyxLQUFRLFVBQU8sS0FBSSxJQUFLLE1BQUs7QUFDdkMsZ0JBQU0sTUFBUSxRQUFNLE1BQUksTUFBTSxNQUFRLE1BQ2hEO0FBQUM7QUFDTCxZQUFDO0FBRUQ7O0FBQWlDLDRCQUFXO0FBRXhDLDBCQUF3QjtBQUNwQixxQkFBUTtBQUNKLGNBQUssT0FDYjtBQUFDO0FBQ00sMkJBQU8sVUFBZDtBQUNVLGdCQUFLLEtBQ2Y7QUFBQztBQUNMLFlBQUM7QUFBQSxzQjs7Ozs7Ozs7OztBQy9DTSxLQUFzQjtBQUNaLG9CQUFJO0FBQ1YsY0FBSTtBQUNGLGdCQUFFLG1CQUF5QjtBQUNoQyxhQUFPLE1BQU8sS0FBYyxnQkFBTyxLQUFRLFFBQUssS0FBZSxpQkFBaUI7QUFDN0UsYUFBQyxDQUFJLE9BQUksQ0FBSSxJQUFVLFVBQUksTUFBaUI7QUFDekMsZ0JBQUksSUFDZDtBQUFDO0FBQ1MsaUJBQUU7QUFDUixhQUFPLE1BQU07QUFDVixhQUFLLEtBQUs7QUFDVCxjQUFDLElBQU8sT0FBUSxLQUFTLFNBQUU7QUFDeEIsaUJBQUssS0FDWjtBQUFDO0FBQ0UsYUFBUTtBQUNMLGdCQUNWO0FBRUo7QUFsQmdDO0FBa0J6QixLQUFpQjtBQUNSLG1CQUFZO0FBQ1osbUJBQVE7QUFDUixtQkFBWTtBQUNYLG9CQUFvQjtBQUNyQixtQkFBbUI7QUFDcEIsa0JBQXVEO0FBQ2xELHVCQUF3QztBQUMzQyxvQkFBd0I7QUFDdkIscUJBQWE7QUFDZCxvQkFBK0I7QUFDdEIsNkJBQXdDO0FBQ2xELG1CQUFnQztBQUMvQixvQkFBc0M7QUFDbkMsdUJBQXFDO0FBQ3ZDLHFCQUF3QztBQUN4QyxxQkFBNEM7QUFDN0Msb0JBQXlFO0FBQzVFLGlCQUE4QztBQUM5QyxpQkFBOEM7QUFDNUMsbUJBQXdDO0FBQ3JDLHNCQUF5QztBQUN0Qyx5QkFBdUU7QUFDNUUsb0JBQXdDO0FBQ25DLHlCQUFpQztBQUN0QyxvQkFBc0U7QUFDN0UsYUFBVztBQUNSLGdCQUNYO0FBNUJ5QjtBQTZCVCxvQkFBUSxRQUFNLFFBQWlCO0FBRTlDLEtBQUMsQ0FBTyxPQUFVLFVBQVcsV0FBRTtBQUN4QixZQUFVLFVBQVUsWUFBRztBQUN6QixhQUFRLE9BQWE7QUFDZixxQkFBYSxRQUFXLFlBQUUsVUFBZSxPQUFRO0FBQzdDLG9CQUFDLE9BQVcsS0FBUSxXQUFlLGNBQy9CLEtBQVEsVUFHdEI7QUFDSixVQU5lO0FBT25CO0FBQUMsRTs7Ozs7Ozs7Ozs7OztBQzlDRyxpQ0FBK0I7QUFBWixjQUFJLE9BQVE7QUFWdkIsY0FBUyxZQUFnQjtBQUN6QixjQUFZLGVBQW9CO0FBQ2hDLGNBQVcsY0FBMEI7QUFDdEMsY0FBUyxZQUFnQjtBQUN6QixjQUFhLGdCQUFnQjtBQUM3QixjQUFhLGdCQUFnQjtBQUM3QixjQUFZLGVBQWE7QUFDekIsY0FBVSxhQUlqQjtBQUFDO0FBQ0QsMkJBQVcsOEJBQUk7Y0FBZjtBQUFrQyxvQkFBSyxLQUFVLFlBQU8sS0FBVSxZQUFhO0FBQUM7Y0FDaEYsYUFBNkI7QUFBUSxrQkFBVSxZQUFVO0FBQUM7O3VCQURzQjs7QUFFaEYsMkJBQVcsOEJBQWdCO2NBQTNCO0FBQXNDLG9CQUFLLEtBQWE7QUFBQzs7dUJBQUE7O0FBQ2xELGtDQUFjLGlCQUFyQixVQUFnQztBQUN0QixnQkFBTSxLQUFpQixZQUF0QixHQUEyQixLQUFhLGdCQUFVLFFBQUksQ0FDakU7QUFBQztBQUNNLGtDQUFRLFdBQWYsVUFBd0I7QUFDakIsYUFBSyxLQUFZLFlBQU8sT0FBSyxLQUFXLFdBQU07QUFDM0MsZ0JBQ1Y7QUFBQztBQUNELDJCQUFXLDhCQUFnQjtjQUEzQjtBQUFzQyxvQkFBSyxLQUFhO0FBQUM7O3VCQUFBOztBQUNsRCxrQ0FBUSxXQUFmLFVBQXdCLEtBQVksT0FBc0I7QUFDbkQsYUFBSyxLQUFZLFlBQUU7QUFDZCxrQkFBVyxXQUFJLEtBQU8sT0FDOUI7QUFDSjtBQUFDO0FBQ00sa0NBQVUsYUFBakIsVUFBaUM7QUFDMUIsYUFBQyxDQUFLLEtBQWUsZUFBTyxPQUFTO0FBQ2xDLGdCQUFRLFFBQVEsUUFBSyxLQUFjLGVBQzdDO0FBQUM7QUFDTSxrQ0FBWSxlQUFuQixVQUFxQztBQUMzQixnQkFBTSxLQUFjLGlCQUFhLFVBQVEsUUFBSyxLQUFlLGlCQUFLLENBQWpFLEdBQTZFLFlBQU8sS0FBYyxnQkFDN0c7QUFBQztBQUNELDJCQUFXLDhCQUFPO2NBQWxCO0FBQ08saUJBQUssS0FBYSxnQkFBUyxNQUFPLE9BQUssS0FBYztBQUNyRCxpQkFBSyxLQUFZLGVBQVMsTUFBTyxPQUFLLEtBQWU7QUFDbEQsb0JBQ1Y7QUFBQzs7dUJBQUE7O0FBQ00sa0NBQVUsYUFBakIsVUFBbUMsT0FBNkI7QUFDeEQsY0FBYSxlQUFTO0FBQ3RCLGNBQVksY0FDcEI7QUFBQztBQUNMLFlBQUM7QUFDRDs7QUFLSSxnQ0FBK0IsTUFBd0IsWUFBa0MsU0FBa0M7QUFBbEUsOEJBQWdDO0FBQWhDLHVCQUFnQzs7QUFBRSxpQ0FBZ0M7QUFBaEMsMEJBQWdDOztBQUF4RyxjQUFJLE9BQVE7QUFBaUMsY0FBTyxVQUFrQjtBQUFTLGNBQVUsYUFBZTtBQUYzSCxjQUFVLGFBQW1DO0FBQzdDLGNBQWtCLHFCQUF1QjtBQUVqQyxjQUFXLGFBQUcsSUFBZ0M7QUFDOUMsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFhLFdBQU8sUUFBSyxLQUFHO0FBQ3pDLGlCQUFRLE9BQU8sS0FBZSxlQUFXLFdBQUs7QUFDM0MsaUJBQU0sTUFBRTtBQUNILHNCQUFXLFdBQUssS0FDeEI7QUFDSjtBQUNKO0FBQUM7QUFDTSxpQ0FBSSxPQUFYLFVBQXdCO0FBQ2hCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFXLFdBQU8sUUFBSyxLQUFHO0FBQzNDLGlCQUFLLEtBQVcsV0FBRyxHQUFLLFFBQVMsTUFBTyxPQUFLLEtBQVcsV0FDL0Q7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDTSxpQ0FBYyxpQkFBckIsVUFBbUM7QUFDL0IsYUFBZ0IsZUFBRyxPQUFlLGFBQWEsV0FBVyxXQUFXLFNBQU07QUFDeEUsYUFBQyxDQUFjLGNBQVE7QUFDMUIsYUFBZ0IsZUFBUTtBQUN4QixhQUFhLFlBQWUsYUFBUSxRQUFrQixrQkFBYTtBQUNoRSxhQUFVLFlBQUcsQ0FBRyxHQUFFO0FBQ0wsNEJBQWUsYUFBVSxVQUFVLFlBQU07QUFDekMsNEJBQWUsYUFBVSxVQUFFLEdBQzNDO0FBQUM7QUFDVyx3QkFBTyxLQUFnQixnQkFBZTtBQUNsRCxhQUFRLE9BQUcsSUFBc0IsbUJBQWU7QUFDN0MsYUFBYyxjQUFFO0FBQ1gsa0JBQUssT0FDYjtBQUFDO0FBQ0UsYUFBQyxRQUFlLGdFQUFjLFVBQUU7QUFDNUIsaUJBQVMsU0FBTSxNQUFFO0FBQ1osc0JBQUssT0FBVyxTQUN4QjtBQUFDO0FBQ0UsaUJBQVMsU0FBUyxTQUFFO0FBQ2Ysc0JBQWEsZUFBVyxTQUNoQztBQUFDO0FBQ0UsaUJBQVMsU0FBWSxZQUFFO0FBQ2xCLHNCQUFxQixxQkFBSyxLQUNsQztBQUFDO0FBQ0UsaUJBQVMsU0FBUyxTQUFFO0FBQ25CLHFCQUFlLGNBQUcsT0FBZSxTQUFRLFlBQWUsYUFBVyxTQUFRLFVBQVE7QUFDbkYscUJBQWdCLGVBQUcsT0FBZSxTQUFRLFlBQWUsYUFBVyxTQUFRLFVBQVE7QUFDaEYsc0JBQVcsV0FBYSxjQUNoQztBQUFDO0FBQ0UsaUJBQVMsU0FBWSxZQUFFO0FBQ2xCLHNCQUFXLGFBQVcsU0FDOUI7QUFBQztBQUNFLGlCQUFTLFNBQVksWUFBRTtBQUNsQixzQkFBVyxhQUFXLFNBQzlCO0FBQUM7QUFDRSxpQkFBUyxTQUFXLFdBQUU7QUFDakIsc0JBQVUsWUFBVyxTQUM3QjtBQUFDO0FBQ0UsaUJBQVMsU0FBZSxlQUFFO0FBQ3JCLHNCQUFjLGdCQUFXLFNBQ2pDO0FBQUM7QUFDRSxpQkFBUyxTQUFlLGVBQUU7QUFDckIsc0JBQWMsZ0JBQVcsU0FDakM7QUFDSjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNPLGlDQUFlLGtCQUF2QixVQUE0QztBQUNyQyxhQUFhLGFBQU8sVUFBSyxLQUFnQixhQUFHLE1BQXFCLGtCQUFnQixnQkFBTyxPQUFjO0FBQzdGLHdCQUFlLGFBQU0sTUFBSTtBQUNqQyxjQUFxQixxQkFBZTtBQUNsQyxnQkFDVjtBQUFDO0FBQ08saUNBQW9CLHVCQUE1QixVQUFpRDtBQUMxQyxhQUFDLENBQUssS0FBb0Isb0JBQUU7QUFDdkIsa0JBQW1CLHFCQUFHLElBQzlCO0FBQUM7QUFDRyxjQUFtQixtQkFBSyxLQUNoQztBQUFDO0FBN0VNLHVCQUFjLGlCQUFPO0FBQ3JCLHVCQUFVLGFBQU87QUE2RTVCLFlBQUM7QUFDRDs7QUFBQTtBQUNZLGNBQU8sVUFBb0M7QUFDM0MsY0FBZSxrQkFBMkM7QUFDMUQsY0FBZSxrQkFBNEM7QUFDM0QsY0FBdUIsMEJBc0luQztBQUFDO0FBcklVLDRCQUFRLFdBQWYsVUFBNEIsTUFBd0IsWUFBMkIsU0FBMkI7QUFBcEQsOEJBQXlCO0FBQXpCLHVCQUF5Qjs7QUFBRSxpQ0FBeUI7QUFBekIsMEJBQXlCOztBQUN0RyxhQUFpQixnQkFBRyxJQUFxQixrQkFBSyxNQUFZLFlBQVMsU0FBYztBQUM3RSxjQUFRLFFBQU0sUUFBaUI7QUFDaEMsYUFBWSxZQUFFO0FBQ2IsaUJBQVksV0FBTyxLQUFnQixnQkFBYTtBQUM3QyxpQkFBQyxDQUFVLFVBQUU7QUFDUixzQkFBZ0IsZ0JBQVksY0FDcEM7QUFBQztBQUNHLGtCQUFnQixnQkFBWSxZQUFLLEtBQ3pDO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ00sNEJBQXFCLHdCQUE1QixVQUF5QyxNQUFvQjtBQUN6RCxhQUFpQixnQkFBTyxLQUFVLFVBQU87QUFDdEMsYUFBZSxlQUFFO0FBQ0gsMkJBQVEsVUFDekI7QUFDSjtBQUFDO0FBQ00sNEJBQWEsZ0JBQXBCLFVBQWlDO0FBQzdCLGFBQWMsYUFBTyxLQUFnQixnQkFBTztBQUN6QyxhQUFDLENBQVksWUFBRTtBQUNKLDBCQUFHLElBQWdDO0FBQ3pDLGtCQUFlLGVBQUssTUFBYztBQUNsQyxrQkFBZ0IsZ0JBQU0sUUFDOUI7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDTSw0QkFBVyxjQUFsQixVQUErQjtBQUMzQixhQUFpQixnQkFBTyxLQUFVLFVBQU87QUFDdEMsYUFBQyxDQUFlLGVBQU8sT0FBTTtBQUMxQixnQkFBYyxjQUN4QjtBQUFDO0FBQ00sNEJBQWtCLHFCQUF6QixVQUFzQyxNQUErQjtBQUE3QixtQ0FBNkI7QUFBN0IsNEJBQTZCOztBQUNqRSxhQUFVLFNBQU07QUFDWixjQUFvQixvQkFBSyxNQUFjLGNBQVU7QUFDL0MsZ0JBQ1Y7QUFBQztBQUNNLDRCQUFxQix3QkFBNUIsVUFBeUM7QUFDckMsYUFBYyxhQUFPLEtBQXdCLHdCQUFPO0FBQ2pELGFBQUMsQ0FBWSxZQUFFO0FBQ0osMEJBQUcsSUFBb0I7QUFDN0Isa0JBQXVCLHVCQUFLLE1BQWM7QUFDMUMsa0JBQXdCLHdCQUFNLFFBQ3RDO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ00sNEJBQVcsY0FBbEIsVUFBb0MsV0FBbUI7QUFDbkQsYUFBaUIsZ0JBQU8sS0FBVSxVQUFZO0FBQzNDLGFBQUMsQ0FBZSxlQUFRO0FBQzNCLGFBQVksV0FBZ0IsY0FBZSxlQUFlO0FBQ3ZELGFBQVUsVUFBRTtBQUNQLGtCQUFtQixtQkFBYyxlQUFZO0FBQzdDLGtCQUF5Qix5QkFDakM7QUFDSjtBQUFDO0FBQ00sNEJBQWMsaUJBQXJCLFVBQXVDLFdBQXNCO0FBQ3pELGFBQWlCLGdCQUFPLEtBQVUsVUFBWTtBQUMzQyxhQUFDLENBQWUsZUFBTyxPQUFPO0FBQ2pDLGFBQVksV0FBZ0IsY0FBSyxLQUFlO0FBQzdDLGFBQVUsVUFBRTtBQUNQLGtCQUF3Qix3QkFBYyxlQUFZO0FBQ2xELGtCQUF5Qix5QkFDakM7QUFDSjtBQUFDO0FBQ08sNEJBQWtCLHFCQUExQixVQUEyRCxlQUE4QjtBQUNsRixhQUFjLGNBQUssS0FBUyxTQUFNLFNBQVMsTUFBUTtBQUN6Qyx1QkFBVyxXQUFLLEtBQ2pDO0FBQUM7QUFDTyw0QkFBdUIsMEJBQS9CLFVBQWdFLGVBQThCO0FBQzFGLGFBQVMsUUFBZ0IsY0FBVyxXQUFRLFFBQVc7QUFDcEQsYUFBTSxRQUFLLEdBQVE7QUFDVCx1QkFBVyxXQUFPLE9BQU0sT0FBSztBQUN2QyxhQUFjLGNBQW9CLG9CQUFFO0FBQzlCLHFCQUFnQixjQUFtQixtQkFBUSxRQUFTLFNBQU87QUFDN0QsaUJBQU0sU0FBTSxHQUFFO0FBQ0EsK0JBQW1CLG1CQUFPLE9BQU0sT0FDakQ7QUFDSjtBQUNKO0FBQUM7QUFDTyw0QkFBd0IsMkJBQWhDLFVBQWlFO0FBQ3pELGNBQWdCLGdCQUFjLGNBQU0sUUFBUTtBQUNoRCxhQUFnQixlQUFPLEtBQW1CLG1CQUFjLGNBQU87QUFDM0QsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFlLGFBQU8sUUFBSyxLQUFHO0FBQ3ZDLGtCQUFnQixnQkFBYSxhQUFHLEdBQU0sUUFDOUM7QUFDSjtBQUFDO0FBQ08sNEJBQW1CLHNCQUEzQixVQUF3QyxNQUF1QixjQUFrQztBQUM3RixhQUFZLFdBQU8sS0FBZ0IsZ0JBQU87QUFDdkMsYUFBQyxDQUFVLFVBQVE7QUFDbEIsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFXLFNBQU8sUUFBSyxLQUFHO0FBQ3BDLGlCQUFDLENBQWEsZ0JBQVksU0FBRyxHQUFTLFNBQUU7QUFDakMsd0JBQUssS0FBUyxTQUN4QjtBQUFDO0FBQ0csa0JBQW9CLG9CQUFTLFNBQUcsR0FBSyxNQUFjLGNBQzNEO0FBQ0o7QUFBQztBQUNNLDRCQUFTLFlBQWhCLFVBQTZCO0FBQ25CLGdCQUFLLEtBQVEsUUFDdkI7QUFBQztBQUNPLDRCQUFjLGlCQUF0QixVQUFtQyxNQUFpQztBQUNoRSxhQUFpQixnQkFBTyxLQUFVLFVBQU87QUFDdEMsYUFBQyxDQUFlLGVBQVE7QUFDeEIsYUFBYyxjQUFZLFlBQUU7QUFDdkIsa0JBQWUsZUFBYyxjQUFXLFlBQ2hEO0FBQUM7QUFDRyxjQUFDLElBQUssSUFBSSxHQUFHLElBQWdCLGNBQVcsV0FBTyxRQUFLLEtBQUc7QUFDbkQsa0JBQWdCLGdCQUFjLGNBQVcsV0FBRyxJQUFNLE1BQU0sS0FDaEU7QUFDSjtBQUFDO0FBQ08sNEJBQWUsa0JBQXZCLFVBQW9ELFVBQWlDLE1BQWtCO0FBQ25HLGFBQVMsUUFBRyxDQUFHO0FBQ1gsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFXLFVBQUssS0FBRztBQUM3QixpQkFBSyxLQUFHLEdBQUssUUFBWSxTQUFNLE1BQUU7QUFDM0IseUJBQUs7QUFFZDtBQUNKO0FBQUM7QUFDRSxhQUFNLFFBQUssR0FBRTtBQUNSLGtCQUFLLEtBQ2I7QUFBTSxnQkFBRTtBQUNBLGtCQUFPLFNBQ2Y7QUFDSjtBQUFDO0FBQ08sNEJBQXNCLHlCQUE5QixVQUEyQyxNQUFxQjtBQUM1RCxhQUFpQixnQkFBTyxLQUFVLFVBQU87QUFDdEMsYUFBQyxDQUFlLGVBQVE7QUFDeEIsYUFBYyxjQUFvQixvQkFBRTtBQUM5QixtQkFBVSxVQUFLLEtBQU0sTUFBSyxNQUFlLGNBQ2xEO0FBQUM7QUFDRSxhQUFjLGNBQVksWUFBRTtBQUN2QixrQkFBdUIsdUJBQWMsY0FBVyxZQUN4RDtBQUNKO0FBQUM7QUFDTCxZQUFDO0FBQ0Q7O0FBR0ksd0JBQStCLE1BQXdCO0FBQXBDLGNBQUksT0FBUTtBQUFTLGNBQU8sVUFBUTtBQUZoRCxjQUFXLGNBQWM7QUFDekIsY0FBRSxLQUFXLENBRXBCO0FBQUM7QUFDTSx5QkFBa0IscUJBQXpCO0FBQ1UsZ0JBQUssS0FBVyxXQUFLLEtBQVksY0FBTyxPQUFPLEtBQVksY0FDckU7QUFBQztBQUNMLFlBQUM7QUFDRDs7QUFBOEMseUNBQVM7QUFDbkQsdUNBQXVDLGNBQTBCO0FBQzdELDJCQUF1QixtQkFBa0IsbUJBQWUsZUFBaUIsaUJBQVksWUFBb0I7QUFEMUYsY0FBWSxlQUFRO0FBQVMsY0FBUyxZQUFRO0FBRTdELGFBQWMsYUFBYSxXQUFTLFNBQWMsY0FBWTtBQUMzRCxhQUFZLFlBQUU7QUFDVCxrQkFBWSxjQUE0QztBQUN4RCxrQkFBQyxJQUFLLElBQUksR0FBRyxJQUFhLFdBQU8sUUFBSyxLQUFHO0FBQ3RDLHFCQUFFLElBQUssR0FBSyxLQUFZLGVBQVM7QUFDaEMsc0JBQVksZUFBYyxXQUFHLEdBQ3JDO0FBQUM7QUFDRyxrQkFBWSxlQUNwQjtBQUNKO0FBQUM7QUFDTCxZQUFDO0FBQUEsR0FDRDs7QUFBOEMseUNBQVM7QUFDbkQsdUNBQXdDLGVBQXFCLE1BQXdCO0FBQ2pGLDJCQUFVLE1BQVc7QUFETixjQUFhLGdCQUFRO0FBQVMsY0FBSSxPQUFRO0FBQVMsY0FBTyxVQUFRO0FBRTdFLGNBQVksY0FBeUM7QUFDekQsYUFBUyxRQUFhLFdBQVMsU0FBbUIsbUJBQWMsZUFBUTtBQUNwRSxjQUFDLElBQUssSUFBSSxHQUFHLElBQVEsTUFBTyxRQUFLLEtBQUc7QUFDakMsaUJBQUUsSUFBSyxHQUFLLEtBQVksZUFBUztBQUNoQyxrQkFBWSxlQUFPLE1BQVEsTUFBRyxHQUFLLE9BQzNDO0FBQUM7QUFDRyxjQUFZLGVBQ3BCO0FBQUM7QUFDTCxZQUFDO0FBQUEsR0FDRDs7QUFBMEMscUNBQXdCO0FBQzlELG1DQUF1QyxjQUE4QjtBQUNqRSwyQkFBbUIsZUFBdUIsdUJBQWlGLGtGQUFlLGVBQVM7QUFEcEksY0FBWSxlQUFRO0FBQVMsY0FBYSxnQkFFN0Q7QUFBQztBQUNMLFlBQUM7QUFBQSxHQUNEOztBQUE0Qyx1Q0FBd0I7QUFDaEUscUNBQXVDLGNBQThCO0FBQ2pFLDJCQUFtQixlQUF5Qix5QkFBbUYsb0ZBQWUsZUFBUztBQUR4SSxjQUFZLGVBQVE7QUFBUyxjQUFhLGdCQUU3RDtBQUFDO0FBQ0wsWUFBQztBQUFBLEdBQ0Q7O0FBQStDLDBDQUFTO0FBQ3BELHdDQUF1QyxjQUEwQjtBQUM3RCwyQkFBd0Isb0JBQWtCLG1CQUFlLGVBQTZCLDZCQUFZLFlBQVM7QUFENUYsY0FBWSxlQUFRO0FBQVMsY0FBUyxZQUV6RDtBQUFDO0FBQ0wsWUFBQztBQUFBLEdBRUQ7O0FBQUE7QUFLVyxjQUFNLFNBQUcsSUFpSnBCO0FBQUM7QUFsSkcsMkJBQWtCLFlBQVE7Y0FBMUI7QUFBcUMsb0JBQVcsV0FBZ0I7QUFBQzs7dUJBQUE7O0FBRTFELDBCQUFZLGVBQW5CLFVBQTRCO0FBQ2xCLGdCQUFLLEtBQWlCLGlCQUFJLEtBQ3BDO0FBQUM7QUFDTSwwQkFBUSxXQUFmLFVBQTRCLFNBQVU7QUFDL0IsYUFBQyxDQUFTLFNBQVE7QUFDckIsYUFBYyxhQUFRO0FBQ25CLGFBQUksSUFBUyxTQUFFO0FBQ0osMEJBQWEsV0FBUyxTQUFjLGNBQUksSUFDdEQ7QUFBQztBQUNFLGFBQUMsQ0FBWSxZQUFRO0FBQ3BCLGNBQUMsSUFBTyxPQUFZLFNBQUU7QUFDbkIsaUJBQUksT0FBYyxXQUFrQixrQkFBVTtBQUM5QyxpQkFBSSxPQUFjLFdBQXNCLHNCQUFFO0FBQ3RDLHFCQUFLLE9BQVUsUUFBTTtBQUU1QjtBQUFDO0FBQ0QsaUJBQVksV0FBTyxLQUFhLGFBQVcsWUFBTztBQUMvQyxpQkFBQyxDQUFVLFVBQUU7QUFDUixzQkFBWSxZQUFDLElBQTRCLHlCQUFJLElBQVcsWUFBSyxJQUFXLFlBQVc7QUFFM0Y7QUFBQztBQUNHLGtCQUFXLFdBQVEsUUFBSyxNQUFLLEtBQUssS0FDMUM7QUFDSjtBQUFDO0FBQ1MsMEJBQWdCLG1CQUExQixVQUFtQyxLQUE4QjtBQUMxRCxhQUFDLENBQUksSUFBUyxTQUFPLE9BQUs7QUFDN0IsYUFBVSxTQUFNO0FBQ2IsYUFBUyxZQUFZLFFBQUMsQ0FBUyxTQUFZLFdBQUU7QUFDdEMsb0JBQVcsV0FBa0Isb0JBQVcsU0FBVyxXQUFJLElBQ2pFO0FBQUM7QUFDRCxhQUFjLGFBQWEsV0FBUyxTQUFjLGNBQUksSUFBWTtBQUM5RCxjQUFDLElBQUssSUFBWSxHQUFHLElBQWEsV0FBTyxRQUFLLEtBQUc7QUFDN0Msa0JBQVksWUFBSSxLQUFRLFFBQVksV0FDNUM7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDUywwQkFBVyxjQUFyQixVQUE4QixLQUFhLFFBQThCO0FBQ3JFLGFBQVMsUUFBUTtBQUNkLGFBQVMsU0FBa0Isa0JBQUU7QUFDdkIscUJBQVcsU0FBUyxTQUM3QjtBQUFNLGdCQUFFO0FBQ0MscUJBQU0sSUFBUyxTQUN4QjtBQUFDO0FBQ0UsYUFBTSxVQUFjLGFBQVMsVUFBVSxNQUFRO0FBQy9DLGFBQVMsU0FBZSxlQUFRLFFBQVE7QUFDeEMsYUFBSyxLQUFhLGFBQVEsUUFBRTtBQUMzQixpQkFBWSxXQUFNO0FBQ2Qsa0JBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUSxNQUFPLFFBQUssS0FBRztBQUM1QiwwQkFBSyxLQUFLLEtBQWlCLGlCQUFNLE1BQUcsSUFDaEQ7QUFBQztBQUNJLHFCQUFXLFNBQU8sU0FBSSxJQUFXLFdBQzFDO0FBQU0sZ0JBQUU7QUFDQyxxQkFBTyxLQUFpQixpQkFBTSxPQUN2QztBQUFDO0FBQ0UsYUFBQyxDQUFTLFNBQWUsZUFBUSxRQUFFO0FBQzVCLG9CQUFTLFNBQU0sUUFDekI7QUFDSjtBQUFDO0FBQ1MsMEJBQVUsYUFBcEIsVUFBK0IsT0FBVSxLQUFVLEtBQThCO0FBQzFFLGFBQU0sU0FBUyxNQUFRO0FBQ3ZCLGFBQVMsWUFBUSxRQUFZLFNBQWtCLGtCQUFFO0FBQ3hDLHNCQUFTLFNBQUksS0FBTyxPQUFRO0FBRXhDO0FBQUM7QUFDRSxhQUFLLEtBQWEsYUFBUSxRQUFFO0FBQ3ZCLGtCQUFhLGFBQU0sT0FBSyxLQUFLLEtBQVk7QUFFakQ7QUFBQztBQUNELGFBQVUsU0FBTyxLQUFhLGFBQU0sT0FBWTtBQUM3QyxhQUFPLE9BQVEsUUFBRTtBQUNaLGtCQUFTLFNBQU0sT0FBUSxPQUFTO0FBQy9CLHFCQUFTLE9BQ2xCO0FBQUM7QUFDRSxhQUFDLENBQU8sT0FBTyxPQUFFO0FBQ2IsaUJBQUssT0FDWjtBQUNKO0FBQUM7QUFDTywwQkFBWSxlQUFwQixVQUErQjtBQUFtQixnQkFBTSxTQUFTLE1BQVksWUFBVyxXQUFRLFFBQVMsV0FBRyxDQUFJO0FBQUM7QUFDekcsMEJBQVksZUFBcEIsVUFBK0IsT0FBOEI7QUFDekQsYUFBVSxTQUFHLEVBQVEsUUFBTSxNQUFPLE9BQVM7QUFDM0MsYUFBYSxZQUFRLE1BQVcsV0FBbUI7QUFDaEQsYUFBQyxDQUFVLGFBQVksWUFBUSxRQUFZLFNBQVcsV0FBRTtBQUM5Qyx5QkFBVyxTQUN4QjtBQUFDO0FBQ1EscUJBQVcsU0FBYSxhQUFZO0FBQ3ZDLGdCQUFPLFNBQWMsU0FBWCxHQUF3QixXQUFTLFNBQVksWUFBVyxhQUFRO0FBQzFFLGdCQUFNLFFBQU8sS0FBdUIsdUJBQU8sT0FBTyxRQUFPLE9BQVUsVUFBYTtBQUNoRixnQkFDVjtBQUFDO0FBQ08sMEJBQXNCLHlCQUE5QixVQUEwQyxRQUFZLE9BQThCLFVBQW1CO0FBQ25HLGFBQVMsUUFBUTtBQUNkLGFBQVEsUUFBRTtBQUNULGlCQUFzQixxQkFBYSxXQUFTLFNBQXNCLHNCQUFZO0FBQzNFLGlCQUFvQixvQkFBRTtBQUNqQixzQkFBQyxJQUFLLElBQUksR0FBRyxJQUFxQixtQkFBTyxRQUFLLEtBQUc7QUFDOUMseUJBQUMsQ0FBTSxNQUFtQixtQkFBSyxLQUFFO0FBQzNCLGlDQUFHLElBQTZCLDBCQUFtQixtQkFBRyxJQUFhO0FBRTVFO0FBQ0o7QUFDSjtBQUNKO0FBQU0sZ0JBQUU7QUFDRCxpQkFBUyxTQUFlLGVBQUU7QUFDdEIscUJBQUMsQ0FBVyxXQUFFO0FBQ1IsNkJBQUcsSUFBd0IscUJBQVMsU0FBSyxNQUFVLFNBQzVEO0FBQU0sd0JBQUU7QUFDQyw2QkFBRyxJQUEwQix1QkFBUyxTQUFLLE1BQVUsU0FDOUQ7QUFDSjtBQUNKO0FBQUM7QUFDRSxhQUFPLE9BQUU7QUFDSixrQkFBWSxZQUFNLE9BQzFCO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ08sMEJBQVcsY0FBbkIsVUFBb0MsT0FBYztBQUMzQyxhQUFRLFdBQVcsUUFBVyxXQUF1Qix1QkFBRTtBQUNqRCxtQkFBRyxLQUFVLFFBQVcsV0FBc0Isc0JBQ3ZEO0FBQUM7QUFDRyxjQUFPLE9BQUssS0FDcEI7QUFBQztBQUNPLDBCQUFZLGVBQXBCLFVBQXNDLE9BQVUsS0FBVSxLQUE4QjtBQUNqRixhQUFDLENBQUssS0FBYSxhQUFJLElBQU8sT0FBRTtBQUM1QixpQkFBSyxPQUNaO0FBQUM7QUFDRyxjQUFDLElBQUssSUFBSSxHQUFHLElBQVEsTUFBTyxRQUFLLEtBQUc7QUFDcEMsaUJBQVksV0FBTyxLQUFhLGFBQU0sTUFBRyxJQUFZO0FBQ2xELGlCQUFTLFNBQVEsUUFBRTtBQUNmLHFCQUFLLEtBQUssS0FBUyxTQUFTO0FBQzNCLHNCQUFTLFNBQU0sTUFBRyxJQUFVLFNBQ3BDO0FBQU0sb0JBQUU7QUFDRCxxQkFBQyxDQUFTLFNBQU8sT0FBRTtBQUNmLHlCQUFLLEtBQUssS0FBTSxNQUN2QjtBQUNKO0FBQ0o7QUFDSjtBQUFDO0FBQ08sMEJBQVksZUFBcEIsVUFBMEQsWUFBVTtBQUM3RCxhQUFDLENBQVksWUFBTyxPQUFNO0FBQ3pCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBYSxXQUFPLFFBQUssS0FBRztBQUN0QyxpQkFBVyxXQUFHLEdBQUssUUFBUSxLQUFPLE9BQVcsV0FDcEQ7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFwSmMsZ0JBQWdCLG1CQUFVO0FBQzFCLGdCQUFvQix1QkFBUztBQUM3QixnQkFBYSxnQkFBRyxJQUFtQjtBQW1KdEQsWUFBQztBQUFBLEs7Ozs7Ozs7Ozs7OztBQ3Bka0Q7O0FBQ1o7O0FBQ1c7O0FBR2xEOzs7QUFBcUMsZ0NBQUk7QUFPckM7QUFDSSxxQkFBUTtBQVBMLGNBQUcsTUFBYztBQUNqQixjQUFJLE9BQWM7QUFDbEIsY0FBUyxZQUFjO0FBQ3ZCLGNBQVMsWUFBYztBQUV2QixjQUFLLFFBR1o7QUFBQztBQUNNLCtCQUFHLE1BQVY7QUFDTyxhQUFDLENBQUssS0FBSSxPQUFJLENBQUssS0FBbUIsbUJBQVE7QUFDN0MsY0FBTSxRQUFRO0FBQ2xCLGFBQU8sTUFBRyxJQUFxQjtBQUM1QixhQUFLLEtBQU0sT0FBTSxLQUFNO0FBQ3ZCLGFBQWlCLGlCQUFlLGdCQUF1QztBQUMxRSxhQUFRLE9BQVE7QUFDYixhQUFPLFNBQUc7QUFDTixpQkFBSSxJQUFPLFVBQVEsS0FBRTtBQUNoQixzQkFBTyxPQUFLLEtBQU0sTUFBSSxJQUM5QjtBQUFNLG9CQUFFO0FBQ0Esc0JBQVEsUUFBSSxJQUFXLFlBQUssSUFDcEM7QUFDSjtBQUFFO0FBQ0MsYUFDUDtBQUFDO0FBQ00sK0JBQU8sVUFBZDtBQUFpQyxnQkFBaUI7QUFBQztBQUNuRCwyQkFBVywyQkFBTztjQUFsQjtBQUNVLG9CQUFDLENBQUssS0FBSSxPQUFJLENBQUssS0FBSyxRQUFJLENBQUssS0FBVSxhQUFJLENBQUssS0FDOUQ7QUFBQzs7dUJBQUE7O0FBQ00sK0JBQU8sVUFBZCxVQUF3QjtBQUNoQixjQUFTO0FBQ1YsYUFBSyxLQUFLLEtBQUssS0FBSSxNQUFPLEtBQUs7QUFDL0IsYUFBSyxLQUFNLE1BQUssS0FBSyxPQUFPLEtBQU07QUFDbEMsYUFBSyxLQUFXLFdBQUssS0FBVSxZQUFPLEtBQVc7QUFDakQsYUFBSyxLQUFXLFdBQUssS0FBVSxZQUFPLEtBQzdDO0FBQUM7QUFDTSwrQkFBSyxRQUFaO0FBQ1EsY0FBSSxNQUFNO0FBQ1YsY0FBSyxPQUFNO0FBQ1gsY0FBVSxZQUFNO0FBQ2hCLGNBQVUsWUFDbEI7QUFBQztBQUNTLCtCQUFNLFNBQWhCLFVBQTRCO0FBQ3hCLGFBQVMsUUFBTTtBQUNULGtCQUFPLEtBQW1CLG1CQUFTO0FBQ3RDLGFBQU8sVUFBVSxPQUFXLFdBQUU7QUFDekIsa0JBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUyxPQUFPLFFBQUssS0FBRztBQUNyQyxxQkFBYSxZQUFTLE9BQUk7QUFDdkIscUJBQUMsQ0FBVyxXQUFVO0FBQ3pCLHFCQUFTLFFBQU8sS0FBUyxTQUFZO0FBQ3JDLHFCQUFTLFFBQU8sS0FBUyxTQUFZO0FBQ2hDLHVCQUFLLEtBQWMsb0JBQU0sT0FDbEM7QUFDSjtBQUFNLGdCQUFFO0FBQ0Esa0JBQU0sUUFBa0IsdUJBQW1CLGtDQUFVLFVBQzdEO0FBQUM7QUFDRyxjQUFrQixrQkFDMUI7QUFBQztBQUNPLCtCQUFPLFVBQWYsVUFBOEIsUUFBa0I7QUFDeEMsY0FBTSxRQUFrQix1QkFBbUIsa0NBQVUsVUFBbUIsbUJBQVUsVUFBTyxRQUFhO0FBQ3RHLGNBQWtCLGtCQUMxQjtBQUFDO0FBQ08sK0JBQWtCLHFCQUExQixVQUFzQztBQUMvQixhQUFDLENBQVEsUUFBTyxPQUFRO0FBQ3hCLGFBQUMsQ0FBSyxLQUFNLE1BQU8sT0FBUTtBQUM5QixhQUFVLFNBQU8sS0FBYTtBQUMxQixjQUFDLElBQUssSUFBSSxHQUFHLElBQVMsT0FBTyxRQUFLLEtBQUc7QUFDL0Isc0JBQVMsT0FBTyxPQUFLO0FBQ3hCLGlCQUFDLENBQVEsUUFBTyxPQUN2QjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNPLCtCQUFTLFlBQWpCO0FBQ0ksYUFBVSxTQUFNO0FBQ2IsYUFBSyxLQUFLLEtBQVEsUUFBSyxPQUFHLENBQUcsR0FBRTtBQUN4QixzQkFBTyxLQUFLLEtBQU0sTUFDNUI7QUFBTSxnQkFBRTtBQUNFLHNCQUFPLEtBQUssS0FBTSxNQUM1QjtBQUFDO0FBQ0UsYUFBTyxPQUFPLFVBQU0sR0FBTyxPQUFLLEtBQUssS0FBTztBQUN6QyxnQkFDVjtBQUFDO0FBQ08sK0JBQVEsV0FBaEIsVUFBMEI7QUFDbkIsYUFBSyxLQUFXLFdBQU8sT0FBSyxLQUFLLEtBQVk7QUFDaEQsYUFBTyxNQUFTLE9BQUssS0FBTSxNQUFRO0FBQ2hDLGFBQUksTUFBSyxHQUFPLE9BQU07QUFDbkIsZ0JBQUssS0FBTyxPQUFLLEtBQU0sTUFDakM7QUFBQztBQUNPLCtCQUFRLFdBQWhCLFVBQTBCO0FBQ25CLGFBQUMsQ0FBSyxLQUFXLFdBQU8sT0FBTTtBQUMzQixnQkFBSyxLQUFLLEtBQ3BCO0FBQUM7QUFDTCxZQUFDO0FBQUE7QUFDUyx3QkFBUyxTQUFTLFNBQWUsZ0JBQUUsQ0FBTSxPQUFRLFFBQWEsYUFBYyxjQUFFO0FBQW9CLFlBQUMsSUFBdUI7QUFBRyxJOzs7Ozs7Ozs7Ozs7QUNsR3BGOztBQUduRDs7O0FBQUE7QUFrQlksY0FBTyxVQXdCbkI7QUFBQztBQXhDRywyQkFBVyxXQUFTO2NBQXBCO0FBQ08saUJBQVUsVUFBZSxrQkFBUyxNQUFPLE9BQVUsVUFBZ0I7QUFDN0QsdUJBQWU7QUFDZix3QkFBRSxlQUFjLE1BQU87QUFBVSw0QkFBQyxDQUFPO0FBQUM7QUFDdkMsMkJBQUUsa0JBQWMsTUFBTztBQUFVLDRCQUFFLENBQUMsQ0FBUTtBQUFDO0FBQ2hELHdCQUFFLGVBQWMsTUFBTztBQUFVLDRCQUFLLFFBQVc7QUFBQztBQUMvQywyQkFBRSxrQkFBYyxNQUFPO0FBQVUsNEJBQUssUUFBVztBQUFDO0FBQ2xELDJCQUFFLGtCQUFjLE1BQU87QUFBVSw0QkFBSyxRQUFRLEtBQVcsY0FBUSxLQUFRLFFBQU8sU0FBRyxDQUFJO0FBQUM7QUFDckYsOEJBQUUscUJBQWMsTUFBTztBQUFVLDRCQUFDLENBQUssUUFBSSxDQUFLLEtBQVcsY0FBUSxLQUFRLFFBQU8sVUFBSSxDQUFJO0FBQUM7QUFDL0YsMEJBQUUsaUJBQWMsTUFBTztBQUFVLDRCQUFLLE9BQVU7QUFBQztBQUNwRCx1QkFBRSxjQUFjLE1BQU87QUFBVSw0QkFBSyxPQUFVO0FBQUM7QUFDdkMsaUNBQUUsd0JBQWMsTUFBTztBQUFVLDRCQUFLLFFBQVc7QUFBQztBQUNyRCw4QkFBRSxxQkFBYyxNQUFPO0FBQVUsNEJBQUssUUFBVztBQUM5RDtBQVh5QjtBQVlyQixvQkFBVSxVQUNwQjtBQUFDOzt1QkFBQTs7QUFJRCwyQkFBVyxxQkFBUTtjQUFuQjtBQUFzQyxvQkFBSyxLQUFVO0FBQUM7Y0FDdEQsYUFBaUM7QUFDMUIsaUJBQUMsQ0FBTyxPQUFRO0FBQ2QscUJBQVEsTUFBZTtBQUN6QixpQkFBQyxDQUFVLFVBQVUsVUFBUSxRQUFRO0FBQ3BDLGtCQUFRLFVBQ2hCO0FBQUM7O3VCQU5xRDs7QUFPL0MseUJBQU8sVUFBZCxVQUErQixNQUFtQjtBQUFuQywyQkFBZ0I7QUFBaEIsb0JBQWdCOztBQUFFLDRCQUFpQjtBQUFqQixxQkFBaUI7O0FBQzNDLGFBQUMsQ0FBTSxNQUFLLE9BQU8sS0FBTTtBQUN6QixhQUFDLENBQU8sT0FBTSxRQUFPLEtBQU87QUFFekIsZ0JBQVUsVUFBVSxVQUFLLEtBQVUsVUFBSyxLQUFhLGFBQU0sT0FBTSxLQUFhLGFBQ3hGO0FBQUM7QUFDTyx5QkFBWSxlQUFwQixVQUE2QjtBQUN0QixhQUFDLENBQVEsT0FBQyxPQUFVLE9BQWMsVUFBTyxPQUFLO0FBQ2pELGFBQU8sTUFBTTtBQUNWLGFBQUksSUFBTyxTQUFRLE1BQUksSUFBRyxNQUFPLE9BQU8sSUFBRyxNQUFTLE1BQUssTUFBTSxJQUFPLE9BQUk7QUFDN0UsYUFBTyxNQUFNLElBQVE7QUFDbEIsYUFBSSxNQUFRLE1BQUksSUFBSSxNQUFLLE1BQU8sT0FBTyxJQUFJLE1BQUssTUFBUyxNQUFLLE1BQU0sSUFBTyxPQUFFLEdBQUssTUFBTTtBQUNyRixnQkFDVjtBQUFDO0FBeENNLGVBQWMsaUJBQTZCO0FBeUN0RCxZQUFDO0FBQ0Q7O0FBR0k7QUFGUSxjQUFlLGtCQUFpQjtBQUNqQyxjQUFRLFdBQ1E7QUFBQztBQUN4QiwyQkFBVyx5QkFBVTtjQUFyQjtBQUF3QyxvQkFBSyxLQUFrQjtBQUFDO2NBQ2hFLGFBQW1DO0FBQzVCLGlCQUFDLENBQU8sT0FBUTtBQUNkLHFCQUFRLE1BQWU7QUFDekIsaUJBQU0sU0FBTyxPQUFTLFNBQVMsTUFBTSxRQUFTO0FBQzlDLGlCQUFNLFNBQU8sT0FBUyxTQUFTLE1BQU0sUUFBUTtBQUM3QyxpQkFBTSxTQUFTLFNBQVMsU0FBUyxNQUFRO0FBQ3hDLGtCQUFnQixrQkFDeEI7QUFBQzs7dUJBUitEOztBQVNoRSwyQkFBVyx5QkFBTztjQUFsQjtBQUE2QixvQkFBSyxLQUFTLFNBQU8sVUFBTztBQUFDOzt1QkFBQTs7QUFDbkQsNkJBQUssUUFBWjtBQUNRLGNBQVMsV0FBTTtBQUNmLGNBQVcsYUFDbkI7QUFBQztBQUNMLFlBQUM7QUFDRDs7QUFLSSw4QkFBcUM7QUFDN0IsY0FBSyxPQUFHLElBQW9CO0FBQzVCLGNBQVcsYUFBYztBQUN6QixjQUFhLGVBQ3JCO0FBQUM7QUFDRCwyQkFBVywyQkFBVTtjQUFyQjtBQUF3QyxvQkFBSyxLQUFrQjtBQUFDO2NBQ2hFLGFBQW1DO0FBQzVCLGlCQUFLLEtBQVcsY0FBVSxPQUFRO0FBQ2pDLGtCQUFnQixrQkFBUztBQUNQLHNEQUFNLE1BQUssS0FBZ0IsaUJBQU0sS0FDM0Q7QUFBQzs7dUJBTCtEOztBQU16RCwrQkFBRyxNQUFWLFVBQWlDO0FBQ3pCLGNBQU8sU0FBVTtBQUNmLGdCQUFLLEtBQVEsUUFBSyxLQUM1QjtBQUFDO0FBQ08sK0JBQU8sVUFBZixVQUFtQztBQUMvQixhQUFlLGNBQU8sS0FBVyxjQUFVO0FBQ3ZDLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFTLFNBQU8sUUFBSyxLQUFHO0FBQzVDLGlCQUFPLE1BQU8sS0FBaUIsaUJBQUssS0FBUyxTQUFLO0FBQy9DLGlCQUFDLENBQUksT0FBZ0IsYUFBTyxPQUFPO0FBQ25DLGlCQUFJLE9BQUksQ0FBYSxhQUFPLE9BQ25DO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ08sK0JBQWdCLG1CQUF4QixVQUFtQztBQUM1QixhQUFDLENBQU8sT0FBTyxPQUFPO0FBQ3RCLGFBQU0sTUFBYSxhQUFPLE9BQUssS0FBUSxRQUFRO0FBQy9DLGFBQU0sTUFBUyxTQUFPLE9BQUssS0FBYSxhQUFRO0FBQzdDLGdCQUNWO0FBQUM7QUFDTywrQkFBWSxlQUFwQixVQUF5QztBQUNyQyxhQUFRLE9BQVksVUFBTTtBQUMxQixhQUFRLE9BQU8sS0FBYSxhQUFPO0FBQ2hDLGFBQU0sTUFBRTtBQUNKLGlCQUFDLENBQUssS0FBYSxhQUFTLFNBQUssTUFBTSxLQUFTLFNBQU8sT0FBTztBQUM3RCxvQkFBTyxLQUFhLGFBQVMsU0FBSyxNQUFNLEtBQ2hEO0FBQUM7QUFDRCxhQUFTLFFBQVksVUFBTztBQUN4QixnQkFBTyxLQUFhLGFBQVE7QUFDN0IsYUFBTSxNQUFFO0FBQ0osaUJBQUMsQ0FBSyxLQUFhLGFBQVMsU0FBSyxNQUFNLEtBQVMsU0FBTyxPQUFPO0FBQzVELHFCQUFPLEtBQWEsYUFBUyxTQUFLLE1BQU0sS0FDakQ7QUFBQztBQUNLLGdCQUFVLFVBQVEsUUFBSyxNQUNqQztBQUFDO0FBQ08sK0JBQVksZUFBcEIsVUFBbUM7QUFDNUIsYUFBQyxDQUFXLFdBQU8sT0FBTTtBQUN6QixhQUFDLE9BQWdCLGNBQWMsVUFBTyxPQUFNO0FBQzVDLGFBQVUsVUFBTyxTQUFJLEtBQWEsVUFBRyxNQUFPLE9BQWEsVUFBVSxVQUFPLFNBQUssTUFBUSxLQUFPLE9BQU07QUFDakcsZ0JBQVUsVUFBTyxPQUFFLEdBQVcsVUFBTyxTQUMvQztBQUFDO0FBQ0wsWUFBQztBQUFBLEs7Ozs7Ozs7Ozs7O0FDeEhEOzs7QUFBQSxpQ0F3TkEsQ0FBQztBQWpOVSxnQ0FBSyxRQUFaLFVBQXlCLE1BQXFCO0FBQ3RDLGNBQUssT0FBUTtBQUNiLGNBQUssT0FBUTtBQUNiLGNBQUssS0FBUztBQUNkLGNBQUcsS0FBSztBQUNSLGNBQU8sU0FBTyxLQUFLLEtBQVE7QUFDL0IsYUFBTyxNQUFPLEtBQWE7QUFDckIsZ0JBQ1Y7QUFBQztBQUNNLGdDQUFRLFdBQWYsVUFBbUM7QUFDM0IsY0FBSyxPQUFRO0FBQ1gsZ0JBQUssS0FBYSxhQUM1QjtBQUFDO0FBQ08sZ0NBQVksZUFBcEIsVUFBK0I7QUFDeEIsYUFBQyxDQUFPLE9BQU8sT0FBSTtBQUNuQixhQUFNLE1BQWEsYUFBTyxPQUFLLEtBQWEsYUFBUTtBQUNwRCxhQUFNLE1BQVMsU0FBTyxPQUFLLEtBQWtCLGtCQUFRO0FBQ2xELGdCQUNWO0FBQUM7QUFDTyxnQ0FBWSxlQUFwQixVQUF3QztBQUNqQyxhQUFLLEtBQVMsU0FBTyxPQUFJO0FBQzVCLGFBQU8sTUFBTTtBQUNULGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFTLFNBQU8sUUFBSyxLQUFHO0FBQzVDLGlCQUFZLFdBQU8sS0FBYSxhQUFLLEtBQVMsU0FBSztBQUNoRCxpQkFBVSxVQUFFO0FBQ1IscUJBQUssS0FBSSxPQUFPLE1BQU8sS0FBVyxhQUFPO0FBQ3pDLHdCQUNQO0FBQ0o7QUFBQztBQUNFLGFBQUssUUFBUSxLQUFLLFFBQVEsS0FBUyxTQUFPLFNBQUssR0FBRTtBQUM3QyxtQkFBTSxNQUFNLE1BQ25CO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ08sZ0NBQWlCLG9CQUF6QixVQUE4QztBQUN2QyxhQUFDLENBQVUsVUFBTSxTQUFJLENBQVUsVUFBVSxVQUFPLE9BQUk7QUFDdkQsYUFBUSxPQUFZLFVBQU07QUFDdkIsYUFBSyxRQUFJLENBQUssS0FBVSxVQUFPLE9BQUssT0FBTSxNQUFPLE9BQU87QUFDM0QsYUFBTyxNQUFPLE9BQU0sTUFBTyxLQUFrQixrQkFBVSxVQUFXO0FBQy9ELGFBQUssS0FBbUIsbUJBQVUsVUFBVyxXQUFPLE9BQUs7QUFDNUQsYUFBUyxRQUFZLFVBQU87QUFDekIsYUFBTSxTQUFJLENBQUssS0FBVSxVQUFRLFFBQU0sUUFBTSxNQUFRLFFBQU87QUFDekQsZ0JBQUksTUFBTSxNQUNwQjtBQUFDO0FBQ08sZ0NBQWlCLG9CQUF6QixVQUFvQztBQUM3QixhQUFHLE1BQVksU0FBTyxPQUFLO0FBQzNCLGFBQUcsTUFBZSxZQUFPLE9BQU07QUFDL0IsYUFBRyxNQUFjLFdBQU8sT0FBSztBQUM3QixhQUFHLE1BQVcsUUFBTyxPQUFLO0FBQzFCLGFBQUcsTUFBcUIsa0JBQU8sT0FBTTtBQUNyQyxhQUFHLE1BQWtCLGVBQU8sT0FBTTtBQUMvQixnQkFDVjtBQUFDO0FBQ08sZ0NBQVMsWUFBakIsVUFBK0I7QUFDM0IsYUFBTyxNQUFhLFdBQVE7QUFDekIsYUFBTSxNQUFNLE1BQU8sT0FBTztBQUN2QixnQkFBUyxTQUNuQjtBQUFDO0FBQ08sZ0NBQVMsWUFBakI7QUFDUSxjQUFLLE9BQU8sS0FBTTtBQUNsQixjQUFnQixrQkFBTTtBQUN0QixjQUFnQixnQkFBSyxLQUFLLEtBQU87QUFDckMsYUFBTyxNQUFPLEtBQWtCO0FBQzFCLGdCQUFJLE9BQVEsS0FBRyxNQUFRLEtBQ2pDO0FBQUM7QUFDTyxnQ0FBYyxpQkFBdEI7QUFDSSxhQUFPLE1BQU8sS0FBaUI7QUFDNUIsYUFBQyxDQUFLLEtBQU8sT0FBSztBQUNyQixhQUFjLGFBQU8sS0FBa0I7QUFDcEMsYUFBWSxZQUFFO0FBQ1Qsa0JBQWMsY0FBYTtBQUN6QixvQkFBSyxLQUNmO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ08sZ0NBQWEsZ0JBQXJCO0FBQ08sYUFBQyxDQUFLLEtBQWtCLGtCQUFPLE9BQU87QUFDekMsYUFBUSxPQUFPLEtBQWM7QUFDMUIsYUFBQyxDQUFNLE1BQU8sT0FBTztBQUN4QixhQUFNLEtBQU8sS0FBZ0I7QUFDMUIsYUFBQyxDQUFJLElBQU8sT0FBTztBQUN0QixhQUFLLElBQW1CO0FBQ3ZCLFdBQUssT0FBUTtBQUFFLFdBQVMsV0FBTTtBQUM1QixhQUFDLENBQUssS0FBbUIsbUJBQUssS0FBRTtBQUMvQixpQkFBUyxRQUFPLEtBQWM7QUFDM0IsaUJBQUMsQ0FBTyxPQUFPLE9BQU87QUFDeEIsZUFBTSxRQUNYO0FBQUM7QUFDRyxjQUFhLGFBQUk7QUFDZixnQkFDVjtBQUFDO0FBQ08sZ0NBQWMsaUJBQXRCO0FBQ1EsY0FBUTtBQUNULGFBQUssS0FBRyxNQUFRLEtBQU8sVUFBUSxLQUFHLE1BQVEsS0FBTyxPQUFNO0FBQ3RELGNBQU07QUFDTixjQUFrQjtBQUN0QixhQUFPLE1BQU8sS0FBa0I7QUFDN0IsYUFBSyxLQUFFO0FBQ0Ysa0JBQVE7QUFDVCxtQkFBTyxLQUFHLE1BQVE7QUFDakIsa0JBQU07QUFDTixrQkFDUjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNELDJCQUFZLDRCQUFFO2NBQWQ7QUFBaUMsb0JBQUssS0FBSyxLQUFPLE9BQUssS0FBTTtBQUFDOzt1QkFBQTs7QUFDdEQsZ0NBQUksT0FBWjtBQUNJLGdCQUFXLEtBQUcsS0FBTyxLQUFPLFVBQVEsS0FBUSxRQUFLLEtBQUk7QUFBTSxrQkFDL0Q7O0FBQUM7QUFDTyxnQ0FBTyxVQUFmLFVBQXlCO0FBQ2YsZ0JBQUUsS0FBTyxPQUFLLEtBQVEsUUFBSyxLQUFRLFFBQUssS0FDbEQ7QUFBQztBQUNPLGdDQUFRLFdBQWhCLFVBQTBCO0FBQ2hCLGdCQUFFLEtBQU8sT0FBSyxLQUN4QjtBQUFDO0FBQ08sZ0NBQWMsaUJBQXRCLFVBQWdDO0FBQ3RCLGdCQUFFLEtBQU8sT0FBSyxLQUFPLE9BQUssS0FBTyxPQUFLLEtBQ2hEO0FBQUM7QUFDTyxnQ0FBVSxhQUFsQixVQUE0QjtBQUNsQixnQkFBRSxLQUFPLE9BQUssS0FDeEI7QUFBQztBQUNPLGdDQUFVLGFBQWxCO0FBQ1EsY0FBUTtBQUNULGFBQUssS0FBRyxNQUFRLEtBQVEsUUFBTyxPQUFNO0FBQ3hDLGFBQVMsUUFBTyxLQUFJO0FBQ3BCLGFBQWEsWUFBTyxLQUFTLFNBQUssS0FBSztBQUNwQyxhQUFXLFdBQUssS0FBTTtBQUN6QixhQUFlLGNBQU8sS0FBZSxlQUFLLEtBQUs7QUFDL0MsZ0JBQVcsS0FBRyxLQUFPLEtBQU8sUUFBRztBQUN4QixpQkFBQyxDQUFVLGFBQVEsS0FBUSxRQUFLLEtBQUssS0FBTztBQUM1QyxpQkFBSyxLQUFTLFNBQUssS0FBSyxLQUFFO0FBQ3RCLHFCQUFXLFdBQUssS0FBTTtBQUU3QjtBQUFDO0FBQ0UsaUJBQUMsQ0FBVyxXQUFFO0FBQ1YscUJBQVksZUFBUSxLQUFlLGVBQUssS0FBSyxLQUFPO0FBQ3BELHFCQUFLLEtBQVcsV0FBSyxLQUFLLEtBQ2pDO0FBQUM7QUFDRyxrQkFDUjtBQUFDO0FBQ0UsYUFBSyxLQUFHLE1BQVUsT0FBTyxPQUFNO0FBQ2xDLGFBQU8sTUFBTyxLQUFLLEtBQU8sT0FBTSxPQUFNLEtBQUcsS0FBVTtBQUNoRCxhQUFLLEtBQUU7QUFDSCxpQkFBSSxJQUFPLFNBQUksS0FBUSxLQUFTLFNBQUksSUFBSyxLQUFFO0FBQzFDLHFCQUFPLE1BQU0sSUFBTyxTQUFLO0FBQ3RCLHFCQUFLLEtBQVMsU0FBSSxJQUFJLElBQU8sU0FBTyxLQUFPO0FBQzNDLHVCQUFNLElBQU8sT0FBRSxHQUN0QjtBQUNKO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ08sZ0NBQWtCLHFCQUExQixVQUFxQztBQUMzQixnQkFBRyxNQUFXLFdBQU0sTUFDOUI7QUFBQztBQUNPLGdDQUFZLGVBQXBCO0FBQ0ksYUFBTSxLQUFPLEtBQWM7QUFDeEIsYUFBQyxDQUFJLElBQU8sT0FBTTtBQUNuQixjQUFLLEdBQWU7QUFDbkIsYUFBRyxNQUFRLEtBQUcsS0FBYTtBQUMzQixhQUFHLE1BQVEsS0FBRyxLQUFVO0FBQ3hCLGFBQUcsTUFBUSxRQUFNLE1BQVMsTUFBRyxLQUFvQjtBQUNqRCxhQUFHLE1BQVEsUUFBTSxNQUFTLE1BQUcsS0FBaUI7QUFDOUMsYUFBRyxNQUFPLE9BQU0sTUFBUyxNQUFHLEtBQVc7QUFDdkMsYUFBRyxNQUFRLFFBQU0sTUFBUyxNQUFHLEtBQWM7QUFDM0MsYUFBRyxNQUFjLFdBQUcsS0FBYztBQUNsQyxhQUFHLE1BQWlCLGNBQUcsS0FBaUI7QUFDckMsZ0JBQ1Y7QUFBQztBQUNPLGdDQUFjLGlCQUF0QjtBQUNJLGFBQU8sTUFBTyxLQUFjO0FBQ3pCLGFBQUMsQ0FBSyxLQUFPLE9BQU07QUFDbkIsZUFBTSxJQUFlO0FBQ3JCLGFBQUksT0FBTyxPQUFPLE9BQVMsTUFBSSxNQUFTO0FBQ3hDLGFBQUksT0FBTyxPQUFPLE9BQVMsTUFBSSxNQUFRO0FBQ3ZDLGFBQUksT0FBUyxTQUFPLE9BQVMsTUFBSSxNQUFRO0FBQ3RDLGdCQUNWO0FBQUM7QUFDTyxnQ0FBYyxpQkFBdEI7QUFDSSxhQUFRLE9BQXVCO0FBQzNCLGNBQWdCLGdCQUFLLEtBQU87QUFDNUIsY0FBSyxPQUNiO0FBQUM7QUFDTyxnQ0FBYSxnQkFBckI7QUFDSSxhQUFRLE9BQU8sS0FBZ0IsZ0JBQU87QUFDbEMsY0FBSyxPQUFPLEtBQWdCLGdCQUFLLEtBQWdCLGdCQUFPLFNBQU07QUFDOUQsY0FBSyxLQUFTLFNBQUssS0FDM0I7QUFBQztBQUNPLGdDQUFZLGVBQXBCLFVBQWlDO0FBQ3pCLGNBQUssS0FBUyxTQUFLLEtBQzNCO0FBQUM7QUFDTyxnQ0FBYSxnQkFBckIsVUFBaUM7QUFDMUIsYUFBSyxLQUFLLEtBQVMsU0FBTyxTQUFLLEdBQUU7QUFDNUIsa0JBQUssS0FBVyxhQUN4QjtBQUFNLGdCQUFFO0FBQ0QsaUJBQUssS0FBSyxLQUFXLGNBQVEsS0FBRTtBQUM5QixxQkFBVSxTQUFPLEtBQUssS0FBWTtBQUNsQyxxQkFBZSxjQUFPLEtBQUssS0FBVTtBQUNqQyxzQkFBSyxLQUFTO0FBQ2Qsc0JBQUssS0FBVyxhQUFPO0FBQzNCLHFCQUFXLFVBQXVCO0FBQzNCLHlCQUFXLGFBQVU7QUFDckIseUJBQVMsV0FBZTtBQUMzQixzQkFBSyxLQUFTLFNBQUssS0FBVTtBQUNqQyxxQkFBVyxVQUF1QjtBQUM5QixzQkFBSyxLQUFTLFNBQUssS0FBVTtBQUM3QixzQkFBSyxPQUNiO0FBQ0o7QUFDSjtBQUFDO0FBQ0wsWUFBQztBQUFBLEs7Ozs7Ozs7Ozs7QUN2TkcsNkJBQWdCLENBQUM7QUFDViw0QkFBWSxlQUFuQixVQUFnQztBQUN6QixhQUFDLENBQU0sTUFBTyxPQUFNO0FBQ3ZCLGFBQU8sTUFBTTtBQUNULGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFPLFFBQUssS0FBRztBQUNuQyxpQkFBTSxLQUFPLEtBQUk7QUFDZCxpQkFBRyxNQUFPLE9BQU0sTUFBUSxLQUFPO0FBQy9CLG9CQUNQO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ00sNEJBQVEsV0FBZixVQUE0QixNQUF3QjtBQUNoRCxhQUFPLE1BQU8sS0FBYSxhQUFLLE1BQVU7QUFDcEMsZ0JBQUksSUFDZDtBQUFDO0FBQ00sNEJBQVEsV0FBZixVQUE0QixNQUF3QjtBQUNoRCxhQUFPLE1BQU8sS0FBYSxhQUFLLE1BQVU7QUFDcEMsZ0JBQUksSUFDZDtBQUFDO0FBQ08sNEJBQVksZUFBcEIsVUFBaUMsTUFBYTtBQUMxQyxhQUFPLE1BQUcsRUFBVSxVQUFPLE9BQU8sT0FBUztBQUMzQyxhQUFZLFdBQVU7QUFDbkIsYUFBQyxDQUFVLFVBQU8sT0FBSztBQUMxQixhQUFXLFVBQVE7QUFDbkIsZ0JBQVcsUUFBUSxLQUFPLFNBQUksR0FBRztBQUM3QixpQkFBVyxVQUFHLENBQVEsV0FBUSxLQUFHLE1BQVE7QUFDdEMsaUJBQUMsQ0FBUyxTQUFFO0FBQ1IscUJBQUMsQ0FBUyxTQUFLLE9BQU8sS0FBTyxPQUFJO0FBQ3BDLHFCQUFXLFVBQU8sS0FBYSxhQUFPO0FBQ25DLHFCQUFDLENBQVMsU0FBTyxPQUFLO0FBQ3RCLHFCQUFDLENBQVMsU0FBVSxVQUFPLE9BQUs7QUFDM0IsNEJBQVcsU0FBUztBQUN4Qix3QkFBTyxLQUFPLE9BQVEsUUFDOUI7QUFBTSxvQkFBRTtBQUNELHFCQUFDLENBQU0sTUFBUSxRQUFXLFdBQU8sT0FBSztBQUN6QyxxQkFBUyxRQUFLO0FBQ2QscUJBQU8sTUFBTTtBQUNiLHdCQUFZLFFBQU8sS0FBTyxVQUFRLEtBQU8sVUFBTyxLQUFHO0FBQzVDLDRCQUFRLEtBQVE7QUFFdkI7QUFBQztBQUNHLHdCQUFRLFFBQU8sS0FBTyxTQUFPLEtBQU8sT0FBTSxRQUFLLEtBQU07QUFDcEQseUJBQU8sS0FBWSxZQUFNO0FBQzNCLHFCQUFNLFFBQUksS0FBUyxTQUFZLFNBQVEsUUFBTyxPQUFLO0FBQzlDLDRCQUFXLFNBQ3ZCO0FBQUM7QUFDTSx1QkFDWDtBQUFDO0FBQ0UsYUFBTSxRQUFZO0FBQ2xCLGFBQVMsV0FBUTtBQUNkLGdCQUNWO0FBQUM7QUFDTyw0QkFBVyxjQUFuQixVQUE0QjtBQUNyQixhQUFJLE9BQVcsT0FBQyxDQUFJLE1BQUssS0FBSSxLQUFPLE1BQUksS0FBTyxHQUN4QyxPQUFPLE9BQU07QUFDakIsZ0JBQUMsQ0FDWDtBQUFDO0FBQ0wsWUFBQztBQUFBLEs7Ozs7Ozs7Ozs7O0FDNURzQzs7QUFDSjs7QUFDMkI7O0FBQ1o7O0FBQ007O0FBY3hEOzs7QUFBMEMscUNBQUk7QUFTMUMsbUNBQStCLE1BQXNCO0FBQXBCLDRCQUFvQjtBQUFwQixxQkFBb0I7O0FBQ2pELHFCQUFRO0FBRE8sY0FBSSxPQUFRO0FBUnZCLGNBQVksZUFBbUI7QUFHaEMsY0FBVSxhQUFrQjtBQUM1QixjQUFRLFdBQWtCO0FBQzFCLGNBQVEsV0FBYztBQUN0QixjQUFRLFdBQXFCO0FBQzVCLGNBQWEsZ0JBQVcsQ0FHaEM7QUFBQztBQUNNLG9DQUFPLFVBQWQ7QUFBeUIsZ0JBQXdCO0FBQUM7QUFDbEQsMkJBQVcsZ0NBQUs7Y0FBaEI7QUFBMkIsb0JBQUssS0FBVyxhQUFPLEtBQVcsYUFBTyxLQUFPO0FBQUM7Y0FDNUUsYUFBOEI7QUFBUSxrQkFBVyxhQUFVO0FBQUM7O3VCQURnQjs7QUFFNUUsMkJBQVcsZ0NBQU87Y0FBbEI7QUFBeUMsb0JBQUssS0FBZTtBQUFDO2NBTTlELGFBQXVDO0FBQzFCLDZCQUFRLFFBQUssS0FBYSxjQUN2QztBQUFDOzt1QkFSNkQ7O0FBQzlELDJCQUFXLGdDQUFRO2NBQW5CO0FBQXNDLG9CQUFLLEtBQWdCO0FBQUM7Y0FDNUQsYUFBaUM7QUFDMUIsaUJBQU0sUUFBRyxDQUFFLEtBQVMsUUFBSyxHQUFRO0FBQ2hDLGtCQUFjLGdCQUN0QjtBQUFDOzt1QkFKMkQ7O0FBUWhFLFlBQUM7QUFFRDs7QUFFSSxpQ0FBK0MsUUFBd0MsS0FBMkI7QUFBL0YsY0FBTSxTQUFzQjtBQUFTLGNBQUcsTUFBNEI7QUFDL0UsY0FBYyxnQkFBTyxLQUFlLGVBQUssS0FBSSxLQUFNLEtBQVM7QUFDNUQsY0FBYyxjQUFRLFFBQzlCO0FBQUM7QUFDRCwyQkFBVyw4QkFBUTtjQUFuQjtBQUF3QyxvQkFBSyxLQUFnQjtBQUFDOzt1QkFBQTs7QUFDOUQsMkJBQVcsOEJBQUs7Y0FBaEI7QUFBZ0Msb0JBQUssS0FBUyxTQUFRO0FBQUM7Y0FDdkQsYUFBMkI7QUFDbkIsa0JBQVMsU0FBTSxRQUN2QjtBQUFDOzt1QkFIc0Q7O0FBSTNELFlBQUM7QUFFRDs7QUFXSSx5Q0FBcUMsTUFBWTtBQVB6QyxjQUFTLFlBQXNCO0FBQy9CLGNBQVcsY0FBc0I7QUFDakMsY0FBYyxpQkFBa0I7QUFHakMsY0FBSyxRQUFpQztBQUdyQyxjQUFLLE9BQVE7QUFDYixjQUFNLFFBQVM7QUFDZixjQUFRLFVBQTZCLDJCQUFTO0FBQzlDLGNBQ1I7QUFBQztBQWRjLGdDQUFLLFFBQXBCO0FBQXVDLGdCQUFRLFVBQTZCLDJCQUFjO0FBQUM7QUFlM0YsMkJBQVcsc0NBQUU7Y0FBYjtBQUFnQyxvQkFBSyxLQUFVO0FBQUM7O3VCQUFBOztBQUNoRCwyQkFBVyxzQ0FBTztjQUFsQjtBQUE2QixvQkFBTztBQUFDOzt1QkFBQTs7QUFDckMsMkJBQVcsc0NBQUs7Y0FBaEI7QUFBMkIsb0JBQUssS0FBWTtBQUFDO2NBQzdDLGFBQTJCO0FBQ25CLGtCQUFlLGlCQUFRO0FBQ3ZCLGtCQUFVLFlBQU07QUFDakIsaUJBQU0sU0FBUyxNQUFFO0FBQ1osc0JBQUMsSUFBTyxPQUFVLE9BQUU7QUFDaEIsMEJBQVUsVUFBSyxPQUFRLE1BQy9CO0FBQ0o7QUFBQztBQUNHLGtCQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBTSxNQUFPLFFBQUssS0FBRztBQUNyQyxzQkFBTSxNQUFHLEdBQVMsU0FBcUIscUJBQUssS0FBUyxTQUFLLEtBQU0sTUFBRyxHQUFPLE9BQ2xGO0FBQUM7QUFDRyxrQkFBZSxpQkFDdkI7QUFBQzs7dUJBYjRDOztBQWN0QywwQ0FBUSxXQUFmLFVBQTRCO0FBQ2xCLGdCQUFLLEtBQVUsVUFDekI7QUFBQztBQUNNLDBDQUFRLFdBQWYsVUFBNEIsTUFBZTtBQUNwQyxhQUFLLEtBQWdCLGdCQUFRO0FBQzdCLGFBQVMsYUFBUSxJQUFTLFdBQVE7QUFDbEMsYUFBUyxZQUFTLE1BQUU7QUFDZixrQkFBVSxVQUFNLFFBQ3hCO0FBQU0sZ0JBQUU7QUFDSixvQkFBVyxLQUFVLFVBQ3pCO0FBQUM7QUFDRyxjQUFLLEtBQWEsYUFBSyxNQUFNLEtBQ3JDO0FBQUM7QUFDTSwwQ0FBVSxhQUFqQixVQUE4QjtBQUNwQixnQkFBSyxLQUFZLFlBQzNCO0FBQUM7QUFDTSwwQ0FBVSxhQUFqQixVQUE4QixNQUFrQjtBQUN4QyxjQUFZLFlBQU0sUUFDMUI7QUFBQztBQUNELDJCQUFXLHNDQUFPO2NBQWxCO0FBQ0ksaUJBQU8sTUFBTyxLQUFPO0FBQ2xCLGlCQUFDLENBQUssS0FBTyxPQUFNO0FBQ2xCLGtCQUFDLElBQU8sT0FBUTtBQUFPLHdCQUFPO2NBQzVCLE9BQ1Y7QUFBQzs7dUJBQUE7O0FBQ08sMENBQVUsYUFBbEI7QUFDSSxhQUFXLFVBQU8sS0FBSyxLQUFTO0FBQzVCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBVSxRQUFPLFFBQUssS0FBRztBQUN0QyxpQkFBVSxTQUFVLFFBQUk7QUFDcEIsa0JBQU0sTUFBSyxLQUFLLEtBQVcsV0FDbkM7QUFDSjtBQUFDO0FBQ1MsMENBQVUsYUFBcEIsVUFBaUQ7QUFDdkMsZ0JBQUMsSUFBc0IsbUJBQU8sUUFBTSxNQUFNLEtBQ3BEO0FBQUM7QUFsRWMsZ0NBQVMsWUFBYTtBQW1FekMsWUFBQztBQUVEOztBQUFxRCxnREFBUTtBQWF6RCw4Q0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFadkIsY0FBWSxlQUFtQztBQUMvQyxjQUFZLGVBQW1CO0FBRS9CLGNBQWEsZ0JBQVM7QUFFdEIsY0FBYSxnQkFBc0I7QUFDbkMsY0FBbUIsc0JBQWE7QUFDakMsY0FBYyxpQkFBYztBQUM1QixjQUFnQixtQkFNdkI7QUFBQztBQUNNLCtDQUFPLFVBQWQ7QUFDVSxnQkFDVjtBQUFDO0FBQ0QsMkJBQVcsMkNBQU87Y0FBbEI7QUFBMEQsb0JBQUssS0FBZTtBQUFDO2NBQy9FLGFBQXFEO0FBQzdDLGtCQUFhLGVBQVM7QUFDdEIsa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFKOEU7O0FBSy9FLDJCQUFXLDJDQUFRO2NBQW5CO0FBQXNDLG9CQUFLLEtBQWdCO0FBQUM7Y0FDNUQsYUFBb0M7QUFDN0IsaUJBQUssS0FBUyxZQUFhLFVBQVE7QUFDbEMsa0JBQWMsZ0JBQVk7QUFDMUIsa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFMMkQ7O0FBTTVELDJCQUFXLDJDQUFjO2NBQXpCO0FBQTRDLG9CQUFLLEtBQXNCO0FBQUM7Y0FDeEUsYUFBdUM7QUFDaEMsaUJBQU0sUUFBSSxLQUFTLFFBQUssR0FBUTtBQUMvQixrQkFBb0Isc0JBQVM7QUFDN0Isa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFMdUU7O0FBTWpFLCtDQUFjLGlCQUFyQixVQUFrRDtBQUM5QyxhQUFVLFNBQVMsT0FBTztBQUN2QixhQUFPLE9BQVcsY0FBUSxLQUFRLFFBQUU7QUFDbkMsaUJBQWUsY0FBTyxLQUFPLE9BQWM7QUFDeEMsaUJBQWEsYUFBWSxlQUFRO0FBQzlCLHNCQUFjLGNBQ3hCO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ00sK0NBQWMsaUJBQXJCLFVBQWtEO0FBQ3hDLGdCQUFPLE9BQVMsV0FBUyxPQUFTLFdBQU8sS0FDbkQ7QUFBQztBQUNELDJCQUFXLDJDQUFPO2NBQWxCO0FBQXlDLG9CQUFLLEtBQWU7QUFBQztjQUM5RCxhQUF1QztBQUMxQiw2QkFBUSxRQUFLLEtBQWEsY0FDdkM7QUFBQzs7dUJBSDZEOztBQUk5RCwyQkFBVywyQ0FBYztjQUF6QjtBQUFvQyxvQkFBTSxLQUFxQixtQkFBMUIsR0FBaUMsS0FBb0Isc0JBQXFCLGtDQUFVLFVBQW9CO0FBQUM7Y0FDOUksYUFBMEM7QUFBUSxrQkFBb0Isc0JBQWE7QUFBQzs7dUJBRDBEOztBQUV2SSwrQ0FBUyxZQUFoQixVQUE2QixNQUFzQjtBQUFwQiw0QkFBb0I7QUFBcEIscUJBQW9COztBQUMvQyxhQUFVLFNBQUcsSUFBd0IscUJBQUssTUFBUztBQUMvQyxjQUFhLGFBQUssS0FBUztBQUN6QixnQkFDVjtBQUFDO0FBRUQsMkJBQVcsMkNBQVc7Y0FBdEI7QUFDUSxrQkFBcUIsdUJBQU8sS0FBZ0I7QUFDMUMsb0JBQUssS0FDZjtBQUFDOzt1QkFBQTs7QUFDUywrQ0FBWSxlQUF0QjtBQUFvRSxnQkFBTztBQUFDO0FBQ2xFLCtDQUFlLGtCQUF6QixVQUFtQyxNQUFjLE1BQVk7QUFDbkQsZ0JBQ1Y7QUFBQztBQUNTLCtDQUFjLGlCQUF4QixVQUFzQztBQUFlLGdCQUFDLENBQVMsV0FBSyxLQUFhO0FBQUM7QUFDeEUsK0NBQVcsY0FBckIsVUFBcUQsS0FBb0IsZUFBeUI7QUFBdkIsNkJBQXVCO0FBQXZCLHNCQUF1Qjs7QUFDOUYsYUFBVSxTQUFnQixjQUFJLElBQVMsV0FBZ0IsY0FBSSxJQUFTLFdBQVE7QUFDekUsYUFBQyxDQUFPLFVBQVcsUUFBRTtBQUNkLHNCQUFNO0FBQ0MsMkJBQUksSUFBUyxXQUM5QjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNTLCtDQUFvQix1QkFBOUIsVUFBdUMsS0FDdkMsQ0FBQztBQUNTLCtDQUFjLGlCQUF4QjtBQUNPLGFBQUssS0FBZSxlQUFRO0FBQzNCLGNBQXFCLHFCQUFLLEtBQVE7QUFDcEMsYUFBRSxDQUFLLEtBQXNCLHdCQUFRLEtBQXFCLHFCQUFPLFVBQU0sR0FBUTtBQUM3RSxjQUFjLGdCQUFRO0FBQzFCLGFBQU8sTUFBTyxLQUFlLGVBQUssS0FBUTtBQUN0QyxjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBcUIscUJBQU8sUUFBSyxLQUFHO0FBQ3hELGlCQUFPLE1BQU8sS0FBcUIscUJBQUk7QUFDbkMsa0JBQXFCLHFCQUFHLEdBQU0sUUFBTyxLQUFZLFlBQUksS0FDN0Q7QUFBQztBQUNHLGNBQWMsZ0JBQ3RCO0FBQUM7QUFDRCwrQ0FBMEIsNkJBQTFCO0FBQ0ksYUFBUSxPQUFPLEtBQXNCO0FBQ2xDLGFBQUMsQ0FBTSxNQUFLLE9BQU8sS0FBYTtBQUNoQyxhQUFDLENBQU0sTUFBTyxPQUFNO0FBQ25CLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFPLFFBQUssS0FBRztBQUNuQyxpQkFBUyxRQUFPLEtBQXFCLHFCQUFHLEdBQU87QUFDNUMsaUJBQUMsQ0FBTyxPQUFVO0FBQ2pCLGtCQUFDLElBQVksV0FBSSxHQUFVLFdBQVEsTUFBTyxRQUFZLFlBQUc7QUFDekQscUJBQVksV0FBUSxNQUFVLFVBQVU7QUFDckMscUJBQWEsYUFBQyxDQUFTLFNBQTZCLGdDQUFJLENBQVMsU0FBUSxRQUFPLE9BQ3ZGO0FBQ0o7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDTSwrQ0FBUyxZQUFoQixVQUE2QztBQUE1QixtQ0FBNEI7QUFBNUIsNEJBQTRCOztBQUN6QyxhQUFrQixpQkFBTyxLQUFrQixrQkFBZTtBQUNwRCxnQkFBQyxPQUFLLFVBQVUscUJBQWMsaUJBQ3hDO0FBQUM7QUFDTywrQ0FBaUIsb0JBQXpCLFVBQStDO0FBQ3hDLGFBQUMsQ0FBSyxLQUFzQixzQkFBTyxPQUFPO0FBQzdDLGFBQU8sTUFBUztBQUNaLGNBQUMsSUFBWSxXQUFJLEdBQVUsV0FBTyxLQUFRLFFBQU8sUUFBWSxZQUFHO0FBQzVELGtCQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBcUIscUJBQU8sUUFBSyxLQUFHO0FBQ3hELHFCQUFTLFFBQU8sS0FBcUIscUJBQUcsR0FBTztBQUM1Qyx1QkFBUSxTQUFTLE1BQVUsYUFBUyxNQUFVLFVBQVMsWUFBUyxNQUFVLFVBQVMsU0FBVSxVQUFjLGlCQUNsSDtBQUNKO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ1MsK0NBQXNCLHlCQUFoQztBQUNJLGFBQVksV0FBTyxLQUFxQixxQkFBUTtBQUMxQyxnQkFBUyxXQUFXLFNBQVEsVUFBRyxPQUFLLFVBQXVCLDRCQUNyRTtBQUFDO0FBQ1MsK0NBQTJCLDhCQUFyQztBQUNJLGFBQVksV0FBTyxLQUFxQixxQkFBTztBQUN6QyxnQkFBUyxXQUFXLFNBQVEsVUFBRyxPQUFLLFVBQTRCLGlDQUMxRTtBQUFDO0FBQ1MsK0NBQW9CLHVCQUE5QixVQUErQztBQUN4QyxhQUFDLENBQUssS0FBc0Isc0JBQU8sT0FBTTtBQUN4QyxjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBcUIscUJBQU8sUUFBSyxLQUFHO0FBQ3hELGlCQUFTLFFBQU8sS0FBcUIscUJBQUcsR0FBTztBQUMzQyxrQkFBQyxJQUFZLFdBQUksR0FBVSxXQUFPLEtBQVEsUUFBTyxRQUFZLFlBQUc7QUFDN0QscUJBQUMsQ0FBUyxTQUFPLE9BQU0sTUFBVSxVQUFVO0FBQzNDLHFCQUFNLE1BQVUsVUFBUyxTQUFrQixvQkFBSyxHQUFPLE9BQU0sTUFBVSxVQUM5RTtBQUNKO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ29CO0FBQ2QsK0NBQWMsaUJBQXJCLFVBQXFELEtBQThCO0FBQy9FLGFBQVksV0FBTyxLQUFtQixtQkFBSSxLQUFVO0FBQzVDLGtCQUFLLE9BQVMsT0FBTTtBQUNwQixrQkFBVyxhQUFTLE9BQVk7QUFDaEMsa0JBQVMsV0FBUyxPQUFVO0FBQ2pDLGFBQU8sT0FBVSxVQUFFO0FBQ2YsaUJBQXdDLDZEQUFFO0FBQ1gsMEJBQXFCLHVCQUN2RDtBQUNKO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ1MsK0NBQWtCLHFCQUE1QixVQUE0RCxLQUE4QjtBQUN0RixhQUFZLFdBQVMsT0FBUyxZQUFhLFlBQU8sS0FBUyxXQUFTLE9BQVU7QUFDOUUsYUFBUSxPQUFPLEtBQWdCLGdCQUFJLEtBQVU7QUFDMUMsYUFBUyxZQUFlLFlBQU8sT0FBSyxLQUFlLGVBQUssTUFBVTtBQUNsRSxhQUFTLFlBQWlCLGNBQU8sT0FBSyxLQUFpQixpQkFBSyxNQUFVO0FBQ3RFLGFBQVMsWUFBVyxRQUFPLE9BQUssS0FBVyxXQUFLLE1BQVU7QUFDMUQsYUFBUyxZQUFjLFdBQU8sT0FBSyxLQUFjLGNBQUssTUFBVTtBQUM3RCxnQkFBSyxLQUFlLGVBQUssTUFDbkM7QUFBQztBQUNTLCtDQUFlLGtCQUF6QixVQUF5RCxLQUE4QjtBQUFrQixnQkFBSSxJQUFRLFVBQU0sTUFBUyxPQUFPO0FBQUM7QUFDbEksK0NBQWdCLG1CQUExQixVQUF1RDtBQUM3QyxnQkFBTyxPQUFRLFdBQVUsT0FBUSxRQUFPLFNBQUksSUFBUyxPQUFRLFVBQU8sS0FDOUU7QUFBQztBQUNTLCtDQUF1QiwwQkFBakMsVUFBOEQ7QUFDcEQsZ0JBQU8sT0FBZSxpQkFBUyxPQUFlLGlCQUFPLEtBQy9EO0FBQUM7QUFDUywrQ0FBYyxpQkFBeEIsVUFBcUMsTUFBOEI7QUFDL0QsYUFBSyxJQUE4QixLQUFtQixtQkFBVyxZQUFRO0FBQ3hFLFdBQVEsVUFBTyxLQUFpQixpQkFBUztBQUN6QyxXQUFlLGlCQUFPLEtBQXdCLHdCQUFTO0FBQ2xELGdCQUNWO0FBQUM7QUFDUywrQ0FBYyxpQkFBeEIsVUFBcUMsTUFBOEI7QUFDL0QsYUFBSyxJQUE4QixLQUFtQixtQkFBVyxZQUFRO0FBQ3hFLFdBQVEsVUFBTyxLQUFpQixpQkFBUztBQUN6QyxXQUFTLFdBQVMsT0FBUyxXQUFHLENBQUcsSUFBUyxPQUFTLFdBQU8sS0FBZ0I7QUFDckUsZ0JBQ1Y7QUFBQztBQUNTLCtDQUFnQixtQkFBMUIsVUFBdUMsTUFBOEI7QUFDakUsYUFBSyxJQUFnQyxLQUFtQixtQkFBYSxjQUFRO0FBQzVFLFdBQVEsVUFBTyxLQUFpQixpQkFBUztBQUN6QyxXQUFTLFdBQVMsT0FBUyxXQUFHLENBQUcsSUFBUyxPQUFTLFdBQU8sS0FBZ0I7QUFDckUsZ0JBQ1Y7QUFBQztBQUNTLCtDQUFVLGFBQXBCLFVBQWlDLE1BQThCO0FBQ3JELGdCQUF3QixLQUFtQixtQkFBTyxRQUM1RDtBQUFDO0FBQ1MsK0NBQWEsZ0JBQXZCLFVBQW9DLE1BQThCO0FBQ3hELGdCQUEyQixLQUFtQixtQkFBVSxXQUNsRTtBQUFDO0FBQ1MsK0NBQWtCLHFCQUE1QixVQUFpRCxjQUFjO0FBQ3JELGdCQUEwQixpQ0FBUyxTQUFlLGVBQWEsY0FDekU7QUFBQztBQUNTLCtDQUFjLGlCQUF4QixVQUFzQyxVQUFpQztBQUNuRSxnQkFBZSxTQUFJLElBQVU7QUFDdkIsZ0JBQU8sT0FBSyxLQUFVLFVBQU8sVUFBSyxJQUFPLE9BQ25EO0FBQUM7QUFDRCwrQ0FBWSxlQUFaLFVBQTRDLEtBQWtCO0FBQzFELGFBQVksV0FBTyxLQUFlLGVBQUssS0FBUTtBQUMvQyxhQUFZLFdBQU8sS0FBWSxZQUFJLEtBQVUsVUFBUTtBQUNqRCxjQUFDLElBQU8sT0FBYTtBQUFDLG9CQUFlLFNBQU07VUFDNUMsSUFBYSxhQUFFO0FBQ0gsMkJBQU8sS0FBTSxNQUFLLEtBQVUsVUFBZTtBQUNsRCxrQkFBQyxJQUFPLE9BQWdCO0FBQVMsMEJBQUssT0FBYyxZQUM1RDs7QUFBQztBQUNFLGFBQU8sT0FBSyxLQUFVLFVBQU8sVUFBTSxHQUFFO0FBQzVCLHdCQUFPLEtBQWUsZUFBUyxVQUMzQztBQUFDO0FBQ0csY0FBYyxnQkFBUTtBQUN0QixjQUFZLFlBQVc7QUFDdkIsY0FBYyxnQkFDdEI7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQVMsU0FBdUIseUJBQVMsVUFBUSxNQUFTLFNBQVksWUFBRSxvQkFBa0I7QUFBVSxnQkFBSSxJQUFhO0FBQUcsTUFBN0UsRUFBVCxJQUN2QyxNQUFzQixzQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFVLGdCQUFRLFFBQUksSUFBVztBQUFDLE1BQXhHLEVBQW9ILFlBQUUsb0JBQWtCLEtBQVk7QUFBTyxhQUFRLFVBQVU7QUFBRSxVQUMvSixrQkFBRSxFQUFNLE1BQVksWUFBUyxTQUFXLFdBQVMsU0FBRSxDQUFVLFdBQVksWUFBWSxZQUFjLGNBQVEsUUFBYyxjQUN6SSxFQUFNLE1BQVksWUFBUyxTQUFFLENBQUUsR0FBUyxTQUFFLENBQUMsQ0FBRSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQU0sTUFBc0Isc0JBQW9CLG9CQUFhLGFBQzFIO0FBQW9CLFlBQUMsSUFBd0IscUJBQU07QUFBRztBQUVoRCx3QkFBUyxTQUFTLFNBQXFCLHVCQUFHLEVBQU0sTUFBaUMsaUNBQVcsV0FBMEIsMEJBQzlGLDhCQUNwQixNQUFzQixzQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFVLGdCQUFRLFFBQUksSUFBVztBQUFDLE1BQXhHLEVBQW9ILFlBQUUsb0JBQWtCLEtBQVk7QUFBTyxhQUFRLFVBQVU7QUFBRSxRQUZwSSxJQUdyQyxNQUFrQixrQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFJLElBQXNCO0FBQUcsTUFBL0YsSUFDQSxFQUFNLE1BQVksWUFBUyxTQUFZLFlBQVMsU0FBRSxDQUFXLFlBQVksWUFBYyxjQUFRLFFBQWMsY0FDN0csRUFBTSxNQUFrQixrQkFBUyxTQUFHLEdBQVMsU0FBRSxDQUFFLEdBQUcsR0FBRyxHQUFHLEdBQU0sTUFBbUIsbUJBQ3ZGO0FBQW9CLFlBQUMsSUFBbUMsZ0NBQU07QUFBQyxJQUFjLFk7Ozs7Ozs7Ozs7OztBQ25XMUM7O0FBQ0k7O0FBQ007O0FBQ0M7O0FBQ1A7O0FBQ2tDOztBQUc3RTs7O0FBQThCLHlCQUFZO0FBZ0J0Qyx1QkFBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFmdkIsY0FBVSxhQUFnQjtBQUcxQixjQUFlLGtCQUFrQjtBQUNqQyxjQUFlLGtCQUFrQjtBQUNqQyxjQUFhLGdCQUFrQjtBQUMvQixjQUFnQixtQkFBYztBQUV0QyxjQUFNLFNBQTBCO0FBQ2hDLGNBQVUsYUFBMkIsSUFBNkI7QUE4SjFELGNBQXNCLHlCQUFTO0FBdEp0QztBQUNELDJCQUFXLG9CQUFRO2NBQW5CO0FBQXVDLG9CQUFPO0FBQUM7O3VCQUFBOztBQUMvQywyQkFBVyxvQkFBUTtjQUFuQjtBQUF1QyxvQkFBTztBQUFDOzt1QkFBQTs7QUFDL0MsMkJBQVcsb0JBQU87Y0FBbEI7QUFBcUMsb0JBQUssS0FBRyxLQUFRO0FBQUM7O3VCQUFBOztBQUN0RCwyQkFBVyxvQkFBSztjQUFoQjtBQUFtQyxvQkFBTSxLQUFZLFVBQWpCLEdBQXdCLEtBQVcsYUFBTyxLQUFPO0FBQUM7Y0FDdEYsYUFBaUM7QUFDekIsa0JBQVcsYUFBWTtBQUN2QixrQkFBYSxhQUFLLEtBQzFCO0FBQUM7O3VCQUpxRjs7QUFLdEYsMkJBQVcsb0JBQWM7Y0FBekI7QUFBb0Msb0JBQUssS0FBTyxVQUFRLE9BQU8sS0FBTyxPQUFZLFlBQUssS0FBTyxTQUFPLEtBQVE7QUFBQzs7dUJBQUE7O0FBQzlHLDJCQUFXLG9CQUFTO2NBQXBCO0FBQ08saUJBQUssS0FBTyxVQUFRLEtBQU8sT0FBdUIsdUJBQUU7QUFDaEQscUJBQUMsQ0FBSyxLQUFrQixrQkFBRTtBQUN6Qix5QkFBUSxPQUFRO0FBQ1osMEJBQWlCLG1CQUEwQjtBQUMzQywwQkFBaUIsaUJBQVcsYUFBRyxVQUFzQjtBQUFVLGdDQUFLLEtBQXVCLHVCQUFLLEtBQWlCO0FBQUU7QUFDbkgsMEJBQWlCLGlCQUFVLFlBQUcsVUFBc0I7QUFBVSxnQ0FBSyxLQUFzQixzQkFBUTtBQUN6RztBQUFDO0FBQ0ssd0JBQUssS0FBaUIsaUJBQVEsUUFBSyxLQUFPLE9BQ3BEO0FBQUM7QUFDRCxpQkFBZSxjQUFPLEtBQWM7QUFDakMsaUJBQWEsYUFBWSxlQUFRO0FBQ3BDLGlCQUFNLEtBQU8sS0FBSTtBQUNkLGlCQUFJLElBQUcsTUFBUztBQUNiLG9CQUFHLEtBQWMsY0FBTyxLQUNsQztBQUFDOzt1QkFBQTs7QUFDTSx3QkFBSyxRQUFaLFVBQXFDO0FBQXhCLDhCQUF3QjtBQUF4Qix1QkFBd0I7O0FBQ3BCLDZCQUFtQixtQkFBSyxLQUFLO0FBQzFDLGFBQU0sS0FBRyxDQUFRLFVBQU8sS0FBeUIsMkJBQU8sS0FBK0I7QUFDcEYsYUFBYyxvQkFBYSxhQUFLLEtBQUU7QUFDN0Isa0JBQWEsYUFBSyxLQUMxQjtBQUNKO0FBQUM7QUFDUyx3QkFBc0IseUJBQWhDO0FBQ1UsZ0JBQUssS0FDZjtBQUFDO0FBQ1Msd0JBQTJCLDhCQUFyQztBQUNVLGdCQUFLLEtBQ2Y7QUFBQztBQUNTLHdCQUFzQix5QkFBaEMsVUFBNkM7QUFDbkMsZ0JBQUssUUFBUSxRQUFRLFFBQVcsV0FBUSxRQUNsRDtBQUFDO0FBQ1Msd0JBQXFCLHdCQUEvQixVQUE0QztBQUNyQyxhQUFLLFFBQVMsTUFBTyxPQUFLLEtBQUk7QUFDOUIsYUFBSyxRQUFZLFNBQU8sT0FBSyxLQUFnQjtBQUM3QyxhQUFLLFFBQWMsV0FBTyxPQUFLLEtBQWM7QUFDMUMsZ0JBQ1Y7QUFBQztBQUNNLHdCQUFjLGlCQUFyQjtBQUF5QyxnQkFBUTtBQUFDO0FBQzNDLHdCQUFZLGVBQW5CO0FBQXVDLGdCQUFRO0FBQUM7QUFDaEQsMkJBQVcsb0JBQVU7Y0FBckI7QUFBeUMsb0JBQUssS0FBa0I7QUFBQztjQUNqRSxhQUFrQztBQUMzQixpQkFBSyxLQUFXLGNBQVEsS0FBUTtBQUMvQixrQkFBZ0Isa0JBQU87QUFDdkIsa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFMZ0U7O0FBTWpFLDJCQUFXLG9CQUFVO2NBQXJCO0FBQXlDLG9CQUFLLEtBQWtCO0FBQUM7Y0FDakUsYUFBa0M7QUFDM0IsaUJBQUMsQ0FBSyxLQUFrQixrQkFBUTtBQUMvQixrQkFBZ0Isa0JBQU87QUFDeEIsaUJBQUssS0FBWSxZQUFLLEtBQVMsV0FDdEM7QUFBQzs7dUJBTGdFOztBQU1qRSwyQkFBVyxvQkFBVztjQUF0QjtBQUF5QyxvQkFBSyxLQUFpQixtQkFBTyxLQUFpQixtQkFBcUIsa0NBQVUsVUFBbUI7QUFBQztjQUMxSSxhQUFvQztBQUM1QixrQkFBaUIsbUJBQ3pCO0FBQUM7O3VCQUh5STs7QUFJMUksMkJBQVcsb0JBQVE7Y0FBbkI7QUFBdUMsb0JBQUssS0FBZ0I7QUFBQztjQUM3RCxhQUFnQztBQUN6QixpQkFBQyxDQUFLLEtBQWUsa0JBQVEsS0FBUyxZQUFRLEtBQVE7QUFDckQsa0JBQWMsZ0JBQU87QUFDdEIsaUJBQUssS0FBVSxVQUFLLEtBQVcsYUFBUztBQUN2QyxrQkFDUjtBQUFDOzt1QkFONEQ7O0FBT25ELHdCQUFlLGtCQUF6QixZQUE4QixDQUFDO0FBQy9CLDJCQUFjLG9CQUFFO2NBQWhCO0FBQ08saUJBQUssS0FBYSxlQUFLLEdBQU8sT0FBSTtBQUNyQyxpQkFBYyxhQUFLO0FBQ25CLGlCQUFhLFlBQVE7QUFDckIsaUJBQU8sTUFBTTtBQUNWLGlCQUFLLEtBQU8sVUFBUSxLQUFPLE9BQW9CLG9CQUFFO0FBQzdDLHVCQUFPLEtBQU8sT0FBb0I7QUFDbEMscUJBQVMsU0FBTSxNQUFXLGFBQVcsU0FDcEMsVUFBSSxJQUFJLElBQU8sVUFBTSxHQUFVLFlBQ3ZDO0FBQUM7QUFDRSxpQkFBVyxXQUFPLE9BQUMsQ0FBSyxLQUFhLGVBQWMsWUFBWTtBQUM1RCxvQkFBTyxPQUFhLGFBQUksSUFBVyxXQUFHLEtBQU8sS0FDdkQ7QUFBQzs7dUJBQUE7O0FBQ1Msd0JBQVMsWUFBbkI7QUFDSSxnQkFBSyxVQUFVLGVBQUc7QUFDZCxjQUFxQixxQkFBSyxLQUNsQztBQUFDO0FBQ0QsMkJBQVcsb0JBQUs7Y0FBaEI7QUFDVSxvQkFBSyxLQUFjLGNBQUssS0FDbEM7QUFBQztjQUNELGFBQThCO0FBQ3RCLGtCQUFZLFlBQVc7QUFDdkIsa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFKQTs7QUFLRCwyQkFBVyxvQkFBTztjQUFsQjtBQUFxQyxvQkFBSyxLQUFlO0FBQUM7Y0FDMUQsYUFBbUM7QUFDNUIsaUJBQUssS0FBUSxXQUFhLFVBQVE7QUFDakMsa0JBQVcsV0FBVztBQUN0QixrQkFBYSxhQUFLLEtBQzFCO0FBQUM7O3VCQUx5RDs7QUFNaEQsd0JBQVUsYUFBcEI7QUFBdUMsZ0JBQUssS0FBSyxRQUFRLE9BQU8sS0FBSyxLQUFXLFdBQUssS0FBTSxRQUFPLEtBQWtCO0FBQUM7QUFDM0csd0JBQVUsYUFBcEIsVUFBcUM7QUFDN0IsY0FBYyxjQUN0QjtBQUFDO0FBQ00sd0JBQU8sVUFBZDtBQUFrQyxnQkFBSyxLQUFNLFNBQVU7QUFBQztBQUNqRCx3QkFBUyxZQUFoQixVQUE2QztBQUE1QixtQ0FBNEI7QUFBNUIsNEJBQTRCOztBQUNyQyxjQUFlLGVBQWU7QUFDNUIsZ0JBQUssS0FBTyxPQUFPLFNBQzdCO0FBQUM7QUFDRCwyQkFBVyxvQkFBaUI7Y0FBNUI7QUFBK0Msb0JBQUssS0FBTyxPQUFTO0FBQUM7O3VCQUFBOztBQUNyRSwyQkFBVyxvQkFBWTtjQUF2QjtBQUEwQyxvQkFBSyxLQUFPLFVBQVEsUUFBUSxLQUFXLGFBQU8sS0FBTyxPQUFhLGVBQU87QUFBQzs7dUJBQUE7O0FBQzdHLHdCQUFRLFdBQWYsVUFBa0M7QUFDMUIsY0FBTyxPQUFLLEtBQVE7QUFDcEIsY0FBYSxhQUFLLEtBQzFCO0FBQUM7QUFDTyx3QkFBYyxpQkFBdEIsVUFBNEM7QUFDeEMsYUFBZSxjQUFPLEtBQU8sU0FBTyxLQUFPLE9BQU8sU0FBSztBQUNuRCxjQUFPLFNBQU07QUFDYixjQUFpQixpQkFBSyxLQUFTO0FBQ2hDLGFBQUssS0FBTyxPQUFPLFVBQUssS0FBUSxLQUFPLE9BQUU7QUFDeEMsaUJBQVMsUUFBTyxLQUFpQjtBQUM5QixpQkFBTyxPQUFFO0FBQ0osc0JBQU8sT0FBSyxLQUNwQjtBQUNKO0FBQUM7QUFDRSxhQUFLLEtBQU8sVUFBUSxLQUFPLE9BQU8sVUFBTSxHQUFFO0FBQ3pDLGlCQUFTLFFBQU8sS0FBTyxPQUFpQixpQkFBSyxLQUFPO0FBQ2pELGlCQUFPLE9BQUU7QUFDSixzQkFBTyxPQUFLLEtBQ3BCO0FBQ0o7QUFBQztBQUNFLGFBQWlCLGlCQUFZLGVBQVEsS0FBTyxPQUFPLFVBQWUsY0FBTSxJQUFFO0FBQ3JFLGtCQUFhLGFBQUssS0FDMUI7QUFDSjtBQUFDO0FBQ1Msd0JBQWdCLG1CQUExQixVQUFxRDtBQUM5QyxhQUFLLEtBQW9CLG9CQUFFO0FBQ3RCLGtCQUFPLE9BQUssS0FDcEI7QUFDSjtBQUFDO0FBQ1Msd0JBQWdCLG1CQUExQjtBQUNVLGdCQUFLLEtBQVcsY0FBUSxLQUNsQztBQUFDO0FBQ1Msd0JBQWEsZ0JBQXZCO0FBQ1UsZ0JBQXNCLGlDQUFJLElBQ3BDO0FBQUM7QUFFUyx3QkFBVyxjQUFyQixVQUFtQztBQUMzQixjQUFrQixrQkFBVztBQUM3QixjQUNSO0FBQUM7QUFDUyx3QkFBaUIsb0JBQTNCLFVBQXlDO0FBQ2xDLGFBQUMsQ0FBSyxLQUF3Qix3QkFBRTtBQUN2Qix3QkFBTyxLQUFZLFlBQVc7QUFDbEMsa0JBQWEsYUFDckI7QUFDSjtBQUFDO0FBQ08sd0JBQVksZUFBcEI7QUFDVSxnQkFBSyxLQUFLLFFBQVEsT0FBTyxLQUFLLEtBQVMsU0FBSyxLQUFNLFFBQU8sS0FDbkU7QUFBQztBQUNPLHdCQUFZLGVBQXBCLFVBQWtDO0FBQzNCLGFBQUssS0FBSyxRQUFTLE1BQUU7QUFDaEIsa0JBQUssS0FBUyxTQUFLLEtBQUssTUFDaEM7QUFBTSxnQkFBRTtBQUNBLGtCQUFjLGdCQUN0QjtBQUNKO0FBQUM7QUFDUyx3QkFBYSxnQkFBdkIsVUFBZ0M7QUFBZSxnQkFBTTtBQUFDO0FBQzVDLHdCQUFXLGNBQXJCLFVBQThCO0FBQWUsZ0JBQU07QUFBQztBQUMxQyx3QkFBYyxpQkFBeEIsWUFBNkIsQ0FBQztBQUNwQix3QkFBYSxnQkFBdkIsVUFBd0M7QUFDakMsYUFBSyxLQUFLLFFBQVMsTUFBRTtBQUNoQixrQkFBSyxLQUFXLFdBQUssS0FBSyxNQUNsQztBQUFNLGdCQUFLLEtBQWdCLGtCQUMvQjtBQUFDO0FBQ1U7QUFDWCx3QkFBb0IsdUJBQXBCLFVBQWtDO0FBQzFCLGNBQXVCLHlCQUFRO0FBQy9CLGNBQU0sUUFBTyxLQUFjLGNBQVc7QUFDdEMsY0FBYSxhQUFLLEtBQXlCO0FBQzNDLGNBQXVCLHlCQUMvQjtBQUFDO0FBQ2dCO0FBQ2pCLHdCQUFpQixvQkFBakI7QUFBb0MsZ0JBQU87QUFBQztBQUNoRCxZQUFDO0FBQUE7QUFDUyx3QkFBUyxTQUFTLFNBQVcsZUFBUyxNQUFjLGNBQVksWUFBRSxvQkFBa0I7QUFBVSxnQkFBSSxJQUFhO0FBQUcsTUFBbEYsRUFBRCxJQUMvQixNQUFlLGVBQVksWUFBRSxvQkFBa0I7QUFBVSxnQkFBSSxJQUFtQjtBQUFHLE1BQXpGLElBQ29CLHNCQUFFLEVBQU0sTUFBeUIseUJBQWUsZUFBbUIsbUJBQWUsZUFBZSxnQkFBTSxNQUFrQixnQjs7Ozs7Ozs7Ozs7O0FDek54RDs7QUFDbEQ7O0FBR3ZDOzs7QUFBa0MsNkJBQUk7QUF1QmxDLDJCQUErQjtBQUMzQixxQkFBUTtBQURPLGNBQUksT0FBUTtBQWhCdkIsY0FBZSxrQkFBeUI7QUFDekMsY0FBUyxZQUFjO0FBRXRCLGNBQVksZUFBaUI7QUFDOUIsY0FBZ0IsbUJBQWlCO0FBQ2hDLGNBQWlCLG9CQUFXLENBQUc7QUFDaEMsY0FBSyxRQUFjO0FBQ2xCLGNBQWdCLG1CQUFjO0FBQzlCLGNBQWdCLG1CQUFhO0FBQzlCLGNBQU0sU0FBYTtBQVNsQixjQUFRLFVBQWUsYUFBaUI7QUFDeEMsY0FDUjtBQUFDO0FBekJjLGtCQUFhLGdCQUE1QjtBQUNVLGdCQUFNLFFBQWUsYUFDL0I7QUFBQztBQXdCRCwyQkFBVyx3QkFBTztjQUFsQjtBQUFzQyxvQkFBSyxLQUFlO0FBQUM7Y0FDM0QsYUFBK0I7QUFDeEIsaUJBQUksT0FBUSxLQUFTLFNBQVE7QUFDNUIsa0JBQWEsZUFBTztBQUNwQixrQkFBYSxhQUFLLEtBQTRCO0FBQzlDLGtCQUFhLGFBQUssS0FBK0I7QUFDbEQsaUJBQUssS0FBUSxRQUFFO0FBQ1Ysc0JBQU8sT0FBMEIsMEJBQWdCLE1BQU0sS0FDL0Q7QUFDSjtBQUFDOzt1QkFUMEQ7O0FBVTNELDJCQUFXLHdCQUFZO2NBQXZCO0FBQTBDLG9CQUFLLEtBQW9CO0FBQUM7O3VCQUFBOztBQUM3RCw0QkFBUyxZQUFoQixVQUE2QztBQUE1QixtQ0FBNEI7QUFBNUIsNEJBQTRCOztBQUFtQixnQkFBUTtBQUFDO0FBQ3pFLDJCQUFXLHdCQUFpQjtjQUE1QjtBQUErQyxvQkFBSTtBQUFDOzt1QkFBQTs7QUFDcEQsMkJBQVcsd0JBQVE7Y0FBbkI7QUFBdUMsb0JBQVE7QUFBQzs7dUJBQUE7O0FBQ2hELDJCQUFXLHdCQUFRO2NBQW5CO0FBQXVDLG9CQUFRO0FBQUM7O3VCQUFBOztBQUNoRCwyQkFBVyx3QkFBVTtjQUFyQjtBQUF5QyxvQkFBUTtBQUFDOzt1QkFBQTs7QUFDbEQsMkJBQVcsd0JBQUU7Y0FBYjtBQUFnQyxvQkFBSyxLQUFVO0FBQUM7O3VCQUFBOztBQUNoRCwyQkFBVyx3QkFBVztjQUF0QjtBQUF5QyxvQkFBSyxLQUFtQjtBQUFDO2NBQ2xFLGFBQWtDO0FBQzNCLGlCQUFJLE9BQVEsS0FBYSxhQUFRO0FBQ2hDLGtCQUFpQixtQkFBTztBQUN4QixrQkFBYSxhQUFLLEtBQzFCO0FBQUM7O3VCQUxpRTs7QUFNbEUsMkJBQVcsd0JBQVc7Y0FBdEI7QUFBeUMsb0JBQUssS0FBbUI7QUFBQztjQUNsRSxhQUFrQztBQUMzQixpQkFBSSxPQUFRLEtBQWEsYUFBUTtBQUNoQyxrQkFBaUIsbUJBQU87QUFDeEIsa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFMaUU7O0FBTTNELDRCQUFLLFFBQVosVUFBcUM7QUFBeEIsOEJBQXdCO0FBQXhCLHVCQUF3QjtBQUFJO0FBQUM7QUFDMUMsNEJBQU8sVUFBUCxVQUE2QjtBQUNyQixjQUFLLE9BQVk7QUFDakIsY0FBTyxTQUFZLFlBQVksU0FBa0IsZ0JBQXZDLEdBQTJELFdBQVE7QUFDN0UsY0FDUjtBQUFDO0FBQ1MsNEJBQVksZUFBdEIsVUFBMkM7QUFDcEMsYUFBVSxVQUNqQjtBQUFDO0FBQ1MsNEJBQVMsWUFBbkIsWUFBd0IsQ0FBQztBQUNmLDRCQUFVLGFBQXBCLFlBQXlCLENBQUM7QUFDbkIsNEJBQVksZUFBbkIsVUFBMEM7QUFDbkMsYUFBQyxDQUFLLEtBQVcsV0FBUTtBQUN6QixhQUFDLENBQUssS0FBaUIsaUJBQUssS0FBZ0Isa0JBQXNCLGdDQUFLLEtBQVk7QUFDbEYsY0FBZ0IsZ0JBQVcsYUFBTyxLQUFXO0FBQzdDLGNBQVEsVUFBTyxLQUFnQixnQkFBSSxJQUMzQztBQUFDO0FBQ1U7QUFDWCw0QkFBb0IsdUJBQXBCLFVBQWtDLFVBQ2xDLENBQUM7QUFDRCw0QkFBWSxlQUFaLFlBQ0EsQ0FBQztBQUNELDRCQUFlLGtCQUFmLFVBQTZCO0FBQ3RCLGFBQUssS0FBa0IscUJBQVUsT0FBUTtBQUN4QyxjQUFrQixvQkFBUztBQUMzQixjQUFhLGFBQUssS0FDMUI7QUFBQztBQUNELDRCQUEwQiw2QkFBMUI7QUFBcUMsZ0JBQVE7QUFBQztBQW5GL0Isa0JBQWUsa0JBQU87QUFvRnpDLFlBQUM7QUFBQTtBQUNTLHdCQUFTLFNBQVMsU0FBZSxnQkFBRSxDQUFRLFNBQUUsRUFBTSxNQUFtQixtQkFBUyxTQUFRLFFBQWtCLGtCQUMvRyxFQUFNLE1BQVcsV0FBRSxFQUFNLE1BQTRCLDRCQUFTLFNBQU8sUUFBRSxFQUFLLE1BQWlCLGlCQUFTLFNBQUcsR0FBUyxTQUFFLENBQUUsR0FBRyxHQUFHLEdBQVEsTzs7Ozs7Ozs7Ozs7QUMzRnhJLHFDQUdBLENBQUM7QUFBRCxZQUFDO0FBRUQ7O0FBR0ksaUNBQWdCLENBQUM7QUFDVixnQ0FBTyxVQUFkLFVBQTJCO0FBQ3BCLGFBQUMsQ0FBTSxNQUFPLE9BQU07QUFDcEIsYUFBQyxDQUFLLEtBQVcsV0FBTyxPQUFNO0FBQ2pDLGFBQVMsUUFBTyxLQUFTLFNBQU87QUFDNUIsY0FBQyxJQUFLLElBQVEsTUFBTyxTQUFJLEdBQUcsS0FBSyxHQUFLLEtBQUc7QUFDekMsaUJBQVEsT0FBUSxNQUFJO0FBQ3BCLGlCQUFRLE9BQU8sS0FBUSxRQUFLLEtBQVUsVUFBSyxLQUFNLFFBQUksR0FBTSxLQUFPO0FBQy9ELGlCQUFDLENBQUssS0FBZSxlQUFPLE9BQVU7QUFDdEMsaUJBQUssS0FBVyxjQUFJLENBQUssS0FBVyxXQUFPLE9BQVU7QUFDeEQsaUJBQVMsUUFBTyxLQUFVLFVBQU87QUFDOUIsaUJBQU0sU0FBUyxNQUFNLFFBQU07QUFDMUIsb0JBQU8sS0FBTyxPQUFFLEdBQU0sS0FBTyxTQUFRLFFBQU8sS0FBTyxPQUFLLEtBQUksTUFDcEU7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDTyxnQ0FBUSxXQUFoQixVQUE2QjtBQUN6QixhQUFTLFFBQU07QUFDZixhQUFVLFNBQU8sS0FBUTtBQUN6QixhQUFTLFFBQUcsQ0FBRztBQUNmLGFBQU0sS0FBTTtBQUNSLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUyxRQUFLLEtBQUc7QUFDNUIsa0JBQU8sS0FBSTtBQUNWLGlCQUFHLE1BQVEsS0FBTSxRQUFLO0FBQ3RCLGlCQUFHLE1BQVEsS0FBRTtBQUNULHFCQUFNLFFBQUcsQ0FBRyxHQUFFO0FBQ2IseUJBQVEsT0FBRyxJQUEyQjtBQUNsQywwQkFBTSxRQUFTO0FBQ2YsMEJBQUksTUFBSztBQUNSLDJCQUFLLEtBQ2Q7QUFBQztBQUNJLHlCQUFHLENBQ1o7QUFDSjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNPLGdDQUFPLFVBQWYsVUFBNEI7QUFDckIsYUFBQyxDQUFNLE1BQVE7QUFDWixnQkFBSyxLQUNmO0FBQUM7QUFDTyxnQ0FBYyxpQkFBdEIsVUFBbUM7QUFDNUIsYUFBQyxDQUFNLE1BQU8sT0FBTztBQUNwQixjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBTyxRQUFLLEtBQUc7QUFDbkMsaUJBQU0sS0FBTyxLQUFJO0FBQ1g7QUFDSCxpQkFBRyxNQUFPLE9BQU0sTUFBTyxPQUFNLE1BQVEsS0FBTyxPQUNuRDtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNMLFlBQUM7QUFBQSxLOzs7Ozs7Ozs7OztBQ3pEc0M7O0FBQ0o7O0FBQ1U7O0FBQ0s7O0FBQ2Y7O0FBR25DOzs7QUFBd0MsbUNBQVE7QUFhNUMsaUNBQXdCO0FBQ3BCLDJCQUFZO0FBYlIsY0FBbUIsc0JBQTBCO0FBR3JELGNBQVMsWUFBMkIsb0JBQVEsU0FBb0Isa0NBQVUsVUFBbUI7QUFDckYsY0FBYyxpQkFBMEI7QUFDeEMsY0FBMkIsOEJBQWE7QUFDeEMsY0FBYSxnQkFBcUIsSUFBdUI7QUFFMUQsY0FBYyxpQkFBZ0I7QUFDOUIsY0FBb0IsdUJBQWlCO0FBQzVDLGNBQWlCLG9CQUFrQjtBQW1CM0IsY0FBZ0IsbUJBQWtCO0FBZmxDLGNBQWEsZUFBTyxLQUFrQjtBQUMxQyxhQUFRLE9BQVE7QUFDWixjQUFhLGFBQWtCLG9CQUFHLFVBQWlDO0FBQVEsa0JBQXFCLHFCQUFRO0FBQ2hIO0FBQUM7QUFDRCwyQkFBVyw4QkFBZTtjQUExQjtBQUNVLG9CQUFLLEtBQTBCLDRCQUFPLEtBQVksWUFBSyxLQUFPLFNBQU8sS0FBWSxZQUFLLEtBQ2hHO0FBQUM7O3VCQUFBOztBQUNTLGtDQUFXLGNBQXJCLFVBQThCO0FBQ3BCLGdCQUFJLE9BQVEsS0FBVSxVQUNoQztBQUFDO0FBQ1Msa0NBQWMsaUJBQXhCO0FBQW9ELGdCQUF3QjtBQUFDO0FBQ25FLGtDQUFVLGFBQXBCO0FBQ08sYUFBSyxLQUEyQiwyQkFBTyxPQUFDLE9BQUssVUFBVyxnQkFBRztBQUN4RCxnQkFBSyxLQUNmO0FBQUM7QUFFUyxrQ0FBVSxhQUFwQixVQUFxQztBQUM5QixhQUFLLEtBQTJCLDJCQUMvQixPQUFLLFVBQVcsc0JBQ2hCLGVBQUU7QUFDQyxpQkFBQyxDQUFLLEtBQWlCLG9CQUFZLFlBQVEsS0FBYyxjQUFFO0FBQ3RELHNCQUFpQixtQkFBUTtBQUN6QixzQkFBYSxlQUFZO0FBQzFCLHFCQUFLLEtBQWlCLGlCQUFFO0FBQ25CLDBCQUFrQixrQkFBSyxLQUMvQjtBQUFDO0FBQ0csc0JBQWlCLG1CQUN6QjtBQUNKO0FBQ0o7QUFBQztBQUNTLGtDQUFXLGNBQXJCLFVBQW1DO0FBQzVCLGFBQVUsVUFBSyxLQUE0Qiw4QkFBWTtBQUMxRCxnQkFBSyxVQUFZLHVCQUNyQjtBQUFDO0FBQ1Msa0NBQWEsZ0JBQXZCLFVBQWdDO0FBQ3pCLGFBQUssS0FBMkIsMkJBQU8sT0FBQyxPQUFLLFVBQWMseUJBQU07QUFDaEUsY0FBWSxjQUFPLEtBQWtCLGtCQUFNO0FBQ3pDLGdCQUFLLEtBQ2Y7QUFBQztBQUNTLGtDQUFXLGNBQXJCLFVBQThCO0FBQ3ZCLGFBQUssS0FBMkIsMkJBQU8sT0FBQyxPQUFLLFVBQVksdUJBQU07QUFDOUQsY0FBWSxjQUFPO0FBQ2pCLGdCQUFLLEtBQWdCLGdCQUMvQjtBQUFDO0FBQ1Msa0NBQWlCLG9CQUEzQixVQUFvQztBQUM3QixhQUFDLENBQUssS0FBZ0IsZ0JBQU0sTUFBTyxPQUFLO0FBQ3hDLGFBQUksT0FBUSxLQUFVLFVBQU8sT0FBTyxPQUFLO0FBQ3hDLGNBQVEsVUFBTztBQUNiLGdCQUFLLEtBQVUsVUFDekI7QUFBQztBQUNTLGtDQUFlLGtCQUF6QixVQUFrQztBQUMzQixhQUFJLE9BQVEsS0FBVSxVQUFNLFNBQVEsS0FBYyxjQUFFO0FBQ2hELG1CQUFPLEtBQ2Q7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDUyxrQ0FBZSxrQkFBekIsVUFBa0M7QUFDM0IsYUFBQyxDQUFLLEtBQU8sT0FBTztBQUN2QixhQUFTLFFBQU8sS0FBZTtBQUMzQixjQUFDLElBQUssSUFBSSxHQUFHLElBQVEsTUFBTyxRQUFLLEtBQUc7QUFDakMsaUJBQU0sTUFBRyxHQUFNLFNBQVEsS0FBTyxPQUNyQztBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNELDJCQUFJLDhCQUFPO2NBQVg7QUFBa0Msb0JBQUssS0FBZ0I7QUFBQztjQUN4RCxhQUFnQztBQUNuQiw2QkFBUSxRQUFLLEtBQWMsZUFBWTtBQUM1QyxrQkFDUjtBQUFDOzt1QkFKdUQ7O0FBSzlDLGtDQUFlLGtCQUF6QjtBQUNRLGNBQ1I7QUFBQztBQUNELDJCQUFJLDhCQUFZO2NBQWhCO0FBQW1DLG9CQUFLLEtBQW9CO0FBQUM7Y0FDN0QsYUFBaUM7QUFDMUIsaUJBQVMsWUFBUSxLQUFtQixtQkFBUTtBQUMzQyxrQkFBa0Isb0JBQVk7QUFDOUIsa0JBQ1I7QUFBQzs7dUJBTDREOztBQU03RCwyQkFBSSw4QkFBUztjQUFiO0FBQWdDLG9CQUFLLEtBQVUsVUFBTztBQUFDO2NBQ3ZELGFBQTJCO0FBQVEsa0JBQVUsVUFBSyxPQUFVO0FBQUM7O3VCQUROOztBQUV2RCwyQkFBSSw4QkFBYztjQUFsQjtBQUNPLGlCQUFDLENBQUssS0FBUyxZQUFRLEtBQWEsZ0JBQVcsUUFBTyxPQUFLLEtBQWU7QUFDM0UsaUJBQUMsQ0FBSyxLQUFxQixxQkFBRTtBQUN2QixzQkFBb0Isc0JBQU8sS0FBbUIsbUJBQUssS0FBYyxjQUFVO0FBQzVFLHFCQUFLLEtBQVUsVUFBRTtBQUNaLDBCQUFvQixvQkFBSyxLQUFLLEtBQ3RDO0FBQ0o7QUFBQztBQUNLLG9CQUFLLEtBQ2Y7QUFBQzs7dUJBQUE7O0FBQ0QsMkJBQVksOEJBQWE7Y0FBekI7QUFBc0Qsb0JBQUssS0FBZSxpQkFBTyxLQUFlLGlCQUFPLEtBQVU7QUFBQzs7dUJBQUE7O0FBQzNHLGtDQUFjLGlCQUFyQjtBQUF5QyxnQkFBTztBQUFDO0FBQzFDLGtDQUFZLGVBQW5CO0FBQXVDLGdCQUFPO0FBQUM7QUFDckMsa0NBQWdCLG1CQUExQixVQUFxRDtBQUNqRCxnQkFBSyxVQUFpQiw0QkFBUztBQUM1QixhQUFDLENBQUssS0FBZ0IsbUJBQVEsS0FBUyxTQUFRO0FBQ2xELGFBQVEsT0FBTyxLQUFnQjtBQUM1QixhQUFDLENBQU0sTUFBRTtBQUNKLG9CQUFxQixrQ0FBVSxVQUN2QztBQUFDO0FBQ0ssZ0JBQUssS0FBZ0IsdUJBQy9CO0FBQUM7QUFDUyxrQ0FBdUIsMEJBQWpDO0FBQTRDLGdCQUFLLEtBQXlCLHlCQUFLLEtBQU8sVUFBUSxPQUFPLEtBQU8sT0FBcUIsdUJBQVU7QUFBQztBQUM1SSxrQ0FBWSxlQUFaO0FBQ08sYUFBSyxLQUFjLGNBQUssS0FBYSxhQUM1QztBQUFDO0FBQ08sa0NBQW9CLHVCQUE1QixVQUFvRDtBQUNoRCxhQUFjLGFBQU8sS0FBTyxPQUFRO0FBQ2hDLGNBQU8sU0FBTTtBQUNkLGFBQUssS0FBYSxnQkFBUSxLQUFhLGFBQU8sT0FBRTtBQUMzQyxrQkFBTyxPQUFLLEtBQUssS0FBYSxhQUN0QztBQUFDO0FBQ0UsYUFBVyxhQUFJLEtBQVEsS0FBTyxPQUFPLFNBQUssR0FBRTtBQUN2QyxrQkFBYSxhQUFLLEtBQzFCO0FBQUM7QUFDRCxhQUFjLGFBQVE7QUFDbkIsYUFBTSxTQUFTLE1BQU8sU0FBSyxHQUFFO0FBQ2xCLDBCQUFHLElBQXVCO0FBQzNCLDZCQUFRLFFBQVcsWUFDaEM7QUFBQztBQUNHLGNBQWUsaUJBQWM7QUFDN0IsY0FBMkI7QUFDNUIsYUFBSyxLQUE2Qiw2QkFBRTtBQUMvQixrQkFBTSxRQUFPLEtBQ3JCO0FBQ0o7QUFBQztBQUNPLGtDQUF1QiwwQkFBL0I7QUFDUSxjQUFvQixzQkFBUTtBQUM1QixjQUFhLGFBQUssS0FDMUI7QUFBQztBQUNPLGtDQUFrQixxQkFBMUIsVUFBa0Q7QUFDOUMsYUFBUyxRQUFPLEtBQWEsYUFBZTtBQUN6QyxhQUFNLFNBQVUsT0FBTyxPQUFLLEtBQVUsVUFBTSxPQUFLO0FBQ2pELGFBQU0sU0FBVyxRQUFPLE9BQUssS0FBVSxVQUFNLE9BQUUsQ0FBSTtBQUNuRCxhQUFNLFNBQWEsVUFBTyxPQUFLLEtBQWUsZUFBUTtBQUNuRCxnQkFDVjtBQUFDO0FBQ08sa0NBQVMsWUFBakIsVUFBeUMsT0FBYztBQUM3QyxzQkFBVyxLQUFDLFVBQVcsR0FBRztBQUN6QixpQkFBRSxFQUFLLE9BQUksRUFBTSxNQUFPLE9BQUMsQ0FBRSxJQUFRO0FBQ25DLGlCQUFFLEVBQUssT0FBSSxFQUFNLE1BQU8sT0FBRSxJQUFRO0FBQy9CLG9CQUNWO0FBQ0osVUFMZ0I7QUFLZjtBQUNPLGtDQUFjLGlCQUF0QixVQUE4QztBQUN0QyxjQUFDLElBQUssSUFBUSxNQUFPLFNBQUksR0FBRyxJQUFJLEdBQUssS0FBRztBQUN4QyxpQkFBSyxJQUFPLEtBQU0sTUFBSyxLQUFZLFlBQUUsSUFBTztBQUM1QyxpQkFBUSxPQUFRLE1BQUk7QUFDZixtQkFBRyxLQUFRLE1BQUk7QUFDZixtQkFBRyxLQUNaO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ0wsWUFBQztBQUVEOztBQUEwQyxxQ0FBa0I7QUFHeEQsbUNBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUFRO0FBRnZCLGNBQWEsZ0JBSXJCO0FBQUM7QUFDRCwyQkFBVyxnQ0FBUTtjQUFuQjtBQUFzQyxvQkFBSyxLQUFnQjtBQUFDO2NBQzVELGFBQWlDO0FBQzFCLGlCQUFNLFFBQUksS0FBUyxRQUFLLEdBQVE7QUFDL0Isa0JBQWMsZ0JBQVM7QUFDdkIsa0JBQWEsYUFBSyxLQUMxQjtBQUFDOzt1QkFMMkQ7O0FBTWhFLFlBQUM7QUFBQTtBQUNTLHdCQUFTLFNBQVMsU0FBYSxlQUF1QixzQkFBb0Isc0JBQzFFLE1BQXNCLHNCQUFZLFlBQUUsb0JBQWtCO0FBQVUsZ0JBQVUsZ0JBQVEsUUFBSSxJQUFXO0FBQUMsTUFBeEcsRUFBb0gsWUFBRSxvQkFBa0IsS0FBWTtBQUFPLGFBQVEsVUFBVTtBQUFFLFFBRHhJLEVBRXZDLEVBQU0sTUFBZ0IsZ0JBQVMsU0FBUSxRQUFTLFNBQUUsQ0FBTyxRQUFPLE9BQVEsUUFBYSxlQUMvRSxNQUF5Qix5QkFBVyxXQUFtQixtQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFJLElBQWEsYUFBUSxVQUFPLE9BQU0sSUFBZTtBQUFDLE1BQTdKLEVBQXlLLFlBQUUsb0JBQWtCLEtBQVk7QUFBTyxhQUFhLGFBQVEsUUFBUztBQUFHLFVBQ2pQLEVBQU0sTUFBYSxhQUFTLFNBQW9CLGtDQUFVLFVBQW1CLG9CQUFrQixrQkFDL0YsRUFBTSxNQUFnQyxnQ0FBUyxTQUFRLFNBQU0sTUFBYztBQUVyRSx3QkFBUyxTQUFTLFNBQWUsZ0JBQUUsQ0FBQyxFQUFNLE1BQW1CLG1CQUFTLFNBQUcsR0FBUyxTQUFFLENBQUUsR0FBRyxHQUFHLEdBQUcsR0FBTyxPQUFNLE1BQWdCLGM7Ozs7Ozs7Ozs7O0FDbE10STtBQUdZLGNBQVcsY0FpQnZCO0FBQUM7QUFmVSwrQkFBZ0IsbUJBQXZCLFVBQTRDLGNBQWlEO0FBQ3JGLGNBQVksWUFBYyxnQkFDbEM7QUFBQztBQUNNLCtCQUFXLGNBQWxCO0FBQ0ksYUFBVSxTQUFHLElBQW9CO0FBQzlCLGNBQUMsSUFBTyxPQUFRLEtBQWEsYUFBRTtBQUN4QixvQkFBSyxLQUNmO0FBQUM7QUFDSyxnQkFBTyxPQUNqQjtBQUFDO0FBQ00sK0JBQWMsaUJBQXJCLFVBQTBDLGNBQWM7QUFDcEQsYUFBVyxVQUFPLEtBQVksWUFBZTtBQUMxQyxhQUFRLFdBQVMsTUFBTyxPQUFNO0FBQzNCLGdCQUFRLFFBQ2xCO0FBQUM7QUFsQmEscUJBQVEsV0FBb0IsSUFBc0I7QUFDbEQscUJBQWMsaUJBQUcsQ0FBTSxPQUFvQixvQkFBdUI7QUFrQnBGLFlBQUM7QUFBQSxLOzs7Ozs7Ozs7OztBQ3BCcUM7O0FBQ0M7O0FBQ1A7O0FBR2hDOzs7QUFBNEMsdUNBQTBCO0FBQ2xFLHFDQUE0QixNQUFxQixNQUEyQixNQUFZO0FBQ3BGLDJCQUFVLE1BQVM7QUFESixjQUFJLE9BQUs7QUFBUyxjQUFJLE9BRXpDO0FBQUM7QUFDRCwyQkFBVyxrQ0FBTztjQUFsQjtBQUE2QixvQkFBSyxLQUFPO0FBQUM7O3VCQUFBOztBQUM5QyxZQUFDO0FBQ0Q7O0FBQWlELDRDQUErQjtBQUc1RSwwQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFGdkIsY0FBUyxZQUlqQjtBQUFDO0FBQ00sMkNBQU8sVUFBZDtBQUNVLGdCQUNWO0FBQUM7QUFDRCwyQkFBVyx1Q0FBSTtjQUFmO0FBQXNDLG9CQUFLLEtBQVk7QUFBQztjQUN4RCxhQUFvQztBQUN2Qiw2QkFBUSxRQUFLLEtBQVUsV0FDcEM7QUFBQzs7dUJBSHVEOztBQUk5QywyQ0FBWSxlQUF0QjtBQUNJLGFBQVUsU0FBRyxJQUFvQztBQUM5QyxhQUFDLENBQUssS0FBSyxRQUFRLEtBQUssS0FBTyxXQUFPLEdBQU8sT0FBUTtBQUN4RCxhQUFPLE1BQU8sS0FBTztBQUNsQixhQUFDLENBQUssS0FBSSxNQUFNO0FBQ2YsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQUssS0FBTyxRQUFLLEtBQUc7QUFDckMsaUJBQUMsQ0FBSyxLQUFLLEtBQUcsR0FBTyxPQUFVO0FBQzVCLG9CQUFLLEtBQUssS0FBZ0IsZ0JBQUssS0FBSyxLQUFHLEdBQU0sT0FBTSxLQUFLLEtBQUcsR0FBSyxNQUFLLElBQUssS0FBSyxLQUFHLEdBQzVGO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ1MsMkNBQWUsa0JBQXpCLFVBQW1DLE1BQWMsTUFBWTtBQUNuRCxnQkFBQyxJQUEwQix1QkFBSyxNQUFNLE1BQU0sTUFDdEQ7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQVMsU0FBaUIscUJBQVMsTUFBbUIsbUJBQVksWUFBRSxvQkFBa0I7QUFBVSxnQkFBVSxnQkFBUSxRQUFJLElBQVE7QUFBQyxNQUFsRyxFQUE4RyxZQUFFLG9CQUFrQixLQUFZO0FBQU8sYUFBSyxPQUFVO0FBQUcsUUFBeEssR0FDM0M7QUFBb0IsWUFBQyxJQUErQiw0QkFBTTtBQUFDLElBQXdCO0FBRXhFLGtDQUFTLFNBQWlCLGlCQUFpQixrQkFBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQStCLDRCQUFPLE1BQUUsRUFBUSxVQUFHLENBQUUsR0FBRyxHQUFHLEdBQUcsR0FBSyxHQUFFLEVBQUssT0FBRyxDQUFRLFNBQVcsU0FBRSxFQUFVLFVBQWEsWUFBRSxFQUFVLFVBQWEsWUFBRSxFQUFVLFVBQWEsWUFBTyxPQUFJO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDNUNuTzs7QUFDQzs7QUFDVTs7QUFDQzs7QUFJbEQ7OztBQUEyQyxzQ0FBMEI7QUFDakUsb0NBQWdDLE9BQTJCLE1BQVk7QUFDbkUsMkJBQVUsTUFBUztBQURKLGNBQUssUUFFeEI7QUFBQztBQUNELDJCQUFXLGlDQUFPO2NBQWxCO0FBQTZCLG9CQUFNLFFBQU8sS0FBUTtBQUFDOzt1QkFBQTs7QUFDdkQsWUFBQztBQUVEOztBQUFnRCwyQ0FBK0I7QUFRM0UseUNBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUFRO0FBTnZCLGNBQVUsYUFBSztBQUNmLGNBQWEsZ0JBQWE7QUFDMUIsY0FBZSxrQkFBZ0I7QUFDL0IsY0FBa0IscUJBQWdCO0FBQ25DLGNBQVcsY0FJbEI7QUFBQztBQUNNLDBDQUFPLFVBQWQ7QUFDVSxnQkFDVjtBQUFDO0FBQ0QsMkJBQVcsc0NBQVE7Y0FBbkI7QUFBOEIsb0JBQUssS0FBZ0I7QUFBQztjQUNwRCxhQUErQjtBQUN4QixpQkFBSSxNQUFJLEtBQU8sTUFBNkIsMkJBQWEsYUFBUTtBQUNoRSxrQkFBYyxnQkFBTztBQUN0QixpQkFBSyxLQUFNLFNBQVEsS0FBTSxNQUFPLFNBQU8sS0FBRTtBQUN4QyxxQkFBUSxPQUFPLEtBQU87QUFDbEIsc0JBQU8sT0FBTTtBQUNiLHNCQUFNLFFBQ2Q7QUFBQztBQUNHLGtCQUFhLGFBQUssS0FDMUI7QUFBQzs7dUJBVm1EOztBQVc3QywwQ0FBTSxTQUFiO0FBQ08sYUFBSyxLQUFzQixzQkFBRTtBQUN4QixrQkFBcUIscUJBQUssS0FBSyxLQUFnQixnQkFDdkQ7QUFBQztBQUNHLGNBQ1I7QUFBQztBQUNNLDBDQUFTLFlBQWhCLFVBQThCO0FBQ3ZCLGFBQU0sUUFBSSxLQUFTLFNBQVEsS0FBVSxVQUFRO0FBQzdDLGFBQUssS0FBcUIsd0JBQVMsUUFBTyxLQUFxQixxQkFBUSxRQUFFO0FBQ3BFLGtCQUFxQixxQkFBTyxPQUFNLE9BQzFDO0FBQUM7QUFDRSxhQUFLLEtBQU8sT0FBRTtBQUNiLGlCQUFPLE1BQU8sS0FBZSxlQUFLLEtBQVE7QUFDdkMsaUJBQU8sT0FBTSxPQUFLO0FBQ2xCLG1CQUFPLEtBQWUsZUFBSSxLQUFRO0FBQ2pDLGtCQUFNLFFBQ2Q7QUFBQztBQUNHLGNBQ1I7QUFBQztBQUNELDJCQUFXLHNDQUFVO2NBQXJCO0FBQWdDLG9CQUFLLEtBQWdCLGtCQUFPLEtBQWdCLGtCQUFxQixrQ0FBVSxVQUFZO0FBQUM7Y0FDeEgsYUFBbUM7QUFDM0Isa0JBQWdCLGtCQUN4QjtBQUFDOzt1QkFIdUg7O0FBSXhILDJCQUFXLHNDQUFhO2NBQXhCO0FBQW1DLG9CQUFLLEtBQW1CLHFCQUFPLEtBQW1CLHFCQUFxQixrQ0FBVSxVQUFlO0FBQUM7Y0FDcEksYUFBc0M7QUFDOUIsa0JBQW1CLHFCQUMzQjtBQUFDOzt1QkFIbUk7O0FBSTdILDBDQUEwQiw2QkFBakM7QUFBOEMsZ0JBQVM7QUFBQztBQUN4RCwyQkFBVyxzQ0FBaUI7Y0FBNUI7QUFDTyxpQkFBSyxLQUFxQix3QkFBUSxLQUFxQixxQkFBTyxVQUFRLEtBQVUsVUFBTyxPQUFLLEtBQXNCO0FBQy9HLG9CQUFLLEtBQ2Y7QUFBQzs7dUJBQUE7O0FBQ1MsMENBQWdCLG1CQUExQixVQUFxRDtBQUNqRCxnQkFBSyxVQUFpQiw0QkFBUztBQUM1QixhQUFLLEtBQWtCLGtCQUFFO0FBQ2xCLG9CQUFLLEtBQWdCLHVCQUFtQixrQ0FBVSxVQUFvQixvQkFBVSxVQUFLLEtBQy9GO0FBQ0o7QUFBQztBQUNPLDBDQUFjLGlCQUF0QjtBQUNPLGFBQUssS0FBWSxlQUFLLEtBQUksQ0FBSyxLQUFzQixzQkFBTyxPQUFPO0FBQ3RFLGFBQU8sTUFBUztBQUNoQixhQUFlLGNBQUs7QUFDaEIsY0FBQyxJQUFZLFdBQUksR0FBVSxXQUFPLEtBQXFCLHFCQUFPLFFBQVksWUFBRztBQUM3RSxpQkFBTyxNQUFPLEtBQXFCLHFCQUFXO0FBQzNDLGlCQUFDLENBQUksSUFBUyxTQUNyQjtBQUFDO0FBQ0ssZ0JBQVksY0FBTyxLQUM3QjtBQUFDO0FBQ1MsMENBQVksZUFBdEI7QUFDSSxhQUFVLFNBQUcsSUFBbUM7QUFDN0MsYUFBSyxLQUFTLGFBQU8sR0FBTyxPQUFRO0FBQ3ZDLGFBQU8sTUFBTyxLQUFlLGVBQUssS0FBUTtBQUN0QyxjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBUyxVQUFLLEtBQUc7QUFDL0Isb0JBQUssS0FBSyxLQUFnQixnQkFBSyxLQUFtQixtQkFBSSxLQUNoRTtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNTLDBDQUFlLGtCQUF6QixVQUFvQztBQUMxQixnQkFBQyxJQUF5QixzQkFBSyxLQUFjLGNBQU0sTUFDN0Q7QUFBQztBQUNTLDBDQUFvQix1QkFBOUIsVUFBdUM7QUFDbkMsYUFBZSxjQUFNLE9BQVMsTUFBUSxRQUFLLE9BQU0sSUFBTyxTQUFLO0FBQzFELGFBQVksZUFBUSxLQUFVLFVBQVE7QUFDckMsY0FBYyxnQkFBZTtBQUM5QixhQUFLLEtBQXNCLHNCQUFFO0FBQ3hCLGtCQUFxQix1QkFBTyxLQUNwQztBQUNKO0FBQUM7QUFDUywwQ0FBYyxpQkFBeEIsVUFBc0M7QUFDbEMsYUFBVSxTQUFZO0FBQ25CLGFBQUMsQ0FBUSxRQUFPLFNBQU07QUFDekIsYUFBSyxJQUFNO0FBQ1IsYUFBTyxPQUFPLFNBQU8sS0FBVSxVQUFPLE9BQU8sT0FBSyxLQUFTLFdBQU07QUFDaEUsY0FBQyxJQUFLLElBQVMsT0FBTyxRQUFHLElBQU8sS0FBUyxVQUFLLEtBQUc7QUFDM0Msb0JBQUssS0FDZjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNTLDBDQUFjLGlCQUF4QixVQUFzQyxVQUFpQztBQUNuRSxhQUFXLFVBQVE7QUFDZixjQUFDLElBQUssSUFBSSxHQUFHLElBQVcsU0FBTyxRQUFLLEtBQUc7QUFDcEMsaUJBQU8sT0FBSyxLQUFTLFNBQUksSUFBTyxTQUFLLEdBQUU7QUFDL0IsMkJBQVM7QUFFcEI7QUFDSjtBQUFDO0FBQ0ssZ0JBQVEsVUFBTyxPQUN6QjtBQUFDO0FBRU8sMENBQWtCLHFCQUExQixVQUE2QyxlQUFlO0FBQ2xELGdCQUFNLFNBQUssS0FBUyxRQUFnQixjQUFPLFNBQWdCLGNBQU8sU0FDNUU7QUFBQztBQUNTLDBDQUFXLGNBQXJCLFVBQXFELEtBQW9CLGVBQXlCO0FBQXZCLDZCQUF1QjtBQUF2QixzQkFBdUI7O0FBQ3hGLGdCQUFLLEtBQW1CLG1CQUFjLGVBQU0sS0FBcUIscUJBQVEsUUFDbkY7QUFBQztBQXRITSxnQ0FBVyxjQUFPO0FBdUg3QixZQUFDO0FBQUE7QUFFUyx3QkFBUyxTQUFTLFNBQWdCLGtCQUFHLEVBQU0sTUFBbUIsbUJBQVMsU0FBSyxLQUFFLEVBQU0sTUFBc0Isc0JBQVMsU0FBSyxPQUNwSCxNQUFjLGNBQVksWUFBRSxvQkFBa0I7QUFBVSxnQkFBSSxJQUFrQjtBQUFHLE1BQXZGLEVBRHNDLElBRWhDLE1BQWlCLGlCQUFZLFlBQUUsb0JBQWtCO0FBQVUsZ0JBQUksSUFBcUI7QUFBSSxNQUE5RixLQUNKO0FBQW9CLFlBQUMsSUFBOEIsMkJBQU07QUFBQyxJQUF3QjtBQUV2RSxrQ0FBUyxTQUFpQixpQkFBZ0IsaUJBQUUsVUFBSztBQUFPLFNBQUssSUFBRyxJQUE4QiwyQkFBTyxNQUFFLEVBQVEsVUFBRyxDQUFFLEdBQUcsR0FBRyxHQUFHLEdBQUssR0FBRSxFQUFVLFVBQWEsWUFBRSxFQUFVLFVBQWEsWUFBRSxFQUFVLFVBQWEsWUFBTyxPQUFJO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDL0lwTTs7QUFDSDs7QUFDSTs7QUFFVzs7QUFDZjs7QUFNbkM7OztBQUFvQywrQkFBSTtBQUlwQyw2QkFBNEIsTUFBcUIsTUFBeUIsVUFBbUIsTUFBWTtBQUNyRyxxQkFBUTtBQURPLGNBQUksT0FBSztBQUFTLGNBQUksT0FBUTtBQUFTLGNBQVEsV0FBUTtBQUVsRSxjQUFLLE9BQVE7QUFDYixjQUFTLFdBQ2pCO0FBQUM7QUFDRCwyQkFBVywwQkFBSztjQUFoQjtBQUEyQixvQkFBSyxLQUFXO0FBQUM7Y0FDNUMsYUFBOEI7QUFDdEIsa0JBQVMsV0FBWTtBQUN0QixpQkFBSyxLQUFNLE1BQUssS0FBSyxLQUFtQixtQkFBTztBQUM5QyxrQkFDUjtBQUFDOzt1QkFMMkM7O0FBTWxDLDhCQUFjLGlCQUF4QixZQUNBLENBQUM7QUFDTCxZQUFDO0FBQ0Q7O0FBQXlDLG9DQUFRO0FBTTdDLGtDQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUx2QixjQUFZLGVBQW1CO0FBQy9CLGNBQVMsWUFBbUI7QUFDNUIsY0FBYSxnQkFBUztBQUV2QixjQUFnQixtQkFHdkI7QUFBQztBQUNNLG1DQUFPLFVBQWQ7QUFDVSxnQkFDVjtBQUFDO0FBQ0QsMkJBQVcsK0JBQU87Y0FBbEI7QUFDVSxvQkFBSyxLQUFVLFVBQU8sU0FDaEM7QUFBQzs7dUJBQUE7O0FBQ0QsMkJBQUksK0JBQU87Y0FBWDtBQUFrQyxvQkFBSyxLQUFlO0FBQUM7Y0FDdkQsYUFBZ0M7QUFDbkIsNkJBQVEsUUFBSyxLQUFhLGNBQ3ZDO0FBQUM7O3VCQUhzRDs7QUFJdkQsMkJBQUksK0JBQUk7Y0FBUjtBQUErQixvQkFBSyxLQUFZO0FBQUM7Y0FDakQsYUFBNkI7QUFDaEIsNkJBQVEsUUFBSyxLQUFVLFdBQ3BDO0FBQUM7O3VCQUhnRDs7QUFJakQsMkJBQVcsK0JBQVc7Y0FBdEI7QUFDSSxpQkFBVSxTQUFHLElBQTRCO0FBQ3pDLGlCQUFPLE1BQU8sS0FBTztBQUNsQixpQkFBQyxDQUFLLEtBQUksTUFBTTtBQUNmLGtCQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBSyxLQUFPLFFBQUssS0FBRztBQUNyQyxxQkFBQyxDQUFLLEtBQUssS0FBRyxHQUFPLE9BQVU7QUFDNUIsd0JBQUssS0FBSyxLQUFnQixnQkFBSyxLQUFLLEtBQUcsR0FBTSxPQUFNLEtBQUssS0FBRyxHQUFLLE1BQU0sS0FBSyxPQUFNLE1BQU8sS0FBSyxLQUFHLEdBQU0sTUFBVyxZQUFLLElBQUssS0FBSyxLQUFHLEdBQzdJO0FBQUM7QUFDRSxpQkFBTyxPQUFPLFVBQU0sR0FBRTtBQUNmLHdCQUFLLEtBQUssS0FBZ0IsZ0JBQUssTUFBSSxJQUFNLEtBQUssTUFDeEQ7QUFBQztBQUNHLGtCQUFxQix1QkFBVTtBQUM3QixvQkFDVjtBQUFDOzt1QkFBQTs7QUFDRCxtQ0FBMEIsNkJBQTFCO0FBQXFDLGdCQUFLLEtBQXVCO0FBQUM7QUFDeEQsbUNBQWdCLG1CQUExQixVQUFxRDtBQUNqRCxnQkFBSyxVQUFpQiw0QkFBUztBQUM1QixhQUFLLEtBQWtCLGtCQUFFO0FBQ3BCLGtCQUFPLE9BQUssS0FBZ0IsdUJBQW1CLGtDQUFVLFVBQ2pFO0FBQ0o7QUFBQztBQUNPLG1DQUFjLGlCQUF0QjtBQUNPLGFBQUMsQ0FBSyxLQUFrQixrQkFBTyxPQUFPO0FBQ25DLGdCQUFDLENBQUssS0FDaEI7QUFBQztBQUNPLG1DQUFrQixxQkFBMUI7QUFDSSxhQUFRLE9BQU8sS0FBc0I7QUFDbEMsYUFBQyxDQUFNLE1BQUssT0FBTyxLQUFhO0FBQ2hDLGFBQUMsQ0FBTSxNQUFPLE9BQU07QUFDbkIsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQU8sUUFBSyxLQUFHO0FBQ25DLGlCQUFPLE1BQU8sS0FBRyxHQUFPO0FBQ3JCLGlCQUFDLENBQUssS0FBTyxPQUNwQjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNTLG1DQUFlLGtCQUF6QixVQUFtQyxNQUFjLE1BQWtCLFVBQVk7QUFDckUsZ0JBQUMsSUFBa0IsZUFBSyxNQUFNLE1BQVUsVUFBTSxNQUN4RDtBQUFDO0FBQ1MsbUNBQWMsaUJBQXhCO0FBQ08sYUFBSyxLQUFjLGlCQUFLLENBQUssS0FBc0Isd0JBQVEsS0FBcUIscUJBQU8sVUFBTSxHQUFRO0FBQ3BHLGNBQWMsZ0JBQVE7QUFDMUIsYUFBTyxNQUFPLEtBQU87QUFDbEIsYUFBQyxDQUFLLEtBQUksTUFBTTtBQUNoQixhQUFLLEtBQUssS0FBTyxVQUFNLEdBQUU7QUFDcEIsa0JBQXFCLHFCQUFHLEdBQU0sUUFDdEM7QUFBTSxnQkFBRTtBQUNBLGtCQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBcUIscUJBQU8sUUFBSyxLQUFHO0FBQ3hELHFCQUFPLE1BQU8sS0FBcUIscUJBQUk7QUFDdkMscUJBQVUsU0FBTSxJQUFJLElBQU0sUUFBTSxJQUFJLElBQU0sUUFBUTtBQUM5QyxzQkFBcUIscUJBQUcsR0FBTSxRQUN0QztBQUNKO0FBQUM7QUFDRyxjQUFjLGdCQUN0QjtBQUFDO0FBQ1k7QUFDYixtQ0FBa0IscUJBQWxCLFVBQXNDO0FBQy9CLGFBQUssS0FBZSxlQUFRO0FBQzNCLGNBQWMsZ0JBQVE7QUFDdkIsYUFBQyxDQUFLLEtBQVMsU0FBRTtBQUNaLGtCQUFZLFlBQUksSUFDeEI7QUFBTSxnQkFBRTtBQUNKLGlCQUFZLFdBQU8sS0FBTztBQUN2QixpQkFBQyxDQUFVLFVBQUU7QUFDSiw0QkFDWjtBQUFDO0FBQ08sc0JBQUksSUFBTSxRQUFNLElBQU87QUFDM0Isa0JBQVksWUFDcEI7QUFBQztBQUNHLGNBQWMsZ0JBQ3RCO0FBQUM7QUFDTCxZQUFDO0FBQUE7QUFFUyx3QkFBUyxTQUFTLFNBQVMsYUFBUyxNQUFzQixzQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFVLGdCQUFRLFFBQUksSUFBVztBQUFDLE1BQXhHLEVBQW9ILFlBQUUsb0JBQWtCLEtBQVk7QUFBTyxhQUFRLFVBQVU7QUFBRSxRQUFoTCxJQUM3QixNQUFtQixtQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFVLGdCQUFRLFFBQUksSUFBUTtBQUFDLE1BQWxHLEVBQThHLFlBQUUsb0JBQWtCLEtBQVk7QUFBTyxhQUFLLE9BQVU7QUFBRyxVQUM1SSw2QkFBRztBQUFvQixZQUFDLElBQXVCLG9CQUFNO0FBQUMsSUFBYztBQUVwRixrQ0FBUyxTQUFpQixpQkFBUyxVQUFFLFVBQUs7QUFBTyxTQUFLLElBQUcsSUFBdUIsb0JBQU8sTUFBRSxFQUFLLE9BQUcsQ0FBUSxTQUFXLFNBQUUsRUFBUSxVQUFHLENBQVcsWUFBWSxZQUFjLFlBQU8sT0FBSTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQ2hJeEs7O0FBQ2tEOztBQUMxQzs7QUFDSTs7QUFTdkM7OztBQUEyQyxzQ0FBSTtBQUszQyxvQ0FBbUMsTUFBc0I7QUFBN0MsMkJBQXVCO0FBQXZCLG9CQUF1Qjs7QUFBRSw0QkFBb0I7QUFBcEIscUJBQW9COztBQUNyRCxxQkFBUTtBQURPLGNBQUksT0FBWTtBQUZuQyxjQUFVLGFBQTJCLElBQTZCO0FBSTFELGNBQU0sUUFDZDtBQUFDO0FBQ00scUNBQU8sVUFBZDtBQUNVLGdCQUNWO0FBQUM7QUFDRCxxQ0FBTyxVQUFQLFVBQStCO0FBQ3ZCLGNBQUssT0FDYjtBQUFDO0FBQ0QsMkJBQVcsaUNBQUs7Y0FBaEI7QUFBMkIsb0JBQUssS0FBVyxhQUFPLEtBQVcsYUFBTyxLQUFPO0FBQUM7Y0FDNUUsYUFBZ0M7QUFBUSxrQkFBVyxhQUFZO0FBQUM7O3VCQURZOztBQUU1RSwyQkFBVyxpQ0FBSztjQUFoQjtBQUNVLG9CQUFLLEtBQUssT0FBTyxLQUFLLEtBQXFCLHFCQUFLLEtBQU0sUUFDaEU7QUFBQztjQUNELGFBQTJCO0FBQ3BCLGlCQUFLLEtBQUssUUFBUyxNQUFFO0FBQ2hCLHNCQUFLLEtBQXFCLHFCQUFLLEtBQUssTUFDNUM7QUFDSjtBQUFDOzt1QkFMQTs7QUFNRCxxQ0FBYyxpQkFBZCxVQUE0QixVQUM1QixDQUFDO0FBQ2dCO0FBQ2pCLHFDQUFpQixvQkFBakI7QUFBb0MsZ0JBQUssS0FBUTtBQUFDO0FBQ3RELFlBQUM7QUFFRDs7QUFBK0MsMENBQVE7QUFLbkQsd0NBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUFRO0FBSnZCLGNBQWEsZ0JBQWE7QUFFM0IsY0FBUSxXQUFjO0FBQ3JCLGNBQVcsY0FBaUMsSUFBbUM7QUF1RC9FLGNBQTJCLDhCQUFTO0FBcER4QyxhQUFRLE9BQVE7QUFDWixjQUFNLE1BQUssT0FBRyxVQUFlO0FBQ3hCLG1CQUFRLFFBQU87QUFDcEIsaUJBQVUsU0FBUSxNQUFVLFVBQUssS0FBSyxLQUFLLE1BQVM7QUFDaEQsa0JBQWEsYUFBSyxLQUEwQjtBQUMxQyxvQkFDVjtBQUNKO0FBQUM7QUFDTSx5Q0FBTyxVQUFkO0FBQ1UsZ0JBQ1Y7QUFBQztBQUNELDJCQUFXLHFDQUFLO2NBQWhCO0FBQXlELG9CQUFLLEtBQWM7QUFBQztjQUM3RSxhQUFvRDtBQUM1QyxrQkFBWSxjQUFTO0FBQ3JCLGtCQUFhLGFBQUssS0FDMUI7QUFBQzs7dUJBSjRFOztBQUt0RSx5Q0FBTyxVQUFkLFVBQTJCLE1BQXNCO0FBQXBCLDRCQUFvQjtBQUFwQixxQkFBb0I7O0FBQzdDLGFBQVEsT0FBTyxLQUFlLGVBQUssTUFBUztBQUN4QyxjQUFNLE1BQUssS0FBTztBQUNoQixnQkFDVjtBQUFDO0FBQ3NFO0FBQy9ELHlDQUFPLFVBQWYsVUFBNEIsTUFBc0I7QUFBcEIsNEJBQW9CO0FBQXBCLHFCQUFvQjs7QUFBaUMsZ0JBQUssS0FBUSxRQUFLLE1BQVU7QUFBQztBQUNoSCx5Q0FBMEIsNkJBQTFCO0FBQ1EsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQU0sTUFBTyxRQUFLLEtBQUc7QUFDdEMsaUJBQUMsQ0FBSyxLQUFNLE1BQUcsR0FBTyxPQUFPLE9BQ3BDO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ0QsMkJBQVcscUNBQVE7Y0FBbkI7QUFBc0Msb0JBQUssS0FBZ0I7QUFBQztjQUM1RCxhQUFpQztBQUMxQixpQkFBTSxRQUFJLEtBQVMsUUFBSyxHQUFRO0FBQy9CLGtCQUFjLGdCQUFTO0FBQ3ZCLGtCQUFhLGFBQUssS0FDMUI7QUFBQzs7dUJBTDJEOztBQU1yRCx5Q0FBTyxVQUFkO0FBQ0ksYUFBWSxXQUFPLEtBQVU7QUFDN0IsYUFBUyxRQUFPLEtBQU87QUFDdkIsYUFBUSxPQUFNO0FBQ2QsYUFBUyxRQUFLO0FBQ1YsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFRLE1BQU8sUUFBSyxLQUFHO0FBQ2pDLGlCQUFNLFNBQU0sR0FBRTtBQUNULHNCQUFLLEtBQ2I7QUFBQztBQUNHLGtCQUFLLEtBQU8sU0FBSyxHQUFLLEtBQU0sTUFBSztBQUM3QjtBQUNMLGlCQUFNLFNBQWEsVUFBRTtBQUNmLHlCQUNUO0FBQ0o7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFFUyx5Q0FBYyxpQkFBeEI7QUFDSSxnQkFBSyxVQUFlLG9CQUFHO0FBQ25CLGNBQ1I7QUFBQztBQUNTLHlDQUFjLGlCQUF4QixVQUFxQyxNQUFlO0FBQzFDLGdCQUFDLElBQXlCLHNCQUFLLE1BQ3pDO0FBQUM7QUFDUyx5Q0FBa0IscUJBQTVCO0FBQ08sYUFBSyxLQUE2Qiw2QkFBUTtBQUN6QyxjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBTSxNQUFPLFFBQUssS0FBRztBQUN6QyxpQkFBYSxZQUFRO0FBQ2xCLGlCQUFLLEtBQVUsU0FBSyxLQUFNLE1BQUcsR0FBSyxRQUFRLEtBQVEsT0FBRTtBQUMxQyw2QkFBTyxLQUFNLE1BQUssS0FBTSxNQUFHLEdBQ3hDO0FBQUM7QUFDRyxrQkFBTSxNQUFHLEdBQWUsZUFDaEM7QUFDSjtBQUFDO0FBQ1MseUNBQWEsZ0JBQXZCO0FBQ0ksYUFBUyxRQUFHLE9BQUssVUFBYyxtQkFBRztBQUMvQixhQUFNLFNBQVMsTUFBTyxPQUFPO0FBQzVCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFNLE1BQU8sUUFBSyxLQUFHO0FBQ3BDLHFCQUF3QixpQ0FBSSxJQUFLLEtBQU0sTUFBSztBQUM5QyxpQkFBTSxTQUFTLE1BQU8sT0FDN0I7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDa0I7QUFDbkIseUNBQW9CLHVCQUFwQixVQUFpQztBQUMxQixhQUFDLENBQUssS0FBTyxPQUFPLE9BQU07QUFDdkIsZ0JBQUssS0FBTSxNQUNyQjtBQUFDO0FBQ0QseUNBQW9CLHVCQUFwQixVQUFpQyxNQUFZO0FBQ3JDLGNBQTRCLDhCQUFRO0FBQ3hDLGFBQVksV0FBTyxLQUFPO0FBQ3ZCLGFBQUMsQ0FBVSxVQUFFO0FBQ0osd0JBQ1o7QUFBQztBQUNPLGtCQUFNLFFBQVM7QUFDbkIsY0FBWSxZQUFXO0FBQ3ZCLGNBQTRCLDhCQUNwQztBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBUyxTQUFtQixxQkFBUyxVQUFRLE1BQVMsU0FBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFJLElBQWE7QUFBRyxNQUE3RSxFQUFULEVBQzdDLEVBQU0sTUFBeUIseUJBQWUsZUFBbUIsbUJBQWUsZUFBZ0IsZ0JBQUU7QUFBb0IsWUFBQyxJQUF5QixzQkFBTTtBQUFHO0FBRW5KLHdCQUFTLFNBQVMsU0FBZSxnQkFBRSxDQUFDLEVBQU0sTUFBb0Isb0JBQVcsV0FBc0Isc0JBQ2pHLEVBQU0sTUFBbUIsbUJBQVMsU0FBTSxNQUFFLEVBQU0sTUFBbUIsbUJBQVMsU0FBRyxHQUFTLFNBQUUsQ0FBRSxHQUFHLEdBQUcsR0FBTyxPQUM3RztBQUFvQixZQUFDLElBQTZCLDBCQUFNO0FBQUMsSUFBYztBQUU1RCxrQ0FBUyxTQUFpQixpQkFBZSxnQkFBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQTZCLDBCQUFPLE1BQUUsRUFBUSxRQUFVLFNBQUUsRUFBUSxRQUFVLFNBQU8sT0FBSTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQ3pKakk7O0FBQ3lFOztBQUVwRTs7QUFHNUM7OztBQUdJLCtCQUFrQyxNQUErQjtBQUE5QyxjQUFJLE9BQVc7QUFBUyxjQUFRLFdBQWM7QUFGekQsY0FBWSxlQUFrQjtBQU0vQixjQUFTLFlBQTJCO0FBSHZDLGFBQVEsT0FBUTtBQUNaLGNBQVMsU0FBNkIsK0JBQUc7QUFBa0Isa0JBQTJCO0FBQzlGO0FBQUM7QUFFRCwyQkFBVyw0QkFBTztjQUFsQjtBQUFzQyxvQkFBSyxLQUFlO0FBQUM7Y0FDM0QsYUFBK0I7QUFDeEIsaUJBQUksT0FBUSxLQUFTLFNBQVE7QUFDNUIsa0JBQWEsZUFBTztBQUNwQixrQkFDUjtBQUFDOzt1QkFMMEQ7O0FBTXBELGdDQUFhLGdCQUFwQjtBQUNRLGNBQVEsVUFBTyxLQUFlO0FBQzlCLGNBQ1I7QUFBQztBQUNNLGdDQUFXLGNBQWxCLFVBQWtDO0FBQzFCLGNBQVUsVUFBSyxLQUFJO0FBQ25CLGNBQ1I7QUFBQztBQUNTLGdDQUFnQixtQkFBMUI7QUFDTyxhQUFLLEtBQTJCLDJCQUFLLEtBQzVDO0FBQUM7QUFDTSxnQ0FBUSxXQUFmO0FBQ0ksYUFBWSxXQUFPLEtBQW1CO0FBQ25DLGFBQVMsWUFBTSxHQUFRO0FBQzFCLGFBQVcsVUFBSztBQUNaLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFVLFVBQU8sUUFBSztBQUN2QyxpQkFBSyxLQUFrQixrQkFBSyxLQUFVLFVBQUssS0FBRTtBQUN4QyxzQkFBVSxVQUFHLEdBQVksY0FBTyxLQUFTLFNBQU0sUUFBTyxLQUFTLFNBQU0sUUFBTyxLQUFNLE1BQUksTUFBWSxZQUFPO0FBQ3pHLHNCQUFVLFVBQUcsR0FBWSxjQUFVLFVBQVcsV0FBSSxJQUFJLElBQUs7QUFFbkU7QUFDUjs7QUFBQztBQUNPLGdDQUFzQix5QkFBOUI7QUFDUSxjQUFLLEtBQXVCLHVCQUNwQztBQUFDO0FBQ08sZ0NBQWUsa0JBQXZCO0FBQ0ksYUFBTyxNQUFLO0FBQ1IsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQVUsVUFBTyxRQUFLLEtBQUc7QUFDMUMsaUJBQUssS0FBa0Isa0JBQUssS0FBVSxVQUFLLEtBQ2xEO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ08sZ0NBQWlCLG9CQUF6QixVQUF5QztBQUFtQixnQkFBSyxLQUFLLEtBQWtCLGtCQUFLO0FBQUM7QUFDdEYsZ0NBQVcsY0FBbkI7QUFBdUMsZ0JBQUssS0FBa0Isb0JBQU07QUFBQztBQUN6RSxZQUFDO0FBRUQ7O0FBQStCLDBCQUFJO0FBaUIvQix3QkFBb0M7QUFBeEIsMkJBQXdCO0FBQXhCLG9CQUF3Qjs7QUFDaEMscUJBQVE7QUFETyxjQUFJLE9BQWE7QUFWNUIsY0FBUyxZQUFpQztBQUMxQyxjQUFlLGtCQUF5QjtBQUNoRCxjQUFTLFlBQXdCLElBQTBCO0FBQ3BELGNBQUksT0FBaUI7QUFDckIsY0FBUyxZQUFjO0FBRXZCLGNBQUssUUFBYztBQUNuQixjQUFZLGVBQVcsQ0FBRztBQUN6QixjQUFRLFdBQVcsQ0FBRztBQUN0QixjQUFZLGVBQWlCO0FBRzdCLGNBQVEsVUFBWSxVQUFhO0FBQ3JDLGFBQVEsT0FBUTtBQUNaLGNBQVUsVUFBSyxPQUFHLFVBQWU7QUFDOUIsaUJBQUssS0FBSyxRQUFTLE1BQUU7QUFDZix1QkFBUSxRQUFLLEtBQ3RCO0FBQUM7QUFDSyxvQkFBTSxNQUFVLFVBQUssS0FBSyxLQUFLLE1BQ3pDO0FBQ0o7QUFBQztBQXpCYyxlQUFTLFlBQXhCO0FBQ1UsZ0JBQU0sUUFBWSxVQUM1QjtBQUFDO0FBd0JELDJCQUFXLHFCQUFFO2NBQWI7QUFBZ0Msb0JBQUssS0FBVTtBQUFDOzt1QkFBQTs7QUFDaEQsMkJBQVcscUJBQUk7Y0FBZjtBQUNRLGtCQUFVLFlBQU8sS0FBYTtBQUM1QixvQkFBSyxLQUNmO0FBQUM7O3VCQUFBOztBQUNELDJCQUFXLHFCQUFRO2NBQW5CO0FBQThCLG9CQUFFLENBQUssS0FBTSxJQUFaLElBQW9CLEtBQUssS0FBWSxlQUFVO0FBQUM7O3VCQUFBOztBQUN4RSx5QkFBaUIsb0JBQXhCLFVBQStDO0FBQW1CLGdCQUFTLFNBQVEsV0FBUSxLQUFlO0FBQUM7QUFDakcseUJBQVMsWUFBbkIsVUFBMEM7QUFBNEIsZ0JBQUMsSUFBb0IsaUJBQUssTUFBYTtBQUFDO0FBQzlHLDJCQUFZLHFCQUFZO2NBQXhCO0FBQW1DLG9CQUFLLEtBQUssUUFBUSxLQUFLLEtBQWU7QUFBQzs7dUJBQUE7O0FBQ2xFLHlCQUFTLFlBQWpCO0FBQ0ksYUFBVSxTQUFHLElBQThCO0FBQzNDLGFBQXVCLHNCQUFHLENBQUc7QUFDN0IsYUFBUSxPQUFRO0FBQ1osY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQVUsVUFBTyxRQUFLLEtBQUc7QUFDN0MsaUJBQUssSUFBTyxLQUFVLFVBQUk7QUFDcEIsb0JBQUssS0FBSyxLQUFVLFVBQUs7QUFDNUIsaUJBQUUsRUFBa0Isa0JBQUU7QUFDRix1Q0FBSztBQUNsQix3QkFBRyxHQUFZLFlBQ3pCO0FBQU0sb0JBQUU7QUFDRCxxQkFBb0Isc0JBQUssR0FBb0Isc0JBQUs7QUFDL0Msd0JBQXFCLHFCQUFZLFlBQzNDO0FBQ0o7QUFBQztBQUNHLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUyxPQUFPLFFBQUssS0FBRztBQUMvQixvQkFBRyxHQUNiO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ0QseUJBQXNCLHlCQUF0QixVQUE0QztBQUNyQyxhQUFDLENBQUssS0FBUyxZQUFJLENBQUssS0FBVyxXQUFRO0FBQzlDLGFBQVMsUUFBTyxLQUFVLFVBQVEsUUFBTTtBQUNwQyxjQUFDLElBQUssSUFBUSxPQUFHLEtBQUssR0FBSyxLQUFHO0FBQzNCLGlCQUFLLEtBQVUsVUFBRyxHQUFVLFVBQVEsUUFBSSxJQUFVLFlBQUcsQ0FBRyxHQUFFO0FBQ3JELHNCQUFVLFVBQUcsR0FBaUI7QUFFdEM7QUFDSjtBQUNKO0FBQUM7QUFDRCwyQkFBVyxxQkFBYztjQUF6QjtBQUFvQyxvQkFBSyxLQUFLLFFBQVEsT0FBTyxLQUFLLEtBQVksWUFBSyxLQUFPLFNBQU8sS0FBUTtBQUFDOzt1QkFBQTs7QUFDMUcsMkJBQVcscUJBQUc7Y0FBZDtBQUF5QixvQkFBSyxLQUFXO0FBQUM7Y0FDMUMsYUFBNEI7QUFDckIsaUJBQUssS0FBUyxZQUFVLE9BQVE7QUFDL0Isa0JBQVMsV0FBUztBQUNsQixrQkFBYSxhQUNyQjtBQUFDOzt1QkFMeUM7O0FBTTFDLDJCQUFXLHFCQUFPO2NBQWxCO0FBQXNDLG9CQUFLLEtBQWU7QUFBQztjQUMzRCxhQUFpQztBQUMxQixpQkFBTSxVQUFTLEtBQVMsU0FBUTtBQUMvQixrQkFBYSxlQUFTO0FBQ3ZCLGlCQUFLLEtBQUssUUFBUyxNQUFFO0FBQ2hCLHNCQUFLLEtBQXNCLHNCQUFLLE1BQU0sS0FDOUM7QUFDSjtBQUFDOzt1QkFQMEQ7O0FBUXBELHlCQUFPLFVBQWQ7QUFBaUMsZ0JBQVM7QUFBQztBQUMzQywyQkFBVyxxQkFBUztjQUFwQjtBQUF5QyxvQkFBSyxLQUFpQixpQkFBUTtBQUFDOzt1QkFBQTs7QUFDakUseUJBQWdCLG1CQUF2QixVQUFvRDtBQUM3QyxhQUFDLENBQUssS0FBUyxTQUFPLE9BQU87QUFDNUIsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQVUsVUFBTyxRQUFLLEtBQUc7QUFDMUMsaUJBQUssS0FBVSxVQUFHLE1BQXNCLG1CQUFVO0FBQ2xELGlCQUFLLEtBQVUsVUFBRyxHQUFTLFNBQU8sT0FDekM7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFFTSx5QkFBVyxjQUFsQixVQUF5QyxVQUFvQjtBQUFsQiw0QkFBa0I7QUFBbEIsc0JBQWtCOztBQUN0RCxhQUFTLFlBQVMsTUFBUTtBQUMxQixhQUFNLFFBQUksS0FBUyxTQUFRLEtBQVUsVUFBUSxRQUFFO0FBQzFDLGtCQUFVLFVBQUssS0FDdkI7QUFBTSxnQkFBRTtBQUNBLGtCQUFVLFVBQU8sT0FBTSxPQUFHLEdBQ2xDO0FBQUM7QUFDRSxhQUFLLEtBQUssUUFBUyxNQUFFO0FBQ1osc0JBQVEsUUFBSyxLQUFPO0FBQ3hCLGtCQUFLLEtBQWMsY0FBUyxVQUNwQztBQUNKO0FBQUM7QUFDTSx5QkFBYyxpQkFBckIsVUFBMEMsY0FBYztBQUNwRCxhQUFZLFdBQWtCLGlDQUFTLFNBQWUsZUFBYSxjQUFRO0FBQ3ZFLGNBQVksWUFBVztBQUNyQixnQkFDVjtBQUFDO0FBQ00seUJBQWMsaUJBQXJCLFVBQTRDO0FBQ3hDLGFBQVMsUUFBTyxLQUFVLFVBQVEsUUFBVztBQUMxQyxhQUFNLFFBQUssR0FBUTtBQUNsQixjQUFVLFVBQU8sT0FBTSxPQUFLO0FBQzdCLGFBQUssS0FBSyxRQUFTLE1BQUssS0FBSyxLQUFnQixnQkFDcEQ7QUFBQztBQUNNLHlCQUFrQixxQkFBekI7QUFDUSxjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBVSxVQUFPLFFBQUssS0FBRztBQUM3QyxpQkFBWSxXQUFPLEtBQVUsVUFBSTtBQUM5QixpQkFBQyxDQUFTLFNBQVEsV0FBSSxDQUFTLFNBQVUsVUFBVTtBQUNsRCxrQkFBVSxVQUFHLEdBQVM7QUFFOUI7QUFDSjtBQUFDO0FBQ00seUJBQXVCLDBCQUE5QjtBQUNRLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFVLFVBQU8sUUFBSyxLQUFHO0FBQzFDLGlCQUFDLENBQUssS0FBVSxVQUFHLEdBQVEsV0FBUSxLQUFVLFVBQUcsR0FBa0IscUJBQU0sR0FBVTtBQUNqRixrQkFBVSxVQUFHLEdBQU0sTUFBTztBQUVsQztBQUNKO0FBQUM7QUFDTSx5QkFBVyxjQUFsQjtBQUNpQiw2QkFDakI7QUFBQztBQUNNLHlCQUFTLFlBQWhCLFVBQTZDLGNBQXFDO0FBQWpFLG1DQUE0QjtBQUE1Qiw0QkFBNEI7O0FBQUUseUNBQW1DO0FBQW5DLGtDQUFtQzs7QUFDOUUsYUFBVSxTQUFTO0FBQ25CLGFBQXNCLHFCQUFRO0FBQzFCLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTyxLQUFVLFVBQU8sUUFBSyxLQUFHO0FBQzFDLGlCQUFLLEtBQVUsVUFBRyxHQUFRLFdBQVEsS0FBVSxVQUFHLEdBQVUsVUFBZSxlQUFFO0FBQ3RFLHFCQUFtQixzQkFBc0Isc0JBQVMsTUFBRTtBQUNqQywwQ0FBTyxLQUFVLFVBQ3ZDO0FBQUM7QUFDSywwQkFDVjtBQUNKO0FBQUM7QUFDRSxhQUFvQixvQkFBbUIsbUJBQU0sTUFBTztBQUNqRCxnQkFDVjtBQUFDO0FBQ00seUJBQWtCLHFCQUF6QixVQUFnRCxNQUE4QjtBQUE1QixrQ0FBNEI7QUFBNUIsMkJBQTRCOztBQUN2RSxhQUFZLGVBQUksQ0FBSyxLQUFTLFNBQVE7QUFDckMsY0FBQyxJQUFLLElBQVksR0FBRyxJQUFPLEtBQVUsVUFBTyxRQUFLLEtBQUc7QUFDbEQsaUJBQVksZUFBSSxDQUFLLEtBQVUsVUFBRyxHQUFTLFNBQVU7QUFDcEQsa0JBQUssS0FBSyxLQUFVLFVBQzVCO0FBQ0o7QUFBQztBQUNNLHlCQUFZLGVBQW5CLFVBQTBDO0FBQ25DLGFBQUMsQ0FBSyxLQUFXLFdBQVE7QUFDekIsYUFBQyxDQUFLLEtBQWlCLGlCQUFLLEtBQWdCLGtCQUFzQixnQ0FBSyxLQUFZO0FBQ2xGLGNBQWdCLGdCQUFXLGFBQU8sS0FBVztBQUM3QyxjQUFRLFVBQU8sS0FBZ0IsZ0JBQUksSUFDM0M7QUFBQztBQUNTLHlCQUFZLGVBQXRCLFVBQW9DLE9BQ3BDLENBQUM7QUFqS2MsZUFBVyxjQUFPO0FBa0tyQyxZQUFDO0FBQUE7QUFDUyx3QkFBUyxTQUFTLFNBQU8sUUFBRSxDQUFPLFFBQUUsRUFBTSxNQUFhLGFBQWUsZUFBYyxjQUFFLEVBQU0sTUFBbUIsbUJBQVMsU0FBUSxRQUFhLGFBQVUsVUFBRTtBQUFvQixZQUFDLElBQWlCO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDNU5ySzs7QUFDVTs7QUFHakQ7OztBQUEyQyxzQ0FBb0I7QUFDM0Qsb0NBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUV2QjtBQUFDO0FBQ1MscUNBQVcsY0FBckIsVUFBOEI7QUFDdkIsYUFBQyxDQUFJLE9BQUksQ0FBTSxNQUFRLFFBQU0sTUFBTyxPQUFPO0FBQ3hDLGdCQUFJLElBQVEsUUFBSyxLQUFVLFVBQU8sVUFDNUM7QUFBQztBQUNTLHFDQUFpQixvQkFBM0IsVUFBb0M7QUFDN0IsYUFBQyxDQUFJLE9BQUksQ0FBTSxNQUFRLFFBQU0sTUFBTyxPQUFLO0FBRXhDLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBTSxJQUFPLFFBQUssS0FBRztBQUMvQixpQkFBSSxJQUFHLE1BQVEsS0FBVSxVQUFPLE9BQU8sT0FBSztBQUM1QyxpQkFBSyxLQUFnQixnQkFBSSxJQUFLLEtBQUU7QUFDM0Isc0JBQVEsVUFBTSxJQUFJO0FBQ3RCLHFCQUFVLFNBQU0sSUFBUztBQUNuQix3QkFBRyxLQUFPLEtBQVUsVUFBTztBQUMzQix3QkFDVjtBQUNKO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ1MscUNBQWUsa0JBQXpCLFVBQWtDO0FBQzNCLGFBQUMsQ0FBSSxPQUFJLENBQUksSUFBUSxRQUFPLE9BQUs7QUFDaEMsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFNLElBQU8sUUFBSyxLQUFHO0FBQy9CLGlCQUFJLElBQUcsTUFBUSxLQUFVLFVBQU8sT0FBRTtBQUM5QixxQkFBSyxLQUFjLGNBQUU7QUFDcEIseUJBQVUsU0FBTSxJQUFTO0FBQ25CLDRCQUFHLEtBQU8sS0FBYztBQUN4Qiw0QkFDVjtBQUNKO0FBQ0o7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDTSxxQ0FBTyxVQUFkO0FBQ1UsZ0JBQ1Y7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUNTLHdCQUFTLFNBQVMsU0FBVyxZQUFJLElBQUU7QUFBb0IsWUFBQyxJQUF5QixzQkFBTTtBQUFDLElBQWtCO0FBQ3JHLGtDQUFTLFNBQWlCLGlCQUFXLFlBQUUsVUFBSztBQUFPLFNBQUssSUFBRyxJQUF5QixzQkFBTyxNQUFFLEVBQVEsVUFBa0IsaUNBQWdCLGVBQU8sT0FBSTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQzVDakk7O0FBQ0k7O0FBR3ZDOzs7QUFBMEMscUNBQVE7QUFHOUMsbUNBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUFRO0FBRnhCLGNBQUksT0FBYTtBQUNqQixjQUFJLE9BR1g7QUFBQztBQUNNLG9DQUFPLFVBQWQ7QUFDVSxnQkFDVjtBQUFDO0FBQ0Qsb0NBQU8sVUFBUDtBQUNVLGdCQUFDLE9BQUssVUFBUSxhQUFFLFNBQVEsS0FBTSxTQUN4QztBQUFDO0FBQ0wsWUFBQztBQUFBO0FBQ1Msd0JBQVMsU0FBUyxTQUFVLFdBQUUsQ0FBQyxFQUFNLE1BQWUsZUFBUyxTQUFNLE1BQUUsRUFBTSxNQUFlLGVBQVMsU0FBTSxNQUFFO0FBQW9CLFlBQUMsSUFBd0IscUJBQU07QUFBQyxJQUFjO0FBQ3hLLGtDQUFTLFNBQWlCLGlCQUFVLFdBQUUsVUFBSztBQUFhLFlBQUMsSUFBd0IscUJBQVE7QUFBRyxJOzs7Ozs7Ozs7Ozs7QUNsQnBFOztBQUNVOztBQUNPOztBQUd4RDs7O0FBQTJDLHNDQUFrQjtBQUV6RCxvQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BRXZCO0FBQUM7QUFDRCwyQkFBVyxpQ0FBYztjQUF6QjtBQUFvQyxvQkFBTSxLQUFxQixtQkFBMUIsR0FBaUMsS0FBb0Isc0JBQXFCLGtDQUFVLFVBQW9CO0FBQUM7Y0FDOUksYUFBMEM7QUFBUSxrQkFBb0Isc0JBQWE7QUFBQzs7dUJBRDBEOztBQUV2SSxxQ0FBTyxVQUFkO0FBQ1UsZ0JBQ1Y7QUFBQztBQUNELHFDQUEwQiw2QkFBMUI7QUFBcUMsZ0JBQU87QUFBQztBQUNqRCxZQUFDO0FBQUE7QUFDUyx3QkFBUyxTQUFTLFNBQVcsZUFBUyxNQUFrQixrQkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFJLElBQXNCO0FBQUcsTUFBL0YsRUFBRCxHQUNyQztBQUFvQixZQUFDLElBQXlCLHNCQUFNO0FBQUMsSUFBZ0I7QUFDMUQsa0NBQVMsU0FBaUIsaUJBQVcsWUFBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQXlCLHNCQUFPLE1BQUUsRUFBUSxVQUFrQixpQ0FBZ0IsZUFBTyxPQUFJO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDbkJqSTs7QUFDSTs7QUFDVTs7QUFFRzs7QUFHcEQ7OztBQUF1QyxrQ0FBUTtBQVEzQyxnQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFQdkIsY0FBZ0IsbUJBQWtCO0FBQ2xDLGNBQVcsY0FRbkI7QUFBQztBQUNNLGlDQUFPLFVBQWQ7QUFDVSxnQkFDVjtBQUFDO0FBQ0QsMkJBQVcsNkJBQVc7Y0FBdEI7QUFBaUMsb0JBQUssS0FBbUI7QUFBQztjQUMxRCxhQUFxQztBQUFRLGtCQUFpQixtQkFBVTtBQUFDOzt1QkFEZjs7QUFFbkQsaUNBQVEsV0FBZixVQUEwQjtBQUN0QixhQUFRLE9BQVE7QUFDYixhQUFLLEtBQU8sVUFBSSxNQUFZLE9BQVcsV0FBSyxLQUFLLE1BQU0sTUFBTSxLQUFnQixpQkFBRSxVQUF3QjtBQUFRLGtCQUFZLGNBQVMsVUFBa0I7QUFBRyxVQUFwSSxHQUE0STtBQUNoSyxjQUFhLGFBQ3JCO0FBQUM7QUFFUyxpQ0FBWSxlQUF0QixVQUFpQztBQUMxQixhQUFDLENBQVksWUFBUTtBQUNyQixhQUFDLENBQUssS0FBWSxlQUFJLENBQUssS0FBaUIsaUJBQVE7QUFDcEQsYUFBSyxLQUFtQixtQkFBTyxPQUFRO0FBQzFDLGFBQWMsYUFBRyxJQUFpQjtBQUNsQyxhQUFRLE9BQVE7QUFDTixvQkFBTyxTQUFHLFVBQVc7QUFDeEIsaUJBQUssS0FBYSxhQUFFO0FBQ2Ysc0JBQWEsZUFBTyxLQUFZLFlBQU0sUUFBYSxXQUFPLFNBQVE7QUFDbEUsc0JBQWEsYUFBSyxLQUMxQjtBQUFDO0FBQ0UsaUJBQUssS0FBaUIsaUJBQUU7QUFDbkIsc0JBQU0sUUFBYSxXQUMzQjtBQUNKO0FBQUM7QUFDUyxvQkFBYyxjQUM1QjtBQUFDO0FBQ1MsaUNBQWdCLG1CQUExQixVQUFxRDtBQUNqRCxnQkFBSyxVQUFpQiw0QkFBUztBQUM1QixhQUFLLEtBQWEsYUFBRTtBQUNmLGtCQUFPLE9BQUssS0FBZ0IsdUJBQW1CLGtDQUFVLFVBQ2pFO0FBQ0o7QUFBQztBQUNPLGlDQUFrQixxQkFBMUIsVUFBcUM7QUFDakMsYUFBZSxjQUFPLEtBQU8sU0FBTyxLQUFPLE9BQU8sU0FBSztBQUNuRCxjQUFPLFNBQU07QUFDZCxhQUFLLEtBQVEsVUFBSSxLQUFRLEtBQUssT0FBTyxLQUFTLFNBQUU7QUFDM0Msa0JBQU8sT0FBSyxLQUFvQiwyQkFBSyxLQUM3QztBQUFDO0FBQ0UsYUFBWSxlQUFRLEtBQU8sT0FBTyxVQUFRLEtBQU8sT0FBTyxTQUFLLEdBQUU7QUFDMUQsa0JBQWEsYUFBSyxLQUMxQjtBQUFDO0FBQ0ssZ0JBQUssS0FBTyxPQUFPLFNBQzdCO0FBQUM7QUFDTyxpQ0FBVyxjQUFuQixVQUE4QjtBQUN2QixhQUFDLENBQUssUUFBSSxDQUFLLEtBQU0sTUFBUTtBQUNoQyxhQUFPLE1BQU8sS0FBSyxLQUFlO0FBQzVCLGdCQUFJLElBQVEsUUFBUyxZQUMvQjtBQUFDO0FBQ0wsWUFBQztBQUFBO0FBQ1Msd0JBQVMsU0FBUyxTQUFPLFFBQUUsQ0FBc0IsdUJBQWUsZUFBYyxjQUEyQiwyQkFBbUIsbUJBQUU7QUFBb0IsWUFBQyxJQUFxQixrQkFBTTtBQUFDLElBQWM7QUFDeEwsa0NBQVMsU0FBaUIsaUJBQU8sUUFBRSxVQUFLO0FBQWEsWUFBQyxJQUFxQixrQkFBUTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQ3RFMUQ7O0FBQ0o7O0FBR3ZDOzs7QUFBdUMsa0NBQVk7QUFFL0MsZ0NBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUV2QjtBQUFDO0FBQ00saUNBQU8sVUFBZDtBQUNVLGdCQUNWO0FBQUM7QUFDRCwyQkFBVyw2QkFBSTtjQUFmO0FBQWtDLG9CQUFLLEtBQVk7QUFBQztjQUNwRCxhQUE2QjtBQUNyQixrQkFBVSxZQUNsQjtBQUFDOzt1QkFIbUQ7O0FBSXBELDJCQUFXLDZCQUFhO2NBQXhCO0FBQW1DLG9CQUFLLEtBQU8sU0FBTyxLQUFPLE9BQVksWUFBSyxLQUFNLFFBQU8sS0FBTztBQUFDOzt1QkFBQTs7QUFDdkcsWUFBQztBQUFBO0FBQ1Msd0JBQVMsU0FBUyxTQUFPLFFBQUUsQ0FBYSxjQUFFO0FBQW9CLFlBQUMsSUFBcUIsa0JBQU07QUFBQyxJQUFrQjtBQUN4RyxrQ0FBUyxTQUFpQixpQkFBTyxRQUFFLFVBQUs7QUFBYSxZQUFDLElBQXFCLGtCQUFRO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDbkI5RDs7QUFDVTs7QUFHakQ7OztBQUE2Qyx3Q0FBb0I7QUFDN0Qsc0NBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUV2QjtBQUFDO0FBQ00sdUNBQU8sVUFBZDtBQUNVLGdCQUNWO0FBQUM7QUFDRCx1Q0FBMEIsNkJBQTFCO0FBQXFDLGdCQUFPO0FBQUM7QUFDakQsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBUyxTQUFhLGNBQUksSUFBRTtBQUFvQixZQUFDLElBQTJCLHdCQUFNO0FBQUMsSUFBa0I7QUFFekcsa0NBQVMsU0FBaUIsaUJBQWEsY0FBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQTJCLHdCQUFPLE1BQUUsRUFBUSxVQUFrQixpQ0FBZ0IsZUFBTyxPQUFHO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDaEJ2STs7QUFDRzs7QUFDSTs7QUFHdkM7OztBQUF5QyxvQ0FBUTtBQVE3QyxrQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFOdkIsY0FBSyxRQUFtQjtBQUN6QixjQUFzQix5QkFBZ0I7QUFDdEMsY0FBc0IseUJBTTdCO0FBQUM7QUFDRCwyQkFBSSwrQkFBVTtjQUFkO0FBQXFDLG9CQUFLLEtBQVE7QUFBQztjQUNuRCxhQUFtQztBQUN0Qiw2QkFBUSxRQUFLLEtBQU0sT0FBWTtBQUNwQyxrQkFBYSxhQUFLLEtBQzFCO0FBQUM7O3VCQUprRDs7QUFLbkQsMkJBQUksK0JBQWlCO2NBQXJCO0FBQ08saUJBQUssS0FBVyxXQUFPLFNBQUssR0FBTyxPQUFLLEtBQVk7QUFDakQsb0JBQW9CLG9CQUM5QjtBQUFDOzt1QkFBQTs7QUFDTSxtQ0FBTyxVQUFkO0FBQ1UsZ0JBQ1Y7QUFBQztBQUNNLG1DQUFjLGlCQUFyQjtBQUF5QyxnQkFBTztBQUFDO0FBQzFDLG1DQUFZLGVBQW5CO0FBQXVDLGdCQUFPO0FBQUM7QUFDL0MsbUNBQTBCLDZCQUExQjtBQUFxQyxnQkFBTztBQUFDO0FBeEJ0Qyx5QkFBaUIsb0JBQW1CO0FBeUIvQyxZQUFDO0FBQUE7QUFDUSxpQkFBUSxRQUFvQixvQkFBa0IsbUJBQUUsQ0FBRSxHQUFHLEdBQUcsR0FBRyxHQUFNO0FBQ2hFLHdCQUFTLFNBQVMsU0FBUyxXQUF1Qix3QkFBUSxNQUF5Qix5QkFBWSxZQUFFLG9CQUFrQjtBQUFVLGdCQUFVLGdCQUFRLFFBQUksSUFBYztBQUFDLE1BQTlHLEVBQTBILFlBQUUsb0JBQWtCLEtBQVk7QUFBTyxhQUFXLGFBQVU7QUFBRSxRQUEvTSxFQUNYLDBCQUEyQiwyQkFBRTtBQUFvQixZQUFDLElBQXVCLG9CQUFNO0FBQUMsSUFBYztBQUMzRyxrQ0FBUyxTQUFpQixpQkFBUyxVQUFFLFVBQUs7QUFBYSxZQUFDLElBQXVCLG9CQUFRO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDbkN4RDs7QUFDVjs7QUFHdkM7OztBQUF1QyxrQ0FBUTtBQUczQyxnQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFGeEIsY0FBSSxPQUFjO0FBQ2xCLGNBQVMsWUFHaEI7QUFBQztBQUNNLGlDQUFPLFVBQWQ7QUFDVSxnQkFDVjtBQUFDO0FBQ0QsaUNBQU8sVUFBUDtBQUE0QixnQkFBQyxPQUFLLFVBQVEsYUFBRSxTQUFRLEtBQU0sU0FBUTtBQUFDO0FBQ25FLGlDQUEwQiw2QkFBMUI7QUFBcUMsZ0JBQU87QUFBQztBQUNuQyxpQ0FBVyxjQUFyQixVQUFtQztBQUN2QixvQkFBTyxLQUFpQixpQkFBVztBQUMzQyxnQkFBSyxVQUFZLHVCQUNyQjtBQUFDO0FBQ1MsaUNBQWdCLG1CQUExQixVQUF3QztBQUNqQyxhQUFDLENBQVUsVUFBTyxPQUFVO0FBQzVCLGFBQUssS0FBVSxhQUFZLFlBQVEsS0FBVSxhQUFZLFNBQUU7QUFDcEQsb0JBQUssS0FBUyxTQUFVLFlBQWEsV0FBVSxZQUN6RDtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNPLGlDQUFRLFdBQWhCLFVBQXNCO0FBQ1osZ0JBQUMsQ0FBTSxNQUFXLFdBQVEsV0FBWSxTQUNoRDtBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBUyxTQUFPLFFBQUUsQ0FBQyxFQUFNLE1BQWEsYUFBUyxTQUFRLFFBQVMsU0FBRSxDQUFRLFNBQVEsUUFBWSxZQUFrQixrQkFBUyxTQUFTLFNBQVUsVUFBWSxZQUFTLFNBQU8sT0FBUSxRQUFRLFFBQU8sT0FBVyxXQUN6TixFQUFNLE1BQWUsZUFBUyxTQUFPLE9BQUU7QUFBb0IsWUFBQyxJQUFxQixrQkFBTTtBQUFDLElBQWM7QUFFM0Ysa0NBQVMsU0FBaUIsaUJBQU8sUUFBRSxVQUFLO0FBQWEsWUFBQyxJQUFxQixrQkFBUTtBQUFHLEk7Ozs7Ozs7Ozs7Ozs7O0FDbEM5RDs7QUFDZ0U7O0FBRXZFOztBQUNtQjs7QUFDQzs7QUFDSDs7QUFFQzs7QUFJbEQ7OztBQUFpQyw0QkFBSTtBQXlEakMsMEJBQStCO0FBQW5CLDhCQUFtQjtBQUFuQix1QkFBbUI7O0FBQzNCLHFCQUFRO0FBekRMLGNBQVEsV0FBZ0I7QUFDeEIsY0FBWSxlQUFnQjtBQUM1QixjQUFRLFdBQWdCO0FBQ3hCLGNBQVUsYUFBZ0I7QUFDMUIsY0FBb0IsdUJBQWtCO0FBRXRDLGNBQWEsZ0JBQXNCO0FBQ25DLGNBQUssUUFBYztBQUNuQixjQUEyQiw4QkFBaUI7QUFDNUMsY0FBcUIsd0JBQWlCO0FBQ3RDLGNBQVMsWUFBaUI7QUFDMUIsY0FBYyxpQkFBaUI7QUFDL0IsY0FBYSxnQkFBYztBQUMzQixjQUFZLGVBQWU7QUFDM0IsY0FBa0IscUJBQWM7QUFDaEMsY0FBcUIsd0JBQWM7QUFDbkMsY0FBZSxrQkFBaUI7QUFDaEMsY0FBb0IsdUJBQWlCO0FBQ3JDLGNBQW1CLHNCQUFrQjtBQUNyQyxjQUFLLFFBQXFCLElBQXVCO0FBQ2pELGNBQVEsV0FBeUIsSUFBMkI7QUFDNUQsY0FBb0IsdUJBQWtCO0FBQ3JDLGNBQWdCLG1CQUFtQjtBQUNuQyxjQUFVLGFBQXNCO0FBQ2hDLGNBQWEsZ0JBQXNCO0FBSW5DLGNBQW9CLHVCQUFrQjtBQUN0QyxjQUF3QiwyQkFBZ0I7QUFDeEMsY0FBMEIsNkJBQWlCO0FBQzNDLGNBQVcsY0FBYztBQUN6QixjQUFXLGNBQWtCO0FBQzdCLGNBQVMsWUFBa0I7QUFDM0IsY0FBbUIsc0JBQXNCO0FBRXpDLGNBQXlCLDRCQUFrQjtBQUMzQyxjQUFTLFlBQWtCO0FBQzNCLGNBQWlCLG9CQUFrQjtBQUVwQyxjQUFVLGFBQTRGO0FBQ3RHLGNBQWEsZ0JBQTRGO0FBQ3pHLGNBQW9CLHVCQUF3SDtBQUM1SSxjQUFjLGlCQUF3SDtBQUN0SSxjQUFnQixtQkFBd0g7QUFDeEksY0FBb0IsdUJBQXdIO0FBQzVJLGNBQWUsa0JBQXdIO0FBQ3ZJLGNBQWlCLG9CQUF3SDtBQUN6SSxjQUFrQixxQkFBd0g7QUFFMUksY0FBYSxnQkFBd0g7QUFDckksY0FBWSxlQUF3SDtBQUNwSSxjQUFXLGNBQXdIO0FBQ25JLGNBQVksZUFBd0g7QUFDcEksY0FBVSxhQUEwQjtBQUl2QyxhQUFRLE9BQVE7QUFDWixjQUFpQixtQkFBMEI7QUFDM0MsY0FBaUIsaUJBQVcsYUFBRyxVQUFzQjtBQUFVLG9CQUFLLEtBQXNCLHNCQUFRO0FBQUU7QUFDcEcsY0FBaUIsaUJBQVUsWUFBRyxVQUFzQjtBQUFVLG9CQUFLLEtBQXNCLHNCQUFRO0FBQUU7QUFDbkcsY0FBTSxNQUFLLE9BQUcsVUFBZTtBQUN4QixtQkFBSyxPQUFRO0FBQ1osb0JBQU0sTUFBVSxVQUFLLEtBQUssS0FBSyxNQUN6QztBQUFFO0FBQ0UsY0FBUyxTQUFLLE9BQUcsVUFBZTtBQUMzQixtQkFBUyxTQUFPO0FBQ2Ysb0JBQU0sTUFBVSxVQUFLLEtBQUssS0FBSyxNQUN6QztBQUFFO0FBQ0UsY0FBNkI7QUFDN0IsY0FBb0I7QUFDckIsYUFBUyxTQUFFO0FBQ04sa0JBQWMsY0FBVTtBQUN6QixpQkFBSyxLQUFVLFVBQUU7QUFDWixzQkFBc0Isc0JBQUssS0FDbkM7QUFDSjtBQUFDO0FBQ0csY0FDUjtBQUFDO0FBQ00sMkJBQU8sVUFBZDtBQUFpQyxnQkFBVztBQUFDO0FBQzdDLDJCQUFXLHVCQUFNO2NBQWpCO0FBQW9DLG9CQUFLLEtBQWM7QUFBQztjQUN4RCxhQUErQjtBQUN2QixrQkFBWSxjQUFTO0FBQ1AsK0NBQWMsZ0JBQ3BDO0FBQUM7O3VCQUp1RDs7QUFLakQsMkJBQVksZUFBbkIsVUFBK0I7QUFBVSxnQkFBbUIsa0NBQVUsVUFBTztBQUFDO0FBQzlFLDJCQUFXLHVCQUFlO2NBQTFCO0FBQTZDLG9CQUFLLEtBQWEsYUFBaUI7QUFBQzs7dUJBQUE7O0FBQ2pGLDJCQUFXLHVCQUFZO2NBQXZCO0FBQWtDLG9CQUFNLEtBQW1CLGlCQUF4QixHQUErQixLQUFrQixvQkFBTyxLQUFhLGFBQWtCO0FBQUM7Y0FDM0gsYUFBd0M7QUFBUSxrQkFBa0Isb0JBQWE7QUFBQzs7dUJBRDJDOztBQUUzSCwyQkFBVyx1QkFBWTtjQUF2QjtBQUFrQyxvQkFBTSxLQUFtQixpQkFBeEIsR0FBK0IsS0FBa0Isb0JBQU8sS0FBYSxhQUFrQjtBQUFDO2NBQzNILGFBQXdDO0FBQVEsa0JBQWtCLG9CQUFhO0FBQUM7O3VCQUQyQzs7QUFFM0gsMkJBQVcsdUJBQVk7Y0FBdkI7QUFBa0Msb0JBQU0sS0FBbUIsaUJBQXhCLEdBQStCLEtBQWtCLG9CQUFPLEtBQWEsYUFBa0I7QUFBQztjQUMzSCxhQUF3QztBQUFRLGtCQUFrQixvQkFBYTtBQUFDOzt1QkFEMkM7O0FBRTNILDJCQUFXLHVCQUFlO2NBQTFCO0FBQThDLG9CQUFLLEtBQXVCO0FBQUM7Y0FDM0UsYUFBeUM7QUFDbEMsaUJBQU0sVUFBUyxLQUFpQixpQkFBUTtBQUN2QyxrQkFBcUIsdUJBQVM7QUFDOUIsa0JBQ1I7QUFBQzs7dUJBTDBFOztBQU0zRSwyQkFBVyx1QkFBbUI7Y0FBOUI7QUFBaUQsb0JBQUssS0FBMkI7QUFBQztjQUNsRixhQUE0QztBQUNyQyxpQkFBTSxVQUFTLEtBQXFCLHFCQUFRO0FBQzNDLGtCQUF5QiwyQkFBUztBQUNsQyxrQkFDUjtBQUFDOzt1QkFMaUY7Ozs7QUFNbEYsMkJBQVcsdUJBQWM7Y0FBekI7QUFBb0Msb0JBQUssS0FBWSxZQUFLLEtBQVM7QUFBQzs7dUJBQUE7O0FBQ3BFLDJCQUFXLHVCQUFxQjtjQUFoQztBQUFtRCxvQkFBSyxLQUE2QjtBQUFDO2NBQ3RGLGFBQThDO0FBQ3ZDLGlCQUFNLFVBQVMsS0FBNEIsNEJBQVE7QUFDbEQsa0JBQTJCLDZCQUNuQztBQUFDOzt1QkFKcUY7Ozs7QUFLdEYsMkJBQVcsdUJBQUk7Y0FBZjtBQUFrQyxvQkFBSyxLQUFZO0FBQUM7Y0FDcEQsYUFBNkI7QUFDdEIsaUJBQU0sU0FBUSxLQUFNLE1BQVE7QUFDNUIsaUJBQU0sU0FBVSxVQUFTLFNBQWMsV0FBUTtBQUM5QyxrQkFBVSxZQUNsQjtBQUFDOzt1QkFMbUQ7O0FBTXBELDJCQUFXLHVCQUFJO2NBQWY7QUFDSSxpQkFBVSxTQUFNO0FBQ1osa0JBQUMsSUFBTyxPQUFRLEtBQVksWUFBRTtBQUN4Qix3QkFBSyxPQUFPLEtBQVcsV0FDakM7QUFBQztBQUNLLG9CQUNWO0FBQUM7Y0FDRCxhQUF5QjtBQUNqQixrQkFBVyxhQUFNO0FBQ2xCLGlCQUFNLE1BQUU7QUFDSCxzQkFBQyxJQUFPLE9BQVMsTUFBRTtBQUNmLDBCQUFXLFdBQUssT0FBTyxLQUFNO0FBQzdCLDBCQUFjLGNBQUksS0FBTSxLQUFLLE1BQ3JDO0FBQ0o7QUFBQztBQUNHLGtCQUFvQztBQUNwQyxrQkFDUjtBQUFDOzt1QkFYQTs7QUFZRCwyQkFBVyx1QkFBUTtjQUFuQjtBQUNJLGlCQUFVLFNBQU07QUFDWixrQkFBQyxJQUFPLE9BQVEsS0FBWSxZQUFFO0FBQzNCLHFCQUFJLElBQVEsUUFBSyxLQUFlLGlCQUFLLEdBQUU7QUFDaEMsNEJBQUssT0FBTyxLQUFXLFdBQ2pDO0FBQ0o7QUFBQztBQUNLLG9CQUNWO0FBQUM7O3VCQUFBOztBQUNELDJCQUFJLHVCQUFZO2NBQWhCO0FBQ08saUJBQUssS0FBYyxjQUFPLE9BQUssS0FBTztBQUN6QyxpQkFBVSxTQUFHLElBQXVCO0FBQ2hDLGtCQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBTSxNQUFPLFFBQUssS0FBRztBQUN0QyxxQkFBSyxLQUFNLE1BQUcsR0FBVyxXQUFFO0FBQ3BCLDRCQUFLLEtBQUssS0FBTSxNQUMxQjtBQUNKO0FBQUM7QUFDSyxvQkFDVjtBQUFDOzt1QkFBQTs7QUFDRCwyQkFBVyx1QkFBTztjQUFsQjtBQUFzQyxvQkFBSyxLQUFNLE1BQU8sVUFBTztBQUFDOzt1QkFBQTs7QUFDaEUsMkJBQVcsdUJBQVM7Y0FBcEI7QUFDVSxvQkFBSyxLQUFNLE1BQ3JCO0FBQUM7O3VCQUFBOztBQUNELDJCQUFXLHVCQUFnQjtjQUEzQjtBQUNVLG9CQUFLLEtBQWEsYUFDNUI7QUFBQzs7dUJBQUE7O0FBQ0QsMkJBQVcsdUJBQVc7Y0FBdEI7QUFDSSxpQkFBVSxTQUFPLEtBQWM7QUFDNUIsaUJBQUssS0FBaUIsb0JBQVMsTUFBRTtBQUM3QixxQkFBTyxPQUFRLFFBQUssS0FBa0Isb0JBQUssR0FBRTtBQUN4QywwQkFBWSxjQUNwQjtBQUNKO0FBQUM7QUFDRSxpQkFBSyxLQUFpQixvQkFBUSxRQUFVLE9BQU8sU0FBSyxHQUFFO0FBQ2pELHNCQUFZLGNBQVMsT0FDN0I7QUFBQztBQUNLLG9CQUFLLEtBQ2Y7QUFBQztjQUNELGFBQXVDO0FBQ25DLGlCQUFVLFNBQU8sS0FBYztBQUM1QixpQkFBTSxTQUFRLFFBQVUsT0FBUSxRQUFPLFNBQUssR0FBUTtBQUNwRCxpQkFBTSxTQUFRLEtBQWtCLGtCQUFRO0FBQzNDLGlCQUFZLFdBQU8sS0FBa0I7QUFDakMsa0JBQWlCLG1CQUFTO0FBQzFCLGtCQUFtQixtQkFBTSxPQUNqQztBQUFDOzt1QkFSQTs7QUFTRCwyQkFBVyx1QkFBYTtjQUF4QjtBQUNVLG9CQUFLLEtBQWEsYUFBUSxRQUFLLEtBQ3pDO0FBQUM7Y0FDRCxhQUFzQztBQUNsQyxpQkFBVSxTQUFPLEtBQWM7QUFDNUIsaUJBQU0sUUFBSSxLQUFTLFNBQVEsS0FBYSxhQUFRLFFBQVE7QUFDdkQsa0JBQVksY0FBTyxLQUFhLGFBQ3hDO0FBQUM7O3VCQUxBOztBQU1NLDJCQUFrQixxQkFBekI7QUFDTyxhQUFLLEtBQWtCLGtCQUFFO0FBQ3BCLGtCQUFpQixpQkFBZTtBQUNoQyxrQkFBaUIsaUJBQ3pCO0FBQ0o7QUFBQztBQUNELDJCQUFXLHVCQUFLO2NBQWhCO0FBQ08saUJBQUssS0FBVyxXQUFPLE9BQVc7QUFDbEMsaUJBQUssS0FBYSxhQUFPLE9BQWE7QUFDbkMsb0JBQU0sS0FBYSxXQUFsQixHQUE4QixZQUN6QztBQUFDOzt1QkFBQTs7QUFDTSwyQkFBSyxRQUFaLFVBQXNDLFdBQStCO0FBQXhELGdDQUF5QjtBQUF6Qix5QkFBeUI7O0FBQUUsb0NBQTZCO0FBQTdCLDZCQUE2Qjs7QUFDOUQsYUFBVyxXQUFFO0FBQ1Isa0JBQUssT0FBUTtBQUNiLGtCQUFjLGdCQUN0QjtBQUFDO0FBQ0csY0FBWSxjQUFTO0FBQ3RCLGFBQWMsaUJBQVEsS0FBaUIsbUJBQUssR0FBRTtBQUN6QyxrQkFBWSxjQUFPLEtBQWEsYUFDeEM7QUFDSjtBQUFDO0FBQ1MsMkJBQVcsY0FBckIsVUFBOEIsS0FBVztBQUNsQyxhQUFDLENBQUssUUFBSSxDQUFLLEtBQVE7QUFDdEIsY0FBQyxJQUFPLE9BQVEsS0FBRTtBQUNsQixpQkFBUyxRQUFNLElBQU07QUFDbEIsaUJBQU0sU0FBSSxRQUFZLDBEQUFjLFVBQUU7QUFDbEMscUJBQUMsQ0FBSyxLQUFNLE1BQUssS0FBSyxPQUFNO0FBQzNCLHNCQUFZLFlBQU0sT0FBTSxLQUNoQztBQUFNLG9CQUFFO0FBQ0Esc0JBQUssT0FDYjtBQUNKO0FBQ0o7QUFBQztBQUNTLDJCQUFrQixxQkFBNUIsVUFBZ0QsVUFBcUI7QUFDN0QsY0FBcUIscUJBQUssS0FBSyxNQUFFLEVBQWtCLGtCQUFVLFVBQWtCLGtCQUN2RjtBQUFDO0FBQ00sMkJBQVcsY0FBbEI7QUFDTyxhQUFLLEtBQVksZUFBUyxNQUFPLE9BQUc7QUFDdkMsYUFBUyxRQUFPLEtBQWEsYUFBUSxRQUFLLEtBQWEsZUFBSztBQUN0RCxnQkFBSyxLQUFNLEtBQU0sUUFBTSxNQUFPLEtBQ3hDO0FBQUM7QUFDRCwyQkFBVyx1QkFBVTtjQUFyQjtBQUF5QyxvQkFBSyxLQUFLLFFBQVk7QUFBQzs7dUJBQUE7O0FBQ2hFLDJCQUFXLHVCQUFhO2NBQXhCO0FBQTRDLG9CQUFLLEtBQUssUUFBZTtBQUFDOzt1QkFBQTs7QUFDdEUsMkJBQVcsdUJBQVk7Y0FBdkI7QUFBMkMsb0JBQUssS0FBb0I7QUFBQzs7dUJBQUE7O0FBQzlELDJCQUFhLGdCQUFwQixVQUFtQztBQUMzQixjQUFrQixvQkFDMUI7QUFBQztBQUNELDJCQUFXLHVCQUFTO2NBQXBCO0FBQ08saUJBQUMsQ0FBSyxLQUFZLFlBQU8sT0FBTztBQUNuQyxpQkFBVyxVQUFXLFNBQVE7QUFDeEIsb0JBQVEsV0FBVyxRQUFRLFFBQUssS0FBVyxhQUFXLFdBQUcsQ0FDbkU7QUFBQzs7dUJBQUE7O0FBQ00sMkJBQVMsWUFBaEI7QUFDTyxhQUFDLENBQUssS0FBWSxZQUFRO0FBQ3JCLGtCQUFPLFNBQU8sS0FBVyxhQUNyQztBQUFDO0FBQ00sMkJBQVksZUFBbkI7QUFDTyxhQUFDLENBQUssS0FBWSxZQUFRO0FBQ3JCLGtCQUFPLFNBQU8sS0FBVyxhQUNyQztBQUFDO0FBQ00sMkJBQVEsV0FBZjtBQUNPLGFBQUssS0FBWSxZQUFPLE9BQU87QUFDL0IsYUFBSyxLQUFXLGNBQVEsS0FBd0Isd0JBQU8sT0FBTztBQUM5RCxhQUFLLEtBQXNCLHNCQUFPLE9BQU87QUFDeEMsY0FBYztBQUNaLGdCQUNWO0FBQUM7QUFDRCwyQkFBSSx1QkFBc0I7Y0FBMUI7QUFDTyxpQkFBSyxLQUFZLGVBQVMsTUFBTyxPQUFNO0FBQ3BDLG9CQUFLLEtBQVksWUFBVSxVQUFLLE1BQzFDO0FBQUM7O3VCQUFBOztBQUNNLDJCQUFRLFdBQWY7QUFDTyxhQUFLLEtBQWEsYUFBTyxPQUFPO0FBQ25DLGFBQVUsU0FBTyxLQUFjO0FBQy9CLGFBQVMsUUFBUyxPQUFRLFFBQUssS0FBYztBQUN6QyxjQUFZLGNBQVMsT0FBTSxRQUNuQztBQUFDO0FBQ00sMkJBQWdCLG1CQUF2QjtBQUNPLGFBQUssS0FBVyxjQUFRLEtBQXdCLHdCQUFPLE9BQU87QUFDOUQsYUFBSyxLQUFzQixzQkFBTyxPQUFPO0FBQ3hDLGNBQWM7QUFDWixnQkFDVjtBQUFDO0FBQ0QsMkJBQVcsdUJBQVc7Y0FBdEI7QUFDTyxpQkFBSyxLQUFZLGVBQVMsTUFBTyxPQUFNO0FBQ3BDLG9CQUFLLEtBQWEsYUFBUSxRQUFLLEtBQWEsZ0JBQ3REO0FBQUM7O3VCQUFBOztBQUNELDJCQUFXLHVCQUFVO2NBQXJCO0FBQ08saUJBQUssS0FBWSxlQUFTLE1BQU8sT0FBTTtBQUMxQyxpQkFBVSxTQUFPLEtBQWM7QUFDekIsb0JBQU8sT0FBUSxRQUFLLEtBQWEsZ0JBQVUsT0FBTyxTQUM1RDtBQUFDOzt1QkFBQTs7QUFDTSwyQkFBVSxhQUFqQjtBQUNPLGFBQUssS0FBc0Isc0JBQUU7QUFDeEIsa0JBQ1I7QUFBQztBQUNHLGNBQWE7QUFDYixjQUFnQjtBQUNoQixjQUFXLFdBQUssS0FBSyxNQUFRO0FBQzlCLGFBQUssS0FBYyxjQUFFO0FBQ2hCLGtCQUNSO0FBQ0o7QUFBQztBQUNELDJCQUFXLHVCQUFvQjtjQUEvQjtBQUFtRCxvQkFBSyxLQUE0QjtBQUFDOzt1QkFBQTs7QUFDN0UsMkJBQXVCLDBCQUEvQixVQUE0QztBQUNyQyxhQUFJLE9BQVEsS0FBc0Isc0JBQVE7QUFDekMsY0FBMEIsNEJBQU87QUFDakMsY0FDUjtBQUFDO0FBQ1MsMkJBQTZCLGdDQUF2QyxZQUE0QyxDQUFDO0FBQ25DLDJCQUFrQixxQkFBNUI7QUFDTyxhQUFDLENBQUssS0FBMkIsMkJBQU8sT0FBTztBQUNsRCxhQUFRLE9BQVE7QUFDaEIsYUFBVyxZQUFTLE1BQUksSUFBUSxRQUFJLElBQVEsUUFBTSxNQUFVLFVBQUc7QUFBa0Isc0JBQXlCLHlCQUFXO0FBQUksY0FBM0c7QUFDVixjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBWSxZQUFVLFVBQU8sUUFBSyxLQUFHO0FBQ3pELGlCQUFZLFdBQU8sS0FBWSxZQUFVLFVBQUk7QUFDMUMsaUJBQUMsQ0FBUyxTQUFTLFNBQVU7QUFDaEMsaUJBQVMsUUFBTyxLQUFTLFNBQVMsU0FBTztBQUN0QyxpQkFBTyxPQUFRLFFBQUssS0FBUyxTQUFNLFFBQzFDO0FBQUM7QUFDRyxjQUF3Qix3QkFBTztBQUMvQixjQUEwQiwwQkFBSyxNQUFXO0FBQ3hDLGdCQUNWO0FBQUM7QUFDTywyQkFBd0IsMkJBQWhDLFVBQTZDO0FBQ3JDLGNBQXdCLHdCQUFRO0FBQ2pDLGFBQUMsQ0FBUSxXQUFJLENBQVEsUUFBUSxRQUFRO0FBQ3hDLGFBQVEsT0FBVSxRQUFRO0FBQzFCLGFBQWEsWUFBUztBQUNuQixhQUFRLFFBQVEsUUFBRTtBQUNiLGtCQUFDLElBQVEsUUFBVyxRQUFRLFFBQUU7QUFDOUIscUJBQVksV0FBTyxLQUFrQixrQkFBTztBQUN6QyxxQkFBUyxZQUFZLFNBQVcsV0FBRTtBQUN4QixpQ0FBUTtBQUNULDhCQUFZLFlBQWdCLHVCQUFRLFFBQU8sT0FDdkQ7QUFDSjtBQUNKO0FBQUM7QUFDRSxhQUFDLENBQVcsV0FBRTtBQUNWLGlCQUFLLEtBQVksWUFBSyxLQUNyQixrQkFBSyxLQUNiO0FBQ0o7QUFBQztBQUNTLDJCQUFVLGFBQXBCO0FBQ1EsY0FBdUI7QUFDeEIsYUFBSyxLQUFzQixzQkFBRTtBQUN4QixrQkFBVyxXQUFLLEtBQWEsY0FBTSxLQUFTLFVBQ3BEO0FBQUM7QUFDRCxhQUFVLFNBQU8sS0FBYztBQUMvQixhQUFTLFFBQVMsT0FBUSxRQUFLLEtBQWM7QUFDekMsY0FBWSxjQUFTLE9BQU0sUUFDbkM7QUFBQztBQUNTLDJCQUFZLGVBQXRCO0FBQ1EsY0FBWSxjQUNwQjtBQUFDO0FBQ0QsMkJBQVcsdUJBQXNCO2NBQWpDO0FBQ08saUJBQUssS0FBZSxlQUFFO0FBQ2Ysd0JBQUssS0FBWSxZQUFLLEtBQ2hDO0FBQUM7QUFDSyxvQkFBTyxTQUFPLEtBQWEsYUFBb0Isc0JBQ3pEO0FBQUM7O3VCQUFBOztBQUNELDJCQUFXLHVCQUFvQjtjQUEvQjtBQUNVLG9CQUFPLFNBQU8sS0FBYSxhQUFpQixtQkFDdEQ7QUFBQzs7dUJBQUE7O0FBQ0QsMkJBQVcsdUJBQVk7Y0FBdkI7QUFDTyxpQkFBSyxLQUFZLGVBQVMsTUFBTyxPQUFJO0FBQ3hDLGlCQUFVLFNBQU8sS0FBYztBQUMvQixpQkFBUyxRQUFTLE9BQVEsUUFBSyxLQUFhLGVBQUs7QUFDM0Msb0JBQUssS0FBYSxhQUFnQixnQkFBVSxVQUFNLE9BQVEsT0FDcEU7QUFBQzs7dUJBQUE7O0FBQ00sMkJBQVUsYUFBakIsVUFBOEIsTUFBWSxNQUEwQixpQkFBMEM7QUFDMUcsYUFBVSxTQUFRO0FBQ2QsY0FBYSxhQUFLLEtBQUssTUFBRSxFQUFNLE1BQU0sTUFBTSxNQUFNLE1BQVEsUUFBWTtBQUN0RSxhQUFDLENBQVEsUUFBTyxPQUFPO0FBQ3ZCLGFBQUMsQ0FBZ0IsbUJBQVEsS0FBYyxjQUFFO0FBQ3BDLGtCQUFlLGVBQUssTUFBTSxNQUNsQztBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNTLDJCQUFjLGlCQUF4QixVQUFxQyxNQUFZLE1BQTRDO0FBQ3pGLGFBQVEsT0FBUTtBQUNiLGFBQW1CLG1CQUFrQixrQkFBYztBQUNqQyxnREFBUyxTQUFLLEtBQWEsY0FBTSxNQUFFLFVBQTBCLFNBQWU7QUFDMUYsaUJBQW1CLG1CQUFrQixrQkFBUSxVQUFZLFlBQVk7QUFDckUsaUJBQVMsU0FBRTtBQUNOLHNCQUFTLFNBQUssTUFDdEI7QUFDSjtBQUNKO0FBQUM7QUFDRCwyQkFBTyxVQUFQLFVBQXFCO0FBQ1gsZ0JBQUssS0FBTSxNQUNyQjtBQUFDO0FBQ0QsMkJBQU8sVUFBUCxVQUF1QjtBQUNoQixhQUFLLFFBQVMsTUFBUTtBQUNyQixjQUFNLE1BQUssS0FBTztBQUNsQixjQUNSO0FBQUM7QUFDRCwyQkFBVSxhQUFWLFVBQXVCO0FBQ25CLGFBQVEsT0FBTyxLQUFjLGNBQU87QUFDaEMsY0FBUSxRQUFPO0FBQ2IsZ0JBQ1Y7QUFBQztBQUNELDJCQUFVLGFBQVYsVUFBMEI7QUFDdEIsYUFBUyxRQUFPLEtBQU0sTUFBUSxRQUFPO0FBQ2xDLGFBQU0sUUFBSyxHQUFRO0FBQ2xCLGNBQU0sTUFBTyxPQUFNLE9BQUs7QUFDekIsYUFBSyxLQUFpQixvQkFBUyxNQUFFO0FBQzVCLGtCQUFZLGNBQU8sS0FBTSxNQUFPLFNBQUksSUFBTyxLQUFNLE1BQUcsS0FDNUQ7QUFBQztBQUNHLGNBQ1I7QUFBQztBQUNNLDJCQUFpQixvQkFBeEIsVUFBcUMsTUFBa0M7QUFBaEMsc0NBQWdDO0FBQWhDLCtCQUFnQzs7QUFDbkUsYUFBYSxZQUFPLEtBQW1CO0FBQ3BDLGFBQWlCLGlCQUFLLE9BQU8sS0FBZTtBQUMzQyxjQUFDLElBQUssSUFBWSxHQUFHLElBQVksVUFBTyxRQUFLLEtBQUc7QUFDaEQsaUJBQWdCLGVBQVksVUFBRyxHQUFNO0FBQ2xDLGlCQUFpQixpQkFBYSxlQUFlLGFBQWU7QUFDN0QsaUJBQWEsZ0JBQVMsTUFBTyxPQUFVLFVBQzdDO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ00sMkJBQW1CLHNCQUExQixVQUEwQyxPQUFrQztBQUFoQyxzQ0FBZ0M7QUFBaEMsK0JBQWdDOztBQUN4RSxhQUFVLFNBQU07QUFDYixhQUFDLENBQU8sT0FBTyxPQUFRO0FBQ3RCLGNBQUMsSUFBSyxJQUFZLEdBQUcsSUFBUSxNQUFPLFFBQUssS0FBRztBQUN6QyxpQkFBQyxDQUFNLE1BQUksSUFBVTtBQUN4QixpQkFBWSxXQUFPLEtBQWtCLGtCQUFNLE1BQUcsSUFBbUI7QUFDOUQsaUJBQVUsVUFBTyxPQUFLLEtBQzdCO0FBQUM7QUFDSyxnQkFDVjtBQUFDO0FBQ00sMkJBQWlCLG9CQUF4QixVQUE0QztBQUNwQyxjQUFDLElBQUssSUFBWSxHQUFHLElBQU8sS0FBTSxNQUFPLFFBQUssS0FBRztBQUNqRCxpQkFBUSxPQUFPLEtBQU0sTUFBSTtBQUN0QixpQkFBSyxLQUFVLFVBQVEsUUFBd0IsWUFBRyxDQUFHLEdBQU8sT0FDbkU7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUFDTSwyQkFBYSxnQkFBcEIsVUFBaUM7QUFDekIsY0FBQyxJQUFLLElBQVksR0FBRyxJQUFPLEtBQU0sTUFBTyxRQUFLLEtBQUc7QUFDOUMsaUJBQUssS0FBTSxNQUFHLEdBQUssUUFBUyxNQUFPLE9BQUssS0FBTSxNQUNyRDtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNNLDJCQUFlLGtCQUF0QixVQUFzQztBQUNsQyxhQUFVLFNBQU07QUFDYixhQUFDLENBQU8sT0FBTyxPQUFRO0FBQ3RCLGNBQUMsSUFBSyxJQUFZLEdBQUcsSUFBUSxNQUFPLFFBQUssS0FBRztBQUN6QyxpQkFBQyxDQUFNLE1BQUksSUFBVTtBQUN4QixpQkFBUSxPQUFPLEtBQWMsY0FBTSxNQUFLO0FBQ3JDLGlCQUFNLE1BQU8sT0FBSyxLQUN6QjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNNLDJCQUFlLGtCQUF0QixVQUFtRDtBQUE1QixrQ0FBNEI7QUFBNUIsMkJBQTRCOztBQUMvQyxhQUFVLFNBQUcsSUFBdUI7QUFDaEMsY0FBQyxJQUFLLElBQVksR0FBRyxJQUFPLEtBQU0sTUFBTyxRQUFLLEtBQUc7QUFDN0Msa0JBQU0sTUFBRyxHQUFtQixtQkFBTyxRQUMzQztBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNTLDJCQUFhLGdCQUF2QixVQUFvQztBQUFVLGdCQUFjLG9CQUFRO0FBQUM7QUFDN0QsMkJBQTRCLCtCQUFwQyxVQUFpRCxNQUFlO0FBQzVELGFBQWEsWUFBTyxLQUFtQjtBQUN2QyxhQUFZLFdBQVE7QUFDaEIsY0FBQyxJQUFLLElBQVksR0FBRyxJQUFZLFVBQU8sUUFBSyxLQUFHO0FBQzdDLGlCQUFVLFVBQUcsR0FBSyxRQUFTLE1BQVU7QUFDaEMsd0JBQVksVUFBSTtBQUNwQixrQkFBcUIscUJBQVMsVUFDdEM7QUFBQztBQUNHLGNBQWUsZUFBSyxLQUFLLE1BQUUsRUFBUSxRQUFNLE1BQVksWUFBVSxVQUFTLFNBQ2hGO0FBQUM7QUFDTywyQkFBZ0MsbUNBQXhDO0FBQ0ksYUFBYSxZQUFPLEtBQW1CO0FBQ25DLGNBQUMsSUFBSyxJQUFZLEdBQUcsSUFBWSxVQUFPLFFBQUssS0FBRztBQUM1QyxrQkFBcUIscUJBQVUsVUFBRyxJQUFNLEtBQVMsU0FBVSxVQUFHLEdBQ3RFO0FBQ0o7QUFBQztBQUNTLDJCQUFvQix1QkFBOUIsVUFBa0QsVUFBZTtBQUNyRCxrQkFBcUIscUJBQ2pDO0FBQUM7QUFDTywyQkFBbUIsc0JBQTNCO0FBQ0ksYUFBYSxZQUFPLEtBQTJCO0FBQzNDLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBWSxVQUFPLFFBQUssS0FBRztBQUN4QyxpQkFBWSxXQUFZLFVBQUk7QUFDNUIsaUJBQVMsUUFBTyxLQUFTLFNBQVMsU0FBTztBQUNyQyxrQkFBYyxjQUFTLFNBQUssTUFBTyxPQUMzQztBQUNKO0FBQUM7QUFDTywyQkFBdUIsMEJBQS9CO0FBQ0ksYUFBVSxTQUFNO0FBQ2hCLGFBQVEsT0FBTyxLQUFhO0FBQ3pCLGFBQUMsQ0FBTSxNQUFPLE9BQVE7QUFDckIsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQVUsVUFBTyxRQUFLLEtBQUc7QUFDN0MsaUJBQVksV0FBTyxLQUFVLFVBQUk7QUFDOUIsaUJBQUMsQ0FBUyxTQUFRLFdBQUksQ0FBUyxTQUFNLE1BQVU7QUFDNUMsb0JBQUssS0FDZjtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNPLDJCQUFhLGdCQUFyQixVQUFrQyxNQUFlLFVBQXVCO0FBQ2hFLGNBQUMsSUFBSyxJQUFZLEdBQUcsSUFBTyxLQUFTLFNBQU8sUUFBSyxLQUFHO0FBQ3BELGlCQUFXLFVBQU8sS0FBUyxTQUFJO0FBQzVCLGlCQUFRLFFBQUssUUFBUSxRQUFXLFFBQWEsZ0JBQWlCLGNBQUU7QUFDeEQseUJBQU0sTUFDakI7QUFDSjtBQUNKO0FBQUM7QUFDTywyQkFBaUIsb0JBQXpCO0FBQ0ksYUFBYSxZQUFPLEtBQWdCLGdCQUFRO0FBQ3hDLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBWSxVQUFPLFFBQUssS0FBRztBQUMvQix1QkFBRyxHQUNoQjtBQUNKO0FBQUM7QUFDTywyQkFBYSxnQkFBckI7QUFDUSxjQUFxQixxQkFBSyxLQUFnQixnQkFBUztBQUNuRCxjQUFxQixxQkFBSyxLQUNsQztBQUFDO0FBQ08sMkJBQW9CLHVCQUE1QixVQUEwRDtBQUNsRCxjQUFDLElBQUssSUFBSSxHQUFHLElBQU8sS0FBTyxRQUFLLEtBQUc7QUFDL0Isa0JBQUcsR0FBYSxhQUFLLEtBQzdCO0FBQ0o7QUFBQztBQUNNLDJCQUFVLGFBQWpCLFVBQXVDLFFBQXlCLFVBQXFDO0FBQW5GLDZCQUFxQjtBQUFyQixzQkFBcUI7O0FBQUUsK0JBQXVCO0FBQXZCLHdCQUF1Qjs7QUFBRSx5Q0FBbUM7QUFBbkMsa0NBQW1DOztBQUM5RixhQUFDLENBQUssS0FBWSxZQUFRO0FBQzFCLGFBQW1CLHNCQUFRLEtBQWUsZUFBRTtBQUN2QyxrQkFBYyxjQUFLLEtBQUssTUFDaEM7QUFBQztBQUNFLGFBQUMsQ0FBSyxLQUFhLGdCQUFXLFFBQUU7QUFDM0Isa0JBQWEsZUFDckI7QUFBQztBQUNFLGFBQUMsQ0FBSyxLQUFjLGNBQVE7QUFDNUIsYUFBVSxVQUFFO0FBQ1Asa0JBQVMsV0FDakI7QUFBQztBQUNFLGFBQW1CLHNCQUFJLENBQUssS0FBVSxVQUFRO0FBQ2pELGFBQVEsT0FBUTtBQUNLLGdEQUFXLFdBQUssS0FBYSxjQUFNLEtBQUssTUFBRSxVQUEwQixTQUFlO0FBQ2hHLGtCQUFhLGFBQUssS0FBSyxNQUFFLEVBQVMsU0FBUyxTQUFVLFVBQzdEO0FBQUMsWUFBTSxLQUFTLFVBQ3BCO0FBQUM7QUFDTSwyQkFBUyxZQUFoQixVQUFpQyxVQUFjO0FBQzNDLGFBQVEsT0FBUTtBQUNLLGdEQUFVLFVBQVMsVUFBTSxNQUFFLFVBQTBCLFNBQVcsTUFBaUIsVUFBZTtBQUM3RyxrQkFBWSxZQUFLLEtBQUssTUFBRSxFQUFTLFNBQVMsU0FBTSxNQUFNLE1BQVUsVUFBVSxVQUFVLFVBQzVGO0FBQ0o7QUFBQztBQUNNLDJCQUFxQix3QkFBNUIsVUFBb0Q7QUFBdkIsK0JBQXVCO0FBQXZCLHdCQUF1Qjs7QUFDN0MsYUFBVSxVQUFFO0FBQ1Asa0JBQVMsV0FDakI7QUFBQztBQUNELGFBQVEsT0FBUTtBQUNaLGNBQVUsWUFBUTtBQUNsQixjQUE4QjtBQUNiLGdEQUFXLFdBQUssS0FBUyxVQUFFLFVBQTBCLFNBQWdCLFFBQWU7QUFDakcsa0JBQVUsWUFBUztBQUNwQixpQkFBUSxXQUFXLFFBQUU7QUFDaEIsc0JBQWMsY0FBUztBQUN2QixzQkFBb0M7QUFDcEMsc0JBQ1I7QUFDSjtBQUNKO0FBQUM7QUFDUywyQkFBMEIsNkJBQXBDLFlBQ0EsQ0FBQztBQUNTLDJCQUF1QiwwQkFBakMsWUFDQSxDQUFDO0FBQ08sMkJBQW1CLHNCQUEzQixVQUErQyxVQUE2QjtBQUN4RSxhQUFRLE9BQU8sS0FBa0Isa0JBQVc7QUFDekMsYUFBQyxDQUFNLE1BQVE7QUFDbEIsYUFBWSxXQUFPLEtBQVc7QUFDM0IsYUFBUyxZQUFRLEtBQWlCLGlCQUFVLGFBQXVCLG9CQUFFO0FBQ2hFLGtCQUFzQixzQkFBSyxNQUNuQztBQUNKO0FBQUM7QUFDTywyQkFBb0IsdUJBQTVCO0FBQ1EsY0FBeUIseUJBQUssS0FBa0I7QUFDakQsYUFBSyxLQUFvQix1QkFBYSxVQUFFO0FBQ3ZDLGlCQUFZLFdBQU8sS0FBYztBQUM3QixrQkFBQyxJQUFLLElBQUksR0FBRyxJQUFXLFNBQU8sUUFBSyxLQUFHO0FBQ25DLHNCQUE2Qiw2QkFBUyxTQUFHLEdBQVUsV0FDM0Q7QUFDSjtBQUFNLGdCQUFFO0FBQ0Esa0JBQTZCLDZCQUFLLEtBQWdCLGdCQUFPLFFBQU0sS0FBb0IsdUJBQzNGO0FBQ0o7QUFBQztBQUNPLDJCQUF3QiwyQkFBaEMsVUFBbUQ7QUFDL0MsYUFBUyxRQUFLO0FBQ1YsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFPLEtBQU0sTUFBTyxRQUFLLEtBQUc7QUFDckMsa0JBQU0sTUFBRyxHQUFhLGVBQU8sS0FBTSxNQUFHLEdBQVcsVUFBUyxVQUFHLENBQUc7QUFDaEUsa0JBQU0sTUFBRyxHQUFJLE1BQVksYUFBUSxLQUFNLE1BQUcsR0FBUSxVQUFPLEtBQU0sTUFBRyxHQUFhLGVBQUksSUFBRyxDQUM5RjtBQUNKO0FBQUM7QUFDTywyQkFBNEIsK0JBQXBDLFVBQTJELFdBQW9CO0FBQzNFLGFBQVMsUUFBSztBQUNWLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBWSxVQUFPLFFBQUssS0FBRztBQUMvQix1QkFBRyxHQUFnQixnQkFBVSxhQUFhLFVBQUcsR0FBUSxXQUFhLFVBQUcsR0FBWSxXQUFTLFVBQUcsQ0FDMUc7QUFDSjtBQUFDO0FBQ08sMkJBQWEsZ0JBQXJCLFVBQWtDO0FBQzNCLGFBQUMsQ0FBUyxTQUFRO0FBQ2pCLGNBQVcsYUFBUTtBQUN2QixhQUFpQixnQkFBb0I7QUFDeEIsdUJBQVMsU0FBUSxTQUFRO0FBQ25DLGFBQWMsY0FBTyxPQUFPLFNBQUssR0FBRTtBQUM5QixrQkFBVyxhQUFnQixjQUNuQztBQUFDO0FBQ0csY0FBNkI7QUFDOUIsYUFBSyxLQUFXLFdBQUU7QUFDYixrQkFDUjtBQUFDO0FBQ0csY0FBcUI7QUFDckIsY0FBaUI7QUFDakIsY0FDUjtBQUFDO0FBQ1MsMkJBQWdCLG1CQUExQixZQUErQixDQUFDO0FBQ3RCLDJCQUFVLGFBQXBCLFlBQXlCLENBQUM7QUFDbEIsMkJBQXlCLDRCQUFqQztBQUNRLGNBQW9CLHNCQUFNO0FBQzlCLGFBQVEsT0FBUTtBQUNaLGNBQW9CLG9CQUFVLFlBQUcsVUFBYztBQUFVLG9CQUFLLEtBQVksZUFBUSxPQUFPLEtBQWEsYUFBUSxRQUFLLEtBQWEsZUFBSSxJQUFNO0FBQUM7QUFDM0ksY0FBb0Isb0JBQWEsZUFBRyxVQUFjO0FBQVUsb0JBQUssS0FBbUI7QUFBQztBQUN6RixhQUFhLFlBQU8sS0FBbUI7QUFDbkMsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFZLFVBQU8sUUFBSyxLQUFHO0FBQ3BDLGtCQUFpQyxpQ0FBVSxVQUNuRDtBQUNKO0FBQUM7QUFDTywyQkFBZ0MsbUNBQXhDLFVBQTREO0FBQ3BELGNBQW9CLG9CQUFTLFNBQUssS0FBZSxpQkFDekQ7QUFBQztBQUNPLDJCQUFxQix3QkFBN0IsVUFBMEM7QUFDdEMsYUFBYSxZQUFxQiwwQ0FBYSxhQUFPO0FBQ2hELGdCQUFLLEtBQW9CLG9CQUFVLFVBQzdDO0FBQUM7QUFDTywyQkFBcUIsd0JBQTdCLFVBQTBDO0FBQ3RDLGFBQWEsWUFBcUIsMENBQWEsYUFBTztBQUN0RCxhQUFPLE1BQU8sS0FBb0Isb0JBQVUsVUFBZ0I7QUFDekQsYUFBQyxDQUFLLEtBQU8sT0FBTTtBQUNuQixhQUFJLE9BQWUsWUFBRTtBQUNkLG9CQUFLLEtBQVksWUFBSyxLQUNoQztBQUFDO0FBQ0UsYUFBSSxPQUFlLFlBQUU7QUFDcEIsaUJBQVksV0FBTyxLQUFrQixrQkFBVSxXQUFRO0FBQ3BELGlCQUFDLENBQVUsVUFBTyxPQUFNO0FBQ3ZCLG9CQUFXLFNBQUssT0FBTyxLQUFPLE9BQVUsVUFBUztBQUMvQyxvQkFBbUIsMENBQVMsU0FBSyxNQUFNLEtBQ2pEO0FBQUM7QUFDRSxhQUFJLE9BQVksU0FBRTtBQUNYLG9CQUFtQiwwQ0FBUyxTQUFLLE1BQU0sS0FDakQ7QUFBQztBQUNLLGdCQUFJLElBQ2Q7QUFBQztBQUNPLDJCQUE0QiwrQkFBcEM7QUFDSSxhQUFhLFlBQU8sS0FBbUI7QUFDbkMsY0FBQyxJQUFLLElBQVksR0FBRyxJQUFZLFVBQU8sUUFBSyxLQUFHO0FBQzdDLGlCQUFVLFVBQUcsR0FBUyxTQUFVO0FBQy9CLGtCQUFTLFNBQVUsVUFBRyxHQUFLLE1BQ25DO0FBQ0o7QUFBQztBQUNNLDJCQUFXLGNBQWxCLFVBQStCO0FBQ3hCLGFBQUMsQ0FBTSxNQUFPLE9BQU07QUFDakIsZ0JBQUssS0FBYyxjQUM3QjtBQUFDO0FBQ00sMkJBQVcsY0FBbEIsVUFBK0IsTUFBZTtBQUN2QyxhQUFDLENBQU0sTUFBUTtBQUNkLGNBQWMsY0FBTSxRQUFZO0FBQ2hDLGNBQW9CLG9CQUFLLEtBQWUsaUJBQ2hEO0FBQUM7QUFDYTtBQUNOLDJCQUFjLGlCQUF0QixVQUFpQztBQUMxQixhQUFNLFNBQVMsaUJBQW1CLFFBQUU7QUFDUTtBQUNyQyxvQkFBSyxLQUFNLE1BQUssS0FBVSxVQUNwQztBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNELDJCQUFRLFdBQVIsVUFBcUI7QUFDZCxhQUFDLENBQUssUUFBUSxLQUFPLFVBQU0sR0FBTyxPQUFNO0FBQzNDLGFBQVMsUUFBTyxLQUFXLFdBQU87QUFDNUIsZ0JBQUssS0FBZSxlQUM5QjtBQUFDO0FBQ0QsMkJBQVEsV0FBUixVQUFxQixNQUFlO0FBQzdCLGFBQUssS0FBYSxhQUFLLE1BQVksV0FBUTtBQUMzQyxhQUFTLFlBQU0sTUFBWSxZQUFTLE1BQUU7QUFDckMsb0JBQVcsS0FBVyxXQUMxQjtBQUFNLGdCQUFFO0FBQ0ksd0JBQU8sS0FBZSxlQUFXO0FBQ3JDLGtCQUFXLFdBQU0sUUFBWTtBQUM3QixrQkFBb0Isb0JBQUssS0FBZSxpQkFDaEQ7QUFBQztBQUNHLGNBQTZCLDZCQUFLLE1BQVk7QUFDOUMsY0FBYyxjQUFLLE1BQVUsVUFBUztBQUN0QyxjQUFpQjtBQUNqQixjQUF1Qix1QkFDL0I7QUFBQztBQUNPLDJCQUFZLGVBQXBCLFVBQWlDLE1BQWU7QUFDekMsYUFBUyxZQUFPLElBQVMsV0FBUTtBQUNwQyxhQUFZLFdBQU8sS0FBUyxTQUFPO0FBQ2hDLGFBQVMsYUFBUyxRQUFZLGFBQVUsTUFBTyxPQUFTLGFBQWM7QUFDbkUsZ0JBQUssS0FBaUIsaUJBQVMsVUFDekM7QUFBQztBQUNPLDJCQUFnQixtQkFBeEIsVUFBK0IsR0FBUTtBQUNoQyxhQUFFLE1BQU8sR0FBTyxPQUFNO0FBQ3RCLGFBQUUsRUFBRSxhQUFtQixXQUFLLEVBQUUsYUFBb0IsU0FBTyxPQUFPO0FBQy9ELGNBQUMsSUFBSyxLQUFNLEdBQUU7QUFDWCxpQkFBQyxDQUFFLEVBQWUsZUFBSSxJQUFVO0FBQ2hDLGlCQUFDLENBQUUsRUFBZSxlQUFJLElBQU8sT0FBTztBQUNwQyxpQkFBRSxFQUFHLE9BQU0sRUFBSSxJQUFVO0FBQ3pCLGlCQUFRLFFBQUUsRUFBSSxRQUFjLFVBQU8sT0FBTztBQUMxQyxpQkFBQyxDQUFLLEtBQWlCLGlCQUFFLEVBQUcsSUFBRyxFQUFLLEtBQU8sT0FDbEQ7QUFBQztBQUNHLGNBQUUsS0FBTSxHQUFFO0FBQ1AsaUJBQUUsRUFBZSxlQUFHLE1BQUksQ0FBRSxFQUFlLGVBQUksSUFBTyxPQUMzRDtBQUFDO0FBQ0ssZ0JBQ1Y7QUFBQztBQUNPLDJCQUFzQix5QkFBOUIsVUFBMkM7QUFDcEMsYUFBQyxDQUFLLEtBQW9CLHVCQUFJLENBQUssS0FBYSxhQUFRO0FBQzNELGFBQVksV0FBTyxLQUFrQixrQkFBTztBQUN6QyxhQUFTLFlBQUksQ0FBUyxTQUE4Qiw4QkFBUTtBQUMvRCxhQUFhLFlBQU8sS0FBMkI7QUFDM0MsY0FBQyxJQUFLLElBQUksR0FBRyxJQUFZLFVBQU8sUUFBSyxLQUFHO0FBQ3JDLGlCQUFVLFVBQUcsR0FBUyxZQUFJLENBQUssS0FBUyxTQUFVLFVBQUcsR0FBTyxPQUNuRTtBQUFDO0FBQ0UsYUFBQyxDQUFLLEtBQVksWUFBVSxVQUFLLE1BQVMsUUFBRTtBQUN4QyxpQkFBQyxDQUFLLEtBQVksWUFBRTtBQUNmLHNCQUNSO0FBQU0sb0JBQUU7QUFDQSxzQkFDUjtBQUNKO0FBQ0o7QUFBQztBQUNELDJCQUFVLGFBQVYsVUFBdUI7QUFDbkIsYUFBVSxTQUFPLEtBQUssS0FBSyxPQUFPLEtBQWdCO0FBQy9DLGFBQU8sVUFBUyxNQUFPLFNBQU07QUFDMUIsZ0JBQ1Y7QUFBQztBQUNELDJCQUFVLGFBQVYsVUFBdUIsTUFBa0I7QUFDakMsZ0JBQU8sT0FBTyxLQUFlO0FBQzlCLGFBQVMsWUFBTSxNQUFZLFlBQVMsTUFBRTtBQUNyQyxvQkFBVyxLQUFXLFdBQzFCO0FBQU0sZ0JBQUU7QUFDQSxrQkFBVyxXQUFNLFFBQVk7QUFDN0Isa0JBQXVCLHVCQUMvQjtBQUNKO0FBQUM7QUFDRCwyQkFBeUIsNEJBQXpCLFVBQTZDLFVBQW1CO0FBQ3hELGNBQXdCO0FBQ3hCLGNBQWlCLGlCQUFLLEtBQUssTUFBRSxFQUFZLFlBQVUsVUFBUSxRQUFVLFNBQUssTUFBVyxXQUFjO0FBQ25HLGNBQW9CLG9CQUFTLFVBQUUsQ0FDdkM7QUFBQztBQUNELDJCQUFxQix3QkFBckIsVUFBaUMsTUFBbUI7QUFDNUMsY0FBd0I7QUFDeEIsY0FBcUIscUJBQUssS0FBSyxNQUFFLEVBQVEsUUFBTSxNQUFXLFdBQ2xFO0FBQUM7QUFDRCwyQkFBYSxnQkFBYixVQUFpQyxVQUFlO0FBQ3hDLGNBQXdCO0FBQ3hCLGNBQWlDLGlDQUFXO0FBQzVDLGNBQWdCLGdCQUFLLEtBQUssTUFBRSxFQUFZLFlBQVUsVUFBUSxRQUFVLFNBQUssTUFBUyxTQUMxRjtBQUFDO0FBQ0QsMkJBQWUsa0JBQWYsVUFBbUM7QUFDM0IsY0FBd0I7QUFDeEIsY0FBa0Isa0JBQUssS0FBSyxNQUFFLEVBQVksWUFBVSxVQUFRLFFBQVUsU0FDOUU7QUFBQztBQUNELDJCQUFnQixtQkFBaEIsVUFBNkI7QUFDdEIsYUFBSyxLQUFtQixtQkFBUyxTQUFPLE9BQU07QUFDakQsYUFBVyxVQUFHLEVBQU0sTUFBTSxNQUFPLE9BQU0sS0FBUyxTQUFNLE9BQU8sT0FBUztBQUNsRSxjQUFtQixtQkFBSyxLQUFLLE1BQVc7QUFDdEMsZ0JBQVEsUUFBTSxRQUFrQix1QkFBUSxRQUFPLFNBQ3pEO0FBQUM7QUFDRCwyQkFBVyxjQUFYLFVBQXdCO0FBQ3BCLGFBQVcsVUFBRyxFQUFNLE1BQVM7QUFDekIsY0FBYyxjQUFLLEtBQUssTUFBVztBQUNqQyxnQkFBSyxLQUFZLFlBQVEsUUFDbkM7QUFBQztBQUNELDJCQUFXLGNBQVgsVUFBd0I7QUFDZCxnQkFBSyxLQUFpQixpQkFBUSxRQUN4QztBQUFDO0FBQ29CO0FBQ3JCLDJCQUFVLGFBQVYsVUFBMEIsT0FBcUI7QUFDM0MsYUFBVSxTQUFNO0FBQ1gsZUFBVSxVQUFLLEtBQU0sTUFBTyxRQUFNLEtBQWdCLGdCQUFTO0FBQzNELGVBQVUsVUFBSyxLQUFNLE1BQU8sUUFBTSxLQUFvQixvQkFBYTtBQUNsRSxnQkFDVjtBQUFDO0FBQ0QsMkJBQWUsa0JBQWYsVUFBNEIsTUFBWSxPQUFxQjtBQUN0RCxhQUFDLENBQU0sTUFBUTtBQUNmLGFBQVksWUFBRTtBQUNULGtCQUFZLFlBQUssTUFDekI7QUFBTSxnQkFBRTtBQUNBLGtCQUFTLFNBQUssTUFDdEI7QUFDSjtBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBUyxTQUFTLGFBQVMsTUFBVSxVQUFTLFNBQUU7QUFBYyxnQkFBbUIsa0NBQWM7QUFBRyxNQUE3RSxFQUFELEVBQzVCLFNBQUUsRUFBTSxNQUF1Qyx1Q0FBUyxTQUFPLFFBQXNCLHNCQUFFLEVBQU0sTUFBUyxTQUFXLFdBQVUsWUFDNUgsTUFBYSxhQUFlLGVBQVksWUFBWSxZQUFFLG9CQUFhO0FBQVUsZ0JBQU87QUFBQyxNQUEzRixFQUF1RyxZQUFFLG9CQUFhLEtBQU8sT0FBZTtBQUFJLGFBQVEsT0FBTSxJQUFXLFdBQUssSUFBYyxjQUFTLFNBQUMsRUFBVyxXQUFTLFNBQVM7QUFBRyxVQUN0TyxFQUFNLE1BQXFCLHFCQUFlLGVBQWlCLGlCQUFlLGVBQWEsYUFDN0UsWUFBZ0IsZ0JBQWMsY0FBZ0MsZ0NBQ3hFLEVBQU0sTUFBaUMsaUNBQVMsU0FBUSxRQUFFLEVBQU0sTUFBcUIscUJBQVMsU0FBUSxRQUFFLEVBQU0sTUFBMEIsMEJBQVMsU0FBUSxRQUNoSSwyQkFBRSxFQUFNLE1BQXVCLHVCQUFTLFNBQU0sTUFBUyxTQUFFLENBQUssTUFBVSxVQUFVLFVBQzNHLEVBQU0sTUFBeUIseUJBQVMsU0FBTyxPQUFTLFNBQUUsQ0FBTSxPQUFhLGFBQzdFLEVBQU0sTUFBbUIsbUJBQVMsU0FBTyxPQUFTLFNBQUUsQ0FBTSxPQUFPLE9BQWEsYUFDOUUsRUFBTSxNQUFRLFFBQVMsU0FBUSxRQUFTLFNBQUUsQ0FBTyxRQUFjLGNBQy9ELEVBQU0sTUFBZ0MsZ0NBQVMsU0FBUSxRQUErQiwrQkFBZ0Msa0NBQ2hILE1BQWdCLGdCQUFZLFlBQUUsb0JBQWtCO0FBQVUsZ0JBQUksSUFBb0I7QUFBRyxNQUEzRixNQUNNLE1BQWdCLGdCQUFZLFlBQUUsb0JBQWtCO0FBQVUsZ0JBQUksSUFBb0I7QUFBRyxNQUEzRixNQUNNLE1BQWdCLGdCQUFZLFlBQUUsb0JBQWtCO0FBQVUsZ0JBQUksSUFBb0I7QUFBRyxNQUEzRixJQUNBLEVBQU0sTUFBZ0IsZ0JBQVMsU0FBTyxPQUFzQixzQkFBNEIsMEI7Ozs7Ozs7Ozs7O0FDMXlCZjtBQUN6RSxnQ0FDQSxDQUFDO0FBQ00sK0JBQVUsYUFBakIsVUFBa0MsVUFBbUU7QUFDakcsYUFBTyxNQUFHLElBQXFCO0FBQzVCLGFBQUssS0FBTSxPQUFpQixnQkFBVyxhQUF5Qix5QkFBYTtBQUM3RSxhQUFpQixpQkFBZSxnQkFBdUM7QUFDdkUsYUFBTyxTQUFHO0FBQ1QsaUJBQVUsU0FBTyxLQUFNLE1BQUksSUFBVztBQUNoQyxvQkFBSSxJQUFPLFVBQU8sS0FBUSxRQUFLLElBQ3pDO0FBQUU7QUFDQyxhQUNQO0FBQUM7QUFDTSwrQkFBVSxhQUFqQixVQUFnQyxRQUFjLFFBQXdELGNBQXlCLFVBQXFDO0FBQTVELCtCQUF1QjtBQUF2Qix3QkFBdUI7O0FBQUUseUNBQW1DO0FBQW5DLGtDQUFtQzs7QUFDaEssYUFBTyxNQUFHLElBQXFCO0FBQzVCLGFBQUssS0FBTyxRQUFpQixnQkFBVyxhQUFhO0FBQ3JELGFBQWlCLGlCQUFlLGdCQUFxQztBQUN4RSxhQUFRLE9BQUcsRUFBUSxRQUFRLFFBQWMsY0FBTSxLQUFVLFVBQVc7QUFDakUsYUFBVSxVQUFLLEtBQVksY0FBWTtBQUN2QyxhQUFvQixvQkFBSyxLQUFzQix3QkFBUTtBQUMxRCxhQUFpQixnQkFBZSxLQUFVLFVBQU87QUFDakQsYUFBUSxPQUFRO0FBQ2IsYUFBTyxTQUFNLElBQVEsVUFBRztBQUNwQixpQkFBQyxDQUFjLGNBQVE7QUFDZCwwQkFBSSxJQUFPLFVBQU8sS0FBSyxJQUN2QztBQUFFO0FBQ0MsYUFBSyxLQUNaO0FBQUM7QUFDTSwrQkFBUSxXQUFmLFVBQThCLFFBQVksTUFBdUQ7QUFDN0YsYUFBTyxNQUFHLElBQXFCO0FBQzVCLGFBQU8sU0FBTSxJQUFRLFVBQUc7QUFDcEIsaUJBQUMsQ0FBWSxZQUFRO0FBQ2Qsd0JBQUksSUFBTyxVQUFPLEtBQU0sS0FBTSxNQUFJLElBQ2hEO0FBQUU7QUFDQyxhQUFLLEtBQU8sUUFBaUIsZ0JBQVcsYUFBYSxZQUFRO0FBQ2hFLGFBQVksV0FBRyxJQUFlO0FBQ3RCLGtCQUFPLE9BQU8sUUFBUTtBQUN0QixrQkFBTyxPQUFTLFVBQVU7QUFDL0IsYUFBSyxLQUNaO0FBQUM7QUFDTSwrQkFBUyxZQUFoQixVQUFpQyxVQUFjLE1BQXlGO0FBQ3BJLGFBQU8sTUFBRyxJQUFxQjtBQUMvQixhQUFRLE9BQWMsY0FBVyxXQUFXLFdBQVE7QUFDakQsYUFBSyxLQUFNLE9BQWlCLGdCQUFXLGFBQWdCLGdCQUFTO0FBQ2hFLGFBQWlCLGlCQUFlLGdCQUF1QztBQUMxRSxhQUFRLE9BQVE7QUFDYixhQUFPLFNBQUc7QUFDVCxpQkFBVSxTQUFRO0FBQ2xCLGlCQUFRLE9BQVE7QUFDYixpQkFBSSxJQUFPLFVBQVEsS0FBRTtBQUNkLDBCQUFPLEtBQU0sTUFBSSxJQUFXO0FBQzlCLHdCQUFNO0FBQ04sc0JBQUMsSUFBTyxPQUFVLE9BQWdCLGdCQUFFO0FBQ3BDLHlCQUFNLEtBQUcsRUFBTSxNQUFLLEtBQU8sT0FBUSxPQUFlLGVBQVE7QUFDdEQsMEJBQUssS0FDYjtBQUNKO0FBQUM7QUFDVSx5QkFBSSxJQUFPLFVBQU8sS0FBUSxRQUFNLE1BQUssSUFDcEQ7QUFBRTtBQUNDLGFBQ1A7QUFBQztBQUNNLCtCQUFXLGNBQWxCLFVBQW1DLFVBQWtCLFVBQTBFO0FBQzNILGFBQU8sTUFBRyxJQUFxQjtBQUMvQixhQUFRLE9BQWMsY0FBVyxXQUFlLGVBQVk7QUFDekQsYUFBSyxLQUFNLE9BQWlCLGdCQUFXLGFBQWtCLGtCQUFTO0FBQ2xFLGFBQWlCLGlCQUFlLGdCQUF1QztBQUMxRSxhQUFRLE9BQVE7QUFDYixhQUFPLFNBQUc7QUFDVCxpQkFBVSxTQUFRO0FBQ2YsaUJBQUksSUFBTyxVQUFRLEtBQUU7QUFDZCwwQkFBTyxLQUFNLE1BQUksSUFDM0I7QUFBQztBQUNZLDJCQUFJLElBQU8sVUFBTyxLQUFRLFFBQUssSUFDaEQ7QUFBRTtBQUNDLGFBQ1A7QUFBQztBQTVFYSxxQkFBVSxhQUE4RDtBQTZFMUYsWUFBQztBQUFBLEs7Ozs7Ozs7Ozs7O0FDOUVxQzs7QUFHdEM7OztBQUE2Qix3QkFBSTtBQW9CN0I7QUFDSSxxQkFBUTtBQUhKLGNBQU8sVUFJZjtBQUFDO0FBcEJELDJCQUFXLFNBQVM7Y0FBcEI7QUFDTyxpQkFBUSxRQUFlLGtCQUFTLE1BQU8sT0FBUSxRQUFnQjtBQUMzRCxxQkFBZTtBQUNiLHdCQUFFLGVBQWUsT0FBZTtBQUFVLDRCQUFDLENBQVE7QUFBQztBQUNqRCwyQkFBRSxrQkFBZSxPQUFlO0FBQVUsNEJBQUUsQ0FBQyxDQUFTO0FBQUM7QUFDMUQsd0JBQUUsZUFBZSxPQUFlO0FBQVUsNEJBQU0sU0FBbUI7QUFBQztBQUNqRSwyQkFBRSxrQkFBZSxPQUFlO0FBQVUsNEJBQU0sU0FBbUI7QUFBQztBQUNwRSwyQkFBRSxrQkFBZSxPQUFlO0FBQVUsNEJBQU0sU0FBUyxNQUFXLGNBQVMsTUFBUSxRQUFlLGlCQUFHLENBQUk7QUFBQztBQUN6Ryw4QkFBRSxxQkFBZSxPQUFlO0FBQVUsNEJBQUMsQ0FBTSxTQUFJLENBQU0sTUFBVyxjQUFTLE1BQVEsUUFBZSxrQkFBSSxDQUFJO0FBQUM7QUFDbkgsMEJBQUUsaUJBQWUsT0FBZTtBQUFVLDRCQUFNLFFBQWtCO0FBQUM7QUFDdEUsdUJBQUUsY0FBZSxPQUFlO0FBQVUsNEJBQU0sUUFBa0I7QUFBQztBQUN6RCxpQ0FBRSx3QkFBZSxPQUFlO0FBQVUsNEJBQU0sU0FBbUI7QUFBQztBQUN2RSw4QkFBRSxxQkFBZSxPQUFlO0FBQVUsNEJBQU0sU0FBbUI7QUFDaEY7QUFYdUI7QUFZbkIsb0JBQVEsUUFDbEI7QUFBQzs7dUJBQUE7O0FBTUQsMkJBQVcsbUJBQVE7Y0FBbkI7QUFBc0Msb0JBQUssS0FBVTtBQUFDO2NBQ3RELGFBQWlDO0FBQzFCLGlCQUFDLENBQU8sT0FBUTtBQUNkLHFCQUFRLE1BQWU7QUFDekIsaUJBQUMsQ0FBUSxRQUFVLFVBQVEsUUFBUTtBQUNsQyxrQkFBUSxVQUNoQjtBQUFDOzt1QkFOcUQ7O0FBTy9DLHVCQUFLLFFBQVosVUFBdUI7QUFDaEIsYUFBUSxRQUFVLFVBQUssS0FBVSxVQUFNLE9BQU0sS0FBUSxRQUFFO0FBQ2xELGtCQUNSO0FBQU0sZ0JBQUU7QUFDQSxrQkFDUjtBQUNKO0FBQUM7QUFDUyx1QkFBUyxZQUFuQixZQUF3QixDQUFDO0FBQ2YsdUJBQVMsWUFBbkIsWUFBd0IsQ0FBQztBQXJDbEIsYUFBYyxpQkFBNkI7QUFzQ3RELFlBQUM7QUFRRDs7QUFBbUMsOEJBQU87QUFHdEM7QUFDSSxxQkFBUTtBQUZGLGNBQUssUUFHZjtBQUFDO0FBQ00sNkJBQVEsV0FBZixVQUEwQztBQUNsQyxjQUFNLFFBQ2Q7QUFBQztBQUNELDJCQUFXLHlCQUFZO2NBQXZCO0FBQWtDLG9CQUFRO0FBQUM7O3VCQUFBOztBQUMvQyxZQUFDO0FBQUEsR0FFRDs7QUFBMEMscUNBQWE7QUFHbkQ7QUFDSSxxQkFBUTtBQUhMLGNBQUssUUFBZ0I7QUFDckIsY0FBUyxZQUdoQjtBQUFDO0FBQ00sb0NBQU8sVUFBZDtBQUFpQyxnQkFBbUI7QUFBQztBQUMzQyxvQ0FBUyxZQUFuQjtBQUE0QixjQUFVLFVBQUssS0FBaUI7QUFBQztBQUNuRCxvQ0FBUyxZQUFuQjtBQUE0QixjQUFVLFVBQUssS0FBaUI7QUFBQztBQUNyRCxvQ0FBUyxZQUFqQixVQUFnQztBQUN6QixhQUFDLENBQUssS0FBTyxPQUFRO0FBQ3hCLGFBQVcsVUFBTyxLQUFNLE1BQVcsV0FBSyxLQUFNLE9BQU0sS0FBWTtBQUM1RCxjQUFDLElBQUssSUFBSSxHQUFHLElBQVUsUUFBTyxRQUFLLEtBQUc7QUFDbEMsa0JBQVEsUUFDaEI7QUFDSjtBQUFDO0FBQ1Msb0NBQWEsZ0JBQXZCLFVBQWlDO0FBQVEsY0FBUSxVQUFTO0FBQUM7QUFDakQsb0NBQWEsZ0JBQXZCLFVBQWlDO0FBQVEsY0FBUSxVQUFVO0FBQUM7QUFDaEUsWUFBQztBQUFBLEdBQ0Q7O0FBQTJDLHNDQUFhO0FBQ3BEO0FBQ0kscUJBQ0o7QUFBQztBQUNNLHFDQUFPLFVBQWQ7QUFBaUMsZ0JBQW9CO0FBQUM7QUFDdEQsMkJBQVcsaUNBQVk7Y0FBdkI7QUFBa0Msb0JBQU87QUFBQzs7dUJBQUE7O0FBQ2hDLHFDQUFTLFlBQW5CO0FBQTJCLGFBQUssS0FBTyxPQUFLLEtBQU0sTUFBZTtBQUFDO0FBQ3RFLFlBQUM7QUFBQSxHQUNEOztBQUEyQyxzQ0FBYTtBQUlwRDtBQUNJLHFCQUNKO0FBQUM7QUFDTSxxQ0FBTyxVQUFkO0FBQWlDLGdCQUFvQjtBQUFDO0FBQzVDLHFDQUFTLFlBQW5CO0FBQ08sYUFBQyxDQUFLLEtBQVUsYUFBSSxDQUFLLEtBQU8sT0FBUTtBQUN2QyxjQUFNLE1BQWdCLGdCQUFLLEtBQVUsV0FBTSxLQUFTLFVBQU0sS0FDbEU7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQVMsU0FBVSxXQUFFLENBQVcsWUFBYTtBQUN0RCx3QkFBUyxTQUFTLFNBQWdCLGlCQUFFLENBQVMsVUFBTSxNQUFhO0FBQ2hFLHdCQUFTLFNBQVMsU0FBaUIsa0JBQUUsQ0FBUSxTQUFjLGNBQUU7QUFBb0IsWUFBQyxJQUE0QjtBQUFDLElBQW1CO0FBQ2xJLHdCQUFTLFNBQVMsU0FBa0IsbUJBQUksSUFBRTtBQUFvQixZQUFDLElBQTZCO0FBQUMsSUFBbUI7QUFDaEgsd0JBQVMsU0FBUyxTQUFrQixtQkFBRSxDQUFhLGNBQVksWUFBdUIsdUJBQUU7QUFBb0IsWUFBQyxJQUE2QjtBQUFDLElBQW1CLGlCOzs7Ozs7Ozs7Ozs7QUMzRzdJOztBQUczQjs7O0FBQXVDLGtDQUFJO0FBU3ZDLGdDQUF3QjtBQUNwQixxQkFBUTtBQUNKLGNBQVksY0FBTyxLQUFhLGFBQVU7QUFDMUMsY0FBWSxZQUFVLFlBQVM7QUFDL0IsY0FBYyxnQkFBMkIsU0FBYyxjQUMvRDtBQUFDO0FBQ00saUNBQU8sVUFBZDtBQUFrQyxnQkFBVTtBQUFDO0FBQzdDLDJCQUFXLDZCQUFNO2NBQWpCO0FBQXlDLG9CQUFLLEtBQWM7QUFBQzs7dUJBQUE7O0FBQzdELDJCQUFXLDZCQUFTO2NBQXBCO0FBQXdDLG9CQUFLLEtBQWlCO0FBQUM7O3VCQUFBOztBQUMvRCwyQkFBVyw2QkFBVTtjQUFyQjtBQUF5QyxvQkFBSyxLQUFrQjtBQUFDOzt1QkFBQTs7QUFDakUsMkJBQVcsNkJBQUs7Y0FBaEI7QUFBbUMsb0JBQUssS0FBVyxhQUFPLEtBQVcsYUFBTyxLQUFPLE9BQVE7QUFBQztjQUM1RixhQUE4QjtBQUFRLGtCQUFXLGFBQVU7QUFBQzs7dUJBRGdDOztBQUVyRixpQ0FBTSxTQUFiO0FBQ1EsY0FBZSxlQUN2QjtBQUFDO0FBQ00saUNBQVEsV0FBZjtBQUNRLGNBQWUsZUFDdkI7QUFBQztBQUNTLGlDQUFZLGVBQXRCLFVBQW1DO0FBQ3pCLGdCQUFnQix3QkFDMUI7QUFBQztBQUNTLGlDQUFjLGlCQUF4QixVQUF1QztBQUMvQixjQUFnQixrQkFDeEI7QUFBQztBQS9CYSx1QkFBaUIsb0JBQW9CO0FBZ0N2RCxZQUFDO0FBQUEsZTs7Ozs7Ozs7OztBQ3BDTSxLQUFhO0FBQ0wsa0JBQUk7QUFDVCxhQUFFO0FBQ0osYUFBTyxNQUFPLEtBQVksY0FBTyxLQUFLLEtBQWEsZUFBc0I7QUFDdEUsYUFBQyxDQUFLLEtBQUksTUFBc0I7QUFDN0IsZ0JBQ1Y7QUFHSjtBQVR1QjtBQVNoQixLQUFzQjtBQUNyQixXQUFXO0FBQ1QsYUFBSTtBQUNOLFdBQVc7QUFDVCxhQUFVO0FBQ0EsdUJBQUksSUFBWSxZQUFFLEVBQVUsVUFBSSxJQUFNLE1BQUcsSUFBTSxNQUFLO0FBQzVELGVBQWUsZUFBYSxhQUFJO0FBQy9CLGdCQUFjO0FBQ3BCLFVBQVU7QUFDTCxlQUFFLEVBQU0sTUFBUSxRQUFPLE9BQWMsY0FBUyxTQUFJLElBQVEsUUFBTTtBQUNuRSxZQUFFLEVBQU0sTUFBYyxjQUFNLE1BQUksSUFBTSxNQUFNO0FBRXpDLGVBQUUsRUFBTSxNQUFXLFdBQU0sTUFBaUIsaUJBQU8sT0FBZ0I7QUFDbEUsY0FBSTtBQUNILGVBQUk7QUFDTixhQUFFLEVBQU0sTUFBaUI7QUFDakIscUJBQUUsRUFBTSxNQUFpQjtBQUMxQixvQkFBRSxFQUFNLE1BQVMsU0FBUSxRQUFNO0FBQ2hDLG1CQUFFLEVBQU0sTUFBSSxJQUFXLFdBQUksSUFBVyxXQUFNO0FBQzlDLGlCQUFFLEVBQU0sTUFBVyxXQUFNLE1BQW1CLG1CQUFPLE9BQWdCO0FBQ3ZFLGFBQUUsRUFBTSxNQUFlLGVBQU0sTUFBc0I7QUFDckQsV0FBSTtBQUNGO0FBQ0UsZUFBYSxhQUFNLE1BQXFCO0FBQ3RDO0FBQ0UsbUJBQW1CLG1CQUFPLE9BQUksSUFBUSxRQUFJLElBQWdCLGdCQUFJLElBQWlCLGlCQUc3RjtBQUpjO0FBRko7QUF0Qm9CO0FBOEJ2QixXQUFZLGNBQXNCLG1COzs7Ozs7Ozs7OztBQ3JDM0M7O0FBQU8sS0FBdUI7QUFDdEIsV0FBSTtBQUNGLGFBQWlCO0FBQ25CLFdBQWM7QUFDWixhQUFnQjtBQUNOLHVCQUFJLElBQVksWUFBRSxFQUFVLFVBQUksSUFBTSxNQUFJLElBQU0sTUFBTTtBQUM5RCxlQUF5Qix5QkFBYSxhQUFnQjtBQUNyRCxnQkFBSTtBQUNWLFVBQUk7QUFDQyxlQUFFLEVBQU0sTUFBSSxJQUFPLE9BQUksSUFBUyxTQUFnQixnQkFBUSxRQUFNO0FBQ2pFLFlBQUUsRUFBTSxNQUFzQixzQkFBTSxNQUF3Qyx3Q0FBTSxNQUFNO0FBRXJGLGVBQUUsRUFBTSxNQUFlLGVBQU0sTUFBWSxZQUFPLE9BQU07QUFDdkQsY0FBZ0I7QUFDZixlQUFnQjtBQUNsQixhQUFFLEVBQU0sTUFBVztBQUNYLHFCQUFFLEVBQU0sTUFBVztBQUNwQixvQkFBRSxFQUFNLE1BQVMsU0FBUSxRQUFZO0FBQ3RDLG1CQUFFLEVBQU0sTUFBUyxTQUFXLFdBQUksSUFBVyxXQUFrQjtBQUMvRCxpQkFBRSxFQUFNLE1BQWUsZUFBTSxNQUFTLFNBQU8sT0FBTTtBQUN2RCxhQUFFLEVBQU0sTUFBYSxhQUFNLE1BQXFCO0FBQ2xELFdBQWdCO0FBQ2Q7QUFDRSxlQUFpQixpQkFBTSxNQUFjO0FBQ25DO0FBQ0UsbUJBQTRCLDRCQUFPLE9BQWEsYUFBUSxRQUF3QjtBQUN0RSw2QkFBNkMsNkNBQWlCLGlCQUd0RjtBQUxjO0FBRko7QUF0QnFCO0FBOEJ4Qix3QkFBYSxlQUF1QixvQjs7Ozs7Ozs7Ozs7QUNoQ3RDOztLQUF1Qjs7QUFDTzs7QUFDRDs7QUFDUDs7QUFFc0I7O0FBR25EOzs7OztBQUE0Qix1QkFBVztBQVVuQyxxQkFBK0IsU0FBNkIsaUJBQWlCO0FBQWpFLDhCQUFtQjtBQUFuQix1QkFBbUI7O0FBQUUsc0NBQTJCO0FBQTNCLCtCQUEyQjs7QUFBRSwwQkFBZTtBQUFmLG1CQUFlOztBQUN6RSwyQkFBZTtBQVBaLGNBQVUsYUFBNEY7QUFDckcsY0FBYSxnQkFBaUI7QUFPL0IsYUFBSyxLQUFFO0FBQ0Ysa0JBQUksTUFDWjtBQUFDO0FBQ0UsYUFBaUIsaUJBQUU7QUFDZCxrQkFBZ0Isa0JBQ3hCO0FBQUM7QUFDRSxhQUFDLE9BQVMsT0FBaUIsYUFBQyxNQUFNLElBQVMsTUFBc0M7QUFDaEYsY0FBTyxPQUNmO0FBQUM7QUFuQkQsMkJBQWtCLFFBQU87Y0FBekI7QUFBNEMsb0JBQVUsdUJBQWM7QUFBQztjQUNyRSxhQUF1QztBQUFhLG9DQUFZLGNBQVU7QUFBQzs7dUJBRE47O0FBb0JyRSwyQkFBVyxrQkFBcUI7Y0FBaEM7QUFBMkMsb0JBQUssS0FBaUIsaUJBQUssS0FBSSxJQUFpQixrQkFBTSxLQUFJLElBQVcsV0FBWTtBQUFDOzt1QkFBQTs7QUFDN0gsMkJBQVcsa0JBQWlCO2NBQTVCO0FBQXVDLG9CQUFLLEtBQWlCLGlCQUFLLEtBQUksSUFBaUIsa0JBQU0sS0FBSSxJQUFXLFdBQVE7QUFBQzs7dUJBQUE7O0FBQ3JILDJCQUFXLGtCQUFpQjtjQUE1QjtBQUF1QyxvQkFBSyxLQUFpQixpQkFBSyxLQUFJLElBQWlCLGtCQUFNLEtBQUksSUFBVyxXQUFRO0FBQUM7O3VCQUFBOztBQUM3RyxzQkFBZ0IsbUJBQXhCLFVBQXFDLE1BQWE7QUFDOUMsYUFBTyxNQUFNO0FBQ1YsYUFBTSxNQUFJLE1BQVE7QUFDbEIsYUFBSyxLQUFJLE9BQU8sTUFBTztBQUNwQixnQkFDVjtBQUFDO0FBQ0QsMkJBQVcsa0JBQUc7Y0FBZDtBQUE4QixvQkFBVSx1QkFBVztBQUFDO2NBQ3BELGFBQXlCO0FBQ2pCLGtCQUFZLFlBQU0sT0FBTSxLQUNoQztBQUFDOzt1QkFIbUQ7O0FBSTdDLHNCQUFNLFNBQWIsVUFBaUM7QUFBbkIsOEJBQW1CO0FBQW5CLHVCQUFtQjs7QUFDN0IsYUFBUSxPQUFRO0FBQ2IsYUFBUSxXQUFJLE9BQWMsV0FBYSxVQUFFO0FBQ2pDLHVCQUFXLFNBQWUsZUFDckM7QUFBQztBQUNFLGFBQVMsU0FBRTtBQUNOLGtCQUFnQixrQkFDeEI7QUFBQztBQUNNLG1CQUFPLEtBQWlCO0FBQzVCLGFBQUMsQ0FBUyxTQUFRO0FBQ2QsaUJBQVUsWUFBTyxLQUFlO0FBQ25DLGNBQWdCO0FBQ2hCLGNBQVcsV0FBSyxLQUFLLE1BQzdCO0FBQUM7QUFDTSxzQkFBcUIsd0JBQTVCLFVBQW9ELFVBQTZCO0FBQXBELCtCQUF1QjtBQUF2Qix3QkFBdUI7O0FBQUUsc0NBQTJCO0FBQTNCLCtCQUEyQjs7QUFDMUUsYUFBaUIsaUJBQUU7QUFDZCxrQkFBZ0Isa0JBQ3hCO0FBQUM7QUFDRCxnQkFBSyxVQUFzQixpQ0FDL0I7QUFBQztBQUNTLHNCQUFZLGVBQXRCO0FBQ0ksZ0JBQUssVUFBYSxrQkFBRztBQUNqQixjQUNSO0FBQUM7QUFDUyxzQkFBYSxnQkFBdkIsVUFBb0M7QUFBVSxnQkFBUyxpQkFBUTtBQUFDO0FBQ3RELHNCQUFXLGNBQXJCO0FBQXdDLGdCQUFXLHVCQUFPO0FBQUM7QUFDakQsc0JBQWdCLG1CQUExQjtBQUNJLGFBQVEsT0FBUTtBQUNaLGNBQWdCLGtCQUFLLEdBQVcsV0FBSTtBQUNwQyxjQUFjLG1CQUFjLFNBQUM7QUFBa0Isa0JBQW1CLGtCQUFPLE9BQUssS0FBYztBQUFHLFVBQTVFO0FBQ25CLGNBQWMsbUJBQWMsU0FBQztBQUFrQixrQkFBbUIsa0JBQU8sT0FBSyxLQUFjO0FBQUcsVUFBNUU7QUFDbkIsY0FBYSxrQkFBYyxTQUFDO0FBQWtCLGtCQUFtQixrQkFBTyxPQUFLLEtBQWE7QUFBRyxVQUEzRTtBQUNsQixjQUFlLG9CQUFjLFNBQUM7QUFBa0Isa0JBQW1CLGtCQUFPLE9BQUssS0FBZTtBQUFHLFVBQTdFO0FBQ3BCLGNBQVcsZ0JBQWMsU0FBQztBQUFrQixrQkFBbUIsa0JBQU8sT0FBSyxLQUFnQjtBQUFHLFVBQTlFO0FBQ2hCLGNBQVEsYUFBYyxTQUFDO0FBQWtCLGtCQUFtQixrQkFBTyxPQUFLLEtBQVE7QUFDeEYsVUFEcUI7QUFDcEI7QUFDUyxzQkFBa0IscUJBQTVCLFVBQWdELFVBQXFCO0FBQzdELGNBQXVCO0FBQzNCLGdCQUFLLFVBQW1CLDhCQUFTLFVBQVk7QUFDMUMsYUFBQyxDQUFLLEtBQWEsZ0JBQVEsS0FBNkIsNkJBQUssS0FDcEU7QUFBQztBQUNELHNCQUFxQix3QkFBckIsVUFBaUMsTUFBbUI7QUFDaEQsZ0JBQUssVUFBc0IsaUNBQUssTUFBWTtBQUN4QyxjQUNSO0FBQUM7QUFDUyxzQkFBdUIsMEJBQWpDO0FBQ1EsY0FDUjtBQUFDO0FBQ1Msc0JBQTBCLDZCQUFwQztBQUNRLGNBQ1I7QUFBQztBQUNPLHNCQUFZLGVBQXBCO0FBQ08sYUFBQyxDQUFLLEtBQWlCLGlCQUFRO0FBQzlCLGNBQXVCO0FBQ3pCLFlBQVUsVUFBSyxLQUFrQjtBQUNoQyxhQUFDLENBQUssS0FBZSxlQUFFO0FBQ2xCLGtCQUNSO0FBQUM7QUFDRyxjQUFjLGdCQUFTO0FBQ3pCLFlBQWMsY0FBSyxNQUFNLEtBQy9CO0FBQUM7QUFDTyxzQkFBbUIsc0JBQTNCO0FBQ1EsY0FBZ0IsZ0JBQUssS0FBa0Isb0JBQy9DO0FBQUM7QUFDTyxzQkFBMEIsNkJBQWxDO0FBQ0ksYUFBYSxZQUFPLEtBQVksY0FBTyxLQUFZLFlBQVUsWUFBTTtBQUMvRCxjQUFDLElBQUssSUFBSSxHQUFHLElBQVksVUFBTyxRQUFLLEtBQUc7QUFDeEMsaUJBQUssSUFBWSxVQUFJO0FBQ2xCLGlCQUFFLEVBQVMsU0FBRSxFQUNwQjtBQUNKO0FBQUM7QUFDTCxZQUFDO0FBQUEsd0I7Ozs7Ozs7QUNqSEQsaUQ7Ozs7Ozs7Ozs7O0FDQU87O0tBQXVCOztBQUNxQjs7QUFJbkQ7Ozs7O0FBQWlDLDRCQUFnQjtBQUU3QywwQkFBa0MsTUFBK0I7QUFDN0QsMkJBQVUsTUFBWTtBQURQLGNBQUksT0FBVztBQUFTLGNBQVEsV0FBYztBQUV6RCxjQUFVLFlBQUssR0FBVyxXQUFLLEtBQ3ZDO0FBQUM7QUFDUywyQkFBZ0IsbUJBQTFCO0FBQ1EsY0FBVSxVQUFLLEtBQ3ZCO0FBQUM7QUFDTSwyQkFBYSxnQkFBcEIsVUFBdUIsSUFBSztBQUNwQixjQUFDLElBQUssSUFBSSxHQUFHLElBQUssR0FBTyxRQUFLLEtBQUc7QUFDakMsaUJBQU8sTUFBSyxHQUFJO0FBQ2hCLGlCQUFTLFFBQU0sSUFBVTtBQUN0QixpQkFBTSxTQUFZLFNBQUksSUFBSyxPQUNsQztBQUNKO0FBQUM7QUFDTCxZQUFDO0FBRUQ7O0FBQTBCLHFCQUFTO0FBRS9CLG1CQUE2QjtBQUFqQiwyQkFBaUI7QUFBakIsb0JBQWlCOztBQUN6QiwyQkFBWTtBQUNSLGNBQUssT0FBSyxHQUFXLFdBQUs7QUFDMUIsY0FDUjtBQUFDO0FBQ1Msb0JBQVMsWUFBbkIsVUFBMEM7QUFBNEIsZ0JBQUMsSUFBZSxZQUFLLE1BQWE7QUFBQztBQUMvRixvQkFBVSxhQUFwQixZQUF5QixDQUFDO0FBQ2hCLG9CQUFZLGVBQXRCLFVBQW9DO0FBQzVCLGNBQUssS0FBTSxRQUFJLElBQVEsUUFBTyxPQUN0QztBQUFDO0FBQ0wsWUFBQztBQUFBO0FBQ1Msd0JBQVMsU0FBc0Isc0JBQU8sUUFBRTtBQUFvQixZQUFDLElBQVk7QUFBRyxJOzs7Ozs7Ozs7O0FDcEMvRSxLQUFjLGtDQUFHLEVBQU0sTUFBTztBQUFXLFlBQUssT0FBbWxjLGdsYzs7Ozs7Ozs7Ozs7QUNBam9jOztLQUdQOzs7OztBQUVJLHNDQUF5QztBQUF0QixjQUFRLFdBQWM7QUFDckMsYUFBUSxPQUFRO0FBQ1Isa0JBQTBCLDRCQUFHO0FBQWtCLGtCQUF3QjtBQUFFO0FBQ3pFLGtCQUEyQiw2QkFBRztBQUFrQixrQkFBeUI7QUFBRTtBQUMvRSxjQUFVLFlBQUssR0FBVyxXQUFLLEtBQVMsU0FBVTtBQUNsRCxjQUFjLGdCQUFLLEdBQVcsV0FBSyxLQUFTLFNBQWM7QUFDMUQsY0FBUyxXQUFLLEdBQW1CO0FBQ2pDLGNBQWEsa0JBQWtCLGFBQUM7QUFBa0Isa0JBQWlCLGdCQUFPLE9BQUssS0FBYyxjQUFLLEtBQVMsU0FBVTtBQUFHLFVBQXRHO0FBQ2xCLGNBQWUsaUJBQUssR0FBVyxXQUFLLEtBQWMsY0FBSyxLQUFTLFNBQWU7QUFDL0UsY0FBUyxTQUFhLGVBQU8sS0FBVztBQUN4QyxjQUFTLFNBQWlCLG1CQUFPLEtBQWU7QUFDaEQsY0FBUyxTQUFZLGNBQU8sS0FBVTtBQUN0QyxjQUFTLFNBQWdCLGtCQUFPLEtBQWM7QUFDOUMsY0FBUyxTQUFrQixvQkFBTyxLQUFnQjtBQUNsRCxjQUFTLFNBQWtCLG9CQUFHO0FBQWtCLGtCQUFtQjtBQUMzRTtBQUFDO0FBQ1MsdUNBQWMsaUJBQXhCLFlBQThCLENBQUM7QUFDckIsdUNBQW1CLHNCQUE3QjtBQUNRLGNBQVUsVUFBSyxLQUFTLFNBQ2hDO0FBQUM7QUFDUyx1Q0FBb0IsdUJBQTlCO0FBQ1EsY0FBYyxjQUFLLEtBQVMsU0FBYztBQUMxQyxjQUFlLGVBQUssS0FBYyxjQUFLLEtBQVMsU0FDeEQ7QUFBQztBQUNPLHVDQUFhLGdCQUFyQixVQUFvQztBQUM3QixhQUFPLFNBQUssR0FBTyxPQUFJO0FBQ3ZCLGFBQUMsQ0FBSyxLQUFTLFNBQVMsU0FBTyxPQUFJO0FBQ3RDLGFBQU8sTUFBTyxLQUFTLFNBQVEsUUFBUTtBQUNwQyxhQUFDLENBQUssS0FBTyxPQUFJO0FBQ2QsZ0JBQU8sU0FBTSxJQUFTLFNBQU8sU0FDdkM7QUFBQztBQUNMLFlBQUM7QUFBQSxLOzs7Ozs7Ozs7OztBQ3BDTTs7S0FBdUI7O0FBSTlCOzs7OztBQUF5QyxvQ0FBdUI7QUFJNUQsa0NBQXFDO0FBQ2pDLDJCQUFnQjtBQURELGNBQVEsV0FBVTtBQUg3QixjQUFVLGFBQWtCO0FBS2hDLGFBQVEsT0FBUTtBQUNSLGtCQUFxQix1QkFBRztBQUFrQixrQkFBbUI7QUFBRTtBQUMvRCxrQkFBdUIseUJBQUc7QUFBa0Isa0JBQXFCO0FBQUU7QUFDbkUsa0JBQXNCLHdCQUFHO0FBQWtCLGtCQUFvQjtBQUFFO0FBQ2pFLGtCQUFxQix1QkFBRztBQUFrQixrQkFBMEI7QUFBRTtBQUN0RSxrQkFBNEIsOEJBQUc7QUFBa0Isa0JBQTBCO0FBQUU7QUFDakYsY0FBUSxVQUFLLEdBQVcsV0FBSTtBQUM1QixjQUFRLFVBQU8sS0FBaUI7QUFDaEMsY0FBVSxZQUFLLEdBQVcsV0FBSyxLQUFTLFNBQVU7QUFDbEQsY0FBUSxhQUFrQixhQUFDO0FBQWtCLGtCQUFXLFVBQU8sT0FBSyxLQUFTLFNBQVk7QUFBRyxVQUEvRTtBQUNiLGNBQVMsU0FBSyxLQUFTLFNBQVM7QUFDaEMsY0FBUSxRQUFVLFVBQUMsVUFBa0I7QUFDakMsa0JBQVksWUFDcEI7QUFBRztBQUNDLGNBQVUsVUFBVSxVQUFDLFVBQWtCO0FBQ25DLGtCQUFjLGNBQ3RCO0FBQUc7QUFDQyxjQUFTLFNBQVcsYUFBTyxLQUFTO0FBQ3BDLGNBQVMsU0FBYSxlQUFPLEtBQVc7QUFDeEMsY0FBUyxTQUFXLGFBQU8sS0FBUztBQUNwQyxjQUFTLFNBQXlCLDJCQUFPLEtBQ2pEO0FBQUM7QUFDUyxtQ0FBYyxpQkFBeEI7QUFDUSxjQUFRLFFBQUssS0FBVSxZQUMvQjtBQUFDO0FBQ1MsbUNBQWMsaUJBQXhCO0FBQ08sYUFBSyxLQUFZLFlBQVE7QUFDeEIsY0FBVyxXQUFLLEtBQVMsU0FDakM7QUFBQztBQUNTLG1DQUFnQixtQkFBMUI7QUFDTyxhQUFLLEtBQVksWUFBUTtBQUN4QixjQUFVLFVBQUssS0FBUyxTQUNoQztBQUFDO0FBQ1MsbUNBQW1CLHNCQUE3QjtBQUNRLGNBQVUsVUFBSyxLQUFTLFNBQ2hDO0FBQUM7QUFDUyxtQ0FBcUIsd0JBQS9CO0FBQ1EsY0FBUSxRQUFLLEtBQVUsWUFDL0I7QUFBQztBQUNTLG1DQUFlLGtCQUF6QjtBQUNRLGNBQVMsU0FBSyxLQUFTLFNBQy9CO0FBQUM7QUFDUyxtQ0FBYSxnQkFBdkI7QUFBdUMsZ0JBQUcsR0FBVyxXQUFLLEtBQVMsU0FBUztBQUFDO0FBQ25FLG1DQUFVLGFBQXBCLFVBQWtDO0FBQzFCLGNBQVEsUUFDaEI7QUFBQztBQUNTLG1DQUFXLGNBQXJCLFVBQW1DO0FBQzNCLGNBQVcsYUFBUTtBQUNuQixjQUFTLFNBQU0sUUFBWTtBQUMzQixjQUFXLGFBQ25CO0FBQUM7QUFDUyxtQ0FBYSxnQkFBdkIsVUFBcUM7QUFDN0IsY0FBVyxhQUFRO0FBQ25CLGNBQVMsU0FBUSxVQUFZO0FBQzdCLGNBQVcsYUFDbkI7QUFBQztBQUNTLG1DQUFLLFFBQWY7QUFDVSxnQkFBSyxLQUFTLFNBQWEsZUFBRyxDQUFFLElBQU8sS0FBUyxTQUFhLGVBQUksSUFBTyxPQUNsRjtBQUFDO0FBQ1MsbUNBQXFCLHdCQUEvQixVQUFrQyxJQUFLO0FBQ25DLGFBQU8sTUFBSyxHQUFJO0FBQ2IsYUFBSSxJQUFTLFlBQVksU0FBSSxJQUFLLE9BQU07QUFDeEMsZUFBSyxHQUFHLEdBQU8sU0FBTTtBQUNyQixhQUFJLElBQVMsWUFBWSxTQUFJLElBQUssT0FDekM7QUFBQztBQUNMLFlBQUM7QUFBQSw0Qzs7Ozs7Ozs7Ozs7O0FDM0VNOztLQUF1Qjs7QUFLOUI7Ozs7O0FBQW1ELDhDQUFtQjtBQUVsRSw0Q0FBOEI7QUFDMUIsMkJBQWdCO0FBQ2hCLGFBQVEsT0FBUTtBQUVaLGNBQWUsb0JBQWMsU0FBQztBQUFrQixrQkFBVyxVQUFPLE9BQUssS0FBa0I7QUFBRyxVQUF4RTtBQUNwQixjQUFpQixtQkFBSyxHQUFnQixnQkFBNEIsS0FBVSxTQUFpQjtBQUNqRSxrQkFBdUIseUJBQUc7QUFBa0Isa0JBQWlCLGlCQUE0QixLQUFVLFNBQWtCO0FBQUU7QUFDbkosY0FBUyxTQUFrQixvQkFBTyxLQUFnQjtBQUNsRCxjQUFTLFNBQW9CLHNCQUFPLEtBQzVDO0FBQUM7QUFDRCwyQkFBYyx5Q0FBZTtjQUE3QjtBQUNVLG9CQUEwQixLQUFVLFNBQzlDO0FBQUM7O3VCQUFBOztBQUNMLFlBQUM7QUFDRDs7QUFBcUQsZ0RBQTZCO0FBRTlFLDhDQUE4QjtBQUMxQiwyQkFBZ0I7QUFDWixjQUFRLFVBQUssR0FBVyxXQUFLLEtBQVc7QUFDeEMsY0FBUyxTQUFXLGFBQU8sS0FBUztBQUNwQyxjQUFTLFNBQWlCLG1CQUFPLEtBQWU7QUFDcEQsYUFBUSxPQUFRO0FBQ1csY0FBVSxTQUF3QiwwQkFBRztBQUFrQixrQkFBc0I7QUFDNUc7QUFBQztBQUNTLCtDQUFpQixvQkFBM0I7QUFDUSxjQUFTLFNBQVcsYUFBSyxHQUFXLFdBQUssS0FDakQ7QUFBQztBQUNELDJCQUFjLDJDQUFRO2NBQXRCO0FBQ0ksaUJBQVksV0FBOEIsS0FBVSxTQUFVO0FBQ3hELG9CQUFTLFdBQUksSUFBTyxNQUFZLFFBQWhCLEdBQXNCLE1BQ2hEO0FBQUM7O3VCQUFBOztBQUNPLCtDQUFhLGdCQUFyQixVQUF3QixJQUFLO0FBQ3pCLGFBQU8sTUFBSyxHQUFJO0FBQ2IsYUFBSSxJQUFTLFlBQVksU0FBSSxJQUFLLE9BQU07QUFDeEMsZUFBSyxHQUFHLEdBQU8sU0FBTTtBQUNyQixhQUFJLElBQVMsWUFBWSxTQUFJLElBQUssT0FDekM7QUFBQztBQUNMLFlBQUM7QUFBQSxrQzs7Ozs7Ozs7Ozs7O0FDNUNNOztLQUF1Qjs7QUFDeUM7O0FBQy9COztBQUNVOztBQUNROzs7O0FBRzFEO0FBQTBDLDRDQUErQjtBQUNyRSwwQ0FBOEI7QUFDMUIsMkJBQ0o7QUFBQztBQUNTLDJDQUFhLGdCQUF2QjtBQUNVLGdCQUFLLEtBQVMsU0FBTSxRQUFLLEdBQWdCLGdCQUFLLEtBQVMsU0FBTyxTQUFLLEdBQzdFO0FBQUM7QUFDUywyQ0FBVSxhQUFwQixVQUFrQztBQUMzQixhQUFVLFVBQUU7QUFDUCxrQkFBUSxRQUFHLEdBQU8sT0FDMUI7QUFBTSxnQkFBRTtBQUNBLGtCQUFRLFFBQ2hCO0FBQ0o7QUFBQztBQUNMLFlBQUM7QUFDRDs7QUFBc0MsaUNBQXFCO0FBQ3ZELCtCQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUUzQixhQUErQiw0QkFDbkM7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQXNCLHNCQUFXLFlBQUU7QUFBb0IsWUFBQyxJQUFvQixpQkFBTTtBQUFHO0FBQ3pGLGtDQUFTLFNBQWlCLGlCQUFXLFlBQUUsVUFBSztBQUFPLFNBQUssSUFBRyxJQUFvQixpQkFBTyxNQUFFLEVBQVEsVUFBa0IsaUNBQWdCLGVBQU8sT0FBSTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQzlCdkg7O0FBQ1U7O0FBQ007O0FBR3hEOzs7QUFBcUMsZ0NBQW9CO0FBQ3JELDhCQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUVKLDZDQUMzQjtBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBc0Isc0JBQVUsV0FBRTtBQUFvQixZQUFDLElBQW1CLGdCQUFNO0FBQUc7QUFDdkYsa0NBQVMsU0FBaUIsaUJBQVUsV0FBRSxVQUFLO0FBQWEsWUFBQyxJQUFtQixnQkFBUTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQ2I1Qzs7QUFDbEI7O0FBQ1U7O0FBR2xEOzs7QUFBc0MsaUNBQXFCO0FBQ3ZELCtCQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUVNLGtFQUNyQztBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBc0Isc0JBQVcsWUFBRTtBQUFvQixZQUFDLElBQW9CLGlCQUFNO0FBQUc7QUFDekYsa0NBQVMsU0FBaUIsaUJBQVcsWUFBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQW9CLGlCQUFPLE1BQUUsRUFBUSxVQUFrQixpQ0FBZ0IsZUFBTyxPQUFJO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDYnhKOztLQUF1Qjs7QUFDVTs7QUFDVTs7QUFDQTs7QUFJbEQ7Ozs7O0FBQTZDLHdDQUFtQjtBQUU1RCxzQ0FBOEI7QUFDMUIsMkJBQWdCO0FBQ2hCLGFBQVEsT0FBUTtBQUNaLGNBQWMsZ0JBQUssR0FBVyxXQUFJO0FBQ2xDLGNBQU8sWUFBYyxTQUFDO0FBQWtCLGtCQUFpQixnQkFBTyxPQUF5QixLQUFVLFNBQWU7QUFBRyxVQUF6RztBQUNaLGNBQVcsYUFBSyxHQUFXLFdBQVE7QUFDbkMsY0FBUyxTQUFVLFlBQU8sS0FBUTtBQUNsQyxjQUFTLFNBQWMsZ0JBQU8sS0FBWTtBQUV0QixjQUFVLFNBQTJCLDZCQUFHO0FBQWtCLGtCQUFrQjtBQUFFO0FBQ2xHLGNBQVMsU0FBWSxjQUFHLFVBQWMsTUFBTztBQUFJLGlCQUFPLE1BQVEsTUFBTyxVQUFTLE1BQVksV0FBSyxLQUFTLFNBQU87QUFDekg7QUFBQztBQUNPLHVDQUFRLFdBQWhCLFVBQXlCO0FBQ2xCLGFBQUMsQ0FBTyxPQUFlLGVBQVE7QUFDL0IsYUFBQyxDQUFJLE9BQUksQ0FBSSxJQUFNLFNBQU8sSUFBTSxNQUFPLFNBQUssR0FBUTtBQUMvQixjQUFVLFNBQVMsU0FBSSxJQUFNLE1BQ3pEO0FBQUM7QUFDTyx1Q0FBYSxnQkFBckI7QUFDUSxjQUFjLGNBQUssS0FBZ0Isa0JBQU07QUFDekMsY0FBVyxXQUNuQjtBQUFDO0FBQ0wsWUFBQztBQUNEOztBQUFrQyw2QkFBaUI7QUFDL0MsMkJBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUFRO0FBRTNCLGFBQTJCLHdCQUMvQjtBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBc0Isc0JBQU8sUUFBRTtBQUFvQixZQUFDLElBQWdCLGFBQU07QUFBRztBQUNqRixrQ0FBUyxTQUFpQixpQkFBTyxRQUFFLFVBQUs7QUFBYSxZQUFDLElBQWdCLGFBQVE7QUFBRyxJOzs7Ozs7Ozs7Ozs7QUN2Q3hEOztBQUNVOztBQUNNOztBQUd4RDs7O0FBQWtDLDZCQUFpQjtBQUMvQywyQkFBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFFQSxxREFDL0I7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQXNCLHNCQUFPLFFBQUU7QUFBb0IsWUFBQyxJQUFnQixhQUFNO0FBQUc7QUFDakYsa0NBQVMsU0FBaUIsaUJBQU8sUUFBRSxVQUFLO0FBQWEsWUFBQyxJQUFnQixhQUFRO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDYnpGOztLQUF1Qjs7QUFDcUQ7O0FBQ25DOztBQUNSOztBQUd4Qzs7Ozs7QUFBK0IsMEJBQWM7QUFHekMsd0JBQTRCLE1BQXFCLE1BQXlCLFVBQW1CLE1BQVk7QUFDckcsMkJBQVUsTUFBTSxNQUFVLFVBQU0sTUFBUztBQUQxQixjQUFJLE9BQUs7QUFBUyxjQUFJLE9BQVE7QUFBUyxjQUFRLFdBQVE7QUFGbEUsY0FBZSxrQkFBUztBQUl4QixjQUFRLFVBQUssR0FBVyxXQUFLLEtBQVE7QUFDekMsYUFBUSxPQUFRO0FBQ1osY0FBUSxRQUFVLFVBQUMsVUFBa0I7QUFDbEMsaUJBQUssS0FBaUIsaUJBQU07QUFDM0Isa0JBQU0sUUFDZDtBQUNKO0FBQUM7QUFDUyx5QkFBYyxpQkFBeEI7QUFDUSxjQUFnQixrQkFBUTtBQUN4QixjQUFRLFFBQUssS0FBUTtBQUNyQixjQUFnQixrQkFDeEI7QUFBQztBQUNMLFlBQUM7QUFDRDs7QUFBb0MsK0JBQW1CO0FBQ25ELDZCQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUVKLDZDQUMzQjtBQUFDO0FBQ1MsOEJBQWUsa0JBQXpCLFVBQW1DLE1BQWMsTUFBa0IsVUFBWTtBQUNyRSxnQkFBQyxJQUFhLFVBQUssTUFBTSxNQUFVLFVBQU0sTUFDbkQ7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQXNCLHNCQUFTLFVBQUU7QUFBb0IsWUFBQyxJQUFrQixlQUFNO0FBQUc7QUFDckYsa0NBQVMsU0FBaUIsaUJBQVMsVUFBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQWtCLGVBQU8sTUFBRSxFQUFLLE9BQUcsQ0FBUSxTQUFXLFNBQUUsRUFBUSxVQUFHLENBQVcsWUFBWSxZQUFjLFlBQU8sT0FBSTtBQUFHLEk7Ozs7Ozs7Ozs7OztBQ25DeEg7O0FBQzlCOztBQUNVOztBQUdsRDs7O0FBQTRDLHVDQUEyQjtBQUNuRSxxQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFFSiw2Q0FDM0I7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQXNCLHNCQUFpQixrQkFBRTtBQUFvQixZQUFDLElBQTBCLHVCQUFNO0FBQUc7QUFFckcsa0NBQVMsU0FBaUIsaUJBQWlCLGtCQUFFLFVBQUs7QUFBTyxTQUFLLElBQUcsSUFBMEIsdUJBQU8sTUFBRSxFQUFRLFVBQUcsQ0FBRSxHQUFHLEdBQUcsR0FBRyxHQUFLLEdBQUUsRUFBSyxPQUFHLENBQVEsU0FBVyxTQUFFLEVBQVUsVUFBYSxZQUFFLEVBQVUsVUFBYSxZQUFFLEVBQVUsVUFBYSxZQUFPLE9BQUk7QUFBRyxJOzs7Ozs7Ozs7Ozs7QUNkN1A7O0tBQXVCOztBQUNVOztBQUNVOztBQUNGOztBQU1oRDs7Ozs7QUFBc0QsaURBQW1CO0FBR3JFLCtDQUE4QjtBQUMxQiwyQkFBZ0I7QUFDWixjQUFTLFdBQUssR0FBVyxXQUFJO0FBQzdCLGNBQU8sWUFBa0IsYUFBQztBQUN0QixrQkFBWTtBQUFPLG9CQUE2QixLQUFVLFNBQ2xFO0FBQUMsVUFGZSxFQUVQO0FBQ0wsY0FBWSxpQkFBa0IsYUFBQztBQUN6QixvQkFBdUMsS0FBVSxTQUFpQixtQkFBVyxXQUN2RjtBQUFDLFVBRm9CLEVBRVo7QUFDTCxjQUFTLFNBQVUsWUFBTyxLQUFRO0FBQ3RDLGFBQVEsT0FBUTtBQUNaLGNBQWMsZ0JBQUc7QUFBa0Isa0JBQVc7QUFBQztBQUMvQyxjQUFpQixtQkFBRyxVQUFjO0FBQVEsa0JBQVUsVUFBUTtBQUFDO0FBQzdELGNBQVMsU0FBaUIsbUJBQU8sS0FBZTtBQUNoRCxjQUFTLFNBQW9CLHNCQUFPLEtBQWtCO0FBQ3RELGNBQVMsU0FBZSxpQkFBTyxLQUFhO0FBQ3BCLGNBQVUsU0FBd0IsMEJBQUc7QUFBa0Isa0JBQXNCO0FBQUU7QUFDL0UsY0FBVSxTQUF1Qix5QkFBRztBQUFrQixrQkFBb0I7QUFBRTtBQUM1RSxjQUFVLFNBQW1CLHFCQUFHO0FBQWtCLGtCQUFrQjtBQUNwRztBQUFDO0FBQ1MsZ0RBQWEsZ0JBQXZCO0FBQzJCO0FBQ3ZCLGFBQVEsT0FBK0IsS0FBVSxTQUF5QjtBQUMxRSxhQUFXLFVBQStCLEtBQVUsU0FBUztBQUMxRCxhQUFLLFFBQVEsS0FBTyxTQUFJLEtBQVcsV0FBVyxRQUFPLFNBQUssR0FBSyxLQUN0RTtBQUFDO0FBQ1MsZ0RBQWUsa0JBQXpCO0FBQ0ksYUFBUSxPQUErQixLQUFVLFNBQWE7QUFDMUQsY0FDUjtBQUFDO0FBQ1MsZ0RBQWlCLG9CQUEzQjtBQUNRLGNBQVMsU0FBSyxLQUFXLGFBQ2pDO0FBQUM7QUFDUyxnREFBTSxTQUFoQjtBQUNnQyxjQUFVLFNBQzFDO0FBQUM7QUFDUyxnREFBUyxZQUFuQixVQUE4QztBQUMxQyxhQUFRLE9BQStCLEtBQVUsU0FBbUI7QUFDcEUsYUFBUyxRQUFPLEtBQVEsUUFBTTtBQUMzQixhQUFNLFFBQUcsQ0FBRyxHQUFFO0FBQ2Usa0JBQVUsU0FBVSxVQUNwRDtBQUNKO0FBQUM7QUFDTCxZQUFDO0FBRUQ7O0FBQTJDLHNDQUEwQjtBQUNqRSxvQ0FBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFFM0IsYUFBb0MsaUNBQ3hDO0FBQUM7QUFDTCxZQUFDO0FBQUE7QUFFUyx3QkFBUyxTQUFzQixzQkFBZ0IsaUJBQUU7QUFBb0IsWUFBQyxJQUF5QixzQkFBTTtBQUFHO0FBRW5HLGtDQUFTLFNBQWlCLGlCQUFnQixpQkFBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQXlCLHNCQUFPLE1BQUUsRUFBUSxVQUFHLENBQUUsR0FBRyxHQUFHLEdBQUcsR0FBSyxHQUFFLEVBQVMsV0FBSyxFQUFFLEVBQVUsVUFBYSxZQUFFLEVBQVUsVUFBYSxZQUFFLEVBQVUsVUFBYSxZQUFPLE9BQUk7QUFBRyxJOzs7Ozs7Ozs7Ozs7QUNsRTlPOztLQUF1Qjs7QUFDMkQ7O0FBQ3pDOztBQUVSOztBQUd4Qzs7Ozs7QUFBc0MsaUNBQXFCO0FBR3ZELCtCQUFtQyxNQUFzQjtBQUE3QywyQkFBdUI7QUFBdkIsb0JBQXVCOztBQUFFLDRCQUFvQjtBQUFwQixxQkFBb0I7O0FBQ3JELDJCQUFVLE1BQVM7QUFESixjQUFJLE9BQVk7QUFGM0IsY0FBaUIsb0JBQVM7QUFJMUIsY0FBUSxVQUFLLEdBQVcsV0FBSyxLQUFRO0FBQ3pDLGFBQVEsT0FBUTtBQUNaLGNBQVEsUUFBVSxVQUFDLFVBQWtCO0FBQ2xDLGlCQUFDLENBQUssS0FBbUIsbUJBQUU7QUFDdEIsc0JBQU0sUUFDZDtBQUNKO0FBQ0o7QUFBQztBQUNELGdDQUFjLGlCQUFkLFVBQTRCO0FBQ3BCLGNBQWtCLG9CQUFRO0FBQzFCLGNBQVEsUUFBVztBQUNuQixjQUFrQixvQkFDMUI7QUFBQztBQUNMLFlBQUM7QUFFRDs7QUFBcUQsZ0RBQW1CO0FBRXBFLDhDQUE4QjtBQUMxQiwyQkFBZ0I7QUFDWixjQUFPLFNBQUssR0FBZ0IsZ0JBQWlDLEtBQVUsU0FBWTtBQUNuRixjQUFTLFNBQVUsWUFBTyxLQUFRO0FBQ2xDLGNBQXFCO0FBQ3pCLGFBQVEsT0FBUTtBQUNnQixjQUFVLFNBQXdCLDBCQUFHO0FBQWtCLGtCQUFzQjtBQUNqSDtBQUFDO0FBQ1MsK0NBQWlCLG9CQUEzQjtBQUNRLGNBQU8sT0FBaUMsS0FBVSxTQUMxRDtBQUFDO0FBQ0wsWUFBQztBQUVEOztBQUEwQyxxQ0FBeUI7QUFDL0QsbUNBQStCO0FBQzNCLDJCQUFZO0FBREcsY0FBSSxPQUFRO0FBRTNCLGFBQW1DLGdDQUN2QztBQUFDO0FBQ1Msb0NBQWMsaUJBQXhCLFVBQXFDLE1BQWU7QUFDMUMsZ0JBQUMsSUFBb0IsaUJBQUssTUFDcEM7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQXNCLHNCQUFtQixvQkFBRTtBQUFvQixZQUFDLElBQW9CLGlCQUFNO0FBQUc7QUFFdEcsd0JBQVMsU0FBc0Isc0JBQWUsZ0JBQUU7QUFBb0IsWUFBQyxJQUF3QixxQkFBTTtBQUFHO0FBRWpHLGtDQUFTLFNBQWlCLGlCQUFlLGdCQUFFLFVBQUs7QUFBTyxTQUFLLElBQUcsSUFBd0IscUJBQU8sTUFBRSxFQUFRLFFBQVUsU0FBRSxFQUFRLFFBQVUsU0FBTyxPQUFJO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDeERyRzs7QUFDdEI7O0FBQ1U7O0FBR2xEOzs7QUFBd0MsbUNBQXVCO0FBQzNELGlDQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUVRLG9FQUN2QztBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBc0Isc0JBQWEsY0FBRTtBQUFvQixZQUFDLElBQXNCLG1CQUFNO0FBQUc7QUFFN0Ysa0NBQVMsU0FBaUIsaUJBQWEsY0FBRSxVQUFLO0FBQU8sU0FBSyxJQUFHLElBQXNCLG1CQUFPLE1BQUUsRUFBUSxVQUFrQixpQ0FBZ0IsZUFBTyxPQUFJO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDZDVKOztLQUF1Qjs7QUFDa0I7O0FBQ007O0FBQ2Q7O0FBQ1U7Ozs7QUFHbEQ7QUFBd0MsMENBQW1CO0FBRXZELHdDQUE4QjtBQUMxQiwyQkFBZ0I7QUFDWixjQUFvQixzQkFBSyxHQUFnQixnQkFBSyxLQUFjO0FBQzVELGNBQVMsU0FBdUIseUJBQU8sS0FBcUI7QUFDaEUsYUFBUSxPQUFRO0FBQ1osY0FBUyxXQUFHLFVBQWE7QUFBUSxrQkFBUSxRQUFJLElBQWE7QUFBRTtBQUM1RCxjQUFTLFNBQVksY0FBTyxLQUFVO0FBQ3JCLGNBQVUsU0FBMEIsNEJBQUc7QUFBa0Isa0JBQXdCO0FBQUU7QUFDcEcsY0FBUyxTQUFZLGNBQUcsVUFBYTtBQUNyQyxpQkFBTyxNQUF3QixLQUFVLFNBQVM7QUFDNUMsb0JBQUssS0FBUyxTQUFhLGdCQUFPLElBQU0sUUFBTSxNQUFZLFlBQVE7QUFDaEY7QUFBQztBQUNTLHlDQUFtQixzQkFBN0I7QUFDUSxjQUFvQixvQkFBSyxLQUNqQztBQUFDO0FBQ08seUNBQVMsWUFBakI7QUFBd0MsZ0JBQXNCLEtBQVUsU0FBb0I7QUFBQztBQUNqRyxZQUFDO0FBRUQ7O0FBQW9DLCtCQUFtQjtBQUVuRCw2QkFBK0I7QUFDM0IsMkJBQVk7QUFERyxjQUFJLE9BQVE7QUFFM0IsYUFBNkIsMEJBQ2pDO0FBQUM7QUFDUyw4QkFBUyxZQUFuQjtBQUNRLGNBQVEsVUFBTyxLQUFLLEtBQU8sT0FBTyxPQUMxQztBQUFDO0FBQ0wsWUFBQztBQUFBO0FBRVMsd0JBQVMsU0FBc0Isc0JBQVMsVUFBRTtBQUFvQixZQUFDLElBQWtCLGVBQU07QUFBRztBQUVyRixrQ0FBUyxTQUFpQixpQkFBUyxVQUFFLFVBQUs7QUFBYSxZQUFDLElBQWtCLGVBQVE7QUFBRyxJOzs7Ozs7Ozs7Ozs7QUN4Q2xEOztBQUNWOztBQUNVOztBQUlsRDs7O0FBQTZDLHdDQUFtQjtBQUM1RCxzQ0FBcUM7QUFDakMsMkJBQWdCO0FBREQsY0FBUSxXQUUzQjtBQUFDO0FBQ1MsdUNBQVcsY0FBckIsVUFBbUM7QUFDL0IsZ0JBQUssVUFBWSx1QkFBVztBQUN6QixhQUFTLGFBQVMsS0FBUyxTQUFPLE9BQUU7QUFDL0Isa0JBQVEsUUFBSyxLQUFTLFNBQzlCO0FBQ0o7QUFBQztBQUVMLFlBQUM7QUFFRDs7QUFBa0MsNkJBQWlCO0FBQy9DLDJCQUErQjtBQUMzQiwyQkFBWTtBQURHLGNBQUksT0FBUTtBQUUzQixhQUEyQix3QkFDL0I7QUFBQztBQUNMLFlBQUM7QUFBQTtBQUVTLHdCQUFTLFNBQXNCLHNCQUFPLFFBQUU7QUFBb0IsWUFBQyxJQUFnQixhQUFNO0FBQUc7QUFFakYsa0NBQVMsU0FBaUIsaUJBQU8sUUFBRSxVQUFLO0FBQWEsWUFBQyxJQUFnQixhQUFRO0FBQUcsSTs7Ozs7Ozs7Ozs7O0FDNUJ6Rjs7S0FBdUI7O0FBQ21COztBQUVoQjs7QUFHakM7Ozs7O0FBQWtDLDZCQUFpQjtBQUkvQywyQkFBd0I7QUFDcEIsMkJBQWU7QUFDWCxjQUFXLGFBQUssR0FBVyxXQUFRO0FBQ25DLGNBQWMsZ0JBQUssR0FBVyxXQUFLLEtBQWlCO0FBQ3hELGFBQVEsT0FBUTtBQUNaLGNBQVMsV0FBRztBQUFrQixrQkFBbUI7QUFBQztBQUNsRCxjQUFPLE9BQVcsV0FBSSxJQUFDLFVBQW9CO0FBQVcsa0JBQWMsYUFBSyxLQUFjLGNBQUssS0FBaUI7QUFDckg7QUFBQztBQUNTLDRCQUFZLGVBQXRCLFVBQW1DO0FBQ3pCLGdCQUFXLHFCQUNyQjtBQUFDO0FBQ1MsNEJBQWMsaUJBQXhCLFVBQXVDO0FBQ25DLGdCQUFLLFVBQWUsMEJBQVE7QUFDeEIsY0FBVyxXQUFLLEtBQ3hCO0FBQUM7QUFDRCwyQkFBYyx3QkFBUTtjQUF0QjtBQUF5QyxvQkFBSyxLQUFjLGdCQUFPLEtBQWMsZ0JBQU8sS0FBdUI7QUFBQztjQUNoSCxhQUFvQztBQUFRLGtCQUFjLGdCQUFVO0FBQUM7O3VCQUQyQzs7QUFFekcsNEJBQUksT0FBWDtBQUNRLGNBQWMsY0FBVSxZQUFPLEtBQVU7QUFDM0MsWUFBVSxVQUFLLEtBQWdCO0FBQy9CLFlBQWMsY0FBSyxNQUFNLEtBQWdCO0FBQ25DLGtCQUFLLEtBQVksWUFBSyxLQUFnQjtBQUNqQyxjQUFRLE9BQU8sT0FBYSxhQUFvQjtBQUN6RCxjQUFlLGlCQUN2QjtBQUFDO0FBQ1MsNEJBQWtCLHFCQUE1QjtBQUErQyxnQkFBVyw2QkFBTTtBQUFDO0FBQzFELDRCQUFJLE9BQVg7QUFDWSxrQkFBSyxLQUFZLFlBQUssS0FBZ0I7QUFDMUMsY0FBYyxjQUFVLFlBQU07QUFDOUIsY0FBZSxpQkFDdkI7QUFBQztBQUNELDJCQUFXLHdCQUFHO2NBQWQ7QUFBOEIsb0JBQUssS0FBTyxPQUFTO0FBQUM7O3VCQUFBOztBQUM1Qyw0QkFBYyxpQkFBdEI7QUFDUSxjQUFlLGVBQUMsQ0FBSyxLQUM3QjtBQUFDO0FBQ08sNEJBQVUsYUFBbEI7QUFDUSxjQUNSO0FBQUM7QUFDTyw0QkFBWSxlQUFwQjtBQUNVLGdCQUFLLEtBQWEsZUFBTyxLQUFJLElBQU8sT0FBTyxPQUFnQixrQkFBTyxLQUFJLElBQU8sT0FBTyxPQUM5RjtBQUFDO0FBQ0wsWUFBQztBQUFBLG9DOzs7Ozs7Ozs7O0FDbkRNLEtBQWMsa0NBQUcsRUFBTSxNQUFPO0FBQVcsWUFBSyxPQUF5aUIsc2lCOzs7Ozs7Ozs7OztBQ0U5bEI7OztBQUNJLG1DQUNBLENBQUM7QUFFTSxrQ0FBVyxjQUFsQixVQUFzQyxhQUFZLElBQTZCO0FBQTNCLG1DQUEyQjtBQUEzQiw0QkFBMkI7O0FBQ3pFLGNBQU8sS0FBTSxNQUFHLElBQWdCO0FBQ2xDLGFBQU8sTUFBTyxLQUFLLEtBQVEsUUFBSztBQUM3QixhQUFJLE1BQUssR0FBUTtBQUNqQixlQUFPLEtBQUssS0FBUSxRQUFJLEtBQU87QUFDL0IsYUFBSSxNQUFLLEdBQVE7QUFDcEIsYUFBWSxXQUFNLE1BQUs7QUFDdkIsYUFBYSxZQUFlO0FBQ3pCLGVBQU8sS0FBSyxLQUFRLFFBQVUsV0FBWTtBQUMxQyxhQUFJLE1BQUssR0FBUTtBQUNoQixjQUFLLE9BQU8sS0FBSyxLQUFPLE9BQUUsR0FBVyxZQUFjLGNBQU8sS0FBSyxLQUFPLE9BQzlFO0FBQUM7QUFDUyxrQ0FBSyxRQUFmLFVBQTBCLElBQXNCO0FBQzVDLGFBQVUsU0FBZ0IsZ0JBQU07QUFDN0IsYUFBYyxjQUFFO0FBQ1QsdUJBQU8sTUFDakI7QUFBQztBQUNLLGdCQUFPLFNBQ2pCO0FBQUM7QUFDRCwyQkFBYyw4QkFBSTtjQUFsQjtBQUFxQyxvQkFBVyx1QkFBTztBQUFDO2NBQ3hELGFBQWdDO0FBQWMsb0NBQUssT0FBVTtBQUFDOzt1QkFETjs7QUFFNUQsWUFBQztBQUFBLEs7Ozs7Ozs7O0FDM0JpQzs7QUFDRDs7QUFDRTs7QUFDRDs7QUFDQTs7QUFDRDs7QUFDQzs7QUFDQzs7QUFDQSx5Qjs7Ozs7Ozs7Ozs7QUNObkM7O0FBQU8sS0FBdUI7QUFDZCxtQkFBVztBQUNYLG1CQUFVO0FBQ1YsbUJBQVU7QUFDVixtQkFBbUI7QUFDcEIsa0JBQW1DO0FBQzlCLHVCQUFpQztBQUNwQyxvQkFBd0M7QUFDeEMsb0JBQW9CO0FBQ25CLHFCQUFXO0FBQ1osb0JBQWdDO0FBQ2pDLG1CQUFpQjtBQUNoQixvQkFBMEI7QUFDekIscUJBQStDO0FBQy9DLHFCQUErQztBQUNoRCxvQkFBZ0Y7QUFDbkYsaUJBQWdEO0FBQ2hELGlCQUFnRDtBQUM5QyxtQkFBNEM7QUFDM0Msb0JBQXdDO0FBQ25DLHlCQUNwQjtBQXJCK0I7QUF1QmYsbUNBQVEsUUFBTSxRQUF1QixvQjs7Ozs7Ozs7Ozs7QUN0QnZEOztBQUFPLEtBQXNCO0FBQ2IsbUJBQVU7QUFDVixtQkFBWTtBQUNaLG1CQUFhO0FBQ1osb0JBQVU7QUFDWCxtQkFBc0I7QUFDdkIsa0JBQTREO0FBQ3ZELHVCQUE0QztBQUMvQyxvQkFBc0M7QUFDckMscUJBQVc7QUFDWixvQkFBcUM7QUFDdEMsbUJBQW9DO0FBQ25DLG9CQUErQztBQUM5QyxxQkFBaUQ7QUFDakQscUJBQXVEO0FBQ3hELG9CQUFxRjtBQUN4RixpQkFBd0Q7QUFDeEQsaUJBQXdEO0FBQ3RELG1CQUFnRDtBQUMvQyxvQkFBNEQ7QUFDdkQseUJBQ3BCO0FBckI4QjtBQXVCZCxtQ0FBUSxRQUFNLFFBQXNCLG1COzs7Ozs7Ozs7OztBQ3hCdEQ7O0FBQU8sS0FBd0I7QUFDZixtQkFBYTtBQUNiLG1CQUFZO0FBQ1osbUJBQVU7QUFDVCxvQkFBaUI7QUFDbEIsbUJBQWdCO0FBQ2pCLGtCQUF5RTtBQUNwRSx1QkFBa0M7QUFDckMsb0JBQW9DO0FBQ25DLHFCQUFjO0FBQ2Ysb0JBQStCO0FBQ2hDLG1CQUFnQztBQUMvQixvQkFBNEM7QUFDM0MscUJBQWtEO0FBQ2xELHFCQUFpRDtBQUNsRCxvQkFBeUY7QUFDNUYsaUJBQXFEO0FBQ3JELGlCQUFzRDtBQUNwRCxtQkFBa0M7QUFDNUIseUJBQ3BCO0FBcEJnQztBQXNCaEIsbUNBQVEsUUFBTSxRQUF3QixxQjs7Ozs7Ozs7Ozs7QUNyQnhEOztBQUFPLEtBQXVCO0FBQ2QsbUJBQXVCO0FBQ3ZCLG1CQUFXO0FBQ1gsbUJBQVk7QUFDWCxvQkFBeUI7QUFDMUIsbUJBQW9CO0FBQ3JCLGtCQUFzRTtBQUNqRSx1QkFBZ0Q7QUFDbkQsb0JBQWtEO0FBQ2pELHFCQUFpQjtBQUNsQixvQkFBMEQ7QUFDM0QsbUJBQTZDO0FBQzVDLG9CQUF5QztBQUN4QyxxQkFBeUQ7QUFDekQscUJBQXdEO0FBQ3pELG9CQUE4SDtBQUNqSSxpQkFBbUY7QUFDbkYsaUJBQW1GO0FBQ2pGLG1CQUEyQztBQUMxQyxvQkFBc0Q7QUFDakQseUJBQ3BCO0FBckIrQjtBQXNCZixtQ0FBUSxRQUFNLFFBQXVCLG9COzs7Ozs7Ozs7OztBQ3ZCdkQ7O0FBQU8sS0FBdUI7QUFDZCxtQkFBVTtBQUNWLG1CQUFVO0FBQ1YsbUJBQVU7QUFDVixtQkFBcUI7QUFDdEIsa0JBQWtDO0FBQzdCLHVCQUFrRDtBQUNyRCxvQkFBNkM7QUFDN0Msb0JBQWlDO0FBQ2hDLHFCQUFhO0FBQ2Qsb0JBQXNDO0FBQ3ZDLG1CQUFtQztBQUNsQyxvQkFBMkM7QUFDMUMscUJBQThDO0FBQzlDLHFCQUFrRDtBQUNuRCxvQkFBK0U7QUFDbEYsaUJBQStDO0FBQy9DLGlCQUEyQztBQUN6QyxtQkFBbUQ7QUFDbEQsb0JBQTJDO0FBQ3RDLHlCQUNwQjtBQXJCK0I7QUF1QmYsbUNBQVEsUUFBTSxRQUF1QixvQjs7Ozs7Ozs7Ozs7QUN0QnZEOztBQUFPLEtBQXNCO0FBQ2IsbUJBQWU7QUFDZixtQkFBVztBQUNYLG1CQUFjO0FBQ2Isb0JBQWdDO0FBQ2pDLG1CQUFzQjtBQUN2QixrQkFBNkU7QUFDeEUsdUJBQThEO0FBQ2pFLG9CQUFxRDtBQUNwRCxxQkFBZTtBQUNoQixvQkFBb0M7QUFDM0IsNkJBQTBEO0FBQ3BFLG1CQUFzQztBQUNyQyxvQkFBaUQ7QUFDOUMsdUJBQWlEO0FBQ25ELHFCQUFpRDtBQUNqRCxxQkFBc0Q7QUFDdkQsb0JBQTBGO0FBQzdGLGlCQUF1RDtBQUN2RCxpQkFBdUQ7QUFDckQsbUJBQWlEO0FBQzlDLHNCQUF3QztBQUNyQyx5QkFBaUY7QUFDdEYsb0JBQThDO0FBQ3pDLHlCQUFzRDtBQUMzRCxvQkFBd0Y7QUFDL0YsYUFBb0I7QUFDakIsZ0JBQ1g7QUE1QjhCO0FBNkJkLG1DQUFRLFFBQU0sUUFBc0IsbUI7Ozs7Ozs7Ozs7O0FDOUJ0RDs7QUFBTyxLQUF1QjtBQUNkLG1CQUFVO0FBQ1YsbUJBQVM7QUFDVCxtQkFBVTtBQUNWLG1CQUFvQjtBQUNyQixrQkFBNEI7QUFDdkIsdUJBQXNDO0FBQ3pDLG9CQUErQjtBQUMvQixvQkFBcUI7QUFDcEIscUJBQWM7QUFDZixvQkFBc0M7QUFDdkMsbUJBQXlDO0FBQ3hDLG9CQUF5QztBQUN4QyxxQkFBMEM7QUFDMUMscUJBQTZDO0FBQzlDLG9CQUFpRjtBQUNwRixpQkFBcUQ7QUFDckQsaUJBQXNEO0FBQ3BELG1CQUF3QztBQUN2QyxvQkFBdUQ7QUFDbEQseUJBQ3BCO0FBckIrQjtBQXVCZixtQ0FBUSxRQUFNLFFBQXVCLG9COzs7Ozs7Ozs7OztBQ3ZCdkQ7O0FBQU8sS0FBd0I7QUFDZixtQkFBUztBQUNULG1CQUFTO0FBQ1QsbUJBQVU7QUFDVixtQkFBdUI7QUFDeEIsa0JBQTBCO0FBQ3JCLHVCQUF3QztBQUMzQyxvQkFBeUI7QUFDekIsb0JBQWdDO0FBQy9CLHFCQUFjO0FBQ2Ysb0JBQW1DO0FBQ3BDLG1CQUE2QjtBQUM1QixvQkFBNkM7QUFDNUMscUJBQStDO0FBQy9DLHFCQUFnRDtBQUNqRCxvQkFBOEU7QUFDakYsaUJBQWdEO0FBQ2hELGlCQUFnRDtBQUM5QyxtQkFBK0Q7QUFDekQseUJBQ3BCO0FBcEJnQztBQXNCaEIsbUNBQVEsUUFBTSxRQUF3QixxQjs7Ozs7Ozs7Ozs7QUN0QnhEOztBQUFPLEtBQXdCO0FBQ1gsbUJBQVE7QUFDUixtQkFBUztBQUNULG1CQUFrQjtBQUNqQixvQkFBdUI7QUFDeEIsbUJBQW1CO0FBQ3BCLGtCQUF5RDtBQUNwRCx1QkFBbUQ7QUFDdEQsb0JBQWtDO0FBQ2pDLHFCQUFlO0FBQ2hCLG9CQUErQjtBQUNoQyxtQkFBbUM7QUFDbEMsb0JBQTZCO0FBQzFCLHVCQUFxQztBQUN2QyxxQkFBc0M7QUFDdEMscUJBQXdDO0FBQ3pDLG9CQUF5RTtBQUM1RSxpQkFBdUQ7QUFDdkQsaUJBQXlEO0FBQ3ZELG1CQUE2QztBQUMxQyxzQkFBcUM7QUFDbEMseUJBQWlFO0FBQ3RFLG9CQUFzQztBQUNqQyx5QkFBbUM7QUFDeEMsb0JBQXlFO0FBQ2hGLGFBQWM7QUFDWCxnQkFDZjtBQTNCZ0M7QUE2QmhCLG1DQUFRLFFBQU0sUUFBd0IscUIiLCJmaWxlIjoic3VydmV5LmtvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwia25vY2tvdXRcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJTdXJ2ZXlcIiwgW1wia25vY2tvdXRcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiU3VydmV5XCJdID0gZmFjdG9yeShyZXF1aXJlKFwia25vY2tvdXRcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlN1cnZleVwiXSA9IGZhY3Rvcnkocm9vdFtcImtvXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMzhfXykge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNWY5OGM4ODEzNTY0NjI2NjBhNGNcbiAqKi8iLCIvLyBtb2RlbFxyXG5leHBvcnQgKiBmcm9tIFwiLi9jaHVua3MvbW9kZWxcIjtcclxuXHJcbi8vIGxvY2FsaXphdGlvblxyXG5pbXBvcnQgJy4vY2h1bmtzL2xvY2FsaXphdGlvbic7XHJcblxyXG4vLyBjc3Mgc3RhbmRhcmRcclxuZXhwb3J0IHtkZWZhdWx0U3RhbmRhcmRDc3N9IGZyb20gXCIuLi9kZWZhdWx0Q3NzL2Nzc3N0YW5kYXJkXCI7XHJcbi8vIGNzcyBib290c3RyYXBcclxuZXhwb3J0IHtkZWZhdWx0Qm9vdHN0cmFwQ3NzfSBmcm9tIFwiLi4vZGVmYXVsdENzcy9jc3Nib290c3RyYXBcIjtcclxuXHJcbi8vIGtub2Nrb3V0XHJcbmV4cG9ydCB7U3VydmV5fSBmcm9tIFwiLi4va25vY2tvdXQva29zdXJ2ZXlcIjsgLy8gVE9ETyBuZWVkIHRvIHJlbW92ZSBzb21lZGF5XHJcbmV4cG9ydCB7U3VydmV5IGFzIE1vZGVsfSBmcm9tIFwiLi4va25vY2tvdXQva29zdXJ2ZXlcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJvdywgUGFnZX0gZnJvbSBcIi4uL2tub2Nrb3V0L2tvcGFnZVwiO1xyXG5leHBvcnQge1F1ZXN0aW9uSW1wbGVtZW50b3JCYXNlfSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbmJhc2VcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yfSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvblwiO1xyXG5leHBvcnQge1F1ZXN0aW9uU2VsZWN0QmFzZUltcGxlbWVudG9yfSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvcn0gZnJvbSBcIi4uL2tub2Nrb3V0L2tvcXVlc3Rpb25fYmFzZXNlbGVjdFwiO1xyXG5leHBvcnQge1F1ZXN0aW9uQ2hlY2tib3h9IGZyb20gXCIuLi9rbm9ja291dC9rb3F1ZXN0aW9uX2NoZWNrYm94XCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25Db21tZW50fSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl9jb21tZW50XCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25Ecm9wZG93bn0gZnJvbSBcIi4uL2tub2Nrb3V0L2tvcXVlc3Rpb25fZHJvcGRvd25cIjtcclxuZXhwb3J0IHtRdWVzdGlvbkZpbGV9IGZyb20gXCIuLi9rbm9ja291dC9rb3F1ZXN0aW9uX2ZpbGVcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkh0bWx9IGZyb20gXCIuLi9rbm9ja291dC9rb3F1ZXN0aW9uX2h0bWxcIjtcclxuZXhwb3J0IHtNYXRyaXhSb3csIFF1ZXN0aW9uTWF0cml4fSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXhcIjtcclxuZXhwb3J0IHtRdWVzdGlvbk1hdHJpeERyb3Bkb3dufSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXhkcm9wZG93blwiO1xyXG5leHBvcnQge1xyXG4gICAgUXVlc3Rpb25NYXRyaXhEeW5hbWljSW1wbGVtZW50b3IsXHJcbiAgICBRdWVzdGlvbk1hdHJpeER5bmFtaWNcclxufSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcbmV4cG9ydCB7XHJcbiAgICBNdWx0aXBsZVRleHRJdGVtLCBRdWVzdGlvbk11bHRpcGxlVGV4dEltcGxlbWVudG9yLFxyXG4gICAgUXVlc3Rpb25NdWx0aXBsZVRleHRcclxufSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl9tdWx0aXBsZXRleHRcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJhZGlvZ3JvdXB9IGZyb20gXCIuLi9rbm9ja291dC9rb3F1ZXN0aW9uX3JhZGlvZ3JvdXBcIjtcclxuZXhwb3J0IHtRdWVzdGlvblJhdGluZ30gZnJvbSBcIi4uL2tub2Nrb3V0L2tvcXVlc3Rpb25fcmF0aW5nXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25UZXh0fSBmcm9tIFwiLi4va25vY2tvdXQva29xdWVzdGlvbl90ZXh0XCI7XHJcbmV4cG9ydCB7U3VydmV5V2luZG93fSBmcm9tIFwiLi4va25vY2tvdXQva29TdXJ2ZXlXaW5kb3dcIjtcclxuZXhwb3J0IHtTdXJ2ZXlUZW1wbGF0ZVRleHR9IGZyb20gXCIuLi9rbm9ja291dC90ZW1wbGF0ZVRleHRcIjtcclxuXHJcbmV4cG9ydCB7X19leHRlbmRzfSBmcm9tIFwiLi4vZXh0ZW5kc1wiO1xyXG5cclxuLy9VbmNvbW1lbnQgdG8gaW5jbHVkZSB0aGUgXCJkYXRlXCIgcXVlc3Rpb24gdHlwZS5cclxuLy9leHBvcnQge1F1ZXN0aW9uRGF0ZX0gZnJvbSBcIi4uL3BsdWdpbnMva25vY2tvdXQva29xdWVzdGlvbl9kYXRlXCI7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZW50cmllcy9rby50c1xuICoqLyIsImV4cG9ydCB7XHJcbiAgICBBbnN3ZXJDb3VudFZhbGlkYXRvciwgRW1haWxWYWxpZGF0b3IsIE51bWVyaWNWYWxpZGF0b3IsIFJlZ2V4VmFsaWRhdG9yLFxyXG4gICAgU3VydmV5VmFsaWRhdG9yLCBUZXh0VmFsaWRhdG9yLCBWYWxpZGF0b3JSZXN1bHQsIFZhbGlkYXRvclJ1bm5lclxyXG59IGZyb20gXCIuLi8uLi92YWxpZGF0b3JcIjtcclxuZXhwb3J0IHtCYXNlLCBFdmVudCwgSXRlbVZhbHVlLCBTdXJ2ZXlFcnJvciwgSVN1cnZleX0gZnJvbSBcIi4uLy4uL2Jhc2VcIjtcclxuZXhwb3J0IHtDaG9pY2VzUmVzdGZ1bGx9IGZyb20gXCIuLi8uLi9jaG9pY2VzUmVzdGZ1bGxcIjtcclxuZXhwb3J0IHtDb25kaXRpb24sIENvbmRpdGlvbk5vZGUsIENvbmRpdGlvblJ1bm5lcn0gZnJvbSBcIi4uLy4uL2NvbmRpdGlvbnNcIjtcclxuZXhwb3J0IHtDb25kaXRpb25zUGFyc2VyfSBmcm9tIFwiLi4vLi4vY29uZGl0aW9uc1BhcnNlclwiO1xyXG5leHBvcnQge1Byb2Nlc3NWYWx1ZX0gZnJvbSBcIi4uLy4uL2NvbmRpdGlvblByb2Nlc3NWYWx1ZVwiO1xyXG5leHBvcnQge0N1c3RvbUVycm9yLCBFeGNlZWRTaXplRXJyb3IsIFJlcXVyZU51bWVyaWNFcnJvcn0gZnJvbSBcIi4uLy4uL2Vycm9yXCI7XHJcbmV4cG9ydCB7XHJcbiAgICBKc29uRXJyb3IsIEpzb25JbmNvcnJlY3RUeXBlRXJyb3IsIEpzb25NZXRhZGF0YSwgSnNvbk1ldGFkYXRhQ2xhc3MsXHJcbiAgICBKc29uTWlzc2luZ1R5cGVFcnJvciwgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlLCBKc29uT2JqZWN0LCBKc29uT2JqZWN0UHJvcGVydHksXHJcbiAgICBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yLCBKc29uVW5rbm93blByb3BlcnR5RXJyb3JcclxufSBmcm9tIFwiLi4vLi4vanNvbm9iamVjdFwiO1xyXG5leHBvcnQge1xyXG4gICAgTWF0cml4RHJvcGRvd25DZWxsLCBNYXRyaXhEcm9wZG93bkNvbHVtbiwgTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsXHJcbiAgICBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlXHJcbn0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5leHBvcnQge01hdHJpeERyb3Bkb3duUm93TW9kZWwsIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duXCI7XHJcbmV4cG9ydCB7TWF0cml4RHluYW1pY1Jvd01vZGVsLCBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX21hdHJpeGR5bmFtaWNcIjtcclxuZXhwb3J0IHtNYXRyaXhSb3dNb2RlbCwgUXVlc3Rpb25NYXRyaXhNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX21hdHJpeFwiO1xyXG5leHBvcnQge011bHRpcGxlVGV4dEl0ZW1Nb2RlbCwgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX211bHRpcGxldGV4dFwiO1xyXG5leHBvcnQge1BhZ2VNb2RlbCwgUXVlc3Rpb25Sb3dNb2RlbH0gZnJvbSBcIi4uLy4uL3BhZ2VcIjtcclxuZXhwb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25iYXNlXCI7XHJcbmV4cG9ydCB7UXVlc3Rpb25DaGVja2JveEJhc2UsIFF1ZXN0aW9uU2VsZWN0QmFzZX0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuZXhwb3J0IHtRdWVzdGlvbkNoZWNrYm94TW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9jaGVja2JveFwiO1xyXG5leHBvcnQge1F1ZXN0aW9uQ29tbWVudE1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fY29tbWVudFwiO1xyXG5leHBvcnQgeyBRdWVzdGlvbkRyb3Bkb3duTW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9kcm9wZG93blwiO1xyXG5leHBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5leHBvcnQge1F1ZXN0aW9uRmlsZU1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fZmlsZVwiO1xyXG5leHBvcnQge1F1ZXN0aW9uSHRtbE1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25faHRtbFwiO1xyXG5leHBvcnQge1F1ZXN0aW9uUmFkaW9ncm91cE1vZGVsfSBmcm9tIFwiLi4vLi4vcXVlc3Rpb25fcmFkaW9ncm91cFwiO1xyXG5leHBvcnQge1F1ZXN0aW9uUmF0aW5nTW9kZWx9IGZyb20gXCIuLi8uLi9xdWVzdGlvbl9yYXRpbmdcIjtcclxuZXhwb3J0IHtRdWVzdGlvblRleHRNb2RlbH0gZnJvbSBcIi4uLy4uL3F1ZXN0aW9uX3RleHRcIjtcclxuZXhwb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uLy4uL3N1cnZleVwiO1xyXG5leHBvcnQge1xyXG4gICAgU3VydmV5VHJpZ2dlciwgU3VydmV5VHJpZ2dlckNvbXBsZXRlLCBTdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUsIFN1cnZleVRyaWdnZXJWaXNpYmxlLFxyXG4gICAgVHJpZ2dlclxyXG59IGZyb20gXCIuLi8uLi90cmlnZ2VyXCI7XHJcbmV4cG9ydCB7U3VydmV5V2luZG93TW9kZWx9IGZyb20gXCIuLi8uLi9zdXJ2ZXlXaW5kb3dcIjtcclxuZXhwb3J0IHtUZXh0UHJlUHJvY2Vzc29yfSBmcm9tIFwiLi4vLi4vdGV4dFByZVByb2Nlc3NvclwiO1xyXG5cclxuZXhwb3J0IHtkeFN1cnZleVNlcnZpY2V9IGZyb20gXCIuLi8uLi9keFN1cnZleVNlcnZpY2VcIjtcclxuZXhwb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb24sIHN1cnZleVN0cmluZ3N9IGZyb20gXCIuLi8uLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG4vL1VuY29tbWVudCB0byBpbmNsdWRlIHRoZSBcImRhdGVcIiBxdWVzdGlvbiB0eXBlLlxyXG4vL2V4cG9ydCB7ZGVmYXVsdCBhcyBRdWVzdGlvbkRhdGVNb2RlbH0gZnJvbSBcIi4uLy4uL3BsdWdpbnMvcXVlc3Rpb25fZGF0ZVwiO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJpZXMvY2h1bmtzL21vZGVsLnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge0N1c3RvbUVycm9yLCBSZXF1cmVOdW1lcmljRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSAnLi9qc29ub2JqZWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBhbnksIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsKSB7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlWYWxpZGF0b3IgZXh0ZW5kcyBCYXNlIHtcclxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRFcnJvclRleHQobmFtZTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMudGV4dCkgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0RXJyb3JUZXh0KG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+O1xyXG4gICAgdmFsdWU6IGFueTtcclxuICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZztcclxufVxyXG5leHBvcnQgY2xhc3MgVmFsaWRhdG9yUnVubmVyIHtcclxuICAgIHB1YmxpYyBydW4ob3duZXI6IElWYWxpZGF0b3JPd25lcik6IFN1cnZleUVycm9yIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG93bmVyLnZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkYXRvclJlc3VsdCA9IG93bmVyLnZhbGlkYXRvcnNbaV0udmFsaWRhdGUob3duZXIudmFsdWUsIG93bmVyLmdldFZhbGlkYXRvclRpdGxlKCkpO1xyXG4gICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQuZXJyb3IpIHJldHVybiB2YWxpZGF0b3JSZXN1bHQuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXIudmFsdWUgPSB2YWxpZGF0b3JSZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOdW1lcmljVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5WYWx1ZTogbnVtYmVyID0gbnVsbCwgcHVibGljIG1heFZhbHVlOiBudW1iZXIgPSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIm51bWVyaWN2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICghdmFsdWUgfHwgIXRoaXMuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBSZXF1cmVOdW1lcmljRXJyb3IoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgVmFsaWRhdG9yUmVzdWx0KHBhcnNlRmxvYXQodmFsdWUpKTtcclxuICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSAmJiB0aGlzLm1pblZhbHVlID4gcmVzdWx0LnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1heFZhbHVlICYmIHRoaXMubWF4VmFsdWUgPCByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdk5hbWUgPSBuYW1lID8gbmFtZSA6IFwidmFsdWVcIjtcclxuICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSAmJiB0aGlzLm1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01pbk1heFwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5taW5WYWx1ZSwgdGhpcy5tYXhWYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY01pblwiKVtcImZvcm1hdFwiXSh2TmFtZSwgdGhpcy5taW5WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWF4XCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1heFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTnVtYmVyKHZhbHVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkgJiYgaXNGaW5pdGUodmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluTGVuZ3RoOiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRleHR2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICh0aGlzLm1pbkxlbmd0aCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA8IHRoaXMubWluTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwidGV4dE1pbkxlbmd0aFwiKVtcImZvcm1hdFwiXSh0aGlzLm1pbkxlbmd0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBbnN3ZXJDb3VudFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluQ291bnQ6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhDb3VudDogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiOyB9XHJcbiAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUuY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBjb3VudCA9IHZhbHVlLmxlbmd0aDtcclxuICAgICAgICBpZiAodGhpcy5taW5Db3VudCAmJiBjb3VudCA8IHRoaXMubWluQ291bnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5TZWxlY3RFcnJvclwiKVtcImZvcm1hdFwiXSh0aGlzLm1pbkNvdW50KSkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMubWF4Q291bnQgJiYgY291bnQgPiB0aGlzLm1heENvdW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWF4U2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5tYXhDb3VudCkpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZWdleFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVnZXg6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicmVnZXh2YWxpZGF0b3JcIjsgfVxyXG4gICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGlmICghdGhpcy5yZWdleCB8fCAhdmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAodGhpcy5yZWdleCk7XHJcbiAgICAgICAgaWYgKHJlLnRlc3QodmFsdWUpKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdCh2YWx1ZSwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgIHByaXZhdGUgcmUgPSAvXigoW148PigpXFxbXFxdXFwuLDs6XFxzQFxcXCJdKyhcXC5bXjw+KClcXFtcXF1cXC4sOzpcXHNAXFxcIl0rKSopfChcXFwiLitcXFwiKSlAKChbXjw+KClbXFxdXFwuLDs6XFxzQFxcXCJdK1xcLikrW148PigpW1xcXVxcLiw7Olxcc0BcXFwiXXsyLH0pJC9pO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImVtYWlsdmFsaWRhdG9yXCI7IH1cclxuICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5yZS50ZXN0KHZhbHVlKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQodmFsdWUsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJpbnZhbGlkRW1haWxcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgW1widGV4dFwiXSk7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJudW1lcmljdmFsaWRhdG9yXCIsIFtcIm1pblZhbHVlOm51bWJlclwiLCBcIm1heFZhbHVlOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE51bWVyaWNWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0dmFsaWRhdG9yXCIsIFtcIm1pbkxlbmd0aDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBUZXh0VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIiwgW1wibWluQ291bnQ6bnVtYmVyXCIsIFwibWF4Q291bnQ6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQW5zd2VyQ291bnRWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyZWdleHZhbGlkYXRvclwiLCBbXCJyZWdleFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFJlZ2V4VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZW1haWx2YWxpZGF0b3JcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBFbWFpbFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy92YWxpZGF0b3IudHNcbiAqKi8iLCJleHBvcnQgZnVuY3Rpb24gX19leHRlbmRzIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF9fZXh0ZW5kcztcclxufVxyXG5cclxuZXhwb3J0cy5fX2V4dGVuZHMgPSBfX2V4dGVuZHM7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZXh0ZW5kcy50c1xuICoqLyIsImV4cG9ydCBpbnRlcmZhY2UgSGFzaFRhYmxlPFQ+IHtcclxuICAgIFtrZXk6IHN0cmluZ106IFQ7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJU3VydmV5RGF0YSB7XHJcbiAgICBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbiAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZyk7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJU3VydmV5IGV4dGVuZHMgSVN1cnZleURhdGEge1xyXG4gICAgY3VycmVudFBhZ2U6IElQYWdlO1xyXG4gICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKTtcclxuICAgIHF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IElRdWVzdGlvbiwgaW5kZXg6IG51bWJlcik7XHJcbiAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbik7XHJcbiAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yO1xyXG4gICAgcHJvY2Vzc0h0bWwoaHRtbDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgcHJvY2Vzc1RleHQodGV4dDogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgaXNEZXNpZ25Nb2RlOiBib29sZWFuO1xyXG4gICAgcmVxdWlyZWRUZXh0OiBzdHJpbmc7XHJcbiAgICBxdWVzdGlvblN0YXJ0SW5kZXg6IHN0cmluZztcclxuICAgIHF1ZXN0aW9uVGl0bGVUZW1wbGF0ZTogc3RyaW5nO1xyXG4gICAgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW47XHJcbiAgICB1cGxvYWRGaWxlKG5hbWU6IHN0cmluZywgZmlsZTogRmlsZSwgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKSA9PiBhbnkpOiBib29sZWFuO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pik7XHJcbn1cclxuZXhwb3J0IGludGVyZmFjZSBJUXVlc3Rpb24gZXh0ZW5kcyBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICBoYXNUaXRsZTogYm9vbGVhbjtcclxuICAgIHNldFZpc2libGVJbmRleCh2YWx1ZTogbnVtYmVyKTtcclxuICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgb25TdXJ2ZXlMb2FkKCk7XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpOiBib29sZWFuO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhZ2UgZXh0ZW5kcyBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgIHZpc2libGU6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJdGVtVmFsdWUge1xyXG4gICAgcHVibGljIHN0YXRpYyBTZXBhcmF0b3IgPSAnfCc7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNldERhdGEoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4sIHZhbHVlczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIGl0ZW1zLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzW2ldO1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBJdGVtVmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLnZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHZhciBleGNlcHRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUuZ2V0VHlwZSkgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlLmdldFR5cGUoKSA9PSAnaXRlbXZhbHVlJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLml0ZW1WYWx1ZSA9IHZhbHVlLml0ZW1WYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLml0ZW1UZXh0ID0gdmFsdWUuaXRlbVRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgZXhjZXB0aW9uID0gSXRlbVZhbHVlLml0ZW1WYWx1ZVByb3A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBJdGVtVmFsdWUuY29weUF0dHJpYnV0ZXModmFsdWUsIGl0ZW0sIGV4Y2VwdGlvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldERhdGEoaXRlbXM6IEFycmF5PEl0ZW1WYWx1ZT4pOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmhhc1RleHQpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgdmFsdWU6IGl0ZW0udmFsdWUsIHRleHQ6IGl0ZW0udGV4dCB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEl0ZW1CeVZhbHVlKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWw6IGFueSk6IEl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkgKyspIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLnZhbHVlID09IHZhbCkgcmV0dXJuIGl0ZW1zW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc3RhdGljIGl0ZW1WYWx1ZVByb3AgPSBbIFwidGV4dFwiLCBcInZhbHVlXCIsIFwiaGFzVGV4dFwiXTtcclxuICAgIHByaXZhdGUgc3RhdGljIGNvcHlBdHRyaWJ1dGVzKHNyYzogYW55LCBkZXN0OiBhbnksIGV4Y2VwdG9uczogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzcmMpIHtcclxuICAgICAgICAgICAgaWYgKCh0eXBlb2Ygc3JjW2tleV0gPT0gJ2Z1bmN0aW9uJykpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoZXhjZXB0b25zICYmIGV4Y2VwdG9ucy5pbmRleE9mKGtleSkgPiAtMSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGRlc3Rba2V5XSA9IHNyY1trZXldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgaXRlbVZhbHVlOiBhbnk7XHJcbiAgICBwcml2YXRlIGl0ZW1UZXh0OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogYW55LCB0ZXh0OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJpdGVtdmFsdWVcIjsgfVxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5pdGVtVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXRlbVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLml0ZW1WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzdHI6IHN0cmluZyA9IHRoaXMuaXRlbVZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gc3RyLmluZGV4T2YoSXRlbVZhbHVlLlNlcGFyYXRvcik7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBzdHIuc2xpY2UoMCwgaW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBzdHIuc2xpY2UoaW5kZXggKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RleHQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLml0ZW1UZXh0ID8gdHJ1ZSA6IGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNUZXh0KSByZXR1cm4gdGhpcy5pdGVtVGV4dDtcclxuICAgICAgICBpZiAodGhpcy52YWx1ZSkgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgdGV4dChuZXdUZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLml0ZW1UZXh0ID0gbmV3VGV4dDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2Uge1xyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN1cnZleUVycm9yIHtcclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIG1ldGhvZCBpcyBhYnN0cmFjdCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgU3VydmV5UGFnZUlkID0gXCJzcV9wYWdlXCI7XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlFbGVtZW50IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgU2Nyb2xsRWxlbWVudFRvVG9wKGVsZW1lbnRJZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50SWQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpO1xyXG4gICAgICAgIGlmICghZWwgfHwgIWVsLnNjcm9sbEludG9WaWV3KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGVsZW1Ub3AgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgaWYgKGVsZW1Ub3AgPCAwKSAgZWwuc2Nyb2xsSW50b1ZpZXcoKTtcclxuICAgICAgICByZXR1cm4gZWxlbVRvcCA8IDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIEZvY3VzRWxlbWVudChlbGVtZW50SWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghZWxlbWVudElkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgICAgICBpZiAoZWwpIHtcclxuICAgICAgICAgICAgZWwuZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50PFQgZXh0ZW5kcyBGdW5jdGlvbiwgT3B0aW9ucz4gIHtcclxuICAgIHByaXZhdGUgY2FsbGJhY2tzOiBBcnJheTxUPjtcclxuICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuY2FsbGJhY2tzID09IG51bGwgfHwgdGhpcy5jYWxsYmFja3MubGVuZ3RoID09IDA7IH1cclxuICAgIHB1YmxpYyBmaXJlKHNlbmRlcjogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICB2YXIgY2FsbFJlc3VsdCA9IHRoaXMuY2FsbGJhY2tzW2ldKHNlbmRlciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGQoZnVuYzogVCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzID0gbmV3IEFycmF5PFQ+KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goZnVuYyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlKGZ1bmM6IFQpIHtcclxuICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2FsbGJhY2tzLmluZGV4T2YoZnVuYywgMCk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Jhc2UudHNcbiAqKi8iLCJpbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSAnLi9zdXJ2ZXlTdHJpbmdzJztcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFuc3dlclJlcXVpcmVkRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpICB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBSZXF1cmVOdW1lcmljRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNFcnJvclwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRXhjZWVkU2l6ZUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgcHJpdmF0ZSBtYXhTaXplOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihtYXhTaXplOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWF4U2l6ZSA9IG1heFNpemU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiZXhjZWVkTWF4U2l6ZVwiKVtcImZvcm1hdFwiXSh0aGlzLmdldFRleHRTaXplKCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRUZXh0U2l6ZSgpIHtcclxuICAgICAgICB2YXIgc2l6ZXMgPSBbJ0J5dGVzJywgJ0tCJywgJ01CJywgJ0dCJywgJ1RCJ107XHJcbiAgICAgICAgdmFyIGZpeGVkID0gWzAsIDAsIDIsIDMsIDNdO1xyXG4gICAgICAgIGlmICh0aGlzLm1heFNpemUgPT0gMCkgcmV0dXJuICcwIEJ5dGUnO1xyXG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyh0aGlzLm1heFNpemUpIC8gTWF0aC5sb2coMTAyNCkpO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMubWF4U2l6ZSAvIE1hdGgucG93KDEwMjQsIGkpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKGZpeGVkW2ldKSArICcgJyArIHNpemVzW2ldO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Vycm9yLnRzXG4gKiovIiwiZXhwb3J0IHZhciBzdXJ2ZXlMb2NhbGl6YXRpb24gPSB7XHJcbiAgICBjdXJyZW50TG9jYWxlOiBcIlwiLFxyXG4gICAgbG9jYWxlczoge30sXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgbG9jID0gdGhpcy5jdXJyZW50TG9jYWxlID8gdGhpcy5sb2NhbGVzW3RoaXMuY3VycmVudExvY2FsZV0gOiBzdXJ2ZXlTdHJpbmdzO1xyXG4gICAgICAgIGlmICghbG9jIHx8ICFsb2Nbc3RyTmFtZV0pIGxvYyA9IHN1cnZleVN0cmluZ3M7XHJcbiAgICAgICAgcmV0dXJuIGxvY1tzdHJOYW1lXTtcclxuICAgIH0sXHJcbiAgICBnZXRMb2NhbGVzOiBmdW5jdGlvbiAoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIHJlcy5wdXNoKFwiXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxvY2FsZXMpIHtcclxuICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVzLnNvcnQoKTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG59O1xyXG5leHBvcnQgdmFyIHN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwiUHJldmlvdXNcIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJOZXh0XCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiQ29tcGxldGVcIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwiT3RoZXIgKGRlc2NyaWJlKVwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2UgezB9IG9mIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiVGhlcmUgaXMgbm8gdmlzaWJsZSBwYWdlIG9yIHF1ZXN0aW9uIGluIHRoZSBzdXJ2ZXkuXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIlRoYW5rIHlvdSBmb3IgY29tcGxldGluZyB0aGUgc3VydmV5IVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJTdXJ2ZXkgaXMgbG9hZGluZy4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiQ2hvb3NlLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIlBsZWFzZSBhbnN3ZXIgdGhlIHF1ZXN0aW9uLlwiLFxyXG4gICAgcmVxdWlyZWRJbkFsbFJvd3NFcnJvcjogXCJQbGVhc2UgYW5zd2VyIHF1ZXN0aW9ucyBpbiBhbGwgcm93cy5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJUaGUgdmFsdWUgc2hvdWxkIGJlIG51bWVyaWMuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIlBsZWFzZSBlbnRlciBhdCBsZWFzdCB7MH0gc3ltYm9scy5cIixcclxuICAgIG1pblJvd0NvdW50RXJyb3I6IFwiUGxlYXNlIGZpbGwgaW4gYXQgbGVhc3QgezB9IHJvd3MuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJQbGVhc2Ugc2VsZWN0IGF0IGxlYXN0IHswfSB2YXJpYW50cy5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIlBsZWFzZSBzZWxlY3Qgbm8gbW9yZSB0aGFuIHswfSB2YXJpYW50cy5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9IGFuZCBlcXVhbCBvciBsZXNzIHRoYW4gezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIGxlc3MgdGhhbiB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlLW1haWwgYWRkcmVzcy5cIixcclxuICAgIHVybFJlcXVlc3RFcnJvcjogXCJUaGUgcmVxdWVzdCByZXR1cm5lZCBlcnJvciAnezB9Jy4gezF9XCIsXHJcbiAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwiVGhlIHJlcXVlc3QgcmV0dXJuZWQgZW1wdHkgZGF0YSBvciB0aGUgJ3BhdGgnIHByb3BlcnR5IGlzIGluY29ycmVjdFwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJUaGUgZmlsZSBzaXplIHNob3VsZCBub3QgZXhjZWVkIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgZW50ZXIgdGhlIG90aGVyIHZhbHVlLlwiLFxyXG4gICAgdXBsb2FkaW5nRmlsZTogXCJZb3VyIGZpbGUgaXMgdXBsb2FkaW5nLiBQbGVhc2Ugd2FpdCBzZXZlcmFsIHNlY29uZHMgYW5kIHRyeSBhZ2Fpbi5cIixcclxuICAgIGFkZFJvdzogXCJBZGQgcm93XCIsXHJcbiAgICByZW1vdmVSb3c6IFwiUmVtb3ZlXCJcclxufTtcclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJlblwiXSA9IHN1cnZleVN0cmluZ3M7XHJcblxyXG5pZiAoIVN0cmluZy5wcm90b3R5cGVbXCJmb3JtYXRcIl0pIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGVbXCJmb3JtYXRcIl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhcXGQrKX0vZywgZnVuY3Rpb24gKG1hdGNoLCBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhcmdzW251bWJlcl0gIT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXHJcbiAgICAgICAgICAgICAgICA6IG1hdGNoXHJcbiAgICAgICAgICAgICAgICA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc3VydmV5U3RyaW5ncy50c1xuICoqLyIsImltcG9ydCB7SGFzaFRhYmxlfSBmcm9tICcuL2Jhc2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICBwcml2YXRlIHR5cGVWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2hvaWNlc2Z1bmM6ICgpID0+IEFycmF5PGFueT4gPSBudWxsO1xyXG4gICAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsO1xyXG4gICAgcHVibGljIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbDtcclxuICAgIHB1YmxpYyBvblNldFZhbHVlOiAob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSA9PiBhbnlcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudHlwZVZhbHVlID8gdGhpcy50eXBlVmFsdWUgOiBcInN0cmluZ1wiOyB9XHJcbiAgICBwdWJsaWMgc2V0IHR5cGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnR5cGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlR2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uR2V0VmFsdWU7IH1cclxuICAgIHB1YmxpYyBpc0RlZmF1bHRWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmRlZmF1bHRWYWx1ZSkgPyAodGhpcy5kZWZhdWx0VmFsdWUgPT0gdmFsdWUpIDogISh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VmFsdWUob2JqOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uR2V0VmFsdWUpIHJldHVybiB0aGlzLm9uR2V0VmFsdWUob2JqKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VTZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25TZXRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldFZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vblNldFZhbHVlKG9iaiwgdmFsdWUsIGpzb25Db252KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0T2JqVHlwZShvYmpUeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2xhc3NOYW1lUGFydCkgcmV0dXJuIG9ialR5cGU7XHJcbiAgICAgICAgcmV0dXJuIG9ialR5cGUucmVwbGFjZSh0aGlzLmNsYXNzTmFtZVBhcnQsIFwiXCIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmNsYXNzTmFtZVBhcnQgJiYgY2xhc3NOYW1lLmluZGV4T2YodGhpcy5jbGFzc05hbWVQYXJ0KSA8IDApID8gY2xhc3NOYW1lICsgdGhpcy5jbGFzc05hbWVQYXJ0IDogY2xhc3NOYW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNWYWx1ZSAhPSBudWxsKSByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hvaWNlc2Z1bmMgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc2Z1bmMoKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRDaG9pY2VzKHZhbHVlOiBBcnJheTxhbnk+LCB2YWx1ZUZ1bmM6ICgpID0+IEFycmF5PGFueT4pIHtcclxuICAgICAgICB0aGlzLmNob2ljZXNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc2Z1bmMgPSB2YWx1ZUZ1bmM7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgIHN0YXRpYyByZXF1aXJlZFN5bWJvbCA9ICchJztcclxuICAgIHN0YXRpYyB0eXBlU3ltYm9sID0gJzonO1xyXG4gICAgcHJvcGVydGllczogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiA9IG51bGw7XHJcbiAgICByZXF1aXJlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHJvcGVydGllczogQXJyYXk8YW55PiwgcHVibGljIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmNyZWF0ZVByb3BlcnR5KHByb3BlcnRpZXNbaV0pO1xyXG4gICAgICAgICAgICBpZiAocHJvcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcmVhdGVQcm9wZXJ0eShwcm9wSW5mbzogYW55KTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gdHlwZW9mIHByb3BJbmZvID09PSBcInN0cmluZ1wiID8gcHJvcEluZm8gOiBwcm9wSW5mby5uYW1lO1xyXG4gICAgICAgIGlmICghcHJvcGVydHlOYW1lKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9IG51bGw7XHJcbiAgICAgICAgdmFyIHR5cGVJbmRleCA9IHByb3BlcnR5TmFtZS5pbmRleE9mKEpzb25NZXRhZGF0YUNsYXNzLnR5cGVTeW1ib2wpO1xyXG4gICAgICAgIGlmICh0eXBlSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKHR5cGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDAsIHR5cGVJbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3BlcnR5TmFtZSA9IHRoaXMuZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgdmFyIHByb3AgPSBuZXcgSnNvbk9iamVjdFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5VHlwZSkge1xyXG4gICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wZXJ0eVR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgcHJvcEluZm8gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHByb3AudHlwZSA9IHByb3BJbmZvLnR5cGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BJbmZvLmRlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgIHByb3AuZGVmYXVsdFZhbHVlID0gcHJvcEluZm8uZGVmYXVsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcEluZm8uaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tYWtlUHJvcGVydHlSZXF1aXJlZChwcm9wLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5jaG9pY2VzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hvaWNlc0Z1bmMgPSB0eXBlb2YgcHJvcEluZm8uY2hvaWNlcyA9PT0gXCJmdW5jdGlvblwiID8gcHJvcEluZm8uY2hvaWNlcyA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hvaWNlc1ZhbHVlID0gdHlwZW9mIHByb3BJbmZvLmNob2ljZXMgIT09IFwiZnVuY3Rpb25cIiA/IHByb3BJbmZvLmNob2ljZXMgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgcHJvcC5zZXRDaG9pY2VzKGNob2ljZXNWYWx1ZSwgY2hvaWNlc0Z1bmMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5vbkdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLm9uR2V0VmFsdWUgPSBwcm9wSW5mby5vbkdldFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLm9uU2V0VmFsdWUgPSBwcm9wSW5mby5vblNldFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3AuY2xhc3NOYW1lID0gcHJvcEluZm8uY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5iYXNlQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmJhc2VDbGFzc05hbWUgPSBwcm9wSW5mby5iYXNlQ2xhc3NOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wSW5mby5jbGFzc05hbWVQYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wLmNsYXNzTmFtZVBhcnQgPSBwcm9wSW5mby5jbGFzc05hbWVQYXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUubGVuZ3RoID09IDAgfHwgcHJvcGVydHlOYW1lWzBdICE9IEpzb25NZXRhZGF0YUNsYXNzLnJlcXVpcmVkU3ltYm9sKSByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zbGljZSgxKTtcclxuICAgICAgICB0aGlzLm1ha2VQcm9wZXJ0eVJlcXVpcmVkKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbWFrZVByb3BlcnR5UmVxdWlyZWQocHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMucHVzaChwcm9wZXJ0eU5hbWUpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGEge1xyXG4gICAgcHJpdmF0ZSBjbGFzc2VzOiBIYXNoVGFibGU8SnNvbk1ldGFkYXRhQ2xhc3M+ID0ge307XHJcbiAgICBwcml2YXRlIGNoaWxkcmVuQ2xhc3NlczogSGFzaFRhYmxlPEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPj4gPSB7fTtcclxuICAgIHByaXZhdGUgY2xhc3NQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pj4gPSB7fTtcclxuICAgIHByaXZhdGUgY2xhc3NSZXF1aXJlZFByb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxzdHJpbmc+PiA9IHt9O1xyXG4gICAgcHVibGljIGFkZENsYXNzKG5hbWU6IHN0cmluZywgcHJvcGVydGllczogQXJyYXk8YW55PiwgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IG5ldyBKc29uTWV0YWRhdGFDbGFzcyhuYW1lLCBwcm9wZXJ0aWVzLCBjcmVhdG9yLCBwYXJlbnROYW1lKTtcclxuICAgICAgICB0aGlzLmNsYXNzZXNbbmFtZV0gPSBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIGlmIChwYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdLnB1c2gobWV0YURhdGFDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIG92ZXJyaWRlQ2xhc3NDcmVhdG9yZShuYW1lOiBzdHJpbmcsIGNyZWF0b3I6ICgpID0+IGFueSkge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MpIHtcclxuICAgICAgICAgICAgbWV0YURhdGFDbGFzcy5jcmVhdG9yID0gY3JlYXRvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+IHtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcmVhdGVDbGFzcyhuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcy5jcmVhdG9yKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0Q2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuID0gZmFsc2UpOiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFByb3BlcnR5KGNsYXNzTmFtZTogc3RyaW5nLCBwcm9wZXJ0eUluZm86IGFueSkge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICB2YXIgcHJvcGVydHkgPSBtZXRhRGF0YUNsYXNzLmNyZWF0ZVByb3BlcnR5KHByb3BlcnR5SW5mbyk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUHJvcGVydHlUb0NsYXNzKG1ldGFEYXRhQ2xhc3MsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgdGhpcy5lbXB0eUNsYXNzUHJvcGVydGllc0hhc2gobWV0YURhdGFDbGFzcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZVByb3BlcnR5KGNsYXNzTmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgcHJvcGVydHkgPSBtZXRhRGF0YUNsYXNzLmZpbmQocHJvcGVydHlOYW1lKTtcclxuICAgICAgICBpZiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVQcm9wZXJ0eUZyb21DbGFzcyhtZXRhRGF0YUNsYXNzLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHlDbGFzc1Byb3BlcnRpZXNIYXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkUHJvcGVydHlUb0NsYXNzKG1ldGFEYXRhQ2xhc3M6IEpzb25NZXRhZGF0YUNsYXNzLCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MuZmluZChwcm9wZXJ0eS5uYW1lKSAhPSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLnB1c2gocHJvcGVydHkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZW1vdmVQcm9wZXJ0eUZyb21DbGFzcyhtZXRhRGF0YUNsYXNzOiBKc29uTWV0YWRhdGFDbGFzcywgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5pbmRleE9mKHByb3BlcnR5KTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gbWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMuaW5kZXhPZihwcm9wZXJ0eS5uYW1lKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGVtcHR5Q2xhc3NQcm9wZXJ0aWVzSGFzaChtZXRhRGF0YUNsYXNzOiBKc29uTWV0YWRhdGFDbGFzcykge1xyXG4gICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW21ldGFEYXRhQ2xhc3MubmFtZV0gPSBudWxsO1xyXG4gICAgICAgIHZhciBjaGlsZENsYXNzZXMgPSB0aGlzLmdldENoaWxkcmVuQ2xhc3NlcyhtZXRhRGF0YUNsYXNzLm5hbWUpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW2NoaWxkQ2xhc3Nlc1tpXS5uYW1lXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuLCByZXN1bHQ6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPikge1xyXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW25hbWVdO1xyXG4gICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghY2FuQmVDcmVhdGVkIHx8IGNoaWxkcmVuW2ldLmNyZWF0b3IpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMoY2hpbGRyZW5baV0ubmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBmaW5kQ2xhc3MobmFtZTogc3RyaW5nKTogSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXNzZXNbbmFtZV07XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbGxQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pikge1xyXG4gICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUHJvcGVydHlDb3JlKG1ldGFEYXRhQ2xhc3MucHJvcGVydGllc1tpXSwgbGlzdCwgbGlzdC5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkUHJvcGVydHlDb3JlKHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGVuZEluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxpc3RbaV0ubmFtZSA9PSBwcm9wZXJ0eS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgIGxpc3QucHVzaChwcm9wZXJ0eSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaXN0W2luZGV4XSA9IHByb3BlcnR5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcsIGxpc3Q6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShsaXN0LCBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uRXJyb3Ige1xyXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIGF0OiBOdW1iZXIgPSAtMTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRGdWxsRGVzY3JpcHRpb24oKSA6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZSArICh0aGlzLmRlc2NyaXB0aW9uID8gXCJcXG5cIiArIHRoaXMuZGVzY3JpcHRpb24gOiBcIlwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoXCJ1bmtub3ducHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJyBpcyB1bmtub3duLlwiKTtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBsaXN0IG9mIGF2YWlsYWJsZSBwcm9wZXJ0aWVzIGFyZTogXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gcHJvcGVydGllc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gJy4nO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcih0eXBlLCBtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgZm9sbG93aW5nIHR5cGVzIGFyZSBhdmFpbGFibGU6IFwiO1xyXG4gICAgICAgIHZhciB0eXBlcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKGJhc2VDbGFzc05hbWUsIHRydWUpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIidcIiArIHR5cGVzW2ldLm5hbWUgKyBcIidcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIi5cIjtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJtaXNzaW5ndHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgbWlzc2luZyBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIEpzb25JbmNvcnJlY3RUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJpbmNvcnJlY3R0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBpbmNvcnJlY3QgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoXCJyZXF1aXJlZHByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpcyByZXF1aXJlZCBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicuXCIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSnNvbk9iamVjdCB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyB0eXBlUHJvcGVydHlOYW1lID0gXCJ0eXBlXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBwb3NpdGlvblByb3BlcnR5TmFtZSA9IFwicG9zXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBtZXRhRGF0YVZhbHVlID0gbmV3IEpzb25NZXRhZGF0YSgpO1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgbWV0YURhdGEoKSB7IHJldHVybiBKc29uT2JqZWN0Lm1ldGFEYXRhVmFsdWU7IH1cclxuICAgIHB1YmxpYyBlcnJvcnMgPSBuZXcgQXJyYXk8SnNvbkVycm9yPigpO1xyXG4gICAgcHVibGljIHRvSnNvbk9iamVjdChvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG9Kc29uT2JqZWN0Q29yZShvYmosIG51bGwpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHRvT2JqZWN0KGpzb25PYmo6IGFueSwgb2JqOiBhbnkpIHtcclxuICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IG51bGw7XHJcbiAgICAgICAgaWYgKG9iai5nZXRUeXBlKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT0gSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGpzb25PYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KHByb3BlcnRpZXMsIGtleSk7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IobmV3IEpzb25Vbmtub3duUHJvcGVydHlFcnJvcihrZXkudG9TdHJpbmcoKSwgb2JqLmdldFR5cGUoKSksIGpzb25PYmopO1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy52YWx1ZVRvT2JqKGpzb25PYmpba2V5XSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdG9Kc29uT2JqZWN0Q29yZShvYmo6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFvYmouZ2V0VHlwZSkgcmV0dXJuIG9iajtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgKCFwcm9wZXJ0eS5jbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWVdID0gcHJvcGVydHkuZ2V0T2JqVHlwZShvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZVRvSnNvbihvYmosIHJlc3VsdCwgcHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb0pzb24ob2JqOiBhbnksIHJlc3VsdDogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gbnVsbDtcclxuICAgICAgICBpZiAocHJvcGVydHkuaGFzVG9Vc2VHZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHByb3BlcnR5LmdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgdmFyIGFyclZhbHVlID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFyclZhbHVlLnB1c2godGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlW2ldLCBwcm9wZXJ0eSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhbHVlID0gYXJyVmFsdWUubGVuZ3RoID4gMCA/IGFyclZhbHVlIDogbnVsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICByZXN1bHRbcHJvcGVydHkubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb09iaih2YWx1ZTogYW55LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgcHJvcGVydHkuc2V0VmFsdWUob2JqLCB2YWx1ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlVG9BcnJheSh2YWx1ZSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3T2JqID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICBpZiAobmV3T2JqLm5ld09iaikge1xyXG4gICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlLCBuZXdPYmoubmV3T2JqKTtcclxuICAgICAgICAgICAgdmFsdWUgPSBuZXdPYmoubmV3T2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIW5ld09iai5lcnJvcikge1xyXG4gICAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNWYWx1ZUFycmF5KHZhbHVlOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkuaW5kZXhPZihcIkFycmF5XCIpID4gLTE7IH1cclxuICAgIHByaXZhdGUgY3JlYXRlTmV3T2JqKHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7IG5ld09iajogbnVsbCwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWVbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXTtcclxuICAgICAgICBpZiAoIWNsYXNzTmFtZSAmJiBwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5LmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5jbGFzc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmdldENsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgIHJlc3VsdC5uZXdPYmogPSAoY2xhc3NOYW1lKSA/IEpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoY2xhc3NOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgcmVzdWx0LmVycm9yID0gdGhpcy5jaGVja05ld09iamVjdE9uRXJyb3JzKHJlc3VsdC5uZXdPYmosIHZhbHVlLCBwcm9wZXJ0eSwgY2xhc3NOYW1lKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja05ld09iamVjdE9uRXJyb3JzKG5ld09iajogYW55LCB2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBjbGFzc05hbWU6IHN0cmluZyk6IEpzb25FcnJvciB7XHJcbiAgICAgICAgdmFyIGVycm9yID0gbnVsbDtcclxuICAgICAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1aXJlZFByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAocmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcXVpcmVkUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVbcmVxdWlyZWRQcm9wZXJ0aWVzW2ldXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yKHJlcXVpcmVkUHJvcGVydGllc1tpXSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmJhc2VDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbk1pc3NpbmdUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25JbmNvcnJlY3RUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IoZXJyb3IsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGROZXdFcnJvcihlcnJvcjogSnNvbkVycm9yLCBqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBpZiAoanNvbk9iaiAmJiBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICAgIGVycm9yLmF0ID0ganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXS5zdGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHZhbHVlVG9BcnJheSh2YWx1ZTogQXJyYXk8YW55Piwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVBcnJheShvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgb2JqW2tleV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZVtpXSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlW2ldLCBuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2godmFsdWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5kUHJvcGVydHkocHJvcGVydGllczogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Piwga2V5OiBhbnkpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW2ldLm5hbWUgPT0ga2V5KSByZXR1cm4gcHJvcGVydGllc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9qc29ub2JqZWN0LnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBJdGVtVmFsdWUsIFN1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge0N1c3RvbUVycm9yfSBmcm9tIFwiLi9lcnJvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENob2ljZXNSZXN0ZnVsbCBleHRlbmRzIEJhc2Uge1xyXG4gICAgcHVibGljIHVybDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBwYXRoOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHZhbHVlTmFtZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyB0aXRsZU5hbWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgZ2V0UmVzdWx0Q2FsbGJhY2s6IChpdGVtczogQXJyYXk8SXRlbVZhbHVlPikgPT4gdm9pZDtcclxuICAgIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBydW4oKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnVybCB8fCAhdGhpcy5nZXRSZXN1bHRDYWxsYmFjaykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub3BlbignR0VUJywgdGhpcy51cmwpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkxvYWQoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25FcnJvcih4aHIuc3RhdHVzVGV4dCwgeGhyLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJjaG9pY2VzQnlVcmxcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy51cmwgJiYgIXRoaXMucGF0aCAmJiAhdGhpcy52YWx1ZU5hbWUgJiYgIXRoaXMudGl0bGVOYW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldERhdGEoanNvbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICAgIGlmIChqc29uLnVybCkgdGhpcy51cmwgPSBqc29uLnVybDtcclxuICAgICAgICBpZiAoanNvbi5wYXRoKSB0aGlzLnBhdGggPSBqc29uLnBhdGg7XHJcbiAgICAgICAgaWYgKGpzb24udmFsdWVOYW1lKSB0aGlzLnZhbHVlTmFtZSA9IGpzb24udmFsdWVOYW1lO1xyXG4gICAgICAgIGlmIChqc29uLnRpdGxlTmFtZSkgdGhpcy50aXRsZU5hbWUgPSBqc29uLnRpdGxlTmFtZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLnVybCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5wYXRoID0gXCJcIjtcclxuICAgICAgICB0aGlzLnZhbHVlTmFtZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy50aXRsZU5hbWUgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZChyZXN1bHQ6IGFueSkge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIHJlc3VsdCA9IHRoaXMuZ2V0UmVzdWx0QWZ0ZXJQYXRoKHJlc3VsdCk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHRbXCJsZW5ndGhcIl0pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSByZXN1bHRbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW1WYWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKG5ldyBJdGVtVmFsdWUodmFsdWUsIHRpdGxlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJ1cmxHZXRDaG9pY2VzRXJyb3JcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldFJlc3VsdENhbGxiYWNrKGl0ZW1zKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25FcnJvcihzdGF0dXM6IHN0cmluZywgcmVzcG9uc2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSBuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVybFJlcXVlc3RFcnJvclwiKVtcImZvcm1hdFwiXShzdGF0dXMsIHJlc3BvbnNlKSk7XHJcbiAgICAgICAgdGhpcy5nZXRSZXN1bHRDYWxsYmFjayhbXSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFJlc3VsdEFmdGVyUGF0aChyZXN1bHQ6IGFueSkge1xyXG4gICAgICAgIGlmICghcmVzdWx0KSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIGlmICghdGhpcy5wYXRoKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIHZhciBwYXRoZXMgPSB0aGlzLmdldFBhdGhlcygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGF0aGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwYXRoZXNbaV1dO1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFBhdGhlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcGF0aGVzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMucGF0aC5pbmRleE9mKCc7JykgPiAtMSkge1xyXG4gICAgICAgICAgICBwYXRoZXMgPSB0aGlzLnBhdGguc3BsaXQoJzsnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXRoZXMgPSB0aGlzLnBhdGguc3BsaXQoJywnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBhdGhlcy5sZW5ndGggPT0gMCkgcGF0aGVzLnB1c2godGhpcy5wYXRoKTtcclxuICAgICAgICByZXR1cm4gcGF0aGVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWYWx1ZShpdGVtOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlTmFtZSkgcmV0dXJuIGl0ZW1bdGhpcy52YWx1ZU5hbWVdO1xyXG4gICAgICAgIHZhciBsZW4gPSBPYmplY3Qua2V5cyhpdGVtKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbiA8IDEpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBpdGVtW09iamVjdC5rZXlzKGl0ZW0pWzBdXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VGl0bGUoaXRlbTogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXRoaXMudGl0bGVOYW1lKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gaXRlbVt0aGlzLnRpdGxlTmFtZV07XHJcbiAgICB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNob2ljZXNCeVVybFwiLCBbXCJ1cmxcIiwgXCJwYXRoXCIsIFwidmFsdWVOYW1lXCIsIFwidGl0bGVOYW1lXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQ2hvaWNlc1Jlc3RmdWxsKCk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2Nob2ljZXNSZXN0ZnVsbC50c1xuICoqLyIsImltcG9ydCB7SGFzaFRhYmxlfSBmcm9tICcuL2Jhc2UnO1xyXG5pbXBvcnQge0NvbmRpdGlvbnNQYXJzZXJ9IGZyb20gJy4vY29uZGl0aW9uc1BhcnNlcic7XHJcbmltcG9ydCB7UHJvY2Vzc1ZhbHVlfSBmcm9tIFwiLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25kaXRpb24ge1xyXG4gICAgc3RhdGljIG9wZXJhdG9yc1ZhbHVlOiBIYXNoVGFibGU8RnVuY3Rpb24+ID0gbnVsbDtcclxuICAgIHN0YXRpYyBnZXQgb3BlcmF0b3JzKCkge1xyXG4gICAgICAgIGlmIChDb25kaXRpb24ub3BlcmF0b3JzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIENvbmRpdGlvbi5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICFsZWZ0OyB9LFxyXG4gICAgICAgICAgICBub3RlbXB0eTogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiAhKCFsZWZ0KTsgfSxcclxuICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCA9PSByaWdodDsgfSxcclxuICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCAhPSByaWdodDsgfSxcclxuICAgICAgICAgICAgY29udGFpbnM6IGZ1bmN0aW9uIChsZWZ0LCByaWdodCkgeyByZXR1cm4gbGVmdCAmJiBsZWZ0W1wiaW5kZXhPZlwiXSAmJiBsZWZ0LmluZGV4T2YocmlnaHQpID4gLTE7IH0sXHJcbiAgICAgICAgICAgIG5vdGNvbnRhaW5zOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuICFsZWZ0IHx8ICFsZWZ0W1wiaW5kZXhPZlwiXSB8fCBsZWZ0LmluZGV4T2YocmlnaHQpID09IC0xOyB9LFxyXG4gICAgICAgICAgICBncmVhdGVyOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPiByaWdodDsgfSxcclxuICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7IHJldHVybiBsZWZ0IDwgcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgIGdyZWF0ZXJvcmVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPj0gcmlnaHQ7IH0sXHJcbiAgICAgICAgICAgIGxlc3NvcmVxdWFsOiBmdW5jdGlvbiAobGVmdCwgcmlnaHQpIHsgcmV0dXJuIGxlZnQgPD0gcmlnaHQ7IH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzVmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9wVmFsdWU6IHN0cmluZyA9IFwiZXF1YWxcIjtcclxuICAgIHB1YmxpYyBsZWZ0OiBhbnk7XHJcbiAgICBwdWJsaWMgcmlnaHQ6IGFueTtcclxuICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBvcGVyYXRvcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAoIUNvbmRpdGlvbi5vcGVyYXRvcnNbdmFsdWVdKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcGVyZm9ybShsZWZ0OiBhbnkgPSBudWxsLCByaWdodDogYW55ID0gbnVsbCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghbGVmdCkgbGVmdCA9IHRoaXMubGVmdDtcclxuICAgICAgICBpZiAoIXJpZ2h0KSByaWdodCA9IHRoaXMucmlnaHQ7XHJcblxyXG4gICAgICAgIHJldHVybiBDb25kaXRpb24ub3BlcmF0b3JzW3RoaXMub3BlcmF0b3JdKHRoaXMuZ2V0UHVyZVZhbHVlKGxlZnQpLCB0aGlzLmdldFB1cmVWYWx1ZShyaWdodCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRQdXJlVmFsdWUodmFsOiBhbnkpOiBhbnkge1xyXG4gICAgICAgIGlmICghdmFsIHx8ICh0eXBlb2YgdmFsICE9IFwic3RyaW5nXCIpKSByZXR1cm4gdmFsO1xyXG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgICAgIGlmICh2YWwubGVuZ3RoID4gMCAmJiAodmFsWzBdID09IFwiJ1wiIHx8IHZhbFswXSA9PSAnXCInKSkgIHZhbCA9IHZhbC5zdWJzdHIoMSk7XHJcbiAgICAgICAgdmFyIGxlbiA9IHZhbC5sZW5ndGg7XHJcbiAgICAgICAgaWYgKGxlbiA+IDAgJiYgKHZhbFtsZW4gLSAxXSA9PSBcIidcIiB8fCB2YWxbbGVuIC0gMV0gPT0gJ1wiJykpICB2YWwgPSB2YWwuc3Vic3RyKDAsIGxlbiAtIDEpO1xyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbk5vZGUge1xyXG4gICAgcHJpdmF0ZSBjb25uZWN0aXZlVmFsdWU6IHN0cmluZyA9IFwiYW5kXCI7XHJcbiAgICBwdWJsaWMgY2hpbGRyZW46IEFycmF5PGFueT4gPSBbXTtcclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHsgfVxyXG4gICAgcHVibGljIGdldCBjb25uZWN0aXZlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbm5lY3RpdmVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjb25uZWN0aXZlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBcIiZcIiB8fCB2YWx1ZSA9PSBcIiYmXCIpIHZhbHVlID0gXCJhbmRcIjtcclxuICAgICAgICBpZiAodmFsdWUgPT0gXCJ8XCIgfHwgdmFsdWUgPT0gXCJ8fFwiKSB2YWx1ZSA9IFwib3JcIjtcclxuICAgICAgICBpZiAodmFsdWUgIT0gXCJhbmRcIiAmJiB2YWx1ZSAhPSBcIm9yXCIpIHJldHVybjtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpdmVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0VtcHR5KCkgeyByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPT0gMDsgfVxyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RpdmUgPSBcImFuZFwiO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBDb25kaXRpb25SdW5uZXIge1xyXG4gICAgcHJpdmF0ZSBleHByZXNzaW9uVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcHJvY2Vzc1ZhbHVlOiBQcm9jZXNzVmFsdWU7XHJcbiAgICBwcml2YXRlIHJvb3Q6IENvbmRpdGlvbk5vZGU7XHJcbiAgICBwcml2YXRlIHZhbHVlczogSGFzaFRhYmxlPGFueT47XHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZXhwcmVzc2lvbjogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IENvbmRpdGlvbk5vZGUoKTtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb24gPSBleHByZXNzaW9uO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc1ZhbHVlID0gbmV3IFByb2Nlc3NWYWx1ZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBleHByZXNzaW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmV4cHJlc3Npb25WYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBleHByZXNzaW9uKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5leHByZXNzaW9uID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5leHByZXNzaW9uVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBuZXcgQ29uZGl0aW9uc1BhcnNlcigpLnBhcnNlKHRoaXMuZXhwcmVzc2lvblZhbHVlLCB0aGlzLnJvb3QpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJ1bih2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnVuTm9kZSh0aGlzLnJvb3QpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Ob2RlKG5vZGU6IENvbmRpdGlvbk5vZGUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgb25GaXJzdEZhaWwgPSBub2RlLmNvbm5lY3RpdmUgPT0gXCJhbmRcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IHRoaXMucnVuTm9kZUNvbmRpdGlvbihub2RlLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgaWYgKCFyZXMgJiYgb25GaXJzdEZhaWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHJlcyAmJiAhb25GaXJzdEZhaWwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb25GaXJzdEZhaWw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bk5vZGVDb25kaXRpb24odmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodmFsdWVbXCJjaGlsZHJlblwiXSkgcmV0dXJuIHRoaXMucnVuTm9kZSh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHZhbHVlW1wibGVmdFwiXSkgcmV0dXJuIHRoaXMucnVuQ29uZGl0aW9uKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bkNvbmRpdGlvbihjb25kaXRpb246IENvbmRpdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBsZWZ0ID0gY29uZGl0aW9uLmxlZnQ7XHJcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldFZhbHVlTmFtZShsZWZ0KTtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJvY2Vzc1ZhbHVlLmhhc1ZhbHVlKG5hbWUsIHRoaXMudmFsdWVzKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBsZWZ0ID0gdGhpcy5wcm9jZXNzVmFsdWUuZ2V0VmFsdWUobmFtZSwgdGhpcy52YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmlnaHQgPSBjb25kaXRpb24ucmlnaHQ7XHJcbiAgICAgICAgbmFtZSA9IHRoaXMuZ2V0VmFsdWVOYW1lKHJpZ2h0KTtcclxuICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMucHJvY2Vzc1ZhbHVlLmhhc1ZhbHVlKG5hbWUsIHRoaXMudmFsdWVzKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByaWdodCA9IHRoaXMucHJvY2Vzc1ZhbHVlLmdldFZhbHVlKG5hbWUsIHRoaXMudmFsdWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbmRpdGlvbi5wZXJmb3JtKGxlZnQsIHJpZ2h0KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0VmFsdWVOYW1lKG5vZGVWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKCFub2RlVmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygbm9kZVZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKG5vZGVWYWx1ZS5sZW5ndGggPCAzIHx8IG5vZGVWYWx1ZVswXSAhPSAneycgfHwgbm9kZVZhbHVlW25vZGVWYWx1ZS5sZW5ndGggLSAxXSAhPSAnfScpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBub2RlVmFsdWUuc3Vic3RyKDEsIG5vZGVWYWx1ZS5sZW5ndGggLSAyKTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2NvbmRpdGlvbnMudHNcbiAqKi8iLCJpbXBvcnQge0NvbmRpdGlvbiwgQ29uZGl0aW9uTm9kZX0gZnJvbSBcIi4vY29uZGl0aW9uc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmRpdGlvbnNQYXJzZXIge1xyXG4gICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHJvb3Q6IENvbmRpdGlvbk5vZGU7XHJcbiAgICBwcml2YXRlIGV4cHJlc3Npb25Ob2RlczogQXJyYXk8Q29uZGl0aW9uTm9kZT47XHJcbiAgICBwcml2YXRlIG5vZGU6IENvbmRpdGlvbk5vZGU7XHJcbiAgICBwcml2YXRlIGF0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgcHVibGljIHBhcnNlKHRleHQ6IHN0cmluZywgcm9vdDogQ29uZGl0aW9uTm9kZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5yb290ID0gcm9vdDtcclxuICAgICAgICB0aGlzLnJvb3QuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLmF0ID0gMDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMudGV4dC5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucGFyc2VUZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyB0b1N0cmluZyhyb290OiBDb25kaXRpb25Ob2RlKTogc3RyaW5nIHtcclxuICAgICAgICB0aGlzLnJvb3QgPSByb290O1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVUb1N0cmluZyhyb290KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdG9TdHJpbmdDb3JlKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImNoaWxkcmVuXCJdKSByZXR1cm4gdGhpcy5ub2RlVG9TdHJpbmcodmFsdWUpO1xyXG4gICAgICAgIGlmICh2YWx1ZVtcImxlZnRcIl0pIHJldHVybiB0aGlzLmNvbmRpdGlvblRvU3RyaW5nKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbm9kZVRvU3RyaW5nKG5vZGU6IENvbmRpdGlvbk5vZGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChub2RlLmlzRW1wdHkpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciByZXMgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZVRleHQgPSB0aGlzLnRvU3RyaW5nQ29yZShub2RlLmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgaWYgKG5vZGVUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzKSByZXMgKz0gJyAnICsgbm9kZS5jb25uZWN0aXZlICsgJyAnO1xyXG4gICAgICAgICAgICAgICAgcmVzICs9IG5vZGVUZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlICE9IHRoaXMucm9vdCAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgcmVzID0gJygnICsgcmVzICsgJyknO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25Ub1N0cmluZyhjb25kaXRpb246IENvbmRpdGlvbik6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFjb25kaXRpb24ucmlnaHQgfHwgIWNvbmRpdGlvbi5vcGVyYXRvcikgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFyIGxlZnQgPSBjb25kaXRpb24ubGVmdDtcclxuICAgICAgICBpZiAobGVmdCAmJiAhdGhpcy5pc051bWVyaWMobGVmdCkpIGxlZnQgPSBcIidcIiArIGxlZnQgKyBcIidcIjtcclxuICAgICAgICB2YXIgcmVzID0gbGVmdCArICcgJyArIHRoaXMub3BlcmF0aW9uVG9TdHJpbmcoY29uZGl0aW9uLm9wZXJhdG9yKTtcclxuICAgICAgICBpZiAodGhpcy5pc05vUmlnaHRPcGVyYXRpb24oY29uZGl0aW9uLm9wZXJhdG9yKSkgcmV0dXJuIHJlcztcclxuICAgICAgICB2YXIgcmlnaHQgPSBjb25kaXRpb24ucmlnaHQ7XHJcbiAgICAgICAgaWYgKHJpZ2h0ICYmICF0aGlzLmlzTnVtZXJpYyhyaWdodCkpIHJpZ2h0ID0gXCInXCIgKyByaWdodCArIFwiJ1wiO1xyXG4gICAgICAgIHJldHVybiByZXMgKyAnICcgKyByaWdodDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb3BlcmF0aW9uVG9TdHJpbmcob3A6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKG9wID09IFwiZXF1YWxcIikgcmV0dXJuIFwiPVwiO1xyXG4gICAgICAgIGlmIChvcCA9PSBcIm5vdGVxdWFsXCIpIHJldHVybiBcIiE9XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwiZ3JlYXRlclwiKSByZXR1cm4gXCI+XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwibGVzc1wiKSByZXR1cm4gXCI8XCI7XHJcbiAgICAgICAgaWYgKG9wID09IFwiZ3JlYXRlcm9yZXF1YWxcIikgcmV0dXJuIFwiPj1cIjtcclxuICAgICAgICBpZiAob3AgPT0gXCJsZXNzb3JlcXVhbFwiKSByZXR1cm4gXCI8PVwiO1xyXG4gICAgICAgIHJldHVybiBvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNOdW1lcmljKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgdmFsID0gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VUZXh0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMubm9kZSA9IHRoaXMucm9vdDtcclxuICAgICAgICB0aGlzLmV4cHJlc3Npb25Ob2RlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2lvbk5vZGVzLnB1c2godGhpcy5ub2RlKTtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIHJldHVybiByZXMgJiYgdGhpcy5hdCA+PSB0aGlzLmxlbmd0aDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZENvbmRpdGlvbnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMucmVhZENvbmRpdGlvbigpO1xyXG4gICAgICAgIGlmICghcmVzKSByZXR1cm4gcmVzO1xyXG4gICAgICAgIHZhciBjb25uZWN0aXZlID0gdGhpcy5yZWFkQ29ubmVjdGl2ZSgpO1xyXG4gICAgICAgIGlmIChjb25uZWN0aXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkQ29ubmVjdGl2ZShjb25uZWN0aXZlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZENvbmRpdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRDb25kaXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRFeHByZXNzaW9uKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgbGVmdCA9IHRoaXMucmVhZFN0cmluZygpO1xyXG4gICAgICAgIGlmICghbGVmdCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBvcCA9IHRoaXMucmVhZE9wZXJhdG9yKCk7XHJcbiAgICAgICAgaWYgKCFvcCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBjID0gbmV3IENvbmRpdGlvbigpO1xyXG4gICAgICAgIGMubGVmdCA9IGxlZnQ7IGMub3BlcmF0b3IgPSBvcDtcclxuICAgICAgICBpZiAoIXRoaXMuaXNOb1JpZ2h0T3BlcmF0aW9uKG9wKSkge1xyXG4gICAgICAgICAgICB2YXIgcmlnaHQgPSB0aGlzLnJlYWRTdHJpbmcoKTtcclxuICAgICAgICAgICAgaWYgKCFyaWdodCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBjLnJpZ2h0ID0gcmlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ29uZGl0aW9uKGMpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZWFkRXhwcmVzc2lvbigpOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICBpZiAodGhpcy5hdCA+PSB0aGlzLmxlbmd0aCB8fCB0aGlzLmNoICE9ICcoJykgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgIHRoaXMucHVzaEV4cHJlc3Npb24oKTtcclxuICAgICAgICB2YXIgcmVzID0gdGhpcy5yZWFkQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIGlmIChyZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5za2lwKCk7XHJcbiAgICAgICAgICAgIHJlcyA9IHRoaXMuY2ggPT0gJyknO1xyXG4gICAgICAgICAgICB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgIHRoaXMucG9wRXhwcmVzc2lvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXQgY2goKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGV4dC5jaGFyQXQodGhpcy5hdCk7IH1cclxuICAgIHByaXZhdGUgc2tpcCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5hdCA8IHRoaXMubGVuZ3RoICYmIHRoaXMuaXNTcGFjZSh0aGlzLmNoKSkgdGhpcy5hdCsrO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1NwYWNlKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjID09ICcgJyB8fCBjID09ICdcXG4nIHx8IGMgPT0gJ1xcdCcgfHwgYyA9PSAnXFxyJztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNRdW90ZXMoYzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGMgPT0gXCInXCIgfHwgYyA9PSAnXCInXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzT3BlcmF0b3JDaGFyKGM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjID09ICc+JyB8fCBjID09ICc8JyB8fCBjID09ICc9JyB8fCBjID09ICchJztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNCcmFja2V0cyhjOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gYyA9PSAnKCcgfHwgYyA9PSAnKSc7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYWRTdHJpbmcoKTogc3RyaW5nIHtcclxuICAgICAgICB0aGlzLnNraXAoKTtcclxuICAgICAgICBpZiAodGhpcy5hdCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5hdDtcclxuICAgICAgICB2YXIgaGFzUXVvdGVzID0gdGhpcy5pc1F1b3Rlcyh0aGlzLmNoKTtcclxuICAgICAgICBpZiAoaGFzUXVvdGVzKSB0aGlzLmF0Kys7XHJcbiAgICAgICAgdmFyIGlzRmlyc3RPcENoID0gdGhpcy5pc09wZXJhdG9yQ2hhcih0aGlzLmNoKTtcclxuICAgICAgICB3aGlsZSAodGhpcy5hdCA8IHRoaXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmICghaGFzUXVvdGVzICYmIHRoaXMuaXNTcGFjZSh0aGlzLmNoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUXVvdGVzKHRoaXMuY2gpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGFzUXVvdGVzKSB0aGlzLmF0Kys7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWhhc1F1b3Rlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRmlyc3RPcENoICE9IHRoaXMuaXNPcGVyYXRvckNoYXIodGhpcy5jaCkpIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNCcmFja2V0cyh0aGlzLmNoKSkgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hdCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hdCA8PSBzdGFydCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMudGV4dC5zdWJzdHIoc3RhcnQsIHRoaXMuYXQgLSBzdGFydCk7XHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDEgJiYgdGhpcy5pc1F1b3RlcyhyZXNbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGVuID0gcmVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1F1b3RlcyhyZXNbcmVzLmxlbmd0aCAtIDFdKSkgbGVuLS07XHJcbiAgICAgICAgICAgICAgICByZXMgPSByZXMuc3Vic3RyKDEsIGxlbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNOb1JpZ2h0T3BlcmF0aW9uKG9wOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gb3AgPT0gXCJlbXB0eVwiIHx8IG9wID09IFwibm90ZW1wdHlcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZE9wZXJhdG9yKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIG9wID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKCFvcCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgb3AgPSBvcC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPicpIG9wID0gXCJncmVhdGVyXCI7XHJcbiAgICAgICAgaWYgKG9wID09ICc8Jykgb3AgPSBcImxlc3NcIjtcclxuICAgICAgICBpZiAob3AgPT0gJz49JyB8fCBvcCA9PSAnPT4nKSBvcCA9IFwiZ3JlYXRlcm9yZXF1YWxcIjtcclxuICAgICAgICBpZiAob3AgPT0gJzw9JyB8fCBvcCA9PSAnPTwnKSBvcCA9IFwibGVzc29yZXF1YWxcIjtcclxuICAgICAgICBpZiAob3AgPT0gJz0nIHx8IG9wID09ICc9PScpIG9wID0gXCJlcXVhbFwiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnPD4nIHx8IG9wID09ICchPScpIG9wID0gXCJub3RlcXVhbFwiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnY29udGFpbicpIG9wID0gXCJjb250YWluc1wiO1xyXG4gICAgICAgIGlmIChvcCA9PSAnbm90Y29udGFpbicpIG9wID0gXCJub3Rjb250YWluc1wiO1xyXG4gICAgICAgIHJldHVybiBvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVhZENvbm5lY3RpdmUoKTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgY29uID0gdGhpcy5yZWFkU3RyaW5nKCk7XHJcbiAgICAgICAgaWYgKCFjb24pIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbiA9IGNvbi50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGlmIChjb24gPT0gXCImXCIgfHwgY29uID09IFwiJiZcIikgY29uID0gXCJhbmRcIjtcclxuICAgICAgICBpZiAoY29uID09IFwifFwiIHx8IGNvbiA9PSBcInx8XCIpIGNvbiA9IFwib3JcIjtcclxuICAgICAgICBpZiAoY29uICE9IFwiYW5kXCIgJiYgY29uICE9IFwib3JcIikgY29uID0gbnVsbDtcclxuICAgICAgICByZXR1cm4gY29uO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwdXNoRXhwcmVzc2lvbigpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgdGhpcy5leHByZXNzaW9uTm9kZXMucHVzaChub2RlKTtcclxuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwb3BFeHByZXNzaW9uKCkge1xyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5leHByZXNzaW9uTm9kZXMucG9wKCk7XHJcbiAgICAgICAgdGhpcy5ub2RlID0gdGhpcy5leHByZXNzaW9uTm9kZXNbdGhpcy5leHByZXNzaW9uTm9kZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gobm9kZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZENvbmRpdGlvbihjOiBDb25kaXRpb24pIHtcclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChjKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkQ29ubmVjdGl2ZShjb246IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdGl2ZSA9IGNvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLmNvbm5lY3RpdmUgIT0gY29uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkQ29uID0gdGhpcy5ub2RlLmNvbm5lY3RpdmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkQ2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5jb25uZWN0aXZlID0gY29uO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZE5vZGUgPSBuZXcgQ29uZGl0aW9uTm9kZSgpO1xyXG4gICAgICAgICAgICAgICAgb2xkTm9kZS5jb25uZWN0aXZlID0gb2xkQ29uO1xyXG4gICAgICAgICAgICAgICAgb2xkTm9kZS5jaGlsZHJlbiA9IG9sZENoaWxkcmVuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmNoaWxkcmVuLnB1c2gob2xkTm9kZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3Tm9kZSA9IG5ldyBDb25kaXRpb25Ob2RlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4ucHVzaChuZXdOb2RlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubm9kZSA9IG5ld05vZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb25kaXRpb25zUGFyc2VyLnRzXG4gKiovIiwiaW1wb3J0IHtIYXNoVGFibGV9IGZyb20gJy4vYmFzZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgUHJvY2Vzc1ZhbHVlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBwdWJsaWMgZ2V0Rmlyc3ROYW1lKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0ZXh0KSByZXR1cm4gdGV4dDtcclxuICAgICAgICB2YXIgcmVzID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoID0gdGV4dFtpXTtcclxuICAgICAgICAgICAgaWYgKGNoID09ICcuJyB8fCBjaCA9PSAnWycpIGJyZWFrO1xyXG4gICAgICAgICAgICByZXMgKz0gY2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGFzVmFsdWUodGV4dDogc3RyaW5nLCB2YWx1ZXM6IEhhc2hUYWJsZTxhbnk+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IHRoaXMuZ2V0VmFsdWVDb3JlKHRleHQsIHZhbHVlcyk7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5oYXNWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRWYWx1ZSh0ZXh0OiBzdHJpbmcsIHZhbHVlczogSGFzaFRhYmxlPGFueT4pOiBhbnkge1xyXG4gICAgICAgIHZhciByZXMgPSB0aGlzLmdldFZhbHVlQ29yZSh0ZXh0LCB2YWx1ZXMpO1xyXG4gICAgICAgIHJldHVybiByZXMudmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlQ29yZSh0ZXh0OiBzdHJpbmcsIHZhbHVlczogYW55KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzID0geyBoYXNWYWx1ZTogZmFsc2UsIHZhbHVlOiBudWxsIH07XHJcbiAgICAgICAgdmFyIGN1clZhbHVlID0gdmFsdWVzO1xyXG4gICAgICAgIGlmICghY3VyVmFsdWUpIHJldHVybiByZXM7XHJcbiAgICAgICAgdmFyIGlzRmlyc3QgPSB0cnVlO1xyXG4gICAgICAgIHdoaWxlICh0ZXh0ICYmIHRleHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgaXNBcnJheSA9ICFpc0ZpcnN0ICYmIHRleHRbMF0gPT0gJ1snO1xyXG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdCkgdGV4dCA9IHRleHQuc3Vic3RyKDEpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1ck5hbWUgPSB0aGlzLmdldEZpcnN0TmFtZSh0ZXh0KTtcclxuICAgICAgICAgICAgICAgIGlmICghY3VyTmFtZSkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIGlmICghY3VyVmFsdWVbY3VyTmFtZV0pIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICBjdXJWYWx1ZSA9IGN1clZhbHVlW2N1ck5hbWVdXHJcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIoY3VyTmFtZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGN1clZhbHVlKSkgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA8IHRleHQubGVuZ3RoICYmIHRleHRbaW5kZXhdICE9ICddJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSB0ZXh0W2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGV4dCA9IGluZGV4IDwgdGV4dC5sZW5ndGggPyB0ZXh0LnN1YnN0cihpbmRleCArIDEpIDogXCJcIjtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gdGhpcy5nZXRJbnRWYWx1ZShzdHIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBjdXJWYWx1ZS5sZW5ndGgpIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICBjdXJWYWx1ZSA9IGN1clZhbHVlW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpc0ZpcnN0ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy52YWx1ZSA9IGN1clZhbHVlO1xyXG4gICAgICAgIHJlcy5oYXNWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0SW50VmFsdWUoc3RyOiBhbnkpIHtcclxuICAgICAgICBpZiAoc3RyID09IFwiMFwiIHx8ICgoc3RyIHwgMCkgPiAwICYmIHN0ciAlIDEgPT0gMCkpXHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoc3RyKTtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9jb25kaXRpb25Qcm9jZXNzVmFsdWUudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtCYXNlLCBJdGVtVmFsdWUsIElTdXJ2ZXlEYXRhLCBIYXNoVGFibGV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuaW1wb3J0IHtRdWVzdGlvblNlbGVjdEJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkRyb3Bkb3duTW9kZWx9IGZyb20gXCIuL3F1ZXN0aW9uX2Ryb3Bkb3duXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25DaGVja2JveE1vZGVsfSBmcm9tIFwiLi9xdWVzdGlvbl9jaGVja2JveFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uUmFkaW9ncm91cE1vZGVsfSBmcm9tIFwiLi9xdWVzdGlvbl9yYWRpb2dyb3VwXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25UZXh0TW9kZWx9IGZyb20gXCIuL3F1ZXN0aW9uX3RleHRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNvbW1lbnRNb2RlbH0gZnJvbSBcIi4vcXVlc3Rpb25fY29tbWVudFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgb25Sb3dDaGFuZ2VkKGNlbGw6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBuZXdSb3dWYWx1ZTogYW55KTtcclxuICAgIGNvbHVtbnM6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPjtcclxuICAgIGNyZWF0ZVF1ZXN0aW9uKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duQ29sdW1uIGV4dGVuZHMgQmFzZSB7XHJcbiAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHVibGljIG9wdGlvbnNDYXB0aW9uOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgaXNSZXF1aXJlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIGhhc090aGVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbWluV2lkdGg6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwdWJsaWMgY2VsbFR5cGU6IHN0cmluZyA9IFwiZGVmYXVsdFwiO1xyXG4gICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCkgeyByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiIH1cclxuICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7IHJldHVybiB0aGlzLnRpdGxlVmFsdWUgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdGl0bGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgY29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sQ291bnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjb2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgLTEgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25DZWxsIHtcclxuICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogUXVlc3Rpb247XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbiwgcHVibGljIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUgPSBkYXRhLmNyZWF0ZVF1ZXN0aW9uKHRoaXMucm93LCB0aGlzLmNvbHVtbik7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlLnNldERhdGEocm93KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb24geyByZXR1cm4gdGhpcy5xdWVzdGlvblZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnF1ZXN0aW9uLnZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXlEYXRhIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlcjogbnVtYmVyID0gMTtcclxuICAgIHByaXZhdGUgc3RhdGljIGdldElkKCk6IHN0cmluZyB7IHJldHVybiBcInNyb3dfXCIgKyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZS5pZENvdW50ZXIrKzsgfVxyXG4gICAgcHJvdGVjdGVkIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGE7XHJcbiAgICBwcml2YXRlIHJvd1ZhbHVlczogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgcm93Q29tbWVudHM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIGlzU2V0dGluZ1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGlkVmFsdWU6IHN0cmluZztcclxuXHJcbiAgICBwdWJsaWMgY2VsbHM6IEFycmF5PE1hdHJpeERyb3Bkb3duQ2VsbD4gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5pZFZhbHVlID0gTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UuZ2V0SWQoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkQ2VsbHMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuaWRWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gbnVsbDsgfVxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMucm93VmFsdWVzOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzU2V0dGluZ1ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnJvd1ZhbHVlcyA9IHt9O1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZXNba2V5XSA9IHZhbHVlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNlbGxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2VsbHNbaV0ucXVlc3Rpb24ub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy5nZXRWYWx1ZSh0aGlzLmNlbGxzW2ldLmNvbHVtbi5uYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNTZXR0aW5nVmFsdWUgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvd1ZhbHVlc1tuYW1lXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1NldHRpbmdWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gXCJcIikgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWVzW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMucm93VmFsdWVzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRhdGEub25Sb3dDaGFuZ2VkKHRoaXMsIHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dDb21tZW50c1tuYW1lXTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMucm93Q29tbWVudHNbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpIHtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBidWlsZENlbGxzKCkge1xyXG4gICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5kYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2x1bW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW4gPSBjb2x1bW5zW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2godGhpcy5jcmVhdGVDZWxsKGNvbHVtbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBNYXRyaXhEcm9wZG93bkNlbGwge1xyXG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25DZWxsKGNvbHVtbiwgdGhpcywgdGhpcy5kYXRhKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPiA9IFtdO1xyXG4gICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlZFZpc2libGVSb3dzOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZT47XHJcbiAgICBwcml2YXRlIGNlbGxUeXBlVmFsdWU6IHN0cmluZyA9IFwiZHJvcGRvd25cIjtcclxuICAgIHByaXZhdGUgY29sdW1uQ29sQ291bnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBjb2x1bW5NaW5XaWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBob3Jpem9udGFsU2Nyb2xsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgY29sdW1uc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHB1YmxpYyB1cGRhdGVDZWxsc0NhbGxiYWs6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29sdW1ucygpOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29sdW1ucyh2YWx1ZTogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+KSB7XHJcbiAgICAgICAgdGhpcy5jb2x1bW5zVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbHVtbnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjZWxsVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jZWxsVHlwZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNlbGxUeXBlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5jZWxsVHlwZSA9PSBuZXdWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY2VsbFR5cGVWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudXBkYXRlQ2VsbHNDYWxsYmFrKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29sdW1uQ29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sdW1uQ29sQ291bnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBjb2x1bW5Db2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIDwgMCB8fCB2YWx1ZSA+IDQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmNvbHVtbkNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnVwZGF0ZUNlbGxzQ2FsbGJhayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0Q29sdW1uVGl0bGUoY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNvbHVtbi50aXRsZTtcclxuICAgICAgICBpZiAoY29sdW1uLmlzUmVxdWlyZWQgJiYgdGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVpcmVUZXh0ID0gdGhpcy5zdXJ2ZXkucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAocmVxdWlyZVRleHQpIHJlcXVpcmVUZXh0ICs9IFwiIFwiO1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXF1aXJlVGV4dCArIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRDb2x1bW5XaWR0aChjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY29sdW1uLm1pbldpZHRoID8gY29sdW1uLm1pbldpZHRoIDogdGhpcy5jb2x1bW5NaW5XaWR0aDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBvcHRpb25zQ2FwdGlvbigpIHsgcmV0dXJuICh0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUpID8gdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wdGlvbnNDYXB0aW9uXCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IG9wdGlvbnNDYXB0aW9uKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBhZGRDb2x1bW4obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE1hdHJpeERyb3Bkb3duQ29sdW1uIHtcclxuICAgICAgICB2YXIgY29sdW1uID0gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmNvbHVtbnNWYWx1ZS5wdXNoKGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPiB7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyA9IHRoaXMuZ2VuZXJhdGVSb3dzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVSb3dzKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlPiB7IHJldHVybiBudWxsOyB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1ZhbHVlKGN1clZhbHVlOiBhbnkpOiBhbnkgeyByZXR1cm4gIWN1clZhbHVlID8ge30gOiBjdXJWYWx1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIGdldFJvd1ZhbHVlKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIHF1ZXN0aW9uVmFsdWU6IGFueSwgY3JlYXRlOiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBxdWVzdGlvblZhbHVlW3Jvdy5yb3dOYW1lXSA/IHF1ZXN0aW9uVmFsdWVbcm93LnJvd05hbWVdIDogbnVsbDtcclxuICAgICAgICBpZiAoIXJlc3VsdCAmJiBjcmVhdGUpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uVmFsdWVbcm93LnJvd05hbWVdID0gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlVmFsdWVDaGFuZ2VkKHZhbDogYW55KSB7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMub25CZWZvcmVWYWx1ZUNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgaWYoISh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB8fCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHJvdyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV07XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV0udmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHtcclxuICAgICAgICB2YXIgcm93cyA9IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3M7XHJcbiAgICAgICAgaWYgKCFyb3dzKSByb3dzID0gdGhpcy52aXNpYmxlUm93cztcclxuICAgICAgICBpZiAoIXJvd3MpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICBpZiAoIWNlbGxzKSBjb250aW51ZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IGNlbGxzLmxlbmd0aDsgY29sSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uICYmICghcXVlc3Rpb24uc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB8fCAhcXVlc3Rpb24udmFsdWUpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgZXJyb3NJbkNvbHVtbnMgPSB0aGlzLmhhc0Vycm9ySW5Db2x1bW5zKGZpcmVDYWxsYmFjayk7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmhhc0Vycm9ycyhmaXJlQ2FsbGJhY2spIHx8IGVycm9zSW5Db2x1bW5zO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNFcnJvckluQ29sdW1ucyhmaXJlQ2FsbGJhY2s6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgcmVzID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgY29sSW5kZXggPSAwOyBjb2xJbmRleCA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IGNvbEluZGV4KyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICAgICAgcmVzID0gY2VsbHMgJiYgY2VsbHNbY29sSW5kZXhdICYmIGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbiAmJiBjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb24uaGFzRXJyb3JzKGZpcmVDYWxsYmFjaykgfHwgcmVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0Rmlyc3RDZWxsUXVlc3Rpb24oZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbiA/IHF1ZXN0aW9uLmlucHV0SWQgOiBzdXBlci5nZXRGaXJzdElucHV0RWxlbWVudElkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RFcnJvcklucHV0RWxlbWVudElkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRGaXJzdENlbGxRdWVzdGlvbih0cnVlKTtcclxuICAgICAgICByZXR1cm4gcXVlc3Rpb24gPyBxdWVzdGlvbi5pbnB1dElkIDogc3VwZXIuZ2V0Rmlyc3RFcnJvcklucHV0RWxlbWVudElkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Rmlyc3RDZWxsUXVlc3Rpb24ob25FcnJvcjogYm9vbGVhbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2VsbHMgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLmNlbGxzO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBjb2xJbmRleCA9IDA7IGNvbEluZGV4IDwgdGhpcy5jb2x1bW5zLmxlbmd0aDsgY29sSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvbkVycm9yKSByZXR1cm4gY2VsbHNbY29sSW5kZXhdLnF1ZXN0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNlbGxzW2NvbEluZGV4XS5xdWVzdGlvbi5jdXJyZW50RXJyb3JDb3VudCA+IDApIHJldHVybiBjZWxsc1tjb2xJbmRleF0ucXVlc3Rpb25cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8vSU1hdHJpeERyb3Bkb3duRGF0YVxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5jcmVhdGVRdWVzdGlvbkNvcmUocm93LCBjb2x1bW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uLm5hbWUgPSBjb2x1bW4ubmFtZTtcclxuICAgICAgICBxdWVzdGlvbi5pc1JlcXVpcmVkID0gY29sdW1uLmlzUmVxdWlyZWQ7XHJcbiAgICAgICAgcXVlc3Rpb24uaGFzT3RoZXIgPSBjb2x1bW4uaGFzT3RoZXI7XHJcbiAgICAgICAgaWYgKGNvbHVtbi5oYXNPdGhlcikge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24gaW5zdGFuY2VvZiBRdWVzdGlvblNlbGVjdEJhc2UpIHtcclxuICAgICAgICAgICAgICAgICg8UXVlc3Rpb25TZWxlY3RCYXNlPnF1ZXN0aW9uKS5zdG9yZU90aGVyc0FzQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVRdWVzdGlvbkNvcmUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uIHtcclxuICAgICAgICB2YXIgY2VsbFR5cGUgPSBjb2x1bW4uY2VsbFR5cGUgPT0gXCJkZWZhdWx0XCIgPyB0aGlzLmNlbGxUeXBlIDogY29sdW1uLmNlbGxUeXBlO1xyXG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXRRdWVzdGlvbk5hbWUocm93LCBjb2x1bW4pO1xyXG4gICAgICAgIGlmIChjZWxsVHlwZSA9PSBcImNoZWNrYm94XCIpIHJldHVybiB0aGlzLmNyZWF0ZUNoZWNrYm94KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNlbGxUeXBlID09IFwicmFkaW9ncm91cFwiKSByZXR1cm4gdGhpcy5jcmVhdGVSYWRpb2dyb3VwKG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNlbGxUeXBlID09IFwidGV4dFwiKSByZXR1cm4gdGhpcy5jcmVhdGVUZXh0KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgaWYgKGNlbGxUeXBlID09IFwiY29tbWVudFwiKSByZXR1cm4gdGhpcy5jcmVhdGVDb21tZW50KG5hbWUsIGNvbHVtbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRHJvcGRvd24obmFtZSwgY29sdW1uKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRRdWVzdGlvbk5hbWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IHN0cmluZyB7IHJldHVybiByb3cucm93TmFtZSArIFwiX1wiICsgY29sdW1uLm5hbWU7IH1cclxuICAgIHByb3RlY3RlZCBnZXRDb2x1bW5DaG9pY2VzKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBBcnJheTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gY29sdW1uLmNob2ljZXMgJiYgY29sdW1uLmNob2ljZXMubGVuZ3RoID4gMCA/IGNvbHVtbi5jaG9pY2VzIDogdGhpcy5jaG9pY2VzO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldENvbHVtbk9wdGlvbnNDYXB0aW9uKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4ub3B0aW9uc0NhcHRpb24gPyBjb2x1bW4ub3B0aW9uc0NhcHRpb24gOiB0aGlzLm9wdGlvbnNDYXB0aW9uO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZURyb3Bkb3duKG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbCB7XHJcbiAgICAgICAgdmFyIHEgPSA8UXVlc3Rpb25Ecm9wZG93bk1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgbmFtZSk7XHJcbiAgICAgICAgcS5jaG9pY2VzID0gdGhpcy5nZXRDb2x1bW5DaG9pY2VzKGNvbHVtbik7XHJcbiAgICAgICAgcS5vcHRpb25zQ2FwdGlvbiA9IHRoaXMuZ2V0Q29sdW1uT3B0aW9uc0NhcHRpb24oY29sdW1uKTtcclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDaGVja2JveChuYW1lOiBzdHJpbmcsIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4pOiBRdWVzdGlvbkNoZWNrYm94TW9kZWwge1xyXG4gICAgICAgIHZhciBxID0gPFF1ZXN0aW9uQ2hlY2tib3hNb2RlbD50aGlzLmNyZWF0ZUNlbGxRdWVzdGlvbihcImNoZWNrYm94XCIsIG5hbWUpO1xyXG4gICAgICAgIHEuY2hvaWNlcyA9IHRoaXMuZ2V0Q29sdW1uQ2hvaWNlcyhjb2x1bW4pO1xyXG4gICAgICAgIHEuY29sQ291bnQgPSBjb2x1bW4uY29sQ291bnQgPiAtIDEgPyBjb2x1bW4uY29sQ291bnQgOiB0aGlzLmNvbHVtbkNvbENvdW50O1xyXG4gICAgICAgIHJldHVybiBxO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJhZGlvZ3JvdXAobmFtZTogc3RyaW5nLCBjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwge1xyXG4gICAgICAgIHZhciBxID0gPFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCBuYW1lKTtcclxuICAgICAgICBxLmNob2ljZXMgPSB0aGlzLmdldENvbHVtbkNob2ljZXMoY29sdW1uKTtcclxuICAgICAgICBxLmNvbENvdW50ID0gY29sdW1uLmNvbENvdW50ID4gLSAxID8gY29sdW1uLmNvbENvdW50IDogdGhpcy5jb2x1bW5Db2xDb3VudDtcclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0KG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uVGV4dE1vZGVsIHtcclxuICAgICAgICByZXR1cm4gPFF1ZXN0aW9uVGV4dE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwidGV4dFwiLCBuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDb21tZW50KG5hbWU6IHN0cmluZywgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbik6IFF1ZXN0aW9uQ29tbWVudE1vZGVsIHtcclxuICAgICAgICByZXR1cm4gPFF1ZXN0aW9uQ29tbWVudE1vZGVsPnRoaXMuY3JlYXRlQ2VsbFF1ZXN0aW9uKFwiY29tbWVudFwiLCBuYW1lKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uIHtcclxuICAgICAgICByZXR1cm4gPFF1ZXN0aW9uPlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGRlbGV0ZVJvd1ZhbHVlKG5ld1ZhbHVlOiBhbnksIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2UpOiBhbnkge1xyXG4gICAgICAgIGRlbGV0ZSBuZXdWYWx1ZVtyb3cucm93TmFtZV07XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG5ld1ZhbHVlKS5sZW5ndGggPT0gMCA/IG51bGwgOiBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIG9uUm93Q2hhbmdlZChyb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBuZXdSb3dWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICB2YXIgcm93VmFsdWUgPSB0aGlzLmdldFJvd1ZhbHVlKHJvdywgbmV3VmFsdWUsIHRydWUpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiByb3dWYWx1ZSkgZGVsZXRlIHJvd1ZhbHVlW2tleV07XHJcbiAgICAgICAgaWYgKG5ld1Jvd1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1Jvd1ZhbHVlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuZXdSb3dWYWx1ZSkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gbmV3Um93VmFsdWUpIHJvd1ZhbHVlW2tleV0gPSBuZXdSb3dWYWx1ZVtrZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoT2JqZWN0LmtleXMocm93VmFsdWUpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5kZWxldGVSb3dWYWx1ZShuZXdWYWx1ZSwgcm93KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInRpdGxlXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIG9uR2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXMgPSB2YWx1ZTsgfX0sXHJcbiAgICAgICAgXCJvcHRpb25zQ2FwdGlvblwiLCB7IG5hbWU6IFwiY2VsbFR5cGVcIiwgZGVmYXVsdDogXCJkZWZhdWx0XCIsIGNob2ljZXM6IFtcImRlZmF1bHRcIiwgXCJkcm9wZG93blwiLCBcImNoZWNrYm94XCIsIFwicmFkaW9ncm91cFwiLCBcInRleHRcIiwgXCJjb21tZW50XCJdIH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNvbENvdW50XCIsIGRlZmF1bHQ6IC0xLCBjaG9pY2VzOiBbLTEsIDAsIDEsIDIsIDMsIDRdIH0sIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLCBcIm1pbldpZHRoXCJdLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duQ29sdW1uKFwiXCIpOyB9KTtcclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkcm9wZG93bmJhc2VcIiwgW3sgbmFtZTogXCJjb2x1bW5zOm1hdHJpeGRyb3Bkb3duY29sdW1uc1wiLCBjbGFzc05hbWU6IFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIiB9LFxyXG4gICAgICAgIFwiaG9yaXpvbnRhbFNjcm9sbDpib29sZWFuXCIsXHJcbiAgICAgICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgICAgIHsgbmFtZTogXCJvcHRpb25zQ2FwdGlvblwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5vcHRpb25zQ2FwdGlvblZhbHVlOyB9IH0sXHJcbiAgICAgICAgeyBuYW1lOiBcImNlbGxUeXBlXCIsIGRlZmF1bHQ6IFwiZHJvcGRvd25cIiwgY2hvaWNlczogW1wiZHJvcGRvd25cIiwgXCJjaGVja2JveFwiLCBcInJhZGlvZ3JvdXBcIiwgXCJ0ZXh0XCIsIFwiY29tbWVudFwiXSB9LFxyXG4gICAgICAgIHsgbmFtZTogXCJjb2x1bW5Db2xDb3VudFwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgMywgNF0gfSwgXCJjb2x1bW5NaW5XaWR0aFwiXSxcclxuICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWxCYXNlKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSAnLi9qc29ub2JqZWN0JztcclxuaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gJy4vcXVlc3Rpb25iYXNlJztcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvciwgU3VydmV5RWxlbWVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge0Fuc3dlclJlcXVpcmVkRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7U3VydmV5VmFsaWRhdG9yLCBJVmFsaWRhdG9yT3duZXIsIFZhbGlkYXRvclJ1bm5lcn0gZnJvbSBcIi4vdmFsaWRhdG9yXCI7XHJcbmltcG9ydCB7VGV4dFByZVByb2Nlc3Nvcn0gZnJvbSBcIi4vdGV4dFByZVByb2Nlc3NvclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb25CYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBxdWVzdGlvbkNvbW1lbnQ6IHN0cmluZztcclxuICAgIHByaXZhdGUgaXNSZXF1aXJlZFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBoYXNPdGhlclZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIGNvbW1lbnRUZXh0VmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcbiAgICBlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPiA9IFtdO1xyXG4gICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcbiAgICB2YWx1ZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBlcnJvcnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICB0aXRsZUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNJbnB1dCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaW5wdXRJZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZCArIFwiaVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCk6IHN0cmluZyB7IHJldHVybiAodGhpcy50aXRsZVZhbHVlKSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50aXRsZVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy50aXRsZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5zdXJ2ZXkgIT0gbnVsbCA/IHRoaXMuc3VydmV5LnByb2Nlc3NUZXh0KHRoaXMudGl0bGUpIDogdGhpcy50aXRsZTsgfVxyXG4gICAgcHVibGljIGdldCBmdWxsVGl0bGUoKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50ZXh0UHJlUHJvY2Vzc29yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3IgPSBuZXcgVGV4dFByZVByb2Nlc3NvcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uSGFzVmFsdWUgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmNhblByb2Nlc3NlZFRleHRWYWx1ZXMobmFtZS50b0xvd2VyQ2FzZSgpKTsgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vblByb2Nlc3MgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nKSB7IHJldHVybiBzZWxmLmdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lKTsgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0UHJlUHJvY2Vzc29yLnByb2Nlc3ModGhpcy5zdXJ2ZXkucXVlc3Rpb25UaXRsZVRlbXBsYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlcXVpcmVUZXh0ID0gdGhpcy5yZXF1aXJlZFRleHQ7XHJcbiAgICAgICAgaWYgKHJlcXVpcmVUZXh0KSByZXF1aXJlVGV4dCArPSBcIiBcIjtcclxuICAgICAgICB2YXIgbm8gPSB0aGlzLm5vO1xyXG4gICAgICAgIGlmIChubykgbm8gKz0gXCIuIFwiO1xyXG4gICAgICAgIHJldHVybiBubyArIHJlcXVpcmVUZXh0ICsgdGhpcy5wcm9jZXNzZWRUaXRsZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBmb2N1cyhvbkVycm9yOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBTdXJ2ZXlFbGVtZW50LlNjcm9sbEVsZW1lbnRUb1RvcCh0aGlzLmlkKTtcclxuICAgICAgICB2YXIgaWQgPSAhb25FcnJvciA/IHRoaXMuZ2V0Rmlyc3RJbnB1dEVsZW1lbnRJZCgpIDogdGhpcy5nZXRGaXJzdEVycm9ySW5wdXRFbGVtZW50SWQoKTtcclxuICAgICAgICBpZiAoU3VydmV5RWxlbWVudC5Gb2N1c0VsZW1lbnQoaWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZm9jdXNDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0SW5wdXRFbGVtZW50SWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dElkO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEZpcnN0RXJyb3JJbnB1dEVsZW1lbnRJZCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEZpcnN0SW5wdXRFbGVtZW50SWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjYW5Qcm9jZXNzZWRUZXh0VmFsdWVzKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBuYW1lID09IFwibm9cIiB8fCBuYW1lID09IFwidGl0bGVcIiB8fCBuYW1lID09IFwicmVxdWlyZVwiO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFByb2Nlc3NlZFRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGlmIChuYW1lID09IFwibm9cIikgcmV0dXJuIHRoaXMubm87XHJcbiAgICAgICAgaWYgKG5hbWUgPT0gXCJ0aXRsZVwiKSByZXR1cm4gdGhpcy5wcm9jZXNzZWRUaXRsZTtcclxuICAgICAgICBpZiAobmFtZSA9PSBcInJlcXVpcmVcIikgcmV0dXJuIHRoaXMucmVxdWlyZWRUZXh0O1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBpc1JlcXVpcmVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc1JlcXVpcmVkVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaXNSZXF1aXJlZCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodGhpcy5pc1JlcXVpcmVkID09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaXNSZXF1aXJlZFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudGl0bGVDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNDb21tZW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaGFzQ29tbWVudCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuaGFzQ29tbWVudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0NvbW1lbnQpIHRoaXMuaGFzT3RoZXIgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29tbWVudFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY29tbWVudFRleHRWYWx1ZSA/IHRoaXMuY29tbWVudFRleHRWYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbW1lbnRUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmNvbW1lbnRUZXh0VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaGFzT3RoZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRPdGhlcigpIHx8IHRoaXMuaGFzT3RoZXIgPT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5oYXNPdGhlclZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB0aGlzLmhhc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmhhc090aGVyQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGhhc090aGVyQ2hhbmdlZCgpIHsgfVxyXG4gICAgcHJvdGVjdGVkIGdldCBubygpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLnZpc2libGVJbmRleCA8IDApIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHZhciBzdGFydEluZGV4ID0gMTtcclxuICAgICAgICB2YXIgaXNOdW1lcmljID0gdHJ1ZTtcclxuICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5zdXJ2ZXkucXVlc3Rpb25TdGFydEluZGV4KSB7XHJcbiAgICAgICAgICAgIHN0ciA9IHRoaXMuc3VydmV5LnF1ZXN0aW9uU3RhcnRJbmRleDtcclxuICAgICAgICAgICAgaWYgKHBhcnNlSW50KHN0cikpIHN0YXJ0SW5kZXggPSBwYXJzZUludChzdHIpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChzdHIubGVuZ3RoID09IDEpIGlzTnVtZXJpYyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNOdW1lcmljKSByZXR1cm4gKHRoaXMudmlzaWJsZUluZGV4ICsgc3RhcnRJbmRleCkudG9TdHJpbmcoKTtcclxuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShzdHIuY2hhckNvZGVBdCgwKSArIHRoaXMudmlzaWJsZUluZGV4KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgc3VwZXIub25TZXREYXRhKCk7XHJcbiAgICAgICAgdGhpcy5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZUZyb21EYXRhKHRoaXMuZ2V0VmFsdWVDb3JlKCkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy52YWx1ZUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbW1lbnQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0Q29tbWVudCgpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbW1lbnQgPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNldENvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29tbWVudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEuZ2V0Q29tbWVudCh0aGlzLm5hbWUpIDogdGhpcy5xdWVzdGlvbkNvbW1lbnQ7IH1cclxuICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMuY2hlY2tGb3JFcnJvcnMoZmlyZUNhbGxiYWNrKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudEVycm9yQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aDsgfVxyXG4gICAgcHVibGljIGdldCByZXF1aXJlZFRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3VydmV5ICE9IG51bGwgJiYgdGhpcy5pc1JlcXVpcmVkID8gdGhpcy5zdXJ2ZXkucmVxdWlyZWRUZXh0IDogXCJcIjsgfVxyXG4gICAgcHVibGljIGFkZEVycm9yKGVycm9yOiBTdXJ2ZXlFcnJvcikge1xyXG4gICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hlY2tGb3JFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gdGhpcy5lcnJvcnMgPyB0aGlzLmVycm9ycy5sZW5ndGggOiAwO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgdGhpcy5vbkNoZWNrRm9yRXJyb3JzKHRoaXMuZXJyb3JzKTtcclxuICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDAgJiYgdGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnJ1blZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgJiYgdGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5zdXJ2ZXkudmFsaWRhdGVRdWVzdGlvbih0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChmaXJlQ2FsbGJhY2sgJiYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCBlcnJvckxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1JlcXVpcmVkRXJyb3IoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBBbnN3ZXJSZXF1aXJlZEVycm9yKCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBoYXNSZXF1aXJlZEVycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzUmVxdWlyZWQgJiYgdGhpcy5pc0VtcHR5KCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSdW5uZXIoKS5ydW4odGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBzZXROZXdWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZUluRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlSW5EYXRhKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSkge1xyXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMudmFsdWVUb0RhdGEobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWYWx1ZUNvcmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSAhPSBudWxsID8gdGhpcy5kYXRhLmdldFZhbHVlKHRoaXMubmFtZSkgOiB0aGlzLnF1ZXN0aW9uVmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFZhbHVlQ29yZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRWYWx1ZSh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7IHJldHVybiB2YWw7IH1cclxuICAgIHByb3RlY3RlZCB2YWx1ZVRvRGF0YSh2YWw6IGFueSk6IGFueSB7IHJldHVybiB2YWw7IH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHsgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEuc2V0Q29tbWVudCh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgdGhpcy5xdWVzdGlvbkNvbW1lbnQgPSBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIC8vSVF1ZXN0aW9uXHJcbiAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZUZyb21EYXRhKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy9JVmFsaWRhdG9yT3duZXJcclxuICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiBudWxsOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uXCIsIFt7IG5hbWU6IFwidGl0bGU6dGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9IH0sXHJcbiAgICB7IG5hbWU6IFwiY29tbWVudFRleHRcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmouY29tbWVudFRleHRWYWx1ZTsgfSB9LFxyXG4gICAgXCJpc1JlcXVpcmVkOmJvb2xlYW5cIiwgeyBuYW1lOiBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXZhbGlkYXRvclwiLCBjbGFzc05hbWVQYXJ0OiBcInZhbGlkYXRvclwifV0sIG51bGwsIFwicXVlc3Rpb25iYXNlXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uLnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBJUXVlc3Rpb24sIElDb25kaXRpb25SdW5uZXIsIElTdXJ2ZXlEYXRhLCBJU3VydmV5LCBIYXNoVGFibGV9IGZyb20gJy4vYmFzZSc7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSAnLi9qc29ub2JqZWN0JztcclxuaW1wb3J0IHtDb25kaXRpb25SdW5uZXJ9IGZyb20gJy4vY29uZGl0aW9ucyc7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25CYXNlIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBxdWVzdGlvbkNvdW50ZXIgPSAxMDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBnZXRRdWVzdGlvbklkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwic3FfXCIgKyBRdWVzdGlvbkJhc2UucXVlc3Rpb25Db3VudGVyKys7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleURhdGE7XHJcbiAgICBwcm90ZWN0ZWQgc3VydmV5OiBJU3VydmV5O1xyXG4gICAgcHJpdmF0ZSBjb25kaXRpb25SdW5uZXI6IENvbmRpdGlvblJ1bm5lciA9IG51bGw7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBpZFZhbHVlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc3RhcnRXaXRoTmV3TGluZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIHZpc2libGVJbmRleFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgIHB1YmxpYyB3aWR0aDogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgcmVuZGVyV2lkdGhWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgcmlnaHRJbmRlbnRWYWx1ZTogbnVtYmVyID0gMDtcclxuICAgIHB1YmxpYyBpbmRlbnQ6IG51bWJlciA9IDA7XHJcbiAgICBmb2N1c0NhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgcmVuZGVyV2lkdGhDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICByb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgdmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIHZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmlkVmFsdWUgPSBRdWVzdGlvbkJhc2UuZ2V0UXVlc3Rpb25JZCgpO1xyXG4gICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZCg8SVF1ZXN0aW9uPnRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2aXNpYmxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudmlzaWJsZUluZGV4VmFsdWU7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcnMoZmlyZUNhbGxiYWNrOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyBnZXQgY3VycmVudEVycm9yQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIDA7IH1cclxuICAgIHB1YmxpYyBnZXQgaGFzVGl0bGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBoYXNJbnB1dCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbmRlcldpZHRoKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnJlbmRlcldpZHRoVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgcmVuZGVyV2lkdGgodmFsOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMucmVuZGVyV2lkdGgpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJlbmRlcldpZHRoVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJpZ2h0SW5kZW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnJpZ2h0SW5kZW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgcmlnaHRJbmRlbnQodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMucmlnaHRJbmRlbnQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnJpZ2h0SW5kZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZm9jdXMob25FcnJvcjogYm9vbGVhbiA9IGZhbHNlKSB7IH1cclxuICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXlEYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSAobmV3VmFsdWUgJiYgbmV3VmFsdWVbXCJxdWVzdGlvbkFkZGVkXCJdKSA/IDxJU3VydmV5Pm5ld1ZhbHVlIDogbnVsbDtcclxuICAgICAgICB0aGlzLm9uU2V0RGF0YSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGZpcmVDYWxsYmFjayhjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7IH1cclxuICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICBwdWJsaWMgcnVuQ29uZGl0aW9uKHZhbHVlczogSGFzaFRhYmxlPGFueT4pIHtcclxuICAgICAgICBpZiAoIXRoaXMudmlzaWJsZUlmKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbmRpdGlvblJ1bm5lcikgdGhpcy5jb25kaXRpb25SdW5uZXIgPSBuZXcgQ29uZGl0aW9uUnVubmVyKHRoaXMudmlzaWJsZUlmKTtcclxuICAgICAgICB0aGlzLmNvbmRpdGlvblJ1bm5lci5leHByZXNzaW9uID0gdGhpcy52aXNpYmxlSWY7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jb25kaXRpb25SdW5uZXIucnVuKHZhbHVlcyk7XHJcbiAgICB9XHJcbiAgICAvL0lRdWVzdGlvblxyXG4gICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgfVxyXG4gICAgb25TdXJ2ZXlMb2FkKCkge1xyXG4gICAgfVxyXG4gICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uYmFzZVwiLCBbXCIhbmFtZVwiLCB7IG5hbWU6IFwidmlzaWJsZTpib29sZWFuXCIsIGRlZmF1bHQ6IHRydWUgfSwgXCJ2aXNpYmxlSWY6dGV4dFwiLFxyXG4gICAgeyBuYW1lOiBcIndpZHRoXCIgfSwgeyBuYW1lOiBcInN0YXJ0V2l0aE5ld0xpbmU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfSwge25hbWU6IFwiaW5kZW50Om51bWJlclwiLCBkZWZhdWx0OiAwLCBjaG9pY2VzOiBbMCwgMSwgMiwgM119XSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25iYXNlLnRzXG4gKiovIiwiZXhwb3J0IGNsYXNzIFRleHRQcmVQcm9jZXNzb3JJdGVtIHtcclxuICAgIHB1YmxpYyBzdGFydDogbnVtYmVyO1xyXG4gICAgcHVibGljIGVuZDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dFByZVByb2Nlc3NvciB7XHJcbiAgICBwdWJsaWMgb25Qcm9jZXNzOiAobmFtZTogc3RyaW5nKSA9PiBhbnk7XHJcbiAgICBwdWJsaWMgb25IYXNWYWx1ZTogKG5hbWU6IHN0cmluZykgPT4gYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBwdWJsaWMgcHJvY2Vzcyh0ZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGV4dCkgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9uUHJvY2VzcykgcmV0dXJuIHRleHQ7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5nZXRJdGVtcyh0ZXh0KTtcclxuICAgICAgICBmb3IgKHZhciBpID0gaXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5hbWUodGV4dC5zdWJzdHJpbmcoaXRlbS5zdGFydCArIDEsIGl0ZW0uZW5kKSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYW5Qcm9jZXNzTmFtZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uSGFzVmFsdWUgJiYgIXRoaXMub25IYXNWYWx1ZShuYW1lKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMub25Qcm9jZXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkgdmFsdWUgPSBcIlwiO1xyXG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHIoMCwgaXRlbS5zdGFydCkgKyB2YWx1ZSArIHRleHQuc3Vic3RyKGl0ZW0uZW5kICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRJdGVtcyh0ZXh0OiBzdHJpbmcpOiBBcnJheTxUZXh0UHJlUHJvY2Vzc29ySXRlbT4ge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0ZXh0Lmxlbmd0aDtcclxuICAgICAgICB2YXIgc3RhcnQgPSAtMTtcclxuICAgICAgICB2YXIgY2ggPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNoID0gdGV4dFtpXTtcclxuICAgICAgICAgICAgaWYgKGNoID09ICd7Jykgc3RhcnQgPSBpO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFRleHRQcmVQcm9jZXNzb3JJdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zdGFydCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbXM7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICByZXR1cm4gbmFtZS50cmltKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNhblByb2Nlc3NOYW1lKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2ggPSBuYW1lW2ldO1xyXG4gICAgICAgICAgICAvL1RPRE9cclxuICAgICAgICAgICAgaWYgKGNoID09ICcgJyB8fCBjaCA9PSAnLScgfHwgY2ggPT0gJyYnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdGV4dFByZVByb2Nlc3Nvci50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge0l0ZW1WYWx1ZSwgU3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0IHtDaG9pY2VzUmVzdGZ1bGx9IGZyb20gXCIuL2Nob2ljZXNSZXN0ZnVsbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uU2VsZWN0QmFzZSBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHByaXZhdGUgdmlzaWJsZUNob2ljZXNDYWNoZTogQXJyYXk8SXRlbVZhbHVlPiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNvbW1lbnRWYWx1ZTogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIGNhY2hlZFZhbHVlOiBhbnk7XHJcbiAgICBvdGhlckl0ZW06IEl0ZW1WYWx1ZSA9IG5ldyBJdGVtVmFsdWUoXCJvdGhlclwiLCBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSk7XHJcbiAgICBwcml2YXRlIGNob2ljZXNGcm9tVXJsOiBBcnJheTxJdGVtVmFsdWU+ID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2FjaGVkVmFsdWVGb3JVcmxSZXF1ZXN0aW9uOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjaG9pY2VzVmFsdWVzOiBBcnJheTxJdGVtVmFsdWU+ID0gbmV3IEFycmF5PEl0ZW1WYWx1ZT4oKTtcclxuICAgIHB1YmxpYyBjaG9pY2VzQnlVcmw6IENob2ljZXNSZXN0ZnVsbDtcclxuICAgIHB1YmxpYyBvdGhlckVycm9yVGV4dDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBzdG9yZU90aGVyc0FzQ29tbWVudDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBjaG9pY2VzT3JkZXJWYWx1ZTogc3RyaW5nID0gXCJub25lXCI7XHJcbiAgICBjaG9pY2VzQ2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzQnlVcmwgPSB0aGlzLmNyZWF0ZVJlc3RmdWxsKCk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc0J5VXJsLmdldFJlc3VsdENhbGxiYWNrID0gZnVuY3Rpb24gKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KSB7IHNlbGYub25Mb2FkQ2hvaWNlc0Zyb21VcmwoaXRlbXMpIH07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpID8gdGhpcy5nZXRIYXNPdGhlcih0aGlzLnZhbHVlKSA6IHRoaXMuZ2V0SGFzT3RoZXIodGhpcy5jYWNoZWRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SGFzT3RoZXIodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdmFsID09IHRoaXMub3RoZXJJdGVtLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJlc3RmdWxsKCk6IENob2ljZXNSZXN0ZnVsbCB7IHJldHVybiBuZXcgQ2hvaWNlc1Jlc3RmdWxsKCk7IH1cclxuICAgIHByb3RlY3RlZCBnZXRDb21tZW50KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLmdldENvbW1lbnQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21tZW50VmFsdWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU2V0dGluZ0NvbW1lbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBzZXRDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKVxyXG4gICAgICAgICAgICBzdXBlci5zZXRDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2V0dGluZ0NvbW1lbnQgJiYgbmV3VmFsdWUgIT0gdGhpcy5jb21tZW50VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZXR0aW5nQ29tbWVudCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnRWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdGhlclNlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZUluRGF0YSh0aGlzLmNhY2hlZFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTZXR0aW5nQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUpIHRoaXMuY2FjaGVkVmFsdWVGb3JVcmxSZXF1ZXN0aW9uID0gbmV3VmFsdWU7ICAgICAgICBcclxuICAgICAgICBzdXBlci5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVGcm9tRGF0YSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0U3RvcmVPdGhlcnNBc0NvbW1lbnQoKSkgcmV0dXJuIHN1cGVyLnZhbHVlRnJvbURhdGEodmFsKTtcclxuICAgICAgICB0aGlzLmNhY2hlZFZhbHVlID0gdGhpcy52YWx1ZUZyb21EYXRhQ29yZSh2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5nZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpKSByZXR1cm4gc3VwZXIudmFsdWVUb0RhdGEodmFsKTtcclxuICAgICAgICB0aGlzLmNhY2hlZFZhbHVlID0gdmFsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlVG9EYXRhQ29yZSh2YWwpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzVW5rbm93blZhbHVlKHZhbCkpIHJldHVybiB2YWw7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSkgcmV0dXJuIHZhbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnQgPSB2YWw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3RoZXJJdGVtLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlVG9EYXRhQ29yZSh2YWw6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSB0aGlzLm90aGVySXRlbS52YWx1ZSAmJiB0aGlzLmdldENvbW1lbnQoKSkge1xyXG4gICAgICAgICAgICB2YWwgPSB0aGlzLmdldENvbW1lbnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBoYXNVbmtub3duVmFsdWUodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuYWN0aXZlQ2hvaWNlcztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS52YWx1ZSA9PSB2YWwpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlczsgfVxyXG4gICAgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNob2ljZXNDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgaGFzT3RoZXJDaGFuZ2VkKCkge1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hvaWNlc0NoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIGdldCBjaG9pY2VzT3JkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2hvaWNlc09yZGVyVmFsdWU7IH1cclxuICAgIHNldCBjaG9pY2VzT3JkZXIobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSB0aGlzLmNob2ljZXNPcmRlclZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hvaWNlc0NoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIGdldCBvdGhlclRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3RoZXJJdGVtLnRleHQ7IH1cclxuICAgIHNldCBvdGhlclRleHQodmFsdWU6IHN0cmluZykgeyB0aGlzLm90aGVySXRlbS50ZXh0ID0gdmFsdWU7IH1cclxuICAgIGdldCB2aXNpYmxlQ2hvaWNlcygpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzT3RoZXIgJiYgdGhpcy5jaG9pY2VzT3JkZXIgPT0gXCJub25lXCIpIHJldHVybiB0aGlzLmFjdGl2ZUNob2ljZXM7XHJcbiAgICAgICAgaWYoIXRoaXMudmlzaWJsZUNob2ljZXNDYWNoZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUgPSB0aGlzLnNvcnRWaXNpYmxlQ2hvaWNlcyh0aGlzLmFjdGl2ZUNob2ljZXMuc2xpY2UoKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUucHVzaCh0aGlzLm90aGVySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZUNob2ljZXNDYWNoZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0IGFjdGl2ZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7IHJldHVybiB0aGlzLmNob2ljZXNGcm9tVXJsID8gdGhpcy5jaG9pY2VzRnJvbVVybCA6IHRoaXMuY2hvaWNlczsgfVxyXG4gICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICghdGhpcy5pc090aGVyU2VsZWN0ZWQgfHwgdGhpcy5jb21tZW50KSByZXR1cm47XHJcbiAgICAgICAgdmFyIHRleHQgPSB0aGlzLm90aGVyRXJyb3JUZXh0O1xyXG4gICAgICAgIGlmICghdGV4dCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm90aGVyUmVxdWlyZWRFcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHRleHQpKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRTdG9yZU90aGVyc0FzQ29tbWVudCgpIHsgcmV0dXJuIHRoaXMuc3RvcmVPdGhlcnNBc0NvbW1lbnQgJiYgKHRoaXMuc3VydmV5ICE9IG51bGwgPyB0aGlzLnN1cnZleS5zdG9yZU90aGVyc0FzQ29tbWVudCA6IHRydWUpOyB9XHJcbiAgICBvblN1cnZleUxvYWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0J5VXJsKSB0aGlzLmNob2ljZXNCeVVybC5ydW4oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Mb2FkQ2hvaWNlc0Zyb21VcmwoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pIHtcclxuICAgICAgICB2YXIgZXJyb3JDb3VudCA9IHRoaXMuZXJyb3JzLmxlbmd0aDtcclxuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXNCeVVybCAmJiB0aGlzLmNob2ljZXNCeVVybC5lcnJvcikge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHRoaXMuY2hvaWNlc0J5VXJsLmVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVycm9yQ291bnQgPiAwIHx8IHRoaXMuZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5lcnJvcnNDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3Q2hvaWNlcyA9IG51bGw7XHJcbiAgICAgICAgaWYgKGFycmF5ICYmIGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbmV3Q2hvaWNlcyA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKG5ld0Nob2ljZXMsIGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzRnJvbVVybCA9IG5ld0Nob2ljZXM7XHJcbiAgICAgICAgdGhpcy5vblZpc2libGVDaG9pY2VzQ2hhbmdlZCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFZhbHVlRm9yVXJsUmVxdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5jYWNoZWRWYWx1ZUZvclVybFJlcXVlc3Rpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblZpc2libGVDaG9pY2VzQ2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLnZpc2libGVDaG9pY2VzQ2FjaGUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY2hvaWNlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNvcnRWaXNpYmxlQ2hvaWNlcyhhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgIHZhciBvcmRlciA9IHRoaXMuY2hvaWNlc09yZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKG9yZGVyID09IFwiYXNjXCIpIHJldHVybiB0aGlzLnNvcnRBcnJheShhcnJheSwgMSk7XHJcbiAgICAgICAgaWYgKG9yZGVyID09IFwiZGVzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIC0xKTtcclxuICAgICAgICBpZiAob3JkZXIgPT0gXCJyYW5kb21cIikgcmV0dXJuIHRoaXMucmFuZG9taXplQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc29ydEFycmF5KGFycmF5OiBBcnJheTxJdGVtVmFsdWU+LCBtdWx0OiBudW1iZXIpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICByZXR1cm4gYXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICBpZiAoYS50ZXh0IDwgYi50ZXh0KSByZXR1cm4gLTEgKiBtdWx0O1xyXG4gICAgICAgICAgICBpZiAoYS50ZXh0ID4gYi50ZXh0KSByZXR1cm4gMSAqIG11bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByYW5kb21pemVBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIHZhciBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgIGFycmF5W2ldID0gYXJyYXlbal07XHJcbiAgICAgICAgICAgIGFycmF5W2pdID0gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveEJhc2UgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGNvbENvdW50KCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbENvdW50VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5jb2xDb3VudFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNlbGVjdGJhc2VcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLFxyXG4gICAgeyBuYW1lOiBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH19LFxyXG4gICAgeyBuYW1lOiBcImNob2ljZXNPcmRlclwiLCBkZWZhdWx0OiBcIm5vbmVcIiwgY2hvaWNlczogW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl0gfSxcclxuICAgIHsgbmFtZTogXCJjaG9pY2VzQnlVcmw6cmVzdGZ1bGxcIiwgY2xhc3NOYW1lOiBcIkNob2ljZXNSZXN0ZnVsbFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5jaG9pY2VzQnlVcmwuaXNFbXB0eSA/IG51bGwgOiBvYmouY2hvaWNlc0J5VXJsOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNob2ljZXNCeVVybC5zZXREYXRhKHZhbHVlKTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcIm90aGVyVGV4dFwiLCBkZWZhdWx0OiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3RoZXJJdGVtVGV4dFwiKSB9LCBcIm90aGVyRXJyb3JUZXh0XCIsXHJcbiAgICB7IG5hbWU6IFwic3RvcmVPdGhlcnNBc0NvbW1lbnQ6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfV0sIG51bGwsIFwicXVlc3Rpb25cIik7XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hiYXNlXCIsIFt7IG5hbWU6IFwiY29sQ291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDEsIGNob2ljZXM6IFswLCAxLCAyLCAzLCA0XSB9XSwgbnVsbCwgXCJzZWxlY3RiYXNlXCIpO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSAnLi9xdWVzdGlvbmJhc2UnO1xyXG5pbXBvcnQge0hhc2hUYWJsZX0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEluc3RhbmNlOiBRdWVzdGlvbkZhY3RvcnkgPSBuZXcgUXVlc3Rpb25GYWN0b3J5KCk7XHJcbiAgICBwdWJsaWMgc3RhdGljIERlZmF1bHRDaG9pY2VzID0gW1wib25lXCIsIFwidHdvfHNlY29uZCB2YWx1ZVwiLCBcInRocmVlfHRoaXJkIHZhbHVlXCJdO1xyXG4gICAgcHJpdmF0ZSBjcmVhdG9ySGFzaDogSGFzaFRhYmxlPChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uQmFzZT4gPSB7fTtcclxuXHJcbiAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV0gPSBxdWVzdGlvbkNyZWF0b3I7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0QWxsVHlwZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gdGhpcy5jcmVhdG9ySGFzaCkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gY3JlYXRvcihuYW1lKTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uZmFjdG9yeS50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSxcclxuICAgIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLFxyXG4gICAgSU1hdHJpeERyb3Bkb3duRGF0YVxyXG59IGZyb20gXCIuL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duYmFzZVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtJdGVtVmFsdWV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBkYXRhOiBJTWF0cml4RHJvcGRvd25EYXRhLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoZGF0YSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByb3dOYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lOyB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgIHByaXZhdGUgcm93c1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25cIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLnJvd3NWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdlbmVyYXRlUm93cygpOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPigpO1xyXG4gICAgICAgIGlmICghdGhpcy5yb3dzIHx8IHRoaXMucm93cy5sZW5ndGggPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93blJvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeERyb3Bkb3duUm93TW9kZWwobmFtZSwgdGV4dCwgdGhpcywgdmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibWF0cml4ZHJvcGRvd25cIiwgW3sgbmFtZTogXCJyb3dzOml0ZW12YWx1ZXNcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucm93cyk7IH0sIG9uU2V0VmFsdWU6IGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9fV0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsKFwiXCIpOyB9LCBcIm1hdHJpeGRyb3Bkb3duYmFzZVwiKTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4ZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZSxcclxuICAgIE1hdHJpeERyb3Bkb3duUm93TW9kZWxCYXNlLCBJTWF0cml4RHJvcGRvd25EYXRhXHJcbn0gZnJvbSBcIi4vcXVlc3Rpb25fbWF0cml4ZHJvcGRvd25iYXNlXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtDdXN0b21FcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhEeW5hbWljUm93TW9kZWwgZXh0ZW5kcyBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5kZXg6IG51bWJlciwgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKGRhdGEsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcm93TmFtZSgpIHsgcmV0dXJuIFwicm93XCIgKyB0aGlzLmluZGV4OyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeER5bmFtaWNNb2RlbCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2UgaW1wbGVtZW50cyBJTWF0cml4RHJvcGRvd25EYXRhIHtcclxuICAgIHN0YXRpYyBNYXhSb3dDb3VudCA9IDEwMDtcclxuICAgIHByaXZhdGUgcm93Q291bnRlciA9IDA7XHJcbiAgICBwcml2YXRlIHJvd0NvdW50VmFsdWU6IG51bWJlciA9IDI7XHJcbiAgICBwcml2YXRlIGFkZFJvd1RleHRWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgcmVtb3ZlUm93VGV4dFZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIG1pblJvd0NvdW50ID0gMDtcclxuICAgIHB1YmxpYyByb3dDb3VudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4ZHluYW1pY1wiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCByb3dDb3VudCgpIHsgcmV0dXJuIHRoaXMucm93Q291bnRWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCByb3dDb3VudCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2YWwgPCAwIHx8IHZhbCA+IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsLk1heFJvd0NvdW50KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5yb3dDb3VudFZhbHVlID0gdmFsO1xyXG4gICAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoID4gdmFsKSB7XHJcbiAgICAgICAgICAgIHZhciBxVmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgcVZhbC5zcGxpY2UodmFsKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHFWYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucm93Q291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFJvdygpIHtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvd0NvdW50Kys7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVtb3ZlUm93KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucm93Q291bnQpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiBpbmRleCA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhbC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB2YWwgPSB0aGlzLmRlbGV0ZVJvd1ZhbHVlKHZhbCwgbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm93Q291bnQtLTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgYWRkUm93VGV4dCgpIHsgcmV0dXJuIHRoaXMuYWRkUm93VGV4dFZhbHVlID8gdGhpcy5hZGRSb3dUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiYWRkUm93XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGFkZFJvd1RleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYWRkUm93VGV4dFZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHJlbW92ZVJvd1RleHQoKSB7IHJldHVybiB0aGlzLnJlbW92ZVJvd1RleHRWYWx1ZSA/IHRoaXMucmVtb3ZlUm93VGV4dFZhbHVlIDogc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInJlbW92ZVJvd1wiKTsgfVxyXG4gICAgcHVibGljIHNldCByZW1vdmVSb3dUZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZVJvd1RleHRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyAgIHJldHVybiBmYWxzZTsgIH1cclxuICAgIHB1YmxpYyBnZXQgY2FjaGVkVmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbEJhc2U+IHtcclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cyAmJiB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aCA9PSB0aGlzLnJvd0NvdW50KSByZXR1cm4gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cztcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUm93cztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9ySW5Sb3dzKCkpIHtcclxuICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJtaW5Sb3dDb3VudEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWluUm93Q291bnQpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNFcnJvckluUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5taW5Sb3dDb3VudCA8PSAwIHx8ICF0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHJlcyA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBzZXRSb3dDb3VudCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgcm93SW5kZXggPSAwOyByb3dJbmRleCA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyByb3dJbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW3Jvd0luZGV4XTtcclxuICAgICAgICAgICAgaWYgKCFyb3cuaXNFbXB0eSkgc2V0Um93Q291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNldFJvd0NvdW50IDwgdGhpcy5taW5Sb3dDb3VudDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZW5lcmF0ZVJvd3MoKTogQXJyYXk8TWF0cml4RHluYW1pY1Jvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhEeW5hbWljUm93TW9kZWw+KCk7XHJcbiAgICAgICAgaWYgKHRoaXMucm93Q291bnQgPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuY3JlYXRlTmV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd0NvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3codGhpcy5nZXRSb3dWYWx1ZUJ5SW5kZXgodmFsLCBpKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyh2YWx1ZTogYW55KTogTWF0cml4RHluYW1pY1Jvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeER5bmFtaWNSb3dNb2RlbCh0aGlzLnJvd0NvdW50ZXIgKyssIHRoaXMsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkJlZm9yZVZhbHVlQ2hhbmdlZCh2YWw6IGFueSkge1xyXG4gICAgICAgIHZhciBuZXdSb3dDb3VudCA9IHZhbCAmJiBBcnJheS5pc0FycmF5KHZhbCkgPyB2YWwubGVuZ3RoIDogMDtcclxuICAgICAgICBpZiAobmV3Um93Q291bnQgPD0gdGhpcy5yb3dDb3VudCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucm93Q291bnRWYWx1ZSA9IG5ld1Jvd0NvdW50O1xyXG4gICAgICAgIGlmICh0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgPSB0aGlzLnZpc2libGVSb3dzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdWYWx1ZShjdXJWYWx1ZTogYW55KTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gY3VyVmFsdWU7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQpIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciByID0gW107XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPiB0aGlzLnJvd0NvdW50KSByZXN1bHQuc3BsaWNlKHRoaXMucm93Q291bnQgLSAxKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gcmVzdWx0Lmxlbmd0aDsgaSA8IHRoaXMucm93Q291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZGVsZXRlUm93VmFsdWUobmV3VmFsdWU6IGFueSwgcm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSk6IGFueSB7XHJcbiAgICAgICAgdmFyIGlzRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3VmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKG5ld1ZhbHVlW2ldKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXNFbXB0eSA/IG51bGwgOiBuZXdWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFJvd1ZhbHVlQnlJbmRleChxdWVzdGlvblZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgcXVlc3Rpb25WYWx1ZS5sZW5ndGggPyBxdWVzdGlvblZhbHVlW2luZGV4XSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Um93VmFsdWUocm93OiBNYXRyaXhEcm9wZG93blJvd01vZGVsQmFzZSwgcXVlc3Rpb25WYWx1ZTogYW55LCBjcmVhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Um93VmFsdWVCeUluZGV4KHF1ZXN0aW9uVmFsdWUsIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MuaW5kZXhPZihyb3cpKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGR5bmFtaWNcIiwgW3sgbmFtZTogXCJyb3dDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMiB9LCB7IG5hbWU6IFwibWluUm93Q291bnQ6bnVtYmVyXCIsIGRlZmF1bHQ6IDAgfSxcclxuICAgICAgICB7IG5hbWU6IFwiYWRkUm93VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5hZGRSb3dUZXh0VmFsdWU7IH0gfSxcclxuICAgICAgICB7IG5hbWU6IFwicmVtb3ZlUm93VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5yZW1vdmVSb3dUZXh0VmFsdWU7IH0gfV0sXHJcbiAgICBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWwoXCJcIik7IH0sIFwibWF0cml4ZHJvcGRvd25iYXNlXCIpO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkeW5hbWljXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pY01vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXhkeW5hbWljLnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBJdGVtVmFsdWV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7U3VydmV5RXJyb3J9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gJy4vc3VydmV5U3RyaW5ncyc7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERhdGEge1xyXG4gICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBNYXRyaXhSb3dNb2RlbCBleHRlbmRzIEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBkYXRhOiBJTWF0cml4RGF0YTtcclxuICAgIHByb3RlY3RlZCByb3dWYWx1ZTogYW55OyBcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMucm93VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMucm93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhKSB0aGlzLmRhdGEub25NYXRyaXhSb3dDaGFuZ2VkKHRoaXMpO1xyXG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU1hdHJpeERhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgIHByaXZhdGUgaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZWRWaXNpYmxlUm93czogQXJyYXk8TWF0cml4Um93TW9kZWw+O1xyXG4gICAgcHVibGljIGlzQWxsUm93UmVxdWlyZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibWF0cml4XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc1Jvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm93c1ZhbHVlLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcbiAgICBnZXQgY29sdW1ucygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY29sdW1uc1ZhbHVlOyB9XHJcbiAgICBzZXQgY29sdW1ucyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY29sdW1uc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICBzZXQgcm93cyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucm93c1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeFJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxNYXRyaXhSb3dNb2RlbD4oKTtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB0aGlzLm5hbWUgKyAnXycgKyB0aGlzLnJvd3NbaV0udmFsdWUudG9TdHJpbmcoKSwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyhudWxsLCBcIlwiLCB0aGlzLm5hbWUsIHZhbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gcmVzdWx0O1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHsgcmV0dXJuIHRoaXMuaGFzVmFsdWVzSW5BbGxSb3dzKCk7IH1cclxuICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9ySW5Sb3dzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInJlcXVpcmVkSW5BbGxSb3dzRXJyb3JcIikpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGhhc0Vycm9ySW5Sb3dzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FsbFJvd1JlcXVpcmVkKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuICF0aGlzLmhhc1ZhbHVlc0luQWxsUm93cygpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBoYXNWYWx1ZXNJbkFsbFJvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJvd3MgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzO1xyXG4gICAgICAgIGlmICghcm93cykgcm93cyA9IHRoaXMudmlzaWJsZVJvd3M7XHJcbiAgICAgICAgaWYgKCFyb3dzKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHJvd3NbaV0udmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgZnVsbE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeFJvd01vZGVsKG5hbWUsIHRleHQsIGZ1bGxOYW1lLCB0aGlzLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZyB8fCAhKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHx8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICBpZiAodGhpcy5yb3dzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbMF0udmFsdWUgPSB2YWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByb3dWYWwgPSB2YWxbcm93Lm5hbWVdID8gdmFsW3Jvdy5uYW1lXSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldLnZhbHVlID0gcm93VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLy9JTWF0cml4RGF0YVxyXG4gICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93TW9kZWwpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzUm93cykge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKHJvdy52YWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdWYWx1ZVtyb3cubmFtZV0gPSByb3cudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeFwiLCBbeyBuYW1lOiBcImNvbHVtbnM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jb2x1bW5zKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jb2x1bW5zID0gdmFsdWU7IH19LFxyXG4gICAgeyBuYW1lOiBcInJvd3M6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yb3dzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yb3dzID0gdmFsdWU7IH0gfSxcclxuICAgIFwiaXNBbGxSb3dSZXF1aXJlZDpib29sZWFuXCJdLCAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tYXRyaXgudHNcbiAqKi8iLCJpbXBvcnQge0Jhc2V9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlWYWxpZGF0b3IsIElWYWxpZGF0b3JPd25lciwgVmFsaWRhdG9yUnVubmVyfSBmcm9tIFwiLi92YWxpZGF0b3JcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtTdXJ2ZXlFcnJvcn0gZnJvbSBcIi4vYmFzZVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICBnZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbiAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTXVsdGlwbGVUZXh0SXRlbU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICBwcml2YXRlIGRhdGE6IElNdWx0aXBsZVRleHREYXRhO1xyXG4gICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+ID0gbmV3IEFycmF5PFN1cnZleVZhbGlkYXRvcj4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0aXRlbVwiO1xyXG4gICAgfVxyXG4gICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1RleHQ6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdUZXh0OyB9XHJcbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEgPyB0aGlzLmRhdGEuZ2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lKSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnNldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG9uVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgIH1cclxuICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgaXRlbVNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgcHJpdmF0ZSBpdGVtc1ZhbHVlczogQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPiA9IG5ldyBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+KCk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHNlbGYuZmlyZUNhbGxiYWNrKHNlbGYuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dFwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpdGVtcygpOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtTW9kZWw+IHsgcmV0dXJuIHRoaXMuaXRlbXNWYWx1ZXM7IH1cclxuICAgIHB1YmxpYyBzZXQgaXRlbXModmFsdWU6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4pIHtcclxuICAgICAgICB0aGlzLml0ZW1zVmFsdWVzID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb2xDb3VudENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkSXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlVGV4dEl0ZW0obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgIH1cclxuICAgIC8vVE9ETy1yZW1vdmUgbGF0ZXIuIERlbGF5IHJlbW92aW5nIGluIGNhc2Ugc29tZWJvZHkgdXNlIHRoaXMgZnVuY3Rpb24uXHJcbiAgICBwcml2YXRlIEFkZEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7IHJldHVybiB0aGlzLmFkZEl0ZW0obmFtZSwgdGl0bGUpOyB9XHJcbiAgICBzdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1zW2ldLnZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbENvdW50KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodmFsdWUgPCAxIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJvd3MoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgdmFyIGNvbENvdW50ID0gdGhpcy5jb2xDb3VudDtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLml0ZW1zO1xyXG4gICAgICAgIHZhciByb3dzID0gW107XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByb3dzLnB1c2goW10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvd3Nbcm93cy5sZW5ndGggLSAxXS5wdXNoKGl0ZW1zW2ldKTtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IGNvbENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJvd3M7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1WYWx1ZUNoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVUZXh0SXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcpOiBNdWx0aXBsZVRleHRJdGVtTW9kZWwge1xyXG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbU1vZGVsKG5hbWUsIHRpdGxlKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkl0ZW1WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiAodGhpcy5pdGVtc1tpXS5uYW1lIGluIHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pdGVtc1tpXS5vblZhbHVlQ2hhbmdlZChpdGVtVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBydW5WYWxpZGF0b3JzKCk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIC8vSU11bHRpcGxlVGV4dERhdGFcclxuICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbbmFtZV07XHJcbiAgICB9XHJcbiAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dGl0ZW1cIiwgW1wibmFtZVwiLCB7IG5hbWU6IFwidGl0bGVcIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInN1cnZleXZhbGlkYXRvclwiLCBjbGFzc05hbWVQYXJ0OiBcInZhbGlkYXRvclwiIH1dLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTXVsdGlwbGVUZXh0SXRlbU1vZGVsKFwiXCIpOyB9KTtcclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRcIiwgW3sgbmFtZTogXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIGNsYXNzTmFtZTogXCJtdWx0aXBsZXRleHRpdGVtXCIgfSxcclxuICAgICAgICB7IG5hbWU6IFwiaXRlbVNpemU6bnVtYmVyXCIsIGRlZmF1bHQ6IDI1IH0sIHsgbmFtZTogXCJjb2xDb3VudDpudW1iZXJcIiwgZGVmYXVsdDogMSwgY2hvaWNlczogWzEsIDIsIDMsIDRdIH1dLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsKG5hbWUpOyBxLmFkZEl0ZW0oXCJ0ZXh0MVwiKTsgcS5hZGRJdGVtKFwidGV4dDJcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9tdWx0aXBsZXRleHQudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtCYXNlLCBJUGFnZSwgSUNvbmRpdGlvblJ1bm5lciwgSVN1cnZleSwgSVF1ZXN0aW9uLCBIYXNoVGFibGUsIFN1cnZleUVsZW1lbnQsIFN1cnZleVBhZ2VJZH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q29uZGl0aW9uUnVubmVyfSBmcm9tIFwiLi9jb25kaXRpb25zXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblJvd01vZGVsIHtcclxuICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHBhZ2U6IFBhZ2VNb2RlbCwgcHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5yb3dWaXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUm93VmlzaWJpbGl0eUNoYW5nZWQoKTsgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IFtdO1xyXG4gICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgIHRoaXMub25WaXNpYmxlQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHVwZGF0ZVZpc2libGUoKSB7XHJcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdGhpcy5jYWxjVmlzaWJsZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0V2lkdGgoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHEpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmlzaWJsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjaykgdGhpcy52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0V2lkdGgoKSB7XHJcbiAgICAgICAgdmFyIHZpc0NvdW50ID0gdGhpcy5nZXRWaXNpYmxlQ291bnQoKTtcclxuICAgICAgICBpZiAodmlzQ291bnQgPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1F1ZXN0aW9uVmlzaWJsZSh0aGlzLnF1ZXN0aW9uc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLnJlbmRlcldpZHRoID0gdGhpcy5xdWVzdGlvbi53aWR0aCA/IHRoaXMucXVlc3Rpb24ud2lkdGggOiBNYXRoLmZsb29yKDEwMCAvIHZpc0NvdW50KSArICclJztcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zW2ldLnJpZ2h0SW5kZW50ID0gY291bnRlciA8IHZpc0NvdW50IC0gMSA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgY291bnRlcisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUm93VmlzaWJpbGl0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlLm9uUm93VmlzaWJpbGl0eUNoYW5nZWQodGhpcyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZpc2libGVDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciByZXMgPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNRdWVzdGlvblZpc2libGUodGhpcy5xdWVzdGlvbnNbaV0pKSByZXMrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNRdWVzdGlvblZpc2libGUocTogUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2UuaXNRdWVzdGlvblZpc2libGUocSk7IH1cclxuICAgIHByaXZhdGUgY2FsY1Zpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmdldFZpc2libGVDb3VudCgpID4gMDsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFnZU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElQYWdlLCBJQ29uZGl0aW9uUnVubmVyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIHBhZ2VDb3VudGVyID0gMTAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0UGFnZUlkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwic3BfXCIgKyBQYWdlTW9kZWwucGFnZUNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlkVmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcm93VmFsdWVzOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNvbmRpdGlvblJ1bm5lcjogQ29uZGl0aW9uUnVubmVyID0gbnVsbDtcclxuICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IG5ldyBBcnJheTxRdWVzdGlvbkJhc2U+KCk7XHJcbiAgICBwdWJsaWMgZGF0YTogSVN1cnZleSA9IG51bGw7XHJcbiAgICBwdWJsaWMgdmlzaWJsZUlmOiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgcHJpdmF0ZSBudW1WYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5pZFZhbHVlID0gUGFnZU1vZGVsLmdldFBhZ2VJZCgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmLmRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5pZFZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHJvd3MoKTogQXJyYXk8UXVlc3Rpb25Sb3dNb2RlbD4ge1xyXG4gICAgICAgIHRoaXMucm93VmFsdWVzID0gdGhpcy5idWlsZFJvd3MoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb3dWYWx1ZXM7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzQWN0aXZlKCkgeyByZXR1cm4gKCF0aGlzLmRhdGEpIHx8IHRoaXMuZGF0YS5jdXJyZW50UGFnZSA9PSB0aGlzOyB9XHJcbiAgICBwdWJsaWMgaXNRdWVzdGlvblZpc2libGUocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IGJvb2xlYW4geyByZXR1cm4gcXVlc3Rpb24udmlzaWJsZSB8fCB0aGlzLmlzRGVzaWduTW9kZTsgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVJvdyhxdWVzdGlvbjogUXVlc3Rpb25CYXNlKTogUXVlc3Rpb25Sb3dNb2RlbCB7IHJldHVybiBuZXcgUXVlc3Rpb25Sb3dNb2RlbCh0aGlzLCBxdWVzdGlvbik7IH1cclxuICAgIHByaXZhdGUgZ2V0IGlzRGVzaWduTW9kZSgpIHsgcmV0dXJuIHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEuaXNEZXNpZ25Nb2RlOyB9XHJcbiAgICBwcml2YXRlIGJ1aWxkUm93cygpOiBBcnJheTxRdWVzdGlvblJvd01vZGVsPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxRdWVzdGlvblJvd01vZGVsPigpO1xyXG4gICAgICAgIHZhciBsYXN0Um93VmlzaWJsZUluZGV4ID0gLTE7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHEgPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVSb3cocSkpO1xyXG4gICAgICAgICAgICBpZiAocS5zdGFydFdpdGhOZXdMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICBsYXN0Um93VmlzaWJsZUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtpXS5hZGRRdWVzdGlvbihxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXN0Um93VmlzaWJsZUluZGV4IDwgMCkgbGFzdFJvd1Zpc2libGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbbGFzdFJvd1Zpc2libGVJbmRleF0uYWRkUXVlc3Rpb24ocSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0W2ldLnNldFdpZHRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBvblJvd1Zpc2liaWxpdHlDaGFuZ2VkKHJvdzogUXVlc3Rpb25Sb3dNb2RlbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSB8fCAhdGhpcy5yb3dWYWx1ZXMpIHJldHVybjtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnJvd1ZhbHVlcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4OyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yb3dWYWx1ZXNbaV0ucXVlc3Rpb25zLmluZGV4T2Yocm93LnF1ZXN0aW9uKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJvd1ZhbHVlc1tpXS51cGRhdGVWaXNpYmxlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkVGl0bGUoKSB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5wcm9jZXNzVGV4dCh0aGlzLnRpdGxlKSA6IHRoaXMudGl0bGU7IH1cclxuICAgIHB1YmxpYyBnZXQgbnVtKCkgeyByZXR1cm4gdGhpcy5udW1WYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBudW0odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLm51bVZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5udW1WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub25OdW1DaGFuZ2VkKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMudmlzaWJsZVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS5wYWdlVmlzaWJpbGl0eUNoYW5nZWQodGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYWdlXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgaXNWaXNpYmxlKCk6IGJvb2xlYW4geyAgcmV0dXJuIHRoaXMuZ2V0SXNQYWdlVmlzaWJsZShudWxsKTsgfVxyXG4gICAgcHVibGljIGdldElzUGFnZVZpc2libGUoZXhjZXB0aW9uUXVlc3Rpb246IElRdWVzdGlvbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0gPT0gZXhjZXB0aW9uUXVlc3Rpb24pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSwgaW5kZXg6IG51bWJlciA9IC0xKSB7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDAsIHF1ZXN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLnNldERhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnF1ZXN0aW9uQWRkZWQocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkTmV3UXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHRoaXMuZGF0YS5xdWVzdGlvblJlbW92ZWQocXVlc3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzRmlyc3RRdWVzdGlvbigpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUgfHwgIXF1ZXN0aW9uLmhhc0lucHV0KSBjb250aW51ZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnNbaV0uZm9jdXMoKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGZvY3VzRmlyc3RFcnJvclF1ZXN0aW9uKCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlIHx8IHRoaXMucXVlc3Rpb25zW2ldLmN1cnJlbnRFcnJvckNvdW50ID09IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uc1tpXS5mb2N1cyh0cnVlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNjcm9sbFRvVG9wKCkge1xyXG4gICAgICAgIFN1cnZleUVsZW1lbnQuU2Nyb2xsRWxlbWVudFRvVG9wKFN1cnZleVBhZ2VJZCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3JzKGZpcmVDYWxsYmFjazogYm9vbGVhbiA9IHRydWUsIGZvY3VzZU9uRmlyc3RFcnJvcjogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBmaXJzdEVycm9yUXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUgJiYgdGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKGZpcmVDYWxsYmFjaykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChmb2N1c2VPbkZpcnN0RXJyb3IgJiYgZmlyc3RFcnJvclF1ZXN0aW9uID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdEVycm9yUXVlc3Rpb24gPSB0aGlzLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpcnN0RXJyb3JRdWVzdGlvbikgZmlyc3RFcnJvclF1ZXN0aW9uLmZvY3VzKHRydWUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkUXVlc3Rpb25zVG9MaXN0KGxpc3Q6IEFycmF5PElRdWVzdGlvbj4sIHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsaXN0LnB1c2godGhpcy5xdWVzdGlvbnNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBydW5Db25kaXRpb24odmFsdWVzOiBIYXNoVGFibGU8YW55Pikge1xyXG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlSWYpIHJldHVybjtcclxuICAgICAgICBpZiAoIXRoaXMuY29uZGl0aW9uUnVubmVyKSB0aGlzLmNvbmRpdGlvblJ1bm5lciA9IG5ldyBDb25kaXRpb25SdW5uZXIodGhpcy52aXNpYmxlSWYpO1xyXG4gICAgICAgIHRoaXMuY29uZGl0aW9uUnVubmVyLmV4cHJlc3Npb24gPSB0aGlzLnZpc2libGVJZjtcclxuICAgICAgICB0aGlzLnZpc2libGUgPSB0aGlzLmNvbmRpdGlvblJ1bm5lci5ydW4odmFsdWVzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbk51bUNoYW5nZWQodmFsdWU6IG51bWJlcikge1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYWdlXCIsIFtcIm5hbWVcIiwgeyBuYW1lOiBcInF1ZXN0aW9uc1wiLCBiYXNlQ2xhc3NOYW1lOiBcInF1ZXN0aW9uXCIgfSwgeyBuYW1lOiBcInZpc2libGU6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwidmlzaWJsZUlmXCIsIFwidGl0bGVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlTW9kZWwoKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcGFnZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25DaGVja2JveEJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SGFzT3RoZXIodmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHZhbC5pbmRleE9mKHRoaXMub3RoZXJJdGVtLnZhbHVlKSA+PSAwO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHZhbHVlRnJvbURhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhQXJyYXkuaXNBcnJheSh2YWwpKSByZXR1cm4gdmFsO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSByZXR1cm4gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNVbmtub3duVmFsdWUodmFsW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50ID0gdmFsW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IHZhbC5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3VmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdmFsdWVUb0RhdGFDb3JlKHZhbDogYW55KTogYW55IHtcclxuICAgICAgICBpZiAoIXZhbCB8fCAhdmFsLmxlbmd0aCkgcmV0dXJuIHZhbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodmFsW2ldID09IHRoaXMub3RoZXJJdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRDb21tZW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmV3VmFsID0gdmFsLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsW2ldID0gdGhpcy5nZXRDb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJjaGVja2JveFwiO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaGVja2JveFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ2hlY2tib3hNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9jaGVja2JveC50c1xuICoqLyIsImltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICBwdWJsaWMgcm93czogbnVtYmVyID0gNDtcclxuICAgIHB1YmxpYyBjb2xzOiBudW1iZXIgPSA1MDtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiY29tbWVudFwiO1xyXG4gICAgfVxyXG4gICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuaXNFbXB0eSgpIHx8IHRoaXMudmFsdWUgPT0gXCJcIjtcclxuICAgIH1cclxufVxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tbWVudFwiLCBbeyBuYW1lOiBcImNvbHM6bnVtYmVyXCIsIGRlZmF1bHQ6IDUwIH0sIHsgbmFtZTogXCJyb3dzOm51bWJlclwiLCBkZWZhdWx0OiA0IH1dLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50TW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKG5hbWUpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9jb21tZW50LnRzXG4gKiovIiwiaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvblNlbGVjdEJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zQ2FwdGlvblZhbHVlOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCkgeyByZXR1cm4gKHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSkgPyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3B0aW9uc0NhcHRpb25cIik7IH1cclxuICAgIHB1YmxpYyBzZXQgb3B0aW9uc0NhcHRpb24obmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJkcm9wZG93blwiO1xyXG4gICAgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbn1cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImRyb3Bkb3duXCIsIFt7IG5hbWU6IFwib3B0aW9uc0NhcHRpb25cIiwgb25HZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoub3B0aW9uc0NhcHRpb25WYWx1ZTsgfX1dLFxyXG4gICAgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbChcIlwiKTsgfSwgXCJzZWxlY3RiYXNlXCIpO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uRHJvcGRvd25Nb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fZHJvcGRvd24udHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge1N1cnZleUVycm9yfSBmcm9tIFwiLi9iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3IsIEV4Y2VlZFNpemVFcnJvcn0gZnJvbSBcIi4vZXJyb3JcIjtcclxuaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkZpbGVNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHByaXZhdGUgc2hvd1ByZXZpZXdWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBpc1VwbG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgaW1hZ2VIZWlnaHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyBpbWFnZVdpZHRoOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc3RvcmVEYXRhQXNUZXh0OiBib29sZWFuO1xyXG4gICAgcHVibGljIG1heFNpemU6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwiZmlsZVwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzaG93UHJldmlldygpIHsgcmV0dXJuIHRoaXMuc2hvd1ByZXZpZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93UHJldmlldyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnNob3dQcmV2aWV3VmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGxvYWRGaWxlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ICYmICF0aGlzLnN1cnZleS51cGxvYWRGaWxlKHRoaXMubmFtZSwgZmlsZSwgdGhpcy5zdG9yZURhdGFBc1RleHQsIGZ1bmN0aW9uIChzdGF0dXM6IHN0cmluZykgeyBzZWxmLmlzVXBsb2FkaW5nID0gc3RhdHVzID09IFwidXBsb2FkaW5nXCI7ICB9KSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2V0RmlsZVZhbHVlKGZpbGUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHByZXZpZXdWYWx1ZTogYW55O1xyXG4gICAgcHJvdGVjdGVkIHNldEZpbGVWYWx1ZShmaWxlOiBGaWxlKSB7XHJcbiAgICAgICAgaWYgKCFGaWxlUmVhZGVyKSByZXR1cm47XHJcbiAgICAgICAgaWYgKCF0aGlzLnNob3dQcmV2aWV3ICYmICF0aGlzLnN0b3JlRGF0YUFzVGV4dCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrRmlsZUZvckVycm9ycyhmaWxlKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5zaG93UHJldmlldykge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5wcmV2aWV3VmFsdWUgPSBzZWxmLmlzRmlsZUltYWdlKGZpbGUpID8gZmlsZVJlYWRlci5yZXN1bHQgOiBudWxsO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5maXJlQ2FsbGJhY2soc2VsZi5wcmV2aWV3VmFsdWVMb2FkZWRDYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGYuc3RvcmVEYXRhQXNUZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gZmlsZVJlYWRlci5yZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICBzdXBlci5vbkNoZWNrRm9yRXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNVcGxvYWRpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQ3VzdG9tRXJyb3Ioc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInVwbG9hZGluZ0ZpbGVcIikpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrRmlsZUZvckVycm9ycyhmaWxlOiBGaWxlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIGVycm9yTGVuZ3RoID0gdGhpcy5lcnJvcnMgPyB0aGlzLmVycm9ycy5sZW5ndGggOiAwO1xyXG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMubWF4U2l6ZSA+IDAgJiYgZmlsZS5zaXplID4gdGhpcy5tYXhTaXplKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEV4Y2VlZFNpemVFcnJvcih0aGlzLm1heFNpemUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCB0aGlzLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzRmlsZUltYWdlKGZpbGU6IEZpbGUpIHtcclxuICAgICAgICBpZiAoIWZpbGUgfHwgIWZpbGUudHlwZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBzdHIgPSBmaWxlLnR5cGUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICByZXR1cm4gc3RyLmluZGV4T2YoXCJpbWFnZVwiKSA9PSAwO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJmaWxlXCIsIFtcInNob3dQcmV2aWV3OmJvb2xlYW5cIiwgXCJpbWFnZUhlaWdodFwiLCBcImltYWdlV2lkdGhcIiwgXCJzdG9yZURhdGFBc1RleHQ6Ym9vbGVhblwiLCBcIm1heFNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25GaWxlTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZmlsZVwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uRmlsZU1vZGVsKG5hbWUpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9maWxlLnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbkJhc2V9IGZyb20gXCIuL3F1ZXN0aW9uYmFzZVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uSHRtbE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25CYXNlIHtcclxuICAgIHByaXZhdGUgaHRtbFZhbHVlOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcImh0bWxcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaHRtbCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5odG1sVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgaHRtbCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5odG1sVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkSHRtbCgpIHsgcmV0dXJuIHRoaXMuc3VydmV5ID8gdGhpcy5zdXJ2ZXkucHJvY2Vzc0h0bWwodGhpcy5odG1sKSA6IHRoaXMuaHRtbDsgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJodG1sXCIsIFtcImh0bWw6aHRtbFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uYmFzZVwiKTtcclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJodG1sXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25IdG1sTW9kZWwobmFtZSk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX2h0bWwudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQ2hlY2tib3hCYXNlfSBmcm9tIFwiLi9xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcInJhZGlvZ3JvdXBcIjtcclxuICAgIH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmFkaW9ncm91cFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTt9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9xdWVzdGlvbl9yYWRpb2dyb3VwLnRzXG4gKiovIiwiaW1wb3J0IHtJdGVtVmFsdWV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZ01vZGVsIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgc3RhdGljIGRlZmF1bHRSYXRlVmFsdWVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSByYXRlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgIHB1YmxpYyBtaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIG1heGltdW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgcmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICB9XHJcbiAgICBnZXQgcmF0ZVZhbHVlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucmF0ZXM7IH1cclxuICAgIHNldCByYXRlVmFsdWVzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yYXRlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMucmF0ZVZhbHVlc0NoYW5nZWRDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBnZXQgdmlzaWJsZVJhdGVWYWx1ZXMoKTogSXRlbVZhbHVlW10ge1xyXG4gICAgICAgIGlmICh0aGlzLnJhdGVWYWx1ZXMubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMucmF0ZVZhbHVlcztcclxuICAgICAgICByZXR1cm4gUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFwicmF0aW5nXCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgc3VwcG9ydEdvTmV4dFBhZ2VBdXRvbWF0aWMoKSB7IHJldHVybiB0cnVlOyB9XHJcbn1cclxuSXRlbVZhbHVlLnNldERhdGEoUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcywgWzEsIDIsIDMsIDQsIDVdKTtcclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhdGluZ1wiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgeyBuYW1lOiBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yYXRlVmFsdWVzKTsgfSwgb25TZXRWYWx1ZTogZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yYXRlVmFsdWVzID0gdmFsdWU7IH19LFxyXG4gICAgXCJtaW5pbnVtUmF0ZURlc2NyaXB0aW9uXCIsIFwibWF4aW11bVJhdGVEZXNjcmlwdGlvblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmdNb2RlbChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvcXVlc3Rpb25fcmF0aW5nLnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4vcXVlc3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHRNb2RlbCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgIHB1YmxpYyBzaXplOiBudW1iZXIgPSAyNTtcclxuICAgIHB1YmxpYyBpbnB1dFR5cGU6IHN0cmluZyA9IFwidGV4dFwiO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gXCJ0ZXh0XCI7XHJcbiAgICB9XHJcbiAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7IH1cclxuICAgIHN1cHBvcnRHb05leHRQYWdlQXV0b21hdGljKCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIHNldE5ld1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuY29ycmVjdFZhbHVlVHlwZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgc3VwZXIuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNvcnJlY3RWYWx1ZVR5cGUobmV3VmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSkgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlucHV0VHlwZSA9PSBcIm51bWJlclwiIHx8IHRoaXMuaW5wdXRUeXBlID09IFwicmFuZ2VcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc051bWJlcihuZXdWYWx1ZSkgPyBwYXJzZUZsb2F0KG5ld1ZhbHVlKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0XCIsIFt7IG5hbWU6IFwiaW5wdXRUeXBlXCIsIGRlZmF1bHQ6IFwidGV4dFwiLCBjaG9pY2VzOiBbXCJjb2xvclwiLCBcImRhdGVcIiwgXCJkYXRldGltZVwiLCBcImRhdGV0aW1lLWxvY2FsXCIsIFwiZW1haWxcIiwgXCJtb250aFwiLCBcIm51bWJlclwiLCBcInBhc3N3b3JkXCIsIFwicmFuZ2VcIiwgXCJ0ZWxcIiwgXCJ0ZXh0XCIsIFwidGltZVwiLCBcInVybFwiLCBcIndlZWtcIl0gfSxcclxuICAgIHsgbmFtZTogXCJzaXplOm51bWJlclwiLCBkZWZhdWx0OiAyNSB9XSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJ0ZXh0XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0TW9kZWwobmFtZSk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3F1ZXN0aW9uX3RleHQudHNcbiAqKi8iLCJpbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtCYXNlLCBJU3VydmV5LCBIYXNoVGFibGUsIElRdWVzdGlvbiwgSUNvbmRpdGlvblJ1bm5lciwgSVBhZ2UsIFN1cnZleUVycm9yLCBFdmVudH0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge0lTdXJ2ZXlUcmlnZ2VyT3duZXIsIFN1cnZleVRyaWdnZXJ9IGZyb20gXCIuL3RyaWdnZXJcIjtcclxuaW1wb3J0IHtQYWdlTW9kZWx9IGZyb20gXCIuL3BhZ2VcIjtcclxuaW1wb3J0IHtUZXh0UHJlUHJvY2Vzc29yfSBmcm9tIFwiLi90ZXh0UHJlUHJvY2Vzc29yXCI7XHJcbmltcG9ydCB7UHJvY2Vzc1ZhbHVlfSBmcm9tIFwiLi9jb25kaXRpb25Qcm9jZXNzVmFsdWVcIjtcclxuaW1wb3J0IHtkeFN1cnZleVNlcnZpY2V9IGZyb20gXCIuL2R4U3VydmV5U2VydmljZVwiO1xyXG5pbXBvcnQge0pzb25FcnJvcn0gZnJvbSBcIi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4vc3VydmV5U3RyaW5nc1wiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25iYXNlXCI7XHJcbmltcG9ydCB7Q3VzdG9tRXJyb3J9IGZyb20gXCIuL2Vycm9yXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5TW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVN1cnZleSwgSVN1cnZleVRyaWdnZXJPd25lciB7XHJcbiAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGNsaWVudElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIGNvb2tpZU5hbWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgY29tbWVudFByZWZpeDogc3RyaW5nID0gXCItQ29tbWVudFwiO1xyXG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIGZvY3VzRmlyc3RRdWVzdGlvbkF1dG9tYXRpYzogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwdWJsaWMgc2hvd05hdmlnYXRpb25CdXR0b25zOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBzaG93VGl0bGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBjb21wbGV0ZWRIdG1sOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHJlcXVpcmVkVGV4dDogc3RyaW5nID0gXCIqXCI7XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25TdGFydEluZGV4OiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHVibGljIHF1ZXN0aW9uVGl0bGVUZW1wbGF0ZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHB1YmxpYyBzaG93UHJvZ3Jlc3NCYXI6IHN0cmluZyA9IFwib2ZmXCI7XHJcbiAgICBwdWJsaWMgc3RvcmVPdGhlcnNBc0NvbW1lbnQ6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHVibGljIGdvTmV4dFBhZ2VBdXRvbWF0aWM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBwYWdlczogQXJyYXk8UGFnZU1vZGVsPiA9IG5ldyBBcnJheTxQYWdlTW9kZWw+KCk7XHJcbiAgICBwdWJsaWMgdHJpZ2dlcnM6IEFycmF5PFN1cnZleVRyaWdnZXI+ID0gbmV3IEFycmF5PFN1cnZleVRyaWdnZXI+KCk7XHJcbiAgICBwdWJsaWMgY2xlYXJJbnZpc2libGVWYWx1ZXM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgY3VycmVudFBhZ2VWYWx1ZTogUGFnZU1vZGVsID0gbnVsbDtcclxuICAgIHByaXZhdGUgdmFsdWVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgdmFyaWFibGVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgIHByaXZhdGUgcGFnZVByZXZUZXh0VmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgcGFnZU5leHRUZXh0VmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgY29tcGxldGVUZXh0VmFsdWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgc2hvd1BhZ2VOdW1iZXJzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOiBzdHJpbmcgPSBcIm9uXCI7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlOiBzdHJpbmcgPSBcInRvcFwiO1xyXG4gICAgcHJpdmF0ZSBsb2NhbGVWYWx1ZTogc3RyaW5nID0gXCJcIjtcclxuICAgIHByaXZhdGUgaXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIHByb2Nlc3NlZFRleHRWYWx1ZXM6IEhhc2hUYWJsZTxhbnk+ID0ge307XHJcbiAgICBwcml2YXRlIHRleHRQcmVQcm9jZXNzb3I6IFRleHRQcmVQcm9jZXNzb3I7XHJcbiAgICBwcml2YXRlIGlzVmFsaWRhdGluZ09uU2VydmVyVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgbW9kZVZhbHVlOiBzdHJpbmcgPSBcImVkaXRcIjtcclxuICAgIHByaXZhdGUgaXNEZXNpZ25Nb2RlVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgb25Db21wbGV0ZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25QYXJ0aWFsU2VuZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25DdXJyZW50UGFnZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uVmlzaWJsZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblBhZ2VWaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uUXVlc3Rpb25BZGRlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uUXVlc3Rpb25SZW1vdmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICBwdWJsaWMgb25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9uczogKHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55O1xyXG4gICAgcHVibGljIG9uUHJvY2Vzc0h0bWw6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvblNlbmRSZXN1bHQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHB1YmxpYyBvbkdldFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uVXBsb2FkRmlsZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIGpzb25FcnJvcnM6IEFycmF5PEpzb25FcnJvcj4gPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnRleHRQcmVQcm9jZXNzb3IgPSBuZXcgVGV4dFByZVByb2Nlc3NvcigpO1xyXG4gICAgICAgIHRoaXMudGV4dFByZVByb2Nlc3Nvci5vbkhhc1ZhbHVlID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZykgeyByZXR1cm4gc2VsZi5oYXNQcm9jZXNzZWRUZXh0VmFsdWUobmFtZSk7IH07XHJcbiAgICAgICAgdGhpcy50ZXh0UHJlUHJvY2Vzc29yLm9uUHJvY2VzcyA9IGZ1bmN0aW9uIChuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIHNlbGYuZ2V0UHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWUpOyB9O1xyXG4gICAgICAgIHRoaXMucGFnZXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB2YWx1ZS5kYXRhID0gc2VsZjtcclxuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy50cmlnZ2Vycy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhbHVlLnNldE93bmVyKHNlbGYpO1xyXG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVByb2Nlc3NlZFRleHRWYWx1ZXMoKTtcclxuICAgICAgICB0aGlzLm9uQmVmb3JlQ3JlYXRpbmcoKTtcclxuICAgICAgICBpZiAoanNvbk9iaikge1xyXG4gICAgICAgICAgICB0aGlzLnNldEpzb25PYmplY3QoanNvbk9iaik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleUlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRTdXJ2ZXlGcm9tU2VydmljZSh0aGlzLnN1cnZleUlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInN1cnZleVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGxvY2FsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NhbGVWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBsb2NhbGUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMubG9jYWxlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBzdXJ2ZXlMb2NhbGl6YXRpb24uY3VycmVudExvY2FsZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldExvY1N0cmluZyhzdHI6IHN0cmluZykgeyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhzdHIpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGVtcHR5U3VydmV5VGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJlbXB0eVN1cnZleVwiKTsgfVxyXG4gICAgcHVibGljIGdldCBwYWdlUHJldlRleHQoKSB7IHJldHVybiAodGhpcy5wYWdlUHJldlRleHRWYWx1ZSkgPyB0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlIDogdGhpcy5nZXRMb2NTdHJpbmcoXCJwYWdlUHJldlRleHRcIik7IH1cclxuICAgIHB1YmxpYyBzZXQgcGFnZVByZXZUZXh0KG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy5wYWdlUHJldlRleHRWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHBhZ2VOZXh0VGV4dCgpIHsgcmV0dXJuICh0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlKSA/IHRoaXMucGFnZU5leHRUZXh0VmFsdWUgOiB0aGlzLmdldExvY1N0cmluZyhcInBhZ2VOZXh0VGV4dFwiKTsgfVxyXG4gICAgcHVibGljIHNldCBwYWdlTmV4dFRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgY29tcGxldGVUZXh0KCkgeyByZXR1cm4gKHRoaXMuY29tcGxldGVUZXh0VmFsdWUpID8gdGhpcy5jb21wbGV0ZVRleHRWYWx1ZSA6IHRoaXMuZ2V0TG9jU3RyaW5nKFwiY29tcGxldGVUZXh0XCIpOyB9XHJcbiAgICBwdWJsaWMgc2V0IGNvbXBsZXRlVGV4dChuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMuY29tcGxldGVUZXh0VmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBzaG93UGFnZU51bWJlcnMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnNob3dQYWdlTnVtYmVyc1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHNob3dQYWdlTnVtYmVycyh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zaG93UGFnZU51bWJlcnMpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNob3dQYWdlTnVtYmVyc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzaG93UXVlc3Rpb25OdW1iZXJzKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZTsgfTtcclxuICAgIHB1YmxpYyBzZXQgc2hvd1F1ZXN0aW9uTnVtYmVycyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnMpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgIH07XHJcbiAgICBwdWJsaWMgZ2V0IHByb2Nlc3NlZFRpdGxlKCkgeyByZXR1cm4gdGhpcy5wcm9jZXNzVGV4dCh0aGlzLnRpdGxlKTsgfVxyXG4gICAgcHVibGljIGdldCBxdWVzdGlvblRpdGxlTG9jYXRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMucXVlc3Rpb25UaXRsZUxvY2F0aW9uVmFsdWU7IH07XHJcbiAgICBwdWJsaWMgc2V0IHF1ZXN0aW9uVGl0bGVMb2NhdGlvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLnF1ZXN0aW9uVGl0bGVMb2NhdGlvblZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblRpdGxlTG9jYXRpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgfTtcclxuICAgIHB1YmxpYyBnZXQgbW9kZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5tb2RlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgbW9kZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IHRoaXMubW9kZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh2YWx1ZSAhPSBcImVkaXRcIiAmJiB2YWx1ZSAhPSBcImRpc3BsYXlcIikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMubW9kZVZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBkYXRhKGRhdGE6IGFueSkge1xyXG4gICAgICAgIHRoaXMudmFsdWVzSGFzaCA9IHt9O1xyXG4gICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hba2V5XSA9IGRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhrZXksIGRhdGFba2V5XSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnMoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5jb21tZW50UHJlZml4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZU1vZGVsPiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNEZXNpZ25Nb2RlKSByZXR1cm4gdGhpcy5wYWdlcztcclxuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2VNb2RlbD4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0uaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhZ2VzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgcHVibGljIGdldCBQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHZpc2libGVQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdlBhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2VNb2RlbCkge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2UGFnZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjdXJyZW50UGFnZU5vKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IGN1cnJlbnRQYWdlTm8odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID49IHRoaXMudmlzaWJsZVBhZ2VzLmxlbmd0aCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnZpc2libGVQYWdlc1t2YWx1ZV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZm9jdXNGaXJzdFF1ZXN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlLnNjcm9sbFRvVG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZS5mb2N1c0ZpcnN0UXVlc3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkaW5nKSByZXR1cm4gXCJsb2FkaW5nXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNDb21wbGV0ZWQpIHJldHVybiBcImNvbXBsZXRlZFwiO1xyXG4gICAgICAgIHJldHVybiAodGhpcy5jdXJyZW50UGFnZSkgPyBcInJ1bm5pbmdcIiA6IFwiZW1wdHlcIlxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsZWFyKGNsZWFyRGF0YTogYm9vbGVhbiA9IHRydWUsIGdvdG9GaXJzdFBhZ2U6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKGNsZWFyRGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc0hhc2ggPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0NvbXBsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChnb3RvRmlyc3RQYWdlICYmIHRoaXMudmlzaWJsZVBhZ2VDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMudmlzaWJsZVBhZ2VzWzBdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBtZXJnZVZhbHVlcyhzcmM6IGFueSwgZGVzdDogYW55KSB7XHJcbiAgICAgICAgaWYgKCFkZXN0IHx8ICFzcmMpIHJldHVybjtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc3JjKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHNyY1trZXldO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkZXN0W2tleV0pIGRlc3Rba2V5XSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXJnZVZhbHVlcyh2YWx1ZSwgZGVzdFtrZXldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlc3Rba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZTogUGFnZU1vZGVsLCBvbGRWYWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZEN1cnJlbnRQYWdlJzogb2xkVmFsdWUsICduZXdDdXJyZW50UGFnZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFByb2dyZXNzKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIDA7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSArIDE7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoaW5kZXggKiAxMDAgLyB0aGlzLnZpc2libGVQYWdlQ291bnQpKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNFZGl0TW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImVkaXRcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc0Rpc3BsYXlNb2RlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5tb2RlID09IFwiZGlzcGxheVwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRGVzaWduTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNEZXNpZ25Nb2RlVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXREZXNpZ25Nb2RlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5pc0Rlc2lnbk1vZGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBoYXNDb29raWUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZTtcclxuICAgICAgICByZXR1cm4gY29va2llcyAmJiBjb29raWVzLmluZGV4T2YodGhpcy5jb29raWVOYW1lICsgXCI9dHJ1ZVwiKSA+IC0xO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldENvb2tpZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY29va2llTmFtZSkgcmV0dXJuO1xyXG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMuY29va2llTmFtZSArIFwiPXRydWU7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAwOjA6MCBHTVRcIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkZWxldGVDb29raWUoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZU5hbWUpIHJldHVybjtcclxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSB0aGlzLmNvb2tpZU5hbWUgKyBcIj07XCI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbmV4dFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNMYXN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzRWRpdE1vZGUgJiYgdGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMuZG9TZXJ2ZXJWYWxpZGF0aW9uKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRvTmV4dFBhZ2UoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGdldCBpc0N1cnJlbnRQYWdlSGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlLmhhc0Vycm9ycyh0cnVlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBwcmV2UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY29tcGxldGVMYXN0UGFnZSgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNFZGl0TW9kZSAmJiB0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5kb1NlcnZlclZhbGlkYXRpb24oKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZG9Db21wbGV0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0ZpcnN0UGFnZSgpOiBib29sZWFuIHsgXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaXNMYXN0UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgcmV0dXJuIHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IHZQYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGRvQ29tcGxldGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xlYXJJbnZpc2libGVWYWx1ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckludmlzaWJsZVF1ZXN0aW9uVmFsdWVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0Q29va2llKCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb21wbGV0ZWQoKTtcclxuICAgICAgICB0aGlzLm9uQ29tcGxldGUuZmlyZSh0aGlzLCBudWxsKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc1ZhbGlkYXRpbmdPblNlcnZlcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNWYWxpZGF0aW5nT25TZXJ2ZXJWYWx1ZTsgfVxyXG4gICAgcHJpdmF0ZSBzZXRJc1ZhbGlkYXRpbmdPblNlcnZlcih2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsID09IHRoaXMuaXNWYWxpZGF0aW5nT25TZXJ2ZXIpIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzVmFsaWRhdGluZ09uU2VydmVyVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5vbklzVmFsaWRhdGluZ09uU2VydmVyQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uSXNWYWxpZGF0aW5nT25TZXJ2ZXJDaGFuZ2VkKCkgeyB9XHJcbiAgICBwcm90ZWN0ZWQgZG9TZXJ2ZXJWYWxpZGF0aW9uKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghdGhpcy5vblNlcnZlclZhbGlkYXRlUXVlc3Rpb25zKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBvcHRpb25zID0geyBkYXRhOiB7fSwgZXJyb3JzOiB7fSwgc3VydmV5OiB0aGlzLCBjb21wbGV0ZSA6IGZ1bmN0aW9uICgpIHsgc2VsZi5jb21wbGV0ZVNlcnZlclZhbGlkYXRpb24ob3B0aW9ucyk7IH0gfTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY3VycmVudFBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuY3VycmVudFBhZ2UucXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uLm5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIG9wdGlvbnMuZGF0YVtxdWVzdGlvbi5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldElzVmFsaWRhdGluZ09uU2VydmVyKHRydWUpO1xyXG4gICAgICAgIHRoaXMub25TZXJ2ZXJWYWxpZGF0ZVF1ZXN0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29tcGxldGVTZXJ2ZXJWYWxpZGF0aW9uKG9wdGlvbnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0SXNWYWxpZGF0aW5nT25TZXJ2ZXIoZmFsc2UpO1xyXG4gICAgICAgIGlmICghb3B0aW9ucyAmJiAhb3B0aW9ucy5zdXJ2ZXkpIHJldHVybjtcclxuICAgICAgICB2YXIgc2VsZiA9IG9wdGlvbnMuc3VydmV5O1xyXG4gICAgICAgIHZhciBoYXNFcnJvcnMgPSBmYWxzZTtcclxuICAgICAgICBpZiAob3B0aW9ucy5lcnJvcnMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBvcHRpb25zLmVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gc2VsZi5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbiAmJiBxdWVzdGlvbltcImVycm9yc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc0Vycm9ycyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25bXCJhZGRFcnJvclwiXShuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcnNbbmFtZV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWhhc0Vycm9ycykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5pc0xhc3RQYWdlKSBzZWxmLmRvQ29tcGxldGUoKTtcclxuICAgICAgICAgICAgZWxzZSBzZWxmLmRvTmV4dFBhZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZG9OZXh0UGFnZSgpIHtcclxuICAgICAgICB0aGlzLmNoZWNrT25QYWdlVHJpZ2dlcnMoKTtcclxuICAgICAgICBpZiAodGhpcy5zZW5kUmVzdWx0T25QYWdlTmV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRSZXN1bHQodGhpcy5zdXJ2ZXlQb3N0SWQsIHRoaXMuY2xpZW50SWQsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCArIDFdO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldENvbXBsZXRlZCgpIHtcclxuICAgICAgICB0aGlzLmlzQ29tcGxldGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvY2Vzc2VkQ29tcGxldGVkSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbXBsZXRlZEh0bWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0bWwodGhpcy5jb21wbGV0ZWRIdG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFwiPGgzPlwiICsgdGhpcy5nZXRMb2NTdHJpbmcoXCJjb21wbGV0aW5nU3VydmV5XCIpICsgXCI8L2gzPlwiO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBwcm9jZXNzZWRMb2FkaW5nSHRtbCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBcIjxoMz5cIiArIHRoaXMuZ2V0TG9jU3RyaW5nKFwibG9hZGluZ1N1cnZleVwiKSArIFwiPC9oMz5cIjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgcHJvZ3Jlc3NUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRMb2NTdHJpbmcoXCJwcm9ncmVzc1RleHRcIilbXCJmb3JtYXRcIl0oaW5kZXgsIHZQYWdlcy5sZW5ndGgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHVwbG9hZEZpbGUobmFtZTogc3RyaW5nLCBmaWxlOiBGaWxlLCBzdG9yZURhdGFBc1RleHQ6IGJvb2xlYW4sIHVwbG9hZGluZ0NhbGxiYWNrOiAoc3RhdHVzOiBzdHJpbmcpPT5hbnkpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgYWNjZXB0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLm9uVXBsb2FkRmlsZS5maXJlKHRoaXMsIHsgbmFtZTogbmFtZSwgZmlsZTogZmlsZSwgYWNjZXB0OiBhY2NlcHQgfSk7XHJcbiAgICAgICAgaWYgKCFhY2NlcHQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoIXN0b3JlRGF0YUFzVGV4dCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwbG9hZEZpbGVDb3JlKG5hbWUsIGZpbGUsIHVwbG9hZGluZ0NhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdXBsb2FkRmlsZUNvcmUobmFtZTogc3RyaW5nLCBmaWxlOiBGaWxlLCB1cGxvYWRpbmdDYWxsYmFjazogKHN0YXR1czogc3RyaW5nKSA9PiBhbnkpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHVwbG9hZGluZ0NhbGxiYWNrKSB1cGxvYWRpbmdDYWxsYmFjayhcInVwbG9hZGluZ1wiKTtcclxuICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZEZpbGUodGhpcy5zdXJ2ZXlQb3N0SWQsIGZpbGUsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh1cGxvYWRpbmdDYWxsYmFjaykgdXBsb2FkaW5nQ2FsbGJhY2soc3VjY2VzcyA/IFwic3VjY2Vzc1wiIDogXCJlcnJvclwiKTtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0VmFsdWUobmFtZSwgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBnZXRQYWdlKGluZGV4OiBudW1iZXIpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW2luZGV4XTtcclxuICAgIH1cclxuICAgIGFkZFBhZ2UocGFnZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgaWYgKHBhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMucGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICB9XHJcbiAgICBhZGROZXdQYWdlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5jcmVhdGVOZXdQYWdlKG5hbWUpO1xyXG4gICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuICAgIHJlbW92ZVBhZ2UocGFnZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5wYWdlcy5pbmRleE9mKHBhZ2UpO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICB0aGlzLnBhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9PSBwYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnBhZ2VzLmxlbmd0aCA+IDAgPyB0aGlzLnBhZ2VzWzBdIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZywgY2FzZUluc2Vuc2l0aXZlOiBib29sZWFuID0gZmFsc2UpOiBJUXVlc3Rpb24ge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGlmIChjYXNlSW5zZW5zaXRpdmUpIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25OYW1lID0gcXVlc3Rpb25zW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChjYXNlSW5zZW5zaXRpdmUpIHF1ZXN0aW9uTmFtZSA9IHF1ZXN0aW9uTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZihxdWVzdGlvbk5hbWUgPT0gbmFtZSkgcmV0dXJuIHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UXVlc3Rpb25zQnlOYW1lcyhuYW1lczogc3RyaW5nW10sIGNhc2VJbnNlbnNpdGl2ZTogYm9vbGVhbiA9IGZhbHNlKTogSVF1ZXN0aW9uW10ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzW2ldKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lc1tpXSwgY2FzZUluc2Vuc2l0aXZlKTtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uKSByZXN1bHQucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UGFnZUJ5UXVlc3Rpb24ocXVlc3Rpb246IElRdWVzdGlvbik6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICBpZiAocGFnZS5xdWVzdGlvbnMuaW5kZXhPZig8UXVlc3Rpb25CYXNlPnF1ZXN0aW9uKSA+IC0xKSByZXR1cm4gcGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UGFnZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBQYWdlTW9kZWwge1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFBhZ2VzQnlOYW1lcyhuYW1lczogc3RyaW5nW10pOiBQYWdlTW9kZWxbXXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgaWYgKCFuYW1lcykgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5nZXRQYWdlQnlOYW1lKG5hbWVzW2ldKTtcclxuICAgICAgICAgICAgaWYgKHBhZ2UpIHJlc3VsdC5wdXNoKHBhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldEFsbFF1ZXN0aW9ucyh2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SVF1ZXN0aW9uPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxJUXVlc3Rpb24+KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5hZGRRdWVzdGlvbnNUb0xpc3QocmVzdWx0LCB2aXNpYmxlT25seSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3UGFnZShuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBQYWdlTW9kZWwobmFtZSk7IH1cclxuICAgIHByaXZhdGUgbm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5uYW1lICE9IG5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBxdWVzdGlvbiA9IHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgdGhpcy5kb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbiwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyAnbmFtZSc6IG5hbWUsICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAndmFsdWUnOiBuZXdWYWx1ZSB9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmRvU3VydmV5VmFsdWVDaGFuZ2VkKHF1ZXN0aW9uc1tpXSwgdGhpcy5nZXRWYWx1ZShxdWVzdGlvbnNbaV0ubmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBkb1N1cnZleVZhbHVlQ2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgcXVlc3Rpb24ub25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja09uUGFnZVRyaWdnZXJzKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEN1cnJlbnRQYWdlUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmdldFZhbHVlKHF1ZXN0aW9uLm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMocXVlc3Rpb24ubmFtZSwgdmFsdWUsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFBhZ2VRdWVzdGlvbnMoKTogQXJyYXk8UXVlc3Rpb25CYXNlPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5jdXJyZW50UGFnZTtcclxuICAgICAgICBpZiAoIXBhZ2UpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBwYWdlLnF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbi52aXNpYmxlIHx8ICFxdWVzdGlvbi5uYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjaGVja1RyaWdnZXJzKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgaXNPbk5leHRQYWdlOiBib29sZWFuKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMudHJpZ2dlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSB0aGlzLnRyaWdnZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAodHJpZ2dlci5uYW1lID09IG5hbWUgJiYgdHJpZ2dlci5pc09uTmV4dFBhZ2UgPT0gaXNPbk5leHRQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyLmNoZWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9RdWVzdGlvbnNPbkxvYWQoKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBxdWVzdGlvbnNbaV0ub25TdXJ2ZXlMb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Db25kaXRpb25zKCkge1xyXG4gICAgICAgIHRoaXMucnVuQ29uZGl0aW9uc0Zvckxpc3QodGhpcy5nZXRBbGxRdWVzdGlvbnMoZmFsc2UpKTtcclxuICAgICAgICB0aGlzLnJ1bkNvbmRpdGlvbnNGb3JMaXN0KHRoaXMucGFnZXMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBydW5Db25kaXRpb25zRm9yTGlzdChsaXN0OiBBcnJheTxJQ29uZGl0aW9uUnVubmVyPikge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsaXN0W2ldLnJ1bkNvbmRpdGlvbih0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nID0gbnVsbCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRWRpdE1vZGUpIHJldHVybjtcclxuICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkICYmIHRoaXMub25QYXJ0aWFsU2VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUGFydGlhbFNlbmQuZmlyZSh0aGlzLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cnZleVBvc3RJZCAmJiBwb3N0SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlQb3N0SWQgPSBwb3N0SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5zdXJ2ZXlQb3N0SWQpIHJldHVybjtcclxuICAgICAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkICYmICF0aGlzLmNsaWVudElkKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kUmVzdWx0KHRoaXMuc3VydmV5UG9zdElkLCB0aGlzLmRhdGEsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgIHNlbGYub25TZW5kUmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCByZXNwb25zZTogcmVzcG9uc2V9KTtcclxuICAgICAgICB9LCB0aGlzLmNsaWVudElkLCBpc1BhcnRpYWxDb21wbGV0ZWQpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLmdldFJlc3VsdChyZXN1bHRJZCwgbmFtZSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIGRhdGE6IGFueSwgZGF0YUxpc3Q6IGFueVtdLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgIHNlbGYub25HZXRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGE6IGRhdGEsIGRhdGFMaXN0OiBkYXRhTGlzdCwgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIGlmIChzdXJ2ZXlJZCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUlkID0gc3VydmV5SWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vbkxvYWRpbmdTdXJ2ZXlGcm9tU2VydmljZSgpO1xyXG4gICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHRoaXMuc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBzZWxmLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoc3VjY2VzcyAmJiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuc2V0SnNvbk9iamVjdChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkxvYWRTdXJ2ZXlGcm9tU2VydmljZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrUGFnZVZpc2liaWxpdHkocXVlc3Rpb246IElRdWVzdGlvbiwgb2xkUXVlc3Rpb25WaXNpYmxlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICBpZiAoIXBhZ2UpIHJldHVybjtcclxuICAgICAgICB2YXIgbmV3VmFsdWUgPSBwYWdlLmlzVmlzaWJsZTtcclxuICAgICAgICBpZiAobmV3VmFsdWUgIT0gcGFnZS5nZXRJc1BhZ2VWaXNpYmxlKHF1ZXN0aW9uKSB8fCBvbGRRdWVzdGlvblZpc2libGUpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlVmlzaWJpbGl0eUNoYW5nZWQocGFnZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlVmlzaWJsZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXModGhpcy5zaG93UGFnZU51bWJlcnMpO1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dRdWVzdGlvbk51bWJlcnMgPT0gXCJvblBhZ2VcIikge1xyXG4gICAgICAgICAgICB2YXIgdmlzUGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNQYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHZpc1BhZ2VzW2ldLnF1ZXN0aW9ucywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXModGhpcy5nZXRBbGxRdWVzdGlvbnMoZmFsc2UpLCB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnMgPT0gXCJvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVBhZ2VWaXNpYmxlSW5kZXhlcyhzaG93SW5kZXg6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCA9IHRoaXMucGFnZXNbaV0udmlzaWJsZSA/IChpbmRleCsrKSA6IC0xO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLm51bSA9IHNob3dJbmRleCAmJiB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCArIDEgOiAtMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXMocXVlc3Rpb25zOiBJUXVlc3Rpb25bXSwgc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBxdWVzdGlvbnNbaV0uc2V0VmlzaWJsZUluZGV4KHNob3dJbmRleCAmJiBxdWVzdGlvbnNbaV0udmlzaWJsZSAmJiBxdWVzdGlvbnNbaV0uaGFzVGl0bGUgPyAoaW5kZXgrKykgOiAtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRKc29uT2JqZWN0KGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuanNvbkVycm9ycyA9IG51bGw7XHJcbiAgICAgICAgdmFyIGpzb25Db252ZXJ0ZXIgPSBuZXcgSnNvbk9iamVjdCgpO1xyXG4gICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoanNvbk9iaiwgdGhpcyk7XHJcbiAgICAgICAgaWYgKGpzb25Db252ZXJ0ZXIuZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0ganNvbkNvbnZlcnRlci5lcnJvcnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvY2Vzc2VkVGV4dFZhbHVlcygpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Nvb2tpZSkge1xyXG4gICAgICAgICAgICB0aGlzLmRvQ29tcGxldGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kb1F1ZXN0aW9uc09uTG9hZCgpO1xyXG4gICAgICAgIHRoaXMucnVuQ29uZGl0aW9ucygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkJlZm9yZUNyZWF0aW5nKCkgeyB9XHJcbiAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQcm9jZXNzZWRUZXh0VmFsdWVzKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkVGV4dFZhbHVlcyA9IHt9O1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbXCJwYWdlbm9cIl0gPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gc2VsZi5jdXJyZW50UGFnZSAhPSBudWxsID8gc2VsZi52aXNpYmxlUGFnZXMuaW5kZXhPZihzZWxmLmN1cnJlbnRQYWdlKSArIDEgOiAwOyB9XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW1wicGFnZWNvdW50XCJdID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIHNlbGYudmlzaWJsZVBhZ2VDb3VudDsgfVxyXG4gICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1Byb2Nlc3NlZFRleHRWYWx1ZXMocXVlc3Rpb25zW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZFF1ZXN0aW9uVG9Qcm9jZXNzZWRUZXh0VmFsdWVzKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbcXVlc3Rpb24ubmFtZS50b0xvd2VyQ2FzZSgpXSA9IFwicXVlc3Rpb25cIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaGFzUHJvY2Vzc2VkVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBmaXJzdE5hbWUgPSBuZXcgUHJvY2Vzc1ZhbHVlKCkuZ2V0Rmlyc3ROYW1lKG5hbWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NlZFRleHRWYWx1ZXNbZmlyc3ROYW1lLnRvTG93ZXJDYXNlKCldO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRQcm9jZXNzZWRUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB2YXIgZmlyc3ROYW1lID0gbmV3IFByb2Nlc3NWYWx1ZSgpLmdldEZpcnN0TmFtZShuYW1lKTtcclxuICAgICAgICB2YXIgdmFsID0gdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW2ZpcnN0TmFtZS50b0xvd2VyQ2FzZSgpXTtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKHZhbCA9PSBcInZhcmlhYmxlXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFyaWFibGUobmFtZS50b0xvd2VyQ2FzZSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhbCA9PSBcInF1ZXN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShmaXJzdE5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgbmFtZSA9IHF1ZXN0aW9uLm5hbWUgKyBuYW1lLnN1YnN0cihmaXJzdE5hbWUubGVuZ3RoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9jZXNzVmFsdWUoKS5nZXRWYWx1ZShuYW1lLCB0aGlzLnZhbHVlc0hhc2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsID09IFwidmFsdWVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb2Nlc3NWYWx1ZSgpLmdldFZhbHVlKG5hbWUsIHRoaXMudmFsdWVzSGFzaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWwobmFtZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNsZWFySW52aXNpYmxlUXVlc3Rpb25WYWx1ZXMoKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VmFyaWFibGUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlc0hhc2hbbmFtZV07XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0VmFyaWFibGUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW25hbWUudG9Mb3dlckNhc2UoKV0gPSBcInZhcmlhYmxlXCI7XHJcbiAgICB9XHJcbiAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgcHJpdmF0ZSBnZXRVbmJpbmRWYWx1ZSh2YWx1ZTogYW55KTogYW55IHtcclxuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgICAgLy9kbyBub3QgcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBpbnN0YW5jZSEhIVxyXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VW5iaW5kVmFsdWUodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUVxdWFsKG5hbWUsIG5ld1ZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuZ2V0VW5iaW5kVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRUZXh0VmFsdWVzW25hbWUudG9Mb3dlckNhc2UoKV0gPSBcInZhbHVlXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKG5hbWUsIG5ld1ZhbHVlLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5ydW5Db25kaXRpb25zKCk7XHJcbiAgICAgICAgdGhpcy50cnlHb05leHRQYWdlQXV0b21hdGljKG5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc1ZhbHVlRXF1YWwobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlID09IFwiXCIpIG5ld1ZhbHVlID0gbnVsbDtcclxuICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLmdldFZhbHVlKG5hbWUpO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gbnVsbCB8fCBvbGRWYWx1ZSA9PT0gbnVsbCkgcmV0dXJuIG5ld1ZhbHVlID09PSBvbGRWYWx1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc1R3b1ZhbHVlRXF1YWxzKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzVHdvVmFsdWVFcXVhbHMoeDogYW55LCB5OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoeCA9PT0geSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKCEoeCBpbnN0YW5jZW9mIE9iamVjdCkgfHwgISh5IGluc3RhbmNlb2YgT2JqZWN0KSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4geCkge1xyXG4gICAgICAgICAgICBpZiAoIXguaGFzT3duUHJvcGVydHkocCkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoIXkuaGFzT3duUHJvcGVydHkocCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHhbcF0gPT09IHlbcF0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh4W3BdKSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNUd29WYWx1ZUVxdWFscyh4W3BdLCB5W3BdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHAgaW4geSkge1xyXG4gICAgICAgICAgICBpZiAoeS5oYXNPd25Qcm9wZXJ0eShwKSAmJiAheC5oYXNPd25Qcm9wZXJ0eShwKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdHJ5R29OZXh0UGFnZUF1dG9tYXRpYyhuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZ29OZXh0UGFnZUF1dG9tYXRpYyB8fCAhdGhpcy5jdXJyZW50UGFnZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZSk7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uICYmICFxdWVzdGlvbi5zdXBwb3J0R29OZXh0UGFnZUF1dG9tYXRpYygpKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0Q3VycmVudFBhZ2VRdWVzdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25zW2ldLmhhc0lucHV0ICYmICF0aGlzLmdldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lKSkgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFBhZ2UuaGFzRXJyb3JzKHRydWUsIGZhbHNlKSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNMYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0UGFnZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kb0NvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZGF0YVtuYW1lICsgdGhpcy5jb21tZW50UHJlZml4XTtcclxuICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbmFtZSA9IG5hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXg7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlID09IFwiXCIgfHwgbmV3VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnRyeUdvTmV4dFBhZ2VBdXRvbWF0aWMobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgdGhpcy5jaGVja1BhZ2VWaXNpYmlsaXR5KHF1ZXN0aW9uLCAhbmV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcGFnZVZpc2liaWxpdHlDaGFuZ2VkKHBhZ2U6IElQYWdlLCBuZXdWYWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB0aGlzLm9uUGFnZVZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncGFnZSc6IHBhZ2UsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy5hZGRRdWVzdGlvblRvUHJvY2Vzc2VkVGV4dFZhbHVlcyhxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5vblF1ZXN0aW9uQWRkZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICdpbmRleCc6IGluZGV4IH0pO1xyXG4gICAgfVxyXG4gICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgdGhpcy5vblF1ZXN0aW9uUmVtb3ZlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSB9KTtcclxuICAgIH1cclxuICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5pc0VtcHR5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgbmFtZTogbmFtZSwgdmFsdWU6IHRoaXMuZ2V0VmFsdWUobmFtZSksIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgdGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uZmlyZSh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucy5lcnJvciA/IG5ldyBDdXN0b21FcnJvcihvcHRpb25zLmVycm9yKSA6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0geyBodG1sOiBodG1sIH07XHJcbiAgICAgICAgdGhpcy5vblByb2Nlc3NIdG1sLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc1RleHQob3B0aW9ucy5odG1sKTtcclxuICAgIH1cclxuICAgIHByb2Nlc3NUZXh0KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dFByZVByb2Nlc3Nvci5wcm9jZXNzKHRleHQpO1xyXG4gICAgfVxyXG4gICAgLy9JU3VydmV5VHJpZ2dlck93bmVyXHJcbiAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtde1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UGFnZXNCeU5hbWVzKHBhZ2VzKSk7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFF1ZXN0aW9uc0J5TmFtZXMocXVlc3Rpb25zKSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHNldFRyaWdnZXJWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGlzVmFyaWFibGU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIW5hbWUpIHJldHVybjtcclxuICAgICAgICBpZiAoaXNWYXJpYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhcmlhYmxlKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXlcIiwgW3sgbmFtZTogXCJsb2NhbGVcIiwgY2hvaWNlczogKCkgPT4geyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldExvY2FsZXMoKSB9IH0sXHJcbiAgICBcInRpdGxlXCIsIHsgbmFtZTogXCJmb2N1c0ZpcnN0UXVlc3Rpb25BdXRvbWF0aWM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlfSwgXCJjb21wbGV0ZWRIdG1sOmh0bWxcIiwgeyBuYW1lOiBcInBhZ2VzXCIsIGNsYXNzTmFtZTogXCJwYWdlXCIgfSxcclxuICAgIHsgbmFtZTogXCJxdWVzdGlvbnNcIiwgYmFzZUNsYXNzTmFtZTogXCJxdWVzdGlvblwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBudWxsOyB9LCBvblNldFZhbHVlOiBmdW5jdGlvbiAob2JqLCB2YWx1ZSwganNvbkNvbnZlcnRlcikgeyB2YXIgcGFnZSA9IG9iai5hZGROZXdQYWdlKFwiXCIpOyBqc29uQ29udmVydGVyLnRvT2JqZWN0KHsgcXVlc3Rpb25zOiB2YWx1ZSB9LCBwYWdlKTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcInRyaWdnZXJzOnRyaWdnZXJzXCIsIGJhc2VDbGFzc05hbWU6IFwic3VydmV5dHJpZ2dlclwiLCBjbGFzc05hbWVQYXJ0OiBcInRyaWdnZXJcIiB9LFxyXG4gICAgXCJzdXJ2ZXlJZFwiLCBcInN1cnZleVBvc3RJZFwiLCBcImNvb2tpZU5hbWVcIiwgXCJzZW5kUmVzdWx0T25QYWdlTmV4dDpib29sZWFuXCIsXHJcbiAgICB7IG5hbWU6IFwic2hvd05hdmlnYXRpb25CdXR0b25zOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCB7IG5hbWU6IFwic2hvd1RpdGxlOmJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9LCB7IG5hbWU6IFwic2hvd1BhZ2VUaXRsZXM6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sXHJcbiAgICBcInNob3dQYWdlTnVtYmVyczpib29sZWFuXCIsIHsgbmFtZTogXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIGRlZmF1bHQ6IFwib25cIiwgY2hvaWNlczogW1wib25cIiwgXCJvblBhZ2VcIiwgXCJvZmZcIl0gfSxcclxuICAgIHsgbmFtZTogXCJxdWVzdGlvblRpdGxlTG9jYXRpb25cIiwgZGVmYXVsdDogXCJ0b3BcIiwgY2hvaWNlczogW1widG9wXCIsIFwiYm90dG9tXCJdIH0sXHJcbiAgICB7IG5hbWU6IFwic2hvd1Byb2dyZXNzQmFyXCIsIGRlZmF1bHQ6IFwib2ZmXCIsIGNob2ljZXM6IFtcIm9mZlwiLCBcInRvcFwiLCBcImJvdHRvbVwiXSB9LFxyXG4gICAgeyBuYW1lOiBcIm1vZGVcIiwgZGVmYXVsdDogXCJlZGl0XCIsIGNob2ljZXM6IFtcImVkaXRcIiwgXCJkaXNwbGF5XCJdIH0sXHJcbiAgICB7IG5hbWU6IFwic3RvcmVPdGhlcnNBc0NvbW1lbnQ6Ym9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0sIFwiZ29OZXh0UGFnZUF1dG9tYXRpYzpib29sZWFuXCIsIFwiY2xlYXJJbnZpc2libGVWYWx1ZXM6Ym9vbGVhblwiLFxyXG4gICAgeyBuYW1lOiBcInBhZ2VQcmV2VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlUHJldlRleHRWYWx1ZTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcInBhZ2VOZXh0VGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlTmV4dFRleHRWYWx1ZTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcImNvbXBsZXRlVGV4dFwiLCBvbkdldFZhbHVlOiBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5jb21wbGV0ZVRleHRWYWx1ZTsgfSB9LFxyXG4gICAgeyBuYW1lOiBcInJlcXVpcmVkVGV4dFwiLCBkZWZhdWx0OiBcIipcIiB9LCBcInF1ZXN0aW9uU3RhcnRJbmRleFwiLCBcInF1ZXN0aW9uVGl0bGVUZW1wbGF0ZVwiXSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc3VydmV5LnRzXG4gKiovIiwiZXhwb3J0IGNsYXNzIGR4U3VydmV5U2VydmljZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHNlcnZpY2VVcmw6IHN0cmluZyA9IFwiaHR0cHM6Ly9keHN1cnZleWFwaS5henVyZXdlYnNpdGVzLm5ldC9hcGkvU3VydmV5XCI7XHJcbiAgICAvL3B1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwOi8vbG9jYWxob3N0OjUwNDg4L2FwaS9TdXJ2ZXlcIjtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGxvYWRTdXJ2ZXkoc3VydmV5SWQ6IHN0cmluZywgb25Mb2FkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9nZXRTdXJ2ZXk/c3VydmV5SWQ9JyArIHN1cnZleUlkKTtcclxuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIG9uTG9hZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nLCByZXN1bHQ6IEpTT04sIG9uU2VuZFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpPT4gdm9pZCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL3Bvc3QvJyk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7IHBvc3RJZDogcG9zdElkLCBzdXJ2ZXlSZXN1bHQ6IEpTT04uc3RyaW5naWZ5KHJlc3VsdCkgfTtcclxuICAgICAgICBpZiAoY2xpZW50SWQpIGRhdGFbJ2NsaWVudElkJ10gPSBjbGllbnRJZDtcclxuICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkKSBkYXRhWydpc1BhcnRpYWxDb21wbGV0ZWQnXSA9IHRydWU7XHJcbiAgICAgICAgdmFyIGRhdGFTdHJpbmdpZnk6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghb25TZW5kUmVzdWx0KSByZXR1cm47XHJcbiAgICAgICAgICAgIG9uU2VuZFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKGRhdGFTdHJpbmdpZnkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNlbmRGaWxlKHBvc3RJZDogc3RyaW5nLCBmaWxlOiBGaWxlLCBvblNlbmRGaWxlOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghb25TZW5kRmlsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBvblNlbmRGaWxlKHhoci5zdGF0dXMgPT0gMjAwLCBKU09OLnBhcnNlKHhoci5yZXNwb25zZSkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgeGhyLm9wZW4oXCJQT1NUXCIsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy91cGxvYWQvJywgdHJ1ZSk7XHJcbiAgICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiZmlsZVwiLCBmaWxlKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwb3N0SWRcIiwgcG9zdElkKTtcclxuICAgICAgICB4aHIuc2VuZChmb3JtRGF0YSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgb25HZXRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBBcnJheTxhbnk+LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJ3Jlc3VsdElkPScgKyByZXN1bHRJZCArICcmbmFtZT0nICsgbmFtZTtcclxuICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFJlc3VsdD8nICsgZGF0YSk7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzdWx0LlF1ZXN0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0geyBuYW1lOiBrZXksIHZhbHVlOiByZXN1bHQuUXVlc3Rpb25SZXN1bHRba2V5XSB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChlbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb25HZXRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgbGlzdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaXNDb21wbGV0ZWQocmVzdWx0SWQ6IHN0cmluZywgY2xpZW50SWQ6IHN0cmluZywgb25Jc0NvbXBsZXRlZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHZhciBkYXRhID0gJ3Jlc3VsdElkPScgKyByZXN1bHRJZCArICcmY2xpZW50SWQ9JyArIGNsaWVudElkO1xyXG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvaXNDb21wbGV0ZWQ/JyArIGRhdGEpO1xyXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvbklzQ29tcGxldGVkKHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZHhTdXJ2ZXlTZXJ2aWNlLnRzXG4gKiovIiwiaW1wb3J0IHtCYXNlLCBIYXNoVGFibGV9IGZyb20gXCIuL2Jhc2VcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi9qc29ub2JqZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJpZ2dlciBleHRlbmRzIEJhc2Uge1xyXG4gICAgc3RhdGljIG9wZXJhdG9yc1ZhbHVlOiBIYXNoVGFibGU8RnVuY3Rpb24+ID0gbnVsbDtcclxuICAgIHN0YXRpYyBnZXQgb3BlcmF0b3JzKCkge1xyXG4gICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgIFRyaWdnZXIub3BlcmF0b3JzVmFsdWUgPSB7XHJcbiAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICF2YWx1ZTsgfSxcclxuICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gISghdmFsdWUpOyB9LFxyXG4gICAgICAgICAgICBlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA9PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICBub3RlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAhPSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtcImluZGV4T2ZcIl0gJiYgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA+IC0xOyB9LFxyXG4gICAgICAgICAgICBub3Rjb250YWluczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhdmFsdWUgfHwgIXZhbHVlW1wiaW5kZXhPZlwiXSB8fCB2YWx1ZS5pbmRleE9mKGV4cGVjdGVkVmFsdWUpID09IC0xOyB9LFxyXG4gICAgICAgICAgICBncmVhdGVyOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlID4gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgIGdyZWF0ZXJvcmVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlID49IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgIGxlc3NvcmVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlIDw9IGV4cGVjdGVkVmFsdWU7IH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICBwdWJsaWMgdmFsdWU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IG9wZXJhdG9yKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm9wVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICB0aGlzLm9wVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKFRyaWdnZXIub3BlcmF0b3JzW3RoaXMub3BlcmF0b3JdKHZhbHVlLCB0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uU3VjY2VzcygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25GYWlsdXJlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgfVxyXG4gICAgcHJvdGVjdGVkIG9uRmFpbHVyZSgpIHsgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgZ2V0T2JqZWN0cyhwYWdlczogc3RyaW5nW10sIHF1ZXN0aW9uczogc3RyaW5nW10pOiBhbnlbXTtcclxuICAgIGRvQ29tcGxldGUoKTtcclxuICAgIHNldFRyaWdnZXJWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnksIGlzVmFyaWFibGU6IGJvb2xlYW4pO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlciBleHRlbmRzIFRyaWdnZXIge1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBvd25lcjogSVN1cnZleVRyaWdnZXJPd25lciA9IG51bGw7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc09uTmV4dFBhZ2UoKSB7IHJldHVybiBmYWxzZTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclZpc2libGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgIHB1YmxpYyBwYWdlczogc3RyaW5nW10gPSBbXTtcclxuICAgIHB1YmxpYyBxdWVzdGlvbnM6IHN0cmluZ1tdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmlzaWJsZXRyaWdnZXJcIjsgfVxyXG4gICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgcHJvdGVjdGVkIG9uRmFpbHVyZSgpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1GYWlsdXJlKTsgfVxyXG4gICAgcHJpdmF0ZSBvblRyaWdnZXIoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICBpZiAoIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICB2YXIgb2JqZWN0cyA9IHRoaXMub3duZXIuZ2V0T2JqZWN0cyh0aGlzLnBhZ2VzLCB0aGlzLnF1ZXN0aW9ucyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZ1bmMob2JqZWN0c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uSXRlbVN1Y2Nlc3MoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IHRydWU7IH1cclxuICAgIHByb3RlY3RlZCBvbkl0ZW1GYWlsdXJlKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSBmYWxzZTsgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJjb21wbGV0ZXRyaWdnZXJcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc09uTmV4dFBhZ2UoKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkgeyBpZiAodGhpcy5vd25lcikgdGhpcy5vd25lci5kb0NvbXBsZXRlKCk7IH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclNldFZhbHVlIGV4dGVuZHMgU3VydmV5VHJpZ2dlciB7XHJcbiAgICBwdWJsaWMgc2V0VG9OYW1lOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgc2V0VmFsdWU6IGFueTtcclxuICAgIHB1YmxpYyBpc1ZhcmlhYmxlOiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInNldHZhbHVldHJpZ2dlclwiOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zZXRUb05hbWUgfHwgIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICB0aGlzLm93bmVyLnNldFRyaWdnZXJWYWx1ZSh0aGlzLnNldFRvTmFtZSwgdGhpcy5zZXRWYWx1ZSwgdGhpcy5pc1ZhcmlhYmxlKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5dHJpZ2dlclwiLCBbXCIhbmFtZVwiXSwgbnVsbCwgXCJ0cmlnZ2VyXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidmlzaWJsZXRyaWdnZXJcIiwgW1wicGFnZXNcIiwgXCJxdWVzdGlvbnNcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSgpOyB9LCBcInN1cnZleXRyaWdnZXJcIik7XHJcbkpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21wbGV0ZXRyaWdnZXJcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyQ29tcGxldGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic2V0dmFsdWV0cmlnZ2VyXCIsIFtcIiFzZXRUb05hbWVcIiwgXCJzZXRWYWx1ZVwiLCBcImlzVmFyaWFibGU6Ym9vbGVhblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFN1cnZleVRyaWdnZXJTZXRWYWx1ZSgpOyB9LCBcInN1cnZleXRyaWdnZXJcIik7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvdHJpZ2dlci50c1xuICoqLyIsImltcG9ydCB7QmFzZX0gZnJvbSBcIi4vYmFzZVwiO1xyXG5pbXBvcnQge1N1cnZleU1vZGVsfSBmcm9tIFwiLi9zdXJ2ZXlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlXaW5kb3dNb2RlbCBleHRlbmRzIEJhc2UgIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgc3VydmV5RWxlbWVudE5hbWUgPSBcIndpbmRvd1N1cnZleUpTXCI7XHJcbiAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5TW9kZWw7XHJcbiAgICB3aW5kb3dFbGVtZW50OiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGlzU2hvd2luZ1ZhbHVlOiBib29sZWFuO1xyXG4gICAgaXNFeHBhbmRlZFZhbHVlOiBib29sZWFuO1xyXG4gICAgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgdGVtcGxhdGVWYWx1ZTogc3RyaW5nO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IHRoaXMuY3JlYXRlU3VydmV5KGpzb25PYmopO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUuc2hvd1RpdGxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0VHlwZSgpIDogc3RyaW5nIHsgcmV0dXJuIFwid2luZG93XCIgfVxyXG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5TW9kZWwgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBpc1Nob3dpbmcoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzU2hvd2luZ1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRXhwYW5kZWRWYWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5zdXJ2ZXkudGl0bGU7IH1cclxuICAgIHB1YmxpYyBzZXQgdGl0bGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGV4cGFuZCgpIHtcclxuICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKHRydWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNvbGxhcHNlKCkge1xyXG4gICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVN1cnZleShqc29uT2JqOiBhbnkpOiBTdXJ2ZXlNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlNb2RlbChqc29uT2JqKVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGV4cGFuZGNvbGxhcHNlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5pc0V4cGFuZGVkVmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3N1cnZleVdpbmRvdy50c1xuICoqLyIsImV4cG9ydCB2YXIgc3VydmV5Q3NzID0ge1xyXG4gICAgY3VycmVudFR5cGU6IFwiXCIsXHJcbiAgICBnZXRDc3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbG9jID0gdGhpcy5jdXJyZW50VHlwZSA/IHRoaXNbdGhpcy5jdXJyZW50VHlwZV0gOiBkZWZhdWx0U3RhbmRhcmRDc3M7XHJcbiAgICAgICAgaWYgKCFsb2MpIGxvYyA9IGRlZmF1bHRTdGFuZGFyZENzcztcclxuICAgICAgICByZXR1cm4gbG9jO1xyXG4gICAgfSxcclxufTtcclxuXHJcbmV4cG9ydCB2YXIgZGVmYXVsdFN0YW5kYXJkQ3NzID0ge1xyXG4gICAgcm9vdDogXCJzdl9tYWluXCIsXHJcbiAgICBoZWFkZXI6IFwiXCIsXHJcbiAgICBib2R5OiBcInN2X2JvZHlcIixcclxuICAgIGZvb3RlcjogXCJzdl9uYXZcIixcclxuICAgIG5hdmlnYXRpb25CdXR0b246IFwiXCIsIG5hdmlnYXRpb246IHsgY29tcGxldGU6IFwiXCIsIHByZXY6XCJcIiwgbmV4dDogXCJcIn0sXHJcbiAgICBwcm9ncmVzczogXCJzdl9wcm9ncmVzc1wiLCBwcm9ncmVzc0JhcjogXCJcIixcclxuICAgIHBhZ2VUaXRsZTogXCJzdl9wX3RpdGxlXCIsXHJcbiAgICByb3c6IFwic3Zfcm93XCIsXHJcbiAgICBxdWVzdGlvbjogeyByb290OiBcInN2X3FcIiwgdGl0bGU6IFwic3ZfcV90aXRsZVwiLCBjb21tZW50OiBcIlwiLCBpbmRlbnQ6IDIwIH0sXHJcbiAgICBlcnJvcjogeyByb290OiBcInN2X3FfZXJib3hcIiwgaWNvbjogXCJcIiwgaXRlbTogXCJcIiB9LFxyXG5cclxuICAgIGNoZWNrYm94OiB7IHJvb3Q6IFwic3ZfcWNiY1wiLCBpdGVtOiBcInN2X3FfY2hlY2tib3hcIiwgb3RoZXI6IFwic3ZfcV9vdGhlclwiIH0sXHJcbiAgICBjb21tZW50OiBcIlwiLFxyXG4gICAgZHJvcGRvd246IFwiXCIsXHJcbiAgICBtYXRyaXg6IHsgcm9vdDogXCJzdl9xX21hdHJpeFwiIH0sXHJcbiAgICBtYXRyaXhkcm9wZG93bjogeyByb290OiBcInN2X3FfbWF0cml4XCIgfSxcclxuICAgIG1hdHJpeGR5bmFtaWM6IHsgcm9vdDogXCJ0YWJsZVwiLCBidXR0b246IFwiXCIgfSxcclxuICAgIG11bHRpcGxldGV4dDogeyByb290OiBcIlwiLCBpdGVtVGl0bGU6IFwiXCIsIGl0ZW1WYWx1ZTogXCJcIiB9LFxyXG4gICAgcmFkaW9ncm91cDogeyByb290OiBcInN2X3FjYmNcIiwgaXRlbTogXCJzdl9xX3JhZGlvZ3JvdXBcIiwgb3RoZXI6IFwic3ZfcV9vdGhlclwiIH0sXHJcbiAgICByYXRpbmc6IHsgcm9vdDogXCJzdl9xX3JhdGluZ1wiLCBpdGVtOiBcInN2X3FfcmF0aW5nX2l0ZW1cIiB9LFxyXG4gICAgdGV4dDogXCJcIixcclxuICAgIHdpbmRvdzoge1xyXG4gICAgICAgIHJvb3Q6IFwic3Zfd2luZG93XCIsIGJvZHk6IFwic3Zfd2luZG93X2NvbnRlbnRcIixcclxuICAgICAgICBoZWFkZXI6IHtcclxuICAgICAgICAgICAgcm9vdDogXCJzdl93aW5kb3dfdGl0bGVcIiwgdGl0bGU6IFwiXCIsIGJ1dHRvbjogXCJcIiwgYnV0dG9uRXhwYW5kZWQ6IFwiXCIsIGJ1dHRvbkNvbGxhcHNlZDogXCJcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbnN1cnZleUNzc1tcInN0YW5kYXJkXCJdID0gZGVmYXVsdFN0YW5kYXJkQ3NzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2RlZmF1bHRDc3MvY3Nzc3RhbmRhcmQudHNcbiAqKi8iLCJpbXBvcnQge3N1cnZleUNzc30gZnJvbSBcIi4vY3Nzc3RhbmRhcmRcIjtcclxuXHJcbmV4cG9ydCB2YXIgZGVmYXVsdEJvb3RzdHJhcENzcyA9IHtcclxuICAgIHJvb3Q6IFwiXCIsXHJcbiAgICBoZWFkZXI6IFwicGFuZWwtaGVhZGluZ1wiLFxyXG4gICAgYm9keTogXCJwYW5lbC1ib2R5XCIsXHJcbiAgICBmb290ZXI6IFwicGFuZWwtZm9vdGVyXCIsXHJcbiAgICBuYXZpZ2F0aW9uQnV0dG9uOiBcIlwiLCBuYXZpZ2F0aW9uOiB7IGNvbXBsZXRlOiBcIlwiLCBwcmV2OiBcIlwiLCBuZXh0OiBcIlwiIH0sXHJcbiAgICBwcm9ncmVzczogXCJwcm9ncmVzcyBjZW50ZXItYmxvY2tcIiwgcHJvZ3Jlc3NCYXI6IFwicHJvZ3Jlc3MtYmFyXCIsXHJcbiAgICBwYWdlVGl0bGU6IFwiXCIsXHJcbiAgICByb3c6IFwiXCIsXHJcbiAgICBxdWVzdGlvbjogeyByb290OiBcIlwiLCB0aXRsZTogXCJcIiwgY29tbWVudDogXCJmb3JtLWNvbnRyb2xcIiwgaW5kZW50OiAyMCB9LFxyXG4gICAgZXJyb3I6IHsgcm9vdDogXCJhbGVydCBhbGVydC1kYW5nZXJcIiwgaWNvbjogXCJnbHlwaGljb24gZ2x5cGhpY29uLWV4Y2xhbWF0aW9uLXNpZ25cIiwgaXRlbTogXCJcIiB9LFxyXG5cclxuICAgIGNoZWNrYm94OiB7IHJvb3Q6IFwiZm9ybS1pbmxpbmVcIiwgaXRlbTogXCJjaGVja2JveFwiLCBvdGhlcjogXCJcIiB9LFxyXG4gICAgY29tbWVudDogXCJmb3JtLWNvbnRyb2xcIixcclxuICAgIGRyb3Bkb3duOiBcImZvcm0tY29udHJvbFwiLFxyXG4gICAgbWF0cml4OiB7IHJvb3Q6IFwidGFibGVcIiB9LFxyXG4gICAgbWF0cml4ZHJvcGRvd246IHsgcm9vdDogXCJ0YWJsZVwiIH0sXHJcbiAgICBtYXRyaXhkeW5hbWljOiB7IHJvb3Q6IFwidGFibGVcIiwgYnV0dG9uOiBcImJ1dHRvblwiIH0sXHJcbiAgICBtdWx0aXBsZXRleHQ6IHsgcm9vdDogXCJ0YWJsZVwiLCBpdGVtVGl0bGU6IFwiXCIsIGl0ZW1WYWx1ZTogXCJmb3JtLWNvbnRyb2xcIiB9LFxyXG4gICAgcmFkaW9ncm91cDogeyByb290OiBcImZvcm0taW5saW5lXCIsIGl0ZW06IFwicmFkaW9cIiwgb3RoZXI6IFwiXCIgfSxcclxuICAgIHJhdGluZzogeyByb290OiBcImJ0bi1ncm91cFwiLCBpdGVtOiBcImJ0biBidG4tZGVmYXVsdFwiIH0sXHJcbiAgICB0ZXh0OiBcImZvcm0tY29udHJvbFwiLFxyXG4gICAgd2luZG93OiB7XHJcbiAgICAgICAgcm9vdDogXCJtb2RhbC1jb250ZW50XCIsIGJvZHk6IFwibW9kYWwtYm9keVwiLFxyXG4gICAgICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICByb290OiBcIm1vZGFsLWhlYWRlciBwYW5lbC10aXRsZVwiLCB0aXRsZTogXCJwdWxsLWxlZnRcIiwgYnV0dG9uOiBcImdseXBoaWNvbiBwdWxsLXJpZ2h0XCIsXHJcbiAgICAgICAgICAgIGJ1dHRvbkV4cGFuZGVkOiBcImdseXBoaWNvbiBwdWxsLXJpZ2h0IGdseXBoaWNvbi1jaGV2cm9uLXVwXCIsIGJ1dHRvbkNvbGxhcHNlZDogXCJnbHlwaGljb24gcHVsbC1yaWdodCBnbHlwaGljb24tY2hldnJvbi1kb3duXCJcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbnN1cnZleUNzc1tcImJvb3RzdHJhcFwiXSA9IGRlZmF1bHRCb290c3RyYXBDc3M7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvZGVmYXVsdENzcy9jc3Nib290c3RyYXAudHNcbiAqKi8iLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3N1cnZleVwiO1xyXG5pbXBvcnQge0lQYWdlLCBFdmVudH0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuaW1wb3J0IHtQYWdlfSBmcm9tIFwiLi9rb3BhZ2VcIjtcclxuaW1wb3J0IHtQYWdlTW9kZWx9IGZyb20gXCIuLi9wYWdlXCI7XHJcbmltcG9ydCB7c3VydmV5Q3NzfSBmcm9tIFwiLi4vZGVmYXVsdENzcy9jc3NzdGFuZGFyZFwiO1xyXG5pbXBvcnQge2tvVGVtcGxhdGV9IGZyb20gXCIuL3RlbXBsYXRlLmtvLmh0bWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBTdXJ2ZXlNb2RlbCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBjc3NUeXBlKCk6IHN0cmluZyB7IHJldHVybiBzdXJ2ZXlDc3MuY3VycmVudFR5cGU7IH1cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IGNzc1R5cGUodmFsdWU6IHN0cmluZykgeyBzdXJ2ZXlDc3MuY3VycmVudFR5cGUgPSB2YWx1ZTsgfVxyXG4gICAgcHJpdmF0ZSByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgcHVibGljIG9uUmVuZGVyZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHJpdmF0ZSBpc0ZpcnN0UmVuZGVyOiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgICBrb0N1cnJlbnRQYWdlOiBhbnk7IGtvSXNGaXJzdFBhZ2U6IGFueTsga29Jc0xhc3RQYWdlOiBhbnk7IGR1bW15T2JzZXJ2YWJsZTogYW55OyBrb1N0YXRlOiBhbnk7XHJcbiAgICBrb1Byb2dyZXNzOiBhbnk7IGtvUHJvZ3Jlc3NUZXh0OiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsLCBjc3M6IGFueSA9IG51bGwpIHtcclxuICAgICAgICBzdXBlcihqc29uT2JqKTtcclxuICAgICAgICBpZiAoY3NzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3NzID0gY3NzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVuZGVyZWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gcmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIGtvID09PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IEVycm9yKCdrbm9ja291dGpzIGxpYnJhcnkgaXMgbm90IGxvYWRlZC4nKTtcclxuICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjc3NOYXZpZ2F0aW9uQ29tcGxldGUoKSB7IHJldHVybiB0aGlzLmdldE5hdmlnYXRpb25Dc3ModGhpcy5jc3MubmF2aWdhdGlvbkJ1dHRvbiwgdGhpcy5jc3MubmF2aWdhdGlvbi5jb21wbGV0ZSk7IH1cclxuICAgIHB1YmxpYyBnZXQgY3NzTmF2aWdhdGlvblByZXYoKSB7IHJldHVybiB0aGlzLmdldE5hdmlnYXRpb25Dc3ModGhpcy5jc3MubmF2aWdhdGlvbkJ1dHRvbiwgdGhpcy5jc3MubmF2aWdhdGlvbi5wcmV2KTsgfVxyXG4gICAgcHVibGljIGdldCBjc3NOYXZpZ2F0aW9uTmV4dCgpIHsgcmV0dXJuIHRoaXMuZ2V0TmF2aWdhdGlvbkNzcyh0aGlzLmNzcy5uYXZpZ2F0aW9uQnV0dG9uLCB0aGlzLmNzcy5uYXZpZ2F0aW9uLm5leHQpOyB9XHJcbiAgICBwcml2YXRlIGdldE5hdmlnYXRpb25Dc3MobWFpbjogc3RyaW5nLCBidG46IHN0cmluZykge1xyXG4gICAgICAgIHZhciByZXMgPSBcIlwiO1xyXG4gICAgICAgIGlmIChtYWluKSByZXMgPSBtYWluO1xyXG4gICAgICAgIGlmIChidG4pIHJlcyArPSAnICcgKyBidG47XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgY3NzKCk6IGFueSB7IHJldHVybiBzdXJ2ZXlDc3MuZ2V0Q3NzKCk7IH1cclxuICAgIHB1YmxpYyBzZXQgY3NzKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLm1lcmdlVmFsdWVzKHZhbHVlLCB0aGlzLmNzcyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xyXG4gICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgc2VsZi5vblJlbmRlcmVkLmZpcmUoc2VsZiwge30pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKHJlbmRlcmVkRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IHJlbmRlcmVkRWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIubG9hZFN1cnZleUZyb21TZXJ2aWNlKHN1cnZleUlkKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzZXRDb21wbGV0ZWQoKSB7XHJcbiAgICAgICAgc3VwZXIuc2V0Q29tcGxldGVkKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3UGFnZShuYW1lOiBzdHJpbmcpIHsgcmV0dXJuIG5ldyBQYWdlKG5hbWUpOyB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0VGVtcGxhdGUoKTogc3RyaW5nIHsgcmV0dXJuIGtvVGVtcGxhdGUuaHRtbDsgfVxyXG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlQ3JlYXRpbmcoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICB0aGlzLmtvQ3VycmVudFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmN1cnJlbnRQYWdlOyB9KTtcclxuICAgICAgICB0aGlzLmtvSXNGaXJzdFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmlzRmlyc3RQYWdlOyB9KTtcclxuICAgICAgICB0aGlzLmtvSXNMYXN0UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuaXNMYXN0UGFnZTsgfSk7XHJcbiAgICAgICAgdGhpcy5rb1Byb2dyZXNzVGV4dCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYucHJvZ3Jlc3NUZXh0OyB9KTtcclxuICAgICAgICB0aGlzLmtvUHJvZ3Jlc3MgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmdldFByb2dyZXNzKCk7IH0pO1xyXG4gICAgICAgIHRoaXMua29TdGF0ZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuc3RhdGU7IH0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZTogUGFnZU1vZGVsLCBvbGRWYWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgc3VwZXIuY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzaWduTW9kZSAmJiB0aGlzLmZvY3VzRmlyc3RRdWVzdGlvbkF1dG9tYXRpYykgdGhpcy5mb2N1c0ZpcnN0UXVlc3Rpb24oKTtcclxuICAgIH1cclxuICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlci5wYWdlVmlzaWJpbGl0eUNoYW5nZWQocGFnZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlS29DdXJyZW50UGFnZSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZFN1cnZleUZyb21TZXJ2aWNlKCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkaW5nU3VydmV5RnJvbVNlcnZpY2UoKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5yZW5kZXJlZEVsZW1lbnQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIGlmICghdGhpcy5pc0ZpcnN0UmVuZGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2VRdWVzdGlvbnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0ZpcnN0UmVuZGVyID0gZmFsc2U7XHJcbiAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHVwZGF0ZUtvQ3VycmVudFBhZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVDdXJyZW50UGFnZVF1ZXN0aW9ucygpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5jdXJyZW50UGFnZSA/IHRoaXMuY3VycmVudFBhZ2UucXVlc3Rpb25zIDogW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHEgPSBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChxLnZpc2libGUpIHFbXCJ1cGRhdGVRdWVzdGlvblwiXSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tub2Nrb3V0L2tvc3VydmV5LnRzXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzM4X187XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiBleHRlcm5hbCB7XCJyb290XCI6XCJrb1wiLFwiY29tbW9uanMyXCI6XCJrbm9ja291dFwiLFwiY29tbW9uanNcIjpcImtub2Nrb3V0XCIsXCJhbWRcIjpcImtub2Nrb3V0XCJ9XG4gKiogbW9kdWxlIGlkID0gMzhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge1BhZ2VNb2RlbCwgUXVlc3Rpb25Sb3dNb2RlbH0gZnJvbSBcIi4uL3BhZ2VcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQmFzZX0gZnJvbSBcIi4uL3F1ZXN0aW9uYmFzZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUm93IGV4dGVuZHMgUXVlc3Rpb25Sb3dNb2RlbCB7XHJcbiAgICBrb1Zpc2libGU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwYWdlOiBQYWdlTW9kZWwsIHB1YmxpYyBxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgc3VwZXIocGFnZSwgcXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMua29WaXNpYmxlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnZpc2libGUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmlzaWJsZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5rb1Zpc2libGUodGhpcy52aXNpYmxlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBrb0FmdGVyUmVuZGVyKGVsLCBjb24pIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciB0RWwgPSBlbFtpXTtcclxuICAgICAgICAgICAgdmFyIG5OYW1lID0gdEVsLm5vZGVOYW1lO1xyXG4gICAgICAgICAgICBpZiAobk5hbWUgPT0gXCIjdGV4dFwiKSB0RWwuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFnZSBleHRlbmRzIFBhZ2VNb2RlbCB7XHJcbiAgICBrb05vOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgdGhpcy5rb05vID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVSb3cocXVlc3Rpb246IFF1ZXN0aW9uQmFzZSk6IFF1ZXN0aW9uUm93TW9kZWwgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUm93KHRoaXMsIHF1ZXN0aW9uKTsgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgIHByb3RlY3RlZCBvbk51bUNoYW5nZWQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMua29Obyh2YWx1ZSA+IDAgPyB2YWx1ZSArIFwiLiBcIiA6IFwiXCIpO1xyXG4gICAgfVxyXG59XHJcbkpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwicGFnZVwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnZSgpOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rbm9ja291dC9rb3BhZ2UudHNcbiAqKi8iLCJleHBvcnQgdmFyIGtvVGVtcGxhdGUgPSB7IGh0bWwgOiBcIlwifTsga29UZW1wbGF0ZS5odG1sID0gJzxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LWNvbW1lbnRcIj4gICAgPCEtLSBrbyBpZjogJHJvb3QuaXNFZGl0TW9kZSAtLT4gICAgPGlucHV0IGRhdGEtYmluZD1cInZhbHVlOiRkYXRhLnF1ZXN0aW9uLmtvQ29tbWVudCwgdmlzaWJsZTokZGF0YS52aXNpYmxlLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi5jb21tZW50XCIgLz4gICAgPCEtLSAva28gLS0+ICAgIDwhLS0ga28gaWY6ICRyb290LmlzRGlzcGxheU1vZGUgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDokZGF0YS5xdWVzdGlvbi5rb0NvbW1lbnQsIHZpc2libGU6JGRhdGEudmlzaWJsZSwgY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24uY29tbWVudFwiPjwvZGl2PiAgICA8IS0tIC9rbyAtLT48L3NjcmlwdD48ZGl2IGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJvb3RcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAodGl0bGUubGVuZ3RoID4gMCkgJiYgc2hvd1RpdGxlICYmIGtvU3RhdGUoKSAhPSBcXCdjb21wbGV0ZWRcXCcsIGNzczogJHJvb3QuY3NzLmhlYWRlclwiPiAgICAgICAgPGgzIGRhdGEtYmluZD1cInRleHQ6cHJvY2Vzc2VkVGl0bGVcIj48L2gzPiAgICA8L2Rpdj4gICAgPCEtLSBrbyBpZjoga29TdGF0ZSgpID09IFwicnVubmluZ1wiIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLmJvZHlcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd1Byb2dyZXNzQmFyID09XFwndG9wXFwnLCB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcHJvZ3Jlc3NcXCcsIGRhdGE6ICRkYXRhIH1cIj48L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzcV9wYWdlXCIgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXBhZ2VcXCcsIGRhdGE6IGtvQ3VycmVudFBhZ2UgfVwiPjwvZGl2PiAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbi10b3A6MTBweFwiIGRhdGEtYmluZD1cInZpc2libGU6IHNob3dQcm9ncmVzc0JhciA9PVxcJ2JvdHRvbVxcJywgdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXByb2dyZXNzXFwnLCBkYXRhOiAkZGF0YSB9XCI+PC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHNob3dOYXZpZ2F0aW9uQnV0dG9ucyAmJiAhaXNEZXNpZ25Nb2RlLCBjc3M6ICRyb290LmNzcy5mb290ZXJcIj4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwidmFsdWU6IHBhZ2VQcmV2VGV4dCwgY2xpY2s6IHByZXZQYWdlLCB2aXNpYmxlOiAha29Jc0ZpcnN0UGFnZSgpLCBjc3M6ICRyb290LmNzc05hdmlnYXRpb25QcmV2XCIgLz4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwidmFsdWU6IHBhZ2VOZXh0VGV4dCwgY2xpY2s6IG5leHRQYWdlLCB2aXNpYmxlOiAha29Jc0xhc3RQYWdlKCksIGNzczogJHJvb3QuY3NzTmF2aWdhdGlvbk5leHRcIiAvPiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogY29tcGxldGVUZXh0LCBjbGljazogY29tcGxldGVMYXN0UGFnZSwgdmlzaWJsZToga29Jc0xhc3RQYWdlKCksIGNzczogJHJvb3QuY3NzTmF2aWdhdGlvbkNvbXBsZXRlXCIgLz4gICAgPC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8IS0tIGtvIGlmOiBrb1N0YXRlKCkgPT0gXCJjb21wbGV0ZWRcIiAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJodG1sOiBwcm9jZXNzZWRDb21wbGV0ZWRIdG1sXCI+PC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8IS0tIGtvIGlmOiBrb1N0YXRlKCkgPT0gXCJsb2FkaW5nXCIgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwiaHRtbDogcHJvY2Vzc2VkTG9hZGluZ0h0bWxcIj48L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDwhLS0ga28gaWY6IGtvU3RhdGUoKSA9PSBcImVtcHR5XCIgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDplbXB0eVN1cnZleVRleHQsIGNzczogJHJvb3QuY3NzLmJvZHlcIj48L2Rpdj4gICAgPCEtLSAva28gLS0+PC9kaXY+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcGFnZVwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHByb2Nlc3NlZFRpdGxlLCBjc3M6ICRyb290LmNzcy5wYWdlVGl0bGVcIj48L2g0PiAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93cywgYXM6IFxcJ3Jvd1xcJ30gLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcm93LmtvVmlzaWJsZSwgY3NzOiAkcm9vdC5jc3Mucm93XCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93LnF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnICwgYWZ0ZXJSZW5kZXI6IHJvdy5rb0FmdGVyUmVuZGVyIH0gLS0+ICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb25cXCcsIGRhdGE6IHF1ZXN0aW9uIH0gLS0+PCEtLSAva28gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+ICAgIDwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXByb2dyZXNzXCI+ICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDo2MCU7XCIgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucHJvZ3Jlc3NcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucHJvZ3Jlc3NCYXIsIHN0eWxlOnt3aWR0aDoga29Qcm9ncmVzcygpICsgXFwnJVxcJ31cIiAgICAgICAgICAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbWluPVwiMFwiICAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OmtvUHJvZ3Jlc3NUZXh0XCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWNoZWNrYm94XCI+ICAgIDxmb3JtIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLmNoZWNrYm94LnJvb3RcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi5rb1Zpc2libGVDaG9pY2VzLCBhczogXFwnaXRlbVxcJywgYWZ0ZXJSZW5kZXI6IHF1ZXN0aW9uLmtvQWZ0ZXJSZW5kZXJ9ICAtLT4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwic3R5bGU6e3dpZHRoOiBxdWVzdGlvbi5rb1dpZHRoLCBcXCdtYXJnaW4tcmlnaHRcXCc6IHF1ZXN0aW9uLmNvbENvdW50ID09IDAgPyBcXCc1cHhcXCc6IFxcJzBweFxcJ30sIGNzczogJHJvb3QuY3NzLmNoZWNrYm94Lml0ZW1cIj4gICAgICAgICAgICA8bGFiZWwgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MuY2hlY2tib3guaXRlbVwiPiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIHZhbHVlOiBpdGVtLnZhbHVlLCBpZDogKCRpbmRleCgpID09IDApID8gcXVlc3Rpb24uaW5wdXRJZCA6IFxcJ1xcJ30sIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWUsIGVuYWJsZTogJHJvb3QuaXNFZGl0TW9kZVwiIC8+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICA8L2xhYmVsPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXIgJiYgKCRpbmRleCgpID09IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMoKS5sZW5ndGgtMSlcIj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogcXVlc3Rpb24ua29PdGhlclZpc2libGUgfSB9LCBjc3M6ICRyb290LmNzcy5jaGVja2JveC5vdGhlclwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9mb3JtPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWNvbW1lbnRcIj4gICAgPCEtLSBrbyBpZjogJHJvb3QuaXNFZGl0TW9kZSAtLT4gICAgPHRleHRhcmVhIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwiYXR0cjoge2NvbHM6IHF1ZXN0aW9uLmNvbHMsIHJvd3M6IHF1ZXN0aW9uLnJvd3MsIGlkOiBxdWVzdGlvbi5pbnB1dElkfSwgdmFsdWU6cXVlc3Rpb24ua29WYWx1ZSwgY3NzOiAkcm9vdC5jc3MuY29tbWVudFwiPjwvdGV4dGFyZWE+ICAgIDwhLS0gL2tvIC0tPiAgICA8IS0tIGtvIGlmOiAkcm9vdC5pc0Rpc3BsYXlNb2RlIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cInRleHQ6cXVlc3Rpb24ua29WYWx1ZSwgY3NzOiAkcm9vdC5jc3MudGV4dFwiPjwvZGl2PiAgICA8IS0tIC9rbyAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1kcm9wZG93blwiPiAgICA8IS0tIGtvIGlmOiAkcm9vdC5pc0VkaXRNb2RlIC0tPiAgICA8c2VsZWN0IGRhdGEtYmluZD1cImF0dHI6IHtpZDogcXVlc3Rpb24uaW5wdXRJZH0sIG9wdGlvbnM6IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCBvcHRpb25zVmFsdWU6IFxcJ3ZhbHVlXFwnLCB2YWx1ZTogcXVlc3Rpb24ua29WYWx1ZSwgb3B0aW9uc0NhcHRpb246IHF1ZXN0aW9uLm9wdGlvbnNDYXB0aW9uLCBjc3M6ICRyb290LmNzcy5kcm9wZG93blwiPjwvc2VsZWN0PiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSBrbyBpZjogJHJvb3QuaXNEaXNwbGF5TW9kZSAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLmtvVmFsdWUsIGNzczogJHJvb3QuY3NzLmRyb3Bkb3duXCI+PC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiBxdWVzdGlvbi5rb090aGVyVmlzaWJsZSB9IH1cIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZXJyb3JzXCI+ICAgIDxkaXYgcm9sZT1cImFsZXJ0XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29FcnJvcnMoKS5sZW5ndGggPiAwLCBmb3JlYWNoOiB7IGRhdGE6IGtvRXJyb3JzLCBhczogXFwnZXJyb3JcXCd9LCBjc3M6ICRyb290LmNzcy5lcnJvci5yb290XCI+ICAgICAgICA8ZGl2PiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLmVycm9yLmljb25cIj48L3NwYW4+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDplcnJvci5nZXRUZXh0KCksIGNzczogJHJvb3QuY3NzLmVycm9yLml0ZW1cIj48L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZmlsZVwiPiAgICA8IS0tIGtvIGlmOiAkcm9vdC5pc0VkaXRNb2RlIC0tPiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7aWQ6IHF1ZXN0aW9uLmlucHV0SWR9LCBldmVudDoge2NoYW5nZTogZG9jaGFuZ2V9XCI+ICAgIDwhLS0gL2tvIC0tPiAgICA8ZGl2PiAgICAgICAgPGltZyBkYXRhLWJpbmQ9XCJhdHRyOiB7IHNyYzogcXVlc3Rpb24ua29EYXRhLCBoZWlnaHQ6IHF1ZXN0aW9uLmltYWdlSGVpZ2h0LCB3aWR0aDogcXVlc3Rpb24uaW1hZ2VXaWR0aCB9LCB2aXNpYmxlOiBxdWVzdGlvbi5rb0hhc1ZhbHVlXCI+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWh0bWxcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJodG1sOiBxdWVzdGlvbi5wcm9jZXNzZWRIdG1sXCI+PC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tbWF0cml4XCI+ICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5tYXRyaXgucm9vdFwiPiAgICAgICAgPHRoZWFkPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc1Jvd3NcIj48L3RoPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmNvbHVtbnMgLS0+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhLnRleHRcIj48L3RoPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90aGVhZD4gICAgICAgIDx0Ym9keT4gICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24udmlzaWJsZVJvd3MsIGFzOiBcXCdyb3dcXCcgfSAtLT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNSb3dzLCB0ZXh0OnJvdy50ZXh0XCI+PC90ZD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHJvdy5mdWxsTmFtZSwgdmFsdWU6ICRkYXRhLnZhbHVlLCBpZDogKCRpbmRleCgpID09IDApICYmICgkcGFyZW50Q29udGV4dC4kaW5kZXgoKSA9PSAwKSA/IHF1ZXN0aW9uLmlucHV0SWQgOiBcXCdcXCd9LCBjaGVja2VkOiByb3cua29WYWx1ZSwgZW5hYmxlOiAkcm9vdC5pc0VkaXRNb2RlXCIgXCIvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhkcm9wZG93blwiPiAgICA8ZGl2IGRhdGEtYmluZD1cInN0eWxlOiB7b3ZlcmZsb3dYOiBxdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsPyBcXCdzY3JvbGxcXCc6IFxcJ1xcJ31cIj4gICAgICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5tYXRyaXhkcm9wZG93bi5yb290XCI+ICAgICAgICAgICAgPHRoZWFkPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWVzdGlvbi5nZXRDb2x1bW5UaXRsZSgkZGF0YSksIHN0eWxlOiB7IG1pbldpZHRoOiBxdWVzdGlvbi5nZXRDb2x1bW5XaWR0aCgkZGF0YSkgfVwiPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8L3RoZWFkPiAgICAgICAgICAgIDx0Ym9keT4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVSb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OnJvdy50ZXh0XCI+PC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcm93LmNlbGxzLS0+ICAgICAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tZXJyb3JzXFwnLCBkYXRhOiAkZGF0YS5xdWVzdGlvbiB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArICRkYXRhLnF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogJGRhdGEucXVlc3Rpb24sIGFzOiBcXCdxdWVzdGlvblxcJyB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgPC90YWJsZT4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tbWF0cml4ZHluYW1pY1wiPiAgICA8ZGl2IGRhdGEtYmluZD1cInN0eWxlOiB7b3ZlcmZsb3dYOiBxdWVzdGlvbi5ob3Jpem9udGFsU2Nyb2xsPyBcXCdzY3JvbGxcXCc6IFxcJ1xcJ31cIj4gICAgICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5tYXRyaXhkeW5hbWljLnJvb3RcIj4gICAgICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWVzdGlvbi5nZXRDb2x1bW5UaXRsZSgkZGF0YSksIHN0eWxlOiB7IG1pbldpZHRoOiBxdWVzdGlvbi5nZXRDb2x1bW5XaWR0aCgkZGF0YSkgfVwiPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gaWY6ICRyb290LmlzRWRpdE1vZGUgLS0+ICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwvdGhlYWQ+ICAgICAgICAgICAgPHRib2R5PiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24ua29Sb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcm93LmNlbGxzLS0+ICAgICAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tZXJyb3JzXFwnLCBkYXRhOiAkZGF0YS5xdWVzdGlvbiB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArICRkYXRhLnF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogJGRhdGEucXVlc3Rpb24sIGFzOiBcXCdxdWVzdGlvblxcJyB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBpZjogJHJvb3QuaXNFZGl0TW9kZSAtLT4gICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOnF1ZXN0aW9uLmtvUmVtb3ZlUm93Q2xpY2ssIGNzczogJHJvb3QuY3NzLm1hdHJpeGR5bmFtaWMuYnV0dG9uLCB2YWx1ZTogcXVlc3Rpb24ucmVtb3ZlUm93VGV4dFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgPC90YWJsZT4gICAgPC9kaXY+ICAgIDwhLS0ga28gaWY6ICRyb290LmlzRWRpdE1vZGUgLS0+ICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6cXVlc3Rpb24ua29BZGRSb3dDbGljaywgY3NzOiAkcm9vdC5jc3MubWF0cml4ZHluYW1pYy5idXR0b24sIHZhbHVlOiBxdWVzdGlvbi5hZGRSb3dUZXh0XCIgLz4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tbXVsdGlwbGV0ZXh0XCI+ICAgIDx0YWJsZSBkYXRhLWJpbmQ9XCJjc3M6ICRyb290LmNzcy5tdWx0aXBsZXRleHQucm9vdCwgZm9yZWFjaDogeyBkYXRhOiAgcXVlc3Rpb24ua29Sb3dzLCBhczogXFwncm93XFwnIH1cIj4gICAgICAgIDx0ciBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB7IGRhdGE6IHJvdywgYXM6IFxcJ2l0ZW1cXCcgfVwiPiAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRpdGxlLCBjc3M6ICRyb290LmNzcy5tdWx0aXBsZXRleHQuaXRlbVRpdGxlXCI+PC90ZD4gICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gaWY6ICRyb290LmlzRWRpdE1vZGUgLS0+ICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHN0eWxlPVwiZmxvYXQ6bGVmdFwiIGRhdGEtYmluZD1cImF0dHI6IHtzaXplOiBxdWVzdGlvbi5pdGVtU2l6ZSwgaWQ6ICgkaW5kZXgoKSA9PSAwKSA/IHF1ZXN0aW9uLmlucHV0SWQgOiBcXCdcXCd9LCB2YWx1ZTogaXRlbS5rb1ZhbHVlLCBjc3M6ICRyb290LmNzcy5tdWx0aXBsZXRleHQuaXRlbVZhbHVlXCIgLz4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDwhLS0ga28gaWY6ICRyb290LmlzRGlzcGxheU1vZGUgLS0+ICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDpsZWZ0XCIgZGF0YS1iaW5kPVwiYXR0cjoge3NpemU6IHF1ZXN0aW9uLml0ZW1TaXplfSwgdGV4dDogaXRlbS5rb1ZhbHVlLCBjc3M6ICRyb290LmNzcy5tdWx0aXBsZXRleHQuaXRlbVZhbHVlXCI+PC9kaXY+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdGQ+ICAgICAgICA8L3RyPiAgICA8L3RhYmxlPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXJhZGlvZ3JvdXBcIj4gICAgPGZvcm0gZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3MucmFkaW9ncm91cC5yb290XCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24ua29WaXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgICAgICA8ZGl2ICBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IHF1ZXN0aW9uLmtvV2lkdGgsIFxcJ21hcmdpbi1yaWdodFxcJzogcXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFxcJzVweFxcJzogXFwnMHB4XFwnfSwgY3NzOiAkcm9vdC5jc3MucmFkaW9ncm91cC5pdGVtXCI+ICAgICAgICAgICAgPGxhYmVsIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJhZGlvZ3JvdXAuaXRlbVwiPiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIHZhbHVlOiBpdGVtLnZhbHVlLCBpZDogKCRpbmRleCgpID09IDApID8gcXVlc3Rpb24uaW5wdXRJZCA6IFxcJ1xcJ30sIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWUsIGVuYWJsZTogJHJvb3QuaXNFZGl0TW9kZVwiIC8+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICA8L2xhYmVsPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXIgJiYgKCRpbmRleCgpID09IHF1ZXN0aW9uLmtvVmlzaWJsZUNob2ljZXMoKS5sZW5ndGgtMSlcIj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogcXVlc3Rpb24ua29PdGhlclZpc2libGV9fSwgY3NzOiAkcm9vdC5jc3MucmFkaW9ncm91cC5vdGhlclwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9mb3JtPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXJhdGluZ1wiPiAgICA8ZGl2IGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnJhdGluZy5yb290XCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmtvVmlzaWJsZVJhdGVWYWx1ZXMgLS0+ICAgICAgICA8bGFiZWwgZGF0YS1iaW5kPVwiY3NzOiBxdWVzdGlvbi5rb0dldENzcygkZGF0YSlcIj4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiICAgICAgICAgICAgICAgICAgICBkYXRhLWJpbmQ9XCJhdHRyOiB7bmFtZTogcXVlc3Rpb24ubmFtZSwgaWQ6IHF1ZXN0aW9uLm5hbWUgKyAkaW5kZXgoKSwgdmFsdWU6ICRkYXRhLnZhbHVlfSwgZXZlbnQ6IHsgY2hhbmdlOiBxdWVzdGlvbi5rb0NoYW5nZX0sIGVuYWJsZTogJHJvb3QuaXNFZGl0TW9kZVwiIC8+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogJGluZGV4KCkgPT0gMCwgdGV4dDogcXVlc3Rpb24ubWluaW51bVJhdGVEZXNjcmlwdGlvblwiPjwvc3Bhbj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkZGF0YS50ZXh0XCI+PC9zcGFuPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInZpc2libGU6ICRpbmRleCgpID09IChxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzKCkubGVuZ3RoLTEpLCB0ZXh0OiBxdWVzdGlvbi5tYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCI+PC9zcGFuPiAgICAgICAgPC9sYWJlbD4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNPdGhlclwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiB9IH1cIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tdGV4dFwiPiAgICA8IS0tIGtvIGlmOiAkcm9vdC5pc0VkaXRNb2RlIC0tPiAgICA8aW5wdXQgZGF0YS1iaW5kPVwiYXR0cjoge3R5cGU6IHF1ZXN0aW9uLmlucHV0VHlwZSwgc2l6ZTogcXVlc3Rpb24uc2l6ZSwgaWQ6IHF1ZXN0aW9uLmlucHV0SWR9LCB2YWx1ZTpxdWVzdGlvbi5rb1ZhbHVlLCBjc3M6ICRyb290LmNzcy50ZXh0XCIvPiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSBrbyBpZjogJHJvb3QuaXNEaXNwbGF5TW9kZSAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLmtvVmFsdWUsIGNzczogJHJvb3QuY3NzLnRleHRcIj48L2Rpdj4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb25cIj4gICAgPGRpdiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOnRvcFwiIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLnF1ZXN0aW9uLnJvb3QsIHN0eWxlOiB7ZGlzcGxheTogcXVlc3Rpb24ua29WaXNpYmxlKCkgPyBcXCdpbmxpbmUtYmxvY2tcXCc6IFxcJ25vbmVcXCcsIG1hcmdpbkxlZnQ6IHF1ZXN0aW9uLmtvTWFyZ2luTGVmdCwgcGFkZGluZ1JpZ2h0OiBxdWVzdGlvbi5rb1BhZGRpbmdSaWdodCwgd2lkdGg6IHF1ZXN0aW9uLmtvUmVuZGVyV2lkdGggfSwgYXR0cjoge2lkOiBpZH1cIj4gICAgICAgIDwhLS0ga28gaWY6IHF1ZXN0aW9uLmhhc1RpdGxlIC0tPiAgICAgICAgPGg1IGRhdGEtYmluZD1cInZpc2libGU6ICRyb290LnF1ZXN0aW9uVGl0bGVMb2NhdGlvbiA9PSBcXCd0b3BcXCcsIHRleHQ6IHF1ZXN0aW9uLmtvVGl0bGUoKSwgY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24udGl0bGVcIj48L2g1PiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvbi1lcnJvcnNcXCcsIGRhdGE6IHF1ZXN0aW9uIH0gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArIHF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogcXVlc3Rpb24sIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb1F1ZXN0aW9uQWZ0ZXJSZW5kZXIgfSAtLT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNDb21tZW50XCI+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLmNvbW1lbnRUZXh0XCI+PC9kaXY+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogdHJ1ZSB9IH1cIj48L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPCEtLSBrbyBpZjogcXVlc3Rpb24uaGFzVGl0bGUgLS0+ICAgICAgICA8aDUgZGF0YS1iaW5kPVwidmlzaWJsZTogJHJvb3QucXVlc3Rpb25UaXRsZUxvY2F0aW9uID09IFxcJ2JvdHRvbVxcJywgdGV4dDogcXVlc3Rpb24ua29UaXRsZSgpLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi50aXRsZVwiPjwvaDU+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+PC9zY3JpcHQ+JztcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rbm9ja291dC90ZW1wbGF0ZS5rby5odG1sLnRzXG4gKiovIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25CYXNlfSBmcm9tIFwiLi4vcXVlc3Rpb25iYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25JbXBsZW1lbnRvckJhc2Uge1xyXG4gICAga29WaXNpYmxlOiBhbnk7IGtvRXJyb3JzOiBhbnk7IGtvTWFyZ2luTGVmdDogYW55OyBrb1BhZGRpbmdSaWdodDogYW55OyBrb1JlbmRlcldpZHRoOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb246IFF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBxdWVzdGlvbi52aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uVmlzaWJpbGl0eUNoYW5nZWQoKTsgfTtcclxuICAgICAgICBxdWVzdGlvbi5yZW5kZXJXaWR0aENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblJlbmRlcldpZHRoQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgIHRoaXMua29WaXNpYmxlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnF1ZXN0aW9uLnZpc2libGUpO1xyXG4gICAgICAgIHRoaXMua29SZW5kZXJXaWR0aCA9IGtvLm9ic2VydmFibGUodGhpcy5xdWVzdGlvbi5yZW5kZXJXaWR0aCk7XHJcbiAgICAgICAgdGhpcy5rb0Vycm9ycyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHRoaXMua29NYXJnaW5MZWZ0ID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5rb1JlbmRlcldpZHRoKCk7IHJldHVybiBzZWxmLmdldEluZGVudFNpemUoc2VsZi5xdWVzdGlvbi5pbmRlbnQpOyB9KTtcclxuICAgICAgICB0aGlzLmtvUGFkZGluZ1JpZ2h0ID0ga28ub2JzZXJ2YWJsZShzZWxmLmdldEluZGVudFNpemUoc2VsZi5xdWVzdGlvbi5yaWdodEluZGVudCkpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1Zpc2libGVcIl0gPSB0aGlzLmtvVmlzaWJsZTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29SZW5kZXJXaWR0aFwiXSA9IHRoaXMua29SZW5kZXJXaWR0aDtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29FcnJvcnNcIl0gPSB0aGlzLmtvRXJyb3JzO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb01hcmdpbkxlZnRcIl0gPSB0aGlzLmtvTWFyZ2luTGVmdDtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29QYWRkaW5nUmlnaHRcIl0gPSB0aGlzLmtvUGFkZGluZ1JpZ2h0O1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJ1cGRhdGVRdWVzdGlvblwiXSA9IGZ1bmN0aW9uICgpIHsgc2VsZi51cGRhdGVRdWVzdGlvbigpOyB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlUXVlc3Rpb24oKSB7ICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLmtvVmlzaWJsZSh0aGlzLnF1ZXN0aW9uLnZpc2libGUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uUmVuZGVyV2lkdGhDaGFuZ2VkKCkge1xyXG4gICAgICAgIHRoaXMua29SZW5kZXJXaWR0aCh0aGlzLnF1ZXN0aW9uLnJlbmRlcldpZHRoKTtcclxuICAgICAgICB0aGlzLmtvUGFkZGluZ1JpZ2h0KHRoaXMuZ2V0SW5kZW50U2l6ZSh0aGlzLnF1ZXN0aW9uLnJpZ2h0SW5kZW50KSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEluZGVudFNpemUoaW5kZW50OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChpbmRlbnQgPCAxKSByZXR1cm4gXCJcIjtcclxuICAgICAgICBpZiAoIXRoaXMucXVlc3Rpb25bXCJkYXRhXCJdKSByZXR1cm4gXCJcIjtcclxuICAgICAgICB2YXIgY3NzID0gdGhpcy5xdWVzdGlvbltcImRhdGFcIl1bXCJjc3NcIl07XHJcbiAgICAgICAgaWYgKCFjc3MpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHJldHVybiBpbmRlbnQgKiBjc3MucXVlc3Rpb24uaW5kZW50ICsgXCJweFwiO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbmJhc2UudHNcbiAqKi8iLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yQmFzZX0gZnJvbSBcIi4va29xdWVzdGlvbmJhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25JbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlIHtcclxuICAgIHByaXZhdGUgaXNVcGRhdGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBrb0R1bW15OiBhbnk7XHJcbiAgICBrb1ZhbHVlOiBhbnk7IGtvQ29tbWVudDogYW55OyBrb1RpdGxlOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBxdWVzdGlvbi52YWx1ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZhbHVlQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgIHF1ZXN0aW9uLmNvbW1lbnRDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Db21tZW50Q2hhbmdlZCgpOyB9O1xyXG4gICAgICAgIHF1ZXN0aW9uLmVycm9yc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkVycm9yc0NoYW5nZWQoKTsgfTtcclxuICAgICAgICBxdWVzdGlvbi50aXRsZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZpc2libGVJbmRleENoYW5nZWQoKTsgfTtcclxuICAgICAgICBxdWVzdGlvbi52aXNpYmxlSW5kZXhDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25WaXNpYmxlSW5kZXhDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgdGhpcy5rb0R1bW15ID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICB0aGlzLmtvVmFsdWUgPSB0aGlzLmNyZWF0ZWtvVmFsdWUoKTtcclxuICAgICAgICB0aGlzLmtvQ29tbWVudCA9IGtvLm9ic2VydmFibGUodGhpcy5xdWVzdGlvbi5jb21tZW50KTtcclxuICAgICAgICB0aGlzLmtvVGl0bGUgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvRHVtbXkoKTsgcmV0dXJuIHNlbGYucXVlc3Rpb24uZnVsbFRpdGxlOyB9KTtcclxuICAgICAgICB0aGlzLmtvRXJyb3JzKHRoaXMucXVlc3Rpb24uZXJyb3JzKTtcclxuICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBzZWxmLnVwZGF0ZVZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmtvQ29tbWVudC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlQ29tbWVudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmFsdWVcIl0gPSB0aGlzLmtvVmFsdWU7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvQ29tbWVudFwiXSA9IHRoaXMua29Db21tZW50O1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1RpdGxlXCJdID0gdGhpcy5rb1RpdGxlO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1F1ZXN0aW9uQWZ0ZXJSZW5kZXJcIl0gPSB0aGlzLmtvUXVlc3Rpb25BZnRlclJlbmRlcjtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVRdWVzdGlvbigpIHtcclxuICAgICAgICB0aGlzLmtvRHVtbXkodGhpcy5rb0R1bW15KCkgKyAxKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1VwZGF0aW5nKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zZXRrb1ZhbHVlKHRoaXMucXVlc3Rpb24udmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ29tbWVudENoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNVcGRhdGluZykgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMua29Db21tZW50KHRoaXMucXVlc3Rpb24uY29tbWVudCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLmtvVmlzaWJsZSh0aGlzLnF1ZXN0aW9uLnZpc2libGUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmlzaWJsZUluZGV4Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLmtvRHVtbXkodGhpcy5rb0R1bW15KCkgKyAxKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkVycm9yc0NoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5rb0Vycm9ycyh0aGlzLnF1ZXN0aW9uLmVycm9ycyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkgeyByZXR1cm4ga28ub2JzZXJ2YWJsZSh0aGlzLnF1ZXN0aW9uLnZhbHVlKTsgfVxyXG4gICAgcHJvdGVjdGVkIHNldGtvVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZUNvbW1lbnQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5jb21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Tm8oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvbi52aXNpYmxlSW5kZXggPiAtMSA/IHRoaXMucXVlc3Rpb24udmlzaWJsZUluZGV4ICsgMSArIFwiLiBcIiA6IFwiXCI7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQga29RdWVzdGlvbkFmdGVyUmVuZGVyKGVsLCBjb24pIHtcclxuICAgICAgICB2YXIgdEVsID0gZWxbMF07XHJcbiAgICAgICAgaWYgKHRFbC5ub2RlTmFtZSA9PSBcIiN0ZXh0XCIpIHRFbC5kYXRhID0gXCJcIjtcclxuICAgICAgICB0RWwgPSBlbFtlbC5sZW5ndGggLSAxXTtcclxuICAgICAgICBpZiAodEVsLm5vZGVOYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgfVxyXG59XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbi50c1xuICoqLyIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uSW1wbGVtZW50b3J9IGZyb20gXCIuL2tvcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25TZWxlY3RCYXNlLCBRdWVzdGlvbkNoZWNrYm94QmFzZX0gZnJvbSBcIi4uL3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblNlbGVjdEJhc2VJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3J7XHJcbiAgICBrb090aGVyVmlzaWJsZTogYW55OyBrb1Zpc2libGVDaG9pY2VzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmtvT3RoZXJWaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvVmFsdWUoKTsgcmV0dXJuIHNlbGYuaXNPdGhlclNlbGVjdGVkOyB9KTtcclxuICAgICAgICB0aGlzLmtvVmlzaWJsZUNob2ljZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKDxRdWVzdGlvbkNoZWNrYm94QmFzZT5zZWxmLnF1ZXN0aW9uKS52aXNpYmxlQ2hvaWNlcyk7XHJcbiAgICAgICAgKDxRdWVzdGlvbkNoZWNrYm94QmFzZT5xdWVzdGlvbikuY2hvaWNlc0NoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb1Zpc2libGVDaG9pY2VzKCg8UXVlc3Rpb25DaGVja2JveEJhc2U+c2VsZi5xdWVzdGlvbikudmlzaWJsZUNob2ljZXMpOyB9O1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb090aGVyVmlzaWJsZVwiXSA9IHRoaXMua29PdGhlclZpc2libGU7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmlzaWJsZUNob2ljZXNcIl0gPSB0aGlzLmtvVmlzaWJsZUNob2ljZXM7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKDxRdWVzdGlvblNlbGVjdEJhc2U+dGhpcy5xdWVzdGlvbikuaXNPdGhlclNlbGVjdGVkO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94QmFzZUltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlSW1wbGVtZW50b3Ige1xyXG4gICAga29XaWR0aDogYW55O1xyXG4gICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMua29XaWR0aCA9IGtvLm9ic2VydmFibGUodGhpcy5jb2xXaWR0aCk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvV2lkdGhcIl0gPSB0aGlzLmtvV2lkdGg7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvQWZ0ZXJSZW5kZXJcIl0gPSB0aGlzLmtvQWZ0ZXJSZW5kZXI7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICg8UXVlc3Rpb25DaGVja2JveEJhc2U+dGhpcy5xdWVzdGlvbikuY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Db2xDb3VudENoYW5nZWQoKTsgfTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkNvbENvdW50Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29XaWR0aFwiXSA9IGtvLm9ic2VydmFibGUodGhpcy5jb2xXaWR0aCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IGNvbFdpZHRoKCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGNvbENvdW50ID0gKDxRdWVzdGlvbkNoZWNrYm94QmFzZT50aGlzLnF1ZXN0aW9uKS5jb2xDb3VudDtcclxuICAgICAgICByZXR1cm4gY29sQ291bnQgPiAwID8gKDEwMCAvIGNvbENvdW50KSArICclJyA6IFwiXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGtvQWZ0ZXJSZW5kZXIoZWwsIGNvbikge1xyXG4gICAgICAgIHZhciB0RWwgPSBlbFswXTtcclxuICAgICAgICBpZiAodEVsLm5vZGVOYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgICAgIHRFbCA9IGVsW2VsLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmICh0RWwubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB0RWwuZGF0YSA9IFwiXCI7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcbiAqKi8iLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNoZWNrYm94QmFzZUltcGxlbWVudG9yfSBmcm9tIFwiLi9rb3F1ZXN0aW9uX2Jhc2VzZWxlY3RcIjtcclxuaW1wb3J0IHtKc29uT2JqZWN0fSBmcm9tIFwiLi4vanNvbm9iamVjdFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uRmFjdG9yeX0gZnJvbSBcIi4uL3F1ZXN0aW9uZmFjdG9yeVwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uQ2hlY2tib3hNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2NoZWNrYm94XCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuLi9xdWVzdGlvblwiO1xyXG5cclxuY2xhc3MgUXVlc3Rpb25DaGVja2JveEltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9uLnZhbHVlID8ga28ub2JzZXJ2YWJsZUFycmF5KHRoaXMucXVlc3Rpb24udmFsdWUpIDoga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZShbXS5jb25jYXQobmV3VmFsdWUpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUoW10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hNb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgbmV3IFF1ZXN0aW9uQ2hlY2tib3hJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJjaGVja2JveFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveChcIlwiKTsgfSk7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9jaGVja2JveC50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4uL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkNvbW1lbnRNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2NvbW1lbnRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yfSBmcm9tIFwiLi9rb3F1ZXN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50IGV4dGVuZHMgUXVlc3Rpb25Db21tZW50TW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImNvbW1lbnRcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChcIlwiKTsgfSk7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9jb21tZW50LnRzXG4gKiovIiwiaW1wb3J0IHtRdWVzdGlvbkRyb3Bkb3duTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9kcm9wZG93blwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25TZWxlY3RCYXNlSW1wbGVtZW50b3J9IGZyb20gXCIuL2tvcXVlc3Rpb25fYmFzZXNlbGVjdFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRHJvcGRvd24gZXh0ZW5kcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvblNlbGVjdEJhc2VJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJkcm9wZG93blwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Ecm9wZG93bihcIlwiKTsgfSk7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25Ecm9wZG93bihuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9kcm9wZG93bi50c1xuICoqLyIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GaWxlTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9maWxlXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25JbXBsZW1lbnRvcn0gZnJvbSBcIi4va29xdWVzdGlvblwiO1xyXG5pbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi4vcXVlc3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkZpbGVJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAga29EYXRhVXBkYXRlcjogYW55OyBrb0RhdGE6IGFueTsga29IYXNWYWx1ZTogYW55O1xyXG4gICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmtvRGF0YVVwZGF0ZXIgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgIHRoaXMua29EYXRhID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvRGF0YVVwZGF0ZXIoKTsgcmV0dXJuICg8UXVlc3Rpb25GaWxlTW9kZWw+c2VsZi5xdWVzdGlvbikucHJldmlld1ZhbHVlOyB9KTtcclxuICAgICAgICB0aGlzLmtvSGFzVmFsdWUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29EYXRhXCJdID0gdGhpcy5rb0RhdGE7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvSGFzVmFsdWVcIl0gPSB0aGlzLmtvSGFzVmFsdWU7XHJcblxyXG4gICAgICAgICg8UXVlc3Rpb25GaWxlTW9kZWw+dGhpcy5xdWVzdGlvbikucHJldmlld1ZhbHVlTG9hZGVkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Mb2FkUHJldmlldygpOyB9O1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJkb2NoYW5nZVwiXSA9IGZ1bmN0aW9uIChkYXRhLCBldmVudCkgeyB2YXIgc3JjID0gZXZlbnQudGFyZ2V0IHx8IGV2ZW50LnNyY0VsZW1lbnQ7IHNlbGYub25DaGFuZ2Uoc3JjKTsgfTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25DaGFuZ2Uoc3JjOiBhbnkpIHtcclxuICAgICAgICBpZiAoIXdpbmRvd1tcIkZpbGVSZWFkZXJcIl0pIHJldHVybjtcclxuICAgICAgICBpZiAoIXNyYyB8fCAhc3JjLmZpbGVzIHx8IHNyYy5maWxlcy5sZW5ndGggPCAxKSByZXR1cm47XHJcbiAgICAgICAgKDxRdWVzdGlvbkZpbGVNb2RlbD50aGlzLnF1ZXN0aW9uKS5sb2FkRmlsZShzcmMuZmlsZXNbMF0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvbkxvYWRQcmV2aWV3KCkge1xyXG4gICAgICAgIHRoaXMua29EYXRhVXBkYXRlcih0aGlzLmtvRGF0YVVwZGF0ZXIoKSArIDEpO1xyXG4gICAgICAgIHRoaXMua29IYXNWYWx1ZSh0cnVlKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25GaWxlIGV4dGVuZHMgUXVlc3Rpb25GaWxlTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvbkZpbGVJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJmaWxlXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGUoXCJcIik7IH0pO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImZpbGVcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkZpbGUobmFtZSk7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fZmlsZS50c1xuICoqLyIsImltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4uL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yQmFzZX0gZnJvbSBcIi4va29xdWVzdGlvbmJhc2VcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkh0bWxNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX2h0bWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbkh0bWwgZXh0ZW5kcyBRdWVzdGlvbkh0bWxNb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImh0bWxcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbChcIlwiKTsgfSk7XHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9odG1sLnRzXG4gKiovIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25NYXRyaXhNb2RlbCwgTWF0cml4Um93TW9kZWwsIElNYXRyaXhEYXRhfSBmcm9tIFwiLi4vcXVlc3Rpb25fbWF0cml4XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25JbXBsZW1lbnRvcn0gZnJvbSBcIi4va29xdWVzdGlvblwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWF0cml4Um93IGV4dGVuZHMgTWF0cml4Um93TW9kZWwge1xyXG4gICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgIGtvVmFsdWU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnksIHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nLCBkYXRhOiBJTWF0cml4RGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKG5hbWUsIHRleHQsIGZ1bGxOYW1lLCBkYXRhLCB2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuaXNWYWx1ZVVwZGF0aW5nKSB0cnVlO1xyXG4gICAgICAgICAgICBzZWxmLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeCBleHRlbmRzIFF1ZXN0aW9uTWF0cml4TW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgZnVsbE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICByZXR1cm4gbmV3IE1hdHJpeFJvdyhuYW1lLCB0ZXh0LCBmdWxsTmFtZSwgdGhpcywgdmFsdWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcIm1hdHJpeFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXgoXCJcIik7IH0pO1xyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeChuYW1lKTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5jb2x1bW5zID0gW1wiQ29sdW1uIDFcIiwgXCJDb2x1bW4gMlwiLCBcIkNvbHVtbiAzXCJdOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXgudHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4uL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yfSBmcm9tIFwiLi9rb3F1ZXN0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEcm9wZG93biBleHRlbmRzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibWF0cml4ZHJvcGRvd25cIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4RHJvcGRvd24oXCJcIik7IH0pO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duKG5hbWUpOyBxLmNob2ljZXMgPSBbMSwgMiwgMywgNCwgNV07IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDFcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDJcIik7IHEuYWRkQ29sdW1uKFwiQ29sdW1uIDNcIik7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX21hdHJpeGRyb3Bkb3duLnRzXG4gKiovIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4uL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yfSBmcm9tIFwiLi9rb3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuLi9xdWVzdGlvblwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uTWF0cml4RHJvcGRvd25Nb2RlbEJhc2V9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bmJhc2VcIjtcclxuaW1wb3J0IHtNYXRyaXhEeW5hbWljUm93TW9kZWx9IGZyb20gXCIuLi9xdWVzdGlvbl9tYXRyaXhkeW5hbWljXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEeW5hbWljSW1wbGVtZW50b3IgZXh0ZW5kcyBRdWVzdGlvbkltcGxlbWVudG9yIHtcclxuICAgIGtvUm93czogYW55OyBrb1JlY2FsYzogYW55O1xyXG4gICAga29BZGRSb3dDbGljazogYW55OyBrb1JlbW92ZVJvd0NsaWNrOiBhbnk7IGtvT3ZlcmZsb3dYOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5rb1JlY2FsYyA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgdGhpcy5rb1Jvd3MgPSBrby5wdXJlQ29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUmVjYWxjKCk7IHJldHVybiAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5jYWNoZWRWaXNpYmxlUm93cztcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICB0aGlzLmtvT3ZlcmZsb3dYID0ga28ucHVyZUNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8UXVlc3Rpb25NYXRyaXhEcm9wZG93bk1vZGVsQmFzZT50aGlzLnF1ZXN0aW9uKS5ob3Jpem9udGFsU2Nyb2xsID8gXCJzY3JvbGxcIjogXCJub25lXCI7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUm93c1wiXSA9IHRoaXMua29Sb3dzO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmtvQWRkUm93Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYWRkUm93KCk7IH1cclxuICAgICAgICB0aGlzLmtvUmVtb3ZlUm93Q2xpY2sgPSBmdW5jdGlvbiAoZGF0YSkgeyBzZWxmLnJlbW92ZVJvdyhkYXRhKTsgfVxyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0FkZFJvd0NsaWNrXCJdID0gdGhpcy5rb0FkZFJvd0NsaWNrO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1JlbW92ZVJvd0NsaWNrXCJdID0gdGhpcy5rb1JlbW92ZVJvd0NsaWNrO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb092ZXJmbG93WFwiXSA9IHRoaXMua29PdmVyZmxvd1g7XHJcbiAgICAgICAgKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbikucm93Q291bnRDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25Sb3dDb3VudENoYW5nZWQoKTsgfTtcclxuICAgICAgICAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5jb2x1bW5zQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29sdW1uQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnVwZGF0ZUNlbGxzQ2FsbGJhayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblVwZGF0ZUNlbGxzKCk7IH07XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25VcGRhdGVDZWxscygpIHtcclxuICAgICAgICAvL0dlbmVyZWF0ZSByb3dzIGFnYWluLlxyXG4gICAgICAgIHZhciByb3dzID0gKDxRdWVzdGlvbk1hdHJpeER5bmFtaWM+dGhpcy5xdWVzdGlvbilbXCJnZW5lcmF0ZWRWaXNpYmxlUm93c1wiXTtcclxuICAgICAgICB2YXIgY29sdW1ucyA9ICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLmNvbHVtbnM7XHJcbiAgICAgICAgaWYgKHJvd3MgJiYgcm93cy5sZW5ndGggPiAwICYmIGNvbHVtbnMgJiYgY29sdW1ucy5sZW5ndGggPiAwKSB0aGlzLm9uQ29sdW1uQ2hhbmdlZCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQ29sdW1uQ2hhbmdlZCgpIHtcclxuICAgICAgICB2YXIgcm93cyA9ICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnZpc2libGVSb3dzO1xyXG4gICAgICAgIHRoaXMub25Sb3dDb3VudENoYW5nZWQoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblJvd0NvdW50Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLmtvUmVjYWxjKHRoaXMua29SZWNhbGMoKSArIDEpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGFkZFJvdygpIHtcclxuICAgICAgICAoPFF1ZXN0aW9uTWF0cml4RHluYW1pYz50aGlzLnF1ZXN0aW9uKS5hZGRSb3coKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCByZW1vdmVSb3cocm93OiBNYXRyaXhEeW5hbWljUm93TW9kZWwpIHtcclxuICAgICAgICB2YXIgcm93cyA9ICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLmNhY2hlZFZpc2libGVSb3dzO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHJvd3MuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICg8UXVlc3Rpb25NYXRyaXhEeW5hbWljPnRoaXMucXVlc3Rpb24pLnJlbW92ZVJvdyhpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXhEeW5hbWljIGV4dGVuZHMgUXVlc3Rpb25NYXRyaXhEeW5hbWljTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvbk1hdHJpeER5bmFtaWNJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtYXRyaXhkeW5hbWljXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeER5bmFtaWMoXCJcIik7IH0pO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkeW5hbWljXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4RHluYW1pYyhuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLnJvd0NvdW50ID0gMjsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMVwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMlwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gM1wiKTsgcmV0dXJuIHE7IH0pO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4ZHluYW1pYy50c1xuICoqLyIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwsIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX211bHRpcGxldGV4dFwiO1xyXG5pbXBvcnQge1F1ZXN0aW9uSW1wbGVtZW50b3J9IGZyb20gXCIuL2tvcXVlc3Rpb25cIjtcclxuaW1wb3J0IHtRdWVzdGlvbn0gZnJvbSBcIi4uL3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7SnNvbk9iamVjdH0gZnJvbSBcIi4uL2pzb25vYmplY3RcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkZhY3Rvcnl9IGZyb20gXCIuLi9xdWVzdGlvbmZhY3RvcnlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNdWx0aXBsZVRleHRJdGVtIGV4dGVuZHMgTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgIHByaXZhdGUgaXNLT1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgIGtvVmFsdWU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnkgPSBudWxsLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHN1cGVyKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAoIXNlbGYuaXNLT1ZhbHVlVXBkYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgb25WYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuaXNLT1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc0tPVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25NdWx0aXBsZVRleHRJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAga29Sb3dzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5rb1Jvd3MgPSBrby5vYnNlcnZhYmxlQXJyYXkoKDxRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsPnRoaXMucXVlc3Rpb24pLmdldFJvd3MoKSk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvUm93c1wiXSA9IHRoaXMua29Sb3dzO1xyXG4gICAgICAgIHRoaXMub25Db2xDb3VudENoYW5nZWQoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgKDxRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsPnRoaXMucXVlc3Rpb24pLmNvbENvdW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29sQ291bnRDaGFuZ2VkKCk7IH07XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25Db2xDb3VudENoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5rb1Jvd3MoKDxRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsPnRoaXMucXVlc3Rpb24pLmdldFJvd3MoKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvbk11bHRpcGxlVGV4dCBleHRlbmRzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dEltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVRleHRJdGVtKG5hbWU6IHN0cmluZywgdGl0bGU6IHN0cmluZyk6IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKG5hbWUsIHRpdGxlKTtcclxuICAgIH1cclxufVxyXG5cclxuSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtdWx0aXBsZXRleHRpdGVtXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKFwiXCIpOyB9KTtcclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibXVsdGlwbGV0ZXh0XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChcIlwiKTsgfSk7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChuYW1lKTsgcS5hZGRJdGVtKFwidGV4dDFcIik7IHEuYWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9tdWx0aXBsZXRleHQudHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uUmFkaW9ncm91cE1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fcmFkaW9ncm91cFwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvcn0gZnJvbSBcIi4va29xdWVzdGlvbl9iYXNlc2VsZWN0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUXVlc3Rpb25SYWRpb2dyb3VwIGV4dGVuZHMgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIG5ldyBRdWVzdGlvbkNoZWNrYm94QmFzZUltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcInJhZGlvZ3JvdXBcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cChcIlwiKTsgfSk7XHJcblxyXG5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rbm9ja291dC9rb3F1ZXN0aW9uX3JhZGlvZ3JvdXAudHNcbiAqKi8iLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtRdWVzdGlvbkltcGxlbWVudG9yfSBmcm9tIFwiLi9rb3F1ZXN0aW9uXCI7XHJcbmltcG9ydCB7UXVlc3Rpb25SYXRpbmdNb2RlbH0gZnJvbSBcIi4uL3F1ZXN0aW9uX3JhdGluZ1wiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb259IGZyb20gXCIuLi9xdWVzdGlvblwiO1xyXG5cclxuY2xhc3MgUXVlc3Rpb25SYXRpbmdJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAga29WaXNpYmxlUmF0ZVZhbHVlczogYW55OyBrb0NoYW5nZTogYW55OyBrb0NzczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMua29WaXNpYmxlUmF0ZVZhbHVlcyA9IGtvLm9ic2VydmFibGVBcnJheSh0aGlzLmdldFZhbHVlcygpKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29WaXNpYmxlUmF0ZVZhbHVlc1wiXSA9IHRoaXMua29WaXNpYmxlUmF0ZVZhbHVlcztcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb0NoYW5nZSA9IGZ1bmN0aW9uICh2YWwpIHsgc2VsZi5rb1ZhbHVlKHZhbC5pdGVtVmFsdWUpOyB9O1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0NoYW5nZVwiXSA9IHRoaXMua29DaGFuZ2U7XHJcbiAgICAgICAgKDxRdWVzdGlvblJhdGluZz50aGlzLnF1ZXN0aW9uKS5yYXRlVmFsdWVzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uUmF0ZVZhbHVlc0NoYW5nZWQoKTsgfTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29HZXRDc3NcIl0gPSBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgICAgICAgIHZhciBjc3MgPSAoPFF1ZXN0aW9uUmF0aW5nPnNlbGYucXVlc3Rpb24pLml0ZW1Dc3M7XHJcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnF1ZXN0aW9uW1wia29WYWx1ZVwiXSgpID09IHZhbC52YWx1ZSA/IGNzcyArIFwiIGFjdGl2ZVwiIDogY3NzOyB9O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uUmF0ZVZhbHVlc0NoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5rb1Zpc2libGVSYXRlVmFsdWVzKHRoaXMuZ2V0VmFsdWVzKCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRWYWx1ZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiAoPFF1ZXN0aW9uUmF0aW5nPnRoaXMucXVlc3Rpb24pLnZpc2libGVSYXRlVmFsdWVzOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZyBleHRlbmRzIFF1ZXN0aW9uUmF0aW5nTW9kZWwge1xyXG4gICAgcHVibGljIGl0ZW1Dc3M6IHN0cmluZztcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICBuZXcgUXVlc3Rpb25SYXRpbmdJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblNldERhdGEoKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtQ3NzID0gdGhpcy5kYXRhW1wiY3NzXCJdLnJhdGluZy5pdGVtO1xyXG4gICAgfVxyXG59XHJcblxyXG5Kc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcInJhdGluZ1wiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmcoXCJcIik7IH0pO1xyXG5cclxuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZyhuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl9yYXRpbmcudHNcbiAqKi8iLCJpbXBvcnQge1F1ZXN0aW9uVGV4dE1vZGVsfSBmcm9tIFwiLi4vcXVlc3Rpb25fdGV4dFwiO1xyXG5pbXBvcnQge0pzb25PYmplY3R9IGZyb20gXCIuLi9qc29ub2JqZWN0XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25GYWN0b3J5fSBmcm9tIFwiLi4vcXVlc3Rpb25mYWN0b3J5XCI7XHJcbmltcG9ydCB7UXVlc3Rpb25JbXBsZW1lbnRvcn0gZnJvbSBcIi4va29xdWVzdGlvblwiO1xyXG5pbXBvcnQge1F1ZXN0aW9ufSBmcm9tIFwiLi4vcXVlc3Rpb25cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHRJbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5xdWVzdGlvbi52YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUodGhpcy5xdWVzdGlvbi52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFF1ZXN0aW9uVGV4dCBleHRlbmRzIFF1ZXN0aW9uVGV4dE1vZGVsIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICBuZXcgUXVlc3Rpb25UZXh0SW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwidGV4dFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0KFwiXCIpOyB9KTtcclxuXHJcblF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dChuYW1lKTsgfSk7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQva29xdWVzdGlvbl90ZXh0LnRzXG4gKiovIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5V2luZG93TW9kZWx9IGZyb20gXCIuLi9zdXJ2ZXlXaW5kb3dcIjtcclxuaW1wb3J0IHtTdXJ2ZXlNb2RlbH0gZnJvbSBcIi4uL3N1cnZleVwiO1xyXG5pbXBvcnQge1N1cnZleX0gZnJvbSBcIi4va29zdXJ2ZXlcIjtcclxuaW1wb3J0IHtrb1RlbXBsYXRlfSBmcm9tICcuL3RlbXBsYXRlLndpbmRvdy5rby5odG1sJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVdpbmRvdyBleHRlbmRzIFN1cnZleVdpbmRvd01vZGVsIHtcclxuICAgIGtvRXhwYW5kZWQ6IGFueTtcclxuICAgIGtvRXhwYW5kZWRDc3M6IGFueTtcclxuICAgIGRvRXhwYW5kOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihqc29uT2JqKTtcclxuICAgICAgICB0aGlzLmtvRXhwYW5kZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvRXhwYW5kZWRDc3MgPSBrby5vYnNlcnZhYmxlKHRoaXMuZ2V0QnV0dG9uQ3NzKCkpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvRXhwYW5kID0gZnVuY3Rpb24gKCkgeyBzZWxmLmNoYW5nZUV4cGFuZGVkKCk7IH1cclxuICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4geyBzZWxmLm9uQ29tcGxldGUoKTsgc2VsZi5rb0V4cGFuZGVkQ3NzKHNlbGYuZ2V0QnV0dG9uQ3NzKCkpIH0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZVN1cnZleShqc29uT2JqOiBhbnkpOiBTdXJ2ZXlNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXkoanNvbk9iailcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBleHBhbmRjb2xsYXBzZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyLmV4cGFuZGNvbGxhcHNlKHZhbHVlKTtcclxuICAgICAgICB0aGlzLmtvRXhwYW5kZWQodGhpcy5pc0V4cGFuZGVkVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldCB0ZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZVZhbHVlID8gdGhpcy50ZW1wbGF0ZVZhbHVlIDogdGhpcy5nZXREZWZhdWx0VGVtcGxhdGUoKTsgfVxyXG4gICAgcHJvdGVjdGVkIHNldCB0ZW1wbGF0ZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGVtcGxhdGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2hvdygpIHtcclxuICAgICAgICB0aGlzLndpbmRvd0VsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcclxuICAgICAgICBrby5jbGVhbk5vZGUodGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd0VsZW1lbnQpO1xyXG4gICAgICAgICg8U3VydmV5PnRoaXMuc3VydmV5KS5yZW5kZXIoU3VydmV5V2luZG93LnN1cnZleUVsZW1lbnROYW1lKTtcclxuICAgICAgICB0aGlzLmlzU2hvd2luZ1ZhbHVlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXREZWZhdWx0VGVtcGxhdGUoKTogc3RyaW5nIHsgcmV0dXJuIGtvVGVtcGxhdGUuaHRtbCB9XHJcbiAgICBwdWJsaWMgaGlkZSgpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5pc1Nob3dpbmdWYWx1ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBjc3MoKTogYW55IHsgcmV0dXJuIHRoaXMuc3VydmV5W1wiY3NzXCJdOyB9XHJcbiAgICBwcml2YXRlIGNoYW5nZUV4cGFuZGVkKCkge1xyXG4gICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoIXRoaXMuaXNFeHBhbmRlZCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uQ29tcGxldGUoKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEJ1dHRvbkNzcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5rb0V4cGFuZGVkKCkgPyB0aGlzLmNzcy53aW5kb3cuaGVhZGVyLmJ1dHRvbkNvbGxhcHNlZCA6IHRoaXMuY3NzLndpbmRvdy5oZWFkZXIuYnV0dG9uRXhwYW5kZWQ7XHJcbiAgICB9XHJcbn1cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9rbm9ja291dC9rb1N1cnZleVdpbmRvdy50c1xuICoqLyIsImV4cG9ydCB2YXIga29UZW1wbGF0ZSA9IHsgaHRtbCA6IFwiXCJ9OyBrb1RlbXBsYXRlLmh0bWwgPSAnPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAzcHg7IHJpZ2h0OiAxMHB4O1wiIGRhdGEtYmluZD1cImNzczogJHJvb3QuY3NzLndpbmRvdy5yb290XCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOiAkcm9vdC5jc3Mud2luZG93LmhlYWRlci5yb290XCI+ICAgICAgICA8YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOmRvRXhwYW5kXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+ICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJwYWRkaW5nLXJpZ2h0OjEwcHhcIiBkYXRhLWJpbmQ9XCJ0ZXh0OnRpdGxlLCBjc3M6ICRyb290LmNzcy53aW5kb3cuaGVhZGVyLnRpdGxlXCI+PC9zcGFuPiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGRhdGEtYmluZD1cImNzczoga29FeHBhbmRlZENzc1wiPjwvc3Bhbj4gICAgICAgIDwvYT4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTprb0V4cGFuZGVkLCBjc3M6ICRyb290LmNzcy53aW5kb3cuYm9keVwiPiAgICAgICAgPGRpdiBpZD1cIndpbmRvd1N1cnZleUpTXCI+PC9kaXY+ICAgIDwvZGl2PjwvZGl2Pic7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMva25vY2tvdXQvdGVtcGxhdGUud2luZG93LmtvLmh0bWwudHNcbiAqKi8iLCJpbXBvcnQge2tvVGVtcGxhdGV9IGZyb20gXCIuL3RlbXBsYXRlLmtvLmh0bWxcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlUZW1wbGF0ZVRleHQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlcGxhY2VUZXh0KHJlcGxhY2VUZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHF1ZXN0aW9uVHlwZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIGlkID0gdGhpcy5nZXRJZChpZCwgcXVlc3Rpb25UeXBlKTtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy50ZXh0LmluZGV4T2YoaWQpO1xyXG4gICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgcG9zID0gdGhpcy50ZXh0LmluZGV4T2YoJz4nLCBwb3MpO1xyXG4gICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gcG9zICsgMTtcclxuICAgICAgICB2YXIgZW5kU3RyaW5nID0gXCI8L3NjcmlwdD5cIjtcclxuICAgICAgICBwb3MgPSB0aGlzLnRleHQuaW5kZXhPZihlbmRTdHJpbmcsIHN0YXJ0UG9zKTtcclxuICAgICAgICBpZiAocG9zIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgc3RhcnRQb3MpICsgcmVwbGFjZVRleHQgKyB0aGlzLnRleHQuc3Vic3RyKHBvcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0SWQoaWQ6IHN0cmluZywgcXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJ2lkPVwic3VydmV5LScgKyBpZDtcclxuICAgICAgICBpZiAocXVlc3Rpb25UeXBlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBcIi1cIiArIHF1ZXN0aW9uVHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdCArICdcIic7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIGtvVGVtcGxhdGUuaHRtbDsgfVxyXG4gICAgcHJvdGVjdGVkIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHsga29UZW1wbGF0ZS5odG1sID0gdmFsdWU7IH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2tub2Nrb3V0L3RlbXBsYXRlVGV4dC50c1xuICoqLyIsImltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2RhbmlzaCc7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2R1dGNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vZmlubmlzaCc7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2ZyZW5jaCc7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2dlcm1hbic7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL2dyZWVrJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vcG9saXNoJztcclxuaW1wb3J0ICcuLi8uLi9sb2NhbGl6YXRpb24vcnVzc2lhbic7XHJcbmltcG9ydCAnLi4vLi4vbG9jYWxpemF0aW9uL3R1cmtpc2gnO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudHJpZXMvY2h1bmtzL2xvY2FsaXphdGlvbi50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBkYW5pc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlRpbGJhZ2VcIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJWaWRlcmVcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJGw6ZyZGlnXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiU2lkZSB7MH0gYWYgezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJEZXIgZXIgaW5nZW4gc3lubGlnZSBzcMO4cmdzbcOlbC5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiTWFuZ2UgdGFrIGZvciBkaW4gYmVzdmFyZWxzZSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiU3DDuHJnZXNrZW1hZXQgaGVudGVzIGZyYSBzZXJ2ZXJlbi4uLlwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJWYWxnZnJpdCBzdmFyLi4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJWw6ZsZy4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJCZXN2YXIgdmVubGlnc3Qgc3DDuHJnc23DpWxldC5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJBbmdpdiBldCB0YWwuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIkFuZ2l2IG1pbmRzdCB7MH0gdGVnbi5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIlbDpmxnIHZlbmxpZ3N0IG1pbmRzdCAgezB9IHN2YXJtdWxpZ2hlZChlcikuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJWw6ZsZyB2ZW5saWdzdCBmw6ZycmUgezB9IHN2YXJtdWxpZ2hlZGVyKGVyKS5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiJ3swfScgc2thbCB2w6ZyZSBsaWcgbWVkIGVsbGVyIHN0w7hycmUgZW5kIHsxfSBvZyBsaWcgbWVkIGVsbGVyIG1pbmRyZSBlbmQgezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIid7MH0nIHNrYWwgdsOmcmUgbGlnIG1lZCBlbGxlciBzdMO4cnJlIGVuZCB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiJ3swfScgc2thbCB2w6ZyZSBsaWcgbWVkIGVsbGVyIG1pbmRyZSBlbmQgezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwiQW5naXYgdmVubGlnc3QgZW4gZ3lsZGlnIGUtbWFpbCBhZHJlc3NlLlwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJGaWxzdMO4cnJlbHNlbiBtw6UgaWtrZSBvdmVyc3RpZ2UgezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkFuZ2l2IGVuIHbDpnJkaSBmb3IgZGl0IHZhbGdmcmllIHN2YXIuXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZGFcIl0gPSBkYW5pc2hTdXJ2ZXlTdHJpbmdzO1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9sb2NhbGl6YXRpb24vZGFuaXNoLnRzXG4gKiovIiwiLy9DcmVhdGVkIG9uIGJlaGFsZiBodHRwczovL2dpdGh1Yi5jb20vRnJhbmsxM1xyXG5pbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCB2YXIgZHV0Y2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlZvcmlnZVwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIlZvbGdlbmRlXCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiQWZzbHVpdGVuXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIkFuZGVyZVwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIlBhZ2luYSB7MH0gdmFuIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiRXIgaXMgZ2VlbiB6aWNodGJhcmUgcGFnaW5hIG9mIHZyYWFnIGluIGRlemUgdnJhZ2VubGlqc3RcIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiQmVkYW5rdCBvbSBkZXplIHZyYWdlbmxpanN0IGluIHRlIHZ1bGxlblwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJEZSB2cmFnZW5saWpzdCBpcyBhYW4gaGV0IGxhZGVuLi4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJLaWVzLi4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIkdlbGlldmUgZWVuIGFudHdvb3JkIGluIHRlIHZ1bGxlblwiLFxyXG4gICAgbnVtZXJpY0Vycm9yOiBcIkhldCBhbnR3b29yZCBtb2V0IGVlbiBnZXRhbCB6aWpuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIkdlbGlldmUgbWluc3RlbiB7MH0ga2FyYWt0ZXJzIGluIHRlIHZ1bGxlbi5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIkdlbGlldmUgbWluaW11bSB7MH0gYW50d29vcmRlbiB0ZSBzZWxlY3RlcmVuLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiR2VsaWV2ZSBuaWV0IG1lZXIgZGFuIHswfSBhbnR3b29yZGVuIHRlIHNlbGVjdGVyZW4uXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIlV3IGFudHdvb3JkICd7MH0nIG1vZXQgZ3JvdGVyIG9mIGdlbGlqayB6aWpuIGFhbiB7MX0gZW4ga2xlaW5lciBvZiBnZWxpamsgYWFuIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCJVdyBhbnR3b29yZCAnezB9JyBtb2V0IGdyb3RlciBvZiBnZWxpamsgemlqbiBhYW4gezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIlV3IGFudHdvb3JkICd7MH0nIG1vZXQgZ3JvdGVyIG9mIGdlbGlqayB6aWpuIGFhbiB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJHZWxpZXZlIGVlbiBnZWxkaWcgZS1tYWlsYWRyZXMgaW4gdGUgdnVsbGVuLlwiLFxyXG4gICAgZXhjZWVkTWF4U2l6ZTogXCJEZSBncm9vdHRlIHZhbiBoZXQgYmVzdGFuZCBtYWcgbmlldCBncm90ZXIgemlqbiBkYW4gezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIkdlbGlldmUgaGV0IHZlbGQgJ0FuZGVyZScgaW4gdGUgdnVsbGVuXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wibmxcIl0gPSBkdXRjaFN1cnZleVN0cmluZ3M7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9kdXRjaC50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBmaW5uaXNoU3VydmV5U3RyaW5ncyA9IHtcclxuICAgIHBhZ2VQcmV2VGV4dDogXCJFZGVsbGluZW5cIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJTZXVyYWF2YVwiLFxyXG4gICAgY29tcGxldGVUZXh0OiBcIlZhbG1pc1wiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJNdXUgKGt1dmFpbGUpXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiU2l2dSB7MH0vezF9XCIsXHJcbiAgICBlbXB0eVN1cnZleTogXCJUw6Rzc8OkIGt5c2VseXNzw6QgZWkgb2xlIHlodMOka8Okw6RuIG7DpGt5dmlsbMOkIG9sZXZhYSBzaXZ1YSB0YWkga3lzeW15c3TDpC5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiS2lpdG9zIGt5c2VseXluIHZhc3RhYW1pc2VzdGEhXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcIkt5c2VsecOkIGxhZGF0YWFuIHBhbHZlbGltZWx0YS4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiVmFsaXRzZS4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJWYXN0YWEga3lzeW15a3NlZW4sIGtpaXRvcy5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJBcnZvbiB0dWxlZSBvbGxhIG51bWVlcmluZW4uXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcIk9sZSBoeXbDpCBqYSBzecO2dMOkIHbDpGhpbnTDpMOkbiB7MH0gbWVya2tpw6QuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJPbGUgaHl2w6QgamEgdmFsaXRzZSB2w6RoaW50w6TDpG4gezB9IHZhaWh0b2VodG9hLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiT2xlIGh5dsOkIGphIHZhbGl0c2UgZW5pbnTDpMOkbiB7MH0gdmFpaHRvZWh0b2EuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIid7MH0nIHTDpHl0eXkgb2xsYSBlbmVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7MX0gamEgdsOkaGVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiJ3swfScgdMOkeXR5eSBvbGxhIGVuZW1tw6RuIHRhaSB5aHTDpCBzdXVyaSBrdWluIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCInezB9JyB0w6R5dHl5IG9sbGEgdsOkaGVtbcOkbiB0YWkgeWh0w6Qgc3V1cmkga3VpbiB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJTecO2dMOkIHZhbGlkaSBzw6Roa8O2cG9zdGlvc29pdGUuXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiT2xlIGh5dsOkIGphIHN5w7Z0w6QgXFxcIk11dSAoa3V2YWlsZSlcXFwiXCJcclxufTtcclxuXHJcbnN1cnZleUxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZmlcIl0gPSBmaW5uaXNoU3VydmV5U3RyaW5ncztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2Zpbm5pc2gudHNcbiAqKi8iLCIvL0NyZWF0ZWQgb24gYmVoYWxmIGh0dHBzOi8vZ2l0aHViLmNvbS9GcmFuazEzXHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBmcmVuY2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlByXFx1MDBlOWNcXHUwMGU5ZGVudFwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIlN1aXZhbnRcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJUZXJtaW5lclwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJBdXRyZSAocHJcXHUwMGU5Y2lzZXIpXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiUGFnZSB7MH0gc3VyIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiSWwgbid5IGEgbmkgcGFnZSB2aXNpYmxlIG5pIHF1ZXN0aW9uIHZpc2libGUgZGFucyBjZSBxdWVzdGlvbm5haXJlXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIk1lcmNpIGQnYXZvaXIgclxcdTAwZTlwb25kdSBhdSBxdWVzdGlvbm5haXJlIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJMZSBxdWVzdGlvbm5haXJlIGVzdCBlbiBjb3VycyBkZSBjaGFyZ2VtZW50Li4uXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCJDaG9pc2lzc2V6Li4uXCIsXHJcbiAgICByZXF1aXJlZEVycm9yOiBcIkxhIHJcXHUwMGU5cG9uc2UgXFx1MDBlMCBjZXR0ZSBxdWVzdGlvbiBlc3Qgb2JsaWdhdG9pcmUuXCIsXHJcbiAgICBudW1lcmljRXJyb3I6IFwiTGEgclxcdTAwZTlwb25zZSBkb2l0IFxcdTAwZWF0cmUgdW4gbm9tYnJlLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJNZXJjaSBkJ2VudHJlciBhdSBtb2lucyB7MH0gc3ltYm9sZXMuXCIsXHJcbiAgICBtaW5TZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgbW9pbnMgezB9clxcdTAwZTlwb25zZXMuXCIsXHJcbiAgICBtYXhTZWxlY3RFcnJvcjogXCJNZXJjaSBkZSBzXFx1MDBlOWxlY3Rpb25uZXIgYXUgcGx1cyB7MH1yXFx1MDBlOXBvbnNlcy5cIixcclxuICAgIG51bWVyaWNNaW5NYXg6IFwiVm90cmUgclxcdTAwZTlwb25zZSAnezB9JyBkb2l0IFxcdTAwZWF0cmVzdXBcXHUwMGU5cmlldXJlIG91IFxcdTAwZTlnYWxlIFxcdTAwZTAgezF9IGV0IGluZlxcdTAwZTlyaWV1cmUgb3VcXHUwMGU5Z2FsZSBcXHUwMGUwIHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCJWb3RyZSByXFx1MDBlOXBvbnNlICd7MH0nIGRvaXQgXFx1MDBlYXRyZXN1cFxcdTAwZTlyaWV1cmUgb3UgXFx1MDBlOWdhbGUgXFx1MDBlMCB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiVm90cmUgclxcdTAwZTlwb25zZSAnezB9JyBkb2l0IFxcdTAwZWF0cmVpbmZcXHUwMGU5cmlldXJlIG91IFxcdTAwZTlnYWxlIFxcdTAwZTAgezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwiTWVyY2kgZCdlbnRyZXIgdW5lIGFkcmVzc2UgbWFpbCB2YWxpZGUuXCIsXHJcbiAgICBleGNlZWRNYXhTaXplOiBcIkxhIHRhaWxsZSBkdSBmaWNoaWVyIG5lIGRvaXQgcGFzIGV4Y1xcdTAwZTlkZXIgezB9LlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcIk1lcmNpIGRlIHByXFx1MDBlOWNpc2VyIGxlIGNoYW1wICdBdXRyZScuXCJcclxufTtcclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJmclwiXSA9IGZyZW5jaFN1cnZleVN0cmluZ3M7XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2ZyZW5jaC50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBnZXJtYW5TdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIlp1csO8Y2tcIixcclxuICAgIHBhZ2VOZXh0VGV4dDogXCJXZWl0ZXJcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCJGZXJ0aWdcIixcclxuICAgIHByb2dyZXNzVGV4dDogXCJTZWl0ZSB7MH0gdm9uIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiRXMgZ2lidCBrZWluZSBzaWNodGJhcmUgRnJhZ2UuXCIsXHJcbiAgICBjb21wbGV0aW5nU3VydmV5OiBcIlZpZWxlbiBEYW5rIGbDvHIgZGFzIEF1c2bDvGxsZW4gZGVzIEZyYWdlYm9nZW5zIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCJEZXIgRnJhZ2Vib2dlbiB3aXJkIHZvbSBTZXJ2ZXIgZ2VsYWRlbi4uLlwiLFxyXG4gICAgb3RoZXJJdGVtVGV4dDogXCJCZW51dHplcmRlZmluaWVydGUgQW50d29ydC4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiV8OkaGxlbi4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBhbnR3b3J0ZW4gU2llIGF1ZiBkaWUgRnJhZ2UuXCIsXHJcbiAgICBudW1lcmljRXJyb3I6IFwiRGVyIFdlcnQgc29sbHRlIGVpbmUgWmFobCBzZWluLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCJCaXR0ZSBnZWJlbiBTaWUgbWluZGVzdGVucyB7MH0gU3ltYm9sZS5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG1pbmRlc3RlbnMgezB9IFZhcmlhbnRlbi5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG5pY2h0IG1laHIgYWxzIHswfSBWYXJpYW50ZW4uXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGdyw7bDn2VyIHNlaW4gYWxzIHsxfSB1bmQgZ2xlaWNoIG9kZXIga2xlaW5lciBhbHMgezJ9XCIsXHJcbiAgICBudW1lcmljTWluOiBcIid7MH0nIHNvbHRlIGdsZWljaCBvZGVyIGdyw7bDn2VyIHNlaW4gYWxzIHsxfVwiLFxyXG4gICAgbnVtZXJpY01heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZSBnw7xsdGlnZSBFbWFpbC1BZHJlc3NlIGVpbi5cIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwiRGllIERhdGVpZ3LDtsOfZSBzb2xsIG5pY2h0IG1laHIgYWxzIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJCaXR0ZSBnZWJlbiBTaWUgZWluZW4gV2VydCBmw7xyIElocmUgYmVudXR6ZXJkZWZpbmllcnRlIEFudHdvcnQgZWluLlwiXHJcbn07XHJcblxyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImRlXCJdID0gZ2VybWFuU3VydmV5U3RyaW5ncztcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbG9jYWxpemF0aW9uL2dlcm1hbi50c1xuICoqLyIsIi8vQ3JlYXRlZCBieSBodHRwczovL2dpdGh1Yi5jb20vYWdlbG9zcGFuYWdpb3Rha2lzXHJcbmltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBncmVla1N1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwizqDPgc6/zrfOs86/z43OvM61zr3Ov1wiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIs6Vz4DPjM68zrXOvc6/XCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwizp/Ou86/zrrOu86uz4HPic+DzrdcIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwizobOu867zr8gKM+AzrHPgc6xzrrOsc67z44gzrTOuc61z4XOus+BzrnOvc6vz4PPhM61KVwiLFxyXG4gICAgcHJvZ3Jlc3NUZXh0OiBcIs6jzrXOu86vzrTOsSB7MH0gzrHPgM+MIHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwizpTOtc69IM+Fz4DOrM+Bz4fOtc65IM66zrHOvM6vzrEgzr/Pgc6xz4TOriDPg861zrvOr860zrEgzq4gzr/Pgc6xz4TOriDOtc+Bz47PhM63z4POtyDPg861IM6xz4XPhM+MIM+Ezr8gzrXPgc+Jz4TOt868zrHPhM6/zrvPjM6zzrnOvy5cIixcclxuICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwizpXPhc+HzrHPgc65z4PPhM6/z43OvM61IM6zzrnOsSDPhM63zr0gz4PPhc68z4DOu86uz4HPic+DzrcgzrHPhc+Ezr/PhSDPhM6/z4UgzrXPgc+Jz4TOt868zrHPhM6/zrvOv86zzq/Ov8+FIVwiLFxyXG4gICAgbG9hZGluZ1N1cnZleTogXCLOpM6/IM61z4HPic+EzrfOvM6xz4TOv867z4zOs865zr8gz4bOv8+Bz4TPjs69zrXPhM6xzrkgzrHPgM6/IM+Ezr8gzrTOuc6xzrrOv868zrnPg8+Ezq4uLi5cIixcclxuICAgIG9wdGlvbnNDYXB0aW9uOiBcIs6Vz4DOuc67zq3Ovs+EzrUuLi5cIixcclxuICAgIHJlcXVpcmVkRXJyb3I6IFwizqDOsc+BzrHOus6xzrvPjiDOsc+AzrHOvc+Ezq7Pg8+EzrUgz4PPhM63zr0gzrXPgc+Oz4TOt8+DzrcuXCIsXHJcbiAgICByZXF1aXJlZEluQWxsUm93c0Vycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gzrHPgM6xzr3PhM6uz4PPhM61IM+Dz4TOuc+CIM61z4HPic+Ezq7Pg861zrnPgiDPg861IM+MzrvOtc+CIM+EzrnPgiDOs8+BzrHOvM68zq3Pgi5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCLOlyDPhM65zrzOriDPgM+Bzq3PgM61zrkgzr3OsSDOtc6vzr3Osc65IM6xz4HOuc64zrzOuc+EzrnOus6uLlwiLFxyXG4gICAgdGV4dE1pbkxlbmd0aDogXCLOoM6xz4HOsc66zrHOu8+OIM+Dz4XOvM+AzrvOt8+Bz47Pg8+EzrUgz4TOv8+FzrvOrM+HzrnPg8+Ezr/OvSB7MH0gz4PPjc68zrLOv867zrEuXCIsXHJcbiAgICBtaW5Sb3dDb3VudEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gz4PPhc68z4DOu863z4HPjs+Dz4TOtSDPhM6/z4XOu86sz4fOuc+Dz4TOv869IHswfSDOs8+BzrHOvM68zq3Pgi5cIixcclxuICAgIG1pblNlbGVjdEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gzrXPgM65zrvOrc6+z4TOtSDPhM6/z4XOu86sz4fOuc+Dz4TOv869IHswfSDPgM6xz4HOsc67zrvOsc6zzq3Pgi5cIixcclxuICAgIG1heFNlbGVjdEVycm9yOiBcIs6gzrHPgc6xzrrOsc67z44gzrXPgM65zrvOrc6+z4TOtSDPjM+Hzrkgz4DOsc+BzrHPgM6szr3PiSDOsc+Azr8gezB9IM+AzrHPgc6xzrvOu86xzrPOrc+CLlwiLFxyXG4gICAgbnVtZXJpY01pbk1heDogXCLOpM6/ICd7MH0nIM64zrEgz4DPgc6tz4DOtc65IM69zrEgzrXOr869zrHOuSDOr8+Dzr8gzq4gzrzOtc6zzrHOu8+Nz4TOtc+Bzr8gzrHPgM6/IM+Ezr8gezF9IM66zrHOuSDOr8+Dzr8gzq4gzrzOuc66z4HPjM+EzrXPgc6/IM6xz4DOvyDPhM6/IHsyfVwiLFxyXG4gICAgbnVtZXJpY01pbjogXCLOpM6/ICd7MH0nIM+Az4HOrc+AzrXOuSDOvc6xIM61zq/Ovc6xzrkgzrzOtc6zzrHOu8+Nz4TOtc+Bzr8gzq4gzrnPg86/IM68zrUgz4TOvyB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwizqTOvyAnezB9JyDPgM+Bzq3PgM61zrkgzr3OsSDOtc6vzr3Osc65IM68zrnOus+Bz4zPhM61z4HOvyDOriDOr8+Dzr8gzrHPgM6/IM+Ezr8gezF9XCIsXHJcbiAgICBpbnZhbGlkRW1haWw6IFwizqDOsc+BzrHOus6xzrvPjiDOtM+Oz4PPhM61IM68zrnOsSDOsc+Azr/OtM61zrrPhM6uIM60zrnOtc+NzrjPhc69z4POtyBlLW1haWwuXCIsXHJcbiAgICB1cmxSZXF1ZXN0RXJyb3I6IFwizpcgzrHOr8+EzrfPg863IM61z4DOrc+Dz4TPgc61z4jOtSDPg8+GzqzOu868zrEgJ3swfScuIHsxfVwiLFxyXG4gICAgdXJsR2V0Q2hvaWNlc0Vycm9yOiBcIs6XIM6xzq/PhM63z4POtyDOtc+Azq3Pg8+Ez4HOtc+IzrUgzrrOtc69zqwgzrTOtc60zr/OvM6tzr3OsSDOriDOtyDOuc60z4zPhM63z4TOsSAnzrzOv869zr/PgM6sz4TOuS9wYXRoJyDOtc6vzr3Osc65IM61z4PPhs6xzrvOrc68zq3Ovc63XCIsXHJcbiAgICBleGNlZWRNYXhTaXplOiBcIs6kzr8gzrzOrc6zzrXOuM6/z4IgzrTOtc69IM68z4DOv8+BzrXOryDOvc6xIM+Fz4DOtc+BzrLOrc69zrXOuSDPhM6xIHswfS5cIixcclxuICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCLOoM6xz4HOsc66zrHOu8+OIM+Dz4XOvM+AzrvOt8+Bz47Pg8+EzrUgz4TOt869IM+EzrnOvM6uIM6zzrnOsSDPhM6/IM+AzrXOtM6vzr8gJ86szrvOu86/Jy5cIixcclxuICAgIHVwbG9hZGluZ0ZpbGU6IFwizqTOvyDOsc+Bz4fOtc6vzr8gz4POsc+CIM6xzr3Otc6yzrHOr869zrXOuS4gzqDOsc+BzrHOus6xzrvPjiDPgM61z4HOuc68zq3Ovc61z4TOtSDOus6xz4DOv865zrEgzrTOtc+Fz4TOtc+Bz4zOu861z4DPhM6xIM66zrHOuSDOtM6/zrrOuc68zqzPg8+EzrUgzr7Osc69zqwuXCIsXHJcbiAgICBhZGRSb3c6IFwizqDPgc6/z4POuM6uzrrOtyDOs8+BzrHOvM68zq7PglwiLFxyXG4gICAgcmVtb3ZlUm93OiBcIs6Rz4bOsc6vz4HOtc+DzrdcIlxyXG59O1xyXG5zdXJ2ZXlMb2NhbGl6YXRpb24ubG9jYWxlc1tcImdyXCJdID0gZ3JlZWtTdXJ2ZXlTdHJpbmdzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9ncmVlay50c1xuICoqLyIsImltcG9ydCB7c3VydmV5TG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vc3VydmV5U3RyaW5nc1wiO1xyXG5cclxuZXhwb3J0IHZhciBwb2xpc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgcGFnZVByZXZUZXh0OiBcIldzdGVjelwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcIkRhbGVqXCIsXHJcbiAgICBjb21wbGV0ZVRleHQ6IFwiR290b3dlXCIsXHJcbiAgICBwcm9ncmVzc1RleHQ6IFwiU3Ryb25hIHswfSB6IHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwiTmllIG1hIHdpZG9jem55Y2ggcHl0YcWELlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCJEemnEmWt1amVteSB6YSB3eXBlxYJuaWVuaWUgYW5raWV0eSFcIixcclxuICAgIGxvYWRpbmdTdXJ2ZXk6IFwiVHJ3YSB3Y3p5dHl3YW5pZSBhbmtpZXR5Li4uXCIsXHJcbiAgICBvdGhlckl0ZW1UZXh0OiBcIklubmEgb2Rwb3dpZWTFui4uLlwiLFxyXG4gICAgb3B0aW9uc0NhcHRpb246IFwiV3liaWVyei4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCJQcm9zesSZIG9kcG93aWVkemllxIcgbmEgdG8gcHl0YW5pZS5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCJXIHR5bSBwb2x1IG1vxbxuYSB3cGlzYcSHIHR5bGtvIGxpY3pieS5cIixcclxuICAgIHRleHRNaW5MZW5ndGg6IFwiUHJvc3rEmSB3cGlzYcSHIGNvIG5ham1uaWVqIHswfSB6bmFrw7N3LlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwiUHJvc3rEmSB3eWJyYcSHIGNvIG5ham1uaWVqIHswfSBwb3p5Y2ppLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwiUHJvc3rEmSB3eWJyYcSHIG5pZSB3acSZY2VqIG5pxbwgezB9IHBvenljamkuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIk9kcG93aWVkxbogJ3swfScgcG93aW5uYSBiecSHIHdpxJlrc3phIGx1YiByw7N3bmEgezF9IG9yYXogbW5pZWpzemEgbHViIHLDs3duYSB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiT2Rwb3dpZWTFuiAnezB9JyBwb3dpbm5hIGJ5xIcgd2nEmWtzemEgbHViIHLDs3duYSB7MX1cIixcclxuICAgIG51bWVyaWNNYXg6IFwiT2Rwb3dpZWTFuiAnezB9JyBwb3dpbm5hIGJ5xIcgbW5pZWpzemEgbHViIHLDs3duYSB7MX1cIixcclxuICAgIGludmFsaWRFbWFpbDogXCJQcm9zesSZIHBvZGHEhyBwcmF3aWTFgm93eSBhZHJlcyBlbWFpbC5cIixcclxuICAgIGV4Y2VlZE1heFNpemU6IFwiUm96bWlhciBwcnplc8WCYW5lZ28gcGxpa3UgbmllIG1vxbxlIHByemVrcmFjemHEhyB7MH0uXCIsXHJcbiAgICBvdGhlclJlcXVpcmVkRXJyb3I6IFwiUHJvc3rEmSBwb2RhxIcgaW5uxIUgb2Rwb3dpZWTFui5cIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJwbFwiXSA9IHBvbGlzaFN1cnZleVN0cmluZ3M7XHJcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9wb2xpc2gudHNcbiAqKi8iLCJpbXBvcnQge3N1cnZleUxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL3N1cnZleVN0cmluZ3NcIjtcclxuXHJcbmV4cG9ydCB2YXIgcnVzc2lhblN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICBwYWdlUHJldlRleHQ6IFwi0J3QsNC30LDQtFwiLFxyXG4gICAgcGFnZU5leHRUZXh0OiBcItCU0LDQu9C10LVcIixcclxuICAgIGNvbXBsZXRlVGV4dDogXCLQk9C+0YLQvtCy0L5cIixcclxuICAgIHByb2dyZXNzVGV4dDogXCLQodGC0YDQsNC90LjRhtCwIHswfSDQuNC3IHsxfVwiLFxyXG4gICAgZW1wdHlTdXJ2ZXk6IFwi0J3QtdGCINC90Lgg0L7QtNC90L7Qs9C+INCy0L7Qv9GA0L7RgdCwLlwiLFxyXG4gICAgY29tcGxldGluZ1N1cnZleTogXCLQkdC70LDQs9C+0LTQsNGA0LjQvCDQktCw0YEg0LfQsCDQt9Cw0L/QvtC70L3QtdC90LjQtSDQsNC90LrQtdGC0YshXCIsXHJcbiAgICBsb2FkaW5nU3VydmV5OiBcItCX0LDQs9GA0YPQt9C60LAg0YEg0YHQtdGA0LLQtdGA0LAuLi5cIixcclxuICAgIG90aGVySXRlbVRleHQ6IFwi0JTRgNGD0LPQvtC1ICjQv9C+0LbQsNC70YPQudGB0YLQsCwg0L7Qv9C40YjQuNGC0LUpXCIsXHJcbiAgICBvcHRpb25zQ2FwdGlvbjogXCLQktGL0LHRgNCw0YLRjC4uLlwiLFxyXG4gICAgcmVxdWlyZWRFcnJvcjogXCLQn9C+0LbQsNC70YPQudGB0YLQsCwg0L7RgtCy0LXRgtGM0YLQtSDQvdCwINCy0L7Qv9GA0L7RgS5cIixcclxuICAgIG51bWVyaWNFcnJvcjogXCLQntGC0LLQtdGCINC00L7Qu9C20LXQvSDQsdGL0YLRjCDRh9C40YHQu9C+0LwuXCIsXHJcbiAgICB0ZXh0TWluTGVuZ3RoOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDRhdC+0YLRjyDQsdGLIHswfSDRgdC40LzQstC+0LvQvtCyLlwiLFxyXG4gICAgbWluU2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0YXQvtGC0Y8g0LHRiyB7MH0g0LLQsNGA0LjQsNC90YLQvtCyLlwiLFxyXG4gICAgbWF4U2VsZWN0RXJyb3I6IFwi0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0YvQsdC10YDQuNGC0LUg0L3QtSDQsdC+0LvQtdC1IHswfSDQstCw0YDQuNCw0L3RgtC+0LIuXCIsXHJcbiAgICBudW1lcmljTWluTWF4OiBcIid7MH0nINC00L7Qu9C20L3QviDQsdGL0YLRjCDRgNCw0LLQvdGL0Lwg0LjQu9C4INCx0L7Qu9GM0YjQtSwg0YfQtdC8IHsxfSwg0Lgg0YDQsNCy0L3Ri9C8INC40LvQuCDQvNC10L3RjNGI0LUsINGH0LXQvCB7Mn1cIixcclxuICAgIG51bWVyaWNNaW46IFwiJ3swfScg0LTQvtC70LbQvdC+INCx0YvRgtGMINGA0LDQstC90YvQvCDQuNC70Lgg0LHQvtC70YzRiNC1LCDRh9C10LwgezF9XCIsXHJcbiAgICBudW1lcmljTWF4OiBcIid7MH0nINC00L7Qu9C20L3QviDQsdGL0YLRjCDRgNCw0LLQvdGL0Lwg0LjQu9C4INC80LXQvdGM0YjQtSwg0YfQtdC8IHsxfVwiLFxyXG4gICAgaW52YWxpZEVtYWlsOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3Ri9C5INCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLLlwiLFxyXG4gICAgb3RoZXJSZXF1aXJlZEVycm9yOiBcItCf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQtNCw0L3QvdGL0LUg0LIg0L/QvtC70LUgXFxcItCU0YDRg9Cz0L7QtVxcXCJcIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJydVwiXSA9IHJ1c3NpYW5TdXJ2ZXlTdHJpbmdzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi9ydXNzaWFuLnRzXG4gKiovIiwiaW1wb3J0IHtzdXJ2ZXlMb2NhbGl6YXRpb259IGZyb20gXCIuLi9zdXJ2ZXlTdHJpbmdzXCI7XHJcblxyXG5leHBvcnQgdmFyIHR1cmtpc2hTdXJ2ZXlTdHJpbmdzID0ge1xyXG4gICAgICAgIHBhZ2VQcmV2VGV4dDogXCJHZXJpXCIsXHJcbiAgICAgICAgcGFnZU5leHRUZXh0OiBcIsSwbGVyaVwiLFxyXG4gICAgICAgIGNvbXBsZXRlVGV4dDogXCJBbmtldGkgVGFtYW1sYVwiLFxyXG4gICAgICAgIG90aGVySXRlbVRleHQ6IFwiRGnEn2VyIChhw6fEsWtsYXnEsW7EsXopXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlNheWZhIHswfSAvIHsxfVwiLFxyXG4gICAgICAgIGVtcHR5U3VydmV5OiBcIkFua2V0dGUgZ8O2csO8bnTDvGxlbmVjZWsgc2F5ZmEgeWEgZGEgc29ydSBtZXZjdXQgZGXEn2lsLlwiLFxyXG4gICAgICAgIGNvbXBsZXRpbmdTdXJ2ZXk6IFwiQW5rZXRpbWl6aSB0YW1hbWxhZMSxxJ/EsW7EsXogacOnaW4gdGXFn2Vra8O8ciBlZGVyaXouXCIsXHJcbiAgICAgICAgbG9hZGluZ1N1cnZleTogXCJBbmtldCBzdW51Y3VkYW4gecO8a2xlbml5b3IgLi4uXCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiU2XDp2luaXogLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCJMw7x0ZmVuIHNvcnV5YSBjZXZhcCB2ZXJpbml6XCIsXHJcbiAgICAgICAgbnVtZXJpY0Vycm9yOiBcIkdpcmlsZW4gZGXEn2VyIG51bWVyaWsgb2xtYWzEsWTEsXJcIixcclxuICAgICAgICB0ZXh0TWluTGVuZ3RoOiBcIkVuIGF6IHswfSBzZW1ib2wgZ2lyaW5pei5cIixcclxuICAgICAgICBtaW5Sb3dDb3VudEVycm9yOiBcIkzDvHRmZW4gZW4gYXogezB9IHNhdMSxcsSxIGRvbGR1cnVuLlwiLFxyXG4gICAgICAgIG1pblNlbGVjdEVycm9yOiBcIkzDvHRmZW4gZW4gYXogezB9IHNlw6dlbmXEn2kgc2XDp2luaXouXCIsXHJcbiAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiTMO8dGZlbiB7MH0gYWRldHRlbiBmYXpsYSBzZcOnbWV5aW5pei5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfSBhbmQgZXF1YWwgb3IgbGVzcyB0aGFuIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgZGXEn2VyaSB7MX0gZGXEn2VyaW5lIGXFn2l0IHZleWEgYsO8ecO8ayBvbG1hbMSxZMSxclwiLFxyXG4gICAgICAgIG51bWVyaWNNYXg6IFwiJ3swfScgZGXEn2VyaSB7MX0gZGXEn2VyaW5lIGXFn2l0IHlhIGRhIGvDvMOnw7xrIG9sbWFsxLFkxLFyLlwiLFxyXG4gICAgICAgIGludmFsaWRFbWFpbDogXCJMw7x0ZmVuIGdlw6dlcmxpIGJpciBlcG9zdGEgYWRyZXNpIGdpcmluaXouXCIsXHJcbiAgICAgICAgdXJsUmVxdWVzdEVycm9yOiBcIlRhbGViaSDFn3UgaGF0YXnEsSBkw7ZuZMO8ICd7MH0nLiB7MX1cIixcclxuICAgICAgICB1cmxHZXRDaG9pY2VzRXJyb3I6IFwiVGFsZXAgaGVyaGFuZ2kgYmlyIHZlcmkgZMO2bm1lZGkgeWEgZGEgJ3BhdGgnIMO2emVsbGnEn2kgaGF0YWzEsS5cIixcclxuICAgICAgICBleGNlZWRNYXhTaXplOiBcIkRvc3lhIGJveXV0dSB7MH0gZGXEn2VyaW5pIGdlw6dlbWV6LlwiLFxyXG4gICAgICAgIG90aGVyUmVxdWlyZWRFcnJvcjogXCJMw7x0ZmVuIGRpxJ9lciBkZcSfZXJsZXJpIGdpcmluaXouXCIsXHJcbiAgICAgICAgdXBsb2FkaW5nRmlsZTogXCJEb3N5YW7EsXogecO8a2xlbml5b3IuIEzDnHRmZW4gYmlya2HDpyBzYW5peWUgYmVrbGV5aW4gdmUgdGVrcmFyIGRlbmV5aW4uXCIsXHJcbiAgICAgICAgYWRkUm93OiBcIlNhdMSxciBFa2xlXCIsXHJcbiAgICAgICAgcmVtb3ZlUm93OiBcIkthbGTEsXJcIlxyXG59O1xyXG5cclxuc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJ0clwiXSA9IHR1cmtpc2hTdXJ2ZXlTdHJpbmdzO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2xvY2FsaXphdGlvbi90dXJraXNoLnRzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==