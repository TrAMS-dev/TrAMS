import { defineField, defineType } from 'sanity'
import { slugify } from '../lib/slugify'

export const committeeType = defineType({
    name: 'committee',
    title: 'Komité',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Navn',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
                slugify: slugify,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'E-post',
            type: 'string',
            validation: (rule) => rule.email(),
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Fullstendig beskrivelse',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'headerImage',
            title: 'Header-bilde',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'committeeImage',
            title: 'Bilde av komiteens medlemmer',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'order',
            title: 'Rekkefølge',
            type: 'number',
            description: 'Brukes for å sortere komitéene',
            validation: (rule) => rule.required(),
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
            title: 'name',
            subtitle: 'email',
            media: 'logo',
        },
    },
})
