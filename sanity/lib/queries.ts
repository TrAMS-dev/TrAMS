import { defineQuery } from 'next-sanity'

// Query to get all board members, ordered by display order
export const BOARD_MEMBERS_QUERY = defineQuery(`*[_type == "boardMember"] | order(order asc) {
  _id,
  name,
  slug,
  role,
  email,
  age,
  hometown,
  profileImage,
  PersonalImage,
  bio,
  order,
  activeFrom,
  activeTo
}`)

// Query to get a single board member by slug
export const BOARD_MEMBER_QUERY = defineQuery(`*[_type == "boardMember" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  role,
  email,
  age,
  hometown,
  profileImage,
  PersonalImage,
  bio,
  order,
  activeFrom,
  activeTo
}`)


export const CAROUSEL_SLIDES_QUERY = defineQuery(`*[_type == "carouselSlide"] | order(order asc) {
  _id,
  backgroundImage,
  title,
  description,
  buttonText,
  buttonLink,
  order
}`)
