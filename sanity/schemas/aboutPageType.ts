import { defineField, defineType } from 'sanity'

export const aboutPageType = defineType({
    name: 'aboutPage',
    title: 'Om oss side',
    type: 'document',
    fields: [
        defineField({
            name: 'aboutText',
            title: 'Om TrAMS – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'partnerCtaTitle',
            title: 'Samarbeidspartner-boks – overskrift',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'partnerCtaText',
            title: 'Samarbeidspartner-boks – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Om oss side',
            }
        },
    },
})
