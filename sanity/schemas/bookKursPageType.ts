import { defineField, defineType } from 'sanity'
import { heroField } from './heroField'

export const bookKursPageType = defineType({
    name: 'bookKursPage',
    title: 'Book kurs-siden',
    type: 'document',
    fields: [
        heroField('bookKurs'),
        defineField({
            name: 'step1Content',
            title: 'Steg 1: Priser og Informasjon',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
            description: 'Innholdet som vises på første steg i bestillingsskjemaet',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Book kurs-siden',
            }
        },
    },
})
