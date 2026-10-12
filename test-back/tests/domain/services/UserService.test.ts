import { UserService, CreateUserDTO, UpdateUserDTO } from "../../../src/domain/services/UserService";
import { UserRepository } from "../../../src/domain/ports/UserRepository";
import { User } from "../../../src/domain/entities/User";
import { UserAlreadyExistsError, UserNotFoundError } from "../../../src/domain/errors/DomainError";

describe("UserService (Unit Test)", () => {
	let userService: UserService;
	let mockUserRepository: jest.Mocked<UserRepository>;

	beforeEach(() => {
		mockUserRepository = {
			create: jest.fn(),
			findById: jest.fn(),
			findByEmail: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
			findAllPaginated: jest.fn(),
			findAllStream: jest.fn(),
		};

		userService = new UserService(mockUserRepository);
	});

	// ============================================================================
	// CREATE USER
	// ============================================================================
	describe("createUser", () => {
		it("debe crear un usuario exitosamente si el email no está registrado", async () => {
			const userData: CreateUserDTO = { name: "Carlos Torres", email: "carlos@example.com" };
			const createdUser = new User(userData.name, userData.email, "usr-123");

			mockUserRepository.findByEmail.mockResolvedValue(null);
			mockUserRepository.create.mockResolvedValue(createdUser);

			const result = await userService.createUser(userData);

			expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
			expect(mockUserRepository.create).toHaveBeenCalledWith(expect.any(User));
			expect(result).toEqual(createdUser);
		});

		it("debe lanzar UserAlreadyExistsError si el email ya existe", async () => {
			const userData: CreateUserDTO = { name: "Carlos Torres", email: "carlos@example.com" };
			const existingUser = new User("Carlos Existente", userData.email, "usr-999");

			mockUserRepository.findByEmail.mockResolvedValue(existingUser);

			await expect(userService.createUser(userData)).rejects.toThrow(UserAlreadyExistsError);
			await expect(userService.createUser(userData)).rejects.toThrow(
				"Ya existe un usuario registrado con el email 'carlos@example.com'."
			);
			expect(mockUserRepository.create).not.toHaveBeenCalled();
		});
	});

	// ============================================================================
	// GET USER BY ID
	// ============================================================================
	describe("getUserById", () => {
		it("debe retornar el usuario si existe", async () => {
			const expectedUser = new User("Laura", "laura@example.com", "usr-1");
			mockUserRepository.findById.mockResolvedValue(expectedUser);

			const result = await userService.getUserById("usr-1");

			expect(mockUserRepository.findById).toHaveBeenCalledWith("usr-1");
			expect(result).toEqual(expectedUser);
		});

		it("debe lanzar UserNotFoundError si el usuario no existe", async () => {
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(userService.getUserById("usr-invalid")).rejects.toThrow(UserNotFoundError);			
		});
	});

	// ============================================================================
	// UPDATE USER
	// ============================================================================
	describe("updateUser", () => {
		it("debe actualizar solo el nombre si solo se proporciona nombre", async () => {
			const existingUser = new User("Nombre Viejo", "viejo@example.com", "usr-1");
			const updateData: UpdateUserDTO = { name: "Nombre Nuevo" };
			const updatedUser = new User("Nombre Nuevo", "viejo@example.com", "usr-1");

			mockUserRepository.findById.mockResolvedValue(existingUser);
			mockUserRepository.update.mockResolvedValue(updatedUser);

			const result = await userService.updateUser("usr-1", updateData);

			expect(mockUserRepository.findById).toHaveBeenCalledWith("usr-1");
			expect(mockUserRepository.update).toHaveBeenCalledWith("usr-1", expect.any(User));
			expect(result.name).toBe("Nombre Nuevo");
			expect(result.email).toBe("viejo@example.com"); // Email no cambió
		});

		it("debe actualizar solo el email si solo se proporciona email", async () => {
			const existingUser = new User("Nombre Viejo", "viejo@example.com", "usr-1");
			const updateData: UpdateUserDTO = { email: "nuevo@example.com" };
			const updatedUser = new User("Nombre Viejo", "nuevo@example.com", "usr-1");

			mockUserRepository.findByEmail.mockResolvedValue(null); // Email nuevo no existe
			mockUserRepository.findById.mockResolvedValue(existingUser);
			mockUserRepository.update.mockResolvedValue(updatedUser);

			const result = await userService.updateUser("usr-1", updateData);

			expect(result.email).toBe("nuevo@example.com");
			expect(result.name).toBe("Nombre Viejo"); // Nombre no cambió
		});

		it("debe lanzar UserAlreadyExistsError si el nuevo email ya está en uso", async () => {
			const existingUser = new User("Usuario Actual", "actual@example.com", "usr-1");
			const updateData: UpdateUserDTO = { email: "otro@example.com" };
			const conflictingUser = new User("Otro Usuario", "otro@example.com", "usr-2");

			mockUserRepository.findById.mockResolvedValue(existingUser);
			mockUserRepository.findByEmail.mockResolvedValue(conflictingUser);

			await expect(userService.updateUser("usr-1", updateData)).rejects.toThrow(
				UserAlreadyExistsError
			);
			expect(mockUserRepository.update).not.toHaveBeenCalled();
		});

		it("debe lanzar UserNotFoundError si el usuario no existe", async () => {
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(userService.updateUser("usr-invalid", { name: "Nuevo" })).rejects.toThrow(
				UserNotFoundError
			);
		});
	});

	// ============================================================================
	// DELETE USER
	// ============================================================================
	describe("deleteUser", () => {
		it("debe eliminar un usuario existente", async () => {
			const existingUser = new User("Para Borrar", "borrar@example.com", "usr-1");

			mockUserRepository.findById.mockResolvedValue(existingUser);
			mockUserRepository.delete.mockResolvedValue(true);

			await userService.deleteUser("usr-1");

			expect(mockUserRepository.findById).toHaveBeenCalledWith("usr-1");
			expect(mockUserRepository.delete).toHaveBeenCalledWith("usr-1");
		});

		it("debe lanzar UserNotFoundError si intenta eliminar un usuario inexistente", async () => {
			mockUserRepository.findById.mockResolvedValue(null);

			await expect(userService.deleteUser("usr-invalid")).rejects.toThrow(UserNotFoundError);
			expect(mockUserRepository.delete).not.toHaveBeenCalled();
		});
	});

	// ============================================================================
	// GET USERS PAGINATED
	// ============================================================================
	describe("getUsersPaginated", () => {
		it("debe retornar usuarios paginados con valores por defecto", async () => {
			const mockResult = {
				data: [new User("User1", "user1@example.com", "usr-1")],
				page: 1,
				pageSize: 10,
				total: 1,
				totalPages: 1,
			};

			mockUserRepository.findAllPaginated.mockResolvedValue(mockResult);

			const result = await userService.getUsersPaginated();

			expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith(1, 10, "");
			expect(result).toEqual(mockResult);
		});

		it("debe usar los parámetros de paginación proporcionados", async () => {
			const mockResult = {
				data: [new User("User1", "user1@example.com", "usr-1")],
				page: 3,
				pageSize: 20,
				total: 100,
				totalPages: 5,
			};

			mockUserRepository.findAllPaginated.mockResolvedValue(mockResult);

			await userService.getUsersPaginated(3, 20);

			expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith(3, 20, "");
		});

		it("debe sanitizar página negativa a 1", async () => {
			const mockResult = {
				data: [],
				page: 1,
				pageSize: 10,
				total: 0,
				totalPages: 0,
			};

			mockUserRepository.findAllPaginated.mockResolvedValue(mockResult);

			await userService.getUsersPaginated(-5, 10);

			expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith(1, 10, "");
		});

		it("debe sanitizar pageSize mayor a 100", async () => {
			const mockResult = {
				data: [],
				page: 1,
				pageSize: 10,
				total: 0,
				totalPages: 0,
			};

			mockUserRepository.findAllPaginated.mockResolvedValue(mockResult);

			await userService.getUsersPaginated(1, 500);

			expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith(1, 100, "");
		});

		it("debe sanitizar pageSize negativo o cero a 1", async () => {
			const mockResult = {
				data: [],
				page: 1,
				pageSize: 10,
				total: 0,
				totalPages: 0,
			};

			mockUserRepository.findAllPaginated.mockResolvedValue(mockResult);

			await userService.getUsersPaginated(1, 0);

			expect(mockUserRepository.findAllPaginated).toHaveBeenCalledWith(1, 1, "");
		});
	});
});