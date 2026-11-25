import { defineArrayMember, defineField, defineType } from 'sanity'
import { HOME_BUTTON_ICONS, isValidHomeButtonLink } from '../lib/homeButtons'

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
        defineField({
            name: 'buttons',
            title: 'Knapper',
            description:
                'Knappene nederst på forsiden, i rekkefølgen de vises. Dra for å endre rekkefølgen. ' +
                'Står listen tom, vises standardknappene Om Oss, Book Kurs og For Medisinstudenter.',
            type: 'array',
            of: [
                defineArrayMember({
                    name: 'homeButton',
                    title: 'Knapp',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Tittel',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'subtitle',
                            title: 'Undertekst',
                            type: 'string',
                        }),
                        defineField({
                            name: 'link',
                            title: 'Lenke',
                            type: 'string',
                            description:
                                'En side på nettsiden, f.eks. /forstehjelpskurs, eller en full adresse som starter med https://. ' +
                                'Lenker til andre nettsider åpnes i ny fane.',
                            validation: (rule) =>
                                rule.required().custom((link) =>
                                    !link || isValidHomeButtonLink(link.trim())
                                        ? true
                                        : 'Skriv en side som starter med / (f.eks. /om-oss), en adresse som starter med https://, eller mailto:navn@eksempel.no'
                                ),
                        }),
                        defineField({
                            name: 'icon',
                            title: 'Ikon',
                            type: 'string',
                            options: { list: [...HOME_BUTTON_ICONS] },
                        }),
                        defineField({
                            name: 'highlighted',
                            title: 'Fremhevet',
                            description: 'Vis knappen i rødt, slik Book Kurs-knappen vises i dag.',
                            type: 'boolean',
                            initialValue: false,
                        }),
                    ],
                    preview: {
                        select: { title: 'title', link: 'link', highlighted: 'highlighted' },
                        prepare({ title, link, highlighted }) {
                            return {
                                title: title || 'Uten tittel',
                                subtitle: [link, highlighted ? 'fremhevet' : null].filter(Boolean).join(' · '),
                            }
                        },
                    },
                }),
            ],
            validation: (rule) => rule.max(6).error('Forsiden har plass til maks 6 knapper.'),
        }),
        // Replaced by "Knapper". Kept hidden so Studio doesn't flag the saved values as unknown fields.
        ...(['aboutCard', 'bookCard', 'studentsCard'] as const).map((name) =>
            defineField({
                name,
                type: 'object',
                hidden: true,
                fields: [
                    defineField({ name: 'title', type: 'string' }),
                    defineField({ name: 'subtitle', type: 'string' }),
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
