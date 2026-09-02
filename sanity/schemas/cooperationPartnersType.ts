import { defineField, defineType } from 'sanity'

export const cooperationPartnersType = defineType({
    name: 'cooperationPartners',
    title: 'Samarbeidspartnere og søsterforeninger',
    type: 'document',
    fields: [
        defineField({
            name: 'partners',
            title: 'Partners',
            type: 'array',
            of: [
                defineField({
                    name: 'partner',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                        }),
                        defineField({
                            name: 'logo',
                            title: 'Logo',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        }),
                        defineField({
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                        }),
                        defineField({
                            name: 'size',
                            title: 'Size',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Small', value: 'small' },
                                    { title: 'Medium', value: 'medium' },
                                    { title: 'Large', value: 'large' },
                                ],
                                layout: 'radio'
                            },
                            initialValue: 'medium'
                        })
                    ],
                }),
            ],
        }),
        defineField({
            name: 'sisterOrganizations',
            title: 'Sister Organizations',
            type: 'array',
            of: [
                defineField({
                    name: 'organization',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Name',
                            type: 'string',
                        }),
                        defineField({
                            name: 'logo',
                            title: 'Logo',
                            type: 'image',
                            options: {
                                hotspot: true,
                            },
                        }),
                        defineField({
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                        }),
                    ],
                }),
            ],
        }),
    ],
    preview: {
        select: {
            partners: 'partners',
            sisterOrganizations: 'sisterOrganizations',
        },
        prepare(selection) {
            return {
                title: 'Samarbeidspartnere og søsterforeninger',
            }
        },
    },
})
