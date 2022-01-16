export class Type {
	private type: any;
	constructor(public payload: any) {
		this.type = this.getType();
	}
	/**
	 * Returns the object type of the given payload
	 *
	 * @returns {string}
	 */
	public getType() {
		return Object.prototype.toString.call(this.payload).slice(8, -1);
	}
	/**
	 * Returns whether the payload is undefined
	 *
	 * @returns {payload is undefined}
	 */
	public isUndefined() {
		return this.type === 'Undefined';
	}
	/**
	 * Returns whether the payload is null
	 *
	 * @returns {payload is null}
	 */
	public isNull() {
		return this.type === 'Null';
	}
	/**
	 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
	 *
	 * @returns {payload is PlainObject}
	 */
	public isPlainObject() {
		if (this.getType() !== 'Object')
			return false;
		return this.payload.constructor === Object && Object.getPrototypeOf(this.payload) === Object.prototype;
	}
	/**
	 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
	 *
	 * @returns {payload is PlainObject}
	 */
	public isObject() {
		return this.isPlainObject();
	}
	/**
	 * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
	 *
	 * @returns {payload is { [K in any]: never }}
	 */
	public isEmptyObject() {
		return this.isPlainObject() && Object.keys(this.payload).length === 0;
	}
	/**
	 * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
	 *
	 * @returns {payload is PlainObject}
	 */
	public isFullObject() {
		return this.isPlainObject() && Object.keys(this.payload).length > 0;
	}
	/**
	 * Returns whether the payload is an any kind of object (including special classes or objects with different prototypes)
	 *
	 * @returns {payload is PlainObject}
	 */
	public isAnyObject() {
		return this.type === 'Object';
	}
	/**
	 * Returns whether the payload is an object like a type passed in < >
	 *
	 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
	 *
	 * @template T this must be passed in < >
	 * @returns {payload is T}
	 */
	public isObjectLike() {
		return this.isAnyObject();
	}
	/**
	 * Returns whether the payload is a function (regular or async)
	 *
	 * @returns {payload is AnyFunction}
	 */
	public isFunction() {
		return typeof this.payload === 'function';
	}
	/**
	 * Returns whether the payload is an array
	 *
	 * @param {any} payload
	 * @returns {payload is any[]}
	 */
	public isArray() {
		return this.type === 'Array';
	}
	/**
	 * Returns whether the payload is a an array with at least 1 item
	 *
	 * @returns {payload is any[]}
	 */
	public isFullArray() {
		return this.isArray() && this.payload.length > 0;
	}
	/**
	 * Returns whether the payload is a an empty array
	 *
	 * @returns {payload is []}
	 */
	public isEmptyArray() {
		return this.isArray() && this.payload.length === 0;
	}
	/**
	 * Returns whether the payload is a string
	 *
	 * @returns {payload is string}
	 */
	public isString() {
		return this.type === 'String';
	}
	/**
	 * Returns whether the payload is a string, BUT returns false for ''
	 *
	 * @returns {payload is string}
	 */
	public isFullString() {
		return this.isString() && this.payload !== '';
	}
	/**
	 * Returns whether the payload is ''
	 *
	 * @returns {payload is string}
	 */
	public isEmptyString() {
		return this.payload === '';
	}
	/**
	 * Returns whether the payload is a number (but not NaN)
	 *
	 * This will return `false` for `NaN`!!
	 *
	 * @returns {payload is number}
	 */
	public isNumber() {
		return this.type === 'Number' && !isNaN(this.payload);
	}
	/**
	 * Returns whether the payload is a positive number (but not 0)
	 *
	 * @returns {payload is number}
	 */
	public isPositiveNumber() {
		return this.isNumber() && this.payload > 0;
	}
	/**
	 * Returns whether the payload is a negative number (but not 0)
	 *
	 * @returns {payload is number}
	 */
	public isNegativeNumber() {
		return this.isNumber() && this.payload < 0;
	}
	/**
	 * Returns whether the payload is a boolean
	 *
	 * @returns {payload is boolean}
	 */
	public isBoolean() {
		return this.type === 'Boolean';
	}
	/**
	 * Returns whether the payload is a regular expression (RegExp)
	 *
	 * @returns {payload is RegExp}
	 */
	public isRegExp() {
		return this.type === 'RegExp';
	}
	/**
	 * Returns whether the payload is a Map
	 *
	 * @returns {payload is Map<any, any>}
	 */
	public isMap() {
		return this.type === 'Map';
	}
	/**
	 * Returns whether the payload is a WeakMap
	 *
	 * @returns {payload is WeakMap<any, any>}
	 */
	public isWeakMap() {
		return this.type === 'WeakMap';
	}
	/**
	 * Returns whether the payload is a Set
	 *
	 * @returns {payload is Set<any>}
	 */
	public isSet() {
		return this.type === 'Set';
	}
	/**
	 * Returns whether the payload is a WeakSet
	 *
	 * @returns {payload is WeakSet<any>}
	 */
	public isWeakSet() {
		return this.type === 'WeakSet';
	}
	/**
	 * Returns whether the payload is a Symbol
	 *
	 * @returns {payload is symbol}
	 */
	public isSymbol() {
		return this.type === 'Symbol';
	}
	/**
	 * Returns whether the payload is a Date, and that the date is valid
	 *
	 * @returns {payload is Date}
	 */
	public isDate() {
		return this.type === 'Date' && !isNaN(this.payload);
	}
	/**
	 * Returns whether the payload is a Blob
	 *
	 * @returns {payload is Blob}
	 */
	public isBlob() {
		return this.type === 'Blob';
	}
	/**
	 * Returns whether the payload is a File
	 *
	 * @returns {payload is File}
	 */
	public isFile() {
		return this.type === 'File';
	}
	/**
	 * Returns whether the payload is a Promise
	 *
	 * @returns {payload is Promise<any>}
	 */
	public isPromise() {
		return this.type === 'Promise';
	}
	/**
	 * Returns whether the payload is an Error
	 *
	 * @returns {payload is Error}
	 */
	public isError() {
		return this.type === 'Error';
	}
	/**
	 * Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`)
	 *
	 * @returns {payload is typeof NaN}
	 */
	public isNaNValue() {
		return this.type === 'Number' && isNaN(this.payload);
	}
	/**
	 * Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
	 *
	 * @returns {(payload is boolean | null | undefined | number | string | symbol)}
	 */
	public isPrimitive() {
		return (this.isBoolean() ||
			this.isNull() ||
			this.isUndefined() ||
			this.isNumber() ||
			this.isString() ||
			this.isSymbol());
	}

	/**
	 * Does a generic check to check that the given payload is of a given type.
	 * In cases like Number, it will return true for NaN as NaN is a Number (thanks javascript!);
	 * It will, however, differentiate between object and null
	 *
	 * @template T
	 * @param {T} type
	 * @throws {TypeError} Will throw type error if type is an invalid type
	 * @returns {payload is T}
	 */
	public isType(type) {
		if (!(type instanceof Function)) {
			throw new TypeError('Type must be a function');
		}
		if (!Object.prototype.hasOwnProperty.call(type, 'prototype')) {
			throw new TypeError('Type is not a class');
		}
		// Classes usually have names (as functions usually have names)
		const name = type.name;
		return this.type === name || Boolean(this.payload && this.payload.constructor === type);
	}

}
