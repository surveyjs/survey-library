mkdir __update_docs_temp
cd ./__update_docs_temp
mkdir service
git clone https://$GTTOKEN@github.com/surveyjs/service
cp -a ../docs/. ./service/surveyjs.io/App_Data/Docs
cd ./service
git add ./surveyjs.io/App_Data/Docs
git commit -m "Updated API documentation"
git push
cd ../..
rm -rf __update_docs_temp