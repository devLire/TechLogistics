import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CategoriaItem from './components/CategoriaItem';
import CategoriaModal from './components/CategoriaModal';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../../actions/categorias.action';
import type { CategoriaInterface } from '@/infrastructure/interfaces/models/categoria.interface';

export default function Categorias() {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] =
    useState<CategoriaInterface | null>(null);

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

  const { data: dataCategorias, isLoading } = useQuery({
    queryKey: ['categorias', pagina],
    queryFn: () =>
      getCategorias({
        limit: limite,
        page: pagina,
      }),
    placeholderData: (previousData) => previousData,
  });

  const categorias = dataCategorias?.data || [];
  const pagination = dataCategorias?.pagination;

  const createMutation = useMutation({
    mutationFn: createCategoria as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setIsModalOpen(false);
      toast.success('Categoría creada correctamente');
    },
    onError: () => toast.error('Error al crear categoría'),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategoria as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setIsModalOpen(false);
      toast.success('Categoría actualizada correctamente');
    },
    onError: () => toast.error('Error al actualizar categoría'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast.success('Categoría eliminada');
    },
    onError: () => toast.error('Error al eliminar categoría'),
  });

  const handleSubmit = (formData: Partial<CategoriaInterface>) => {
    setConfirmConfig({
      isOpen: true,
      title: selectedCategoria
        ? 'Confirmar actualización'
        : 'Confirmar creación',
      message: selectedCategoria
        ? '¿Estás seguro de que deseas actualizar esta categoría?'
        : '¿Estás seguro de que deseas crear esta nueva categoría?',
      type: selectedCategoria ? 'info' : 'success',
      action: () => {
        if (selectedCategoria) {
          updateMutation.mutate({
            id: selectedCategoria.id_categoria.toString(),
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
    setSelectedCategoria(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (categoria: CategoriaInterface) => {
    setSelectedCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirmar eliminación',
      message:
        '¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.',
      type: 'danger',
      action: () => {
        deleteMutation.mutate(id.toString());
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (isLoading && !dataCategorias) return <p>Cargando categorías...</p>;

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Categorías
          </h1>
          <p className="text-[13px] text-gray-400">
            Clasificación de productos farmacéuticos
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
        >
          + Agregar categoría
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {['Nombre', 'Descripción', 'Acciones'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[11px] font-medium tracking-wider text-gray-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categorias.map((c: any, i: number) => (
              <CategoriaItem
                key={c.id_categoria}
                categoria={c}
                isLast={i === categorias.length - 1}
                onEdit={() => handleOpenEdit(c)}
                onDelete={() => handleDelete(c.id_categoria)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Mostrando {categorias.length} de {pagination?.total || 0} categorías
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

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        categoria={selectedCategoria}
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
