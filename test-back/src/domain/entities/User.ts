import { randomUUID } from "crypto";

export class User {
	// 1. Identidad y timestamps: Solo lectura, nunca cambian.
	public readonly id: string;
	public readonly createdAt: Date;

	// 2. Estado mutable: Privado para proteger la integridad de los datos.
	private _name: string;
	private _email: string;

	constructor(name: string, email: string, id?: string, createdAt?: Date) {
		// Si no viene ID (ej: al crear uno nuevo), generamos uno nosotros.
		this.id = id || randomUUID();
		this.createdAt = createdAt || new Date();

		this._name = name;
		this._email = email;
	}

	// 3. Getters: Permiten leer los datos privados de forma segura.
	public get name(): string {
		return this._name;
	}

	public get email(): string {
		return this._email;
	}

	// 4. Métodos de mutación: La única forma de cambiar el estado.
	// Aquí es donde la entidad se defiende a sí misma (Reglas de Negocio).
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