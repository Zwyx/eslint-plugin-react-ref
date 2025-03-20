# eslint-plugin-react-ref

An ESLint plugin to help prevent mistakes when using React's `useRef` hook.

## Installation

Install ESLint and this plugin:

```sh
npm install --save-dev eslint eslint-plugin-react-ref
```

## Usage

### Flat Config (`eslint.config.js|ts`)

Import `pluginReactRef` and add `pluginReactRef.configs.recommended` to the `extends` array of your configuration file:

```js
import { defineConfig } from "eslint/config";
import pluginReactRef from "eslint-plugin-react-ref";

export default defineConfig([
	{
		extends: [pluginReactRef.configs.recommended],
	},
]);
```

Or, import `pluginReactRef` and add `"react-ref": pluginReactRef` to the `plugins` object of your configuration file, then configure the rule:

```js
import { defineConfig } from "eslint/config";
import pluginReactRef from "eslint-plugin-react-ref";

export default defineConfig([
	{
		plugins: {
			"react-ref": pluginReactRef,
		},
		rules: {
			"react-ref/ref-usage": "warn",
		},
	},
]);
```

### Legacy Config (`.eslintrc`)

Add `plugin:react-ref/recommended-legacy` to the `extends` array of your `.eslintrc` configuration file:

```json
{
	"extends": ["plugin:react-ref/recommended-legacy"]
}
```

Or, add `react-ref` to the `plugins` array of your `.eslintrc` configuration file, then configure the rule:

```json
{
	"plugins": ["react-ref"],
	"rules": {
		"react-ref/ref-usage": "warn"
	}
}
```

## Rule

### `ref-usage`

This rule helps enforce proper usage of React's `useRef` hook by checking two common mistake patterns:

#### 1. Incorrect reference access

Warns when a ref is being accessed directly, instead of with its `current` property.

❌ **Incorrect usage**

```js
const ref = useRef(false);

useEffect(() => {
	// `.current` is missing, the test is always truthy,
	// TypeScript doesn't detect anything wrong
	if (ref) {
		// do something
	} else {
		// do something else
	}
// ...
```

✅ **Correct usage**

```js
const ref = useRef(false);

useEffect(() => {
	if (ref.current) {
		// do something
	} else {
		// do something else
	}
// ...
```

> Note: in this particular case, the ESLint plugin `typescript-eslint` and its rule [`no-unnecessary-condition`](https://typescript-eslint.io/rules/no-unnecessary-condition/) (part of the `strict` config) would also detect the incorrect usage, as `ref` is always truthy.

#### 2. Incorrect value access during render

Warns when a ref's value is being accessed during render.

#### ❌ Incorrect usage

```jsx
function Component() {
	const ref = useRef(null);

	// Accessing `ref.current` during render
	return <div>{ref.current}</div>;
}
```

> Note that this rule is not yet capable of catching all the possible ways of accessing a ref's value during render. (You could create a function returning a ref's value, and call this function during render; but this is still a React No No!)

## Further readings

Read more about `useRef` and its common pitfalls at [react.dev/reference/react/useRef](https://react.dev/reference/react/useRef).
