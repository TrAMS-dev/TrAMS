/**
 * One-off migration: copies text that used to be hardcoded in the frontend into Sanity.
 *
 * Run with your Sanity login (needs write access):
 *   npx sanity exec scripts/seed-sanity-content.ts --with-user-token
 *
 * Only creates documents/fields that are missing, so it is safe to run more than once
 * and never overwrites edits made in the Studio.
 *
 * Add DRY_RUN=1 to print what would be written without changing anything.
 *
 * Add DELETE_UNUSED=1 to also delete documents whose schema types were removed
 * (firstAidInfo, instruktorer, membershipSignupUrl, carouselSlide):
 *   DELETE_UNUSED=1 npx sanity exec scripts/seed-sanity-content.ts --with-user-token
 */
import { randomUUID } from 'node:crypto'
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2024-01-01' })

// ---------- Portable Text helpers ----------

type Part = string | { text: string; href?: string; strong?: boolean }

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

/** One paragraph. Parts can be plain strings, links ({ text, href }) or bold text ({ text, strong }). */
function p(...parts: Part[]) {
    const markDefs: { _key: string; _type: 'link'; href: string }[] = []
    const children = parts.map((part) => {
        if (typeof part === 'string') {
            return { _key: key(), _type: 'span', marks: [], text: part }
        }
        const marks: string[] = []
        if (part.strong) marks.push('strong')
        if (part.href) {
            const linkKey = key()
            markDefs.push({ _key: linkKey, _type: 'link', href: part.href })
            marks.push(linkKey)
        }
        return { _key: key(), _type: 'span', marks, text: part.text }
    })
    return { _key: key(), _type: 'block', style: 'normal', markDefs, children }
}

const mail = (address: string) => ({ text: address, href: `mailto:${address}` })

// ---------- Content (copied from the old hardcoded pages) ----------

const FALLBACK_MEMBERSHIP_SIGNUP_URL = 'https://forms.gle/GDLsAZTeVvTKmCqw9'

const homePageFields = {
    tagline: 'Vi er Trondheim Akuttmedisinske Studentforening.\nLær livreddende førstehjelp av medisinstudenter.',
}

const forMedisinstudenterTexts = {
    membershipText: [
        p(
            'TrAMS er studentforeningen for medisinstudenter ved NTNU som er interesserte i akuttmedisin! Som medlem kan du blant annet delta på TrAMS-arrangementer forbeholdt medlemmer, du får gratis ferdighetskurs og muligheten til å delta på vår generalforsamling. Du kan også engasjere deg ytterligere i foreningen ved å bli instruktør eller bli med i foreningens komiteer.'
        ),
        p(
            'TrAMS-medlemskapet er et livstidsmedlemskap med kontingent på 250 kr. For å bli medlem må du være medisinstudent ved NTNU, tidligere medisinstudent ved NTNU, eller lege ved St. Olavs Hospital.'
        ),
        p(
            'Ønsker du å engasjere deg i akuttmedisin, lære nye ferdigheter og bli en del av et engasjert studentmiljø? ',
            { text: 'Bli medlem i dag ved å klikke på knappen!', strong: true }
        ),
    ],
    offersText: [
        p(
            'TrAMS arrangerer en rekke kurs, foredrag, skillskvelder og annet moro i løpet av et semester. Klikk deg inn under for å lese mer om de ulike tilbudene. Noen tilbud er åpne for alle medisinstudenter, mens andre er kun for medlemmer. I tillegg kan du som medlem søke om å bli instruktør i TrAMS eller bli med i en av komiteene våre!'
        ),
    ],
    committeesText: [
        p(
            'Er du interessert i å fordype deg innenfor TrAMS? Som medlem i en av TrAMS sine komitéer kan du bli med å utvikle caser, nye kurs, eller innhold til skillskvelder. Som komitémedlem får involvere deg masse i TrAMS og du vil få lære mye om både fag og organisering. Det skal være gøy å være med i en komité og derfor legger man opp aktiviteten etter hva komiteen selv ønsker. Klikk inn på hver komité under for å lese mer om dem!'
        ),
        p(
            'Har du spørsmål om TrAMS sine komitéer, eller en idé om å stifte en ny komité? Ta kontakt med ',
            mail('komiteansvarlig@trams.no'),
            ' eller kontakt komitéen direkte.'
        ),
    ],
}

