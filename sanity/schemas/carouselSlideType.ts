import { defineField, defineType } from 'sanity'



export const carouselSlideType = defineType({
    name: 'carouselSlide',
    title: 'Slide på forsiden',
    type: 'document',
    fields: [
        defineField({
            name: 'backgroundImage',
            title: 'Bakgrunn',
            type: 'image',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'buttonText',
            title: 'Button Text',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'buttonLink',
            title: 'Button Link',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
    ],
})
