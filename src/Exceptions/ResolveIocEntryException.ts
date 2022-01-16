import {Exception, StatusCodes} from "@envuso/utilities";

export class ResolveIocEntryException extends Exception {
	constructor(namespace: string) {
		super(`Failed to resolve namespace ${namespace} from the container.`, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
