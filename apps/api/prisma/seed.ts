import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Wedding", slug: "wedding", occasionTag: "wedding" },
  { name: "Festive", slug: "festive", occasionTag: "festive" },
  { name: "Haldi and Mehandi", slug: "haldi-mehandi", occasionTag: "haldi-mehandi" },
  { name: "Casual", slug: "casual", occasionTag: "casual" },
  { name: "Party", slug: "party", occasionTag: "party" },
];

const COUPONS = [
  { code: "DHANASRI10", pctOff: 10, maxOff: 1000, minPurchase: 2000 },
  { code: "DHANASRI15", pctOff: 15, maxOff: 1500, minPurchase: 5000 },
  { code: "DHANASRI20", pctOff: 20, maxOff: 2500, minPurchase: 10000 },
];

const PRODUCT_NAMES = [
  "Pista Green Threadwork Chiffon Saree",
  "Maroon Kanjivaram Silk Saree",
  "Ivory Zari Border Organza Saree",
  "Mustard Yellow Haldi Special Saree",
  "Royal Blue Banarasi Silk Saree",
  "Blush Pink Georgette Party Saree",
  "Rust Orange Cotton Handloom Saree",
  "Emerald Green Kanjivaram Saree",
  "Wine Red Sequin Party Saree",
  "Coral Chiffon Casual Saree",
  "Gold Tissue Wedding Saree",
  "Turmeric Yellow Mehandi Saree",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  for (const coupon of COUPONS) {
    await prisma.coupon.upsert({ where: { code: coupon.code }, update: coupon, create: coupon });
  }

  const categories = [];
  for (const category of CATEGORIES) {
    categories.push(
      await prisma.category.upsert({ where: { slug: category.slug }, update: category, create: category })
    );
  }

  for (let i = 0; i < PRODUCT_NAMES.length; i++) {
    const title = PRODUCT_NAMES[i];
    const slug = slugify(title);
    const category = categories[i % categories.length];
    const mrp = 3999 + i * 500;
    const discountPct = 10 + (i % 4) * 5;
    const price = Math.round((mrp * (100 - discountPct)) / 100);

    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        sku: `DSS-${1000 + i}`,
        slug,
        categoryId: category.id,
        occasionTag: category.occasionTag,
        mrp,
        price,
        discountPct,
        description: `${title} handcrafted with traditional techniques, perfect for ${category.name.toLowerCase()} occasions.`,
        images: [],
        rating: 4.2 + (i % 6) * 0.1,
        reviewCount: 10 + i * 7,
        stock: 20 + i,
        isFeatured: i % 3 === 0,
        isNewArrival: i < 8,
      },
    });
  }

  console.log(`Seeded ${categories.length} categories, ${COUPONS.length} coupons, ${PRODUCT_NAMES.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
