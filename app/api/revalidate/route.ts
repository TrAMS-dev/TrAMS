import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Sanity webhook secret - add this to your environment variables
const secret = process.env.SANITY_REVALIDATE_SECRET

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the webhook body
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, secret)

    // If a secret is configured, validate the signature
    if (secret && !isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad Request: Missing _type', { status: 400 })
    }

    // Log the revalidation request
    console.log(`Revalidating content type: ${body._type}`)

    // Revalidate based on document type
    switch (body._type) {
      case 'boardMember':
      case 'boardRole':
        revalidatePath('/om-oss')
        revalidatePath('/om-oss/styret/[role]', 'page')
        revalidatePath('/om-oss/styret/tidligere-styrer', 'layout')
        break

      case 'homePage':
        revalidatePath('/')
        break

      case 'aboutPage':
        revalidatePath('/om-oss')
        break

      case 'mediaItem':
        revalidatePath('/om-oss/trams-i-media')
        break

      case 'courseOffering':
        revalidatePath('/for-medisinstudenter')
        break

      case 'committee':
        revalidatePath('/for-medisinstudenter')
        if (body.slug?.current) {
          revalidatePath(`/for-medisinstudenter/${body.slug.current}`)
        }
        break

      case 'vedtekter':
        revalidatePath('/om-oss/vedtekter')
        break

      case 'instruktorLink':
      case 'instruktorPage':
        revalidatePath('/instruktorer')
        break

      case 'akuttCalling':
        revalidatePath('/for-medisinstudenter/akuttcalling')
        break

      case 'markorPage':
        revalidatePath('/for-medisinstudenter/markorer')
        break

      case 'cooperationPartners':
        revalidatePath('/om-oss')
        break

      case 'firstAidCoursePage':
        revalidatePath('/forstehjelpskurs')
        break

      case 'bookKursPage':
        revalidatePath('/forstehjelpskurs/book-kurs')
        break

      case 'forMedisinstudenterPage':
        revalidatePath('/for-medisinstudenter')
        revalidatePath('/arrangementer/[slug]', 'page')
        break

      case 'siteSettings':
        // Footer is on every page
        revalidatePath('/', 'layout')
        break

      default:
        // For any unknown types, revalidate the whole site
        revalidatePath('/', 'layout')
        break
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      body
    })
  } catch (err) {
    console.error('Error revalidating:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
