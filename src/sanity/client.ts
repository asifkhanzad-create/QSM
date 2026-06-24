import { createClient } from "@sanity/client";
import { CATEGORIES, BRANDS, type Product, type Category, type Brand } from "@/lib/data";

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

export async function getBrands(): Promise<Brand[]> {
  if (!client) {
    return BRANDS;
  }
  try {
    const query = `*[_type == "brand"]{
      _id,
      name,
      "slug": slug.current,
      "logo": logo.asset->url
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch error (falling back to mock):", error);
    return BRANDS;
  }
}

export async function getProducts(categorySlug?: string, brandSlug?: string): Promise<Product[]> {
  if (!client) {
    return [];
  }
  const filters: string[] = [];
  if (categorySlug) filters.push("category->slug.current == $categorySlug");
  if (brandSlug) filters.push("brand->slug.current == $brandSlug");
  const filterClause = filters.length > 0 ? ` && ${filters.join(" && ")}` : "";
  const query = `*[_type == "product"${filterClause}]{
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
      "category": category->slug.current,
      "brand": brand->slug.current
    }`;
  const params: Record<string, string> = {};
  if (categorySlug) params.categorySlug = categorySlug;
  if (brandSlug) params.brandSlug = brandSlug;
  return await client.fetch(query, params);
}

export async function getRelatedProducts(
  currentProductSlug: string,
  categorySlug: string
): Promise<Product[]> {
  if (!client) return [];
  const query = `*[_type == "product" && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(rating desc) [0...4]{
    _id,
    name,
    "slug": slug.current,
    price,
    originalPrice,
    "images": images[].asset->url,
    shades[]{ name, colorCode, inStock },
    description,
    rating,
    reviewsCount,
    isBestSeller,
    isNewArrival,
    "category": category->slug.current,
    "brand": brand->slug.current
  }`;
  return await client.fetch(query, { categorySlug, currentSlug: currentProductSlug });
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
      "category": category->slug.current,
      "brand": brand->slug.current
    }`;
  return await client.fetch(query, { slug }) ?? null;
}
