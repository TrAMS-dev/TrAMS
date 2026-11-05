import { Fragment } from 'react'
import { Link } from '@chakra-ui/react'

/** Matches http(s):// URLs, www. URLs and e-mail addresses. */
const LINK_PATTERN =
    /(https?:\/\/[^\s<]+|www\.[^\s<]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

/** Punctuation that usually ends a sentence rather than belonging to the URL. */
const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"»]+$/

function toHref(match: string): string {
    if (match.includes('@') && !match.includes('/')) return `mailto:${match}`
    if (match.startsWith('www.')) return `https://${match}`
    return match
}

/** Renders plain text with URLs and e-mail addresses turned into clickable links. */
export function LinkifiedText({ text }: { text: string }) {
    const parts = text.split(LINK_PATTERN)

    return (
        <>
            {parts.map((part, i) => {
                // split() with a capture group puts matches at odd indices
                if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>

                const trailing = part.match(TRAILING_PUNCTUATION)?.[0] ?? ''
                const linkText = trailing ? part.slice(0, -trailing.length) : part
                const href = toHref(linkText)
                const isExternal = !href.startsWith('mailto:')

                return (
                    <Fragment key={i}>
                        <Link
                            href={href}
                            color="blue.600"
                            textDecoration="underline"
                            wordBreak="break-word"
                            {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                            {linkText}
                        </Link>
                        {trailing}
                    </Fragment>
                )
            })}
        </>
    )
}
