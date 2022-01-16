import path from "path";
import {ResolveIocEntryException} from "../Exceptions/ResolveIocEntryException";
import {IocNamespaceEntry} from "./IocContainerTypes";


export class IocNamespaceEntries {

	public static projectRootPath: string = null;

	public list: { [key: string]: string } = {};

	private requireCache: Map<string, IocNamespaceEntry> = new Map();

	register(namespace: string, classPath: string) {
		this.list[namespace] = this.cleanupClassPath(classPath);

		return this;
	}

	has(namespace: string): boolean {
		return !!this.list[namespace];
	}

	get(namespace: string) {
		return this.list[namespace] ?? null;
	}

	private getImportPath(namespace: string): string {
		const classPath = this.get(namespace);

		return path.normalize(path.join(IocNamespaceEntries.projectRootPath, classPath));
	}

	resolve(namespace: string) {
		if (!this.has(namespace)) {
			throw new ResolveIocEntryException(namespace);
		}

		const entry = this.requireCache.get(namespace);
		if (entry) {
			return entry.value;
		}

		const importPath = this.getImportPath(namespace);

		const module = require(importPath);

		this.requireCache.set(namespace, {
			importPath : importPath,
			classPath  : this.get(namespace),
			value      : module
		});

		return module;
	}

	public cleanupClassPath(classPath: string): string {
		if (classPath.includes(IocNamespaceEntries.projectRootPath)) {
			classPath = classPath.replace(IocNamespaceEntries.projectRootPath, '');
		}

		if (classPath.startsWith('/')) {
			classPath = classPath.slice(1);
		}

		const extension = path.extname(classPath);
		if (extension) {
			classPath = classPath.replace(extension, '');
		}

		return classPath;
	}
}
