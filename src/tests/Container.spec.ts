import "reflect-metadata";
import {IocContainer} from "../Container/IocContainer";
import {IocContainerEntry} from "../Container/IocContainerEntry";
import {TestingClass} from "../TestingClass";
import {TestingClassViaDecorator} from "../TestingClassViaDecorator";

describe('Container.ts', function () {

	const container = IocContainer.getInstance();

	const bindingMethod = () => {
		return new TestingClass('woot');
	};

	test('it registers class with container', async () => {
		container.bind('TestingClass', bindingMethod);

		const binding = IocContainer.getInstance().getBinding(TestingClass);

		expect(binding).toBeDefined();
	});

	test('it can lookup class using namespace', async () => {
		container.bind('TestingClass', bindingMethod);

		const binding = container.lookup('TestingClass');

		const lookupInstance = new IocContainerEntry(container, 'TestingClass').resolver(bindingMethod);

		expect(binding).toEqual(lookupInstance);
	});

	test('it can register namespace & class path', async () => {
		container.registerClass('App/TestingClass', 'TestingClass');

		const namespaceEntry    = container.namespaces().get('App/TestingClass');
		const resolvedNamespace = container.namespaces().resolve('App/TestingClass');

		expect(namespaceEntry).toBeDefined();
		expect(resolvedNamespace).toBeDefined();
	});

	test('it can register namespace & class path with an alias', async () => {
		const entry = container.register('App/TestingClass')
			.assignAlias('test-class')
			.assignClassPath('TestingClass');

		const namespaceLookup = container.lookup('App/TestingClass');
		const aliasLookup     = container.lookup('test-class');

		expect(namespaceLookup).toBeDefined();
		expect(namespaceLookup).toEqual(entry);

		expect(aliasLookup).toBeDefined();
		expect(aliasLookup).toEqual(entry);
	});

	test('it can resolve the class instance from the container using the namespace & class path', async () => {

		const entry = container.register('App/TestingClass')
			.assignClassPath('TestingClass');

		const entryTwo = container.register('App/TestingClassDefaultExport')
			.assignClassPath('TestingClassDefaultExport');

		const resolved    = await container.resolve('App/TestingClass');
		const resolvedTwo = await container.resolve('App/TestingClassDefaultExport');


		expect(entry).toBeDefined();
		expect(resolved).toBeDefined();

		expect(entryTwo).toBeDefined();
		expect(resolvedTwo).toBeDefined();
	});

	test('it can resolve the class instance from the container, when registered via decorator, using the namespace & class path', async () => {
		// It needs to be imported somewhere for decorators to trigger.
		const cls = TestingClassViaDecorator;

		const resolved = await container.resolve('App/TestingClassViaDecorator');

		expect(resolved).toBeDefined();
	});

	test('it can resolve from a callback method', async () => {
		const resolveString = 'Hello!';

		const registered = container
			.register('App/TestingString')
			.resolver(() => resolveString);

		const resolved = container.resolve('App/TestingString');

		expect(resolved).toEqual(resolveString);
	});

	test('it can register constructor args to be resolved when resolving', async () => {

		const registered = container
			.register('App/TestingClass')
			.assignClassPath('TestingClass');

		container.register('App/AnotherTestingClass').assignClassPath('TestingClass').assignDefaultExport('AnotherTestingClass');

		registered.dependencies().add('name', 'Sam');
		registered.dependencies().add('anotherTestingClass', 'App/AnotherTestingClass');

		const resolved = container.make('App/TestingClass');


		debugger
	});


	test('it can resolve constructor params from reflection', async () => {
		// It needs to be imported somewhere for decorators to trigger.
		const cls = TestingClassViaDecorator;

		container.register('App/AnotherTestingClass')
			.assignClassPath('TestingClass')
			.assignDefaultExport('AnotherTestingClass')
			.dependencies()
			.add('name', 'Another Sam!');

		const registered = container.lookup('App/TestingClassViaDecorator');

		registered.dependencies().add('name', 'Sam');
		registered.dependencies().add('anotherTestingClass', 'App/AnotherTestingClass');

		const resolved = await container.make('App/TestingClassViaDecorator');

		expect(resolved).toBeDefined();
	});
});
