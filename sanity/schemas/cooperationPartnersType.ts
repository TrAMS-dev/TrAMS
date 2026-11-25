import { defineField, defineType } from 'sanity'

export const cooperationPartnersType = defineType({
    name: 'cooperationPartners',
    title: 'Samarbeidspartnere og søsterforeninger',
    type: 'document',
    fields: [
        defineField({
            name: 'partners',
            title: 'Samarbeidspartnere',
            type: 'array',
            of: [
                defineField({
                    name: 'partner',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Navn',
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
                            title: 'Lenke',
                            type: 'url',
                        }),
                        defineField({
                            name: 'size',
                            title: 'Størrelse på logo',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Liten', value: 'small' },
                                    { title: 'Middels', value: 'medium' },
                                    { title: 'Stor', value: 'large' },
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
            title: 'Søsterforeninger',
            type: 'array',
            of: [
                defineField({
                    name: 'organization',
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'name',
                            title: 'Navn',
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
                            title: 'Lenke',
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
