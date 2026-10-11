// src/app/page.tsx (o src/app/users/page.tsx)
"use client";

import { useState, useEffect } from "react";
import { useUserMutations } from "@/hooks/useUsers";
import { UserTable } from "@/components/users/UserTable";
import { SearchBar } from "@/components/users/SearchBar";
import { UserFormModal } from "@/components/users/UserFormModal";
import { DeleteConfirmModal } from "@/components/users/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { Plus, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {

  const [search, setSearch] = useState("");

  // Estados para modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState<{ id: string; name: string; email: string } | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { exportUsersMutation } = useUserMutations();

  const handleEdit = (id: string, name: string, email: string) => {
    setEditData({ id, name, email });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setIsDeleteOpen(true);
  };

  const handleExport = () => {
    exportUsersMutation.mutate(undefined, {
      onSuccess: () => toast.success("Descarga iniciada correctamente"),
      onError: (err: any) => toast.error(err.message || "Error al exportar"),
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl space-y-6">
      {/* Encabezado de la sección */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">
            Administra, crea y exporta los usuarios del sistema.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={exportUsersMutation.isPending}>
            {exportUsersMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Exportar CSV
          </Button>
          <Button onClick={() => { setEditData(null); setIsFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <SearchBar onSearch={setSearch} />

      {/* Componente autónomo que maneja sus propios datos y paginación */}
      <UserTable onEdit={handleEdit} onDelete={handleDeleteClick} search={search} />

      {/* Modales */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditData(null); }}
        editData={editData}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null); }}
        userId={deleteTarget?.id || null}
        userName={deleteTarget?.name || ""}
      />
    </div>
  );
}