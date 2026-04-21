const { defineRule } = require("@oxlint/plugins");

/**
 * @fileoverview Rule to flag use of .only in tests, preventing focused tests being committed accidentally
 * @author Levi Buzolic
 */

/** @typedef {{block?: string[], focus?: string[], functions?: string[], fix?: boolean}} Options */

/** @type {{block: string[], focus: string[], functions: string[], fix: boolean}} */
const defaultOptions = {
  block: [
    "describe",
    "it",
    "context",
    "test",
    "tape",
    "fixture",
    "serial",
    "Feature",
    "Scenario",
    "Given",
    "And",
    "When",
    "Then",
  ],
  focus: ["only"],
  functions: [],
  fix: false,
};

module.exports = defineRule({
  meta: {
    docs: {
      description: "disallow .only blocks in tests",
      category: "Possible Errors",
      recommended: true,
      url: "https://github.com/levibuzolic/eslint-plugin-no-only-tests",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          block: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
            default: defaultOptions.block,
          },
          focus: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
            default: defaultOptions.focus,
          },
          functions: {
            type: "array",
            items: {
              type: "string",
            },
            uniqueItems: true,
            default: defaultOptions.functions,
          },
          fix: {
            type: "boolean",
            default: defaultOptions.fix,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  createOnce(/** @type {import("@oxlint/plugins").Context} */ context) {
    return createOnceVisitors(context);
  },
});

/**
 * @param {import("@oxlint/plugins").Context} context
 * @returns {import("@oxlint/plugins").VisitorWithHooks}
 */
function createOnceVisitors(context) {
  /** @type {string[]} */
  let blocks = defaultOptions.block;
  /** @type {string[]} */
  let focus = defaultOptions.focus;
  /** @type {string[]} */
  let functions = defaultOptions.functions;
  let fix = defaultOptions.fix;

  return {
    before() {
      /** @type {Options} */
      const options = Object.assign({}, defaultOptions, context.options[0]);
      blocks = options.block ?? defaultOptions.block;
      focus = options.focus ?? defaultOptions.focus;
      functions = options.functions ?? defaultOptions.functions;
      fix = !!options.fix;
    },
    Identifier(/** @type {any} */ node) {
      if (functions.length && functions.indexOf(node.name) > -1) {
        context.report({
          node: /** @type {import("@oxlint/plugins").Ranged} */ (node),
          message: `${node.name} not permitted`,
        });
      }

      const parentObject = "object" in node.parent ? node.parent.object : undefined;
      if (parentObject == null) return;
      if (focus.indexOf(node.name) === -1) return;

      const callPath = getCallPath(node.parent).join(".");

      // comparison guarantees that matching is done with the beginning of call path
      if (
        blocks.find((block) => {
          // Allow wildcard tail matching of blocks when ending in a `*`
          if (block.endsWith("*")) return callPath.startsWith(block.replace(/\*$/, ""));
          return callPath.startsWith(`${block}.`);
        })
      ) {
        const rangeStart = node.range?.[0];
        const rangeEnd = node.range?.[1];

        context.report({
          node: /** @type {import("@oxlint/plugins").Ranged} */ (node),
          message: `${callPath} not permitted`,
          fix:
            fix && rangeStart != null && rangeEnd != null
              ? (fixer) => fixer.removeRange([rangeStart - 1, rangeEnd])
              : undefined,
        });
      }
    },
  };
}

/**
 *
 * @param {import('estree').Node} node
 * @param {string[]} path
 * @returns
 */
function getCallPath(node, path = []) {
  if (node) {
    const nodeName =
      "name" in node && node.name
        ? node.name
        : "property" in node && node.property && "name" in node.property
          ? node.property?.name
          : undefined;
    if ("object" in node && node.object && nodeName)
      return getCallPath(node.object, [nodeName, ...path]);
    if ("callee" in node && node.callee) return getCallPath(node.callee, path);
    if (nodeName) return [nodeName, ...path];
    return path;
  }
  return path;
}
