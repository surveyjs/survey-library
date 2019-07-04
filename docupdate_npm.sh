mkdir __update_docs_temp
cd ./__update_docs_temp
mkdir service
REPO_URL="https://github.com/surveyjs/service"
git -c http.$REPO_URL.extraHeader="Authorization: Basic $GITAUTH" \
  clone $REPO_URL
mv ../docs/images .
cp -a ../docs/. ./service/surveyjs.io/App_Data/Docs
mv ./images ../docs
cd ./service
git add ./surveyjs.io/App_Data/Docs
git commit -m "Updated API documentation"
git push
cd ../..
rm -rf __update_docs_temp