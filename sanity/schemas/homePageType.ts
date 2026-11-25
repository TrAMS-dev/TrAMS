import { defineField, defineType } from 'sanity'
import { HOME_CARD_DEFAULTS } from '../lib/pageHeroDefaults'

export const homePageType = defineType({
    name: 'homePage',
    title: 'Forsiden',
    type: 'document',
    fields: [
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
            description: 'URL til bakgrunnsvideoen på hjemmesiden',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'tagline',
            title: 'Slagord',
            type: 'text',
            rows: 2,
            description: 'Teksten under logoen på forsiden. Linjeskift vises som linjeskift.',
            validation: (rule) => rule.required(),
        }),
        ...(
            [
                ['aboutCard', 'Kort 1 – Om oss', '/om-oss'],
                ['bookCard', 'Kort 2 – Book kurs', '/forstehjelpskurs'],
                ['studentsCard', 'Kort 3 – For medisinstudenter', '/for-medisinstudenter'],
            ] as const
        ).map(([name, title, path]) =>
            defineField({
                name,
                title,
                description: `Lenkekortet som går til ${path}. La feltene stå tomme for å bruke teksten som vises i grått.`,
                type: 'object',
                options: { collapsible: true, collapsed: true },
                fields: [
                    defineField({
                        name: 'title',
                        title: 'Tittel',
                        type: 'string',
                        placeholder: HOME_CARD_DEFAULTS[name].title,
                    }),
                    defineField({
                        name: 'subtitle',
                        title: 'Undertekst',
                        type: 'string',
                        placeholder: HOME_CARD_DEFAULTS[name].subtitle,
                    }),
                ],
            })
        ),
    ],
    preview: {
        prepare() {
            return {
                title: 'Forsiden',
            }
        },
    },
})
