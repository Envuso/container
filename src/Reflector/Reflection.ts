import {Classes} from "@envuso/utilities";
import {DESIGN_PARAM_TYPES, DESIGN_RETURN_TYPE, DESIGN_TYPE} from "../DesignTypes";
import {MethodReflection} from "./MethodReflection";
import {MethodsReflection} from "./MethodsReflection";
import {ReflectedParameter} from "./ReflectionTypes";
import {Type} from "./Type";

export class Reflection {
	private target: any;

	constructor(target: any) {
		this.target = target;
	}

	public static for<T extends new (...args: any) => any>(target: T) {
		return new this(target);
	}

	public static forClass<T extends new (...args: any) => any>(target: T) {
		return new this(target.prototype ? target : target.constructor);
	}

	public static type(type: any): Type {
		return new Type(type);
	}

	public getType(propertyKey?: string | symbol): any {
		return Reflect.getMetadata(DESIGN_TYPE, this.target, propertyKey);
	}

	public getReturnType(propertyKey?: string | symbol): any {
		return Reflect.getMetadata(DESIGN_RETURN_TYPE, this.target, propertyKey);
	}

	public hasMetaData(key: string, propertyKey?: string | symbol) {
		return Reflect.hasMetadata(key, this.target, propertyKey);
	}

	public methods() {
		return new MethodsReflection(this, this.target);
	}

	public method(name: string) {
		return new MethodReflection(this, this.target, this.target.prototype[name], name);
	}

	public getConstructorParams(): ReflectedParameter[] {
		const types  = Reflect.getMetadata(DESIGN_PARAM_TYPES, this.target);
		const params = this.methods().getConstructorParameters(this.target);

		return types.map((type, index) => {
			return {
				ctorName : Classes.getConstructorName(type),
				name     : params[index] ?? null,
				index    : index,
				type,
			};
		});
	}
}
