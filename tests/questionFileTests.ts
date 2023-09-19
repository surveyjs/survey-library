import { SurveyModel } from "../src/survey";
import { QuestionFileModel } from "../src/question_file";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { surveyLocalization } from "../src/surveyStrings";
import { settings } from "../src/settings";
import { StylesManager } from "../src/stylesmanager";
import { Serializer } from "../src/jsonobject";
import { Camera } from "../src/utils/camera";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";
export default QUnit.module("Survey_QuestionFile");

QUnit.test("QuestionFile value initialization strings", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 1",
        name: "image1",
        storeDataAsText: false,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 2",
        name: "image2",
        storeDataAsText: true,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");
  survey.onDownloadFile.add((survey, options) => {
    options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
  });

  survey.data = {
    image1: "someId",
    image2: "data:image/jpeg;base64,FILECONTENT",
  };
  assert.deepEqual(q1.value, survey.data.image1);
  assert.deepEqual(q2.value, survey.data.image2);
  assert.equal(q1.previewValue.length, 1, "remote stored file");
  assert.equal(q2.previewValue.length, 1, "file stored as text");
  assert.equal(
    q1.previewValue[0].content,
    "data:image/jpeg;base64,FILECONTENT1",
    "remote stored file content"
  );
  assert.equal(
    q2.previewValue[0].content,
    survey.data.image2,
    "locally stored file content"
  );
});

QUnit.test("QuestionFile value initialization array", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 1",
        name: "image1",
        storeDataAsText: false,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 2",
        name: "image2",
        storeDataAsText: true,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");
  survey.onDownloadFile.add((survey, options) => {
    options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
  });

  survey.data = {
    image1: ["someId"],
    image2: ["data:image/jpeg;base64,FILECONTENT"],
  };
  assert.deepEqual(q1.value, survey.data.image1);
  assert.deepEqual(q2.value, survey.data.image2);
  assert.equal(q1.previewValue.length, 1, "remote stored file");
  assert.equal(q2.previewValue.length, 1, "file stored as text");
  assert.equal(
    q1.previewValue[0].content,
    "data:image/jpeg;base64,FILECONTENT1",
    "remote stored file content"
  );
  assert.equal(
    q2.previewValue[0].content,
    survey.data.image2,
    "locally stored file content"
  );
});
QUnit.test("QuestionFile serialization", function(assert) {
  const fileQuestion = new QuestionFileModel("q1");
  assert.deepEqual(fileQuestion.toJSON(), { name: "q1" }, "We have only name in serialziation by default");
});

QUnit.test("QuestionFile change defaultValue for allowMultiple", function(assert) {
  const fileQuestion1 = new QuestionFileModel("q1");
  assert.equal(fileQuestion1.allowMultiple, false, "default is false");

  const prop1 = Serializer.getProperty("file", "allowMultiple");
  prop1.defaultValue = true;

  const fileQuestion2 = new QuestionFileModel("q2");
  assert.equal(fileQuestion2.allowMultiple, true, "default is true");

  const prop2 = Serializer.getProperty("file", "allowMultiple");
  prop2.defaultValue = false;
});

QUnit.test("QuestionFile value initialization array of objects", function(
  assert
) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 1",
        name: "image1",
        storeDataAsText: false,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 2",
        name: "image2",
        storeDataAsText: true,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");
  survey.onDownloadFile.add((survey, options) => {
    if (options.name == "image1" && options.question.name === "image1") {
      assert.equal(q1.inputTitle, " ");
    }
    if (options.name == "image2" && options.question.name === "image2") {
      assert.equal(q2.inputTitle, " ");
    }
    options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
  });

  assert.equal(q1.inputTitle, "Choose file(s)...");
  assert.equal(q2.inputTitle, "Choose file(s)...");
  survey.data = {
    image1: [{ content: "someId" }],
    image2: [{ content: "data:image/jpeg;base64,FILECONTENT" }],
  };
  assert.equal(q1.inputTitle, " ");
  assert.equal(q2.inputTitle, " ");
  assert.deepEqual(q1.value, survey.data.image1);
  assert.deepEqual(q2.value, survey.data.image2);
  assert.equal(q1.previewValue.length, 1, "remote stored file");
  assert.equal(q2.previewValue.length, 1, "file stored as text");
  assert.equal(
    q1.previewValue[0].content,
    "data:image/jpeg;base64,FILECONTENT1",
    "remote stored file content"
  );
  assert.equal(
    q2.previewValue[0].content,
    survey.data.image2[0].content,
    "locally stored file content"
  );
});

QUnit.test(
  "QuestionFile value initialization array of objects without onDownloadFile handler",
  function(assert) {
    var json = {
      questions: [
        {
          type: "file",
          allowMultiple: true,
          title: "Please upload your photo 1",
          name: "image1",
          storeDataAsText: false,
          showPreview: true,
          imageWidth: 150,
          maxSize: 102400,
        },
        {
          type: "file",
          allowMultiple: true,
          title: "Please upload your photo 2",
          name: "image2",
          storeDataAsText: true,
          showPreview: true,
          imageWidth: 150,
          maxSize: 102400,
        },
      ],
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");

    survey.data = {
      image1: [{ content: "someId" }],
      image2: [{ content: "data:image/jpeg;base64,FILECONTENT" }],
    };
    assert.deepEqual(q1.value, survey.data.image1);
    assert.deepEqual(q2.value, survey.data.image2);
    assert.equal(q1.previewValue.length, 1, "remote stored file");
    assert.equal(q2.previewValue.length, 1, "file stored as text");
    assert.equal(
      q1.previewValue[0].content,
      survey.data.image1[0].content,
      "remote stored file content"
    );
    assert.equal(
      q2.previewValue[0].content,
      survey.data.image2[0].content,
      "locally stored file content"
    );
  }
);

QUnit.test("QuestionFile upload files", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 1",
        name: "image1",
        storeDataAsText: false,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var done = assert.async();

  survey.onUploadFiles.add((survey, options) => {
    setTimeout(
      () =>
        options.callback(
          "success",
          options.files.map((file) => {
            return { file: file, content: file.name + "_url" };
          })
        ),
      2
    );
  });

  var files: any = [
    { name: "f1", type: "t1" },
    { name: "f2", type: "t2", size: 100000 },
  ];
  q1.loadFiles(files);

  survey.onValueChanged.add((survey, options) => {
    assert.equal(q1.value.length, 2, "2 files");
    assert.equal(
      q1.value[0].content,
      q1.value[0].name + "_url",
      "first content"
    );
    assert.equal(
      q1.value[1].content,
      q1.value[1].name + "_url",
      "second content"
    );
    assert.equal(
      q1.previewValue[0].content,
      q1.value[0].content,
      "preview content 1"
    );
    assert.equal(
      q1.previewValue[1].content,
      q1.value[1].content,
      "preview content 2"
    );

    assert.equal(q1.previewValue[0].name, q1.value[0].name, "preview name 1");
    assert.equal(q1.previewValue[1].name, q1.value[1].name, "preview name 2");
    done();
  });
});

