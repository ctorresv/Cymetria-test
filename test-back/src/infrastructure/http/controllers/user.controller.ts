import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import { UserService, UpdateUserDTO } from "../../../domain/services/UserService";
import { UserExportService } from "../../../domain/services/UserExportService";

@injectable()
export class UserController {
	constructor(
		@inject(UserService) private readonly userService: UserService,
		@inject(UserExportService) private readonly userExportService: UserExportService
	) { }


	async getUsers(req: Request, res: Response): Promise<void> {
		const page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
		const pageSize = typeof req.query.pageSize === "string" ? parseInt(req.query.pageSize, 10) : 10;
		const search = typeof req.query.search === "string" ? req.query.search : undefined;

		const result = await this.userService.getUsersPaginated(page, pageSize, search);
		res.status(200).json(result);
	}

	async getUserById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const user = await this.userService.getUserById(id);

		res.status(200).json(user);
	}

	async createUser(req: Request, res: Response): Promise<void> {
		const createUserDTO = {
			name: String(req.body.name || "").trim(),
			email: String(req.body.email || "").trim().toLowerCase(),
		};

		const user = await this.userService.createUser(createUserDTO);
		res.status(201).json({ ok: true, user });
	}

	async updateUser(req: Request, res: Response): Promise<void> {
		const { id } = req.params;

		const updateUserDTO: UpdateUserDTO = {};
		if (req.body.name !== undefined) {
			updateUserDTO.name = String(req.body.name).trim();
		}
		if (req.body.email !== undefined) {
			updateUserDTO.email = String(req.body.email).trim().toLowerCase();
		}

		const user = await this.userService.updateUser(id, updateUserDTO);
		res.status(200).json({ ok: true, user });
	}

	async deleteUser(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		await this.userService.deleteUser(id);
		res.status(200).json({ ok: true, message: "Usuario eliminado correctamente." });
	}

	async exportUsers(_req: Request, res: Response): Promise<void> {
		const fileStream = this.userExportService.exportAllUsers();

		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		res.setHeader("Content-Disposition", 'attachment; filename="usuarios.csv"');

		fileStream.pipe(res);
	}
}