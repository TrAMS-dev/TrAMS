import { defineField, defineType } from 'sanity'

export const mediaItemType = defineType({
    name: 'mediaItem',
    title: 'TrAMS i Media',
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
            name: 'thumbnail',
            title: 'Thumbnail/Bilde',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL (YouTube, Vimeo, etc.)',
            type: 'url',
            description: 'Lenke til video (valgfritt)',
        }),
        defineField({
            name: 'externalLink',
            title: 'Ekstern lenke',
            type: 'url',
            description: 'Lenke til artikkel eller annet innhold (valgfritt)',
        }),
        defineField({
            name: 'year',
            title: 'År',
            type: 'number',
            validation: (rule) => rule.required().min(2000).max(2100),
        }),
        defineField({
            name: 'publishedAt',
            title: 'Publiseringsdato',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    orderings: [
        {
            title: 'År, nyeste først',
            name: 'yearDesc',
            by: [{ field: 'year', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            year: 'year',
            media: 'thumbnail',
        },
        prepare(selection) {
            const { title, year, media } = selection
            return {
                title: title,
                subtitle: `${year}`,
                media: media,
            }
        },
    },
})
