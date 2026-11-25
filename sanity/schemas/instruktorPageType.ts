import { defineField, defineType } from 'sanity'
import { heroField } from './heroField'

export const instruktorPageType = defineType({
    name: 'instruktorPage',
    title: 'For instruktører-siden',
    type: 'document',
    fields: [
        heroField('instruktorer'),
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
                title: 'For instruktører-siden',
            }
        },
    },
})
