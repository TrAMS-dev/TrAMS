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
    role == 'extraLeader' => 11,
    role == 'sponsorLeader' => 12,
    role == 'equipmentLeader' => 13,
    role == 'secretary' => 14,
    role == 'mentorLeader' => 15,
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

// Query to get CURRENT board members (activeTo >= now), ordered by display order
export const CURRENT_BOARD_MEMBERS_QUERY = defineQuery(`*[_type == "boardMember" && activeTo >= now()] | order(
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
    role == 'extraLeader' => 11,
    role == 'sponsorLeader' => 12,
    role == 'equipmentLeader' => 13,
    role == 'secretary' => 14,
    role == 'mentorLeader' => 15,
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

export const FIRST_AID_INFO_QUERY = defineQuery(`*[_type == "firstAidInfo"][0] {
  _id,
  col1,
  col2
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
export const AKUTTKALLING_QUERY = defineQuery(`*[_type == "akuttCalling"][0] {
  _id,
  title,
  content,
  gallery,
  link
}`)

export const MARKOR_PAGE_QUERY = defineQuery(`*[_type == "markorPage"][0] {
  _id,
  title,
  content,
  gallery,
  link
}
`)

export const COOPERATION_PARTNERS_QUERY = defineQuery(`*[_type == "cooperationPartners"][0] {
  _id,
  partners[] {
    _key,
    name,
    logo,
    url,
    size
  },
  sisterOrganizations[] {
    _key,
    name,
    logo,
    url
  }
}`)

export const FIRST_AID_COURSE_PAGE_QUERY = defineQuery(`*[_type == "firstAidCoursePage"][0] {
  _id,
  introText,
  courses[] {
    title,
    description,
    modules[] {
      number,
      title,
      description,
      imageSrc,
      imageAlt,
      isReversed
    },
    footerNote
  }
}`)

export const BOOK_KURS_PAGE_QUERY = defineQuery(`*[_type == "bookKursPage"][0] {
  _id,
  step1Content
}`)

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0] {
  _id,
  videoUrl
}`)