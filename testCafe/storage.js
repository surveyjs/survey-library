window.SurveysStorage = {
    "radiogroup": {
        data: {
            questions: [{
                type: "radiogroup",
                name: "car",
                title: "What car are you driving?",
                isRequired: true,
                colCount: 4,
                choices: [
                    "None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota",
                    "Citroen"
                ]
            }]
        },
        modifications: [
            {
                title: "column_count_to_1",
                value: {
                    colCount: 1
                }
            },
            {
                title: "column_count_to_2",
                value: {
                    colCount: 2
                }
            },
            {
                title: "order_asc",
                value: {
                    choicesOrder: "asc"
                }
            },
            {
                title: "order_desc",
                value: {
                    choicesOrder: "desc"
                }
            },
            {
                title: "order_random",
                value: {
                    choicesOrder: "random"
                }
            },
            {
                title: "show_other",
                value: {
                    hasOther: true,
                    otherText: "Other"
                }
            }
        ]
    },

    "dropdown": {
        data: {
            questions: [{
                type: "dropdown",
                name: "car",
                title: "What car are you driving?",
                isRequired: true,
                colCount: 0,
                choices: [
                    "None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot",
                    "Toyota", "Citroen"
                ]
            }]
        },
        modifications: [
            {
                title: "order_asc",
                value: {
                    choicesOrder: "asc"
                }
            },
            {
                title: "order_desc",
                value: {
                    choicesOrder: "desc"
                }
            },
            {
                title: "order_random",
                value: {
                    choicesOrder: "random"
                }
            },
            {
                title: "show_other",
                value: {
                    hasOther: true,
                    otherText: "Other"
                }
            }
        ]
    },

    "dropdown_restfull": {
        data: {
            questions: [{
                type: "dropdown",
                name: "country",
                title: "Select the country...",
                isRequired: true,
                choicesByUrl: {
                    url: "http://services.groupkt.com/country/get/all",
                    path: "RestResponse;result",
                    valueName: "name"
                }
            }]
        },
        modifications: [
            {
                title: "change_value",
                value: function(survey) {
                    var q = survey.getQuestionByName('country');
                    q.choicesByUrl.valueName = 'alpha2_code';
                    q.choicesByUrl.titleName = 'name';
                    q.choicesByUrl.run();
                }
            }
        ]
    },

    "checkboxes": {
        data: {
            questions: [{
                type: "checkbox",
                name: "car",
                title: "What car are you driving?",
                isRequired: true,
                colCount: 4,
                choices: [
                    "None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot",
                    "Toyota", "Citroen"
                ]
            }]
        },
        modifications: [
            {
                title: "column_count_to_1",
                value: {
                    colCount: 1
                }
            },
            {
                title: "column_count_to_2",
                value: {
                    colCount: 2
                }
            },
            {
                title: "order_asc",
                value: {
                    choicesOrder: "asc"
                }
            },
            {
                title: "order_desc",
                value: {
                    choicesOrder: "desc"
                }
            },
            {
                title: "order_random",
                value: {
                    choicesOrder: "random"
                }
            },
            {
                title: "show_other",
                value: {
                    hasOther: true,
                    otherText: "Other"
                }
            }
        ]
    },

    "matrix": {
        data: {
            questions: [{
                type: "matrix",
                name: "Quality",
                title: "Please indicate if you agree or disagree with the following statements",
                columns: [{value: 1, text: "Strongly Disagree"},
                    {value: 2, text: "Disagree"},
                    {value: 3, text: "Neutral"},
                    {value: 4, text: "Agree"},
                    {value: 5, text: "Strongly Agree"}],
                rows: [{value: "affordable", text: "Product is affordable"},
                    {value: "does what it claims", text: "Product does what it claims"},
                    {value: "better then others", text: "Product is better than other products on the market"},
                    {value: "easy to use", text: "Product is easy to use"}]
            }]
        },
        modifications: [{
            title: "is_all_row_required",
            questionName: "Quality",
            value: {
                isAllRowRequired: true
            }
        }]
    },

    "matrixdropdown": {
        data: {
            questions: [
                {
                    type: "matrixdropdown",
                    name: "frameworksRate",
                    title: "Please tells us your opinion about JavaScript MVVM frameworks",
                    choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
                    columns: [{name: "using", title: "Do you use it?", choices: ["Yes", "No"], cellType: "radiogroup"},
                        {
                            name: "experience",
                            title: "How long do you use it?",
                            choices: [{value: 5, text: "3-5 years"}, {value: 2, text: "1-2 years"}, {
                                value: 1,
                                text: "less then a year"
                            }]
                        },
                        {
                            name: "strength",
                            title: "What is main strength?",
                            choices: ["Easy", "Compact", "Fast", "Powerfull"],
                            cellType: "checkbox"
                        },
                        {name: "knowledge", title: "Please describe your experience", cellType: "text"},
                        {name: "rate", title: "Please rate the framework itself"}],
                    rows: [{value: "angularv1", text: "angularjs v1.x"},
                        {value: "angularv2", text: "angularjs v2"},
                        {value: "knockoutjs"},
                        {value: "reactjs"}]
                }
            ]
        },
        modifications: []
    },

    "matrixdynamic": {
        data: {
            questions: [
                {
                    type: "matrixdynamic",
                    name: "frameworksRate",
                    title: "Please rate your teachers",
                    addRowText: "Add Subject",
                    horizontalScroll: true,
                    columnMinWidth: "120px",
                    columnColCount: 1,
                    cellType: "radiogroup",
                    choices: [{value: 1, text: "Yes"}, {value: 0, text: "Sometimes"}, {value: -1, text: "No"}],
                    columns: [{
                        name: "subject",
                        cellType: "dropdown",
                        title: "Select a subject",
                        isRequired: true,
                        minWidth: "300px",
                        choices: ["English: American Literature", "English: British and World Literature", "Math: Consumer Math", "Math: Practical Math", "Math: Developmental Algebra", "Math: Continuing Algebra", "Math: Pre-Algebra", "Math: Algebra", "Math: Geometry", "Math: Integrated Mathematics", "Science: Physical Science", "Science: Earth Science", "Science: Biology", "Science: Chemistry", "History: World History", "History: Modern World Studies", "History: U.S. History", "History: Modern U.S. History", "Social Sciences: U.S. Government and Politics", "Social Sciences: U.S. and Global Economics", "World Languages: Spanish", "World Languages: French", "World Languages: German", "World Languages: Latin", "World Languages: Chinese", "World Languages: Japanese"]
                    },
                        {name: "explains", title: "Clearly explains the objectives"},
                        {name: "interesting", title: "Makes class interesting"},
                        {name: "effective", title: "Uses class time effectively"},
                        {name: "knowledge", title: "Knows the subject matter"},
                        {name: "recognition", title: "Recognizes and acknowledges effort"},
                        {name: "inform", title: "Keeps me informed of my progress"},
                        {name: "opinion", title: "Encourages and accepts different opinions"},
                        {name: "respect", title: "Has the respect of the student"},
                        {name: "cooperation", title: "Encourages cooperation and participation"},
                        {name: "parents", title: "Communicates with my parents"},
                        {name: "selfthinking", title: "Encourages me to think for myself"},
                        {
                            name: "frusturation",
                            cellType: "comment",
                            title: "Is there anything about this class that frustrates you?",
                            minWidth: "250px"
                        },
                        {
                            name: "likeTheBest",
                            cellType: "comment",
                            title: "What do you like best about this class and/or teacher?",
                            minWidth: "250px"
                        },
                        {
                            name: "improvements",
                            cellType: "comment",
                            title: "What do you wish this teacher would do differently that would improve this class?",
                            minWidth: "250px"
                        }],
                    rowCount: 2
                }
            ]
        },
        modifications: []
    },

    "multipletext": {
        data: {
            questions: [
                {
                    type: "multipletext", name: "pricelimit", title: "What is the... ", colCount: 2,
                    items: [{name: "mostamount", title: "Most amount you would every pay for a product like ours"},
                        {name: "leastamount", title: "The least amount you would feel comfortable paying"}]
                }
            ]
        },
        modifications: []
    },

    "rating": {
        data: {
            questions: [
                {
                    type: "rating", name: "satisfaction", title: "How satisfied are you with the Product?",
                    mininumRateDescription: "Not Satisfied", maximumRateDescription: "Completely satisfied"
                }]
        },
        modifications: []
    },

    "text": {
        data: {
            questions: [
                {
                    type: "text", name: "email",
                    title: "Thank you for taking our survey. Your survey is almost complete, please enter your email " +
                    "address in the box below if you wish to participate in our drawing, then press the 'Submit' button."
                }
            ]
        },
        modifications: [{
            title: "change_size_to_10",
            questionName: "email",
            value: {
                size: 10
            }
        }]
    },

    "comment": {
        data: {
            questions: [{
                type: "comment",
                name: "suggestions",
                title: "What would make you more satisfied with the Product?"
            }]
        },
        modifications: [{
            title: "change_rows_to_2",
            questionName: "suggestions",
            value: {
                rows: 2
            }
        }, {
            title: "change_cols_to_25",
            questionName: "suggestions",
            value: {
                cols: 25
            }
        }]
    },

    "html": {
        data: {
            questions: [
                {
                    type: "html",
                    name: "info",
                    html: "<table><body><row><td><img src='http://surveyjs.org/images/26178-20160417.jpg' width='100px' /></td><td style='padding:20px'>You may put here any html code. For example images, <b>text</b> or <a href='http://surveyjs.org/builder/index.html'  target='_blank'>links</a></td></row></body></table>"
                }
            ]
        },
        modifications: [{
            title: "change_html",
            questionName: "info",
            value: {
                html: "<h1>Wombat</h1>"
            }
        }]
    },

    "file": {
        data: {
            questions: [
                {
                    type: "file",
                    title: "Please upload your photo",
                    name: "image",
                    storeDataAsText: true,
                    showPreview: true,
                    imageWidth: 150,
                    maxSize: 102400
                }
            ]
        },
        modifications: [{
            title: "do_not_show_image_preview",
            questionName: "image",
            value: {
                showPreview: false
            }
        }, {
            title: "do_not_store_file_in_data",
            questionName: "image",
            value: {
                storeDataAsText: false
            }
        }, {
            title: "change_image_preview_height_width",
            questionName: "image",
            value: {
                imageHeight: 50,
                imageWidth: 50
            }
        }, {
            title: "change_file_max_size",
            questionName: "image",
            value: {
                maxSize: 0
            }
        }]
    },

    "cookie": {
        data: {
            cookieName: "myuniquesurveyid",
            questions: [
                {
                    type: "checkbox", name: "car", title: "What car are you driving?", isRequired: true,
                    colCount: 4, choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz",
                    "BMW", "Peugeot", "Toyota", "Citroen"]
                }
            ]
        },
        modifications: [{
            title: "delete_cookie",
            value: function(survey) {
                survey.deleteCookie();
                survey.clear();
                survey.render();
            }
        }]
    },

    "localization": {
        data: {
            title: "Software developer survey.",
            pages: [
                { title: "What operating system do you use?",
                    questions: [
                        {type:"checkbox", name:"opSystem", title: "OS", hasOther: true, isRequired: true,
                            choices:["Windows", "Linux", "Macintosh OSX"]}
                    ]
                },
                {   title: "What language(s) are you currently using?",
                    questions: [
                        {type:"checkbox", name:"langs",title:"Plese select from the list",
                            colCount: 4, isRequired: true,
                            choices:["Javascript", "Java", "Python", "CSS", "PHP", "Ruby", "C++", "C",
                                "Shell", "C#", "Objective-C", "R", "VimL", "Go", "Perl", "CoffeeScript",
                                "TeX", "Swift", "Scala", "Emacs List", "Haskell", "Lua", "Clojure",
                                "Matlab", "Arduino", "Makefile", "Groovy", "Puppet", "Rust", "PowerShell"]
                        }
                    ]},
                { title: "Please enter your name and e-mail",
                    questions: [
                        {type: "text", name: "name", title: "Name:"},
                        {type: "text", name: "email", title: "Your e-mail"}]
                }]
        },
        modifications: [{
            title: "ru",
            value: function(survey) {
                survey.locale = "ru";
                survey.render();
            }
        }, {
            title: "en",
            value: function(survey) {
                survey.locale = "en";
                survey.render();
            }
        }, {
            title: "de",
            value: function(survey) {
                survey.locale = "de";
                survey.render();
            }
        }, {
            title: "fi",
            value: function(survey) {
                survey.locale = "fi";
                survey.render();
            }
        }, {
            title: "fr",
            value: function(survey) {
                survey.locale = "fr";
                survey.render();
            }
        }]
    },

    "questionsInOneLine": {
        data: {
            questionTitleLocation: "bottom", showQuestionNumbers: "off",
            pages: [
                { name: "Address",  title: "Address",
                    questions: [
                        { type: "text", name: "address1", title: "Stree Address" },
                        { type: "text", name: "address2", title: "Address Line 2" },
                        { type: "text", name: "city", title: "City" },
                        { type: "text", name: "state", startWithNewLine: false, title: "State / Province / Region" },
                        { type: "text", name: "zip", title: "Zip / Postal Code" },
                        { type: "dropdown", name: "country", startWithNewLine: false, title: "Country",
                            choicesByUrl: {url: "http://services.groupkt.com/country/get/all", path: "RestResponse;result", valueName: "name"}    }
                    ]
                }
            ]
        },
        modifications: [{
            title: "change_title_location",
            value: function(survey) {
                survey.questionTitleLocation = 'top';
                survey.render();
            }
        }]
    },

    "customCss": {
        data: {questions: [
            { type: "matrix", name: "Quality", title: "Please indicate if you agree or disagree with the following statements",
                columns: [{ value: 1, text: "Strongly Disagree" },
                    { value: 2, text: "Disagree" },
                    { value: 3, text: "Neutral" },
                    { value: 4, text: "Agree" },
                    { value: 5, text: "Strongly Agree" }],
                rows: [{ value: "affordable", text: "Product is affordable" },
                    { value: "does what it claims", text: "Product does what it claims" },
                    { value: "better then others", text: "Product is better than other products on the market" },
                    { value: "easy to use", text: "Product is easy to use" }]}
        ]},
        css: {
            matrix: {root: "table table-striped"},
            navigationButton: "button btn-lg"
        },
        modifications: []
    },

    "options": {
        data: {
            title: "Software developer survey.",
            pages: [
                { title: "What operating system do you use?",
                    questions: [
                        {type:"checkbox", name:"opSystem", title: "OS", hasOther: true, isRequired: true,
                            choices:["Windows", "Linux", "Macintosh OSX"]}
                    ]
                },
                {   title: "What language(s) are you currently using?",
                    questions: [
                        {type:"checkbox", name:"langs",title:"Plese select from the list",
                            colCount: 4, isRequired: true,
                            choices:["Javascript", "Java", "Python", "CSS", "PHP", "Ruby", "C++", "C",
                                "Shell", "C#", "Objective-C", "R", "VimL", "Go", "Perl", "CoffeeScript",
                                "TeX", "Swift", "Scala", "Emacs List", "Haskell", "Lua", "Clojure",
                                "Matlab", "Arduino", "Makefile", "Groovy", "Puppet", "Rust", "PowerShell"]
                        }
                    ]},
                { title: "Please enter your name and e-mail",
                    questions: [
                        {type: "text", name: "name", title: "Name:"},
                        {type: "text", name: "email", title: "Your e-mail"}]
                }]
        },
        modifications: [{
            title: "change_question_required_text",
            value: function(survey) {
                survey.requiredText = "😱";
                survey.render();
            }
        }, {
            title: "set_question_numbers_on_page",
            value: function(survey) {
                survey.showQuestionNumbers = "onPage";
                survey.render();
            }
        }, {
            title: "set_question_numbers_off",
            value: function(survey) {
                survey.showQuestionNumbers = "off";
                survey.render();
            }
        }, {
            title: "hide_survey_title",
            value: function(survey) {
                survey.showTitle = false;
                survey.render();
            }
        }, {
            title: "hide_page_title",
            value: function(survey) {
                survey.showPageTitles = false;
                survey.render();
            }
        }, {
            title: "show_page_numbers",
            value: function(survey) {
                survey.showPageNumbers = true;
                survey.render();
            }
        }, {
            title: "show_top_progress_bar",
            value: function(survey) {
                survey.showProgressBar = "top";
                survey.render();
            }
        }, {
            title: "show_bottom_progress_bar",
            value: function(survey) {
                survey.showProgressBar = "bottom";
                survey.render();
            }
        }, {
            title: "set_completed_html",
            value: function(survey) {
                survey.completedHtml = "<h1>Wombat</h1>";
                survey.render();
            }
        }]
    },

    "workWithData": {
        data: { questions: [
            {type: "text", name: "name", title: "Your name:"},
            {type: "text", name: "email", title: "Your e-mail"},
            { type: "checkbox", name: "car", title: "What car are you driving?", isRequired: true, colCount: 4,
                choices: ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen"] }
        ]},
        modifications: [{
            title: "set_data",
            value: function(survey) {
                survey.data = {name:"John Doe", email: "johndoe@nobody.com", car:["Ford"]};
                survey.render();
            }
        }, {
            title: "add_value_changed_listener",
            value: function(survey) {
                survey.onValueChanged.add(function (sender, options) {
                    document.documentElement.appendChild(document.createTextNode( options.value) );
                });
            }
        }, {
            title: "set_values",
            value: function(survey) {
                survey.setValue('name', 'Wombat');
                survey.setValue('email', 'wo@mbat.com');
                survey.setValue('car', ['BMW', 'Ford']);
            }
        }, {
            title: "get_value",
            value: function(survey) {
                document.documentElement.appendChild(document.createTextNode( survey.getValue('car') ));
            }
        }]
    },

    "customNavigation": {
        data: {
            title: "Software developer survey.",
            pages: [
                { title: "What operating system do you use?",
                    questions: [
                        {type:"checkbox", name:"opSystem", title: "OS", hasOther: true, isRequired: true,
                            choices:["Windows", "Linux", "Macintosh OSX"]}
                    ]
                },
                {   title: "What language(s) are you currently using?",
                    questions: [
                        {type:"checkbox", name:"langs",title:"Plese select from the list",
                            colCount: 4, isRequired: true,
                            choices:["Javascript", "Java", "Python", "CSS", "PHP", "Ruby", "C++", "C",
                                "Shell", "C#", "Objective-C", "R", "VimL", "Go", "Perl", "CoffeeScript",
                                "TeX", "Swift", "Scala", "Emacs List", "Haskell", "Lua", "Clojure",
                                "Matlab", "Arduino", "Makefile", "Groovy", "Puppet", "Rust", "PowerShell"]
                        }
                    ]},
                { title: "Please enter your name and e-mail",
                    questions: [
                        {type: "text", name: "name", title: "Name:"},
                        {type: "text", name: "email", title: "Your e-mail"}]
                }]
        },
        modifications:[{
            title: "set_custom_navigation",
            value: function(survey) {
                document.querySelector('#testName').insertAdjacentHTML(
                    'afterend',
                    [
                        '<div><span id="surveyProgress">Page 1 of 3.</span>',
                        '<a id="surveyPrev" href="#" style="display: none;">Prev</a>',
                        '<a id="surveyNext" href="#" style="display: inline;">Next</a>',
                        '<a id="surveyComplete" href="#" style="display: none;">Complete</a>',
                        '</div>'
                    ].join().replace(new RegExp(",", 'g'), "")
                );

                document.getElementById('surveyPrev').onclick = function() { survey.prevPage(); };
                document.getElementById('surveyNext').onclick = function() { survey.nextPage(); };
                document.getElementById('surveyComplete').onclick = function() { survey.completeLastPage(); };

                survey.showTitle = false;

                survey.onCurrentPageChanged.add(function (sender) {
                    setNavigationVisibility(sender);
                });

                function setNavigationVisibility(survey) {
                    document.getElementById('surveyPrev').style.display = !survey.isFirstPage ? "inline" : "none";
                    document.getElementById('surveyNext').style.display = !survey.isLastPage ? "inline" : "none";
                    document.getElementById('surveyComplete').style.display = survey.isLastPage ? "inline" : "none";
                    document.getElementById('surveyProgress').innerText = "Page " + (survey.currentPage.visibleIndex + 1) + " of " + survey.visiblePageCount + ".";
                }
            }
        }, {
            title: "change_prev_next_complete_text",
            value: function(survey) {
                survey.pagePrevText = 'back';
                survey.pageNextText = 'forward';
                survey.completeText = 'done';
                survey.render();
            }
        }, {
            title: "hide_standard_nav",
            value: function(survey) {
                survey.showNavigationButtons = false;
                survey.render();
            }
        }]
    },

    "preprocessTitlesAndHtml": {
        data: {
            questionTitleTemplate: "{no}) {title} {require}:",
            questionStartIndex: "A",
            requiredText: "(*)",
            pages: [
                {
                    title: "This is the page {pageno} of {pagecount}.",
                    questions: [
                        {type: "text", name: "name", title: "Please type your name", isRequired: true},
                        {type: "text", name: "email", title: "Please type your e-mail", isRequired: true, validators: [{type:"email"}]}]
                },
                {
                    title: "This is the page {pageno} of {pagecount}.",
                    questions: [
                        {type: "comment", name: "comment", title: "{name}, please tell us what is on your mind"}]
                }
            ],
            completedHtml: "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This is what is on your mind:</p><p>{comment}</p>"
        },
        modifications:[]
    },

    "changeRendering": {
        data: { title: "Tell us, what technologies do you use?", pages: [
            { name:"page1", questions: [
                { type: "radiogroup", choices: [ "Yes", "No" ], isRequired: true, name: "frameworkUsing",title: "Do you use any front-end framework like Bootstrap?" },
                { type: "checkbox", choices: ["Bootstrap","Foundation"], hasOther: true, isRequired: true, name: "framework", title: "What front-end framework do you use?", visible: false }
            ]},
            { name: "page2", questions: [
                { type: "radiogroup", choices: ["Yes","No"],isRequired: true, name: "mvvmUsing", title: "Do you use any MVVM framework?" },
                { type: "checkbox", choices: [ "AngularJS", "KnockoutJS", "React" ], hasOther: true, isRequired: true, name: "mvvm", title: "What MVVM framework do you use?", visible: false } ] },
            { name: "page3",questions: [
                { type: "comment", name: "about", title: "Please tell us about your main requirements for Survey library" } ] }
        ],
            triggers: [
                { type: "visible", operator: "equal", value: "Yes", name: "frameworkUsing", questions: ["framework"]},
                { type: "visible", operator: "equal", value: "Yes", name: "mvvmUsing", questions: ["mvvm"]}
            ]
        },
        modifications: [],
        react_modifications: [{
            title: "custom_rendering",
            value: function(survey) {
                var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

                function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

                function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

                var MySurveyQuestionRadiogroup = function (_Survey$SurveyQuestio) {
                    _inherits(MySurveyQuestionRadiogroup, _Survey$SurveyQuestio);

                    function MySurveyQuestionRadiogroup() {
                        _classCallCheck(this, MySurveyQuestionRadiogroup);

                        return _possibleConstructorReturn(this, (MySurveyQuestionRadiogroup.__proto__ || Object.getPrototypeOf(MySurveyQuestionRadiogroup)).apply(this, arguments));
                    }

                    _createClass(MySurveyQuestionRadiogroup, [{
                        key: "render",
                        value: function render() {
                            if (!this.question) return null;
                            return React.createElement("form", { className: "btn-group", ref: "toggleInput" }, this.getItems());
                        }
                    }, {
                        key: "renderRadio",
                        value: function renderRadio(key, item, isChecked, divStyle, otherItem) {
                            var className = "btn btn-default";
                            if (isChecked) className += " active";
                            if (!divStyle) divStyle = {display: "none"};
                            return React.createElement("label", { key: key, style: divStyle, className: className }, React.createElement("input", { type: "radio", checked: isChecked, value: item.value, onChange: this.handleOnChange, style: {display: "none"} }), React.createElement("span", {}, item.text), otherItem);
                        }
                    }]);

                    return MySurveyQuestionRadiogroup;
                }(Survey.SurveyQuestionRadiogroup);

                var MySurveyQuestionCheckboxItem = function (_Survey$SurveyQuestio2) {
                    _inherits(MySurveyQuestionCheckboxItem, _Survey$SurveyQuestio2);

                    function MySurveyQuestionCheckboxItem() {
                        _classCallCheck(this, MySurveyQuestionCheckboxItem);

                        return _possibleConstructorReturn(this, (MySurveyQuestionCheckboxItem.__proto__ || Object.getPrototypeOf(MySurveyQuestionCheckboxItem)).apply(this, arguments));
                    }

                    _createClass(MySurveyQuestionCheckboxItem, [{
                        key: "renderCheckbox",
                        value: function renderCheckbox(isChecked, divStyle, otherItem) {
                            var className = "btn btn-default";
                            if (isChecked) className += " active";
                            return React.createElement("label", { className: className, style: divStyle }, React.createElement("input", { type: "checkbox", checked: isChecked, onChange: this.handleOnChange, style: {display: "none"} }), React.createElement("span", {}, this.item.text), otherItem);
                        }
                    }]);

                    return MySurveyQuestionCheckboxItem;
                }(Survey.SurveyQuestionCheckboxItem);

                var MySurveyQuestionCheckbox = function (_Survey$SurveyQuestio3) {
                    _inherits(MySurveyQuestionCheckbox, _Survey$SurveyQuestio3);

                    function MySurveyQuestionCheckbox() {
                        _classCallCheck(this, MySurveyQuestionCheckbox);

                        return _possibleConstructorReturn(this, (MySurveyQuestionCheckbox.__proto__ || Object.getPrototypeOf(MySurveyQuestionCheckbox)).apply(this, arguments));
                    }

                    _createClass(MySurveyQuestionCheckbox, [{
                        key: "render",
                        value: function render() {
                            if (!this.question) return null;
                            return React.createElement("div", { className: "btn-group", ref: "toggleInput" }, this.getItems());
                        }
                    }, {
                        key: "renderItem",
                        value: function renderItem(key, item) {
                            return React.createElement(MySurveyQuestionCheckboxItem, { key: key, question: this.question, item: item, css: this.css, rootCss: this.rootCss });
                        }
                    }]);

                    return MySurveyQuestionCheckbox;
                }(Survey.SurveyQuestionCheckbox);

                Survey.ReactQuestionFactory.Instance.registerQuestion("checkbox", function (props) {
                    return React.createElement(MySurveyQuestionCheckbox, props);
                });

                Survey.ReactQuestionFactory.Instance.registerQuestion("radiogroup", function (props) {
                    return React.createElement(MySurveyQuestionRadiogroup, props);
                });
                
                survey.render();
            }
        }],
        knockout_modifications: [{
            title: "custom_rendering",
            value: function(survey) {
                var survey = new Survey.Survey({ title: "Tell us, what technologies do you use?", pages: [
                    { name:"page1", questions: [
                        { type: "radiogroup", choices: [ "Yes", "No" ], isRequired: true, name: "frameworkUsing",title: "Do you use any front-end framework like Bootstrap?" },
                        { type: "checkbox", choices: ["Bootstrap","Foundation"], hasOther: true, isRequired: true, name: "framework", title: "What front-end framework do you use?", visible: false }
                    ]},
                    { name: "page2", questions: [
                        { type: "radiogroup", choices: ["Yes","No"],isRequired: true, name: "mvvmUsing", title: "Do you use any MVVM framework?" },
                        { type: "checkbox", choices: [ "AngularJS", "KnockoutJS", "React" ], hasOther: true, isRequired: true, name: "mvvm", title: "What MVVM framework do you use?", visible: false } ] },
                    { name: "page3",questions: [
                        { type: "comment", name: "about", title: "Please tell us about your main requirements for Survey library" } ] }
                ],
                    triggers: [
                        { type: "visible", operator: "equal", value: "Yes", name: "frameworkUsing", questions: ["framework"]},
                        { type: "visible", operator: "equal", value: "Yes", name: "mvvmUsing", questions: ["mvvm"]}
                    ]
                }, "root");

                new Survey.SurveyTemplateText().replaceText('<div class="btn-group"><!-- ko foreach: { data: question.visibleChoices, as: "item", afterRender: question.koAfterRender}  --> <label class="btn btn-default" data-bind="css:{active: $data.value == question.koValue()}, style:{width: question.koWidth}">   <input type="radio" style="display:none;" data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" /> <span data-bind="text: item.text"></span></label><!-- /ko --><div data-bind="visible:question.hasOther"><div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div></div></div>', "question", "radiogroup");
                new Survey.SurveyTemplateText().replaceText('<div class="btn-group"><!-- ko foreach: { data: question.visibleChoices, as: "item", afterRender: question.koAfterRender}  --> <label class="btn btn-default" data-bind="css:{active: question.koValue().indexOf($data.value) > -1}, style:{width: question.koWidth}">   <input style="display:none;" type="checkbox" data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" /> <span data-bind="text: item.text"></span></label><!-- /ko --><div data-bind="visible:question.hasOther"><div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div></div></div>', "question", "checkbox");

                survey.onComplete.add(function() {
                    window.SurveyResult = survey.data;
                });

                survey.render();
            }
        }]
    },

    "autoNextPage": {
        data: {
            title: "American History", showProgressBar: "bottom", goNextPageAutomatic: true, showNavigationButtons: false,
            pages: [
                { questions: [
                    { type: "radiogroup",  name: "civilwar", title: "When was the Civil War?", choices: ["1750-1800", "1800-1850", "1850-1900", "1900-1950","after 1950"]}
                ]},
                { questions: [
                    { type: "radiogroup",  name: "libertyordeath", title: "Who said 'Give me liberty or give me death?'", choices: ["John Hancock", "James Madison", "Patrick Henry", "Samuel Adams"]}
                ]},
                {questions: [
                    { type: "radiogroup",  name: "magnacarta", title: "What is the Magna Carta?", choices: ["The foundation of the British parliamentary system", "The Great Seal of the monarchs of England", "The French Declaration of the Rights of Man", "The charter signed by the Pilgrims on the Mayflower"]}
                ]}
            ],
            completedHtml: "<p>Your anwers are:</p><p>When was the Civil War?: <b>{civilwar}</b>. The correct is: <b>1850-1900</b></p><p>Who said 'Give me liberty or give me death?': <b>{libertyordeath}</b>. The correct is: <b>Patrick Henry</b></p><p>What is the Magna Carta?: <b>{magnacarta}</b>. The correct is: <b>The foundation of the British parliamentary system</b></p>"
        },
        modifications:[]
    },

    "standardValidators": {
        data: {
            questions: [
                { type: "text", name: "email", title: "Please enter your e-mail", isRequired: true, validators: [{type:"email"}]},
                { type: "multipletext", name: "pricelimit", title: "What is the... ", isRequired: true, colCount: 2,
                    items: [{ name: "leastamount", title: "The least amount you have ever paid for a computer",
                        validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }]
                    },
                        {  name: "mostamount", title: "The most amount you have ever paid for a computer",
                            validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }]
                        }]
                },
                { type: "comment", name: "firstcomputer", title: "Please tell us about your first computer", isRequired: true,
                    validators: [{type:"text", minLength:20}]}
        ]},
        modifications: []
    },

    "customValidators": {
        data: {
            questions: [ {
                type: "comment", name: "memo", isRequired: true,
                title: "Type here 'survey' to pass the validation ",
                validators: [{type: "mytextvalidator"}]
           }]
        },
        beforeRender: function() {
            var MyTextValidator = (function (_super) {
                Survey.__extends(MyTextValidator, _super);
                function MyTextValidator() {
                    _super.call(this);
                }
                MyTextValidator.prototype.getType = function () { return "mytextvalidator"; };
                MyTextValidator.prototype.validate = function (value, name) {
                    if(value.indexOf("survey") < 0) {
                        //report an error
                        return new Survey.ValidatorResult(null, new Survey.CustomError(this.getErrorText(name)));
                    }
                    //return Survey.ValidatorResult object if you want to correct the entered value
                    // return new Survey.ValidatorResult(youCorrectedValue);
                    //return nothing if there is no any error.
                    return null;
                };
                //the default error text. It shows if user do not set the 'text' property
                MyTextValidator.prototype.getDefaultErrorText = function(name) {
                    return "You text should contains 'survey' word.";
                };
                return MyTextValidator;
            })(Survey.SurveyValidator);
            Survey.MyTextValidator = MyTextValidator;
            //add into survey Json metaData
            Survey.JsonObject.metaData.addClass("mytextvalidator", [], function () { return new MyTextValidator(); }, "surveyvalidator");
        },
        modifications: []
    },

    "validateOnEvent": {
        data: {
            questions: [
                { type: "multipletext", name: "pricelimit", title: "What is the... ", isRequired: true, colCount: 2,
                    items: [{ name: "leastamount", title: "The least amount you have ever paid for a computer"
                    },
                    {  name: "mostamount", title: "The most amount you have ever paid for a computer"
                    }]
                },
                {
                    type: "comment", name: "firstcomputer", title: "Please tell us about your first computer", isRequired: true,
                    validators: [{type:"text", minLength:20}]
                },

            ]
        },
        modifications: [{
            title: "add_validate_event_listener",
            value: function(survey) {
                function isNumber(n) { return n && !isNaN(parseFloat(n)) && isFinite(n); }
                survey.onValidateQuestion.add(function (s, options) {
                    if (options.name == 'pricelimit') {
                        var leastamount = options.value['leastamount'];
                        var mostamount = options.value['mostamount'];
                        if(!isNumber(leastamount)) {
                            options.error = "The 'least amount' should be a numeric.";
                        } else {
                            if(!isNumber(mostamount)) {
                                options.error = "The 'most amount' should be a numeric.";
                            } else {
                                if(leastamount > mostamount) {
                                    options.error = "The 'most amount' should be more 'less amount'.";
                                }
                            }
                        }
                    }
                    if (options.name == 'firstcomputer') {
                        if(options.value.indexOf('computer') < 0) {
                            options.error = "Please type the word 'computer'.";
                        }
                    }
                });
            }
        }]
    },

    "visibleIf": {
        data: { showQuestionNumbers: "off",
            questions: [
                { type: "radiogroup", name: "haveKids", title: "Do you have a kid(s)?", isRequired: true, choices:["Yes", "No"], colCount: 0},
                { type: "dropdown", name: "kids", title: "How many kids do you have", visibleIf: "{haveKids}='Yes'",
                    isRequired: true, choices:[1, 2, 3, 4, 5] },
                { type: "dropdown", name: "kid1Age", title: "The first kid age:", visibleIf: "{haveKids}='Yes' and {kids} >= 1",
                    isRequired: true, startWithNewLine: false, choices:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},
                { type: "dropdown", name: "kid2Age", title: "The second kid age:", visibleIf: "{haveKids}='Yes' and {kids} >= 2",
                    isRequired: true, startWithNewLine: false, choices:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},
                { type: "dropdown", name: "kid3Age", title: "The third kid age:", visibleIf: "{haveKids}='Yes' and {kids} >= 3",
                    isRequired: true, startWithNewLine: false, choices:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},
                { type: "dropdown", name: "kid4Age", title: "The fourth kid age:", visibleIf: "{haveKids}='Yes' and {kids} >= 4",
                    isRequired: true, startWithNewLine: false, choices:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]},
                { type: "dropdown", name: "kid5Age", title: "The fifth kid age:", visibleIf: "{haveKids}='Yes' and {kids} >= 5",
                    isRequired: true, startWithNewLine: false, choices:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
        ]},
        modifications: []
    },

    "visibleTrigger": {
        data: {
            triggers: [{ type: "visible", name: "type", operator: "equal", value: "Hot hatch", questions: ["Hot hatch"] },
                { type: "visible", name: "type", value: "sedan", questions: ["Sedan"] },
                { type: "visible", name: "type", value: "sports", questions: ["Sports"] },
                { type: "visible", name: "type", value: "Grand tourer", questions: ["Grand tourer"] },
                { type: "visible", name: "type", value: "SuperCar", questions: ["Supercar"] },
                { type: "visible", name: "type", value: "Muscle car", questions: ["Muscle car"] },
                { type: "visible", name: "type", value: "Pony car", questions: ["Pony car"] },
                { type: "visible", name: "type", value: "Convertible", questions: ["Convertible"] },
                { type: "visible", name: "type", value: "other", questions: ["otherType"] }
            ],
            questions: [
                { type: "radiogroup",  name: "type", isRequired: true, colCount: 4, hasOther: true,
                    title: "Please select the sport cars type.",
                    choices: ["Hot hatch", "sedan|Sports saloon / sports sedan", "sports|Sports Car", "Grand tourer", "SuperCar", "Muscle car", "Pony car", "Convertible"]},
                { type: "radiogroup",  name: "Hot hatch", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["Honda Civic Type R", "Renault Megane RS", "Fiat 500 Abarth"]},
                { type: "radiogroup",  name: "Sedan", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["BMW M5", "Mazdaspeed6/Mazda 6 MPS", "Dodge Charger", "Dodge SRT-4", "Lotus Cortina", "Mitsubishi EVO"]},
                { type: "radiogroup",  name: "Sports", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["Chevrolet Corvette", "Mazda MX-5", "Porsche 911"]},
                { type: "radiogroup",  name: "Grand tourer", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["Aston Martin V8", "Lexus SC300/400", "Ferrari 612 Scaglietti"]},
                { type: "radiogroup",  name: "Supercar", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["McLaren P1", "Lamborghini Miura", "Bugatti Veyron 16.4"]},
                { type: "radiogroup",  name: "Muscle car", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["Ford Torino", "Plymouth Road Runner", "Pontiac GTO", "Ford Falcon", "Holden Monaro", "Valiant Charger"]},
                { type: "radiogroup",  name: "Pony car", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["AMC Javelin", "Chevrolet Camaro", "Dodge Challenger"]},
                { type: "radiogroup",  name: "Convertible", isRequired: true, colCount: 4, visible: false, title: "Please select the car", hasOther: true, choices: ["Honda S2000", "Volkswagen Eos", "Volvo C70"]},
                { type:"comment", name: "otherType", title: "Please describe the car.", isRequired: true, visible: false}
            ]
        },
        modifications: []
    },

    "completeTrigger": {
        data: {
        triggers: [{ type: "complete", name: "exit1", operator: "equal", value: "Yes" },
            { type: "complete", name: "exit2", operator: "equal", value: "Yes" }],
        pages: [
            { title: "What operating system do you use?",
                questions: [
                    {type:"checkbox", name:"opSystem", title: "OS", hasOther: true,
                        choices:["Windows", "Linux", "Macintosh OSX"]},
                    {type:"radiogroup", name:"exit1", title:"Do you want to finish the survey?", choices: ["Yes", "No"], colCount: 0}
                ]
            },
            {   title: "What language(s) are you currently using?",
                questions: [
                    {type:"checkbox", name:"langs",title:"Plese select from the list",
                        colCount: 4,
                        choices:["Javascript", "Java", "Python", "CSS", "PHP", "Ruby", "C++", "C",
                            "Shell", "C#", "Objective-C", "R", "VimL", "Go", "Perl", "CoffeeScript",
                            "TeX", "Swift", "Scala", "Emacs List", "Haskell", "Lua", "Clojure",
                            "Matlab", "Arduino", "Makefile", "Groovy", "Puppet", "Rust", "PowerShell"]
                    },
                    {type:"radiogroup", name:"exit2", title:"Do you want to finish the survey?", choices: ["Yes", "No"], colCount: 0}
                ]},
            { title: "Please enter your name and e-mail",
                questions: [
                    {type: "text", name: "name", title: "Name:"},
                    {type: "text", name: "email", title: "Your e-mail"}]
            }]},
        modifications: []
    },

    "setValueTrigger": {
        data: {
            triggers: [
                { type: "setvalue", name: "copy", operator: "equal", value: "Yes", setToName: "name", setValue: "Jon Snow" },
                { type: "setvalue", name: "copy", operator: "equal", value: "Yes", setToName: "email", setValue: "jon.snow@nightwatch.com" },
                { type: "setvalue", name: "copy", operator: "equal", value: "Yes", setToName: "tempvar", isVariable: true, setValue: "You have decided to use your current information." },
                { type: "setvalue", name: "copy", operator: "equal", value: "No", setToName: "name", setValue: "" },
                { type: "setvalue", name: "copy", operator: "equal", value: "No", setToName: "email", setValue: "" },
                { type: "setvalue", name: "copy", operator: "equal", value: "No", setToName: "tempvar", isVariable: true, setValue: "You have decided not to use your current information." }
            ],
            pages: [
                { title: "Customer information",
                    questions: [
                        {type:"radiogroup", name:"copy", title: "Use your current data", choices:["Yes", "No"], isRequired: true, colCount: 0},
                        {type: "text", name: "name", title: "Name:", isRequired: true},
                        {type: "text", name: "email", title: "Your e-mail", isRequired: true, validators: [{type:"email"}]}]
                }],
            completedHtml: "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This information is not in the survey data result:<b> {tempvar}</b></p>"
        },
        modifications: []
    },

    "loadSurvey": {
        data: {
            surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
        },
        modifications: []
    },

    "saveSurveyResult": {
        data: {
            surveyId: '0edf84f9-14f7-4944-a857-e327e1dceebb',
            surveyPostId: '8c03f02b-0b55-4cda-96b8-d1bf7c87b05d'
        },
        modifications: []
    },

    "getSurveyResult": {
        data: {
            surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1',
            surveyPostId: '3ce10f8b-2d8a-4ca2-a110-2994b9e697a1'
        },
        modifications: [{
            title: "add_onGetResult_listener",
            value: function(survey) {
                document.querySelector('#testName').insertAdjacentHTML(
                    'afterend',
                    '<div id="chartContainer"></div>'
                );

                survey.onSendResult.add(function(s, options) {
                    if(options.success) {
                        s.getResult('a15eee7a-9418-4eb4-9671-2009c8ff6b24', 'langs');
                    }
                });
                survey.onGetResult.add(function(s, options) {
                    if(options.success) {
                        showChart(options.dataList);
                    }
                });
                function showChart(chartDataSource) {
                    document.getElementById("chartContainer").style.height = "500px";
                    $("#chartContainer").dxPieChart({
                        dataSource: chartDataSource,
                        series: {
                            argumentField: 'name',
                            valueField: 'value'
                        }
                    });
                }
            }
        }]
    },

    "runSurveyOneTime": {
        data: {},
        beforeRender: function() {
            document.querySelector('#testName').insertAdjacentHTML(
                'afterend',
                [
                    '<div id="clientIdContainer">',
                    '<p>',
                    'Your client Id: <input type="text" id="clientId" value="" onchange="document.getElementById(\'btnStartSurvey\').disabled = value == \'\'" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();">',
                    '</p><pre class=" language-javascript"><code class=" language-javascript">survey<span class="token punctuation">.</span>clientId <span class="token operator">=</span> yourValue<span class="token punctuation">;</span></code></pre>',
                    '<p></p>',
                    '<p>',
                    'Send the survey results before moving on the next Page: <input type="checkbox" id="sendResultOnPageNext"> default is false.',
                    '</p><p>',
                    'If you have a long survey, many your users may not finish the survey and enter the data on few pagers on only the first one. If you still want to save the information from incompleted surveys, set this property to true. The clientId property should bet set correctly, otherwise the data of others users may be ovewritten.',
                    '</p>',
                    '<pre class=" language-javascript"><code class=" language-javascript">survey<span class="token punctuation">.</span>sendResultOnPageNext <span class="token operator">=</span> yourvalue<span class="token punctuation">;</span></code></pre>',
                    '<p></p>',
                    '<input id="btnStartSurvey" type="button" disabled="true" value="Start Survey" onclick="runSurveyCheck()">',
                    '</div>'
                ].join().replace(new RegExp(",", 'g'), "")
            );

            document.querySelector('#clientIdContainer').insertAdjacentHTML(
                'afterend',
                '<textarea id="sentResults" rows="10" readonly="true" style="width:95%"></textarea>' +
                '<div id="surveyMsg"></div>'
            );

            function onIsSurveyCompleted(success, result, response) {
                if(!success) return;
                if(result == 'completed') {
                    document.getElementById('surveyMsg').innerHTML = 'You have already run the survey!';
                } else {
                    runSurvey();
                }
            }

            function runSurveyCheck() {
                var clientId = document.getElementById('clientId').value;
                new Survey.dxSurveyService().isCompleted('47e699f7-d523-4476-8fcd-be601c91d119', clientId, onIsSurveyCompleted);
            }

            window.runSurveyCheck = runSurveyCheck;
        },
        knockout_beforeRender: function() {
            function runSurvey() {
                var survey = new Survey.Survey({
                    surveyId: 'e7866476-e901-4ab7-9f38-574416387f73',
                    surveyPostId: 'df2a04fb-ce9b-44a6-a6a7-6183ac555a68'
                }, "root");
                survey.clientId = document.getElementById('clientId').value;
                survey.sendResultOnPageNext = document.getElementById('sendResultOnPageNext').checked;
                survey.onComplete.add(function (s) {
                    document.getElementById('root').innerHTML = "";
                    document.getElementById("clientIdContainer").style.display = "inline";
                });
                survey.onSendResult.add(function (survey) {
                    var text = "clientId:" + survey.clientId + ". The results are:" + JSON.stringify(survey.data)  + String.fromCharCode(13, 10);
                    var memo = document.getElementById('sentResults');
                    memo.value = memo.value + text;
                });
                document.getElementById("clientIdContainer").style.display = "none";
            }

            window.runSurvey = runSurvey;
        },
        react_beforeRender: function() {
            function runSurvey() {
                document.getElementById("clientIdContainer").style.display = "none";
                survey.sendResultOnPageNext = document.getElementById('sendResultOnPageNext').checked;
                var clientId = document.getElementById('clientId').value;
                var surveyComplete = function (s) {
                    document.getElementById("clientIdContainer").style.display = "inline";
                };
                var surveySendResult = function (survey) {
                    var text = "clientId:" + survey.clientId + ". The results are:" + JSON.stringify(survey.data)  + String.fromCharCode(13, 10);
                    var memo = document.getElementById('sentResults');
                    memo.value = memo.value + text;
                };
                ReactDOM.render(<Survey.Survey model={survey} clientId={clientId} onComplete={surveyComplete} onSendResult={surveySendResult} />, document.getElementById("root"));
            }
            var survey = new Survey.ReactSurveyModel({
                surveyId: 'e7866476-e901-4ab7-9f38-574416387f73',
                surveyPostId: 'df2a04fb-ce9b-44a6-a6a7-6183ac555a68'
            }, "root");

            window.runSurvey = runSurvey;
        },
        modifications: []
    }
};