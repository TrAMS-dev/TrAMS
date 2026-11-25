/**
 * Hero texts shown when a page's "Toppen av siden" fields are empty in Sanity.
 * Studio shows them as grey placeholder text in the empty fields.
 * Kept free of server imports so the Studio bundle can use it too.
 */
export const PAGE_HERO_DEFAULTS = {
    forstehjelpskurs: {
        heading: 'Førstehjelpskurs',
        text: 'TrAMS tilbyr flere førstehjelpskurs for bedrifter i Trondheim. Lær livreddende førstehjelp i dag.',
    },
    bookKurs: {
        heading: 'Book kurs',
        text: 'Bestill førstehjelpskurs med TrAMS for din bedrift eller organisasjon.',
    },
    forMedisinstudenter: {
        heading: 'For Medisinstudenter',
        text: 'Her kan du lese mer om medlemskap i TrAMS, våre kurs og aktiviteter som er spesielt rettet mot medisinstudenter.',
    },
    arrangementer: {
        heading: 'Arrangementer',
        text: 'Her kan du se alle våre arrangementer for å se hva som er planlagt.',
    },
    instruktorer: {
        heading: 'For instruktører',
        text: 'Her finner du informasjon som er spesielt rettet mot instruktører.',
    },
    omOss: {
        heading: 'TrAMS',
        text: 'Trondheim Akuttmedisinske Studentforening',
    },
    vedtekter: {
        heading: 'Vedtekter',
        text: 'her kan du lese om vedtektene til TrAMS',
    },
    tramsIMedia: {
        heading: 'TrAMS i media',
        text: 'Se hva vi har gjort og hvordan vi har blitt omtalt i media',
    },
    tidligereStyrer: {
        heading: 'Tidligere styrer',
        text: 'Oversikt over tidligere styremedlemmer i TrAMS gjennom årene',
    },
} as const

export type PageHeroKey = keyof typeof PAGE_HERO_DEFAULTS

type HeroData = { heading?: string | null; text?: string | null } | null | undefined

/** A page's hero from Sanity, with the default text for any empty field. */
export function heroWithDefaults(hero: HeroData, key: PageHeroKey): { heading: string; text: string } {
    return {
        heading: hero?.heading?.trim() || PAGE_HERO_DEFAULTS[key].heading,
        text: hero?.text?.trim() || PAGE_HERO_DEFAULTS[key].text,
    }
}