const instruktorPage = {
    _id: 'instruktorPage',
    _type: 'instruktorPage',
    becomeInstructorText: [
        p(
            'Som instruktør får du muligheten til å lære bort akuttmedisin på både eksterne og interne kurs. I tillegg blir man prioritert på noen av TrAMS sine antallsbegrensede arrangementer. Som instruktør får man ta del i et sosialt og hyggelig instruktørmiljø!'
        ),
        p(
            'For å kunne søke om å bli instruktør må du være ',
            { text: 'medlem', href: '/for-medisinstudenter' },
            ' i TrAMS. Opptaket er søknadsbasert. Likevel kan engasjement i foreningen utover det som fremgår av søknaden, tas i betraktning.'
        ),
        p('TrAMS tar opp nye eksterne instruktører høsten 2025.'),
        p('Eventuelle spørsmål sendes til ', mail('instruktoransvarlig@trams.no'), '.'),
    ],
    skillInstructorText: [
        p(
            'Gjennom året utdanner TrAMS instruktører som holder kurs for andre medisinstudenter i perifer venekanylering (PVK), sutur og ultralyd, blant annet. På eldre kull vil man også få muligheten til å være instruktør på akuttmedisinkursene TrAMS arrangerer på studiet i samarbeid med NTNU og St. Olavs hospital.'
        ),
        p('De gangene vi tar opp instruktører til internundervisning vil det komme informasjon om dette på mail.'),
    ],
}

const aboutPage = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    aboutText: [
        p(
            'Trondheim akuttmedisinske studentforening (TrAMS), stiftet 7. mai 2009, er en ideell organisasjon av og for medisinstudenter i Trondheim, basert på frivillighet.'
        ),
        p(
            'Vi legger vekt på faglig kompetanse innen akuttmedisin for både kommende leger og lekfolk. Vårt mål er å skape trygghet rundt håndtering av akuttmedisinske situasjoner ved å fremme interesse, engasjement og styrke kunnskapen gjennom kvalitetssikrede kurs og ferdighetstrening.'
        ),
        p(
            'Foreningen deltar aktivt i det norske og skandinaviske studentmiljøet innen akuttmedisin gjennom NAMS - Norsk Akuttmedisinsk Studentforum.'
        ),
    ],
    partnerCtaTitle: 'Bli med på laget som samarbeidspartner',
    partnerCtaText: [
        p(
            'Vi er alltid på jakt etter støtte eller nye samarbeidspartnere. Kjenner du noen som er interessert i å bli bedre kjent med oss?'
        ),
        p(
            'I Trondheim har foreningen en solid plassering i studentmiljøet. Vi samarbeider tett med Fakultet for medisin og helsevitenskap ved NTNU om å gjennomføre kurs for nye studenter i basal akuttmedisin. I tillegg samarbeider vi med bl.a. anestesiavdelingen ved St. Olavs hospital om å tilby det som på studiet kalles frivillig uketjeneste, en lærerik hospiteringsordning. Leger ved luftambulansen i Trondheim har også stilt opp for å holde foredrag o.l. for studenter ved flere anledninger. Vi har gjennomført arrangementer der vi har koordinert øvelser sammen med Redningstjenesten 330 skvadron, Redningsselskapet, Trøndelag brann- og redningstjeneste, Trøndelag politidistrikt. Sist, men ikke minst, har Sør-Trøndelag ambulansetjeneste vært en kjempemessig støttespiller for oss.'
        ),
        p(
            'Vi ønsker å takke alle som bidrar til å hjelpe oss i arbeidet for å fremme interesse og kunnskap rundt akuttmedisin! Ønsker du å støtte arbeidet vårt? Ta kontakt med ',
            mail('sponsoransvarlig@trams.no'),
            '.'
        ),
    ],
}

const firstAidCoursePageFields = {
    otherCoursesText: [
        p('Vi tilbyr også andre kurs som er tilpasset studenter eller kunder med helsefaglig bakgrunn.'),
        p(
            'Lurer du på om vi kan tilby et passende kurs for din gruppe? Ta kontakt med ',
            mail('eksternsjef@trams.no'),
            ' for å motta tilbud.'
        ),
        p('Vi tilbyr dessverre ikke utlån av dukker og førstehjelpsutstyr til egne kurs.'),
    ],
    evaluationText: [
        p(
            'Vi ønsker stadig å bli bedre, og for å nå målene våre tar vi gjerne i mot tilbakemeldinger på hvordan du har opplevd kurset vårt!'
        ),
        p(
            'Du kan enkelt gi tilbakemelding ved å klikke deg inn på skjemaet. Øvrige spørsmål kan rettes til ',
            mail('eksternsjef@trams.no'),
            '.'
        ),
    ],
    evaluationFormUrl:
        'https://docs.google.com/forms/d/e/1FAIpQLSd11lYE-qow-milodSmnsL_OlqLE20vV8ZNGyLkg-F-cdJVtA/viewform?usp=sharing',
}

const siteSettings = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    address: 'Fred Kavli-bygget, 1. et ved varemottak\nSt. Olavs Hospital, 7491 Trondheim',
    orgNumber: '994089358',
    contactEmail: 'ekstern@trams.no',
    instagramUrl: 'https://www.instagram.com/trondheimams/',
    facebookUrl: 'https://www.facebook.com/trondheimams/',
    githubUrl: 'https://github.com/trondheimams',
}

