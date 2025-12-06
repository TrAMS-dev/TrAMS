import { LinkIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const instruktorLinkType = defineType({
    name: 'instruktorLink',
    title: 'Instruktørlenke',
    type: 'document',
    icon: LinkIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Tittel',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Beskrivelse',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'link',
            title: 'Lenke',
            type: 'url',
            validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }),
        }),
        defineField({
            name: 'linkText',
            title: 'Lenketekst',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'rank',
            title: 'Rangering',
            type: 'number',
            description: 'Brukes til å sortere lenkene. Lavest nummer kommer først.',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'link',
        },
    },
})
