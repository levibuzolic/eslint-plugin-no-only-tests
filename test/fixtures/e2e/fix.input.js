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

describe.only("focused suite", testCallback);
context.only("focused context", testCallback);
test.focus("alternate focus", testCallback);
testResource.only("wildcard block", testCallback);
it.default.before(beforeHook).only("chained block", testCallback);
