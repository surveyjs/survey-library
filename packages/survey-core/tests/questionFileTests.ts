import { SurveyModel } from "../src/survey";
import { QuestionFileModel } from "../src/question_file";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { getLocaleString } from "../src/surveyStrings";
import { settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { Camera } from "../src/utils/camera";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionSignaturePadModel } from "../src/question_signaturepad";
import { describe, test, expect, vi } from "vitest";
export * from "../src/localization/german";
describe("Survey_QuestionFile", () => {
  test("QuestionFile value initialization strings", () => {
    var json = {
      elements: [
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
    expect(q1.value).toEqualValues(survey.data.image1);
    expect(q2.value).toEqualValues(survey.data.image2);
    expect(q1.previewValue.length, "remote stored file").toBe(1);
    expect(q2.previewValue.length, "file stored as text").toBe(1);
    expect(q1.previewValue[0].content, "remote stored file content").toBe("data:image/jpeg;base64,FILECONTENT1");
    expect(q2.previewValue[0].content, "locally stored file content").toBe(survey.data.image2);
  });

  test("QuestionFile value initialization array", () => {
    var json = {
      elements: [
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
    expect(q1.value).toEqualValues(survey.data.image1);
    expect(q2.value).toEqualValues(survey.data.image2);
    expect(q1.previewValue.length, "remote stored file").toBe(1);
    expect(q2.previewValue.length, "file stored as text").toBe(1);
    expect(q1.previewValue[0].content, "remote stored file content").toBe("data:image/jpeg;base64,FILECONTENT1");
    expect(q2.previewValue[0].content, "locally stored file content").toBe(survey.data.image2[0]);
  });
  test("QuestionFile serialization", () => {
    const fileQuestion = new QuestionFileModel("q1");
    expect(fileQuestion.toJSON(), "We have only name in serialziation by default").toEqualValues({ name: "q1" });
  });

  test("QuestionFile change defaultValue for allowMultiple", () => {
    const fileQuestion1 = new QuestionFileModel("q1");
    expect(fileQuestion1.allowMultiple, "default is false").toBe(false);

    const prop1 = Serializer.getProperty("file", "allowMultiple");
    prop1.defaultValue = true;

    const fileQuestion2 = new QuestionFileModel("q2");
    expect(fileQuestion2.allowMultiple, "default is true").toBe(true);

    const prop2 = Serializer.getProperty("file", "allowMultiple");
    prop2.defaultValue = false;
  });

  test("QuestionFile value initialization array of objects", () => {
    var json = {
      elements: [
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
        expect(q1.inputTitle).toBe(" ");
      }
      if (options.name == "image2" && options.question.name === "image2") {
        expect(q2.inputTitle).toBe(" ");
      }
      options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
    });

    expect(q1.inputTitle).toBe("Choose file(s)...");
    expect(q2.inputTitle).toBe("Choose file(s)...");
    survey.data = {
      image1: [{ content: "someId" }],
      image2: [{ content: "data:image/jpeg;base64,FILECONTENT" }],
    };
    expect(q1.inputTitle).toBe(" ");
    expect(q2.inputTitle).toBe(" ");
    expect(q1.value).toEqualValues(survey.data.image1);
    expect(q2.value).toEqualValues(survey.data.image2);
    expect(q1.previewValue.length, "remote stored file").toBe(1);
    expect(q2.previewValue.length, "file stored as text").toBe(1);
    expect(q1.previewValue[0].content, "remote stored file content").toBe("data:image/jpeg;base64,FILECONTENT1");
    expect(q2.previewValue[0].content, "locally stored file content").toBe(survey.data.image2[0].content);
  });

  test("QuestionFile value initialization array of objects without onDownloadFile handler", () => {
    var json = {
      elements: [
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
    expect(q1.value).toEqualValues(survey.data.image1);
    expect(q2.value).toEqualValues(survey.data.image2);
    expect(q1.previewValue.length, "remote stored file").toBe(1);
    expect(q2.previewValue.length, "file stored as text").toBe(1);
    expect(q1.previewValue[0].content, "remote stored file content").toBe(survey.data.image1[0].content);
    expect(q2.previewValue[0].content, "locally stored file content").toBe(survey.data.image2[0].content);
  });

  test("QuestionFile upload files", () => {
    vi.useFakeTimers();
    try {
      var json = {
        elements: [
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

      let valueChanged = false;
      survey.onValueChanged.add((survey, options) => {
        valueChanged = true;
        expect(q1.value.length, "2 files").toBe(2);
        expect(q1.value[0].content, "first content").toBe(q1.value[0].name + "_url");
        expect(q1.value[1].content, "second content").toBe(q1.value[1].name + "_url");
        expect(q1.previewValue[0].content, "preview content 1").toBe(q1.value[0].content);
        expect(q1.previewValue[1].content, "preview content 2").toBe(q1.value[1].content);

        expect(q1.previewValue[0].name, "preview name 1").toBe(q1.value[0].name);
        expect(q1.previewValue[1].name, "preview name 2").toBe(q1.value[1].name);
      });
      vi.advanceTimersByTime(2);
      expect(valueChanged, "onValueChanged fired").toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  test("QuestionFile remove file", () => {
    var json = {
      elements: [
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
    expect(survey.data).toEqualValues({
      image1: [{ name: "f2", content: "data" }],
    });

    q1.removeFile("f2");
    expect(survey.data).toEqualValues({});
  });

  test("QuestionFile remove files with the same name", () => {
    const json = {
      elements: [
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

    q1.doRemoveFile(fileData2, { stopPropagation: () => {} });
    expect(survey.data).toEqualValues({ image1: [{ name: "f1", content: "data1" }] });

    q1.doRemoveFile(fileData1, { stopPropagation: () => {} });
    expect(survey.data).toEqualValues({});
  });

  test("QuestionFile upload files that exceed max size - https://surveyjs.answerdesk.io/ticket/details/T994", () => {
    var json = {
      elements: [
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
    expect(q1.errors.length, "one error").toBe(1);
    expect(loadedFilesCount, "no files loaded").toBe(0);

    var loadedFilesCount = 0;
    q1.loadFiles([<any>{ name: "f1", type: "t1", size: 9 }]);
    expect(q1.errors.length, "no error").toBe(0);
    expect(loadedFilesCount, "one files loaded").toBe(1);

    var loadedFilesCount = 0;
    q1.loadFiles([<any>{ name: "f1", type: "t1", size: 12 }]);
    expect(q1.errors.length, "one error").toBe(1);
    expect(loadedFilesCount, "no files loaded").toBe(0);

    var loadedFilesCount = 0;
    q1.loadFiles([
      <any>{ name: "f1", type: "t1", size: 1 },
      <any>{ name: "f2", type: "t2", size: 2 },
    ]);
    expect(q1.errors.length, "no error").toBe(0);
    expect(loadedFilesCount, "two files loaded").toBe(1);

    q1.clear();
  });
  test("QuestionFile upload files that exceed maxFiles, Issue #10549", () => {
    const json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          name: "image1",
          storeDataAsText: false,
          maxFiles: 2
        },
      ],
    };

    const survey = new SurveyModel(json);
    const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    expect(q1.maxFiles, "maxFiles is set correctly").toBe(2);

    var loadedFilesCount = 0;
    survey.onUploadFiles.add((survey, options) => {
      options.callback("success", options.files.map((file) => {
        loadedFilesCount++;
        return { file: file, content: file.name + "_url" };
      })
      );
    });

    q1.loadFiles([<any>{ name: "f1", type: "t1" },
    <any>{ name: "f2", type: "t2" }]);
    expect(q1.errors.length, "one error").toBe(0);
    expect(loadedFilesCount, "two files loaded").toBe(2);

    loadedFilesCount = 0;
    q1.clear();

    q1.loadFiles([<any>{ name: "f1", type: "t1" },
    <any>{ name: "f2", type: "t2" }, <any>{ name: "f3", type: "t3" }]);
    expect(q1.errors.length, "one error").toBe(1);
    expect(q1.errors[0].locText.text, "error text").toBe("The maximum number of files you can upload is 2.");
    expect(loadedFilesCount, "no files loaded").toBe(0);

    var loadedFilesCount = 0;
    q1.clear();
    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);
    expect(q1.errors.length, "no error").toBe(0);
    expect(loadedFilesCount, "one file loaded").toBe(1);

    q1.clear();
  });
  test("QuestionFile upload files that exceed maxFiles, Issue #10578", () => {
    const json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          name: "image1",
          storeDataAsText: false,
          maxFiles: 2
        },
      ],
    };

    const survey = new SurveyModel(json);
    const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    var loadedFilesCount = 0;
    survey.onUploadFiles.add((survey, options) => {
      options.callback("success", options.files.map((file) => {
        loadedFilesCount++;
        return { file: file, content: file.name + "_url" };
      })
      );
    });

    q1.loadFiles([<any>{ name: "f1", type: "t1" },
    <any>{ name: "f2", type: "t2" }]);
    expect(q1.errors.length, "one error").toBe(0);
    expect(loadedFilesCount, "two files loaded").toBe(2);

    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);
    expect(q1.errors.length, "one error").toBe(1);
    expect(q1.errors[0].locText.text, "error text").toBe("The maximum number of files you can upload is 2.");

    q1.clear();
  });

  test("QuestionFile canPreviewImage", () => {
    var q1: QuestionFileModel = new QuestionFileModel("image1");

    expect(q1.canPreviewImage(undefined), "no item").toBeFalsy();
    expect(q1.canPreviewImage({}), "empty item").toBeFalsy();
    expect(q1.canPreviewImage({ content: "data:image;/someth" }), "by content").toBeTruthy();
    expect(q1.canPreviewImage({ content: "someth", type: "image/png" }), "by content").toBeTruthy();
    expect(q1.canPreviewImage({ content: "someth", type: "text/html" }), "other type").toBeFalsy();
  });

  test("QuestionFile process errors during files uploading - https://surveyjs.answerdesk.io/ticket/details/T1075", () => {
    vi.useFakeTimers();
    try {
      var json = {
        elements: [
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
            options.callback("error", "custom error text");
          }
        }, 1);
      });

      var state = "";
      var stateSec = "";
      q1.onUploadStateChanged.add((_, options) => {
        state = options.state;
        stateSec += "->" + options.state;
      });

      expect(q1.isEmpty()).toBeTruthy();
      expect(q1.value).toBeUndefined();
      expect(state).toBe("");
      expect(stateSec).toBe("");

      isSuccess = false;
      q1.loadFiles([<any>{ name: "f1", type: "t1" }]);

      vi.advanceTimersByTime(2);
      expect(q1.isEmpty()).toBeTruthy();
      expect(q1.value).toBeUndefined();
      expect(stateSec).toBe("->loading->error->loaded");
      expect(q1.errors.length, "Has errors").toBe(1);
      expect(q1.errors[0].text, "Error text").toBe("custom error text");
      expect(state).toBe("loaded");

      isSuccess = true;
      q1.loadFiles([<any>{ name: "f2", type: "t2" }]);

      vi.advanceTimersByTime(2);
      expect(q1.isEmpty()).toBeFalsy();
      expect(q1.value.length).toBe(1);
      expect(q1.value[0].content).toBe("f2_url");
      expect(stateSec).toBe("->loading->error->loaded->loading->loaded");
      expect(state).toBe("loaded");
    } finally {
      vi.useRealTimers();
    }
  });

  test("QuestionFile replace file for single file mode", () => {
    var json = {
      elements: [
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
    expect(q1.value.length, "first file").toBe(1);
    expect(q1.value[0].name, "first file name").toBe("f1");

    var files2: any = [{ name: "f2", type: "t2", size: 100000 }];
    q1.loadFiles(files2);
    expect(q1.value.length, "the only single file").toBe(1);
    expect(q1.value[0].name, "second file name").toBe("f2");
  });
  test("QuestionFile in panel dynamic in preview mode", () => {
    var json = {
      elements: [
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
    expect(panel.panelCount, "One panel").toBe(1);
    var fileQuestion = <QuestionFileModel>panel.panels[0].questions[0];
    expect(fileQuestion.value, "Question file name").toEqualValues(["someId"]);
  });
  test("Writable captions", () => {
    var json = {
      elements: [
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
    expect(q.confirmRemoveMessage, "The remove file confirmation message template default").toBe(getLocaleString("confirmRemoveFile"));
    q.confirmRemoveMessage += "_new";
    expect(q.confirmRemoveMessage, "The remove file confirmation message template new").toBe(getLocaleString("confirmRemoveFile") + "_new");
    /**
    * The remove all files confirmation message.
    */
    expect(q.confirmRemoveAllMessage, "The remove all files confirmation message default").toBe(getLocaleString("confirmRemoveAllFiles"));
    q.confirmRemoveAllMessage += "_new";
    expect(q.confirmRemoveAllMessage, "The remove all files confirmation message new").toBe(getLocaleString("confirmRemoveAllFiles") + "_new");
    /**
    * The no file chosen caption for modern theme.
    */
    expect(q.noFileChosenCaption, "The no file chosen caption for modern theme default").toBe(getLocaleString("noFileChosen"));
    q.noFileChosenCaption += "_new";
    expect(q.noFileChosenCaption, "The no file chosen caption for modern theme new").toBe(getLocaleString("noFileChosen") + "_new");
    /**
    * The choose files button caption for modern theme.
    */
    expect(q.chooseButtonCaption, "The choose files button caption for modern theme default").toBe(getLocaleString("chooseFileCaption"));
    q.chooseButtonCaption += "_new";
    expect(q.chooseButtonCaption, "The choose files button caption for modern theme new").toBe(getLocaleString("chooseFileCaption") + "_new");
    /**
    * The clean files button caption.
    */
    expect(q.clearButtonCaption, "The clean files button caption default").toBe(getLocaleString("clearCaption"));
    q.clearButtonCaption += "_new";
    expect(q.clearButtonCaption, "The clean files button caption new").toBe(getLocaleString("clearCaption") + "_new");
    /**
    * The remove file button caption.
    */
    expect(q.removeFileCaption, "The remove file button caption default").toBe(getLocaleString("removeFileCaption"));
    q.removeFileCaption += "_new";
    expect(q.removeFileCaption, "The remove file button caption new").toBe(getLocaleString("removeFileCaption") + "_new");
    /**
    * The loading file input title.
    */
    expect(q.loadingFileTitle, "The loading file input title default").toBe(getLocaleString("loadingFile"));
    q.loadingFileTitle += "_new";
    expect(q.loadingFileTitle, "The loading file input title new").toBe(getLocaleString("loadingFile") + "_new");
    /**
   * The choose file input title.
   */
    expect(q.chooseFileTitle, "The choose file input title default").toBe(getLocaleString("chooseFile"));
    q.chooseFileTitle += "_new";
    expect(q.chooseFileTitle, "The choose file input title new").toBe(getLocaleString("chooseFile") + "_new");

  });

  test("Check choose button text", () => {
    const json = {
      elements: [
        {
          type: "file",
          title: "Please upload your file",
          name: "file1",
        }
      ],
    };

    var survey = new SurveyModel(json);
    var q: QuestionFileModel = <any>survey.getQuestionByName("file1");

    expect(q.chooseButtonText).toBe("Select File");
    q.value = [{
      content: "https://api.surveyjs.io/public/v1/Survey/file?filePath=dcc81e2a-586f-45dd-b734-ee86bcbad8db.png",
      name: "name.png",
      type: "image/png"
    }];
    expect(q.chooseButtonText).toBe("Replace file");

    q.allowMultiple = true;
    expect(q.chooseButtonText).toBe("Select File");
    q.value = undefined;
    expect(q.chooseButtonText).toBe("Select File");
  });

  test("check file d&d", () => {
    var json = {
      elements: [
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
    const event = { preventDefault: () => { }, dataTransfer: { dropEffect: "none", files: [{ type: "ext", name: "test", content: "test_content" }] } };
    q.onDragEnter(event);
    expect(q["dragCounter"]).toBe(1);
    expect(q.isDragging).toBe(true);

    q.onDragOver(event);
    expect(event.dataTransfer.dropEffect).toBe("copy");
    expect(q.isDragging).toBe(true);

    q.onDragLeave(event);
    expect(q["dragCounter"]).toBe(0);
    expect(q.isDragging).toBe(false);

    q.onDragEnter(event);
    expect(q["dragCounter"]).toBe(1);
    expect(q.isDragging).toBe(true);

    q.onDragEnter(event);
    expect(q["dragCounter"]).toBe(2);
    expect(q.isDragging).toBe(true);
    //prevent remove drag state when dragging on children
    q.onDragLeave(event);
    expect(q["dragCounter"]).toBe(1);
    expect(q.isDragging).toBe(true);

    q.onDrop(event);
    expect(q["dragCounter"]).toBe(0);
    expect(q.isDragging).toBe(false);
    expect(onChangeCalledCount).toBe(1);
  });

  test("check file d&d readonly", () => {
    var json = {
      elements: [
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
    expect(q["canDragDrop"](), "canDragDrop").toBe(true);
    q["onChange"] = () => { onChangeCalledCount++; };
    const event = { preventDefault: () => { }, dataTransfer: { dropEffect: "none", files: [{ type: "ext", name: "test", content: "test_content" }] } };
    const checkDD = () => {
      q.onDragOver(event);
      expect(event.dataTransfer.dropEffect).toBe("none");
      expect(q.isDragging).toBe(false);

      q.onDragLeave(event);
      expect(q.isDragging).toBe(false);

      q.onDragOver(event);
      expect(q.isDragging).toBe(false);

      q.onDrop(event);
      expect(q.isDragging).toBe(false);
      expect(onChangeCalledCount).toBe(0);
    };
    q.readOnly = true;
    checkDD();

    survey.setDesignMode(true);
    checkDD();
  });
  test("file.clearButtonCaption localization", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "file",
          name: "file1",
        }
      ],
    });
    var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");
    expect(q.clearButtonCaption).toBe("Clear");
    survey.locale = "fr";
    expect(q.clearButtonCaption).toBe("Vider");
    survey.locale = "";
  });

  test("Question File responsive", () => {
    var json = {
      elements: [
        {
          type: "file",
          name: "image1",
          storeDataAsText: false,
          allowMultiple: true
        },
      ],
    };
    var survey = new SurveyModel(json);
    survey.css = defaultCss;
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
    expect(q1.fileRootCss).toBe("sd-file");
    q1.isMobile = true;
    q1.pageSize = 1;
    expect(q1.fileRootCss).toBe("sd-file m");
    expect(q1.fileNavigatorVisible).toBe(false);
    var files1: any = [{ name: "f1", type: "t1" }];
    q1.loadFiles(files1);

    expect(q1.fileNavigatorVisible).toBe(false);

    var files2: any = [{ name: "f2", type: "t2", size: 100000 }];
    q1.loadFiles(files2);

    expect(q1.fileNavigatorVisible).toBe(true);
    const fileIndexAction = q1.fileNavigator.getActionById("fileIndex");
    expect(fileIndexAction.title).toBe("2 of 2");
    const nextFileAction = q1.fileNavigator.getActionById("nextPage");
    nextFileAction.action();
    expect(fileIndexAction.title).toBe("1 of 2");
    nextFileAction.action();
    expect(fileIndexAction.title).toBe("2 of 2");
    const prevFileAction = q1.fileNavigator.getActionById("prevPage");
    prevFileAction.action();
    expect(fileIndexAction.title).toBe("1 of 2");
    prevFileAction.action();
    expect(fileIndexAction.title).toBe("2 of 2");

    expect(q1.pages.length).toBe(2);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[1].items.length).toBe(1);

    expect(q1.pages[0].css).toBe("sd-file__page");
    expect(q1.pages[1].css).toBe("sd-file__page");

    nextFileAction.action();

    expect(q1.pages[0].css).toBe("sd-file__page");
    expect(q1.pages[1].css).toBe("sd-file__page");

    expect(q1.fileNavigatorVisible).toBe(true);
    q1.clear();
    expect(q1.fileNavigatorVisible).toBe(false);
  });

  test("QuestionFile inside a panel set value", () => {
    vi.useFakeTimers();
    try {
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

      vi.advanceTimersByTime(2);
      expect(downloadCallCount).toBe(1);
      expect(q.previewValue.length).toBe(1);
      expect(q.previewValue).toEqualValues([downloadedFile]);
    } finally {
      vi.useRealTimers();
    }
  });

  test("preview item index on last file removed", () => {
    const survey = new SurveyModel({
      elements: [
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
    expect(q.indexToShow, "Start from 0").toBe(0);
    const fileIndexAction = q.fileNavigator.getActionById("fileIndex");
    expect(fileIndexAction.title, "Initial title").toBe("1 of 3");
    const prevFileAction = q.fileNavigator.getActionById("prevPage");
    prevFileAction.action();
    expect(q.indexToShow, "We're on 3rd image").toBe(2);
    expect(fileIndexAction.title, "We're on the last item").toBe("3 of 3");
    q.doRemoveFile(q.value[2], { stopPropagation: () => {} });
    expect(q.indexToShow, "We're on 2nd image").toBe(1);
    expect(fileIndexAction.title, "We're on the last item again").toBe("2 of 2");
  });

  test("QuestionFile upload state sequence", () => {
    var json = {
      elements: [
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

    expect(q1.isEmpty()).toBeTruthy();
    expect(q1.value).toBeUndefined();
    expect(state).toBe("");

    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);

    expect(q1.isEmpty()).toBeFalsy();
    expect(q1.value.length).toBe(1);
    expect(q1.value[0].content).toBe("f1_url");
    expect(state).toBe("->loading->loaded");

    q1.clear();
    expect(state).toBe("->loading->loaded->empty");
  });

  test("Check assign data and upload state", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "file",
          name: "file1",
        }
      ],
    });
    var q: QuestionFileModel = <QuestionFileModel>survey.getQuestionByName("file1");

    expect(q.currentState, "Initial state is empty").toBe("empty");

    q.value = [{
      content: "file1",
      name: "file1.png",
      type: "image/png"
    }];
    expect(q.currentState, "The loaded state after data assigned").toBe("loaded");
  });

  test("Check download file event", () => {
    const survey = new SurveyModel({
      elements: [
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

    expect(q.currentState, "Initial state is empty").toBe("empty");

    survey.data = {
      "file1": [{
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
      }]
    };
    expect(log, "Every file should be loaded only once").toBe("->file1.png->file2.png->file3.png");
    expect(q.value.length, "Question value contains 3 files").toBe(3);
    expect(q.currentState, "The loaded state after data assigned").toBe("loaded");
  });

  test("Check isReady flag with onDownloadFile callback", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "file",
          name: "file1",
          storeDataAsText: false,
        }
      ],
    });
    const question = survey.getAllQuestions()[0];
    let log = "";
    const callbacks = new Array<any>();
    const contents = new Array<string>();
    survey.onDownloadFile.add((survey, options) => {
      expect(options.question.isReady).toBe(false);
      contents.push(options.content.replace("url", "content"));
      callbacks.push(options.callback);
      log += "->" + options.fileValue.name;
    });
    const readyLogs = new Array<boolean>();
    question.onReadyChanged.add(() => {
      readyLogs.push(question.isReady);
    });
    survey.data = {
      "file1": [{
        content: "url1",
        name: "file1.png",
        type: "image/png"
      }, {
        content: "url2",
        name: "file2.png",
        type: "image/png"
      }]
    };
    expect(question.isReady, "question is not ready").toBe(false);
    expect(log).toBe("->file1.png->file2.png");
    expect(callbacks.length, "Two callbacks").toBe(2);
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i]("success", contents[i]);
    }
    expect(question.isReady, "question is ready").toBe(true);
    expect(question.previewValue).toEqualValues([{
      content: "content1",
      name: "file1.png",
      type: "image/png"
    }, {
      content: "content2",
      name: "file2.png",
      type: "image/png"
    }]);
    expect(readyLogs.length, "readyLogs.length").toBe(2);
    expect(readyLogs[0], "readyLogs[0]").toBe(false);
    expect(readyLogs[1], "readyLogs[1]").toBe(true);
  });

  test("QuestionFile remove file by preview value", () => {
    var json = {
      elements: [
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

    expect(q1.previewValue.length).toEqualValues(2);
    q1.doRemoveFile(q1.previewValue[1], { stopPropagation: () => {} });

    expect(q1.previewValue.length).toEqualValues(1);
    expect(survey.data).toEqualValues({
      image1: [{ name: "f1", content: "data" }],
    });
  });

  test("QuestionFile download file content on preview, #1", () => {
    var json = {
      showPreviewBeforeComplete: true,
      previewMode: "answeredQuestions",
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
    expect(q1.storeDataAsText).toBeFalsy();

    survey.data = {
      file: [{ name: "f1", content: "data" }],
    };

    expect(downloadLog).toBe("->f1");

    survey.showPreview();
    const q2: QuestionFileModel = <any>survey.getQuestionByName("file");
    expect(q2.storeDataAsText).toBeFalsy();

    expect(downloadLog).toBe("->f1");
  });

  test("Check previewValue order is correct", () => {
    vi.useFakeTimers();
    try {
      const json = {
        showPreviewBeforeComplete: true,
        previewMode: "answeredQuestions",
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
      vi.advanceTimersByTime(100);
      expect(question.previewValue.map(val => val.name)).toEqualValues(["f1", "f2", "f3"]);
    } finally {
      vi.useRealTimers();
    }
  });

  test("File Question on Smaller Screens: navigation bar doesn't appear when the survey.onDownloadFile event is used", () => {
    vi.useFakeTimers();
    try {
      const json = {
        showPreviewBeforeComplete: true,
        previewMode: "answeredQuestions",
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
      survey.css = defaultCss;
      question.isMobile = true;
      question.pageSize = 1;
      expect(question.indexToShow).toBe(0);
      const fileIndexAction = question.fileNavigator.getActionById("fileIndex");
      expect(fileIndexAction.title).toBe("1 of 0");
      expect(question.containsMultiplyFiles).toBe(false);
      expect(question.fileNavigatorVisible).toBe(false);

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
      vi.advanceTimersByTime(100);
      expect(question.previewValue.map(val => val.name)).toEqualValues(["f1", "f2", "f3"]);
      expect(question.indexToShow).toBe(0);
      expect(fileIndexAction.title).toBe("1 of 3");
      expect(question.containsMultiplyFiles).toBe(true);
      expect(question.fileNavigatorVisible).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  test("Check file question navigator with different items count visible", () => {
    const json = {
      showPreviewBeforeComplete: true,
      previewMode: "answeredQuestions",
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
    survey.css = defaultCss;
    question.pageSize = 3;
    const fileIndexAction = question.fileNavigator.getActionById("fileIndex");
    const nextFileAction = question.fileNavigator.getActionById("nextPage");
    const prevFileAction = question.fileNavigator.getActionById("prevPage");
    expect(question.indexToShow).toBe(0);
    expect(fileIndexAction.title).toBe("1 of 0");
    expect(question.containsMultiplyFiles).toBe(false);
    expect(question.fileNavigatorVisible).toBe(false);
    survey.onUploadFiles.add((survey, options) => {
      options.callback(
        "success",
        options.files.map((file) => {
          return { file: file, content: file.name + "_url" };
        })
      );
    });
    question.loadFiles([{ name: "f1", type: "t1" } as any]);
    expect(question.fileNavigatorVisible).toBe(false);
    question.loadFiles([{ name: "f2", type: "t2" } as any]);
    expect(question.fileNavigatorVisible).toBe(false);
    question.loadFiles([{ name: "f3", type: "t3" } as any]);
    expect(question.fileNavigatorVisible).toBe(false);
    question.loadFiles([{ name: "f4", type: "t4" } as any]);
    expect(question.fileNavigatorVisible).toBe(true);
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    expect(question.pages.length).toBe(2);
    expect(question.pages[0].items.length).toBe(3);
    expect(question.pages[1].items.length).toBe(1);
    prevFileAction.action();
    expect(question.indexToShow).toBe(0);
    expect(fileIndexAction.title).toBe("1 of 2");
    expect(question.pages[0].css).toBe("sd-file__page");
    expect(question.pages[1].css).toBe("sd-file__page");
    nextFileAction.action();
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    expect(question.pages[0].css).toBe("sd-file__page");
    expect(question.pages[1].css).toBe("sd-file__page");
    nextFileAction.action();
    expect(question.indexToShow).toBe(0);
    expect(fileIndexAction.title).toBe("1 of 2");
    expect(question.pages[0].css).toBe("sd-file__page");
    expect(question.pages[1].css).toBe("sd-file__page");
    prevFileAction.action();
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");

    expect(question.pages[0].css).toBe("sd-file__page");
    expect(question.pages[1].css).toBe("sd-file__page");

    //check index position on load files
    question.loadFiles([{ name: "f5", type: "t5" } as any, { name: "f6", type: "t6" } as any]);
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    question.loadFiles([{ name: "f7", type: "t7" } as any, { name: "f8", type: "t8" } as any]);
    expect(question.indexToShow).toBe(2);
    expect(fileIndexAction.title).toBe("3 of 3");
    //check index position on deleting files
    question.removeFile(question.previewValue[7].name);
    expect(question.indexToShow).toBe(2);
    expect(fileIndexAction.title).toBe("3 of 3");
    question.removeFile(question.previewValue[6].name);
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    question.removeFile(question.previewValue[5].name);
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    question.removeFile(question.previewValue[4].name);
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    //check index position change on itemsCountToShow change
    question.pageSize = 2;
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 2");
    expect(question.pages.length).toBe(2);
    expect(question.pages[0].items.length).toBe(2);
    expect(question.pages[1].items.length).toBe(2);
    question.pageSize = 1;
    expect(question.indexToShow).toBe(1);
    expect(fileIndexAction.title).toBe("2 of 4");
    expect(question.pages.length).toBe(4);
    expect(question.pages[0].items.length).toBe(1);
    expect(question.pages[1].items.length).toBe(1);
    expect(question.pages[2].items.length).toBe(1);
    expect(question.pages[3].items.length).toBe(1);
  });
  test("Check file question processResponsiveness method", () => {
    const json = {
      showPreviewBeforeComplete: true,
      previewMode: "answeredQuestions",
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
    survey.css = defaultCss;
    question["calculatedGapBetweenItems"] = 32;
    question["calculatedItemWidth"] = 96;
    question["processResponsiveness"](0, 400);
    expect(question.pageSize).toBe(3);

    question["calculatedGapBetweenItems"] = 32;
    question["calculatedItemWidth"] = 96;
    question["processResponsiveness"](0, 250);
    expect(question.pageSize).toBe(2);

    question["calculatedGapBetweenItems"] = 32;
    question["calculatedItemWidth"] = 50;
    question["processResponsiveness"](0, 250);
    expect(question.pageSize).toBe(3);

    question["calculatedGapBetweenItems"] = 8;
    question["calculatedItemWidth"] = 50;
    question["processResponsiveness"](0, 250);
    expect(question.pageSize).toBe(4);

    question["calculatedGapBetweenItems"] = 8;
    question["calculatedItemWidth"] = 50;
    question["processResponsiveness"](0, 58);
    expect(question.pageSize).toBe(1);

    question["calculatedGapBetweenItems"] = 8;
    question["calculatedItemWidth"] = 50;
    question["processResponsiveness"](0, 40);
    expect(question.pageSize).toBe(1);
  });

  test("QuestionFile download file content on preview, #2", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1" },
        { type: "file", name: "q2", readOnly: true }
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    const q2 = <QuestionFileModel>survey.getQuestionByName("q2");
    expect(q1.locRenderedPlaceholder.renderedHtml.substring(0, 4), "q1 => drag").toBe("Drag");
    expect(q2.locRenderedPlaceholder.renderedHtml.substring(0, 2), "q2 => no file").toBe("No");
    q1.readOnly = true;
    q2.readOnly = false;
    expect(q1.locRenderedPlaceholder.renderedHtml.substring(0, 2), "q1, readOnly => no file").toBe("No");
    expect(q2.locRenderedPlaceholder.renderedHtml.substring(0, 4), "q2, not readOnly=> drag").toBe("Drag");
  });

  test("QuestionFile current mode property, camera is not available", () => {
    const callbacks = new Array<(devices: Array<MediaDeviceInfo>) => void>();
    Camera.mediaDevicesCallback = (cb: (devices: Array<MediaDeviceInfo>) => void): void => {
      callbacks.push(cb);
    };
    Camera.clear();
    let survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1" },
        { type: "file", name: "q2", sourceType: "file" },
        { type: "file", name: "q3", sourceType: "camera" },
        { type: "file", name: "q4", sourceType: "file-camera" },
      ]
    });
    expect(survey.getQuestionByName("q1").currentMode, "#1.1").toBe("file");
    expect(survey.getQuestionByName("q2").currentMode, "#1.2").toBe("file");
    expect(survey.getQuestionByName("q3").currentMode, "#1.3").toBe("camera");
    expect(survey.getQuestionByName("q4").currentMode, "#1.4").toBe("file-camera");
    expect(callbacks.length > 0, "callbacks are set").toBeTruthy();
    callbacks.forEach(cb => cb([]));
    expect(survey.getQuestionByName("q1").currentMode, "#1").toBe("file");
    expect(survey.getQuestionByName("q2").currentMode, "#2").toBe("file");
    expect(survey.getQuestionByName("q3").currentMode, "#3").toBe("file");
    expect(survey.getQuestionByName("q4").currentMode, "#4").toBe("file");
    callbacks.splice(0, callbacks.length);
    survey.getQuestionByName("q1").sourceType = "camera";
    expect(survey.getQuestionByName("q1").currentMode, "#5").toBe("file");
    callbacks.forEach(cb => cb([]));
    expect(survey.getQuestionByName("q1").currentMode, "#6").toBe("file");
    Camera.mediaDevicesCallback = undefined;
  });
  function createDevices(info: Array<any>): Array<MediaDeviceInfo> {
    const res = new Array<MediaDeviceInfo>();
    let id = 1;
    info.forEach(i => {
      res.push({ kind: "videoinput", deviceId: id.toString(), groupId: "group1", label: i.label, toJSON: (): any => { } });
      id++;
    });
    return res;
  }
  test("QuestionFile current mode property, camera is available", () => {
    const callbacks = new Array<(devices: Array<MediaDeviceInfo>) => void>();
    Camera.mediaDevicesCallback = (cb: (devices: Array<MediaDeviceInfo>) => void): void => {
      callbacks.push(cb);
    };
    Camera.clear();
    const devices = createDevices([{ label: "user" }]);
    let survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1" },
        { type: "file", name: "q2", sourceType: "file" },
        { type: "file", name: "q3", sourceType: "camera" },
        { type: "file", name: "q4", sourceType: "file-camera" },
      ]
    });
    expect(survey.getQuestionByName("q1").currentMode, "1.1").toBe("file");
    expect(survey.getQuestionByName("q2").currentMode, "1.2").toBe("file");
    expect(survey.getQuestionByName("q3").currentMode, "1.3").toBe("camera");
    expect(survey.getQuestionByName("q4").currentMode, "1.4").toBe("file-camera");
    expect(callbacks.length > 0, "callbacks are set").toBeTruthy();

    callbacks.forEach(cb => cb(devices));
    expect(survey.getQuestionByName("q1").currentMode, "#1").toBe("file");
    expect(survey.getQuestionByName("q2").currentMode, "#2").toBe("file");
    expect(survey.getQuestionByName("q3").currentMode, "#3").toBe("camera");
    expect(survey.getQuestionByName("q4").currentMode, "#4").toBe("file-camera");
    callbacks.splice(0, callbacks.length);
    survey.getQuestionByName("q1").sourceType = "camera";
    expect(survey.getQuestionByName("q1").currentMode, "#5").toBe("camera");
    callbacks.forEach(cb => cb(devices));
    expect(survey.getQuestionByName("q1").currentMode, "#6").toBe("camera");
    Camera.mediaDevicesCallback = undefined;
  });
  test("QuestionFile check file actions visibility when camera is available from start point", () => {
    Camera.setCameraList(<any>[{ label: "test" }]);
    let survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1", sourceType: "camera" },
        { type: "file", name: "q2", sourceType: "file" },
        { type: "file", name: "q3", sourceType: "file-camera" }
      ]
    });
    expect(survey.getQuestionByName("q1").currentMode).toBe("camera");
    expect(survey.getQuestionByName("q1").actionsContainer.actions[0].visible).toBeFalsy();
    expect(survey.getQuestionByName("q1").actionsContainer.actions[1].visible).toBeTruthy();

    expect(survey.getQuestionByName("q2").currentMode).toBe("file");
    expect(survey.getQuestionByName("q2").actionsContainer.actions[0].visible).toBeTruthy();
    expect(survey.getQuestionByName("q2").actionsContainer.actions[1].visible).toBeFalsy();

    expect(survey.getQuestionByName("q3").currentMode).toBe("file-camera");
    expect(survey.getQuestionByName("q3").actionsContainer.actions[0].visible).toBeTruthy();
    expect(survey.getQuestionByName("q3").actionsContainer.actions[1].visible).toBeTruthy();
    Camera.clear();
  });
  test("new Camera().getMediaConstraints", () => {
    Camera.setCameraList(createDevices([{ label: "dfdf" }, { label: "user" }]));
    let mConst: any = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Device is correct").toBe("2");
    Camera.setCameraList(createDevices([{ label: "abd" }, { label: "environment" }, { label: "user" }]));
    mConst = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Device is correct").toBe("3");
    Camera.setCameraList(createDevices([{ label: "dfdf" }, { label: "environment" }]));
    mConst = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Device is correct").toBe("2");
    Camera.clear();
  });
  test("new Camera().flip", () => {
    expect(new Camera().canFlip(), "There is no devices").toBe(false);
    Camera.setCameraList(createDevices([{ label: "abd" }]));
    expect(new Camera().canFlip(), "There is one device").toBe(false);
    Camera.setCameraList(createDevices([{ label: "abd" }, { label: "environment" }, { label: "user" }]));
    expect(new Camera().canFlip(), "There are 3 devices").toBe(true);
    let mConst: any = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Device is correct").toBe("3");
    new Camera().flip();
    mConst = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Flip #1").toBe("2");
    new Camera().flip();
    mConst = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Flip #2").toBe("1");
    new Camera().flip();
    mConst = new Camera().getMediaConstraints();
    expect(mConst.video.deviceId.exact, "Flip #2").toBe("3");
    Camera.clear();
  });
  test("Check file question change camera action", () => {
    let survey = new SurveyModel({
      elements: [{ type: "file", name: "q1" }]
    });
    let q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    const changeCameraAction = q1.changeCameraAction;
    q1.setPropertyValue("isPlayingVideo", true);
    expect(changeCameraAction.visible).toBeFalsy();
    Camera.setCameraList(createDevices([{ label: "abd" }, { label: "environment" }, { label: "user" }]));
    expect(changeCameraAction.visible).toBeFalsy();
    q1["camera"]["updateCanFlipValue"]();
    expect(changeCameraAction.visible).toBeTruthy();
    Camera["cameraIndex"] = 0;
    q1["camera"].flip();
    expect(Camera["cameraIndex"]).toBe(1);
    q1["camera"].flip();
    expect(Camera["cameraIndex"]).toBe(2);
    q1["camera"].flip();
    expect(Camera["cameraIndex"]).toBe(0);

    Camera.setCameraList(createDevices([{ label: "environment" }]));
    q1["camera"]["updateCanFlipValue"]();
    expect(changeCameraAction.visible).toBeFalsy();
    Camera["canSwitchFacingMode"] = true;
    q1["camera"]["updateCanFlipValue"]();
    expect(changeCameraAction.visible).toBeTruthy();
    expect(Camera["cameraFacingMode"]).toBe("user");
    q1["camera"].flip();
    expect(Camera["cameraFacingMode"]).toBe("environment");
    q1["camera"].flip();
    expect(Camera["cameraFacingMode"]).toBe("user");
    Camera.clear();
  });
  test("new Camera().getMediaConstraints width and height", () => {
    Camera.setCameraList(createDevices([{ label: "dfdf" }, { label: "user" }]));
    let mConst: any = new Camera().getMediaConstraints();
    expect(mConst.video.width).toBe(undefined);
    expect(mConst.video.height).toBe(undefined);
    mConst = new Camera().getMediaConstraints({ width: 100 });
    expect(mConst.video.width).toEqualValues({ ideal: 100 });
    expect(mConst.video.height).toBe(undefined);
    mConst = new Camera().getMediaConstraints({ height: 100 });
    expect(mConst.video.width).toBe(undefined);
    expect(mConst.video.height).toEqualValues({ ideal: 100 });
    mConst = new Camera().getMediaConstraints({ height: 100, width: 200 });
    expect(mConst.video.width).toEqualValues({ ideal: 200 });
    expect(mConst.video.height).toEqualValues({ ideal: 100 });
    Camera.clear();
  });
  test("Camera: check getImageSize method", () => {
    let imageSize = new Camera().getImageSize({ videoWidth: 100, videoHeight: 200 } as any);
    expect(imageSize).toEqualValues({ width: 100, height: 200 });
    imageSize = new Camera().getImageSize({ videoWidth: 130, videoHeight: 250 } as any);
    expect(imageSize).toEqualValues({ width: 130, height: 250 });
  });
  test("QuestionFile stop playing video on hiding question", () => {
    let survey = new SurveyModel({
      elements: [{ type: "file", name: "q1" }]
    });
    let q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    q1.setPropertyValue("isPlayingVideo", true);
    expect(q1.isPlayingVideo).toBe(true);
    q1.visible = false;
    expect(q1.isPlayingVideo, "question invisible").toBe(false);
    q1.visible = true;
    q1.setPropertyValue("isPlayingVideo", true);
    q1.collapse();
    expect(q1.isPlayingVideo, "question content is collapsed").toBe(false);
    survey = new SurveyModel({
      elements: [
        {
          type: "panel", name: "panel1",
          elements: [{ type: "file", name: "q1" }]
        }
      ]
    });
    let panel = survey.getPanelByName("panel1");
    q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    q1.setPropertyValue("isPlayingVideo", true);
    expect(q1.isPlayingVideo).toBe(true);
    panel.visible = false;
    expect(q1.isPlayingVideo, "panel invisible").toBe(false);
    q1.setPropertyValue("isPlayingVideo", true);
    panel.collapse();
    expect(q1.isPlayingVideo, "panel content is collapsed").toBe(false);
  });
  test("QuestionFile stop playing video on going to another page or complete", () => {
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
    expect(q1.isPlayingVideo).toBe(true);
    survey.nextPage();
    expect(q1.isPlayingVideo, "Go to next page").toBe(false);

    survey.currentPageNo = 1;
    q1.setPropertyValue("isPlayingVideo", true);
    expect(q1.isPlayingVideo).toBe(true);
    survey.currentPageNo = 0;
    expect(q1.isPlayingVideo, "Go to prev page").toBe(false);

    survey.pages[2].visible = false;
    survey.currentPageNo = 1;
    q1.setPropertyValue("isPlayingVideo", true);
    expect(q1.isPlayingVideo).toBe(true);
    survey.doComplete();
    expect(q1.isPlayingVideo, "complete survey").toBe(false);
  });
  test("QuestionFile stop playing video when question's html element is destroyed", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "text", name: "q2" }] },
        { elements: [{ type: "file", name: "q1" }] },
        { elements: [{ type: "text", name: "q3" }] }
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");

    q1.setPropertyValue("isPlayingVideo", true);
    expect(q1.isPlayingVideo).toBe(true);
    q1.beforeDestroyQuestionElement(null as any);
    survey.nextPage();
    expect(q1.isPlayingVideo).toBe(false);
  });

  test("QuestionFile check actions container", () => {
    const survey = new SurveyModel({
      pages: [
        { elements: [{ type: "file", name: "q1", sourceType: "file" }] }
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    q1.chooseButtonCaption = "choose_test";
    q1.takePhotoCaption = "take_picture_test";
    q1.clearButtonCaption = "clear_test";
    survey.css = defaultCss;
    expect(q1.actionsContainerVisible).toBeTruthy();
    q1.isUploading = true;
    expect(q1.actionsContainerVisible).toBeFalsy();
    q1.isUploading = false;
    q1.setPropertyValue("isPlayingVideo", true);
    expect(q1.actionsContainerVisible).toBeFalsy();
    q1.setPropertyValue("isPlayingVideo", false);
    expect(q1.actionsContainerVisible).toBeTruthy();
    const chooseFileAction = q1.actionsContainer.getActionById("sv-file-choose-file");
    const startCameraAction = q1.actionsContainer.getActionById("sv-file-start-camera");
    const cleanAction = q1.actionsContainer.getActionById("sv-file-clean");
    expect(startCameraAction.title).toBe("take_picture_test");
    expect(cleanAction.title).toBe("clear_test");
    expect(chooseFileAction.visible).toBeTruthy();
    expect(startCameraAction.visible).toBeFalsy();
    expect(cleanAction.visible).toBeFalsy();
    expect(startCameraAction.showTitle).toBeTruthy();
    q1.setPropertyValue("currentMode", "camera");
    expect(chooseFileAction.visible).toBeFalsy();
    expect(startCameraAction.visible).toBeTruthy();
    expect(cleanAction.visible).toBeFalsy();
    q1.setPropertyValue("currentMode", "file-camera");
    expect(chooseFileAction.visible).toBeTruthy();
    expect(startCameraAction.visible).toBeTruthy();
    expect(cleanAction.visible).toBeFalsy();
    q1.setPropertyValue("isAnswered", true);
    expect(chooseFileAction.visible).toBeTruthy();
    expect(startCameraAction.visible).toBeTruthy();
    expect(cleanAction.visible).toBeTruthy();
    expect(startCameraAction.showTitle).toBeFalsy();
  });

  test("QuestionFile check renderedPlaceholder in different modes", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1" },
      ]
    });

    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    q1.filePlaceholder = "file_mod_placeholder";
    q1.photoPlaceholder = "camera_mod_placeholder";
    q1.fileOrPhotoPlaceholder = "both_mod_placeholder";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("file_mod_placeholder");
    q1.setPropertyValue("currentMode", "camera");
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("camera_mod_placeholder");
    q1.setPropertyValue("currentMode", "file-camera");
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("both_mod_placeholder");
  });

  test("QuestionFile check renderedPlaceholder in different modes when camera is not available", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1" },
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    q1.filePlaceholder = "file_mod_placeholder";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("file_mod_placeholder");
    q1.sourceType = "camera";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("file_mod_placeholder");
    q1.sourceType = "file-camera";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("file_mod_placeholder");
  });

  test("QuestionFile check renderedPlaceholder in different modes with design mode", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1" },
      ]
    });
    survey.setDesignMode(true);
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    q1.filePlaceholder = "file_mod_placeholder";
    q1.photoPlaceholder = "camera_mod_placeholder";
    q1.fileOrPhotoPlaceholder = "both_mod_placeholder";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("file_mod_placeholder");
    q1.sourceType = "camera";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("camera_mod_placeholder");
    q1.sourceType = "file-camera";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("both_mod_placeholder");
  });

  test("QuestionFile actions visibility in design mode", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.setJsonObject({
      elements: [
        { type: "file", name: "q1" },
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    const chooseFileAction = q1.actionsContainer.getActionById("sv-file-choose-file");
    const startCameraAction = q1.actionsContainer.getActionById("sv-file-start-camera");
    expect(chooseFileAction.visible).toBeTruthy();
    expect(startCameraAction.visible).toBeFalsy();
    q1.sourceType = "camera";
    expect(chooseFileAction.visible).toBeFalsy();
    expect(startCameraAction.visible).toBeTruthy();
    q1.sourceType = "file-camera";
    expect(chooseFileAction.visible).toBeTruthy();
    expect(startCameraAction.visible).toBeTruthy();
  });

  test("QuestionFile actions are readOnly in design mode", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.setJsonObject({
      elements: [
        { type: "file", name: "q1" },
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    const startCameraAction = q1.actionsContainer.getActionById("sv-file-start-camera");
    const cleanAction = q1.actionsContainer.getActionById("sv-file-clean");
    expect(startCameraAction.enabled).toBeFalsy();
    expect(cleanAction.enabled).toBeFalsy();
  });

  test("QuestionFile actions in readOnly mode", () => {
    const survey = new SurveyModel();
    survey.setJsonObject({
      elements: [
        { type: "file", name: "q1" },
      ]
    });
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    const cleanAction = q1.actionsContainer.getActionById("sv-file-clean");
    const startCameraAction = q1.actionsContainer.getActionById("sv-file-start-camera");
    expect(cleanAction.disabled).toBeFalsy();
    expect(startCameraAction.disabled).toBeFalsy();
    q1.readOnly = true;
    expect(cleanAction.disabled).toBeTruthy();
    expect(startCameraAction.disabled).toBeTruthy();
  });

  test("QuestionFile check placeholders are serializable", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "file",
          name: "q1",
          filePlaceholder: "file_mod_placeholder",
          photoPlaceholder: "camera_mod_placeholder",
          fileOrPhotoPlaceholder: "both_mod_placeholder"
        },
      ]
    });
    survey.setDesignMode(true);
    const q1 = <QuestionFileModel>survey.getQuestionByName("q1");
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("file_mod_placeholder");
    q1.sourceType = "camera";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("camera_mod_placeholder");
    q1.sourceType = "file-camera";
    expect(q1.locRenderedPlaceholder.renderedHtml).toBe("both_mod_placeholder");
  });
  test("QuestionFile allowImagesPreview and allowCameraAccess", () => {
    const prop1 = Serializer.getProperty("file", "allowImagesPreview");
    expect(Serializer.getProperty("file", "showPreview").getDependedProperties()).toEqualValues([prop1.name]);
    const q1 = new QuestionFileModel("q1");
    q1.showPreview = true;
    expect(prop1.isVisible(undefined, q1)).toBe(true);
    q1.showPreview = false;
    expect(prop1.isVisible(undefined, q1)).toBe(false);
    const prop2 = Serializer.getProperty("file", "allowCameraAccess");
    expect(prop2.visible).toBe(false);
  });

  test("QuestionFile maxSize error doesnt update question css classes", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1", maxSize: 3 },
      ]
    });
    survey.css = {
      question: {
        hasError: "root-error",
        hasErrorTop: "root-error-top"
      }
    };
    const question = survey.getAllQuestions()[0];
    expect(question.cssRoot.includes("root-error")).toBeFalsy();
    expect(question.cssRoot.includes("root-error-top")).toBeFalsy();
    question["allFilesOk"]([{ size: 2 }]);
    expect(question.cssRoot.includes("root-error")).toBeFalsy();
    expect(question.cssRoot.includes("root-error-top")).toBeFalsy();
    question["allFilesOk"]([{ size: 4 }]);
    expect(question.cssRoot.includes("root-error")).toBeTruthy();
    expect(question.cssRoot.includes("root-error-top")).toBeTruthy();
  });

  test("QuestionFile process errors with partially loaded files", async () => {
    var json = {
      elements: [
        {
          type: "file",
          name: "image1",
          storeDataAsText: false,
          showPreview: true,
          allowMultiple: true
        },
      ],
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    survey.onUploadFiles.add((survey, options) => {
      options.callback(
        options.files.map((file) => {
          return { file: file, content: file.name + "_url" };
        }),
        ["custom error text"]
      );
    });

    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);

    expect(q1.errors.length, "Has errors").toBe(1);
    expect(q1.errors[0].text, "Error text").toBe("custom error text");
    expect(q1.isEmpty()).toBeFalsy();
    expect(q1.value.length).toBe(1);
    expect(q1.value[0].content).toBe("f1_url");
  });

  test("Acton takePhoto should be localized", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1", maxSize: 3 },
      ]
    });
    const question = <QuestionFileModel>survey.getAllQuestions()[0];
    expect(question.takePictureAction.title, "en").toBe("Take Photo");
    const startCameraAction = question.actionsContainer.getActionById("sv-file-start-camera");
    const cleanAction = question.actionsContainer.getActionById("sv-file-clean");
    expect(startCameraAction.title, "en").toBe("Take Photo");
    expect(cleanAction.title, "en").toBe("Clear");
    survey.locale = "de";
    expect(question.takePictureAction.title, "de").toBe("Foto machen");
    expect(startCameraAction.title, "de").toBe("Foto machen");
    expect(cleanAction.title, "de").toBe("Auswahl entfernen");
  });

  test("Choose file action should have disabled class", () => {
    const survey = new SurveyModel({
      readOnly: true,
      elements: [
        { type: "file", name: "q1", maxSize: 3 },
      ]
    });
    survey.css = defaultCss;
    const question = <QuestionFileModel>survey.getAllQuestions()[0];
    expect(question.getChooseFileCss(), "Disabled").toBe("sd-file__choose-btn sd-file__choose-file-btn--disabled sd-action sd-file__choose-btn--text sd-action--disabled");
    survey.readOnly = false;
    expect(question.getChooseFileCss(), "Enabled").toBe("sd-file__choose-btn sd-action sd-file__choose-btn--text");
    survey.readOnly = true;
    expect(question.getChooseFileCss(), "Disabled").toBe("sd-file__choose-btn sd-file__choose-file-btn--disabled sd-action sd-file__choose-btn--text sd-action--disabled");
  });

  test("Bug #8242: currentMode is set incorrectly when file question is located inside matrixdynamic", () => {
    Camera.setCameraList(<any>[{ label: "test" }]);
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "question1",
              "columns": [
                {
                  "name": "col1",
                  "cellType": "file",
                  "sourceType": "file-camera"
                }
              ],
              "rowCount": 1
            }
          ]
        }
      ]
    });
    survey.css = defaultCss;
    const getFileQuestionFromRow = (rowIndex: number) => {
      return <QuestionFileModel>question.renderedTable.rows[rowIndex * 2 + 1].cells[0].cell.question;
    };
    const question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    expect(getFileQuestionFromRow(0).currentMode).toBe("file-camera");
    expect(getFileQuestionFromRow(0).actionsContainer.getActionById("sv-file-start-camera").visible).toBeTruthy();
    question.addRowUI();
    expect(getFileQuestionFromRow(1).currentMode).toBe("file-camera");
    expect(getFileQuestionFromRow(1).actionsContainer.getActionById("sv-file-start-camera").visible).toBeTruthy();
    question.addRowUI();
    expect(getFileQuestionFromRow(2).currentMode).toBe("file-camera");
    expect(getFileQuestionFromRow(2).actionsContainer.getActionById("sv-file-start-camera").visible).toBeTruthy();
    Camera.clear();
  });

  test("Bug #8242: currentMode is set incorrectly when file question is located inside matrixdynamic", () => {
    Camera.setCameraList(<any>[{ label: "test" }]);
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "question1",
              "columns": [
                {
                  "name": "col1",
                  "cellType": "file",
                  "sourceType": "file-camera"
                }
              ],
              "rowCount": 1
            }
          ]
        }
      ]
    });
    survey.css = defaultCss;
    const getFileQuestionFromRow = (rowIndex: number) => {
      return <QuestionFileModel>question.renderedTable.rows[rowIndex * 2 + 1].cells[0].cell.question;
    };
    const question = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    expect(getFileQuestionFromRow(0).currentMode).toBe("file-camera");
    expect(getFileQuestionFromRow(0).actionsContainer.getActionById("sv-file-start-camera").visible).toBeTruthy();
    question.addRowUI();
    expect(getFileQuestionFromRow(1).currentMode).toBe("file-camera");
    expect(getFileQuestionFromRow(1).actionsContainer.getActionById("sv-file-start-camera").visible).toBeTruthy();
    question.addRowUI();
    expect(getFileQuestionFromRow(2).currentMode).toBe("file-camera");
    expect(getFileQuestionFromRow(2).actionsContainer.getActionById("sv-file-start-camera").visible).toBeTruthy();
    Camera.clear();
  });

  test("Check renderedPages property", () => {
    var json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          title: "Please upload your photo 1",
          name: "image1",
          storeDataAsText: false,
          showPreview: true,
        },
      ],
    };

    const survey = new SurveyModel(json);
    const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    q1.pageSize = 1;
    survey.onDownloadFile.add((survey, options) => {
      options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
    });
    survey.data = {
      image1: { name: "item1" },
    };
    expect(q1.pages.length).toBe(1);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item1");

    survey.data = {
      image1: [{ name: "item1" }, { name: "item2" }, { name: "item3" }],
    };
    q1.indexToShow = 0;
    expect(q1.pages.length).toBe(3);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item1");

    expect(q1.pages[1].items.length).toBe(1);
    expect(q1.pages[1].items[0].name).toBe("item2");

    expect(q1.pages[2].items.length).toBe(1);
    expect(q1.pages[2].items[0].name).toBe("item3");

    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item1");
    const prevFileAction = q1.fileNavigator.getActionById("prevPage");
    prevFileAction.action();
    expect(q1.navigationDirection).toBe("left");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item3");

    const nextFileAction = q1.fileNavigator.getActionById("nextPage");
    nextFileAction.action();
    expect(q1.navigationDirection).toBe("right");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item1");

    nextFileAction.action();
    expect(q1.navigationDirection).toBe("right");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item2");

    prevFileAction.action();
    expect(q1.navigationDirection).toBe("left");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item1");

    q1.removeFile("item1");
    expect(q1.navigationDirection).toBeUndefined();
    expect(q1.pages.length).toBe(2);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item2");

    expect(q1.pages[1].items.length).toBe(1);
    expect(q1.pages[1].items[0].name).toBe("item3");

    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item2");

    nextFileAction.action();
    q1.removeFile("item3");
    expect(q1.navigationDirection).toBe("left-delete");
    expect(q1.pages.length).toBe(1);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item2");

    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item2");
  });

  test("Check renderedPages property", () => {
    const json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          title: "Please upload your photo 1",
          name: "image1",
          storeDataAsText: false,
          showPreview: true,
        },
      ],
    };

    const survey = new SurveyModel(json);
    const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    q1.pageSize = 1;
    survey.onDownloadFile.add((survey, options) => {
      options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
    });
    survey.data = {
      image1: { name: "item1" },
    };
    expect(q1.pages.length).toBe(1);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item1");

    survey.data = {
      image1: [{ name: "item1" }, { name: "item2" }, { name: "item3" }],
    };
    q1.indexToShow = 0;
    expect(q1.pages.length).toBe(3);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item1");

    expect(q1.pages[1].items.length).toBe(1);
    expect(q1.pages[1].items[0].name).toBe("item2");

    expect(q1.pages[2].items.length).toBe(1);
    expect(q1.pages[2].items[0].name).toBe("item3");

    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item1");
    const prevFileAction = q1.fileNavigator.getActionById("prevPage");
    prevFileAction.action();
    expect(q1.navigationDirection).toBe("left");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item3");

    const nextFileAction = q1.fileNavigator.getActionById("nextPage");
    nextFileAction.action();
    expect(q1.navigationDirection).toBe("right");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item1");

    nextFileAction.action();
    expect(q1.navigationDirection).toBe("right");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item2");

    prevFileAction.action();
    expect(q1.navigationDirection).toBe("left");
    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item1");

    q1.removeFile("item1");
    expect(q1.navigationDirection).toBeUndefined();
    expect(q1.pages.length).toBe(2);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item2");

    expect(q1.pages[1].items.length).toBe(1);
    expect(q1.pages[1].items[0].name).toBe("item3");

    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item2");

    nextFileAction.action();
    q1.removeFile("item3");
    expect(q1.navigationDirection).toBe("left-delete");
    expect(q1.pages.length).toBe(1);
    expect(q1.pages[0].items.length).toBe(1);
    expect(q1.pages[0].items[0].name).toBe("item2");

    expect(q1.renderedPages.length).toBe(1);
    expect(q1.renderedPages[0].items.length).toBe(1);
    expect(q1.renderedPages[0].items[0].name).toBe("item2");
  });

  test("Check pageAnimationOptions", () => {
    const json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          title: "Please upload your photo 1",
          name: "image1",
          storeDataAsText: false,
          showPreview: true,
        },
      ],
    };

    const survey = new SurveyModel(json);
    survey.css = defaultCss;
    const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    const fpNavigationOptions = q1["getPagesAnimationOptions"]();
    settings.animationEnabled = true;
    survey.data = {
      image1: [{ name: "item1" }, { name: "item2" }, { name: "item3" }],
    };
    q1["rootElement"] = document.createElement("div");

    //check animation enabled
    q1.enableOnElementRerenderedEvent();
    expect(fpNavigationOptions.isAnimationEnabled()).toBeTruthy();
    q1["rootElement"] = undefined as any;
    expect(fpNavigationOptions.isAnimationEnabled()).toBeFalsy();
    q1["rootElement"] = document.createElement("div");
    expect(fpNavigationOptions.isAnimationEnabled()).toBeTruthy();
    settings.animationEnabled = false;
    expect(fpNavigationOptions.isAnimationEnabled()).toBeFalsy();
    settings.animationEnabled = true;
    expect(fpNavigationOptions.isAnimationEnabled()).toBeTruthy();

    //check enter options
    expect(fpNavigationOptions.getEnterOptions(q1.pages[0]).cssClass).toBe("");
    q1.navigationDirection = "left";
    expect(fpNavigationOptions.getEnterOptions(q1.pages[0]).cssClass).toBe("sd-file__page--enter-from-left");
    q1.navigationDirection = "right";
    expect(fpNavigationOptions.getEnterOptions(q1.pages[0]).cssClass).toBe("sd-file__page--enter-from-right");
    q1.navigationDirection = "left-delete";
    expect(fpNavigationOptions.getEnterOptions(q1.pages[0]).cssClass).toBe("sd-file__page--enter-from-left");

    //check leave options

    q1.navigationDirection = undefined as any;
    expect(fpNavigationOptions.getLeaveOptions(q1.pages[0]).cssClass).toBe("");
    q1.navigationDirection = "left-delete";
    expect(fpNavigationOptions.getLeaveOptions(q1.pages[0]).cssClass).toBe("");
    q1.navigationDirection = "left";
    expect(fpNavigationOptions.getLeaveOptions(q1.pages[0]).cssClass).toBe("sd-file__page--leave-to-right");
    q1.navigationDirection = "right";
    expect(fpNavigationOptions.getLeaveOptions(q1.pages[0]).cssClass).toBe("sd-file__page--leave-to-left");

    settings.animationEnabled = false;
  });

  test("QuestionFile remove file by preview value with confirmation", () => {
    var json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          name: "image1",
          showPreview: true,
          needConfirmRemoveFile: true
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

    expect(q1.previewValue.length).toEqualValues(2);
    const oldConfirmActionAsync = settings.confirmActionAsync;
    settings.confirmActionAsync = (m, cb, o) => (cb(true), true);
    try {
      q1.doRemoveFile(q1.previewValue[1], { stopPropagation: () => { } });
    } finally {
      settings.confirmActionAsync = oldConfirmActionAsync;
    }

    expect(q1.previewValue.length).toEqualValues(1);
    expect(survey.data).toEqualValues({
      image1: [{ name: "f1", content: "data" }],
    });
  });

  test("QuestionFile show loading indicator remove file", () => {
    const json = {
      elements: [
        {
          type: "file",
          allowMultiple: true,
          name: "image1",
          showPreview: true,
        },
      ],
    };

    const survey = new SurveyModel(json);
    survey.data = {
      image1: [
        { name: "f1", content: "data" },
        { name: "f2", content: "data" },
        { name: "f3", content: "data" },
      ],
    };
    let callback!: () => void;
    survey.onClearFiles.add((survey, options) => {
      callback = () => {
        options.callback("success");
      };
    });
    const q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    q1.doRemoveFile(q1.previewValue[1], { stopPropagation: () => { } });
    expect(q1.showLoadingIndicator).toBeTruthy();
    expect(q1.value.map(f => f.name)).toEqualValues(["f1", "f2", "f3"]);
    callback();
    expect(q1.value.map(f => f.name)).toEqualValues(["f1", "f3"]);
    expect(q1.showLoadingIndicator).toBeFalsy();
    q1.clear();
    expect(q1.value.map(f => f.name)).toEqualValues(["f1", "f3"]);
    expect(q1.showLoadingIndicator).toBeTruthy();
    callback();
    expect(q1.value.map(f => f.name)).toEqualValues([]);
    expect(q1.showLoadingIndicator).toBeFalsy();
  });

  test("check source type option in onUploadFiles event", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "file",
          name: "q1",
          storeDataAsText: false,
          allowMultiple: true
        },
        {
          type: "signaturepad",
          name: "q2",
          storeDataAsText: false,
        }
      ]
    });
    survey.onOpenFileChooser.add((_, options) => {
      options.callback([{ name: "from_chooser" } as File]);
    });
    let log = "";
    survey.onUploadFiles.add((_, options) => {
      log += `->${options.sourceType}: `;
      options.files.forEach((file) => {
        log += file.name;
      });
    });
    const file = survey.getAllQuestions()[0] as QuestionFileModel;
    const signature = survey.getAllQuestions()[1] as QuestionSignaturePadModel;
    file["cameraValue"] = { snap: (_, callback) => {
      callback(new Blob());
    } } as Camera;

    const root = document.createElement("div");
    const input = document.createElement("input");
    input.id = file.inputId;
    root.appendChild(input);
    file.afterRenderQuestionElement(root);
    file.chooseFile({ preventDefault: () => {}, stopImmediatePropagation: () => {} } as any);
    expect(log).toBe("->file: from_chooser");
    log = "";
    file.setPropertyValue("isPlayingVideo", true);
    file.snapPicture();
    expect(log).toBe("->camera: snap_picture.png");
    log = "";
    signature["signaturePad"] = { toDataURL: () => "data:image/jpeg;base64," };
    signature["valueWasChangedFromLastUpload"] = true;
    signature["element"] = document.createElement("div");
    signature["onBlurCore"]({ relatedTarget: document.createElement("div") });
    expect(log).toBe("->signature: q2.png");
  });
  const documentTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt";
  test("questionFile acceptedCategories property, Issue#10602", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1", acceptedCategories: ["document"] },
        { type: "file", name: "q2", acceptedCategories: ["document"], acceptedTypes: ".pdf,.jpeg" },
        { type: "file", name: "q3", acceptedTypes: ".pdf,.jpeg" },
        { type: "file", name: "q4" }
      ]
    });
    const q1 = survey.getQuestionByName("q1") as QuestionFileModel;
    const q2 = survey.getQuestionByName("q2") as QuestionFileModel;
    const q3 = survey.getQuestionByName("q3") as QuestionFileModel;
    const q4 = survey.getQuestionByName("q4") as QuestionFileModel;
    expect(q1.renderedAcceptedTypes, "#1").toBe(documentTypes);
    expect(q2.renderedAcceptedTypes, "#2").toBe(documentTypes + ",.jpeg");
    expect(q3.renderedAcceptedTypes, "#3").toBe(".pdf,.jpeg");
    expect(q4.renderedAcceptedTypes, "#4").toBe(undefined);

    expect(q1.acceptedCategories.length, "q1 categories count").toBe(1);
    expect(q2.acceptedCategories.length, "q2 categories count").toBe(2);
    expect(q2.acceptedCategories[1], "q2 second category").toBe("custom");
    expect(q3.acceptedCategories.length, "q3 categories count").toBe(1);
    expect(q3.acceptedCategories[0], "q3 first category").toBe("custom");
    expect(q4.acceptedCategories.length, "q4 categories count").toBe(0);
    q4.acceptedTypes = ".doc,.txt";
    expect(q4.acceptedCategories, "q4 categories after setting acceptedTypes").toEqualValues(["custom"]);
    q2.acceptedCategories.push("unknown");
    expect(q2.acceptedCategories, "q2 categories after adding unknown category").toEqualValues(["document", "custom", "unknown"]);
    expect(q2.toJSON(), "q2 json").toEqualValues({ name: "q2", acceptedCategories: ["document"], acceptedTypes: ".pdf,.jpeg" });
    expect(q4.toJSON(), "q4 json").toEqualValues({ name: "q4", acceptedTypes: ".doc,.txt" });
    q2.acceptedCategories.splice(1, 2);
    expect(q2.acceptedCategories, "q2 categories after splicing").toEqualValues(["document"]);
    expect(q2.acceptedTypes, "q2 acceptedTypes after splicing").toBeFalsy();

    q4.acceptedCategories = ["archive"];
    expect(q4.acceptedCategories, "q4 categories after setting archive category").toEqualValues(["archive"]);
    expect(q4.acceptedTypes, "q4 acceptedTypes after setting archive category").toBeUndefined();
  });
  test("questionFile acceptedTypes property as an array, Bug#10627", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1", acceptedCategories: ["document"], acceptedTypes: [".pdf", ".jpeg"] },
        { type: "file", name: "q2", acceptedTypes: [".pdf", ".jpeg"] }
      ]
    });
    const q1 = survey.getQuestionByName("q1") as QuestionFileModel;
    const q2 = survey.getQuestionByName("q2") as QuestionFileModel;
    expect(q1.renderedAcceptedTypes, "#1").toBe(documentTypes + ",.jpeg");
    expect(q2.renderedAcceptedTypes, "#2").toBe(".pdf,.jpeg");
    q2.acceptedTypes = <any>[".doc", ".txt"];
    expect(q2.acceptedCategories, "q2 categories after setting acceptedTypes").toEqualValues(["custom"]);
    expect(q2.toJSON(), "q2 json").toEqualValues({ name: "q2", acceptedTypes: [".doc", ".txt"] });
    expect(q2.renderedAcceptedTypes, "#4").toBe(".doc,.txt");
  });
  test("questionFile acceptedTypes property, could not remove custom, Bug#10647", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "file", name: "q1", acceptedCategories: ["document"], acceptedTypes: ".pdf,.jpeg" },
        { type: "file", name: "q2", acceptedTypes: ".pdf,.jpeg" }
      ]
    });
    const q1 = survey.getQuestionByName("q1") as QuestionFileModel;
    const q2 = survey.getQuestionByName("q2") as QuestionFileModel;
    expect(q1.acceptedCategories, "q1 acceptedCategories, #1").toEqualValues(["document", "custom"]);
    expect(q2.acceptedCategories, "q2 acceptedCategories, #1").toEqualValues(["custom"]);
    q1.acceptedCategories = ["document"];
    q2.acceptedCategories = [];
    expect(q1.acceptedCategories, "q1 acceptedCategories, #2").toEqualValues(["document"]);
    expect(q2.acceptedCategories, "q2 acceptedCategories, #2").toEqualValues([]);
    expect(q1.renderedAcceptedTypes, "q1 renderedAcceptedTypes").toBe(documentTypes);
    expect(q2.renderedAcceptedTypes, "q2 renderedAcceptedTypes").toBeUndefined();
  });
});
