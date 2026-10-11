"use client";

import { useState, useEffect } from "react";
import { useUserMutations } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; 
import { toast } from "sonner";

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editData?: { id: string; name: string; email: string } | null;
}

export function UserFormModal({ isOpen, onClose, editData }: UserFormModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const { createUserMutation, updateUserMutation } = useUserMutations();

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setName(editData.name);
                setEmail(editData.email);
            } else {
                setName("");
                setEmail("");
            }
        }
    }, [isOpen, editData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error("Nombre y correo son obligatorios");
            return;
        }

        if (editData) {
            updateUserMutation.mutate(
                { id: editData.id, data: { name, email } },
                {
                    onSuccess: () => {
                        toast.success("Usuario actualizado correctamente");
                        onClose();
                    },
                    onError: (err: any) => toast.error(err.message || "Error al actualizar"),
                }
            );
        } else {
            createUserMutation.mutate(
                { name, email },
                {
                    onSuccess: () => {
                        toast.success("Usuario creado correctamente");
                        onClose();
                    },
                    onError: (err: any) => toast.error(err.message || "Error al crear"),
                }
            );
        }
    };

    const isPending = createUserMutation.isPending || updateUserMutation.isPending;

    return (
        /* 👇 Ya no envuelves en DialogContent, pones los hijos directo en Dialog */
        <Dialog isOpen={isOpen} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>{editData ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
                <DialogDescription>
                    {editData ? "Actualiza los datos del usuario." : "Ingresa los datos para registrar un nuevo usuario."}
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Carlos Torres"
                        disabled={isPending}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ej: carlos@example.com"
                        disabled={isPending}
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editData ? "Guardar Cambios" : "Crear Usuario"}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}