var fs = require('fs');
var Github = require('github-api');

require('dotenv').config();

var github = new Github({
  username: process.env.GIT_USER,
  password: process.env.GIT_PASS,
  auth: 'basic'
});
var repository = github.getRepo('surveyjs', 'service');


function commit(inputPath, outputPath, comment) {
   return new Promise(function(resolve, reject) {
      var content = fs.readFileSync(inputPath, 'utf8');
      repository.writeFile(
         'master',
         outputPath,
         content,
         comment,
         function(err) {
            let log = 'inputPath=' + inputPath +
            ', outputPath=' + outputPath + ', comment=' + comment;
            if (!err) {
               console.log('Success: ' + log);
            }
            else{ 
               console.log('Failure: ' + log + "\n" + err);
            }
            resolve();
         }
      );
   });
}

commit('doc_generator/classes.json', 'surveyjs.io/App_Data/Docs/classes.json', 'Updated Classes API documentation').then(
 () => commit('doc_generator/pmes.json', 'surveyjs.io/App_Data/Docs/pmes.json', 'Updated Properties API documentation')).then(
 () => commit('docs/sidebar.json', 'surveyjs.io/App_Data/Docs/sidebar.json', 'Updated SideBar')).then(
 () => commit('docs/CreateQuiz.md', 'surveyjs.io/App_Data/Docs/CreateQuiz.md', 'Updated CreadQuiz.md')).then(
 () => commit('docs/LibraryOverview.md', 'surveyjs.io/App_Data/Docs/LibraryOverview.md', 'Updated LibraryOverview.md')).then(
 () => commit('docs/Question/visibleIf.md', 'surveyjs.io/App_Data/Docs/Question/visibleIf.md', 'Updated visibleIf.md')).then(
 () => commit('docs/images/builder-adorners.png', 'surveyjs.io/Content/Images/docs/builder-adorners.png', 'Updated builder-adorners.png')).then(
 () => commit('docs/images/builder-question-editor.png', 'surveyjs.io/Content/Images/docs/builder-question-editor.png', 'Updated builder-question-editor.png')).then(
 () => commit('docs/images/choicesbyurl.png', 'surveyjs.io/Content/Images/docs/choicesbyurl.png', 'Updated choicesbyurl.png'));
