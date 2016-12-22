/*!
* surveyjs Editor v0.10.2
* (c) Andrew Telnov - http://surveyjs.org/builder/
* Github - https://github.com/andrewtelnov/survey.js.editor
*/

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("survey-knockout"));
	else if(typeof define === 'function' && define.amd)
		define("SurveyEditor", ["survey-knockout"], factory);
	else if(typeof exports === 'object')
		exports["SurveyEditor"] = factory(require("survey-knockout"));
	else
		root["SurveyEditor"] = factory(root["Survey"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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
	
	var _dragdrophelper = __webpack_require__(1);
	
	Object.defineProperty(exports, "DragDropHelper", {
	  enumerable: true,
	  get: function get() {
	    return _dragdrophelper.DragDropHelper;
	  }
	});
	
	var _propertyEditorBase = __webpack_require__(3);
	
	Object.defineProperty(exports, "SurveyPropertyEditorBase", {
	  enumerable: true,
	  get: function get() {
	    return _propertyEditorBase.SurveyPropertyEditorBase;
	  }
	});
	Object.defineProperty(exports, "SurveyStringPropertyEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyEditorBase.SurveyStringPropertyEditor;
	  }
	});
	Object.defineProperty(exports, "SurveyDropdownPropertyEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyEditorBase.SurveyDropdownPropertyEditor;
	  }
	});
	Object.defineProperty(exports, "SurveyBooleanPropertyEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyEditorBase.SurveyBooleanPropertyEditor;
	  }
	});
	Object.defineProperty(exports, "SurveyNumberPropertyEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyEditorBase.SurveyNumberPropertyEditor;
	  }
	});
	
	var _propertyTextItemsEditor = __webpack_require__(4);
	
	Object.defineProperty(exports, "SurveyPropertyTextItemsEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyTextItemsEditor.SurveyPropertyTextItemsEditor;
	  }
	});
	
	var _propertyItemsEditor = __webpack_require__(5);
	
	Object.defineProperty(exports, "SurveyPropertyItemsEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyItemsEditor.SurveyPropertyItemsEditor;
	  }
	});
	
	var _propertyItemValuesEditor = __webpack_require__(12);
	
	Object.defineProperty(exports, "SurveyPropertyItemValuesEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyItemValuesEditor.SurveyPropertyItemValuesEditor;
	  }
	});
	
	var _propertyMatrixDropdownColumnsEditor = __webpack_require__(13);
	
	Object.defineProperty(exports, "SurveyPropertyDropdownColumnsEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyMatrixDropdownColumnsEditor.SurveyPropertyDropdownColumnsEditor;
	  }
	});
	Object.defineProperty(exports, "SurveyPropertyMatrixDropdownColumnsItem", {
	  enumerable: true,
	  get: function get() {
	    return _propertyMatrixDropdownColumnsEditor.SurveyPropertyMatrixDropdownColumnsItem;
	  }
	});
	
	var _propertyModalEditor = __webpack_require__(6);
	
	Object.defineProperty(exports, "SurveyPropertyModalEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyModalEditor.SurveyPropertyModalEditor;
	  }
	});
	
	var _propertyRestfullEditor = __webpack_require__(14);
	
	Object.defineProperty(exports, "SurveyPropertyResultfullEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyRestfullEditor.SurveyPropertyResultfullEditor;
	  }
	});
	
	var _propertyTriggersEditor = __webpack_require__(15);
	
	Object.defineProperty(exports, "SurveyPropertyTriggersEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyTriggersEditor.SurveyPropertyTriggersEditor;
	  }
	});
	
	var _propertyValidatorsEditor = __webpack_require__(9);
	
	Object.defineProperty(exports, "SurveyPropertyValidatorsEditor", {
	  enumerable: true,
	  get: function get() {
	    return _propertyValidatorsEditor.SurveyPropertyValidatorsEditor;
	  }
	});
	
	var _objectProperty = __webpack_require__(11);
	
	Object.defineProperty(exports, "SurveyObjectProperty", {
	  enumerable: true,
	  get: function get() {
	    return _objectProperty.SurveyObjectProperty;
	  }
	});
	
	var _objectEditor = __webpack_require__(10);
	
	Object.defineProperty(exports, "SurveyObjectEditor", {
	  enumerable: true,
	  get: function get() {
	    return _objectEditor.SurveyObjectEditor;
	  }
	});
	
	var _pagesEditor = __webpack_require__(16);
	
	Object.defineProperty(exports, "SurveyPagesEditor", {
	  enumerable: true,
	  get: function get() {
	    return _pagesEditor.SurveyPagesEditor;
	  }
	});
	
	var _textWorker = __webpack_require__(17);
	
	Object.defineProperty(exports, "SurveyTextWorker", {
	  enumerable: true,
	  get: function get() {
	    return _textWorker.SurveyTextWorker;
	  }
	});
	
	var _surveyHelper = __webpack_require__(8);
	
	Object.defineProperty(exports, "ObjType", {
	  enumerable: true,
	  get: function get() {
	    return _surveyHelper.ObjType;
	  }
	});
	Object.defineProperty(exports, "SurveyHelper", {
	  enumerable: true,
	  get: function get() {
	    return _surveyHelper.SurveyHelper;
	  }
	});
	
	var _surveyEmbedingWindow = __webpack_require__(19);
	
	Object.defineProperty(exports, "SurveyEmbedingWindow", {
	  enumerable: true,
	  get: function get() {
	    return _surveyEmbedingWindow.SurveyEmbedingWindow;
	  }
	});
	
	var _objectVerbs = __webpack_require__(20);
	
	Object.defineProperty(exports, "SurveyVerbs", {
	  enumerable: true,
	  get: function get() {
	    return _objectVerbs.SurveyVerbs;
	  }
	});
	Object.defineProperty(exports, "SurveyVerbItem", {
	  enumerable: true,
	  get: function get() {
	    return _objectVerbs.SurveyVerbItem;
	  }
	});
	Object.defineProperty(exports, "SurveyVerbChangeTypeItem", {
	  enumerable: true,
	  get: function get() {
	    return _objectVerbs.SurveyVerbChangeTypeItem;
	  }
	});
	Object.defineProperty(exports, "SurveyVerbChangePageItem", {
	  enumerable: true,
	  get: function get() {
	    return _objectVerbs.SurveyVerbChangePageItem;
	  }
	});
	
	var _undoredo = __webpack_require__(21);
	
	Object.defineProperty(exports, "SurveyUndoRedo", {
	  enumerable: true,
	  get: function get() {
	    return _undoredo.SurveyUndoRedo;
	  }
	});
	Object.defineProperty(exports, "UndoRedoItem", {
	  enumerable: true,
	  get: function get() {
	    return _undoredo.UndoRedoItem;
	  }
	});
	
	var _editor = __webpack_require__(22);
	
	Object.defineProperty(exports, "SurveyEditor", {
	  enumerable: true,
	  get: function get() {
	    return _editor.SurveyEditor;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.DragDropHelper = undefined;
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var DragDropHelper = exports.DragDropHelper = function () {
	    function DragDropHelper(data, onModifiedCallback, scrollableElName) {
	        if (scrollableElName === void 0) {
	            scrollableElName = null;
	        }
	        this.data = data;
	        this.scrollableElement = null;
	        this.sourceIndex = -1;
	        this.isScrollStop = true;
	        this.onModifiedCallback = onModifiedCallback;
	        this.scrollableElement = document.getElementById(scrollableElName ? scrollableElName : "scrollableDiv");
	    }
	    Object.defineProperty(DragDropHelper.prototype, "survey", {
	        get: function get() {
	            return this.data;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DragDropHelper.prototype.startDragNewQuestion = function (event, questionType, questionName) {
	        this.prepareData(event, questionType, questionName);
	    };
	    DragDropHelper.prototype.startDragQuestion = function (event, questionName) {
	        this.prepareData(event, null, questionName);
	    };
	    DragDropHelper.prototype.startDragCopiedQuestion = function (event, questionName, questionJson) {
	        this.prepareData(event, null, questionName, questionJson);
	    };
	    DragDropHelper.prototype.isSurveyDragging = function (event) {
	        if (!event) return false;
	        var data = this.getData(event).text;
	        return data && data.indexOf(DragDropHelper.dataStart) == 0;
	    };
	    DragDropHelper.prototype.doDragDropOver = function (event, question) {
	        event = this.getEvent(event);
	        this.checkScrollY(event);
	        var targetQuestion = DragDropHelper.dragData.targetQuestion;
	        if (!question || question == targetQuestion || !this.isSurveyDragging(event) || this.isSamePlace(event, question)) return;
	        var index = this.getQuestionIndex(event, question);
	        if (this.sourceIndex > -1) {
	            if (this.sourceIndex == index || this.sourceIndex + 1 == index) index = -1;
	        }
	        this.survey.currentPage["koDragging"](index);
	    };
	    DragDropHelper.prototype.end = function () {
	        this.isScrollStop = true;
	        this.setIsDraggingSource(this.survey["koDraggingSource"](), false);
	        this.survey["koDraggingSource"](null);
	        this.survey.currentPage["koDragging"](-1);
	        this.sourceIndex = -1;
	        this.clearData();
	    };
	    DragDropHelper.prototype.doDrop = function (event, question) {
	        if (question === void 0) {
	            question = null;
	        }
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        }
	        if (this.isSurveyDragging(event)) {
	            var index = this.survey.currentPage["koDragging"]();
	            var targetQuestion = DragDropHelper.dragData.targetQuestion;
	            if (targetQuestion && index > -1) {
	                var oldIndex = this.survey.currentPage.questions.indexOf(targetQuestion);
	                if (oldIndex > -1 && oldIndex < index) {
	                    index--;
	                }
	                this.moveQuestionTo(targetQuestion, index);
	            }
	        }
	        this.end();
	    };
	    DragDropHelper.prototype.doLeavePage = function (event) {
	        event = this.getEvent(event);
	        if (!this.scrollableElement) return;
	        if (event.clientX <= 0 || event.clientY <= 0 || event.clientX >= this.scrollableElement.offsetWidth || event.clientY >= this.scrollableElement.offsetHeight) {
	            this.survey.currentPage["koDragging"](-1);
	        }
	    };
	    DragDropHelper.prototype.createTargetQuestion = function (questionType, questionName, json) {
	        if (!questionName) return null;
	        var targetQuestion = this.survey.getQuestionByName(questionName);
	        this.sourceIndex = -1;
	        if (targetQuestion) {
	            this.sourceIndex = this.survey.currentPage.questions.indexOf(targetQuestion);
	        }
	        if (!targetQuestion) {
	            if (json) {
	                targetQuestion = Survey.QuestionFactory.Instance.createQuestion(json["type"], name);
	                new Survey.JsonObject().toObject(json, targetQuestion);
	                targetQuestion.name = questionName;
	            }
	            if (!targetQuestion && questionType) {
	                targetQuestion = Survey.QuestionFactory.Instance.createQuestion(questionType, questionName);
	            }
	            targetQuestion.setData(this.survey);
	            targetQuestion.renderWidth = "100%";
	        }
	        this.setIsDraggingSource(targetQuestion, true);
	        return targetQuestion;
	    };
	    DragDropHelper.prototype.setIsDraggingSource = function (question, val) {
	        if (question && question["koIsDraggingSource"]) question["koIsDraggingSource"](val);
	    };
	    DragDropHelper.prototype.getQuestionIndex = function (event, question) {
	        var page = this.survey.currentPage;
	        if (!question) return page.questions.length;
	        var index = page.questions.indexOf(question);
	        event = this.getEvent(event);
	        var height = event.currentTarget["clientHeight"];
	        var y = event.offsetY;
	        if (event.hasOwnProperty('layerX')) {
	            y = event.layerY - event.currentTarget["offsetTop"];
	        }
	        if (y > height / 2) index++;
	        return index;
	    };
	    DragDropHelper.prototype.isSamePlace = function (event, question) {
	        var prev = DragDropHelper.prevEvent;
	        if (prev.question != question || Math.abs(event.clientX - prev.x) > 5 || Math.abs(event.clientY - prev.y) > 5) {
	            prev.question = question;
	            prev.x = event.clientX;
	            prev.y = event.clientY;
	            return false;
	        }
	        return true;
	    };
	    DragDropHelper.prototype.checkScrollY = function (e) {
	        if (!this.scrollableElement) return;
	        var y = this.getScrollableElementPosY(e);
	        if (y < 0) return;
	        this.isScrollStop = true;
	        var height = this.scrollableElement["clientHeight"];
	        if (y < DragDropHelper.ScrollOffset && y >= 0) {
	            this.isScrollStop = false;
	            this.doScrollY(-1);
	        }
	        if (height - y < DragDropHelper.ScrollOffset && height >= y) {
	            this.isScrollStop = false;
	            this.doScrollY(1);
	        }
	    };
	    DragDropHelper.prototype.doScrollY = function (step) {
	        var el = this.scrollableElement;
	        var scrollY = el.scrollTop + step;
	        if (scrollY < 0) {
	            this.isScrollStop = true;
	            return;
	        }
	        el.scrollTop = scrollY;
	        var self = this;
	        if (!this.isScrollStop) {
	            setTimeout(function () {
	                self.doScrollY(step);
	            }, DragDropHelper.ScrollDelay);
	        }
	    };
	    DragDropHelper.prototype.getScrollableElementPosY = function (e) {
	        if (!this.scrollableElement || !e.currentTarget) return -1;
	        return e.offsetY + e.currentTarget["offsetTop"] - this.scrollableElement.offsetTop - this.scrollableElement.scrollTop;
	    };
	    DragDropHelper.prototype.getEvent = function (event) {
	        return event["originalEvent"] ? event["originalEvent"] : event;
	    };
	    DragDropHelper.prototype.moveQuestionTo = function (targetQuestion, index) {
	        if (targetQuestion == null) return;
	        var page = this.survey.getPageByQuestion(targetQuestion);
	        if (page == this.survey.currentPage && index == page.questions.indexOf(targetQuestion)) return;
	        if (page) {
	            page.removeQuestion(targetQuestion);
	        }
	        this.survey.currentPage.addQuestion(targetQuestion, index);
	        if (this.onModifiedCallback) this.onModifiedCallback();
	    };
	    DragDropHelper.prototype.getDataInfo = function (event) {
	        var data = this.getData(event);
	        if (!data) return null;
	        var text = data.text.substr(DragDropHelper.dataStart.length);
	        var array = text.split(',');
	        var result = { json: null };
	        for (var i = 0; i < array.length; i++) {
	            var item = array[i].split(':');
	            result[item[0]] = item[1];
	        }
	        result.json = data.json;
	        return result;
	    };
	    DragDropHelper.prototype.getY = function (element) {
	        var result = 0;
	        while (element) {
	            result += element.offsetTop - element.scrollTop + element.clientTop;
	            element = element.offsetParent;
	        }
	        return result;
	    };
	    DragDropHelper.prototype.prepareData = function (event, questionType, questionName, json) {
	        if (json === void 0) {
	            json = null;
	        }
	        var str = DragDropHelper.dataStart;
	        if (questionType) str += "questiontype:" + questionType + ',';
	        str += "questionname:" + questionName;
	        this.setData(event, str, json);
	        var targetQuestion = this.createTargetQuestion(questionType, questionName, json);
	        DragDropHelper.dragData.targetQuestion = targetQuestion;
	        this.survey["koDraggingSource"](targetQuestion);
	    };
	    DragDropHelper.prototype.setData = function (event, text, json) {
	        if (json === void 0) {
	            json = null;
	        }
	        if (event["originalEvent"]) {
	            event = event["originalEvent"];
	        }
	        if (event.dataTransfer) {
	            event.dataTransfer.setData("Text", text);
	            event.dataTransfer.effectAllowed = "copy";
	        }
	        DragDropHelper.dragData = { text: text, json: json };
	    };
	    DragDropHelper.prototype.getData = function (event) {
	        if (event["originalEvent"]) {
	            event = event["originalEvent"];
	        }
	        if (event.dataTransfer) {
	            var text = event.dataTransfer.getData("Text");
	            if (text) {
	                DragDropHelper.dragData.text = text;
	            }
	        }
	        return DragDropHelper.dragData;
	    };
	    DragDropHelper.prototype.clearData = function () {
	        DragDropHelper.dragData = { text: "", json: null, targetQuestion: null };
	        var prev = DragDropHelper.prevEvent;
	        prev.question = null;
	        prev.x = -1;
	        prev.y = -1;
	    };
	    DragDropHelper.dataStart = "surveyjs,";
	    DragDropHelper.dragData = { text: "", json: null };
	    DragDropHelper.prevEvent = { question: null, x: -1, y: -1 };
	    DragDropHelper.ScrollDelay = 30;
	    DragDropHelper.ScrollOffset = 100;
	    return DragDropHelper;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyEditorBase = exports.SurveyPropertyEditorBase = function () {
	    function SurveyPropertyEditorBase() {
	        this.value_ = null;
	        this.options = null;
	    }
	    SurveyPropertyEditorBase.registerEditor = function (name, creator) {
	        SurveyPropertyEditorBase.editorRegisteredList[name] = creator;
	    };
	    SurveyPropertyEditorBase.createEditor = function (editorType, func) {
	        var creator = SurveyPropertyEditorBase.editorRegisteredList[editorType];
	        if (!creator) creator = SurveyPropertyEditorBase.editorRegisteredList[SurveyPropertyEditorBase.defaultEditor];
	        var propertyEditor = creator();
	        propertyEditor.onChanged = func;
	        return propertyEditor;
	    };
	    Object.defineProperty(SurveyPropertyEditorBase.prototype, "editorType", {
	        get: function get() {
	            throw "editorType is not defined";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyEditorBase.prototype.getValueText = function (value) {
	        return value;
	    };
	    Object.defineProperty(SurveyPropertyEditorBase.prototype, "value", {
	        get: function get() {
	            return this.value_;
	        },
	        set: function set(value) {
	            value = this.getCorrectedValue(value);
	            this.setValueCore(value);
	            this.onValueChanged();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyEditorBase.prototype.setValueCore = function (value) {
	        this.value_ = value;
	    };
	    SurveyPropertyEditorBase.prototype.setTitle = function (value) {};
	    SurveyPropertyEditorBase.prototype.setObject = function (value) {};
	    SurveyPropertyEditorBase.prototype.onValueChanged = function () {};
	    SurveyPropertyEditorBase.prototype.getCorrectedValue = function (value) {
	        return value;
	    };
	    SurveyPropertyEditorBase.defaultEditor = "string";
	    SurveyPropertyEditorBase.editorRegisteredList = {};
	    return SurveyPropertyEditorBase;
	}();
	var SurveyStringPropertyEditor = exports.SurveyStringPropertyEditor = function (_super) {
	    __extends(SurveyStringPropertyEditor, _super);
	    function SurveyStringPropertyEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyStringPropertyEditor.prototype, "editorType", {
	        get: function get() {
	            return "string";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyStringPropertyEditor;
	}(SurveyPropertyEditorBase);
	var SurveyDropdownPropertyEditor = exports.SurveyDropdownPropertyEditor = function (_super) {
	    __extends(SurveyDropdownPropertyEditor, _super);
	    function SurveyDropdownPropertyEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyDropdownPropertyEditor.prototype, "editorType", {
	        get: function get() {
	            return "dropdown";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyDropdownPropertyEditor;
	}(SurveyPropertyEditorBase);
	var SurveyBooleanPropertyEditor = exports.SurveyBooleanPropertyEditor = function (_super) {
	    __extends(SurveyBooleanPropertyEditor, _super);
	    function SurveyBooleanPropertyEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyBooleanPropertyEditor.prototype, "editorType", {
	        get: function get() {
	            return "boolean";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyBooleanPropertyEditor;
	}(SurveyPropertyEditorBase);
	var SurveyNumberPropertyEditor = exports.SurveyNumberPropertyEditor = function (_super) {
	    __extends(SurveyNumberPropertyEditor, _super);
	    function SurveyNumberPropertyEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyNumberPropertyEditor.prototype, "editorType", {
	        get: function get() {
	            return "number";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyNumberPropertyEditor;
	}(SurveyPropertyEditorBase);
	SurveyPropertyEditorBase.registerEditor("string", function () {
	    return new SurveyStringPropertyEditor();
	});
	SurveyPropertyEditorBase.registerEditor("dropdown", function () {
	    return new SurveyDropdownPropertyEditor();
	});
	SurveyPropertyEditorBase.registerEditor("boolean", function () {
	    return new SurveyBooleanPropertyEditor();
	});
	SurveyPropertyEditorBase.registerEditor("number", function () {
	    return new SurveyNumberPropertyEditor();
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyTextItemsEditor = undefined;
	
	var _propertyItemsEditor = __webpack_require__(5);
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var _surveyHelper = __webpack_require__(8);
	
	var _editorLocalization = __webpack_require__(7);
	
	var _propertyValidatorsEditor = __webpack_require__(9);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyTextItemsEditor = exports.SurveyPropertyTextItemsEditor = function (_super) {
	    __extends(SurveyPropertyTextItemsEditor, _super);
	    function SurveyPropertyTextItemsEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyPropertyTextItemsEditor.prototype, "editorType", {
	        get: function get() {
	            return "textitems";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyTextItemsEditor.prototype.createNewEditorItem = function () {
	        var objs = [];
	        var items = this.koItems();
	        for (var i = 0; i < items.length; i++) {
	            objs.push({ name: items[i].koName() });
	        }
	        var editItem = { koName: ko.observable(_surveyHelper.SurveyHelper.getNewName(objs, "text")), koTitle: ko.observable() };
	        this.createValidatorsEditor(editItem, []);
	        return editItem;
	    };
	    SurveyPropertyTextItemsEditor.prototype.createEditorItem = function (item) {
	        var editItem = { koName: ko.observable(item.name), koTitle: ko.observable(item.title) };
	        this.createValidatorsEditor(editItem, item.validators);
	        return editItem;
	    };
	    SurveyPropertyTextItemsEditor.prototype.createItemFromEditorItem = function (editorItem) {
	        var itemText = new Survey.MultipleTextItem(editorItem.koName(), editorItem.koTitle());
	        itemText.validators = editorItem.validators;
	        return itemText;
	    };
	    SurveyPropertyTextItemsEditor.prototype.createValidatorsEditor = function (item, validators) {
	        item.validators = validators.slice();
	        var self = this;
	        var onItemChanged = function onItemChanged(newValue) {
	            item.validators = newValue;item.koText(self.getText(newValue.length));
	        };
	        var propertyEditor = new _propertyValidatorsEditor.SurveyPropertyValidatorsEditor();
	        item.editor = propertyEditor;
	        propertyEditor.onChanged = function (newValue) {
	            onItemChanged(newValue);
	        };
	        propertyEditor.object = item;
	        propertyEditor.title(_editorLocalization.editorLocalization.getString("pe.editProperty")["format"]("Validators"));
	        propertyEditor.value = item.validators;
	        item.koText = ko.observable(this.getText(validators.length));
	    };
	    SurveyPropertyTextItemsEditor.prototype.getText = function (length) {
	        return _editorLocalization.editorLocalization.getString("pe.items")["format"](length);
	    };
	    return SurveyPropertyTextItemsEditor;
	}(_propertyItemsEditor.SurveyPropertyItemsEditor);
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("textitems", function () {
	    return new SurveyPropertyTextItemsEditor();
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyItemsEditor = undefined;
	
	var _propertyModalEditor = __webpack_require__(6);
	
	var _editorLocalization = __webpack_require__(7);
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyItemsEditor = exports.SurveyPropertyItemsEditor = function (_super) {
	    __extends(SurveyPropertyItemsEditor, _super);
	    function SurveyPropertyItemsEditor() {
	        _super.call(this);
	        this.koItems = ko.observableArray();
	        this.value = [];
	        var self = this;
	        self.onDeleteClick = function (item) {
	            self.koItems.remove(item);
	        };
	        self.onClearClick = function (item) {
	            self.koItems.removeAll();
	        };
	        self.onAddClick = function () {
	            self.AddItem();
	        };
	        self.onMoveUpClick = function (item) {
	            self.moveUp(item);
	        };
	        self.onMoveDownClick = function (item) {
	            self.moveDown(item);
	        };
	    }
	    SurveyPropertyItemsEditor.prototype.getValueText = function (value) {
	        var len = value ? value.length : 0;
	        return _editorLocalization.editorLocalization.getString("pe.items")["format"](len);
	    };
	    SurveyPropertyItemsEditor.prototype.getCorrectedValue = function (value) {
	        if (value == null || !Array.isArray(value)) value = [];
	        return value;
	    };
	    SurveyPropertyItemsEditor.prototype.AddItem = function () {
	        this.koItems.push(this.createNewEditorItem());
	    };
	    SurveyPropertyItemsEditor.prototype.moveUp = function (item) {
	        var arr = this.koItems();
	        var index = arr.indexOf(item);
	        if (index < 1) return;
	        arr[index] = arr[index - 1];
	        arr[index - 1] = item;
	        this.koItems(arr);
	    };
	    SurveyPropertyItemsEditor.prototype.moveDown = function (item) {
	        var arr = this.koItems();
	        var index = arr.indexOf(item);
	        if (index < 0 || index >= arr.length - 1) return;
	        arr[index] = arr[index + 1];
	        arr[index + 1] = item;
	        this.koItems(arr);
	    };
	    SurveyPropertyItemsEditor.prototype.onValueChanged = function () {
	        this.koItems(this.getItemsFromValue());
	    };
	    SurveyPropertyItemsEditor.prototype.getItemsFromValue = function () {
	        var items = [];
	        var value = this.value;
	        for (var i = 0; i < value.length; i++) {
	            items.push(this.createEditorItem(value[i]));
	        }
	        return items;
	    };
	    SurveyPropertyItemsEditor.prototype.onBeforeApply = function () {
	        var items = [];
	        var internalItems = this.koItems();
	        for (var i = 0; i < internalItems.length; i++) {
	            items.push(this.createItemFromEditorItem(internalItems[i]));
	        }
	        this.setValueCore(items);
	    };
	    SurveyPropertyItemsEditor.prototype.createNewEditorItem = function () {
	        throw "Override 'createNewEditorItem' method";
	    };
	    SurveyPropertyItemsEditor.prototype.createEditorItem = function (item) {
	        return item;
	    };
	    SurveyPropertyItemsEditor.prototype.createItemFromEditorItem = function (editorItem) {
	        return editorItem;
	    };
	    return SurveyPropertyItemsEditor;
	}(_propertyModalEditor.SurveyPropertyModalEditor);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyHtmlEditor = exports.SurveyPropertyTextEditor = exports.SurveyPropertyModalEditor = undefined;
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyModalEditor = exports.SurveyPropertyModalEditor = function (_super) {
	    __extends(SurveyPropertyModalEditor, _super);
	    function SurveyPropertyModalEditor() {
	        _super.call(this);
	        this.title = ko.observable();
	        var self = this;
	        self.onApplyClick = function () {
	            self.apply();
	        };
	        self.onResetClick = function () {
	            self.reset();
	        };
	    }
	    SurveyPropertyModalEditor.prototype.setTitle = function (value) {
	        this.title(value);
	    };
	    SurveyPropertyModalEditor.prototype.hasError = function () {
	        return false;
	    };
	    SurveyPropertyModalEditor.prototype.onBeforeApply = function () {};
	    SurveyPropertyModalEditor.prototype.reset = function () {
	        this.value = this.value;
	    };
	    SurveyPropertyModalEditor.prototype.setObject = function (value) {
	        this.object = value;
	    };
	    Object.defineProperty(SurveyPropertyModalEditor.prototype, "isEditable", {
	        get: function get() {
	            return false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyModalEditor.prototype.apply = function () {
	        if (this.hasError()) return;
	        this.onBeforeApply();
	        if (this.onChanged) {
	            this.onChanged(this.value);
	        }
	    };
	    return SurveyPropertyModalEditor;
	}(_propertyEditorBase.SurveyPropertyEditorBase);
	var SurveyPropertyTextEditor = exports.SurveyPropertyTextEditor = function (_super) {
	    __extends(SurveyPropertyTextEditor, _super);
	    function SurveyPropertyTextEditor() {
	        _super.call(this);
	        this.koValue = ko.observable();
	    }
	    Object.defineProperty(SurveyPropertyTextEditor.prototype, "editorType", {
	        get: function get() {
	            return "text";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyPropertyTextEditor.prototype, "isEditable", {
	        get: function get() {
	            return true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyTextEditor.prototype.getValueText = function (value) {
	        if (!value) return null;
	        var str = value;
	        if (str.length > 20) {
	            str = str.substr(0, 20) + "...";
	        }
	        return str;
	    };
	    SurveyPropertyTextEditor.prototype.onValueChanged = function () {
	        this.koValue(this.value);
	    };
	    SurveyPropertyTextEditor.prototype.onBeforeApply = function () {
	        this.setValueCore(this.koValue());
	    };
	    return SurveyPropertyTextEditor;
	}(SurveyPropertyModalEditor);
	var SurveyPropertyHtmlEditor = exports.SurveyPropertyHtmlEditor = function (_super) {
	    __extends(SurveyPropertyHtmlEditor, _super);
	    function SurveyPropertyHtmlEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyPropertyHtmlEditor.prototype, "editorType", {
	        get: function get() {
	            return "html";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyPropertyHtmlEditor;
	}(SurveyPropertyTextEditor);
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("text", function () {
	    return new SurveyPropertyTextEditor();
	});
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("html", function () {
	    return new SurveyPropertyHtmlEditor();
	});

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	var editorLocalization = exports.editorLocalization = {
	    currentLocale: "",
	    locales: {},
	    getString: function getString(strName, locale) {
	        if (locale === void 0) {
	            locale = null;
	        }
	        if (!locale) locale = this.currentLocale;
	        var loc = locale ? this.locales[this.currentLocale] : defaultStrings;
	        if (!loc) loc = defaultStrings;
	        var path = strName.split('.');
	        var obj = loc;
	        for (var i = 0; i < path.length; i++) {
	            obj = obj[path[i]];
	            if (!obj) {
	                if (loc === defaultStrings) return path[i];
	                return this.getString(strName, "en");
	            }
	        }
	        return obj;
	    },
	    getPropertyName: function getPropertyName(strName, local) {
	        if (local === void 0) {
	            local = null;
	        }
	        var obj = this.getProperty(strName, local);
	        if (obj["name"]) return obj["name"];
	        return obj;
	    },
	    getPropertyTitle: function getPropertyTitle(strName, local) {
	        if (local === void 0) {
	            local = null;
	        }
	        var obj = this.getProperty(strName, local);
	        if (obj["title"]) return obj["title"];
	        return "";
	    },
	    getProperty: function getProperty(strName, local) {
	        if (local === void 0) {
	            local = null;
	        }
	        var obj = this.getString("p." + strName, local);
	        if (obj !== strName) return obj;
	        var pos = strName.indexOf('_');
	        if (pos < -1) return obj;
	        strName = strName.substr(pos + 1);
	        return this.getString("p." + strName, local);
	    },
	    getLocales: function getLocales() {
	        var res = [];
	        res.push("");
	        for (var key in this.locales) {
	            res.push(key);
	        }
	        return res;
	    }
	};
	var defaultStrings = exports.defaultStrings = {
	    //survey templates
	    survey: {
	        dropQuestion: "Please drop a question here.",
	        copy: "Copy",
	        addToToolbox: "Add to toolbox"
	    },
	    //questionTypes
	    qt: {
	        checkbox: "Checkbox",
	        comment: "Comment",
	        dropdown: "Dropdown",
	        file: "File",
	        html: "Html",
	        matrix: "Matrix (single choice)",
	        matrixdropdown: "Matrix (multiple choice)",
	        matrixdynamic: "Matrix (dynamic rows)",
	        multipletext: "Multiple Text",
	        radiogroup: "Radiogroup",
	        rating: "Rating",
	        text: "Single Input"
	    },
	    //Strings in Editor
	    ed: {
	        newPageName: "page",
	        newQuestionName: "question",
	        testSurvey: "Test Survey",
	        testSurveyAgain: "Test Survey Again",
	        testSurveyWidth: "Survey width: ",
	        embedSurvey: "Embed Survey",
	        saveSurvey: "Save Survey",
	        designer: "Survey Designer",
	        jsonEditor: "JSON Editor",
	        undo: "Undo",
	        redo: "Redo",
	        options: "Options",
	        generateValidJSON: "Generate Valid JSON",
	        generateReadableJSON: "Generate Readable JSON",
	        toolbox: "Toolbox",
	        delSelObject: "Delete selected object",
	        correctJSON: "Please correct JSON.",
	        surveyResults: "Survey Result: "
	    },
	    //Property Editors
	    pe: {
	        apply: "Apply",
	        reset: "Reset",
	        close: "Close",
	        delete: "Delete",
	        addNew: "Add New",
	        removeAll: "Remove All",
	        edit: "Edit",
	        empty: "<empty>",
	        testService: "Test the service",
	        value: "Value",
	        text: "Text",
	        required: "Required?",
	        hasOther: "Has Other Item",
	        name: "Name",
	        title: "Title",
	        cellType: "Cell Type",
	        colCount: "Column Count",
	        editProperty: "Edit property '{0}'",
	        items: "[ Items: {0} ]",
	        enterNewValue: "Please, enter the value.",
	        noquestions: "There is no any question in the survey.",
	        createtrigger: "Please create a trigger",
	        triggerOn: "On ",
	        triggerMakePagesVisible: "Make pages visible:",
	        triggerMakeQuestionsVisible: "Make questions visible:",
	        triggerCompleteText: "Complete the survey if succeed.",
	        triggerNotSet: "The trigger is not set",
	        triggerRunIf: "Run if",
	        triggerSetToName: "Change value of: ",
	        triggerSetValue: "to: ",
	        triggerIsVariable: "Do not put the variable into the survey result.",
	        verbChangeType: "Change type ",
	        verbChangePage: "Change page "
	    },
	    //Operators
	    op: {
	        empty: "is empty",
	        notempty: "is not empty",
	        equal: "equals",
	        notequal: "not equals",
	        contains: "contains",
	        notcontains: "not contains",
	        greater: "greater",
	        less: "less",
	        greaterorequal: "greater or equals",
	        lessorequal: "Less or Equals"
	    },
	    //Embed window
	    ew: {
	        knockout: "Use Knockout version",
	        react: "Use React version",
	        bootstrap: "For bootstrap framework",
	        standard: "No bootstrap",
	        showOnPage: "Show survey on a page",
	        showInWindow: "Show survey in a window",
	        loadFromServer: "Load Survey JSON from server",
	        titleScript: "Scripts and styles",
	        titleHtml: "HTML",
	        titleJavaScript: "JavaScript"
	    },
	    //Properties
	    p: {
	        name: "name",
	        title: { name: "title", title: "Leave it empty, if it is the same as 'Name'" },
	        survey_title: { name: "title", title: "It will be shown on every page." },
	        page_title: { name: "title", title: "Page title" }
	    }
	};
	editorLocalization.locales["en"] = defaultStrings;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyHelper = exports.ObjType = undefined;
	
	var _editorLocalization = __webpack_require__(7);
	
	var ObjType = exports.ObjType = undefined;
	(function (ObjType) {
	    ObjType[ObjType["Unknown"] = 0] = "Unknown";
	    ObjType[ObjType["Survey"] = 1] = "Survey";
	    ObjType[ObjType["Page"] = 2] = "Page";
	    ObjType[ObjType["Question"] = 3] = "Question";
	})(ObjType || (exports.ObjType = ObjType = {}));
	var SurveyHelper = exports.SurveyHelper = function () {
	    function SurveyHelper() {}
	    SurveyHelper.getNewPageName = function (objs) {
	        return SurveyHelper.getNewName(objs, _editorLocalization.editorLocalization.getString("ed.newPageName"));
	    };
	    SurveyHelper.getNewQuestionName = function (objs) {
	        return SurveyHelper.getNewName(objs, _editorLocalization.editorLocalization.getString("ed.newQuestionName"));
	    };
	    SurveyHelper.getNewName = function (objs, baseName) {
	        var hash = {};
	        for (var i = 0; i < objs.length; i++) {
	            hash[objs[i].name] = true;
	        }
	        var num = 1;
	        while (true) {
	            if (!hash[baseName + num.toString()]) break;
	            num++;
	        }
	        return baseName + num.toString();
	    };
	    SurveyHelper.getObjectType = function (obj) {
	        if (!obj || !obj["getType"]) return ObjType.Unknown;
	        if (obj.getType() == "page") return ObjType.Page;
	        if (obj.getType() == "survey") return ObjType.Survey;
	        if (obj["name"]) return ObjType.Question;
	        return ObjType.Unknown;
	    };
	    SurveyHelper.getObjectName = function (obj) {
	        if (obj["name"]) return obj["name"];
	        var objType = SurveyHelper.getObjectType(obj);
	        if (objType != ObjType.Page) return "";
	        var data = obj.data;
	        var index = data.pages.indexOf(obj);
	        return "[Page " + (index + 1) + "]";
	    };
	    return SurveyHelper;
	}();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyValidatorItem = exports.SurveyPropertyValidatorsEditor = undefined;
	
	var _propertyItemsEditor = __webpack_require__(5);
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var _objectEditor = __webpack_require__(10);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyValidatorsEditor = exports.SurveyPropertyValidatorsEditor = function (_super) {
	    __extends(SurveyPropertyValidatorsEditor, _super);
	    function SurveyPropertyValidatorsEditor() {
	        _super.call(this);
	        this.availableValidators = [];
	        this.validatorClasses = [];
	        var self = this;
	        this.selectedObjectEditor = new _objectEditor.SurveyObjectEditor();
	        this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
	            self.onPropertyValueChanged(options.property, options.object, options.newValue);
	        });
	        this.koSelected = ko.observable(null);
	        this.koSelected.subscribe(function (newValue) {
	            self.selectedObjectEditor.selectedObject = newValue != null ? newValue.validator : null;
	        });
	        this.validatorClasses = Survey.JsonObject.metaData.getChildrenClasses("surveyvalidator", true);
	        this.availableValidators = this.getAvailableValidators();
	        this.onDeleteClick = function () {
	            self.koItems.remove(self.koSelected());
	        };
	        this.onAddClick = function (validatorType) {
	            self.addItem(validatorType);
	        };
	    }
	    Object.defineProperty(SurveyPropertyValidatorsEditor.prototype, "editorType", {
	        get: function get() {
	            return "validators";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyValidatorsEditor.prototype.onValueChanged = function () {
	        _super.prototype.onValueChanged.call(this);
	        if (this.koSelected) {
	            this.koSelected(this.koItems().length > 0 ? this.koItems()[0] : null);
	        }
	    };
	    SurveyPropertyValidatorsEditor.prototype.createEditorItem = function (item) {
	        var jsonObj = new Survey.JsonObject();
	        var validator = Survey.JsonObject.metaData.createClass(item.getType());
	        jsonObj.toObject(item, validator);
	        return new SurveyPropertyValidatorItem(validator);
	    };
	    SurveyPropertyValidatorsEditor.prototype.createItemFromEditorItem = function (editorItem) {
	        var item = editorItem;
	        return item.validator;
	    };
	    SurveyPropertyValidatorsEditor.prototype.addItem = function (validatorType) {
	        var newValidator = new SurveyPropertyValidatorItem(Survey.JsonObject.metaData.createClass(validatorType));
	        this.koItems.push(newValidator);
	        this.koSelected(newValidator);
	    };
	    SurveyPropertyValidatorsEditor.prototype.getAvailableValidators = function () {
	        var result = [];
	        for (var i = 0; i < this.validatorClasses.length; i++) {
	            result.push(this.validatorClasses[i].name);
	        }
	        return result;
	    };
	    SurveyPropertyValidatorsEditor.prototype.onPropertyValueChanged = function (property, obj, newValue) {
	        if (this.koSelected() == null) return;
	        this.koSelected().validator[property.name] = newValue;
	    };
	    return SurveyPropertyValidatorsEditor;
	}(_propertyItemsEditor.SurveyPropertyItemsEditor);
	var SurveyPropertyValidatorItem = exports.SurveyPropertyValidatorItem = function () {
	    function SurveyPropertyValidatorItem(validator) {
	        this.validator = validator;
	        this.text = validator.getType();
	    }
	    return SurveyPropertyValidatorItem;
	}();
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("validators", function () {
	    return new SurveyPropertyValidatorsEditor();
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyObjectEditor = undefined;
	
	var _objectProperty = __webpack_require__(11);
	
	var _editorLocalization = __webpack_require__(7);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyObjectEditor = exports.SurveyObjectEditor = function () {
	    function SurveyObjectEditor(propertyEditorOptions) {
	        if (propertyEditorOptions === void 0) {
	            propertyEditorOptions = null;
	        }
	        this.propertyEditorOptions = null;
	        this.onPropertyValueChanged = new Survey.Event();
	        this.setOptions(propertyEditorOptions);
	        this.koProperties = ko.observableArray();
	        this.koActiveProperty = ko.observable();
	        this.koHasObject = ko.observable();
	    }
	    Object.defineProperty(SurveyObjectEditor.prototype, "selectedObject", {
	        get: function get() {
	            return this.selectedObjectValue;
	        },
	        set: function set(value) {
	            if (this.selectedObjectValue == value) return;
	            this.koHasObject(value != null);
	            this.selectedObjectValue = value;
	            this.updateProperties();
	            this.updatePropertiesObject();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyObjectEditor.prototype.setOptions = function (propertyEditorOptions) {
	        this.propertyEditorOptions = propertyEditorOptions;
	    };
	    SurveyObjectEditor.prototype.getPropertyEditor = function (name) {
	        var properties = this.koProperties();
	        for (var i = 0; i < properties.length; i++) {
	            if (properties[i].name == name) return properties[i];
	        }
	        return null;
	    };
	    SurveyObjectEditor.prototype.changeActiveProperty = function (property) {
	        this.koActiveProperty(property);
	    };
	    SurveyObjectEditor.prototype.ObjectChanged = function () {
	        this.updatePropertiesObject();
	    };
	    SurveyObjectEditor.prototype.updateProperties = function () {
	        var _this = this;
	        if (!this.selectedObject || !this.selectedObject.getType) {
	            this.koProperties([]);
	            this.koActiveProperty(null);
	            return;
	        }
	        var properties = Survey.JsonObject.metaData.getProperties(this.selectedObject.getType());
	        properties.sort(function (a, b) {
	            if (a.name == b.name) return 0;
	            if (a.name > b.name) return 1;
	            return -1;
	        });
	        var objectProperties = [];
	        var self = this;
	        var propEvent = function propEvent(property, newValue) {
	            self.onPropertyValueChanged.fire(_this, { property: property.property, object: property.object, newValue: newValue });
	        };
	        for (var i = 0; i < properties.length; i++) {
	            if (!this.canShowProperty(properties[i])) continue;
	            var objectProperty = new _objectProperty.SurveyObjectProperty(properties[i], propEvent, this.propertyEditorOptions);
	            var locName = this.selectedObject.getType() + '_' + properties[i].name;
	            objectProperty.displayName = _editorLocalization.editorLocalization.getPropertyName(locName);
	            var title = _editorLocalization.editorLocalization.getPropertyTitle(locName);
	            if (!title) title = objectProperty.displayName;
	            objectProperty.title = title;
	            objectProperties.push(objectProperty);
	        }
	        this.koProperties(objectProperties);
	        this.koActiveProperty(this.getPropertyEditor("name"));
	    };
	    SurveyObjectEditor.prototype.canShowProperty = function (property) {
	        var name = property.name;
	        if (name == 'questions' || name == 'pages') return false;
	        if (this.onCanShowPropertyCallback) return this.onCanShowPropertyCallback(this.selectedObject, property);
	        return true;
	    };
	    SurveyObjectEditor.prototype.updatePropertiesObject = function () {
	        var properties = this.koProperties();
	        for (var i = 0; i < properties.length; i++) {
	            properties[i].object = this.selectedObject;
	        }
	    };
	    return SurveyObjectEditor;
	}();

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyObjectProperty = undefined;
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var _editorLocalization = __webpack_require__(7);
	
	var SurveyObjectProperty = exports.SurveyObjectProperty = function () {
	    function SurveyObjectProperty(property, onPropertyChanged, propertyEditorOptions) {
	        if (onPropertyChanged === void 0) {
	            onPropertyChanged = null;
	        }
	        if (propertyEditorOptions === void 0) {
	            propertyEditorOptions = null;
	        }
	        this.property = property;
	        this.isApplyingNewValue = false;
	        this.onPropertyChanged = onPropertyChanged;
	        this.name = this.property.name;
	        this.koValue = ko.observable();
	        this.choices = property.choices;
	        var self = this;
	        this.editorType = property.type;
	        //TODO
	        if (this.choices != null) {
	            this.editorType = "dropdown";
	        }
	        var onItemChanged = function onItemChanged(newValue) {
	            self.onApplyEditorValue(newValue);
	        };
	        this.editor = _propertyEditorBase.SurveyPropertyEditorBase.createEditor(this.editorType, onItemChanged);
	        this.editor.options = propertyEditorOptions;
	        this.editorType = this.editor.editorType;
	        this.modalName = "modelEditor" + this.editorType + this.name;
	        this.modalNameTarget = "#" + this.modalName;
	        this.koValue.subscribe(function (newValue) {
	            self.onkoValueChanged(newValue);
	        });
	        this.koText = ko.computed(function () {
	            return self.getValueText(self.koValue());
	        });
	        this.koIsDefault = ko.computed(function () {
	            return self.property.isDefaultValue(self.koValue());
	        });
	    }
	    Object.defineProperty(SurveyObjectProperty.prototype, "object", {
	        get: function get() {
	            return this.objectValue;
	        },
	        set: function set(value) {
	            this.objectValue = value;
	            this.updateValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyObjectProperty.prototype.updateValue = function () {
	        this.isValueUpdating = true;
	        this.koValue(this.getValue());
	        this.editor.setObject(this.object);
	        this.editor.setTitle(_editorLocalization.editorLocalization.getString("pe.editProperty")["format"](this.property.name));
	        this.updateEditorData(this.koValue());
	        this.isValueUpdating = false;
	    };
	    SurveyObjectProperty.prototype.onApplyEditorValue = function (newValue) {
	        this.isApplyingNewValue = true;
	        this.koValue(newValue);
	        this.isApplyingNewValue = false;
	    };
	    SurveyObjectProperty.prototype.onkoValueChanged = function (newValue) {
	        if (!this.isApplyingNewValue) {
	            this.updateEditorData(newValue);
	        }
	        if (this.object == null) return;
	        if (this.object[this.name] == newValue) return;
	        if (this.onPropertyChanged != null && !this.isValueUpdating) this.onPropertyChanged(this, newValue);
	    };
	    SurveyObjectProperty.prototype.updateEditorData = function (newValue) {
	        this.editor.value = newValue;
	    };
	    SurveyObjectProperty.prototype.getValue = function () {
	        if (this.property.hasToUseGetValue) return this.property.getValue(this.object);
	        return this.object[this.name];
	    };
	    SurveyObjectProperty.prototype.getValueText = function (value) {
	        return this.editor.getValueText(value);
	    };
	    return SurveyObjectProperty;
	}();

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyItemValuesEditor = undefined;
	
	var _propertyItemsEditor = __webpack_require__(5);
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyItemValuesEditor = exports.SurveyPropertyItemValuesEditor = function (_super) {
	    __extends(SurveyPropertyItemValuesEditor, _super);
	    function SurveyPropertyItemValuesEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyPropertyItemValuesEditor.prototype, "editorType", {
	        get: function get() {
	            return "itemvalues";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyItemValuesEditor.prototype.hasError = function () {
	        var result = false;
	        for (var i = 0; i < this.koItems().length; i++) {
	            var item = this.koItems()[i];
	            item.koHasError(!item.koValue());
	            result = result || item.koHasError();
	        }
	        return result;
	    };
	    SurveyPropertyItemValuesEditor.prototype.createNewEditorItem = function () {
	        return { koValue: ko.observable(), koText: ko.observable(), koHasError: ko.observable(false) };
	    };
	    SurveyPropertyItemValuesEditor.prototype.createEditorItem = function (item) {
	        var itemValue = item;
	        var itemText = null;
	        if (item.value) {
	            itemValue = item.value;
	            itemText = item.text;
	        }
	        return { koValue: ko.observable(itemValue), koText: ko.observable(itemText), koHasError: ko.observable(false) };
	    };
	    SurveyPropertyItemValuesEditor.prototype.createItemFromEditorItem = function (editorItem) {
	        var alwaySaveTextInPropertyEditors = this.options && this.options.alwaySaveTextInPropertyEditors;
	        var text = editorItem.koText();
	        if (!alwaySaveTextInPropertyEditors && editorItem.koText() == editorItem.koValue()) {
	            text = null;
	        }
	        return { value: editorItem.koValue(), text: text };
	    };
	    return SurveyPropertyItemValuesEditor;
	}(_propertyItemsEditor.SurveyPropertyItemsEditor);
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("itemvalues", function () {
	    return new SurveyPropertyItemValuesEditor();
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyMatrixDropdownColumnsItem = exports.SurveyPropertyDropdownColumnsEditor = undefined;
	
	var _propertyItemsEditor = __webpack_require__(5);
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var _propertyItemValuesEditor = __webpack_require__(12);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyDropdownColumnsEditor = exports.SurveyPropertyDropdownColumnsEditor = function (_super) {
	    __extends(SurveyPropertyDropdownColumnsEditor, _super);
	    function SurveyPropertyDropdownColumnsEditor() {
	        _super.call(this);
	    }
	    Object.defineProperty(SurveyPropertyDropdownColumnsEditor.prototype, "editorType", {
	        get: function get() {
	            return "matrixdropdowncolumns";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyDropdownColumnsEditor.prototype.hasError = function () {
	        var result = false;
	        for (var i = 0; i < this.koItems().length; i++) {
	            result = result || this.koItems()[i].hasError();
	        }
	        return result;
	    };
	    SurveyPropertyDropdownColumnsEditor.prototype.createNewEditorItem = function () {
	        return new SurveyPropertyMatrixDropdownColumnsItem(new Survey.MatrixDropdownColumn("", this.options));
	    };
	    SurveyPropertyDropdownColumnsEditor.prototype.createEditorItem = function (item) {
	        return new SurveyPropertyMatrixDropdownColumnsItem(item, this.options);
	    };
	    SurveyPropertyDropdownColumnsEditor.prototype.createItemFromEditorItem = function (editorItem) {
	        var columItem = editorItem;
	        columItem.apply();
	        return columItem.column;
	    };
	    return SurveyPropertyDropdownColumnsEditor;
	}(_propertyItemsEditor.SurveyPropertyItemsEditor);
	var SurveyPropertyMatrixDropdownColumnsItem = exports.SurveyPropertyMatrixDropdownColumnsItem = function () {
	    function SurveyPropertyMatrixDropdownColumnsItem(column, options) {
	        if (options === void 0) {
	            options = null;
	        }
	        this.column = column;
	        this.options = options;
	        this.cellTypeChoices = this.getPropertyChoices("cellType");
	        this.colCountChoices = this.getPropertyChoices("colCount");
	        this.koName = ko.observable(column.name);
	        this.koCellType = ko.observable(column.cellType);
	        this.koColCount = ko.observable(column.colCount);
	        this.koIsRequired = ko.observable(column.isRequired ? true : false);
	        this.koHasOther = ko.observable(column.hasOther ? true : false);
	        this.koTitle = ko.observable(column.name === column.title ? "" : column.title);
	        this.koShowChoices = ko.observable(false);
	        this.koChoices = ko.observableArray(column.choices);
	        this.koHasError = ko.observable(false);
	        this.choicesEditor = new _propertyItemValuesEditor.SurveyPropertyItemValuesEditor();
	        this.choicesEditor.object = this.column;
	        this.choicesEditor.value = this.koChoices();
	        this.choicesEditor.options = this.options;
	        var self = this;
	        this.onShowChoicesClick = function () {
	            self.koShowChoices(!self.koShowChoices());
	        };
	        this.koHasChoices = ko.computed(function () {
	            return self.koCellType() == "dropdown" || self.koCellType() == "checkbox" || self.koCellType() == "radiogroup";
	        });
	        this.koHasColCount = ko.computed(function () {
	            return self.koCellType() == "checkbox" || self.koCellType() == "radiogroup";
	        });
	    }
	    SurveyPropertyMatrixDropdownColumnsItem.prototype.hasError = function () {
	        this.koHasError(!this.koName());
	        return this.koHasError() || this.choicesEditor.hasError();
	    };
	    SurveyPropertyMatrixDropdownColumnsItem.prototype.apply = function () {
	        this.column.name = this.koName();
	        this.column.title = this.koTitle();
	        this.column.cellType = this.koCellType();
	        this.column.colCount = this.koColCount();
	        this.column.isRequired = this.koIsRequired();
	        this.column.hasOther = this.koHasOther();
	        this.choicesEditor.onApplyClick();
	        this.column.choices = this.choicesEditor.value;
	    };
	    SurveyPropertyMatrixDropdownColumnsItem.prototype.getPropertyChoices = function (propetyName) {
	        var properties = Survey.JsonObject.metaData.getProperties("matrixdropdowncolumn");
	        for (var i = 0; i < properties.length; i++) {
	            if (properties[i].name == propetyName) return properties[i].choices;
	        }
	        return [];
	    };
	    return SurveyPropertyMatrixDropdownColumnsItem;
	}();
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("matrixdropdowncolumns", function () {
	    return new SurveyPropertyDropdownColumnsEditor();
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyResultfullEditor = undefined;
	
	var _propertyModalEditor = __webpack_require__(6);
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var _editorLocalization = __webpack_require__(7);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyResultfullEditor = exports.SurveyPropertyResultfullEditor = function (_super) {
	    __extends(SurveyPropertyResultfullEditor, _super);
	    function SurveyPropertyResultfullEditor() {
	        _super.call(this);
	        this.koUrl = ko.observable();
	        this.koPath = ko.observable();
	        this.koValueName = ko.observable();
	        this.koTitleName = ko.observable();
	        this.createSurvey();
	        var self = this;
	        this.koUrl.subscribe(function (newValue) {
	            self.question.choicesByUrl.url = newValue;self.run();
	        });
	        this.koPath.subscribe(function (newValue) {
	            self.question.choicesByUrl.path = newValue;self.run();
	        });
	        this.koValueName.subscribe(function (newValue) {
	            self.question.choicesByUrl.valueName = newValue;self.run();
	        });
	        this.koTitleName.subscribe(function (newValue) {
	            self.question.choicesByUrl.titleName = newValue;self.run();
	        });
	    }
	    Object.defineProperty(SurveyPropertyResultfullEditor.prototype, "editorType", {
	        get: function get() {
	            return "restfull";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyPropertyResultfullEditor.prototype, "restfullValue", {
	        get: function get() {
	            return this.value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyResultfullEditor.prototype.getValueText = function (value) {
	        if (!value || !value.url) return _editorLocalization.editorLocalization.getString("pe.empty");
	        var str = value.url;
	        if (str.length > 20) {
	            str = str.substr(0, 20) + "...";
	        }
	        return str;
	    };
	    SurveyPropertyResultfullEditor.prototype.onValueChanged = function () {
	        var val = this.restfullValue;
	        this.koUrl(val ? val.url : "");
	        this.koPath(val ? val.path : "");
	        this.koValueName(val ? val.valueName : "");
	        this.koTitleName(val ? val.titleName : "");
	        this.survey.render("restfullSurvey");
	    };
	    SurveyPropertyResultfullEditor.prototype.onBeforeApply = function () {
	        var val = new Survey.ChoicesRestfull();
	        val.url = this.koUrl();
	        val.path = this.koPath();
	        val.valueName = this.koValueName();
	        val.titleName = this.koTitleName();
	        this.setValueCore(val);
	    };
	    SurveyPropertyResultfullEditor.prototype.run = function () {
	        this.question.choicesByUrl.run();
	    };
	    SurveyPropertyResultfullEditor.prototype.createSurvey = function () {
	        this.survey = new Survey.Survey();
	        this.survey.showNavigationButtons = false;
	        this.survey.showQuestionNumbers = "off";
	        var page = this.survey.addNewPage("page1");
	        this.question = page.addNewQuestion("dropdown", "q1");
	        this.question.title = _editorLocalization.editorLocalization.getString("pe.testService");
	        this.question.choices = [];
	        this.survey.render("restfullSurvey");
	    };
	    return SurveyPropertyResultfullEditor;
	}(_propertyModalEditor.SurveyPropertyModalEditor);
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("restfull", function () {
	    return new SurveyPropertyResultfullEditor();
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPropertyTriggerObjects = exports.SurveyPropertySetValueTrigger = exports.SurveyPropertyVisibleTrigger = exports.SurveyPropertyTrigger = exports.SurveyPropertyTriggersEditor = undefined;
	
	var _propertyItemsEditor = __webpack_require__(5);
	
	var _propertyEditorBase = __webpack_require__(3);
	
	var _editorLocalization = __webpack_require__(7);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyPropertyTriggersEditor = exports.SurveyPropertyTriggersEditor = function (_super) {
	    __extends(SurveyPropertyTriggersEditor, _super);
	    function SurveyPropertyTriggersEditor() {
	        _super.call(this);
	        this.availableTriggers = [];
	        this.triggerClasses = [];
	        var self = this;
	        this.onDeleteClick = function () {
	            self.koItems.remove(self.koSelected());
	        };
	        this.onAddClick = function (triggerType) {
	            self.addItem(triggerType);
	        };
	        this.koSelected = ko.observable(null);
	        this.koPages = ko.observableArray();
	        this.koQuestions = ko.observableArray();
	        this.triggerClasses = Survey.JsonObject.metaData.getChildrenClasses("surveytrigger", true);
	        this.availableTriggers = this.getAvailableTriggers();
	    }
	    Object.defineProperty(SurveyPropertyTriggersEditor.prototype, "editorType", {
	        get: function get() {
	            return "triggers";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPropertyTriggersEditor.prototype.onValueChanged = function () {
	        _super.prototype.onValueChanged.call(this);
	        if (this.object) {
	            this.koPages(this.getNames(this.object.pages));
	            this.koQuestions(this.getNames(this.object.getAllQuestions()));
	        }
	        if (this.koSelected) {
	            this.koSelected(this.koItems().length > 0 ? this.koItems()[0] : null);
	        }
	    };
	    SurveyPropertyTriggersEditor.prototype.addItem = function (triggerType) {
	        var trigger = Survey.JsonObject.metaData.createClass(triggerType);
	        var triggerItem = this.createPropertyTrigger(trigger);
	        this.koItems.push(triggerItem);
	        this.koSelected(triggerItem);
	    };
	    SurveyPropertyTriggersEditor.prototype.createEditorItem = function (item) {
	        var jsonObj = new Survey.JsonObject();
	        var trigger = Survey.JsonObject.metaData.createClass(item.getType());
	        jsonObj.toObject(item, trigger);
	        return this.createPropertyTrigger(trigger);
	    };
	    SurveyPropertyTriggersEditor.prototype.createItemFromEditorItem = function (editorItem) {
	        var editorTrigger = editorItem;
	        return editorTrigger.createTrigger();
	    };
	    SurveyPropertyTriggersEditor.prototype.getAvailableTriggers = function () {
	        var result = [];
	        for (var i = 0; i < this.triggerClasses.length; i++) {
	            result.push(this.triggerClasses[i].name);
	        }
	        return result;
	    };
	    SurveyPropertyTriggersEditor.prototype.getNames = function (items) {
	        var names = [];
	        for (var i = 0; i < items.length; i++) {
	            var item = items[i];
	            if (item["name"]) {
	                names.push(item["name"]);
	            }
	        }
	        return names;
	    };
	    SurveyPropertyTriggersEditor.prototype.createPropertyTrigger = function (trigger) {
	        var triggerItem = null;
	        if (trigger.getType() == "visibletrigger") {
	            triggerItem = new SurveyPropertyVisibleTrigger(trigger, this.koPages, this.koQuestions);
	        }
	        if (trigger.getType() == "setvaluetrigger") {
	            triggerItem = new SurveyPropertySetValueTrigger(trigger, this.koQuestions);
	        }
	        if (!triggerItem) {
	            triggerItem = new SurveyPropertyTrigger(trigger);
	        }
	        return triggerItem;
	    };
	    return SurveyPropertyTriggersEditor;
	}(_propertyItemsEditor.SurveyPropertyItemsEditor);
	var SurveyPropertyTrigger = exports.SurveyPropertyTrigger = function () {
	    function SurveyPropertyTrigger(trigger) {
	        this.trigger = trigger;
	        this.operators = ["empty", "notempty", "equal", "notequal", "contains", "notcontains", "greater", "less", "greaterorequal", "lessorequal"];
	        this.availableOperators = [];
	        this.createOperators();
	        this.triggerType = trigger.getType();
	        this.koType = ko.observable(this.triggerType);
	        this.koName = ko.observable(trigger.name);
	        this.koOperator = ko.observable(trigger.operator);
	        this.koValue = ko.observable(trigger.value);
	        var self = this;
	        this.koRequireValue = ko.computed(function () {
	            return self.koOperator() != "empty" && self.koOperator() != "notempty";
	        });
	        this.koIsValid = ko.computed(function () {
	            if (self.koName() && (!self.koRequireValue() || self.koValue())) return true;return false;
	        });
	        this.koText = ko.computed(function () {
	            self.koName();self.koOperator();self.koValue();return self.getText();
	        });
	    }
	    SurveyPropertyTrigger.prototype.createTrigger = function () {
	        var trigger = Survey.JsonObject.metaData.createClass(this.triggerType);
	        trigger.name = this.koName();
	        trigger.operator = this.koOperator();
	        trigger.value = this.koValue();
	        return trigger;
	    };
	    SurveyPropertyTrigger.prototype.createOperators = function () {
	        for (var i = 0; i < this.operators.length; i++) {
	            var name = this.operators[i];
	            this.availableOperators.push({ name: name, text: _editorLocalization.editorLocalization.getString("op." + name) });
	        }
	    };
	    SurveyPropertyTrigger.prototype.getText = function () {
	        if (!this.koIsValid()) return _editorLocalization.editorLocalization.getString("pe.triggerNotSet");
	        return _editorLocalization.editorLocalization.getString("pe.triggerRunIf") + " '" + this.koName() + "' " + this.getOperatorText() + this.getValueText();
	    };
	    SurveyPropertyTrigger.prototype.getOperatorText = function () {
	        var op = this.koOperator();
	        for (var i = 0; i < this.availableOperators.length; i++) {
	            if (this.availableOperators[i].name == op) return this.availableOperators[i].text;
	        }
	        return op;
	    };
	    SurveyPropertyTrigger.prototype.getValueText = function () {
	        if (!this.koRequireValue()) return "";
	        return " " + this.koValue();
	    };
	    return SurveyPropertyTrigger;
	}();
	var SurveyPropertyVisibleTrigger = exports.SurveyPropertyVisibleTrigger = function (_super) {
	    __extends(SurveyPropertyVisibleTrigger, _super);
	    function SurveyPropertyVisibleTrigger(trigger, koPages, koQuestions) {
	        _super.call(this, trigger);
	        this.trigger = trigger;
	        this.pages = new SurveyPropertyTriggerObjects(_editorLocalization.editorLocalization.getString("pe.triggerMakePagesVisible"), koPages(), trigger.pages);
	        this.questions = new SurveyPropertyTriggerObjects(_editorLocalization.editorLocalization.getString("pe.triggerMakeQuestionsVisible"), koQuestions(), trigger.questions);
	    }
	    SurveyPropertyVisibleTrigger.prototype.createTrigger = function () {
	        var trigger = _super.prototype.createTrigger.call(this);
	        trigger.pages = this.pages.koChoosen();
	        trigger.questions = this.questions.koChoosen();
	        return trigger;
	    };
	    return SurveyPropertyVisibleTrigger;
	}(SurveyPropertyTrigger);
	var SurveyPropertySetValueTrigger = exports.SurveyPropertySetValueTrigger = function (_super) {
	    __extends(SurveyPropertySetValueTrigger, _super);
	    function SurveyPropertySetValueTrigger(trigger, koQuestions) {
	        _super.call(this, trigger);
	        this.trigger = trigger;
	        this.koQuestions = koQuestions;
	        this.kosetToName = ko.observable(trigger.setToName);
	        this.kosetValue = ko.observable(trigger.setValue);
	        this.koisVariable = ko.observable(trigger.isVariable);
	    }
	    SurveyPropertySetValueTrigger.prototype.createTrigger = function () {
	        var trigger = _super.prototype.createTrigger.call(this);
	        trigger.setToName = this.kosetToName();
	        trigger.setValue = this.kosetValue();
	        trigger.isVariable = this.koisVariable();
	        return trigger;
	    };
	    return SurveyPropertySetValueTrigger;
	}(SurveyPropertyTrigger);
	var SurveyPropertyTriggerObjects = exports.SurveyPropertyTriggerObjects = function () {
	    function SurveyPropertyTriggerObjects(title, allObjects, choosenObjects) {
	        this.title = title;
	        this.koChoosen = ko.observableArray(choosenObjects);
	        var array = [];
	        for (var i = 0; i < allObjects.length; i++) {
	            var item = allObjects[i];
	            if (choosenObjects.indexOf(item) < 0) {
	                array.push(item);
	            }
	        }
	        this.koObjects = ko.observableArray(array);
	        this.koSelected = ko.observable();
	        this.koChoosenSelected = ko.observable();
	        var self = this;
	        this.onDeleteClick = function () {
	            self.deleteItem();
	        };
	        this.onAddClick = function () {
	            self.addItem();
	        };
	    }
	    SurveyPropertyTriggerObjects.prototype.deleteItem = function () {
	        this.changeItems(this.koChoosenSelected(), this.koChoosen, this.koObjects);
	    };
	    SurveyPropertyTriggerObjects.prototype.addItem = function () {
	        this.changeItems(this.koSelected(), this.koObjects, this.koChoosen);
	    };
	    SurveyPropertyTriggerObjects.prototype.changeItems = function (item, removedFrom, addTo) {
	        removedFrom.remove(item);
	        addTo.push(item);
	        removedFrom.sort();
	        addTo.sort();
	    };
	    return SurveyPropertyTriggerObjects;
	}();
	_propertyEditorBase.SurveyPropertyEditorBase.registerEditor("triggers", function () {
	    return new SurveyPropertyTriggersEditor();
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyPagesEditor = undefined;
	
	var _surveyHelper = __webpack_require__(8);
	
	var SurveyPagesEditor = exports.SurveyPagesEditor = function () {
	    function SurveyPagesEditor(onAddNewPageCallback, onSelectPageCallback, onMovePageCallback, onDeletePageCallback) {
	        if (onAddNewPageCallback === void 0) {
	            onAddNewPageCallback = null;
	        }
	        if (onSelectPageCallback === void 0) {
	            onSelectPageCallback = null;
	        }
	        if (onMovePageCallback === void 0) {
	            onMovePageCallback = null;
	        }
	        if (onDeletePageCallback === void 0) {
	            onDeletePageCallback = null;
	        }
	        this.draggingPage = null;
	        this.koPages = ko.observableArray();
	        this.koIsValid = ko.observable(false);
	        this.onAddNewPageCallback = onAddNewPageCallback;
	        this.onSelectPageCallback = onSelectPageCallback;
	        this.onMovePageCallback = onMovePageCallback;
	        this.onDeletePageCallback = onDeletePageCallback;
	        var self = this;
	        this.selectPageClick = function (pageItem) {
	            if (self.onSelectPageCallback) {
	                self.onSelectPageCallback(pageItem.page);
	            }
	        };
	        this.keyDown = function (el, e) {
	            self.onKeyDown(el, e);
	        };
	        this.dragStart = function (el) {
	            self.draggingPage = el;
	        };
	        this.dragOver = function (el) {};
	        this.dragEnd = function () {
	            self.draggingPage = null;
	        };
	        this.dragDrop = function (el) {
	            self.moveDraggingPageTo(el);
	        };
	    }
	    Object.defineProperty(SurveyPagesEditor.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        set: function set(value) {
	            this.surveyValue = value;
	            this.koIsValid(this.surveyValue != null);
	            this.updatePages();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyPagesEditor.prototype.setSelectedPage = function (page) {
	        var pages = this.koPages();
	        for (var i = 0; i < pages.length; i++) {
	            pages[i].koSelected(pages[i].page == page);
	        }
	    };
	    SurveyPagesEditor.prototype.addNewPageClick = function () {
	        if (this.onAddNewPageCallback) {
	            this.onAddNewPageCallback();
	        }
	    };
	    SurveyPagesEditor.prototype.removePage = function (page) {
	        var index = this.getIndexByPage(page);
	        if (index > -1) {
	            this.koPages.splice(index, 1);
	        }
	    };
	    SurveyPagesEditor.prototype.changeName = function (page) {
	        var index = this.getIndexByPage(page);
	        if (index > -1) {
	            this.koPages()[index].title(_surveyHelper.SurveyHelper.getObjectName(page));
	        }
	    };
	    SurveyPagesEditor.prototype.getIndexByPage = function (page) {
	        var pages = this.koPages();
	        for (var i = 0; i < pages.length; i++) {
	            if (pages[i].page == page) return i;
	        }
	        return -1;
	    };
	    SurveyPagesEditor.prototype.onKeyDown = function (el, e) {
	        if (this.koPages().length <= 1) return;
	        var pages = this.koPages();
	        var pageIndex = -1;
	        for (var i = 0; i < pages.length; i++) {
	            if (pages[i].page && pages[i].koSelected()) {
	                pageIndex = i;
	            }
	        }
	        if (pageIndex < 0) return;
	        if (e.keyCode == 46 && this.onDeletePageCallback) this.onDeletePageCallback(el.page);
	        if ((e.keyCode == 37 || e.keyCode == 39) && this.onSelectPageCallback) {
	            pageIndex += e.keyCode == 37 ? -1 : 1;
	            if (pageIndex < 0) pageIndex = pages.length - 1;
	            if (pageIndex >= pages.length) pageIndex = 0;
	            var page = pages[pageIndex].page;
	            this.onSelectPageCallback(page);
	            this.setSelectedPage(page);
	        }
	    };
	    SurveyPagesEditor.prototype.updatePages = function () {
	        if (this.surveyValue == null) {
	            this.koPages([]);
	            return;
	        }
	        var pages = [];
	        for (var i = 0; i < this.surveyValue.pages.length; i++) {
	            var page = this.surveyValue.pages[i];
	            pages.push({
	                title: ko.observable(_surveyHelper.SurveyHelper.getObjectName(page)), page: page, koSelected: ko.observable(false)
	            });
	        }
	        this.koPages(pages);
	    };
	    SurveyPagesEditor.prototype.moveDraggingPageTo = function (toPage) {
	        if (toPage == null || toPage == this.draggingPage) {
	            this.draggingPage = null;
	            return;
	        }
	        if (this.draggingPage == null) return;
	        var index = this.koPages().indexOf(this.draggingPage);
	        var indexTo = this.koPages().indexOf(toPage);
	        if (this.onMovePageCallback) {
	            this.onMovePageCallback(index, indexTo);
	        }
	    };
	    return SurveyPagesEditor;
	}();

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyTextWorker = undefined;
	
	var _json = __webpack_require__(18);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var TextParserPropery = function () {
	    function TextParserPropery() {}
	    return TextParserPropery;
	}();
	var SurveyTextWorker = exports.SurveyTextWorker = function () {
	    function SurveyTextWorker(text) {
	        this.text = text;
	        if (!this.text || this.text.trim() == "") {
	            this.text = "{}";
	        }
	        this.errors = [];
	        this.process();
	    }
	    Object.defineProperty(SurveyTextWorker.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyTextWorker.prototype, "isJsonCorrect", {
	        get: function get() {
	            return this.surveyValue != null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyTextWorker.prototype.process = function () {
	        try {
	            this.jsonValue = new _json.SurveyJSON5(1).parse(this.text);
	        } catch (error) {
	            this.errors.push({ pos: { start: error.at, end: -1 }, text: error.message });
	        }
	        if (this.jsonValue != null) {
	            this.updateJsonPositions(this.jsonValue);
	            this.surveyValue = new Survey.Survey(this.jsonValue);
	            if (this.surveyValue.jsonErrors != null) {
	                for (var i = 0; i < this.surveyValue.jsonErrors.length; i++) {
	                    var error = this.surveyValue.jsonErrors[i];
	                    this.errors.push({ pos: { start: error.at, end: -1 }, text: error.getFullDescription() });
	                }
	            }
	        }
	        this.surveyObjects = this.createSurveyObjects();
	        this.setEditorPositionByChartAt(this.surveyObjects);
	        this.setEditorPositionByChartAt(this.errors);
	    };
	    SurveyTextWorker.prototype.updateJsonPositions = function (jsonObj) {
	        jsonObj["pos"]["self"] = jsonObj;
	        for (var key in jsonObj) {
	            var obj = jsonObj[key];
	            if (obj && obj["pos"]) {
	                jsonObj["pos"][key] = obj["pos"];
	                this.updateJsonPositions(obj);
	            }
	        }
	    };
	    SurveyTextWorker.prototype.createSurveyObjects = function () {
	        var result = [];
	        if (this.surveyValue == null) return result;
	        this.isSurveyAsPage = false;
	        for (var i = 0; i < this.surveyValue.pages.length; i++) {
	            var page = this.surveyValue.pages[i];
	            if (i == 0 && !page["pos"]) {
	                page["pos"] = this.surveyValue["pos"];
	                this.isSurveyAsPage = true;
	            }
	            result.push(page);
	            for (var j = 0; j < page.questions.length; j++) {
	                result.push(page.questions[j]);
	            }
	        }
	        return result;
	    };
	    SurveyTextWorker.prototype.setEditorPositionByChartAt = function (objects) {
	        if (objects == null || objects.length == 0) return;
	        var position = { row: 0, column: 0 };
	        var atObjectsArray = this.getAtArray(objects);
	        var startAt = 0;
	        for (var i = 0; i < atObjectsArray.length; i++) {
	            var at = atObjectsArray[i].at;
	            position = this.getPostionByChartAt(position, startAt, at);
	            var obj = atObjectsArray[i].obj;
	            if (!obj.position) obj.position = {};
	            if (at == obj.pos.start) {
	                obj.position.start = position;
	            } else {
	                if (at == obj.pos.end) {
	                    obj.position.end = position;
	                }
	            }
	            startAt = at;
	        }
	    };
	    SurveyTextWorker.prototype.getPostionByChartAt = function (startPosition, startAt, at) {
	        var result = { row: startPosition.row, column: startPosition.column };
	        var curChar = startAt;
	        while (curChar < at) {
	            if (this.text.charAt(curChar) == SurveyTextWorker.newLineChar) {
	                result.row++;
	                result.column = 0;
	            } else {
	                result.column++;
	            }
	            curChar++;
	        }
	        return result;
	    };
	    SurveyTextWorker.prototype.getAtArray = function (objects) {
	        var result = [];
	        for (var i = 0; i < objects.length; i++) {
	            var obj = objects[i];
	            var pos = obj.pos;
	            if (!pos) continue;
	            result.push({ at: pos.start, obj: obj });
	            if (pos.end > 0) {
	                result.push({ at: pos.end, obj: obj });
	            }
	        }
	        return result.sort(function (el1, el2) {
	            if (el1.at > el2.at) return 1;
	            if (el1.at < el2.at) return -1;
	            return 0;
	        });
	    };
	    return SurveyTextWorker;
	}();

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// This file is based on JSON5, http://json5.org/
	// The modification for getting object and properties location 'at' were maden.
	var SurveyJSON5 = exports.SurveyJSON5 = function () {
	    function SurveyJSON5(parseType) {
	        if (parseType === void 0) {
	            parseType = 0;
	        }
	        this.parseType = parseType;
	    }
	    SurveyJSON5.prototype.parse = function (source, reviver, startFrom, endAt) {
	        if (reviver === void 0) {
	            reviver = null;
	        }
	        if (startFrom === void 0) {
	            startFrom = 0;
	        }
	        if (endAt === void 0) {
	            endAt = -1;
	        }
	        var result;
	        this.text = String(source);
	        this.at = startFrom;
	        this.endAt = endAt;
	        this.ch = ' ';
	        result = this.value();
	        this.white();
	        if (this.ch) {
	            this.error("Syntax error");
	        }
	        // If there is a reviver function, we recursively walk the new structure,
	        // passing each name/value pair to the reviver function for possible
	        // transformation, starting with a temporary root object that holds the result
	        // in an empty key. If there is not a reviver function, we simply return the
	        // result.
	        return typeof reviver === 'function' ? function walk(holder, key) {
	            var k,
	                v,
	                value = holder[key];
	            if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }({ '': result }, '') : result;
	    };
	    SurveyJSON5.prototype.error = function (m) {
	        // Call error when something is wrong.
	        var error = new SyntaxError();
	        error.message = m;
	        error["at"] = this.at;
	        throw error;
	    };
	    SurveyJSON5.prototype.next = function (c) {
	        if (c === void 0) {
	            c = null;
	        }
	        // If a c parameter is provided, verify that it matches the current character.
	        if (c && c !== this.ch) {
	            this.error("Expected '" + c + "' instead of '" + this.ch + "'");
	        }
	        // Get the this.next character. When there are no more characters,
	        // return the empty string.
	        this.ch = this.chartAt();
	        this.at += 1;
	        return this.ch;
	    };
	    SurveyJSON5.prototype.peek = function () {
	        // Get the this.next character without consuming it or
	        // assigning it to the this.ch varaible.
	        return this.chartAt();
	    };
	    SurveyJSON5.prototype.chartAt = function () {
	        if (this.endAt > -1 && this.at >= this.endAt) return '';
	        return this.text.charAt(this.at);
	    };
	    SurveyJSON5.prototype.identifier = function () {
	        // Parse an identifier. Normally, reserved words are disallowed here, but we
	        // only use this for unquoted object keys, where reserved words are allowed,
	        // so we don't check for those here. References:
	        // - http://es5.github.com/#x7.6
	        // - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
	        // - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
	        // TODO Identifiers can have Unicode "letters" in them; add support for those.
	        var key = this.ch;
	        // Identifiers must start with a letter, _ or $.
	        if (this.ch !== '_' && this.ch !== '$' && (this.ch < 'a' || this.ch > 'z') && (this.ch < 'A' || this.ch > 'Z')) {
	            this.error("Bad identifier");
	        }
	        // Subsequent characters can contain digits.
	        while (this.next() && (this.ch === '_' || this.ch === '$' || this.ch >= 'a' && this.ch <= 'z' || this.ch >= 'A' && this.ch <= 'Z' || this.ch >= '0' && this.ch <= '9')) {
	            key += this.ch;
	        }
	        return key;
	    };
	    SurveyJSON5.prototype.number = function () {
	        // Parse a number value.
	        var number,
	            sign = '',
	            string = '',
	            base = 10;
	        if (this.ch === '-' || this.ch === '+') {
	            sign = this.ch;
	            this.next(this.ch);
	        }
	        // support for Infinity (could tweak to allow other words):
	        if (this.ch === 'I') {
	            number = this.word();
	            if (typeof number !== 'number' || isNaN(number)) {
	                this.error('Unexpected word for number');
	            }
	            return sign === '-' ? -number : number;
	        }
	        // support for NaN
	        if (this.ch === 'N') {
	            number = this.word();
	            if (!isNaN(number)) {
	                this.error('expected word to be NaN');
	            }
	            // ignore sign as -NaN also is NaN
	            return number;
	        }
	        if (this.ch === '0') {
	            string += this.ch;
	            this.next();
	            if (this.ch === 'x' || this.ch === 'X') {
	                string += this.ch;
	                this.next();
	                base = 16;
	            } else if (this.ch >= '0' && this.ch <= '9') {
	                this.error('Octal literal');
	            }
	        }
	        switch (base) {
	            case 10:
	                while (this.ch >= '0' && this.ch <= '9') {
	                    string += this.ch;
	                    this.next();
	                }
	                if (this.ch === '.') {
	                    string += '.';
	                    while (this.next() && this.ch >= '0' && this.ch <= '9') {
	                        string += this.ch;
	                    }
	                }
	                if (this.ch === 'e' || this.ch === 'E') {
	                    string += this.ch;
	                    this.next();
	                    if (this.ch === '-' || this.ch === '+') {
	                        string += this.ch;
	                        this.next();
	                    }
	                    while (this.ch >= '0' && this.ch <= '9') {
	                        string += this.ch;
	                        this.next();
	                    }
	                }
	                break;
	            case 16:
	                while (this.ch >= '0' && this.ch <= '9' || this.ch >= 'A' && this.ch <= 'F' || this.ch >= 'a' && this.ch <= 'f') {
	                    string += this.ch;
	                    this.next();
	                }
	                break;
	        }
	        if (sign === '-') {
	            number = -string;
	        } else {
	            number = +string;
	        }
	        if (!isFinite(number)) {
	            this.error("Bad number");
	        } else {
	            return number;
	        }
	    };
	    SurveyJSON5.prototype.string = function () {
	        // Parse a string value.
	        var hex,
	            i,
	            string = '',
	            delim,
	            // double quote or single quote
	        uffff;
	        // When parsing for string values, we must look for ' or " and \ characters.
	        if (this.ch === '"' || this.ch === "'") {
	            delim = this.ch;
	            while (this.next()) {
	                if (this.ch === delim) {
	                    this.next();
	                    return string;
	                } else if (this.ch === '\\') {
	                    this.next();
	                    if (this.ch === 'u') {
	                        uffff = 0;
	                        for (i = 0; i < 4; i += 1) {
	                            hex = parseInt(this.next(), 16);
	                            if (!isFinite(hex)) {
	                                break;
	                            }
	                            uffff = uffff * 16 + hex;
	                        }
	                        string += String.fromCharCode(uffff);
	                    } else if (this.ch === '\r') {
	                        if (this.peek() === '\n') {
	                            this.next();
	                        }
	                    } else if (typeof SurveyJSON5.escapee[this.ch] === 'string') {
	                        string += SurveyJSON5.escapee[this.ch];
	                    } else {
	                        break;
	                    }
	                } else if (this.ch === '\n') {
	                    // unescaped newlines are invalid; see:
	                    // https://github.com/aseemk/json5/issues/24
	                    // TODO this feels special-cased; are there other
	                    // invalid unescaped chars?
	                    break;
	                } else {
	                    string += this.ch;
	                }
	            }
	        }
	        this.error("Bad string");
	    };
	    SurveyJSON5.prototype.inlineComment = function () {
	        // Skip an inline comment, assuming this is one. The current character should
	        // be the second / character in the // pair that begins this inline comment.
	        // To finish the inline comment, we look for a newline or the end of the text.
	        if (this.ch !== '/') {
	            this.error("Not an inline comment");
	        }
	        do {
	            this.next();
	            if (this.ch === '\n' || this.ch === '\r') {
	                this.next();
	                return;
	            }
	        } while (this.ch);
	    };
	    SurveyJSON5.prototype.blockComment = function () {
	        // Skip a block comment, assuming this is one. The current character should be
	        // the * character in the /* pair that begins this block comment.
	        // To finish the block comment, we look for an ending */ pair of characters,
	        // but we also watch for the end of text before the comment is terminated.
	        if (this.ch !== '*') {
	            this.error("Not a block comment");
	        }
	        do {
	            this.next();
	            while (this.ch === '*') {
	                this.next('*');
	                if (this.ch === '/') {
	                    this.next('/');
	                    return;
	                }
	            }
	        } while (this.ch);
	        this.error("Unterminated block comment");
	    };
	    SurveyJSON5.prototype.comment = function () {
	        // Skip a comment, whether inline or block-level, assuming this is one.
	        // Comments always begin with a / character.
	        if (this.ch !== '/') {
	            this.error("Not a comment");
	        }
	        this.next('/');
	        if (this.ch === '/') {
	            this.inlineComment();
	        } else if (this.ch === '*') {
	            this.blockComment();
	        } else {
	            this.error("Unrecognized comment");
	        }
	    };
	    SurveyJSON5.prototype.white = function () {
	        // Skip whitespace and comments.
	        // Note that we're detecting comments by only a single / character.
	        // This works since regular expressions are not valid JSON(5), but this will
	        // break if there are other valid values that begin with a / character!
	        while (this.ch) {
	            if (this.ch === '/') {
	                this.comment();
	            } else if (SurveyJSON5.ws.indexOf(this.ch) >= 0) {
	                this.next();
	            } else {
	                return;
	            }
	        }
	    };
	    SurveyJSON5.prototype.word = function () {
	        // true, false, or null.
	        switch (this.ch) {
	            case 't':
	                this.next('t');
	                this.next('r');
	                this.next('u');
	                this.next('e');
	                return true;
	            case 'f':
	                this.next('f');
	                this.next('a');
	                this.next('l');
	                this.next('s');
	                this.next('e');
	                return false;
	            case 'n':
	                this.next('n');
	                this.next('u');
	                this.next('l');
	                this.next('l');
	                return null;
	            case 'I':
	                this.next('I');
	                this.next('n');
	                this.next('f');
	                this.next('i');
	                this.next('n');
	                this.next('i');
	                this.next('t');
	                this.next('y');
	                return Infinity;
	            case 'N':
	                this.next('N');
	                this.next('a');
	                this.next('N');
	                return NaN;
	        }
	        this.error("Unexpected '" + this.ch + "'");
	    };
	    SurveyJSON5.prototype.array = function () {
	        // Parse an array value.
	        var array = [];
	        if (this.ch === '[') {
	            this.next('[');
	            this.white();
	            while (this.ch) {
	                if (this.ch === ']') {
	                    this.next(']');
	                    return array; // Potentially empty array
	                }
	                // ES5 allows omitting elements in arrays, e.g. [,] and
	                // [,null]. We don't allow this in JSON5.
	                if (this.ch === ',') {
	                    this.error("Missing array element");
	                } else {
	                    array.push(this.value());
	                }
	                this.white();
	                // If there's no comma after this value, this needs to
	                // be the end of the array.
	                if (this.ch !== ',') {
	                    this.next(']');
	                    return array;
	                }
	                this.next(',');
	                this.white();
	            }
	        }
	        this.error("Bad array");
	    };
	    SurveyJSON5.prototype.object = function () {
	        // Parse an object value.
	        var key,
	            start,
	            isFirstProperty = true,
	            object = {};
	        if (this.parseType > 0) {
	            object[SurveyJSON5.positionName] = { start: this.at - 1 };
	        }
	        if (this.ch === '{') {
	            this.next('{');
	            this.white();
	            start = this.at - 1;
	            while (this.ch) {
	                if (this.ch === '}') {
	                    if (this.parseType > 0) {
	                        object[SurveyJSON5.positionName].end = start;
	                    }
	                    this.next('}');
	                    return object; // Potentially empty object
	                }
	                // Keys can be unquoted. If they are, they need to be
	                // valid JS identifiers.
	                if (this.ch === '"' || this.ch === "'") {
	                    key = this.string();
	                } else {
	                    key = this.identifier();
	                }
	                this.white();
	                if (this.parseType > 1) {
	                    object[SurveyJSON5.positionName][key] = { start: start, valueStart: this.at };
	                }
	                this.next(':');
	                object[key] = this.value();
	                if (this.parseType > 1) {
	                    start = this.at - 1;
	                    object[SurveyJSON5.positionName][key].valueEnd = start;
	                    object[SurveyJSON5.positionName][key].end = start;
	                }
	                this.white();
	                // If there's no comma after this pair, this needs to be
	                // the end of the object.
	                if (this.ch !== ',') {
	                    if (this.parseType > 1) {
	                        object[SurveyJSON5.positionName][key].valueEnd--;
	                        object[SurveyJSON5.positionName][key].end--;
	                    }
	                    if (this.parseType > 0) {
	                        object[SurveyJSON5.positionName].end = this.at - 1;
	                    }
	                    this.next('}');
	                    return object;
	                }
	                if (this.parseType > 1) {
	                    object[SurveyJSON5.positionName][key].valueEnd--;
	                    if (!isFirstProperty) {
	                        object[SurveyJSON5.positionName][key].end--;
	                    }
	                }
	                this.next(',');
	                this.white();
	                isFirstProperty = false;
	            }
	        }
	        this.error("Bad object");
	    };
	    SurveyJSON5.prototype.value = function () {
	        // Parse a JSON value. It could be an object, an array, a string, a number,
	        // or a word.
	        this.white();
	        switch (this.ch) {
	            case '{':
	                return this.object();
	            case '[':
	                return this.array();
	            case '"':
	            case "'":
	                return this.string();
	            case '-':
	            case '+':
	            case '.':
	                return this.number();
	            default:
	                return this.ch >= '0' && this.ch <= '9' ? this.number() : this.word();
	        }
	    };
	    SurveyJSON5.prototype.stringify = function (obj, replacer, space) {
	        if (replacer === void 0) {
	            replacer = null;
	        }
	        if (space === void 0) {
	            space = null;
	        }
	        if (replacer && typeof replacer !== "function" && !this.isArray(replacer)) {
	            throw new Error('Replacer must be a function or an array');
	        }
	        this.replacer = replacer;
	        this.indentStr = this.getIndent(space);
	        this.objStack = [];
	        // special case...when undefined is used inside of
	        // a compound object/array, return null.
	        // but when top-level, return undefined
	        var topLevelHolder = { "": obj };
	        if (obj === undefined) {
	            return this.getReplacedValueOrUndefined(topLevelHolder, '', true);
	        }
	        return this.internalStringify(topLevelHolder, '', true);
	    };
	    SurveyJSON5.prototype.getIndent = function (space) {
	        if (space) {
	            if (typeof space === "string") {
	                return space;
	            } else if (typeof space === "number" && space >= 0) {
	                return this.makeIndent(" ", space, true);
	            }
	        }
	        return "";
	    };
	    SurveyJSON5.prototype.getReplacedValueOrUndefined = function (holder, key, isTopLevel) {
	        var value = holder[key];
	        // Replace the value with its toJSON value first, if possible
	        if (value && value.toJSON && typeof value.toJSON === "function") {
	            value = value.toJSON();
	        }
	        // If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
	        // presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
	        if (typeof this.replacer === "function") {
	            return this.replacer.call(holder, key, value);
	        } else if (this.replacer) {
	            if (isTopLevel || this.isArray(holder) || this.replacer.indexOf(key) >= 0) {
	                return value;
	            } else {
	                return undefined;
	            }
	        } else {
	            return value;
	        }
	    };
	    SurveyJSON5.prototype.isWordChar = function (char) {
	        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char >= '0' && char <= '9' || char === '_' || char === '$';
	    };
	    SurveyJSON5.prototype.isWordStart = function (char) {
	        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_' || char === '$';
	    };
	    SurveyJSON5.prototype.isWord = function (key) {
	        if (typeof key !== 'string') {
	            return false;
	        }
	        if (!this.isWordStart(key[0])) {
	            return false;
	        }
	        var i = 1,
	            length = key.length;
	        while (i < length) {
	            if (!this.isWordChar(key[i])) {
	                return false;
	            }
	            i++;
	        }
	        return true;
	    };
	    // polyfills
	    SurveyJSON5.prototype.isArray = function (obj) {
	        if (Array.isArray) {
	            return Array.isArray(obj);
	        } else {
	            return Object.prototype.toString.call(obj) === '[object Array]';
	        }
	    };
	    SurveyJSON5.prototype.isDate = function (obj) {
	        return Object.prototype.toString.call(obj) === '[object Date]';
	    };
	    SurveyJSON5.prototype.isNaN = function (val) {
	        return typeof val === 'number' && val !== val;
	    };
	    SurveyJSON5.prototype.checkForCircular = function (obj) {
	        for (var i = 0; i < this.objStack.length; i++) {
	            if (this.objStack[i] === obj) {
	                throw new TypeError("Converting circular structure to JSON");
	            }
	        }
	    };
	    SurveyJSON5.prototype.makeIndent = function (str, num, noNewLine) {
	        if (noNewLine === void 0) {
	            noNewLine = false;
	        }
	        if (!str) {
	            return "";
	        }
	        // indentation no more than 10 chars
	        if (str.length > 10) {
	            str = str.substring(0, 10);
	        }
	        var indent = noNewLine ? "" : "\n";
	        for (var i = 0; i < num; i++) {
	            indent += str;
	        }
	        return indent;
	    };
	    SurveyJSON5.prototype.escapeString = function (str) {
	        // If the string contains no control characters, no quote characters, and no
	        // backslash characters, then we can safely slap some quotes around it.
	        // Otherwise we must also replace the offending characters with safe escape
	        // sequences.
	        SurveyJSON5.escapable.lastIndex = 0;
	        return SurveyJSON5.escapable.test(str) ? '"' + str.replace(SurveyJSON5.escapable, function (a) {
	            var c = SurveyJSON5.meta[a];
	            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + str + '"';
	    };
	    // End
	    SurveyJSON5.prototype.internalStringify = function (holder, key, isTopLevel) {
	        var buffer, res;
	        // Replace the value, if necessary
	        var obj_part = this.getReplacedValueOrUndefined(holder, key, isTopLevel);
	        if (obj_part && !this.isDate(obj_part)) {
	            // unbox objects
	            // don't unbox dates, since will turn it into number
	            obj_part = obj_part.valueOf();
	        }
	        switch (typeof obj_part === 'undefined' ? 'undefined' : _typeof(obj_part)) {
	            case "boolean":
	                return obj_part.toString();
	            case "number":
	                if (isNaN(obj_part) || !isFinite(obj_part)) {
	                    return "null";
	                }
	                return obj_part.toString();
	            case "string":
	                return this.escapeString(obj_part.toString());
	            case "object":
	                if (obj_part === null) {
	                    return "null";
	                } else if (this.isArray(obj_part)) {
	                    this.checkForCircular(obj_part);
	                    buffer = "[";
	                    this.objStack.push(obj_part);
	                    for (var i = 0; i < obj_part.length; i++) {
	                        res = this.internalStringify(obj_part, i, false);
	                        buffer += this.makeIndent(this.indentStr, this.objStack.length);
	                        if (res === null || typeof res === "undefined") {
	                            buffer += "null";
	                        } else {
	                            buffer += res;
	                        }
	                        if (i < obj_part.length - 1) {
	                            buffer += ",";
	                        } else if (this.indentStr) {
	                            buffer += "\n";
	                        }
	                    }
	                    this.objStack.pop();
	                    buffer += this.makeIndent(this.indentStr, this.objStack.length, true) + "]";
	                } else {
	                    this.checkForCircular(obj_part);
	                    buffer = "{";
	                    var nonEmpty = false;
	                    this.objStack.push(obj_part);
	                    for (var prop in obj_part) {
	                        if (obj_part.hasOwnProperty(prop)) {
	                            var value = this.internalStringify(obj_part, prop, false);
	                            isTopLevel = false;
	                            if (typeof value !== "undefined" && value !== null) {
	                                buffer += this.makeIndent(this.indentStr, this.objStack.length);
	                                nonEmpty = true;
	                                var propKey = this.isWord(prop) ? prop : this.escapeString(prop);
	                                buffer += propKey + ":" + (this.indentStr ? ' ' : '') + value + ",";
	                            }
	                        }
	                    }
	                    this.objStack.pop();
	                    if (nonEmpty) {
	                        buffer = buffer.substring(0, buffer.length - 1) + this.makeIndent(this.indentStr, this.objStack.length) + "}";
	                    } else {
	                        buffer = '{}';
	                    }
	                }
	                return buffer;
	            default:
	                // functions and undefined should be ignored
	                return undefined;
	        }
	    };
	    SurveyJSON5.positionName = "pos";
	    SurveyJSON5.escapee = {
	        "'": "'",
	        '"': '"',
	        '\\': '\\',
	        '/': '/',
	        '\n': '',
	        b: '\b',
	        f: '\f',
	        n: '\n',
	        r: '\r',
	        t: '\t'
	    };
	    SurveyJSON5.ws = [' ', '\t', '\r', '\n', '\v', '\f', '\xA0', '\uFEFF'];
	    // Copied from Crokford's implementation of JSON
	    // See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
	    // Begin
	    SurveyJSON5.cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	    SurveyJSON5.escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	    SurveyJSON5.meta = {
	        '\b': '\\b',
	        '\t': '\\t',
	        '\n': '\\n',
	        '\f': '\\f',
	        '\r': '\\r',
	        '"': '\\"',
	        '\\': '\\\\'
	    };
	    return SurveyJSON5;
	}();

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyEmbedingWindow = undefined;
	
	var _json = __webpack_require__(18);
	
	var SurveyEmbedingWindow = exports.SurveyEmbedingWindow = function () {
	    function SurveyEmbedingWindow() {
	        this.surveyId = null;
	        this.surveyPostId = null;
	        this.generateValidJSON = false;
	        var self = this;
	        this.koLibraryVersion = ko.observable("knockout");
	        this.koShowAsWindow = ko.observable("page");
	        this.koScriptUsing = ko.observable("bootstrap");
	        this.koHasIds = ko.observable(false);
	        this.koLoadSurvey = ko.observable(false);
	        this.koHeadText = ko.observable("");
	        this.koJavaText = ko.observable("");
	        this.koBodyText = ko.observable("");
	        this.koVisibleHtml = ko.computed(function () {
	            return self.koLibraryVersion() == "react" || self.koShowAsWindow() == "page";
	        });
	        this.koLibraryVersion.subscribe(function (newValue) {
	            self.setHeadText();self.setJavaTest();
	        });
	        this.koShowAsWindow.subscribe(function (newValue) {
	            self.setJavaTest();
	        });
	        this.koScriptUsing.subscribe(function (newValue) {
	            self.setHeadText();self.setJavaTest();
	        });
	        this.koLoadSurvey.subscribe(function (newValue) {
	            self.setJavaTest();
	        });
	        this.surveyEmbedingHead = null;
	    }
	    Object.defineProperty(SurveyEmbedingWindow.prototype, "json", {
	        get: function get() {
	            return this.jsonValue;
	        },
	        set: function set(value) {
	            this.jsonValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyEmbedingWindow.prototype, "hasAceEditor", {
	        get: function get() {
	            return typeof ace !== "undefined";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyEmbedingWindow.prototype.show = function () {
	        var bodyEditor = null;
	        if (this.hasAceEditor && this.surveyEmbedingHead == null) {
	            this.surveyEmbedingHead = this.createEditor("surveyEmbedingHead");
	            bodyEditor = this.createEditor("surveyEmbedingBody");
	            this.surveyEmbedingJava = this.createEditor("surveyEmbedingJava");
	        }
	        this.koHasIds(this.surveyId && this.surveyPostId);
	        this.setTextToEditor(bodyEditor, this.koBodyText, "<div id= \"mySurveyJSName\" ></div>");
	        this.setHeadText();
	        this.setJavaTest();
	    };
	    SurveyEmbedingWindow.prototype.setHeadText = function () {
	        var str = "";
	        if (this.koLibraryVersion() == "knockout") {
	            str = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js\"></script>\n<script src=\"js/survey.ko.min.js\"></script>";
	        } else {
	            str = "<script src=\"https://fb.me/react-0.14.8.js\"></script>\n<script src= \"https://fb.me/react-dom-0.14.8.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js\"></script>\n";
	            str += "<script src=\"js/survey.react.min.js\"></script>";
	        }
	        if (this.koScriptUsing() != "bootstrap") {
	            str += "\n<link href=\"css/survey.css\" type=\"text/css\" rel=\"stylesheet\" />";
	        }
	        this.setTextToEditor(this.surveyEmbedingHead, this.koHeadText, str);
	    };
	    SurveyEmbedingWindow.prototype.setJavaTest = function () {
	        this.setTextToEditor(this.surveyEmbedingJava, this.koJavaText, this.getJavaText());
	    };
	    SurveyEmbedingWindow.prototype.createEditor = function (elementName) {
	        var editor = ace.edit(elementName);
	        editor.setTheme("ace/theme/monokai");
	        editor.session.setMode("ace/mode/json");
	        editor.setShowPrintMargin(false);
	        editor.renderer.setShowGutter(false);
	        editor.setReadOnly(true);
	        return editor;
	    };
	    SurveyEmbedingWindow.prototype.getJavaText = function () {
	        var isOnPage = this.koShowAsWindow() == "page";
	        var str = this.koLibraryVersion() == "knockout" ? this.getKnockoutJavaText(isOnPage) : this.getReactJavaText(isOnPage);
	        return this.getSetCss() + str;
	    };
	    SurveyEmbedingWindow.prototype.getSetCss = function () {
	        if (this.koScriptUsing() != "bootstrap") return "";
	        return "Survey.Survey.cssType = \"bootstrap\";\n";
	    };
	    SurveyEmbedingWindow.prototype.getKnockoutJavaText = function (isOnPage) {
	        var text = isOnPage ? "var survey = new Survey.Survey(\n" : "var surveyWindow = new Survey.SurveyWindow(\n";
	        text += this.getJsonText();
	        text += ");\n";
	        if (!isOnPage) {
	            text += "surveyWindow.";
	        }
	        var saveFunc = this.getSaveFuncCode();
	        text += "survey.onComplete.add(function (s) {\n" + saveFunc + "\n });\n";
	        if (isOnPage) {
	            text += "survey.render(\"mySurveyJSName\");";
	        } else {
	            text += "//By default Survey.title is used.\n";
	            text += "//surveyWindow.title = \"My Survey Window Title.\";\n";
	            text += "surveyWindow.show();";
	        }
	        return text;
	    };
	    SurveyEmbedingWindow.prototype.getReactJavaText = function (isOnPage) {
	        var saveFunc = this.getSaveFuncCode();
	        var sendResultText = "var surveySendResult = function (s) {\n" + saveFunc + "\n });\n";
	        var name = isOnPage ? "ReactSurvey" : "ReactSurveyWindow";
	        var jsonText = "var surveyJson = " + this.getJsonText() + "\n\n";
	        var text = jsonText + sendResultText + "ReactDOM.render(\n<" + name + " json={surveyJson} onComplete={surveySendResult} />, \n document.getElementById(\"mySurveyJSName\"));";
	        return text;
	    };
	    SurveyEmbedingWindow.prototype.getSaveFuncCode = function () {
	        if (this.koHasIds()) return "survey.sendResult('" + this.surveyPostId + "');";
	        return "alert(\"The results are:\" + JSON.stringify(s.data));";
	    };
	    SurveyEmbedingWindow.prototype.getJsonText = function () {
	        if (this.koHasIds() && this.koLoadSurvey()) {
	            return "{ surveyId: '" + this.surveyId + "'}";
	        }
	        if (this.generateValidJSON) return JSON.stringify(this.json);
	        return new _json.SurveyJSON5().stringify(this.json);
	    };
	    SurveyEmbedingWindow.prototype.setTextToEditor = function (editor, koText, text) {
	        if (editor) editor.setValue(text);
	        if (koText) koText(text);
	    };
	    return SurveyEmbedingWindow;
	}();

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyVerbChangePageItem = exports.SurveyVerbChangeTypeItem = exports.SurveyVerbItem = exports.SurveyVerbs = undefined;
	
	var _editorLocalization = __webpack_require__(7);
	
	var _surveyHelper = __webpack_require__(8);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var __extends = undefined && undefined.__extends || function (d, b) {
	    for (var p in b) {
	        if (b.hasOwnProperty(p)) d[p] = b[p];
	    }function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var SurveyVerbs = exports.SurveyVerbs = function () {
	    function SurveyVerbs(onModifiedCallback) {
	        this.onModifiedCallback = onModifiedCallback;
	        this.koVerbs = ko.observableArray();
	        this.koHasVerbs = ko.observable();
	        var classes = Survey.JsonObject.metaData.getChildrenClasses("selectbase", true);
	        this.choicesClasses = [];
	        for (var i = 0; i < classes.length; i++) {
	            this.choicesClasses.push(classes[i].name);
	        }
	    }
	    Object.defineProperty(SurveyVerbs.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        set: function set(value) {
	            if (this.survey == value) return;
	            this.surveyValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyVerbs.prototype, "obj", {
	        get: function get() {
	            return this.objValue;
	        },
	        set: function set(value) {
	            if (this.objValue == value) return;
	            this.objValue = value;
	            this.buildVerbs();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyVerbs.prototype.buildVerbs = function () {
	        var array = [];
	        var objType = _surveyHelper.SurveyHelper.getObjectType(this.obj);
	        if (objType == _surveyHelper.ObjType.Question) {
	            var question = this.obj;
	            if (this.survey.pages.length > 1) {
	                array.push(new SurveyVerbChangePageItem(this.survey, question, this.onModifiedCallback));
	            }
	            if (this.choicesClasses.indexOf(question.getType()) > -1) {
	                array.push(new SurveyVerbChangeTypeItem(this.survey, question, this.onModifiedCallback));
	            }
	        }
	        this.koVerbs(array);
	        this.koHasVerbs(array.length > 0);
	    };
	    return SurveyVerbs;
	}();
	var SurveyVerbItem = exports.SurveyVerbItem = function () {
	    function SurveyVerbItem(survey, question, onModifiedCallback) {
	        this.survey = survey;
	        this.question = question;
	        this.onModifiedCallback = onModifiedCallback;
	        this.koItems = ko.observableArray();
	        this.koSelectedItem = ko.observable();
	    }
	    Object.defineProperty(SurveyVerbItem.prototype, "text", {
	        get: function get() {
	            return "";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return SurveyVerbItem;
	}();
	var SurveyVerbChangeTypeItem = exports.SurveyVerbChangeTypeItem = function (_super) {
	    __extends(SurveyVerbChangeTypeItem, _super);
	    function SurveyVerbChangeTypeItem(survey, question, onModifiedCallback) {
	        _super.call(this, survey, question, onModifiedCallback);
	        this.survey = survey;
	        this.question = question;
	        this.onModifiedCallback = onModifiedCallback;
	        var classes = Survey.JsonObject.metaData.getChildrenClasses("selectbase", true);
	        var array = [];
	        for (var i = 0; i < classes.length; i++) {
	            array.push({ value: classes[i].name, text: _editorLocalization.editorLocalization.getString("qt." + classes[i].name) });
	        }
	        this.koItems(array);
	        this.koSelectedItem(question.getType());
	        var self = this;
	        this.koSelectedItem.subscribe(function (newValue) {
	            self.changeType(newValue);
	        });
	    }
	    Object.defineProperty(SurveyVerbChangeTypeItem.prototype, "text", {
	        get: function get() {
	            return _editorLocalization.editorLocalization.getString("pe.verbChangeType");
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyVerbChangeTypeItem.prototype.changeType = function (questionType) {
	        if (questionType == this.question.getType()) return;
	        var page = this.survey.getPageByQuestion(this.question);
	        var index = page.questions.indexOf(this.question);
	        var newQuestion = Survey.QuestionFactory.Instance.createQuestion(questionType, this.question.name);
	        var jsonObj = new Survey.JsonObject();
	        var json = jsonObj.toJsonObject(this.question);
	        jsonObj.toObject(json, newQuestion);
	        page.removeQuestion(this.question);
	        page.addQuestion(newQuestion, index);
	        if (this.onModifiedCallback) this.onModifiedCallback();
	    };
	    return SurveyVerbChangeTypeItem;
	}(SurveyVerbItem);
	var SurveyVerbChangePageItem = exports.SurveyVerbChangePageItem = function (_super) {
	    __extends(SurveyVerbChangePageItem, _super);
	    function SurveyVerbChangePageItem(survey, question, onModifiedCallback) {
	        _super.call(this, survey, question, onModifiedCallback);
	        this.survey = survey;
	        this.question = question;
	        this.onModifiedCallback = onModifiedCallback;
	        var array = [];
	        for (var i = 0; i < this.survey.pages.length; i++) {
	            var page = this.survey.pages[i];
	            array.push({ value: page, text: _surveyHelper.SurveyHelper.getObjectName(page) });
	        }
	        this.koItems(array);
	        this.prevPage = this.survey.getPageByQuestion(question);
	        this.koSelectedItem(this.prevPage);
	        var self = this;
	        this.koSelectedItem.subscribe(function (newValue) {
	            self.changePage(newValue);
	        });
	    }
	    Object.defineProperty(SurveyVerbChangePageItem.prototype, "text", {
	        get: function get() {
	            return _editorLocalization.editorLocalization.getString("pe.verbChangePage");
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyVerbChangePageItem.prototype.changePage = function (newPage) {
	        if (newPage == null || newPage == this.prevPage) return;
	        this.prevPage.removeQuestion(this.question);
	        newPage.addQuestion(this.question);
	        if (this.onModifiedCallback) this.onModifiedCallback();
	    };
	    return SurveyVerbChangePageItem;
	}(SurveyVerbItem);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.UndoRedoItem = exports.SurveyUndoRedo = undefined;
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyUndoRedo = exports.SurveyUndoRedo = function () {
	    function SurveyUndoRedo() {
	        this.index = -1;
	        this.maximumCount = 10;
	        this.items = [];
	        this.koCanUndo = ko.observable(false);
	        this.koCanRedo = ko.observable(false);
	    }
	    SurveyUndoRedo.prototype.clear = function () {
	        this.items = [];
	        this.koCanUndo(false);
	        this.koCanRedo(false);
	    };
	    SurveyUndoRedo.prototype.setCurrent = function (survey, selectedObjName) {
	        var item = new UndoRedoItem();
	        item.surveyJSON = new Survey.JsonObject().toJsonObject(survey);
	        item.selectedObjName = selectedObjName;
	        if (this.index < this.items.length - 1) {
	            this.items.splice(this.index + 1);
	        }
	        this.items.push(item);
	        this.removeOldData();
	        this.index = this.items.length - 1;
	        this.updateCanUndoRedo();
	    };
	    SurveyUndoRedo.prototype.undo = function () {
	        if (!this.canUndo) return null;
	        return this.doUndoRedo(-1);
	    };
	    SurveyUndoRedo.prototype.redo = function () {
	        if (!this.canRedo) return null;
	        return this.doUndoRedo(1);
	    };
	    SurveyUndoRedo.prototype.updateCanUndoRedo = function () {
	        this.koCanUndo(this.canUndo);
	        this.koCanRedo(this.canRedo);
	    };
	    SurveyUndoRedo.prototype.doUndoRedo = function (dIndex) {
	        this.index += dIndex;
	        this.updateCanUndoRedo();
	        return this.index >= 0 && this.index < this.items.length ? this.items[this.index] : null;
	    };
	    Object.defineProperty(SurveyUndoRedo.prototype, "canUndo", {
	        get: function get() {
	            return this.index >= 1 && this.index < this.items.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyUndoRedo.prototype, "canRedo", {
	        get: function get() {
	            return this.items.length > 1 && this.index < this.items.length - 1;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyUndoRedo.prototype.removeOldData = function () {
	        if (this.items.length - 1 < this.maximumCount) return;
	        this.items.splice(0, this.items.length - this.maximumCount - 1);
	    };
	    return SurveyUndoRedo;
	}();
	var UndoRedoItem = exports.UndoRedoItem = function () {
	    function UndoRedoItem() {}
	    return UndoRedoItem;
	}();

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyEditor = undefined;
	
	var _editorLocalization = __webpack_require__(7);
	
	var _objectEditor = __webpack_require__(10);
	
	var _pagesEditor = __webpack_require__(16);
	
	var _surveyEmbedingWindow = __webpack_require__(19);
	
	var _surveyObjects = __webpack_require__(23);
	
	var _objectVerbs = __webpack_require__(20);
	
	var _surveyJSONEditor = __webpack_require__(24);
	
	var _textWorker = __webpack_require__(17);
	
	var _undoredo = __webpack_require__(21);
	
	var _surveyHelper = __webpack_require__(8);
	
	var _dragdrophelper = __webpack_require__(1);
	
	var _json = __webpack_require__(18);
	
	var _templateEditorKo = __webpack_require__(25);
	
	var _template_page = __webpack_require__(26);
	
	var _template_question = __webpack_require__(27);
	
	var _surveyKnockout = __webpack_require__(2);
	
	var Survey = _interopRequireWildcard(_surveyKnockout);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var SurveyEditor = exports.SurveyEditor = function () {
	    function SurveyEditor(renderedElement, options) {
	        if (renderedElement === void 0) {
	            renderedElement = null;
	        }
	        if (options === void 0) {
	            options = null;
	        }
	        this.stateValue = "";
	        this.dragDropHelper = null;
	        this.surveyId = null;
	        this.surveyPostId = null;
	        this.alwaySaveTextInPropertyEditors = false;
	        this.onCanShowProperty = new Survey.Event();
	        this.saveNo = 0;
	        this.koShowOptions = ko.observable();
	        this.koGenerateValidJSON = ko.observable();
	        this.setOptions(options);
	        this.koCopiedQuestions = ko.observableArray();
	        this.koCanDeleteObject = ko.observable(false);
	        var self = this;
	        this.koState = ko.observable();
	        this.koShowSaveButton = ko.observable(false);
	        this.koTestSurveyWidth = ko.observable("100%");
	        this.saveButtonClick = function () {
	            self.doSave();
	        };
	        this.koObjects = ko.observableArray();
	        this.koSelectedObject = ko.observable();
	        this.koSelectedObject.subscribe(function (newValue) {
	            self.selectedObjectChanged(newValue != null ? newValue.value : null);
	        });
	        this.koGenerateValidJSON.subscribe(function (newValue) {
	            if (!self.options) self.options = {};
	            self.options.generateValidJSON = newValue;
	            if (self.generateValidJSONChangedCallback) self.generateValidJSONChangedCallback(newValue);
	        });
	        this.surveyObjects = new _surveyObjects.SurveyObjects(this.koObjects, this.koSelectedObject);
	        this.undoRedo = new _undoredo.SurveyUndoRedo();
	        this.surveyVerbs = new _objectVerbs.SurveyVerbs(function () {
	            self.setModified();
	        });
	        this.selectedObjectEditor = new _objectEditor.SurveyObjectEditor(this.options);
	        this.selectedObjectEditor.onCanShowPropertyCallback = function (object, property) {
	            return self.onCanShowObjectProperty(object, property);
	        };
	        this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
	            self.onPropertyValueChanged(options.property, options.object, options.newValue);
	        });
	        this.pagesEditor = new _pagesEditor.SurveyPagesEditor(function () {
	            self.addPage();
	        }, function (page) {
	            self.surveyObjects.selectObject(page);
	        }, function (indexFrom, indexTo) {
	            self.movePage(indexFrom, indexTo);
	        }, function (page) {
	            self.deleteCurrentObject();
	        });
	        this.surveyEmbeding = new _surveyEmbedingWindow.SurveyEmbedingWindow();
	        this.koViewType = ko.observable("designer");
	        this.koIsShowDesigner = ko.computed(function () {
	            return self.koViewType() == "designer";
	        });
	        this.selectDesignerClick = function () {
	            self.showDesigner();
	        };
	        this.selectEditorClick = function () {
	            self.showJsonEditor();
	        };
	        this.selectTestClick = function () {
	            self.showTestSurvey();
	        };
	        this.selectEmbedClick = function () {
	            self.showEmbedEditor();
	        };
	        this.generateValidJSONClick = function () {
	            self.koGenerateValidJSON(true);
	        };
	        this.generateReadableJSONClick = function () {
	            self.koGenerateValidJSON(false);
	        };
	        this.runSurveyClick = function () {
	            self.showLiveSurvey();
	        };
	        this.embedingSurveyClick = function () {
	            self.showSurveyEmbeding();
	        };
	        this.deleteObjectClick = function () {
	            self.deleteCurrentObject();
	        };
	        this.draggingQuestion = function (questionType, e) {
	            self.doDraggingQuestion(questionType, e);
	        };
	        this.clickQuestion = function (questionType) {
	            self.doClickQuestion(questionType);
	        };
	        this.draggingCopiedQuestion = function (item, e) {
	            self.doDraggingCopiedQuestion(item.json, e);
	        };
	        this.clickCopiedQuestion = function (item) {
	            self.doClickCopiedQuestion(item.json);
	        };
	        this.dragEnd = function (item, e) {
	            self.dragDropHelper.end();
	        };
	        this.doUndoClick = function () {
	            self.doUndoRedo(self.undoRedo.undo());
	        };
	        this.doRedoClick = function () {
	            self.doUndoRedo(self.undoRedo.redo());
	        };
	        this.jsonEditor = new _surveyJSONEditor.SurveyJSONEditor();
	        if (renderedElement) {
	            this.render(renderedElement);
	        }
	    }
	    SurveyEditor.prototype.setOptions = function (options) {
	        this.options = options;
	        this.questionTypes = this.getQuestionTypes();
	        this.showJSONEditorTabValue = options && typeof options.showJSONEditorTab !== 'undefined' ? options.showJSONEditorTab : true;
	        this.showTestSurveyTabValue = options && typeof options.showTestSurveyTab !== 'undefined' ? options.showTestSurveyTab : true;
	        this.showEmbededSurveyTabValue = options && typeof options.showEmbededSurveyTab !== 'undefined' ? options.showEmbededSurveyTab : false;
	        this.koShowOptions(options && typeof options.showOptions !== 'undefined' ? options.showOptions : false);
	        this.koGenerateValidJSON(this.options && this.options.generateValidJSON);
	        if (this.selectedObjectEditor) this.selectedObjectEditor.setOptions(options);
	    };
	    Object.defineProperty(SurveyEditor.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyEditor.prototype.render = function (element, options) {
	        if (element === void 0) {
	            element = null;
	        }
	        if (options === void 0) {
	            options = null;
	        }
	        if (options) this.setOptions(options);
	        var self = this;
	        if (element && typeof element == "string") {
	            element = document.getElementById(element);
	        }
	        if (element) {
	            this.renderedElement = element;
	        }
	        element = this.renderedElement;
	        if (!element) return;
	        element.innerHTML = _templateEditorKo.html;
	        self.applyBinding();
	    };
	    SurveyEditor.prototype.loadSurvey = function (surveyId) {
	        var self = this;
	        new Survey.dxSurveyService().loadSurvey(surveyId, function (success, result, response) {
	            if (success && result) {
	                self.text = JSON.stringify(result);
	            }
	        });
	    };
	    Object.defineProperty(SurveyEditor.prototype, "text", {
	        get: function get() {
	            if (this.koIsShowDesigner()) return this.getSurveyTextFromDesigner();
	            return this.jsonEditor.text;
	        },
	        set: function set(value) {
	            var textWorker = new _textWorker.SurveyTextWorker(value);
	            if (textWorker.isJsonCorrect) {
	                this.initSurvey(new Survey.JsonObject().toJsonObject(textWorker.survey));
	                this.showDesigner();
	                this.setUndoRedoCurrentState(true);
	            } else {
	                this.setTextValue(value);
	                this.koViewType("editor");
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyEditor.prototype, "state", {
	        get: function get() {
	            return this.stateValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyEditor.prototype.setState = function (value) {
	        this.stateValue = value;
	        this.koState(this.state);
	    };
	    SurveyEditor.prototype.doSave = function () {
	        this.setState("saving");
	        if (this.saveSurveyFunc) {
	            this.saveNo++;
	            var self = this;
	            this.saveSurveyFunc(this.saveNo, function doSaveCallback(no, isSuccess) {
	                self.setState("saved");
	                if (self.saveNo == no) {
	                    if (isSuccess) self.setState("saved");
	                }
	            });
	        }
	    };
	    SurveyEditor.prototype.setModified = function () {
	        this.setState("modified");
	        this.setUndoRedoCurrentState();
	    };
	    SurveyEditor.prototype.setUndoRedoCurrentState = function (clearState) {
	        if (clearState === void 0) {
	            clearState = false;
	        }
	        if (clearState) {
	            this.undoRedo.clear();
	        }
	        var selObj = this.koSelectedObject() ? this.koSelectedObject().value : null;
	        this.undoRedo.setCurrent(this.surveyValue, selObj ? selObj.name : null);
	    };
	    Object.defineProperty(SurveyEditor.prototype, "saveSurveyFunc", {
	        get: function get() {
	            return this.saveSurveyFuncValue;
	        },
	        set: function set(value) {
	            this.saveSurveyFuncValue = value;
	            this.koShowSaveButton(value != null);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyEditor.prototype, "showOptions", {
	        get: function get() {
	            return this.koShowOptions();
	        },
	        set: function set(value) {
	            this.koShowOptions(value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyEditor.prototype, "showJSONEditorTab", {
	        get: function get() {
	            return this.showJSONEditorTabValue;
	        },
	        set: function set(value) {
	            this.showJSONEditorTabValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyEditor.prototype, "showTestSurveyTab", {
	        get: function get() {
	            return this.showTestSurveyTabValue;
	        },
	        set: function set(value) {
	            this.showTestSurveyTabValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyEditor.prototype, "showEmbededSurveyTab", {
	        get: function get() {
	            return this.showEmbededSurveyTabValue;
	        },
	        set: function set(value) {
	            this.showEmbededSurveyTabValue = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyEditor.prototype.onCanShowObjectProperty = function (object, property) {
	        var options = { obj: object, property: property, name: property.name, canShow: true };
	        this.onCanShowProperty.fire(this, options);
	        return options.canShow;
	    };
	    SurveyEditor.prototype.setTextValue = function (value) {
	        this.jsonEditor.text = value;
	    };
	    SurveyEditor.prototype.addPage = function () {
	        var name = _surveyHelper.SurveyHelper.getNewPageName(this.survey.pages);
	        var page = this.surveyValue.addNewPage(name);
	        this.addPageToUI(page);
	        this.setModified();
	    };
	    SurveyEditor.prototype.getLocString = function (str) {
	        return _editorLocalization.editorLocalization.getString(str);
	    };
	    SurveyEditor.prototype.getQuestionTypes = function () {
	        var allTypes = Survey.QuestionFactory.Instance.getAllTypes();
	        if (!this.options || !this.options.questionTypes || !this.options.questionTypes.length) return allTypes;
	        var result = [];
	        for (var i = 0; i < this.options.questionTypes.length; i++) {
	            var questionType = this.options.questionTypes[i];
	            if (allTypes.indexOf(questionType) > -1) {
	                result.push(questionType);
	            }
	        }
	        return result;
	    };
	    SurveyEditor.prototype.movePage = function (indexFrom, indexTo) {
	        var page = this.survey.pages[indexFrom];
	        this.survey.pages.splice(indexFrom, 1);
	        this.survey.pages.splice(indexTo, 0, page);
	        this.pagesEditor.survey = this.survey;
	        this.surveyObjects.selectObject(page);
	        this.setModified();
	    };
	    SurveyEditor.prototype.addPageToUI = function (page) {
	        this.pagesEditor.survey = this.surveyValue;
	        this.surveyObjects.addPage(page);
	    };
	    SurveyEditor.prototype.onQuestionAdded = function (question) {
	        var page = this.survey.getPageByQuestion(question);
	        this.surveyObjects.addQuestion(page, question);
	        this.survey.render();
	    };
	    SurveyEditor.prototype.onQuestionRemoved = function (question) {
	        this.surveyObjects.removeObject(question);
	        this.survey.render();
	    };
	    SurveyEditor.prototype.onPropertyValueChanged = function (property, obj, newValue) {
	        var isDefault = property.isDefaultValue(newValue);
	        obj[property.name] = newValue;
	        if (property.name == "name") {
	            this.surveyObjects.nameChanged(obj);
	            if (_surveyHelper.SurveyHelper.getObjectType(obj) == _surveyHelper.ObjType.Page) {
	                this.pagesEditor.changeName(obj);
	            }
	        }
	        this.setModified();
	        this.survey.render();
	    };
	    SurveyEditor.prototype.doUndoRedo = function (item) {
	        this.initSurvey(item.surveyJSON);
	        if (item.selectedObjName) {
	            var selObj = this.findObjByName(item.selectedObjName);
	            if (selObj) {
	                this.surveyObjects.selectObject(selObj);
	            }
	        }
	        this.setState(this.undoRedo.koCanUndo() ? "modified" : "saved");
	    };
	    SurveyEditor.prototype.findObjByName = function (name) {
	        var page = this.survey.getPageByName(name);
	        if (page) return page;
	        var question = this.survey.getQuestionByName(name);
	        if (question) return question;
	        return null;
	    };
	    SurveyEditor.prototype.canSwitchViewType = function (newType) {
	        if (newType && this.koViewType() == newType) return false;
	        if (this.koViewType() != "editor") return true;
	        if (!this.jsonEditor.isJsonCorrect) {
	            alert(this.getLocString("ed.correctJSON"));
	            return false;
	        }
	        this.initSurvey(new Survey.JsonObject().toJsonObject(this.jsonEditor.survey));
	        return true;
	    };
	    SurveyEditor.prototype.showDesigner = function () {
	        if (!this.canSwitchViewType("designer")) return;
	        this.koViewType("designer");
	    };
	    SurveyEditor.prototype.showJsonEditor = function () {
	        if (this.koViewType() == "editor") return;
	        this.jsonEditor.show(this.getSurveyTextFromDesigner());
	        this.koViewType("editor");
	    };
	    SurveyEditor.prototype.showTestSurvey = function () {
	        if (!this.canSwitchViewType(null)) return;
	        this.showLiveSurvey();
	        this.koViewType("test");
	    };
	    SurveyEditor.prototype.showEmbedEditor = function () {
	        if (!this.canSwitchViewType("embed")) return;
	        this.showSurveyEmbeding();
	        this.koViewType("embed");
	    };
	    SurveyEditor.prototype.getSurveyTextFromDesigner = function () {
	        var json = new Survey.JsonObject().toJsonObject(this.survey);
	        if (this.options && this.options.generateValidJSON) return JSON.stringify(json, null, 1);
	        return new _json.SurveyJSON5().stringify(json, null, 1);
	    };
	    SurveyEditor.prototype.selectedObjectChanged = function (obj) {
	        var canDeleteObject = false;
	        this.selectedObjectEditor.selectedObject = obj;
	        this.surveyVerbs.obj = obj;
	        var objType = _surveyHelper.SurveyHelper.getObjectType(obj);
	        if (objType == _surveyHelper.ObjType.Page) {
	            this.survey.currentPage = obj;
	            canDeleteObject = this.survey.pages.length > 1;
	        }
	        if (objType == _surveyHelper.ObjType.Question) {
	            this.survey["setselectedQuestion"](obj);
	            canDeleteObject = true;
	            this.survey.currentPage = this.survey.getPageByQuestion(this.survey["selectedQuestionValue"]);
	        } else {
	            this.survey["setselectedQuestion"](null);
	        }
	        this.koCanDeleteObject(canDeleteObject);
	    };
	    SurveyEditor.prototype.applyBinding = function () {
	        if (this.renderedElement == null) return;
	        ko.cleanNode(this.renderedElement);
	        ko.applyBindings(this, this.renderedElement);
	        this.surveyjs = document.getElementById("surveyjs");
	        if (this.surveyjs) {
	            var self = this;
	            this.surveyjs.onkeydown = function (e) {
	                if (!e) return;
	                if (e.keyCode == 46) self.deleteQuestion();
	                if (e.keyCode == 38 || e.keyCode == 40) {
	                    self.selectQuestion(e.keyCode == 38);
	                }
	            };
	        }
	        this.surveyjsExample = document.getElementById("surveyjsExample");
	        this.initSurvey(new _json.SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText));
	        this.setUndoRedoCurrentState(true);
	        this.surveyValue.mode = "designer";
	        this.surveyValue.render(this.surveyjs);
	        this.jsonEditor.init();
	    };
	    SurveyEditor.prototype.initSurvey = function (json) {
	        var self = this;
	        this.surveyValue = new Survey.Survey();
	        this.dragDropHelper = new _dragdrophelper.DragDropHelper(this.survey, function () {
	            self.setModified();
	        });
	        this.surveyValue["dragDropHelper"] = this.dragDropHelper;
	        this.surveyValue["setJsonObject"](json); //TODO
	        if (this.surveyValue.isEmpty) {
	            this.surveyValue = new Survey.Survey(new _json.SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText));
	        }
	        this.survey.mode = "designer";
	        this.survey.render(this.surveyjs);
	        this.surveyObjects.survey = this.survey;
	        this.pagesEditor.survey = this.survey;
	        this.pagesEditor.setSelectedPage(this.survey.currentPage);
	        this.surveyVerbs.survey = this.survey;
	        this.surveyValue["onSelectedQuestionChanged"].add(function (sender, options) {
	            self.surveyObjects.selectObject(sender["selectedQuestionValue"]);
	        });
	        this.surveyValue["onCopyQuestion"].add(function (sender, options) {
	            self.copyQuestion(self.koSelectedObject().value);
	        });
	        this.surveyValue["onFastCopyQuestion"].add(function (sender, options) {
	            self.fastCopyQuestion(self.koSelectedObject().value);
	        });
	        this.surveyValue.onProcessHtml.add(function (sender, options) {
	            options.html = self.processHtml(options.html);
	        });
	        this.surveyValue.onCurrentPageChanged.add(function (sender, options) {
	            self.pagesEditor.setSelectedPage(sender.currentPage);
	        });
	        this.surveyValue.onQuestionAdded.add(function (sender, options) {
	            self.onQuestionAdded(options.question);
	        });
	        this.surveyValue.onQuestionRemoved.add(function (sender, options) {
	            self.onQuestionRemoved(options.question);
	        });
	    };
	    SurveyEditor.prototype.processHtml = function (html) {
	        if (!html) return html;
	        var scriptRegEx = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	        while (scriptRegEx.test(html)) {
	            html = html.replace(scriptRegEx, "");
	        }
	        return html;
	    };
	    SurveyEditor.prototype.doDraggingQuestion = function (questionType, e) {
	        this.dragDropHelper.startDragNewQuestion(e, questionType, this.getNewQuestionName());
	    };
	    SurveyEditor.prototype.doDraggingCopiedQuestion = function (json, e) {
	        this.dragDropHelper.startDragCopiedQuestion(e, this.getNewQuestionName(), json);
	    };
	    SurveyEditor.prototype.doClickQuestion = function (questionType) {
	        this.doClickQuestionCore(Survey.QuestionFactory.Instance.createQuestion(questionType, this.getNewQuestionName()));
	    };
	    SurveyEditor.prototype.doClickCopiedQuestion = function (json) {
	        var name = this.getNewQuestionName();
	        var question = Survey.QuestionFactory.Instance.createQuestion(json["type"], name);
	        new Survey.JsonObject().toObject(json, question);
	        question.name = name;
	        this.doClickQuestionCore(question);
	    };
	    SurveyEditor.prototype.getNewQuestionName = function () {
	        return _surveyHelper.SurveyHelper.getNewQuestionName(this.survey.getAllQuestions());
	    };
	    SurveyEditor.prototype.doClickQuestionCore = function (question) {
	        var page = this.survey.currentPage;
	        var index = -1;
	        if (this.survey["selectedQuestionValue"] != null) {
	            index = page.questions.indexOf(this.survey["selectedQuestionValue"]) + 1;
	        }
	        page.addQuestion(question, index);
	        this.setModified();
	    };
	    SurveyEditor.prototype.deleteQuestion = function () {
	        var question = this.getSelectedObjAsQuestion();
	        if (question) {
	            this.deleteCurrentObject();
	        }
	    };
	    SurveyEditor.prototype.selectQuestion = function (isUp) {
	        var question = this.getSelectedObjAsQuestion();
	        if (question) {
	            this.surveyObjects.selectNextQuestion(isUp);
	        }
	    };
	    SurveyEditor.prototype.getSelectedObjAsQuestion = function () {
	        var obj = this.koSelectedObject().value;
	        if (!obj) return null;
	        return _surveyHelper.SurveyHelper.getObjectType(obj) == _surveyHelper.ObjType.Question ? obj : null;
	    };
	    SurveyEditor.prototype.deleteCurrentObject = function () {
	        this.deleteObject(this.koSelectedObject().value);
	    };
	    SurveyEditor.prototype.copyQuestion = function (question) {
	        var objType = _surveyHelper.SurveyHelper.getObjectType(question);
	        if (objType != _surveyHelper.ObjType.Question) return;
	        var json = new Survey.JsonObject().toJsonObject(question);
	        json.type = question.getType();
	        var item = this.getCopiedQuestionByName(question.name);
	        if (item) {
	            item.json = json;
	        } else {
	            this.koCopiedQuestions.push({ name: question.name, json: json });
	        }
	        if (this.koCopiedQuestions().length > 3) {
	            this.koCopiedQuestions.splice(0, 1);
	        }
	    };
	    SurveyEditor.prototype.fastCopyQuestion = function (question) {
	        var json = new Survey.JsonObject().toJsonObject(question);
	        json.type = question.getType();
	        this.doClickCopiedQuestion(json);
	    };
	    SurveyEditor.prototype.getCopiedQuestionByName = function (name) {
	        var items = this.koCopiedQuestions();
	        for (var i = 0; i < items.length; i++) {
	            if (items[i].name == name) return items[i];
	        }
	        return null;
	    };
	    SurveyEditor.prototype.deleteObject = function (obj) {
	        this.surveyObjects.removeObject(obj);
	        var objType = _surveyHelper.SurveyHelper.getObjectType(obj);
	        if (objType == _surveyHelper.ObjType.Page) {
	            this.survey.removePage(obj);
	            this.pagesEditor.removePage(obj);
	            this.setModified();
	        }
	        if (objType == _surveyHelper.ObjType.Question) {
	            this.survey.currentPage.removeQuestion(obj);
	            this.survey["setselectedQuestion"](null);
	            this.surveyObjects.selectObject(this.survey.currentPage);
	            this.setModified();
	        }
	        this.survey.render();
	    };
	    SurveyEditor.prototype.showLiveSurvey = function () {
	        var _this = this;
	        if (!this.surveyjsExample) return;
	        var json = this.getSurveyJSON();
	        if (json != null) {
	            if (json.cookieName) {
	                delete json.cookieName;
	            }
	            var survey = new Survey.Survey(json);
	            var self = this;
	            var surveyjsExampleResults = document.getElementById("surveyjsExampleResults");
	            var surveyjsExamplereRun = document.getElementById("surveyjsExamplereRun");
	            if (surveyjsExampleResults) surveyjsExampleResults.innerHTML = "";
	            if (surveyjsExamplereRun) surveyjsExamplereRun.style.display = "none";
	            survey.onComplete.add(function (sender) {
	                if (surveyjsExampleResults) surveyjsExampleResults.innerHTML = _this.getLocString("ed.surveyResults") + JSON.stringify(survey.data);if (surveyjsExamplereRun) surveyjsExamplereRun.style.display = "";
	            });
	            survey.render(this.surveyjsExample);
	        } else {
	            this.surveyjsExample.innerHTML = this.getLocString("ed.correctJSON");
	        }
	    };
	    SurveyEditor.prototype.showSurveyEmbeding = function () {
	        var json = this.getSurveyJSON();
	        this.surveyEmbeding.json = json;
	        this.surveyEmbeding.surveyId = this.surveyId;
	        this.surveyEmbeding.surveyPostId = this.surveyPostId;
	        this.surveyEmbeding.generateValidJSON = this.options && this.options.generateValidJSON;
	        this.surveyEmbeding.show();
	    };
	    SurveyEditor.prototype.getSurveyJSON = function () {
	        if (this.koIsShowDesigner()) return new Survey.JsonObject().toJsonObject(this.survey);
	        if (this.jsonEditor.isJsonCorrect) return new Survey.JsonObject().toJsonObject(this.jsonEditor.survey);
	        return null;
	    };
	    SurveyEditor.prototype.createAnnotations = function (text, errors) {
	        var annotations = new Array();
	        for (var i = 0; i < errors.length; i++) {
	            var error = errors[i];
	            var annotation = { row: error.position.start.row, column: error.position.start.column, text: error.text, type: "error" };
	            annotations.push(annotation);
	        }
	        return annotations;
	    };
	    SurveyEditor.defaultNewSurveyText = "{ pages: [ { name: 'page1'}] }";
	    return SurveyEditor;
	}();
	Survey.Survey.cssType = "bootstrap";
	new Survey.SurveyTemplateText().replaceText(_template_page.html, "page");
	new Survey.SurveyTemplateText().replaceText(_template_question.html, "question");
	Survey.Survey.prototype["onCreating"] = function () {
	    this.selectedQuestionValue = null;
	    this.onSelectedQuestionChanged = new Survey.Event();
	    this.onCopyQuestion = new Survey.Event();
	    this.onFastCopyQuestion = new Survey.Event();
	    var self = this;
	    this.copyQuestionClick = function () {
	        self.onCopyQuestion.fire(self);
	    };
	    this.fastCopyQuestionClick = function (question) {
	        self.onFastCopyQuestion.fire(self /*, question*/);
	    };
	    this.koDraggingSource = ko.observable(null);
	};
	Survey.Survey.prototype["setselectedQuestion"] = function (value) {
	    if (value == this.selectedQuestionValue) return;
	    var oldValue = this.selectedQuestionValue;
	    this.selectedQuestionValue = value;
	    if (oldValue != null) {
	        oldValue["onSelectedQuestionChanged"]();
	    }
	    if (this.selectedQuestionValue != null) {
	        this.selectedQuestionValue["onSelectedQuestionChanged"]();
	    }
	    this.onSelectedQuestionChanged.fire(this, { 'oldSelectedQuestion': oldValue, 'newSelectedQuestion': value });
	};
	Survey.Survey.prototype["getEditorLocString"] = function (value) {
	    return _editorLocalization.editorLocalization.getString(value);
	};
	Survey.Page.prototype["onCreating"] = function () {
	    var self = this;
	    this.dragEnterCounter = 0;
	    this.koDragging = ko.observable(-1);
	    this.koDraggingQuestion = ko.observable(null);
	    this.koDraggingBottom = ko.observable(false);
	    this.koDragging.subscribe(function (newValue) {
	        if (newValue < 0) {
	            self.dragEnterCounter = 0;
	            self.koDraggingQuestion(null);
	            self.koDraggingBottom(false);
	        } else {
	            var question = newValue >= 0 && newValue < self.questions.length ? self.questions[newValue] : null;
	            self.koDraggingQuestion(question);
	            self.koDraggingBottom(newValue == self.questions.length);
	        }
	    });
	    this.koDraggingQuestion.subscribe(function (newValue) {
	        if (newValue) newValue.koIsDragging(true);
	    });
	    this.koDraggingQuestion.subscribe(function (oldValue) {
	        if (oldValue) oldValue.koIsDragging(false);
	    }, this, "beforeChange");
	    this.dragEnter = function (e) {
	        e.preventDefault();self.dragEnterCounter++;self.doDragEnter(e);
	    };
	    this.dragLeave = function (e) {
	        self.dragEnterCounter--;if (self.dragEnterCounter === 0) self.doDragLeave(e);
	    };
	    this.dragDrop = function (e) {
	        self.doDrop(e);
	    };
	};
	Survey.Page.prototype["doDrop"] = function (e) {
	    var dragDropHelper = this.data["dragDropHelper"];
	    if (dragDropHelper) {
	        dragDropHelper.doDrop(e);
	    }
	};
	Survey.Page.prototype["doDragEnter"] = function (e) {
	    if (this.questions.length > 0 || this.koDragging() > 0) return;
	    var dragDropHelper = this.data["dragDropHelper"];
	    if (dragDropHelper && dragDropHelper.isSurveyDragging(e)) {
	        this.koDragging(0);
	    }
	};
	Survey.Page.prototype["doDragLeave"] = function (e) {
	    var dragDropHelper = this.data["dragDropHelper"];
	    if (dragDropHelper) {
	        dragDropHelper.doLeavePage(e);
	    }
	};
	Survey.QuestionBase.prototype["onCreating"] = function () {
	    var self = this;
	    this.dragDropHelperValue = null;
	    this.koIsDragging = ko.observable(false);
	    this.koIsDraggingSource = ko.observable(false);
	    this.dragDropHelper = function () {
	        if (self.dragDropHelperValue == null) {
	            self.dragDropHelperValue = self.data["dragDropHelper"];
	        }
	        return self.dragDropHelperValue;
	    };
	    this.dragOver = function (e) {
	        self.dragDropHelper().doDragDropOver(e, self);
	    };
	    this.dragDrop = function (e) {
	        self.dragDropHelper().doDrop(e, self);
	    };
	    this.dragStart = function (e) {
	        self.dragDropHelper().startDragQuestion(e, self.name);
	    };
	    this.dragEnd = function (e) {
	        self.dragDropHelper().end();
	    };
	    this.koIsSelected = ko.observable(false);
	    this.koOnClick = function () {
	        if (self.data == null) return;
	        self.data["setselectedQuestion"](this);
	    };
	};
	Survey.QuestionBase.prototype["onSelectedQuestionChanged"] = function () {
	    if (this.data == null) return;
	    this.koIsSelected(this.data["selectedQuestionValue"] == this);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyObjects = exports.SurveyObjectItem = undefined;
	
	var _surveyHelper = __webpack_require__(8);
	
	var SurveyObjectItem = exports.SurveyObjectItem = function () {
	    function SurveyObjectItem() {}
	    return SurveyObjectItem;
	}();
	var SurveyObjects = exports.SurveyObjects = function () {
	    function SurveyObjects(koObjects, koSelected) {
	        this.koObjects = koObjects;
	        this.koSelected = koSelected;
	    }
	    Object.defineProperty(SurveyObjects.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        set: function set(value) {
	            if (this.survey == value) return;
	            this.surveyValue = value;
	            this.rebuild();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyObjects.prototype.addPage = function (page) {
	        var pageItem = this.createPage(page);
	        var index = this.survey.pages.indexOf(page);
	        if (index > 0) {
	            var prevPage = this.survey.pages[index - 1];
	            index = this.getItemIndex(prevPage) + 1;
	            index += prevPage.questions.length;
	        } else {
	            index = 1; //0 - Survey
	        }
	        this.addItem(pageItem, index);
	        index++;
	        for (var i = 0; i < page.questions.length; i++) {
	            var item = this.createQuestion(page.questions[i]);
	            this.addItem(item, index + i);
	        }
	        this.koSelected(pageItem);
	    };
	    SurveyObjects.prototype.addQuestion = function (page, question) {
	        var index = this.getItemIndex(page);
	        if (index < 0) return;
	        var questionIndex = page.questions.indexOf(question) + 1;
	        index += questionIndex;
	        var item = this.createQuestion(question);
	        this.addItem(item, index);
	        this.koSelected(item);
	    };
	    SurveyObjects.prototype.selectObject = function (obj) {
	        var objs = this.koObjects();
	        for (var i = 0; i < objs.length; i++) {
	            if (objs[i].value == obj) {
	                this.koSelected(objs[i]);
	                return;
	            }
	        }
	    };
	    SurveyObjects.prototype.removeObject = function (obj) {
	        var index = this.getItemIndex(obj);
	        if (index < 0) return;
	        var countToRemove = 1;
	        if (_surveyHelper.SurveyHelper.getObjectType(obj) == _surveyHelper.ObjType.Page) {
	            var page = obj;
	            countToRemove += page.questions.length;
	        }
	        this.koObjects.splice(index, countToRemove);
	    };
	    SurveyObjects.prototype.nameChanged = function (obj) {
	        var index = this.getItemIndex(obj);
	        if (index < 0) return;
	        this.koObjects()[index].text(this.getText(obj));
	    };
	    SurveyObjects.prototype.selectNextQuestion = function (isUp) {
	        var question = this.getSelectedQuestion();
	        var itemIndex = this.getItemIndex(question);
	        if (itemIndex < 0) return question;
	        var objs = this.koObjects();
	        var newItemIndex = itemIndex + (isUp ? -1 : 1);
	        if (newItemIndex < objs.length && _surveyHelper.SurveyHelper.getObjectType(objs[newItemIndex].value) == _surveyHelper.ObjType.Question) {
	            itemIndex = newItemIndex;
	        } else {
	            newItemIndex = itemIndex;
	            while (newItemIndex < objs.length && _surveyHelper.SurveyHelper.getObjectType(objs[newItemIndex].value) == _surveyHelper.ObjType.Question) {
	                itemIndex = newItemIndex;
	                newItemIndex += isUp ? 1 : -1;
	            }
	        }
	        this.koSelected(objs[itemIndex]);
	    };
	    SurveyObjects.prototype.getSelectedQuestion = function () {
	        if (!this.koSelected()) return null;
	        var obj = this.koSelected().value;
	        if (!obj) return null;
	        return _surveyHelper.SurveyHelper.getObjectType(obj) == _surveyHelper.ObjType.Question ? obj : null;
	    };
	    SurveyObjects.prototype.addItem = function (item, index) {
	        if (index > this.koObjects().length) {
	            this.koObjects.push(item);
	        } else {
	            this.koObjects.splice(index, 0, item);
	        }
	    };
	    SurveyObjects.prototype.rebuild = function () {
	        var objs = [];
	        if (this.survey == null) {
	            this.koObjects(objs);
	            this.koSelected(null);
	            return;
	        }
	        objs.push(this.createItem(this.survey, "Survey"));
	        for (var i = 0; i < this.survey.pages.length; i++) {
	            var page = this.survey.pages[i];
	            objs.push(this.createPage(page));
	            for (var j = 0; j < page.questions.length; j++) {
	                objs.push(this.createQuestion(page.questions[j]));
	            }
	        }
	        this.koObjects(objs);
	        this.koSelected(this.survey);
	    };
	    SurveyObjects.prototype.createPage = function (page) {
	        return this.createItem(page, this.getText(page));
	    };
	    SurveyObjects.prototype.createQuestion = function (question) {
	        return this.createItem(question, this.getText(question));
	    };
	    SurveyObjects.prototype.createItem = function (value, text) {
	        var item = new SurveyObjectItem();
	        item.value = value;
	        item.text = ko.observable(text);
	        return item;
	    };
	    SurveyObjects.prototype.getItemIndex = function (value) {
	        var objs = this.koObjects();
	        for (var i = 0; i < objs.length; i++) {
	            if (objs[i].value == value) return i;
	        }
	        return -1;
	    };
	    SurveyObjects.prototype.getText = function (obj) {
	        var intend = SurveyObjects.intend;
	        if (_surveyHelper.SurveyHelper.getObjectType(obj) != _surveyHelper.ObjType.Page) {
	            intend += SurveyObjects.intend;
	        }
	        return intend + _surveyHelper.SurveyHelper.getObjectName(obj);
	    };
	    SurveyObjects.intend = "...";
	    return SurveyObjects;
	}();

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.SurveyJSONEditor = undefined;
	
	var _textWorker = __webpack_require__(17);
	
	var SurveyJSONEditor = exports.SurveyJSONEditor = function () {
	    function SurveyJSONEditor() {
	        this.isProcessingImmediately = false;
	        this.timeoutId = -1;
	        this.koText = ko.observable("");
	        this.koErrors = ko.observableArray();
	        var self = this;
	        this.koText.subscribe(function (newValue) {
	            self.onJsonEditorChanged();
	        });
	    }
	    SurveyJSONEditor.prototype.init = function () {
	        if (!this.hasAceEditor) return;
	        this.aceEditor = ace.edit("surveyjsJSONEditor");
	        var self = this;
	        this.aceEditor.setTheme("ace/theme/monokai");
	        this.aceEditor.session.setMode("ace/mode/json");
	        this.aceEditor.setShowPrintMargin(false);
	        this.aceEditor.getSession().on("change", function () {
	            self.onJsonEditorChanged();
	        });
	        this.aceEditor.getSession().setUseWorker(true);
	        _textWorker.SurveyTextWorker.newLineChar = this.aceEditor.session.doc.getNewLineCharacter();
	    };
	    Object.defineProperty(SurveyJSONEditor.prototype, "hasAceEditor", {
	        get: function get() {
	            return typeof ace !== "undefined";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyJSONEditor.prototype, "text", {
	        get: function get() {
	            if (!this.hasAceEditor) return this.koText();
	            return this.aceEditor.getValue();
	        },
	        set: function set(value) {
	            this.isProcessingImmediately = true;
	            this.koText(value);
	            if (this.aceEditor) {
	                this.aceEditor.setValue(value);
	                this.aceEditor.renderer.updateFull(true);
	            }
	            this.processJson(value);
	            this.isProcessingImmediately = false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyJSONEditor.prototype.show = function (value) {
	        this.text = value;
	        if (this.aceEditor) {
	            this.aceEditor.focus();
	        }
	    };
	    Object.defineProperty(SurveyJSONEditor.prototype, "isJsonCorrect", {
	        get: function get() {
	            this.textWorker = new _textWorker.SurveyTextWorker(this.text);
	            return this.textWorker.isJsonCorrect;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SurveyJSONEditor.prototype, "survey", {
	        get: function get() {
	            return this.textWorker.survey;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyJSONEditor.prototype.onJsonEditorChanged = function () {
	        if (this.timeoutId > -1) {
	            clearTimeout(this.timeoutId);
	        }
	        if (this.isProcessingImmediately) {
	            this.timeoutId = -1;
	        } else {
	            var self = this;
	            this.timeoutId = setTimeout(function () {
	                self.timeoutId = -1;
	                self.processJson(self.text);
	            }, SurveyJSONEditor.updateTextTimeout);
	        }
	    };
	    SurveyJSONEditor.prototype.processJson = function (text) {
	        this.textWorker = new _textWorker.SurveyTextWorker(text);
	        if (this.aceEditor) {
	            this.aceEditor.getSession().setAnnotations(this.createAnnotations(text, this.textWorker.errors));
	        } else {
	            this.koErrors(this.textWorker.errors);
	        }
	    };
	    SurveyJSONEditor.prototype.createAnnotations = function (text, errors) {
	        var annotations = new Array();
	        for (var i = 0; i < errors.length; i++) {
	            var error = errors[i];
	            var annotation = { row: error.position.start.row, column: error.position.start.column, text: error.text, type: "error" };
	            annotations.push(annotation);
	        }
	        return annotations;
	    };
	    SurveyJSONEditor.updateTextTimeout = 1000;
	    return SurveyJSONEditor;
	}();

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var html = exports.html = '<div class="svd_container">    <ul class="navbar-default container-fluid nav nav-tabs svd_menu">        <li data-bind="css: {active: koViewType() == \'designer\'}"><a href="#" data-bind="click:selectDesignerClick, text: $root.getLocString(\'ed.designer\')"></a></li>        <li data-bind="visible: showJSONEditorTab, css: {active: koViewType() == \'editor\'}"><a href="#" data-bind="click:selectEditorClick, text: $root.getLocString(\'ed.jsonEditor\')"></a></li>        <li data-bind="visible: showTestSurveyTab, css: {active: koViewType() == \'test\'}"><a href="#" data-bind="click:selectTestClick, text: $root.getLocString(\'ed.testSurvey\')"></a></li>        <li data-bind="visible: showEmbededSurveyTab, css: {active: koViewType() == \'embed\'}"><a href="#" data-bind="click:selectEmbedClick, text: $root.getLocString(\'ed.embedSurvey\')"></a></li>        <li class="svd_actions" data-bind="visible: koIsShowDesigner">            <button type="button" class="btn btn-primary" data-bind="enable:undoRedo.koCanUndo, click: doUndoClick"><span data-bind="text: $root.getLocString(\'ed.undo\')"></span></button>        </li>        <li class="svd_actions" data-bind="visible: koIsShowDesigner">            <button type="button" class="btn btn-primary" data-bind="enable:undoRedo.koCanRedo, click: doRedoClick"><span data-bind="text: $root.getLocString(\'ed.redo\')"></span></button>        </li>        <li class="svd_actions" data-bind="visible: (koIsShowDesigner() && koShowOptions())">            <div class="btn-group inline">                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bind="text: $root.getLocString(\'ed.options\')">                    Options                     <span class="caret"></span>                </button>                <ul class="dropdown-menu">                    <li data-bind="css: {active: koGenerateValidJSON}"><a href="#" data-bind="click:generateValidJSONClick, text: $root.getLocString(\'ed.generateValidJSON\')"></a></li>                    <li data-bind="css: {active: !koGenerateValidJSON()}"><a href="#" data-bind="click:generateReadableJSONClick, text: $root.getLocString(\'ed.generateReadableJSON\')"></a></li>                </ul>            </div>        </li>        <li class="svd_actions" data-bind="visible: koViewType() == \'test\'">            <div class="btn-group inline">                <button type="button" id="surveyTestWidth" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">                    <span data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \' \' + $root.koTestSurveyWidth()"></span>                    <span class="caret"></span>                </button>                <ul class="dropdown-menu" aria-labelledby="surveyTestWidth">                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'100%\')">100%</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'1200px\')">1200px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'1000px\')">1000px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'800px\')">800px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'600px\')">600px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'400px\')">400px</a></li>                </ul>            </div>        </li>        <li class="svd_actions">            <button type="button" class="btn btn-primary svd_save_btn" data-bind="click: saveButtonClick, visible: koShowSaveButton"><span data-bind="text: $root.getLocString(\'ed.saveSurvey\')"></span></button>        </li>    </ul>    <div class="panel svd_content">        <div class="row svd_survey_designer"  data-bind="visible: koViewType() == \'designer\'">            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 panel panel-default svd_toolbox">                <div class="btn-group-vertical" style="width:100%;padding-right:2px">                    <!-- ko foreach: questionTypes -->                    <div class="btn btn-default" style="text-align:left; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}, dragend: function(el, e) { $parent.dragEnd(); }}">                        <span data-bind="css: \'icon-\' + $data"></span>                        <span class="svd_toolbox_item_text" data-bind="text: $root.getLocString(\'qt.\' + $data)"></span>                    </div>                    <!-- /ko  -->                    <!-- ko foreach: koCopiedQuestions -->                    <div class="btn btn-default" style="text-align:left; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickCopiedQuestion, event:{dragstart: function(el, e) { $parent.draggingCopiedQuestion($data, e); return true;}, dragend: function(el, e) { $parent.dragEnd(); }}">                        <span class="icon-default"></span>                        <span class="svd_toolbox_item_text" data-bind="text:name"></span>                    </div>                    <!-- /ko  -->                </div>            </div>            <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12 svd_editors">                <div class="svd_pages_editor" data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>                <div class="svd_questions_editor" id="scrollableDiv">                    <div id="surveyjs"></div>                </div>            </div>            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 panel panel-default svd_properties">                <div class="panel-heading input-group">                    <div class="custom-select">                        <select class="form-control" data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                    </div>                    <div class="input-group-btn">                        <button class="btn btn-default" type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject, attr: { title: $root.getLocString(\'ed.delSelObject\')}"><span class="glyphicon glyphicon-remove"></span></button>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                <div class="panel-footer" data-bind="visible:surveyVerbs.koHasVerbs">                    <div data-bind="template: { name: \'objectverbs\', data: surveyVerbs }"></div>                </div>            </div>        </div>        <div data-bind="visible: koViewType() == \'editor\'">            <div data-bind="template: { name: \'jsoneditor\', data: jsonEditor }"></div>        </div>        <div id="surveyjsTest" data-bind="visible: koViewType() == \'test\', style: {width: koTestSurveyWidth}">            <div id="surveyjsExample"></div>            <div id="surveyjsExampleResults"></div>            <button id="surveyjsExamplereRun" data-bind="click:selectTestClick, text: $root.getLocString(\'ed.testSurveyAgain\')" style="display:none">Test Again</button>        </div>        <div id="surveyjsEmbed" data-bind="visible: koViewType() == \'embed\'">            <div data-bind="template: { name: \'surveyembeding\', data: surveyEmbeding }"></div>        </div>    </div></div><script type="text/html" id="jsoneditor">    <div data-bind="visible: !hasAceEditor">        <textarea class="svd_json_editor_area" data-bind="textInput:koText"></textarea>        <!-- ko foreach: koErrors -->        <div>            <span>Error: </span><span data-bind="text: text"></span>        </div>        <!-- /ko  -->    </div>    <div id="surveyjsJSONEditor" class="svd_json_editor"></div></script><script type="text/html" id="objecteditor">    <table class="table svd_table-nowrap">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), css: {\'active\': $parent.koActiveProperty() == $data}">                <td data-bind="text: displayName, attr: {title: title}" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data && (koText() || $data.editorType == \'boolean\'), attr: {title: koText}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data || (!koText() && $data.editorType != \'boolean\')">                        <!-- ko template: { name: \'propertyeditor-\' + editorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="objectverbs">    <!-- ko foreach: koVerbs -->        <div class="row">            <div class="input-group">                <span  class="input-group-addon" data-bind="text:text"></span>                <select class="form-control" data-bind="options: koItems, optionsText: \'text\', optionsValue:\'value\', value: koSelectedItem"></select>            </div>        </div>    <!-- /ko  --></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs" data-bind="tabs:true">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()},event:{           keydown:function(el, e){ $parent.keyDown(el, e); },           dragstart:function(el, e){ $parent.dragStart(el); return true; },           dragover:function(el, e){ $parent.dragOver(el);},           dragend:function(el, e){ $parent.dragEnd();},           drop:function(el, e){ $parent.dragDrop(el);}         }">             <a class="svd_page_nav" href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button class="btn btn-default svd_add_new_page_btn" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="surveyembeding">    <div class="row">        <select data-bind="value:koLibraryVersion">            <option value="knockout" data-bind="text: $root.getLocString(\'ew.knockout\')"></option>            <option value="react" data-bind="text: $root.getLocString(\'ew.react\')"></option>        </select>        <select data-bind="value:koScriptUsing">            <option value="bootstrap" data-bind="text: $root.getLocString(\'ew.bootstrap\')"></option>            <option value="standard" data-bind="text: $root.getLocString(\'ew.standard\')"></option>        </select>        <select data-bind="value:koShowAsWindow">            <option value="page" data-bind="text: $root.getLocString(\'ew.showOnPage\')"></option>            <option value="window" data-bind="text: $root.getLocString(\'ew.showInWindow\')"></option>        </select>        <label class="checkbox-inline" data-bind="visible:koHasIds">            <input type="checkbox" data-bind="checked:koLoadSurvey" />            <span data-bind="text: $root.getLocString(\'ew.loadFromServer\')"></span>        </label>    </div>    <div class="panel">        <div class="panel-heading" data-bind="text: $root.getLocString(\'ew.titleScript\')"></div>        <div data-bind="visible:hasAceEditor">            <div id="surveyEmbedingHead" style="height:70px;width:100%"></div>        </div>        <textarea data-bind="visible:!hasAceEditor, text: koHeadText" style="height:70px;width:100%"></textarea>    </div>    <div class="panel" data-bind="visible: koVisibleHtml">        <div class="panel-heading"  data-bind="text: $root.getLocString(\'ew.titleHtml\')"></div>        <div data-bind="visible:hasAceEditor">            <div id="surveyEmbedingBody" style="height:30px;width:100%"></div>        </div>        <textarea data-bind="visible:!hasAceEditor, text: koBodyText" style="height:30px;width:100%"></textarea>    </div>    <div class="panel">        <div class="panel-heading"  data-bind="text: $root.getLocString(\'ew.titleJavaScript\')"></div>        <div data-bind="visible:hasAceEditor">            <div id="surveyEmbedingJava" style="height:300px;width:100%"></div>        </div>        <textarea data-bind="visible:!hasAceEditor, text: koJavaText" style="height:300px;width:100%"></textarea>    </div></script><script type="text/html" id="propertyeditor-boolean">    <input class="form-control" type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <div class="custom-select">        <select class="form-control" data-bind="value: koValue, options: choices"  style="width:100%"></select>    </div></script><script type="text/html" id="propertyeditor-html">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-html">    <textarea class="form-control" data-bind="value:koValue" style="width:100%" rows="10" autofocus="autofocus"></textarea></script><script type="text/html" id="propertyeditor-itemvalues">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-itemvalues">    <div style="overflow-y: auto; overflow-x:hidden; max-height:400px">        <table class="table">            <thead>                <tr>                    <th></th>                    <th data-bind="text: $root.getLocString(\'pe.value\')"></th>                    <th data-bind="text: $root.getLocString(\'pe.text\')"></th>                    <th></th>                </tr>            </thead>            <tbody>                <!-- ko foreach: koItems -->                <tr>                    <td>                        <div class="btn-group" role="group">                            <button type="button" class="btn btn-xs" data-bind="visible: $index() > 0, click: $parent.onMoveUpClick"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button>                            <button type="button" class="btn btn-xs" style="float:none" data-bind="visible: $index() < $parent.koItems().length - 1, click: $parent.onMoveDownClick"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button>                        </div>                    </td>                    <td>                        <input type="text" class="form-control" data-bind="value:koValue" style="width:200px" />                        <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError, text: $root.getLocString(\'pe.enterNewValue\')"></div>                    </td>                    <td><input type="text" class="form-control" data-bind="value:koText" style="width:200px" /></td>                    <td><button type="button" class="btn btn-xs" data-bind="click: $parent.onDeleteClick"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td>                </tr>                <!-- /ko -->            </tbody>        </table>    </div>    <div class="row btn-toolbar">        <input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')" />        <input type="button" class="btn btn-danger" data-bind="click: onClearClick, value: $root.getLocString(\'pe.removeAll\')" />    </div></script><script type="text/html" id="propertyeditor-matrixdropdowncolumns">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-matrixdropdowncolumns">    <table class="table">        <thead>            <tr>                <th data-bind="text: $root.getLocString(\'pe.required\')"></th>                <th data-bind="text: $root.getLocString(\'pe.cellType\')"></th>                <th data-bind="text: $root.getLocString(\'pe.name\')"></th>                <th data-bind="text: $root.getLocString(\'pe.title\')"></th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td>                    <a href="#" data-bind="visible:koHasChoices, click: onShowChoicesClick">                        <span class="glyphicon" data-bind="css: {\'glyphicon-chevron-down\': !koShowChoices(), \'glyphicon-chevron-up\': koShowChoices()}"></span>                    </a>                    <input type="checkbox" data-bind="checked: koIsRequired" />                </td>                <td>                    <select class="form-control" data-bind="options: cellTypeChoices, value: koCellType"  style="width:110px"></select>                </td>                <td>                    <input type="text" class="form-control" data-bind="value:koName" style="width:100px" />                    <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError, text: $root.getLocString(\'pe.enterNewValue\')"></div>                </td>                <td><input type="text" class="form-control" data-bind="value:koTitle" style="width:120px" /></td>                <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')"/></td>            </tr>            <tr data-bind="visible: koShowChoices() && koHasChoices()">                <td colspan="4" style="border-top-style:none">                    <div class="form-group">                        <label class="control-label col-sm-3" data-bind="text:$root.getLocString(\'pe.hasOther\')"></label>                        <div class="col-sm-2">                            <input type="checkbox" data-bind="checked: koHasOther" />                        </div>                        <div class="col-sm-7" data-bind="visible: !koHasColCount()"></div>                        <label class="control-label col-sm-3" data-bind="visible:koHasColCount, text:$root.getLocString(\'pe.colCount\')"></label>                        <select class="form-control col-sm-4" data-bind="visible:koHasColCount, options: colCountChoices, value: koColCount" style="width:110px"></select>                    </div>                    <div class="modal-body svd_notopbottompaddings">                        <!-- ko template: { name: \'propertyeditorcontent-itemvalues\', data: choicesEditor } -->                        <!-- /ko -->                    </div>                </td>            </tr>            <!-- /ko -->            <tr>                <td colspan="3">                    <div class="row btn-toolbar">                        <input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')"/>                        <input type="button" class="btn btn-danger" data-bind="click: onClearClick, value: $root.getLocString(\'pe.removeAll\')"" />                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="propertyeditor-modal">    <div class="input-group" data-bind="visible:!editor.isEditable">        <span data-bind="text: koText"></span>        <div class="input-group-btn">            <button type="button"  class="btn btn-default"data-toggle="modal" style="padding: 2px;" data-bind="attr: {\'data-target\' : modalNameTarget}">                <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>            </button>        </div>    </div>    <div class="input-group" data-bind="visible:editor.isEditable" style="display:table">        <input class="form-control" type="text" data-bind="value: koValue" style="display:table-cell; width:100%" />        <div class="input-group-btn">            <button type="button" class="btn btn-default" style="display:table-cell; padding: 2px;"  data-toggle="modal" data-bind="attr: {\'data-target\' : modalNameTarget}">                <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>            </button>        </div>    </div>    <div data-bind="attr: {id : modalName}" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:editor.title"></h4>                </div>                  <div class="modal-body svd_notopbottompaddings">                    <!-- ko template: { name: \'propertyeditorcontent-\' + editorType, data: editor } -->                    <!-- /ko -->                </div>                <div class="modal-footer">                    <input type="button" class="btn btn-primary" data-bind="click: editor.onApplyClick, value: $root.getLocString(\'pe.apply\')" style="width:100px" />                    <input type="button" class="btn btn-default" data-bind="click: editor.onResetClick, value: $root.getLocString(\'pe.reset\')" style="width:100px" />                    <input type="button" class="btn btn-default" data-dismiss="modal" data-bind="value: $root.getLocString(\'pe.close\')" style="width:100px" />                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-number">    <input class="form-control" type="number" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-restfull">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-restfull">    <form>        <div class="form-group">            <label for="url">Url:</label>            <input id="url" type="text" data-bind="value:koUrl" class="form-control" />        </div>        <div class="form-group">            <label for="path">Path:</label>            <input id="path" type="text" data-bind="value:koPath" class="form-control" />        </div>        <div class="form-group">            <label for="valueName">valueName:</label>            <input id="valueName" type="text" data-bind="value:koValueName" class="form-control" />        </div>        <div class="form-group">            <label for="titleName">titleName:</label>            <input id="titleName" type="text" data-bind="value:koTitleName" class="form-control" />        </div>    </form>    <div id="restfullSurvey" style="width:100%;height:150px"></div></script><script type="text/html" id="propertyeditor-string">    <input class="form-control" type="text" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-text">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-text">    <textarea class="form-control" data-bind="value:koValue" style="width:100%" rows="10" autofocus="autofocus"></textarea></script><script type="text/html" id="propertyeditor-textitems">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-textitems"><div class="panel">    <table class="table">        <thead>            <tr>                <th data-bind="text: $root.getLocString(\'pe.name\')"></th>                <th data-bind="text: $root.getLocString(\'pe.title\')"></th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td><input type="text" class="form-control" data-bind="value:koName" style="width:200px" /></td>                <td><input type="text" class="form-control" data-bind="value:koTitle" style="width:200px" /></td>                <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')"/></td>            </tr>            <!-- /ko -->            <tr>                <td colspan="4"><input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')"/></td>            </tr>        </tbody>    </table></div></script><script type="text/html" id="propertyeditor-triggers">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-triggers"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <button type="button" class="dropdown-toggle input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                <span class="glyphicon glyphicon-plus"></span>            </button>            <ul class="dropdown-menu input-group">                <!-- ko foreach: availableTriggers -->                <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                <!-- /ko  -->            </ul>            <select class="form-control" data-bind="options: koItems, optionsText: \'koText\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="visible: koSelected() == null">        <div data-bind="visible: koQuestions().length == 0, text: $root.getLocString(\'pe.noquestions\')"></div>        <div data-bind="visible: koQuestions().length > 0, text: $root.getLocString(\'pe.createtrigger\')"></div>    </div>    <div data-bind="visible: koSelected() != null">        <div data-bind="with: koSelected">            <div class="row form-inline">                <div class="col-sm-4">                    <span data-bind="text: $root.getLocString(\'pe.triggerOn\')"></span><select class="form-control" data-bind="options:$parent.koQuestions, value: koName"></select> <span> </span>                </div>                <div class="col-sm-4">                    <select class="form-control" data-bind="options:availableOperators, optionsValue: \'name\', optionsText: \'text\', value:koOperator"></select>                </div>                <div class="col-sm-4">                    <input class="form-control" style="padding: 0" type="text" data-bind="visible: koRequireValue, value:koValue" />                </div>            </div>            <!-- ko if: koType() == \'visibletrigger\' -->            <div class="row">                <div class="col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: pages } -->                    <!-- /ko -->                </div>                <div class="col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: questions } -->                    <!-- /ko -->                </div>            </div>            <!-- /ko -->            <!-- ko if: koType() == \'completetrigger\' -->            <div class="row">               <div style="margin: 10px" data-bind="text: $root.getLocString(\'pe.triggerCompleteText\')"></div>            </div>            <!-- /ko -->            <!-- ko if: koType() == \'setvaluetrigger\' -->            <div class="row form-inline" style="margin-top:10px">                <div class="col-sm-6">                    <span data-bind="text: $root.getLocString(\'pe.triggerSetToName\')"></span><input class="form-control" type="text" data-bind="value:kosetToName" />                </div>                <div class="col-sm-1">                </div>                <div class="col-sm-5">                    <span data-bind="text: $root.getLocString(\'pe.triggerSetValue\')"></span><input class="form-control" type="text" data-bind="value:kosetValue" />                </div>            </div>            <div class="row form-inline">                <div class="col-sm-12">                    <input type="checkbox" data-bind="checked: koisVariable" /> <span data-bind="text: $root.getLocString(\'pe.triggerIsVariable\')"></span>                </div>            </div>            <!-- /ko -->        </div>    </div></div></script><script type="text/html" id="propertyeditor-triggersitems">    <div class="panel no-margins no-padding">        <div class="panel-heading">            <span data-bind="text: title"></span>        </div>        <div class="input-group">            <select class="form-control" multiple="multiple" data-bind="options:koChoosen, value: koChoosenSelected"></select>            <span class="input-group-btn" style="vertical-align:top">                <button type="button" data-bind="enable: koChoosenSelected() != null, click: onDeleteClick" class="btn"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>        <div class="input-group" style="margin-top:5px">            <select class="form-control" data-bind="options:koObjects, value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onAddClick" style="width:40px" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></button>            </span>        </div>    </div></script><script type="text/html" id="propertyeditor-validators">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-validators"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <button type="button" class="dropdown-toggle input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                <span class="glyphicon glyphicon-plus"></span>            </button>            <ul class="dropdown-menu input-group">                <!-- ko foreach: availableValidators -->                <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                <!-- /ko  -->            </ul>            <select class="form-control" data-bind="options: koItems, optionsText: \'text\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div></div></script>';

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var html = exports.html = '<div data-bind="event:{           dragenter:function(el, e){ dragEnter(e);},           dragleave:function(el, e){ dragLeave(e);},           dragover:function(el, e){ return false;},           drop:function(el, e){ dragDrop(e);}}     ">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + processedTitle, css: $root.css.pageTitle"></h4>    <!-- ko foreach: { data: rows, as: \'row\'} -->    <div class="svd_question_container" data-bind="visible: row.koVisible, css: $root.css.row">        <!-- ko foreach: { data: row.questions, as: \'question\' , afterRender: row.koAfterRender } -->            <div data-bind="visible: question.koIsDragging">                <!-- ko template: { if: $root.koDraggingSource(), name: \'survey-question\', data: $root.koDraggingSource(), as: \'question\', templateOptions: { isDragging: true } } -->                <!-- /ko -->            </div>            <!-- ko template: { name: \'survey-question\', data: question, templateOptions: { isDragging: false } } -->            <!-- /ko -->        <!-- /ko -->    </div>    <!-- /ko -->    <div class="well" data-bind="visible:$root.isDesignMode && questions.length == 0">        <span data-bind="visible: !koDraggingBottom(), text:$root.getEditorLocString(\'survey.dropQuestion\')"></span>        <div data-bind="visible: koDraggingBottom">            <!-- ko template: { if: $root.koDraggingSource(), name: \'survey-question\', data: $root.koDraggingSource(), as: \'question\', templateOptions: { isDragging: true } } -->            <!-- /ko -->        </div>    </div>    <div data-bind="visible: questions.length > 0 && koDraggingBottom()">        <!-- ko template: { if: $root.koDraggingSource(), name: \'survey-question\', data: $root.koDraggingSource(), as: \'question\', templateOptions: { isDragging: true } } -->        <!-- /ko -->    </div></div>';

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var html = exports.html = '<div class="svd_question" style="vertical-align:top" data-bind="style: {display: question.koVisible()|| $root.isDesignMode ? \'inline-block\': \'none\', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth },     attr : {id: id, draggable: $root.isDesignMode}, click: $root.isDesignMode ? koOnClick: null,          event:{           dragstart:function(el, e){ dragStart(e); return true; },           dragover:function(el, e){ if(!question.isDragging) dragOver(e);},           dragend:function(el, e){ dragEnd(e);},           drop:function(el, e){ dragDrop(e);}         }, css:{svd_q_design_border: $root.isDesignMode, svd_q_selected : koIsSelected, \'well well-sm\': $root.isDesignMode}">    <div data-bind="css:{svd_q_design: $root.isDesignMode}, style:{opacity: question.koIsDraggingSource() ? 0.4 : 1}">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'top\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            <div data-bind="text:question.commentText"></div>            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'bottom\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->    </div>    <div class="svd_question_menu" data-bind="visible: koIsSelected">        <button type="button" class="btn btn-primary  btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">            <span class="glyphicon glyphicon-option-horizontal"></span>        </button>        <ul class="dropdown-menu">            <li>                <button class="btn btn-primary btn-xs" data-bind="click: $root.copyQuestionClick, text:$root.getEditorLocString(\'survey.addToToolbox\')"></button>            </li>            <li>                <button class="btn btn-primary btn-xs" data-bind="click: $root.fastCopyQuestionClick, text:$root.getEditorLocString(\'survey.copy\')"></button>            </li>        </ul>    </div></div>';

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiMTU0YWVjMGE2Y2Q1NWY5NWJiMiIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhZ2Ryb3BoZWxwZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcInJvb3RcIjpcIlN1cnZleVwiLFwiY29tbW9uanMyXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImNvbW1vbmpzXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImFtZFwiOlwic3VydmV5LWtub2Nrb3V0XCJ9Iiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1zRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNb2RhbEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yTG9jYWxpemF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9zdXJ2ZXlIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0UHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5UmVzdGZ1bGxFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRyaWdnZXJzRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wYWdlc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGV4dFdvcmtlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvanNvbjUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleUVtYmVkaW5nV2luZG93LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RWZXJicy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5kb3JlZG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5T2JqZWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5SlNPTkVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVFZGl0b3Iua28uaHRtbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVfcGFnZS5odG1sLnRzIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNyQ0E7Ozs7Ozs7OztnQ0FDNEI7Ozs7OztnQ0FBNEI7Ozs7OztnQ0FDeEI7Ozs7OztnQ0FBNkI7Ozs7Oztn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LGtCQUFVLFlBQUcsQ0FDckI7QUFBTSxnQkFBRTtBQUNKLGlCQUFRLE9BQVE7QUFDWixrQkFBVSx1QkFBYztBQUNwQixzQkFBVSxZQUFHLENBQUc7QUFDaEIsc0JBQVksWUFBSyxLQUN6QjtBQUFDLGNBSDBCLEVBR1IsaUJBQ3ZCO0FBQ0o7QUFBQztBQUNPLGdDQUFXLGNBQW5CLFVBQWdDO0FBQ3hCLGNBQVcsYUFBdUIsaUNBQU87QUFDMUMsYUFBSyxLQUFXLFdBQUU7QUFDYixrQkFBVSxVQUFhLGFBQWUsZUFBSyxLQUFrQixrQkFBSyxNQUFNLEtBQVcsV0FDM0Y7QUFBTSxnQkFBRTtBQUNBLGtCQUFTLFNBQUssS0FBVyxXQUNqQztBQUNKO0FBQUM7QUFDTyxnQ0FBaUIsb0JBQXpCLFVBQXNDLE1BQWU7QUFDakQsYUFBZSxjQUFHLElBQWdDO0FBQzlDLGNBQUMsSUFBSyxJQUFJLEdBQUcsSUFBUyxPQUFPLFFBQUssS0FBRztBQUNyQyxpQkFBUyxRQUFTLE9BQUk7QUFDdEIsaUJBQWMsYUFBdUIsRUFBSyxLQUFPLE1BQVMsU0FBTSxNQUFJLEtBQVEsUUFBTyxNQUFTLFNBQU0sTUFBTyxRQUFNLE1BQU8sTUFBSyxNQUFNLE1BQVk7QUFDbEkseUJBQUssS0FDcEI7QUFBQztBQUNLLGdCQUNWO0FBQUM7QUF0RmEsc0JBQWlCLG9CQUFnQjtBQXVGbkQsWUFBQztBQUFBLEs7Ozs7Ozs7OztBQzNGTSxLQUFRLHNCQUErODdCLDQ4N0I7Ozs7Ozs7OztBQ0F2OTdCLEtBQVEsc0JBQW8xRCxpMUQ7Ozs7Ozs7OztBQ0E1MUQsS0FBUSxzQkFBcXBGLGtwRiIsImZpbGUiOiJzdXJ2ZXllZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJzdXJ2ZXkta25vY2tvdXRcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJTdXJ2ZXlFZGl0b3JcIiwgW1wic3VydmV5LWtub2Nrb3V0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN1cnZleUVkaXRvclwiXSA9IGZhY3RvcnkocmVxdWlyZShcInN1cnZleS1rbm9ja291dFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiU3VydmV5RWRpdG9yXCJdID0gZmFjdG9yeShyb290W1wiU3VydmV5XCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIxNTRhZWMwYTZjZDU1Zjk1YmIyIiwiZXhwb3J0IHtEcmFnRHJvcEhlbHBlcn0gZnJvbSBcIi4uL2RyYWdkcm9waGVscGVyXCI7XG5leHBvcnQge1xuICAgIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSwgU3VydmV5U3RyaW5nUHJvcGVydHlFZGl0b3IsXG4gICAgU3VydmV5RHJvcGRvd25Qcm9wZXJ0eUVkaXRvciwgU3VydmV5Qm9vbGVhblByb3BlcnR5RWRpdG9yLCBTdXJ2ZXlOdW1iZXJQcm9wZXJ0eUVkaXRvclxufSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVRleHRJdGVtc0VkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRleHRJdGVtc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbVZhbHVlc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eURyb3Bkb3duQ29sdW1uc0VkaXRvciwgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtfVxuICAgIGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1vZGFsRWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVByb3BlcnR5UmVzdWx0ZnVsbEVkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVJlc3RmdWxsRWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVByb3BlcnR5VHJpZ2dlcnNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUcmlnZ2Vyc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yXCI7XG5cbmV4cG9ydCB7U3VydmV5T2JqZWN0UHJvcGVydHl9IGZyb20gXCIuLi9vYmplY3RQcm9wZXJ0eVwiO1xuZXhwb3J0IHtTdXJ2ZXlPYmplY3RFZGl0b3J9IGZyb20gXCIuLi9vYmplY3RFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UGFnZXNFZGl0b3J9IGZyb20gXCIuLi9wYWdlc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlUZXh0V29ya2VyfSBmcm9tIFwiLi4vdGV4dFdvcmtlclwiO1xuZXhwb3J0IHtPYmpUeXBlLCBTdXJ2ZXlIZWxwZXJ9IGZyb20gXCIuLi9zdXJ2ZXlIZWxwZXJcIjtcbmV4cG9ydCB7U3VydmV5RW1iZWRpbmdXaW5kb3d9IGZyb20gXCIuLi9zdXJ2ZXlFbWJlZGluZ1dpbmRvd1wiO1xuZXhwb3J0IHtTdXJ2ZXlWZXJicywgU3VydmV5VmVyYkl0ZW0sIFN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbSwgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtfSBmcm9tIFwiLi4vb2JqZWN0VmVyYnNcIjtcbmV4cG9ydCB7U3VydmV5VW5kb1JlZG8sIFVuZG9SZWRvSXRlbX0gZnJvbSBcIi4uL3VuZG9yZWRvXCI7XG5leHBvcnQge1N1cnZleUVkaXRvcn0gZnJvbSBcIi4uL2VkaXRvclwiO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lbnRyaWVzL2luZGV4LnRzIiwiaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEcmFnRHJvcEhlbHBlciB7XHJcbiAgICBzdGF0aWMgZGF0YVN0YXJ0OiBzdHJpbmcgPSBcInN1cnZleWpzLFwiO1xyXG4gICAgc3RhdGljIGRyYWdEYXRhOiBhbnkgPSB7dGV4dDogXCJcIiwganNvbjogbnVsbCB9O1xyXG4gICAgc3RhdGljIHByZXZFdmVudCA9IHsgcXVlc3Rpb246IG51bGwsIHg6IC0xLCB5OiAtMSB9O1xyXG4gICAgcHJpdmF0ZSBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueTtcclxuICAgIHByaXZhdGUgc2Nyb2xsYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuICAgIHByaXZhdGUgc291cmNlSW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIGRhdGE6IFN1cnZleS5JU3VydmV5LCBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueSwgc2Nyb2xsYWJsZUVsTmFtZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMub25Nb2RpZmllZENhbGxiYWNrID0gb25Nb2RpZmllZENhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgoc2Nyb2xsYWJsZUVsTmFtZSA/IHNjcm9sbGFibGVFbE5hbWUgOiBcInNjcm9sbGFibGVEaXZcIikpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiA8U3VydmV5LlN1cnZleT50aGlzLmRhdGE7IH1cclxuICAgIHB1YmxpYyBzdGFydERyYWdOZXdRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnByZXBhcmVEYXRhKGV2ZW50LCBxdWVzdGlvblR5cGUsIHF1ZXN0aW9uTmFtZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhcnREcmFnUXVlc3Rpb24oZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb25OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnByZXBhcmVEYXRhKGV2ZW50LCBudWxsLCBxdWVzdGlvbk5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXJ0RHJhZ0NvcGllZFF1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nLCBxdWVzdGlvbkpzb246IGFueSkge1xyXG4gICAgICAgIHRoaXMucHJlcGFyZURhdGEoZXZlbnQsIG51bGwsIHF1ZXN0aW9uTmFtZSwgcXVlc3Rpb25Kc29uKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpc1N1cnZleURyYWdnaW5nKGV2ZW50OiBEcmFnRXZlbnQpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIWV2ZW50KSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpLnRleHQ7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEgJiYgZGF0YS5pbmRleE9mKERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCkgPT0gMDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkb0RyYWdEcm9wT3ZlcihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIGV2ZW50ID0gdGhpcy5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgdGhpcy5jaGVja1Njcm9sbFkoZXZlbnQpO1xyXG4gICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IERyYWdEcm9wSGVscGVyLmRyYWdEYXRhLnRhcmdldFF1ZXN0aW9uO1xyXG4gICAgICAgIGlmICghcXVlc3Rpb24gfHwgcXVlc3Rpb24gPT0gdGFyZ2V0UXVlc3Rpb24gfHwgIXRoaXMuaXNTdXJ2ZXlEcmFnZ2luZyhldmVudCkgfHwgdGhpcy5pc1NhbWVQbGFjZShldmVudCwgcXVlc3Rpb24pKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRRdWVzdGlvbkluZGV4KGV2ZW50LCBxdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKHRoaXMuc291cmNlSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zb3VyY2VJbmRleCA9PSBpbmRleCB8fCB0aGlzLnNvdXJjZUluZGV4ICsgMSA9PSBpbmRleCkgIGluZGV4ID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXShpbmRleCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZW5kKCkge1xyXG4gICAgICAgIHRoaXMuaXNTY3JvbGxTdG9wID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldElzRHJhZ2dpbmdTb3VyY2UodGhpcy5zdXJ2ZXlbXCJrb0RyYWdnaW5nU291cmNlXCJdKCksIGZhbHNlKTtcclxuICAgICAgICB0aGlzLnN1cnZleVtcImtvRHJhZ2dpbmdTb3VyY2VcIl0obnVsbCk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKC0xKTtcclxuICAgICAgICB0aGlzLnNvdXJjZUluZGV4ID0gLTE7XHJcbiAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkb0Ryb3AoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UgPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTdXJ2ZXlEcmFnZ2luZyhldmVudCkpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKCk7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IERyYWdEcm9wSGVscGVyLmRyYWdEYXRhLnRhcmdldFF1ZXN0aW9uO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0UXVlc3Rpb24gJiYgaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZEluZGV4ID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEluZGV4ID4gLTEgJiYgb2xkSW5kZXggPCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4LS07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbmQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBkb0xlYXZlUGFnZShldmVudDogRHJhZ0V2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQgPSB0aGlzLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQpIHJldHVybjtcclxuICAgICAgICBpZiAoZXZlbnQuY2xpZW50WCA8PSAwIHx8IGV2ZW50LmNsaWVudFkgPD0gMCB8fFxyXG4gICAgICAgICAgICBldmVudC5jbGllbnRYID49IHRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQub2Zmc2V0V2lkdGggfHwgZXZlbnQuY2xpZW50WSA+PSB0aGlzLnNjcm9sbGFibGVFbGVtZW50Lm9mZnNldEhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZVtcImtvRHJhZ2dpbmdcIl0oLTEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlVGFyZ2V0UXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uTmFtZTogc3RyaW5nLCBqc29uOiBhbnkpOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICBpZiAoIXF1ZXN0aW9uTmFtZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRhcmdldFF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkJhc2U+dGhpcy5zdXJ2ZXkuZ2V0UXVlc3Rpb25CeU5hbWUocXVlc3Rpb25OYW1lKTtcclxuICAgICAgICB0aGlzLnNvdXJjZUluZGV4ID0gLTE7XHJcbiAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlSW5kZXggPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5xdWVzdGlvbnMuaW5kZXhPZih0YXJnZXRRdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGFyZ2V0UXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKGpzb24pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFF1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihqc29uW1widHlwZVwiXSwgbmFtZSk7XHJcbiAgICAgICAgICAgICAgICBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b09iamVjdChqc29uLCB0YXJnZXRRdWVzdGlvbik7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbi5uYW1lID0gcXVlc3Rpb25OYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0UXVlc3Rpb24gJiYgcXVlc3Rpb25UeXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBxdWVzdGlvbk5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRhcmdldFF1ZXN0aW9uLnNldERhdGEodGhpcy5zdXJ2ZXkpO1xyXG4gICAgICAgICAgICB0YXJnZXRRdWVzdGlvbi5yZW5kZXJXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldElzRHJhZ2dpbmdTb3VyY2UodGFyZ2V0UXVlc3Rpb24sIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0YXJnZXRRdWVzdGlvbjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0SXNEcmFnZ2luZ1NvdXJjZShxdWVzdGlvbjogYW55LCB2YWw6IGFueSkge1xyXG4gICAgICAgIGlmIChxdWVzdGlvbiAmJiBxdWVzdGlvbltcImtvSXNEcmFnZ2luZ1NvdXJjZVwiXSkgcXVlc3Rpb25bXCJrb0lzRHJhZ2dpbmdTb3VyY2VcIl0odmFsKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0UXVlc3Rpb25JbmRleChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgaWYgKCFxdWVzdGlvbikgcmV0dXJuIHBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSA8bnVtYmVyPmV2ZW50LmN1cnJlbnRUYXJnZXRbXCJjbGllbnRIZWlnaHRcIl07XHJcbiAgICAgICAgdmFyIHkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgICAgIGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eSgnbGF5ZXJYJykpIHtcclxuICAgICAgICAgICAgeSA9IGV2ZW50LmxheWVyWSAtIDxudW1iZXI+ZXZlbnQuY3VycmVudFRhcmdldFtcIm9mZnNldFRvcFwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHkgPiBoZWlnaHQgLyAyKSBpbmRleCsrO1xyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNTYW1lUGxhY2UoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgcHJldiA9IERyYWdEcm9wSGVscGVyLnByZXZFdmVudDtcclxuICAgICAgICBpZiAocHJldi5xdWVzdGlvbiAhPSBxdWVzdGlvbiB8fCBNYXRoLmFicyhldmVudC5jbGllbnRYIC0gcHJldi54KSA+IDUgfHwgTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIHByZXYueSkgPiA1KSB7XHJcbiAgICAgICAgICAgIHByZXYucXVlc3Rpb24gPSBxdWVzdGlvbjtcclxuICAgICAgICAgICAgcHJldi54ID0gZXZlbnQuY2xpZW50WDtcclxuICAgICAgICAgICAgcHJldi55ID0gZXZlbnQuY2xpZW50WTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgaXNTY3JvbGxTdG9wOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgc3RhdGljIFNjcm9sbERlbGF5OiBudW1iZXIgPSAzMDtcclxuICAgIHByaXZhdGUgc3RhdGljIFNjcm9sbE9mZnNldDogbnVtYmVyID0gMTAwO1xyXG4gICAgcHJpdmF0ZSBjaGVja1Njcm9sbFkoZTogRHJhZ0V2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbGFibGVFbGVtZW50KSByZXR1cm47XHJcbiAgICAgICAgdmFyIHkgPSB0aGlzLmdldFNjcm9sbGFibGVFbGVtZW50UG9zWShlKTtcclxuICAgICAgICBpZiAoeSA8IDApIHJldHVybjtcclxuICAgICAgICB0aGlzLmlzU2Nyb2xsU3RvcCA9IHRydWU7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IDxudW1iZXI+dGhpcy5zY3JvbGxhYmxlRWxlbWVudFtcImNsaWVudEhlaWdodFwiXTtcclxuICAgICAgICBpZiAoeSA8IERyYWdEcm9wSGVscGVyLlNjcm9sbE9mZnNldCAmJiB5ID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pc1Njcm9sbFN0b3AgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kb1Njcm9sbFkoLTEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaGVpZ2h0IC0geSA8IERyYWdEcm9wSGVscGVyLlNjcm9sbE9mZnNldCAmJiBoZWlnaHQgPj0geSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzU2Nyb2xsU3RvcCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRvU2Nyb2xsWSgxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvU2Nyb2xsWShzdGVwOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgZWwgPSB0aGlzLnNjcm9sbGFibGVFbGVtZW50O1xyXG4gICAgICAgIHZhciBzY3JvbGxZID0gZWwuc2Nyb2xsVG9wICsgc3RlcDtcclxuICAgICAgICBpZiAoc2Nyb2xsWSA8IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pc1Njcm9sbFN0b3AgPSB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsLnNjcm9sbFRvcCA9IHNjcm9sbFk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5pc1Njcm9sbFN0b3ApIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYuZG9TY3JvbGxZKHN0ZXApIH0sIERyYWdEcm9wSGVscGVyLlNjcm9sbERlbGF5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFNjcm9sbGFibGVFbGVtZW50UG9zWShlOiBEcmFnRXZlbnQpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxhYmxlRWxlbWVudCB8fCAhZS5jdXJyZW50VGFyZ2V0KSByZXR1cm4gLTE7XHJcbiAgICAgICAgcmV0dXJuIGUub2Zmc2V0WSArIDxudW1iZXI+ZS5jdXJyZW50VGFyZ2V0W1wib2Zmc2V0VG9wXCJdIC0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudC5vZmZzZXRUb3AgLSB0aGlzLnNjcm9sbGFibGVFbGVtZW50LnNjcm9sbFRvcDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RXZlbnQoZXZlbnQ6IERyYWdFdmVudCk6IERyYWdFdmVudCB7XHJcbiAgICAgICAgcmV0dXJuIGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSA/IGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSA6IGV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbW92ZVF1ZXN0aW9uVG8odGFyZ2V0UXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGFyZ2V0UXVlc3Rpb24gPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24odGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgIGlmIChwYWdlID09IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlICYmIGluZGV4ID09IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGFyZ2V0UXVlc3Rpb24pKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHBhZ2UpIHtcclxuICAgICAgICAgICAgcGFnZS5yZW1vdmVRdWVzdGlvbih0YXJnZXRRdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLmFkZFF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgaWYgKHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXREYXRhSW5mbyhldmVudDogRHJhZ0V2ZW50KTogYW55IHtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YShldmVudCk7XHJcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgdGV4dCA9IGRhdGEudGV4dC5zdWJzdHIoRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0Lmxlbmd0aCk7XHJcbiAgICAgICAgdmFyIGFycmF5ID0gdGV4dC5zcGxpdCgnLCcpO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB7anNvbjogbnVsbH07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGFycmF5W2ldLnNwbGl0KCc6Jyk7XHJcbiAgICAgICAgICAgIHJlc3VsdFtpdGVtWzBdXSA9IGl0ZW1bMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3VsdC5qc29uID0gZGF0YS5qc29uO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBudW1iZXIge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gKGVsZW1lbnQub2Zmc2V0VG9wIC0gZWxlbWVudC5zY3JvbGxUb3AgKyBlbGVtZW50LmNsaWVudFRvcCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZWxlbWVudC5vZmZzZXRQYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHByZXBhcmVEYXRhKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbk5hbWU6IHN0cmluZywganNvbjogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIHZhciBzdHIgPSBEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQ7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSkgc3RyICs9IFwicXVlc3Rpb250eXBlOlwiICsgcXVlc3Rpb25UeXBlICsgJywnO1xyXG4gICAgICAgIHN0ciArPSBcInF1ZXN0aW9ubmFtZTpcIiArIHF1ZXN0aW9uTmFtZTtcclxuICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIHN0ciwganNvbik7XHJcbiAgICAgICAgdmFyIHRhcmdldFF1ZXN0aW9uID0gdGhpcy5jcmVhdGVUYXJnZXRRdWVzdGlvbihxdWVzdGlvblR5cGUsIHF1ZXN0aW9uTmFtZSwganNvbik7XHJcbiAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEudGFyZ2V0UXVlc3Rpb24gPSB0YXJnZXRRdWVzdGlvbjtcclxuICAgICAgICB0aGlzLnN1cnZleVtcImtvRHJhZ2dpbmdTb3VyY2VcIl0odGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXREYXRhKGV2ZW50OiBEcmFnRXZlbnQsIHRleHQ6IHN0cmluZywganNvbjogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIGlmIChldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0pIHtcclxuICAgICAgICAgICAgZXZlbnQgPSBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJUZXh0XCIsIHRleHQpO1xyXG4gICAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuZWZmZWN0QWxsb3dlZCA9IFwiY29weVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YSA9IHsgdGV4dDogdGV4dCwganNvbjoganNvbiB9O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXREYXRhKGV2ZW50OiBEcmFnRXZlbnQpOiBhbnkge1xyXG4gICAgICAgIGlmIChldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0pIHtcclxuICAgICAgICAgICAgZXZlbnQgPSBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcIlRleHRcIik7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YS50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGE7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNsZWFyRGF0YSgpIHtcclxuICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YSA9IHt0ZXh0OiBcIlwiLCBqc29uOiBudWxsLCB0YXJnZXRRdWVzdGlvbjogbnVsbH07XHJcbiAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XHJcbiAgICAgICAgcHJldi5xdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgcHJldi54ID0gLTE7XHJcbiAgICAgICAgcHJldi55ID0gLTE7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZHJhZ2Ryb3BoZWxwZXIudHMiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcInJvb3RcIjpcIlN1cnZleVwiLFwiY29tbW9uanMyXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImNvbW1vbmpzXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImFtZFwiOlwic3VydmV5LWtub2Nrb3V0XCJ9XG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdEVkaXRvcjogc3RyaW5nID0gXCJzdHJpbmdcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBlZGl0b3JSZWdpc3RlcmVkTGlzdCA9IHt9O1xuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJFZGl0b3IobmFtZTogc3RyaW5nLCBjcmVhdG9yOiAoKSA9PiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UpIHtcbiAgICAgICAgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLmVkaXRvclJlZ2lzdGVyZWRMaXN0W25hbWVdID0gY3JlYXRvcjtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVFZGl0b3IoZWRpdG9yVHlwZTogc3RyaW5nLCBmdW5jOiAobmV3VmFsdWU6IGFueSkgPT4gYW55KTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICAgICAgdmFyIGNyZWF0b3IgPSBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbZWRpdG9yVHlwZV07XG4gICAgICAgIGlmICghY3JlYXRvcikgY3JlYXRvciA9IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5lZGl0b3JSZWdpc3RlcmVkTGlzdFtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuZGVmYXVsdEVkaXRvcl07XG4gICAgICAgIHZhciBwcm9wZXJ0eUVkaXRvciA9IGNyZWF0b3IoKTtcbiAgICAgICAgcHJvcGVydHlFZGl0b3Iub25DaGFuZ2VkID0gZnVuYztcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5RWRpdG9yO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmFsdWVfOiBhbnkgPSBudWxsO1xuICAgIHB1YmxpYyBvcHRpb25zOiBhbnkgPSBudWxsO1xuICAgIHB1YmxpYyBvbkNoYW5nZWQ6IChuZXdWYWx1ZTogYW55KSA9PiBhbnk7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyB0aHJvdyBcImVkaXRvclR5cGUgaXMgbm90IGRlZmluZWRcIjsgfVxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7IHJldHVybiB2YWx1ZTsgfVxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMudmFsdWVfOyB9XG4gICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5nZXRDb3JyZWN0ZWRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCgpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgc2V0VmFsdWVDb3JlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy52YWx1ZV8gPSB2YWx1ZTtcbiAgICB9XG4gICAgcHVibGljIHNldFRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgfVxuICAgIHB1YmxpYyBzZXRPYmplY3QodmFsdWU6IGFueSkgeyB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0Q29ycmVjdGVkVmFsdWUodmFsdWU6IGFueSk6IGFueSB7ICByZXR1cm4gdmFsdWU7ICB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5U3RyaW5nUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3RyaW5nXCI7IH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlEcm9wZG93blByb3BlcnR5RWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImRyb3Bkb3duXCI7IH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlCb29sZWFuUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiYm9vbGVhblwiOyB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5TnVtYmVyUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwibnVtYmVyXCI7IH1cbn1cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwic3RyaW5nXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVN0cmluZ1Byb3BlcnR5RWRpdG9yKCk7IH0pO1xuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwiZHJvcGRvd25cIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5RHJvcGRvd25Qcm9wZXJ0eUVkaXRvcigpOyB9KTtcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcImJvb2xlYW5cIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5Qm9vbGVhblByb3BlcnR5RWRpdG9yKCk7IH0pO1xuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwibnVtYmVyXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleU51bWJlclByb3BlcnR5RWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5pbXBvcnQge1N1cnZleUhlbHBlcn0gZnJvbSBcIi4uL3N1cnZleUhlbHBlclwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCB7U3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3JcIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRleHRJdGVtc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dGl0ZW1zXCI7IH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3RWRpdG9ySXRlbSgpOiBhbnkge1xuICAgICAgICB2YXIgb2JqcyA9IFtdO1xuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmtvSXRlbXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2Jqcy5wdXNoKHsgbmFtZTogaXRlbXNbaV0ua29OYW1lKCkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVkaXRJdGVtID0geyBrb05hbWU6IGtvLm9ic2VydmFibGUoU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgXCJ0ZXh0XCIpKSwga29UaXRsZToga28ub2JzZXJ2YWJsZSgpIH07XG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihlZGl0SXRlbSwgW10pO1xuICAgICAgICByZXR1cm4gZWRpdEl0ZW07XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVFZGl0b3JJdGVtKGl0ZW06IGFueSkge1xuICAgICAgICB2YXIgZWRpdEl0ZW0gPSB7IGtvTmFtZToga28ub2JzZXJ2YWJsZShpdGVtLm5hbWUpLCBrb1RpdGxlOiBrby5vYnNlcnZhYmxlKGl0ZW0udGl0bGUpIH07XG4gICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihlZGl0SXRlbSwgaXRlbS52YWxpZGF0b3JzKTtcbiAgICAgICAgcmV0dXJuIGVkaXRJdGVtO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgaXRlbVRleHQgPSBuZXcgU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0oZWRpdG9ySXRlbS5rb05hbWUoKSwgZWRpdG9ySXRlbS5rb1RpdGxlKCkpO1xuICAgICAgICBpdGVtVGV4dC52YWxpZGF0b3JzID0gZWRpdG9ySXRlbS52YWxpZGF0b3JzO1xuICAgICAgICByZXR1cm4gaXRlbVRleHQ7XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihpdGVtOiBhbnksIHZhbGlkYXRvcnM6IEFycmF5PGFueT4pIHtcbiAgICAgICAgaXRlbS52YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5zbGljZSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBvbkl0ZW1DaGFuZ2VkID0gZnVuY3Rpb24gKG5ld1ZhbHVlOiBhbnkpIHsgaXRlbS52YWxpZGF0b3JzID0gbmV3VmFsdWU7IGl0ZW0ua29UZXh0KHNlbGYuZ2V0VGV4dChuZXdWYWx1ZS5sZW5ndGgpKTsgfTtcbiAgICAgICAgdmFyIHByb3BlcnR5RWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9yc0VkaXRvcigpO1xuICAgICAgICBpdGVtLmVkaXRvciA9IHByb3BlcnR5RWRpdG9yO1xuICAgICAgICBwcm9wZXJ0eUVkaXRvci5vbkNoYW5nZWQgPSAobmV3VmFsdWU6IGFueSkgPT4geyBvbkl0ZW1DaGFuZ2VkKG5ld1ZhbHVlKTsgfTtcbiAgICAgICAgcHJvcGVydHlFZGl0b3Iub2JqZWN0ID0gaXRlbTtcbiAgICAgICAgcHJvcGVydHlFZGl0b3IudGl0bGUoZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLmVkaXRQcm9wZXJ0eVwiKVtcImZvcm1hdFwiXShcIlZhbGlkYXRvcnNcIikpO1xuICAgICAgICBwcm9wZXJ0eUVkaXRvci52YWx1ZSA9IGl0ZW0udmFsaWRhdG9ycztcbiAgICAgICAgaXRlbS5rb1RleHQgPSBrby5vYnNlcnZhYmxlKHRoaXMuZ2V0VGV4dCh2YWxpZGF0b3JzLmxlbmd0aCkpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldFRleHQobGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLml0ZW1zXCIpW1wiZm9ybWF0XCJdKGxlbmd0aCk7XG4gICAgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJ0ZXh0aXRlbXNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlUZXh0SXRlbXNFZGl0b3IoKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRleHRJdGVtc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlNb2RhbEVkaXRvclwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yIHtcbiAgICBwdWJsaWMga29JdGVtczogYW55O1xuICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uTW92ZVVwQ2xpY2s6IGFueTtcbiAgICBwdWJsaWMgb25Nb3ZlRG93bkNsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcbiAgICBwdWJsaWMgb25DbGVhckNsaWNrOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoaXRlbSkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlKGl0ZW0pOyB9O1xuICAgICAgICBzZWxmLm9uQ2xlYXJDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYua29JdGVtcy5yZW1vdmVBbGwoKTsgfTtcbiAgICAgICAgc2VsZi5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFkZEl0ZW0oKTsgfTtcbiAgICAgICAgc2VsZi5vbk1vdmVVcENsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5tb3ZlVXAoaXRlbSk7IH07XG4gICAgICAgIHNlbGYub25Nb3ZlRG93bkNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5tb3ZlRG93bihpdGVtKTsgfTtcbiAgICB9XG4gICAgcHVibGljIGdldFZhbHVlVGV4dCh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGxlbiA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcbiAgICAgICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5pdGVtc1wiKVtcImZvcm1hdFwiXShsZW4pO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0Q29ycmVjdGVkVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8ICFBcnJheS5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBbXTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgQWRkSXRlbSgpIHtcbiAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2godGhpcy5jcmVhdGVOZXdFZGl0b3JJdGVtKCkpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgbW92ZVVwKGl0ZW06IGFueSkge1xuICAgICAgICB2YXIgYXJyID0gdGhpcy5rb0l0ZW1zKCk7XG4gICAgICAgIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xuICAgICAgICBpZiAoaW5kZXggPCAxKSByZXR1cm47XG4gICAgICAgIGFycltpbmRleF0gPSBhcnJbaW5kZXggLSAxXTtcbiAgICAgICAgYXJyW2luZGV4IC0gMV0gPSBpdGVtO1xuICAgICAgICB0aGlzLmtvSXRlbXMoYXJyKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG1vdmVEb3duKGl0ZW06IGFueSkge1xuICAgICAgICB2YXIgYXJyID0gdGhpcy5rb0l0ZW1zKCk7XG4gICAgICAgIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IGFyci5sZW5ndGggLSAxKSByZXR1cm47XG4gICAgICAgIGFycltpbmRleF0gPSBhcnJbaW5kZXggKyAxXTtcbiAgICAgICAgYXJyW2luZGV4ICsgMV0gPSBpdGVtO1xuICAgICAgICB0aGlzLmtvSXRlbXMoYXJyKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICB0aGlzLmtvSXRlbXModGhpcy5nZXRJdGVtc0Zyb21WYWx1ZSgpKTtcbiAgICB9XG4gICAgXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zRnJvbVZhbHVlKCk6IEFycmF5PGFueT4ge1xuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaXRlbXMucHVzaCh0aGlzLmNyZWF0ZUVkaXRvckl0ZW0odmFsdWVbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbkJlZm9yZUFwcGx5KCkge1xuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgdmFyIGludGVybmFsSXRlbXMgPSB0aGlzLmtvSXRlbXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcm5hbEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtcy5wdXNoKHRoaXMuY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGludGVybmFsSXRlbXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShpdGVtcyk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdFZGl0b3JJdGVtKCk6IGFueSB7IHRocm93IFwiT3ZlcnJpZGUgJ2NyZWF0ZU5ld0VkaXRvckl0ZW0nIG1ldGhvZFwiOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7IHJldHVybiBpdGVtOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHsgIHJldHVybiBlZGl0b3JJdGVtOyAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlJdGVtc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIHB1YmxpYyBvYmplY3Q6IGFueTtcbiAgICBwdWJsaWMgdGl0bGU6IGFueTtcbiAgICBwdWJsaWMgb25BcHBseUNsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uUmVzZXRDbGljazogYW55O1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub25BcHBseUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFwcGx5KCk7IH07XG4gICAgICAgIHNlbGYub25SZXNldENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnJlc2V0KCk7IH07XG4gICAgfVxuICAgIHB1YmxpYyBzZXRUaXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGUodmFsdWUpOyB9XG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHsgfVxuICAgIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0T2JqZWN0KHZhbHVlOiBhbnkpIHsgdGhpcy5vYmplY3QgPSB2YWx1ZTsgfVxuICAgIHB1YmxpYyBnZXQgaXNFZGl0YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgcHJpdmF0ZSBhcHBseSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRXJyb3IoKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLm9uQmVmb3JlQXBwbHkoKTtcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VGV4dEVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3Ige1xuICAgIHB1YmxpYyBrb1ZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dFwiOyB9XG4gICAgcHVibGljIGdldCBpc0VkaXRhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBudWxsO1xuICAgICAgICB2YXIgc3RyID0gdmFsdWU7XG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgMjApICsgXCIuLi5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlQXBwbHkoKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKHRoaXMua29WYWx1ZSgpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUh0bWxFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRleHRFZGl0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaHRtbFwiOyB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInRleHRcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlUZXh0RWRpdG9yKCk7IH0pO1xuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwiaHRtbFwiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eUh0bWxFZGl0b3IoKTsgfSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TW9kYWxFZGl0b3IudHMiLCJleHBvcnQgdmFyIGVkaXRvckxvY2FsaXphdGlvbiA9IHtcclxuICAgIGN1cnJlbnRMb2NhbGU6IFwiXCIsXHJcbiAgICBsb2NhbGVzOiB7fSxcclxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKCFsb2NhbGUpIGxvY2FsZSA9IHRoaXMuY3VycmVudExvY2FsZTtcclxuICAgICAgICB2YXIgbG9jID0gbG9jYWxlID8gdGhpcy5sb2NhbGVzW3RoaXMuY3VycmVudExvY2FsZV0gOiBkZWZhdWx0U3RyaW5ncztcclxuICAgICAgICBpZiAoIWxvYykgbG9jID0gZGVmYXVsdFN0cmluZ3M7XHJcbiAgICAgICAgdmFyIHBhdGggPSBzdHJOYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgdmFyIG9iaiA9IGxvYztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgb2JqID0gb2JqW3BhdGhbaV1dO1xyXG4gICAgICAgICAgICBpZiAoIW9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxvYyA9PT0gZGVmYXVsdFN0cmluZ3MpIHJldHVybiBwYXRoW2ldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RyaW5nKHN0ck5hbWUsIFwiZW5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sXHJcbiAgICBnZXRQcm9wZXJ0eU5hbWU6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcsIGxvY2FsOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2V0UHJvcGVydHkoc3RyTmFtZSwgbG9jYWwpO1xyXG4gICAgICAgIGlmIChvYmpbXCJuYW1lXCJdKSByZXR1cm4gb2JqW1wibmFtZVwiXTtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuICAgIGdldFByb3BlcnR5VGl0bGU6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcsIGxvY2FsOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2V0UHJvcGVydHkoc3RyTmFtZSwgbG9jYWwpO1xyXG4gICAgICAgIGlmIChvYmpbXCJ0aXRsZVwiXSkgcmV0dXJuIG9ialtcInRpdGxlXCJdO1xyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgfSxcclxuICAgIGdldFByb3BlcnR5OiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nLCBsb2NhbDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdldFN0cmluZyhcInAuXCIgKyBzdHJOYW1lLCBsb2NhbCk7XHJcbiAgICAgICAgaWYgKG9iaiAhPT0gc3RyTmFtZSkgcmV0dXJuIG9iajtcclxuICAgICAgICB2YXIgcG9zID0gc3RyTmFtZS5pbmRleE9mKCdfJyk7XHJcbiAgICAgICAgaWYgKHBvcyA8IC0xKSByZXR1cm4gb2JqO1xyXG4gICAgICAgIHN0ck5hbWUgPSBzdHJOYW1lLnN1YnN0cihwb3MgKyAxKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdHJpbmcoXCJwLlwiICsgc3RyTmFtZSwgbG9jYWwpO1xyXG4gICAgfSxcclxuICAgIGdldExvY2FsZXM6IGZ1bmN0aW9uICgpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgICAgcmVzLnB1c2goXCJcIik7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMubG9jYWxlcykge1xyXG4gICAgICAgICAgICByZXMucHVzaChrZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHZhciBkZWZhdWx0U3RyaW5ncyA9IHtcclxuICAgIC8vc3VydmV5IHRlbXBsYXRlc1xyXG4gICAgc3VydmV5OiB7XHJcbiAgICAgICAgZHJvcFF1ZXN0aW9uOiBcIlBsZWFzZSBkcm9wIGEgcXVlc3Rpb24gaGVyZS5cIixcclxuICAgICAgICBjb3B5OiBcIkNvcHlcIixcclxuICAgICAgICBhZGRUb1Rvb2xib3g6IFwiQWRkIHRvIHRvb2xib3hcIlxyXG4gICAgfSxcclxuICAgIC8vcXVlc3Rpb25UeXBlc1xyXG4gICAgcXQ6IHtcclxuICAgICAgICBjaGVja2JveDogXCJDaGVja2JveFwiLFxyXG4gICAgICAgIGNvbW1lbnQ6IFwiQ29tbWVudFwiLFxyXG4gICAgICAgIGRyb3Bkb3duOiBcIkRyb3Bkb3duXCIsXHJcbiAgICAgICAgZmlsZTogXCJGaWxlXCIsXHJcbiAgICAgICAgaHRtbDogXCJIdG1sXCIsXHJcbiAgICAgICAgbWF0cml4OiBcIk1hdHJpeCAoc2luZ2xlIGNob2ljZSlcIixcclxuICAgICAgICBtYXRyaXhkcm9wZG93bjogXCJNYXRyaXggKG11bHRpcGxlIGNob2ljZSlcIixcclxuICAgICAgICBtYXRyaXhkeW5hbWljOiBcIk1hdHJpeCAoZHluYW1pYyByb3dzKVwiLFxyXG4gICAgICAgIG11bHRpcGxldGV4dDogXCJNdWx0aXBsZSBUZXh0XCIsXHJcbiAgICAgICAgcmFkaW9ncm91cDogXCJSYWRpb2dyb3VwXCIsXHJcbiAgICAgICAgcmF0aW5nOiBcIlJhdGluZ1wiLFxyXG4gICAgICAgIHRleHQ6IFwiU2luZ2xlIElucHV0XCJcclxuICAgIH0sXHJcbiAgICAvL1N0cmluZ3MgaW4gRWRpdG9yXHJcbiAgICBlZDoge1xyXG4gICAgICAgIG5ld1BhZ2VOYW1lOiBcInBhZ2VcIixcclxuICAgICAgICBuZXdRdWVzdGlvbk5hbWU6IFwicXVlc3Rpb25cIixcclxuICAgICAgICB0ZXN0U3VydmV5OiBcIlRlc3QgU3VydmV5XCIsXHJcbiAgICAgICAgdGVzdFN1cnZleUFnYWluOiBcIlRlc3QgU3VydmV5IEFnYWluXCIsXHJcbiAgICAgICAgdGVzdFN1cnZleVdpZHRoOiBcIlN1cnZleSB3aWR0aDogXCIsXHJcbiAgICAgICAgZW1iZWRTdXJ2ZXk6IFwiRW1iZWQgU3VydmV5XCIsXHJcbiAgICAgICAgc2F2ZVN1cnZleTogXCJTYXZlIFN1cnZleVwiLFxyXG4gICAgICAgIGRlc2lnbmVyOiBcIlN1cnZleSBEZXNpZ25lclwiLFxyXG4gICAgICAgIGpzb25FZGl0b3I6IFwiSlNPTiBFZGl0b3JcIixcclxuICAgICAgICB1bmRvOiBcIlVuZG9cIixcclxuICAgICAgICByZWRvOiBcIlJlZG9cIixcclxuICAgICAgICBvcHRpb25zOiBcIk9wdGlvbnNcIixcclxuICAgICAgICBnZW5lcmF0ZVZhbGlkSlNPTjogXCJHZW5lcmF0ZSBWYWxpZCBKU09OXCIsXHJcbiAgICAgICAgZ2VuZXJhdGVSZWFkYWJsZUpTT046IFwiR2VuZXJhdGUgUmVhZGFibGUgSlNPTlwiLFxyXG4gICAgICAgIHRvb2xib3g6IFwiVG9vbGJveFwiLFxyXG4gICAgICAgIGRlbFNlbE9iamVjdDogXCJEZWxldGUgc2VsZWN0ZWQgb2JqZWN0XCIsXHJcbiAgICAgICAgY29ycmVjdEpTT046IFwiUGxlYXNlIGNvcnJlY3QgSlNPTi5cIixcclxuICAgICAgICBzdXJ2ZXlSZXN1bHRzOiBcIlN1cnZleSBSZXN1bHQ6IFwiXHJcbiAgICB9LFxyXG4gICAgLy9Qcm9wZXJ0eSBFZGl0b3JzXHJcbiAgICBwZToge1xyXG4gICAgICAgIGFwcGx5OiBcIkFwcGx5XCIsXHJcbiAgICAgICAgcmVzZXQ6IFwiUmVzZXRcIixcclxuICAgICAgICBjbG9zZTogXCJDbG9zZVwiLFxyXG4gICAgICAgIGRlbGV0ZTogXCJEZWxldGVcIixcclxuICAgICAgICBhZGROZXc6IFwiQWRkIE5ld1wiLFxyXG4gICAgICAgIHJlbW92ZUFsbDogXCJSZW1vdmUgQWxsXCIsXHJcbiAgICAgICAgZWRpdDogXCJFZGl0XCIsXHJcbiAgICAgICAgZW1wdHk6IFwiPGVtcHR5PlwiLFxyXG4gICAgICAgIHRlc3RTZXJ2aWNlOiBcIlRlc3QgdGhlIHNlcnZpY2VcIixcclxuXHJcbiAgICAgICAgdmFsdWU6IFwiVmFsdWVcIixcclxuICAgICAgICB0ZXh0OiBcIlRleHRcIixcclxuICAgICAgICByZXF1aXJlZDogXCJSZXF1aXJlZD9cIixcclxuICAgICAgICBoYXNPdGhlcjogXCJIYXMgT3RoZXIgSXRlbVwiLFxyXG4gICAgICAgIG5hbWU6IFwiTmFtZVwiLFxyXG4gICAgICAgIHRpdGxlOiBcIlRpdGxlXCIsXHJcbiAgICAgICAgY2VsbFR5cGU6IFwiQ2VsbCBUeXBlXCIsXHJcbiAgICAgICAgY29sQ291bnQ6IFwiQ29sdW1uIENvdW50XCIsXHJcblxyXG4gICAgICAgIGVkaXRQcm9wZXJ0eTogXCJFZGl0IHByb3BlcnR5ICd7MH0nXCIsXHJcbiAgICAgICAgaXRlbXM6IFwiWyBJdGVtczogezB9IF1cIixcclxuXHJcbiAgICAgICAgZW50ZXJOZXdWYWx1ZTogXCJQbGVhc2UsIGVudGVyIHRoZSB2YWx1ZS5cIixcclxuICAgICAgICBub3F1ZXN0aW9uczogXCJUaGVyZSBpcyBubyBhbnkgcXVlc3Rpb24gaW4gdGhlIHN1cnZleS5cIixcclxuICAgICAgICBjcmVhdGV0cmlnZ2VyOiBcIlBsZWFzZSBjcmVhdGUgYSB0cmlnZ2VyXCIsXHJcbiAgICAgICAgdHJpZ2dlck9uOiBcIk9uIFwiLFxyXG4gICAgICAgIHRyaWdnZXJNYWtlUGFnZXNWaXNpYmxlOiBcIk1ha2UgcGFnZXMgdmlzaWJsZTpcIixcclxuICAgICAgICB0cmlnZ2VyTWFrZVF1ZXN0aW9uc1Zpc2libGU6IFwiTWFrZSBxdWVzdGlvbnMgdmlzaWJsZTpcIixcclxuICAgICAgICB0cmlnZ2VyQ29tcGxldGVUZXh0OiBcIkNvbXBsZXRlIHRoZSBzdXJ2ZXkgaWYgc3VjY2VlZC5cIixcclxuICAgICAgICB0cmlnZ2VyTm90U2V0OiBcIlRoZSB0cmlnZ2VyIGlzIG5vdCBzZXRcIixcclxuICAgICAgICB0cmlnZ2VyUnVuSWY6IFwiUnVuIGlmXCIsXHJcbiAgICAgICAgdHJpZ2dlclNldFRvTmFtZTogXCJDaGFuZ2UgdmFsdWUgb2Y6IFwiLFxyXG4gICAgICAgIHRyaWdnZXJTZXRWYWx1ZTogXCJ0bzogXCIsXHJcbiAgICAgICAgdHJpZ2dlcklzVmFyaWFibGU6IFwiRG8gbm90IHB1dCB0aGUgdmFyaWFibGUgaW50byB0aGUgc3VydmV5IHJlc3VsdC5cIixcclxuICAgICAgICB2ZXJiQ2hhbmdlVHlwZTogXCJDaGFuZ2UgdHlwZSBcIixcclxuICAgICAgICB2ZXJiQ2hhbmdlUGFnZTogXCJDaGFuZ2UgcGFnZSBcIlxyXG4gICAgfSxcclxuICAgIC8vT3BlcmF0b3JzXHJcbiAgICBvcDoge1xyXG4gICAgICAgIGVtcHR5OiBcImlzIGVtcHR5XCIsXHJcbiAgICAgICAgbm90ZW1wdHk6IFwiaXMgbm90IGVtcHR5XCIsXHJcbiAgICAgICAgZXF1YWw6IFwiZXF1YWxzXCIsXHJcbiAgICAgICAgbm90ZXF1YWw6IFwibm90IGVxdWFsc1wiLFxyXG4gICAgICAgIGNvbnRhaW5zOiBcImNvbnRhaW5zXCIsXHJcbiAgICAgICAgbm90Y29udGFpbnM6IFwibm90IGNvbnRhaW5zXCIsXHJcbiAgICAgICAgZ3JlYXRlcjogXCJncmVhdGVyXCIsXHJcbiAgICAgICAgbGVzczogXCJsZXNzXCIsXHJcbiAgICAgICAgZ3JlYXRlcm9yZXF1YWw6IFwiZ3JlYXRlciBvciBlcXVhbHNcIixcclxuICAgICAgICBsZXNzb3JlcXVhbDogXCJMZXNzIG9yIEVxdWFsc1wiXHJcbiAgICB9LFxyXG4gICAgLy9FbWJlZCB3aW5kb3dcclxuICAgIGV3OiB7XHJcbiAgICAgICAga25vY2tvdXQ6IFwiVXNlIEtub2Nrb3V0IHZlcnNpb25cIixcclxuICAgICAgICByZWFjdDogXCJVc2UgUmVhY3QgdmVyc2lvblwiLFxyXG4gICAgICAgIGJvb3RzdHJhcDogXCJGb3IgYm9vdHN0cmFwIGZyYW1ld29ya1wiLFxyXG4gICAgICAgIHN0YW5kYXJkOiBcIk5vIGJvb3RzdHJhcFwiLFxyXG4gICAgICAgIHNob3dPblBhZ2U6IFwiU2hvdyBzdXJ2ZXkgb24gYSBwYWdlXCIsXHJcbiAgICAgICAgc2hvd0luV2luZG93OiBcIlNob3cgc3VydmV5IGluIGEgd2luZG93XCIsXHJcbiAgICAgICAgbG9hZEZyb21TZXJ2ZXI6IFwiTG9hZCBTdXJ2ZXkgSlNPTiBmcm9tIHNlcnZlclwiLFxyXG4gICAgICAgIHRpdGxlU2NyaXB0OiBcIlNjcmlwdHMgYW5kIHN0eWxlc1wiLFxyXG4gICAgICAgIHRpdGxlSHRtbDogXCJIVE1MXCIsXHJcbiAgICAgICAgdGl0bGVKYXZhU2NyaXB0OiBcIkphdmFTY3JpcHRcIlxyXG4gICAgfSxcclxuICAgIC8vUHJvcGVydGllc1xyXG4gICAgcDoge1xyXG4gICAgICAgIG5hbWU6IFwibmFtZVwiLFxyXG4gICAgICAgIHRpdGxlOiB7IG5hbWU6IFwidGl0bGVcIiwgdGl0bGU6IFwiTGVhdmUgaXQgZW1wdHksIGlmIGl0IGlzIHRoZSBzYW1lIGFzICdOYW1lJ1wiIH0sXHJcbiAgICAgICAgc3VydmV5X3RpdGxlOiB7IG5hbWU6IFwidGl0bGVcIiwgdGl0bGU6IFwiSXQgd2lsbCBiZSBzaG93biBvbiBldmVyeSBwYWdlLlwiIH0sXHJcbiAgICAgICAgcGFnZV90aXRsZTogeyBuYW1lOiBcInRpdGxlXCIsIHRpdGxlOiBcIlBhZ2UgdGl0bGVcIiB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5lZGl0b3JMb2NhbGl6YXRpb24ubG9jYWxlc1tcImVuXCJdID0gZGVmYXVsdFN0cmluZ3M7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkaXRvckxvY2FsaXphdGlvbi50cyIsImltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBlbnVtIE9ialR5cGUgeyBVbmtub3duLCBTdXJ2ZXksIFBhZ2UsIFF1ZXN0aW9uIH1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlIZWxwZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV3UGFnZU5hbWUob2JqczogQXJyYXk8YW55Pikge1xuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcImVkLm5ld1BhZ2VOYW1lXCIpKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXROZXdRdWVzdGlvbk5hbWUob2JqczogQXJyYXk8YW55Pikge1xuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcImVkLm5ld1F1ZXN0aW9uTmFtZVwiKSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV3TmFtZShvYmpzOiBBcnJheTxhbnk+LCBiYXNlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhhc2ggPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoW29ianNbaV0ubmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBudW0gPSAxO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKCFoYXNoW2Jhc2VOYW1lICsgbnVtLnRvU3RyaW5nKCldKSBicmVhaztcbiAgICAgICAgICAgIG51bSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXNlTmFtZSArIG51bS50b1N0cmluZygpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldE9iamVjdFR5cGUob2JqOiBhbnkpOiBPYmpUeXBlIHtcbiAgICAgICAgaWYgKCFvYmogfHwgIW9ialtcImdldFR5cGVcIl0pIHJldHVybiBPYmpUeXBlLlVua25vd247XG4gICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09IFwicGFnZVwiKSByZXR1cm4gT2JqVHlwZS5QYWdlO1xuICAgICAgICBpZiAob2JqLmdldFR5cGUoKSA9PSBcInN1cnZleVwiKSByZXR1cm4gT2JqVHlwZS5TdXJ2ZXk7XG4gICAgICAgIGlmIChvYmpbXCJuYW1lXCJdKSByZXR1cm4gT2JqVHlwZS5RdWVzdGlvbjtcbiAgICAgICAgcmV0dXJuIE9ialR5cGUuVW5rbm93bjtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3ROYW1lKG9iajogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG9ialtcIm5hbWVcIl0pIHJldHVybiBvYmpbXCJuYW1lXCJdO1xuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XG4gICAgICAgIGlmIChvYmpUeXBlICE9IE9ialR5cGUuUGFnZSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHZhciBkYXRhID0gPFN1cnZleS5TdXJ2ZXk+KDxTdXJ2ZXkuUGFnZT5vYmopLmRhdGE7XG4gICAgICAgIHZhciBpbmRleCA9IGRhdGEucGFnZXMuaW5kZXhPZig8U3VydmV5LlBhZ2U+b2JqKTtcbiAgICAgICAgcmV0dXJuIFwiW1BhZ2UgXCIgKyAoaW5kZXggKyAxKSArIFwiXVwiO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3VydmV5SGVscGVyLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5pbXBvcnQge1N1cnZleU9iamVjdEVkaXRvcn0gZnJvbSBcIi4uL29iamVjdEVkaXRvclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmFsaWRhdG9yc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3Ige1xuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RFZGl0b3I6IFN1cnZleU9iamVjdEVkaXRvcjtcbiAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xuICAgIHB1YmxpYyBhdmFpbGFibGVWYWxpZGF0b3JzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHJpdmF0ZSB2YWxpZGF0b3JDbGFzc2VzOiBBcnJheTxTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3M+ID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvciA9IG5ldyBTdXJ2ZXlPYmplY3RFZGl0b3IoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdEVkaXRvci5zZWxlY3RlZE9iamVjdCA9IG5ld1ZhbHVlICE9IG51bGwgPyBuZXdWYWx1ZS52YWxpZGF0b3IgOiBudWxsOyB9KTtcbiAgICAgICAgdGhpcy52YWxpZGF0b3JDbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic3VydmV5dmFsaWRhdG9yXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVZhbGlkYXRvcnMgPSB0aGlzLmdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTtcbiAgICAgICAgdGhpcy5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlKHNlbGYua29TZWxlY3RlZCgpKTsgfTtcbiAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKHZhbGlkYXRvclR5cGUpIHsgc2VsZi5hZGRJdGVtKHZhbGlkYXRvclR5cGUpOyB9O1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmFsaWRhdG9yc1wiOyB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xuICAgICAgICBpZiAodGhpcy5rb1NlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5rb0l0ZW1zKCkubGVuZ3RoID4gMCA/IHRoaXMua29JdGVtcygpWzBdIDogbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7XG4gICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XG4gICAgICAgIHZhciB2YWxpZGF0b3IgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhpdGVtLmdldFR5cGUoKSk7XG4gICAgICAgIGpzb25PYmoudG9PYmplY3QoaXRlbSwgdmFsaWRhdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0odmFsaWRhdG9yKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSA8U3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtPmVkaXRvckl0ZW07XG4gICAgICAgIHJldHVybiBpdGVtLnZhbGlkYXRvcjtcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRJdGVtKHZhbGlkYXRvclR5cGU6IHN0cmluZykge1xuICAgICAgICB2YXIgbmV3VmFsaWRhdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbShTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh2YWxpZGF0b3JUeXBlKSk7XG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKG5ld1ZhbGlkYXRvcik7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZChuZXdWYWxpZGF0b3IpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhbGlkYXRvckNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudmFsaWRhdG9yQ2xhc3Nlc1tpXS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcml2YXRlIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9iajogYW55LCBuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmtvU2VsZWN0ZWQoKSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIHRoaXMua29TZWxlY3RlZCgpLnZhbGlkYXRvcltwcm9wZXJ0eS5uYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSB7XG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsaWRhdG9yOiBTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHZhbGlkYXRvci5nZXRUeXBlKCk7XG4gICAgfVxufVxuXG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInZhbGlkYXRvcnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlPYmplY3RQcm9wZXJ0eX0gZnJvbSBcIi4vb2JqZWN0UHJvcGVydHlcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RFZGl0b3Ige1xuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RWYWx1ZTogYW55O1xuICAgIHB1YmxpYyBwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSA9IG51bGw7XG4gICAgcHVibGljIGtvUHJvcGVydGllczogYW55O1xuICAgIHB1YmxpYyBrb0FjdGl2ZVByb3BlcnR5OiBhbnk7XG4gICAgcHVibGljIGtvSGFzT2JqZWN0OiBhbnk7XG4gICAgcHVibGljIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQ6IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XG4gICAgcHVibGljIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKHByb3BlcnR5RWRpdG9yT3B0aW9ucyk7XG4gICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb0hhc09iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBzZWxlY3RlZE9iamVjdCgpOiBhbnkgeyByZXR1cm4gdGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlOyB9XG4gICAgcHVibGljIHNldCBzZWxlY3RlZE9iamVjdCh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5rb0hhc09iamVjdCh2YWx1ZSAhPSBudWxsKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKTtcbiAgICB9XG4gICAgcHVibGljIHNldE9wdGlvbnMocHJvcGVydHlFZGl0b3JPcHRpb25zOiBhbnkpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvck9wdGlvbnMgPSBwcm9wZXJ0eUVkaXRvck9wdGlvbnM7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRQcm9wZXJ0eUVkaXRvcihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHB1YmxpYyBjaGFuZ2VBY3RpdmVQcm9wZXJ0eShwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHkpIHtcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KHByb3BlcnR5KTtcbiAgICB9XG4gICAgcHVibGljIE9iamVjdENoYW5nZWQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgdXBkYXRlUHJvcGVydGllcygpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkT2JqZWN0IHx8ICF0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzKFtdKTtcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eShudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXModGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKCkpO1xuICAgICAgICBwcm9wZXJ0aWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLm5hbWUgPT0gYi5uYW1lKSByZXR1cm4gMDtcbiAgICAgICAgICAgIGlmIChhLm5hbWUgPiBiLm5hbWUpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG9iamVjdFByb3BlcnRpZXMgPSBbXTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcHJvcEV2ZW50ID0gKHByb3BlcnR5OiBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSwgbmV3VmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyBwcm9wZXJ0eTogcHJvcGVydHkucHJvcGVydHksIG9iamVjdDogcHJvcGVydHkub2JqZWN0LCBuZXdWYWx1ZTogbmV3VmFsdWUgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNhblNob3dQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKSkgY29udGludWU7XG4gICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydHkgPSBuZXcgU3VydmV5T2JqZWN0UHJvcGVydHkocHJvcGVydGllc1tpXSwgcHJvcEV2ZW50LCB0aGlzLnByb3BlcnR5RWRpdG9yT3B0aW9ucyk7XG4gICAgICAgICAgICB2YXIgbG9jTmFtZSA9IHRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpICsgJ18nICsgcHJvcGVydGllc1tpXS5uYW1lO1xuICAgICAgICAgICAgb2JqZWN0UHJvcGVydHkuZGlzcGxheU5hbWUgPSBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0UHJvcGVydHlOYW1lKGxvY05hbWUpO1xuICAgICAgICAgICAgdmFyIHRpdGxlID0gZWRpdG9yTG9jYWxpemF0aW9uLmdldFByb3BlcnR5VGl0bGUobG9jTmFtZSk7XG4gICAgICAgICAgICBpZiAoIXRpdGxlKSB0aXRsZSA9IG9iamVjdFByb3BlcnR5LmRpc3BsYXlOYW1lO1xuICAgICAgICAgICAgb2JqZWN0UHJvcGVydHkudGl0bGUgPSB0aXRsZTtcbiAgICAgICAgICAgIG9iamVjdFByb3BlcnRpZXMucHVzaChvYmplY3RQcm9wZXJ0eSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMob2JqZWN0UHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSh0aGlzLmdldFByb3BlcnR5RWRpdG9yKFwibmFtZVwiKSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjYW5TaG93UHJvcGVydHkocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xuICAgICAgICBpZiAobmFtZSA9PSAncXVlc3Rpb25zJyB8fCBuYW1lID09ICdwYWdlcycpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMub25DYW5TaG93UHJvcGVydHlDYWxsYmFjaykgcmV0dXJuIHRoaXMub25DYW5TaG93UHJvcGVydHlDYWxsYmFjayh0aGlzLnNlbGVjdGVkT2JqZWN0LCBwcm9wZXJ0eSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgdXBkYXRlUHJvcGVydGllc09iamVjdCgpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXNbaV0ub2JqZWN0ID0gdGhpcy5zZWxlY3RlZE9iamVjdDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb2JqZWN0RWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSB7XG4gICAgcHJpdmF0ZSBvYmplY3RWYWx1ZTogYW55O1xuICAgIHByaXZhdGUgaXNWYWx1ZVVwZGF0aW5nOiBib29sZWFuO1xuICAgIHByaXZhdGUgb25Qcm9wZXJ0eUNoYW5nZWQ6IFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2s7XG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgZGlzcGxheU5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgdGl0bGU6IHN0cmluZztcbiAgICBwdWJsaWMga29WYWx1ZTogYW55O1xuICAgIHB1YmxpYyBrb1RleHQ6IGFueTtcbiAgICBwdWJsaWMgbW9kYWxOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIG1vZGFsTmFtZVRhcmdldDogc3RyaW5nO1xuICAgIHB1YmxpYyBrb0lzRGVmYXVsdDogYW55O1xuICAgIHB1YmxpYyBlZGl0b3I6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZTtcbiAgICBwdWJsaWMgZWRpdG9yVHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBiYXNlRWRpdG9yVHlwZTogc3RyaW5nO1xuICAgIHB1YmxpYyBjaG9pY2VzOiBBcnJheTxhbnk+O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvblByb3BlcnR5Q2hhbmdlZDogU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IG51bGwsIHByb3BlcnR5RWRpdG9yT3B0aW9uczogYW55ID0gbnVsbCkge1xuICAgICAgICB0aGlzLm9uUHJvcGVydHlDaGFuZ2VkID0gb25Qcm9wZXJ0eUNoYW5nZWQ7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMucHJvcGVydHkubmFtZTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmNob2ljZXMgPSBwcm9wZXJ0eS5jaG9pY2VzO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IHByb3BlcnR5LnR5cGU7XG4gICAgICAgIC8vVE9ET1xuICAgICAgICBpZiAodGhpcy5jaG9pY2VzICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IFwiZHJvcGRvd25cIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IHNlbGYub25BcHBseUVkaXRvclZhbHVlKG5ld1ZhbHVlKTsgfTtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuY3JlYXRlRWRpdG9yKHRoaXMuZWRpdG9yVHlwZSwgb25JdGVtQ2hhbmdlZCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLm9wdGlvbnMgPSBwcm9wZXJ0eUVkaXRvck9wdGlvbnM7XG4gICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IHRoaXMuZWRpdG9yLmVkaXRvclR5cGU7XG4gICAgICAgIHRoaXMubW9kYWxOYW1lID0gXCJtb2RlbEVkaXRvclwiICsgdGhpcy5lZGl0b3JUeXBlICsgdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLm1vZGFsTmFtZVRhcmdldCA9IFwiI1wiICsgdGhpcy5tb2RhbE5hbWU7XG4gICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYub25rb1ZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xuICAgICAgICB0aGlzLmtvVGV4dCA9IGtvLmNvbXB1dGVkKCgpID0+IHsgcmV0dXJuIHNlbGYuZ2V0VmFsdWVUZXh0KHNlbGYua29WYWx1ZSgpKTsgfSk7XG4gICAgICAgIHRoaXMua29Jc0RlZmF1bHQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLnByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHNlbGYua29WYWx1ZSgpKTsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgb2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLm9iamVjdFZhbHVlOyB9XG4gICAgcHVibGljIHNldCBvYmplY3QodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLm9iamVjdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUoKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlKCkge1xuICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRPYmplY3QodGhpcy5vYmplY3QpO1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRUaXRsZShlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuZWRpdFByb3BlcnR5XCIpW1wiZm9ybWF0XCJdKHRoaXMucHJvcGVydHkubmFtZSkpO1xuICAgICAgICB0aGlzLnVwZGF0ZUVkaXRvckRhdGEodGhpcy5rb1ZhbHVlKCkpO1xuICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBwcml2YXRlIGlzQXBwbHlpbmdOZXdWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgb25BcHBseUVkaXRvclZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5pc0FwcGx5aW5nTmV3VmFsdWUgPSB0cnVlO1xuICAgICAgICB0aGlzLmtvVmFsdWUobmV3VmFsdWUpO1xuICAgICAgICB0aGlzLmlzQXBwbHlpbmdOZXdWYWx1ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBwcml2YXRlIG9ua29WYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBcHBseWluZ05ld1ZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUVkaXRvckRhdGEobmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9iamVjdCA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLm9iamVjdFt0aGlzLm5hbWVdID09IG5ld1ZhbHVlKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLm9uUHJvcGVydHlDaGFuZ2VkICE9IG51bGwgJiYgIXRoaXMuaXNWYWx1ZVVwZGF0aW5nKSB0aGlzLm9uUHJvcGVydHlDaGFuZ2VkKHRoaXMsIG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgcHJpdmF0ZSB1cGRhdGVFZGl0b3JEYXRhKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5lZGl0b3IudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldFZhbHVlKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUpIHJldHVybiB0aGlzLnByb3BlcnR5LmdldFZhbHVlKHRoaXMub2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0W3RoaXMubmFtZV07XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7IHJldHVybiB0aGlzLmVkaXRvci5nZXRWYWx1ZVRleHQodmFsdWUpOyB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29iamVjdFByb3BlcnR5LnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIml0ZW12YWx1ZXNcIjsgfVxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua29JdGVtcygpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMua29JdGVtcygpW2ldO1xuICAgICAgICAgICAgaXRlbS5rb0hhc0Vycm9yKCFpdGVtLmtvVmFsdWUoKSk7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwgaXRlbS5rb0hhc0Vycm9yKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld0VkaXRvckl0ZW0oKTogYW55IHsgcmV0dXJuIHsga29WYWx1ZToga28ub2JzZXJ2YWJsZSgpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUoKSwga29IYXNFcnJvcjoga28ub2JzZXJ2YWJsZShmYWxzZSkgfTsgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVFZGl0b3JJdGVtKGl0ZW06IGFueSkge1xuICAgICAgICB2YXIgaXRlbVZhbHVlID0gaXRlbTtcbiAgICAgICAgdmFyIGl0ZW1UZXh0ID0gbnVsbDtcbiAgICAgICAgaWYgKGl0ZW0udmFsdWUpIHtcbiAgICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW0udmFsdWU7XG4gICAgICAgICAgICBpdGVtVGV4dCA9IGl0ZW0udGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKGl0ZW1WYWx1ZSksIGtvVGV4dDoga28ub2JzZXJ2YWJsZShpdGVtVGV4dCksIGtvSGFzRXJyb3I6IGtvLm9ic2VydmFibGUoZmFsc2UpIH07XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oZWRpdG9ySXRlbTogYW55KSB7XG4gICAgICAgIHZhciBhbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnMgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmFsd2F5U2F2ZVRleHRJblByb3BlcnR5RWRpdG9ycztcbiAgICAgICAgdmFyIHRleHQgPSBlZGl0b3JJdGVtLmtvVGV4dCgpO1xuICAgICAgICBpZiAoIWFsd2F5U2F2ZVRleHRJblByb3BlcnR5RWRpdG9ycyAmJiBlZGl0b3JJdGVtLmtvVGV4dCgpID09IGVkaXRvckl0ZW0ua29WYWx1ZSgpKSB7XG4gICAgICAgICAgICB0ZXh0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWx1ZTogZWRpdG9ySXRlbS5rb1ZhbHVlKCksIHRleHQ6IHRleHQgfTtcbiAgICB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIml0ZW12YWx1ZXNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlEcm9wZG93bkNvbHVtbnNFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIm1hdHJpeGRyb3Bkb3duY29sdW1uc1wiOyB9XG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rb0l0ZW1zKCkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB0aGlzLmtvSXRlbXMoKVtpXS5oYXNFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdFZGl0b3JJdGVtKCk6IGFueSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtKG5ldyBTdXJ2ZXkuTWF0cml4RHJvcGRvd25Db2x1bW4oXCJcIiwgdGhpcy5vcHRpb25zKSk7IH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0l0ZW0oaXRlbSwgdGhpcy5vcHRpb25zKTsgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oZWRpdG9ySXRlbTogYW55KSB7XG4gICAgICAgIHZhciBjb2x1bUl0ZW0gPSA8U3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtPmVkaXRvckl0ZW07XG4gICAgICAgIGNvbHVtSXRlbS5hcHBseSgpO1xuICAgICAgICByZXR1cm4gY29sdW1JdGVtLmNvbHVtbjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0l0ZW0ge1xuICAgIHByaXZhdGUga29DaG9pY2VzOiBhbnk7XG4gICAgcHVibGljIGNob2ljZXNFZGl0b3I6IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcjtcbiAgICBrb05hbWU6IGFueTsga29UaXRsZTogYW55OyBrb0NlbGxUeXBlOiBhbnk7IGtvU2hvd0Nob2ljZXM6IGFueTtcbiAgICBrb0hhc0Vycm9yOiBhbnk7IGtvQ29sQ291bnQ6IGFueTsga29Jc1JlcXVpcmVkOiBhbnk7IGtvSGFzT3RoZXI6IGFueTtcbiAgICBrb0hhc0Nob2ljZXM6IGFueTsga29IYXNDb2xDb3VudDogYW55O1xuICAgIHB1YmxpYyBvblNob3dDaG9pY2VzQ2xpY2s6IGFueTtcbiAgICBwdWJsaWMgY2VsbFR5cGVDaG9pY2VzOiBBcnJheTxhbnk+O1xuICAgIHB1YmxpYyBjb2xDb3VudENob2ljZXM6IEFycmF5PGFueT47XG4gICAgY29uc3RydWN0b3IocHVibGljIGNvbHVtbjogU3VydmV5Lk1hdHJpeERyb3Bkb3duQ29sdW1uLCBwdWJsaWMgb3B0aW9ucyA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jZWxsVHlwZUNob2ljZXMgPSB0aGlzLmdldFByb3BlcnR5Q2hvaWNlcyhcImNlbGxUeXBlXCIpO1xuICAgICAgICB0aGlzLmNvbENvdW50Q2hvaWNlcyA9IHRoaXMuZ2V0UHJvcGVydHlDaG9pY2VzKFwiY29sQ291bnRcIik7XG4gICAgICAgIHRoaXMua29OYW1lID0ga28ub2JzZXJ2YWJsZShjb2x1bW4ubmFtZSk7XG4gICAgICAgIHRoaXMua29DZWxsVHlwZSA9IGtvLm9ic2VydmFibGUoY29sdW1uLmNlbGxUeXBlKTtcbiAgICAgICAgdGhpcy5rb0NvbENvdW50ID0ga28ub2JzZXJ2YWJsZShjb2x1bW4uY29sQ291bnQpO1xuICAgICAgICB0aGlzLmtvSXNSZXF1aXJlZCA9IGtvLm9ic2VydmFibGUoY29sdW1uLmlzUmVxdWlyZWQgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgICB0aGlzLmtvSGFzT3RoZXIgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5oYXNPdGhlciA/IHRydWUgOiBmYWxzZSk7XG4gICAgICAgIHRoaXMua29UaXRsZSA9IGtvLm9ic2VydmFibGUoY29sdW1uLm5hbWUgPT09IGNvbHVtbi50aXRsZSA/IFwiXCIgOiBjb2x1bW4udGl0bGUpO1xuICAgICAgICB0aGlzLmtvU2hvd0Nob2ljZXMgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb0Nob2ljZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoY29sdW1uLmNob2ljZXMpO1xuICAgICAgICB0aGlzLmtvSGFzRXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuICAgICAgICB0aGlzLmNob2ljZXNFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yKCk7XG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vYmplY3QgPSB0aGlzLmNvbHVtbjtcbiAgICAgICAgdGhpcy5jaG9pY2VzRWRpdG9yLnZhbHVlID0gdGhpcy5rb0Nob2ljZXMoKTtcbiAgICAgICAgdGhpcy5jaG9pY2VzRWRpdG9yLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm9uU2hvd0Nob2ljZXNDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb1Nob3dDaG9pY2VzKCFzZWxmLmtvU2hvd0Nob2ljZXMoKSk7IH1cbiAgICAgICAgdGhpcy5rb0hhc0Nob2ljZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcImRyb3Bkb3duXCIgfHwgc2VsZi5rb0NlbGxUeXBlKCkgPT0gXCJjaGVja2JveFwiIHx8IHNlbGYua29DZWxsVHlwZSgpID09IFwicmFkaW9ncm91cFwiOyB9KTtcbiAgICAgICAgdGhpcy5rb0hhc0NvbENvdW50ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5rb0NlbGxUeXBlKCkgPT0gXCJjaGVja2JveFwiIHx8IHNlbGYua29DZWxsVHlwZSgpID09IFwicmFkaW9ncm91cFwiOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xuICAgICAgICB0aGlzLmtvSGFzRXJyb3IoIXRoaXMua29OYW1lKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5rb0hhc0Vycm9yKCkgfHwgdGhpcy5jaG9pY2VzRWRpdG9yLmhhc0Vycm9yKCk7XG4gICAgfVxuICAgIHB1YmxpYyBhcHBseSgpIHtcbiAgICAgICAgdGhpcy5jb2x1bW4ubmFtZSA9IHRoaXMua29OYW1lKCk7XG4gICAgICAgIHRoaXMuY29sdW1uLnRpdGxlID0gdGhpcy5rb1RpdGxlKCk7XG4gICAgICAgIHRoaXMuY29sdW1uLmNlbGxUeXBlID0gdGhpcy5rb0NlbGxUeXBlKCk7XG4gICAgICAgIHRoaXMuY29sdW1uLmNvbENvdW50ID0gdGhpcy5rb0NvbENvdW50KCk7XG4gICAgICAgIHRoaXMuY29sdW1uLmlzUmVxdWlyZWQgPSB0aGlzLmtvSXNSZXF1aXJlZCgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5oYXNPdGhlciA9IHRoaXMua29IYXNPdGhlcigpO1xuXG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vbkFwcGx5Q2xpY2soKTtcbiAgICAgICAgdGhpcy5jb2x1bW4uY2hvaWNlcyA9IHRoaXMuY2hvaWNlc0VkaXRvci52YWx1ZTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRQcm9wZXJ0eUNob2ljZXMocHJvcGV0eU5hbWU6IHN0cmluZyk6IEFycmF5PGFueT4ge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMoXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IHByb3BldHlOYW1lKSByZXR1cm4gcHJvcGVydGllc1tpXS5jaG9pY2VzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIm1hdHJpeGRyb3Bkb3duY29sdW1uc1wiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eURyb3Bkb3duQ29sdW1uc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eU1vZGFsRWRpdG9yXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5UmVzdWx0ZnVsbEVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3Ige1xuICAgIGtvVXJsOiBhbnk7IGtvUGF0aDogYW55OyBrb1ZhbHVlTmFtZTogYW55OyBrb1RpdGxlTmFtZTogYW55O1xuICAgIHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXk7XG4gICAgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25Ecm9wZG93bjtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmtvVXJsID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmtvUGF0aCA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlTmFtZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb1RpdGxlTmFtZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdXJ2ZXkoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmtvVXJsLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5xdWVzdGlvbi5jaG9pY2VzQnlVcmwudXJsID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgICAgICB0aGlzLmtvUGF0aC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnBhdGggPSBuZXdWYWx1ZTsgc2VsZi5ydW4oKTsgfSk7XG4gICAgICAgIHRoaXMua29WYWx1ZU5hbWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnF1ZXN0aW9uLmNob2ljZXNCeVVybC52YWx1ZU5hbWUgPSBuZXdWYWx1ZTsgc2VsZi5ydW4oKTsgfSk7XG4gICAgICAgIHRoaXMua29UaXRsZU5hbWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnF1ZXN0aW9uLmNob2ljZXNCeVVybC50aXRsZU5hbWUgPSBuZXdWYWx1ZTsgc2VsZi5ydW4oKTsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJyZXN0ZnVsbFwiOyB9XG4gICAgcHVibGljIGdldCByZXN0ZnVsbFZhbHVlKCkgeyByZXR1cm4gPFN1cnZleS5DaG9pY2VzUmVzdGZ1bGw+dGhpcy52YWx1ZTsgfVxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdmFsdWUgfHwgIXZhbHVlLnVybCkgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5lbXB0eVwiKTtcbiAgICAgICAgdmFyIHN0ciA9IHZhbHVlLnVybDtcbiAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAyMCkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCAyMCkgKyBcIi4uLlwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMucmVzdGZ1bGxWYWx1ZTtcbiAgICAgICAgdGhpcy5rb1VybCh2YWwgPyB2YWwudXJsIDogXCJcIik7XG4gICAgICAgIHRoaXMua29QYXRoKHZhbCA/IHZhbC5wYXRoIDogXCJcIik7XG4gICAgICAgIHRoaXMua29WYWx1ZU5hbWUodmFsID8gdmFsLnZhbHVlTmFtZSA6IFwiXCIpO1xuICAgICAgICB0aGlzLmtvVGl0bGVOYW1lKHZhbCA/IHZhbC50aXRsZU5hbWUgOiBcIlwiKTtcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKFwicmVzdGZ1bGxTdXJ2ZXlcIik7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbkJlZm9yZUFwcGx5KCkge1xuICAgICAgICB2YXIgdmFsID0gbmV3IFN1cnZleS5DaG9pY2VzUmVzdGZ1bGwoKTtcbiAgICAgICAgdmFsLnVybCA9IHRoaXMua29VcmwoKTtcbiAgICAgICAgdmFsLnBhdGggPSB0aGlzLmtvUGF0aCgpO1xuICAgICAgICB2YWwudmFsdWVOYW1lID0gdGhpcy5rb1ZhbHVlTmFtZSgpO1xuICAgICAgICB2YWwudGl0bGVOYW1lID0gdGhpcy5rb1RpdGxlTmFtZSgpO1xuICAgICAgICB0aGlzLnNldFZhbHVlQ29yZSh2YWwpO1xuICAgIH1cbiAgICBwcml2YXRlIHJ1bigpIHtcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5jaG9pY2VzQnlVcmwucnVuKCk7XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlU3VydmV5KCkge1xuICAgICAgICB0aGlzLnN1cnZleSA9IG5ldyBTdXJ2ZXkuU3VydmV5KCk7XG4gICAgICAgIHRoaXMuc3VydmV5LnNob3dOYXZpZ2F0aW9uQnV0dG9ucyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN1cnZleS5zaG93UXVlc3Rpb25OdW1iZXJzID0gXCJvZmZcIjtcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5hZGROZXdQYWdlKFwicGFnZTFcIik7XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uRHJvcGRvd24+cGFnZS5hZGROZXdRdWVzdGlvbihcImRyb3Bkb3duXCIsIFwicTFcIik7XG4gICAgICAgIHRoaXMucXVlc3Rpb24udGl0bGUgPSBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudGVzdFNlcnZpY2VcIilcbiAgICAgICAgdGhpcy5xdWVzdGlvbi5jaG9pY2VzID0gW107XG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcihcInJlc3RmdWxsU3VydmV5XCIpO1xuICAgIH1cbn1cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwicmVzdGZ1bGxcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlSZXN1bHRmdWxsRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlSZXN0ZnVsbEVkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAga29RdWVzdGlvbnM6IGFueTsga29QYWdlczogYW55O1xuICAgIHB1YmxpYyBrb1NlbGVjdGVkOiBhbnk7XG4gICAgcHVibGljIGF2YWlsYWJsZVRyaWdnZXJzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHJpdmF0ZSB0cmlnZ2VyQ2xhc3NlczogQXJyYXk8U3VydmV5Lkpzb25NZXRhZGF0YUNsYXNzPiA9IFtdO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShzZWxmLmtvU2VsZWN0ZWQoKSk7IH07XG4gICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICh0cmlnZ2VyVHlwZSkgeyBzZWxmLmFkZEl0ZW0odHJpZ2dlclR5cGUpOyB9O1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xuICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB0aGlzLnRyaWdnZXJDbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic3VydmV5dHJpZ2dlclwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hdmFpbGFibGVUcmlnZ2VycyA9IHRoaXMuZ2V0QXZhaWxhYmxlVHJpZ2dlcnMoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRyaWdnZXJzXCI7IH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XG4gICAgICAgIGlmICh0aGlzLm9iamVjdCkge1xuICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKHRoaXMuZ2V0TmFtZXMoKDxTdXJ2ZXkuU3VydmV5PnRoaXMub2JqZWN0KS5wYWdlcykpO1xuICAgICAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyh0aGlzLmdldE5hbWVzKCg8U3VydmV5LlN1cnZleT50aGlzLm9iamVjdCkuZ2V0QWxsUXVlc3Rpb25zKCkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5rb1NlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5rb0l0ZW1zKCkubGVuZ3RoID4gMCA/IHRoaXMua29JdGVtcygpWzBdIDogbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEl0ZW0odHJpZ2dlclR5cGU6IHN0cmluZykge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKHRyaWdnZXJUeXBlKTtcbiAgICAgICAgdmFyIHRyaWdnZXJJdGVtID0gdGhpcy5jcmVhdGVQcm9wZXJ0eVRyaWdnZXIodHJpZ2dlcik7XG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKHRyaWdnZXJJdGVtKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkKHRyaWdnZXJJdGVtKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7XG4gICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XG4gICAgICAgIHZhciB0cmlnZ2VyID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoaXRlbS5nZXRUeXBlKCkpO1xuICAgICAgICBqc29uT2JqLnRvT2JqZWN0KGl0ZW0sIHRyaWdnZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVQcm9wZXJ0eVRyaWdnZXIoPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyPnRyaWdnZXIpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgZWRpdG9yVHJpZ2dlciA9IDxTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXI+ZWRpdG9ySXRlbTtcbiAgICAgICAgcmV0dXJuIGVkaXRvclRyaWdnZXIuY3JlYXRlVHJpZ2dlcigpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEF2YWlsYWJsZVRyaWdnZXJzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50cmlnZ2VyQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy50cmlnZ2VyQ2xhc3Nlc1tpXS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcml2YXRlIGdldE5hbWVzKGl0ZW1zOiBBcnJheTxhbnk+KTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHZhciBuYW1lcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW1bXCJuYW1lXCJdKSB7XG4gICAgICAgICAgICAgICAgbmFtZXMucHVzaChpdGVtW1wibmFtZVwiXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWVzO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVByb3BlcnR5VHJpZ2dlcih0cmlnZ2VyOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlcik6IFN1cnZleVByb3BlcnR5VHJpZ2dlciB7XG4gICAgICAgIHZhciB0cmlnZ2VySXRlbSA9IG51bGw7XG4gICAgICAgIGlmICh0cmlnZ2VyLmdldFR5cGUoKSA9PSBcInZpc2libGV0cmlnZ2VyXCIpIHtcbiAgICAgICAgICAgIHRyaWdnZXJJdGVtID0gbmV3IFN1cnZleVByb3BlcnR5VmlzaWJsZVRyaWdnZXIoPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZT50cmlnZ2VyLCB0aGlzLmtvUGFnZXMsIHRoaXMua29RdWVzdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmlnZ2VyLmdldFR5cGUoKSA9PSBcInNldHZhbHVldHJpZ2dlclwiKSB7XG4gICAgICAgICAgICB0cmlnZ2VySXRlbSA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVNldFZhbHVlVHJpZ2dlcig8U3VydmV5LlN1cnZleVRyaWdnZXJTZXRWYWx1ZT50cmlnZ2VyLCB0aGlzLmtvUXVlc3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRyaWdnZXJJdGVtKSB7XG4gICAgICAgICAgICB0cmlnZ2VySXRlbSA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIodHJpZ2dlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRyaWdnZXJJdGVtO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xuICAgIHByaXZhdGUgb3BlcmF0b3JzID0gW1wiZW1wdHlcIiwgXCJub3RlbXB0eVwiLCBcImVxdWFsXCIsIFwibm90ZXF1YWxcIiwgXCJjb250YWluc1wiLCBcIm5vdGNvbnRhaW5zXCIsIFwiZ3JlYXRlclwiLCBcImxlc3NcIiwgXCJncmVhdGVyb3JlcXVhbFwiLCBcImxlc3NvcmVxdWFsXCJdO1xuICAgIHByaXZhdGUgdHJpZ2dlclR5cGU6IHN0cmluZztcbiAgICBhdmFpbGFibGVPcGVyYXRvcnMgPSBbXTtcbiAgICBrb05hbWU6IGFueTsga29PcGVyYXRvcjogYW55OyBrb1ZhbHVlOiBhbnk7IGtvVHlwZTogYW55O1xuICAgIGtvVGV4dDogYW55OyBrb0lzVmFsaWQ6IGFueTsga29SZXF1aXJlVmFsdWU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmlnZ2VyOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlcikge1xuICAgICAgICB0aGlzLmNyZWF0ZU9wZXJhdG9ycygpO1xuICAgICAgICB0aGlzLnRyaWdnZXJUeXBlID0gdHJpZ2dlci5nZXRUeXBlKCk7XG4gICAgICAgIHRoaXMua29UeXBlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnRyaWdnZXJUeXBlKTtcbiAgICAgICAgdGhpcy5rb05hbWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIubmFtZSk7XG4gICAgICAgIHRoaXMua29PcGVyYXRvciA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5vcGVyYXRvcik7XG4gICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci52YWx1ZSk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5rb1JlcXVpcmVWYWx1ZSA9IGtvLmNvbXB1dGVkKCgpID0+IHsgcmV0dXJuIHNlbGYua29PcGVyYXRvcigpICE9IFwiZW1wdHlcIiAmJiBzZWxmLmtvT3BlcmF0b3IoKSAhPSBcIm5vdGVtcHR5XCI7IH0pO1xuICAgICAgICB0aGlzLmtvSXNWYWxpZCA9IGtvLmNvbXB1dGVkKCgpID0+IHsgaWYgKHNlbGYua29OYW1lKCkgJiYgKCFzZWxmLmtvUmVxdWlyZVZhbHVlKCkgfHwgc2VsZi5rb1ZhbHVlKCkpKSByZXR1cm4gdHJ1ZTsgcmV0dXJuIGZhbHNlOyB9KTtcbiAgICAgICAgdGhpcy5rb1RleHQgPSBrby5jb21wdXRlZCgoKSA9PiB7IHNlbGYua29OYW1lKCk7IHNlbGYua29PcGVyYXRvcigpOyBzZWxmLmtvVmFsdWUoKTsgcmV0dXJuIHNlbGYuZ2V0VGV4dCgpOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IDxTdXJ2ZXkuU3VydmV5VHJpZ2dlcj5TdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh0aGlzLnRyaWdnZXJUeXBlKTtcbiAgICAgICAgdHJpZ2dlci5uYW1lID0gdGhpcy5rb05hbWUoKTtcbiAgICAgICAgdHJpZ2dlci5vcGVyYXRvciA9IHRoaXMua29PcGVyYXRvcigpO1xuICAgICAgICB0cmlnZ2VyLnZhbHVlID0gdGhpcy5rb1ZhbHVlKCk7XG4gICAgICAgIHJldHVybiB0cmlnZ2VyO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZU9wZXJhdG9ycygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wZXJhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLm9wZXJhdG9yc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlT3BlcmF0b3JzLnB1c2goeyBuYW1lOiBuYW1lLCB0ZXh0OiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwib3AuXCIgKyBuYW1lKSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGdldFRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmtvSXNWYWxpZCgpKSByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJOb3RTZXRcIik7XG4gICAgICAgIHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudHJpZ2dlclJ1bklmXCIpICsgXCIgJ1wiICsgdGhpcy5rb05hbWUoKSArIFwiJyBcIiArIHRoaXMuZ2V0T3BlcmF0b3JUZXh0KCkgKyB0aGlzLmdldFZhbHVlVGV4dCgpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldE9wZXJhdG9yVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICB2YXIgb3AgPSB0aGlzLmtvT3BlcmF0b3IoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF2YWlsYWJsZU9wZXJhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlT3BlcmF0b3JzW2ldLm5hbWUgPT0gb3ApIHJldHVybiB0aGlzLmF2YWlsYWJsZU9wZXJhdG9yc1tpXS50ZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcDtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRWYWx1ZVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF0aGlzLmtvUmVxdWlyZVZhbHVlKCkpIHJldHVybiBcIlwiO1xuICAgICAgICByZXR1cm4gXCIgXCIgKyB0aGlzLmtvVmFsdWUoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVZpc2libGVUcmlnZ2VyIGV4dGVuZHMgU3VydmV5UHJvcGVydHlUcmlnZ2VyIHtcbiAgICBwdWJsaWMgcGFnZXM6IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHM7XG4gICAgcHVibGljIHF1ZXN0aW9uczogU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cztcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlLCBrb1BhZ2VzOiBhbnksIGtvUXVlc3Rpb25zOiBhbnkpIHtcbiAgICAgICAgc3VwZXIodHJpZ2dlcik7XG4gICAgICAgIHRoaXMucGFnZXMgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyhlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudHJpZ2dlck1ha2VQYWdlc1Zpc2libGVcIiksIGtvUGFnZXMoKSwgdHJpZ2dlci5wYWdlcyk7XG4gICAgICAgIHRoaXMucXVlc3Rpb25zID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMoZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJNYWtlUXVlc3Rpb25zVmlzaWJsZVwiKSwga29RdWVzdGlvbnMoKSwgdHJpZ2dlci5xdWVzdGlvbnMpO1xuICAgIH1cbiAgICBwdWJsaWMgY3JlYXRlVHJpZ2dlcigpOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlciB7XG4gICAgICAgIHZhciB0cmlnZ2VyID0gPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZT5zdXBlci5jcmVhdGVUcmlnZ2VyKCk7XG4gICAgICAgIHRyaWdnZXIucGFnZXMgPSB0aGlzLnBhZ2VzLmtvQ2hvb3NlbigpO1xuICAgICAgICB0cmlnZ2VyLnF1ZXN0aW9ucyA9IHRoaXMucXVlc3Rpb25zLmtvQ2hvb3NlbigpO1xuICAgICAgICByZXR1cm4gdHJpZ2dlcjtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVNldFZhbHVlVHJpZ2dlciBleHRlbmRzIFN1cnZleVByb3BlcnR5VHJpZ2dlciB7XG4gICAga29RdWVzdGlvbnM6IGFueTsga29zZXRUb05hbWU6IGFueTsga29zZXRWYWx1ZTogYW55OyBrb2lzVmFyaWFibGU6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXJTZXRWYWx1ZSwga29RdWVzdGlvbnM6IGFueSkge1xuICAgICAgICBzdXBlcih0cmlnZ2VyKTtcbiAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyA9IGtvUXVlc3Rpb25zO1xuICAgICAgICB0aGlzLmtvc2V0VG9OYW1lID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLnNldFRvTmFtZSk7XG4gICAgICAgIHRoaXMua29zZXRWYWx1ZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5zZXRWYWx1ZSk7XG4gICAgICAgIHRoaXMua29pc1ZhcmlhYmxlID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLmlzVmFyaWFibGUpO1xuICAgIH1cbiAgICBwdWJsaWMgY3JlYXRlVHJpZ2dlcigpOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlciB7XG4gICAgICAgIHZhciB0cmlnZ2VyID0gPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyU2V0VmFsdWU+c3VwZXIuY3JlYXRlVHJpZ2dlcigpO1xuICAgICAgICB0cmlnZ2VyLnNldFRvTmFtZSA9IHRoaXMua29zZXRUb05hbWUoKTtcbiAgICAgICAgdHJpZ2dlci5zZXRWYWx1ZSA9IHRoaXMua29zZXRWYWx1ZSgpO1xuICAgICAgICB0cmlnZ2VyLmlzVmFyaWFibGUgPSB0aGlzLmtvaXNWYXJpYWJsZSgpO1xuICAgICAgICByZXR1cm4gdHJpZ2dlcjtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyB7XG4gICAga29PYmplY3RzOiBhbnk7XG4gICAga29DaG9vc2VuOiBhbnk7XG4gICAga29TZWxlY3RlZDogYW55O1xuICAgIGtvQ2hvb3NlblNlbGVjdGVkOiBhbnk7XG4gICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcbiAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0aXRsZTogc3RyaW5nLCBhbGxPYmplY3RzOiBBcnJheTxzdHJpbmc+LCBjaG9vc2VuT2JqZWN0czogQXJyYXk8c3RyaW5nPikge1xuICAgICAgICB0aGlzLmtvQ2hvb3NlbiA9IGtvLm9ic2VydmFibGVBcnJheShjaG9vc2VuT2JqZWN0cyk7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gYWxsT2JqZWN0c1tpXTtcbiAgICAgICAgICAgIGlmIChjaG9vc2VuT2JqZWN0cy5pbmRleE9mKGl0ZW0pIDwgMCkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb09iamVjdHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoYXJyYXkpO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMua29DaG9vc2VuU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUl0ZW0oKTsgfTtcbiAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFkZEl0ZW0oKTsgfVxuICAgIH1cbiAgICBwcml2YXRlIGRlbGV0ZUl0ZW0oKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlSXRlbXModGhpcy5rb0Nob29zZW5TZWxlY3RlZCgpLCB0aGlzLmtvQ2hvb3NlbiwgdGhpcy5rb09iamVjdHMpO1xuICAgIH1cbiAgICBwcml2YXRlIGFkZEl0ZW0oKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlSXRlbXModGhpcy5rb1NlbGVjdGVkKCksIHRoaXMua29PYmplY3RzLCB0aGlzLmtvQ2hvb3Nlbik7XG4gICAgfVxuICAgIHByaXZhdGUgY2hhbmdlSXRlbXMoaXRlbTogc3RyaW5nLCByZW1vdmVkRnJvbTogYW55LCBhZGRUbzogYW55KSB7XG4gICAgICAgIHJlbW92ZWRGcm9tLnJlbW92ZShpdGVtKTtcbiAgICAgICAgYWRkVG8ucHVzaChpdGVtKTtcbiAgICAgICAgcmVtb3ZlZEZyb20uc29ydCgpO1xuICAgICAgICBhZGRUby5zb3J0KCk7XG4gICAgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJ0cmlnZ2Vyc1wiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUcmlnZ2Vyc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5SGVscGVyfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrID0gKCkgPT4gdm9pZDtcbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB2b2lkO1xuZXhwb3J0IGRlY2xhcmUgdHlwZSBTdXJ2ZXlNb3ZlUGFnZUNhbGxiYWNrID0gKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpID0+IHZvaWQ7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQYWdlc0VkaXRvciB7XG4gICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XG4gICAga29QYWdlczogYW55O1xuICAgIGtvSXNWYWxpZDogYW55O1xuICAgIHNlbGVjdFBhZ2VDbGljazogYW55O1xuICAgIG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2s7XG4gICAgb25TZWxlY3RQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcbiAgICBvbkRlbGV0ZVBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrO1xuICAgIG9uTW92ZVBhZ2VDYWxsYmFjazogU3VydmV5TW92ZVBhZ2VDYWxsYmFjaztcbiAgICBkcmFnZ2luZ1BhZ2U6IGFueSA9IG51bGw7XG4gICAgZHJhZ1N0YXJ0OiBhbnk7IGRyYWdPdmVyOiBhbnk7IGRyYWdFbmQ6IGFueTsgZHJhZ0Ryb3A6IGFueTsga2V5RG93bjogYW55O1xuXG4gICAgY29uc3RydWN0b3Iob25BZGROZXdQYWdlQ2FsbGJhY2s6IFN1cnZleUFkZE5ld1BhZ2VDYWxsYmFjayA9IG51bGwsIG9uU2VsZWN0UGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2sgPSBudWxsLFxuICAgICAgICAgICAgICAgIG9uTW92ZVBhZ2VDYWxsYmFjazogU3VydmV5TW92ZVBhZ2VDYWxsYmFjayA9IG51bGwsIG9uRGVsZXRlUGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2sgPSBudWxsKSB7XG4gICAgICAgIHRoaXMua29QYWdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB0aGlzLmtvSXNWYWxpZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrID0gb25BZGROZXdQYWdlQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMub25TZWxlY3RQYWdlQ2FsbGJhY2sgPSBvblNlbGVjdFBhZ2VDYWxsYmFjaztcbiAgICAgICAgdGhpcy5vbk1vdmVQYWdlQ2FsbGJhY2sgPSBvbk1vdmVQYWdlQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMub25EZWxldGVQYWdlQ2FsbGJhY2sgPSBvbkRlbGV0ZVBhZ2VDYWxsYmFjaztcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnNlbGVjdFBhZ2VDbGljayA9IGZ1bmN0aW9uKHBhZ2VJdGVtKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5vblNlbGVjdFBhZ2VDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2socGFnZUl0ZW0ucGFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMua2V5RG93biA9IGZ1bmN0aW9uIChlbDogYW55LCBlOiBLZXlib2FyZEV2ZW50KSB7IHNlbGYub25LZXlEb3duKGVsLCBlKTsgfVxuICAgICAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlbDogYW55KSB7IHNlbGYuZHJhZ2dpbmdQYWdlID0gZWw7IH07XG4gICAgICAgIHRoaXMuZHJhZ092ZXIgPSBmdW5jdGlvbiAoZWw6IGFueSkgeyAgfTtcbiAgICAgICAgdGhpcy5kcmFnRW5kID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRyYWdnaW5nUGFnZSA9IG51bGw7IH07XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3AgPSBmdW5jdGlvbiAoZWw6IGFueSkgeyBzZWxmLm1vdmVEcmFnZ2luZ1BhZ2VUbyhlbCk7IH07XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5rb0lzVmFsaWQodGhpcy5zdXJ2ZXlWYWx1ZSAhPSBudWxsKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdlcygpO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0U2VsZWN0ZWRQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwYWdlc1tpXS5rb1NlbGVjdGVkKHBhZ2VzW2ldLnBhZ2UgPT0gcGFnZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGFkZE5ld1BhZ2VDbGljaygpIHtcbiAgICAgICAgaWYgKHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgcmVtb3ZlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4QnlQYWdlKHBhZ2UpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5rb1BhZ2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGNoYW5nZU5hbWUocGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMua29QYWdlcygpW2luZGV4XS50aXRsZShTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldEluZGV4QnlQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKTogbnVtYmVyIHtcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChwYWdlc1tpXS5wYWdlID09IHBhZ2UpIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG9uS2V5RG93bihlbDogYW55LCBlOiBLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmtvUGFnZXMoKS5sZW5ndGggPD0gMSkgcmV0dXJuO1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmtvUGFnZXMoKTtcbiAgICAgICAgdmFyIHBhZ2VJbmRleCA9IC0xO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGFnZXNbaV0ucGFnZSAmJiBwYWdlc1tpXS5rb1NlbGVjdGVkKCkpIHtcbiAgICAgICAgICAgICAgICBwYWdlSW5kZXggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwYWdlSW5kZXggPCAwKSByZXR1cm47XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT0gNDYgJiYgdGhpcy5vbkRlbGV0ZVBhZ2VDYWxsYmFjaykgdGhpcy5vbkRlbGV0ZVBhZ2VDYWxsYmFjayhlbC5wYWdlKTtcbiAgICAgICAgaWYgKChlLmtleUNvZGUgPT0gMzcgfHwgZS5rZXlDb2RlID09IDM5KSAmJiB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICBwYWdlSW5kZXggKz0gKGUua2V5Q29kZSA9PSAzNyA/IC0xIDogMSk7XG4gICAgICAgICAgICBpZiAocGFnZUluZGV4IDwgMCkgcGFnZUluZGV4ID0gcGFnZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmIChwYWdlSW5kZXggPj0gcGFnZXMubGVuZ3RoKSBwYWdlSW5kZXggPSAwO1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSBwYWdlc1twYWdlSW5kZXhdLnBhZ2U7XG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrKHBhZ2UpO1xuICAgICAgICAgICAgdGhpcy5zZXRTZWxlY3RlZFBhZ2UocGFnZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvdGVjdGVkIHVwZGF0ZVBhZ2VzKCkge1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMoW10pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYWdlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIHBhZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBrby5vYnNlcnZhYmxlKFN1cnZleUhlbHBlci5nZXRPYmplY3ROYW1lKHBhZ2UpKSwgcGFnZTogcGFnZSwga29TZWxlY3RlZDoga28ub2JzZXJ2YWJsZShmYWxzZSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29QYWdlcyhwYWdlcyk7XG4gICAgfVxuICAgIHByaXZhdGUgbW92ZURyYWdnaW5nUGFnZVRvKHRvUGFnZTogYW55KSB7XG4gICAgICAgIGlmICh0b1BhZ2UgPT0gbnVsbCB8fCB0b1BhZ2UgPT0gdGhpcy5kcmFnZ2luZ1BhZ2UpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmdQYWdlID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZ1BhZ2UgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmtvUGFnZXMoKS5pbmRleE9mKHRoaXMuZHJhZ2dpbmdQYWdlKTtcbiAgICAgICAgdmFyIGluZGV4VG8gPSB0aGlzLmtvUGFnZXMoKS5pbmRleE9mKHRvUGFnZSk7XG4gICAgICAgIGlmICh0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5vbk1vdmVQYWdlQ2FsbGJhY2soaW5kZXgsIGluZGV4VG8pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5SlNPTjV9IGZyb20gXCIuL2pzb241XCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5jbGFzcyBUZXh0UGFyc2VyUHJvcGVyeSB7XG4gICAgaXNGb3VuZDogYm9vbGVhbjtcbiAgICBwcm9wZXJ0aWVzQ291bnQ6IG51bWJlcjtcbiAgICBzdGFydDogbnVtYmVyO1xuICAgIGVuZDogbnVtYmVyO1xuICAgIHZhbHVlU3RhcnQ6IG51bWJlcjtcbiAgICB2YWx1ZUVuZDogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5VGV4dFdvcmtlciB7XG4gICAgcHVibGljIHN0YXRpYyBuZXdMaW5lQ2hhcjogc3RyaW5nO1xuICAgIHB1YmxpYyBlcnJvcnM6IEFycmF5PGFueT47XG4gICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcbiAgICBwcml2YXRlIGpzb25WYWx1ZTogYW55O1xuICAgIHByaXZhdGUgc3VydmV5T2JqZWN0czogQXJyYXk8YW55PjtcbiAgICBwcml2YXRlIGlzU3VydmV5QXNQYWdlOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoIXRoaXMudGV4dCB8fCB0aGlzLnRleHQudHJpbSgpID09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IFwie31cIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgICAgICB0aGlzLnByb2Nlc3MoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlOyB9XG4gICAgcHVibGljIGdldCBpc0pzb25Db3JyZWN0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZSAhPSBudWxsOyB9XG4gICAgcHJvdGVjdGVkIHByb2Nlc3MoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLmpzb25WYWx1ZSA9IG5ldyBTdXJ2ZXlKU09ONSgxKS5wYXJzZSh0aGlzLnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7IHBvczogeyBzdGFydDogZXJyb3IuYXQsIGVuZDogLTEgfSwgdGV4dDogZXJyb3IubWVzc2FnZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5qc29uVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVKc29uUG9zaXRpb25zKHRoaXMuanNvblZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5LlN1cnZleSh0aGlzLmpzb25WYWx1ZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goeyBwb3M6IHsgc3RhcnQ6IGVycm9yLmF0LCBlbmQ6IC0xIH0sIHRleHQ6IGVycm9yLmdldEZ1bGxEZXNjcmlwdGlvbigpIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSB0aGlzLmNyZWF0ZVN1cnZleU9iamVjdHMoKTtcbiAgICAgICAgdGhpcy5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCh0aGlzLnN1cnZleU9iamVjdHMpO1xuICAgICAgICB0aGlzLnNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KHRoaXMuZXJyb3JzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSB1cGRhdGVKc29uUG9zaXRpb25zKGpzb25PYmo6IGFueSkge1xuICAgICAgICBqc29uT2JqW1wicG9zXCJdW1wic2VsZlwiXSA9IGpzb25PYmo7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0ganNvbk9ialtrZXldO1xuICAgICAgICAgICAgaWYgKG9iaiAmJiBvYmpbXCJwb3NcIl0pIHtcbiAgICAgICAgICAgICAgICBqc29uT2JqW1wicG9zXCJdW2tleV0gPSBvYmpbXCJwb3NcIl07XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVKc29uUG9zaXRpb25zKG9iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVTdXJ2ZXlPYmplY3RzKCk6IEFycmF5PGFueT4ge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgICAgIHRoaXMuaXNTdXJ2ZXlBc1BhZ2UgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV07XG4gICAgICAgICAgICBpZiAoaSA9PSAwICYmICFwYWdlW1wicG9zXCJdKSB7XG4gICAgICAgICAgICAgICAgcGFnZVtcInBvc1wiXSA9IHRoaXMuc3VydmV5VmFsdWVbXCJwb3NcIl07XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N1cnZleUFzUGFnZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQucHVzaChwYWdlKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwYWdlLnF1ZXN0aW9uc1tqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcHJpdmF0ZSBzZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdChvYmplY3RzOiBhbnlbXSkge1xuICAgICAgICBpZiAob2JqZWN0cyA9PSBudWxsIHx8IG9iamVjdHMubGVuZ3RoID09IDApIHJldHVybjtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0geyByb3c6IDAsIGNvbHVtbjogMCB9O1xuICAgICAgICB2YXIgYXRPYmplY3RzQXJyYXkgPSB0aGlzLmdldEF0QXJyYXkob2JqZWN0cyk7XG4gICAgICAgIHZhciBzdGFydEF0OiBudW1iZXIgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0T2JqZWN0c0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXQgPSBhdE9iamVjdHNBcnJheVtpXS5hdDtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5nZXRQb3N0aW9uQnlDaGFydEF0KHBvc2l0aW9uLCBzdGFydEF0LCBhdCk7XG4gICAgICAgICAgICB2YXIgb2JqID0gYXRPYmplY3RzQXJyYXlbaV0ub2JqO1xuICAgICAgICAgICAgaWYgKCFvYmoucG9zaXRpb24pIG9iai5wb3NpdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGF0ID09IG9iai5wb3Muc3RhcnQpIHtcbiAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uc3RhcnQgPSBwb3NpdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0ID09IG9iai5wb3MuZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iai5wb3NpdGlvbi5lbmQgPSBwb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydEF0ID0gYXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRQb3N0aW9uQnlDaGFydEF0KHN0YXJ0UG9zaXRpb246IGFueSwgc3RhcnRBdDogbnVtYmVyLCBhdDogbnVtYmVyKTogYW55IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHsgcm93OiBzdGFydFBvc2l0aW9uLnJvdywgY29sdW1uOiBzdGFydFBvc2l0aW9uLmNvbHVtbiB9O1xuICAgICAgICB2YXIgY3VyQ2hhciA9IHN0YXJ0QXQ7XG4gICAgICAgIHdoaWxlIChjdXJDaGFyIDwgYXQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHQuY2hhckF0KGN1ckNoYXIpID09IFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucm93Kys7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbiA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5jb2x1bW4rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1ckNoYXIrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcml2YXRlIGdldEF0QXJyYXkob2JqZWN0czogYW55W10pOiBhbnlbXSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgb2JqID0gb2JqZWN0c1tpXTtcbiAgICAgICAgICAgIHZhciBwb3MgPSBvYmoucG9zO1xuICAgICAgICAgICAgaWYgKCFwb3MpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLnN0YXJ0LCBvYmo6IG9iaiB9KTtcbiAgICAgICAgICAgIGlmIChwb3MuZW5kID4gMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgYXQ6IHBvcy5lbmQsIG9iajogb2JqIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQuc29ydCgoZWwxLCBlbDIpID0+IHtcbiAgICAgICAgICAgIGlmIChlbDEuYXQgPiBlbDIuYXQpIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKGVsMS5hdCA8IGVsMi5hdCkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdGV4dFdvcmtlci50cyIsIi8vIFRoaXMgZmlsZSBpcyBiYXNlZCBvbiBKU09ONSwgaHR0cDovL2pzb241Lm9yZy9cbi8vIFRoZSBtb2RpZmljYXRpb24gZm9yIGdldHRpbmcgb2JqZWN0IGFuZCBwcm9wZXJ0aWVzIGxvY2F0aW9uICdhdCcgd2VyZSBtYWRlbi5cblxuZXhwb3J0IGNsYXNzIFN1cnZleUpTT041IHtcbiAgICBwdWJsaWMgc3RhdGljIHBvc2l0aW9uTmFtZSA9IFwicG9zXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZXNjYXBlZSA9IHtcbiAgICAgICAgXCInXCI6IFwiJ1wiLFxuICAgICAgICAnXCInOiAnXCInLFxuICAgICAgICAnXFxcXCc6ICdcXFxcJyxcbiAgICAgICAgJy8nOiAnLycsXG4gICAgICAgICdcXG4nOiAnJywgICAgICAgLy8gUmVwbGFjZSBlc2NhcGVkIG5ld2xpbmVzIGluIHN0cmluZ3Mgdy8gZW1wdHkgc3RyaW5nXG4gICAgICAgIGI6ICdcXGInLFxuICAgICAgICBmOiAnXFxmJyxcbiAgICAgICAgbjogJ1xcbicsXG4gICAgICAgIHI6ICdcXHInLFxuICAgICAgICB0OiAnXFx0J1xuICAgIH07XG4gICAgcHJpdmF0ZSBzdGF0aWMgd3MgPSBbXG4gICAgICAgICcgJyxcbiAgICAgICAgJ1xcdCcsXG4gICAgICAgICdcXHInLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgJ1xcdicsXG4gICAgICAgICdcXGYnLFxuICAgICAgICAnXFx4QTAnLFxuICAgICAgICAnXFx1RkVGRidcbiAgICBdO1xuICAgIHByaXZhdGUgZW5kQXQ6IG51bWJlcjtcbiAgICBwcml2YXRlIGF0OiBudW1iZXI7ICAgICAvLyBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgY2hhcmFjdGVyXG4gICAgcHJpdmF0ZSBjaDogYW55OyAgICAgLy8gVGhlIGN1cnJlbnQgY2hhcmFjdGVyXG4gICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBwYXJzZVR5cGU6IG51bWJlcjsgLy8gMCAtIHN0YWRhcmQsIDEgLSBnZXQgaW5mb3JtYXRpb24gYWJvdXQgb2JqZWN0cywgMiAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgcHJvcGVydGllc1xuICAgIGNvbnN0cnVjdG9yKHBhcnNlVHlwZTogbnVtYmVyID0gMCkge1xuICAgICAgICB0aGlzLnBhcnNlVHlwZSA9IHBhcnNlVHlwZTtcbiAgICB9XG4gICAgcHVibGljIHBhcnNlKHNvdXJjZTogYW55LCByZXZpdmVyOiBhbnkgPSBudWxsLCBzdGFydEZyb206IG51bWJlciA9IDAsIGVuZEF0OiBudW1iZXIgPSAtMSk6IGFueSB7XG4gICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nKHNvdXJjZSk7XG4gICAgICAgIHRoaXMuYXQgPSBzdGFydEZyb207XG4gICAgICAgIHRoaXMuZW5kQXQgPSBlbmRBdDtcbiAgICAgICAgdGhpcy5jaCA9ICcgJztcbiAgICAgICAgcmVzdWx0ID0gdGhpcy52YWx1ZSgpO1xuICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgIGlmICh0aGlzLmNoKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiU3ludGF4IGVycm9yXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLFxuICAgICAgICAvLyBwYXNzaW5nIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIHRoZSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZVxuICAgICAgICAvLyB0cmFuc2Zvcm1hdGlvbiwgc3RhcnRpbmcgd2l0aCBhIHRlbXBvcmFyeSByb290IG9iamVjdCB0aGF0IGhvbGRzIHRoZSByZXN1bHRcbiAgICAgICAgLy8gaW4gYW4gZW1wdHkga2V5LiBJZiB0aGVyZSBpcyBub3QgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSBzaW1wbHkgcmV0dXJuIHRoZVxuICAgICAgICAvLyByZXN1bHQuXG5cbiAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nID8gKGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcbiAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfSAoeyAnJzogcmVzdWx0IH0sICcnKSkgOiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgZXJyb3IobTogc3RyaW5nKSB7XG4gICAgICAgIC8vIENhbGwgZXJyb3Igd2hlbiBzb21ldGhpbmcgaXMgd3JvbmcuXG4gICAgICAgIHZhciBlcnJvciA9IG5ldyBTeW50YXhFcnJvcigpO1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gbTtcbiAgICAgICAgZXJyb3JbXCJhdFwiXSA9IHRoaXMuYXQ7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgICBwcml2YXRlIG5leHQoYzogYW55ID0gbnVsbCkge1xuICAgICAgICAvLyBJZiBhIGMgcGFyYW1ldGVyIGlzIHByb3ZpZGVkLCB2ZXJpZnkgdGhhdCBpdCBtYXRjaGVzIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cbiAgICAgICAgaWYgKGMgJiYgYyAhPT0gdGhpcy5jaCkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkICdcIiArIGMgKyBcIicgaW5zdGVhZCBvZiAnXCIgKyB0aGlzLmNoICsgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3Rlci4gV2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBjaGFyYWN0ZXJzLFxuICAgICAgICAvLyByZXR1cm4gdGhlIGVtcHR5IHN0cmluZy5cbiAgICAgICAgdGhpcy5jaCA9IHRoaXMuY2hhcnRBdCgpO1xuICAgICAgICB0aGlzLmF0ICs9IDE7XG4gICAgICAgIHJldHVybiB0aGlzLmNoO1xuICAgIH1cbiAgICBwcml2YXRlIHBlZWsoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3RlciB3aXRob3V0IGNvbnN1bWluZyBpdCBvclxuICAgICAgICAvLyBhc3NpZ25pbmcgaXQgdG8gdGhlIHRoaXMuY2ggdmFyYWlibGUuXG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0QXQoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjaGFydEF0KCkge1xuICAgICAgICBpZiAodGhpcy5lbmRBdCA+IC0xICYmIHRoaXMuYXQgPj0gdGhpcy5lbmRBdCkgcmV0dXJuICcnO1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0LmNoYXJBdCh0aGlzLmF0KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBpZGVudGlmaWVyKCkge1xuICAgICAgICAvLyBQYXJzZSBhbiBpZGVudGlmaWVyLiBOb3JtYWxseSwgcmVzZXJ2ZWQgd29yZHMgYXJlIGRpc2FsbG93ZWQgaGVyZSwgYnV0IHdlXG4gICAgICAgIC8vIG9ubHkgdXNlIHRoaXMgZm9yIHVucXVvdGVkIG9iamVjdCBrZXlzLCB3aGVyZSByZXNlcnZlZCB3b3JkcyBhcmUgYWxsb3dlZCxcbiAgICAgICAgLy8gc28gd2UgZG9uJ3QgY2hlY2sgZm9yIHRob3NlIGhlcmUuIFJlZmVyZW5jZXM6XG4gICAgICAgIC8vIC0gaHR0cDovL2VzNS5naXRodWIuY29tLyN4Ny42XG4gICAgICAgIC8vIC0gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9HdWlkZS9Db3JlX0xhbmd1YWdlX0ZlYXR1cmVzI1ZhcmlhYmxlc1xuICAgICAgICAvLyAtIGh0dHA6Ly9kb2NzdG9yZS5taWsudWEvb3JlbGx5L3dlYnByb2cvanNjcmlwdC9jaDAyXzA3Lmh0bVxuICAgICAgICAvLyBUT0RPIElkZW50aWZpZXJzIGNhbiBoYXZlIFVuaWNvZGUgXCJsZXR0ZXJzXCIgaW4gdGhlbTsgYWRkIHN1cHBvcnQgZm9yIHRob3NlLlxuICAgICAgICB2YXIga2V5ID0gdGhpcy5jaDtcblxuICAgICAgICAvLyBJZGVudGlmaWVycyBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIsIF8gb3IgJC5cbiAgICAgICAgaWYgKCh0aGlzLmNoICE9PSAnXycgJiYgdGhpcy5jaCAhPT0gJyQnKSAmJlxuICAgICAgICAgICAgKHRoaXMuY2ggPCAnYScgfHwgdGhpcy5jaCA+ICd6JykgJiZcbiAgICAgICAgICAgICh0aGlzLmNoIDwgJ0EnIHx8IHRoaXMuY2ggPiAnWicpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIGlkZW50aWZpZXJcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdWJzZXF1ZW50IGNoYXJhY3RlcnMgY2FuIGNvbnRhaW4gZGlnaXRzLlxuICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkgJiYgKFxuICAgICAgICB0aGlzLmNoID09PSAnXycgfHwgdGhpcy5jaCA9PT0gJyQnIHx8XG4gICAgICAgICh0aGlzLmNoID49ICdhJyAmJiB0aGlzLmNoIDw9ICd6JykgfHxcbiAgICAgICAgKHRoaXMuY2ggPj0gJ0EnICYmIHRoaXMuY2ggPD0gJ1onKSB8fFxuICAgICAgICAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpKSkge1xuICAgICAgICAgICAga2V5ICs9IHRoaXMuY2g7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgICBwcml2YXRlIG51bWJlcigpIHtcblxuICAgICAgICAvLyBQYXJzZSBhIG51bWJlciB2YWx1ZS5cblxuICAgICAgICB2YXIgbnVtYmVyLFxuICAgICAgICAgICAgc2lnbiA9ICcnLFxuICAgICAgICAgICAgc3RyaW5nID0gJycsXG4gICAgICAgICAgICBiYXNlID0gMTA7XG5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICctJyB8fCB0aGlzLmNoID09PSAnKycpIHtcbiAgICAgICAgICAgIHNpZ24gPSB0aGlzLmNoO1xuICAgICAgICAgICAgdGhpcy5uZXh0KHRoaXMuY2gpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VwcG9ydCBmb3IgSW5maW5pdHkgKGNvdWxkIHR3ZWFrIHRvIGFsbG93IG90aGVyIHdvcmRzKTpcbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdJJykge1xuICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG51bWJlciAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgd29yZCBmb3IgbnVtYmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHNpZ24gPT09ICctJykgPyAtbnVtYmVyIDogbnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VwcG9ydCBmb3IgTmFOXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnTicpIHtcbiAgICAgICAgICAgIG51bWJlciA9IHRoaXMud29yZCgpO1xuICAgICAgICAgICAgaWYgKCFpc05hTihudW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcignZXhwZWN0ZWQgd29yZCB0byBiZSBOYU4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlnbm9yZSBzaWduIGFzIC1OYU4gYWxzbyBpcyBOYU5cbiAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJzAnKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd4JyB8fCB0aGlzLmNoID09PSAnWCcpIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBiYXNlID0gMTY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcignT2N0YWwgbGl0ZXJhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChiYXNlKSB7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9ICcuJztcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ2UnIHx8IHRoaXMuY2ggPT09ICdFJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLScgfHwgdGhpcy5jaCA9PT0gJysnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknIHx8IHRoaXMuY2ggPj0gJ0EnICYmIHRoaXMuY2ggPD0gJ0YnIHx8IHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ2YnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2lnbiA9PT0gJy0nKSB7XG4gICAgICAgICAgICBudW1iZXIgPSAtc3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbnVtYmVyID0gK3N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGaW5pdGUobnVtYmVyKSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBudW1iZXJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgc3RyaW5nKCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGEgc3RyaW5nIHZhbHVlLlxuXG4gICAgICAgIHZhciBoZXgsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgc3RyaW5nID0gJycsXG4gICAgICAgICAgICBkZWxpbSwgICAgICAvLyBkb3VibGUgcXVvdGUgb3Igc2luZ2xlIHF1b3RlXG4gICAgICAgICAgICB1ZmZmZjtcblxuICAgICAgICAvLyBXaGVuIHBhcnNpbmcgZm9yIHN0cmluZyB2YWx1ZXMsIHdlIG11c3QgbG9vayBmb3IgJyBvciBcIiBhbmQgXFwgY2hhcmFjdGVycy5cblxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xuICAgICAgICAgICAgZGVsaW0gPSB0aGlzLmNoO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09IGRlbGltKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGV4ID0gcGFyc2VJbnQodGhpcy5uZXh0KCksIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmluaXRlKGhleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVmZmZmID0gdWZmZmYgKiAxNiArIGhleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHVmZmZmKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxyJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGVlaygpID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBTdXJ2ZXlKU09ONS5lc2NhcGVlW3RoaXMuY2hdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdW5lc2NhcGVkIG5ld2xpbmVzIGFyZSBpbnZhbGlkOyBzZWU6XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2VlbWsvanNvbjUvaXNzdWVzLzI0XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gdGhpcyBmZWVscyBzcGVjaWFsLWNhc2VkOyBhcmUgdGhlcmUgb3RoZXJcbiAgICAgICAgICAgICAgICAgICAgLy8gaW52YWxpZCB1bmVzY2FwZWQgY2hhcnM/XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9yKFwiQmFkIHN0cmluZ1wiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBpbmxpbmVDb21tZW50KCkge1xuXG4gICAgICAgIC8vIFNraXAgYW4gaW5saW5lIGNvbW1lbnQsIGFzc3VtaW5nIHRoaXMgaXMgb25lLiBUaGUgY3VycmVudCBjaGFyYWN0ZXIgc2hvdWxkXG4gICAgICAgIC8vIGJlIHRoZSBzZWNvbmQgLyBjaGFyYWN0ZXIgaW4gdGhlIC8vIHBhaXIgdGhhdCBiZWdpbnMgdGhpcyBpbmxpbmUgY29tbWVudC5cbiAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBpbmxpbmUgY29tbWVudCwgd2UgbG9vayBmb3IgYSBuZXdsaW5lIG9yIHRoZSBlbmQgb2YgdGhlIHRleHQuXG5cbiAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcvJykge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhbiBpbmxpbmUgY29tbWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcXG4nIHx8IHRoaXMuY2ggPT09ICdcXHInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBibG9ja0NvbW1lbnQoKSB7XG5cbiAgICAgICAgLy8gU2tpcCBhIGJsb2NrIGNvbW1lbnQsIGFzc3VtaW5nIHRoaXMgaXMgb25lLiBUaGUgY3VycmVudCBjaGFyYWN0ZXIgc2hvdWxkIGJlXG4gICAgICAgIC8vIHRoZSAqIGNoYXJhY3RlciBpbiB0aGUgLyogcGFpciB0aGF0IGJlZ2lucyB0aGlzIGJsb2NrIGNvbW1lbnQuXG4gICAgICAgIC8vIFRvIGZpbmlzaCB0aGUgYmxvY2sgY29tbWVudCwgd2UgbG9vayBmb3IgYW4gZW5kaW5nICovIHBhaXIgb2YgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gYnV0IHdlIGFsc28gd2F0Y2ggZm9yIHRoZSBlbmQgb2YgdGV4dCBiZWZvcmUgdGhlIGNvbW1lbnQgaXMgdGVybWluYXRlZC5cblxuICAgICAgICBpZiAodGhpcy5jaCAhPT0gJyonKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGEgYmxvY2sgY29tbWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPT09ICcqJykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnKicpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcvJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKHRoaXMuY2gpO1xuXG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbnRlcm1pbmF0ZWQgYmxvY2sgY29tbWVudFwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjb21tZW50KCkge1xuXG4gICAgICAgIC8vIFNraXAgYSBjb21tZW50LCB3aGV0aGVyIGlubGluZSBvciBibG9jay1sZXZlbCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuXG4gICAgICAgIC8vIENvbW1lbnRzIGFsd2F5cyBiZWdpbiB3aXRoIGEgLyBjaGFyYWN0ZXIuXG5cbiAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcvJykge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhIGNvbW1lbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5leHQoJy8nKTtcblxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XG4gICAgICAgICAgICB0aGlzLmlubGluZUNvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnKicpIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiVW5yZWNvZ25pemVkIGNvbW1lbnRcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSB3aGl0ZSgpIHtcblxuICAgICAgICAvLyBTa2lwIHdoaXRlc3BhY2UgYW5kIGNvbW1lbnRzLlxuICAgICAgICAvLyBOb3RlIHRoYXQgd2UncmUgZGV0ZWN0aW5nIGNvbW1lbnRzIGJ5IG9ubHkgYSBzaW5nbGUgLyBjaGFyYWN0ZXIuXG4gICAgICAgIC8vIFRoaXMgd29ya3Mgc2luY2UgcmVndWxhciBleHByZXNzaW9ucyBhcmUgbm90IHZhbGlkIEpTT04oNSksIGJ1dCB0aGlzIHdpbGxcbiAgICAgICAgLy8gYnJlYWsgaWYgdGhlcmUgYXJlIG90aGVyIHZhbGlkIHZhbHVlcyB0aGF0IGJlZ2luIHdpdGggYSAvIGNoYXJhY3RlciFcblxuICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChTdXJ2ZXlKU09ONS53cy5pbmRleE9mKHRoaXMuY2gpID49IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgd29yZCgpOiBhbnkge1xuXG4gICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsLlxuXG4gICAgICAgIHN3aXRjaCAodGhpcy5jaCkge1xuICAgICAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd0Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdyJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd1Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBjYXNlICdmJzpcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2YnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2EnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3MnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBjYXNlICduJzpcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3UnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGNhc2UgJ0knOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnSScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgneScpO1xuICAgICAgICAgICAgICAgIHJldHVybiBJbmZpbml0eTtcbiAgICAgICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnYScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhcnJheSgpIHtcblxuICAgICAgICAvLyBQYXJzZSBhbiBhcnJheSB2YWx1ZS5cblxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcblxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1snKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoJ1snKTtcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICddJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ10nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5OyAgIC8vIFBvdGVudGlhbGx5IGVtcHR5IGFycmF5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEVTNSBhbGxvd3Mgb21pdHRpbmcgZWxlbWVudHMgaW4gYXJyYXlzLCBlLmcuIFssXSBhbmRcbiAgICAgICAgICAgICAgICAvLyBbLG51bGxdLiBXZSBkb24ndCBhbGxvdyB0aGlzIGluIEpTT041LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk1pc3NpbmcgYXJyYXkgZWxlbWVudFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNvbW1hIGFmdGVyIHRoaXMgdmFsdWUsIHRoaXMgbmVlZHMgdG9cbiAgICAgICAgICAgICAgICAvLyBiZSB0aGUgZW5kIG9mIHRoZSBhcnJheS5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9yKFwiQmFkIGFycmF5XCIpO1xuICAgIH1cbiAgICBwcml2YXRlIG9iamVjdCgpIHtcblxuICAgICAgICAvLyBQYXJzZSBhbiBvYmplY3QgdmFsdWUuXG5cbiAgICAgICAgdmFyIGtleSxcbiAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgaXNGaXJzdFByb3BlcnR5ID0gdHJ1ZSxcbiAgICAgICAgICAgIG9iamVjdCA9IHt9O1xuICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XG4gICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXSA9IHsgc3RhcnQ6IHRoaXMuYXQgLSAxIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd7Jykge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCd7Jyk7XG4gICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICBzdGFydCA9IHRoaXMuYXQgLSAxO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ30nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdLmVuZCA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnfScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0OyAgIC8vIFBvdGVudGlhbGx5IGVtcHR5IG9iamVjdFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEtleXMgY2FuIGJlIHVucXVvdGVkLiBJZiB0aGV5IGFyZSwgdGhleSBuZWVkIHRvIGJlXG4gICAgICAgICAgICAgICAgLy8gdmFsaWQgSlMgaWRlbnRpZmllcnMuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcIicgfHwgdGhpcy5jaCA9PT0gXCInXCIpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5zdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLmlkZW50aWZpZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldID0geyBzdGFydDogc3RhcnQsIHZhbHVlU3RhcnQ6IHRoaXMuYXQgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCc6Jyk7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMuYXQgLSAxO1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNvbW1hIGFmdGVyIHRoaXMgcGFpciwgdGhpcyBuZWVkcyB0byBiZVxuICAgICAgICAgICAgICAgIC8vIHRoZSBlbmQgb2YgdGhlIG9iamVjdC5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0uZW5kID0gdGhpcy5hdCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd9Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZC0tO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmlyc3RQcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJywnKTtcbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICAgICAgaXNGaXJzdFByb3BlcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBvYmplY3RcIik7XG4gICAgfVxuICAgIHByaXZhdGUgdmFsdWUoKTogYW55IHtcblxuICAgICAgICAvLyBQYXJzZSBhIEpTT04gdmFsdWUuIEl0IGNvdWxkIGJlIGFuIG9iamVjdCwgYW4gYXJyYXksIGEgc3RyaW5nLCBhIG51bWJlcixcbiAgICAgICAgLy8gb3IgYSB3b3JkLlxuXG4gICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XG4gICAgICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcbiAgICAgICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XG4gICAgICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgICBjYXNlIFwiJ1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0cmluZygpO1xuICAgICAgICAgICAgY2FzZSAnLSc6XG4gICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm51bWJlcigpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScgPyB0aGlzLm51bWJlcigpIDogdGhpcy53b3JkKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcGxhY2VyOiBhbnk7XG4gICAgcHJpdmF0ZSBpbmRlbnRTdHI6IHN0cmluZztcbiAgICBwcml2YXRlIG9ialN0YWNrO1xuXG4gICAgcHVibGljIHN0cmluZ2lmeShvYmo6IGFueSwgcmVwbGFjZXI6IGFueSA9IG51bGwsIHNwYWNlOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIGlmIChyZXBsYWNlciAmJiAodHlwZW9mIChyZXBsYWNlcikgIT09IFwiZnVuY3Rpb25cIiAmJiAhdGhpcy5pc0FycmF5KHJlcGxhY2VyKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVwbGFjZXIgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgICAgICB0aGlzLmluZGVudFN0ciA9IHRoaXMuZ2V0SW5kZW50KHNwYWNlKTtcbiAgICAgICAgdGhpcy5vYmpTdGFjayA9IFtdO1xuICAgICAgICAvLyBzcGVjaWFsIGNhc2UuLi53aGVuIHVuZGVmaW5lZCBpcyB1c2VkIGluc2lkZSBvZlxuICAgICAgICAvLyBhIGNvbXBvdW5kIG9iamVjdC9hcnJheSwgcmV0dXJuIG51bGwuXG4gICAgICAgIC8vIGJ1dCB3aGVuIHRvcC1sZXZlbCwgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB2YXIgdG9wTGV2ZWxIb2xkZXIgPSB7IFwiXCI6IG9iaiB9O1xuICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZCh0b3BMZXZlbEhvbGRlciwgJycsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RyaW5naWZ5KHRvcExldmVsSG9sZGVyLCAnJywgdHJ1ZSk7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SW5kZW50KHNwYWNlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoc3BhY2UpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3BhY2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIiAmJiBzcGFjZSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZUluZGVudChcIiBcIiwgc3BhY2UsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBwcml2YXRlIGdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXI6IGFueSwga2V5OiBhbnksIGlzVG9wTGV2ZWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgd2l0aCBpdHMgdG9KU09OIHZhbHVlIGZpcnN0LCBpZiBwb3NzaWJsZVxuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUudG9KU09OICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB1c2VyLXN1cHBsaWVkIHJlcGxhY2VyIGlmIGEgZnVuY3Rpb24sIGNhbGwgaXQuIElmIGl0J3MgYW4gYXJyYXksIGNoZWNrIG9iamVjdHMnIHN0cmluZyBrZXlzIGZvclxuICAgICAgICAvLyBwcmVzZW5jZSBpbiB0aGUgYXJyYXkgKHJlbW92aW5nIHRoZSBrZXkvdmFsdWUgcGFpciBmcm9tIHRoZSByZXN1bHRpbmcgSlNPTiBpZiB0aGUga2V5IGlzIG1pc3NpbmcpLlxuICAgICAgICBpZiAodHlwZW9mICh0aGlzLnJlcGxhY2VyKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXBsYWNlcikge1xuICAgICAgICAgICAgaWYgKGlzVG9wTGV2ZWwgfHwgdGhpcy5pc0FycmF5KGhvbGRlcikgfHwgdGhpcy5yZXBsYWNlci5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNXb3JkQ2hhcihjaGFyOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcbiAgICAgICAgICAgIChjaGFyID49ICdBJyAmJiBjaGFyIDw9ICdaJykgfHxcbiAgICAgICAgICAgIChjaGFyID49ICcwJyAmJiBjaGFyIDw9ICc5JykgfHxcbiAgICAgICAgICAgIGNoYXIgPT09ICdfJyB8fCBjaGFyID09PSAnJCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1dvcmRTdGFydChjaGFyOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcbiAgICAgICAgICAgIChjaGFyID49ICdBJyAmJiBjaGFyIDw9ICdaJykgfHxcbiAgICAgICAgICAgIGNoYXIgPT09ICdfJyB8fCBjaGFyID09PSAnJCc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1dvcmQoa2V5OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzV29yZFN0YXJ0KGtleVswXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IDEsIGxlbmd0aCA9IGtleS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNXb3JkQ2hhcihrZXlbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBwb2x5ZmlsbHNcbiAgICBwcml2YXRlIGlzQXJyYXkob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRGF0ZShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzTmFOKHZhbDogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiB2YWwgIT09IHZhbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRm9yQ2lyY3VsYXIob2JqOiBhbnkpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9ialN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vYmpTdGFja1tpXSA9PT0gb2JqKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT05cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBtYWtlSW5kZW50KHN0cjogc3RyaW5nLCBudW06IG51bWJlciwgbm9OZXdMaW5lOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIGluZGVudGF0aW9uIG5vIG1vcmUgdGhhbiAxMCBjaGFyc1xuICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbmRlbnQgPSBub05ld0xpbmUgPyBcIlwiIDogXCJcXG5cIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xuICAgICAgICAgICAgaW5kZW50ICs9IHN0cjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRlbnQ7XG4gICAgfVxuXG4gICAgLy8gQ29waWVkIGZyb20gQ3Jva2ZvcmQncyBpbXBsZW1lbnRhdGlvbiBvZiBKU09OXG4gICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kb3VnbGFzY3JvY2tmb3JkL0pTT04tanMvYmxvYi9lMzlkYjRiN2U2MjQ5ZjA0YTE5NWU3ZGQwODQwZTYxMGNjOWU5NDFlL2pzb24yLmpzI0wxOTVcbiAgICAvLyBCZWdpblxuICAgIHByaXZhdGUgc3RhdGljIGN4ID0gL1tcXHUwMDAwXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZXNjYXBhYmxlID0gL1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4OWZcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcbiAgICBwcml2YXRlIHN0YXRpYyBtZXRhID0geyAvLyB0YWJsZSBvZiBjaGFyYWN0ZXIgc3Vic3RpdHV0aW9uc1xuICAgICAgICAnXFxiJzogJ1xcXFxiJyxcbiAgICAgICAgJ1xcdCc6ICdcXFxcdCcsXG4gICAgICAgICdcXG4nOiAnXFxcXG4nLFxuICAgICAgICAnXFxmJzogJ1xcXFxmJyxcbiAgICAgICAgJ1xccic6ICdcXFxccicsXG4gICAgICAgICdcIic6ICdcXFxcXCInLFxuICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcbiAgICB9O1xuICAgIHByaXZhdGUgZXNjYXBlU3RyaW5nKHN0cjogc3RyaW5nKSB7XG5cbiAgICAgICAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuICAgICAgICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxuICAgICAgICAvLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcbiAgICAgICAgLy8gc2VxdWVuY2VzLlxuICAgICAgICBTdXJ2ZXlKU09ONS5lc2NhcGFibGUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgcmV0dXJuIFN1cnZleUpTT041LmVzY2FwYWJsZS50ZXN0KHN0cikgPyAnXCInICsgc3RyLnJlcGxhY2UoU3VydmV5SlNPTjUuZXNjYXBhYmxlLCBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgdmFyIGMgPSBTdXJ2ZXlKU09ONS5tZXRhW2FdO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBjID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgICAgYyA6XG4gICAgICAgICAgICAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0ciArICdcIic7XG4gICAgfVxuICAgIC8vIEVuZFxuXG4gICAgcHJpdmF0ZSBpbnRlcm5hbFN0cmluZ2lmeShob2xkZXI6IGFueSwga2V5OiBhbnksIGlzVG9wTGV2ZWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdmFyIGJ1ZmZlciwgcmVzO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlLCBpZiBuZWNlc3NhcnlcbiAgICAgICAgdmFyIG9ial9wYXJ0ID0gdGhpcy5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQoaG9sZGVyLCBrZXksIGlzVG9wTGV2ZWwpO1xuXG4gICAgICAgIGlmIChvYmpfcGFydCAmJiAhdGhpcy5pc0RhdGUob2JqX3BhcnQpKSB7XG4gICAgICAgICAgICAvLyB1bmJveCBvYmplY3RzXG4gICAgICAgICAgICAvLyBkb24ndCB1bmJveCBkYXRlcywgc2luY2Ugd2lsbCB0dXJuIGl0IGludG8gbnVtYmVyXG4gICAgICAgICAgICBvYmpfcGFydCA9IG9ial9wYXJ0LnZhbHVlT2YoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiBvYmpfcGFydCkge1xuICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqX3BhcnQudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgIGlmIChpc05hTihvYmpfcGFydCkgfHwgIWlzRmluaXRlKG9ial9wYXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXNjYXBlU3RyaW5nKG9ial9wYXJ0LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICAgICAgaWYgKG9ial9wYXJ0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJheShvYmpfcGFydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckNpcmN1bGFyKG9ial9wYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gXCJbXCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucHVzaChvYmpfcGFydCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpfcGFydC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgaSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcyA9PT0gbnVsbCB8fCB0eXBlb2YgcmVzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwibnVsbFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBvYmpfcGFydC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwiLFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluZGVudFN0cikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIlxcblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoLCB0cnVlKSArIFwiXVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IFwie1wiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9uRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmpfcGFydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ial9wYXJ0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgcHJvcCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVG9wTGV2ZWwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9uRW1wdHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcEtleSA9IHRoaXMuaXNXb3JkKHByb3ApID8gcHJvcCA6IHRoaXMuZXNjYXBlU3RyaW5nKHByb3ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gcHJvcEtleSArIFwiOlwiICsgKHRoaXMuaW5kZW50U3RyID8gJyAnIDogJycpICsgdmFsdWUgKyBcIixcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vbkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBidWZmZXIuc3Vic3RyaW5nKDAsIGJ1ZmZlci5sZW5ndGggLSAxKSArIHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpICsgXCJ9XCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSAne30nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIC8vIGZ1bmN0aW9ucyBhbmQgdW5kZWZpbmVkIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanNvbjUudHMiLCJpbXBvcnQge1N1cnZleUpTT041fSBmcm9tIFwiLi9qc29uNVwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5RW1iZWRpbmdXaW5kb3cge1xuICAgIHByaXZhdGUganNvblZhbHVlOiBhbnk7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0hlYWQ6IEFjZUFqYXguRWRpdG9yO1xuICAgIHByaXZhdGUgc3VydmV5RW1iZWRpbmdKYXZhOiBBY2VBamF4LkVkaXRvcjtcbiAgICBrb0hlYWRUZXh0OiBhbnk7XG4gICAga29Cb2R5VGV4dDogYW55O1xuICAgIGtvSmF2YVRleHQ6IGFueTtcbiAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XG4gICAgcHVibGljIHN1cnZleVBvc3RJZDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgZ2VuZXJhdGVWYWxpZEpTT046IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBrb1Nob3dBc1dpbmRvdzogYW55O1xuICAgIGtvU2NyaXB0VXNpbmc6IGFueTtcbiAgICBrb0hhc0lkczogYW55O1xuICAgIGtvTG9hZFN1cnZleTogYW55O1xuICAgIGtvTGlicmFyeVZlcnNpb246IGFueTtcbiAgICBrb1Zpc2libGVIdG1sOiBhbnk7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5rb0xpYnJhcnlWZXJzaW9uID0ga28ub2JzZXJ2YWJsZShcImtub2Nrb3V0XCIpO1xuICAgICAgICB0aGlzLmtvU2hvd0FzV2luZG93ID0ga28ub2JzZXJ2YWJsZShcInBhZ2VcIik7XG4gICAgICAgIHRoaXMua29TY3JpcHRVc2luZyA9IGtvLm9ic2VydmFibGUoXCJib290c3RyYXBcIik7XG4gICAgICAgIHRoaXMua29IYXNJZHMgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb0xvYWRTdXJ2ZXkgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuICAgICAgICB0aGlzLmtvSGVhZFRleHQgPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xuICAgICAgICB0aGlzLmtvSmF2YVRleHQgPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xuICAgICAgICB0aGlzLmtvQm9keVRleHQgPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xuXG4gICAgICAgIHRoaXMua29WaXNpYmxlSHRtbCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uKCkgeyByZXR1cm4gc2VsZi5rb0xpYnJhcnlWZXJzaW9uKCkgPT0gXCJyZWFjdFwiIHx8IHNlbGYua29TaG93QXNXaW5kb3coKSA9PVwicGFnZVwiOyB9KTtcbiAgICAgICAgdGhpcy5rb0xpYnJhcnlWZXJzaW9uLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRIZWFkVGV4dCgpOyBzZWxmLnNldEphdmFUZXN0KCk7IH0pO1xuICAgICAgICB0aGlzLmtvU2hvd0FzV2luZG93LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRKYXZhVGVzdCgpOyB9KTtcbiAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRIZWFkVGV4dCgpOyBzZWxmLnNldEphdmFUZXN0KCk7IH0pO1xuICAgICAgICB0aGlzLmtvTG9hZFN1cnZleS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2V0SmF2YVRlc3QoKTsgfSk7XG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID0gbnVsbDtcbiAgICB9XG4gICAgcHVibGljIGdldCBqc29uKCk6IGFueSB7IHJldHVybiB0aGlzLmpzb25WYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQganNvbih2YWx1ZTogYW55KSB7IHRoaXMuanNvblZhbHVlID0gdmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0IGhhc0FjZUVkaXRvcigpOiBib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBhY2UgIT09IFwidW5kZWZpbmVkXCI7IH1cbiAgICBwdWJsaWMgc2hvdygpIHtcbiAgICAgICAgdmFyIGJvZHlFZGl0b3IgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5oYXNBY2VFZGl0b3IgJiYgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSGVhZFwiKTtcbiAgICAgICAgICAgIGJvZHlFZGl0b3IgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nQm9keVwiKTtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdKYXZhID0gdGhpcy5jcmVhdGVFZGl0b3IoXCJzdXJ2ZXlFbWJlZGluZ0phdmFcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb0hhc0lkcyh0aGlzLnN1cnZleUlkICYmIHRoaXMuc3VydmV5UG9zdElkKTtcbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IoYm9keUVkaXRvciwgdGhpcy5rb0JvZHlUZXh0LCBcIjxkaXYgaWQ9IFxcXCJteVN1cnZleUpTTmFtZVxcXCIgPjwvZGl2PlwiKTtcbiAgICAgICAgdGhpcy5zZXRIZWFkVGV4dCgpO1xuICAgICAgICB0aGlzLnNldEphdmFUZXN0KCk7XG4gICAgfVxuICAgIHByaXZhdGUgc2V0SGVhZFRleHQoKSB7XG4gICAgICAgIHZhciBzdHIgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5rb0xpYnJhcnlWZXJzaW9uKCkgPT0gXCJrbm9ja291dFwiKSB7XG4gICAgICAgICAgICBzdHIgPSBcIjxzY3JpcHQgc3JjPVxcXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcXFwiPjwvc2NyaXB0PlxcbjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkua28ubWluLmpzXFxcIj48L3NjcmlwdD5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IFwiPHNjcmlwdCBzcmM9XFxcImh0dHBzOi8vZmIubWUvcmVhY3QtMC4xNC44LmpzXFxcIj48L3NjcmlwdD5cXG48c2NyaXB0IHNyYz0gXFxcImh0dHBzOi8vZmIubWUvcmVhY3QtZG9tLTAuMTQuOC5qc1xcXCI+PC9zY3JpcHQ+XFxuPHNjcmlwdCBzcmM9XFxcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2JhYmVsLWNvcmUvNS44LjIzL2Jyb3dzZXIubWluLmpzXFxcIj48L3NjcmlwdD5cXG5cIjtcbiAgICAgICAgICAgIHN0ciArPSBcIjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkucmVhY3QubWluLmpzXFxcIj48L3NjcmlwdD5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5rb1NjcmlwdFVzaW5nKCkgIT0gXCJib290c3RyYXBcIikge1xuICAgICAgICAgICAgc3RyICs9IFwiXFxuPGxpbmsgaHJlZj1cXFwiY3NzL3N1cnZleS5jc3NcXFwiIHR5cGU9XFxcInRleHQvY3NzXFxcIiByZWw9XFxcInN0eWxlc2hlZXRcXFwiIC8+XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQsIHRoaXMua29IZWFkVGV4dCwgc3RyKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzZXRKYXZhVGVzdCgpIHtcbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEsIHRoaXMua29KYXZhVGV4dCwgdGhpcy5nZXRKYXZhVGV4dCgpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVFZGl0b3IoZWxlbWVudE5hbWU6IHN0cmluZyk6IEFjZUFqYXguRWRpdG9yIHtcbiAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnROYW1lKTtcbiAgICAgICAgZWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL21vbm9rYWlcIik7XG4gICAgICAgIGVkaXRvci5zZXNzaW9uLnNldE1vZGUoXCJhY2UvbW9kZS9qc29uXCIpO1xuICAgICAgICBlZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcbiAgICAgICAgZWRpdG9yLnJlbmRlcmVyLnNldFNob3dHdXR0ZXIoZmFsc2UpO1xuICAgICAgICBlZGl0b3Iuc2V0UmVhZE9ubHkodHJ1ZSk7XG4gICAgICAgIHJldHVybiBlZGl0b3I7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SmF2YVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGlzT25QYWdlID0gdGhpcy5rb1Nob3dBc1dpbmRvdygpID09IFwicGFnZVwiO1xuICAgICAgICB2YXIgc3RyID0gdGhpcy5rb0xpYnJhcnlWZXJzaW9uKCkgPT0gXCJrbm9ja291dFwiID8gdGhpcy5nZXRLbm9ja291dEphdmFUZXh0KGlzT25QYWdlKSA6IHRoaXMuZ2V0UmVhY3RKYXZhVGV4dChpc09uUGFnZSk7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNldENzcygpICsgc3RyO1xuICAgIH1cbiAgICBwcml2YXRlIGdldFNldENzcygpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5rb1NjcmlwdFVzaW5nKCkgIT0gXCJib290c3RyYXBcIikgcmV0dXJuIFwiXCI7XG4gICAgICAgIHJldHVybiBcIlN1cnZleS5TdXJ2ZXkuY3NzVHlwZSA9IFxcXCJib290c3RyYXBcXFwiO1xcblwiO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEtub2Nrb3V0SmF2YVRleHQoaXNPblBhZ2U6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICB2YXIgdGV4dCA9IGlzT25QYWdlID8gXCJ2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5TdXJ2ZXkoXFxuXCIgOiBcInZhciBzdXJ2ZXlXaW5kb3cgPSBuZXcgU3VydmV5LlN1cnZleVdpbmRvdyhcXG5cIjtcbiAgICAgICAgdGV4dCArPSB0aGlzLmdldEpzb25UZXh0KCk7XG4gICAgICAgIHRleHQgKz0gXCIpO1xcblwiO1xuICAgICAgICBpZiAoIWlzT25QYWdlKSB7XG4gICAgICAgICAgICB0ZXh0ICs9IFwic3VydmV5V2luZG93LlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzYXZlRnVuYyA9IHRoaXMuZ2V0U2F2ZUZ1bmNDb2RlKCk7XG4gICAgICAgIHRleHQgKz0gXCJzdXJ2ZXkub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKHMpIHtcXG5cIiArIHNhdmVGdW5jICsgXCJcXG4gfSk7XFxuXCI7XG4gICAgICAgIGlmIChpc09uUGFnZSkge1xuICAgICAgICAgICAgdGV4dCArPSBcInN1cnZleS5yZW5kZXIoXFxcIm15U3VydmV5SlNOYW1lXFxcIik7XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0ICs9IFwiLy9CeSBkZWZhdWx0IFN1cnZleS50aXRsZSBpcyB1c2VkLlxcblwiXG4gICAgICAgICAgICB0ZXh0ICs9IFwiLy9zdXJ2ZXlXaW5kb3cudGl0bGUgPSBcXFwiTXkgU3VydmV5IFdpbmRvdyBUaXRsZS5cXFwiO1xcblwiO1xuICAgICAgICAgICAgdGV4dCArPSBcInN1cnZleVdpbmRvdy5zaG93KCk7XCI7XG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRSZWFjdEphdmFUZXh0KGlzT25QYWdlOiBib29sZWFuKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIHNhdmVGdW5jID0gdGhpcy5nZXRTYXZlRnVuY0NvZGUoKTtcbiAgICAgICAgdmFyIHNlbmRSZXN1bHRUZXh0ID0gXCJ2YXIgc3VydmV5U2VuZFJlc3VsdCA9IGZ1bmN0aW9uIChzKSB7XFxuXCIgKyBzYXZlRnVuYyArIFwiXFxuIH0pO1xcblwiO1xuICAgICAgICB2YXIgbmFtZSA9IGlzT25QYWdlID8gXCJSZWFjdFN1cnZleVwiIDogXCJSZWFjdFN1cnZleVdpbmRvd1wiO1xuICAgICAgICB2YXIganNvblRleHQgPSBcInZhciBzdXJ2ZXlKc29uID0gXCIgKyB0aGlzLmdldEpzb25UZXh0KCkgKyBcIlxcblxcblwiO1xuICAgICAgICB2YXIgdGV4dCA9IGpzb25UZXh0ICsgc2VuZFJlc3VsdFRleHQgKyBcIlJlYWN0RE9NLnJlbmRlcihcXG48XCIgKyBuYW1lICsgXCIganNvbj17c3VydmV5SnNvbn0gb25Db21wbGV0ZT17c3VydmV5U2VuZFJlc3VsdH0gLz4sIFxcbiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwibXlTdXJ2ZXlKU05hbWVcXFwiKSk7XCI7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBwcml2YXRlIGdldFNhdmVGdW5jQ29kZSgpIHtcbiAgICAgICAgaWYgKHRoaXMua29IYXNJZHMoKSkgcmV0dXJuIFwic3VydmV5LnNlbmRSZXN1bHQoJ1wiICsgdGhpcy5zdXJ2ZXlQb3N0SWQgKyBcIicpO1wiO1xuICAgICAgICByZXR1cm4gXCJhbGVydChcXFwiVGhlIHJlc3VsdHMgYXJlOlxcXCIgKyBKU09OLnN0cmluZ2lmeShzLmRhdGEpKTtcIjtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRKc29uVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5rb0hhc0lkcygpICYmIHRoaXMua29Mb2FkU3VydmV5KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBcInsgc3VydmV5SWQ6ICdcIiArIHRoaXMuc3VydmV5SWQgKyBcIid9XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVWYWxpZEpTT04pIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmpzb24pO1xuICAgICAgICByZXR1cm4gbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KHRoaXMuanNvbik7XG4gICAgfVxuICAgIHByaXZhdGUgc2V0VGV4dFRvRWRpdG9yKGVkaXRvcjogQWNlQWpheC5FZGl0b3IsIGtvVGV4dDogYW55LCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKGVkaXRvcikgZWRpdG9yLnNldFZhbHVlKHRleHQpO1xuICAgICAgICBpZiAoa29UZXh0KSBrb1RleHQodGV4dCk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXlFbWJlZGluZ1dpbmRvdy50cyIsImltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCB7U3VydmV5SGVscGVyLCBPYmpUeXBlfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJicyB7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcbiAgICBwcml2YXRlIG9ialZhbHVlOiBhbnk7XG4gICAgcHJpdmF0ZSBjaG9pY2VzQ2xhc3NlczogQXJyYXk8c3RyaW5nPjtcbiAgICBrb1ZlcmJzOiBhbnk7XG4gICAga29IYXNWZXJiczogYW55O1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueSkge1xuICAgICAgICB0aGlzLmtvVmVyYnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb0hhc1ZlcmJzID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB2YXIgY2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInNlbGVjdGJhc2VcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuY2hvaWNlc0NsYXNzZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNob2ljZXNDbGFzc2VzLnB1c2goY2xhc3Nlc1tpXS5uYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgPT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IG9iaigpOiBhbnkgeyByZXR1cm4gdGhpcy5vYmpWYWx1ZSB9XG4gICAgcHVibGljIHNldCBvYmoodmFsdWU6IGFueSkge1xuICAgICAgICBpZiAodGhpcy5vYmpWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLm9ialZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuYnVpbGRWZXJicygpO1xuICAgIH1cbiAgICBwcml2YXRlIGJ1aWxkVmVyYnMoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKHRoaXMub2JqKTtcbiAgICAgICAgaWYgKG9ialR5cGUgPT0gT2JqVHlwZS5RdWVzdGlvbikge1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkJhc2U+dGhpcy5vYmo7XG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbSh0aGlzLnN1cnZleSwgcXVlc3Rpb24sIHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzQ2xhc3Nlcy5pbmRleE9mKHF1ZXN0aW9uLmdldFR5cGUoKSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbSh0aGlzLnN1cnZleSwgcXVlc3Rpb24sIHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb1ZlcmJzKGFycmF5KTtcbiAgICAgICAgdGhpcy5rb0hhc1ZlcmJzKGFycmF5Lmxlbmd0aCA+IDApO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiSXRlbSB7XG4gICAga29JdGVtczogYW55O1xuICAgIGtvU2VsZWN0ZWRJdGVtOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBwdWJsaWMgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnkpIHtcbiAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0gPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gXCJcIjsgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbSBleHRlbmRzIFN1cnZleVZlcmJJdGVtIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueSkge1xuICAgICAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uLCBvbk1vZGlmaWVkQ2FsbGJhY2spO1xuICAgICAgICB2YXIgY2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInNlbGVjdGJhc2VcIiwgdHJ1ZSk7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFycmF5LnB1c2goeyB2YWx1ZTogY2xhc3Nlc1tpXS5uYW1lLCB0ZXh0OiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicXQuXCIgKyBjbGFzc2VzW2ldLm5hbWUpIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0ocXVlc3Rpb24uZ2V0VHlwZSgpKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5jaGFuZ2VUeXBlKG5ld1ZhbHVlKTsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnZlcmJDaGFuZ2VUeXBlXCIpOyB9XG4gICAgcHJpdmF0ZSBjaGFuZ2VUeXBlKHF1ZXN0aW9uVHlwZTogc3RyaW5nKSB7XG4gICAgICAgIGlmIChxdWVzdGlvblR5cGUgPT0gdGhpcy5xdWVzdGlvbi5nZXRUeXBlKCkpIHJldHVybjtcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZih0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgdmFyIG5ld1F1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIHRoaXMucXVlc3Rpb24ubmFtZSk7XG4gICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XG4gICAgICAgIHZhciBqc29uID0ganNvbk9iai50b0pzb25PYmplY3QodGhpcy5xdWVzdGlvbik7XG4gICAgICAgIGpzb25PYmoudG9PYmplY3QoanNvbiwgbmV3UXVlc3Rpb24pO1xuICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICBwYWdlLmFkZFF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBpbmRleCk7XG4gICAgICAgIGlmICh0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaykgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2soKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtIGV4dGVuZHMgU3VydmV5VmVyYkl0ZW0ge1xuICAgIHByaXZhdGUgcHJldlBhZ2U6IFN1cnZleS5QYWdlO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XG4gICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24sIG9uTW9kaWZpZWRDYWxsYmFjayk7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5LnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LnBhZ2VzW2ldO1xuICAgICAgICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBwYWdlLCB0ZXh0OiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xuICAgICAgICB0aGlzLnByZXZQYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSh0aGlzLnByZXZQYWdlKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5jaGFuZ2VQYWdlKG5ld1ZhbHVlKTsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnZlcmJDaGFuZ2VQYWdlXCIpOyB9XG4gICAgcHJpdmF0ZSBjaGFuZ2VQYWdlKG5ld1BhZ2U6IFN1cnZleS5QYWdlKSB7XG4gICAgICAgIGlmIChuZXdQYWdlID09IG51bGwgfHwgbmV3UGFnZSA9PSB0aGlzLnByZXZQYWdlKSByZXR1cm47XG4gICAgICAgIHRoaXMucHJldlBhZ2UucmVtb3ZlUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XG4gICAgICAgIG5ld1BhZ2UuYWRkUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XG4gICAgICAgIGlmICh0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaykgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2soKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29iamVjdFZlcmJzLnRzIiwiaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVVuZG9SZWRvIHtcbiAgICBwcml2YXRlIGl0ZW1zOiBBcnJheTxVbmRvUmVkb0l0ZW0+O1xuICAgIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgIHB1YmxpYyBrb0NhblVuZG86IGFueTsga29DYW5SZWRvOiBhbnk7XG4gICAgcHVibGljIG1heGltdW1Db3VudDogbnVtYmVyID0gMTA7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5rb0NhblVuZG8gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb0NhblJlZG8gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICB9XG4gICAgcHVibGljIGNsZWFyKCkge1xuICAgICAgICB0aGlzLml0ZW1zID0gW107XG4gICAgICAgIHRoaXMua29DYW5VbmRvKGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb0NhblJlZG8oZmFsc2UpO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0Q3VycmVudChzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHNlbGVjdGVkT2JqTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBpdGVtID0gbmV3IFVuZG9SZWRvSXRlbSgpO1xuICAgICAgICBpdGVtLnN1cnZleUpTT04gPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3Qoc3VydmV5KTtcbiAgICAgICAgaXRlbS5zZWxlY3RlZE9iak5hbWUgPSBzZWxlY3RlZE9iak5hbWU7XG4gICAgICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnNwbGljZSh0aGlzLmluZGV4ICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICB0aGlzLnJlbW92ZU9sZERhdGEoKTtcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcbiAgICAgICAgdGhpcy51cGRhdGVDYW5VbmRvUmVkbygpO1xuICAgIH1cbiAgICBwdWJsaWMgdW5kbygpOiBVbmRvUmVkb0l0ZW0ge1xuICAgICAgICBpZiAoIXRoaXMuY2FuVW5kbykgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLmRvVW5kb1JlZG8oLTEpO1xuICAgIH1cbiAgICBwdWJsaWMgcmVkbygpOiBVbmRvUmVkb0l0ZW0gIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhblJlZG8pIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gdGhpcy5kb1VuZG9SZWRvKDEpO1xuICAgIH1cbiAgICBwcml2YXRlIHVwZGF0ZUNhblVuZG9SZWRvKCkge1xuICAgICAgICB0aGlzLmtvQ2FuVW5kbyh0aGlzLmNhblVuZG8pO1xuICAgICAgICB0aGlzLmtvQ2FuUmVkbyh0aGlzLmNhblJlZG8pO1xuICAgIH1cbiAgICBwcml2YXRlIGRvVW5kb1JlZG8oZEluZGV4OiBudW1iZXIpOiBVbmRvUmVkb0l0ZW0ge1xuICAgICAgICB0aGlzLmluZGV4ICs9IGRJbmRleDtcbiAgICAgICAgdGhpcy51cGRhdGVDYW5VbmRvUmVkbygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA+PSAwICYmIHRoaXMuaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCA/IHRoaXMuaXRlbXNbdGhpcy5pbmRleF0gOiBudWxsO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0IGNhblVuZG8oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ID49IDEgJiYgdGhpcy5pbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0IGNhblJlZG8oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmxlbmd0aCA+IDEgJiYgdGhpcy5pbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoIC0gMTtcbiAgICB9XG4gICAgcHJpdmF0ZSByZW1vdmVPbGREYXRhKCkge1xuICAgICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggLSAxIDwgdGhpcy5tYXhpbXVtQ291bnQpIHJldHVybjtcbiAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoMCwgdGhpcy5pdGVtcy5sZW5ndGggLSB0aGlzLm1heGltdW1Db3VudCAtIDEpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVuZG9SZWRvSXRlbSB7XG4gICAgc3VydmV5SlNPTjogYW55O1xuICAgIHNlbGVjdGVkT2JqTmFtZTogc3RyaW5nO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91bmRvcmVkby50cyIsImltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcclxuaW1wb3J0IHtTdXJ2ZXlPYmplY3RFZGl0b3J9IGZyb20gXCIuL29iamVjdEVkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleVBhZ2VzRWRpdG9yfSBmcm9tIFwiLi9wYWdlc0VkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleUVtYmVkaW5nV2luZG93fSBmcm9tIFwiLi9zdXJ2ZXlFbWJlZGluZ1dpbmRvd1wiO1xyXG5pbXBvcnQge1N1cnZleU9iamVjdHN9IGZyb20gXCIuL3N1cnZleU9iamVjdHNcIjtcclxuaW1wb3J0IHtTdXJ2ZXlWZXJic30gZnJvbSBcIi4vb2JqZWN0VmVyYnNcIjtcclxuaW1wb3J0IHtTdXJ2ZXlKU09ORWRpdG9yfSBmcm9tIFwiLi9zdXJ2ZXlKU09ORWRpdG9yXCI7XHJcbmltcG9ydCB7U3VydmV5VGV4dFdvcmtlcn0gZnJvbSBcIi4vdGV4dFdvcmtlclwiXHJcbmltcG9ydCB7U3VydmV5VW5kb1JlZG8sIFVuZG9SZWRvSXRlbX0gZnJvbSBcIi4vdW5kb3JlZG9cIjtcclxuaW1wb3J0IHtTdXJ2ZXlIZWxwZXIsIE9ialR5cGV9IGZyb20gXCIuL3N1cnZleUhlbHBlclwiO1xyXG5pbXBvcnQge0RyYWdEcm9wSGVscGVyfSBmcm9tIFwiLi9kcmFnZHJvcGhlbHBlclwiO1xyXG5pbXBvcnQge1N1cnZleUpTT041fSBmcm9tIFwiLi9qc29uNVwiO1xyXG5pbXBvcnQge2h0bWwgYXMgdGVtcGxhdGVFZGl0b3JIdG1sfSBmcm9tIFwiLi90ZW1wbGF0ZUVkaXRvci5rby5odG1sXCI7XHJcbmltcG9ydCB7aHRtbCBhcyB0ZW1wbGF0ZVBhZ2VIdG1sfSBmcm9tIFwiLi90ZW1wbGF0ZV9wYWdlLmh0bWxcIjtcclxuaW1wb3J0IHtodG1sIGFzIHRlbXBsYXRlUXVlc3Rpb25IdG1sfSBmcm9tIFwiLi90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5RWRpdG9yIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdE5ld1N1cnZleVRleHQ6IHN0cmluZyA9IFwieyBwYWdlczogWyB7IG5hbWU6ICdwYWdlMSd9XSB9XCI7XHJcbiAgICBwcml2YXRlIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHN1cnZleWpzOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgc3VydmV5anNFeGFtcGxlOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIGpzb25FZGl0b3I6IFN1cnZleUpTT05FZGl0b3I7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XHJcbiAgICBwcml2YXRlIHBhZ2VzRWRpdG9yOiBTdXJ2ZXlQYWdlc0VkaXRvcjtcclxuICAgIHByaXZhdGUgc3VydmV5RW1iZWRpbmc6IFN1cnZleUVtYmVkaW5nV2luZG93O1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlPYmplY3RzOiBTdXJ2ZXlPYmplY3RzO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlWZXJiczogU3VydmV5VmVyYnM7XHJcbiAgICBwcml2YXRlIHVuZG9SZWRvOiBTdXJ2ZXlVbmRvUmVkbztcclxuICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICBwcml2YXRlIHNhdmVTdXJ2ZXlGdW5jVmFsdWU6IChubzogbnVtYmVyLCBvblNhdmVDYWxsYmFjazogKG5vOiBudW1iZXIsIGlzU3VjY2VzczogYm9vbGVhbikgPT4gdm9pZCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgb3B0aW9uczogYW55O1xyXG4gICAgcHJpdmF0ZSBzdGF0ZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBkcmFnRHJvcEhlbHBlcjogRHJhZ0Ryb3BIZWxwZXIgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBzaG93SlNPTkVkaXRvclRhYlZhbHVlOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBzaG93VGVzdFN1cnZleVRhYlZhbHVlOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBzaG93RW1iZWRlZFN1cnZleVRhYlZhbHVlOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBzdXJ2ZXlQb3N0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25UeXBlczogc3RyaW5nW107XHJcbiAgICBwdWJsaWMga29Db3BpZWRRdWVzdGlvbnM6IGFueTtcclxuICAgIHB1YmxpYyBnZW5lcmF0ZVZhbGlkSlNPTkNoYW5nZWRDYWxsYmFjazogKGdlbmVyYXRlVmFsaWRKU09OOiBib29sZWFuKSA9PiB2b2lkO1xyXG4gICAgcHVibGljIGFsd2F5U2F2ZVRleHRJblByb3BlcnR5RWRpdG9yczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHVibGljIG9uQ2FuU2hvd1Byb3BlcnR5OiBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG5cclxuICAgIGtvSXNTaG93RGVzaWduZXI6IGFueTtcclxuICAgIGtvVmlld1R5cGU6IGFueTtcclxuICAgIGtvQ2FuRGVsZXRlT2JqZWN0OiBhbnk7XHJcbiAgICBrb09iamVjdHM6IGFueTsga29TZWxlY3RlZE9iamVjdDogYW55O1xyXG4gICAga29TaG93U2F2ZUJ1dHRvbjogYW55O1xyXG4gICAga29HZW5lcmF0ZVZhbGlkSlNPTjogYW55OyBrb1Nob3dPcHRpb25zOiBhbnk7IGtvVGVzdFN1cnZleVdpZHRoOiBhbnk7XHJcbiAgICBzZWxlY3REZXNpZ25lckNsaWNrOiBhbnk7IHNlbGVjdEVkaXRvckNsaWNrOiBhbnk7IHNlbGVjdFRlc3RDbGljazogYW55OyBzZWxlY3RFbWJlZENsaWNrOiBhbnk7XHJcbiAgICBnZW5lcmF0ZVZhbGlkSlNPTkNsaWNrOiBhbnk7IGdlbmVyYXRlUmVhZGFibGVKU09OQ2xpY2s6IGFueTtcclxuICAgIGRvVW5kb0NsaWNrOiBhbnk7IGRvUmVkb0NsaWNrOiBhbnk7XHJcbiAgICBkZWxldGVPYmplY3RDbGljazogYW55O1xyXG4gICAga29TdGF0ZTogYW55O1xyXG4gICAgcnVuU3VydmV5Q2xpY2s6IGFueTsgZW1iZWRpbmdTdXJ2ZXlDbGljazogYW55O1xyXG4gICAgc2F2ZUJ1dHRvbkNsaWNrOiBhbnk7XHJcbiAgICBkcmFnZ2luZ1F1ZXN0aW9uOiBhbnk7IGNsaWNrUXVlc3Rpb246IGFueTtcclxuICAgIGRyYWdnaW5nQ29waWVkUXVlc3Rpb246IGFueTsgY2xpY2tDb3BpZWRRdWVzdGlvbjogYW55O1xyXG4gICAgZHJhZ0VuZDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCwgb3B0aW9uczogYW55ID0gbnVsbCkge1xyXG5cclxuICAgICAgICB0aGlzLmtvU2hvd09wdGlvbnMgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb0dlbmVyYXRlVmFsaWRKU09OID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmtvQ29waWVkUXVlc3Rpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5rb0NhbkRlbGV0ZU9iamVjdCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMua29TdGF0ZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvU2hvd1NhdmVCdXR0b24gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvVGVzdFN1cnZleVdpZHRoID0ga28ub2JzZXJ2YWJsZShcIjEwMCVcIik7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZG9TYXZlKCk7IH07XHJcbiAgICAgICAgdGhpcy5rb09iamVjdHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRPYmplY3QgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkT2JqZWN0LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdENoYW5nZWQobmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbHVlIDogbnVsbCk7IH0pO1xyXG4gICAgICAgIHRoaXMua29HZW5lcmF0ZVZhbGlkSlNPTi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5vcHRpb25zKSBzZWxmLm9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmdlbmVyYXRlVmFsaWRKU09OQ2hhbmdlZENhbGxiYWNrKSBzZWxmLmdlbmVyYXRlVmFsaWRKU09OQ2hhbmdlZENhbGxiYWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSBuZXcgU3VydmV5T2JqZWN0cyh0aGlzLmtvT2JqZWN0cywgdGhpcy5rb1NlbGVjdGVkT2JqZWN0KTtcclxuICAgICAgICB0aGlzLnVuZG9SZWRvID0gbmV3IFN1cnZleVVuZG9SZWRvKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMgPSBuZXcgU3VydmV5VmVyYnMoZnVuY3Rpb24gKCkgeyBzZWxmLnNldE1vZGlmaWVkKCk7IH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yID0gbmV3IFN1cnZleU9iamVjdEVkaXRvcih0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25DYW5TaG93UHJvcGVydHlDYWxsYmFjayA9IGZ1bmN0aW9uIChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub25DYW5TaG93T2JqZWN0UHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucGFnZXNFZGl0b3IgPSBuZXcgU3VydmV5UGFnZXNFZGl0b3IoKCkgPT4geyBzZWxmLmFkZFBhZ2UoKTsgfSwgKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QocGFnZSk7IH0sXHJcbiAgICAgICAgICAgIChpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSA9PiB7IHNlbGYubW92ZVBhZ2UoaW5kZXhGcm9tLCBpbmRleFRvKTsgfSwgKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB7IHNlbGYuZGVsZXRlQ3VycmVudE9iamVjdCgpOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nID0gbmV3IFN1cnZleUVtYmVkaW5nV2luZG93KCk7XHJcblxyXG4gICAgICAgIHRoaXMua29WaWV3VHlwZSA9IGtvLm9ic2VydmFibGUoXCJkZXNpZ25lclwiKTtcclxuICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmtvVmlld1R5cGUoKSA9PSBcImRlc2lnbmVyXCI7IH0pO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RGVzaWduZXJDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93RGVzaWduZXIoKTsgfTtcclxuICAgICAgICB0aGlzLnNlbGVjdEVkaXRvckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dKc29uRWRpdG9yKCk7IH07XHJcbiAgICAgICAgdGhpcy5zZWxlY3RUZXN0Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd1Rlc3RTdXJ2ZXkoKTsgfTtcclxuICAgICAgICB0aGlzLnNlbGVjdEVtYmVkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0VtYmVkRWRpdG9yKCk7IH07XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVZhbGlkSlNPTkNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmtvR2VuZXJhdGVWYWxpZEpTT04odHJ1ZSk7IH07XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVJlYWRhYmxlSlNPTkNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmtvR2VuZXJhdGVWYWxpZEpTT04oZmFsc2UpOyB9O1xyXG4gICAgICAgIHRoaXMucnVuU3VydmV5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0xpdmVTdXJ2ZXkoKTsgfTtcclxuICAgICAgICB0aGlzLmVtYmVkaW5nU3VydmV5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd1N1cnZleUVtYmVkaW5nKCk7IH07XHJcbiAgICAgICAgdGhpcy5kZWxldGVPYmplY3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kZWxldGVDdXJyZW50T2JqZWN0KCk7IH07XHJcbiAgICAgICAgdGhpcy5kcmFnZ2luZ1F1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9uVHlwZSwgZSkgeyBzZWxmLmRvRHJhZ2dpbmdRdWVzdGlvbihxdWVzdGlvblR5cGUsIGUpOyB9O1xyXG4gICAgICAgIHRoaXMuY2xpY2tRdWVzdGlvbiA9IGZ1bmN0aW9uIChxdWVzdGlvblR5cGUpIHsgc2VsZi5kb0NsaWNrUXVlc3Rpb24ocXVlc3Rpb25UeXBlKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdnaW5nQ29waWVkUXVlc3Rpb24gPSBmdW5jdGlvbiAoaXRlbSwgZSkgeyBzZWxmLmRvRHJhZ2dpbmdDb3BpZWRRdWVzdGlvbihpdGVtLmpzb24sIGUpOyB9O1xyXG4gICAgICAgIHRoaXMuY2xpY2tDb3BpZWRRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYuZG9DbGlja0NvcGllZFF1ZXN0aW9uKGl0ZW0uanNvbik7IH07XHJcbiAgICAgICAgdGhpcy5kcmFnRW5kID0gZnVuY3Rpb24gKGl0ZW0sIGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlci5lbmQoKTsgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kb1VuZG9DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kb1VuZG9SZWRvKHNlbGYudW5kb1JlZG8udW5kbygpKTsgfTtcclxuICAgICAgICB0aGlzLmRvUmVkb0NsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRvVW5kb1JlZG8oc2VsZi51bmRvUmVkby5yZWRvKCkpOyB9O1xyXG5cclxuICAgICAgICB0aGlzLmpzb25FZGl0b3IgPSBuZXcgU3VydmV5SlNPTkVkaXRvcigpO1xyXG5cclxuICAgICAgICBpZiAocmVuZGVyZWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldE9wdGlvbnMob3B0aW9uczogYW55KSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uVHlwZXMgPSB0aGlzLmdldFF1ZXN0aW9uVHlwZXMoKTtcclxuICAgICAgICB0aGlzLnNob3dKU09ORWRpdG9yVGFiVmFsdWUgPSBvcHRpb25zICYmIHR5cGVvZiAob3B0aW9ucy5zaG93SlNPTkVkaXRvclRhYikgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zaG93SlNPTkVkaXRvclRhYiA6IHRydWU7XHJcbiAgICAgICAgdGhpcy5zaG93VGVzdFN1cnZleVRhYlZhbHVlID0gb3B0aW9ucyAmJiB0eXBlb2YgKG9wdGlvbnMuc2hvd1Rlc3RTdXJ2ZXlUYWIpICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2hvd1Rlc3RTdXJ2ZXlUYWIgOiB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2hvd0VtYmVkZWRTdXJ2ZXlUYWJWYWx1ZSA9IG9wdGlvbnMgJiYgdHlwZW9mIChvcHRpb25zLnNob3dFbWJlZGVkU3VydmV5VGFiKSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNob3dFbWJlZGVkU3VydmV5VGFiIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5rb1Nob3dPcHRpb25zKG9wdGlvbnMgJiYgdHlwZW9mIChvcHRpb25zLnNob3dPcHRpb25zKSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNob3dPcHRpb25zIDogZmFsc2UpO1xyXG4gICAgICAgIHRoaXMua29HZW5lcmF0ZVZhbGlkSlNPTih0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OKTtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvcikgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwsIG9wdGlvbnM6IGFueSA9IG51bGwpIHtcclxuICAgICAgICBpZiAob3B0aW9ucykgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlZEVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XHJcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZUVkaXRvckh0bWw7XHJcbiAgICAgICAgc2VsZi5hcHBseUJpbmRpbmcoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgbmV3IFN1cnZleS5keFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnRleHQgPSBKU09OLnN0cmluZ2lmeShyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRleHQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSByZXR1cm4gdGhpcy5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuanNvbkVkaXRvci50ZXh0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdGV4dFdvcmtlciA9IG5ldyBTdXJ2ZXlUZXh0V29ya2VyKHZhbHVlKTtcclxuICAgICAgICBpZiAodGV4dFdvcmtlci5pc0pzb25Db3JyZWN0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGV4dFdvcmtlci5zdXJ2ZXkpKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93RGVzaWduZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRVbmRvUmVkb0N1cnJlbnRTdGF0ZSh0cnVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldFRleHRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29WaWV3VHlwZShcImVkaXRvclwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHN0YXRlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnN0YXRlVmFsdWU7IH1cclxuICAgIHByb3RlY3RlZCBzZXRTdGF0ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5rb1N0YXRlKHRoaXMuc3RhdGUpO1xyXG4gICAgfVxyXG4gICAgc2F2ZU5vOiBudW1iZXIgPSAwO1xyXG4gICAgcHJvdGVjdGVkIGRvU2F2ZSgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKFwic2F2aW5nXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLnNhdmVTdXJ2ZXlGdW5jKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZU5vKys7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zYXZlU3VydmV5RnVuYyh0aGlzLnNhdmVObyxcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRvU2F2ZUNhbGxiYWNrKG5vOiBudW1iZXIsIGlzU3VjY2VzczogYm9vbGVhbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoXCJzYXZlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zYXZlTm8gPT0gbm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzU3VjY2Vzcykgc2VsZi5zZXRTdGF0ZShcInNhdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2Vsc2UgVE9ET1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzZXRNb2RpZmllZCgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKFwibW9kaWZpZWRcIik7XHJcbiAgICAgICAgdGhpcy5zZXRVbmRvUmVkb0N1cnJlbnRTdGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRVbmRvUmVkb0N1cnJlbnRTdGF0ZShjbGVhclN0YXRlOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoY2xlYXJTdGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnVuZG9SZWRvLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzZWxPYmogPSB0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKSA/IHRoaXMua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlIDogbnVsbDtcclxuICAgICAgICB0aGlzLnVuZG9SZWRvLnNldEN1cnJlbnQodGhpcy5zdXJ2ZXlWYWx1ZSwgc2VsT2JqID8gc2VsT2JqLm5hbWUgOiBudWxsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc2F2ZVN1cnZleUZ1bmMoKSB7IHJldHVybiB0aGlzLnNhdmVTdXJ2ZXlGdW5jVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2F2ZVN1cnZleUZ1bmModmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2F2ZVN1cnZleUZ1bmNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMua29TaG93U2F2ZUJ1dHRvbih2YWx1ZSAhPSBudWxsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd09wdGlvbnMoKSB7IHJldHVybiB0aGlzLmtvU2hvd09wdGlvbnMoKTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93T3B0aW9ucyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLmtvU2hvd09wdGlvbnModmFsdWUpOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dKU09ORWRpdG9yVGFiKCkgeyByZXR1cm4gdGhpcy5zaG93SlNPTkVkaXRvclRhYlZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHNob3dKU09ORWRpdG9yVGFiKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuc2hvd0pTT05FZGl0b3JUYWJWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dUZXN0U3VydmV5VGFiKCkgeyByZXR1cm4gdGhpcy5zaG93VGVzdFN1cnZleVRhYlZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHNob3dUZXN0U3VydmV5VGFiKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuc2hvd1Rlc3RTdXJ2ZXlUYWJWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dFbWJlZGVkU3VydmV5VGFiKCkgeyByZXR1cm4gdGhpcy5zaG93RW1iZWRlZFN1cnZleVRhYlZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHNob3dFbWJlZGVkU3VydmV5VGFiKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuc2hvd0VtYmVkZWRTdXJ2ZXlUYWJWYWx1ZSA9IHZhbHVlOyB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uQ2FuU2hvd09iamVjdFByb3BlcnR5KG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0geyBvYmo6IG9iamVjdCwgcHJvcGVydHk6IHByb3BlcnR5LCBuYW1lOiBwcm9wZXJ0eS5uYW1lLCBjYW5TaG93OiB0cnVlIH07XHJcbiAgICAgICAgdGhpcy5vbkNhblNob3dQcm9wZXJ0eS5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zLmNhblNob3c7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRUZXh0VmFsdWUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuanNvbkVkaXRvci50ZXh0ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkUGFnZSgpIHtcclxuICAgICAgICB2YXIgbmFtZSA9IFN1cnZleUhlbHBlci5nZXROZXdQYWdlTmFtZSh0aGlzLnN1cnZleS5wYWdlcyk7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXlWYWx1ZS5hZGROZXdQYWdlKG5hbWUpO1xyXG4gICAgICAgIHRoaXMuYWRkUGFnZVRvVUkocGFnZSk7XHJcbiAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldExvY1N0cmluZyhzdHI6IHN0cmluZykgeyByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhzdHIpOyB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UXVlc3Rpb25UeXBlcygpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgdmFyIGFsbFR5cGVzID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5nZXRBbGxUeXBlcygpO1xyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zIHx8ICF0aGlzLm9wdGlvbnMucXVlc3Rpb25UeXBlcyB8fCAhdGhpcy5vcHRpb25zLnF1ZXN0aW9uVHlwZXMubGVuZ3RoKSByZXR1cm4gYWxsVHlwZXM7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLnF1ZXN0aW9uVHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uVHlwZSA9IHRoaXMub3B0aW9ucy5xdWVzdGlvblR5cGVzW2ldO1xyXG4gICAgICAgICAgICBpZiAoYWxsVHlwZXMuaW5kZXhPZihxdWVzdGlvblR5cGUpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHF1ZXN0aW9uVHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgbW92ZVBhZ2UoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikge1xyXG4gICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LnBhZ2VzW2luZGV4RnJvbV07XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucGFnZXMuc3BsaWNlKGluZGV4RnJvbSwgMSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucGFnZXMuc3BsaWNlKGluZGV4VG8sIDAsIHBhZ2UpO1xyXG4gICAgICAgIHRoaXMucGFnZXNFZGl0b3Iuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChwYWdlKVxyXG4gICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYWRkUGFnZVRvVUkocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5VmFsdWU7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLmFkZFBhZ2UocGFnZSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUXVlc3Rpb25BZGRlZChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuYWRkUXVlc3Rpb24ocGFnZSwgcXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5yZW1vdmVPYmplY3QocXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblByb3BlcnR5VmFsdWVDaGFuZ2VkKHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvYmo6IGFueSwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgIHZhciBpc0RlZmF1bHQgPSBwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgb2JqW3Byb3BlcnR5Lm5hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5Lm5hbWUgPT0gXCJuYW1lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLm5hbWVDaGFuZ2VkKG9iaik7XHJcbiAgICAgICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5jaGFuZ2VOYW1lKDxTdXJ2ZXkuUGFnZT5vYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcclxuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9VbmRvUmVkbyhpdGVtOiBVbmRvUmVkb0l0ZW0pIHtcclxuICAgICAgICB0aGlzLmluaXRTdXJ2ZXkoaXRlbS5zdXJ2ZXlKU09OKTtcclxuICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZE9iak5hbWUpIHtcclxuICAgICAgICAgICAgdmFyIHNlbE9iaiA9IHRoaXMuZmluZE9iakJ5TmFtZShpdGVtLnNlbGVjdGVkT2JqTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxPYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3Qoc2VsT2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMudW5kb1JlZG8ua29DYW5VbmRvKCkgPyBcIm1vZGlmaWVkXCIgOiBcInNhdmVkXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaW5kT2JqQnlOYW1lKG5hbWU6IHN0cmluZyk6IFN1cnZleS5CYXNlIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeU5hbWUobmFtZSk7XHJcbiAgICAgICAgaWYgKHBhZ2UpIHJldHVybiBwYWdlO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPnRoaXMuc3VydmV5LmdldFF1ZXN0aW9uQnlOYW1lKG5hbWUpO1xyXG4gICAgICAgIGlmIChxdWVzdGlvbikgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjYW5Td2l0Y2hWaWV3VHlwZShuZXdUeXBlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAobmV3VHlwZSAmJiB0aGlzLmtvVmlld1R5cGUoKSA9PSBuZXdUeXBlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMua29WaWV3VHlwZSgpICE9IFwiZWRpdG9yXCIpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICghdGhpcy5qc29uRWRpdG9yLmlzSnNvbkNvcnJlY3QpIHtcclxuICAgICAgICAgICAgYWxlcnQodGhpcy5nZXRMb2NTdHJpbmcoXCJlZC5jb3JyZWN0SlNPTlwiKSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0U3VydmV5KG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLmpzb25FZGl0b3Iuc3VydmV5KSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNob3dEZXNpZ25lcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuU3dpdGNoVmlld1R5cGUoXCJkZXNpZ25lclwiKSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMua29WaWV3VHlwZShcImRlc2lnbmVyXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93SnNvbkVkaXRvcigpIHtcclxuICAgICAgICBpZiAodGhpcy5rb1ZpZXdUeXBlKCkgPT0gXCJlZGl0b3JcIikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuanNvbkVkaXRvci5zaG93KHRoaXMuZ2V0U3VydmV5VGV4dEZyb21EZXNpZ25lcigpKTtcclxuICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJlZGl0b3JcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNob3dUZXN0U3VydmV5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW5Td2l0Y2hWaWV3VHlwZShudWxsKSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2hvd0xpdmVTdXJ2ZXkoKTtcclxuICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJ0ZXN0XCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93RW1iZWRFZGl0b3IoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhblN3aXRjaFZpZXdUeXBlKFwiZW1iZWRcIikpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNob3dTdXJ2ZXlFbWJlZGluZygpO1xyXG4gICAgICAgIHRoaXMua29WaWV3VHlwZShcImVtYmVkXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCkge1xyXG4gICAgICAgIHZhciBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5nZW5lcmF0ZVZhbGlkSlNPTikgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDEpO1xyXG4gICAgICAgIHJldHVybiBuZXcgU3VydmV5SlNPTjUoKS5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0Q2hhbmdlZChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgdmFyIGNhbkRlbGV0ZU9iamVjdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBvYmo7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWZXJicy5vYmogPSBvYmo7XHJcbiAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xyXG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA9IDxTdXJ2ZXkuUGFnZT5vYmo7XHJcbiAgICAgICAgICAgIGNhbkRlbGV0ZU9iamVjdCA9IHRoaXMuc3VydmV5LnBhZ2VzLmxlbmd0aCA+IDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdKG9iaik7XHJcbiAgICAgICAgICAgIGNhbkRlbGV0ZU9iamVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24odGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb0NhbkRlbGV0ZU9iamVjdChjYW5EZWxldGVPYmplY3QpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhcHBseUJpbmRpbmcoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRFbGVtZW50ID09IG51bGwpIHJldHVybjtcclxuICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5anMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cnZleWpzXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleWpzKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqcy5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFlKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDQ2KSBzZWxmLmRlbGV0ZVF1ZXN0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDM4IHx8IGUua2V5Q29kZSA9PSA0MCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0UXVlc3Rpb24oZS5rZXlDb2RlID09IDM4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlqc0V4YW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cnZleWpzRXhhbXBsZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0U3VydmV5KG5ldyBTdXJ2ZXlKU09ONSgpLnBhcnNlKFN1cnZleUVkaXRvci5kZWZhdWx0TmV3U3VydmV5VGV4dCkpO1xyXG4gICAgICAgIHRoaXMuc2V0VW5kb1JlZG9DdXJyZW50U3RhdGUodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5tb2RlID0gXCJkZXNpZ25lclwiO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUucmVuZGVyKHRoaXMuc3VydmV5anMpO1xyXG5cclxuICAgICAgICB0aGlzLmpzb25FZGl0b3IuaW5pdCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpbml0U3VydmV5KGpzb246IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkoKTtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gbmV3IERyYWdEcm9wSGVscGVyKDxTdXJ2ZXkuSVN1cnZleT50aGlzLnN1cnZleSwgZnVuY3Rpb24gKCkgeyBzZWxmLnNldE1vZGlmaWVkKCkgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZVtcImRyYWdEcm9wSGVscGVyXCJdID0gdGhpcy5kcmFnRHJvcEhlbHBlcjtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wic2V0SnNvbk9iamVjdFwiXShqc29uKTsgLy9UT0RPXHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuaXNFbXB0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkobmV3IFN1cnZleUpTT041KCkucGFyc2UoU3VydmV5RWRpdG9yLmRlZmF1bHROZXdTdXJ2ZXlUZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5Lm1vZGUgPSBcImRlc2lnbmVyXCI7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKHRoaXMuc3VydmV5anMpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5zdXJ2ZXkgPSB0aGlzLnN1cnZleTtcclxuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMucGFnZXNFZGl0b3Iuc2V0U2VsZWN0ZWRQYWdlKDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWZXJicy5zdXJ2ZXkgPSB0aGlzLnN1cnZleTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZFwiXS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHNlbmRlcltcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvbkNvcHlRdWVzdGlvblwiXS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLmNvcHlRdWVzdGlvbihzZWxmLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvbkZhc3RDb3B5UXVlc3Rpb25cIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5mYXN0Q29weVF1ZXN0aW9uKHNlbGYua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlKTsgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblByb2Nlc3NIdG1sLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IG9wdGlvbnMuaHRtbCA9IHNlbGYucHJvY2Vzc0h0bWwob3B0aW9ucy5odG1sKTsgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSg8U3VydmV5LlBhZ2U+c2VuZGVyLmN1cnJlbnRQYWdlKTsgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblF1ZXN0aW9uQWRkZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5vblF1ZXN0aW9uQWRkZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25RdWVzdGlvblJlbW92ZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5vblF1ZXN0aW9uUmVtb3ZlZChvcHRpb25zLnF1ZXN0aW9uKTsgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHByb2Nlc3NIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCFodG1sKSByZXR1cm4gaHRtbDtcclxuICAgICAgICB2YXIgc2NyaXB0UmVnRXggPSAvPHNjcmlwdFxcYltePF0qKD86KD8hPFxcL3NjcmlwdD4pPFtePF0qKSo8XFwvc2NyaXB0Pi9naTtcclxuICAgICAgICB3aGlsZSAoc2NyaXB0UmVnRXgudGVzdChodG1sKSkge1xyXG4gICAgICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKHNjcmlwdFJlZ0V4LCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvRHJhZ2dpbmdRdWVzdGlvbihxdWVzdGlvblR5cGU6IGFueSwgZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXIuc3RhcnREcmFnTmV3UXVlc3Rpb24oZSwgcXVlc3Rpb25UeXBlLCB0aGlzLmdldE5ld1F1ZXN0aW9uTmFtZSgpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9EcmFnZ2luZ0NvcGllZFF1ZXN0aW9uKGpzb246IGFueSwgZSkge1xyXG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXIuc3RhcnREcmFnQ29waWVkUXVlc3Rpb24oZSwgdGhpcy5nZXROZXdRdWVzdGlvbk5hbWUoKSwganNvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvQ2xpY2tRdWVzdGlvbihxdWVzdGlvblR5cGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuZG9DbGlja1F1ZXN0aW9uQ29yZShTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgdGhpcy5nZXROZXdRdWVzdGlvbk5hbWUoKSkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb0NsaWNrQ29waWVkUXVlc3Rpb24oanNvbjogYW55KSB7XHJcbiAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5ld1F1ZXN0aW9uTmFtZSgpO1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24oanNvbltcInR5cGVcIl0sIG5hbWUpO1xyXG4gICAgICAgIG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvT2JqZWN0KGpzb24sIHF1ZXN0aW9uKTtcclxuICAgICAgICBxdWVzdGlvbi5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmRvQ2xpY2tRdWVzdGlvbkNvcmUocXVlc3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXROZXdRdWVzdGlvbk5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE5ld1F1ZXN0aW9uTmFtZSh0aGlzLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvQ2xpY2tRdWVzdGlvbkNvcmUocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZih0aGlzLnN1cnZleVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSkgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWdlLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkZWxldGVRdWVzdGlvbigpIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFNlbGVjdGVkT2JqQXNRdWVzdGlvbigpO1xyXG4gICAgICAgIGlmIChxdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUN1cnJlbnRPYmplY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNlbGVjdFF1ZXN0aW9uKGlzVXA6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFNlbGVjdGVkT2JqQXNRdWVzdGlvbigpO1xyXG4gICAgICAgIGlmIChxdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0TmV4dFF1ZXN0aW9uKGlzVXApXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZE9iakFzUXVlc3Rpb24oKTogU3VydmV5LlF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlO1xyXG4gICAgICAgIGlmICghb2JqKSByZXR1cm4gbnVsbDtcclxuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSA9PSBPYmpUeXBlLlF1ZXN0aW9uID8gPFN1cnZleS5RdWVzdGlvbkJhc2U+KG9iaik6IG51bGw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRlbGV0ZUN1cnJlbnRPYmplY3QoKSB7XHJcbiAgICAgICAgdGhpcy5kZWxldGVPYmplY3QodGhpcy5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNvcHlRdWVzdGlvbihxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUocXVlc3Rpb24pO1xyXG4gICAgICAgIGlmIChvYmpUeXBlICE9IE9ialR5cGUuUXVlc3Rpb24pIHJldHVybjtcclxuICAgICAgICB2YXIganNvbiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChxdWVzdGlvbik7XHJcbiAgICAgICAganNvbi50eXBlID0gcXVlc3Rpb24uZ2V0VHlwZSgpO1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5nZXRDb3BpZWRRdWVzdGlvbkJ5TmFtZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtLmpzb24gPSBqc29uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMua29Db3BpZWRRdWVzdGlvbnMucHVzaCh7IG5hbWU6IHF1ZXN0aW9uLm5hbWUsIGpzb246IGpzb24gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmtvQ29waWVkUXVlc3Rpb25zKCkubGVuZ3RoID4gMykge1xyXG4gICAgICAgICAgICB0aGlzLmtvQ29waWVkUXVlc3Rpb25zLnNwbGljZSgwLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZhc3RDb3B5UXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIganNvbiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChxdWVzdGlvbik7XHJcbiAgICAgICAganNvbi50eXBlID0gcXVlc3Rpb24uZ2V0VHlwZSgpO1xyXG4gICAgICAgIHRoaXMuZG9DbGlja0NvcGllZFF1ZXN0aW9uKCBqc29uICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb3BpZWRRdWVzdGlvbkJ5TmFtZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmtvQ29waWVkUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gaXRlbXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkZWxldGVPYmplY3Qob2JqOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xyXG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW1vdmVQYWdlKG9iaik7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IucmVtb3ZlUGFnZShvYmopO1xyXG4gICAgICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UucmVtb3ZlUXVlc3Rpb24ob2JqKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd0xpdmVTdXJ2ZXkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cnZleWpzRXhhbXBsZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBqc29uID0gdGhpcy5nZXRTdXJ2ZXlKU09OKCk7XHJcbiAgICAgICAgaWYgKGpzb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoanNvbi5jb29raWVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUganNvbi5jb29raWVOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5LlN1cnZleShqc29uKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgc3VydmV5anNFeGFtcGxlUmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNFeGFtcGxlUmVzdWx0c1wiKTtcclxuICAgICAgICAgICAgdmFyIHN1cnZleWpzRXhhbXBsZXJlUnVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVyZVJ1blwiKTtcclxuICAgICAgICAgICAgaWYgKHN1cnZleWpzRXhhbXBsZVJlc3VsdHMpIHN1cnZleWpzRXhhbXBsZVJlc3VsdHMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHN1cnZleWpzRXhhbXBsZXJlUnVuKSBzdXJ2ZXlqc0V4YW1wbGVyZVJ1bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5KSA9PiB7IGlmIChzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzKSBzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzLmlubmVySFRNTCA9IHRoaXMuZ2V0TG9jU3RyaW5nKFwiZWQuc3VydmV5UmVzdWx0c1wiKSArIEpTT04uc3RyaW5naWZ5KHN1cnZleS5kYXRhKTsgaWYgKHN1cnZleWpzRXhhbXBsZXJlUnVuKSBzdXJ2ZXlqc0V4YW1wbGVyZVJ1bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjsgfSk7XHJcbiAgICAgICAgICAgIHN1cnZleS5yZW5kZXIodGhpcy5zdXJ2ZXlqc0V4YW1wbGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlLmlubmVySFRNTCA9IHRoaXMuZ2V0TG9jU3RyaW5nKFwiZWQuY29ycmVjdEpTT05cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93U3VydmV5RW1iZWRpbmcoKSB7XHJcbiAgICAgICAgdmFyIGpzb24gPSB0aGlzLmdldFN1cnZleUpTT04oKTtcclxuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLmpzb24gPSBqc29uO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5SWQgPSB0aGlzLnN1cnZleUlkO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5UG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5nZW5lcmF0ZVZhbGlkSlNPTiA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT047XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5zaG93KCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFN1cnZleUpTT04oKTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5rb0lzU2hvd0Rlc2lnbmVyKCkpIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5zdXJ2ZXkpO1xyXG4gICAgICAgIGlmICh0aGlzLmpzb25FZGl0b3IuaXNKc29uQ29ycmVjdCkgcmV0dXJuIG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLmpzb25FZGl0b3Iuc3VydmV5KTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlQW5ub3RhdGlvbnModGV4dDogc3RyaW5nLCBlcnJvcnM6IGFueVtdKTogQWNlQWpheC5Bbm5vdGF0aW9uW10ge1xyXG4gICAgICAgIHZhciBhbm5vdGF0aW9ucyA9IG5ldyBBcnJheTxBY2VBamF4LkFubm90YXRpb24+KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gZXJyb3JzW2ldO1xyXG4gICAgICAgICAgICB2YXIgYW5ub3RhdGlvbjogQWNlQWpheC5Bbm5vdGF0aW9uID0geyByb3c6IGVycm9yLnBvc2l0aW9uLnN0YXJ0LnJvdywgY29sdW1uOiBlcnJvci5wb3NpdGlvbi5zdGFydC5jb2x1bW4sIHRleHQ6IGVycm9yLnRleHQsIHR5cGU6IFwiZXJyb3JcIiB9O1xyXG4gICAgICAgICAgICBhbm5vdGF0aW9ucy5wdXNoKGFubm90YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5ub3RhdGlvbnM7XHJcbiAgICB9XHJcbn1cclxuXHJcblN1cnZleS5TdXJ2ZXkuY3NzVHlwZSA9IFwiYm9vdHN0cmFwXCI7XHJcbm5ldyBTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0KCkucmVwbGFjZVRleHQodGVtcGxhdGVQYWdlSHRtbCwgXCJwYWdlXCIpO1xyXG5uZXcgU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCgpLnJlcGxhY2VUZXh0KHRlbXBsYXRlUXVlc3Rpb25IdG1sLCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUgPSBudWxsO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgdGhpcy5vbkNvcHlRdWVzdGlvbiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHRoaXMub25GYXN0Q29weVF1ZXN0aW9uID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5jb3B5UXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvcHlRdWVzdGlvbi5maXJlKHNlbGYpOyB9O1xyXG4gICAgdGhpcy5mYXN0Q29weVF1ZXN0aW9uQ2xpY2sgPSBmdW5jdGlvbiAocXVlc3Rpb24pIHsgc2VsZi5vbkZhc3RDb3B5UXVlc3Rpb24uZmlyZShzZWxmLyosIHF1ZXN0aW9uKi8pOyB9O1xyXG4gICAgdGhpcy5rb0RyYWdnaW5nU291cmNlID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxufTtcclxuU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdID0gZnVuY3Rpb24odmFsdWU6IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgIGlmICh2YWx1ZSA9PSB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWU7XHJcbiAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgaWYgKG9sZFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICBvbGRWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0oKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRTZWxlY3RlZFF1ZXN0aW9uJzogb2xkVmFsdWUsICduZXdTZWxlY3RlZFF1ZXN0aW9uJzogdmFsdWUgfSk7XHJcbn07XHJcblN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wiZ2V0RWRpdG9yTG9jU3RyaW5nXCJdID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcodmFsdWUpO1xyXG59O1xyXG5cclxuU3VydmV5LlBhZ2UucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuZHJhZ0VudGVyQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmtvRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKC0xKTtcclxuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgIHRoaXMua29EcmFnZ2luZ0JvdHRvbSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgdGhpcy5rb0RyYWdnaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPCAwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhZ0VudGVyQ291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYua29EcmFnZ2luZ1F1ZXN0aW9uKG51bGwpO1xyXG4gICAgICAgICAgICBzZWxmLmtvRHJhZ2dpbmdCb3R0b20oZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gbmV3VmFsdWUgPj0gMCAmJiBuZXdWYWx1ZSA8IHNlbGYucXVlc3Rpb25zLmxlbmd0aCA/IHNlbGYucXVlc3Rpb25zW25ld1ZhbHVlXSA6IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYua29EcmFnZ2luZ1F1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgc2VsZi5rb0RyYWdnaW5nQm90dG9tKG5ld1ZhbHVlID09IHNlbGYucXVlc3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmtvRHJhZ2dpbmdRdWVzdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSkgbmV3VmFsdWUua29Jc0RyYWdnaW5nKHRydWUpOyB9KTtcclxuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uLnN1YnNjcmliZShmdW5jdGlvbiAob2xkVmFsdWUpIHsgaWYgKG9sZFZhbHVlKSBvbGRWYWx1ZS5rb0lzRHJhZ2dpbmcoZmFsc2UpOyB9LCB0aGlzLCBcImJlZm9yZUNoYW5nZVwiKTtcclxuICAgIHRoaXMuZHJhZ0VudGVyID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZWxmLmRyYWdFbnRlckNvdW50ZXIrKzsgc2VsZi5kb0RyYWdFbnRlcihlKTsgfTtcclxuICAgIHRoaXMuZHJhZ0xlYXZlID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRW50ZXJDb3VudGVyLS07IGlmIChzZWxmLmRyYWdFbnRlckNvdW50ZXIgPT09IDApIHNlbGYuZG9EcmFnTGVhdmUoZSk7IH07XHJcbiAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0Ryb3AoZSk7IH07XHJcbn07XHJcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJvcFwiXSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgZHJhZ0Ryb3BIZWxwZXIgPSB0aGlzLmRhdGFbXCJkcmFnRHJvcEhlbHBlclwiXTtcclxuICAgIGlmIChkcmFnRHJvcEhlbHBlcikge1xyXG4gICAgICAgIGRyYWdEcm9wSGVscGVyLmRvRHJvcChlKTtcclxuICAgIH1cclxufTtcclxuU3VydmV5LlBhZ2UucHJvdG90eXBlW1wiZG9EcmFnRW50ZXJcIl0gPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5xdWVzdGlvbnMubGVuZ3RoID4gMCB8fCB0aGlzLmtvRHJhZ2dpbmcoKSA+IDApIHJldHVybjtcclxuICAgIHZhciBkcmFnRHJvcEhlbHBlciA9IHRoaXMuZGF0YVtcImRyYWdEcm9wSGVscGVyXCJdO1xyXG4gICAgaWYgKGRyYWdEcm9wSGVscGVyICYmIGRyYWdEcm9wSGVscGVyLmlzU3VydmV5RHJhZ2dpbmcoZSkpIHtcclxuICAgICAgICB0aGlzLmtvRHJhZ2dpbmcoMCk7XHJcbiAgICB9XHJcbn07XHJcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJhZ0xlYXZlXCJdID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciBkcmFnRHJvcEhlbHBlciA9IHRoaXMuZGF0YVtcImRyYWdEcm9wSGVscGVyXCJdO1xyXG4gICAgaWYgKGRyYWdEcm9wSGVscGVyKSB7XHJcbiAgICAgICAgZHJhZ0Ryb3BIZWxwZXIuZG9MZWF2ZVBhZ2UoZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uQ3JlYXRpbmdcIl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBudWxsO1xyXG4gICAgdGhpcy5rb0lzRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMua29Jc0RyYWdnaW5nU291cmNlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRyYWdEcm9wSGVscGVyVmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzZWxmLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBzZWxmLmRhdGFbXCJkcmFnRHJvcEhlbHBlclwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuZHJhZ0Ryb3BIZWxwZXJWYWx1ZTtcclxuICAgIH07XHJcbiAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmRvRHJhZ0Ryb3BPdmVyKGUsIHNlbGYpOyB9O1xyXG4gICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5kb0Ryb3AoZSwgc2VsZik7IH07XHJcbiAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5zdGFydERyYWdRdWVzdGlvbihlLCBzZWxmLm5hbWUpOyB9O1xyXG4gICAgdGhpcy5kcmFnRW5kID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmVuZCgpOyB9O1xyXG4gICAgdGhpcy5rb0lzU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMua29PbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHNlbGYuZGF0YVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0odGhpcyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0gPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgdGhpcy5rb0lzU2VsZWN0ZWQodGhpcy5kYXRhW1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdID09IHRoaXMpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlIZWxwZXIsIE9ialR5cGV9IGZyb20gXCIuL3N1cnZleUhlbHBlclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEl0ZW0ge1xuICAgIHB1YmxpYyB2YWx1ZTogU3VydmV5LkJhc2U7XG4gICAgcHVibGljIHRleHQ6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdHMge1xuICAgIHB1YmxpYyBzdGF0aWMgaW50ZW5kOiBzdHJpbmcgPSBcIi4uLlwiO1xuICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGtvT2JqZWN0czogYW55LCBwdWJsaWMga29TZWxlY3RlZDogYW55KSB7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMucmVidWlsZCgpO1xuICAgIH1cbiAgICBwdWJsaWMgYWRkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xuICAgICAgICB2YXIgcGFnZUl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2UocGFnZSk7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuc3VydmV5LnBhZ2VzLmluZGV4T2YocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwcmV2UGFnZSA9IHRoaXMuc3VydmV5LnBhZ2VzW2luZGV4IC0gMV07XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHByZXZQYWdlKSArIDE7XG4gICAgICAgICAgICBpbmRleCArPSBwcmV2UGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZXggPSAxOyAvLzAgLSBTdXJ2ZXlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZEl0ZW0ocGFnZUl0ZW0sIGluZGV4KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZVF1ZXN0aW9uKHBhZ2UucXVlc3Rpb25zW2ldKTtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCArIGkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29TZWxlY3RlZChwYWdlSXRlbSk7XG4gICAgfVxuICAgIHB1YmxpYyBhZGRRdWVzdGlvbihwYWdlOiBTdXJ2ZXkuUGFnZSwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcbiAgICAgICAgdmFyIHF1ZXN0aW9uSW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKSArIDE7XG4gICAgICAgIGluZGV4ICs9IHF1ZXN0aW9uSW5kZXg7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbik7XG4gICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZChpdGVtKTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdE9iamVjdChvYmo6IFN1cnZleS5CYXNlKSB7XG4gICAgICAgIHZhciBvYmpzID0gdGhpcy5rb09iamVjdHMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob2Jqc1tpXS52YWx1ZSA9PSBvYmopIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQob2Jqc1tpXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyByZW1vdmVPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChvYmopO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XG4gICAgICAgIHZhciBjb3VudFRvUmVtb3ZlID0gMTtcbiAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XG4gICAgICAgICAgICB2YXIgcGFnZTogU3VydmV5LlBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xuICAgICAgICAgICAgY291bnRUb1JlbW92ZSArPSBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCBjb3VudFRvUmVtb3ZlKTtcbiAgICB9XG4gICAgcHVibGljIG5hbWVDaGFuZ2VkKG9iajogU3VydmV5LkJhc2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmtvT2JqZWN0cygpW2luZGV4XS50ZXh0KHRoaXMuZ2V0VGV4dChvYmopKTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdE5leHRRdWVzdGlvbihpc1VwOiBib29sZWFuKSB7XG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0U2VsZWN0ZWRRdWVzdGlvbigpO1xuICAgICAgICB2YXIgaXRlbUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocXVlc3Rpb24pO1xuICAgICAgICBpZiAoaXRlbUluZGV4IDwgMCkgcmV0dXJuIHF1ZXN0aW9uO1xuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XG4gICAgICAgIHZhciBuZXdJdGVtSW5kZXggPSBpdGVtSW5kZXggKyAoaXNVcCA/IC0xIDogMSk7XG4gICAgICAgIGlmIChuZXdJdGVtSW5kZXggPCBvYmpzLmxlbmd0aCAmJiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmpzW25ld0l0ZW1JbmRleF0udmFsdWUpID09IE9ialR5cGUuUXVlc3Rpb24pIHtcbiAgICAgICAgICAgIGl0ZW1JbmRleCA9IG5ld0l0ZW1JbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0l0ZW1JbmRleCA9IGl0ZW1JbmRleDtcbiAgICAgICAgICAgIHdoaWxlIChuZXdJdGVtSW5kZXggPCBvYmpzLmxlbmd0aCAmJiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmpzW25ld0l0ZW1JbmRleF0udmFsdWUpID09IE9ialR5cGUuUXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBuZXdJdGVtSW5kZXg7XG4gICAgICAgICAgICAgICAgbmV3SXRlbUluZGV4ICs9IChpc1VwID8gMSA6IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQob2Jqc1tpdGVtSW5kZXhdKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZFF1ZXN0aW9uKCk6IFN1cnZleS5RdWVzdGlvbkJhc2Uge1xuICAgICAgICBpZiAoIXRoaXMua29TZWxlY3RlZCgpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMua29TZWxlY3RlZCgpLnZhbHVlO1xuICAgICAgICBpZiAoIW9iaikgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUXVlc3Rpb24gPyA8U3VydmV5LlF1ZXN0aW9uQmFzZT4ob2JqKSA6IG51bGw7XG5cbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRJdGVtKGl0ZW06IFN1cnZleU9iamVjdEl0ZW0sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5rb09iamVjdHMoKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnB1c2goaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcmVidWlsZCgpIHtcbiAgICAgICAgdmFyIG9ianMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZUl0ZW0odGhpcy5zdXJ2ZXksIFwiU3VydmV5XCIpKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkucGFnZXNbaV07XG4gICAgICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVQYWdlKHBhZ2UpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tqXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5zdXJ2ZXkpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSXRlbShwYWdlLCB0aGlzLmdldFRleHQocGFnZSkpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUl0ZW0ocXVlc3Rpb24sIHRoaXMuZ2V0VGV4dChxdWVzdGlvbikpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUl0ZW0odmFsdWU6IFN1cnZleS5CYXNlLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgU3VydmV5T2JqZWN0SXRlbSgpO1xuICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGl0ZW0udGV4dCA9IGtvLm9ic2VydmFibGUodGV4dCk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEl0ZW1JbmRleCh2YWx1ZTogU3VydmV5LkJhc2UpOiBudW1iZXIge1xuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9ianNbaV0udmFsdWUgPT0gdmFsdWUpIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRUZXh0KG9iajogU3VydmV5LkJhc2UpOiBzdHJpbmcge1xuICAgICAgICB2YXIgaW50ZW5kID0gU3VydmV5T2JqZWN0cy5pbnRlbmQ7XG4gICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopICE9IE9ialR5cGUuUGFnZSkge1xuICAgICAgICAgICAgaW50ZW5kICs9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnRlbmQgKyBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShvYmopO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3VydmV5T2JqZWN0cy50cyIsImltcG9ydCB7U3VydmV5VGV4dFdvcmtlcn0gZnJvbSBcIi4vdGV4dFdvcmtlclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleUpTT05FZGl0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVGV4dFRpbWVvdXQ6IG51bWJlciA9IDEwMDA7XG5cbiAgICBwcml2YXRlIGlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBhY2VFZGl0b3I6IEFjZUFqYXguRWRpdG9yO1xuICAgIHByaXZhdGUgdGV4dFdvcmtlcjogU3VydmV5VGV4dFdvcmtlcjtcbiAgICBrb1RleHQ6IGFueTtcbiAgICBrb0Vycm9yczogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMua29UZXh0ID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcbiAgICAgICAgdGhpcy5rb0Vycm9ycyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb1RleHQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uSnNvbkVkaXRvckNoYW5nZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNBY2VFZGl0b3IpIHJldHVybjtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvciA9IGFjZS5lZGl0KFwic3VydmV5anNKU09ORWRpdG9yXCIpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgIHRoaXMuYWNlRWRpdG9yLnNlc3Npb24uc2V0TW9kZShcImFjZS9tb2RlL2pzb25cIik7XHJcbiAgICAgICAgdGhpcy5hY2VFZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5nZXRTZXNzaW9uKCkub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLm9uSnNvbkVkaXRvckNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5nZXRTZXNzaW9uKCkuc2V0VXNlV29ya2VyKHRydWUpO1xyXG4gICAgICAgIFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIgPSB0aGlzLmFjZUVkaXRvci5zZXNzaW9uLmRvYy5nZXROZXdMaW5lQ2hhcmFjdGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0FjZUVkaXRvcigpOiBib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBhY2UgIT09IFwidW5kZWZpbmVkXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQWNlRWRpdG9yKSByZXR1cm4gdGhpcy5rb1RleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNlRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMua29UZXh0KHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuYWNlRWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWNlRWRpdG9yLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IucmVuZGVyZXIudXBkYXRlRnVsbCh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzSnNvbih2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc1Byb2Nlc3NpbmdJbW1lZGlhdGVseSA9IGZhbHNlO1xyXG4gICAgfVxuICAgIHB1YmxpYyBzaG93KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLmFjZUVkaXRvcikge1xuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGlzSnNvbkNvcnJlY3QoKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMudGV4dFdvcmtlciA9IG5ldyBTdXJ2ZXlUZXh0V29ya2VyKHRoaXMudGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRXb3JrZXIuaXNKc29uQ29ycmVjdDtcclxuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMudGV4dFdvcmtlci5zdXJ2ZXk7IH1cbiAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIG9uSnNvbkVkaXRvckNoYW5nZWQoKTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy50aW1lb3V0SWQgPiAtMSkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Byb2Nlc3NpbmdJbW1lZGlhdGVseSkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudGltZW91dElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3NKc29uKHNlbGYudGV4dCk7XHJcbiAgICAgICAgICAgIH0sIFN1cnZleUpTT05FZGl0b3IudXBkYXRlVGV4dFRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcHJvY2Vzc0pzb24odGV4dDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICBpZiAodGhpcy5hY2VFZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IuZ2V0U2Vzc2lvbigpLnNldEFubm90YXRpb25zKHRoaXMuY3JlYXRlQW5ub3RhdGlvbnModGV4dCwgdGhpcy50ZXh0V29ya2VyLmVycm9ycykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy50ZXh0V29ya2VyLmVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVBbm5vdGF0aW9ucyh0ZXh0OiBzdHJpbmcsIGVycm9yczogYW55W10pOiBBY2VBamF4LkFubm90YXRpb25bXSB7XHJcbiAgICAgICAgdmFyIGFubm90YXRpb25zID0gbmV3IEFycmF5PEFjZUFqYXguQW5ub3RhdGlvbj4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBlcnJvcnNbaV07XHJcbiAgICAgICAgICAgIHZhciBhbm5vdGF0aW9uOiBBY2VBamF4LkFubm90YXRpb24gPSB7IHJvdzogZXJyb3IucG9zaXRpb24uc3RhcnQucm93LCBjb2x1bW46IGVycm9yLnBvc2l0aW9uLnN0YXJ0LmNvbHVtbiwgdGV4dDogZXJyb3IudGV4dCwgdHlwZTogXCJlcnJvclwiIH07XHJcbiAgICAgICAgICAgIGFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbm5vdGF0aW9ucztcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXlKU09ORWRpdG9yLnRzIiwiZXhwb3J0IHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJzdmRfY29udGFpbmVyXCI+ICAgIDx1bCBjbGFzcz1cIm5hdmJhci1kZWZhdWx0IGNvbnRhaW5lci1mbHVpZCBuYXYgbmF2LXRhYnMgc3ZkX21lbnVcIj4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvVmlld1R5cGUoKSA9PSBcXCdkZXNpZ25lclxcJ31cIj48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOnNlbGVjdERlc2lnbmVyQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5kZXNpZ25lclxcJylcIj48L2E+PC9saT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBzaG93SlNPTkVkaXRvclRhYiwgY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZWRpdG9yXFwnfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0RWRpdG9yQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5qc29uRWRpdG9yXFwnKVwiPjwvYT48L2xpPiAgICAgICAgPGxpIGRhdGEtYmluZD1cInZpc2libGU6IHNob3dUZXN0U3VydmV5VGFiLCBjc3M6IHthY3RpdmU6IGtvVmlld1R5cGUoKSA9PSBcXCd0ZXN0XFwnfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0VGVzdENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleVxcJylcIj48L2E+PC9saT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBzaG93RW1iZWRlZFN1cnZleVRhYiwgY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZW1iZWRcXCd9XCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3RFbWJlZENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuZW1iZWRTdXJ2ZXlcXCcpXCI+PC9hPjwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXJcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYmluZD1cImVuYWJsZTp1bmRvUmVkby5rb0NhblVuZG8sIGNsaWNrOiBkb1VuZG9DbGlja1wiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC51bmRvXFwnKVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXJcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYmluZD1cImVuYWJsZTp1bmRvUmVkby5rb0NhblJlZG8sIGNsaWNrOiBkb1JlZG9DbGlja1wiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5yZWRvXFwnKVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IChrb0lzU2hvd0Rlc2lnbmVyKCkgJiYga29TaG93T3B0aW9ucygpKVwiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgaW5saW5lXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5vcHRpb25zXFwnKVwiPiAgICAgICAgICAgICAgICAgICAgT3B0aW9ucyAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+ICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1iaW5kPVwiY3NzOiB7YWN0aXZlOiBrb0dlbmVyYXRlVmFsaWRKU09OfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6Z2VuZXJhdGVWYWxpZEpTT05DbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLmdlbmVyYXRlVmFsaWRKU09OXFwnKVwiPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZTogIWtvR2VuZXJhdGVWYWxpZEpTT04oKX1cIj48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOmdlbmVyYXRlUmVhZGFibGVKU09OQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5nZW5lcmF0ZVJlYWRhYmxlSlNPTlxcJylcIj48L2E+PC9saT4gICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvVmlld1R5cGUoKSA9PSBcXCd0ZXN0XFwnXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBpbmxpbmVcIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzdXJ2ZXlUZXN0V2lkdGhcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLnRlc3RTdXJ2ZXlXaWR0aFxcJykgKyBcXCcgXFwnICsgJHJvb3Qua29UZXN0U3VydmV5V2lkdGgoKVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwic3VydmV5VGVzdFdpZHRoXCI+ICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgXFwnMTAwJVxcJylcIj4xMDAlPC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgXFwnMTIwMHB4XFwnKVwiPjEyMDBweDwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6IGtvVGVzdFN1cnZleVdpZHRoLmJpbmQoJGRhdGEsIFxcJzEwMDBweFxcJylcIj4xMDAwcHg8L2E+PC9saT4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOiBrb1Rlc3RTdXJ2ZXlXaWR0aC5iaW5kKCRkYXRhLCBcXCc4MDBweFxcJylcIj44MDBweDwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6IGtvVGVzdFN1cnZleVdpZHRoLmJpbmQoJGRhdGEsIFxcJzYwMHB4XFwnKVwiPjYwMHB4PC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgXFwnNDAwcHhcXCcpXCI+NDAwcHg8L2E+PC9saT4gICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiPiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHN2ZF9zYXZlX2J0blwiIGRhdGEtYmluZD1cImNsaWNrOiBzYXZlQnV0dG9uQ2xpY2ssIHZpc2libGU6IGtvU2hvd1NhdmVCdXR0b25cIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuc2F2ZVN1cnZleVxcJylcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICA8L2xpPiAgICA8L3VsPiAgICA8ZGl2IGNsYXNzPVwicGFuZWwgc3ZkX2NvbnRlbnRcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc3ZkX3N1cnZleV9kZXNpZ25lclwiICBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZGVzaWduZXJcXCdcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTIgY29sLW1kLTIgY29sLXNtLTEyIGNvbC14cy0xMiBwYW5lbCBwYW5lbC1kZWZhdWx0IHN2ZF90b29sYm94XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAtdmVydGljYWxcIiBzdHlsZT1cIndpZHRoOjEwMCU7cGFkZGluZy1yaWdodDoycHhcIj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb25UeXBlcyAtLT4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDsgbWFyZ2luOjFweDt3aWR0aDoxMDAlXCIgZHJhZ2dhYmxlPVwidHJ1ZVwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNsaWNrUXVlc3Rpb24sIGV2ZW50OntkcmFnc3RhcnQ6IGZ1bmN0aW9uKGVsLCBlKSB7ICRwYXJlbnQuZHJhZ2dpbmdRdWVzdGlvbigkZGF0YSwgZSk7IHJldHVybiB0cnVlO30sIGRyYWdlbmQ6IGZ1bmN0aW9uKGVsLCBlKSB7ICRwYXJlbnQuZHJhZ0VuZCgpOyB9fVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cImNzczogXFwnaWNvbi1cXCcgKyAkZGF0YVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN2ZF90b29sYm94X2l0ZW1fdGV4dFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdxdC5cXCcgKyAkZGF0YSlcIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29Db3BpZWRRdWVzdGlvbnMgLS0+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgc3R5bGU9XCJ0ZXh0LWFsaWduOmxlZnQ7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jbGlja0NvcGllZFF1ZXN0aW9uLCBldmVudDp7ZHJhZ3N0YXJ0OiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdnaW5nQ29waWVkUXVlc3Rpb24oJGRhdGEsIGUpOyByZXR1cm4gdHJ1ZTt9LCBkcmFnZW5kOiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdFbmQoKTsgfX1cIj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24tZGVmYXVsdFwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN2ZF90b29sYm94X2l0ZW1fdGV4dFwiIGRhdGEtYmluZD1cInRleHQ6bmFtZVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTcgY29sLW1kLTcgY29sLXNtLTEyIGNvbC14cy0xMiBzdmRfZWRpdG9yc1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3ZkX3BhZ2VzX2VkaXRvclwiIGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN2ZF9xdWVzdGlvbnNfZWRpdG9yXCIgaWQ9XCJzY3JvbGxhYmxlRGl2XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNcIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0zIGNvbC1tZC0zIGNvbC1zbS0xMiBjb2wteHMtMTIgcGFuZWwgcGFuZWwtZGVmYXVsdCBzdmRfcHJvcGVydGllc1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZyBpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29PYmplY3RzLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRPYmplY3RcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0NhbkRlbGV0ZU9iamVjdCwgY2xpY2s6IGRlbGV0ZUN1cnJlbnRPYmplY3QsIGF0dHI6IHsgdGl0bGU6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5kZWxTZWxPYmplY3RcXCcpfVwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBzZWxlY3RlZE9iamVjdEVkaXRvciB9XCI+PC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1mb290ZXJcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOnN1cnZleVZlcmJzLmtvSGFzVmVyYnNcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0dmVyYnNcXCcsIGRhdGE6IHN1cnZleVZlcmJzIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29WaWV3VHlwZSgpID09IFxcJ2VkaXRvclxcJ1wiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnanNvbmVkaXRvclxcJywgZGF0YToganNvbkVkaXRvciB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc1Rlc3RcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwndGVzdFxcJywgc3R5bGU6IHt3aWR0aDoga29UZXN0U3VydmV5V2lkdGh9XCI+ICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzRXhhbXBsZVwiPjwvZGl2PiAgICAgICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzXCI+PC9kaXY+ICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN1cnZleWpzRXhhbXBsZXJlUnVuXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0VGVzdENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleUFnYWluXFwnKVwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+VGVzdCBBZ2FpbjwvYnV0dG9uPiAgICAgICAgPC9kaXY+ICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNFbWJlZFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvVmlld1R5cGUoKSA9PSBcXCdlbWJlZFxcJ1wiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5ZW1iZWRpbmdcXCcsIGRhdGE6IHN1cnZleUVtYmVkaW5nIH1cIj48L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cImpzb25lZGl0b3JcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhaGFzQWNlRWRpdG9yXCI+ICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJzdmRfanNvbl9lZGl0b3JfYXJlYVwiIGRhdGEtYmluZD1cInRleHRJbnB1dDprb1RleHRcIj48L3RleHRhcmVhPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0Vycm9ycyAtLT4gICAgICAgIDxkaXY+ICAgICAgICAgICAgPHNwYW4+RXJyb3I6IDwvc3Bhbj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0ZXh0XCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIC9rbyAgLS0+ICAgIDwvZGl2PiAgICA8ZGl2IGlkPVwic3VydmV5anNKU09ORWRpdG9yXCIgY2xhc3M9XCJzdmRfanNvbl9lZGl0b3JcIj48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdGVkaXRvclwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSBzdmRfdGFibGUtbm93cmFwXCI+ICAgICAgICA8dGJvZHkgZGF0YS1iaW5kPVwiZm9yZWFjaDoga29Qcm9wZXJ0aWVzXCI+ICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNoYW5nZUFjdGl2ZVByb3BlcnR5KCRkYXRhKSwgY3NzOiB7XFwnYWN0aXZlXFwnOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YX1cIj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IGRpc3BsYXlOYW1lLCBhdHRyOiB7dGl0bGU6IHRpdGxlfVwiIHdpZHRoPVwiNTAlXCI+PC90ZD4gICAgICAgICAgICAgICAgPHRkIHdpZHRoPVwiNTAlXCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHQsIHZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpICE9ICRkYXRhICYmIChrb1RleHQoKSB8fCAkZGF0YS5lZGl0b3JUeXBlID09IFxcJ2Jvb2xlYW5cXCcpLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH1cIiBzdHlsZT1cInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlblwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogJHBhcmVudC5rb0FjdGl2ZVByb3BlcnR5KCkgPT0gJGRhdGEgfHwgKCFrb1RleHQoKSAmJiAkZGF0YS5lZGl0b3JUeXBlICE9IFxcJ2Jvb2xlYW5cXCcpXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1cXCcgKyBlZGl0b3JUeXBlLCBkYXRhOiAkZGF0YSB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJvYmplY3R2ZXJic1wiPiAgICA8IS0tIGtvIGZvcmVhY2g6IGtvVmVyYnMgLS0+ICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgICAgIDxzcGFuICBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCIgZGF0YS1iaW5kPVwidGV4dDp0ZXh0XCI+PC9zcGFuPiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTpcXCd2YWx1ZVxcJywgdmFsdWU6IGtvU2VsZWN0ZWRJdGVtXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPCEtLSAva28gIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicGFnZWVkaXRvclwiPiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnNcIiBkYXRhLWJpbmQ9XCJ0YWJzOnRydWVcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29QYWdlcyAtLT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvU2VsZWN0ZWQoKX0sZXZlbnQ6eyAgICAgICAgICAga2V5ZG93bjpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQua2V5RG93bihlbCwgZSk7IH0sICAgICAgICAgICBkcmFnc3RhcnQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdTdGFydChlbCk7IHJldHVybiB0cnVlOyB9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdPdmVyKGVsKTt9LCAgICAgICAgICAgZHJhZ2VuZDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0VuZCgpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnRHJvcChlbCk7fSAgICAgICAgIH1cIj4gICAgICAgICAgICAgPGEgY2xhc3M9XCJzdmRfcGFnZV9uYXZcIiBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOiRwYXJlbnQuc2VsZWN0UGFnZUNsaWNrXCI+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCI+PC9zcGFuPiAgICAgICAgICAgIDwvYT4gICAgICAgIDwvbGk+ICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICA8bGk+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBzdmRfYWRkX25ld19wYWdlX2J0blwiIGRhdGEtYmluZD1cImNsaWNrOmFkZE5ld1BhZ2VDbGlja1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPjwvbGk+ICAgIDwvdWw+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXllbWJlZGluZ1wiPiAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cInZhbHVlOmtvTGlicmFyeVZlcnNpb25cIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwia25vY2tvdXRcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcua25vY2tvdXRcXCcpXCI+PC9vcHRpb24+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlYWN0XCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LnJlYWN0XFwnKVwiPjwvb3B0aW9uPiAgICAgICAgPC9zZWxlY3Q+ICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cInZhbHVlOmtvU2NyaXB0VXNpbmdcIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYm9vdHN0cmFwXCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LmJvb3RzdHJhcFxcJylcIj48L29wdGlvbj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic3RhbmRhcmRcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcuc3RhbmRhcmRcXCcpXCI+PC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TaG93QXNXaW5kb3dcIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGFnZVwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5zaG93T25QYWdlXFwnKVwiPjwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aW5kb3dcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcuc2hvd0luV2luZG93XFwnKVwiPjwvb3B0aW9uPiAgICAgICAgPC9zZWxlY3Q+ICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveC1pbmxpbmVcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzSWRzXCI+ICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6a29Mb2FkU3VydmV5XCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcubG9hZEZyb21TZXJ2ZXJcXCcpXCI+PC9zcGFuPiAgICAgICAgPC9sYWJlbD4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcudGl0bGVTY3JpcHRcXCcpXCI+PC9kaXY+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6aGFzQWNlRWRpdG9yXCI+ICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nSGVhZFwiIHN0eWxlPVwiaGVpZ2h0OjcwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8dGV4dGFyZWEgZGF0YS1iaW5kPVwidmlzaWJsZTohaGFzQWNlRWRpdG9yLCB0ZXh0OiBrb0hlYWRUZXh0XCIgc3R5bGU9XCJoZWlnaHQ6NzBweDt3aWR0aDoxMDAlXCI+PC90ZXh0YXJlYT4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvVmlzaWJsZUh0bWxcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCIgIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy50aXRsZUh0bWxcXCcpXCI+PC9kaXY+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6aGFzQWNlRWRpdG9yXCI+ICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nQm9keVwiIHN0eWxlPVwiaGVpZ2h0OjMwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8dGV4dGFyZWEgZGF0YS1iaW5kPVwidmlzaWJsZTohaGFzQWNlRWRpdG9yLCB0ZXh0OiBrb0JvZHlUZXh0XCIgc3R5bGU9XCJoZWlnaHQ6MzBweDt3aWR0aDoxMDAlXCI+PC90ZXh0YXJlYT4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiAgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LnRpdGxlSmF2YVNjcmlwdFxcJylcIj48L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTpoYXNBY2VFZGl0b3JcIj4gICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdKYXZhXCIgc3R5bGU9XCJoZWlnaHQ6MzAwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8dGV4dGFyZWEgZGF0YS1iaW5kPVwidmlzaWJsZTohaGFzQWNlRWRpdG9yLCB0ZXh0OiBrb0phdmFUZXh0XCIgc3R5bGU9XCJoZWlnaHQ6MzAwcHg7d2lkdGg6MTAwJVwiPjwvdGV4dGFyZWE+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItYm9vbGVhblwiPiAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJjaGVja2VkOiBrb1ZhbHVlXCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWRyb3Bkb3duXCI+ICAgIDxkaXYgY2xhc3M9XCJjdXN0b20tc2VsZWN0XCI+ICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWUsIG9wdGlvbnM6IGNob2ljZXNcIiAgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PC9zZWxlY3Q+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItaHRtbFwiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LWh0bWxcIj4gICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIHJvd3M9XCIxMFwiIGF1dG9mb2N1cz1cImF1dG9mb2N1c1wiPjwvdGV4dGFyZWE+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1pdGVtdmFsdWVzXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtaXRlbXZhbHVlc1wiPiAgICA8ZGl2IHN0eWxlPVwib3ZlcmZsb3cteTogYXV0bzsgb3ZlcmZsb3cteDpoaWRkZW47IG1heC1oZWlnaHQ6NDAwcHhcIj4gICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICAgICAgPHRoZWFkPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudmFsdWVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudGV4dFxcJylcIj48L3RoPiAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgPC90aGVhZD4gICAgICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29JdGVtcyAtLT4gICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXBcIiByb2xlPVwiZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXhzXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogJGluZGV4KCkgPiAwLCBjbGljazogJHBhcmVudC5vbk1vdmVVcENsaWNrXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWFycm93LXVwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4teHNcIiBzdHlsZT1cImZsb2F0Om5vbmVcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkaW5kZXgoKSA8ICRwYXJlbnQua29JdGVtcygpLmxlbmd0aCAtIDEsIGNsaWNrOiAkcGFyZW50Lm9uTW92ZURvd25DbGlja1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1hcnJvdy1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyIG5vLXBhZGRpbmdcIiByb2xlPVwiYWxlcnRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzRXJyb3IsIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5lbnRlck5ld1ZhbHVlXFwnKVwiPjwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVGV4dFwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXhzXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGlja1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi10cmFzaFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj48L2J1dHRvbj48L3RkPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgPC90YWJsZT4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJyb3cgYnRuLXRvb2xiYXJcIj4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiBkYXRhLWJpbmQ9XCJjbGljazogb25BZGRDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5hZGROZXdcXCcpXCIgLz4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkNsZWFyQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUucmVtb3ZlQWxsXFwnKVwiIC8+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItbWF0cml4ZHJvcGRvd25jb2x1bW5zXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtbWF0cml4ZHJvcGRvd25jb2x1bW5zXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnJlcXVpcmVkXFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuY2VsbFR5cGVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5uYW1lXFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudGl0bGVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzQ2hvaWNlcywgY2xpY2s6IG9uU2hvd0Nob2ljZXNDbGlja1wiPiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uXCIgZGF0YS1iaW5kPVwiY3NzOiB7XFwnZ2x5cGhpY29uLWNoZXZyb24tZG93blxcJzogIWtvU2hvd0Nob2ljZXMoKSwgXFwnZ2x5cGhpY29uLWNoZXZyb24tdXBcXCc6IGtvU2hvd0Nob2ljZXMoKX1cIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICA8L2E+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiY2hlY2tlZDoga29Jc1JlcXVpcmVkXCIgLz4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6IGNlbGxUeXBlQ2hvaWNlcywgdmFsdWU6IGtvQ2VsbFR5cGVcIiAgc3R5bGU9XCJ3aWR0aDoxMTBweFwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvTmFtZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlciBuby1wYWRkaW5nXCIgcm9sZT1cImFsZXJ0XCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0hhc0Vycm9yLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuZW50ZXJOZXdWYWx1ZVxcJylcIj48L2Rpdj4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29UaXRsZVwiIHN0eWxlPVwid2lkdGg6MTIwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5kZWxldGVcXCcpXCIvPjwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8dHIgZGF0YS1iaW5kPVwidmlzaWJsZToga29TaG93Q2hvaWNlcygpICYmIGtvSGFzQ2hvaWNlcygpXCI+ICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNFwiIHN0eWxlPVwiYm9yZGVyLXRvcC1zdHlsZTpub25lXCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgY29sLXNtLTNcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiRyb290LmdldExvY1N0cmluZyhcXCdwZS5oYXNPdGhlclxcJylcIj48L2xhYmVsPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiY2hlY2tlZDoga29IYXNPdGhlclwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS03XCIgZGF0YS1iaW5kPVwidmlzaWJsZTogIWtvSGFzQ29sQ291bnQoKVwiPjwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgY29sLXNtLTNcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzQ29sQ291bnQsIHRleHQ6JHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmNvbENvdW50XFwnKVwiPjwvbGFiZWw+ICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbCBjb2wtc20tNFwiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNDb2xDb3VudCwgb3B0aW9uczogY29sQ291bnRDaG9pY2VzLCB2YWx1ZToga29Db2xDb3VudFwiIHN0eWxlPVwid2lkdGg6MTEwcHhcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHkgc3ZkX25vdG9wYm90dG9tcGFkZGluZ3NcIj4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yY29udGVudC1pdGVtdmFsdWVzXFwnLCBkYXRhOiBjaG9pY2VzRWRpdG9yIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGJ0bi10b29sYmFyXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFkZENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmFkZE5ld1xcJylcIi8+ICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQ2xlYXJDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5yZW1vdmVBbGxcXCcpXCJcIiAvPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1tb2RhbFwiPiAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiFlZGl0b3IuaXNFZGl0YWJsZVwiPiAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29UZXh0XCI+PC9zcGFuPiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiICBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiZGF0YS10b2dnbGU9XCJtb2RhbFwiIHN0eWxlPVwicGFkZGluZzogMnB4O1wiIGRhdGEtYmluZD1cImF0dHI6IHtcXCdkYXRhLXRhcmdldFxcJyA6IG1vZGFsTmFtZVRhcmdldH1cIj4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+ICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiIGRhdGEtYmluZD1cInZpc2libGU6ZWRpdG9yLmlzRWRpdGFibGVcIiBzdHlsZT1cImRpc3BsYXk6dGFibGVcIj4gICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWVcIiBzdHlsZT1cImRpc3BsYXk6dGFibGUtY2VsbDsgd2lkdGg6MTAwJVwiIC8+ICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+ICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBzdHlsZT1cImRpc3BsYXk6dGFibGUtY2VsbDsgcGFkZGluZzogMnB4O1wiICBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ2RhdGEtdGFyZ2V0XFwnIDogbW9kYWxOYW1lVGFyZ2V0fVwiPiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2J1dHRvbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJhdHRyOiB7aWQgOiBtb2RhbE5hbWV9XCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgZGF0YS1iaW5kPVwidGV4dDplZGl0b3IudGl0bGVcIj48L2g0PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keSBzdmRfbm90b3Bib3R0b21wYWRkaW5nc1wiPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtXFwnICsgZWRpdG9yVHlwZSwgZGF0YTogZWRpdG9yIH0gLS0+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1mb290ZXJcIj4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBkYXRhLWJpbmQ9XCJjbGljazogZWRpdG9yLm9uQXBwbHlDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5hcHBseVxcJylcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWJpbmQ9XCJjbGljazogZWRpdG9yLm9uUmVzZXRDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5yZXNldFxcJylcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGRhdGEtYmluZD1cInZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuY2xvc2VcXCcpXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItbnVtYmVyXCI+ICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJudW1iZXJcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1yZXN0ZnVsbFwiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LXJlc3RmdWxsXCI+ICAgIDxmb3JtPiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXJsXCI+VXJsOjwvbGFiZWw+ICAgICAgICAgICAgPGlucHV0IGlkPVwidXJsXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1VybFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicGF0aFwiPlBhdGg6PC9sYWJlbD4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJwYXRoXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1BhdGhcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+ICAgICAgICAgICAgPGxhYmVsIGZvcj1cInZhbHVlTmFtZVwiPnZhbHVlTmFtZTo8L2xhYmVsPiAgICAgICAgICAgIDxpbnB1dCBpZD1cInZhbHVlTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZU5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+ICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRpdGxlTmFtZVwiPnRpdGxlTmFtZTo8L2xhYmVsPiAgICAgICAgICAgIDxpbnB1dCBpZD1cInRpdGxlTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UaXRsZU5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+ICAgICAgICA8L2Rpdj4gICAgPC9mb3JtPiAgICA8ZGl2IGlkPVwicmVzdGZ1bGxTdXJ2ZXlcIiBzdHlsZT1cIndpZHRoOjEwMCU7aGVpZ2h0OjE1MHB4XCI+PC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1zdHJpbmdcIj4gICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci10ZXh0XCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdGV4dFwiPiAgICA8dGV4dGFyZWEgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgcm93cz1cIjEwXCIgYXV0b2ZvY3VzPVwiYXV0b2ZvY3VzXCI+PC90ZXh0YXJlYT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXRleHRpdGVtc1wiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LXRleHRpdGVtc1wiPjxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPiAgICAgICAgPHRoZWFkPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5uYW1lXFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudGl0bGVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29OYW1lXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29UaXRsZVwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5kZWxldGVcXCcpXCIvPjwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNFwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiBkYXRhLWJpbmQ9XCJjbGljazogb25BZGRDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5hZGROZXdcXCcpXCIvPjwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+PC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc1wiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LXRyaWdnZXJzXCI+PGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGUgaW5wdXQtZ3JvdXAtYWRkb25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+ICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGF2YWlsYWJsZVRyaWdnZXJzIC0tPiAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkFkZENsaWNrKCRkYXRhKVwiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6JGRhdGFcIj48L3NwYW4+PC9hPjwvbGk+ICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICA8L3VsPiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOiBrb0l0ZW1zLCBvcHRpb25zVGV4dDogXFwna29UZXh0XFwnLCB2YWx1ZToga29TZWxlY3RlZFwiPjwvc2VsZWN0PiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1NlbGVjdGVkKCkgPT0gbnVsbFwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1F1ZXN0aW9ucygpLmxlbmd0aCA9PSAwLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUubm9xdWVzdGlvbnNcXCcpXCI+PC9kaXY+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvUXVlc3Rpb25zKCkubGVuZ3RoID4gMCwgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmNyZWF0ZXRyaWdnZXJcXCcpXCI+PC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cIndpdGg6IGtvU2VsZWN0ZWRcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGZvcm0taW5saW5lXCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNFwiPiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRyaWdnZXJPblxcJylcIj48L3NwYW4+PHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6JHBhcmVudC5rb1F1ZXN0aW9ucywgdmFsdWU6IGtvTmFtZVwiPjwvc2VsZWN0PiA8c3Bhbj4gPC9zcGFuPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+ICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczphdmFpbGFibGVPcGVyYXRvcnMsIG9wdGlvbnNWYWx1ZTogXFwnbmFtZVxcJywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOmtvT3BlcmF0b3JcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNFwiPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgc3R5bGU9XCJwYWRkaW5nOiAwXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1JlcXVpcmVWYWx1ZSwgdmFsdWU6a29WYWx1ZVwiIC8+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0ga28gaWY6IGtvVHlwZSgpID09IFxcJ3Zpc2libGV0cmlnZ2VyXFwnIC0tPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzaXRlbXNcXCcsIGRhdGE6IHBhZ2VzIH0gLS0+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zXFwnLCBkYXRhOiBxdWVzdGlvbnMgfSAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8IS0tIGtvIGlmOiBrb1R5cGUoKSA9PSBcXCdjb21wbGV0ZXRyaWdnZXJcXCcgLS0+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW46IDEwcHhcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudHJpZ2dlckNvbXBsZXRlVGV4dFxcJylcIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8IS0tIGtvIGlmOiBrb1R5cGUoKSA9PSBcXCdzZXR2YWx1ZXRyaWdnZXJcXCcgLS0+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBmb3JtLWlubGluZVwiIHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRyaWdnZXJTZXRUb05hbWVcXCcpXCI+PC9zcGFuPjxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29zZXRUb05hbWVcIiAvPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xXCI+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTVcIj4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50cmlnZ2VyU2V0VmFsdWVcXCcpXCI+PC9zcGFuPjxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29zZXRWYWx1ZVwiIC8+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgZm9ybS1pbmxpbmVcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMlwiPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvaXNWYXJpYWJsZVwiIC8+IDxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50cmlnZ2VySXNWYXJpYWJsZVxcJylcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1wiPiAgICA8ZGl2IGNsYXNzPVwicGFuZWwgbm8tbWFyZ2lucyBuby1wYWRkaW5nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbXVsdGlwbGU9XCJtdWx0aXBsZVwiIGRhdGEtYmluZD1cIm9wdGlvbnM6a29DaG9vc2VuLCB2YWx1ZToga29DaG9vc2VuU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29DaG9vc2VuU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25EZWxldGVDbGlja1wiIGNsYXNzPVwiYnRuXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICA8L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiIHN0eWxlPVwibWFyZ2luLXRvcDo1cHhcIj4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczprb09iamVjdHMsIHZhbHVlOiBrb1NlbGVjdGVkXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uQWRkQ2xpY2tcIiBzdHlsZT1cIndpZHRoOjQwcHhcIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXZhbGlkYXRvcnNcIj4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1tb2RhbFxcJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yY29udGVudC12YWxpZGF0b3JzXCI+PGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGUgaW5wdXQtZ3JvdXAtYWRkb25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+ICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGF2YWlsYWJsZVZhbGlkYXRvcnMgLS0+ICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uQWRkQ2xpY2soJGRhdGEpXCI+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YVwiPjwvc3Bhbj48L2E+PC9saT4gICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgICAgIDwvdWw+ICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6IGtvSXRlbXMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCB2YWx1ZToga29TZWxlY3RlZFwiPjwvc2VsZWN0PiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgY2xhc3M9XCJidG5cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3RlZGl0b3JcXCcsIGRhdGE6IHNlbGVjdGVkT2JqZWN0RWRpdG9yIH1cIj48L2Rpdj48L2Rpdj48L3NjcmlwdD4nO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90ZW1wbGF0ZUVkaXRvci5rby5odG1sLnRzIiwiZXhwb3J0IHZhciBodG1sID0gJzxkaXYgZGF0YS1iaW5kPVwiZXZlbnQ6eyAgICAgICAgICAgZHJhZ2VudGVyOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0VudGVyKGUpO30sICAgICAgICAgICBkcmFnbGVhdmU6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnTGVhdmUoZSk7fSwgICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgcmV0dXJuIGZhbHNlO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fX0gICAgIFwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHByb2Nlc3NlZFRpdGxlLCBjc3M6ICRyb290LmNzcy5wYWdlVGl0bGVcIj48L2g0PiAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93cywgYXM6IFxcJ3Jvd1xcJ30gLS0+ICAgIDxkaXYgY2xhc3M9XCJzdmRfcXVlc3Rpb25fY29udGFpbmVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogcm93LmtvVmlzaWJsZSwgY3NzOiAkcm9vdC5jc3Mucm93XCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93LnF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnICwgYWZ0ZXJSZW5kZXI6IHJvdy5rb0FmdGVyUmVuZGVyIH0gLS0+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5rb0lzRHJhZ2dpbmdcIj4gICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBpZjogJHJvb3Qua29EcmFnZ2luZ1NvdXJjZSgpLCBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb25cXCcsIGRhdGE6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgYXM6IFxcJ3F1ZXN0aW9uXFwnLCB0ZW1wbGF0ZU9wdGlvbnM6IHsgaXNEcmFnZ2luZzogdHJ1ZSB9IH0gLS0+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiwgdGVtcGxhdGVPcHRpb25zOiB7IGlzRHJhZ2dpbmc6IGZhbHNlIH0gfSAtLT4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDxkaXYgY2xhc3M9XCJ3ZWxsXCIgZGF0YS1iaW5kPVwidmlzaWJsZTokcm9vdC5pc0Rlc2lnbk1vZGUgJiYgcXVlc3Rpb25zLmxlbmd0aCA9PSAwXCI+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAha29EcmFnZ2luZ0JvdHRvbSgpLCB0ZXh0OiRyb290LmdldEVkaXRvckxvY1N0cmluZyhcXCdzdXJ2ZXkuZHJvcFF1ZXN0aW9uXFwnKVwiPjwvc3Bhbj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29EcmFnZ2luZ0JvdHRvbVwiPiAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgaWY6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiAkcm9vdC5rb0RyYWdnaW5nU291cmNlKCksIGFzOiBcXCdxdWVzdGlvblxcJywgdGVtcGxhdGVPcHRpb25zOiB7IGlzRHJhZ2dpbmc6IHRydWUgfSB9IC0tPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9ucy5sZW5ndGggPiAwICYmIGtvRHJhZ2dpbmdCb3R0b20oKVwiPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBpZjogJHJvb3Qua29EcmFnZ2luZ1NvdXJjZSgpLCBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb25cXCcsIGRhdGE6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgYXM6IFxcJ3F1ZXN0aW9uXFwnLCB0ZW1wbGF0ZU9wdGlvbnM6IHsgaXNEcmFnZ2luZzogdHJ1ZSB9IH0gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+PC9kaXY+JztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdGVtcGxhdGVfcGFnZS5odG1sLnRzIiwiZXhwb3J0IHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJzdmRfcXVlc3Rpb25cIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOnRvcFwiIGRhdGEtYmluZD1cInN0eWxlOiB7ZGlzcGxheTogcXVlc3Rpb24ua29WaXNpYmxlKCl8fCAkcm9vdC5pc0Rlc2lnbk1vZGUgPyBcXCdpbmxpbmUtYmxvY2tcXCc6IFxcJ25vbmVcXCcsIG1hcmdpbkxlZnQ6IHF1ZXN0aW9uLmtvTWFyZ2luTGVmdCwgcGFkZGluZ1JpZ2h0OiBxdWVzdGlvbi5rb1BhZGRpbmdSaWdodCwgd2lkdGg6IHF1ZXN0aW9uLmtvUmVuZGVyV2lkdGggfSwgICAgIGF0dHIgOiB7aWQ6IGlkLCBkcmFnZ2FibGU6ICRyb290LmlzRGVzaWduTW9kZX0sIGNsaWNrOiAkcm9vdC5pc0Rlc2lnbk1vZGUgPyBrb09uQ2xpY2s6IG51bGwsICAgICAgICAgIGV2ZW50OnsgICAgICAgICAgIGRyYWdzdGFydDpmdW5jdGlvbihlbCwgZSl7IGRyYWdTdGFydChlKTsgcmV0dXJuIHRydWU7IH0sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IGlmKCFxdWVzdGlvbi5pc0RyYWdnaW5nKSBkcmFnT3ZlcihlKTt9LCAgICAgICAgICAgZHJhZ2VuZDpmdW5jdGlvbihlbCwgZSl7IGRyYWdFbmQoZSk7fSwgICAgICAgICAgIGRyb3A6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnRHJvcChlKTt9ICAgICAgICAgfSwgY3NzOntzdmRfcV9kZXNpZ25fYm9yZGVyOiAkcm9vdC5pc0Rlc2lnbk1vZGUsIHN2ZF9xX3NlbGVjdGVkIDoga29Jc1NlbGVjdGVkLCBcXCd3ZWxsIHdlbGwtc21cXCc6ICRyb290LmlzRGVzaWduTW9kZX1cIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJjc3M6e3N2ZF9xX2Rlc2lnbjogJHJvb3QuaXNEZXNpZ25Nb2RlfSwgc3R5bGU6e29wYWNpdHk6IHF1ZXN0aW9uLmtvSXNEcmFnZ2luZ1NvdXJjZSgpID8gMC40IDogMX1cIj4gICAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXJcIiByb2xlPVwiYWxlcnRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb0Vycm9ycygpLmxlbmd0aCA+IDAsIGZvcmVhY2g6IGtvRXJyb3JzXCI+ICAgICAgICAgICAgPGRpdj4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWV4Y2xhbWF0aW9uLXNpZ25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6JGRhdGEuZ2V0VGV4dCgpXCI+PC9zcGFuPiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIGtvIGlmOiBxdWVzdGlvbi5oYXNUaXRsZSAtLT4gICAgICAgIDxoNSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcm9vdC5xdWVzdGlvblRpdGxlTG9jYXRpb24gPT0gXFwndG9wXFwnLCB0ZXh0OiBxdWVzdGlvbi5rb1RpdGxlKCksIGNzczogJHJvb3QuY3NzLnF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRleHQ6cXVlc3Rpb24uY29tbWVudFRleHRcIj48L2Rpdj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiB0cnVlIH0gfVwiPjwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIGtvIGlmOiBxdWVzdGlvbi5oYXNUaXRsZSAtLT4gICAgICAgIDxoNSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcm9vdC5xdWVzdGlvblRpdGxlTG9jYXRpb24gPT0gXFwnYm90dG9tXFwnLCB0ZXh0OiBxdWVzdGlvbi5rb1RpdGxlKCksIGNzczogJHJvb3QuY3NzLnF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInN2ZF9xdWVzdGlvbl9tZW51XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29Jc1NlbGVjdGVkXCI+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSAgYnRuLXhzIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1vcHRpb24taG9yaXpvbnRhbFwiPjwvc3Bhbj4gICAgICAgIDwvYnV0dG9uPiAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiPiAgICAgICAgICAgIDxsaT4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4teHNcIiBkYXRhLWJpbmQ9XCJjbGljazogJHJvb3QuY29weVF1ZXN0aW9uQ2xpY2ssIHRleHQ6JHJvb3QuZ2V0RWRpdG9yTG9jU3RyaW5nKFxcJ3N1cnZleS5hZGRUb1Rvb2xib3hcXCcpXCI+PC9idXR0b24+ICAgICAgICAgICAgPC9saT4gICAgICAgICAgICA8bGk+ICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRyb290LmZhc3RDb3B5UXVlc3Rpb25DbGljaywgdGV4dDokcm9vdC5nZXRFZGl0b3JMb2NTdHJpbmcoXFwnc3VydmV5LmNvcHlcXCcpXCI+PC9idXR0b24+ICAgICAgICAgICAgPC9saT4gICAgICAgIDwvdWw+ICAgIDwvZGl2PjwvZGl2Pic7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RlbXBsYXRlX3F1ZXN0aW9uLmh0bWwudHMiXSwic291cmNlUm9vdCI6IiJ9