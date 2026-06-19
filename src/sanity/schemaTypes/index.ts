import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./category";
import { shadeType } from "./shade";
import { productType } from "./product";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, shadeType, productType],
};
