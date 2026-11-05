import { defineField, defineType } from 'sanity'

export const forMedisinstudenterPageType = defineType({
    name: 'forMedisinstudenterPage',
    title: 'For medisinstudenter side',
    type: 'document',
    fields: [
        defineField({
            name: 'membershipSignupUrl',
            title: 'Lenke til medlemskapsskjema',
            type: 'url',
            description: 'URL til Google-skjema eller annet påmeldingsskjema (f.eks. forms.gle/...). Brukes også på arrangementssidene.',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'membershipText',
            title: 'Bli medlem – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'offersText',
            title: 'Våre tilbud – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'committeesText',
            title: 'Komitéer – tekst',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'For medisinstudenter side',
            }
        },
    },
})
