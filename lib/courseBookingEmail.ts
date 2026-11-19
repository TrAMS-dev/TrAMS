import { getEmailContent } from '@/lib/email/content'
import { bannerShell, mailtoLink } from '@/lib/email/layout'
import { escapeHtml, renderEmailText, renderPlainText } from '@/lib/email/portableText'

export interface BookingData {
  kontaktpersonNavn: string;
  kontaktpersonEpost: string;
  kontaktpersonTelefon?: string;
  organisasjonsnummer: string;
  kursType: string;
  kursTypeAnnet?: string;
  deltakermasse?: string;
  antallDeltakere: string;
  datoType: 'spesifikk' | 'fleksibel';
  spesifikkDato?: string;
  spesifikkTid?: string;
  fraDato?: string;
  tilDato?: string;
  kursby: 'trondheim' | 'levanger';
  sted: string;
  adresse?: string;
  annet?: string;
  kursbevis: boolean;
  engelskKurs: boolean;
}

export interface BookingEmail {
  subject: string;
  html: string;
}

const P_STYLE = 'color:#555;line-height:1.6;';
const FOOTER_STYLE = 'color:#999;font-size:12px;';

/** Escaper en verdi fra skjemaet. Tomme verdier blir tom streng. */
const esc = (value: string | undefined | null) => escapeHtml(String(value ?? ''));

export function courseName(booking: BookingData): string {
  return (booking.kursType === 'Annet' ? booking.kursTypeAnnet : booking.kursType) ?? '';
}

function formatDateDisplay(booking: BookingData): string {
  if (booking.datoType === 'spesifikk') {
    return `${booking.spesifikkDato} kl. ${booking.spesifikkTid}`;
  }
  return `${booking.fraDato} - ${booking.tilDato}`;
}

function getDateLabel(booking: BookingData): string {
  return booking.datoType === 'spesifikk' ? 'Ønsket dato og tid:' : 'Ønsket periode:';
}

function getKursbyLabel(booking: BookingData): string {
  return booking.kursby === 'levanger' ? 'Levanger' : 'Trondheim';
}

function getKontaktEpost(booking: BookingData): string {
  return booking.kursby === 'levanger' ? 'levanger@trams.no' : 'ekstern@trams.no';
}

/** Rad i en tabell. `valueHtml` må allerede være escapet. */
function row(label: string, valueHtml: string, labelWidth?: string): string {
  const width = labelWidth ? ` width:${labelWidth};` : '';
  return `
            <tr>
              <td style="padding:8px 0;color:#666;font-weight:bold;${width}">${escapeHtml(label)}</td>
              <td style="padding:8px 0;color:#333;">${valueHtml}</td>
            </tr>`;
}

function card(heading: string, rows: string[]): string {
  return `
      <div style="background-color:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e0e0e0;">
        <h3 style="color:#c41e3a;margin-top:0;">${escapeHtml(heading)}</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>${rows.join('')}
          </tbody>
        </table>
      </div>`;
}

function bookingTokens(booking: BookingData) {
  return {
    navn: esc(booking.kontaktpersonNavn),
    kurs: esc(courseName(booking)),
    kontakt: mailtoLink(getKontaktEpost(booking)),
  };
}

