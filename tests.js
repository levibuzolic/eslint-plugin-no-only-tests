var rules = require('./index').rules;
RuleTester = require('eslint').RuleTester;
var ruleTester = new RuleTester();

ruleTester.run('no-only-tests', rules['no-only-tests'], {
  valid: [
    {
      code: 'describe("Some describe block", function() {});'
    }, {
      code: 'it("Some assertion", function() {});'
    }
  ],

  invalid: [
    {
      code: 'describe.only("Some describe block", function() {});',
      errors: [{
        message: '.only mocha test block found'
      }]
    }, {
      code: 'it.only("Some assertion", function() {});',
      errors: [{
        message: '.only mocha test block found'
      }]
    }
  ]
});

console.log('Tests completed successfully');
