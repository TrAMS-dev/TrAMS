import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
    name: 'siteSettings',
    title: 'Kontaktinfo (bunntekst)',
    type: 'document',
    fields: [
        defineField({
            name: 'address',
            title: 'Adresse',
            type: 'text',
            rows: 2,
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'orgNumber',
            title: 'Organisasjonsnummer',
            type: 'string',
        }),
        defineField({
            name: 'contactEmail',
            title: 'Kontakt-e-post',
            type: 'string',
            validation: (rule) => rule.required().email(),
        }),
        defineField({
            name: 'instagramUrl',
            title: 'Instagram',
            type: 'url',
        }),
        defineField({
            name: 'facebookUrl',
            title: 'Facebook',
            type: 'url',
        }),
        defineField({
            name: 'githubUrl',
            title: 'GitHub',
            type: 'url',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Kontaktinfo (bunntekst)',
            }
        },
    },
})
