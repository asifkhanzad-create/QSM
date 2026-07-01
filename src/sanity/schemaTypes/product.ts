import { defineField, defineType } from "sanity";
// If this import path fails, adjust it to your folder structure:
import { SubcategorySelect } from "@/sanity/components/SubcategorySelect";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Product Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    // NEW: Optional subcategory dropdown
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "string",
      description: "Optional. Select a subcategory from the chosen category.",
      components: {
        input: SubcategorySelect,
      },
      hidden: ({ parent }) => !parent?.category,
    }),
    defineField({
      name: "brand",
      title: "Product Brand",
      type: "reference",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "price",
      title: "Price (PKR)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price (PKR)",
      type: "number",
      description: "Optional. Use this to show a strike-through discount price.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "images",
      title: "Product Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "shades",
      title: "Available Shades/Colors",
      type: "array",
      of: [{ type: "shade" }],
      description: "List of cosmetic shades, color swatches, or product variations.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Average Rating",
      type: "number",
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "reviewsCount",
      title: "Reviews Count",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "isBestSeller",
      title: "Best Seller",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isNewArrival",
      title: "New Arrival",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ingredients",
      title: "Key Ingredients",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "howToUse",
      title: "How to Use",
      type: "text",
    }),
  ],
});