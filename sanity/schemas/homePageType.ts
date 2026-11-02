import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
    name: 'homePage',
    title: 'Hjemmeside',
    type: 'document',
    fields: [
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
            description: 'URL til bakgrunnsvideoen på hjemmesiden',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'tagline',
            title: 'Slagord',
            type: 'text',
            rows: 2,
            description: 'Teksten under logoen på forsiden. Linjeskift vises som linjeskift.',
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Hjemmeside',
            }
        },
    },
})
