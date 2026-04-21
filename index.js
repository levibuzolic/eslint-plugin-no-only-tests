const { eslintCompatPlugin } = require("@oxlint/plugins");

module.exports = eslintCompatPlugin({
	meta: {
		name: "no-only-tests",
	},
	rules: {
		"no-only-tests": require("./rules/no-only-tests"),
	},
});
