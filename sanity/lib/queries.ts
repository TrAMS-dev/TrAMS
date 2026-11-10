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
  profileImage,
  PersonalImage,
  bio,
  activeFrom,
  activeTo
}`)

// Query to get all media items, newest first
export const MEDIA_ITEMS_QUERY = defineQuery(`*[_type == "mediaItem"] | order(year desc, publishedAt desc) {
  _id,
  title,
  description,
  thumbnail,
  videoUrl,
  externalLink,
  year,
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
  },
  otherCoursesText,
  evaluationText,
  evaluationFormUrl
}`)

export const BOOK_KURS_PAGE_QUERY = defineQuery(`*[_type == "bookKursPage"][0] {
  _id,
  step1Content
}`)

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0] {
  _id,
  videoUrl,
  tagline
}`)

export const FOR_MEDISINSTUDENTER_PAGE_QUERY = defineQuery(`*[_type == "forMedisinstudenterPage"][0] {
  _id,
  membershipSignupUrl,
  membershipText,
  offersText,
  committeesText
}`)

export const INSTRUKTOR_PAGE_QUERY = defineQuery(`*[_type == "instruktorPage"][0] {
  _id,
  becomeInstructorText,
  skillInstructorText
}`)

export const ABOUT_PAGE_QUERY = defineQuery(`*[_type == "aboutPage"][0] {
  _id,
  aboutText,
  partnerCtaTitle,
  partnerCtaText
}`)

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0] {
  _id,
  address,
  orgNumber,
  contactEmail,
  instagramUrl,
  facebookUrl,
  githubUrl
}`)

// Board role description plus the member who holds the role now (latest activeTo).
// $slug is the role in lower case, as used in the URL (e.g. "boardleader").
export const BOARD_ROLE_PAGE_QUERY = defineQuery(`*[_type == "boardRole" && lower(role) == $slug][0] {
  _id,
  role,
  title,
  description,
  "member": *[_type == "boardMember" && role == ^.role] | order(activeTo desc)[0]
}`)

export const BOARD_ROLE_SLUGS_QUERY = defineQuery(`*[_type == "boardRole" && defined(role)] {
  "slug": lower(role),
  _updatedAt
}`)

export const CERTIFICATE_SETTINGS_QUERY = defineQuery(`*[_type == "certificateSettings"][0] {
  signerName,
  signerTitle,
  "signatureUrl": signature.asset->url
}`)
