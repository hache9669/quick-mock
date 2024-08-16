// eslint/rules/require-create-route-handlers-import.js

module.exports = {
    meta: {
      type: 'problem',
      docs: {
        description: 'Require import of createRouteHandlers in route files',
      },
      schema: [], // options not needed
    },
    create(context) {
      return {
        Program(node) {
          const hasCreateRouteHandlersImport = node.body.some(statement => {
            return (
              statement.type === 'ImportDeclaration' &&
              statement.source.value === 'quick-mock' && 
              statement.specifiers.some(specifier => specifier.imported.name === 'CreateRouteHandlers')
            );
          });
  
          if (!hasCreateRouteHandlersImport) {
            context.report({
              node,
              message: "Route files must use 'CreateRouteHandlers'",
            });
          }
        },
      };
    },
  };
  