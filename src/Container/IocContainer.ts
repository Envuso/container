import {Classes} from "@envuso/utilities";
import path from "path";
import {LookupIocEntryException} from "../Exceptions/LookupIocEntryException";
import {Reflection} from "../Reflector/Reflection";
import {IocContainerEntry} from "./IocContainerEntry";
import {BindingCallback, IocEntryParameterInfo} from "./IocContainerTypes";
import {IocEntryAlias} from "./IocEntryAlias";
import {IocEntryTags} from "./IocEntryTags";
import {IocNamespaceEntries} from "./IocNamespaceEntries";

let instance: IocContainer = null;

IocNamespaceEntries.projectRootPath = path.join(process.cwd(), 'src');

export class IocContainer {

	private _namespaces: IocNamespaceEntries = new IocNamespaceEntries();

	private _aliases: IocEntryAlias = new IocEntryAlias();

	private _tags: IocEntryTags = new IocEntryTags();

	private _entries: Map<string, IocContainerEntry> = new Map();

	static getInstance(): IocContainer {
		if (!instance) {
			instance = new IocContainer();
		}

		return instance;
	}

	static create(): IocContainer {
		if (!instance) {
			return this.getInstance();
		}

		return new IocContainer();
	}

	namespaces(): IocNamespaceEntries {
		return this._namespaces;
	}

	aliases(): IocEntryAlias {
		return this._aliases;
	}

	tags(): IocEntryTags {
		return this._tags;
	}

	register(namespace: string): IocContainerEntry {
		this._entries.set(namespace, new IocContainerEntry(this, namespace));

		return this._entries.get(namespace);
	}

	registerClass(namespace: string, classPath: string) {
		this._namespaces.register(namespace, classPath);

		return this;
	}

	registerAlias(namespace: string, alias: string) {
		const entry = this._entries.get(namespace);
		entry.assignAlias(alias);

		return this;
	}

	bind(namespace: string, bindingCallback: BindingCallback): IocContainerEntry {
		this._entries.set(namespace, new IocContainerEntry(this, namespace));

		this._aliases.register(namespace, path.basename(namespace));

		return this._entries.get(namespace);
	}

	lookup(namespaceOrAlias: string): IocContainerEntry | undefined {
		let namespacedEntry = this._entries.get(namespaceOrAlias);

		// If we're using a direct namespace, we'll just return that, as it's accurate.
		if (namespacedEntry) {
			return namespacedEntry;
		}

		// If we try to lookup using an alias, we first need to resolve that.
		namespaceOrAlias = this._aliases.getNamespace(namespaceOrAlias);
		namespacedEntry  = this._entries.get(namespaceOrAlias);

		if (namespacedEntry) {
			return namespacedEntry;
		}

		throw new LookupIocEntryException(namespaceOrAlias);
	}

	getBinding<T extends new (...args: any[]) => any>(key: T): IocContainerEntry;
	getBinding<T extends string>(key: T): any;
	getBinding<T extends string | (new (...args: any[]) => any)>(key: T): IocContainerEntry {
		const bindingKey = (typeof key !== 'string')
			? Classes.getConstructorName(key)
			: key;

		return this._entries.get(bindingKey);
	}

	get<T extends new (...args: any[]) => any>(key: T): T;
	get<T extends string>(key: T): any;
	get<T extends string | (new (...args: any[]) => any)>(key: T): T {
		const bindingKey = (typeof key !== 'string')
			? Classes.getConstructorName(key)
			: key;

		return this._entries.get(bindingKey).load<T>();
	}

	public resolve<T extends any>(namespace: string): T {
		const entry        = this.lookup(namespace);
		const entryBinding = entry.load<T>();

		return entryBinding;
	}

	public make(namespace: string) {
		const entry    = this.lookup(namespace);
		const resolved = this.resolve<new (...args: any[]) => any>(namespace);

		let args: (IocEntryParameterInfo & { value: any })[] = entry.dependencies().getDependencyArgs();
		args                                                 = args.map((arg) => {
			if (arg.typeOfDependency === 'binding') {
				if (this.namespaces().has(arg.value)) {
					return this.make(arg.value);
				}
			}

			return arg.value;
		});

		return new resolved(...args);
	}

}
