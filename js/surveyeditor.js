/*!
* surveyjs Editor v0.10.0
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
	    function DragDropHelper(data, onModifiedCallback) {
	        this.data = data;
	        this.onModifiedCallback = onModifiedCallback;
	    }
	    Object.defineProperty(DragDropHelper.prototype, "survey", {
	        get: function get() {
	            return this.data;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DragDropHelper.prototype.startDragNewQuestion = function (event, questionType, questionName) {
	        this.setData(event, DragDropHelper.dataStart + "questiontype:" + questionType + ",questionname:" + questionName);
	    };
	    DragDropHelper.prototype.startDragQuestion = function (event, questionName) {
	        this.setData(event, DragDropHelper.dataStart + "questionname:" + questionName);
	    };
	    DragDropHelper.prototype.startDragCopiedQuestion = function (event, questionName, questionJson) {
	        this.setData(event, DragDropHelper.dataStart + "questionname:" + questionName, questionJson);
	    };
	    DragDropHelper.prototype.isSurveyDragging = function (event) {
	        if (!event) return false;
	        var data = this.getData(event).text;
	        return data && data.indexOf(DragDropHelper.dataStart) == 0;
	    };
	    DragDropHelper.prototype.doDragDropOver = function (event, question) {
	        event = this.getEvent(event);
	        if (!question || !this.isSurveyDragging(event) || this.isSamePlace(event, question)) return;
	        var index = this.getQuestionIndex(event, question);
	        this.survey.currentPage["koDragging"](index);
	    };
	    DragDropHelper.prototype.doDrop = function (event, question) {
	        if (question === void 0) {
	            question = null;
	        }
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        }
	        if (!this.isSurveyDragging(event)) return;
	        this.survey.currentPage["koDragging"](-1);
	        var index = this.getQuestionIndex(event, question);
	        var dataInfo = this.getDataInfo(event);
	        this.clearData();
	        if (!dataInfo) return;
	        var targetQuestion = null;
	        var json = dataInfo["json"];
	        if (json) {
	            targetQuestion = Survey.QuestionFactory.Instance.createQuestion(json["type"], name);
	            new Survey.JsonObject().toObject(json, targetQuestion);
	            targetQuestion.name = dataInfo["questionname"];
	        }
	        if (!targetQuestion) {
	            targetQuestion = this.survey.getQuestionByName(dataInfo["questionname"]);
	        }
	        if (!targetQuestion && dataInfo["questiontype"]) {
	            targetQuestion = Survey.QuestionFactory.Instance.createQuestion(dataInfo["questiontype"], dataInfo["questionname"]);
	        }
	        if (!targetQuestion) return;
	        this.moveQuestionTo(targetQuestion, index);
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
	    DragDropHelper.prototype.getEvent = function (event) {
	        return event["originalEvent"] ? event["originalEvent"] : event;
	    };
	    DragDropHelper.prototype.moveQuestionTo = function (targetQuestion, index) {
	        if (targetQuestion == null) return;
	        var page = this.survey.getPageByQuestion(targetQuestion);
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
	        DragDropHelper.dragData = { text: "", json: null };
	        var prev = DragDropHelper.prevEvent;
	        prev.question = null;
	        prev.x = -1;
	        prev.y = -1;
	    };
	    DragDropHelper.dataStart = "surveyjs,";
	    DragDropHelper.dragData = { text: "", json: null };
	    DragDropHelper.prevEvent = { question: null, x: -1, y: -1 };
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
	        copy: "Copy"
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
	        text: "Text"
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
	        designer: "Designer",
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
	        this.propertyEditorOptions = propertyEditorOptions;
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
	        this.koVisibleHtml = ko.computed(function () {
	            return self.koLibraryVersion() == "react" || self.koShowAsWindow() == "page";
	        });
	        this.koLibraryVersion.subscribe(function (newValue) {
	            self.setHeadText();self.surveyEmbedingJava.setValue(self.getJavaText());
	        });
	        this.koShowAsWindow.subscribe(function (newValue) {
	            self.surveyEmbedingJava.setValue(self.getJavaText());
	        });
	        this.koScriptUsing.subscribe(function (newValue) {
	            self.setHeadText();self.surveyEmbedingJava.setValue(self.getJavaText());
	        });
	        this.koLoadSurvey.subscribe(function (newValue) {
	            self.surveyEmbedingJava.setValue(self.getJavaText());
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
	    SurveyEmbedingWindow.prototype.show = function () {
	        if (this.surveyEmbedingHead == null) {
	            this.surveyEmbedingHead = this.createEditor("surveyEmbedingHead");
	            this.setHeadText();
	            var bodyEditor = this.createEditor("surveyEmbedingBody");
	            bodyEditor.setValue("<div id= \"mySurveyJSName\" ></div>");
	            this.surveyEmbedingJava = this.createEditor("surveyEmbedingJava");
	        }
	        this.koHasIds(this.surveyId && this.surveyPostId);
	        this.surveyEmbedingJava.setValue(this.getJavaText());
	    };
	    SurveyEmbedingWindow.prototype.setHeadText = function () {
	        var str = "";
	        if (this.koLibraryVersion() == "knockout") {
	            str = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js\"></script>\n<script src=\"js/survey.ko.min.js\"></script>";
	        } else {
	            str = "<script src=\"https://fb.me/react-0.14.8.js\"></script>\n<script src= \"https://fb.me/react-dom-0.14.8.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js\"></script>\n";
	            str += "<script src=\"js/survey.react.bootstrap.min.js\"></script>";
	        }
	        if (this.koScriptUsing() != "bootstrap") {
	            str += "\n<link href=\"css/survey.css\" type=\"text/css\" rel=\"stylesheet\" />";
	        }
	        this.surveyEmbedingHead.setValue(str);
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
	
	var _textWorker = __webpack_require__(17);
	
	var _undoredo = __webpack_require__(21);
	
	var _surveyHelper = __webpack_require__(8);
	
	var _dragdrophelper = __webpack_require__(1);
	
	var _json = __webpack_require__(18);
	
	var _templateEditorKo = __webpack_require__(24);
	
	var _template_page = __webpack_require__(25);
	
	var _template_question = __webpack_require__(26);
	
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
	        this.surveyId = null;
	        this.surveyPostId = null;
	        this.alwaySaveTextInPropertyEditors = false;
	        this.saveNo = 0;
	        this.timeoutId = -1;
	        this.options = options;
	        this.questionTypes = this.getQuestionTypes();
	        this.koCopiedQuestions = ko.observableArray();
	        this.koCanDeleteObject = ko.observable(false);
	        var self = this;
	        this.koState = ko.observable();
	        this.koShowSaveButton = ko.observable(false);
	        this.koShowOptions = ko.observable(false);
	        this.koTestSurveyWidth = ko.observable("100%");
	        this.saveButtonClick = function () {
	            self.doSave();
	        };
	        this.koObjects = ko.observableArray();
	        this.koSelectedObject = ko.observable();
	        this.koSelectedObject.subscribe(function (newValue) {
	            self.selectedObjectChanged(newValue != null ? newValue.value : null);
	        });
	        this.koGenerateValidJSON = ko.observable(this.options && this.options.generateValidJSON);
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
	        this.doUndoClick = function () {
	            self.doUndoRedo(self.undoRedo.undo());
	        };
	        this.doRedoClick = function () {
	            self.doUndoRedo(self.undoRedo.redo());
	        };
	        if (renderedElement) {
	            this.render(renderedElement);
	        }
	    }
	    Object.defineProperty(SurveyEditor.prototype, "survey", {
	        get: function get() {
	            return this.surveyValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    SurveyEditor.prototype.render = function (element) {
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
	            return this.jsonEditor != null ? this.jsonEditor.getValue() : "";
	        },
	        set: function set(value) {
	            this.textWorker = new _textWorker.SurveyTextWorker(value);
	            if (this.textWorker.isJsonCorrect) {
	                this.initSurvey(new Survey.JsonObject().toJsonObject(this.textWorker.survey));
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
	    SurveyEditor.prototype.setTextValue = function (value) {
	        this.isProcessingImmediately = true;
	        if (this.jsonEditor) {
	            this.jsonEditor.setValue(value);
	            this.jsonEditor.renderer.updateFull(true);
	        }
	        this.processJson(value);
	        this.isProcessingImmediately = false;
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
	        if (this.koViewType() != "editor" || !this.textWorker) return true;
	        if (!this.textWorker.isJsonCorrect) {
	            alert(this.getLocString("ed.correctJSON"));
	            return false;
	        }
	        this.initSurvey(new Survey.JsonObject().toJsonObject(this.textWorker.survey));
	        return true;
	    };
	    SurveyEditor.prototype.showDesigner = function () {
	        if (!this.canSwitchViewType("designer")) return;
	        this.koViewType("designer");
	    };
	    SurveyEditor.prototype.showJsonEditor = function () {
	        if (this.koViewType() == "editor") return;
	        this.jsonEditor.setValue(this.getSurveyTextFromDesigner());
	        this.jsonEditor.focus();
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
	        this.jsonEditor = ace.edit("surveyjsEditor");
	        this.surveyjsExample = document.getElementById("surveyjsExample");
	        this.initSurvey(new _json.SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText));
	        this.setUndoRedoCurrentState(true);
	        this.surveyValue.mode = "designer";
	        this.surveyValue.render(this.surveyjs);
	        this.initJsonEditor();
	        _textWorker.SurveyTextWorker.newLineChar = this.jsonEditor.session.doc.getNewLineCharacter();
	    };
	    SurveyEditor.prototype.initJsonEditor = function () {
	        var self = this;
	        this.jsonEditor.setTheme("ace/theme/monokai");
	        this.jsonEditor.session.setMode("ace/mode/json");
	        this.jsonEditor.setShowPrintMargin(false);
	        this.jsonEditor.getSession().on("change", function () {
	            self.onJsonEditorChanged();
	        });
	        this.jsonEditor.getSession().setUseWorker(true);
	    };
	    SurveyEditor.prototype.initSurvey = function (json) {
	        this.surveyValue = new Survey.Survey(json);
	        if (this.surveyValue.isEmpty) {
	            this.surveyValue = new Survey.Survey(new _json.SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText));
	        }
	        this.survey.mode = "designer";
	        this.survey.render(this.surveyjs);
	        this.surveyObjects.survey = this.survey;
	        this.pagesEditor.survey = this.survey;
	        this.pagesEditor.setSelectedPage(this.survey.currentPage);
	        this.surveyVerbs.survey = this.survey;
	        var self = this;
	        this.surveyValue["onSelectedQuestionChanged"].add(function (sender, options) {
	            self.surveyObjects.selectObject(sender["selectedQuestionValue"]);
	        });
	        this.surveyValue["onCopyQuestion"].add(function (sender, options) {
	            self.copyQuestion(self.koSelectedObject().value);
	        });
	        this.surveyValue["onCreateDragDropHelper"] = function () {
	            return self.createDragDropHelper();
	        };
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
	    SurveyEditor.prototype.onJsonEditorChanged = function () {
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
	            }, SurveyEditor.updateTextTimeout);
	        }
	    };
	    SurveyEditor.prototype.processJson = function (text) {
	        this.textWorker = new _textWorker.SurveyTextWorker(text);
	        if (this.jsonEditor) {
	            this.jsonEditor.getSession().setAnnotations(this.createAnnotations(text, this.textWorker.errors));
	        }
	    };
	    SurveyEditor.prototype.doDraggingQuestion = function (questionType, e) {
	        this.createDragDropHelper().startDragNewQuestion(e, questionType, this.getNewQuestionName());
	    };
	    SurveyEditor.prototype.doDraggingCopiedQuestion = function (json, e) {
	        this.createDragDropHelper().startDragCopiedQuestion(e, this.getNewQuestionName(), json);
	    };
	    SurveyEditor.prototype.createDragDropHelper = function () {
	        var self = this;
	        return new _dragdrophelper.DragDropHelper(this.survey, function () {
	            self.setModified();
	        });
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
	        if (this.textWorker.isJsonCorrect) return new Survey.JsonObject().toJsonObject(this.textWorker.survey);
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
	    SurveyEditor.updateTextTimeout = 1000;
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
	    this.onCreateDragDropHelper = null;
	    var self = this;
	    this.copyQuestionClick = function () {
	        self.onCopyQuestion.fire(self);
	    };
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
	            self.koDraggingBottom(question == null);
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
	        self.dragEnterCounter--;if (self.dragEnterCounter === 0) self.koDragging(-1);
	    };
	    this.dragDrop = function (e) {
	        self.doDrop(e);
	    };
	};
	Survey.Page.prototype["doDrop"] = function (e) {
	    var dragDropHelper = this.data["onCreateDragDropHelper"] ? this.data["onCreateDragDropHelper"]() : new _dragdrophelper.DragDropHelper(this.data, null);
	    dragDropHelper.doDrop(e);
	};
	Survey.Page.prototype["doDragEnter"] = function (e) {
	    if (this.questions.length > 0 || this.koDragging() > 0) return;
	    if (new _dragdrophelper.DragDropHelper(this.data, null).isSurveyDragging(e)) {
	        this.koDragging(this.questions.length);
	    }
	};
	Survey.QuestionBase.prototype["onCreating"] = function () {
	    var self = this;
	    this.dragDropHelperValue = null;
	    this.koIsDragging = ko.observable(false);
	    this.dragDropHelper = function () {
	        if (self.dragDropHelperValue == null) {
	            self.dragDropHelperValue = self.data["onCreateDragDropHelper"] ? self.data["onCreateDragDropHelper"]() : new _dragdrophelper.DragDropHelper(self.data, null);
	            ;
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
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var html = exports.html = '<div class="row nav-tabs">    <nav class="navbar-default">        <div class="container-fluid">            <div class="collapse navbar-collapse">                <ul class="nav nav-tabs no-borders">                    <li data-bind="css: {active: koViewType() == \'designer\'}"><a href="#" data-bind="click:selectDesignerClick, text: $root.getLocString(\'ed.designer\')"></a></li>                    <li data-bind="css: {active: koViewType() == \'editor\'}"><a href="#" data-bind="click:selectEditorClick, text: $root.getLocString(\'ed.jsonEditor\')"></a></li>                    <li data-bind="css: {active: koViewType() == \'test\'}"><a href="#" data-bind="click:selectTestClick, text: $root.getLocString(\'ed.testSurvey\')"></a></li>                    <li data-bind="css: {active: koViewType() == \'embed\'}"><a href="#" data-bind="click:selectEmbedClick, text: $root.getLocString(\'ed.embedSurvey\')"></a></li>                    <li data-bind="visible: koShowSaveButton"><button type="button" class="btn btn-default" data-bind="click: saveButtonClick"><span data-bind="text: $root.getLocString(\'ed.saveSurvey\')"></span></button></li>                    <li data-bind="visible: koIsShowDesigner" style="margin-left:5px"><button type="button" class="btn btn-default" data-bind="enable:undoRedo.koCanUndo, click: doUndoClick"><span data-bind="text: $root.getLocString(\'ed.undo\')"></span></button></li>                    <li data-bind="visible: koIsShowDesigner" style="margin-left:5px"><button type="button" class="btn btn-default" data-bind="enable:undoRedo.koCanRedo, click: doRedoClick"><span data-bind="text: $root.getLocString(\'ed.redo\')"></span></button></li>                    <li data-bind="visible: koIsShowDesigner() && koShowOptions()" style="margin-left:5px">                        <div class="btn-group">                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bind="text: $root.getLocString(\'ed.options\')">                                Options <span class="caret"></span>                            </button>                            <ul class="dropdown-menu">                                <li data-bind="css: {active: koGenerateValidJSON}"><a href="#" data-bind="click:generateValidJSONClick, text: $root.getLocString(\'ed.generateValidJSON\')"></a></li>                                <li data-bind="css: {active: !koGenerateValidJSON()}"><a href="#" data-bind="click:generateReadableJSONClick, text: $root.getLocString(\'ed.generateReadableJSON\')"></a></li>                            </ul>                        </div>                    </li>                    <li data-bind="visible: koViewType() == \'test\'" style="margin-left:5px">                        <select style="margin-top: 10px" data-bind="value: koTestSurveyWidth">                            <option value="100%" data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \'100%\'"></option>                            <option value="1200px" data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \'1200px\'"></option>                            <option value="1000px" data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \'1000px\'"></option>                            <option value="800px" data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \'800px\'"></option>                            <option value="600px" data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \'600px\'"></option>                            <option value="400px" data-bind="text: $root.getLocString(\'ed.testSurveyWidth\') + \'400px\'"></option>                        </select>                    </li>                </ul>                </div>        </div>    </nav> </div><div class="panel" style="width:100%">    <div id="surveyjsEditor" data-bind="visible: koViewType() == \'editor\'" style="height:450px;width:100%"></div>    <div id="surveyjsTest" data-bind="visible: koViewType() == \'test\', style: {width: koTestSurveyWidth}" style="margin: 10px">        <div id="surveyjsExample"></div>        <div id="surveyjsExampleResults"></div>        <button id="surveyjsExamplereRun" data-bind="click:selectTestClick, text: $root.getLocString(\'ed.testSurveyAgain\')" style="display:none">Test Again</button>    </div>    <div id="surveyjsEmbed" data-bind="visible: koViewType() == \'embed\'" style="margin: 10px">        <div data-bind="template: { name: \'surveyembeding\', data: surveyEmbeding }"></div>    </div>    <div class="row"  data-bind="visible: koViewType() == \'designer\'">        <div class="row col-md-9">            <div class="col-md-3">                <div class="panel panel-default" style="width:100%">                    <div class="panel-heading">                        <b data-bind="text: $root.getLocString(\'ed.toolbox\')"></b>                    </div>                    <div class="btn-group-vertical" style="width:100%;padding-right:2px">                        <!-- ko foreach: questionTypes -->                        <div class="btn btn-default" style="text-align:left; padding-left:10px; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}}">                            <span data-bind="text: $root.getLocString(\'qt.\' + $data)"></span>                        </div>                        <!-- /ko  -->                        <!-- ko foreach: koCopiedQuestions -->                        <div class="btn btn-primary" style="text-align:left; padding-left:10px; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickCopiedQuestion, event:{dragstart: function(el, e) { $parent.draggingCopiedQuestion($data, e); return true;}}">                            <span data-bind="text:name"></span>                        </div>                        <!-- /ko  -->                    </div>                </div>            </div>            <div class="col-md-9">                <div data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>                <div style="overflow-y: scroll;height:450px;">                    <div id="surveyjs" style="width:100%"></div>                </div>            </div>        </div>        <div class="col-md-3">            <div class="panel panel-default" style="width:100%">                <div class="panel-heading">                    <div class="input-group">                        <select class="form-control" data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                        <span class="input-group-btn">                            <button class="btn btn-default" type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject, attr: { title: $root.getLocString(\'ed.delSelObject\')}"><span class="glyphicon glyphicon-remove"></span></button>                        </span>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                <div class="panel-footer" data-bind="visible:surveyVerbs.koHasVerbs">                    <div data-bind="template: { name: \'objectverbs\', data: surveyVerbs }"></div>                </div>            </div>        </div>    </div></div><script type="text/html" id="objecteditor">    <table class="table svd_table-nowrap">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), css: {\'active\': $parent.koActiveProperty() == $data}">                <td data-bind="text: displayName, attr: {title: title}" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data, attr: {title: koText}, style: {color: koIsDefault() ? \'gray\' : \'\'}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data">                        <!-- ko template: { name: \'propertyeditor-\' + editorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="objectverbs">    <!-- ko foreach: koVerbs -->        <div class="row">            <div class="input-group">                <span  class="input-group-addon" data-bind="text:text"></span>                <select class="form-control" data-bind="options: koItems, optionsText: \'text\', optionsValue:\'value\', value: koSelectedItem"></select>            </div>        </div>    <!-- /ko  --></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs" data-bind="tabs:true">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()},event:{           keydown:function(el, e){ $parent.keyDown(el, e); },           dragstart:function(el, e){ $parent.dragStart(el); return true; },           dragover:function(el, e){ $parent.dragOver(el);},           dragend:function(el, e){ $parent.dragEnd();},           drop:function(el, e){ $parent.dragDrop(el);}         }">             <a href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button type="button" class="btn btn-default" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="surveyembeding">    <div class="row">        <select data-bind="value:koLibraryVersion">            <option value="knockout" data-bind="text: $root.getLocString(\'ew.knockout\')"></option>            <option value="react" data-bind="text: $root.getLocString(\'ew.react\')"></option>        </select>        <select data-bind="value:koScriptUsing">            <option value="bootstrap" data-bind="text: $root.getLocString(\'ew.bootstrap\')"></option>            <option value="standard" data-bind="text: $root.getLocString(\'ew.standard\')"></option>        </select>        <select data-bind="value:koShowAsWindow">            <option value="page" data-bind="text: $root.getLocString(\'ew.showOnPage\')"></option>            <option value="window" data-bind="text: $root.getLocString(\'ew.showInWindow\')"></option>        </select>        <label class="checkbox-inline" data-bind="visible:koHasIds">            <input type="checkbox" data-bind="checked:koLoadSurvey" />            <span data-bind="text: $root.getLocString(\'ew.loadFromServer\')"></span>        </label>    </div>    <div class="panel">        <div class="panel-heading" data-bind="text: $root.getLocString(\'ew.titleScript\')"></div>        <div id="surveyEmbedingHead" style="height:70px;width:100%"></div>    </div>    <div class="panel" data-bind="visible: koVisibleHtml">        <div class="panel-heading"  data-bind="text: $root.getLocString(\'ew.titleHtml\')"></div>        <div id="surveyEmbedingBody" style="height:30px;width:100%"></div>    </div>    <div class="panel">        <div class="panel-heading"  data-bind="text: $root.getLocString(\'ew.titleJavaScript\')"></div>        <div id="surveyEmbedingJava" style="height:300px;width:100%"></div>    </div></script><script type="text/html" id="propertyeditor-boolean">    <input type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <select data-bind="value: koValue, options: choices"  style="width:100%"></select></script><script type="text/html" id="propertyeditor-html">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-html">    <textarea data-bind="value:koValue" style="width:100%" rows="10" autofocus="autofocus"></textarea></script><script type="text/html" id="propertyeditor-itemvalues">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-itemvalues">    <div style="overflow-y: auto; overflow-x:hidden; max-height:400px">        <table class="table">            <thead>                <tr>                    <th data-bind="text: $root.getLocString(\'pe.value\')"></th>                    <th data-bind="text: $root.getLocString(\'pe.text\')"></th>                    <th></th>                </tr>            </thead>            <tbody>                <!-- ko foreach: koItems -->                <tr>                    <td>                        <input type="text" class="form-control" data-bind="value:koValue" style="width:200px" />                        <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError, text: $root.getLocString(\'pe.enterNewValue\')"></div>                    </td>                    <td><input type="text" class="form-control" data-bind="value:koText" style="width:200px" /></td>                    <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')" /></td>                </tr>                <!-- /ko -->            </tbody>        </table>    </div>    <div class="row btn-toolbar">        <input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')" />        <input type="button" class="btn btn-danger" data-bind="click: onClearClick, value: $root.getLocString(\'pe.removeAll\')" />    </div></script><script type="text/html" id="propertyeditor-matrixdropdowncolumns">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-matrixdropdowncolumns">    <table class="table">        <thead>            <tr>                <th data-bind="text: $root.getLocString(\'pe.required\')"></th>                <th data-bind="text: $root.getLocString(\'pe.cellType\')"></th>                <th data-bind="text: $root.getLocString(\'pe.name\')"></th>                <th data-bind="text: $root.getLocString(\'pe.title\')"></th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td>                    <a href="#" data-bind="visible:koHasChoices, click: onShowChoicesClick">                        <span class="glyphicon" data-bind="css: {\'glyphicon-chevron-down\': !koShowChoices(), \'glyphicon-chevron-up\': koShowChoices()}"></span>                    </a>                    <input type="checkbox" data-bind="checked: koIsRequired" />                </td>                <td>                    <select class="form-control" data-bind="options: cellTypeChoices, value: koCellType"  style="width:110px"></select>                </td>                <td>                    <input type="text" class="form-control" data-bind="value:koName" style="width:100px" />                    <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError, text: $root.getLocString(\'pe.enterNewValue\')"></div>                </td>                <td><input type="text" class="form-control" data-bind="value:koTitle" style="width:120px" /></td>                <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')"/></td>            </tr>            <tr data-bind="visible: koShowChoices() && koHasChoices()">                <td colspan="4" style="border-top-style:none">                    <div class="form-group">                        <label class="control-label col-sm-3" data-bind="text:$root.getLocString(\'pe.hasOther\')"></label>                        <div class="col-sm-2">                            <input type="checkbox" data-bind="checked: koHasOther" />                        </div>                        <div class="col-sm-7" data-bind="visible: !koHasColCount()"></div>                        <label class="control-label col-sm-3" data-bind="visible:koHasColCount, text:$root.getLocString(\'pe.colCount\')"></label>                        <select class="form-control col-sm-4" data-bind="visible:koHasColCount, options: colCountChoices, value: koColCount" style="width:110px"></select>                    </div>                    <div class="modal-body svd_notopbottompaddings">                        <!-- ko template: { name: \'propertyeditorcontent-itemvalues\', data: choicesEditor } -->                        <!-- /ko -->                    </div>                </td>            </tr>            <!-- /ko -->            <tr>                <td colspan="3">                    <div class="row btn-toolbar">                        <input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')"/>                        <input type="button" class="btn btn-danger" data-bind="click: onClearClick, value: $root.getLocString(\'pe.removeAll\')"" />                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="propertyeditor-modal">    <div data-bind="visible:!editor.isEditable">        <span data-bind="text: koText"></span>        <button type="button"  class="btn btn-default"data-toggle="modal" style="padding: 2px;" data-bind="attr: {\'data-target\' : modalNameTarget}">            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>        </button>    </div>    <div data-bind="visible:editor.isEditable" style="display:table">        <input type="text" data-bind="value: koValue" style="display:table-cell; width:100%" />        <button type="button" class="btn btn-default" style="display:table-cell; padding: 2px;"  data-toggle="modal" data-bind="attr: {\'data-target\' : modalNameTarget}">            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>        </button>    </div>    <div data-bind="attr: {id : modalName}" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:editor.title"></h4>                </div>                  <div class="modal-body svd_notopbottompaddings">                    <!-- ko template: { name: \'propertyeditorcontent-\' + editorType, data: editor } -->                    <!-- /ko -->                </div>                <div class="modal-footer">                    <input type="button" class="btn btn-primary" data-bind="click: editor.onApplyClick, value: $root.getLocString(\'pe.apply\')" style="width:100px" />                    <input type="button" class="btn btn-default" data-bind="click: editor.onResetClick, value: $root.getLocString(\'pe.reset\')" style="width:100px" />                    <input type="button" class="btn btn-default" data-dismiss="modal" data-bind="value: $root.getLocString(\'pe.close\')" style="width:100px" />                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-number">    <input type="number" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-restfull">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-restfull">    <form>        <div class="form-group">            <label for="url">Url:</label>            <input id="url" type="text" data-bind="value:koUrl" class="form-control" />        </div>        <div class="form-group">            <label for="path">Path:</label>            <input id="path" type="text" data-bind="value:koPath" class="form-control" />        </div>        <div class="form-group">            <label for="valueName">valueName:</label>            <input id="valueName" type="text" data-bind="value:koValueName" class="form-control" />        </div>        <div class="form-group">            <label for="titleName">titleName:</label>            <input id="titleName" type="text" data-bind="value:koTitleName" class="form-control" />        </div>    </form>    <div id="restfullSurvey" style="width:100%;height:150px"></div></script><script type="text/html" id="propertyeditor-string">    <input type="text" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-text">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-text">    <textarea data-bind="value:koValue" style="width:100%" rows="10" autofocus="autofocus"></textarea></script><script type="text/html" id="propertyeditor-textitems">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-textitems"><div class="panel">    <table class="table">        <thead>            <tr>                <th data-bind="text: $root.getLocString(\'pe.name\')"></th>                <th data-bind="text: $root.getLocString(\'pe.title\')"></th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td><input type="text" class="form-control" data-bind="value:koName" style="width:200px" /></td>                <td><input type="text" class="form-control" data-bind="value:koTitle" style="width:200px" /></td>                <td><input type="button" class="btn" data-bind="click: $parent.onDeleteClick, value: $root.getLocString(\'pe.delete\')"/></td>            </tr>            <!-- /ko -->            <tr>                <td colspan="4"><input type="button" class="btn btn-success" data-bind="click: onAddClick, value: $root.getLocString(\'pe.addNew\')"/></td>            </tr>        </tbody>    </table></div></script><script type="text/html" id="propertyeditor-triggers">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-triggers"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <button type="button" class="dropdown-toggle input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                <span class="glyphicon glyphicon-plus"></span>            </button>            <ul class="dropdown-menu input-group">                <!-- ko foreach: availableTriggers -->                <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                <!-- /ko  -->            </ul>            <select class="form-control" data-bind="options: koItems, optionsText: \'koText\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="visible: koSelected() == null">        <div data-bind="visible: koQuestions().length == 0, text: $root.getLocString(\'pe.noquestions\')"></div>        <div data-bind="visible: koQuestions().length > 0, text: $root.getLocString(\'pe.createtrigger\')"></div>    </div>    <div data-bind="visible: koSelected() != null">        <div data-bind="with: koSelected">            <div class="row form-inline">                <div class="col-sm-4">                    <span data-bind="text: $root.getLocString(\'pe.triggerOn\')"></span><select class="form-control" data-bind="options:$parent.koQuestions, value: koName"></select> <span> </span>                </div>                <div class="col-sm-4">                    <select class="form-control" data-bind="options:availableOperators, optionsValue: \'name\', optionsText: \'text\', value:koOperator"></select>                </div>                <div class="col-sm-4">                    <input class="form-control" style="padding: 0" type="text" data-bind="visible: koRequireValue, value:koValue" />                </div>            </div>            <!-- ko if: koType() == \'visibletrigger\' -->            <div class="row">                <div class="col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: pages } -->                    <!-- /ko -->                </div>                <div class="col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: questions } -->                    <!-- /ko -->                </div>            </div>            <!-- /ko -->            <!-- ko if: koType() == \'completetrigger\' -->            <div class="row">               <div style="margin: 10px" data-bind="text: $root.getLocString(\'pe.triggerCompleteText\')"></div>            </div>            <!-- /ko -->            <!-- ko if: koType() == \'setvaluetrigger\' -->            <div class="row form-inline" style="margin-top:10px">                <div class="col-sm-6">                    <span data-bind="text: $root.getLocString(\'pe.triggerSetToName\')"></span><input class="form-control" type="text" data-bind="value:kosetToName" />                </div>                <div class="col-sm-1">                </div>                <div class="col-sm-5">                    <span data-bind="text: $root.getLocString(\'pe.triggerSetValue\')"></span><input class="form-control" type="text" data-bind="value:kosetValue" />                </div>            </div>            <div class="row form-inline">                <div class="col-sm-12">                    <input type="checkbox" data-bind="checked: koisVariable" /> <span data-bind="text: $root.getLocString(\'pe.triggerIsVariable\')"></span>                </div>            </div>            <!-- /ko -->        </div>    </div></div></script><script type="text/html" id="propertyeditor-triggersitems">    <div class="panel no-margins no-padding">        <div class="panel-heading">            <span data-bind="text: title"></span>        </div>        <div class="input-group">            <select class="form-control" multiple="multiple" data-bind="options:koChoosen, value: koChoosenSelected"></select>            <span class="input-group-btn" style="vertical-align:top">                <button type="button" data-bind="enable: koChoosenSelected() != null, click: onDeleteClick" class="btn"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>        <div class="input-group" style="margin-top:5px">            <select class="form-control" data-bind="options:koObjects, value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onAddClick" style="width:40px" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></button>            </span>        </div>    </div></script><script type="text/html" id="propertyeditor-validators">    <!-- ko template: { name: \'propertyeditor-modal\', data: $data } --><!-- /ko --></script><script type="text/html" id="propertyeditorcontent-validators"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <button type="button" class="dropdown-toggle input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                <span class="glyphicon glyphicon-plus"></span>            </button>            <ul class="dropdown-menu input-group">                <!-- ko foreach: availableValidators -->                <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                <!-- /ko  -->            </ul>            <select class="form-control" data-bind="options: koItems, optionsText: \'text\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div></div></script>';

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var html = exports.html = '<div data-bind="event:{           dragenter:function(el, e){ dragEnter(e);},           dragleave:function(el, e){ dragLeave(e);},           dragover:function(el, e){ return false;},           drop:function(el, e){ dragDrop(e);}}     ">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + processedTitle, css: $root.css.pageTitle"></h4>    <!-- ko foreach: { data: rows, as: \'row\'} -->    <div data-bind="visible: row.koVisible, css: $root.css.row">        <!-- ko foreach: { data: row.questions, as: \'question\' , afterRender: row.koAfterRender } -->        <!-- ko template: { name: \'survey-question\', data: question } -->        <!-- /ko -->        <!-- /ko -->    </div>    <!-- /ko -->    <div class="well" data-bind="visible:$root.isDesignMode && questions.length == 0">        <span data-bind="text:$root.getEditorLocString(\'survey.dropQuestion\')"></span>    </div>    <div class="svd_dragover" data-bind="visible: koDraggingBottom"></div></div>';

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var html = exports.html = '<div style="vertical-align:top" data-bind="style: {display: question.koVisible()|| $root.isDesignMode ? \'inline-block\': \'none\', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth },      attr : {id: id, draggable: $root.isDesignMode}, click: $root.isDesignMode ? koOnClick: null,          event:{           dragstart:function(el, e){ dragStart(e); return true; },           dragover:function(el, e){ dragOver(e);},           drop:function(el, e){ dragDrop(e);}         }, css:{svd_q_design_border: $root.isDesignMode, svd_q_selected : koIsSelected, \'well well-sm\': $root.isDesignMode}">    <div style="vertical-align:top" class="svd_dragover" data-bind="visible: koIsDragging"></div>    <div class="svd_q_copybutton" data-bind="visible: koIsSelected">        <button class="btn btn-primary btn-xs" data-bind="click: $root.copyQuestionClick, text:$root.getEditorLocString(\'survey.copy\')"></button>    </div>    <div data-bind="css:{svd_q_design: $root.isDesignMode}">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'top\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            <div data-bind="text:question.commentText"></div>            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="visible: $root.questionTitleLocation == \'bottom\', text: question.koTitle(), css: $root.css.question.title"></h5>        <!-- /ko -->    </div></div>';

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2OWRiMGMzODc1MjM5NzYwN2I3NSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhZ2Ryb3BoZWxwZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcInJvb3RcIjpcIlN1cnZleVwiLFwiY29tbW9uanMyXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImNvbW1vbmpzXCI6XCJzdXJ2ZXkta25vY2tvdXRcIixcImFtZFwiOlwic3VydmV5LWtub2Nrb3V0XCJ9Iiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1zRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNb2RhbEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yTG9jYWxpemF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9zdXJ2ZXlIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb2JqZWN0UHJvcGVydHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5UmVzdGZ1bGxFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRyaWdnZXJzRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wYWdlc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGV4dFdvcmtlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvanNvbjUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N1cnZleUVtYmVkaW5nV2luZG93LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RWZXJicy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5kb3JlZG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5T2JqZWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVFZGl0b3Iua28uaHRtbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVfcGFnZS5odG1sLnRzIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNyQ0E7Ozs7Ozs7OztnQ0FDNEI7Ozs7OztnQ0FBNEI7Ozs7OztnQ0FDeEI7Ozs7OztnQ0FBNkI7Ozs7OztnQ0FFN0Q7Ozs7Ozs7OztxQ0FDQTs7Ozs7Ozs7O2lDQUNBOzs7Ozs7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LGdCQUFPLFNBQWUsMkJBQWMsY0FDOUM7QUFBQztBQXhJYSxtQkFBTSxTQUFpQjtBQXlJekMsWUFBQztBQUFBLEs7Ozs7Ozs7OztBQ2xKTSxLQUFRLHNCQUErMDNCLDQwM0I7Ozs7Ozs7OztBQ0F2MTNCLEtBQVEsc0JBQXErQixrK0I7Ozs7Ozs7OztBQ0E3K0IsS0FBUSxzQkFBcWxFLGtsRSIsImZpbGUiOiJzdXJ2ZXllZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJzdXJ2ZXkta25vY2tvdXRcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJTdXJ2ZXlFZGl0b3JcIiwgW1wic3VydmV5LWtub2Nrb3V0XCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN1cnZleUVkaXRvclwiXSA9IGZhY3RvcnkocmVxdWlyZShcInN1cnZleS1rbm9ja291dFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiU3VydmV5RWRpdG9yXCJdID0gZmFjdG9yeShyb290W1wiU3VydmV5XCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDY5ZGIwYzM4NzUyMzk3NjA3Yjc1IiwiZXhwb3J0IHtEcmFnRHJvcEhlbHBlcn0gZnJvbSBcIi4uL2RyYWdkcm9waGVscGVyXCI7XG5leHBvcnQge1xuICAgIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSwgU3VydmV5U3RyaW5nUHJvcGVydHlFZGl0b3IsXG4gICAgU3VydmV5RHJvcGRvd25Qcm9wZXJ0eUVkaXRvciwgU3VydmV5Qm9vbGVhblByb3BlcnR5RWRpdG9yLCBTdXJ2ZXlOdW1iZXJQcm9wZXJ0eUVkaXRvclxufSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVRleHRJdGVtc0VkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRleHRJdGVtc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbVZhbHVlc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eURyb3Bkb3duQ29sdW1uc0VkaXRvciwgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtfVxuICAgIGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1vZGFsRWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVByb3BlcnR5UmVzdWx0ZnVsbEVkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVJlc3RmdWxsRWRpdG9yXCI7XG5leHBvcnQge1N1cnZleVByb3BlcnR5VHJpZ2dlcnNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUcmlnZ2Vyc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yXCI7XG5cbmV4cG9ydCB7U3VydmV5T2JqZWN0UHJvcGVydHl9IGZyb20gXCIuLi9vYmplY3RQcm9wZXJ0eVwiO1xuZXhwb3J0IHtTdXJ2ZXlPYmplY3RFZGl0b3J9IGZyb20gXCIuLi9vYmplY3RFZGl0b3JcIjtcbmV4cG9ydCB7U3VydmV5UGFnZXNFZGl0b3J9IGZyb20gXCIuLi9wYWdlc0VkaXRvclwiO1xuZXhwb3J0IHtTdXJ2ZXlUZXh0V29ya2VyfSBmcm9tIFwiLi4vdGV4dFdvcmtlclwiO1xuZXhwb3J0IHtPYmpUeXBlLCBTdXJ2ZXlIZWxwZXJ9IGZyb20gXCIuLi9zdXJ2ZXlIZWxwZXJcIjtcbmV4cG9ydCB7U3VydmV5RW1iZWRpbmdXaW5kb3d9IGZyb20gXCIuLi9zdXJ2ZXlFbWJlZGluZ1dpbmRvd1wiO1xuZXhwb3J0IHtTdXJ2ZXlWZXJicywgU3VydmV5VmVyYkl0ZW0sIFN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbSwgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtfSBmcm9tIFwiLi4vb2JqZWN0VmVyYnNcIjtcbmV4cG9ydCB7U3VydmV5VW5kb1JlZG8sIFVuZG9SZWRvSXRlbX0gZnJvbSBcIi4uL3VuZG9yZWRvXCI7XG5leHBvcnQge1N1cnZleUVkaXRvcn0gZnJvbSBcIi4uL2VkaXRvclwiO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lbnRyaWVzL2luZGV4LnRzIiwiaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIERyYWdEcm9wSGVscGVyIHtcbiAgICBzdGF0aWMgZGF0YVN0YXJ0OiBzdHJpbmcgPSBcInN1cnZleWpzLFwiO1xuICAgIHN0YXRpYyBkcmFnRGF0YTogYW55ID0ge3RleHQ6IFwiXCIsIGpzb246IG51bGwgfTtcbiAgICBzdGF0aWMgcHJldkV2ZW50ID0geyBxdWVzdGlvbjogbnVsbCwgeDogLTEsIHk6IC0xIH07XG4gICAgcHJpdmF0ZSBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogU3VydmV5LklTdXJ2ZXksIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XG4gICAgICAgIHRoaXMub25Nb2RpZmllZENhbGxiYWNrID0gb25Nb2RpZmllZENhbGxiYWNrO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIDxTdXJ2ZXkuU3VydmV5PnRoaXMuZGF0YTsgfVxuICAgIHB1YmxpYyBzdGFydERyYWdOZXdRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25OYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zZXREYXRhKGV2ZW50LCBEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQgKyBcInF1ZXN0aW9udHlwZTpcIiArIHF1ZXN0aW9uVHlwZSArIFwiLHF1ZXN0aW9ubmFtZTpcIiArIHF1ZXN0aW9uTmFtZSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGFydERyYWdRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbk5hbWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCArIFwicXVlc3Rpb25uYW1lOlwiICsgcXVlc3Rpb25OYW1lKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXJ0RHJhZ0NvcGllZFF1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nLCBxdWVzdGlvbkpzb246IGFueSkge1xuICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCArIFwicXVlc3Rpb25uYW1lOlwiICsgcXVlc3Rpb25OYW1lLCBxdWVzdGlvbkpzb24pO1xuICAgIH1cbiAgICBwdWJsaWMgaXNTdXJ2ZXlEcmFnZ2luZyhldmVudDogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghZXZlbnQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpLnRleHQ7XG4gICAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuaW5kZXhPZihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQpID09IDA7XG4gICAgfVxuICAgIHB1YmxpYyBkb0RyYWdEcm9wT3ZlcihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xuICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xuICAgICAgICBpZiAoIXF1ZXN0aW9uIHx8ICF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpIHx8IHRoaXMuaXNTYW1lUGxhY2UoZXZlbnQsIHF1ZXN0aW9uKSkgcmV0dXJuO1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldFF1ZXN0aW9uSW5kZXgoZXZlbnQsIHF1ZXN0aW9uKTtcbiAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKGluZGV4KTtcbiAgICB9XG4gICAgcHVibGljIGRvRHJvcChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSA9IG51bGwpIHtcbiAgICAgICAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXSgtMSk7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xuICAgICAgICB2YXIgZGF0YUluZm8gPSB0aGlzLmdldERhdGFJbmZvKGV2ZW50KTtcbiAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcbiAgICAgICAgaWYgKCFkYXRhSW5mbykgcmV0dXJuO1xuICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSBudWxsO1xuICAgICAgICB2YXIganNvbiA9IGRhdGFJbmZvW1wianNvblwiXTtcbiAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICAgIHRhcmdldFF1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihqc29uW1widHlwZVwiXSwgbmFtZSk7XG4gICAgICAgICAgICBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b09iamVjdChqc29uLCB0YXJnZXRRdWVzdGlvbik7XG4gICAgICAgICAgICB0YXJnZXRRdWVzdGlvbi5uYW1lID0gZGF0YUluZm9bXCJxdWVzdGlvbm5hbWVcIl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXJnZXRRdWVzdGlvbikge1xuICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uQmFzZT50aGlzLnN1cnZleS5nZXRRdWVzdGlvbkJ5TmFtZShkYXRhSW5mb1tcInF1ZXN0aW9ubmFtZVwiXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXJnZXRRdWVzdGlvbiAmJiBkYXRhSW5mb1tcInF1ZXN0aW9udHlwZVwiXSkge1xuICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKGRhdGFJbmZvW1wicXVlc3Rpb250eXBlXCJdLCBkYXRhSW5mb1tcInF1ZXN0aW9ubmFtZVwiXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YXJnZXRRdWVzdGlvbikgcmV0dXJuO1xuICAgICAgICB0aGlzLm1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uLCBpbmRleCk7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UXVlc3Rpb25JbmRleChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xuICAgICAgICBpZiAoIXF1ZXN0aW9uKSByZXR1cm4gcGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xuICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcbiAgICAgICAgZXZlbnQgPSB0aGlzLmdldEV2ZW50KGV2ZW50KTtcbiAgICAgICAgdmFyIGhlaWdodCA9IDxudW1iZXI+ZXZlbnQuY3VycmVudFRhcmdldFtcImNsaWVudEhlaWdodFwiXTtcbiAgICAgICAgdmFyIHkgPSBldmVudC5vZmZzZXRZO1xuICAgICAgICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ2xheWVyWCcpKSB7XG4gICAgICAgICAgICB5ID0gZXZlbnQubGF5ZXJZIC0gPG51bWJlcj5ldmVudC5jdXJyZW50VGFyZ2V0W1wib2Zmc2V0VG9wXCJdO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5ID4gaGVpZ2h0IC8gMikgaW5kZXgrK1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIHByaXZhdGUgaXNTYW1lUGxhY2UoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XG4gICAgICAgIGlmIChwcmV2LnF1ZXN0aW9uICE9IHF1ZXN0aW9uIHx8IE1hdGguYWJzKGV2ZW50LmNsaWVudFggLSBwcmV2LngpID4gNSB8fCBNYXRoLmFicyhldmVudC5jbGllbnRZIC0gcHJldi55KSA+IDUpIHtcbiAgICAgICAgICAgIHByZXYucXVlc3Rpb24gPSBxdWVzdGlvbjtcbiAgICAgICAgICAgIHByZXYueCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICBwcmV2LnkgPSBldmVudC5jbGllbnRZO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEV2ZW50KGV2ZW50OiBEcmFnRXZlbnQpOiBEcmFnRXZlbnQge1xuICAgICAgICByZXR1cm4gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdID8gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdIDogZXZlbnQ7XG4gICAgfVxuICAgIHByaXZhdGUgbW92ZVF1ZXN0aW9uVG8odGFyZ2V0UXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIGluZGV4OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0YXJnZXRRdWVzdGlvbik7XG4gICAgICAgIGlmIChwYWdlKSB7XG4gICAgICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5hZGRRdWVzdGlvbih0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xuICAgICAgICBpZiAodGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spIHRoaXMub25Nb2RpZmllZENhbGxiYWNrKCk7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0RGF0YUluZm8oZXZlbnQ6IERyYWdFdmVudCk6IGFueSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKGV2ZW50KTtcbiAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcbiAgICAgICAgdmFyIHRleHQgPSBkYXRhLnRleHQuc3Vic3RyKERyYWdEcm9wSGVscGVyLmRhdGFTdGFydC5sZW5ndGgpO1xuICAgICAgICB2YXIgYXJyYXkgPSB0ZXh0LnNwbGl0KCcsJyk7XG4gICAgICAgIHZhciByZXN1bHQgPSB7anNvbjogbnVsbH07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gYXJyYXlbaV0uc3BsaXQoJzonKTtcbiAgICAgICAgICAgIHJlc3VsdFtpdGVtWzBdXSA9IGl0ZW1bMV07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0Lmpzb24gPSBkYXRhLmpzb247XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0WShlbGVtZW50OiBIVE1MRWxlbWVudCk6IG51bWJlciB7XG4gICAgICAgIHZhciByZXN1bHQgPSAwO1xuXG4gICAgICAgIHdoaWxlIChlbGVtZW50KSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gKGVsZW1lbnQub2Zmc2V0VG9wIC0gZWxlbWVudC5zY3JvbGxUb3AgKyBlbGVtZW50LmNsaWVudFRvcCk7XG4gICAgICAgICAgICBlbGVtZW50ID0gPEhUTUxFbGVtZW50PmVsZW1lbnQub2Zmc2V0UGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgc2V0RGF0YShldmVudDogRHJhZ0V2ZW50LCB0ZXh0OiBzdHJpbmcsIGpzb246IGFueSA9IG51bGwpIHtcbiAgICAgICAgaWYgKGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSkge1xuICAgICAgICAgICAgZXZlbnQgPSBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LmRhdGFUcmFuc2Zlcikge1xuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJUZXh0XCIsIHRleHQpO1xuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImNvcHlcIjtcbiAgICAgICAgfVxuICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YSA9IHsgdGV4dDogdGV4dCwganNvbjoganNvbiB9O1xuICAgIH1cbiAgICBwcml2YXRlIGdldERhdGEoZXZlbnQ6IERyYWdFdmVudCk6IGFueSB7XG4gICAgICAgIGlmIChldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0pIHtcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIpIHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJUZXh0XCIpO1xuICAgICAgICAgICAgaWYgKHRleHQpIHtcbiAgICAgICAgICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YS50ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGE7XG4gICAgfVxuICAgIHByaXZhdGUgY2xlYXJEYXRhKCkge1xuICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YSA9IHt0ZXh0OiBcIlwiLCBqc29uOiBudWxsfTtcbiAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XG4gICAgICAgIHByZXYucXVlc3Rpb24gPSBudWxsO1xuICAgICAgICBwcmV2LnggPSAtMTtcbiAgICAgICAgcHJldi55ID0gLTE7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9kcmFnZHJvcGhlbHBlci50cyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wicm9vdFwiOlwiU3VydmV5XCIsXCJjb21tb25qczJcIjpcInN1cnZleS1rbm9ja291dFwiLFwiY29tbW9uanNcIjpcInN1cnZleS1rbm9ja291dFwiLFwiYW1kXCI6XCJzdXJ2ZXkta25vY2tvdXRcIn1cbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XG4gICAgcHVibGljIHN0YXRpYyBkZWZhdWx0RWRpdG9yOiBzdHJpbmcgPSBcInN0cmluZ1wiO1xuICAgIHByaXZhdGUgc3RhdGljIGVkaXRvclJlZ2lzdGVyZWRMaXN0ID0ge307XG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlckVkaXRvcihuYW1lOiBzdHJpbmcsIGNyZWF0b3I6ICgpID0+IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSkge1xuICAgICAgICBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbbmFtZV0gPSBjcmVhdG9yO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUVkaXRvcihlZGl0b3JUeXBlOiBzdHJpbmcsIGZ1bmM6IChuZXdWYWx1ZTogYW55KSA9PiBhbnkpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgICAgICB2YXIgY3JlYXRvciA9IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5lZGl0b3JSZWdpc3RlcmVkTGlzdFtlZGl0b3JUeXBlXTtcbiAgICAgICAgaWYgKCFjcmVhdG9yKSBjcmVhdG9yID0gU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLmVkaXRvclJlZ2lzdGVyZWRMaXN0W1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5kZWZhdWx0RWRpdG9yXTtcbiAgICAgICAgdmFyIHByb3BlcnR5RWRpdG9yID0gY3JlYXRvcigpO1xuICAgICAgICBwcm9wZXJ0eUVkaXRvci5vbkNoYW5nZWQgPSBmdW5jO1xuICAgICAgICByZXR1cm4gcHJvcGVydHlFZGl0b3I7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWx1ZV86IGFueSA9IG51bGw7XG4gICAgcHVibGljIG9wdGlvbnM6IGFueSA9IG51bGw7XG4gICAgcHVibGljIG9uQ2hhbmdlZDogKG5ld1ZhbHVlOiBhbnkpID0+IGFueTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHRocm93IFwiZWRpdG9yVHlwZSBpcyBub3QgZGVmaW5lZFwiOyB9XG4gICAgcHVibGljIGdldFZhbHVlVGV4dCh2YWx1ZTogYW55KTogc3RyaW5nIHsgcmV0dXJuIHZhbHVlOyB9XG4gICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmdldENvcnJlY3RlZFZhbHVlKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZUNvcmUodmFsdWUpO1xuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBzZXRWYWx1ZUNvcmUodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0VGl0bGUodmFsdWU6IHN0cmluZykgeyB9XG4gICAgcHVibGljIHNldE9iamVjdCh2YWx1ZTogYW55KSB7IH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRDb3JyZWN0ZWRWYWx1ZSh2YWx1ZTogYW55KTogYW55IHsgIHJldHVybiB2YWx1ZTsgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlTdHJpbmdQcm9wZXJ0eUVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdHJpbmdcIjsgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleURyb3Bkb3duUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiZHJvcGRvd25cIjsgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleUJvb2xlYW5Qcm9wZXJ0eUVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJib29sZWFuXCI7IH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlOdW1iZXJQcm9wZXJ0eUVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1iZXJcIjsgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJzdHJpbmdcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5U3RyaW5nUHJvcGVydHlFZGl0b3IoKTsgfSk7XG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJkcm9wZG93blwiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlEcm9wZG93blByb3BlcnR5RWRpdG9yKCk7IH0pO1xuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwiYm9vbGVhblwiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlCb29sZWFuUHJvcGVydHlFZGl0b3IoKTsgfSk7XG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJudW1iZXJcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5TnVtYmVyUHJvcGVydHlFZGl0b3IoKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUVkaXRvckJhc2UudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5SXRlbXNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcbmltcG9ydCB7U3VydmV5SGVscGVyfSBmcm9tIFwiLi4vc3VydmV5SGVscGVyXCI7XG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5VmFsaWRhdG9yc0VkaXRvclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VGV4dEl0ZW1zRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0aXRlbXNcIjsgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdFZGl0b3JJdGVtKCk6IGFueSB7XG4gICAgICAgIHZhciBvYmpzID0gW107XG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMua29JdGVtcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvYmpzLnB1c2goeyBuYW1lOiBpdGVtc1tpXS5rb05hbWUoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZWRpdEl0ZW0gPSB7IGtvTmFtZToga28ub2JzZXJ2YWJsZShTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZShvYmpzLCBcInRleHRcIikpLCBrb1RpdGxlOiBrby5vYnNlcnZhYmxlKCkgfTtcbiAgICAgICAgdGhpcy5jcmVhdGVWYWxpZGF0b3JzRWRpdG9yKGVkaXRJdGVtLCBbXSk7XG4gICAgICAgIHJldHVybiBlZGl0SXRlbTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7XG4gICAgICAgIHZhciBlZGl0SXRlbSA9IHsga29OYW1lOiBrby5vYnNlcnZhYmxlKGl0ZW0ubmFtZSksIGtvVGl0bGU6IGtvLm9ic2VydmFibGUoaXRlbS50aXRsZSkgfTtcbiAgICAgICAgdGhpcy5jcmVhdGVWYWxpZGF0b3JzRWRpdG9yKGVkaXRJdGVtLCBpdGVtLnZhbGlkYXRvcnMpO1xuICAgICAgICByZXR1cm4gZWRpdEl0ZW07XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oZWRpdG9ySXRlbTogYW55KSB7XG4gICAgICAgIHZhciBpdGVtVGV4dCA9IG5ldyBTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbShlZGl0b3JJdGVtLmtvTmFtZSgpLCBlZGl0b3JJdGVtLmtvVGl0bGUoKSk7XG4gICAgICAgIGl0ZW1UZXh0LnZhbGlkYXRvcnMgPSBlZGl0b3JJdGVtLnZhbGlkYXRvcnM7XG4gICAgICAgIHJldHVybiBpdGVtVGV4dDtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVWYWxpZGF0b3JzRWRpdG9yKGl0ZW06IGFueSwgdmFsaWRhdG9yczogQXJyYXk8YW55Pikge1xuICAgICAgICBpdGVtLnZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLnNsaWNlKCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIG9uSXRlbUNoYW5nZWQgPSBmdW5jdGlvbiAobmV3VmFsdWU6IGFueSkgeyBpdGVtLnZhbGlkYXRvcnMgPSBuZXdWYWx1ZTsgaXRlbS5rb1RleHQoc2VsZi5nZXRUZXh0KG5ld1ZhbHVlLmxlbmd0aCkpOyB9O1xuICAgICAgICB2YXIgcHJvcGVydHlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yKCk7XG4gICAgICAgIGl0ZW0uZWRpdG9yID0gcHJvcGVydHlFZGl0b3I7XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLm9uQ2hhbmdlZCA9IChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9O1xuICAgICAgICBwcm9wZXJ0eUVkaXRvci5vYmplY3QgPSBpdGVtO1xuICAgICAgICBwcm9wZXJ0eUVkaXRvci50aXRsZShlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuZWRpdFByb3BlcnR5XCIpW1wiZm9ybWF0XCJdKFwiVmFsaWRhdG9yc1wiKSk7XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLnZhbHVlID0gaXRlbS52YWxpZGF0b3JzO1xuICAgICAgICBpdGVtLmtvVGV4dCA9IGtvLm9ic2VydmFibGUodGhpcy5nZXRUZXh0KHZhbGlkYXRvcnMubGVuZ3RoKSk7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0VGV4dChsZW5ndGg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuaXRlbXNcIilbXCJmb3JtYXRcIl0obGVuZ3RoKTtcbiAgICB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInRleHRpdGVtc1wiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eVRleHRJdGVtc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5VGV4dEl0ZW1zRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eU1vZGFsRWRpdG9yXCI7XG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL2VkaXRvckxvY2FsaXphdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3Ige1xuICAgIHB1YmxpYyBrb0l0ZW1zOiBhbnk7XG4gICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcbiAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xuICAgIHB1YmxpYyBvbkNsZWFyQ2xpY2s6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IFtdO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub25EZWxldGVDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoaXRlbSk7IH07XG4gICAgICAgIHNlbGYub25DbGVhckNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZUFsbCgpOyB9O1xuICAgICAgICBzZWxmLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQWRkSXRlbSgpOyB9O1xuXG4gICAgfVxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIHZhciBsZW4gPSB2YWx1ZSA/IHZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICAgIHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuaXRlbXNcIilbXCJmb3JtYXRcIl0obGVuKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldENvcnJlY3RlZFZhbHVlKHZhbHVlOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIEFkZEl0ZW0oKSB7XG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKHRoaXMuY3JlYXRlTmV3RWRpdG9ySXRlbSgpKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICB0aGlzLmtvSXRlbXModGhpcy5nZXRJdGVtc0Zyb21WYWx1ZSgpKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zRnJvbVZhbHVlKCk6IEFycmF5PGFueT4ge1xuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaXRlbXMucHVzaCh0aGlzLmNyZWF0ZUVkaXRvckl0ZW0odmFsdWVbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbkJlZm9yZUFwcGx5KCkge1xuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgdmFyIGludGVybmFsSXRlbXMgPSB0aGlzLmtvSXRlbXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcm5hbEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtcy5wdXNoKHRoaXMuY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGludGVybmFsSXRlbXNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShpdGVtcyk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdFZGl0b3JJdGVtKCk6IGFueSB7IHRocm93IFwiT3ZlcnJpZGUgJ2NyZWF0ZU5ld0VkaXRvckl0ZW0nIG1ldGhvZFwiOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7IHJldHVybiBpdGVtOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHsgIHJldHVybiBlZGl0b3JJdGVtOyAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlJdGVtc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xuICAgIHB1YmxpYyBvYmplY3Q6IGFueTtcbiAgICBwdWJsaWMgdGl0bGU6IGFueTtcbiAgICBwdWJsaWMgb25BcHBseUNsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uUmVzZXRDbGljazogYW55O1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYub25BcHBseUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFwcGx5KCk7IH07XG4gICAgICAgIHNlbGYub25SZXNldENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnJlc2V0KCk7IH07XG4gICAgfVxuICAgIHB1YmxpYyBzZXRUaXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGUodmFsdWUpOyB9XG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHsgfVxuICAgIHByaXZhdGUgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgIH1cbiAgICBwdWJsaWMgc2V0T2JqZWN0KHZhbHVlOiBhbnkpIHsgdGhpcy5vYmplY3QgPSB2YWx1ZTsgfVxuICAgIHB1YmxpYyBnZXQgaXNFZGl0YWJsZSgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgcHJpdmF0ZSBhcHBseSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzRXJyb3IoKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLm9uQmVmb3JlQXBwbHkoKTtcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCh0aGlzLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VGV4dEVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3Ige1xuICAgIHB1YmxpYyBrb1ZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dFwiOyB9XG4gICAgcHVibGljIGdldCBpc0VkaXRhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdmFsdWUpIHJldHVybiBudWxsO1xuICAgICAgICB2YXIgc3RyID0gdmFsdWU7XG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgMjApICsgXCIuLi5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlQXBwbHkoKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKHRoaXMua29WYWx1ZSgpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUh0bWxFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRleHRFZGl0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaHRtbFwiOyB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInRleHRcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlUZXh0RWRpdG9yKCk7IH0pO1xuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwiaHRtbFwiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eUh0bWxFZGl0b3IoKTsgfSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TW9kYWxFZGl0b3IudHMiLCJleHBvcnQgdmFyIGVkaXRvckxvY2FsaXphdGlvbiA9IHtcbiAgICBjdXJyZW50TG9jYWxlOiBcIlwiLFxuICAgIGxvY2FsZXM6IHt9LFxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZywgbG9jYWxlOiBzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGlmICghbG9jYWxlKSBsb2NhbGUgPSB0aGlzLmN1cnJlbnRMb2NhbGU7XG4gICAgICAgIHZhciBsb2MgPSBsb2NhbGUgPyB0aGlzLmxvY2FsZXNbdGhpcy5jdXJyZW50TG9jYWxlXSA6IGRlZmF1bHRTdHJpbmdzO1xuICAgICAgICBpZiAoIWxvYykgbG9jID0gZGVmYXVsdFN0cmluZ3M7XG4gICAgICAgIHZhciBwYXRoID0gc3RyTmFtZS5zcGxpdCgnLicpO1xuICAgICAgICB2YXIgb2JqID0gbG9jO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9iaiA9IG9ialtwYXRoW2ldXTtcbiAgICAgICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvYyA9PT0gZGVmYXVsdFN0cmluZ3MpIHJldHVybiBwYXRoW2ldO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0cmluZyhzdHJOYW1lLCBcImVuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcbiAgICBnZXRQcm9wZXJ0eU5hbWU6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcsIGxvY2FsOiBzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdldFByb3BlcnR5KHN0ck5hbWUsIGxvY2FsKTtcbiAgICAgICAgaWYgKG9ialtcIm5hbWVcIl0pIHJldHVybiBvYmpbXCJuYW1lXCJdO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG4gICAgZ2V0UHJvcGVydHlUaXRsZTogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZywgbG9jYWw6IHN0cmluZyA9IG51bGwpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2V0UHJvcGVydHkoc3RyTmFtZSwgbG9jYWwpO1xuICAgICAgICBpZiAob2JqW1widGl0bGVcIl0pIHJldHVybiBvYmpbXCJ0aXRsZVwiXTtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSxcbiAgICBnZXRQcm9wZXJ0eTogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZywgbG9jYWw6IHN0cmluZyA9IG51bGwpIHtcbiAgICAgICAgdmFyIG9iaiA9IHRoaXMuZ2V0U3RyaW5nKFwicC5cIiArIHN0ck5hbWUsIGxvY2FsKTtcbiAgICAgICAgaWYgKG9iaiAhPT0gc3RyTmFtZSkgcmV0dXJuIG9iajtcbiAgICAgICAgdmFyIHBvcyA9IHN0ck5hbWUuaW5kZXhPZignXycpO1xuICAgICAgICBpZiAocG9zIDwgLTEpIHJldHVybiBvYmo7XG4gICAgICAgIHN0ck5hbWUgPSBzdHJOYW1lLnN1YnN0cihwb3MgKyAxKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RyaW5nKFwicC5cIiArIHN0ck5hbWUsIGxvY2FsKTtcbiAgICB9LFxuICAgIGdldExvY2FsZXM6IGZ1bmN0aW9uICgpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xuICAgICAgICByZXMucHVzaChcIlwiKTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMubG9jYWxlcykge1xuICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbn07XG5cbmV4cG9ydCB2YXIgZGVmYXVsdFN0cmluZ3MgPSB7XG4gICAgLy9zdXJ2ZXkgdGVtcGxhdGVzXG4gICAgc3VydmV5OiB7XG4gICAgICAgIGRyb3BRdWVzdGlvbjogXCJQbGVhc2UgZHJvcCBhIHF1ZXN0aW9uIGhlcmUuXCIsXG4gICAgICAgIGNvcHk6IFwiQ29weVwiXG4gICAgfSxcbiAgICAvL3F1ZXN0aW9uVHlwZXNcbiAgICBxdDoge1xuICAgICAgICBjaGVja2JveDogXCJDaGVja2JveFwiLFxuICAgICAgICBjb21tZW50OiBcIkNvbW1lbnRcIixcbiAgICAgICAgZHJvcGRvd246IFwiRHJvcGRvd25cIixcbiAgICAgICAgZmlsZTogXCJGaWxlXCIsXG4gICAgICAgIGh0bWw6IFwiSHRtbFwiLFxuICAgICAgICBtYXRyaXg6IFwiTWF0cml4IChzaW5nbGUgY2hvaWNlKVwiLFxuICAgICAgICBtYXRyaXhkcm9wZG93bjogXCJNYXRyaXggKG11bHRpcGxlIGNob2ljZSlcIixcbiAgICAgICAgbWF0cml4ZHluYW1pYzogXCJNYXRyaXggKGR5bmFtaWMgcm93cylcIixcbiAgICAgICAgbXVsdGlwbGV0ZXh0OiBcIk11bHRpcGxlIFRleHRcIixcbiAgICAgICAgcmFkaW9ncm91cDogXCJSYWRpb2dyb3VwXCIsXG4gICAgICAgIHJhdGluZzogXCJSYXRpbmdcIixcbiAgICAgICAgdGV4dDogXCJUZXh0XCJcbiAgICB9LFxuICAgIC8vU3RyaW5ncyBpbiBFZGl0b3JcbiAgICBlZDoge1xuICAgICAgICBuZXdQYWdlTmFtZTogXCJwYWdlXCIsXG4gICAgICAgIG5ld1F1ZXN0aW9uTmFtZTogXCJxdWVzdGlvblwiLFxuICAgICAgICB0ZXN0U3VydmV5OiBcIlRlc3QgU3VydmV5XCIsXG4gICAgICAgIHRlc3RTdXJ2ZXlBZ2FpbjogXCJUZXN0IFN1cnZleSBBZ2FpblwiLFxuICAgICAgICB0ZXN0U3VydmV5V2lkdGg6IFwiU3VydmV5IHdpZHRoOiBcIixcbiAgICAgICAgZW1iZWRTdXJ2ZXk6IFwiRW1iZWQgU3VydmV5XCIsXG4gICAgICAgIHNhdmVTdXJ2ZXk6IFwiU2F2ZSBTdXJ2ZXlcIixcbiAgICAgICAgZGVzaWduZXI6IFwiRGVzaWduZXJcIixcbiAgICAgICAganNvbkVkaXRvcjogXCJKU09OIEVkaXRvclwiLFxuICAgICAgICB1bmRvOiBcIlVuZG9cIixcbiAgICAgICAgcmVkbzogXCJSZWRvXCIsXG4gICAgICAgIG9wdGlvbnM6IFwiT3B0aW9uc1wiLFxuICAgICAgICBnZW5lcmF0ZVZhbGlkSlNPTjogXCJHZW5lcmF0ZSBWYWxpZCBKU09OXCIsXG4gICAgICAgIGdlbmVyYXRlUmVhZGFibGVKU09OOiBcIkdlbmVyYXRlIFJlYWRhYmxlIEpTT05cIixcbiAgICAgICAgdG9vbGJveDogXCJUb29sYm94XCIsXG4gICAgICAgIGRlbFNlbE9iamVjdDogXCJEZWxldGUgc2VsZWN0ZWQgb2JqZWN0XCIsXG4gICAgICAgIGNvcnJlY3RKU09OOiBcIlBsZWFzZSBjb3JyZWN0IEpTT04uXCIsXG4gICAgICAgIHN1cnZleVJlc3VsdHM6IFwiU3VydmV5IFJlc3VsdDogXCJcbiAgICB9LFxuICAgIC8vUHJvcGVydHkgRWRpdG9yc1xuICAgIHBlOiB7XG4gICAgICAgIGFwcGx5OiBcIkFwcGx5XCIsXG4gICAgICAgIHJlc2V0OiBcIlJlc2V0XCIsXG4gICAgICAgIGNsb3NlOiBcIkNsb3NlXCIsXG4gICAgICAgIGRlbGV0ZTogXCJEZWxldGVcIixcbiAgICAgICAgYWRkTmV3OiBcIkFkZCBOZXdcIixcbiAgICAgICAgcmVtb3ZlQWxsOiBcIlJlbW92ZSBBbGxcIixcbiAgICAgICAgZWRpdDogXCJFZGl0XCIsXG4gICAgICAgIGVtcHR5OiBcIjxlbXB0eT5cIixcbiAgICAgICAgdGVzdFNlcnZpY2U6IFwiVGVzdCB0aGUgc2VydmljZVwiLFxuXG4gICAgICAgIHZhbHVlOiBcIlZhbHVlXCIsXG4gICAgICAgIHRleHQ6IFwiVGV4dFwiLFxuICAgICAgICByZXF1aXJlZDogXCJSZXF1aXJlZD9cIixcbiAgICAgICAgaGFzT3RoZXI6IFwiSGFzIE90aGVyIEl0ZW1cIixcbiAgICAgICAgbmFtZTogXCJOYW1lXCIsXG4gICAgICAgIHRpdGxlOiBcIlRpdGxlXCIsXG4gICAgICAgIGNlbGxUeXBlOiBcIkNlbGwgVHlwZVwiLFxuICAgICAgICBjb2xDb3VudDogXCJDb2x1bW4gQ291bnRcIixcblxuICAgICAgICBlZGl0UHJvcGVydHk6IFwiRWRpdCBwcm9wZXJ0eSAnezB9J1wiLFxuICAgICAgICBpdGVtczogXCJbIEl0ZW1zOiB7MH0gXVwiLFxuXG4gICAgICAgIGVudGVyTmV3VmFsdWU6IFwiUGxlYXNlLCBlbnRlciB0aGUgdmFsdWUuXCIsXG4gICAgICAgIG5vcXVlc3Rpb25zOiBcIlRoZXJlIGlzIG5vIGFueSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LlwiLFxuICAgICAgICBjcmVhdGV0cmlnZ2VyOiBcIlBsZWFzZSBjcmVhdGUgYSB0cmlnZ2VyXCIsXG4gICAgICAgIHRyaWdnZXJPbjogXCJPbiBcIixcbiAgICAgICAgdHJpZ2dlck1ha2VQYWdlc1Zpc2libGU6IFwiTWFrZSBwYWdlcyB2aXNpYmxlOlwiLFxuICAgICAgICB0cmlnZ2VyTWFrZVF1ZXN0aW9uc1Zpc2libGU6IFwiTWFrZSBxdWVzdGlvbnMgdmlzaWJsZTpcIixcbiAgICAgICAgdHJpZ2dlckNvbXBsZXRlVGV4dDogXCJDb21wbGV0ZSB0aGUgc3VydmV5IGlmIHN1Y2NlZWQuXCIsXG4gICAgICAgIHRyaWdnZXJOb3RTZXQ6IFwiVGhlIHRyaWdnZXIgaXMgbm90IHNldFwiLFxuICAgICAgICB0cmlnZ2VyUnVuSWY6IFwiUnVuIGlmXCIsXG4gICAgICAgIHRyaWdnZXJTZXRUb05hbWU6IFwiQ2hhbmdlIHZhbHVlIG9mOiBcIixcbiAgICAgICAgdHJpZ2dlclNldFZhbHVlOiBcInRvOiBcIixcbiAgICAgICAgdHJpZ2dlcklzVmFyaWFibGU6IFwiRG8gbm90IHB1dCB0aGUgdmFyaWFibGUgaW50byB0aGUgc3VydmV5IHJlc3VsdC5cIixcbiAgICAgICAgdmVyYkNoYW5nZVR5cGU6IFwiQ2hhbmdlIHR5cGUgXCIsXG4gICAgICAgIHZlcmJDaGFuZ2VQYWdlOiBcIkNoYW5nZSBwYWdlIFwiXG4gICAgfSxcbiAgICAvL09wZXJhdG9yc1xuICAgIG9wOiB7XG4gICAgICAgIGVtcHR5OiBcImlzIGVtcHR5XCIsXG4gICAgICAgIG5vdGVtcHR5OiBcImlzIG5vdCBlbXB0eVwiLFxuICAgICAgICBlcXVhbDogXCJlcXVhbHNcIixcbiAgICAgICAgbm90ZXF1YWw6IFwibm90IGVxdWFsc1wiLFxuICAgICAgICBjb250YWluczogXCJjb250YWluc1wiLFxuICAgICAgICBub3Rjb250YWluczogXCJub3QgY29udGFpbnNcIixcbiAgICAgICAgZ3JlYXRlcjogXCJncmVhdGVyXCIsXG4gICAgICAgIGxlc3M6IFwibGVzc1wiLFxuICAgICAgICBncmVhdGVyb3JlcXVhbDogXCJncmVhdGVyIG9yIGVxdWFsc1wiLFxuICAgICAgICBsZXNzb3JlcXVhbDogXCJMZXNzIG9yIEVxdWFsc1wiXG4gICAgfSxcbiAgICAvL0VtYmVkIHdpbmRvd1xuICAgIGV3OiB7XG4gICAgICAgIGtub2Nrb3V0OiBcIlVzZSBLbm9ja291dCB2ZXJzaW9uXCIsXG4gICAgICAgIHJlYWN0OiBcIlVzZSBSZWFjdCB2ZXJzaW9uXCIsXG4gICAgICAgIGJvb3RzdHJhcDogXCJGb3IgYm9vdHN0cmFwIGZyYW1ld29ya1wiLFxuICAgICAgICBzdGFuZGFyZDogXCJObyBib290c3RyYXBcIixcbiAgICAgICAgc2hvd09uUGFnZTogXCJTaG93IHN1cnZleSBvbiBhIHBhZ2VcIixcbiAgICAgICAgc2hvd0luV2luZG93OiBcIlNob3cgc3VydmV5IGluIGEgd2luZG93XCIsXG4gICAgICAgIGxvYWRGcm9tU2VydmVyOiBcIkxvYWQgU3VydmV5IEpTT04gZnJvbSBzZXJ2ZXJcIixcbiAgICAgICAgdGl0bGVTY3JpcHQ6IFwiU2NyaXB0cyBhbmQgc3R5bGVzXCIsXG4gICAgICAgIHRpdGxlSHRtbDogXCJIVE1MXCIsXG4gICAgICAgIHRpdGxlSmF2YVNjcmlwdDogXCJKYXZhU2NyaXB0XCJcbiAgICB9LFxuICAgIC8vUHJvcGVydGllc1xuICAgIHA6IHtcbiAgICAgICAgbmFtZTogXCJuYW1lXCIsXG4gICAgICAgIHRpdGxlOiB7IG5hbWU6IFwidGl0bGVcIiwgdGl0bGU6IFwiTGVhdmUgaXQgZW1wdHksIGlmIGl0IGlzIHRoZSBzYW1lIGFzICdOYW1lJ1wiIH0sXG4gICAgICAgIHN1cnZleV90aXRsZTogeyBuYW1lOiBcInRpdGxlXCIsIHRpdGxlOiBcIkl0IHdpbGwgYmUgc2hvd24gb24gZXZlcnkgcGFnZS5cIiB9LFxuICAgICAgICBwYWdlX3RpdGxlOiB7IG5hbWU6IFwidGl0bGVcIiwgdGl0bGU6IFwiUGFnZSB0aXRsZVwiIH1cbiAgICB9XG59O1xuXG5lZGl0b3JMb2NhbGl6YXRpb24ubG9jYWxlc1tcImVuXCJdID0gZGVmYXVsdFN0cmluZ3M7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkaXRvckxvY2FsaXphdGlvbi50cyIsImltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBlbnVtIE9ialR5cGUgeyBVbmtub3duLCBTdXJ2ZXksIFBhZ2UsIFF1ZXN0aW9uIH1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlIZWxwZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV3UGFnZU5hbWUob2JqczogQXJyYXk8YW55Pikge1xuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcImVkLm5ld1BhZ2VOYW1lXCIpKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXROZXdRdWVzdGlvbk5hbWUob2JqczogQXJyYXk8YW55Pikge1xuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcImVkLm5ld1F1ZXN0aW9uTmFtZVwiKSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV3TmFtZShvYmpzOiBBcnJheTxhbnk+LCBiYXNlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGhhc2ggPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoW29ianNbaV0ubmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBudW0gPSAxO1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgaWYgKCFoYXNoW2Jhc2VOYW1lICsgbnVtLnRvU3RyaW5nKCldKSBicmVhaztcbiAgICAgICAgICAgIG51bSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBiYXNlTmFtZSArIG51bS50b1N0cmluZygpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldE9iamVjdFR5cGUob2JqOiBhbnkpOiBPYmpUeXBlIHtcbiAgICAgICAgaWYgKCFvYmogfHwgIW9ialtcImdldFR5cGVcIl0pIHJldHVybiBPYmpUeXBlLlVua25vd247XG4gICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09IFwicGFnZVwiKSByZXR1cm4gT2JqVHlwZS5QYWdlO1xuICAgICAgICBpZiAob2JqLmdldFR5cGUoKSA9PSBcInN1cnZleVwiKSByZXR1cm4gT2JqVHlwZS5TdXJ2ZXk7XG4gICAgICAgIGlmIChvYmpbXCJuYW1lXCJdKSByZXR1cm4gT2JqVHlwZS5RdWVzdGlvbjtcbiAgICAgICAgcmV0dXJuIE9ialR5cGUuVW5rbm93bjtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3ROYW1lKG9iajogYW55KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKG9ialtcIm5hbWVcIl0pIHJldHVybiBvYmpbXCJuYW1lXCJdO1xuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XG4gICAgICAgIGlmIChvYmpUeXBlICE9IE9ialR5cGUuUGFnZSkgcmV0dXJuIFwiXCI7XG4gICAgICAgIHZhciBkYXRhID0gPFN1cnZleS5TdXJ2ZXk+KDxTdXJ2ZXkuUGFnZT5vYmopLmRhdGE7XG4gICAgICAgIHZhciBpbmRleCA9IGRhdGEucGFnZXMuaW5kZXhPZig8U3VydmV5LlBhZ2U+b2JqKTtcbiAgICAgICAgcmV0dXJuIFwiW1BhZ2UgXCIgKyAoaW5kZXggKyAxKSArIFwiXVwiO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3VydmV5SGVscGVyLnRzIiwiaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5pbXBvcnQge1N1cnZleU9iamVjdEVkaXRvcn0gZnJvbSBcIi4uL29iamVjdEVkaXRvclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmFsaWRhdG9yc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3Ige1xuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RFZGl0b3I6IFN1cnZleU9iamVjdEVkaXRvcjtcbiAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xuICAgIHB1YmxpYyBhdmFpbGFibGVWYWxpZGF0b3JzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHJpdmF0ZSB2YWxpZGF0b3JDbGFzc2VzOiBBcnJheTxTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3M+ID0gW107XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvciA9IG5ldyBTdXJ2ZXlPYmplY3RFZGl0b3IoKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdEVkaXRvci5zZWxlY3RlZE9iamVjdCA9IG5ld1ZhbHVlICE9IG51bGwgPyBuZXdWYWx1ZS52YWxpZGF0b3IgOiBudWxsOyB9KTtcbiAgICAgICAgdGhpcy52YWxpZGF0b3JDbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic3VydmV5dmFsaWRhdG9yXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmF2YWlsYWJsZVZhbGlkYXRvcnMgPSB0aGlzLmdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTtcbiAgICAgICAgdGhpcy5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlKHNlbGYua29TZWxlY3RlZCgpKTsgfTtcbiAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKHZhbGlkYXRvclR5cGUpIHsgc2VsZi5hZGRJdGVtKHZhbGlkYXRvclR5cGUpOyB9O1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmFsaWRhdG9yc1wiOyB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xuICAgICAgICBpZiAodGhpcy5rb1NlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5rb0l0ZW1zKCkubGVuZ3RoID4gMCA/IHRoaXMua29JdGVtcygpWzBdIDogbnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7XG4gICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XG4gICAgICAgIHZhciB2YWxpZGF0b3IgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhpdGVtLmdldFR5cGUoKSk7XG4gICAgICAgIGpzb25PYmoudG9PYmplY3QoaXRlbSwgdmFsaWRhdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0odmFsaWRhdG9yKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSA8U3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtPmVkaXRvckl0ZW07XG4gICAgICAgIHJldHVybiBpdGVtLnZhbGlkYXRvcjtcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRJdGVtKHZhbGlkYXRvclR5cGU6IHN0cmluZykge1xuICAgICAgICB2YXIgbmV3VmFsaWRhdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbShTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh2YWxpZGF0b3JUeXBlKSk7XG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKG5ld1ZhbGlkYXRvcik7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZChuZXdWYWxpZGF0b3IpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTogQXJyYXk8c3RyaW5nPiB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhbGlkYXRvckNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudmFsaWRhdG9yQ2xhc3Nlc1tpXS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcml2YXRlIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9iajogYW55LCBuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLmtvU2VsZWN0ZWQoKSA9PSBudWxsKSByZXR1cm47XG4gICAgICAgIHRoaXMua29TZWxlY3RlZCgpLnZhbGlkYXRvcltwcm9wZXJ0eS5uYW1lXSA9IG5ld1ZhbHVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSB7XG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsaWRhdG9yOiBTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHZhbGlkYXRvci5nZXRUeXBlKCk7XG4gICAgfVxufVxuXG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInZhbGlkYXRvcnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlPYmplY3RQcm9wZXJ0eX0gZnJvbSBcIi4vb2JqZWN0UHJvcGVydHlcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RFZGl0b3Ige1xuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RWYWx1ZTogYW55O1xuICAgIHB1YmxpYyBwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSA9IG51bGw7XG4gICAgcHVibGljIGtvUHJvcGVydGllczogYW55O1xuICAgIHB1YmxpYyBrb0FjdGl2ZVByb3BlcnR5OiBhbnk7XG4gICAgcHVibGljIGtvSGFzT2JqZWN0OiBhbnk7XG4gICAgcHVibGljIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQ6IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvck9wdGlvbnMgPSBwcm9wZXJ0eUVkaXRvck9wdGlvbnM7XG4gICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb0hhc09iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBzZWxlY3RlZE9iamVjdCgpOiBhbnkgeyByZXR1cm4gdGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlOyB9XG4gICAgcHVibGljIHNldCBzZWxlY3RlZE9iamVjdCh2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5rb0hhc09iamVjdCh2YWx1ZSAhPSBudWxsKTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllcygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKTtcbiAgICB9XG4gICAgcHVibGljIGdldFByb3BlcnR5RWRpdG9yKG5hbWU6IHN0cmluZykge1xuICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMua29Qcm9wZXJ0aWVzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gcHJvcGVydGllc1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcHVibGljIGNoYW5nZUFjdGl2ZVByb3BlcnR5KHByb3BlcnR5OiBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSkge1xuICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkocHJvcGVydHkpO1xuICAgIH1cbiAgICBwdWJsaWMgT2JqZWN0Q2hhbmdlZCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRPYmplY3QgfHwgIXRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSkge1xuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMoW10pO1xuICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KG51bGwpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyh0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUoKSk7XG4gICAgICAgIHByb3BlcnRpZXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgaWYgKGEubmFtZSA9PSBiLm5hbWUpIHJldHVybiAwO1xuICAgICAgICAgICAgaWYgKGEubmFtZSA+IGIubmFtZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgb2JqZWN0UHJvcGVydGllcyA9IFtdO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciBwcm9wRXZlbnQgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB7XG4gICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7IHByb3BlcnR5OiBwcm9wZXJ0eS5wcm9wZXJ0eSwgb2JqZWN0OiBwcm9wZXJ0eS5vYmplY3QsIG5ld1ZhbHVlOiBuZXdWYWx1ZSB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FuU2hvd1Byb3BlcnR5KHByb3BlcnRpZXNbaV0pKSBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciBvYmplY3RQcm9wZXJ0eSA9IG5ldyBTdXJ2ZXlPYmplY3RQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldLCBwcm9wRXZlbnQsIHRoaXMucHJvcGVydHlFZGl0b3JPcHRpb25zKTtcbiAgICAgICAgICAgIHZhciBsb2NOYW1lID0gdGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKCkgKyAnXycgKyBwcm9wZXJ0aWVzW2ldLm5hbWU7XG4gICAgICAgICAgICBvYmplY3RQcm9wZXJ0eS5kaXNwbGF5TmFtZSA9IGVkaXRvckxvY2FsaXphdGlvbi5nZXRQcm9wZXJ0eU5hbWUobG9jTmFtZSk7XG4gICAgICAgICAgICB2YXIgdGl0bGUgPSBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0UHJvcGVydHlUaXRsZShsb2NOYW1lKTtcbiAgICAgICAgICAgIGlmICghdGl0bGUpIHRpdGxlID0gb2JqZWN0UHJvcGVydHkuZGlzcGxheU5hbWU7XG4gICAgICAgICAgICBvYmplY3RQcm9wZXJ0eS50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgb2JqZWN0UHJvcGVydGllcy5wdXNoKG9iamVjdFByb3BlcnR5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvUHJvcGVydGllcyhvYmplY3RQcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KHRoaXMuZ2V0UHJvcGVydHlFZGl0b3IoXCJuYW1lXCIpKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNhblNob3dQcm9wZXJ0eShwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSk6IGJvb2xlYW4ge1xuICAgICAgICB2YXIgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XG4gICAgICAgIGlmIChuYW1lID09ICdxdWVzdGlvbnMnIHx8IG5hbWUgPT0gJ3BhZ2VzJykgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIHVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5rb1Byb3BlcnRpZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2ldLm9iamVjdCA9IHRoaXMuc2VsZWN0ZWRPYmplY3Q7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29iamVjdEVkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlXCI7XG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgZGVjbGFyZSB0eXBlIFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2sgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0UHJvcGVydHkge1xuICAgIHByaXZhdGUgb2JqZWN0VmFsdWU6IGFueTtcbiAgICBwcml2YXRlIGlzVmFsdWVVcGRhdGluZzogYm9vbGVhbjtcbiAgICBwcml2YXRlIG9uUHJvcGVydHlDaGFuZ2VkOiBTdXJ2ZXlPblByb3BlcnR5Q2hhbmdlZENhbGxiYWNrO1xuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIGRpc3BsYXlOYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmc7XG4gICAgcHVibGljIGtvVmFsdWU6IGFueTtcbiAgICBwdWJsaWMga29UZXh0OiBhbnk7XG4gICAgcHVibGljIG1vZGFsTmFtZTogc3RyaW5nO1xuICAgIHB1YmxpYyBtb2RhbE5hbWVUYXJnZXQ6IHN0cmluZztcbiAgICBwdWJsaWMga29Jc0RlZmF1bHQ6IGFueTtcbiAgICBwdWJsaWMgZWRpdG9yOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2U7XG4gICAgcHVibGljIGVkaXRvclR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgYmFzZUVkaXRvclR5cGU6IHN0cmluZztcbiAgICBwdWJsaWMgY2hvaWNlczogQXJyYXk8YW55PjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb25Qcm9wZXJ0eUNoYW5nZWQ6IFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2sgPSBudWxsLCBwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5vblByb3BlcnR5Q2hhbmdlZCA9IG9uUHJvcGVydHlDaGFuZ2VkO1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLnByb3BlcnR5Lm5hbWU7XG4gICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5jaG9pY2VzID0gcHJvcGVydHkuY2hvaWNlcztcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmVkaXRvclR5cGUgPSBwcm9wZXJ0eS50eXBlO1xuICAgICAgICAvL1RPRE9cbiAgICAgICAgaWYgKHRoaXMuY2hvaWNlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmVkaXRvclR5cGUgPSBcImRyb3Bkb3duXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9uSXRlbUNoYW5nZWQgPSBmdW5jdGlvbiAobmV3VmFsdWU6IGFueSkgeyBzZWxmLm9uQXBwbHlFZGl0b3JWYWx1ZShuZXdWYWx1ZSk7IH07XG4gICAgICAgIHRoaXMuZWRpdG9yID0gU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLmNyZWF0ZUVkaXRvcih0aGlzLmVkaXRvclR5cGUsIG9uSXRlbUNoYW5nZWQpO1xuICAgICAgICB0aGlzLmVkaXRvci5vcHRpb25zID0gcHJvcGVydHlFZGl0b3JPcHRpb25zO1xuICAgICAgICB0aGlzLmVkaXRvclR5cGUgPSB0aGlzLmVkaXRvci5lZGl0b3JUeXBlO1xuICAgICAgICB0aGlzLm1vZGFsTmFtZSA9IFwibW9kZWxFZGl0b3JcIiArIHRoaXMuZWRpdG9yVHlwZSArIHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5tb2RhbE5hbWVUYXJnZXQgPSBcIiNcIiArIHRoaXMubW9kYWxOYW1lO1xuICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLm9ua29WYWx1ZUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcbiAgICAgICAgdGhpcy5rb1RleHQgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmdldFZhbHVlVGV4dChzZWxmLmtvVmFsdWUoKSk7IH0pO1xuICAgICAgICB0aGlzLmtvSXNEZWZhdWx0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5wcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShzZWxmLmtvVmFsdWUoKSk7IH0pO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IG9iamVjdCgpOiBhbnkgeyByZXR1cm4gdGhpcy5vYmplY3RWYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQgb2JqZWN0KHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5vYmplY3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKCk7XG4gICAgfVxuICAgIHByb3RlY3RlZCB1cGRhdGVWYWx1ZSgpIHtcbiAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmtvVmFsdWUodGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0T2JqZWN0KHRoaXMub2JqZWN0KTtcbiAgICAgICAgdGhpcy5lZGl0b3Iuc2V0VGl0bGUoZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLmVkaXRQcm9wZXJ0eVwiKVtcImZvcm1hdFwiXSh0aGlzLnByb3BlcnR5Lm5hbWUpKTtcbiAgICAgICAgdGhpcy51cGRhdGVFZGl0b3JEYXRhKHRoaXMua29WYWx1ZSgpKTtcbiAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgcHJpdmF0ZSBpc0FwcGx5aW5nTmV3VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIG9uQXBwbHlFZGl0b3JWYWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuaXNBcHBseWluZ05ld1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5rb1ZhbHVlKG5ld1ZhbHVlKTtcbiAgICAgICAgdGhpcy5pc0FwcGx5aW5nTmV3VmFsdWUgPSBmYWxzZTtcbiAgICB9XG4gICAgcHJpdmF0ZSBvbmtvVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQXBwbHlpbmdOZXdWYWx1ZSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVFZGl0b3JEYXRhKG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vYmplY3QgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5vYmplY3RbdGhpcy5uYW1lXSA9PSBuZXdWYWx1ZSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5vblByb3BlcnR5Q2hhbmdlZCAhPSBudWxsICYmICF0aGlzLmlzVmFsdWVVcGRhdGluZykgdGhpcy5vblByb3BlcnR5Q2hhbmdlZCh0aGlzLCBuZXdWYWx1ZSk7XG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlRWRpdG9yRGF0YShuZXdWYWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRWYWx1ZSgpOiBhbnkge1xuICAgICAgICBpZiAodGhpcy5wcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSByZXR1cm4gdGhpcy5wcm9wZXJ0eS5nZXRWYWx1ZSh0aGlzLm9iamVjdCk7XG4gICAgICAgIHJldHVybiB0aGlzLm9iamVjdFt0aGlzLm5hbWVdO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5lZGl0b3IuZ2V0VmFsdWVUZXh0KHZhbHVlKTsgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vYmplY3RQcm9wZXJ0eS50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJpdGVtdmFsdWVzXCI7IH1cbiAgICBwdWJsaWMgaGFzRXJyb3IoKTogYm9vbGVhbiB7XG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtvSXRlbXMoKS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmtvSXRlbXMoKVtpXTtcbiAgICAgICAgICAgIGl0ZW0ua29IYXNFcnJvcighaXRlbS5rb1ZhbHVlKCkpO1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0IHx8IGl0ZW0ua29IYXNFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVOZXdFZGl0b3JJdGVtKCk6IGFueSB7IHJldHVybiB7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUoKSwga29UZXh0OiBrby5vYnNlcnZhYmxlKCksIGtvSGFzRXJyb3I6IGtvLm9ic2VydmFibGUoZmFsc2UpIH07IH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGl0ZW1WYWx1ZSA9IGl0ZW07XG4gICAgICAgIHZhciBpdGVtVGV4dCA9IG51bGw7XG4gICAgICAgIGlmIChpdGVtLnZhbHVlKSB7XG4gICAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtLnZhbHVlO1xuICAgICAgICAgICAgaXRlbVRleHQgPSBpdGVtLnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsga29WYWx1ZToga28ub2JzZXJ2YWJsZShpdGVtVmFsdWUpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUoaXRlbVRleHQpLCBrb0hhc0Vycm9yOiBrby5vYnNlcnZhYmxlKGZhbHNlKSB9O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgYWx3YXlTYXZlVGV4dEluUHJvcGVydHlFZGl0b3JzID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5hbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnM7XG4gICAgICAgIHZhciB0ZXh0ID0gZWRpdG9ySXRlbS5rb1RleHQoKTtcbiAgICAgICAgaWYgKCFhbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnMgJiYgZWRpdG9ySXRlbS5rb1RleHQoKSA9PSBlZGl0b3JJdGVtLmtvVmFsdWUoKSkge1xuICAgICAgICAgICAgdGV4dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGVkaXRvckl0ZW0ua29WYWx1ZSgpLCB0ZXh0OiB0ZXh0IH07XG4gICAgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJpdGVtdmFsdWVzXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbVZhbHVlc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5SXRlbVZhbHVlc0VkaXRvclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5RHJvcGRvd25Db2x1bW5zRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmNvbHVtbnNcIjsgfVxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua29JdGVtcygpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwgdGhpcy5rb0l0ZW1zKClbaV0uaGFzRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3RWRpdG9ySXRlbSgpOiBhbnkgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbShuZXcgU3VydmV5Lk1hdHJpeERyb3Bkb3duQ29sdW1uKFwiXCIsIHRoaXMub3B0aW9ucykpOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtKGl0ZW0sIHRoaXMub3B0aW9ucyk7IH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xuICAgICAgICB2YXIgY29sdW1JdGVtID0gPFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbT5lZGl0b3JJdGVtO1xuICAgICAgICBjb2x1bUl0ZW0uYXBwbHkoKTtcbiAgICAgICAgcmV0dXJuIGNvbHVtSXRlbS5jb2x1bW47XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtIHtcbiAgICBwcml2YXRlIGtvQ2hvaWNlczogYW55O1xuICAgIHB1YmxpYyBjaG9pY2VzRWRpdG9yOiBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3I7XG4gICAga29OYW1lOiBhbnk7IGtvVGl0bGU6IGFueTsga29DZWxsVHlwZTogYW55OyBrb1Nob3dDaG9pY2VzOiBhbnk7XG4gICAga29IYXNFcnJvcjogYW55OyBrb0NvbENvdW50OiBhbnk7IGtvSXNSZXF1aXJlZDogYW55OyBrb0hhc090aGVyOiBhbnk7XG4gICAga29IYXNDaG9pY2VzOiBhbnk7IGtvSGFzQ29sQ291bnQ6IGFueTtcbiAgICBwdWJsaWMgb25TaG93Q2hvaWNlc0NsaWNrOiBhbnk7XG4gICAgcHVibGljIGNlbGxUeXBlQ2hvaWNlczogQXJyYXk8YW55PjtcbiAgICBwdWJsaWMgY29sQ291bnRDaG9pY2VzOiBBcnJheTxhbnk+O1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjb2x1bW46IFN1cnZleS5NYXRyaXhEcm9wZG93bkNvbHVtbiwgcHVibGljIG9wdGlvbnMgPSBudWxsKSB7XG4gICAgICAgIHRoaXMuY2VsbFR5cGVDaG9pY2VzID0gdGhpcy5nZXRQcm9wZXJ0eUNob2ljZXMoXCJjZWxsVHlwZVwiKTtcbiAgICAgICAgdGhpcy5jb2xDb3VudENob2ljZXMgPSB0aGlzLmdldFByb3BlcnR5Q2hvaWNlcyhcImNvbENvdW50XCIpO1xuICAgICAgICB0aGlzLmtvTmFtZSA9IGtvLm9ic2VydmFibGUoY29sdW1uLm5hbWUpO1xuICAgICAgICB0aGlzLmtvQ2VsbFR5cGUgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5jZWxsVHlwZSk7XG4gICAgICAgIHRoaXMua29Db2xDb3VudCA9IGtvLm9ic2VydmFibGUoY29sdW1uLmNvbENvdW50KTtcbiAgICAgICAgdGhpcy5rb0lzUmVxdWlyZWQgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5pc1JlcXVpcmVkID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb0hhc090aGVyID0ga28ub2JzZXJ2YWJsZShjb2x1bW4uaGFzT3RoZXIgPyB0cnVlIDogZmFsc2UpO1xuICAgICAgICB0aGlzLmtvVGl0bGUgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5uYW1lID09PSBjb2x1bW4udGl0bGUgPyBcIlwiIDogY29sdW1uLnRpdGxlKTtcbiAgICAgICAgdGhpcy5rb1Nob3dDaG9pY2VzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMua29DaG9pY2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KGNvbHVtbi5jaG9pY2VzKTtcbiAgICAgICAgdGhpcy5rb0hhc0Vycm9yID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5jaG9pY2VzRWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcigpO1xuICAgICAgICB0aGlzLmNob2ljZXNFZGl0b3Iub2JqZWN0ID0gdGhpcy5jb2x1bW47XG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci52YWx1ZSA9IHRoaXMua29DaG9pY2VzKCk7XG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5vblNob3dDaG9pY2VzQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29TaG93Q2hvaWNlcyghc2VsZi5rb1Nob3dDaG9pY2VzKCkpOyB9XG4gICAgICAgIHRoaXMua29IYXNDaG9pY2VzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5rb0NlbGxUeXBlKCkgPT0gXCJkcm9wZG93blwiIHx8IHNlbGYua29DZWxsVHlwZSgpID09IFwiY2hlY2tib3hcIiB8fCBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcInJhZGlvZ3JvdXBcIjsgfSk7XG4gICAgICAgIHRoaXMua29IYXNDb2xDb3VudCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYua29DZWxsVHlwZSgpID09IFwiY2hlY2tib3hcIiB8fCBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcInJhZGlvZ3JvdXBcIjsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHtcbiAgICAgICAgdGhpcy5rb0hhc0Vycm9yKCF0aGlzLmtvTmFtZSgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMua29IYXNFcnJvcigpIHx8IHRoaXMuY2hvaWNlc0VkaXRvci5oYXNFcnJvcigpO1xuICAgIH1cbiAgICBwdWJsaWMgYXBwbHkoKSB7XG4gICAgICAgIHRoaXMuY29sdW1uLm5hbWUgPSB0aGlzLmtvTmFtZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbi50aXRsZSA9IHRoaXMua29UaXRsZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5jZWxsVHlwZSA9IHRoaXMua29DZWxsVHlwZSgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5jb2xDb3VudCA9IHRoaXMua29Db2xDb3VudCgpO1xuICAgICAgICB0aGlzLmNvbHVtbi5pc1JlcXVpcmVkID0gdGhpcy5rb0lzUmVxdWlyZWQoKTtcbiAgICAgICAgdGhpcy5jb2x1bW4uaGFzT3RoZXIgPSB0aGlzLmtvSGFzT3RoZXIoKTtcblxuICAgICAgICB0aGlzLmNob2ljZXNFZGl0b3Iub25BcHBseUNsaWNrKCk7XG4gICAgICAgIHRoaXMuY29sdW1uLmNob2ljZXMgPSB0aGlzLmNob2ljZXNFZGl0b3IudmFsdWU7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UHJvcGVydHlDaG9pY2VzKHByb3BldHlOYW1lOiBzdHJpbmcpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBwcm9wZXR5TmFtZSkgcmV0dXJuIHByb3BlcnRpZXNbaV0uY2hvaWNlcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJtYXRyaXhkcm9wZG93bmNvbHVtbnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlEcm9wZG93bkNvbHVtbnNFZGl0b3IoKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlNb2RhbEVkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVJlc3VsdGZ1bGxFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yIHtcbiAgICBrb1VybDogYW55OyBrb1BhdGg6IGFueTsga29WYWx1ZU5hbWU6IGFueTsga29UaXRsZU5hbWU6IGFueTtcbiAgICBwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5O1xuICAgIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uRHJvcGRvd247XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5rb1VybCA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb1BhdGggPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMua29WYWx1ZU5hbWUgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMua29UaXRsZU5hbWUgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHRoaXMuY3JlYXRlU3VydmV5KCk7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5rb1VybC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnVybCA9IG5ld1ZhbHVlOyBzZWxmLnJ1bigpOyB9KTtcbiAgICAgICAgdGhpcy5rb1BhdGguc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnF1ZXN0aW9uLmNob2ljZXNCeVVybC5wYXRoID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgICAgICB0aGlzLmtvVmFsdWVOYW1lLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5xdWVzdGlvbi5jaG9pY2VzQnlVcmwudmFsdWVOYW1lID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgICAgICB0aGlzLmtvVGl0bGVOYW1lLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5xdWVzdGlvbi5jaG9pY2VzQnlVcmwudGl0bGVOYW1lID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicmVzdGZ1bGxcIjsgfVxuICAgIHB1YmxpYyBnZXQgcmVzdGZ1bGxWYWx1ZSgpIHsgcmV0dXJuIDxTdXJ2ZXkuQ2hvaWNlc1Jlc3RmdWxsPnRoaXMudmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIXZhbHVlIHx8ICF2YWx1ZS51cmwpIHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUuZW1wdHlcIik7XG4gICAgICAgIHZhciBzdHIgPSB2YWx1ZS51cmw7XG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMjApIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgMjApICsgXCIuLi5cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XG4gICAgICAgIHZhciB2YWwgPSB0aGlzLnJlc3RmdWxsVmFsdWU7XG4gICAgICAgIHRoaXMua29VcmwodmFsID8gdmFsLnVybCA6IFwiXCIpO1xuICAgICAgICB0aGlzLmtvUGF0aCh2YWwgPyB2YWwucGF0aCA6IFwiXCIpO1xuICAgICAgICB0aGlzLmtvVmFsdWVOYW1lKHZhbCA/IHZhbC52YWx1ZU5hbWUgOiBcIlwiKTtcbiAgICAgICAgdGhpcy5rb1RpdGxlTmFtZSh2YWwgPyB2YWwudGl0bGVOYW1lIDogXCJcIik7XG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcihcInJlc3RmdWxsU3VydmV5XCIpO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHtcbiAgICAgICAgdmFyIHZhbCA9IG5ldyBTdXJ2ZXkuQ2hvaWNlc1Jlc3RmdWxsKCk7XG4gICAgICAgIHZhbC51cmwgPSB0aGlzLmtvVXJsKCk7XG4gICAgICAgIHZhbC5wYXRoID0gdGhpcy5rb1BhdGgoKTtcbiAgICAgICAgdmFsLnZhbHVlTmFtZSA9IHRoaXMua29WYWx1ZU5hbWUoKTtcbiAgICAgICAgdmFsLnRpdGxlTmFtZSA9IHRoaXMua29UaXRsZU5hbWUoKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZUNvcmUodmFsKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBydW4oKSB7XG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnJ1bigpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVN1cnZleSgpIHtcbiAgICAgICAgdGhpcy5zdXJ2ZXkgPSBuZXcgU3VydmV5LlN1cnZleSgpO1xuICAgICAgICB0aGlzLnN1cnZleS5zaG93TmF2aWdhdGlvbkJ1dHRvbnMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdXJ2ZXkuc2hvd1F1ZXN0aW9uTnVtYmVycyA9IFwib2ZmXCI7XG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuYWRkTmV3UGFnZShcInBhZ2UxXCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkRyb3Bkb3duPnBhZ2UuYWRkTmV3UXVlc3Rpb24oXCJkcm9wZG93blwiLCBcInExXCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uLnRpdGxlID0gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRlc3RTZXJ2aWNlXCIpXG4gICAgICAgIHRoaXMucXVlc3Rpb24uY2hvaWNlcyA9IFtdO1xuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoXCJyZXN0ZnVsbFN1cnZleVwiKTtcbiAgICB9XG59XG5cblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInJlc3RmdWxsXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5UmVzdWx0ZnVsbEVkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5UmVzdGZ1bGxFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVByb3BlcnR5SXRlbXNFZGl0b3J9IGZyb20gXCIuL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2Vyc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3Ige1xuICAgIGtvUXVlc3Rpb25zOiBhbnk7IGtvUGFnZXM6IGFueTtcbiAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xuICAgIHB1YmxpYyBhdmFpbGFibGVUcmlnZ2VyczogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIHByaXZhdGUgdHJpZ2dlckNsYXNzZXM6IEFycmF5PFN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcz4gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9O1xuICAgICAgICB0aGlzLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAodHJpZ2dlclR5cGUpIHsgc2VsZi5hZGRJdGVtKHRyaWdnZXJUeXBlKTsgfTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcbiAgICAgICAgdGhpcy5rb1BhZ2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29RdWVzdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyQ2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInN1cnZleXRyaWdnZXJcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYXZhaWxhYmxlVHJpZ2dlcnMgPSB0aGlzLmdldEF2YWlsYWJsZVRyaWdnZXJzKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0cmlnZ2Vyc1wiOyB9XG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xuICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xuICAgICAgICBpZiAodGhpcy5vYmplY3QpIHtcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyh0aGlzLmdldE5hbWVzKCg8U3VydmV5LlN1cnZleT50aGlzLm9iamVjdCkucGFnZXMpKTtcbiAgICAgICAgICAgIHRoaXMua29RdWVzdGlvbnModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLmdldEFsbFF1ZXN0aW9ucygpKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMua29TZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKHRoaXMua29JdGVtcygpLmxlbmd0aCA+IDAgPyB0aGlzLmtvSXRlbXMoKVswXSA6IG51bGwpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRJdGVtKHRyaWdnZXJUeXBlOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIHRyaWdnZXIgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh0cmlnZ2VyVHlwZSk7XG4gICAgICAgIHZhciB0cmlnZ2VySXRlbSA9IHRoaXMuY3JlYXRlUHJvcGVydHlUcmlnZ2VyKHRyaWdnZXIpO1xuICAgICAgICB0aGlzLmtvSXRlbXMucHVzaCh0cmlnZ2VySXRlbSk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZCh0cmlnZ2VySXRlbSk7XG4gICAgfVxuICAgIHByb3RlY3RlZCBjcmVhdGVFZGl0b3JJdGVtKGl0ZW06IGFueSkge1xuICAgICAgICB2YXIganNvbk9iaiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpO1xuICAgICAgICB2YXIgdHJpZ2dlciA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKGl0ZW0uZ2V0VHlwZSgpKTtcbiAgICAgICAganNvbk9iai50b09iamVjdChpdGVtLCB0cmlnZ2VyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUHJvcGVydHlUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlcj50cmlnZ2VyKTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGVkaXRvclRyaWdnZXIgPSA8U3VydmV5UHJvcGVydHlUcmlnZ2VyPmVkaXRvckl0ZW07XG4gICAgICAgIHJldHVybiBlZGl0b3JUcmlnZ2VyLmNyZWF0ZVRyaWdnZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRBdmFpbGFibGVUcmlnZ2VycygpOiBBcnJheTxzdHJpbmc+IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudHJpZ2dlckNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudHJpZ2dlckNsYXNzZXNbaV0ubmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXROYW1lcyhpdGVtczogQXJyYXk8YW55Pik6IEFycmF5PHN0cmluZz4ge1xuICAgICAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgICAgIGlmIChpdGVtW1wibmFtZVwiXSkge1xuICAgICAgICAgICAgICAgIG5hbWVzLnB1c2goaXRlbVtcIm5hbWVcIl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lcztcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVQcm9wZXJ0eVRyaWdnZXIodHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXIpOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlckl0ZW0gPSBudWxsO1xuICAgICAgICBpZiAodHJpZ2dlci5nZXRUeXBlKCkgPT0gXCJ2aXNpYmxldHJpZ2dlclwiKSB7XG4gICAgICAgICAgICB0cmlnZ2VySXRlbSA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZpc2libGVUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGU+dHJpZ2dlciwgdGhpcy5rb1BhZ2VzLCB0aGlzLmtvUXVlc3Rpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHJpZ2dlci5nZXRUeXBlKCkgPT0gXCJzZXR2YWx1ZXRyaWdnZXJcIikge1xuICAgICAgICAgICAgdHJpZ2dlckl0ZW0gPSBuZXcgU3VydmV5UHJvcGVydHlTZXRWYWx1ZVRyaWdnZXIoPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyU2V0VmFsdWU+dHJpZ2dlciwgdGhpcy5rb1F1ZXN0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0cmlnZ2VySXRlbSkge1xuICAgICAgICAgICAgdHJpZ2dlckl0ZW0gPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyKHRyaWdnZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cmlnZ2VySXRlbTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2VyIHtcbiAgICBwcml2YXRlIG9wZXJhdG9ycyA9IFtcImVtcHR5XCIsIFwibm90ZW1wdHlcIiwgXCJlcXVhbFwiLCBcIm5vdGVxdWFsXCIsIFwiY29udGFpbnNcIiwgXCJub3Rjb250YWluc1wiLCBcImdyZWF0ZXJcIiwgXCJsZXNzXCIsIFwiZ3JlYXRlcm9yZXF1YWxcIiwgXCJsZXNzb3JlcXVhbFwiXTtcbiAgICBwcml2YXRlIHRyaWdnZXJUeXBlOiBzdHJpbmc7XG4gICAgYXZhaWxhYmxlT3BlcmF0b3JzID0gW107XG4gICAga29OYW1lOiBhbnk7IGtvT3BlcmF0b3I6IGFueTsga29WYWx1ZTogYW55OyBrb1R5cGU6IGFueTtcbiAgICBrb1RleHQ6IGFueTsga29Jc1ZhbGlkOiBhbnk7IGtvUmVxdWlyZVZhbHVlOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXIpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVPcGVyYXRvcnMoKTtcbiAgICAgICAgdGhpcy50cmlnZ2VyVHlwZSA9IHRyaWdnZXIuZ2V0VHlwZSgpO1xuICAgICAgICB0aGlzLmtvVHlwZSA9IGtvLm9ic2VydmFibGUodGhpcy50cmlnZ2VyVHlwZSk7XG4gICAgICAgIHRoaXMua29OYW1lID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLm5hbWUpO1xuICAgICAgICB0aGlzLmtvT3BlcmF0b3IgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIub3BlcmF0b3IpO1xuICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIudmFsdWUpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29SZXF1aXJlVmFsdWUgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmtvT3BlcmF0b3IoKSAhPSBcImVtcHR5XCIgJiYgc2VsZi5rb09wZXJhdG9yKCkgIT0gXCJub3RlbXB0eVwiOyB9KTtcbiAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5jb21wdXRlZCgoKSA9PiB7IGlmIChzZWxmLmtvTmFtZSgpICYmICghc2VsZi5rb1JlcXVpcmVWYWx1ZSgpIHx8IHNlbGYua29WYWx1ZSgpKSkgcmV0dXJuIHRydWU7IHJldHVybiBmYWxzZTsgfSk7XG4gICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyBzZWxmLmtvTmFtZSgpOyBzZWxmLmtvT3BlcmF0b3IoKTsgc2VsZi5rb1ZhbHVlKCk7IHJldHVybiBzZWxmLmdldFRleHQoKTsgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBjcmVhdGVUcmlnZ2VyKCk6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyIHtcbiAgICAgICAgdmFyIHRyaWdnZXIgPSA8U3VydmV5LlN1cnZleVRyaWdnZXI+U3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3ModGhpcy50cmlnZ2VyVHlwZSk7XG4gICAgICAgIHRyaWdnZXIubmFtZSA9IHRoaXMua29OYW1lKCk7XG4gICAgICAgIHRyaWdnZXIub3BlcmF0b3IgPSB0aGlzLmtvT3BlcmF0b3IoKTtcbiAgICAgICAgdHJpZ2dlci52YWx1ZSA9IHRoaXMua29WYWx1ZSgpO1xuICAgICAgICByZXR1cm4gdHJpZ2dlcjtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVPcGVyYXRvcnMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcGVyYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5vcGVyYXRvcnNbaV07XG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZU9wZXJhdG9ycy5wdXNoKHsgbmFtZTogbmFtZSwgdGV4dDogZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wLlwiICsgbmFtZSkgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5rb0lzVmFsaWQoKSkgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS50cmlnZ2VyTm90U2V0XCIpO1xuICAgICAgICByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJSdW5JZlwiKSArIFwiICdcIiArIHRoaXMua29OYW1lKCkgKyBcIicgXCIgKyB0aGlzLmdldE9wZXJhdG9yVGV4dCgpICsgdGhpcy5nZXRWYWx1ZVRleHQoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRPcGVyYXRvclRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIG9wID0gdGhpcy5rb09wZXJhdG9yKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdmFpbGFibGVPcGVyYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZU9wZXJhdG9yc1tpXS5uYW1lID09IG9wKSByZXR1cm4gdGhpcy5hdmFpbGFibGVPcGVyYXRvcnNbaV0udGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3A7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0VmFsdWVUZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICghdGhpcy5rb1JlcXVpcmVWYWx1ZSgpKSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIFwiIFwiICsgdGhpcy5rb1ZhbHVlKCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWaXNpYmxlVHJpZ2dlciBleHRlbmRzIFN1cnZleVByb3BlcnR5VHJpZ2dlciB7XG4gICAgcHVibGljIHBhZ2VzOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzO1xuICAgIHB1YmxpYyBxdWVzdGlvbnM6IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHM7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSwga29QYWdlczogYW55LCBrb1F1ZXN0aW9uczogYW55KSB7XG4gICAgICAgIHN1cGVyKHRyaWdnZXIpO1xuICAgICAgICB0aGlzLnBhZ2VzID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMoZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJNYWtlUGFnZXNWaXNpYmxlXCIpLCBrb1BhZ2VzKCksIHRyaWdnZXIucGFnZXMpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9ucyA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS50cmlnZ2VyTWFrZVF1ZXN0aW9uc1Zpc2libGVcIiksIGtvUXVlc3Rpb25zKCksIHRyaWdnZXIucXVlc3Rpb25zKTtcbiAgICB9XG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGU+c3VwZXIuY3JlYXRlVHJpZ2dlcigpO1xuICAgICAgICB0cmlnZ2VyLnBhZ2VzID0gdGhpcy5wYWdlcy5rb0Nob29zZW4oKTtcbiAgICAgICAgdHJpZ2dlci5xdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucy5rb0Nob29zZW4oKTtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXI7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlTZXRWYWx1ZVRyaWdnZXIgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xuICAgIGtvUXVlc3Rpb25zOiBhbnk7IGtvc2V0VG9OYW1lOiBhbnk7IGtvc2V0VmFsdWU6IGFueTsga29pc1ZhcmlhYmxlOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHVibGljIHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyU2V0VmFsdWUsIGtvUXVlc3Rpb25zOiBhbnkpIHtcbiAgICAgICAgc3VwZXIodHJpZ2dlcik7XG4gICAgICAgIHRoaXMua29RdWVzdGlvbnMgPSBrb1F1ZXN0aW9ucztcbiAgICAgICAgdGhpcy5rb3NldFRvTmFtZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5zZXRUb05hbWUpO1xuICAgICAgICB0aGlzLmtvc2V0VmFsdWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIuc2V0VmFsdWUpO1xuICAgICAgICB0aGlzLmtvaXNWYXJpYWJsZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5pc1ZhcmlhYmxlKTtcbiAgICB9XG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXIge1xuICAgICAgICB2YXIgdHJpZ2dlciA9IDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclNldFZhbHVlPnN1cGVyLmNyZWF0ZVRyaWdnZXIoKTtcbiAgICAgICAgdHJpZ2dlci5zZXRUb05hbWUgPSB0aGlzLmtvc2V0VG9OYW1lKCk7XG4gICAgICAgIHRyaWdnZXIuc2V0VmFsdWUgPSB0aGlzLmtvc2V0VmFsdWUoKTtcbiAgICAgICAgdHJpZ2dlci5pc1ZhcmlhYmxlID0gdGhpcy5rb2lzVmFyaWFibGUoKTtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXI7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMge1xuICAgIGtvT2JqZWN0czogYW55O1xuICAgIGtvQ2hvb3NlbjogYW55O1xuICAgIGtvU2VsZWN0ZWQ6IGFueTtcbiAgICBrb0Nob29zZW5TZWxlY3RlZDogYW55O1xuICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XG4gICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGl0bGU6IHN0cmluZywgYWxsT2JqZWN0czogQXJyYXk8c3RyaW5nPiwgY2hvb3Nlbk9iamVjdHM6IEFycmF5PHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy5rb0Nob29zZW4gPSBrby5vYnNlcnZhYmxlQXJyYXkoY2hvb3Nlbk9iamVjdHMpO1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxPYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGFsbE9iamVjdHNbaV07XG4gICAgICAgICAgICBpZiAoY2hvb3Nlbk9iamVjdHMuaW5kZXhPZihpdGVtKSA8IDApIHtcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KGFycmF5KTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmtvQ2hvb3NlblNlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kZWxldGVJdGVtKCk7IH07XG4gICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hZGRJdGVtKCk7IH1cbiAgICB9XG4gICAgcHJpdmF0ZSBkZWxldGVJdGVtKCkge1xuICAgICAgICB0aGlzLmNoYW5nZUl0ZW1zKHRoaXMua29DaG9vc2VuU2VsZWN0ZWQoKSwgdGhpcy5rb0Nob29zZW4sIHRoaXMua29PYmplY3RzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRJdGVtKCkge1xuICAgICAgICB0aGlzLmNoYW5nZUl0ZW1zKHRoaXMua29TZWxlY3RlZCgpLCB0aGlzLmtvT2JqZWN0cywgdGhpcy5rb0Nob29zZW4pO1xuICAgIH1cbiAgICBwcml2YXRlIGNoYW5nZUl0ZW1zKGl0ZW06IHN0cmluZywgcmVtb3ZlZEZyb206IGFueSwgYWRkVG86IGFueSkge1xuICAgICAgICByZW1vdmVkRnJvbS5yZW1vdmUoaXRlbSk7XG4gICAgICAgIGFkZFRvLnB1c2goaXRlbSk7XG4gICAgICAgIHJlbW92ZWRGcm9tLnNvcnQoKTtcbiAgICAgICAgYWRkVG8uc29ydCgpO1xuICAgIH1cbn1cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidHJpZ2dlcnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2Vyc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5VHJpZ2dlcnNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleUhlbHBlcn0gZnJvbSBcIi4vc3VydmV5SGVscGVyXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgZGVjbGFyZSB0eXBlIFN1cnZleUFkZE5ld1BhZ2VDYWxsYmFjayA9ICgpID0+IHZvaWQ7XG5leHBvcnQgZGVjbGFyZSB0eXBlIFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjayA9IChwYWdlOiBTdXJ2ZXkuUGFnZSkgPT4gdm9pZDtcbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5TW92ZVBhZ2VDYWxsYmFjayA9IChpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSA9PiB2b2lkO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UGFnZXNFZGl0b3Ige1xuICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuICAgIGtvUGFnZXM6IGFueTtcbiAgICBrb0lzVmFsaWQ6IGFueTtcbiAgICBzZWxlY3RQYWdlQ2xpY2s6IGFueTtcbiAgICBvbkFkZE5ld1BhZ2VDYWxsYmFjazogU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrO1xuICAgIG9uU2VsZWN0UGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2s7XG4gICAgb25EZWxldGVQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcbiAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2s7XG4gICAgZHJhZ2dpbmdQYWdlOiBhbnkgPSBudWxsO1xuICAgIGRyYWdTdGFydDogYW55OyBkcmFnT3ZlcjogYW55OyBkcmFnRW5kOiBhbnk7IGRyYWdEcm9wOiBhbnk7IGtleURvd246IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSBudWxsLCBvblNlbGVjdFBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCxcbiAgICAgICAgICAgICAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2sgPSBudWxsLCBvbkRlbGV0ZVBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCkge1xuICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjayA9IG9uQWRkTmV3UGFnZUNhbGxiYWNrO1xuICAgICAgICB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrID0gb25TZWxlY3RQYWdlQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrID0gb25Nb3ZlUGFnZUNhbGxiYWNrO1xuICAgICAgICB0aGlzLm9uRGVsZXRlUGFnZUNhbGxiYWNrID0gb25EZWxldGVQYWdlQ2FsbGJhY2s7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5zZWxlY3RQYWdlQ2xpY2sgPSBmdW5jdGlvbihwYWdlSXRlbSkge1xuICAgICAgICAgICAgaWYgKHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxmLm9uU2VsZWN0UGFnZUNhbGxiYWNrKHBhZ2VJdGVtLnBhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmtleURvd24gPSBmdW5jdGlvbiAoZWw6IGFueSwgZTogS2V5Ym9hcmRFdmVudCkgeyBzZWxmLm9uS2V5RG93bihlbCwgZSk7IH1cbiAgICAgICAgdGhpcy5kcmFnU3RhcnQgPSBmdW5jdGlvbiAoZWw6IGFueSkgeyBzZWxmLmRyYWdnaW5nUGFnZSA9IGVsOyB9O1xuICAgICAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGVsOiBhbnkpIHsgIH07XG4gICAgICAgIHRoaXMuZHJhZ0VuZCA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBudWxsOyB9O1xuICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGVsOiBhbnkpIHsgc2VsZi5tb3ZlRHJhZ2dpbmdQYWdlVG8oZWwpOyB9O1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMua29Jc1ZhbGlkKHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbCk7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnZXMoKTtcbiAgICB9XG4gICAgcHVibGljIHNldFNlbGVjdGVkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xuICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmtvUGFnZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcGFnZXNbaV0ua29TZWxlY3RlZChwYWdlc1tpXS5wYWdlID09IHBhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBhZGROZXdQYWdlQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIHJlbW92ZVBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMua29QYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBjaGFuZ2VOYW1lKHBhZ2U6IFN1cnZleS5QYWdlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXhCeVBhZ2UocGFnZSk7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMoKVtpbmRleF0udGl0bGUoU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUocGFnZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXRJbmRleEJ5UGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSk6IG51bWJlciB7XG4gICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocGFnZXNbaV0ucGFnZSA9PSBwYWdlKSByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIHByb3RlY3RlZCBvbktleURvd24oZWw6IGFueSwgZTogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5rb1BhZ2VzKCkubGVuZ3RoIDw9IDEpIHJldHVybjtcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XG4gICAgICAgIHZhciBwYWdlSW5kZXggPSAtMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBhZ2VzW2ldLnBhZ2UgJiYgcGFnZXNbaV0ua29TZWxlY3RlZCgpKSB7XG4gICAgICAgICAgICAgICAgcGFnZUluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocGFnZUluZGV4IDwgMCkgcmV0dXJuO1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09IDQ2ICYmIHRoaXMub25EZWxldGVQYWdlQ2FsbGJhY2spIHRoaXMub25EZWxldGVQYWdlQ2FsbGJhY2soZWwucGFnZSk7XG4gICAgICAgIGlmICgoZS5rZXlDb2RlID09IDM3IHx8IGUua2V5Q29kZSA9PSAzOSkgJiYgdGhpcy5vblNlbGVjdFBhZ2VDYWxsYmFjaykge1xuICAgICAgICAgICAgcGFnZUluZGV4ICs9IChlLmtleUNvZGUgPT0gMzcgPyAtMSA6IDEpO1xuICAgICAgICAgICAgaWYgKHBhZ2VJbmRleCA8IDApIHBhZ2VJbmRleCA9IHBhZ2VzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBpZiAocGFnZUluZGV4ID49IHBhZ2VzLmxlbmd0aCkgcGFnZUluZGV4ID0gMDtcbiAgICAgICAgICAgIHZhciBwYWdlID0gcGFnZXNbcGFnZUluZGV4XS5wYWdlO1xuICAgICAgICAgICAgdGhpcy5vblNlbGVjdFBhZ2VDYWxsYmFjayhwYWdlKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRQYWdlKHBhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByb3RlY3RlZCB1cGRhdGVQYWdlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKFtdKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFnZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV07XG4gICAgICAgICAgICBwYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0aXRsZToga28ub2JzZXJ2YWJsZShTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSksIHBhZ2U6IHBhZ2UsIGtvU2VsZWN0ZWQ6IGtvLm9ic2VydmFibGUoZmFsc2UpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvUGFnZXMocGFnZXMpO1xuICAgIH1cbiAgICBwcml2YXRlIG1vdmVEcmFnZ2luZ1BhZ2VUbyh0b1BhZ2U6IGFueSkge1xuICAgICAgICBpZiAodG9QYWdlID09IG51bGwgfHwgdG9QYWdlID09IHRoaXMuZHJhZ2dpbmdQYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nUGFnZSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmdQYWdlID09IG51bGwpIHJldHVybjtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0aGlzLmRyYWdnaW5nUGFnZSk7XG4gICAgICAgIHZhciBpbmRleFRvID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0b1BhZ2UpO1xuICAgICAgICBpZiAodGhpcy5vbk1vdmVQYWdlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrKGluZGV4LCBpbmRleFRvKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleUpTT041fSBmcm9tIFwiLi9qc29uNVwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuY2xhc3MgVGV4dFBhcnNlclByb3Blcnkge1xuICAgIGlzRm91bmQ6IGJvb2xlYW47XG4gICAgcHJvcGVydGllc0NvdW50OiBudW1iZXI7XG4gICAgc3RhcnQ6IG51bWJlcjtcbiAgICBlbmQ6IG51bWJlcjtcbiAgICB2YWx1ZVN0YXJ0OiBudW1iZXI7XG4gICAgdmFsdWVFbmQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFN1cnZleVRleHRXb3JrZXIge1xuICAgIHB1YmxpYyBzdGF0aWMgbmV3TGluZUNoYXI6IHN0cmluZztcbiAgICBwdWJsaWMgZXJyb3JzOiBBcnJheTxhbnk+O1xuICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XG4gICAgcHJpdmF0ZSBqc29uVmFsdWU6IGFueTtcbiAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IEFycmF5PGFueT47XG4gICAgcHJpdmF0ZSBpc1N1cnZleUFzUGFnZTogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHQgfHwgdGhpcy50ZXh0LnRyaW0oKSA9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLnRleHQgPSBcInt9XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9jZXNzKCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBnZXQgaXNKc29uQ29ycmVjdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbDsgfVxuICAgIHByb3RlY3RlZCBwcm9jZXNzKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5qc29uVmFsdWUgPSBuZXcgU3VydmV5SlNPTjUoMSkucGFyc2UodGhpcy50ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goeyBwb3M6IHsgc3RhcnQ6IGVycm9yLmF0LCBlbmQ6IC0xIH0sIHRleHQ6IGVycm9yLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuanNvblZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyh0aGlzLmpzb25WYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkodGhpcy5qc29uVmFsdWUpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9ycyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5nZXRGdWxsRGVzY3JpcHRpb24oKSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzID0gdGhpcy5jcmVhdGVTdXJ2ZXlPYmplY3RzKCk7XG4gICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5zdXJ2ZXlPYmplY3RzKTtcbiAgICAgICAgdGhpcy5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCh0aGlzLmVycm9ycyk7XG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlSnNvblBvc2l0aW9ucyhqc29uT2JqOiBhbnkpIHtcbiAgICAgICAganNvbk9ialtcInBvc1wiXVtcInNlbGZcIl0gPSBqc29uT2JqO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xuICAgICAgICAgICAgdmFyIG9iaiA9IGpzb25PYmpba2V5XTtcbiAgICAgICAgICAgIGlmIChvYmogJiYgb2JqW1wicG9zXCJdKSB7XG4gICAgICAgICAgICAgICAganNvbk9ialtcInBvc1wiXVtrZXldID0gb2JqW1wicG9zXCJdO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyhvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgY3JlYXRlU3VydmV5T2JqZWN0cygpOiBBcnJheTxhbnk+IHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzW2ldO1xuICAgICAgICAgICAgaWYgKGkgPT0gMCAmJiAhcGFnZVtcInBvc1wiXSkge1xuICAgICAgICAgICAgICAgIHBhZ2VbXCJwb3NcIl0gPSB0aGlzLnN1cnZleVZhbHVlW1wicG9zXCJdO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdXJ2ZXlBc1BhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZS5xdWVzdGlvbnNbal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQob2JqZWN0czogYW55W10pIHtcbiAgICAgICAgaWYgKG9iamVjdHMgPT0gbnVsbCB8fCBvYmplY3RzLmxlbmd0aCA9PSAwKSByZXR1cm47XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IHsgcm93OiAwLCBjb2x1bW46IDAgfTtcbiAgICAgICAgdmFyIGF0T2JqZWN0c0FycmF5ID0gdGhpcy5nZXRBdEFycmF5KG9iamVjdHMpO1xuICAgICAgICB2YXIgc3RhcnRBdDogbnVtYmVyID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdE9iamVjdHNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGF0ID0gYXRPYmplY3RzQXJyYXlbaV0uYXQ7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zdGlvbkJ5Q2hhcnRBdChwb3NpdGlvbiwgc3RhcnRBdCwgYXQpO1xuICAgICAgICAgICAgdmFyIG9iaiA9IGF0T2JqZWN0c0FycmF5W2ldLm9iajtcbiAgICAgICAgICAgIGlmICghb2JqLnBvc2l0aW9uKSBvYmoucG9zaXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnN0YXJ0ID0gcG9zaXRpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLmVuZCkge1xuICAgICAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uZW5kID0gcG9zaXRpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhcnRBdCA9IGF0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UG9zdGlvbkJ5Q2hhcnRBdChzdGFydFBvc2l0aW9uOiBBY2VBamF4LlBvc2l0aW9uLCBzdGFydEF0OiBudW1iZXIsIGF0OiBudW1iZXIpOiBhbnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0geyByb3c6IHN0YXJ0UG9zaXRpb24ucm93LCBjb2x1bW46IHN0YXJ0UG9zaXRpb24uY29sdW1uIH07XG4gICAgICAgIHZhciBjdXJDaGFyID0gc3RhcnRBdDtcbiAgICAgICAgd2hpbGUgKGN1ckNoYXIgPCBhdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudGV4dC5jaGFyQXQoY3VyQ2hhcikgPT0gU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5yb3crKztcbiAgICAgICAgICAgICAgICByZXN1bHQuY29sdW1uID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyQ2hhcisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0QXRBcnJheShvYmplY3RzOiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBvYmplY3RzW2ldO1xuICAgICAgICAgICAgdmFyIHBvcyA9IG9iai5wb3M7XG4gICAgICAgICAgICBpZiAoIXBvcykgY29udGludWU7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh7IGF0OiBwb3Muc3RhcnQsIG9iajogb2JqIH0pO1xuICAgICAgICAgICAgaWYgKHBvcy5lbmQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLmVuZCwgb2JqOiBvYmogfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KChlbDEsIGVsMikgPT4ge1xuICAgICAgICAgICAgaWYgKGVsMS5hdCA+IGVsMi5hdCkgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoZWwxLmF0IDwgZWwyLmF0KSByZXR1cm4gLTE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90ZXh0V29ya2VyLnRzIiwiLy8gVGhpcyBmaWxlIGlzIGJhc2VkIG9uIEpTT041LCBodHRwOi8vanNvbjUub3JnL1xuLy8gVGhlIG1vZGlmaWNhdGlvbiBmb3IgZ2V0dGluZyBvYmplY3QgYW5kIHByb3BlcnRpZXMgbG9jYXRpb24gJ2F0JyB3ZXJlIG1hZGVuLlxuXG5leHBvcnQgY2xhc3MgU3VydmV5SlNPTjUge1xuICAgIHB1YmxpYyBzdGF0aWMgcG9zaXRpb25OYW1lID0gXCJwb3NcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGVlID0ge1xuICAgICAgICBcIidcIjogXCInXCIsXG4gICAgICAgICdcIic6ICdcIicsXG4gICAgICAgICdcXFxcJzogJ1xcXFwnLFxuICAgICAgICAnLyc6ICcvJyxcbiAgICAgICAgJ1xcbic6ICcnLCAgICAgICAvLyBSZXBsYWNlIGVzY2FwZWQgbmV3bGluZXMgaW4gc3RyaW5ncyB3LyBlbXB0eSBzdHJpbmdcbiAgICAgICAgYjogJ1xcYicsXG4gICAgICAgIGY6ICdcXGYnLFxuICAgICAgICBuOiAnXFxuJyxcbiAgICAgICAgcjogJ1xccicsXG4gICAgICAgIHQ6ICdcXHQnXG4gICAgfTtcbiAgICBwcml2YXRlIHN0YXRpYyB3cyA9IFtcbiAgICAgICAgJyAnLFxuICAgICAgICAnXFx0JyxcbiAgICAgICAgJ1xccicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnXFx2JyxcbiAgICAgICAgJ1xcZicsXG4gICAgICAgICdcXHhBMCcsXG4gICAgICAgICdcXHVGRUZGJ1xuICAgIF07XG4gICAgcHJpdmF0ZSBlbmRBdDogbnVtYmVyO1xuICAgIHByaXZhdGUgYXQ6IG51bWJlcjsgICAgIC8vIFRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBjaGFyYWN0ZXJcbiAgICBwcml2YXRlIGNoOiBhbnk7ICAgICAvLyBUaGUgY3VycmVudCBjaGFyYWN0ZXJcbiAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcbiAgICBwcml2YXRlIHBhcnNlVHlwZTogbnVtYmVyOyAvLyAwIC0gc3RhZGFyZCwgMSAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBvYmplY3RzLCAyIC0gZ2V0IGluZm9ybWF0aW9uIGFib3V0IGFsbCBwcm9wZXJ0aWVzXG4gICAgY29uc3RydWN0b3IocGFyc2VUeXBlOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMucGFyc2VUeXBlID0gcGFyc2VUeXBlO1xuICAgIH1cbiAgICBwdWJsaWMgcGFyc2Uoc291cmNlOiBhbnksIHJldml2ZXI6IGFueSA9IG51bGwsIHN0YXJ0RnJvbTogbnVtYmVyID0gMCwgZW5kQXQ6IG51bWJlciA9IC0xKTogYW55IHtcbiAgICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgICB0aGlzLnRleHQgPSBTdHJpbmcoc291cmNlKTtcbiAgICAgICAgdGhpcy5hdCA9IHN0YXJ0RnJvbTtcbiAgICAgICAgdGhpcy5lbmRBdCA9IGVuZEF0O1xuICAgICAgICB0aGlzLmNoID0gJyAnO1xuICAgICAgICByZXN1bHQgPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgaWYgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJTeW50YXggZXJyb3JcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsXG4gICAgICAgIC8vIHBhc3NpbmcgZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gdGhlIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlXG4gICAgICAgIC8vIHRyYW5zZm9ybWF0aW9uLCBzdGFydGluZyB3aXRoIGEgdGVtcG9yYXJ5IHJvb3Qgb2JqZWN0IHRoYXQgaG9sZHMgdGhlIHJlc3VsdFxuICAgICAgICAvLyBpbiBhbiBlbXB0eSBrZXkuIElmIHRoZXJlIGlzIG5vdCBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHNpbXBseSByZXR1cm4gdGhlXG4gICAgICAgIC8vIHJlc3VsdC5cblxuICAgICAgICByZXR1cm4gdHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicgPyAoZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuICAgICAgICAgICAgdmFyIGssIHYsIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9ICh7ICcnOiByZXN1bHQgfSwgJycpKSA6IHJlc3VsdDtcbiAgICB9XG4gICAgcHJpdmF0ZSBlcnJvcihtOiBzdHJpbmcpIHtcbiAgICAgICAgLy8gQ2FsbCBlcnJvciB3aGVuIHNvbWV0aGluZyBpcyB3cm9uZy5cbiAgICAgICAgdmFyIGVycm9yID0gbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtO1xuICAgICAgICBlcnJvcltcImF0XCJdID0gdGhpcy5hdDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHByaXZhdGUgbmV4dChjOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIC8vIElmIGEgYyBwYXJhbWV0ZXIgaXMgcHJvdmlkZWQsIHZlcmlmeSB0aGF0IGl0IG1hdGNoZXMgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAgICBpZiAoYyAmJiBjICE9PSB0aGlzLmNoKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgJ1wiICsgYyArIFwiJyBpbnN0ZWFkIG9mICdcIiArIHRoaXMuY2ggKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSB0aGlzLm5leHQgY2hhcmFjdGVyLiBXaGVuIHRoZXJlIGFyZSBubyBtb3JlIGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIHJldHVybiB0aGUgZW1wdHkgc3RyaW5nLlxuICAgICAgICB0aGlzLmNoID0gdGhpcy5jaGFydEF0KCk7XG4gICAgICAgIHRoaXMuYXQgKz0gMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2g7XG4gICAgfVxuICAgIHByaXZhdGUgcGVlaygpIHtcbiAgICAgICAgLy8gR2V0IHRoZSB0aGlzLm5leHQgY2hhcmFjdGVyIHdpdGhvdXQgY29uc3VtaW5nIGl0IG9yXG4gICAgICAgIC8vIGFzc2lnbmluZyBpdCB0byB0aGUgdGhpcy5jaCB2YXJhaWJsZS5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnRBdCgpO1xuICAgIH1cbiAgICBwcml2YXRlIGNoYXJ0QXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmVuZEF0ID4gLTEgJiYgdGhpcy5hdCA+PSB0aGlzLmVuZEF0KSByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQuY2hhckF0KHRoaXMuYXQpO1xuICAgIH1cbiAgICBwcml2YXRlIGlkZW50aWZpZXIoKSB7XG4gICAgICAgIC8vIFBhcnNlIGFuIGlkZW50aWZpZXIuIE5vcm1hbGx5LCByZXNlcnZlZCB3b3JkcyBhcmUgZGlzYWxsb3dlZCBoZXJlLCBidXQgd2VcbiAgICAgICAgLy8gb25seSB1c2UgdGhpcyBmb3IgdW5xdW90ZWQgb2JqZWN0IGtleXMsIHdoZXJlIHJlc2VydmVkIHdvcmRzIGFyZSBhbGxvd2VkLFxuICAgICAgICAvLyBzbyB3ZSBkb24ndCBjaGVjayBmb3IgdGhvc2UgaGVyZS4gUmVmZXJlbmNlczpcbiAgICAgICAgLy8gLSBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g3LjZcbiAgICAgICAgLy8gLSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X0d1aWRlL0NvcmVfTGFuZ3VhZ2VfRmVhdHVyZXMjVmFyaWFibGVzXG4gICAgICAgIC8vIC0gaHR0cDovL2RvY3N0b3JlLm1pay51YS9vcmVsbHkvd2VicHJvZy9qc2NyaXB0L2NoMDJfMDcuaHRtXG4gICAgICAgIC8vIFRPRE8gSWRlbnRpZmllcnMgY2FuIGhhdmUgVW5pY29kZSBcImxldHRlcnNcIiBpbiB0aGVtOyBhZGQgc3VwcG9ydCBmb3IgdGhvc2UuXG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmNoO1xuXG4gICAgICAgIC8vIElkZW50aWZpZXJzIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgXyBvciAkLlxuICAgICAgICBpZiAoKHRoaXMuY2ggIT09ICdfJyAmJiB0aGlzLmNoICE9PSAnJCcpICYmXG4gICAgICAgICAgICAodGhpcy5jaCA8ICdhJyB8fCB0aGlzLmNoID4gJ3onKSAmJlxuICAgICAgICAgICAgKHRoaXMuY2ggPCAnQScgfHwgdGhpcy5jaCA+ICdaJykpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgaWRlbnRpZmllclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnNlcXVlbnQgY2hhcmFjdGVycyBjYW4gY29udGFpbiBkaWdpdHMuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSAmJiAoXG4gICAgICAgIHRoaXMuY2ggPT09ICdfJyB8fCB0aGlzLmNoID09PSAnJCcgfHxcbiAgICAgICAgKHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ3onKSB8fFxuICAgICAgICAodGhpcy5jaCA+PSAnQScgJiYgdGhpcy5jaCA8PSAnWicpIHx8XG4gICAgICAgICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JykpKSB7XG4gICAgICAgICAgICBrZXkgKz0gdGhpcy5jaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHByaXZhdGUgbnVtYmVyKCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGEgbnVtYmVyIHZhbHVlLlxuXG4gICAgICAgIHZhciBudW1iZXIsXG4gICAgICAgICAgICBzaWduID0gJycsXG4gICAgICAgICAgICBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgIGJhc2UgPSAxMDtcblxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xuICAgICAgICAgICAgc2lnbiA9IHRoaXMuY2g7XG4gICAgICAgICAgICB0aGlzLm5leHQodGhpcy5jaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBJbmZpbml0eSAoY291bGQgdHdlYWsgdG8gYWxsb3cgb3RoZXIgd29yZHMpOlxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ0knKSB7XG4gICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbnVtYmVyICE9PSAnbnVtYmVyJyB8fCBpc05hTihudW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB3b3JkIGZvciBudW1iZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoc2lnbiA9PT0gJy0nKSA/IC1udW1iZXIgOiBudW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBOYU5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdOJykge1xuICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdleHBlY3RlZCB3b3JkIHRvIGJlIE5hTicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWdub3JlIHNpZ24gYXMgLU5hTiBhbHNvIGlzIE5hTlxuICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnMCcpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3gnIHx8IHRoaXMuY2ggPT09ICdYJykge1xuICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJhc2UgPSAxNjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdPY3RhbCBsaXRlcmFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGJhc2UpIHtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gJy4nO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkgJiYgdGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnZScgfHwgdGhpcy5jaCA9PT0gJ0UnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICctJyB8fCB0aGlzLmNoID09PSAnKycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScgfHwgdGhpcy5jaCA+PSAnQScgJiYgdGhpcy5jaCA8PSAnRicgfHwgdGhpcy5jaCA+PSAnYScgJiYgdGhpcy5jaCA8PSAnZicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaWduID09PSAnLScpIHtcbiAgICAgICAgICAgIG51bWJlciA9IC1zdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBudW1iZXIgPSArc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG51bWJlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBzdHJpbmcoKSB7XG5cbiAgICAgICAgLy8gUGFyc2UgYSBzdHJpbmcgdmFsdWUuXG5cbiAgICAgICAgdmFyIGhleCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgIGRlbGltLCAgICAgIC8vIGRvdWJsZSBxdW90ZSBvciBzaW5nbGUgcXVvdGVcbiAgICAgICAgICAgIHVmZmZmO1xuXG4gICAgICAgIC8vIFdoZW4gcGFyc2luZyBmb3Igc3RyaW5nIHZhbHVlcywgd2UgbXVzdCBsb29rIGZvciAnIG9yIFwiIGFuZCBcXCBjaGFyYWN0ZXJzLlxuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnXCInIHx8IHRoaXMuY2ggPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICBkZWxpbSA9IHRoaXMuY2g7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gZGVsaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAndScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVmZmZmID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA0OyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZXggPSBwYXJzZUludCh0aGlzLm5leHQoKSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoaGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWZmZmYgPSB1ZmZmZiAqIDE2ICsgaGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodWZmZmYpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXHInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZWVrKCkgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gU3VydmV5SlNPTjUuZXNjYXBlZVt0aGlzLmNoXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAvLyB1bmVzY2FwZWQgbmV3bGluZXMgYXJlIGludmFsaWQ7IHNlZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FzZWVtay9qc29uNS9pc3N1ZXMvMjRcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB0aGlzIGZlZWxzIHNwZWNpYWwtY2FzZWQ7IGFyZSB0aGVyZSBvdGhlclxuICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIHVuZXNjYXBlZCBjaGFycz9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgc3RyaW5nXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGlubGluZUNvbW1lbnQoKSB7XG5cbiAgICAgICAgLy8gU2tpcCBhbiBpbmxpbmUgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGRcbiAgICAgICAgLy8gYmUgdGhlIHNlY29uZCAvIGNoYXJhY3RlciBpbiB0aGUgLy8gcGFpciB0aGF0IGJlZ2lucyB0aGlzIGlubGluZSBjb21tZW50LlxuICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGlubGluZSBjb21tZW50LCB3ZSBsb29rIGZvciBhIG5ld2xpbmUgb3IgdGhlIGVuZCBvZiB0aGUgdGV4dC5cblxuICAgICAgICBpZiAodGhpcy5jaCAhPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGFuIGlubGluZSBjb21tZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1xcbicgfHwgdGhpcy5jaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKHRoaXMuY2gpO1xuICAgIH1cbiAgICBwcml2YXRlIGJsb2NrQ29tbWVudCgpIHtcblxuICAgICAgICAvLyBTa2lwIGEgYmxvY2sgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGQgYmVcbiAgICAgICAgLy8gdGhlICogY2hhcmFjdGVyIGluIHRoZSAvKiBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgYmxvY2sgY29tbWVudC5cbiAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBibG9jayBjb21tZW50LCB3ZSBsb29rIGZvciBhbiBlbmRpbmcgKi8gcGFpciBvZiBjaGFyYWN0ZXJzLFxuICAgICAgICAvLyBidXQgd2UgYWxzbyB3YXRjaCBmb3IgdGhlIGVuZCBvZiB0ZXh0IGJlZm9yZSB0aGUgY29tbWVudCBpcyB0ZXJtaW5hdGVkLlxuXG4gICAgICAgIGlmICh0aGlzLmNoICE9PSAnKicpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYSBibG9jayBjb21tZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA9PT0gJyonKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcqJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAodGhpcy5jaCk7XG5cbiAgICAgICAgdGhpcy5lcnJvcihcIlVudGVybWluYXRlZCBibG9jayBjb21tZW50XCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbW1lbnQoKSB7XG5cbiAgICAgICAgLy8gU2tpcCBhIGNvbW1lbnQsIHdoZXRoZXIgaW5saW5lIG9yIGJsb2NrLWxldmVsLCBhc3N1bWluZyB0aGlzIGlzIG9uZS5cbiAgICAgICAgLy8gQ29tbWVudHMgYWx3YXlzIGJlZ2luIHdpdGggYSAvIGNoYXJhY3Rlci5cblxuICAgICAgICBpZiAodGhpcy5jaCAhPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGEgY29tbWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmV4dCgnLycpO1xuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcbiAgICAgICAgICAgIHRoaXMuaW5saW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICcqJykge1xuICAgICAgICAgICAgdGhpcy5ibG9ja0NvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJVbnJlY29nbml6ZWQgY29tbWVudFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHdoaXRlKCkge1xuXG4gICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhbmQgY29tbWVudHMuXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSdyZSBkZXRlY3RpbmcgY29tbWVudHMgYnkgb25seSBhIHNpbmdsZSAvIGNoYXJhY3Rlci5cbiAgICAgICAgLy8gVGhpcyB3b3JrcyBzaW5jZSByZWd1bGFyIGV4cHJlc3Npb25zIGFyZSBub3QgdmFsaWQgSlNPTig1KSwgYnV0IHRoaXMgd2lsbFxuICAgICAgICAvLyBicmVhayBpZiB0aGVyZSBhcmUgb3RoZXIgdmFsaWQgdmFsdWVzIHRoYXQgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyIVxuXG4gICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFN1cnZleUpTT041LndzLmluZGV4T2YodGhpcy5jaCkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSB3b3JkKCk6IGFueSB7XG5cbiAgICAgICAgLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwuXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XG4gICAgICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3QnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3InKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3UnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnYScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgncycpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZScpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSAnSSc6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdJJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdmJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd0Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd5Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdOJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdOJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCAnXCIgKyB0aGlzLmNoICsgXCInXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGFycmF5KCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGFuIGFycmF5IHZhbHVlLlxuXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnWycpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgnWycpO1xuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ10nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgYXJyYXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRVM1IGFsbG93cyBvbWl0dGluZyBlbGVtZW50cyBpbiBhcnJheXMsIGUuZy4gWyxdIGFuZFxuICAgICAgICAgICAgICAgIC8vIFssbnVsbF0uIFdlIGRvbid0IGFsbG93IHRoaXMgaW4gSlNPTjUuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTWlzc2luZyBhcnJheSBlbGVtZW50XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy52YWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyB2YWx1ZSwgdGhpcyBuZWVkcyB0b1xuICAgICAgICAgICAgICAgIC8vIGJlIHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCddJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgYXJyYXlcIik7XG4gICAgfVxuICAgIHByaXZhdGUgb2JqZWN0KCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGFuIG9iamVjdCB2YWx1ZS5cblxuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSB0cnVlLFxuICAgICAgICAgICAgb2JqZWN0ID0ge307XG4gICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcbiAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdID0geyBzdGFydDogdGhpcy5hdCAtIDEgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3snKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoJ3snKTtcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0uZW5kID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd9Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gS2V5cyBjYW4gYmUgdW5xdW90ZWQuIElmIHRoZXkgYXJlLCB0aGV5IG5lZWQgdG8gYmVcbiAgICAgICAgICAgICAgICAvLyB2YWxpZCBKUyBpZGVudGlmaWVycy5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLnN0cmluZygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0gPSB7IHN0YXJ0OiBzdGFydCwgdmFsdWVTdGFydDogdGhpcy5hdCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJzonKTtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMudmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyBwYWlyLCB0aGlzIG5lZWRzIHRvIGJlXG4gICAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSB0aGlzLmF0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kLS07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG9iamVjdFwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIC8vIFBhcnNlIGEgSlNPTiB2YWx1ZS4gSXQgY291bGQgYmUgYW4gb2JqZWN0LCBhbiBhcnJheSwgYSBzdHJpbmcsIGEgbnVtYmVyLFxuICAgICAgICAvLyBvciBhIHdvcmQuXG5cbiAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuY2gpIHtcbiAgICAgICAgICAgIGNhc2UgJ3snOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xuICAgICAgICAgICAgY2FzZSAnWyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcbiAgICAgICAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgICAgIGNhc2UgXCInXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nKCk7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JyA/IHRoaXMubnVtYmVyKCkgOiB0aGlzLndvcmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZXI6IGFueTtcbiAgICBwcml2YXRlIGluZGVudFN0cjogc3RyaW5nO1xuICAgIHByaXZhdGUgb2JqU3RhY2s7XG5cbiAgICBwdWJsaWMgc3RyaW5naWZ5KG9iajogYW55LCByZXBsYWNlcjogYW55ID0gbnVsbCwgc3BhY2U6IGFueSA9IG51bGwpIHtcbiAgICAgICAgaWYgKHJlcGxhY2VyICYmICh0eXBlb2YgKHJlcGxhY2VyKSAhPT0gXCJmdW5jdGlvblwiICYmICF0aGlzLmlzQXJyYXkocmVwbGFjZXIpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXBsYWNlciBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgICAgIHRoaXMuaW5kZW50U3RyID0gdGhpcy5nZXRJbmRlbnQoc3BhY2UpO1xuICAgICAgICB0aGlzLm9ialN0YWNrID0gW107XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZS4uLndoZW4gdW5kZWZpbmVkIGlzIHVzZWQgaW5zaWRlIG9mXG4gICAgICAgIC8vIGEgY29tcG91bmQgb2JqZWN0L2FycmF5LCByZXR1cm4gbnVsbC5cbiAgICAgICAgLy8gYnV0IHdoZW4gdG9wLWxldmVsLCByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIHZhciB0b3BMZXZlbEhvbGRlciA9IHsgXCJcIjogb2JqIH07XG4gICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKHRvcExldmVsSG9sZGVyLCAnJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbmRlbnQoc3BhY2U6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChzcGFjZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzcGFjZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSBcIm51bWJlclwiICYmIHNwYWNlID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYWtlSW5kZW50KFwiIFwiLCBzcGFjZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xuICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSB3aXRoIGl0cyB0b0pTT04gdmFsdWUgZmlyc3QsIGlmIHBvc3NpYmxlXG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS50b0pTT04gJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHVzZXItc3VwcGxpZWQgcmVwbGFjZXIgaWYgYSBmdW5jdGlvbiwgY2FsbCBpdC4gSWYgaXQncyBhbiBhcnJheSwgY2hlY2sgb2JqZWN0cycgc3RyaW5nIGtleXMgZm9yXG4gICAgICAgIC8vIHByZXNlbmNlIGluIHRoZSBhcnJheSAocmVtb3ZpbmcgdGhlIGtleS92YWx1ZSBwYWlyIGZyb20gdGhlIHJlc3VsdGluZyBKU09OIGlmIHRoZSBrZXkgaXMgbWlzc2luZykuXG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMucmVwbGFjZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlcGxhY2VyKSB7XG4gICAgICAgICAgICBpZiAoaXNUb3BMZXZlbCB8fCB0aGlzLmlzQXJyYXkoaG9sZGVyKSB8fCB0aGlzLnJlcGxhY2VyLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1dvcmRDaGFyKGNoYXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGNoYXIgPj0gJ2EnICYmIGNoYXIgPD0gJ3onKSB8fFxuICAgICAgICAgICAgKGNoYXIgPj0gJ0EnICYmIGNoYXIgPD0gJ1onKSB8fFxuICAgICAgICAgICAgKGNoYXIgPj0gJzAnICYmIGNoYXIgPD0gJzknKSB8fFxuICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzV29yZFN0YXJ0KGNoYXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGNoYXIgPj0gJ2EnICYmIGNoYXIgPD0gJ3onKSB8fFxuICAgICAgICAgICAgKGNoYXIgPj0gJ0EnICYmIGNoYXIgPD0gJ1onKSB8fFxuICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzV29yZChrZXk6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNXb3JkU3RhcnQoa2V5WzBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gMSwgbGVuZ3RoID0ga2V5Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1dvcmRDaGFyKGtleVtpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIHBvbHlmaWxsc1xuICAgIHByaXZhdGUgaXNBcnJheShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNEYXRlKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNOYU4odmFsOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmIHZhbCAhPT0gdmFsO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tGb3JDaXJjdWxhcihvYmo6IGFueSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub2JqU3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9ialN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG1ha2VJbmRlbnQoc3RyOiBzdHJpbmcsIG51bTogbnVtYmVyLCBub05ld0xpbmU6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW5kZW50YXRpb24gbm8gbW9yZSB0aGFuIDEwIGNoYXJzXG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGVudCA9IG5vTmV3TGluZSA/IFwiXCIgOiBcIlxcblwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgICAgICBpbmRlbnQgKz0gc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGVudDtcbiAgICB9XG5cbiAgICAvLyBDb3BpZWQgZnJvbSBDcm9rZm9yZCdzIGltcGxlbWVudGF0aW9uIG9mIEpTT05cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2RvdWdsYXNjcm9ja2ZvcmQvSlNPTi1qcy9ibG9iL2UzOWRiNGI3ZTYyNDlmMDRhMTk1ZTdkZDA4NDBlNjEwY2M5ZTk0MWUvanNvbjIuanMjTDE5NVxuICAgIC8vIEJlZ2luXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcbiAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuICAgIHByaXZhdGUgc3RhdGljIG1ldGEgPSB7IC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgICAnXFx0JzogJ1xcXFx0JyxcbiAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgICAnXFxyJzogJ1xcXFxyJyxcbiAgICAgICAgJ1wiJzogJ1xcXFxcIicsXG4gICAgICAgICdcXFxcJzogJ1xcXFxcXFxcJ1xuICAgIH07XG4gICAgcHJpdmF0ZSBlc2NhcGVTdHJpbmcoc3RyOiBzdHJpbmcpIHtcblxuICAgICAgICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gICAgICAgIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gICAgICAgIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAgICAgICAvLyBzZXF1ZW5jZXMuXG4gICAgICAgIFN1cnZleUpTT041LmVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gU3VydmV5SlNPTjUuZXNjYXBhYmxlLnRlc3Qoc3RyKSA/ICdcIicgKyBzdHIucmVwbGFjZShTdXJ2ZXlKU09ONS5lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYyA9IFN1cnZleUpTT041Lm1ldGFbYV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgICBjIDpcbiAgICAgICAgICAgICdcXFxcdScgKyAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICB9KSArICdcIicgOiAnXCInICsgc3RyICsgJ1wiJztcbiAgICB9XG4gICAgLy8gRW5kXG5cbiAgICBwcml2YXRlIGludGVybmFsU3RyaW5naWZ5KGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xuICAgICAgICB2YXIgYnVmZmVyLCByZXM7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUsIGlmIG5lY2Vzc2FyeVxuICAgICAgICB2YXIgb2JqX3BhcnQgPSB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXIsIGtleSwgaXNUb3BMZXZlbCk7XG5cbiAgICAgICAgaWYgKG9ial9wYXJ0ICYmICF0aGlzLmlzRGF0ZShvYmpfcGFydCkpIHtcbiAgICAgICAgICAgIC8vIHVuYm94IG9iamVjdHNcbiAgICAgICAgICAgIC8vIGRvbid0IHVuYm94IGRhdGVzLCBzaW5jZSB3aWxsIHR1cm4gaXQgaW50byBudW1iZXJcbiAgICAgICAgICAgIG9ial9wYXJ0ID0gb2JqX3BhcnQudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodHlwZW9mIG9ial9wYXJ0KSB7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKG9ial9wYXJ0KSB8fCAhaXNGaW5pdGUob2JqX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lc2NhcGVTdHJpbmcob2JqX3BhcnQudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FycmF5KG9ial9wYXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQ2lyY3VsYXIob2JqX3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIltcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ial9wYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzID09PSBudWxsIHx8IHR5cGVvZiByZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IG9ial9wYXJ0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCIsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5kZW50U3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgsIHRydWUpICsgXCJdXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckNpcmN1bGFyKG9ial9wYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gXCJ7XCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub25FbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnB1c2gob2JqX3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9ial9wYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBwcm9wLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUb3BMZXZlbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub25FbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wS2V5ID0gdGhpcy5pc1dvcmQocHJvcCkgPyBwcm9wIDogdGhpcy5lc2NhcGVTdHJpbmcocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBwcm9wS2V5ICsgXCI6XCIgKyAodGhpcy5pbmRlbnRTdHIgPyAnICcgOiAnJykgKyB2YWx1ZSArIFwiLFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9uRW1wdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCwgYnVmZmVyLmxlbmd0aCAtIDEpICsgdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCkgKyBcIn1cIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9ICd7fSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb25zIGFuZCB1bmRlZmluZWQgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qc29uNS50cyIsImltcG9ydCB7U3VydmV5SlNPTjV9IGZyb20gXCIuL2pzb241XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlFbWJlZGluZ1dpbmRvdyB7XG4gICAgcHJpdmF0ZSBqc29uVmFsdWU6IGFueTtcbiAgICBwcml2YXRlIHN1cnZleUVtYmVkaW5nSGVhZDogQWNlQWpheC5FZGl0b3I7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0phdmE6IEFjZUFqYXguRWRpdG9yO1xuICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBnZW5lcmF0ZVZhbGlkSlNPTjogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGtvU2hvd0FzV2luZG93OiBhbnk7XG4gICAga29TY3JpcHRVc2luZzogYW55O1xuICAgIGtvSGFzSWRzOiBhbnk7XG4gICAga29Mb2FkU3VydmV5OiBhbnk7XG4gICAga29MaWJyYXJ5VmVyc2lvbjogYW55O1xuICAgIGtvVmlzaWJsZUh0bWw6IGFueTtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmtvTGlicmFyeVZlcnNpb24gPSBrby5vYnNlcnZhYmxlKFwia25vY2tvdXRcIik7XG4gICAgICAgIHRoaXMua29TaG93QXNXaW5kb3cgPSBrby5vYnNlcnZhYmxlKFwicGFnZVwiKTtcbiAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nID0ga28ub2JzZXJ2YWJsZShcImJvb3RzdHJhcFwiKTtcbiAgICAgICAgdGhpcy5rb0hhc0lkcyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLmtvTG9hZFN1cnZleSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLmtvVmlzaWJsZUh0bWwgPSBrby5jb21wdXRlZChmdW5jdGlvbigpIHsgcmV0dXJuIHNlbGYua29MaWJyYXJ5VmVyc2lvbigpID09IFwicmVhY3RcIiB8fCBzZWxmLmtvU2hvd0FzV2luZG93KCkgPT1cInBhZ2VcIjsgfSk7XG4gICAgICAgIHRoaXMua29MaWJyYXJ5VmVyc2lvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2V0SGVhZFRleHQoKTsgc2VsZi5zdXJ2ZXlFbWJlZGluZ0phdmEuc2V0VmFsdWUoc2VsZi5nZXRKYXZhVGV4dCgpKTsgfSk7XG4gICAgICAgIHRoaXMua29TaG93QXNXaW5kb3cuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZShzZWxmLmdldEphdmFUZXh0KCkpOyB9KTtcbiAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRIZWFkVGV4dCgpOyBzZWxmLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZShzZWxmLmdldEphdmFUZXh0KCkpOyB9KTtcbiAgICAgICAgdGhpcy5rb0xvYWRTdXJ2ZXkuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZShzZWxmLmdldEphdmFUZXh0KCkpOyB9KTtcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPSBudWxsO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IGpzb24oKTogYW55IHsgcmV0dXJuIHRoaXMuanNvblZhbHVlOyB9XG4gICAgcHVibGljIHNldCBqc29uKHZhbHVlOiBhbnkpIHsgdGhpcy5qc29uVmFsdWUgPSB2YWx1ZTsgfVxuICAgIHB1YmxpYyBzaG93KCkge1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSGVhZFwiKTtcbiAgICAgICAgICAgIHRoaXMuc2V0SGVhZFRleHQoKTtcbiAgICAgICAgICAgIHZhciBib2R5RWRpdG9yID0gdGhpcy5jcmVhdGVFZGl0b3IoXCJzdXJ2ZXlFbWJlZGluZ0JvZHlcIik7XG4gICAgICAgICAgICBib2R5RWRpdG9yLnNldFZhbHVlKFwiPGRpdiBpZD0gXFxcIm15U3VydmV5SlNOYW1lXFxcIiA+PC9kaXY+XCIpO1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSmF2YVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvSGFzSWRzKHRoaXMuc3VydmV5SWQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpO1xuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZSh0aGlzLmdldEphdmFUZXh0KCkpO1xuICAgIH1cbiAgICBwcml2YXRlIHNldEhlYWRUZXh0KCkge1xuICAgICAgICB2YXIgc3RyID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMua29MaWJyYXJ5VmVyc2lvbigpID09IFwia25vY2tvdXRcIikge1xuICAgICAgICAgICAgc3RyID0gXCI8c2NyaXB0IHNyYz1cXFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXFxcIj48L3NjcmlwdD5cXG48c2NyaXB0IHNyYz1cXFwianMvc3VydmV5LmtvLm1pbi5qc1xcXCI+PC9zY3JpcHQ+XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBcIjxzY3JpcHQgc3JjPVxcXCJodHRwczovL2ZiLm1lL3JlYWN0LTAuMTQuOC5qc1xcXCI+PC9zY3JpcHQ+XFxuPHNjcmlwdCBzcmM9IFxcXCJodHRwczovL2ZiLm1lL3JlYWN0LWRvbS0wLjE0LjguanNcXFwiPjwvc2NyaXB0PlxcbjxzY3JpcHQgc3JjPVxcXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9iYWJlbC1jb3JlLzUuOC4yMy9icm93c2VyLm1pbi5qc1xcXCI+PC9zY3JpcHQ+XFxuXCI7XG4gICAgICAgICAgICBzdHIgKz0gXCI8c2NyaXB0IHNyYz1cXFwianMvc3VydmV5LnJlYWN0LmJvb3RzdHJhcC5taW4uanNcXFwiPjwvc2NyaXB0PlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmtvU2NyaXB0VXNpbmcoKSAhPSBcImJvb3RzdHJhcFwiKSB7XG4gICAgICAgICAgICBzdHIgKz0gXCJcXG48bGluayBocmVmPVxcXCJjc3Mvc3VydmV5LmNzc1xcXCIgdHlwZT1cXFwidGV4dC9jc3NcXFwiIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgLz5cIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSGVhZC5zZXRWYWx1ZShzdHIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUVkaXRvcihlbGVtZW50TmFtZTogc3RyaW5nKTogQWNlQWpheC5FZGl0b3Ige1xuICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudE5hbWUpO1xuICAgICAgICBlZGl0b3Iuc2V0VGhlbWUoXCJhY2UvdGhlbWUvbW9ub2thaVwiKTtcbiAgICAgICAgZWRpdG9yLnNlc3Npb24uc2V0TW9kZShcImFjZS9tb2RlL2pzb25cIik7XG4gICAgICAgIGVkaXRvci5zZXRTaG93UHJpbnRNYXJnaW4oZmFsc2UpO1xuICAgICAgICBlZGl0b3IucmVuZGVyZXIuc2V0U2hvd0d1dHRlcihmYWxzZSk7XG4gICAgICAgIGVkaXRvci5zZXRSZWFkT25seSh0cnVlKTtcbiAgICAgICAgcmV0dXJuIGVkaXRvcjtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRKYXZhVGV4dCgpOiBzdHJpbmcge1xuICAgICAgICB2YXIgaXNPblBhZ2UgPSB0aGlzLmtvU2hvd0FzV2luZG93KCkgPT0gXCJwYWdlXCI7XG4gICAgICAgIHZhciBzdHIgPSB0aGlzLmtvTGlicmFyeVZlcnNpb24oKSA9PSBcImtub2Nrb3V0XCIgPyB0aGlzLmdldEtub2Nrb3V0SmF2YVRleHQoaXNPblBhZ2UpIDogdGhpcy5nZXRSZWFjdEphdmFUZXh0KGlzT25QYWdlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2V0Q3NzKCkgKyBzdHI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2V0Q3NzKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmtvU2NyaXB0VXNpbmcoKSAhPSBcImJvb3RzdHJhcFwiKSByZXR1cm4gXCJcIjtcbiAgICAgICAgcmV0dXJuIFwiU3VydmV5LlN1cnZleS5jc3NUeXBlID0gXFxcImJvb3RzdHJhcFxcXCI7XFxuXCI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0S25vY2tvdXRKYXZhVGV4dChpc09uUGFnZTogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgICAgIHZhciB0ZXh0ID0gaXNPblBhZ2UgPyBcInZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5LlN1cnZleShcXG5cIiA6IFwidmFyIHN1cnZleVdpbmRvdyA9IG5ldyBTdXJ2ZXkuU3VydmV5V2luZG93KFxcblwiO1xuICAgICAgICB0ZXh0ICs9IHRoaXMuZ2V0SnNvblRleHQoKTtcbiAgICAgICAgdGV4dCArPSBcIik7XFxuXCI7XG4gICAgICAgIGlmICghaXNPblBhZ2UpIHtcbiAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXlXaW5kb3cuXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNhdmVGdW5jID0gdGhpcy5nZXRTYXZlRnVuY0NvZGUoKTtcbiAgICAgICAgdGV4dCArPSBcInN1cnZleS5vbkNvbXBsZXRlLmFkZChmdW5jdGlvbiAocykge1xcblwiICsgc2F2ZUZ1bmMgKyBcIlxcbiB9KTtcXG5cIjtcbiAgICAgICAgaWYgKGlzT25QYWdlKSB7XG4gICAgICAgICAgICB0ZXh0ICs9IFwic3VydmV5LnJlbmRlcihcXFwibXlTdXJ2ZXlKU05hbWVcXFwiKTtcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRleHQgKz0gXCIvL0J5IGRlZmF1bHQgU3VydmV5LnRpdGxlIGlzIHVzZWQuXFxuXCJcbiAgICAgICAgICAgIHRleHQgKz0gXCIvL3N1cnZleVdpbmRvdy50aXRsZSA9IFxcXCJNeSBTdXJ2ZXkgV2luZG93IFRpdGxlLlxcXCI7XFxuXCI7XG4gICAgICAgICAgICB0ZXh0ICs9IFwic3VydmV5V2luZG93LnNob3coKTtcIjtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBwcml2YXRlIGdldFJlYWN0SmF2YVRleHQoaXNPblBhZ2U6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgICAgICB2YXIgc2F2ZUZ1bmMgPSB0aGlzLmdldFNhdmVGdW5jQ29kZSgpO1xuICAgICAgICB2YXIgc2VuZFJlc3VsdFRleHQgPSBcInZhciBzdXJ2ZXlTZW5kUmVzdWx0ID0gZnVuY3Rpb24gKHMpIHtcXG5cIiArIHNhdmVGdW5jICsgXCJcXG4gfSk7XFxuXCI7XG4gICAgICAgIHZhciBuYW1lID0gaXNPblBhZ2UgPyBcIlJlYWN0U3VydmV5XCIgOiBcIlJlYWN0U3VydmV5V2luZG93XCI7XG4gICAgICAgIHZhciBqc29uVGV4dCA9IFwidmFyIHN1cnZleUpzb24gPSBcIiArIHRoaXMuZ2V0SnNvblRleHQoKSArIFwiXFxuXFxuXCI7XG4gICAgICAgIHZhciB0ZXh0ID0ganNvblRleHQgKyBzZW5kUmVzdWx0VGV4dCArIFwiUmVhY3RET00ucmVuZGVyKFxcbjxcIiArIG5hbWUgKyBcIiBqc29uPXtzdXJ2ZXlKc29ufSBvbkNvbXBsZXRlPXtzdXJ2ZXlTZW5kUmVzdWx0fSAvPiwgXFxuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJteVN1cnZleUpTTmFtZVxcXCIpKTtcIjtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2F2ZUZ1bmNDb2RlKCkge1xuICAgICAgICBpZiAodGhpcy5rb0hhc0lkcygpKSByZXR1cm4gXCJzdXJ2ZXkuc2VuZFJlc3VsdCgnXCIgKyB0aGlzLnN1cnZleVBvc3RJZCArIFwiJyk7XCI7XG4gICAgICAgIHJldHVybiBcImFsZXJ0KFxcXCJUaGUgcmVzdWx0cyBhcmU6XFxcIiArIEpTT04uc3RyaW5naWZ5KHMuZGF0YSkpO1wiO1xuICAgIH1cbiAgICBwcml2YXRlIGdldEpzb25UZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmtvSGFzSWRzKCkgJiYgdGhpcy5rb0xvYWRTdXJ2ZXkoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFwieyBzdXJ2ZXlJZDogJ1wiICsgdGhpcy5zdXJ2ZXlJZCArIFwiJ31cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZVZhbGlkSlNPTikgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuanNvbik7XG4gICAgICAgIHJldHVybiBuZXcgU3VydmV5SlNPTjUoKS5zdHJpbmdpZnkodGhpcy5qc29uKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N1cnZleUVtYmVkaW5nV2luZG93LnRzIiwiaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0IHtTdXJ2ZXlIZWxwZXIsIE9ialR5cGV9IGZyb20gXCIuL3N1cnZleUhlbHBlclwiO1xuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcblxuZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJzIHtcbiAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuICAgIHByaXZhdGUgb2JqVmFsdWU6IGFueTtcbiAgICBwcml2YXRlIGNob2ljZXNDbGFzc2VzOiBBcnJheTxzdHJpbmc+O1xuICAgIGtvVmVyYnM6IGFueTtcbiAgICBrb0hhc1ZlcmJzOiBhbnk7XG4gICAgY29uc3RydWN0b3IocHVibGljIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XG4gICAgICAgIHRoaXMua29WZXJicyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xuICAgICAgICB0aGlzLmtvSGFzVmVyYnMgPSBrby5vYnNlcnZhYmxlKCk7XG4gICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5jaG9pY2VzQ2xhc3NlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc0NsYXNzZXMucHVzaChjbGFzc2VzW2ldLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxuICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgb2JqKCk6IGFueSB7IHJldHVybiB0aGlzLm9ialZhbHVlIH1cbiAgICBwdWJsaWMgc2V0IG9iaih2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmICh0aGlzLm9ialZhbHVlID09IHZhbHVlKSByZXR1cm47XG4gICAgICAgIHRoaXMub2JqVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5idWlsZFZlcmJzKCk7XG4gICAgfVxuICAgIHByaXZhdGUgYnVpbGRWZXJicygpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUodGhpcy5vYmopO1xuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uQmFzZT50aGlzLm9iajtcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbiwgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXNDbGFzc2VzLmluZGV4T2YocXVlc3Rpb24uZ2V0VHlwZSgpKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbiwgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvVmVyYnMoYXJyYXkpO1xuICAgICAgICB0aGlzLmtvSGFzVmVyYnMoYXJyYXkubGVuZ3RoID4gMCk7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJJdGVtIHtcbiAgICBrb0l0ZW1zOiBhbnk7XG4gICAga29TZWxlY3RlZEl0ZW06IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueSkge1xuICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSA9IGtvLm9ic2VydmFibGUoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XG59XG5leHBvcnQgY2xhc3MgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtIGV4dGVuZHMgU3VydmV5VmVyYkl0ZW0ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XG4gICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24sIG9uTW9kaWZpZWRDYWxsYmFjayk7XG4gICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBjbGFzc2VzW2ldLm5hbWUsIHRleHQ6IGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJxdC5cIiArIGNsYXNzZXNbaV0ubmFtZSkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbShxdWVzdGlvbi5nZXRUeXBlKCkpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVR5cGUobmV3VmFsdWUpOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudmVyYkNoYW5nZVR5cGVcIik7IH1cbiAgICBwcml2YXRlIGNoYW5nZVR5cGUocXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSA9PSB0aGlzLnF1ZXN0aW9uLmdldFR5cGUoKSkgcmV0dXJuO1xuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRoaXMucXVlc3Rpb24pO1xuICAgICAgICB2YXIgbmV3UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgdGhpcy5xdWVzdGlvbi5uYW1lKTtcbiAgICAgICAgdmFyIGpzb25PYmogPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKTtcbiAgICAgICAgdmFyIGpzb24gPSBqc29uT2JqLnRvSnNvbk9iamVjdCh0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAganNvbk9iai50b09iamVjdChqc29uLCBuZXdRdWVzdGlvbik7XG4gICAgICAgIHBhZ2UucmVtb3ZlUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XG4gICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24obmV3UXVlc3Rpb24sIGluZGV4KTtcbiAgICAgICAgaWYgKHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaygpO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiQ2hhbmdlUGFnZUl0ZW0gZXh0ZW5kcyBTdXJ2ZXlWZXJiSXRlbSB7XG4gICAgcHJpdmF0ZSBwcmV2UGFnZTogU3VydmV5LlBhZ2U7XG4gICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBwdWJsaWMgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnkpIHtcbiAgICAgICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbiwgb25Nb2RpZmllZENhbGxiYWNrKTtcbiAgICAgICAgdmFyIGFycmF5ID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkucGFnZXNbaV07XG4gICAgICAgICAgICBhcnJheS5wdXNoKHsgdmFsdWU6IHBhZ2UsIHRleHQ6IFN1cnZleUhlbHBlci5nZXRPYmplY3ROYW1lKHBhZ2UpIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XG4gICAgICAgIHRoaXMucHJldlBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24ocXVlc3Rpb24pO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtKHRoaXMucHJldlBhZ2UpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVBhZ2UobmV3VmFsdWUpOyB9KTtcbiAgICB9XG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudmVyYkNoYW5nZVBhZ2VcIik7IH1cbiAgICBwcml2YXRlIGNoYW5nZVBhZ2UobmV3UGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgaWYgKG5ld1BhZ2UgPT0gbnVsbCB8fCBuZXdQYWdlID09IHRoaXMucHJldlBhZ2UpIHJldHVybjtcbiAgICAgICAgdGhpcy5wcmV2UGFnZS5yZW1vdmVRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgbmV3UGFnZS5hZGRRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaygpO1xuICAgIH1cbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb2JqZWN0VmVyYnMudHMiLCJpbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5VW5kb1JlZG8ge1xuICAgIHByaXZhdGUgaXRlbXM6IEFycmF5PFVuZG9SZWRvSXRlbT47XG4gICAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgcHVibGljIGtvQ2FuVW5kbzogYW55OyBrb0NhblJlZG86IGFueTtcbiAgICBwdWJsaWMgbWF4aW11bUNvdW50OiBudW1iZXIgPSAxMDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICB0aGlzLmtvQ2FuVW5kbyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgICAgICB0aGlzLmtvQ2FuUmVkbyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIH1cbiAgICBwdWJsaWMgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICAgICAgdGhpcy5rb0NhblVuZG8oZmFsc2UpO1xuICAgICAgICB0aGlzLmtvQ2FuUmVkbyhmYWxzZSk7XG4gICAgfVxuICAgIHB1YmxpYyBzZXRDdXJyZW50KHN1cnZleTogU3VydmV5LlN1cnZleSwgc2VsZWN0ZWRPYmpOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgVW5kb1JlZG9JdGVtKCk7XG4gICAgICAgIGl0ZW0uc3VydmV5SlNPTiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChzdXJ2ZXkpO1xuICAgICAgICBpdGVtLnNlbGVjdGVkT2JqTmFtZSA9IHNlbGVjdGVkT2JqTmFtZTtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIHRoaXMucmVtb3ZlT2xkRGF0YSgpO1xuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xuICAgICAgICB0aGlzLnVwZGF0ZUNhblVuZG9SZWRvKCk7XG4gICAgfVxuICAgIHB1YmxpYyB1bmRvKCk6IFVuZG9SZWRvSXRlbSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5VbmRvKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9VbmRvUmVkbygtMSk7XG4gICAgfVxuICAgIHB1YmxpYyByZWRvKCk6IFVuZG9SZWRvSXRlbSAge1xuICAgICAgICBpZiAoIXRoaXMuY2FuUmVkbykgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLmRvVW5kb1JlZG8oMSk7XG4gICAgfVxuICAgIHByaXZhdGUgdXBkYXRlQ2FuVW5kb1JlZG8oKSB7XG4gICAgICAgIHRoaXMua29DYW5VbmRvKHRoaXMuY2FuVW5kbyk7XG4gICAgICAgIHRoaXMua29DYW5SZWRvKHRoaXMuY2FuUmVkbyk7XG4gICAgfVxuICAgIHByaXZhdGUgZG9VbmRvUmVkbyhkSW5kZXg6IG51bWJlcik6IFVuZG9SZWRvSXRlbSB7XG4gICAgICAgIHRoaXMuaW5kZXggKz0gZEluZGV4O1xuICAgICAgICB0aGlzLnVwZGF0ZUNhblVuZG9SZWRvKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ID49IDAgJiYgdGhpcy5pbmRleCA8IHRoaXMuaXRlbXMubGVuZ3RoID8gdGhpcy5pdGVtc1t0aGlzLmluZGV4XSA6IG51bGw7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXQgY2FuVW5kbygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gMSAmJiB0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgfVxuICAgIHByb3RlY3RlZCBnZXQgY2FuUmVkbygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbXMubGVuZ3RoID4gMSAmJiB0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGggLSAxO1xuICAgIH1cbiAgICBwcml2YXRlIHJlbW92ZU9sZERhdGEoKSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCAtIDEgPCB0aGlzLm1heGltdW1Db3VudCkgcmV0dXJuO1xuICAgICAgICB0aGlzLml0ZW1zLnNwbGljZSgwLCB0aGlzLml0ZW1zLmxlbmd0aCAtIHRoaXMubWF4aW11bUNvdW50IC0gMSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVW5kb1JlZG9JdGVtIHtcbiAgICBzdXJ2ZXlKU09OOiBhbnk7XG4gICAgc2VsZWN0ZWRPYmpOYW1lOiBzdHJpbmc7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3VuZG9yZWRvLnRzIiwiaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xuaW1wb3J0IHtTdXJ2ZXlPYmplY3RFZGl0b3J9IGZyb20gXCIuL29iamVjdEVkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQYWdlc0VkaXRvcn0gZnJvbSBcIi4vcGFnZXNFZGl0b3JcIjtcbmltcG9ydCB7U3VydmV5RW1iZWRpbmdXaW5kb3d9IGZyb20gXCIuL3N1cnZleUVtYmVkaW5nV2luZG93XCI7XG5pbXBvcnQge1N1cnZleU9iamVjdHN9IGZyb20gXCIuL3N1cnZleU9iamVjdHNcIjtcbmltcG9ydCB7U3VydmV5VmVyYnN9IGZyb20gXCIuL29iamVjdFZlcmJzXCI7XG5pbXBvcnQge1N1cnZleVRleHRXb3JrZXJ9IGZyb20gXCIuL3RleHRXb3JrZXJcIjtcbmltcG9ydCB7U3VydmV5VW5kb1JlZG8sIFVuZG9SZWRvSXRlbX0gZnJvbSBcIi4vdW5kb3JlZG9cIjtcbmltcG9ydCB7U3VydmV5SGVscGVyLCBPYmpUeXBlfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcbmltcG9ydCB7RHJhZ0Ryb3BIZWxwZXJ9IGZyb20gXCIuL2RyYWdkcm9waGVscGVyXCI7XG5pbXBvcnQge1N1cnZleUpTT041fSBmcm9tIFwiLi9qc29uNVwiO1xuaW1wb3J0IHtodG1sIGFzIHRlbXBsYXRlRWRpdG9ySHRtbH0gZnJvbSBcIi4vdGVtcGxhdGVFZGl0b3Iua28uaHRtbFwiO1xuaW1wb3J0IHtodG1sIGFzIHRlbXBsYXRlUGFnZUh0bWx9IGZyb20gXCIuL3RlbXBsYXRlX3BhZ2UuaHRtbFwiO1xuaW1wb3J0IHtodG1sIGFzIHRlbXBsYXRlUXVlc3Rpb25IdG1sfSBmcm9tIFwiLi90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5RWRpdG9yIHtcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVRleHRUaW1lb3V0OiBudW1iZXIgPSAxMDAwO1xuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdE5ld1N1cnZleVRleHQ6IHN0cmluZyA9IFwieyBwYWdlczogWyB7IG5hbWU6ICdwYWdlMSd9XSB9XCI7XG4gICAgcHJpdmF0ZSByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgc3VydmV5anM6IEhUTUxFbGVtZW50O1xuICAgIHByaXZhdGUgc3VydmV5anNFeGFtcGxlOiBIVE1MRWxlbWVudDtcblxuICAgIHByaXZhdGUganNvbkVkaXRvcjogQWNlQWpheC5FZGl0b3I7XG4gICAgcHJpdmF0ZSBpc1Byb2Nlc3NpbmdJbW1lZGlhdGVseTogYm9vbGVhbjtcbiAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XG4gICAgcHJpdmF0ZSBwYWdlc0VkaXRvcjogU3VydmV5UGFnZXNFZGl0b3I7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZzogU3VydmV5RW1iZWRpbmdXaW5kb3c7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlPYmplY3RzOiBTdXJ2ZXlPYmplY3RzO1xuICAgIHByaXZhdGUgc3VydmV5VmVyYnM6IFN1cnZleVZlcmJzO1xuICAgIHByaXZhdGUgdGV4dFdvcmtlcjogU3VydmV5VGV4dFdvcmtlcjtcbiAgICBwcml2YXRlIHVuZG9SZWRvOiBTdXJ2ZXlVbmRvUmVkbztcbiAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuICAgIHByaXZhdGUgc2F2ZVN1cnZleUZ1bmNWYWx1ZTogKG5vOiBudW1iZXIsIG9uU2F2ZUNhbGxiYWNrOiAobm86IG51bWJlciwgaXNTdWNjZXNzOiBib29sZWFuKSA9PiB2b2lkKSA9PiB2b2lkO1xuICAgIHByaXZhdGUgb3B0aW9uczogYW55O1xuICAgIHByaXZhdGUgc3RhdGVWYWx1ZTogc3RyaW5nID0gXCJcIjtcblxuICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcbiAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xuICAgIHB1YmxpYyBxdWVzdGlvblR5cGVzOiBzdHJpbmdbXTtcbiAgICBwdWJsaWMga29Db3BpZWRRdWVzdGlvbnM6IGFueTtcbiAgICBwdWJsaWMgZ2VuZXJhdGVWYWxpZEpTT05DaGFuZ2VkQ2FsbGJhY2s6IChnZW5lcmF0ZVZhbGlkSlNPTjogYm9vbGVhbikgPT4gdm9pZDtcbiAgICBwdWJsaWMgYWx3YXlTYXZlVGV4dEluUHJvcGVydHlFZGl0b3JzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBrb0lzU2hvd0Rlc2lnbmVyOiBhbnk7XG4gICAga29WaWV3VHlwZTogYW55O1xuICAgIGtvQ2FuRGVsZXRlT2JqZWN0OiBhbnk7XG4gICAga29PYmplY3RzOiBhbnk7IGtvU2VsZWN0ZWRPYmplY3Q6IGFueTtcbiAgICBrb1Nob3dTYXZlQnV0dG9uOiBhbnk7XG4gICAga29HZW5lcmF0ZVZhbGlkSlNPTjogYW55OyBrb1Nob3dPcHRpb25zOiBhbnk7IGtvVGVzdFN1cnZleVdpZHRoOiBhbnk7XG4gICAgc2VsZWN0RGVzaWduZXJDbGljazogYW55OyBzZWxlY3RFZGl0b3JDbGljazogYW55OyBzZWxlY3RUZXN0Q2xpY2s6IGFueTsgc2VsZWN0RW1iZWRDbGljazogYW55O1xuICAgIGdlbmVyYXRlVmFsaWRKU09OQ2xpY2s6IGFueTsgZ2VuZXJhdGVSZWFkYWJsZUpTT05DbGljazogYW55O1xuICAgIGRvVW5kb0NsaWNrOiBhbnk7IGRvUmVkb0NsaWNrOiBhbnk7XG4gICAgZGVsZXRlT2JqZWN0Q2xpY2s6IGFueTtcbiAgICBrb1N0YXRlOiBhbnk7XG4gICAgcnVuU3VydmV5Q2xpY2s6IGFueTsgZW1iZWRpbmdTdXJ2ZXlDbGljazogYW55O1xuICAgIHNhdmVCdXR0b25DbGljazogYW55O1xuICAgIGRyYWdnaW5nUXVlc3Rpb246IGFueTsgY2xpY2tRdWVzdGlvbjogYW55O1xuICAgIGRyYWdnaW5nQ29waWVkUXVlc3Rpb246IGFueTsgY2xpY2tDb3BpZWRRdWVzdGlvbjogYW55O1xuXG4gICAgY29uc3RydWN0b3IocmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsLCBvcHRpb25zOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMucXVlc3Rpb25UeXBlcyA9IHRoaXMuZ2V0UXVlc3Rpb25UeXBlcygpO1xuICAgICAgICB0aGlzLmtvQ29waWVkUXVlc3Rpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29DYW5EZWxldGVPYmplY3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5rb1N0YXRlID0ga28ub2JzZXJ2YWJsZSgpO1xuICAgICAgICB0aGlzLmtvU2hvd1NhdmVCdXR0b24gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICAgICAgdGhpcy5rb1Nob3dPcHRpb25zID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gICAgICAgIHRoaXMua29UZXN0U3VydmV5V2lkdGggPSBrby5vYnNlcnZhYmxlKFwiMTAwJVwiKTtcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZG9TYXZlKCk7IH07XG4gICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XG4gICAgICAgIHRoaXMua29TZWxlY3RlZE9iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkT2JqZWN0LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdENoYW5nZWQobmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbHVlIDogbnVsbCk7IH0pO1xuICAgICAgICB0aGlzLmtvR2VuZXJhdGVWYWxpZEpTT04gPSBrby5vYnNlcnZhYmxlKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT04pO1xuICAgICAgICB0aGlzLmtvR2VuZXJhdGVWYWxpZEpTT04uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICAgICAgaWYgKCFzZWxmLm9wdGlvbnMpIHNlbGYub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OID0gbmV3VmFsdWU7XG4gICAgICAgICAgICBpZiAoc2VsZi5nZW5lcmF0ZVZhbGlkSlNPTkNoYW5nZWRDYWxsYmFjaykgc2VsZi5nZW5lcmF0ZVZhbGlkSlNPTkNoYW5nZWRDYWxsYmFjayhuZXdWYWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSBuZXcgU3VydmV5T2JqZWN0cyh0aGlzLmtvT2JqZWN0cywgdGhpcy5rb1NlbGVjdGVkT2JqZWN0KTtcbiAgICAgICAgdGhpcy51bmRvUmVkbyA9IG5ldyBTdXJ2ZXlVbmRvUmVkbygpO1xuXG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMgPSBuZXcgU3VydmV5VmVyYnMoZnVuY3Rpb24gKCkgeyBzZWxmLnNldE1vZGlmaWVkKCk7IH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IgPSBuZXcgU3VydmV5T2JqZWN0RWRpdG9yKHRoaXMub3B0aW9ucyk7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucGFnZXNFZGl0b3IgPSBuZXcgU3VydmV5UGFnZXNFZGl0b3IoKCkgPT4geyBzZWxmLmFkZFBhZ2UoKTsgfSwgKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QocGFnZSk7IH0sXG4gICAgICAgICAgICAoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikgPT4geyBzZWxmLm1vdmVQYWdlKGluZGV4RnJvbSwgaW5kZXhUbyk7IH0sIChwYWdlOiBTdXJ2ZXkuUGFnZSkgPT4geyBzZWxmLmRlbGV0ZUN1cnJlbnRPYmplY3QoKTsgfSk7XG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcgPSBuZXcgU3VydmV5RW1iZWRpbmdXaW5kb3coKTtcblxuICAgICAgICB0aGlzLmtvVmlld1R5cGUgPSBrby5vYnNlcnZhYmxlKFwiZGVzaWduZXJcIik7XG4gICAgICAgIHRoaXMua29Jc1Nob3dEZXNpZ25lciA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYua29WaWV3VHlwZSgpID09IFwiZGVzaWduZXJcIjsgfSk7XG4gICAgICAgIHRoaXMuc2VsZWN0RGVzaWduZXJDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93RGVzaWduZXIoKTsgfTtcbiAgICAgICAgdGhpcy5zZWxlY3RFZGl0b3JDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93SnNvbkVkaXRvcigpOyB9O1xuICAgICAgICB0aGlzLnNlbGVjdFRlc3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93VGVzdFN1cnZleSgpOyB9O1xuICAgICAgICB0aGlzLnNlbGVjdEVtYmVkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0VtYmVkRWRpdG9yKCk7IH07XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVWYWxpZEpTT05DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb0dlbmVyYXRlVmFsaWRKU09OKHRydWUpOyB9O1xuICAgICAgICB0aGlzLmdlbmVyYXRlUmVhZGFibGVKU09OQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29HZW5lcmF0ZVZhbGlkSlNPTihmYWxzZSk7IH07XG4gICAgICAgIHRoaXMucnVuU3VydmV5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0xpdmVTdXJ2ZXkoKTsgfTtcbiAgICAgICAgdGhpcy5lbWJlZGluZ1N1cnZleUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dTdXJ2ZXlFbWJlZGluZygpOyB9O1xuICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUN1cnJlbnRPYmplY3QoKTsgfTtcbiAgICAgICAgdGhpcy5kcmFnZ2luZ1F1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9uVHlwZSwgZSkgeyBzZWxmLmRvRHJhZ2dpbmdRdWVzdGlvbihxdWVzdGlvblR5cGUsIGUpOyB9O1xuICAgICAgICB0aGlzLmNsaWNrUXVlc3Rpb24gPSBmdW5jdGlvbiAocXVlc3Rpb25UeXBlKSB7IHNlbGYuZG9DbGlja1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZSk7IH07XG4gICAgICAgIHRoaXMuZHJhZ2dpbmdDb3BpZWRRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtLCBlKSB7IHNlbGYuZG9EcmFnZ2luZ0NvcGllZFF1ZXN0aW9uKGl0ZW0uanNvbiwgZSk7IH07XG4gICAgICAgIHRoaXMuY2xpY2tDb3BpZWRRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYuZG9DbGlja0NvcGllZFF1ZXN0aW9uKGl0ZW0uanNvbik7IH07XG5cbiAgICAgICAgdGhpcy5kb1VuZG9DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kb1VuZG9SZWRvKHNlbGYudW5kb1JlZG8udW5kbygpKTsgfTtcbiAgICAgICAgdGhpcy5kb1JlZG9DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kb1VuZG9SZWRvKHNlbGYudW5kb1JlZG8ucmVkbygpKTsgfTtcblxuICAgICAgICBpZiAocmVuZGVyZWRFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTtcbiAgICB9XG4gICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBhbnkgPSBudWxsKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZUVkaXRvckh0bWw7XG4gICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XG4gICAgfVxuICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBuZXcgU3VydmV5LmR4U3VydmV5U2VydmljZSgpLmxvYWRTdXJ2ZXkoc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xuICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgc2VsZi50ZXh0ID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgdGV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSByZXR1cm4gdGhpcy5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCk7XG4gICAgICAgIHJldHVybiB0aGlzLmpzb25FZGl0b3IgIT0gbnVsbCA/IHRoaXMuanNvbkVkaXRvci5nZXRWYWx1ZSgpIDogXCJcIjtcbiAgICB9XG4gICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy50ZXh0V29ya2VyID0gbmV3IFN1cnZleVRleHRXb3JrZXIodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy50ZXh0V29ya2VyLnN1cnZleSkpO1xuICAgICAgICAgICAgdGhpcy5zaG93RGVzaWduZXIoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG9DdXJyZW50U3RhdGUodHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldFRleHRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJlZGl0b3JcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGdldCBzdGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdGF0ZVZhbHVlOyB9XG4gICAgcHJvdGVjdGVkIHNldFN0YXRlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMua29TdGF0ZSh0aGlzLnN0YXRlKTtcbiAgICB9XG4gICAgc2F2ZU5vOiBudW1iZXIgPSAwO1xuICAgIHByb3RlY3RlZCBkb1NhdmUoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXCJzYXZpbmdcIik7XG4gICAgICAgIGlmICh0aGlzLnNhdmVTdXJ2ZXlGdW5jKSB7XG4gICAgICAgICAgICB0aGlzLnNhdmVObysrO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5zYXZlU3VydmV5RnVuYyh0aGlzLnNhdmVObyxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkb1NhdmVDYWxsYmFjayhubzogbnVtYmVyLCBpc1N1Y2Nlc3M6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRTdGF0ZShcInNhdmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zYXZlTm8gPT0gbm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1N1Y2Nlc3MpIHNlbGYuc2V0U3RhdGUoXCJzYXZlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZWxzZSBUT0RPXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcm90ZWN0ZWQgc2V0TW9kaWZpZWQoKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoXCJtb2RpZmllZFwiKTtcbiAgICAgICAgdGhpcy5zZXRVbmRvUmVkb0N1cnJlbnRTdGF0ZSgpO1xuICAgIH1cbiAgICBwcml2YXRlIHNldFVuZG9SZWRvQ3VycmVudFN0YXRlKGNsZWFyU3RhdGU6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAoY2xlYXJTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy51bmRvUmVkby5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZWxPYmogPSB0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKSA/IHRoaXMua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlIDogbnVsbDtcbiAgICAgICAgdGhpcy51bmRvUmVkby5zZXRDdXJyZW50KHRoaXMuc3VydmV5VmFsdWUsIHNlbE9iaiA/IHNlbE9iai5uYW1lIDogbnVsbCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXQgc2F2ZVN1cnZleUZ1bmMoKSB7IHJldHVybiB0aGlzLnNhdmVTdXJ2ZXlGdW5jVmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IHNhdmVTdXJ2ZXlGdW5jKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zYXZlU3VydmV5RnVuY1ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMua29TaG93U2F2ZUJ1dHRvbih2YWx1ZSAhPSBudWxsKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBzaG93T3B0aW9ucygpIHsgcmV0dXJuIHRoaXMua29TaG93T3B0aW9ucygpOyB9XG4gICAgcHVibGljIHNldCBzaG93T3B0aW9ucyh2YWx1ZTogYm9vbGVhbikgeyB0aGlzLmtvU2hvd09wdGlvbnModmFsdWUpOyB9XG4gICAgcHJpdmF0ZSBzZXRUZXh0VmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuanNvbkVkaXRvcikge1xuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5yZW5kZXJlci51cGRhdGVGdWxsKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvY2Vzc0pzb24odmFsdWUpO1xuICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gZmFsc2U7XG4gICAgfVxuICAgIHB1YmxpYyBhZGRQYWdlKCkge1xuICAgICAgICB2YXIgbmFtZSA9IFN1cnZleUhlbHBlci5nZXROZXdQYWdlTmFtZSh0aGlzLnN1cnZleS5wYWdlcyk7XG4gICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5VmFsdWUuYWRkTmV3UGFnZShuYW1lKTtcbiAgICAgICAgdGhpcy5hZGRQYWdlVG9VSShwYWdlKTtcbiAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0TG9jU3RyaW5nKHN0cjogc3RyaW5nKSB7IHJldHVybiBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKHN0cik7IH1cbiAgICBwcm90ZWN0ZWQgZ2V0UXVlc3Rpb25UeXBlcygpOiBzdHJpbmdbXSB7XG4gICAgICAgIHZhciBhbGxUeXBlcyA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuZ2V0QWxsVHlwZXMoKTtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMgfHwgIXRoaXMub3B0aW9ucy5xdWVzdGlvblR5cGVzIHx8ICF0aGlzLm9wdGlvbnMucXVlc3Rpb25UeXBlcy5sZW5ndGgpIHJldHVybiBhbGxUeXBlcztcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5xdWVzdGlvblR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25UeXBlID0gdGhpcy5vcHRpb25zLnF1ZXN0aW9uVHlwZXNbaV07XG4gICAgICAgICAgICBpZiAoYWxsVHlwZXMuaW5kZXhPZihxdWVzdGlvblR5cGUpID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChxdWVzdGlvblR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgbW92ZVBhZ2UoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikge1xuICAgICAgICB2YXIgcGFnZSA9IDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleS5wYWdlc1tpbmRleEZyb21dO1xuICAgICAgICB0aGlzLnN1cnZleS5wYWdlcy5zcGxpY2UoaW5kZXhGcm9tLCAxKTtcbiAgICAgICAgdGhpcy5zdXJ2ZXkucGFnZXMuc3BsaWNlKGluZGV4VG8sIDAsIHBhZ2UpO1xuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHBhZ2UpXG4gICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhZGRQYWdlVG9VSShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5VmFsdWU7XG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRQYWdlKHBhZ2UpO1xuICAgIH1cbiAgICBwcml2YXRlIG9uUXVlc3Rpb25BZGRlZChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xuICAgICAgICB2YXIgcGFnZSA9IDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRRdWVzdGlvbihwYWdlLCBxdWVzdGlvbik7XG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xuICAgIH1cbiAgICBwcml2YXRlIG9uUXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5yZW1vdmVPYmplY3QocXVlc3Rpb24pO1xuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBvblByb3BlcnR5VmFsdWVDaGFuZ2VkKHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvYmo6IGFueSwgbmV3VmFsdWU6IGFueSkge1xuICAgICAgICB2YXIgaXNEZWZhdWx0ID0gcHJvcGVydHkuaXNEZWZhdWx0VmFsdWUobmV3VmFsdWUpO1xuICAgICAgICBvYmpbcHJvcGVydHkubmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgaWYgKHByb3BlcnR5Lm5hbWUgPT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5uYW1lQ2hhbmdlZChvYmopO1xuICAgICAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5jaGFuZ2VOYW1lKDxTdXJ2ZXkuUGFnZT5vYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XG4gICAgfVxuICAgIHByaXZhdGUgZG9VbmRvUmVkbyhpdGVtOiBVbmRvUmVkb0l0ZW0pIHtcbiAgICAgICAgdGhpcy5pbml0U3VydmV5KGl0ZW0uc3VydmV5SlNPTik7XG4gICAgICAgIGlmIChpdGVtLnNlbGVjdGVkT2JqTmFtZSkge1xuICAgICAgICAgICAgdmFyIHNlbE9iaiA9IHRoaXMuZmluZE9iakJ5TmFtZShpdGVtLnNlbGVjdGVkT2JqTmFtZSk7XG4gICAgICAgICAgICBpZiAoc2VsT2JqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChzZWxPYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy51bmRvUmVkby5rb0NhblVuZG8oKSA/IFwibW9kaWZpZWRcIiA6IFwic2F2ZWRcIik7XG4gICAgfVxuICAgIHByaXZhdGUgZmluZE9iakJ5TmFtZShuYW1lOiBzdHJpbmcpOiBTdXJ2ZXkuQmFzZSB7XG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5TmFtZShuYW1lKTtcbiAgICAgICAgaWYgKHBhZ2UpIHJldHVybiBwYWdlO1xuICAgICAgICB2YXIgcXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uQmFzZT50aGlzLnN1cnZleS5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcbiAgICAgICAgaWYgKHF1ZXN0aW9uKSByZXR1cm4gcXVlc3Rpb247XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBwcml2YXRlIGNhblN3aXRjaFZpZXdUeXBlKG5ld1R5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAobmV3VHlwZSAmJiB0aGlzLmtvVmlld1R5cGUoKSA9PSBuZXdUeXBlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmtvVmlld1R5cGUoKSAhPSBcImVkaXRvclwiIHx8ICF0aGlzLnRleHRXb3JrZXIpIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAoIXRoaXMudGV4dFdvcmtlci5pc0pzb25Db3JyZWN0KSB7XG4gICAgICAgICAgICBhbGVydCh0aGlzLmdldExvY1N0cmluZyhcImVkLmNvcnJlY3RKU09OXCIpKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMudGV4dFdvcmtlci5zdXJ2ZXkpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHByaXZhdGUgc2hvd0Rlc2lnbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FuU3dpdGNoVmlld1R5cGUoXCJkZXNpZ25lclwiKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJkZXNpZ25lclwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzaG93SnNvbkVkaXRvcigpIHtcbiAgICAgICAgaWYgKHRoaXMua29WaWV3VHlwZSgpID09IFwiZWRpdG9yXCIpIHJldHVybjtcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFZhbHVlKHRoaXMuZ2V0U3VydmV5VGV4dEZyb21EZXNpZ25lcigpKTtcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yLmZvY3VzKCk7XG4gICAgICAgIHRoaXMua29WaWV3VHlwZShcImVkaXRvclwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzaG93VGVzdFN1cnZleSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhblN3aXRjaFZpZXdUeXBlKG51bGwpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2hvd0xpdmVTdXJ2ZXkoKTtcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlKFwidGVzdFwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzaG93RW1iZWRFZGl0b3IoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYW5Td2l0Y2hWaWV3VHlwZShcImVtYmVkXCIpKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2hvd1N1cnZleUVtYmVkaW5nKCk7XG4gICAgICAgIHRoaXMua29WaWV3VHlwZShcImVtYmVkXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGdldFN1cnZleVRleHRGcm9tRGVzaWduZXIoKSB7XG4gICAgICAgIHZhciBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT04pIHJldHVybiBKU09OLnN0cmluZ2lmeShqc29uLCBudWxsLCAxKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeShqc29uLCBudWxsLCAxKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdENoYW5nZWQob2JqOiBTdXJ2ZXkuQmFzZSkge1xuICAgICAgICB2YXIgY2FuRGVsZXRlT2JqZWN0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBvYmo7XG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMub2JqID0gb2JqO1xuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xuICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0ob2JqKTtcbiAgICAgICAgICAgIGNhbkRlbGV0ZU9iamVjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvQ2FuRGVsZXRlT2JqZWN0KGNhbkRlbGV0ZU9iamVjdCk7XG4gICAgfVxuICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xuICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMucmVuZGVyZWRFbGVtZW50KTtcbiAgICAgICAgdGhpcy5zdXJ2ZXlqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNcIik7XG4gICAgICAgIGlmICh0aGlzLnN1cnZleWpzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnN1cnZleWpzLm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSA0Nikgc2VsZi5kZWxldGVRdWVzdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMzggfHwgZS5rZXlDb2RlID09IDQwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0UXVlc3Rpb24oZS5rZXlDb2RlID09IDM4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuanNvbkVkaXRvciA9IGFjZS5lZGl0KFwic3VydmV5anNFZGl0b3JcIik7XG4gICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVcIik7XG5cbiAgICAgICAgdGhpcy5pbml0U3VydmV5KG5ldyBTdXJ2ZXlKU09ONSgpLnBhcnNlKFN1cnZleUVkaXRvci5kZWZhdWx0TmV3U3VydmV5VGV4dCkpO1xuICAgICAgICB0aGlzLnNldFVuZG9SZWRvQ3VycmVudFN0YXRlKHRydWUpO1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm1vZGUgPSBcImRlc2lnbmVyXCI7XG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUucmVuZGVyKHRoaXMuc3VydmV5anMpO1xuXG4gICAgICAgIHRoaXMuaW5pdEpzb25FZGl0b3IoKTtcbiAgICAgICAgU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhciA9IHRoaXMuanNvbkVkaXRvci5zZXNzaW9uLmRvYy5nZXROZXdMaW5lQ2hhcmFjdGVyKCk7XG4gICAgfVxuICAgIHByaXZhdGUgaW5pdEpzb25FZGl0b3IoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL21vbm9rYWlcIik7XG4gICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXNzaW9uLnNldE1vZGUoXCJhY2UvbW9kZS9qc29uXCIpO1xuICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLm9uSnNvbkVkaXRvckNoYW5nZWQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkuc2V0VXNlV29ya2VyKHRydWUpO1xuICAgIH1cbiAgICBwcml2YXRlIGluaXRTdXJ2ZXkoanNvbjogYW55KSB7XG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5LlN1cnZleShqc29uKTtcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuaXNFbXB0eSkge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkuU3VydmV5KG5ldyBTdXJ2ZXlKU09ONSgpLnBhcnNlKFN1cnZleUVkaXRvci5kZWZhdWx0TmV3U3VydmV5VGV4dCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3VydmV5Lm1vZGUgPSBcImRlc2lnbmVyXCI7XG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSg8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UpO1xuICAgICAgICB0aGlzLnN1cnZleVZlcmJzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3Qoc2VuZGVyW1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKTsgfSk7XG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvbkNvcHlRdWVzdGlvblwiXS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLmNvcHlRdWVzdGlvbihzZWxmLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7IH0pO1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25DcmVhdGVEcmFnRHJvcEhlbHBlclwiXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYuY3JlYXRlRHJhZ0Ryb3BIZWxwZXIoKSB9O1xuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uUHJvY2Vzc0h0bWwuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgb3B0aW9ucy5odG1sID0gc2VsZi5wcm9jZXNzSHRtbChvcHRpb25zLmh0bWwpOyB9KTtcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSg8U3VydmV5LlBhZ2U+c2VuZGVyLmN1cnJlbnRQYWdlKTsgfSk7XG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25RdWVzdGlvbkFkZGVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvbkFkZGVkKG9wdGlvbnMucXVlc3Rpb24pOyB9KTtcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblF1ZXN0aW9uUmVtb3ZlZC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLm9uUXVlc3Rpb25SZW1vdmVkKG9wdGlvbnMucXVlc3Rpb24pOyB9KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIWh0bWwpIHJldHVybiBodG1sO1xuICAgICAgICB2YXIgc2NyaXB0UmVnRXggPSAvPHNjcmlwdFxcYltePF0qKD86KD8hPFxcL3NjcmlwdD4pPFtePF0qKSo8XFwvc2NyaXB0Pi9naTtcbiAgICAgICAgd2hpbGUgKHNjcmlwdFJlZ0V4LnRlc3QoaHRtbCkpIHtcbiAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2Uoc2NyaXB0UmVnRXgsIFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBodG1sO1xuICAgIH1cbiAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XG4gICAgcHJpdmF0ZSBvbkpzb25FZGl0b3JDaGFuZ2VkKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCA+IC0xKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5KSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRpbWVvdXRJZCA9IC0xO1xuICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0pzb24oc2VsZi50ZXh0KTtcbiAgICAgICAgICAgIH0sIFN1cnZleUVkaXRvci51cGRhdGVUZXh0VGltZW91dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBwcm9jZXNzSnNvbih0ZXh0OiBzdHJpbmcpOiBhbnkge1xuICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcbiAgICAgICAgaWYgKHRoaXMuanNvbkVkaXRvcikge1xuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5zZXRBbm5vdGF0aW9ucyh0aGlzLmNyZWF0ZUFubm90YXRpb25zKHRleHQsIHRoaXMudGV4dFdvcmtlci5lcnJvcnMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGRvRHJhZ2dpbmdRdWVzdGlvbihxdWVzdGlvblR5cGU6IGFueSwgZSkge1xuICAgICAgICB0aGlzLmNyZWF0ZURyYWdEcm9wSGVscGVyKCkuc3RhcnREcmFnTmV3UXVlc3Rpb24oZSwgcXVlc3Rpb25UeXBlLCB0aGlzLmdldE5ld1F1ZXN0aW9uTmFtZSgpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBkb0RyYWdnaW5nQ29waWVkUXVlc3Rpb24oanNvbjogYW55LCBlKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRHJhZ0Ryb3BIZWxwZXIoKS5zdGFydERyYWdDb3BpZWRRdWVzdGlvbihlLCB0aGlzLmdldE5ld1F1ZXN0aW9uTmFtZSgpLCBqc29uKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVEcmFnRHJvcEhlbHBlcigpOiBEcmFnRHJvcEhlbHBlciB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBEcmFnRHJvcEhlbHBlcig8U3VydmV5LklTdXJ2ZXk+dGhpcy5zdXJ2ZXksIGZ1bmN0aW9uICgpIHsgc2VsZi5zZXRNb2RpZmllZCgpIH0pO1xuICAgIH1cbiAgICBwcml2YXRlIGRvQ2xpY2tRdWVzdGlvbihxdWVzdGlvblR5cGU6IGFueSkge1xuICAgICAgICB0aGlzLmRvQ2xpY2tRdWVzdGlvbkNvcmUoU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIHRoaXMuZ2V0TmV3UXVlc3Rpb25OYW1lKCkpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBkb0NsaWNrQ29waWVkUXVlc3Rpb24oanNvbjogYW55KSB7XG4gICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXROZXdRdWVzdGlvbk5hbWUoKTtcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihqc29uW1widHlwZVwiXSwgbmFtZSk7XG4gICAgICAgIG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvT2JqZWN0KGpzb24sIHF1ZXN0aW9uKTtcbiAgICAgICAgcXVlc3Rpb24ubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZG9DbGlja1F1ZXN0aW9uQ29yZShxdWVzdGlvbik7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0TmV3UXVlc3Rpb25OYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0TmV3UXVlc3Rpb25OYW1lKHRoaXMuc3VydmV5LmdldEFsbFF1ZXN0aW9ucygpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBkb0NsaWNrUXVlc3Rpb25Db3JlKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgcGFnZS5hZGRRdWVzdGlvbihxdWVzdGlvbiwgaW5kZXgpO1xuICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XG4gICAgfVxuICAgIHByaXZhdGUgZGVsZXRlUXVlc3Rpb24oKSB7XG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0U2VsZWN0ZWRPYmpBc1F1ZXN0aW9uKCk7XG4gICAgICAgIGlmIChxdWVzdGlvbikge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVDdXJyZW50T2JqZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBzZWxlY3RRdWVzdGlvbihpc1VwOiBib29sZWFuKSB7XG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0U2VsZWN0ZWRPYmpBc1F1ZXN0aW9uKCk7XG4gICAgICAgIGlmIChxdWVzdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE5leHRRdWVzdGlvbihpc1VwKVxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWRPYmpBc1F1ZXN0aW9uKCk6IFN1cnZleS5RdWVzdGlvbkJhc2Uge1xuICAgICAgICB2YXIgb2JqID0gdGhpcy5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWU7XG4gICAgICAgIGlmICghb2JqKSByZXR1cm4gbnVsbDtcbiAgICAgICAgcmV0dXJuIFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5RdWVzdGlvbiA/IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPihvYmopOiBudWxsO1xuICAgIH1cbiAgICBwcml2YXRlIGRlbGV0ZUN1cnJlbnRPYmplY3QoKSB7XG4gICAgICAgIHRoaXMuZGVsZXRlT2JqZWN0KHRoaXMua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlKTtcbiAgICB9XG4gICAgcHVibGljIGNvcHlRdWVzdGlvbihxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKHF1ZXN0aW9uKTtcbiAgICAgICAgaWYgKG9ialR5cGUgIT0gT2JqVHlwZS5RdWVzdGlvbikgcmV0dXJuO1xuICAgICAgICB2YXIganNvbiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChxdWVzdGlvbik7XG4gICAgICAgIGpzb24udHlwZSA9IHF1ZXN0aW9uLmdldFR5cGUoKTtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmdldENvcGllZFF1ZXN0aW9uQnlOYW1lKHF1ZXN0aW9uLm5hbWUpO1xuICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgaXRlbS5qc29uID0ganNvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMua29Db3BpZWRRdWVzdGlvbnMucHVzaCh7IG5hbWU6IHF1ZXN0aW9uLm5hbWUsIGpzb246IGpzb24gfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMua29Db3BpZWRRdWVzdGlvbnMoKS5sZW5ndGggPiAzKSB7XG4gICAgICAgICAgICB0aGlzLmtvQ29waWVkUXVlc3Rpb25zLnNwbGljZSgwLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGdldENvcGllZFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZykge1xuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLmtvQ29waWVkUXVlc3Rpb25zKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpdGVtc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiBpdGVtc1tpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcHJpdmF0ZSBkZWxldGVPYmplY3Qob2JqOiBhbnkpIHtcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnJlbW92ZU9iamVjdChvYmopO1xuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucmVtb3ZlUGFnZShvYmopO1xuICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5yZW1vdmVQYWdlKG9iaik7XG4gICAgICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9ialR5cGUgPT0gT2JqVHlwZS5RdWVzdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UucmVtb3ZlUXVlc3Rpb24ob2JqKTtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShudWxsKTtcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QodGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UpO1xuICAgICAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xuICAgIH1cbiAgICBwcml2YXRlIHNob3dMaXZlU3VydmV5KCkge1xuICAgICAgICBpZiAoIXRoaXMuc3VydmV5anNFeGFtcGxlKSByZXR1cm47XG4gICAgICAgIHZhciBqc29uID0gdGhpcy5nZXRTdXJ2ZXlKU09OKCk7XG4gICAgICAgIGlmIChqc29uICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChqc29uLmNvb2tpZU5hbWUpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUganNvbi5jb29raWVOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHN1cnZleSA9IG5ldyBTdXJ2ZXkuU3VydmV5KGpzb24pO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHN1cnZleWpzRXhhbXBsZVJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cnZleWpzRXhhbXBsZVJlc3VsdHNcIik7XG4gICAgICAgICAgICB2YXIgc3VydmV5anNFeGFtcGxlcmVSdW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cnZleWpzRXhhbXBsZXJlUnVuXCIpO1xuICAgICAgICAgICAgaWYgKHN1cnZleWpzRXhhbXBsZVJlc3VsdHMpIHN1cnZleWpzRXhhbXBsZVJlc3VsdHMuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChzdXJ2ZXlqc0V4YW1wbGVyZVJ1bikgc3VydmV5anNFeGFtcGxlcmVSdW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXkpID0+IHsgaWYgKHN1cnZleWpzRXhhbXBsZVJlc3VsdHMpIHN1cnZleWpzRXhhbXBsZVJlc3VsdHMuaW5uZXJIVE1MID0gdGhpcy5nZXRMb2NTdHJpbmcoXCJlZC5zdXJ2ZXlSZXN1bHRzXCIpICsgSlNPTi5zdHJpbmdpZnkoc3VydmV5LmRhdGEpOyBpZiAoc3VydmV5anNFeGFtcGxlcmVSdW4pIHN1cnZleWpzRXhhbXBsZXJlUnVuLnN0eWxlLmRpc3BsYXkgPSBcIlwiOyB9KTtcbiAgICAgICAgICAgIHN1cnZleS5yZW5kZXIodGhpcy5zdXJ2ZXlqc0V4YW1wbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqc0V4YW1wbGUuaW5uZXJIVE1MID0gdGhpcy5nZXRMb2NTdHJpbmcoXCJlZC5jb3JyZWN0SlNPTlwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHNob3dTdXJ2ZXlFbWJlZGluZygpIHtcbiAgICAgICAgdmFyIGpzb24gPSB0aGlzLmdldFN1cnZleUpTT04oKTtcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5qc29uID0ganNvbjtcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5zdXJ2ZXlJZCA9IHRoaXMuc3VydmV5SWQ7XG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5UG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuZ2VuZXJhdGVWYWxpZEpTT04gPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OO1xuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLnNob3coKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdXJ2ZXlKU09OKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzLmtvSXNTaG93RGVzaWduZXIoKSkgIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5zdXJ2ZXkpO1xuICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy50ZXh0V29ya2VyLnN1cnZleSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZUFubm90YXRpb25zKHRleHQ6IHN0cmluZywgZXJyb3JzOiBhbnlbXSk6IEFjZUFqYXguQW5ub3RhdGlvbltdIHtcbiAgICAgICAgdmFyIGFubm90YXRpb25zID0gbmV3IEFycmF5PEFjZUFqYXguQW5ub3RhdGlvbj4oKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlcnJvciA9IGVycm9yc1tpXTtcbiAgICAgICAgICAgIHZhciBhbm5vdGF0aW9uOiBBY2VBamF4LkFubm90YXRpb24gPSB7IHJvdzogZXJyb3IucG9zaXRpb24uc3RhcnQucm93LCBjb2x1bW46IGVycm9yLnBvc2l0aW9uLnN0YXJ0LmNvbHVtbiwgdGV4dDogZXJyb3IudGV4dCwgdHlwZTogXCJlcnJvclwiIH07XG4gICAgICAgICAgICBhbm5vdGF0aW9ucy5wdXNoKGFubm90YXRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbm5vdGF0aW9ucztcbiAgICB9XG59XG5cblN1cnZleS5TdXJ2ZXkuY3NzVHlwZSA9IFwiYm9vdHN0cmFwXCI7XG5uZXcgU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCgpLnJlcGxhY2VUZXh0KHRlbXBsYXRlUGFnZUh0bWwsIFwicGFnZVwiKTtcbm5ldyBTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0KCkucmVwbGFjZVRleHQodGVtcGxhdGVRdWVzdGlvbkh0bWwsIFwicXVlc3Rpb25cIik7XG5cblN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSA9IG51bGw7XG4gICAgdGhpcy5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xuICAgIHRoaXMub25Db3B5UXVlc3Rpb24gPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XG4gICAgdGhpcy5vbkNyZWF0ZURyYWdEcm9wSGVscGVyID0gbnVsbDtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb3B5UXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvcHlRdWVzdGlvbi5maXJlKHNlbGYpOyB9O1xufTtcblN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXSA9IGZ1bmN0aW9uKHZhbHVlOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XG4gICAgaWYgKHZhbHVlID09IHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlKSByZXR1cm47XG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWU7XG4gICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAob2xkVmFsdWUgIT0gbnVsbCkge1xuICAgICAgICBvbGRWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdKCk7XG4gICAgfVxuICAgIHRoaXMub25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZFNlbGVjdGVkUXVlc3Rpb24nOiBvbGRWYWx1ZSwgJ25ld1NlbGVjdGVkUXVlc3Rpb24nOiB2YWx1ZSB9KTtcbn07XG5TdXJ2ZXkuU3VydmV5LnByb3RvdHlwZVtcImdldEVkaXRvckxvY1N0cmluZ1wiXSA9IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyh2YWx1ZSk7XG59O1xuXG5TdXJ2ZXkuUGFnZS5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmRyYWdFbnRlckNvdW50ZXIgPSAwO1xuICAgIHRoaXMua29EcmFnZ2luZyA9IGtvLm9ic2VydmFibGUoLTEpO1xuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uID0ga28ub2JzZXJ2YWJsZShudWxsKTtcbiAgICB0aGlzLmtvRHJhZ2dpbmdCb3R0b20gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICB0aGlzLmtvRHJhZ2dpbmcuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xuICAgICAgICBpZiAobmV3VmFsdWUgPCAwKSB7XG4gICAgICAgICAgICBzZWxmLmRyYWdFbnRlckNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgc2VsZi5rb0RyYWdnaW5nUXVlc3Rpb24obnVsbCk7XG4gICAgICAgICAgICBzZWxmLmtvRHJhZ2dpbmdCb3R0b20oZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gbmV3VmFsdWUgPj0gMCAmJiBuZXdWYWx1ZSA8IHNlbGYucXVlc3Rpb25zLmxlbmd0aCA/IHNlbGYucXVlc3Rpb25zW25ld1ZhbHVlXSA6IG51bGw7XG4gICAgICAgICAgICBzZWxmLmtvRHJhZ2dpbmdRdWVzdGlvbihxdWVzdGlvbik7XG4gICAgICAgICAgICBzZWxmLmtvRHJhZ2dpbmdCb3R0b20ocXVlc3Rpb24gPT0gbnVsbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmtvRHJhZ2dpbmdRdWVzdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSkgbmV3VmFsdWUua29Jc0RyYWdnaW5nKHRydWUpOyB9KTtcbiAgICB0aGlzLmtvRHJhZ2dpbmdRdWVzdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKG9sZFZhbHVlKSB7IGlmIChvbGRWYWx1ZSkgb2xkVmFsdWUua29Jc0RyYWdnaW5nKGZhbHNlKTsgfSwgdGhpcywgXCJiZWZvcmVDaGFuZ2VcIik7XG4gICAgdGhpcy5kcmFnRW50ZXIgPSBmdW5jdGlvbiAoZSkgeyBlLnByZXZlbnREZWZhdWx0KCk7IHNlbGYuZHJhZ0VudGVyQ291bnRlcisrOyBzZWxmLmRvRHJhZ0VudGVyKGUpOyB9O1xuICAgIHRoaXMuZHJhZ0xlYXZlID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRW50ZXJDb3VudGVyLS07IGlmIChzZWxmLmRyYWdFbnRlckNvdW50ZXIgPT09IDApIHNlbGYua29EcmFnZ2luZygtMSk7IH07XG4gICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZG9Ecm9wKGUpOyB9O1xufTtcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJvcFwiXSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIGRyYWdEcm9wSGVscGVyID0gdGhpcy5kYXRhW1wib25DcmVhdGVEcmFnRHJvcEhlbHBlclwiXSA/IHRoaXMuZGF0YVtcIm9uQ3JlYXRlRHJhZ0Ryb3BIZWxwZXJcIl0oKSA6IG5ldyBEcmFnRHJvcEhlbHBlcih0aGlzLmRhdGEsIG51bGwpO1xuICAgIGRyYWdEcm9wSGVscGVyLmRvRHJvcChlKTtcbn07XG5TdXJ2ZXkuUGFnZS5wcm90b3R5cGVbXCJkb0RyYWdFbnRlclwiXSA9IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAodGhpcy5xdWVzdGlvbnMubGVuZ3RoID4gMCB8fCB0aGlzLmtvRHJhZ2dpbmcoKSA+IDApIHJldHVybjtcbiAgICBpZiAobmV3IERyYWdEcm9wSGVscGVyKHRoaXMuZGF0YSwgbnVsbCkuaXNTdXJ2ZXlEcmFnZ2luZyhlKSkge1xuICAgICAgICB0aGlzLmtvRHJhZ2dpbmcodGhpcy5xdWVzdGlvbnMubGVuZ3RoKTtcbiAgICB9XG59O1xuXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uQ3JlYXRpbmdcIl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXJWYWx1ZSA9IG51bGw7XG4gICAgdGhpcy5rb0lzRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5kcmFnRHJvcEhlbHBlclZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgIHNlbGYuZHJhZ0Ryb3BIZWxwZXJWYWx1ZSA9IHNlbGYuZGF0YVtcIm9uQ3JlYXRlRHJhZ0Ryb3BIZWxwZXJcIl0gPyBzZWxmLmRhdGFbXCJvbkNyZWF0ZURyYWdEcm9wSGVscGVyXCJdKCkgOiBuZXcgRHJhZ0Ryb3BIZWxwZXIoc2VsZi5kYXRhLCBudWxsKTs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGYuZHJhZ0Ryb3BIZWxwZXJWYWx1ZTtcbiAgICB9O1xuICAgIHRoaXMuZHJhZ092ZXIgPSBmdW5jdGlvbiAoZSkgeyBzZWxmLmRyYWdEcm9wSGVscGVyKCkuZG9EcmFnRHJvcE92ZXIoZSwgc2VsZik7IH07XG4gICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5kb0Ryb3AoZSwgc2VsZik7IH07XG4gICAgdGhpcy5kcmFnU3RhcnQgPSBmdW5jdGlvbiAoZSkgeyBzZWxmLmRyYWdEcm9wSGVscGVyKCkuc3RhcnREcmFnUXVlc3Rpb24oZSwgc2VsZi5uYW1lKTsgfTtcbiAgICB0aGlzLmtvSXNTZWxlY3RlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICAgIHRoaXMua29PbkNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2VsZi5kYXRhID09IG51bGwpIHJldHVybjtcbiAgICAgICAgc2VsZi5kYXRhW1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXSh0aGlzKTtcbiAgICB9XG59O1xuXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5kYXRhID09IG51bGwpIHJldHVybjtcbiAgICB0aGlzLmtvSXNTZWxlY3RlZCh0aGlzLmRhdGFbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0gPT0gdGhpcyk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VkaXRvci50cyIsImltcG9ydCB7U3VydmV5SGVscGVyLCBPYmpUeXBlfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RJdGVtIHtcbiAgICBwdWJsaWMgdmFsdWU6IFN1cnZleS5CYXNlO1xuICAgIHB1YmxpYyB0ZXh0OiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RzIHtcbiAgICBwdWJsaWMgc3RhdGljIGludGVuZDogc3RyaW5nID0gXCIuLi5cIjtcbiAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBrb09iamVjdHM6IGFueSwgcHVibGljIGtvU2VsZWN0ZWQ6IGFueSkge1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cbiAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgPT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnJlYnVpbGQoKTtcbiAgICB9XG4gICAgcHVibGljIGFkZFBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcbiAgICAgICAgdmFyIHBhZ2VJdGVtID0gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnN1cnZleS5wYWdlcy5pbmRleE9mKHBhZ2UpO1xuICAgICAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcHJldlBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpbmRleCAtIDFdO1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChwcmV2UGFnZSkgKyAxO1xuICAgICAgICAgICAgaW5kZXggKz0gcHJldlBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZGV4ID0gMTsgLy8wIC0gU3VydmV5XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRJdGVtKHBhZ2VJdGVtLCBpbmRleCk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tpXSk7XG4gICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaXRlbSwgaW5kZXggKyBpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQocGFnZUl0ZW0pO1xuICAgIH1cbiAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocGFnZTogU3VydmV5LlBhZ2UsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHBhZ2UpO1xuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XG4gICAgICAgIHZhciBxdWVzdGlvbkluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbikgKyAxO1xuICAgICAgICBpbmRleCArPSBxdWVzdGlvbkluZGV4O1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb24pO1xuICAgICAgICB0aGlzLmFkZEl0ZW0oaXRlbSwgaW5kZXgpO1xuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoaXRlbSk7XG4gICAgfVxuICAgIHB1YmxpYyBzZWxlY3RPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKG9ianNbaV0udmFsdWUgPT0gb2JqKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG9ianNbaV0pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwdWJsaWMgcmVtb3ZlT2JqZWN0KG9iajogU3VydmV5LkJhc2UpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xuICAgICAgICB2YXIgY291bnRUb1JlbW92ZSA9IDE7XG4gICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUGFnZSkge1xuICAgICAgICAgICAgdmFyIHBhZ2U6IFN1cnZleS5QYWdlID0gPFN1cnZleS5QYWdlPm9iajtcbiAgICAgICAgICAgIGNvdW50VG9SZW1vdmUgKz0gcGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua29PYmplY3RzLnNwbGljZShpbmRleCwgY291bnRUb1JlbW92ZSk7XG4gICAgfVxuICAgIHB1YmxpYyBuYW1lQ2hhbmdlZChvYmo6IFN1cnZleS5CYXNlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KG9iaik7XG4gICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcbiAgICAgICAgdGhpcy5rb09iamVjdHMoKVtpbmRleF0udGV4dCh0aGlzLmdldFRleHQob2JqKSk7XG4gICAgfVxuICAgIHB1YmxpYyBzZWxlY3ROZXh0UXVlc3Rpb24oaXNVcDogYm9vbGVhbikge1xuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFNlbGVjdGVkUXVlc3Rpb24oKTtcbiAgICAgICAgdmFyIGl0ZW1JbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHF1ZXN0aW9uKTtcbiAgICAgICAgaWYgKGl0ZW1JbmRleCA8IDApIHJldHVybiBxdWVzdGlvbjtcbiAgICAgICAgdmFyIG9ianMgPSB0aGlzLmtvT2JqZWN0cygpO1xuICAgICAgICB2YXIgbmV3SXRlbUluZGV4ID0gaXRlbUluZGV4ICsgKGlzVXAgPyAtMSA6IDEpO1xuICAgICAgICBpZiAobmV3SXRlbUluZGV4IDwgb2Jqcy5sZW5ndGggJiYgU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2Jqc1tuZXdJdGVtSW5kZXhdLnZhbHVlKSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XG4gICAgICAgICAgICBpdGVtSW5kZXggPSBuZXdJdGVtSW5kZXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdJdGVtSW5kZXggPSBpdGVtSW5kZXg7XG4gICAgICAgICAgICB3aGlsZSAobmV3SXRlbUluZGV4IDwgb2Jqcy5sZW5ndGggJiYgU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2Jqc1tuZXdJdGVtSW5kZXhdLnZhbHVlKSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaXRlbUluZGV4ID0gbmV3SXRlbUluZGV4O1xuICAgICAgICAgICAgICAgIG5ld0l0ZW1JbmRleCArPSAoaXNVcCA/IDEgOiAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG9ianNbaXRlbUluZGV4XSk7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0U2VsZWN0ZWRRdWVzdGlvbigpOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmtvU2VsZWN0ZWQoKSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHZhciBvYmogPSB0aGlzLmtvU2VsZWN0ZWQoKS52YWx1ZTtcbiAgICAgICAgaWYgKCFvYmopIHJldHVybiBudWxsO1xuICAgICAgICByZXR1cm4gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSA9PSBPYmpUeXBlLlF1ZXN0aW9uID8gPFN1cnZleS5RdWVzdGlvbkJhc2U+KG9iaikgOiBudWxsO1xuXG4gICAgfVxuICAgIHByaXZhdGUgYWRkSXRlbShpdGVtOiBTdXJ2ZXlPYmplY3RJdGVtLCBpbmRleDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMua29PYmplY3RzKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5wdXNoKGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHJlYnVpbGQoKSB7XG4gICAgICAgIHZhciBvYmpzID0gW107XG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cyhvYmpzKTtcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChudWxsKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVJdGVtKHRoaXMuc3VydmV5LCBcIlN1cnZleVwiKSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LnBhZ2VzW2ldO1xuICAgICAgICAgICAgb2Jqcy5wdXNoKHRoaXMuY3JlYXRlUGFnZShwYWdlKSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgb2Jqcy5wdXNoKHRoaXMuY3JlYXRlUXVlc3Rpb24ocGFnZS5xdWVzdGlvbnNbal0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtvT2JqZWN0cyhvYmpzKTtcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkKHRoaXMuc3VydmV5KTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUl0ZW0ocGFnZSwgdGhpcy5nZXRUZXh0KHBhZ2UpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVRdWVzdGlvbihxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHF1ZXN0aW9uLCB0aGlzLmdldFRleHQocXVlc3Rpb24pKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVJdGVtKHZhbHVlOiBTdXJ2ZXkuQmFzZSwgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHZhciBpdGVtID0gbmV3IFN1cnZleU9iamVjdEl0ZW0oKTtcbiAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBpdGVtLnRleHQgPSBrby5vYnNlcnZhYmxlKHRleHQpO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJdGVtSW5kZXgodmFsdWU6IFN1cnZleS5CYXNlKTogbnVtYmVyIHtcbiAgICAgICAgdmFyIG9ianMgPSB0aGlzLmtvT2JqZWN0cygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChvYmpzW2ldLnZhbHVlID09IHZhbHVlKSByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0VGV4dChvYmo6IFN1cnZleS5CYXNlKTogc3RyaW5nIHtcbiAgICAgICAgdmFyIGludGVuZCA9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xuICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSAhPSBPYmpUeXBlLlBhZ2UpIHtcbiAgICAgICAgICAgIGludGVuZCArPSBTdXJ2ZXlPYmplY3RzLmludGVuZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW50ZW5kICsgU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUob2JqKTtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N1cnZleU9iamVjdHMudHMiLCJleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cInJvdyBuYXYtdGFic1wiPiAgICA8bmF2IGNsYXNzPVwibmF2YmFyLWRlZmF1bHRcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCI+ICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFicyBuby1ib3JkZXJzXCI+ICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1iaW5kPVwiY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZGVzaWduZXJcXCd9XCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3REZXNpZ25lckNsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuZGVzaWduZXJcXCcpXCI+PC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1iaW5kPVwiY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZWRpdG9yXFwnfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0RWRpdG9yQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC5qc29uRWRpdG9yXFwnKVwiPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZToga29WaWV3VHlwZSgpID09IFxcJ3Rlc3RcXCd9XCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3RUZXN0Q2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC50ZXN0U3VydmV5XFwnKVwiPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZToga29WaWV3VHlwZSgpID09IFxcJ2VtYmVkXFwnfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0RW1iZWRDbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLmVtYmVkU3VydmV5XFwnKVwiPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cInZpc2libGU6IGtvU2hvd1NhdmVCdXR0b25cIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBzYXZlQnV0dG9uQ2xpY2tcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuc2F2ZVN1cnZleVxcJylcIj48L3NwYW4+PC9idXR0b24+PC9saT4gICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb0lzU2hvd0Rlc2lnbmVyXCIgc3R5bGU9XCJtYXJnaW4tbGVmdDo1cHhcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImVuYWJsZTp1bmRvUmVkby5rb0NhblVuZG8sIGNsaWNrOiBkb1VuZG9DbGlja1wiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC51bmRvXFwnKVwiPjwvc3Bhbj48L2J1dHRvbj48L2xpPiAgICAgICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXJcIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OjVweFwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiZW5hYmxlOnVuZG9SZWRvLmtvQ2FuUmVkbywgY2xpY2s6IGRvUmVkb0NsaWNrXCI+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLnJlZG9cXCcpXCI+PC9zcGFuPjwvYnV0dG9uPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1iaW5kPVwidmlzaWJsZToga29Jc1Nob3dEZXNpZ25lcigpICYmIGtvU2hvd09wdGlvbnMoKVwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6NXB4XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQub3B0aW9uc1xcJylcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnMgPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvR2VuZXJhdGVWYWxpZEpTT059XCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpnZW5lcmF0ZVZhbGlkSlNPTkNsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuZ2VuZXJhdGVWYWxpZEpTT05cXCcpXCI+PC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgZGF0YS1iaW5kPVwiY3NzOiB7YWN0aXZlOiAha29HZW5lcmF0ZVZhbGlkSlNPTigpfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6Z2VuZXJhdGVSZWFkYWJsZUpTT05DbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLmdlbmVyYXRlUmVhZGFibGVKU09OXFwnKVwiPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC9saT4gICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwndGVzdFxcJ1wiIHN0eWxlPVwibWFyZ2luLWxlZnQ6NXB4XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT1cIm1hcmdpbi10b3A6IDEwcHhcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29UZXN0U3VydmV5V2lkdGhcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjEwMCVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleVdpZHRoXFwnKSArIFxcJzEwMCVcXCdcIj48L29wdGlvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjEyMDBweFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC50ZXN0U3VydmV5V2lkdGhcXCcpICsgXFwnMTIwMHB4XFwnXCI+PC9vcHRpb24+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxMDAwcHhcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleVdpZHRoXFwnKSArIFxcJzEwMDBweFxcJ1wiPjwvb3B0aW9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiODAwcHhcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleVdpZHRoXFwnKSArIFxcJzgwMHB4XFwnXCI+PC9vcHRpb24+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI2MDBweFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdlZC50ZXN0U3VydmV5V2lkdGhcXCcpICsgXFwnNjAwcHhcXCdcIj48L29wdGlvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjQwMHB4XCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLnRlc3RTdXJ2ZXlXaWR0aFxcJykgKyBcXCc0MDBweFxcJ1wiPjwvb3B0aW9uPiAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgPC9saT4gICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9uYXY+IDwvZGl2PjxkaXYgY2xhc3M9XCJwYW5lbFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiPiAgICA8ZGl2IGlkPVwic3VydmV5anNFZGl0b3JcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZWRpdG9yXFwnXCIgc3R5bGU9XCJoZWlnaHQ6NDUwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICA8ZGl2IGlkPVwic3VydmV5anNUZXN0XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29WaWV3VHlwZSgpID09IFxcJ3Rlc3RcXCcsIHN0eWxlOiB7d2lkdGg6IGtvVGVzdFN1cnZleVdpZHRofVwiIHN0eWxlPVwibWFyZ2luOiAxMHB4XCI+ICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNFeGFtcGxlXCI+PC9kaXY+ICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNFeGFtcGxlUmVzdWx0c1wiPjwvZGl2PiAgICAgICAgPGJ1dHRvbiBpZD1cInN1cnZleWpzRXhhbXBsZXJlUnVuXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0VGVzdENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQudGVzdFN1cnZleUFnYWluXFwnKVwiIHN0eWxlPVwiZGlzcGxheTpub25lXCI+VGVzdCBBZ2FpbjwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBpZD1cInN1cnZleWpzRW1iZWRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZW1iZWRcXCdcIiBzdHlsZT1cIm1hcmdpbjogMTBweFwiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXllbWJlZGluZ1xcJywgZGF0YTogc3VydmV5RW1iZWRpbmcgfVwiPjwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJvd1wiICBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gXFwnZGVzaWduZXJcXCdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgY29sLW1kLTlcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLW1kLTNcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2VkLnRvb2xib3hcXCcpXCI+PC9iPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwLXZlcnRpY2FsXCIgc3R5bGU9XCJ3aWR0aDoxMDAlO3BhZGRpbmctcmlnaHQ6MnB4XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvblR5cGVzIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDsgcGFkZGluZy1sZWZ0OjEwcHg7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jbGlja1F1ZXN0aW9uLCBldmVudDp7ZHJhZ3N0YXJ0OiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdnaW5nUXVlc3Rpb24oJGRhdGEsIGUpOyByZXR1cm4gdHJ1ZTt9fVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncXQuXFwnICsgJGRhdGEpXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvQ29waWVkUXVlc3Rpb25zIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDsgcGFkZGluZy1sZWZ0OjEwcHg7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jbGlja0NvcGllZFF1ZXN0aW9uLCBldmVudDp7ZHJhZ3N0YXJ0OiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdnaW5nQ29waWVkUXVlc3Rpb24oJGRhdGEsIGUpOyByZXR1cm4gdHJ1ZTt9fVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0Om5hbWVcIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOVwiPiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93LXk6IHNjcm9sbDtoZWlnaHQ6NDUwcHg7XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtM1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29PYmplY3RzLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRPYmplY3RcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29DYW5EZWxldGVPYmplY3QsIGNsaWNrOiBkZWxldGVDdXJyZW50T2JqZWN0LCBhdHRyOiB7IHRpdGxlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZWQuZGVsU2VsT2JqZWN0XFwnKX1cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3RlZGl0b3JcXCcsIGRhdGE6IHNlbGVjdGVkT2JqZWN0RWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWZvb3RlclwiIGRhdGEtYmluZD1cInZpc2libGU6c3VydmV5VmVyYnMua29IYXNWZXJic1wiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3R2ZXJic1xcJywgZGF0YTogc3VydmV5VmVyYnMgfVwiPjwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdGVkaXRvclwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSBzdmRfdGFibGUtbm93cmFwXCI+ICAgICAgICA8dGJvZHkgZGF0YS1iaW5kPVwiZm9yZWFjaDoga29Qcm9wZXJ0aWVzXCI+ICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNoYW5nZUFjdGl2ZVByb3BlcnR5KCRkYXRhKSwgY3NzOiB7XFwnYWN0aXZlXFwnOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YX1cIj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IGRpc3BsYXlOYW1lLCBhdHRyOiB7dGl0bGU6IHRpdGxlfVwiIHdpZHRoPVwiNTAlXCI+PC90ZD4gICAgICAgICAgICAgICAgPHRkIHdpZHRoPVwiNTAlXCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHQsIHZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpICE9ICRkYXRhLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH0sIHN0eWxlOiB7Y29sb3I6IGtvSXNEZWZhdWx0KCkgPyBcXCdncmF5XFwnIDogXFwnXFwnfVwiIHN0eWxlPVwidGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3c6aGlkZGVuXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItXFwnICsgZWRpdG9yVHlwZSwgZGF0YTogJGRhdGEgfSAtLT4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwib2JqZWN0dmVyYnNcIj4gICAgPCEtLSBrbyBmb3JlYWNoOiBrb1ZlcmJzIC0tPiAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiAgICAgICAgICAgICAgICA8c3BhbiAgY2xhc3M9XCJpbnB1dC1ncm91cC1hZGRvblwiIGRhdGEtYmluZD1cInRleHQ6dGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6IGtvSXRlbXMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCBvcHRpb25zVmFsdWU6XFwndmFsdWVcXCcsIHZhbHVlOiBrb1NlbGVjdGVkSXRlbVwiPjwvc2VsZWN0PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwhLS0gL2tvICAtLT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInBhZ2VlZGl0b3JcIj4gICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzXCIgZGF0YS1iaW5kPVwidGFiczp0cnVlXCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvUGFnZXMgLS0+ICAgICAgICA8bGkgZGF0YS1iaW5kPVwiY3NzOiB7YWN0aXZlOiBrb1NlbGVjdGVkKCl9LGV2ZW50OnsgICAgICAgICAgIGtleWRvd246ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmtleURvd24oZWwsIGUpOyB9LCAgICAgICAgICAgZHJhZ3N0YXJ0OmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnU3RhcnQoZWwpOyByZXR1cm4gdHJ1ZTsgfSwgICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnT3ZlcihlbCk7fSwgICAgICAgICAgIGRyYWdlbmQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdFbmQoKTt9LCAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0Ryb3AoZWwpO30gICAgICAgICB9XCI+ICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6JHBhcmVudC5zZWxlY3RQYWdlQ2xpY2tcIj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+ICAgICAgICAgICAgPC9hPiAgICAgICAgPC9saT4gICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOmFkZE5ld1BhZ2VDbGlja1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPjwvbGk+ICAgIDwvdWw+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXllbWJlZGluZ1wiPiAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cInZhbHVlOmtvTGlicmFyeVZlcnNpb25cIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwia25vY2tvdXRcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcua25vY2tvdXRcXCcpXCI+PC9vcHRpb24+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlYWN0XCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LnJlYWN0XFwnKVwiPjwvb3B0aW9uPiAgICAgICAgPC9zZWxlY3Q+ICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cInZhbHVlOmtvU2NyaXB0VXNpbmdcIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYm9vdHN0cmFwXCIgZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ2V3LmJvb3RzdHJhcFxcJylcIj48L29wdGlvbj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic3RhbmRhcmRcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcuc3RhbmRhcmRcXCcpXCI+PC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TaG93QXNXaW5kb3dcIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGFnZVwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdldy5zaG93T25QYWdlXFwnKVwiPjwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aW5kb3dcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcuc2hvd0luV2luZG93XFwnKVwiPjwvb3B0aW9uPiAgICAgICAgPC9zZWxlY3Q+ICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveC1pbmxpbmVcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzSWRzXCI+ICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6a29Mb2FkU3VydmV5XCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcubG9hZEZyb21TZXJ2ZXJcXCcpXCI+PC9zcGFuPiAgICAgICAgPC9sYWJlbD4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcudGl0bGVTY3JpcHRcXCcpXCI+PC9kaXY+ICAgICAgICA8ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdIZWFkXCIgc3R5bGU9XCJoZWlnaHQ6NzBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwicGFuZWxcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1Zpc2libGVIdG1sXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiICBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcudGl0bGVIdG1sXFwnKVwiPjwvZGl2PiAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nQm9keVwiIHN0eWxlPVwiaGVpZ2h0OjMwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiICBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwnZXcudGl0bGVKYXZhU2NyaXB0XFwnKVwiPjwvZGl2PiAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nSmF2YVwiIHN0eWxlPVwiaGVpZ2h0OjMwMHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1ib29sZWFuXCI+ICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJjaGVja2VkOiBrb1ZhbHVlXCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWRyb3Bkb3duXCI+ICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWUsIG9wdGlvbnM6IGNob2ljZXNcIiAgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PC9zZWxlY3Q+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1odG1sXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtaHRtbFwiPiAgICA8dGV4dGFyZWEgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIHJvd3M9XCIxMFwiIGF1dG9mb2N1cz1cImF1dG9mb2N1c1wiPjwvdGV4dGFyZWE+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1pdGVtdmFsdWVzXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtaXRlbXZhbHVlc1wiPiAgICA8ZGl2IHN0eWxlPVwib3ZlcmZsb3cteTogYXV0bzsgb3ZlcmZsb3cteDpoaWRkZW47IG1heC1oZWlnaHQ6NDAwcHhcIj4gICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICAgICAgPHRoZWFkPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnZhbHVlXFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRleHRcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwvdGhlYWQ+ICAgICAgICAgICAgPHRib2R5PiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyIG5vLXBhZGRpbmdcIiByb2xlPVwiYWxlcnRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzRXJyb3IsIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5lbnRlck5ld1ZhbHVlXFwnKVwiPjwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVGV4dFwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0blwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uRGVsZXRlQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuZGVsZXRlXFwnKVwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPC90Ym9keT4gICAgICAgIDwvdGFibGU+ICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwicm93IGJ0bi10b29sYmFyXCI+ICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQWRkQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuYWRkTmV3XFwnKVwiIC8+ICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXJcIiBkYXRhLWJpbmQ9XCJjbGljazogb25DbGVhckNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnJlbW92ZUFsbFxcJylcIiAvPiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLW1hdHJpeGRyb3Bkb3duY29sdW1uc1wiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LW1hdHJpeGRyb3Bkb3duY29sdW1uc1wiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPiAgICAgICAgPHRoZWFkPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5yZXF1aXJlZFxcJylcIj48L3RoPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmNlbGxUeXBlXFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUubmFtZVxcJylcIj48L3RoPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRpdGxlXFwnKVwiPjwvdGg+ICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3RoZWFkPiAgICAgICAgPHRib2R5PiAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29JdGVtcyAtLT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0hhc0Nob2ljZXMsIGNsaWNrOiBvblNob3dDaG9pY2VzQ2xpY2tcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvblwiIGRhdGEtYmluZD1cImNzczoge1xcJ2dseXBoaWNvbi1jaGV2cm9uLWRvd25cXCc6ICFrb1Nob3dDaG9pY2VzKCksIFxcJ2dseXBoaWNvbi1jaGV2cm9uLXVwXFwnOiBrb1Nob3dDaG9pY2VzKCl9XCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPC9hPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvSXNSZXF1aXJlZFwiIC8+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgICAgIDx0ZD4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOiBjZWxsVHlwZUNob2ljZXMsIHZhbHVlOiBrb0NlbGxUeXBlXCIgIHN0eWxlPVwid2lkdGg6MTEwcHhcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05hbWVcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbm8tcGFkZGluZ1wiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNFcnJvciwgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmVudGVyTmV3VmFsdWVcXCcpXCI+PC9kaXY+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVGl0bGVcIiBzdHlsZT1cIndpZHRoOjEyMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0blwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uRGVsZXRlQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuZGVsZXRlXFwnKVwiLz48L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cInZpc2libGU6IGtvU2hvd0Nob2ljZXMoKSAmJiBrb0hhc0Nob2ljZXMoKVwiPiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjRcIiBzdHlsZT1cImJvcmRlci10b3Atc3R5bGU6bm9uZVwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGNvbC1zbS0zXCIgZGF0YS1iaW5kPVwidGV4dDokcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuaGFzT3RoZXJcXCcpXCI+PC9sYWJlbD4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTJcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvSGFzT3RoZXJcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tN1wiIGRhdGEtYmluZD1cInZpc2libGU6ICFrb0hhc0NvbENvdW50KClcIj48L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGNvbC1zbS0zXCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0hhc0NvbENvdW50LCB0ZXh0OiRyb290LmdldExvY1N0cmluZyhcXCdwZS5jb2xDb3VudFxcJylcIj48L2xhYmVsPiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgY29sLXNtLTRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzQ29sQ291bnQsIG9wdGlvbnM6IGNvbENvdW50Q2hvaWNlcywgdmFsdWU6IGtvQ29sQ291bnRcIiBzdHlsZT1cIndpZHRoOjExMHB4XCI+PC9zZWxlY3Q+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHN2ZF9ub3RvcGJvdHRvbXBhZGRpbmdzXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtaXRlbXZhbHVlc1xcJywgZGF0YTogY2hvaWNlc0VkaXRvciB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBidG4tdG9vbGJhclwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiBkYXRhLWJpbmQ9XCJjbGljazogb25BZGRDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5hZGROZXdcXCcpXCIvPiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkNsZWFyQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUucmVtb3ZlQWxsXFwnKVwiXCIgLz4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItbW9kYWxcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiFlZGl0b3IuaXNFZGl0YWJsZVwiPiAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29UZXh0XCI+PC9zcGFuPiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCJkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgc3R5bGU9XCJwYWRkaW5nOiAycHg7XCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ2RhdGEtdGFyZ2V0XFwnIDogbW9kYWxOYW1lVGFyZ2V0fVwiPiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiAgICAgICAgPC9idXR0b24+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ZWRpdG9yLmlzRWRpdGFibGVcIiBzdHlsZT1cImRpc3BsYXk6dGFibGVcIj4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBrb1ZhbHVlXCIgc3R5bGU9XCJkaXNwbGF5OnRhYmxlLWNlbGw7IHdpZHRoOjEwMCVcIiAvPiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBzdHlsZT1cImRpc3BsYXk6dGFibGUtY2VsbDsgcGFkZGluZzogMnB4O1wiICBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS1iaW5kPVwiYXR0cjoge1xcJ2RhdGEtdGFyZ2V0XFwnIDogbW9kYWxOYW1lVGFyZ2V0fVwiPiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1lZGl0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiAgICAgICAgPC9idXR0b24+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cImF0dHI6IHtpZCA6IG1vZGFsTmFtZX1cIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JnRpbWVzOzwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OmVkaXRvci50aXRsZVwiPjwvaDQ+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHN2ZF9ub3RvcGJvdHRvbXBhZGRpbmdzXCI+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yY29udGVudC1cXCcgKyBlZGl0b3JUeXBlLCBkYXRhOiBlZGl0b3IgfSAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGRhdGEtYmluZD1cImNsaWNrOiBlZGl0b3Iub25BcHBseUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmFwcGx5XFwnKVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBlZGl0b3Iub25SZXNldENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnJlc2V0XFwnKVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgZGF0YS1iaW5kPVwidmFsdWU6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5jbG9zZVxcJylcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1udW1iZXJcIj4gICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1yZXN0ZnVsbFwiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LXJlc3RmdWxsXCI+ICAgIDxmb3JtPiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXJsXCI+VXJsOjwvbGFiZWw+ICAgICAgICAgICAgPGlucHV0IGlkPVwidXJsXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1VybFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicGF0aFwiPlBhdGg6PC9sYWJlbD4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJwYXRoXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1BhdGhcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+ICAgICAgICAgICAgPGxhYmVsIGZvcj1cInZhbHVlTmFtZVwiPnZhbHVlTmFtZTo8L2xhYmVsPiAgICAgICAgICAgIDxpbnB1dCBpZD1cInZhbHVlTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZU5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+ICAgICAgICAgICAgPGxhYmVsIGZvcj1cInRpdGxlTmFtZVwiPnRpdGxlTmFtZTo8L2xhYmVsPiAgICAgICAgICAgIDxpbnB1dCBpZD1cInRpdGxlTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UaXRsZU5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIC8+ICAgICAgICA8L2Rpdj4gICAgPC9mb3JtPiAgICA8ZGl2IGlkPVwicmVzdGZ1bGxTdXJ2ZXlcIiBzdHlsZT1cIndpZHRoOjEwMCU7aGVpZ2h0OjE1MHB4XCI+PC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1zdHJpbmdcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdGV4dFwiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LXRleHRcIj4gICAgPHRleHRhcmVhIGRhdGEtYmluZD1cInZhbHVlOmtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiByb3dzPVwiMTBcIiBhdXRvZm9jdXM9XCJhdXRvZm9jdXNcIj48L3RleHRhcmVhPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdGV4dGl0ZW1zXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdGV4dGl0ZW1zXCI+PGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLm5hbWVcXCcpXCI+PC90aD4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50aXRsZVxcJylcIj48L3RoPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90aGVhZD4gICAgICAgIDx0Ym9keT4gICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05hbWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1RpdGxlXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG5cIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmRlbGV0ZVxcJylcIi8+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFkZENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLmFkZE5ld1xcJylcIi8+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXRyaWdnZXJzXCI+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItbW9kYWxcXCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdHJpZ2dlcnNcIj48ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZSBpbnB1dC1ncm91cC1hZGRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj4gICAgICAgICAgICA8L2J1dHRvbj4gICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogYXZhaWxhYmxlVHJpZ2dlcnMgLS0+ICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uQWRkQ2xpY2soJGRhdGEpXCI+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YVwiPjwvc3Bhbj48L2E+PC9saT4gICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgICAgIDwvdWw+ICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6IGtvSXRlbXMsIG9wdGlvbnNUZXh0OiBcXCdrb1RleHRcXCcsIHZhbHVlOiBrb1NlbGVjdGVkXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgPC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvU2VsZWN0ZWQoKSA9PSBudWxsXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvUXVlc3Rpb25zKCkubGVuZ3RoID09IDAsIHRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS5ub3F1ZXN0aW9uc1xcJylcIj48L2Rpdj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29RdWVzdGlvbnMoKS5sZW5ndGggPiAwLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUuY3JlYXRldHJpZ2dlclxcJylcIj48L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZCgpICE9IG51bGxcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwid2l0aDoga29TZWxlY3RlZFwiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgZm9ybS1pbmxpbmVcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudHJpZ2dlck9uXFwnKVwiPjwvc3Bhbj48c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczokcGFyZW50LmtvUXVlc3Rpb25zLCB2YWx1ZToga29OYW1lXCI+PC9zZWxlY3Q+IDxzcGFuPiA8L3NwYW4+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTRcIj4gICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOmF2YWlsYWJsZU9wZXJhdG9ycywgb3B0aW9uc1ZhbHVlOiBcXCduYW1lXFwnLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6a29PcGVyYXRvclwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00XCI+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBzdHlsZT1cInBhZGRpbmc6IDBcIiB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvUmVxdWlyZVZhbHVlLCB2YWx1ZTprb1ZhbHVlXCIgLz4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPCEtLSBrbyBpZjoga29UeXBlKCkgPT0gXFwndmlzaWJsZXRyaWdnZXJcXCcgLS0+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1xcJywgZGF0YTogcGFnZXMgfSAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzaXRlbXNcXCcsIGRhdGE6IHF1ZXN0aW9ucyB9IC0tPiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwhLS0ga28gaWY6IGtvVHlwZSgpID09IFxcJ2NvbXBsZXRldHJpZ2dlclxcJyAtLT4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm1hcmdpbjogMTBweFwiIGRhdGEtYmluZD1cInRleHQ6ICRyb290LmdldExvY1N0cmluZyhcXCdwZS50cmlnZ2VyQ29tcGxldGVUZXh0XFwnKVwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwhLS0ga28gaWY6IGtvVHlwZSgpID09IFxcJ3NldHZhbHVldHJpZ2dlclxcJyAtLT4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGZvcm0taW5saW5lXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjEwcHhcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoXFwncGUudHJpZ2dlclNldFRvTmFtZVxcJylcIj48L3NwYW4+PGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb3NldFRvTmFtZVwiIC8+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTFcIj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNVwiPiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRyaWdnZXJTZXRWYWx1ZVxcJylcIj48L3NwYW4+PGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb3NldFZhbHVlXCIgLz4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBmb3JtLWlubGluZVwiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiY2hlY2tlZDoga29pc1ZhcmlhYmxlXCIgLz4gPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKFxcJ3BlLnRyaWdnZXJJc1ZhcmlhYmxlXFwnKVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zXCI+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBuby1tYXJnaW5zIG5vLXBhZGRpbmdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBtdWx0aXBsZT1cIm11bHRpcGxlXCIgZGF0YS1iaW5kPVwib3B0aW9uczprb0Nob29zZW4sIHZhbHVlOiBrb0Nob29zZW5TZWxlY3RlZFwiPjwvc2VsZWN0PiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYnRuXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0Nob29zZW5TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgY2xhc3M9XCJidG5cIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCIgc3R5bGU9XCJtYXJnaW4tdG9wOjVweFwiPiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOmtvT2JqZWN0cywgdmFsdWU6IGtvU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25BZGRDbGlja1wiIHN0eWxlPVwid2lkdGg6NDBweFwiIGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgPC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdmFsaWRhdG9yc1wiPiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsXFwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3Jjb250ZW50LXZhbGlkYXRvcnNcIj48ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZSBpbnB1dC1ncm91cC1hZGRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj4gICAgICAgICAgICA8L2J1dHRvbj4gICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogYXZhaWxhYmxlVmFsaWRhdG9ycyAtLT4gICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25BZGRDbGljaygkZGF0YSlcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPjwvYT48L2xpPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICAgICAgPC91bD4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOiBrb1NlbGVjdGVkXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcIiBjbGFzcz1cImJ0blwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgPC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ29iamVjdGVkaXRvclxcJywgZGF0YTogc2VsZWN0ZWRPYmplY3RFZGl0b3IgfVwiPjwvZGl2PjwvZGl2Pjwvc2NyaXB0Pic7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RlbXBsYXRlRWRpdG9yLmtvLmh0bWwudHMiLCJleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBkYXRhLWJpbmQ9XCJldmVudDp7ICAgICAgICAgICBkcmFnZW50ZXI6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnRW50ZXIoZSk7fSwgICAgICAgICAgIGRyYWdsZWF2ZTpmdW5jdGlvbihlbCwgZSl7IGRyYWdMZWF2ZShlKTt9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyByZXR1cm4gZmFsc2U7fSwgICAgICAgICAgIGRyb3A6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnRHJvcChlKTt9fSAgICAgXCI+ICAgIDxoNCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAodGl0bGUubGVuZ3RoID4gMCkgJiYgZGF0YS5zaG93UGFnZVRpdGxlcywgdGV4dDoga29ObygpICsgcHJvY2Vzc2VkVGl0bGUsIGNzczogJHJvb3QuY3NzLnBhZ2VUaXRsZVwiPjwvaDQ+ICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiByb3dzLCBhczogXFwncm93XFwnfSAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiByb3cua29WaXNpYmxlLCBjc3M6ICRyb290LmNzcy5yb3dcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiByb3cucXVlc3Rpb25zLCBhczogXFwncXVlc3Rpb25cXCcgLCBhZnRlclJlbmRlcjogcm93LmtvQWZ0ZXJSZW5kZXIgfSAtLT4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPC9kaXY+ICAgIDwhLS0gL2tvIC0tPiAgICA8ZGl2IGNsYXNzPVwid2VsbFwiIGRhdGEtYmluZD1cInZpc2libGU6JHJvb3QuaXNEZXNpZ25Nb2RlICYmIHF1ZXN0aW9ucy5sZW5ndGggPT0gMFwiPiAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDokcm9vdC5nZXRFZGl0b3JMb2NTdHJpbmcoXFwnc3VydmV5LmRyb3BRdWVzdGlvblxcJylcIj48L3NwYW4+ICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwic3ZkX2RyYWdvdmVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29EcmFnZ2luZ0JvdHRvbVwiPjwvZGl2PjwvZGl2Pic7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RlbXBsYXRlX3BhZ2UuaHRtbC50cyIsImV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCIgZGF0YS1iaW5kPVwic3R5bGU6IHtkaXNwbGF5OiBxdWVzdGlvbi5rb1Zpc2libGUoKXx8ICRyb290LmlzRGVzaWduTW9kZSA/IFxcJ2lubGluZS1ibG9ja1xcJzogXFwnbm9uZVxcJywgbWFyZ2luTGVmdDogcXVlc3Rpb24ua29NYXJnaW5MZWZ0LCBwYWRkaW5nUmlnaHQ6IHF1ZXN0aW9uLmtvUGFkZGluZ1JpZ2h0LCB3aWR0aDogcXVlc3Rpb24ua29SZW5kZXJXaWR0aCB9LCAgICAgIGF0dHIgOiB7aWQ6IGlkLCBkcmFnZ2FibGU6ICRyb290LmlzRGVzaWduTW9kZX0sIGNsaWNrOiAkcm9vdC5pc0Rlc2lnbk1vZGUgPyBrb09uQ2xpY2s6IG51bGwsICAgICAgICAgIGV2ZW50OnsgICAgICAgICAgIGRyYWdzdGFydDpmdW5jdGlvbihlbCwgZSl7IGRyYWdTdGFydChlKTsgcmV0dXJuIHRydWU7IH0sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IGRyYWdPdmVyKGUpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fSAgICAgICAgIH0sIGNzczp7c3ZkX3FfZGVzaWduX2JvcmRlcjogJHJvb3QuaXNEZXNpZ25Nb2RlLCBzdmRfcV9zZWxlY3RlZCA6IGtvSXNTZWxlY3RlZCwgXFwnd2VsbCB3ZWxsLXNtXFwnOiAkcm9vdC5pc0Rlc2lnbk1vZGV9XCI+ICAgIDxkaXYgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3BcIiBjbGFzcz1cInN2ZF9kcmFnb3ZlclwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNEcmFnZ2luZ1wiPjwvZGl2PiAgICA8ZGl2IGNsYXNzPVwic3ZkX3FfY29weWJ1dHRvblwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTZWxlY3RlZFwiPiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4teHNcIiBkYXRhLWJpbmQ9XCJjbGljazogJHJvb3QuY29weVF1ZXN0aW9uQ2xpY2ssIHRleHQ6JHJvb3QuZ2V0RWRpdG9yTG9jU3RyaW5nKFxcJ3N1cnZleS5jb3B5XFwnKVwiPjwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJjc3M6e3N2ZF9xX2Rlc2lnbjogJHJvb3QuaXNEZXNpZ25Nb2RlfVwiPiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvRXJyb3JzKCkubGVuZ3RoID4gMCwgZm9yZWFjaDoga29FcnJvcnNcIj4gICAgICAgICAgICA8ZGl2PiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YS5nZXRUZXh0KClcIj48L3NwYW4+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0ga28gaWY6IHF1ZXN0aW9uLmhhc1RpdGxlIC0tPiAgICAgICAgPGg1IGRhdGEtYmluZD1cInZpc2libGU6ICRyb290LnF1ZXN0aW9uVGl0bGVMb2NhdGlvbiA9PSBcXCd0b3BcXCcsIHRleHQ6IHF1ZXN0aW9uLmtvVGl0bGUoKSwgY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24udGl0bGVcIj48L2g1PiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvbi1cXCcgKyBxdWVzdGlvbi5nZXRUeXBlKCksIGRhdGE6IHF1ZXN0aW9uIH0gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzQ29tbWVudFwiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDpxdWVzdGlvbi5jb21tZW50VGV4dFwiPjwvZGl2PiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHRydWUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0ga28gaWY6IHF1ZXN0aW9uLmhhc1RpdGxlIC0tPiAgICAgICAgPGg1IGRhdGEtYmluZD1cInZpc2libGU6ICRyb290LnF1ZXN0aW9uVGl0bGVMb2NhdGlvbiA9PSBcXCdib3R0b21cXCcsIHRleHQ6IHF1ZXN0aW9uLmtvVGl0bGUoKSwgY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24udGl0bGVcIj48L2g1PiAgICAgICAgPCEtLSAva28gLS0+ICAgIDwvZGl2PjwvZGl2Pic7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3RlbXBsYXRlX3F1ZXN0aW9uLmh0bWwudHMiXSwic291cmNlUm9vdCI6IiJ9