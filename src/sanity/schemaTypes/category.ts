import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Product Category",
  type: "document",
  orderings: [
    {
      title: "Manual Order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower number = appears first in sidebar and filters (e.g. 1, 2, 3...)",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "name",
      title: "Category Name (e.g., Lipsticks, Face Washes)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (used in URL)",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Brief Description",
      type: "text",
    }),
    defineField({
      name: "image",
      title: "Category Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Image representing this category on the shop page.",
    }),
  ],
});