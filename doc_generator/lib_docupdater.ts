import * as fs from 'fs';
import * as Github from 'github-api';

require('dotenv').config();

var github = new Github({
  username: process.env.GITUSER,
  password: process.env.GITPASS,
  auth: 'basic'
});

var repository = github.getRepo('surveyjs', 'service');

var classesContent = fs.readFileSync('doc_generator/classes.json', 'utf8');

repository.writeFile(
   'master',
   'surveyjs.io/App_Data/Docs/classes.json',
   classesContent,
   'Updated API documentation',
   function(err) {
      console.log(err);
   }
);

var pmesContent = fs.readFileSync('doc_generator/pmes.json', 'utf8');

repository.writeFile(
   'master',
   'surveyjs.io/App_Data/Docs/pmes.json',
   pmesContent,
   'Updated API documentation',
   function(err) {
      console.log(err);
   }
);
