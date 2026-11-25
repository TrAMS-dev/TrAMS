/**
 * Creates every e-mail document in Sanity with the default text from lib/email/defaults.ts.
 *
 * Run with your Sanity login (needs write access):
 *   npx sanity exec scripts/seed-email-templates.ts --with-user-token
 *
 * Missing documents are created and empty fields on existing ones are filled in.
 * Text already saved in Studio is never overwritten, so it is safe to run more than once.
 *
 * Add DRY_RUN=1 to print what would be written without changing anything.
 */
import { getCliClient } from 'sanity/cli'
import { EMAIL_DEFAULTS, type EmailDocType } from '../lib/email/defaults'

const client = getCliClient({ apiVersion: '2024-01-01' })
const dryRun = process.env.DRY_RUN === '1'

const types = Object.keys(EMAIL_DEFAULTS) as EmailDocType[]
const existing = await client.fetch<Record<string, unknown>[]>('*[_id in $ids]', { ids: types })
const byId = new Map(existing.map((doc) => [doc._id as string, doc]))

const tx = client.transaction()
for (const type of types) {
  const defaults = EMAIL_DEFAULTS[type] as unknown as Record<string, unknown>
  const doc = byId.get(type)
  if (!doc) {
    console.log(`create  ${type}`)
    tx.createIfNotExists({ _id: type, _type: type, ...defaults })
    continue
  }
  const missing = Object.keys(defaults).filter((field) => doc[field] === undefined || doc[field] === null)
  if (missing.length) {
    console.log(`fill    ${type}: ${missing.join(', ')}`)
    tx.patch(type, (patch) => patch.setIfMissing(Object.fromEntries(missing.map((field) => [field, defaults[field]]))))
  } else {
    console.log(`ok      ${type}`)
  }
}

if (dryRun) {
  console.log('\nDRY_RUN=1: nothing written.')
} else {
  const result = await tx.commit()
  console.log(`\nDone: ${result.results.length} document(s) written.`)
}
