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
    options.callback(
      "success",
      "data:image/jpeg;base64,FILECONTENT1"
    );
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
    q1.previewValue[0],
    "data:image/jpeg;base64,FILECONTENT1",
    "remote stored file content"
  );
  assert.equal(
    q2.previewValue[0],
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
    options.callback(
      "success",
      "data:image/jpeg;base64,FILECONTENT1"
    );
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
    q1.previewValue[0],
    "data:image/jpeg;base64,FILECONTENT1",
    "remote stored file content"
  );
  assert.equal(
    q2.previewValue[0],
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
    assert.equal(q1.inputTitle, "Loading...");
    assert.equal(q2.inputTitle, "");
    options.callback(
      "success",
      "data:image/jpeg;base64,FILECONTENT1"
    );
  });

  assert.equal(q1.inputTitle, "Choose file(s)...");
  assert.equal(q2.inputTitle, "Choose file(s)...");
  survey.data = {
    image1: [{ content: "someId" }],
    image2: [{ content: "data:image/jpeg;base64,FILECONTENT" }]
  };
  assert.equal(q1.inputTitle, "");
  assert.equal(q2.inputTitle, "");
  assert.deepEqual(q1.value, survey.data.image1);
  assert.deepEqual(q2.value, survey.data.image2);
  assert.equal(q1.previewValue.length, 1, "remote stored file");
  assert.equal(q2.previewValue.length, 1, "file stored as text");
  assert.equal(
    q1.previewValue[0],
    "data:image/jpeg;base64,FILECONTENT1",
    "remote stored file content"
  );
  assert.equal(
    q2.previewValue[0],
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
      q1.previewValue[0],
      survey.data.image1[0].content,
      "remote stored file content"
    );
    assert.equal(
      q2.previewValue[0],
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

  var files: any = [{ name: "f1", type: "t1" }, { name: "f2", type: "t2" }];
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
    assert.equal(q1.previewValue[0], q1.value[0].content, "preview content 1");
    assert.equal(q1.previewValue[1], q1.value[1].content, "preview content 2");
    done();
  });
});
