import type {Reflection} from "./Reflection";

export class MethodsReflection {

	constructor(
		public reflection: Reflection,
		public target: any
	) {}

	public getConstructorParameters(target?: any) {
		const RegExInsideParentheses    = /[(][^)]*[)]/;
		const RegExParenthesesAndSpaces = /[()\s]/g;

		const getArgumentNames = functionString => RegExInsideParentheses
			.exec(functionString)[0]
			.replace(RegExParenthesesAndSpaces, "")
			.split(',')
			.map(str => str.trim());

		return getArgumentNames(target ? target.toString() : this.target);
	}

	public isJsInternalMethodName(name: string): boolean {
		const names = [
			"__defineGetter__",
			"__defineSetter__",
			"hasOwnProperty",
			"__lookupGetter__",
			"__lookupSetter__",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"toString",
			"valueOf",
			"toLocaleString"
		];

		return names.includes(name);
	}

	public getDescriptor(name: string, proto?: any): PropertyDescriptor | undefined {
		return proto
			? Object.getOwnPropertyDescriptor(proto, name)
			: Object.getOwnPropertyDescriptor(this.target.prototype, name);
	}

	public hasMethod(name: string, proto?: any): boolean {
		const descriptor = this.getDescriptor(name, proto);

		return !!descriptor && typeof descriptor.value === 'function';
	}

	public getMethodNames(): string[] {
		const methodNames = [];

		let proto = this.target.prototype;

		while (proto) {
			const names = Object.getOwnPropertyNames(proto);

			for (let name of names) {
				if (name === 'constructor') {
					continue;
				}
				if (this.hasMethod(name, proto) && !this.isJsInternalMethodName(name)) {
					methodNames.push(name);
				}
			}

			proto = Object.getPrototypeOf(proto);
		}

		return methodNames;
	}

	public getMethods(): { [key: string]: Function } {
		const methods: { [key: string]: Function } = {};

		let proto = this.target.prototype;

		while (proto) {
			const names = Object.getOwnPropertyNames(proto);

			for (let name of names) {
				if (name === 'constructor') {
					continue;
				}
				if (this.hasMethod(name)) {
					methods[name] = this.target[name];
				}
			}

			proto = Object.getPrototypeOf(proto);
		}

		return methods;
	}

	public getMethodsWithDescriptors(): { [key: string]: PropertyDescriptor } {
		const methods: { [key: string]: PropertyDescriptor } = {};

		let proto = this.target.prototype;

		while (proto) {
			const names = Object.getOwnPropertyNames(proto);

			for (let name of names) {
				if (name === 'constructor') {
					continue;
				}
				if (this.hasMethod(name)) {
					methods[name] = this.getDescriptor(name, proto);
				}
			}

			proto = Object.getPrototypeOf(proto);
		}

		return methods;
	}

}
