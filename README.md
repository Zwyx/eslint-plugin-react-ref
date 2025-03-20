# eslint-plugin-react-ref

**This will warn when you write the following:**

```js
const intervalRef = useRef(0);

useEffect(() => {
	if (intervalRef) {
		// ...
	}
	// ...
```

Did you instantly spot the oversight? If not, then you definitely need this plugin 😉

The test should be `if (intervalRef.current) {` in order to access the value of the useRef variable. Without the `.current`, the code is broken and TypeScript won't help here.

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

This rule helps enforce proper usage of React's `useRef` hook by checking three common mistake patterns:

1. **Incorrect reference access**: warns when a ref is being accessed directly, instead of with its `current` property.
2. **Incorrect value access in a JSX attribute**: warns when a ref's value is being used in a JSX attribute, instead of the ref itself.
3. **Incorrect value access during render**: warns when a ref's value is being accessed during render, as it could lead to unexpected behaviour.

Read more about `useRef` and its common pitfalls at [react.dev/reference/react/useRef](https://react.dev/reference/react/useRef).

The rule provides automatic fixes for the first two cases.

#### ❌ Incorrect usage

```jsx
function Component() {
	const ref = useRef(null);

	// Missing `.current` when accessing ref value
	console.log(ref);

	return <div />;
}

function Component() {
	const ref = useRef(null);

	// Accessing `ref.current` during render
	return <div ref={ref.current} />;
}

function Component() {
	const ref = useRef(null);

	// Accessing `ref.current` during render
	return <div>{ref.current}</div>;
}
```

#### ✅ Correct usage

```jsx
function Component() {
	const ref = useRef(null);

	// Correctly using `.current` to access value
	console.log(ref.current);

	return <div />;
}

function Component() {
	const ref = useRef(null);

	// Valid usage in ref prop
	return <div ref={ref} />;
}

function Component() {
	const ref = useRef(null);

	// Accessing `ref.current` in useEffect (not during render) is fine
	useEffect(() => {
		console.log(inputRef.current);
	}, []);

	return <div />;
}
```

### Notes

- This rule is not yet capable of catching all the possible ways of accessing a ref's value during render. (You could create a function returning a ref's value, and call this function during render; but this is still a React No No!)
