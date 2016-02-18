var rules = require('./index').rules;
RuleTester = require('eslint').RuleTester;
var ruleTester = new RuleTester();

ruleTester.run('no-only-tests', rules['no-only-tests'], {
  valid: [
    {
      code: 'describe("Some describe block", function() {});'
    }, {
      code: 'it("Some assertion", function() {});'
    }, {
      code: 'xit.only("Some assertion", function() {});'
    }, {
      code: 'xdescribe.only("Some describe block", function() {});'
    }
  ],

  invalid: [
    {
      code: 'describe.only("Some describe block", function() {});',
      errors: [{
        message: 'describe.only not permitted'
      }]
    }, {
      code: 'it.only("Some assertion", function() {});',
      errors: [{
        message: 'it.only not permitted'
      }]
    }
  ]
});

console.log('Tests completed successfully');
