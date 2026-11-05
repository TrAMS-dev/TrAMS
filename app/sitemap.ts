import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { BOARD_MEMBERS_QUERY, BOARD_ROLE_SLUGS_QUERY, COMMITTEES_QUERY } from '@/sanity/lib/queries'
import { BoardMember, Committee } from '@/types/sanity.types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.trams.no'

    // Fetch all board members for dynamic routes
    const boardMembers = await client.fetch<BoardMember[]>(BOARD_MEMBERS_QUERY)

    // Fetch all committees for dynamic routes
    const committees = await client.fetch<Committee[]>(COMMITTEES_QUERY)

    // Fetch all board role descriptions for /om-oss/styret/<role>
    const boardRoles = await client.fetch(BOARD_ROLE_SLUGS_QUERY)

    const boardRoleRoutes = boardRoles
        .filter((role) => !!role.slug)
        .map((role) => ({
            url: `${baseUrl}/om-oss/styret/${role.slug}`,
            lastModified: new Date(role._updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))

    // Dynamic routes for board members (under tidligere-styrer)
    const boardMemberRoutes = boardMembers.map((member) => ({
        url: `${baseUrl}/om-oss/styret/tidligere-styrer/${member.slug.current}`,
        lastModified: new Date(member._updatedAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }))

    // Dynamic routes for committees
    const committeeRoutes = committees.map((committee) => ({
        url: `${baseUrl}/for-medisinstudenter/${committee.slug.current}`,
        lastModified: new Date(committee._updatedAt || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const routes = [
        '',
        '/for-medisinstudenter',
        '/for-medisinstudenter/akuttcalling',
        '/for-medisinstudenter/markorer',
        '/forstehjelpskurs',
        '/forstehjelpskurs/book-kurs',
        '/instruktorer',
        '/om-oss',
        '/om-oss/trams-i-media',
        '/om-oss/vedtekter',
        '/om-oss/styret/tidligere-styrer',

    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return [...routes, ...boardRoleRoutes, ...boardMemberRoutes, ...committeeRoutes]
}
