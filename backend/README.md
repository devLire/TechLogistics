# Dev

1. Clonar el archivo `.env.template` y renombrarlo a `.env`.
2. Completar las variables de entorno en el archivo `.env`.
3. Ejecutar el comando para levantar la base de datos:
   ```bash
   docker compose up -d
   ```
4. Instalar las dependencias del proyecto:
   ```bash
   pnpm install
   ```
5. Ejecutar las migraciones para crear las tablas en la base de datos:
```bash
   pnpm exec prisma migrate dev
```
6. Generar el cliente de Prisma (si es necesario):
   ```bash
   pnpm exec prisma generate
   ```
7. Inicializar el servidor en modo desarrollo:
   ```bash
   pnpm run dev
   ```