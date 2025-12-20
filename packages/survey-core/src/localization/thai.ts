import { setupLocale } from "survey-core";

export var thaiStrings = {
  // "Previous"
  pagePrevText: "ก่อนหน้า",
  // "Next"
  pageNextText: "ถัดไป",
  // "Complete"
  completeText: "สำเร็จ",
  // "Preview"
  previewText: "ดูตัวอย่าง",
  // "Edit"
  editText: "แก้ไข",
  // "Start"
  startSurveyText: "เริ่ม",
  // [Auto-translated] "Please leave a comment"
  commentText: "กรุณาแสดงความคิดเห็น",
  // "Other (describe)"
  otherItemText: "อื่นๆ (โปรดระบุ)",
  // "None"
  noneItemText: "ไม่มี",
  // [Auto-translated] "Refuse to answer"
  refuseItemText: "ปฏิเสธที่จะตอบ",
  // [Auto-translated] "Don't know"
  dontKnowItemText: "ไม่ทราบ",
  // "Select All"
  selectAllItemText: "เลือกทั้งหมด",
  // [Auto-translated] "Deselect all"
  deselectAllItemText: "ยกเลิกการเลือกทั้งหมด",
  // "Page {0} of {1}"
  progressText: "หน้าที่ {0} จาก {1}",
  // [Auto-translated] "{0} of {1}"
  indexText: "{0} of {1}",
  // "{0} of {1}"
  panelDynamicProgressText: "รายการที่ {0} จาก {1}",
  // [Auto-translated] "Panel {panelIndex}"
  panelDynamicTabTextFormat: "แผง {panelIndex}",
  // "Answered {0}/{1} questions"
  questionsProgressText: "คำตอบที่ {0}/{1} จำนวนคำถาม",
  // "The survey doesn't contain any visible elements."
  emptySurvey: "ไม่มีหน้าเพจที่มองเห็น หรือ คำถามใน survey นี้",
  // "Thank you for completing the survey"
  completingSurvey: "ขอบคุณที่ทำ survey จนเสร็จ",
  // "You have already completed this survey."
  completingSurveyBefore: "รายการของเราแสดงว่าคุณได้ทำ survey เสร็จเรียบร้อยแล้ว",
  // "Loading Survey..."
  loadingSurvey: "กำลังโหลด Survey...",
  // "Select..."
  placeholder: "เลือก...",
  // [Auto-translated] "Select..."
  ratingOptionsCaption: "เลือก   ",
  // [Auto-translated] "Select..."
  buttongroupOptionsCaption: "เลือก   ",
  // "value"
  value: "ข้อมูล",
  // "Response required."
  requiredError: "กรุณาตอบคำถาม",
  // "Response required: answer at least one question."
  requiredErrorInPanel: "กรุณาตอบขั้นต่ำหนึ่งคำถาม",
  // "Response required: answer questions in all rows."
  requiredInAllRowsError: "กรุณาตอบคำถามในทุกๆแถว",
  // [Auto-translated] "Each row must have a unique value."
  eachRowUniqueError: "แต่ละแถวต้องมีค่าที่ไม่ซ้ํากัน",
  // "The value should be numeric."
  numericError: "ข้อมูลที่ใส่ต้องเป็นตัวเลข",
  // [Auto-translated] "The value should not be less than {0}"
  minError: "ค่าไม่ควรน้อยกว่า {0}",
  // [Auto-translated] "Please enter a value that matches the step size of {0}."
  stepError: "โปรดป้อนค่าที่ตรงกับขนาดขั้นตอนของ {0}",
  // [Auto-translated] "The value should not be greater than {0}"
  maxError: "ค่าไม่ควรเกิน{0}",
  // [Auto-translated] "Numbers are not allowed."
  textNoDigitsAllow: "ไม่อนุญาตให้ใช้หมายเลข",
  // "Please enter at least {0} character(s)."
  textMinLength: "กรุณาใส่ขั้นต่ำจำนวน {0} ตัวอักษร",
  // "Please enter no more than {0} character(s)."
  textMaxLength: "กรุณาใส่ไม่เกินจำนวน {0} ตัวอักษร",
  // "Please enter at least {0} and no more than {1} characters."
  textMinMaxLength: "กรุณาใส่ขั้นต่ำจำนวน {0} และไม่เกินจำนวน {1} ตัวอักษร",
  // "Please fill in at least {0} row(s)."
  minRowCountError: "กรุณาใส่ขั้นต่ำจำนวน {0} แถว",
  // "Please select at least {0} option(s)."
  minSelectError: "กรุณาเลือกอย่างน้อย {0} รายการ",
  // "Please select no more than {0} option(s)."
  maxSelectError: "กรุณาเลือกไม่เกิน {0} รายการ",
  // "The '{0}' should be at least {1} and at most {2}"
  numericMinMax: "'{0}' ต้องมากกว่าหรือเท่ากับ {1} และน้อยกว่าหรือเท่ากับ {2}",
  // "The '{0}' should be at least {1}"
  numericMin: "'{0}' ต้องมากกว่าหรือเท่ากับ {1}",
  // "The '{0}' should be at most {1}"
  numericMax: "'{0}' น้อยกว่าหรือเท่ากับ {1}",
  // "Please enter a valid e-mail address."
  invalidEmail: "กรุณาใส่อีเมล์แอดเดรสที่ถูกต้อง",
  // "The expression: {0} should return 'true'."
  invalidExpression: "The expression: {0} ต้องรีเทิร์น 'true'.",
  // "The request returned error '{0}'. {1}"
  urlRequestError: "รีเควสรีเทิร์น error '{0}'. {1}",
  // "The request returned empty data or the 'path' property is incorrect"
  urlGetChoicesError: "รีเควสรีเทิร์นข้อมูลว่างเปล่า หรือ 'path' property ไม่ถูกต้อง",
  // "The file size should not exceed {0}."
  exceedMaxSize: "ขนาดไฟล์ต้องไม่เกิน {0}.",
  // [Auto-translated] "The maximum number of files you can upload is {0}."
  exceedMaxFiles: "จํานวนไฟล์สูงสุดที่คุณสามารถอัปโหลดได้คือ {0}",
  // [Auto-translated] "Files cannot be uploaded. Please add a handler for the 'onUploadFiles' event."
  noUploadFilesHandler: "ไม่สามารถอัปโหลดไฟล์ได้ โปรดเพิ่มตัวจัดการสําหรับเหตุการณ์ 'onUploadFiles'",
  // "Response required: enter another value."
  otherRequiredError: "กรุณาใส่ค่าอื่น",
  // "Your file is uploading. Please wait several seconds and try again."
  uploadingFile: "ไฟล์ของคุณกำลังอัพโหลดอยู่. กรุณารอสักครู่แล้วทำการลองอีกครั้ง",
  // "Loading..."
  loadingFile: "กำลังโหลด...",
  // "Choose file(s)..."
  chooseFile: "เลือกไฟล์...",
  // "No file selected"
  noFileChosen: "ไม่ไฟล์ที่เลือก",
  // [Auto-translated] "Drag and drop a file here or click the button below to select a file to upload."
  filePlaceholder: "ลากและวางไฟล์ที่นี่หรือคลิกปุ่มด้านล่างเพื่อเลือกไฟล์ที่จะอัปโหลด",
  // "Are you sure you want to delete this record?"
  confirmDelete: "คุณต้องการลบรายการนี้จริงหรือไม่?",
  // "This value should be unique."
  keyDuplicationError: "ข้อมูลนี้ต้องเป็น unique.",
  // "Add Column"
  addColumn: "เพิ่มคอลัมน์",
  // "Add Row"
  addRow: "เพิ่มแถว",
  // "Remove"
  removeRow: "ลบ",
  // [Auto-translated] "There are no rows."
  noRowsText: "ไม่มีแถว",
  // [Auto-translated] "Row {rowIndex}"
  rowIndexTemplateTitle: "แถว {rowIndex}",
  // "{rowTitle}"
  rowNameTemplateTitle: "{rowTitle}",
  // "Add new"
  addPanel: "เพิ่ม",
  // "Remove"
  removePanel: "ลบ",
  // [Auto-translated] "Show Details"
  showDetails: "แสดงรายละเอียด",
  // [Auto-translated] "Hide Details"
  hideDetails: "ซ่อนรายละเอียด",
  // "item"
  choices_Item: "ชิ้น",
  // [Auto-translated] "Choice option"
  choices_Choice: "ตัวเลือกตัวเลือก",
  // "Column"
  matrix_column: "คอลัมน์",
  // "Row"
  matrix_row: "แถว",
  // [Auto-translated] "text"
  multipletext_itemname: "ข้อความ",
  // "The results are being saved on the server..."
  savingData: "ผลลัพท์กำลังบันทึกลงที่เซิร์ฟเวอร์...",
  // "An error occurred and we could not save the results."
  savingDataError: "มีความผิดพลาดเกิดขึ้นส่งผลให้ไม่สามารถบันทึกผลได้",
  // "The results were saved successfully!"
  savingDataSuccess: "บันทึกสำเร็จแล้ว",
  // [Auto-translated] "Your response exceeds 64KB. Please reduce the size of your file(s) and try again or contact the survey owner."
  savingExceedSize: "คําตอบของคุณเกิน 64KB โปรดลดขนาดไฟล์ของคุณแล้วลองอีกครั้งหรือติดต่อเจ้าของแบบสํารวจ",
  // "Try again"
  saveAgainButton: "รบกวนลองอีกครั้ง",
  // "min"
  timerMin: "นาที",
  // "sec"
  timerSec: "วินาที",
  // "You have spent {0} on this page and {1} in total."
  timerSpentAll: "คุณใช้เวลา {0} บนหน้านี้และ {1} รวมทั้งหมด",
  // "You have spent {0} on this page."
  timerSpentPage: "คุณใช้เวลา {0} บนหน้านี้",
  // "You have spent {0} in total."
  timerSpentSurvey: "คุณใช้เวลา {0} รวมทั้งหมด",
  // "You have spent {0} of {1} on this page and {2} of {3} in total."
  timerLimitAll: "คุณใช้เวลา {0} ของ {1} บนหน้านี้และ {2} ของ {3} รวมทั้งหมด",
  // "You have spent {0} of {1} on this page."
  timerLimitPage: "คุณใช้เวลา {0} ของ {1} บนหน้านี้",
  // "You have spent {0} of {1} in total."
  timerLimitSurvey: "คุณใช้เวลา {0} ของ {1} รวมทั้งหมด",
  // "Clear"
  clearCaption: "เคลียร์",
  // [Auto-translated] "Select"
  selectCaption: "เลือก",
  // [Auto-translated] "Sign here"
  signaturePlaceHolder: "ลงชื่อที่นี่",
  // [Auto-translated] "No signature"
  signaturePlaceHolderReadOnly: "ไม่มีลายเซ็น",
  // "Select File"
  chooseFileCaption: "เลือกไฟล์",
  // [Auto-translated] "Take Photo"
  takePhotoCaption: "ถ่ายรูป",
  // [Auto-translated] "Click the button below to take a photo using the camera."
  photoPlaceholder: "คลิกปุ่มด้านล่างเพื่อถ่ายภาพโดยใช้กล้อง",
  // [Auto-translated] "Drag and drop or select a file to upload or take a photo using the camera."
  fileOrPhotoPlaceholder: "ลากและวางหรือเลือกไฟล์ที่จะอัปโหลดหรือถ่ายภาพโดยใช้กล้อง",
  // [Auto-translated] "Replace file"
  replaceFileCaption: "แทนที่ไฟล์",
  // "Remove this file"
  removeFileCaption: "นำไฟล์นี้ออก",
  // "Yes"
  booleanCheckedLabel: "ใช่",
  // "No"
  booleanUncheckedLabel: "ไม่ใช่",
  // "Are you sure that you want to remove this file: {0}?"
  confirmRemoveFile: "คุณแน่ใจที่จะนำไฟล์นี้ออกใช่หรือไม่: {0}?",
  // "Are you sure that you want to remove all files?"
  confirmRemoveAllFiles: "คุณแน่ใจที่จะนำไฟล์ทั้งหมดออกใช่หรือไม่",
  // "Question Title"
  questionTitlePatternText: "ชื่อคำถาม",
  // [Auto-translated] "Cancel"
  modalCancelButtonText: "ยกเลิก",
  // [Auto-translated] "Apply"
  modalApplyButtonText: "ใช้",
  // [Auto-translated] "Type to search..."
  filterStringPlaceholder: "พิมพ์เพื่อค้นหา...",
  // [Auto-translated] "No data to display"
  emptyMessage: "ไม่มีข้อมูลที่จะแสดง",
  // [Auto-translated] "Loading..."
  loadingPage: "การโหลด   ",
  // [Auto-translated] "Loading..."
  loadingData: "การโหลด   ",
  // [Auto-translated] "No entries yet.\nClick the button below to add a new entry."
  noEntriesText: "ยังไม่มีรายการ\nคลิกปุ่มด้านล่างเพื่อเพิ่มรายการใหม่",
  // [Auto-translated] "No entries"
  noEntriesReadonlyText: "ไม่มีรายการ",
  // [Auto-translated] "New Panel"
  tabTitlePlaceholder: "แผงใหม่",
  // [Auto-translated] "More"
  more: "อีก",
  // [Auto-translated] "OK"
  tagboxDoneButtonCaption: "ตกลง, ได้",
  // [Auto-translated] "All choices are selected for ranking"
  selectToRankEmptyRankedAreaText: "ตัวเลือกทั้งหมดถูกเลือกสําหรับการจัดอันดับ",
  // [Auto-translated] "Drag choices here to rank them"
  selectToRankEmptyUnrankedAreaText: "ลากตัวเลือกที่นี่เพื่อจัดอันดับ",
  // [Auto-translated] "OK"
  ok: "ตกลง, ได้",
  // [Auto-translated] "Cancel"
  cancel: "ยกเลิก",
  // "Create \"{0}\" item..."
  createCustomItem: "สร้างรายการ \"{0}\"...",
  // [Auto-translated] "Table of contents"
  toc: "สารบัญ",
  // [Auto-translated] "Progress bar"
  progressbar: "แถบความคืบหน้า"
};

setupLocale({ localeCode: "th", strings: thaiStrings, nativeName: "ไทย", englishName: "Thai" });