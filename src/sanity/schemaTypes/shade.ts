import { defineField, defineType } from "sanity";

export const shadeType = defineType({
  name: "shade",
  title: "Product Shade/Color",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Shade Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "colorCode",
      title: "HEX Color Code",
      type: "string",
      description: "e.g., #E5A9A9 (used for visual swatches on the store)",
      validation: (Rule) => Rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "hex"),
    }),
    defineField({
      name: "inStock",
      title: "In Stock",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
