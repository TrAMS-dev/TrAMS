'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { structure } from './sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  basePath: '/studio',
  title: 'Endre innhold',
  subtitle: 'Her kan du endre innhold på nettstedet',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
