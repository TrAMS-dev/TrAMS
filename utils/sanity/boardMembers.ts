import { client } from '@/sanity/lib/client'
import { BOARD_MEMBERS_QUERY, BOARD_MEMBER_QUERY_BY_ROLE, BOARD_MEMBER_QUERY_BY_SLUG } from '@/sanity/lib/queries'
import { BoardMember } from '@/types/sanity.types'

/**
 * Fetches all board members from Sanity, ordered by their display order
 */
export async function getAllBoardMembers(): Promise<BoardMember[]> {
  try {
    const boardMembers = await client.fetch<BoardMember[]>(BOARD_MEMBERS_QUERY)
    return boardMembers
  } catch (error) {
    console.error('Error fetching board members:', error)
    return []
  }
}

/**
 * Fetches a single board member by their slug
 * @param slug - The slug of the board member to fetch
 */
export async function getBoardMemberBySlug(slug: string): Promise<BoardMember | null> {
  try {
    const boardMember = await client.fetch<BoardMember>(BOARD_MEMBER_QUERY_BY_SLUG, { slug })
    return boardMember
  } catch (error) {
    console.error(`Error fetching board member with slug "${slug}":`, error)
    return null
  }
}

export async function getBoardMemberByRole(role: string): Promise<BoardMember | null> {
  try {
    const boardMember = await client.fetch<BoardMember>(BOARD_MEMBER_QUERY_BY_ROLE, { role })
    return boardMember
  } catch (error) {
    console.error(`Error fetching board member with role "${role}":`, error)
    return null
  }
}

