import { boardMemberType } from './boardMemberType'
import { boardRoleType } from './boardRoleType'
import { mediaItemType } from './mediaItemType'
import { courseOfferingType } from './courseOfferingType'
import { committeeType } from './committeeType'
import { vedtekterType } from './vedtekterType'
import { instruktorLinkType } from './instruktorLinkType'
import { akuttCallingType } from './akuttCallingType'
import { markorPageType } from './markorPageType'
import { cooperationPartnersType } from './cooperationPartnersType'
import { firstAidCoursePageType } from './firstAidCoursePageType'
import { bookKursPageType } from './bookKursPageType'
import { homePageType } from './homePageType'
import { forMedisinstudenterPageType } from './forMedisinstudenterPageType'
import { instruktorPageType } from './instruktorPageType'
import { aboutPageType } from './aboutPageType'
import { siteSettingsType } from './siteSettingsType'

export const schemaTypes = [
    boardMemberType,
    boardRoleType,
    mediaItemType,
    courseOfferingType,
    committeeType,
    vedtekterType,
    instruktorLinkType,
    akuttCallingType,
    markorPageType,
    cooperationPartnersType,
    firstAidCoursePageType,
    bookKursPageType,
    homePageType,
    forMedisinstudenterPageType,
    instruktorPageType,
    aboutPageType,
    siteSettingsType,
]

export const SingletonTypes = [
    'siteSettings',
    'homePage',
    'aboutPage',
    'vedtekter',
    'firstAidCoursePage',
    'bookKursPage',
    'forMedisinstudenterPage',
    'akuttCalling',
    'markorPage',
    'instruktorPage',
    'cooperationPartners',
]
