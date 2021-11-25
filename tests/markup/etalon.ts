import { settings } from "../../src/settings";
import { StylesManager } from "../../src/stylesmanager";

export var markupTests = [
  // #region Text question
  {
    name: "Test Text question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" placeholder=\"\" step=\"any\" type=\"text\">"
  },
  {
    name: "Test Text (text update mode) question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      textUpdateMode: "onTyping"
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" placeholder=\"\" step=\"any\" type=\"text\">"
  },
  {
    name: "Test Text readonly question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      mode: "display"
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" disabled=\"\" placeholder=\"\" step=\"any\" type=\"text\">"
  },
  {
    name: "Test Text readonly DIV question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          defaultValue: "test",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      mode: "display",
    },
    before: () => settings.readOnlyTextRenderMode = "div",
    after: () => settings.readOnlyTextRenderMode = "input",
    etalon: "<div>test</div>"
  },
  {
    name: "Test Text Date question markup",
    json: {
      questions: [
        {
          name: "birthdate",
          type: "text",
          inputType: "date",
          title: "Your birthdate:",
          isRequired: true,
          autoComplete: "bdate",
          titleLocation: "hidden"
        }
      ],
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Your birthdate:\" aria-required=\"true\" autocomplete=\"bdate\" class=\"sv_q_text_root\" max=\"2999-12-31\" placeholder=\"\" step=\"any\" type=\"date\">"
  },
  {
    name: "Test Text Email question markup",
    json: {
      questions: [
        {
          name: "email",
          type: "text",
          inputType: "email",
          title: "Your e-mail:",
          placeHolder: "jon.snow@nightwatch.org",
          isRequired: true,
          autoComplete: "email",
          validators: [
            {
              type: "email"
            }
          ],
          titleLocation: "hidden"
        }
      ],
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Your e-mail:\" aria-required=\"true\" autocomplete=\"email\" class=\"sv_q_text_root\" placeholder=\"jon.snow@nightwatch.org\" step=\"any\" type=\"email\">"
  },
  {
    name: "Test Text Data list markup",
    json: {

      questions: [
        {
          type: "text",
          name: "q1",
          dataList: ["abc", "def", "ghk"],
          titleLocation: "hidden"
        }
      ],
    },
    etalon: "<div><input aria-invalid=\"false\" aria-label=\"q1\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" placeholder=\"\" step=\"any\" type=\"text\"><datalist><option value=\"abc\"></option><option value=\"def\"></option><option value=\"ghk\"></option></datalist></div>"
  },
  // #endregion

  // #region Image question
  {
    name: "Test Image question markup",
    json: {
      questions: [
        {
          "type": "image",
          "name": "banner",
          "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
          "imageWidth": "500px",
          "imageHeight": "300px"
        }
      ]
    },
    etalon: "<div class=\"sv_q_image\"><img alt=\"banner\" class=\"sv_image_image\" height=\"300px\" src=\"https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg\" style=\"object-fit: contain;\" width=\"500px\"></div>"
  },
  {
    name: "Test Image Video question markup",
    json: {
      questions: [
        {
          "type": "image",
          "name": "banner",
          "imageLink": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          "imageWidth": "500px",
          "imageHeight": "300px",
          "contentMode": "video"
        }
      ]
    },
    etalon: "<div class=\"sv_q_image\"><video class=\"sv_image_image\" controls=\"\" height=\"300px\" src=\"https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4\" style=\"object-fit: contain;\" width=\"500px\"></video></div>"
  },
  // #endregion

  // #region HTML question
  {
    name: "Test HTML question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "html",
          html: "HTML content here",
          title: "Question title",
        }
      ]
    },
    etalon: "<div>HTML content here</div>"
  },
  // #endregion

  // #region Boolean question
  {
    name: "Test Boolean question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div class=\"sv_qcbc sv_qbln\"><label class=\"sv-boolean sv-boolean--indeterminate\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv-visuallyhidden\" name=\"name\" type=\"checkbox\" value=\"\"><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">No</span></span><div class=\"sv-boolean__switch\"><span class=\"sv-boolean__slider\"></span></div><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">Yes</span></span></label></div>"
  },
  {
    name: "Test Boolean question markup Default V2",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    etalon: "<div class=\"sv_qcbc sv_qbln\"><label class=\"sd-boolean sd-boolean--indeterminate\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sd-boolean__control sd-visuallyhidden\" name=\"name\" type=\"checkbox\" value=\"\"><span class=\"sd-boolean__label\"><span class=\"sv-string-viewer\">No</span></span><div class=\"sd-boolean__switch\"><span class=\"sd-boolean__thumb\"></span></div><span class=\"sd-boolean__label\"><span class=\"sv-string-viewer\">Yes</span></span></label></div>"
  },
  {
    name: "Test Boolean question markup with value Default V2",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          defaultValue: true,
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    etalon: "<div class=\"sv_qcbc sv_qbln\"><label class=\"sd-boolean sd-boolean--checked\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" checked=\"\" class=\"sd-boolean__control sd-visuallyhidden\" name=\"name\" type=\"checkbox\" value=\"true\"><span class=\"sd-boolean__label sd-checkbox__label--disabled\"><span class=\"sv-string-viewer\">No</span></span><div class=\"sd-boolean__switch\"><span class=\"sd-boolean__thumb\"><span class=\"sd-boolean__thumb-text\"><span class=\"sv-string-viewer\">Yes</span></span></span></div><span class=\"sd-boolean__label\"><span class=\"sv-string-viewer\">Yes</span></span></label></div>"
  },
  {
    name: "Test Boolean Checkbox question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "checkbox"
        }
      ]
    },
    etalon: "<div class=\"sv_qcbc sv_qbln\"><label class=\"sv-boolean sv-boolean--indeterminate\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv-visuallyhidden\" name=\"name\" type=\"checkbox\" value=\"\"><span class=\"sv-item__decorator sv-boolean__decorator\"><svg class=\"sv-item__svg sv-boolean__svg\" viewBox=\"0 0 24 24\"><rect class=\"sv-boolean__unchecked-path\" height=\"4\" width=\"14\" x=\"5\" y=\"10\"></rect><polygon class=\"sv-boolean__checked-path\" points=\"19,10 14,10 14,5 10,5 10,10 5,10 5,14 10,14 10,19 14,19 14,14 19,14 \"></polygon><path class=\"sv-boolean__indeterminate-path\" d=\"M22,0H2C0.9,0,0,0.9,0,2v20c0,1.1,0.9,2,2,2h20c1.1,0,2-0.9,2-2V2C24,0.9,23.1,0,22,0z M21,18L6,3h15V18z M3,6l15,15H3V6z\"></path></svg><span class=\"check\"></span></span><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">Question title</span></span></label></div>"
  },
  // #endregion

  // #region Comment question
  {
    name: "Test Comment question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeHolder: "placeholder text",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<textarea aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" cols=\"50\" placeholder=\"placeholder text\" rows=\"4\" style=\"resize: both;\"></textarea>"
  },
  {
    name: "Test Comment question Read-only markup",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeHolder: "placeholder text",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<textarea aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" cols=\"50\" disabled=\"\" readonly=\"\" rows=\"4\" style=\"resize: both;\"></textarea>"
  },
  {
    name: "Test Comment question Read-only DIV markup",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeHolder: "placeholder text",
          defaultValue: "val",
          titleLocation: "hidden"
        }
      ]
    },
    before: () => settings.readOnlyCommentRenderMode = "div",
    after: () => settings.readOnlyCommentRenderMode = "textarea",
    etalon: "<div>val</div>"
  },
  // #endregion Comment question

  // #region Dropdown Question
  {
    name: "Test Dropdown question markup",
    json: {
      questions: [
        {
          "type": "dropdown",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div><div class=\"sv_select_wrapper\"><select aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_dropdown_control\"><option value=\"\">Choose...</option><option value=\"item1\">item1</option><option value=\"item2\">item2</option><option value=\"item3\">item3</option></select></div></div>"
  },
  {
    name: "Test Dropdown question markup Show options caption false",
    json: {
      questions: [
        {
          "type": "dropdown",
          "name": "name",
          "title": "Question title",
          "showOptionsCaption": false,
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div><div class=\"sv_select_wrapper\"><select aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_dropdown_control\"><option value=\"item1\">item1</option><option value=\"item2\">item2</option><option value=\"item3\">item3</option></select></div></div>"
  },
  {
    name: "Test Dropdown question markup Other option",
    json: {
      questions: [
        {
          "type": "dropdown",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          "hasOther": true,
          "defaultValue": "other",
          "otherText": "Other (describe)",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div><div class=\"sv_select_wrapper\"><select aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_dropdown_control\"><option value=\"\">Choose...</option><option value=\"item1\">item1</option><option value=\"item2\">item2</option><option value=\"item3\">item3</option><option value=\"other\">Other (describe)</option></select></div><div class=\"form-group\"><textarea aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_dd_other\" placeholder=\"\" style=\"resize: both;\"></textarea></div></div>"
  },
  {
    name: "Test Dropdown question markup Read only",
    json: {
      mode: "display",
      questions: [
        {
          "type": "dropdown",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div><div class=\"sv_q_dropdown_control\" disabled=\"\">Choose...</div></div>"
  },
  {
    name: "Test Dropdown question Readonly selected",
    json: {
      mode: "display",
      questions: [
        {
          "type": "dropdown",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          "defaultValue": "item1",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div><div class=\"sv_q_dropdown_control\" disabled=\"\">item1</div></div>"
  },
  // #endregion Dropdown

  // #region Radiogroup Question
  {
    name: "Test radiogroup question markup",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc\" role=\"radiogroup\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item1\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item1\"><span title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item2\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item2\"><span title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item3\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item3\"><span title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div></fieldset>"
  },
  {
    name: "Test radiogroup question markup Other option",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          "hasOther": true,
          "defaultValue": "other",
          "otherText": "Other (describe)",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc\" role=\"radiogroup\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item1\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item1\"><span title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item2\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item2\"><span title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item3\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item3\"><span title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div><div aria-checked=\"true\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1 checked\" role=\"radio\"><label aria-label=\"Other (describe)\" class=\"sv_q_radiogroup_label\"><input checked=\"\" class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"other\"><span title=\"Other (describe)\"><span class=\"sv-string-viewer\">Other (describe)</span></span></label><div class=\"form-group\"><textarea aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_other sv_q_radiogroup_other\" placeholder=\"\" style=\"resize: both;\"></textarea></div></div></fieldset>"
  },
  {
    name: "Test radiogroup question markup Read only",
    json: {
      mode: "display",
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc\" role=\"radiogroup\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item1\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" disabled=\"\" type=\"radio\" value=\"item1\"><span title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item2\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" disabled=\"\" type=\"radio\" value=\"item2\"><span title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item3\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" disabled=\"\" type=\"radio\" value=\"item3\"><span title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div></fieldset>"
  },
  {
    name: "Test radiogroup question Readonly selected",
    json: {
      mode: "display",
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          "defaultValue": "item1",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc\" role=\"radiogroup\"><div aria-checked=\"true\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1 checked\" role=\"radio\"><label aria-label=\"item1\" class=\"sv_q_radiogroup_label\"><input checked=\"\" class=\"sv_q_radiogroup_control_item\" disabled=\"\" type=\"radio\" value=\"item1\"><span title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item2\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" disabled=\"\" type=\"radio\" value=\"item2\"><span title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item3\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" disabled=\"\" type=\"radio\" value=\"item3\"><span title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div></fieldset>"
  },
  {
    name: "Test radiogroup V2 theme",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    etalon: "<fieldset class=\"sd-selectbase\" role=\"radiogroup\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sd-item sd-radio sd-selectbase__item sv-q-col-1 sd-item--allowhover sd-radio--allowhover\" role=\"radio\"><label aria-label=\"item1\" class=\"sd-selectbase__label\"><input class=\"sd-visuallyhidden sd-item__control sd-radio__control\" type=\"radio\" value=\"item1\"><span class=\"sd-item__decorator sd-radio__decorator\"></span><span class=\"sd-item__control-label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sd-item sd-radio sd-selectbase__item sv-q-col-1 sd-item--allowhover sd-radio--allowhover\" role=\"radio\"><label aria-label=\"item2\" class=\"sd-selectbase__label\"><input class=\"sd-visuallyhidden sd-item__control sd-radio__control\" type=\"radio\" value=\"item2\"><span class=\"sd-item__decorator sd-radio__decorator\"></span><span class=\"sd-item__control-label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div></fieldset>"
  },
  {
    name: "Test radiogroup modern theme",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
    etalon: "<fieldset class=\"sv-selectbase\" role=\"radiogroup\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv-item sv-radio sv-selectbase__item sv-q-col-1 sv-radio--allowhover\" role=\"radio\"><label aria-label=\"item1\" class=\"sv-selectbase__label\"><input class=\"sv-visuallyhidden sv-item__control\" type=\"radio\" value=\"item1\"><span class=\"sv-item__decorator sv-selectbase__decorator sv-radio__decorator\"><svg class=\"sv-item__svg sv-radio__svg\"><use xlink:href=\"#icon-modernradio\"></use></svg></span><span class=\"sv-item__control-label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv-item sv-radio sv-selectbase__item sv-q-col-1 sv-radio--allowhover\" role=\"radio\"><label aria-label=\"item2\" class=\"sv-selectbase__label\"><input class=\"sv-visuallyhidden sv-item__control\" type=\"radio\" value=\"item2\"><span class=\"sv-item__decorator sv-selectbase__decorator sv-radio__decorator\"><svg class=\"sv-item__svg sv-radio__svg\"><use xlink:href=\"#icon-modernradio\"></use></svg></span><span class=\"sv-item__control-label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div></fieldset>"
  },
  {
    name: "Test radiogroup clear button",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc\" role=\"radiogroup\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item1\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item1\"><span title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup sv-q-col-1\" role=\"radio\"><label aria-label=\"item2\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item2\"><span title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div><input class=\"sv_q_radiogroup_clear\" type=\"button\" value=\"Clear\"></div></fieldset>"
  },
  {
    name: "Test radiogroup columns",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 2,
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc\" role=\"radiogroup\"><div class=\"sv_q_select_column sv-q-column-2\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup\" role=\"radio\"><label aria-label=\"item1\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item1\"><span title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div></div><div class=\"sv_q_select_column sv-q-column-2\"><div aria-checked=\"false\" aria-invalid=\"false\" aria-required=\"false\" class=\"sv_q_radiogroup\" role=\"radio\"><label aria-label=\"item2\" class=\"sv_q_radiogroup_label\"><input class=\"sv_q_radiogroup_control_item\" type=\"radio\" value=\"item2\"><span title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div></div><div><input class=\"sv_q_radiogroup_clear\" type=\"button\" value=\"Clear\"></div></fieldset>"
  },
  // #endregion Radiogroup

  // #region Checkbox Question
  {
    name: "Test checkbox question markup",
    json: {
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc sv_qcbx\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sv_q_checkbox_control_label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sv_q_checkbox_control_label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item3\"><span class=\"sv_q_checkbox_control_label\" title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div></fieldset>"
  },
  {
    name: "Test checkbox question markup Other option",
    json: {
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          "hasOther": true,
          "defaultValue": "other",
          "otherText": "Other (describe)",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc sv_qcbx\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sv_q_checkbox_control_label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sv_q_checkbox_control_label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item3\"><span class=\"sv_q_checkbox_control_label\" title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1 checked\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" checked=\"\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"other\"><span class=\"sv_q_checkbox_control_label\" title=\"Other (describe)\"><span class=\"sv-string-viewer\">Other (describe)</span></span></label><div class=\"form-group\"><textarea aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_other sv_q_checkbox_other\" placeholder=\"\" style=\"resize: both;\"></textarea></div></div></fieldset>"
  },
  {
    name: "Test checkbox question markup Read only",
    json: {
      mode: "display",
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc sv_qcbx\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" disabled=\"\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sv_q_checkbox_control_label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" disabled=\"\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sv_q_checkbox_control_label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" disabled=\"\" name=\"name\" type=\"checkbox\" value=\"item3\"><span class=\"sv_q_checkbox_control_label\" title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div></fieldset>"
  },
  {
    name: "Test checkbox question Readonly selected",
    json: {
      mode: "display",
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          "defaultValue": "item1",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc sv_qcbx\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sv_q_checkbox sv-q-col-1 checked\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" checked=\"\" class=\"sv_q_checkbox_control_item\" disabled=\"\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sv_q_checkbox_control_label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" disabled=\"\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sv_q_checkbox_control_label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div><div class=\"sv_q_checkbox sv-q-col-1\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" disabled=\"\" name=\"name\" type=\"checkbox\" value=\"item3\"><span class=\"sv_q_checkbox_control_label\" title=\"item3\"><span class=\"sv-string-viewer\">item3</span></span></label></div></fieldset>"
  },
  {
    name: "Test checkbox V2 theme",
    json: {
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    etalon: "<fieldset class=\"sd-selectbase\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sd-item sd-checkbox sd-selectbase__item sv-q-col-1 sd-item--allowhover sd-checkbox--allowhover\"><label class=\"sd-selectbase__label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sd-visuallyhidden sd-item__control sd-checkbox__control\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sd-item__decorator sd-checkbox__decorator\"><svg class=\"sd-item__svg sd-checkbox__svg\"><use xlink:href=\"#icon-v2check\"></use></svg></span><span class=\"sd-item__control-label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div class=\"sd-item sd-checkbox sd-selectbase__item sv-q-col-1 sd-item--allowhover sd-checkbox--allowhover\"><label class=\"sd-selectbase__label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sd-visuallyhidden sd-item__control sd-checkbox__control\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sd-item__decorator sd-checkbox__decorator\"><svg class=\"sd-item__svg sd-checkbox__svg\"><use xlink:href=\"#icon-v2check\"></use></svg></span><span class=\"sd-item__control-label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div></fieldset>"
  },
  {
    name: "Test checkbox modern theme",
    json: {
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
    etalon: "<fieldset class=\"sv-selectbase\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sv-item sv-checkbox sv-selectbase__item sv-q-col-1 sv-checkbox--allowhover\"><label class=\"sv-selectbase__label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv-visuallyhidden sv-item__control\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sv-item__decorator sv-selectbase__decorator sv-checkbox__decorator\"><svg class=\"sv-item__svg sv-checkbox__svg\"><use xlink:href=\"#icon-moderncheck\"></use></svg></span><span class=\"sv-item__control-label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div><div class=\"sv-item sv-checkbox sv-selectbase__item sv-q-col-1 sv-checkbox--allowhover\"><label class=\"sv-selectbase__label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv-visuallyhidden sv-item__control\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sv-item__decorator sv-selectbase__decorator sv-checkbox__decorator\"><svg class=\"sv-item__svg sv-checkbox__svg\"><use xlink:href=\"#icon-moderncheck\"></use></svg></span><span class=\"sv-item__control-label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div></fieldset>"
  },
  {
    name: "Test checkbox columns",
    json: {
      questions: [
        {
          "type": "checkbox",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 2,
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<fieldset class=\"sv_qcbc sv_qcbx\"><legend aria-label=\"Question title\" role=\"checkbox\"></legend><div class=\"sv_q_select_column sv-q-column-2\"><div class=\"sv_q_checkbox\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item1\"><span class=\"sv_q_checkbox_control_label\" title=\"item1\"><span class=\"sv-string-viewer\">item1</span></span></label></div></div><div class=\"sv_q_select_column sv-q-column-2\"><div class=\"sv_q_checkbox\"><label class=\"sv_q_checkbox_label\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv_q_checkbox_control_item\" name=\"name\" type=\"checkbox\" value=\"item2\"><span class=\"sv_q_checkbox_control_label\" title=\"item2\"><span class=\"sv-string-viewer\">item2</span></span></label></div></div></fieldset>"
  },
  // #endregion checkbox

];
