export class TestingClass {
	private name: string;
	private anotherTestingClass: AnotherTestingClass = null;

	constructor(name: string, anotherTestingClass?: AnotherTestingClass) {
		this.name                = name;
		this.anotherTestingClass = anotherTestingClass;
	}

	someMethod(name: string) {}
}

export class AnotherTestingClass {
	private name: string;

	constructor(name: string) {
		this.name = name;
	}

	someMethod(name: string) {}
}