const boardRoles: { role: string; title: string; description: ReturnType<typeof p>[] }[] = [
    {
        role: 'boardLeader',
        title: 'Leder',
        description: [
            p(
                'Som leder må man ta ansvar for alt, selvom man ikke har anledning til å involvere seg i like mye samtidig. Derfor må man få en god nok oversikt over foreningen til at man kan veilede og være tilgjengelig når det blir behov. Ledelse av frivillige i en fagspesifikk interesseforening kan være utfordrende, men veldig lærerikt.'
            ),
            p(
                'Det er viktig å se etter muligheter for å holde motivasjonen oppe, og fasilitere gode gruppeprosesser som bidrar til felles tilhørighet, trygghet og retning.'
            ),
        ],
    },
    {
        role: 'subjectLeader',
        title: 'Fagansvarlig',
        description: [
            p(
                'Fagansvarlig i TrAMS er foreningens fungerende nestleder og skal fungere som et bindeledd mot fagmiljøer og samarbeidspartnere. Dette inkluderer mentorgruppen til TrAMS som er en samling avdankede styremedlemmer. Fagansvarlig har også en sentral rolle i kvalitetssikring av foreningens aktiviteter og kontaktperson for spørsmål vedrørende HMS.'
            ),
        ],
    },
    {
        role: 'internalLeader',
        title: 'Internsjef',
        description: [
            p(
                'Internsjef har det overordnede ansvaret for det interne arbeidet TrAMS driver med. Dette betyr å drifte kursene vi arrangerer for medisinstudenter, samt å utvikle nye kurs.'
            ),
        ],
    },
    {
        role: 'externalLeader',
        title: 'Eksternsjef',
        description: [
            p(
                'Som eksternsjef har man ansvaret for at foreningens eksternaktiviteter gjennomføres iht. vedtekter og gjeldende avtaler. Med stillingen følger også et mellomleder-ansvar som krever at man tar aktiv del i oppfølgingen av spesielt eksternkoordinator, men også instruktør- markedsførings- og utstyrsansvarlig.'
            ),
        ],
    },
    {
        role: 'internalCoordinator',
        title: 'Internkoordinator',
        description: [
            p(
                'Internkoordinator har som oppgave, i tett samarbeid med internsjef, å drifte interne oppgaver i foreningen. Dette innebærer planlegging og gjennomføring av kurs og ferdighetstrening for medisinstudenter.'
            ),
        ],
    },
    {
        role: 'externalCoordinator',
        title: 'Eksternkoordinator',
        description: [
            p(
                'Eksternkoordinator bistår eksternsjef og instruktøransvarlig med å organisere og informere om kurs eksternt. Har også ansvar for å arrangere eksterne HLR-dager med hjerte-lunge-redning til lekfolk.'
            ),
        ],
    },
    {
        role: 'committeeLeader',
        title: 'Komiteansvarlig',
        description: [
            p(
                'Foreningens komitéansvarlig har et koordinerende ansvar for foreningens komiteer og er komiteenes kontaktperson i styret. Komitéansvarlig skal sikre kvalitet og kontinuitet i oppstart og drift av komitéer i TrAMS. Komitéansvarlig har også ansvaret for å holde møter med komiteene hvert semester.'
            ),
        ],
    },
    {
        role: 'instructorLeader',
        title: 'Instruktøransvarlig',
        description: [
            p(
                'Som instruktøransvarlig har man ansvaret for at instruktørene får den oppfølgingen, erfaringen, læringen og samholdet som trengs for å kunne gi best mulig kursing og best mulig instruktørmiljø. I en organisasjon som TrAMS er det viktig med faglig påfyll, samt godt samhold, derfor er jeg også med på å planlegge arrangement som for eksempel hytteturer og instruktørkvelder.'
            ),
        ],
    },
    {
        role: 'financialLeader',
        title: 'Økonomiansvarlig',
        description: [
            p(
                'Som økonomisjef sørger man for at instruktørene våre får lønn, og for at TrAMS tjener nok til å drive foreningen videre.'
            ),
        ],
    },
    {
        role: 'marketingLeader',
        title: 'Markedsføringsansvarlig',
        description: [
            p(
                'Markedsføringsansvarlig har som oppgave å fremme interesse og profilere foreningens aktiviteter både eksternt og internt. I tillegg vil markedsføringsansvarlig ha en sentral rolle i å nå ut og reklamere for aktuelle kurs vi tilbyr.'
            ),
        ],
    },
    {
        role: 'extraLeader',
        title: 'Markøransvarlig',
        description: [
            p(
                'Som markøransvarlig har man ansvar for markørene i TrAMS. Det innebærer å rekruttere og ivareta markører på både interne og eksterne arrangementer og kurs.'
            ),
        ],
    },
    {
        role: 'sponsorLeader',
        title: 'Sponsoransvarlig',
        description: [
            p(
                'Foreningens sponsoransvarlig har ansvarsområde å arbeide med å tilegne foreningen økonomiske goder gjennom å søke stipend, fond og legat, eller gjennom samarbeid med andre aktører som er interessert i å hjelpe foreningen.'
            ),
        ],
    },
    {
        role: 'equipmentLeader',
        title: 'Utstyrsansvarlig',
        description: [
            p(
                'Jobben som utstyrsansvarlig er å holde styr på alt utstyret TrAMS disponerer og sørge for at det i orden til vi holder kurs. I tillegg så bidrar man der det ellers er behov. Gjennom vervet får man et innblikk i mye kule gadgets innenfor akuttmedisinen og en praktisk håndtering av disse.'
            ),
        ],
    },
    {
        role: 'secretary',
        title: 'Sekretær',
        description: [
            p(
                'Sekretær har det overordnede ansvaret for foreningens digitale ressurser. Dette innebærer organisering av dokumenter, samt utforming av nye maler, kursbevis og attester. I tillegg kommuniserer sekretær med eksterne og interne aktører som henvender seg til foreningen. Sekretæren fører referat fra styremøter og administrerer denne nettsiden. Assisterer også resten av styret når det er behov for det.'
            ),
        ],
    },
    {
        role: 'mentorLeader',
        title: 'Mentorgruppen',
        description: [
            p(
                'Mentorgruppen er en ressursgruppe bestående av tidligere styremedlemmer som fortsatt vil bidra til å gjøre TrAMS bedre. De har jevnlige møter og bidrar dessuten som støtte til styret og komitéer både organisatorisk og faglig.'
            ),
        ],
    },
]

