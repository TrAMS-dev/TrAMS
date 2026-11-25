import { defineField, defineType } from 'sanity'
import { slugify } from '../lib/slugify'
import { boardRoleOptions } from './boardRoleOptions'


export const boardMemberType = defineType({
    name: 'boardMember',
    title: 'Styremedlem',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Navn',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Nettadresse (slug)',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
                slugify: slugify,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'role',
            title: 'Verv',
            type: 'string',
            options: {
                list: boardRoleOptions,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'E-post',
            type: 'string',
            validation: (rule) => rule.email(),
        }),
        defineField({
            name: 'activeFrom',
            title: 'Aktiv fra',
            type: 'date',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'activeTo',
            title: 'Aktiv til',
            type: 'date',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'profileImage',
            title: 'Profilbilde',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'PersonalImage',
            title: 'Personlig bilde',
            type: 'image',
        }),
        defineField({
            name: 'bio',
            title: 'Om meg',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'role',
            media: 'profileImage',
        },
    },
})
