import { Request, Response } from 'express';
import { prisma } from '../../data/posgres'; // Ajusta la ruta a tu cliente de Prisma

// Función auxiliar para generar fechas aleatorias en el pasado
const getRandomPastDate = (daysBack: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0
  );
  return date;
};

export class SeedController {
  constructor() {}

  public runSeed = async (req: Request, res: Response) => {
    try {
      console.log('Limpiando base de datos y reiniciando IDs...');

      // 1. Borrar datos en orden inverso (por las llaves foráneas)
      await prisma.detalle_Movimiento_Producto.deleteMany();
      await prisma.movimiento_Inventario.deleteMany();
      await prisma.acceso_Biometrico.deleteMany();
      await prisma.dispositivo_Autorizado.deleteMany();
      await prisma.producto.deleteMany();
      await prisma.categoria.deleteMany();
      await prisma.proveedor.deleteMany();
      await prisma.usuario.deleteMany();

      // 2. Reiniciar los contadores (Secuencias) en PostgreSQL
      const tables = [
        'Usuario',
        'Categoria',
        'Proveedor',
        'Producto',
        'Dispositivo_Autorizado',
        'Acceso_Biometrico',
        'Movimiento_Inventario',
        'Detalle_Movimiento_Producto',
      ];

      for (const table of tables) {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`
        );
      }

      console.log('Iniciando sembrado de datos...');

      // --- DATOS MAESTROS ---

      const nombresUsuarios = [
        'Igor Pérez',
        'Juan Perez',
        'Maria Garcia',
        'Carlos Lopez',
        'Ana Martinez',
        'Luis Rodriguez',
      ];

      const categoriasAlmacen = [
        'Componentes Electrónicos',
        'Herramientas',
        'Material de Red',
        'Equipos de Cómputo',
        'Seguridad Industrial',
      ];

      const proveedoresEmpresas = [
        'ElectroGlobal',
        'TechSupplies S.A.',
        'NetSys Perú',
        'Importaciones Tecnológicas',
        'Seguridad 360',
      ];

      const productosCatalogo = [
        {
          nombre: 'Placa Arduino Uno R3',
          desc: 'Microcontrolador',
          precio: 85.5,
        },
        { nombre: 'Cable UTP Cat 6', desc: 'Caja x 305m', precio: 120.0 },
        { nombre: 'Router Cisco', desc: 'Gigabit Empresarial', precio: 450.0 },
        {
          nombre: 'Multímetro Digital',
          desc: 'Medición de precisión',
          precio: 65.0,
        },
        {
          nombre: 'Casco de Seguridad',
          desc: 'Clase E, Dieléctrico',
          precio: 25.0,
        },
        {
          nombre: 'Switch 24 Puertos',
          desc: 'No administrable',
          precio: 320.0,
        },
        { nombre: 'Sensor de Proximidad', desc: 'Infrarrojo 5V', precio: 15.0 },
        { nombre: 'Raspberry Pi 4', desc: '4GB RAM', precio: 380.0 },
        {
          nombre: 'Kit Destornilladores',
          desc: 'Precisión 115 en 1',
          precio: 45.0,
        },
        { nombre: 'Cámara IP Domo', desc: 'Resolución 1080p', precio: 110.0 },
      ];

      // --- INSERCIÓN ---

      // 1. Usuarios (Admin, Operario, Supervisor)
      const usuariosData = nombresUsuarios.map((nombre, i) => {
        let email = nombre.toLowerCase().replace(/\s+/g, '.') + '@empresa.com';
        let rol: 'ADMINISTRADOR' | 'OPERARIO' | 'SUPERVISOR' = 'OPERARIO';

        if (i === 0) {
          email = 'admin@empresa.com';
          rol = 'ADMINISTRADOR';
        } else if (i === 1) {
          email = 'supervisor@empresa.com';
          rol = 'SUPERVISOR';
        } else if (i === 2) {
          email = 'operario@empresa.com';
          rol = 'OPERARIO';
        }

        return { nombre, email, password: '123456', rol, activo: true };
      });
      await prisma.usuario.createMany({ data: usuariosData });

      // 2. Categorías
      await prisma.categoria.createMany({
        data: categoriasAlmacen.map((cat) => ({
          nombre: cat,
          descripcion: `Equipos y materiales de ${cat}`,
          activo: true,
        })),
      });

      // 3. Proveedores
      await prisma.proveedor.createMany({
        data: proveedoresEmpresas.map((prov) => ({
          nombre_empresa: prov,
          contacto: 'Área Comercial',
          telefono: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
          activo: true,
        })),
      });

      // 4. Productos (Con algunos en STOCK BAJO)
      const productosData = productosCatalogo.map((prod, i) => {
        const stockMinimo = 10;
        const stockActual =
          i % 3 === 0
            ? Math.floor(Math.random() * 5) + 2 // Stock bajo
            : Math.floor(Math.random() * 50) + 20; // Stock normal

        return {
          id_categoria: (i % categoriasAlmacen.length) + 1,
          id_proveedor: (i % proveedoresEmpresas.length) + 1,
          codigo_barras: `841${Math.floor(100000000 + Math.random() * 900000000)}`,
          nombre: prod.nombre,
          descripcion: prod.desc,
          precio_venta: prod.precio,
          stock_actual: stockActual,
          stock_minimo: stockMinimo,
          activo: true,
        };
      });
      await prisma.producto.createMany({ data: productosData });

      // 5. Dispositivos Autorizados (Asignados a Operarios y Admins)
      const dispositivosData = Array.from({ length: 4 }).map((_, i) => ({
        id_usuario: i === 0 ? 1 : (i % 3) + 3, // Asigna al admin (1) y al resto de operarios
        dispositivo_id: `DEVICE-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        nombre_dispositivo: `Celular Corporativo ${i + 1}`,
        fecha_registro: getRandomPastDate(60),
        activo: true,
      }));
      await prisma.dispositivo_Autorizado.createMany({
        data: dispositivosData,
      });

