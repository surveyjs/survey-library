export const registerCustomToolboxComponent = async (page, framework) => {
  await page.evaluate((framework) => {
    if (framework === "react") {
      class CustomActionButton extends window["React"].Component {
        click = () => {
          this.props.item.action();
        };
        render() {
          return window["React"].createElement(
            "span",
            {
              className: "my-custom-action-class",
              onClick: this.click
            },
            " ",
            this.props.item.title
          );
        }
      }

      window["SurveyReact"].ReactElementFactory.Instance.registerElement(
        "svc-custom-action",
        (props) => {
          return window["React"].createElement(CustomActionButton, props);
        }
      );
    } else if (framework === "jquery-ui" || framework === "survey-js-ui") {
      const preact = (window["SurveyJquery"] || window["SurveyUI"])["preact"];
      window.React = { createElement: preact.createElement };

      class CustomActionButton extends preact.Component {
        click = () => {
          this.props.item.action();
        };
        render() {
          return preact.createElement(
            "span",
            {
              className: "my-custom-action-class",
              onClick: this.click
            },
            " ",
            this.props.item.title
          );
        }
      }

      (window["SurveyJquery"] || window["SurveyUI"]).ReactElementFactory.Instance.registerElement(
        "svc-custom-action",
        (props) => {
          return preact.createElement(CustomActionButton, props);
        }
      );
    } else if (framework === "vue") {
      window["Vue"].component("svc-custom-action", {
        props: {
          item: {},
        },
        template:
          '<span class="my-custom-action-class" data-bind="click: function() { $data.action() }">{{ item.title }}</span>',
      });
    }
  }, framework);
  await page.waitForTimeout(500);
};

export const registerCustomItemComponent = async (page, framework) => {
  await page.evaluate((framework) => {
    if (framework === "react") {
      class ItemTemplateComponent extends window["React"].Component {
        render() {
          const item = this.props.item;
          var Survey = window["Survey"];
          item.iconName = "icon-defaultfile";
          item.hint = item.title + " - Description";

          return window["React"].createElement(
            "div",
            {
              className: "my-list-item",
              style: { display: "flex" },
              title: item.hint
            },
            window["React"].createElement("span", {},
              window["React"].createElement(
                window["SurveyReact"].SvgIcon,
                {
                  iconName: item.iconName,
                  size: item.iconSize
                }
              )
            ),
            window["React"].createElement("span", {}, item.title)
          );
        }
      }
      window["SurveyReact"].ReactElementFactory.Instance.registerElement(
        "new-item",
        (props) => {
          return window["React"].createElement(ItemTemplateComponent, props);
        }
      );
    } else if (framework === "jquery-ui" || framework === "survey-js-ui") {
      const preact = (window["SurveyJquery"] || window["SurveyUI"])["preact"];
      window.React = { createElement: preact.createElement };

      class ItemTemplateComponent extends preact.Component {
        render() {
          const item = this.props.item;
          var Survey = window["SurveyJquery"] || window["SurveyUI"];
          item.iconName = "icon-defaultfile";
          item.hint = item.title + " - Description";

          return preact.createElement(
            "div",
            {
              className: "my-list-item",
              style: { display: "flex" },
              title: item.hint
            },
            preact.createElement("span", {},
              preact.createElement(
                Survey.SvgIcon,
                {
                  iconName: item.iconName,
                  size: item.iconSize
                }
              )
            ),
            preact.createElement("span", {}, item.title)
          );
        }
      }

      (window["SurveyJquery"] || window["SurveyUI"]).ReactElementFactory.Instance.registerElement(
        "new-item",
        (props) => {
          return preact.createElement(ItemTemplateComponent, props);
        }
      );
    } else if (framework === "vue") {
      window["Vue"].component("new-item", {
        props: {
          item: {},
        },
        created: function () {
          const item = this.item;
          item.iconName = "icon-defaultfile";
          item.hint = item.title + " - Description";
        },
        template:
          '<div class="my-list-item" style="display:flex;" v-bind:title="item.hint" ><span><sv-svg-icon :iconName="item.iconName" :size = "item.iconSize"></sv-svg-icon></span><span v-bind:class="item.getActionBarItemTitleCss()">{{ item.title }}</span></div>',
      });
    }
  }, framework);
  await page.waitForTimeout(500);
};

export const registerCustomItemContentComponent = async (page, framework) => {
  await page.evaluate((framework) => {
    if (framework === "react") {
      class ItemContentTemplateComponent extends window["React"].Component {
        render() {
          const locText = this.props.item.locText;
          const styles = {
            "display": "flex",
            "alignItems": "center",
            "gap": "8px"
          };
          return window["React"].createElement(
            "div",
            {
              className: "sv-ranking-item__text",
              style: styles
            },
            window["React"].createElement(
              window["SurveyReact"].SvgIcon,
              {
                iconName: "icon-next_16x16",
                size: 16
              }
            ),
            window["SurveyReact"].SurveyElementBase.renderLocString(locText)
          );
        }
      }
      window["SurveyReact"].ReactElementFactory.Instance.registerElement(
        "new-item-content",
        (props) => {
          return window["React"].createElement(ItemContentTemplateComponent, props);
        }
      );
    } else if (framework === "jquery-ui") {
      const preact = window["SurveyJquery"]["preact"];
      window.React = { createElement: preact.createElement };
      class ItemContentTemplateComponent extends preact.Component {
        render() {
          const locText = this.props.item.locText;
          const styles = {
            "display": "flex",
            "alignItems": "center",
            "gap": "8px"
          };
          return preact.createElement(
            "div",
            {
              className: "sv-ranking-item__text",
              style: styles
            },
            preact.createElement(
              window["SurveyJquery"].SvgIcon,
              {
                iconName: "icon-next_16x16",
                size: 16
              }
            ),
            window["SurveyJquery"].SurveyElementBase.renderLocString(locText)
          );
        }
      }
      window["SurveyJquery"].ReactElementFactory.Instance.registerElement(
        "new-item-content",
        (props) => {
          return preact.createElement(ItemContentTemplateComponent, props);
        }
      );
    } else if (framework === "survey-js-ui") {
      const preact = window["SurveyUI"]["preact"];
      window.React = { createElement: preact.createElement };
      class ItemContentTemplateComponent extends preact.Component {
        render() {
          const locText = this.props.item.locText;
          const styles = {
            "display": "flex",
            "alignItems": "center",
            "gap": "8px"
          };
          return preact.createElement(
            "div",
            {
              className: "sv-ranking-item__text",
              style: styles
            },
            preact.createElement(
              window["SurveyUI"].SvgIcon,
              {
                iconName: "icon-next_16x16",
                size: 16
              }
            ),
            window["SurveyUI"].SurveyElementBase.renderLocString(locText)
          );
        }
      }
      window["SurveyUI"].ReactElementFactory.Instance.registerElement(
        "new-item-content",
        (props) => {
          return preact.createElement(ItemContentTemplateComponent, props);
        }
      );
    } else if (framework === "vue") {
      window["Vue"].component("new-item-content", {
        props: {
          item: {}
        },
        template: `
        <div class="sv-ranking-item__text" :style="{display: 'flex', alignItems: 'center', gap: '8px'}">
            <sv-svg-icon iconName="icon-next_16x16" size = "16"></sv-svg-icon>
            <survey-string :locString="item.locText" />
        </div>
        `
      });
    }
  }, framework);
  await page.waitForTimeout(500);
};
