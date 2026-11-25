import { defineArrayMember, defineField, defineType } from 'sanity'
import { heroField } from './heroField'

export const firstAidCoursePageType = defineType({
    name: 'firstAidCoursePage',
    title: 'Førstehjelpskurs-siden',
    type: 'document',
    fields: [
        heroField('forstehjelpskurs'),
        defineField({
            name: 'boxes',
            title: 'Bokser øverst på siden',
            description: 'Vises side om side på PC og under hverandre på mobil. Dra for å endre rekkefølgen.',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'ctaBox',
                    title: 'Boks',
                    fields: [
                        defineField({
                            name: 'heading',
                            title: 'Overskrift',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'text',
                            title: 'Tekst',
                            type: 'text',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'buttonLabel',
                            title: 'Knappetekst',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'link',
                            title: 'Lenke',
                            type: 'url',
                            description:
                                'Hvor knappen går. En side på nettstedet skrives som /forstehjelpskurs/book-kurs. Lenker til andre nettsider (f.eks. Google Forms) åpnes i ny fane.',
                            validation: (rule) =>
                                rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                        }),
                    ],
                    preview: {
                        select: { title: 'heading', subtitle: 'link' },
                    },
                }),
            ],
            validation: (rule) => rule.required().min(1),
        }),
        // Old box fields, replaced by "boxes". Hidden once "boxes" has content; remove after the content is moved.
        ...(['introHeading', 'introText', 'introButtonLabel'] as const).map((name) =>
            defineField({
                name,
                type: name === 'introText' ? 'text' : 'string',
                hidden: ({ document }) => Boolean((document?.boxes as unknown[] | undefined)?.length),
                readOnly: true,
            })
        ),
        defineField({
            name: 'boxMedic',
            type: 'object',
            hidden: ({ document }) => Boolean((document?.boxes as unknown[] | undefined)?.length),
            readOnly: true,
            fields: ['heading', 'text', 'buttonLabel', 'formUrl'].map((name) => defineField({ name, type: 'string' })),
        }),
        defineField({
            name: 'courses',
            title: 'Kurs',
            type: 'array',
            of: [
                {
                    type: 'object',
                    name: 'course',
                    title: 'Kurs',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Tittel',
                            type: 'string',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'description',
                            title: 'Beskrivelse',
                            type: 'text',
                            validation: (rule) => rule.required(),
                        }),
                        defineField({
                            name: 'modules',
                            title: 'Moduler',
                            type: 'array',
                            of: [
                                {
                                    type: 'object',
                                    name: 'module',
                                    title: 'Modul',
                                    fields: [
                                        defineField({
                                            name: 'number',
                                            title: 'Nummer',
                                            type: 'string',
                                            validation: (rule) => rule.required(),
                                        }),
                                        defineField({
                                            name: 'title',
                                            title: 'Tittel',
                                            type: 'string',
                                            validation: (rule) => rule.required(),
                                        }),
                                        defineField({
                                            name: 'description',
                                            title: 'Beskrivelse',
                                            type: 'text',
                                            validation: (rule) => rule.required(),
                                        }),
                                        defineField({
                                            name: 'imageSrc',
                                            title: 'Bilde',
                                            type: 'image',
                                            validation: (rule) => rule.required(),
                                        }),
                                        defineField({
                                            name: 'imageAlt',
                                            title: 'Bilde Alt-tekst',
                                            type: 'string',
                                            validation: (rule) => rule.required(),
                                        }),
                                        defineField({
                                            name: 'isReversed',
                                            title: 'Reversert layout',
                                            type: 'boolean',
                                            description: 'Bytt plass på bilde og tekst',
                                            initialValue: false,
                                        }),
                                    ],
                                    preview: {
                                        select: {
                                            title: 'title',
                                            number: 'number',
                                        },
                                        prepare(selection) {
                                            const { title, number } = selection
                                            return {
                                                title: `${number}. ${title}`,
                                            }
                                        },
                                    },
                                },
                            ],
                            validation: (rule) => rule.required().min(1),
                        }),
                        defineField({
                            name: 'footerNote',
                            title: 'Bunntekst',
                            type: 'text',
                            description: 'Valgfri tekst som vises under modulene',
                        }),
                    ],
                    preview: {
                        select: {
                            title: 'title',
                        },
                        prepare(selection) {
                            const { title } = selection
                            return {
                                title: title,
                            }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'otherCoursesText',
            title: 'Andre kurs – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'evaluationText',
            title: 'Evaluering – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'evaluationFormUrl',
            title: 'Lenke til evalueringsskjema',
            type: 'url',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Førstehjelpskurs-siden',
            }
        },
    },
})
