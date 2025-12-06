import { defineField, defineType } from 'sanity'

export const firstAidInfoType = defineType({
    name: 'firstAidInfo',
    title: 'Info om førstehjelpskurs',
    type: 'document',
    fields: [
        defineField({
            name: 'col1',
            title: 'Kolonne 1',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'col2',
            title: 'Kolonne 2',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Info om førstehjelpskurs',
            }
        },
    },
})
