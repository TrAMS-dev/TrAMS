import { boardMemberType } from './boardMemberType'
import { carouselSlideType } from './carouselSlideType'
import { mediaItemType } from './mediaItemType'
import { courseOfferingType } from './courseOfferingType'
import { committeeType } from './committeeType'
import { vedtekterType } from './vedtekterType'
import { instruktorLinkType } from './instruktorLinkType'
import { firstAidInfoType } from './firstAidInfoType'
import { akuttCallingType } from './akuttCallingType'
import { markorPageType } from './markorPageType'
import { cooperationPartnersType } from './cooperationPartnersType'
import { firstAidCoursePageType } from './firstAidCoursePageType'
import { bookKursPageType } from './bookKursPageType'
import { homePageType } from './homePageType'

export const schemaTypes = [boardMemberType, carouselSlideType, mediaItemType, courseOfferingType, committeeType, vedtekterType, instruktorLinkType, firstAidInfoType, akuttCallingType, markorPageType, cooperationPartnersType, firstAidCoursePageType, bookKursPageType, homePageType]

export const SingletonTypes = ['vedtekter', 'firstAidInfo', 'akuttCalling', 'markorPage', 'cooperationPartners', 'firstAidCoursePage', 'bookKursPage', 'homePage']