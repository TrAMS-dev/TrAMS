import { defineField } from 'sanity'
import { PAGE_HERO_DEFAULTS, type PageHeroKey } from '../lib/pageHeroDefaults'

/**
 * The "Toppen av siden" field: heading and text over the image at the top of a page.
 * Empty fields show the default text on the site, which Studio shows as a grey placeholder.
 */
export function heroField(key: PageHeroKey) {
    const defaults = PAGE_HERO_DEFAULTS[key]
    return defineField({
        name: 'hero',
        title: 'Toppen av siden',
        description: 'Overskriften og teksten i bildet øverst på siden. La feltet stå tomt for å bruke teksten som vises i grått.',
        type: 'object',
        options: { collapsible: true, collapsed: false },
        fields: [
            defineField({
                name: 'heading',
                title: 'Overskrift',
                type: 'string',
                placeholder: defaults.heading,
            }),
            defineField({
                name: 'text',
                title: 'Tekst',
                type: 'text',
                rows: 2,
                placeholder: defaults.text,
            }),
        ],
    })
}
