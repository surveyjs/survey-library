
module.exports = function(lang, regex) {
  return {
    meta: {
      type: 'suggestion',

      docs: {
        description: `This rule helps to find out where non English characters are.`,
        category: 'Best Practices',
        recommended: false
      },
      schema: [{
        type: 'object',
        properties: {
          includeIdentifier: {
            type: 'boolean',
            default: false,
          },
          includeComment: {
            type: 'boolean',
            default: false,
          },
          excludeArgsForFunctions: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          excludeModuleImports: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      }],
    },
    create: function(context) {
      const {
        includeIdentifier,
        includeComment,
        excludeArgsForFunctions,
        excludeModuleImports,
      } = context.options[0] || {};

      const getExpressionName = function(node) {
        const name = [];
        let callee = node.callee;
        if (!callee) return;
        if (callee.type === 'Identifier') return callee.name;
        while (callee.type === 'MemberExpression') {
          if (callee.property && callee.property.type === 'Identifier') {
            name.unshift(callee.property.name);
          }
          if (callee.object) {
            if (callee.object.type === 'Identifier') {
              name.unshift(callee.object.name);
              return name.join('.');
            } else {
              callee = callee.object;
            }
          }
        }
      };

      const shouldExcludeArgsForFunctions = function(node) {
        if (!Array.isArray(excludeArgsForFunctions)) return false;
        let parent = node.parent;
        while (parent) {
          if (
            parent.type === 'CallExpression' &&
            excludeArgsForFunctions.includes(getExpressionName(parent))
          ) return true;
          parent = parent.parent;
        }
        return false;
      };

      const shouldExcludeModuleImports = function(node) {
        if (!excludeModuleImports) return false;
        let parent = node.parent;
        while (parent) {
          if (
            ['ImportDeclaration', 'ImportExpression'].includes(parent.type)
          ) return true;
          parent = parent.parent;
        }
        return false;
      };

      const report = function(node, val) {
        context.report({
          node: node,
          message: `Using ${lang} characters: {{ character }}`,
          data: {
            character: val,
          },
        });
      };

      const listeners = {
        'Literal, JSXText': function(node) {
          if (shouldExcludeArgsForFunctions(node)) return;

          if (shouldExcludeModuleImports(node)) return;

          if (typeof node.value === 'string' && regex.exec(node.raw)) {
            report(node, node.raw);
          }
        },
        'TemplateElement': function(node) {
          if (shouldExcludeArgsForFunctions(node)) return;

          if (shouldExcludeModuleImports(node)) return;

          const v = node.value;
          if (v && v.raw && regex.exec(v.raw)) {
            report(node, v.raw);
          }
        },
      };
      if (includeIdentifier) {
        listeners['Identifier, JSXIdentifier'] = function(node) {
          if (regex.exec(node.name)) {
            report(node, node.name);
          }
        };
      }
      if (includeComment) {
        listeners['Program'] = function(node) {
          if (node.comments && node.comments.length > 0) {
            node.comments.forEach(function(node) {
              if (regex.exec(node.value)) {
                report(node, node.value.trim());
              }
            });
          }
        };
      }

      return listeners;
    },
  };
};
