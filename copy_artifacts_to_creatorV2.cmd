@echo off
set src=.\packages\survey-knockout
set tgtv1=..\survey-creator\packages\survey-creator\node_modules\survey-knockout
set tgtv2=..\survey-creator\packages\survey-creator-v2\node_modules\survey-knockout
set tgtv3=..\survey-creator\packages\survey-creator-v2-core\node_modules\survey-knockout
set tgtv4=..\survey-creator\packages\survey-creator-v2-knockout\node_modules\survey-knockout
if exist %tgtv1% xcopy %src%\*.* %tgtv1% /Y /Q
if exist %tgtv2% xcopy %src%\*.* %tgtv2% /Y /Q
if exist %tgtv3% xcopy %src%\*.* %tgtv3% /Y /Q
if exist %tgtv4% xcopy %src%\*.* %tgtv4% /Y /Q