import { defineField, defineType } from 'sanity'

export const firstAidCoursePageType = defineType({
    name: 'firstAidCoursePage',
    title: 'Førstehjelpskurs Side',
    type: 'document',
    fields: [
        defineField({
            name: 'introText',
            title: 'Introduksjonstekst',
            type: 'text',
            validation: (rule) => rule.required(),
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
    ],
    preview: {
        prepare() {
            return {
                title: 'Førstehjelpskurs Side',
            }
        },
    },
})
