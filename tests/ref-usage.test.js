const refUsage = require("../rules/ref-usage.js");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

ruleTester.run("ref-usage", refUsage, {
	valid: [
		`function Component() {
       const ref = useRef(null);
       console.info(ref.current);
       return null;
     };`,
		`function Component() {
       const ref = useRef(null);
       return <div ref={ref} />;
     }`,
		`function Component() {
       const ref = useRef(null);
       [].forEach((ref) => console.info(ref));
       return null;
     }`,
	],
	invalid: [
		{
			code: `function Component() {
               const ref = useRef(null);
               console.info(ref);
               return null;
             }`,
			errors: [{ messageId: "addCurrent", data: { name: "ref" } }],
			output: `function Component() {
               const ref = useRef(null);
               console.info(ref.current);
               return null;
             }`,
		},
		{
			code: `function Component() {
               const ref = useRef(null);
               return <div ref={ref.current} />;
             }`,
			errors: [{ messageId: "removeCurrent", data: { name: "ref" } }],
			output: `function Component() {
               const ref = useRef(null);
               return <div ref={ref} />;
             }`,
		},
		{
			code: `function Component() {
               const ref = useRef(null);
               return <div>{ref}</div>;
             }`,
			errors: [{ messageId: "addCurrent", data: { name: "ref" } }],
			output: `function Component() {
               const ref = useRef(null);
               return <div>{ref.current}</div>;
             }`,
		},
		{
			code: `function Component() {
               const ref = useRef(null);
               return <div>{ref.current}</div>;
             }`,
			errors: [{ messageId: "noRefValueDuringRender", data: { name: "ref" } }],
		},
	],
});
