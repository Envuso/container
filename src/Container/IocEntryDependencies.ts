import {Reflection} from "../Reflector/Reflection";
import {ReflectedParameter} from "../Reflector/ReflectionTypes";
import {IocEntryParameterInfo} from "./IocContainerTypes";

export class IocEntryDependencies {

	private _parameterInfo: Map<string, IocEntryParameterInfo> = new Map();
	private _values: Map<string, any>                          = new Map();

	public add(key: string, value: any) {
		if (!this._parameterInfo.has(key)) {
			console.error(`No parameter info specified for ${key}`);
			return this;
		}

		this._values.set(key, value);

		return this;
	}

	public has(key: string) {
		return this._values.has(key);
	}

	public hasDependencies(): boolean {
		return this._values.size > 0;
	}

	public getParameterInfo(key: string): IocEntryParameterInfo {
		return this._parameterInfo.get(key);
	}

	public getDependencyArgs(): (IocEntryParameterInfo & { value: any, })[] {
		const args: (IocEntryParameterInfo & { value: any})[] = [];
		const paramInfo                                       = [...this._parameterInfo.values()];

		for (let param of paramInfo) {
			const value = this._values.get(param.parameterName);

			args[param.parameterIndex] = {
				value : value ?? undefined,
				...param,
			};
		}

		return args;
	}

	public addParameterInfo(param: ReflectedParameter) {
		let type = Reflection.type(param.type);
		if (type.isFunction()) {
			type = Reflection.type(new param.type());
		}

		this._parameterInfo.set(param.name, {
			parameterName    : param.name,
			parameterIndex   : param.index,
			type             : param.type,
			typeOfDependency : type.isPrimitive() ? 'primitive' : 'binding'
		});
	}

	public addReflectedParameters(constructorParams: ReflectedParameter[]) {
		constructorParams.forEach(param => {
			if (!param?.type) {
				console.error(`Cannot add reflected type, "type" is not set. It's likely that this class was not decorated with @Register()`);
				return;
			}

			this.addParameterInfo(param);
		});
	}
}
