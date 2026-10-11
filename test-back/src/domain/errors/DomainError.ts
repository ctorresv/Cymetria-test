export class DomainError extends Error {
	constructor(message: string, public readonly statusCode: number = 400) {
		super(message);
		this.name = "DomainError";
	}
}

export class UserNotFoundError extends DomainError {
	constructor(id: string) {
		super(`Usuario con ID '${id}' no encontrado.`, 404);
		this.name = "UserNotFoundError";
	}
}

export class UserAlreadyExistsError extends DomainError {
	constructor(email: string) {
		super(`Ya existe un usuario registrado con el email '${email}'.`, 409);
		this.name = "UserAlreadyExistsError";
	}
}