QUnit.test("QuestionFile remove file", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        name: "image1",
        showPreview: true,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  survey.data = {
    image1: [
      { name: "f1", content: "data" },
      { name: "f2", content: "data" },
    ],
  };

  q1.removeFile("f1");
  assert.deepEqual(survey.data, {
    image1: [{ name: "f2", content: "data" }],
  });

  q1.removeFile("f2");
  assert.deepEqual(survey.data, {});
});

QUnit.test("QuestionFile remove files with the same name", function(assert) {
  const json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        name: "image1",
        showPreview: true,
      },
    ],
  };

  const survey = new SurveyModel(json);
  const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  const fileData1 = { name: "f1", content: "data1" };
  const fileData2 = { name: "f1", content: "data2" };
  survey.data = { image1: [fileData1, fileData2] };

  q1.doRemoveFile(fileData2);
  assert.deepEqual(survey.data, { image1: [{ name: "f1", content: "data1" }] });

  q1.doRemoveFile(fileData1);
  assert.deepEqual(survey.data, {});
});

QUnit.test(
  "QuestionFile upload files that exceed max size - https://surveyjs.answerdesk.io/ticket/details/T994",
  function(assert) {
    var json = {
      questions: [
        {
          type: "file",
          allowMultiple: true,
          name: "image1",
          storeDataAsText: false,
          maxSize: 10,
        },
      ],
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    var loadedFilesCount = 0;
    survey.onUploadFiles.add((survey, options) => {
      options.callback(
        "success",
        options.files.map((file) => {
          return { file: file, content: file.name + "_url" };
        })
      );
      loadedFilesCount++;
    });

    var files: any = [
      { name: "f1", type: "t1", size: 9 },
      { name: "f2", type: "t2", size: 11 },
    ];
    q1.loadFiles(files);
    assert.equal(q1.errors.length, 1, "one error");
    assert.equal(loadedFilesCount, 0, "no files loaded");

    var loadedFilesCount = 0;
    q1.loadFiles([<any>{ name: "f1", type: "t1", size: 9 }]);
    assert.equal(q1.errors.length, 0, "no error");
    assert.equal(loadedFilesCount, 1, "one files loaded");

    var loadedFilesCount = 0;
    q1.loadFiles([<any>{ name: "f1", type: "t1", size: 12 }]);
    assert.equal(q1.errors.length, 1, "one error");
    assert.equal(loadedFilesCount, 0, "no files loaded");

    var loadedFilesCount = 0;
    q1.loadFiles([
      <any>{ name: "f1", type: "t1", size: 1 },
      <any>{ name: "f2", type: "t2", size: 2 },
    ]);
    assert.equal(q1.errors.length, 0, "no error");
    assert.equal(loadedFilesCount, 1, "two files loaded");

    q1.clear();
  }
);

QUnit.test("QuestionFile canPreviewImage", function(assert) {
  var q1: QuestionFileModel = new QuestionFileModel("image1");

  assert.notOk(q1.canPreviewImage(undefined), "no item");
  assert.notOk(q1.canPreviewImage({}), "empty item");
  assert.ok(
    q1.canPreviewImage({ content: "data:image;/someth" }),
    "by content"
  );
  assert.ok(
    q1.canPreviewImage({ content: "someth", type: "image/png" }),
    "by content"
  );
  assert.notOk(
    q1.canPreviewImage({ content: "someth", type: "text/html" }),
    "other type"
  );
});

QUnit.test(
  "QuestionFile process errors during files uploading - https://surveyjs.answerdesk.io/ticket/details/T1075",
  async function(assert) {
    var done = assert.async(2);
    var json = {
      questions: [
        {
          type: "file",
          name: "image1",
          storeDataAsText: false,
          showPreview: true,
        },
      ],
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    var isSuccess = true;
    survey.onUploadFiles.add((survey, options) => {
      setTimeout(() => {
        if (isSuccess) {
          options.callback(
            "success",
            options.files.map((file) => {
              return { file: file, content: file.name + "_url" };
            })
          );
        } else {
          options.callback("error");
        }
      }, 1);
    });

    var state = "";
    var stateSec = "";
    q1.onUploadStateChanged.add((_, options) => {
      state = options.state;
      stateSec += "->" + options.state;
    });

    assert.ok(q1.isEmpty());
    assert.equal(q1.value, undefined);
    assert.equal(state, "");
    assert.equal(stateSec, "");

    isSuccess = false;
    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);

    setTimeout(() => {
      assert.ok(q1.isEmpty());
      assert.equal(q1.value, undefined);
      assert.equal(stateSec, "->loading->error");
      assert.equal(state, "error");
      done();

      isSuccess = true;
      q1.loadFiles([<any>{ name: "f2", type: "t2" }]);

      setTimeout(() => {
        assert.notOk(q1.isEmpty());
        assert.equal(q1.value.length, 1);
        assert.equal(q1.value[0].content, "f2_url");
        assert.equal(stateSec, "->loading->error->loading->loaded");
        assert.equal(state, "loaded");
        done();
      }, 2);
    }, 2);
  }
);

QUnit.test("QuestionFile replace file for single file mode", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        name: "image1",
        storeDataAsText: false,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

  survey.onUploadFiles.add((survey, options) => {
    options.callback(
      "success",
      options.files.map((file) => {
        return { file: file, content: file.name + "_url" };
      })
    );
  });

  var files1: any = [{ name: "f1", type: "t1" }];
  q1.loadFiles(files1);
  assert.equal(q1.value.length, 1, "first file");
  assert.equal(q1.value[0].name, "f1", "first file name");

  var files2: any = [{ name: "f2", type: "t2", size: 100000 }];
  q1.loadFiles(files2);
  assert.equal(q1.value.length, 1, "the only single file");
  assert.equal(q1.value[0].name, "f2", "second file name");
});
QUnit.test("QuestionFile in panel dynamic in preview mode", function(assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "panel",
        templateElements: [
          {
            type: "file",
            name: "files",
            storeDataAsText: false,
            allowMultiple: true,
            maxSize: 102400,
          },
        ],
      },
    ],
  };

  var survey = new SurveyModel(json);
  survey.data = { panel: [{ files: ["someId"] }] };
  survey.showPreview();
  var panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
  var fileQuestion = <QuestionFileModel>panel.panels[0].questions[0];
  assert.equal(panel.panelCount, 1, "One panel");
  var fileQuestion = <QuestionFileModel>panel.panels[0].questions[0];
  assert.equal(fileQuestion.value, "someId", "Question file name");
});
QUnit.test("Writable captions", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your file",
        name: "file1",
      }
    ],
  };

  var survey = new SurveyModel(json);
  var q: QuestionFileModel = <any>survey.getQuestionByName("file1");
  /**
   * The remove file confirmation message template.
   */
  assert.equal(q.confirmRemoveMessage, surveyLocalization.getString("confirmRemoveFile"), "The remove file confirmation message template default");
  q.confirmRemoveMessage += "_new";
  assert.equal(q.confirmRemoveMessage, surveyLocalization.getString("confirmRemoveFile")+"_new", "The remove file confirmation message template new");
  /**
    * The remove all files confirmation message.
    */
  assert.equal(q.confirmRemoveAllMessage, surveyLocalization.getString("confirmRemoveAllFiles"), "The remove all files confirmation message default");
  q.confirmRemoveAllMessage += "_new";
  assert.equal(q.confirmRemoveAllMessage, surveyLocalization.getString("confirmRemoveAllFiles")+"_new", "The remove all files confirmation message new");
  /**
    * The no file chosen caption for modern theme.
    */
  assert.equal(q.noFileChosenCaption, surveyLocalization.getString("noFileChosen"), "The no file chosen caption for modern theme default");
  q.noFileChosenCaption += "_new";
  assert.equal(q.noFileChosenCaption, surveyLocalization.getString("noFileChosen")+"_new", "The no file chosen caption for modern theme new");
  /**
    * The choose files button caption for modern theme.
    */
  assert.equal(q.chooseButtonCaption, surveyLocalization.getString("chooseFileCaption"), "The choose files button caption for modern theme default");
  q.chooseButtonCaption += "_new";
  assert.equal(q.chooseButtonCaption, surveyLocalization.getString("chooseFileCaption")+"_new", "The choose files button caption for modern theme new");
  /**
    * The clean files button caption.
    */
  assert.equal(q.clearButtonCaption, surveyLocalization.getString("clearCaption"), "The clean files button caption default");
  q.clearButtonCaption += "_new";
  assert.equal(q.clearButtonCaption, surveyLocalization.getString("clearCaption")+"_new", "The clean files button caption new");
  /**
    * The remove file button caption.
    */
  assert.equal(q.removeFileCaption, surveyLocalization.getString("removeFileCaption"), "The remove file button caption default");
  q.removeFileCaption += "_new";
  assert.equal(q.removeFileCaption, surveyLocalization.getString("removeFileCaption")+"_new", "The remove file button caption new");
  /**
    * The loading file input title.
    */
  assert.equal(q.loadingFileTitle, surveyLocalization.getString("loadingFile"), "The loading file input title default");
  q.loadingFileTitle += "_new";
  assert.equal(q.loadingFileTitle, surveyLocalization.getString("loadingFile")+"_new", "The loading file input title new");
  /**
   * The choose file input title.
   */
  assert.equal(q.chooseFileTitle, surveyLocalization.getString("chooseFile"), "The choose file input title default");
  q.chooseFileTitle += "_new";
  assert.equal(q.chooseFileTitle, surveyLocalization.getString("chooseFile")+"_new", "The choose file input title new");

});

