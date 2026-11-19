/**
 * Minimal Portable Text → e-post-HTML med plassholdere.
 *
 * Plassholdere skrives som {navn} i teksten fra Sanity:
 * - Innebygde plassholdere byttes ut med ferdig HTML (verdien må allerede være escapet).
 *   Er verdien `null`, utelates hele avsnittet (f.eks. «Du har plass nummer {plass}» uten kjent plass).
 * - Blokkplassholdere står alene i et avsnitt (f.eks. {tilbakemelding}) og erstatter hele avsnittet
 *   med en HTML-blokk. Tom streng utelater avsnittet.
 * Ukjente plassholdere blir stående som de er, så feilskrevne navn synes i e-posten.
 */

export interface PtSpan {
    _type: 'span'
    _key?: string
    text: string
    marks?: string[]
}

export interface PtBlock {
    _type: 'block'
    _key?: string
    style?: string
    listItem?: 'bullet' | 'number'
    level?: number
    children: PtSpan[]
    markDefs?: { _key: string; _type: string; href?: string }[]
}

export type EmailText = PtBlock[]

export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

const TOKEN_RE = /\{([\p{L}\d-]+)\}/gu
const SAFE_HREF_RE = /^(https?:|mailto:|tel:)/i

export const LINK_STYLE = 'color:#c41e3a;'

export interface RenderTextOptions {
    /** Innebygde plassholdere → HTML, eller null for å utelate avsnittet. */
    tokens?: Record<string, string | null>
    /** Plassholdere som erstatter et helt avsnitt → HTML (tom streng utelater det). */
    blockTokens?: Record<string, string>
    /** Inline-stil på <p>/<ul>. Første avsnitt får i tillegg margin-top:0. */
    paragraphStyle: string
    /** Sett til false for å beholde vanlig toppmarg på første avsnitt. */
    trimFirstMargin?: boolean
}

function renderSpan(span: PtSpan, markDefs: PtBlock['markDefs']): string {
    let html = escapeHtml(span.text ?? '').replace(/\n/g, '<br/>')
    for (const mark of span.marks ?? []) {
        if (mark === 'strong') html = `<strong>${html}</strong>`
        else if (mark === 'em') html = `<em>${html}</em>`
        else {
            const def = markDefs?.find((d) => d._key === mark)
            const href = def?.href?.trim()
            if (def?._type === 'link' && href && SAFE_HREF_RE.test(href)) {
                html = `<a href="${escapeHtml(href)}" style="${LINK_STYLE}">${html}</a>`
            }
        }
    }
    return html
}

function replaceTokens(html: string, tokens: Record<string, string | null>): string {
    // Fjerner mellomrommet foran en tom plassholder når den står rett før tegnsetting («Hei {navn}!» → «Hei!»)
    return html.replace(/( ?)\{([\p{L}\d-]+)\}(?=([!?.,:;])?)/gu, (match, space: string, name: string, punct?: string) => {
        if (!(name in tokens)) return match
        const value = tokens[name] ?? ''
        if (value === '' && punct) return ''
        return space + value
    })
}

function blockText(block: PtBlock): string {
    return (block.children ?? []).map((c) => c.text ?? '').join('')
}

/** Gjør om Portable Text fra Sanity til HTML for e-post. */
export function renderEmailText(blocks: EmailText | null | undefined, options: RenderTextOptions): string {
    const tokens = options.tokens ?? {}
    const blockTokens = options.blockTokens ?? {}
    const out: string[] = []
    let openList: 'ul' | 'ol' | null = null
    let first = options.trimFirstMargin !== false

    const style = () => {
        const s = first ? `${options.paragraphStyle}margin-top:0;` : options.paragraphStyle
        first = false
        return s
    }

    const closeList = () => {
        if (openList) out.push(`</${openList}>`)
        openList = null
    }

    for (const block of blocks ?? []) {
        if (block?._type !== 'block') continue
        const text = blockText(block).trim()
        if (!text) continue

        const soleToken = /^\{([\p{L}\d-]+)\}$/u.exec(text)?.[1]
        if (soleToken && soleToken in blockTokens) {
            closeList()
            if (blockTokens[soleToken]) {
                out.push(blockTokens[soleToken])
                first = false
            }
            continue
        }

        const usedTokens = [...text.matchAll(TOKEN_RE)].map((m) => m[1])
        if (usedTokens.some((t) => t in tokens && tokens[t] === null)) continue

        const inner = replaceTokens(
            (block.children ?? []).map((span) => renderSpan(span, block.markDefs)).join(''),
            tokens
        )

        if (block.listItem) {
            const tag = block.listItem === 'number' ? 'ol' : 'ul'
            if (openList !== tag) {
                closeList()
                out.push(`<${tag} style="${style()}padding-left:20px;">`)
                openList = tag
            }
            out.push(`<li>${inner}</li>`)
            continue
        }

        closeList()
        out.push(`<p style="${style()}">${inner}</p>`)
    }
    closeList()

    return out.join('\n')
}

/** Bytter ut plassholdere i en ren tekststreng (emnefelt). Verdiene settes inn som de er. */
export function renderPlainText(template: string, tokens: Record<string, string>): string {
    return template
        .replace(TOKEN_RE, (match, name: string) => (name in tokens ? tokens[name] : match))
        .replace(/\s+/g, ' ')
        .trim()
}
