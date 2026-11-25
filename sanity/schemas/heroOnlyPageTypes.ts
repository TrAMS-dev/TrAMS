import { defineType } from 'sanity'
import { heroField } from './heroField'
import type { PageHeroKey } from '../lib/pageHeroDefaults'

/** Pages whose content comes from elsewhere (Supabase or lists), so Sanity only holds the top of the page. */
function heroOnlyPage(name: string, title: string, key: PageHeroKey) {
    return defineType({
        name,
        title,
        type: 'document',
        fields: [heroField(key)],
        preview: { prepare: () => ({ title }) },
    })
}

export const eventsPageType = heroOnlyPage('eventsPage', 'Arrangementer', 'arrangementer')
export const mediaPageType = heroOnlyPage('mediaPage', 'TrAMS i media-siden', 'tramsIMedia')
export const formerBoardsPageType = heroOnlyPage('formerBoardsPage', 'Tidligere styrer-siden', 'tidligereStyrer')