QUnit.test("Check choose button text", function(assert) {
  const json = {
    questions: [
      {
        type: "file",
        title: "Please upload your file",
        name: "file1",
      }
    ],
  };

  var survey = new SurveyModel(json);
  var q: QuestionFileModel = <any>survey.getQuestionByName("file1");

  assert.equal(q.chooseButtonText, "Choose file");
  q.value = [{
    content: "https://api.surveyjs.io/public/v1/Survey/file?filePath=dcc81e2a-586f-45dd-b734-ee86bcbad8db.png",
    name: "name.png",
    type: "image/png"
  }];
  assert.equal(q.chooseButtonText, "Replace file");

  q.allowMultiple = true;
  assert.equal(q.chooseButtonText, "Choose file");
  q.value = undefined;
  assert.equal(q.chooseButtonText, "Choose file");
});

QUnit.test("check file d&d", (assert) => {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your file",
        name: "file1",
      }
    ],
  };

  var survey = new SurveyModel(json);
  var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");
  let onChangeCalledCount = 0;
  q["onChange"] = () => { onChangeCalledCount++; };
  const event = { preventDefault: () => {}, dataTransfer: { dropEffect: "none", files: [{ type: "ext", name: "test", content: "test_content" }] } };
  q.onDragEnter(event);
  assert.equal(q["dragCounter"], 1);
  assert.equal(q.isDragging, true);

  q.onDragOver(event);
  assert.equal(event.dataTransfer.dropEffect, "copy");
  assert.equal(q.isDragging, true);

  q.onDragLeave(event);
  assert.equal(q["dragCounter"], 0);
  assert.equal(q.isDragging, false);

  q.onDragEnter(event);
  assert.equal(q["dragCounter"], 1);
  assert.equal(q.isDragging, true);

  q.onDragEnter(event);
  assert.equal(q["dragCounter"], 2);
  assert.equal(q.isDragging, true);
  //prevent remove drag state when dragging on children
  q.onDragLeave(event);
  assert.equal(q["dragCounter"], 1);
  assert.equal(q.isDragging, true);

  q.onDrop(event);
  assert.equal(q["dragCounter"], 0);
  assert.equal(q.isDragging, false);
  assert.equal(onChangeCalledCount, 1);
});

