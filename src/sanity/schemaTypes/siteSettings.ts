import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // Internal identifier
    defineField({
      name: 'title',
      title: 'Settings Name',
      type: 'string',
      initialValue: 'Site Settings',
      hidden: true,
    }),

    // ========== HOMEPAGE HERO ==========
    defineField({
      name: 'homeHero',
      title: 'Homepage Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true },
          description: 'The main hero image for the homepage (recommended: 1920x1080 or larger)',
        }),
        defineField({
          name: 'imageAlt',
          title: 'Image Alt Text',
          type: 'object',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'af', type: 'string', title: 'Afrikaans' },
          ],
        }),
      ],
    }),

    // ========== ABOUT PAGE HERO ==========
    defineField({
      name: 'aboutHero',
      title: 'About Page Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true },
          description: 'The hero image for the About page (recommended: 1920x800)',
        }),
        defineField({
          name: 'imageAlt',
          title: 'Image Alt Text',
          type: 'object',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'af', type: 'string', title: 'Afrikaans' },
          ],
        }),
      ],
    }),

    // ========== SHOP PAGE HERO ==========
    defineField({
      name: 'shopHero',
      title: 'Shop Page Hero',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Hero Banner Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Optional banner image for the shop page',
        }),
        defineField({
          name: 'imageAlt',
          title: 'Image Alt Text',
          type: 'object',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'af', type: 'string', title: 'Afrikaans' },
          ],
        }),
      ],
    }),
  ],

  // Singleton pattern - only one settings document
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Hero images and site configuration',
      }
    },
  },
})
