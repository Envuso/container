export type BindingCallback = (...args: any) => any;

export type IocNamespaceEntry = {
	classPath: string;
	importPath: string;
	value: any
}

export type IocEntryParameterInfo = {
	parameterName: string;
	parameterIndex: number;
	type: Function,
	typeOfDependency: 'binding' | 'primitive';
}
