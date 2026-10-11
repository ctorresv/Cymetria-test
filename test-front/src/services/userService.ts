import { PaginatedUsersResponse, User, CreateUserDTO, UpdateUserDTO } from "../types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const userService = {
  getUsers: async (page: number = 1, pageSize: number = 10, search: string = ""): Promise<PaginatedUsersResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (search.trim()) {
      params.append("search", search.trim());
    }

    const res = await fetch(`${API_BASE_URL}/users?${params.toString()}`);
    console.log("🌐 [Frontend Service] Fetching URL:", res);
    if (!res.ok) throw new Error("Error al obtener la lista de usuarios.");
    return res.json();
  },

  getUserById: async (id: string): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error("Usuario no encontrado.");
    return res.json();
  },

  createUser: async (data: CreateUserDTO): Promise<{ ok: boolean; user: User }> => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al crear el usuario.");
    return result;
  },

  updateUser: async (id: string, data: UpdateUserDTO): Promise<{ ok: boolean; user: User }> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al actualizar el usuario.");
    return result;
  },

  deleteUser: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar el usuario.");
  },

  exportUsers: async (): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/users/export`);
    if (!res.ok) throw new Error("Error al exportar los datos.");

    // Procesa la descarga del archivo binario / stream
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};