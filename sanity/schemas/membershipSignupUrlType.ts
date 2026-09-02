import { defineField, defineType } from 'sanity'

export const membershipSignupUrlType = defineType({
    name: 'membershipSignupUrl',
    title: 'URL til medlemskapsskjema',
    type: 'document',
    fields: [
        defineField({
            name: 'membershipSignupUrl',
            title: 'Lenke til medlemskapsskjema',
            type: 'url',
            description: 'URL til Google-skjema eller annet påmeldingsskjema (f.eks. forms.gle/...)',
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'For medisinstudenter',
            }
        },
    },
})
