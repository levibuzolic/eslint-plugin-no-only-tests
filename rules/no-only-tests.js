/**
 * @fileoverview Rule to flag use of .only in tests, preventing focused tests being committed accidentally
 * @author Levi Buzolic
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const BLOCK_DEFAULTS = ['describe', 'it', 'context', 'test', 'tape', 'fixture', 'serial'];
const FOCUS_DEFAULTS = ['only'];

module.exports = {
  meta: {
    docs: {
      description: 'disallow .only blocks in tests',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://github.com/levibuzolic/eslint-plugin-no-only-tests',
    },
    schema: [
      {
        type: 'object',
        properties: {
          block: {
            type: 'array',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
          focus: {
            type: 'array',
            items: {
              type: 'string',
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    var block = (context.options[0] || {}).block || BLOCK_DEFAULTS;
    var focus = (context.options[0] || {}).focus || FOCUS_DEFAULTS;

    return {
      Identifier(node) {
        if (
          focus.indexOf(node.name) != -1 &&
          node.parent &&
          node.parent.object &&
          block.indexOf(node.parent.object.name) != -1
        ) {
          context.report(node, node.parent.object.name + '.' + node.name + ' not permitted');
        }
      },
    };
  },
};
