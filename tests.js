const rules = require('./index').rules;
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();

ruleTester.run('no-only-tests', rules['no-only-tests'], {
  valid: [
    {code: 'describe("Some describe block", function() {});'},
    {code: 'it("Some assertion", function() {});'},
    {code: 'xit.only("Some assertion", function() {});'},
    {code: 'xdescribe.only("Some describe block", function() {});'},
    {code: 'xcontext.only("A context block", function() {});'},
    {code: 'xtape.only("A tape block", function() {});'},
    {code: 'xtest.only("A test block", function() {});'},
    {code: 'other.only("An other block", function() {});'}
  ],

  invalid: [{
    code: 'describe.only("Some describe block", function() {});',
    errors: [{message: 'describe.only not permitted'}]
  }, {
    code: 'it.only("Some assertion", function() {});',
    errors: [{message: 'it.only not permitted'}]
  }, {
    code: 'context.only("Some context", function() {});',
    errors: [{message: 'context.only not permitted'}]
  }, {
    code: 'test.only("Some test", function() {});',
    errors: [{message: 'test.only not permitted'}]
  }, {
    code: 'tape.only("A tape", function() {});',
    errors: [{message: 'tape.only not permitted'}]
  }]
});

console.log('Tests completed successfully');
