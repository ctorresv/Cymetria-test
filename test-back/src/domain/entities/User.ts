import { randomUUID } from "crypto";

export class User {
	public readonly id: string;
	public readonly createdAt: Date;

	private _name: string;
	private _email: string;

	constructor(name: string, email: string, id?: string, createdAt?: Date) {
		this.id = id || randomUUID();
		this.createdAt = createdAt || new Date();

		this._name = name;
		this._email = email;
	}

	public get name(): string {
		return this._name;
	}

	public get email(): string {
		return this._email;
	}

	public updateName(newName: string): void {
		if (!newName || newName.trim().length === 0) {
			throw new Error("El nombre no puede estar vacío");
		}
		this._name = newName.trim();
	}

	public updateEmail(newEmail: string): void {
		if (!newEmail || !newEmail.includes("@")) {
			throw new Error("El formato del email no es válido");
		}
		this._email = newEmail.trim().toLowerCase();
	}

	public toJSON() {
		return {
			id: this.id,
			name: this.name,      
			email: this.email,    
			createdAt: this.createdAt,
		};
	}
}