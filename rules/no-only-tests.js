/**
 * @fileoverview Rule to prevent use of focused test blocks, preventing accidental commits that only run a subset of tests
 * @author Levi Buzolic
 */

const defaultOptions = {
	matchers: [
		"{describe,it,context,test,tape,fixture,serial,Feature,Scenario,Given,And,When,Then}.only",
	],
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",
		docs: {
			description: "Disallow focused tests",
			category: "Possible Errors",
			recommended: true,
			url: "https://github.com/levibuzolic/eslint-plugin-no-only-tests",
		},
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					matchers: {
						type: "array",
						items: {
							type: "string",
						},
						uniqueItems: true,
						default: defaultOptions.matchers,
					},
					fix: {
						type: "boolean",
						default: false,
					},
					block: {
						type: "array",
						items: {
							type: "string",
						},
						uniqueItems: true,
						default: [],
						deprecated: "Use `matchers` option instead",
					},
					focus: {
						type: "array",
						items: {
							type: "string",
						},
						uniqueItems: true,
						default: [],
						deprecated: "Use `matchers` option instead",
					},
				},
				additionalProperties: false,
				default: {},
			},
		],
	},
	create(context) {
		console.log("==========", context.options[0]);
		return {};
		const providedOptions = context.options[0];

		if (providedOptions?.block || providedOptions?.focus) {
			const blocks = providedOptions.block ?? [
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
			];
			const focus = providedOptions.focus ?? ["only"];

			console.log("==========", providedOptions);

			const migratedConfig = {
				fix: providedOptions?.fix,
				matchers: [
					// ...(providedOptions?.matchers ?? []),
					[matcherGroup(blocks), matcherGroup(focus)]
						.filter(Boolean)
						.join("."),
				],
			};
			console.warn(
				`The \`block\` and \`focus\` options of \`eslint-no-only-tests\` are deprecated, please use the \`matchers\` option instead. This should provide a more expressive way to define the test methods you want to prevent. Here’s the equivalent of your current configuration:\n${JSON.stringify(migratedConfig)}`,
			);
		}

		const options = Object.assign({}, defaultOptions, providedOptions);

		const fix = !!options.fix;

		const blocks = [];
		const focus = [];

		return {
			Identifier(node) {
				const parentObject = node.parent?.object;
				if (parentObject == null) return;
				if (focus.indexOf(node.name) === -1) return;

				const callPath = getCallPath(node.parent).join(".");

				// comparison guarantees that matching is done with the beginning of call path
				if (
					blocks.find((block) => {
						// Allow wildcard tail matching of blocks when ending in a `*`
						if (block.endsWith("*"))
							return callPath.startsWith(block.replace(/\*$/, ""));
						return callPath.startsWith(`${block}.`);
					})
				) {
					context.report({
						node,
						message: `${callPath} not permitted`,
						fix: fix
							? (fixer) => fixer.removeRange([node.range[0] - 1, node.range[1]])
							: undefined,
					});
				}
			},
		};
	},
};

function getCallPath(node, path = []) {
	if (node) {
		const nodeName = node.name || node.property?.name;
		if (node.object) return getCallPath(node.object, [nodeName, ...path]);
		if (node.callee) return getCallPath(node.callee, path);
		return [nodeName, ...path];
	}
	return path;
}

/**
 * @param {string[]} items
 * @returns {string | undefined}
 */
function matcherGroup(items) {
	const uniqueItems = [...new Set(items)];
	if (uniqueItems.length <= 1) return uniqueItems[0];
	return `{${uniqueItems.join(",")}}`;
}
