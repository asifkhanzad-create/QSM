import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Product Category",
  type: "document",
  fields: [
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
