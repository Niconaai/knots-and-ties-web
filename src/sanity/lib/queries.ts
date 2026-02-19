import { defineQuery } from "next-sanity";

// 1. ALL PRODUCTS QUERY (for main shop page showing all categories)
export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"]{
  _id,
  "slug": slug.current,
  "title": title,
  price,
  category,
  "images": variants[active == true][0].images[]{
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  }
}`);

// 2. PRODUCTS BY CATEGORY QUERY (for category-specific pages)
export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`*[_type == "product" && category == $category]{
  _id,
  "slug": slug.current,
  "title": title,
  price,
  category,
  "images": variants[active == true][0].images[]{
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  }
}`);

// 3. SINGLE PRODUCT QUERY (The Detail)
// Logic: We fetch ALL active variants so the user can switch between them.
export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  price,
  category,
  fabricStory,
  "variants": variants[active == true]{
    colorName,
    colorHex,
    images[]{
      asset->{
        _id,
        url,
        metadata { dimensions }
      }
    }
  },
  options[]{
    _key,
    type,
    headingAf,
    values[]{
      labelEn,
      labelAf,
      priceModifier
    }
  }
}`);

// 3. SITE SETTINGS QUERY (Hero images, etc.)
// Singleton document - only one exists
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  homeHero {
    image {
      asset->{
        _id,
        url,
        metadata { dimensions }
      }
    },
    imageAlt
  },
  aboutHero {
    image {
      asset->{
        _id,
        url,
        metadata { dimensions }
      }
    },
    imageAlt
  },
  shopHero {
    image {
      asset->{
        _id,
        url,
        metadata { dimensions }
      }
    },
    imageAlt
  }
}`);