import type { EmailContentMap } from './defaults'
import { escapeHtml, renderEmailText } from './portableText'

export const P_STYLE = 'color:#555;line-height:1.6;'
export const SIGN_OFF_STYLE = 'color:#888;font-size:13px;line-height:1.5;'

function document(inner: string): string {
    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
    ${inner}
  </div>
</body>
</html>`
}

/** Enkel grå boks med hilsen nederst. Brukes av e-poster til deltakere og brukere. */
export function emailShell(inner: string, settings: EmailContentMap['emailSettings']): string {
    const signOff = renderEmailText(settings.signOff, {
        paragraphStyle: SIGN_OFF_STYLE,
        trimFirstMargin: false,
    }).replace(/^<p style="/, '<p style="margin-top:24px;')
    return document(`<div style="background-color:#f9f9f9;padding:24px;border-radius:8px;border:1px solid #e0e0e0;">
      ${inner}
      ${signOff}
    </div>`)
}

/** Boks med rød overskrift øverst og valgfri bunntekst. Brukes av kursbestillinger og varsler til TrAMS. */
export function bannerShell(heading: string, inner: string, options: { footerHtml?: string; headingSize?: number; padding?: number } = {}): string {
    const size = options.headingSize ?? 20
    const padding = options.padding ?? 24
    const footer = options.footerHtml
        ? `\n    <div style="text-align:center;padding:20px;color:#999;font-size:12px;">\n      ${options.footerHtml}\n    </div>`
        : ''
    return document(`<div style="background-color:#c41e3a;padding:20px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:${size}px;">${escapeHtml(heading)}</h1>
    </div>
    <div style="background-color:#f9f9f9;padding:${padding}px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
      ${inner}
    </div>${footer}`)
}

export function buttonLink(href: string, label: string, fallbackText: string): string {
    const safe = escapeHtml(href)
    return `<p style="margin:20px 0;"><a href="${safe}" style="display:inline-block;background-color:#c41e3a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:6px;">${escapeHtml(label)}</a></p>
<p style="color:#888;font-size:12px;line-height:1.5;margin-top:-8px;">${escapeHtml(fallbackText)} <a href="${safe}" style="color:#c41e3a;word-break:break-all;">${safe}</a></p>`
}

export function mailtoLink(address: string): string {
    const safe = escapeHtml(address)
    return `<a href="mailto:${safe}" style="color:#c41e3a;">${safe}</a>`
}

export function urlLink(url: string): string {
    const safe = escapeHtml(url)
    return `<a href="${safe}" style="color:#c41e3a;">${safe}</a>`
}
