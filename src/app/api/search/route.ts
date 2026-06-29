import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase();

  if (!q || q.length < 1) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = "2024-06-19";

  if (!projectId) {
    console.error("Search API: Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
    return NextResponse.json({ products: [], categories: [] });
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  });

  try {
    const searchPattern = `${q}*`;

    const productsQuery = `*[_type == "product" && (
      name match $searchPattern || 
      description match $searchPattern ||
      category->name match $searchPattern ||
      brand->name match $searchPattern
    )][0...6] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      price,
      originalPrice,
      "image": images[0].asset->url,
      "categoryName": category->name
    }`;

    const categoriesQuery = `*[_type == "category" && (
      name match $searchPattern || 
      description match $searchPattern
    ) && count(*[_type == "product" && references(^._id)]) > 0][0...4] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "image": image.asset->url,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`;

    const [products, categories] = await Promise.all([
      client.fetch(productsQuery, { searchPattern }),
      client.fetch(categoriesQuery, { searchPattern }),
    ]);

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ products: [], categories: [] });
  }
}