/** Bekreftelse til kontaktpersonen, med tekst fra Sanity. */
export async function getCustomerConfirmationEmail(booking: BookingData): Promise<BookingEmail> {
  const { content } = await getEmailContent('emailBookingCustomer');
  const tokens = bookingTokens(booking);
  const stedTekst = booking.sted === 'helsehus' ? 'Øya Helsehus' : booking.adresse;

  const summary = card(content.summaryHeading, [
    row('Kurs:', esc(courseName(booking))),
    row('Antall deltakere:', esc(booking.antallDeltakere)),
    row(getDateLabel(booking), esc(formatDateDisplay(booking))),
    row('By:', getKursbyLabel(booking)),
    row('Sted:', esc(stedTekst)),
    row('Organisasjonsnummer:', esc(booking.organisasjonsnummer)),
    ...(booking.kursbevis ? [row('Kursbevis:', 'Ja')] : []),
    ...(booking.engelskKurs ? [row('Språk:', 'Engelsk')] : []),
  ]);

  const outro = renderEmailText(content.outro, { tokens, paragraphStyle: P_STYLE, trimFirstMargin: false });

  const inner = `<h2 style="color:#333;margin-top:0;">${escapeHtml(content.title)}</h2>
      ${renderEmailText(content.intro, { tokens, paragraphStyle: P_STYLE, trimFirstMargin: false })}
      ${summary}
      ${outro}`;

  return {
    subject: renderPlainText(content.subject, { navn: booking.kontaktpersonNavn, kurs: courseName(booking) }),
    html: bannerShell(content.heading, inner, {
      headingSize: 24,
      padding: 30,
      footerHtml: renderEmailText(content.footer, { tokens, paragraphStyle: FOOTER_STYLE }),
    }),
  };
}

/** Varsel til TrAMS med alle detaljene fra skjemaet, med tekst fra Sanity. */
export async function getAdminNotificationEmail(booking: BookingData): Promise<BookingEmail> {
  const { content } = await getEmailContent('emailBookingAdmin');
  const tokens = bookingTokens(booking);
  const stedTekst = booking.sted === 'helsehus' ? 'Øya Helsehus' : `Eget lokale: ${booking.adresse}`;
  const epost = esc(booking.kontaktpersonEpost);
  const telefon = esc(booking.kontaktpersonTelefon);

  const contact = card('Kontaktinformasjon', [
    row('Navn:', esc(booking.kontaktpersonNavn), '40%'),
    row('E-post:', `<a href="mailto:${epost}" style="color:#c41e3a;">${epost}</a>`),
    ...(booking.kontaktpersonTelefon
      ? [row('Telefon:', `<a href="tel:${telefon}" style="color:#c41e3a;">${telefon}</a>`)]
      : []),
    row('Organisasjonsnummer:', esc(booking.organisasjonsnummer)),
  ]);

  const course = card('Kursdetaljer', [
    row('Kurs:', esc(courseName(booking)), '40%'),
    row('Antall deltakere:', esc(booking.antallDeltakere)),
    ...(booking.deltakermasse ? [row('Deltakermasse:', esc(booking.deltakermasse))] : []),
  ]);

  const timePlace = card('Tid og sted', [
    row('Type:', booking.datoType === 'spesifikk' ? 'Spesifikk dato og tid' : 'Fleksibel periode', '40%'),
    row(getDateLabel(booking), esc(formatDateDisplay(booking)), '40%'),
    row('By:', getKursbyLabel(booking)),
    row('Sted:', esc(stedTekst)),
  ]);

  const extras = card('Tilleggsvalg', [
    row('Kursbevis ønsket:', booking.kursbevis ? 'Ja' : 'Nei', '40%'),
    row('Kurs på engelsk:', booking.engelskKurs ? 'Ja' : 'Nei'),
  ]);

  const comments = booking.annet
    ? `
      <div style="background-color:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e0e0e0;">
        <h3 style="color:#c41e3a;margin-top:0;">Andre kommentarer</h3>
        <p style="color:#333;margin:0;white-space:pre-wrap;">${esc(booking.annet)}</p>
      </div>`
    : '';

  const note = `
      <div style="background-color:#fff3cd;padding:15px;border-radius:8px;border:1px solid #ffc107;">
        ${renderEmailText(content.note, { tokens, paragraphStyle: 'color:#856404;margin:0;' })}
      </div>`;

  const inner = `${renderEmailText(content.intro, { tokens, paragraphStyle: P_STYLE, trimFirstMargin: false })}
      ${contact}${course}${timePlace}${extras}${comments}${note}`;

  return {
    subject: renderPlainText(content.subject, { navn: booking.kontaktpersonNavn, kurs: courseName(booking) }),
    html: bannerShell(content.heading, inner, {
      headingSize: 24,
      padding: 30,
      footerHtml: renderEmailText(content.footer, { tokens, paragraphStyle: FOOTER_STYLE }),
    }),
  };
}
