import { defineQuery } from 'next-sanity'

// Query to get all board members, ordered by display order
export const BOARD_MEMBERS_QUERY = defineQuery(`*[_type == "boardMember"] | order(
  select(
    role == 'boardLeader' => 1,
    role == 'subjectLeader' => 2,
    role == 'internalLeader' => 3,
    role == 'externalLeader' => 4,
    role == 'internalCoordinator' => 5,
    role == 'externalCoordinator' => 6,
    role == 'committeeLeader' => 7,
    role == 'instructorLeader' => 8,
    role == 'financialLeader' => 9,
    role == 'marketingLeader' => 10,
    role == 'sponsorLeader' => 11,
    role == 'equipmentLeader' => 12,
    role == 'secretary' => 13,
    role == 'mentorLeader' => 14,
    99
  ) asc,
  _createdAt asc
) {
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
  activeFrom,
  activeTo
}`)

// Query to get a single board member by slug
export const BOARD_MEMBER_QUERY_BY_SLUG = defineQuery(`*[_type == "boardMember" && slug.current == $slug][0] {
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

export const BOARD_MEMBER_QUERY_BY_ROLE = defineQuery(`*[_type == "boardMember" && role == $role][0] {
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

// Query to get the vedtekter singleton document
export const VEDTEKTER_QUERY = defineQuery(`*[_type == "vedtekter"][0] {
  _id,
  content,
  lastUpdated
}`)

// Query to get all instruktør links, ordered by rank (or createdAt if rank is missing)
export const INSTRUKT_LINKS_QUERY = defineQuery(`*[_type == "instruktorLink"] | order(rank asc, _createdAt asc) {
  _id,
  title,
  description,
  link,
  linkText,
  rank
}`)
