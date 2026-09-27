-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "blouse_types" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "colour" TEXT,
ADD COLUMN     "fabric" TEXT,
ADD COLUMN     "international_shipping" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "length" TEXT,
ADD COLUMN     "loom" TEXT,
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "work" TEXT,
ADD COLUMN     "zari" TEXT;

-- CreateIndex
CREATE INDEX "products_fabric_idx" ON "products"("fabric");

-- CreateIndex
CREATE INDEX "products_colour_idx" ON "products"("colour");

