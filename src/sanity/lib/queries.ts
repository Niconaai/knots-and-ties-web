import { defineQuery } from "next-sanity";

// 1. HOMEPAGE/SHOP QUERY (The List)
// Logic: We grab the FIRST active variant's image to use as the "Cover Image".
export const PRODUCTS_QUERY = defineQuery(`*[_type == "product"]{
  _id,
  "slug": slug.current,
  title,
  price,
  "images": variants[active == true][0].images[]{
    asset->{
      _id,
      url,
      metadata { dimensions }
    }
  }
}`);

// 2. SINGLE PRODUCT QUERY (The Detail)
// Logic: We fetch ALL active variants so the user can switch between them.
export const PRODUCT_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  price,
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
    values[]{
      label,
      priceModifier
    }
  }
}`);