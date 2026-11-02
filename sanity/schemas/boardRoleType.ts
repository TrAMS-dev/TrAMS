import { defineField, defineType } from 'sanity'
import { boardRoleOptions } from './boardRoleOptions'

export const boardRoleType = defineType({
    name: 'boardRole',
    title: 'Styreverv',
    type: 'document',
    description: 'Beskrivelse av et styreverv. Vises på /om-oss/styret/<verv> sammen med hvem som har vervet nå.',
    fields: [
        defineField({
            name: 'role',
            title: 'Verv',
            type: 'string',
            options: {
                list: boardRoleOptions,
            },
            validation: (rule) =>
                rule.required().custom(async (role, context) => {
                    if (!role) return true
                    const id = context.document?._id.replace(/^drafts\./, '')
                    const client = context.getClient({ apiVersion: '2024-01-01' })
                    const duplicate = await client.fetch<boolean>(
                        'defined(*[_type == "boardRole" && role == $role && !(_id in [$id, $draftId])][0]._id)',
                        { role, id, draftId: `drafts.${id}` }
                    )
                    return duplicate ? 'Det finnes allerede en beskrivelse for dette vervet' : true
                }),
        }),
        defineField({
            name: 'title',
            title: 'Tittel',
            type: 'string',
            description: 'Overskriften på siden, f.eks. "Leder"',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Beskrivelse',
            type: 'array',
            of: [{ type: 'block' }],
            validation: (rule) => rule.required(),
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'role',
        },
    },
})
