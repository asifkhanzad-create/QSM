import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-06-19",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  try {
    const { items } = (await req.json()) as {
      items: Array<{ productId: string; quantity: number }>;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    for (const item of items) {
      try {
        await writeClient
          .patch(item.productId)
          .dec({ quantity: item.quantity })
          .commit();
      } catch (err) {
        console.error(
          `Failed to decrement stock for product ${item.productId}:`,
          err
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Checkout stock update error:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
}