import type { StructureResolver } from 'sanity/structure'
import { SingletonTypes } from './schemas'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) => {
  const singletonItems = SingletonTypes.map((schemaName) => {
    return S.listItem()
      .title(schemaName)
      .child(
        S.document()
          .schemaType(schemaName)
          .documentId(schemaName)
      )
  })

  return S.list()
    .title('Content')
    .items([
      ...singletonItems,
      ...(singletonItems.length > 0 ? [S.divider()] : []),
      ...S.documentTypeListItems().filter(
        (listItem) => !SingletonTypes.includes(listItem.getId() || '')
      ),
    ])
}
