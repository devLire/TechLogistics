import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from '@/actions/productos.action.ts';
import ProductoModal from './components/ProductoModal';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import type { Column } from '@/components/DataTable';
import { DataTable } from '@/components/DataTable';
import type { SegmentedControlOption } from '@/components/SegmentedControl';
import type { Datum as ProductoDatum } from '@/infrastructure/interfaces/responses/products.response';
import { getCategorias } from '@/actions/categorias.action.ts';
import { getProveedores } from '@/actions/proveedores.action.ts';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';

export default function Productos() {
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [estadoProductos, setEstadoProductos] = useState<
    'TODOS' | 'ACTIVOS' | 'INACTIVOS'
  >('TODOS');
  const limite = 10;
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoDatum | null>(
    null
  );

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

  const queryClient = useQueryClient();

  // Categorias
  const { data: catData } = useQuery({
    queryKey: ['categorias-select'],
    queryFn: () => getCategorias({ limit: 100 }),
  });

  // Proveedores
  const { data: provData } = useQuery({
    queryKey: ['proveedores-select'],
    queryFn: () => getProveedores({ limit: 100 }),
  });

  const categorias = catData?.data || [];
  const proveedores = provData?.data || [];

  // Crear
  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsModalOpen(false);
      toast.success('Producto creado con éxito');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error al crear el producto');
    },
  });

  // Editar
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateProducto({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setIsModalOpen(false);
      toast.success('Producto actualizado con éxito');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error al actualizar el producto');
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      toast.success('Producto eliminado con éxito');
    },
    onError: () => {
      toast.error('No se pudo eliminar el producto');
    },
  });

  const handleDelete = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Confirmar eliminación',
      message:
        '¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.',
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
      message: '¿Estás seguro de que deseas reactivar este producto?',
      type: 'info',
      action: () => {
        updateMutation.mutate({
          id: id.toString(),
          data: { activo: true },
        });
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setBusqueda(inputValue);
      setPagina(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['productos', pagina, busqueda, estadoProductos],
    queryFn: () =>
      getProductos({
        limit: limite,
        page: pagina,
        search: busqueda,
        estado:
          estadoProductos !== 'TODOS'
            ? estadoProductos.toLowerCase()
            : undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const productos = data?.data || [];
  const pagination = data?.pagination;

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (producto: ProductoDatum) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData: any) => {
    setConfirmConfig({
      isOpen: true,
      title: selectedProduct ? 'Confirmar actualización' : 'Confirmar creación',
      message: selectedProduct
        ? '¿Estás seguro de que deseas actualizar este producto?'
        : '¿Estás seguro de que deseas crear este nuevo producto?',
      type: selectedProduct ? 'info' : 'success',
      action: () => {
        if (selectedProduct) {
          updateMutation.mutate({
            id: selectedProduct.id_producto.toString(),
            data: formData,
          });
        } else {
          // Si no, estamos CREANDO
          createMutation.mutate(formData);
        }
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const productStatusOptions: SegmentedControlOption<
    'TODOS' | 'ACTIVOS' | 'INACTIVOS'
  >[] = [
    { label: 'Todos', value: 'TODOS', color: 'grey' },
    { label: 'Activos', value: 'ACTIVOS', color: 'green' },
    { label: 'Inactivos', value: 'INACTIVOS', color: 'red' },
  ];

  const columns: Column<ProductoDatum>[] = [
    { header: 'Nombre', accessor: 'nombre' },
    {
      header: 'Proveedor',
      render: (row) => row.proveedor?.nombre_empresa || '-',
    },
    {
      header: 'Código',
      render: (row) => (
        <span className="text-gray-500">{row.codigo_barras}</span>
      ),
    },
    {
      header: 'Precio',
      render: (row) => (
        <span className="text-gray-300">
          S/ {Number(row.precio_venta).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Stock actual',
      render: (row) => (
        <span
          className={
            row.stock_actual < row.stock_minimo
              ? 'font-bold text-red-500'
              : 'font-bold text-[#2ecc71]'
          }
        >
          {row.stock_actual}
        </span>
      ),
    },
    {
      header: 'Stock mínimo',
      render: (row) => (
        <span className="text-gray-500">{row.stock_minimo}</span>
      ),
    },
    {
      header: 'Categoría',
      render: (row) => (
        <span className="text-gray-300">
          {typeof row.categoria === 'string'
            ? row.categoria
            : row.categoria?.nombre || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      render: (row) => (
        <div className="flex justify-center">
          {row.stock_actual < row.stock_minimo ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-bold tracking-wider whitespace-nowrap text-red-500 uppercase">
              STOCK BAJO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#2ecc71]/20 bg-[#2ecc71]/10 px-3 py-1 text-[11px] font-bold tracking-wider whitespace-nowrap text-[#2ecc71] uppercase">
              <span className="text-[10px]">✓</span> OK
            </span>
          )}
        </div>
      ),
    },
  ];

  if (user?.rol === 'ADMINISTRADOR') {
    columns.push({
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="cursor-pointer rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
            onClick={() => handleOpenEdit(row)}
          >
            Editar
          </button>
          {estadoProductos === 'INACTIVOS' ? (
            <button
              className="cursor-pointer rounded-md border border-[#2ecc71]/20 bg-[#2ecc71]/5 px-3 py-1.5 text-xs font-medium text-[#2ecc71] transition-all hover:bg-[#2ecc71] hover:text-white"
              onClick={() => handleRestore(row.id_producto)}
            >
              Restaurar
            </button>
          ) : (
            <button
              className="cursor-pointer rounded-md border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-500 hover:text-white"
              onClick={() => handleDelete(row.id_producto)}
            >
              Eliminar
            </button>
          )}
        </div>
      ),
    });
  }

  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-1 text-[22px] font-semibold text-white">
            Productos
          </h1>
          <p className="text-[13px] text-gray-400">
            Catálogo de medicamentos e inventario
          </p>
        </div>
        {user?.rol === 'ADMINISTRADOR' && (
          <button
            className="cursor-pointer rounded-lg bg-[#2ecc71] px-5 py-2.5 font-bold text-[#0f4c35] transition-colors hover:bg-[#27ae60]"
            onClick={handleOpenCreate}
          >
            + Agregar producto
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={productos}
        emptyMessage="No se encontraron productos."
        isFetching={isFetching}
        isLoading={isLoading}
        keyExtractor={(row) => row.id_producto}
        loadingMessage="Cargando catálogo..."
        pagination={{
          page: pagination?.page || 1,
          total: pagination?.total || 0,
          limit: limite,
          hasPrev: !!pagination?.prev,
          hasNext: !!pagination?.next,
          onPrev: () => setPagina((prev) => Math.max(prev - 1, 1)),
          onNext: () => setPagina((prev) => prev + 1),
        }}
        search={{
          value: inputValue,
          onChange: setInputValue,
          placeholder: 'Buscar por nombre o código...',
          isFetching,
        }}
        segmentedControl={{
          options: productStatusOptions,
          selectedValue: estadoProductos,
          onChange: setEstadoProductos,
        }}
      />

      <ProductoModal
        categorias={categorias}
        isOpen={isModalOpen}
        producto={selectedProduct}
        proveedores={proveedores}
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
