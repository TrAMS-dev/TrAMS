import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton for Vedtekter
      S.listItem()
        .title('Vedtekter')
        .child(
          S.document()
            .schemaType('vedtekter')
            .documentId('vedtekter')
        ),
      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== 'vedtekter'
      ),
    ])
