var fs = require('fs');
var Github = require('github-api');

require('dotenv').config();

var github = new Github({
  username: process.env.GIT_USER,
  password: process.env.GIT_PASS,
  auth: 'basic'
});

var repository = github.getRepo('surveyjs', 'service');

var classesContent = fs.readFileSync('doc_generator/classes.json', 'utf8');
repository.writeFile(
   'master',
   'surveyjs.io/App_Data/Docs/classes.json',
   classesContent,
   'Updated Classes API documentation',
   function(err) {
      console.log(err);
   }
);

var pmesContent = fs.readFileSync('doc_generator/pmes.json', 'utf8');
repository.writeFile(
   'master',
   'surveyjs.io/App_Data/Docs/pmes.json',
   pmesContent,
   'Updated Properties API documentation',
   function(err) {
      console.log(err);
   }
);

var sidebarContent = fs.readFileSync('doc_generator/sidebar.json', 'utf8');
repository.writeFile(
   'master',
   'surveyjs.io/App_Data/Docs/sidebar.json',
   sidebarContent,
   'Updated SideBar API documentation',
   function(err) {
      console.log(err);
   }
);