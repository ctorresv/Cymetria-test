export class HttpException extends Error {
	public readonly status: number;
	public readonly name: string;

	constructor(status: number, message: string, name: string = "HttpException") {
		super(message);
		this.status = status;
		this.name = name;

		Object.setPrototypeOf(this, HttpException.prototype);
	}
}