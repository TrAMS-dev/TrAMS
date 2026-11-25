import { client } from './client'
import { PAGE_HERO_QUERY } from './queries'
import { heroWithDefaults, type PageHeroKey } from './pageHeroDefaults'

/** The Sanity document that holds each page's "Toppen av siden" field. */
const HERO_DOCUMENT_TYPE: Record<PageHeroKey, string> = {
  forstehjelpskurs: 'firstAidCoursePage',
  bookKurs: 'bookKursPage',
  forMedisinstudenter: 'forMedisinstudenterPage',
  arrangementer: 'eventsPage',
  instruktorer: 'instruktorPage',
  omOss: 'aboutPage',
  vedtekter: 'vedtekter',
  tramsIMedia: 'mediaPage',
  tidligereStyrer: 'formerBoardsPage',
}

/** Hero heading and text for a page, with the default text for any empty field. */
export async function getPageHero(key: PageHeroKey): Promise<{ heading: string; text: string }> {
  const hero = await client.fetch(PAGE_HERO_QUERY, { type: HERO_DOCUMENT_TYPE[key] })
  return heroWithDefaults(hero, key)
}
