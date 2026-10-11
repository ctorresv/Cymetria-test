// src/__tests__/infrastructure/http/controllers/UserController.test.ts
import { Request, Response } from "express";
import { Readable } from "stream";
import { UserController } from "../../../src/infrastructure/http/controllers/user.controller";
import { UserService, UpdateUserDTO } from "../../../src/domain/services/UserService";
import { UserExportService } from "../../../src/domain/services/UserExportService";
import { User } from "../../../src/domain/entities/User";
import { UserNotFoundError, UserAlreadyExistsError } from "../../../src/domain/errors/DomainError";

describe("UserController (Unit Test)", () => {
	let userController: UserController;

	let mockUserService: jest.Mocked<UserService>;
	let mockUserExportService: jest.Mocked<UserExportService>;

	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	beforeEach(() => {
		mockUserService = {
			getUsersPaginated: jest.fn(),
			getUserById: jest.fn(),
			createUser: jest.fn(),
			updateUser: jest.fn(),
			deleteUser: jest.fn(),
		} as unknown as jest.Mocked<UserService>;

		mockUserExportService = {
			exportAllUsers: jest.fn(),
		} as unknown as jest.Mocked<UserExportService>;

		userController = new UserController(mockUserService, mockUserExportService);

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			setHeader: jest.fn().mockReturnThis(),
		};
	});

	// =========================================================================
	// GET USERS
	// =========================================================================
	describe("getUsers", () => {
		it("debe responder con status 200 y el resultado paginado", async () => {
			const mockPaginatedData = {
				data: [new User("User 1", "u1@example.com", "usr-1")],
				page: 1, pageSize: 10, total: 1, totalPages: 1,
			};
			mockUserService.getUsersPaginated.mockResolvedValue(mockPaginatedData);
			mockRequest = { query: { page: "1", pageSize: "10" } };

			await userController.getUsers(mockRequest as Request, mockResponse as Response);

			expect(mockUserService.getUsersPaginated).toHaveBeenCalledWith(1, 10);
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockPaginatedData);
		});

		it("debe usar valores por defecto si no se envían query params", async () => {
			const mockPaginatedData = { data: [], page: 1, pageSize: 10, total: 0, totalPages: 0 };
			mockUserService.getUsersPaginated.mockResolvedValue(mockPaginatedData);
			mockRequest = { query: {} };

			await userController.getUsers(mockRequest as Request, mockResponse as Response);

			expect(mockUserService.getUsersPaginated).toHaveBeenCalledWith(1, 10);
		});
	});

	// =========================================================================
	// GET USER BY ID
	// =========================================================================
	describe("getUserById", () => {
		it("debe responder con status 200 y el usuario", async () => {
			const expectedUser = new User("Laura", "laura@example.com", "usr-1");
			mockUserService.getUserById.mockResolvedValue(expectedUser);
			mockRequest = { params: { id: "usr-1" } };

			await userController.getUserById(mockRequest as Request, mockResponse as Response);

			expect(mockUserService.getUserById).toHaveBeenCalledWith("usr-1");
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(expectedUser);
		});

		it("debe lanzar el error para que lo capture el middleware global", async () => {
			mockUserService.getUserById.mockRejectedValue(new UserNotFoundError("usr-invalid"));
			mockRequest = { params: { id: "usr-invalid" } };

			await expect(
				userController.getUserById(mockRequest as Request, mockResponse as Response)
			).rejects.toThrow(UserNotFoundError);

			expect(mockResponse.status).not.toHaveBeenCalled();
			expect(mockResponse.json).not.toHaveBeenCalled();
		});
	});

	// =========================================================================
	// CREATE USER
	// =========================================================================
	describe("createUser", () => {
		it("debe responder con status 201 y el usuario creado", async () => {
			const newUser = new User("Ana", "ana@example.com", "usr-2");
			mockUserService.createUser.mockResolvedValue(newUser);
			mockRequest = { body: { name: "  Ana  ", email: "ANA@EXAMPLE.COM" } };

			await userController.createUser(mockRequest as Request, mockResponse as Response);

			expect(mockUserService.createUser).toHaveBeenCalledWith({
				name: "Ana",
				email: "ana@example.com",
			});
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith({ ok: true, user: newUser });
		});
	});

	// =========================================================================
	// UPDATE USER
	// =========================================================================
	describe("updateUser", () => {
		it("debe responder con status 200 y el usuario actualizado", async () => {
			const updatedUser = new User("Ana Actualizada", "ana@example.com", "usr-2");
			mockUserService.updateUser.mockResolvedValue(updatedUser);
			mockRequest = { params: { id: "usr-2" }, body: { name: "Ana Actualizada" } };

			await userController.updateUser(mockRequest as Request, mockResponse as Response);

			expect(mockUserService.updateUser).toHaveBeenCalledWith("usr-2", { name: "Ana Actualizada" });
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({ ok: true, user: updatedUser });
		});

		it("debe lanzar error si el servicio falla (ej: email duplicado)", async () => {
			mockUserService.updateUser.mockRejectedValue(new UserAlreadyExistsError("otro@test.com"));
			mockRequest = { params: { id: "usr-2" }, body: { email: "otro@test.com" } };

			await expect(
				userController.updateUser(mockRequest as Request, mockResponse as Response)
			).rejects.toThrow(UserAlreadyExistsError);
		});
	});

	// =========================================================================
	// DELETE USER
	// =========================================================================
	describe("deleteUser", () => {
		it("debe responder con status 200 y mensaje de éxito", async () => {
			mockUserService.deleteUser.mockResolvedValue(undefined);
			mockRequest = { params: { id: "usr-3" } };

			await userController.deleteUser(mockRequest as Request, mockResponse as Response);

			expect(mockUserService.deleteUser).toHaveBeenCalledWith("usr-3");
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				ok: true,
				message: "Usuario eliminado correctamente."
			});
		});

		it("debe lanzar error si el usuario no existe", async () => {
			mockUserService.deleteUser.mockRejectedValue(new UserNotFoundError("usr-999"));
			mockRequest = { params: { id: "usr-999" } };

			await expect(
				userController.deleteUser(mockRequest as Request, mockResponse as Response)
			).rejects.toThrow(UserNotFoundError);
		});
	});

	// =========================================================================
	// EXPORT USERS (CSV)
	// =========================================================================
	describe("exportUsers", () => {
		it("debe configurar los headers correctos y hacer pipe del stream", async () => {
			// Creamos un stream falso para la prueba
			const mockStream = new Readable({ read() { } });
			mockStream.pipe = jest.fn();
			mockUserExportService.exportAllUsers.mockReturnValue(mockStream);

			mockRequest = {};

			await userController.exportUsers(mockRequest as Request, mockResponse as Response);

			expect(mockUserExportService.exportAllUsers).toHaveBeenCalled();
			expect(mockResponse.setHeader).toHaveBeenCalledWith("Content-Type", "text/csv; charset=utf-8");
			expect(mockResponse.setHeader).toHaveBeenCalledWith(
				"Content-Disposition",
				'attachment; filename="usuarios.csv"'
			);
			expect(mockStream.pipe).toHaveBeenCalledWith(mockResponse);
		});
	});
});