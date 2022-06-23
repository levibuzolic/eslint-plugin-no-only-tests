/**
 * @fileoverview Rule to flag use of .skip in tests, preventing skipped tests from being committed
 * @author Michael Caveney
 */

 'use strict';

 //------------------------------------------------------------------------------
 // Rule Definition
 //------------------------------------------------------------------------------
 
 const BLOCK_DEFAULTS = ['describe', 'it', 'context', 'test', 'tape', 'fixture', 'serial'];
 const FOCUS_DEFAULTS = ['skip'];
 
 module.exports = {
   meta: {
     docs: {
       description: 'disallow .skip blocks in tests',
       category: 'Possible Errors',
       recommended: true,
       url: 'https://github.com/dylanesque/eslint-plugin-no-only-or-skip-tests',
     },
     fixable: true,
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
           fix: {
             type: 'boolean',
           },
         },
         additionalProperties: false,
       },
     ],
   },
   create(context) {
     const options = context.options[0] || {};
     const block = options.block || BLOCK_DEFAULTS;
     const focus = options.focus || FOCUS_DEFAULTS;
     const fix = !!options.fix;
 
     return {
       Identifier(node) {
         const parentObject = node.parent && node.parent.object;
         if (parentObject == null) return;
         if (focus.indexOf(node.name) === -1) return;
 
         const callPath = getCallPath(node.parent).join('.');
 
         // comparison guarantees that matching is done with the beginning of call path
         if (block.find(b => callPath.split(b)[0] === '')) {
           context.report({
             node,
             message: callPath + ' not permitted',
             fix: fix ? fixer => fixer.removeRange([node.range[0] - 1, node.range[1]]) : undefined,
           });
         }
       },
     };
   },
 };
 
 function getCallPath(node, path = []) {
   if (node) {
     const nodeName = node.name || (node.property && node.property.name);
     if (node.object) return getCallPath(node.object, [nodeName, ...path]);
     if (node.callee) return getCallPath(node.callee, path);
     return [nodeName, ...path];
   }
   return path;
 }
 