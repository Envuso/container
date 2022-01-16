import path from "path";
import {ResolveIocEntryException} from "../Exceptions/ResolveIocEntryException";

export class IocEntryAlias {
	public aliases: { [alias: string]: string } = {};

	public register(namespace: string, alias: string) {
		this.aliases[alias] = namespace;

		return this;
	}

	public hasAlias(alias: string) {
		return !!this.aliases[alias];
	}

	public getNamespace(alias: string) {
		return this.aliases[alias] ?? null;
	}

	public getAlias(namespace: string) {
		return Object
			.keys(this.aliases)
			.find(key => this.aliases[key] === namespace) ?? null;
	}
}


