export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}