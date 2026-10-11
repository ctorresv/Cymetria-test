"use client";

import { useUserMutations } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    userName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, userId, userName }: DeleteConfirmModalProps) {
    const { deleteUserMutation } = useUserMutations();

    const handleDelete = () => {
        if (!userId) return;
        deleteUserMutation.mutate(userId, {
            onSuccess: () => {
                toast.success("Usuario eliminado correctamente");
                onClose();
            },
            onError: (err: any) => toast.error(err.message || "Error al eliminar"),
        });
    };

    return (
        <Dialog isOpen={isOpen} onOpenChange={onClose} showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
                <DialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente a <strong>{userName}</strong> del sistema.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={deleteUserMutation.isPending}
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteUserMutation.isPending}
                >
                    {deleteUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {deleteUserMutation.isPending ? "Eliminando..." : "Sí, eliminar"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}