import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {"eslint" | "oxlint"} LinterName */
/** @typedef {{block?: string[], focus?: string[], functions?: string[], fix?: boolean}} RuleOptions */
/** @typedef {{name: string, expectedCount: number, options?: RuleOptions}} CountCase */

const testRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testRoot, "..");
const fixturesDir = join(testRoot, "fixtures", "e2e");
const pluginPath = join(repoRoot, "index.js");
const eslintBin = join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "eslint.cmd" : "eslint",
);
const oxlintBin = join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "oxlint.cmd" : "oxlint",
);

/** @type {CountCase[]} */
const countCases = [
  {
    name: "default options",
    expectedCount: 2,
  },
  {
    name: "custom focus and functions",
    expectedCount: 4,
    options: {
      focus: ["only", "focus"],
      functions: ["fit"],
    },
  },
  {
    name: "custom blocks with wildcard matching",
    expectedCount: 6,
    options: {
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
        "obscureTestBlock",
        "test*",
      ],
      focus: ["only", "focus"],
      functions: ["fit"],
    },
  },
];

/** @type {RuleOptions} */
const fixOptions = {
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
    "test*",
  ],
  focus: ["only", "focus"],
  fix: true,
};

runCountTests("eslint");
runCountTests("oxlint");
runFixTests("eslint");
runFixTests("oxlint");

process.stderr.write("\n✅ E2E tests completed successfully\n");

/**
 * @param {LinterName} linter
 */
function runCountTests(linter) {
  for (const testCase of countCases) {
    withWorkspace((workspace) => {
      const fileName = "violations.js";
      copyFixture("violations.js", workspace, fileName);

      const result = runLinter(linter, workspace, fileName, testCase.options, false);
      const diagnostics = parseDiagnostics(linter, result.stdout);

      assert.equal(
        result.status,
        expectedExitStatus(testCase.expectedCount),
        `${linter} should exit with ${expectedExitStatus(testCase.expectedCount)} for ${testCase.name}`,
      );
      assert.equal(
        diagnostics.length,
        testCase.expectedCount,
        `${linter} should report ${testCase.expectedCount} diagnostics for ${testCase.name}`,
      );
    });
  }
}

/**
 * @param {LinterName} linter
 */
function runFixTests(linter) {
  withWorkspace((workspace) => {
    const fileName = "fix-target.js";
    copyFixture("fix.input.js", workspace, fileName);

    const beforeFix = runLinter(linter, workspace, fileName, fixOptions, false);
    const beforeDiagnostics = parseDiagnostics(linter, beforeFix.stdout);

    assert.equal(beforeFix.status, 1, `${linter} should fail before applying fixes`);
    assert.equal(beforeDiagnostics.length, 5, `${linter} should report five fixable diagnostics`);

    runLinter(linter, workspace, fileName, fixOptions, true);

    const actualOutput = readFileSync(join(workspace, fileName), "utf8");
    const expectedOutput = readFixture("fix.output.js");

    assert.equal(actualOutput, expectedOutput, `${linter} should rewrite the file as expected`);

    const afterFix = runLinter(linter, workspace, fileName, fixOptions, false);
    const afterDiagnostics = parseDiagnostics(linter, afterFix.stdout);

    assert.equal(afterFix.status, 0, `${linter} should pass after applying fixes`);
    assert.equal(afterDiagnostics.length, 0, `${linter} should have no diagnostics after fixing`);
  });
}

/**
 * @param {LinterName} linter
 * @param {string} workspace
 * @param {string} fileName
 * @param {RuleOptions | undefined} options
 * @param {boolean} fix
 */
function runLinter(linter, workspace, fileName, options, fix) {
  if (linter === "eslint") {
    writeEslintConfig(workspace, options);
    return runCommand(eslintBin, [...(fix ? ["--fix"] : []), "-f", "json", fileName], workspace);
  }

  writeOxlintConfig(workspace, options);
  return runCommand(
    oxlintBin,
    ["-c", ".oxlintrc.json", ...(fix ? ["--fix"] : []), "-f", "json", fileName],
    workspace,
  );
}

/**
 * @param {string} workspace
 * @param {RuleOptions | undefined} options
 */
function writeEslintConfig(workspace, options) {
  const ruleConfig = serializeRuleConfig(options);
  writeFileSync(
    join(workspace, "eslint.config.js"),
    `module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    plugins: {
      "no-only-tests": require(${JSON.stringify(pluginPath)}),
    },
    rules: {
      "no-only-tests/no-only-tests": ${ruleConfig},
    },
  },
];
`,
  );
}

/**
 * @param {string} workspace
 * @param {RuleOptions | undefined} options
 */
function writeOxlintConfig(workspace, options) {
  writeFileSync(
    join(workspace, ".oxlintrc.json"),
    JSON.stringify(
      {
        jsPlugins: [pluginPath],
        rules: {
          "no-only-tests/no-only-tests": buildRuleConfig(options),
        },
      },
      null,
      2,
    ),
  );
}

/**
 * @param {RuleOptions | undefined} options
 */
function buildRuleConfig(options) {
  return options ? ["error", options] : "error";
}

/**
 * @param {RuleOptions | undefined} options
 */
function serializeRuleConfig(options) {
  return JSON.stringify(buildRuleConfig(options), null, 2);
}

/**
 * @param {LinterName} linter
 * @param {string} stdout
 */
function parseDiagnostics(linter, stdout) {
  const parsed = JSON.parse(stdout);

  if (linter === "eslint") {
    assert.ok(Array.isArray(parsed), "ESLint JSON output should be an array");
    assert.equal(parsed.length, 1, "ESLint should only report on the target file");
    const fileResult = parsed[0];

    assert.ok(fileResult, "ESLint should return a file result");
    assert.ok(Array.isArray(fileResult.messages), "ESLint file result should include messages");

    for (const message of fileResult.messages) {
      assert.equal(
        message.ruleId,
        "no-only-tests/no-only-tests",
        "ESLint should only report diagnostics from this rule",
      );
    }

    return fileResult.messages;
  }

  assert.ok(parsed && typeof parsed === "object", "Oxlint JSON output should be an object");
  assert.ok("diagnostics" in parsed, "Oxlint JSON output should include diagnostics");
  const diagnostics = parsed.diagnostics;

  assert.ok(Array.isArray(diagnostics), "Oxlint diagnostics should be an array");

  for (const diagnostic of diagnostics) {
    assert.equal(
      diagnostic.code,
      "no-only-tests(no-only-tests)",
      "Oxlint should only report diagnostics from this rule",
    );
  }

  return diagnostics;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {string} cwd
 */
function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
  });

  if (result.error) throw result.error;

  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

/**
 * @param {string} fixtureName
 * @param {string} workspace
 * @param {string} outputName
 */
function copyFixture(fixtureName, workspace, outputName) {
  copyFileSync(join(fixturesDir, fixtureName), join(workspace, outputName));
}

/**
 * @param {string} fixtureName
 */
function readFixture(fixtureName) {
  return readFileSync(join(fixturesDir, fixtureName), "utf8");
}

/**
 * @param {(workspace: string) => void} fn
 */
function withWorkspace(fn) {
  const workspace = mkdtempSync(join(tmpdir(), "no-only-tests-e2e-"));

  try {
    fn(workspace);
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}

/**
 * @param {number} diagnosticCount
 */
function expectedExitStatus(diagnosticCount) {
  return diagnosticCount > 0 ? 1 : 0;
}
