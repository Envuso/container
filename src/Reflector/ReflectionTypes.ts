export type ReflectedParameter = {
	type: new (...args: any[]) => any,
	ctorName: string,
	name: string,
	index: number
};
