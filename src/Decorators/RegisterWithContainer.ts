import "reflect-metadata";

import {IocContainer} from "../Container/IocContainer";
import {DESIGN_PARAM_TYPES} from "../DesignTypes";
import {Reflection} from "../Reflector/Reflection";

export function Register(namespace: string, classPath: string, container?: IocContainer) {
	return function (target: any) {
		const proto = target?.prototype;

		if (!container) {
			container = IocContainer.getInstance();
		}

		const registered = container
			.register(namespace)
			.assignClassPath(classPath);

		registered.dependencies().addReflectedParameters(Reflection.forClass(target).getConstructorParams())

	};
}

export function RegisterWithContainer(container?: IocContainer) {
	return function (target: any) {
		const proto = target?.prototype;

		//		if (!container) {
		//			container = IocContainer.getInstance();
		//		}
		//
		//		container.bind(target);
		//
		//		const methodDescriptors = Reflection.forClass(target)
		//			.methods()
		//			.getMethodsWithDescriptors();
		//
		//		for (let method in methodDescriptors) {
		//			const descriptor = methodDescriptors[method];
		//
		//
		//			const decoratedMethod = Reflect.decorate([RegisterMethodWithContainer], target.prototype, method, descriptor);
		//			Object.defineProperty(target.prototype, "method", decoratedMethod);
		//		}
		//		debugger;

	};
}

export function RegisterMethodWithContainer(container?: IocContainer) {
	return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
		//		if (!container) {
		//			container = IocContainer.getInstance();
		//		}
		//
		//		let binding = container.getBinding(target);
		//
		//		if (!binding) {
		//			container.bind(target);
		//			binding = container.getBinding(target);
		//			//			throw new Error(`${Classes.getConstructorName(target)} is not registered with the ioc container.`);
		//		}
		//
		//		var paramTypes = Reflect.getMetadata("design:paramtypes", target, methodName);
		//
		//		binding.registerMethod(target, methodName, descriptor);
		//		debugger;
	};
}
