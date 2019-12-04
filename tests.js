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
      errors: [{message: 'describe.only not permitted'}],
    },
    {
      code: 'it.only("Some assertion", function() {});',
      errors: [{message: 'it.only not permitted'}],
    },
    {
      code: 'context.only("Some context", function() {});',
      errors: [{message: 'context.only not permitted'}],
    },
    {
      code: 'test.only("Some test", function() {});',
      errors: [{message: 'test.only not permitted'}],
    },
    {
      code: 'tape.only("A tape", function() {});',
      errors: [{message: 'tape.only not permitted'}],
    },
    {
      code: 'fixture.only("A fixture", function() {});',
      errors: [{message: 'fixture.only not permitted'}],
    },
    {
      code: 'serial.only("A serial test", function() {});',
      errors: [{message: 'serial.only not permitted'}],
    },
    {
      options: [{block: ['obscureTestBlock']}],
      code: 'obscureTestBlock.only("An obscure testing library test", function() {});',
      errors: [{message: 'obscureTestBlock.only not permitted'}],
    },
    {
      options: [{block: ['ava.default']}],
      code: 'ava.default.only("Block with dot", function() {});',
      errors: [{message: 'ava.default.only not permitted'}],
    },
    {
      options: [{focus: ['focus']}],
      code: 'test.focus("An alternative focus function", function() {});',
      errors: [{message: 'test.focus not permitted'}],
    },
  ],
});

console.log('Tests completed successfully');
