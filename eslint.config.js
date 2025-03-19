const js = require("@eslint/js");
const eslintPlugin = require("eslint-plugin-eslint-plugin");
const configPrettier = require("eslint-config-prettier");
const pluginOnlyWarn = require("eslint-plugin-only-warn");

const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
	{
		extends: [js.configs.recommended, configPrettier],
		languageOptions: {
			sourceType: "commonjs",
		},
		plugins: {
			"only-warn": pluginOnlyWarn,
		},
	},
	{
		extends: [eslintPlugin.configs["flat/rules-recommended"]],
		files: ["rules/*"],
	},
	{
		extends: [eslintPlugin.configs["flat/tests-recommended"]],
		files: ["tests/*"],
	},
	{
		rules: {
			// ---------- JavaScript ----------

			// Enforce consistent brace style for all control statements
			curly: "warn",

			// Require `===` when `==` can be ambiguous
			eqeqeq: ["warn", "always"],

			// Disallow the use of `console.log`, which helps not forget them after debugging; for permanent logging, use `console.info/warn/warn`
			"no-console": ["warn", { allow: ["info", "warn", "error"] }],

			// Disallow the use of `eval()`; if `eval()` is necessary, use `// eslint-disable-next-line no-eval` where it's needed
			"no-eval": "warn",

			// Disallow `new` operators with the `Function` object, as this is similar to `eval()`; if necessary, use `// eslint-disable-next-line no-new-func` where it's needed
			"no-new-func": "warn",

			// Disallow ternary operators when simpler alternatives exist; example: prevent `const x = y === 1 ? true : false` in favour of `const x = y === 1`
			"no-unneeded-ternary": "warn",

			// Disallow renaming import, export, and destructured assignments to the same name; example: prevent `const { a: a } = b;` in favour of `const { a } = b;`
			"no-useless-rename": "warn",

			// Disallow throwing anything else than the `Error object`
			"no-throw-literal": "warn",

			// Require method and property shorthand syntax for object literals; example: prevent `a = { b: b };` in favour of `a = { b };`
			"object-shorthand": "warn",
		},
	},
]);
