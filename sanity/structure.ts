import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import type { ComponentType } from 'react'
import {
  BookIcon,
  CalendarIcon,
  CaseIcon,
  CogIcon,
  DocumentIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  HeartIcon,
  HomeIcon,
  ImagesIcon,
  LinkIcon,
  PlayIcon,
  ProjectsIcon,
  UserIcon,
  UsersIcon,
} from '@sanity/icons'
import { schemaTypes } from './schemas'
import { EMAIL_TYPE_NAMES } from './schemas/emailTypes'

/**
 * The Studio sidebar follows the site's menu: one folder per section, with the
 * page itself first and the lists shown on that page after it.
 * Settings and e-mails come last.
 */
export const structure: StructureResolver = (S) => {
  const placed = new Set<string>()

  /** A single document, such as a page, that always has exactly one copy. */
  const page = (schemaType: string, title: string, icon: ComponentType = DocumentIcon) => {
    placed.add(schemaType)
    return S.listItem()
      .title(title)
      .id(schemaType)
      .icon(icon)
      .child(S.document().schemaType(schemaType).documentId(schemaType).title(title))
  }

  /** A list of documents, such as board members, that editors add to. */
  const list = (
    schemaType: string,
    title: string,
    icon: ComponentType,
    ordering?: { field: string; direction: 'asc' | 'desc' }[]
  ) => {
    placed.add(schemaType)
    const docList = S.documentTypeList(schemaType).title(title)
    return S.listItem()
      .title(title)
      .id(schemaType)
      .icon(icon)
      .child(ordering ? docList.defaultOrdering(ordering) : docList)
  }

  const folder = (id: string, title: string, icon: ComponentType, items: ReturnType<StructureBuilder['listItem']>[]) =>
    S.listItem().title(title).id(id).icon(icon).child(S.list().title(title).items(items))

  const emailItems = EMAIL_TYPE_NAMES.map((name) => {
    const title = schemaTypes.find((type) => type.name === name)?.title || name
    return page(name, title, name === 'emailSettings' ? CogIcon : EnvelopeIcon)
  })

  const items = [
    page('homePage', 'Forsiden', HomeIcon),

    folder('om-oss', 'Om oss', UsersIcon, [
      page('aboutPage', 'Om oss-siden'),
      list('boardMember', 'Styremedlemmer', UserIcon, [{ field: 'activeFrom', direction: 'desc' }]),
      list('boardRole', 'Styreverv', CaseIcon),
      page('cooperationPartners', 'Samarbeidspartnere og søsterforeninger', LinkIcon),
      page('formerBoardsPage', 'Tidligere styrer-siden'),
      page('vedtekter', 'Vedtekter', DocumentTextIcon),
      folder('trams-i-media', 'TrAMS i media', PlayIcon, [
        page('mediaPage', 'TrAMS i media-siden'),
        list('mediaItem', 'Mediesaker', PlayIcon, [{ field: 'year', direction: 'desc' }]),
      ]),
    ]),

    folder('forstehjelpskurs', 'Førstehjelpskurs', HeartIcon, [
      page('firstAidCoursePage', 'Førstehjelpskurs-siden'),
      page('bookKursPage', 'Book kurs-siden'),
    ]),

    folder('for-medisinstudenter', 'For medisinstudenter', BookIcon, [
      page('forMedisinstudenterPage', 'For medisinstudenter-siden'),
      list('courseOffering', 'Kurstilbud', ProjectsIcon, [{ field: 'order', direction: 'asc' }]),
      list('committee', 'Komiteer', UsersIcon, [{ field: 'order', direction: 'asc' }]),
      page('akuttCalling', 'Akuttcalling-siden'),
      page('markorPage', 'Markør-siden'),
    ]),

    folder('instruktorer', 'For instruktører', UserIcon, [
      page('instruktorPage', 'For instruktører-siden'),
      list('instruktorLink', 'Instruktørlenker', LinkIcon, [{ field: 'rank', direction: 'asc' }]),
    ]),

    page('eventsPage', 'Arrangementer-siden', CalendarIcon),

    S.divider(),

    page('siteSettings', 'Kontaktinfo (bunntekst)', CogIcon),
    page('certificateSettings', 'Kursbevis (signatur)', ImagesIcon),
    folder('emails', 'E-poster', EnvelopeIcon, emailItems),
  ]

  // Any document type not placed above still shows up, so nothing goes missing in Studio.
  const unplaced = S.documentTypeListItems().filter((item) => !placed.has(item.getId() || ''))

  return S.list()
    .title('Innhold')
    .items(unplaced.length ? [...items, S.divider(), ...unplaced] : items)
}
