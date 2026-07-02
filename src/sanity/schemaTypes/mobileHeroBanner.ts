import { defineType, defineField } from "sanity";

export const mobileHeroBannerType = defineType({
  name: "mobileHeroBanner",
  title: "Mobile Hero Banner",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",          // ← changed from "string" to "text"
      rows: 2,
      description: "Press Enter for line breaks",
    }),
    defineField({
      name: "linkText",
      title: "Link Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "linkHref",
      title: "Link URL",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});