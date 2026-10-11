import { injectable } from "tsyringe";
import { User } from "../../../domain/entities/User";
import { UserRepository, PaginatedUsersResult } from "../../../domain/ports/UserRepository";

@injectable()
export class InMemoryUserRepository implements UserRepository {
	private users: Map<string, User> = new Map();

	constructor() {
		// Datos semilla para pruebas e iteración inicial (ej. 25 usuarios)
		for (let i = 1; i <= 5000; i++) {
			const id = `usr-${i}`;
			this.users.set(id, new User(`Usuario ${i}`, `usuario${i}@example.com`, id, new Date()));
		}
	}

	async create(user: User): Promise<User> {
		const id = user.id || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		const newUser = new User(user.name, user.email, id, user.createdAt || new Date());
		this.users.set(id, newUser);
		return newUser;
	}

	async findById(id: string): Promise<User | null> {
		return this.users.get(id) || null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const lowerEmail = email.toLowerCase();
		for (const user of this.users.values()) {
			if (user.email.toLowerCase() === lowerEmail) {
				return user;
			}
		}
		return null;
	}

	async update(id: string, userPartial: Partial<User>): Promise<User> {
		const existing = await this.findById(id);
		if (!existing) throw new Error("User not found");

		const updated = new User(
			userPartial.name ?? existing.name,
			userPartial.email ?? existing.email,
			existing.id,
			existing.createdAt
		);

		this.users.set(id, updated);
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		return this.users.delete(id);
	}

	async findAllPaginated(page: number, pageSize: number): Promise<PaginatedUsersResult> {
		// Ordenamiento determinístico por ID
		const allUsers = Array.from(this.users.values()).sort((a, b) =>
			(a.id || "").localeCompare(b.id || "")
		);

		const total = allUsers.length;
		const totalPages = Math.ceil(total / pageSize) || 1;
		const startIndex = (page - 1) * pageSize;
		const paginatedData = allUsers.slice(startIndex, startIndex + pageSize);

		return {
			data: paginatedData,
			page,
			pageSize,
			total,
			totalPages,
		};
	}

	// Permite procesar grandes volúmenes de datos (streaming) sin bloquear memoria
	async *findAllStream(): AsyncIterable<User> {
		const sortedUsers = Array.from(this.users.values()).sort((a, b) =>
			(a.id || "").localeCompare(b.id || "")
		);

		for (const user of sortedUsers) {
			yield user;
		}
	}
}