import { defineField, defineType, type Rule, type UrlRule } from 'sanity'
import { EMAIL_DEFAULTS, type EmailDocType } from '../../lib/email/defaults'

/**
 * Ett dokument per e-post som nettsiden sender. Teksten hentes når e-posten sendes,
 * så endringer gjelder fra neste utsending etter at dokumentet er publisert.
 * Standardtekstene ligger i lib/email/defaults.ts.
 */

const TOKEN_HELP: Record<string, string> = {
    navn: 'mottakerens navn',
    tittel: 'arrangementets tittel',
    dato: 'dato og klokkeslett for arrangementet',
    sted: 'stedet for arrangementet',
    arrangement: 'tittel, dato og sted, med tittel og sted i fet skrift',
    lenke: 'lenke til arrangementssiden',
    kontakt: 'e-postadressen man kan kontakte, som lenke',
    plass: 'plassen i ventelisten. Avsnittet utelates hvis plassen er ukjent',
    tilbakemelding: 'teksten og knappen for tilbakemeldingsskjemaet (eget avsnitt). Utelates hvis arrangementet ikke har tilbakemeldingsspørsmål',
    kursbevis: 'teksten og knappen for kursbeviset (eget avsnitt). Utelates hvis arrangementet ikke sender kursbevis',
    innloggingslenke: 'lenke til innloggingssiden',
    kurs: 'kurset som er bestilt',
}

const EVENT_TOKENS = ['navn', 'tittel', 'dato', 'sted', 'arrangement', 'lenke', 'kontakt']

function placeholderHelp(tokens: string[] | undefined): string {
    if (!tokens?.length) return 'Ingen plassholdere.'
    return `Plassholdere: ${tokens.map((t) => `{${t}} = ${TOKEN_HELP[t] ?? t}`).join('; ')}.`
}

const blockContent = {
    type: 'array' as const,
    of: [
        {
            type: 'block' as const,
            styles: [{ title: 'Normal', value: 'normal' }],
            lists: [
                { title: 'Punktliste', value: 'bullet' },
                { title: 'Nummerert liste', value: 'number' },
            ],
            marks: {
                decorators: [
                    { title: 'Fet', value: 'strong' },
                    { title: 'Kursiv', value: 'em' },
                ],
                annotations: [
                    {
                        name: 'link',
                        type: 'object',
                        title: 'Lenke',
                        fields: [
                            {
                                name: 'href',
                                type: 'url',
                                title: 'Adresse',
                                validation: (rule: UrlRule) => rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                            },
                        ],
                    },
                ],
            },
        },
    ],
}

interface FieldSpec {
    name: string
    title: string
    kind: 'string' | 'text'
    description?: string
    tokens?: string[]
}

interface EmailSpec {
    name: Exclude<EmailDocType, 'emailSettings'>
    title: string
    sentWhen: string
    fields: FieldSpec[]
}

const subject = (tokens: string[] = ['tittel']): FieldSpec => ({ name: 'subject', title: 'Emne', kind: 'string', tokens })
const body = (tokens: string[] = EVENT_TOKENS, title = 'Tekst'): FieldSpec => ({ name: 'body', title, kind: 'text', tokens })