QUnit.test("check file d&d readonly", (assert) => {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your file",
        name: "file1",
      }
    ],
  };
  var survey = new SurveyModel(json);
  var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");
  let onChangeCalledCount = 0;
  assert.equal(q["canDragDrop"](), true, "canDragDrop");
  q["onChange"] = () => { onChangeCalledCount++; };
  const event = { preventDefault: () => {}, dataTransfer: { dropEffect: "none", files: [{ type: "ext", name: "test", content: "test_content" }] } };
  const checkDD = () => {
    q.onDragOver(event);
    assert.equal(event.dataTransfer.dropEffect, "none");
    assert.equal(q.isDragging, false);

    q.onDragLeave(event);
    assert.equal(q.isDragging, false);

    q.onDragOver(event);
    assert.equal(q.isDragging, false);

    q.onDrop(event);
    assert.equal(q.isDragging, false);
    assert.equal(onChangeCalledCount, 0);
  };
  q.readOnly = true;
  checkDD();
  settings.supportCreatorV2 = true;
  survey.setDesignMode(true);
  checkDD();
});
QUnit.test("file.clearButtonCaption localization", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "file",
        name: "file1",
      }
    ],
  });
  var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");
  assert.equal(q.clearButtonCaption, "Clear");
  survey.locale = "fr";
  assert.equal(q.clearButtonCaption, "Vider");
  survey.locale = "";
});

QUnit.test("Question File responsive", (assert) => {
  var json = {
    questions: [
      {
        type: "file",
        name: "image1",
        storeDataAsText: false,
        allowMultiple: true
      },
    ],
  };
  var survey = new SurveyModel(json);
  survey.css = defaultV2Css;
  survey.locale = "";
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

  survey.onUploadFiles.add((survey, options) => {
    options.callback(
      "success",
      options.files.map((file) => {
        return { file: file, content: file.name + "_url" };
      })
    );
  });

  q1.cssClasses.mobile = "m";
  assert.equal(q1.fileRootCss, "sd-file");
  q1.isMobile = true;
  q1.pageSize = 1;
  assert.equal(q1.fileRootCss, "sd-file m");
  assert.equal(q1.fileNavigatorVisible, false);
  var files1: any = [{ name: "f1", type: "t1" }];
  q1.loadFiles(files1);

  assert.equal(q1.fileNavigatorVisible, false);

  var files2: any = [{ name: "f2", type: "t2", size: 100000 }];
  q1.loadFiles(files2);

  assert.equal(q1.fileNavigatorVisible, true);

  assert.equal(q1["fileIndexAction"].title, "2 of 2");
  q1["nextFileAction"].action();
  assert.equal(q1["fileIndexAction"].title, "1 of 2");
  q1["nextFileAction"].action();
  assert.equal(q1["fileIndexAction"].title, "2 of 2");
  q1["prevFileAction"].action();
  assert.equal(q1["fileIndexAction"].title, "1 of 2");
  q1["prevFileAction"].action();
  assert.equal(q1["fileIndexAction"].title, "2 of 2");

  assert.equal(q1.isPreviewVisible(0), false);
  assert.equal(q1.isPreviewVisible(1), true);

  q1["nextFileAction"].action();
  assert.equal(q1.isPreviewVisible(0), true);
  assert.equal(q1.isPreviewVisible(1), false);

  assert.equal(q1.fileNavigatorVisible, true);
  q1.clear();
  assert.equal(q1.fileNavigatorVisible, false);
});

QUnit.test("QuestionFile inside a panel set value", async function(assert) {
  let done = assert.async(1);
  var json = {
    "name": "page1",
    "elements": [
      {
        "type": "paneldynamic",
        "name": "question15",
        "panelCount": 1,
        "templateElements": [
          {
            "type": "file",
            "name": "question16",
            "storeDataAsText": false,
          }
        ]
      }
    ]
  };

  var survey = new SurveyModel(json);
  var panel: any = <any>survey.getQuestionByName("question15");
  var q: QuestionFileModel = <any>panel.panels[0].questions[0];
  let downloadCallCount = 0;
  const downloadedFile = {
    content: "data:image/jpeg;base64,FILECONTENT1",
    name: "name.png",
    type: "image/png"
  };
  survey.onDownloadFile.add((survey, options) => {
    downloadCallCount++;
    setTimeout(() => {
      options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
    }, 1);
  });

  q.value = [{
    content: "https://api.surveyjs.io/public/v1/Survey/file?filePath=dcc81e2a-586f-45dd-b734-ee86bcbad8db.png",
    name: "name.png",
    type: "image/png"
  }];

  setTimeout(() => {
    assert.equal(downloadCallCount, 1);
    assert.equal(q.previewValue.length, 1);
    assert.deepEqual(q.previewValue, [downloadedFile]);
    done();
  }, 2);
});

QUnit.test("preview item index on last file removed", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "file",
        name: "file1",
        allowMultiple: true,
      }
    ],
  });
  var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");
  q.value = [{
    content: "file1",
    name: "file1.png",
    type: "image/png"
  }, {
    content: "file2",
    name: "file2.png",
    type: "image/png"
  }, {
    content: "file3",
    name: "file3.png",
    type: "image/png"
  }];
  assert.equal(q.indexToShow, 0, "Start from 0");
  assert.equal(q["fileIndexAction"].title, "1 of 3", "Initial title");
  q["prevFileAction"].action();
  assert.equal(q.indexToShow, 2, "We're on 3rd image");
  assert.equal(q["fileIndexAction"].title, "3 of 3", "We're on the last item");
  q.doRemoveFile(q.value[2]);
  assert.equal(q.indexToShow, 1, "We're on 2nd image");
  assert.equal(q["fileIndexAction"].title, "2 of 2", "We're on the last item again");
});

