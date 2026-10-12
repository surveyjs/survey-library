/* eslint-disable surveyjs/eslint-plugin-i18n/only-english-or-code */
import { countryChoices } from "./country-choices";

export const survey = {
  "logo": "https://api.surveyjs.io/private/Surveys/files?name=09c9faa7-52b9-48d7-a155-e01f1dad7e2f",
  "logoWidth": "auto",
  "logoHeight": "64",
  "completedHtml": "<div style=\"max-width:640px;text-align:center;margin:0px auto 16px auto;\">\n\n<div style=\"background-color:#6239B0;padding:40px 64px 48px 64px;\">\n<h4 style=\"color:#fff;\">Order received.</h4>\n<br>\n<p style=\"color:#fff;\">Your purchase is on its way. We've sent a confirmation email with order details to your inbox. If you have any inquiries or require further assistance, our customer support team is here to help. \n<br><br>\nThanks for choosing us.</p>\n</div>\n\n</div>",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "paneldynamic",
          "name": "products",
          "width": "100%",
          "title": "SELECT A PRODUCT",
          "titleLocation": "top",
          "defaultValue": [
            {
              "t-shirt-colors": "https://api.surveyjs.io/private/Surveys/files?name=facda824-2734-478c-90ac-db94ef35c28a",
              "jacket-colors": "https://api.surveyjs.io/private/Surveys/files?name=3a492458-6aab-418a-84e5-bb62f83166b1",
              "sneakers-colors": "https://api.surveyjs.io/private/Surveys/files?name=d514d65e-5f74-40a6-abfd-43cc7fa76fda",
              "product-type": "T-Shirt",
              "qty": "1",
              "clothing-material": "Recycled Polyester",
              "clothing-size": "M",
              "clothing-size-chart": {
                "S": {
                  "Neck": "14.5",
                  "Sleeve": "34",
                  "Chest": "35–37",
                  "Waist": "29.5–31.5"
                },
                "M": {
                  "Neck": "15–15.5",
                  "Sleeve": "34.5–35",
                  "Chest": "38–40",
                  "Waist": "32.5–34.5"
                },
                "L": {
                  "Neck": "16–16.5",
                  "Sleeve": "35.5–36",
                  "Chest": "42–44",
                  "Waist": "36.5–38.5"
                },
                "XL": {
                  "Neck": "17–17.5",
                  "Sleeve": "36.5–37",
                  "Chest": "46–48",
                  "Waist": "40.5–42.5"
                },
                "XXL": {
                  "Neck": "18–18.5",
                  "Sleeve": "37.5–38",
                  "Chest": "50–52",
                  "Waist": "44.5–46.5"
                }
              },
              "sneakers-material": "100% Faux Leather",
              "sneakers-size": "8.5",
              "sneakers-size-chart": {
                "6": {
                  "UK Size": "5",
                  "EU Size": "38.5"
                },
                "7": {
                  "UK Size": "6",
                  "EU Size": "39.5"
                },
                "8": {
                  "UK Size": "7",
                  "EU Size": "41"
                },
                "9": {
                  "UK Size": "8",
                  "EU Size": "42"
                },
                "10": {
                  "UK Size": "9",
                  "EU Size": "43"
                },
                "11": {
                  "UK Size": "10",
                  "EU Size": "45"
                },
                "12": {
                  "UK Size": "11",
                  "EU Size": "46"
                },
                "6.5": {
                  "UK Size": "5.5",
                  "EU Size": "39"
                },
                "7.5": {
                  "UK Size": "6.5",
                  "EU Size": "40"
                },
                "8.5": {
                  "UK Size": "7.5",
                  "EU Size": "41.5"
                },
                "9.5": {
                  "UK Size": "8.5",
                  "EU Size": "42.5"
                },
                "10.5": {
                  "UK Size": "9.5",
                  "EU Size": "44"
                },
                "11.5": {
                  "UK Size": "10.5",
                  "EU Size": "45.5"
                }
              }
            }
          ],
          "templateElements": [
            {
              "type": "dropdown",
              "name": "product-type",
              "width": "70%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Product",
              "choices": [
                "T-Shirt",
                "Sneakers",
                "Jacket"
              ],
              "choicesOrder": "random",
              "placeholder": "Select a product…",
              "allowClear": false
            },
            {
              "type": "dropdown",
              "name": "qty",
              "width": "30%",
              "minWidth": "144px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Quantity",
              "setValueIf": "{panel.product-type} notempty",
              "setValueExpression": "'1'",
              "choices": [
                1,
                2,
                3,
                4,
                5
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "image",
              "name": "t-shirt",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'T-Shirt'",
              "width": "50%",
              "minWidth": "224px",
              "imageLink": "{panel.t-shirt-colors}",
              "imageFit": "cover",
              "imageHeight": "auto",
              "imageWidth": "1000"
            },
            {
              "type": "imagepicker",
              "name": "t-shirt-colors",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'T-Shirt'",
              "width": "50%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "defaultValue": "https://api.surveyjs.io/private/Surveys/files?name=facda824-2734-478c-90ac-db94ef35c28a",
              "choices": [
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=e51dcbdf-2f8b-4770-828b-610583587e3f",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a9c2e950-4066-4263-bf02-f68f5ba31e62"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=4446e7d2-9a9b-45af-baae-bc2773331ae0",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=cc6a36e0-e332-4c46-8637-1e15f1eef229"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=facda824-2734-478c-90ac-db94ef35c28a",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=b44a0a43-7f35-42eb-818e-269881047632"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=9995584c-2cd0-4629-bae8-83deb90de0f8",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=bf448beb-e73b-4350-a008-d9bc57e9795b"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=d8da6e40-a7e3-423a-b32b-fa18dc9222d4",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a3bc912e-7925-45c7-bf27-4757743e0a60"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=60840717-c76b-4eb9-b569-7239daa93616",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=26138806-03ee-4509-a044-fd876ffd8b6c"
                }
              ],
              "imageHeight": 64,
              "imageWidth": 64,
              "minImageWidth": "",
              "minImageHeight": "",
              "maxImageWidth": "",
              "maxImageHeight": ""
            },
            {
              "type": "image",
              "name": "jacket",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Jacket'",
              "width": "50%",
              "minWidth": "224px",
              "imageLink": "{panel.jacket-colors}",
              "imageFit": "cover",
              "imageHeight": "auto",
              "imageWidth": "1000"
            },
            {
              "type": "imagepicker",
              "name": "jacket-colors",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Jacket'",
              "width": "50%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "defaultValue": "https://api.surveyjs.io/private/Surveys/files?name=3a492458-6aab-418a-84e5-bb62f83166b1",
              "choices": [
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=1a50faa1-a207-4e76-af3d-756fa4e73d62",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a9c2e950-4066-4263-bf02-f68f5ba31e62"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=3a492458-6aab-418a-84e5-bb62f83166b1",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=cc6a36e0-e332-4c46-8637-1e15f1eef229"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=947a25ac-12a8-43c1-9c3a-9fb4d8e3e73a",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=b44a0a43-7f35-42eb-818e-269881047632"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=c9330d4c-fab5-41b7-8792-f227a1be6b95",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=bf448beb-e73b-4350-a008-d9bc57e9795b"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=79cffa29-f657-4998-ad44-6b823a81119c",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a3bc912e-7925-45c7-bf27-4757743e0a60"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=629e4285-80ff-43dc-a5b2-de277b518024",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=26138806-03ee-4509-a044-fd876ffd8b6c"
                }
              ],
              "imageHeight": 64,
              "imageWidth": 64,
              "minImageWidth": "",
              "minImageHeight": "",
              "maxImageWidth": "",
              "maxImageHeight": ""
            },
            {
              "type": "image",
              "name": "Sneakers",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "50%",
              "minWidth": "224px",
              "imageLink": "{panel.sneakers-colors}",
              "imageFit": "cover",
              "imageHeight": "auto",
              "imageWidth": "1000"
            },
            {
              "type": "imagepicker",
              "name": "sneakers-colors",
              "visible": false,
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "50%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "defaultValue": "https://api.surveyjs.io/private/Surveys/files?name=d514d65e-5f74-40a6-abfd-43cc7fa76fda",
              "choices": [
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=d514d65e-5f74-40a6-abfd-43cc7fa76fda",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a9c2e950-4066-4263-bf02-f68f5ba31e62"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=b8628572-6b64-45a6-93fd-590a6f0f851e",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=cc6a36e0-e332-4c46-8637-1e15f1eef229"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=a71f1e3d-cc5d-4dea-b760-e2a9970ee4f8",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=b44a0a43-7f35-42eb-818e-269881047632"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=b8b48d79-2065-4afe-bbbd-22ebea6b7505",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=bf448beb-e73b-4350-a008-d9bc57e9795b"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=336f1fc4-b9ce-4ba8-a04c-90abe38aeb78",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=a3bc912e-7925-45c7-bf27-4757743e0a60"
                },
                {
                  "value": "https://api.surveyjs.io/private/Surveys/files?name=8a53acab-d64a-4afa-912e-dcc277d8f18b",
                  "imageLink": "https://api.surveyjs.io/private/Surveys/files?name=26138806-03ee-4509-a044-fd876ffd8b6c"
                }
              ],
              "imageHeight": 64,
              "imageWidth": 64,
              "minImageWidth": "",
              "minImageHeight": "",
              "maxImageWidth": "",
              "maxImageHeight": ""
            },
            {
              "type": "dropdown",
              "name": "sneakers-material",
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "50%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Material",
              "setValueIf": "{panel.product-type} = 'Sneakers'",
              "setValueExpression": "'100% Faux Leather'",
              "choices": [
                "100% Faux Leather",
                "100% Synthetic"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "dropdown",
              "name": "sneakers-size",
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "20%",
              "minWidth": "128px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Size",
              "setValueIf": "{panel.product-type} = 'Sneakers'",
              "setValueExpression": "'8.5'",
              "choices": [
                "6",
                "6.5",
                "7",
                "7.5",
                "8",
                "8.5",
                "9",
                "9.5",
                "10",
                "10.5",
                "11"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "checkbox",
              "name": "sneakers-size-chart-selector",
              "visibleIf": "{panel.product-type} = 'Sneakers'",
              "width": "30% ",
              "minWidth": "144px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "resetValueIf": "{panel.product-type} <> 'Sneakers'",
              "choices": [
                {
                  "value": "true",
                  "text": "Show Size Chart"
                }
              ]
            },
            {
              "type": "dropdown",
              "name": "clothing-material",
              "visibleIf": "{panel.product-type} <> 'Sneakers'",
              "width": "50%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Material",
              "setValueIf": "{panel.product-type} <> 'Sneakers'",
              "setValueExpression": "'Recycled Polyester'",
              "choices": [
                "Recycled Polyester",
                "Polyester",
                "100% Cotton"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "dropdown",
              "name": "clothing-size",
              "visibleIf": "{panel.product-type} <> 'Sneakers'",
              "width": "20%",
              "minWidth": "128px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Size",
              "setValueIf": "{panel.product-type} <> 'Sneakers'",
              "setValueExpression": "'M'",
              "choices": [
                "S",
                "M",
                "L",
                "XL",
                "XXL"
              ],
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "checkbox",
              "name": "clothing-size-chart-selector",
              "visibleIf": "{panel.product-type} <> 'Sneakers'",
              "width": "30% ",
              "minWidth": "144px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "resetValueIf": "{panel.product-type} = 'Sneakers'",
              "choices": [
                {
                  "value": "true",
                  "text": "Show Size Chart"
                }
              ]
            },
            {
              "type": "matrixdropdown",
              "name": "clothing-size-chart",
              "visibleIf": "{panel.clothing-size-chart-selector} = ['true'] and {panel.product-type} <> 'Sneakers'",
              "minWidth": "256px",
              "title": "SIZE CHART",
              "description": "All sizes are in inches.",
              "descriptionLocation": "underTitle",
              "defaultValue": {
                "S": {
                  "Neck": "14.5",
                  "Sleeve": "34",
                  "Chest": "35–37",
                  "Waist": "29.5–31.5"
                },
                "M": {
                  "Neck": "15–15.5",
                  "Sleeve": "34.5–35",
                  "Chest": "38–40",
                  "Waist": "32.5–34.5"
                },
                "L": {
                  "Neck": "16–16.5",
                  "Sleeve": "35.5–36",
                  "Chest": "42–44",
                  "Waist": "36.5–38.5"
                },
                "XL": {
                  "Neck": "17–17.5",
                  "Sleeve": "36.5–37",
                  "Chest": "46–48",
                  "Waist": "40.5–42.5"
                },
                "XXL": {
                  "Neck": "18–18.5",
                  "Sleeve": "37.5–38",
                  "Chest": "50–52",
                  "Waist": "44.5–46.5"
                }
              },
              "alternateRows": true,
              "columns": [
                {
                  "name": "Neck"
                },
                {
                  "name": "Sleeve"
                },
                {
                  "name": "Chest"
                },
                {
                  "name": "Waist"
                }
              ],
              "cellType": "expression",
              "rows": [
                "S",
                "M",
                "L",
                "XL",
                "XXL"
              ],
              "rowTitleWidth": "64px"
            },
            {
              "type": "matrixdropdown",
              "name": "sneakers-size-chart",
              "visibleIf": "{panel.sneakers-size-chart-selector} = ['true'] and {panel.product-type} = 'Sneakers'",
              "minWidth": "256px",
              "title": "SIZE CHART",
              "descriptionLocation": "underTitle",
              "defaultValue": {
                "6": {
                  "UK Size": "5",
                  "EU Size": "38.5"
                },
                "7": {
                  "UK Size": "6",
                  "EU Size": "39.5"
                },
                "8": {
                  "UK Size": "7",
                  "EU Size": "41"
                },
                "9": {
                  "UK Size": "8",
                  "EU Size": "42"
                },
                "10": {
                  "UK Size": "9",
                  "EU Size": "43"
                },
                "11": {
                  "UK Size": "10",
                  "EU Size": "45"
                },
                "12": {
                  "UK Size": "11",
                  "EU Size": "46"
                },
                "6.5": {
                  "UK Size": "5.5",
                  "EU Size": "39"
                },
                "7.5": {
                  "UK Size": "6.5",
                  "EU Size": "40"
                },
                "8.5": {
                  "UK Size": "7.5",
                  "EU Size": "41.5"
                },
                "9.5": {
                  "UK Size": "8.5",
                  "EU Size": "42.5"
                },
                "10.5": {
                  "UK Size": "9.5",
                  "EU Size": "44"
                },
                "11.5": {
                  "UK Size": "10.5",
                  "EU Size": "45.5"
                }
              },
              "alternateRows": true,
              "columns": [
                {
                  "name": "UK Size"
                },
                {
                  "name": "EU Size"
                }
              ],
              "cellType": "expression",
              "rows": [
                "6",
                "6.5",
                "7",
                "7.5",
                "8",
                "8.5",
                "9",
                "9.5",
                "10",
                "10.5",
                "11",
                "11.5",
                "12"
              ]
            }
          ],
          "noEntriesText": "There are no products yet.\nClick the button below to add a new product.",
          "confirmDelete": true,
          "confirmDeleteText": "Do you want to remove the product?",
          "addPanelText": "+ Product",
          "removePanelText": "Remove",
          "showProgressBar": false
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "panel",
          "name": "customer-details",
          "elements": [
            {
              "type": "text",
              "name": "full-name",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Full Name"
            },
            {
              "type": "text",
              "name": "phone",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Phone Number"
            },
            {
              "type": "text",
              "name": "email",
              "width": "60%",
              "minWidth": "256px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Email Address"
            },
            {
              "type": "text",
              "name": "billing-address",
              "width": "60%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Billing Address"
            },
            {
              "type": "dropdown",
              "name": "country",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Country",
              "choices": countryChoices,
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "text",
              "name": "city",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "City"
            },
            {
              "type": "text",
              "name": "state",
              "width": "20%",
              "minWidth": "88px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "State"
            },
            {
              "type": "text",
              "name": "zip",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Zip Code"
            }
          ],
          "title": "CUSTOMER DETAILS",
          "width": "100%"
        }
      ]
    },
    {
      "name": "page3",
      "elements": [
        {
          "type": "panel",
          "name": "shipping-details",
          "elements": [
            {
              "type": "radiogroup",
              "name": "shipping-method",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "defaultValue": "Item 1",
              "choices": [
                "Standard",
                "Express",
                "Tracked"
              ],
              "colCount": 0
            },
            {
              "type": "text",
              "name": "shipping-address",
              "width": "60%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Shipping Address"
            },
            {
              "type": "dropdown",
              "name": "shipping-country",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Country",
              "choices": countryChoices,
              "placeholder": "",
              "allowClear": false
            },
            {
              "type": "text",
              "name": "shipping-city",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "City"
            },
            {
              "type": "text",
              "name": "shipping-state",
              "width": "20%",
              "minWidth": "88px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "State"
            },
            {
              "type": "text",
              "name": "shipping-zip",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Zip Code"
            },
            {
              "type": "comment",
              "name": "further-instructions",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Further Instructions",
              "autoGrow": true,
              "allowResize": false
            }
          ],
          "title": "SHIPPING DETAILS",
          "width": "100%"
        }
      ]
    },
    {
      "name": "page4",
      "elements": [
        {
          "type": "panel",
          "name": "checkout",
          "elements": [
            {
              "type": "text",
              "name": "card-number",
              "width": "100%",
              "minWidth": "256px",
              "titleLocation": "hidden",
              "description": "Card Number"
            },
            {
              "type": "text",
              "name": "card-exp-date",
              "width": "40%",
              "minWidth": "224px",
              "titleLocation": "hidden",
              "description": "Expiration Date",
              "inputType": "date"
            },
            {
              "type": "text",
              "name": "card-cvc",
              "width": "20%",
              "minWidth": "88px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "CVC"
            },
            {
              "type": "text",
              "name": "cardholder-name",
              "width": "40%",
              "minWidth": "224px",
              "startWithNewLine": false,
              "titleLocation": "hidden",
              "description": "Cardholder Name"
            }
          ],
          "title": "PAYMENT",
          "width": "100%"
        }
      ]
    }
  ],
  "showPrevButton": false,
  "questionDescriptionLocation": "underInput",
  "pageNextText": "PROCEED",
  "completeText": "PLACE ORDER",
  "widthMode": "static",
  "width": "904"
};

