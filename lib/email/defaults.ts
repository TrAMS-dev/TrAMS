/**
 * Standardtekster for alle e-poster. Brukes
 * - som startverdi i Sanity Studio når et e-postdokument opprettes, og
 * - som reserve når et felt er tomt i Sanity eller Sanity ikke svarer.
 *
 * Teksten redigeres i Sanity Studio under «E-poster». Endringer her påvirker bare
 * dokumenter som ikke er opprettet i Sanity ennå.
 *
 * Kun relative importer: filen brukes også av Sanity-skjemaet.
 */
import type { EmailText, PtBlock, PtSpan } from './portableText'

type Part = string | { text: string; href?: string; strong?: boolean }

let keyCounter = 0
const key = () => `d${(keyCounter++).toString(36).padStart(5, '0')}`

/** Ett avsnitt. Deler kan være tekst, lenker ({ text, href }) eller fet tekst ({ text, strong }). */
function p(...parts: Part[]): PtBlock {
    const markDefs: NonNullable<PtBlock['markDefs']> = []
    const children: PtSpan[] = parts.map((part) => {
        if (typeof part === 'string') return { _type: 'span', _key: key(), marks: [], text: part }
        const marks: string[] = []
        if (part.strong) marks.push('strong')
        if (part.href) {
            const linkKey = key()
            markDefs.push({ _key: linkKey, _type: 'link', href: part.href })
            marks.push(linkKey)
        }
        return { _type: 'span', _key: key(), marks, text: part.text }
    })
    return { _type: 'block', _key: key(), style: 'normal', markDefs, children }
}

const b = (text: string) => ({ text, strong: true })

const QUESTIONS = p('Har du spørsmål, send en e-post til {kontakt} (eller svar på denne e-posten).')
const EVENT_LINK = p('Her er lenke med informasjon om arrangementet: {lenke}')

export interface EmailSettingsContent {
    signOff: EmailText
    buttonFallbackText: string
}

export interface SimpleEmailContent {
    subject: string
    body: EmailText
}

export interface ParticipantRemovedContent {
    subject: string
    body: EmailText
    bodyWaitlist: EmailText
}

export interface EventFollowupContent {
    subject: string
    body: EmailText
    feedbackText: EmailText
    feedbackButton: string
    certificateText: EmailText
    certificateButton: string
}

export interface NotificationEmailContent {
    subject: string
    heading: string
    intro: EmailText
}

export interface BookingCustomerContent {
    subject: string
    heading: string
    title: string
    intro: EmailText
    summaryHeading: string
    outro: EmailText
    footer: EmailText
}

export interface BookingAdminContent {
    subject: string
    heading: string
    intro: EmailText
    note: EmailText
    footer: EmailText
}

export interface WebsiteFeedbackContent {
    subject: string
    heading: string
}

export interface EmailContentMap {
    emailSettings: EmailSettingsContent
    emailSignupConfirmed: SimpleEmailContent
    emailSignupWaitlist: SimpleEmailContent
    emailWaitlistPromoted: SimpleEmailContent
    emailMovedToWaitlist: SimpleEmailContent
    emailParticipantRemoved: ParticipantRemovedContent
    emailEventReminder: SimpleEmailContent
    emailEventFollowup: EventFollowupContent
    emailNewUser: NotificationEmailContent
    emailUserApproved: SimpleEmailContent
    emailBookingCustomer: BookingCustomerContent
    emailBookingAdmin: BookingAdminContent
    emailWebsiteFeedback: WebsiteFeedbackContent
}

export type EmailDocType = keyof EmailContentMap

