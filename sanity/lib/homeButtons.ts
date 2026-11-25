/**
 * Front page buttons: the icon choices offered in Studio and the buttons shown
 * when the "Knapper" list on Forsiden is empty.
 * Kept free of server and React imports so the Studio bundle can use it too.
 */

export const HOME_BUTTON_ICONS = [
    { title: 'Personer', value: 'users' },
    { title: 'Kalender', value: 'calendar' },
    { title: 'Hjerte med puls', value: 'heartPulse' },
    { title: 'Stetoskop', value: 'stethoscope' },
    { title: 'Ambulanse', value: 'ambulance' },
    { title: 'Studenthatt', value: 'graduationCap' },
    { title: 'Bok', value: 'bookOpen' },
    { title: 'Informasjon', value: 'info' },
    { title: 'E-post', value: 'mail' },
    { title: 'Håndtrykk', value: 'handshake' },
    { title: 'Megafon', value: 'megaphone' },
    { title: 'Kartnål', value: 'mapPin' },
] as const

export type HomeButtonIcon = (typeof HOME_BUTTON_ICONS)[number]['value']

export type HomeButton = {
    title: string
    subtitle?: string
    link: string
    icon?: HomeButtonIcon
    highlighted?: boolean
}

export const HOME_BUTTON_DEFAULTS: HomeButton[] = [
    { title: 'Om Oss', subtitle: 'Hvem er TrAMS?', link: '/om-oss', icon: 'users' },
    { title: 'Book Kurs', subtitle: 'Bestill til din bedrift', link: '/forstehjelpskurs', icon: 'calendar', highlighted: true },
    { title: 'For Medisinstudenter', subtitle: 'Se informasjon for medisinstudenter', link: '/for-medisinstudenter', icon: 'heartPulse' },
]

/** A link must be a path on the site, a full web address or an e-mail link. */
export function isValidHomeButtonLink(link: string): boolean {
    return /^\/(?!\/)/.test(link) || /^https?:\/\/\S+$/.test(link) || /^mailto:\S+@\S+$/.test(link)
}
