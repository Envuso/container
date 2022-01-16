import {DESIGN_PARAM_TYPES} from "../DesignTypes";
import type {Reflection} from "./Reflection";

export class MethodReflection {

	constructor(
		public reflection: Reflection,
		public target: any,
		public method: Function,
		public name: string
	) { }

	/**
	 * Get the names of all parameters specified in a function
	 * It seems we cannot use Reflect to obtain these, only the types
	 */
	public getParameterNames(target?: any): string[] {

		// String representation of the function code
		let str = target ? target.toString() : this.method.toString();

		// Remove comments of the form /* ... */
		// Removing comments of the form //
		// Remove body of the function { ... }
		// removing '=>' if func is arrow function
		str = str.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/\/\/(.)*/g, '')
			.replace(/{[\s\S]*}/, '')
			.replace(/=>/g, '')
			.trim();

		// Start parameter names after first '('
		const start = str.indexOf("(") + 1;

		// End parameter names is just before last ')'
		const end = str.length - 1;

		const result = str.substring(start, end).split(", ");

		const params = [];

		result.forEach(element => {

			// Removing any default value
			element = element.replace(/=[\s\S]*/g, '').trim();

			if (element.length > 0)
				params.push(element);
		});

		return params;
	}

	public paramTypes() {
		return Reflect.getMetadata(DESIGN_PARAM_TYPES, this.target.prototype, this.name);
	}

	public getParameters() {
		const paramNames                     = this.getParameterNames();
		const paramTypes                     = this.paramTypes() || [];
		const params: { [key: string]: any } = {};

		for (let paramIdx in paramNames) {
			params[paramNames[paramIdx]] = (paramTypes[paramIdx] ?? null);
		}

		return params;
	}
}
