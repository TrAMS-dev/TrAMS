import { defineField, defineType } from 'sanity'

export const bookKursPageType = defineType({
    name: 'bookKursPage',
    title: 'Book Kurs Side',
    type: 'document',
    fields: [
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
                title: 'Book Kurs Side',
            }
        },
    },
})
