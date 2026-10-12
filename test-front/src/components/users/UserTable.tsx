"use client";

import { useState, useMemo, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface UserTableProps {
    search: string;
    onEdit: (id: string, name: string, email: string) => void;
    onDelete: (id: string, name: string) => void;
}

export function UserTable({ search, onEdit, onDelete }: UserTableProps) {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const { data, isLoading, isError, error } = useUsers(page, pageSize, search);

    const handlePageSizeChange = (value: string) => {
        const parsedSize = parseInt(value, 10);
        const newSize = isNaN(parsedSize) ? 10 : parsedSize;
        setPageSize(newSize);
        setPage(1);
    };

    const totalItems = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    const pageSizeOptions = useMemo(() => {
        const standardOptions = [5, 10, 25, 50];
        const validOptions = standardOptions.filter((opt) => opt <= totalItems);

        if (validOptions.length === 0 && totalItems > 0) {
            return [totalItems];
        }

        if (totalItems === 0) {
            return [10];
        }

        return validOptions;
    }, [totalItems]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12 border rounded-md bg-muted/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de conexión</AlertTitle>
                <AlertDescription>
                    {error instanceof Error ? error.message : "No se pudieron cargar los usuarios."}
                </AlertDescription>
            </Alert>
        );
    }

    if (totalItems === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-16 border rounded-md bg-muted/10 border-dashed">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <AlertCircle className="h-8 w-8 text-muted-foreground animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No se encontraron usuarios</h3>
                <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                    {search ? `No hay resultados para "${search}".` : "Comienza agregando tu primer usuario al sistema."}
                </p>
            </div>
        );
    }

    if (!data || data.data.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-12 border rounded-md bg-muted/10">
                    <p className="text-muted-foreground">No hay datos en esta página.</p>
                </div>

                {/* Footer de paginación siempre visible cuando hay datos totales */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <label htmlFor="page-size-select" className="text-sm text-muted-foreground">
                            Filas por página:
                        </label>
                        <select
                            id="page-size-select"
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(e.target.value)}
                            className="flex h-9 w-[100px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            Página {page} de {totalPages} ({totalItems} resultados)
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Correo Electrónico</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fecha de Creación</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {data.data.map((user) => (
                            <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle font-medium">{user.name}</td>
                                <td className="p-4 align-middle">{user.email}</td>
                                <td className="p-4 align-middle text-muted-foreground">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="p-4 align-middle text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(user.id, user.name, user.email)} title="Editar">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(user.id, user.name)} title="Eliminar">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
                <div className="flex items-center gap-2">
                    <label htmlFor="page-size-select" className="text-sm text-muted-foreground">
                        Filas por página:
                    </label>
                    <select
                        id="page-size-select"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        className="flex h-9 w-[100px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {pageSizeOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages} ({totalItems} resultados)
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}