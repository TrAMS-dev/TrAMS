import type { StructureResolver } from 'sanity/structure'
import { SingletonTypes, schemaTypes } from './schemas'
import { EMAIL_TYPE_NAMES } from './schemas/emailTypes'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) => {
  const singletonItem = (schemaName: string) => {
    const schemaDef = schemaTypes.find((type) => type.name === schemaName)
    const title = schemaDef?.title || schemaName

    return S.listItem()
      .title(title)
      .id(schemaName)
      .child(
        S.document()
          .schemaType(schemaName)
          .documentId(schemaName)
      )
  }

  const singletonItems = SingletonTypes.map(singletonItem)

  const emailItem = S.listItem()
    .title('E-poster')
    .id('emails')
    .child(
      S.list()
        .title('E-poster')
        .items([
          singletonItem(EMAIL_TYPE_NAMES[0]),
          S.divider(),
          ...EMAIL_TYPE_NAMES.slice(1).map(singletonItem),
        ])
    )

  const hiddenFromDefaultList = [...SingletonTypes, ...EMAIL_TYPE_NAMES]

  return S.list()
    .title('Content')
    .items([
      ...singletonItems,
      emailItem,
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !hiddenFromDefaultList.includes(listItem.getId() || '')
      ),
    ])
}
