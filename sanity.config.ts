'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { structure } from './sanity/structure'
import { schemaTypes, SingletonTypes } from './sanity/schemas'
import { EMAIL_TYPE_NAMES } from './sanity/schemas/emailTypes'

// Pages, settings and e-mails have exactly one copy each: they can't be created, duplicated or deleted.
const singletons = new Set<string>([...SingletonTypes, ...EMAIL_TYPE_NAMES])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  basePath: '/admin/studio',
  title: 'Endre innhold',
  subtitle: 'Her kan du endre innhold på nettstedet',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  document: {
    // Hide them from the global "+ Create" menu, but keep their templates so a page
    // that doesn't exist yet opens with its default text filled in.
    newDocumentOptions: (options, { creationContext }) =>
      creationContext.type === 'global'
        ? options.filter(({ templateId }) => !singletons.has(templateId))
        : options,
    actions: (actions, { schemaType }) =>
      singletons.has(schemaType)
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
