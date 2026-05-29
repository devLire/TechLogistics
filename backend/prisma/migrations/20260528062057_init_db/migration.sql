/*
  Warnings:

  - You are about to drop the column `dispositivo_id` on the `Acceso_Biometrico` table. All the data in the column will be lost.
  - Added the required column `id_dispositivo_autorizado` to the `Acceso_Biometrico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Acceso_Biometrico" DROP COLUMN "dispositivo_id",
ADD COLUMN     "id_dispositivo_autorizado" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Acceso_Biometrico" ADD CONSTRAINT "Acceso_Biometrico_id_dispositivo_autorizado_fkey" FOREIGN KEY ("id_dispositivo_autorizado") REFERENCES "Dispositivo_Autorizado"("id_dispositivo_autorizado") ON DELETE RESTRICT ON UPDATE CASCADE;
