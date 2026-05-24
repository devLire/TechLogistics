-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMINISTRADOR', 'OPERARIO', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO', 'SALIDA');

-- CreateEnum
CREATE TYPE "EstadoAcceso" AS ENUM ('PERMITIDO', 'DENEGADO');

-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre_empresa" VARCHAR(150) NOT NULL,
    "contacto" VARCHAR(100),
    "telefono" VARCHAR(20),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id_producto" SERIAL NOT NULL,
    "id_categoria" INTEGER,
    "id_proveedor" INTEGER,
    "codigo_barras" VARCHAR(50),
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "precio_venta" DECIMAL(10,2) NOT NULL,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'OPERARIO',
    "email" VARCHAR(100),
    "password" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Dispositivo_Autorizado" (
    "id_dispositivo_autorizado" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "dispositivo_id" VARCHAR(255) NOT NULL,
    "nombre_dispositivo" VARCHAR(150) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Dispositivo_Autorizado_pkey" PRIMARY KEY ("id_dispositivo_autorizado")
);

-- CreateTable
CREATE TABLE "Acceso_Biometrico" (
    "id_acceso_biometrico" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoAcceso" NOT NULL,
    "dispositivo_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "Acceso_Biometrico_pkey" PRIMARY KEY ("id_acceso_biometrico")
);

-- CreateTable
CREATE TABLE "Movimiento_Inventario" (
    "id_movimiento_inventario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_movimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,

    CONSTRAINT "Movimiento_Inventario_pkey" PRIMARY KEY ("id_movimiento_inventario")
);

-- CreateTable
CREATE TABLE "Detalle_Movimiento_Producto" (
    "id_detalle_movimiento" SERIAL NOT NULL,
    "id_movimiento_inventario" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "observaciones" VARCHAR(255),

    CONSTRAINT "Detalle_Movimiento_Producto_pkey" PRIMARY KEY ("id_detalle_movimiento")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dispositivo_Autorizado_dispositivo_id_key" ON "Dispositivo_Autorizado"("dispositivo_id");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispositivo_Autorizado" ADD CONSTRAINT "Dispositivo_Autorizado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acceso_Biometrico" ADD CONSTRAINT "Acceso_Biometrico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Inventario" ADD CONSTRAINT "Movimiento_Inventario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Movimiento_Producto" ADD CONSTRAINT "Detalle_Movimiento_Producto_id_movimiento_inventario_fkey" FOREIGN KEY ("id_movimiento_inventario") REFERENCES "Movimiento_Inventario"("id_movimiento_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Movimiento_Producto" ADD CONSTRAINT "Detalle_Movimiento_Producto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
