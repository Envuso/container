import {Exception, StatusCodes} from "@envuso/utilities";

export class LookupIocEntryException extends Exception {
	constructor(namespaceOrAlias: string) {
		super(`Failed to lookup namespace or alias ${namespaceOrAlias}.`, StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
