import { defineField, defineType } from 'sanity'

export const instruktorPageType = defineType({
    name: 'instruktorPage',
    title: 'Instruktørside',
    type: 'document',
    fields: [
        defineField({
            name: 'becomeInstructorText',
            title: 'Bli instruktør – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'skillInstructorText',
            title: 'Ferdighetsinstruktør – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Instruktørside',
            }
        },
    },
})
