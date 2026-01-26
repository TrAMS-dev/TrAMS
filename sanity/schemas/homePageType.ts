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
    ],
    preview: {
        prepare() {
            return {
                title: 'Hjemmeside',
            }
        },
    },
})
