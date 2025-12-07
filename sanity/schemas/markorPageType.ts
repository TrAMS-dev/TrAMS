import { defineType, defineField } from "sanity"

export const markorPageType = defineType({
    name: 'markorPage',
    title: 'Markørside',
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
            title: 'Lenke til påmelding',
            type: 'url',
            description: 'Lenke til påmelding',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            gallery: 'gallery',
        },
    },
})