export const EMAIL_DEFAULTS: EmailContentMap = {
    emailSettings: {
        signOff: [p('Med akuttmedisinsk hilsen,\nTrAMS')],
        buttonFallbackText: 'Fungerer ikke knappen? Kopier denne lenken:',
    },

    emailSignupConfirmed: {
        subject: 'Plass på kurs: {tittel}',
        body: [
            p('Hei! Du som har fått denne mailen har fått plass på {arrangement}.'),
            EVENT_LINK,
            p('Vi gleder oss til å se dere på kurs!'),
            p(
                'Dersom du ikke kan komme på kurset ønsker vi at du gir beskjed på denne mailen så fort som mulig for å kunne gi plass til de som står på evt. venteliste, og informerer om at du vil bli nedprioritert på fremtidige TrAMS kurs dersom du gir beskjed senere enn et døgn før kurset.{avbud}'
            ),
        ],
    },

    emailSignupWaitlist: {
        subject: 'Venteliste: {tittel}',
        body: [
            p('Hei! Du som har fått denne mailen er satt på venteliste til {arrangement}.'),
            p('Du har plass nummer {plass} på ventelisten.'),
            p('Dersom det åpner seg plass, får du e-post med veiledning for hvordan du bekrefter plassen på nettsiden.'),
            EVENT_LINK,
        ],
    },

    emailWaitlistPromoted: {
        subject: 'Du har fått plass: {tittel}',
        body: [
            p(
                'Hei {navn}! Du sto på venteliste, men det har blitt ledig plass og du er nå ',
                b('flyttet opp til bekreftet plass'),
                ' på {arrangement}.'
            ),
            EVENT_LINK,
            p('Vi gleder oss til å se deg på kurs!'),
            p(
                'Dersom du ikke kan komme på kurset ønsker vi at du gir beskjed på denne mailen så fort som mulig for å kunne gi plass til de som eventuelt står på venteliste under deg.'
            ),
        ],
    },

    emailMovedToWaitlist: {
        subject: 'Flyttet til venteliste: {tittel}',
        body: [
            p('Hei {navn}! Du er dessverre ', b('flyttet fra bekreftet plass til venteliste'), ' på {arrangement}.'),
            p('Du har plass nummer {plass} på ventelisten.'),
            p('Dersom det blir ledig plass, får du e-post om at du har fått plass.'),
            EVENT_LINK,
            QUESTIONS,
        ],
    },

    emailParticipantRemoved: {
        subject: 'Fjernet fra påmelding: {tittel}',
        body: [
            p('Hei {navn}! Du er ', b('fjernet fra påmeldingen'), ' til {arrangement}, og har ikke lenger plass på arrangementet.'),
            EVENT_LINK,
            QUESTIONS,
        ],
        bodyWaitlist: [
            p('Hei {navn}! Du er ', b('fjernet fra ventelisten'), ' til {arrangement}, og har ikke lenger plass på arrangementet.'),
            EVENT_LINK,
            QUESTIONS,
        ],
    },

    emailEventReminder: {
        subject: 'Påminnelse: {tittel}',
        body: [
            p('Hei {navn}! Dette er en påminnelse om at du har ', b('bekreftet plass'), ' på {arrangement}.'),
            EVENT_LINK,
            p('Vi gleder oss til å se deg!'),
            p(
                b('Dersom du ikke har mulighet til å møte'),
                ', må du sende en e-post til {kontakt} (eller svare på denne e-posten) ',
                b('senest 24 timer før arrangementet starter'),
                ', slik at plassen kan gå til noen andre.{avbud}'
            ),
        ],
    },

    emailEventFollowup: {
        subject: 'Takk for at du deltok: {tittel}',
        body: [p('Hei {navn}! Takk for at du deltok på {arrangement}.'), p('{tilbakemelding}'), p('{kursbevis}'), QUESTIONS],
        feedbackText: [
            p(
                'Vi vil gjerne høre hva du synes, slik at vi kan gjøre kursene våre enda bedre. Tilbakemeldingen er anonym og tar bare et par minutter.'
            ),
        ],
        feedbackButton: 'Gi tilbakemelding',
        certificateText: [p('Her er kursbeviset ditt. Du kan skrive det ut eller lagre det som PDF fra nettleseren.')],
        certificateButton: 'Se kursbevis',
    },

    emailNewUser: {
        subject: 'Ny brukerregistrering: {navn}',
        heading: 'TrAMS – ny brukerregistrering',
        intro: [p('En ny bruker har registrert seg og venter på godkjenning i admin.')],
    },

    emailUserApproved: {
        subject: 'Kontoen din er godkjent – TrAMS',
        body: [
            p('Hei {navn}!'),
            p('En administrator har ', b('godkjent'), ' kontoen din i TrAMS. Du kan nå logge inn og bruke systemet.'),
            p('Logg inn her: {innloggingslenke}'),
        ],
    },

    emailBookingCustomer: {
        subject: 'Bekreftelse på kursbestilling - TrAMS',
        heading: 'TrAMS - Trondheim Akuttmedisinske Studentforening',
        title: 'Takk for din bestilling!',
        intro: [
            p('Hei {navn},'),
            p(
                'Denne mailen bekrefter at du har booket førstehjelpskurs av TrAMS, Trondheim Akuttmedisinske Studentforening. Du vil bli kontaktet av foreningens eksternsjef når vi har funnet instruktører til å holde kurset, eller dersom det er ytterligere spørsmål til bookingen.'
            ),
        ],
        summaryHeading: 'Oppsummering av bestillingen',
        outro: [
            p('Har du spørsmål i mellomtiden? Ta gjerne kontakt med oss på {kontakt}.'),
            p('Med vennlig hilsen,\n', b('TrAMS')),
        ],
        footer: [p('TrAMS - Trondheim Akuttmedisinske Studentforening\n', { text: 'trams.no', href: 'https://trams.no' })],
    },

    emailBookingAdmin: {
        subject: 'Ny kursbestilling: {kurs} - {navn}',
        heading: 'Ny kursbestilling mottatt',
        intro: [p('En ny kursbestilling har blitt sendt inn via nettsiden.')],
        note: [p(b('Husk:'), ' Ta kontakt med kunden for å bekrefte kurset og avklare detaljer.')],
        footer: [p('Denne e-posten ble automatisk generert fra kursbestillingsskjemaet på trams.no')],
    },

    emailWebsiteFeedback: {
        subject: 'Tilbakemelding på nettsiden',
        heading: 'TrAMS – tilbakemelding på nettsiden',
    },
}
