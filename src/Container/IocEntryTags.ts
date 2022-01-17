
export class IocEntryTags {
	public tags: { [tag: string]: string[] } = {};

	public register(namespace: string, tag: string) {
		if(!this.tags[tag]) {
			this.tags[tag] = [];
		}

		this.tags[tag].push(namespace);

		return this;
	}

	public hasTag(tag: string) {
		return !!this.tags[tag];
	}

	public getNamespaces(tag: string) {
		return this.tags[tag] || [];
	}

	public getTag(namespace: string) {
		return Object
			.keys(this.tags)
			.find(key => this.tags[key].includes(namespace)) ?? null;
	}
}


