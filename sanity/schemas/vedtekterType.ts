import { defineField, defineType } from 'sanity'

export const vedtekterType = defineType({
    name: 'vedtekter',
    title: 'Vedtekter',
    type: 'document',
    fields: [
        defineField({
            name: 'content',
            title: 'Innhold',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lastUpdated',
            title: 'Sist oppdatert',
            type: 'datetime',
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Vedtekter',
            }
        },
    },
})
