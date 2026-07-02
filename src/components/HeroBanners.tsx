import { getHeroBanners, getMobileHeroBanners } from "@/sanity/client";
import HeroBannersClient from "./HeroBannersClient";

const FALLBACK_BANNERS = [
  {
    _id: "fallback-1",
    title: "Inner\nRadiance",
    tagline: "",
    description: "Illuminate your visage from within\nLet your natural vibrancy speak first",
    linkHref: "/shop",
    linkText: "Explore the Collection",
    image: "/hero-banner-1.png",
    altText: "First Hero Banner",
  },
  {
    _id: "fallback-2",
    title: "Velvet\nTouch",
    tagline: "",
    description: "Smooth your canvas to flawless perfection\nEmbrace a soft, weightless skin feeling",
    linkHref: "/shop-by-brand",
    linkText: "Shop by Brand",
    image: "/hero-banner-2.png",
    altText: "Second Hero Banner",
  },
];

const FALLBACK_MOBILE_SLIDES = [
  {
    _id: "mobile-fallback-1",
    title: "Radiance Redefined",
    subtitle: "Where elegance meets everyday beauty.",
    linkHref: "/shop",
    linkText: "Shop All",
    image: "/mobile-banner-1.png",
  },
  {
    _id: "mobile-fallback-2",
    title: "Bold. Beautiful. You.",
    subtitle: "Crafted for the modern muse.",
    linkHref: "/shop-by-brand",
    linkText: "Shop by Brand",
    image: "/mobile-banner-2.jpg",
  },
];

export default async function HeroBanners() {
  const [sanityBanners, sanityMobileSlides] = await Promise.all([
    getHeroBanners(),
    getMobileHeroBanners(),
  ]);

  const banners = sanityBanners.length > 0 ? sanityBanners : FALLBACK_BANNERS;
  const mobileSlides = sanityMobileSlides.length > 0 ? sanityMobileSlides : FALLBACK_MOBILE_SLIDES;

  return <HeroBannersClient banners={banners} mobileSlides={mobileSlides} />;
}