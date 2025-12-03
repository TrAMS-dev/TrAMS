import { client } from '@/sanity/lib/client'
import { BoardMember } from '@/types/sanity.types'

export async function getAllBoardMembers(): Promise<BoardMember[]> {
    const query = `*[_type == "boardMember"] | order(order asc) {
    _id,
    name,
    slug,
    role,
    email,
    age,
    hometown,
    profileImage,
    bio,
    order
  }`

    return await client.fetch(query)
}

export async function getBoardMemberBySlug(slug: string): Promise<BoardMember | null> {
    const query = `*[_type == "boardMember" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    role,
    email,
    age,
    hometown,
    profileImage,
    bio,
    order
  }`

    return await client.fetch(query, { slug })
}
