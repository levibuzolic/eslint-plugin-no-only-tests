var rule = require('./rules/no-only-tests'),
RuleTester = require('eslint').RuleTester;
var ruleTester = new RuleTester();
ruleTester.run('no-only-tests', rule, {
  valid: [
    {
      code: 'describe("Some describe block", function() {});'
    }
  ],

  invalid: [
    {
      code: 'describe.only("Some describe block", function() {});',
      errors: [{
        message: '.only mocha test block found'
      }]
    }
  ]
});
