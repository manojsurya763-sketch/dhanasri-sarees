import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: "Wedding",
    slug: "wedding",
    occasionTag: "wedding",
    description:
      "Opulent silks and zari-rich weaves for the bride and her wedding party — heirloom pieces meant to be passed down.",
  },
  {
    name: "Festive",
    slug: "festive",
    occasionTag: "festive",
    description: "Vibrant drapes for Diwali, Pongal, and every festival on the calendar.",
  },
  {
    name: "Haldi and Mehandi",
    slug: "haldi-mehandi",
    occasionTag: "haldi-mehandi",
    description: "Sunshine yellows and playful prints for the ceremonies before the big day.",
  },
  {
    name: "Casual",
    slug: "casual",
    occasionTag: "casual",
    description: "Easy, everyday sarees in breathable fabrics for the days in between.",
  },
  {
    name: "Party",
    slug: "party",
    occasionTag: "party",
    description: "Statement drapes with sequins, shimmer, and bold colour for evenings out.",
  },
];

const COUPONS = [
  { code: "DHANASRI10", pctOff: 10, maxOff: 1000, minPurchase: 2000 },
  { code: "DHANASRI15", pctOff: 15, maxOff: 1500, minPurchase: 5000 },
  { code: "DHANASRI20", pctOff: 20, maxOff: 2500, minPurchase: 10000 },
];

const PLACEHOLDER_PALETTE = ["7A1F2B/FBEEDD", "C9A15A/FBEEDD", "4A1520/FBEEDD", "9C2E3D/FBEEDD", "63161F/FBEEDD"];
const PLACEHOLDER_VIEWS = ["Front View", "Back View", "Side View", "Close-Up", "Draped View"];

function placeholderImages(title: string, views: string[] = PLACEHOLDER_VIEWS) {
  const label = encodeURIComponent(title);
  return views.map(
    (view, i) =>
      `https://placehold.co/800x1000/${PLACEHOLDER_PALETTE[i % PLACEHOLDER_PALETTE.length]}.png?text=${label}+-+${encodeURIComponent(view)}`
  );
}

interface ProductSeed {
  title: string;
  fabric: string;
  colour: string;
  origin: string;
  zari: string;
  loom: string;
  work: string;
  blouseTypes: string[];
  internationalShipping: boolean;
  images?: string[];
}

