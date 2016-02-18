module.exports = function(context) {
  return {
    CallExpression: function(node) {
      if (context.getSource(node).match(/[it|describe]\.only/)) {
        context.report(node, '.only mocha test block found');
      }
    }
  };
};

module.exports.schema = [];