QUnit.test(
  "QuestionFile upload state sequence",
  function(assert) {
    var json = {
      questions: [
        {
          type: "file",
          name: "image1",
          storeDataAsText: false,
        },
      ],
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    var isSuccess = true;
    survey.onUploadFiles.add((survey, options) => {
      if (isSuccess) {
        options.callback(
          "success",
          options.files.map((file) => {
            return { file: file, content: file.name + "_url" };
          })
        );
      } else {
        options.callback("error");
      }
    });

    var state = "";
    q1.onUploadStateChanged.add((_, options) => {
      state += "->" + options.state;
    });

    assert.ok(q1.isEmpty());
    assert.equal(q1.value, undefined);
    assert.equal(state, "");

    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);

    assert.notOk(q1.isEmpty());
    assert.equal(q1.value.length, 1);
    assert.equal(q1.value[0].content, "f1_url");
    assert.equal(state, "->loading->loaded");

    q1.clear();
    assert.equal(state, "->loading->loaded->empty");
  }
);

QUnit.test("Check assign data and upload state", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "file",
        name: "file1",
      }
    ],
  });
  var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");

  assert.equal(q.currentState, "empty", "Initial state is empty");

  q.value = [{
    content: "file1",
    name: "file1.png",
    type: "image/png"
  }];
  assert.equal(q.currentState, "loaded", "The loaded state after data assigned");
});

QUnit.test("Check download file event", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "file",
        name: "file1",
        storeDataAsText: false,
        allowMultiple: true,
      }
    ],
  });
  var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");
  let log = "";
  survey.onDownloadFile.add((survey, options) => {
    log += "->" + options.fileValue.name;
    options.callback(
      "success",
      options.fileValue.name + "_downloaded"
    );
  });

  assert.equal(q.currentState, "empty", "Initial state is empty");

  survey.data = { "file1": [{
    content: "file1",
    name: "file1.png",
    type: "image/png"
  }, {
    content: "file2",
    name: "file2.png",
    type: "image/png"
  }, {
    content: "file3",
    name: "file3.png",
    type: "image/png"
  }] };
  assert.equal(log, "->file1.png->file2.png->file3.png", "Every file should be loaded only once");
  assert.equal(q.value.length, 3, "Question value contains 3 files");
  assert.equal(q.currentState, "loaded", "The loaded state after data assigned");
});

QUnit.test("Check isReady flag with onDownloadFile callback", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "file",
        name: "file1",
        storeDataAsText: false,
      }
    ],
  });
  const question = survey.getAllQuestions()[0];
  let done = assert.async();
  let log = "";
  survey.onDownloadFile.add((survey, options) => {
    assert.equal(options.question.isReady, false);
    setTimeout(() => {
      log += "->" + options.fileValue.name;
      options.callback("success", (<string>options.content).replace("url", "content"));
    });
  });
  question.onReadyChanged.add(() => {
    assert.equal(log, "->file1.png->file2.png");
    assert.deepEqual(question.previewValue, [{
      content: "content1",
      name: "file1.png",
      type: "image/png"
    }, {
      content: "content2",
      name: "file2.png",
      type: "image/png"
    }]);
    assert.ok(question.isReady);
    done();
  });
  survey.data = { "file1": [{
    content: "url1",
    name: "file1.png",
    type: "image/png"
  }, {
    content: "url2",
    name: "file2.png",
    type: "image/png"
  }] };
  assert.equal(question.isReady, false);
});

QUnit.test("QuestionFile remove file by preview value", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        allowMultiple: true,
        name: "image1",
        showPreview: true,
      },
    ],
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  survey.data = {
    image1: [
      { name: "f1", content: "data" },
      { name: "f2", content: "data" },
    ],
  };

  assert.deepEqual(q1.previewValue.length, 2);
  q1.doRemoveFile(q1.previewValue[1]);

  assert.deepEqual(q1.previewValue.length, 1);
  assert.deepEqual(survey.data, {
    image1: [{ name: "f1", content: "data" }],
  });
});

QUnit.test("QuestionFile download file content on preview", function(assert) {
  var json = {
    showPreviewBeforeComplete: "showAnsweredQuestions",
    elements: [
      {
        type: "file",
        name: "file",
        storeDataAsText: false
      }
    ]
  };

  var survey = new SurveyModel(json);

  let downloadLog = "";
  survey.onDownloadFile.add(function (survey, options) {
    downloadLog += "->" + options.fileValue.name;
  });

  const q1: QuestionFileModel = <any>survey.getQuestionByName("file");
  assert.notOk(q1.storeDataAsText);

  survey.data = {
    file: [{ name: "f1", content: "data" }],
  };

  assert.equal(downloadLog, "->f1");

  survey.showPreview();
  const q2: QuestionFileModel = <any>survey.getQuestionByName("file");
  assert.notOk(q2.storeDataAsText);

  assert.equal(downloadLog, "->f1->f1");
});

QUnit.test("Check previewValue order is correct", (assert) => {
  const json = {
    showPreviewBeforeComplete: "showAnsweredQuestions",
    elements: [
      {
        type: "file",
        name: "file",
        storeDataAsText: false
      }
    ]
  };
  const survey = new SurveyModel(json);
  const question = <QuestionFileModel>survey.getAllQuestions()[0];

  survey.onDownloadFile.add(function (survey, options) {
    const timers = {
      f2: 10,
      f3: 20,
      f1: 30
    };
    setTimeout(() => {
      options.callback("success", "");
    }, timers[options.fileValue.name]);
  });
  survey.data = {
    file: [{ name: "f1", content: "data" }, { name: "f2", content: "data" }, { name: "f3", content: "data" }],
  };
  const done = assert.async();
  setTimeout(() => {
    assert.deepEqual(question.previewValue.map(val => val.name), ["f1", "f2", "f3"]);
    done();
  }, 100);
});

