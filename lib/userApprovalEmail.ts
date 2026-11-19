import { Resend } from 'resend'
import { getEmailContent } from '@/lib/email/content'
import { emailShell, urlLink, P_STYLE } from '@/lib/email/layout'
import { escapeHtml, renderEmailText, renderPlainText } from '@/lib/email/portableText'

const resend = new Resend(process.env.RESEND_API_KEY)

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no'

function loginUrl(): string {
    const base = SITE_ORIGIN.replace(/\/$/, '')
    return `${base}/admin/login`
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendUserApprovedEmail(params: {
    recipientEmail: string
    recipientName: string
}): Promise<void> {
    const to = params.recipientEmail.trim().toLowerCase()
    if (!to || to.length > 320 || !EMAIL_RE.test(to)) {
        console.error('sendUserApprovedEmail: invalid recipient')
        return
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn('sendUserApprovedEmail: RESEND_API_KEY missing, skipping')
        return
    }

    const { content, settings } = await getEmailContent('emailUserApproved')
    const name = params.recipientName.trim()
    const html = emailShell(
        renderEmailText(content.body, {
            tokens: { navn: escapeHtml(name), innloggingslenke: urlLink(loginUrl()) },
            paragraphStyle: P_STYLE,
        }),
        settings
    )

    const result = await resend.emails.send({
        from: 'TrAMS <web@trams.no>',
        to: [to],
        subject: renderPlainText(content.subject, { navn: name }),
        html,
    })

    if (result.error) {
        console.error('sendUserApprovedEmail: Resend error', result.error)
    }
}
