import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, siteSettings], 
}