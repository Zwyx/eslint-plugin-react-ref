const { name, version } = require("./package.json");

/** @type {import('@types/eslint').ESLint.Plugin} */
const plugin = {
	meta: {
		name,
		version,
	},
	configs: {},
	rules: {
		"ref-usage": require("./rules/ref-usage.js"),
	},
};

/** @type {import('@types/eslint').ESLint.Plugin['configs']} */
const configs = {
	recommended: {
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			"react-ref": plugin,
		},
		rules: {
			"react-ref/ref-usage": "warn",
		},
	},

	"recommended-legacy": {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
		plugins: ["react-ref"],
		rules: {
			"react-ref/ref-usage": "warn",
		},
	},
};

Object.assign(plugin.configs, configs);

module.exports = plugin;
