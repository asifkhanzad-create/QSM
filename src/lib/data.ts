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
  category: string; // matches Category slug or id
}

export const CATEGORIES: Category[] = [
  {
    _id: "cat_lipsticks",
    name: "Lipsticks",
    slug: "lipsticks",
    description: "Long-lasting, vibrant lip colors for every mood and occasion.",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "cat_face_washes",
    name: "Face Washes",
    slug: "face-washes",
    description: "Gentle yet effective cleansers for fresh, clear skin.",
    image: "https://images.unsplash.com/photo-1627473063855-5203794121b6?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "cat_face_serums",
    name: "Face Serums",
    slug: "face-serums",
    description: "Concentrated formulas to target specific skin concerns for a radiant complexion.",
    image: "https://images.unsplash.com/photo-1622340321245-c49b1a5113d9?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "cat_moisturizers",
    name: "Moisturizers",
    slug: "moisturizers",
    description: "Hydrating creams and lotions for supple, soft skin.",
    image: "https://images.unsplash.com/photo-1632516603175-9e6e8d1a1b4d?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "cat_hair_products",
    name: "Hair Products",
    slug: "hair-products",
    description: "Nourishing treatments and styling essentials for healthy, beautiful hair.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "cat_nail_polishes",
    name: "Nail Polishes",
    slug: "nail-polishes",
    description: "A wide array of colors and finishes for perfectly manicured nails.",
    image: "https://images.unsplash.com/photo-1614777490088-7510d9e4e6c9?auto=format&fit=crop&q=80&w=600",
  },
  {
    _id: "cat_eye_cosmetics",
    name: "Eye Cosmetics",
    slug: "eye-cosmetics",
    description: "Enhance and define your eyes with our mascaras, eyeliners, and brow pencils.",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
  },
];
