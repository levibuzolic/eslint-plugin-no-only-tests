import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const testRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testRoot, "..");

const output = execFileSync("bun", ["pm", "pack", "--dry-run"], {
  cwd: repoRoot,
  encoding: "utf8",
});

const packedFiles = output
  .split("\n")
  .map((/** @type {string} */ line) => line.trim())
  .filter((/** @type {string} */ line) => line.startsWith("packed "))
  .map((/** @type {string} */ line) => {
    const match = /^packed\s+.+?\s+(.+)$/.exec(line);

    assert.ok(match, `Could not parse packed file line: ${line}`);
    return /** @type {RegExpExecArray} */ (match)[1];
  });

const expectedFiles = [
  "LICENSE",
  "README.md",
  "index.js",
  "package.json",
  "rules/no-only-tests.js",
];

assert.deepEqual(
  packedFiles.sort(),
  expectedFiles.slice().sort(),
  `Published package contents changed.\nExpected: ${expectedFiles.join(", ")}\nActual: ${packedFiles.join(", ")}`,
);

process.stderr.write("\n✅ Package contents verified\n");
