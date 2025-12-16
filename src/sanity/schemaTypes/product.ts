import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product (Made-to-Order)',
  type: 'document',
  fields: [
    // 1. Internal Name
    defineField({
      name: 'name',
      title: 'Internal Name',
      type: 'string',
    }),

    // 2. Bilingual Title
    defineField({
      name: 'title',
      title: 'Public Title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'af', type: 'string', title: 'Afrikaans' },
      ],
    }),

    // 3. Slug
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
    }),

    // 4. Base Price
    defineField({
      name: 'price',
      title: 'Base Price (ZAR)',
      type: 'number',
    }),

    // 5. COLOR VARIANTS (New Core Logic)
    defineField({
      name: 'variants',
      title: 'Color Variants',
      type: 'array',
      description: 'Add a variant for each color/print option (e.g. Green, Blue).',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'colorName',
            title: 'Color Name (e.g. Sage Green)',
            type: 'string',
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: 'colorHex',
            title: 'Color Hex Code (for the Swatch)',
            type: 'string',
            description: 'e.g. #8A9A5B for green. Google "Color Picker" to find codes.',
            validation: (Rule) => Rule.required().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
              name: 'hex',
              invert: false
            }),
          }),
          defineField({
            name: 'images',
            title: 'Variant Images',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            validation: (Rule) => Rule.required().min(1),
          }),
          defineField({
            name: 'active',
            title: 'Active?',
            type: 'boolean',
            initialValue: true,
            description: 'Turn off to hide this color from the store.',
          }),
        ],
        preview: {
          select: {
            title: 'colorName',
            subtitle: 'active',
            media: 'images.0'
          },
          prepare(selection) {
            const { title, subtitle, media } = selection
            return {
              title: title,
              subtitle: subtitle ? 'Active' : 'Inactive',
              media: media
            }
          }
        }
      }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // 6. Fabric Story
    defineField({
      name: 'fabricStory',
      title: 'Fabric Story',
      type: 'object',
      fields: [
        { name: 'en', title: 'English Story', type: 'array', of: [{ type: 'block' }] },
        { name: 'af', title: 'Afrikaans Story', type: 'array', of: [{ type: 'block' }] },
      ],
    }),

    // 7. Technical Options (Widths, etc)
    defineField({
      name: 'options',
      title: 'Technical Options',
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