import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

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

async function deleteWrongCategory() {
  if (!process.env.SANITY_SEED_TOKEN) {
    console.error("❌ SANITY_SEED_TOKEN is not set in your environment.");
    console.error("   Get one at https://sanity.io/manage → project " + projectId + " → API → Tokens");
    process.exit(1);
  }

  console.log("🔍 Looking for duplicate 'Eye cosmetics' category...\n");

  // Find the wrong-cased one
  const wrongCategory = await client.fetch<{ _id: string; name: string } | null>(
    `*[_type == "category" && name == "Eye cosmetics"][0]{ _id, name }`
  );

  if (!wrongCategory) {
    console.log("  ✅ No 'Eye cosmetics' category found — nothing to delete.");
    console.log("\n✨ Done!");
    return;
  }

  console.log(`  Found: "${wrongCategory.name}" (_id: ${wrongCategory._id})`);
  console.log("  Deleting...");

  await client.delete(wrongCategory._id);

  // Verify deletion
  const check = await client.fetch<{ _id: string } | null>(
    `*[_type == "category" && name == "Eye cosmetics"][0]{ _id }`
  );

  if (!check) {
    console.log("  ✅ Successfully deleted 'Eye cosmetics'.");
  } else {
    console.log("  ❌ Deletion may have failed — document still exists.");
  }

  // Show remaining categories for confirmation
  const remaining = await client.fetch<{ name: string; slug: string }[]>(
    `*[_type == "category"]{ name, "slug": slug.current }`
  );
  console.log("\n📋 Remaining categories:");
  for (const cat of remaining) {
    console.log(`  - ${cat.name} (${cat.slug})`);
  }

  console.log("\n✨ Done!");
}

deleteWrongCategory().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
