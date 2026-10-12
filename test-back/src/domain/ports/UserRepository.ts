import { User } from "../entities/User";

export interface PaginatedUsersResult {
	data: User[];
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
}

export interface UserRepository {
	create(user: User): Promise<User>;
	findById(id: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	update(id: string, user: User): Promise<User>; 
	delete(id: string): Promise<boolean>;
	findAllPaginated(page: number, pageSize: number, search: string): Promise<PaginatedUsersResult>;
	findAllStream(): AsyncIterable<User>;
}