import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProveedorModal from './components/ProveedorModal';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import type { Column } from '@/components/DataTable.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import type { SegmentedControlOption } from '@/components/SegmentedControl';
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
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const limite = 10;

  type EstadoFilter = 'TODOS' | 'ACTIVOS' | 'INACTIVOS';
  const [estadoProveedor, setEstadoProveedor] = useState<EstadoFilter>('TODOS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProveedor, setSelectedProveedor] =
    useState<ProveedorInterface | null>(null);

  const OPCIONES_FILTRO: SegmentedControlOption<EstadoFilter>[] = [
    { label: 'Todos', value: 'TODOS', color: 'grey' },
    { label: 'Activos', value: 'ACTIVOS', color: 'green' },
    { label: 'Inactivos', value: 'INACTIVOS', color: 'red' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [estadoProveedor]);

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

  const { data, isFetching } = useQuery({
    queryKey: ['proveedores', pagina, busqueda, estadoProveedor],
    queryFn: () =>
      getProveedores({
        limit: limite,
        page: pagina,
        search: busqueda,
        estado: estadoProveedor === 'TODOS' ? undefined : estadoProveedor,
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

  const handleRestore = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirmar restauración',
      message: '¿Estás seguro de que deseas reactivar este proveedor?',
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
    { header: 'Empresa', accessor: 'nombre_empresa' },
    {
      header: 'Contacto',
      render: (row) => (
        <span className="text-gray-300">{row.contacto || '-'}</span>
      ),
    },
    {
      header: 'Teléfono',
      render: (row) => (
        <span className="text-gray-300">{row.telefono || '-'}</span>
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
              onClick={() => handleRestore(row.id_proveedor)}
            >
              Restaurar
            </button>
          ) : (
            <button
              className="cursor-pointer rounded-md border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
              onClick={() => handleDelete(row.id_proveedor)}
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
            Proveedores
          </h1>
          <p className="text-[13px] text-gray-400">
            Gestión de proveedores de la botica
          </p>
        </div>
        <button
          className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
          onClick={handleOpenCreate}
        >
          + Agregar proveedor
        </button>
      </div>

      <DataTable
        columns={columns}
        data={proveedores}
        emptyMessage="No se encontraron proveedores."
        isFetching={isFetching}
        keyExtractor={(row) => row.id_proveedor}
        loadingMessage="Cargando proveedores..."
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
          placeholder: 'Buscar proveedor...',
          isFetching: isFetching,
        }}
        segmentedControl={{
          options: OPCIONES_FILTRO,
          selectedValue: estadoProveedor,
          onChange: setEstadoProveedor,
        }}
      />

      <ProveedorModal
        isOpen={isModalOpen}
        proveedor={selectedProveedor}
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
