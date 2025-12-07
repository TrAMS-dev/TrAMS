import { defineType, defineField } from "sanity"

export const akuttCallingType = defineType({
    name: 'akuttCalling',
    title: 'Akuttcalling',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Tittel',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'content',
            title: 'Innhold',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'gallery',
            title: 'Bilder',
            type: 'array',
            of: [{ type: 'image', options: { hotspot: true } }],
            options: {
                layout: 'grid',
            },
        }),
        defineField({
            name: 'link',
            title: 'Lenke til akuttcalling-skjema',
            type: 'url',
            description: 'Lenke til akuttcalling-skjema',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            gallery: 'gallery',
        },
    },
})