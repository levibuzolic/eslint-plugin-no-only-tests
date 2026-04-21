function focusedTest() {
  return undefined;
}

function testCallback() {
  return undefined;
}

function beforeHook() {
  return undefined;
}

const describe = { only: focusedTest };
const context = { only: focusedTest };
const test = { focus: focusedTest };
const testResource = { only: focusedTest };
const it = {
  default: {
    before() {
      return {
        only: focusedTest,
      };
    },
  },
};

describe("focused suite", testCallback);
context("focused context", testCallback);
test("alternate focus", testCallback);
testResource("wildcard block", testCallback);
it.default.before(beforeHook)("chained block", testCallback);
