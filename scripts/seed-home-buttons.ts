/**
 * Fills the "Knapper" list on Forsiden with the three buttons the front page shows today,
 * keeping any text saved in the old card fields, so editors start from what is live.
 *
 * Run with your Sanity login (needs write access):
 *   npx sanity exec scripts/seed-home-buttons.ts --with-user-token
 *
 * Does nothing if the list already has buttons, so it is safe to run more than once.
 * Add DRY_RUN=1 to print what would be written without changing anything.
 */
import { randomUUID } from 'node:crypto'
import { getCliClient } from 'sanity/cli'
import { HOME_BUTTON_DEFAULTS } from '../sanity/lib/homeButtons'

type Card = { title?: string; subtitle?: string } | undefined
type HomePage = { _id: string; buttons?: unknown[]; aboutCard?: Card; bookCard?: Card; studentsCard?: Card }

const client = getCliClient({ apiVersion: '2024-01-01' })
const dryRun = process.env.DRY_RUN === '1'

const docs = await client.fetch<HomePage[]>(
  '*[_type == "homePage"]{ _id, buttons, aboutCard, bookCard, studentsCard }'
)
if (docs.length === 0) {
  console.log('No homePage document found; nothing to do.')
  process.exit(0)
}

const tx = client.transaction()
let changes = 0
for (const doc of docs) {
  if (doc.buttons?.length) {
    console.log(`ok      ${doc._id}: already has ${doc.buttons.length} button(s)`)
    continue
  }
  const legacy = [doc.aboutCard, doc.bookCard, doc.studentsCard]
  const buttons = HOME_BUTTON_DEFAULTS.map((button, i) => ({
    _key: randomUUID().slice(0, 12),
    _type: 'homeButton',
    title: legacy[i]?.title?.trim() || button.title,
    subtitle: legacy[i]?.subtitle?.trim() || button.subtitle,
    link: button.link,
    icon: button.icon,
    highlighted: button.highlighted ?? false,
  }))
  console.log(`fill    ${doc._id}: ${buttons.map((b) => `${b.title} → ${b.link}`).join(', ')}`)
  tx.patch(doc._id, (patch) => patch.set({ buttons }))
  changes++
}

if (dryRun || changes === 0) {
  console.log(dryRun ? '\nDRY_RUN=1: nothing written.' : '\nNothing to write.')
} else {
  const result = await tx.commit()
  console.log(`\nDone: ${result.results.length} document(s) written.`)
}
