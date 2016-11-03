module.exports = {
  meta: {
    docs: {}
  },

  create: function(context) {
    var regex = /^(describe|it)$/;

    return {
      Identifier: function(node) {
        if (node.name === 'only' && regex.test(node.parent.object.name)) {
          context.report(node, node.parent.object.name + '.only not permitted');
        }
      }
    }
  }
};
