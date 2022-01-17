import {Register} from "../../src/Decorators/RegisterWithContainer";
import {AnotherTestingClass} from "./TestingClass";

@Register('App/TestingClassViaDecorator', __filename)
export class TestingClassViaDecorator {
	private name: string;
	private anotherTestingClass: AnotherTestingClass;

	constructor(name: string, anotherTestingClass: AnotherTestingClass) {
		this.name                = name;
		this.anotherTestingClass = anotherTestingClass;
	}

	someMethod(name: string) {}
}
