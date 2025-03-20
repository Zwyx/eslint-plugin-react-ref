/** @type {import('@types/eslint').Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",
		docs: {
			description: "Warn when a useRef variable is being used incorrectly.",
			url: "https://github.com/Zwyx/eslint-plugin-react-ref#ref-usage",
		},
		fixable: "code",
		schema: [],
		messages: {
			addCurrent:
				"useRef variable '{{name}}' is being accessed directly. Use '{{name}}.current' to get its value.",
			removeCurrent:
				"The value of the useRef variable '{{name}}' is being accessed during render. Use only '{{name}}' to get its reference.",
			noRefValueDuringRender:
				"The value of the useRef variable '{{name}}' is being accessed during render.",
		},
	},

	create(context) {
		/** @param {import('@types/eslint').Scope.Scope} scope */
		const checkScope = (scope) => {
			scope.variables.forEach((variable) => {
				const declaration = variable.defs.find(
					(def) => def.type === "Variable" && def.node.init,
				);

				// Skip if the variable is not initialised with useRef
				if (
					!(
						declaration &&
						declaration.node.init.type === "CallExpression" &&
						declaration.node.init.callee.type === "Identifier" &&
						declaration.node.init.callee.name === "useRef"
					)
				) {
					return;
				}

				variable.references.forEach((reference) => {
					const node = reference.identifier;

					// Skip the declaration itself
					if (reference.init) {
						return;
					}

					// If it's the object of a MemberExpression (`ref` in `ref.current`)
					if (
						node.parent.type === "MemberExpression" &&
						node.parent.object === node
					) {
						// If we are in a JSX expression (`{ref.current}`)
						if (
							node.parent.parent &&
							node.parent.parent.type === "JSXExpressionContainer"
						) {
							// If we are in a JSX attribute (`<div ref={ref.current} />`)
							if (
								node.parent.parent.parent &&
								node.parent.parent.parent.type === "JSXAttribute" &&
								node.parent.parent.parent.name.type === "JSXIdentifier"
							) {
								context.report({
									node: node.parent,
									messageId: "removeCurrent",
									data: { name: node.name },
									fix(fixer) {
										return fixer.replaceText(node.parent, node.name);
									},
								});

								return;
							}

							context.report({
								node: node.parent,
								messageId: "noRefValueDuringRender",
								data: { name: node.name },
							});
							return;
						}

						return;
					}

					// Skip if it's used as a ref prop in JSX
					if (
						node.parent &&
						node.parent.type === "JSXExpressionContainer" &&
						node.parent.parent &&
						node.parent.parent.type === "JSXAttribute" &&
						node.parent.parent.name.type === "JSXIdentifier"
					) {
						return;
					}

					context.report({
						node,
						messageId: "addCurrent",
						data: { name: node.name },
						fix(fixer) {
							return fixer.insertTextAfter(node, ".current");
						},
					});
				});
			});

			scope.childScopes.forEach(checkScope);
		};

		return {
			Program() {
				checkScope(context.sourceCode.scopeManager.globalScope);
			},
		};
	},
};
