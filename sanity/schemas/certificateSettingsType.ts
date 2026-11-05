import { defineField, defineType } from 'sanity'

/** Who signs the certificates (kursbevis) participants get after events. Updated each year. */
export const certificateSettingsType = defineType({
    name: 'certificateSettings',
    title: 'Kursbevis (signatur)',
    type: 'document',
    fields: [
        defineField({
            name: 'signerName',
            title: 'Navn på den som signerer',
            description: 'Vanligvis lederen av TrAMS. Byttes når nytt styre tar over.',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'signerTitle',
            title: 'Tittel',
            type: 'string',
            initialValue: 'Leder TrAMS',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'signature',
            title: 'Signatur',
            description:
                'Bilde av signaturen med hvit eller gjennomsiktig bakgrunn, gjerne PNG rundt 1000 × 240 piksler. Vises over navnet på kursbeviset.',
            type: 'image',
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: { title: 'signerName', subtitle: 'signerTitle', media: 'signature' },
    },
})
