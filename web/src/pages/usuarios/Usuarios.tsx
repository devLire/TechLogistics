import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import type { Column } from '@/components/DataTable.tsx';
import { DataTable } from '@/components/DataTable.tsx';
import type { SegmentedControlOption } from '@/components/SegmentedControl';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/actions/usuarios.action.ts';
import type { UserInterface } from '@/infrastructure/interfaces/models';
import UsuarioModal from './components/UsuarioModal';

export const Usuarios = () => {
  const queryClient = useQueryClient();
  const [pagina, setPagina] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const limite = 10;

  type EstadoFilter = 'TODOS' | 'ACTIVOS' | 'INACTIVOS';
  const [estadoUsuario, setEstadoUsuario] = useState<EstadoFilter>('TODOS');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<Partial<UserInterface> | null>(null);

  const OPCIONES_FILTRO: SegmentedControlOption<EstadoFilter>[] = [
    { label: 'Todos', value: 'TODOS', color: 'grey' },
    { label: 'Activos', value: 'ACTIVOS', color: 'green' },
    { label: 'Inactivos', value: 'INACTIVOS', color: 'red' },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPagina((prev) => (prev === 1 ? prev : 1));
  }, [estadoUsuario]);

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
    queryKey: ['usuarios', pagina, busqueda, estadoUsuario],
    queryFn: () =>
      getUsers({
        limit: limite,
        page: pagina,
        search: busqueda,
        estado: estadoUsuario === 'TODOS' ? undefined : estadoUsuario,
      }),
    placeholderData: (previousData) => previousData,
  });

  const usuarios = data?.data || [];
  const pagination = data?.pagination;

  const createMutation = useMutation({
    mutationFn: createUser as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setIsModalOpen(false);
      toast.success('Usuario creado correctamente');
    },
    onError: () => toast.error('Error al crear usuario'),
  });

  const updateMutation = useMutation({
    mutationFn: updateUser as any,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setIsModalOpen(false);
      toast.success('Usuario actualizado correctamente');
    },
    onError: () => toast.error('Error al actualizar usuario'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('Usuario eliminado');
    },
    onError: () => toast.error('Error al eliminar usuario'),
  });

  const handleSubmit = (formData: Partial<UserInterface>) => {
    setConfirmConfig({
      isOpen: true,
      title: selectedUser ? 'Confirmar actualización' : 'Confirmar creación',
      message: selectedUser
        ? '¿Estás seguro de que deseas actualizar este usuario?'
        : '¿Estás seguro de que deseas crear este nuevo usuario?',
      type: selectedUser ? 'info' : 'success',
      action: () => {
        // Ignorar la contraseña si está vacía al actualizar
        const payload = { ...formData };
        if (selectedUser && !payload.password) {
          delete payload.password;
        }

        if (selectedUser) {
          updateMutation.mutate({
            id: selectedUser.id_usuario!.toString(),
            data: payload,
          } as any);
        } else {
          createMutation.mutate(payload as any);
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirmar eliminación',
      message:
        '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
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
      message: '¿Estás seguro de que deseas reactivar este usuario?',
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
      header: 'Email',
      render: (row) => (
        <span className="text-gray-300">{row.email || '-'}</span>
      ),
    },
    {
      header: 'Rol',
      render: (row) => (
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            row.rol === 'ADMINISTRADOR'
              ? 'border border-purple-500/20 bg-purple-500/10 text-purple-400'
              : row.rol === 'SUPERVISOR'
                ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400'
                : 'border border-gray-500/20 bg-gray-500/10 text-gray-400'
          }`}
        >
          {row.rol}
        </span>
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
              onClick={() => handleRestore(row.id_usuario)}
            >
              Restaurar
            </button>
          ) : (
            <button
              className="cursor-pointer rounded-md border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
              onClick={() => handleDelete(row.id_usuario)}
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
            Usuarios
          </h1>
          <p className="text-[13px] text-gray-400">
            Gestión de usuarios y accesos al sistema
          </p>
        </div>
        <button
          className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
          onClick={handleOpenCreate}
        >
          + Agregar usuario
        </button>
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
        emptyMessage="No se encontraron usuarios."
        isFetching={isFetching}
        keyExtractor={(row) => row.id_usuario}
        loadingMessage="Cargando usuarios..."
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
          placeholder: 'Buscar por nombre o email...',
          isFetching: isFetching,
        }}
        segmentedControl={{
          options: OPCIONES_FILTRO,
          selectedValue: estadoUsuario,
          onChange: setEstadoUsuario,
        }}
      />

      <UsuarioModal
        isOpen={isModalOpen}
        usuario={selectedUser}
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
};