const EMAILS: EmailSpec[] = [
    {
        name: 'emailSignupConfirmed',
        title: 'Påmelding – fått plass',
        sentWhen: 'Sendes til deltakeren når hen melder seg på og får plass.',
        fields: [subject(), body()],
    },
    {
        name: 'emailSignupWaitlist',
        title: 'Påmelding – venteliste',
        sentWhen: 'Sendes til deltakeren når hen melder seg på et fullt arrangement og havner på venteliste.',
        fields: [subject(), body([...EVENT_TOKENS, 'plass'])],
    },
    {
        name: 'emailWaitlistPromoted',
        title: 'Flyttet opp fra venteliste',
        sentWhen: 'Sendes når en admin flytter en deltaker fra venteliste til bekreftet plass.',
        fields: [subject(), body()],
    },
    {
        name: 'emailMovedToWaitlist',
        title: 'Flyttet til venteliste',
        sentWhen: 'Sendes når en admin flytter en deltaker fra bekreftet plass til venteliste.',
        fields: [subject(), body([...EVENT_TOKENS, 'plass'])],
    },
    {
        name: 'emailParticipantRemoved',
        title: 'Fjernet fra påmelding',
        sentWhen: 'Sendes når en admin fjerner en deltaker fra et arrangement.',
        fields: [
            subject(),
            body(EVENT_TOKENS, 'Tekst (deltakeren hadde plass)'),
            { name: 'bodyWaitlist', title: 'Tekst (deltakeren sto på venteliste)', kind: 'text', tokens: EVENT_TOKENS },
        ],
    },
    {
        name: 'emailEventReminder',
        title: 'Påminnelse før arrangement',
        sentWhen: 'Sendes automatisk til alle med bekreftet plass to dager før arrangementet.',
        fields: [subject(), body()],
    },
    {
        name: 'emailEventFollowup',
        title: 'Etter arrangementet',
        sentWhen:
            'Sendes til deltakere som er markert «Møtt», med lenke til tilbakemeldingsskjema og/eller kursbevis. La {tilbakemelding} og {kursbevis} stå som egne avsnitt der knappene skal være.',
        fields: [
            subject(),
            body([...EVENT_TOKENS, 'tilbakemelding', 'kursbevis']),
            { name: 'feedbackText', title: 'Tekst over tilbakemeldingsknappen', kind: 'text', tokens: EVENT_TOKENS },
            { name: 'feedbackButton', title: 'Tilbakemeldingsknapp', kind: 'string' },
            { name: 'certificateText', title: 'Tekst over kursbevisknappen', kind: 'text', tokens: EVENT_TOKENS },
            { name: 'certificateButton', title: 'Kursbevisknapp', kind: 'string' },
        ],
    },
    {
        name: 'emailUserApproved',
        title: 'Konto godkjent',
        sentWhen: 'Sendes til en bruker når en admin godkjenner kontoen.',
        fields: [subject(['navn']), body(['navn', 'innloggingslenke'])],
    },
    {
        name: 'emailNewUser',
        title: 'Ny brukerregistrering (til TrAMS)',
        sentWhen: 'Sendes til web@trams.no når noen registrerer en konto. Navn og e-post legges til under teksten.',
        fields: [
            subject(['navn']),
            { name: 'heading', title: 'Overskrift', kind: 'string' },
            { name: 'intro', title: 'Tekst', kind: 'text' },
        ],
    },
    {
        name: 'emailBookingCustomer',
        title: 'Kursbestilling – bekreftelse til kunden',
        sentWhen: 'Sendes til kontaktpersonen når kursbestillingsskjemaet sendes inn. Oppsummeringen av bestillingen legges inn mellom de to tekstene.',
        fields: [
            subject(['navn', 'kurs']),
            { name: 'heading', title: 'Overskrift (rød topp)', kind: 'string' },
            { name: 'title', title: 'Tittel', kind: 'string' },
            { name: 'intro', title: 'Tekst før oppsummeringen', kind: 'text', tokens: ['navn', 'kurs', 'kontakt'] },
            { name: 'summaryHeading', title: 'Overskrift på oppsummeringen', kind: 'string' },
            { name: 'outro', title: 'Tekst etter oppsummeringen', kind: 'text', tokens: ['navn', 'kurs', 'kontakt'] },
            { name: 'footer', title: 'Bunntekst', kind: 'text' },
        ],
    },
    {
        name: 'emailBookingAdmin',
        title: 'Kursbestilling – varsel til TrAMS',
        sentWhen: 'Sendes til ekstern@trams.no (eller levanger@trams.no) når kursbestillingsskjemaet sendes inn. Alle detaljene fra skjemaet legges inn mellom teksten og påminnelsen.',
        fields: [
            subject(['kurs', 'navn']),
            { name: 'heading', title: 'Overskrift (rød topp)', kind: 'string' },
            { name: 'intro', title: 'Tekst', kind: 'text' },
            { name: 'note', title: 'Påminnelse (gul boks)', kind: 'text' },
            { name: 'footer', title: 'Bunntekst', kind: 'text' },
        ],
    },
    {
        name: 'emailWebsiteFeedback',
        title: 'Tilbakemelding på nettsiden (til TrAMS)',
        sentWhen: 'Sendes til web@trams.no når noen sender tilbakemelding fra bunnen av nettsiden. Meldingen, siden og avsenderen legges inn under overskriften.',
        fields: [subject([]), { name: 'heading', title: 'Overskrift (rød topp)', kind: 'string' }],
    },
]

function toField(email: EmailSpec | null, docName: EmailDocType, spec: FieldSpec, index: number) {
    const defaults = EMAIL_DEFAULTS[docName] as unknown as Record<string, unknown>
    const help = spec.tokens ? placeholderHelp(spec.tokens) : undefined
    const description = [index === 0 && email ? email.sentWhen : null, spec.description, help].filter(Boolean).join(' ')

    return defineField({
        name: spec.name,
        title: spec.title,
        description: description || undefined,
        ...(spec.kind === 'string' ? { type: 'string' } : blockContent),
        initialValue: defaults[spec.name],
        validation: (rule: Rule) => rule.required(),
    } as Parameters<typeof defineField>[0])
}

export const emailSettingsType = defineType({
    name: 'emailSettings',
    title: 'Felles for alle e-poster',
    type: 'document',
    fields: [
        toField(null, 'emailSettings', {
            name: 'signOff',
            title: 'Hilsen nederst',
            kind: 'text',
            description: 'Brukes i e-postene om arrangementer og i «Konto godkjent». Bruk Shift+Enter for linjeskift.',
        }, 0),
        toField(null, 'emailSettings', {
            name: 'buttonFallbackText',
            title: 'Tekst under knapper',
            kind: 'string',
            description: 'Vises under knappene i «Etter arrangementet», etterfulgt av lenken.',
        }, 1),
    ],
    preview: { prepare: () => ({ title: 'Felles for alle e-poster' }) },
})

export const emailTypes = EMAILS.map((email) =>
    defineType({
        name: email.name,
        title: email.title,
        type: 'document',
        fields: email.fields.map((field, i) => toField(email, email.name, field, i)),
        preview: { prepare: () => ({ title: email.title }) },
    })
)

/** Rekkefølgen e-postene vises i under «E-poster» i Studio. */
export const EMAIL_TYPE_NAMES = ['emailSettings', ...EMAILS.map((e) => e.name)]
