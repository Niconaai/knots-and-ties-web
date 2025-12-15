import { defineQuery } from "next-sanity";

// 1. HOMEPAGE QUERY (The List) - No parameters required
export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"]{
  _id,
  "slug": slug.current,
  title,
  price,
  images[]{
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  }
}`);

// 2. SINGLE PRODUCT QUERY (The Detail) - Requires $slug
export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  price,
  fabricStory,
  images[]{
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  },
  options[]{
    _key,
    type,
    values[]{
      label,
      priceModifier
    }
  }
}`);

// Fetch just 3 items to serve as visual representatives for categories
export const HOME_FEATURED_QUERY = defineQuery(`*[_type == "product"][0..2]{
  _id,
  "slug": slug.current,
  title,
  images[]{
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  }
}`);