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

// Query to get all carousel slides, ordered by display order
export const CAROUSEL_SLIDES_QUERY = defineQuery(`*[_type == "carouselSlide"] | order(order asc) {
  _id,
  backgroundImage,
  title,
  description,
  buttonText,
  buttonLink,
  order
}`)

// Query to get all media items, ordered by display order
export const MEDIA_ITEMS_QUERY = defineQuery(`*[_type == "mediaItem"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  thumbnail,
  videoUrl,
  externalLink,
  linkText,
  year,
  order,
  publishedAt
}`)

// Query to get the current board leader (Leder)
export const BOARD_LEADER_QUERY = defineQuery(`*[_type == "boardMember" && role == "Leder"][0] {
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

// Query to get all course offerings, ordered by display order
export const COURSE_OFFERINGS_QUERY = defineQuery(`*[_type == "courseOffering"] | order(order asc) {
  _id,
  title,
  description,
  image,
  link,
  linkText,
  order,
  category
}`)

// Query to get all committees, ordered by display order
export const COMMITTEES_QUERY = defineQuery(`*[_type == "committee"] | order(order asc) {
  _id,
  name,
  slug,
  email,
  logo,
  shortDescription,
  order
}`)

// Query to get a single committee by slug
export const COMMITTEE_QUERY = defineQuery(`*[_type == "committee" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  email,
  logo,
  description,
  headerImage,
  committeeImage,
  order
}`)
