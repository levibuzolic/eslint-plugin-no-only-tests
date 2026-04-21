const { definePlugin, eslintCompatPlugin } = require("@oxlint/plugins");

/** @type {import("@oxlint/plugins").Plugin} */
const plugin = definePlugin({
  meta: {
    name: "no-only-tests",
  },
  rules: {
    "no-only-tests": require("./rules/no-only-tests"),
  },
});

module.exports =
  /** @type {import("@oxlint/plugins").Plugin & import("eslint").ESLint.Plugin} */ (
    eslintCompatPlugin(plugin)
  );
