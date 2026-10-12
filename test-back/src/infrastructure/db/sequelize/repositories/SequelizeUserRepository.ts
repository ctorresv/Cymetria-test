import { injectable } from "tsyringe";
import { Op, InferAttributes } from "sequelize";
import { User } from "../../../../domain/entities/User";
import { UserRepository, PaginatedUsersResult } from "../../../../domain/ports/UserRepository";
import { UserModel } from "../models/user.model";
import { UserNotFoundError } from "../../../../domain/errors/DomainError";

type RawUser = InferAttributes<UserModel>;

@injectable()
export class SequelizeUserRepository implements UserRepository {

	private toDomain(model: UserModel): User {
		return new User(model.name, model.email, model.id, model.createdAt);
	}

	private rawToDomain(raw: RawUser): User {
		return new User(raw.name, raw.email, raw.id, raw.createdAt);
	}

	async create(user: User): Promise<User> {
		const created = await UserModel.create({
			id: user.id,
			name: user.name,
			email: user.email,
		});
		return this.toDomain(created);
	}

	async findById(id: string): Promise<User | null> {
		const found = await UserModel.findByPk(id);
		return found ? this.toDomain(found) : null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const found = await UserModel.findOne({
			where: { email: { [Op.iLike]: email } },
		});
		return found ? this.toDomain(found) : null;
	}

	async update(id: string, user: User): Promise<User> {
		const existing = await UserModel.findByPk(id);
		if (!existing) {
			throw new UserNotFoundError(`Usuario con id ${id} no encontrado`);
		}

		await existing.update({
			name: user.name,
			email: user.email,
		});

		return this.toDomain(existing);
	}

	async delete(id: string): Promise<boolean> {
		const deletedCount = await UserModel.destroy({ where: { id } });
		return deletedCount > 0;
	}

	async findAllPaginated(page: number, pageSize: number, search?: string): Promise<PaginatedUsersResult> {
		const offset = (page - 1) * pageSize;

		const whereClause: any = {};
		if (search) {
			whereClause[Op.or] = [
				{ name: { [Op.iLike]: `%${search}%` } },
				{ email: { [Op.iLike]: `%${search}%` } },
			];
		}

		const { rows, count } = await UserModel.findAndCountAll({
			where: whereClause,
			limit: pageSize,
			offset,
			order: [["createdAt", "DESC"]],
		});

		return {
			data: rows.map((row) => this.toDomain(row)),
			page,
			pageSize,
			total: count,
			totalPages: Math.ceil(count / pageSize) || 1,
		};
	}

	async *findAllStream(): AsyncIterable<User> {
		const batchSize = 1000;
		let offset = 0;
		let hasMore = true;

		while (hasMore) {
			const rows = await UserModel.findAll({
				limit: batchSize,
				offset,
				order: [["id", "ASC"]],
				raw: true,
			});

			if (rows.length === 0) {
				hasMore = false;
				break;
			}

			for (const row of rows) {
				yield this.rawToDomain(row);
			}

			offset += batchSize;
		}
	}
}