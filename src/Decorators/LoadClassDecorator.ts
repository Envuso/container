import 'reflect-metadata'

import {Reflection} from "../Reflector/Reflection";

function Primed(target: any, propertyKey: string) {}

export function LoadClassDecorator() {
	return function (target: any) {
		const proto = target?.prototype;

		const methodDescriptors = Reflection.forClass(target)
			.methods()
			.getMethodsWithDescriptors();

		for (let method in methodDescriptors) {
			const descriptor = methodDescriptors[method];

			Reflect.decorate(
				[LoadMethodDecorator], target.prototype, method, descriptor
			);
		}
		debugger
	};
}

export function LoadMethodDecorator() {
	return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
		debugger;
	};
}
