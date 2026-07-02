import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./category";
import { shadeType } from "./shade";
import { productType } from "./product";
import { brandType } from "./brand";
import { heroBannerType } from "./heroBanner";
import { mobileHeroBannerType } from "./mobileHeroBanner";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, shadeType, productType, brandType, heroBannerType, mobileHeroBannerType],
};