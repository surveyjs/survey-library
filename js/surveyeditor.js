/*!
* surveyjs Editor v0.10.3
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
	        addToToolbox: "Add to toolbox",
	        deleteQuestion: "Delete Question"
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
	        angular: "Use Angular version",
	        jquery: "Use jQuery version",
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
	        if (this.getValue() == newValue) return;
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
	        if (this.object) {
	            this.koPages(this.getNames(this.object.pages));
	            this.koQuestions(this.getNames(this.object.getAllQuestions()));
	        }
	        _super.prototype.onValueChanged.call(this);
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
	        this.platformHeaders = {
	            "angular": "import { Component } from '@angular/core';\nimport * as Survey from 'survey-angular';",
	            "jquery": "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js\"></script>\n<script src=\"js/survey.jquery.min.js\"></script>",
	            "knockout": "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js\"></script>\n<script src=\"js/survey.ko.min.js\"></script>",
	            "react": "import React from 'react';\nimport ReactDOM from 'react-dom';\nimport * as Survey from 'survey-react';"
	        };
	        this.platformJSonPage = {
	            "angular": "@Component({\n  selector: 'ng-app',\n        template: \n        <div id='surveyElement'></div>\",\n})\nexport class AppComponent {\n    ngOnInit() {\n        var survey = new Survey.Model(surveyJSON);\n        survey.onComplete.add(sendDataToServer);\n       Survey.SurveyNG.render(\"surveyElement\", { model: survey });\n    }\n}",
	            "jquery": "var survey = new Survey.Model(surveyJSON);\n$(\"#surveyContainer\").Survey({\n    model: survey,\n    onComplete: sendDataToServer\n});",
	            "knockout": "var survey = new Survey.Model(surveyJSON, \"surveyContainer\");\nsurvey.onComplete.add(sendDataToServer);",
	            "react": "ReactDOM.render(\n    <Survey.Survey json={ surveyJSON } onComplete={ sendDataToServer } />, document.getElementById(\"surveyContainer\"));"
	        };
	        this.platformJSonWindow = {
	            "angular": "@Component({\n  selector: 'ng-app',\n        template: \n        <div id='surveyElement'></div>\",\n})\nexport class AppComponent {\n    ngOnInit() {\n        var survey = new Survey.Model(surveyJSON);\n        survey.onComplete.add(sendDataToServer);\n       Survey.SurveyWindowNG.render(\"surveyElement\", { model: survey });\n    }\n}",
	            "jquery": "var survey = new Survey.Model(surveyJSON);\n$(\"#surveyContainer\").SurveyWindow({\n    model: survey,\n    onComplete: sendDataToServer\n});",
	            "knockout": "var survey = new Survey.Model(surveyJSON);\nsurveyWindow.show();\nsurvey.onComplete.add(sendDataToServer);",
	            "react": "ReactDOM.render(\n    <Survey.SurveyWindow json={ surveyJSON } onComplete={ sendDataToServer } />, document.getElementById(\"surveyContainer\"));"
	        };
	        this.platformHtmlonPage = {
	            "angular": "<ng-app></ng-app>",
	            "jquery": "<div id=\"surveyContainer\"></div>",
	            "knockout": "<div id=\"surveyContainer\"></div>",
	            "react": "<div id=\"surveyContainer\"></div>"
	        };
	        this.platformHtmlonWindow = {
	            "angular": "<ng-app></ng-app>",
	            "jquery": "<div id=\"surveyContainer\"></div>",
	            "knockout": "",
	            "react": "<div id=\"surveyContainer\"></div>"
	        };
	        var self = this;
	        this.koLibraryVersion = ko.observable("jquery");
	        this.koShowAsWindow = ko.observable("page");
	        this.koScriptUsing = ko.observable("bootstrap");
	        this.koHasIds = ko.observable(false);
	        this.koLoadSurvey = ko.observable(false);
	        this.koHeadText = ko.observable("");
	        this.koJavaText = ko.observable("");
	        this.koBodyText = ko.observable("");
	        this.koVisibleHtml = ko.computed(function () {
	            return self.koShowAsWindow() == "page" || self.platformHtmlonWindow[self.koLibraryVersion()] != "";
	        });
	        this.koLibraryVersion.subscribe(function (newValue) {
	            self.setHeadText();self.setJavaTest();self.setBodyText();
	        });
	        this.koShowAsWindow.subscribe(function (newValue) {
	            self.setJavaTest();self.setBodyText();
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
	        if (this.hasAceEditor && this.surveyEmbedingHead == null) {
	            this.surveyEmbedingHead = this.createEditor("surveyEmbedingHead");
	            this.surveyEmbedingBody = this.createEditor("surveyEmbedingBody");
	            this.surveyEmbedingJava = this.createEditor("surveyEmbedingJava");
	        }
	        this.koHasIds(this.surveyId && this.surveyPostId);
	        this.setBodyText();
	        this.setHeadText();
	        this.setJavaTest();
	    };
	    SurveyEmbedingWindow.prototype.setBodyText = function () {
	        this.setTextToEditor(this.surveyEmbedingBody, this.koBodyText, this.platformHtmlonPage[this.koLibraryVersion()]);
	    };
	    SurveyEmbedingWindow.prototype.setHeadText = function () {
	        var str = this.platformHeaders[this.koLibraryVersion()];
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
	        var str = this.getSaveFunc() + "\n\n";
	        str += isOnPage ? this.platformJSonPage[this.koLibraryVersion()] : this.platformJSonWindow[this.koLibraryVersion()];
	        var jsonText = "var surveyJSON = " + this.getJsonText() + "\n\n";
	        return this.getSetCss() + "\n" + jsonText + str;
	    };
	    SurveyEmbedingWindow.prototype.getSetCss = function () {
	        if (this.koScriptUsing() != "bootstrap") return "";
	        return "Survey.Survey.cssType = \"bootstrap\";\n";
	    };
	    SurveyEmbedingWindow.prototype.getSaveFunc = function () {
	        return "function sendDataToServer(survey) {\n" + this.getSaveFuncCode() + "\n}";
	    };
	    SurveyEmbedingWindow.prototype.getSaveFuncCode = function () {
	        if (this.koHasIds()) return "    survey.sendResult('" + this.surveyPostId + "');";
	        return "    //send Ajax request to your web server.\n    alert(\"The results are:\" + JSON.stringify(s.data));";
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
	        var options = { obj: object, property: property, canShow: true };
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
	        //TODO remove the line above and call the method directly.
	        if (this.surveyValue["setDesignMode"]) this.surveyValue["setDesignMode"](true);
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
	        //TODO remove the line above and call the method directly.
	        if (this.survey["setDesignMode"]) this.survey["setDesignMode"](true);
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
	        this.surveyValue["onDeleteCurrentObject"].add(function (sender, options) {
	            self.deleteCurrentObject();
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
	    this.onDeleteCurrentObject = new Survey.Event();
	    var self = this;
	    this.copyQuestionClick = function () {
	        self.onCopyQuestion.fire(self);
	    };
	    this.fastCopyQuestionClick = function () {
	        self.onFastCopyQuestion.fire(self);
	    };
	    this.deleteCurrentObjectClick = function () {
	        self.onDeleteCurrentObject.fire(self);
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
	var html = exports.html = '<div class="svd_container">    <ul class="navbar-default container-fluid nav nav-tabs svd_menu">        <li data-bind="css: {active: koViewType() == \'designer\'}"><a href="#" data-bind="click:selectDesignerClick, text: $root.getLocString(\'ed.designer\')"></a></li>        <li data-bind="visible: showJSONEditorTab, css: {active: koViewType() == \'editor\'}"><a href="#" data-bind="click:selectEditorClick, text: $root.getLocString(\'ed.jsonEditor\')"></a></li>        <li data-bind="visible: showTestSurveyTab, css: {active: koViewType() == \'test\'}"><a href="#" data-bind="click:selectTestClick, text: $root.getLocString(\'ed.testSurvey\')"></a></li>        <li data-bind="visible: showEmbededSurveyTab, css: {active: koViewType() == \'embed\'}"><a href="#" data-bind="click:selectEmbedClick, text: $root.getLocString(\'ed.embedSurvey\')"></a></li>        <li class="svd_actions" data-bind="visible: koIsShowDesigner">            <button type="button" class="btn btn-primary" data-bind="enable:undoRedo.koCanUndo, click: doUndoClick"><span data-bind="text: $root.getLocString(\'ed.undo\')"></span></button>        </li>        <li class="svd_actions" data-bind="visible: koIsShowDesigner">            <button type="button" class="btn btn-primary" data-bind="enable:undoRedo.koCanRedo, click: doRedoClick"><span data-bind="text: $root.getLocString(\'ed.redo\')"></span></button>        </li>        <li class="svd_actions" data-bind="visible: (koIsShowDesigner() && koShowOptions())">            <div class="btn-group inline">                <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bind="text: $root.getLocString(\'ed.options\')">                    Options                     <span class="caret"></span>                </button>                <ul class="dropdown-menu">                    <li data-bind="css: {active: koGenerateValidJSON}"><a href="#" data-bind="click:generateValidJSONClick, text: $root.getLocString(\'ed.generateValidJSON\')"></a></li>                    <li data-bind="css: {active: !koGenerateValidJSON()}"><a href="#" data-bind="click:generateReadableJSONClick, text: $root.getLocString(\'ed.generateReadableJSON\')"></a></li>                </ul>            </div>        </li>        <li class="svd_actions" data-bind="visible: koViewType() == \'test\'">            <div class="btn-group inline">                <button type="button" id="surveyTestWidth" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">                    <span data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \' \' + $root.koTestSurveyWidth()"></span>                    <span class="caret"></span>                </button>                <ul class="dropdown-menu" aria-labelledby="surveyTestWidth">                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'100%\')">100%</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'1200px\')">1200px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'1000px\')">1000px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'800px\')">800px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'600px\')">600px</a></li>                    <li><a href="#" data-bind="click: koTestSurveyWidth.bind($data, \'400px\')">400px</a></li>                </ul>            </div>        </li>        <li class="svd_actions">            <button type="button" class="btn btn-primary svd_save_btn" data-bind="click: saveButtonClick, visible: koShowSaveButton"><span data-bind="text: $root.getLocString(\'ed.saveSurvey\')"></span></button>        </li>    </ul>    <div class="panel svd_content">        <div class="row svd_survey_designer"  data-bind="visible: koViewType() == \'designer\'">            <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 panel panel-default svd_toolbox">                <div class="btn-group-vertical" style="width:100%;padding-right:2px">                    <!-- ko foreach: questionTypes -->                    <div class="btn btn-default" style="text-align:left; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}, dragend: function(el, e) { $parent.dragEnd(); }}">                        <span data-bind="css: \'icon-\' + $data"></span>                        <span class="svd_toolbox_item_text" data-bind="text: $root.getLocString(\'qt.\' + $data)"></span>                    </div>                    <!-- /ko  -->                    <!-- ko foreach: koCopiedQuestions -->                    <div class="btn btn-default" style="text-align:left; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickCopiedQuestion, event:{dragstart: function(el, e) { $parent.draggingCopiedQuestion($data, e); return true;}, dragend: function(el, e) { $parent.dragEnd(); }}">                        <span class="icon-default"></span>                        <span class="svd_toolbox_item_text" data-bind="text:name"></span>                    </div>                    <!-- /ko  -->                </div>            </div>            <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12 svd_editors">                <div class="svd_pages_editor" data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>                <div class="svd_questions_editor" id="scrollableDiv">                    <div id="surveyjs"></div>                </div>            </div>            <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 panel panel-default svd_properties">                <div class="panel-heading input-group">                    <div class="custom-select">                        <select class="form-control" data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                    </div>                    <div class="input-group-btn">                        <button class="btn btn-default" type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject, attr: { title: $root.getLocString(\'ed.delSelObject\')}"><span class="glyphicon glyphicon-remove"></span></button>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                <div class="panel-footer" data-bind="visible:surveyVerbs.koHasVerbs">                    <div data-bind="template: { name: \'objectverbs\', data: surveyVerbs }"></div>                </div>            </div>        </div>        <div data-bind="visible: koViewType() == \'editor\'">            <div data-bind="template: { name: \'jsoneditor\', data: jsonEditor }"></div>        </div>        <div id="surveyjsTest" data-bind="visible: koViewType() == \'test\', style: {width: koTestSurveyWidth}">            <div id="surveyjsExample"></div>            <div id="surveyjsExampleResults"></div>            <button id="surveyjsExamplereRun" data-bind="click:selectTestClick, text: $root.getLocString(\'ed.testSurveyAgain\')" style="display:none">Test Again</button>        </div>        <div id="surveyjsEmbed" data-bind="visible: koViewType() == \'embed\'">            <div data-bind="template: { name: \'surveyembeding\', data: surveyEmbeding }"></div>        </div>    </div></div><script type="text/html" id="jsoneditor">    <div data-bind="visible: !hasAceEditor">        <textarea class="svd_json_editor_area" data-bind="textInput:koText"></textarea>        <!-- ko foreach: koErrors -->        <div>            <span>Error: </span><span data-bind="text: text"></span>        </div>        <!-- /ko  -->    </div>    <div id="surveyjsJSONEditor" class="svd_json_editor"></div></script><script type="text/html" id="objecteditor">    <table class="table svd_table-nowrap">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), css: {\'active\': $parent.koActiveProperty() == $data}">                <td data-bind="text: displayName, attr: {title: title}" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data && (koText() || $data.editorType == \'boolean\'), attr: {title: koText}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data || (!koText() && $data.editorType != \'boolean\')">                        <!-- ko template: { name: \'propertyeditor-\' + editorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="objectverbs">    <!-- ko foreach: koVerbs -->        <div class="row">            <div class="input-group">                <span  class="input-group-addon" data-bind="text:text"></span>                <select class="form-control" data-bind="options: koItems, optionsText: \'text\', optionsValue:\'value\', value: koSelectedItem"></select>            </div>        </div>    <!-- /ko  --></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs" data-bind="tabs:true">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()},event:{           keydown:function(el, e){ $parent.keyDown(el, e); },           dragstart:function(el, e){ $parent.dragStart(el); return true; },           dragover:function(el, e){ $parent.dragOver(el);},           dragend:function(el, e){ $parent.dragEnd();},           drop:function(el, e){ $parent.dragDrop(el);}         }">             <a class="svd_page_nav" href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button class="btn btn-default svd_add_new_page_btn" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="surveyembeding">    <div class="row">        <select data-bind="value:koLibraryVersion">            <option value="angular" data-bind="text: $root.getLocString(\'ew.angular\')"></option>            <option value="jquery" data-bind="text: $root.getLocString(\'ew.jquery\')"></option>            <option value="knockout" data-bind="text: $root.getLocString(\'ew.knockout\')"></option>            <option value="react" data-bind="text: $root.getLocString(\'ew.react\')"></option>        </select>        <select data-bind="value:koScriptUsing">            <option value="bootstrap" data-bind="text: $root.getLocString(\'ew.bootstrap\')"></option>            <option value="standard" data-bind="text: $root.getLocString(\'ew.standard\')"></option>        </select>        <select data-bind="value:koShowAsWindow">            <option value="page" data-bind="text: $root.getLocString(\'ew.showOnPage\')"></option>            <option value="window" data-bind="text: $root.getLocString(\'ew.showInWindow\')"></option>        </select>        <label class="checkbox-inline" data-bind="visible:koHasIds">            <input type="checkbox" data-bind="checked:koLoadSurvey" />            <span data-bind="text: $root.getLocString(\'ew.loadFromServer\')"></span>        </label>    </div>    <div class="panel">        <div class="panel-heading" data-bind="text: $root.getLocString(\'ew.titleScript\')"></div>        <div data-bind="visible:hasAceEditor">            <div id="surveyEmbedingHead" style="height:70px;width:100%"></div>        </div>        <textarea data-bind="visible:!hasAceEditor, text: koHeadText" style="height:70px;width:100%"></textarea>    </div>    <div class="panel" data-bind="visible: koVisibleHtml">        <div class="panel-heading"  data-bind="text: $root.getLocString(\'ew.titleHtml\')"></div>        <div data-bind="visible:hasAceEditor">            <div id="surveyEmbedingBody" style="height:30px;width:100%"></div>        </div>        <textarea data-bind="visible:!hasAceEditor, text: koBodyText" style="height:30px;width:100%"></textarea>    </div>    <div class="panel">        <div class="panel-heading"  data-bind="text: $root.getLocString(\'ew.titleJavaScript\')"></div>        <div data-bind="visible:hasAceEditor">            <div id="surveyEmbedingJava" style="height:300px;width:100%"></div>        </div>        <textarea data-bind="visible:!hasAceEditor, text: koJavaText" style="height:300px;width:100%"></textarea>    </div></script><script type="text/html" id="propertyeditor-boolean">    <input class="form-control" type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <div class="custom-select">        <select class="form-control" data-bind="value: koValue, options: choices"  style="width:100%"></select>    </div></script><script type="text/html" id="propertyeditor-html">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-html">    <textarea class="form-control" data-bind="value:koValue" style="width:100%" rows="10" autofocus="autofocus"></textarea></script><script type="text/html" id="propertyeditor-itemvalues">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-itemvalues">    <div style="overflow-y: auto; overflow-x:hidden; max-height:400px">        <table class="table">            <thead>                <tr>                    <th></th>                    <th data-bind="text: $root.getLocString(\'pe.value\')"></th>                    <th data-bind="text: $root.getLocString(\'pe.text\')"></th>                    <th></th>                </tr>            </thead>            <tbody>                <!-- ko foreach: koItems -->                <tr>                    <td>                        <div class="btn-group" role="group">                            <button type="button" class="btn btn-xs" data-bind="visible: $index() > 0, click: $parent.onMoveUpClick"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button>                            <button type="button" class="btn btn-xs" style="float:none" data-bind="visible: $index() < $parent.koItems().length - 1, click: $parent.onMoveDownClick"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button>                        </div>                    </td>                    <td>                        <input type="text" class="form-control" data-bind="value:koValue" style="width:200px" />                        <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError, text: $root.getLocString(\'pe.enterNewValue\')"></div>                    </td>                    <td><input type="text" class="form-control" data-bind="value:koText" style="width:200px" /></td>                    <td><button type="button" class="btn btn-xs" data-bind="click: $parent.onDeleteClick"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td>                </tr>                <!-- /ko -->            </tbody>        </table>    </div>    <div class="row btn-toolbar">        <input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')" />        <input type="button" class="btn btn-danger" data-bind="click: onClearClick, value: $root.getLocString(\'pe.removeAll\')" />    </div></script><script type="text/html" id="propertyeditor-matrixdropdowncolumns">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-matrixdropdowncolumns">    <table class="table">        <thead>            <tr>                <th data-bind="text: $root.getLocString(\'pe.required\')"></th>                <th data-bind="text: $root.getLocString(\'pe.cellType\')"></th>                <th data-bind="text: $root.getLocString(\'pe.name\')"></th>                <th data-bind="text: $root.getLocString(\'pe.title\')"></th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td>                    <a href="#" data-bind="visible:koHasChoices, click: onShowChoicesClick">                        <span class="glyphicon" data-bind="css: {\'glyphicon-chevron-down\': !koShowChoices(), \'glyphicon-chevron-up\': koShowChoices()}"></span>                    </a>                    <input type="checkbox" data-bind="checked: koIsRequired" />                </td>                <td>                    <select class="form-control" data-bind="options: cellTypeChoices, value: koCellType"  style="width:110px"></select>                </td>                <td>                    <input type="text" class="form-control" data-bind="value:koName" style="width:100px" />                    <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError, text: $root.getLocString(\'pe.enterNewValue\')"></div>                </td>                <td><input type="text" class="form-control" data-bind="value:koTitle" style="width:120px" /></td>                <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')"/></td>            </tr>            <tr data-bind="visible: koShowChoices() && koHasChoices()">                <td colspan="4" style="border-top-style:none">                    <div class="form-group">                        <label class="control-label col-sm-3" data-bind="text:$root.getLocString(\'pe.hasOther\')"></label>                        <div class="col-sm-2">                            <input type="checkbox" data-bind="checked: koHasOther" />                        </div>                        <div class="col-sm-7" data-bind="visible: !koHasColCount()"></div>                        <label class="control-label col-sm-3" data-bind="visible:koHasColCount, text:$root.getLocString(\'pe.colCount\')"></label>                        <select class="form-control col-sm-4" data-bind="visible:koHasColCount, options: colCountChoices, value: koColCount" style="width:110px"></select>                    </div>                    <div class="modal-body svd_notopbottompaddings">                        <!-- ko template: { name: \'propertyeditorcontent-itemvalues\', data: choicesEditor } -->                        <!-- /ko -->                    </div>                </td>            </tr>            <!-- /ko -->            <tr>                <td colspan="3">                    <div class="row btn-toolbar">                        <input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')"/>                        <input type="button" class="btn btn-danger" data-bind="click: onClearClick, value: $root.getLocString(\'pe.removeAll\')"" />                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="propertyeditor-modal">    <div class="input-group" data-bind="visible:!editor.isEditable">        <span data-bind="text: koText"></span>        <div class="input-group-btn">            <button type="button"  class="btn btn-default"data-toggle="modal" style="padding: 2px;" data-bind="attr: {\'data-target\' : modalNameTarget}">                <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>            </button>        </div>    </div>    <div class="input-group" data-bind="visible:editor.isEditable" style="display:table">        <input class="form-control" type="text" data-bind="value: koValue" style="display:table-cell; width:100%" />        <div class="input-group-btn">            <button type="button" class="btn btn-default" style="display:table-cell; padding: 2px;"  data-toggle="modal" data-bind="attr: {\'data-target\' : modalNameTarget}">                <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>            </button>        </div>    </div>    <div data-bind="attr: {id : modalName}" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:editor.title"></h4>                </div>                  <div class="modal-body svd_notopbottompaddings">                    <!-- ko template: { name: \'propertyeditorcontent-\' + editorType, data: editor } -->                    <!-- /ko -->                </div>                <div class="modal-footer">                    <input type="button" class="btn btn-primary" data-bind="click: editor.onApplyClick, value: $root.getLocString(\'pe.apply\')" style="width:100px" />                    <input type="button" class="btn btn-default" data-bind="click: editor.onResetClick, value: $root.getLocString(\'pe.reset\')" style="width:100px" />                    <input type="button" class="btn btn-default" data-dismiss="modal" data-bind="value: $root.getLocString(\'pe.close\')" style="width:100px" />                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-number">    <input class="form-control" type="number" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-restfull">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-restfull">    <form>        <div class="form-group">            <label for="url">Url:</label>            <input id="url" type="text" data-bind="value:koUrl" class="form-control" />        </div>        <div class="form-group">            <label for="path">Path:</label>            <input id="path" type="text" data-bind="value:koPath" class="form-control" />        </div>        <div class="form-group">            <label for="valueName">valueName:</label>            <input id="valueName" type="text" data-bind="value:koValueName" class="form-control" />        </div>        <div class="form-group">            <label for="titleName">titleName:</label>            <input id="titleName" type="text" data-bind="value:koTitleName" class="form-control" />        </div>    </form>    <div id="restfullSurvey" style="width:100%;height:150px"></div></script><script type="text/html" id="propertyeditor-string">    <input class="form-control" type="text" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-text">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-text">    <textarea class="form-control" data-bind="value:koValue" style="width:100%" rows="10" autofocus="autofocus"></textarea></script><script type="text/html" id="propertyeditor-textitems">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-textitems"><div class="panel">    <table class="table">        <thead>            <tr>                <th data-bind="text: $root.getLocString(\'pe.name\')"></th>                <th data-bind="text: $root.getLocString(\'pe.title\')"></th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td><input type="text" class="form-control" data-bind="value:koName" style="width:200px" /></td>                <td><input type="text" class="form-control" data-bind="value:koTitle" style="width:200px" /></td>                <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')"/></td>            </tr>            <!-- /ko -->            <tr>                <td colspan="4"><input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')"/></td>            </tr>        </tbody>    </table></div></script><script type="text/html" id="propertyeditor-triggers">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-triggers"><div class="panel">    <div class="row" style="margin-bottom:10px">        <div class="col-lg-12">            <div class="input-group form-inline">                <div class="input-group-btn">                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                        <span class="glyphicon glyphicon-plus"></span>                    </button>                    <ul class="dropdown-menu">                        <!-- ko foreach: availableTriggers -->                        <li><a data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                        <!-- /ko  -->                    </ul>                </div>                <select class="form-control" data-bind="options: koItems, optionsText: \'koText\', value: koSelected"></select>                <span class="input-group-btn">                    <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                </span>            </div>        </div>    </div>    <div data-bind="visible: koSelected() == null">        <div data-bind="visible: koQuestions().length == 0, text: $root.getLocString(\'pe.noquestions\')"></div>        <div data-bind="visible: koQuestions().length > 0, text: $root.getLocString(\'pe.createtrigger\')"></div>    </div>    <div data-bind="visible: koSelected() != null">        <div data-bind="with: koSelected">            <div class="row"  style="margin-bottom:10px">                <div class="col-lg-4 col-sm-4">                    <div class="input-group  form-inline">                        <div class="form-group">                            <span class="input-group" data-bind="text: $root.getLocString(\'pe.triggerOn\')"></span>                        </div>                        <div class="form-group">                            <select class="form-control" data-bind="options:$parent.koQuestions, value: koName"></select>                        </div>                    </div>                </div>                <div class="col-lg-4 col-sm-4">                    <div class="input-group">                        <select class="form-control" data-bind="options:availableOperators, optionsValue: \'name\', optionsText: \'text\', value:koOperator"></select>                    </div>                </div>                <div class="col-lg-4 col-sm-4">                    <div class="input-group">                        <input class="form-control" type="text" data-bind="visible: koRequireValue, value:koValue" />                    </div>                </div>            </div>            <!-- ko if: koType() == \'visibletrigger\' -->            <div class="row">                <div class="col-lg-6 col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: pages } -->                    <!-- /ko -->                </div>                <div class="col-lg-6 col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: questions } -->                    <!-- /ko -->                </div>            </div>            <!-- /ko -->            <!-- ko if: koType() == \'completetrigger\' -->            <div class="row">               <div style="margin: 10px" data-bind="text: $root.getLocString(\'pe.triggerCompleteText\')"></div>            </div>            <!-- /ko -->            <!-- ko if: koType() == \'setvaluetrigger\' -->            <div class="row">                <div class="col-lg-4 col-sm-4">                    <div class="input-group form-inline">                        <div>                            <span data-bind="text: $root.getLocString(\'pe.triggerSetToName\')"></span>                        </div>                        <input class="form-control" type="text" data-bind="value:kosetToName" />                    </div>                </div>                <div class="col-lg-4 col-sm-4">                    <div class="input-group form-inline">                        <div>                            <span data-bind="text: $root.getLocString(\'pe.triggerSetValue\')"></span>                        </div>                        <input class="form-control" type="text" data-bind="value:kosetValue" />                    </div>                </div>            </div>            <div class="row">                <div class="col-lg-4 col-sm-4">                    <div class="input-group">                        <input type="checkbox" data-bind="checked: koisVariable" /> <span data-bind="text: $root.getLocString(\'pe.triggerIsVariable\')"></span>                    </div>                </div>                <div class="col-lg-8 col-sm-8">                </div>            </div>            <!-- /ko -->        </div>    </div></div></script><script type="text/html" id="propertyeditor-triggersitems">    <div class="panel no-margins no-padding">        <div data-bind="text: title" style="margin-bottom:10px"></div>        <div class="input-group">            <select class="form-control" multiple="multiple" data-bind="options:koChoosen, value: koChoosenSelected"></select>            <span class="input-group-btn" style="vertical-align:top">                <button type="button" data-bind="enable: koChoosenSelected() != null, click: onDeleteClick" class="btn"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>        <div class="input-group" style="margin-top:5px">            <select class="form-control" data-bind="options:koObjects, value: koSelected"></select>            <span class="input-group-btn">                <button type="button" class="btn btn-default" data-bind="enable: koSelected() != null, click: onAddClick" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></button>            </span>        </div>    </div></script><script type="text/html" id="propertyeditor-validators">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-validators"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <button type="button" class="dropdown-toggle input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                <span class="glyphicon glyphicon-plus"></span>            </button>            <ul class="dropdown-menu input-group">                <!-- ko foreach: availableValidators -->                <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                <!-- /ko  -->            </ul>            <select class="form-control" data-bind="options: koItems, optionsText: \'text\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div></div></script>';

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
	var html = exports.html = '<div class="svd_question" style="vertical-align:top" data-bind="style: {display: question.koVisible()|| $root.isDesignMode ? \'inline-block\': \'none\', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth },     attr : {id: id, draggable: $root.isDesignMode}, click: $root.isDesignMode ? koOnClick: null,          event:{           keydown: function(el, e) { if(e.witch == 46) $root.deleteCurrentObjectClick(); return true; },           dragstart:function(el, e){ dragStart(e); return true; },           dragover:function(el, e){ if(!question.isDragging) dragOver(e);},           dragend:function(el, e){ dragEnd(e);},           drop:function(el, e){ dragDrop(e);}         }, css:{svd_q_design_border: $root.isDesignMode, svd_q_selected : koIsSelected, \'well well-sm\': $root.isDesignMode}">    <div data-bind="css:{svd_q_design: $root.isDesignMode}, style:{opacity: question.koIsDraggingSource() ? 0.4 : 1}">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'top\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            <div data-bind="text:question.commentText"></div>            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'bottom\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->    </div>    <div class="svd_question_menu" data-bind="visible: koIsSelected">        <button type="button" class="btn btn-primary  btn-xs dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">            <span class="glyphicon glyphicon-option-horizontal"></span>        </button>        <ul class="dropdown-menu">            <li>                <button class="btn btn-primary btn-xs" data-bind="click: $root.copyQuestionClick, text:$root.getEditorLocString(\'survey.addToToolbox\')"></button>            </li>            <li>                <button class="btn btn-primary btn-xs" data-bind="click: $root.fastCopyQuestionClick, text:$root.getEditorLocString(\'survey.copy\')"></button>            </li>            <li>                <button class="btn btn-primary btn-xs" data-bind="click: $root.deleteCurrentObjectClick, text:$root.getEditorLocString(\'survey.deleteQuestion\')"></button>            </li>        </ul>    </div></div>';

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwNWViNThjNTE0ZGNlNGRiNTkwYSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhZ2Ryb3BoZWxwZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcInJvb3RcIjpcIlN1cnZleVwiLFwiY29tbW9uanMyXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImNvbW1vbmpzXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImFtZFwiOlwic3VydmV5LWtub2Nrb3V0XCJ9Iiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1zRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNb2RhbEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yTG9jYWxpemF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9zdXJ2ZXlIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0UHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5UmVzdGZ1bGxFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRyaWdnZXJzRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wYWdlc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGV4dFdvcmtlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvanNvbjUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleUVtYmVkaW5nV2luZG93LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RWZXJicy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5kb3JlZG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5T2JqZWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5SlNPTkVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVFZGl0b3Iua28uaHRtbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVfcGFnZS5odG1sLnRzIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNyQ0E7Ozs7Ozs7OztnQ0FDNEI7Ozs7OztnQ0FBNEI7Ozs7OztnQ0FDeEI7Ozs7OztnQ0FBNkI7Ozs7Oztn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L3IrQixLQUFRLHNCQUFvMUQsaTFEOzs7Ozs7Ozs7QUNBNTFELEtBQVEsc0JBQTI4Rix3OEYiLCJmaWxlIjoic3VydmV5ZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwic3VydmV5LWtub2Nrb3V0XCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiU3VydmV5RWRpdG9yXCIsIFtcInN1cnZleS1rbm9ja291dFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTdXJ2ZXlFZGl0b3JcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJzdXJ2ZXkta25vY2tvdXRcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlN1cnZleUVkaXRvclwiXSA9IGZhY3Rvcnkocm9vdFtcIlN1cnZleVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXykge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwNWViNThjNTE0ZGNlNGRiNTkwYSIsImV4cG9ydCB7RHJhZ0Ryb3BIZWxwZXJ9IGZyb20gXCIuLi9kcmFnZHJvcGhlbHBlclwiO1xuZXhwb3J0IHtcbiAgICBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UsIFN1cnZleVN0cmluZ1Byb3BlcnR5RWRpdG9yLFxuICAgIFN1cnZleURyb3Bkb3duUHJvcGVydHlFZGl0b3IsIFN1cnZleUJvb2xlYW5Qcm9wZXJ0eUVkaXRvciwgU3VydmV5TnVtYmVyUHJvcGVydHlFZGl0b3Jcbn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlUZXh0SXRlbXNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlEcm9wZG93bkNvbHVtbnNFZGl0b3IsIFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbX1cbiAgICBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zRWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVByb3BlcnR5TW9kYWxFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNb2RhbEVkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVJlc3VsdGZ1bGxFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlSZXN0ZnVsbEVkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5VHJpZ2dlcnNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5VmFsaWRhdG9yc0VkaXRvclwiO1xuXG5leHBvcnQge1N1cnZleU9iamVjdFByb3BlcnR5fSBmcm9tIFwiLi4vb2JqZWN0UHJvcGVydHlcIjtcbmV4cG9ydCB7U3VydmV5T2JqZWN0RWRpdG9yfSBmcm9tIFwiLi4vb2JqZWN0RWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVBhZ2VzRWRpdG9yfSBmcm9tIFwiLi4vcGFnZXNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5VGV4dFdvcmtlcn0gZnJvbSBcIi4uL3RleHRXb3JrZXJcIjtcbmV4cG9ydCB7T2JqVHlwZSwgU3VydmV5SGVscGVyfSBmcm9tIFwiLi4vc3VydmV5SGVscGVyXCI7XG5leHBvcnQge1N1cnZleUVtYmVkaW5nV2luZG93fSBmcm9tIFwiLi4vc3VydmV5RW1iZWRpbmdXaW5kb3dcIjtcbmV4cG9ydCB7U3VydmV5VmVyYnMsIFN1cnZleVZlcmJJdGVtLCBTdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0sIFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbX0gZnJvbSBcIi4uL29iamVjdFZlcmJzXCI7XG5leHBvcnQge1N1cnZleVVuZG9SZWRvLCBVbmRvUmVkb0l0ZW19IGZyb20gXCIuLi91bmRvcmVkb1wiO1xuZXhwb3J0IHtTdXJ2ZXlFZGl0b3J9IGZyb20gXCIuLi9lZGl0b3JcIjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZW50cmllcy9pbmRleC50cyIsImltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRHJhZ0Ryb3BIZWxwZXIge1xyXG4gICAgc3RhdGljIGRhdGFTdGFydDogc3RyaW5nID0gXCJzdXJ2ZXlqcyxcIjtcclxuICAgIHN0YXRpYyBkcmFnRGF0YTogYW55ID0ge3RleHQ6IFwiXCIsIGpzb246IG51bGwgfTtcclxuICAgIHN0YXRpYyBwcmV2RXZlbnQgPSB7IHF1ZXN0aW9uOiBudWxsLCB4OiAtMSwgeTogLTEgfTtcclxuICAgIHByaXZhdGUgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnk7XHJcbiAgICBwcml2YXRlIHNjcm9sbGFibGVFbGVtZW50OiBIVE1MRWxlbWVudCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNvdXJjZUluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhOiBTdXJ2ZXkuSVN1cnZleSwgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnksIHNjcm9sbGFibGVFbE5hbWU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjayA9IG9uTW9kaWZpZWRDYWxsYmFjaztcclxuICAgICAgICB0aGlzLnNjcm9sbGFibGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoKHNjcm9sbGFibGVFbE5hbWUgPyBzY3JvbGxhYmxlRWxOYW1lIDogXCJzY3JvbGxhYmxlRGl2XCIpKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gPFN1cnZleS5TdXJ2ZXk+dGhpcy5kYXRhOyB9XHJcbiAgICBwdWJsaWMgc3RhcnREcmFnTmV3UXVlc3Rpb24oZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwYXJlRGF0YShldmVudCwgcXVlc3Rpb25UeXBlLCBxdWVzdGlvbk5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXJ0RHJhZ1F1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwYXJlRGF0YShldmVudCwgbnVsbCwgcXVlc3Rpb25OYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGFydERyYWdDb3BpZWRRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbk5hbWU6IHN0cmluZywgcXVlc3Rpb25Kc29uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnByZXBhcmVEYXRhKGV2ZW50LCBudWxsLCBxdWVzdGlvbk5hbWUsIHF1ZXN0aW9uSnNvbik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaXNTdXJ2ZXlEcmFnZ2luZyhldmVudDogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKGV2ZW50KS50ZXh0O1xyXG4gICAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuaW5kZXhPZihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQpID09IDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZG9EcmFnRHJvcE92ZXIoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tTY3JvbGxZKGV2ZW50KTtcclxuICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YS50YXJnZXRRdWVzdGlvbjtcclxuICAgICAgICBpZiAoIXF1ZXN0aW9uIHx8IHF1ZXN0aW9uID09IHRhcmdldFF1ZXN0aW9uIHx8ICF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpIHx8IHRoaXMuaXNTYW1lUGxhY2UoZXZlbnQsIHF1ZXN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlSW5kZXggPT0gaW5kZXggfHwgdGhpcy5zb3VyY2VJbmRleCArIDEgPT0gaW5kZXgpICBpbmRleCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZVtcImtvRHJhZ2dpbmdcIl0oaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGVuZCgpIHtcclxuICAgICAgICB0aGlzLmlzU2Nyb2xsU3RvcCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zZXRJc0RyYWdnaW5nU291cmNlKHRoaXMuc3VydmV5W1wia29EcmFnZ2luZ1NvdXJjZVwiXSgpLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlbXCJrb0RyYWdnaW5nU291cmNlXCJdKG51bGwpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXSgtMSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZG9Ecm9wKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlID0gbnVsbCkge1xyXG4gICAgICAgIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXSgpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YS50YXJnZXRRdWVzdGlvbjtcclxuICAgICAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uICYmIGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRJbmRleCA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRJbmRleCA+IC0xICYmIG9sZEluZGV4IDwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlUXVlc3Rpb25Ubyh0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW5kKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZG9MZWF2ZVBhZ2UoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICAgIGV2ZW50ID0gdGhpcy5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbGFibGVFbGVtZW50KSByZXR1cm47XHJcbiAgICAgICAgaWYgKGV2ZW50LmNsaWVudFggPD0gMCB8fCBldmVudC5jbGllbnRZIDw9IDAgfHxcclxuICAgICAgICAgICAgZXZlbnQuY2xpZW50WCA+PSB0aGlzLnNjcm9sbGFibGVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IGV2ZW50LmNsaWVudFkgPj0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudC5vZmZzZXRIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKC0xKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVRhcmdldFF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbk5hbWU6IHN0cmluZywganNvbjogYW55KTogU3VydmV5LlF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgaWYgKCFxdWVzdGlvbk5hbWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPnRoaXMuc3VydmV5LmdldFF1ZXN0aW9uQnlOYW1lKHF1ZXN0aW9uTmFtZSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VJbmRleCA9IC0xO1xyXG4gICAgICAgIGlmICh0YXJnZXRRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZUluZGV4ID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24oanNvbltcInR5cGVcIl0sIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9PYmplY3QoanNvbiwgdGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24ubmFtZSA9IHF1ZXN0aW9uTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uICYmIHF1ZXN0aW9uVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgcXVlc3Rpb25OYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXRRdWVzdGlvbi5zZXREYXRhKHRoaXMuc3VydmV5KTtcclxuICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24ucmVuZGVyV2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRJc0RyYWdnaW5nU291cmNlKHRhcmdldFF1ZXN0aW9uLCB0cnVlKTtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0UXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldElzRHJhZ2dpbmdTb3VyY2UocXVlc3Rpb246IGFueSwgdmFsOiBhbnkpIHtcclxuICAgICAgICBpZiAocXVlc3Rpb24gJiYgcXVlc3Rpb25bXCJrb0lzRHJhZ2dpbmdTb3VyY2VcIl0pIHF1ZXN0aW9uW1wia29Jc0RyYWdnaW5nU291cmNlXCJdKHZhbCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFF1ZXN0aW9uSW5kZXgoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIGlmICghcXVlc3Rpb24pIHJldHVybiBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbik7XHJcbiAgICAgICAgZXZlbnQgPSB0aGlzLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gPG51bWJlcj5ldmVudC5jdXJyZW50VGFyZ2V0W1wiY2xpZW50SGVpZ2h0XCJdO1xyXG4gICAgICAgIHZhciB5ID0gZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ2xheWVyWCcpKSB7XHJcbiAgICAgICAgICAgIHkgPSBldmVudC5sYXllclkgLSA8bnVtYmVyPmV2ZW50LmN1cnJlbnRUYXJnZXRbXCJvZmZzZXRUb3BcIl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh5ID4gaGVpZ2h0IC8gMikgaW5kZXgrKztcclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU2FtZVBsYWNlKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XHJcbiAgICAgICAgaWYgKHByZXYucXVlc3Rpb24gIT0gcXVlc3Rpb24gfHwgTWF0aC5hYnMoZXZlbnQuY2xpZW50WCAtIHByZXYueCkgPiA1IHx8IE1hdGguYWJzKGV2ZW50LmNsaWVudFkgLSBwcmV2LnkpID4gNSkge1xyXG4gICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gcXVlc3Rpb247XHJcbiAgICAgICAgICAgIHByZXYueCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgICAgIHByZXYueSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU2Nyb2xsU3RvcDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBTY3JvbGxEZWxheTogbnVtYmVyID0gMzA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBTY3JvbGxPZmZzZXQ6IG51bWJlciA9IDEwMDtcclxuICAgIHByaXZhdGUgY2hlY2tTY3JvbGxZKGU6IERyYWdFdmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxhYmxlRWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JvbGxhYmxlRWxlbWVudFBvc1koZSk7XHJcbiAgICAgICAgaWYgKHkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Njcm9sbFN0b3AgPSB0cnVlO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSA8bnVtYmVyPnRoaXMuc2Nyb2xsYWJsZUVsZW1lbnRbXCJjbGllbnRIZWlnaHRcIl07XHJcbiAgICAgICAgaWYgKHkgPCBEcmFnRHJvcEhlbHBlci5TY3JvbGxPZmZzZXQgJiYgeSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxTdG9wID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZG9TY3JvbGxZKC0xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhlaWdodCAtIHkgPCBEcmFnRHJvcEhlbHBlci5TY3JvbGxPZmZzZXQgJiYgaGVpZ2h0ID49IHkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1Njcm9sbFN0b3AgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kb1Njcm9sbFkoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb1Njcm9sbFkoc3RlcDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudDtcclxuICAgICAgICB2YXIgc2Nyb2xsWSA9IGVsLnNjcm9sbFRvcCArIHN0ZXA7XHJcbiAgICAgICAgaWYgKHNjcm9sbFkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxTdG9wID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbC5zY3JvbGxUb3AgPSBzY3JvbGxZO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuaXNTY3JvbGxTdG9wKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBzZWxmLmRvU2Nyb2xsWShzdGVwKSB9LCBEcmFnRHJvcEhlbHBlci5TY3JvbGxEZWxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTY3JvbGxhYmxlRWxlbWVudFBvc1koZTogRHJhZ0V2ZW50KTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQgfHwgIWUuY3VycmVudFRhcmdldCkgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBlLm9mZnNldFkgKyA8bnVtYmVyPmUuY3VycmVudFRhcmdldFtcIm9mZnNldFRvcFwiXSAtIHRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQub2Zmc2V0VG9wIC0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEV2ZW50KGV2ZW50OiBEcmFnRXZlbnQpOiBEcmFnRXZlbnQge1xyXG4gICAgICAgIHJldHVybiBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0gPyBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0gOiBldmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICBpZiAocGFnZSA9PSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSAmJiBpbmRleCA9PSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRhcmdldFF1ZXN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChwYWdlKSB7XHJcbiAgICAgICAgICAgIHBhZ2UucmVtb3ZlUXVlc3Rpb24odGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5hZGRRdWVzdGlvbih0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaykgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RGF0YUluZm8oZXZlbnQ6IERyYWdFdmVudCk6IGFueSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpO1xyXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRleHQgPSBkYXRhLnRleHQuc3Vic3RyKERyYWdEcm9wSGVscGVyLmRhdGFTdGFydC5sZW5ndGgpO1xyXG4gICAgICAgIHZhciBhcnJheSA9IHRleHQuc3BsaXQoJywnKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge2pzb246IG51bGx9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXS5zcGxpdCgnOicpO1xyXG4gICAgICAgICAgICByZXN1bHRbaXRlbVswXV0gPSBpdGVtWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHQuanNvbiA9IGRhdGEuanNvbjtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRZKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IChlbGVtZW50Lm9mZnNldFRvcCAtIGVsZW1lbnQuc2Nyb2xsVG9wICsgZWxlbWVudC5jbGllbnRUb3ApO1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gPEhUTUxFbGVtZW50PmVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwcmVwYXJlRGF0YShldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25OYW1lOiBzdHJpbmcsIGpzb246IGFueSA9IG51bGwpIHtcclxuICAgICAgICB2YXIgc3RyID0gRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0O1xyXG4gICAgICAgIGlmIChxdWVzdGlvblR5cGUpIHN0ciArPSBcInF1ZXN0aW9udHlwZTpcIiArIHF1ZXN0aW9uVHlwZSArICcsJztcclxuICAgICAgICBzdHIgKz0gXCJxdWVzdGlvbm5hbWU6XCIgKyBxdWVzdGlvbk5hbWU7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKGV2ZW50LCBzdHIsIGpzb24pO1xyXG4gICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IHRoaXMuY3JlYXRlVGFyZ2V0UXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBxdWVzdGlvbk5hbWUsIGpzb24pO1xyXG4gICAgICAgIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhLnRhcmdldFF1ZXN0aW9uID0gdGFyZ2V0UXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlbXCJrb0RyYWdnaW5nU291cmNlXCJdKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0RGF0YShldmVudDogRHJhZ0V2ZW50LCB0ZXh0OiBzdHJpbmcsIGpzb246IGFueSA9IG51bGwpIHtcclxuICAgICAgICBpZiAoZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiVGV4dFwiLCB0ZXh0KTtcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImNvcHlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSB7IHRleHQ6IHRleHQsIGpzb246IGpzb24gfTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RGF0YShldmVudDogRHJhZ0V2ZW50KTogYW55IHtcclxuICAgICAgICBpZiAoZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJUZXh0XCIpO1xyXG4gICAgICAgICAgICBpZiAodGV4dCkge1xyXG4gICAgICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhckRhdGEoKSB7XHJcbiAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSB7dGV4dDogXCJcIiwganNvbjogbnVsbCwgdGFyZ2V0UXVlc3Rpb246IG51bGx9O1xyXG4gICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgIHByZXYucXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgIHByZXYueCA9IC0xO1xyXG4gICAgICAgIHByZXYueSA9IC0xO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RyYWdkcm9waGVscGVyLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJyb290XCI6XCJTdXJ2ZXlcIixcImNvbW1vbmpzMlwiOlwic3VydmV5LWtub2Nrb3V0XCIsXCJjb21tb25qc1wiOlwic3VydmV5LWtub2Nrb3V0XCIsXCJhbWRcIjpcInN1cnZleS1rbm9ja291dFwifVxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHRFZGl0b3I6IHN0cmluZyA9IFwic3RyaW5nXCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgZWRpdG9yUmVnaXN0ZXJlZExpc3QgPSB7fTtcbiAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyRWRpdG9yKG5hbWU6IHN0cmluZywgY3JlYXRvcjogKCkgPT4gU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlKSB7XG4gICAgICAgIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5lZGl0b3JSZWdpc3RlcmVkTGlzdFtuYW1lXSA9IGNyZWF0b3I7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRWRpdG9yKGVkaXRvclR5cGU6IHN0cmluZywgZnVuYzogKG5ld1ZhbHVlOiBhbnkpID0+IGFueSk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XG4gICAgICAgIHZhciBjcmVhdG9yID0gU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLmVkaXRvclJlZ2lzdGVyZWRMaXN0W2VkaXRvclR5cGVdO1xuICAgICAgICBpZiAoIWNyZWF0b3IpIGNyZWF0b3IgPSBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLmRlZmF1bHRFZGl0b3JdO1xuICAgICAgICB2YXIgcHJvcGVydHlFZGl0b3IgPSBjcmVhdG9yKCk7XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLm9uQ2hhbmdlZCA9IGZ1bmM7XG4gICAgICAgIHJldHVybiBwcm9wZXJ0eUVkaXRvcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbHVlXzogYW55ID0gbnVsbDtcbiAgICBwdWJsaWMgb3B0aW9uczogYW55ID0gbnVsbDtcbiAgICBwdWJsaWMgb25DaGFuZ2VkOiAobmV3VmFsdWU6IGFueSkgPT4gYW55O1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgdGhyb3cgXCJlZGl0b3JUeXBlIGlzIG5vdCBkZWZpbmVkXCI7IH1cbiAgICBwdWJsaWMgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcgeyByZXR1cm4gdmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnZhbHVlXzsgfVxuICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0Q29ycmVjdGVkVmFsdWUodmFsdWUpO1xuICAgICAgICB0aGlzLnNldFZhbHVlQ29yZSh2YWx1ZSk7XG4gICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHNldFZhbHVlQ29yZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMudmFsdWVfID0gdmFsdWU7XG4gICAgfVxuICAgIHB1YmxpYyBzZXRUaXRsZSh2YWx1ZTogc3RyaW5nKSB7IH1cbiAgICBwdWJsaWMgc2V0T2JqZWN0KHZhbHVlOiBhbnkpIHsgfVxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldENvcnJlY3RlZFZhbHVlKHZhbHVlOiBhbnkpOiBhbnkgeyAgcmV0dXJuIHZhbHVlOyAgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleVN0cmluZ1Byb3BlcnR5RWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInN0cmluZ1wiOyB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5RHJvcGRvd25Qcm9wZXJ0eUVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJkcm9wZG93blwiOyB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5Qm9vbGVhblByb3BlcnR5RWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImJvb2xlYW5cIjsgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleU51bWJlclByb3BlcnR5RWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIm51bWJlclwiOyB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInN0cmluZ1wiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlTdHJpbmdQcm9wZXJ0eUVkaXRvcigpOyB9KTtcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcImRyb3Bkb3duXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleURyb3Bkb3duUHJvcGVydHlFZGl0b3IoKTsgfSk7XG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJib29sZWFuXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleUJvb2xlYW5Qcm9wZXJ0eUVkaXRvcigpOyB9KTtcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIm51bWJlclwiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlOdW1iZXJQcm9wZXJ0eUVkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5RWRpdG9yQmFzZS50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtTdXJ2ZXlIZWxwZXJ9IGZyb20gXCIuLi9zdXJ2ZXlIZWxwZXJcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5VmFsaWRhdG9yc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUZXh0SXRlbXNFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRleHRpdGVtc1wiOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld0VkaXRvckl0ZW0oKTogYW55IHtcbiAgICAgICAgdmFyIG9ianMgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5rb0l0ZW1zKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9ianMucHVzaCh7IG5hbWU6IGl0ZW1zW2ldLmtvTmFtZSgpIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlZGl0SXRlbSA9IHsga29OYW1lOiBrby5vYnNlcnZhYmxlKFN1cnZleUhlbHBlci5nZXROZXdOYW1lKG9ianMsIFwidGV4dFwiKSksIGtvVGl0bGU6IGtvLm9ic2VydmFibGUoKSB9O1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoZWRpdEl0ZW0sIFtdKTtcbiAgICAgICAgcmV0dXJuIGVkaXRJdGVtO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGVkaXRJdGVtID0geyBrb05hbWU6IGtvLm9ic2VydmFibGUoaXRlbS5uYW1lKSwga29UaXRsZToga28ub2JzZXJ2YWJsZShpdGVtLnRpdGxlKSB9O1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoZWRpdEl0ZW0sIGl0ZW0udmFsaWRhdG9ycyk7XG4gICAgICAgIHJldHVybiBlZGl0SXRlbTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGl0ZW1UZXh0ID0gbmV3IFN1cnZleS5NdWx0aXBsZVRleHRJdGVtKGVkaXRvckl0ZW0ua29OYW1lKCksIGVkaXRvckl0ZW0ua29UaXRsZSgpKTtcbiAgICAgICAgaXRlbVRleHQudmFsaWRhdG9ycyA9IGVkaXRvckl0ZW0udmFsaWRhdG9ycztcbiAgICAgICAgcmV0dXJuIGl0ZW1UZXh0O1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoaXRlbTogYW55LCB2YWxpZGF0b3JzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgIGl0ZW0udmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuc2xpY2UoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IGl0ZW0udmFsaWRhdG9ycyA9IG5ld1ZhbHVlOyBpdGVtLmtvVGV4dChzZWxmLmdldFRleHQobmV3VmFsdWUubGVuZ3RoKSk7IH07XG4gICAgICAgIHZhciBwcm9wZXJ0eUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IoKTtcbiAgICAgICAgaXRlbS5lZGl0b3IgPSBwcm9wZXJ0eUVkaXRvcjtcbiAgICAgICAgcHJvcGVydHlFZGl0b3Iub25DaGFuZ2VkID0gKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH07XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLm9iamVjdCA9IGl0ZW07XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLnRpdGxlKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5lZGl0UHJvcGVydHlcIilbXCJmb3JtYXRcIl0oXCJWYWxpZGF0b3JzXCIpKTtcbiAgICAgICAgcHJvcGVydHlFZGl0b3IudmFsdWUgPSBpdGVtLnZhbGlkYXRvcnM7XG4gICAgICAgIGl0ZW0ua29UZXh0ID0ga28ub2JzZXJ2YWJsZSh0aGlzLmdldFRleHQodmFsaWRhdG9ycy5sZW5ndGgpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRUZXh0KGxlbmd0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5pdGVtc1wiKVtcImZvcm1hdFwiXShsZW5ndGgpO1xuICAgIH1cbn1cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidGV4dGl0ZW1zXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5VGV4dEl0ZW1zRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5TW9kYWxFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5TW9kYWxFZGl0b3JcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlNb2RhbEVkaXRvciB7XG4gICAgcHVibGljIGtvSXRlbXM6IGFueTtcbiAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xuICAgIHB1YmxpYyBvbk1vdmVVcENsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uTW92ZURvd25DbGljazogYW55O1xuICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uQ2xlYXJDbGljazogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB0aGlzLnZhbHVlID0gW107XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShpdGVtKTsgfTtcbiAgICAgICAgc2VsZi5vbkNsZWFyQ2xpY2sgPSBmdW5jdGlvbiAoaXRlbSkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlQWxsKCk7IH07XG4gICAgICAgIHNlbGYub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5BZGRJdGVtKCk7IH07XG4gICAgICAgIHNlbGYub25Nb3ZlVXBDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYubW92ZVVwKGl0ZW0pOyB9O1xuICAgICAgICBzZWxmLm9uTW92ZURvd25DbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYubW92ZURvd24oaXRlbSk7IH07XG4gICAgfVxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHZhciBsZW4gPSB2YWx1ZSA/IHZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICAgIHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuaXRlbXNcIilbXCJmb3JtYXRcIl0obGVuKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldENvcnJlY3RlZFZhbHVlKHZhbHVlOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIEFkZEl0ZW0oKSB7XG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKHRoaXMuY3JlYXRlTmV3RWRpdG9ySXRlbSgpKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG1vdmVVcChpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGFyciA9IHRoaXMua29JdGVtcygpO1xuICAgICAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMSkgcmV0dXJuO1xuICAgICAgICBhcnJbaW5kZXhdID0gYXJyW2luZGV4IC0gMV07XG4gICAgICAgIGFycltpbmRleCAtIDFdID0gaXRlbTtcbiAgICAgICAgdGhpcy5rb0l0ZW1zKGFycik7XG4gICAgfVxuICAgIHByb3RlY3RlZCBtb3ZlRG93bihpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGFyciA9IHRoaXMua29JdGVtcygpO1xuICAgICAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBhcnIubGVuZ3RoIC0gMSkgcmV0dXJuO1xuICAgICAgICBhcnJbaW5kZXhdID0gYXJyW2luZGV4ICsgMV07XG4gICAgICAgIGFycltpbmRleCArIDFdID0gaXRlbTtcbiAgICAgICAgdGhpcy5rb0l0ZW1zKGFycik7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcbiAgICAgICAgdGhpcy5rb0l0ZW1zKHRoaXMuZ2V0SXRlbXNGcm9tVmFsdWUoKSk7XG4gICAgfVxuICAgIFxuICAgIHByb3RlY3RlZCBnZXRJdGVtc0Zyb21WYWx1ZSgpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5jcmVhdGVFZGl0b3JJdGVtKHZhbHVlW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHtcbiAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgIHZhciBpbnRlcm5hbEl0ZW1zID0gdGhpcy5rb0l0ZW1zKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW50ZXJuYWxJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaXRlbXMucHVzaCh0aGlzLmNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShpbnRlcm5hbEl0ZW1zW2ldKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRWYWx1ZUNvcmUoaXRlbXMpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3RWRpdG9ySXRlbSgpOiBhbnkgeyB0aHJvdyBcIk92ZXJyaWRlICdjcmVhdGVOZXdFZGl0b3JJdGVtJyBtZXRob2RcIjsgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVFZGl0b3JJdGVtKGl0ZW06IGFueSkgeyByZXR1cm4gaXRlbTsgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oZWRpdG9ySXRlbTogYW55KSB7ICByZXR1cm4gZWRpdG9ySXRlbTsgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbXNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcbiAgICBwdWJsaWMgb2JqZWN0OiBhbnk7XG4gICAgcHVibGljIHRpdGxlOiBhbnk7XG4gICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xuICAgIHB1YmxpYyBvblJlc2V0Q2xpY2s6IGFueTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZWxmLm9uQXBwbHlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hcHBseSgpOyB9O1xuICAgICAgICBzZWxmLm9uUmVzZXRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5yZXNldCgpOyB9O1xuICAgIH1cbiAgICBwdWJsaWMgc2V0VGl0bGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlKHZhbHVlKTsgfVxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlQXBwbHkoKSB7IH1cbiAgICBwcml2YXRlIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG4gICAgcHVibGljIHNldE9iamVjdCh2YWx1ZTogYW55KSB7IHRoaXMub2JqZWN0ID0gdmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0IGlzRWRpdGFibGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxuICAgIHByaXZhdGUgYXBwbHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKCkpIHJldHVybjtcbiAgICAgICAgdGhpcy5vbkJlZm9yZUFwcGx5KCk7XG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZWQodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRleHRFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yIHtcbiAgICBwdWJsaWMga29WYWx1ZTogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRleHRcIjsgfVxuICAgIHB1YmxpYyBnZXQgaXNFZGl0YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cbiAgICBwdWJsaWMgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIHN0ciA9IHZhbHVlO1xuICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDIwKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIDIwKSArIFwiLi4uXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICB0aGlzLmtvVmFsdWUodGhpcy52YWx1ZSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbkJlZm9yZUFwcGx5KCkge1xuICAgICAgICB0aGlzLnNldFZhbHVlQ29yZSh0aGlzLmtvVmFsdWUoKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlIdG1sRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlUZXh0RWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImh0bWxcIjsgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJ0ZXh0XCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5VGV4dEVkaXRvcigpOyB9KTtcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcImh0bWxcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlIdG1sRWRpdG9yKCk7IH0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1vZGFsRWRpdG9yLnRzIiwiZXhwb3J0IHZhciBlZGl0b3JMb2NhbGl6YXRpb24gPSB7XHJcbiAgICBjdXJyZW50TG9jYWxlOiBcIlwiLFxyXG4gICAgbG9jYWxlczoge30sXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIGlmICghbG9jYWxlKSBsb2NhbGUgPSB0aGlzLmN1cnJlbnRMb2NhbGU7XHJcbiAgICAgICAgdmFyIGxvYyA9IGxvY2FsZSA/IHRoaXMubG9jYWxlc1t0aGlzLmN1cnJlbnRMb2NhbGVdIDogZGVmYXVsdFN0cmluZ3M7XHJcbiAgICAgICAgaWYgKCFsb2MpIGxvYyA9IGRlZmF1bHRTdHJpbmdzO1xyXG4gICAgICAgIHZhciBwYXRoID0gc3RyTmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgIHZhciBvYmogPSBsb2M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG9iaiA9IG9ialtwYXRoW2ldXTtcclxuICAgICAgICAgICAgaWYgKCFvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2MgPT09IGRlZmF1bHRTdHJpbmdzKSByZXR1cm4gcGF0aFtpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0cmluZyhzdHJOYW1lLCBcImVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG4gICAgZ2V0UHJvcGVydHlOYW1lOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nLCBsb2NhbDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdldFByb3BlcnR5KHN0ck5hbWUsIGxvY2FsKTtcclxuICAgICAgICBpZiAob2JqW1wibmFtZVwiXSkgcmV0dXJuIG9ialtcIm5hbWVcIl07XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sXHJcbiAgICBnZXRQcm9wZXJ0eVRpdGxlOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nLCBsb2NhbDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdldFByb3BlcnR5KHN0ck5hbWUsIGxvY2FsKTtcclxuICAgICAgICBpZiAob2JqW1widGl0bGVcIl0pIHJldHVybiBvYmpbXCJ0aXRsZVwiXTtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH0sXHJcbiAgICBnZXRQcm9wZXJ0eTogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZywgbG9jYWw6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICB2YXIgb2JqID0gdGhpcy5nZXRTdHJpbmcoXCJwLlwiICsgc3RyTmFtZSwgbG9jYWwpO1xyXG4gICAgICAgIGlmIChvYmogIT09IHN0ck5hbWUpIHJldHVybiBvYmo7XHJcbiAgICAgICAgdmFyIHBvcyA9IHN0ck5hbWUuaW5kZXhPZignXycpO1xyXG4gICAgICAgIGlmIChwb3MgPCAtMSkgcmV0dXJuIG9iajtcclxuICAgICAgICBzdHJOYW1lID0gc3RyTmFtZS5zdWJzdHIocG9zICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RyaW5nKFwicC5cIiArIHN0ck5hbWUsIGxvY2FsKTtcclxuICAgIH0sXHJcbiAgICBnZXRMb2NhbGVzOiBmdW5jdGlvbiAoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIHJlcy5wdXNoKFwiXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxvY2FsZXMpIHtcclxuICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB2YXIgZGVmYXVsdFN0cmluZ3MgPSB7XHJcbiAgICAvL3N1cnZleSB0ZW1wbGF0ZXNcclxuICAgIHN1cnZleToge1xyXG4gICAgICAgIGRyb3BRdWVzdGlvbjogXCJQbGVhc2UgZHJvcCBhIHF1ZXN0aW9uIGhlcmUuXCIsXHJcbiAgICAgICAgY29weTogXCJDb3B5XCIsXHJcbiAgICAgICAgYWRkVG9Ub29sYm94OiBcIkFkZCB0byB0b29sYm94XCIsXHJcbiAgICAgICAgZGVsZXRlUXVlc3Rpb246IFwiRGVsZXRlIFF1ZXN0aW9uXCJcclxuICAgIH0sXHJcbiAgICAvL3F1ZXN0aW9uVHlwZXNcclxuICAgIHF0OiB7XHJcbiAgICAgICAgY2hlY2tib3g6IFwiQ2hlY2tib3hcIixcclxuICAgICAgICBjb21tZW50OiBcIkNvbW1lbnRcIixcclxuICAgICAgICBkcm9wZG93bjogXCJEcm9wZG93blwiLFxyXG4gICAgICAgIGZpbGU6IFwiRmlsZVwiLFxyXG4gICAgICAgIGh0bWw6IFwiSHRtbFwiLFxyXG4gICAgICAgIG1hdHJpeDogXCJNYXRyaXggKHNpbmdsZSBjaG9pY2UpXCIsXHJcbiAgICAgICAgbWF0cml4ZHJvcGRvd246IFwiTWF0cml4IChtdWx0aXBsZSBjaG9pY2UpXCIsXHJcbiAgICAgICAgbWF0cml4ZHluYW1pYzogXCJNYXRyaXggKGR5bmFtaWMgcm93cylcIixcclxuICAgICAgICBtdWx0aXBsZXRleHQ6IFwiTXVsdGlwbGUgVGV4dFwiLFxyXG4gICAgICAgIHJhZGlvZ3JvdXA6IFwiUmFkaW9ncm91cFwiLFxyXG4gICAgICAgIHJhdGluZzogXCJSYXRpbmdcIixcclxuICAgICAgICB0ZXh0OiBcIlNpbmdsZSBJbnB1dFwiXHJcbiAgICB9LFxyXG4gICAgLy9TdHJpbmdzIGluIEVkaXRvclxyXG4gICAgZWQ6IHtcclxuICAgICAgICBuZXdQYWdlTmFtZTogXCJwYWdlXCIsXHJcbiAgICAgICAgbmV3UXVlc3Rpb25OYW1lOiBcInF1ZXN0aW9uXCIsXHJcbiAgICAgICAgdGVzdFN1cnZleTogXCJUZXN0IFN1cnZleVwiLFxyXG4gICAgICAgIHRlc3RTdXJ2ZXlBZ2FpbjogXCJUZXN0IFN1cnZleSBBZ2FpblwiLFxyXG4gICAgICAgIHRlc3RTdXJ2ZXlXaWR0aDogXCJTdXJ2ZXkgd2lkdGg6IFwiLFxyXG4gICAgICAgIGVtYmVkU3VydmV5OiBcIkVtYmVkIFN1cnZleVwiLFxyXG4gICAgICAgIHNhdmVTdXJ2ZXk6IFwiU2F2ZSBTdXJ2ZXlcIixcclxuICAgICAgICBkZXNpZ25lcjogXCJTdXJ2ZXkgRGVzaWduZXJcIixcclxuICAgICAgICBqc29uRWRpdG9yOiBcIkpTT04gRWRpdG9yXCIsXHJcbiAgICAgICAgdW5kbzogXCJVbmRvXCIsXHJcbiAgICAgICAgcmVkbzogXCJSZWRvXCIsXHJcbiAgICAgICAgb3B0aW9uczogXCJPcHRpb25zXCIsXHJcbiAgICAgICAgZ2VuZXJhdGVWYWxpZEpTT046IFwiR2VuZXJhdGUgVmFsaWQgSlNPTlwiLFxyXG4gICAgICAgIGdlbmVyYXRlUmVhZGFibGVKU09OOiBcIkdlbmVyYXRlIFJlYWRhYmxlIEpTT05cIixcclxuICAgICAgICB0b29sYm94OiBcIlRvb2xib3hcIixcclxuICAgICAgICBkZWxTZWxPYmplY3Q6IFwiRGVsZXRlIHNlbGVjdGVkIG9iamVjdFwiLFxyXG4gICAgICAgIGNvcnJlY3RKU09OOiBcIlBsZWFzZSBjb3JyZWN0IEpTT04uXCIsXHJcbiAgICAgICAgc3VydmV5UmVzdWx0czogXCJTdXJ2ZXkgUmVzdWx0OiBcIlxyXG4gICAgfSxcclxuICAgIC8vUHJvcGVydHkgRWRpdG9yc1xyXG4gICAgcGU6IHtcclxuICAgICAgICBhcHBseTogXCJBcHBseVwiLFxyXG4gICAgICAgIHJlc2V0OiBcIlJlc2V0XCIsXHJcbiAgICAgICAgY2xvc2U6IFwiQ2xvc2VcIixcclxuICAgICAgICBkZWxldGU6IFwiRGVsZXRlXCIsXHJcbiAgICAgICAgYWRkTmV3OiBcIkFkZCBOZXdcIixcclxuICAgICAgICByZW1vdmVBbGw6IFwiUmVtb3ZlIEFsbFwiLFxyXG4gICAgICAgIGVkaXQ6IFwiRWRpdFwiLFxyXG4gICAgICAgIGVtcHR5OiBcIjxlbXB0eT5cIixcclxuICAgICAgICB0ZXN0U2VydmljZTogXCJUZXN0IHRoZSBzZXJ2aWNlXCIsXHJcblxyXG4gICAgICAgIHZhbHVlOiBcIlZhbHVlXCIsXHJcbiAgICAgICAgdGV4dDogXCJUZXh0XCIsXHJcbiAgICAgICAgcmVxdWlyZWQ6IFwiUmVxdWlyZWQ/XCIsXHJcbiAgICAgICAgaGFzT3RoZXI6IFwiSGFzIE90aGVyIEl0ZW1cIixcclxuICAgICAgICBuYW1lOiBcIk5hbWVcIixcclxuICAgICAgICB0aXRsZTogXCJUaXRsZVwiLFxyXG4gICAgICAgIGNlbGxUeXBlOiBcIkNlbGwgVHlwZVwiLFxyXG4gICAgICAgIGNvbENvdW50OiBcIkNvbHVtbiBDb3VudFwiLFxyXG5cclxuICAgICAgICBlZGl0UHJvcGVydHk6IFwiRWRpdCBwcm9wZXJ0eSAnezB9J1wiLFxyXG4gICAgICAgIGl0ZW1zOiBcIlsgSXRlbXM6IHswfSBdXCIsXHJcblxyXG4gICAgICAgIGVudGVyTmV3VmFsdWU6IFwiUGxlYXNlLCBlbnRlciB0aGUgdmFsdWUuXCIsXHJcbiAgICAgICAgbm9xdWVzdGlvbnM6IFwiVGhlcmUgaXMgbm8gYW55IHF1ZXN0aW9uIGluIHRoZSBzdXJ2ZXkuXCIsXHJcbiAgICAgICAgY3JlYXRldHJpZ2dlcjogXCJQbGVhc2UgY3JlYXRlIGEgdHJpZ2dlclwiLFxyXG4gICAgICAgIHRyaWdnZXJPbjogXCJPbiBcIixcclxuICAgICAgICB0cmlnZ2VyTWFrZVBhZ2VzVmlzaWJsZTogXCJNYWtlIHBhZ2VzIHZpc2libGU6XCIsXHJcbiAgICAgICAgdHJpZ2dlck1ha2VRdWVzdGlvbnNWaXNpYmxlOiBcIk1ha2UgcXVlc3Rpb25zIHZpc2libGU6XCIsXHJcbiAgICAgICAgdHJpZ2dlckNvbXBsZXRlVGV4dDogXCJDb21wbGV0ZSB0aGUgc3VydmV5IGlmIHN1Y2NlZWQuXCIsXHJcbiAgICAgICAgdHJpZ2dlck5vdFNldDogXCJUaGUgdHJpZ2dlciBpcyBub3Qgc2V0XCIsXHJcbiAgICAgICAgdHJpZ2dlclJ1bklmOiBcIlJ1biBpZlwiLFxyXG4gICAgICAgIHRyaWdnZXJTZXRUb05hbWU6IFwiQ2hhbmdlIHZhbHVlIG9mOiBcIixcclxuICAgICAgICB0cmlnZ2VyU2V0VmFsdWU6IFwidG86IFwiLFxyXG4gICAgICAgIHRyaWdnZXJJc1ZhcmlhYmxlOiBcIkRvIG5vdCBwdXQgdGhlIHZhcmlhYmxlIGludG8gdGhlIHN1cnZleSByZXN1bHQuXCIsXHJcbiAgICAgICAgdmVyYkNoYW5nZVR5cGU6IFwiQ2hhbmdlIHR5cGUgXCIsXHJcbiAgICAgICAgdmVyYkNoYW5nZVBhZ2U6IFwiQ2hhbmdlIHBhZ2UgXCJcclxuICAgIH0sXHJcbiAgICAvL09wZXJhdG9yc1xyXG4gICAgb3A6IHtcclxuICAgICAgICBlbXB0eTogXCJpcyBlbXB0eVwiLFxyXG4gICAgICAgIG5vdGVtcHR5OiBcImlzIG5vdCBlbXB0eVwiLFxyXG4gICAgICAgIGVxdWFsOiBcImVxdWFsc1wiLFxyXG4gICAgICAgIG5vdGVxdWFsOiBcIm5vdCBlcXVhbHNcIixcclxuICAgICAgICBjb250YWluczogXCJjb250YWluc1wiLFxyXG4gICAgICAgIG5vdGNvbnRhaW5zOiBcIm5vdCBjb250YWluc1wiLFxyXG4gICAgICAgIGdyZWF0ZXI6IFwiZ3JlYXRlclwiLFxyXG4gICAgICAgIGxlc3M6IFwibGVzc1wiLFxyXG4gICAgICAgIGdyZWF0ZXJvcmVxdWFsOiBcImdyZWF0ZXIgb3IgZXF1YWxzXCIsXHJcbiAgICAgICAgbGVzc29yZXF1YWw6IFwiTGVzcyBvciBFcXVhbHNcIlxyXG4gICAgfSxcclxuICAgIC8vRW1iZWQgd2luZG93XHJcbiAgICBldzoge1xyXG4gICAgICAgIGFuZ3VsYXI6IFwiVXNlIEFuZ3VsYXIgdmVyc2lvblwiLFxyXG4gICAgICAgIGpxdWVyeTogXCJVc2UgalF1ZXJ5IHZlcnNpb25cIixcclxuICAgICAgICBrbm9ja291dDogXCJVc2UgS25vY2tvdXQgdmVyc2lvblwiLFxyXG4gICAgICAgIHJlYWN0OiBcIlVzZSBSZWFjdCB2ZXJzaW9uXCIsXHJcbiAgICAgICAgYm9vdHN0cmFwOiBcIkZvciBib290c3RyYXAgZnJhbWV3b3JrXCIsXHJcbiAgICAgICAgc3RhbmRhcmQ6IFwiTm8gYm9vdHN0cmFwXCIsXHJcbiAgICAgICAgc2hvd09uUGFnZTogXCJTaG93IHN1cnZleSBvbiBhIHBhZ2VcIixcclxuICAgICAgICBzaG93SW5XaW5kb3c6IFwiU2hvdyBzdXJ2ZXkgaW4gYSB3aW5kb3dcIixcclxuICAgICAgICBsb2FkRnJvbVNlcnZlcjogXCJMb2FkIFN1cnZleSBKU09OIGZyb20gc2VydmVyXCIsXHJcbiAgICAgICAgdGl0bGVTY3JpcHQ6IFwiU2NyaXB0cyBhbmQgc3R5bGVzXCIsXHJcbiAgICAgICAgdGl0bGVIdG1sOiBcIkhUTUxcIixcclxuICAgICAgICB0aXRsZUphdmFTY3JpcHQ6IFwiSmF2YVNjcmlwdFwiXHJcbiAgICB9LFxyXG4gICAgLy9Qcm9wZXJ0aWVzXHJcbiAgICBwOiB7XHJcbiAgICAgICAgbmFtZTogXCJuYW1lXCIsXHJcbiAgICAgICAgdGl0bGU6IHsgbmFtZTogXCJ0aXRsZVwiLCB0aXRsZTogXCJMZWF2ZSBpdCBlbXB0eSwgaWYgaXQgaXMgdGhlIHNhbWUgYXMgJ05hbWUnXCIgfSxcclxuICAgICAgICBzdXJ2ZXlfdGl0bGU6IHsgbmFtZTogXCJ0aXRsZVwiLCB0aXRsZTogXCJJdCB3aWxsIGJlIHNob3duIG9uIGV2ZXJ5IHBhZ2UuXCIgfSxcclxuICAgICAgICBwYWdlX3RpdGxlOiB7IG5hbWU6IFwidGl0bGVcIiwgdGl0bGU6IFwiUGFnZSB0aXRsZVwiIH1cclxuICAgIH1cclxufTtcclxuXHJcbmVkaXRvckxvY2FsaXphdGlvbi5sb2NhbGVzW1wiZW5cIl0gPSBkZWZhdWx0U3RyaW5ncztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZWRpdG9yTG9jYWxpemF0aW9uLnRzIiwiaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGVudW0gT2JqVHlwZSB7IFVua25vd24sIFN1cnZleSwgUGFnZSwgUXVlc3Rpb24gfVxuZXhwb3J0IGNsYXNzIFN1cnZleUhlbHBlciB7XG4gICAgcHVibGljIHN0YXRpYyBnZXROZXdQYWdlTmFtZShvYmpzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZShvYmpzLCBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiZWQubmV3UGFnZU5hbWVcIikpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldE5ld1F1ZXN0aW9uTmFtZShvYmpzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZShvYmpzLCBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiZWQubmV3UXVlc3Rpb25OYW1lXCIpKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXROZXdOYW1lKG9ianM6IEFycmF5PGFueT4sIGJhc2VOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICB2YXIgaGFzaCA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2hbb2Jqc1tpXS5uYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG51bSA9IDE7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBpZiAoIWhhc2hbYmFzZU5hbWUgKyBudW0udG9TdHJpbmcoKV0pIGJyZWFrO1xuICAgICAgICAgICAgbnVtKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhc2VOYW1lICsgbnVtLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqZWN0VHlwZShvYmo6IGFueSk6IE9ialR5cGUge1xuICAgICAgICBpZiAoIW9iaiB8fCAhb2JqW1wiZ2V0VHlwZVwiXSkgcmV0dXJuIE9ialR5cGUuVW5rbm93bjtcbiAgICAgICAgaWYgKG9iai5nZXRUeXBlKCkgPT0gXCJwYWdlXCIpIHJldHVybiBPYmpUeXBlLlBhZ2U7XG4gICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09IFwic3VydmV5XCIpIHJldHVybiBPYmpUeXBlLlN1cnZleTtcbiAgICAgICAgaWYgKG9ialtcIm5hbWVcIl0pIHJldHVybiBPYmpUeXBlLlF1ZXN0aW9uO1xuICAgICAgICByZXR1cm4gT2JqVHlwZS5Vbmtub3duO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldE9iamVjdE5hbWUob2JqOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAob2JqW1wibmFtZVwiXSkgcmV0dXJuIG9ialtcIm5hbWVcIl07XG4gICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKTtcbiAgICAgICAgaWYgKG9ialR5cGUgIT0gT2JqVHlwZS5QYWdlKSByZXR1cm4gXCJcIjtcbiAgICAgICAgdmFyIGRhdGEgPSA8U3VydmV5LlN1cnZleT4oPFN1cnZleS5QYWdlPm9iaikuZGF0YTtcbiAgICAgICAgdmFyIGluZGV4ID0gZGF0YS5wYWdlcy5pbmRleE9mKDxTdXJ2ZXkuUGFnZT5vYmopO1xuICAgICAgICByZXR1cm4gXCJbUGFnZSBcIiArIChpbmRleCArIDEpICsgXCJdXCI7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXlIZWxwZXIudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5SXRlbXNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcbmltcG9ydCB7U3VydmV5T2JqZWN0RWRpdG9yfSBmcm9tIFwiLi4vb2JqZWN0RWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdEVkaXRvcjogU3VydmV5T2JqZWN0RWRpdG9yO1xuICAgIHB1YmxpYyBrb1NlbGVjdGVkOiBhbnk7XG4gICAgcHVibGljIGF2YWlsYWJsZVZhbGlkYXRvcnM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBwcml2YXRlIHZhbGlkYXRvckNsYXNzZXM6IEFycmF5PFN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcz4gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yID0gbmV3IFN1cnZleU9iamVjdEVkaXRvcigpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgICAgIHNlbGYub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChvcHRpb25zLnByb3BlcnR5LCBvcHRpb25zLm9iamVjdCwgb3B0aW9ucy5uZXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNlbGVjdGVkT2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0ID0gbmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbGlkYXRvciA6IG51bGw7IH0pO1xuICAgICAgICB0aGlzLnZhbGlkYXRvckNsYXNzZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlVmFsaWRhdG9ycyA9IHRoaXMuZ2V0QXZhaWxhYmxlVmFsaWRhdG9ycygpO1xuICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9O1xuICAgICAgICB0aGlzLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAodmFsaWRhdG9yVHlwZSkgeyBzZWxmLmFkZEl0ZW0odmFsaWRhdG9yVHlwZSk7IH07XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ2YWxpZGF0b3JzXCI7IH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XG4gICAgICAgIGlmICh0aGlzLmtvU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCh0aGlzLmtvSXRlbXMoKS5sZW5ndGggPiAwID8gdGhpcy5rb0l0ZW1zKClbMF0gOiBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGpzb25PYmogPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKTtcbiAgICAgICAgdmFyIHZhbGlkYXRvciA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKGl0ZW0uZ2V0VHlwZSgpKTtcbiAgICAgICAganNvbk9iai50b09iamVjdChpdGVtLCB2YWxpZGF0b3IpO1xuICAgICAgICByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSh2YWxpZGF0b3IpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgaXRlbSA9IDxTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0+ZWRpdG9ySXRlbTtcbiAgICAgICAgcmV0dXJuIGl0ZW0udmFsaWRhdG9yO1xuICAgIH1cbiAgICBwcml2YXRlIGFkZEl0ZW0odmFsaWRhdG9yVHlwZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBuZXdWYWxpZGF0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtKFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKHZhbGlkYXRvclR5cGUpKTtcbiAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2gobmV3VmFsaWRhdG9yKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG5ld1ZhbGlkYXRvcik7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0QXZhaWxhYmxlVmFsaWRhdG9ycygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFsaWRhdG9yQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy52YWxpZGF0b3JDbGFzc2VzW2ldLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb2JqOiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMua29TZWxlY3RlZCgpID09IG51bGwpIHJldHVybjtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkKCkudmFsaWRhdG9yW3Byb3BlcnR5Lm5hbWVdID0gbmV3VmFsdWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtIHtcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWxpZGF0b3I6IFN1cnZleS5TdXJ2ZXlWYWxpZGF0b3IpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdmFsaWRhdG9yLmdldFR5cGUoKTtcbiAgICB9XG59XG5cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidmFsaWRhdG9yc1wiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IoKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleU9iamVjdFByb3BlcnR5fSBmcm9tIFwiLi9vYmplY3RQcm9wZXJ0eVwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEVkaXRvciB7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdFZhbHVlOiBhbnk7XG4gICAgcHVibGljIHByb3BlcnR5RWRpdG9yT3B0aW9uczogYW55ID0gbnVsbDtcbiAgICBwdWJsaWMga29Qcm9wZXJ0aWVzOiBhbnk7XG4gICAgcHVibGljIGtvQWN0aXZlUHJvcGVydHk6IGFueTtcbiAgICBwdWJsaWMga29IYXNPYmplY3Q6IGFueTtcbiAgICBwdWJsaWMgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZDogU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleU9iamVjdEVkaXRvciwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleU9iamVjdEVkaXRvciwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcbiAgICBwdWJsaWMgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnR5RWRpdG9yT3B0aW9uczogYW55ID0gbnVsbCkge1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMocHJvcGVydHlFZGl0b3JPcHRpb25zKTtcbiAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5ID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmtvSGFzT2JqZWN0ID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkT2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IHNlbGVjdGVkT2JqZWN0KHZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLmtvSGFzT2JqZWN0KHZhbHVlICE9IG51bGwpO1xuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0T3B0aW9ucyhwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSkge1xuICAgICAgICB0aGlzLnByb3BlcnR5RWRpdG9yT3B0aW9ucyA9IHByb3BlcnR5RWRpdG9yT3B0aW9ucztcbiAgICB9XG4gICAgcHVibGljIGdldFByb3BlcnR5RWRpdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMua29Qcm9wZXJ0aWVzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gcHJvcGVydGllc1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcHVibGljIGNoYW5nZUFjdGl2ZVByb3BlcnR5KHByb3BlcnR5OiBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSkge1xuICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkocHJvcGVydHkpO1xuICAgIH1cbiAgICBwdWJsaWMgT2JqZWN0Q2hhbmdlZCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRPYmplY3QgfHwgIXRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSkge1xuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMoW10pO1xuICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyh0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUoKSk7XG4gICAgICAgIHByb3BlcnRpZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEubmFtZSA9PSBiLm5hbWUpIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKGEubmFtZSA+IGIubmFtZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgb2JqZWN0UHJvcGVydGllcyA9IFtdO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcm9wRXZlbnQgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7IHByb3BlcnR5OiBwcm9wZXJ0eS5wcm9wZXJ0eSwgb2JqZWN0OiBwcm9wZXJ0eS5vYmplY3QsIG5ld1ZhbHVlOiBuZXdWYWx1ZSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FuU2hvd1Byb3BlcnR5KHByb3BlcnRpZXNbaV0pKSBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciBvYmplY3RQcm9wZXJ0eSA9IG5ldyBTdXJ2ZXlPYmplY3RQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldLCBwcm9wRXZlbnQsIHRoaXMucHJvcGVydHlFZGl0b3JPcHRpb25zKTtcbiAgICAgICAgICAgIHZhciBsb2NOYW1lID0gdGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKCkgKyAnXycgKyBwcm9wZXJ0aWVzW2ldLm5hbWU7XG4gICAgICAgICAgICBvYmplY3RQcm9wZXJ0eS5kaXNwbGF5TmFtZSA9IGVkaXRvckxvY2FsaXphdGlvbi5nZXRQcm9wZXJ0eU5hbWUobG9jTmFtZSk7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0UHJvcGVydHlUaXRsZShsb2NOYW1lKTtcbiAgICAgICAgICAgIGlmICghdGl0bGUpIHRpdGxlID0gb2JqZWN0UHJvcGVydHkuZGlzcGxheU5hbWU7XG4gICAgICAgICAgICBvYmplY3RQcm9wZXJ0eS50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgb2JqZWN0UHJvcGVydGllcy5wdXNoKG9iamVjdFByb3BlcnR5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvUHJvcGVydGllcyhvYmplY3RQcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KHRoaXMuZ2V0UHJvcGVydHlFZGl0b3IoXCJuYW1lXCIpKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNhblNob3dQcm9wZXJ0eShwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuICAgICAgICB2YXIgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XG4gICAgICAgIGlmIChuYW1lID09ICdxdWVzdGlvbnMnIHx8IG5hbWUgPT0gJ3BhZ2VzJykgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKSByZXR1cm4gdGhpcy5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKHRoaXMuc2VsZWN0ZWRPYmplY3QsIHByb3BlcnR5KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCkge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMua29Qcm9wZXJ0aWVzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcHJvcGVydGllc1tpXS5vYmplY3QgPSB0aGlzLnNlbGVjdGVkT2JqZWN0O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vYmplY3RFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGRlY2xhcmUgdHlwZSBTdXJ2ZXlPblByb3BlcnR5Q2hhbmdlZENhbGxiYWNrID0gKHByb3BlcnR5OiBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSwgbmV3VmFsdWU6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdFByb3BlcnR5IHtcbiAgICBwcml2YXRlIG9iamVjdFZhbHVlOiBhbnk7XG4gICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmc6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBvblByb3BlcnR5Q2hhbmdlZDogU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjaztcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBkaXNwbGF5TmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xuICAgIHB1YmxpYyBrb1ZhbHVlOiBhbnk7XG4gICAgcHVibGljIGtvVGV4dDogYW55O1xuICAgIHB1YmxpYyBtb2RhbE5hbWU6IHN0cmluZztcbiAgICBwdWJsaWMgbW9kYWxOYW1lVGFyZ2V0OiBzdHJpbmc7XG4gICAgcHVibGljIGtvSXNEZWZhdWx0OiBhbnk7XG4gICAgcHVibGljIGVkaXRvcjogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlO1xuICAgIHB1YmxpYyBlZGl0b3JUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGJhc2VFZGl0b3JUeXBlOiBzdHJpbmc7XG4gICAgcHVibGljIGNob2ljZXM6IEFycmF5PGFueT47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9uUHJvcGVydHlDaGFuZ2VkOiBTdXJ2ZXlPblByb3BlcnR5Q2hhbmdlZENhbGxiYWNrID0gbnVsbCwgcHJvcGVydHlFZGl0b3JPcHRpb25zOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIHRoaXMub25Qcm9wZXJ0eUNoYW5nZWQgPSBvblByb3BlcnR5Q2hhbmdlZDtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wcm9wZXJ0eS5uYW1lO1xuICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuY2hvaWNlcyA9IHByb3BlcnR5LmNob2ljZXM7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gcHJvcGVydHkudHlwZTtcbiAgICAgICAgLy9UT0RPXG4gICAgICAgIGlmICh0aGlzLmNob2ljZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gXCJkcm9wZG93blwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvbkl0ZW1DaGFuZ2VkID0gZnVuY3Rpb24gKG5ld1ZhbHVlOiBhbnkpIHsgc2VsZi5vbkFwcGx5RWRpdG9yVmFsdWUobmV3VmFsdWUpOyB9O1xuICAgICAgICB0aGlzLmVkaXRvciA9IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5jcmVhdGVFZGl0b3IodGhpcy5lZGl0b3JUeXBlLCBvbkl0ZW1DaGFuZ2VkKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iub3B0aW9ucyA9IHByb3BlcnR5RWRpdG9yT3B0aW9ucztcbiAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gdGhpcy5lZGl0b3IuZWRpdG9yVHlwZTtcbiAgICAgICAgdGhpcy5tb2RhbE5hbWUgPSBcIm1vZGVsRWRpdG9yXCIgKyB0aGlzLmVkaXRvclR5cGUgKyB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMubW9kYWxOYW1lVGFyZ2V0ID0gXCIjXCIgKyB0aGlzLm1vZGFsTmFtZTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5vbmtvVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTsgfSk7XG4gICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyByZXR1cm4gc2VsZi5nZXRWYWx1ZVRleHQoc2VsZi5rb1ZhbHVlKCkpOyB9KTtcbiAgICAgICAgdGhpcy5rb0lzRGVmYXVsdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYucHJvcGVydHkuaXNEZWZhdWx0VmFsdWUoc2VsZi5rb1ZhbHVlKCkpOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGdldCBvYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMub2JqZWN0VmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IG9iamVjdCh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMub2JqZWN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSgpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUoKSB7XG4gICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlKHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldE9iamVjdCh0aGlzLm9iamVjdCk7XG4gICAgICAgIHRoaXMuZWRpdG9yLnNldFRpdGxlKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5lZGl0UHJvcGVydHlcIilbXCJmb3JtYXRcIl0odGhpcy5wcm9wZXJ0eS5uYW1lKSk7XG4gICAgICAgIHRoaXMudXBkYXRlRWRpdG9yRGF0YSh0aGlzLmtvVmFsdWUoKSk7XG4gICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gZmFsc2U7XG4gICAgfVxuICAgIHByaXZhdGUgaXNBcHBseWluZ05ld1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBvbkFwcGx5RWRpdG9yVmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLmlzQXBwbHlpbmdOZXdWYWx1ZSA9IHRydWU7XG4gICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XG4gICAgICAgIHRoaXMuaXNBcHBseWluZ05ld1ZhbHVlID0gZmFsc2U7XG4gICAgfVxuICAgIHByaXZhdGUgb25rb1ZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FwcGx5aW5nTmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWRpdG9yRGF0YShuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0ID09IG51bGwpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmFsdWUoKSA9PSBuZXdWYWx1ZSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5vblByb3BlcnR5Q2hhbmdlZCAhPSBudWxsICYmICF0aGlzLmlzVmFsdWVVcGRhdGluZykgdGhpcy5vblByb3BlcnR5Q2hhbmdlZCh0aGlzLCBuZXdWYWx1ZSk7XG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlRWRpdG9yRGF0YShuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRWYWx1ZSgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5wcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSByZXR1cm4gdGhpcy5wcm9wZXJ0eS5nZXRWYWx1ZSh0aGlzLm9iamVjdCk7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdFt0aGlzLm5hbWVdO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0VmFsdWVUZXh0KHZhbHVlKTsgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vYmplY3RQcm9wZXJ0eS50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJpdGVtdmFsdWVzXCI7IH1cbiAgICBwdWJsaWMgaGFzRXJyb3IoKTogYm9vbGVhbiB7XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtvSXRlbXMoKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmtvSXRlbXMoKVtpXTtcbiAgICAgICAgICAgIGl0ZW0ua29IYXNFcnJvcighaXRlbS5rb1ZhbHVlKCkpO1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IGl0ZW0ua29IYXNFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdFZGl0b3JJdGVtKCk6IGFueSB7IHJldHVybiB7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUoKSwga29UZXh0OiBrby5vYnNlcnZhYmxlKCksIGtvSGFzRXJyb3I6IGtvLm9ic2VydmFibGUoZmFsc2UpIH07IH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGl0ZW1WYWx1ZSA9IGl0ZW07XG4gICAgICAgIHZhciBpdGVtVGV4dCA9IG51bGw7XG4gICAgICAgIGlmIChpdGVtLnZhbHVlKSB7XG4gICAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgaXRlbVRleHQgPSBpdGVtLnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsga29WYWx1ZToga28ub2JzZXJ2YWJsZShpdGVtVmFsdWUpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUoaXRlbVRleHQpLCBrb0hhc0Vycm9yOiBrby5vYnNlcnZhYmxlKGZhbHNlKSB9O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgYWx3YXlTYXZlVGV4dEluUHJvcGVydHlFZGl0b3JzID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnM7XG4gICAgICAgIHZhciB0ZXh0ID0gZWRpdG9ySXRlbS5rb1RleHQoKTtcbiAgICAgICAgaWYgKCFhbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnMgJiYgZWRpdG9ySXRlbS5rb1RleHQoKSA9PSBlZGl0b3JJdGVtLmtvVmFsdWUoKSkge1xuICAgICAgICAgICAgdGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGVkaXRvckl0ZW0ua29WYWx1ZSgpLCB0ZXh0OiB0ZXh0IH07XG4gICAgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJpdGVtdmFsdWVzXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbVZhbHVlc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5SXRlbVZhbHVlc0VkaXRvclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5RHJvcGRvd25Db2x1bW5zRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmNvbHVtbnNcIjsgfVxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua29JdGVtcygpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwgdGhpcy5rb0l0ZW1zKClbaV0uaGFzRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3RWRpdG9ySXRlbSgpOiBhbnkgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbShuZXcgU3VydmV5Lk1hdHJpeERyb3Bkb3duQ29sdW1uKFwiXCIsIHRoaXMub3B0aW9ucykpOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtKGl0ZW0sIHRoaXMub3B0aW9ucyk7IH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgY29sdW1JdGVtID0gPFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbT5lZGl0b3JJdGVtO1xuICAgICAgICBjb2x1bUl0ZW0uYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtSXRlbS5jb2x1bW47XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtIHtcbiAgICBwcml2YXRlIGtvQ2hvaWNlczogYW55O1xuICAgIHB1YmxpYyBjaG9pY2VzRWRpdG9yOiBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3I7XG4gICAga29OYW1lOiBhbnk7IGtvVGl0bGU6IGFueTsga29DZWxsVHlwZTogYW55OyBrb1Nob3dDaG9pY2VzOiBhbnk7XG4gICAga29IYXNFcnJvcjogYW55OyBrb0NvbENvdW50OiBhbnk7IGtvSXNSZXF1aXJlZDogYW55OyBrb0hhc090aGVyOiBhbnk7XG4gICAga29IYXNDaG9pY2VzOiBhbnk7IGtvSGFzQ29sQ291bnQ6IGFueTtcbiAgICBwdWJsaWMgb25TaG93Q2hvaWNlc0NsaWNrOiBhbnk7XG4gICAgcHVibGljIGNlbGxUeXBlQ2hvaWNlczogQXJyYXk8YW55PjtcbiAgICBwdWJsaWMgY29sQ291bnRDaG9pY2VzOiBBcnJheTxhbnk+O1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2x1bW46IFN1cnZleS5NYXRyaXhEcm9wZG93bkNvbHVtbiwgcHVibGljIG9wdGlvbnMgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2VsbFR5cGVDaG9pY2VzID0gdGhpcy5nZXRQcm9wZXJ0eUNob2ljZXMoXCJjZWxsVHlwZVwiKTtcbiAgICAgICAgdGhpcy5jb2xDb3VudENob2ljZXMgPSB0aGlzLmdldFByb3BlcnR5Q2hvaWNlcyhcImNvbENvdW50XCIpO1xuICAgICAgICB0aGlzLmtvTmFtZSA9IGtvLm9ic2VydmFibGUoY29sdW1uLm5hbWUpO1xuICAgICAgICB0aGlzLmtvQ2VsbFR5cGUgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5jZWxsVHlwZSk7XG4gICAgICAgIHRoaXMua29Db2xDb3VudCA9IGtvLm9ic2VydmFibGUoY29sdW1uLmNvbENvdW50KTtcbiAgICAgICAgdGhpcy5rb0lzUmVxdWlyZWQgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5pc1JlcXVpcmVkID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb0hhc090aGVyID0ga28ub2JzZXJ2YWJsZShjb2x1bW4uaGFzT3RoZXIgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgICB0aGlzLmtvVGl0bGUgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5uYW1lID09PSBjb2x1bW4udGl0bGUgPyBcIlwiIDogY29sdW1uLnRpdGxlKTtcbiAgICAgICAgdGhpcy5rb1Nob3dDaG9pY2VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMua29DaG9pY2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KGNvbHVtbi5jaG9pY2VzKTtcbiAgICAgICAgdGhpcy5rb0hhc0Vycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5jaG9pY2VzRWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcigpO1xuICAgICAgICB0aGlzLmNob2ljZXNFZGl0b3Iub2JqZWN0ID0gdGhpcy5jb2x1bW47XG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci52YWx1ZSA9IHRoaXMua29DaG9pY2VzKCk7XG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vblNob3dDaG9pY2VzQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29TaG93Q2hvaWNlcyghc2VsZi5rb1Nob3dDaG9pY2VzKCkpOyB9XG4gICAgICAgIHRoaXMua29IYXNDaG9pY2VzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5rb0NlbGxUeXBlKCkgPT0gXCJkcm9wZG93blwiIHx8IHNlbGYua29DZWxsVHlwZSgpID09IFwiY2hlY2tib3hcIiB8fCBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcInJhZGlvZ3JvdXBcIjsgfSk7XG4gICAgICAgIHRoaXMua29IYXNDb2xDb3VudCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYua29DZWxsVHlwZSgpID09IFwiY2hlY2tib3hcIiB8fCBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcInJhZGlvZ3JvdXBcIjsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgdGhpcy5rb0hhc0Vycm9yKCF0aGlzLmtvTmFtZSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMua29IYXNFcnJvcigpIHx8IHRoaXMuY2hvaWNlc0VkaXRvci5oYXNFcnJvcigpO1xuICAgIH1cbiAgICBwdWJsaWMgYXBwbHkoKSB7XG4gICAgICAgIHRoaXMuY29sdW1uLm5hbWUgPSB0aGlzLmtvTmFtZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbi50aXRsZSA9IHRoaXMua29UaXRsZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5jZWxsVHlwZSA9IHRoaXMua29DZWxsVHlwZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5jb2xDb3VudCA9IHRoaXMua29Db2xDb3VudCgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5pc1JlcXVpcmVkID0gdGhpcy5rb0lzUmVxdWlyZWQoKTtcbiAgICAgICAgdGhpcy5jb2x1bW4uaGFzT3RoZXIgPSB0aGlzLmtvSGFzT3RoZXIoKTtcblxuICAgICAgICB0aGlzLmNob2ljZXNFZGl0b3Iub25BcHBseUNsaWNrKCk7XG4gICAgICAgIHRoaXMuY29sdW1uLmNob2ljZXMgPSB0aGlzLmNob2ljZXNFZGl0b3IudmFsdWU7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UHJvcGVydHlDaG9pY2VzKHByb3BldHlOYW1lOiBzdHJpbmcpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBwcm9wZXR5TmFtZSkgcmV0dXJuIHByb3BlcnRpZXNbaV0uY2hvaWNlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJtYXRyaXhkcm9wZG93bmNvbHVtbnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlEcm9wZG93bkNvbHVtbnNFZGl0b3IoKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlNb2RhbEVkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVJlc3VsdGZ1bGxFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yIHtcbiAgICBrb1VybDogYW55OyBrb1BhdGg6IGFueTsga29WYWx1ZU5hbWU6IGFueTsga29UaXRsZU5hbWU6IGFueTtcbiAgICBwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5O1xuICAgIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uRHJvcGRvd247XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5rb1VybCA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb1BhdGggPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMua29WYWx1ZU5hbWUgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMua29UaXRsZU5hbWUgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3VydmV5KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5rb1VybC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnVybCA9IG5ld1ZhbHVlOyBzZWxmLnJ1bigpOyB9KTtcbiAgICAgICAgdGhpcy5rb1BhdGguc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnF1ZXN0aW9uLmNob2ljZXNCeVVybC5wYXRoID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgICAgICB0aGlzLmtvVmFsdWVOYW1lLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5xdWVzdGlvbi5jaG9pY2VzQnlVcmwudmFsdWVOYW1lID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgICAgICB0aGlzLmtvVGl0bGVOYW1lLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5xdWVzdGlvbi5jaG9pY2VzQnlVcmwudGl0bGVOYW1lID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicmVzdGZ1bGxcIjsgfVxuICAgIHB1YmxpYyBnZXQgcmVzdGZ1bGxWYWx1ZSgpIHsgcmV0dXJuIDxTdXJ2ZXkuQ2hvaWNlc1Jlc3RmdWxsPnRoaXMudmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXZhbHVlIHx8ICF2YWx1ZS51cmwpIHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuZW1wdHlcIik7XG4gICAgICAgIHZhciBzdHIgPSB2YWx1ZS51cmw7XG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgMjApICsgXCIuLi5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgICAgIHZhciB2YWwgPSB0aGlzLnJlc3RmdWxsVmFsdWU7XG4gICAgICAgIHRoaXMua29VcmwodmFsID8gdmFsLnVybCA6IFwiXCIpO1xuICAgICAgICB0aGlzLmtvUGF0aCh2YWwgPyB2YWwucGF0aCA6IFwiXCIpO1xuICAgICAgICB0aGlzLmtvVmFsdWVOYW1lKHZhbCA/IHZhbC52YWx1ZU5hbWUgOiBcIlwiKTtcbiAgICAgICAgdGhpcy5rb1RpdGxlTmFtZSh2YWwgPyB2YWwudGl0bGVOYW1lIDogXCJcIik7XG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcihcInJlc3RmdWxsU3VydmV5XCIpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHtcbiAgICAgICAgdmFyIHZhbCA9IG5ldyBTdXJ2ZXkuQ2hvaWNlc1Jlc3RmdWxsKCk7XG4gICAgICAgIHZhbC51cmwgPSB0aGlzLmtvVXJsKCk7XG4gICAgICAgIHZhbC5wYXRoID0gdGhpcy5rb1BhdGgoKTtcbiAgICAgICAgdmFsLnZhbHVlTmFtZSA9IHRoaXMua29WYWx1ZU5hbWUoKTtcbiAgICAgICAgdmFsLnRpdGxlTmFtZSA9IHRoaXMua29UaXRsZU5hbWUoKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZUNvcmUodmFsKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBydW4oKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnJ1bigpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVN1cnZleSgpIHtcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXcgU3VydmV5LlN1cnZleSgpO1xuICAgICAgICB0aGlzLnN1cnZleS5zaG93TmF2aWdhdGlvbkJ1dHRvbnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdXJ2ZXkuc2hvd1F1ZXN0aW9uTnVtYmVycyA9IFwib2ZmXCI7XG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuYWRkTmV3UGFnZShcInBhZ2UxXCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkRyb3Bkb3duPnBhZ2UuYWRkTmV3UXVlc3Rpb24oXCJkcm9wZG93blwiLCBcInExXCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uLnRpdGxlID0gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRlc3RTZXJ2aWNlXCIpXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlcyA9IFtdO1xuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoXCJyZXN0ZnVsbFN1cnZleVwiKTtcbiAgICB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInJlc3RmdWxsXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5UmVzdWx0ZnVsbEVkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5UmVzdGZ1bGxFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5SXRlbXNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2Vyc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3Ige1xuICAgIGtvUXVlc3Rpb25zOiBhbnk7IGtvUGFnZXM6IGFueTtcbiAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xuICAgIHB1YmxpYyBhdmFpbGFibGVUcmlnZ2VyczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHByaXZhdGUgdHJpZ2dlckNsYXNzZXM6IEFycmF5PFN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcz4gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9O1xuICAgICAgICB0aGlzLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAodHJpZ2dlclR5cGUpIHsgc2VsZi5hZGRJdGVtKHRyaWdnZXJUeXBlKTsgfTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcbiAgICAgICAgdGhpcy5rb1BhZ2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29RdWVzdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyQ2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInN1cnZleXRyaWdnZXJcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlVHJpZ2dlcnMgPSB0aGlzLmdldEF2YWlsYWJsZVRyaWdnZXJzKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0cmlnZ2Vyc1wiOyB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICBpZiAodGhpcy5vYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyh0aGlzLmdldE5hbWVzKCg8U3VydmV5LlN1cnZleT50aGlzLm9iamVjdCkucGFnZXMpKTtcbiAgICAgICAgICAgIHRoaXMua29RdWVzdGlvbnModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLmdldEFsbFF1ZXN0aW9ucygpKSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIub25WYWx1ZUNoYW5nZWQoKTtcbiAgICAgICAgaWYgKHRoaXMua29TZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKHRoaXMua29JdGVtcygpLmxlbmd0aCA+IDAgPyB0aGlzLmtvSXRlbXMoKVswXSA6IG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRJdGVtKHRyaWdnZXJUeXBlOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIHRyaWdnZXIgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh0cmlnZ2VyVHlwZSk7XG4gICAgICAgIHZhciB0cmlnZ2VySXRlbSA9IHRoaXMuY3JlYXRlUHJvcGVydHlUcmlnZ2VyKHRyaWdnZXIpO1xuICAgICAgICB0aGlzLmtvSXRlbXMucHVzaCh0cmlnZ2VySXRlbSk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZCh0cmlnZ2VySXRlbSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVFZGl0b3JJdGVtKGl0ZW06IGFueSkge1xuICAgICAgICB2YXIganNvbk9iaiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpO1xuICAgICAgICB2YXIgdHJpZ2dlciA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKGl0ZW0uZ2V0VHlwZSgpKTtcbiAgICAgICAganNvbk9iai50b09iamVjdChpdGVtLCB0cmlnZ2VyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUHJvcGVydHlUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlcj50cmlnZ2VyKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGVkaXRvclRyaWdnZXIgPSA8U3VydmV5UHJvcGVydHlUcmlnZ2VyPmVkaXRvckl0ZW07XG4gICAgICAgIHJldHVybiBlZGl0b3JUcmlnZ2VyLmNyZWF0ZVRyaWdnZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRBdmFpbGFibGVUcmlnZ2VycygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudHJpZ2dlckNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudHJpZ2dlckNsYXNzZXNbaV0ubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXROYW1lcyhpdGVtczogQXJyYXk8YW55Pik6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgICAgIGlmIChpdGVtW1wibmFtZVwiXSkge1xuICAgICAgICAgICAgICAgIG5hbWVzLnB1c2goaXRlbVtcIm5hbWVcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lcztcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0eVRyaWdnZXIodHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXIpOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlckl0ZW0gPSBudWxsO1xuICAgICAgICBpZiAodHJpZ2dlci5nZXRUeXBlKCkgPT0gXCJ2aXNpYmxldHJpZ2dlclwiKSB7XG4gICAgICAgICAgICB0cmlnZ2VySXRlbSA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZpc2libGVUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGU+dHJpZ2dlciwgdGhpcy5rb1BhZ2VzLCB0aGlzLmtvUXVlc3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJpZ2dlci5nZXRUeXBlKCkgPT0gXCJzZXR2YWx1ZXRyaWdnZXJcIikge1xuICAgICAgICAgICAgdHJpZ2dlckl0ZW0gPSBuZXcgU3VydmV5UHJvcGVydHlTZXRWYWx1ZVRyaWdnZXIoPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyU2V0VmFsdWU+dHJpZ2dlciwgdGhpcy5rb1F1ZXN0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0cmlnZ2VySXRlbSkge1xuICAgICAgICAgICAgdHJpZ2dlckl0ZW0gPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyKHRyaWdnZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmlnZ2VySXRlbTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2VyIHtcbiAgICBwcml2YXRlIG9wZXJhdG9ycyA9IFtcImVtcHR5XCIsIFwibm90ZW1wdHlcIiwgXCJlcXVhbFwiLCBcIm5vdGVxdWFsXCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLCBcImdyZWF0ZXJcIiwgXCJsZXNzXCIsIFwiZ3JlYXRlcm9yZXF1YWxcIiwgXCJsZXNzb3JlcXVhbFwiXTtcbiAgICBwcml2YXRlIHRyaWdnZXJUeXBlOiBzdHJpbmc7XG4gICAgYXZhaWxhYmxlT3BlcmF0b3JzID0gW107XG4gICAga29OYW1lOiBhbnk7IGtvT3BlcmF0b3I6IGFueTsga29WYWx1ZTogYW55OyBrb1R5cGU6IGFueTtcbiAgICBrb1RleHQ6IGFueTsga29Jc1ZhbGlkOiBhbnk7IGtvUmVxdWlyZVZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXIpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVPcGVyYXRvcnMoKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyVHlwZSA9IHRyaWdnZXIuZ2V0VHlwZSgpO1xuICAgICAgICB0aGlzLmtvVHlwZSA9IGtvLm9ic2VydmFibGUodGhpcy50cmlnZ2VyVHlwZSk7XG4gICAgICAgIHRoaXMua29OYW1lID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLm5hbWUpO1xuICAgICAgICB0aGlzLmtvT3BlcmF0b3IgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIub3BlcmF0b3IpO1xuICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIudmFsdWUpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29SZXF1aXJlVmFsdWUgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmtvT3BlcmF0b3IoKSAhPSBcImVtcHR5XCIgJiYgc2VsZi5rb09wZXJhdG9yKCkgIT0gXCJub3RlbXB0eVwiOyB9KTtcbiAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5jb21wdXRlZCgoKSA9PiB7IGlmIChzZWxmLmtvTmFtZSgpICYmICghc2VsZi5rb1JlcXVpcmVWYWx1ZSgpIHx8IHNlbGYua29WYWx1ZSgpKSkgcmV0dXJuIHRydWU7IHJldHVybiBmYWxzZTsgfSk7XG4gICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyBzZWxmLmtvTmFtZSgpOyBzZWxmLmtvT3BlcmF0b3IoKTsgc2VsZi5rb1ZhbHVlKCk7IHJldHVybiBzZWxmLmdldFRleHQoKTsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBjcmVhdGVUcmlnZ2VyKCk6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyIHtcbiAgICAgICAgdmFyIHRyaWdnZXIgPSA8U3VydmV5LlN1cnZleVRyaWdnZXI+U3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3ModGhpcy50cmlnZ2VyVHlwZSk7XG4gICAgICAgIHRyaWdnZXIubmFtZSA9IHRoaXMua29OYW1lKCk7XG4gICAgICAgIHRyaWdnZXIub3BlcmF0b3IgPSB0aGlzLmtvT3BlcmF0b3IoKTtcbiAgICAgICAgdHJpZ2dlci52YWx1ZSA9IHRoaXMua29WYWx1ZSgpO1xuICAgICAgICByZXR1cm4gdHJpZ2dlcjtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVPcGVyYXRvcnMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcGVyYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5vcGVyYXRvcnNbaV07XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZU9wZXJhdG9ycy5wdXNoKHsgbmFtZTogbmFtZSwgdGV4dDogZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wLlwiICsgbmFtZSkgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5rb0lzVmFsaWQoKSkgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS50cmlnZ2VyTm90U2V0XCIpO1xuICAgICAgICByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJSdW5JZlwiKSArIFwiICdcIiArIHRoaXMua29OYW1lKCkgKyBcIicgXCIgKyB0aGlzLmdldE9wZXJhdG9yVGV4dCgpICsgdGhpcy5nZXRWYWx1ZVRleHQoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRPcGVyYXRvclRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIG9wID0gdGhpcy5rb09wZXJhdG9yKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdmFpbGFibGVPcGVyYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZU9wZXJhdG9yc1tpXS5uYW1lID09IG9wKSByZXR1cm4gdGhpcy5hdmFpbGFibGVPcGVyYXRvcnNbaV0udGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3A7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0VmFsdWVUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5rb1JlcXVpcmVWYWx1ZSgpKSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIFwiIFwiICsgdGhpcy5rb1ZhbHVlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWaXNpYmxlVHJpZ2dlciBleHRlbmRzIFN1cnZleVByb3BlcnR5VHJpZ2dlciB7XG4gICAgcHVibGljIHBhZ2VzOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzO1xuICAgIHB1YmxpYyBxdWVzdGlvbnM6IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHM7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSwga29QYWdlczogYW55LCBrb1F1ZXN0aW9uczogYW55KSB7XG4gICAgICAgIHN1cGVyKHRyaWdnZXIpO1xuICAgICAgICB0aGlzLnBhZ2VzID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMoZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJNYWtlUGFnZXNWaXNpYmxlXCIpLCBrb1BhZ2VzKCksIHRyaWdnZXIucGFnZXMpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9ucyA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS50cmlnZ2VyTWFrZVF1ZXN0aW9uc1Zpc2libGVcIiksIGtvUXVlc3Rpb25zKCksIHRyaWdnZXIucXVlc3Rpb25zKTtcbiAgICB9XG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGU+c3VwZXIuY3JlYXRlVHJpZ2dlcigpO1xuICAgICAgICB0cmlnZ2VyLnBhZ2VzID0gdGhpcy5wYWdlcy5rb0Nob29zZW4oKTtcbiAgICAgICAgdHJpZ2dlci5xdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucy5rb0Nob29zZW4oKTtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlTZXRWYWx1ZVRyaWdnZXIgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xuICAgIGtvUXVlc3Rpb25zOiBhbnk7IGtvc2V0VG9OYW1lOiBhbnk7IGtvc2V0VmFsdWU6IGFueTsga29pc1ZhcmlhYmxlOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUsIGtvUXVlc3Rpb25zOiBhbnkpIHtcbiAgICAgICAgc3VwZXIodHJpZ2dlcik7XG4gICAgICAgIHRoaXMua29RdWVzdGlvbnMgPSBrb1F1ZXN0aW9ucztcbiAgICAgICAgdGhpcy5rb3NldFRvTmFtZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5zZXRUb05hbWUpO1xuICAgICAgICB0aGlzLmtvc2V0VmFsdWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIuc2V0VmFsdWUpO1xuICAgICAgICB0aGlzLmtvaXNWYXJpYWJsZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5pc1ZhcmlhYmxlKTtcbiAgICB9XG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclNldFZhbHVlPnN1cGVyLmNyZWF0ZVRyaWdnZXIoKTtcbiAgICAgICAgdHJpZ2dlci5zZXRUb05hbWUgPSB0aGlzLmtvc2V0VG9OYW1lKCk7XG4gICAgICAgIHRyaWdnZXIuc2V0VmFsdWUgPSB0aGlzLmtvc2V0VmFsdWUoKTtcbiAgICAgICAgdHJpZ2dlci5pc1ZhcmlhYmxlID0gdGhpcy5rb2lzVmFyaWFibGUoKTtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXI7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMge1xuICAgIGtvT2JqZWN0czogYW55O1xuICAgIGtvQ2hvb3NlbjogYW55O1xuICAgIGtvU2VsZWN0ZWQ6IGFueTtcbiAgICBrb0Nob29zZW5TZWxlY3RlZDogYW55O1xuICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGl0bGU6IHN0cmluZywgYWxsT2JqZWN0czogQXJyYXk8c3RyaW5nPiwgY2hvb3Nlbk9iamVjdHM6IEFycmF5PHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy5rb0Nob29zZW4gPSBrby5vYnNlcnZhYmxlQXJyYXkoY2hvb3Nlbk9iamVjdHMpO1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGFsbE9iamVjdHNbaV07XG4gICAgICAgICAgICBpZiAoY2hvb3Nlbk9iamVjdHMuaW5kZXhPZihpdGVtKSA8IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KGFycmF5KTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmtvQ2hvb3NlblNlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kZWxldGVJdGVtKCk7IH07XG4gICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hZGRJdGVtKCk7IH1cbiAgICB9XG4gICAgcHJpdmF0ZSBkZWxldGVJdGVtKCkge1xuICAgICAgICB0aGlzLmNoYW5nZUl0ZW1zKHRoaXMua29DaG9vc2VuU2VsZWN0ZWQoKSwgdGhpcy5rb0Nob29zZW4sIHRoaXMua29PYmplY3RzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRJdGVtKCkge1xuICAgICAgICB0aGlzLmNoYW5nZUl0ZW1zKHRoaXMua29TZWxlY3RlZCgpLCB0aGlzLmtvT2JqZWN0cywgdGhpcy5rb0Nob29zZW4pO1xuICAgIH1cbiAgICBwcml2YXRlIGNoYW5nZUl0ZW1zKGl0ZW06IHN0cmluZywgcmVtb3ZlZEZyb206IGFueSwgYWRkVG86IGFueSkge1xuICAgICAgICByZW1vdmVkRnJvbS5yZW1vdmUoaXRlbSk7XG4gICAgICAgIGFkZFRvLnB1c2goaXRlbSk7XG4gICAgICAgIHJlbW92ZWRGcm9tLnNvcnQoKTtcbiAgICAgICAgYWRkVG8uc29ydCgpO1xuICAgIH1cbn1cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidHJpZ2dlcnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2Vyc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5VHJpZ2dlcnNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleUhlbHBlcn0gZnJvbSBcIi4vc3VydmV5SGVscGVyXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgZGVjbGFyZSB0eXBlIFN1cnZleUFkZE5ld1BhZ2VDYWxsYmFjayA9ICgpID0+IHZvaWQ7XG5leHBvcnQgZGVjbGFyZSB0eXBlIFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjayA9IChwYWdlOiBTdXJ2ZXkuUGFnZSkgPT4gdm9pZDtcbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5TW92ZVBhZ2VDYWxsYmFjayA9IChpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UGFnZXNFZGl0b3Ige1xuICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuICAgIGtvUGFnZXM6IGFueTtcbiAgICBrb0lzVmFsaWQ6IGFueTtcbiAgICBzZWxlY3RQYWdlQ2xpY2s6IGFueTtcbiAgICBvbkFkZE5ld1BhZ2VDYWxsYmFjazogU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrO1xuICAgIG9uU2VsZWN0UGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2s7XG4gICAgb25EZWxldGVQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcbiAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2s7XG4gICAgZHJhZ2dpbmdQYWdlOiBhbnkgPSBudWxsO1xuICAgIGRyYWdTdGFydDogYW55OyBkcmFnT3ZlcjogYW55OyBkcmFnRW5kOiBhbnk7IGRyYWdEcm9wOiBhbnk7IGtleURvd246IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSBudWxsLCBvblNlbGVjdFBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCxcbiAgICAgICAgICAgICAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2sgPSBudWxsLCBvbkRlbGV0ZVBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCkge1xuICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjayA9IG9uQWRkTmV3UGFnZUNhbGxiYWNrO1xuICAgICAgICB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrID0gb25TZWxlY3RQYWdlQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrID0gb25Nb3ZlUGFnZUNhbGxiYWNrO1xuICAgICAgICB0aGlzLm9uRGVsZXRlUGFnZUNhbGxiYWNrID0gb25EZWxldGVQYWdlQ2FsbGJhY2s7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5zZWxlY3RQYWdlQ2xpY2sgPSBmdW5jdGlvbihwYWdlSXRlbSkge1xuICAgICAgICAgICAgaWYgKHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9uU2VsZWN0UGFnZUNhbGxiYWNrKHBhZ2VJdGVtLnBhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmtleURvd24gPSBmdW5jdGlvbiAoZWw6IGFueSwgZTogS2V5Ym9hcmRFdmVudCkgeyBzZWxmLm9uS2V5RG93bihlbCwgZSk7IH1cbiAgICAgICAgdGhpcy5kcmFnU3RhcnQgPSBmdW5jdGlvbiAoZWw6IGFueSkgeyBzZWxmLmRyYWdnaW5nUGFnZSA9IGVsOyB9O1xuICAgICAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGVsOiBhbnkpIHsgIH07XG4gICAgICAgIHRoaXMuZHJhZ0VuZCA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBudWxsOyB9O1xuICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGVsOiBhbnkpIHsgc2VsZi5tb3ZlRHJhZ2dpbmdQYWdlVG8oZWwpOyB9O1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMua29Jc1ZhbGlkKHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnZXMoKTtcbiAgICB9XG4gICAgcHVibGljIHNldFNlbGVjdGVkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmtvUGFnZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGFnZXNbaV0ua29TZWxlY3RlZChwYWdlc1tpXS5wYWdlID09IHBhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhZGROZXdQYWdlQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIHJlbW92ZVBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMua29QYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBjaGFuZ2VOYW1lKHBhZ2U6IFN1cnZleS5QYWdlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXhCeVBhZ2UocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMoKVtpbmRleF0udGl0bGUoU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUocGFnZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRJbmRleEJ5UGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSk6IG51bWJlciB7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGFnZXNbaV0ucGFnZSA9PSBwYWdlKSByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbktleURvd24oZWw6IGFueSwgZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5rb1BhZ2VzKCkubGVuZ3RoIDw9IDEpIHJldHVybjtcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XG4gICAgICAgIHZhciBwYWdlSW5kZXggPSAtMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBhZ2VzW2ldLnBhZ2UgJiYgcGFnZXNbaV0ua29TZWxlY3RlZCgpKSB7XG4gICAgICAgICAgICAgICAgcGFnZUluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGFnZUluZGV4IDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09IDQ2ICYmIHRoaXMub25EZWxldGVQYWdlQ2FsbGJhY2spIHRoaXMub25EZWxldGVQYWdlQ2FsbGJhY2soZWwucGFnZSk7XG4gICAgICAgIGlmICgoZS5rZXlDb2RlID09IDM3IHx8IGUua2V5Q29kZSA9PSAzOSkgJiYgdGhpcy5vblNlbGVjdFBhZ2VDYWxsYmFjaykge1xuICAgICAgICAgICAgcGFnZUluZGV4ICs9IChlLmtleUNvZGUgPT0gMzcgPyAtMSA6IDEpO1xuICAgICAgICAgICAgaWYgKHBhZ2VJbmRleCA8IDApIHBhZ2VJbmRleCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAocGFnZUluZGV4ID49IHBhZ2VzLmxlbmd0aCkgcGFnZUluZGV4ID0gMDtcbiAgICAgICAgICAgIHZhciBwYWdlID0gcGFnZXNbcGFnZUluZGV4XS5wYWdlO1xuICAgICAgICAgICAgdGhpcy5vblNlbGVjdFBhZ2VDYWxsYmFjayhwYWdlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRQYWdlKHBhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByb3RlY3RlZCB1cGRhdGVQYWdlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKFtdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV07XG4gICAgICAgICAgICBwYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0aXRsZToga28ub2JzZXJ2YWJsZShTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSksIHBhZ2U6IHBhZ2UsIGtvU2VsZWN0ZWQ6IGtvLm9ic2VydmFibGUoZmFsc2UpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvUGFnZXMocGFnZXMpO1xuICAgIH1cbiAgICBwcml2YXRlIG1vdmVEcmFnZ2luZ1BhZ2VUbyh0b1BhZ2U6IGFueSkge1xuICAgICAgICBpZiAodG9QYWdlID09IG51bGwgfHwgdG9QYWdlID09IHRoaXMuZHJhZ2dpbmdQYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nUGFnZSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmdQYWdlID09IG51bGwpIHJldHVybjtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0aGlzLmRyYWdnaW5nUGFnZSk7XG4gICAgICAgIHZhciBpbmRleFRvID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0b1BhZ2UpO1xuICAgICAgICBpZiAodGhpcy5vbk1vdmVQYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrKGluZGV4LCBpbmRleFRvKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleUpTT041fSBmcm9tIFwiLi9qc29uNVwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuY2xhc3MgVGV4dFBhcnNlclByb3Blcnkge1xuICAgIGlzRm91bmQ6IGJvb2xlYW47XG4gICAgcHJvcGVydGllc0NvdW50OiBudW1iZXI7XG4gICAgc3RhcnQ6IG51bWJlcjtcbiAgICBlbmQ6IG51bWJlcjtcbiAgICB2YWx1ZVN0YXJ0OiBudW1iZXI7XG4gICAgdmFsdWVFbmQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleVRleHRXb3JrZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgbmV3TGluZUNoYXI6IHN0cmluZztcbiAgICBwdWJsaWMgZXJyb3JzOiBBcnJheTxhbnk+O1xuICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XG4gICAgcHJpdmF0ZSBqc29uVmFsdWU6IGFueTtcbiAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IEFycmF5PGFueT47XG4gICAgcHJpdmF0ZSBpc1N1cnZleUFzUGFnZTogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHQgfHwgdGhpcy50ZXh0LnRyaW0oKSA9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSBcInt9XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9jZXNzKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBnZXQgaXNKc29uQ29ycmVjdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbDsgfVxuICAgIHByb3RlY3RlZCBwcm9jZXNzKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5qc29uVmFsdWUgPSBuZXcgU3VydmV5SlNPTjUoMSkucGFyc2UodGhpcy50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goeyBwb3M6IHsgc3RhcnQ6IGVycm9yLmF0LCBlbmQ6IC0xIH0sIHRleHQ6IGVycm9yLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuanNvblZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyh0aGlzLmpzb25WYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkodGhpcy5qc29uVmFsdWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9ycyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5nZXRGdWxsRGVzY3JpcHRpb24oKSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzID0gdGhpcy5jcmVhdGVTdXJ2ZXlPYmplY3RzKCk7XG4gICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5zdXJ2ZXlPYmplY3RzKTtcbiAgICAgICAgdGhpcy5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCh0aGlzLmVycm9ycyk7XG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlSnNvblBvc2l0aW9ucyhqc29uT2JqOiBhbnkpIHtcbiAgICAgICAganNvbk9ialtcInBvc1wiXVtcInNlbGZcIl0gPSBqc29uT2JqO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xuICAgICAgICAgICAgdmFyIG9iaiA9IGpzb25PYmpba2V5XTtcbiAgICAgICAgICAgIGlmIChvYmogJiYgb2JqW1wicG9zXCJdKSB7XG4gICAgICAgICAgICAgICAganNvbk9ialtcInBvc1wiXVtrZXldID0gb2JqW1wicG9zXCJdO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlU3VydmV5T2JqZWN0cygpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzW2ldO1xuICAgICAgICAgICAgaWYgKGkgPT0gMCAmJiAhcGFnZVtcInBvc1wiXSkge1xuICAgICAgICAgICAgICAgIHBhZ2VbXCJwb3NcIl0gPSB0aGlzLnN1cnZleVZhbHVlW1wicG9zXCJdO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdXJ2ZXlBc1BhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZS5xdWVzdGlvbnNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQob2JqZWN0czogYW55W10pIHtcbiAgICAgICAgaWYgKG9iamVjdHMgPT0gbnVsbCB8fCBvYmplY3RzLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHsgcm93OiAwLCBjb2x1bW46IDAgfTtcbiAgICAgICAgdmFyIGF0T2JqZWN0c0FycmF5ID0gdGhpcy5nZXRBdEFycmF5KG9iamVjdHMpO1xuICAgICAgICB2YXIgc3RhcnRBdDogbnVtYmVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdE9iamVjdHNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGF0ID0gYXRPYmplY3RzQXJyYXlbaV0uYXQ7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zdGlvbkJ5Q2hhcnRBdChwb3NpdGlvbiwgc3RhcnRBdCwgYXQpO1xuICAgICAgICAgICAgdmFyIG9iaiA9IGF0T2JqZWN0c0FycmF5W2ldLm9iajtcbiAgICAgICAgICAgIGlmICghb2JqLnBvc2l0aW9uKSBvYmoucG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnN0YXJ0ID0gcG9zaXRpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uZW5kID0gcG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnRBdCA9IGF0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UG9zdGlvbkJ5Q2hhcnRBdChzdGFydFBvc2l0aW9uOiBhbnksIHN0YXJ0QXQ6IG51bWJlciwgYXQ6IG51bWJlcik6IGFueSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7IHJvdzogc3RhcnRQb3NpdGlvbi5yb3csIGNvbHVtbjogc3RhcnRQb3NpdGlvbi5jb2x1bW4gfTtcbiAgICAgICAgdmFyIGN1ckNoYXIgPSBzdGFydEF0O1xuICAgICAgICB3aGlsZSAoY3VyQ2hhciA8IGF0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0LmNoYXJBdChjdXJDaGFyKSA9PSBTdXJ2ZXlUZXh0V29ya2VyLm5ld0xpbmVDaGFyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnJvdysrO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5jb2x1bW4gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuY29sdW1uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJDaGFyKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRBdEFycmF5KG9iamVjdHM6IGFueVtdKTogYW55W10ge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG9iaiA9IG9iamVjdHNbaV07XG4gICAgICAgICAgICB2YXIgcG9zID0gb2JqLnBvcztcbiAgICAgICAgICAgIGlmICghcG9zKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgYXQ6IHBvcy5zdGFydCwgb2JqOiBvYmogfSk7XG4gICAgICAgICAgICBpZiAocG9zLmVuZCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IGF0OiBwb3MuZW5kLCBvYmo6IG9iaiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKGVsMSwgZWwyKSA9PiB7XG4gICAgICAgICAgICBpZiAoZWwxLmF0ID4gZWwyLmF0KSByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmIChlbDEuYXQgPCBlbDIuYXQpIHJldHVybiAtMTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RleHRXb3JrZXIudHMiLCIvLyBUaGlzIGZpbGUgaXMgYmFzZWQgb24gSlNPTjUsIGh0dHA6Ly9qc29uNS5vcmcvXG4vLyBUaGUgbW9kaWZpY2F0aW9uIGZvciBnZXR0aW5nIG9iamVjdCBhbmQgcHJvcGVydGllcyBsb2NhdGlvbiAnYXQnIHdlcmUgbWFkZW4uXG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlKU09ONSB7XG4gICAgcHVibGljIHN0YXRpYyBwb3NpdGlvbk5hbWUgPSBcInBvc1wiO1xuICAgIHByaXZhdGUgc3RhdGljIGVzY2FwZWUgPSB7XG4gICAgICAgIFwiJ1wiOiBcIidcIixcbiAgICAgICAgJ1wiJzogJ1wiJyxcbiAgICAgICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgICAgICcvJzogJy8nLFxuICAgICAgICAnXFxuJzogJycsICAgICAgIC8vIFJlcGxhY2UgZXNjYXBlZCBuZXdsaW5lcyBpbiBzdHJpbmdzIHcvIGVtcHR5IHN0cmluZ1xuICAgICAgICBiOiAnXFxiJyxcbiAgICAgICAgZjogJ1xcZicsXG4gICAgICAgIG46ICdcXG4nLFxuICAgICAgICByOiAnXFxyJyxcbiAgICAgICAgdDogJ1xcdCdcbiAgICB9O1xuICAgIHByaXZhdGUgc3RhdGljIHdzID0gW1xuICAgICAgICAnICcsXG4gICAgICAgICdcXHQnLFxuICAgICAgICAnXFxyJyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdcXHYnLFxuICAgICAgICAnXFxmJyxcbiAgICAgICAgJ1xceEEwJyxcbiAgICAgICAgJ1xcdUZFRkYnXG4gICAgXTtcbiAgICBwcml2YXRlIGVuZEF0OiBudW1iZXI7XG4gICAgcHJpdmF0ZSBhdDogbnVtYmVyOyAgICAgLy8gVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IGNoYXJhY3RlclxuICAgIHByaXZhdGUgY2g6IGFueTsgICAgIC8vIFRoZSBjdXJyZW50IGNoYXJhY3RlclxuICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xuICAgIHByaXZhdGUgcGFyc2VUeXBlOiBudW1iZXI7IC8vIDAgLSBzdGFkYXJkLCAxIC0gZ2V0IGluZm9ybWF0aW9uIGFib3V0IG9iamVjdHMsIDIgLSBnZXQgaW5mb3JtYXRpb24gYWJvdXQgYWxsIHByb3BlcnRpZXNcbiAgICBjb25zdHJ1Y3RvcihwYXJzZVR5cGU6IG51bWJlciA9IDApIHtcbiAgICAgICAgdGhpcy5wYXJzZVR5cGUgPSBwYXJzZVR5cGU7XG4gICAgfVxuICAgIHB1YmxpYyBwYXJzZShzb3VyY2U6IGFueSwgcmV2aXZlcjogYW55ID0gbnVsbCwgc3RhcnRGcm9tOiBudW1iZXIgPSAwLCBlbmRBdDogbnVtYmVyID0gLTEpOiBhbnkge1xuICAgICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICAgIHRoaXMudGV4dCA9IFN0cmluZyhzb3VyY2UpO1xuICAgICAgICB0aGlzLmF0ID0gc3RhcnRGcm9tO1xuICAgICAgICB0aGlzLmVuZEF0ID0gZW5kQXQ7XG4gICAgICAgIHRoaXMuY2ggPSAnICc7XG4gICAgICAgIHJlc3VsdCA9IHRoaXMudmFsdWUoKTtcbiAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICBpZiAodGhpcy5jaCkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlN5bnRheCBlcnJvclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcmV2aXZlciBmdW5jdGlvbiwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSxcbiAgICAgICAgLy8gcGFzc2luZyBlYWNoIG5hbWUvdmFsdWUgcGFpciB0byB0aGUgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGVcbiAgICAgICAgLy8gdHJhbnNmb3JtYXRpb24sIHN0YXJ0aW5nIHdpdGggYSB0ZW1wb3Jhcnkgcm9vdCBvYmplY3QgdGhhdCBob2xkcyB0aGUgcmVzdWx0XG4gICAgICAgIC8vIGluIGFuIGVtcHR5IGtleS4gSWYgdGhlcmUgaXMgbm90IGEgcmV2aXZlciBmdW5jdGlvbiwgd2Ugc2ltcGx5IHJldHVybiB0aGVcbiAgICAgICAgLy8gcmVzdWx0LlxuXG4gICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJyA/IChmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XG4gICAgICAgICAgICB2YXIgaywgdiwgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gKHsgJyc6IHJlc3VsdCB9LCAnJykpIDogcmVzdWx0O1xuICAgIH1cbiAgICBwcml2YXRlIGVycm9yKG06IHN0cmluZykge1xuICAgICAgICAvLyBDYWxsIGVycm9yIHdoZW4gc29tZXRoaW5nIGlzIHdyb25nLlxuICAgICAgICB2YXIgZXJyb3IgPSBuZXcgU3ludGF4RXJyb3IoKTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IG07XG4gICAgICAgIGVycm9yW1wiYXRcIl0gPSB0aGlzLmF0O1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgcHJpdmF0ZSBuZXh0KGM6IGFueSA9IG51bGwpIHtcbiAgICAgICAgLy8gSWYgYSBjIHBhcmFtZXRlciBpcyBwcm92aWRlZCwgdmVyaWZ5IHRoYXQgaXQgbWF0Y2hlcyB0aGUgY3VycmVudCBjaGFyYWN0ZXIuXG4gICAgICAgIGlmIChjICYmIGMgIT09IHRoaXMuY2gpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCAnXCIgKyBjICsgXCInIGluc3RlYWQgb2YgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBHZXQgdGhlIHRoaXMubmV4dCBjaGFyYWN0ZXIuIFdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgY2hhcmFjdGVycyxcbiAgICAgICAgLy8gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcuXG4gICAgICAgIHRoaXMuY2ggPSB0aGlzLmNoYXJ0QXQoKTtcbiAgICAgICAgdGhpcy5hdCArPSAxO1xuICAgICAgICByZXR1cm4gdGhpcy5jaDtcbiAgICB9XG4gICAgcHJpdmF0ZSBwZWVrKCkge1xuICAgICAgICAvLyBHZXQgdGhlIHRoaXMubmV4dCBjaGFyYWN0ZXIgd2l0aG91dCBjb25zdW1pbmcgaXQgb3JcbiAgICAgICAgLy8gYXNzaWduaW5nIGl0IHRvIHRoZSB0aGlzLmNoIHZhcmFpYmxlLlxuICAgICAgICByZXR1cm4gdGhpcy5jaGFydEF0KCk7XG4gICAgfVxuICAgIHByaXZhdGUgY2hhcnRBdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5kQXQgPiAtMSAmJiB0aGlzLmF0ID49IHRoaXMuZW5kQXQpIHJldHVybiAnJztcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5jaGFyQXQodGhpcy5hdCk7XG4gICAgfVxuICAgIHByaXZhdGUgaWRlbnRpZmllcigpIHtcbiAgICAgICAgLy8gUGFyc2UgYW4gaWRlbnRpZmllci4gTm9ybWFsbHksIHJlc2VydmVkIHdvcmRzIGFyZSBkaXNhbGxvd2VkIGhlcmUsIGJ1dCB3ZVxuICAgICAgICAvLyBvbmx5IHVzZSB0aGlzIGZvciB1bnF1b3RlZCBvYmplY3Qga2V5cywgd2hlcmUgcmVzZXJ2ZWQgd29yZHMgYXJlIGFsbG93ZWQsXG4gICAgICAgIC8vIHNvIHdlIGRvbid0IGNoZWNrIGZvciB0aG9zZSBoZXJlLiBSZWZlcmVuY2VzOlxuICAgICAgICAvLyAtIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDcuNlxuICAgICAgICAvLyAtIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfR3VpZGUvQ29yZV9MYW5ndWFnZV9GZWF0dXJlcyNWYXJpYWJsZXNcbiAgICAgICAgLy8gLSBodHRwOi8vZG9jc3RvcmUubWlrLnVhL29yZWxseS93ZWJwcm9nL2pzY3JpcHQvY2gwMl8wNy5odG1cbiAgICAgICAgLy8gVE9ETyBJZGVudGlmaWVycyBjYW4gaGF2ZSBVbmljb2RlIFwibGV0dGVyc1wiIGluIHRoZW07IGFkZCBzdXBwb3J0IGZvciB0aG9zZS5cbiAgICAgICAgdmFyIGtleSA9IHRoaXMuY2g7XG5cbiAgICAgICAgLy8gSWRlbnRpZmllcnMgbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyLCBfIG9yICQuXG4gICAgICAgIGlmICgodGhpcy5jaCAhPT0gJ18nICYmIHRoaXMuY2ggIT09ICckJykgJiZcbiAgICAgICAgICAgICh0aGlzLmNoIDwgJ2EnIHx8IHRoaXMuY2ggPiAneicpICYmXG4gICAgICAgICAgICAodGhpcy5jaCA8ICdBJyB8fCB0aGlzLmNoID4gJ1onKSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBpZGVudGlmaWVyXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3Vic2VxdWVudCBjaGFyYWN0ZXJzIGNhbiBjb250YWluIGRpZ2l0cy5cbiAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIChcbiAgICAgICAgdGhpcy5jaCA9PT0gJ18nIHx8IHRoaXMuY2ggPT09ICckJyB8fFxuICAgICAgICAodGhpcy5jaCA+PSAnYScgJiYgdGhpcy5jaCA8PSAneicpIHx8XG4gICAgICAgICh0aGlzLmNoID49ICdBJyAmJiB0aGlzLmNoIDw9ICdaJykgfHxcbiAgICAgICAgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSkpIHtcbiAgICAgICAgICAgIGtleSArPSB0aGlzLmNoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgcHJpdmF0ZSBudW1iZXIoKSB7XG5cbiAgICAgICAgLy8gUGFyc2UgYSBudW1iZXIgdmFsdWUuXG5cbiAgICAgICAgdmFyIG51bWJlcixcbiAgICAgICAgICAgIHNpZ24gPSAnJyxcbiAgICAgICAgICAgIHN0cmluZyA9ICcnLFxuICAgICAgICAgICAgYmFzZSA9IDEwO1xuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnLScgfHwgdGhpcy5jaCA9PT0gJysnKSB7XG4gICAgICAgICAgICBzaWduID0gdGhpcy5jaDtcbiAgICAgICAgICAgIHRoaXMubmV4dCh0aGlzLmNoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN1cHBvcnQgZm9yIEluZmluaXR5IChjb3VsZCB0d2VhayB0byBhbGxvdyBvdGhlciB3b3Jkcyk6XG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnSScpIHtcbiAgICAgICAgICAgIG51bWJlciA9IHRoaXMud29yZCgpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBudW1iZXIgIT09ICdudW1iZXInIHx8IGlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHdvcmQgZm9yIG51bWJlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChzaWduID09PSAnLScpID8gLW51bWJlciA6IG51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN1cHBvcnQgZm9yIE5hTlxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ04nKSB7XG4gICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4obnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ2V4cGVjdGVkIHdvcmQgdG8gYmUgTmFOJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZ25vcmUgc2lnbiBhcyAtTmFOIGFsc28gaXMgTmFOXG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcwJykge1xuICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAneCcgfHwgdGhpcy5jaCA9PT0gJ1gnKSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgYmFzZSA9IDE2O1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ09jdGFsIGxpdGVyYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoYmFzZSkge1xuICAgICAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSAnLic7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSAmJiB0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdlJyB8fCB0aGlzLmNoID09PSAnRScpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE2OlxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JyB8fCB0aGlzLmNoID49ICdBJyAmJiB0aGlzLmNoIDw9ICdGJyB8fCB0aGlzLmNoID49ICdhJyAmJiB0aGlzLmNoIDw9ICdmJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpZ24gPT09ICctJykge1xuICAgICAgICAgICAgbnVtYmVyID0gLXN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG51bWJlciA9ICtzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzRmluaXRlKG51bWJlcikpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgbnVtYmVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHN0cmluZygpIHtcblxuICAgICAgICAvLyBQYXJzZSBhIHN0cmluZyB2YWx1ZS5cblxuICAgICAgICB2YXIgaGV4LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIHN0cmluZyA9ICcnLFxuICAgICAgICAgICAgZGVsaW0sICAgICAgLy8gZG91YmxlIHF1b3RlIG9yIHNpbmdsZSBxdW90ZVxuICAgICAgICAgICAgdWZmZmY7XG5cbiAgICAgICAgLy8gV2hlbiBwYXJzaW5nIGZvciBzdHJpbmcgdmFsdWVzLCB3ZSBtdXN0IGxvb2sgZm9yICcgb3IgXCIgYW5kIFxcIGNoYXJhY3RlcnMuXG5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcIicgfHwgdGhpcy5jaCA9PT0gXCInXCIpIHtcbiAgICAgICAgICAgIGRlbGltID0gdGhpcy5jaDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSBkZWxpbSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd1Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdWZmZmYgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDQ7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhleCA9IHBhcnNlSW50KHRoaXMubmV4dCgpLCAxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShoZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IHVmZmZmICogMTYgKyBoZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh1ZmZmZik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgU3VydmV5SlNPTjUuZXNjYXBlZVt0aGlzLmNoXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBTdXJ2ZXlKU09ONS5lc2NhcGVlW3RoaXMuY2hdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZXNjYXBlZCBuZXdsaW5lcyBhcmUgaW52YWxpZDsgc2VlOlxuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXNlZW1rL2pzb241L2lzc3Vlcy8yNFxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHRoaXMgZmVlbHMgc3BlY2lhbC1jYXNlZDsgYXJlIHRoZXJlIG90aGVyXG4gICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWQgdW5lc2NhcGVkIGNoYXJzP1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBzdHJpbmdcIik7XG4gICAgfVxuICAgIHByaXZhdGUgaW5saW5lQ29tbWVudCgpIHtcblxuICAgICAgICAvLyBTa2lwIGFuIGlubGluZSBjb21tZW50LCBhc3N1bWluZyB0aGlzIGlzIG9uZS4gVGhlIGN1cnJlbnQgY2hhcmFjdGVyIHNob3VsZFxuICAgICAgICAvLyBiZSB0aGUgc2Vjb25kIC8gY2hhcmFjdGVyIGluIHRoZSAvLyBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgaW5saW5lIGNvbW1lbnQuXG4gICAgICAgIC8vIFRvIGZpbmlzaCB0aGUgaW5saW5lIGNvbW1lbnQsIHdlIGxvb2sgZm9yIGEgbmV3bGluZSBvciB0aGUgZW5kIG9mIHRoZSB0ZXh0LlxuXG4gICAgICAgIGlmICh0aGlzLmNoICE9PSAnLycpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYW4gaW5saW5lIGNvbW1lbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXFxuJyB8fCB0aGlzLmNoID09PSAnXFxyJykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAodGhpcy5jaCk7XG4gICAgfVxuICAgIHByaXZhdGUgYmxvY2tDb21tZW50KCkge1xuXG4gICAgICAgIC8vIFNraXAgYSBibG9jayBjb21tZW50LCBhc3N1bWluZyB0aGlzIGlzIG9uZS4gVGhlIGN1cnJlbnQgY2hhcmFjdGVyIHNob3VsZCBiZVxuICAgICAgICAvLyB0aGUgKiBjaGFyYWN0ZXIgaW4gdGhlIC8qIHBhaXIgdGhhdCBiZWdpbnMgdGhpcyBibG9jayBjb21tZW50LlxuICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGJsb2NrIGNvbW1lbnQsIHdlIGxvb2sgZm9yIGFuIGVuZGluZyAqLyBwYWlyIG9mIGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIGJ1dCB3ZSBhbHNvIHdhdGNoIGZvciB0aGUgZW5kIG9mIHRleHQgYmVmb3JlIHRoZSBjb21tZW50IGlzIHRlcm1pbmF0ZWQuXG5cbiAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcqJykge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhIGJsb2NrIGNvbW1lbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID09PSAnKicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJyonKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLycpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcblxuICAgICAgICB0aGlzLmVycm9yKFwiVW50ZXJtaW5hdGVkIGJsb2NrIGNvbW1lbnRcIik7XG4gICAgfVxuICAgIHByaXZhdGUgY29tbWVudCgpIHtcblxuICAgICAgICAvLyBTa2lwIGEgY29tbWVudCwgd2hldGhlciBpbmxpbmUgb3IgYmxvY2stbGV2ZWwsIGFzc3VtaW5nIHRoaXMgaXMgb25lLlxuICAgICAgICAvLyBDb21tZW50cyBhbHdheXMgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyLlxuXG4gICAgICAgIGlmICh0aGlzLmNoICE9PSAnLycpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYSBjb21tZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uZXh0KCcvJyk7XG5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xuICAgICAgICAgICAgdGhpcy5pbmxpbmVDb21tZW50KCk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJyonKSB7XG4gICAgICAgICAgICB0aGlzLmJsb2NrQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVucmVjb2duaXplZCBjb21tZW50XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgd2hpdGUoKSB7XG5cbiAgICAgICAgLy8gU2tpcCB3aGl0ZXNwYWNlIGFuZCBjb21tZW50cy5cbiAgICAgICAgLy8gTm90ZSB0aGF0IHdlJ3JlIGRldGVjdGluZyBjb21tZW50cyBieSBvbmx5IGEgc2luZ2xlIC8gY2hhcmFjdGVyLlxuICAgICAgICAvLyBUaGlzIHdvcmtzIHNpbmNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYXJlIG5vdCB2YWxpZCBKU09OKDUpLCBidXQgdGhpcyB3aWxsXG4gICAgICAgIC8vIGJyZWFrIGlmIHRoZXJlIGFyZSBvdGhlciB2YWxpZCB2YWx1ZXMgdGhhdCBiZWdpbiB3aXRoIGEgLyBjaGFyYWN0ZXIhXG5cbiAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoU3VydmV5SlNPTjUud3MuaW5kZXhPZih0aGlzLmNoKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHdvcmQoKTogYW55IHtcblxuICAgICAgICAvLyB0cnVlLCBmYWxzZSwgb3IgbnVsbC5cblxuICAgICAgICBzd2l0Y2ggKHRoaXMuY2gpIHtcbiAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgncicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZScpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdmJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdzJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdlJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY2FzZSAnbic6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd1Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjYXNlICdJJzpcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ0knKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2YnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2knKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3QnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3knKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gSW5maW5pdHk7XG4gICAgICAgICAgICBjYXNlICdOJzpcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ04nKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2EnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ04nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkICdcIiArIHRoaXMuY2ggKyBcIidcIik7XG4gICAgfVxuICAgIHByaXZhdGUgYXJyYXkoKSB7XG5cbiAgICAgICAgLy8gUGFyc2UgYW4gYXJyYXkgdmFsdWUuXG5cbiAgICAgICAgdmFyIGFycmF5ID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdbJykge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCdbJyk7XG4gICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXScpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCddJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTsgICAvLyBQb3RlbnRpYWxseSBlbXB0eSBhcnJheVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBFUzUgYWxsb3dzIG9taXR0aW5nIGVsZW1lbnRzIGluIGFycmF5cywgZS5nLiBbLF0gYW5kXG4gICAgICAgICAgICAgICAgLy8gWyxudWxsXS4gV2UgZG9uJ3QgYWxsb3cgdGhpcyBpbiBKU09ONS5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJNaXNzaW5nIGFycmF5IGVsZW1lbnRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnZhbHVlKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBjb21tYSBhZnRlciB0aGlzIHZhbHVlLCB0aGlzIG5lZWRzIHRvXG4gICAgICAgICAgICAgICAgLy8gYmUgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ10nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJywnKTtcbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBhcnJheVwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBvYmplY3QoKSB7XG5cbiAgICAgICAgLy8gUGFyc2UgYW4gb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBzdGFydCxcbiAgICAgICAgICAgIGlzRmlyc3RQcm9wZXJ0eSA9IHRydWUsXG4gICAgICAgICAgICBvYmplY3QgPSB7fTtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xuICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0gPSB7IHN0YXJ0OiB0aGlzLmF0IC0gMSB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNoID09PSAneycpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgneycpO1xuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmF0IC0gMTtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd9Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDsgICAvLyBQb3RlbnRpYWxseSBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBLZXlzIGNhbiBiZSB1bnF1b3RlZC4gSWYgdGhleSBhcmUsIHRoZXkgbmVlZCB0byBiZVxuICAgICAgICAgICAgICAgIC8vIHZhbGlkIEpTIGlkZW50aWZpZXJzLlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXCInIHx8IHRoaXMuY2ggPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuc3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5pZGVudGlmaWVyKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XSA9IHsgc3RhcnQ6IHN0YXJ0LCB2YWx1ZVN0YXJ0OiB0aGlzLmF0IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnOicpO1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gdGhpcy52YWx1ZSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmF0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZCA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZCA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBjb21tYSBhZnRlciB0aGlzIHBhaXIsIHRoaXMgbmVlZHMgdG8gYmVcbiAgICAgICAgICAgICAgICAvLyB0aGUgZW5kIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kLS07XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdLmVuZCA9IHRoaXMuYXQgLSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnfScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQtLTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0UHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgIGlzRmlyc3RQcm9wZXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgb2JqZWN0XCIpO1xuICAgIH1cbiAgICBwcml2YXRlIHZhbHVlKCk6IGFueSB7XG5cbiAgICAgICAgLy8gUGFyc2UgYSBKU09OIHZhbHVlLiBJdCBjb3VsZCBiZSBhbiBvYmplY3QsIGFuIGFycmF5LCBhIHN0cmluZywgYSBudW1iZXIsXG4gICAgICAgIC8vIG9yIGEgd29yZC5cblxuICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgIHN3aXRjaCAodGhpcy5jaCkge1xuICAgICAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0KCk7XG4gICAgICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xuICAgICAgICAgICAgY2FzZSAnXCInOlxuICAgICAgICAgICAgY2FzZSBcIidcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmcoKTtcbiAgICAgICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5udW1iZXIoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknID8gdGhpcy5udW1iZXIoKSA6IHRoaXMud29yZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXBsYWNlcjogYW55O1xuICAgIHByaXZhdGUgaW5kZW50U3RyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBvYmpTdGFjaztcblxuICAgIHB1YmxpYyBzdHJpbmdpZnkob2JqOiBhbnksIHJlcGxhY2VyOiBhbnkgPSBudWxsLCBzcGFjZTogYW55ID0gbnVsbCkge1xuICAgICAgICBpZiAocmVwbGFjZXIgJiYgKHR5cGVvZiAocmVwbGFjZXIpICE9PSBcImZ1bmN0aW9uXCIgJiYgIXRoaXMuaXNBcnJheShyZXBsYWNlcikpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcGxhY2VyIG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICAgICAgdGhpcy5pbmRlbnRTdHIgPSB0aGlzLmdldEluZGVudChzcGFjZSk7XG4gICAgICAgIHRoaXMub2JqU3RhY2sgPSBbXTtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlLi4ud2hlbiB1bmRlZmluZWQgaXMgdXNlZCBpbnNpZGUgb2ZcbiAgICAgICAgLy8gYSBjb21wb3VuZCBvYmplY3QvYXJyYXksIHJldHVybiBudWxsLlxuICAgICAgICAvLyBidXQgd2hlbiB0b3AtbGV2ZWwsIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgdmFyIHRvcExldmVsSG9sZGVyID0geyBcIlwiOiBvYmogfTtcbiAgICAgICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeSh0b3BMZXZlbEhvbGRlciwgJycsIHRydWUpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEluZGVudChzcGFjZTogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHNwYWNlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNwYWNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwibnVtYmVyXCIgJiYgc3BhY2UgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VJbmRlbnQoXCIgXCIsIHNwYWNlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQoaG9sZGVyOiBhbnksIGtleTogYW55LCBpc1RvcExldmVsOiBib29sZWFuKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIHdpdGggaXRzIHRvSlNPTiB2YWx1ZSBmaXJzdCwgaWYgcG9zc2libGVcbiAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLnRvSlNPTiAmJiB0eXBlb2YgdmFsdWUudG9KU09OID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgdXNlci1zdXBwbGllZCByZXBsYWNlciBpZiBhIGZ1bmN0aW9uLCBjYWxsIGl0LiBJZiBpdCdzIGFuIGFycmF5LCBjaGVjayBvYmplY3RzJyBzdHJpbmcga2V5cyBmb3JcbiAgICAgICAgLy8gcHJlc2VuY2UgaW4gdGhlIGFycmF5IChyZW1vdmluZyB0aGUga2V5L3ZhbHVlIHBhaXIgZnJvbSB0aGUgcmVzdWx0aW5nIEpTT04gaWYgdGhlIGtleSBpcyBtaXNzaW5nKS5cbiAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5yZXBsYWNlcikgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVwbGFjZXIpIHtcbiAgICAgICAgICAgIGlmIChpc1RvcExldmVsIHx8IHRoaXMuaXNBcnJheShob2xkZXIpIHx8IHRoaXMucmVwbGFjZXIuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGlzV29yZENoYXIoY2hhcjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoY2hhciA+PSAnYScgJiYgY2hhciA8PSAneicpIHx8XG4gICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XG4gICAgICAgICAgICAoY2hhciA+PSAnMCcgJiYgY2hhciA8PSAnOScpIHx8XG4gICAgICAgICAgICBjaGFyID09PSAnXycgfHwgY2hhciA9PT0gJyQnO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNXb3JkU3RhcnQoY2hhcjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoY2hhciA+PSAnYScgJiYgY2hhciA8PSAneicpIHx8XG4gICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XG4gICAgICAgICAgICBjaGFyID09PSAnXycgfHwgY2hhciA9PT0gJyQnO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNXb3JkKGtleTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1dvcmRTdGFydChrZXlbMF0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGkgPSAxLCBsZW5ndGggPSBrZXkubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaSA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzV29yZENoYXIoa2V5W2ldKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gcG9seWZpbGxzXG4gICAgcHJpdmF0ZSBpc0FycmF5KG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0RhdGUob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc05hTih2YWw6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgJiYgdmFsICE9PSB2YWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjaGVja0ZvckNpcmN1bGFyKG9iajogYW55KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vYmpTdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMub2JqU3RhY2tbaV0gPT09IG9iaikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgbWFrZUluZGVudChzdHI6IHN0cmluZywgbnVtOiBudW1iZXIsIG5vTmV3TGluZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghc3RyKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbmRlbnRhdGlvbiBubyBtb3JlIHRoYW4gMTAgY2hhcnNcbiAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAxMCkge1xuICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5kZW50ID0gbm9OZXdMaW5lID8gXCJcIiA6IFwiXFxuXCI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICAgIGluZGVudCArPSBzdHI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZW50O1xuICAgIH1cblxuICAgIC8vIENvcGllZCBmcm9tIENyb2tmb3JkJ3MgaW1wbGVtZW50YXRpb24gb2YgSlNPTlxuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvZTM5ZGI0YjdlNjI0OWYwNGExOTVlN2RkMDg0MGU2MTBjYzllOTQxZS9qc29uMi5qcyNMMTk1XG4gICAgLy8gQmVnaW5cbiAgICBwcml2YXRlIHN0YXRpYyBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuICAgIHByaXZhdGUgc3RhdGljIGVzY2FwYWJsZSA9IC9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgcHJpdmF0ZSBzdGF0aWMgbWV0YSA9IHsgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcbiAgICAgICAgJ1xcYic6ICdcXFxcYicsXG4gICAgICAgICdcXHQnOiAnXFxcXHQnLFxuICAgICAgICAnXFxuJzogJ1xcXFxuJyxcbiAgICAgICAgJ1xcZic6ICdcXFxcZicsXG4gICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAnXCInOiAnXFxcXFwiJyxcbiAgICAgICAgJ1xcXFwnOiAnXFxcXFxcXFwnXG4gICAgfTtcbiAgICBwcml2YXRlIGVzY2FwZVN0cmluZyhzdHI6IHN0cmluZykge1xuXG4gICAgICAgIC8vIElmIHRoZSBzdHJpbmcgY29udGFpbnMgbm8gY29udHJvbCBjaGFyYWN0ZXJzLCBubyBxdW90ZSBjaGFyYWN0ZXJzLCBhbmQgbm9cbiAgICAgICAgLy8gYmFja3NsYXNoIGNoYXJhY3RlcnMsIHRoZW4gd2UgY2FuIHNhZmVseSBzbGFwIHNvbWUgcXVvdGVzIGFyb3VuZCBpdC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIG11c3QgYWxzbyByZXBsYWNlIHRoZSBvZmZlbmRpbmcgY2hhcmFjdGVycyB3aXRoIHNhZmUgZXNjYXBlXG4gICAgICAgIC8vIHNlcXVlbmNlcy5cbiAgICAgICAgU3VydmV5SlNPTjUuZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBTdXJ2ZXlKU09ONS5lc2NhcGFibGUudGVzdChzdHIpID8gJ1wiJyArIHN0ci5yZXBsYWNlKFN1cnZleUpTT041LmVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHZhciBjID0gU3VydmV5SlNPTjUubWV0YVthXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgICAgIGMgOlxuICAgICAgICAgICAgJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgIH0pICsgJ1wiJyA6ICdcIicgKyBzdHIgKyAnXCInO1xuICAgIH1cbiAgICAvLyBFbmRcblxuICAgIHByaXZhdGUgaW50ZXJuYWxTdHJpbmdpZnkoaG9sZGVyOiBhbnksIGtleTogYW55LCBpc1RvcExldmVsOiBib29sZWFuKSB7XG4gICAgICAgIHZhciBidWZmZXIsIHJlcztcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSwgaWYgbmVjZXNzYXJ5XG4gICAgICAgIHZhciBvYmpfcGFydCA9IHRoaXMuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKGhvbGRlciwga2V5LCBpc1RvcExldmVsKTtcblxuICAgICAgICBpZiAob2JqX3BhcnQgJiYgIXRoaXMuaXNEYXRlKG9ial9wYXJ0KSkge1xuICAgICAgICAgICAgLy8gdW5ib3ggb2JqZWN0c1xuICAgICAgICAgICAgLy8gZG9uJ3QgdW5ib3ggZGF0ZXMsIHNpbmNlIHdpbGwgdHVybiBpdCBpbnRvIG51bWJlclxuICAgICAgICAgICAgb2JqX3BhcnQgPSBvYmpfcGFydC52YWx1ZU9mKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0eXBlb2Ygb2JqX3BhcnQpIHtcbiAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgICAgICBpZiAoaXNOYU4ob2JqX3BhcnQpIHx8ICFpc0Zpbml0ZShvYmpfcGFydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqX3BhcnQudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVzY2FwZVN0cmluZyhvYmpfcGFydC50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgICAgIGlmIChvYmpfcGFydCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQXJyYXkob2JqX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IFwiW1wiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnB1c2gob2JqX3BhcnQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqX3BhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkob2JqX3BhcnQsIGksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMgPT09IG51bGwgfHwgdHlwZW9mIHJlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIm51bGxcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgb2JqX3BhcnQubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIixcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbmRlbnRTdHIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCJcXG5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCwgdHJ1ZSkgKyBcIl1cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQ2lyY3VsYXIob2JqX3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIntcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vbkVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucHVzaChvYmpfcGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqX3BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmpfcGFydC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkob2JqX3BhcnQsIHByb3AsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RvcExldmVsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbkVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BLZXkgPSB0aGlzLmlzV29yZChwcm9wKSA/IHByb3AgOiB0aGlzLmVzY2FwZVN0cmluZyhwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHByb3BLZXkgKyBcIjpcIiArICh0aGlzLmluZGVudFN0ciA/ICcgJyA6ICcnKSArIHZhbHVlICsgXCIsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub25FbXB0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLCBidWZmZXIubGVuZ3RoIC0gMSkgKyB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKSArIFwifVwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gJ3t9JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbnMgYW5kIHVuZGVmaW5lZCBzaG91bGQgYmUgaWdub3JlZFxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzb241LnRzIiwiaW1wb3J0IHtTdXJ2ZXlKU09ONX0gZnJvbSBcIi4vanNvbjVcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleUVtYmVkaW5nV2luZG93IHtcbiAgICBwcml2YXRlIGpzb25WYWx1ZTogYW55O1xuICAgIHByaXZhdGUgc3VydmV5RW1iZWRpbmdIZWFkOiBBY2VBamF4LkVkaXRvcjtcbiAgICBwcml2YXRlIHN1cnZleUVtYmVkaW5nSmF2YTogQWNlQWpheC5FZGl0b3I7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0JvZHk6IEFjZUFqYXguRWRpdG9yO1xuICAgIGtvSGVhZFRleHQ6IGFueTtcbiAgICBrb0JvZHlUZXh0OiBhbnk7XG4gICAga29KYXZhVGV4dDogYW55O1xuICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBnZW5lcmF0ZVZhbGlkSlNPTjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGtvU2hvd0FzV2luZG93OiBhbnk7XG4gICAga29TY3JpcHRVc2luZzogYW55O1xuICAgIGtvSGFzSWRzOiBhbnk7XG4gICAga29Mb2FkU3VydmV5OiBhbnk7XG4gICAga29MaWJyYXJ5VmVyc2lvbjogYW55O1xuICAgIGtvVmlzaWJsZUh0bWw6IGFueTtcbiAgICBwcml2YXRlIHBsYXRmb3JtSGVhZGVycyA9IHtcbiAgICAgICAgXCJhbmd1bGFyXCI6IFwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XFxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gJ3N1cnZleS1hbmd1bGFyJztcIixcbiAgICAgICAgXCJqcXVlcnlcIjogXCI8c2NyaXB0IHNyYz1cXFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvanF1ZXJ5LzMuMS4xL2pxdWVyeS5taW4uanNcXFwiPjwvc2NyaXB0PlxcbjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkuanF1ZXJ5Lm1pbi5qc1xcXCI+PC9zY3JpcHQ+XCIsXG4gICAgICAgIFwia25vY2tvdXRcIjogXCI8c2NyaXB0IHNyYz1cXFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXFxcIj48L3NjcmlwdD5cXG48c2NyaXB0IHNyYz1cXFwianMvc3VydmV5LmtvLm1pbi5qc1xcXCI+PC9zY3JpcHQ+XCIsXG4gICAgICAgIFwicmVhY3RcIjogXCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tICdzdXJ2ZXktcmVhY3QnO1wiXG4gICAgfTtcbiAgICBwcml2YXRlIHBsYXRmb3JtSlNvblBhZ2UgPSB7XG4gICAgICAgIFwiYW5ndWxhclwiOiBcIkBDb21wb25lbnQoe1xcbiAgc2VsZWN0b3I6ICduZy1hcHAnLFxcbiAgICAgICAgdGVtcGxhdGU6IFxcbiAgICAgICAgPGRpdiBpZD0nc3VydmV5RWxlbWVudCc+PC9kaXY+XFxcIixcXG59KVxcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQge1xcbiAgICBuZ09uSW5pdCgpIHtcXG4gICAgICAgIHZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5Lk1vZGVsKHN1cnZleUpTT04pO1xcbiAgICAgICAgc3VydmV5Lm9uQ29tcGxldGUuYWRkKHNlbmREYXRhVG9TZXJ2ZXIpO1xcbiAgICAgICBTdXJ2ZXkuU3VydmV5TkcucmVuZGVyKFxcXCJzdXJ2ZXlFbGVtZW50XFxcIiwgeyBtb2RlbDogc3VydmV5IH0pO1xcbiAgICB9XFxufVwiLFxuICAgICAgICBcImpxdWVyeVwiOiBcInZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5Lk1vZGVsKHN1cnZleUpTT04pO1xcbiQoXFxcIiNzdXJ2ZXlDb250YWluZXJcXFwiKS5TdXJ2ZXkoe1xcbiAgICBtb2RlbDogc3VydmV5LFxcbiAgICBvbkNvbXBsZXRlOiBzZW5kRGF0YVRvU2VydmVyXFxufSk7XCIsXG4gICAgICAgIFwia25vY2tvdXRcIjogXCJ2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5Nb2RlbChzdXJ2ZXlKU09OLCBcXFwic3VydmV5Q29udGFpbmVyXFxcIik7XFxuc3VydmV5Lm9uQ29tcGxldGUuYWRkKHNlbmREYXRhVG9TZXJ2ZXIpO1wiLFxuICAgICAgICBcInJlYWN0XCI6IFwiUmVhY3RET00ucmVuZGVyKFxcbiAgICA8U3VydmV5LlN1cnZleSBqc29uPXsgc3VydmV5SlNPTiB9IG9uQ29tcGxldGU9eyBzZW5kRGF0YVRvU2VydmVyIH0gLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzdXJ2ZXlDb250YWluZXJcXFwiKSk7XCJcbiAgICB9O1xuICAgIHByaXZhdGUgcGxhdGZvcm1KU29uV2luZG93ID0ge1xuICAgICAgICBcImFuZ3VsYXJcIjogXCJAQ29tcG9uZW50KHtcXG4gIHNlbGVjdG9yOiAnbmctYXBwJyxcXG4gICAgICAgIHRlbXBsYXRlOiBcXG4gICAgICAgIDxkaXYgaWQ9J3N1cnZleUVsZW1lbnQnPjwvZGl2PlxcXCIsXFxufSlcXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcXG4gICAgbmdPbkluaXQoKSB7XFxuICAgICAgICB2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5Nb2RlbChzdXJ2ZXlKU09OKTtcXG4gICAgICAgIHN1cnZleS5vbkNvbXBsZXRlLmFkZChzZW5kRGF0YVRvU2VydmVyKTtcXG4gICAgICAgU3VydmV5LlN1cnZleVdpbmRvd05HLnJlbmRlcihcXFwic3VydmV5RWxlbWVudFxcXCIsIHsgbW9kZWw6IHN1cnZleSB9KTtcXG4gICAgfVxcbn1cIixcbiAgICAgICAgXCJqcXVlcnlcIjogXCJ2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5Nb2RlbChzdXJ2ZXlKU09OKTtcXG4kKFxcXCIjc3VydmV5Q29udGFpbmVyXFxcIikuU3VydmV5V2luZG93KHtcXG4gICAgbW9kZWw6IHN1cnZleSxcXG4gICAgb25Db21wbGV0ZTogc2VuZERhdGFUb1NlcnZlclxcbn0pO1wiLFxuICAgICAgICBcImtub2Nrb3V0XCI6IFwidmFyIHN1cnZleSA9IG5ldyBTdXJ2ZXkuTW9kZWwoc3VydmV5SlNPTik7XFxuc3VydmV5V2luZG93LnNob3coKTtcXG5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoc2VuZERhdGFUb1NlcnZlcik7XCIsXG4gICAgICAgIFwicmVhY3RcIjogXCJSZWFjdERPTS5yZW5kZXIoXFxuICAgIDxTdXJ2ZXkuU3VydmV5V2luZG93IGpzb249eyBzdXJ2ZXlKU09OIH0gb25Db21wbGV0ZT17IHNlbmREYXRhVG9TZXJ2ZXIgfSAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInN1cnZleUNvbnRhaW5lclxcXCIpKTtcIlxuICAgIH07XG4gICAgcHJpdmF0ZSBwbGF0Zm9ybUh0bWxvblBhZ2UgPSB7XG4gICAgICAgIFwiYW5ndWxhclwiOiBcIjxuZy1hcHA+PC9uZy1hcHA+XCIsXG4gICAgICAgIFwianF1ZXJ5XCI6IFwiPGRpdiBpZD1cXFwic3VydmV5Q29udGFpbmVyXFxcIj48L2Rpdj5cIixcbiAgICAgICAgXCJrbm9ja291dFwiOiBcIjxkaXYgaWQ9XFxcInN1cnZleUNvbnRhaW5lclxcXCI+PC9kaXY+XCIsXG4gICAgICAgIFwicmVhY3RcIjogXCI8ZGl2IGlkPVxcXCJzdXJ2ZXlDb250YWluZXJcXFwiPjwvZGl2PlwiXG4gICAgfTtcbiAgICBwcml2YXRlIHBsYXRmb3JtSHRtbG9uV2luZG93ID0ge1xuICAgICAgICBcImFuZ3VsYXJcIjogXCI8bmctYXBwPjwvbmctYXBwPlwiLFxuICAgICAgICBcImpxdWVyeVwiOiBcIjxkaXYgaWQ9XFxcInN1cnZleUNvbnRhaW5lclxcXCI+PC9kaXY+XCIsXG4gICAgICAgIFwia25vY2tvdXRcIjogXCJcIixcbiAgICAgICAgXCJyZWFjdFwiOiBcIjxkaXYgaWQ9XFxcInN1cnZleUNvbnRhaW5lclxcXCI+PC9kaXY+XCJcbiAgICB9O1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29MaWJyYXJ5VmVyc2lvbiA9IGtvLm9ic2VydmFibGUoXCJqcXVlcnlcIik7XG4gICAgICAgIHRoaXMua29TaG93QXNXaW5kb3cgPSBrby5vYnNlcnZhYmxlKFwicGFnZVwiKTtcbiAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nID0ga28ub2JzZXJ2YWJsZShcImJvb3RzdHJhcFwiKTtcbiAgICAgICAgdGhpcy5rb0hhc0lkcyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLmtvTG9hZFN1cnZleSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuXG4gICAgICAgIHRoaXMua29IZWFkVGV4dCA9IGtvLm9ic2VydmFibGUoXCJcIik7XG4gICAgICAgIHRoaXMua29KYXZhVGV4dCA9IGtvLm9ic2VydmFibGUoXCJcIik7XG4gICAgICAgIHRoaXMua29Cb2R5VGV4dCA9IGtvLm9ic2VydmFibGUoXCJcIik7XG5cbiAgICAgICAgdGhpcy5rb1Zpc2libGVIdG1sID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5rb1Nob3dBc1dpbmRvdygpID09IFwicGFnZVwiIHx8IHNlbGYucGxhdGZvcm1IdG1sb25XaW5kb3dbc2VsZi5rb0xpYnJhcnlWZXJzaW9uKCldICE9IFwiXCI7IH0pO1xuICAgICAgICB0aGlzLmtvTGlicmFyeVZlcnNpb24uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNldEhlYWRUZXh0KCk7IHNlbGYuc2V0SmF2YVRlc3QoKTsgc2VsZi5zZXRCb2R5VGV4dCgpOyB9KTtcbiAgICAgICAgdGhpcy5rb1Nob3dBc1dpbmRvdy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2V0SmF2YVRlc3QoKTsgc2VsZi5zZXRCb2R5VGV4dCgpOyB9KTtcbiAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRIZWFkVGV4dCgpOyBzZWxmLnNldEphdmFUZXN0KCk7IH0pO1xuICAgICAgICB0aGlzLmtvTG9hZFN1cnZleS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2V0SmF2YVRlc3QoKTsgfSk7XG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID0gbnVsbDtcbiAgICB9XG4gICAgcHVibGljIGdldCBqc29uKCk6IGFueSB7IHJldHVybiB0aGlzLmpzb25WYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQganNvbih2YWx1ZTogYW55KSB7IHRoaXMuanNvblZhbHVlID0gdmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0IGhhc0FjZUVkaXRvcigpOiBib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBhY2UgIT09IFwidW5kZWZpbmVkXCI7IH1cbiAgICBwdWJsaWMgc2hvdygpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQWNlRWRpdG9yICYmIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID0gdGhpcy5jcmVhdGVFZGl0b3IoXCJzdXJ2ZXlFbWJlZGluZ0hlYWRcIik7XG4gICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nQm9keSA9IHRoaXMuY3JlYXRlRWRpdG9yKFwic3VydmV5RW1iZWRpbmdCb2R5XCIpO1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSmF2YVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvSGFzSWRzKHRoaXMuc3VydmV5SWQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpO1xuICAgICAgICB0aGlzLnNldEJvZHlUZXh0KCk7XG4gICAgICAgIHRoaXMuc2V0SGVhZFRleHQoKTtcbiAgICAgICAgdGhpcy5zZXRKYXZhVGVzdCgpO1xuICAgIH1cbiAgICBwcml2YXRlIHNldEJvZHlUZXh0KCkge1xuICAgICAgICB0aGlzLnNldFRleHRUb0VkaXRvcih0aGlzLnN1cnZleUVtYmVkaW5nQm9keSwgdGhpcy5rb0JvZHlUZXh0LCB0aGlzLnBsYXRmb3JtSHRtbG9uUGFnZVt0aGlzLmtvTGlicmFyeVZlcnNpb24oKV0pO1xuICAgIH1cbiAgICBwcml2YXRlIHNldEhlYWRUZXh0KCkge1xuICAgICAgICB2YXIgc3RyID0gdGhpcy5wbGF0Zm9ybUhlYWRlcnNbdGhpcy5rb0xpYnJhcnlWZXJzaW9uKCldO1xuICAgICAgICBpZiAodGhpcy5rb1NjcmlwdFVzaW5nKCkgIT0gXCJib290c3RyYXBcIikge1xuICAgICAgICAgICAgc3RyICs9IFwiXFxuPGxpbmsgaHJlZj1cXFwiY3NzL3N1cnZleS5jc3NcXFwiIHR5cGU9XFxcInRleHQvY3NzXFxcIiByZWw9XFxcInN0eWxlc2hlZXRcXFwiIC8+XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQsIHRoaXMua29IZWFkVGV4dCwgc3RyKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzZXRKYXZhVGVzdCgpIHtcbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEsIHRoaXMua29KYXZhVGV4dCwgdGhpcy5nZXRKYXZhVGV4dCgpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVFZGl0b3IoZWxlbWVudE5hbWU6IHN0cmluZyk6IEFjZUFqYXguRWRpdG9yIHtcbiAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnROYW1lKTtcbiAgICAgICAgZWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL21vbm9rYWlcIik7XG4gICAgICAgIGVkaXRvci5zZXNzaW9uLnNldE1vZGUoXCJhY2UvbW9kZS9qc29uXCIpO1xuICAgICAgICBlZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcbiAgICAgICAgZWRpdG9yLnJlbmRlcmVyLnNldFNob3dHdXR0ZXIoZmFsc2UpO1xuICAgICAgICBlZGl0b3Iuc2V0UmVhZE9ubHkodHJ1ZSk7XG4gICAgICAgIHJldHVybiBlZGl0b3I7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0SmF2YVRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGlzT25QYWdlID0gdGhpcy5rb1Nob3dBc1dpbmRvdygpID09IFwicGFnZVwiO1xuICAgICAgICB2YXIgc3RyID0gdGhpcy5nZXRTYXZlRnVuYygpICsgXCJcXG5cXG5cIjtcbiAgICAgICAgc3RyICs9IGlzT25QYWdlID8gdGhpcy5wbGF0Zm9ybUpTb25QYWdlW3RoaXMua29MaWJyYXJ5VmVyc2lvbigpXSA6IHRoaXMucGxhdGZvcm1KU29uV2luZG93W3RoaXMua29MaWJyYXJ5VmVyc2lvbigpXTtcbiAgICAgICAgdmFyIGpzb25UZXh0ID0gXCJ2YXIgc3VydmV5SlNPTiA9IFwiICsgdGhpcy5nZXRKc29uVGV4dCgpICsgXCJcXG5cXG5cIjtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2V0Q3NzKCkgKyBcIlxcblwiICsganNvblRleHQgKyBzdHI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2V0Q3NzKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmtvU2NyaXB0VXNpbmcoKSAhPSBcImJvb3RzdHJhcFwiKSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIFwiU3VydmV5LlN1cnZleS5jc3NUeXBlID0gXFxcImJvb3RzdHJhcFxcXCI7XFxuXCI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2F2ZUZ1bmMoKSB7XG4gICAgICAgIHJldHVybiBcImZ1bmN0aW9uIHNlbmREYXRhVG9TZXJ2ZXIoc3VydmV5KSB7XFxuXCIgKyB0aGlzLmdldFNhdmVGdW5jQ29kZSgpICsgXCJcXG59XCI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2F2ZUZ1bmNDb2RlKCkge1xuICAgICAgICBpZiAodGhpcy5rb0hhc0lkcygpKSByZXR1cm4gXCIgICAgc3VydmV5LnNlbmRSZXN1bHQoJ1wiICsgdGhpcy5zdXJ2ZXlQb3N0SWQgKyBcIicpO1wiO1xuICAgICAgICByZXR1cm4gXCIgICAgLy9zZW5kIEFqYXggcmVxdWVzdCB0byB5b3VyIHdlYiBzZXJ2ZXIuXFxuICAgIGFsZXJ0KFxcXCJUaGUgcmVzdWx0cyBhcmU6XFxcIiArIEpTT04uc3RyaW5naWZ5KHMuZGF0YSkpO1wiO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEpzb25UZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmtvSGFzSWRzKCkgJiYgdGhpcy5rb0xvYWRTdXJ2ZXkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwieyBzdXJ2ZXlJZDogJ1wiICsgdGhpcy5zdXJ2ZXlJZCArIFwiJ31cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZVZhbGlkSlNPTikgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuanNvbik7XG4gICAgICAgIHJldHVybiBuZXcgU3VydmV5SlNPTjUoKS5zdHJpbmdpZnkodGhpcy5qc29uKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzZXRUZXh0VG9FZGl0b3IoZWRpdG9yOiBBY2VBamF4LkVkaXRvciwga29UZXh0OiBhbnksIHRleHQ6IHN0cmluZykge1xuICAgICAgICBpZiAoZWRpdG9yKSBlZGl0b3Iuc2V0VmFsdWUodGV4dCk7XG4gICAgICAgIGlmIChrb1RleHQpIGtvVGV4dCh0ZXh0KTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N1cnZleUVtYmVkaW5nV2luZG93LnRzIiwiaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0IHtTdXJ2ZXlIZWxwZXIsIE9ialR5cGV9IGZyb20gXCIuL3N1cnZleUhlbHBlclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJzIHtcbiAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuICAgIHByaXZhdGUgb2JqVmFsdWU6IGFueTtcbiAgICBwcml2YXRlIGNob2ljZXNDbGFzc2VzOiBBcnJheTxzdHJpbmc+O1xuICAgIGtvVmVyYnM6IGFueTtcbiAgICBrb0hhc1ZlcmJzOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHVibGljIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XG4gICAgICAgIHRoaXMua29WZXJicyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB0aGlzLmtvSGFzVmVyYnMgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5jaG9pY2VzQ2xhc3NlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc0NsYXNzZXMucHVzaChjbGFzc2VzW2ldLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgb2JqKCk6IGFueSB7IHJldHVybiB0aGlzLm9ialZhbHVlIH1cbiAgICBwdWJsaWMgc2V0IG9iaih2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLm9ialZhbHVlID09IHZhbHVlKSByZXR1cm47XG4gICAgICAgIHRoaXMub2JqVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5idWlsZFZlcmJzKCk7XG4gICAgfVxuICAgIHByaXZhdGUgYnVpbGRWZXJicygpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUodGhpcy5vYmopO1xuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uQmFzZT50aGlzLm9iajtcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbiwgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXNDbGFzc2VzLmluZGV4T2YocXVlc3Rpb24uZ2V0VHlwZSgpKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbiwgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvVmVyYnMoYXJyYXkpO1xuICAgICAgICB0aGlzLmtvSGFzVmVyYnMoYXJyYXkubGVuZ3RoID4gMCk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJJdGVtIHtcbiAgICBrb0l0ZW1zOiBhbnk7XG4gICAga29TZWxlY3RlZEl0ZW06IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueSkge1xuICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtIGV4dGVuZHMgU3VydmV5VmVyYkl0ZW0ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XG4gICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24sIG9uTW9kaWZpZWRDYWxsYmFjayk7XG4gICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBjbGFzc2VzW2ldLm5hbWUsIHRleHQ6IGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJxdC5cIiArIGNsYXNzZXNbaV0ubmFtZSkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbShxdWVzdGlvbi5nZXRUeXBlKCkpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVR5cGUobmV3VmFsdWUpOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudmVyYkNoYW5nZVR5cGVcIik7IH1cbiAgICBwcml2YXRlIGNoYW5nZVR5cGUocXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSA9PSB0aGlzLnF1ZXN0aW9uLmdldFR5cGUoKSkgcmV0dXJuO1xuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB2YXIgbmV3UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgdGhpcy5xdWVzdGlvbi5uYW1lKTtcbiAgICAgICAgdmFyIGpzb25PYmogPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKTtcbiAgICAgICAgdmFyIGpzb24gPSBqc29uT2JqLnRvSnNvbk9iamVjdCh0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAganNvbk9iai50b09iamVjdChqc29uLCBuZXdRdWVzdGlvbik7XG4gICAgICAgIHBhZ2UucmVtb3ZlUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24obmV3UXVlc3Rpb24sIGluZGV4KTtcbiAgICAgICAgaWYgKHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaygpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiQ2hhbmdlUGFnZUl0ZW0gZXh0ZW5kcyBTdXJ2ZXlWZXJiSXRlbSB7XG4gICAgcHJpdmF0ZSBwcmV2UGFnZTogU3VydmV5LlBhZ2U7XG4gICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBwdWJsaWMgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnkpIHtcbiAgICAgICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbiwgb25Nb2RpZmllZENhbGxiYWNrKTtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkucGFnZXNbaV07XG4gICAgICAgICAgICBhcnJheS5wdXNoKHsgdmFsdWU6IHBhZ2UsIHRleHQ6IFN1cnZleUhlbHBlci5nZXRPYmplY3ROYW1lKHBhZ2UpIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XG4gICAgICAgIHRoaXMucHJldlBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24ocXVlc3Rpb24pO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtKHRoaXMucHJldlBhZ2UpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVBhZ2UobmV3VmFsdWUpOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudmVyYkNoYW5nZVBhZ2VcIik7IH1cbiAgICBwcml2YXRlIGNoYW5nZVBhZ2UobmV3UGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgaWYgKG5ld1BhZ2UgPT0gbnVsbCB8fCBuZXdQYWdlID09IHRoaXMucHJldlBhZ2UpIHJldHVybjtcbiAgICAgICAgdGhpcy5wcmV2UGFnZS5yZW1vdmVRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgbmV3UGFnZS5hZGRRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaygpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb2JqZWN0VmVyYnMudHMiLCJpbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5VW5kb1JlZG8ge1xuICAgIHByaXZhdGUgaXRlbXM6IEFycmF5PFVuZG9SZWRvSXRlbT47XG4gICAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIGtvQ2FuVW5kbzogYW55OyBrb0NhblJlZG86IGFueTtcbiAgICBwdWJsaWMgbWF4aW11bUNvdW50OiBudW1iZXIgPSAxMDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLmtvQ2FuVW5kbyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLmtvQ2FuUmVkbyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIH1cbiAgICBwdWJsaWMgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5rb0NhblVuZG8oZmFsc2UpO1xuICAgICAgICB0aGlzLmtvQ2FuUmVkbyhmYWxzZSk7XG4gICAgfVxuICAgIHB1YmxpYyBzZXRDdXJyZW50KHN1cnZleTogU3VydmV5LlN1cnZleSwgc2VsZWN0ZWRPYmpOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgVW5kb1JlZG9JdGVtKCk7XG4gICAgICAgIGl0ZW0uc3VydmV5SlNPTiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChzdXJ2ZXkpO1xuICAgICAgICBpdGVtLnNlbGVjdGVkT2JqTmFtZSA9IHNlbGVjdGVkT2JqTmFtZTtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIHRoaXMucmVtb3ZlT2xkRGF0YSgpO1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xuICAgICAgICB0aGlzLnVwZGF0ZUNhblVuZG9SZWRvKCk7XG4gICAgfVxuICAgIHB1YmxpYyB1bmRvKCk6IFVuZG9SZWRvSXRlbSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5VbmRvKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9VbmRvUmVkbygtMSk7XG4gICAgfVxuICAgIHB1YmxpYyByZWRvKCk6IFVuZG9SZWRvSXRlbSAge1xuICAgICAgICBpZiAoIXRoaXMuY2FuUmVkbykgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLmRvVW5kb1JlZG8oMSk7XG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlQ2FuVW5kb1JlZG8oKSB7XG4gICAgICAgIHRoaXMua29DYW5VbmRvKHRoaXMuY2FuVW5kbyk7XG4gICAgICAgIHRoaXMua29DYW5SZWRvKHRoaXMuY2FuUmVkbyk7XG4gICAgfVxuICAgIHByaXZhdGUgZG9VbmRvUmVkbyhkSW5kZXg6IG51bWJlcik6IFVuZG9SZWRvSXRlbSB7XG4gICAgICAgIHRoaXMuaW5kZXggKz0gZEluZGV4O1xuICAgICAgICB0aGlzLnVwZGF0ZUNhblVuZG9SZWRvKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ID49IDAgJiYgdGhpcy5pbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoID8gdGhpcy5pdGVtc1t0aGlzLmluZGV4XSA6IG51bGw7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXQgY2FuVW5kbygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gMSAmJiB0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXQgY2FuUmVkbygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoID4gMSAmJiB0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xuICAgIH1cbiAgICBwcml2YXRlIHJlbW92ZU9sZERhdGEoKSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCAtIDEgPCB0aGlzLm1heGltdW1Db3VudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLml0ZW1zLnNwbGljZSgwLCB0aGlzLml0ZW1zLmxlbmd0aCAtIHRoaXMubWF4aW11bUNvdW50IC0gMSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5kb1JlZG9JdGVtIHtcbiAgICBzdXJ2ZXlKU09OOiBhbnk7XG4gICAgc2VsZWN0ZWRPYmpOYW1lOiBzdHJpbmc7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3VuZG9yZWRvLnRzIiwiaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xyXG5pbXBvcnQge1N1cnZleU9iamVjdEVkaXRvcn0gZnJvbSBcIi4vb2JqZWN0RWRpdG9yXCI7XHJcbmltcG9ydCB7U3VydmV5UGFnZXNFZGl0b3J9IGZyb20gXCIuL3BhZ2VzRWRpdG9yXCI7XHJcbmltcG9ydCB7U3VydmV5RW1iZWRpbmdXaW5kb3d9IGZyb20gXCIuL3N1cnZleUVtYmVkaW5nV2luZG93XCI7XHJcbmltcG9ydCB7U3VydmV5T2JqZWN0c30gZnJvbSBcIi4vc3VydmV5T2JqZWN0c1wiO1xyXG5pbXBvcnQge1N1cnZleVZlcmJzfSBmcm9tIFwiLi9vYmplY3RWZXJic1wiO1xyXG5pbXBvcnQge1N1cnZleUpTT05FZGl0b3J9IGZyb20gXCIuL3N1cnZleUpTT05FZGl0b3JcIjtcclxuaW1wb3J0IHtTdXJ2ZXlUZXh0V29ya2VyfSBmcm9tIFwiLi90ZXh0V29ya2VyXCJcclxuaW1wb3J0IHtTdXJ2ZXlVbmRvUmVkbywgVW5kb1JlZG9JdGVtfSBmcm9tIFwiLi91bmRvcmVkb1wiO1xyXG5pbXBvcnQge1N1cnZleUhlbHBlciwgT2JqVHlwZX0gZnJvbSBcIi4vc3VydmV5SGVscGVyXCI7XHJcbmltcG9ydCB7RHJhZ0Ryb3BIZWxwZXJ9IGZyb20gXCIuL2RyYWdkcm9waGVscGVyXCI7XHJcbmltcG9ydCB7U3VydmV5SlNPTjV9IGZyb20gXCIuL2pzb241XCI7XHJcbmltcG9ydCB7aHRtbCBhcyB0ZW1wbGF0ZUVkaXRvckh0bWx9IGZyb20gXCIuL3RlbXBsYXRlRWRpdG9yLmtvLmh0bWxcIjtcclxuaW1wb3J0IHtodG1sIGFzIHRlbXBsYXRlUGFnZUh0bWx9IGZyb20gXCIuL3RlbXBsYXRlX3BhZ2UuaHRtbFwiO1xyXG5pbXBvcnQge2h0bWwgYXMgdGVtcGxhdGVRdWVzdGlvbkh0bWx9IGZyb20gXCIuL3RlbXBsYXRlX3F1ZXN0aW9uLmh0bWxcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgcHVibGljIHN0YXRpYyBkZWZhdWx0TmV3U3VydmV5VGV4dDogc3RyaW5nID0gXCJ7IHBhZ2VzOiBbIHsgbmFtZTogJ3BhZ2UxJ31dIH1cIjtcclxuICAgIHByaXZhdGUgcmVuZGVyZWRFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgc3VydmV5anM6IEhUTUxFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlqc0V4YW1wbGU6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUganNvbkVkaXRvcjogU3VydmV5SlNPTkVkaXRvcjtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RFZGl0b3I6IFN1cnZleU9iamVjdEVkaXRvcjtcclxuICAgIHByaXZhdGUgcGFnZXNFZGl0b3I6IFN1cnZleVBhZ2VzRWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZzogU3VydmV5RW1iZWRpbmdXaW5kb3c7XHJcbiAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IFN1cnZleU9iamVjdHM7XHJcbiAgICBwcml2YXRlIHN1cnZleVZlcmJzOiBTdXJ2ZXlWZXJicztcclxuICAgIHByaXZhdGUgdW5kb1JlZG86IFN1cnZleVVuZG9SZWRvO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcclxuICAgIHByaXZhdGUgc2F2ZVN1cnZleUZ1bmNWYWx1ZTogKG5vOiBudW1iZXIsIG9uU2F2ZUNhbGxiYWNrOiAobm86IG51bWJlciwgaXNTdWNjZXNzOiBib29sZWFuKSA9PiB2b2lkKSA9PiB2b2lkO1xyXG4gICAgcHJpdmF0ZSBvcHRpb25zOiBhbnk7XHJcbiAgICBwcml2YXRlIHN0YXRlVmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBwcml2YXRlIGRyYWdEcm9wSGVscGVyOiBEcmFnRHJvcEhlbHBlciA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNob3dKU09ORWRpdG9yVGFiVmFsdWU6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIHNob3dUZXN0U3VydmV5VGFiVmFsdWU6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIHNob3dFbWJlZGVkU3VydmV5VGFiVmFsdWU6IGJvb2xlYW47XHJcblxyXG4gICAgcHVibGljIHN1cnZleUlkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIHN1cnZleVBvc3RJZDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBxdWVzdGlvblR5cGVzOiBzdHJpbmdbXTtcclxuICAgIHB1YmxpYyBrb0NvcGllZFF1ZXN0aW9uczogYW55O1xyXG4gICAgcHVibGljIGdlbmVyYXRlVmFsaWRKU09OQ2hhbmdlZENhbGxiYWNrOiAoZ2VuZXJhdGVWYWxpZEpTT046IGJvb2xlYW4pID0+IHZvaWQ7XHJcbiAgICBwdWJsaWMgYWx3YXlTYXZlVGV4dEluUHJvcGVydHlFZGl0b3JzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgb25DYW5TaG93UHJvcGVydHk6IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcblxyXG4gICAga29Jc1Nob3dEZXNpZ25lcjogYW55O1xyXG4gICAga29WaWV3VHlwZTogYW55O1xyXG4gICAga29DYW5EZWxldGVPYmplY3Q6IGFueTtcclxuICAgIGtvT2JqZWN0czogYW55OyBrb1NlbGVjdGVkT2JqZWN0OiBhbnk7XHJcbiAgICBrb1Nob3dTYXZlQnV0dG9uOiBhbnk7XHJcbiAgICBrb0dlbmVyYXRlVmFsaWRKU09OOiBhbnk7IGtvU2hvd09wdGlvbnM6IGFueTsga29UZXN0U3VydmV5V2lkdGg6IGFueTtcclxuICAgIHNlbGVjdERlc2lnbmVyQ2xpY2s6IGFueTsgc2VsZWN0RWRpdG9yQ2xpY2s6IGFueTsgc2VsZWN0VGVzdENsaWNrOiBhbnk7IHNlbGVjdEVtYmVkQ2xpY2s6IGFueTtcclxuICAgIGdlbmVyYXRlVmFsaWRKU09OQ2xpY2s6IGFueTsgZ2VuZXJhdGVSZWFkYWJsZUpTT05DbGljazogYW55O1xyXG4gICAgZG9VbmRvQ2xpY2s6IGFueTsgZG9SZWRvQ2xpY2s6IGFueTtcclxuICAgIGRlbGV0ZU9iamVjdENsaWNrOiBhbnk7XHJcbiAgICBrb1N0YXRlOiBhbnk7XHJcbiAgICBydW5TdXJ2ZXlDbGljazogYW55OyBlbWJlZGluZ1N1cnZleUNsaWNrOiBhbnk7XHJcbiAgICBzYXZlQnV0dG9uQ2xpY2s6IGFueTtcclxuICAgIGRyYWdnaW5nUXVlc3Rpb246IGFueTsgY2xpY2tRdWVzdGlvbjogYW55O1xyXG4gICAgZHJhZ2dpbmdDb3BpZWRRdWVzdGlvbjogYW55OyBjbGlja0NvcGllZFF1ZXN0aW9uOiBhbnk7XHJcbiAgICBkcmFnRW5kOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsLCBvcHRpb25zOiBhbnkgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMua29TaG93T3B0aW9ucyA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvR2VuZXJhdGVWYWxpZEpTT04gPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMua29Db3BpZWRRdWVzdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmtvQ2FuRGVsZXRlT2JqZWN0ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcblxyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5rb1N0YXRlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29TaG93U2F2ZUJ1dHRvbiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMua29UZXN0U3VydmV5V2lkdGggPSBrby5vYnNlcnZhYmxlKFwiMTAwJVwiKTtcclxuICAgICAgICB0aGlzLnNhdmVCdXR0b25DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kb1NhdmUoKTsgfTtcclxuICAgICAgICB0aGlzLmtvT2JqZWN0cyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZE9iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRPYmplY3Quc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNlbGVjdGVkT2JqZWN0Q2hhbmdlZChuZXdWYWx1ZSAhPSBudWxsID8gbmV3VmFsdWUudmFsdWUgOiBudWxsKTsgfSk7XHJcbiAgICAgICAgdGhpcy5rb0dlbmVyYXRlVmFsaWRKU09OLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKCFzZWxmLm9wdGlvbnMpIHNlbGYub3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBzZWxmLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT04gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHNlbGYuZ2VuZXJhdGVWYWxpZEpTT05DaGFuZ2VkQ2FsbGJhY2spIHNlbGYuZ2VuZXJhdGVWYWxpZEpTT05DaGFuZ2VkQ2FsbGJhY2sobmV3VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cyA9IG5ldyBTdXJ2ZXlPYmplY3RzKHRoaXMua29PYmplY3RzLCB0aGlzLmtvU2VsZWN0ZWRPYmplY3QpO1xyXG4gICAgICAgIHRoaXMudW5kb1JlZG8gPSBuZXcgU3VydmV5VW5kb1JlZG8oKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWZXJicyA9IG5ldyBTdXJ2ZXlWZXJicyhmdW5jdGlvbiAoKSB7IHNlbGYuc2V0TW9kaWZpZWQoKTsgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IgPSBuZXcgU3VydmV5T2JqZWN0RWRpdG9yKHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrID0gZnVuY3Rpb24gKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vbkNhblNob3dPYmplY3RQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgIHNlbGYub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChvcHRpb25zLnByb3BlcnR5LCBvcHRpb25zLm9iamVjdCwgb3B0aW9ucy5uZXdWYWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wYWdlc0VkaXRvciA9IG5ldyBTdXJ2ZXlQYWdlc0VkaXRvcigoKSA9PiB7IHNlbGYuYWRkUGFnZSgpOyB9LCAocGFnZTogU3VydmV5LlBhZ2UpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChwYWdlKTsgfSxcclxuICAgICAgICAgICAgKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpID0+IHsgc2VsZi5tb3ZlUGFnZShpbmRleEZyb20sIGluZGV4VG8pOyB9LCAocGFnZTogU3VydmV5LlBhZ2UpID0+IHsgc2VsZi5kZWxldGVDdXJyZW50T2JqZWN0KCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcgPSBuZXcgU3VydmV5RW1iZWRpbmdXaW5kb3coKTtcclxuXHJcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlID0ga28ub2JzZXJ2YWJsZShcImRlc2lnbmVyXCIpO1xyXG4gICAgICAgIHRoaXMua29Jc1Nob3dEZXNpZ25lciA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYua29WaWV3VHlwZSgpID09IFwiZGVzaWduZXJcIjsgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REZXNpZ25lckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dEZXNpZ25lcigpOyB9O1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RWRpdG9yQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0pzb25FZGl0b3IoKTsgfTtcclxuICAgICAgICB0aGlzLnNlbGVjdFRlc3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93VGVzdFN1cnZleSgpOyB9O1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RW1iZWRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93RW1iZWRFZGl0b3IoKTsgfTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlVmFsaWRKU09OQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29HZW5lcmF0ZVZhbGlkSlNPTih0cnVlKTsgfTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlUmVhZGFibGVKU09OQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29HZW5lcmF0ZVZhbGlkSlNPTihmYWxzZSk7IH07XHJcbiAgICAgICAgdGhpcy5ydW5TdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93TGl2ZVN1cnZleSgpOyB9O1xyXG4gICAgICAgIHRoaXMuZW1iZWRpbmdTdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93U3VydmV5RW1iZWRpbmcoKTsgfTtcclxuICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUN1cnJlbnRPYmplY3QoKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdnaW5nUXVlc3Rpb24gPSBmdW5jdGlvbiAocXVlc3Rpb25UeXBlLCBlKSB7IHNlbGYuZG9EcmFnZ2luZ1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgZSk7IH07XHJcbiAgICAgICAgdGhpcy5jbGlja1F1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9uVHlwZSkgeyBzZWxmLmRvQ2xpY2tRdWVzdGlvbihxdWVzdGlvblR5cGUpOyB9O1xyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmdDb3BpZWRRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtLCBlKSB7IHNlbGYuZG9EcmFnZ2luZ0NvcGllZFF1ZXN0aW9uKGl0ZW0uanNvbiwgZSk7IH07XHJcbiAgICAgICAgdGhpcy5jbGlja0NvcGllZFF1ZXN0aW9uID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5kb0NsaWNrQ29waWVkUXVlc3Rpb24oaXRlbS5qc29uKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdFbmQgPSBmdW5jdGlvbiAoaXRlbSwgZSkgeyBzZWxmLmRyYWdEcm9wSGVscGVyLmVuZCgpOyB9O1xyXG5cclxuICAgICAgICB0aGlzLmRvVW5kb0NsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRvVW5kb1JlZG8oc2VsZi51bmRvUmVkby51bmRvKCkpOyB9O1xyXG4gICAgICAgIHRoaXMuZG9SZWRvQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZG9VbmRvUmVkbyhzZWxmLnVuZG9SZWRvLnJlZG8oKSk7IH07XHJcblxyXG4gICAgICAgIHRoaXMuanNvbkVkaXRvciA9IG5ldyBTdXJ2ZXlKU09ORWRpdG9yKCk7XHJcblxyXG4gICAgICAgIGlmIChyZW5kZXJlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIocmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0T3B0aW9ucyhvcHRpb25zOiBhbnkpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25UeXBlcyA9IHRoaXMuZ2V0UXVlc3Rpb25UeXBlcygpO1xyXG4gICAgICAgIHRoaXMuc2hvd0pTT05FZGl0b3JUYWJWYWx1ZSA9IG9wdGlvbnMgJiYgdHlwZW9mIChvcHRpb25zLnNob3dKU09ORWRpdG9yVGFiKSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNob3dKU09ORWRpdG9yVGFiIDogdHJ1ZTtcclxuICAgICAgICB0aGlzLnNob3dUZXN0U3VydmV5VGFiVmFsdWUgPSBvcHRpb25zICYmIHR5cGVvZiAob3B0aW9ucy5zaG93VGVzdFN1cnZleVRhYikgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zaG93VGVzdFN1cnZleVRhYiA6IHRydWU7XHJcbiAgICAgICAgdGhpcy5zaG93RW1iZWRlZFN1cnZleVRhYlZhbHVlID0gb3B0aW9ucyAmJiB0eXBlb2YgKG9wdGlvbnMuc2hvd0VtYmVkZWRTdXJ2ZXlUYWIpICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2hvd0VtYmVkZWRTdXJ2ZXlUYWIgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmtvU2hvd09wdGlvbnMob3B0aW9ucyAmJiB0eXBlb2YgKG9wdGlvbnMuc2hvd09wdGlvbnMpICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2hvd09wdGlvbnMgOiBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5rb0dlbmVyYXRlVmFsaWRKU09OKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT04pO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yKSB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZW5kZXIoZWxlbWVudDogYW55ID0gbnVsbCwgb3B0aW9uczogYW55ID0gbnVsbCkge1xyXG4gICAgICAgIGlmIChvcHRpb25zKSB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50ID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVkRWxlbWVudDtcclxuICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlRWRpdG9ySHRtbDtcclxuICAgICAgICBzZWxmLmFwcGx5QmluZGluZygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGxvYWRTdXJ2ZXkoc3VydmV5SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBuZXcgU3VydmV5LmR4U3VydmV5U2VydmljZSgpLmxvYWRTdXJ2ZXkoc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoc3VjY2VzcyAmJiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudGV4dCA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdGV4dCgpIHtcclxuICAgICAgICBpZiAodGhpcy5rb0lzU2hvd0Rlc2lnbmVyKCkpIHJldHVybiB0aGlzLmdldFN1cnZleVRleHRGcm9tRGVzaWduZXIoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5qc29uRWRpdG9yLnRleHQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB0ZXh0V29ya2VyID0gbmV3IFN1cnZleVRleHRXb3JrZXIodmFsdWUpO1xyXG4gICAgICAgIGlmICh0ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0U3VydmV5KG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0ZXh0V29ya2VyLnN1cnZleSkpO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dEZXNpZ25lcigpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFVuZG9SZWRvQ3VycmVudFN0YXRlKHRydWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZpZXdUeXBlKFwiZWRpdG9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc3RhdGVWYWx1ZTsgfVxyXG4gICAgcHJvdGVjdGVkIHNldFN0YXRlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnN0YXRlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtvU3RhdGUodGhpcy5zdGF0ZSk7XHJcbiAgICB9XHJcbiAgICBzYXZlTm86IG51bWJlciA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgZG9TYXZlKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXCJzYXZpbmdcIik7XHJcbiAgICAgICAgaWYgKHRoaXMuc2F2ZVN1cnZleUZ1bmMpIHtcclxuICAgICAgICAgICAgdGhpcy5zYXZlTm8rKztcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVTdXJ2ZXlGdW5jKHRoaXMuc2F2ZU5vLFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZG9TYXZlQ2FsbGJhY2sobm86IG51bWJlciwgaXNTdWNjZXNzOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShcInNhdmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnNhdmVObyA9PSBubykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNTdWNjZXNzKSBzZWxmLnNldFN0YXRlKFwic2F2ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZWxzZSBUT0RPXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldE1vZGlmaWVkKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXCJtb2RpZmllZFwiKTtcclxuICAgICAgICB0aGlzLnNldFVuZG9SZWRvQ3VycmVudFN0YXRlKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFVuZG9SZWRvQ3VycmVudFN0YXRlKGNsZWFyU3RhdGU6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmIChjbGVhclN0YXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudW5kb1JlZG8uY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNlbE9iaiA9IHRoaXMua29TZWxlY3RlZE9iamVjdCgpID8gdGhpcy5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWUgOiBudWxsO1xyXG4gICAgICAgIHRoaXMudW5kb1JlZG8uc2V0Q3VycmVudCh0aGlzLnN1cnZleVZhbHVlLCBzZWxPYmogPyBzZWxPYmoubmFtZSA6IG51bGwpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzYXZlU3VydmV5RnVuYygpIHsgcmV0dXJuIHRoaXMuc2F2ZVN1cnZleUZ1bmNWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzYXZlU3VydmV5RnVuYyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zYXZlU3VydmV5RnVuY1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5rb1Nob3dTYXZlQnV0dG9uKHZhbHVlICE9IG51bGwpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzaG93T3B0aW9ucygpIHsgcmV0dXJuIHRoaXMua29TaG93T3B0aW9ucygpOyB9XHJcbiAgICBwdWJsaWMgc2V0IHNob3dPcHRpb25zKHZhbHVlOiBib29sZWFuKSB7IHRoaXMua29TaG93T3B0aW9ucyh2YWx1ZSk7IH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd0pTT05FZGl0b3JUYWIoKSB7IHJldHVybiB0aGlzLnNob3dKU09ORWRpdG9yVGFiVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd0pTT05FZGl0b3JUYWIodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5zaG93SlNPTkVkaXRvclRhYlZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd1Rlc3RTdXJ2ZXlUYWIoKSB7IHJldHVybiB0aGlzLnNob3dUZXN0U3VydmV5VGFiVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd1Rlc3RTdXJ2ZXlUYWIodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5zaG93VGVzdFN1cnZleVRhYlZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgc2hvd0VtYmVkZWRTdXJ2ZXlUYWIoKSB7IHJldHVybiB0aGlzLnNob3dFbWJlZGVkU3VydmV5VGFiVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd0VtYmVkZWRTdXJ2ZXlUYWIodmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5zaG93RW1iZWRlZFN1cnZleVRhYlZhbHVlID0gdmFsdWU7IH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25DYW5TaG93T2JqZWN0UHJvcGVydHkob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG9iajogb2JqZWN0LCBwcm9wZXJ0eTogcHJvcGVydHksIGNhblNob3c6IHRydWUgfTtcclxuICAgICAgICB0aGlzLm9uQ2FuU2hvd1Byb3BlcnR5LmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY2FuU2hvdztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFRleHRWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yLnRleHQgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRQYWdlKCkge1xyXG4gICAgICAgIHZhciBuYW1lID0gU3VydmV5SGVscGVyLmdldE5ld1BhZ2VOYW1lKHRoaXMuc3VydmV5LnBhZ2VzKTtcclxuICAgICAgICB2YXIgcGFnZSA9IDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleVZhbHVlLmFkZE5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgdGhpcy5hZGRQYWdlVG9VSShwYWdlKTtcclxuICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0TG9jU3RyaW5nKHN0cjogc3RyaW5nKSB7IHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKHN0cik7IH1cclxuICAgIHByb3RlY3RlZCBnZXRRdWVzdGlvblR5cGVzKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICB2YXIgYWxsVHlwZXMgPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmdldEFsbFR5cGVzKCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMgfHwgIXRoaXMub3B0aW9ucy5xdWVzdGlvblR5cGVzIHx8ICF0aGlzLm9wdGlvbnMucXVlc3Rpb25UeXBlcy5sZW5ndGgpIHJldHVybiBhbGxUeXBlcztcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMucXVlc3Rpb25UeXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25UeXBlID0gdGhpcy5vcHRpb25zLnF1ZXN0aW9uVHlwZXNbaV07XHJcbiAgICAgICAgICAgIGlmIChhbGxUeXBlcy5pbmRleE9mKHF1ZXN0aW9uVHlwZSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocXVlc3Rpb25UeXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBtb3ZlUGFnZShpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkucGFnZXNbaW5kZXhGcm9tXTtcclxuICAgICAgICB0aGlzLnN1cnZleS5wYWdlcy5zcGxpY2UoaW5kZXhGcm9tLCAxKTtcclxuICAgICAgICB0aGlzLnN1cnZleS5wYWdlcy5zcGxpY2UoaW5kZXhUbywgMCwgcGFnZSk7XHJcbiAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5zdXJ2ZXkgPSB0aGlzLnN1cnZleTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHBhZ2UpXHJcbiAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhZGRQYWdlVG9VSShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgIHRoaXMucGFnZXNFZGl0b3Iuc3VydmV5ID0gdGhpcy5zdXJ2ZXlWYWx1ZTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuYWRkUGFnZShwYWdlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25RdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRRdWVzdGlvbihwYWdlLCBxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnJlbW92ZU9iamVjdChxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9iajogYW55LCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdmFyIGlzRGVmYXVsdCA9IHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICBvYmpbcHJvcGVydHkubmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICBpZiAocHJvcGVydHkubmFtZSA9PSBcIm5hbWVcIikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMubmFtZUNoYW5nZWQob2JqKTtcclxuICAgICAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLmNoYW5nZU5hbWUoPFN1cnZleS5QYWdlPm9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb1VuZG9SZWRvKGl0ZW06IFVuZG9SZWRvSXRlbSkge1xyXG4gICAgICAgIHRoaXMuaW5pdFN1cnZleShpdGVtLnN1cnZleUpTT04pO1xyXG4gICAgICAgIGlmIChpdGVtLnNlbGVjdGVkT2JqTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgc2VsT2JqID0gdGhpcy5maW5kT2JqQnlOYW1lKGl0ZW0uc2VsZWN0ZWRPYmpOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHNlbE9iaikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChzZWxPYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy51bmRvUmVkby5rb0NhblVuZG8oKSA/IFwibW9kaWZpZWRcIiA6IFwic2F2ZWRcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGZpbmRPYmpCeU5hbWUobmFtZTogc3RyaW5nKTogU3VydmV5LkJhc2Uge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5TmFtZShuYW1lKTtcclxuICAgICAgICBpZiAocGFnZSkgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkJhc2U+dGhpcy5zdXJ2ZXkuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZSk7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uKSByZXR1cm4gcXVlc3Rpb247XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNhblN3aXRjaFZpZXdUeXBlKG5ld1R5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChuZXdUeXBlICYmIHRoaXMua29WaWV3VHlwZSgpID09IG5ld1R5cGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5rb1ZpZXdUeXBlKCkgIT0gXCJlZGl0b3JcIikgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLmpzb25FZGl0b3IuaXNKc29uQ29ycmVjdCkge1xyXG4gICAgICAgICAgICBhbGVydCh0aGlzLmdldExvY1N0cmluZyhcImVkLmNvcnJlY3RKU09OXCIpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuanNvbkVkaXRvci5zdXJ2ZXkpKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd0Rlc2lnbmVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW5Td2l0Y2hWaWV3VHlwZShcImRlc2lnbmVyXCIpKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlKFwiZGVzaWduZXJcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNob3dKc29uRWRpdG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmtvVmlld1R5cGUoKSA9PSBcImVkaXRvclwiKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNob3codGhpcy5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCkpO1xyXG4gICAgICAgIHRoaXMua29WaWV3VHlwZShcImVkaXRvclwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd1Rlc3RTdXJ2ZXkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhblN3aXRjaFZpZXdUeXBlKG51bGwpKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zaG93TGl2ZVN1cnZleSgpO1xyXG4gICAgICAgIHRoaXMua29WaWV3VHlwZShcInRlc3RcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNob3dFbWJlZEVkaXRvcigpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuU3dpdGNoVmlld1R5cGUoXCJlbWJlZFwiKSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc2hvd1N1cnZleUVtYmVkaW5nKCk7XHJcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlKFwiZW1iZWRcIik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFN1cnZleVRleHRGcm9tRGVzaWduZXIoKSB7XHJcbiAgICAgICAgdmFyIGpzb24gPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5zdXJ2ZXkpO1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OKSByZXR1cm4gSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMSk7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeShqc29uLCBudWxsLCAxKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RDaGFuZ2VkKG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICB2YXIgY2FuRGVsZXRlT2JqZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5zZWxlY3RlZE9iamVjdCA9IG9iajtcclxuICAgICAgICB0aGlzLnN1cnZleVZlcmJzLm9iaiA9IG9iajtcclxuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XHJcbiAgICAgICAgaWYgKG9ialR5cGUgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlID0gPFN1cnZleS5QYWdlPm9iajtcclxuICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ialR5cGUgPT0gT2JqVHlwZS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0ob2JqKTtcclxuICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0aGlzLnN1cnZleVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdKG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtvQ2FuRGVsZXRlT2JqZWN0KGNhbkRlbGV0ZU9iamVjdCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFwcGx5QmluZGluZygpIHtcclxuICAgICAgICBpZiAodGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIGtvLmNsZWFuTm9kZSh0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNcIik7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5anMpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleWpzLm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gNDYpIHNlbGYuZGVsZXRlUXVlc3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMzggfHwgZS5rZXlDb2RlID09IDQwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RRdWVzdGlvbihlLmtleUNvZGUgPT0gMzgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleWpzRXhhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNFeGFtcGxlXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleUpTT041KCkucGFyc2UoU3VydmV5RWRpdG9yLmRlZmF1bHROZXdTdXJ2ZXlUZXh0KSk7XHJcbiAgICAgICAgdGhpcy5zZXRVbmRvUmVkb0N1cnJlbnRTdGF0ZSh0cnVlKTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm1vZGUgPSBcImRlc2lnbmVyXCI7XHJcbiAgICAgICAgLy9UT0RPIHJlbW92ZSB0aGUgbGluZSBhYm92ZSBhbmQgY2FsbCB0aGUgbWV0aG9kIGRpcmVjdGx5LlxyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlW1wic2V0RGVzaWduTW9kZVwiXSkgdGhpcy5zdXJ2ZXlWYWx1ZVtcInNldERlc2lnbk1vZGVcIl0odHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5yZW5kZXIodGhpcy5zdXJ2ZXlqcyk7XHJcblxyXG4gICAgICAgIHRoaXMuanNvbkVkaXRvci5pbml0KCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGluaXRTdXJ2ZXkoanNvbjogYW55KSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5LlN1cnZleSgpO1xyXG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXIgPSBuZXcgRHJhZ0Ryb3BIZWxwZXIoPFN1cnZleS5JU3VydmV5PnRoaXMuc3VydmV5LCBmdW5jdGlvbiAoKSB7IHNlbGYuc2V0TW9kaWZpZWQoKSB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wiZHJhZ0Ryb3BIZWxwZXJcIl0gPSB0aGlzLmRyYWdEcm9wSGVscGVyO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJzZXRKc29uT2JqZWN0XCJdKGpzb24pOyAvL1RPRE9cclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZS5pc0VtcHR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5LlN1cnZleShuZXcgU3VydmV5SlNPTjUoKS5wYXJzZShTdXJ2ZXlFZGl0b3IuZGVmYXVsdE5ld1N1cnZleVRleHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkubW9kZSA9IFwiZGVzaWduZXJcIjtcclxuICAgICAgICAvL1RPRE8gcmVtb3ZlIHRoZSBsaW5lIGFib3ZlIGFuZCBjYWxsIHRoZSBtZXRob2QgZGlyZWN0bHkuXHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5W1wic2V0RGVzaWduTW9kZVwiXSkgdGhpcy5zdXJ2ZXlbXCJzZXREZXNpZ25Nb2RlXCJdKHRydWUpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5zdXJ2ZXkgPSB0aGlzLnN1cnZleTtcclxuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSg8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChzZW5kZXJbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25Db3B5UXVlc3Rpb25cIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5jb3B5UXVlc3Rpb24oc2VsZi5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWUpOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25GYXN0Q29weVF1ZXN0aW9uXCJdLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYuZmFzdENvcHlRdWVzdGlvbihzZWxmLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvbkRlbGV0ZUN1cnJlbnRPYmplY3RcIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5kZWxldGVDdXJyZW50T2JqZWN0KCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25Qcm9jZXNzSHRtbC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBvcHRpb25zLmh0bWwgPSBzZWxmLnByb2Nlc3NIdG1sKG9wdGlvbnMuaHRtbCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25DdXJyZW50UGFnZUNoYW5nZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5wYWdlc0VkaXRvci5zZXRTZWxlY3RlZFBhZ2UoPFN1cnZleS5QYWdlPnNlbmRlci5jdXJyZW50UGFnZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25RdWVzdGlvbkFkZGVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvbkFkZGVkKG9wdGlvbnMucXVlc3Rpb24pOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvblJlbW92ZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghaHRtbCkgcmV0dXJuIGh0bWw7XHJcbiAgICAgICAgdmFyIHNjcmlwdFJlZ0V4ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2k7XHJcbiAgICAgICAgd2hpbGUgKHNjcmlwdFJlZ0V4LnRlc3QoaHRtbCkpIHtcclxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZShzY3JpcHRSZWdFeCwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb0RyYWdnaW5nUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBhbnksIGUpIHtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ05ld1F1ZXN0aW9uKGUsIHF1ZXN0aW9uVHlwZSwgdGhpcy5nZXROZXdRdWVzdGlvbk5hbWUoKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvRHJhZ2dpbmdDb3BpZWRRdWVzdGlvbihqc29uOiBhbnksIGUpIHtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ0NvcGllZFF1ZXN0aW9uKGUsIHRoaXMuZ2V0TmV3UXVlc3Rpb25OYW1lKCksIGpzb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb0NsaWNrUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmRvQ2xpY2tRdWVzdGlvbkNvcmUoU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIHRoaXMuZ2V0TmV3UXVlc3Rpb25OYW1lKCkpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9DbGlja0NvcGllZFF1ZXN0aW9uKGpzb246IGFueSkge1xyXG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXROZXdRdWVzdGlvbk5hbWUoKTtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKGpzb25bXCJ0eXBlXCJdLCBuYW1lKTtcclxuICAgICAgICBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b09iamVjdChqc29uLCBxdWVzdGlvbik7XHJcbiAgICAgICAgcXVlc3Rpb24ubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5kb0NsaWNrUXVlc3Rpb25Db3JlKHF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0TmV3UXVlc3Rpb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIFN1cnZleUhlbHBlci5nZXROZXdRdWVzdGlvbk5hbWUodGhpcy5zdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zKCkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb0NsaWNrUXVlc3Rpb25Db3JlKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZTtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpbmRleCA9IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGFnZS5hZGRRdWVzdGlvbihxdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZGVsZXRlUXVlc3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRTZWxlY3RlZE9iakFzUXVlc3Rpb24oKTtcclxuICAgICAgICBpZiAocXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDdXJyZW50T2JqZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZWxlY3RRdWVzdGlvbihpc1VwOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRTZWxlY3RlZE9iakFzUXVlc3Rpb24oKTtcclxuICAgICAgICBpZiAocXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE5leHRRdWVzdGlvbihpc1VwKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWRPYmpBc1F1ZXN0aW9uKCk6IFN1cnZleS5RdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZTtcclxuICAgICAgICBpZiAoIW9iaikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5RdWVzdGlvbiA/IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPihvYmopOiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkZWxldGVDdXJyZW50T2JqZWN0KCkge1xyXG4gICAgICAgIHRoaXMuZGVsZXRlT2JqZWN0KHRoaXMua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjb3B5UXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKHF1ZXN0aW9uKTtcclxuICAgICAgICBpZiAob2JqVHlwZSAhPSBPYmpUeXBlLlF1ZXN0aW9uKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGpzb24gPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QocXVlc3Rpb24pO1xyXG4gICAgICAgIGpzb24udHlwZSA9IHF1ZXN0aW9uLmdldFR5cGUoKTtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuZ2V0Q29waWVkUXVlc3Rpb25CeU5hbWUocXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbS5qc29uID0ganNvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmtvQ29waWVkUXVlc3Rpb25zLnB1c2goeyBuYW1lOiBxdWVzdGlvbi5uYW1lLCBqc29uOiBqc29uIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5rb0NvcGllZFF1ZXN0aW9ucygpLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0NvcGllZFF1ZXN0aW9ucy5zcGxpY2UoMCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmYXN0Q29weVF1ZXN0aW9uKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdmFyIGpzb24gPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QocXVlc3Rpb24pO1xyXG4gICAgICAgIGpzb24udHlwZSA9IHF1ZXN0aW9uLmdldFR5cGUoKTtcclxuICAgICAgICB0aGlzLmRvQ2xpY2tDb3BpZWRRdWVzdGlvbigganNvbiApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q29waWVkUXVlc3Rpb25CeU5hbWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5rb0NvcGllZFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIGl0ZW1zW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZGVsZXRlT2JqZWN0KG9iajogYW55KSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnJlbW92ZU9iamVjdChvYmopO1xyXG4gICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKTtcclxuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucmVtb3ZlUGFnZShvYmopO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnJlbW92ZVBhZ2Uob2JqKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLnJlbW92ZVF1ZXN0aW9uKG9iaik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdCh0aGlzLnN1cnZleS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNob3dMaXZlU3VydmV5KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zdXJ2ZXlqc0V4YW1wbGUpIHJldHVybjtcclxuICAgICAgICB2YXIganNvbiA9IHRoaXMuZ2V0U3VydmV5SlNPTigpO1xyXG4gICAgICAgIGlmIChqc29uICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGpzb24uY29va2llTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGpzb24uY29va2llTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5TdXJ2ZXkoanNvbik7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHN1cnZleWpzRXhhbXBsZVJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cnZleWpzRXhhbXBsZVJlc3VsdHNcIik7XHJcbiAgICAgICAgICAgIHZhciBzdXJ2ZXlqc0V4YW1wbGVyZVJ1biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNFeGFtcGxlcmVSdW5cIik7XHJcbiAgICAgICAgICAgIGlmIChzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzKSBzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChzdXJ2ZXlqc0V4YW1wbGVyZVJ1bikgc3VydmV5anNFeGFtcGxlcmVSdW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICBzdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSkgPT4geyBpZiAoc3VydmV5anNFeGFtcGxlUmVzdWx0cykgc3VydmV5anNFeGFtcGxlUmVzdWx0cy5pbm5lckhUTUwgPSB0aGlzLmdldExvY1N0cmluZyhcImVkLnN1cnZleVJlc3VsdHNcIikgKyBKU09OLnN0cmluZ2lmeShzdXJ2ZXkuZGF0YSk7IGlmIChzdXJ2ZXlqc0V4YW1wbGVyZVJ1bikgc3VydmV5anNFeGFtcGxlcmVSdW4uc3R5bGUuZGlzcGxheSA9IFwiXCI7IH0pO1xyXG4gICAgICAgICAgICBzdXJ2ZXkucmVuZGVyKHRoaXMuc3VydmV5anNFeGFtcGxlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleWpzRXhhbXBsZS5pbm5lckhUTUwgPSB0aGlzLmdldExvY1N0cmluZyhcImVkLmNvcnJlY3RKU09OXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd1N1cnZleUVtYmVkaW5nKCkge1xyXG4gICAgICAgIHZhciBqc29uID0gdGhpcy5nZXRTdXJ2ZXlKU09OKCk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5qc29uID0ganNvbjtcclxuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLnN1cnZleUlkID0gdGhpcy5zdXJ2ZXlJZDtcclxuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLnN1cnZleVBvc3RJZCA9IHRoaXMuc3VydmV5UG9zdElkO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuZ2VuZXJhdGVWYWxpZEpTT04gPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc2hvdygpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTdXJ2ZXlKU09OKCk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSByZXR1cm4gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcclxuICAgICAgICBpZiAodGhpcy5qc29uRWRpdG9yLmlzSnNvbkNvcnJlY3QpIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5qc29uRWRpdG9yLnN1cnZleSk7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZUFubm90YXRpb25zKHRleHQ6IHN0cmluZywgZXJyb3JzOiBhbnlbXSk6IEFjZUFqYXguQW5ub3RhdGlvbltdIHtcclxuICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBuZXcgQXJyYXk8QWNlQWpheC5Bbm5vdGF0aW9uPigpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGVycm9yc1tpXTtcclxuICAgICAgICAgICAgdmFyIGFubm90YXRpb246IEFjZUFqYXguQW5ub3RhdGlvbiA9IHsgcm93OiBlcnJvci5wb3NpdGlvbi5zdGFydC5yb3csIGNvbHVtbjogZXJyb3IucG9zaXRpb24uc3RhcnQuY29sdW1uLCB0ZXh0OiBlcnJvci50ZXh0LCB0eXBlOiBcImVycm9yXCIgfTtcclxuICAgICAgICAgICAgYW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFubm90YXRpb25zO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdXJ2ZXkuU3VydmV5LmNzc1R5cGUgPSBcImJvb3RzdHJhcFwiO1xyXG5uZXcgU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCgpLnJlcGxhY2VUZXh0KHRlbXBsYXRlUGFnZUh0bWwsIFwicGFnZVwiKTtcclxubmV3IFN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHQoKS5yZXBsYWNlVGV4dCh0ZW1wbGF0ZVF1ZXN0aW9uSHRtbCwgXCJxdWVzdGlvblwiKTtcclxuXHJcblN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlID0gbnVsbDtcclxuICAgIHRoaXMub25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZCA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHRoaXMub25Db3B5UXVlc3Rpb24gPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICB0aGlzLm9uRmFzdENvcHlRdWVzdGlvbiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHRoaXMub25EZWxldGVDdXJyZW50T2JqZWN0ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5jb3B5UXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvcHlRdWVzdGlvbi5maXJlKHNlbGYpOyB9O1xyXG4gICAgdGhpcy5mYXN0Q29weVF1ZXN0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25GYXN0Q29weVF1ZXN0aW9uLmZpcmUoc2VsZik7IH07XHJcbiAgICB0aGlzLmRlbGV0ZUN1cnJlbnRPYmplY3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkRlbGV0ZUN1cnJlbnRPYmplY3QuZmlyZShzZWxmKTsgfVxyXG4gICAgdGhpcy5rb0RyYWdnaW5nU291cmNlID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxufTtcclxuU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdID0gZnVuY3Rpb24odmFsdWU6IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgIGlmICh2YWx1ZSA9PSB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWU7XHJcbiAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgaWYgKG9sZFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICBvbGRWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0oKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRTZWxlY3RlZFF1ZXN0aW9uJzogb2xkVmFsdWUsICduZXdTZWxlY3RlZFF1ZXN0aW9uJzogdmFsdWUgfSk7XHJcbn07XHJcblN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wiZ2V0RWRpdG9yTG9jU3RyaW5nXCJdID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcodmFsdWUpO1xyXG59O1xyXG5cclxuU3VydmV5LlBhZ2UucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuZHJhZ0VudGVyQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmtvRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKC0xKTtcclxuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgIHRoaXMua29EcmFnZ2luZ0JvdHRvbSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgdGhpcy5rb0RyYWdnaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPCAwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhZ0VudGVyQ291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYua29EcmFnZ2luZ1F1ZXN0aW9uKG51bGwpO1xyXG4gICAgICAgICAgICBzZWxmLmtvRHJhZ2dpbmdCb3R0b20oZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gbmV3VmFsdWUgPj0gMCAmJiBuZXdWYWx1ZSA8IHNlbGYucXVlc3Rpb25zLmxlbmd0aCA/IHNlbGYucXVlc3Rpb25zW25ld1ZhbHVlXSA6IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYua29EcmFnZ2luZ1F1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgc2VsZi5rb0RyYWdnaW5nQm90dG9tKG5ld1ZhbHVlID09IHNlbGYucXVlc3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmtvRHJhZ2dpbmdRdWVzdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSkgbmV3VmFsdWUua29Jc0RyYWdnaW5nKHRydWUpOyB9KTtcclxuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uLnN1YnNjcmliZShmdW5jdGlvbiAob2xkVmFsdWUpIHsgaWYgKG9sZFZhbHVlKSBvbGRWYWx1ZS5rb0lzRHJhZ2dpbmcoZmFsc2UpOyB9LCB0aGlzLCBcImJlZm9yZUNoYW5nZVwiKTtcclxuICAgIHRoaXMuZHJhZ0VudGVyID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZWxmLmRyYWdFbnRlckNvdW50ZXIrKzsgc2VsZi5kb0RyYWdFbnRlcihlKTsgfTtcclxuICAgIHRoaXMuZHJhZ0xlYXZlID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRW50ZXJDb3VudGVyLS07IGlmIChzZWxmLmRyYWdFbnRlckNvdW50ZXIgPT09IDApIHNlbGYuZG9EcmFnTGVhdmUoZSk7IH07XHJcbiAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0Ryb3AoZSk7IH07XHJcbn07XHJcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJvcFwiXSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgZHJhZ0Ryb3BIZWxwZXIgPSB0aGlzLmRhdGFbXCJkcmFnRHJvcEhlbHBlclwiXTtcclxuICAgIGlmIChkcmFnRHJvcEhlbHBlcikge1xyXG4gICAgICAgIGRyYWdEcm9wSGVscGVyLmRvRHJvcChlKTtcclxuICAgIH1cclxufTtcclxuU3VydmV5LlBhZ2UucHJvdG90eXBlW1wiZG9EcmFnRW50ZXJcIl0gPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5xdWVzdGlvbnMubGVuZ3RoID4gMCB8fCB0aGlzLmtvRHJhZ2dpbmcoKSA+IDApIHJldHVybjtcclxuICAgIHZhciBkcmFnRHJvcEhlbHBlciA9IHRoaXMuZGF0YVtcImRyYWdEcm9wSGVscGVyXCJdO1xyXG4gICAgaWYgKGRyYWdEcm9wSGVscGVyICYmIGRyYWdEcm9wSGVscGVyLmlzU3VydmV5RHJhZ2dpbmcoZSkpIHtcclxuICAgICAgICB0aGlzLmtvRHJhZ2dpbmcoMCk7XHJcbiAgICB9XHJcbn07XHJcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJhZ0xlYXZlXCJdID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciBkcmFnRHJvcEhlbHBlciA9IHRoaXMuZGF0YVtcImRyYWdEcm9wSGVscGVyXCJdO1xyXG4gICAgaWYgKGRyYWdEcm9wSGVscGVyKSB7XHJcbiAgICAgICAgZHJhZ0Ryb3BIZWxwZXIuZG9MZWF2ZVBhZ2UoZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uQ3JlYXRpbmdcIl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBudWxsO1xyXG4gICAgdGhpcy5rb0lzRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMua29Jc0RyYWdnaW5nU291cmNlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRyYWdEcm9wSGVscGVyVmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzZWxmLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBzZWxmLmRhdGFbXCJkcmFnRHJvcEhlbHBlclwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuZHJhZ0Ryb3BIZWxwZXJWYWx1ZTtcclxuICAgIH07XHJcbiAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmRvRHJhZ0Ryb3BPdmVyKGUsIHNlbGYpOyB9O1xyXG4gICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5kb0Ryb3AoZSwgc2VsZik7IH07XHJcbiAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5zdGFydERyYWdRdWVzdGlvbihlLCBzZWxmLm5hbWUpOyB9O1xyXG4gICAgdGhpcy5kcmFnRW5kID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmVuZCgpOyB9O1xyXG4gICAgdGhpcy5rb0lzU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMua29PbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHNlbGYuZGF0YVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0odGhpcyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0gPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgdGhpcy5rb0lzU2VsZWN0ZWQodGhpcy5kYXRhW1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdID09IHRoaXMpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlIZWxwZXIsIE9ialR5cGV9IGZyb20gXCIuL3N1cnZleUhlbHBlclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEl0ZW0ge1xuICAgIHB1YmxpYyB2YWx1ZTogU3VydmV5LkJhc2U7XG4gICAgcHVibGljIHRleHQ6IGFueTtcbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdHMge1xuICAgIHB1YmxpYyBzdGF0aWMgaW50ZW5kOiBzdHJpbmcgPSBcIi4uLlwiO1xuICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGtvT2JqZWN0czogYW55LCBwdWJsaWMga29TZWxlY3RlZDogYW55KSB7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMucmVidWlsZCgpO1xuICAgIH1cbiAgICBwdWJsaWMgYWRkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xuICAgICAgICB2YXIgcGFnZUl0ZW0gPSB0aGlzLmNyZWF0ZVBhZ2UocGFnZSk7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuc3VydmV5LnBhZ2VzLmluZGV4T2YocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwcmV2UGFnZSA9IHRoaXMuc3VydmV5LnBhZ2VzW2luZGV4IC0gMV07XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHByZXZQYWdlKSArIDE7XG4gICAgICAgICAgICBpbmRleCArPSBwcmV2UGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZXggPSAxOyAvLzAgLSBTdXJ2ZXlcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZEl0ZW0ocGFnZUl0ZW0sIGluZGV4KTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZVF1ZXN0aW9uKHBhZ2UucXVlc3Rpb25zW2ldKTtcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCArIGkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29TZWxlY3RlZChwYWdlSXRlbSk7XG4gICAgfVxuICAgIHB1YmxpYyBhZGRRdWVzdGlvbihwYWdlOiBTdXJ2ZXkuUGFnZSwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcbiAgICAgICAgdmFyIHF1ZXN0aW9uSW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKSArIDE7XG4gICAgICAgIGluZGV4ICs9IHF1ZXN0aW9uSW5kZXg7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbik7XG4gICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZChpdGVtKTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdE9iamVjdChvYmo6IFN1cnZleS5CYXNlKSB7XG4gICAgICAgIHZhciBvYmpzID0gdGhpcy5rb09iamVjdHMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAob2Jqc1tpXS52YWx1ZSA9PSBvYmopIHtcbiAgICAgICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQob2Jqc1tpXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyByZW1vdmVPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChvYmopO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XG4gICAgICAgIHZhciBjb3VudFRvUmVtb3ZlID0gMTtcbiAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XG4gICAgICAgICAgICB2YXIgcGFnZTogU3VydmV5LlBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xuICAgICAgICAgICAgY291bnRUb1JlbW92ZSArPSBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCBjb3VudFRvUmVtb3ZlKTtcbiAgICB9XG4gICAgcHVibGljIG5hbWVDaGFuZ2VkKG9iajogU3VydmV5LkJhc2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmtvT2JqZWN0cygpW2luZGV4XS50ZXh0KHRoaXMuZ2V0VGV4dChvYmopKTtcbiAgICB9XG4gICAgcHVibGljIHNlbGVjdE5leHRRdWVzdGlvbihpc1VwOiBib29sZWFuKSB7XG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0U2VsZWN0ZWRRdWVzdGlvbigpO1xuICAgICAgICB2YXIgaXRlbUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocXVlc3Rpb24pO1xuICAgICAgICBpZiAoaXRlbUluZGV4IDwgMCkgcmV0dXJuIHF1ZXN0aW9uO1xuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XG4gICAgICAgIHZhciBuZXdJdGVtSW5kZXggPSBpdGVtSW5kZXggKyAoaXNVcCA/IC0xIDogMSk7XG4gICAgICAgIGlmIChuZXdJdGVtSW5kZXggPCBvYmpzLmxlbmd0aCAmJiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmpzW25ld0l0ZW1JbmRleF0udmFsdWUpID09IE9ialR5cGUuUXVlc3Rpb24pIHtcbiAgICAgICAgICAgIGl0ZW1JbmRleCA9IG5ld0l0ZW1JbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0l0ZW1JbmRleCA9IGl0ZW1JbmRleDtcbiAgICAgICAgICAgIHdoaWxlIChuZXdJdGVtSW5kZXggPCBvYmpzLmxlbmd0aCAmJiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmpzW25ld0l0ZW1JbmRleF0udmFsdWUpID09IE9ialR5cGUuUXVlc3Rpb24pIHtcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBuZXdJdGVtSW5kZXg7XG4gICAgICAgICAgICAgICAgbmV3SXRlbUluZGV4ICs9IChpc1VwID8gMSA6IC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQob2Jqc1tpdGVtSW5kZXhdKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZFF1ZXN0aW9uKCk6IFN1cnZleS5RdWVzdGlvbkJhc2Uge1xuICAgICAgICBpZiAoIXRoaXMua29TZWxlY3RlZCgpKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMua29TZWxlY3RlZCgpLnZhbHVlO1xuICAgICAgICBpZiAoIW9iaikgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUXVlc3Rpb24gPyA8U3VydmV5LlF1ZXN0aW9uQmFzZT4ob2JqKSA6IG51bGw7XG5cbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRJdGVtKGl0ZW06IFN1cnZleU9iamVjdEl0ZW0sIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5rb09iamVjdHMoKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnB1c2goaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgcmVidWlsZCgpIHtcbiAgICAgICAgdmFyIG9ianMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5ID09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZUl0ZW0odGhpcy5zdXJ2ZXksIFwiU3VydmV5XCIpKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkucGFnZXNbaV07XG4gICAgICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVQYWdlKHBhZ2UpKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tqXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5zdXJ2ZXkpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSXRlbShwYWdlLCB0aGlzLmdldFRleHQocGFnZSkpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUl0ZW0ocXVlc3Rpb24sIHRoaXMuZ2V0VGV4dChxdWVzdGlvbikpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUl0ZW0odmFsdWU6IFN1cnZleS5CYXNlLCB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgU3VydmV5T2JqZWN0SXRlbSgpO1xuICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGl0ZW0udGV4dCA9IGtvLm9ic2VydmFibGUodGV4dCk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEl0ZW1JbmRleCh2YWx1ZTogU3VydmV5LkJhc2UpOiBudW1iZXIge1xuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9ianNbaV0udmFsdWUgPT0gdmFsdWUpIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRUZXh0KG9iajogU3VydmV5LkJhc2UpOiBzdHJpbmcge1xuICAgICAgICB2YXIgaW50ZW5kID0gU3VydmV5T2JqZWN0cy5pbnRlbmQ7XG4gICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopICE9IE9ialR5cGUuUGFnZSkge1xuICAgICAgICAgICAgaW50ZW5kICs9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnRlbmQgKyBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShvYmopO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3VydmV5T2JqZWN0cy50cyIsImltcG9ydCB7U3VydmV5VGV4dFdvcmtlcn0gZnJvbSBcIi4vdGV4dFdvcmtlclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleUpTT05FZGl0b3Ige1xuICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVGV4dFRpbWVvdXQ6IG51bWJlciA9IDEwMDA7XG5cbiAgICBwcml2YXRlIGlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBhY2VFZGl0b3I6IEFjZUFqYXguRWRpdG9yO1xuICAgIHByaXZhdGUgdGV4dFdvcmtlcjogU3VydmV5VGV4dFdvcmtlcjtcbiAgICBrb1RleHQ6IGFueTtcbiAgICBrb0Vycm9yczogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMua29UZXh0ID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcbiAgICAgICAgdGhpcy5rb0Vycm9ycyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb1RleHQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICBzZWxmLm9uSnNvbkVkaXRvckNoYW5nZWQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBpbml0KCkge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNBY2VFZGl0b3IpIHJldHVybjtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvciA9IGFjZS5lZGl0KFwic3VydmV5anNKU09ORWRpdG9yXCIpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgIHRoaXMuYWNlRWRpdG9yLnNlc3Npb24uc2V0TW9kZShcImFjZS9tb2RlL2pzb25cIik7XHJcbiAgICAgICAgdGhpcy5hY2VFZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5nZXRTZXNzaW9uKCkub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZWxmLm9uSnNvbkVkaXRvckNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5nZXRTZXNzaW9uKCkuc2V0VXNlV29ya2VyKHRydWUpO1xyXG4gICAgICAgIFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIgPSB0aGlzLmFjZUVkaXRvci5zZXNzaW9uLmRvYy5nZXROZXdMaW5lQ2hhcmFjdGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0FjZUVkaXRvcigpOiBib29sZWFuIHsgcmV0dXJuIHR5cGVvZiBhY2UgIT09IFwidW5kZWZpbmVkXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuaGFzQWNlRWRpdG9yKSByZXR1cm4gdGhpcy5rb1RleHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNlRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgfVxuICAgIHB1YmxpYyBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMua29UZXh0KHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuYWNlRWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWNlRWRpdG9yLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IucmVuZGVyZXIudXBkYXRlRnVsbCh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzSnNvbih2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5pc1Byb2Nlc3NpbmdJbW1lZGlhdGVseSA9IGZhbHNlO1xyXG4gICAgfVxuICAgIHB1YmxpYyBzaG93KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdmFsdWU7XG4gICAgICAgIGlmICh0aGlzLmFjZUVkaXRvcikge1xuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGlzSnNvbkNvcnJlY3QoKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMudGV4dFdvcmtlciA9IG5ldyBTdXJ2ZXlUZXh0V29ya2VyKHRoaXMudGV4dCk7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHRXb3JrZXIuaXNKc29uQ29ycmVjdDtcclxuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMudGV4dFdvcmtlci5zdXJ2ZXk7IH1cbiAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIG9uSnNvbkVkaXRvckNoYW5nZWQoKTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy50aW1lb3V0SWQgPiAtMSkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Byb2Nlc3NpbmdJbW1lZGlhdGVseSkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudGltZW91dElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3NKc29uKHNlbGYudGV4dCk7XHJcbiAgICAgICAgICAgIH0sIFN1cnZleUpTT05FZGl0b3IudXBkYXRlVGV4dFRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcHJvY2Vzc0pzb24odGV4dDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICBpZiAodGhpcy5hY2VFZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IuZ2V0U2Vzc2lvbigpLnNldEFubm90YXRpb25zKHRoaXMuY3JlYXRlQW5ub3RhdGlvbnModGV4dCwgdGhpcy50ZXh0V29ya2VyLmVycm9ycykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy50ZXh0V29ya2VyLmVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVBbm5vdGF0aW9ucyh0ZXh0OiBzdHJpbmcsIGVycm9yczogYW55W10pOiBBY2VBamF4LkFubm90YXRpb25bXSB7XHJcbiAgICAgICAgdmFyIGFubm90YXRpb25zID0gbmV3IEFycmF5PEFjZUFqYXguQW5ub3RhdGlvbj4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBlcnJvcnNbaV07XHJcbiAgICAgICAgICAgIHZhciBhbm5vdGF0aW9uOiBBY2VBamF4LkFubm90YXRpb24gPSB7IHJvdzogZXJyb3IucG9zaXRpb24uc3RhcnQucm93LCBjb2x1bW46IGVycm9yLnBvc2l0aW9uLnN0YXJ0LmNvbHVtbiwgdGV4dDogZXJyb3IudGV4dCwgdHlwZTogXCJlcnJvclwiIH07XHJcbiAgICAgICAgICAgIGFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbm5vdGF0aW9ucztcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXlKU09ORWRpdG9yLnRzIiwiZXhwb3J0IHZhciBodG1sID0gJzxkaXYgY2xhc3M9XCJzdmRfY29udGFpbmVyXCI+ICAgIDx1bCBjbGFzcz1cIm5hdmJhci1kZWZhdWx0IGNvbnRhaW5lci1mbHVpZCBuYXYgbmF2LXRhYnMgc3ZkX21lbnVcIj4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvVmlld1R5cGUoKSA9PSBcXCdkZXNpZ25lclxcJ31cIj48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOnNlbGVjdERlc2lnbmVyQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5kZXNpZ25lclxcJylcIj48L2E+PC9saT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBzaG93SlNPTkVkaXRvclRhYiwgY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZWRpdG9yXFwnfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0RWRpdG9yQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5qc29uRWRpdG9yXFwnKVwiPjwvYT48L2xpPiAgICAgICAgPGxpIGRhdGEtYmluZD1cInZpc2libGU6IHNob3dUZXN0U3VydmV5VGFiLCBjc3M6IHthY3RpdmU6IGtvVmlld1R5cGUoKSA9PSBcXCd0ZXN0XFwnfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0VGVzdENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleVxcJylcIj48L2E+PC9saT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBzaG93RW1iZWRlZFN1cnZleVRhYiwgY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZW1iZWRcXCd9XCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3RFbWJlZENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuZW1iZWRTdXJ2ZXlcXCcpXCI+PC9hPjwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXJcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYmluZD1cImVuYWJsZTp1bmRvUmVkby5rb0NhblVuZG8sIGNsaWNrOiBkb1VuZG9DbGlja1wiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC51bmRvXFwnKVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXJcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYmluZD1cImVuYWJsZTp1bmRvUmVkby5rb0NhblJlZG8sIGNsaWNrOiBkb1JlZG9DbGlja1wiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5yZWRvXFwnKVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IChrb0lzU2hvd0Rlc2lnbmVyKCkgJiYga29TaG93T3B0aW9ucygpKVwiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAgaW5saW5lXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5vcHRpb25zXFwnKVwiPiAgICAgICAgICAgICAgICAgICAgT3B0aW9ucyAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+ICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1iaW5kPVwiY3NzOiB7YWN0aXZlOiBrb0dlbmVyYXRlVmFsaWRKU09OfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6Z2VuZXJhdGVWYWxpZEpTT05DbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLmdlbmVyYXRlVmFsaWRKU09OXFwnKVwiPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZTogIWtvR2VuZXJhdGVWYWxpZEpTT04oKX1cIj48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOmdlbmVyYXRlUmVhZGFibGVKU09OQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5nZW5lcmF0ZVJlYWRhYmxlSlNPTlxcJylcIj48L2E+PC9saT4gICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvVmlld1R5cGUoKSA9PSBcXCd0ZXN0XFwnXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cCBpbmxpbmVcIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzdXJ2ZXlUZXN0V2lkdGhcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiPiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLnRlc3RTdXJ2ZXlXaWR0aFxcJykgKyBcXCcgXFwnICsgJHJvb3Qua29UZXN0U3VydmV5V2lkdGgoKVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCIgYXJpYS1sYWJlbGxlZGJ5PVwic3VydmV5VGVzdFdpZHRoXCI+ICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgXFwnMTAwJVxcJylcIj4xMDAlPC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgXFwnMTIwMHB4XFwnKVwiPjEyMDBweDwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6IGtvVGVzdFN1cnZleVdpZHRoLmJpbmQoJGRhdGEsIFxcJzEwMDBweFxcJylcIj4xMDAwcHg8L2E+PC9saT4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOiBrb1Rlc3RTdXJ2ZXlXaWR0aC5iaW5kKCRkYXRhLCBcXCc4MDBweFxcJylcIj44MDBweDwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6IGtvVGVzdFN1cnZleVdpZHRoLmJpbmQoJGRhdGEsIFxcJzYwMHB4XFwnKVwiPjYwMHB4PC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgXFwnNDAwcHhcXCcpXCI+NDAwcHg8L2E+PC9saT4gICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvbGk+ICAgICAgICA8bGkgY2xhc3M9XCJzdmRfYWN0aW9uc1wiPiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHN2ZF9zYXZlX2J0blwiIGRhdGEtYmluZD1cImNsaWNrOiBzYXZlQnV0dG9uQ2xpY2ssIHZpc2libGU6IGtvU2hvd1NhdmVCdXR0b25cIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuc2F2ZVN1cnZleVxcJylcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICA8L2xpPiAgICA8L3VsPiAgICA8ZGl2IGNsYXNzPVwicGFuZWwgc3ZkX2NvbnRlbnRcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc3ZkX3N1cnZleV9kZXNpZ25lclwiICBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZGVzaWduZXJcXCdcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTIgY29sLW1kLTIgY29sLXNtLTEyIGNvbC14cy0xMiBwYW5lbCBwYW5lbC1kZWZhdWx0IHN2ZF90b29sYm94XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tZ3JvdXAtdmVydGljYWxcIiBzdHlsZT1cIndpZHRoOjEwMCU7cGFkZGluZy1yaWdodDoycHhcIj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb25UeXBlcyAtLT4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDsgbWFyZ2luOjFweDt3aWR0aDoxMDAlXCIgZHJhZ2dhYmxlPVwidHJ1ZVwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNsaWNrUXVlc3Rpb24sIGV2ZW50OntkcmFnc3RhcnQ6IGZ1bmN0aW9uKGVsLCBlKSB7ICRwYXJlbnQuZHJhZ2dpbmdRdWVzdGlvbigkZGF0YSwgZSk7IHJldHVybiB0cnVlO30sIGRyYWdlbmQ6IGZ1bmN0aW9uKGVsLCBlKSB7ICRwYXJlbnQuZHJhZ0VuZCgpOyB9fVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cImNzczogXFwnaWNvbi1cXCcgKyAkZGF0YVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN2ZF90b29sYm94X2l0ZW1fdGV4dFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdxdC5cXCcgKyAkZGF0YSlcIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29Db3BpZWRRdWVzdGlvbnMgLS0+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgc3R5bGU9XCJ0ZXh0LWFsaWduOmxlZnQ7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jbGlja0NvcGllZFF1ZXN0aW9uLCBldmVudDp7ZHJhZ3N0YXJ0OiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdnaW5nQ29waWVkUXVlc3Rpb24oJGRhdGEsIGUpOyByZXR1cm4gdHJ1ZTt9LCBkcmFnZW5kOiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdFbmQoKTsgfX1cIj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24tZGVmYXVsdFwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN2ZF90b29sYm94X2l0ZW1fdGV4dFwiIGRhdGEtYmluZD1cInRleHQ6bmFtZVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTcgY29sLW1kLTcgY29sLXNtLTEyIGNvbC14cy0xMiBzdmRfZWRpdG9yc1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3ZkX3BhZ2VzX2VkaXRvclwiIGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN2ZF9xdWVzdGlvbnNfZWRpdG9yXCIgaWQ9XCJzY3JvbGxhYmxlRGl2XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNcIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy0zIGNvbC1tZC0zIGNvbC1zbS0xMiBjb2wteHMtMTIgcGFuZWwgcGFuZWwtZGVmYXVsdCBzdmRfcHJvcGVydGllc1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZyBpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29PYmplY3RzLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRPYmplY3RcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0NhbkRlbGV0ZU9iamVjdCwgY2xpY2s6IGRlbGV0ZUN1cnJlbnRPYmplY3QsIGF0dHI6IHsgdGl0bGU6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5kZWxTZWxPYmplY3RcXCcpfVwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBzZWxlY3RlZE9iamVjdEVkaXRvciB9XCI+PC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1mb290ZXJcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOnN1cnZleVZlcmJzLmtvSGFzVmVyYnNcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0dmVyYnNcXCcsIGRhdGE6IHN1cnZleVZlcmJzIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29WaWV3VHlwZSgpID09IFxcJ2VkaXRvclxcJ1wiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnanNvbmVkaXRvclxcJywgZGF0YToganNvbkVkaXRvciB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc1Rlc3RcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwndGVzdFxcJywgc3R5bGU6IHt3aWR0aDoga29UZXN0U3VydmV5V2lkdGh9XCI+ICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzRXhhbXBsZVwiPjwvZGl2PiAgICAgICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzXCI+PC9kaXY+ICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInN1cnZleWpzRXhhbXBsZXJlUnVuXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0VGVzdENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleUFnYWluXFwnKVwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+VGVzdCBBZ2FpbjwvYnV0dG9uPiAgICAgICAgPC9kaXY+ICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNFbWJlZFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvVmlld1R5cGUoKSA9PSBcXCdlbWJlZFxcJ1wiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5ZW1iZWRpbmdcXCcsIGRhdGE6IHN1cnZleUVtYmVkaW5nIH1cIj48L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cImpzb25lZGl0b3JcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAhaGFzQWNlRWRpdG9yXCI+ICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJzdmRfanNvbl9lZGl0b3JfYXJlYVwiIGRhdGEtYmluZD1cInRleHRJbnB1dDprb1RleHRcIj48L3RleHRhcmVhPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0Vycm9ycyAtLT4gICAgICAgIDxkaXY+ICAgICAgICAgICAgPHNwYW4+RXJyb3I6IDwvc3Bhbj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0ZXh0XCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgICAgICA8IS0tIC9rbyAgLS0+ICAgIDwvZGl2PiAgICA8ZGl2IGlkPVwic3VydmV5anNKU09ORWRpdG9yXCIgY2xhc3M9XCJzdmRfanNvbl9lZGl0b3JcIj48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdGVkaXRvclwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSBzdmRfdGFibGUtbm93cmFwXCI+ICAgICAgICA8dGJvZHkgZGF0YS1iaW5kPVwiZm9yZWFjaDoga29Qcm9wZXJ0aWVzXCI+ICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNoYW5nZUFjdGl2ZVByb3BlcnR5KCRkYXRhKSwgY3NzOiB7XFwnYWN0aXZlXFwnOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YX1cIj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IGRpc3BsYXlOYW1lLCBhdHRyOiB7dGl0bGU6IHRpdGxlfVwiIHdpZHRoPVwiNTAlXCI+PC90ZD4gICAgICAgICAgICAgICAgPHRkIHdpZHRoPVwiNTAlXCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHQsIHZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpICE9ICRkYXRhICYmIChrb1RleHQoKSB8fCAkZGF0YS5lZGl0b3JUeXBlID09IFxcJ2Jvb2xlYW5cXCcpLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH1cIiBzdHlsZT1cInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlblwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogJHBhcmVudC5rb0FjdGl2ZVByb3BlcnR5KCkgPT0gJGRhdGEgfHwgKCFrb1RleHQoKSAmJiAkZGF0YS5lZGl0b3JUeXBlICE9IFxcJ2Jvb2xlYW5cXCcpXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1cXCcgKyBlZGl0b3JUeXBlLCBkYXRhOiAkZGF0YSB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJvYmplY3R2ZXJic1wiPiAgICA8IS0tIGtvIGZvcmVhY2g6IGtvVmVyYnMgLS0+ICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgICAgIDxzcGFuICBjbGFzcz1cImlucHV0LWdyb3VwLWFkZG9uXCIgZGF0YS1iaW5kPVwidGV4dDp0ZXh0XCI+PC9zcGFuPiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTpcXCd2YWx1ZVxcJywgdmFsdWU6IGtvU2VsZWN0ZWRJdGVtXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPCEtLSAva28gIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicGFnZWVkaXRvclwiPiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnNcIiBkYXRhLWJpbmQ9XCJ0YWJzOnRydWVcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29QYWdlcyAtLT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvU2VsZWN0ZWQoKX0sZXZlbnQ6eyAgICAgICAgICAga2V5ZG93bjpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQua2V5RG93bihlbCwgZSk7IH0sICAgICAgICAgICBkcmFnc3RhcnQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdTdGFydChlbCk7IHJldHVybiB0cnVlOyB9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdPdmVyKGVsKTt9LCAgICAgICAgICAgZHJhZ2VuZDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0VuZCgpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnRHJvcChlbCk7fSAgICAgICAgIH1cIj4gICAgICAgICAgICAgPGEgY2xhc3M9XCJzdmRfcGFnZV9uYXZcIiBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOiRwYXJlbnQuc2VsZWN0UGFnZUNsaWNrXCI+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCI+PC9zcGFuPiAgICAgICAgICAgIDwvYT4gICAgICAgIDwvbGk+ICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICA8bGk+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBzdmRfYWRkX25ld19wYWdlX2J0blwiIGRhdGEtYmluZD1cImNsaWNrOmFkZE5ld1BhZ2VDbGlja1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPjwvbGk+ICAgIDwvdWw+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXllbWJlZGluZ1wiPiAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cInZhbHVlOmtvTGlicmFyeVZlcnNpb25cIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYW5ndWxhclwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5hbmd1bGFyXFwnKVwiPjwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJqcXVlcnlcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcuanF1ZXJ5XFwnKVwiPjwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJrbm9ja291dFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5rbm9ja291dFxcJylcIj48L29wdGlvbj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicmVhY3RcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcucmVhY3RcXCcpXCI+PC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TY3JpcHRVc2luZ1wiPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJib290c3RyYXBcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcuYm9vdHN0cmFwXFwnKVwiPjwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzdGFuZGFyZFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5zdGFuZGFyZFxcJylcIj48L29wdGlvbj4gICAgICAgIDwvc2VsZWN0PiAgICAgICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1Nob3dBc1dpbmRvd1wiPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYWdlXCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LnNob3dPblBhZ2VcXCcpXCI+PC9vcHRpb24+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIndpbmRvd1wiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5zaG93SW5XaW5kb3dcXCcpXCI+PC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94LWlubGluZVwiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNJZHNcIj4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiY2hlY2tlZDprb0xvYWRTdXJ2ZXlcIiAvPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5sb2FkRnJvbVNlcnZlclxcJylcIj48L3NwYW4+ICAgICAgICA8L2xhYmVsPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy50aXRsZVNjcmlwdFxcJylcIj48L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTpoYXNBY2VFZGl0b3JcIj4gICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdIZWFkXCIgc3R5bGU9XCJoZWlnaHQ6NzBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDx0ZXh0YXJlYSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiFoYXNBY2VFZGl0b3IsIHRleHQ6IGtvSGVhZFRleHRcIiBzdHlsZT1cImhlaWdodDo3MHB4O3dpZHRoOjEwMCVcIj48L3RleHRhcmVhPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29WaXNpYmxlSHRtbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiAgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LnRpdGxlSHRtbFxcJylcIj48L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTpoYXNBY2VFZGl0b3JcIj4gICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdCb2R5XCIgc3R5bGU9XCJoZWlnaHQ6MzBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDx0ZXh0YXJlYSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiFoYXNBY2VFZGl0b3IsIHRleHQ6IGtvQm9keVRleHRcIiBzdHlsZT1cImhlaWdodDozMHB4O3dpZHRoOjEwMCVcIj48L3RleHRhcmVhPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiICBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcudGl0bGVKYXZhU2NyaXB0XFwnKVwiPjwvZGl2PiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmhhc0FjZUVkaXRvclwiPiAgICAgICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ0phdmFcIiBzdHlsZT1cImhlaWdodDozMDBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDx0ZXh0YXJlYSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiFoYXNBY2VFZGl0b3IsIHRleHQ6IGtvSmF2YVRleHRcIiBzdHlsZT1cImhlaWdodDozMDBweDt3aWR0aDoxMDAlXCI+PC90ZXh0YXJlYT4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1ib29sZWFuXCI+ICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvVmFsdWVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItZHJvcGRvd25cIj4gICAgPGRpdiBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIj4gICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZSwgb3B0aW9uczogY2hvaWNlc1wiICBzdHlsZT1cIndpZHRoOjEwMCVcIj48L3NlbGVjdD4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1odG1sXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtaHRtbFwiPiAgICA8dGV4dGFyZWEgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgcm93cz1cIjEwXCIgYXV0b2ZvY3VzPVwiYXV0b2ZvY3VzXCI+PC90ZXh0YXJlYT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWl0ZW12YWx1ZXNcIj4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1tb2RhbFxcJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yY29udGVudC1pdGVtdmFsdWVzXCI+ICAgIDxkaXYgc3R5bGU9XCJvdmVyZmxvdy15OiBhdXRvOyBvdmVyZmxvdy14OmhpZGRlbjsgbWF4LWhlaWdodDo0MDBweFwiPiAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj4gICAgICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS52YWx1ZVxcJylcIj48L3RoPiAgICAgICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50ZXh0XFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8L3RoZWFkPiAgICAgICAgICAgIDx0Ym9keT4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIHJvbGU9XCJncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4teHNcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkaW5kZXgoKSA+IDAsIGNsaWNrOiAkcGFyZW50Lm9uTW92ZVVwQ2xpY2tcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tYXJyb3ctdXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi14c1wiIHN0eWxlPVwiZmxvYXQ6bm9uZVwiIGRhdGEtYmluZD1cInZpc2libGU6ICRpbmRleCgpIDwgJHBhcmVudC5rb0l0ZW1zKCkubGVuZ3RoIC0gMSwgY2xpY2s6ICRwYXJlbnQub25Nb3ZlRG93bkNsaWNrXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWFycm93LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbm8tcGFkZGluZ1wiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNFcnJvciwgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmVudGVyTmV3VmFsdWVcXCcpXCI+PC9kaXY+ICAgICAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29UZXh0XCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgIDx0ZD48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4teHNcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXRyYXNoXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPjwvYnV0dG9uPjwvdGQ+ICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdGJvZHk+ICAgICAgICA8L3RhYmxlPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJvdyBidG4tdG9vbGJhclwiPiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFkZENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmFkZE5ld1xcJylcIiAvPiAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFuZ2VyXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQ2xlYXJDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5yZW1vdmVBbGxcXCcpXCIgLz4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1tYXRyaXhkcm9wZG93bmNvbHVtbnNcIj4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1tb2RhbFxcJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yY29udGVudC1tYXRyaXhkcm9wZG93bmNvbHVtbnNcIj4gICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj4gICAgICAgIDx0aGVhZD4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUucmVxdWlyZWRcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5jZWxsVHlwZVxcJylcIj48L3RoPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLm5hbWVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50aXRsZVxcJylcIj48L3RoPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90aGVhZD4gICAgICAgIDx0Ym9keT4gICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNDaG9pY2VzLCBjbGljazogb25TaG93Q2hvaWNlc0NsaWNrXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJnbHlwaGljb25cIiBkYXRhLWJpbmQ9XCJjc3M6IHtcXCdnbHlwaGljb24tY2hldnJvbi1kb3duXFwnOiAha29TaG93Q2hvaWNlcygpLCBcXCdnbHlwaGljb24tY2hldnJvbi11cFxcJzoga29TaG93Q2hvaWNlcygpfVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDwvYT4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJjaGVja2VkOiBrb0lzUmVxdWlyZWRcIiAvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczogY2VsbFR5cGVDaG9pY2VzLCB2YWx1ZToga29DZWxsVHlwZVwiICBzdHlsZT1cIndpZHRoOjExMHB4XCI+PC9zZWxlY3Q+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6a29OYW1lXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyIG5vLXBhZGRpbmdcIiByb2xlPVwiYWxlcnRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzRXJyb3IsIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5lbnRlck5ld1ZhbHVlXFwnKVwiPjwvZGl2PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1RpdGxlXCIgc3R5bGU9XCJ3aWR0aDoxMjBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5cIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmRlbGV0ZVxcJylcIi8+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDx0ciBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1Nob3dDaG9pY2VzKCkgJiYga29IYXNDaG9pY2VzKClcIj4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI0XCIgc3R5bGU9XCJib3JkZXItdG9wLXN0eWxlOm5vbmVcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tM1wiIGRhdGEtYmluZD1cInRleHQ6JHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmhhc090aGVyXFwnKVwiPjwvbGFiZWw+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJjaGVja2VkOiBrb0hhc090aGVyXCIgLz4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTdcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAha29IYXNDb2xDb3VudCgpXCI+PC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBjb2wtc20tM1wiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNDb2xDb3VudCwgdGV4dDokcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuY29sQ291bnRcXCcpXCI+PC9sYWJlbD4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sIGNvbC1zbS00XCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0hhc0NvbENvdW50LCBvcHRpb25zOiBjb2xDb3VudENob2ljZXMsIHZhbHVlOiBrb0NvbENvdW50XCIgc3R5bGU9XCJ3aWR0aDoxMTBweFwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keSBzdmRfbm90b3Bib3R0b21wYWRkaW5nc1wiPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3Jjb250ZW50LWl0ZW12YWx1ZXNcXCcsIGRhdGE6IGNob2ljZXNFZGl0b3IgfSAtLT4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgYnRuLXRvb2xiYXJcIj4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQWRkQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuYWRkTmV3XFwnKVwiLz4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXJcIiBkYXRhLWJpbmQ9XCJjbGljazogb25DbGVhckNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnJlbW92ZUFsbFxcJylcIlwiIC8+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLW1vZGFsXCI+ICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiIGRhdGEtYmluZD1cInZpc2libGU6IWVkaXRvci5pc0VkaXRhYmxlXCI+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHRcIj48L3NwYW4+ICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCI+ICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCJkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgc3R5bGU9XCJwYWRkaW5nOiAycHg7XCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ2RhdGEtdGFyZ2V0XFwnIDogbW9kYWxOYW1lVGFyZ2V0fVwiPiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZWRpdFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2J1dHRvbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgZGF0YS1iaW5kPVwidmlzaWJsZTplZGl0b3IuaXNFZGl0YWJsZVwiIHN0eWxlPVwiZGlzcGxheTp0YWJsZVwiPiAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwiZGlzcGxheTp0YWJsZS1jZWxsOyB3aWR0aDoxMDAlXCIgLz4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIHN0eWxlPVwiZGlzcGxheTp0YWJsZS1jZWxsOyBwYWRkaW5nOiAycHg7XCIgIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwnZGF0YS10YXJnZXRcXCcgOiBtb2RhbE5hbWVUYXJnZXR9XCI+ICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cImF0dHI6IHtpZCA6IG1vZGFsTmFtZX1cIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JnRpbWVzOzwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OmVkaXRvci50aXRsZVwiPjwvaDQ+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHN2ZF9ub3RvcGJvdHRvbXBhZGRpbmdzXCI+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yY29udGVudC1cXCcgKyBlZGl0b3JUeXBlLCBkYXRhOiBlZGl0b3IgfSAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYmluZD1cImNsaWNrOiBlZGl0b3Iub25BcHBseUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmFwcGx5XFwnKVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBlZGl0b3Iub25SZXNldENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnJlc2V0XFwnKVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgZGF0YS1iaW5kPVwidmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5jbG9zZVxcJylcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1udW1iZXJcIj4gICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cIm51bWJlclwiIGRhdGEtYmluZD1cInZhbHVlOiBrb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXJlc3RmdWxsXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtcmVzdGZ1bGxcIj4gICAgPGZvcm0+ICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1cmxcIj5Vcmw6PC9sYWJlbD4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJ1cmxcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVXJsXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiAvPiAgICAgICAgPC9kaXY+ICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXRoXCI+UGF0aDo8L2xhYmVsPiAgICAgICAgICAgIDxpbnB1dCBpZD1cInBhdGhcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvUGF0aFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidmFsdWVOYW1lXCI+dmFsdWVOYW1lOjwvbGFiZWw+ICAgICAgICAgICAgPGlucHV0IGlkPVwidmFsdWVOYW1lXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1ZhbHVlTmFtZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidGl0bGVOYW1lXCI+dGl0bGVOYW1lOjwvbGFiZWw+ICAgICAgICAgICAgPGlucHV0IGlkPVwidGl0bGVOYW1lXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1RpdGxlTmFtZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz4gICAgICAgIDwvZGl2PiAgICA8L2Zvcm0+ICAgIDxkaXYgaWQ9XCJyZXN0ZnVsbFN1cnZleVwiIHN0eWxlPVwid2lkdGg6MTAwJTtoZWlnaHQ6MTUwcHhcIj48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXN0cmluZ1wiPiAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBrb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXRleHRcIj4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1tb2RhbFxcJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yY29udGVudC10ZXh0XCI+ICAgIDx0ZXh0YXJlYSBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiByb3dzPVwiMTBcIiBhdXRvZm9jdXM9XCJhdXRvZm9jdXNcIj48L3RleHRhcmVhPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdGV4dGl0ZW1zXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdGV4dGl0ZW1zXCI+PGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLm5hbWVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50aXRsZVxcJylcIj48L3RoPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90aGVhZD4gICAgICAgIDx0Ym9keT4gICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05hbWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1RpdGxlXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5cIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmRlbGV0ZVxcJylcIi8+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFkZENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmFkZE5ld1xcJylcIi8+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXRyaWdnZXJzXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdHJpZ2dlcnNcIj48ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgPGRpdiBjbGFzcz1cInJvd1wiIHN0eWxlPVwibWFyZ2luLWJvdHRvbToxMHB4XCI+ICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTEyXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwIGZvcm0taW5saW5lXCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBhdmFpbGFibGVUcmlnZ2VycyAtLT4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25BZGRDbGljaygkZGF0YSlcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgIDwvdWw+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ2tvVGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgICAgICA8L3NwYW4+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZCgpID09IG51bGxcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29RdWVzdGlvbnMoKS5sZW5ndGggPT0gMCwgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLm5vcXVlc3Rpb25zXFwnKVwiPjwvZGl2PiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1F1ZXN0aW9ucygpLmxlbmd0aCA+IDAsIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5jcmVhdGV0cmlnZ2VyXFwnKVwiPjwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbFwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ3aXRoOiBrb1NlbGVjdGVkXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiICBzdHlsZT1cIm1hcmdpbi1ib3R0b206MTBweFwiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTQgY29sLXNtLTRcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCAgZm9ybS1pbmxpbmVcIj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwXCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRyaWdnZXJPblxcJylcIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6JHBhcmVudC5rb1F1ZXN0aW9ucywgdmFsdWU6IGtvTmFtZVwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTQgY29sLXNtLTRcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOmF2YWlsYWJsZU9wZXJhdG9ycywgb3B0aW9uc1ZhbHVlOiBcXCduYW1lXFwnLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6a29PcGVyYXRvclwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTQgY29sLXNtLTRcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29SZXF1aXJlVmFsdWUsIHZhbHVlOmtvVmFsdWVcIiAvPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0ga28gaWY6IGtvVHlwZSgpID09IFxcJ3Zpc2libGV0cmlnZ2VyXFwnIC0tPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy02IGNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzaXRlbXNcXCcsIGRhdGE6IHBhZ2VzIH0gLS0+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbGctNiBjb2wtc20tNlwiPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zXFwnLCBkYXRhOiBxdWVzdGlvbnMgfSAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8IS0tIGtvIGlmOiBrb1R5cGUoKSA9PSBcXCdjb21wbGV0ZXRyaWdnZXJcXCcgLS0+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJtYXJnaW46IDEwcHhcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudHJpZ2dlckNvbXBsZXRlVGV4dFxcJylcIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8IS0tIGtvIGlmOiBrb1R5cGUoKSA9PSBcXCdzZXR2YWx1ZXRyaWdnZXJcXCcgLS0+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLWxnLTQgY29sLXNtLTRcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cCBmb3JtLWlubGluZVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50cmlnZ2VyU2V0VG9OYW1lXFwnKVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvc2V0VG9OYW1lXCIgLz4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy00IGNvbC1zbS00XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgZm9ybS1pbmxpbmVcIj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudHJpZ2dlclNldFZhbHVlXFwnKVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvc2V0VmFsdWVcIiAvPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy00IGNvbC1zbS00XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiY2hlY2tlZDoga29pc1ZhcmlhYmxlXCIgLz4gPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRyaWdnZXJJc1ZhcmlhYmxlXFwnKVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1sZy04IGNvbC1zbS04XCI+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1wiPiAgICA8ZGl2IGNsYXNzPVwicGFuZWwgbm8tbWFyZ2lucyBuby1wYWRkaW5nXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjEwcHhcIj48L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBtdWx0aXBsZT1cIm11bHRpcGxlXCIgZGF0YS1iaW5kPVwib3B0aW9uczprb0Nob29zZW4sIHZhbHVlOiBrb0Nob29zZW5TZWxlY3RlZFwiPjwvc2VsZWN0PiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0Nob29zZW5TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgY2xhc3M9XCJidG5cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjVweFwiPiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOmtvT2JqZWN0cywgdmFsdWU6IGtvU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkFkZENsaWNrXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICA8L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci12YWxpZGF0b3JzXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdmFsaWRhdG9yc1wiPjxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBpbnB1dC1ncm91cFwiPiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZHJvcGRvd24tdG9nZ2xlIGlucHV0LWdyb3VwLWFkZG9uXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+ICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPiAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBhdmFpbGFibGVWYWxpZGF0b3JzIC0tPiAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkFkZENsaWNrKCRkYXRhKVwiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6JGRhdGFcIj48L3NwYW4+PC9hPjwvbGk+ICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICA8L3VsPiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOiBrb0l0ZW1zLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25EZWxldGVDbGlja1wiIGNsYXNzPVwiYnRuXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICA8L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBzZWxlY3RlZE9iamVjdEVkaXRvciB9XCI+PC9kaXY+PC9kaXY+PC9zY3JpcHQ+JztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdGVtcGxhdGVFZGl0b3Iua28uaHRtbC50cyIsImV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGRhdGEtYmluZD1cImV2ZW50OnsgICAgICAgICAgIGRyYWdlbnRlcjpmdW5jdGlvbihlbCwgZSl7IGRyYWdFbnRlcihlKTt9LCAgICAgICAgICAgZHJhZ2xlYXZlOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0xlYXZlKGUpO30sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IHJldHVybiBmYWxzZTt9LCAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7IGRyYWdEcm9wKGUpO319ICAgICBcIj4gICAgPGg0IGRhdGEtYmluZD1cInZpc2libGU6ICh0aXRsZS5sZW5ndGggPiAwKSAmJiBkYXRhLnNob3dQYWdlVGl0bGVzLCB0ZXh0OiBrb05vKCkgKyBwcm9jZXNzZWRUaXRsZSwgY3NzOiAkcm9vdC5jc3MucGFnZVRpdGxlXCI+PC9oND4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHJvd3MsIGFzOiBcXCdyb3dcXCd9IC0tPiAgICA8ZGl2IGNsYXNzPVwic3ZkX3F1ZXN0aW9uX2NvbnRhaW5lclwiIGRhdGEtYmluZD1cInZpc2libGU6IHJvdy5rb1Zpc2libGUsIGNzczogJHJvb3QuY3NzLnJvd1wiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHJvdy5xdWVzdGlvbnMsIGFzOiBcXCdxdWVzdGlvblxcJyAsIGFmdGVyUmVuZGVyOiByb3cua29BZnRlclJlbmRlciB9IC0tPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24ua29Jc0RyYWdnaW5nXCI+ICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgaWY6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiAkcm9vdC5rb0RyYWdnaW5nU291cmNlKCksIGFzOiBcXCdxdWVzdGlvblxcJywgdGVtcGxhdGVPcHRpb25zOiB7IGlzRHJhZ2dpbmc6IHRydWUgfSB9IC0tPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvblxcJywgZGF0YTogcXVlc3Rpb24sIHRlbXBsYXRlT3B0aW9uczogeyBpc0RyYWdnaW5nOiBmYWxzZSB9IH0gLS0+ICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8ZGl2IGNsYXNzPVwid2VsbFwiIGRhdGEtYmluZD1cInZpc2libGU6JHJvb3QuaXNEZXNpZ25Nb2RlICYmIHF1ZXN0aW9ucy5sZW5ndGggPT0gMFwiPiAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogIWtvRHJhZ2dpbmdCb3R0b20oKSwgdGV4dDokcm9vdC5nZXRFZGl0b3JMb2NTdHJpbmcoXFwnc3VydmV5LmRyb3BRdWVzdGlvblxcJylcIj48L3NwYW4+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvRHJhZ2dpbmdCb3R0b21cIj4gICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IGlmOiAkcm9vdC5rb0RyYWdnaW5nU291cmNlKCksIG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvblxcJywgZGF0YTogJHJvb3Qua29EcmFnZ2luZ1NvdXJjZSgpLCBhczogXFwncXVlc3Rpb25cXCcsIHRlbXBsYXRlT3B0aW9uczogeyBpc0RyYWdnaW5nOiB0cnVlIH0gfSAtLT4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbnMubGVuZ3RoID4gMCAmJiBrb0RyYWdnaW5nQm90dG9tKClcIj4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgaWY6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiAkcm9vdC5rb0RyYWdnaW5nU291cmNlKCksIGFzOiBcXCdxdWVzdGlvblxcJywgdGVtcGxhdGVPcHRpb25zOiB7IGlzRHJhZ2dpbmc6IHRydWUgfSB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgIDwvZGl2PjwvZGl2Pic7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RlbXBsYXRlX3BhZ2UuaHRtbC50cyIsImV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwic3ZkX3F1ZXN0aW9uXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIiBkYXRhLWJpbmQ9XCJzdHlsZToge2Rpc3BsYXk6IHF1ZXN0aW9uLmtvVmlzaWJsZSgpfHwgJHJvb3QuaXNEZXNpZ25Nb2RlID8gXFwnaW5saW5lLWJsb2NrXFwnOiBcXCdub25lXFwnLCBtYXJnaW5MZWZ0OiBxdWVzdGlvbi5rb01hcmdpbkxlZnQsIHBhZGRpbmdSaWdodDogcXVlc3Rpb24ua29QYWRkaW5nUmlnaHQsIHdpZHRoOiBxdWVzdGlvbi5rb1JlbmRlcldpZHRoIH0sICAgICBhdHRyIDoge2lkOiBpZCwgZHJhZ2dhYmxlOiAkcm9vdC5pc0Rlc2lnbk1vZGV9LCBjbGljazogJHJvb3QuaXNEZXNpZ25Nb2RlID8ga29PbkNsaWNrOiBudWxsLCAgICAgICAgICBldmVudDp7ICAgICAgICAgICBrZXlkb3duOiBmdW5jdGlvbihlbCwgZSkgeyBpZihlLndpdGNoID09IDQ2KSAkcm9vdC5kZWxldGVDdXJyZW50T2JqZWN0Q2xpY2soKTsgcmV0dXJuIHRydWU7IH0sICAgICAgICAgICBkcmFnc3RhcnQ6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnU3RhcnQoZSk7IHJldHVybiB0cnVlOyB9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyBpZighcXVlc3Rpb24uaXNEcmFnZ2luZykgZHJhZ092ZXIoZSk7fSwgICAgICAgICAgIGRyYWdlbmQ6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnRW5kKGUpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fSAgICAgICAgIH0sIGNzczp7c3ZkX3FfZGVzaWduX2JvcmRlcjogJHJvb3QuaXNEZXNpZ25Nb2RlLCBzdmRfcV9zZWxlY3RlZCA6IGtvSXNTZWxlY3RlZCwgXFwnd2VsbCB3ZWxsLXNtXFwnOiAkcm9vdC5pc0Rlc2lnbk1vZGV9XCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOntzdmRfcV9kZXNpZ246ICRyb290LmlzRGVzaWduTW9kZX0sIHN0eWxlOntvcGFjaXR5OiBxdWVzdGlvbi5rb0lzRHJhZ2dpbmdTb3VyY2UoKSA/IDAuNCA6IDF9XCI+ICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIgcm9sZT1cImFsZXJ0XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29FcnJvcnMoKS5sZW5ndGggPiAwLCBmb3JlYWNoOiBrb0Vycm9yc1wiPiAgICAgICAgICAgIDxkaXY+ICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1leGNsYW1hdGlvbi1zaWduXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhLmdldFRleHQoKVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPCEtLSBrbyBpZjogcXVlc3Rpb24uaGFzVGl0bGUgLS0+ICAgICAgICA8aDUgZGF0YS1iaW5kPVwidmlzaWJsZTogJHJvb3QucXVlc3Rpb25UaXRsZUxvY2F0aW9uID09IFxcJ3RvcFxcJywgdGV4dDogcXVlc3Rpb24ua29UaXRsZSgpLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi50aXRsZVwiPjwvaDU+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArIHF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogcXVlc3Rpb24gfSAtLT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNDb21tZW50XCI+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZXh0OnF1ZXN0aW9uLmNvbW1lbnRUZXh0XCI+PC9kaXY+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogdHJ1ZSB9IH1cIj48L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPCEtLSBrbyBpZjogcXVlc3Rpb24uaGFzVGl0bGUgLS0+ICAgICAgICA8aDUgZGF0YS1iaW5kPVwidmlzaWJsZTogJHJvb3QucXVlc3Rpb25UaXRsZUxvY2F0aW9uID09IFxcJ2JvdHRvbVxcJywgdGV4dDogcXVlc3Rpb24ua29UaXRsZSgpLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi50aXRsZVwiPjwvaDU+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJzdmRfcXVlc3Rpb25fbWVudVwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTZWxlY3RlZFwiPiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgIGJ0bi14cyBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tb3B0aW9uLWhvcml6b250YWxcIj48L3NwYW4+ICAgICAgICA8L2J1dHRvbj4gICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gICAgICAgICAgICA8bGk+ICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRyb290LmNvcHlRdWVzdGlvbkNsaWNrLCB0ZXh0OiRyb290LmdldEVkaXRvckxvY1N0cmluZyhcXCdzdXJ2ZXkuYWRkVG9Ub29sYm94XFwnKVwiPjwvYnV0dG9uPiAgICAgICAgICAgIDwvbGk+ICAgICAgICAgICAgPGxpPiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi14c1wiIGRhdGEtYmluZD1cImNsaWNrOiAkcm9vdC5mYXN0Q29weVF1ZXN0aW9uQ2xpY2ssIHRleHQ6JHJvb3QuZ2V0RWRpdG9yTG9jU3RyaW5nKFxcJ3N1cnZleS5jb3B5XFwnKVwiPjwvYnV0dG9uPiAgICAgICAgICAgIDwvbGk+ICAgICAgICAgICAgPGxpPiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi14c1wiIGRhdGEtYmluZD1cImNsaWNrOiAkcm9vdC5kZWxldGVDdXJyZW50T2JqZWN0Q2xpY2ssIHRleHQ6JHJvb3QuZ2V0RWRpdG9yTG9jU3RyaW5nKFxcJ3N1cnZleS5kZWxldGVRdWVzdGlvblxcJylcIj48L2J1dHRvbj4gICAgICAgICAgICA8L2xpPiAgICAgICAgPC91bD4gICAgPC9kaXY+PC9kaXY+JztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdGVtcGxhdGVfcXVlc3Rpb24uaHRtbC50cyJdLCJzb3VyY2VSb290IjoiIn0=