const PRODUCTS: ProductSeed[] = [
  {
    title: "Pista Green Threadwork Chiffon Saree",
    fabric: "Chiffon",
    colour: "Pista Green",
    origin: "Surat",
    zari: "No Zari",
    loom: "Powerloom",
    work: "Threadwork",
    blouseTypes: ["Unstitched"],
    internationalShipping: true,
    images: ["/images/products/pista-green-threadwork-chiffon-saree-1.png"],
  },
  {
    title: "Maroon Kanjivaram Silk Saree",
    fabric: "Kanjivaram Silk",
    colour: "Maroon",
    origin: "Kanchipuram",
    zari: "Gold Zari",
    loom: "Handloom",
    work: "Zari Weaving",
    blouseTypes: ["Unstitched", "Stitched"],
    internationalShipping: true,
  },
  {
    title: "Ivory Zari Border Organza Saree",
    fabric: "Organza",
    colour: "Ivory",
    origin: "Mysore",
    zari: "Silver Zari",
    loom: "Powerloom",
    work: "Zari Border",
    blouseTypes: ["Unstitched"],
    internationalShipping: true,
  },
  {
    title: "Mustard Yellow Haldi Special Saree",
    fabric: "Cotton",
    colour: "Mustard Yellow",
    origin: "Coimbatore",
    zari: "No Zari",
    loom: "Handloom",
    work: "Block Print",
    blouseTypes: ["Unstitched"],
    internationalShipping: false,
    images: ["/images/products/mustard-yellow-haldi-special-saree-1.png"],
  },
  {
    title: "Royal Blue Banarasi Silk Saree",
    fabric: "Banarasi Silk",
    colour: "Royal Blue",
    origin: "Banaras",
    zari: "Gold Zari",
    loom: "Handloom",
    work: "Zari Weaving",
    blouseTypes: ["Unstitched", "Stitched"],
    internationalShipping: true,
  },
  {
    title: "Blush Pink Georgette Party Saree",
    fabric: "Georgette",
    colour: "Blush Pink",
    origin: "Surat",
    zari: "No Zari",
    loom: "Powerloom",
    work: "Sequin Work",
    blouseTypes: ["Stitched"],
    internationalShipping: true,
  },
  {
    title: "Rust Orange Cotton Handloom Saree",
    fabric: "Cotton",
    colour: "Rust Orange",
    origin: "Coimbatore",
    zari: "No Zari",
    loom: "Handloom",
    work: "Handloom Weave",
    blouseTypes: ["Unstitched"],
    internationalShipping: true,
    images: ["/images/products/rust-orange-cotton-handloom-saree-1.png"],
  },
  {
    title: "Emerald Green Kanjivaram Saree",
    fabric: "Kanjivaram Silk",
    colour: "Emerald Green",
    origin: "Kanchipuram",
    zari: "Gold Zari",
    loom: "Handloom",
    work: "Zari Weaving",
    blouseTypes: ["Unstitched", "Stitched"],
    internationalShipping: true,
  },
  {
    title: "Wine Red Sequin Party Saree",
    fabric: "Georgette",
    colour: "Wine Red",
    origin: "Surat",
    zari: "No Zari",
    loom: "Powerloom",
    work: "Sequin Work",
    blouseTypes: ["Stitched"],
    internationalShipping: false,
  },
  {
    title: "Coral Chiffon Casual Saree",
    fabric: "Chiffon",
    colour: "Coral",
    origin: "Surat",
    zari: "No Zari",
    loom: "Powerloom",
    work: "Plain Weave",
    blouseTypes: ["Unstitched"],
    internationalShipping: true,
    images: ["/images/products/coral-chiffon-casual-saree-1.png"],
  },
  {
    title: "Gold Tissue Wedding Saree",
    fabric: "Tissue",
    colour: "Gold",
    origin: "Banaras",
    zari: "Gold Zari",
    loom: "Handloom",
    work: "Zari Weaving",
    blouseTypes: ["Unstitched", "Stitched"],
    internationalShipping: true,
  },
  {
    title: "Turmeric Yellow Mehandi Saree",
    fabric: "Cotton",
    colour: "Turmeric Yellow",
    origin: "Coimbatore",
    zari: "No Zari",
    loom: "Handloom",
    work: "Block Print",
    blouseTypes: ["Unstitched"],
    internationalShipping: true,
  },
];

const SAREE_LENGTH = "5.5m (Saree) + 0.8m (Blouse)";

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

  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const slug = slugify(p.title);
    const category = categories[i % categories.length];
    const mrp = 3999 + i * 500;
    const discountPct = 10 + (i % 4) * 5;
    const price = Math.round((mrp * (100 - discountPct)) / 100);
    // A product with one real photo keeps it as the "Front View" and gets
    // 4 generated placeholders for the other angles until real ones exist;
    // a product with no real photo yet gets all 5 generated.
    const images = p.images
      ? [...p.images, ...placeholderImages(p.title, PLACEHOLDER_VIEWS.slice(1))]
      : placeholderImages(p.title);

    await prisma.product.upsert({
      where: { slug },
      update: {
        fabric: p.fabric,
        colour: p.colour,
        origin: p.origin,
        zari: p.zari,
        loom: p.loom,
        work: p.work,
        length: SAREE_LENGTH,
        blouseTypes: p.blouseTypes,
        internationalShipping: p.internationalShipping,
        images,
      },
      create: {
        title: p.title,
        sku: `DSS-${1000 + i}`,
        slug,
        categoryId: category.id,
        occasionTag: category.occasionTag,
        mrp,
        price,
        discountPct,
        description: `${p.title} handcrafted with traditional techniques, perfect for ${category.name.toLowerCase()} occasions.`,
        images,
        rating: 4.2 + (i % 6) * 0.1,
        reviewCount: 10 + i * 7,
        stock: 20 + i,
        isFeatured: i % 3 === 0,
        isNewArrival: i < 8,
        fabric: p.fabric,
        colour: p.colour,
        origin: p.origin,
        zari: p.zari,
        loom: p.loom,
        work: p.work,
        length: SAREE_LENGTH,
        blouseTypes: p.blouseTypes,
        internationalShipping: p.internationalShipping,
      },
    });
  }

  console.log(`Seeded ${categories.length} categories, ${COUPONS.length} coupons, ${PRODUCTS.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
