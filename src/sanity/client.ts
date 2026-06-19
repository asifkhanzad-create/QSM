import { createClient } from "@sanity/client";
import { CATEGORIES, type Product, type Category } from "@/lib/data";

// Sanity configurations
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = "2024-06-19";

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

export async function getCategories(): Promise<Category[]> {
  if (!client) {
    return CATEGORIES;
  }
  try {
    const query = `*[_type == "category"]{
      _id,
      name,
      "slug": slug.current,
      description,
      "image": image.asset->url
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error (falling back to mock):", error);
    return CATEGORIES;
  }
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (!client) {
    return [];
  }
  const query = `*[_type == "product"${categorySlug ? " && category->slug.current == $categorySlug" : ""}]{
      _id,
      name,
      "slug": slug.current,
      price,
      originalPrice,
      "images": images[].asset->url,
      shades[]{
        name,
        colorCode,
        inStock
      },
      description,
      rating,
      reviewsCount,
      isBestSeller,
      isNewArrival,
      ingredients,
      howToUse,
      "category": category->slug.current
    }`;
  return await client.fetch(query, categorySlug ? { categorySlug } : {});
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!client) {
    return null;
  }
  const query = `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      "slug": slug.current,
      price,
      originalPrice,
      "images": images[].asset->url,
      shades[]{
        name,
        colorCode,
        inStock
      },
      description,
      rating,
      reviewsCount,
      isBestSeller,
      isNewArrival,
      ingredients,
      howToUse,
      "category": category->slug.current
    }`;
  return await client.fetch(query, { slug }) ?? null;
}
