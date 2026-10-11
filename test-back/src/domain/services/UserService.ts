// src/domain/services/UserService.ts
import { injectable, inject } from "tsyringe";
import { User } from "../entities/User";
import { UserRepository, PaginatedUsersResult } from "../ports/UserRepository";
import { UserNotFoundError, UserAlreadyExistsError } from "../errors/DomainError";

// 1. Definimos DTOs claros (puedes moverlos a un archivo types/dto.ts si prefieres)
export interface CreateUserDTO {
	name: string;
	email: string;
}

export interface UpdateUserDTO {
	name?: string;
	email?: string;
}

@injectable()
export class UserService {
	constructor(
		@inject("UserRepository") private readonly userRepository: UserRepository
	) { }

	async createUser(dto: CreateUserDTO): Promise<User> {
		// La entidad ya valida en su constructor, pero el Service valida la regla de negocio global (email único)
		const existingUser = await this.userRepository.findByEmail(dto.email);
		if (existingUser) {
			throw new UserAlreadyExistsError(dto.email);
		}

		// La entidad se crea a sí misma de forma válida
		const newUser = new User(dto.name, dto.email);
		return await this.userRepository.create(newUser);
	}

	async getUserById(id: string): Promise<User> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			throw new UserNotFoundError(id);
		}
		return user;
	}

	async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
		// 1. Obtenemos la entidad (si no existe, getUserById lanza UserNotFoundError)
		const user = await this.getUserById(id);

		// 2. MODELO RICO: Le pedimos a la entidad que se actualice a sí misma.
		// Ella se encargará de validar que el nombre no esté vacío o el email sea válido.
		if (dto.name !== undefined) {
			user.updateName(dto.name);
		}

		if (dto.email !== undefined && dto.email !== user.email) {
			// Regla de negocio: Si cambia el email, verificar que no esté en uso
			const emailExists = await this.userRepository.findByEmail(dto.email);
			if (emailExists) {
				throw new UserAlreadyExistsError(dto.email);

			}
			user.updateEmail(dto.email);
		}

		// 3. Guardamos la entidad MUTADA (no un objeto partial)
		return await this.userRepository.update(id, user);
	}

	async deleteUser(id: string): Promise<void> {
		// Validamos que exista antes de intentar borrar (buena práctica para devolver 404 en lugar de 200 falso)
		await this.getUserById(id);
		await this.userRepository.delete(id);
	}

	async getUsersPaginated(page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedUsersResult> {
		const validPage = Math.max(1, page);
		const validPageSize = Math.max(1, Math.min(100, pageSize));
		return await this.userRepository.findAllPaginated(validPage, validPageSize, search ?? "");
	}
}