import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CategoriaModal from './components/CategoriaModal';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import type { Column } from '@/components/DataTable.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import type { SegmentedControlOption } from '@/components/SegmentedControl';
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../../actions/categorias.action';
import type { CategoriaInterface } from '@/infrastructure/interfaces/models/categoria.interface';

export default function Categorias() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const limite = 10;

  type EstadoFilter = 'TODOS' | 'ACTIVOS' | 'INACTIVOS';
  const [estadoCategoria, setEstadoCategoria] = useState<EstadoFilter>('TODOS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] =
    useState<CategoriaInterface | null>(null);

  const OPCIONES_FILTRO: SegmentedControlOption<EstadoFilter>[] = [
    { label: 'Todos', value: 'TODOS', color: 'grey' },
    { label: 'Activos', value: 'ACTIVOS', color: 'green' },
    { label: 'Inactivos', value: 'INACTIVOS', color: 'red' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [estadoCategoria]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setBusqueda(inputValue);
      setPagina(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

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

  const { data: dataCategorias, isFetching } = useQuery({
    queryKey: ['categorias', pagina, busqueda, estadoCategoria],
    queryFn: () =>
      getCategorias({
        limit: limite,
        page: pagina,
        search: busqueda,
        estado: estadoCategoria === 'TODOS' ? undefined : estadoCategoria,
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

  const handleRestore = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirmar restauración',
      message: '¿Estás seguro de que deseas reactivar esta categoría?',
      type: 'info',
      action: () => {
        updateMutation.mutate({
          id: id.toString(),
          data: { activo: true },
        } as any);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const columns: Column<any>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Descripción',
      render: (row) => (
        <span className="text-gray-300">{row.descripcion || '-'}</span>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            onClick={() => handleOpenEdit(row)}
          >
            Editar
          </button>
          {!row.activo ? (
            <button
              className="cursor-pointer rounded-md border border-[#2ecc71]/20 bg-[#2ecc71]/5 px-3 py-1.5 text-xs font-medium text-[#2ecc71] transition-all hover:bg-[#2ecc71] hover:text-white"
              onClick={() => handleRestore(row.id_categoria)}
            >
              Restaurar
            </button>
          ) : (
            <button
              className="cursor-pointer rounded-md border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
              onClick={() => handleDelete(row.id_categoria)}
            >
              Eliminar
            </button>
          )}
        </div>
      ),
    },
  ];

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
          className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
          onClick={handleOpenCreate}
        >
          + Agregar categoría
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categorias}
        emptyMessage="No se encontraron categorías."
        isFetching={isFetching}
        keyExtractor={(row) => row.id_categoria}
        loadingMessage="Cargando categorías..."
        pagination={{
          page: pagina,
          total: pagination?.total || 0,
          limit: limite,
          hasPrev: pagina > 1,
          hasNext: pagina < (Math.ceil((pagination?.total || 0) / limite) || 1),
          onPrev: () => setPagina((p) => Math.max(1, p - 1)),
          onNext: () => setPagina((p) => p + 1),
        }}
        search={{
          value: inputValue,
          onChange: setInputValue,
          placeholder: 'Buscar categoría...',
          isFetching: isFetching,
        }}
        segmentedControl={{
          options: OPCIONES_FILTRO,
          selectedValue: estadoCategoria,
          onChange: setEstadoCategoria,
        }}
      />

      <CategoriaModal
        categoria={selectedCategoria}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        isLoading={
          createMutation.isPending ||
          updateMutation.isPending ||
          deleteMutation.isPending
        }
        isOpen={confirmConfig.isOpen}
        message={confirmConfig.message}
        title={confirmConfig.title}
        type={confirmConfig.type}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.action}
      />
    </div>
  );
}
