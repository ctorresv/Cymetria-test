import { injectable, inject } from "tsyringe";
import { User } from "../entities/User";
import { UserRepository, PaginatedUsersResult } from "../ports/UserRepository";
import { UserNotFoundError, UserAlreadyExistsError } from "../errors/DomainError";

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
		const existingUser = await this.userRepository.findByEmail(dto.email);
		if (existingUser) {
			throw new UserAlreadyExistsError(dto.email);
		}

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
		const user = await this.getUserById(id);

		if (dto.name !== undefined) {
			user.updateName(dto.name);
		}

		if (dto.email !== undefined && dto.email !== user.email) {
			const emailExists = await this.userRepository.findByEmail(dto.email);
			if (emailExists) {
				throw new UserAlreadyExistsError(dto.email);

			}
			user.updateEmail(dto.email);
		}

		return await this.userRepository.update(id, user);
	}

	async deleteUser(id: string): Promise<void> {
		await this.getUserById(id);
		await this.userRepository.delete(id);
	}

	async getUsersPaginated(page: number = 1, pageSize: number = 10, search?: string): Promise<PaginatedUsersResult> {
		const validPage = Math.max(1, page);
		const validPageSize = Math.max(1, Math.min(100, pageSize));
		return await this.userRepository.findAllPaginated(validPage, validPageSize, search ?? "");
	}
}