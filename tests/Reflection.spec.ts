import "reflect-metadata";
import {LoadClassDecorator, LoadMethodDecorator} from "../src/Decorators/LoadClassDecorator";
import {Reflection} from "../src/Reflector/Reflection";

describe('Reflection.ts', function () {

	@LoadClassDecorator()
	class TestingClass {
		private name: string;

		constructor(name: string) {
			this.name = name;
		}

		someMethod(name: string) {}
	}

	test('it can get method parameter names', async () => {
		const names = Reflection.forClass(TestingClass)
			.method('someMethod')
			.getParameterNames();

		expect(names).toEqual(['name']);
	});

	test('it can get method parameter names & types', async () => {
		const names = Reflection.forClass(TestingClass)
			.method('someMethod')
			.getParameters();

		expect(names).toEqual(['name']);
	});

	test('it can get method names', async () => {
		class TestMethodNamesGetting {
			constructor(public name: string) {}
			someMethod(name: string) {}
		}

		const methodNames = Reflection.forClass(TestMethodNamesGetting)
			.methods()
			.getMethodNames();

		expect(methodNames).toContain('someMethod');
	});

});