QUnit.test("File Question on Smaller Screens: navigation bar doesn't appear when the survey.onDownloadFile event is used", (assert) => {
  const json = {
    showPreviewBeforeComplete: "showAnsweredQuestions",
    elements: [
      {
        type: "file",
        name: "file",
        storeDataAsText: false
      }
    ]
  };
  const survey = new SurveyModel(json);
  const question = <QuestionFileModel>survey.getAllQuestions()[0];
  survey.css = defaultV2Css;
  question.isMobile = true;
  question.pageSize = 1;
  assert.equal(question.indexToShow, 0);
  assert.equal(question["fileIndexAction"].title, "1 of 0");
  assert.equal(question.containsMultiplyFiles, false);
  assert.equal(question.fileNavigatorVisible, false);

  survey.onDownloadFile.add(function (survey, options) {
    const timers = {
      f2: 10,
      f3: 20,
      f1: 30
    };
    setTimeout(() => {
      options.callback("success", "");
    }, timers[options.fileValue.name]);
  });
  survey.data = {
    file: [{ name: "f1", content: "data" }, { name: "f2", content: "data" }, { name: "f3", content: "data" }],
  };
  const done = assert.async();
  setTimeout(() => {
    assert.deepEqual(question.previewValue.map(val => val.name), ["f1", "f2", "f3"]);
    assert.equal(question.indexToShow, 0);
    assert.equal(question["fileIndexAction"].title, "1 of 3");
    assert.equal(question.containsMultiplyFiles, true);
    assert.equal(question.fileNavigatorVisible, true);
    done();
  }, 100);
});

QUnit.test("Check file question navigator with different items count visible", (assert) => {
  const json = {
    showPreviewBeforeComplete: "showAnsweredQuestions",
    elements: [
      {
        type: "file",
        name: "file",
        storeDataAsText: false,
        allowMultiple: true
      }
    ]
  };
  const survey = new SurveyModel(json);
  const question = <QuestionFileModel>survey.getAllQuestions()[0];
  survey.css = defaultV2Css;
  question.pageSize = 3;
  assert.equal(question.indexToShow, 0);
  assert.equal(question["fileIndexAction"].title, "1 of 0");
  assert.equal(question.containsMultiplyFiles, false);
  assert.equal(question.fileNavigatorVisible, false);
  survey.onUploadFiles.add((survey, options) => {
    options.callback(
      "success",
      options.files.map((file) => {
        return { file: file, content: file.name + "_url" };
      })
    );
  });
  question.loadFiles([{ name: "f1", type: "t1" } as any]);
  assert.equal(question.fileNavigatorVisible, false);
  question.loadFiles([{ name: "f2", type: "t2" } as any]);
  assert.equal(question.fileNavigatorVisible, false);
  question.loadFiles([{ name: "f3", type: "t3" } as any]);
  assert.equal(question.fileNavigatorVisible, false);
  question.loadFiles([{ name: "f4", type: "t4" } as any]);
  assert.equal(question.fileNavigatorVisible, true);
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  assert.notOk(question.isPreviewVisible(0));
  assert.notOk(question.isPreviewVisible(1));
  assert.notOk(question.isPreviewVisible(2));
  assert.ok(question.isPreviewVisible(3));
  question["prevFileAction"].action();
  assert.equal(question.indexToShow, 0);
  assert.equal(question["fileIndexAction"].title, "1 of 2");
  assert.ok(question.isPreviewVisible(0));
  assert.ok(question.isPreviewVisible(1));
  assert.ok(question.isPreviewVisible(2));
  assert.notOk(question.isPreviewVisible(3));
  question["nextFileAction"].action();
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  assert.notOk(question.isPreviewVisible(0));
  assert.notOk(question.isPreviewVisible(1));
  assert.notOk(question.isPreviewVisible(2));
  assert.ok(question.isPreviewVisible(3));
  question["nextFileAction"].action();
  assert.equal(question.indexToShow, 0);
  assert.equal(question["fileIndexAction"].title, "1 of 2");
  assert.ok(question.isPreviewVisible(0));
  assert.ok(question.isPreviewVisible(1));
  assert.ok(question.isPreviewVisible(2));
  assert.notOk(question.isPreviewVisible(3));
  question["prevFileAction"].action();
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  assert.notOk(question.isPreviewVisible(0));
  assert.notOk(question.isPreviewVisible(1));
  assert.notOk(question.isPreviewVisible(2));
  assert.ok(question.isPreviewVisible(3));

  //check index position on load files
  question.loadFiles([{ name: "f5", type: "t5" } as any, { name: "f6", type: "t6" } as any]);
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  question.loadFiles([{ name: "f7", type: "t7" } as any, { name: "f8", type: "t8" } as any]);
  assert.equal(question.indexToShow, 2);
  assert.equal(question["fileIndexAction"].title, "3 of 3");
  //check index position on deleting files
  question.removeFile(question.previewValue[7].name);
  assert.equal(question.indexToShow, 2);
  assert.equal(question["fileIndexAction"].title, "3 of 3");
  question.removeFile(question.previewValue[6].name);
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  question.removeFile(question.previewValue[5].name);
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  question.removeFile(question.previewValue[4].name);
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  //check index position change on itemsCountToShow change
  question.pageSize = 2;
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 2");
  assert.notOk(question.isPreviewVisible(0));
  assert.notOk(question.isPreviewVisible(1));
  assert.ok(question.isPreviewVisible(2));
  assert.ok(question.isPreviewVisible(3));
  question.pageSize = 1;
  assert.equal(question.indexToShow, 1);
  assert.equal(question["fileIndexAction"].title, "2 of 4");
  assert.notOk(question.isPreviewVisible(0));
  assert.ok(question.isPreviewVisible(1));
  assert.notOk(question.isPreviewVisible(2));
  assert.notOk(question.isPreviewVisible(3));
});
QUnit.test("Check file question processResponsiveness method", (assert) => {
  const json = {
    showPreviewBeforeComplete: "showAnsweredQuestions",
    elements: [
      {
        type: "file",
        name: "file",
        storeDataAsText: false,
        allowMultiple: true
      }
    ]
  };
  const survey = new SurveyModel(json);
  const question = <QuestionFileModel>survey.getAllQuestions()[0];
  survey.css = defaultV2Css;
  question["calculatedGapBetweenItems"] = 32;
  question["calculatedItemWidth"] = 96;
  question["processResponsiveness"](0, 400);
  assert.equal(question.pageSize, 3);

  question["calculatedGapBetweenItems"] = 32;
  question["calculatedItemWidth"] = 96;
  question["processResponsiveness"](0, 250);
  assert.equal(question.pageSize, 2);

  question["calculatedGapBetweenItems"] = 32;
  question["calculatedItemWidth"] = 50;
  question["processResponsiveness"](0, 250);
  assert.equal(question.pageSize, 3);

  question["calculatedGapBetweenItems"] = 8;
  question["calculatedItemWidth"] = 50;
  question["processResponsiveness"](0, 250);
  assert.equal(question.pageSize, 4);
});

