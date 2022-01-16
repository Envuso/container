import {Classes} from "@envuso/utilities";
import {Reflection} from "../Reflector/Reflection";
import {IocContainer} from "./IocContainer";
import {BindingCallback} from "./IocContainerTypes";
import {IocEntryDependencies} from "./IocEntryDependencies";

export type EntryMethodRegistration = {
	name: string;
	target: any;
	descriptor: PropertyDescriptor;
	propertyNames: string[];
	propertyTypes: any[];
}

export class IocContainerEntry {

	private _namespace: string;
	private _classPath: string;
	private _defaultExport: string = null;

	private _dependencies: IocEntryDependencies = new IocEntryDependencies();

	private bindingResolver: BindingCallback = null;

	private _aliases: string[] = [];

	private methods: Map<string, EntryMethodRegistration> = new Map();

	private type: 'singleton' | 'regular' = 'regular';

	private cachedInstance: any = null;


	constructor(public container: IocContainer, namespace: string) {
		this._namespace = namespace;
	}

	public resolver(resolver: BindingCallback) {
		this.bindingResolver = resolver;

		return this;
	}

	public asSingleton() {
		this.type = 'singleton';

		return this;
	}

	load<T extends any>(): T {
		if (this.isSingleton()) {
			if (this.isCached()) {
				return this.cachedInstance;
			}
		}

		return this.resolve<T>();
	}

	public hasBindingResolver(): boolean {
		return this.bindingResolver !== null;
	}

	private resolve<T extends any>(): T {
		if (this.hasBindingResolver()) {
			return this.bindingResolver();
		}

		const resolvedModule = this.container.namespaces().resolve(this._namespace);

		if (this._defaultExport) {
			return resolvedModule[this._defaultExport] ?? null;
		}

		if (resolvedModule['default']) {
			return resolvedModule['default'] ?? null;
		}

		const resolvedKeys = Object.keys(resolvedModule);
		if (!resolvedKeys?.length) {
			return null;
		}

		return resolvedModule[resolvedKeys[0]] ?? null;
	}

	public registerMethod(target: any, methodName: string, descriptor: PropertyDescriptor): void {
		//		this.methods.set(methodName, {
		//			target,
		//			name          : methodName,
		//			propertyNames : this.reflection().method(methodName).getParameterNames(),
		//			propertyTypes : this.reflection().method(methodName).paramTypes(),
		//			descriptor    : descriptor
		//		});
	}

	public isSingleton(): boolean {
		return this.type === 'singleton';
	}

	public isCached(): boolean {
		return this.cachedInstance !== null;
	}

	public assignAlias(alias: string) {
		this._aliases.push(alias);

		this.container.aliases().register(this._namespace, alias);

		return this;
	}

	public namespace() {
		return this._namespace;
	}

	public classPath() {
		return this._classPath;
	}

	public assignClassPath(classPath: string) {
		this._classPath = this.container.namespaces().cleanupClassPath(classPath);

		this.container.namespaces().register(this._namespace, this._classPath);

		return this;
	}

	/**
	 * When we import a class... how can we know which export to use?
	 *
	 * For example, export default class SomeClass {}
	 * will have an exports object like {default:SomeClass}
	 * We can probably assume that we use "default" in this case.
	 *
	 * But for, export class SomeClass {}, this will have, {SomeClass: SomeClass}
	 *
	 * If we don't define a default export, "default" will be taken, if "default" doesn't
	 * exist, the first export will be used.
	 *
	 * @param {string} name
	 */
	public assignDefaultExport(name: string) {
		this._defaultExport = name;

		return this;
	}

	public defaultExport(): string {
		return this._defaultExport;
	}

	public dependencies(): IocEntryDependencies {
		return this._dependencies;
	}
}
