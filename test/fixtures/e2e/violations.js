function focusedTest() {
  return undefined;
}

function testCallback() {
  return undefined;
}

const describe = { only: focusedTest };
const context = { only: focusedTest };
const test = { only: focusedTest, focus: focusedTest };
const obscureTestBlock = { only: focusedTest };
const testResource = { only: focusedTest };
const other = { only: focusedTest };

describe.only("focused suite", testCallback);
context.only("focused context", testCallback);
test.focus("alternate focus", testCallback);
obscureTestBlock.only("custom block", testCallback);
testResource.only("wildcard block", testCallback);
fit("focused function", testCallback);
other.only("non-test helper", testCallback);
