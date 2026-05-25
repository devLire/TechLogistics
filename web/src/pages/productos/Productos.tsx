import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Product from './components/Product';
import {
  createProducto,
  deleteProducto,
  getProductos,
  updateProducto,
} from '@/actions/productos.action.ts';
import ProductoModal from './components/ProductoModal';
import ConfirmModal from '@/components/ConfirmModal.tsx';
import type { ProductoInterface } from '@/infrastructure/interfaces/models/producto.interface';
import { getCategorias } from '@/actions/categorias.action.ts';
import { getProveedores } from '@/actions/proveedores.action.ts';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';

export default function Productos() {
  const [inputValue, setInputValue] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const limite = 10;
  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductoInterface | null>(null);

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
    queryKey: ['productos', pagina, busqueda],
    queryFn: () =>
      getProductos({
        limit: limite,
        page: pagina,
        search: busqueda,
      }),
    placeholderData: (previousData) => previousData,
  });

  const productos = data?.data || [];
  const pagination = data?.pagination;

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (producto: ProductoInterface) => {
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

      <div className="relative mb-6">
        <input
          className="w-[300px] rounded-lg border border-white/10 bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-200 transition-all outline-none focus:border-[#2ecc71] focus:ring-2 focus:ring-[#2ecc71]/20"
          placeholder="Buscar por nombre o código..."
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {isFetching && (
          <span className="absolute top-3 left-[315px] animate-pulse text-xs text-gray-400">
            Buscando...
          </span>
        )}
      </div>

      <div
        className={`overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-xl transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
      >
        {isLoading && productos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Cargando catálogo...
          </div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No se encontraron productos.
          </div>
        ) : (
          <>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {[
                    'Nombre',
                    'Proveedor',
                    'Código',
                    'Precio',
                    'Stock actual',
                    'Stock mínimo',
                    'Categoría',
                    'Estado',
                    'Acciones',
                  ].map((h) => (
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
                {productos.map((p: any, i: number) => (
                  <Product
                    key={p.id_producto}
                    isLast={i === productos.length - 1}
                    producto={p}
                    onDelete={() => handleDelete(p.id_producto)}
                    onEdit={() => handleOpenEdit(p)}
                  />
                ))}
              </tbody>
            </table>

            {/* CONTROLES DE PAGINACIÓN */}
            <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-6 py-4">
              <span className="text-xs text-gray-400">
                Mostrando página{' '}
                <span className="font-medium text-white">
                  {pagination?.page || 1}
                </span>{' '}
                de{' '}
                <span className="font-medium text-white">
                  {Math.ceil((pagination?.total || 0) / limite) || 1}
                </span>
              </span>

              <div className="flex gap-2">
                <button
                  className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={!pagination?.prev}
                  onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </button>
                <button
                  className="cursor-pointer rounded-md border border-white/10 bg-[#1a1a1a] px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={!pagination?.next}
                  onClick={() => setPagina((prev) => prev + 1)}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
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
