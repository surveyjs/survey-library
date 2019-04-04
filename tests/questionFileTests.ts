import { SurveyModel } from "../src/survey";
import { QuestionFileModel } from "../src/question_file";

export default QUnit.module("Survey");

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
        maxSize: 102400
      },
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 2",
        name: "image2",
        storeDataAsText: true,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");
  survey.onDownloadFile.add((survey, options) => {
    options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
  });

  survey.data = {
    image1: "someId",
    image2: "data:image/jpeg;base64,FILECONTENT"
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
        maxSize: 102400
      },
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 2",
        name: "image2",
        storeDataAsText: true,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");
  survey.onDownloadFile.add((survey, options) => {
    options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
  });

  survey.data = {
    image1: ["someId"],
    image2: ["data:image/jpeg;base64,FILECONTENT"]
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
        maxSize: 102400
      },
      {
        type: "file",
        allowMultiple: true,
        title: "Please upload your photo 2",
        name: "image2",
        storeDataAsText: true,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");
  survey.onDownloadFile.add((survey, options) => {
    if (options.name == "image1") {
      assert.equal(q1.inputTitle, "Loading...");
    }
    if (options.name == "image2") {
      assert.equal(q2.inputTitle, " ");
    }
    options.callback("success", "data:image/jpeg;base64,FILECONTENT1");
  });

  assert.equal(q1.inputTitle, "Choose file(s)...");
  assert.equal(q2.inputTitle, "Choose file(s)...");
  survey.data = {
    image1: [{ content: "someId" }],
    image2: [{ content: "data:image/jpeg;base64,FILECONTENT" }]
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
          maxSize: 102400
        },
        {
          type: "file",
          allowMultiple: true,
          title: "Please upload your photo 2",
          name: "image2",
          storeDataAsText: true,
          showPreview: true,
          imageWidth: 150,
          maxSize: 102400
        }
      ]
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
    var q2: QuestionFileModel = <any>survey.getQuestionByName("image2");

    survey.data = {
      image1: [{ content: "someId" }],
      image2: [{ content: "data:image/jpeg;base64,FILECONTENT" }]
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
        maxSize: 102400
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  var done = assert.async();

  survey.onUploadFiles.add((survey, options) => {
    setTimeout(
      () =>
        options.callback(
          "success",
          options.files.map(file => {
            return { file: file, content: file.name + "_url" };
          })
        ),
      10
    );
  });

  var files: any = [
    { name: "f1", type: "t1" },
    { name: "f2", type: "t2", size: 100000 }
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
        showPreview: true
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");
  survey.data = {
    image1: [{ name: "f1", content: "data" }, { name: "f2", content: "data" }]
  };

  q1.removeFile({ name: "f1" });
  assert.deepEqual(survey.data, {
    image1: [{ name: "f2", content: "data" }]
  });

  q1.removeFile({ name: "f2" });
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
          maxSize: 10
        }
      ]
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    var loadedFilesCount = 0;
    survey.onUploadFiles.add((survey, options) => {
      options.callback(
        "success",
        options.files.map(file => {
          return { file: file, content: file.name + "_url" };
        })
      );
      loadedFilesCount++;
    });

    var files: any = [
      { name: "f1", type: "t1", size: 9 },
      { name: "f2", type: "t2", size: 11 }
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
      <any>{ name: "f2", type: "t2", size: 2 }
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
  function(assert) {
    var json = {
      questions: [
        {
          type: "file",
          name: "image1",
          storeDataAsText: false,
          showPreview: true
        }
      ]
    };

    var survey = new SurveyModel(json);
    var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

    var isSuccess = true;
    survey.onUploadFiles.add((survey, options) => {
      if (isSuccess) {
        options.callback(
          "success",
          options.files.map(file => {
            return { file: file, content: file.name + "_url" };
          })
        );
      } else {
        options.callback("error");
      }
    });

    var state = "";
    q1.onStateChanged.add((_, options) => {
      state = options.state;
    });

    assert.ok(q1.isEmpty());
    assert.equal(q1.value, undefined);
    assert.equal(state, "");

    isSuccess = false;
    q1.loadFiles([<any>{ name: "f1", type: "t1" }]);

    assert.ok(q1.isEmpty());
    assert.equal(q1.value, undefined);
    assert.equal(state, "error");

    isSuccess = true;
    q1.loadFiles([<any>{ name: "f2", type: "t2" }]);

    assert.notOk(q1.isEmpty());
    assert.equal(q1.value.length, 1);
    assert.equal(q1.value[0].content, "f2_url");
    assert.equal(state, "loaded");
  }
);

QUnit.test("QuestionFile replace file for single file mode", function(assert) {
  var json = {
    questions: [
      {
        type: "file",
        name: "image1",
        storeDataAsText: false
      }
    ]
  };

  var survey = new SurveyModel(json);
  var q1: QuestionFileModel = <any>survey.getQuestionByName("image1");

  survey.onUploadFiles.add((survey, options) => {
    options.callback(
      "success",
      options.files.map(file => {
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
