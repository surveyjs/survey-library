(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"), require("survey-knockout"));
	else if(typeof define === 'function' && define.amd)
		define("SurveyEditor", ["knockout", "survey-knockout"], factory);
	else if(typeof exports === 'object')
		exports["SurveyEditor"] = factory(require("knockout"), require("survey-knockout"));
	else
		root["SurveyEditor"] = factory(root["ko"], root["Survey"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 71);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export __assign */
/* harmony export (immutable) */ __webpack_exports__["a"] = __extends;
var __assign = Object["assign"] || function (target) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                target[p] = s[p];
    }
    return target;
};
function __extends(thisClass, baseClass) {
    for (var p in baseClass)
        if (baseClass.hasOwnProperty(p))
            thisClass[p] = baseClass[p];
    function __() { this.constructor = thisClass; }
    thisClass.prototype = baseClass === null ? Object.create(baseClass) : (__.prototype = baseClass.prototype, new __());
}
;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return editorLocalization; });
/* unused harmony export defaultStrings */
var editorLocalization = {
    currentLocale: "",
    locales: {},
    getString: function (strName, locale) {
        if (locale === void 0) { locale = null; }
        if (!locale)
            locale = this.currentLocale;
        var loc = locale ? this.locales[this.currentLocale] : defaultStrings;
        if (!loc)
            loc = defaultStrings;
        var path = strName.split('.');
        var obj = loc;
        for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
            if (!obj) {
                if (loc === defaultStrings)
                    return path[i];
                return this.getString(strName, "en");
            }
        }
        return obj;
    },
    getPropertyName: function (strName, local) {
        if (local === void 0) { local = null; }
        var obj = this.getProperty(strName, local);
        if (obj["name"])
            return obj["name"];
        return obj;
    },
    getPropertyTitle: function (strName, local) {
        if (local === void 0) { local = null; }
        var obj = this.getProperty(strName, local);
        if (obj["title"])
            return obj["title"];
        return "";
    },
    getProperty: function (strName, local) {
        if (local === void 0) { local = null; }
        var obj = this.getString("p." + strName, local);
        if (obj !== strName)
            return obj;
        var pos = strName.indexOf('_');
        if (pos < -1)
            return obj;
        strName = strName.substr(pos + 1);
        return this.getString("p." + strName, local);
    },
    getLocales: function () {
        var res = [];
        res.push("");
        for (var key in this.locales) {
            res.push(key);
        }
        return res;
    }
};
var defaultStrings = {
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
        ok: "OK",
        cancel: "Cancel",
        reset: "Reset",
        close: "Close",
        delete: "Delete",
        addNew: "Add New",
        removeAll: "Remove All",
        edit: "Edit",
        empty: "<empty>",
        fastEntry: "Fast Entry",
        formEntry: "Form Entry",
        testService: "Test the service",
        expressionHelp: "Please enter a boolean expression. It should return true to keep the question/page visible. For example: {question1} = 'value1' or ({question2} = 3 and {question3} < 5)",
        value: "Value",
        text: "Text",
        required: "Required?",
        hasOther: "Has Other Item",
        name: "Name",
        title: "Title",
        cellType: "Cell Type",
        colCount: "Column Count",
        qEditorTitle: "Edit question: {0}",
        general: "General",
        fileOptions: "Options",
        html: "Html Editor",
        columns: "Columns",
        rows: "Rows",
        choices: "Choices",
        visibleIf: "Visible If",
        rateValues: "Rate Values",
        choicesByUrl: "Choices from Web",
        matrixChoices: "Default Choices",
        multipleTextItems: "Text Inputs",
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


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyEditorShowWindow; });
/* unused harmony export SurveyQuestionProperties */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyQuestionEditorBase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SurveyQuestionEditorTabBase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SurveyQuestionEditorTabGeneral; });
/* unused harmony export SurveyQuestionEditorTabProperty */





var SurveyPropertyEditorShowWindow = (function () {
    function SurveyPropertyEditorShowWindow() {
        this.koVisible = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](false);
        this.koEditor = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](null);
    }
    SurveyPropertyEditorShowWindow.prototype.show = function (questionBase, onChanged) {
        var editor = SurveyQuestionEditorBase.createEditor(questionBase, onChanged, this.onCanShowPropertyCallback);
        this.koEditor(editor);
        this.koVisible(true);
        var jQuery = window["jQuery"];
        jQuery("#surveyquestioneditorwindow").modal("show");
    };
    return SurveyPropertyEditorShowWindow;
}());

var SurveyQuestionProperties = (function () {
    function SurveyQuestionProperties(questionBase, onCanShowPropertyCallback) {
        this.questionBase = questionBase;
        this.onCanShowPropertyCallback = onCanShowPropertyCallback;
        this.properties = __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["JsonObject"].metaData.getProperties(this.questionBase.getType());
    }
    SurveyQuestionProperties.prototype.getProperty = function (propertyName) {
        var property = null;
        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].name == propertyName) {
                property = this.properties[i];
                break;
            }
        }
        if (property && this.onCanShowPropertyCallback) {
            if (!this.onCanShowPropertyCallback(this.questionBase, property))
                property = null;
        }
        return property;
    };
    return SurveyQuestionProperties;
}());

var SurveyQuestionEditorBase = (function () {
    function SurveyQuestionEditorBase(questionBase, onCanShowPropertyCallback) {
        this.questionBase = questionBase;
        this.onCanShowPropertyCallback = onCanShowPropertyCallback;
        var self = this;
        this.properties = new SurveyQuestionProperties(questionBase, onCanShowPropertyCallback);
        self.onApplyClick = function () { self.apply(); };
        self.onResetClick = function () { self.reset(); };
        this.onTabClick = function (tab) { self.koActiveTab(tab.name); };
        var tabs = this.buildTabs();
        this.koActiveTab = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](tabs[0].name);
        this.koTabs = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"](tabs);
        this.koTitle = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](__WEBPACK_IMPORTED_MODULE_3__editorLocalization__["a" /* editorLocalization */].getString("pe.qEditorTitle")["format"](this.questionBase.name));
    }
    SurveyQuestionEditorBase.registerEditor = function (name, creator) {
        SurveyQuestionEditorBase.editorRegisteredList[name] = creator;
    };
    SurveyQuestionEditorBase.createEditor = function (questionBase, onChanged, onCanShowPropertyCallback) {
        var className = questionBase.getType();
        var creator = SurveyQuestionEditorBase.editorRegisteredList[className];
        while (!creator && className) {
            //TODO findClass function was made public.
            var metaClass = __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["JsonObject"].metaData["findClass"](className);
            if (!metaClass)
                break;
            className = metaClass.parentName;
            if (className)
                creator = SurveyQuestionEditorBase.editorRegisteredList[className];
        }
        if (!creator)
            creator = SurveyQuestionEditorBase.editorRegisteredList[SurveyQuestionEditorBase.defaultEditor];
        var editor = creator(questionBase, onCanShowPropertyCallback);
        editor.onChanged = onChanged;
        return editor;
    };
    SurveyQuestionEditorBase.prototype.hasError = function () {
        var tabs = this.koTabs();
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].hasError())
                return true;
        }
        return false;
    };
    SurveyQuestionEditorBase.prototype.reset = function () {
        //TODO do nothing for now.
    };
    SurveyQuestionEditorBase.prototype.apply = function () {
        if (this.hasError())
            return;
        var tabs = this.koTabs();
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].apply();
        }
        this.koTitle(__WEBPACK_IMPORTED_MODULE_3__editorLocalization__["a" /* editorLocalization */].getString("pe.qEditorTitle")["format"](this.questionBase.name));
        if (this.onChanged) {
            this.onChanged(this.questionBase);
        }
    };
    SurveyQuestionEditorBase.prototype.buildTabs = function () {
        var tabs = [];
        this.addTabs(tabs);
        this.addPropertiesTabs(tabs);
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onCanShowPropertyCallback = this.onCanShowPropertyCallback;
        }
        tabs.sort(function (a, b) { return a.visibleIndex < b.visibleIndex ? -1 : (a.visibleIndex > b.visibleIndex ? 1 : 0); });
        return tabs;
    };
    SurveyQuestionEditorBase.prototype.addTabs = function (tabs) {
        tabs.push(this.createGeneralTab());
    };
    SurveyQuestionEditorBase.prototype.createGeneralTab = function () { return new SurveyQuestionEditorTabGeneral(this.questionBase, 0, this.properties); };
    SurveyQuestionEditorBase.prototype.addPropertiesTabs = function (tabs) {
        var propTabs = [];
        this.getPropertiesTabs(propTabs);
        for (var i = 0; i < propTabs.length; i++) {
            var tabItem = propTabs[i];
            if (!this.properties.getProperty(tabItem.propertyName))
                continue;
            var editorTab = new SurveyQuestionEditorTabProperty(this.questionBase, tabItem.propertyName, tabItem.visibleIndex, this.properties);
            if (tabItem.title)
                editorTab.title = tabItem.title;
            tabs.push(editorTab);
        }
    };
    SurveyQuestionEditorBase.prototype.getPropertiesTabs = function (propTabs) {
        propTabs.push({ propertyName: "visibleIf", visibleIndex: 100 });
    };
    return SurveyQuestionEditorBase;
}());

SurveyQuestionEditorBase.defaultEditor = "questionbase";
SurveyQuestionEditorBase.editorRegisteredList = {};
var SurveyQuestionEditorTabBase = (function () {
    function SurveyQuestionEditorTabBase(questionBase, visibleIndex, properties) {
        this.questionBase = questionBase;
        this.visibleIndex = visibleIndex;
        if (!properties)
            properties = new SurveyQuestionProperties(questionBase, null);
        this.properties = properties;
    }
    Object.defineProperty(SurveyQuestionEditorTabBase.prototype, "name", {
        get: function () { return "name"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabBase.prototype, "title", {
        get: function () {
            if (this.titleValue)
                return this.titleValue;
            var str = __WEBPACK_IMPORTED_MODULE_3__editorLocalization__["a" /* editorLocalization */].getString("pe." + this.name);
            return str ? str : this.name;
        },
        set: function (value) { this.titleValue = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabBase.prototype, "htmlTemplate", {
        get: function () { return "questioneditortab-" + this.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabBase.prototype, "templateObject", {
        get: function () { return this; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorTabBase.prototype.hasError = function () { return false; };
    SurveyQuestionEditorTabBase.prototype.reset = function () { };
    SurveyQuestionEditorTabBase.prototype.apply = function () { };
    SurveyQuestionEditorTabBase.prototype.getValue = function (property) {
        if (property.hasToUseGetValue)
            return property.getValue(this.questionBase);
        return this.questionBase[property.name];
    };
    return SurveyQuestionEditorTabBase;
}());

var SurveyQuestionEditorTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorTabGeneral, _super);
    function SurveyQuestionEditorTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        _this.setUpProperties();
        _this.reset();
        return _this;
    }
    SurveyQuestionEditorTabGeneral.prototype.setUpProperties = function () {
        this.titleProperty = this.properties.getProperty("title");
        this.hasTitle = this.titleProperty != null;
        this.hasVisible = this.properties.getProperty("visible") != null;
        this.hasIsRequired = this.properties.getProperty("isRequired") != null;
        this.hasStartWithNewLine = this.properties.getProperty("startWithNewLine") != null;
        this.koName = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        this.koTitle = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        this.koVisible = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        this.koIsRequired = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        this.koStartWithNewLine = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
    };
    Object.defineProperty(SurveyQuestionEditorTabGeneral.prototype, "name", {
        get: function () { return "general"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabGeneral.prototype, "hasAdditionalTemplate", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return ""; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorTabGeneral.prototype.hasError = function () { return !this.koName(); };
    SurveyQuestionEditorTabGeneral.prototype.reset = function () {
        this.koName(this.questionBase.name);
        if (this.hasTitle)
            this.koTitle(this.getValue(this.titleProperty));
        if (this.hasVisible)
            this.koVisible(this.questionBase.visible);
        if (this.hasIsRequired)
            this.koIsRequired(this.questionBase.isRequired);
        if (this.hasStartWithNewLine)
            this.koStartWithNewLine(this.questionBase.startWithNewLine);
    };
    SurveyQuestionEditorTabGeneral.prototype.apply = function () {
        this.questionBase.name = this.koName();
        if (this.hasTitle)
            this.questionBase.title = this.koTitle();
        if (this.hasVisible)
            this.questionBase.visible = this.koVisible();
        if (this.hasIsRequired)
            this.questionBase.isRequired = this.koIsRequired();
        if (this.hasStartWithNewLine)
            this.questionBase.startWithNewLine = this.koStartWithNewLine();
    };
    return SurveyQuestionEditorTabGeneral;
}(SurveyQuestionEditorTabBase));

var SurveyQuestionEditorTabProperty = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorTabProperty, _super);
    function SurveyQuestionEditorTabProperty(questionBase, propertyName, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.propertyName = propertyName;
        _this.visibleIndex = visibleIndex;
        _this.propertyValue = _this.properties.getProperty(propertyName);
        _this.propertyEditorValue = __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__["a" /* SurveyPropertyEditorBase */].createEditor(_this.property.type, null);
        _this.propertyEditorValue.value = _this.getValue(_this.property);
        return _this;
    }
    Object.defineProperty(SurveyQuestionEditorTabProperty.prototype, "name", {
        get: function () { return this.propertyName; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorTabProperty.prototype.hasError = function () { return this.propertyEditor.hasError(); };
    Object.defineProperty(SurveyQuestionEditorTabProperty.prototype, "htmlTemplate", {
        get: function () { return "propertyeditorcontent-" + this.property.type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabProperty.prototype, "templateObject", {
        get: function () { return this.propertyEditor; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabProperty.prototype, "property", {
        get: function () { return this.propertyValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTabProperty.prototype, "propertyEditor", {
        get: function () { return this.propertyEditorValue; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorTabProperty.prototype.reset = function () {
        this.propertyEditorValue.value = this.getValue(this.property);
    };
    SurveyQuestionEditorTabProperty.prototype.apply = function () {
        this.propertyEditor.apply();
        this.questionBase[this.propertyName] = this.propertyEditorValue.value;
    };
    return SurveyQuestionEditorTabProperty;
}(SurveyQuestionEditorTabBase));

SurveyQuestionEditorBase.registerEditor("questionbase", function (question, onCanShowPropertyCallback) { return new SurveyQuestionEditorBase(question, onCanShowPropertyCallback); });


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyEditorBase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyStringPropertyEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SurveyDropdownPropertyEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SurveyBooleanPropertyEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SurveyNumberPropertyEditor; });

var SurveyPropertyEditorBase = (function () {
    function SurveyPropertyEditorBase() {
        this.value_ = null;
        this.options = null;
    }
    SurveyPropertyEditorBase.registerEditor = function (name, creator) {
        SurveyPropertyEditorBase.editorRegisteredList[name] = creator;
    };
    SurveyPropertyEditorBase.createEditor = function (editorType, func) {
        var creator = SurveyPropertyEditorBase.editorRegisteredList[editorType];
        if (!creator)
            creator = SurveyPropertyEditorBase.editorRegisteredList[SurveyPropertyEditorBase.defaultEditor];
        var propertyEditor = creator();
        propertyEditor.onChanged = func;
        return propertyEditor;
    };
    Object.defineProperty(SurveyPropertyEditorBase.prototype, "editorType", {
        get: function () { throw "editorType is not defined"; },
        enumerable: true,
        configurable: true
    });
    SurveyPropertyEditorBase.prototype.getValueText = function (value) { return value; };
    Object.defineProperty(SurveyPropertyEditorBase.prototype, "value", {
        get: function () { return this.value_; },
        set: function (value) {
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
    SurveyPropertyEditorBase.prototype.setTitle = function (value) { };
    SurveyPropertyEditorBase.prototype.setObject = function (value) { };
    SurveyPropertyEditorBase.prototype.onValueChanged = function () {
    };
    SurveyPropertyEditorBase.prototype.getCorrectedValue = function (value) { return value; };
    return SurveyPropertyEditorBase;
}());

SurveyPropertyEditorBase.defaultEditor = "string";
SurveyPropertyEditorBase.editorRegisteredList = {};
var SurveyStringPropertyEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyStringPropertyEditor, _super);
    function SurveyStringPropertyEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyStringPropertyEditor.prototype, "editorType", {
        get: function () { return "string"; },
        enumerable: true,
        configurable: true
    });
    return SurveyStringPropertyEditor;
}(SurveyPropertyEditorBase));

var SurveyDropdownPropertyEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyDropdownPropertyEditor, _super);
    function SurveyDropdownPropertyEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyDropdownPropertyEditor.prototype, "editorType", {
        get: function () { return "dropdown"; },
        enumerable: true,
        configurable: true
    });
    return SurveyDropdownPropertyEditor;
}(SurveyPropertyEditorBase));

var SurveyBooleanPropertyEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyBooleanPropertyEditor, _super);
    function SurveyBooleanPropertyEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyBooleanPropertyEditor.prototype, "editorType", {
        get: function () { return "boolean"; },
        enumerable: true,
        configurable: true
    });
    return SurveyBooleanPropertyEditor;
}(SurveyPropertyEditorBase));

var SurveyNumberPropertyEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyNumberPropertyEditor, _super);
    function SurveyNumberPropertyEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyNumberPropertyEditor.prototype, "editorType", {
        get: function () { return "number"; },
        enumerable: true,
        configurable: true
    });
    return SurveyNumberPropertyEditor;
}(SurveyPropertyEditorBase));

SurveyPropertyEditorBase.registerEditor("string", function () { return new SurveyStringPropertyEditor(); });
SurveyPropertyEditorBase.registerEditor("dropdown", function () { return new SurveyDropdownPropertyEditor(); });
SurveyPropertyEditorBase.registerEditor("boolean", function () { return new SurveyBooleanPropertyEditor(); });
SurveyPropertyEditorBase.registerEditor("number", function () { return new SurveyNumberPropertyEditor(); });


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyModalEditor__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__editorLocalization__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyItemsEditor; });




var SurveyPropertyItemsEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyItemsEditor, _super);
    function SurveyPropertyItemsEditor() {
        var _this = _super.call(this) || this;
        _this.koItems = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"]();
        _this.value = [];
        var self = _this;
        self.onDeleteClick = function (item) { self.koItems.remove(item); };
        self.onClearClick = function (item) { self.koItems.removeAll(); };
        self.onAddClick = function () { self.AddItem(); };
        self.onMoveUpClick = function (item) { self.moveUp(item); };
        self.onMoveDownClick = function (item) { self.moveDown(item); };
        return _this;
    }
    SurveyPropertyItemsEditor.prototype.getValueText = function (value) {
        var len = value ? value.length : 0;
        return __WEBPACK_IMPORTED_MODULE_3__editorLocalization__["a" /* editorLocalization */].getString("pe.items")["format"](len);
    };
    SurveyPropertyItemsEditor.prototype.getCorrectedValue = function (value) {
        if (value == null || !Array.isArray(value))
            value = [];
        return value;
    };
    SurveyPropertyItemsEditor.prototype.AddItem = function () {
        this.koItems.push(this.createNewEditorItem());
    };
    SurveyPropertyItemsEditor.prototype.moveUp = function (item) {
        var arr = this.koItems();
        var index = arr.indexOf(item);
        if (index < 1)
            return;
        arr[index] = arr[index - 1];
        arr[index - 1] = item;
        this.koItems(arr);
    };
    SurveyPropertyItemsEditor.prototype.moveDown = function (item) {
        var arr = this.koItems();
        var index = arr.indexOf(item);
        if (index < 0 || index >= arr.length - 1)
            return;
        arr[index] = arr[index + 1];
        arr[index + 1] = item;
        this.koItems(arr);
    };
    SurveyPropertyItemsEditor.prototype.onValueChanged = function () {
        this.koItems(this.getItemsFromValue());
    };
    SurveyPropertyItemsEditor.prototype.getItemsFromValue = function (value) {
        if (value === void 0) { value = null; }
        var items = [];
        if (!value)
            value = this.value;
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
    SurveyPropertyItemsEditor.prototype.createNewEditorItem = function () { throw "Override 'createNewEditorItem' method"; };
    SurveyPropertyItemsEditor.prototype.createEditorItem = function (item) { return item; };
    SurveyPropertyItemsEditor.prototype.createItemFromEditorItem = function (editorItem) { return editorItem; };
    return SurveyPropertyItemsEditor;
}(__WEBPACK_IMPORTED_MODULE_2__propertyModalEditor__["a" /* SurveyPropertyModalEditor */]));



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__editorLocalization__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyHelper; });

var ObjType;
(function (ObjType) {
    ObjType[ObjType["Unknown"] = 0] = "Unknown";
    ObjType[ObjType["Survey"] = 1] = "Survey";
    ObjType[ObjType["Page"] = 2] = "Page";
    ObjType[ObjType["Question"] = 3] = "Question";
})(ObjType || (ObjType = {}));
var SurveyHelper = (function () {
    function SurveyHelper() {
    }
    SurveyHelper.getNewPageName = function (objs) {
        return SurveyHelper.getNewName(objs, __WEBPACK_IMPORTED_MODULE_0__editorLocalization__["a" /* editorLocalization */].getString("ed.newPageName"));
    };
    SurveyHelper.getNewQuestionName = function (objs) {
        return SurveyHelper.getNewName(objs, __WEBPACK_IMPORTED_MODULE_0__editorLocalization__["a" /* editorLocalization */].getString("ed.newQuestionName"));
    };
    SurveyHelper.getNewName = function (objs, baseName) {
        var hash = {};
        for (var i = 0; i < objs.length; i++) {
            hash[objs[i].name] = true;
        }
        var num = 1;
        while (true) {
            if (!hash[baseName + num.toString()])
                break;
            num++;
        }
        return baseName + num.toString();
    };
    SurveyHelper.getObjectType = function (obj) {
        if (!obj || !obj["getType"])
            return ObjType.Unknown;
        if (obj.getType() == "page")
            return ObjType.Page;
        if (obj.getType() == "survey")
            return ObjType.Survey;
        if (obj["name"])
            return ObjType.Question;
        return ObjType.Unknown;
    };
    SurveyHelper.getObjectName = function (obj) {
        if (obj["name"])
            return obj["name"];
        var objType = SurveyHelper.getObjectType(obj);
        if (objType != ObjType.Page)
            return "";
        var data = obj.data;
        var index = data.pages.indexOf(obj);
        return "[Page " + (index + 1) + "]";
    };
    return SurveyHelper;
}());



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__objectProperty__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyObjectEditor; });




var SurveyObjectEditor = (function () {
    function SurveyObjectEditor(propertyEditorOptions) {
        if (propertyEditorOptions === void 0) { propertyEditorOptions = null; }
        this.propertyEditorOptions = null;
        this.onPropertyValueChanged = new __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["Event"]();
        this.setOptions(propertyEditorOptions);
        this.koProperties = __WEBPACK_IMPORTED_MODULE_0_knockout__["observableArray"]();
        this.koActiveProperty = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
        this.koHasObject = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
    }
    Object.defineProperty(SurveyObjectEditor.prototype, "selectedObject", {
        get: function () { return this.selectedObjectValue; },
        set: function (value) {
            if (this.selectedObjectValue == value)
                return;
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
            if (properties[i].name == name)
                return properties[i];
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
        var properties = __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.getProperties(this.selectedObject.getType());
        properties.sort(function (a, b) {
            if (a.name == b.name)
                return 0;
            if (a.name > b.name)
                return 1;
            return -1;
        });
        var objectProperties = [];
        var self = this;
        var propEvent = function (property, newValue) {
            self.onPropertyValueChanged.fire(_this, { property: property.property, object: property.object, newValue: newValue });
        };
        for (var i = 0; i < properties.length; i++) {
            if (!this.canShowProperty(properties[i]))
                continue;
            var objectProperty = new __WEBPACK_IMPORTED_MODULE_1__objectProperty__["a" /* SurveyObjectProperty */](properties[i], propEvent, this.propertyEditorOptions);
            var locName = this.selectedObject.getType() + '_' + properties[i].name;
            objectProperty.displayName = __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getPropertyName(locName);
            var title = __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getPropertyTitle(locName);
            if (!title)
                title = objectProperty.displayName;
            objectProperty.title = title;
            objectProperties.push(objectProperty);
        }
        this.koProperties(objectProperties);
        this.koActiveProperty(this.getPropertyEditor("name"));
    };
    SurveyObjectEditor.prototype.canShowProperty = function (property) {
        var name = property.name;
        if (name == 'questions' || name == 'pages')
            return false;
        if (this.onCanShowPropertyCallback)
            return this.onCanShowPropertyCallback(this.selectedObject, property);
        return true;
    };
    SurveyObjectEditor.prototype.updatePropertiesObject = function () {
        var properties = this.koProperties();
        for (var i = 0; i < properties.length; i++) {
            properties[i].object = this.selectedObject;
        }
    };
    return SurveyObjectEditor;
}());



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyModalEditor; });
/* unused harmony export SurveyPropertyTextEditor */
/* unused harmony export SurveyPropertyHtmlEditor */
/* unused harmony export SurveyPropertyExpressionEditor */



var SurveyPropertyModalEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyModalEditor, _super);
    function SurveyPropertyModalEditor() {
        var _this = _super.call(this) || this;
        _this.title = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        var self = _this;
        self.onApplyClick = function () { self.apply(); };
        self.onResetClick = function () { self.reset(); };
        return _this;
    }
    SurveyPropertyModalEditor.prototype.setTitle = function (value) { this.title(value); };
    SurveyPropertyModalEditor.prototype.hasError = function () { return false; };
    SurveyPropertyModalEditor.prototype.onBeforeApply = function () { };
    SurveyPropertyModalEditor.prototype.reset = function () {
        this.value = this.value;
    };
    SurveyPropertyModalEditor.prototype.setObject = function (value) { this.object = value; };
    Object.defineProperty(SurveyPropertyModalEditor.prototype, "isEditable", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    SurveyPropertyModalEditor.prototype.apply = function () {
        if (this.hasError())
            return;
        this.onBeforeApply();
        if (this.onChanged) {
            this.onChanged(this.value);
        }
    };
    return SurveyPropertyModalEditor;
}(__WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__["a" /* SurveyPropertyEditorBase */]));

var SurveyPropertyTextEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyTextEditor, _super);
    function SurveyPropertyTextEditor() {
        var _this = _super.call(this) || this;
        _this.koValue = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        return _this;
    }
    Object.defineProperty(SurveyPropertyTextEditor.prototype, "editorType", {
        get: function () { return "text"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyPropertyTextEditor.prototype, "isEditable", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    SurveyPropertyTextEditor.prototype.getValueText = function (value) {
        if (!value)
            return null;
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
}(SurveyPropertyModalEditor));

var SurveyPropertyHtmlEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyHtmlEditor, _super);
    function SurveyPropertyHtmlEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyPropertyHtmlEditor.prototype, "editorType", {
        get: function () { return "html"; },
        enumerable: true,
        configurable: true
    });
    return SurveyPropertyHtmlEditor;
}(SurveyPropertyTextEditor));

var SurveyPropertyExpressionEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyExpressionEditor, _super);
    function SurveyPropertyExpressionEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyPropertyExpressionEditor.prototype, "editorType", {
        get: function () { return "expression"; },
        enumerable: true,
        configurable: true
    });
    return SurveyPropertyExpressionEditor;
}(SurveyPropertyTextEditor));

__WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("text", function () { return new SurveyPropertyTextEditor(); });
__WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("html", function () { return new SurveyPropertyHtmlEditor(); });
__WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("expression", function () { return new SurveyPropertyExpressionEditor(); });


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__json5__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyTextWorker; });


var TextParserPropery = (function () {
    function TextParserPropery() {
    }
    return TextParserPropery;
}());
var SurveyTextWorker = (function () {
    function SurveyTextWorker(text) {
        this.text = text;
        if (!this.text || this.text.trim() == "") {
            this.text = "{}";
        }
        this.errors = [];
        this.process();
    }
    Object.defineProperty(SurveyTextWorker.prototype, "survey", {
        get: function () { return this.surveyValue; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyTextWorker.prototype, "isJsonCorrect", {
        get: function () { return this.surveyValue != null; },
        enumerable: true,
        configurable: true
    });
    SurveyTextWorker.prototype.process = function () {
        try {
            this.jsonValue = new __WEBPACK_IMPORTED_MODULE_0__json5__["a" /* SurveyJSON5 */](1).parse(this.text);
        }
        catch (error) {
            this.errors.push({ pos: { start: error.at, end: -1 }, text: error.message });
        }
        if (this.jsonValue != null) {
            this.updateJsonPositions(this.jsonValue);
            this.surveyValue = new __WEBPACK_IMPORTED_MODULE_1_survey_knockout__["Survey"](this.jsonValue);
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
        if (this.surveyValue == null)
            return result;
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
        if (objects == null || objects.length == 0)
            return;
        var position = { row: 0, column: 0 };
        var atObjectsArray = this.getAtArray(objects);
        var startAt = 0;
        for (var i = 0; i < atObjectsArray.length; i++) {
            var at = atObjectsArray[i].at;
            position = this.getPostionByChartAt(position, startAt, at);
            var obj = atObjectsArray[i].obj;
            if (!obj.position)
                obj.position = {};
            if (at == obj.pos.start) {
                obj.position.start = position;
            }
            else {
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
            }
            else {
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
            if (!pos)
                continue;
            result.push({ at: pos.start, obj: obj });
            if (pos.end > 0) {
                result.push({ at: pos.end, obj: obj });
            }
        }
        return result.sort(function (el1, el2) {
            if (el1.at > el2.at)
                return 1;
            if (el1.at < el2.at)
                return -1;
            return 0;
        });
    };
    return SurveyTextWorker;
}());



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyJSON5; });
// This file is based on JSON5, http://json5.org/
// The modification for getting object and properties location 'at' were maden.
var SurveyJSON5 = (function () {
    function SurveyJSON5(parseType) {
        if (parseType === void 0) { parseType = 0; }
        this.parseType = parseType;
    }
    SurveyJSON5.prototype.parse = function (source, reviver, startFrom, endAt) {
        if (reviver === void 0) { reviver = null; }
        if (startFrom === void 0) { startFrom = 0; }
        if (endAt === void 0) { endAt = -1; }
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
        return typeof reviver === 'function' ? (function walk(holder, key) {
            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        }
                        else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }({ '': result }, '')) : result;
    };
    SurveyJSON5.prototype.error = function (m) {
        // Call error when something is wrong.
        var error = new SyntaxError();
        error.message = m;
        error["at"] = this.at;
        throw error;
    };
    SurveyJSON5.prototype.next = function (c) {
        if (c === void 0) { c = null; }
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
        if (this.endAt > -1 && this.at >= this.endAt)
            return '';
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
        if ((this.ch !== '_' && this.ch !== '$') &&
            (this.ch < 'a' || this.ch > 'z') &&
            (this.ch < 'A' || this.ch > 'Z')) {
            this.error("Bad identifier");
        }
        // Subsequent characters can contain digits.
        while (this.next() && (this.ch === '_' || this.ch === '$' ||
            (this.ch >= 'a' && this.ch <= 'z') ||
            (this.ch >= 'A' && this.ch <= 'Z') ||
            (this.ch >= '0' && this.ch <= '9'))) {
            key += this.ch;
        }
        return key;
    };
    SurveyJSON5.prototype.number = function () {
        // Parse a number value.
        var number, sign = '', string = '', base = 10;
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
            return (sign === '-') ? -number : number;
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
            }
            else if (this.ch >= '0' && this.ch <= '9') {
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
        }
        else {
            number = +string;
        }
        if (!isFinite(number)) {
            this.error("Bad number");
        }
        else {
            return number;
        }
    };
    SurveyJSON5.prototype.string = function () {
        // Parse a string value.
        var hex, i, string = '', delim, // double quote or single quote
        uffff;
        // When parsing for string values, we must look for ' or " and \ characters.
        if (this.ch === '"' || this.ch === "'") {
            delim = this.ch;
            while (this.next()) {
                if (this.ch === delim) {
                    this.next();
                    return string;
                }
                else if (this.ch === '\\') {
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
                    }
                    else if (this.ch === '\r') {
                        if (this.peek() === '\n') {
                            this.next();
                        }
                    }
                    else if (typeof SurveyJSON5.escapee[this.ch] === 'string') {
                        string += SurveyJSON5.escapee[this.ch];
                    }
                    else {
                        break;
                    }
                }
                else if (this.ch === '\n') {
                    // unescaped newlines are invalid; see:
                    // https://github.com/aseemk/json5/issues/24
                    // TODO this feels special-cased; are there other
                    // invalid unescaped chars?
                    break;
                }
                else {
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
        }
        else if (this.ch === '*') {
            this.blockComment();
        }
        else {
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
            }
            else if (SurveyJSON5.ws.indexOf(this.ch) >= 0) {
                this.next();
            }
            else {
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
                }
                else {
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
        var key, start, isFirstProperty = true, object = {};
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
                }
                else {
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
        if (replacer === void 0) { replacer = null; }
        if (space === void 0) { space = null; }
        if (replacer && (typeof (replacer) !== "function" && !this.isArray(replacer))) {
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
            }
            else if (typeof space === "number" && space >= 0) {
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
        if (typeof (this.replacer) === "function") {
            return this.replacer.call(holder, key, value);
        }
        else if (this.replacer) {
            if (isTopLevel || this.isArray(holder) || this.replacer.indexOf(key) >= 0) {
                return value;
            }
            else {
                return undefined;
            }
        }
        else {
            return value;
        }
    };
    SurveyJSON5.prototype.isWordChar = function (char) {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            (char >= '0' && char <= '9') ||
            char === '_' || char === '$';
    };
    SurveyJSON5.prototype.isWordStart = function (char) {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            char === '_' || char === '$';
    };
    SurveyJSON5.prototype.isWord = function (key) {
        if (typeof key !== 'string') {
            return false;
        }
        if (!this.isWordStart(key[0])) {
            return false;
        }
        var i = 1, length = key.length;
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
        }
        else {
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
        if (noNewLine === void 0) { noNewLine = false; }
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
            return typeof c === 'string' ?
                c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
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
        switch (typeof obj_part) {
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
                }
                else if (this.isArray(obj_part)) {
                    this.checkForCircular(obj_part);
                    buffer = "[";
                    this.objStack.push(obj_part);
                    for (var i = 0; i < obj_part.length; i++) {
                        res = this.internalStringify(obj_part, i, false);
                        buffer += this.makeIndent(this.indentStr, this.objStack.length);
                        if (res === null || typeof res === "undefined") {
                            buffer += "null";
                        }
                        else {
                            buffer += res;
                        }
                        if (i < obj_part.length - 1) {
                            buffer += ",";
                        }
                        else if (this.indentStr) {
                            buffer += "\n";
                        }
                    }
                    this.objStack.pop();
                    buffer += this.makeIndent(this.indentStr, this.objStack.length, true) + "]";
                }
                else {
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
                    }
                    else {
                        buffer = '{}';
                    }
                }
                return buffer;
            default:
                // functions and undefined should be ignored
                return undefined;
        }
    };
    return SurveyJSON5;
}());

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
SurveyJSON5.ws = [
    ' ',
    '\t',
    '\r',
    '\n',
    '\v',
    '\f',
    '\xA0',
    '\uFEFF'
];
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


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DragDropHelper; });

var DragDropHelper = (function () {
    function DragDropHelper(data, onModifiedCallback, scrollableElName) {
        if (scrollableElName === void 0) { scrollableElName = null; }
        this.data = data;
        this.scrollableElement = null;
        this.sourceIndex = -1;
        this.isScrollStop = true;
        this.onModifiedCallback = onModifiedCallback;
        this.scrollableElement = document.getElementById((scrollableElName ? scrollableElName : "scrollableDiv"));
    }
    Object.defineProperty(DragDropHelper.prototype, "survey", {
        get: function () { return this.data; },
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
        if (!event)
            return false;
        var data = this.getData(event).text;
        return data && data.indexOf(DragDropHelper.dataStart) == 0;
    };
    DragDropHelper.prototype.doDragDropOver = function (event, question) {
        event = this.getEvent(event);
        this.checkScrollY(event);
        var targetQuestion = DragDropHelper.dragData.targetQuestion;
        if (!question || question == targetQuestion || !this.isSurveyDragging(event) || this.isSamePlace(event, question))
            return;
        var index = this.getQuestionIndex(event, question);
        if (this.sourceIndex > -1) {
            if (this.sourceIndex == index || this.sourceIndex + 1 == index)
                index = -1;
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
        if (question === void 0) { question = null; }
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
        if (!this.scrollableElement)
            return;
        if (event.clientX <= 0 || event.clientY <= 0 ||
            event.clientX >= this.scrollableElement.offsetWidth || event.clientY >= this.scrollableElement.offsetHeight) {
            this.survey.currentPage["koDragging"](-1);
        }
    };
    DragDropHelper.prototype.createTargetQuestion = function (questionType, questionName, json) {
        if (!questionName)
            return null;
        var targetQuestion = this.survey.getQuestionByName(questionName);
        this.sourceIndex = -1;
        if (targetQuestion) {
            this.sourceIndex = this.survey.currentPage.questions.indexOf(targetQuestion);
        }
        if (!targetQuestion) {
            if (json) {
                targetQuestion = __WEBPACK_IMPORTED_MODULE_0_survey_knockout__["QuestionFactory"].Instance.createQuestion(json["type"], name);
                new __WEBPACK_IMPORTED_MODULE_0_survey_knockout__["JsonObject"]().toObject(json, targetQuestion);
                targetQuestion.name = questionName;
            }
            if (!targetQuestion && questionType) {
                targetQuestion = __WEBPACK_IMPORTED_MODULE_0_survey_knockout__["QuestionFactory"].Instance.createQuestion(questionType, questionName);
            }
            targetQuestion.setData(this.survey);
            targetQuestion.renderWidth = "100%";
        }
        this.setIsDraggingSource(targetQuestion, true);
        return targetQuestion;
    };
    DragDropHelper.prototype.setIsDraggingSource = function (question, val) {
        if (question && question["koIsDraggingSource"])
            question["koIsDraggingSource"](val);
    };
    DragDropHelper.prototype.getQuestionIndex = function (event, question) {
        var page = this.survey.currentPage;
        if (!question)
            return page.questions.length;
        var index = page.questions.indexOf(question);
        event = this.getEvent(event);
        var height = event.currentTarget["clientHeight"];
        var y = event.offsetY;
        if (event.hasOwnProperty('layerX')) {
            y = event.layerY - event.currentTarget["offsetTop"];
        }
        if (y > height / 2)
            index++;
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
        if (!this.scrollableElement)
            return;
        var y = this.getScrollableElementPosY(e);
        if (y < 0)
            return;
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
            setTimeout(function () { self.doScrollY(step); }, DragDropHelper.ScrollDelay);
        }
    };
    DragDropHelper.prototype.getScrollableElementPosY = function (e) {
        if (!this.scrollableElement || !e.currentTarget)
            return -1;
        return e.offsetY + e.currentTarget["offsetTop"] - this.scrollableElement.offsetTop - this.scrollableElement.scrollTop;
    };
    DragDropHelper.prototype.getEvent = function (event) {
        return event["originalEvent"] ? event["originalEvent"] : event;
    };
    DragDropHelper.prototype.moveQuestionTo = function (targetQuestion, index) {
        if (targetQuestion == null)
            return;
        var page = this.survey.getPageByQuestion(targetQuestion);
        if (page == this.survey.currentPage && index == page.questions.indexOf(targetQuestion))
            return;
        if (page) {
            page.removeQuestion(targetQuestion);
        }
        this.survey.currentPage.addQuestion(targetQuestion, index);
        if (this.onModifiedCallback)
            this.onModifiedCallback();
    };
    DragDropHelper.prototype.getDataInfo = function (event) {
        var data = this.getData(event);
        if (!data)
            return null;
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
            result += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return result;
    };
    DragDropHelper.prototype.prepareData = function (event, questionType, questionName, json) {
        if (json === void 0) { json = null; }
        var str = DragDropHelper.dataStart;
        if (questionType)
            str += "questiontype:" + questionType + ',';
        str += "questionname:" + questionName;
        this.setData(event, str, json);
        var targetQuestion = this.createTargetQuestion(questionType, questionName, json);
        DragDropHelper.dragData.targetQuestion = targetQuestion;
        this.survey["koDraggingSource"](targetQuestion);
    };
    DragDropHelper.prototype.setData = function (event, text, json) {
        if (json === void 0) { json = null; }
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
    return DragDropHelper;
}());

DragDropHelper.dataStart = "surveyjs,";
DragDropHelper.dragData = { text: "", json: null };
DragDropHelper.prevEvent = { question: null, x: -1, y: -1 };
DragDropHelper.ScrollDelay = 30;
DragDropHelper.ScrollOffset = 100;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__propertyEditors_propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editorLocalization__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyObjectProperty; });



var SurveyObjectProperty = (function () {
    function SurveyObjectProperty(property, onPropertyChanged, propertyEditorOptions) {
        if (onPropertyChanged === void 0) { onPropertyChanged = null; }
        if (propertyEditorOptions === void 0) { propertyEditorOptions = null; }
        this.property = property;
        this.isApplyingNewValue = false;
        this.onPropertyChanged = onPropertyChanged;
        this.name = this.property.name;
        this.koValue = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
        this.choices = property.choices;
        var self = this;
        this.editorType = property.type;
        //TODO
        if (this.choices != null) {
            this.editorType = "dropdown";
        }
        var onItemChanged = function (newValue) { self.onApplyEditorValue(newValue); };
        this.editor = __WEBPACK_IMPORTED_MODULE_1__propertyEditors_propertyEditorBase__["a" /* SurveyPropertyEditorBase */].createEditor(this.editorType, onItemChanged);
        this.editor.options = propertyEditorOptions;
        this.editorType = this.editor.editorType;
        this.modalName = "modelEditor" + this.editorType + this.name;
        this.modalNameTarget = "#" + this.modalName;
        this.koValue.subscribe(function (newValue) { self.onkoValueChanged(newValue); });
        this.koText = __WEBPACK_IMPORTED_MODULE_0_knockout__["computed"](function () { return self.getValueText(self.koValue()); });
        this.koIsDefault = __WEBPACK_IMPORTED_MODULE_0_knockout__["computed"](function () { return self.property.isDefaultValue(self.koValue()); });
    }
    Object.defineProperty(SurveyObjectProperty.prototype, "object", {
        get: function () { return this.objectValue; },
        set: function (value) {
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
        this.editor.setTitle(__WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getString("pe.editProperty")["format"](this.property.name));
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
        if (this.object == null)
            return;
        if (this.getValue() == newValue)
            return;
        if (this.onPropertyChanged != null && !this.isValueUpdating)
            this.onPropertyChanged(this, newValue);
    };
    SurveyObjectProperty.prototype.updateEditorData = function (newValue) {
        this.editor.value = newValue;
    };
    SurveyObjectProperty.prototype.getValue = function () {
        if (this.property.hasToUseGetValue)
            return this.property.getValue(this.object);
        return this.object[this.name];
    };
    SurveyObjectProperty.prototype.getValueText = function (value) { return this.editor.getValueText(value); };
    return SurveyObjectProperty;
}());



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__surveyHelper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyVerbs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyVerbItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return SurveyVerbChangeTypeItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SurveyVerbChangePageItem; });





var SurveyVerbs = (function () {
    function SurveyVerbs(onModifiedCallback) {
        this.onModifiedCallback = onModifiedCallback;
        this.koVerbs = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"]();
        this.koHasVerbs = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        var classes = __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["JsonObject"].metaData.getChildrenClasses("selectbase", true);
        this.choicesClasses = [];
        for (var i = 0; i < classes.length; i++) {
            this.choicesClasses.push(classes[i].name);
        }
    }
    Object.defineProperty(SurveyVerbs.prototype, "survey", {
        get: function () { return this.surveyValue; },
        set: function (value) {
            if (this.survey == value)
                return;
            this.surveyValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyVerbs.prototype, "obj", {
        get: function () { return this.objValue; },
        set: function (value) {
            if (this.objValue == value)
                return;
            this.objValue = value;
            this.buildVerbs();
        },
        enumerable: true,
        configurable: true
    });
    SurveyVerbs.prototype.buildVerbs = function () {
        var array = [];
        var objType = __WEBPACK_IMPORTED_MODULE_3__surveyHelper__["b" /* SurveyHelper */].getObjectType(this.obj);
        if (objType == __WEBPACK_IMPORTED_MODULE_3__surveyHelper__["a" /* ObjType */].Question) {
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
}());

var SurveyVerbItem = (function () {
    function SurveyVerbItem(survey, question, onModifiedCallback) {
        this.survey = survey;
        this.question = question;
        this.onModifiedCallback = onModifiedCallback;
        this.koItems = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"]();
        this.koSelectedItem = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
    }
    Object.defineProperty(SurveyVerbItem.prototype, "text", {
        get: function () { return ""; },
        enumerable: true,
        configurable: true
    });
    return SurveyVerbItem;
}());

var SurveyVerbChangeTypeItem = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyVerbChangeTypeItem, _super);
    function SurveyVerbChangeTypeItem(survey, question, onModifiedCallback) {
        var _this = _super.call(this, survey, question, onModifiedCallback) || this;
        _this.survey = survey;
        _this.question = question;
        _this.onModifiedCallback = onModifiedCallback;
        var classes = __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["JsonObject"].metaData.getChildrenClasses("selectbase", true);
        var array = [];
        for (var i = 0; i < classes.length; i++) {
            array.push({ value: classes[i].name, text: __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getString("qt." + classes[i].name) });
        }
        _this.koItems(array);
        _this.koSelectedItem(question.getType());
        var self = _this;
        _this.koSelectedItem.subscribe(function (newValue) { self.changeType(newValue); });
        return _this;
    }
    Object.defineProperty(SurveyVerbChangeTypeItem.prototype, "text", {
        get: function () { return __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getString("pe.verbChangeType"); },
        enumerable: true,
        configurable: true
    });
    SurveyVerbChangeTypeItem.prototype.changeType = function (questionType) {
        if (questionType == this.question.getType())
            return;
        var page = this.survey.getPageByQuestion(this.question);
        var index = page.questions.indexOf(this.question);
        var newQuestion = __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["QuestionFactory"].Instance.createQuestion(questionType, this.question.name);
        var jsonObj = new __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["JsonObject"]();
        var json = jsonObj.toJsonObject(this.question);
        jsonObj.toObject(json, newQuestion);
        page.removeQuestion(this.question);
        page.addQuestion(newQuestion, index);
        if (this.onModifiedCallback)
            this.onModifiedCallback();
    };
    return SurveyVerbChangeTypeItem;
}(SurveyVerbItem));

var SurveyVerbChangePageItem = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyVerbChangePageItem, _super);
    function SurveyVerbChangePageItem(survey, question, onModifiedCallback) {
        var _this = _super.call(this, survey, question, onModifiedCallback) || this;
        _this.survey = survey;
        _this.question = question;
        _this.onModifiedCallback = onModifiedCallback;
        var array = [];
        for (var i = 0; i < _this.survey.pages.length; i++) {
            var page = _this.survey.pages[i];
            array.push({ value: page, text: __WEBPACK_IMPORTED_MODULE_3__surveyHelper__["b" /* SurveyHelper */].getObjectName(page) });
        }
        _this.koItems(array);
        _this.prevPage = _this.survey.getPageByQuestion(question);
        _this.koSelectedItem(_this.prevPage);
        var self = _this;
        _this.koSelectedItem.subscribe(function (newValue) { self.changePage(newValue); });
        return _this;
    }
    Object.defineProperty(SurveyVerbChangePageItem.prototype, "text", {
        get: function () { return __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getString("pe.verbChangePage"); },
        enumerable: true,
        configurable: true
    });
    SurveyVerbChangePageItem.prototype.changePage = function (newPage) {
        if (newPage == null || newPage == this.prevPage)
            return;
        this.prevPage.removeQuestion(this.question);
        newPage.addQuestion(this.question);
        if (this.onModifiedCallback)
            this.onModifiedCallback();
    };
    return SurveyVerbChangePageItem;
}(SurveyVerbItem));



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__surveyHelper__ = __webpack_require__(7);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPagesEditor; });


var SurveyPagesEditor = (function () {
    function SurveyPagesEditor(onAddNewPageCallback, onSelectPageCallback, onMovePageCallback, onDeletePageCallback) {
        if (onAddNewPageCallback === void 0) { onAddNewPageCallback = null; }
        if (onSelectPageCallback === void 0) { onSelectPageCallback = null; }
        if (onMovePageCallback === void 0) { onMovePageCallback = null; }
        if (onDeletePageCallback === void 0) { onDeletePageCallback = null; }
        this.draggingPage = null;
        this.koPages = __WEBPACK_IMPORTED_MODULE_0_knockout__["observableArray"]();
        this.koIsValid = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
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
        this.keyDown = function (el, e) { self.onKeyDown(el, e); };
        this.dragStart = function (el) { self.draggingPage = el; };
        this.dragOver = function (el) { };
        this.dragEnd = function () { self.draggingPage = null; };
        this.dragDrop = function (el) { self.moveDraggingPageTo(el); };
    }
    Object.defineProperty(SurveyPagesEditor.prototype, "survey", {
        get: function () { return this.surveyValue; },
        set: function (value) {
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
            this.koPages()[index].title(__WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectName(page));
        }
    };
    SurveyPagesEditor.prototype.getIndexByPage = function (page) {
        var pages = this.koPages();
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].page == page)
                return i;
        }
        return -1;
    };
    SurveyPagesEditor.prototype.onKeyDown = function (el, e) {
        if (this.koPages().length <= 1)
            return;
        var pages = this.koPages();
        var pageIndex = -1;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].page && pages[i].koSelected()) {
                pageIndex = i;
            }
        }
        if (pageIndex < 0)
            return;
        if (e.keyCode == 46 && this.onDeletePageCallback)
            this.onDeletePageCallback(el.page);
        if ((e.keyCode == 37 || e.keyCode == 39) && this.onSelectPageCallback) {
            pageIndex += (e.keyCode == 37 ? -1 : 1);
            if (pageIndex < 0)
                pageIndex = pages.length - 1;
            if (pageIndex >= pages.length)
                pageIndex = 0;
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
                title: __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](__WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectName(page)), page: page, koSelected: __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false)
            });
        }
        this.koPages(pages);
    };
    SurveyPagesEditor.prototype.moveDraggingPageTo = function (toPage) {
        if (toPage == null || toPage == this.draggingPage) {
            this.draggingPage = null;
            return;
        }
        if (this.draggingPage == null)
            return;
        var index = this.koPages().indexOf(this.draggingPage);
        var indexTo = this.koPages().indexOf(toPage);
        if (this.onMovePageCallback) {
            this.onMovePageCallback(index, indexTo);
        }
    };
    return SurveyPagesEditor;
}());



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyItemValuesEditor; });





var SurveyPropertyItemValuesEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyItemValuesEditor, _super);
    function SurveyPropertyItemValuesEditor() {
        var _this = _super.call(this) || this;
        var self = _this;
        _this.koActiveView = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]("form");
        _this.koItemsText = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]("");
        _this.koActiveView.subscribe(function (newValue) {
            if (newValue == "form")
                self.updateItems(self.koItemsText());
            else
                self.koItemsText(self.getItemsText());
        });
        _this.changeToTextViewClick = function () { self.koActiveView("text"); };
        _this.changeToFormViewClick = function () { self.koActiveView("form"); };
        return _this;
    }
    Object.defineProperty(SurveyPropertyItemValuesEditor.prototype, "editorType", {
        get: function () { return "itemvalues"; },
        enumerable: true,
        configurable: true
    });
    SurveyPropertyItemValuesEditor.prototype.hasError = function () {
        var result = false;
        for (var i = 0; i < this.koItems().length; i++) {
            var item = this.koItems()[i];
            item.koHasError(this.isValueEmpty(item.koValue()));
            result = result || item.koHasError();
        }
        return result;
    };
    SurveyPropertyItemValuesEditor.prototype.createNewEditorItem = function () { return { koValue: __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](), koText: __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](), koHasError: __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](false) }; };
    SurveyPropertyItemValuesEditor.prototype.createEditorItem = function (item) {
        var itemValue = item;
        var itemText = null;
        if (item.value) {
            itemValue = item.value;
            itemText = item.text;
        }
        return { koValue: __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](itemValue), koText: __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](itemText), koHasError: __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](false) };
    };
    SurveyPropertyItemValuesEditor.prototype.createItemFromEditorItem = function (editorItem) {
        var alwaySaveTextInPropertyEditors = this.options && this.options.alwaySaveTextInPropertyEditors;
        var text = editorItem.koText();
        if (!alwaySaveTextInPropertyEditors && editorItem.koText() == editorItem.koValue()) {
            text = null;
        }
        return { value: editorItem.koValue(), text: text };
    };
    SurveyPropertyItemValuesEditor.prototype.onBeforeApply = function () {
        if (this.koActiveView() != "form") {
            this.updateItems(this.koItemsText());
        }
        _super.prototype.onBeforeApply.call(this);
    };
    SurveyPropertyItemValuesEditor.prototype.updateItems = function (text) {
        var items = [];
        if (text) {
            var texts = text.split("\n");
            for (var i = 0; i < texts.length; i++) {
                if (!texts[i])
                    continue;
                var valueItem = new __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["ItemValue"](texts[i]);
                var item = { value: valueItem.value, text: (valueItem.hasText ? valueItem.text : "") };
                items.push(item);
            }
        }
        this.koItems(this.getItemsFromValue(items));
    };
    SurveyPropertyItemValuesEditor.prototype.getItemsText = function () {
        var text = [];
        var items = this.koItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (this.isValueEmpty(item.koValue()))
                continue;
            var itemText = item.koValue();
            if (item.koText())
                itemText += __WEBPACK_IMPORTED_MODULE_4_survey_knockout__["ItemValue"].Separator + item.koText();
            text.push(itemText);
        }
        return text.join("\n");
    };
    SurveyPropertyItemValuesEditor.prototype.isValueEmpty = function (val) {
        return !val;
    };
    return SurveyPropertyItemValuesEditor;
}(__WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__["a" /* SurveyPropertyItemsEditor */]));

__WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("itemvalues", function () { return new SurveyPropertyItemValuesEditor(); });


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__objectEditor__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyValidatorsEditor; });
/* unused harmony export SurveyPropertyValidatorItem */






var SurveyPropertyValidatorsEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyValidatorsEditor, _super);
    function SurveyPropertyValidatorsEditor() {
        var _this = _super.call(this) || this;
        _this.availableValidators = [];
        _this.validatorClasses = [];
        var self = _this;
        _this.selectedObjectEditor = new __WEBPACK_IMPORTED_MODULE_4__objectEditor__["a" /* SurveyObjectEditor */]();
        _this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
            self.onPropertyValueChanged(options.property, options.object, options.newValue);
        });
        _this.koSelected = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](null);
        _this.koSelected.subscribe(function (newValue) { self.selectedObjectEditor.selectedObject = newValue != null ? newValue.validator : null; });
        _this.validatorClasses = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.getChildrenClasses("surveyvalidator", true);
        _this.availableValidators = _this.getAvailableValidators();
        _this.onDeleteClick = function () { self.koItems.remove(self.koSelected()); };
        _this.onAddClick = function (validatorType) { self.addItem(validatorType); };
        return _this;
    }
    Object.defineProperty(SurveyPropertyValidatorsEditor.prototype, "editorType", {
        get: function () { return "validators"; },
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
        var jsonObj = new __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"]();
        var validator = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.createClass(item.getType());
        jsonObj.toObject(item, validator);
        return new SurveyPropertyValidatorItem(validator);
    };
    SurveyPropertyValidatorsEditor.prototype.createItemFromEditorItem = function (editorItem) {
        var item = editorItem;
        return item.validator;
    };
    SurveyPropertyValidatorsEditor.prototype.addItem = function (validatorType) {
        var newValidator = new SurveyPropertyValidatorItem(__WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.createClass(validatorType));
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
        if (this.koSelected() == null)
            return;
        this.koSelected().validator[property.name] = newValue;
    };
    return SurveyPropertyValidatorsEditor;
}(__WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__["a" /* SurveyPropertyItemsEditor */]));

var SurveyPropertyValidatorItem = (function () {
    function SurveyPropertyValidatorItem(validator) {
        this.validator = validator;
        this.text = validator.getType();
    }
    return SurveyPropertyValidatorItem;
}());

__WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("validators", function () { return new SurveyPropertyValidatorsEditor(); });


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editorLocalization__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionMatrixDropdownEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyQuestionEditorMatrixDropdownTabGeneral; });



var SurveyQuestionMatrixDropdownEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionMatrixDropdownEditor, _super);
    function SurveyQuestionMatrixDropdownEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionMatrixDropdownEditor.prototype.getPropertiesTabs = function (propTabs) {
        _super.prototype.getPropertiesTabs.call(this, propTabs);
        propTabs.push({ propertyName: "columns", visibleIndex: 10 });
        propTabs.push({ propertyName: "rows", visibleIndex: 11 });
        propTabs.push({ propertyName: "choices", visibleIndex: 12, title: __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getString("pe.matrixChoices") });
    };
    SurveyQuestionMatrixDropdownEditor.prototype.createGeneralTab = function () { return new SurveyQuestionEditorMatrixDropdownTabGeneral(this.questionBase, 0, this.properties); };
    return SurveyQuestionMatrixDropdownEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

var SurveyQuestionEditorMatrixDropdownTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorMatrixDropdownTabGeneral, _super);
    function SurveyQuestionEditorMatrixDropdownTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        return _this;
    }
    SurveyQuestionEditorMatrixDropdownTabGeneral.prototype.setUpProperties = function () {
        _super.prototype.setUpProperties.call(this);
        this.cellTypeProperty = this.properties.getProperty("cellType");
        this.hasCellType = this.cellTypeProperty != null;
        this.koCellTypeChoices = ko.observableArray();
        if (this.cellTypeProperty) {
            this.koCellTypeChoices(this.cellTypeProperty.choices);
        }
        this.koCellType = ko.observable();
    };
    Object.defineProperty(SurveyQuestionEditorMatrixDropdownTabGeneral.prototype, "hasAdditionalTemplate", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorMatrixDropdownTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return "questioneditortab-matrixdropdown"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorMatrixDropdownTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasCellType)
            this.koCellType(this.questionBase["cellType"]);
    };
    SurveyQuestionEditorMatrixDropdownTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasCellType)
            this.questionBase["cellType"] = this.koCellType();
    };
    return SurveyQuestionEditorMatrixDropdownTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["d" /* SurveyQuestionEditorTabGeneral */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("matrixdropdown", function (question, onCanShowPropertyCallback) { return new SurveyQuestionMatrixDropdownEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__json5__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyEmbedingWindow; });


var SurveyEmbedingWindow = (function () {
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
        this.koLibraryVersion = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("jquery");
        this.koShowAsWindow = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("page");
        this.koScriptUsing = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("bootstrap");
        this.koHasIds = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
        this.koLoadSurvey = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
        this.koHeadText = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("");
        this.koJavaText = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("");
        this.koBodyText = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("");
        this.koVisibleHtml = __WEBPACK_IMPORTED_MODULE_0_knockout__["computed"](function () { return self.koShowAsWindow() == "page" || self.platformHtmlonWindow[self.koLibraryVersion()] != ""; });
        this.koLibraryVersion.subscribe(function (newValue) { self.setHeadText(); self.setJavaTest(); self.setBodyText(); });
        this.koShowAsWindow.subscribe(function (newValue) { self.setJavaTest(); self.setBodyText(); });
        this.koScriptUsing.subscribe(function (newValue) { self.setHeadText(); self.setJavaTest(); });
        this.koLoadSurvey.subscribe(function (newValue) { self.setJavaTest(); });
        this.surveyEmbedingHead = null;
    }
    Object.defineProperty(SurveyEmbedingWindow.prototype, "json", {
        get: function () { return this.jsonValue; },
        set: function (value) { this.jsonValue = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyEmbedingWindow.prototype, "hasAceEditor", {
        get: function () { return typeof ace !== "undefined"; },
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
        if (this.koScriptUsing() != "bootstrap")
            return "";
        return "Survey.Survey.cssType = \"bootstrap\";\n";
    };
    SurveyEmbedingWindow.prototype.getSaveFunc = function () {
        return "function sendDataToServer(survey) {\n" + this.getSaveFuncCode() + "\n}";
    };
    SurveyEmbedingWindow.prototype.getSaveFuncCode = function () {
        if (this.koHasIds())
            return "    survey.sendResult('" + this.surveyPostId + "');";
        return "    //send Ajax request to your web server.\n    alert(\"The results are:\" + JSON.stringify(s.data));";
    };
    SurveyEmbedingWindow.prototype.getJsonText = function () {
        if (this.koHasIds() && this.koLoadSurvey()) {
            return "{ surveyId: '" + this.surveyId + "'}";
        }
        if (this.generateValidJSON)
            return JSON.stringify(this.json);
        return new __WEBPACK_IMPORTED_MODULE_1__json5__["a" /* SurveyJSON5 */]().stringify(this.json);
    };
    SurveyEmbedingWindow.prototype.setTextToEditor = function (editor, koText, text) {
        if (editor)
            editor.setValue(text);
        if (koText)
            koText(text);
    };
    return SurveyEmbedingWindow;
}());



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyUndoRedo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return UndoRedoItem; });


var SurveyUndoRedo = (function () {
    function SurveyUndoRedo() {
        this.index = -1;
        this.maximumCount = 10;
        this.items = [];
        this.koCanUndo = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
        this.koCanRedo = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
    }
    SurveyUndoRedo.prototype.clear = function () {
        this.items = [];
        this.koCanUndo(false);
        this.koCanRedo(false);
    };
    SurveyUndoRedo.prototype.setCurrent = function (survey, selectedObjName) {
        var item = new UndoRedoItem();
        item.surveyJSON = new __WEBPACK_IMPORTED_MODULE_1_survey_knockout__["JsonObject"]().toJsonObject(survey);
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
        if (!this.canUndo)
            return null;
        return this.doUndoRedo(-1);
    };
    SurveyUndoRedo.prototype.redo = function () {
        if (!this.canRedo)
            return null;
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
        get: function () {
            return this.index >= 1 && this.index < this.items.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyUndoRedo.prototype, "canRedo", {
        get: function () {
            return this.items.length > 1 && this.index < this.items.length - 1;
        },
        enumerable: true,
        configurable: true
    });
    SurveyUndoRedo.prototype.removeOldData = function () {
        if (this.items.length - 1 < this.maximumCount)
            return;
        this.items.splice(0, this.items.length - this.maximumCount - 1);
    };
    return SurveyUndoRedo;
}());

var UndoRedoItem = (function () {
    function UndoRedoItem() {
    }
    return UndoRedoItem;
}());



/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectEditor__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pagesEditor__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__surveyEmbedingWindow__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__surveyObjects__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__objectVerbs__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__questionEditors_questionEditorBase__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__surveyJSONEditor__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__textWorker__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__undoredo__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__surveyHelper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__dragdrophelper__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__json5__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyEditor; });














var templateEditorHtml = __webpack_require__(68);
var templatePageHtml = __webpack_require__(66);
var templateQuestionHtml = __webpack_require__(67);

var SurveyEditor = (function () {
    function SurveyEditor(renderedElement, options) {
        if (renderedElement === void 0) { renderedElement = null; }
        if (options === void 0) { options = null; }
        this.stateValue = "";
        this.dragDropHelper = null;
        this.surveyId = null;
        this.surveyPostId = null;
        this.customToolboxQuestionMaxCount = 3;
        this.alwaySaveTextInPropertyEditors = false;
        this.onCanShowProperty = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Event"]();
        this.saveNo = 0;
        this.koShowOptions = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
        this.koGenerateValidJSON = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
        this.setOptions(options);
        this.koCustomToolboxQuestions = __WEBPACK_IMPORTED_MODULE_0_knockout__["observableArray"]();
        this.koCanDeleteObject = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
        var self = this;
        this.koState = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
        this.koShowSaveButton = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
        this.koTestSurveyWidth = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("100%");
        this.saveButtonClick = function () { self.doSave(); };
        this.koObjects = __WEBPACK_IMPORTED_MODULE_0_knockout__["observableArray"]();
        this.koSelectedObject = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]();
        this.koSelectedObject.subscribe(function (newValue) { self.selectedObjectChanged(newValue != null ? newValue.value : null); });
        this.koGenerateValidJSON.subscribe(function (newValue) {
            if (!self.options)
                self.options = {};
            self.options.generateValidJSON = newValue;
            if (self.generateValidJSONChangedCallback)
                self.generateValidJSONChangedCallback(newValue);
        });
        this.surveyObjects = new __WEBPACK_IMPORTED_MODULE_5__surveyObjects__["a" /* SurveyObjects */](this.koObjects, this.koSelectedObject);
        this.undoRedo = new __WEBPACK_IMPORTED_MODULE_10__undoredo__["a" /* SurveyUndoRedo */]();
        this.surveyVerbs = new __WEBPACK_IMPORTED_MODULE_6__objectVerbs__["a" /* SurveyVerbs */](function () { self.setModified(); });
        this.selectedObjectEditor = new __WEBPACK_IMPORTED_MODULE_2__objectEditor__["a" /* SurveyObjectEditor */](this.options);
        this.selectedObjectEditor.onCanShowPropertyCallback = function (object, property) {
            return self.onCanShowObjectProperty(object, property);
        };
        this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
            self.onPropertyValueChanged(options.property, options.object, options.newValue);
        });
        this.questionEditorWindow = new __WEBPACK_IMPORTED_MODULE_7__questionEditors_questionEditorBase__["a" /* SurveyPropertyEditorShowWindow */]();
        this.questionEditorWindow.onCanShowPropertyCallback = function (object, property) {
            return self.onCanShowObjectProperty(object, property);
        };
        this.pagesEditor = new __WEBPACK_IMPORTED_MODULE_3__pagesEditor__["a" /* SurveyPagesEditor */](function () { self.addPage(); }, function (page) { self.surveyObjects.selectObject(page); }, function (indexFrom, indexTo) { self.movePage(indexFrom, indexTo); }, function (page) { self.deleteCurrentObject(); });
        this.surveyEmbeding = new __WEBPACK_IMPORTED_MODULE_4__surveyEmbedingWindow__["a" /* SurveyEmbedingWindow */]();
        this.koViewType = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("designer");
        this.koIsShowDesigner = __WEBPACK_IMPORTED_MODULE_0_knockout__["computed"](function () { return self.koViewType() == "designer"; });
        this.selectDesignerClick = function () { self.showDesigner(); };
        this.selectEditorClick = function () { self.showJsonEditor(); };
        this.selectTestClick = function () { self.showTestSurvey(); };
        this.selectEmbedClick = function () { self.showEmbedEditor(); };
        this.generateValidJSONClick = function () { self.koGenerateValidJSON(true); };
        this.generateReadableJSONClick = function () { self.koGenerateValidJSON(false); };
        this.runSurveyClick = function () { self.showLiveSurvey(); };
        this.embedingSurveyClick = function () { self.showSurveyEmbeding(); };
        this.deleteObjectClick = function () { self.deleteCurrentObject(); };
        this.draggingQuestion = function (questionType, e) { self.doDraggingQuestion(questionType, e); };
        this.clickQuestion = function (questionType) { self.doClickQuestion(questionType); };
        this.draggingCopiedQuestion = function (item, e) { self.doDraggingCopiedQuestion(item.json, e); };
        this.clickCustomToolboxQuestion = function (item) { self.doClickCustomToolboxQuestion(item.json); };
        this.dragEnd = function (item, e) { self.dragDropHelper.end(); };
        this.doUndoClick = function () { self.doUndoRedo(self.undoRedo.undo()); };
        this.doRedoClick = function () { self.doUndoRedo(self.undoRedo.redo()); };
        this.jsonEditor = new __WEBPACK_IMPORTED_MODULE_8__surveyJSONEditor__["a" /* SurveyJSONEditor */]();
        if (renderedElement) {
            this.render(renderedElement);
        }
    }
    SurveyEditor.prototype.setOptions = function (options) {
        this.options = options;
        this.questionTypes = this.getQuestionTypes();
        this.showJSONEditorTabValue = options && typeof (options.showJSONEditorTab) !== 'undefined' ? options.showJSONEditorTab : true;
        this.showTestSurveyTabValue = options && typeof (options.showTestSurveyTab) !== 'undefined' ? options.showTestSurveyTab : true;
        this.showEmbededSurveyTabValue = options && typeof (options.showEmbededSurveyTab) !== 'undefined' ? options.showEmbededSurveyTab : false;
        this.koShowOptions(options && typeof (options.showOptions) !== 'undefined' ? options.showOptions : false);
        this.koGenerateValidJSON(this.options && this.options.generateValidJSON);
        if (this.selectedObjectEditor)
            this.selectedObjectEditor.setOptions(options);
    };
    Object.defineProperty(SurveyEditor.prototype, "survey", {
        get: function () {
            return this.surveyValue;
        },
        enumerable: true,
        configurable: true
    });
    SurveyEditor.prototype.render = function (element, options) {
        if (element === void 0) { element = null; }
        if (options === void 0) { options = null; }
        if (options)
            this.setOptions(options);
        var self = this;
        if (element && typeof element == "string") {
            element = document.getElementById(element);
        }
        if (element) {
            this.renderedElement = element;
        }
        element = this.renderedElement;
        if (!element)
            return;
        element.innerHTML = templateEditorHtml;
        self.applyBinding();
    };
    SurveyEditor.prototype.loadSurvey = function (surveyId) {
        var self = this;
        new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["dxSurveyService"]().loadSurvey(surveyId, function (success, result, response) {
            if (success && result) {
                self.text = JSON.stringify(result);
            }
        });
    };
    Object.defineProperty(SurveyEditor.prototype, "text", {
        get: function () {
            if (this.koIsShowDesigner())
                return this.getSurveyTextFromDesigner();
            return this.jsonEditor.text;
        },
        set: function (value) {
            var textWorker = new __WEBPACK_IMPORTED_MODULE_9__textWorker__["a" /* SurveyTextWorker */](value);
            if (textWorker.isJsonCorrect) {
                this.initSurvey(new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(textWorker.survey));
                this.showDesigner();
                this.setUndoRedoCurrentState(true);
            }
            else {
                this.setTextValue(value);
                this.koViewType("editor");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyEditor.prototype, "state", {
        get: function () { return this.stateValue; },
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
                    if (isSuccess)
                        self.setState("saved");
                }
            });
        }
    };
    SurveyEditor.prototype.setModified = function () {
        this.setState("modified");
        this.setUndoRedoCurrentState();
    };
    SurveyEditor.prototype.setUndoRedoCurrentState = function (clearState) {
        if (clearState === void 0) { clearState = false; }
        if (clearState) {
            this.undoRedo.clear();
        }
        var selObj = this.koSelectedObject() ? this.koSelectedObject().value : null;
        this.undoRedo.setCurrent(this.surveyValue, selObj ? selObj.name : null);
    };
    Object.defineProperty(SurveyEditor.prototype, "saveSurveyFunc", {
        get: function () { return this.saveSurveyFuncValue; },
        set: function (value) {
            this.saveSurveyFuncValue = value;
            this.koShowSaveButton(value != null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyEditor.prototype, "showOptions", {
        get: function () { return this.koShowOptions(); },
        set: function (value) { this.koShowOptions(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyEditor.prototype, "showJSONEditorTab", {
        get: function () { return this.showJSONEditorTabValue; },
        set: function (value) { this.showJSONEditorTabValue = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyEditor.prototype, "showTestSurveyTab", {
        get: function () { return this.showTestSurveyTabValue; },
        set: function (value) { this.showTestSurveyTabValue = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyEditor.prototype, "showEmbededSurveyTab", {
        get: function () { return this.showEmbededSurveyTabValue; },
        set: function (value) { this.showEmbededSurveyTabValue = value; },
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
        var name = __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getNewPageName(this.survey.pages);
        var page = this.surveyValue.addNewPage(name);
        this.addPageToUI(page);
        this.setModified();
    };
    SurveyEditor.prototype.getLocString = function (str) { return __WEBPACK_IMPORTED_MODULE_1__editorLocalization__["a" /* editorLocalization */].getString(str); };
    SurveyEditor.prototype.getQuestionTypes = function () {
        var allTypes = __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["QuestionFactory"].Instance.getAllTypes();
        if (!this.options || !this.options.questionTypes || !this.options.questionTypes.length)
            return allTypes;
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
            if (__WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj) == __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Page) {
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
        if (page)
            return page;
        var question = this.survey.getQuestionByName(name);
        if (question)
            return question;
        return null;
    };
    SurveyEditor.prototype.canSwitchViewType = function (newType) {
        if (newType && this.koViewType() == newType)
            return false;
        if (this.koViewType() != "editor")
            return true;
        if (!this.jsonEditor.isJsonCorrect) {
            alert(this.getLocString("ed.correctJSON"));
            return false;
        }
        this.initSurvey(new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(this.jsonEditor.survey));
        return true;
    };
    SurveyEditor.prototype.showDesigner = function () {
        if (!this.canSwitchViewType("designer"))
            return;
        this.koViewType("designer");
    };
    SurveyEditor.prototype.showJsonEditor = function () {
        if (this.koViewType() == "editor")
            return;
        this.jsonEditor.show(this.getSurveyTextFromDesigner());
        this.koViewType("editor");
    };
    SurveyEditor.prototype.showTestSurvey = function () {
        if (!this.canSwitchViewType(null))
            return;
        this.showLiveSurvey();
        this.koViewType("test");
    };
    SurveyEditor.prototype.showEmbedEditor = function () {
        if (!this.canSwitchViewType("embed"))
            return;
        this.showSurveyEmbeding();
        this.koViewType("embed");
    };
    SurveyEditor.prototype.getSurveyTextFromDesigner = function () {
        var json = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(this.survey);
        if (this.options && this.options.generateValidJSON)
            return JSON.stringify(json, null, 1);
        return new __WEBPACK_IMPORTED_MODULE_13__json5__["a" /* SurveyJSON5 */]().stringify(json, null, 1);
    };
    SurveyEditor.prototype.selectedObjectChanged = function (obj) {
        var canDeleteObject = false;
        this.selectedObjectEditor.selectedObject = obj;
        this.surveyVerbs.obj = obj;
        var objType = __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj);
        if (objType == __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Page) {
            this.survey.currentPage = obj;
            canDeleteObject = this.survey.pages.length > 1;
        }
        if (objType == __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Question) {
            this.survey["setselectedQuestion"](obj);
            canDeleteObject = true;
            this.survey.currentPage = this.survey.getPageByQuestion(this.survey["selectedQuestionValue"]);
        }
        else {
            this.survey["setselectedQuestion"](null);
        }
        this.koCanDeleteObject(canDeleteObject);
    };
    SurveyEditor.prototype.applyBinding = function () {
        if (this.renderedElement == null)
            return;
        __WEBPACK_IMPORTED_MODULE_0_knockout__["cleanNode"](this.renderedElement);
        __WEBPACK_IMPORTED_MODULE_0_knockout__["applyBindings"](this, this.renderedElement);
        this.surveyjs = document.getElementById("surveyjs");
        if (this.surveyjs) {
            var self = this;
            this.surveyjs.onkeydown = function (e) {
                if (!e)
                    return;
                if (e.keyCode == 46)
                    self.deleteQuestion();
                if (e.keyCode == 38 || e.keyCode == 40) {
                    self.selectQuestion(e.keyCode == 38);
                }
            };
        }
        this.surveyjsExample = document.getElementById("surveyjsExample");
        this.initSurvey(new __WEBPACK_IMPORTED_MODULE_13__json5__["a" /* SurveyJSON5 */]().parse(SurveyEditor.defaultNewSurveyText));
        this.setUndoRedoCurrentState(true);
        this.jsonEditor.init();
    };
    SurveyEditor.prototype.initSurvey = function (json) {
        var self = this;
        this.surveyValue = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"]();
        this.dragDropHelper = new __WEBPACK_IMPORTED_MODULE_12__dragdrophelper__["a" /* DragDropHelper */](this.survey, function () { self.setModified(); });
        this.surveyValue["dragDropHelper"] = this.dragDropHelper;
        this.surveyValue["setJsonObject"](json); //TODO
        if (this.surveyValue.isEmpty) {
            this.surveyValue = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"](new __WEBPACK_IMPORTED_MODULE_13__json5__["a" /* SurveyJSON5 */]().parse(SurveyEditor.defaultNewSurveyText));
        }
        //TODO remove the line above and call the method directly.
        if (this.survey["setDesignMode"])
            this.survey["setDesignMode"](true);
        else
            this.survey.mode = "designer";
        this.survey.render(this.surveyjs);
        this.surveyObjects.survey = this.survey;
        this.pagesEditor.survey = this.survey;
        this.pagesEditor.setSelectedPage(this.survey.currentPage);
        this.surveyVerbs.survey = this.survey;
        this.surveyValue["onSelectedQuestionChanged"].add(function (sender, options) { self.surveyObjects.selectObject(sender["selectedQuestionValue"]); });
        this.surveyValue["onEditQuestion"].add(function (sender, options) { self.showQuestionEditor(self.koSelectedObject().value); });
        this.surveyValue["onCopyQuestion"].add(function (sender, options) { self.addCustomToolboxQuestion(self.koSelectedObject().value); });
        this.surveyValue["onFastCopyQuestion"].add(function (sender, options) { self.fastCopyQuestion(self.koSelectedObject().value); });
        this.surveyValue["onDeleteCurrentObject"].add(function (sender, options) { self.deleteCurrentObject(); });
        this.surveyValue.onProcessHtml.add(function (sender, options) { options.html = self.processHtml(options.html); });
        this.surveyValue.onCurrentPageChanged.add(function (sender, options) { self.pagesEditor.setSelectedPage(sender.currentPage); });
        this.surveyValue.onQuestionAdded.add(function (sender, options) { self.onQuestionAdded(options.question); });
        this.surveyValue.onQuestionRemoved.add(function (sender, options) { self.onQuestionRemoved(options.question); });
    };
    SurveyEditor.prototype.processHtml = function (html) {
        if (!html)
            return html;
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
        this.doClickQuestionCore(__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["QuestionFactory"].Instance.createQuestion(questionType, this.getNewQuestionName()));
    };
    SurveyEditor.prototype.doClickCustomToolboxQuestion = function (json) {
        var name = this.getNewQuestionName();
        var question = __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["QuestionFactory"].Instance.createQuestion(json["type"], name);
        new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toObject(json, question);
        question.name = name;
        this.doClickQuestionCore(question);
    };
    SurveyEditor.prototype.getNewQuestionName = function () {
        return __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getNewQuestionName(this.survey.getAllQuestions());
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
        if (!obj)
            return null;
        return __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj) == __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Question ? (obj) : null;
    };
    SurveyEditor.prototype.deleteCurrentObject = function () {
        this.deleteObject(this.koSelectedObject().value);
    };
    Object.defineProperty(SurveyEditor.prototype, "customToolboxQuestionsText", {
        get: function () {
            if (this.koCustomToolboxQuestions().length == 0)
                return "";
            return JSON.stringify(this.koCustomToolboxQuestions());
        },
        set: function (val) {
            if (!val) {
                this.koCustomToolboxQuestions([]);
            }
            else {
                var json = JSON.parse(val);
                if (json && Array.isArray(json)) {
                    this.koCustomToolboxQuestions(json);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    SurveyEditor.prototype.showQuestionEditor = function (question) {
        var self = this;
        this.questionEditorWindow.show(question, function (question) { self.onQuestionEditorChanged(question); });
    };
    SurveyEditor.prototype.onQuestionEditorChanged = function (question) {
        this.surveyObjects.nameChanged(question);
        this.selectedObjectEditor.ObjectChanged();
        this.setModified();
        this.survey.render();
    };
    SurveyEditor.prototype.addCustomToolboxQuestion = function (question) {
        var objType = __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getObjectType(question);
        if (objType != __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Question)
            return;
        var json = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(question);
        json.type = question.getType();
        var item = this.getCustomToolboxQuestionByName(question.name);
        if (item) {
            item.json = json;
        }
        else {
            this.koCustomToolboxQuestions.push({ name: question.name, json: json });
        }
        if (this.koCustomToolboxQuestions().length > this.customToolboxQuestionMaxCount) {
            this.koCustomToolboxQuestions.splice(0, 1);
        }
    };
    SurveyEditor.prototype.fastCopyQuestion = function (question) {
        var json = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(question);
        json.type = question.getType();
        this.doClickCustomToolboxQuestion(json);
    };
    SurveyEditor.prototype.getCustomToolboxQuestionByName = function (name) {
        var items = this.koCustomToolboxQuestions();
        for (var i = 0; i < items.length; i++) {
            if (items[i].name == name)
                return items[i];
        }
        return null;
    };
    SurveyEditor.prototype.deleteObject = function (obj) {
        this.surveyObjects.removeObject(obj);
        var objType = __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj);
        if (objType == __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Page) {
            this.survey.removePage(obj);
            this.pagesEditor.removePage(obj);
            this.setModified();
        }
        if (objType == __WEBPACK_IMPORTED_MODULE_11__surveyHelper__["a" /* ObjType */].Question) {
            this.survey.currentPage.removeQuestion(obj);
            this.survey["setselectedQuestion"](null);
            this.surveyObjects.selectObject(this.survey.currentPage);
            this.setModified();
        }
        this.survey.render();
    };
    SurveyEditor.prototype.showLiveSurvey = function () {
        var _this = this;
        if (!this.surveyjsExample)
            return;
        var json = this.getSurveyJSON();
        if (json != null) {
            if (json.cookieName) {
                delete json.cookieName;
            }
            var survey = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"](json);
            var self = this;
            var surveyjsExampleResults = document.getElementById("surveyjsExampleResults");
            var surveyjsExamplereRun = document.getElementById("surveyjsExamplereRun");
            if (surveyjsExampleResults)
                surveyjsExampleResults.innerHTML = "";
            if (surveyjsExamplereRun)
                surveyjsExamplereRun.style.display = "none";
            survey.onComplete.add(function (sender) { if (surveyjsExampleResults)
                surveyjsExampleResults.innerHTML = _this.getLocString("ed.surveyResults") + JSON.stringify(survey.data); if (surveyjsExamplereRun)
                surveyjsExamplereRun.style.display = ""; });
            survey.render(this.surveyjsExample);
        }
        else {
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
        if (this.koIsShowDesigner())
            return new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(this.survey);
        if (this.jsonEditor.isJsonCorrect)
            return new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["JsonObject"]().toJsonObject(this.jsonEditor.survey);
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
    return SurveyEditor;
}());

SurveyEditor.defaultNewSurveyText = "{ pages: [ { name: 'page1'}] }";
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"].cssType = "bootstrap";
new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["SurveyTemplateText"]().replaceText(templatePageHtml, "page");
new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["SurveyTemplateText"]().replaceText(templateQuestionHtml, "question");
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"].prototype["onCreating"] = function () {
    this.selectedQuestionValue = null;
    this.onSelectedQuestionChanged = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Event"]();
    this.onEditQuestion = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Event"]();
    this.onCopyQuestion = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Event"]();
    this.onFastCopyQuestion = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Event"]();
    this.onDeleteCurrentObject = new __WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Event"]();
    var self = this;
    this.editQuestionClick = function () { self.onEditQuestion.fire(self); };
    this.copyQuestionClick = function () { self.onCopyQuestion.fire(self); };
    this.fastCopyQuestionClick = function () { self.onFastCopyQuestion.fire(self); };
    this.deleteCurrentObjectClick = function () { self.onDeleteCurrentObject.fire(self); };
    this.koDraggingSource = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](null);
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"].prototype["setselectedQuestion"] = function (value) {
    if (value == this.selectedQuestionValue)
        return;
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
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Survey"].prototype["getEditorLocString"] = function (value) {
    return __WEBPACK_IMPORTED_MODULE_1__editorLocalization__["a" /* editorLocalization */].getString(value);
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Page"].prototype["onCreating"] = function () {
    var self = this;
    this.dragEnterCounter = 0;
    this.koDragging = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](-1);
    this.koDraggingQuestion = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](null);
    this.koDraggingBottom = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
    this.koDragging.subscribe(function (newValue) {
        if (newValue < 0) {
            self.dragEnterCounter = 0;
            self.koDraggingQuestion(null);
            self.koDraggingBottom(false);
        }
        else {
            var question = newValue >= 0 && newValue < self.questions.length ? self.questions[newValue] : null;
            self.koDraggingQuestion(question);
            self.koDraggingBottom(newValue == self.questions.length);
        }
    });
    this.koDraggingQuestion.subscribe(function (newValue) { if (newValue)
        newValue.koIsDragging(true); });
    this.koDraggingQuestion.subscribe(function (oldValue) { if (oldValue)
        oldValue.koIsDragging(false); }, this, "beforeChange");
    this.dragEnter = function (e) { e.preventDefault(); self.dragEnterCounter++; self.doDragEnter(e); };
    this.dragLeave = function (e) { self.dragEnterCounter--; if (self.dragEnterCounter === 0)
        self.doDragLeave(e); };
    this.dragDrop = function (e) { self.doDrop(e); };
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Page"].prototype["doDrop"] = function (e) {
    var dragDropHelper = this.data["dragDropHelper"];
    if (dragDropHelper) {
        dragDropHelper.doDrop(e);
    }
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Page"].prototype["doDragEnter"] = function (e) {
    if (this.questions.length > 0 || this.koDragging() > 0)
        return;
    var dragDropHelper = this.data["dragDropHelper"];
    if (dragDropHelper && dragDropHelper.isSurveyDragging(e)) {
        this.koDragging(0);
    }
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["Page"].prototype["doDragLeave"] = function (e) {
    var dragDropHelper = this.data["dragDropHelper"];
    if (dragDropHelper) {
        dragDropHelper.doLeavePage(e);
    }
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["QuestionBase"].prototype["onCreating"] = function () {
    var self = this;
    this.dragDropHelperValue = null;
    this.koIsDragging = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
    this.koIsDraggingSource = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
    this.dragDropHelper = function () {
        if (self.dragDropHelperValue == null) {
            self.dragDropHelperValue = self.data["dragDropHelper"];
        }
        return self.dragDropHelperValue;
    };
    this.dragOver = function (e) { self.dragDropHelper().doDragDropOver(e, self); };
    this.dragDrop = function (e) { self.dragDropHelper().doDrop(e, self); };
    this.dragStart = function (e) { self.dragDropHelper().startDragQuestion(e, self.name); };
    this.dragEnd = function (e) { self.dragDropHelper().end(); };
    this.koIsSelected = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](false);
    this.koOnClick = function () {
        if (self.data == null)
            return;
        self.data["setselectedQuestion"](this);
    };
};
__WEBPACK_IMPORTED_MODULE_14_survey_knockout__["QuestionBase"].prototype["onSelectedQuestionChanged"] = function () {
    if (this.data == null)
        return;
    this.koIsSelected(this.data["selectedQuestionValue"] == this);
};


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__propertyItemValuesEditor__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyDropdownColumnsEditor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SurveyPropertyMatrixDropdownColumnsItem; });






var SurveyPropertyDropdownColumnsEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyDropdownColumnsEditor, _super);
    function SurveyPropertyDropdownColumnsEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyPropertyDropdownColumnsEditor.prototype, "editorType", {
        get: function () { return "matrixdropdowncolumns"; },
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
    SurveyPropertyDropdownColumnsEditor.prototype.createNewEditorItem = function () { return new SurveyPropertyMatrixDropdownColumnsItem(new __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["MatrixDropdownColumn"]("", this.options)); };
    SurveyPropertyDropdownColumnsEditor.prototype.createEditorItem = function (item) { return new SurveyPropertyMatrixDropdownColumnsItem(item, this.options); };
    SurveyPropertyDropdownColumnsEditor.prototype.createItemFromEditorItem = function (editorItem) {
        var columItem = editorItem;
        columItem.apply();
        return columItem.column;
    };
    return SurveyPropertyDropdownColumnsEditor;
}(__WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__["a" /* SurveyPropertyItemsEditor */]));

var SurveyPropertyMatrixDropdownColumnsItem = (function () {
    function SurveyPropertyMatrixDropdownColumnsItem(column, options) {
        if (options === void 0) { options = null; }
        this.column = column;
        this.options = options;
        this.cellTypeChoices = this.getPropertyChoices("cellType");
        this.colCountChoices = this.getPropertyChoices("colCount");
        this.koName = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](column.name);
        this.koCellType = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](column.cellType);
        this.koColCount = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](column.colCount);
        this.koIsRequired = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](column.isRequired ? true : false);
        this.koHasOther = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](column.hasOther ? true : false);
        this.koTitle = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](column.name === column.title ? "" : column.title);
        this.koShowChoices = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](false);
        this.koChoices = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"](column.choices);
        this.koHasError = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](false);
        this.choicesEditor = new __WEBPACK_IMPORTED_MODULE_4__propertyItemValuesEditor__["a" /* SurveyPropertyItemValuesEditor */]();
        this.choicesEditor.object = this.column;
        this.choicesEditor.value = this.koChoices();
        this.choicesEditor.options = this.options;
        var self = this;
        this.onShowChoicesClick = function () { self.koShowChoices(!self.koShowChoices()); };
        this.koHasChoices = __WEBPACK_IMPORTED_MODULE_1_knockout__["computed"](function () { return self.koCellType() == "dropdown" || self.koCellType() == "checkbox" || self.koCellType() == "radiogroup"; });
        this.koHasColCount = __WEBPACK_IMPORTED_MODULE_1_knockout__["computed"](function () { return self.koCellType() == "checkbox" || self.koCellType() == "radiogroup"; });
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
        var properties = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.getProperties("matrixdropdowncolumn");
        for (var i = 0; i < properties.length; i++) {
            if (properties[i].name == propetyName)
                return properties[i].choices;
        }
        return [];
    };
    return SurveyPropertyMatrixDropdownColumnsItem;
}());

__WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("matrixdropdowncolumns", function () { return new SurveyPropertyDropdownColumnsEditor(); });


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyModalEditor__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyResultfullEditor; });






var SurveyPropertyResultfullEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyResultfullEditor, _super);
    function SurveyPropertyResultfullEditor() {
        var _this = _super.call(this) || this;
        _this.koUrl = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        _this.koPath = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        _this.koValueName = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        _this.koTitleName = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        _this.createSurvey();
        var self = _this;
        _this.koUrl.subscribe(function (newValue) { self.question.choicesByUrl.url = newValue; self.run(); });
        _this.koPath.subscribe(function (newValue) { self.question.choicesByUrl.path = newValue; self.run(); });
        _this.koValueName.subscribe(function (newValue) { self.question.choicesByUrl.valueName = newValue; self.run(); });
        _this.koTitleName.subscribe(function (newValue) { self.question.choicesByUrl.titleName = newValue; self.run(); });
        return _this;
    }
    Object.defineProperty(SurveyPropertyResultfullEditor.prototype, "editorType", {
        get: function () { return "restfull"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyPropertyResultfullEditor.prototype, "restfullValue", {
        get: function () { return this.value; },
        enumerable: true,
        configurable: true
    });
    SurveyPropertyResultfullEditor.prototype.getValueText = function (value) {
        if (!value || !value.url)
            return __WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.empty");
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
        var val = new __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["ChoicesRestfull"]();
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
        this.survey = new __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["Survey"]();
        this.survey.showNavigationButtons = false;
        this.survey.showQuestionNumbers = "off";
        var page = this.survey.addNewPage("page1");
        this.question = page.addNewQuestion("dropdown", "q1");
        this.question.title = __WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.testService");
        this.question.choices = [];
        this.survey.render("restfullSurvey");
    };
    return SurveyPropertyResultfullEditor;
}(__WEBPACK_IMPORTED_MODULE_2__propertyModalEditor__["a" /* SurveyPropertyModalEditor */]));

__WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("restfull", function () { return new SurveyPropertyResultfullEditor(); });


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__propertyItemsEditor__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__surveyHelper__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__propertyValidatorsEditor__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyTextItemsEditor; });







var SurveyPropertyTextItemsEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyTextItemsEditor, _super);
    function SurveyPropertyTextItemsEditor() {
        return _super.call(this) || this;
    }
    Object.defineProperty(SurveyPropertyTextItemsEditor.prototype, "editorType", {
        get: function () { return "textitems"; },
        enumerable: true,
        configurable: true
    });
    SurveyPropertyTextItemsEditor.prototype.createNewEditorItem = function () {
        var objs = [];
        var items = this.koItems();
        for (var i = 0; i < items.length; i++) {
            objs.push({ name: items[i].koName() });
        }
        var editItem = { koName: ko.observable(__WEBPACK_IMPORTED_MODULE_3__surveyHelper__["b" /* SurveyHelper */].getNewName(objs, "text")), koTitle: ko.observable() };
        this.createValidatorsEditor(editItem, []);
        return editItem;
    };
    SurveyPropertyTextItemsEditor.prototype.createEditorItem = function (item) {
        var editItem = { koName: ko.observable(item.name), koTitle: ko.observable(item.title) };
        this.createValidatorsEditor(editItem, item.validators);
        return editItem;
    };
    SurveyPropertyTextItemsEditor.prototype.createItemFromEditorItem = function (editorItem) {
        var itemText = new __WEBPACK_IMPORTED_MODULE_6_survey_knockout__["MultipleTextItem"](editorItem.koName(), editorItem.koTitle());
        itemText.validators = editorItem.validators;
        return itemText;
    };
    SurveyPropertyTextItemsEditor.prototype.createValidatorsEditor = function (item, validators) {
        item.validators = validators.slice();
        var self = this;
        var onItemChanged = function (newValue) { item.validators = newValue; item.koText(self.getText(newValue.length)); };
        var propertyEditor = new __WEBPACK_IMPORTED_MODULE_5__propertyValidatorsEditor__["a" /* SurveyPropertyValidatorsEditor */]();
        item.editor = propertyEditor;
        propertyEditor.onChanged = function (newValue) { onItemChanged(newValue); };
        propertyEditor.object = item;
        propertyEditor.title(__WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.editProperty")["format"]("Validators"));
        propertyEditor.value = item.validators;
        item.koText = ko.observable(this.getText(validators.length));
    };
    SurveyPropertyTextItemsEditor.prototype.getText = function (length) {
        return __WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.items")["format"](length);
    };
    return SurveyPropertyTextItemsEditor;
}(__WEBPACK_IMPORTED_MODULE_1__propertyItemsEditor__["a" /* SurveyPropertyItemsEditor */]));

__WEBPACK_IMPORTED_MODULE_2__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("textitems", function () { return new SurveyPropertyTextItemsEditor(); });


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__editorLocalization__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_survey_knockout__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyPropertyTriggersEditor; });
/* unused harmony export SurveyPropertyTrigger */
/* unused harmony export SurveyPropertyVisibleTrigger */
/* unused harmony export SurveyPropertySetValueTrigger */
/* unused harmony export SurveyPropertyTriggerObjects */






var SurveyPropertyTriggersEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyTriggersEditor, _super);
    function SurveyPropertyTriggersEditor() {
        var _this = _super.call(this) || this;
        _this.availableTriggers = [];
        _this.triggerClasses = [];
        var self = _this;
        _this.onDeleteClick = function () { self.koItems.remove(self.koSelected()); };
        _this.onAddClick = function (triggerType) { self.addItem(triggerType); };
        _this.koSelected = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](null);
        _this.koPages = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"]();
        _this.koQuestions = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"]();
        _this.triggerClasses = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.getChildrenClasses("surveytrigger", true);
        _this.availableTriggers = _this.getAvailableTriggers();
        return _this;
    }
    Object.defineProperty(SurveyPropertyTriggersEditor.prototype, "editorType", {
        get: function () { return "triggers"; },
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
        var trigger = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.createClass(triggerType);
        var triggerItem = this.createPropertyTrigger(trigger);
        this.koItems.push(triggerItem);
        this.koSelected(triggerItem);
    };
    SurveyPropertyTriggersEditor.prototype.createEditorItem = function (item) {
        var jsonObj = new __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"]();
        var trigger = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.createClass(item.getType());
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
}(__WEBPACK_IMPORTED_MODULE_2__propertyItemsEditor__["a" /* SurveyPropertyItemsEditor */]));

var SurveyPropertyTrigger = (function () {
    function SurveyPropertyTrigger(trigger) {
        this.trigger = trigger;
        this.operators = ["empty", "notempty", "equal", "notequal", "contains", "notcontains", "greater", "less", "greaterorequal", "lessorequal"];
        this.availableOperators = [];
        this.createOperators();
        this.triggerType = trigger.getType();
        this.koType = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](this.triggerType);
        this.koName = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](trigger.name);
        this.koOperator = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](trigger.operator);
        this.koValue = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](trigger.value);
        var self = this;
        this.koRequireValue = __WEBPACK_IMPORTED_MODULE_1_knockout__["computed"](function () { return self.koOperator() != "empty" && self.koOperator() != "notempty"; });
        this.koIsValid = __WEBPACK_IMPORTED_MODULE_1_knockout__["computed"](function () { if (self.koName() && (!self.koRequireValue() || self.koValue()))
            return true; return false; });
        this.koText = __WEBPACK_IMPORTED_MODULE_1_knockout__["computed"](function () { self.koName(); self.koOperator(); self.koValue(); return self.getText(); });
    }
    SurveyPropertyTrigger.prototype.createTrigger = function () {
        var trigger = __WEBPACK_IMPORTED_MODULE_5_survey_knockout__["JsonObject"].metaData.createClass(this.triggerType);
        trigger.name = this.koName();
        trigger.operator = this.koOperator();
        trigger.value = this.koValue();
        return trigger;
    };
    SurveyPropertyTrigger.prototype.createOperators = function () {
        for (var i = 0; i < this.operators.length; i++) {
            var name = this.operators[i];
            this.availableOperators.push({ name: name, text: __WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("op." + name) });
        }
    };
    SurveyPropertyTrigger.prototype.getText = function () {
        if (!this.koIsValid())
            return __WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.triggerNotSet");
        return __WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.triggerRunIf") + " '" + this.koName() + "' " + this.getOperatorText() + this.getValueText();
    };
    SurveyPropertyTrigger.prototype.getOperatorText = function () {
        var op = this.koOperator();
        for (var i = 0; i < this.availableOperators.length; i++) {
            if (this.availableOperators[i].name == op)
                return this.availableOperators[i].text;
        }
        return op;
    };
    SurveyPropertyTrigger.prototype.getValueText = function () {
        if (!this.koRequireValue())
            return "";
        return " " + this.koValue();
    };
    return SurveyPropertyTrigger;
}());

var SurveyPropertyVisibleTrigger = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertyVisibleTrigger, _super);
    function SurveyPropertyVisibleTrigger(trigger, koPages, koQuestions) {
        var _this = _super.call(this, trigger) || this;
        _this.trigger = trigger;
        _this.pages = new SurveyPropertyTriggerObjects(__WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.triggerMakePagesVisible"), koPages(), trigger.pages);
        _this.questions = new SurveyPropertyTriggerObjects(__WEBPACK_IMPORTED_MODULE_4__editorLocalization__["a" /* editorLocalization */].getString("pe.triggerMakeQuestionsVisible"), koQuestions(), trigger.questions);
        return _this;
    }
    SurveyPropertyVisibleTrigger.prototype.createTrigger = function () {
        var trigger = _super.prototype.createTrigger.call(this);
        trigger.pages = this.pages.koChoosen();
        trigger.questions = this.questions.koChoosen();
        return trigger;
    };
    return SurveyPropertyVisibleTrigger;
}(SurveyPropertyTrigger));

var SurveyPropertySetValueTrigger = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyPropertySetValueTrigger, _super);
    function SurveyPropertySetValueTrigger(trigger, koQuestions) {
        var _this = _super.call(this, trigger) || this;
        _this.trigger = trigger;
        _this.koQuestions = koQuestions;
        _this.kosetToName = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](trigger.setToName);
        _this.kosetValue = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](trigger.setValue);
        _this.koisVariable = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"](trigger.isVariable);
        return _this;
    }
    SurveyPropertySetValueTrigger.prototype.createTrigger = function () {
        var trigger = _super.prototype.createTrigger.call(this);
        trigger.setToName = this.kosetToName();
        trigger.setValue = this.kosetValue();
        trigger.isVariable = this.koisVariable();
        return trigger;
    };
    return SurveyPropertySetValueTrigger;
}(SurveyPropertyTrigger));

var SurveyPropertyTriggerObjects = (function () {
    function SurveyPropertyTriggerObjects(title, allObjects, choosenObjects) {
        this.title = title;
        this.koChoosen = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"](choosenObjects);
        var array = [];
        for (var i = 0; i < allObjects.length; i++) {
            var item = allObjects[i];
            if (choosenObjects.indexOf(item) < 0) {
                array.push(item);
            }
        }
        this.koObjects = __WEBPACK_IMPORTED_MODULE_1_knockout__["observableArray"](array);
        this.koSelected = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        this.koChoosenSelected = __WEBPACK_IMPORTED_MODULE_1_knockout__["observable"]();
        var self = this;
        this.onDeleteClick = function () { self.deleteItem(); };
        this.onAddClick = function () { self.addItem(); };
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
}());

__WEBPACK_IMPORTED_MODULE_3__propertyEditorBase__["a" /* SurveyPropertyEditorBase */].registerEditor("triggers", function () { return new SurveyPropertyTriggersEditor(); });


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionCommentEditor; });
/* unused harmony export SurveyQuestionCommentTextTabGeneral */


var SurveyQuestionCommentEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionCommentEditor, _super);
    function SurveyQuestionCommentEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionCommentEditor.prototype.createGeneralTab = function () { return new SurveyQuestionCommentTextTabGeneral(this.questionBase, 0, this.properties); };
    return SurveyQuestionCommentEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

var SurveyQuestionCommentTextTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionCommentTextTabGeneral, _super);
    function SurveyQuestionCommentTextTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        return _this;
    }
    SurveyQuestionCommentTextTabGeneral.prototype.setUpProperties = function () {
        _super.prototype.setUpProperties.call(this);
        this.hasRows = this.properties.getProperty("rows") != null;
        this.hasPlaceHolder = this.properties.getProperty("placeHolder") != null;
        //TODO
        this.koRows = ko.observable();
        this.koPlaceHolder = ko.observable();
    };
    Object.defineProperty(SurveyQuestionCommentTextTabGeneral.prototype, "hasAdditionalTemplate", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionCommentTextTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return "questioneditortab-comment"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionCommentTextTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasRows)
            this.koRows(this.questionBase["rows"]);
        if (this.hasPlaceHolder)
            this.koPlaceHolder(this.questionBase["placeHolder"]);
    };
    SurveyQuestionCommentTextTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasRows) {
            var rows = parseInt(this.koRows());
            if (rows < 1)
                rows = 1;
            if (rows > 100)
                rows = 100;
            this.koRows(rows);
            this.questionBase["rows"] = this.koRows();
        }
        if (this.hasPlaceHolder)
            this.questionBase["placeHolder"] = this.koPlaceHolder();
    };
    return SurveyQuestionCommentTextTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["d" /* SurveyQuestionEditorTabGeneral */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("comment", function (question, onCanShowPropertyCallback) { return new SurveyQuestionCommentEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionFileEditor; });
/* unused harmony export SurveyQuestionEditorFileTabGeneral */


var SurveyQuestionFileEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionFileEditor, _super);
    function SurveyQuestionFileEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionFileEditor.prototype.addTabs = function (tabs) {
        _super.prototype.addTabs.call(this, tabs);
        tabs.push(new SurveyQuestionEditorFileTabGeneral(this.questionBase, 10, this.properties));
    };
    return SurveyQuestionFileEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

var SurveyQuestionEditorFileTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorFileTabGeneral, _super);
    function SurveyQuestionEditorFileTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        _this.setUpProperties();
        _this.reset();
        return _this;
    }
    Object.defineProperty(SurveyQuestionEditorFileTabGeneral.prototype, "name", {
        get: function () { return "fileOptions"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorFileTabGeneral.prototype.setUpProperties = function () {
        this.hasShowPreview = this.properties.getProperty("showPreview") != null;
        this.hasStoreDataAsText = this.properties.getProperty("storeDataAsText") != null;
        this.hasMaxSize = this.properties.getProperty("maxSize") != null;
        this.hasImageHeight = this.properties.getProperty("imageHeight") != null;
        this.hasImageWidth = this.properties.getProperty("imageWidth") != null;
        this.koShowPreview = ko.observable();
        this.koStoreDataAsText = ko.observable();
        this.koMaxSize = ko.observable();
        this.koImageHeight = ko.observable();
        this.koImageWidth = ko.observable();
    };
    SurveyQuestionEditorFileTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasShowPreview)
            this.koShowPreview(this.questionBase["showPreview"]);
        if (this.hasStoreDataAsText)
            this.koStoreDataAsText(this.questionBase["storeDataAsText"]);
        if (this.hasMaxSize)
            this.koMaxSize(this.questionBase["maxSize"]);
        if (this.hasImageHeight)
            this.koImageHeight(this.questionBase["imageHeight"]);
        if (this.hasImageWidth)
            this.koImageWidth(this.questionBase["imageWidth"]);
    };
    SurveyQuestionEditorFileTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasShowPreview)
            this.questionBase["showPreview"] = this.koShowPreview();
        if (this.hasStoreDataAsText)
            this.questionBase["storeDataAsText"] = this.koStoreDataAsText();
        if (this.hasMaxSize)
            this.questionBase["maxSize"] = this.koMaxSize();
        if (this.hasImageHeight)
            this.questionBase["imageHeight"] = this.koImageHeight();
        if (this.hasImageWidth)
            this.questionBase["imageWidth"] = this.koImageWidth();
    };
    return SurveyQuestionEditorFileTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["c" /* SurveyQuestionEditorTabBase */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("file", function (question, onCanShowPropertyCallback) { return new SurveyQuestionFileEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionHtmlEditor; });


var SurveyQuestionHtmlEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionHtmlEditor, _super);
    function SurveyQuestionHtmlEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionHtmlEditor.prototype.getPropertiesTabs = function (propTabs) {
        _super.prototype.getPropertiesTabs.call(this, propTabs);
        propTabs.push({ propertyName: "html", visibleIndex: 10 });
    };
    return SurveyQuestionHtmlEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("html", function (question, onCanShowPropertyCallback) { return new SurveyQuestionHtmlEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__questionMatrixDropdownEditor__ = __webpack_require__(18);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionMatrixDynamicEditor; });
/* unused harmony export SurveyQuestionEditorMatrixDynamicTabGeneral */



var SurveyQuestionMatrixDynamicEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionMatrixDynamicEditor, _super);
    function SurveyQuestionMatrixDynamicEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionMatrixDynamicEditor.prototype.createGeneralTab = function () { return new SurveyQuestionEditorMatrixDynamicTabGeneral(this.questionBase, 0, this.properties); };
    return SurveyQuestionMatrixDynamicEditor;
}(__WEBPACK_IMPORTED_MODULE_2__questionMatrixDropdownEditor__["a" /* SurveyQuestionMatrixDropdownEditor */]));

var SurveyQuestionEditorMatrixDynamicTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorMatrixDynamicTabGeneral, _super);
    function SurveyQuestionEditorMatrixDynamicTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        return _this;
    }
    SurveyQuestionEditorMatrixDynamicTabGeneral.prototype.setUpProperties = function () {
        _super.prototype.setUpProperties.call(this);
        this.hasRowCount = this.properties.getProperty("rowCount") != null;
        this.hasAddRowText = this.properties.getProperty("addRowText") != null;
        this.hasRemoveRowText = this.properties.getProperty("removeRowText") != null;
        this.koRowCount = ko.observable();
        this.koAddRowText = ko.observable();
        this.koRemoveRowText = ko.observable();
    };
    Object.defineProperty(SurveyQuestionEditorMatrixDynamicTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return "questioneditortab-matrixdynamic"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorMatrixDynamicTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasRowCount)
            this.koRowCount(this.questionBase["rowCount"]);
        if (this.hasAddRowText)
            this.koAddRowText(this.questionBase["addRowText"]);
        if (this.hasRemoveRowText)
            this.koRemoveRowText(this.questionBase["removeRowText"]);
    };
    SurveyQuestionEditorMatrixDynamicTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasRowCount)
            this.questionBase["rowCount"] = this.koRowCount();
        if (this.hasAddRowText)
            this.questionBase["addRowText"] = this.koAddRowText();
        if (this.hasRemoveRowText)
            this.questionBase["removeRowText"] = this.koRemoveRowText();
    };
    return SurveyQuestionEditorMatrixDynamicTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_2__questionMatrixDropdownEditor__["b" /* SurveyQuestionEditorMatrixDropdownTabGeneral */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("matrixdynamic", function (question, onCanShowPropertyCallback) { return new SurveyQuestionMatrixDynamicEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionMatrixEditor; });


var SurveyQuestionMatrixEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionMatrixEditor, _super);
    function SurveyQuestionMatrixEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionMatrixEditor.prototype.getPropertiesTabs = function (propTabs) {
        _super.prototype.getPropertiesTabs.call(this, propTabs);
        propTabs.push({ propertyName: "columns", visibleIndex: 10 });
    };
    return SurveyQuestionMatrixEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("matrix", function (question, onCanShowPropertyCallback) { return new SurveyQuestionMatrixEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__editorLocalization__ = __webpack_require__(3);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionMultipleTextEditor; });
/* unused harmony export SurveyQuestionEditorMultipleTextTabGeneral */



var SurveyQuestionMultipleTextEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionMultipleTextEditor, _super);
    function SurveyQuestionMultipleTextEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionMultipleTextEditor.prototype.getPropertiesTabs = function (propTabs) {
        _super.prototype.getPropertiesTabs.call(this, propTabs);
        propTabs.push({ propertyName: "items", visibleIndex: 10, title: __WEBPACK_IMPORTED_MODULE_2__editorLocalization__["a" /* editorLocalization */].getString("pe.multipleTextItems") });
    };
    SurveyQuestionMultipleTextEditor.prototype.createGeneralTab = function () { return new SurveyQuestionEditorMultipleTextTabGeneral(this.questionBase, 0, this.properties); };
    return SurveyQuestionMultipleTextEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

var SurveyQuestionEditorMultipleTextTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorMultipleTextTabGeneral, _super);
    function SurveyQuestionEditorMultipleTextTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        return _this;
    }
    SurveyQuestionEditorMultipleTextTabGeneral.prototype.setUpProperties = function () {
        _super.prototype.setUpProperties.call(this);
        this.colCountProperty = this.properties.getProperty("colCount");
        this.hasColCount = this.colCountProperty != null;
        this.koColCountChoices = ko.observableArray();
        if (this.hasColCount) {
            this.koColCountChoices(this.colCountProperty.choices);
        }
        this.koColCount = ko.observable();
    };
    Object.defineProperty(SurveyQuestionEditorMultipleTextTabGeneral.prototype, "hasAdditionalTemplate", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorMultipleTextTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return "questioneditortab-multipletext"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorMultipleTextTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasColCount)
            this.koColCount(this.questionBase["colCount"]);
    };
    SurveyQuestionEditorMultipleTextTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasColCount)
            this.questionBase["colCount"] = this.koColCount();
    };
    return SurveyQuestionEditorMultipleTextTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["d" /* SurveyQuestionEditorTabGeneral */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("multipletext", function (question, onCanShowPropertyCallback) { return new SurveyQuestionMultipleTextEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionRatingEditor; });
/* unused harmony export SurveyQuestionEditorRatingTabGeneral */


var SurveyQuestionRatingEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionRatingEditor, _super);
    function SurveyQuestionRatingEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionRatingEditor.prototype.getPropertiesTabs = function (propTabs) {
        _super.prototype.getPropertiesTabs.call(this, propTabs);
        propTabs.push({ propertyName: "rateValues", visibleIndex: 10 });
    };
    SurveyQuestionRatingEditor.prototype.createGeneralTab = function () { return new SurveyQuestionEditorRatingTabGeneral(this.questionBase, 0, this.properties); };
    return SurveyQuestionRatingEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

var SurveyQuestionEditorRatingTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorRatingTabGeneral, _super);
    function SurveyQuestionEditorRatingTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        return _this;
    }
    SurveyQuestionEditorRatingTabGeneral.prototype.setUpProperties = function () {
        _super.prototype.setUpProperties.call(this);
        this.hasMininumRateDescription = this.properties.getProperty("mininumRateDescription") != null;
        this.hasMaximumRateDescription = this.properties.getProperty("maximumRateDescription") != null;
        this.koMininumRateDescription = ko.observableArray();
        this.koMaximumRateDescription = ko.observable();
    };
    Object.defineProperty(SurveyQuestionEditorRatingTabGeneral.prototype, "hasAdditionalTemplate", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorRatingTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return "questioneditortab-rating"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorRatingTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasMininumRateDescription)
            this.koMininumRateDescription(this.questionBase["mininumRateDescription"]);
        if (this.hasMaximumRateDescription)
            this.koMaximumRateDescription(this.questionBase["maximumRateDescription"]);
    };
    SurveyQuestionEditorRatingTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasMininumRateDescription)
            this.questionBase["mininumRateDescription"] = this.koMininumRateDescription();
        if (this.hasMaximumRateDescription)
            this.questionBase["maximumRateDescription"] = this.koMaximumRateDescription();
    };
    return SurveyQuestionEditorRatingTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["d" /* SurveyQuestionEditorTabGeneral */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("rating", function (question, onCanShowPropertyCallback) { return new SurveyQuestionRatingEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionSelectBaseEditor; });


var SurveyQuestionSelectBaseEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionSelectBaseEditor, _super);
    function SurveyQuestionSelectBaseEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionSelectBaseEditor.prototype.getPropertiesTabs = function (propTabs) {
        _super.prototype.getPropertiesTabs.call(this, propTabs);
        propTabs.push({ propertyName: "choices", visibleIndex: 10 });
        propTabs.push({ propertyName: "choicesByUrl", visibleIndex: 11 });
    };
    return SurveyQuestionSelectBaseEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("selectbase", function (question, onCanShowPropertyCallback) { return new SurveyQuestionSelectBaseEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__questionEditorBase__ = __webpack_require__(4);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyQuestionTextEditor; });
/* unused harmony export SurveyQuestionEditorTextTabGeneral */


var SurveyQuestionTextEditor = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionTextEditor, _super);
    function SurveyQuestionTextEditor(questionBase, onCanShowPropertyCallback) {
        var _this = _super.call(this, questionBase, onCanShowPropertyCallback) || this;
        _this.questionBase = questionBase;
        return _this;
    }
    SurveyQuestionTextEditor.prototype.createGeneralTab = function () { return new SurveyQuestionEditorTextTabGeneral(this.questionBase, 0, this.properties); };
    return SurveyQuestionTextEditor;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */]));

var SurveyQuestionEditorTextTabGeneral = (function (_super) {
    __WEBPACK_IMPORTED_MODULE_0_tslib__["a" /* __extends */](SurveyQuestionEditorTextTabGeneral, _super);
    function SurveyQuestionEditorTextTabGeneral(questionBase, visibleIndex, properties) {
        var _this = _super.call(this, questionBase, visibleIndex, properties) || this;
        _this.questionBase = questionBase;
        _this.visibleIndex = visibleIndex;
        return _this;
    }
    SurveyQuestionEditorTextTabGeneral.prototype.setUpProperties = function () {
        _super.prototype.setUpProperties.call(this);
        this.inputTypeProperty = this.properties.getProperty("inputType");
        this.hasInputType = this.inputTypeProperty != null;
        this.hasPlaceHolder = this.properties.getProperty("placeHolder") != null;
        this.koInputTypeChoices = ko.observableArray();
        if (this.inputTypeProperty) {
            this.koInputTypeChoices(this.inputTypeProperty.choices);
        }
        this.koInputType = ko.observable();
        this.koPlaceHolder = ko.observable();
    };
    Object.defineProperty(SurveyQuestionEditorTextTabGeneral.prototype, "hasAdditionalTemplate", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyQuestionEditorTextTabGeneral.prototype, "additionalTemplateHtml", {
        get: function () { return "questioneditortab-text"; },
        enumerable: true,
        configurable: true
    });
    SurveyQuestionEditorTextTabGeneral.prototype.reset = function () {
        _super.prototype.reset.call(this);
        if (this.hasInputType)
            this.koInputType(this.questionBase["inputType"]);
        if (this.hasPlaceHolder)
            this.koPlaceHolder(this.questionBase["placeHolder"]);
    };
    SurveyQuestionEditorTextTabGeneral.prototype.apply = function () {
        _super.prototype.apply.call(this);
        if (this.hasInputType)
            this.questionBase["inputType"] = this.koInputType();
        if (this.hasPlaceHolder)
            this.questionBase["placeHolder"] = this.koPlaceHolder();
    };
    return SurveyQuestionEditorTextTabGeneral;
}(__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["d" /* SurveyQuestionEditorTabGeneral */]));

__WEBPACK_IMPORTED_MODULE_1__questionEditorBase__["b" /* SurveyQuestionEditorBase */].registerEditor("text", function (question, onCanShowPropertyCallback) { return new SurveyQuestionTextEditor(question, onCanShowPropertyCallback); });


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "<div class=\"svd_container\">\r\n    <ul class=\"navbar-default container-fluid nav nav-tabs svd_menu\">\r\n        <li data-bind=\"css: {active: koViewType() == 'designer'}\"><a href=\"#\" data-bind=\"click:selectDesignerClick, text: $root.getLocString('ed.designer')\"></a></li>\r\n        <li data-bind=\"visible: showJSONEditorTab, css: {active: koViewType() == 'editor'}\"><a href=\"#\" data-bind=\"click:selectEditorClick, text: $root.getLocString('ed.jsonEditor')\"></a></li>\r\n        <li data-bind=\"visible: showTestSurveyTab, css: {active: koViewType() == 'test'}\"><a href=\"#\" data-bind=\"click:selectTestClick, text: $root.getLocString('ed.testSurvey')\"></a></li>\r\n        <li data-bind=\"visible: showEmbededSurveyTab, css: {active: koViewType() == 'embed'}\"><a href=\"#\" data-bind=\"click:selectEmbedClick, text: $root.getLocString('ed.embedSurvey')\"></a></li>\r\n\r\n        <li class=\"svd_actions\" data-bind=\"visible: koIsShowDesigner\">\r\n            <button type=\"button\" class=\"btn btn-primary\" data-bind=\"enable:undoRedo.koCanUndo, click: doUndoClick\"><span data-bind=\"text: $root.getLocString('ed.undo')\"></span></button>\r\n        </li>\r\n        <li class=\"svd_actions\" data-bind=\"visible: koIsShowDesigner\">\r\n            <button type=\"button\" class=\"btn btn-primary\" data-bind=\"enable:undoRedo.koCanRedo, click: doRedoClick\"><span data-bind=\"text: $root.getLocString('ed.redo')\"></span></button>\r\n        </li>\r\n        <li class=\"svd_actions\" data-bind=\"visible: (koIsShowDesigner() && koShowOptions())\">\r\n            <div class=\"btn-group inline\">\r\n                <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" data-bind=\"text: $root.getLocString('ed.options')\">\r\n                    Options \r\n                    <span class=\"caret\"></span>\r\n                </button>\r\n                <ul class=\"dropdown-menu\">\r\n                    <li data-bind=\"css: {active: koGenerateValidJSON}\"><a href=\"#\" data-bind=\"click:generateValidJSONClick, text: $root.getLocString('ed.generateValidJSON')\"></a></li>\r\n                    <li data-bind=\"css: {active: !koGenerateValidJSON()}\"><a href=\"#\" data-bind=\"click:generateReadableJSONClick, text: $root.getLocString('ed.generateReadableJSON')\"></a></li>\r\n                </ul>\r\n            </div>\r\n        </li>\r\n        <li class=\"svd_actions\" data-bind=\"visible: koViewType() == 'test'\">\r\n            <div class=\"btn-group inline\">\r\n                <button type=\"button\" id=\"surveyTestWidth\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\r\n                    <span data-bind=\"text: $root.getLocString('ed.testSurveyWidth') + ' ' + $root.koTestSurveyWidth()\"></span>\r\n                    <span class=\"caret\"></span>\r\n                </button>\r\n                <ul class=\"dropdown-menu\" aria-labelledby=\"surveyTestWidth\">\r\n                    <li><a href=\"#\" data-bind=\"click: koTestSurveyWidth.bind($data, '100%')\">100%</a></li>\r\n                    <li><a href=\"#\" data-bind=\"click: koTestSurveyWidth.bind($data, '1200px')\">1200px</a></li>\r\n                    <li><a href=\"#\" data-bind=\"click: koTestSurveyWidth.bind($data, '1000px')\">1000px</a></li>\r\n                    <li><a href=\"#\" data-bind=\"click: koTestSurveyWidth.bind($data, '800px')\">800px</a></li>\r\n                    <li><a href=\"#\" data-bind=\"click: koTestSurveyWidth.bind($data, '600px')\">600px</a></li>\r\n                    <li><a href=\"#\" data-bind=\"click: koTestSurveyWidth.bind($data, '400px')\">400px</a></li>\r\n                </ul>\r\n            </div>\r\n        </li>\r\n        <li class=\"svd_actions\">\r\n            <button type=\"button\" class=\"btn btn-primary svd_save_btn\" data-bind=\"click: saveButtonClick, visible: koShowSaveButton\"><span data-bind=\"text: $root.getLocString('ed.saveSurvey')\"></span></button>\r\n        </li>\r\n    </ul>\r\n\r\n    <div class=\"panel svd_content\">\r\n        <div class=\"row svd_survey_designer\"  data-bind=\"visible: koViewType() == 'designer'\">\r\n            <div class=\"col-lg-2 col-md-2 col-sm-12 col-xs-12 panel panel-default svd_toolbox\">\r\n                <div class=\"btn-group-vertical\" style=\"width:100%;padding-right:2px\">\r\n                    <!-- ko foreach: questionTypes -->\r\n                    <div class=\"btn btn-default\" style=\"text-align:left; margin:1px;width:100%\" draggable=\"true\" data-bind=\"click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}, dragend: function(el, e) { $parent.dragEnd(); }}\">\r\n                        <span data-bind=\"css: 'icon-' + $data\"></span>\r\n                        <span class=\"svd_toolbox_item_text\" data-bind=\"text: $root.getLocString('qt.' + $data)\"></span>\r\n                    </div>\r\n                    <!-- /ko  -->\r\n                    <!-- ko foreach: koCustomToolboxQuestions -->\r\n                    <div class=\"btn btn-default\" style=\"text-align:left; margin:1px;width:100%\" draggable=\"true\" data-bind=\"click: $parent.clickCustomToolboxQuestion, event:{dragstart: function(el, e) { $parent.draggingCopiedQuestion($data, e); return true;}, dragend: function(el, e) { $parent.dragEnd(); }}\">\r\n                        <span class=\"icon-default\"></span>\r\n                        <span class=\"svd_toolbox_item_text\" data-bind=\"text:name\"></span>\r\n                    </div>\r\n                    <!-- /ko  -->\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-7 col-md-7 col-sm-12 col-xs-12 svd_editors\">\r\n                <div class=\"svd_pages_editor\" data-bind=\"template: { name: 'pageeditor', data: pagesEditor }\"></div>\r\n                <div class=\"svd_questions_editor\" id=\"scrollableDiv\">\r\n                    <div id=\"surveyjs\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-3 col-md-3 col-sm-12 col-xs-12 panel panel-default svd_properties\">\r\n                <div class=\"panel-heading input-group\">\r\n                    <div class=\"custom-select\">\r\n                        <select class=\"form-control\" data-bind=\"options: koObjects, optionsText: 'text', value: koSelectedObject\"></select>\r\n                    </div>\r\n                    <div class=\"input-group-btn\">\r\n                        <button class=\"btn btn-default\" type=\"button\" data-bind=\"enable: koCanDeleteObject, click: deleteCurrentObject, attr: { title: $root.getLocString('ed.delSelObject')}\"><span class=\"glyphicon glyphicon-remove\"></span></button>\r\n                    </div>\r\n                </div>\r\n                <div data-bind=\"template: { name: 'objecteditor', data: selectedObjectEditor }\"></div>\r\n                <div class=\"panel-footer\" data-bind=\"visible:surveyVerbs.koHasVerbs\">\r\n                    <div data-bind=\"template: { name: 'objectverbs', data: surveyVerbs }\"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div data-bind=\"visible: koViewType() == 'editor'\">\r\n            <div data-bind=\"template: { name: 'jsoneditor', data: jsonEditor }\"></div>\r\n        </div>\r\n\r\n        <div id=\"surveyjsTest\" data-bind=\"visible: koViewType() == 'test', style: {width: koTestSurveyWidth}\">\r\n            <div id=\"surveyjsExample\"></div>\r\n            <div id=\"surveyjsExampleResults\"></div>\r\n            <button id=\"surveyjsExamplereRun\" data-bind=\"click:selectTestClick, text: $root.getLocString('ed.testSurveyAgain')\" style=\"display:none\">Test Again</button>\r\n        </div>\r\n\r\n        <div id=\"surveyjsEmbed\" data-bind=\"visible: koViewType() == 'embed'\">\r\n            <div data-bind=\"template: { name: 'surveyembeding', data: surveyEmbeding }\"></div>\r\n        </div>\r\n    </div>\r\n    <div data-bind=\"template: { name: 'questioneditor', data: questionEditorWindow }\"></div>\r\n</div>";

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"jsoneditor\">\r\n    <div data-bind=\"visible: !hasAceEditor\">\r\n        <textarea class=\"svd_json_editor_area\" data-bind=\"textInput:koText\"></textarea>\r\n        <!-- ko foreach: koErrors -->\r\n        <div>\r\n            <span>Error: </span><span data-bind=\"text: text\"></span>\r\n        </div>\r\n        <!-- /ko  -->\r\n    </div>\r\n    <div id=\"surveyjsJSONEditor\" class=\"svd_json_editor\"></div>\r\n</script>";

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"objecteditor\">\r\n    <table class=\"table svd_table-nowrap\">\r\n        <tbody data-bind=\"foreach: koProperties\">\r\n            <tr data-bind=\"click: $parent.changeActiveProperty($data), css: {'active': $parent.koActiveProperty() == $data}\">\r\n                <td data-bind=\"text: displayName, attr: {title: title}\" width=\"50%\"></td>\r\n                <td width=\"50%\">\r\n                    <span data-bind=\"text: koText, visible: $parent.koActiveProperty() != $data && (koText() || $data.editorType == 'boolean'), attr: {title: koText}\" style=\"text-overflow:ellipsis;white-space:nowrap;overflow:hidden\"></span>\r\n                    <div data-bind=\"visible: $parent.koActiveProperty() == $data || (!koText() && $data.editorType != 'boolean')\">\r\n                        <!-- ko template: { name: 'propertyeditor-' + editorType, data: $data } -->\r\n                        <!-- /ko -->\r\n                    </div>\r\n                </td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n</script>";

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"objectverbs\">\n    <!-- ko foreach: koVerbs -->\n        <div class=\"row\">\n            <div class=\"input-group\">\n                <span  class=\"input-group-addon\" data-bind=\"text:text\"></span>\n                <select class=\"form-control\" data-bind=\"options: koItems, optionsText: 'text', optionsValue:'value', value: koSelectedItem\"></select>\n            </div>\n        </div>\n    <!-- /ko  -->\n</script>";

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"pageeditor\">\r\n    <ul class=\"nav nav-tabs\" data-bind=\"tabs:true\">\r\n        <!-- ko foreach: koPages -->\r\n        <li data-bind=\"css: {active: koSelected()},event:{\r\n           keydown:function(el, e){ $parent.keyDown(el, e); },\r\n           dragstart:function(el, e){ $parent.dragStart(el); return true; },\r\n           dragover:function(el, e){ $parent.dragOver(el);},\r\n           dragend:function(el, e){ $parent.dragEnd();},\r\n           drop:function(el, e){ $parent.dragDrop(el);}\r\n         }\"> \r\n            <a class=\"svd_page_nav\" href=\"#\" data-bind=\"click:$parent.selectPageClick\">\r\n                <span data-bind=\"text: title\"></span>\r\n            </a>\r\n        </li>\r\n        <!-- /ko  -->\r\n        <li><button class=\"btn btn-default svd_add_new_page_btn\" data-bind=\"click:addNewPageClick\"><span class=\"glyphicon glyphicon-plus\"></span></button></li>\r\n    </ul>\r\n</script>";

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-boolean\">\r\n    <input class=\"form-control\" type=\"checkbox\" data-bind=\"checked: koValue\" />\r\n</script>";

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-dropdown\">\r\n    <div class=\"custom-select\">\r\n        <select class=\"form-control\" data-bind=\"value: koValue, options: choices\"  style=\"width:100%\"></select>\r\n    </div>\r\n</script>";

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-expression\">\r\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\r\n</script>\r\n\r\n<script type=\"text/html\" id=\"propertyeditorcontent-expression\">\r\n    <div>\r\n        <textarea class=\"form-control\" data-bind=\"value:koValue\" style=\"width:100%\" rows=\"8\" autofocus=\"autofocus\"></textarea>\r\n        <span data-bind=\"text:$root.getLocString('pe.expressionHelp')\" style=\"white-space:normal\"></span>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-html\">\r\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\r\n</script>\r\n\r\n<script type=\"text/html\" id=\"propertyeditorcontent-html\">\r\n    <textarea class=\"form-control\" data-bind=\"value:koValue\" style=\"width:100%\" rows=\"10\" autofocus=\"autofocus\"></textarea>\r\n</script>\r\n";

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-itemvalues\">\r\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\r\n</script>\r\n<script type=\"text/html\" class=\"btn-xs\" id=\"propertyeditorcontent-itemvalues\">\r\n    <div style=\"margin-bottom:3px\">\r\n        <button class=\"btn-xs\" data-bind=\"css: {'btn btn-primary':koActiveView() == 'form', 'btn-link':koActiveView() != 'form'}, click:changeToFormViewClick, text: $root.getLocString('pe.formEntry')\"></button>\r\n        <button class=\"btn-xs\" data-bind=\"css: {'btn btn-primary':koActiveView() != 'form', 'btn-link':koActiveView() == 'form'}, click:changeToTextViewClick, text: $root.getLocString('pe.fastEntry')\"></button>\r\n    </div>\r\n    <div data-bind=\"visible:koActiveView() == 'form'\" style=\"overflow-y: auto; overflow-x:hidden; max-height:400px;min-height:200px\">\r\n        <table class=\"table\" >\r\n            <thead>\r\n                <tr>\r\n                    <th></th>\r\n                    <th data-bind=\"text: $root.getLocString('pe.value')\"></th>\r\n                    <th data-bind=\"text: $root.getLocString('pe.text')\"></th>\r\n                    <th></th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <!-- ko foreach: koItems -->\r\n                <tr>\r\n                    <td>\r\n                        <div class=\"btn-group\" role=\"group\">\r\n                            <button type=\"button\" class=\"btn btn-xs\" data-bind=\"visible: $index() > 0, click: $parent.onMoveUpClick\"><span class=\"glyphicon glyphicon-arrow-up\" aria-hidden=\"true\"></span></button>\r\n                            <button type=\"button\" class=\"btn btn-xs\" style=\"float:none\" data-bind=\"visible: $index() < $parent.koItems().length - 1, click: $parent.onMoveDownClick\"><span class=\"glyphicon glyphicon-arrow-down\" aria-hidden=\"true\"></span></button>\r\n                        </div>\r\n                    </td>\r\n                    <td>\r\n                        <input type=\"text\" class=\"form-control\" data-bind=\"value:koValue\" style=\"width:200px\" />\r\n                        <div class=\"alert alert-danger no-padding\" role=\"alert\" data-bind=\"visible:koHasError, text: $root.getLocString('pe.enterNewValue')\"></div>\r\n                    </td>\r\n                    <td><input type=\"text\" class=\"form-control\" data-bind=\"value:koText\" style=\"width:200px\" /></td>\r\n                    <td><button type=\"button\" class=\"btn btn-xs\" data-bind=\"click: $parent.onDeleteClick\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button></td>\r\n                </tr>\r\n                <!-- /ko -->\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n    <div class=\"row btn-toolbar\" data-bind=\"visible:koActiveView() == 'form'\">\r\n        <input type=\"button\" class=\"btn btn-success\" data-bind=\"click: onAddClick, value: $root.getLocString('pe.addNew')\" />\r\n        <input type=\"button\" class=\"btn btn-danger\" data-bind=\"click: onClearClick, value: $root.getLocString('pe.removeAll')\" />\r\n    </div>\r\n    <div data-bind=\"visible:koActiveView() != 'form'\">\r\n        <textarea class=\"form-control\" data-bind=\"textInput: koItemsText\" style=\"overflow-y: auto; overflow-x:hidden; max-height:400px; min-height:250px; width:100%\"></textarea>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-matrixdropdowncolumns\">\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\n</script>\n<script type=\"text/html\" id=\"propertyeditorcontent-matrixdropdowncolumns\">\n    <table class=\"table\">\n        <thead>\n            <tr>\n                <th data-bind=\"text: $root.getLocString('pe.required')\"></th>\n                <th data-bind=\"text: $root.getLocString('pe.cellType')\"></th>\n                <th data-bind=\"text: $root.getLocString('pe.name')\"></th>\n                <th data-bind=\"text: $root.getLocString('pe.title')\"></th>\n                <th></th>\n            </tr>\n        </thead>\n        <tbody>\n            <!-- ko foreach: koItems -->\n            <tr>\n                <td>\n                    <a href=\"#\" data-bind=\"visible:koHasChoices, click: onShowChoicesClick\">\n                        <span class=\"glyphicon\" data-bind=\"css: {'glyphicon-chevron-down': !koShowChoices(), 'glyphicon-chevron-up': koShowChoices()}\"></span>\n                    </a>\n                    <input type=\"checkbox\" data-bind=\"checked: koIsRequired\" />\n                </td>\n                <td>\n                    <select class=\"form-control\" data-bind=\"options: cellTypeChoices, value: koCellType\"  style=\"width:110px\"></select>\n                </td>\n                <td>\n                    <input type=\"text\" class=\"form-control\" data-bind=\"value:koName\" style=\"width:100px\" />\n                    <div class=\"alert alert-danger no-padding\" role=\"alert\" data-bind=\"visible:koHasError, text: $root.getLocString('pe.enterNewValue')\"></div>\n                </td>\n                <td><input type=\"text\" class=\"form-control\" data-bind=\"value:koTitle\" style=\"width:120px\" /></td>\n                <td><button type=\"button\" class=\"btn\" data-bind=\"click: $parent.onDeleteClick\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button></td>\n            </tr>\n            <tr data-bind=\"visible: koShowChoices() && koHasChoices()\">\n                <td colspan=\"4\" style=\"border-top-style:none\">\n                    <div class=\"form-group\">\n                        <label class=\"control-label col-sm-3\" data-bind=\"text:$root.getLocString('pe.hasOther')\"></label>\n                        <div class=\"col-sm-2\">\n                            <input type=\"checkbox\" data-bind=\"checked: koHasOther\" />\n                        </div>\n                        <div class=\"col-sm-7\" data-bind=\"visible: !koHasColCount()\"></div>\n                        <label class=\"control-label col-sm-3\" data-bind=\"visible:koHasColCount, text:$root.getLocString('pe.colCount')\"></label>\n                        <select class=\"form-control col-sm-4\" data-bind=\"visible:koHasColCount, options: colCountChoices, value: koColCount\" style=\"width:110px\"></select>\n                    </div>\n                    <div class=\"modal-body svd_notopbottompaddings\">\n                        <!-- ko template: { name: 'propertyeditorcontent-itemvalues', data: choicesEditor } -->\n                        <!-- /ko -->\n                    </div>\n                </td>\n            </tr>\n\n            <!-- /ko -->\n            <tr>\n                <td colspan=\"3\">\n                    <div class=\"row btn-toolbar\">\n                        <input type=\"button\" class=\"btn btn-success\" data-bind=\"click: onAddClick, value: $root.getLocString('pe.addNew')\"/>\n                        <input type=\"button\" class=\"btn btn-danger\" data-bind=\"click: onClearClick, value: $root.getLocString('pe.removeAll')\"\" />\n                    </div>\n                </td>\n            </tr>\n        </tbody>\n    </table>\n</script>\n";

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-modal\">\r\n    <div class=\"input-group\" data-bind=\"visible:!editor.isEditable\">\r\n        <a data-toggle=\"modal\" data-bind=\"attr: {'data-target' : modalNameTarget}\"><span data-bind=\"text: koText\"></span></a>\r\n        <div class=\"input-group-btn\">\r\n            <button class=\"btn btn-default\" data-toggle=\"modal\" style=\"padding: 2px;\" data-bind=\"attr: {'data-target' : modalNameTarget}\">\r\n                <span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class=\"input-group\" data-bind=\"visible:editor.isEditable\" style=\"display:table\">\r\n        <input class=\"form-control\" type=\"text\" data-bind=\"value: koValue\" style=\"display:table-cell; width:100%\" />\r\n        <div class=\"input-group-btn\">\r\n            <button type=\"button\" class=\"btn btn-default\" style=\"display:table-cell; padding: 2px;\"  data-toggle=\"modal\" data-bind=\"attr: {'data-target' : modalNameTarget}\">\r\n                <span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <div data-bind=\"attr: {id : modalName}\" class=\"modal fade\" role=\"dialog\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\" data-bind=\"text:editor.title\"></h4>\r\n                </div>  \r\n                <div class=\"modal-body svd_notopbottompaddings\">\r\n                    <!-- ko template: { name: 'propertyeditorcontent-' + editorType, data: editor } -->\r\n                    <!-- /ko -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <input type=\"button\" class=\"btn btn-primary\" data-bind=\"click: editor.onApplyClick, value: $root.getLocString('pe.apply')\" style=\"width:100px\" />\r\n                    <input type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" data-bind=\"click: editor.onApplyClick, value: $root.getLocString('pe.ok')\" style=\"width:100px\" />\r\n                    <input type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" data-bind=\"click: editor.onResetClick, value: $root.getLocString('pe.cancel')\" style=\"width:100px\" />\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-number\">\r\n    <input class=\"form-control\" type=\"number\" data-bind=\"value: koValue\" style=\"width:100%\" />\r\n</script>";

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-restfull\">\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\n</script>\n\n<script type=\"text/html\" id=\"propertyeditorcontent-restfull\">\n    <form>\n        <div class=\"form-group\">\n            <label for=\"url\">Url:</label>\n            <input id=\"url\" type=\"text\" data-bind=\"value:koUrl\" class=\"form-control\" />\n        </div>\n        <div class=\"form-group\">\n            <label for=\"path\">Path:</label>\n            <input id=\"path\" type=\"text\" data-bind=\"value:koPath\" class=\"form-control\" />\n        </div>\n        <div class=\"form-group\">\n            <label for=\"valueName\">valueName:</label>\n            <input id=\"valueName\" type=\"text\" data-bind=\"value:koValueName\" class=\"form-control\" />\n        </div>\n        <div class=\"form-group\">\n            <label for=\"titleName\">titleName:</label>\n            <input id=\"titleName\" type=\"text\" data-bind=\"value:koTitleName\" class=\"form-control\" />\n        </div>\n    </form>\n    <div id=\"restfullSurvey\" style=\"width:100%;height:150px\"></div>\n</script>\n";

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-string\">\r\n    <input class=\"form-control\" type=\"text\" data-bind=\"value: koValue\" style=\"width:100%\" />\r\n</script>";

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-text\">\r\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\r\n</script>\r\n\r\n<script type=\"text/html\" id=\"propertyeditorcontent-text\">\r\n    <textarea class=\"form-control\" data-bind=\"value:koValue\" style=\"width:100%\" rows=\"10\" autofocus=\"autofocus\"></textarea>\r\n</script>\r\n";

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-textitems\">\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\n</script>\n<script type=\"text/html\" id=\"propertyeditorcontent-textitems\">\n<div class=\"panel\">\n    <table class=\"table\">\n        <thead>\n            <tr>\n                <th data-bind=\"text: $root.getLocString('pe.name')\"></th>\n                <th data-bind=\"text: $root.getLocString('pe.title')\"></th>\n                <th></th>\n            </tr>\n        </thead>\n        <tbody>\n            <!-- ko foreach: koItems -->\n            <tr>\n                <td><input type=\"text\" class=\"form-control\" data-bind=\"value:koName\" style=\"width:200px\" /></td>\n                <td><input type=\"text\" class=\"form-control\" data-bind=\"value:koTitle\" style=\"width:200px\" /></td>\n                <td><button type=\"button\" class=\"btn\" data-bind=\"click: $parent.onDeleteClick\"><span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\"></span></button></td>\n            </tr>\n            <!-- /ko -->\n            <tr>\n                <td colspan=\"4\"><input type=\"button\" class=\"btn btn-success\" data-bind=\"click: onAddClick, value: $root.getLocString('pe.addNew')\"/></td>\n            </tr>\n        </tbody>\n    </table>\n</div>\n</script>";

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-triggers\">\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\n</script>\n<script type=\"text/html\" id=\"propertyeditorcontent-triggers\">\n<div class=\"panel\">\n    <div class=\"row\" style=\"margin-bottom:10px\">\n        <div class=\"col-lg-12\">\r\n            <div class=\"input-group form-inline\">\r\n                <div class=\"input-group-btn\">\r\n                    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n                        <span class=\"glyphicon glyphicon-plus\"></span>\r\n                    </button>\r\n                    <ul class=\"dropdown-menu\">\r\n                        <!-- ko foreach: availableTriggers -->\r\n                        <li><a data-bind=\"click: $parent.onAddClick($data)\"><span data-bind=\"text:$data\"></span></a></li>\r\n                        <!-- /ko  -->\r\n                    </ul>\r\n                </div>\r\n                <select class=\"form-control\" data-bind=\"options: koItems, optionsText: 'koText', value: koSelected\"></select>\r\n                <span class=\"input-group-btn\">\r\n                    <button type=\"button\" data-bind=\"enable: koSelected() != null, click: onDeleteClick\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-remove\"></span></button>\r\n                </span>\r\n            </div>\r\n        </div>\n    </div>\n    <div data-bind=\"visible: koSelected() == null\">\n        <div data-bind=\"visible: koQuestions().length == 0, text: $root.getLocString('pe.noquestions')\"></div>\n        <div data-bind=\"visible: koQuestions().length > 0, text: $root.getLocString('pe.createtrigger')\"></div>\n    </div>\n    <div data-bind=\"visible: koSelected() != null\">\n        <div data-bind=\"with: koSelected\">\n            <div class=\"row\"  style=\"margin-bottom:10px\">\n                <div class=\"col-lg-4 col-sm-4\">\n                    <div class=\"input-group  form-inline\">\r\n                        <div class=\"form-group\">\r\n                            <span class=\"input-group\" data-bind=\"text: $root.getLocString('pe.triggerOn')\"></span>\r\n                        </div>\r\n                        <div class=\"form-group\">\r\n                            <select class=\"form-control\" data-bind=\"options:$parent.koQuestions, value: koName\"></select>\r\n                        </div>\r\n                    </div>\n                </div>\n                <div class=\"col-lg-4 col-sm-4\">\n                    <div class=\"input-group\">\r\n                        <select class=\"form-control\" data-bind=\"options:availableOperators, optionsValue: 'name', optionsText: 'text', value:koOperator\"></select>\r\n                    </div>\n                </div>\n                <div class=\"col-lg-4 col-sm-4\">\n                    <div class=\"input-group\">\r\n                        <input class=\"form-control\" type=\"text\" data-bind=\"visible: koRequireValue, value:koValue\" />\r\n                    </div>\n                </div>\n            </div>\n            <!-- ko if: koType() == 'visibletrigger' -->\n            <div class=\"row\">\n                <div class=\"col-lg-6 col-sm-6\">\n                    <!-- ko template: { name: 'propertyeditor-triggersitems', data: pages } -->\n                    <!-- /ko -->\n                </div>\n                <div class=\"col-lg-6 col-sm-6\">\n                    <!-- ko template: { name: 'propertyeditor-triggersitems', data: questions } -->\n                    <!-- /ko -->\n                </div>\n            </div>\n            <!-- /ko -->\n            <!-- ko if: koType() == 'completetrigger' -->\n            <div class=\"row\">\n               <div style=\"margin: 10px\" data-bind=\"text: $root.getLocString('pe.triggerCompleteText')\"></div>\n            </div>\n            <!-- /ko -->\n            <!-- ko if: koType() == 'setvaluetrigger' -->\n            <div class=\"row\">\n                <div class=\"col-lg-4 col-sm-4\">\r\n                    <div class=\"input-group form-inline\">\r\n                        <div>\r\n                            <span data-bind=\"text: $root.getLocString('pe.triggerSetToName')\"></span>\r\n                        </div>\r\n                        <input class=\"form-control\" type=\"text\" data-bind=\"value:kosetToName\" />\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-lg-4 col-sm-4\">\r\n                    <div class=\"input-group form-inline\">\r\n                        <div>\r\n                            <span data-bind=\"text: $root.getLocString('pe.triggerSetValue')\"></span>\r\n                        </div>\r\n                        <input class=\"form-control\" type=\"text\" data-bind=\"value:kosetValue\" />\r\n                    </div>\r\n                </div>\r\n            </div>\n            <div class=\"row\">\r\n                <div class=\"col-lg-4 col-sm-4\">\r\n                    <div class=\"input-group\">\r\n                        <input type=\"checkbox\" data-bind=\"checked: koisVariable\" /> <span data-bind=\"text: $root.getLocString('pe.triggerIsVariable')\"></span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"col-lg-8 col-sm-8\">\r\n                </div>\r\n            </div>\r\n            <!-- /ko -->\r\n        </div>\n    </div>\n</div>\n</script>";

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-triggersitems\">\n    <div class=\"panel no-margins no-padding\">\n        <div data-bind=\"text: title\" style=\"margin-bottom:10px\"></div>\n        <div class=\"input-group\">\n            <select class=\"form-control\" multiple=\"multiple\" data-bind=\"options:koChoosen, value: koChoosenSelected\"></select>\n            <span class=\"input-group-btn\" style=\"vertical-align:top\">\n                <button type=\"button\" data-bind=\"enable: koChoosenSelected() != null, click: onDeleteClick\" class=\"btn\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n            </span>\n        </div>\n        <div class=\"input-group\" style=\"margin-top:5px\">\n            <select class=\"form-control\" data-bind=\"options:koObjects, value: koSelected\"></select>\n            <span class=\"input-group-btn\">\n                <button type=\"button\" class=\"btn btn-default\" data-bind=\"enable: koSelected() != null, click: onAddClick\" class=\"btn btn-success\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n            </span>\n        </div>\n    </div>\n</script>";

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"propertyeditor-validators\">\n    <!-- ko template: { name: 'propertyeditor-modal', data: $data } --><!-- /ko -->\n</script>\n<script type=\"text/html\" id=\"propertyeditorcontent-validators\">\n<div class=\"panel\">\n    <div class=\"panel-heading\">\n        <div class=\"row input-group\">\n            <button type=\"button\" class=\"dropdown-toggle input-group-addon\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                <span class=\"glyphicon glyphicon-plus\"></span>\n            </button>\n            <ul class=\"dropdown-menu input-group\">\n                <!-- ko foreach: availableValidators -->\n                <li><a href=\"#\" data-bind=\"click: $parent.onAddClick($data)\"><span data-bind=\"text:$data\"></span></a></li>\n                <!-- /ko  -->\n            </ul>\n            <select class=\"form-control\" data-bind=\"options: koItems, optionsText: 'text', value: koSelected\"></select>\n            <span class=\"input-group-btn\">\n                <button type=\"button\" data-bind=\"enable: koSelected() != null, click: onDeleteClick\" class=\"btn\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n            </span>\n        </div>\n    </div>\n    <div data-bind=\"template: { name: 'objecteditor', data: selectedObjectEditor }\"></div>\n</div>\n</script>";

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditor\">\r\n    <div id=\"surveyquestioneditorwindow\" class=\"modal fade\" role=\"dialog\"data-bind=\"with:koEditor\">\r\n        <div class=\"modal-dialog\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\r\n                    <h4 class=\"modal-title\" data-bind=\"text:koTitle\"></h4>\r\n                </div>  \r\n                <div class=\"modal-body svd_notopbottompaddings\">\r\n                    <ul class=\"nav nav-tabs\" data-bind=\"foreach: koTabs\">\r\n                        <li role=\"presentation\" data-bind=\"css: {active: $parent.koActiveTab() == $data.name}, click: $parent.onTabClick\"><a><span data-bind=\"text:$data.title\"></span></a></li>\r\n                    </ul>               \r\n                    <!-- ko foreach: koTabs -->\r\n                    <div data-bind=\"visible:$parent.koActiveTab() == $data.name\">\r\n                        <!-- ko template: { name: $data.htmlTemplate, data: $data.templateObject } -->\r\n                        <!-- /ko -->\r\n                    </div>\r\n                    <!-- /ko  -->\r\n                </div>\r\n                <div class=\"modal-footer\">\r\n                    <input type=\"button\" class=\"btn btn-primary\" data-bind=\"click: onApplyClick, value: $root.getLocString('pe.apply')\" style=\"width:100px\" />\r\n                    <input type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" data-bind=\"click: onApplyClick, value: $root.getLocString('pe.ok')\" style=\"width:100px\" />\r\n                    <input type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" data-bind=\"click: onResetClick, value: $root.getLocString('pe.cancel')\" style=\"width:100px\" />\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-comment\">\r\n    <div  class=\"form-group\" data-bind=\"visible:hasRows\">\r\n        <label>Row count:</label>\r\n        <input type=\"number\" class=\"form-control\" data-bind=\"value: koRows\" />\r\n    </div>\r\n    <div  class=\"form-group\" data-bind=\"visible:hasPlaceHolder\">\r\n        <label>Placeholder:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koPlaceHolder\" />\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-fileOptions\">\r\n    <div class=\"form-group\">\r\n        <span class=\"checkbox-inline\" data-bind=\"visible:hasShowPreview\"><input type=\"checkbox\" data-bind=\"checked: koShowPreview\"><label>Show preview for image files</label></span>\r\n        <span class=\"checkbox-inline\" data-bind=\"visible:hasStoreDataAsText\"><input type=\"checkbox\" data-bind=\"checked: koStoreDataAsText\"><label>Store file content directly in JSON</label></span>\r\n    </div>\r\n    <div  class=\"form-group\" data-bind=\"visible:hasMaxSize\">\r\n        <label>Maximum file size for uploading:</label>\r\n        <input type=\"number\" class=\"form-control\" data-bind=\"value: koMaxSize\" />\r\n    </div>\r\n    <div class=\"form-group\" data-bind=\"visible:hasImageHeight\">\r\n        <label>Preview image height:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koImageHeight\" />\r\n    </div>\r\n    <div class=\"form-group\" data-bind=\"visible:hasImageWidth\">\r\n        <label>Preview image width:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koImageWidth\" />\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-general\">\r\n    <div>\r\n        <div class=\"form-group\">\r\n            <label>Name:</label>\r\n            <input type=\"text\" class=\"form-control\" data-bind=\"value: koName\" />\r\n        </div>\r\n        <div  class=\"form-group\" data-bind=\"visible:hasTitle\">\r\n            <label>Title:</label>\r\n            <textarea type=\"text\" rows=\"2\" class=\"form-control\" data-bind=\"value: koTitle\"></textarea>\r\n        </div>\r\n        <div class=\"form-group\">\r\n            <span class=\"checkbox-inline\" data-bind=\"visible:hasVisible\"><input type=\"checkbox\" data-bind=\"checked: koVisible\"><label>Visible</label></span>\r\n            <span class=\"checkbox-inline\" data-bind=\"visible:hasIsRequired\"><input type=\"checkbox\" data-bind=\"checked: koIsRequired\"><label>Required</label></span>\r\n            <span class=\"checkbox-inline\" data-bind=\"visible:hasStartWithNewLine\"><input type=\"checkbox\" data-bind=\"checked: koStartWithNewLine\"><label>Start with new line</label></span>\r\n        </div>\r\n        <div data-bind=\"visible:hasAdditionalTemplate\">\r\n            <!-- ko template: { name: $data.additionalTemplateHtml, data: $data } -->\r\n            <!-- /ko -->\r\n        </div>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-matrixdropdown\">\r\n    <div  class=\"form-group\" data-bind=\"visible:hasCellType\">\r\n        <label>Default cell editor type:</label>\r\n        <select class=\"form-control\"  data-bind=\"value: koCellType, options: koCellTypeChoices\"></select>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-matrixdynamic\">\r\n    <div  class=\"form-group\" data-bind=\"visible:hasCellType\">\r\n        <label>Default cell editor type:</label>\r\n        <select class=\"form-control\"  data-bind=\"value: koCellType, options: koCellTypeChoices\"></select>\r\n    </div>\r\n    <div class=\"form-group\" data-bind=\"visible:hasRowCount\">\r\n        <label>Default row count:</label>\r\n        <input type=\"number\" class=\"form-control\" data-bind=\"value: koRowCount\" />\r\n    </div>\r\n    <div class=\"form-group\" data-bind=\"visible:hasAddRowText\">\r\n        <label>Add row button text:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koAddRowText\" />\r\n    </div>\r\n    <div class=\"form-group\" data-bind=\"visible:hasRemoveRowText\">\r\n        <label>Remove row button text:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koRemoveRowText\" />\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-multipletext\">\r\n    <div  class=\"form-group\" data-bind=\"visible:hasColCount\">\r\n        <label>Input texts column count:</label>\r\n        <select class=\"form-control\"  data-bind=\"value: koColCount, options: koColCountChoices\"></select>\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-rating\">\r\n    <div  class=\"form-group\" data-bind=\"visible:hasMininumRateDescription\">\r\n        <label>Minimum rate text:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koMininumRateDescription\" />\r\n    </div>\r\n    <div  class=\"form-group\" data-bind=\"visible:hasMaximumRateDescription\">\r\n        <label>Maximum rate text:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koMaximumRateDescription\" />\r\n    </div>\r\n</script>";

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"questioneditortab-text\">\r\n    <div  class=\"form-group\" data-bind=\"visible:hasInputType\">\r\n        <label>Input type:</label>\r\n        <select class=\"form-control\"  data-bind=\"value: koInputType, options: koInputTypeChoices\"></select>\r\n    </div>\r\n    <div  class=\"form-group\" data-bind=\"visible:hasPlaceHolder\">\r\n        <label>Placeholder:</label>\r\n        <input type=\"text\" class=\"form-control\" data-bind=\"value: koPlaceHolder\" />\r\n    </div>\r\n</script>\r\n";

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "<script type=\"text/html\" id=\"surveyembeding\">\r\n    <div class=\"row\">\r\n        <select data-bind=\"value:koLibraryVersion\">\r\n            <option value=\"angular\" data-bind=\"text: $root.getLocString('ew.angular')\"></option>\r\n            <option value=\"jquery\" data-bind=\"text: $root.getLocString('ew.jquery')\"></option>\r\n            <option value=\"knockout\" data-bind=\"text: $root.getLocString('ew.knockout')\"></option>\r\n            <option value=\"react\" data-bind=\"text: $root.getLocString('ew.react')\"></option>\r\n        </select>\r\n        <select data-bind=\"value:koScriptUsing\">\r\n            <option value=\"bootstrap\" data-bind=\"text: $root.getLocString('ew.bootstrap')\"></option>\r\n            <option value=\"standard\" data-bind=\"text: $root.getLocString('ew.standard')\"></option>\r\n        </select>\r\n        <select data-bind=\"value:koShowAsWindow\">\r\n            <option value=\"page\" data-bind=\"text: $root.getLocString('ew.showOnPage')\"></option>\r\n            <option value=\"window\" data-bind=\"text: $root.getLocString('ew.showInWindow')\"></option>\r\n        </select>\r\n        <label class=\"checkbox-inline\" data-bind=\"visible:koHasIds\">\r\n            <input type=\"checkbox\" data-bind=\"checked:koLoadSurvey\" />\r\n            <span data-bind=\"text: $root.getLocString('ew.loadFromServer')\"></span>\r\n        </label>\r\n    </div>\r\n    <div class=\"panel\">\r\n        <div class=\"panel-heading\" data-bind=\"text: $root.getLocString('ew.titleScript')\"></div>\r\n        <div data-bind=\"visible:hasAceEditor\">\r\n            <div id=\"surveyEmbedingHead\" style=\"height:70px;width:100%\"></div>\r\n        </div>\r\n        <textarea data-bind=\"visible:!hasAceEditor, text: koHeadText\" style=\"height:70px;width:100%\"></textarea>\r\n    </div>\r\n    <div class=\"panel\" data-bind=\"visible: koVisibleHtml\">\r\n        <div class=\"panel-heading\"  data-bind=\"text: $root.getLocString('ew.titleHtml')\"></div>\r\n        <div data-bind=\"visible:hasAceEditor\">\r\n            <div id=\"surveyEmbedingBody\" style=\"height:30px;width:100%\"></div>\r\n        </div>\r\n        <textarea data-bind=\"visible:!hasAceEditor, text: koBodyText\" style=\"height:30px;width:100%\"></textarea>\r\n    </div>\r\n    <div class=\"panel\">\r\n        <div class=\"panel-heading\"  data-bind=\"text: $root.getLocString('ew.titleJavaScript')\"></div>\r\n        <div data-bind=\"visible:hasAceEditor\">\r\n            <div id=\"surveyEmbedingJava\" style=\"height:300px;width:100%\"></div>\r\n        </div>\r\n        <textarea data-bind=\"visible:!hasAceEditor, text: koJavaText\" style=\"height:300px;width:100%\"></textarea>\r\n    </div>\r\n</script>";

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<div data-bind=\"event:{\n           dragenter:function(el, e){ dragEnter(e);},\n           dragleave:function(el, e){ dragLeave(e);},\n           dragover:function(el, e){ return false;},\n           drop:function(el, e){ dragDrop(e);}}\n     \">\n    <h4 data-bind=\"visible: (title.length > 0) && data.showPageTitles, text: koNo() + processedTitle, css: $root.css.pageTitle\"></h4>\n    <!-- ko foreach: { data: rows, as: 'row'} -->\n    <div class=\"svd_question_container\" data-bind=\"visible: row.koVisible, css: $root.css.row\">\n        <!-- ko foreach: { data: row.questions, as: 'question' , afterRender: row.koAfterRender } -->\n            <div data-bind=\"visible: question.koIsDragging\">\n                <!-- ko template: { if: $root.koDraggingSource(), name: 'survey-question', data: $root.koDraggingSource(), as: 'question', templateOptions: { isDragging: true } } -->\n                <!-- /ko -->\n            </div>\n            <!-- ko template: { name: 'survey-question', data: question, templateOptions: { isDragging: false } } -->\n            <!-- /ko -->\n        <!-- /ko -->\n    </div>\n    <!-- /ko -->\n    <div class=\"well\" data-bind=\"visible:$root.isDesignMode && questions.length == 0\">\n        <span data-bind=\"visible: !koDraggingBottom(), text:$root.getEditorLocString('survey.dropQuestion')\"></span>\n        <div data-bind=\"visible: koDraggingBottom\">\n            <!-- ko template: { if: $root.koDraggingSource(), name: 'survey-question', data: $root.koDraggingSource(), as: 'question', templateOptions: { isDragging: true } } -->\n            <!-- /ko -->\n        </div>\n    </div>\n    <div data-bind=\"visible: questions.length > 0 && koDraggingBottom()\">\n        <!-- ko template: { if: $root.koDraggingSource(), name: 'survey-question', data: $root.koDraggingSource(), as: 'question', templateOptions: { isDragging: true } } -->\n        <!-- /ko -->\n    </div>\n</div>";

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "<div class=\"svd_question\" style=\"vertical-align:top\" data-bind=\"style: {display: question.koVisible()|| $root.isDesignMode ? 'inline-block': 'none', marginLeft: question.koMarginLeft, paddingRight: question.koPaddingRight, width: question.koRenderWidth },\n     attr : {id: id, draggable: $root.isDesignMode}, click: $root.isDesignMode ? koOnClick: null, \n         event:{\n           keydown: function(el, e) { if(e.witch == 46) $root.deleteCurrentObjectClick(); return true; },\n           dragstart:function(el, e){ dragStart(e); return true; },\n           dragover:function(el, e){ if(!question.isDragging) dragOver(e);},\n           dragend:function(el, e){ dragEnd(e);},\n           drop:function(el, e){ dragDrop(e);}\n         }, css:{svd_q_design_border: $root.isDesignMode, svd_q_selected : koIsSelected, 'well well-sm': $root.isDesignMode}\">\n    <div data-bind=\"css:{svd_q_design: $root.isDesignMode}, style:{opacity: question.koIsDraggingSource() ? 0.4 : 1}\">\n        <div class=\"alert alert-danger\" role=\"alert\" data-bind=\"visible: koErrors().length > 0, foreach: koErrors\">\n            <div>\n                <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n                <span data-bind=\"text:$data.getText()\"></span>\n            </div>\n        </div>\n        <!-- ko if: question.hasTitle -->\n        <h5 data-bind=\"visible: $root.questionTitleLocation == 'top', text: question.koTitle(), css: $root.css.question.title\"></h5>\n        <!-- /ko -->\n        <!-- ko template: { name: 'survey-question-' + question.getType(), data: question } -->\n        <!-- /ko -->\n        <div data-bind=\"visible: question.hasComment\">\n            <div data-bind=\"text:question.commentText\"></div>\n            <div data-bind=\"template: { name: 'survey-comment', data: {'question': question, 'visible': true } }\"></div>\n        </div>\n        <!-- ko if: question.hasTitle -->\n        <h5 data-bind=\"visible: $root.questionTitleLocation == 'bottom', text: question.koTitle(), css: $root.css.question.title\"></h5>\n        <!-- /ko -->\n    </div>\n\n    <div class=\"svd_question_menu\" data-bind=\"visible: koIsSelected\">\n        <div class=\"btn-group\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-primary  btn-xs\" data-bind=\"click: $root.editQuestionClick\"><span>Edit</span></button>\n            <button type=\"button\" class=\"btn btn-primary  btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                <span class=\"glyphicon glyphicon-option-horizontal\"></span>\n            </button>\n            <ul class=\"dropdown-menu\">\n                <li>\n                    <button class=\"btn btn-primary btn-xs\" data-bind=\"click: $root.copyQuestionClick, text:$root.getEditorLocString('survey.addToToolbox')\"></button>\n                </li>\n                <li>\n                    <button class=\"btn btn-primary btn-xs\" data-bind=\"click: $root.fastCopyQuestionClick, text:$root.getEditorLocString('survey.copy')\"></button>\n                </li>\n                <li>\n                    <button class=\"btn btn-primary btn-xs\" data-bind=\"click: $root.deleteCurrentObjectClick, text:$root.getEditorLocString('survey.deleteQuestion')\"></button>\n                </li>\n            </ul>\n        </div>\n    </div>\n</div>";

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "" + __webpack_require__(36) + "\n" + __webpack_require__(37) + "\n" + __webpack_require__(38) + "\n" + __webpack_require__(39) + "\n" + __webpack_require__(40) + "\n" + __webpack_require__(65) + "\n" + __webpack_require__(56) + "\n" + __webpack_require__(57) + "\n" + __webpack_require__(58) + "\n" + __webpack_require__(59) + "\n" + __webpack_require__(60) + "\n" + __webpack_require__(61) + "\n" + __webpack_require__(62) + "\n" + __webpack_require__(63) + "\n" + __webpack_require__(64) + "\n" + __webpack_require__(41) + "\n" + __webpack_require__(42) + "\n" + __webpack_require__(44) + "\n" + __webpack_require__(43) + "\n" + __webpack_require__(45) + "\n" + __webpack_require__(46) + "\n" + __webpack_require__(47) + "\n" + __webpack_require__(48) + "\n" + __webpack_require__(49) + "\n" + __webpack_require__(50) + "\n" + __webpack_require__(51) + "\n" + __webpack_require__(52) + "\n" + __webpack_require__(53) + "\n" + __webpack_require__(54) + "\n" + __webpack_require__(55) + "";

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__textWorker__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyJSONEditor; });


var SurveyJSONEditor = (function () {
    function SurveyJSONEditor() {
        this.isProcessingImmediately = false;
        this.timeoutId = -1;
        this.koText = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"]("");
        this.koErrors = __WEBPACK_IMPORTED_MODULE_0_knockout__["observableArray"]();
        var self = this;
        this.koText.subscribe(function (newValue) {
            self.onJsonEditorChanged();
        });
    }
    SurveyJSONEditor.prototype.init = function () {
        if (!this.hasAceEditor)
            return;
        this.aceEditor = ace.edit("surveyjsJSONEditor");
        var self = this;
        this.aceEditor.setTheme("ace/theme/monokai");
        this.aceEditor.session.setMode("ace/mode/json");
        this.aceEditor.setShowPrintMargin(false);
        this.aceEditor.getSession().on("change", function () {
            self.onJsonEditorChanged();
        });
        this.aceEditor.getSession().setUseWorker(true);
        __WEBPACK_IMPORTED_MODULE_1__textWorker__["a" /* SurveyTextWorker */].newLineChar = this.aceEditor.session.doc.getNewLineCharacter();
    };
    Object.defineProperty(SurveyJSONEditor.prototype, "hasAceEditor", {
        get: function () { return typeof ace !== "undefined"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyJSONEditor.prototype, "text", {
        get: function () {
            if (!this.hasAceEditor)
                return this.koText();
            return this.aceEditor.getValue();
        },
        set: function (value) {
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
        get: function () {
            this.textWorker = new __WEBPACK_IMPORTED_MODULE_1__textWorker__["a" /* SurveyTextWorker */](this.text);
            return this.textWorker.isJsonCorrect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SurveyJSONEditor.prototype, "survey", {
        get: function () { return this.textWorker.survey; },
        enumerable: true,
        configurable: true
    });
    SurveyJSONEditor.prototype.onJsonEditorChanged = function () {
        if (this.timeoutId > -1) {
            clearTimeout(this.timeoutId);
        }
        if (this.isProcessingImmediately) {
            this.timeoutId = -1;
        }
        else {
            var self = this;
            this.timeoutId = setTimeout(function () {
                self.timeoutId = -1;
                self.processJson(self.text);
            }, SurveyJSONEditor.updateTextTimeout);
        }
    };
    SurveyJSONEditor.prototype.processJson = function (text) {
        this.textWorker = new __WEBPACK_IMPORTED_MODULE_1__textWorker__["a" /* SurveyTextWorker */](text);
        if (this.aceEditor) {
            this.aceEditor.getSession().setAnnotations(this.createAnnotations(text, this.textWorker.errors));
        }
        else {
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
    return SurveyJSONEditor;
}());

SurveyJSONEditor.updateTextTimeout = 1000;


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__surveyHelper__ = __webpack_require__(7);
/* unused harmony export SurveyObjectItem */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyObjects; });


var SurveyObjectItem = (function () {
    function SurveyObjectItem() {
    }
    return SurveyObjectItem;
}());

var SurveyObjects = (function () {
    function SurveyObjects(koObjects, koSelected) {
        this.koObjects = koObjects;
        this.koSelected = koSelected;
    }
    Object.defineProperty(SurveyObjects.prototype, "survey", {
        get: function () { return this.surveyValue; },
        set: function (value) {
            if (this.survey == value)
                return;
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
        }
        else {
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
        if (index < 0)
            return;
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
        if (index < 0)
            return;
        var countToRemove = 1;
        if (__WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj) == __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["a" /* ObjType */].Page) {
            var page = obj;
            countToRemove += page.questions.length;
        }
        this.koObjects.splice(index, countToRemove);
    };
    SurveyObjects.prototype.nameChanged = function (obj) {
        var index = this.getItemIndex(obj);
        if (index < 0)
            return;
        this.koObjects()[index].text(this.getText(obj));
    };
    SurveyObjects.prototype.selectNextQuestion = function (isUp) {
        var question = this.getSelectedQuestion();
        var itemIndex = this.getItemIndex(question);
        if (itemIndex < 0)
            return question;
        var objs = this.koObjects();
        var newItemIndex = itemIndex + (isUp ? -1 : 1);
        if (newItemIndex < objs.length && __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectType(objs[newItemIndex].value) == __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["a" /* ObjType */].Question) {
            itemIndex = newItemIndex;
        }
        else {
            newItemIndex = itemIndex;
            while (newItemIndex < objs.length && __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectType(objs[newItemIndex].value) == __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["a" /* ObjType */].Question) {
                itemIndex = newItemIndex;
                newItemIndex += (isUp ? 1 : -1);
            }
        }
        this.koSelected(objs[itemIndex]);
    };
    SurveyObjects.prototype.getSelectedQuestion = function () {
        if (!this.koSelected())
            return null;
        var obj = this.koSelected().value;
        if (!obj)
            return null;
        return __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj) == __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["a" /* ObjType */].Question ? (obj) : null;
    };
    SurveyObjects.prototype.addItem = function (item, index) {
        if (index > this.koObjects().length) {
            this.koObjects.push(item);
        }
        else {
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
        item.text = __WEBPACK_IMPORTED_MODULE_0_knockout__["observable"](text);
        return item;
    };
    SurveyObjects.prototype.getItemIndex = function (value) {
        var objs = this.koObjects();
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].value == value)
                return i;
        }
        return -1;
    };
    SurveyObjects.prototype.getText = function (obj) {
        var intend = SurveyObjects.intend;
        if (__WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectType(obj) != __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["a" /* ObjType */].Page) {
            intend += SurveyObjects.intend;
        }
        return intend + __WEBPACK_IMPORTED_MODULE_1__surveyHelper__["b" /* SurveyHelper */].getObjectName(obj);
    };
    return SurveyObjects;
}());

SurveyObjects.intend = "...";


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_scss__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dragdrophelper__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DragDropHelper", function() { return __WEBPACK_IMPORTED_MODULE_1__dragdrophelper__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyEditorBase", function() { return __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyStringPropertyEditor", function() { return __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyDropdownPropertyEditor", function() { return __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyBooleanPropertyEditor", function() { return __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyNumberPropertyEditor", function() { return __WEBPACK_IMPORTED_MODULE_2__propertyEditors_propertyEditorBase__["e"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__propertyEditors_propertyTextItemsEditor__ = __webpack_require__(25);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyTextItemsEditor", function() { return __WEBPACK_IMPORTED_MODULE_3__propertyEditors_propertyTextItemsEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__propertyEditors_propertyItemsEditor__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyItemsEditor", function() { return __WEBPACK_IMPORTED_MODULE_4__propertyEditors_propertyItemsEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__propertyEditors_propertyItemValuesEditor__ = __webpack_require__(16);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyItemValuesEditor", function() { return __WEBPACK_IMPORTED_MODULE_5__propertyEditors_propertyItemValuesEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__propertyEditors_propertyMatrixDropdownColumnsEditor__ = __webpack_require__(23);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyDropdownColumnsEditor", function() { return __WEBPACK_IMPORTED_MODULE_6__propertyEditors_propertyMatrixDropdownColumnsEditor__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyMatrixDropdownColumnsItem", function() { return __WEBPACK_IMPORTED_MODULE_6__propertyEditors_propertyMatrixDropdownColumnsEditor__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__propertyEditors_propertyModalEditor__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyModalEditor", function() { return __WEBPACK_IMPORTED_MODULE_7__propertyEditors_propertyModalEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__propertyEditors_propertyRestfullEditor__ = __webpack_require__(24);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyResultfullEditor", function() { return __WEBPACK_IMPORTED_MODULE_8__propertyEditors_propertyRestfullEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__propertyEditors_propertyTriggersEditor__ = __webpack_require__(26);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyTriggersEditor", function() { return __WEBPACK_IMPORTED_MODULE_9__propertyEditors_propertyTriggersEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__propertyEditors_propertyValidatorsEditor__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPropertyValidatorsEditor", function() { return __WEBPACK_IMPORTED_MODULE_10__propertyEditors_propertyValidatorsEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__questionEditors_questionSelectBaseEditor__ = __webpack_require__(34);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionSelectBaseEditor", function() { return __WEBPACK_IMPORTED_MODULE_11__questionEditors_questionSelectBaseEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__questionEditors_questionTextEditor__ = __webpack_require__(35);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionTextEditor", function() { return __WEBPACK_IMPORTED_MODULE_12__questionEditors_questionTextEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__questionEditors_questionMultipleTextEditor__ = __webpack_require__(32);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionMultipleTextEditor", function() { return __WEBPACK_IMPORTED_MODULE_13__questionEditors_questionMultipleTextEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__questionEditors_questionCommentEditor__ = __webpack_require__(27);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionCommentEditor", function() { return __WEBPACK_IMPORTED_MODULE_14__questionEditors_questionCommentEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__questionEditors_questionHtmlEditor__ = __webpack_require__(29);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionHtmlEditor", function() { return __WEBPACK_IMPORTED_MODULE_15__questionEditors_questionHtmlEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__questionEditors_questionMatrixEditor__ = __webpack_require__(31);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixEditor", function() { return __WEBPACK_IMPORTED_MODULE_16__questionEditors_questionMatrixEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__questionEditors_questionMatrixDropdownEditor__ = __webpack_require__(18);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDropdownEditor", function() { return __WEBPACK_IMPORTED_MODULE_17__questionEditors_questionMatrixDropdownEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__questionEditors_questionMatrixDynamicEditor__ = __webpack_require__(30);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionMatrixDynamicEditor", function() { return __WEBPACK_IMPORTED_MODULE_18__questionEditors_questionMatrixDynamicEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__questionEditors_questionRatingEditor__ = __webpack_require__(33);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionRatingEditor", function() { return __WEBPACK_IMPORTED_MODULE_19__questionEditors_questionRatingEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__questionEditors_questionFileEditor__ = __webpack_require__(28);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyQuestionFileEditor", function() { return __WEBPACK_IMPORTED_MODULE_20__questionEditors_questionFileEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__objectProperty__ = __webpack_require__(13);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyObjectProperty", function() { return __WEBPACK_IMPORTED_MODULE_21__objectProperty__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__objectEditor__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyObjectEditor", function() { return __WEBPACK_IMPORTED_MODULE_22__objectEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pagesEditor__ = __webpack_require__(15);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyPagesEditor", function() { return __WEBPACK_IMPORTED_MODULE_23__pagesEditor__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__textWorker__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyTextWorker", function() { return __WEBPACK_IMPORTED_MODULE_24__textWorker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__surveyHelper__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ObjType", function() { return __WEBPACK_IMPORTED_MODULE_25__surveyHelper__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyHelper", function() { return __WEBPACK_IMPORTED_MODULE_25__surveyHelper__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__surveyEmbedingWindow__ = __webpack_require__(19);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyEmbedingWindow", function() { return __WEBPACK_IMPORTED_MODULE_26__surveyEmbedingWindow__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__objectVerbs__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyVerbs", function() { return __WEBPACK_IMPORTED_MODULE_27__objectVerbs__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyVerbItem", function() { return __WEBPACK_IMPORTED_MODULE_27__objectVerbs__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyVerbChangeTypeItem", function() { return __WEBPACK_IMPORTED_MODULE_27__objectVerbs__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyVerbChangePageItem", function() { return __WEBPACK_IMPORTED_MODULE_27__objectVerbs__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__undoredo__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyUndoRedo", function() { return __WEBPACK_IMPORTED_MODULE_28__undoredo__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UndoRedoItem", function() { return __WEBPACK_IMPORTED_MODULE_28__undoredo__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__editor__ = __webpack_require__(22);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "SurveyEditor", function() { return __WEBPACK_IMPORTED_MODULE_29__editor__["a"]; });
// styles
































/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkY2ZkOWYzM2VjMTMzNmViMjFiZSIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9oZWxwZXJzLnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJyb290XCI6XCJrb1wiLFwiY29tbW9uanMyXCI6XCJrbm9ja291dFwiLFwiY29tbW9uanNcIjpcImtub2Nrb3V0XCIsXCJhbWRcIjpcImtub2Nrb3V0XCJ9Iiwid2VicGFjazovLy9leHRlcm5hbCB7XCJyb290XCI6XCJTdXJ2ZXlcIixcImNvbW1vbmpzMlwiOlwic3VydmV5LWtub2Nrb3V0XCIsXCJjb21tb25qc1wiOlwic3VydmV5LWtub2Nrb3V0XCIsXCJhbWRcIjpcInN1cnZleS1rbm9ja291dFwifSIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yTG9jYWxpemF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25FZGl0b3JCYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlJdGVtc0VkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5SGVscGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1vZGFsRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy90ZXh0V29ya2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9qc29uNS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhZ2Ryb3BoZWxwZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29iamVjdFByb3BlcnR5LnRzIiwid2VicGFjazovLy8uL3NyYy9vYmplY3RWZXJicy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbk1hdHJpeERyb3Bkb3duRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9zdXJ2ZXlFbWJlZGluZ1dpbmRvdy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5kb3JlZG8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uc2NzcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVJlc3RmdWxsRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVRyaWdnZXJzRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25Db21tZW50RWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25GaWxlRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25IdG1sRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25NYXRyaXhEeW5hbWljRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25NYXRyaXhFZGl0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbk11bHRpcGxlVGV4dEVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uUmF0aW5nRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25TZWxlY3RCYXNlRWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25UZXh0RWRpdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL2pzb25lZGl0b3IuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL29iamVjdGVkaXRvci5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvb2JqZWN0dmVyYnMuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3BhZ2VlZGl0b3IuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1ib29sZWFuLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItZHJvcGRvd24uaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1leHByZXNzaW9uLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItaHRtbC5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLWl0ZW12YWx1ZXMuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1tYXRyaXhkcm9wZG93bmNvbHVtbnMuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1tb2RhbC5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLW51bWJlci5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXJlc3RmdWxsLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3Itc3RyaW5nLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItdGV4dC5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXRleHRpdGVtcy5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtcy5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXZhbGlkYXRvcnMuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvci5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLWNvbW1lbnQuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1maWxlT3B0aW9ucy5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLWdlbmVyYWwuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1tYXRyaXhkcm9wZG93bi5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLW1hdHJpeGR5bmFtaWMuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1tdWx0aXBsZXRleHQuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1yYXRpbmcuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi10ZXh0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3RlbXBsYXRlcy9zdXJ2ZXllbWJlZGluZy5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMuc3VydmV5L3RlbXBsYXRlX3BhZ2UuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGVzLnN1cnZleS90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sIiwid2VicGFjazovLy8uL3NyYy90ZW1wbGF0ZXMvZW50cnkuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5SlNPTkVkaXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3VydmV5T2JqZWN0cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50cmllcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUNoRU8sSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsTUFBTTtJQUNsRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNsRCxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFQSxtQkFBb0IsU0FBUyxFQUFFLFNBQVM7SUFDMUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDO1FBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEYsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMvQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDekgsQ0FBQztBQUFBLENBQUM7Ozs7Ozs7QUNaRiwrQzs7Ozs7O0FDQUEsK0M7Ozs7Ozs7OztBQ0FPLElBQUksa0JBQWtCLEdBQUc7SUFDNUIsYUFBYSxFQUFFLEVBQUU7SUFDakIsT0FBTyxFQUFFLEVBQUU7SUFDWCxTQUFTLEVBQUUsVUFBVSxPQUFlLEVBQUUsTUFBcUI7UUFBckIsc0NBQXFCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDekMsSUFBSSxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLGNBQWMsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFDLEdBQUcsR0FBRyxjQUFjLENBQUM7UUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNuQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssY0FBYyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0QsZUFBZSxFQUFFLFVBQVUsT0FBZSxFQUFFLEtBQW9CO1FBQXBCLG9DQUFvQjtRQUM1RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0QsZ0JBQWdCLEVBQUUsVUFBVSxPQUFlLEVBQUUsS0FBb0I7UUFBcEIsb0NBQW9CO1FBQzdELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFDRCxXQUFXLEVBQUUsVUFBVSxPQUFlLEVBQUUsS0FBb0I7UUFBcEIsb0NBQW9CO1FBQ3hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssT0FBTyxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNoQyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDekIsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNSLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQztDQUNKLENBQUM7QUFFSyxJQUFJLGNBQWMsR0FBRztJQUN4QixrQkFBa0I7SUFDbEIsTUFBTSxFQUFFO1FBQ0osWUFBWSxFQUFFLDhCQUE4QjtRQUM1QyxJQUFJLEVBQUUsTUFBTTtRQUNaLFlBQVksRUFBRSxnQkFBZ0I7UUFDOUIsY0FBYyxFQUFFLGlCQUFpQjtLQUNwQztJQUNELGVBQWU7SUFDZixFQUFFLEVBQUU7UUFDQSxRQUFRLEVBQUUsVUFBVTtRQUNwQixPQUFPLEVBQUUsU0FBUztRQUNsQixRQUFRLEVBQUUsVUFBVTtRQUNwQixJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxNQUFNO1FBQ1osTUFBTSxFQUFFLHdCQUF3QjtRQUNoQyxjQUFjLEVBQUUsMEJBQTBCO1FBQzFDLGFBQWEsRUFBRSx1QkFBdUI7UUFDdEMsWUFBWSxFQUFFLGVBQWU7UUFDN0IsVUFBVSxFQUFFLFlBQVk7UUFDeEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsSUFBSSxFQUFFLGNBQWM7S0FDdkI7SUFDRCxtQkFBbUI7SUFDbkIsRUFBRSxFQUFFO1FBQ0EsV0FBVyxFQUFFLE1BQU07UUFDbkIsZUFBZSxFQUFFLFVBQVU7UUFDM0IsVUFBVSxFQUFFLGFBQWE7UUFDekIsZUFBZSxFQUFFLG1CQUFtQjtRQUNwQyxlQUFlLEVBQUUsZ0JBQWdCO1FBQ2pDLFdBQVcsRUFBRSxjQUFjO1FBQzNCLFVBQVUsRUFBRSxhQUFhO1FBQ3pCLFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsVUFBVSxFQUFFLGFBQWE7UUFDekIsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLGlCQUFpQixFQUFFLHFCQUFxQjtRQUN4QyxvQkFBb0IsRUFBRSx3QkFBd0I7UUFDOUMsT0FBTyxFQUFFLFNBQVM7UUFDbEIsWUFBWSxFQUFFLHdCQUF3QjtRQUN0QyxXQUFXLEVBQUUsc0JBQXNCO1FBQ25DLGFBQWEsRUFBRSxpQkFBaUI7S0FDbkM7SUFDRCxrQkFBa0I7SUFDbEIsRUFBRSxFQUFFO1FBQ0EsS0FBSyxFQUFFLE9BQU87UUFDZCxFQUFFLEVBQUUsSUFBSTtRQUNSLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLEtBQUssRUFBRSxPQUFPO1FBQ2QsS0FBSyxFQUFFLE9BQU87UUFDZCxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsU0FBUztRQUNqQixTQUFTLEVBQUUsWUFBWTtRQUN2QixJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRSxTQUFTO1FBQ2hCLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFdBQVcsRUFBRSxrQkFBa0I7UUFDL0IsY0FBYyxFQUFFLDBLQUEwSztRQUUxTCxLQUFLLEVBQUUsT0FBTztRQUNkLElBQUksRUFBRSxNQUFNO1FBQ1osUUFBUSxFQUFFLFdBQVc7UUFDckIsUUFBUSxFQUFFLGdCQUFnQjtRQUMxQixJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRSxPQUFPO1FBQ2QsUUFBUSxFQUFFLFdBQVc7UUFDckIsUUFBUSxFQUFFLGNBQWM7UUFFeEIsWUFBWSxFQUFFLG9CQUFvQjtRQUNsQyxPQUFPLEVBQUUsU0FBUztRQUNsQixXQUFXLEVBQUUsU0FBUztRQUN0QixJQUFJLEVBQUUsYUFBYTtRQUNuQixPQUFPLEVBQUUsU0FBUztRQUNsQixJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxTQUFTO1FBQ2xCLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFVBQVUsRUFBRSxhQUFhO1FBQ3pCLFlBQVksRUFBRSxrQkFBa0I7UUFDaEMsYUFBYSxFQUFFLGlCQUFpQjtRQUNoQyxpQkFBaUIsRUFBRSxhQUFhO1FBRWhDLFlBQVksRUFBRSxxQkFBcUI7UUFDbkMsS0FBSyxFQUFFLGdCQUFnQjtRQUV2QixhQUFhLEVBQUUsMEJBQTBCO1FBQ3pDLFdBQVcsRUFBRSx5Q0FBeUM7UUFDdEQsYUFBYSxFQUFFLHlCQUF5QjtRQUN4QyxTQUFTLEVBQUUsS0FBSztRQUNoQix1QkFBdUIsRUFBRSxxQkFBcUI7UUFDOUMsMkJBQTJCLEVBQUUseUJBQXlCO1FBQ3RELG1CQUFtQixFQUFFLGlDQUFpQztRQUN0RCxhQUFhLEVBQUUsd0JBQXdCO1FBQ3ZDLFlBQVksRUFBRSxRQUFRO1FBQ3RCLGdCQUFnQixFQUFFLG1CQUFtQjtRQUNyQyxlQUFlLEVBQUUsTUFBTTtRQUN2QixpQkFBaUIsRUFBRSxpREFBaUQ7UUFDcEUsY0FBYyxFQUFFLGNBQWM7UUFDOUIsY0FBYyxFQUFFLGNBQWM7S0FDakM7SUFDRCxXQUFXO0lBQ1gsRUFBRSxFQUFFO1FBQ0EsS0FBSyxFQUFFLFVBQVU7UUFDakIsUUFBUSxFQUFFLGNBQWM7UUFDeEIsS0FBSyxFQUFFLFFBQVE7UUFDZixRQUFRLEVBQUUsWUFBWTtRQUN0QixRQUFRLEVBQUUsVUFBVTtRQUNwQixXQUFXLEVBQUUsY0FBYztRQUMzQixPQUFPLEVBQUUsU0FBUztRQUNsQixJQUFJLEVBQUUsTUFBTTtRQUNaLGNBQWMsRUFBRSxtQkFBbUI7UUFDbkMsV0FBVyxFQUFFLGdCQUFnQjtLQUNoQztJQUNELGNBQWM7SUFDZCxFQUFFLEVBQUU7UUFDQSxPQUFPLEVBQUUscUJBQXFCO1FBQzlCLE1BQU0sRUFBRSxvQkFBb0I7UUFDNUIsUUFBUSxFQUFFLHNCQUFzQjtRQUNoQyxLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLFNBQVMsRUFBRSx5QkFBeUI7UUFDcEMsUUFBUSxFQUFFLGNBQWM7UUFDeEIsVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxZQUFZLEVBQUUseUJBQXlCO1FBQ3ZDLGNBQWMsRUFBRSw4QkFBOEI7UUFDOUMsV0FBVyxFQUFFLG9CQUFvQjtRQUNqQyxTQUFTLEVBQUUsTUFBTTtRQUNqQixlQUFlLEVBQUUsWUFBWTtLQUNoQztJQUNELFlBQVk7SUFDWixDQUFDLEVBQUU7UUFDQyxJQUFJLEVBQUUsTUFBTTtRQUNaLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLDZDQUE2QyxFQUFFO1FBQzlFLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGlDQUFpQyxFQUFFO1FBQ3pFLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRTtLQUNyRDtDQUNKLENBQUM7QUFFRixrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeExuQjtBQUVnRDtBQUN0QjtBQUNmO0FBRTFDO0lBSUk7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxvREFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDTSw2Q0FBSSxHQUFYLFVBQVksWUFBaUMsRUFBRSxTQUFpRDtRQUM1RixJQUFJLE1BQU0sR0FBRyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ0wscUNBQUM7QUFBRCxDQUFDOztBQUVEO0lBRUksa0NBQW1CLFlBQWlDLEVBQVMseUJBQXdGO1FBQWxJLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUFTLDhCQUF5QixHQUF6Qix5QkFBeUIsQ0FBK0Q7UUFDakosSUFBSSxDQUFDLFVBQVUsR0FBRywyREFBaUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBQ00sOENBQVcsR0FBbEIsVUFBbUIsWUFBb0I7UUFDbkMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxDQUFDO1lBQ1YsQ0FBQztRQUNMLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDdEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0FBQzs7QUFFRDtJQTRCSSxrQ0FBbUIsWUFBaUMsRUFBUyx5QkFBd0Y7UUFBbEksaUJBQVksR0FBWixZQUFZLENBQXFCO1FBQVMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUErRDtRQUNqSixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHdCQUF3QixDQUFDLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxjQUFjLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLG9EQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLEdBQUcseURBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxvREFBYSxDQUFDLCtFQUFrQixDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNwSCxDQUFDO0lBbkNhLHVDQUFjLEdBQTVCLFVBQTZCLElBQVksRUFBRSxPQUFrSztRQUN6TSx3QkFBd0IsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7SUFDbEUsQ0FBQztJQUNhLHFDQUFZLEdBQTFCLFVBQTJCLFlBQWlDLEVBQUUsU0FBaUQsRUFDM0cseUJBQXdGO1FBQ3hGLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QyxJQUFJLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2RSxPQUFPLENBQUMsT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQzNCLDBDQUEwQztZQUMxQyxJQUFJLFNBQVMsR0FBNkIsMkRBQWlCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdGLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUFDLEtBQUssQ0FBQztZQUN0QixTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUNqQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7Z0JBQUUsT0FBTyxHQUFHLHdCQUF3QixDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUFDLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQyxvQkFBb0IsQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM5RyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLHlCQUF5QixDQUFDLENBQUM7UUFDOUQsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBa0JNLDJDQUFRLEdBQWY7UUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNNLHdDQUFLLEdBQVo7UUFDSSwwQkFBMEI7SUFDOUIsQ0FBQztJQUNNLHdDQUFLLEdBQVo7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEMsQ0FBQztJQUNMLENBQUM7SUFDTyw0Q0FBUyxHQUFqQjtRQUNJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUM7UUFDdkUsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEgsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ1MsMENBQU8sR0FBakIsVUFBa0IsSUFBd0M7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFDUyxtREFBZ0IsR0FBMUIsY0FBK0QsTUFBTSxDQUFDLElBQUksOEJBQThCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxSSxvREFBaUIsR0FBekIsVUFBMEIsSUFBd0M7UUFDOUQsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2QyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQUMsUUFBUSxDQUFDO1lBQ2pFLElBQUksU0FBUyxHQUFHLElBQUksK0JBQStCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1lBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUM7SUFDUyxvREFBaUIsR0FBM0IsVUFBNEIsUUFBb0I7UUFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0FBQzs7QUF2RmlCLHNDQUFhLEdBQVcsY0FBYyxDQUFDO0FBQ3RDLDZDQUFvQixHQUFHLEVBQUUsQ0FBQztBQXdGN0M7SUFHSSxxQ0FBbUIsWUFBaUMsRUFBUyxZQUFvQixFQUFFLFVBQW9DO1FBQXBHLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUFTLGlCQUFZLEdBQVosWUFBWSxDQUFRO1FBQzdFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQUMsVUFBVSxHQUFHLElBQUksd0JBQXdCLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFDRCxzQkFBVyw2Q0FBSTthQUFmLGNBQTRCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM1QyxzQkFBVyw4Q0FBSzthQUFoQjtZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDNUMsSUFBSSxHQUFHLEdBQUcsK0VBQWtCLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxDQUFDO2FBQ0QsVUFBaUIsS0FBYSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BRDNEO0lBRUQsc0JBQVcscURBQVk7YUFBdkIsY0FBb0MsTUFBTSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM5RSxzQkFBVyx1REFBYzthQUF6QixjQUFtQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDMUMsOENBQVEsR0FBZixjQUE2QixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNyQywyQ0FBSyxHQUFaLGNBQWlCLENBQUM7SUFDWCwyQ0FBSyxHQUFaLGNBQWlCLENBQUM7SUFDUiw4Q0FBUSxHQUFsQixVQUFtQixRQUFtQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFDTCxrQ0FBQztBQUFELENBQUM7O0FBRUQ7SUFBb0QsaUdBQTJCO0lBUTNFLHdDQUFtQixZQUFpQyxFQUFTLFlBQW9CLEVBQUUsVUFBb0M7UUFBdkgsWUFDSSxrQkFBTSxZQUFZLEVBQUUsWUFBWSxFQUFFLFVBQVUsQ0FBQyxTQUdoRDtRQUprQixrQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFBUyxrQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUU3RSxLQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDOztJQUNqQixDQUFDO0lBQ1Msd0RBQWUsR0FBekI7UUFDSSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUM7UUFDM0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDakUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDdkUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksSUFBSSxDQUFDO1FBQ25GLElBQUksQ0FBQyxNQUFNLEdBQUcsb0RBQWEsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsb0RBQWEsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsb0RBQWEsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsb0RBQWEsRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxvREFBYSxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUNELHNCQUFXLGdEQUFJO2FBQWYsY0FBNEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9DLHNCQUFXLGlFQUFxQjthQUFoQyxjQUE4QyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDN0Qsc0JBQVcsa0VBQXNCO2FBQWpDLGNBQThDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNuRCxpREFBUSxHQUFmLGNBQTZCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUMsOENBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQW1CLElBQUksQ0FBQyxZQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1lBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBQ00sOENBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQW1CLElBQUksQ0FBQyxZQUFhLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7WUFBbUIsSUFBSSxDQUFDLFlBQWEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzlGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDakcsQ0FBQztJQUNMLHFDQUFDO0FBQUQsQ0FBQyxDQTNDbUQsMkJBQTJCLEdBMkM5RTs7QUFFRDtJQUFxRCxrR0FBMkI7SUFHNUUseUNBQW1CLFlBQWlDLEVBQVMsWUFBb0IsRUFBUyxZQUFvQixFQUFFLFVBQW9DO1FBQXBKLFlBQ0ksa0JBQU0sWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsU0FJaEQ7UUFMa0Isa0JBQVksR0FBWixZQUFZLENBQXFCO1FBQVMsa0JBQVksR0FBWixZQUFZLENBQVE7UUFBUyxrQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUUxRyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQy9ELEtBQUksQ0FBQyxtQkFBbUIsR0FBOEIscUdBQXdCLENBQUMsWUFBWSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RILEtBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0lBQ2xFLENBQUM7SUFDRCxzQkFBVyxpREFBSTthQUFmLGNBQTRCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDaEQsa0RBQVEsR0FBZixjQUE2QixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckUsc0JBQVcseURBQVk7YUFBdkIsY0FBb0MsTUFBTSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDM0Ysc0JBQVcsMkRBQWM7YUFBekIsY0FBbUMsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNoRSxzQkFBVyxxREFBUTthQUFuQixjQUFtRCxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9FLHNCQUFXLDJEQUFjO2FBQXpCLGNBQXlELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNwRiwrQ0FBSyxHQUFaO1FBQ0ksSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBQ00sK0NBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQztJQUMxRSxDQUFDO0lBQ0wsc0NBQUM7QUFBRCxDQUFDLENBdEJvRCwyQkFBMkIsR0FzQi9FOztBQUVELHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsVUFBVSxRQUE2QixFQUFFLHlCQUF3RixJQUE4QixNQUFNLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNuT3BTO0lBaUJJO1FBSFEsV0FBTSxHQUFRLElBQUksQ0FBQztRQUNwQixZQUFPLEdBQVEsSUFBSSxDQUFDO0lBRzNCLENBQUM7SUFmYSx1Q0FBYyxHQUE1QixVQUE2QixJQUFZLEVBQUUsT0FBdUM7UUFDOUUsd0JBQXdCLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ2xFLENBQUM7SUFDYSxxQ0FBWSxHQUExQixVQUEyQixVQUFrQixFQUFFLElBQTRCO1FBQ3ZFLElBQUksT0FBTyxHQUFHLHdCQUF3QixDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQUMsT0FBTyxHQUFHLHdCQUF3QixDQUFDLG9CQUFvQixDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlHLElBQUksY0FBYyxHQUFHLE9BQU8sRUFBRSxDQUFDO1FBQy9CLGNBQWMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQU9ELHNCQUFXLGdEQUFVO2FBQXJCLGNBQWtDLE1BQU0sMkJBQTJCLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRCwrQ0FBWSxHQUFuQixVQUFvQixLQUFVLElBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekQsc0JBQVcsMkNBQUs7YUFBaEIsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQy9DLFVBQWlCLEtBQVU7WUFDdkIsS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDOzs7T0FMOEM7SUFNckMsK0NBQVksR0FBdEIsVUFBdUIsS0FBVTtRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN4QixDQUFDO0lBQ00sMkNBQVEsR0FBZixVQUFnQixLQUFhLElBQUksQ0FBQztJQUMzQiw0Q0FBUyxHQUFoQixVQUFpQixLQUFVLElBQUksQ0FBQztJQUN0QixpREFBYyxHQUF4QjtJQUNBLENBQUM7SUFDUyxvREFBaUIsR0FBM0IsVUFBNEIsS0FBVSxJQUFVLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBRSxDQUFDO0lBQ3BFLCtCQUFDO0FBQUQsQ0FBQzs7QUFsQ2lCLHNDQUFhLEdBQVcsUUFBUSxDQUFDO0FBQ2hDLDZDQUFvQixHQUFHLEVBQUUsQ0FBQztBQWtDN0M7SUFBZ0QsNkZBQXdCO0lBQ3BFO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBQ0Qsc0JBQVcsa0RBQVU7YUFBckIsY0FBa0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3hELGlDQUFDO0FBQUQsQ0FBQyxDQUwrQyx3QkFBd0IsR0FLdkU7O0FBQ0Q7SUFBa0QsK0ZBQXdCO0lBQ3RFO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBQ0Qsc0JBQVcsb0RBQVU7YUFBckIsY0FBa0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzFELG1DQUFDO0FBQUQsQ0FBQyxDQUxpRCx3QkFBd0IsR0FLekU7O0FBQ0Q7SUFBaUQsOEZBQXdCO0lBQ3JFO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBQ0Qsc0JBQVcsbURBQVU7YUFBckIsY0FBa0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pELGtDQUFDO0FBQUQsQ0FBQyxDQUxnRCx3QkFBd0IsR0FLeEU7O0FBQ0Q7SUFBZ0QsNkZBQXdCO0lBQ3BFO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBQ0Qsc0JBQVcsa0RBQVU7YUFBckIsY0FBa0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3hELGlDQUFDO0FBQUQsQ0FBQyxDQUwrQyx3QkFBd0IsR0FLdkU7O0FBRUQsd0JBQXdCLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSwwQkFBMEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEksd0JBQXdCLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSw0QkFBNEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUksd0JBQXdCLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSwyQkFBMkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEksd0JBQXdCLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSwwQkFBMEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2hFdkc7QUFDaUM7QUFDUDtBQUV6RDtJQUErQyw0RkFBeUI7SUFRcEU7UUFBQSxZQUNJLGlCQUFPLFNBU1Y7UUFSRyxLQUFJLENBQUMsT0FBTyxHQUFHLHlEQUFrQixFQUFFLENBQUM7UUFDcEMsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxVQUFVLEdBQUcsY0FBYyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFDcEUsQ0FBQztJQUNNLGdEQUFZLEdBQW5CLFVBQW9CLEtBQVU7UUFDMUIsSUFBSSxHQUFHLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNTLHFEQUFpQixHQUEzQixVQUE0QixLQUFVO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUN2RCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDUywyQ0FBTyxHQUFqQjtRQUNJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUNTLDBDQUFNLEdBQWhCLFVBQWlCLElBQVM7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3pCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN0QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1QixHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFDUyw0Q0FBUSxHQUFsQixVQUFtQixJQUFTO1FBQ3hCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN6QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ2pELEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUNTLGtEQUFjLEdBQXhCO1FBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFUyxxREFBaUIsR0FBM0IsVUFBNEIsS0FBaUI7UUFBakIsb0NBQWlCO1FBQ3pDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEVBQUUsRUFBQyxDQUFDLEtBQUssQ0FBQztZQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNTLGlEQUFhLEdBQXZCO1FBQ0ksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNTLHVEQUFtQixHQUE3QixjQUF1QyxNQUFNLHVDQUF1QyxDQUFDLENBQUMsQ0FBQztJQUM3RSxvREFBZ0IsR0FBMUIsVUFBMkIsSUFBUyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVDLDREQUF3QixHQUFsQyxVQUFtQyxVQUFlLElBQUssTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFFLENBQUM7SUFDaEYsZ0NBQUM7QUFBRCxDQUFDLENBckU4Qyx1RkFBeUIsR0FxRXZFOzs7Ozs7Ozs7Ozs7QUN6RXVEO0FBR3hELElBQVksT0FBMkM7QUFBdkQsV0FBWSxPQUFPO0lBQUcsMkNBQU87SUFBRSx5Q0FBTTtJQUFFLHFDQUFJO0lBQUUsNkNBQVE7QUFBQyxDQUFDLEVBQTNDLE9BQU8sS0FBUCxPQUFPLFFBQW9DO0FBQ3ZEO0lBQUE7SUFrQ0EsQ0FBQztJQWpDaUIsMkJBQWMsR0FBNUIsVUFBNkIsSUFBZ0I7UUFDekMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLCtFQUFrQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUNhLCtCQUFrQixHQUFoQyxVQUFpQyxJQUFnQjtRQUM3QyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsK0VBQWtCLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUM3RixDQUFDO0lBQ2EsdUJBQVUsR0FBeEIsVUFBeUIsSUFBZ0IsRUFBRSxRQUFnQjtRQUN2RCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM5QixDQUFDO1FBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFBQyxLQUFLLENBQUM7WUFDNUMsR0FBRyxFQUFFLENBQUM7UUFDVixDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUNhLDBCQUFhLEdBQTNCLFVBQTRCLEdBQVE7UUFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUNwRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDakQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFDYSwwQkFBYSxHQUEzQixVQUE0QixHQUFRO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDdkMsSUFBSSxJQUFJLEdBQWdDLEdBQUksQ0FBQyxJQUFJLENBQUM7UUFDbEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQWMsR0FBRyxDQUFDLENBQUM7UUFDakQsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDeEMsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ3RDOEI7QUFDdUI7QUFDRTtBQUNkO0FBRTFDO0lBU0ksNEJBQVkscUJBQWlDO1FBQWpDLG9FQUFpQztRQVB0QywwQkFBcUIsR0FBUSxJQUFJLENBQUM7UUFJbEMsMkJBQXNCLEdBQXlFLElBQUksc0RBQVksRUFBMEQsQ0FBQztRQUk3SyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksR0FBRyx5REFBa0IsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxvREFBYSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUNELHNCQUFXLDhDQUFjO2FBQXpCLGNBQW1DLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2FBQ3JFLFVBQTBCLEtBQVU7WUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLEtBQUssQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztZQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNsQyxDQUFDOzs7T0FQb0U7SUFROUQsdUNBQVUsR0FBakIsVUFBa0IscUJBQTBCO1FBQ3hDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztJQUN2RCxDQUFDO0lBQ00sOENBQWlCLEdBQXhCLFVBQXlCLElBQVk7UUFDakMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNNLGlEQUFvQixHQUEzQixVQUE0QixRQUE4QjtRQUN0RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNNLDBDQUFhLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUNTLDZDQUFnQixHQUExQjtRQUFBLGlCQTZCQztRQTVCRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksVUFBVSxHQUFHLDJEQUFpQixDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztZQUNqQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFNBQVMsR0FBRyxVQUFDLFFBQThCLEVBQUUsUUFBYTtZQUMxRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pILENBQUMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFBQyxRQUFRLENBQUM7WUFDbkQsSUFBSSxjQUFjLEdBQUcsSUFBSSw2RUFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3BHLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDdkUsY0FBYyxDQUFDLFdBQVcsR0FBRywrRUFBa0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekUsSUFBSSxLQUFLLEdBQUcsK0VBQWtCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUM7WUFDL0MsY0FBYyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDN0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzFDLENBQUM7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFDUyw0Q0FBZSxHQUF6QixVQUEwQixRQUFtQztRQUN6RCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxXQUFXLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3pHLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNTLG1EQUFzQixHQUFoQztRQUNJLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNyQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6QyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFDTCx5QkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RGOEI7QUFDK0I7QUFFOUQ7SUFBK0MsNEZBQXdCO0lBS25FO1FBQUEsWUFDSSxpQkFBTyxTQUtWO1FBSkcsS0FBSSxDQUFDLEtBQUssR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLFlBQVksR0FBRyxjQUFjLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFDdEQsQ0FBQztJQUNNLDRDQUFRLEdBQWYsVUFBZ0IsS0FBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlDLDRDQUFRLEdBQWYsY0FBNkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEMsaURBQWEsR0FBdkIsY0FBNEIsQ0FBQztJQUNyQix5Q0FBSyxHQUFiO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFDTSw2Q0FBUyxHQUFoQixVQUFpQixLQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3JELHNCQUFXLGlEQUFVO2FBQXJCLGNBQW1DLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMzQyx5Q0FBSyxHQUFaO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztJQUNMLGdDQUFDO0FBQUQsQ0FBQyxDQTNCOEMscUZBQXdCLEdBMkJ0RTs7QUFFRDtJQUE4QywyRkFBeUI7SUFHbkU7UUFBQSxZQUNJLGlCQUFPLFNBRVY7UUFERyxLQUFJLENBQUMsT0FBTyxHQUFHLG9EQUFhLEVBQUUsQ0FBQzs7SUFDbkMsQ0FBQztJQUNELHNCQUFXLGdEQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNsRCxzQkFBVyxnREFBVTthQUFyQixjQUFtQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDMUMsK0NBQVksR0FBbkIsVUFBb0IsS0FBVTtRQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQixHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUNTLGlEQUFjLEdBQXhCO1FBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNTLGdEQUFhLEdBQXZCO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0wsK0JBQUM7QUFBRCxDQUFDLENBdkI2Qyx5QkFBeUIsR0F1QnRFOztBQUVEO0lBQThDLDJGQUF3QjtJQUNsRTtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUNELHNCQUFXLGdEQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN0RCwrQkFBQztBQUFELENBQUMsQ0FMNkMsd0JBQXdCLEdBS3JFOztBQUVEO0lBQW9ELGlHQUF3QjtJQUN4RTtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUNELHNCQUFXLHNEQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM1RCxxQ0FBQztBQUFELENBQUMsQ0FMbUQsd0JBQXdCLEdBSzNFOztBQUVELHFGQUF3QixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsY0FBd0MsTUFBTSxDQUFDLElBQUksd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xJLHFGQUF3QixDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsY0FBd0MsTUFBTSxDQUFDLElBQUksd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xJLHFGQUF3QixDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsY0FBd0MsTUFBTSxDQUFDLElBQUksOEJBQThCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUN6RTFHO0FBQ007QUFFMUM7SUFBQTtJQU9BLENBQUM7SUFBRCx3QkFBQztBQUFELENBQUM7QUFFRDtJQVFJLDBCQUFtQixJQUFZO1FBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUMzQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNELHNCQUFXLG9DQUFNO2FBQWpCLGNBQXFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDL0Qsc0JBQVcsMkNBQWE7YUFBeEIsY0FBc0MsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDOUQsa0NBQU8sR0FBakI7UUFDSSxJQUFJLENBQUM7WUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksMkRBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakYsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx1REFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUMxRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ2hELElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLDBCQUEwQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ08sOENBQW1CLEdBQTNCLFVBQTRCLE9BQVk7UUFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNqQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNPLDhDQUFtQixHQUEzQjtRQUNJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDNUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7UUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUM7WUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDTyxxREFBMEIsR0FBbEMsVUFBbUMsT0FBYztRQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ25ELElBQUksUUFBUSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDckMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxJQUFJLE9BQU8sR0FBVyxDQUFDLENBQUM7UUFDeEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsSUFBSSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM5QixRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0QsSUFBSSxHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7Z0JBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDckMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ2xDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNwQixHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDO1lBQ0QsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQUNPLDhDQUFtQixHQUEzQixVQUE0QixhQUFrQixFQUFFLE9BQWUsRUFBRSxFQUFVO1FBQ3ZFLElBQUksTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN0RSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdEIsT0FBTyxPQUFPLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDcEIsQ0FBQztZQUNELE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNPLHFDQUFVLEdBQWxCLFVBQW1CLE9BQWM7UUFDN0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUFDLFFBQVEsQ0FBQztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMzQyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDeEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQixNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7QUNoSUQ7QUFBQSxpREFBaUQ7QUFDakQsK0VBQStFO0FBRS9FO0lBNkJJLHFCQUFZLFNBQXFCO1FBQXJCLHlDQUFxQjtRQUM3QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBQ00sMkJBQUssR0FBWixVQUFhLE1BQVcsRUFBRSxPQUFtQixFQUFFLFNBQXFCLEVBQUUsS0FBa0I7UUFBOUQsd0NBQW1CO1FBQUUseUNBQXFCO1FBQUUsaUNBQWlCLENBQUM7UUFDcEYsSUFBSSxNQUFNLENBQUM7UUFFWCxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUNkLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCx5RUFBeUU7UUFDekUsb0VBQW9FO1FBQ3BFLDhFQUE4RTtRQUM5RSw0RUFBNEU7UUFDNUUsVUFBVTtRQUVWLE1BQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSyxVQUFVLEdBQUcsQ0FBQyxjQUFjLE1BQU0sRUFBRSxHQUFHO1lBQzdELElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDZCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakQsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUNsQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixDQUFDO3dCQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNKLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwQixDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzVDLENBQUMsQ0FBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUNyQyxDQUFDO0lBQ08sMkJBQUssR0FBYixVQUFjLENBQVM7UUFDbkIsc0NBQXNDO1FBQ3RDLElBQUksS0FBSyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDOUIsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDbEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLENBQUM7SUFDaEIsQ0FBQztJQUNPLDBCQUFJLEdBQVosVUFBYSxDQUFhO1FBQWIsNEJBQWE7UUFDdEIsOEVBQThFO1FBQzlFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsQ0FBQyxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUNELGtFQUFrRTtRQUNsRSwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBQ08sMEJBQUksR0FBWjtRQUNJLHNEQUFzRDtRQUN0RCx3Q0FBd0M7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBQ08sNkJBQU8sR0FBZjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDTyxnQ0FBVSxHQUFsQjtRQUNJLDRFQUE0RTtRQUM1RSw0RUFBNEU7UUFDNUUsZ0RBQWdEO1FBQ2hELGdDQUFnQztRQUNoQyxnR0FBZ0c7UUFDaEcsOERBQThEO1FBQzlELDhFQUE4RTtRQUM5RSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBRWxCLGdEQUFnRDtRQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDO1lBQ3BDLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7WUFDaEMsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVELDRDQUE0QztRQUM1QyxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUN0QixJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUc7WUFDbEMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQztZQUNsQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDO1lBQ2xDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDbEMsR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDbkIsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ08sNEJBQU0sR0FBZDtRQUVJLHdCQUF3QjtRQUV4QixJQUFJLE1BQU0sRUFDTixJQUFJLEdBQUcsRUFBRSxFQUNULE1BQU0sR0FBRyxFQUFFLEVBQ1gsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFFRCwyREFBMkQ7UUFDM0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztZQUM3QyxDQUFDO1lBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM3QyxDQUFDO1FBRUQsa0JBQWtCO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzFDLENBQUM7WUFDRCxrQ0FBa0M7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDckMsTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWixJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2QsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDaEMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1gsS0FBSyxFQUFFO2dCQUNILE9BQU8sSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDdEMsTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLE1BQU0sSUFBSSxHQUFHLENBQUM7b0JBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQzt3QkFDckQsTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7b0JBQ3RCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNyQyxNQUFNLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNoQixDQUFDO29CQUNELE9BQU8sSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQzt3QkFDdEMsTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7d0JBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEIsQ0FBQztnQkFDTCxDQUFDO2dCQUNELEtBQUssQ0FBQztZQUNWLEtBQUssRUFBRTtnQkFDSCxPQUFPLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQzlHLE1BQU0sSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQ0QsS0FBSyxDQUFDO1FBQ2QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO0lBQ0wsQ0FBQztJQUNPLDRCQUFNLEdBQWQ7UUFFSSx3QkFBd0I7UUFFeEIsSUFBSSxHQUFHLEVBQ0gsQ0FBQyxFQUNELE1BQU0sR0FBRyxFQUFFLEVBQ1gsS0FBSyxFQUFPLCtCQUErQjtRQUMzQyxLQUFLLENBQUM7UUFFViw0RUFBNEU7UUFFNUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNaLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ2xCLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNaLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsS0FBSyxHQUFHLENBQUMsQ0FBQzt3QkFDVixHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOzRCQUN4QixHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs0QkFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNqQixLQUFLLENBQUM7NEJBQ1YsQ0FBQzs0QkFDRCxLQUFLLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUM7d0JBQzdCLENBQUM7d0JBQ0QsTUFBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3pDLENBQUM7b0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDaEIsQ0FBQztvQkFDTCxDQUFDO29CQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQzFELE1BQU0sSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDM0MsQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDSixLQUFLLENBQUM7b0JBQ1YsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQzFCLHVDQUF1QztvQkFDdkMsNENBQTRDO29CQUM1QyxpREFBaUQ7b0JBQ2pELDJCQUEyQjtvQkFDM0IsS0FBSyxDQUFDO2dCQUNWLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUM7Z0JBQ3RCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNPLG1DQUFhLEdBQXJCO1FBRUksNkVBQTZFO1FBQzdFLDRFQUE0RTtRQUM1RSw4RUFBOEU7UUFFOUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBRUQsR0FBRyxDQUFDO1lBQ0EsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1osTUFBTSxDQUFDO1lBQ1gsQ0FBQztRQUNMLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRSxFQUFFO0lBQ3RCLENBQUM7SUFDTyxrQ0FBWSxHQUFwQjtRQUVJLDhFQUE4RTtRQUM5RSxpRUFBaUU7UUFDakUsNEVBQTRFO1FBQzVFLDBFQUEwRTtRQUUxRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFFRCxHQUFHLENBQUM7WUFDQSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWixPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNmLE1BQU0sQ0FBQztnQkFDWCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRSxFQUFFO1FBRWxCLElBQUksQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ08sNkJBQU8sR0FBZjtRQUVJLHVFQUF1RTtRQUN2RSw0Q0FBNEM7UUFFNUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDaEMsQ0FBQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDdkMsQ0FBQztJQUNMLENBQUM7SUFDTywyQkFBSyxHQUFiO1FBRUksZ0NBQWdDO1FBQ2hDLG1FQUFtRTtRQUNuRSw0RUFBNEU7UUFDNUUsdUVBQXVFO1FBRXZFLE9BQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDbkIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUM7WUFDWCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFDTywwQkFBSSxHQUFaO1FBRUksd0JBQXdCO1FBRXhCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxHQUFHO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixLQUFLLEdBQUc7Z0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsS0FBSyxHQUFHO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixLQUFLLEdBQUc7Z0JBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDcEIsS0FBSyxHQUFHO2dCQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbkIsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNPLDJCQUFLLEdBQWI7UUFFSSx3QkFBd0I7UUFFeEIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBRWYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixPQUFPLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFHLDBCQUEwQjtnQkFDOUMsQ0FBQztnQkFDRCx1REFBdUQ7Z0JBQ3ZELHlDQUF5QztnQkFDekMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3hDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztnQkFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2Isc0RBQXNEO2dCQUN0RCwyQkFBMkI7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNqQixDQUFDO2dCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2pCLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ08sNEJBQU0sR0FBZDtRQUVJLHlCQUF5QjtRQUV6QixJQUFJLEdBQUcsRUFDSCxLQUFLLEVBQ0wsZUFBZSxHQUFHLElBQUksRUFDdEIsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzlELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwQixPQUFPLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO29CQUNqRCxDQUFDO29CQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFHLDJCQUEyQjtnQkFDaEQsQ0FBQztnQkFFRCxxREFBcUQ7Z0JBQ3JELHdCQUF3QjtnQkFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN4QixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzVCLENBQUM7Z0JBRUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbEYsQ0FBQztnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3ZELE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztnQkFDdEQsQ0FBQztnQkFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2Isd0RBQXdEO2dCQUN4RCx5QkFBeUI7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO3dCQUNqRCxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNoRCxDQUFDO29CQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3ZELENBQUM7b0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDZixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNsQixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO3dCQUNuQixNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNoRCxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQ2IsZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM1QixDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUNPLDJCQUFLLEdBQWI7UUFFSSwyRUFBMkU7UUFDM0UsYUFBYTtRQUViLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2QsS0FBSyxHQUFHO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDekIsS0FBSyxHQUFHO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEIsS0FBSyxHQUFHLENBQUM7WUFDVCxLQUFLLEdBQUc7Z0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN6QixLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRyxDQUFDO1lBQ1QsS0FBSyxHQUFHO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDekI7Z0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUUsQ0FBQztJQUNMLENBQUM7SUFNTSwrQkFBUyxHQUFoQixVQUFpQixHQUFRLEVBQUUsUUFBb0IsRUFBRSxLQUFpQjtRQUF2QywwQ0FBb0I7UUFBRSxvQ0FBaUI7UUFDOUQsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsa0RBQWtEO1FBQ2xELHdDQUF3QztRQUN4Qyx1Q0FBdUM7UUFDdkMsSUFBSSxjQUFjLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNPLCtCQUFTLEdBQWpCLFVBQWtCLEtBQVU7UUFDeEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNSLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDakIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0MsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNPLGlEQUEyQixHQUFuQyxVQUFvQyxNQUFXLEVBQUUsR0FBUSxFQUFFLFVBQW1CO1FBQzFFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV4Qiw2REFBNkQ7UUFDN0QsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUQsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMzQixDQUFDO1FBRUQseUdBQXlHO1FBQ3pHLHFHQUFxRztRQUNyRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4RSxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsU0FBUyxDQUFDO1lBQ3JCLENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBRU8sZ0NBQVUsR0FBbEIsVUFBbUIsSUFBUztRQUN4QixNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUM7WUFDL0IsQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUM7WUFDNUIsQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksSUFBSSxHQUFHLENBQUM7WUFDNUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDO0lBQ3JDLENBQUM7SUFFTyxpQ0FBVyxHQUFuQixVQUFvQixJQUFTO1FBQ3pCLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUMvQixDQUFDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQztZQUM1QixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUM7SUFDckMsQ0FBQztJQUVPLDRCQUFNLEdBQWQsVUFBZSxHQUFRO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDL0IsT0FBTyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNqQixDQUFDO1lBQ0QsQ0FBQyxFQUFFLENBQUM7UUFDUixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ0QsWUFBWTtJQUNKLDZCQUFPLEdBQWYsVUFBZ0IsR0FBUTtRQUNwQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLGdCQUFnQixDQUFDO1FBQ3BFLENBQUM7SUFDTCxDQUFDO0lBRU8sNEJBQU0sR0FBZCxVQUFlLEdBQVE7UUFDbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxlQUFlLENBQUM7SUFDbkUsQ0FBQztJQUVPLDJCQUFLLEdBQWIsVUFBYyxHQUFRO1FBQ2xCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxLQUFLLEdBQUcsQ0FBQztJQUNsRCxDQUFDO0lBRU8sc0NBQWdCLEdBQXhCLFVBQXlCLEdBQVE7UUFDN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxJQUFJLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1lBQ2pFLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUNPLGdDQUFVLEdBQWxCLFVBQW1CLEdBQVcsRUFBRSxHQUFXLEVBQUUsU0FBMEI7UUFBMUIsNkNBQTBCO1FBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNQLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQ0Qsb0NBQW9DO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLFNBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDM0IsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNsQixDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBZ0JPLGtDQUFZLEdBQXBCLFVBQXFCLEdBQVc7UUFFNUIsNEVBQTRFO1FBQzVFLHVFQUF1RTtRQUN2RSwyRUFBMkU7UUFDM0UsYUFBYTtRQUNiLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUM7WUFDekYsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUTtnQkFDeEIsQ0FBQztnQkFDTCxLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU07SUFFRSx1Q0FBaUIsR0FBekIsVUFBMEIsTUFBVyxFQUFFLEdBQVEsRUFBRSxVQUFtQjtRQUNoRSxJQUFJLE1BQU0sRUFBRSxHQUFHLENBQUM7UUFFaEIsa0NBQWtDO1FBQ2xDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRXpFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLGdCQUFnQjtZQUNoQixvREFBb0Q7WUFDcEQsUUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssU0FBUztnQkFDVixNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRS9CLEtBQUssUUFBUTtnQkFDVCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNsQixDQUFDO2dCQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFL0IsS0FBSyxRQUFRO2dCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRWxELEtBQUssUUFBUTtnQkFDVCxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFDbEIsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFFN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ3ZDLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzt3QkFDakQsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssSUFBSSxJQUFJLE9BQU8sR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7NEJBQzdDLE1BQU0sSUFBSSxNQUFNLENBQUM7d0JBQ3JCLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osTUFBTSxJQUFJLEdBQUcsQ0FBQzt3QkFDbEIsQ0FBQzt3QkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQixNQUFNLElBQUksR0FBRyxDQUFDO3dCQUNsQixDQUFDO3dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFDeEIsTUFBTSxJQUFJLElBQUksQ0FBQzt3QkFDbkIsQ0FBQztvQkFDTCxDQUFDO29CQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3BCLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNoRixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEMsTUFBTSxHQUFHLEdBQUcsQ0FBQztvQkFDYixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUM3QixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN4QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQzFELFVBQVUsR0FBRyxLQUFLLENBQUM7NEJBQ25CLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQ0FDakQsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dDQUNoRSxRQUFRLEdBQUcsSUFBSSxDQUFDO2dDQUNoQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUNqRSxNQUFNLElBQUksT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7NEJBQ3hFLENBQUM7d0JBQ0wsQ0FBQztvQkFDTCxDQUFDO29CQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ1gsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUNsSCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBQ2xCLENBQUM7Z0JBQ0wsQ0FBQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2xCO2dCQUNJLDRDQUE0QztnQkFDNUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUN6QixDQUFDO0lBQ0wsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQzs7QUF0dUJpQix3QkFBWSxHQUFHLEtBQUssQ0FBQztBQUNwQixtQkFBTyxHQUFHO0lBQ3JCLEdBQUcsRUFBRSxHQUFHO0lBQ1IsR0FBRyxFQUFFLEdBQUc7SUFDUixJQUFJLEVBQUUsSUFBSTtJQUNWLEdBQUcsRUFBRSxHQUFHO0lBQ1IsSUFBSSxFQUFFLEVBQUU7SUFDUixDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0NBQ1YsQ0FBQztBQUNhLGNBQUUsR0FBRztJQUNoQixHQUFHO0lBQ0gsSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixNQUFNO0lBQ04sUUFBUTtDQUNYLENBQUM7QUFvbUJGLGdEQUFnRDtBQUNoRCw4R0FBOEc7QUFDOUcsUUFBUTtBQUNPLGNBQUUsR0FBRywwR0FBMEcsQ0FBQztBQUNoSCxxQkFBUyxHQUFHLDBIQUEwSCxDQUFDO0FBQ3ZJLGdCQUFJLEdBQUc7SUFDbEIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLEdBQUcsRUFBRSxLQUFLO0lBQ1YsSUFBSSxFQUFFLE1BQU07Q0FDZixDQUFDOzs7Ozs7Ozs7OztBQzNvQm9DO0FBRTFDO0lBT0ksd0JBQW1CLElBQW9CLEVBQUUsa0JBQTZCLEVBQUUsZ0JBQStCO1FBQS9CLDBEQUErQjtRQUFwRixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQUYvQixzQkFBaUIsR0FBZ0IsSUFBSSxDQUFDO1FBQ3RDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFnSHpCLGlCQUFZLEdBQVksSUFBSSxDQUFDO1FBOUdqQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsa0JBQWtCLENBQUM7UUFDN0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzlHLENBQUM7SUFDRCxzQkFBVyxrQ0FBTTthQUFqQixjQUFxQyxNQUFNLENBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNoRSw2Q0FBb0IsR0FBM0IsVUFBNEIsS0FBZ0IsRUFBRSxZQUFvQixFQUFFLFlBQW9CO1FBQ3BGLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBQ00sMENBQWlCLEdBQXhCLFVBQXlCLEtBQWdCLEVBQUUsWUFBb0I7UUFDM0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDTSxnREFBdUIsR0FBOUIsVUFBK0IsS0FBZ0IsRUFBRSxZQUFvQixFQUFFLFlBQWlCO1FBQ3BGLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNNLHlDQUFnQixHQUF2QixVQUF3QixLQUFnQjtRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDekIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDcEMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNNLHVDQUFjLEdBQXJCLFVBQXNCLEtBQWdCLEVBQUUsUUFBNkI7UUFDakUsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixJQUFJLGNBQWMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLElBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzFILElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDO2dCQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUNNLDRCQUFHLEdBQVY7UUFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUNNLCtCQUFNLEdBQWIsVUFBYyxLQUFnQixFQUFFLFFBQW9DO1FBQXBDLDBDQUFvQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN4QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDNUIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQztZQUNwRCxJQUFJLGNBQWMsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUM1RCxFQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDekUsRUFBRSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxLQUFLLEVBQUUsQ0FBQztnQkFDWixDQUFDO2dCQUNELElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUNNLG9DQUFXLEdBQWxCLFVBQW1CLEtBQWdCO1FBQy9CLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQztZQUN4QyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUM5RyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7SUFDTCxDQUFDO0lBQ08sNkNBQW9CLEdBQTVCLFVBQTZCLFlBQW9CLEVBQUUsWUFBb0IsRUFBRSxJQUFTO1FBQzlFLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUMvQixJQUFJLGNBQWMsR0FBd0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDUCxjQUFjLEdBQUcsZ0VBQXNCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BGLElBQUksMkRBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUN2RCxjQUFjLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztZQUN2QyxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsY0FBYyxHQUFHLGdFQUFzQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2hHLENBQUM7WUFDRCxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQyxjQUFjLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQztRQUN4QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFDTyw0Q0FBbUIsR0FBM0IsVUFBNEIsUUFBYSxFQUFFLEdBQVE7UUFDL0MsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUNPLHlDQUFnQixHQUF4QixVQUF5QixLQUFnQixFQUFFLFFBQTZCO1FBQ3BFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQzVDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksTUFBTSxHQUFXLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBVyxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNPLG9DQUFXLEdBQW5CLFVBQW9CLEtBQWdCLEVBQUUsUUFBNkI7UUFDL0QsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLFNBQVMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFJTyxxQ0FBWSxHQUFwQixVQUFxQixDQUFZO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUFDLFlBQVksSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7SUFDTCxDQUFDO0lBQ08sa0NBQVMsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFDaEMsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDckIsVUFBVSxDQUFDLGNBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7SUFDTCxDQUFDO0lBQ08saURBQXdCLEdBQWhDLFVBQWlDLENBQVk7UUFDekMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1lBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFXLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDO0lBQ2xJLENBQUM7SUFDTyxpQ0FBUSxHQUFoQixVQUFpQixLQUFnQjtRQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDbkUsQ0FBQztJQUVPLHVDQUFjLEdBQXRCLFVBQXVCLGNBQW1DLEVBQUUsS0FBYTtRQUNyRSxFQUFFLENBQUMsQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDekQsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMvRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7WUFBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0lBQ08sb0NBQVcsR0FBbkIsVUFBb0IsS0FBZ0I7UUFDaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQzFCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNPLDZCQUFJLEdBQVosVUFBYSxPQUFvQjtRQUM3QixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFZixPQUFPLE9BQU8sRUFBRSxDQUFDO1lBQ2IsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0RSxPQUFPLEdBQWdCLE9BQU8sQ0FBQyxZQUFZLENBQUM7UUFDaEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNPLG9DQUFXLEdBQW5CLFVBQW9CLEtBQWdCLEVBQUUsWUFBb0IsRUFBRSxZQUFvQixFQUFFLElBQWdCO1FBQWhCLGtDQUFnQjtRQUM5RixJQUFJLEdBQUcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUFDLEdBQUcsSUFBSSxlQUFlLEdBQUcsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUM5RCxHQUFHLElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDakYsY0FBYyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBQ08sZ0NBQU8sR0FBZixVQUFnQixLQUFnQixFQUFFLElBQVksRUFBRSxJQUFnQjtRQUFoQixrQ0FBZ0I7UUFDNUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNyQixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDekMsS0FBSyxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzlDLENBQUM7UUFDRCxjQUFjLENBQUMsUUFBUSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDekQsQ0FBQztJQUNPLGdDQUFPLEdBQWYsVUFBZ0IsS0FBZ0I7UUFDNUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixLQUFLLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNyQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNQLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFDTyxrQ0FBUyxHQUFqQjtRQUNJLGNBQWMsQ0FBQyxRQUFRLEdBQUcsRUFBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3ZFLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQzs7QUFsT1Usd0JBQVMsR0FBVyxXQUFXLENBQUM7QUFDaEMsdUJBQVEsR0FBUSxFQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0FBQ3hDLHdCQUFTLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQW9IckMsMEJBQVcsR0FBVyxFQUFFLENBQUM7QUFDekIsMkJBQVksR0FBVyxHQUFHLENBQUM7Ozs7Ozs7Ozs7Ozs7QUMxSGY7QUFDK0M7QUFDdEI7QUFLeEQ7SUFpQkksOEJBQW1CLFFBQW1DLEVBQUUsaUJBQXlELEVBQUUscUJBQWlDO1FBQTVGLDREQUF5RDtRQUFFLG9FQUFpQztRQUFqSSxhQUFRLEdBQVIsUUFBUSxDQUEyQjtRQWtDOUMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBakN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLG9EQUFhLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUNoQyxNQUFNO1FBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQ2pDLENBQUM7UUFDRCxJQUFJLGFBQWEsR0FBRyxVQUFVLFFBQWEsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxxR0FBd0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztRQUM1QyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM3RCxJQUFJLENBQUMsZUFBZSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsUUFBUSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxNQUFNLEdBQUcsa0RBQVcsQ0FBQyxjQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxrREFBVyxDQUFDLGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUNELHNCQUFXLHdDQUFNO2FBQWpCLGNBQTJCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQzthQUNyRCxVQUFrQixLQUFVO1lBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDOzs7T0FKb0Q7SUFLM0MsMENBQVcsR0FBckI7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLENBQUM7SUFFTyxpREFBa0IsR0FBMUIsVUFBMkIsUUFBYTtRQUNwQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBQ08sK0NBQWdCLEdBQXhCLFVBQXlCLFFBQWE7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUNPLCtDQUFnQixHQUF4QixVQUF5QixRQUFhO1FBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0lBQ1MsdUNBQVEsR0FBbEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNTLDJDQUFZLEdBQXRCLFVBQXVCLEtBQVUsSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLDJCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEY4QjtBQUN5QjtBQUNIO0FBQ1g7QUFFMUM7SUFNSSxxQkFBbUIsa0JBQTZCO1FBQTdCLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBVztRQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLHlEQUFrQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxPQUFPLEdBQUcsMkRBQWlCLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN6QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNMLENBQUM7SUFDRCxzQkFBVywrQkFBTTthQUFqQixjQUFxQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDL0QsVUFBa0IsS0FBb0I7WUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzdCLENBQUM7OztPQUo4RDtJQUsvRCxzQkFBVyw0QkFBRzthQUFkLGNBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUM7YUFDOUMsVUFBZSxLQUFVO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQzs7O09BTDZDO0lBTXRDLGdDQUFVLEdBQWxCO1FBQ0ksSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxPQUFPLEdBQUcsbUVBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSw4REFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxRQUFRLEdBQXdCLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzdGLENBQUM7WUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzdGLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQzs7QUFDRDtJQUdJLHdCQUFtQixNQUFxQixFQUFTLFFBQTZCLEVBQVMsa0JBQTZCO1FBQWpHLFdBQU0sR0FBTixNQUFNLENBQWU7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUFTLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBVztRQUNoSCxJQUFJLENBQUMsT0FBTyxHQUFHLHlEQUFrQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxvREFBYSxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUNELHNCQUFXLGdDQUFJO2FBQWYsY0FBNEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzVDLHFCQUFDO0FBQUQsQ0FBQzs7QUFDRDtJQUE4QywyRkFBYztJQUN4RCxrQ0FBbUIsTUFBcUIsRUFBUyxRQUE2QixFQUFTLGtCQUE2QjtRQUFwSCxZQUNJLGtCQUFNLE1BQU0sRUFBRSxRQUFRLEVBQUUsa0JBQWtCLENBQUMsU0FVOUM7UUFYa0IsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUFTLGNBQVEsR0FBUixRQUFRLENBQXFCO1FBQVMsd0JBQWtCLEdBQWxCLGtCQUFrQixDQUFXO1FBRWhILElBQUksT0FBTyxHQUFHLDJEQUFpQixDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEYsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSwrRUFBa0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEcsQ0FBQztRQUNELEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7UUFDaEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUN0RixDQUFDO0lBQ0Qsc0JBQVcsMENBQUk7YUFBZixjQUE0QixNQUFNLENBQUMsK0VBQWtCLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRSw2Q0FBVSxHQUFsQixVQUFtQixZQUFvQjtRQUNuQyxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUNwRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQsSUFBSSxXQUFXLEdBQUcsZ0VBQXNCLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRyxJQUFJLE9BQU8sR0FBRyxJQUFJLDJEQUFpQixFQUFFLENBQUM7UUFDdEMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDM0QsQ0FBQztJQUNMLCtCQUFDO0FBQUQsQ0FBQyxDQTFCNkMsY0FBYyxHQTBCM0Q7O0FBQ0Q7SUFBOEMsMkZBQWM7SUFFeEQsa0NBQW1CLE1BQXFCLEVBQVMsUUFBNkIsRUFBUyxrQkFBNkI7UUFBcEgsWUFDSSxrQkFBTSxNQUFNLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixDQUFDLFNBVzlDO1FBWmtCLFlBQU0sR0FBTixNQUFNLENBQWU7UUFBUyxjQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUFTLHdCQUFrQixHQUFsQixrQkFBa0IsQ0FBVztRQUVoSCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2hELElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxtRUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEUsQ0FBQztRQUNELEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsS0FBSSxDQUFDLFFBQVEsR0FBZ0IsS0FBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRSxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7UUFDaEIsS0FBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUN0RixDQUFDO0lBQ0Qsc0JBQVcsMENBQUk7YUFBZixjQUE0QixNQUFNLENBQUMsK0VBQWtCLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRSw2Q0FBVSxHQUFsQixVQUFtQixPQUFvQjtRQUNuQyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3hELElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7WUFBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0lBQ0wsK0JBQUM7QUFBRCxDQUFDLENBdEI2QyxjQUFjLEdBc0IzRDs7Ozs7Ozs7Ozs7OztBQ3pHOEI7QUFDYTtBQU81QztJQVlJLDJCQUFZLG9CQUFxRCxFQUFFLG9CQUFxRCxFQUM1RyxrQkFBaUQsRUFBRSxvQkFBcUQ7UUFEeEcsa0VBQXFEO1FBQUUsa0VBQXFEO1FBQzVHLDhEQUFpRDtRQUFFLGtFQUFxRDtRQUpwSCxpQkFBWSxHQUFRLElBQUksQ0FBQztRQUtyQixJQUFJLENBQUMsT0FBTyxHQUFHLHlEQUFrQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxvREFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO1FBQzdDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNqRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFTLFFBQVE7WUFDcEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztnQkFDNUIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLEVBQU8sRUFBRSxDQUFnQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsRUFBTyxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxFQUFPLElBQUssQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsRUFBTyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBQ0Qsc0JBQVcscUNBQU07YUFBakIsY0FBcUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQy9ELFVBQWtCLEtBQW9CO1lBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQzs7O09BTDhEO0lBTXhELDJDQUFlLEdBQXRCLFVBQXVCLElBQWlCO1FBQ3BDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFDTSwyQ0FBZSxHQUF0QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDaEMsQ0FBQztJQUNMLENBQUM7SUFDTSxzQ0FBVSxHQUFqQixVQUFrQixJQUFpQjtRQUMvQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQztJQUNMLENBQUM7SUFDTSxzQ0FBVSxHQUFqQixVQUFrQixJQUFpQjtRQUMvQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLG1FQUFZLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztJQUNMLENBQUM7SUFDUywwQ0FBYyxHQUF4QixVQUF5QixJQUFpQjtRQUN0QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUNTLHFDQUFTLEdBQW5CLFVBQW9CLEVBQU8sRUFBRSxDQUFnQjtRQUN6QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUM7WUFBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JGLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLFNBQVMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDN0MsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDO0lBQ0wsQ0FBQztJQUNTLHVDQUFXLEdBQXJCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDckQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxLQUFLLEVBQUUsb0RBQWEsQ0FBQyxtRUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLG9EQUFhLENBQUMsS0FBSyxDQUFDO2FBQ3ZHLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDTyw4Q0FBa0IsR0FBMUIsVUFBMkIsTUFBVztRQUNsQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixNQUFNLENBQUM7UUFDWCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUMsQ0FBQztJQUNMLENBQUM7SUFDTCx3QkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFIOEI7QUFDaUM7QUFDRjtBQUNwQjtBQUUxQztJQUFvRCxpR0FBeUI7SUFLekU7UUFBQSxZQUNJLGlCQUFPLFNBVVY7UUFURyxJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7UUFDaEIsS0FBSSxDQUFDLFlBQVksR0FBRyxvREFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLEtBQUksQ0FBQyxXQUFXLEdBQUcsb0RBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNyQyxLQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVE7WUFDMUMsRUFBRSxDQUFDLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztnQkFBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQzdELElBQUk7Z0JBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztRQUNILEtBQUksQ0FBQyxxQkFBcUIsR0FBRyxjQUFjLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsS0FBSSxDQUFDLHFCQUFxQixHQUFHLGNBQWMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFDNUUsQ0FBQztJQUNELHNCQUFXLHNEQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNqRCxpREFBUSxHQUFmO1FBQ0ksSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuRCxNQUFNLEdBQUcsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ1MsNERBQW1CLEdBQTdCLGNBQXVDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxvREFBYSxFQUFFLEVBQUUsTUFBTSxFQUFFLG9EQUFhLEVBQUUsRUFBRSxVQUFVLEVBQUUsb0RBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5SCx5REFBZ0IsR0FBMUIsVUFBMkIsSUFBUztRQUNoQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2IsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdkIsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekIsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxvREFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxvREFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxvREFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7SUFDcEgsQ0FBQztJQUNTLGlFQUF3QixHQUFsQyxVQUFtQyxVQUFlO1FBQzlDLElBQUksOEJBQThCLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLDhCQUE4QixDQUFDO1FBQ2pHLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFDUyxzREFBYSxHQUF2QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUNELGlCQUFNLGFBQWEsV0FBRSxDQUFDO0lBQzFCLENBQUM7SUFDUyxvREFBVyxHQUFyQixVQUFzQixJQUFZO1FBQzlCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFBQyxRQUFRLENBQUM7Z0JBQ3hCLElBQUksU0FBUyxHQUFHLElBQUksMERBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLElBQUksSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3ZGLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDUyxxREFBWSxHQUF0QjtRQUNJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFBQyxRQUFRLENBQUM7WUFDaEQsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFBQyxRQUFRLElBQUksMERBQWdCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUMxRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ1MscURBQVksR0FBdEIsVUFBdUIsR0FBUTtRQUMzQixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDaEIsQ0FBQztJQUNMLHFDQUFDO0FBQUQsQ0FBQyxDQS9FbUQsdUZBQXlCLEdBK0U1RTs7QUFFRCxxRkFBd0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLGNBQXdDLE1BQU0sQ0FBQyxJQUFJLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RGL0c7QUFDaUM7QUFDRjtBQUNYO0FBQ1Q7QUFFMUM7SUFBb0QsaUdBQXlCO0lBS3pFO1FBQUEsWUFDSSxpQkFBTyxTQVlWO1FBZk0seUJBQW1CLEdBQWtCLEVBQUUsQ0FBQztRQUN2QyxzQkFBZ0IsR0FBb0MsRUFBRSxDQUFDO1FBRzNELElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztRQUNoQixLQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSx5RUFBa0IsRUFBRSxDQUFDO1FBQ3JELEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsT0FBTztZQUNqRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRixDQUFDLENBQUMsQ0FBQztRQUNILEtBQUksQ0FBQyxVQUFVLEdBQUcsb0RBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxLQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVEsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxHQUFHLFFBQVEsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1SSxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsMkRBQWlCLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9GLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUN6RCxLQUFJLENBQUMsYUFBYSxHQUFHLGNBQWMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0UsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLGFBQWEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUNoRixDQUFDO0lBQ0Qsc0JBQVcsc0RBQVU7YUFBckIsY0FBa0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzlDLHVEQUFjLEdBQXhCO1FBQ0ksaUJBQU0sY0FBYyxXQUFFLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDMUUsQ0FBQztJQUNMLENBQUM7SUFDUyx5REFBZ0IsR0FBMUIsVUFBMkIsSUFBUztRQUNoQyxJQUFJLE9BQU8sR0FBRyxJQUFJLDJEQUFpQixFQUFFLENBQUM7UUFDdEMsSUFBSSxTQUFTLEdBQUcsMkRBQWlCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN2RSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ1MsaUVBQXdCLEdBQWxDLFVBQW1DLFVBQWU7UUFDOUMsSUFBSSxJQUFJLEdBQWdDLFVBQVUsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBQ08sZ0RBQU8sR0FBZixVQUFnQixhQUFxQjtRQUNqQyxJQUFJLFlBQVksR0FBRyxJQUFJLDJCQUEyQixDQUFDLDJEQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTywrREFBc0IsR0FBOUI7UUFDSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNPLCtEQUFzQixHQUE5QixVQUErQixRQUFtQyxFQUFFLEdBQVEsRUFBRSxRQUFhO1FBQ3ZGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDdEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQzFELENBQUM7SUFDTCxxQ0FBQztBQUFELENBQUMsQ0FwRG1ELHVGQUF5QixHQW9ENUU7O0FBRUQ7SUFFSSxxQ0FBbUIsU0FBaUM7UUFBakMsY0FBUyxHQUFULFNBQVMsQ0FBd0I7UUFDaEQsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUNMLGtDQUFDO0FBQUQsQ0FBQzs7QUFHRCxxRkFBd0IsQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLGNBQXdDLE1BQU0sQ0FBQyxJQUFJLDhCQUE4QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNwRXRCO0FBQy9EO0FBR3pEO0lBQXdELHFHQUF3QjtJQUM1RSw0Q0FBbUIsWUFBaUMsRUFBRSx5QkFBd0Y7UUFBOUksWUFDSSxrQkFBTSxZQUFZLEVBQUUseUJBQXlCLENBQUMsU0FDakQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCOztJQUVwRCxDQUFDO0lBQ1MsOERBQWlCLEdBQTNCLFVBQTRCLFFBQW9CO1FBQzVDLGlCQUFNLGlCQUFpQixZQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdELFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFELFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLCtFQUFrQixDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMxSCxDQUFDO0lBRVMsNkRBQWdCLEdBQTFCLGNBQStELE1BQU0sQ0FBQyxJQUFJLDRDQUE0QyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEsseUNBQUM7QUFBRCxDQUFDLENBWnVELHFGQUF3QixHQVkvRTs7QUFFRDtJQUFrRSwrR0FBOEI7SUFLNUYsc0RBQW1CLFlBQWlDLEVBQVMsWUFBb0IsRUFBRSxVQUFvQztRQUF2SCxZQUNJLGtCQUFNLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFNBQ2hEO1FBRmtCLGtCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUFTLGtCQUFZLEdBQVosWUFBWSxDQUFROztJQUVqRixDQUFDO0lBQ1Msc0VBQWUsR0FBekI7UUFDSSxpQkFBTSxlQUFlLFdBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDO1FBQ2pELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBQ0Qsc0JBQVcsK0VBQXFCO2FBQWhDLGNBQThDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM1RCxzQkFBVyxnRkFBc0I7YUFBakMsY0FBOEMsTUFBTSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDbkYsNERBQUssR0FBWjtRQUNJLGlCQUFNLEtBQUssV0FBRSxDQUFDO1FBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDTSw0REFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDNUUsQ0FBQztJQUNMLG1EQUFDO0FBQUQsQ0FBQyxDQTVCaUUsMkZBQThCLEdBNEIvRjs7QUFFRCxxRkFBd0IsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxRQUE2QixFQUFFLHlCQUF3RixJQUE4QixNQUFNLENBQUMsSUFBSSxrQ0FBa0MsQ0FBQyxRQUFRLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUNoRGpSO0FBQ0s7QUFFcEM7SUErQ0k7UUF2Q08sYUFBUSxHQUFXLElBQUksQ0FBQztRQUN4QixpQkFBWSxHQUFXLElBQUksQ0FBQztRQUM1QixzQkFBaUIsR0FBWSxLQUFLLENBQUM7UUFPbEMsb0JBQWUsR0FBRztZQUN0QixTQUFTLEVBQUUsdUZBQXVGO1lBQ2xHLFFBQVEsRUFBRSxnSkFBZ0o7WUFDMUosVUFBVSxFQUFFLGdKQUFnSjtZQUM1SixPQUFPLEVBQUUsd0dBQXdHO1NBQ3BILENBQUM7UUFDTSxxQkFBZ0IsR0FBRztZQUN2QixTQUFTLEVBQUUsNlVBQTZVO1lBQ3hWLFFBQVEsRUFBRSx5SUFBeUk7WUFDbkosVUFBVSxFQUFFLDJHQUEyRztZQUN2SCxPQUFPLEVBQUUsNklBQTZJO1NBQ3pKLENBQUM7UUFDTSx1QkFBa0IsR0FBRztZQUN6QixTQUFTLEVBQUUsbVZBQW1WO1lBQzlWLFFBQVEsRUFBRSwrSUFBK0k7WUFDekosVUFBVSxFQUFFLDRHQUE0RztZQUN4SCxPQUFPLEVBQUUsbUpBQW1KO1NBQy9KLENBQUM7UUFDTSx1QkFBa0IsR0FBRztZQUN6QixTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFFBQVEsRUFBRSxvQ0FBb0M7WUFDOUMsVUFBVSxFQUFFLG9DQUFvQztZQUNoRCxPQUFPLEVBQUUsb0NBQW9DO1NBQ2hELENBQUM7UUFDTSx5QkFBb0IsR0FBRztZQUMzQixTQUFTLEVBQUUsbUJBQW1CO1lBQzlCLFFBQVEsRUFBRSxvQ0FBb0M7WUFDOUMsVUFBVSxFQUFFLEVBQUU7WUFDZCxPQUFPLEVBQUUsb0NBQW9DO1NBQ2hELENBQUM7UUFFRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG9EQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxvREFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsb0RBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsUUFBUSxHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLFlBQVksR0FBRyxvREFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXpDLElBQUksQ0FBQyxVQUFVLEdBQUcsb0RBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsVUFBVSxHQUFHLG9EQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxhQUFhLEdBQUcsa0RBQVcsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RKLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUYsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBQ0Qsc0JBQVcsc0NBQUk7YUFBZixjQUF5QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDakQsVUFBZ0IsS0FBVSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BRE47SUFFakQsc0JBQVcsOENBQVk7YUFBdkIsY0FBcUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ2xFLG1DQUFJLEdBQVg7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFDTywwQ0FBVyxHQUFuQjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNySCxDQUFDO0lBQ08sMENBQVcsR0FBbkI7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDeEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdEMsR0FBRyxJQUFJLHlFQUF5RSxDQUFDO1FBQ3JGLENBQUM7UUFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDTywwQ0FBVyxHQUFuQjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNPLDJDQUFZLEdBQXBCLFVBQXFCLFdBQW1CO1FBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNPLDBDQUFXLEdBQW5CO1FBQ0ksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLE1BQU0sQ0FBQztRQUMvQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ3RDLEdBQUcsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDcEgsSUFBSSxRQUFRLEdBQUcsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3BELENBQUM7SUFDTyx3Q0FBUyxHQUFqQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxXQUFXLENBQUM7WUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQywwQ0FBMEMsQ0FBQztJQUN0RCxDQUFDO0lBQ08sMENBQVcsR0FBbkI7UUFDSSxNQUFNLENBQUMsdUNBQXVDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUNwRixDQUFDO0lBQ08sOENBQWUsR0FBdkI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDbEYsTUFBTSxDQUFDLHdHQUF3RyxDQUFDO0lBQ3BILENBQUM7SUFDTywwQ0FBVyxHQUFuQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDbEQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsSUFBSSwyREFBVyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ08sOENBQWUsR0FBdkIsVUFBd0IsTUFBc0IsRUFBRSxNQUFXLEVBQUUsSUFBWTtRQUNyRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0wsMkJBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0SThCO0FBQ1c7QUFFMUM7SUFLSTtRQUhRLFVBQUssR0FBVyxDQUFDLENBQUMsQ0FBQztRQUVwQixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxvREFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDTSw4QkFBSyxHQUFaO1FBQ0ksSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFDTSxtQ0FBVSxHQUFqQixVQUFrQixNQUFxQixFQUFFLGVBQXVCO1FBQzVELElBQUksSUFBSSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLDJEQUFpQixFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO1FBQ3ZDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNNLDZCQUFJLEdBQVg7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNNLDZCQUFJLEdBQVg7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDTywwQ0FBaUIsR0FBekI7UUFDSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQ08sbUNBQVUsR0FBbEIsVUFBbUIsTUFBYztRQUM3QixJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0YsQ0FBQztJQUNELHNCQUFjLG1DQUFPO2FBQXJCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDN0QsQ0FBQzs7O09BQUE7SUFDRCxzQkFBYyxtQ0FBTzthQUFyQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDdkUsQ0FBQzs7O09BQUE7SUFDTyxzQ0FBYSxHQUFyQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3RELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDTCxxQkFBQztBQUFELENBQUM7O0FBRUQ7SUFBQTtJQUdBLENBQUM7SUFBRCxtQkFBQztBQUFELENBQUM7Ozs7Ozs7O0FDOURELHlDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQStCO0FBQ3lCO0FBQ047QUFDRjtBQUNZO0FBQ2Q7QUFDSjtBQUMwQztBQUNoQztBQUNQO0FBQ1c7QUFDSDtBQUNMO0FBQ1o7QUFDcEMsSUFBSSxrQkFBa0IsR0FBRyxtQkFBTyxDQUFDLEVBQTJELENBQUMsQ0FBQztBQUM5RixJQUFJLGdCQUFnQixHQUFHLG1CQUFPLENBQUMsRUFBMEUsQ0FBQyxDQUFDO0FBQzNHLElBQUksb0JBQW9CLEdBQUcsbUJBQU8sQ0FBQyxFQUE4RSxDQUFDLENBQUM7QUFDekU7QUFFMUM7SUFpREksc0JBQVksZUFBMkIsRUFBRSxPQUFtQjtRQUFoRCx3REFBMkI7UUFBRSx3Q0FBbUI7UUFoQ3BELGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsbUJBQWMsR0FBbUIsSUFBSSxDQUFDO1FBS3ZDLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFDeEIsaUJBQVksR0FBVyxJQUFJLENBQUM7UUFHNUIsa0NBQTZCLEdBQVcsQ0FBQyxDQUFDO1FBRTFDLG1DQUE4QixHQUFZLEtBQUssQ0FBQztRQUNoRCxzQkFBaUIsR0FBbUUsSUFBSSx1REFBWSxFQUFvRCxDQUFDO1FBOEloSyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBekhmLElBQUksQ0FBQyxhQUFhLEdBQUcsb0RBQWEsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsd0JBQXdCLEdBQUcseURBQWtCLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsb0RBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLG9EQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsU0FBUyxHQUFHLHlEQUFrQixFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG9EQUFhLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLFVBQVUsUUFBUSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvSCxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsUUFBUTtZQUNqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxRUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGtFQUFjLEVBQUUsQ0FBQztRQUVyQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksaUVBQVcsQ0FBQyxjQUFjLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLHlFQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsb0JBQW9CLENBQUMseUJBQXlCLEdBQUcsVUFBVSxNQUFXLEVBQUUsUUFBbUM7WUFDNUcsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUNELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNLEVBQUUsT0FBTztZQUNqRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLDJHQUE4QixFQUFFLENBQUM7UUFDakUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLHlCQUF5QixHQUFHLFVBQVUsTUFBVyxFQUFFLFFBQW1DO1lBQzVHLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksdUVBQWlCLENBQUMsY0FBUSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBQyxJQUFpQixJQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNqSSxVQUFDLFNBQWlCLEVBQUUsT0FBZSxJQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUMsSUFBaUIsSUFBTyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVJLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxtRkFBb0IsRUFBRSxDQUFDO1FBRWpELElBQUksQ0FBQyxVQUFVLEdBQUcsb0RBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsa0RBQVcsQ0FBQyxjQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0YsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGNBQWMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxjQUFjLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxjQUFjLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsY0FBYyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLHlCQUF5QixHQUFHLGNBQWMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGNBQWMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsWUFBWSxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxZQUFZLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQywwQkFBMEIsR0FBRyxVQUFVLElBQUksSUFBSSxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLFdBQVcsR0FBRyxjQUFjLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxXQUFXLEdBQUcsY0FBYyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUxRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksMkVBQWdCLEVBQUUsQ0FBQztRQUV6QyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNMLENBQUM7SUFDUyxpQ0FBVSxHQUFwQixVQUFxQixPQUFZO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssV0FBVyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDL0gsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEtBQUssV0FBVyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDL0gsSUFBSSxDQUFDLHlCQUF5QixHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssV0FBVyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDekksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDekUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1lBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBQ0Qsc0JBQVcsZ0NBQU07YUFBakI7WUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUM1QixDQUFDOzs7T0FBQTtJQUNNLDZCQUFNLEdBQWIsVUFBYyxPQUFtQixFQUFFLE9BQW1CO1FBQXhDLHdDQUFtQjtRQUFFLHdDQUFtQjtRQUNsRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4QyxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO1FBQ25DLENBQUM7UUFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUNyQixPQUFPLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBQ00saUNBQVUsR0FBakIsVUFBa0IsUUFBZ0I7UUFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksaUVBQXNCLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsT0FBZ0IsRUFBRSxNQUFjLEVBQUUsUUFBYTtZQUN2RyxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxzQkFBVyw4QkFBSTthQUFmO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1lBQ3JFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNoQyxDQUFDO2FBQ0QsVUFBZ0IsS0FBYTtZQUN6QixJQUFJLFVBQVUsR0FBRyxJQUFJLHFFQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksNERBQWlCLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUM7UUFDTCxDQUFDOzs7T0FYQTtJQVlELHNCQUFXLCtCQUFLO2FBQWhCLGNBQTZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDNUMsK0JBQVEsR0FBbEIsVUFBbUIsS0FBYTtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRVMsNkJBQU0sR0FBaEI7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNkLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQzNCLHdCQUF3QixFQUFVLEVBQUUsU0FBa0I7Z0JBQ2xELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7SUFDTCxDQUFDO0lBQ1Msa0NBQVcsR0FBckI7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFDTyw4Q0FBdUIsR0FBL0IsVUFBZ0MsVUFBMkI7UUFBM0IsK0NBQTJCO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQzVFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNELHNCQUFXLHdDQUFjO2FBQXpCLGNBQThCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO2FBQ2hFLFVBQTBCLEtBQVU7WUFDaEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztZQUNqQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUM7OztPQUorRDtJQUtoRSxzQkFBVyxxQ0FBVzthQUF0QixjQUEyQixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN6RCxVQUF1QixLQUFjLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQURaO0lBRXpELHNCQUFXLDJDQUFpQjthQUE1QixjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQzthQUN0RSxVQUE2QixLQUFjLElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQURmO0lBRXRFLHNCQUFXLDJDQUFpQjthQUE1QixjQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQzthQUN0RSxVQUE2QixLQUFjLElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQURmO0lBRXRFLHNCQUFXLDhDQUFvQjthQUEvQixjQUFvQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQzthQUM1RSxVQUFnQyxLQUFjLElBQUksSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQURmO0lBR2xFLDhDQUF1QixHQUFqQyxVQUFrQyxNQUFXLEVBQUUsUUFBbUM7UUFDOUUsSUFBSSxPQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ2pFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFTyxtQ0FBWSxHQUFwQixVQUFxQixLQUFhO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBQ00sOEJBQU8sR0FBZDtRQUNJLElBQUksSUFBSSxHQUFHLG9FQUFZLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLEdBQWdCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFDTSxtQ0FBWSxHQUFuQixVQUFvQixHQUFXLElBQUksTUFBTSxDQUFDLCtFQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsdUNBQWdCLEdBQTFCO1FBQ0ksSUFBSSxRQUFRLEdBQUcsaUVBQXNCLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDO1lBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN4RyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN6RCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM5QixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNPLCtCQUFRLEdBQWhCLFVBQWlCLFNBQWlCLEVBQUUsT0FBZTtRQUMvQyxJQUFJLElBQUksR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUNPLGtDQUFXLEdBQW5CLFVBQW9CLElBQWlCO1FBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNPLHNDQUFlLEdBQXZCLFVBQXdCLFFBQTZCO1FBQ2pELElBQUksSUFBSSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDTyx3Q0FBaUIsR0FBekIsVUFBMEIsUUFBNkI7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ08sNkNBQXNCLEdBQTlCLFVBQStCLFFBQW1DLEVBQUUsR0FBUSxFQUFFLFFBQWE7UUFDdkYsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsRCxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsb0VBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksK0RBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBYyxHQUFHLENBQUMsQ0FBQztZQUNsRCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDTyxpQ0FBVSxHQUFsQixVQUFtQixJQUFrQjtRQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUN0RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLFVBQVUsR0FBRyxPQUFPLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBQ08sb0NBQWEsR0FBckIsVUFBc0IsSUFBWTtRQUM5QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksUUFBUSxHQUF3QixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ08sd0NBQWlCLEdBQXpCLFVBQTBCLE9BQWU7UUFDckMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxPQUFPLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxRQUFRLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksNERBQWlCLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNPLG1DQUFZLEdBQXBCO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ08scUNBQWMsR0FBdEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ08scUNBQWMsR0FBdEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ08sc0NBQWUsR0FBdkI7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDTyxnREFBeUIsR0FBakM7UUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLDREQUFpQixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sQ0FBQyxJQUFJLDREQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBQ08sNENBQXFCLEdBQTdCLFVBQThCLEdBQWdCO1FBQzFDLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztRQUMvQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDM0IsSUFBSSxPQUFPLEdBQUcsb0VBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLCtEQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBZ0IsR0FBRyxDQUFDO1lBQzNDLGVBQWUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksK0RBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4QyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7UUFDbEcsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUNPLG1DQUFZLEdBQXBCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDekMsbURBQVksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDbkMsdURBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztnQkFDakMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQUMsTUFBTSxDQUFDO2dCQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO29CQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3pDLENBQUM7WUFDTCxDQUFDLENBQUM7UUFDTixDQUFDO1FBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLDREQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBQ08saUNBQVUsR0FBbEIsVUFBbUIsSUFBUztRQUN4QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHdEQUFhLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksd0VBQWMsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxjQUFjLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUMxRyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTTtRQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHdEQUFhLENBQUMsSUFBSSw0REFBVyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDckcsQ0FBQztRQUNELDBEQUEwRDtRQUMxRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRSxJQUFJO1lBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFxQixFQUFFLE9BQU8sSUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0osSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQXFCLEVBQUUsT0FBTyxJQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hJLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFxQixFQUFFLE9BQU8sSUFBTyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5SSxJQUFJLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBcUIsRUFBRSxPQUFPLElBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUksSUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQXFCLEVBQUUsT0FBTyxJQUFPLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBcUIsRUFBRSxPQUFPLElBQU8sT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNILElBQUksQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBcUIsRUFBRSxPQUFPLElBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQWMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEosSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBcUIsRUFBRSxPQUFPLElBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0SCxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQXFCLEVBQUUsT0FBTyxJQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5SCxDQUFDO0lBQ08sa0NBQVcsR0FBbkIsVUFBb0IsSUFBWTtRQUM1QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxXQUFXLEdBQUcscURBQXFELENBQUM7UUFDeEUsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDNUIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTyx5Q0FBa0IsR0FBMUIsVUFBMkIsWUFBaUIsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFDTywrQ0FBd0IsR0FBaEMsVUFBaUMsSUFBUyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUNPLHNDQUFlLEdBQXZCLFVBQXdCLFlBQWlCO1FBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxpRUFBc0IsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEgsQ0FBQztJQUNPLG1EQUE0QixHQUFwQyxVQUFxQyxJQUFTO1FBQzFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksUUFBUSxHQUFHLGlFQUFzQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xGLElBQUksNERBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ08seUNBQWtCLEdBQTFCO1FBQ0ksTUFBTSxDQUFDLG9FQUFZLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDTywwQ0FBbUIsR0FBM0IsVUFBNEIsUUFBNkI7UUFDckQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDbkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDZixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdFLENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUNPLHFDQUFjLEdBQXRCO1FBQ0ksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQy9CLENBQUM7SUFDTCxDQUFDO0lBQ08scUNBQWMsR0FBdEIsVUFBdUIsSUFBYTtRQUNoQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFDTywrQ0FBd0IsR0FBaEM7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxvRUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSwrREFBTyxDQUFDLFFBQVEsR0FBd0IsQ0FBQyxHQUFHLENBQUMsR0FBRSxJQUFJLENBQUM7SUFDbEcsQ0FBQztJQUNPLDBDQUFtQixHQUEzQjtRQUNJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELHNCQUFXLG9EQUEwQjthQUFyQztZQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO1FBQzNELENBQUM7YUFDRCxVQUFzQyxHQUFXO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUCxJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7OztPQVZBO0lBV00seUNBQWtCLEdBQXpCLFVBQTBCLFFBQTZCO1FBQ25ELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLFFBQVEsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RyxDQUFDO0lBQ08sOENBQXVCLEdBQS9CLFVBQWdDLFFBQTZCO1FBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ00sK0NBQXdCLEdBQS9CLFVBQWdDLFFBQTZCO1FBQ3pELElBQUksT0FBTyxHQUFHLG9FQUFZLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSwrREFBTyxDQUFDLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN4QyxJQUFJLElBQUksR0FBRyxJQUFJLDREQUFpQixFQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLENBQUM7WUFDOUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFFTSx1Q0FBZ0IsR0FBdkIsVUFBd0IsUUFBNkI7UUFDakQsSUFBSSxJQUFJLEdBQUcsSUFBSSw0REFBaUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsNEJBQTRCLENBQUUsSUFBSSxDQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVPLHFEQUE4QixHQUF0QyxVQUF1QyxJQUFZO1FBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQzVDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNPLG1DQUFZLEdBQXBCLFVBQXFCLEdBQVE7UUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsSUFBSSxPQUFPLEdBQUcsb0VBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLCtEQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSwrREFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ08scUNBQWMsR0FBdEI7UUFBQSxpQkFrQkM7UUFqQkcsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDM0IsQ0FBQztZQUNELElBQUksTUFBTSxHQUFHLElBQUksd0RBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDL0UsSUFBSSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDM0UsRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUM7Z0JBQUMsc0JBQXNCLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNsRSxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztnQkFBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0RSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQXFCLElBQU8sRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUM7Z0JBQUMsc0JBQXNCLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO2dCQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7SUFDTCxDQUFDO0lBQ08seUNBQWtCLEdBQTFCO1FBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7UUFDdkYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBQ08sb0NBQWEsR0FBckI7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLDREQUFpQixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLDREQUFpQixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQ08sd0NBQWlCLEdBQXpCLFVBQTBCLElBQVksRUFBRSxNQUFhO1FBQ2pELElBQUksV0FBVyxHQUFHLElBQUksS0FBSyxFQUFzQixDQUFDO1FBQ2xELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3JDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLFVBQVUsR0FBdUIsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQzdJLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQzs7QUE3aUJpQixpQ0FBb0IsR0FBVyxnQ0FBZ0MsQ0FBQztBQStpQmxGLHdEQUFhLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztBQUNwQyxJQUFJLG9FQUF5QixFQUFFLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLElBQUksb0VBQXlCLEVBQUUsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFOUUsd0RBQWEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUc7SUFDcEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztJQUNsQyxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSx1REFBWSxFQUFxRCxDQUFDO0lBQ3ZHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSx1REFBWSxFQUFxRCxDQUFDO0lBQzVGLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSx1REFBWSxFQUFxRCxDQUFDO0lBQzVGLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHVEQUFZLEVBQXFELENBQUM7SUFDaEcsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksdURBQVksRUFBcUQsQ0FBQztJQUNuRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGNBQWMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekUsSUFBSSxDQUFDLHFCQUFxQixHQUFHLGNBQWMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRixJQUFJLENBQUMsd0JBQXdCLEdBQUcsY0FBYyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsb0RBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxDQUFDLENBQUM7QUFDRix3REFBYSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFVBQVMsS0FBMEI7SUFDaEYsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUFDLE1BQU0sQ0FBQztJQUNoRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUM7SUFDMUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUNuQyxFQUFFLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuQixRQUFRLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMscUJBQXFCLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO0lBQzlELENBQUM7SUFDRCxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2pILENBQUMsQ0FBQztBQUNGLHdEQUFhLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsVUFBVSxLQUFhO0lBQ25FLE1BQU0sQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDO0FBRUYsc0RBQVcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUc7SUFDbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFDMUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLG9EQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLElBQUksUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ25HLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0QsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM3SCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixLQUFLLENBQUMsQ0FBQztRQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakgsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JELENBQUMsQ0FBQztBQUNGLHNEQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUN6QyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDakQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNqQixjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7QUFDTCxDQUFDLENBQUM7QUFDRixzREFBVyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxVQUFTLENBQUM7SUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFBQyxNQUFNLENBQUM7SUFDL0QsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2pELEVBQUUsQ0FBQyxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkIsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUNGLHNEQUFXLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUM5QyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDakQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNqQixjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRiw4REFBbUIsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUc7SUFDMUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7SUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxvREFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxvREFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLElBQUksQ0FBQyxjQUFjLEdBQUc7UUFDbEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUNwQyxDQUFDLENBQUM7SUFDRixJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RixJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxJQUFJLENBQUMsWUFBWSxHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekMsSUFBSSxDQUFDLFNBQVMsR0FBRztRQUNiLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsOERBQW1CLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLEdBQUc7SUFDekQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7UUFBQyxNQUFNLENBQUM7SUFDOUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7QUFDbEUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMXFCNkI7QUFDaUM7QUFDRjtBQUNZO0FBQ2hDO0FBRTFDO0lBQXlELHNHQUF5QjtJQUM5RTtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUNELHNCQUFXLDJEQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzVELHNEQUFRLEdBQWY7UUFDSSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDN0MsTUFBTSxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDcEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUNTLGlFQUFtQixHQUE3QixjQUF1QyxNQUFNLENBQUMsSUFBSSx1Q0FBdUMsQ0FBQyxJQUFJLHFFQUEyQixDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckksOERBQWdCLEdBQTFCLFVBQTJCLElBQVMsSUFBSSxNQUFNLENBQUMsSUFBSSx1Q0FBdUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RyxzRUFBd0IsR0FBbEMsVUFBbUMsVUFBZTtRQUM5QyxJQUFJLFNBQVMsR0FBNEMsVUFBVSxDQUFDO1FBQ3BFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUM1QixDQUFDO0lBQ0wsMENBQUM7QUFBRCxDQUFDLENBbkJ3RCx1RkFBeUIsR0FtQmpGOztBQUVEO0lBU0ksaURBQW1CLE1BQW1DLEVBQVMsT0FBYztRQUFkLHdDQUFjO1FBQTFELFdBQU0sR0FBTixNQUFNLENBQTZCO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBTztRQUN6RSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsTUFBTSxHQUFHLG9EQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEdBQUcsb0RBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsWUFBWSxHQUFHLG9EQUFhLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksQ0FBQyxPQUFPLEdBQUcsb0RBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvRSxJQUFJLENBQUMsYUFBYSxHQUFHLG9EQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyx5REFBa0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxpR0FBOEIsRUFBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFFMUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxjQUFjLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLFlBQVksR0FBRyxrREFBVyxDQUFDLGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakssSUFBSSxDQUFDLGFBQWEsR0FBRyxrREFBVyxDQUFDLGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25JLENBQUM7SUFDTSwwREFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBQ00sdURBQUssR0FBWjtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXpDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDbkQsQ0FBQztJQUNPLG9FQUFrQixHQUExQixVQUEyQixXQUFtQjtRQUMxQyxJQUFJLFVBQVUsR0FBRywyREFBaUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDbEYsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDekMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUM7Z0JBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDeEUsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBQ0wsOENBQUM7QUFBRCxDQUFDOztBQUVELHFGQUF3QixDQUFDLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSxtQ0FBbUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25GL0g7QUFDaUM7QUFDRjtBQUNMO0FBQ2Y7QUFFMUM7SUFBb0QsaUdBQXlCO0lBS3pFO1FBQUEsWUFDSSxpQkFBTyxTQVdWO1FBVkcsS0FBSSxDQUFDLEtBQUssR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDN0IsS0FBSSxDQUFDLE1BQU0sR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDOUIsS0FBSSxDQUFDLFdBQVcsR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDbkMsS0FBSSxDQUFDLFdBQVcsR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDbkMsS0FBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksSUFBSSxHQUFHLEtBQUksQ0FBQztRQUNoQixLQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZHLEtBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFVBQVUsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqSCxLQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBQ3JILENBQUM7SUFDRCxzQkFBVyxzREFBVTthQUFyQixjQUFrQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDdEQsc0JBQVcseURBQWE7YUFBeEIsY0FBNkIsTUFBTSxDQUF5QixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDbEUscURBQVksR0FBbkIsVUFBb0IsS0FBVTtRQUMxQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsK0VBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDcEIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDcEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ1MsdURBQWMsR0FBeEI7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBQ1Msc0RBQWEsR0FBdkI7UUFDSSxJQUFJLEdBQUcsR0FBRyxJQUFJLGdFQUFzQixFQUFFLENBQUM7UUFDdkMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ08sNENBQUcsR0FBWDtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFDTyxxREFBWSxHQUFwQjtRQUNJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx1REFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7UUFDeEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBNEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsK0VBQWtCLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBQ3BFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFDTCxxQ0FBQztBQUFELENBQUMsQ0F6RG1ELHVGQUF5QixHQXlENUU7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSw4QkFBOEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pFNUU7QUFDRjtBQUNqQjtBQUNZO0FBQ2lCO0FBQ2hDO0FBRTFDO0lBQW1ELGdHQUF5QjtJQUN4RTtlQUNJLGlCQUFPO0lBQ1gsQ0FBQztJQUNELHNCQUFXLHFEQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3QywyREFBbUIsR0FBN0I7UUFDSSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFDRCxJQUFJLFFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLG1FQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztRQUMxRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUNTLHdEQUFnQixHQUExQixVQUEyQixJQUFTO1FBQ2hDLElBQUksUUFBUSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3hGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUNTLGdFQUF3QixHQUFsQyxVQUFtQyxVQUFlO1FBQzlDLElBQUksUUFBUSxHQUFHLElBQUksaUVBQXVCLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztRQUM1QyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFDTyw4REFBc0IsR0FBOUIsVUFBK0IsSUFBUyxFQUFFLFVBQXNCO1FBQzVELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLGFBQWEsR0FBRyxVQUFVLFFBQWEsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6SCxJQUFJLGNBQWMsR0FBRyxJQUFJLGlHQUE4QixFQUFFLENBQUM7UUFDMUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7UUFDN0IsY0FBYyxDQUFDLFNBQVMsR0FBRyxVQUFDLFFBQWEsSUFBTyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0UsY0FBYyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDN0IsY0FBYyxDQUFDLEtBQUssQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQzlGLGNBQWMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN2QyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBQ08sK0NBQU8sR0FBZixVQUFnQixNQUFjO1FBQzFCLE1BQU0sQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNMLG9DQUFDO0FBQUQsQ0FBQyxDQXhDa0QsdUZBQXlCLEdBd0MzRTs7QUFFRCxxRkFBd0IsQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLGNBQXdDLE1BQU0sQ0FBQyxJQUFJLDZCQUE2QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pEN0c7QUFDaUM7QUFDRjtBQUNMO0FBQ2Y7QUFFMUM7SUFBa0QsK0ZBQXlCO0lBS3ZFO1FBQUEsWUFDSSxpQkFBTyxTQVNWO1FBWk0sdUJBQWlCLEdBQWtCLEVBQUUsQ0FBQztRQUNyQyxvQkFBYyxHQUFvQyxFQUFFLENBQUM7UUFHekQsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1FBQ2hCLEtBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RSxLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsS0FBSSxDQUFDLFVBQVUsR0FBRyxvREFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLEtBQUksQ0FBQyxPQUFPLEdBQUcseURBQWtCLEVBQUUsQ0FBQztRQUNwQyxLQUFJLENBQUMsV0FBVyxHQUFHLHlEQUFrQixFQUFFLENBQUM7UUFDeEMsS0FBSSxDQUFDLGNBQWMsR0FBRywyREFBaUIsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNGLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7SUFDekQsQ0FBQztJQUNELHNCQUFXLG9EQUFVO2FBQXJCLGNBQWtDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM1QyxxREFBYyxHQUF4QjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFpQixJQUFJLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFpQixJQUFJLENBQUMsTUFBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRixDQUFDO1FBQ0QsaUJBQU0sY0FBYyxXQUFFLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDMUUsQ0FBQztJQUNMLENBQUM7SUFFTyw4Q0FBTyxHQUFmLFVBQWdCLFdBQW1CO1FBQy9CLElBQUksT0FBTyxHQUFHLDJEQUFpQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEUsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUNTLHVEQUFnQixHQUExQixVQUEyQixJQUFTO1FBQ2hDLElBQUksT0FBTyxHQUFHLElBQUksMkRBQWlCLEVBQUUsQ0FBQztRQUN0QyxJQUFJLE9BQU8sR0FBRywyREFBaUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQXVCLE9BQU8sQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFDUywrREFBd0IsR0FBbEMsVUFBbUMsVUFBZTtRQUM5QyxJQUFJLGFBQWEsR0FBMEIsVUFBVSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUNPLDJEQUFvQixHQUE1QjtRQUNJLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFDTywrQ0FBUSxHQUFoQixVQUFpQixLQUFpQjtRQUM5QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNwQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBQ08sNERBQXFCLEdBQTdCLFVBQThCLE9BQTZCO1FBQ3ZELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztRQUN2QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLFdBQVcsR0FBRyxJQUFJLDRCQUE0QixDQUE4QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekgsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDekMsV0FBVyxHQUFHLElBQUksNkJBQTZCLENBQStCLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0csQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNmLFdBQVcsR0FBRyxJQUFJLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFDTCxtQ0FBQztBQUFELENBQUMsQ0ExRWlELHVGQUF5QixHQTBFMUU7O0FBQ0Q7SUFPSSwrQkFBbUIsT0FBNkI7UUFBN0IsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7UUFOeEMsY0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUU5SSx1QkFBa0IsR0FBRyxFQUFFLENBQUM7UUFLcEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsb0RBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxvREFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsVUFBVSxHQUFHLG9EQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLEdBQUcsb0RBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsa0RBQVcsQ0FBQyxjQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNySCxJQUFJLENBQUMsU0FBUyxHQUFHLGtEQUFXLENBQUMsY0FBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEksSUFBSSxDQUFDLE1BQU0sR0FBRyxrREFBVyxDQUFDLGNBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFDTSw2Q0FBYSxHQUFwQjtRQUNJLElBQUksT0FBTyxHQUF5QiwyREFBaUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM3RixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTywrQ0FBZSxHQUF2QjtRQUNJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSwrRUFBa0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDO0lBQ0wsQ0FBQztJQUNPLHVDQUFPLEdBQWY7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvRSxNQUFNLENBQUMsK0VBQWtCLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN4SSxDQUFDO0lBQ08sK0NBQWUsR0FBdkI7UUFDSSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDdEYsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBQ08sNENBQVksR0FBcEI7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDdEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUNMLDRCQUFDO0FBQUQsQ0FBQzs7QUFFRDtJQUFrRCwrRkFBcUI7SUFHbkUsc0NBQW1CLE9BQW9DLEVBQUUsT0FBWSxFQUFFLFdBQWdCO1FBQXZGLFlBQ0ksa0JBQU0sT0FBTyxDQUFDLFNBR2pCO1FBSmtCLGFBQU8sR0FBUCxPQUFPLENBQTZCO1FBRW5ELEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw0QkFBNEIsQ0FBQywrRUFBa0IsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEksS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDRCQUE0QixDQUFDLCtFQUFrQixDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7SUFDeEosQ0FBQztJQUNNLG9EQUFhLEdBQXBCO1FBQ0ksSUFBSSxPQUFPLEdBQWdDLGlCQUFNLGFBQWEsV0FBRSxDQUFDO1FBQ2pFLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDL0MsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBQ0wsbUNBQUM7QUFBRCxDQUFDLENBZGlELHFCQUFxQixHQWN0RTs7QUFFRDtJQUFtRCxnR0FBcUI7SUFFcEUsdUNBQW1CLE9BQXFDLEVBQUUsV0FBZ0I7UUFBMUUsWUFDSSxrQkFBTSxPQUFPLENBQUMsU0FLakI7UUFOa0IsYUFBTyxHQUFQLE9BQU8sQ0FBOEI7UUFFcEQsS0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxvREFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwRCxLQUFJLENBQUMsVUFBVSxHQUFHLG9EQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELEtBQUksQ0FBQyxZQUFZLEdBQUcsb0RBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7O0lBQzFELENBQUM7SUFDTSxxREFBYSxHQUFwQjtRQUNJLElBQUksT0FBTyxHQUFpQyxpQkFBTSxhQUFhLFdBQUUsQ0FBQztRQUNsRSxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QyxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN6QyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxvQ0FBQztBQUFELENBQUMsQ0FoQmtELHFCQUFxQixHQWdCdkU7O0FBQ0Q7SUFPSSxzQ0FBbUIsS0FBYSxFQUFFLFVBQXlCLEVBQUUsY0FBNkI7UUFBdkUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLHlEQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3pDLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLHlEQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsb0RBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxvREFBYSxFQUFFLENBQUM7UUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNPLGlEQUFVLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQ08sOENBQU8sR0FBZjtRQUNJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDTyxrREFBVyxHQUFuQixVQUFvQixJQUFZLEVBQUUsV0FBZ0IsRUFBRSxLQUFVO1FBQzFELFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFDTCxtQ0FBQztBQUFELENBQUM7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxjQUF3QyxNQUFNLENBQUMsSUFBSSw0QkFBNEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN4TWxCO0FBR3hIO0lBQWlELDhGQUF3QjtJQUNyRSxxQ0FBbUIsWUFBaUMsRUFBRSx5QkFBd0Y7UUFBOUksWUFDSSxrQkFBTSxZQUFZLEVBQUUseUJBQXlCLENBQUMsU0FDakQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCOztJQUVwRCxDQUFDO0lBQ1Msc0RBQWdCLEdBQTFCLGNBQStELE1BQU0sQ0FBQyxJQUFJLG1DQUFtQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0osa0NBQUM7QUFBRCxDQUFDLENBTGdELHFGQUF3QixHQUt4RTs7QUFFRDtJQUF5RCxzR0FBOEI7SUFLbkYsNkNBQW1CLFlBQWlDLEVBQVMsWUFBb0IsRUFBRSxVQUFvQztRQUF2SCxZQUNJLGtCQUFNLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFNBQ2hEO1FBRmtCLGtCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUFTLGtCQUFZLEdBQVosWUFBWSxDQUFROztJQUVqRixDQUFDO0lBQ1MsNkRBQWUsR0FBekI7UUFDSSxpQkFBTSxlQUFlLFdBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQztRQUMzRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN6RSxNQUFNO1FBQ04sSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUNELHNCQUFXLHNFQUFxQjthQUFoQyxjQUE4QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDNUQsc0JBQVcsdUVBQXNCO2FBQWpDLGNBQThDLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzVFLG1EQUFLLEdBQVo7UUFDSSxpQkFBTSxLQUFLLFdBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7WUFBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNNLG1EQUFLLEdBQVo7UUFDSSxpQkFBTSxLQUFLLFdBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7Z0JBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO2dCQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3JGLENBQUM7SUFDTCwwQ0FBQztBQUFELENBQUMsQ0FsQ3dELDJGQUE4QixHQWtDdEY7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLDJCQUEyQixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM5QzdLO0FBR3JIO0lBQThDLDJGQUF3QjtJQUNsRSxrQ0FBbUIsWUFBaUMsRUFBRSx5QkFBd0Y7UUFBOUksWUFDSSxrQkFBTSxZQUFZLEVBQUUseUJBQXlCLENBQUMsU0FDakQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCOztJQUVwRCxDQUFDO0lBQ1MsMENBQU8sR0FBakIsVUFBa0IsSUFBd0M7UUFDdEQsaUJBQU0sT0FBTyxZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBQ0wsK0JBQUM7QUFBRCxDQUFDLENBUjZDLHFGQUF3QixHQVFyRTs7QUFFRDtJQUF3RCxxR0FBMkI7SUFRL0UsNENBQW1CLFlBQWlDLEVBQVMsWUFBb0IsRUFBRSxVQUFvQztRQUF2SCxZQUNJLGtCQUFNLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFNBR2hEO1FBSmtCLGtCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUFTLGtCQUFZLEdBQVosWUFBWSxDQUFRO1FBRTdFLEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixLQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0lBQ2pCLENBQUM7SUFDRCxzQkFBVyxvREFBSTthQUFmLGNBQTRCLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN6Qyw0REFBZSxHQUF6QjtRQUNJLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNqRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNqRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN6RSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUN2RSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFDTSxrREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDOUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQzFGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNsRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDOUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFDTSxrREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDakYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdGLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDakYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2xGLENBQUM7SUFDTCx5Q0FBQztBQUFELENBQUMsQ0ExQ3VELHdGQUEyQixHQTBDbEY7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQ3pEOU47QUFHOUQ7SUFBOEMsMkZBQXdCO0lBQ2xFLGtDQUFtQixZQUFpQyxFQUFFLHlCQUF3RjtRQUE5SSxZQUNJLGtCQUFNLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxTQUNqRDtRQUZrQixrQkFBWSxHQUFaLFlBQVksQ0FBcUI7O0lBRXBELENBQUM7SUFDUyxvREFBaUIsR0FBM0IsVUFBNEIsUUFBb0I7UUFDNUMsaUJBQU0saUJBQWlCLFlBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVMLCtCQUFDO0FBQUQsQ0FBQyxDQVQ2QyxxRkFBd0IsR0FTckU7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDZHBLO0FBQ1E7QUFJaEk7SUFBdUQsb0dBQWtDO0lBQ3JGLDJDQUFtQixZQUFpQyxFQUFFLHlCQUF3RjtRQUE5SSxZQUNJLGtCQUFNLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxTQUNqRDtRQUZrQixrQkFBWSxHQUFaLFlBQVksQ0FBcUI7O0lBRXBELENBQUM7SUFDUyw0REFBZ0IsR0FBMUIsY0FBK0QsTUFBTSxDQUFDLElBQUksMkNBQTJDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuSyx3Q0FBQztBQUFELENBQUMsQ0FMc0QseUdBQWtDLEdBS3hGOztBQUVEO0lBQWlFLDhHQUE0QztJQU16RyxxREFBbUIsWUFBaUMsRUFBUyxZQUFvQixFQUFFLFVBQW9DO1FBQXZILFlBQ0ksa0JBQU0sWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsU0FDaEQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCO1FBQVMsa0JBQVksR0FBWixZQUFZLENBQVE7O0lBRWpGLENBQUM7SUFDUyxxRUFBZSxHQUF6QjtRQUNJLGlCQUFNLGVBQWUsV0FBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ25FLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUM7UUFFN0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDM0MsQ0FBQztJQUNELHNCQUFXLCtFQUFzQjthQUFqQyxjQUE4QyxNQUFNLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNsRiwyREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQzNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDTSwyREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDeEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzlFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNGLENBQUM7SUFDTCxrREFBQztBQUFELENBQUMsQ0FoQ2dFLG1IQUE0QyxHQWdDNUc7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLGVBQWUsRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLGlDQUFpQyxDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQzlDaFA7QUFHOUQ7SUFBZ0QsNkZBQXdCO0lBQ3BFLG9DQUFtQixZQUFpQyxFQUFFLHlCQUF3RjtRQUE5SSxZQUNJLGtCQUFNLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxTQUNqRDtRQUZrQixrQkFBWSxHQUFaLFlBQVksQ0FBcUI7O0lBRXBELENBQUM7SUFDUyxzREFBaUIsR0FBM0IsVUFBNEIsUUFBb0I7UUFDNUMsaUJBQU0saUJBQWlCLFlBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVMLGlDQUFDO0FBQUQsQ0FBQyxDQVQrQyxxRkFBd0IsR0FTdkU7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLDBCQUEwQixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDZHhLO0FBQy9EO0FBR3pEO0lBQXNELG1HQUF3QjtJQUMxRSwwQ0FBbUIsWUFBaUMsRUFBRSx5QkFBd0Y7UUFBOUksWUFDSSxrQkFBTSxZQUFZLEVBQUUseUJBQXlCLENBQUMsU0FDakQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCOztJQUVwRCxDQUFDO0lBQ1MsNERBQWlCLEdBQTNCLFVBQTRCLFFBQW9CO1FBQzVDLGlCQUFNLGlCQUFpQixZQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLCtFQUFrQixDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1SCxDQUFDO0lBQ1MsMkRBQWdCLEdBQTFCLGNBQStELE1BQU0sQ0FBQyxJQUFJLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEssdUNBQUM7QUFBRCxDQUFDLENBVHFELHFGQUF3QixHQVM3RTs7QUFFRDtJQUFnRSw2R0FBOEI7SUFLMUYsb0RBQW1CLFlBQWlDLEVBQVMsWUFBb0IsRUFBRSxVQUFvQztRQUF2SCxZQUNJLGtCQUFNLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLFNBQ2hEO1FBRmtCLGtCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUFTLGtCQUFZLEdBQVosWUFBWSxDQUFROztJQUVqRixDQUFDO0lBQ1Msb0VBQWUsR0FBekI7UUFDSSxpQkFBTSxlQUFlLFdBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDO1FBQ2pELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUNELHNCQUFXLDZFQUFxQjthQUFoQyxjQUE4QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDNUQsc0JBQVcsOEVBQXNCO2FBQWpDLGNBQThDLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ2pGLDBEQUFLLEdBQVo7UUFDSSxpQkFBTSxLQUFLLFdBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7WUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBQ00sMERBQUssR0FBWjtRQUNJLGlCQUFNLEtBQUssV0FBRSxDQUFDO1FBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzVFLENBQUM7SUFDTCxpREFBQztBQUFELENBQUMsQ0E1QitELDJGQUE4QixHQTRCN0Y7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLGNBQWMsRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLGdDQUFnQyxDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUM3Q3BMO0FBSXhIO0lBQWdELDZGQUF3QjtJQUNwRSxvQ0FBbUIsWUFBaUMsRUFBRSx5QkFBd0Y7UUFBOUksWUFDSSxrQkFBTSxZQUFZLEVBQUUseUJBQXlCLENBQUMsU0FDakQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCOztJQUVwRCxDQUFDO0lBQ1Msc0RBQWlCLEdBQTNCLFVBQTRCLFFBQW9CO1FBQzVDLGlCQUFNLGlCQUFpQixZQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFUyxxREFBZ0IsR0FBMUIsY0FBK0QsTUFBTSxDQUFDLElBQUksb0NBQW9DLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1SixpQ0FBQztBQUFELENBQUMsQ0FWK0MscUZBQXdCLEdBVXZFOztBQUVEO0lBQTBELHVHQUE4QjtJQUtwRiw4Q0FBbUIsWUFBaUMsRUFBUyxZQUFvQixFQUFFLFVBQW9DO1FBQXZILFlBQ0ksa0JBQU0sWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsU0FDaEQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCO1FBQVMsa0JBQVksR0FBWixZQUFZLENBQVE7O0lBRWpGLENBQUM7SUFDUyw4REFBZSxHQUF6QjtRQUNJLGlCQUFNLGVBQWUsV0FBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLElBQUksQ0FBQztRQUMvRixJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDL0YsSUFBSSxDQUFDLHdCQUF3QixHQUFHLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyRCxJQUFJLENBQUMsd0JBQXdCLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BELENBQUM7SUFDRCxzQkFBVyx1RUFBcUI7YUFBaEMsY0FBOEMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzVELHNCQUFXLHdFQUFzQjthQUFqQyxjQUE4QyxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMzRSxvREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUM7WUFBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7UUFDL0csRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDO1lBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0lBQ25ILENBQUM7SUFDTSxvREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUM7WUFBQyxJQUFJLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDbEgsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0lBQ3RILENBQUM7SUFDTCwyQ0FBQztBQUFELENBQUMsQ0EzQnlELDJGQUE4QixHQTJCdkY7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLDBCQUEwQixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQzdDbE87QUFHOUQ7SUFBb0QsaUdBQXdCO0lBQ3hFLHdDQUFtQixZQUFpQyxFQUFFLHlCQUF3RjtRQUE5SSxZQUNJLGtCQUFNLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxTQUNqRDtRQUZrQixrQkFBWSxHQUFaLFlBQVksQ0FBcUI7O0lBRXBELENBQUM7SUFDUywwREFBaUIsR0FBM0IsVUFBNEIsUUFBb0I7UUFDNUMsaUJBQU0saUJBQWlCLFlBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0QsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFdEUsQ0FBQztJQUNMLHFDQUFDO0FBQUQsQ0FBQyxDQVZtRCxxRkFBd0IsR0FVM0U7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLDhCQUE4QixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNmaEw7QUFHeEg7SUFBOEMsMkZBQXdCO0lBQ2xFLGtDQUFtQixZQUFpQyxFQUFFLHlCQUF3RjtRQUE5SSxZQUNJLGtCQUFNLFlBQVksRUFBRSx5QkFBeUIsQ0FBQyxTQUNqRDtRQUZrQixrQkFBWSxHQUFaLFlBQVksQ0FBcUI7O0lBRXBELENBQUM7SUFDUyxtREFBZ0IsR0FBMUIsY0FBK0QsTUFBTSxDQUFDLElBQUksa0NBQWtDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxSiwrQkFBQztBQUFELENBQUMsQ0FMNkMscUZBQXdCLEdBS3JFOztBQUVEO0lBQXdELHFHQUE4QjtJQU1sRiw0Q0FBbUIsWUFBaUMsRUFBUyxZQUFvQixFQUFFLFVBQW9DO1FBQXZILFlBQ0ksa0JBQU0sWUFBWSxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsU0FDaEQ7UUFGa0Isa0JBQVksR0FBWixZQUFZLENBQXFCO1FBQVMsa0JBQVksR0FBWixZQUFZLENBQVE7O0lBRWpGLENBQUM7SUFDUyw0REFBZSxHQUF6QjtRQUNJLGlCQUFNLGVBQWUsV0FBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUM7UUFDbkQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUM7UUFDekUsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFDRCxzQkFBVyxxRUFBcUI7YUFBaEMsY0FBOEMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzVELHNCQUFXLHNFQUFzQjthQUFqQyxjQUE4QyxNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN6RSxrREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDeEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFDTSxrREFBSyxHQUFaO1FBQ0ksaUJBQU0sS0FBSyxXQUFFLENBQUM7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDM0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3JGLENBQUM7SUFDTCx5Q0FBQztBQUFELENBQUMsQ0FqQ3VELDJGQUE4QixHQWlDckY7O0FBRUQscUZBQXdCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLFFBQTZCLEVBQUUseUJBQXdGLElBQThCLE1BQU0sQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7QUM3QzVSLDRKQUE0SixtQ0FBbUMseUtBQXlLLGlDQUFpQyx5S0FBeUssK0JBQStCLDBLQUEwSyxnQ0FBZ0MsaXZDQUFpdkMsNEJBQTRCLHFLQUFxSywrQkFBK0IsMm5FQUEybkUsNkpBQTZKLFlBQVksaUZBQWlGLDRCQUE0QixvQ0FBb0MsY0FBYyw0QkFBNEIsbUJBQW1CLEdBQUcscWFBQXFhLFlBQVksOEZBQThGLDRCQUE0QiwwQ0FBMEMsY0FBYyw0QkFBNEIsbUJBQW1CLEdBQUcsbWJBQW1iLHdDQUF3QyxteEJBQW14Qiw4Q0FBOEMsc0tBQXNLLG1EQUFtRCwwSkFBMEoseUNBQXlDLDRMQUE0TCx1Q0FBdUMseUhBQXlILHlCQUF5Qix1YkFBdWIsK0NBQStDLDZFQUE2RSxxREFBcUQscUI7Ozs7OztBQ0EzZ1EsbWU7Ozs7OztBQ0FBLDBQQUEwUCw4Q0FBOEMsaUVBQWlFLGFBQWEsd05BQXdOLGNBQWMsa0NBQWtDLG1CQUFtQixnTkFBZ04sb0RBQW9ELDJLOzs7Ozs7QUNBcjVCLDJkOzs7Ozs7QUNBQSxvTUFBb00scUJBQXFCLFFBQVEsdUNBQXVDLHdCQUF3QixFQUFFLDBDQUEwQyx1QkFBdUIsYUFBYSxFQUFFLHlDQUF5Qyx1QkFBdUIsd0NBQXdDLG9CQUFvQixxQ0FBcUMsdUJBQXVCLGNBQWMsbWE7Ozs7OztBQ0F4akIsbUw7Ozs7OztBQ0FBLHVROzs7Ozs7QUNBQSx5R0FBeUcsNENBQTRDLG1aOzs7Ozs7QUNBckosbUdBQW1HLDRDQUE0Qyw4UDs7Ozs7O0FDQS9JLHlHQUF5Ryw0Q0FBNEMscU5BQXFOLGdGQUFnRiwwSUFBMEksZ0ZBQWdGLHNMQUFzTCxtQkFBbUIsa0JBQWtCLDg2RUFBODZFLG1CQUFtQixrQkFBa0Isa0JBQWtCLDBEOzs7Ozs7QUNBcDFHLGtIQUFrSCw0Q0FBNEMsbXpCQUFtekIsb0ZBQW9GLGtnRUFBa2dFLGdFQUFnRSwycEI7Ozs7OztBQ0F2bUcsNk1BQTZNLGdDQUFnQyx1TEFBdUwsc0JBQXNCLGdDQUFnQyx3V0FBd1csd0pBQXdKLGNBQWMsNkNBQTZDLGdDQUFnQyx5TEFBeUwsZUFBZSwyUUFBMlEsNk9BQTZPLDREQUE0RCxveEI7Ozs7OztBQ0FqekQsbU07Ozs7OztBQ0FBLHFHQUFxRyw0Q0FBNEMseStCQUF5K0Isb0M7Ozs7OztBQ0ExbkMsaU07Ozs7OztBQ0FBLG1HQUFtRyw0Q0FBNEMsOFA7Ozs7OztBQ0EvSSxzR0FBc0csNENBQTRDLHdyQzs7Ozs7O0FDQWxKLHFHQUFxRyw0Q0FBNEMsa3JHQUFrckcsb0RBQW9ELDBKQUEwSix3REFBd0QsNjNEOzs7Ozs7QUNBemtILDRvQzs7Ozs7O0FDQUEsdUdBQXVHLDRDQUE0Qyw0b0NBQTRvQyxtREFBbUQsOEI7Ozs7OztBQ0FsMUMscVpBQXFaLHNWQUFzViw0Q0FBNEMsMlRBQTJULHVEQUF1RCxzMEI7Ozs7OztBQ0F6b0MsdWdCOzs7Ozs7QUNBQSwrc0M7Ozs7OztBQ0FBLHFyQ0FBcXJDLGtEQUFrRCxtRjs7Ozs7O0FDQXZ1QyxnVzs7Ozs7O0FDQUEsaWdDOzs7Ozs7QUNBQSw4Vjs7Ozs7O0FDQUEsd2tCOzs7Ozs7QUNBQSxxaUI7Ozs7OztBQ0FBLDBwREFBMHBELHFJQUFxSSxzVUFBc1UscUlBQXFJLHdTQUF3UyxzSUFBc0kscUQ7Ozs7OztBQ0F4cEYsMENBQTBDLHVDQUF1QyxlQUFlLHdDQUF3QyxlQUFlLHVDQUF1QyxlQUFlLG1DQUFtQyxlQUFlLDJLQUEySyx1QkFBdUIscUlBQXFJLHVFQUF1RSx5R0FBeUcsMEhBQTBILG1CQUFtQixFQUFFLHVGQUF1Riw0REFBNEQsb0JBQW9CLEVBQUUsOFhBQThYLDBIQUEwSCxtQkFBbUIsRUFBRSxvS0FBb0ssMEhBQTBILG1CQUFtQixFQUFFLGdEOzs7Ozs7QUNBOTJELCtGQUErRixzTEFBc0wsZ0JBQWdCLHNDQUFzQyxpRUFBaUUsdUNBQXVDLG9EQUFvRCxhQUFhLEVBQUUsd0NBQXdDLGNBQWMsYUFBYSxFQUFFLHVDQUF1Qyx1Q0FBdUMsc0NBQXNDLGFBQWEsbUNBQW1DLGNBQWMsWUFBWSxPQUFPLDJHQUEyRywrQkFBK0IsaUNBQWlDLFNBQVMsaURBQWlELGdrQkFBZ2tCLGdFQUFnRSwrTEFBK0wsZ0NBQWdDLHVDQUF1QyxFQUFFLHEvQzs7Ozs7O0FDQTcyRCxnL0I7Ozs7Ozs7Ozs7O0FDQStCO0FBQ2U7QUFHOUM7SUFTSTtRQU5RLDRCQUF1QixHQUFZLEtBQUssQ0FBQztRQXFEekMsY0FBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBOUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLG9EQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyx5REFBa0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLFFBQVE7WUFDcEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ00sK0JBQUksR0FBWDtRQUNJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDckMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxxRUFBZ0IsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDcEYsQ0FBQztJQUNELHNCQUFXLDBDQUFZO2FBQXZCLGNBQXFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN6RSxzQkFBVyxrQ0FBSTthQUFmO1lBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDckMsQ0FBQzthQUNELFVBQWdCLEtBQWE7WUFDekIsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztZQUNwQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLENBQUM7WUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUM7UUFDekMsQ0FBQzs7O09BVkE7SUFXTSwrQkFBSSxHQUFYLFVBQVksS0FBYTtRQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzNCLENBQUM7SUFDTCxDQUFDO0lBQ0Qsc0JBQVcsMkNBQWE7YUFBeEI7WUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUkscUVBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUN6QyxDQUFDOzs7T0FBQTtJQUNELHNCQUFXLG9DQUFNO2FBQWpCLGNBQXFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRTdELDhDQUFtQixHQUEzQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDTCxDQUFDO0lBQ08sc0NBQVcsR0FBbkIsVUFBb0IsSUFBWTtRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUkscUVBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDckcsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDTCxDQUFDO0lBQ08sNENBQWlCLEdBQXpCLFVBQTBCLElBQVksRUFBRSxNQUFhO1FBQ2pELElBQUksV0FBVyxHQUFHLElBQUksS0FBSyxFQUFzQixDQUFDO1FBQ2xELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ3JDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLFVBQVUsR0FBdUIsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQzdJLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLHVCQUFDO0FBQUQsQ0FBQzs7QUF2RmlCLGtDQUFpQixHQUFXLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7OztBQ0xwQjtBQUNzQjtBQUdyRDtJQUFBO0lBR0EsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQzs7QUFFRDtJQUlJLHVCQUFtQixTQUFjLEVBQVMsVUFBZTtRQUF0QyxjQUFTLEdBQVQsU0FBUyxDQUFLO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBSztJQUN6RCxDQUFDO0lBQ0Qsc0JBQVcsaUNBQU07YUFBakIsY0FBcUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQy9ELFVBQWtCLEtBQW9CO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO2dCQUFDLE1BQU0sQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkIsQ0FBQzs7O09BTDhEO0lBTXhELCtCQUFPLEdBQWQsVUFBZSxJQUFpQjtRQUM1QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUM1QyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3ZDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO1FBQzNCLENBQUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5QixLQUFLLEVBQUUsQ0FBQztRQUNSLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNNLG1DQUFXLEdBQWxCLFVBQW1CLElBQWlCLEVBQUUsUUFBNkI7UUFDL0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6RCxLQUFLLElBQUksYUFBYSxDQUFDO1FBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ00sb0NBQVksR0FBbkIsVUFBb0IsR0FBZ0I7UUFDaEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0lBQ00sb0NBQVksR0FBbkIsVUFBb0IsR0FBZ0I7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxtRUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSw4REFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxJQUFJLEdBQTZCLEdBQUcsQ0FBQztZQUN6QyxhQUFhLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDM0MsQ0FBQztRQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ00sbUNBQVcsR0FBbEIsVUFBbUIsR0FBZ0I7UUFDL0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFDTSwwQ0FBa0IsR0FBekIsVUFBMEIsSUFBYTtRQUNuQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMxQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ25DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM1QixJQUFJLFlBQVksR0FBRyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksbUVBQVksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLDhEQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN6RyxTQUFTLEdBQUcsWUFBWSxDQUFDO1FBQzdCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFlBQVksR0FBRyxTQUFTLENBQUM7WUFDekIsT0FBTyxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxtRUFBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksOERBQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDNUcsU0FBUyxHQUFHLFlBQVksQ0FBQztnQkFDekIsWUFBWSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLENBQUM7UUFDTCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBQ08sMkNBQW1CLEdBQTNCO1FBQ0ksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3BDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxtRUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSw4REFBTyxDQUFDLFFBQVEsR0FBd0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFFbkcsQ0FBQztJQUNPLCtCQUFPLEdBQWYsVUFBZ0IsSUFBc0IsRUFBRSxLQUFhO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFDLENBQUM7SUFDTCxDQUFDO0lBQ08sK0JBQU8sR0FBZjtRQUNJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNoRCxJQUFJLElBQUksR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEQsQ0FBQztRQUNMLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFDTyxrQ0FBVSxHQUFsQixVQUFtQixJQUFpQjtRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFDTyxzQ0FBYyxHQUF0QixVQUF1QixRQUE2QjtRQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFDTyxrQ0FBVSxHQUFsQixVQUFtQixLQUFrQixFQUFFLElBQVk7UUFDL0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsb0RBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTyxvQ0FBWSxHQUFwQixVQUFxQixLQUFrQjtRQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDNUIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7Z0JBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztJQUNPLCtCQUFPLEdBQWYsVUFBZ0IsR0FBZ0I7UUFDNUIsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNsQyxFQUFFLENBQUMsQ0FBQyxtRUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSw4REFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEQsTUFBTSxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDbkMsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLEdBQUcsbUVBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQzs7QUF6SWlCLG9CQUFNLEdBQVcsS0FBSyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWekM7QUFBQSxTQUFTO0FBQ2E7QUFFMkI7QUFJRjtBQUMwQztBQUNSO0FBQ1U7QUFFekI7QUFDZTtBQUNRO0FBQ0Y7QUFDSTtBQUVBO0FBQ1o7QUFDZ0I7QUFDVjtBQUNOO0FBQ0k7QUFDZ0I7QUFDRjtBQUNkO0FBQ0o7QUFFeEI7QUFDSjtBQUNGO0FBQ0Y7QUFDTztBQUNPO0FBQ2tEO0FBQ3REO0FBQ2xCIiwiZmlsZSI6Ii4vcGFja2FnZS9zdXJ2ZXllZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJrbm9ja291dFwiKSwgcmVxdWlyZShcInN1cnZleS1rbm9ja291dFwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIlN1cnZleUVkaXRvclwiLCBbXCJrbm9ja291dFwiLCBcInN1cnZleS1rbm9ja291dFwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTdXJ2ZXlFZGl0b3JcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJrbm9ja291dFwiKSwgcmVxdWlyZShcInN1cnZleS1rbm9ja291dFwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiU3VydmV5RWRpdG9yXCJdID0gZmFjdG9yeShyb290W1wia29cIl0sIHJvb3RbXCJTdXJ2ZXlcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDcxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkY2ZkOWYzM2VjMTMzNmViMjFiZSIsImV4cG9ydCB2YXIgX19hc3NpZ24gPSBPYmplY3RbXCJhc3NpZ25cIl0gfHwgZnVuY3Rpb24gKHRhcmdldCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRhcmdldFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyh0aGlzQ2xhc3MsIGJhc2VDbGFzcykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBiYXNlQ2xhc3MpIGlmIChiYXNlQ2xhc3MuaGFzT3duUHJvcGVydHkocCkpIHRoaXNDbGFzc1twXSA9IGJhc2VDbGFzc1twXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gdGhpc0NsYXNzOyB9XHJcbiAgICB0aGlzQ2xhc3MucHJvdG90eXBlID0gYmFzZUNsYXNzID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiYXNlQ2xhc3MpIDogKF9fLnByb3RvdHlwZSA9IGJhc2VDbGFzcy5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZW50cmllcy9oZWxwZXJzLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJyb290XCI6XCJrb1wiLFwiY29tbW9uanMyXCI6XCJrbm9ja291dFwiLFwiY29tbW9uanNcIjpcImtub2Nrb3V0XCIsXCJhbWRcIjpcImtub2Nrb3V0XCJ9XG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wicm9vdFwiOlwiU3VydmV5XCIsXCJjb21tb25qczJcIjpcInN1cnZleS1rbm9ja291dFwiLFwiY29tbW9uanNcIjpcInN1cnZleS1rbm9ja291dFwiLFwiYW1kXCI6XCJzdXJ2ZXkta25vY2tvdXRcIn1cbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IHZhciBlZGl0b3JMb2NhbGl6YXRpb24gPSB7XHJcbiAgICBjdXJyZW50TG9jYWxlOiBcIlwiLFxyXG4gICAgbG9jYWxlczoge30sXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcsIGxvY2FsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIGlmICghbG9jYWxlKSBsb2NhbGUgPSB0aGlzLmN1cnJlbnRMb2NhbGU7XHJcbiAgICAgICAgdmFyIGxvYyA9IGxvY2FsZSA/IHRoaXMubG9jYWxlc1t0aGlzLmN1cnJlbnRMb2NhbGVdIDogZGVmYXVsdFN0cmluZ3M7XHJcbiAgICAgICAgaWYgKCFsb2MpIGxvYyA9IGRlZmF1bHRTdHJpbmdzO1xyXG4gICAgICAgIHZhciBwYXRoID0gc3RyTmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICAgIHZhciBvYmogPSBsb2M7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG9iaiA9IG9ialtwYXRoW2ldXTtcclxuICAgICAgICAgICAgaWYgKCFvYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChsb2MgPT09IGRlZmF1bHRTdHJpbmdzKSByZXR1cm4gcGF0aFtpXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFN0cmluZyhzdHJOYW1lLCBcImVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG4gICAgZ2V0UHJvcGVydHlOYW1lOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nLCBsb2NhbDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdldFByb3BlcnR5KHN0ck5hbWUsIGxvY2FsKTtcclxuICAgICAgICBpZiAob2JqW1wibmFtZVwiXSkgcmV0dXJuIG9ialtcIm5hbWVcIl07XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH0sXHJcbiAgICBnZXRQcm9wZXJ0eVRpdGxlOiBmdW5jdGlvbiAoc3RyTmFtZTogc3RyaW5nLCBsb2NhbDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmdldFByb3BlcnR5KHN0ck5hbWUsIGxvY2FsKTtcclxuICAgICAgICBpZiAob2JqW1widGl0bGVcIl0pIHJldHVybiBvYmpbXCJ0aXRsZVwiXTtcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIH0sXHJcbiAgICBnZXRQcm9wZXJ0eTogZnVuY3Rpb24gKHN0ck5hbWU6IHN0cmluZywgbG9jYWw6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICB2YXIgb2JqID0gdGhpcy5nZXRTdHJpbmcoXCJwLlwiICsgc3RyTmFtZSwgbG9jYWwpO1xyXG4gICAgICAgIGlmIChvYmogIT09IHN0ck5hbWUpIHJldHVybiBvYmo7XHJcbiAgICAgICAgdmFyIHBvcyA9IHN0ck5hbWUuaW5kZXhPZignXycpO1xyXG4gICAgICAgIGlmIChwb3MgPCAtMSkgcmV0dXJuIG9iajtcclxuICAgICAgICBzdHJOYW1lID0gc3RyTmFtZS5zdWJzdHIocG9zICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RyaW5nKFwicC5cIiArIHN0ck5hbWUsIGxvY2FsKTtcclxuICAgIH0sXHJcbiAgICBnZXRMb2NhbGVzOiBmdW5jdGlvbiAoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgIHJlcy5wdXNoKFwiXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxvY2FsZXMpIHtcclxuICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB2YXIgZGVmYXVsdFN0cmluZ3MgPSB7XHJcbiAgICAvL3N1cnZleSB0ZW1wbGF0ZXNcclxuICAgIHN1cnZleToge1xyXG4gICAgICAgIGRyb3BRdWVzdGlvbjogXCJQbGVhc2UgZHJvcCBhIHF1ZXN0aW9uIGhlcmUuXCIsXHJcbiAgICAgICAgY29weTogXCJDb3B5XCIsXHJcbiAgICAgICAgYWRkVG9Ub29sYm94OiBcIkFkZCB0byB0b29sYm94XCIsXHJcbiAgICAgICAgZGVsZXRlUXVlc3Rpb246IFwiRGVsZXRlIFF1ZXN0aW9uXCJcclxuICAgIH0sXHJcbiAgICAvL3F1ZXN0aW9uVHlwZXNcclxuICAgIHF0OiB7XHJcbiAgICAgICAgY2hlY2tib3g6IFwiQ2hlY2tib3hcIixcclxuICAgICAgICBjb21tZW50OiBcIkNvbW1lbnRcIixcclxuICAgICAgICBkcm9wZG93bjogXCJEcm9wZG93blwiLFxyXG4gICAgICAgIGZpbGU6IFwiRmlsZVwiLFxyXG4gICAgICAgIGh0bWw6IFwiSHRtbFwiLFxyXG4gICAgICAgIG1hdHJpeDogXCJNYXRyaXggKHNpbmdsZSBjaG9pY2UpXCIsXHJcbiAgICAgICAgbWF0cml4ZHJvcGRvd246IFwiTWF0cml4IChtdWx0aXBsZSBjaG9pY2UpXCIsXHJcbiAgICAgICAgbWF0cml4ZHluYW1pYzogXCJNYXRyaXggKGR5bmFtaWMgcm93cylcIixcclxuICAgICAgICBtdWx0aXBsZXRleHQ6IFwiTXVsdGlwbGUgVGV4dFwiLFxyXG4gICAgICAgIHJhZGlvZ3JvdXA6IFwiUmFkaW9ncm91cFwiLFxyXG4gICAgICAgIHJhdGluZzogXCJSYXRpbmdcIixcclxuICAgICAgICB0ZXh0OiBcIlNpbmdsZSBJbnB1dFwiXHJcbiAgICB9LFxyXG4gICAgLy9TdHJpbmdzIGluIEVkaXRvclxyXG4gICAgZWQ6IHtcclxuICAgICAgICBuZXdQYWdlTmFtZTogXCJwYWdlXCIsXHJcbiAgICAgICAgbmV3UXVlc3Rpb25OYW1lOiBcInF1ZXN0aW9uXCIsXHJcbiAgICAgICAgdGVzdFN1cnZleTogXCJUZXN0IFN1cnZleVwiLFxyXG4gICAgICAgIHRlc3RTdXJ2ZXlBZ2FpbjogXCJUZXN0IFN1cnZleSBBZ2FpblwiLFxyXG4gICAgICAgIHRlc3RTdXJ2ZXlXaWR0aDogXCJTdXJ2ZXkgd2lkdGg6IFwiLFxyXG4gICAgICAgIGVtYmVkU3VydmV5OiBcIkVtYmVkIFN1cnZleVwiLFxyXG4gICAgICAgIHNhdmVTdXJ2ZXk6IFwiU2F2ZSBTdXJ2ZXlcIixcclxuICAgICAgICBkZXNpZ25lcjogXCJTdXJ2ZXkgRGVzaWduZXJcIixcclxuICAgICAgICBqc29uRWRpdG9yOiBcIkpTT04gRWRpdG9yXCIsXHJcbiAgICAgICAgdW5kbzogXCJVbmRvXCIsXHJcbiAgICAgICAgcmVkbzogXCJSZWRvXCIsXHJcbiAgICAgICAgb3B0aW9uczogXCJPcHRpb25zXCIsXHJcbiAgICAgICAgZ2VuZXJhdGVWYWxpZEpTT046IFwiR2VuZXJhdGUgVmFsaWQgSlNPTlwiLFxyXG4gICAgICAgIGdlbmVyYXRlUmVhZGFibGVKU09OOiBcIkdlbmVyYXRlIFJlYWRhYmxlIEpTT05cIixcclxuICAgICAgICB0b29sYm94OiBcIlRvb2xib3hcIixcclxuICAgICAgICBkZWxTZWxPYmplY3Q6IFwiRGVsZXRlIHNlbGVjdGVkIG9iamVjdFwiLFxyXG4gICAgICAgIGNvcnJlY3RKU09OOiBcIlBsZWFzZSBjb3JyZWN0IEpTT04uXCIsXHJcbiAgICAgICAgc3VydmV5UmVzdWx0czogXCJTdXJ2ZXkgUmVzdWx0OiBcIlxyXG4gICAgfSxcclxuICAgIC8vUHJvcGVydHkgRWRpdG9yc1xyXG4gICAgcGU6IHtcclxuICAgICAgICBhcHBseTogXCJBcHBseVwiLFxyXG4gICAgICAgIG9rOiBcIk9LXCIsXHJcbiAgICAgICAgY2FuY2VsOiBcIkNhbmNlbFwiLFxyXG4gICAgICAgIHJlc2V0OiBcIlJlc2V0XCIsXHJcbiAgICAgICAgY2xvc2U6IFwiQ2xvc2VcIixcclxuICAgICAgICBkZWxldGU6IFwiRGVsZXRlXCIsXHJcbiAgICAgICAgYWRkTmV3OiBcIkFkZCBOZXdcIixcclxuICAgICAgICByZW1vdmVBbGw6IFwiUmVtb3ZlIEFsbFwiLFxyXG4gICAgICAgIGVkaXQ6IFwiRWRpdFwiLFxyXG4gICAgICAgIGVtcHR5OiBcIjxlbXB0eT5cIixcclxuICAgICAgICBmYXN0RW50cnk6IFwiRmFzdCBFbnRyeVwiLFxyXG4gICAgICAgIGZvcm1FbnRyeTogXCJGb3JtIEVudHJ5XCIsXHJcbiAgICAgICAgdGVzdFNlcnZpY2U6IFwiVGVzdCB0aGUgc2VydmljZVwiLFxyXG4gICAgICAgIGV4cHJlc3Npb25IZWxwOiBcIlBsZWFzZSBlbnRlciBhIGJvb2xlYW4gZXhwcmVzc2lvbi4gSXQgc2hvdWxkIHJldHVybiB0cnVlIHRvIGtlZXAgdGhlIHF1ZXN0aW9uL3BhZ2UgdmlzaWJsZS4gRm9yIGV4YW1wbGU6IHtxdWVzdGlvbjF9ID0gJ3ZhbHVlMScgb3IgKHtxdWVzdGlvbjJ9ID0gMyBhbmQge3F1ZXN0aW9uM30gPCA1KVwiLFxyXG5cclxuICAgICAgICB2YWx1ZTogXCJWYWx1ZVwiLFxyXG4gICAgICAgIHRleHQ6IFwiVGV4dFwiLFxyXG4gICAgICAgIHJlcXVpcmVkOiBcIlJlcXVpcmVkP1wiLFxyXG4gICAgICAgIGhhc090aGVyOiBcIkhhcyBPdGhlciBJdGVtXCIsXHJcbiAgICAgICAgbmFtZTogXCJOYW1lXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiVGl0bGVcIixcclxuICAgICAgICBjZWxsVHlwZTogXCJDZWxsIFR5cGVcIixcclxuICAgICAgICBjb2xDb3VudDogXCJDb2x1bW4gQ291bnRcIixcclxuXHJcbiAgICAgICAgcUVkaXRvclRpdGxlOiBcIkVkaXQgcXVlc3Rpb246IHswfVwiLFxyXG4gICAgICAgIGdlbmVyYWw6IFwiR2VuZXJhbFwiLFxyXG4gICAgICAgIGZpbGVPcHRpb25zOiBcIk9wdGlvbnNcIixcclxuICAgICAgICBodG1sOiBcIkh0bWwgRWRpdG9yXCIsXHJcbiAgICAgICAgY29sdW1uczogXCJDb2x1bW5zXCIsXHJcbiAgICAgICAgcm93czogXCJSb3dzXCIsXHJcbiAgICAgICAgY2hvaWNlczogXCJDaG9pY2VzXCIsXHJcbiAgICAgICAgdmlzaWJsZUlmOiBcIlZpc2libGUgSWZcIixcclxuICAgICAgICByYXRlVmFsdWVzOiBcIlJhdGUgVmFsdWVzXCIsXHJcbiAgICAgICAgY2hvaWNlc0J5VXJsOiBcIkNob2ljZXMgZnJvbSBXZWJcIixcclxuICAgICAgICBtYXRyaXhDaG9pY2VzOiBcIkRlZmF1bHQgQ2hvaWNlc1wiLFxyXG4gICAgICAgIG11bHRpcGxlVGV4dEl0ZW1zOiBcIlRleHQgSW5wdXRzXCIsXHJcblxyXG4gICAgICAgIGVkaXRQcm9wZXJ0eTogXCJFZGl0IHByb3BlcnR5ICd7MH0nXCIsXHJcbiAgICAgICAgaXRlbXM6IFwiWyBJdGVtczogezB9IF1cIixcclxuXHJcbiAgICAgICAgZW50ZXJOZXdWYWx1ZTogXCJQbGVhc2UsIGVudGVyIHRoZSB2YWx1ZS5cIixcclxuICAgICAgICBub3F1ZXN0aW9uczogXCJUaGVyZSBpcyBubyBhbnkgcXVlc3Rpb24gaW4gdGhlIHN1cnZleS5cIixcclxuICAgICAgICBjcmVhdGV0cmlnZ2VyOiBcIlBsZWFzZSBjcmVhdGUgYSB0cmlnZ2VyXCIsXHJcbiAgICAgICAgdHJpZ2dlck9uOiBcIk9uIFwiLFxyXG4gICAgICAgIHRyaWdnZXJNYWtlUGFnZXNWaXNpYmxlOiBcIk1ha2UgcGFnZXMgdmlzaWJsZTpcIixcclxuICAgICAgICB0cmlnZ2VyTWFrZVF1ZXN0aW9uc1Zpc2libGU6IFwiTWFrZSBxdWVzdGlvbnMgdmlzaWJsZTpcIixcclxuICAgICAgICB0cmlnZ2VyQ29tcGxldGVUZXh0OiBcIkNvbXBsZXRlIHRoZSBzdXJ2ZXkgaWYgc3VjY2VlZC5cIixcclxuICAgICAgICB0cmlnZ2VyTm90U2V0OiBcIlRoZSB0cmlnZ2VyIGlzIG5vdCBzZXRcIixcclxuICAgICAgICB0cmlnZ2VyUnVuSWY6IFwiUnVuIGlmXCIsXHJcbiAgICAgICAgdHJpZ2dlclNldFRvTmFtZTogXCJDaGFuZ2UgdmFsdWUgb2Y6IFwiLFxyXG4gICAgICAgIHRyaWdnZXJTZXRWYWx1ZTogXCJ0bzogXCIsXHJcbiAgICAgICAgdHJpZ2dlcklzVmFyaWFibGU6IFwiRG8gbm90IHB1dCB0aGUgdmFyaWFibGUgaW50byB0aGUgc3VydmV5IHJlc3VsdC5cIixcclxuICAgICAgICB2ZXJiQ2hhbmdlVHlwZTogXCJDaGFuZ2UgdHlwZSBcIixcclxuICAgICAgICB2ZXJiQ2hhbmdlUGFnZTogXCJDaGFuZ2UgcGFnZSBcIlxyXG4gICAgfSxcclxuICAgIC8vT3BlcmF0b3JzXHJcbiAgICBvcDoge1xyXG4gICAgICAgIGVtcHR5OiBcImlzIGVtcHR5XCIsXHJcbiAgICAgICAgbm90ZW1wdHk6IFwiaXMgbm90IGVtcHR5XCIsXHJcbiAgICAgICAgZXF1YWw6IFwiZXF1YWxzXCIsXHJcbiAgICAgICAgbm90ZXF1YWw6IFwibm90IGVxdWFsc1wiLFxyXG4gICAgICAgIGNvbnRhaW5zOiBcImNvbnRhaW5zXCIsXHJcbiAgICAgICAgbm90Y29udGFpbnM6IFwibm90IGNvbnRhaW5zXCIsXHJcbiAgICAgICAgZ3JlYXRlcjogXCJncmVhdGVyXCIsXHJcbiAgICAgICAgbGVzczogXCJsZXNzXCIsXHJcbiAgICAgICAgZ3JlYXRlcm9yZXF1YWw6IFwiZ3JlYXRlciBvciBlcXVhbHNcIixcclxuICAgICAgICBsZXNzb3JlcXVhbDogXCJMZXNzIG9yIEVxdWFsc1wiXHJcbiAgICB9LFxyXG4gICAgLy9FbWJlZCB3aW5kb3dcclxuICAgIGV3OiB7XHJcbiAgICAgICAgYW5ndWxhcjogXCJVc2UgQW5ndWxhciB2ZXJzaW9uXCIsXHJcbiAgICAgICAganF1ZXJ5OiBcIlVzZSBqUXVlcnkgdmVyc2lvblwiLFxyXG4gICAgICAgIGtub2Nrb3V0OiBcIlVzZSBLbm9ja291dCB2ZXJzaW9uXCIsXHJcbiAgICAgICAgcmVhY3Q6IFwiVXNlIFJlYWN0IHZlcnNpb25cIixcclxuICAgICAgICBib290c3RyYXA6IFwiRm9yIGJvb3RzdHJhcCBmcmFtZXdvcmtcIixcclxuICAgICAgICBzdGFuZGFyZDogXCJObyBib290c3RyYXBcIixcclxuICAgICAgICBzaG93T25QYWdlOiBcIlNob3cgc3VydmV5IG9uIGEgcGFnZVwiLFxyXG4gICAgICAgIHNob3dJbldpbmRvdzogXCJTaG93IHN1cnZleSBpbiBhIHdpbmRvd1wiLFxyXG4gICAgICAgIGxvYWRGcm9tU2VydmVyOiBcIkxvYWQgU3VydmV5IEpTT04gZnJvbSBzZXJ2ZXJcIixcclxuICAgICAgICB0aXRsZVNjcmlwdDogXCJTY3JpcHRzIGFuZCBzdHlsZXNcIixcclxuICAgICAgICB0aXRsZUh0bWw6IFwiSFRNTFwiLFxyXG4gICAgICAgIHRpdGxlSmF2YVNjcmlwdDogXCJKYXZhU2NyaXB0XCJcclxuICAgIH0sXHJcbiAgICAvL1Byb3BlcnRpZXNcclxuICAgIHA6IHtcclxuICAgICAgICBuYW1lOiBcIm5hbWVcIixcclxuICAgICAgICB0aXRsZTogeyBuYW1lOiBcInRpdGxlXCIsIHRpdGxlOiBcIkxlYXZlIGl0IGVtcHR5LCBpZiBpdCBpcyB0aGUgc2FtZSBhcyAnTmFtZSdcIiB9LFxyXG4gICAgICAgIHN1cnZleV90aXRsZTogeyBuYW1lOiBcInRpdGxlXCIsIHRpdGxlOiBcIkl0IHdpbGwgYmUgc2hvd24gb24gZXZlcnkgcGFnZS5cIiB9LFxyXG4gICAgICAgIHBhZ2VfdGl0bGU6IHsgbmFtZTogXCJ0aXRsZVwiLCB0aXRsZTogXCJQYWdlIHRpdGxlXCIgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuZWRpdG9yTG9jYWxpemF0aW9uLmxvY2FsZXNbXCJlblwiXSA9IGRlZmF1bHRTdHJpbmdzO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9lZGl0b3JMb2NhbGl6YXRpb24udHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TW9kYWxFZGl0b3JcIjtcclxuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlFZGl0b3JTaG93V2luZG93IHtcclxuICAgIGtvVmlzaWJsZTogYW55O1xyXG4gICAga29FZGl0b3I6IGFueTtcclxuICAgIHB1YmxpYyBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5rb1Zpc2libGUgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvRWRpdG9yID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzaG93KHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DaGFuZ2VkOiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpID0+IGFueSkge1xyXG4gICAgICAgIHZhciBlZGl0b3IgPSBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UuY3JlYXRlRWRpdG9yKHF1ZXN0aW9uQmFzZSwgb25DaGFuZ2VkLCB0aGlzLm9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMua29FZGl0b3IoZWRpdG9yKTtcclxuICAgICAgICB0aGlzLmtvVmlzaWJsZSh0cnVlKTtcclxuICAgICAgICB2YXIgalF1ZXJ5ID0gd2luZG93W1wialF1ZXJ5XCJdO1xyXG4gICAgICAgIGpRdWVyeShcIiNzdXJ2ZXlxdWVzdGlvbmVkaXRvcndpbmRvd1wiKS5tb2RhbChcInNob3dcIik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMge1xyXG4gICAgcHJpdmF0ZSBwcm9wZXJ0aWVzOiBBcnJheTxTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5PjtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyh0aGlzLnF1ZXN0aW9uQmFzZS5nZXRUeXBlKCkpOyBcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRQcm9wZXJ0eShwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcGVydGllc1tpXS5uYW1lID09IHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocHJvcGVydHkgJiYgdGhpcy5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKHRoaXMucXVlc3Rpb25CYXNlLCBwcm9wZXJ0eSkpIHByb3BlcnR5ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xyXG4gICAgfSBcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHRFZGl0b3I6IHN0cmluZyA9IFwicXVlc3Rpb25iYXNlXCI7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBlZGl0b3JSZWdpc3RlcmVkTGlzdCA9IHt9O1xyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlckVkaXRvcihuYW1lOiBzdHJpbmcsIGNyZWF0b3I6IChxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pID0+IFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSkge1xyXG4gICAgICAgIFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZS5lZGl0b3JSZWdpc3RlcmVkTGlzdFtuYW1lXSA9IGNyZWF0b3I7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZUVkaXRvcihxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2hhbmdlZDogKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSA9PiBhbnksXHJcbiAgICAgICAgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbik6IFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7XHJcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHF1ZXN0aW9uQmFzZS5nZXRUeXBlKCk7XHJcbiAgICAgICAgdmFyIGNyZWF0b3IgPSBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbY2xhc3NOYW1lXTtcclxuICAgICAgICB3aGlsZSAoIWNyZWF0b3IgJiYgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgIC8vVE9ETyBmaW5kQ2xhc3MgZnVuY3Rpb24gd2FzIG1hZGUgcHVibGljLlxyXG4gICAgICAgICAgICB2YXIgbWV0YUNsYXNzID0gPFN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcz5TdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YVtcImZpbmRDbGFzc1wiXShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFDbGFzcykgYnJlYWs7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IG1ldGFDbGFzcy5wYXJlbnROYW1lO1xyXG4gICAgICAgICAgICBpZiAoY2xhc3NOYW1lKSAgY3JlYXRvciA9IFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZS5lZGl0b3JSZWdpc3RlcmVkTGlzdFtjbGFzc05hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNyZWF0b3IpIGNyZWF0b3IgPSBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlLmRlZmF1bHRFZGl0b3JdO1xyXG4gICAgICAgIHZhciBlZGl0b3IgPSBjcmVhdG9yKHF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7XHJcbiAgICAgICAgZWRpdG9yLm9uQ2hhbmdlZCA9IG9uQ2hhbmdlZDtcclxuICAgICAgICByZXR1cm4gZWRpdG9yO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHByb3BlcnRpZXM6IFN1cnZleVF1ZXN0aW9uUHJvcGVydGllcztcclxuICAgIHB1YmxpYyBvbkNoYW5nZWQ6IChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkgPT4gYW55O1xyXG4gICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xyXG4gICAgcHVibGljIG9uUmVzZXRDbGljazogYW55O1xyXG4gICAga29UYWJzOiBhbnk7IGtvQWN0aXZlVGFiOiBhbnk7IGtvVGl0bGU6IGFueTtcclxuICAgIG9uVGFiQ2xpY2s6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMocXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTtcclxuICAgICAgICBzZWxmLm9uQXBwbHlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hcHBseSgpOyB9O1xyXG4gICAgICAgIHNlbGYub25SZXNldENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnJlc2V0KCk7IH07XHJcbiAgICAgICAgdGhpcy5vblRhYkNsaWNrID0gZnVuY3Rpb24gKHRhYikgeyBzZWxmLmtvQWN0aXZlVGFiKHRhYi5uYW1lKTsgfTtcclxuICAgICAgICB2YXIgdGFicyA9IHRoaXMuYnVpbGRUYWJzKCk7XHJcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVRhYiA9IGtvLm9ic2VydmFibGUodGFic1swXS5uYW1lKTtcclxuICAgICAgICB0aGlzLmtvVGFicyA9IGtvLm9ic2VydmFibGVBcnJheSh0YWJzKTtcclxuICAgICAgICB0aGlzLmtvVGl0bGUgPSBrby5vYnNlcnZhYmxlKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5xRWRpdG9yVGl0bGVcIilbXCJmb3JtYXRcIl0odGhpcy5xdWVzdGlvbkJhc2UubmFtZSkpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciB0YWJzID0gdGhpcy5rb1RhYnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRhYnNbaV0uaGFzRXJyb3IoKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyByZXNldCgpIHtcclxuICAgICAgICAvL1RPRE8gZG8gbm90aGluZyBmb3Igbm93LlxyXG4gICAgfVxyXG4gICAgcHVibGljIGFwcGx5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKCkpIHJldHVybjtcclxuICAgICAgICB2YXIgdGFicyA9IHRoaXMua29UYWJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRhYnNbaV0uYXBwbHkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb1RpdGxlKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5xRWRpdG9yVGl0bGVcIilbXCJmb3JtYXRcIl0odGhpcy5xdWVzdGlvbkJhc2UubmFtZSkpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlZCh0aGlzLnF1ZXN0aW9uQmFzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBidWlsZFRhYnMoKTogQXJyYXk8U3VydmV5UXVlc3Rpb25FZGl0b3JUYWJCYXNlPiB7XHJcbiAgICAgICAgdmFyIHRhYnMgPSBbXTtcclxuICAgICAgICB0aGlzLmFkZFRhYnModGFicyk7XHJcbiAgICAgICAgdGhpcy5hZGRQcm9wZXJ0aWVzVGFicyh0YWJzKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGFic1tpXS5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrID0gdGhpcy5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YWJzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGEudmlzaWJsZUluZGV4IDwgYi52aXNpYmxlSW5kZXggPyAtMSA6IChhLnZpc2libGVJbmRleCA+IGIudmlzaWJsZUluZGV4ID8gMSA6IDApOyB9KTtcclxuICAgICAgICByZXR1cm4gdGFicztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBhZGRUYWJzKHRhYnM6IEFycmF5PFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiQmFzZT4pIHtcclxuICAgICAgICB0YWJzLnB1c2godGhpcy5jcmVhdGVHZW5lcmFsVGFiKCkpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUdlbmVyYWxUYWIoKTogU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJHZW5lcmFsIHsgcmV0dXJuIG5ldyBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwodGhpcy5xdWVzdGlvbkJhc2UsIDAsIHRoaXMucHJvcGVydGllcyk7IH1cclxuICAgIHByaXZhdGUgYWRkUHJvcGVydGllc1RhYnModGFiczogQXJyYXk8U3VydmV5UXVlc3Rpb25FZGl0b3JUYWJCYXNlPikge1xyXG4gICAgICAgIHZhciBwcm9wVGFicyA9IFtdO1xyXG4gICAgICAgIHRoaXMuZ2V0UHJvcGVydGllc1RhYnMocHJvcFRhYnMpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcFRhYnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHRhYkl0ZW0gPSBwcm9wVGFic1tpXTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkodGFiSXRlbS5wcm9wZXJ0eU5hbWUpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIGVkaXRvclRhYiA9IG5ldyBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYlByb3BlcnR5KHRoaXMucXVlc3Rpb25CYXNlLCB0YWJJdGVtLnByb3BlcnR5TmFtZSwgdGFiSXRlbS52aXNpYmxlSW5kZXgsIHRoaXMucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIGlmICh0YWJJdGVtLnRpdGxlKSBlZGl0b3JUYWIudGl0bGUgPSB0YWJJdGVtLnRpdGxlO1xyXG4gICAgICAgICAgICB0YWJzLnB1c2goZWRpdG9yVGFiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UHJvcGVydGllc1RhYnMocHJvcFRhYnM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBwcm9wVGFicy5wdXNoKHsgcHJvcGVydHlOYW1lOiBcInZpc2libGVJZlwiLCB2aXNpYmxlSW5kZXg6IDEwMCB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiQmFzZSB7XHJcbiAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgIHByb3RlY3RlZCBwcm9wZXJ0aWVzOiBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXM7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb25CYXNlOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBwdWJsaWMgdmlzaWJsZUluZGV4OiBudW1iZXIsIHByb3BlcnRpZXM6IFN1cnZleVF1ZXN0aW9uUHJvcGVydGllcykge1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykgcHJvcGVydGllcyA9IG5ldyBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMocXVlc3Rpb25CYXNlLCBudWxsKTtcclxuICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzOyBcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJuYW1lXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudGl0bGVWYWx1ZSkgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZTtcclxuICAgICAgICB2YXIgc3RyID0gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLlwiICsgdGhpcy5uYW1lKTtcclxuICAgICAgICByZXR1cm4gc3RyID8gc3RyIDogdGhpcy5uYW1lO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGh0bWxUZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJxdWVzdGlvbmVkaXRvcnRhYi1cIiArIHRoaXMubmFtZTsgfVxyXG4gICAgcHVibGljIGdldCB0ZW1wbGF0ZU9iamVjdCgpOiBhbnkgeyByZXR1cm4gdGhpczsgfVxyXG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgIHB1YmxpYyByZXNldCgpIHsgfVxyXG4gICAgcHVibGljIGFwcGx5KCkgeyB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0VmFsdWUocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSByZXR1cm4gcHJvcGVydHkuZ2V0VmFsdWUodGhpcy5xdWVzdGlvbkJhc2UpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9uQmFzZVtwcm9wZXJ0eS5uYW1lXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiQmFzZSB7XHJcbiAgICBwcml2YXRlIHRpdGxlUHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHk7XHJcbiAgICBwdWJsaWMgaGFzVGl0bGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaGFzVmlzaWJsZTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBoYXNJc1JlcXVpcmVkOiBib29sZWFuO1xyXG4gICAgcHVibGljIGhhc1N0YXJ0V2l0aE5ld0xpbmU6IGJvb2xlYW47XHJcblxyXG4gICAga29OYW1lOiBhbnk7IGtvVGl0bGU6IGFueTsga29WaXNpYmxlOiBhbnk7IGtvSXNSZXF1aXJlZDogYW55OyBrb1N0YXJ0V2l0aE5ld0xpbmU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciwgcHJvcGVydGllczogU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCB2aXNpYmxlSW5kZXgsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMuc2V0VXBQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldFVwUHJvcGVydGllcygpIHtcclxuICAgICAgICB0aGlzLnRpdGxlUHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJ0aXRsZVwiKTtcclxuICAgICAgICB0aGlzLmhhc1RpdGxlID0gdGhpcy50aXRsZVByb3BlcnR5ICE9IG51bGw7XHJcbiAgICAgICAgdGhpcy5oYXNWaXNpYmxlID0gdGhpcy5wcm9wZXJ0aWVzLmdldFByb3BlcnR5KFwidmlzaWJsZVwiKSAhPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFzSXNSZXF1aXJlZCA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcImlzUmVxdWlyZWRcIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc1N0YXJ0V2l0aE5ld0xpbmUgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJzdGFydFdpdGhOZXdMaW5lXCIpICE9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rb05hbWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb1RpdGxlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29WaXNpYmxlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29Jc1JlcXVpcmVkID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29TdGFydFdpdGhOZXdMaW5lID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBuYW1lKCk6IHN0cmluZyB7IHJldHVybiBcImdlbmVyYWxcIjsgfVxyXG4gICAgcHVibGljIGdldCBoYXNBZGRpdGlvbmFsVGVtcGxhdGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGdldCBhZGRpdGlvbmFsVGVtcGxhdGVIdG1sKCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbiAgICBwdWJsaWMgaGFzRXJyb3IoKTogYm9vbGVhbiB7IHJldHVybiAhdGhpcy5rb05hbWUoKTsgfVxyXG4gICAgcHVibGljIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMua29OYW1lKHRoaXMucXVlc3Rpb25CYXNlLm5hbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1RpdGxlKSB0aGlzLmtvVGl0bGUodGhpcy5nZXRWYWx1ZSh0aGlzLnRpdGxlUHJvcGVydHkpKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNWaXNpYmxlKSB0aGlzLmtvVmlzaWJsZSh0aGlzLnF1ZXN0aW9uQmFzZS52aXNpYmxlKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNJc1JlcXVpcmVkKSB0aGlzLmtvSXNSZXF1aXJlZCgoPFN1cnZleS5RdWVzdGlvbj50aGlzLnF1ZXN0aW9uQmFzZSkuaXNSZXF1aXJlZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU3RhcnRXaXRoTmV3TGluZSkgdGhpcy5rb1N0YXJ0V2l0aE5ld0xpbmUodGhpcy5xdWVzdGlvbkJhc2Uuc3RhcnRXaXRoTmV3TGluZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYXBwbHkoKSB7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2UubmFtZSA9IHRoaXMua29OYW1lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzVGl0bGUpICg8U3VydmV5LlF1ZXN0aW9uPnRoaXMucXVlc3Rpb25CYXNlKS50aXRsZSA9IHRoaXMua29UaXRsZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1Zpc2libGUpIHRoaXMucXVlc3Rpb25CYXNlLnZpc2libGUgPSB0aGlzLmtvVmlzaWJsZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0lzUmVxdWlyZWQpICg8U3VydmV5LlF1ZXN0aW9uPnRoaXMucXVlc3Rpb25CYXNlKS5pc1JlcXVpcmVkID0gdGhpcy5rb0lzUmVxdWlyZWQoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNTdGFydFdpdGhOZXdMaW5lKSB0aGlzLnF1ZXN0aW9uQmFzZS5zdGFydFdpdGhOZXdMaW5lID0gdGhpcy5rb1N0YXJ0V2l0aE5ld0xpbmUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiUHJvcGVydHkgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkJhc2Uge1xyXG4gICAgcHJpdmF0ZSBwcm9wZXJ0eVZhbHVlOiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5O1xyXG4gICAgcHJpdmF0ZSBwcm9wZXJ0eUVkaXRvclZhbHVlOiBTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgdmlzaWJsZUluZGV4OiBudW1iZXIsIHByb3BlcnRpZXM6IFN1cnZleVF1ZXN0aW9uUHJvcGVydGllcykge1xyXG4gICAgICAgIHN1cGVyKHF1ZXN0aW9uQmFzZSwgdmlzaWJsZUluZGV4LCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5VmFsdWUgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkocHJvcGVydHlOYW1lKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5RWRpdG9yVmFsdWUgPSA8U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcj5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuY3JlYXRlRWRpdG9yKHRoaXMucHJvcGVydHkudHlwZSwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvclZhbHVlLnZhbHVlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLnByb3BlcnR5KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5wcm9wZXJ0eU5hbWU7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucHJvcGVydHlFZGl0b3IuaGFzRXJyb3IoKTsgfVxyXG4gICAgcHVibGljIGdldCBodG1sVGVtcGxhdGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicHJvcGVydHllZGl0b3Jjb250ZW50LVwiICsgdGhpcy5wcm9wZXJ0eS50eXBlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHRlbXBsYXRlT2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLnByb3BlcnR5RWRpdG9yOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5KCk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkgeyByZXR1cm4gdGhpcy5wcm9wZXJ0eVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IHByb3BlcnR5RWRpdG9yKCk6IFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3IgeyByZXR1cm4gdGhpcy5wcm9wZXJ0eUVkaXRvclZhbHVlOyB9XHJcbiAgICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvclZhbHVlLnZhbHVlID0gdGhpcy5nZXRWYWx1ZSh0aGlzLnByb3BlcnR5KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhcHBseSgpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnR5RWRpdG9yLmFwcGx5KCk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkJhc2VbdGhpcy5wcm9wZXJ0eU5hbWVdID0gdGhpcy5wcm9wZXJ0eUVkaXRvclZhbHVlLnZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJxdWVzdGlvbmJhc2VcIiwgZnVuY3Rpb24gKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKTogU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UocXVlc3Rpb24sIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uRWRpdG9yQmFzZS50cyIsImV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xyXG4gICAgcHVibGljIHN0YXRpYyBkZWZhdWx0RWRpdG9yOiBzdHJpbmcgPSBcInN0cmluZ1wiO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZWRpdG9yUmVnaXN0ZXJlZExpc3QgPSB7fTtcclxuICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJFZGl0b3IobmFtZTogc3RyaW5nLCBjcmVhdG9yOiAoKSA9PiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UpIHtcclxuICAgICAgICBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbbmFtZV0gPSBjcmVhdG9yO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVFZGl0b3IoZWRpdG9yVHlwZTogc3RyaW5nLCBmdW5jOiAobmV3VmFsdWU6IGFueSkgPT4gYW55KTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcclxuICAgICAgICB2YXIgY3JlYXRvciA9IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5lZGl0b3JSZWdpc3RlcmVkTGlzdFtlZGl0b3JUeXBlXTtcclxuICAgICAgICBpZiAoIWNyZWF0b3IpIGNyZWF0b3IgPSBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UuZWRpdG9yUmVnaXN0ZXJlZExpc3RbU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLmRlZmF1bHRFZGl0b3JdO1xyXG4gICAgICAgIHZhciBwcm9wZXJ0eUVkaXRvciA9IGNyZWF0b3IoKTtcclxuICAgICAgICBwcm9wZXJ0eUVkaXRvci5vbkNoYW5nZWQgPSBmdW5jO1xyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0eUVkaXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHZhbHVlXzogYW55ID0gbnVsbDtcclxuICAgIHB1YmxpYyBvcHRpb25zOiBhbnkgPSBudWxsO1xyXG4gICAgcHVibGljIG9uQ2hhbmdlZDogKG5ld1ZhbHVlOiBhbnkpID0+IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHRocm93IFwiZWRpdG9yVHlwZSBpcyBub3QgZGVmaW5lZFwiOyB9XHJcbiAgICBwdWJsaWMgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcgeyByZXR1cm4gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMudmFsdWVfOyB9XHJcbiAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0Q29ycmVjdGVkVmFsdWUodmFsdWUpO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKHZhbHVlKTtcclxuICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0VmFsdWVDb3JlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgfVxyXG4gICAgcHVibGljIHNldE9iamVjdCh2YWx1ZTogYW55KSB7IH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRDb3JyZWN0ZWRWYWx1ZSh2YWx1ZTogYW55KTogYW55IHsgIHJldHVybiB2YWx1ZTsgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5U3RyaW5nUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdHJpbmdcIjsgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlEcm9wZG93blByb3BlcnR5RWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiZHJvcGRvd25cIjsgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlCb29sZWFuUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJib29sZWFuXCI7IH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5TnVtYmVyUHJvcGVydHlFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1iZXJcIjsgfVxyXG59XHJcblxyXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJzdHJpbmdcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5U3RyaW5nUHJvcGVydHlFZGl0b3IoKTsgfSk7XHJcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcImRyb3Bkb3duXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleURyb3Bkb3duUHJvcGVydHlFZGl0b3IoKTsgfSk7XHJcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcImJvb2xlYW5cIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5Qm9vbGVhblByb3BlcnR5RWRpdG9yKCk7IH0pO1xyXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJudW1iZXJcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5TnVtYmVyUHJvcGVydHlFZGl0b3IoKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eUVkaXRvckJhc2UudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eU1vZGFsRWRpdG9yXCI7XHJcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5TW9kYWxFZGl0b3Ige1xyXG4gICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XHJcbiAgICBwdWJsaWMgb25Nb3ZlVXBDbGljazogYW55O1xyXG4gICAgcHVibGljIG9uTW92ZURvd25DbGljazogYW55O1xyXG4gICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcclxuICAgIHB1YmxpYyBvbkNsZWFyQ2xpY2s6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBbXTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShpdGVtKTsgfTtcclxuICAgICAgICBzZWxmLm9uQ2xlYXJDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYua29JdGVtcy5yZW1vdmVBbGwoKTsgfTtcclxuICAgICAgICBzZWxmLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQWRkSXRlbSgpOyB9O1xyXG4gICAgICAgIHNlbGYub25Nb3ZlVXBDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYubW92ZVVwKGl0ZW0pOyB9O1xyXG4gICAgICAgIHNlbGYub25Nb3ZlRG93bkNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5tb3ZlRG93bihpdGVtKTsgfTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGxlbiA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcclxuICAgICAgICByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLml0ZW1zXCIpW1wiZm9ybWF0XCJdKGxlbik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0Q29ycmVjdGVkVmFsdWUodmFsdWU6IGFueSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBBZGRJdGVtKCkge1xyXG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKHRoaXMuY3JlYXRlTmV3RWRpdG9ySXRlbSgpKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBtb3ZlVXAoaXRlbTogYW55KSB7XHJcbiAgICAgICAgdmFyIGFyciA9IHRoaXMua29JdGVtcygpO1xyXG4gICAgICAgIHZhciBpbmRleCA9IGFyci5pbmRleE9mKGl0ZW0pO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDEpIHJldHVybjtcclxuICAgICAgICBhcnJbaW5kZXhdID0gYXJyW2luZGV4IC0gMV07XHJcbiAgICAgICAgYXJyW2luZGV4IC0gMV0gPSBpdGVtO1xyXG4gICAgICAgIHRoaXMua29JdGVtcyhhcnIpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG1vdmVEb3duKGl0ZW06IGFueSkge1xyXG4gICAgICAgIHZhciBhcnIgPSB0aGlzLmtvSXRlbXMoKTtcclxuICAgICAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IGFyci5sZW5ndGggLSAxKSByZXR1cm47XHJcbiAgICAgICAgYXJyW2luZGV4XSA9IGFycltpbmRleCArIDFdO1xyXG4gICAgICAgIGFycltpbmRleCArIDFdID0gaXRlbTtcclxuICAgICAgICB0aGlzLmtvSXRlbXMoYXJyKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLmtvSXRlbXModGhpcy5nZXRJdGVtc0Zyb21WYWx1ZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0SXRlbXNGcm9tVmFsdWUodmFsdWU6IGFueSA9IG51bGwpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICBpZighdmFsdWUpIHZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5jcmVhdGVFZGl0b3JJdGVtKHZhbHVlW2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkJlZm9yZUFwcGx5KCkge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IFtdO1xyXG4gICAgICAgIHZhciBpbnRlcm5hbEl0ZW1zID0gdGhpcy5rb0l0ZW1zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpbnRlcm5hbEl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5jcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oaW50ZXJuYWxJdGVtc1tpXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldFZhbHVlQ29yZShpdGVtcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3RWRpdG9ySXRlbSgpOiBhbnkgeyB0aHJvdyBcIk92ZXJyaWRlICdjcmVhdGVOZXdFZGl0b3JJdGVtJyBtZXRob2RcIjsgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7IHJldHVybiBpdGVtOyB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkgeyAgcmV0dXJuIGVkaXRvckl0ZW07ICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbXNFZGl0b3IudHMiLCJpbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgZW51bSBPYmpUeXBlIHsgVW5rbm93biwgU3VydmV5LCBQYWdlLCBRdWVzdGlvbiB9XG5leHBvcnQgY2xhc3MgU3VydmV5SGVscGVyIHtcbiAgICBwdWJsaWMgc3RhdGljIGdldE5ld1BhZ2VOYW1lKG9ianM6IEFycmF5PGFueT4pIHtcbiAgICAgICAgcmV0dXJuIFN1cnZleUhlbHBlci5nZXROZXdOYW1lKG9ianMsIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJlZC5uZXdQYWdlTmFtZVwiKSk7XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV3UXVlc3Rpb25OYW1lKG9ianM6IEFycmF5PGFueT4pIHtcbiAgICAgICAgcmV0dXJuIFN1cnZleUhlbHBlci5nZXROZXdOYW1lKG9ianMsIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJlZC5uZXdRdWVzdGlvbk5hbWVcIikpO1xuICAgIH1cbiAgICBwdWJsaWMgc3RhdGljIGdldE5ld05hbWUob2JqczogQXJyYXk8YW55PiwgYmFzZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHZhciBoYXNoID0ge307XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaFtvYmpzW2ldLm5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbnVtID0gMTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGlmICghaGFzaFtiYXNlTmFtZSArIG51bS50b1N0cmluZygpXSkgYnJlYWs7XG4gICAgICAgICAgICBudW0rKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmFzZU5hbWUgKyBudW0udG9TdHJpbmcoKTtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3RUeXBlKG9iajogYW55KTogT2JqVHlwZSB7XG4gICAgICAgIGlmICghb2JqIHx8ICFvYmpbXCJnZXRUeXBlXCJdKSByZXR1cm4gT2JqVHlwZS5Vbmtub3duO1xuICAgICAgICBpZiAob2JqLmdldFR5cGUoKSA9PSBcInBhZ2VcIikgcmV0dXJuIE9ialR5cGUuUGFnZTtcbiAgICAgICAgaWYgKG9iai5nZXRUeXBlKCkgPT0gXCJzdXJ2ZXlcIikgcmV0dXJuIE9ialR5cGUuU3VydmV5O1xuICAgICAgICBpZiAob2JqW1wibmFtZVwiXSkgcmV0dXJuIE9ialR5cGUuUXVlc3Rpb247XG4gICAgICAgIHJldHVybiBPYmpUeXBlLlVua25vd247XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqZWN0TmFtZShvYmo6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChvYmpbXCJuYW1lXCJdKSByZXR1cm4gb2JqW1wibmFtZVwiXTtcbiAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xuICAgICAgICBpZiAob2JqVHlwZSAhPSBPYmpUeXBlLlBhZ2UpIHJldHVybiBcIlwiO1xuICAgICAgICB2YXIgZGF0YSA9IDxTdXJ2ZXkuU3VydmV5Pig8U3VydmV5LlBhZ2U+b2JqKS5kYXRhO1xuICAgICAgICB2YXIgaW5kZXggPSBkYXRhLnBhZ2VzLmluZGV4T2YoPFN1cnZleS5QYWdlPm9iaik7XG4gICAgICAgIHJldHVybiBcIltQYWdlIFwiICsgKGluZGV4ICsgMSkgKyBcIl1cIjtcbiAgICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N1cnZleUhlbHBlci50cyIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge1N1cnZleU9iamVjdFByb3BlcnR5fSBmcm9tIFwiLi9vYmplY3RQcm9wZXJ0eVwiO1xyXG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0RWRpdG9yIHtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RWYWx1ZTogYW55O1xyXG4gICAgcHVibGljIHByb3BlcnR5RWRpdG9yT3B0aW9uczogYW55ID0gbnVsbDtcclxuICAgIHB1YmxpYyBrb1Byb3BlcnRpZXM6IGFueTtcclxuICAgIHB1YmxpYyBrb0FjdGl2ZVByb3BlcnR5OiBhbnk7XHJcbiAgICBwdWJsaWMga29IYXNPYmplY3Q6IGFueTtcclxuICAgIHB1YmxpYyBvblByb3BlcnR5VmFsdWVDaGFuZ2VkOiBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5T2JqZWN0RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5T2JqZWN0RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgcHVibGljIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcGVydHlFZGl0b3JPcHRpb25zOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKHByb3BlcnR5RWRpdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb0hhc09iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRPYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzZWxlY3RlZE9iamVjdCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMua29IYXNPYmplY3QodmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0T3B0aW9ucyhwcm9wZXJ0eUVkaXRvck9wdGlvbnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3JPcHRpb25zID0gcHJvcGVydHlFZGl0b3JPcHRpb25zO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFByb3BlcnR5RWRpdG9yKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5rb1Byb3BlcnRpZXMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gcHJvcGVydGllc1tpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2hhbmdlQWN0aXZlUHJvcGVydHkocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KHByb3BlcnR5KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBPYmplY3RDaGFuZ2VkKCkge1xyXG4gICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkT2JqZWN0IHx8ICF0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMoW10pO1xyXG4gICAgICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkobnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKHRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpKTtcclxuICAgICAgICBwcm9wZXJ0aWVzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgaWYgKGEubmFtZSA9PSBiLm5hbWUpIHJldHVybiAwO1xyXG4gICAgICAgICAgICBpZiAoYS5uYW1lID4gYi5uYW1lKSByZXR1cm4gMTtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBvYmplY3RQcm9wZXJ0aWVzID0gW107XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHZhciBwcm9wRXZlbnQgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHNlbGYub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgcHJvcGVydHk6IHByb3BlcnR5LnByb3BlcnR5LCBvYmplY3Q6IHByb3BlcnR5Lm9iamVjdCwgbmV3VmFsdWU6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYW5TaG93UHJvcGVydHkocHJvcGVydGllc1tpXSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydHkgPSBuZXcgU3VydmV5T2JqZWN0UHJvcGVydHkocHJvcGVydGllc1tpXSwgcHJvcEV2ZW50LCB0aGlzLnByb3BlcnR5RWRpdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHZhciBsb2NOYW1lID0gdGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKCkgKyAnXycgKyBwcm9wZXJ0aWVzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIG9iamVjdFByb3BlcnR5LmRpc3BsYXlOYW1lID0gZWRpdG9yTG9jYWxpemF0aW9uLmdldFByb3BlcnR5TmFtZShsb2NOYW1lKTtcclxuICAgICAgICAgICAgdmFyIHRpdGxlID0gZWRpdG9yTG9jYWxpemF0aW9uLmdldFByb3BlcnR5VGl0bGUobG9jTmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghdGl0bGUpIHRpdGxlID0gb2JqZWN0UHJvcGVydHkuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgIG9iamVjdFByb3BlcnR5LnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIG9iamVjdFByb3BlcnRpZXMucHVzaChvYmplY3RQcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzKG9iamVjdFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSh0aGlzLmdldFByb3BlcnR5RWRpdG9yKFwibmFtZVwiKSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY2FuU2hvd1Byb3BlcnR5KHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgIGlmIChuYW1lID09ICdxdWVzdGlvbnMnIHx8IG5hbWUgPT0gJ3BhZ2VzJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spIHJldHVybiB0aGlzLm9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2sodGhpcy5zZWxlY3RlZE9iamVjdCwgcHJvcGVydHkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKSB7XHJcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzW2ldLm9iamVjdCA9IHRoaXMuc2VsZWN0ZWRPYmplY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29iamVjdEVkaXRvci50cyIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlNb2RhbEVkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7XHJcbiAgICBwdWJsaWMgb2JqZWN0OiBhbnk7XHJcbiAgICBwdWJsaWMgdGl0bGU6IGFueTtcclxuICAgIHB1YmxpYyBvbkFwcGx5Q2xpY2s6IGFueTtcclxuICAgIHB1YmxpYyBvblJlc2V0Q2xpY2s6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgc2VsZi5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwbHkoKTsgfTtcclxuICAgICAgICBzZWxmLm9uUmVzZXRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5yZXNldCgpOyB9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldFRpdGxlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZSh2YWx1ZSk7IH1cclxuICAgIHB1YmxpYyBoYXNFcnJvcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHsgfVxyXG4gICAgcHJpdmF0ZSByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy52YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXRPYmplY3QodmFsdWU6IGFueSkgeyB0aGlzLm9iamVjdCA9IHZhbHVlOyB9XHJcbiAgICBwdWJsaWMgZ2V0IGlzRWRpdGFibGUoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgcHVibGljIGFwcGx5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0Vycm9yKCkpIHJldHVybjtcclxuICAgICAgICB0aGlzLm9uQmVmb3JlQXBwbHkoKTtcclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUZXh0RWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlNb2RhbEVkaXRvciB7XHJcbiAgICBwdWJsaWMga29WYWx1ZTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRleHRcIjsgfVxyXG4gICAgcHVibGljIGdldCBpc0VkaXRhYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldFZhbHVlVGV4dCh2YWx1ZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICB2YXIgc3RyID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAyMCkge1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIDIwKSArIFwiLi4uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlQXBwbHkoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZUNvcmUodGhpcy5rb1ZhbHVlKCkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlIdG1sRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlUZXh0RWRpdG9yIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiaHRtbFwiOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUV4cHJlc3Npb25FZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRleHRFZGl0b3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJleHByZXNzaW9uXCI7IH1cclxufVxyXG5cclxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidGV4dFwiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eVRleHRFZGl0b3IoKTsgfSk7XHJcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcImh0bWxcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlIdG1sRWRpdG9yKCk7IH0pO1xyXG5TdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJleHByZXNzaW9uXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5RXhwcmVzc2lvbkVkaXRvcigpOyB9KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eU1vZGFsRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlKU09ONX0gZnJvbSBcIi4vanNvbjVcIjtcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XG5cbmNsYXNzIFRleHRQYXJzZXJQcm9wZXJ5IHtcbiAgICBpc0ZvdW5kOiBib29sZWFuO1xuICAgIHByb3BlcnRpZXNDb3VudDogbnVtYmVyO1xuICAgIHN0YXJ0OiBudW1iZXI7XG4gICAgZW5kOiBudW1iZXI7XG4gICAgdmFsdWVTdGFydDogbnVtYmVyO1xuICAgIHZhbHVlRW5kOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTdXJ2ZXlUZXh0V29ya2VyIHtcbiAgICBwdWJsaWMgc3RhdGljIG5ld0xpbmVDaGFyOiBzdHJpbmc7XG4gICAgcHVibGljIGVycm9yczogQXJyYXk8YW55PjtcbiAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xuICAgIHByaXZhdGUganNvblZhbHVlOiBhbnk7XG4gICAgcHJpdmF0ZSBzdXJ2ZXlPYmplY3RzOiBBcnJheTxhbnk+O1xuICAgIHByaXZhdGUgaXNTdXJ2ZXlBc1BhZ2U6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIGlmICghdGhpcy50ZXh0IHx8IHRoaXMudGV4dC50cmltKCkgPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gXCJ7fVwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgICAgIHRoaXMucHJvY2VzcygpO1xuICAgIH1cbiAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cbiAgICBwdWJsaWMgZ2V0IGlzSnNvbkNvcnJlY3QoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlICE9IG51bGw7IH1cbiAgICBwcm90ZWN0ZWQgcHJvY2VzcygpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuanNvblZhbHVlID0gbmV3IFN1cnZleUpTT041KDEpLnBhcnNlKHRoaXMudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmpzb25WYWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnModGhpcy5qc29uVmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkuU3VydmV5KHRoaXMuanNvblZhbHVlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9yc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7IHBvczogeyBzdGFydDogZXJyb3IuYXQsIGVuZDogLTEgfSwgdGV4dDogZXJyb3IuZ2V0RnVsbERlc2NyaXB0aW9uKCkgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cyA9IHRoaXMuY3JlYXRlU3VydmV5T2JqZWN0cygpO1xuICAgICAgICB0aGlzLnNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KHRoaXMuc3VydmV5T2JqZWN0cyk7XG4gICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5lcnJvcnMpO1xuICAgIH1cbiAgICBwcml2YXRlIHVwZGF0ZUpzb25Qb3NpdGlvbnMoanNvbk9iajogYW55KSB7XG4gICAgICAgIGpzb25PYmpbXCJwb3NcIl1bXCJzZWxmXCJdID0ganNvbk9iajtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBqc29uT2JqW2tleV07XG4gICAgICAgICAgICBpZiAob2JqICYmIG9ialtcInBvc1wiXSkge1xuICAgICAgICAgICAgICAgIGpzb25PYmpbXCJwb3NcIl1ba2V5XSA9IG9ialtcInBvc1wiXTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnMob2JqKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVN1cnZleU9iamVjdHMoKTogQXJyYXk8YW55PiB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgdGhpcy5pc1N1cnZleUFzUGFnZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUucGFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXTtcbiAgICAgICAgICAgIGlmIChpID09IDAgJiYgIXBhZ2VbXCJwb3NcIl0pIHtcbiAgICAgICAgICAgICAgICBwYWdlW1wicG9zXCJdID0gdGhpcy5zdXJ2ZXlWYWx1ZVtcInBvc1wiXTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhZ2UpO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhZ2UucXVlc3Rpb25zW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBwcml2YXRlIHNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KG9iamVjdHM6IGFueVtdKSB7XG4gICAgICAgIGlmIChvYmplY3RzID09IG51bGwgfHwgb2JqZWN0cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSB7IHJvdzogMCwgY29sdW1uOiAwIH07XG4gICAgICAgIHZhciBhdE9iamVjdHNBcnJheSA9IHRoaXMuZ2V0QXRBcnJheShvYmplY3RzKTtcbiAgICAgICAgdmFyIHN0YXJ0QXQ6IG51bWJlciA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXRPYmplY3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBhdCA9IGF0T2JqZWN0c0FycmF5W2ldLmF0O1xuICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLmdldFBvc3Rpb25CeUNoYXJ0QXQocG9zaXRpb24sIHN0YXJ0QXQsIGF0KTtcbiAgICAgICAgICAgIHZhciBvYmogPSBhdE9iamVjdHNBcnJheVtpXS5vYmo7XG4gICAgICAgICAgICBpZiAoIW9iai5wb3NpdGlvbikgb2JqLnBvc2l0aW9uID0ge307XG4gICAgICAgICAgICBpZiAoYXQgPT0gb2JqLnBvcy5zdGFydCkge1xuICAgICAgICAgICAgICAgIG9iai5wb3NpdGlvbi5zdGFydCA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXQgPT0gb2JqLnBvcy5lbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLmVuZCA9IHBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXJ0QXQgPSBhdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGdldFBvc3Rpb25CeUNoYXJ0QXQoc3RhcnRQb3NpdGlvbjogYW55LCBzdGFydEF0OiBudW1iZXIsIGF0OiBudW1iZXIpOiBhbnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0geyByb3c6IHN0YXJ0UG9zaXRpb24ucm93LCBjb2x1bW46IHN0YXJ0UG9zaXRpb24uY29sdW1uIH07XG4gICAgICAgIHZhciBjdXJDaGFyID0gc3RhcnRBdDtcbiAgICAgICAgd2hpbGUgKGN1ckNoYXIgPCBhdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudGV4dC5jaGFyQXQoY3VyQ2hhcikgPT0gU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhcikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5yb3crKztcbiAgICAgICAgICAgICAgICByZXN1bHQuY29sdW1uID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyQ2hhcisrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0QXRBcnJheShvYmplY3RzOiBhbnlbXSk6IGFueVtdIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBvYmogPSBvYmplY3RzW2ldO1xuICAgICAgICAgICAgdmFyIHBvcyA9IG9iai5wb3M7XG4gICAgICAgICAgICBpZiAoIXBvcykgY29udGludWU7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh7IGF0OiBwb3Muc3RhcnQsIG9iajogb2JqIH0pO1xuICAgICAgICAgICAgaWYgKHBvcy5lbmQgPiAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLmVuZCwgb2JqOiBvYmogfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KChlbDEsIGVsMikgPT4ge1xuICAgICAgICAgICAgaWYgKGVsMS5hdCA+IGVsMi5hdCkgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoZWwxLmF0IDwgZWwyLmF0KSByZXR1cm4gLTE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy90ZXh0V29ya2VyLnRzIiwiLy8gVGhpcyBmaWxlIGlzIGJhc2VkIG9uIEpTT041LCBodHRwOi8vanNvbjUub3JnL1xuLy8gVGhlIG1vZGlmaWNhdGlvbiBmb3IgZ2V0dGluZyBvYmplY3QgYW5kIHByb3BlcnRpZXMgbG9jYXRpb24gJ2F0JyB3ZXJlIG1hZGVuLlxuXG5leHBvcnQgY2xhc3MgU3VydmV5SlNPTjUge1xuICAgIHB1YmxpYyBzdGF0aWMgcG9zaXRpb25OYW1lID0gXCJwb3NcIjtcbiAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGVlID0ge1xuICAgICAgICBcIidcIjogXCInXCIsXG4gICAgICAgICdcIic6ICdcIicsXG4gICAgICAgICdcXFxcJzogJ1xcXFwnLFxuICAgICAgICAnLyc6ICcvJyxcbiAgICAgICAgJ1xcbic6ICcnLCAgICAgICAvLyBSZXBsYWNlIGVzY2FwZWQgbmV3bGluZXMgaW4gc3RyaW5ncyB3LyBlbXB0eSBzdHJpbmdcbiAgICAgICAgYjogJ1xcYicsXG4gICAgICAgIGY6ICdcXGYnLFxuICAgICAgICBuOiAnXFxuJyxcbiAgICAgICAgcjogJ1xccicsXG4gICAgICAgIHQ6ICdcXHQnXG4gICAgfTtcbiAgICBwcml2YXRlIHN0YXRpYyB3cyA9IFtcbiAgICAgICAgJyAnLFxuICAgICAgICAnXFx0JyxcbiAgICAgICAgJ1xccicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnXFx2JyxcbiAgICAgICAgJ1xcZicsXG4gICAgICAgICdcXHhBMCcsXG4gICAgICAgICdcXHVGRUZGJ1xuICAgIF07XG4gICAgcHJpdmF0ZSBlbmRBdDogbnVtYmVyO1xuICAgIHByaXZhdGUgYXQ6IG51bWJlcjsgICAgIC8vIFRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBjaGFyYWN0ZXJcbiAgICBwcml2YXRlIGNoOiBhbnk7ICAgICAvLyBUaGUgY3VycmVudCBjaGFyYWN0ZXJcbiAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcbiAgICBwcml2YXRlIHBhcnNlVHlwZTogbnVtYmVyOyAvLyAwIC0gc3RhZGFyZCwgMSAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBvYmplY3RzLCAyIC0gZ2V0IGluZm9ybWF0aW9uIGFib3V0IGFsbCBwcm9wZXJ0aWVzXG4gICAgY29uc3RydWN0b3IocGFyc2VUeXBlOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHRoaXMucGFyc2VUeXBlID0gcGFyc2VUeXBlO1xuICAgIH1cbiAgICBwdWJsaWMgcGFyc2Uoc291cmNlOiBhbnksIHJldml2ZXI6IGFueSA9IG51bGwsIHN0YXJ0RnJvbTogbnVtYmVyID0gMCwgZW5kQXQ6IG51bWJlciA9IC0xKTogYW55IHtcbiAgICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgICB0aGlzLnRleHQgPSBTdHJpbmcoc291cmNlKTtcbiAgICAgICAgdGhpcy5hdCA9IHN0YXJ0RnJvbTtcbiAgICAgICAgdGhpcy5lbmRBdCA9IGVuZEF0O1xuICAgICAgICB0aGlzLmNoID0gJyAnO1xuICAgICAgICByZXN1bHQgPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgaWYgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJTeW50YXggZXJyb3JcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsXG4gICAgICAgIC8vIHBhc3NpbmcgZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gdGhlIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlXG4gICAgICAgIC8vIHRyYW5zZm9ybWF0aW9uLCBzdGFydGluZyB3aXRoIGEgdGVtcG9yYXJ5IHJvb3Qgb2JqZWN0IHRoYXQgaG9sZHMgdGhlIHJlc3VsdFxuICAgICAgICAvLyBpbiBhbiBlbXB0eSBrZXkuIElmIHRoZXJlIGlzIG5vdCBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHNpbXBseSByZXR1cm4gdGhlXG4gICAgICAgIC8vIHJlc3VsdC5cblxuICAgICAgICByZXR1cm4gdHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicgPyAoZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuICAgICAgICAgICAgdmFyIGssIHYsIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsdWUsIGspO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9ICh7ICcnOiByZXN1bHQgfSwgJycpKSA6IHJlc3VsdDtcbiAgICB9XG4gICAgcHJpdmF0ZSBlcnJvcihtOiBzdHJpbmcpIHtcbiAgICAgICAgLy8gQ2FsbCBlcnJvciB3aGVuIHNvbWV0aGluZyBpcyB3cm9uZy5cbiAgICAgICAgdmFyIGVycm9yID0gbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtO1xuICAgICAgICBlcnJvcltcImF0XCJdID0gdGhpcy5hdDtcbiAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICAgIHByaXZhdGUgbmV4dChjOiBhbnkgPSBudWxsKSB7XG4gICAgICAgIC8vIElmIGEgYyBwYXJhbWV0ZXIgaXMgcHJvdmlkZWQsIHZlcmlmeSB0aGF0IGl0IG1hdGNoZXMgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAgICBpZiAoYyAmJiBjICE9PSB0aGlzLmNoKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgJ1wiICsgYyArIFwiJyBpbnN0ZWFkIG9mICdcIiArIHRoaXMuY2ggKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSB0aGlzLm5leHQgY2hhcmFjdGVyLiBXaGVuIHRoZXJlIGFyZSBubyBtb3JlIGNoYXJhY3RlcnMsXG4gICAgICAgIC8vIHJldHVybiB0aGUgZW1wdHkgc3RyaW5nLlxuICAgICAgICB0aGlzLmNoID0gdGhpcy5jaGFydEF0KCk7XG4gICAgICAgIHRoaXMuYXQgKz0gMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2g7XG4gICAgfVxuICAgIHByaXZhdGUgcGVlaygpIHtcbiAgICAgICAgLy8gR2V0IHRoZSB0aGlzLm5leHQgY2hhcmFjdGVyIHdpdGhvdXQgY29uc3VtaW5nIGl0IG9yXG4gICAgICAgIC8vIGFzc2lnbmluZyBpdCB0byB0aGUgdGhpcy5jaCB2YXJhaWJsZS5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnRBdCgpO1xuICAgIH1cbiAgICBwcml2YXRlIGNoYXJ0QXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmVuZEF0ID4gLTEgJiYgdGhpcy5hdCA+PSB0aGlzLmVuZEF0KSByZXR1cm4gJyc7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQuY2hhckF0KHRoaXMuYXQpO1xuICAgIH1cbiAgICBwcml2YXRlIGlkZW50aWZpZXIoKSB7XG4gICAgICAgIC8vIFBhcnNlIGFuIGlkZW50aWZpZXIuIE5vcm1hbGx5LCByZXNlcnZlZCB3b3JkcyBhcmUgZGlzYWxsb3dlZCBoZXJlLCBidXQgd2VcbiAgICAgICAgLy8gb25seSB1c2UgdGhpcyBmb3IgdW5xdW90ZWQgb2JqZWN0IGtleXMsIHdoZXJlIHJlc2VydmVkIHdvcmRzIGFyZSBhbGxvd2VkLFxuICAgICAgICAvLyBzbyB3ZSBkb24ndCBjaGVjayBmb3IgdGhvc2UgaGVyZS4gUmVmZXJlbmNlczpcbiAgICAgICAgLy8gLSBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g3LjZcbiAgICAgICAgLy8gLSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X0d1aWRlL0NvcmVfTGFuZ3VhZ2VfRmVhdHVyZXMjVmFyaWFibGVzXG4gICAgICAgIC8vIC0gaHR0cDovL2RvY3N0b3JlLm1pay51YS9vcmVsbHkvd2VicHJvZy9qc2NyaXB0L2NoMDJfMDcuaHRtXG4gICAgICAgIC8vIFRPRE8gSWRlbnRpZmllcnMgY2FuIGhhdmUgVW5pY29kZSBcImxldHRlcnNcIiBpbiB0aGVtOyBhZGQgc3VwcG9ydCBmb3IgdGhvc2UuXG4gICAgICAgIHZhciBrZXkgPSB0aGlzLmNoO1xuXG4gICAgICAgIC8vIElkZW50aWZpZXJzIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgXyBvciAkLlxuICAgICAgICBpZiAoKHRoaXMuY2ggIT09ICdfJyAmJiB0aGlzLmNoICE9PSAnJCcpICYmXG4gICAgICAgICAgICAodGhpcy5jaCA8ICdhJyB8fCB0aGlzLmNoID4gJ3onKSAmJlxuICAgICAgICAgICAgKHRoaXMuY2ggPCAnQScgfHwgdGhpcy5jaCA+ICdaJykpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgaWRlbnRpZmllclwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnNlcXVlbnQgY2hhcmFjdGVycyBjYW4gY29udGFpbiBkaWdpdHMuXG4gICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSAmJiAoXG4gICAgICAgIHRoaXMuY2ggPT09ICdfJyB8fCB0aGlzLmNoID09PSAnJCcgfHxcbiAgICAgICAgKHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ3onKSB8fFxuICAgICAgICAodGhpcy5jaCA+PSAnQScgJiYgdGhpcy5jaCA8PSAnWicpIHx8XG4gICAgICAgICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JykpKSB7XG4gICAgICAgICAgICBrZXkgKz0gdGhpcy5jaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHByaXZhdGUgbnVtYmVyKCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGEgbnVtYmVyIHZhbHVlLlxuXG4gICAgICAgIHZhciBudW1iZXIsXG4gICAgICAgICAgICBzaWduID0gJycsXG4gICAgICAgICAgICBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgIGJhc2UgPSAxMDtcblxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xuICAgICAgICAgICAgc2lnbiA9IHRoaXMuY2g7XG4gICAgICAgICAgICB0aGlzLm5leHQodGhpcy5jaCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBJbmZpbml0eSAoY291bGQgdHdlYWsgdG8gYWxsb3cgb3RoZXIgd29yZHMpOlxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ0knKSB7XG4gICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbnVtYmVyICE9PSAnbnVtYmVyJyB8fCBpc05hTihudW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB3b3JkIGZvciBudW1iZXInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoc2lnbiA9PT0gJy0nKSA/IC1udW1iZXIgOiBudW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBOYU5cbiAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdOJykge1xuICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdleHBlY3RlZCB3b3JkIHRvIGJlIE5hTicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWdub3JlIHNpZ24gYXMgLU5hTiBhbHNvIGlzIE5hTlxuICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnMCcpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3gnIHx8IHRoaXMuY2ggPT09ICdYJykge1xuICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGJhc2UgPSAxNjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdPY3RhbCBsaXRlcmFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGJhc2UpIHtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcuJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gJy4nO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkgJiYgdGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnZScgfHwgdGhpcy5jaCA9PT0gJ0UnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICctJyB8fCB0aGlzLmNoID09PSAnKycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScgfHwgdGhpcy5jaCA+PSAnQScgJiYgdGhpcy5jaCA8PSAnRicgfHwgdGhpcy5jaCA+PSAnYScgJiYgdGhpcy5jaCA8PSAnZicpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaWduID09PSAnLScpIHtcbiAgICAgICAgICAgIG51bWJlciA9IC1zdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBudW1iZXIgPSArc3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG51bWJlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBzdHJpbmcoKSB7XG5cbiAgICAgICAgLy8gUGFyc2UgYSBzdHJpbmcgdmFsdWUuXG5cbiAgICAgICAgdmFyIGhleCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBzdHJpbmcgPSAnJyxcbiAgICAgICAgICAgIGRlbGltLCAgICAgIC8vIGRvdWJsZSBxdW90ZSBvciBzaW5nbGUgcXVvdGVcbiAgICAgICAgICAgIHVmZmZmO1xuXG4gICAgICAgIC8vIFdoZW4gcGFyc2luZyBmb3Igc3RyaW5nIHZhbHVlcywgd2UgbXVzdCBsb29rIGZvciAnIG9yIFwiIGFuZCBcXCBjaGFyYWN0ZXJzLlxuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnXCInIHx8IHRoaXMuY2ggPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICBkZWxpbSA9IHRoaXMuY2g7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gZGVsaW0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxcXCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAndScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVmZmZmID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA0OyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZXggPSBwYXJzZUludCh0aGlzLm5leHQoKSwgMTYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoaGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWZmZmYgPSB1ZmZmZiAqIDE2ICsgaGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodWZmZmYpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXHInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZWVrKCkgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gU3VydmV5SlNPTjUuZXNjYXBlZVt0aGlzLmNoXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAvLyB1bmVzY2FwZWQgbmV3bGluZXMgYXJlIGludmFsaWQ7IHNlZTpcbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FzZWVtay9qc29uNS9pc3N1ZXMvMjRcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB0aGlzIGZlZWxzIHNwZWNpYWwtY2FzZWQ7IGFyZSB0aGVyZSBvdGhlclxuICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIHVuZXNjYXBlZCBjaGFycz9cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgc3RyaW5nXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGlubGluZUNvbW1lbnQoKSB7XG5cbiAgICAgICAgLy8gU2tpcCBhbiBpbmxpbmUgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGRcbiAgICAgICAgLy8gYmUgdGhlIHNlY29uZCAvIGNoYXJhY3RlciBpbiB0aGUgLy8gcGFpciB0aGF0IGJlZ2lucyB0aGlzIGlubGluZSBjb21tZW50LlxuICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGlubGluZSBjb21tZW50LCB3ZSBsb29rIGZvciBhIG5ld2xpbmUgb3IgdGhlIGVuZCBvZiB0aGUgdGV4dC5cblxuICAgICAgICBpZiAodGhpcy5jaCAhPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGFuIGlubGluZSBjb21tZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1xcbicgfHwgdGhpcy5jaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKHRoaXMuY2gpO1xuICAgIH1cbiAgICBwcml2YXRlIGJsb2NrQ29tbWVudCgpIHtcblxuICAgICAgICAvLyBTa2lwIGEgYmxvY2sgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGQgYmVcbiAgICAgICAgLy8gdGhlICogY2hhcmFjdGVyIGluIHRoZSAvKiBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgYmxvY2sgY29tbWVudC5cbiAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBibG9jayBjb21tZW50LCB3ZSBsb29rIGZvciBhbiBlbmRpbmcgKi8gcGFpciBvZiBjaGFyYWN0ZXJzLFxuICAgICAgICAvLyBidXQgd2UgYWxzbyB3YXRjaCBmb3IgdGhlIGVuZCBvZiB0ZXh0IGJlZm9yZSB0aGUgY29tbWVudCBpcyB0ZXJtaW5hdGVkLlxuXG4gICAgICAgIGlmICh0aGlzLmNoICE9PSAnKicpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYSBibG9jayBjb21tZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA9PT0gJyonKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcqJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJy8nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAodGhpcy5jaCk7XG5cbiAgICAgICAgdGhpcy5lcnJvcihcIlVudGVybWluYXRlZCBibG9jayBjb21tZW50XCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGNvbW1lbnQoKSB7XG5cbiAgICAgICAgLy8gU2tpcCBhIGNvbW1lbnQsIHdoZXRoZXIgaW5saW5lIG9yIGJsb2NrLWxldmVsLCBhc3N1bWluZyB0aGlzIGlzIG9uZS5cbiAgICAgICAgLy8gQ29tbWVudHMgYWx3YXlzIGJlZ2luIHdpdGggYSAvIGNoYXJhY3Rlci5cblxuICAgICAgICBpZiAodGhpcy5jaCAhPT0gJy8nKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGEgY29tbWVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmV4dCgnLycpO1xuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcbiAgICAgICAgICAgIHRoaXMuaW5saW5lQ29tbWVudCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICcqJykge1xuICAgICAgICAgICAgdGhpcy5ibG9ja0NvbW1lbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJVbnJlY29nbml6ZWQgY29tbWVudFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHdoaXRlKCkge1xuXG4gICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhbmQgY29tbWVudHMuXG4gICAgICAgIC8vIE5vdGUgdGhhdCB3ZSdyZSBkZXRlY3RpbmcgY29tbWVudHMgYnkgb25seSBhIHNpbmdsZSAvIGNoYXJhY3Rlci5cbiAgICAgICAgLy8gVGhpcyB3b3JrcyBzaW5jZSByZWd1bGFyIGV4cHJlc3Npb25zIGFyZSBub3QgdmFsaWQgSlNPTig1KSwgYnV0IHRoaXMgd2lsbFxuICAgICAgICAvLyBicmVhayBpZiB0aGVyZSBhcmUgb3RoZXIgdmFsaWQgdmFsdWVzIHRoYXQgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyIVxuXG4gICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFN1cnZleUpTT041LndzLmluZGV4T2YodGhpcy5jaCkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSB3b3JkKCk6IGFueSB7XG5cbiAgICAgICAgLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwuXG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XG4gICAgICAgICAgICBjYXNlICd0JzpcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3QnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3InKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3UnKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnYScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgncycpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZScpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndScpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgY2FzZSAnSSc6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdJJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdmJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd0Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd5Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICAgICAgY2FzZSAnTic6XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdOJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdhJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdOJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCAnXCIgKyB0aGlzLmNoICsgXCInXCIpO1xuICAgIH1cbiAgICBwcml2YXRlIGFycmF5KCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGFuIGFycmF5IHZhbHVlLlxuXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuXG4gICAgICAgIGlmICh0aGlzLmNoID09PSAnWycpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgnWycpO1xuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ10nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgYXJyYXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gRVM1IGFsbG93cyBvbWl0dGluZyBlbGVtZW50cyBpbiBhcnJheXMsIGUuZy4gWyxdIGFuZFxuICAgICAgICAgICAgICAgIC8vIFssbnVsbF0uIFdlIGRvbid0IGFsbG93IHRoaXMgaW4gSlNPTjUuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTWlzc2luZyBhcnJheSBlbGVtZW50XCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy52YWx1ZSgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyB2YWx1ZSwgdGhpcyBuZWVkcyB0b1xuICAgICAgICAgICAgICAgIC8vIGJlIHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCddJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcsJyk7XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgYXJyYXlcIik7XG4gICAgfVxuICAgIHByaXZhdGUgb2JqZWN0KCkge1xuXG4gICAgICAgIC8vIFBhcnNlIGFuIG9iamVjdCB2YWx1ZS5cblxuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSB0cnVlLFxuICAgICAgICAgICAgb2JqZWN0ID0ge307XG4gICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcbiAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdID0geyBzdGFydDogdGhpcy5hdCAtIDEgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3snKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoJ3snKTtcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0uZW5kID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd9Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gS2V5cyBjYW4gYmUgdW5xdW90ZWQuIElmIHRoZXkgYXJlLCB0aGV5IG5lZWQgdG8gYmVcbiAgICAgICAgICAgICAgICAvLyB2YWxpZCBKUyBpZGVudGlmaWVycy5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLnN0cmluZygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0gPSB7IHN0YXJ0OiBzdGFydCwgdmFsdWVTdGFydDogdGhpcy5hdCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJzonKTtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMudmFsdWUoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyBwYWlyLCB0aGlzIG5lZWRzIHRvIGJlXG4gICAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZC0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSB0aGlzLmF0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kLS07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdFByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG9iamVjdFwiKTtcbiAgICB9XG4gICAgcHJpdmF0ZSB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgIC8vIFBhcnNlIGEgSlNPTiB2YWx1ZS4gSXQgY291bGQgYmUgYW4gb2JqZWN0LCBhbiBhcnJheSwgYSBzdHJpbmcsIGEgbnVtYmVyLFxuICAgICAgICAvLyBvciBhIHdvcmQuXG5cbiAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuY2gpIHtcbiAgICAgICAgICAgIGNhc2UgJ3snOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xuICAgICAgICAgICAgY2FzZSAnWyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcbiAgICAgICAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgICAgIGNhc2UgXCInXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nKCk7XG4gICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JyA/IHRoaXMubnVtYmVyKCkgOiB0aGlzLndvcmQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgcmVwbGFjZXI6IGFueTtcbiAgICBwcml2YXRlIGluZGVudFN0cjogc3RyaW5nO1xuICAgIHByaXZhdGUgb2JqU3RhY2s7XG5cbiAgICBwdWJsaWMgc3RyaW5naWZ5KG9iajogYW55LCByZXBsYWNlcjogYW55ID0gbnVsbCwgc3BhY2U6IGFueSA9IG51bGwpIHtcbiAgICAgICAgaWYgKHJlcGxhY2VyICYmICh0eXBlb2YgKHJlcGxhY2VyKSAhPT0gXCJmdW5jdGlvblwiICYmICF0aGlzLmlzQXJyYXkocmVwbGFjZXIpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXBsYWNlciBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXknKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgICAgIHRoaXMuaW5kZW50U3RyID0gdGhpcy5nZXRJbmRlbnQoc3BhY2UpO1xuICAgICAgICB0aGlzLm9ialN0YWNrID0gW107XG4gICAgICAgIC8vIHNwZWNpYWwgY2FzZS4uLndoZW4gdW5kZWZpbmVkIGlzIHVzZWQgaW5zaWRlIG9mXG4gICAgICAgIC8vIGEgY29tcG91bmQgb2JqZWN0L2FycmF5LCByZXR1cm4gbnVsbC5cbiAgICAgICAgLy8gYnV0IHdoZW4gdG9wLWxldmVsLCByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIHZhciB0b3BMZXZlbEhvbGRlciA9IHsgXCJcIjogb2JqIH07XG4gICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKHRvcExldmVsSG9sZGVyLCAnJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRJbmRlbnQoc3BhY2U6IGFueSk6IHN0cmluZyB7XG4gICAgICAgIGlmIChzcGFjZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzcGFjZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSBcIm51bWJlclwiICYmIHNwYWNlID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYWtlSW5kZW50KFwiIFwiLCBzcGFjZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHByaXZhdGUgZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xuICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSB3aXRoIGl0cyB0b0pTT04gdmFsdWUgZmlyc3QsIGlmIHBvc3NpYmxlXG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS50b0pTT04gJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHVzZXItc3VwcGxpZWQgcmVwbGFjZXIgaWYgYSBmdW5jdGlvbiwgY2FsbCBpdC4gSWYgaXQncyBhbiBhcnJheSwgY2hlY2sgb2JqZWN0cycgc3RyaW5nIGtleXMgZm9yXG4gICAgICAgIC8vIHByZXNlbmNlIGluIHRoZSBhcnJheSAocmVtb3ZpbmcgdGhlIGtleS92YWx1ZSBwYWlyIGZyb20gdGhlIHJlc3VsdGluZyBKU09OIGlmIHRoZSBrZXkgaXMgbWlzc2luZykuXG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMucmVwbGFjZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlcGxhY2VyKSB7XG4gICAgICAgICAgICBpZiAoaXNUb3BMZXZlbCB8fCB0aGlzLmlzQXJyYXkoaG9sZGVyKSB8fCB0aGlzLnJlcGxhY2VyLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc1dvcmRDaGFyKGNoYXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGNoYXIgPj0gJ2EnICYmIGNoYXIgPD0gJ3onKSB8fFxuICAgICAgICAgICAgKGNoYXIgPj0gJ0EnICYmIGNoYXIgPD0gJ1onKSB8fFxuICAgICAgICAgICAgKGNoYXIgPj0gJzAnICYmIGNoYXIgPD0gJzknKSB8fFxuICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzV29yZFN0YXJ0KGNoYXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGNoYXIgPj0gJ2EnICYmIGNoYXIgPD0gJ3onKSB8fFxuICAgICAgICAgICAgKGNoYXIgPj0gJ0EnICYmIGNoYXIgPD0gJ1onKSB8fFxuICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzV29yZChrZXk6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNXb3JkU3RhcnQoa2V5WzBdKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gMSwgbGVuZ3RoID0ga2V5Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1dvcmRDaGFyKGtleVtpXSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIHBvbHlmaWxsc1xuICAgIHByaXZhdGUgaXNBcnJheShvYmo6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaXNEYXRlKG9iajogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNOYU4odmFsOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmIHZhbCAhPT0gdmFsO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tGb3JDaXJjdWxhcihvYmo6IGFueSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub2JqU3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9ialN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG1ha2VJbmRlbnQoc3RyOiBzdHJpbmcsIG51bTogbnVtYmVyLCBub05ld0xpbmU6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaW5kZW50YXRpb24gbm8gbW9yZSB0aGFuIDEwIGNoYXJzXG4gICAgICAgIGlmIChzdHIubGVuZ3RoID4gMTApIHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZGVudCA9IG5vTmV3TGluZSA/IFwiXCIgOiBcIlxcblwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgICAgICBpbmRlbnQgKz0gc3RyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGVudDtcbiAgICB9XG5cbiAgICAvLyBDb3BpZWQgZnJvbSBDcm9rZm9yZCdzIGltcGxlbWVudGF0aW9uIG9mIEpTT05cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2RvdWdsYXNjcm9ja2ZvcmQvSlNPTi1qcy9ibG9iL2UzOWRiNGI3ZTYyNDlmMDRhMTk1ZTdkZDA4NDBlNjEwY2M5ZTk0MWUvanNvbjIuanMjTDE5NVxuICAgIC8vIEJlZ2luXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcbiAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuICAgIHByaXZhdGUgc3RhdGljIG1ldGEgPSB7IC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICdcXGInOiAnXFxcXGInLFxuICAgICAgICAnXFx0JzogJ1xcXFx0JyxcbiAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICdcXGYnOiAnXFxcXGYnLFxuICAgICAgICAnXFxyJzogJ1xcXFxyJyxcbiAgICAgICAgJ1wiJzogJ1xcXFxcIicsXG4gICAgICAgICdcXFxcJzogJ1xcXFxcXFxcJ1xuICAgIH07XG4gICAgcHJpdmF0ZSBlc2NhcGVTdHJpbmcoc3RyOiBzdHJpbmcpIHtcblxuICAgICAgICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXG4gICAgICAgIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4gICAgICAgIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAgICAgICAvLyBzZXF1ZW5jZXMuXG4gICAgICAgIFN1cnZleUpTT041LmVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gU3VydmV5SlNPTjUuZXNjYXBhYmxlLnRlc3Qoc3RyKSA/ICdcIicgKyBzdHIucmVwbGFjZShTdXJ2ZXlKU09ONS5lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICB2YXIgYyA9IFN1cnZleUpTT041Lm1ldGFbYV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICAgICAgICBjIDpcbiAgICAgICAgICAgICdcXFxcdScgKyAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xuICAgICAgICB9KSArICdcIicgOiAnXCInICsgc3RyICsgJ1wiJztcbiAgICB9XG4gICAgLy8gRW5kXG5cbiAgICBwcml2YXRlIGludGVybmFsU3RyaW5naWZ5KGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xuICAgICAgICB2YXIgYnVmZmVyLCByZXM7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUsIGlmIG5lY2Vzc2FyeVxuICAgICAgICB2YXIgb2JqX3BhcnQgPSB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXIsIGtleSwgaXNUb3BMZXZlbCk7XG5cbiAgICAgICAgaWYgKG9ial9wYXJ0ICYmICF0aGlzLmlzRGF0ZShvYmpfcGFydCkpIHtcbiAgICAgICAgICAgIC8vIHVuYm94IG9iamVjdHNcbiAgICAgICAgICAgIC8vIGRvbid0IHVuYm94IGRhdGVzLCBzaW5jZSB3aWxsIHR1cm4gaXQgaW50byBudW1iZXJcbiAgICAgICAgICAgIG9ial9wYXJ0ID0gb2JqX3BhcnQudmFsdWVPZigpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodHlwZW9mIG9ial9wYXJ0KSB7XG4gICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgaWYgKGlzTmFOKG9ial9wYXJ0KSB8fCAhaXNGaW5pdGUob2JqX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lc2NhcGVTdHJpbmcob2JqX3BhcnQudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FycmF5KG9ial9wYXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQ2lyY3VsYXIob2JqX3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIltcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ial9wYXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzID09PSBudWxsIHx8IHR5cGVvZiByZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IG9ial9wYXJ0Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCIsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5kZW50U3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgsIHRydWUpICsgXCJdXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckNpcmN1bGFyKG9ial9wYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gXCJ7XCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBub25FbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnB1c2gob2JqX3BhcnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9ial9wYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBwcm9wLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUb3BMZXZlbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub25FbXB0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wS2V5ID0gdGhpcy5pc1dvcmQocHJvcCkgPyBwcm9wIDogdGhpcy5lc2NhcGVTdHJpbmcocHJvcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBwcm9wS2V5ICsgXCI6XCIgKyAodGhpcy5pbmRlbnRTdHIgPyAnICcgOiAnJykgKyB2YWx1ZSArIFwiLFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9uRW1wdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCwgYnVmZmVyLmxlbmd0aCAtIDEpICsgdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCkgKyBcIn1cIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9ICd7fSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gZnVuY3Rpb25zIGFuZCB1bmRlZmluZWQgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qc29uNS50cyIsImltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRHJhZ0Ryb3BIZWxwZXIge1xyXG4gICAgc3RhdGljIGRhdGFTdGFydDogc3RyaW5nID0gXCJzdXJ2ZXlqcyxcIjtcclxuICAgIHN0YXRpYyBkcmFnRGF0YTogYW55ID0ge3RleHQ6IFwiXCIsIGpzb246IG51bGwgfTtcclxuICAgIHN0YXRpYyBwcmV2RXZlbnQgPSB7IHF1ZXN0aW9uOiBudWxsLCB4OiAtMSwgeTogLTEgfTtcclxuICAgIHByaXZhdGUgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnk7XHJcbiAgICBwcml2YXRlIHNjcm9sbGFibGVFbGVtZW50OiBIVE1MRWxlbWVudCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNvdXJjZUluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhOiBTdXJ2ZXkuSVN1cnZleSwgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnksIHNjcm9sbGFibGVFbE5hbWU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjayA9IG9uTW9kaWZpZWRDYWxsYmFjaztcclxuICAgICAgICB0aGlzLnNjcm9sbGFibGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoKHNjcm9sbGFibGVFbE5hbWUgPyBzY3JvbGxhYmxlRWxOYW1lIDogXCJzY3JvbGxhYmxlRGl2XCIpKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gPFN1cnZleS5TdXJ2ZXk+dGhpcy5kYXRhOyB9XHJcbiAgICBwdWJsaWMgc3RhcnREcmFnTmV3UXVlc3Rpb24oZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwYXJlRGF0YShldmVudCwgcXVlc3Rpb25UeXBlLCBxdWVzdGlvbk5hbWUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXJ0RHJhZ1F1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5wcmVwYXJlRGF0YShldmVudCwgbnVsbCwgcXVlc3Rpb25OYW1lKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzdGFydERyYWdDb3BpZWRRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbk5hbWU6IHN0cmluZywgcXVlc3Rpb25Kc29uOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnByZXBhcmVEYXRhKGV2ZW50LCBudWxsLCBxdWVzdGlvbk5hbWUsIHF1ZXN0aW9uSnNvbik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaXNTdXJ2ZXlEcmFnZ2luZyhldmVudDogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKGV2ZW50KS50ZXh0O1xyXG4gICAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuaW5kZXhPZihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQpID09IDA7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZG9EcmFnRHJvcE92ZXIoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tTY3JvbGxZKGV2ZW50KTtcclxuICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YS50YXJnZXRRdWVzdGlvbjtcclxuICAgICAgICBpZiAoIXF1ZXN0aW9uIHx8IHF1ZXN0aW9uID09IHRhcmdldFF1ZXN0aW9uIHx8ICF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpIHx8IHRoaXMuaXNTYW1lUGxhY2UoZXZlbnQsIHF1ZXN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xyXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc291cmNlSW5kZXggPT0gaW5kZXggfHwgdGhpcy5zb3VyY2VJbmRleCArIDEgPT0gaW5kZXgpICBpbmRleCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZVtcImtvRHJhZ2dpbmdcIl0oaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGVuZCgpIHtcclxuICAgICAgICB0aGlzLmlzU2Nyb2xsU3RvcCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zZXRJc0RyYWdnaW5nU291cmNlKHRoaXMuc3VydmV5W1wia29EcmFnZ2luZ1NvdXJjZVwiXSgpLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlbXCJrb0RyYWdnaW5nU291cmNlXCJdKG51bGwpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXSgtMSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VJbmRleCA9IC0xO1xyXG4gICAgICAgIHRoaXMuY2xlYXJEYXRhKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZG9Ecm9wKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlID0gbnVsbCkge1xyXG4gICAgICAgIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXSgpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YS50YXJnZXRRdWVzdGlvbjtcclxuICAgICAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uICYmIGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRJbmRleCA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRJbmRleCA+IC0xICYmIG9sZEluZGV4IDwgaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleC0tO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlUXVlc3Rpb25Ubyh0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZW5kKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZG9MZWF2ZVBhZ2UoZXZlbnQ6IERyYWdFdmVudCkge1xyXG4gICAgICAgIGV2ZW50ID0gdGhpcy5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbGFibGVFbGVtZW50KSByZXR1cm47XHJcbiAgICAgICAgaWYgKGV2ZW50LmNsaWVudFggPD0gMCB8fCBldmVudC5jbGllbnRZIDw9IDAgfHxcclxuICAgICAgICAgICAgZXZlbnQuY2xpZW50WCA+PSB0aGlzLnNjcm9sbGFibGVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IGV2ZW50LmNsaWVudFkgPj0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudC5vZmZzZXRIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKC0xKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNyZWF0ZVRhcmdldFF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbk5hbWU6IHN0cmluZywganNvbjogYW55KTogU3VydmV5LlF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgaWYgKCFxdWVzdGlvbk5hbWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPnRoaXMuc3VydmV5LmdldFF1ZXN0aW9uQnlOYW1lKHF1ZXN0aW9uTmFtZSk7XHJcbiAgICAgICAgdGhpcy5zb3VyY2VJbmRleCA9IC0xO1xyXG4gICAgICAgIGlmICh0YXJnZXRRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZUluZGV4ID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24oanNvbltcInR5cGVcIl0sIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9PYmplY3QoanNvbiwgdGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24ubmFtZSA9IHF1ZXN0aW9uTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uICYmIHF1ZXN0aW9uVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgcXVlc3Rpb25OYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXRRdWVzdGlvbi5zZXREYXRhKHRoaXMuc3VydmV5KTtcclxuICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24ucmVuZGVyV2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRJc0RyYWdnaW5nU291cmNlKHRhcmdldFF1ZXN0aW9uLCB0cnVlKTtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0UXVlc3Rpb247XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldElzRHJhZ2dpbmdTb3VyY2UocXVlc3Rpb246IGFueSwgdmFsOiBhbnkpIHtcclxuICAgICAgICBpZiAocXVlc3Rpb24gJiYgcXVlc3Rpb25bXCJrb0lzRHJhZ2dpbmdTb3VyY2VcIl0pIHF1ZXN0aW9uW1wia29Jc0RyYWdnaW5nU291cmNlXCJdKHZhbCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFF1ZXN0aW9uSW5kZXgoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlO1xyXG4gICAgICAgIGlmICghcXVlc3Rpb24pIHJldHVybiBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbik7XHJcbiAgICAgICAgZXZlbnQgPSB0aGlzLmdldEV2ZW50KGV2ZW50KTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gPG51bWJlcj5ldmVudC5jdXJyZW50VGFyZ2V0W1wiY2xpZW50SGVpZ2h0XCJdO1xyXG4gICAgICAgIHZhciB5ID0gZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICBpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoJ2xheWVyWCcpKSB7XHJcbiAgICAgICAgICAgIHkgPSBldmVudC5sYXllclkgLSA8bnVtYmVyPmV2ZW50LmN1cnJlbnRUYXJnZXRbXCJvZmZzZXRUb3BcIl07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh5ID4gaGVpZ2h0IC8gMikgaW5kZXgrKztcclxuICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU2FtZVBsYWNlKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XHJcbiAgICAgICAgaWYgKHByZXYucXVlc3Rpb24gIT0gcXVlc3Rpb24gfHwgTWF0aC5hYnMoZXZlbnQuY2xpZW50WCAtIHByZXYueCkgPiA1IHx8IE1hdGguYWJzKGV2ZW50LmNsaWVudFkgLSBwcmV2LnkpID4gNSkge1xyXG4gICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gcXVlc3Rpb247XHJcbiAgICAgICAgICAgIHByZXYueCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgICAgIHByZXYueSA9IGV2ZW50LmNsaWVudFk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGlzU2Nyb2xsU3RvcDogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBTY3JvbGxEZWxheTogbnVtYmVyID0gMzA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBTY3JvbGxPZmZzZXQ6IG51bWJlciA9IDEwMDtcclxuICAgIHByaXZhdGUgY2hlY2tTY3JvbGxZKGU6IERyYWdFdmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5zY3JvbGxhYmxlRWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciB5ID0gdGhpcy5nZXRTY3JvbGxhYmxlRWxlbWVudFBvc1koZSk7XHJcbiAgICAgICAgaWYgKHkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pc1Njcm9sbFN0b3AgPSB0cnVlO1xyXG4gICAgICAgIHZhciBoZWlnaHQgPSA8bnVtYmVyPnRoaXMuc2Nyb2xsYWJsZUVsZW1lbnRbXCJjbGllbnRIZWlnaHRcIl07XHJcbiAgICAgICAgaWYgKHkgPCBEcmFnRHJvcEhlbHBlci5TY3JvbGxPZmZzZXQgJiYgeSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxTdG9wID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuZG9TY3JvbGxZKC0xKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhlaWdodCAtIHkgPCBEcmFnRHJvcEhlbHBlci5TY3JvbGxPZmZzZXQgJiYgaGVpZ2h0ID49IHkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1Njcm9sbFN0b3AgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kb1Njcm9sbFkoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb1Njcm9sbFkoc3RlcDogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudDtcclxuICAgICAgICB2YXIgc2Nyb2xsWSA9IGVsLnNjcm9sbFRvcCArIHN0ZXA7XHJcbiAgICAgICAgaWYgKHNjcm9sbFkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTY3JvbGxTdG9wID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbC5zY3JvbGxUb3AgPSBzY3JvbGxZO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMuaXNTY3JvbGxTdG9wKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBzZWxmLmRvU2Nyb2xsWShzdGVwKSB9LCBEcmFnRHJvcEhlbHBlci5TY3JvbGxEZWxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTY3JvbGxhYmxlRWxlbWVudFBvc1koZTogRHJhZ0V2ZW50KTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQgfHwgIWUuY3VycmVudFRhcmdldCkgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiBlLm9mZnNldFkgKyA8bnVtYmVyPmUuY3VycmVudFRhcmdldFtcIm9mZnNldFRvcFwiXSAtIHRoaXMuc2Nyb2xsYWJsZUVsZW1lbnQub2Zmc2V0VG9wIC0gdGhpcy5zY3JvbGxhYmxlRWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEV2ZW50KGV2ZW50OiBEcmFnRXZlbnQpOiBEcmFnRXZlbnQge1xyXG4gICAgICAgIHJldHVybiBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0gPyBldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0gOiBldmVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICBpZiAocGFnZSA9PSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSAmJiBpbmRleCA9PSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRhcmdldFF1ZXN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChwYWdlKSB7XHJcbiAgICAgICAgICAgIHBhZ2UucmVtb3ZlUXVlc3Rpb24odGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5hZGRRdWVzdGlvbih0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaykgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2soKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RGF0YUluZm8oZXZlbnQ6IERyYWdFdmVudCk6IGFueSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpO1xyXG4gICAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIHRleHQgPSBkYXRhLnRleHQuc3Vic3RyKERyYWdEcm9wSGVscGVyLmRhdGFTdGFydC5sZW5ndGgpO1xyXG4gICAgICAgIHZhciBhcnJheSA9IHRleHQuc3BsaXQoJywnKTtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge2pzb246IG51bGx9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXS5zcGxpdCgnOicpO1xyXG4gICAgICAgICAgICByZXN1bHRbaXRlbVswXV0gPSBpdGVtWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHQuanNvbiA9IGRhdGEuanNvbjtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRZKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IChlbGVtZW50Lm9mZnNldFRvcCAtIGVsZW1lbnQuc2Nyb2xsVG9wICsgZWxlbWVudC5jbGllbnRUb3ApO1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gPEhUTUxFbGVtZW50PmVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwcmVwYXJlRGF0YShldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25OYW1lOiBzdHJpbmcsIGpzb246IGFueSA9IG51bGwpIHtcclxuICAgICAgICB2YXIgc3RyID0gRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0O1xyXG4gICAgICAgIGlmIChxdWVzdGlvblR5cGUpIHN0ciArPSBcInF1ZXN0aW9udHlwZTpcIiArIHF1ZXN0aW9uVHlwZSArICcsJztcclxuICAgICAgICBzdHIgKz0gXCJxdWVzdGlvbm5hbWU6XCIgKyBxdWVzdGlvbk5hbWU7XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKGV2ZW50LCBzdHIsIGpzb24pO1xyXG4gICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IHRoaXMuY3JlYXRlVGFyZ2V0UXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBxdWVzdGlvbk5hbWUsIGpzb24pO1xyXG4gICAgICAgIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhLnRhcmdldFF1ZXN0aW9uID0gdGFyZ2V0UXVlc3Rpb247XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlbXCJrb0RyYWdnaW5nU291cmNlXCJdKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0RGF0YShldmVudDogRHJhZ0V2ZW50LCB0ZXh0OiBzdHJpbmcsIGpzb246IGFueSA9IG51bGwpIHtcclxuICAgICAgICBpZiAoZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiVGV4dFwiLCB0ZXh0KTtcclxuICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmVmZmVjdEFsbG93ZWQgPSBcImNvcHlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSB7IHRleHQ6IHRleHQsIGpzb246IGpzb24gfTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0RGF0YShldmVudDogRHJhZ0V2ZW50KTogYW55IHtcclxuICAgICAgICBpZiAoZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJUZXh0XCIpO1xyXG4gICAgICAgICAgICBpZiAodGV4dCkge1xyXG4gICAgICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjbGVhckRhdGEoKSB7XHJcbiAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSB7dGV4dDogXCJcIiwganNvbjogbnVsbCwgdGFyZ2V0UXVlc3Rpb246IG51bGx9O1xyXG4gICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgIHByZXYucXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgIHByZXYueCA9IC0xO1xyXG4gICAgICAgIHByZXYueSA9IC0xO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RyYWdkcm9waGVscGVyLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0UHJvcGVydHkge1xyXG4gICAgcHJpdmF0ZSBvYmplY3RWYWx1ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmc6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIG9uUHJvcGVydHlDaGFuZ2VkOiBTdXJ2ZXlPblByb3BlcnR5Q2hhbmdlZENhbGxiYWNrO1xyXG4gICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgIHB1YmxpYyBkaXNwbGF5TmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHRpdGxlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMga29WYWx1ZTogYW55O1xyXG4gICAgcHVibGljIGtvVGV4dDogYW55O1xyXG4gICAgcHVibGljIG1vZGFsTmFtZTogc3RyaW5nO1xyXG4gICAgcHVibGljIG1vZGFsTmFtZVRhcmdldDogc3RyaW5nO1xyXG4gICAgcHVibGljIGtvSXNEZWZhdWx0OiBhbnk7XHJcbiAgICBwdWJsaWMgZWRpdG9yOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2U7XHJcbiAgICBwdWJsaWMgZWRpdG9yVHlwZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGJhc2VFZGl0b3JUeXBlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgY2hvaWNlczogQXJyYXk8YW55PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9uUHJvcGVydHlDaGFuZ2VkOiBTdXJ2ZXlPblByb3BlcnR5Q2hhbmdlZENhbGxiYWNrID0gbnVsbCwgcHJvcGVydHlFZGl0b3JPcHRpb25zOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5vblByb3BlcnR5Q2hhbmdlZCA9IG9uUHJvcGVydHlDaGFuZ2VkO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMucHJvcGVydHkubmFtZTtcclxuICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5jaG9pY2VzID0gcHJvcGVydHkuY2hvaWNlcztcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gcHJvcGVydHkudHlwZTtcclxuICAgICAgICAvL1RPRE9cclxuICAgICAgICBpZiAodGhpcy5jaG9pY2VzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gXCJkcm9wZG93blwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IHNlbGYub25BcHBseUVkaXRvclZhbHVlKG5ld1ZhbHVlKTsgfTtcclxuICAgICAgICB0aGlzLmVkaXRvciA9IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5jcmVhdGVFZGl0b3IodGhpcy5lZGl0b3JUeXBlLCBvbkl0ZW1DaGFuZ2VkKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5vcHRpb25zID0gcHJvcGVydHlFZGl0b3JPcHRpb25zO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IHRoaXMuZWRpdG9yLmVkaXRvclR5cGU7XHJcbiAgICAgICAgdGhpcy5tb2RhbE5hbWUgPSBcIm1vZGVsRWRpdG9yXCIgKyB0aGlzLmVkaXRvclR5cGUgKyB0aGlzLm5hbWU7XHJcbiAgICAgICAgdGhpcy5tb2RhbE5hbWVUYXJnZXQgPSBcIiNcIiArIHRoaXMubW9kYWxOYW1lO1xyXG4gICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYub25rb1ZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyByZXR1cm4gc2VsZi5nZXRWYWx1ZVRleHQoc2VsZi5rb1ZhbHVlKCkpOyB9KTtcclxuICAgICAgICB0aGlzLmtvSXNEZWZhdWx0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5wcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShzZWxmLmtvVmFsdWUoKSk7IH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBvYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMub2JqZWN0VmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQgb2JqZWN0KHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLm9iamVjdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlKCkge1xyXG4gICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmtvVmFsdWUodGhpcy5nZXRWYWx1ZSgpKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5zZXRPYmplY3QodGhpcy5vYmplY3QpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLnNldFRpdGxlKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5lZGl0UHJvcGVydHlcIilbXCJmb3JtYXRcIl0odGhpcy5wcm9wZXJ0eS5uYW1lKSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVFZGl0b3JEYXRhKHRoaXMua29WYWx1ZSgpKTtcclxuICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpc0FwcGx5aW5nTmV3VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgb25BcHBseUVkaXRvclZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmlzQXBwbHlpbmdOZXdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB0aGlzLmlzQXBwbHlpbmdOZXdWYWx1ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvbmtvVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNBcHBseWluZ05ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWRpdG9yRGF0YShuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9iamVjdCA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0VmFsdWUoKSA9PSBuZXdWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLm9uUHJvcGVydHlDaGFuZ2VkICE9IG51bGwgJiYgIXRoaXMuaXNWYWx1ZVVwZGF0aW5nKSB0aGlzLm9uUHJvcGVydHlDaGFuZ2VkKHRoaXMsIG5ld1ZhbHVlKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlRWRpdG9yRGF0YShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRWYWx1ZSgpOiBhbnkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUpIHJldHVybiB0aGlzLnByb3BlcnR5LmdldFZhbHVlKHRoaXMub2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbdGhpcy5uYW1lXTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7IHJldHVybiB0aGlzLmVkaXRvci5nZXRWYWx1ZVRleHQodmFsdWUpOyB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb2JqZWN0UHJvcGVydHkudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuL2VkaXRvckxvY2FsaXphdGlvblwiO1xyXG5pbXBvcnQge1N1cnZleUhlbHBlciwgT2JqVHlwZX0gZnJvbSBcIi4vc3VydmV5SGVscGVyXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5VmVyYnMge1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcclxuICAgIHByaXZhdGUgb2JqVmFsdWU6IGFueTtcclxuICAgIHByaXZhdGUgY2hvaWNlc0NsYXNzZXM6IEFycmF5PHN0cmluZz47XHJcbiAgICBrb1ZlcmJzOiBhbnk7XHJcbiAgICBrb0hhc1ZlcmJzOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICB0aGlzLmtvVmVyYnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmtvSGFzVmVyYnMgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoXCJzZWxlY3RiYXNlXCIsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc0NsYXNzZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQ2xhc3Nlcy5wdXNoKGNsYXNzZXNbaV0ubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgb2JqKCk6IGFueSB7IHJldHVybiB0aGlzLm9ialZhbHVlIH1cclxuICAgIHB1YmxpYyBzZXQgb2JqKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5vYmpWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMub2JqVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmJ1aWxkVmVyYnMoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYnVpbGRWZXJicygpIHtcclxuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKHRoaXMub2JqKTtcclxuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPnRoaXMub2JqO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbiwgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzQ2xhc3Nlcy5pbmRleE9mKHF1ZXN0aW9uLmdldFR5cGUoKSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbiwgdGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtvVmVyYnMoYXJyYXkpO1xyXG4gICAgICAgIHRoaXMua29IYXNWZXJicyhhcnJheS5sZW5ndGggPiAwKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgU3VydmV5VmVyYkl0ZW0ge1xyXG4gICAga29JdGVtczogYW55O1xyXG4gICAga29TZWxlY3RlZEl0ZW06IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIG9uTW9kaWZpZWRDYWxsYmFjazogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gXCJcIjsgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0gZXh0ZW5kcyBTdXJ2ZXlWZXJiSXRlbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyBvbk1vZGlmaWVkQ2FsbGJhY2s6ICgpID0+IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24sIG9uTW9kaWZpZWRDYWxsYmFjayk7XHJcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoXCJzZWxlY3RiYXNlXCIsIHRydWUpO1xyXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHsgdmFsdWU6IGNsYXNzZXNbaV0ubmFtZSwgdGV4dDogZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInF0LlwiICsgY2xhc3Nlc1tpXS5uYW1lKSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtKHF1ZXN0aW9uLmdldFR5cGUoKSk7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVR5cGUobmV3VmFsdWUpOyB9KTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnZlcmJDaGFuZ2VUeXBlXCIpOyB9XHJcbiAgICBwcml2YXRlIGNoYW5nZVR5cGUocXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAocXVlc3Rpb25UeXBlID09IHRoaXMucXVlc3Rpb24uZ2V0VHlwZSgpKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgIHZhciBuZXdRdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCB0aGlzLnF1ZXN0aW9uLm5hbWUpO1xyXG4gICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XHJcbiAgICAgICAgdmFyIGpzb24gPSBqc29uT2JqLnRvSnNvbk9iamVjdCh0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICBqc29uT2JqLnRvT2JqZWN0KGpzb24sIG5ld1F1ZXN0aW9uKTtcclxuICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24obmV3UXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICBpZiAodGhpcy5vbk1vZGlmaWVkQ2FsbGJhY2spIHRoaXMub25Nb2RpZmllZENhbGxiYWNrKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbSBleHRlbmRzIFN1cnZleVZlcmJJdGVtIHtcclxuICAgIHByaXZhdGUgcHJldlBhZ2U6IFN1cnZleS5QYWdlO1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBwdWJsaWMgb25Nb2RpZmllZENhbGxiYWNrOiAoKSA9PiBhbnkpIHtcclxuICAgICAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uLCBvbk1vZGlmaWVkQ2FsbGJhY2spO1xyXG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBwYWdlLCB0ZXh0OiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICB0aGlzLnByZXZQYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtKHRoaXMucHJldlBhZ2UpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5jaGFuZ2VQYWdlKG5ld1ZhbHVlKTsgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS52ZXJiQ2hhbmdlUGFnZVwiKTsgfVxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VQYWdlKG5ld1BhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgaWYgKG5ld1BhZ2UgPT0gbnVsbCB8fCBuZXdQYWdlID09IHRoaXMucHJldlBhZ2UpIHJldHVybjtcclxuICAgICAgICB0aGlzLnByZXZQYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgIG5ld1BhZ2UuYWRkUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKHRoaXMub25Nb2RpZmllZENhbGxiYWNrKSB0aGlzLm9uTW9kaWZpZWRDYWxsYmFjaygpO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29iamVjdFZlcmJzLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5SGVscGVyfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuZXhwb3J0IGRlY2xhcmUgdHlwZSBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2sgPSAocGFnZTogU3VydmV5LlBhZ2UpID0+IHZvaWQ7XHJcbmV4cG9ydCBkZWNsYXJlIHR5cGUgU3VydmV5TW92ZVBhZ2VDYWxsYmFjayA9IChpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSA9PiB2b2lkO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVBhZ2VzRWRpdG9yIHtcclxuICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG4gICAga29QYWdlczogYW55O1xyXG4gICAga29Jc1ZhbGlkOiBhbnk7XHJcbiAgICBzZWxlY3RQYWdlQ2xpY2s6IGFueTtcclxuICAgIG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2s7XHJcbiAgICBvblNlbGVjdFBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrO1xyXG4gICAgb25EZWxldGVQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcclxuICAgIG9uTW92ZVBhZ2VDYWxsYmFjazogU3VydmV5TW92ZVBhZ2VDYWxsYmFjaztcclxuICAgIGRyYWdnaW5nUGFnZTogYW55ID0gbnVsbDtcclxuICAgIGRyYWdTdGFydDogYW55OyBkcmFnT3ZlcjogYW55OyBkcmFnRW5kOiBhbnk7IGRyYWdEcm9wOiBhbnk7IGtleURvd246IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihvbkFkZE5ld1BhZ2VDYWxsYmFjazogU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrID0gbnVsbCwgb25TZWxlY3RQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjayA9IG51bGwsXHJcbiAgICAgICAgICAgICAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2sgPSBudWxsLCBvbkRlbGV0ZVBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMua29QYWdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHRoaXMua29Jc1ZhbGlkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjayA9IG9uQWRkTmV3UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgIHRoaXMub25TZWxlY3RQYWdlQ2FsbGJhY2sgPSBvblNlbGVjdFBhZ2VDYWxsYmFjaztcclxuICAgICAgICB0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjayA9IG9uTW92ZVBhZ2VDYWxsYmFjaztcclxuICAgICAgICB0aGlzLm9uRGVsZXRlUGFnZUNhbGxiYWNrID0gb25EZWxldGVQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0UGFnZUNsaWNrID0gZnVuY3Rpb24ocGFnZUl0ZW0pIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2socGFnZUl0ZW0ucGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMua2V5RG93biA9IGZ1bmN0aW9uIChlbDogYW55LCBlOiBLZXlib2FyZEV2ZW50KSB7IHNlbGYub25LZXlEb3duKGVsLCBlKTsgfVxyXG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0ID0gZnVuY3Rpb24gKGVsOiBhbnkpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBlbDsgfTtcclxuICAgICAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGVsOiBhbnkpIHsgIH07XHJcbiAgICAgICAgdGhpcy5kcmFnRW5kID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRyYWdnaW5nUGFnZSA9IG51bGw7IH07XHJcbiAgICAgICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlbDogYW55KSB7IHNlbGYubW92ZURyYWdnaW5nUGFnZVRvKGVsKTsgfTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzdXJ2ZXkodmFsdWU6IFN1cnZleS5TdXJ2ZXkpIHtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5rb0lzVmFsaWQodGhpcy5zdXJ2ZXlWYWx1ZSAhPSBudWxsKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VzKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0U2VsZWN0ZWRQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwYWdlc1tpXS5rb1NlbGVjdGVkKHBhZ2VzW2ldLnBhZ2UgPT0gcGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZE5ld1BhZ2VDbGljaygpIHtcclxuICAgICAgICBpZiAodGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZVBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4QnlQYWdlKHBhZ2UpO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29QYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjaGFuZ2VOYW1lKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcclxuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMoKVtpbmRleF0udGl0bGUoU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUocGFnZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRJbmRleEJ5UGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSk6IG51bWJlciB7XHJcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocGFnZXNbaV0ucGFnZSA9PSBwYWdlKSByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uS2V5RG93bihlbDogYW55LCBlOiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMua29QYWdlcygpLmxlbmd0aCA8PSAxKSByZXR1cm47XHJcbiAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XHJcbiAgICAgICAgdmFyIHBhZ2VJbmRleCA9IC0xO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBhZ2VzW2ldLnBhZ2UgJiYgcGFnZXNbaV0ua29TZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlSW5kZXggPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYWdlSW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PSA0NiAmJiB0aGlzLm9uRGVsZXRlUGFnZUNhbGxiYWNrKSB0aGlzLm9uRGVsZXRlUGFnZUNhbGxiYWNrKGVsLnBhZ2UpO1xyXG4gICAgICAgIGlmICgoZS5rZXlDb2RlID09IDM3IHx8IGUua2V5Q29kZSA9PSAzOSkgJiYgdGhpcy5vblNlbGVjdFBhZ2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBwYWdlSW5kZXggKz0gKGUua2V5Q29kZSA9PSAzNyA/IC0xIDogMSk7XHJcbiAgICAgICAgICAgIGlmIChwYWdlSW5kZXggPCAwKSBwYWdlSW5kZXggPSBwYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICBpZiAocGFnZUluZGV4ID49IHBhZ2VzLmxlbmd0aCkgcGFnZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSBwYWdlc1twYWdlSW5kZXhdLnBhZ2U7XHJcbiAgICAgICAgICAgIHRoaXMub25TZWxlY3RQYWdlQ2FsbGJhY2socGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0ZWRQYWdlKHBhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVQYWdlcygpIHtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyhbXSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHBhZ2VzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgcGFnZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZToga28ub2JzZXJ2YWJsZShTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSksIHBhZ2U6IHBhZ2UsIGtvU2VsZWN0ZWQ6IGtvLm9ic2VydmFibGUoZmFsc2UpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtvUGFnZXMocGFnZXMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBtb3ZlRHJhZ2dpbmdQYWdlVG8odG9QYWdlOiBhbnkpIHtcclxuICAgICAgICBpZiAodG9QYWdlID09IG51bGwgfHwgdG9QYWdlID09IHRoaXMuZHJhZ2dpbmdQYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmdQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZ1BhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMua29QYWdlcygpLmluZGV4T2YodGhpcy5kcmFnZ2luZ1BhZ2UpO1xyXG4gICAgICAgIHZhciBpbmRleFRvID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0b1BhZ2UpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjayhpbmRleCwgaW5kZXhUbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzRWRpdG9yLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XHJcbiAgICBrb0FjdGl2ZVZpZXc6IGFueTtcclxuICAgIGtvSXRlbXNUZXh0OiBhbnk7XHJcbiAgICBjaGFuZ2VUb1RleHRWaWV3Q2xpY2s6IGFueTtcclxuICAgIGNoYW5nZVRvRm9ybVZpZXdDbGljazogYW55O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb0FjdGl2ZVZpZXcgPSBrby5vYnNlcnZhYmxlKFwiZm9ybVwiKTtcclxuICAgICAgICB0aGlzLmtvSXRlbXNUZXh0ID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICB0aGlzLmtvQWN0aXZlVmlldy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcImZvcm1cIikgc2VsZi51cGRhdGVJdGVtcyhzZWxmLmtvSXRlbXNUZXh0KCkpO1xyXG4gICAgICAgICAgICBlbHNlIHNlbGYua29JdGVtc1RleHQoc2VsZi5nZXRJdGVtc1RleHQoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VUb1RleHRWaWV3Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29BY3RpdmVWaWV3KFwidGV4dFwiKTsgfTtcclxuICAgICAgICB0aGlzLmNoYW5nZVRvRm9ybVZpZXdDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb0FjdGl2ZVZpZXcoXCJmb3JtXCIpOyB9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIml0ZW12YWx1ZXNcIjsgfVxyXG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua29JdGVtcygpLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rb0l0ZW1zKClbaV07XHJcbiAgICAgICAgICAgIGl0ZW0ua29IYXNFcnJvcih0aGlzLmlzVmFsdWVFbXB0eShpdGVtLmtvVmFsdWUoKSkpO1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwgaXRlbS5rb0hhc0Vycm9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlTmV3RWRpdG9ySXRlbSgpOiBhbnkgeyByZXR1cm4geyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKCksIGtvVGV4dDoga28ub2JzZXJ2YWJsZSgpLCBrb0hhc0Vycm9yOiBrby5vYnNlcnZhYmxlKGZhbHNlKSB9OyB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcclxuICAgICAgICB2YXIgaXRlbVZhbHVlID0gaXRlbTtcclxuICAgICAgICB2YXIgaXRlbVRleHQgPSBudWxsO1xyXG4gICAgICAgIGlmIChpdGVtLnZhbHVlKSB7XHJcbiAgICAgICAgICAgIGl0ZW1WYWx1ZSA9IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgICAgIGl0ZW1UZXh0ID0gaXRlbS50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKGl0ZW1WYWx1ZSksIGtvVGV4dDoga28ub2JzZXJ2YWJsZShpdGVtVGV4dCksIGtvSGFzRXJyb3I6IGtvLm9ic2VydmFibGUoZmFsc2UpIH07XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlSXRlbUZyb21FZGl0b3JJdGVtKGVkaXRvckl0ZW06IGFueSkge1xyXG4gICAgICAgIHZhciBhbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnMgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmFsd2F5U2F2ZVRleHRJblByb3BlcnR5RWRpdG9ycztcclxuICAgICAgICB2YXIgdGV4dCA9IGVkaXRvckl0ZW0ua29UZXh0KCk7XHJcbiAgICAgICAgaWYgKCFhbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnMgJiYgZWRpdG9ySXRlbS5rb1RleHQoKSA9PSBlZGl0b3JJdGVtLmtvVmFsdWUoKSkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGVkaXRvckl0ZW0ua29WYWx1ZSgpLCB0ZXh0OiB0ZXh0IH07XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25CZWZvcmVBcHBseSgpIHtcclxuICAgICAgICBpZiAodGhpcy5rb0FjdGl2ZVZpZXcoKSAhPSBcImZvcm1cIikge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1zKHRoaXMua29JdGVtc1RleHQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLm9uQmVmb3JlQXBwbHkoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVJdGVtcyh0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSBbXTtcclxuICAgICAgICBpZiAodGV4dCkge1xyXG4gICAgICAgICAgICB2YXIgdGV4dHMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRleHRzW2ldKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZUl0ZW0gPSBuZXcgU3VydmV5Lkl0ZW1WYWx1ZSh0ZXh0c1tpXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHsgdmFsdWU6IHZhbHVlSXRlbS52YWx1ZSwgdGV4dDogKHZhbHVlSXRlbS5oYXNUZXh0ID8gdmFsdWVJdGVtLnRleHQgOiBcIlwiKSB9O1xyXG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtvSXRlbXModGhpcy5nZXRJdGVtc0Zyb21WYWx1ZShpdGVtcykpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldEl0ZW1zVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gW107XHJcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5rb0l0ZW1zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlRW1wdHkoaXRlbS5rb1ZhbHVlKCkpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIGl0ZW1UZXh0ID0gaXRlbS5rb1ZhbHVlKCk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmtvVGV4dCgpKSBpdGVtVGV4dCArPSBTdXJ2ZXkuSXRlbVZhbHVlLlNlcGFyYXRvciArIGl0ZW0ua29UZXh0KCk7XHJcbiAgICAgICAgICAgIHRleHQucHVzaChpdGVtVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0ZXh0LmpvaW4oXCJcXG5cIik7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgaXNWYWx1ZUVtcHR5KHZhbDogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuICF2YWw7XHJcbiAgICB9XHJcbn1cclxuXHJcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIml0ZW12YWx1ZXNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7U3VydmV5T2JqZWN0RWRpdG9yfSBmcm9tIFwiLi4vb2JqZWN0RWRpdG9yXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XHJcbiAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xyXG4gICAgcHVibGljIGF2YWlsYWJsZVZhbGlkYXRvcnM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgIHByaXZhdGUgdmFsaWRhdG9yQ2xhc3NlczogQXJyYXk8U3VydmV5Lkpzb25NZXRhZGF0YUNsYXNzPiA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvciA9IG5ldyBTdXJ2ZXlPYmplY3RFZGl0b3IoKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBuZXdWYWx1ZSAhPSBudWxsID8gbmV3VmFsdWUudmFsaWRhdG9yIDogbnVsbDsgfSk7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0b3JDbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic3VydmV5dmFsaWRhdG9yXCIsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlVmFsaWRhdG9ycyA9IHRoaXMuZ2V0QXZhaWxhYmxlVmFsaWRhdG9ycygpO1xyXG4gICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShzZWxmLmtvU2VsZWN0ZWQoKSk7IH07XHJcbiAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKHZhbGlkYXRvclR5cGUpIHsgc2VsZi5hZGRJdGVtKHZhbGlkYXRvclR5cGUpOyB9O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInZhbGlkYXRvcnNcIjsgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgaWYgKHRoaXMua29TZWxlY3RlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5rb0l0ZW1zKCkubGVuZ3RoID4gMCA/IHRoaXMua29JdGVtcygpWzBdIDogbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7XHJcbiAgICAgICAgdmFyIGpzb25PYmogPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKTtcclxuICAgICAgICB2YXIgdmFsaWRhdG9yID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoaXRlbS5nZXRUeXBlKCkpO1xyXG4gICAgICAgIGpzb25PYmoudG9PYmplY3QoaXRlbSwgdmFsaWRhdG9yKTtcclxuICAgICAgICByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSh2YWxpZGF0b3IpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcclxuICAgICAgICB2YXIgaXRlbSA9IDxTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0+ZWRpdG9ySXRlbTtcclxuICAgICAgICByZXR1cm4gaXRlbS52YWxpZGF0b3I7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZEl0ZW0odmFsaWRhdG9yVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIG5ld1ZhbGlkYXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0oU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3ModmFsaWRhdG9yVHlwZSkpO1xyXG4gICAgICAgIHRoaXMua29JdGVtcy5wdXNoKG5ld1ZhbGlkYXRvcik7XHJcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG5ld1ZhbGlkYXRvcik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YWxpZGF0b3JDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudmFsaWRhdG9yQ2xhc3Nlc1tpXS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb2JqOiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICBpZiAodGhpcy5rb1NlbGVjdGVkKCkgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZCgpLnZhbGlkYXRvcltwcm9wZXJ0eS5uYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtIHtcclxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsaWRhdG9yOiBTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yKSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdmFsaWRhdG9yLmdldFR5cGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInZhbGlkYXRvcnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UsIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCwgU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzfSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvckJhc2VcIjtcclxuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeERyb3Bkb3duRWRpdG9yIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFByb3BlcnRpZXNUYWJzKHByb3BUYWJzOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgc3VwZXIuZ2V0UHJvcGVydGllc1RhYnMocHJvcFRhYnMpO1xyXG4gICAgICAgIHByb3BUYWJzLnB1c2goeyBwcm9wZXJ0eU5hbWU6IFwiY29sdW1uc1wiLCB2aXNpYmxlSW5kZXg6IDEwIH0pO1xyXG4gICAgICAgIHByb3BUYWJzLnB1c2goeyBwcm9wZXJ0eU5hbWU6IFwicm93c1wiLCB2aXNpYmxlSW5kZXg6IDExIH0pO1xyXG4gICAgICAgIHByb3BUYWJzLnB1c2goeyBwcm9wZXJ0eU5hbWU6IFwiY2hvaWNlc1wiLCB2aXNpYmxlSW5kZXg6IDEyLCB0aXRsZTogZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLm1hdHJpeENob2ljZXNcIikgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUdlbmVyYWxUYWIoKTogU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJHZW5lcmFsIHsgcmV0dXJuIG5ldyBTdXJ2ZXlRdWVzdGlvbkVkaXRvck1hdHJpeERyb3Bkb3duVGFiR2VuZXJhbCh0aGlzLnF1ZXN0aW9uQmFzZSwgMCwgdGhpcy5wcm9wZXJ0aWVzKTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25FZGl0b3JNYXRyaXhEcm9wZG93blRhYkdlbmVyYWwgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwge1xyXG4gICAgcHJpdmF0ZSBjZWxsVHlwZVByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5O1xyXG4gICAgcHVibGljIGhhc0NlbGxUeXBlOiBib29sZWFuO1xyXG5cclxuICAgIGtvQ2VsbFR5cGU6IGFueTsga29DZWxsVHlwZUNob2ljZXM6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciwgcHJvcGVydGllczogU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCB2aXNpYmxlSW5kZXgsIHByb3BlcnRpZXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldFVwUHJvcGVydGllcygpIHtcclxuICAgICAgICBzdXBlci5zZXRVcFByb3BlcnRpZXMoKTtcclxuICAgICAgICB0aGlzLmNlbGxUeXBlUHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJjZWxsVHlwZVwiKTtcclxuICAgICAgICB0aGlzLmhhc0NlbGxUeXBlID0gdGhpcy5jZWxsVHlwZVByb3BlcnR5ICE9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rb0NlbGxUeXBlQ2hvaWNlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmNlbGxUeXBlUHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0NlbGxUeXBlQ2hvaWNlcyh0aGlzLmNlbGxUeXBlUHJvcGVydHkuY2hvaWNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua29DZWxsVHlwZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQWRkaXRpb25hbFRlbXBsYXRlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCBhZGRpdGlvbmFsVGVtcGxhdGVIdG1sKCk6IHN0cmluZyB7IHJldHVybiBcInF1ZXN0aW9uZWRpdG9ydGFiLW1hdHJpeGRyb3Bkb3duXCI7IH1cclxuICAgIHB1YmxpYyByZXNldCgpIHtcclxuICAgICAgICBzdXBlci5yZXNldCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0NlbGxUeXBlKSB0aGlzLmtvQ2VsbFR5cGUodGhpcy5xdWVzdGlvbkJhc2VbXCJjZWxsVHlwZVwiXSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYXBwbHkoKSB7XHJcbiAgICAgICAgc3VwZXIuYXBwbHkoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNDZWxsVHlwZSkgdGhpcy5xdWVzdGlvbkJhc2VbXCJjZWxsVHlwZVwiXSA9IHRoaXMua29DZWxsVHlwZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJtYXRyaXhkcm9wZG93blwiLCBmdW5jdGlvbiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd25FZGl0b3IocXVlc3Rpb24sIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uTWF0cml4RHJvcGRvd25FZGl0b3IudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtTdXJ2ZXlKU09ONX0gZnJvbSBcIi4vanNvbjVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlFbWJlZGluZ1dpbmRvdyB7XHJcbiAgICBwcml2YXRlIGpzb25WYWx1ZTogYW55O1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0hlYWQ6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0phdmE6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0JvZHk6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAga29IZWFkVGV4dDogYW55O1xyXG4gICAga29Cb2R5VGV4dDogYW55O1xyXG4gICAga29KYXZhVGV4dDogYW55O1xyXG4gICAgcHVibGljIHN1cnZleUlkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgcHVibGljIHN1cnZleVBvc3RJZDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBnZW5lcmF0ZVZhbGlkSlNPTjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAga29TaG93QXNXaW5kb3c6IGFueTtcclxuICAgIGtvU2NyaXB0VXNpbmc6IGFueTtcclxuICAgIGtvSGFzSWRzOiBhbnk7XHJcbiAgICBrb0xvYWRTdXJ2ZXk6IGFueTtcclxuICAgIGtvTGlicmFyeVZlcnNpb246IGFueTtcclxuICAgIGtvVmlzaWJsZUh0bWw6IGFueTtcclxuICAgIHByaXZhdGUgcGxhdGZvcm1IZWFkZXJzID0ge1xyXG4gICAgICAgIFwiYW5ndWxhclwiOiBcImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tICdzdXJ2ZXktYW5ndWxhcic7XCIsXHJcbiAgICAgICAgXCJqcXVlcnlcIjogXCI8c2NyaXB0IHNyYz1cXFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvanF1ZXJ5LzMuMS4xL2pxdWVyeS5taW4uanNcXFwiPjwvc2NyaXB0PlxcbjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkuanF1ZXJ5Lm1pbi5qc1xcXCI+PC9zY3JpcHQ+XCIsXHJcbiAgICAgICAgXCJrbm9ja291dFwiOiBcIjxzY3JpcHQgc3JjPVxcXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcXFwiPjwvc2NyaXB0PlxcbjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkua28ubWluLmpzXFxcIj48L3NjcmlwdD5cIixcclxuICAgICAgICBcInJlYWN0XCI6IFwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcXG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSAnc3VydmV5LXJlYWN0JztcIlxyXG4gICAgfTtcclxuICAgIHByaXZhdGUgcGxhdGZvcm1KU29uUGFnZSA9IHtcclxuICAgICAgICBcImFuZ3VsYXJcIjogXCJAQ29tcG9uZW50KHtcXG4gIHNlbGVjdG9yOiAnbmctYXBwJyxcXG4gICAgICAgIHRlbXBsYXRlOiBcXG4gICAgICAgIDxkaXYgaWQ9J3N1cnZleUVsZW1lbnQnPjwvZGl2PlxcXCIsXFxufSlcXG5leHBvcnQgY2xhc3MgQXBwQ29tcG9uZW50IHtcXG4gICAgbmdPbkluaXQoKSB7XFxuICAgICAgICB2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5Nb2RlbChzdXJ2ZXlKU09OKTtcXG4gICAgICAgIHN1cnZleS5vbkNvbXBsZXRlLmFkZChzZW5kRGF0YVRvU2VydmVyKTtcXG4gICAgICAgU3VydmV5LlN1cnZleU5HLnJlbmRlcihcXFwic3VydmV5RWxlbWVudFxcXCIsIHsgbW9kZWw6IHN1cnZleSB9KTtcXG4gICAgfVxcbn1cIixcclxuICAgICAgICBcImpxdWVyeVwiOiBcInZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5Lk1vZGVsKHN1cnZleUpTT04pO1xcbiQoXFxcIiNzdXJ2ZXlDb250YWluZXJcXFwiKS5TdXJ2ZXkoe1xcbiAgICBtb2RlbDogc3VydmV5LFxcbiAgICBvbkNvbXBsZXRlOiBzZW5kRGF0YVRvU2VydmVyXFxufSk7XCIsXHJcbiAgICAgICAgXCJrbm9ja291dFwiOiBcInZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5Lk1vZGVsKHN1cnZleUpTT04sIFxcXCJzdXJ2ZXlDb250YWluZXJcXFwiKTtcXG5zdXJ2ZXkub25Db21wbGV0ZS5hZGQoc2VuZERhdGFUb1NlcnZlcik7XCIsXHJcbiAgICAgICAgXCJyZWFjdFwiOiBcIlJlYWN0RE9NLnJlbmRlcihcXG4gICAgPFN1cnZleS5TdXJ2ZXkganNvbj17IHN1cnZleUpTT04gfSBvbkNvbXBsZXRlPXsgc2VuZERhdGFUb1NlcnZlciB9IC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwic3VydmV5Q29udGFpbmVyXFxcIikpO1wiXHJcbiAgICB9O1xyXG4gICAgcHJpdmF0ZSBwbGF0Zm9ybUpTb25XaW5kb3cgPSB7XHJcbiAgICAgICAgXCJhbmd1bGFyXCI6IFwiQENvbXBvbmVudCh7XFxuICBzZWxlY3RvcjogJ25nLWFwcCcsXFxuICAgICAgICB0ZW1wbGF0ZTogXFxuICAgICAgICA8ZGl2IGlkPSdzdXJ2ZXlFbGVtZW50Jz48L2Rpdj5cXFwiLFxcbn0pXFxuZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XFxuICAgIG5nT25Jbml0KCkge1xcbiAgICAgICAgdmFyIHN1cnZleSA9IG5ldyBTdXJ2ZXkuTW9kZWwoc3VydmV5SlNPTik7XFxuICAgICAgICBzdXJ2ZXkub25Db21wbGV0ZS5hZGQoc2VuZERhdGFUb1NlcnZlcik7XFxuICAgICAgIFN1cnZleS5TdXJ2ZXlXaW5kb3dORy5yZW5kZXIoXFxcInN1cnZleUVsZW1lbnRcXFwiLCB7IG1vZGVsOiBzdXJ2ZXkgfSk7XFxuICAgIH1cXG59XCIsXHJcbiAgICAgICAgXCJqcXVlcnlcIjogXCJ2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5Nb2RlbChzdXJ2ZXlKU09OKTtcXG4kKFxcXCIjc3VydmV5Q29udGFpbmVyXFxcIikuU3VydmV5V2luZG93KHtcXG4gICAgbW9kZWw6IHN1cnZleSxcXG4gICAgb25Db21wbGV0ZTogc2VuZERhdGFUb1NlcnZlclxcbn0pO1wiLFxyXG4gICAgICAgIFwia25vY2tvdXRcIjogXCJ2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5Nb2RlbChzdXJ2ZXlKU09OKTtcXG5zdXJ2ZXlXaW5kb3cuc2hvdygpO1xcbnN1cnZleS5vbkNvbXBsZXRlLmFkZChzZW5kRGF0YVRvU2VydmVyKTtcIixcclxuICAgICAgICBcInJlYWN0XCI6IFwiUmVhY3RET00ucmVuZGVyKFxcbiAgICA8U3VydmV5LlN1cnZleVdpbmRvdyBqc29uPXsgc3VydmV5SlNPTiB9IG9uQ29tcGxldGU9eyBzZW5kRGF0YVRvU2VydmVyIH0gLz4sIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzdXJ2ZXlDb250YWluZXJcXFwiKSk7XCJcclxuICAgIH07XHJcbiAgICBwcml2YXRlIHBsYXRmb3JtSHRtbG9uUGFnZSA9IHtcclxuICAgICAgICBcImFuZ3VsYXJcIjogXCI8bmctYXBwPjwvbmctYXBwPlwiLFxyXG4gICAgICAgIFwianF1ZXJ5XCI6IFwiPGRpdiBpZD1cXFwic3VydmV5Q29udGFpbmVyXFxcIj48L2Rpdj5cIixcclxuICAgICAgICBcImtub2Nrb3V0XCI6IFwiPGRpdiBpZD1cXFwic3VydmV5Q29udGFpbmVyXFxcIj48L2Rpdj5cIixcclxuICAgICAgICBcInJlYWN0XCI6IFwiPGRpdiBpZD1cXFwic3VydmV5Q29udGFpbmVyXFxcIj48L2Rpdj5cIlxyXG4gICAgfTtcclxuICAgIHByaXZhdGUgcGxhdGZvcm1IdG1sb25XaW5kb3cgPSB7XHJcbiAgICAgICAgXCJhbmd1bGFyXCI6IFwiPG5nLWFwcD48L25nLWFwcD5cIixcclxuICAgICAgICBcImpxdWVyeVwiOiBcIjxkaXYgaWQ9XFxcInN1cnZleUNvbnRhaW5lclxcXCI+PC9kaXY+XCIsXHJcbiAgICAgICAgXCJrbm9ja291dFwiOiBcIlwiLFxyXG4gICAgICAgIFwicmVhY3RcIjogXCI8ZGl2IGlkPVxcXCJzdXJ2ZXlDb250YWluZXJcXFwiPjwvZGl2PlwiXHJcbiAgICB9O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMua29MaWJyYXJ5VmVyc2lvbiA9IGtvLm9ic2VydmFibGUoXCJqcXVlcnlcIik7XHJcbiAgICAgICAgdGhpcy5rb1Nob3dBc1dpbmRvdyA9IGtvLm9ic2VydmFibGUoXCJwYWdlXCIpO1xyXG4gICAgICAgIHRoaXMua29TY3JpcHRVc2luZyA9IGtvLm9ic2VydmFibGUoXCJib290c3RyYXBcIik7XHJcbiAgICAgICAgdGhpcy5rb0hhc0lkcyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMua29Mb2FkU3VydmV5ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcblxyXG4gICAgICAgIHRoaXMua29IZWFkVGV4dCA9IGtvLm9ic2VydmFibGUoXCJcIik7XHJcbiAgICAgICAgdGhpcy5rb0phdmFUZXh0ID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICB0aGlzLmtvQm9keVRleHQgPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmtvVmlzaWJsZUh0bWwgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmtvU2hvd0FzV2luZG93KCkgPT0gXCJwYWdlXCIgfHwgc2VsZi5wbGF0Zm9ybUh0bWxvbldpbmRvd1tzZWxmLmtvTGlicmFyeVZlcnNpb24oKV0gIT0gXCJcIjsgfSk7XHJcbiAgICAgICAgdGhpcy5rb0xpYnJhcnlWZXJzaW9uLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRIZWFkVGV4dCgpOyBzZWxmLnNldEphdmFUZXN0KCk7IHNlbGYuc2V0Qm9keVRleHQoKTsgfSk7XHJcbiAgICAgICAgdGhpcy5rb1Nob3dBc1dpbmRvdy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2V0SmF2YVRlc3QoKTsgc2VsZi5zZXRCb2R5VGV4dCgpOyB9KTtcclxuICAgICAgICB0aGlzLmtvU2NyaXB0VXNpbmcuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNldEhlYWRUZXh0KCk7IHNlbGYuc2V0SmF2YVRlc3QoKTsgfSk7XHJcbiAgICAgICAgdGhpcy5rb0xvYWRTdXJ2ZXkuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNldEphdmFUZXN0KCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID0gbnVsbDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQganNvbigpOiBhbnkgeyByZXR1cm4gdGhpcy5qc29uVmFsdWU7IH1cclxuICAgIHB1YmxpYyBzZXQganNvbih2YWx1ZTogYW55KSB7IHRoaXMuanNvblZhbHVlID0gdmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQWNlRWRpdG9yKCk6IGJvb2xlYW4geyByZXR1cm4gdHlwZW9mIGFjZSAhPT0gXCJ1bmRlZmluZWRcIjsgfVxyXG4gICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQWNlRWRpdG9yICYmIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSGVhZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0JvZHkgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nQm9keVwiKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSmF2YVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb0hhc0lkcyh0aGlzLnN1cnZleUlkICYmIHRoaXMuc3VydmV5UG9zdElkKTtcclxuICAgICAgICB0aGlzLnNldEJvZHlUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5zZXRIZWFkVGV4dCgpO1xyXG4gICAgICAgIHRoaXMuc2V0SmF2YVRlc3QoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0Qm9keVRleHQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0JvZHksIHRoaXMua29Cb2R5VGV4dCwgdGhpcy5wbGF0Zm9ybUh0bWxvblBhZ2VbdGhpcy5rb0xpYnJhcnlWZXJzaW9uKCldKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0SGVhZFRleHQoKSB7XHJcbiAgICAgICAgdmFyIHN0ciA9IHRoaXMucGxhdGZvcm1IZWFkZXJzW3RoaXMua29MaWJyYXJ5VmVyc2lvbigpXTtcclxuICAgICAgICBpZiAodGhpcy5rb1NjcmlwdFVzaW5nKCkgIT0gXCJib290c3RyYXBcIikge1xyXG4gICAgICAgICAgICBzdHIgKz0gXCJcXG48bGluayBocmVmPVxcXCJjc3Mvc3VydmV5LmNzc1xcXCIgdHlwZT1cXFwidGV4dC9jc3NcXFwiIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgLz5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQsIHRoaXMua29IZWFkVGV4dCwgc3RyKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0SmF2YVRlc3QoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRUZXh0VG9FZGl0b3IodGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEsIHRoaXMua29KYXZhVGV4dCwgdGhpcy5nZXRKYXZhVGV4dCgpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlRWRpdG9yKGVsZW1lbnROYW1lOiBzdHJpbmcpOiBBY2VBamF4LkVkaXRvciB7XHJcbiAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnROYW1lKTtcclxuICAgICAgICBlZGl0b3Iuc2V0VGhlbWUoXCJhY2UvdGhlbWUvbW9ub2thaVwiKTtcclxuICAgICAgICBlZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICBlZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcclxuICAgICAgICBlZGl0b3IucmVuZGVyZXIuc2V0U2hvd0d1dHRlcihmYWxzZSk7XHJcbiAgICAgICAgZWRpdG9yLnNldFJlYWRPbmx5KHRydWUpO1xyXG4gICAgICAgIHJldHVybiBlZGl0b3I7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldEphdmFUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIGlzT25QYWdlID0gdGhpcy5rb1Nob3dBc1dpbmRvdygpID09IFwicGFnZVwiO1xyXG4gICAgICAgIHZhciBzdHIgPSB0aGlzLmdldFNhdmVGdW5jKCkgKyBcIlxcblxcblwiO1xyXG4gICAgICAgIHN0ciArPSBpc09uUGFnZSA/IHRoaXMucGxhdGZvcm1KU29uUGFnZVt0aGlzLmtvTGlicmFyeVZlcnNpb24oKV0gOiB0aGlzLnBsYXRmb3JtSlNvbldpbmRvd1t0aGlzLmtvTGlicmFyeVZlcnNpb24oKV07XHJcbiAgICAgICAgdmFyIGpzb25UZXh0ID0gXCJ2YXIgc3VydmV5SlNPTiA9IFwiICsgdGhpcy5nZXRKc29uVGV4dCgpICsgXCJcXG5cXG5cIjtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTZXRDc3MoKSArIFwiXFxuXCIgKyBqc29uVGV4dCArIHN0cjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0U2V0Q3NzKCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMua29TY3JpcHRVc2luZygpICE9IFwiYm9vdHN0cmFwXCIpIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHJldHVybiBcIlN1cnZleS5TdXJ2ZXkuY3NzVHlwZSA9IFxcXCJib290c3RyYXBcXFwiO1xcblwiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTYXZlRnVuYygpIHtcclxuICAgICAgICByZXR1cm4gXCJmdW5jdGlvbiBzZW5kRGF0YVRvU2VydmVyKHN1cnZleSkge1xcblwiICsgdGhpcy5nZXRTYXZlRnVuY0NvZGUoKSArIFwiXFxufVwiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTYXZlRnVuY0NvZGUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMua29IYXNJZHMoKSkgcmV0dXJuIFwiICAgIHN1cnZleS5zZW5kUmVzdWx0KCdcIiArIHRoaXMuc3VydmV5UG9zdElkICsgXCInKTtcIjtcclxuICAgICAgICByZXR1cm4gXCIgICAgLy9zZW5kIEFqYXggcmVxdWVzdCB0byB5b3VyIHdlYiBzZXJ2ZXIuXFxuICAgIGFsZXJ0KFxcXCJUaGUgcmVzdWx0cyBhcmU6XFxcIiArIEpTT04uc3RyaW5naWZ5KHMuZGF0YSkpO1wiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRKc29uVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICh0aGlzLmtvSGFzSWRzKCkgJiYgdGhpcy5rb0xvYWRTdXJ2ZXkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJ7IHN1cnZleUlkOiAnXCIgKyB0aGlzLnN1cnZleUlkICsgXCInfVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZVZhbGlkSlNPTikgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuanNvbik7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeSh0aGlzLmpzb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRUZXh0VG9FZGl0b3IoZWRpdG9yOiBBY2VBamF4LkVkaXRvciwga29UZXh0OiBhbnksIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmIChlZGl0b3IpIGVkaXRvci5zZXRWYWx1ZSh0ZXh0KTtcclxuICAgICAgICBpZiAoa29UZXh0KSBrb1RleHQodGV4dCk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3VydmV5RW1iZWRpbmdXaW5kb3cudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlVbmRvUmVkbyB7XHJcbiAgICBwcml2YXRlIGl0ZW1zOiBBcnJheTxVbmRvUmVkb0l0ZW0+O1xyXG4gICAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICBwdWJsaWMga29DYW5VbmRvOiBhbnk7IGtvQ2FuUmVkbzogYW55O1xyXG4gICAgcHVibGljIG1heGltdW1Db3VudDogbnVtYmVyID0gMTA7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLml0ZW1zID0gW107XHJcbiAgICAgICAgdGhpcy5rb0NhblVuZG8gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvQ2FuUmVkbyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcclxuICAgICAgICB0aGlzLmtvQ2FuVW5kbyhmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5rb0NhblJlZG8oZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldEN1cnJlbnQoc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBzZWxlY3RlZE9iak5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBpdGVtID0gbmV3IFVuZG9SZWRvSXRlbSgpO1xyXG4gICAgICAgIGl0ZW0uc3VydmV5SlNPTiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChzdXJ2ZXkpO1xyXG4gICAgICAgIGl0ZW0uc2VsZWN0ZWRPYmpOYW1lID0gc2VsZWN0ZWRPYmpOYW1lO1xyXG4gICAgICAgIGlmICh0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaW5kZXggKyAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlT2xkRGF0YSgpO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgdGhpcy51cGRhdGVDYW5VbmRvUmVkbygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHVuZG8oKTogVW5kb1JlZG9JdGVtIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuVW5kbykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9VbmRvUmVkbygtMSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgcmVkbygpOiBVbmRvUmVkb0l0ZW0gIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuUmVkbykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9VbmRvUmVkbygxKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlQ2FuVW5kb1JlZG8oKSB7XHJcbiAgICAgICAgdGhpcy5rb0NhblVuZG8odGhpcy5jYW5VbmRvKTtcclxuICAgICAgICB0aGlzLmtvQ2FuUmVkbyh0aGlzLmNhblJlZG8pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb1VuZG9SZWRvKGRJbmRleDogbnVtYmVyKTogVW5kb1JlZG9JdGVtIHtcclxuICAgICAgICB0aGlzLmluZGV4ICs9IGRJbmRleDtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhblVuZG9SZWRvKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPj0gMCAmJiB0aGlzLmluZGV4IDwgdGhpcy5pdGVtcy5sZW5ndGggPyB0aGlzLml0ZW1zW3RoaXMuaW5kZXhdIDogbnVsbDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgY2FuVW5kbygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA+PSAxICYmIHRoaXMuaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aDtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXQgY2FuUmVkbygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPiAxICYmIHRoaXMuaW5kZXggPCB0aGlzLml0ZW1zLmxlbmd0aCAtIDE7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbW92ZU9sZERhdGEoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoIC0gMSA8IHRoaXMubWF4aW11bUNvdW50KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoMCwgdGhpcy5pdGVtcy5sZW5ndGggLSB0aGlzLm1heGltdW1Db3VudCAtIDEpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVW5kb1JlZG9JdGVtIHtcclxuICAgIHN1cnZleUpTT046IGFueTtcclxuICAgIHNlbGVjdGVkT2JqTmFtZTogc3RyaW5nO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3VuZG9yZWRvLnRzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tYWluLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAqIGFzIGtvIGZyb20gXCJrbm9ja291dFwiO1xyXG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XHJcbmltcG9ydCB7U3VydmV5T2JqZWN0RWRpdG9yfSBmcm9tIFwiLi9vYmplY3RFZGl0b3JcIjtcclxuaW1wb3J0IHtTdXJ2ZXlQYWdlc0VkaXRvcn0gZnJvbSBcIi4vcGFnZXNFZGl0b3JcIjtcclxuaW1wb3J0IHtTdXJ2ZXlFbWJlZGluZ1dpbmRvd30gZnJvbSBcIi4vc3VydmV5RW1iZWRpbmdXaW5kb3dcIjtcclxuaW1wb3J0IHtTdXJ2ZXlPYmplY3RzfSBmcm9tIFwiLi9zdXJ2ZXlPYmplY3RzXCI7XHJcbmltcG9ydCB7U3VydmV5VmVyYnN9IGZyb20gXCIuL29iamVjdFZlcmJzXCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JTaG93V2luZG93fSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25FZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7U3VydmV5SlNPTkVkaXRvcn0gZnJvbSBcIi4vc3VydmV5SlNPTkVkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleVRleHRXb3JrZXJ9IGZyb20gXCIuL3RleHRXb3JrZXJcIlxyXG5pbXBvcnQge1N1cnZleVVuZG9SZWRvLCBVbmRvUmVkb0l0ZW19IGZyb20gXCIuL3VuZG9yZWRvXCI7XHJcbmltcG9ydCB7U3VydmV5SGVscGVyLCBPYmpUeXBlfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcclxuaW1wb3J0IHtEcmFnRHJvcEhlbHBlcn0gZnJvbSBcIi4vZHJhZ2Ryb3BoZWxwZXJcIjtcclxuaW1wb3J0IHtTdXJ2ZXlKU09ONX0gZnJvbSBcIi4vanNvbjVcIjtcclxudmFyIHRlbXBsYXRlRWRpdG9ySHRtbCA9IHJlcXVpcmUoXCJodG1sLWxvYWRlcj9pbnRlcnBvbGF0ZSF2YWwtbG9hZGVyIS4vdGVtcGxhdGVzL2VudHJ5Lmh0bWxcIik7XHJcbnZhciB0ZW1wbGF0ZVBhZ2VIdG1sID0gcmVxdWlyZShcImh0bWwtbG9hZGVyP2ludGVycG9sYXRlIXZhbC1sb2FkZXIhLi90ZW1wbGF0ZXMuc3VydmV5L3RlbXBsYXRlX3BhZ2UuaHRtbFwiKTtcclxudmFyIHRlbXBsYXRlUXVlc3Rpb25IdG1sID0gcmVxdWlyZShcImh0bWwtbG9hZGVyP2ludGVycG9sYXRlIXZhbC1sb2FkZXIhLi90ZW1wbGF0ZXMuc3VydmV5L3RlbXBsYXRlX3F1ZXN0aW9uLmh0bWxcIik7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5RWRpdG9yIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdE5ld1N1cnZleVRleHQ6IHN0cmluZyA9IFwieyBwYWdlczogWyB7IG5hbWU6ICdwYWdlMSd9XSB9XCI7XHJcbiAgICBwcml2YXRlIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHN1cnZleWpzOiBIVE1MRWxlbWVudDtcclxuICAgIHByaXZhdGUgc3VydmV5anNFeGFtcGxlOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIGpzb25FZGl0b3I6IFN1cnZleUpTT05FZGl0b3I7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XHJcbiAgICBwcml2YXRlIHF1ZXN0aW9uRWRpdG9yV2luZG93OiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvclNob3dXaW5kb3c7XHJcbiAgICBwcml2YXRlIHBhZ2VzRWRpdG9yOiBTdXJ2ZXlQYWdlc0VkaXRvcjtcclxuICAgIHByaXZhdGUgc3VydmV5RW1iZWRpbmc6IFN1cnZleUVtYmVkaW5nV2luZG93O1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlPYmplY3RzOiBTdXJ2ZXlPYmplY3RzO1xyXG4gICAgcHJpdmF0ZSBzdXJ2ZXlWZXJiczogU3VydmV5VmVyYnM7XHJcbiAgICBwcml2YXRlIHVuZG9SZWRvOiBTdXJ2ZXlVbmRvUmVkbztcclxuICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICBwcml2YXRlIHNhdmVTdXJ2ZXlGdW5jVmFsdWU6IChubzogbnVtYmVyLCBvblNhdmVDYWxsYmFjazogKG5vOiBudW1iZXIsIGlzU3VjY2VzczogYm9vbGVhbikgPT4gdm9pZCkgPT4gdm9pZDtcclxuICAgIHByaXZhdGUgb3B0aW9uczogYW55O1xyXG4gICAgcHJpdmF0ZSBzdGF0ZVZhbHVlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgcHJpdmF0ZSBkcmFnRHJvcEhlbHBlcjogRHJhZ0Ryb3BIZWxwZXIgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBzaG93SlNPTkVkaXRvclRhYlZhbHVlOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBzaG93VGVzdFN1cnZleVRhYlZhbHVlOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBzaG93RW1iZWRlZFN1cnZleVRhYlZhbHVlOiBib29sZWFuO1xyXG5cclxuICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgIHB1YmxpYyBzdXJ2ZXlQb3N0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwdWJsaWMgcXVlc3Rpb25UeXBlczogc3RyaW5nW107XHJcbiAgICBwdWJsaWMga29DdXN0b21Ub29sYm94UXVlc3Rpb25zOiBhbnk7XHJcbiAgICBwdWJsaWMgY3VzdG9tVG9vbGJveFF1ZXN0aW9uTWF4Q291bnQ6IG51bWJlciA9IDM7XHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVWYWxpZEpTT05DaGFuZ2VkQ2FsbGJhY2s6IChnZW5lcmF0ZVZhbGlkSlNPTjogYm9vbGVhbikgPT4gdm9pZDtcclxuICAgIHB1YmxpYyBhbHdheVNhdmVUZXh0SW5Qcm9wZXJ0eUVkaXRvcnM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHB1YmxpYyBvbkNhblNob3dQcm9wZXJ0eTogU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleUVkaXRvciwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleUVkaXRvciwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuXHJcbiAgICBrb0lzU2hvd0Rlc2lnbmVyOiBhbnk7XHJcbiAgICBrb1ZpZXdUeXBlOiBhbnk7XHJcbiAgICBrb0NhbkRlbGV0ZU9iamVjdDogYW55O1xyXG4gICAga29PYmplY3RzOiBhbnk7IGtvU2VsZWN0ZWRPYmplY3Q6IGFueTtcclxuICAgIGtvU2hvd1NhdmVCdXR0b246IGFueTtcclxuICAgIGtvR2VuZXJhdGVWYWxpZEpTT046IGFueTsga29TaG93T3B0aW9uczogYW55OyBrb1Rlc3RTdXJ2ZXlXaWR0aDogYW55O1xyXG4gICAgc2VsZWN0RGVzaWduZXJDbGljazogYW55OyBzZWxlY3RFZGl0b3JDbGljazogYW55OyBzZWxlY3RUZXN0Q2xpY2s6IGFueTsgc2VsZWN0RW1iZWRDbGljazogYW55O1xyXG4gICAgZ2VuZXJhdGVWYWxpZEpTT05DbGljazogYW55OyBnZW5lcmF0ZVJlYWRhYmxlSlNPTkNsaWNrOiBhbnk7XHJcbiAgICBkb1VuZG9DbGljazogYW55OyBkb1JlZG9DbGljazogYW55O1xyXG4gICAgZGVsZXRlT2JqZWN0Q2xpY2s6IGFueTtcclxuICAgIGtvU3RhdGU6IGFueTtcclxuICAgIHJ1blN1cnZleUNsaWNrOiBhbnk7IGVtYmVkaW5nU3VydmV5Q2xpY2s6IGFueTtcclxuICAgIHNhdmVCdXR0b25DbGljazogYW55O1xyXG4gICAgZHJhZ2dpbmdRdWVzdGlvbjogYW55OyBjbGlja1F1ZXN0aW9uOiBhbnk7XHJcbiAgICBkcmFnZ2luZ0NvcGllZFF1ZXN0aW9uOiBhbnk7IGNsaWNrQ3VzdG9tVG9vbGJveFF1ZXN0aW9uOiBhbnk7XHJcbiAgICBkcmFnRW5kOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsLCBvcHRpb25zOiBhbnkgPSBudWxsKSB7XHJcblxyXG4gICAgICAgIHRoaXMua29TaG93T3B0aW9ucyA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvR2VuZXJhdGVWYWxpZEpTT04gPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMua29DdXN0b21Ub29sYm94UXVlc3Rpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5rb0NhbkRlbGV0ZU9iamVjdCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMua29TdGF0ZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvU2hvd1NhdmVCdXR0b24gPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvVGVzdFN1cnZleVdpZHRoID0ga28ub2JzZXJ2YWJsZShcIjEwMCVcIik7XHJcbiAgICAgICAgdGhpcy5zYXZlQnV0dG9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZG9TYXZlKCk7IH07XHJcbiAgICAgICAgdGhpcy5rb09iamVjdHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWRPYmplY3QgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb1NlbGVjdGVkT2JqZWN0LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdENoYW5nZWQobmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbHVlIDogbnVsbCk7IH0pO1xyXG4gICAgICAgIHRoaXMua29HZW5lcmF0ZVZhbGlkSlNPTi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5vcHRpb25zKSBzZWxmLm9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgc2VsZi5vcHRpb25zLmdlbmVyYXRlVmFsaWRKU09OID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLmdlbmVyYXRlVmFsaWRKU09OQ2hhbmdlZENhbGxiYWNrKSBzZWxmLmdlbmVyYXRlVmFsaWRKU09OQ2hhbmdlZENhbGxiYWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSBuZXcgU3VydmV5T2JqZWN0cyh0aGlzLmtvT2JqZWN0cywgdGhpcy5rb1NlbGVjdGVkT2JqZWN0KTtcclxuICAgICAgICB0aGlzLnVuZG9SZWRvID0gbmV3IFN1cnZleVVuZG9SZWRvKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMgPSBuZXcgU3VydmV5VmVyYnMoZnVuY3Rpb24gKCkgeyBzZWxmLnNldE1vZGlmaWVkKCk7IH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yID0gbmV3IFN1cnZleU9iamVjdEVkaXRvcih0aGlzLm9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25DYW5TaG93UHJvcGVydHlDYWxsYmFjayA9IGZ1bmN0aW9uIChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGYub25DYW5TaG93T2JqZWN0UHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb25FZGl0b3JXaW5kb3cgPSBuZXcgU3VydmV5UHJvcGVydHlFZGl0b3JTaG93V2luZG93KCk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbkVkaXRvcldpbmRvdy5vbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrID0gZnVuY3Rpb24gKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5vbkNhblNob3dPYmplY3RQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYWdlc0VkaXRvciA9IG5ldyBTdXJ2ZXlQYWdlc0VkaXRvcigoKSA9PiB7IHNlbGYuYWRkUGFnZSgpOyB9LCAocGFnZTogU3VydmV5LlBhZ2UpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChwYWdlKTsgfSxcclxuICAgICAgICAgICAgKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpID0+IHsgc2VsZi5tb3ZlUGFnZShpbmRleEZyb20sIGluZGV4VG8pOyB9LCAocGFnZTogU3VydmV5LlBhZ2UpID0+IHsgc2VsZi5kZWxldGVDdXJyZW50T2JqZWN0KCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcgPSBuZXcgU3VydmV5RW1iZWRpbmdXaW5kb3coKTtcclxuXHJcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlID0ga28ub2JzZXJ2YWJsZShcImRlc2lnbmVyXCIpO1xyXG4gICAgICAgIHRoaXMua29Jc1Nob3dEZXNpZ25lciA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYua29WaWV3VHlwZSgpID09IFwiZGVzaWduZXJcIjsgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3REZXNpZ25lckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dEZXNpZ25lcigpOyB9O1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RWRpdG9yQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0pzb25FZGl0b3IoKTsgfTtcclxuICAgICAgICB0aGlzLnNlbGVjdFRlc3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93VGVzdFN1cnZleSgpOyB9O1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RW1iZWRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93RW1iZWRFZGl0b3IoKTsgfTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlVmFsaWRKU09OQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29HZW5lcmF0ZVZhbGlkSlNPTih0cnVlKTsgfTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlUmVhZGFibGVKU09OQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29HZW5lcmF0ZVZhbGlkSlNPTihmYWxzZSk7IH07XHJcbiAgICAgICAgdGhpcy5ydW5TdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93TGl2ZVN1cnZleSgpOyB9O1xyXG4gICAgICAgIHRoaXMuZW1iZWRpbmdTdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93U3VydmV5RW1iZWRpbmcoKTsgfTtcclxuICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUN1cnJlbnRPYmplY3QoKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdnaW5nUXVlc3Rpb24gPSBmdW5jdGlvbiAocXVlc3Rpb25UeXBlLCBlKSB7IHNlbGYuZG9EcmFnZ2luZ1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgZSk7IH07XHJcbiAgICAgICAgdGhpcy5jbGlja1F1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9uVHlwZSkgeyBzZWxmLmRvQ2xpY2tRdWVzdGlvbihxdWVzdGlvblR5cGUpOyB9O1xyXG4gICAgICAgIHRoaXMuZHJhZ2dpbmdDb3BpZWRRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtLCBlKSB7IHNlbGYuZG9EcmFnZ2luZ0NvcGllZFF1ZXN0aW9uKGl0ZW0uanNvbiwgZSk7IH07XHJcbiAgICAgICAgdGhpcy5jbGlja0N1c3RvbVRvb2xib3hRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYuZG9DbGlja0N1c3RvbVRvb2xib3hRdWVzdGlvbihpdGVtLmpzb24pOyB9O1xyXG4gICAgICAgIHRoaXMuZHJhZ0VuZCA9IGZ1bmN0aW9uIChpdGVtLCBlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIuZW5kKCk7IH07XHJcblxyXG4gICAgICAgIHRoaXMuZG9VbmRvQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZG9VbmRvUmVkbyhzZWxmLnVuZG9SZWRvLnVuZG8oKSk7IH07XHJcbiAgICAgICAgdGhpcy5kb1JlZG9DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kb1VuZG9SZWRvKHNlbGYudW5kb1JlZG8ucmVkbygpKTsgfTtcclxuXHJcbiAgICAgICAgdGhpcy5qc29uRWRpdG9yID0gbmV3IFN1cnZleUpTT05FZGl0b3IoKTtcclxuXHJcbiAgICAgICAgaWYgKHJlbmRlcmVkRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBzZXRPcHRpb25zKG9wdGlvbnM6IGFueSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblR5cGVzID0gdGhpcy5nZXRRdWVzdGlvblR5cGVzKCk7XHJcbiAgICAgICAgdGhpcy5zaG93SlNPTkVkaXRvclRhYlZhbHVlID0gb3B0aW9ucyAmJiB0eXBlb2YgKG9wdGlvbnMuc2hvd0pTT05FZGl0b3JUYWIpICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMuc2hvd0pTT05FZGl0b3JUYWIgOiB0cnVlO1xyXG4gICAgICAgIHRoaXMuc2hvd1Rlc3RTdXJ2ZXlUYWJWYWx1ZSA9IG9wdGlvbnMgJiYgdHlwZW9mIChvcHRpb25zLnNob3dUZXN0U3VydmV5VGFiKSAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnNob3dUZXN0U3VydmV5VGFiIDogdHJ1ZTtcclxuICAgICAgICB0aGlzLnNob3dFbWJlZGVkU3VydmV5VGFiVmFsdWUgPSBvcHRpb25zICYmIHR5cGVvZiAob3B0aW9ucy5zaG93RW1iZWRlZFN1cnZleVRhYikgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zaG93RW1iZWRlZFN1cnZleVRhYiA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMua29TaG93T3B0aW9ucyhvcHRpb25zICYmIHR5cGVvZiAob3B0aW9ucy5zaG93T3B0aW9ucykgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zaG93T3B0aW9ucyA6IGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvR2VuZXJhdGVWYWxpZEpTT04odGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5nZW5lcmF0ZVZhbGlkSlNPTik7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IpIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN1cnZleVZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBhbnkgPSBudWxsLCBvcHRpb25zOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMpIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVFZGl0b3JIdG1sO1xyXG4gICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgbG9hZFN1cnZleShzdXJ2ZXlJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIG5ldyBTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleShzdXJ2ZXlJZCwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChzdWNjZXNzICYmIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi50ZXh0ID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCB0ZXh0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmtvSXNTaG93RGVzaWduZXIoKSkgcmV0dXJuIHRoaXMuZ2V0U3VydmV5VGV4dEZyb21EZXNpZ25lcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmpzb25FZGl0b3IudGV4dDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRleHRXb3JrZXIuaXNKc29uQ29ycmVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRleHRXb3JrZXIuc3VydmV5KSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0Rlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VW5kb1JlZG9DdXJyZW50U3RhdGUodHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJlZGl0b3JcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzdGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5zdGF0ZVZhbHVlOyB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0U3RhdGUodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RhdGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMua29TdGF0ZSh0aGlzLnN0YXRlKTtcclxuICAgIH1cclxuICAgIHNhdmVObzogbnVtYmVyID0gMDtcclxuICAgIHByb3RlY3RlZCBkb1NhdmUoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcInNhdmluZ1wiKTtcclxuICAgICAgICBpZiAodGhpcy5zYXZlU3VydmV5RnVuYykge1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVObysrO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN1cnZleUZ1bmModGhpcy5zYXZlTm8sXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBkb1NhdmVDYWxsYmFjayhubzogbnVtYmVyLCBpc1N1Y2Nlc3M6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKFwic2F2ZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc2F2ZU5vID09IG5vKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1N1Y2Nlc3MpIHNlbGYuc2V0U3RhdGUoXCJzYXZlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9lbHNlIFRPRE9cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0TW9kaWZpZWQoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShcIm1vZGlmaWVkXCIpO1xyXG4gICAgICAgIHRoaXMuc2V0VW5kb1JlZG9DdXJyZW50U3RhdGUoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0VW5kb1JlZG9DdXJyZW50U3RhdGUoY2xlYXJTdGF0ZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKGNsZWFyU3RhdGUpIHtcclxuICAgICAgICAgICAgdGhpcy51bmRvUmVkby5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2VsT2JqID0gdGhpcy5rb1NlbGVjdGVkT2JqZWN0KCkgPyB0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy51bmRvUmVkby5zZXRDdXJyZW50KHRoaXMuc3VydmV5VmFsdWUsIHNlbE9iaiA/IHNlbE9iai5uYW1lIDogbnVsbCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHNhdmVTdXJ2ZXlGdW5jKCkgeyByZXR1cm4gdGhpcy5zYXZlU3VydmV5RnVuY1ZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHNhdmVTdXJ2ZXlGdW5jKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNhdmVTdXJ2ZXlGdW5jVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLmtvU2hvd1NhdmVCdXR0b24odmFsdWUgIT0gbnVsbCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IHNob3dPcHRpb25zKCkgeyByZXR1cm4gdGhpcy5rb1Nob3dPcHRpb25zKCk7IH1cclxuICAgIHB1YmxpYyBzZXQgc2hvd09wdGlvbnModmFsdWU6IGJvb2xlYW4pIHsgdGhpcy5rb1Nob3dPcHRpb25zKHZhbHVlKTsgfVxyXG4gICAgcHVibGljIGdldCBzaG93SlNPTkVkaXRvclRhYigpIHsgcmV0dXJuIHRoaXMuc2hvd0pTT05FZGl0b3JUYWJWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93SlNPTkVkaXRvclRhYih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnNob3dKU09ORWRpdG9yVGFiVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBzaG93VGVzdFN1cnZleVRhYigpIHsgcmV0dXJuIHRoaXMuc2hvd1Rlc3RTdXJ2ZXlUYWJWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93VGVzdFN1cnZleVRhYih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnNob3dUZXN0U3VydmV5VGFiVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgcHVibGljIGdldCBzaG93RW1iZWRlZFN1cnZleVRhYigpIHsgcmV0dXJuIHRoaXMuc2hvd0VtYmVkZWRTdXJ2ZXlUYWJWYWx1ZTsgfVxyXG4gICAgcHVibGljIHNldCBzaG93RW1iZWRlZFN1cnZleVRhYih2YWx1ZTogYm9vbGVhbikgeyB0aGlzLnNob3dFbWJlZGVkU3VydmV5VGFiVmFsdWUgPSB2YWx1ZTsgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkNhblNob3dPYmplY3RQcm9wZXJ0eShvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBib29sZWFuIHtcclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHsgb2JqOiBvYmplY3QsIHByb3BlcnR5OiBwcm9wZXJ0eSwgY2FuU2hvdzogdHJ1ZSB9O1xyXG4gICAgICAgIHRoaXMub25DYW5TaG93UHJvcGVydHkuZmlyZSh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICByZXR1cm4gb3B0aW9ucy5jYW5TaG93O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0VGV4dFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmpzb25FZGl0b3IudGV4dCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFBhZ2UoKSB7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBTdXJ2ZXlIZWxwZXIuZ2V0TmV3UGFnZU5hbWUodGhpcy5zdXJ2ZXkucGFnZXMpO1xyXG4gICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5VmFsdWUuYWRkTmV3UGFnZShuYW1lKTtcclxuICAgICAgICB0aGlzLmFkZFBhZ2VUb1VJKHBhZ2UpO1xyXG4gICAgICAgIHRoaXMuc2V0TW9kaWZpZWQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXRMb2NTdHJpbmcoc3RyOiBzdHJpbmcpIHsgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoc3RyKTsgfVxyXG4gICAgcHJvdGVjdGVkIGdldFF1ZXN0aW9uVHlwZXMoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHZhciBhbGxUeXBlcyA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuZ2V0QWxsVHlwZXMoKTtcclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucyB8fCAhdGhpcy5vcHRpb25zLnF1ZXN0aW9uVHlwZXMgfHwgIXRoaXMub3B0aW9ucy5xdWVzdGlvblR5cGVzLmxlbmd0aCkgcmV0dXJuIGFsbFR5cGVzO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5xdWVzdGlvblR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvblR5cGUgPSB0aGlzLm9wdGlvbnMucXVlc3Rpb25UeXBlc1tpXTtcclxuICAgICAgICAgICAgaWYgKGFsbFR5cGVzLmluZGV4T2YocXVlc3Rpb25UeXBlKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChxdWVzdGlvblR5cGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG1vdmVQYWdlKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleS5wYWdlc1tpbmRleEZyb21dO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnBhZ2VzLnNwbGljZShpbmRleEZyb20sIDEpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnBhZ2VzLnNwbGljZShpbmRleFRvLCAwLCBwYWdlKTtcclxuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QocGFnZSlcclxuICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZFBhZ2VUb1VJKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5zdXJ2ZXkgPSB0aGlzLnN1cnZleVZhbHVlO1xyXG4gICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBvblF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLmFkZFF1ZXN0aW9uKHBhZ2UsIHF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25RdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0KHF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb2JqOiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB2YXIgaXNEZWZhdWx0ID0gcHJvcGVydHkuaXNEZWZhdWx0VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgIG9ialtwcm9wZXJ0eS5uYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eS5uYW1lID09IFwibmFtZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5uYW1lQ2hhbmdlZChvYmopO1xyXG4gICAgICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSA9PSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IuY2hhbmdlTmFtZSg8U3VydmV5LlBhZ2U+b2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvVW5kb1JlZG8oaXRlbTogVW5kb1JlZG9JdGVtKSB7XHJcbiAgICAgICAgdGhpcy5pbml0U3VydmV5KGl0ZW0uc3VydmV5SlNPTik7XHJcbiAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWRPYmpOYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxPYmogPSB0aGlzLmZpbmRPYmpCeU5hbWUoaXRlbS5zZWxlY3RlZE9iak5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoc2VsT2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHNlbE9iaik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnVuZG9SZWRvLmtvQ2FuVW5kbygpID8gXCJtb2RpZmllZFwiIDogXCJzYXZlZFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZmluZE9iakJ5TmFtZShuYW1lOiBzdHJpbmcpOiBTdXJ2ZXkuQmFzZSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlOYW1lKG5hbWUpO1xyXG4gICAgICAgIGlmIChwYWdlKSByZXR1cm4gcGFnZTtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uQmFzZT50aGlzLnN1cnZleS5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lKTtcclxuICAgICAgICBpZiAocXVlc3Rpb24pIHJldHVybiBxdWVzdGlvbjtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2FuU3dpdGNoVmlld1R5cGUobmV3VHlwZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKG5ld1R5cGUgJiYgdGhpcy5rb1ZpZXdUeXBlKCkgPT0gbmV3VHlwZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmtvVmlld1R5cGUoKSAhPSBcImVkaXRvclwiKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAoIXRoaXMuanNvbkVkaXRvci5pc0pzb25Db3JyZWN0KSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KHRoaXMuZ2V0TG9jU3RyaW5nKFwiZWQuY29ycmVjdEpTT05cIikpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5qc29uRWRpdG9yLnN1cnZleSkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93RGVzaWduZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhblN3aXRjaFZpZXdUeXBlKFwiZGVzaWduZXJcIikpIHJldHVybjtcclxuICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJkZXNpZ25lclwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd0pzb25FZGl0b3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMua29WaWV3VHlwZSgpID09IFwiZWRpdG9yXCIpIHJldHVybjtcclxuICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2hvdyh0aGlzLmdldFN1cnZleVRleHRGcm9tRGVzaWduZXIoKSk7XHJcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlKFwiZWRpdG9yXCIpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93VGVzdFN1cnZleSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY2FuU3dpdGNoVmlld1R5cGUobnVsbCkpIHJldHVybjtcclxuICAgICAgICB0aGlzLnNob3dMaXZlU3VydmV5KCk7XHJcbiAgICAgICAgdGhpcy5rb1ZpZXdUeXBlKFwidGVzdFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd0VtYmVkRWRpdG9yKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jYW5Td2l0Y2hWaWV3VHlwZShcImVtYmVkXCIpKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5zaG93U3VydmV5RW1iZWRpbmcoKTtcclxuICAgICAgICB0aGlzLmtvVmlld1R5cGUoXCJlbWJlZFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0U3VydmV5VGV4dEZyb21EZXNpZ25lcigpIHtcclxuICAgICAgICB2YXIganNvbiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLnN1cnZleSk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT04pIHJldHVybiBKU09OLnN0cmluZ2lmeShqc29uLCBudWxsLCAxKTtcclxuICAgICAgICByZXR1cm4gbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KGpzb24sIG51bGwsIDEpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdENoYW5nZWQob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgIHZhciBjYW5EZWxldGVPYmplY3QgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0ID0gb2JqO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMub2JqID0gb2JqO1xyXG4gICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKTtcclxuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICBjYW5EZWxldGVPYmplY3QgPSB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGggPiAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShvYmopO1xyXG4gICAgICAgICAgICBjYW5EZWxldGVPYmplY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0obnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua29DYW5EZWxldGVPYmplY3QoY2FuRGVsZXRlT2JqZWN0KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnJlbmRlcmVkRWxlbWVudCA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICB0aGlzLnN1cnZleWpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc1wiKTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlqcykge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5anMub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSA0Nikgc2VsZi5kZWxldGVRdWVzdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAzOCB8fCBlLmtleUNvZGUgPT0gNDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdFF1ZXN0aW9uKGUua2V5Q29kZSA9PSAzOCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5SlNPTjUoKS5wYXJzZShTdXJ2ZXlFZGl0b3IuZGVmYXVsdE5ld1N1cnZleVRleHQpKTtcclxuICAgICAgICB0aGlzLnNldFVuZG9SZWRvQ3VycmVudFN0YXRlKHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLmpzb25FZGl0b3IuaW5pdCgpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpbml0U3VydmV5KGpzb246IGFueSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkoKTtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gbmV3IERyYWdEcm9wSGVscGVyKDxTdXJ2ZXkuSVN1cnZleT50aGlzLnN1cnZleSwgZnVuY3Rpb24gKCkgeyBzZWxmLnNldE1vZGlmaWVkKCkgfSk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZVtcImRyYWdEcm9wSGVscGVyXCJdID0gdGhpcy5kcmFnRHJvcEhlbHBlcjtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wic2V0SnNvbk9iamVjdFwiXShqc29uKTsgLy9UT0RPXHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuaXNFbXB0eSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkobmV3IFN1cnZleUpTT041KCkucGFyc2UoU3VydmV5RWRpdG9yLmRlZmF1bHROZXdTdXJ2ZXlUZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vVE9ETyByZW1vdmUgdGhlIGxpbmUgYWJvdmUgYW5kIGNhbGwgdGhlIG1ldGhvZCBkaXJlY3RseS5cclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXlbXCJzZXREZXNpZ25Nb2RlXCJdKSB0aGlzLnN1cnZleVtcInNldERlc2lnbk1vZGVcIl0odHJ1ZSk7XHJcbiAgICAgICAgZWxzZSB0aGlzLnN1cnZleS5tb2RlID0gXCJkZXNpZ25lclwiO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5zdXJ2ZXkgPSB0aGlzLnN1cnZleTtcclxuICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSg8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmVyYnMuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChzZW5kZXJbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25FZGl0UXVlc3Rpb25cIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5zaG93UXVlc3Rpb25FZGl0b3Ioc2VsZi5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWUpOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25Db3B5UXVlc3Rpb25cIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5hZGRDdXN0b21Ub29sYm94UXVlc3Rpb24oc2VsZi5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWUpOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlW1wib25GYXN0Q29weVF1ZXN0aW9uXCJdLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYuZmFzdENvcHlRdWVzdGlvbihzZWxmLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvbkRlbGV0ZUN1cnJlbnRPYmplY3RcIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5kZWxldGVDdXJyZW50T2JqZWN0KCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25Qcm9jZXNzSHRtbC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBvcHRpb25zLmh0bWwgPSBzZWxmLnByb2Nlc3NIdG1sKG9wdGlvbnMuaHRtbCk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25DdXJyZW50UGFnZUNoYW5nZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5wYWdlc0VkaXRvci5zZXRTZWxlY3RlZFBhZ2UoPFN1cnZleS5QYWdlPnNlbmRlci5jdXJyZW50UGFnZSk7IH0pO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUub25RdWVzdGlvbkFkZGVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvbkFkZGVkKG9wdGlvbnMucXVlc3Rpb24pOyB9KTtcclxuICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvblJlbW92ZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzSHRtbChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghaHRtbCkgcmV0dXJuIGh0bWw7XHJcbiAgICAgICAgdmFyIHNjcmlwdFJlZ0V4ID0gLzxzY3JpcHRcXGJbXjxdKig/Oig/ITxcXC9zY3JpcHQ+KTxbXjxdKikqPFxcL3NjcmlwdD4vZ2k7XHJcbiAgICAgICAgd2hpbGUgKHNjcmlwdFJlZ0V4LnRlc3QoaHRtbCkpIHtcclxuICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZShzY3JpcHRSZWdFeCwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb0RyYWdnaW5nUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBhbnksIGUpIHtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ05ld1F1ZXN0aW9uKGUsIHF1ZXN0aW9uVHlwZSwgdGhpcy5nZXROZXdRdWVzdGlvbk5hbWUoKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRvRHJhZ2dpbmdDb3BpZWRRdWVzdGlvbihqc29uOiBhbnksIGUpIHtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ0NvcGllZFF1ZXN0aW9uKGUsIHRoaXMuZ2V0TmV3UXVlc3Rpb25OYW1lKCksIGpzb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkb0NsaWNrUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLmRvQ2xpY2tRdWVzdGlvbkNvcmUoU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIHRoaXMuZ2V0TmV3UXVlc3Rpb25OYW1lKCkpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9DbGlja0N1c3RvbVRvb2xib3hRdWVzdGlvbihqc29uOiBhbnkpIHtcclxuICAgICAgICB2YXIgbmFtZSA9IHRoaXMuZ2V0TmV3UXVlc3Rpb25OYW1lKCk7XHJcbiAgICAgICAgdmFyIHF1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihqc29uW1widHlwZVwiXSwgbmFtZSk7XHJcbiAgICAgICAgbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9PYmplY3QoanNvbiwgcXVlc3Rpb24pO1xyXG4gICAgICAgIHF1ZXN0aW9uLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuZG9DbGlja1F1ZXN0aW9uQ29yZShxdWVzdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5ld1F1ZXN0aW9uTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0TmV3UXVlc3Rpb25OYW1lKHRoaXMuc3VydmV5LmdldEFsbFF1ZXN0aW9ucygpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZG9DbGlja1F1ZXN0aW9uQ29yZShxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgaWYgKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKSArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24ocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRlbGV0ZVF1ZXN0aW9uKCkge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0U2VsZWN0ZWRPYmpBc1F1ZXN0aW9uKCk7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlQ3VycmVudE9iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc2VsZWN0UXVlc3Rpb24oaXNVcDogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0U2VsZWN0ZWRPYmpBc1F1ZXN0aW9uKCk7XHJcbiAgICAgICAgaWYgKHF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5zZWxlY3ROZXh0UXVlc3Rpb24oaXNVcClcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFNlbGVjdGVkT2JqQXNRdWVzdGlvbigpOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICB2YXIgb2JqID0gdGhpcy5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWU7XHJcbiAgICAgICAgaWYgKCFvYmopIHJldHVybiBudWxsO1xyXG4gICAgICAgIHJldHVybiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUXVlc3Rpb24gPyA8U3VydmV5LlF1ZXN0aW9uQmFzZT4ob2JqKTogbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZGVsZXRlQ3VycmVudE9iamVjdCgpIHtcclxuICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdCh0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGN1c3RvbVRvb2xib3hRdWVzdGlvbnNUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHRoaXMua29DdXN0b21Ub29sYm94UXVlc3Rpb25zKCkubGVuZ3RoID09IDApIHJldHVybiBcIlwiO1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmtvQ3VzdG9tVG9vbGJveFF1ZXN0aW9ucygpKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgY3VzdG9tVG9vbGJveFF1ZXN0aW9uc1RleHQodmFsOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvQ3VzdG9tVG9vbGJveFF1ZXN0aW9ucyhbXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKHZhbCk7XHJcbiAgICAgICAgICAgIGlmIChqc29uICYmIEFycmF5LmlzQXJyYXkoanNvbikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29DdXN0b21Ub29sYm94UXVlc3Rpb25zKGpzb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHNob3dRdWVzdGlvbkVkaXRvcihxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uRWRpdG9yV2luZG93LnNob3cocXVlc3Rpb24sIGZ1bmN0aW9uIChxdWVzdGlvbikgeyBzZWxmLm9uUXVlc3Rpb25FZGl0b3JDaGFuZ2VkKHF1ZXN0aW9uKTsgfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUXVlc3Rpb25FZGl0b3JDaGFuZ2VkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLm5hbWVDaGFuZ2VkKHF1ZXN0aW9uKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLk9iamVjdENoYW5nZWQoKTtcclxuICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkQ3VzdG9tVG9vbGJveFF1ZXN0aW9uKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShxdWVzdGlvbik7XHJcbiAgICAgICAgaWYgKG9ialR5cGUgIT0gT2JqVHlwZS5RdWVzdGlvbikgcmV0dXJuO1xyXG4gICAgICAgIHZhciBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHF1ZXN0aW9uKTtcclxuICAgICAgICBqc29uLnR5cGUgPSBxdWVzdGlvbi5nZXRUeXBlKCk7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmdldEN1c3RvbVRvb2xib3hRdWVzdGlvbkJ5TmFtZShxdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICBpZiAoaXRlbSkge1xyXG4gICAgICAgICAgICBpdGVtLmpzb24gPSBqc29uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMua29DdXN0b21Ub29sYm94UXVlc3Rpb25zLnB1c2goeyBuYW1lOiBxdWVzdGlvbi5uYW1lLCBqc29uOiBqc29uIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5rb0N1c3RvbVRvb2xib3hRdWVzdGlvbnMoKS5sZW5ndGggPiB0aGlzLmN1c3RvbVRvb2xib3hRdWVzdGlvbk1heENvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29DdXN0b21Ub29sYm94UXVlc3Rpb25zLnNwbGljZSgwLCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZhc3RDb3B5UXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICB2YXIganNvbiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChxdWVzdGlvbik7XHJcbiAgICAgICAganNvbi50eXBlID0gcXVlc3Rpb24uZ2V0VHlwZSgpO1xyXG4gICAgICAgIHRoaXMuZG9DbGlja0N1c3RvbVRvb2xib3hRdWVzdGlvbigganNvbiApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q3VzdG9tVG9vbGJveFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMua29DdXN0b21Ub29sYm94UXVlc3Rpb25zKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXRlbXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gaXRlbXNbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBkZWxldGVPYmplY3Qob2JqOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xyXG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW1vdmVQYWdlKG9iaik7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IucmVtb3ZlUGFnZShvYmopO1xyXG4gICAgICAgICAgICB0aGlzLnNldE1vZGlmaWVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UucmVtb3ZlUXVlc3Rpb24ob2JqKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRNb2RpZmllZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgc2hvd0xpdmVTdXJ2ZXkoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnN1cnZleWpzRXhhbXBsZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBqc29uID0gdGhpcy5nZXRTdXJ2ZXlKU09OKCk7XHJcbiAgICAgICAgaWYgKGpzb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoanNvbi5jb29raWVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUganNvbi5jb29raWVOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5LlN1cnZleShqc29uKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgc3VydmV5anNFeGFtcGxlUmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNFeGFtcGxlUmVzdWx0c1wiKTtcclxuICAgICAgICAgICAgdmFyIHN1cnZleWpzRXhhbXBsZXJlUnVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVyZVJ1blwiKTtcclxuICAgICAgICAgICAgaWYgKHN1cnZleWpzRXhhbXBsZVJlc3VsdHMpIHN1cnZleWpzRXhhbXBsZVJlc3VsdHMuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKHN1cnZleWpzRXhhbXBsZXJlUnVuKSBzdXJ2ZXlqc0V4YW1wbGVyZVJ1bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIHN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5KSA9PiB7IGlmIChzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzKSBzdXJ2ZXlqc0V4YW1wbGVSZXN1bHRzLmlubmVySFRNTCA9IHRoaXMuZ2V0TG9jU3RyaW5nKFwiZWQuc3VydmV5UmVzdWx0c1wiKSArIEpTT04uc3RyaW5naWZ5KHN1cnZleS5kYXRhKTsgaWYgKHN1cnZleWpzRXhhbXBsZXJlUnVuKSBzdXJ2ZXlqc0V4YW1wbGVyZVJ1bi5zdHlsZS5kaXNwbGF5ID0gXCJcIjsgfSk7XHJcbiAgICAgICAgICAgIHN1cnZleS5yZW5kZXIodGhpcy5zdXJ2ZXlqc0V4YW1wbGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlLmlubmVySFRNTCA9IHRoaXMuZ2V0TG9jU3RyaW5nKFwiZWQuY29ycmVjdEpTT05cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzaG93U3VydmV5RW1iZWRpbmcoKSB7XHJcbiAgICAgICAgdmFyIGpzb24gPSB0aGlzLmdldFN1cnZleUpTT04oKTtcclxuICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLmpzb24gPSBqc29uO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5SWQgPSB0aGlzLnN1cnZleUlkO1xyXG4gICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5UG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5nZW5lcmF0ZVZhbGlkSlNPTiA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZ2VuZXJhdGVWYWxpZEpTT047XHJcbiAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5zaG93KCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFN1cnZleUpTT04oKTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5rb0lzU2hvd0Rlc2lnbmVyKCkpIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5zdXJ2ZXkpO1xyXG4gICAgICAgIGlmICh0aGlzLmpzb25FZGl0b3IuaXNKc29uQ29ycmVjdCkgcmV0dXJuIG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLmpzb25FZGl0b3Iuc3VydmV5KTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlQW5ub3RhdGlvbnModGV4dDogc3RyaW5nLCBlcnJvcnM6IGFueVtdKTogQWNlQWpheC5Bbm5vdGF0aW9uW10ge1xyXG4gICAgICAgIHZhciBhbm5vdGF0aW9ucyA9IG5ldyBBcnJheTxBY2VBamF4LkFubm90YXRpb24+KCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gZXJyb3JzW2ldO1xyXG4gICAgICAgICAgICB2YXIgYW5ub3RhdGlvbjogQWNlQWpheC5Bbm5vdGF0aW9uID0geyByb3c6IGVycm9yLnBvc2l0aW9uLnN0YXJ0LnJvdywgY29sdW1uOiBlcnJvci5wb3NpdGlvbi5zdGFydC5jb2x1bW4sIHRleHQ6IGVycm9yLnRleHQsIHR5cGU6IFwiZXJyb3JcIiB9O1xyXG4gICAgICAgICAgICBhbm5vdGF0aW9ucy5wdXNoKGFubm90YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYW5ub3RhdGlvbnM7XHJcbiAgICB9XHJcbn1cclxuXHJcblN1cnZleS5TdXJ2ZXkuY3NzVHlwZSA9IFwiYm9vdHN0cmFwXCI7XHJcbm5ldyBTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0KCkucmVwbGFjZVRleHQodGVtcGxhdGVQYWdlSHRtbCwgXCJwYWdlXCIpO1xyXG5uZXcgU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCgpLnJlcGxhY2VUZXh0KHRlbXBsYXRlUXVlc3Rpb25IdG1sLCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUgPSBudWxsO1xyXG4gICAgdGhpcy5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgdGhpcy5vbkVkaXRRdWVzdGlvbiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHRoaXMub25Db3B5UXVlc3Rpb24gPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICB0aGlzLm9uRmFzdENvcHlRdWVzdGlvbiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgIHRoaXMub25EZWxldGVDdXJyZW50T2JqZWN0ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5lZGl0UXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkVkaXRRdWVzdGlvbi5maXJlKHNlbGYpOyB9O1xyXG4gICAgdGhpcy5jb3B5UXVlc3Rpb25DbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkNvcHlRdWVzdGlvbi5maXJlKHNlbGYpOyB9O1xyXG4gICAgdGhpcy5mYXN0Q29weVF1ZXN0aW9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25GYXN0Q29weVF1ZXN0aW9uLmZpcmUoc2VsZik7IH07XHJcbiAgICB0aGlzLmRlbGV0ZUN1cnJlbnRPYmplY3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vbkRlbGV0ZUN1cnJlbnRPYmplY3QuZmlyZShzZWxmKTsgfVxyXG4gICAgdGhpcy5rb0RyYWdnaW5nU291cmNlID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxufTtcclxuU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdID0gZnVuY3Rpb24odmFsdWU6IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgIGlmICh2YWx1ZSA9PSB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWU7XHJcbiAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgaWYgKG9sZFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICBvbGRWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0oKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRTZWxlY3RlZFF1ZXN0aW9uJzogb2xkVmFsdWUsICduZXdTZWxlY3RlZFF1ZXN0aW9uJzogdmFsdWUgfSk7XHJcbn07XHJcblN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wiZ2V0RWRpdG9yTG9jU3RyaW5nXCJdID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcodmFsdWUpO1xyXG59O1xyXG5cclxuU3VydmV5LlBhZ2UucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHRoaXMuZHJhZ0VudGVyQ291bnRlciA9IDA7XHJcbiAgICB0aGlzLmtvRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKC0xKTtcclxuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgIHRoaXMua29EcmFnZ2luZ0JvdHRvbSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgdGhpcy5rb0RyYWdnaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICBpZiAobmV3VmFsdWUgPCAwKSB7XHJcbiAgICAgICAgICAgIHNlbGYuZHJhZ0VudGVyQ291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHNlbGYua29EcmFnZ2luZ1F1ZXN0aW9uKG51bGwpO1xyXG4gICAgICAgICAgICBzZWxmLmtvRHJhZ2dpbmdCb3R0b20oZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gbmV3VmFsdWUgPj0gMCAmJiBuZXdWYWx1ZSA8IHNlbGYucXVlc3Rpb25zLmxlbmd0aCA/IHNlbGYucXVlc3Rpb25zW25ld1ZhbHVlXSA6IG51bGw7XHJcbiAgICAgICAgICAgIHNlbGYua29EcmFnZ2luZ1F1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgc2VsZi5rb0RyYWdnaW5nQm90dG9tKG5ld1ZhbHVlID09IHNlbGYucXVlc3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmtvRHJhZ2dpbmdRdWVzdGlvbi5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSkgbmV3VmFsdWUua29Jc0RyYWdnaW5nKHRydWUpOyB9KTtcclxuICAgIHRoaXMua29EcmFnZ2luZ1F1ZXN0aW9uLnN1YnNjcmliZShmdW5jdGlvbiAob2xkVmFsdWUpIHsgaWYgKG9sZFZhbHVlKSBvbGRWYWx1ZS5rb0lzRHJhZ2dpbmcoZmFsc2UpOyB9LCB0aGlzLCBcImJlZm9yZUNoYW5nZVwiKTtcclxuICAgIHRoaXMuZHJhZ0VudGVyID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZWxmLmRyYWdFbnRlckNvdW50ZXIrKzsgc2VsZi5kb0RyYWdFbnRlcihlKTsgfTtcclxuICAgIHRoaXMuZHJhZ0xlYXZlID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRW50ZXJDb3VudGVyLS07IGlmIChzZWxmLmRyYWdFbnRlckNvdW50ZXIgPT09IDApIHNlbGYuZG9EcmFnTGVhdmUoZSk7IH07XHJcbiAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0Ryb3AoZSk7IH07XHJcbn07XHJcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJvcFwiXSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICB2YXIgZHJhZ0Ryb3BIZWxwZXIgPSB0aGlzLmRhdGFbXCJkcmFnRHJvcEhlbHBlclwiXTtcclxuICAgIGlmIChkcmFnRHJvcEhlbHBlcikge1xyXG4gICAgICAgIGRyYWdEcm9wSGVscGVyLmRvRHJvcChlKTtcclxuICAgIH1cclxufTtcclxuU3VydmV5LlBhZ2UucHJvdG90eXBlW1wiZG9EcmFnRW50ZXJcIl0gPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5xdWVzdGlvbnMubGVuZ3RoID4gMCB8fCB0aGlzLmtvRHJhZ2dpbmcoKSA+IDApIHJldHVybjtcclxuICAgIHZhciBkcmFnRHJvcEhlbHBlciA9IHRoaXMuZGF0YVtcImRyYWdEcm9wSGVscGVyXCJdO1xyXG4gICAgaWYgKGRyYWdEcm9wSGVscGVyICYmIGRyYWdEcm9wSGVscGVyLmlzU3VydmV5RHJhZ2dpbmcoZSkpIHtcclxuICAgICAgICB0aGlzLmtvRHJhZ2dpbmcoMCk7XHJcbiAgICB9XHJcbn07XHJcblN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJhZ0xlYXZlXCJdID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciBkcmFnRHJvcEhlbHBlciA9IHRoaXMuZGF0YVtcImRyYWdEcm9wSGVscGVyXCJdO1xyXG4gICAgaWYgKGRyYWdEcm9wSGVscGVyKSB7XHJcbiAgICAgICAgZHJhZ0Ryb3BIZWxwZXIuZG9MZWF2ZVBhZ2UoZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uQ3JlYXRpbmdcIl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBudWxsO1xyXG4gICAgdGhpcy5rb0lzRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMua29Jc0RyYWdnaW5nU291cmNlID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRyYWdEcm9wSGVscGVyVmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzZWxmLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBzZWxmLmRhdGFbXCJkcmFnRHJvcEhlbHBlclwiXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbGYuZHJhZ0Ryb3BIZWxwZXJWYWx1ZTtcclxuICAgIH07XHJcbiAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmRvRHJhZ0Ryb3BPdmVyKGUsIHNlbGYpOyB9O1xyXG4gICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5kb0Ryb3AoZSwgc2VsZik7IH07XHJcbiAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5zdGFydERyYWdRdWVzdGlvbihlLCBzZWxmLm5hbWUpOyB9O1xyXG4gICAgdGhpcy5kcmFnRW5kID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmVuZCgpOyB9O1xyXG4gICAgdGhpcy5rb0lzU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgIHRoaXMua29PbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChzZWxmLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHNlbGYuZGF0YVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0odGhpcyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5TdXJ2ZXkuUXVlc3Rpb25CYXNlLnByb3RvdHlwZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0gPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgdGhpcy5rb0lzU2VsZWN0ZWQodGhpcy5kYXRhW1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdID09IHRoaXMpO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZWRpdG9yLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3JcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eURyb3Bkb3duQ29sdW1uc0VkaXRvciBleHRlbmRzIFN1cnZleVByb3BlcnR5SXRlbXNFZGl0b3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgZWRpdG9yVHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmNvbHVtbnNcIjsgfVxyXG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua29JdGVtcygpLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCB0aGlzLmtvSXRlbXMoKVtpXS5oYXNFcnJvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld0VkaXRvckl0ZW0oKTogYW55IHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0l0ZW0obmV3IFN1cnZleS5NYXRyaXhEcm9wZG93bkNvbHVtbihcIlwiLCB0aGlzLm9wdGlvbnMpKTsgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUVkaXRvckl0ZW0oaXRlbTogYW55KSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNJdGVtKGl0ZW0sIHRoaXMub3B0aW9ucyk7IH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oZWRpdG9ySXRlbTogYW55KSB7XHJcbiAgICAgICAgdmFyIGNvbHVtSXRlbSA9IDxTdXJ2ZXlQcm9wZXJ0eU1hdHJpeERyb3Bkb3duQ29sdW1uc0l0ZW0+ZWRpdG9ySXRlbTtcclxuICAgICAgICBjb2x1bUl0ZW0uYXBwbHkoKTtcclxuICAgICAgICByZXR1cm4gY29sdW1JdGVtLmNvbHVtbjtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbSB7XHJcbiAgICBwcml2YXRlIGtvQ2hvaWNlczogYW55O1xyXG4gICAgcHVibGljIGNob2ljZXNFZGl0b3I6IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcjtcclxuICAgIGtvTmFtZTogYW55OyBrb1RpdGxlOiBhbnk7IGtvQ2VsbFR5cGU6IGFueTsga29TaG93Q2hvaWNlczogYW55O1xyXG4gICAga29IYXNFcnJvcjogYW55OyBrb0NvbENvdW50OiBhbnk7IGtvSXNSZXF1aXJlZDogYW55OyBrb0hhc090aGVyOiBhbnk7XHJcbiAgICBrb0hhc0Nob2ljZXM6IGFueTsga29IYXNDb2xDb3VudDogYW55O1xyXG4gICAgcHVibGljIG9uU2hvd0Nob2ljZXNDbGljazogYW55O1xyXG4gICAgcHVibGljIGNlbGxUeXBlQ2hvaWNlczogQXJyYXk8YW55PjtcclxuICAgIHB1YmxpYyBjb2xDb3VudENob2ljZXM6IEFycmF5PGFueT47XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29sdW1uOiBTdXJ2ZXkuTWF0cml4RHJvcGRvd25Db2x1bW4sIHB1YmxpYyBvcHRpb25zID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuY2VsbFR5cGVDaG9pY2VzID0gdGhpcy5nZXRQcm9wZXJ0eUNob2ljZXMoXCJjZWxsVHlwZVwiKTtcclxuICAgICAgICB0aGlzLmNvbENvdW50Q2hvaWNlcyA9IHRoaXMuZ2V0UHJvcGVydHlDaG9pY2VzKFwiY29sQ291bnRcIik7XHJcbiAgICAgICAgdGhpcy5rb05hbWUgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5uYW1lKTtcclxuICAgICAgICB0aGlzLmtvQ2VsbFR5cGUgPSBrby5vYnNlcnZhYmxlKGNvbHVtbi5jZWxsVHlwZSk7XHJcbiAgICAgICAgdGhpcy5rb0NvbENvdW50ID0ga28ub2JzZXJ2YWJsZShjb2x1bW4uY29sQ291bnQpO1xyXG4gICAgICAgIHRoaXMua29Jc1JlcXVpcmVkID0ga28ub2JzZXJ2YWJsZShjb2x1bW4uaXNSZXF1aXJlZCA/IHRydWUgOiBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5rb0hhc090aGVyID0ga28ub2JzZXJ2YWJsZShjb2x1bW4uaGFzT3RoZXIgPyB0cnVlIDogZmFsc2UpO1xyXG4gICAgICAgIHRoaXMua29UaXRsZSA9IGtvLm9ic2VydmFibGUoY29sdW1uLm5hbWUgPT09IGNvbHVtbi50aXRsZSA/IFwiXCIgOiBjb2x1bW4udGl0bGUpO1xyXG4gICAgICAgIHRoaXMua29TaG93Q2hvaWNlcyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMua29DaG9pY2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KGNvbHVtbi5jaG9pY2VzKTtcclxuICAgICAgICB0aGlzLmtvSGFzRXJyb3IgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaG9pY2VzRWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlc0VkaXRvcigpO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vYmplY3QgPSB0aGlzLmNvbHVtbjtcclxuICAgICAgICB0aGlzLmNob2ljZXNFZGl0b3IudmFsdWUgPSB0aGlzLmtvQ2hvaWNlcygpO1xyXG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5vblNob3dDaG9pY2VzQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29TaG93Q2hvaWNlcyghc2VsZi5rb1Nob3dDaG9pY2VzKCkpOyB9XHJcbiAgICAgICAgdGhpcy5rb0hhc0Nob2ljZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcImRyb3Bkb3duXCIgfHwgc2VsZi5rb0NlbGxUeXBlKCkgPT0gXCJjaGVja2JveFwiIHx8IHNlbGYua29DZWxsVHlwZSgpID09IFwicmFkaW9ncm91cFwiOyB9KTtcclxuICAgICAgICB0aGlzLmtvSGFzQ29sQ291bnQgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHJldHVybiBzZWxmLmtvQ2VsbFR5cGUoKSA9PSBcImNoZWNrYm94XCIgfHwgc2VsZi5rb0NlbGxUeXBlKCkgPT0gXCJyYWRpb2dyb3VwXCI7IH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMua29IYXNFcnJvcighdGhpcy5rb05hbWUoKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMua29IYXNFcnJvcigpIHx8IHRoaXMuY2hvaWNlc0VkaXRvci5oYXNFcnJvcigpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFwcGx5KCkge1xyXG4gICAgICAgIHRoaXMuY29sdW1uLm5hbWUgPSB0aGlzLmtvTmFtZSgpO1xyXG4gICAgICAgIHRoaXMuY29sdW1uLnRpdGxlID0gdGhpcy5rb1RpdGxlKCk7XHJcbiAgICAgICAgdGhpcy5jb2x1bW4uY2VsbFR5cGUgPSB0aGlzLmtvQ2VsbFR5cGUoKTtcclxuICAgICAgICB0aGlzLmNvbHVtbi5jb2xDb3VudCA9IHRoaXMua29Db2xDb3VudCgpO1xyXG4gICAgICAgIHRoaXMuY29sdW1uLmlzUmVxdWlyZWQgPSB0aGlzLmtvSXNSZXF1aXJlZCgpO1xyXG4gICAgICAgIHRoaXMuY29sdW1uLmhhc090aGVyID0gdGhpcy5rb0hhc090aGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hvaWNlc0VkaXRvci5vbkFwcGx5Q2xpY2soKTtcclxuICAgICAgICB0aGlzLmNvbHVtbi5jaG9pY2VzID0gdGhpcy5jaG9pY2VzRWRpdG9yLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRQcm9wZXJ0eUNob2ljZXMocHJvcGV0eU5hbWU6IHN0cmluZyk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IHByb3BldHlOYW1lKSByZXR1cm4gcHJvcGVydGllc1tpXS5jaG9pY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcbn1cclxuXHJcblN1cnZleVByb3BlcnR5RWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIm1hdHJpeGRyb3Bkb3duY29sdW1uc1wiLCBmdW5jdGlvbiAoKTogU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlQcm9wZXJ0eURyb3Bkb3duQ29sdW1uc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zRWRpdG9yLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlNb2RhbEVkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlNb2RhbEVkaXRvclwiO1xyXG5pbXBvcnQge1N1cnZleVByb3BlcnR5RWRpdG9yQmFzZX0gZnJvbSBcIi4vcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlSZXN1bHRmdWxsRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlNb2RhbEVkaXRvciB7XHJcbiAgICBrb1VybDogYW55OyBrb1BhdGg6IGFueTsga29WYWx1ZU5hbWU6IGFueTsga29UaXRsZU5hbWU6IGFueTtcclxuICAgIHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkRyb3Bkb3duO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5rb1VybCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvUGF0aCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvVmFsdWVOYW1lID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29UaXRsZU5hbWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTdXJ2ZXkoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb1VybC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnVybCA9IG5ld1ZhbHVlOyBzZWxmLnJ1bigpOyB9KTtcclxuICAgICAgICB0aGlzLmtvUGF0aC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnBhdGggPSBuZXdWYWx1ZTsgc2VsZi5ydW4oKTsgfSk7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlTmFtZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYucXVlc3Rpb24uY2hvaWNlc0J5VXJsLnZhbHVlTmFtZSA9IG5ld1ZhbHVlOyBzZWxmLnJ1bigpOyB9KTtcclxuICAgICAgICB0aGlzLmtvVGl0bGVOYW1lLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5xdWVzdGlvbi5jaG9pY2VzQnlVcmwudGl0bGVOYW1lID0gbmV3VmFsdWU7IHNlbGYucnVuKCk7IH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInJlc3RmdWxsXCI7IH1cclxuICAgIHB1YmxpYyBnZXQgcmVzdGZ1bGxWYWx1ZSgpIHsgcmV0dXJuIDxTdXJ2ZXkuQ2hvaWNlc1Jlc3RmdWxsPnRoaXMudmFsdWU7IH1cclxuICAgIHB1YmxpYyBnZXRWYWx1ZVRleHQodmFsdWU6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCAhdmFsdWUudXJsKSByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLmVtcHR5XCIpO1xyXG4gICAgICAgIHZhciBzdHIgPSB2YWx1ZS51cmw7XHJcbiAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAyMCkge1xyXG4gICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyKDAsIDIwKSArIFwiLi4uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHI7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMucmVzdGZ1bGxWYWx1ZTtcclxuICAgICAgICB0aGlzLmtvVXJsKHZhbCA/IHZhbC51cmwgOiBcIlwiKTtcclxuICAgICAgICB0aGlzLmtvUGF0aCh2YWwgPyB2YWwucGF0aCA6IFwiXCIpO1xyXG4gICAgICAgIHRoaXMua29WYWx1ZU5hbWUodmFsID8gdmFsLnZhbHVlTmFtZSA6IFwiXCIpO1xyXG4gICAgICAgIHRoaXMua29UaXRsZU5hbWUodmFsID8gdmFsLnRpdGxlTmFtZSA6IFwiXCIpO1xyXG4gICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcihcInJlc3RmdWxsU3VydmV5XCIpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIG9uQmVmb3JlQXBwbHkoKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IG5ldyBTdXJ2ZXkuQ2hvaWNlc1Jlc3RmdWxsKCk7XHJcbiAgICAgICAgdmFsLnVybCA9IHRoaXMua29VcmwoKTtcclxuICAgICAgICB2YWwucGF0aCA9IHRoaXMua29QYXRoKCk7XHJcbiAgICAgICAgdmFsLnZhbHVlTmFtZSA9IHRoaXMua29WYWx1ZU5hbWUoKTtcclxuICAgICAgICB2YWwudGl0bGVOYW1lID0gdGhpcy5rb1RpdGxlTmFtZSgpO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWVDb3JlKHZhbCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJ1bigpIHtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNob2ljZXNCeVVybC5ydW4oKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlU3VydmV5KCkge1xyXG4gICAgICAgIHRoaXMuc3VydmV5ID0gbmV3IFN1cnZleS5TdXJ2ZXkoKTtcclxuICAgICAgICB0aGlzLnN1cnZleS5zaG93TmF2aWdhdGlvbkJ1dHRvbnMgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnN1cnZleS5zaG93UXVlc3Rpb25OdW1iZXJzID0gXCJvZmZcIjtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmFkZE5ld1BhZ2UoXCJwYWdlMVwiKTtcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkRyb3Bkb3duPnBhZ2UuYWRkTmV3UXVlc3Rpb24oXCJkcm9wZG93blwiLCBcInExXCIpO1xyXG4gICAgICAgIHRoaXMucXVlc3Rpb24udGl0bGUgPSBlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudGVzdFNlcnZpY2VcIilcclxuICAgICAgICB0aGlzLnF1ZXN0aW9uLmNob2ljZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoXCJyZXN0ZnVsbFN1cnZleVwiKTtcclxuICAgIH1cclxufVxyXG5cclxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwicmVzdGZ1bGxcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlSZXN1bHRmdWxsRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlSZXN0ZnVsbEVkaXRvci50cyIsImltcG9ydCB7U3VydmV5UHJvcGVydHlJdGVtc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlJdGVtc0VkaXRvclwiO1xuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2V9IGZyb20gXCIuL3Byb3BlcnR5RWRpdG9yQmFzZVwiO1xuaW1wb3J0IHtTdXJ2ZXlIZWxwZXJ9IGZyb20gXCIuLi9zdXJ2ZXlIZWxwZXJcIjtcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XG5pbXBvcnQge1N1cnZleVByb3BlcnR5VmFsaWRhdG9yc0VkaXRvcn0gZnJvbSBcIi4vcHJvcGVydHlWYWxpZGF0b3JzRWRpdG9yXCI7XG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xuXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUZXh0SXRlbXNFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG4gICAgcHVibGljIGdldCBlZGl0b3JUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcInRleHRpdGVtc1wiOyB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZU5ld0VkaXRvckl0ZW0oKTogYW55IHtcbiAgICAgICAgdmFyIG9ianMgPSBbXTtcbiAgICAgICAgdmFyIGl0ZW1zID0gdGhpcy5rb0l0ZW1zKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9ianMucHVzaCh7IG5hbWU6IGl0ZW1zW2ldLmtvTmFtZSgpIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlZGl0SXRlbSA9IHsga29OYW1lOiBrby5vYnNlcnZhYmxlKFN1cnZleUhlbHBlci5nZXROZXdOYW1lKG9ianMsIFwidGV4dFwiKSksIGtvVGl0bGU6IGtvLm9ic2VydmFibGUoKSB9O1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoZWRpdEl0ZW0sIFtdKTtcbiAgICAgICAgcmV0dXJuIGVkaXRJdGVtO1xuICAgIH1cbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGVkaXRJdGVtID0geyBrb05hbWU6IGtvLm9ic2VydmFibGUoaXRlbS5uYW1lKSwga29UaXRsZToga28ub2JzZXJ2YWJsZShpdGVtLnRpdGxlKSB9O1xuICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoZWRpdEl0ZW0sIGl0ZW0udmFsaWRhdG9ycyk7XG4gICAgICAgIHJldHVybiBlZGl0SXRlbTtcbiAgICB9XG4gICAgcHJvdGVjdGVkIGNyZWF0ZUl0ZW1Gcm9tRWRpdG9ySXRlbShlZGl0b3JJdGVtOiBhbnkpIHtcbiAgICAgICAgdmFyIGl0ZW1UZXh0ID0gbmV3IFN1cnZleS5NdWx0aXBsZVRleHRJdGVtKGVkaXRvckl0ZW0ua29OYW1lKCksIGVkaXRvckl0ZW0ua29UaXRsZSgpKTtcbiAgICAgICAgaXRlbVRleHQudmFsaWRhdG9ycyA9IGVkaXRvckl0ZW0udmFsaWRhdG9ycztcbiAgICAgICAgcmV0dXJuIGl0ZW1UZXh0O1xuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoaXRlbTogYW55LCB2YWxpZGF0b3JzOiBBcnJheTxhbnk+KSB7XG4gICAgICAgIGl0ZW0udmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuc2xpY2UoKTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IGl0ZW0udmFsaWRhdG9ycyA9IG5ld1ZhbHVlOyBpdGVtLmtvVGV4dChzZWxmLmdldFRleHQobmV3VmFsdWUubGVuZ3RoKSk7IH07XG4gICAgICAgIHZhciBwcm9wZXJ0eUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3IoKTtcbiAgICAgICAgaXRlbS5lZGl0b3IgPSBwcm9wZXJ0eUVkaXRvcjtcbiAgICAgICAgcHJvcGVydHlFZGl0b3Iub25DaGFuZ2VkID0gKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH07XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLm9iamVjdCA9IGl0ZW07XG4gICAgICAgIHByb3BlcnR5RWRpdG9yLnRpdGxlKGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5lZGl0UHJvcGVydHlcIilbXCJmb3JtYXRcIl0oXCJWYWxpZGF0b3JzXCIpKTtcbiAgICAgICAgcHJvcGVydHlFZGl0b3IudmFsdWUgPSBpdGVtLnZhbGlkYXRvcnM7XG4gICAgICAgIGl0ZW0ua29UZXh0ID0ga28ub2JzZXJ2YWJsZSh0aGlzLmdldFRleHQodmFsaWRhdG9ycy5sZW5ndGgpKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRUZXh0KGxlbmd0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS5pdGVtc1wiKVtcImZvcm1hdFwiXShsZW5ndGgpO1xuICAgIH1cbn1cblxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidGV4dGl0ZW1zXCIsIGZ1bmN0aW9uICgpOiBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVByb3BlcnR5VGV4dEl0ZW1zRWRpdG9yKCk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3IudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi9wcm9wZXJ0eUl0ZW1zRWRpdG9yXCI7XHJcbmltcG9ydCB7U3VydmV5UHJvcGVydHlFZGl0b3JCYXNlfSBmcm9tIFwiLi9wcm9wZXJ0eUVkaXRvckJhc2VcIjtcclxuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzRWRpdG9yIGV4dGVuZHMgU3VydmV5UHJvcGVydHlJdGVtc0VkaXRvciB7XHJcbiAgICBrb1F1ZXN0aW9uczogYW55OyBrb1BhZ2VzOiBhbnk7XHJcbiAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xyXG4gICAgcHVibGljIGF2YWlsYWJsZVRyaWdnZXJzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICBwcml2YXRlIHRyaWdnZXJDbGFzc2VzOiBBcnJheTxTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3M+ID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9O1xyXG4gICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICh0cmlnZ2VyVHlwZSkgeyBzZWxmLmFkZEl0ZW0odHJpZ2dlclR5cGUpOyB9O1xyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcbiAgICAgICAgdGhpcy5rb1BhZ2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHRoaXMudHJpZ2dlckNsYXNzZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoXCJzdXJ2ZXl0cmlnZ2VyXCIsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlVHJpZ2dlcnMgPSB0aGlzLmdldEF2YWlsYWJsZVRyaWdnZXJzKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGVkaXRvclR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidHJpZ2dlcnNcIjsgfVxyXG4gICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9iamVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLnBhZ2VzKSk7XHJcbiAgICAgICAgICAgIHRoaXMua29RdWVzdGlvbnModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLmdldEFsbFF1ZXN0aW9ucygpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgaWYgKHRoaXMua29TZWxlY3RlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5rb0l0ZW1zKCkubGVuZ3RoID4gMCA/IHRoaXMua29JdGVtcygpWzBdIDogbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkSXRlbSh0cmlnZ2VyVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHRyaWdnZXIgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh0cmlnZ2VyVHlwZSk7XHJcbiAgICAgICAgdmFyIHRyaWdnZXJJdGVtID0gdGhpcy5jcmVhdGVQcm9wZXJ0eVRyaWdnZXIodHJpZ2dlcik7XHJcbiAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2godHJpZ2dlckl0ZW0pO1xyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZCh0cmlnZ2VySXRlbSk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlRWRpdG9ySXRlbShpdGVtOiBhbnkpIHtcclxuICAgICAgICB2YXIganNvbk9iaiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpO1xyXG4gICAgICAgIHZhciB0cmlnZ2VyID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoaXRlbS5nZXRUeXBlKCkpO1xyXG4gICAgICAgIGpzb25PYmoudG9PYmplY3QoaXRlbSwgdHJpZ2dlcik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUHJvcGVydHlUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlcj50cmlnZ2VyKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVJdGVtRnJvbUVkaXRvckl0ZW0oZWRpdG9ySXRlbTogYW55KSB7XHJcbiAgICAgICAgdmFyIGVkaXRvclRyaWdnZXIgPSA8U3VydmV5UHJvcGVydHlUcmlnZ2VyPmVkaXRvckl0ZW07XHJcbiAgICAgICAgcmV0dXJuIGVkaXRvclRyaWdnZXIuY3JlYXRlVHJpZ2dlcigpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRBdmFpbGFibGVUcmlnZ2VycygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRyaWdnZXJDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudHJpZ2dlckNsYXNzZXNbaV0ubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5hbWVzKGl0ZW1zOiBBcnJheTxhbnk+KTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgdmFyIG5hbWVzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpZiAoaXRlbVtcIm5hbWVcIl0pIHtcclxuICAgICAgICAgICAgICAgIG5hbWVzLnB1c2goaXRlbVtcIm5hbWVcIl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lcztcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlUHJvcGVydHlUcmlnZ2VyKHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyKTogU3VydmV5UHJvcGVydHlUcmlnZ2VyIHtcclxuICAgICAgICB2YXIgdHJpZ2dlckl0ZW0gPSBudWxsO1xyXG4gICAgICAgIGlmICh0cmlnZ2VyLmdldFR5cGUoKSA9PSBcInZpc2libGV0cmlnZ2VyXCIpIHtcclxuICAgICAgICAgICAgdHJpZ2dlckl0ZW0gPSBuZXcgU3VydmV5UHJvcGVydHlWaXNpYmxlVHJpZ2dlcig8U3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlPnRyaWdnZXIsIHRoaXMua29QYWdlcywgdGhpcy5rb1F1ZXN0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0cmlnZ2VyLmdldFR5cGUoKSA9PSBcInNldHZhbHVldHJpZ2dlclwiKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJJdGVtID0gbmV3IFN1cnZleVByb3BlcnR5U2V0VmFsdWVUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclNldFZhbHVlPnRyaWdnZXIsIHRoaXMua29RdWVzdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRyaWdnZXJJdGVtKSB7XHJcbiAgICAgICAgICAgIHRyaWdnZXJJdGVtID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlcih0cmlnZ2VyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRyaWdnZXJJdGVtO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xyXG4gICAgcHJpdmF0ZSBvcGVyYXRvcnMgPSBbXCJlbXB0eVwiLCBcIm5vdGVtcHR5XCIsIFwiZXF1YWxcIiwgXCJub3RlcXVhbFwiLCBcImNvbnRhaW5zXCIsIFwibm90Y29udGFpbnNcIiwgXCJncmVhdGVyXCIsIFwibGVzc1wiLCBcImdyZWF0ZXJvcmVxdWFsXCIsIFwibGVzc29yZXF1YWxcIl07XHJcbiAgICBwcml2YXRlIHRyaWdnZXJUeXBlOiBzdHJpbmc7XHJcbiAgICBhdmFpbGFibGVPcGVyYXRvcnMgPSBbXTtcclxuICAgIGtvTmFtZTogYW55OyBrb09wZXJhdG9yOiBhbnk7IGtvVmFsdWU6IGFueTsga29UeXBlOiBhbnk7XHJcbiAgICBrb1RleHQ6IGFueTsga29Jc1ZhbGlkOiBhbnk7IGtvUmVxdWlyZVZhbHVlOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVPcGVyYXRvcnMoKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXJUeXBlID0gdHJpZ2dlci5nZXRUeXBlKCk7XHJcbiAgICAgICAgdGhpcy5rb1R5cGUgPSBrby5vYnNlcnZhYmxlKHRoaXMudHJpZ2dlclR5cGUpO1xyXG4gICAgICAgIHRoaXMua29OYW1lID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLm5hbWUpO1xyXG4gICAgICAgIHRoaXMua29PcGVyYXRvciA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5vcGVyYXRvcik7XHJcbiAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLnZhbHVlKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5rb1JlcXVpcmVWYWx1ZSA9IGtvLmNvbXB1dGVkKCgpID0+IHsgcmV0dXJuIHNlbGYua29PcGVyYXRvcigpICE9IFwiZW1wdHlcIiAmJiBzZWxmLmtvT3BlcmF0b3IoKSAhPSBcIm5vdGVtcHR5XCI7IH0pO1xyXG4gICAgICAgIHRoaXMua29Jc1ZhbGlkID0ga28uY29tcHV0ZWQoKCkgPT4geyBpZiAoc2VsZi5rb05hbWUoKSAmJiAoIXNlbGYua29SZXF1aXJlVmFsdWUoKSB8fCBzZWxmLmtvVmFsdWUoKSkpIHJldHVybiB0cnVlOyByZXR1cm4gZmFsc2U7IH0pO1xyXG4gICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyBzZWxmLmtvTmFtZSgpOyBzZWxmLmtvT3BlcmF0b3IoKTsgc2VsZi5rb1ZhbHVlKCk7IHJldHVybiBzZWxmLmdldFRleHQoKTsgfSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlVHJpZ2dlcigpOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlciB7XHJcbiAgICAgICAgdmFyIHRyaWdnZXIgPSA8U3VydmV5LlN1cnZleVRyaWdnZXI+U3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3ModGhpcy50cmlnZ2VyVHlwZSk7XHJcbiAgICAgICAgdHJpZ2dlci5uYW1lID0gdGhpcy5rb05hbWUoKTtcclxuICAgICAgICB0cmlnZ2VyLm9wZXJhdG9yID0gdGhpcy5rb09wZXJhdG9yKCk7XHJcbiAgICAgICAgdHJpZ2dlci52YWx1ZSA9IHRoaXMua29WYWx1ZSgpO1xyXG4gICAgICAgIHJldHVybiB0cmlnZ2VyO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVPcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wZXJhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMub3BlcmF0b3JzW2ldO1xyXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZU9wZXJhdG9ycy5wdXNoKHsgbmFtZTogbmFtZSwgdGV4dDogZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm9wLlwiICsgbmFtZSkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmtvSXNWYWxpZCgpKSByZXR1cm4gZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLnRyaWdnZXJOb3RTZXRcIik7XHJcbiAgICAgICAgcmV0dXJuIGVkaXRvckxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJwZS50cmlnZ2VyUnVuSWZcIikgKyBcIiAnXCIgKyB0aGlzLmtvTmFtZSgpICsgXCInIFwiICsgdGhpcy5nZXRPcGVyYXRvclRleHQoKSArIHRoaXMuZ2V0VmFsdWVUZXh0KCk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE9wZXJhdG9yVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBvcCA9IHRoaXMua29PcGVyYXRvcigpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdmFpbGFibGVPcGVyYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlT3BlcmF0b3JzW2ldLm5hbWUgPT0gb3ApIHJldHVybiB0aGlzLmF2YWlsYWJsZU9wZXJhdG9yc1tpXS50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3A7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldFZhbHVlVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdGhpcy5rb1JlcXVpcmVWYWx1ZSgpKSByZXR1cm4gXCJcIjtcclxuICAgICAgICByZXR1cm4gXCIgXCIgKyB0aGlzLmtvVmFsdWUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmlzaWJsZVRyaWdnZXIgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xyXG4gICAgcHVibGljIHBhZ2VzOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzO1xyXG4gICAgcHVibGljIHF1ZXN0aW9uczogU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cztcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmlnZ2VyOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUsIGtvUGFnZXM6IGFueSwga29RdWVzdGlvbnM6IGFueSkge1xyXG4gICAgICAgIHN1cGVyKHRyaWdnZXIpO1xyXG4gICAgICAgIHRoaXMucGFnZXMgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyhlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudHJpZ2dlck1ha2VQYWdlc1Zpc2libGVcIiksIGtvUGFnZXMoKSwgdHJpZ2dlci5wYWdlcyk7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvbnMgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyhlZGl0b3JMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGUudHJpZ2dlck1ha2VRdWVzdGlvbnNWaXNpYmxlXCIpLCBrb1F1ZXN0aW9ucygpLCB0cmlnZ2VyLnF1ZXN0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY3JlYXRlVHJpZ2dlcigpOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlciB7XHJcbiAgICAgICAgdmFyIHRyaWdnZXIgPSA8U3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlPnN1cGVyLmNyZWF0ZVRyaWdnZXIoKTtcclxuICAgICAgICB0cmlnZ2VyLnBhZ2VzID0gdGhpcy5wYWdlcy5rb0Nob29zZW4oKTtcclxuICAgICAgICB0cmlnZ2VyLnF1ZXN0aW9ucyA9IHRoaXMucXVlc3Rpb25zLmtvQ2hvb3NlbigpO1xyXG4gICAgICAgIHJldHVybiB0cmlnZ2VyO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlTZXRWYWx1ZVRyaWdnZXIgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIge1xyXG4gICAga29RdWVzdGlvbnM6IGFueTsga29zZXRUb05hbWU6IGFueTsga29zZXRWYWx1ZTogYW55OyBrb2lzVmFyaWFibGU6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmlnZ2VyOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlclNldFZhbHVlLCBrb1F1ZXN0aW9uczogYW55KSB7XHJcbiAgICAgICAgc3VwZXIodHJpZ2dlcik7XHJcbiAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyA9IGtvUXVlc3Rpb25zO1xyXG4gICAgICAgIHRoaXMua29zZXRUb05hbWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIuc2V0VG9OYW1lKTtcclxuICAgICAgICB0aGlzLmtvc2V0VmFsdWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIuc2V0VmFsdWUpO1xyXG4gICAgICAgIHRoaXMua29pc1ZhcmlhYmxlID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLmlzVmFyaWFibGUpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXIge1xyXG4gICAgICAgIHZhciB0cmlnZ2VyID0gPFN1cnZleS5TdXJ2ZXlUcmlnZ2VyU2V0VmFsdWU+c3VwZXIuY3JlYXRlVHJpZ2dlcigpO1xyXG4gICAgICAgIHRyaWdnZXIuc2V0VG9OYW1lID0gdGhpcy5rb3NldFRvTmFtZSgpO1xyXG4gICAgICAgIHRyaWdnZXIuc2V0VmFsdWUgPSB0aGlzLmtvc2V0VmFsdWUoKTtcclxuICAgICAgICB0cmlnZ2VyLmlzVmFyaWFibGUgPSB0aGlzLmtvaXNWYXJpYWJsZSgpO1xyXG4gICAgICAgIHJldHVybiB0cmlnZ2VyO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzIHtcclxuICAgIGtvT2JqZWN0czogYW55O1xyXG4gICAga29DaG9vc2VuOiBhbnk7XHJcbiAgICBrb1NlbGVjdGVkOiBhbnk7XHJcbiAgICBrb0Nob29zZW5TZWxlY3RlZDogYW55O1xyXG4gICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcclxuICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGl0bGU6IHN0cmluZywgYWxsT2JqZWN0czogQXJyYXk8c3RyaW5nPiwgY2hvb3Nlbk9iamVjdHM6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICB0aGlzLmtvQ2hvb3NlbiA9IGtvLm9ic2VydmFibGVBcnJheShjaG9vc2VuT2JqZWN0cyk7XHJcbiAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxPYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gYWxsT2JqZWN0c1tpXTtcclxuICAgICAgICAgICAgaWYgKGNob29zZW5PYmplY3RzLmluZGV4T2YoaXRlbSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KGFycmF5KTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb0Nob29zZW5TZWxlY3RlZCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUl0ZW0oKTsgfTtcclxuICAgICAgICB0aGlzLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYWRkSXRlbSgpOyB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGRlbGV0ZUl0ZW0oKSB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VJdGVtcyh0aGlzLmtvQ2hvb3NlblNlbGVjdGVkKCksIHRoaXMua29DaG9vc2VuLCB0aGlzLmtvT2JqZWN0cyk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZEl0ZW0oKSB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VJdGVtcyh0aGlzLmtvU2VsZWN0ZWQoKSwgdGhpcy5rb09iamVjdHMsIHRoaXMua29DaG9vc2VuKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY2hhbmdlSXRlbXMoaXRlbTogc3RyaW5nLCByZW1vdmVkRnJvbTogYW55LCBhZGRUbzogYW55KSB7XHJcbiAgICAgICAgcmVtb3ZlZEZyb20ucmVtb3ZlKGl0ZW0pO1xyXG4gICAgICAgIGFkZFRvLnB1c2goaXRlbSk7XHJcbiAgICAgICAgcmVtb3ZlZEZyb20uc29ydCgpO1xyXG4gICAgICAgIGFkZFRvLnNvcnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuU3VydmV5UHJvcGVydHlFZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidHJpZ2dlcnNcIiwgZnVuY3Rpb24gKCk6IFN1cnZleVByb3BlcnR5RWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2Vyc0VkaXRvcigpOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5VHJpZ2dlcnNFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSwgU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJHZW5lcmFsLCBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXN9IGZyb20gXCIuL3F1ZXN0aW9uRWRpdG9yQmFzZVwiO1xyXG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uQ29tbWVudEVkaXRvciBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb25CYXNlOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjcmVhdGVHZW5lcmFsVGFiKCk6IFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCB7IHJldHVybiBuZXcgU3VydmV5UXVlc3Rpb25Db21tZW50VGV4dFRhYkdlbmVyYWwodGhpcy5xdWVzdGlvbkJhc2UsIDAsIHRoaXMucHJvcGVydGllcyk7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uQ29tbWVudFRleHRUYWJHZW5lcmFsIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJHZW5lcmFsIHtcclxuICAgIHB1YmxpYyBoYXNQbGFjZUhvbGRlcjogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBoYXNSb3dzOiBib29sZWFuO1xyXG5cclxuICAgIGtvUGxhY2VIb2xkZXI6IGFueTsga29Sb3dzOiBhbnk7IFxyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyLCBwcm9wZXJ0aWVzOiBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMpIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIHZpc2libGVJbmRleCwgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0VXBQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVwUHJvcGVydGllcygpO1xyXG4gICAgICAgIHRoaXMuaGFzUm93cyA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcInJvd3NcIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc1BsYWNlSG9sZGVyID0gdGhpcy5wcm9wZXJ0aWVzLmdldFByb3BlcnR5KFwicGxhY2VIb2xkZXJcIikgIT0gbnVsbDtcclxuICAgICAgICAvL1RPRE9cclxuICAgICAgICB0aGlzLmtvUm93cyA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvUGxhY2VIb2xkZXIgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0FkZGl0aW9uYWxUZW1wbGF0ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgYWRkaXRpb25hbFRlbXBsYXRlSHRtbCgpOiBzdHJpbmcgeyByZXR1cm4gXCJxdWVzdGlvbmVkaXRvcnRhYi1jb21tZW50XCI7IH1cclxuICAgIHB1YmxpYyByZXNldCgpIHtcclxuICAgICAgICBzdXBlci5yZXNldCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1Jvd3MpIHRoaXMua29Sb3dzKHRoaXMucXVlc3Rpb25CYXNlW1wicm93c1wiXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzUGxhY2VIb2xkZXIpIHRoaXMua29QbGFjZUhvbGRlcih0aGlzLnF1ZXN0aW9uQmFzZVtcInBsYWNlSG9sZGVyXCJdKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhcHBseSgpIHtcclxuICAgICAgICBzdXBlci5hcHBseSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgdmFyIHJvd3MgPSBwYXJzZUludCh0aGlzLmtvUm93cygpKTtcclxuICAgICAgICAgICAgaWYgKHJvd3MgPCAxKSByb3dzID0gMTtcclxuICAgICAgICAgICAgaWYgKHJvd3MgPiAxMDApIHJvd3MgPSAxMDA7XHJcbiAgICAgICAgICAgIHRoaXMua29Sb3dzKHJvd3MpO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uQmFzZVtcInJvd3NcIl0gPSB0aGlzLmtvUm93cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5oYXNQbGFjZUhvbGRlcikgdGhpcy5xdWVzdGlvbkJhc2VbXCJwbGFjZUhvbGRlclwiXSA9IHRoaXMua29QbGFjZUhvbGRlcigpO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJjb21tZW50XCIsIGZ1bmN0aW9uIChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbik6IFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UXVlc3Rpb25Db21tZW50RWRpdG9yKHF1ZXN0aW9uLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbkNvbW1lbnRFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSwgU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJCYXNlLCBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXN9IGZyb20gXCIuL3F1ZXN0aW9uRWRpdG9yQmFzZVwiO1xyXG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRmlsZUVkaXRvciBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb25CYXNlOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBhZGRUYWJzKHRhYnM6IEFycmF5PFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiQmFzZT4pIHtcclxuICAgICAgICBzdXBlci5hZGRUYWJzKHRhYnMpO1xyXG4gICAgICAgIHRhYnMucHVzaChuZXcgU3VydmV5UXVlc3Rpb25FZGl0b3JGaWxlVGFiR2VuZXJhbCh0aGlzLnF1ZXN0aW9uQmFzZSwgMTAsIHRoaXMucHJvcGVydGllcykpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25FZGl0b3JGaWxlVGFiR2VuZXJhbCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiQmFzZSB7XHJcbiAgICBwdWJsaWMgaGFzU2hvd1ByZXZpZXc6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaGFzU3RvcmVEYXRhQXNUZXh0OiBib29sZWFuO1xyXG4gICAgcHVibGljIGhhc01heFNpemU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaGFzSW1hZ2VIZWlnaHQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaGFzSW1hZ2VXaWR0aDogYm9vbGVhbjtcclxuXHJcbiAgICBrb1Nob3dQcmV2aWV3OiBhbnk7IGtvU3RvcmVEYXRhQXNUZXh0OiBhbnk7IGtvTWF4U2l6ZTogYW55OyBrb0ltYWdlSGVpZ2h0OiBhbnk7IGtvSW1hZ2VXaWR0aDogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyLCBwcm9wZXJ0aWVzOiBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMpIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIHZpc2libGVJbmRleCwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgdGhpcy5zZXRVcFByb3BlcnRpZXMoKTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIFwiZmlsZU9wdGlvbnNcIjsgfVxyXG4gICAgcHJvdGVjdGVkIHNldFVwUHJvcGVydGllcygpIHtcclxuICAgICAgICB0aGlzLmhhc1Nob3dQcmV2aWV3ID0gdGhpcy5wcm9wZXJ0aWVzLmdldFByb3BlcnR5KFwic2hvd1ByZXZpZXdcIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc1N0b3JlRGF0YUFzVGV4dCA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcInN0b3JlRGF0YUFzVGV4dFwiKSAhPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFzTWF4U2l6ZSA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcIm1heFNpemVcIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc0ltYWdlSGVpZ2h0ID0gdGhpcy5wcm9wZXJ0aWVzLmdldFByb3BlcnR5KFwiaW1hZ2VIZWlnaHRcIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc0ltYWdlV2lkdGggPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJpbWFnZVdpZHRoXCIpICE9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rb1Nob3dQcmV2aWV3ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29TdG9yZURhdGFBc1RleHQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb01heFNpemUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5rb0ltYWdlSGVpZ2h0ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIHRoaXMua29JbWFnZVdpZHRoID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHJlc2V0KCkge1xyXG4gICAgICAgIHN1cGVyLnJlc2V0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU2hvd1ByZXZpZXcpIHRoaXMua29TaG93UHJldmlldyh0aGlzLnF1ZXN0aW9uQmFzZVtcInNob3dQcmV2aWV3XCJdKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNTdG9yZURhdGFBc1RleHQpIHRoaXMua29TdG9yZURhdGFBc1RleHQodGhpcy5xdWVzdGlvbkJhc2VbXCJzdG9yZURhdGFBc1RleHRcIl0pO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc01heFNpemUpIHRoaXMua29NYXhTaXplKHRoaXMucXVlc3Rpb25CYXNlW1wibWF4U2l6ZVwiXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2VIZWlnaHQpIHRoaXMua29JbWFnZUhlaWdodCh0aGlzLnF1ZXN0aW9uQmFzZVtcImltYWdlSGVpZ2h0XCJdKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZVdpZHRoKSB0aGlzLmtvSW1hZ2VXaWR0aCh0aGlzLnF1ZXN0aW9uQmFzZVtcImltYWdlV2lkdGhcIl0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFwcGx5KCkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzU2hvd1ByZXZpZXcpIHRoaXMucXVlc3Rpb25CYXNlW1wic2hvd1ByZXZpZXdcIl0gPSB0aGlzLmtvU2hvd1ByZXZpZXcoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNTdG9yZURhdGFBc1RleHQpIHRoaXMucXVlc3Rpb25CYXNlW1wic3RvcmVEYXRhQXNUZXh0XCJdID0gdGhpcy5rb1N0b3JlRGF0YUFzVGV4dCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc01heFNpemUpIHRoaXMucXVlc3Rpb25CYXNlW1wibWF4U2l6ZVwiXSA9IHRoaXMua29NYXhTaXplKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2VIZWlnaHQpIHRoaXMucXVlc3Rpb25CYXNlW1wiaW1hZ2VIZWlnaHRcIl0gPSB0aGlzLmtvSW1hZ2VIZWlnaHQoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZVdpZHRoKSB0aGlzLnF1ZXN0aW9uQmFzZVtcImltYWdlV2lkdGhcIl0gPSB0aGlzLmtvSW1hZ2VXaWR0aCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5TdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UucmVnaXN0ZXJFZGl0b3IoXCJmaWxlXCIsIGZ1bmN0aW9uIChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbik6IFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UXVlc3Rpb25GaWxlRWRpdG9yKHF1ZXN0aW9uLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbkZpbGVFZGl0b3IudHMiLCJpbXBvcnQge1N1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZX0gZnJvbSBcIi4vcXVlc3Rpb25FZGl0b3JCYXNlXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25IdG1sRWRpdG9yIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGdldFByb3BlcnRpZXNUYWJzKHByb3BUYWJzOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgc3VwZXIuZ2V0UHJvcGVydGllc1RhYnMocHJvcFRhYnMpO1xyXG4gICAgICAgIHByb3BUYWJzLnB1c2goeyBwcm9wZXJ0eU5hbWU6IFwiaHRtbFwiLCB2aXNpYmxlSW5kZXg6IDEwIH0pO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwiaHRtbFwiLCBmdW5jdGlvbiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uSHRtbEVkaXRvcihxdWVzdGlvbiwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25IdG1sRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UsIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCwgU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzfSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvckJhc2VcIjtcclxuaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVkaXRvck1hdHJpeERyb3Bkb3duVGFiR2VuZXJhbCwgU3VydmV5UXVlc3Rpb25NYXRyaXhEcm9wZG93bkVkaXRvcn0gZnJvbSBcIi4vcXVlc3Rpb25NYXRyaXhEcm9wZG93bkVkaXRvclwiO1xyXG5pbXBvcnQge2VkaXRvckxvY2FsaXphdGlvbn0gZnJvbSBcIi4uL2VkaXRvckxvY2FsaXphdGlvblwiO1xyXG5pbXBvcnQgKiBhcyBTdXJ2ZXkgZnJvbSBcInN1cnZleS1rbm9ja291dFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHluYW1pY0VkaXRvciBleHRlbmRzIFN1cnZleVF1ZXN0aW9uTWF0cml4RHJvcGRvd25FZGl0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKHF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlR2VuZXJhbFRhYigpOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uRWRpdG9yTWF0cml4RHluYW1pY1RhYkdlbmVyYWwodGhpcy5xdWVzdGlvbkJhc2UsIDAsIHRoaXMucHJvcGVydGllcyk7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yTWF0cml4RHluYW1pY1RhYkdlbmVyYWwgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvck1hdHJpeERyb3Bkb3duVGFiR2VuZXJhbCB7XHJcbiAgICBwdWJsaWMgaGFzUm93Q291bnQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgaGFzQWRkUm93VGV4dDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBoYXNSZW1vdmVSb3dUZXh0OiBib29sZWFuO1xyXG5cclxuICAgIGtvUm93Q291bnQ6IGFueTsga29BZGRSb3dUZXh0OiBhbnk7IGtvUmVtb3ZlUm93VGV4dDogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyLCBwcm9wZXJ0aWVzOiBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMpIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIHZpc2libGVJbmRleCwgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0VXBQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVwUHJvcGVydGllcygpO1xyXG4gICAgICAgIHRoaXMuaGFzUm93Q291bnQgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJyb3dDb3VudFwiKSAhPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFzQWRkUm93VGV4dCA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcImFkZFJvd1RleHRcIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc1JlbW92ZVJvd1RleHQgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJyZW1vdmVSb3dUZXh0XCIpICE9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMua29Sb3dDb3VudCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvQWRkUm93VGV4dCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvUmVtb3ZlUm93VGV4dCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgYWRkaXRpb25hbFRlbXBsYXRlSHRtbCgpOiBzdHJpbmcgeyByZXR1cm4gXCJxdWVzdGlvbmVkaXRvcnRhYi1tYXRyaXhkeW5hbWljXCI7IH1cclxuICAgIHB1YmxpYyByZXNldCgpIHtcclxuICAgICAgICBzdXBlci5yZXNldCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1Jvd0NvdW50KSB0aGlzLmtvUm93Q291bnQodGhpcy5xdWVzdGlvbkJhc2VbXCJyb3dDb3VudFwiXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQWRkUm93VGV4dCkgdGhpcy5rb0FkZFJvd1RleHQodGhpcy5xdWVzdGlvbkJhc2VbXCJhZGRSb3dUZXh0XCJdKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNSZW1vdmVSb3dUZXh0KSB0aGlzLmtvUmVtb3ZlUm93VGV4dCh0aGlzLnF1ZXN0aW9uQmFzZVtcInJlbW92ZVJvd1RleHRcIl0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFwcGx5KCkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzUm93Q291bnQpIHRoaXMucXVlc3Rpb25CYXNlW1wicm93Q291bnRcIl0gPSB0aGlzLmtvUm93Q291bnQoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNBZGRSb3dUZXh0KSB0aGlzLnF1ZXN0aW9uQmFzZVtcImFkZFJvd1RleHRcIl0gPSB0aGlzLmtvQWRkUm93VGV4dCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc1JlbW92ZVJvd1RleHQpIHRoaXMucXVlc3Rpb25CYXNlW1wicmVtb3ZlUm93VGV4dFwiXSA9IHRoaXMua29SZW1vdmVSb3dUZXh0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIm1hdHJpeGR5bmFtaWNcIiwgZnVuY3Rpb24gKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKTogU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlIHsgcmV0dXJuIG5ldyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeER5bmFtaWNFZGl0b3IocXVlc3Rpb24sIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uTWF0cml4RHluYW1pY0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlfSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvckJhc2VcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvbk1hdHJpeEVkaXRvciBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb25CYXNlOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRQcm9wZXJ0aWVzVGFicyhwcm9wVGFiczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIHN1cGVyLmdldFByb3BlcnRpZXNUYWJzKHByb3BUYWJzKTtcclxuICAgICAgICBwcm9wVGFicy5wdXNoKHsgcHJvcGVydHlOYW1lOiBcImNvbHVtbnNcIiwgdmlzaWJsZUluZGV4OiAxMCB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcIm1hdHJpeFwiLCBmdW5jdGlvbiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uTWF0cml4RWRpdG9yKHF1ZXN0aW9uLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbk1hdHJpeEVkaXRvci50cyIsImltcG9ydCB7U3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlLCBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwsIFN1cnZleVF1ZXN0aW9uUHJvcGVydGllc30gZnJvbSBcIi4vcXVlc3Rpb25FZGl0b3JCYXNlXCI7XHJcbmltcG9ydCB7ZWRpdG9yTG9jYWxpemF0aW9ufSBmcm9tIFwiLi4vZWRpdG9yTG9jYWxpemF0aW9uXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25NdWx0aXBsZVRleHRFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKHF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UHJvcGVydGllc1RhYnMocHJvcFRhYnM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBzdXBlci5nZXRQcm9wZXJ0aWVzVGFicyhwcm9wVGFicyk7XHJcbiAgICAgICAgcHJvcFRhYnMucHVzaCh7IHByb3BlcnR5TmFtZTogXCJpdGVtc1wiLCB2aXNpYmxlSW5kZXg6IDEwLCB0aXRsZTogZWRpdG9yTG9jYWxpemF0aW9uLmdldFN0cmluZyhcInBlLm11bHRpcGxlVGV4dEl0ZW1zXCIpIH0pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUdlbmVyYWxUYWIoKTogU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJHZW5lcmFsIHsgcmV0dXJuIG5ldyBTdXJ2ZXlRdWVzdGlvbkVkaXRvck11bHRpcGxlVGV4dFRhYkdlbmVyYWwodGhpcy5xdWVzdGlvbkJhc2UsIDAsIHRoaXMucHJvcGVydGllcyk7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yTXVsdGlwbGVUZXh0VGFiR2VuZXJhbCBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCB7XHJcbiAgICBwcml2YXRlIGNvbENvdW50UHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHk7XHJcbiAgICBwdWJsaWMgaGFzQ29sQ291bnQ6IGJvb2xlYW47XHJcblxyXG4gICAga29Db2xDb3VudDogYW55OyBrb0NvbENvdW50Q2hvaWNlczogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyLCBwcm9wZXJ0aWVzOiBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMpIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIHZpc2libGVJbmRleCwgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0VXBQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVwUHJvcGVydGllcygpO1xyXG4gICAgICAgIHRoaXMuY29sQ291bnRQcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcImNvbENvdW50XCIpO1xyXG4gICAgICAgIHRoaXMuaGFzQ29sQ291bnQgPSB0aGlzLmNvbENvdW50UHJvcGVydHkgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmtvQ29sQ291bnRDaG9pY2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sQ291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0NvbENvdW50Q2hvaWNlcyh0aGlzLmNvbENvdW50UHJvcGVydHkuY2hvaWNlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua29Db2xDb3VudCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQWRkaXRpb25hbFRlbXBsYXRlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCBhZGRpdGlvbmFsVGVtcGxhdGVIdG1sKCk6IHN0cmluZyB7IHJldHVybiBcInF1ZXN0aW9uZWRpdG9ydGFiLW11bHRpcGxldGV4dFwiOyB9XHJcbiAgICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICAgICAgc3VwZXIucmVzZXQoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb2xDb3VudCkgdGhpcy5rb0NvbENvdW50KHRoaXMucXVlc3Rpb25CYXNlW1wiY29sQ291bnRcIl0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFwcGx5KCkge1xyXG4gICAgICAgIHN1cGVyLmFwcGx5KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sQ291bnQpIHRoaXMucXVlc3Rpb25CYXNlW1wiY29sQ291bnRcIl0gPSB0aGlzLmtvQ29sQ291bnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwibXVsdGlwbGV0ZXh0XCIsIGZ1bmN0aW9uIChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbik6IFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7IHJldHVybiBuZXcgU3VydmV5UXVlc3Rpb25NdWx0aXBsZVRleHRFZGl0b3IocXVlc3Rpb24sIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2spOyB9KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uTXVsdGlwbGVUZXh0RWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UsIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCwgU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzfSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvckJhc2VcIjtcclxuaW1wb3J0IHtlZGl0b3JMb2NhbGl6YXRpb259IGZyb20gXCIuLi9lZGl0b3JMb2NhbGl6YXRpb25cIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvblJhdGluZ0VkaXRvciBleHRlbmRzIFN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb25CYXNlOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrOiAob2JqZWN0OiBhbnksIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KSA9PiBib29sZWFuKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBnZXRQcm9wZXJ0aWVzVGFicyhwcm9wVGFiczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgIHN1cGVyLmdldFByb3BlcnRpZXNUYWJzKHByb3BUYWJzKTtcclxuICAgICAgICBwcm9wVGFicy5wdXNoKHsgcHJvcGVydHlOYW1lOiBcInJhdGVWYWx1ZXNcIiwgdmlzaWJsZUluZGV4OiAxMCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlR2VuZXJhbFRhYigpOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uRWRpdG9yUmF0aW5nVGFiR2VuZXJhbCh0aGlzLnF1ZXN0aW9uQmFzZSwgMCwgdGhpcy5wcm9wZXJ0aWVzKTsgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5UXVlc3Rpb25FZGl0b3JSYXRpbmdUYWJHZW5lcmFsIGV4dGVuZHMgU3VydmV5UXVlc3Rpb25FZGl0b3JUYWJHZW5lcmFsIHtcclxuICAgIHB1YmxpYyBoYXNNaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBib29sZWFuO1xyXG4gICAgcHVibGljIGhhc01heGltdW1SYXRlRGVzY3JpcHRpb246IGJvb2xlYW47XHJcblxyXG4gICAga29NaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBhbnk7IGtvTWF4aW11bVJhdGVEZXNjcmlwdGlvbjogYW55O1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyLCBwcm9wZXJ0aWVzOiBTdXJ2ZXlRdWVzdGlvblByb3BlcnRpZXMpIHtcclxuICAgICAgICBzdXBlcihxdWVzdGlvbkJhc2UsIHZpc2libGVJbmRleCwgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgc2V0VXBQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgIHN1cGVyLnNldFVwUHJvcGVydGllcygpO1xyXG4gICAgICAgIHRoaXMuaGFzTWluaW51bVJhdGVEZXNjcmlwdGlvbiA9IHRoaXMucHJvcGVydGllcy5nZXRQcm9wZXJ0eShcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIikgIT0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhc01heGltdW1SYXRlRGVzY3JpcHRpb24gPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJtYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCIpICE9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rb01pbmludW1SYXRlRGVzY3JpcHRpb24gPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB0aGlzLmtvTWF4aW11bVJhdGVEZXNjcmlwdGlvbiA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQWRkaXRpb25hbFRlbXBsYXRlKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgcHVibGljIGdldCBhZGRpdGlvbmFsVGVtcGxhdGVIdG1sKCk6IHN0cmluZyB7IHJldHVybiBcInF1ZXN0aW9uZWRpdG9ydGFiLXJhdGluZ1wiOyB9XHJcbiAgICBwdWJsaWMgcmVzZXQoKSB7XHJcbiAgICAgICAgc3VwZXIucmVzZXQoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNNaW5pbnVtUmF0ZURlc2NyaXB0aW9uKSB0aGlzLmtvTWluaW51bVJhdGVEZXNjcmlwdGlvbih0aGlzLnF1ZXN0aW9uQmFzZVtcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIl0pO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc01heGltdW1SYXRlRGVzY3JpcHRpb24pIHRoaXMua29NYXhpbXVtUmF0ZURlc2NyaXB0aW9uKHRoaXMucXVlc3Rpb25CYXNlW1wibWF4aW11bVJhdGVEZXNjcmlwdGlvblwiXSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYXBwbHkoKSB7XHJcbiAgICAgICAgc3VwZXIuYXBwbHkoKTtcclxuICAgICAgICBpZiAodGhpcy5oYXNNaW5pbnVtUmF0ZURlc2NyaXB0aW9uKSB0aGlzLnF1ZXN0aW9uQmFzZVtcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIl0gPSB0aGlzLmtvTWluaW51bVJhdGVEZXNjcmlwdGlvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc01heGltdW1SYXRlRGVzY3JpcHRpb24pIHRoaXMucXVlc3Rpb25CYXNlW1wibWF4aW11bVJhdGVEZXNjcmlwdGlvblwiXSA9IHRoaXMua29NYXhpbXVtUmF0ZURlc2NyaXB0aW9uKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblN1cnZleVF1ZXN0aW9uRWRpdG9yQmFzZS5yZWdpc3RlckVkaXRvcihcInJhdGluZ1wiLCBmdW5jdGlvbiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uUmF0aW5nRWRpdG9yKHF1ZXN0aW9uLCBvbkNhblNob3dQcm9wZXJ0eUNhbGxiYWNrKTsgfSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvblJhdGluZ0VkaXRvci50cyIsImltcG9ydCB7U3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlfSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvckJhc2VcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvblNlbGVjdEJhc2VFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKHF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgZ2V0UHJvcGVydGllc1RhYnMocHJvcFRhYnM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICBzdXBlci5nZXRQcm9wZXJ0aWVzVGFicyhwcm9wVGFicyk7XHJcbiAgICAgICAgcHJvcFRhYnMucHVzaCh7IHByb3BlcnR5TmFtZTogXCJjaG9pY2VzXCIsIHZpc2libGVJbmRleDogMTAgfSk7XHJcbiAgICAgICAgcHJvcFRhYnMucHVzaCh7IHByb3BlcnR5TmFtZTogXCJjaG9pY2VzQnlVcmxcIiwgdmlzaWJsZUluZGV4OiAxMSB9KTtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwic2VsZWN0YmFzZVwiLCBmdW5jdGlvbiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uU2VsZWN0QmFzZUVkaXRvcihxdWVzdGlvbiwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25TZWxlY3RCYXNlRWRpdG9yLnRzIiwiaW1wb3J0IHtTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UsIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGFiR2VuZXJhbCwgU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzfSBmcm9tIFwiLi9xdWVzdGlvbkVkaXRvckJhc2VcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlRdWVzdGlvblRleHRFZGl0b3IgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocHVibGljIHF1ZXN0aW9uQmFzZTogU3VydmV5LlF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjazogKG9iamVjdDogYW55LCBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSkgPT4gYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKHF1ZXN0aW9uQmFzZSwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlR2VuZXJhbFRhYigpOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uRWRpdG9yVGV4dFRhYkdlbmVyYWwodGhpcy5xdWVzdGlvbkJhc2UsIDAsIHRoaXMucHJvcGVydGllcyk7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleVF1ZXN0aW9uRWRpdG9yVGV4dFRhYkdlbmVyYWwgZXh0ZW5kcyBTdXJ2ZXlRdWVzdGlvbkVkaXRvclRhYkdlbmVyYWwge1xyXG4gICAgcHJpdmF0ZSBpbnB1dFR5cGVQcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eTtcclxuICAgIHB1YmxpYyBoYXNQbGFjZUhvbGRlcjogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBoYXNJbnB1dFR5cGU6IGJvb2xlYW47XHJcblxyXG4gICAga29QbGFjZUhvbGRlcjogYW55OyBrb0lucHV0VHlwZTogYW55OyBrb0lucHV0VHlwZUNob2ljZXM6IGFueTtcclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbkJhc2U6IFN1cnZleS5RdWVzdGlvbkJhc2UsIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciwgcHJvcGVydGllczogU3VydmV5UXVlc3Rpb25Qcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgc3VwZXIocXVlc3Rpb25CYXNlLCB2aXNpYmxlSW5kZXgsIHByb3BlcnRpZXMpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHNldFVwUHJvcGVydGllcygpIHtcclxuICAgICAgICBzdXBlci5zZXRVcFByb3BlcnRpZXMoKTtcclxuICAgICAgICB0aGlzLmlucHV0VHlwZVByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzLmdldFByb3BlcnR5KFwiaW5wdXRUeXBlXCIpO1xyXG4gICAgICAgIHRoaXMuaGFzSW5wdXRUeXBlID0gdGhpcy5pbnB1dFR5cGVQcm9wZXJ0eSAhPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaGFzUGxhY2VIb2xkZXIgPSB0aGlzLnByb3BlcnRpZXMuZ2V0UHJvcGVydHkoXCJwbGFjZUhvbGRlclwiKSAhPSBudWxsO1xyXG4gICAgICAgIHRoaXMua29JbnB1dFR5cGVDaG9pY2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5wdXRUeXBlUHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0lucHV0VHlwZUNob2ljZXModGhpcy5pbnB1dFR5cGVQcm9wZXJ0eS5jaG9pY2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb0lucHV0VHlwZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB0aGlzLmtvUGxhY2VIb2xkZXIgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgZ2V0IGhhc0FkZGl0aW9uYWxUZW1wbGF0ZSgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIHB1YmxpYyBnZXQgYWRkaXRpb25hbFRlbXBsYXRlSHRtbCgpOiBzdHJpbmcgeyByZXR1cm4gXCJxdWVzdGlvbmVkaXRvcnRhYi10ZXh0XCI7IH1cclxuICAgIHB1YmxpYyByZXNldCgpIHtcclxuICAgICAgICBzdXBlci5yZXNldCgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0lucHV0VHlwZSkgdGhpcy5rb0lucHV0VHlwZSh0aGlzLnF1ZXN0aW9uQmFzZVtcImlucHV0VHlwZVwiXSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzUGxhY2VIb2xkZXIpIHRoaXMua29QbGFjZUhvbGRlcih0aGlzLnF1ZXN0aW9uQmFzZVtcInBsYWNlSG9sZGVyXCJdKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhcHBseSgpIHtcclxuICAgICAgICBzdXBlci5hcHBseSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0lucHV0VHlwZSkgdGhpcy5xdWVzdGlvbkJhc2VbXCJpbnB1dFR5cGVcIl0gPSB0aGlzLmtvSW5wdXRUeXBlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzUGxhY2VIb2xkZXIpIHRoaXMucXVlc3Rpb25CYXNlW1wicGxhY2VIb2xkZXJcIl0gPSB0aGlzLmtvUGxhY2VIb2xkZXIoKTtcclxuICAgIH1cclxufVxyXG5cclxuU3VydmV5UXVlc3Rpb25FZGl0b3JCYXNlLnJlZ2lzdGVyRWRpdG9yKFwidGV4dFwiLCBmdW5jdGlvbiAocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UsIG9uQ2FuU2hvd1Byb3BlcnR5Q2FsbGJhY2s6IChvYmplY3Q6IGFueSwgcHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpID0+IGJvb2xlYW4pOiBTdXJ2ZXlRdWVzdGlvbkVkaXRvckJhc2UgeyByZXR1cm4gbmV3IFN1cnZleVF1ZXN0aW9uVGV4dEVkaXRvcihxdWVzdGlvbiwgb25DYW5TaG93UHJvcGVydHlDYWxsYmFjayk7IH0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25UZXh0RWRpdG9yLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInN2ZF9jb250YWluZXJcXFwiPlxcclxcbiAgICA8dWwgY2xhc3M9XFxcIm5hdmJhci1kZWZhdWx0IGNvbnRhaW5lci1mbHVpZCBuYXYgbmF2LXRhYnMgc3ZkX21lbnVcXFwiPlxcclxcbiAgICAgICAgPGxpIGRhdGEtYmluZD1cXFwiY3NzOiB7YWN0aXZlOiBrb1ZpZXdUeXBlKCkgPT0gJ2Rlc2lnbmVyJ31cXFwiPjxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6c2VsZWN0RGVzaWduZXJDbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC5kZXNpZ25lcicpXFxcIj48L2E+PC9saT5cXHJcXG4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XFxcInZpc2libGU6IHNob3dKU09ORWRpdG9yVGFiLCBjc3M6IHthY3RpdmU6IGtvVmlld1R5cGUoKSA9PSAnZWRpdG9yJ31cXFwiPjxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6c2VsZWN0RWRpdG9yQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZygnZWQuanNvbkVkaXRvcicpXFxcIj48L2E+PC9saT5cXHJcXG4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XFxcInZpc2libGU6IHNob3dUZXN0U3VydmV5VGFiLCBjc3M6IHthY3RpdmU6IGtvVmlld1R5cGUoKSA9PSAndGVzdCd9XFxcIj48YSBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOnNlbGVjdFRlc3RDbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC50ZXN0U3VydmV5JylcXFwiPjwvYT48L2xpPlxcclxcbiAgICAgICAgPGxpIGRhdGEtYmluZD1cXFwidmlzaWJsZTogc2hvd0VtYmVkZWRTdXJ2ZXlUYWIsIGNzczoge2FjdGl2ZToga29WaWV3VHlwZSgpID09ICdlbWJlZCd9XFxcIj48YSBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOnNlbGVjdEVtYmVkQ2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZygnZWQuZW1iZWRTdXJ2ZXknKVxcXCI+PC9hPjwvbGk+XFxyXFxuXFxyXFxuICAgICAgICA8bGkgY2xhc3M9XFxcInN2ZF9hY3Rpb25zXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IGtvSXNTaG93RGVzaWduZXJcXFwiPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWJpbmQ9XFxcImVuYWJsZTp1bmRvUmVkby5rb0NhblVuZG8sIGNsaWNrOiBkb1VuZG9DbGlja1xcXCI+PHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2VkLnVuZG8nKVxcXCI+PC9zcGFuPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPC9saT5cXHJcXG4gICAgICAgIDxsaSBjbGFzcz1cXFwic3ZkX2FjdGlvbnNcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZToga29Jc1Nob3dEZXNpZ25lclxcXCI+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiIGRhdGEtYmluZD1cXFwiZW5hYmxlOnVuZG9SZWRvLmtvQ2FuUmVkbywgY2xpY2s6IGRvUmVkb0NsaWNrXFxcIj48c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZWQucmVkbycpXFxcIj48L3NwYW4+PC9idXR0b24+XFxyXFxuICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJzdmRfYWN0aW9uc1xcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiAoa29Jc1Nob3dEZXNpZ25lcigpICYmIGtvU2hvd09wdGlvbnMoKSlcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ0bi1ncm91cCBpbmxpbmVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBkcm9wZG93bi10b2dnbGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC5vcHRpb25zJylcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgT3B0aW9ucyBcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJjYXJldFxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XFxcImNzczoge2FjdGl2ZToga29HZW5lcmF0ZVZhbGlkSlNPTn1cXFwiPjxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6Z2VuZXJhdGVWYWxpZEpTT05DbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC5nZW5lcmF0ZVZhbGlkSlNPTicpXFxcIj48L2E+PC9saT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XFxcImNzczoge2FjdGl2ZTogIWtvR2VuZXJhdGVWYWxpZEpTT04oKX1cXFwiPjxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6Z2VuZXJhdGVSZWFkYWJsZUpTT05DbGljaywgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC5nZW5lcmF0ZVJlYWRhYmxlSlNPTicpXFxcIj48L2E+PC9saT5cXHJcXG4gICAgICAgICAgICAgICAgPC91bD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvbGk+XFxyXFxuICAgICAgICA8bGkgY2xhc3M9XFxcInN2ZF9hY3Rpb25zXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IGtvVmlld1R5cGUoKSA9PSAndGVzdCdcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ0bi1ncm91cCBpbmxpbmVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgaWQ9XFxcInN1cnZleVRlc3RXaWR0aFxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBkcm9wZG93bi10b2dnbGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwidHJ1ZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZWQudGVzdFN1cnZleVdpZHRoJykgKyAnICcgKyAkcm9vdC5rb1Rlc3RTdXJ2ZXlXaWR0aCgpXFxcIj48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiY2FyZXRcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cXFwiZHJvcGRvd24tbWVudVxcXCIgYXJpYS1sYWJlbGxlZGJ5PVxcXCJzdXJ2ZXlUZXN0V2lkdGhcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6IGtvVGVzdFN1cnZleVdpZHRoLmJpbmQoJGRhdGEsICcxMDAlJylcXFwiPjEwMCU8L2E+PC9saT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBrb1Rlc3RTdXJ2ZXlXaWR0aC5iaW5kKCRkYXRhLCAnMTIwMHB4JylcXFwiPjEyMDBweDwvYT48L2xpPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6IGtvVGVzdFN1cnZleVdpZHRoLmJpbmQoJGRhdGEsICcxMDAwcHgnKVxcXCI+MTAwMHB4PC9hPjwvbGk+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgJzgwMHB4JylcXFwiPjgwMHB4PC9hPjwvbGk+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgJzYwMHB4JylcXFwiPjYwMHB4PC9hPjwvbGk+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cXFwiI1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazoga29UZXN0U3VydmV5V2lkdGguYmluZCgkZGF0YSwgJzQwMHB4JylcXFwiPjQwMHB4PC9hPjwvbGk+XFxyXFxuICAgICAgICAgICAgICAgIDwvdWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgPGxpIGNsYXNzPVxcXCJzdmRfYWN0aW9uc1xcXCI+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgc3ZkX3NhdmVfYnRuXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBzYXZlQnV0dG9uQ2xpY2ssIHZpc2libGU6IGtvU2hvd1NhdmVCdXR0b25cXFwiPjxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC5zYXZlU3VydmV5JylcXFwiPjwvc3Bhbj48L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvbGk+XFxyXFxuICAgIDwvdWw+XFxyXFxuXFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsIHN2ZF9jb250ZW50XFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvdyBzdmRfc3VydmV5X2Rlc2lnbmVyXFxcIiAgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gJ2Rlc2lnbmVyJ1xcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTIgY29sLW1kLTIgY29sLXNtLTEyIGNvbC14cy0xMiBwYW5lbCBwYW5lbC1kZWZhdWx0IHN2ZF90b29sYm94XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnRuLWdyb3VwLXZlcnRpY2FsXFxcIiBzdHlsZT1cXFwid2lkdGg6MTAwJTtwYWRkaW5nLXJpZ2h0OjJweFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uVHlwZXMgLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOmxlZnQ7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVxcXCIgZHJhZ2dhYmxlPVxcXCJ0cnVlXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50LmNsaWNrUXVlc3Rpb24sIGV2ZW50OntkcmFnc3RhcnQ6IGZ1bmN0aW9uKGVsLCBlKSB7ICRwYXJlbnQuZHJhZ2dpbmdRdWVzdGlvbigkZGF0YSwgZSk7IHJldHVybiB0cnVlO30sIGRyYWdlbmQ6IGZ1bmN0aW9uKGVsLCBlKSB7ICRwYXJlbnQuZHJhZ0VuZCgpOyB9fVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJjc3M6ICdpY29uLScgKyAkZGF0YVxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJzdmRfdG9vbGJveF9pdGVtX3RleHRcXFwiIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdxdC4nICsgJGRhdGEpXFxcIj48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29DdXN0b21Ub29sYm94UXVlc3Rpb25zIC0tPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIiBzdHlsZT1cXFwidGV4dC1hbGlnbjpsZWZ0OyBtYXJnaW46MXB4O3dpZHRoOjEwMCVcXFwiIGRyYWdnYWJsZT1cXFwidHJ1ZVxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jbGlja0N1c3RvbVRvb2xib3hRdWVzdGlvbiwgZXZlbnQ6e2RyYWdzdGFydDogZnVuY3Rpb24oZWwsIGUpIHsgJHBhcmVudC5kcmFnZ2luZ0NvcGllZFF1ZXN0aW9uKCRkYXRhLCBlKTsgcmV0dXJuIHRydWU7fSwgZHJhZ2VuZDogZnVuY3Rpb24oZWwsIGUpIHsgJHBhcmVudC5kcmFnRW5kKCk7IH19XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiaWNvbi1kZWZhdWx0XFxcIj48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcInN2ZF90b29sYm94X2l0ZW1fdGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ0ZXh0Om5hbWVcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNyBjb2wtbWQtNyBjb2wtc20tMTIgY29sLXhzLTEyIHN2ZF9lZGl0b3JzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic3ZkX3BhZ2VzX2VkaXRvclxcXCIgZGF0YS1iaW5kPVxcXCJ0ZW1wbGF0ZTogeyBuYW1lOiAncGFnZWVkaXRvcicsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzdmRfcXVlc3Rpb25zX2VkaXRvclxcXCIgaWQ9XFxcInNjcm9sbGFibGVEaXZcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cXFwic3VydmV5anNcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctMyBjb2wtbWQtMyBjb2wtc20tMTIgY29sLXhzLTEyIHBhbmVsIHBhbmVsLWRlZmF1bHQgc3ZkX3Byb3BlcnRpZXNcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nIGlucHV0LWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImN1c3RvbS1zZWxlY3RcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJvcHRpb25zOiBrb09iamVjdHMsIG9wdGlvbnNUZXh0OiAndGV4dCcsIHZhbHVlOiBrb1NlbGVjdGVkT2JqZWN0XFxcIj48L3NlbGVjdD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYnRuXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCIgZGF0YS1iaW5kPVxcXCJlbmFibGU6IGtvQ2FuRGVsZXRlT2JqZWN0LCBjbGljazogZGVsZXRlQ3VycmVudE9iamVjdCwgYXR0cjogeyB0aXRsZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdlZC5kZWxTZWxPYmplY3QnKX1cXFwiPjxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVxcXCI+PC9zcGFuPjwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cXFwidGVtcGxhdGU6IHsgbmFtZTogJ29iamVjdGVkaXRvcicsIGRhdGE6IHNlbGVjdGVkT2JqZWN0RWRpdG9yIH1cXFwiPjwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1mb290ZXJcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpzdXJ2ZXlWZXJicy5rb0hhc1ZlcmJzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ0ZW1wbGF0ZTogeyBuYW1lOiAnb2JqZWN0dmVyYnMnLCBkYXRhOiBzdXJ2ZXlWZXJicyB9XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gJ2VkaXRvcidcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ0ZW1wbGF0ZTogeyBuYW1lOiAnanNvbmVkaXRvcicsIGRhdGE6IGpzb25FZGl0b3IgfVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcInN1cnZleWpzVGVzdFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiBrb1ZpZXdUeXBlKCkgPT0gJ3Rlc3QnLCBzdHlsZToge3dpZHRoOiBrb1Rlc3RTdXJ2ZXlXaWR0aH1cXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgaWQ9XFxcInN1cnZleWpzRXhhbXBsZVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwic3VydmV5anNFeGFtcGxlUmVzdWx0c1xcXCI+PC9kaXY+XFxyXFxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cXFwic3VydmV5anNFeGFtcGxlcmVSdW5cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6c2VsZWN0VGVzdENsaWNrLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2VkLnRlc3RTdXJ2ZXlBZ2FpbicpXFxcIiBzdHlsZT1cXFwiZGlzcGxheTpub25lXFxcIj5UZXN0IEFnYWluPC9idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG5cXHJcXG4gICAgICAgIDxkaXYgaWQ9XFxcInN1cnZleWpzRW1iZWRcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZToga29WaWV3VHlwZSgpID09ICdlbWJlZCdcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ0ZW1wbGF0ZTogeyBuYW1lOiAnc3VydmV5ZW1iZWRpbmcnLCBkYXRhOiBzdXJ2ZXlFbWJlZGluZyB9XFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBkYXRhLWJpbmQ9XFxcInRlbXBsYXRlOiB7IG5hbWU6ICdxdWVzdGlvbmVkaXRvcicsIGRhdGE6IHF1ZXN0aW9uRWRpdG9yV2luZG93IH1cXFwiPjwvZGl2PlxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RlbXBsYXRlcy9pbmRleC5odG1sXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJqc29uZWRpdG9yXFxcIj5cXHJcXG4gICAgPGRpdiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICFoYXNBY2VFZGl0b3JcXFwiPlxcclxcbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVxcXCJzdmRfanNvbl9lZGl0b3JfYXJlYVxcXCIgZGF0YS1iaW5kPVxcXCJ0ZXh0SW5wdXQ6a29UZXh0XFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0Vycm9ycyAtLT5cXHJcXG4gICAgICAgIDxkaXY+XFxyXFxuICAgICAgICAgICAgPHNwYW4+RXJyb3I6IDwvc3Bhbj48c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6IHRleHRcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPCEtLSAva28gIC0tPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBpZD1cXFwic3VydmV5anNKU09ORWRpdG9yXFxcIiBjbGFzcz1cXFwic3ZkX2pzb25fZWRpdG9yXFxcIj48L2Rpdj5cXHJcXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvanNvbmVkaXRvci5odG1sXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJvYmplY3RlZGl0b3JcXFwiPlxcclxcbiAgICA8dGFibGUgY2xhc3M9XFxcInRhYmxlIHN2ZF90YWJsZS1ub3dyYXBcXFwiPlxcclxcbiAgICAgICAgPHRib2R5IGRhdGEtYmluZD1cXFwiZm9yZWFjaDoga29Qcm9wZXJ0aWVzXFxcIj5cXHJcXG4gICAgICAgICAgICA8dHIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5jaGFuZ2VBY3RpdmVQcm9wZXJ0eSgkZGF0YSksIGNzczogeydhY3RpdmUnOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YX1cXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVxcXCJ0ZXh0OiBkaXNwbGF5TmFtZSwgYXR0cjoge3RpdGxlOiB0aXRsZX1cXFwiIHdpZHRoPVxcXCI1MCVcXFwiPjwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTAlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDoga29UZXh0LCB2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSAhPSAkZGF0YSAmJiAoa29UZXh0KCkgfHwgJGRhdGEuZWRpdG9yVHlwZSA9PSAnYm9vbGVhbicpLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH1cXFwiIHN0eWxlPVxcXCJ0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcDtvdmVyZmxvdzpoaWRkZW5cXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YSB8fCAoIWtvVGV4dCgpICYmICRkYXRhLmVkaXRvclR5cGUgIT0gJ2Jvb2xlYW4nKVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAncHJvcGVydHllZGl0b3ItJyArIGVkaXRvclR5cGUsIGRhdGE6ICRkYXRhIH0gLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPC90ZD5cXHJcXG4gICAgICAgICAgICA8L3RyPlxcclxcbiAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgPC90YWJsZT5cXHJcXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvb2JqZWN0ZWRpdG9yLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcIm9iamVjdHZlcmJzXFxcIj5cXG4gICAgPCEtLSBrbyBmb3JlYWNoOiBrb1ZlcmJzIC0tPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cFxcXCI+XFxuICAgICAgICAgICAgICAgIDxzcGFuICBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYWRkb25cXFwiIGRhdGEtYmluZD1cXFwidGV4dDp0ZXh0XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJvcHRpb25zOiBrb0l0ZW1zLCBvcHRpb25zVGV4dDogJ3RleHQnLCBvcHRpb25zVmFsdWU6J3ZhbHVlJywgdmFsdWU6IGtvU2VsZWN0ZWRJdGVtXFxcIj48L3NlbGVjdD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8IS0tIC9rbyAgLS0+XFxuPC9zY3JpcHQ+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL29iamVjdHZlcmJzLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInBhZ2VlZGl0b3JcXFwiPlxcclxcbiAgICA8dWwgY2xhc3M9XFxcIm5hdiBuYXYtdGFic1xcXCIgZGF0YS1iaW5kPVxcXCJ0YWJzOnRydWVcXFwiPlxcclxcbiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb1BhZ2VzIC0tPlxcclxcbiAgICAgICAgPGxpIGRhdGEtYmluZD1cXFwiY3NzOiB7YWN0aXZlOiBrb1NlbGVjdGVkKCl9LGV2ZW50OntcXHJcXG4gICAgICAgICAgIGtleWRvd246ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmtleURvd24oZWwsIGUpOyB9LFxcclxcbiAgICAgICAgICAgZHJhZ3N0YXJ0OmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnU3RhcnQoZWwpOyByZXR1cm4gdHJ1ZTsgfSxcXHJcXG4gICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnT3ZlcihlbCk7fSxcXHJcXG4gICAgICAgICAgIGRyYWdlbmQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdFbmQoKTt9LFxcclxcbiAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0Ryb3AoZWwpO31cXHJcXG4gICAgICAgICB9XFxcIj4gXFxyXFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcInN2ZF9wYWdlX25hdlxcXCIgaHJlZj1cXFwiI1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazokcGFyZW50LnNlbGVjdFBhZ2VDbGlja1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDogdGl0bGVcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICA8L2E+XFxyXFxuICAgICAgICA8L2xpPlxcclxcbiAgICAgICAgPCEtLSAva28gIC0tPlxcclxcbiAgICAgICAgPGxpPjxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBzdmRfYWRkX25ld19wYWdlX2J0blxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazphZGROZXdQYWdlQ2xpY2tcXFwiPjxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcXFwiPjwvc3Bhbj48L2J1dHRvbj48L2xpPlxcclxcbiAgICA8L3VsPlxcclxcbjwvc2NyaXB0PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RlbXBsYXRlcy9wYWdlZWRpdG9yLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yLWJvb2xlYW5cXFwiPlxcclxcbiAgICA8aW5wdXQgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDoga29WYWx1ZVxcXCIgLz5cXHJcXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLWJvb2xlYW4uaHRtbFxuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3ItZHJvcGRvd25cXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJjdXN0b20tc2VsZWN0XFxcIj5cXHJcXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29WYWx1ZSwgb3B0aW9uczogY2hvaWNlc1xcXCIgIHN0eWxlPVxcXCJ3aWR0aDoxMDAlXFxcIj48L3NlbGVjdD5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9zY3JpcHQ+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1kcm9wZG93bi5odG1sXG4vLyBtb2R1bGUgaWQgPSA0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJwcm9wZXJ0eWVkaXRvci1leHByZXNzaW9uXFxcIj5cXHJcXG4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAncHJvcGVydHllZGl0b3ItbW9kYWwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcclxcbjwvc2NyaXB0PlxcclxcblxcclxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3Jjb250ZW50LWV4cHJlc3Npb25cXFwiPlxcclxcbiAgICA8ZGl2PlxcclxcbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29WYWx1ZVxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMCVcXFwiIHJvd3M9XFxcIjhcXFwiIGF1dG9mb2N1cz1cXFwiYXV0b2ZvY3VzXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiRyb290LmdldExvY1N0cmluZygncGUuZXhwcmVzc2lvbkhlbHAnKVxcXCIgc3R5bGU9XFxcIndoaXRlLXNwYWNlOm5vcm1hbFxcXCI+PC9zcGFuPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLWV4cHJlc3Npb24uaHRtbFxuLy8gbW9kdWxlIGlkID0gNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3ItaHRtbFxcXCI+XFxyXFxuICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXHJcXG48L3NjcmlwdD5cXHJcXG5cXHJcXG48c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yY29udGVudC1odG1sXFxcIj5cXHJcXG4gICAgPHRleHRhcmVhIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29WYWx1ZVxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMCVcXFwiIHJvd3M9XFxcIjEwXFxcIiBhdXRvZm9jdXM9XFxcImF1dG9mb2N1c1xcXCI+PC90ZXh0YXJlYT5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLWh0bWwuaHRtbFxuLy8gbW9kdWxlIGlkID0gNDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3ItaXRlbXZhbHVlc1xcXCI+XFxyXFxuICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXHJcXG48L3NjcmlwdD5cXHJcXG48c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgY2xhc3M9XFxcImJ0bi14c1xcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yY29udGVudC1pdGVtdmFsdWVzXFxcIj5cXHJcXG4gICAgPGRpdiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbTozcHhcXFwiPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXhzXFxcIiBkYXRhLWJpbmQ9XFxcImNzczogeydidG4gYnRuLXByaW1hcnknOmtvQWN0aXZlVmlldygpID09ICdmb3JtJywgJ2J0bi1saW5rJzprb0FjdGl2ZVZpZXcoKSAhPSAnZm9ybSd9LCBjbGljazpjaGFuZ2VUb0Zvcm1WaWV3Q2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUuZm9ybUVudHJ5JylcXFwiPjwvYnV0dG9uPlxcclxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnRuLXhzXFxcIiBkYXRhLWJpbmQ9XFxcImNzczogeydidG4gYnRuLXByaW1hcnknOmtvQWN0aXZlVmlldygpICE9ICdmb3JtJywgJ2J0bi1saW5rJzprb0FjdGl2ZVZpZXcoKSA9PSAnZm9ybSd9LCBjbGljazpjaGFuZ2VUb1RleHRWaWV3Q2xpY2ssIHRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUuZmFzdEVudHJ5JylcXFwiPjwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBkYXRhLWJpbmQ9XFxcInZpc2libGU6a29BY3RpdmVWaWV3KCkgPT0gJ2Zvcm0nXFxcIiBzdHlsZT1cXFwib3ZlcmZsb3cteTogYXV0bzsgb3ZlcmZsb3cteDpoaWRkZW47IG1heC1oZWlnaHQ6NDAwcHg7bWluLWhlaWdodDoyMDBweFxcXCI+XFxyXFxuICAgICAgICA8dGFibGUgY2xhc3M9XFxcInRhYmxlXFxcIiA+XFxyXFxuICAgICAgICAgICAgPHRoZWFkPlxcclxcbiAgICAgICAgICAgICAgICA8dHI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUudmFsdWUnKVxcXCI+PC90aD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUudGV4dCcpXFxcIj48L3RoPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XFxyXFxuICAgICAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgPC90aGVhZD5cXHJcXG4gICAgICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29JdGVtcyAtLT5cXHJcXG4gICAgICAgICAgICAgICAgPHRyPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHRkPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImJ0bi1ncm91cFxcXCIgcm9sZT1cXFwiZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4teHNcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogJGluZGV4KCkgPiAwLCBjbGljazogJHBhcmVudC5vbk1vdmVVcENsaWNrXFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1hcnJvdy11cFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPjwvc3Bhbj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXhzXFxcIiBzdHlsZT1cXFwiZmxvYXQ6bm9uZVxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiAkaW5kZXgoKSA8ICRwYXJlbnQua29JdGVtcygpLmxlbmd0aCAtIDEsIGNsaWNrOiAkcGFyZW50Lm9uTW92ZURvd25DbGlja1xcXCI+PHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tYXJyb3ctZG93blxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPjwvc3Bhbj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29WYWx1ZVxcXCIgc3R5bGU9XFxcIndpZHRoOjIwMHB4XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImFsZXJ0IGFsZXJ0LWRhbmdlciBuby1wYWRkaW5nXFxcIiByb2xlPVxcXCJhbGVydFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmtvSGFzRXJyb3IsIHRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUuZW50ZXJOZXdWYWx1ZScpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29UZXh0XFxcIiBzdHlsZT1cXFwid2lkdGg6MjAwcHhcXFwiIC8+PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx0ZD48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4teHNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGlja1xcXCI+PHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2hcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+PC9idXR0b24+PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgPC90cj5cXHJcXG4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+XFxyXFxuICAgICAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgICAgIDwvdGFibGU+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJyb3cgYnRuLXRvb2xiYXJcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTprb0FjdGl2ZVZpZXcoKSA9PSAnZm9ybSdcXFwiPlxcclxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tc3VjY2Vzc1xcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogb25BZGRDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZygncGUuYWRkTmV3JylcXFwiIC8+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kYW5nZXJcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6IG9uQ2xlYXJDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZygncGUucmVtb3ZlQWxsJylcXFwiIC8+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZTprb0FjdGl2ZVZpZXcoKSAhPSAnZm9ybSdcXFwiPlxcclxcbiAgICAgICAgPHRleHRhcmVhIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidGV4dElucHV0OiBrb0l0ZW1zVGV4dFxcXCIgc3R5bGU9XFxcIm92ZXJmbG93LXk6IGF1dG87IG92ZXJmbG93LXg6aGlkZGVuOyBtYXgtaGVpZ2h0OjQwMHB4OyBtaW4taGVpZ2h0OjI1MHB4OyB3aWR0aDoxMDAlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLWl0ZW12YWx1ZXMuaHRtbFxuLy8gbW9kdWxlIGlkID0gNDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3ItbWF0cml4ZHJvcGRvd25jb2x1bW5zXFxcIj5cXG4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAncHJvcGVydHllZGl0b3ItbW9kYWwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcbjwvc2NyaXB0PlxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3Jjb250ZW50LW1hdHJpeGRyb3Bkb3duY29sdW1uc1xcXCI+XFxuICAgIDx0YWJsZSBjbGFzcz1cXFwidGFibGVcXFwiPlxcbiAgICAgICAgPHRoZWFkPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5yZXF1aXJlZCcpXFxcIj48L3RoPlxcbiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLmNlbGxUeXBlJylcXFwiPjwvdGg+XFxuICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUubmFtZScpXFxcIj48L3RoPlxcbiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLnRpdGxlJylcXFwiPjwvdGg+XFxuICAgICAgICAgICAgICAgIDx0aD48L3RoPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICA8L3RoZWFkPlxcbiAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29JdGVtcyAtLT5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIiNcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTprb0hhc0Nob2ljZXMsIGNsaWNrOiBvblNob3dDaG9pY2VzQ2xpY2tcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb25cXFwiIGRhdGEtYmluZD1cXFwiY3NzOiB7J2dseXBoaWNvbi1jaGV2cm9uLWRvd24nOiAha29TaG93Q2hvaWNlcygpLCAnZ2x5cGhpY29uLWNoZXZyb24tdXAnOiBrb1Nob3dDaG9pY2VzKCl9XFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgICAgICA8L2E+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDoga29Jc1JlcXVpcmVkXFxcIiAvPlxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczogY2VsbFR5cGVDaG9pY2VzLCB2YWx1ZToga29DZWxsVHlwZVxcXCIgIHN0eWxlPVxcXCJ3aWR0aDoxMTBweFxcXCI+PC9zZWxlY3Q+XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOmtvTmFtZVxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMHB4XFxcIiAvPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiYWxlcnQgYWxlcnQtZGFuZ2VyIG5vLXBhZGRpbmdcXFwiIHJvbGU9XFxcImFsZXJ0XFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6a29IYXNFcnJvciwgdGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5lbnRlck5ld1ZhbHVlJylcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29UaXRsZVxcXCIgc3R5bGU9XFxcIndpZHRoOjEyMHB4XFxcIiAvPjwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD48YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0blxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrXFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi10cmFzaFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPjwvc3Bhbj48L2J1dHRvbj48L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cXFwidmlzaWJsZToga29TaG93Q2hvaWNlcygpICYmIGtvSGFzQ2hvaWNlcygpXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjRcXFwiIHN0eWxlPVxcXCJib3JkZXItdG9wLXN0eWxlOm5vbmVcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsIGNvbC1zbS0zXFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6JHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5oYXNPdGhlcicpXFxcIj48L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbC1zbS0yXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6IGtvSGFzT3RoZXJcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLXNtLTdcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogIWtvSGFzQ29sQ291bnQoKVxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsIGNvbC1zbS0zXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6a29IYXNDb2xDb3VudCwgdGV4dDokcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLmNvbENvdW50JylcXFwiPjwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cXFwiZm9ybS1jb250cm9sIGNvbC1zbS00XFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6a29IYXNDb2xDb3VudCwgb3B0aW9uczogY29sQ291bnRDaG9pY2VzLCB2YWx1ZToga29Db2xDb3VudFxcXCIgc3R5bGU9XFxcIndpZHRoOjExMHB4XFxcIj48L3NlbGVjdD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibW9kYWwtYm9keSBzdmRfbm90b3Bib3R0b21wYWRkaW5nc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAncHJvcGVydHllZGl0b3Jjb250ZW50LWl0ZW12YWx1ZXMnLCBkYXRhOiBjaG9pY2VzRWRpdG9yIH0gLS0+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcblxcbiAgICAgICAgICAgIDwhLS0gL2tvIC0tPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93IGJ0bi10b29sYmFyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1zdWNjZXNzXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBvbkFkZENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5hZGROZXcnKVxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRhbmdlclxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogb25DbGVhckNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5yZW1vdmVBbGwnKVxcXCJcXFwiIC8+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG48L3NjcmlwdD5cXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLW1hdHJpeGRyb3Bkb3duY29sdW1ucy5odG1sXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJwcm9wZXJ0eWVkaXRvci1tb2RhbFxcXCI+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImlucHV0LWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IWVkaXRvci5pc0VkaXRhYmxlXFxcIj5cXHJcXG4gICAgICAgIDxhIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgZGF0YS1iaW5kPVxcXCJhdHRyOiB7J2RhdGEtdGFyZ2V0JyA6IG1vZGFsTmFtZVRhcmdldH1cXFwiPjxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDoga29UZXh0XFxcIj48L3NwYW4+PC9hPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYnRuXFxcIj5cXHJcXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiIGRhdGEtdG9nZ2xlPVxcXCJtb2RhbFxcXCIgc3R5bGU9XFxcInBhZGRpbmc6IDJweDtcXFwiIGRhdGEtYmluZD1cXFwiYXR0cjogeydkYXRhLXRhcmdldCcgOiBtb2RhbE5hbWVUYXJnZXR9XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tZWRpdFxcXCIgYXJpYS1oaWRkZW49XFxcInRydWVcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICA8L2J1dHRvbj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTplZGl0b3IuaXNFZGl0YWJsZVxcXCIgc3R5bGU9XFxcImRpc3BsYXk6dGFibGVcXFwiPlxcclxcbiAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6IGtvVmFsdWVcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OnRhYmxlLWNlbGw7IHdpZHRoOjEwMCVcXFwiIC8+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cC1idG5cXFwiPlxcclxcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIiBzdHlsZT1cXFwiZGlzcGxheTp0YWJsZS1jZWxsOyBwYWRkaW5nOiAycHg7XFxcIiAgZGF0YS10b2dnbGU9XFxcIm1vZGFsXFxcIiBkYXRhLWJpbmQ9XFxcImF0dHI6IHsnZGF0YS10YXJnZXQnIDogbW9kYWxOYW1lVGFyZ2V0fVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWVkaXRcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+XFxyXFxuICAgICAgICAgICAgPC9idXR0b24+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJhdHRyOiB7aWQgOiBtb2RhbE5hbWV9XFxcIiBjbGFzcz1cXFwibW9kYWwgZmFkZVxcXCIgcm9sZT1cXFwiZGlhbG9nXFxcIj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcIm1vZGFsLWRpYWxvZ1xcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibW9kYWwtY29udGVudFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1vZGFsLWhlYWRlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImNsb3NlXFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIj4mdGltZXM7PC9idXR0b24+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XFxcIm1vZGFsLXRpdGxlXFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ZWRpdG9yLnRpdGxlXFxcIj48L2g0PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj4gIFxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5IHN2ZF9ub3RvcGJvdHRvbXBhZGRpbmdzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3Byb3BlcnR5ZWRpdG9yY29udGVudC0nICsgZWRpdG9yVHlwZSwgZGF0YTogZWRpdG9yIH0gLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBlZGl0b3Iub25BcHBseUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5hcHBseScpXFxcIiBzdHlsZT1cXFwid2lkdGg6MTAwcHhcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBlZGl0b3Iub25BcHBseUNsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5vaycpXFxcIiBzdHlsZT1cXFwid2lkdGg6MTAwcHhcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWRpc21pc3M9XFxcIm1vZGFsXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBlZGl0b3Iub25SZXNldENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5jYW5jZWwnKVxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMHB4XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLW1vZGFsLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDQ3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yLW51bWJlclxcXCI+XFxyXFxuICAgIDxpbnB1dCBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiB0eXBlPVxcXCJudW1iZXJcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6IGtvVmFsdWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDAlXFxcIiAvPlxcclxcbjwvc2NyaXB0PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItbnVtYmVyLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yLXJlc3RmdWxsXFxcIj5cXG4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAncHJvcGVydHllZGl0b3ItbW9kYWwnLCBkYXRhOiAkZGF0YSB9IC0tPjwhLS0gL2tvIC0tPlxcbjwvc2NyaXB0PlxcblxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3Jjb250ZW50LXJlc3RmdWxsXFxcIj5cXG4gICAgPGZvcm0+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJ1cmxcXFwiPlVybDo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cXFwidXJsXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOmtvVXJsXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiAvPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVxcXCJwYXRoXFxcIj5QYXRoOjwvbGFiZWw+XFxuICAgICAgICAgICAgPGlucHV0IGlkPVxcXCJwYXRoXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOmtvUGF0aFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgLz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwidmFsdWVOYW1lXFxcIj52YWx1ZU5hbWU6PC9sYWJlbD5cXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XFxcInZhbHVlTmFtZVxcXCIgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTprb1ZhbHVlTmFtZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgLz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cXFwidGl0bGVOYW1lXFxcIj50aXRsZU5hbWU6PC9sYWJlbD5cXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XFxcInRpdGxlTmFtZVxcXCIgdHlwZT1cXFwidGV4dFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZTprb1RpdGxlTmFtZVxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgLz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Zvcm0+XFxuICAgIDxkaXYgaWQ9XFxcInJlc3RmdWxsU3VydmV5XFxcIiBzdHlsZT1cXFwid2lkdGg6MTAwJTtoZWlnaHQ6MTUwcHhcXFwiPjwvZGl2Plxcbjwvc2NyaXB0PlxcblwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItcmVzdGZ1bGwuaHRtbFxuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3Itc3RyaW5nXFxcIj5cXHJcXG4gICAgPGlucHV0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6IGtvVmFsdWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDAlXFxcIiAvPlxcclxcbjwvc2NyaXB0PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RlbXBsYXRlcy9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3Itc3RyaW5nLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yLXRleHRcXFwiPlxcclxcbiAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6ICdwcm9wZXJ0eWVkaXRvci1tb2RhbCcsIGRhdGE6ICRkYXRhIH0gLS0+PCEtLSAva28gLS0+XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXFxyXFxuPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJwcm9wZXJ0eWVkaXRvcmNvbnRlbnQtdGV4dFxcXCI+XFxyXFxuICAgIDx0ZXh0YXJlYSBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOmtvVmFsdWVcXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDAlXFxcIiByb3dzPVxcXCIxMFxcXCIgYXV0b2ZvY3VzPVxcXCJhdXRvZm9jdXNcXFwiPjwvdGV4dGFyZWE+XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci10ZXh0Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yLXRleHRpdGVtc1xcXCI+XFxuICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG48L3NjcmlwdD5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yY29udGVudC10ZXh0aXRlbXNcXFwiPlxcbjxkaXYgY2xhc3M9XFxcInBhbmVsXFxcIj5cXG4gICAgPHRhYmxlIGNsYXNzPVxcXCJ0YWJsZVxcXCI+XFxuICAgICAgICA8dGhlYWQ+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLm5hbWUnKVxcXCI+PC90aD5cXG4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS50aXRsZScpXFxcIj48L3RoPlxcbiAgICAgICAgICAgICAgICA8dGg+PC90aD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90aGVhZD5cXG4gICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29OYW1lXFxcIiBzdHlsZT1cXFwid2lkdGg6MjAwcHhcXFwiIC8+PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOmtvVGl0bGVcXFwiIHN0eWxlPVxcXCJ3aWR0aDoyMDBweFxcXCIgLz48L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG5cXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGlja1xcXCI+PHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tdHJhc2hcXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+PC9idXR0b24+PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDwhLS0gL2tvIC0tPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XFxcIjRcXFwiPjxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLXN1Y2Nlc3NcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6IG9uQWRkQ2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLmFkZE5ldycpXFxcIi8+PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXRleHRpdGVtcy5odG1sXG4vLyBtb2R1bGUgaWQgPSA1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc1xcXCI+XFxuICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG48L3NjcmlwdD5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yY29udGVudC10cmlnZ2Vyc1xcXCI+XFxuPGRpdiBjbGFzcz1cXFwicGFuZWxcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOjEwcHhcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTEyXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cCBmb3JtLWlubGluZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImlucHV0LWdyb3VwLWJ0blxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcXFwiIGRhdGEtdG9nZ2xlPVxcXCJkcm9wZG93blxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgYXJpYS1leHBhbmRlZD1cXFwiZmFsc2VcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVxcXCJkcm9wZG93bi1tZW51XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGF2YWlsYWJsZVRyaWdnZXJzIC0tPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50Lm9uQWRkQ2xpY2soJGRhdGEpXFxcIj48c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6JGRhdGFcXFwiPjwvc3Bhbj48L2E+PC9saT5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAgLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcIm9wdGlvbnM6IGtvSXRlbXMsIG9wdGlvbnNUZXh0OiAna29UZXh0JywgdmFsdWU6IGtvU2VsZWN0ZWRcXFwiPjwvc2VsZWN0PlxcclxcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYnRuXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBkYXRhLWJpbmQ9XFxcImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1kZWZhdWx0XFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcXFwiPjwvc3Bhbj48L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZToga29TZWxlY3RlZCgpID09IG51bGxcXFwiPlxcbiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IGtvUXVlc3Rpb25zKCkubGVuZ3RoID09IDAsIHRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUubm9xdWVzdGlvbnMnKVxcXCI+PC9kaXY+XFxuICAgICAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZToga29RdWVzdGlvbnMoKS5sZW5ndGggPiAwLCB0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLmNyZWF0ZXRyaWdnZXInKVxcXCI+PC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZToga29TZWxlY3RlZCgpICE9IG51bGxcXFwiPlxcbiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XFxcIndpdGg6IGtvU2VsZWN0ZWRcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCIgIHN0eWxlPVxcXCJtYXJnaW4tYm90dG9tOjEwcHhcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNCBjb2wtc20tNFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cCAgZm9ybS1pbmxpbmVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS50cmlnZ2VyT24nKVxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwib3B0aW9uczokcGFyZW50LmtvUXVlc3Rpb25zLCB2YWx1ZToga29OYW1lXFxcIj48L3NlbGVjdD5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTQgY29sLXNtLTRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXBcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJvcHRpb25zOmF2YWlsYWJsZU9wZXJhdG9ycywgb3B0aW9uc1ZhbHVlOiAnbmFtZScsIG9wdGlvbnNUZXh0OiAndGV4dCcsIHZhbHVlOmtvT3BlcmF0b3JcXFwiPjwvc2VsZWN0PlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNCBjb2wtc20tNFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZToga29SZXF1aXJlVmFsdWUsIHZhbHVlOmtvVmFsdWVcXFwiIC8+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPCEtLSBrbyBpZjoga29UeXBlKCkgPT0gJ3Zpc2libGV0cmlnZ2VyJyAtLT5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNiBjb2wtc20tNlxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6ICdwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zJywgZGF0YTogcGFnZXMgfSAtLT5cXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTYgY29sLXNtLTZcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAncHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtcycsIGRhdGE6IHF1ZXN0aW9ucyB9IC0tPlxcbiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwhLS0gL2tvIC0tPlxcbiAgICAgICAgICAgIDwhLS0ga28gaWY6IGtvVHlwZSgpID09ICdjb21wbGV0ZXRyaWdnZXInIC0tPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cXFwibWFyZ2luOiAxMHB4XFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygncGUudHJpZ2dlckNvbXBsZXRlVGV4dCcpXFxcIj48L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8IS0tIC9rbyAtLT5cXG4gICAgICAgICAgICA8IS0tIGtvIGlmOiBrb1R5cGUoKSA9PSAnc2V0dmFsdWV0cmlnZ2VyJyAtLT5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNCBjb2wtc20tNFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cCBmb3JtLWlubGluZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLnRyaWdnZXJTZXRUb05hbWUnKVxcXCI+PC9zcGFuPlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOmtvc2V0VG9OYW1lXFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNCBjb2wtc20tNFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cCBmb3JtLWlubGluZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLnRyaWdnZXJTZXRWYWx1ZScpXFxcIj48L3NwYW4+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIHR5cGU9XFxcInRleHRcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6a29zZXRWYWx1ZVxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb2wtbGctNCBjb2wtc20tNFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJpbnB1dC1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6IGtvaXNWYXJpYWJsZVxcXCIgLz4gPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLnRyaWdnZXJJc1ZhcmlhYmxlJylcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29sLWxnLTggY29sLXNtLThcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8IS0tIC9rbyAtLT5cXHJcXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yLXRyaWdnZXJzaXRlbXNcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbCBuby1tYXJnaW5zIG5vLXBhZGRpbmdcXFwiPlxcbiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XFxcInRleHQ6IHRpdGxlXFxcIiBzdHlsZT1cXFwibWFyZ2luLWJvdHRvbToxMHB4XFxcIj48L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImlucHV0LWdyb3VwXFxcIj5cXG4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIG11bHRpcGxlPVxcXCJtdWx0aXBsZVxcXCIgZGF0YS1iaW5kPVxcXCJvcHRpb25zOmtvQ2hvb3NlbiwgdmFsdWU6IGtvQ2hvb3NlblNlbGVjdGVkXFxcIj48L3NlbGVjdD5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYnRuXFxcIiBzdHlsZT1cXFwidmVydGljYWwtYWxpZ246dG9wXFxcIj5cXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtYmluZD1cXFwiZW5hYmxlOiBrb0Nob29zZW5TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXFxcIiBjbGFzcz1cXFwiYnRuXFxcIj48c3BhbiBjbGFzcz1cXFwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcXFwiPjwvc3Bhbj48L2J1dHRvbj5cXG4gICAgICAgICAgICA8L3NwYW4+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImlucHV0LWdyb3VwXFxcIiBzdHlsZT1cXFwibWFyZ2luLXRvcDo1cHhcXFwiPlxcbiAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJvcHRpb25zOmtvT2JqZWN0cywgdmFsdWU6IGtvU2VsZWN0ZWRcXFwiPjwvc2VsZWN0PlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJpbnB1dC1ncm91cC1idG5cXFwiPlxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tZGVmYXVsdFxcXCIgZGF0YS1iaW5kPVxcXCJlbmFibGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25BZGRDbGlja1xcXCIgY2xhc3M9XFxcImJ0biBidG4tc3VjY2Vzc1xcXCI+PHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1xcXCI+PC9zcGFuPjwvYnV0dG9uPlxcbiAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzaXRlbXMuaHRtbFxuLy8gbW9kdWxlIGlkID0gNTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicHJvcGVydHllZGl0b3ItdmFsaWRhdG9yc1xcXCI+XFxuICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3Byb3BlcnR5ZWRpdG9yLW1vZGFsJywgZGF0YTogJGRhdGEgfSAtLT48IS0tIC9rbyAtLT5cXG48L3NjcmlwdD5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInByb3BlcnR5ZWRpdG9yY29udGVudC12YWxpZGF0b3JzXFxcIj5cXG48ZGl2IGNsYXNzPVxcXCJwYW5lbFxcXCI+XFxuICAgIDxkaXYgY2xhc3M9XFxcInBhbmVsLWhlYWRpbmdcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93IGlucHV0LWdyb3VwXFxcIj5cXG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImRyb3Bkb3duLXRvZ2dsZSBpbnB1dC1ncm91cC1hZGRvblxcXCIgZGF0YS10b2dnbGU9XFxcImRyb3Bkb3duXFxcIiBhcmlhLWhhc3BvcHVwPVxcXCJ0cnVlXFxcIiBhcmlhLWV4cGFuZGVkPVxcXCJmYWxzZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICA8dWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnUgaW5wdXQtZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGF2YWlsYWJsZVZhbGlkYXRvcnMgLS0+XFxuICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVxcXCIjXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcGFyZW50Lm9uQWRkQ2xpY2soJGRhdGEpXFxcIj48c3BhbiBkYXRhLWJpbmQ9XFxcInRleHQ6JGRhdGFcXFwiPjwvc3Bhbj48L2E+PC9saT5cXG4gICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPlxcbiAgICAgICAgICAgIDwvdWw+XFxuICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcIm9wdGlvbnM6IGtvSXRlbXMsIG9wdGlvbnNUZXh0OiAndGV4dCcsIHZhbHVlOiBrb1NlbGVjdGVkXFxcIj48L3NlbGVjdD5cXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cXFwiaW5wdXQtZ3JvdXAtYnRuXFxcIj5cXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGRhdGEtYmluZD1cXFwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcXFwiIGNsYXNzPVxcXCJidG5cXFwiPjxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVxcXCI+PC9zcGFuPjwvYnV0dG9uPlxcbiAgICAgICAgICAgIDwvc3Bhbj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG4gICAgPGRpdiBkYXRhLWJpbmQ9XFxcInRlbXBsYXRlOiB7IG5hbWU6ICdvYmplY3RlZGl0b3InLCBkYXRhOiBzZWxlY3RlZE9iamVjdEVkaXRvciB9XFxcIj48L2Rpdj5cXG48L2Rpdj5cXG48L3NjcmlwdD5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXZhbGlkYXRvcnMuaHRtbFxuLy8gbW9kdWxlIGlkID0gNTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicXVlc3Rpb25lZGl0b3JcXFwiPlxcclxcbiAgICA8ZGl2IGlkPVxcXCJzdXJ2ZXlxdWVzdGlvbmVkaXRvcndpbmRvd1xcXCIgY2xhc3M9XFxcIm1vZGFsIGZhZGVcXFwiIHJvbGU9XFxcImRpYWxvZ1xcXCJkYXRhLWJpbmQ9XFxcIndpdGg6a29FZGl0b3JcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibW9kYWwtZGlhbG9nXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtb2RhbC1jb250ZW50XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibW9kYWwtaGVhZGVyXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiY2xvc2VcXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiPiZ0aW1lczs8L2J1dHRvbj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cXFwibW9kYWwtdGl0bGVcXFwiIGRhdGEtYmluZD1cXFwidGV4dDprb1RpdGxlXFxcIj48L2g0PlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj4gIFxcclxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJtb2RhbC1ib2R5IHN2ZF9ub3RvcGJvdHRvbXBhZGRpbmdzXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cXFwibmF2IG5hdi10YWJzXFxcIiBkYXRhLWJpbmQ9XFxcImZvcmVhY2g6IGtvVGFic1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIHJvbGU9XFxcInByZXNlbnRhdGlvblxcXCIgZGF0YS1iaW5kPVxcXCJjc3M6IHthY3RpdmU6ICRwYXJlbnQua29BY3RpdmVUYWIoKSA9PSAkZGF0YS5uYW1lfSwgY2xpY2s6ICRwYXJlbnQub25UYWJDbGlja1xcXCI+PGE+PHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiRkYXRhLnRpdGxlXFxcIj48L3NwYW4+PC9hPjwvbGk+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L3VsPiAgICAgICAgICAgICAgIFxcclxcbiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb1RhYnMgLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZTokcGFyZW50LmtvQWN0aXZlVGFiKCkgPT0gJGRhdGEubmFtZVxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAkZGF0YS5odG1sVGVtcGxhdGUsIGRhdGE6ICRkYXRhLnRlbXBsYXRlT2JqZWN0IH0gLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT5cXHJcXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIm1vZGFsLWZvb3RlclxcXCI+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5XFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiBvbkFwcGx5Q2xpY2ssIHZhbHVlOiAkcm9vdC5nZXRMb2NTdHJpbmcoJ3BlLmFwcGx5JylcXFwiIHN0eWxlPVxcXCJ3aWR0aDoxMDBweFxcXCIgLz5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG4gYnRuLWRlZmF1bHRcXFwiIGRhdGEtZGlzbWlzcz1cXFwibW9kYWxcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6IG9uQXBwbHlDbGljaywgdmFsdWU6ICRyb290LmdldExvY1N0cmluZygncGUub2snKVxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMHB4XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCIgZGF0YS1kaXNtaXNzPVxcXCJtb2RhbFxcXCIgZGF0YS1iaW5kPVxcXCJjbGljazogb25SZXNldENsaWNrLCB2YWx1ZTogJHJvb3QuZ2V0TG9jU3RyaW5nKCdwZS5jYW5jZWwnKVxcXCIgc3R5bGU9XFxcIndpZHRoOjEwMHB4XFxcIiAvPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9yLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInF1ZXN0aW9uZWRpdG9ydGFiLWNvbW1lbnRcXFwiPlxcclxcbiAgICA8ZGl2ICBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc1Jvd3NcXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPlJvdyBjb3VudDo8L2xhYmVsPlxcclxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcIm51bWJlclxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29Sb3dzXFxcIiAvPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiAgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNQbGFjZUhvbGRlclxcXCI+XFxyXFxuICAgICAgICA8bGFiZWw+UGxhY2Vob2xkZXI6PC9sYWJlbD5cXHJcXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiBrb1BsYWNlSG9sZGVyXFxcIiAvPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLWNvbW1lbnQuaHRtbFxuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicXVlc3Rpb25lZGl0b3J0YWItZmlsZU9wdGlvbnNcXFwiPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJjaGVja2JveC1pbmxpbmVcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNTaG93UHJldmlld1xcXCI+PGlucHV0IHR5cGU9XFxcImNoZWNrYm94XFxcIiBkYXRhLWJpbmQ9XFxcImNoZWNrZWQ6IGtvU2hvd1ByZXZpZXdcXFwiPjxsYWJlbD5TaG93IHByZXZpZXcgZm9yIGltYWdlIGZpbGVzPC9sYWJlbD48L3NwYW4+XFxyXFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwiY2hlY2tib3gtaW5saW5lXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzU3RvcmVEYXRhQXNUZXh0XFxcIj48aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDoga29TdG9yZURhdGFBc1RleHRcXFwiPjxsYWJlbD5TdG9yZSBmaWxlIGNvbnRlbnQgZGlyZWN0bHkgaW4gSlNPTjwvbGFiZWw+PC9zcGFuPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiAgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNNYXhTaXplXFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5NYXhpbXVtIGZpbGUgc2l6ZSBmb3IgdXBsb2FkaW5nOjwvbGFiZWw+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiBrb01heFNpemVcXFwiIC8+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzSW1hZ2VIZWlnaHRcXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPlByZXZpZXcgaW1hZ2UgaGVpZ2h0OjwvbGFiZWw+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29JbWFnZUhlaWdodFxcXCIgLz5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNJbWFnZVdpZHRoXFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5QcmV2aWV3IGltYWdlIHdpZHRoOjwvbGFiZWw+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29JbWFnZVdpZHRoXFxcIiAvPlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLWZpbGVPcHRpb25zLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDU4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInF1ZXN0aW9uZWRpdG9ydGFiLWdlbmVyYWxcXFwiPlxcclxcbiAgICA8ZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPGxhYmVsPk5hbWU6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29OYW1lXFxcIiAvPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2ICBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc1RpdGxlXFxcIj5cXHJcXG4gICAgICAgICAgICA8bGFiZWw+VGl0bGU6PC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8dGV4dGFyZWEgdHlwZT1cXFwidGV4dFxcXCIgcm93cz1cXFwiMlxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29UaXRsZVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCI+XFxyXFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImNoZWNrYm94LWlubGluZVxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc1Zpc2libGVcXFwiPjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiBrb1Zpc2libGVcXFwiPjxsYWJlbD5WaXNpYmxlPC9sYWJlbD48L3NwYW4+XFxyXFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImNoZWNrYm94LWlubGluZVxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc0lzUmVxdWlyZWRcXFwiPjxpbnB1dCB0eXBlPVxcXCJjaGVja2JveFxcXCIgZGF0YS1iaW5kPVxcXCJjaGVja2VkOiBrb0lzUmVxdWlyZWRcXFwiPjxsYWJlbD5SZXF1aXJlZDwvbGFiZWw+PC9zcGFuPlxcclxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJjaGVja2JveC1pbmxpbmVcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNTdGFydFdpdGhOZXdMaW5lXFxcIj48aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDoga29TdGFydFdpdGhOZXdMaW5lXFxcIj48bGFiZWw+U3RhcnQgd2l0aCBuZXcgbGluZTwvbGFiZWw+PC9zcGFuPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNBZGRpdGlvbmFsVGVtcGxhdGVcXFwiPlxcclxcbiAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJGRhdGEuYWRkaXRpb25hbFRlbXBsYXRlSHRtbCwgZGF0YTogJGRhdGEgfSAtLT5cXHJcXG4gICAgICAgICAgICA8IS0tIC9rbyAtLT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLWdlbmVyYWwuaHRtbFxuLy8gbW9kdWxlIGlkID0gNTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicXVlc3Rpb25lZGl0b3J0YWItbWF0cml4ZHJvcGRvd25cXFwiPlxcclxcbiAgICA8ZGl2ICBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc0NlbGxUeXBlXFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5EZWZhdWx0IGNlbGwgZWRpdG9yIHR5cGU6PC9sYWJlbD5cXHJcXG4gICAgICAgIDxzZWxlY3QgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgIGRhdGEtYmluZD1cXFwidmFsdWU6IGtvQ2VsbFR5cGUsIG9wdGlvbnM6IGtvQ2VsbFR5cGVDaG9pY2VzXFxcIj48L3NlbGVjdD5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1tYXRyaXhkcm9wZG93bi5odG1sXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJxdWVzdGlvbmVkaXRvcnRhYi1tYXRyaXhkeW5hbWljXFxcIj5cXHJcXG4gICAgPGRpdiAgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNDZWxsVHlwZVxcXCI+XFxyXFxuICAgICAgICA8bGFiZWw+RGVmYXVsdCBjZWxsIGVkaXRvciB0eXBlOjwvbGFiZWw+XFxyXFxuICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiICBkYXRhLWJpbmQ9XFxcInZhbHVlOiBrb0NlbGxUeXBlLCBvcHRpb25zOiBrb0NlbGxUeXBlQ2hvaWNlc1xcXCI+PC9zZWxlY3Q+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzUm93Q291bnRcXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPkRlZmF1bHQgcm93IGNvdW50OjwvbGFiZWw+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwibnVtYmVyXFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiBrb1Jvd0NvdW50XFxcIiAvPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc0FkZFJvd1RleHRcXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPkFkZCByb3cgYnV0dG9uIHRleHQ6PC9sYWJlbD5cXHJcXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiBkYXRhLWJpbmQ9XFxcInZhbHVlOiBrb0FkZFJvd1RleHRcXFwiIC8+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzUmVtb3ZlUm93VGV4dFxcXCI+XFxyXFxuICAgICAgICA8bGFiZWw+UmVtb3ZlIHJvdyBidXR0b24gdGV4dDo8L2xhYmVsPlxcclxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6IGtvUmVtb3ZlUm93VGV4dFxcXCIgLz5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1tYXRyaXhkeW5hbWljLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInF1ZXN0aW9uZWRpdG9ydGFiLW11bHRpcGxldGV4dFxcXCI+XFxyXFxuICAgIDxkaXYgIGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzQ29sQ291bnRcXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPklucHV0IHRleHRzIGNvbHVtbiBjb3VudDo8L2xhYmVsPlxcclxcbiAgICAgICAgPHNlbGVjdCBjbGFzcz1cXFwiZm9ybS1jb250cm9sXFxcIiAgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29Db2xDb3VudCwgb3B0aW9uczoga29Db2xDb3VudENob2ljZXNcXFwiPjwvc2VsZWN0PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L3NjcmlwdD5cXHJcXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy90ZW1wbGF0ZXMvcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLW11bHRpcGxldGV4dC5odG1sXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2h0bWxcXFwiIGlkPVxcXCJxdWVzdGlvbmVkaXRvcnRhYi1yYXRpbmdcXFwiPlxcclxcbiAgICA8ZGl2ICBjbGFzcz1cXFwiZm9ybS1ncm91cFxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc01pbmludW1SYXRlRGVzY3JpcHRpb25cXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPk1pbmltdW0gcmF0ZSB0ZXh0OjwvbGFiZWw+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29NaW5pbnVtUmF0ZURlc2NyaXB0aW9uXFxcIiAvPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiAgY2xhc3M9XFxcImZvcm0tZ3JvdXBcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNNYXhpbXVtUmF0ZURlc2NyaXB0aW9uXFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5NYXhpbXVtIHJhdGUgdGV4dDo8L2xhYmVsPlxcclxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiIGRhdGEtYmluZD1cXFwidmFsdWU6IGtvTWF4aW11bVJhdGVEZXNjcmlwdGlvblxcXCIgLz5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9zY3JpcHQ+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1yYXRpbmcuaHRtbFxuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzY3JpcHQgdHlwZT1cXFwidGV4dC9odG1sXFxcIiBpZD1cXFwicXVlc3Rpb25lZGl0b3J0YWItdGV4dFxcXCI+XFxyXFxuICAgIDxkaXYgIGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzSW5wdXRUeXBlXFxcIj5cXHJcXG4gICAgICAgIDxsYWJlbD5JbnB1dCB0eXBlOjwvbGFiZWw+XFxyXFxuICAgICAgICA8c2VsZWN0IGNsYXNzPVxcXCJmb3JtLWNvbnRyb2xcXFwiICBkYXRhLWJpbmQ9XFxcInZhbHVlOiBrb0lucHV0VHlwZSwgb3B0aW9uczoga29JbnB1dFR5cGVDaG9pY2VzXFxcIj48L3NlbGVjdD5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgIGNsYXNzPVxcXCJmb3JtLWdyb3VwXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6aGFzUGxhY2VIb2xkZXJcXFwiPlxcclxcbiAgICAgICAgPGxhYmVsPlBsYWNlaG9sZGVyOjwvbGFiZWw+XFxyXFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImZvcm0tY29udHJvbFxcXCIgZGF0YS1iaW5kPVxcXCJ2YWx1ZToga29QbGFjZUhvbGRlclxcXCIgLz5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi10ZXh0Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c2NyaXB0IHR5cGU9XFxcInRleHQvaHRtbFxcXCIgaWQ9XFxcInN1cnZleWVtYmVkaW5nXFxcIj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVxcXCJ2YWx1ZTprb0xpYnJhcnlWZXJzaW9uXFxcIj5cXHJcXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCJhbmd1bGFyXFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZXcuYW5ndWxhcicpXFxcIj48L29wdGlvbj5cXHJcXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCJqcXVlcnlcXFwiIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdldy5qcXVlcnknKVxcXCI+PC9vcHRpb24+XFxyXFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwia25vY2tvdXRcXFwiIGRhdGEtYmluZD1cXFwidGV4dDogJHJvb3QuZ2V0TG9jU3RyaW5nKCdldy5rbm9ja291dCcpXFxcIj48L29wdGlvbj5cXHJcXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCJyZWFjdFxcXCIgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2V3LnJlYWN0JylcXFwiPjwvb3B0aW9uPlxcclxcbiAgICAgICAgPC9zZWxlY3Q+XFxyXFxuICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cXFwidmFsdWU6a29TY3JpcHRVc2luZ1xcXCI+XFxyXFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiYm9vdHN0cmFwXFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZXcuYm9vdHN0cmFwJylcXFwiPjwvb3B0aW9uPlxcclxcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcInN0YW5kYXJkXFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZXcuc3RhbmRhcmQnKVxcXCI+PC9vcHRpb24+XFxyXFxuICAgICAgICA8L3NlbGVjdD5cXHJcXG4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVxcXCJ2YWx1ZTprb1Nob3dBc1dpbmRvd1xcXCI+XFxyXFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwicGFnZVxcXCIgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2V3LnNob3dPblBhZ2UnKVxcXCI+PC9vcHRpb24+XFxyXFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwid2luZG93XFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZXcuc2hvd0luV2luZG93JylcXFwiPjwvb3B0aW9uPlxcclxcbiAgICAgICAgPC9zZWxlY3Q+XFxyXFxuICAgICAgICA8bGFiZWwgY2xhc3M9XFxcImNoZWNrYm94LWlubGluZVxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmtvSGFzSWRzXFxcIj5cXHJcXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGRhdGEtYmluZD1cXFwiY2hlY2tlZDprb0xvYWRTdXJ2ZXlcXFwiIC8+XFxyXFxuICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2V3LmxvYWRGcm9tU2VydmVyJylcXFwiPjwvc3Bhbj5cXHJcXG4gICAgICAgIDwvbGFiZWw+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nXFxcIiBkYXRhLWJpbmQ9XFxcInRleHQ6ICRyb290LmdldExvY1N0cmluZygnZXcudGl0bGVTY3JpcHQnKVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZTpoYXNBY2VFZGl0b3JcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgaWQ9XFxcInN1cnZleUVtYmVkaW5nSGVhZFxcXCIgc3R5bGU9XFxcImhlaWdodDo3MHB4O3dpZHRoOjEwMCVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8dGV4dGFyZWEgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiFoYXNBY2VFZGl0b3IsIHRleHQ6IGtvSGVhZFRleHRcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6NzBweDt3aWR0aDoxMDAlXFxcIj48L3RleHRhcmVhPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwicGFuZWxcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZToga29WaXNpYmxlSHRtbFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nXFxcIiAgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2V3LnRpdGxlSHRtbCcpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc0FjZUVkaXRvclxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwic3VydmV5RW1iZWRpbmdCb2R5XFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjMwcHg7d2lkdGg6MTAwJVxcXCI+PC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDx0ZXh0YXJlYSBkYXRhLWJpbmQ9XFxcInZpc2libGU6IWhhc0FjZUVkaXRvciwgdGV4dDoga29Cb2R5VGV4dFxcXCIgc3R5bGU9XFxcImhlaWdodDozMHB4O3dpZHRoOjEwMCVcXFwiPjwvdGV4dGFyZWE+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbFxcXCI+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwYW5lbC1oZWFkaW5nXFxcIiAgZGF0YS1iaW5kPVxcXCJ0ZXh0OiAkcm9vdC5nZXRMb2NTdHJpbmcoJ2V3LnRpdGxlSmF2YVNjcmlwdCcpXFxcIj48L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOmhhc0FjZUVkaXRvclxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBpZD1cXFwic3VydmV5RW1iZWRpbmdKYXZhXFxcIiBzdHlsZT1cXFwiaGVpZ2h0OjMwMHB4O3dpZHRoOjEwMCVcXFwiPjwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8dGV4dGFyZWEgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiFoYXNBY2VFZGl0b3IsIHRleHQ6IGtvSmF2YVRleHRcXFwiIHN0eWxlPVxcXCJoZWlnaHQ6MzAwcHg7d2lkdGg6MTAwJVxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuPC9zY3JpcHQ+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGVtcGxhdGVzL3N1cnZleWVtYmVkaW5nLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGRhdGEtYmluZD1cXFwiZXZlbnQ6e1xcbiAgICAgICAgICAgZHJhZ2VudGVyOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0VudGVyKGUpO30sXFxuICAgICAgICAgICBkcmFnbGVhdmU6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnTGVhdmUoZSk7fSxcXG4gICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgcmV0dXJuIGZhbHNlO30sXFxuICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fX1cXG4gICAgIFxcXCI+XFxuICAgIDxoNCBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICh0aXRsZS5sZW5ndGggPiAwKSAmJiBkYXRhLnNob3dQYWdlVGl0bGVzLCB0ZXh0OiBrb05vKCkgKyBwcm9jZXNzZWRUaXRsZSwgY3NzOiAkcm9vdC5jc3MucGFnZVRpdGxlXFxcIj48L2g0PlxcbiAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcm93cywgYXM6ICdyb3cnfSAtLT5cXG4gICAgPGRpdiBjbGFzcz1cXFwic3ZkX3F1ZXN0aW9uX2NvbnRhaW5lclxcXCIgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiByb3cua29WaXNpYmxlLCBjc3M6ICRyb290LmNzcy5yb3dcXFwiPlxcbiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHJvdy5xdWVzdGlvbnMsIGFzOiAncXVlc3Rpb24nICwgYWZ0ZXJSZW5kZXI6IHJvdy5rb0FmdGVyUmVuZGVyIH0gLS0+XFxuICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IHF1ZXN0aW9uLmtvSXNEcmFnZ2luZ1xcXCI+XFxuICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgaWY6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgbmFtZTogJ3N1cnZleS1xdWVzdGlvbicsIGRhdGE6ICRyb290LmtvRHJhZ2dpbmdTb3VyY2UoKSwgYXM6ICdxdWVzdGlvbicsIHRlbXBsYXRlT3B0aW9uczogeyBpc0RyYWdnaW5nOiB0cnVlIH0gfSAtLT5cXG4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiAnc3VydmV5LXF1ZXN0aW9uJywgZGF0YTogcXVlc3Rpb24sIHRlbXBsYXRlT3B0aW9uczogeyBpc0RyYWdnaW5nOiBmYWxzZSB9IH0gLS0+XFxuICAgICAgICAgICAgPCEtLSAva28gLS0+XFxuICAgICAgICA8IS0tIC9rbyAtLT5cXG4gICAgPC9kaXY+XFxuICAgIDwhLS0gL2tvIC0tPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ3ZWxsXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6JHJvb3QuaXNEZXNpZ25Nb2RlICYmIHF1ZXN0aW9ucy5sZW5ndGggPT0gMFxcXCI+XFxuICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICFrb0RyYWdnaW5nQm90dG9tKCksIHRleHQ6JHJvb3QuZ2V0RWRpdG9yTG9jU3RyaW5nKCdzdXJ2ZXkuZHJvcFF1ZXN0aW9uJylcXFwiPjwvc3Bhbj5cXG4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiBrb0RyYWdnaW5nQm90dG9tXFxcIj5cXG4gICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IGlmOiAkcm9vdC5rb0RyYWdnaW5nU291cmNlKCksIG5hbWU6ICdzdXJ2ZXktcXVlc3Rpb24nLCBkYXRhOiAkcm9vdC5rb0RyYWdnaW5nU291cmNlKCksIGFzOiAncXVlc3Rpb24nLCB0ZW1wbGF0ZU9wdGlvbnM6IHsgaXNEcmFnZ2luZzogdHJ1ZSB9IH0gLS0+XFxuICAgICAgICAgICAgPCEtLSAva28gLS0+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiBxdWVzdGlvbnMubGVuZ3RoID4gMCAmJiBrb0RyYWdnaW5nQm90dG9tKClcXFwiPlxcbiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBpZjogJHJvb3Qua29EcmFnZ2luZ1NvdXJjZSgpLCBuYW1lOiAnc3VydmV5LXF1ZXN0aW9uJywgZGF0YTogJHJvb3Qua29EcmFnZ2luZ1NvdXJjZSgpLCBhczogJ3F1ZXN0aW9uJywgdGVtcGxhdGVPcHRpb25zOiB7IGlzRHJhZ2dpbmc6IHRydWUgfSB9IC0tPlxcbiAgICAgICAgPCEtLSAva28gLS0+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9odG1sLWxvYWRlcj9pbnRlcnBvbGF0ZSEuL34vdmFsLWxvYWRlciEuL3NyYy90ZW1wbGF0ZXMuc3VydmV5L3RlbXBsYXRlX3BhZ2UuaHRtbFxuLy8gbW9kdWxlIGlkID0gNjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxkaXYgY2xhc3M9XFxcInN2ZF9xdWVzdGlvblxcXCIgc3R5bGU9XFxcInZlcnRpY2FsLWFsaWduOnRvcFxcXCIgZGF0YS1iaW5kPVxcXCJzdHlsZToge2Rpc3BsYXk6IHF1ZXN0aW9uLmtvVmlzaWJsZSgpfHwgJHJvb3QuaXNEZXNpZ25Nb2RlID8gJ2lubGluZS1ibG9jayc6ICdub25lJywgbWFyZ2luTGVmdDogcXVlc3Rpb24ua29NYXJnaW5MZWZ0LCBwYWRkaW5nUmlnaHQ6IHF1ZXN0aW9uLmtvUGFkZGluZ1JpZ2h0LCB3aWR0aDogcXVlc3Rpb24ua29SZW5kZXJXaWR0aCB9LFxcbiAgICAgYXR0ciA6IHtpZDogaWQsIGRyYWdnYWJsZTogJHJvb3QuaXNEZXNpZ25Nb2RlfSwgY2xpY2s6ICRyb290LmlzRGVzaWduTW9kZSA/IGtvT25DbGljazogbnVsbCwgXFxuICAgICAgICAgZXZlbnQ6e1xcbiAgICAgICAgICAga2V5ZG93bjogZnVuY3Rpb24oZWwsIGUpIHsgaWYoZS53aXRjaCA9PSA0NikgJHJvb3QuZGVsZXRlQ3VycmVudE9iamVjdENsaWNrKCk7IHJldHVybiB0cnVlOyB9LFxcbiAgICAgICAgICAgZHJhZ3N0YXJ0OmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ1N0YXJ0KGUpOyByZXR1cm4gdHJ1ZTsgfSxcXG4gICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgaWYoIXF1ZXN0aW9uLmlzRHJhZ2dpbmcpIGRyYWdPdmVyKGUpO30sXFxuICAgICAgICAgICBkcmFnZW5kOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0VuZChlKTt9LFxcbiAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7IGRyYWdEcm9wKGUpO31cXG4gICAgICAgICB9LCBjc3M6e3N2ZF9xX2Rlc2lnbl9ib3JkZXI6ICRyb290LmlzRGVzaWduTW9kZSwgc3ZkX3Ffc2VsZWN0ZWQgOiBrb0lzU2VsZWN0ZWQsICd3ZWxsIHdlbGwtc20nOiAkcm9vdC5pc0Rlc2lnbk1vZGV9XFxcIj5cXG4gICAgPGRpdiBkYXRhLWJpbmQ9XFxcImNzczp7c3ZkX3FfZGVzaWduOiAkcm9vdC5pc0Rlc2lnbk1vZGV9LCBzdHlsZTp7b3BhY2l0eTogcXVlc3Rpb24ua29Jc0RyYWdnaW5nU291cmNlKCkgPyAwLjQgOiAxfVxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJhbGVydCBhbGVydC1kYW5nZXJcXFwiIHJvbGU9XFxcImFsZXJ0XFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IGtvRXJyb3JzKCkubGVuZ3RoID4gMCwgZm9yZWFjaDoga29FcnJvcnNcXFwiPlxcbiAgICAgICAgICAgIDxkaXY+XFxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJnbHlwaGljb24gZ2x5cGhpY29uLWV4Y2xhbWF0aW9uLXNpZ25cXFwiIGFyaWEtaGlkZGVuPVxcXCJ0cnVlXFxcIj48L3NwYW4+XFxuICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cXFwidGV4dDokZGF0YS5nZXRUZXh0KClcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPCEtLSBrbyBpZjogcXVlc3Rpb24uaGFzVGl0bGUgLS0+XFxuICAgICAgICA8aDUgZGF0YS1iaW5kPVxcXCJ2aXNpYmxlOiAkcm9vdC5xdWVzdGlvblRpdGxlTG9jYXRpb24gPT0gJ3RvcCcsIHRleHQ6IHF1ZXN0aW9uLmtvVGl0bGUoKSwgY3NzOiAkcm9vdC5jc3MucXVlc3Rpb24udGl0bGVcXFwiPjwvaDU+XFxuICAgICAgICA8IS0tIC9rbyAtLT5cXG4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogJ3N1cnZleS1xdWVzdGlvbi0nICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPlxcbiAgICAgICAgPCEtLSAva28gLS0+XFxuICAgICAgICA8ZGl2IGRhdGEtYmluZD1cXFwidmlzaWJsZTogcXVlc3Rpb24uaGFzQ29tbWVudFxcXCI+XFxuICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XFxcInRleHQ6cXVlc3Rpb24uY29tbWVudFRleHRcXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVxcXCJ0ZW1wbGF0ZTogeyBuYW1lOiAnc3VydmV5LWNvbW1lbnQnLCBkYXRhOiB7J3F1ZXN0aW9uJzogcXVlc3Rpb24sICd2aXNpYmxlJzogdHJ1ZSB9IH1cXFwiPjwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8IS0tIGtvIGlmOiBxdWVzdGlvbi5oYXNUaXRsZSAtLT5cXG4gICAgICAgIDxoNSBkYXRhLWJpbmQ9XFxcInZpc2libGU6ICRyb290LnF1ZXN0aW9uVGl0bGVMb2NhdGlvbiA9PSAnYm90dG9tJywgdGV4dDogcXVlc3Rpb24ua29UaXRsZSgpLCBjc3M6ICRyb290LmNzcy5xdWVzdGlvbi50aXRsZVxcXCI+PC9oNT5cXG4gICAgICAgIDwhLS0gL2tvIC0tPlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPGRpdiBjbGFzcz1cXFwic3ZkX3F1ZXN0aW9uX21lbnVcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZToga29Jc1NlbGVjdGVkXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImJ0bi1ncm91cFxcXCIgcm9sZT1cXFwiZ3JvdXBcXFwiPlxcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5ICBidG4teHNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRyb290LmVkaXRRdWVzdGlvbkNsaWNrXFxcIj48c3Bhbj5FZGl0PC9zcGFuPjwvYnV0dG9uPlxcbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cXFwiYnV0dG9uXFxcIiBjbGFzcz1cXFwiYnRuIGJ0bi1wcmltYXJ5ICBidG4teHMgZHJvcGRvd24tdG9nZ2xlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiZHJvcGRvd25cXFwiIGFyaWEtaGFzcG9wdXA9XFxcInRydWVcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcImZhbHNlXFxcIj5cXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImdseXBoaWNvbiBnbHlwaGljb24tb3B0aW9uLWhvcml6b250YWxcXFwiPjwvc3Bhbj5cXG4gICAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgICAgICA8dWwgY2xhc3M9XFxcImRyb3Bkb3duLW1lbnVcXFwiPlxcbiAgICAgICAgICAgICAgICA8bGk+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcm9vdC5jb3B5UXVlc3Rpb25DbGljaywgdGV4dDokcm9vdC5nZXRFZGl0b3JMb2NTdHJpbmcoJ3N1cnZleS5hZGRUb1Rvb2xib3gnKVxcXCI+PC9idXR0b24+XFxuICAgICAgICAgICAgICAgIDwvbGk+XFxuICAgICAgICAgICAgICAgIDxsaT5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeSBidG4teHNcXFwiIGRhdGEtYmluZD1cXFwiY2xpY2s6ICRyb290LmZhc3RDb3B5UXVlc3Rpb25DbGljaywgdGV4dDokcm9vdC5nZXRFZGl0b3JMb2NTdHJpbmcoJ3N1cnZleS5jb3B5JylcXFwiPjwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICA8L2xpPlxcbiAgICAgICAgICAgICAgICA8bGk+XFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXFxcIiBkYXRhLWJpbmQ9XFxcImNsaWNrOiAkcm9vdC5kZWxldGVDdXJyZW50T2JqZWN0Q2xpY2ssIHRleHQ6JHJvb3QuZ2V0RWRpdG9yTG9jU3RyaW5nKCdzdXJ2ZXkuZGVsZXRlUXVlc3Rpb24nKVxcXCI+PC9idXR0b24+XFxuICAgICAgICAgICAgICAgIDwvbGk+XFxuICAgICAgICAgICAgPC91bD5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vaHRtbC1sb2FkZXI/aW50ZXJwb2xhdGUhLi9+L3ZhbC1sb2FkZXIhLi9zcmMvdGVtcGxhdGVzLnN1cnZleS90ZW1wbGF0ZV9xdWVzdGlvbi5odG1sXG4vLyBtb2R1bGUgaWQgPSA2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiXCIgKyByZXF1aXJlKCcuL2luZGV4Lmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL2pzb25lZGl0b3IuaHRtbCcpICsgXCJcXG5cIiArIHJlcXVpcmUoJy4vb2JqZWN0ZWRpdG9yLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL29iamVjdHZlcmJzLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3BhZ2VlZGl0b3IuaHRtbCcpICsgXCJcXG5cIiArIHJlcXVpcmUoJy4vc3VydmV5ZW1iZWRpbmcuaHRtbCcpICsgXCJcXG5cIiArIHJlcXVpcmUoJy4vcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9yLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1jb21tZW50Lmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi1maWxlT3B0aW9ucy5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25lZGl0b3J0YWItZ2VuZXJhbC5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25lZGl0b3J0YWItbWF0cml4ZHJvcGRvd24uaHRtbCcpICsgXCJcXG5cIiArIHJlcXVpcmUoJy4vcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLW1hdHJpeGR5bmFtaWMuaHRtbCcpICsgXCJcXG5cIiArIHJlcXVpcmUoJy4vcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uZWRpdG9ydGFiLW11bHRpcGxldGV4dC5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25lZGl0b3J0YWItcmF0aW5nLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbmVkaXRvcnRhYi10ZXh0Lmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1ib29sZWFuLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1kcm9wZG93bi5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItaHRtbC5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItZXhwcmVzc2lvbi5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItaXRlbXZhbHVlcy5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItbWF0cml4ZHJvcGRvd25jb2x1bW5zLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1tb2RhbC5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3ItbnVtYmVyLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci1yZXN0ZnVsbC5odG1sJykgKyBcIlxcblwiICsgcmVxdWlyZSgnLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHllZGl0b3Itc3RyaW5nLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci10ZXh0Lmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci10ZXh0aXRlbXMuaHRtbCcpICsgXCJcXG5cIiArIHJlcXVpcmUoJy4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zLmh0bWwnKSArIFwiXFxuXCIgKyByZXF1aXJlKCcuL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eWVkaXRvci12YWxpZGF0b3JzLmh0bWwnKSArIFwiXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2h0bWwtbG9hZGVyP2ludGVycG9sYXRlIS4vfi92YWwtbG9hZGVyIS4vc3JjL3RlbXBsYXRlcy9lbnRyeS5odG1sXG4vLyBtb2R1bGUgaWQgPSA2OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgKiBhcyBrbyBmcm9tIFwia25vY2tvdXRcIjtcclxuaW1wb3J0IHtTdXJ2ZXlUZXh0V29ya2VyfSBmcm9tIFwiLi90ZXh0V29ya2VyXCI7XHJcbmltcG9ydCAqIGFzIFN1cnZleSBmcm9tIFwic3VydmV5LWtub2Nrb3V0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5SlNPTkVkaXRvciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVRleHRUaW1lb3V0OiBudW1iZXIgPSAxMDAwO1xyXG5cclxuICAgIHByaXZhdGUgaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHk6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgYWNlRWRpdG9yOiBBY2VBamF4LkVkaXRvcjtcclxuICAgIHByaXZhdGUgdGV4dFdvcmtlcjogU3VydmV5VGV4dFdvcmtlcjtcclxuICAgIGtvVGV4dDogYW55O1xyXG4gICAga29FcnJvcnM6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmtvVGV4dCA9IGtvLm9ic2VydmFibGUoXCJcIik7XHJcbiAgICAgICAgdGhpcy5rb0Vycm9ycyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmtvVGV4dC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIHNlbGYub25Kc29uRWRpdG9yQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGluaXQoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0FjZUVkaXRvcikgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuYWNlRWRpdG9yID0gYWNlLmVkaXQoXCJzdXJ2ZXlqc0pTT05FZGl0b3JcIik7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuYWNlRWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL21vbm9rYWlcIik7XHJcbiAgICAgICAgdGhpcy5hY2VFZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICB0aGlzLmFjZUVkaXRvci5zZXRTaG93UHJpbnRNYXJnaW4oZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYWNlRWRpdG9yLmdldFNlc3Npb24oKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGYub25Kc29uRWRpdG9yQ2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYWNlRWRpdG9yLmdldFNlc3Npb24oKS5zZXRVc2VXb3JrZXIodHJ1ZSk7XHJcbiAgICAgICAgU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhciA9IHRoaXMuYWNlRWRpdG9yLnNlc3Npb24uZG9jLmdldE5ld0xpbmVDaGFyYWN0ZXIoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBnZXQgaGFzQWNlRWRpdG9yKCk6IGJvb2xlYW4geyByZXR1cm4gdHlwZW9mIGFjZSAhPT0gXCJ1bmRlZmluZWRcIjsgfVxyXG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0FjZUVkaXRvcikgcmV0dXJuIHRoaXMua29UZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNlRWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMua29UZXh0KHZhbHVlKTtcclxuICAgICAgICBpZiAodGhpcy5hY2VFZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3Iuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFjZUVkaXRvci5yZW5kZXJlci51cGRhdGVGdWxsKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByb2Nlc3NKc29uKHZhbHVlKTtcclxuICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2hvdyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuYWNlRWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWNlRWRpdG9yLmZvY3VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBpc0pzb25Db3JyZWN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMudGV4dFdvcmtlciA9IG5ldyBTdXJ2ZXlUZXh0V29ya2VyKHRoaXMudGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dFdvcmtlci5pc0pzb25Db3JyZWN0O1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiB0aGlzLnRleHRXb3JrZXIuc3VydmV5OyB9XHJcbiAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIG9uSnNvbkVkaXRvckNoYW5nZWQoKTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy50aW1lb3V0SWQgPiAtMSkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1Byb2Nlc3NpbmdJbW1lZGlhdGVseSkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudGltZW91dElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3NKc29uKHNlbGYudGV4dCk7XHJcbiAgICAgICAgICAgIH0sIFN1cnZleUpTT05FZGl0b3IudXBkYXRlVGV4dFRpbWVvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcHJvY2Vzc0pzb24odGV4dDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICBpZiAodGhpcy5hY2VFZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2VFZGl0b3IuZ2V0U2Vzc2lvbigpLnNldEFubm90YXRpb25zKHRoaXMuY3JlYXRlQW5ub3RhdGlvbnModGV4dCwgdGhpcy50ZXh0V29ya2VyLmVycm9ycykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy50ZXh0V29ya2VyLmVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVBbm5vdGF0aW9ucyh0ZXh0OiBzdHJpbmcsIGVycm9yczogYW55W10pOiBBY2VBamF4LkFubm90YXRpb25bXSB7XHJcbiAgICAgICAgdmFyIGFubm90YXRpb25zID0gbmV3IEFycmF5PEFjZUFqYXguQW5ub3RhdGlvbj4oKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBlcnJvcnNbaV07XHJcbiAgICAgICAgICAgIHZhciBhbm5vdGF0aW9uOiBBY2VBamF4LkFubm90YXRpb24gPSB7IHJvdzogZXJyb3IucG9zaXRpb24uc3RhcnQucm93LCBjb2x1bW46IGVycm9yLnBvc2l0aW9uLnN0YXJ0LmNvbHVtbiwgdGV4dDogZXJyb3IudGV4dCwgdHlwZTogXCJlcnJvclwiIH07XHJcbiAgICAgICAgICAgIGFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhbm5vdGF0aW9ucztcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXlKU09ORWRpdG9yLnRzIiwiaW1wb3J0ICogYXMga28gZnJvbSBcImtub2Nrb3V0XCI7XHJcbmltcG9ydCB7U3VydmV5SGVscGVyLCBPYmpUeXBlfSBmcm9tIFwiLi9zdXJ2ZXlIZWxwZXJcIjtcclxuaW1wb3J0ICogYXMgU3VydmV5IGZyb20gXCJzdXJ2ZXkta25vY2tvdXRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RJdGVtIHtcclxuICAgIHB1YmxpYyB2YWx1ZTogU3VydmV5LkJhc2U7XHJcbiAgICBwdWJsaWMgdGV4dDogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0cyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGludGVuZDogc3RyaW5nID0gXCIuLi5cIjtcclxuICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBrb09iamVjdHM6IGFueSwgcHVibGljIGtvU2VsZWN0ZWQ6IGFueSkge1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlOyB9XHJcbiAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2VJdGVtID0gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuc3VydmV5LnBhZ2VzLmluZGV4T2YocGFnZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgcHJldlBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHByZXZQYWdlKSArIDE7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHByZXZQYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5kZXggPSAxOyAvLzAgLSBTdXJ2ZXlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRJdGVtKHBhZ2VJdGVtLCBpbmRleCk7XHJcbiAgICAgICAgaW5kZXgrKztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCArIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQocGFnZUl0ZW0pO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFF1ZXN0aW9uKHBhZ2U6IFN1cnZleS5QYWdlLCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHBhZ2UpO1xyXG4gICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICB2YXIgcXVlc3Rpb25JbmRleCA9IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pICsgMTtcclxuICAgICAgICBpbmRleCArPSBxdWVzdGlvbkluZGV4O1xyXG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgdGhpcy5hZGRJdGVtKGl0ZW0sIGluZGV4KTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VsZWN0T2JqZWN0KG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmpzW2ldLnZhbHVlID09IG9iaikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG9ianNbaV0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIHJlbW92ZU9iamVjdChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGNvdW50VG9SZW1vdmUgPSAxO1xyXG4gICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZTogU3VydmV5LlBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICBjb3VudFRvUmVtb3ZlICs9IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCBjb3VudFRvUmVtb3ZlKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBuYW1lQ2hhbmdlZChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcclxuICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5rb09iamVjdHMoKVtpbmRleF0udGV4dCh0aGlzLmdldFRleHQob2JqKSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2VsZWN0TmV4dFF1ZXN0aW9uKGlzVXA6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFNlbGVjdGVkUXVlc3Rpb24oKTtcclxuICAgICAgICB2YXIgaXRlbUluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocXVlc3Rpb24pO1xyXG4gICAgICAgIGlmIChpdGVtSW5kZXggPCAwKSByZXR1cm4gcXVlc3Rpb247XHJcbiAgICAgICAgdmFyIG9ianMgPSB0aGlzLmtvT2JqZWN0cygpO1xyXG4gICAgICAgIHZhciBuZXdJdGVtSW5kZXggPSBpdGVtSW5kZXggKyAoaXNVcCA/IC0xIDogMSk7XHJcbiAgICAgICAgaWYgKG5ld0l0ZW1JbmRleCA8IG9ianMubGVuZ3RoICYmIFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9ianNbbmV3SXRlbUluZGV4XS52YWx1ZSkgPT0gT2JqVHlwZS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICBpdGVtSW5kZXggPSBuZXdJdGVtSW5kZXg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3SXRlbUluZGV4ID0gaXRlbUluZGV4O1xyXG4gICAgICAgICAgICB3aGlsZSAobmV3SXRlbUluZGV4IDwgb2Jqcy5sZW5ndGggJiYgU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2Jqc1tuZXdJdGVtSW5kZXhdLnZhbHVlKSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtSW5kZXggPSBuZXdJdGVtSW5kZXg7XHJcbiAgICAgICAgICAgICAgICBuZXdJdGVtSW5kZXggKz0gKGlzVXAgPyAxIDogLTEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMua29TZWxlY3RlZChvYmpzW2l0ZW1JbmRleF0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRTZWxlY3RlZFF1ZXN0aW9uKCk6IFN1cnZleS5RdWVzdGlvbkJhc2Uge1xyXG4gICAgICAgIGlmICghdGhpcy5rb1NlbGVjdGVkKCkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIHZhciBvYmogPSB0aGlzLmtvU2VsZWN0ZWQoKS52YWx1ZTtcclxuICAgICAgICBpZiAoIW9iaikgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5RdWVzdGlvbiA/IDxTdXJ2ZXkuUXVlc3Rpb25CYXNlPihvYmopIDogbnVsbDtcclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFkZEl0ZW0oaXRlbTogU3VydmV5T2JqZWN0SXRlbSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA+IHRoaXMua29PYmplY3RzKCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlYnVpbGQoKSB7XHJcbiAgICAgICAgdmFyIG9ianMgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cyhvYmpzKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZUl0ZW0odGhpcy5zdXJ2ZXksIFwiU3VydmV5XCIpKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5LnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVQYWdlKHBhZ2UpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgb2Jqcy5wdXNoKHRoaXMuY3JlYXRlUXVlc3Rpb24ocGFnZS5xdWVzdGlvbnNbal0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmtvT2JqZWN0cyhvYmpzKTtcclxuICAgICAgICB0aGlzLmtvU2VsZWN0ZWQodGhpcy5zdXJ2ZXkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSXRlbShwYWdlLCB0aGlzLmdldFRleHQocGFnZSkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVRdWVzdGlvbihxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUl0ZW0ocXVlc3Rpb24sIHRoaXMuZ2V0VGV4dChxdWVzdGlvbikpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVJdGVtKHZhbHVlOiBTdXJ2ZXkuQmFzZSwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGl0ZW0gPSBuZXcgU3VydmV5T2JqZWN0SXRlbSgpO1xyXG4gICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICBpdGVtLnRleHQgPSBrby5vYnNlcnZhYmxlKHRleHQpO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRJdGVtSW5kZXgodmFsdWU6IFN1cnZleS5CYXNlKTogbnVtYmVyIHtcclxuICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmpzW2ldLnZhbHVlID09IHZhbHVlKSByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXRUZXh0KG9iajogU3VydmV5LkJhc2UpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBpbnRlbmQgPSBTdXJ2ZXlPYmplY3RzLmludGVuZDtcclxuICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSAhPSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgaW50ZW5kICs9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW50ZW5kICsgU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUob2JqKTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdXJ2ZXlPYmplY3RzLnRzIiwiLy8gc3R5bGVzXHJcbmltcG9ydCBcIi4uL21haW4uc2Nzc1wiO1xyXG5cclxuZXhwb3J0IHtEcmFnRHJvcEhlbHBlcn0gZnJvbSBcIi4uL2RyYWdkcm9waGVscGVyXCI7XHJcbmV4cG9ydCB7XHJcbiAgICBTdXJ2ZXlQcm9wZXJ0eUVkaXRvckJhc2UsIFN1cnZleVN0cmluZ1Byb3BlcnR5RWRpdG9yLFxyXG4gICAgU3VydmV5RHJvcGRvd25Qcm9wZXJ0eUVkaXRvciwgU3VydmV5Qm9vbGVhblByb3BlcnR5RWRpdG9yLCBTdXJ2ZXlOdW1iZXJQcm9wZXJ0eUVkaXRvclxyXG59IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlFZGl0b3JCYXNlXCI7XHJcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlUZXh0SXRlbXNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUZXh0SXRlbXNFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1zRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5SXRlbXNFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlJdGVtVmFsdWVzRWRpdG9yXCI7XHJcbmV4cG9ydCB7U3VydmV5UHJvcGVydHlEcm9wZG93bkNvbHVtbnNFZGl0b3IsIFN1cnZleVByb3BlcnR5TWF0cml4RHJvcGRvd25Db2x1bW5zSXRlbX1cclxuICAgIGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlNYXRyaXhEcm9wZG93bkNvbHVtbnNFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eU1vZGFsRWRpdG9yfSBmcm9tIFwiLi4vcHJvcGVydHlFZGl0b3JzL3Byb3BlcnR5TW9kYWxFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQcm9wZXJ0eVJlc3VsdGZ1bGxFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlSZXN0ZnVsbEVkaXRvclwiO1xyXG5leHBvcnQge1N1cnZleVByb3BlcnR5VHJpZ2dlcnNFZGl0b3J9IGZyb20gXCIuLi9wcm9wZXJ0eUVkaXRvcnMvcHJvcGVydHlUcmlnZ2Vyc0VkaXRvclwiO1xyXG5leHBvcnQge1N1cnZleVByb3BlcnR5VmFsaWRhdG9yc0VkaXRvcn0gZnJvbSBcIi4uL3Byb3BlcnR5RWRpdG9ycy9wcm9wZXJ0eVZhbGlkYXRvcnNFZGl0b3JcIjtcclxuXHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25TZWxlY3RCYXNlRWRpdG9yfSBmcm9tIFwiLi4vcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uU2VsZWN0QmFzZUVkaXRvclwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uVGV4dEVkaXRvcn0gZnJvbSBcIi4uL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvblRleHRFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbk11bHRpcGxlVGV4dEVkaXRvcn0gZnJvbSBcIi4uL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbk11bHRpcGxlVGV4dEVkaXRvclwiO1xyXG5leHBvcnQge1N1cnZleVF1ZXN0aW9uQ29tbWVudEVkaXRvcn0gZnJvbSBcIi4uL3F1ZXN0aW9uRWRpdG9ycy9xdWVzdGlvbkNvbW1lbnRFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbkh0bWxFZGl0b3J9IGZyb20gXCIuLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25IdG1sRWRpdG9yXCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25NYXRyaXhFZGl0b3J9IGZyb20gXCIuLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25NYXRyaXhFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbk1hdHJpeERyb3Bkb3duRWRpdG9yfSBmcm9tIFwiLi4vcXVlc3Rpb25FZGl0b3JzL3F1ZXN0aW9uTWF0cml4RHJvcGRvd25FZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbk1hdHJpeER5bmFtaWNFZGl0b3J9IGZyb20gXCIuLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25NYXRyaXhEeW5hbWljRWRpdG9yXCI7XHJcbmV4cG9ydCB7U3VydmV5UXVlc3Rpb25SYXRpbmdFZGl0b3J9IGZyb20gXCIuLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25SYXRpbmdFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlRdWVzdGlvbkZpbGVFZGl0b3J9IGZyb20gXCIuLi9xdWVzdGlvbkVkaXRvcnMvcXVlc3Rpb25GaWxlRWRpdG9yXCI7XHJcblxyXG5leHBvcnQge1N1cnZleU9iamVjdFByb3BlcnR5fSBmcm9tIFwiLi4vb2JqZWN0UHJvcGVydHlcIjtcclxuZXhwb3J0IHtTdXJ2ZXlPYmplY3RFZGl0b3J9IGZyb20gXCIuLi9vYmplY3RFZGl0b3JcIjtcclxuZXhwb3J0IHtTdXJ2ZXlQYWdlc0VkaXRvcn0gZnJvbSBcIi4uL3BhZ2VzRWRpdG9yXCI7XHJcbmV4cG9ydCB7U3VydmV5VGV4dFdvcmtlcn0gZnJvbSBcIi4uL3RleHRXb3JrZXJcIjtcclxuZXhwb3J0IHtPYmpUeXBlLCBTdXJ2ZXlIZWxwZXJ9IGZyb20gXCIuLi9zdXJ2ZXlIZWxwZXJcIjtcclxuZXhwb3J0IHtTdXJ2ZXlFbWJlZGluZ1dpbmRvd30gZnJvbSBcIi4uL3N1cnZleUVtYmVkaW5nV2luZG93XCI7XHJcbmV4cG9ydCB7U3VydmV5VmVyYnMsIFN1cnZleVZlcmJJdGVtLCBTdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0sIFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbX0gZnJvbSBcIi4uL29iamVjdFZlcmJzXCI7XHJcbmV4cG9ydCB7U3VydmV5VW5kb1JlZG8sIFVuZG9SZWRvSXRlbX0gZnJvbSBcIi4uL3VuZG9yZWRvXCI7XHJcbmV4cG9ydCB7U3VydmV5RWRpdG9yfSBmcm9tIFwiLi4vZWRpdG9yXCI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2VudHJpZXMvaW5kZXgudHMiXSwic291cmNlUm9vdCI6IiJ9