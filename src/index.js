export default function (babel) {
  const { types: t } = babel;

  /**
   * t.isFunctionExpression() || t.isArrowFunctionExpression()
   */
  function isAnyFunctionExpression() {
    return t.isFunctionExpression.apply(t, arguments) || t.isArrowFunctionExpression.apply(t, arguments);
  }

  const traverseActionBody = {
    CallExpression(path) {
      const node = path.node;
      const actionIdentifier = this.actionIdentifier;
      if (node.callee.name === actionIdentifier) {
      	if (
          (node.arguments.length === 1 && isAnyFunctionExpression(node.arguments[0])) ||
          (node.arguments.length === 2 && isAnyFunctionExpression(node.arguments[1]))
        ) {
          path.skip();
        }
      }
    },
    ["FunctionExpression|ArrowFunctionExpression"](path) {
      path.replaceWith(t.CallExpression(
        t.Identifier(this.actionIdentifier),
        [path.node]
      ));
    }
  };

  const traverseSibling = {
  	CallExpression(path) {
      console.log("here");
      const node = path.node;
      const actionIdentifier = this.actionIdentifier;
      if (node.callee.name === actionIdentifier) {
      	if (node.arguments.length === 1 && isAnyFunctionExpression(node.arguments[0])) {
          path.get('arguments.0').traverse(traverseActionBody, {actionIdentifier})
          path.skip();
        } else if (node.arguments.length === 2 && isAnyFunctionExpression(node.arguments[1])) {
          path.get('arguments.1').traverse(traverseActionBody, {actionIdentifier})
          path.skip();
        }
      }
    },

    ["ClassMethod|ClassProperty"](path) {
      const actionIdentifier = this.actionIdentifier;
      if (path.node.decorators) {
      	for (const decorator of path.node.decorators) {
          if (
            t.isIdentifier(decorator.expression, {name: actionIdentifier}) ||
            (
              t.isCallExpression(decorator.expression) &&
              t.isIdentifier(decorator.expression.callee, {name: actionIdentifier})
            )
          ) {
            if (t.isClassMethod(path.node)) {
              path.get('body').traverse(traverseActionBody, {actionIdentifier})
              path.skip();
            } else if (t.isClassProperty(path.node) && isAnyFunctionExpression(path.node.value)) {
              path.get('value').traverse(traverseActionBody, {actionIdentifier})
              path.skip();
            }
          }
        }
      }
    },
  };

  return {
    name: "mobx-make-action-deep-transform", // not required
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === "mobx") {
          for (const specifier of path.node.specifiers) {
          	if (specifier.imported.name === "action") {
              const actionIdentifier = specifier.local.name;
              for (let index = path.key + 1; index < path.container.length; index++) {
                path.getSibling(index).traverse(traverseSibling, {actionIdentifier});
              }
              path.stop()
            }
          }
        }
      }
    }
  };
}
