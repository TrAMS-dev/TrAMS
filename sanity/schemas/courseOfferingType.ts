import { defineField, defineType } from 'sanity'

export const courseOfferingType = defineType({
    name: 'courseOffering',
    title: 'Kurstilbud',
    type: 'document',
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
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Bilde',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'link',
            title: 'Lenke (valgfritt)',
            type: 'url',
            description: 'Ekstern lenke til mer informasjon',
        }),
        defineField({
            name: 'linkText',
            title: 'Lenketekst',
            type: 'string',
            description: 'Tekst for lenkeknappen (f.eks. "Les mer")',
        }),
        defineField({
            name: 'order',
            title: 'Rekkefølge',
            type: 'number',
            description: 'Brukes for å sortere kurstilbudene',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Kategori',
            type: 'string',
            validation: (rule) => rule.required(),
            options: {
                list: [
                    { title: 'Timeplanfestet kurs', value: 'timeplanfestet' },
                    { title: 'Komite-arrangement', value: 'committeevent' },
                    { title: 'Ferdighetskurs', value: 'skillcourse' },
                    { title: 'Annet', value: 'other' },
                ],
            },
        }),
    ],
    orderings: [
        {
            title: 'Rekkefølge',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            order: 'order',
            media: 'image',
        },
        prepare(selection) {
            const { title, order, media } = selection
            return {
                title: title,
                subtitle: `Rekkefølge: ${order}`,
                media: media,
            }
        },
    },
})
