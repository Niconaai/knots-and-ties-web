import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product (Made-to-Order)',
  type: 'document',
  fields: [
    // 1. Internal Name (For Admin sanity only)
    defineField({
      name: 'name',
      title: 'Internal Name',
      type: 'string',
      description: 'Internal reference only (e.g. "Floral 01")',
    }),

    // 2. Bilingual Title (Public)
    defineField({
      name: 'title',
      title: 'Public Title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'af', type: 'string', title: 'Afrikaans' },
      ],
    }),

    // 3. URL Slug (SEO)
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.en', // Auto-generate from English title
        maxLength: 96,
      },
    }),

    // 4. Base Price (ZAR)
    defineField({
      name: 'price',
      title: 'Base Price (ZAR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(100),
    }),

    // 5. Bilingual Story (The "Paper & Ink" Content)
    defineField({
      name: 'fabricStory',
      title: 'Fabric Story',
      type: 'object',
      fields: [
        { 
          name: 'en', 
          title: 'English Story', 
          type: 'array', 
          of: [{ type: 'block' }] // Rich Text
        },
        { 
          name: 'af', 
          title: 'Afrikaans Story', 
          type: 'array', 
          of: [{ type: 'block' }] 
        },
      ],
    }),

    // 6. Product Images (4:5 Ratio preferred)
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{ 
        type: 'image',
        options: { hotspot: true } // Crucial for mobile crops
      }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // 7. Variants (The "Made-to-Order" Logic)
    defineField({
      name: 'options',
      title: 'Product Options',
      type: 'array',
      of: [{
        type: 'object',
        name: 'variant',
        fields: [
          { name: 'type', type: 'string', title: 'Option Type (e.g. Width)' },
          {
            name: 'values',
            title: 'Values',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                { name: 'label', type: 'string', title: 'Label (e.g. Skinny)' },
                { name: 'priceModifier', type: 'number', title: 'Price Adder (+R)' }
              ]
            }]
          }
        ]
      }]
    })
  ],
})