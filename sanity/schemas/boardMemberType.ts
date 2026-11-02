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
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
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
            title: 'Role',
            type: 'string',
            options: {
                list: boardRoleOptions,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'email',
            title: 'Email',
            type: 'string',
            validation: (rule) => rule.email(),
        }),
        defineField({
            name: 'activeFrom',
            title: 'Active from',
            type: 'date',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'activeTo',
            title: 'Active to',
            type: 'date',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'profileImage',
            title: 'Profile Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'PersonalImage',
            title: 'Personal Image',
            type: 'image',
        }),
        defineField({
            name: 'bio',
            title: 'Biography',
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
