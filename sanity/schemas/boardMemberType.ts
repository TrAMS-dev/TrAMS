import { defineField, defineType } from 'sanity'
import { slugify } from '../lib/slugify'


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
                list: [
                    { title: 'Styreleder', value: 'boardLeader' },
                    { title: 'Fagansvarlig', value: 'subjectLeader' },
                    { title: 'Internsjef', value: 'internalLeader' },
                    { title: 'Eksternsjef', value: 'externalLeader' },
                    { title: 'Internkoordinator', value: 'internalCoordinator' },
                    { title: 'Eksternkoordinator', value: 'externalCoordinator' },
                    { title: 'Komiteansvarlig', value: 'comitteeLeader' },
                    { title: 'Instruktøransvarlig', value: 'instructorLeader' },
                    { title: 'Økonomiansvarlig', value: 'financialLeader' },
                    { title: 'Markøransvarlig', value: 'extraLeader' },
                    { title: 'Markedsføringsansvarlig', value: 'marketingLeader' },
                    { title: 'Sponsoransvarlig', value: 'sponsorLeader' },
                    { title: 'Utstyransvarlig', value: 'equipmentLeader' },
                    { title: 'Sekretær', value: 'secretary' },
                    { title: 'Mentorleder', value: 'mentorLeader' },
                ],
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
