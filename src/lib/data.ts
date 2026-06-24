export interface Shade {
  name: string;
  colorCode: string;
  inStock: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shades?: Shade[];
  description: string;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  ingredients?: string[];
  howToUse?: string;
  category: string;
  brand?: string;
}

export const CATEGORIES: Category[] = [
  {
    _id: "cat_lipsticks",
    name: "Lipsticks",
    slug: "lipsticks",
    description: "Long-lasting, vibrant lip colors for every mood and occasion.",
    image: "/category-lipsticks.png",
  },
  {
    _id: "cat_face_washes",
    name: "Face Washes",
    slug: "face-washes",
    description: "Gentle yet effective cleansers for fresh, clear skin.",
    image: "/category-face-washes.png",
  },
  {
    _id: "cat_face_serums",
    name: "Face Serums",
    slug: "face-serums",
    description: "Concentrated formulas to target specific skin concerns for a radiant complexion.",
    image: "/category-face-serums.png",
  },
  {
    _id: "cat_moisturizers",
    name: "Moisturizers",
    slug: "moisturizers",
    description: "Hydrating creams and lotions for supple, soft skin.",
    image: "/category-moisturizers.png",
  },
  {
    _id: "cat_hair_products",
    name: "Hair Products",
    slug: "hair-products",
    description: "Nourishing treatments and styling essentials for healthy, beautiful hair.",
    image: "/category-hair-products.png",
  },
  {
    _id: "cat_nail_polishes",
    name: "Nail Polishes",
    slug: "nail-polishes",
    description: "A wide array of colors and finishes for perfectly manicured nails.",
    image: "/category-nail-polishes.png",
  },
  {
    _id: "cat_eye_cosmetics",
    name: "Eye Cosmetics",
    slug: "eye-cosmetics",
    description: "Enhance and define your eyes with our mascaras, eyeliners, and brow pencils.",
    image: "/category-eye-cosmetics.png",
  },
];

export const BRANDS: Brand[] = [];
