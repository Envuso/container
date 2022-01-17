import {RegisterWithContainer} from "../../src/Decorators/RegisterWithContainer";

@RegisterWithContainer()
export default class TestingClassDefaultExport {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	someMethod(name: string) {}
}
