export default function (babel) {
  const { types: t } = babel;

  /**
   * t.isFunctionExpression() || t.isArrowFunctionExpression()
   */
  function isAnyFunctionExpression() {
    return t.isFunctionExpression.apply(t, arguments) || t.isArrowFunctionExpression.apply(t, arguments);
  }

  function isAction(node, actionIdentifier, mobxNamespaceIdentifier) {
    return (actionIdentifier && t.isIdentifier(node, {name: actionIdentifier})) ||
        (
          mobxNamespaceIdentifier &&
          t.isMemberExpression(node) &&
          t.isIdentifier(node.object, {name: mobxNamespaceIdentifier}) &&
          t.isIdentifier(node.property, {name: "action"})
        )
  }

  const traverseActionBody = {
    ["FunctionExpression|ArrowFunctionExpression"](path) {
      const actionIdentifier = this.actionIdentifier;
      const mobxNamespaceIdentifier = this.mobxNamespaceIdentifier;
      path.get('body').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
      path.skip()
      for (let currentPath = path.parentPath; t.isCallExpression(currentPath.node); currentPath = currentPath.parentPath) {
        if (isAction(currentPath.node.callee, actionIdentifier, mobxNamespaceIdentifier)) {
          return;
        }
      }
      path.replaceWith(t.CallExpression(
        this.actionIdentifier
          ? t.Identifier(this.actionIdentifier)
          : t.MemberExpression(t.Identifier(this.mobxNamespaceIdentifier), t.Identifier("action"))
        ,
        [path.node]
      ));
    }
  };

  const traverseSibling = {
    CallExpression(path) {
      const node = path.node;
      const actionIdentifier = this.actionIdentifier;
      const mobxNamespaceIdentifier = this.mobxNamespaceIdentifier;
      if (isAction(node.callee, actionIdentifier, mobxNamespaceIdentifier)) {
        if (node.arguments.length === 1) {
          path.get('arguments.0').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
          path.skip();
        } else if (node.arguments.length === 2) {
          path.get('arguments.1').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
          path.skip();
        }
      }
    },

    ["ClassMethod|ClassProperty"](path) {
      const actionIdentifier = this.actionIdentifier;
      const mobxNamespaceIdentifier = this.mobxNamespaceIdentifier;
      if (path.node.decorators) {
        for (const {expression} of path.node.decorators) {
          if (
            isAction(expression, actionIdentifier, mobxNamespaceIdentifier) ||
            (t.isCallExpression(expression) && isAction(expression.callee, actionIdentifier, mobxNamespaceIdentifier))
          ) {
            if (t.isClassMethod(path.node)) {
              path.get('body').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
              path.skip();
            } else if (t.isClassProperty(path.node) && isAnyFunctionExpression(path.node.value)) {
              path.get('value').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
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
            let actionIdentifier;
            let mobxNamespaceIdentifier;
            if (t.isImportNamespaceSpecifier(specifier) || (specifier.imported.name === "action")) {
              if (t.isImportNamespaceSpecifier(specifier)) {
                mobxNamespaceIdentifier = specifier.local.name;
              } else if (specifier.imported.name === "action") {
                actionIdentifier = specifier.local.name;
              }
              for (let index = path.key + 1; index < path.container.length; index++) {
                path.getSibling(index).traverse(traverseSibling, {actionIdentifier, mobxNamespaceIdentifier});
              }
            }
          }
        }
      }
    }
  };
}
