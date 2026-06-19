import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "AURA Cosmetics Admin Panel",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vjsh78e6",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/admin",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Products")
              .schemaType("product")
              .child(S.documentTypeList("product").title("Products")),
          ]),
    }),
    visionTool(),
  ],

  schema: schema,
});
