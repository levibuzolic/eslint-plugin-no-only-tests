const rules = require('./index').rules;
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();

ruleTester.run('no-only-tests', rules['no-only-tests'], {
  valid: [
    'describe("Some describe block", function() {});',
    'it("Some assertion", function() {});',
    'xit.only("Some assertion", function() {});',
    'xdescribe.only("Some describe block", function() {});',
    'xcontext.only("A context block", function() {});',
    'xtape.only("A tape block", function() {});',
    'xtest.only("A test block", function() {});',
    'other.only("An other block", function() {});',
    'testResource.only("A test resource block", function() {});',
    'var args = {only: "test"};',
    'it("should pass meta only through", function() {});',
    'obscureTestBlock.only("An obscure testing library test works unless options are supplied", function() {});',
    {
      options: [{block: ['it']}],
      code: 'test.only("Options will exclude this from being caught", function() {});',
    },
    {
      options: [{focus: ['focus']}],
      code: 'test.only("Options will exclude this from being caught", function() {});',
    },
  ],

  invalid: [
    {
      code: 'describe.only("Some describe block", function() {});',
      output: 'describe.only("Some describe block", function() {});',
      errors: [{message: 'describe.only not permitted'}],
    },
    {
      code: 'it.only("Some assertion", function() {});',
      output: 'it.only("Some assertion", function() {});',
      errors: [{message: 'it.only not permitted'}],
    },
    {
      code: 'context.only("Some context", function() {});',
      output: 'context.only("Some context", function() {});',
      errors: [{message: 'context.only not permitted'}],
    },
    {
      code: 'test.only("Some test", function() {});',
      output: 'test.only("Some test", function() {});',
      errors: [{message: 'test.only not permitted'}],
    },
    {
      code: 'tape.only("A tape", function() {});',
      output: 'tape.only("A tape", function() {});',
      errors: [{message: 'tape.only not permitted'}],
    },
    {
      code: 'fixture.only("A fixture", function() {});',
      output: 'fixture.only("A fixture", function() {});',
      errors: [{message: 'fixture.only not permitted'}],
    },
    {
      code: 'serial.only("A serial test", function() {});',
      output: 'serial.only("A serial test", function() {});',
      errors: [{message: 'serial.only not permitted'}],
    },
    {
      options: [{block: ['obscureTestBlock']}],
      code: 'obscureTestBlock.only("An obscure testing library test", function() {});',
      output: 'obscureTestBlock.only("An obscure testing library test", function() {});',
      errors: [{message: 'obscureTestBlock.only not permitted'}],
    },
    {
      options: [{block: ['ava.default']}],
      code: 'ava.default.only("Block with dot", function() {});',
      output: 'ava.default.only("Block with dot", function() {});',
      errors: [{message: 'ava.default.only not permitted'}],
    },
    {
      code: 'it.default.before(console.log).only("Some describe block", function() {});',
      output: 'it.default.before(console.log).only("Some describe block", function() {});',
      errors: [{message: 'it.default.before.only not permitted'}],
    },
    {
      options: [{focus: ['focus']}],
      code: 'test.focus("An alternative focus function", function() {});',
      output: 'test.focus("An alternative focus function", function() {});',
      errors: [{message: 'test.focus not permitted'}],
    },
    // As above, but with fix: true option to enable auto-fixing
    {
      options: [{fix: true}],
      code: 'describe.only("Some describe block", function() {});',
      output: 'describe("Some describe block", function() {});',
      errors: [{message: 'describe.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'it.only("Some assertion", function() {});',
      output: 'it("Some assertion", function() {});',
      errors: [{message: 'it.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'context.only("Some context", function() {});',
      output: 'context("Some context", function() {});',
      errors: [{message: 'context.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'test.only("Some test", function() {});',
      output: 'test("Some test", function() {});',
      errors: [{message: 'test.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'tape.only("A tape", function() {});',
      output: 'tape("A tape", function() {});',
      errors: [{message: 'tape.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'fixture.only("A fixture", function() {});',
      output: 'fixture("A fixture", function() {});',
      errors: [{message: 'fixture.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'serial.only("A serial test", function() {});',
      output: 'serial("A serial test", function() {});',
      errors: [{message: 'serial.only not permitted'}],
    },
    {
      options: [{block: ['obscureTestBlock'], fix: true}],
      code: 'obscureTestBlock.only("An obscure testing library test", function() {});',
      output: 'obscureTestBlock("An obscure testing library test", function() {});',
      errors: [{message: 'obscureTestBlock.only not permitted'}],
    },
    {
      options: [{block: ['ava.default'], fix: true}],
      code: 'ava.default.only("Block with dot", function() {});',
      output: 'ava.default("Block with dot", function() {});',
      errors: [{message: 'ava.default.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'it.default.before(console.log).only("Some describe block", function() {});',
      errors: [{message: 'it.default.before.only not permitted'}],
      output: 'it.default.before(console.log)("Some describe block", function() {});',
    },
    {
      options: [{focus: ['focus'], fix: true}],
      code: 'test.focus("An alternative focus function", function() {});',
      output: 'test("An alternative focus function", function() {});',
      errors: [{message: 'test.focus not permitted'}],
    },
    {
      options: [{block: ['test*']}],
      code: 'testResource.only("A test resource block", function() {});',
      output: 'testResource.only("A test resource block", function() {});',
      errors: [{message: 'testResource.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'Feature.only("Some Feature", function() {});',
      output: 'Feature("Some Feature", function() {});',
      errors: [{message: 'Feature.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'Scenario.only("Some Scenario", function() {});',
      output: 'Scenario("Some Scenario", function() {});',
      errors: [{message: 'Scenario.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'Given.only("Some assertion", function() {});',
      output: 'Given("Some assertion", function() {});',
      errors: [{message: 'Given.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'And.only("Some assertion", function() {});',
      output: 'And("Some assertion", function() {});',
      errors: [{message: 'And.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'When.only("Some assertion", function() {});',
      output: 'When("Some assertion", function() {});',
      errors: [{message: 'When.only not permitted'}],
    },
    {
      options: [{fix: true}],
      code: 'Then.only("Some assertion", function() {});',
      output: 'Then("Some assertion", function() {});',
      errors: [{message: 'Then.only not permitted'}],
    },
  ],
});

console.log('Tests completed successfully');
