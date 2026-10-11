import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { CreateUserDTO, UpdateUserDTO } from "../types/user";

export function useUsers(page: number = 1, pageSize: number = 10, search: string = "") {
    return useQuery({
        queryKey: ["users", page, pageSize, search],
        queryFn: () => userService.getUsers(page, pageSize, search),
        placeholderData: keepPreviousData,
    });
}

export function useUserMutations() {
    const queryClient = useQueryClient();

    const createUserMutation = useMutation({
        mutationFn: (data: CreateUserDTO) => userService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
            userService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });

    const exportUsersMutation = useMutation({
        mutationFn: () => userService.exportUsers(),
    });

    return {
        createUserMutation,
        updateUserMutation,
        deleteUserMutation,
        exportUsersMutation,
    };
}