const UNUSED_TYPES = ['firstAidInfo', 'instruktorer', 'membershipSignupUrl', 'carouselSlide']

// ---------- Run ----------

async function main() {
    const { projectId, dataset } = client.config()
    console.log(`Seeding ${projectId}/${dataset}`)

    const existing = await client.fetch<{
        homePageId: string | null
        firstAidCoursePageId: string | null
        oldMembershipUrl: string | null
        existingRoles: string[]
    }>(`{
        "homePageId": *[_type == "homePage" && !(_id in path("drafts.**"))][0]._id,
        "firstAidCoursePageId": *[_type == "firstAidCoursePage" && !(_id in path("drafts.**"))][0]._id,
        "oldMembershipUrl": *[_type == "membershipSignupUrl"][0].membershipSignupUrl,
        "existingRoles": *[_type == "boardRole"].role
    }`)

    const tx = client.transaction()

    tx.createIfNotExists(siteSettings)
    tx.createIfNotExists(aboutPage)
    tx.createIfNotExists(instruktorPage)
    tx.createIfNotExists({
        _id: 'forMedisinstudenterPage',
        _type: 'forMedisinstudenterPage',
        membershipSignupUrl: existing.oldMembershipUrl || FALLBACK_MEMBERSHIP_SIGNUP_URL,
        ...forMedisinstudenterTexts,
    })

    if (existing.homePageId) {
        tx.patch(existing.homePageId, (patch) => patch.setIfMissing(homePageFields))
    } else {
        console.warn('No homePage document found, skipping tagline')
    }

    if (existing.firstAidCoursePageId) {
        tx.patch(existing.firstAidCoursePageId, (patch) => patch.setIfMissing(firstAidCoursePageFields))
    } else {
        console.warn('No firstAidCoursePage document found, skipping info cards')
    }

    for (const boardRole of boardRoles) {
        if (existing.existingRoles.includes(boardRole.role)) continue
        tx.createIfNotExists({ _id: `boardRole-${boardRole.role}`, _type: 'boardRole', ...boardRole })
    }

    if (process.env.DRY_RUN === '1') {
        console.log(JSON.stringify(tx.serialize(), null, 2))
        const unused = await client.fetch<string[]>(`*[_type in $types]._id`, { types: UNUSED_TYPES })
        console.log(`Dry run, nothing written. Unused documents that DELETE_UNUSED=1 would delete: ${unused.join(', ') || 'none'}`)
        return
    }

    const result = await tx.commit()
    console.log(`Done: ${result.results.length} document(s) created or updated`)

    if (process.env.DELETE_UNUSED === '1') {
        const ids = await client.fetch<string[]>(`*[_type in $types]._id`, { types: UNUSED_TYPES })
        if (ids.length === 0) {
            console.log('No unused documents to delete')
            return
        }
        const deleteTx = client.transaction()
        ids.forEach((id) => deleteTx.delete(id))
        await deleteTx.commit()
        console.log(`Deleted unused documents: ${ids.join(', ')}`)
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