QUnit.test("QuestionFile download file content on preview", function(assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "file", name: "q1" },
      { type: "file", name: "q2", readOnly: true }
    ]
  });
  const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
  const q2 = <QuestionFileModel>survey.getQuestionByName("q2");
  assert.equal(q1.renderedPlaceholder.substring(0, 4), "Drag", "q1 => drag");
  assert.equal(q2.renderedPlaceholder.substring(0, 2), "No", "q2 => no file");
  q1.readOnly = true;
  q2.readOnly = false;
  assert.equal(q1.renderedPlaceholder.substring(0, 2), "No", "q1, readOnly => no file");
  assert.equal(q2.renderedPlaceholder.substring(0, 4), "Drag", "q2, not readOnly=> drag");
});
QUnit.test("QuestionFile current mode property, camera is not available", function(assert) {
  StylesManager.applyTheme("defaultV2");
  const callbacks = new Array<(devices: Array<MediaDeviceInfo>) => void>();
  Camera.mediaDevicesCallback = (cb: (devices: Array<MediaDeviceInfo>) => void): void => {
    callbacks.push(cb);
  };
  Camera.clear();
  let survey = new SurveyModel({
    elements: [
      { type: "file", name: "q1" },
      { type: "file", name: "q2", mode: "file" },
      { type: "file", name: "q3", mode: "camera" },
      { type: "file", name: "q4", mode: "both" },
    ]
  });
  assert.equal(survey.getQuestionByName("q1").currentMode, "file");
  assert.equal(survey.getQuestionByName("q2").currentMode, "file");
  assert.equal(survey.getQuestionByName("q3").currentMode, "camera");
  assert.equal(survey.getQuestionByName("q4").currentMode, "both");
  assert.equal(callbacks.length, 2, "callbacks are set");
  callbacks.forEach(cb => cb([]));
  assert.equal(survey.getQuestionByName("q1").currentMode, "file", "#1");
  assert.equal(survey.getQuestionByName("q2").currentMode, "file", "#2");
  assert.equal(survey.getQuestionByName("q3").currentMode, "file", "#3");
  assert.equal(survey.getQuestionByName("q4").currentMode, "file", "#4");
  callbacks.splice(0, callbacks.length);
  survey.getQuestionByName("q1").mode = "camera";
  assert.equal(survey.getQuestionByName("q1").currentMode, "file", "#5");
  callbacks.forEach(cb => cb([]));
  assert.equal(survey.getQuestionByName("q1").currentMode, "file", "#6");
  Camera.mediaDevicesCallback = undefined;
  StylesManager.applyTheme("default");
});
function createDevices(info: Array<any>): Array<MediaDeviceInfo> {
  const res = new Array<MediaDeviceInfo>();
  let id = 1;
  info.forEach(i => {
    res.push({ kind: "videoinput", deviceId: id.toString(), groupId: "group1", label: i.label, toJSON: (): any => {} });
    id++;
  });
  return res;
}
QUnit.test("QuestionFile current mode property, camera is available", function(assert) {
  StylesManager.applyTheme("defaultV2");
  const callbacks = new Array<(devices: Array<MediaDeviceInfo>) => void>();
  Camera.mediaDevicesCallback = (cb: (devices: Array<MediaDeviceInfo>) => void): void => {
    callbacks.push(cb);
  };
  Camera.clear();
  const devices = createDevices([{ label: "user" }]);
  let survey = new SurveyModel({
    elements: [
      { type: "file", name: "q1" },
      { type: "file", name: "q2", mode: "file" },
      { type: "file", name: "q3", mode: "camera" },
      { type: "file", name: "q4", mode: "both" },
    ]
  });
  assert.equal(survey.getQuestionByName("q1").currentMode, "file");
  assert.equal(survey.getQuestionByName("q2").currentMode, "file");
  assert.equal(survey.getQuestionByName("q3").currentMode, "camera");
  assert.equal(survey.getQuestionByName("q4").currentMode, "both");
  assert.equal(callbacks.length, 2, "callbacks are set");

  callbacks.forEach(cb => cb(devices));
  assert.equal(survey.getQuestionByName("q1").currentMode, "file", "#1");
  assert.equal(survey.getQuestionByName("q2").currentMode, "file", "#2");
  assert.equal(survey.getQuestionByName("q3").currentMode, "camera", "#3");
  assert.equal(survey.getQuestionByName("q4").currentMode, "both", "#4");
  callbacks.splice(0, callbacks.length);
  survey.getQuestionByName("q1").mode = "camera";
  assert.equal(survey.getQuestionByName("q1").currentMode, "camera", "#5");
  callbacks.forEach(cb => cb(devices));
  assert.equal(survey.getQuestionByName("q1").currentMode, "camera", "#6");
  Camera.mediaDevicesCallback = undefined;
  StylesManager.applyTheme("default");
});
QUnit.test("new Camera().getMediaConstraints", function(assert) {
  Camera.setCameraList(createDevices([{ label: "dfdf" }, { label: "user" }]));
  let mConst: any = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 2, "Device is correct");
  Camera.setCameraList(createDevices([{ label: "abd" }, { label: "enviroment" }, { label: "user" }]));
  mConst = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 3, "Device is correct");
  Camera.setCameraList(createDevices([{ label: "dfdf" }, { label: "enviroment" }]));
  mConst = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 2, "Device is correct");
  Camera.clear();
});
QUnit.test("new Camera().flip", function(assert) {
  assert.equal(new Camera().canFlip(), false, "There is no devices");
  Camera.setCameraList(createDevices([{ label: "abd" }]));
  assert.equal(new Camera().canFlip(), false, "There is one device");
  Camera.setCameraList(createDevices([{ label: "abd" }, { label: "enviroment" }, { label: "user" }]));
  assert.equal(new Camera().canFlip(), true, "There are 3 devices");
  let mConst: any = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 3, "Device is correct");
  new Camera().flip();
  mConst = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 2, "Flip #1");
  new Camera().flip();
  mConst = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 1, "Flip #2");
  new Camera().flip();
  mConst = new Camera().getMediaConstraints();
  assert.equal(mConst.video.deviceId.exact, 3, "Flip #2");
  Camera.clear();
});
QUnit.test("QuestionFile stop playing video on hiding question", function(assert) {
  let survey = new SurveyModel({
    elements: [{ type: "file", name: "q1" }]
  });
  let q1 = <QuestionFileModel>survey.getQuestionByName("q1");
  q1.setPropertyValue("isPlayingVideo", true);
  assert.equal(q1.isPlayingVideo, true);
  q1.visible = false;
  assert.equal(q1.isPlayingVideo, false, "question invisible");
  q1.visible = true;
  q1.setPropertyValue("isPlayingVideo", true);
  q1.collapse();
  assert.equal(q1.isPlayingVideo, false, "question content is collapsed");
  survey = new SurveyModel({
    elements: [
      { type: "panel", name: "panel1",
        elements: [{ type: "file", name: "q1" }]
      }
    ]
  });
  let panel = survey.getPanelByName("panel1");
  q1 = <QuestionFileModel>survey.getQuestionByName("q1");
  q1.setPropertyValue("isPlayingVideo", true);
  assert.equal(q1.isPlayingVideo, true);
  panel.visible = false;
  assert.equal(q1.isPlayingVideo, false, "panel invisible");
  q1.setPropertyValue("isPlayingVideo", true);
  panel.collapse();
  assert.equal(q1.isPlayingVideo, false, "panel content is collapsed");
});
QUnit.test("QuestionFile stop playing video on going to another page or complete", function(assert) {
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "text", name: "q2" }] },
      { elements: [{ type: "file", name: "q1" }] },
      { elements: [{ type: "text", name: "q3" }] }
    ]
  });
  const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
  survey.currentPageNo = 1;
  q1.setPropertyValue("isPlayingVideo", true);
  assert.equal(q1.isPlayingVideo, true);
  survey.nextPage();
  assert.equal(q1.isPlayingVideo, false, "Go to next page");

  survey.currentPageNo = 1;
  q1.setPropertyValue("isPlayingVideo", true);
  assert.equal(q1.isPlayingVideo, true);
  survey.currentPageNo = 0;
  assert.equal(q1.isPlayingVideo, false, "Go to prev page");

  survey.pages[2].visible = false;
  survey.currentPageNo = 1;
  q1.setPropertyValue("isPlayingVideo", true);
  assert.equal(q1.isPlayingVideo, true);
  survey.doComplete();
  assert.equal(q1.isPlayingVideo, false, "complete survey");
});

