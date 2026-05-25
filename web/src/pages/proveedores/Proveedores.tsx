import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProveedorItem from './components/ProveedorItem';
import ProveedorModal from './components/ProveedorModal';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from '@/actions/proveedores.action.ts';
import type { ProveedorInterface } from '@/infrastructure/interfaces/models/proveedor.interface';

export default function Proveedores() {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] =
    useState<ProveedorInterface | null>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    type: 'info' | 'success' | 'danger';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    action: () => {},
  });

  const { data, isLoading } = useQuery({
    queryKey: ['proveedores', pagina],
    queryFn: () =>
      getProveedores({
        limit: limite,
        page: pagina,
      }),
    placeholderData: (previousData) => previousData,
  });

  const proveedores = data?.data || [];
  const pagination = data?.pagination;

  const createMutation = useMutation({
    mutationFn: createProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      setIsModalOpen(false);
      toast.success('Proveedor creado correctamente');
    },
    onError: () => toast.error('Error al crear proveedor'),
  });

  const updateMutation = useMutation({
    mutationFn: updateProveedor as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      setIsModalOpen(false);
      toast.success('Proveedor actualizado correctamente');
    },
    onError: () => toast.error('Error al actualizar proveedor'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] });
      toast.success('Proveedor eliminado');
    },
    onError: () => toast.error('Error al eliminar proveedor'),
  });

  const handleSubmit = (formData: Partial<ProveedorInterface>) => {
    setConfirmConfig({
      isOpen: true,
      title: selectedProveedor
        ? 'Confirmar actualización'
        : 'Confirmar creación',
      message: selectedProveedor
        ? '¿Estás seguro de que deseas actualizar este proveedor?'
        : '¿Estás seguro de que deseas crear este nuevo proveedor?',
      type: selectedProveedor ? 'info' : 'success',
      action: () => {
        if (selectedProveedor) {
          updateMutation.mutate({
            id: selectedProveedor.id_proveedor.toString(),
            data: formData,
          } as any);
        } else {
          createMutation.mutate(formData as any);
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleOpenCreate = () => {
    setSelectedProveedor(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proveedor: ProveedorInterface) => {
    setSelectedProveedor(proveedor);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirmar eliminación',
      message:
        '¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.',
      type: 'danger',
      action: () => {
        deleteMutation.mutate(id.toString());
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (isLoading && !data) return <p>Cargando proveedores...</p>;

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Proveedores
          </h1>
          <p className="text-[13px] text-gray-400">
            Gestión de proveedores de la botica
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
        >
          + Agregar proveedor
        </button>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {['Empresa', 'Contacto', 'Teléfono', 'Acciones'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-center text-[11px] font-medium tracking-wider text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {proveedores.map((p: any, i: number) => (
                <ProveedorItem
                  key={p.id_proveedor}
                  proveedor={p}
                  isLast={i === proveedores.length - 1}
                  onEdit={() => handleOpenEdit(p)}
                  onDelete={() => handleDelete(p.id_proveedor)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Mostrando {proveedores.length} de {pagination?.total || 0} proveedores
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-[#2ecc71]">
            {pagina} /{' '}
            {Math.ceil(
              (pagination?.total || 0) / (pagination?.limit || limite)
            ) || 1}
          </span>
          <button
            onClick={() => setPagina((p) => p + 1)}
            disabled={
              pagina >=
              (Math.ceil(
                (pagination?.total || 0) / (pagination?.limit || limite)
              ) || 1)
            }
            className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1 text-sm text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      <ProveedorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        proveedor={selectedProveedor}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.action}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
      />
    </div>
  );
}
