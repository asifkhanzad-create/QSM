import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { CATEGORIES } from "../src/lib/data";

// Load .env.local manually — tsx doesn't auto-load it like Next.js does
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))
    value = value.slice(1, -1);
  if (!process.env[key]) process.env[key] = value;
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vjsh78e6";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-19",
  useCdn: false,
  token: process.env.SANITY_SEED_TOKEN,
});

async function seed() {
  if (!process.env.SANITY_SEED_TOKEN) {
    console.error("❌ SANITY_SEED_TOKEN is not set in your environment.");
    console.error("   Get one at https://sanity.io/manage → project " + projectId + " → API → Tokens");
    process.exit(1);
  }

  console.log("🌱 Seeding categories into Sanity...\n");

  for (const cat of CATEGORIES) {
    const exists = await client.fetch<{ _id: string } | null>(
      `*[_type == "category" && slug.current == $slug][0]{ _id }`,
      { slug: cat.slug }
    );

    if (exists) {
      console.log(`  ⏭️  "${cat.name}" already exists, skipping`);
      continue;
    }

    await client.createOrReplace({
      _id: cat._id,
      _type: "category",
      name: cat.name,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
    });

    console.log(`  ✅ Created "${cat.name}"`);
  }

  console.log("\n✨ Done! All categories are now in Sanity.");
  console.log("   Open http://localhost:3000/admin to see the Product Studio.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