QUnit.test("QuestionFile check actions container", function(assert) {
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "file", name: "q1", mode: "file" }] }
    ]
  });
  const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
  q1.chooseButtonCaption = "choose_test";
  q1.takePictureCaption = "take_picture_test";
  q1.clearButtonCaption = "clear_test";
  survey.css = defaultV2Css;
  assert.ok(q1.actionsContainerVisible);
  q1.readOnly = true;
  assert.notOk(q1.actionsContainerVisible);
  q1.readOnly = false;
  q1.isUploading = true;
  assert.notOk(q1.actionsContainerVisible);
  q1.isUploading = false;
  q1.setPropertyValue("isPlayingVideo", true);
  assert.notOk(q1.actionsContainerVisible);
  q1.setPropertyValue("isPlayingVideo", false);
  assert.ok(q1.actionsContainerVisible);
  const chooseFileAction = q1.actionsContainer.getActionById("sv-file-choose-file");
  const startCameraAction = q1.actionsContainer.getActionById("sv-file-start-camera");
  const cleanAction = q1.actionsContainer.getActionById("sv-file-clean");
  assert.equal(startCameraAction.title, "take_picture_test");
  assert.equal(cleanAction.title, "clear_test");
  assert.ok(chooseFileAction.visible);
  assert.notOk(startCameraAction.visible);
  assert.notOk(cleanAction.visible);
  assert.ok(startCameraAction.showTitle);
  q1.setPropertyValue("currentMode", "camera");
  assert.notOk(chooseFileAction.visible);
  assert.ok(startCameraAction.visible);
  assert.notOk(cleanAction.visible);
  q1.setPropertyValue("currentMode", "both");
  assert.ok(chooseFileAction.visible);
  assert.ok(startCameraAction.visible);
  assert.notOk(cleanAction.visible);
  q1.setPropertyValue("isAnswered", true);
  assert.ok(chooseFileAction.visible);
  assert.ok(startCameraAction.visible);
  assert.ok(cleanAction.visible);
  assert.notOk(startCameraAction.showTitle);
});

QUnit.test("QuestionFile check video actions", function(assert) {
  const survey = new SurveyModel({
    pages: [
      { elements: [{ type: "file", name: "q1", mode: "camera" }] }
    ]
  });
  Camera.setCameraList(createDevices([{ label: "dfdf" }]));
  const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
  assert.ok(q1.takePictureAction.visible);
  assert.ok(q1.closeCameraAction.visible);
  q1.setPropertyValue("isPlayingVideo", true);
  assert.notOk(q1.changeCameraAction.visible);
  q1.setPropertyValue("isPlayingVideo", false);

  Camera.setCameraList(createDevices([{ label: "dfdf" }, { label: "afaf" }]));
  q1.setPropertyValue("isPlayingVideo", true);
  assert.ok(q1.changeCameraAction.visible);
});