      // 6. Accesos Biométricos (Historial de aperturas de puertas)
      const accesosData = Array.from({ length: 30 }).map((_, i) => ({
        id_usuario: (i % 4) + 2, // Operarios abriendo puertas
        estado:
          Math.random() > 0.85
            ? 'DENEGADO'
            : ('PERMITIDO' as 'DENEGADO' | 'PERMITIDO'),
        dispositivo_id:
          dispositivosData[i % dispositivosData.length].dispositivo_id,
        fecha_hora: getRandomPastDate(15),
      }));
      await prisma.acceso_Biometrico.createMany({ data: accesosData });

      // 7. Movimientos de Inventario y Detalles (Usando inserciones anidadas para precisión)
      for (let i = 0; i < 20; i++) {
        const numDetalles = Math.floor(Math.random() * 3) + 1; // 1 a 3 productos por movimiento
        const detalles = [];
        let totalMovimiento = 0;

        for (let j = 0; j < numDetalles; j++) {
          const producto =
            productosCatalogo[(i + j) % productosCatalogo.length];
          const cantidad = Math.floor(Math.random() * 5) + 1;
          const subtotal = cantidad * producto.precio;
          totalMovimiento += subtotal;

          detalles.push({
            id_producto: ((i + j) % productosCatalogo.length) + 1,
            cantidad: cantidad,
            precio_unitario: producto.precio,
            subtotal: subtotal,
            observaciones: 'Revisión OK',
          });
        }

        await prisma.movimiento_Inventario.create({
          data: {
            id_usuario: (i % 3) + 2, // Operarios o Supervisor
            tipo: i % 2 === 0 ? 'INGRESO' : 'SALIDA',
            fecha_movimiento: getRandomPastDate(20),
            total: totalMovimiento,
            detalles: {
              create: detalles,
            },
          },
        });
      }

      console.log('Sembrado completado con éxito.');

      // --- RECUPERAR USUARIOS DE PRUEBA ---
      const adminUser = await prisma.usuario.findUnique({
        where: { email: 'admin@empresa.com' },
      });
      const supervisorUser = await prisma.usuario.findUnique({
        where: { email: 'supervisor@empresa.com' },
      });
      const operarioUser = await prisma.usuario.findUnique({
        where: { email: 'operario@empresa.com' },
      });

      return res.status(201).json({
        status: 'success',
        message: 'Base de datos limpiada y ejecutado el seed correctamente.',
        data: {
          testAccounts: {
            admin: adminUser,
            supervisor: supervisorUser,
            operario: operarioUser,
          },
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 'error', message: 'Error en el seed', errors: error });
    }
  };
}
