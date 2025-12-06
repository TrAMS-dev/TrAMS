import type { StructureResolver } from 'sanity/structure'
import { SingletonTypes, schemaTypes } from './schemas'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) => {
  const singletonItems = SingletonTypes.map((schemaName) => {
    const schemaDef = schemaTypes.find((type) => type.name === schemaName)
    const title = schemaDef?.title || schemaName

    return S.listItem()
      .title(title)
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
