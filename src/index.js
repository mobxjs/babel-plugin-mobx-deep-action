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
          t.isMemberExpression(node) &&
          t.isIdentifier(node.object, {name: 'action'}) &&
          t.isIdentifier(node.property, {name: "bound"})
        ) ||
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
      path.traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
      path.skip()
      // if current node parent is call expression and this call is action call, skip wrapping
      if (t.isCallExpression(path.parentPath.node) && isAction(path.parentPath.node.callee, actionIdentifier, mobxNamespaceIdentifier)) {
        return;
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
      const explicitClasses = this.classes;
      const classDeclaration = path.findParent(p => p.isClassDeclaration())
      // If there is an explicit classes with actions, handle them separately
      if (
        explicitClasses &&
        t.isIdentifier(classDeclaration.node.id) &&
        void 0 !== explicitClasses[classDeclaration.node.id.name] &&
        t.isClassMethod(path.node) &&
        t.isIdentifier(path.node.key) &&
        (
          // all code inside constructor should be handled as action too, because it could contain other action creations
          path.node.key.name === "constructor" ||
          void 0 !== explicitClasses[classDeclaration.node.id.name][path.node.key.name]
        )
      ) {
        if (path.node.key.name === "constructor") {
          path.get('body').get('body').forEach(cPath => {
            if (cPath.isExpressionStatement()) {
              const exprPath = cPath.get('expression')
              if (exprPath.isAssignmentExpression() && exprPath.get('operator').node === '=') {
                const leftPath = exprPath.get('left')
                const rightPath = exprPath.get('right')
                if (
                  leftPath.isMemberExpression() &&
                  leftPath.get('object').isThisExpression() &&
                  leftPath.get('property').isIdentifier() &&
                  leftPath.get('property').node.name in explicitClasses[classDeclaration.node.id.name] &&
                  (rightPath.isArrowFunctionExpression() || rightPath.isFunctionExpression())
                ) {
                  rightPath.get('body').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
                }
              }
            }
          })
        } else {
          path.get('body').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
        }
        path.skip();
      } else if (path.node.decorators) {
        for (const {expression} of path.node.decorators) {
          if (
            isAction(expression, actionIdentifier, mobxNamespaceIdentifier) ||
            (t.isCallExpression(expression) && isAction(expression.callee, actionIdentifier, mobxNamespaceIdentifier))
          ) {
            if (t.isClassMethod(path.node)) {
              path.get('body').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
              path.skip();
            } else if (t.isClassProperty(path.node)) {
              path.get('value').traverse(traverseActionBody, {actionIdentifier, mobxNamespaceIdentifier})
              path.skip();
            }
          }
        }
      }
    },
  };

  return {
    name: "mobx-deep-action-transform",
    visitor: {
      Program(path, state) {
        let actionIdentifier;
        let mobxNamespaceIdentifier;
        let tslibNamespaceIdentifier;
        const mobxPackage = state.opts && state.opts["mobx-package"] || "mobx"
        path.traverse({
          ImportDeclaration(path) {
            if (path.node.source.value === mobxPackage) {
              for (const specifier of path.node.specifiers) {
                if (t.isImportNamespaceSpecifier(specifier) || (specifier.imported.name === "action")) {
                  if (t.isImportNamespaceSpecifier(specifier)) {
                    mobxNamespaceIdentifier = specifier.local.name;
                  } else if (specifier.imported.name === "action") {
                    actionIdentifier = specifier.local.name;
                  }
                }
              }
            }
            if (path.node.source.value === "tslib") {
              for (const specifier of path.node.specifiers) {
                if (t.isImportNamespaceSpecifier(specifier)) {
                  tslibNamespaceIdentifier = specifier.local.name
                }
              }
            }
          }
        })
        const context = {actionIdentifier, mobxNamespaceIdentifier}
        path.traverse(traverseSibling, context)
        const toTraverse = [];
        /**
         * Lookup for typescript decorators, and handle them separately
         */
        path.traverse({
          CallExpression(path) {
            const node = path.node
            if (
              t.isMemberExpression(node.callee) &&
              t.isIdentifier(node.callee.object, {name: tslibNamespaceIdentifier}) &&
              t.isIdentifier(node.callee.property, {name: "__decorate"}) &&
              node.arguments.length === 4 &&
              t.isArrayExpression(node.arguments[0]) &&
              (
                node.arguments[0].elements.some(e => t.isIdentifier(e, {name: actionIdentifier})) ||
                node.arguments[0].elements.some(e =>
                  t.isMemberExpression(e) &&
                  t.isIdentifier(e.object, {name: mobxNamespaceIdentifier}) &&
                  t.isIdentifier(e.property, {name: "action"})
                )
              ) &&
              t.isMemberExpression(node.arguments[1]) &&
              t.isIdentifier(node.arguments[1].property, {name: "prototype"}) &&
              t.isStringLiteral(node.arguments[2])
            ) {
              const className = node.arguments[1].object.name
              const methodName = node.arguments[2].value
              const traversePath = path.getStatementParent().parentPath
              const existsTraverseRequest = toTraverse.find(e => e.path === traversePath)
              if (!existsTraverseRequest) {
                toTraverse.push({
                  path: traversePath,
                  classes: {
                    [className]: {[methodName]: methodName}
                  }
                })
              } else {
                const existsClassRequest = existsTraverseRequest.classes[className]
                if (!existsClassRequest) {
                  existsTraverseRequest.classes[className] = {[methodName]: methodName}
                } else {
                  existsTraverseRequest.classes[className][methodName] = methodName
                }
              }
            }
          }
        })
        toTraverse.forEach(({path, classes}) => path.traverse(traverseSibling, {...context, classes}))
      },
    }
  };
}