export const theme = {
  "backgroundImage": "https://api.surveyjs.io/private/Surveys/files?name=6b50f74d-a71d-42b8-a14d-33d0c0c60bf9",
  "backgroundImageFit": "cover",
  "backgroundImageAttachment": "fixed",
  "backgroundOpacity": 1,
  "cssVariables": {
    "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
    "--sjs-general-backcolor-dark": "rgba(248, 248, 248, 1)",
    "--sjs-general-backcolor-dim": "#FCD700",
    "--sjs-general-backcolor-dim-light": "rgba(247, 247, 247, 1)",
    "--sjs-general-backcolor-dim-dark": "rgba(243, 243, 243, 1)",
    "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
    "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
    "--sjs-primary-backcolor": "rgba(98, 57, 176, 1)",
    "--sjs-primary-backcolor-light": "rgba(98, 57, 176, 0.1)",
    "--sjs-primary-backcolor-dark": "rgba(81, 47, 145, 1)",
    "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
    "--sjs-base-unit": "8px",
    "--sjs-corner-radius": "4px",
    "--sjs-shadow-small": "0px 1px 4px 0px rgba(0, 0, 0, 0.15), 0px 24px 32px 0px rgba(0, 0, 0, 0.25)",
    "--sjs-shadow-medium": "0px 2px 6px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.1)",
    "--sjs-shadow-inner": "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.1)",
    "--sjs-border-light": "rgba(0, 0, 0, 0.1)",
    "--sjs-border-default": "rgba(0, 0, 0, 0.15)",
    "--sjs-border-inside": "rgba(0, 0, 0, 0.16)",
    "--sjs-special-red": "rgba(229, 10, 62, 1)",
    "--sjs-special-red-light": "rgba(229, 10, 62, 0.1)",
    "--sjs-special-red-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-green": "rgba(25, 179, 148, 1)",
    "--sjs-special-green-light": "rgba(25, 179, 148, 0.1)",
    "--sjs-special-green-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-blue": "rgba(67, 127, 217, 1)",
    "--sjs-special-blue-light": "rgba(67, 127, 217, 0.1)",
    "--sjs-special-blue-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-special-yellow": "rgba(255, 152, 20, 1)",
    "--sjs-special-yellow-light": "rgba(255, 152, 20, 0.1)",
    "--sjs-special-yellow-forecolor": "rgba(255, 255, 255, 1)",
    "--sjs-font-questiondescription-color": "rgba(0, 0, 0, 0.5)",
    "--sjs-editorpanel-backcolor": "rgba(247, 247, 247, 1)",
    "--sjs-editorpanel-hovercolor": "rgba(252, 215, 0, 1)",
    "--sjs-font-questiontitle-color": "rgba(0, 0, 0, 1)",
    "--sjs-questionpanel-hovercolor": "rgba(252, 215, 0, 1)",
    "--sjs-font-editorfont-color": "rgba(0, 0, 0, 1)",
    "--sjs-font-editorfont-placeholdercolor": "rgba(0, 0, 0, 0.45)",
    "--sjs-questionpanel-cornerRadius": "8px",
    "--sjs-font-questiontitle-weight": "700",
    "--sjs-editorpanel-cornerRadius": "6px",
    "--sjs-font-pagetitle-color": "rgba(0, 0, 0, 1)",
    "--sjs-font-pagedescription-color": "rgba(0, 0, 0, 1)",
    "--sjs-header-backcolor": "transparent",
    "--sjs-font-headertitle-weight": "700",
    "--sjs-font-headerdescription-size": "20px",
    "--sjs-font-pagetitle-weight": "700"
  },
  "themeName": "default",
  "colorPalette": "light",
  "isPanelless": false,
  "header": {
    "height": 112,
    "inheritWidthFrom": "survey",
    "logoPositionX": "right",
    "logoPositionY": "bottom"
  },
  "headerView": "advanced"
};
